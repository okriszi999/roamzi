"use server";

import { signIn } from "@/server/auth";
import { redirect } from "next/navigation";

type SignInData = {
  email: string;
  password: string;
};

export default async function signInAction(formData: SignInData) {
  const result = await signIn("credentials", {
    email: formData.email,
    password: formData.password,
    redirect: false,
  });

  if (result?.error) {
    return {
      error: "Invalid email or password",
    };
  }

  // Success - redirect
  redirect("/");
}
