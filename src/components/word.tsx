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
}: {
  word: Word;
  nextCard: () => void;
  previousCard: () => void;
}) {
  return (
    <Card key={word.original}>
      <CardHeader>
        <CardTitle>{word.original}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Translation: {word.translation}</p>
        <p>Transcription: {word.transcription}</p>
        <p>Usage context: {word.context}</p>
        <p>Original sentence example: {word.example}</p>
        <p>Translation sentence example: {word.exampleTranslation}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={previousCard} className="w-24">
          Previous
        </Button>
        <Button onClick={nextCard} className="w-24">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
