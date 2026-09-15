# Loymax Properties — Platform Investment Brief

## You already own the shopfront. Now own the street it stands on.

A working property platform for Loymax — a public listings site and a private operating dashboard, built as one system.

**Status: functional build, pre-launch**

| 13 | 11 | 12,440 | 3 | KES 0 |
|---|---|---|---|---|
| Public pages live | Dashboard modules | Lines written | Lead pipelines | Cost per listing |

This brief sets out what has been built, what it replaces, what remains, and what completing it takes.

---

## 1. The position

### Every enquiry a portal sends you was yours to begin with.

The default way to sell property in Kenya is to rent attention: pay a portal to list, pay again when a buyer clicks, and hand over the one asset that compounds — the record of who asked about what, and when. The listing is yours. The buyer's phone number belongs to whoever captured it.

This platform moves that capture point onto Loymax's own infrastructure. A buyer who finds a Karen townhouse through Loymax's site fills in a Loymax form, which writes to a Loymax database, which appears in a Loymax inbox, attributed to the exact listing that produced it. No intermediary, no lead fee, no cap on how many listings you run.

> **The portals sell you access to demand. This sells you *ownership* of it.**

---

## 2. What exists today

### Not a mockup. A running system with real moving parts.

This is the distinction that matters to an investment decision. The work below is written, wired to a live database, and operable — not sketched in a design file awaiting a build phase.

| Module | What it does | State |
|---|---|---|
| **Property catalogue** | Full listing lifecycle: create, edit, duplicate, publish, feature, retire. Images upload straight to cloud storage from the dashboard. Sale and rent, bulk publishing, clean URLs. | LIVE |
| **Buyer search** | Filter by area, property type, transaction, ceiling price, minimum bedrooms and bathrooms; sort by newest or price. Deep-linkable from the homepage search. Similar-listing suggestions on every property page. | LIVE |
| **Lead capture** | Six form types — viewing, information, general, sell, valuation, consultation — routed into three separate queues, each with a new / contacted / closed status an agent moves. | LIVE |
| **Insights & content** | A full article CMS: write, illustrate, feature, publish. Every save refreshes the public page instantly. | LIVE |
| **Featured locations** | Nairobi, Kiambu, Kajiado, Mombasa and Naivasha as editable destination panels on the homepage — add or reorder markets without a developer. | LIVE |
| **Team & roles** | Admins run everything. Agents see properties and leads but not content or team settings. Invite, promote and remove staff from the dashboard. | LIVE |
| **Media library** | A shared image store with upload, browse and delete, so photography is managed once and reused across listings and articles. | LIVE |
| **Testimonials** | Client quotes with attribution and a publish switch, surfaced on the homepage as social proof under Loymax's control rather than a review platform's. | LIVE |
| **Site copy editor** | Editing homepage and About copy from the dashboard. The section is scaffolded and routed; the editing surface itself is the remaining work. | IN PROGRESS |

---

## 3. The lead path

### From a stranger on a phone to a booked viewing.

This is the sequence the platform exists to own. Steps one through five run today. Step six is the one gap in an otherwise closed loop — and it is the cheapest item on the roadmap.

| Step | Stage | What happens |
|---|---|---|
| 1 | **Discovery** | Buyer lands on a listing from search, a share, or the homepage filter. |
| 2 | **The listing** | Gallery, price in KES, beds, baths, parking, area, land size, features, agent contact. |
| 3 | **Enquiry** | Viewing form on the page itself, pre-tagged with that property. |
| 4 | **Screening** | Honeypot and submission-timing checks discard bot traffic silently. |
| 5 | **The queue** | Appears in Viewing Requests, searchable, with a status an agent moves. |
| **Gap** | **The alert** | No email or SMS fires yet. An agent must open the dashboard to see it. |

**Why this gap is worth naming plainly.** Response time is the single largest controllable variable in converting a property enquiry. The pipeline captures and stores perfectly; it does not yet interrupt anyone. Closing it is a small, well-scoped integration — and it is the highest-return item in phase two for exactly that reason.

---

## 4. The economics

### What the platform removes from the cost line.

The figures below are deliberately left for Loymax to fill against its own contracts and volumes — invented numbers would not survive your accountant. What the build fixes is the *shape* of the cost: portal spend scales with listings and leads, while this platform's cost is flat and its marginal listing is free.

| Cost line | Portal / agency model | Owned platform | Loymax figure |
|---|---|---|---|
| **Listing an additional property** (marginal cost per unit) | Per-listing or tiered fee | KES 0 | — fill in — |
| **Receiving an enquiry** (marginal cost per lead) | Per-lead or commission share | KES 0 | — fill in — |
| **Publishing an article** (content marketing) | Agency retainer or ad spend | Staff time only | — fill in — |
| **Hosting & infrastructure** (recurring, flat) | Bundled into fees | Usage-based cloud | — fill in — |
| **Buyer contact records** (the compounding asset) | Held by the portal | Held by Loymax | Not purchasable |

