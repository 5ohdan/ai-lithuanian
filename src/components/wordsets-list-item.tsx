import { motion } from "motion/react";
import type { StoredWordSet } from "~/lib/schemas";
import { CardContent, Card } from "./ui/card";
import { useRouter } from "next/navigation";

export function WordSetsListItem({
  wordSet,
  index,
}: {
  wordSet: StoredWordSet;
  index: number;
}) {
  const router = useRouter();

  return (
    <motion.div
      key={wordSet.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
    >
      <Card
        className="cursor-pointer bg-neutral-100/85"
        onClick={() => router.push(`/wordsets/${wordSet.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold">{wordSet.topic}</h2>
            <p className="mb-2 text-sm text-gray-500/75">
              Created: {new Date(wordSet.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wordSet.set.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.2 }}
                className="rounded-md bg-white px-2 py-1 text-sm"
              >
                {word.original}
              </motion.span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
