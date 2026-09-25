import { Link } from "react-router-dom";
import { products } from "@/data/products";
const summaries = [
  "The open web. Structured, usable data. A Python SDK that gets you from URL to insight.",
  "One place for the alerts that matter. Deduplicate, prioritise and route your monitoring signals.",
  "Turn unstructured information into agent-based simulations. Explore how a world might behave.",
];
export default function Products() {
  return (
    <section className="products-chapter section-space">
      <div className="chapter-heading">
        <p className="eyebrow">04 / BUILT BY US</p>
        <h2>
          WE MAKE THINGS.
          <br />
          <span>THEN MAKE THEM BETTER.</span>
        </h2>
      </div>
      <div className="product-panels">
        {products.map((p, i) => (
          <Link
            className={`product-panel product-panel-${i}`}
            key={p.id}
            to={`/products/${p.id}`}
          >
            <div className="product-panel-top">
              <span className="eyebrow">{p.tagline}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className={`product-glyph glyph-${i}`} aria-hidden="true">
              {i === 0 ? "[↗]" : i === 1 ? "≋" : "✳"}
            </div>
            <div>
              <h3>{p.name}</h3>
              <p>{summaries[i]}</p>
              <span className="product-explore">Explore {p.name} ↗</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