- **Fixed cost, unbounded inventory.** Fifty listings cost what five do. Growth in the catalogue is pure upside rather than a rising invoice.
- **Serverless infrastructure.** There is no always-on machine to rent. Quiet months cost close to nothing; a busy launch scales without a migration.
- **The database compounds.** Every enquiry adds a permanent, searchable record — who wanted what, in which area, at which price. That history is a marketing asset the portals will never sell back to you.
- **No lock-in.** Built on standard, widely-supported technology. Any competent developer can take it forward; you are not captive to one supplier.

---

## 5. Under the hood

### Built to be handed over, not just to demo well.

An investment in software is an investment in what it costs to keep. The decisions below were made to keep that number low and the risk contained.

- **The browser never touches the database.** Every read and write runs on the server under administrative credentials; the public rules are set to deny everything as a second lock. A leaked page source exposes no keys and no data.
- **Sessions are server-verified.** Dashboard access is checked cryptographically on the server for every request, not merely hidden in the interface. A fast cookie check redirects politely; the real gate cannot be bypassed by editing anything in the browser.
- **Every form is validated twice.** Once for the visitor's benefit, once on the server where it counts. Malformed or hostile submissions never reach storage.
- **Pages are pre-rendered and cached.** Listings serve as static pages and refresh the instant an agent hits save. Buyers get near-instant loads; the infrastructure bill stays flat under traffic spikes.
- **Current-generation stack.** Next.js 16, React 19, TypeScript throughout, Firebase for data, storage and identity. Mainstream, well-documented, and hireable-for in Nairobi.
- **Typed end to end.** Twelve thousand lines under a type checker, organised into small, single-purpose modules. Whole classes of bug are caught before anyone runs the code.

---

## 6. What remains — the honest ledger

Nothing here is a surprise or a defect — it is the scope that sits beyond a first functional build. Presented in the order it should be funded.

| Item | Why it matters | Phase |
|---|---|---|
| **Instant lead alerts** (email & SMS on new enquiry) | Turns a stored lead into a called lead. The highest-return item on this list. | Phase 2 |
| **Search-engine groundwork** (sitemap, robots, listing markup) | Lets Google index every listing and show price and beds directly in results. | Phase 2 |
| **WhatsApp handoff** (one-tap to an agent) | Matches how Kenyan buyers actually prefer to make first contact. | Phase 2 |
| **Site copy editor** (homepage & About text) | Removes the last reason to call a developer for a wording change. | Started |
| **Analytics** (traffic and conversion reporting) | Shows which listings and which areas actually produce enquiries. | Phase 3 |
| **Map search** (listings plotted by area) | The expected way to browse property; strong differentiator locally. | Phase 3 |
| **Saved searches & alerts** (buyer accounts) | Brings buyers back unprompted when matching stock arrives. | Phase 3 |
| **Mortgage calculator** (on listing pages) | Keeps affordability questions on-site instead of sending buyers away. | Phase 3 |

---

## 7. Risk — the four objections worth taking seriously

| Objection | Response |
|---|---|
| **"A site nobody visits is worth nothing."** | Correct, and the reason the search-engine groundwork is phase two rather than later. The platform is also built to be fed: the Insights section exists so Loymax publishes its own market commentary and earns traffic instead of renting it. |
| **"Our team won't use it."** | The dashboard was designed for staff, not developers — plain forms, searchable lead tables, a single status to move. Agents see only properties and leads; the administrative surface is hidden from them entirely. |
| **"We'll be dependent on one developer."** | The stack is deliberately mainstream and the code deliberately conventional. The data lives in your own Firebase project under your own account. Hand it to another team and they will recognise everything they see. |
| **"The portals still have the audience."** | They do, and this does not require abandoning them. It changes their role from landlord to channel: keep listing where it pays, but point the traffic at a property page you own, and capture the enquiry yourself. |

---

## 8. The ask

### The expensive part is already done.

The catalogue, the search, the lead pipeline, the content system, the permissions and the security model exist and work. What is left is finishing, launching and feeding it — substantially less work than what has already been paid for in effort.

1. **Approve the launch scope.** Confirm phase two — lead alerts, search groundwork, WhatsApp handoff, site copy editor.
2. **Provide the inventory.** Real listings, photography and agent details. The system is empty until Loymax fills it.
3. **Name an owner.** One person accountable for enquiry response time. The platform captures; a human converts.
4. **Set the review date.** Ninety days after launch, measured on enquiries received and viewings booked.

---

*Loymax Properties · Platform Investment Brief · Prepared from the current build · Figures marked "fill in" require Loymax's own contract data*
