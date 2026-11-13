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
  align = "center",
  gridCols = "lg:grid-cols-2",
}: {
  media: ReactNode;
  children: ReactNode;
  mediaPosition?: "left" | "right";
  mediaClassName?: string;
  contentClassName?: string;
  gap?: string;
  className?: string;
  // "stretch" makes both panels equal height — used for the "About Us"
  // joined-card pattern (css/post-17.css.css element a4bebf1, flex row,
  // default stretch), unlike MediaSplit's other callers which keep the
  // existing vertically-centered default.
  align?: "center" | "stretch";
  // Column width ratio — the joined-card pattern uses 33.33%/66.67%
  // (css/post-17.css.css elements 9102b41/d2e413f), not an even 50/50 split.
  gridCols?: string;
}) {
  return (
    <div className={`grid ${align === "stretch" ? "items-stretch" : "items-center"} ${gridCols} ${gap} ${className}`}>
      <div className={`${mediaPosition === "right" ? "lg:order-2" : ""} ${mediaClassName}`}>{media}</div>
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
