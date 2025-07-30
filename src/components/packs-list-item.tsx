import { motion } from "motion/react";
import type { StoredPack, StoredBriefPack } from "~/lib/schemas";
import { CardContent, Card } from "./ui/card";
import Link from "next/link";

type PackItemProps = {
  pack: StoredPack | StoredBriefPack;
  index: number;
};

export function PacksListItem(props: PackItemProps) {
  const { pack, index } = props;

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
        <Card className="cursor-default bg-neutral-100/85 sm:cursor-pointer">
          <CardContent className="space-y-1 p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium sm:mb-2 sm:text-xl sm:font-bold">
                {pack.title}
              </h2>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {pack.set.slice(0, 4).map((word, index) => (
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
                  className="rounded-md border border-neutral-200/85 bg-white px-2 py-1 text-xs sm:hidden"
                >
                  {word.original}
                </motion.span>
              ))}
              {pack.set.length > 4 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.5,
                    delay: 0.2 + 4 * 0.05,
                  }}
                  className="rounded-md border border-neutral-200/85 bg-white px-2 py-1 text-xs sm:hidden"
                >
                  {pack.set.length - 4}+
                </motion.span>
              )}

              {/* Desktop view: show up to 10 words */}
              {pack.set.slice(0, 10).map((word, index) => (
                <motion.span
                  key={`desktop-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.5,
                    delay: 0.2 + index * 0.05,
                  }}
                  className="hidden rounded-md border border-neutral-200/85 bg-white px-2 py-1 text-sm sm:inline-block"
                >
                  {word.original}
                </motion.span>
              ))}
              {pack.set.length > 10 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.5,
                    delay: 0.2 + 10 * 0.05,
                  }}
                  className="hidden rounded-md border border-neutral-200/85 bg-white px-2 py-1 text-sm sm:inline-block"
                >
                  {pack.set.length - 10}+
                </motion.span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
