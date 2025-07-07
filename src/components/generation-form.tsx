"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { packInputSchema, type PackInput } from "~/lib/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MotionDiv } from "~/components/motion-div";
import { cn } from "~/lib/utils";

export function GenerationForm({
  isLoading,
  submit,
  length,
}: {
  isLoading: boolean;
  submit: (data: PackInput) => void;
  length?: number;
}) {
  const form = useForm<PackInput>({
    resolver: zodResolver(packInputSchema),
    defaultValues: {
      topic: "",
      difficulty: "Beginner",
      count: 5,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        className={cn("flex min-w-full flex-col gap-4")}
        onSubmit={form.handleSubmit(
          async (data) => {
            const isValid = await form.trigger();
            if (isValid) {
              submit(data);
            }
          },
          (error) => {
            console.log({ error });
          },
        )}
      >
        <MotionDiv>
          <FormField
            control={form.control}
            name="topic"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-normal">Topic</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Example: Animals, Cars, Countries, etc."
                    className={cn(
                      "bg-neutral-50 autofill:bg-neutral-50 autofill:text-neutral-900/85",
                      fieldState.error &&
                        "border-red-500/75 focus-visible:ring-red-500/75 focus-visible:ring-offset-0",
                    )}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage className="text-xs font-normal">
                    {fieldState.error.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </MotionDiv>

        <MotionDiv>
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-normal">Difficulty</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={cn(
                        "bg-neutral-50 autofill:bg-neutral-50 autofill:text-neutral-900/85",
                        fieldState.error &&
                          "border-red-500/75 focus-visible:ring-red-500/75 focus-visible:ring-offset-0",
                      )}
                    >
                      <SelectValue placeholder="Select a difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                {fieldState.error && (
                  <FormMessage className="text-xs font-normal">
                    {fieldState.error.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </MotionDiv>

        <MotionDiv>
          <FormField
            control={form.control}
            name="count"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-normal">Words</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className={cn(
                      "bg-neutral-50 autofill:bg-neutral-50 autofill:text-neutral-900/85",
                      fieldState.error &&
                        "border-red-500/75 focus-visible:ring-red-500/75 focus-visible:ring-offset-0",
                    )}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                    }}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage className="text-xs font-normal">
                    {fieldState.error.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </MotionDiv>

        <MotionDiv
          whileHover={{
            scale: isLoading ? 1 : 1.02,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.5,
            },
          }}
          whileTap={{
            scale: isLoading ? 1 : 0.98,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.5,
            },
          }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-medium"
          >
            {isLoading
              ? `Almost there, ${length ?? 0} done...`
              : "Create new wordset"}
          </Button>
        </MotionDiv>
      </form>
    </Form>
  );
}
