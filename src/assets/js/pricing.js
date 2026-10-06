// Coatform Painting rough-estimate engine.
// Shared by the browser (instant fallback) and the AI estimate function (as a
// sanity anchor). Rates are typical Toronto/GTA ranges, labour + materials.
// Tweak RATES to match your real pricing — everything else follows.

export const SERVICES = {
  interior: { label: 'Interior painting', unit: 'rooms', paint: true },
  condo: { label: 'Condo / apartment painting', unit: 'rooms', paint: true },
  realestate: { label: 'Rental / move-out / listing painting', unit: 'rooms', paint: true },
  exterior: { label: 'Exterior house painting', unit: 'homeSqft', paint: true },
  siding: { label: 'Aluminum / vinyl siding painting', unit: 'homeSqft', paint: true },
  masonry: { label: 'Brick / stucco / limewash', unit: 'homeSqft', paint: true },
  cabinets: { label: 'Kitchen cabinet painting', unit: 'pieces', paint: true },
  trim: { label: 'Trim, doors & baseboards', unit: 'doors', paint: true },
  accent: { label: 'Accent / feature walls', unit: 'walls', paint: true },
  staircase: { label: 'Staircase & railing painting', unit: 'staircases', paint: true },
  deck: { label: 'Deck staining', unit: 'sqft', paint: true },
  fence: { label: 'Fence staining / painting', unit: 'linearFt', paint: true },
  popcorn: { label: 'Popcorn ceiling removal', unit: 'sqft', paint: true },
  wallpaper: { label: 'Wallpaper removal', unit: 'rooms', paint: true },
  drywall: { label: 'Drywall / plaster repair', unit: 'areas', paint: false },
  epoxy: { label: 'Epoxy / garage floor coating', unit: 'sqft', paint: false },
  commercial: { label: 'Commercial painting', unit: 'sqft', paint: true },
  newconstruction: { label: 'New construction / renovation painting', unit: 'sqft', paint: true },
};

const RATES = {
  roomWalls: [380, 620],
  roomCeiling: [140, 240],
  roomTrim: [130, 260],
  door: [90, 175],
  baseboardFt: [1.5, 3],
  exteriorSqft: [2.4, 4.3],
  sidingSqft: [2.0, 3.6],
  masonrySqft: [2.8, 5.0],
  cabinetPiece: [115, 190],
  accentWall: [250, 750],
  staircase: [1200, 3500],
  deckSqft: [3, 6],
  fenceFt: [8, 15],
  popcornSqft: [3.5, 7],
  wallpaperRoom: [450, 950],
  drywallArea: [220, 430],
  epoxySqft: [6, 12],
  commercialSqft: [2.5, 5],
  newConstructionSqft: [2.5, 4.5],
  minimumJob: 400,
  paintShare: 0.17, // approx share of the price that is paint, removed when the client supplies it
};

const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : d;
};
const round50 = (n) => Math.round(n / 50) * 50;

