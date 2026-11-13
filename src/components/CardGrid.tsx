import Image from "next/image";
import Link from "next/link";
import type { Card } from "@/lib/content";

// Renders the repeating image+title(+body) card pattern used by the products
// grid, team grid, and service-icon grid on the original site.
export function CardGrid({
  cards,
  columns = 3,
  imageAspect = "square",
  priorityCount = 0,
}: {
  cards: Card[];
  columns?: 2 | 3 | 4;
  imageAspect?: "square" | "portrait" | "none";
  // Number of leading cards whose image gets next/image priority (eager
  // load). 0 by default — only a caller that opts in is affected.
  priorityCount?: number;
}) {
  const colsClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-6 ${colsClass}`}>
      {cards.map((card, i) => (
        <article
          key={i}
          className="hover-bob overflow-hidden rounded-[16px] border border-grey-line bg-white shadow-sm"
        >
          {card.image && imageAspect !== "none" && (
            <div className={imageAspect === "portrait" ? "aspect-[4/5]" : "aspect-square"}>
              <Image
                src={card.image.src}
                alt={card.image.alt || card.title}
                width={400}
                height={400}
                priority={i < priorityCount}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="p-5">
            <h3 className="text-[20px] font-semibold text-primary sm:text-[28px]">
              {card.titleHref ? (
                <Link href={card.titleHref} className="hover:underline">
                  {card.title}
                </Link>
              ) : (
                card.title
              )}
            </h3>
            {card.body && <p className="mt-2 text-sm leading-relaxed text-grey">{card.body}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
