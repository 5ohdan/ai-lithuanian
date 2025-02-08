"use client";

import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { RequestData } from "~/app/api/generate-word-set/route";
import type { UserData } from "~/lib/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function GenerationForm({
  isLoading,
  submit,
}: {
  isLoading: boolean;
  submit: (data: RequestData) => void;
}) {
  return (
    <form
      className="flex min-w-full flex-col gap-3"
      action={async (formData: FormData) => {
        const inputTopic = formData.get("topic") as string;
        const inputDifficulty = formData.get(
          "difficulty",
        ) as UserData["difficulty"];
        const inputCount = formData.get("count") as string;

        if (!inputTopic) {
          toast.error("Please enter a topic.");
          return;
        }

        if (!inputDifficulty) {
          toast.error("Please select a difficulty.");
          return;
        }

        if (!inputCount) {
          toast.error("Please enter a word count.");
          return;
        }

        submit({
          topic: inputTopic,
          difficulty: inputDifficulty,
          count: parseInt(inputCount),
        });
      }}
    >
      <Input
        type="text"
        name="topic"
        id="topic"
        placeholder="Wordset Topic"
        required
      />
      <Select name="difficulty" required>
        <SelectTrigger>
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Beginner">Beginner</SelectItem>
          <SelectItem value="Intermediate">Intermediate</SelectItem>
          <SelectItem value="Advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        name="count"
        id="count"
        min={3}
        max={15}
        defaultValue="5"
        required
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate a word set"}
      </Button>
    </form>
  );
}
