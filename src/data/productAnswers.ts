// Phase 5 (00-CLAUDE-BUILD-BRIEF.md) answer-first paragraph + facts-box data
// for the 12 product pages. One entry per slug, each checked against that
// page's own existing body copy (never invented) -- see docs/BUILD-LOG.md
// for the source sentence quoted per page. A slug with no entry renders the
// Phase 5 template sections with no "Typical uses" row and the answer
// paragraph skipped entirely.
export type ProductAnswer = {
  // Exact predicate from the page's own first sentence, e.g. for
  // "Standard Concrete is X." this is "X" (no trailing period).
  definition: string;
  // Only set when the page's body already lists uses (reused verbatim).
  typicalUses?: string[];
};

export const productAnswers: Record<string, ProductAnswer> = {
  "standard-concrete": {
    definition:
      "one of the most widely used construction materials in modern residential, commercial, and infrastructure development projects",
    typicalUses: [
      "Residential buildings",
      "Commercial structures",
      "Foundations and footings",
      "Slabs and flooring",
      "Roads and pavements",
      "Boundary walls",
      "Drainage systems",
      "Small infrastructure works",
      "General repair and maintenance projects",
    ],
  },
  "high-strength-concrete-in-sarona-raipur": {
    definition: "specially designed to handle much higher loads than standard concrete",
    typicalUses: [
      "High-rise residential and commercial towers",
      "Bridges and flyovers",
      "Industrial buildings",
      "Parking structures",
      "Heavy-load foundations",
      "Infrastructure projects",
    ],
  },
  "self-compacting-concrete-in-bhanpuri-raipur": {
    definition:
      "a highly flowable concrete mix that spreads easily into formwork and around reinforcement without the need for vibration",
    typicalUses: [
      "High-rise building columns and walls",
      "Heavily reinforced beams and slabs",
      "Precast concrete products",
      "Bridges and infrastructure works",
      "Decorative concrete finishes",
      "Complex architectural designs",
    ],
  },
  "lightweight-concrete-in-sejbahar-raipur": {
    definition:
      "a specially designed concrete mix made using lightweight aggregates that reduce the overall weight of the structure without sacrificing essential strength and durability",
    typicalUses: [
      "High-rise buildings",
      "Rooftops and terraces",
      "Floor screeds and partitions",
      "Precast concrete panels",
      "Renovation projects",
      "Residential and commercial buildings",
    ],
  },
  "steel-fiber-concrete": {
    definition:
      "a modern high-performance concrete specially designed by adding small steel fibers uniformly throughout the concrete mix",
    typicalUses: [
      "Industrial flooring",
      "Warehouses and factories",
      "Heavy-duty pavements",
      "Airport runways",
      "Roads and highways",
      "Tunnel linings",
      "Bridges and infrastructure projects",
      "Parking areas",
      "Shotcrete and precast structures",
    ],
  },
  "pp-fiber-concrete-in-kumhari-raipur": {
    definition:
      "a modern reinforced concrete solution manufactured by adding polypropylene (PP) fibers uniformly throughout the concrete mix",
    typicalUses: [
      "Industrial flooring",
      "Pavements and roads",
      "Warehouses and factories",
      "Residential slabs",
      "Parking areas",
      "Shotcrete applications",
      "Water retaining structures",
      "Footpaths and walkways",
      "Precast concrete products",
    ],
  },
  "waterproof-concrete-in-mandir-hasaud-raipur": {
    definition:
      "a modern high-performance concrete specially developed to prevent water penetration, leakage, and moisture-related damage in structures exposed to wet or humid conditions",
    typicalUses: [
      "Basements and foundations",
      "Water tanks and reservoirs",
      "Swimming pools",
      "Bathrooms and wet areas",
      "Roof slabs and terraces",
      "Underground structures",
      "Bridges and tunnels",
      "Retaining walls",
      "Marine and coastal structures",
    ],
  },
  "heat-resistant-concrete-2": {
    definition:
      "a specially engineered concrete designed to withstand extremely high temperatures, thermal shock, and continuous heat exposure without losing its structural integrity",
    typicalUses: [
      "Industrial furnaces",
      "Chimneys and boilers",
      "Power plants",
      "Steel and metal industries",
      "Fire-resistant structures",
      "Kilns and refractory zones",
      "Thermal processing units",
      "Petrochemical facilities",
      "High-temperature manufacturing plants",
    ],
  },
  "permeable-concrete-in-kotni-raipur": {
    definition: "a specially designed concrete mix that allows water to pass through its surface and drain into the ground below",
    typicalUses: [
      "Parking areas",
      "Walkways and footpaths",
      "Driveways",
      "Pavements and plazas",
      "Landscaped zones",
      "Low-traffic roads and open spaces",
    ],
  },
  "eco-friendly-concrete-in-saddu-raipur": {
    definition: "a sustainable construction material designed to reduce environmental impact while maintaining strength and durability",
    typicalUses: [
      "Residential and commercial buildings",
      "Green-certified construction projects",
      "Roads and pavements",
      "Industrial developments",
      "Public infrastructure projects",
      "Sustainable housing communities",
    ],
  },
  "stamped-concrete-in-atal-nagar-raipur": {
    definition:
      "an advanced decorative concrete solution that enhances the appearance of outdoor and indoor spaces while maintaining the strength and durability of traditional concrete",
    // No "Typical uses" row: this page's applications section is written as
    // prose subheadings (Driveways, Patios and Courtyards, ...), not a
    // bullet list, so there is no single set of exact words to quote.
  },
  "bagged-concrete-in-farfaud-raipur": {
    definition: "a ready-to-use dry concrete mix packed in bags for convenience and easy handling",
    typicalUses: [
      "Fence post installation",
      "Floor patching and repairs",
      "Pathways and curbs",
      "Small slabs and foundations",
      "Garden projects",
      "DIY home improvement work",
    ],
  },
};
