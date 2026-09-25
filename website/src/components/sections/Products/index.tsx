import { Link } from "react-router-dom";
const products = [
  {
    id: "inscrape",
    name: "Inscrape",
    type: "PYTHON SDK",
    body: "The web, in a format you can work with.",
    code: "pip install inscrape",
    detail: "Structured data · screenshots · async",
  },
  {
    id: "nirvana",
    name: "Nirvana",
    type: "ALERT MANAGEMENT",
    body: "Give the right signal a way through the noise.",
    code: "ingest → deduplicate → route",
    detail: "Integrations · escalation · incident workflows",
  },
  {
    id: "swarmscope",
    name: "SwarmScope",
    type: "MULTI-AGENT SIMULATION",
    body: "Explore what happens when agents interact.",
    code: "context → agents → simulation",
    detail: "GraphRAG · memory · emergent behaviour",
  },
];
export default function Products() {
  return (
    <section className="products-chapter section-space">
      <div className="chapter-heading">
        <p className="eyebrow">FROM OUR OWN WORKBENCH</p>
        <h2>
          Our own products.
          <br />
          The same engineering.
        </h2>
        <p>
          Our products are where we explore ideas,
          <br />
          test our assumptions and keep learning.
        </p>
      </div>
      <div className="product-panels">
        {products.map((p, i) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className={`product-panel product-panel-${i}`}
          >
            <div className="product-panel-top">
              <span className="eyebrow">{p.type}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="product-code">
              <span className="terminal-prompt">{i === 0 ? "$" : "↳"}</span>
              <code>{p.code}</code>
            </div>
            <div>
              <h3>{p.name}</h3>
              <p>{p.body}</p>
              <span className="product-explore">{p.detail}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
