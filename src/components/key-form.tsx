import { submitApiKey } from "~/actions/auth";
import type { ValidationError } from "~/utils/auth";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function KeyForm({ error }: { error?: ValidationError }) {
  return (
    <form
      className="flex w-2/3 flex-col gap-6 rounded-md border border-neutral-500/40 bg-white p-4 md:p-10"
      action={submitApiKey}
    >
      {error && (
        <span className="rounded-md bg-red-200 p-2 text-red-500/85">
          {error.message}
        </span>
      )}
      <span className="text-center text-3xl font-bold text-neutral-950">
        Enter your API key to get started
      </span>
      <div className="flex w-full flex-col items-center space-y-4">
        <Input
          className="h-12 rounded-md border border-neutral-500/40 p-4 placeholder:text-neutral-400/75"
          id="api-key"
          name="api-key"
          type="password"
          required
          placeholder="Enter your API key"
        />
        <Button className="h-12 w-full rounded-md" type="submit">
          Validate the key
        </Button>
      </div>
    </form>
  );
}
