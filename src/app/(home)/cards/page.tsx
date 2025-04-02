import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function CardsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  redirect("/new-set");
}
