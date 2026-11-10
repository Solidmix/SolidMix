import type { ReactNode } from "react";

// Image one side, content the other; stacks to a single column on mobile.
// Used for the "Why RMC?", "About Us" and FAQ sections that were previously
// flattened into one narrow BlockRenderer column.
export function MediaSplit({
  media,
  children,
  mediaPosition = "left",
  mediaClassName = "",
  contentClassName = "",
  gap = "gap-8",
  className = "",
}: {
  media: ReactNode;
  children: ReactNode;
  mediaPosition?: "left" | "right";
  mediaClassName?: string;
  contentClassName?: string;
  gap?: string;
  className?: string;
}) {
  return (
    <div className={`grid items-center lg:grid-cols-2 ${gap} ${className}`}>
      <div className={`${mediaPosition === "right" ? "lg:order-2" : ""} ${mediaClassName}`}>{media}</div>
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
