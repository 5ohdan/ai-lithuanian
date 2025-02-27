import { submitApiKey } from "~/actions/auth";
import type { ValidationError } from "~/utils/auth";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function KeyForm({ error }: { error?: ValidationError }) {
  return (
    <form
      className="flex w-2/3 flex-col space-y-2 rounded-md border border-neutral-500/40 p-4 md:p-10"
      action={submitApiKey}
    >
      {error && (
        <span className="rounded-md bg-red-200 p-2 text-red-500">
          {error.message}
        </span>
      )}
      <Label htmlFor="api-key">OpenAI API Key</Label>
      <Input id="api-key" name="api-key" type="password" required />
      <Button type="submit">Validate the key</Button>
    </form>
  );
}
