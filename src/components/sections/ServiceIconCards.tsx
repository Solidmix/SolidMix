import {
  DropletIcon,
  TruckIcon,
  MixerIcon,
  BuildingIcon,
  RoadIcon,
  ShieldIcon,
} from "@/components/icons";

// Picks a representative icon from the service title; titles may or may not
// already carry an emoji prefix in the source content (kept as-is, never
// stripped — this only adds a dedicated inline-SVG icon alongside it).
function iconFor(title: string) {
  const t = title.toLowerCase();
  if (t.includes("waterproof")) return DropletIcon;
  if (t.includes("material")) return TruckIcon;
  if (t.includes("mixing")) return MixerIcon;
  if (t.includes("placement")) return BuildingIcon;
  if (t.includes("site")) return RoadIcon;
  return ShieldIcon; // quality / supervision / fallback
}

export function ServiceIconCards({ items }: { items: { title: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = iconFor(item.title);
        return (
          <div
            key={item.title}
            className="hover-bob flex flex-col items-center gap-4 bg-secondary px-6 py-10 text-center"
          >
            <Icon className="h-12 w-12 text-white" />
            <h3 className="text-[28px] font-semibold text-white">{item.title}</h3>
          </div>
        );
      })}
    </div>
  );
}
