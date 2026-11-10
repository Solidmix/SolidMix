// "Your Area" dropdown groups, copied exactly from docs/reference/service-areas.md
// (distances omitted from labels — the source doc keeps them only as internal
// reference). Every group listed there appears here, Simga only once.

export type AreaGroup = { label: string; areas: string[] };

export const AREA_GROUPS: AreaGroup[] = [
  {
    label: "Within Raipur city",
    areas: [
      "Kota",
      "Tatibandh",
      "Sarona",
      "Pandri",
      "Raipur Railway Station",
      "Gudhiyari",
      "Bhatagaon",
      "Telibandha",
      "Mowa",
      "Urla Industrial Area",
      "Bhanpuri",
    ],
  },
  {
    label: "Nearby outskirts",
    areas: ["Birgaon", "Swami Vivekananda Airport", "Dharsiwa", "Siltara Industrial Area", "Kandul"],
  },
  {
    label: "Naya Raipur side",
    areas: ["Nandanvan Jungle Safari", "Mandir Hasaud", "Naya Raipur (Atal Nagar)", "Mana"],
  },
  {
    label: "Towards Bhilai / Durg",
    areas: ["Kumhari", "Charoda", "Bhilai", "Durg"],
  },
  {
    label: "Towards Bilaspur / Baloda Bazar road",
    areas: ["Tilda-Neora", "Neora"],
  },
  {
    label: "Towards Mahasamund / Odisha road",
    areas: ["Arang", "Abhanpur"],
  },
  {
    label: "Beyond 40 km",
    areas: ["Dhamtari", "Simga", "Kurud", "Baloda Bazar", "Mahasamund"],
  },
  {
    label: "Additional areas",
    areas: ["Bemetara", "Tilda", "Tarpongi", "Berla"],
  },
];

export const OTHER_AREA_OPTION = "Other area";
