import { z } from "zod";

export const DifficultyEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);
export type Difficulty = z.infer<typeof DifficultyEnum>;

export const packInputSchema = z.object({
  topic: z
    .string()
    .min(3, "Please enter a topic at least 3 characters long")
    .max(200, "Please enter a topic less than 200 characters"),
  difficulty: DifficultyEnum,
  count: z.number().min(5, "Min. 5 words").max(15, "Max. 15 words"),
});
export type PackInput = z.infer<typeof packInputSchema>;
