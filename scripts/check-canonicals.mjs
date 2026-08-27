/**
 * Fails the build if a page can be indexed without declaring its own canonical.
 *
 * WHY THIS EXISTS. The homepage shipped for months with no canonical while every
 * other route had one. Nothing caught it, because nothing was looking: each
 * route hand-writes `alternates: { canonical: \`${ORG_URL}/some/path\` }` and a
 * route that simply omits the line is indistinguishable from one that never
 * needed it.
 *
 * The cost is asymmetric and quiet. A missing canonical does not break a page,
 * it just lets /?utm_source=… accumulate authority separately from /, on the
 * one page that ranks for the brand name. Nobody notices for a year.
 *
 * Two rules, both mechanical:
 *
 *   1. Every route exporting `metadata` must declare `alternates.canonical`.
 *   2. That canonical must match the route's own path on disk — a canonical
 *      pointing at the WRONG page is worse than none at all, because it hands
 *      the page's authority to a different URL on purpose.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not .pathname: this repo lives under "CaribBooks AI" and a URL
// pathname keeps the space percent-encoded, so readdir looks for a directory
// called "CaribBooks%20AI" and fails.
const APP = fileURLToPath(new URL("../src/app", import.meta.url));
const failures = [];

/** Route path implied by a file's location on disk. */
function routeOf(file) {
  const rel = relative(APP, file).replace(/\\/g, "/");
  const dir = rel.replace(/\/(page|layout)\.tsx$/, "");
  if (dir === "page.tsx" || dir === "layout.tsx" || dir === "") return "/";
  // Route groups "(name)" and private "_dirs" contribute nothing to the URL.
  const segs = dir.split("/").filter((s) => s && !s.startsWith("(") && !s.startsWith("_"));
  return "/" + segs.join("/");
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "api") continue;          // route handlers are not pages
      walk(full);
      continue;
    }
    if (!/^(page|layout)\.tsx$/.test(entry)) continue;

    const src = readFileSync(full, "utf8");
    if (!/export const metadata|generateMetadata/.test(src)) continue;

    const route = routeOf(full);
    const m = src.match(/canonical:\s*(`[^`]*`|"[^"]*"|'[^']*')/);
    if (!m) {
      failures.push(`${route}  — exports metadata but declares no canonical  (${relative(APP, full)})`);
      continue;
    }
    // Normalise `${ORG_URL}/about` and "/about" to a comparable path.
    const declared = m[1]
      .slice(1, -1)
      .replace(/\$\{[^}]+\}/g, "")
      .replace(/^https?:\/\/[^/]+/, "") || "/";
    if (declared !== route) {
      failures.push(`${route}  — canonical points at "${declared}"  (${relative(APP, full)})`);
    }
  }
}

walk(APP);

if (failures.length) {
  console.error("\nCanonical check FAILED:\n");
  for (const f of failures) console.error("  " + f);
  console.error("\nEvery indexable route needs exactly one self-referencing canonical.\n");
  process.exit(1);
}
console.log("Canonical check passed — every route with metadata self-references.");
