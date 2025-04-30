import { NextResponse } from "next/server";
import { createUser } from "@/lib/actions/user.actions";

export async function GET() {
  const user = {
    clerkId: "test123",
    email: "test@example.com",
    username: "testuser",
    firstName: "Test",
    lastName: "User",
    photo: "https://example.com/photo.jpg",
  };

  const createdUser = await createUser(user);

  return NextResponse.json(createdUser);
}
