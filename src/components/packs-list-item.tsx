import { motion } from "motion/react";
import type { StoredPack, StoredBriefPack } from "~/lib/schemas";
import { CardContent, Card } from "./ui/card";
import Link from "next/link";

type PackItemProps = {
  pack: StoredPack | StoredBriefPack;
  index: number;
};

export function PacksListItem({ pack, index }: PackItemProps) {
  return (
    <motion.div
      key={pack.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
        delay: index * 0.05,
      }}
      whileHover={{
        scale: 1.01,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        },
      }}
      whileTap={{
        scale: 0.99,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        },
      }}
    >
      <Link href={`/packs/${pack.id}`} prefetch={true}>
        <Card className="cursor-pointer bg-neutral-100/85">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="mb-2 text-xl font-semibold">{pack.title}</h2>
              <p className="mb-2 text-sm text-gray-500/75">
                Created: {new Date(pack.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {pack.set.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.5,
                    delay: 0.2 + index * 0.05,
                  }}
                  className="rounded-md bg-white px-2 py-1 text-sm"
                >
                  {word.original}
                </motion.span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
