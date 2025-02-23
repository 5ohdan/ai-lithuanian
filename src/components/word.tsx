import type { Word } from "~/lib/schemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

export function Word({
  word,
  nextCard,
  previousCard,
  nextAvailable,
  prevAvailable,
}: {
  word: Word;
  nextCard: () => void;
  previousCard: () => void;
  nextAvailable: boolean;
  prevAvailable: boolean;
}) {
  return (
    <Card className="grid h-full" key={word.original}>
      <CardHeader>
        <CardTitle className="text-4xl underline underline-offset-2">
          {word.original}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-neutral-400">
            Translation:
          </span>
          <p className="text-lg text-neutral-800">{word.translation}</p>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-neutral-400">
            Transcription:
          </span>
          <p className="text-lg text-neutral-800">{word.transcription}</p>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-neutral-400">
            Usage context:
          </span>
          <p className="text-lg text-neutral-800">{word.context}</p>
        </div>
        <div className="mt-4 flex flex-col space-y-1 rounded-lg bg-neutral-300/50 p-4">
          <span className="text-sm">Example:</span>
          <p className="text-lg font-semibold">{word.example}</p>
          <p className="text-neutral-500 opacity-40 hover:text-neutral-800 hover:opacity-100">
            {word.exampleTranslation}
          </p>
        </div>
      </CardContent>
      <CardFooter className="items-end justify-between">
        <Button
          onClick={previousCard}
          disabled={!prevAvailable}
          className="w-24"
        >
          Previous
        </Button>
        <Button onClick={nextCard} disabled={!nextAvailable} className="w-24">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
