import Image from "next/image";
import Link from "next/link";

export type TeamMember = {
  image: { src: string; alt: string };
  name: string;
  role: string;
  href?: string;
};

// Single column on mobile (~255px photo, centered), 2 on tablet, 3 on
// desktop, fixed 4:5 photo, no card border/shadow — matches the original
// team sections (no oversized images). Hover-bob on the photo matches the
// original's elementor-animation-bob.
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
      {members.map((m) => (
        <div key={m.name} className="text-center sm:text-left">
          <div className="hover-bob mx-auto aspect-[4/5] w-[255px] max-w-full overflow-hidden rounded-md bg-grey-line sm:mx-0 sm:w-auto">
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
