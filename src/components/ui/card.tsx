import * as React from "react";

import { cn } from "~/lib/utils";

const Card = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground rounded-lg border shadow-xs",
      className,
    )}
    {...props}
  />
);
Card.displayName = "Card";

const CardHeader = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

const CardTitle = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={ref}
    className={cn("text-2xl leading-none font-bold tracking-tight", className)}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

const CardDescription = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

const CardContent = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement>;
}) => <div ref={ref} className={cn("sm:p-6 sm:pt-0", className)} {...props} />;
CardContent.displayName = "CardContent";

const CardFooter = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={ref}
    className={cn("flex items-center sm:p-6 sm:pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
