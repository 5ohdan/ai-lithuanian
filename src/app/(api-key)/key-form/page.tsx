import Link from "next/link";
import { Button } from "~/components/ui/button";
import { KeyForm } from "~/components/key-form";
import { validateExistingToken } from "~/utils/auth";
import { ApiKeyValidator } from "~/components/api-key-validator";

export default async function KeyFormPage() {
  const { success, error, keyRemoved } = await validateExistingToken();

  if (success) {
    return (
      <Link href={"/new-set"}>
        <Button>Go to home page →</Button>
      </Link>
    );
  }

  return (
    <>
      {keyRemoved && <ApiKeyValidator keyRemoved={keyRemoved} error={error} />}
      <KeyForm error={error} />
    </>
  );
}
