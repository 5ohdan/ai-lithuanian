import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { zodResolver } from "@hookform/resolvers/zod";
import { packInputSchema, type PackInput } from "~/lib/schemas";
import { GenerationForm } from "./generation-form";

const validInput: PackInput = { topic: "greetings", difficulty: "Beginner", count: 5 };
const resolver = zodResolver(packInputSchema);
const resolverOptions = { fields: {}, shouldUseNativeValidation: false };

describe("generation form dependency compatibility", () => {
  it("resolves valid Zod 4 input for React Hook Form", async () => {
    expect(await resolver(validInput, undefined, resolverOptions)).toEqual({
      errors: {},
      values: validInput,
    });
  });

  it.each([
    { count: 4, message: "Min. 5 words" },
    { count: 16, message: "Max. 15 words" },
  ])("preserves the count validation message for $count words", async ({ count, message }) => {
    const result = await resolver({ ...validInput, count }, undefined, resolverOptions);
    expect(result.values).toEqual({});
    expect(result.errors.count?.message).toBe(message);
  });

  it("preserves field-level errors for an empty topic", async () => {
    const result = await resolver({ ...validInput, topic: "" }, undefined, resolverOptions);
    expect(result.errors.topic?.message).toBe("Please enter a topic at least 3 characters long");
  });

  it.each([false, true])(
    "server-renders Motion and Radix/Lucide controls with loading=%s",
    (isLoading) => {
      const submit = vi.fn();
      const html = renderToStaticMarkup(
        createElement(GenerationForm, { isLoading, submit, length: 3 }),
      );
      expect(html).toContain("Topic");
      expect(html).toContain("Difficulty");
      expect(html).toContain("Words");
      expect(html).toContain("<svg");
      expect(html).toContain(isLoading ? "Almost there, 3 done..." : "Create new wordset");
      expect(html).not.toContain("whileHover=");
      expect(submit).not.toHaveBeenCalled();
    },
  );
});
