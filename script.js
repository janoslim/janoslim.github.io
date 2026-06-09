const publications = [
  {
    title: "FaScalSQL: A Fast and Scalable GPU-Accelerated SQL Query Engine for Out-of-Memory Tables",
    venue: "ICDE",
    year: 2026,
    tags: ["gpu", "analytics", "sql"],
  },
  {
    title: "DMO-DB: Mitigating the Data Movement Bottlenecks of GPU-Accelerated Relational OLAP",
    venue: "PACT",
    year: 2025,
    tags: ["gpu", "olap", "query-processing"],
  },
  {
    title: "SPID-Join: A Skew-resistant Processing-in-DIMM Join Algorithm Exploiting the Bank- and Rank-level Parallelisms of DIMMs",
    venue: "SIGMOD",
    year: 2025,
    tags: ["pim", "join", "dimms", "sigmod"],
  },
  {
    title: "PID-Comm: A Fast and Flexible Collective Communication Framework for Commodity Processing-in-DIMMs",
    venue: "ISCA",
    year: 2024,
    tags: ["pim", "network", "collective"],
  },
  {
    title: "Design and Analysis of a Processing-in-DIMM Join Algorithm: A Case Study with UPMEM DIMMs",
    venue: "SIGMOD",
    year: 2023,
    tags: ["pim", "join", "dimms"],
  },
  {
    title: "GuardiaNN: Fast and Secure On-Device Inference in TrustZone Using Embedded SRAM and Cryptographic Hardware",
    venue: "Middleware",
    year: 2022,
    tags: ["security", "hardware", "nn"],
  },
];

const log = document.getElementById("terminal-log");
const form = document.getElementById("query-form");
const input = document.getElementById("query-input");

function addLine(text, className = "") {
  const row = document.createElement("div");
  if (className) row.className = className;
  row.textContent = text;
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}

function renderRows(rows) {
  if (!rows.length) {
    addLine("[WARN] No tuple matched the predicate.", "muted");
    return;
  }
  rows.forEach((p, idx) => {
    const line = `[${idx + 1}] ${p.year} | ${p.venue} | ${p.title}`;
    addLine(line);
  });
}

function printHelp() {
  addLine("Tiny DB shell commands:");
  addLine("  help");
  addLine('  select * from publications');
  addLine('  select * from publications where year >= N');
  addLine('  select * from publications where venue contains SIGMOD');
  addLine('  select * from publications where title contains PIM');
  addLine("  plan");
  addLine("  clear");
}

function runQuery(query) {
  const q = query.trim().toLowerCase();
  if (!q) return;

  addLine(`> ${query}`, "result");

  if (q === "help") {
    printHelp();
    return;
  }

  if (q === "clear") {
    log.innerHTML = "";
    addLine("> DB console initialized. Input query and press Enter.");
    return;
  }

  if (q === "plan") {
    addLine("PLAN:");
    addLine("  - parse SQL -> logical tree");
    addLine("  - convert into pull-based volcano operators");
    addLine("  - map kernels on GPU thread blocks");
    addLine("  - collect output and materialize batch");
    return;
  }

  if (q === "select * from publications") {
    addLine("RESULT:");
    renderRows(publications);
    return;
  }

  const yearMatch = q.match(/select \* from publications where year\s*([<>]=?)\s*(\d{4})/);
  if (yearMatch) {
    const op = yearMatch[1];
    const y = Number(yearMatch[2]);
    let filtered = [];
    if (op === ">=") filtered = publications.filter((p) => p.year >= y);
    if (op === "<=") filtered = publications.filter((p) => p.year <= y);
    if (op === ">") filtered = publications.filter((p) => p.year > y);
    if (op === "<") filtered = publications.filter((p) => p.year < y);
    if (op === "=") filtered = publications.filter((p) => p.year === y);
    addLine("RESULT:");
    renderRows(filtered);
    return;
  }

  const venueMatch = q.match(/select \* from publications where venue contains (.+)/);
  if (venueMatch) {
    const needle = venueMatch[1].trim().toLowerCase();
    const filtered = publications.filter((p) => p.venue.toLowerCase().includes(needle));
    addLine("RESULT:");
    renderRows(filtered);
    return;
  }

  const titleMatch = q.match(/select \* from publications where title contains (.+)/);
  if (titleMatch) {
    const needle = titleMatch[1].trim().toLowerCase();
    const filtered = publications.filter((p) => p.title.toLowerCase().includes(needle));
    addLine("RESULT:");
    renderRows(filtered);
    return;
  }

  if (q.startsWith("select") && q.includes("from publications")) {
    addLine("[ERR] unsupported filter. Try: where year >= 2025 or venue/title contains KEY");
    return;
  }

  addLine("[ERR] unknown command. type 'help'.");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;
  runQuery(value);
  input.value = "";
});

addLine("hint: `help` for commands.");
