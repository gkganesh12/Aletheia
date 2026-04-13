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
    label: "Products Shipped",
  },
  {
    id: "projects",
    value: 10,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    id: "agents",
    value: 5000,
    suffix: "+",
    label: "Concurrent AI Agents",
  },
  {
    id: "packages",
    value: 2,
    suffix: "",
    label: "Published Packages",
  },
];
