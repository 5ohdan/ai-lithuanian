"use client";

import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { CreateWordSet, UserData } from "~/lib/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion } from "motion/react";

export function GenerationForm({
  isLoading,
  submit,
}: {
  isLoading: boolean;
  submit: (data: CreateWordSet) => void;
}) {
  return (
    <motion.form
      className="flex min-w-full flex-col gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Input
          type="text"
          name="topic"
          id="topic"
          placeholder="Wordset Topic"
          required
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Input
          type="number"
          name="count"
          id="count"
          min={3}
          max={15}
          defaultValue="5"
          required
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate a word set"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
