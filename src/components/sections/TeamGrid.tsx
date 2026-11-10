import Image from "next/image";
import Link from "next/link";

export type TeamMember = {
  image: { src: string; alt: string };
  name: string;
  role: string;
  href?: string;
};

// 3 columns desktop / 2 tablet / 1 mobile, fixed 4:5 photo, no card
// border/shadow — matches the original team sections (no oversized images).
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <div key={m.name}>
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-grey-line">
            <Image
              src={m.image.src}
              alt={m.image.alt || m.name}
              width={400}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mt-4 text-[32px] font-semibold text-primary">
            {m.href ? (
              <Link href={m.href} className="hover:underline">
                {m.name}
              </Link>
            ) : (
              m.name
            )}
          </h3>
          <p className="mt-1 font-medium text-secondary">{m.role}</p>
        </div>
      ))}
    </div>
  );
}
