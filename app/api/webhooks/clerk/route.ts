/* eslint-disable camelcase */
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ correct import
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // Retrieve the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new NextResponse("WEBHOOK_SECRET is missing from environment", { status: 500 });
  }

  // Retrieve headers for Svix verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Check if the required headers are missing
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occurred -- missing Svix headers", { status: 400 });
  }

  // Parse the incoming request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance for signature verification
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature and handle errors
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook signature", { status: 400 });
  }

  // Get event data and type
  const { id } = evt.data;
  const eventType = evt.type;

  // Handle user creation event
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    if (!email_addresses || !username) {
      return new NextResponse("Required fields missing in payload", { status: 400 });
    }

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name || "",
      lastName: last_name || "",
      photo: image_url,
    };

    try {
      const newUser = await createUser(user);

      // Set public metadata for the newly created user
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      return NextResponse.json({ message: "OK", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return new NextResponse("Error creating user", { status: 500 });
    }
  }

  // Handle user update event
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name || "",
      lastName: last_name || "",
      username: username!,
      photo: image_url,
    };

    try {
      const updatedUser = await updateUser(id, user);
      return NextResponse.json({ message: "OK", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      return new NextResponse("Error updating user", { status: 500 });
    }
  }

  // Handle user deletion event
  if (eventType === "user.deleted") {
    try {
      const deletedUser = await deleteUser(id!);
      return NextResponse.json({ message: "OK", user: deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      return new NextResponse("Error deleting user", { status: 500 });
    }
  }

  console.log(`Webhook received with ID: ${id} and event type: ${eventType}`);
  console.log("Webhook body:", body);

  return new NextResponse("", { status: 200 });
}
