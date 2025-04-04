import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  redirect("/new-set");
}