export function estimate(raw) {
  const i = normalize(raw);
  const items = [];
  const assumptions = [];
  const add = (label, qty, [lo, hi]) => {
    if (qty > 0) items.push({ label, low: qty * lo, high: qty * hi });
  };

  switch (i.service) {
    case 'interior':
    case 'condo':
    case 'realestate': {
      let rooms = i.rooms;
      if (!rooms && i.sqft) {
        rooms = Math.max(1, Math.round(i.sqft / 220));
        assumptions.push(`About ${rooms} rooms estimated from ${i.sqft} sq ft of floor area.`);
      }
      if (!rooms) {
        rooms = 1;
        assumptions.push('Assumed 1 room — add your room count for a better number.');
      }
      if (i.walls) add(`Walls — ${rooms} room${rooms > 1 ? 's' : ''}`, rooms, RATES.roomWalls);
      if (i.ceilings) add(`Ceilings — ${rooms} room${rooms > 1 ? 's' : ''}`, rooms, RATES.roomCeiling);
      if (i.trim) add('Baseboards & trim', rooms, RATES.roomTrim);
      add(`Doors (${i.doors})`, i.doors, RATES.door);
      if (!items.length) add(`Walls — ${rooms} room${rooms > 1 ? 's' : ''}`, rooms, RATES.roomWalls);
      break;
    }
    case 'exterior':
    case 'siding':
    case 'masonry': {
      const sqft = i.sqft || 2000;
      if (!i.sqft) assumptions.push('Assumed a 2,000 sq ft home — enter your home size for a better number.');
      const storey = { 1: 0.9, 2: 1, 3: 1.25 }[i.stories] || 1;
      const rate = { exterior: RATES.exteriorSqft, siding: RATES.sidingSqft, masonry: RATES.masonrySqft }[i.service];
      items.push({
        label: `${SERVICES[i.service].label} — ${sqft.toLocaleString()} sq ft home, ${i.stories} storey`,
        low: sqft * rate[0] * storey,
        high: sqft * rate[1] * storey,
      });
      add(`Exterior / garage doors (${i.doors})`, i.doors, [180, 400]);
      break;
    }
    case 'cabinets': {
      const pieces = i.pieces || 30;
      if (!i.pieces) assumptions.push('Assumed 30 doors & drawer fronts (an average kitchen).');
      add(`Cabinet doors & drawer fronts (${pieces})`, pieces, RATES.cabinetPiece);
      break;
    }
    case 'trim':
      add(`Doors (${i.doors || 6})`, i.doors || 6, RATES.door);
      add(`Baseboards (${i.linearFt} linear ft)`, i.linearFt, RATES.baseboardFt);
      if (!i.doors) assumptions.push('Assumed 6 doors.');
      break;
    case 'accent':
      add(`Feature walls (${i.rooms || 1})`, i.rooms || 1, RATES.accentWall);
      break;
    case 'staircase':
      add(`Staircases (${i.rooms || 1})`, i.rooms || 1, RATES.staircase);
      break;
    case 'deck':
      add(`Deck (${i.sqft || 300} sq ft)`, i.sqft || 300, RATES.deckSqft);
      if (!i.sqft) assumptions.push('Assumed a 300 sq ft deck.');
      break;
    case 'fence':
      add(`Fence (${i.linearFt || 100} linear ft, one side)`, i.linearFt || 100, RATES.fenceFt);
      if (!i.linearFt) assumptions.push('Assumed 100 linear ft of fence, one side.');
      break;
    case 'popcorn':
      add(`Ceiling area (${i.sqft || 500} sq ft) incl. skim coat & paint`, i.sqft || 500, RATES.popcornSqft);
      if (!i.sqft) assumptions.push('Assumed 500 sq ft of ceiling.');
      break;
    case 'wallpaper':
      add(`Rooms of wallpaper (${i.rooms || 1})`, i.rooms || 1, RATES.wallpaperRoom);
      break;
    case 'drywall':
      add(`Repair areas (${i.rooms || 2})`, i.rooms || 2, RATES.drywallArea);
      break;
    case 'epoxy':
      add(`Floor area (${i.sqft || 400} sq ft)`, i.sqft || 400, RATES.epoxySqft);
      if (!i.sqft) assumptions.push('Assumed a 400 sq ft double garage.');
      break;
    case 'commercial':
      add(`Commercial space (${i.sqft || 2000} sq ft)`, i.sqft || 2000, RATES.commercialSqft);
      if (!i.sqft) assumptions.push('Assumed 2,000 sq ft of floor area.');
      break;
    case 'newconstruction':
      add(`New construction (${i.sqft || 2000} sq ft)`, i.sqft || 2000, RATES.newConstructionSqft);
      if (!i.sqft) assumptions.push('Assumed 2,000 sq ft of floor area.');
      break;
  }

  // Multipliers
  let mult = 1;
  const notes = [];
  const interiorish = ['interior', 'condo', 'realestate', 'wallpaper', 'popcorn', 'accent', 'trim', 'staircase'].includes(i.service);
  if (interiorish) {
    const h = { '8': 1, '9': 1.12, '10': 1.3 }[i.ceilingHeight] || 1;
    if (h > 1) notes.push(`High ceilings (+${Math.round((h - 1) * 100)}%)`);
    mult *= h;
    if (i.furnished) { mult *= 1.05; notes.push('Furnished / occupied space (+5%)'); }
  }
  const cond = { good: 1, minor: 1.1, major: 1.3 }[i.condition] || 1;
  if (cond > 1) notes.push(`Surface prep & repairs (+${Math.round((cond - 1) * 100)}%)`);
  mult *= cond;
  if (i.colourChange === 'dramatic' && SERVICES[i.service].paint) { mult *= 1.12; notes.push('Dramatic colour change — extra coat (+12%)'); }
  if (i.timeline === 'asap') { mult *= 1.08; notes.push('Rush scheduling (+8%)'); }

  let low = items.reduce((s, x) => s + x.low, 0) * mult;
  let high = items.reduce((s, x) => s + x.high, 0) * mult;

  if (SERVICES[i.service].paint) {
    if (i.paintProvided) {
      const lo = low * RATES.paintShare;
      const hi = high * RATES.paintShare;
      notes.push('You supply the paint (paint cost removed)');
      // line items are scaled by `mult` on output, so store this one unscaled
      items.push({ label: 'Paint supplied by you', low: -lo / mult, high: -hi / mult });
      low -= lo;
      high -= hi;
    } else {
      const g = { standard: 0.95, premium: 1, ultra: 1.08 }[i.paintGrade] || 1;
      if (g !== 1) notes.push(g > 1 ? 'Ultra-premium paint (+8%)' : 'Standard-grade paint (−5%)');
      low *= g;
      high *= g;
    }
  }

  low = Math.max(RATES.minimumJob, round50(low));
  high = Math.max(low + 150, round50(high));

  return {
    low,
    high,
    lineItems: items.map((x) => ({ label: x.label, low: round50(x.low * mult), high: round50(x.high * mult) })),
    adjustments: notes,
    assumptions,
  };
}

