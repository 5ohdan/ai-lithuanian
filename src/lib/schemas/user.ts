import { z } from "zod";
import { DifficultyEnum } from "./inputs";

export const userDataSchema = z.object({
  difficulty: DifficultyEnum,
});
export type UserData = z.infer<typeof userDataSchema>;
