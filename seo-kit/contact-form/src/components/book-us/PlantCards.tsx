import { plants } from '@/data/plants';

// Map embeds use an address search query so no unconfirmed coordinates are needed.
// The developer must open each map and check the pin lands on the right plant.
// Plant 3: do NOT use Plus Code 5PJ6+FHJ (it pointed to another company). Flag any doubt in BUILD-LOG.md.
const mapQuery = (address: string) => encodeURIComponent(`SolidMix RMC ${address}`);

export default function PlantCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plants.map((p, i) => (
        <article key={p.id} className="rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="text-lg font-semibold">{`Plant ${i + 1}: ${p.name.replace('SolidMix RMC Plant, ', '')}`}</h3>
          <p className="mt-1 text-sm text-neutral-700">{p.address}</p>
          <p className="mt-1 text-sm">
            <a className="underline" href="tel:+919893111201">{p.phone}</a>
          </p>

          <iframe
            title={`Map of ${p.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-3 h-52 w-full rounded-lg border-0"
            src={`https://www.google.com/maps?q=${mapQuery(p.address)}&output=embed`}
          />
          <p className="mt-2 text-sm">
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery(p.address)}`}
            >
              Open in Google Maps
            </a>
          </p>

          <h4 className="mt-4 text-sm font-semibold">Areas we serve from this plant</h4>
          <div className="mt-2 space-y-3">
            {p.areaGroups.map((g) => (
              <div key={g.label}>
                <p className="text-sm font-medium text-neutral-800">{g.label}</p>
                <p className="text-sm text-neutral-700">{g.areas.join(', ')}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