export function normalize(raw = {}) {
  const service = SERVICES[raw.service] ? raw.service : 'interior';
  return {
    service,
    rooms: Math.min(num(raw.rooms), 60),
    sqft: Math.min(num(raw.sqft), 200000),
    linearFt: Math.min(num(raw.linearFt), 5000),
    pieces: Math.min(num(raw.pieces), 300),
    doors: Math.min(num(raw.doors), 200),
    stories: [1, 2, 3].includes(Number(raw.stories)) ? Number(raw.stories) : 2,
    ceilingHeight: ['8', '9', '10'].includes(String(raw.ceilingHeight)) ? String(raw.ceilingHeight) : '8',
    walls: raw.walls !== false && raw.walls !== 'false',
    ceilings: raw.ceilings === true || raw.ceilings === 'true' || raw.ceilings === 'on',
    trim: raw.trim === true || raw.trim === 'true' || raw.trim === 'on',
    condition: ['good', 'minor', 'major'].includes(raw.condition) ? raw.condition : 'good',
    colourChange: raw.colourChange === 'dramatic' ? 'dramatic' : 'similar',
    paintProvided: raw.paintProvided === true || raw.paintProvided === 'yes',
    paintGrade: ['standard', 'premium', 'ultra'].includes(raw.paintGrade) ? raw.paintGrade : 'premium',
    furnished: raw.furnished === true || raw.furnished === 'yes',
    timeline: ['flexible', 'month', 'asap'].includes(raw.timeline) ? raw.timeline : 'month',
    city: typeof raw.city === 'string' ? raw.city.slice(0, 60) : '',
    propertyType: typeof raw.propertyType === 'string' ? raw.propertyType.slice(0, 60) : '',
    details: typeof raw.details === 'string' ? raw.details.slice(0, 1500) : '',
  };
}

export const money = (n) =>
  n < 0 ? `−$${Math.abs(n).toLocaleString('en-CA')}` : `$${n.toLocaleString('en-CA')}`;
