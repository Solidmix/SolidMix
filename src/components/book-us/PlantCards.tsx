import { plants } from '@/data/plants';

// mapQuery comes from plants.ts (Build 1, 2026-11-21): a plain address for
// Plants 1/3, the resolved coordinate pair for Plant 2. A coordinate pair is
// embedded directly; an address gets the same "SolidMix RMC <address>" text
// search the kit's own mapQuery() helper used, so a generic address still
// resolves to the business rather than just a street point.
// Plant 3: do NOT use Plus Code 5PJ6+FHJ (it pointed to another company). Flag any doubt in BUILD-LOG.md.
const COORDS_RE = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
const embedQuery = (query: string) => encodeURIComponent(COORDS_RE.test(query) ? query : `SolidMix RMC ${query}`);

export default function PlantCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plants.map((p, i) => (
        <article key={p.id} className="rounded-lg border border-grey-line bg-white p-5">
          <h3 className="text-lg font-semibold text-primary">{`Plant ${i + 1}: ${p.name.replace('SolidMix RMC Plant, ', '')}`}</h3>
          <p className="mt-1 text-sm text-ink">{p.address}</p>
          <p className="mt-1 text-sm">
            <a className="text-ink hover:text-primary" href="tel:+919893111201">{p.phone}</a>
          </p>

          <iframe
            title={`Map of ${p.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-3 h-52 w-full rounded-md border-0"
            src={`https://www.google.com/maps?q=${embedQuery(p.mapQuery ?? p.address)}&output=embed`}
          />
          <p className="mt-2 text-sm">
            <a
              className="text-primary underline hover:text-primary/80"
              target="_blank"
              rel="noopener noreferrer"
              href={p.mapLink ?? `https://www.google.com/maps/search/?api=1&query=${embedQuery(p.mapQuery ?? p.address)}`}
            >
              Open in Google Maps
            </a>
          </p>

          <h4 className="mt-4 text-sm font-semibold text-ink">Areas we serve from this plant</h4>
          <div className="mt-2 space-y-3">
            {p.areaGroups.map((g) => (
              <div key={g.label}>
                <p className="text-sm font-medium text-ink">{g.label}</p>
                <p className="text-sm text-grey-2">{g.areas.join(', ')}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
