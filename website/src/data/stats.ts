export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  {
    id: "products",
    value: 3,
    suffix: "",
    label: "Products in Production",
  },
  {
    id: "uptime",
    value: 99.99,
    suffix: "%",
    label: "Platform Uptime",
  },
  {
    id: "containment",
    value: 2.8,
    suffix: " min",
    label: "Avg Threat Containment",
  },
  {
    id: "sources",
    value: 200,
    suffix: "+",
    label: "Dark Web Sources Monitored",
  },
];
