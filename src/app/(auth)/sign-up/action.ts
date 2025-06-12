"use server";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";

type SignUpData = {
  email: string;
  password: string;
  name: string;
};

export default async function signUpAction(formData: SignUpData) {
  try {
    const { email, password, name } = formData;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        error: "User with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await db.insert(users).values({
      id: createId(),
      email,
      name,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      error: "Something went wrong creating your account",
    };
  }
}
