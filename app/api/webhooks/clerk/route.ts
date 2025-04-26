/* eslint-disable camelcase */
import { clerkClient } from "@clerk/clerk-sdk-node";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is missing in environment variables.");
    return new Response("Internal Server Error", { status: 500 });
  }

  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  let payload: any;
  let body: string;

  try {
    payload = await req.json();
    body = JSON.stringify(payload);
  } catch (err) {
    console.error("Error parsing request body:", err);
    return new Response("Invalid JSON", { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { id } = evt.data ?? {}; // Safely handle missing `id` in the event data
  const eventType = evt.type;

  if (!id) {
    console.error("No user id found in the event data");
    return new Response("User ID missing", { status: 400 });
  }

  console.log(`Received webhook event: ${eventType} for user ID: ${id}`);

  // CREATE
  if (eventType === "user.created") {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data ?? {};

    if (!email_addresses || email_addresses.length === 0 || !username) {
      console.error("Missing required user information for creation.");
      return new Response("Missing user information", { status: 400 });
    }

    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address || "",
      username: username!,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };

    const newUser = await createUser(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "User created", user: newUser });
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { image_url, first_name, last_name, username } = evt.data ?? {};

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "User updated", user: updatedUser });
  }

  // DELETE
  if (eventType === "user.deleted") {
    const deletedUser = await deleteUser(id);

    return NextResponse.json({ message: "User deleted", user: deletedUser });
  }

  console.log("Unhandled event type:", eventType);

  return new Response("Event received", { status: 200 });
}
