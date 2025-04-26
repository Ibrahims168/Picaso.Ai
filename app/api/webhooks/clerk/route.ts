/* eslint-disable camelcase */
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // Webhook secret from the Clerk Dashboard
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Error occurred during webhook verification", {
      status: 400,
    });
  }

  // Extract event data
  const { id } = evt.data;
  const eventType = evt.type;

  // Handle CREATE event (user.created)
  if (eventType === "user.created") {
    console.log("Webhook Event Data (user.created):", evt.data);

    const {id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address ?? "",  // Ensure email is valid
      username: username ?? "",
      firstName: first_name || "",  // Ensure first name is valid
      lastName: last_name || "",    // Ensure last name is valid
      photo: image_url ?? "",      // Ensure photo URL is valid
    };

    try {
      const newUser = await createUser(user);

      // Check if newUser has _id and is valid
      if (!newUser || !newUser._id) {
        console.error("Error: newUser creation failed or _id is missing", newUser);
        return new Response("User creation failed", { status: 500 });
      }

      // Update Clerk user metadata with the created user's _id
      // await clerkClient.users.updateUserMetadata(id, {
      //   publicMetadata: {
      //     userId: newUser._id.toString(), // Ensure _id is a string
      //   },
      // });

      return NextResponse.json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error during user creation:", error);
      return new Response("Error during user creation", { status: 500 });
    }
  }

  // Handle UPDATE event (user.updated)
  if (eventType === "user.updated") {
    const {id, image_url, first_name, last_name, username } = evt.data;

    const updatedData = {
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      username: username ?? "",
      photo: image_url ?? "",
    };

    try {
      const updatedUser = await updateUser(id, updatedData);
      return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error during user update:", error);
      return new Response("Error during user update", { status: 500 });
    }
  }

  // DELETE event (user.deleted) - Uncomment when needed
  // if (eventType === "user.deleted") {
  //   try {
  //     const deletedUser = await deleteUser(id);
  //     return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
  //   } catch (error) {
  //     console.error("Error during user deletion:", error);
  //     return new Response("Error during user deletion", { status: 500 });
  //   }
  // }

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
