import { buildLog } from "@/data/buildLog";
export default function BuildLog() {
  return (
    <section className="build-log">
      <div className="build-log-intro">
        <p className="eyebrow">03 / THE WORK BEHIND THE WORK</p>
        <h2>It’s in the commits.</h2>
        <p>
          Features, fixes, tests. A few entries from the public repositories
          behind our products.
        </p>
        <a
          className="text-link"
          href="https://github.com/gkganesh12"
          target="_blank"
          rel="noreferrer"
        >
          Explore the source <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="commit-window">
        <div className="commit-window-top">
          <span>
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M2 12h6m8 0h6" />
            </svg>{" "}
            git log — selected builds
          </span>
          <span>PUBLIC SOURCE</span>
        </div>
        <ol>
          {buildLog.map((c) => (
            <li key={c.sha}>
              <a href={c.url} target="_blank" rel="noreferrer">
                <div className="commit-meta">
                  <span>{c.repo}</span>
                  <time dateTime={c.date}>{c.date}</time>
                </div>
                <h3>{c.message}</h3>
                <div className="commit-hash">
                  <code>{c.sha}</code>
                  <span>View commit ↗</span>
                </div>
              </a>
            </li>
          ))}
        </ol>
        <p className="commit-note">
          Curated repository history · verified September 2026
        </p>
      </div>
    </section>
  );
}
