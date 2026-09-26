import type { Category, CategorySlug, Product } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "pendant", name: "Pendant", plural: "Pendant Lights", blurb: "Suspended forms that define the space beneath them." },
  { slug: "ceiling", name: "Ceiling", plural: "Ceiling Lights", blurb: "Quiet fixtures that hold a room from above." },
  { slug: "table", name: "Table", plural: "Table Lamps", blurb: "Low, warm light for the places we linger." },
  { slug: "floor", name: "Floor", plural: "Floor Lamps", blurb: "Architectural verticals that anchor a corner." },
  { slug: "wall", name: "Wall", plural: "Wall Lights", blurb: "Light drawn onto the surface of a room." },
  { slug: "outdoor", name: "Outdoor", plural: "Outdoor Lighting", blurb: "Weather-sealed fixtures for thresholds and gardens." },
  { slug: "decorative", name: "Decorative", plural: "Decorative Lighting", blurb: "Sources worth seeing — filaments, globes, glass." },
];

const std = (price: number) => [{ id: "one", label: "One size", dims: "", price }];

export const PRODUCTS: Product[] = [
  {
    slug: "ora-pendant",
    name: "Ora",
    category: "pendant",
    collection: "terra",
    art: "ora",
    tagline: "A dark vessel under a turned oak crown.",
    description:
      "A wide spun-aluminium body is capped with solid turned oak. Light falls in a soft, downward pool; the shade itself stays dark and calm.",
    story:
      "Ora began as a study of the kettle — one continuous shoulder, one honest material change. The oak crown is turned from a single block and oiled by hand, so no two carry the same grain.",
    tags: ["featured", "bestseller"],
    finishes: [
      { id: "black-oak", name: "Matte Black / Oak", body: "black", trim: "oak", inner: "#e9e2d6" },
      { id: "chalk-oak", name: "Chalk / Oak", body: "chalk", trim: "oak", inner: "#f4efe6" },
      { id: "clay-walnut", name: "Clay / Walnut", body: "clay", trim: "walnut", inner: "#f0e1d3" },
    ],
    sizes: [
      { id: "s", label: "S", dims: "Ø 32 × H 22 cm", price: 540 },
      { id: "m", label: "M", dims: "Ø 45 × H 30 cm", price: 690 },
      { id: "l", label: "L", dims: "Ø 60 × H 38 cm", price: 920 },
    ],
    materials: ["Spun aluminium, powder-coated", "Solid oak, hand-oiled", "Black textile cable, 3 m"],
    light: { source: "E27, LED 8 W (included)", output: "806 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Cable", value: "300 cm, adjustable" },
      { label: "Canopy", value: "Ø 11 cm, matte black" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "2.4 kg (M)" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "vessel-pendant",
    name: "Vessel",
    category: "pendant",
    collection: "nocturne",
    art: "vessel",
    tagline: "Hand-beaten brass shell, copper-lined.",
    description:
      "A tall, tapered pendant hand-beaten from a single sheet. The interior is lined in polished copper, which warms the light before it leaves the shade.",
    story:
      "Each Vessel is raised over a wooden form in more than four thousand strikes. The faceted surface catches daylight; at night the copper interior glows like an ember.",
    tags: ["featured", "bestseller"],
    finishes: [
      { id: "black-copper", name: "Blackened / Copper", body: "black", trim: "brass", inner: "#c8743d" },
      { id: "brass", name: "Raw Brass", body: "brass", trim: "brass", inner: "#d9a857" },
      { id: "white-copper", name: "Porcelain White / Copper", body: "white", trim: "brass", inner: "#c8743d" },
    ],
    sizes: [
      { id: "s", label: "S", dims: "Ø 24 × H 30 cm", price: 480 },
      { id: "l", label: "L", dims: "Ø 36 × H 44 cm", price: 720 },
    ],
    materials: ["Hand-beaten brass sheet", "Polished copper interior", "Black textile cable, 3 m"],
    light: { source: "E27, LED 6 W (included)", output: "600 lm", temperature: "2400 K", dimmable: true },
    details: [
      { label: "Cable", value: "300 cm, adjustable" },
      { label: "Canopy", value: "Ø 10 cm" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "1.9 kg (L)" },
    ],
    leadTime: "Made to order · 3 weeks",
    designer: "Ines Aldana",
  },
  {
    slug: "cloche-pendant",
    name: "Cloche",
    category: "pendant",
    collection: "clarion",
    art: "cloche",
    tagline: "Mouth-blown glass around a visible source.",
    description:
      "A tall bell of mouth-blown glass encloses a single filament bulb. Clear, smoke or amber — the glass decides the mood of the room.",
    story:
      "Cloche is blown into a beechwood mould in a small Bohemian glassworks. Tiny seeds and variations in the glass are the signature of the hand, not a flaw.",
    tags: ["new", "featured"],
    finishes: [
      { id: "clear", name: "Clear Glass", body: "anthracite", trim: "chrome", glass: "clear" },
      { id: "smoke", name: "Smoke Glass", body: "anthracite", trim: "black", glass: "smoke" },
      { id: "amber", name: "Amber Glass", body: "anthracite", trim: "brass", glass: "amber" },
    ],
    sizes: [
      { id: "s", label: "S", dims: "Ø 18 × H 26 cm", price: 360 },
      { id: "l", label: "L", dims: "Ø 26 × H 38 cm", price: 490 },
    ],
    materials: ["Mouth-blown glass", "Anodised aluminium socket", "Textile cable, 3 m"],
    light: { source: "E27, LED filament ST64 (included)", output: "470 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Cable", value: "300 cm, adjustable" },
      { label: "Canopy", value: "Ø 10 cm" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "1.6 kg (L)" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "arc-shade",
    name: "Arc Shade",
    category: "pendant",
    collection: "nocturne",
    art: "arc",
    tagline: "A broad enamel hat with a brass throat.",
    description:
      "A low, wide enamel shade with a solid brass socket and an exposed teardrop filament. Built to hang low over a long table.",
    story:
      "Arc Shade borrows the profile of the workshop lamp and removes everything unnecessary. The enamel is fired twice for a deep, even finish that ages slowly.",
    tags: ["bestseller"],
    finishes: [
      { id: "black-brass", name: "Black / Brass", body: "black", trim: "brass", inner: "#f3eee5" },
      { id: "white-brass", name: "White / Brass", body: "white", trim: "brass", inner: "#f6f3ee" },
      { id: "sage-brass", name: "Sage / Brass", body: "sage", trim: "brass", inner: "#f1efe8" },
    ],
    sizes: [
      { id: "m", label: "Ø 45", dims: "Ø 45 × H 22 cm", price: 420 },
      { id: "l", label: "Ø 60", dims: "Ø 60 × H 26 cm", price: 540 },
    ],
    materials: ["Vitreous enamel on steel", "Solid brass socket", "Black textile cable, 3 m"],
    light: { source: "E27, LED filament ST64 (included)", output: "470 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Cable", value: "300 cm, adjustable" },
      { label: "Canopy", value: "Ø 10 cm, brass" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "2.1 kg (Ø 60)" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "cage-globe",
    name: "Cage Globe",
    category: "pendant",
    collection: "meridian",
    art: "cage",
    tagline: "A drawn wire sphere that casts its own geometry.",
    description:
      "Twenty-two drawn wires form an open sphere around a clear globe source. At night, the cage throws a fine meridian pattern across the ceiling.",
    story:
      "Each wire is bent by hand on a jig and brazed at the poles. It is a lamp that behaves like a drawing: the light is inside, the lines are outside.",
    tags: ["featured"],
    finishes: [
      { id: "copper", name: "Copper", body: "copper", trim: "copper" },
      { id: "brass", name: "Brushed Brass", body: "brass", trim: "brass" },
      { id: "black", name: "Graphite", body: "black", trim: "black" },
    ],
    sizes: [
      { id: "m", label: "Ø 40", dims: "Ø 40 × H 44 cm", price: 590 },
      { id: "l", label: "Ø 55", dims: "Ø 55 × H 60 cm", price: 780 },
    ],
    materials: ["Drawn steel wire, plated", "Brass pole caps", "Textile cable, 3 m"],
    light: { source: "E27, LED G95 globe (included)", output: "600 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Cable", value: "300 cm, adjustable" },
      { label: "Canopy", value: "Ø 11 cm" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "2.8 kg (Ø 55)" },
    ],
    leadTime: "Made to order · 2 weeks",
    designer: "Ines Aldana",
  },
  {
    slug: "frame-lantern",
    name: "Frame Lantern",
    category: "pendant",
    collection: "nocturne",
    art: "lantern",
    tagline: "A hanging lantern in black steel and glass.",
    description:
      "A slender steel frame with clear glass panels, hung from a forged chain. Architectural in daylight; a small lit room at night.",
    story:
      "Frame Lantern references the stair lanterns of old townhouses, redrawn with a finer section and a single, precise corner post facing the room.",
    tags: [],
    finishes: [
      { id: "black", name: "Forged Black", body: "black", trim: "black", glass: "clear" },
      { id: "brass", name: "Aged Brass", body: "bronze", trim: "brass", glass: "clear" },
    ],
    sizes: std(390),
    materials: ["Powder-coated steel", "Clear float glass", "Forged chain, 100 cm"],
    light: { source: "E27, LED filament ST64 (included)", output: "470 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Dimensions", value: "W 22 × H 40 cm" },
      { label: "Chain", value: "100 cm + 200 cm cable" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "2.9 kg" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "knot-pendant",
    name: "Knot",
    category: "pendant",
    collection: "terra",
    art: "knot",
    tagline: "Braided jute, one knot, one globe.",
    description:
      "A thick braided rope carries a single opal-free globe. The knot is tied by hand and sets the drop — adjust it and the lamp follows.",
    story:
      "Knot is our most tactile object: natural jute braided around a certified cable, finished with a matte black socket. Simple, direct, surprisingly sculptural.",
    tags: ["new"],
    finishes: [
      { id: "jute", name: "Natural Jute", body: "black", trim: "black", inner: "#b58a5a" },
      { id: "charcoal", name: "Charcoal Rope", body: "black", trim: "black", inner: "#3b3a38" },
    ],
    sizes: std(260),
    materials: ["Braided jute over textile cable", "Powder-coated steel socket", "Ceiling canopy in black"],
    light: { source: "E27, LED G125 filament (included)", output: "806 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Drop", value: "200 cm, knot-adjustable" },
      { label: "Canopy", value: "Ø 10 cm" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "1.1 kg" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "cone-glass-pendant",
    name: "Pale Cone",
    category: "pendant",
    collection: "clarion",
    art: "cone",
    tagline: "A clear glass cone on a porcelain collar.",
    description:
      "A thin-walled glass cone hangs from a white porcelain socket. Almost invisible by day; by night it becomes a lantern of reflections.",
    story:
      "Pale Cone was designed to disappear. Hung in groups over a counter, the glass reads as a single layer of light floating in the room.",
    tags: [],
    finishes: [
      { id: "clear-white", name: "Clear / Porcelain", body: "white", trim: "white", glass: "clear" },
      { id: "smoke-black", name: "Smoke / Black", body: "black", trim: "black", glass: "smoke" },
    ],
    sizes: std(320),
    materials: ["Borosilicate glass", "Glazed porcelain socket", "White textile cable, 3 m"],
    light: { source: "E27, LED A60 opal (included)", output: "806 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Dimensions", value: "Ø 26 × H 28 cm" },
      { label: "Cable", value: "300 cm, adjustable" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "1.2 kg" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "halo-ring",
    name: "Halo Ring",
    category: "ceiling",
    collection: "meridian",
    art: "halo",
    tagline: "Six sources on a floating oak ring.",
    description:
      "A solid oak ring carries six upright filament sources, suspended on fine steel rods. A chandelier without ornament.",
    story:
      "Halo Ring is steam-bent from a single length of oak, then fitted with brass sockets by hand. It gives a dining room a centre without closing the view.",
    tags: ["featured"],
    finishes: [
      { id: "oak-black", name: "Oak / Black", body: "black", trim: "oak" },
      { id: "walnut-brass", name: "Walnut / Brass", body: "brass", trim: "walnut" },
    ],
    sizes: [
      { id: "m", label: "Ø 70", dims: "Ø 70 × H 90 cm", price: 1280 },
      { id: "l", label: "Ø 100", dims: "Ø 100 × H 110 cm", price: 1680 },
    ],
    materials: ["Steam-bent solid oak", "Brass sockets", "Stainless steel rods"],
    light: { source: "6 × E14, LED filament (included)", output: "6 × 250 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Suspension", value: "Rods, 60–120 cm" },
      { label: "Canopy", value: "Ø 14 cm" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "5.6 kg (Ø 70)" },
    ],
    leadTime: "Made to order · 4 weeks",
    designer: "Ines Aldana",
  },
  {
    slug: "plane-flush",
    name: "Plane",
    category: "ceiling",
    collection: "clarion",
    art: "disc",
    tagline: "A shallow opal dome, close to the ceiling.",
    description:
      "A low-profile flush mount with an opal glass dome and a slim metal collar. Even, glare-free light for corridors and bedrooms.",
    story:
      "Plane is the fixture you stop noticing — and that is the point. Its opal glass is triple-cased to hide the source completely.",
    tags: [],
    finishes: [
      { id: "opal-white", name: "Opal / White", body: "white", trim: "white", glass: "opal" },
      { id: "opal-brass", name: "Opal / Brass", body: "brass", trim: "brass", glass: "opal" },
    ],
    sizes: [
      { id: "s", label: "Ø 30", dims: "Ø 30 × H 12 cm", price: 280 },
      { id: "l", label: "Ø 45", dims: "Ø 45 × H 15 cm", price: 360 },
    ],
    materials: ["Triple-cased opal glass", "Spun steel collar", "Integrated driver"],
    light: { source: "Integrated LED 18 W", output: "1800 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Mounting", value: "Flush, ceiling" },
      { label: "CRI", value: "> 95" },
      { label: "Rating", value: "IP44 · bathroom safe" },
      { label: "Weight", value: "2.2 kg (Ø 45)" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "cap-table-lamp",
    name: "Cap",
    category: "table",
    collection: "terra",
    art: "cap",
    tagline: "A soft dome on a slender stem.",
    description:
      "A domed shade over a tapered stem, in a single colour. The light is thrown down onto the table and bounces softly back up under the dome.",
    story:
      "Cap is lacquered in eight coats and hand-polished between each. The colours are mixed in-house from earth pigments.",
    tags: ["bestseller", "new"],
    finishes: [
      { id: "chalk", name: "Chalk", body: "chalk", trim: "white", inner: "#fbf7f0" },
      { id: "clay", name: "Clay", body: "clay", trim: "white", inner: "#f7e8dc" },
      { id: "black", name: "Matte Black", body: "black", trim: "black", inner: "#efe9df" },
    ],
    sizes: [
      { id: "s", label: "S", dims: "Ø 25 × H 34 cm", price: 290 },
      { id: "m", label: "M", dims: "Ø 40 × H 50 cm", price: 420 },
    ],
    materials: ["Lacquered aluminium", "Weighted steel base", "Fabric cable with in-line dimmer"],
    light: { source: "Integrated LED 9 W", output: "900 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Cable", value: "200 cm, fabric" },
      { label: "Switch", value: "In-line dimmer" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "2.3 kg (M)" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "orb-table-lamp",
    name: "Orb",
    category: "table",
    collection: "clarion",
    art: "orb",
    tagline: "An opal moon resting on brass.",
    description:
      "A cased-opal sphere sits on a machined brass base. Unlit, it is a sculpture; lit, the whole globe glows with an even, moon-like light.",
    story:
      "Orb is blown in a single gather and acid-etched on the inside, so the surface you touch stays glossy while the light is perfectly diffused.",
    tags: ["featured"],
    finishes: [
      { id: "opal-brass", name: "Opal / Brass", body: "brass", trim: "brass", glass: "opal" },
      { id: "opal-black", name: "Opal / Black", body: "black", trim: "black", glass: "opal" },
    ],
    sizes: [
      { id: "s", label: "Ø 20", dims: "Ø 20 × H 26 cm", price: 340 },
      { id: "l", label: "Ø 30", dims: "Ø 30 × H 38 cm", price: 480 },
    ],
    materials: ["Cased opal glass", "Machined solid brass", "Clear braided cable"],
    light: { source: "E14, LED 4 W (included)", output: "470 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Cable", value: "200 cm" },
      { label: "Switch", value: "Touch dimmer on base" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "3.1 kg (Ø 30)" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Ines Aldana",
  },
  {
    slug: "stem-floor-lamp",
    name: "Stem",
    category: "floor",
    collection: "nocturne",
    art: "stem",
    tagline: "A single line that bends toward the page.",
    description:
      "A tall steel stem curves over into a small conical shade — a reading light with the presence of a drawing.",
    story:
      "Stem is bent from one continuous tube. We spent a year on the radius of the curve: tight enough to feel intentional, soft enough to feel grown.",
    tags: ["new"],
    finishes: [
      { id: "black", name: "Matte Black", body: "black", trim: "black", inner: "#efe9df" },
      { id: "brass", name: "Brushed Brass", body: "brass", trim: "brass", inner: "#f3e7cf" },
    ],
    sizes: std(640),
    materials: ["Bent steel tube", "Solid marble counterweight", "Foot switch"],
    light: { source: "GU10, LED 6 W (included)", output: "450 lm", temperature: "2700 K", dimmable: false },
    details: [
      { label: "Dimensions", value: "H 152 × reach 48 cm" },
      { label: "Base", value: "Ø 26 cm marble" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "8.4 kg" },
    ],
    leadTime: "Ships in 1–2 weeks",
    designer: "Studio Vesper",
  },
  {
    slug: "tripod-floor-lamp",
    name: "Tripod",
    category: "floor",
    collection: "terra",
    art: "tripod",
    tagline: "Three oak legs, one linen drum.",
    description:
      "Three turned oak legs meet under a tall linen drum. The fabric glows at night, lighting the room from its own centre.",
    story:
      "Tripod is turned, jointed and oiled in a family workshop in the Jura. The linen is woven with a slub that softens the light as it passes through.",
    tags: ["bestseller"],
    finishes: [
      { id: "oak-linen", name: "Oak / Natural Linen", body: "linen", trim: "oak" },
      { id: "walnut-linen", name: "Walnut / Natural Linen", body: "linen", trim: "walnut" },
    ],
    sizes: std(760),
    materials: ["Turned solid oak", "Natural Belgian linen", "Brass hub"],
    light: { source: "E27, LED 10 W (included)", output: "1055 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Dimensions", value: "Ø 48 × H 160 cm" },
      { label: "Shade", value: "Ø 45 × H 40 cm" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "6.2 kg" },
    ],
    leadTime: "Made to order · 3 weeks",
    designer: "Studio Vesper",
  },
  {
    slug: "swing-sconce",
    name: "Swing",
    category: "wall",
    collection: "meridian",
    art: "swing",
    tagline: "An articulated brass arm for the bedside.",
    description:
      "A wall-mounted reading light with a pivoting arm and a small brass cone. Swings flat to the wall when not in use.",
    story:
      "Swing is machined from solid brass bar, with friction hinges tuned so the arm holds exactly where you leave it.",
    tags: ["featured"],
    finishes: [
      { id: "brass", name: "Brushed Brass", body: "brass", trim: "brass", inner: "#f3e7cf" },
      { id: "black-brass", name: "Black / Brass", body: "black", trim: "brass", inner: "#efe9df" },
    ],
    sizes: std(380),
    materials: ["Solid brass", "Friction hinges", "Hardwired or plug-in"],
    light: { source: "G9, LED 3 W (included)", output: "350 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Reach", value: "32–58 cm" },
      { label: "Backplate", value: "8 × 22 cm" },
      { label: "Rating", value: "IP20 · indoor" },
      { label: "Weight", value: "1.4 kg" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Ines Aldana",
  },
  {
    slug: "globe-wall",
    name: "Moon Wall",
    category: "wall",
    collection: "clarion",
    art: "globewall",
    tagline: "An opal globe, held off the wall.",
    description:
      "A cased-opal sphere on a short brass arm. Paired either side of a mirror or in a corridor, it reads as a line of small moons.",
    story:
      "Moon Wall uses the same glass as Orb, blown slightly thinner so it lights evenly from a smaller source.",
    tags: [],
    finishes: [
      { id: "opal-brass", name: "Opal / Brass", body: "brass", trim: "brass", glass: "opal" },
      { id: "opal-black", name: "Opal / Black", body: "black", trim: "black", glass: "opal" },
    ],
    sizes: std(310),
    materials: ["Cased opal glass", "Solid brass arm and plate"],
    light: { source: "G9, LED 3 W (included)", output: "350 lm", temperature: "2700 K", dimmable: true },
    details: [
      { label: "Dimensions", value: "Ø 20 × D 26 cm" },
      { label: "Mounting", value: "Hardwired" },
      { label: "Rating", value: "IP44 · bathroom safe" },
      { label: "Weight", value: "1.3 kg" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "pier-bollard",
    name: "Pier",
    category: "outdoor",
    collection: "nocturne",
    art: "bollard",
    tagline: "A louvred post for paths and edges.",
    description:
      "A cast-aluminium bollard with a louvred head that throws light low onto the ground, never into the eye.",
    story:
      "Pier is sealed to IP65 and finished in a fine-texture anthracite that weathers without chalking. It is designed to be forgotten in daylight.",
    tags: [],
    finishes: [
      { id: "anthracite", name: "Anthracite", body: "anthracite", trim: "black" },
      { id: "bronze", name: "Weathered Bronze", body: "bronze", trim: "black" },
    ],
    sizes: [
      { id: "s", label: "H 45", dims: "W 14 × H 45 cm", price: 340 },
      { id: "l", label: "H 80", dims: "W 14 × H 80 cm", price: 450 },
    ],
    materials: ["Cast aluminium", "Opal polycarbonate diffuser", "Stainless fixings"],
    light: { source: "Integrated LED 7 W", output: "520 lm", temperature: "3000 K", dimmable: false },
    details: [
      { label: "Rating", value: "IP65 · outdoor" },
      { label: "Mounting", value: "Ground anchor" },
      { label: "Finish", value: "Marine-grade powder coat" },
      { label: "Weight", value: "4.6 kg (H 80)" },
    ],
    leadTime: "Ships in 1–2 weeks",
    designer: "Studio Vesper",
  },
  {
    slug: "harbour-lantern",
    name: "Harbour",
    category: "outdoor",
    collection: "nocturne",
    art: "harbour",
    tagline: "A wall lantern for the front door.",
    description:
      "A tapered lantern in black steel with smoked glass, carried on a wall bracket. The classic threshold light, drawn with a finer line.",
    story:
      "Harbour is our tribute to the port lanterns of the North Sea: galvanised, powder-coated and gasketed for coastal weather.",
    tags: ["bestseller"],
    finishes: [
      { id: "black-smoke", name: "Black / Smoke", body: "black", trim: "black", glass: "smoke" },
      { id: "black-clear", name: "Black / Clear", body: "black", trim: "black", glass: "clear" },
    ],
    sizes: std(290),
    materials: ["Galvanised steel, powder-coated", "Tempered glass", "Silicone gaskets"],
    light: { source: "E27, LED filament (included)", output: "470 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Dimensions", value: "W 18 × H 36 × D 24 cm" },
      { label: "Rating", value: "IP44 · outdoor" },
      { label: "Mounting", value: "Wall, hardwired" },
      { label: "Weight", value: "2.1 kg" },
    ],
    leadTime: "Ships in 3–5 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "globe-filament",
    name: "Globe G125",
    category: "decorative",
    collection: "clarion",
    art: "globe",
    tagline: "A spiral filament in a large amber globe.",
    description:
      "A 125 mm globe with a long spiral filament, made to be seen. Hang it bare on a textile cable or fit it into any open fixture.",
    story:
      "We tuned the spiral filament by hand for a warm 2000 K glow — the colour of a candle — with modern LED efficiency.",
    tags: ["new"],
    finishes: [
      { id: "amber", name: "Amber Glass", body: "black", trim: "brass", glass: "amber" },
      { id: "clear", name: "Clear Glass", body: "black", trim: "brass", glass: "clear" },
    ],
    sizes: std(48),
    materials: ["Blown glass", "Brass-plated E27 cap"],
    light: { source: "LED spiral filament 4 W", output: "300 lm", temperature: "2000 K", dimmable: true },
    details: [
      { label: "Dimensions", value: "Ø 12.5 × H 17.5 cm" },
      { label: "Fitting", value: "E27" },
      { label: "Lifetime", value: "15,000 h" },
      { label: "Pendant set", value: "Cable sold separately" },
    ],
    leadTime: "Ships in 1–2 working days",
    designer: "Studio Vesper",
  },
  {
    slug: "edison-st64",
    name: "Edison ST64",
    category: "decorative",
    collection: "nocturne",
    art: "teardrop",
    tagline: "The classic teardrop, rebuilt in LED.",
    description:
      "A teardrop-shaped source with a looped vertical filament. The honest, familiar shape — at a fraction of the energy.",
    story:
      "The ST64 is the bulb we fit to half our catalogue. We made our own so the colour matches from fixture to fixture.",
    tags: ["bestseller"],
    finishes: [
      { id: "clear", name: "Clear Glass", body: "black", trim: "brass", glass: "clear" },
      { id: "amber", name: "Amber Glass", body: "black", trim: "brass", glass: "amber" },
    ],
    sizes: std(32),
    materials: ["Blown glass", "Brass-plated E27 cap"],
    light: { source: "LED looped filament 6 W", output: "470 lm", temperature: "2200 K", dimmable: true },
    details: [
      { label: "Dimensions", value: "Ø 6.4 × H 14 cm" },
      { label: "Fitting", value: "E27" },
      { label: "Lifetime", value: "15,000 h" },
      { label: "CRI", value: "> 90" },
    ],
    leadTime: "Ships in 1–2 working days",
    designer: "Studio Vesper",
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const productsInCategory = (slug: CategorySlug) => PRODUCTS.filter((p) => p.category === slug);

export const minPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.price));

export const hasTag = (tag: Product["tags"][number]) => PRODUCTS.filter((p) => p.tags.includes(tag));

/** Related: same collection first, then same category, excluding self. */
export function relatedProducts(p: Product, n = 4) {
  const pool = [
    ...PRODUCTS.filter((x) => x.slug !== p.slug && x.collection === p.collection),
    ...PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category && x.collection !== p.collection),
    ...PRODUCTS.filter((x) => x.slug !== p.slug),
  ];
  return [...new Map(pool.map((x) => [x.slug, x])).values()].slice(0, n);
}

/** Next product in catalogue order, wrapping — used for the peeking "next" fixture on the product page. */
export function nextProduct(p: Product) {
  const i = PRODUCTS.findIndex((x) => x.slug === p.slug);
  return PRODUCTS[(i + 1) % PRODUCTS.length];
}
