"use client";

import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { CreateWordSet } from "~/lib/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion } from "motion/react";
import { Label } from "./ui/label";

export function GenerationForm({
  isLoading,
  submit,
  length,
}: {
  isLoading: boolean;
  submit: (data: CreateWordSet) => void;
  length?: number;
}) {
  return (
    <motion.form
      className="flex min-w-full flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
      onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const inputTopic = formData.get("topic") as CreateWordSet["topic"];
        const inputDifficulty = formData.get(
          "difficulty",
        ) as CreateWordSet["difficulty"];
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
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
          delay: 0.1,
        }}
        className="flex flex-col gap-2"
      >
        <Label className="font-normal" htmlFor="topic">
          Topic
        </Label>
        <Input
          type="text"
          name="topic"
          id="topic"
          placeholder="Example: Animals, Cars, Countries, etc."
          required
          className="bg-neutral-50"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
          delay: 0.2,
        }}
        className="flex flex-col gap-2"
      >
        <Label className="font-normal" htmlFor="difficulty">
          Difficulty
        </Label>
        <Select name="difficulty" required>
          <SelectTrigger className="bg-neutral-50">
            <SelectValue placeholder="Select a difficulty" />
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
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
          delay: 0.3,
        }}
        className="flex flex-col gap-2"
      >
        <Label className="font-normal" htmlFor="count">
          Word Count
        </Label>
        <Input
          type="number"
          name="count"
          id="count"
          min={3}
          max={15}
          defaultValue="5"
          required
          className="bg-neutral-50"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        }}
        whileHover={{
          scale: !isLoading ? 1.02 : 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          },
        }}
        whileTap={{
          scale: !isLoading ? 0.98 : 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          },
        }}
      >
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? `Almost there, ${length ?? 0} done...`
            : "Create new set of words"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
