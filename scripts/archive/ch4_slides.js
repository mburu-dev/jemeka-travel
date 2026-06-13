const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

// ── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  navy:    '1F4E79',
  blue:    '2E75B6',
  teal:    '31849B',
  gold:    'D4A017',
  cream:   'FEF9E7',
  lightBl: 'EBF5FB',
  white:   'FFFFFF',
  offWhite:'F8FAFB',
  gray:    '6B7280',
  darkGray:'374151',
  red:     'C0392B',
  green:   '1A7340',
};

const FONT = 'Calibri';

// ── Helpers ──────────────────────────────────────────────────────────────────

function addCoverSlide(title, subtitle, verse, verseRef) {
  const slide = pptx.addSlide();
  // Background gradient-like via two rects
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 5.2, w: '100%', h: 2.3, fill: { color: C.blue, transparency: 60 } });
  // Gold accent bar
  slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.1, w: 0.08, h: 1.8, fill: { color: C.gold } });
  // Overline
  slide.addText('INTRODUCTION TO PHILOSOPHY', {
    x: 0.8, y: 0.9, w: 11.5, h: 0.35,
    fontSize: 11, color: 'BDD7EE', fontFace: FONT, charSpacing: 4, bold: false,
  });
  // Chapter label
  slide.addText('CHAPTER 4', {
    x: 0.8, y: 1.25, w: 11.5, h: 0.55,
    fontSize: 38, color: C.gold, fontFace: FONT, bold: true, charSpacing: 6,
  });
  // Title
  slide.addText(title, {
    x: 0.8, y: 1.9, w: 11.5, h: 1.1,
    fontSize: 32, color: C.white, fontFace: FONT, bold: true,
  });
  // Subtitle
  slide.addText(subtitle, {
    x: 0.8, y: 3.05, w: 11.5, h: 0.45,
    fontSize: 16, color: 'BDD7EE', fontFace: FONT, italic: true,
  });
  // Verse box
  slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 3.7, w: 12.1, h: 1.0, fill: { color: C.teal, transparency: 70 }, line: { color: C.teal, width: 1 } });
  slide.addText(`"${verse}"`, {
    x: 0.75, y: 3.72, w: 11.8, h: 0.55,
    fontSize: 13, color: C.white, fontFace: FONT, italic: true, align: 'center',
  });
  slide.addText(`— ${verseRef}`, {
    x: 0.75, y: 4.27, w: 11.8, h: 0.35,
    fontSize: 11, color: 'BDD7EE', fontFace: FONT, align: 'center', bold: true,
  });
}

function addSectionDivider(num, title, subtitle) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.25, h: '100%', fill: { color: C.gold } });
  slide.addText(`SECTION ${num}`, {
    x: 0.55, y: 1.4, w: 12, h: 0.6,
    fontSize: 18, color: C.gold, fontFace: FONT, bold: true, charSpacing: 6,
  });
  slide.addText(title, {
    x: 0.55, y: 2.1, w: 12, h: 1.2,
    fontSize: 36, color: C.white, fontFace: FONT, bold: true,
  });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 3.45, w: 5, h: 0.05, fill: { color: C.teal } });
  slide.addText(subtitle, {
    x: 0.55, y: 3.65, w: 12, h: 0.5,
    fontSize: 16, color: 'BDD7EE', fontFace: FONT, italic: true,
  });
}

// Standard content slide: title + bullets
function addBulletSlide(title, bullets, tag) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.offWhite } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.05, fill: { color: C.navy } });
  if (tag) {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.2, h: 1.05, fill: { color: C.gold } });
    slide.addText(tag, { x: 0.3, y: 0.05, w: 4, h: 0.35, fontSize: 10, color: C.gold, fontFace: FONT, bold: true, charSpacing: 3 });
  }
  slide.addText(title, { x: 0.3, y: 0.38, w: 12.7, h: 0.58, fontSize: 22, color: C.white, fontFace: FONT, bold: true });
  const rows = bullets.map(b => ({
    text: typeof b === 'string' ? b : b.text,
    options: { fontSize: typeof b === 'object' && b.sub ? 14 : 16, color: C.darkGray, fontFace: FONT,
               indentLevel: typeof b === 'object' && b.sub ? 1 : 0, bullet: { type: 'bullet', color: C.blue } }
  }));
  slide.addText(rows, { x: 0.5, y: 1.2, w: 12.3, h: 6.0, valign: 'top', paraSpaceAfter: 8 });
}

// Two column slide
function addTwoColSlide(title, leftHead, leftItems, rightHead, rightItems, tag) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.offWhite } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.05, fill: { color: C.navy } });
  if (tag) {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.2, h: 1.05, fill: { color: C.gold } });
    slide.addText(tag, { x: 0.3, y: 0.05, w: 4, h: 0.35, fontSize: 10, color: C.gold, fontFace: FONT, bold: true, charSpacing: 3 });
  }
  slide.addText(title, { x: 0.3, y: 0.38, w: 12.7, h: 0.58, fontSize: 22, color: C.white, fontFace: FONT, bold: true });
  // Left col
  slide.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.2, w: 5.9, h: 5.9, fill: { color: C.lightBl }, line: { color: C.blue, width: 0.5 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.2, w: 5.9, h: 0.5, fill: { color: C.blue } });
  slide.addText(leftHead, { x: 0.5, y: 1.22, w: 5.7, h: 0.45, fontSize: 14, color: C.white, fontFace: FONT, bold: true });
  const lRows = leftItems.map(t => ({ text: t, options: { fontSize: 14, color: C.darkGray, fontFace: FONT, bullet: { type: 'bullet', color: C.blue } } }));
  slide.addText(lRows, { x: 0.5, y: 1.8, w: 5.7, h: 5.1, valign: 'top', paraSpaceAfter: 8 });
  // Right col
  slide.addShape(pptx.ShapeType.rect, { x: 6.95, y: 1.2, w: 5.9, h: 5.9, fill: { color: C.cream }, line: { color: C.gold, width: 0.5 } });
  slide.addShape(pptx.ShapeType.rect, { x: 6.95, y: 1.2, w: 5.9, h: 0.5, fill: { color: C.gold } });
  slide.addText(rightHead, { x: 7.05, y: 1.22, w: 5.7, h: 0.45, fontSize: 14, color: C.white, fontFace: FONT, bold: true });
  const rRows = rightItems.map(t => ({ text: t, options: { fontSize: 14, color: C.darkGray, fontFace: FONT, bullet: { type: 'bullet', color: C.gold } } }));
  slide.addText(rRows, { x: 7.05, y: 1.8, w: 5.7, h: 5.1, valign: 'top', paraSpaceAfter: 8 });
}

// Callout / illustration slide
function addCalloutSlide(title, label, text, labelColor, bgColor) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.offWhite } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.05, fill: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.2, h: 1.05, fill: { color: C.gold } });
  slide.addText(title, { x: 0.3, y: 0.18, w: 12.7, h: 0.7, fontSize: 22, color: C.white, fontFace: FONT, bold: true });
  // Callout box
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 12.3, h: 5.8, fill: { color: bgColor || C.lightBl }, line: { color: labelColor || C.blue, width: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 2.0, h: 5.8, fill: { color: labelColor || C.navy } });
  // Rotated label text (simulate with stacked chars)
  slide.addText(label, { x: 0.52, y: 2.5, w: 1.96, h: 3.3, fontSize: 13, color: C.white, fontFace: FONT, bold: true, align: 'center', valign: 'middle' });
  slide.addText(text, { x: 2.7, y: 1.45, w: 9.9, h: 5.4, fontSize: 15, color: C.darkGray, fontFace: FONT, valign: 'middle', paraSpaceAfter: 10 });
}

// Quote slide
function addQuoteSlide(quote, attribution, context) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.2, h: '100%', fill: { color: C.gold } });
  slide.addShape(pptx.ShapeType.rect, { x: 12.9, y: 0, w: 0.2, h: '100%', fill: { color: C.gold } });
  slide.addText('\u201C', { x: 0.5, y: 0.2, w: 2, h: 2, fontSize: 120, color: C.teal, fontFace: FONT, bold: true, transparency: 40 });
  slide.addText(quote, { x: 1.2, y: 1.0, w: 11.0, h: 3.8, fontSize: 22, color: C.white, fontFace: FONT, italic: true, align: 'center', valign: 'middle' });
  if (attribution) {
    slide.addText(`\u2014 ${attribution}`, { x: 1.2, y: 5.0, w: 11.0, h: 0.5, fontSize: 14, color: C.gold, fontFace: FONT, bold: true, align: 'center' });
  }
  if (context) {
    slide.addText(context, { x: 1.2, y: 5.6, w: 11.0, h: 0.7, fontSize: 12, color: 'BDD7EE', fontFace: FONT, align: 'center', italic: true });
  }
}

// Table slide
function addTableSlide(title, headers, rows, tag) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.offWhite } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.05, fill: { color: C.navy } });
  if (tag) {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.2, h: 1.05, fill: { color: C.gold } });
    slide.addText(tag, { x: 0.3, y: 0.05, w: 4, h: 0.35, fontSize: 10, color: C.gold, fontFace: FONT, bold: true, charSpacing: 3 });
  }
  slide.addText(title, { x: 0.3, y: 0.38, w: 12.7, h: 0.58, fontSize: 22, color: C.white, fontFace: FONT, bold: true });
  const colW = (12.33 / headers.length);
  const tableRows = [
    headers.map(h => ({ text: h, options: { bold: true, fontSize: 13, color: C.white, fontFace: FONT, fill: { color: C.navy }, align: 'center' } })),
    ...rows.map((row, ri) => row.map(cell => ({
      text: cell,
      options: { fontSize: 12, color: C.darkGray, fontFace: FONT, fill: { color: ri % 2 === 0 ? C.white : C.lightBl }, valign: 'middle' }
    })))
  ];
  slide.addTable(tableRows, {
    x: 0.5, y: 1.2, w: 12.33,
    colW: headers.map(() => colW),
    rowH: 0.48,
    border: { type: 'solid', color: 'BDD7EE', pt: 0.5 },
  });
}

// Christian Connection slide
function addConnectionSlide(thinkerTitle, connectionText, scripture, scriptureRef) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.offWhite } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.05, fill: { color: C.teal } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.2, h: 1.05, fill: { color: C.gold } });
  slide.addText('✦  CHRISTIAN CONNECTION', { x: 0.3, y: 0.08, w: 8, h: 0.35, fontSize: 11, color: C.gold, fontFace: FONT, bold: true, charSpacing: 2 });
  slide.addText(thinkerTitle, { x: 0.3, y: 0.42, w: 12.7, h: 0.52, fontSize: 20, color: C.white, fontFace: FONT, bold: true });
  // Connection box
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 12.3, h: 3.6, fill: { color: C.lightBl }, line: { color: C.teal, width: 1 } });
  slide.addText(connectionText, { x: 0.7, y: 1.32, w: 11.9, h: 3.3, fontSize: 15, color: C.darkGray, fontFace: FONT, valign: 'middle', paraSpaceAfter: 8 });
  // Scripture
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.95, w: 12.3, h: 1.4, fill: { color: C.navy }, line: { color: C.gold, width: 1 } });
  slide.addText(`"${scripture}"`, { x: 0.7, y: 5.02, w: 11.9, h: 0.85, fontSize: 14, color: C.white, fontFace: FONT, italic: true, align: 'center', valign: 'middle' });
  slide.addText(`— ${scriptureRef}`, { x: 0.7, y: 5.88, w: 11.9, h: 0.38, fontSize: 12, color: C.gold, fontFace: FONT, bold: true, align: 'center' });
}

// Reflection slide
function addReflectionSlide(question) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.cream } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.12, fill: { color: C.gold } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.38, w: '100%', h: 0.12, fill: { color: C.gold } });
  slide.addText('REFLECTION QUESTION', { x: 0.5, y: 0.4, w: 12.3, h: 0.45, fontSize: 13, color: C.teal, fontFace: FONT, bold: true, charSpacing: 3, align: 'center' });
  slide.addText('?', { x: 5.4, y: 0.9, w: 2.5, h: 2, fontSize: 120, color: C.gold, fontFace: FONT, bold: true, align: 'center', transparency: 30 });
  slide.addText(question, { x: 1.0, y: 2.2, w: 11.3, h: 4.5, fontSize: 20, color: C.darkGray, fontFace: FONT, align: 'center', valign: 'middle', italic: true });
}

// Summary/closer slide
function addCloserSlide(title, text) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 6.5, w: '100%', h: 1.0, fill: { color: C.teal, transparency: 50 } });
  slide.addShape(pptx.ShapeType.rect, { x: 5.8, y: 0, w: 0.05, h: '100%', fill: { color: C.gold, transparency: 70 } });
  slide.addText(title, { x: 0.5, y: 0.6, w: 12.3, h: 0.7, fontSize: 26, color: C.gold, fontFace: FONT, bold: true, align: 'center' });
  slide.addShape(pptx.ShapeType.rect, { x: 2.5, y: 1.45, w: 8.3, h: 0.05, fill: { color: C.teal } });
  slide.addText(text, { x: 0.7, y: 1.65, w: 12.0, h: 4.6, fontSize: 16, color: C.white, fontFace: FONT, align: 'center', valign: 'middle', italic: true, paraSpaceAfter: 14 });
  slide.addText('Mark 12:30', { x: 0.5, y: 6.55, w: 12.3, h: 0.5, fontSize: 12, color: 'BDD7EE', fontFace: FONT, align: 'center' });
}

// ── BUILD SLIDES ─────────────────────────────────────────────────────────────

// 1. COVER
addCoverSlide(
  'The Emergence of Classical Philosophy',
  'A Teaching Guide for the Christian Beginner',
  'The fear of the LORD is the beginning of wisdom, and knowledge of the Holy One is understanding.',
  'Proverbs 9:10 (NIV)'
);

// 2. CHAPTER OVERVIEW
addBulletSlide('Chapter Overview', [
  'Chapter 4 traces how civilisations developed systematic thinking about life\'s biggest questions',
  'Covers Egyptian, Greek, Roman, Jewish, Christian, and Islamic thought',
  { text: 'Section 4.1 — Historiography: How do we study old ideas?', sub: false },
  { text: 'Section 4.2 — Classical Philosophy: Greek & Roman thinkers on reality', sub: false },
  { text: 'Section 4.3 — Faith & Reason: Jewish, Christian & Islamic philosophy', sub: false },
  '',
  'Big Picture: Every thinker was searching for what Christians know by name — Jesus, "the way, the truth, and the life" (John 14:6)',
], 'INTRODUCTION');

// ══ SECTION 1 ══
addSectionDivider('ONE', 'Historiography & the History of Philosophy', 'Section 4.1 — How Do We Study Old Ideas?');

// 3. What is Historiography?
addBulletSlide('What Is Historiography?', [
  'Historiography = the study of HOW we study history',
  'The approach we choose to read old texts changes everything we find in them',
  'Three main approaches to reading old philosophy:',
  { text: '① Presentist — Read for what is useful today', sub: true },
  { text: '② Contextualist — Understand ideas in their original time', sub: true },
  { text: '③ Hermeneutic — Balance context with our own perspective', sub: true },
], 'SECTION 4.1');

// 4. The Presentist Approach
addTwoColSlide(
  'Approach 1: The Presentist',
  '✓  STRENGTH',
  [
    'Brings practical wisdom from the past into the present',
    'Deeply useful for everyday life',
    'Example: Confucian proverb — "Our greatest glory is not in never falling, but in rising every time we fall"',
  ],
  '✗  WEAKNESS',
  [
    'Can misread old texts by judging them by today\'s standards',
    'This error is called anachronism',
    'Ana = against + chronos = time',
  ],
  'SECTION 4.1'
);

// 5. The Contextualist Approach
addTwoColSlide(
  'Approach 2: The Contextualist',
  '✓  STRENGTH',
  [
    'Gives rich, accurate understanding of old texts',
    'Prevents misinterpretation',
    'Example: "An eye for an eye" was a law that LIMITED revenge, not endorsed it',
  ],
  '✗  WEAKNESS',
  [
    'Can become history for history\'s sake',
    'Loses sight of the living value of ancient ideas',
    'Telegram example: "STOP sending money STOP" — context changes meaning entirely',
  ],
  'SECTION 4.1'
);

// 6. The Hermeneutic Approach
addTwoColSlide(
  'Approach 3: The Hermeneutic',
  '✓  STRENGTH',
  [
    'Most balanced approach',
    'Takes original context seriously AND acknowledges the reader\'s perspective',
    'Humble: no one reads from a completely neutral position',
  ],
  '✗  WEAKNESS',
  [
    'Can fall into the trap of assuming history was "building toward us"',
    'That is a form of cultural pride',
    'A Kenyan and Norwegian reading the same Psalm both bring valid, enriching perspectives',
  ],
  'SECTION 4.1'
);

// 7. Approaches Table
addTableSlide('Three Approaches at a Glance', ['Approach', 'One-Line Description', 'Danger to Avoid'], [
  ['Presentist', 'Read old ideas for today\'s benefit', 'Judging the past by today\'s standards (anachronism)'],
  ['Contextualist', 'Understand ideas in their original time', 'Caring only about history, not its living value'],
  ['Hermeneutic', 'Balance context with our own perspective', 'Assuming history\'s goal was to arrive at "us"'],
], 'SECTION 4.1 — SUMMARY');

// 8. Christian Connection — Bible Study
addConnectionSlide(
  'All Three Approaches in Bible Study',
  'Christians do something similar when reading the Bible. We apply ancient truths to today\'s life (presentism), but we also study the original context — the culture, language, and history — to understand what the author meant (contextualism). Good Bible study actually uses all three approaches.',
  'Your word is a lamp for my feet, a light on my path.',
  'Psalm 119:105'
);

// 9. Reflection 1
addReflectionSlide('When you read the Bible, which approach do you naturally use? Can you think of a time when knowing the historical context changed your understanding of a verse?');

// ══ SECTION 2 ══
addSectionDivider('TWO', 'Classical Philosophy', 'Section 4.2 — Ancient Greece, Rome & the Roots of Western Thought');

// 10. Egyptian Roots
addBulletSlide('Part A: Egypt — The Forgotten Foundation', [
  'Western philosophy did NOT begin in Greece — much of it came from Egypt first',
  'Pythagoras and Plato both studied in Egypt for years',
  'Egyptian scholars solved geometry, astronomy, and theology centuries before Greece flourished',
  '',
  'Pharaoh Akhenaten (14th century BCE):',
  { text: 'Made a radical claim — there is only ONE God (Aten, the sun)', sub: true },
  { text: 'This unseen God is the source of all that exists', sub: true },
  { text: 'Centuries before Moses — a seed of monotheistic thought planted in Egypt', sub: true },
], 'SECTION 4.2');

// 11. Akhenaten Connection
addConnectionSlide(
  'Akhenaten\'s Monotheism',
  'Akhenaten\'s belief in one supreme, invisible creator echoes the foundational truth of Scripture. Even before Moses received the Ten Commandments, God was placing a seed of monotheistic thought in Egypt — possibly preparing the Israelites for the revelation at Sinai.',
  'In the beginning God created the heavens and the earth.',
  'Genesis 1:1'
);

// 12. The Presocratics
addTableSlide('Part B: The Presocratic Philosophers', ['Camp', 'Core Belief', 'Key Thinkers & Answers'], [
  ['Monists', 'Universe = ONE substance', 'Thales: water | Anaximenes: air | Parmenides: pure, unchanging Being'],
  ['Pluralists', 'Universe = MANY substances', 'Empedocles: earth/air/fire/water | Heraclitus: constant change | Atomists: tiny indivisible atoms'],
], 'SECTION 4.2');

// 13. Heraclitus & Logos
addCalloutSlide(
  'Heraclitus — "You Cannot Step in the Same River Twice"',
  'ILLUSTRATION',
  'Heraclitus said everything is ALWAYS changing. His famous line: "You cannot step into the same river twice." The water is always moving — yet the river still has an identity!\n\nHeraclitus saw constant change as governed by an underlying reason or pattern he called the LOGOS — a rational principle that orders all things.',
  C.teal, C.lightBl
);

// 14. Logos Connection
addConnectionSlide(
  'Heraclitus\'s Logos → John\'s Word',
  'Heraclitus\'s Logos — a rational principle that orders all things — became hugely significant for early Christians. John deliberately used this Greek concept to help his Greek-speaking audience understand who Jesus is: the divine Reason behind all creation, now made flesh.',
  'In the beginning was the Word (Logos), and the Word was with God, and the Word was God.',
  'John 1:1'
);

// 15. Socrates
addBulletSlide('Part C: Socrates — The Philosopher Who Wrote Nothing', [
  'Socrates (470–399 BCE) never wrote a single word',
  'His student PLATO preserved his ideas in written dialogues',
  '',
  'The Socratic Method:',
  { text: 'Ask relentless, probing questions', sub: true },
  { text: 'Expose what the other person does NOT know', sub: true },
  { text: 'The discomfort of not knowing is the beginning of wisdom', sub: true },
  '',
  '"One of his students compared him to a stingray — he paralysed people\'s false certainties"',
], 'SECTION 4.2');

// 16. Plato — Theory of Forms
addBulletSlide('Plato — The Theory of Forms', [
  'If there are many different tables, what makes them ALL "tables"?',
  'Plato\'s answer: there is a perfect, invisible FORM of "Table" in a higher realm',
  'All physical tables are just imperfect COPIES of that perfect Form',
  '',
  'This applies to EVERYTHING:',
  { text: 'Beauty, Justice, Goodness — all have perfect Forms', sub: true },
  { text: 'The physical world is imperfect and changing', sub: true },
  { text: 'The realm of Forms is eternal, perfect, and unchanging', sub: true },
  '',
  'Illustration: A freehand circle is imperfect — but we all recognise it because we have access to the idea of "perfect circle"',
], 'SECTION 4.2');

// 17. Allegory of the Cave
addCalloutSlide(
  'Plato\'s Allegory of the Cave',
  'ILLUSTRATION',
  'Prisoners chained in a dark cave see only shadows on the wall — they mistake shadows for reality.\n\nOne escapes into sunlight — blinded at first, then he sees real trees, animals, the sun. He rushes back to tell the others, but they don\'t believe him.\n\nFor Plato:\n• The cave = our physical world of shadows\n• The sunlight = the realm of Forms — True Reality\n• The philosopher = the one who escapes and returns to help others see',
  C.navy, '#E8F4FD'
);

// 18. Cave Christian Connection
addConnectionSlide(
  'The Cave & Spiritual Blindness',
  'Plato\'s cave reminds Christians of spiritual blindness. Paul writes that "the god of this age has blinded the minds of unbelievers." Plato sensed there was a higher, truer reality — but it took Christ to show us not just WHAT that reality is, but WHO.',
  'I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.',
  'John 8:12'
);

// 19. Aristotle Four Causes
addTableSlide('Part D: Aristotle — The Four Causes', ['Cause', 'Question It Answers', 'Example: A Wooden Chair'], [
  ['Material Cause', 'What is it made of?', 'Wood'],
  ['Formal Cause', 'What shape/design does it have?', 'Chair shape — four legs, a seat, a back'],
  ['Efficient Cause', 'Who or what made it?', 'A carpenter'],
  ['Final Cause', 'What is its purpose?', 'For people to sit on'],
], 'SECTION 4.2 — ARISTOTLE');

// 20. Apply Four Causes to Humanity
addCalloutSlide(
  'The Four Causes Applied to Human Beings',
  'ILLUSTRATION',
  'Material Cause → Made of flesh and bone\n\nFormal Cause → Having a human form: two legs, a mind, emotions\n\nEfficient Cause → Created by God\n\nFinal Cause → Made to glorify God and enjoy him forever\n\nAristotle believed everything has a PURPOSE — and that purpose-driven view of existence resonates deeply with Christian faith.',
  C.blue, C.lightBl
);

// 21. Eudaimonia
addTwoColSlide(
  'Aristotle — Eudaimonia (Flourishing)',
  'ARISTOTLE\'S VIEW',
  [
    'The goal of human life is eudaimonia — flourishing',
    'Not pleasure, not wealth, not power',
    'Grow into your full human potential',
    'Achieved by cultivating virtues — habits of good character',
    'Discipline alone can bring this',
  ],
  'CHRISTIAN VIEW',
  [
    'Paul\'s call: "Put on the new self" (Colossians 3:10)',
    'Cultivate the fruit of the Spirit (Galatians 5:22-23)',
    'The difference: true transformation requires God\'s GRACE',
    'Not just human effort — but Spirit-empowered renewal',
    'Flourishing is a gift, not just an achievement',
  ],
  'SECTION 4.2'
);

// 22. Aristotle Soul Types
addTableSlide('Aristotle\'s Three Types of Soul', ['Type of Being', 'Type of Soul', 'What It Does'], [
  ['Plants', 'Vegetative Soul', 'Absorbs nutrients, grows'],
  ['Animals', 'Animal Soul', 'Grows + feels desires + moves'],
  ['Humans', 'Rational Soul', 'All of the above + reasons and thinks'],
], 'SECTION 4.2 — ARISTOTLE');

// 23. Epicureans vs Stoics
addTwoColSlide(
  'Part E: Epicureans vs Stoics',
  'EPICUREANS',
  [
    'Led by Epicurus (341–270 BCE)',
    'Goal of life = freedom from pain, anxiety, and fear',
    'Not wild indulgence — calm, peaceful pleasure',
    '"The fear of death is the greatest fear. Learn to fear it less, and you will live better."',
  ],
  'STOICS',
  [
    'Led by Marcus Aurelius & others',
    'Inner peace through self-control',
    'Suffering comes not from events but from our REACTIONS to them',
    '"It is not the thing itself that afflicts you, but your judgement about it." — Marcus Aurelius',
  ],
  'SECTION 4.2'
);

// 24. Stoics Connection
addConnectionSlide(
  'Stoic Peace vs. Paul\'s Contentment',
  'The Stoic idea of finding peace by controlling reactions, not circumstances, parallels Paul\'s contentment. But there is a key difference: the Stoic found peace through willpower alone. Paul found it "through Christ who strengthens me" — a relational, Spirit-empowered peace, not just mental discipline.',
  'I have learned, in whatever state I am, to be content. I can do all things through Christ who strengthens me.',
  'Philippians 4:11, 13'
);

// 25. Reflection 2
addReflectionSlide('Aristotle said the purpose of human life is to flourish by practising virtue. How does the Christian purpose — to know God and make him known — compare and contrast with Aristotle\'s view?');

// ══ SECTION 3 ══
addSectionDivider('THREE', 'Jewish, Christian & Islamic Philosophy', 'Section 4.3 — When Faith Meets Reason');

// 26. Setting the Scene
addBulletSlide('When Faith Meets Greek Thought', [
  'After Alexander the Great\'s conquests, Greek learning spread everywhere',
  'Jewish, Christian, and Muslim scholars suddenly had access to Plato and Aristotle',
  '',
  'The great question: Can we use "pagan" philosophers to explain our faith?',
  '',
  'Key difference from purely Greek philosophy:',
  { text: 'A Greek philosopher started with a blank slate — pure reason', sub: true },
  { text: 'A faith-based philosopher always worked with a "partner": revealed Scripture', sub: true },
  { text: 'Their task: understand and defend revealed truth using the tools of reason', sub: true },
], 'SECTION 4.3');

// 27. Philo of Alexandria
addBulletSlide('Early Jewish Philosophy: Philo of Alexandria (20 BCE–50 CE)', [
  'First great bridge-builder between Greek philosophy and Jewish faith',
  '',
  'His challenge: How can an eternal, perfect God create an imperfect, changing world?',
  '',
  'His answer: The LOGOS — God\'s thoughts — bridge the gap',
  { text: 'He identified Plato\'s "Forms" with the Logos — the rational mind of God', sub: true },
  { text: 'When God said "Let there be light" — that was the Logos at work', sub: true },
  { text: 'The Logos is the mediating principle between eternal God and the physical world', sub: true },
], 'SECTION 4.3 — JEWISH');

// 28. Philo Connection
addConnectionSlide(
  'Philo\'s Logos → John\'s Person',
  'Philo\'s concept of the Logos — divine reason expressed in creation — was adopted and transformed by John the Apostle. What Philo used as a bridge concept, John revealed as a Person. The Logos is not just a principle — he is our Saviour.',
  'The Word (Logos) became flesh and made his dwelling among us.',
  'John 1:14'
);

// 29. Augustine
addBulletSlide('Augustine (354–430 CE) — The Restless Heart', [
  'Born in North Africa; spent his youth in philosophy, pleasure, and various religions',
  'Converted to Christianity at age 31',
  '"Our heart is restless until it rests in you, O Lord." — Confessions',
  '',
  'His key philosophical ideas:',
  { text: 'TIME: Memory (past) + Attention (present) + Anticipation (future)', sub: true },
  { text: 'FREE WILL: We have genuine freedom — but only God\'s grace can save us', sub: true },
  { text: 'EVIL: Not a substance, but an ABSENCE of good — like darkness is absence of light', sub: true },
], 'SECTION 4.3 — CHRISTIAN');

// 30. Augustine Connection
addConnectionSlide(
  'Augustine: Evil as Absence of Good',
  'Augustine\'s insight that "evil is the absence of good" — not a competing power equal to God — protects us from dualism: the belief that Good and Evil are equally powerful forces. The Bible confirms this: God is not locked in a battle with Satan as equals. Satan is a created, defeated being.',
  'Having disarmed the powers and authorities, he made a public spectacle of them, triumphing over them by the cross.',
  'Colossians 2:15'
);

// 31. Boethius
addCalloutSlide(
  'Boethius (477–524 CE) — Finding Peace in the Worst Moment',
  'ILLUSTRATION',
  'Boethius was a brilliant Roman statesman unjustly imprisoned and sentenced to death.\n\nWhile awaiting execution, he wrote The Consolation of Philosophy — one of the most widely read books of the Middle Ages.\n\nHe describes Philosophy personified visiting him in his cell, showing him that true happiness cannot be taken away — because it rests not in wealth, power, or status, but in virtue, wisdom, and God.\n\nThis echoes Job\'s experience: stripped of everything, he still clung to God.',
  C.teal, C.lightBl
);

// 32. Anselm
addBulletSlide('Anselm (1033–1109) — Can Reason Prove God Exists?', [
  'Archbishop of Canterbury; proposed the famous Ontological Argument',
  '',
  'The argument in simple form:',
  { text: '① God is, by definition, the greatest conceivable being', sub: true },
  { text: '② A being that exists in reality is greater than one that exists only in the mind', sub: true },
  { text: '③ Therefore, God must exist in reality', sub: true },
  '',
  'Illustration: Is a perfect pizza that actually exists better than one you only imagine? Obviously yes.',
  '',
  'Anselm\'s motto: "Faith seeking understanding" — Believe first, then use reason to go deeper',
], 'SECTION 4.3 — CHRISTIAN');

// 33. Ibn Sina
addBulletSlide('Ibn Sina / Avicenna (970–1037 CE) — The Necessary Being', [
  'Persian genius: 100+ works on philosophy, medicine, astronomy, theology',
  'His medical encyclopaedia used in European universities for 500 years',
  '',
  'His Proof for God — "The Proof of the Truthful":',
  { text: 'Everything in the material world is contingent — it might or might not exist', sub: true },
  { text: 'This chain of causes cannot go back forever', sub: true },
  { text: 'There must be a Necessary Being — one who CANNOT not exist', sub: true },
  { text: 'That Necessary Being is God', sub: true },
  '',
  'Also: humans are born as blank slates — all knowledge comes through the senses (empiricism)',
], 'SECTION 4.3 — ISLAMIC');

// 34. Ibn Sina Connection
addConnectionSlide(
  'Ibn Sina\'s Necessary Being',
  'Ibn Sina\'s Necessary Being is remarkably similar to the Cosmological Argument that Aquinas would later develop — and which many Christian apologists still use today. It resonates deeply with God\'s self-description to Moses.',
  'God said to Moses, "I AM WHO I AM."',
  'Exodus 3:14'
);

// 35. Thomas Aquinas
addBulletSlide('Thomas Aquinas (1225–1274) — Five Ways to God', [
  'Greatest systematic theologian in Christian history',
  'He "baptised" Aristotle — showing reason and faith work together',
  '',
  'His Five Ways (proofs for God\'s existence):',
  { text: '① The Unmoved Mover — there must be a First Mover', sub: true },
  { text: '② The First Cause — the chain of causes must begin somewhere', sub: true },
  { text: '③ The Necessary Being — something must exist that cannot not exist', sub: true },
  { text: '④ The Absolute Being — comparisons of good/true/noble imply a perfect standard', sub: true },
  { text: '⑤ The Grand Designer — natural things act toward purposes; a mind directs them', sub: true },
], 'SECTION 4.3 — CHRISTIAN');

// 36. Aquinas Table
addTableSlide('Aquinas\'s Five Ways — Biblical Echoes', ['Way', 'Argument', 'Biblical Echo'], [
  ['Unmoved Mover', 'Everything in motion was set in motion by something', 'Psalm 93:1 — "The Lord reigns"'],
  ['First Cause', 'Chain of causes must start with an uncaused cause', 'Genesis 1:1 — "In the beginning, God"'],
  ['Necessary Being', 'Something must exist that cannot not exist', 'Exodus 3:14 — "I AM WHO I AM"'],
  ['Absolute Being', 'Comparisons imply an absolute standard — God', 'James 1:17 — "Every perfect gift is from above"'],
  ['Grand Designer', 'Natural things aim at purposes; a mind directs them', 'Romans 1:20 — Creation reveals God'],
], 'SECTION 4.3 — AQUINAS');

// 37. Maimonides
addBulletSlide('Moses Maimonides (1138–1204) — What God Is NOT', [
  'Greatest Jewish philosopher of the Middle Ages',
  'His famous work: The Guide for the Perplexed',
  '',
  'His radical insight — Negative Theology:',
  { text: 'We cannot fully describe what God IS', sub: false },
  { text: 'We can only say what God IS NOT', sub: false },
  '',
  'Examples:',
  { text: 'Not: "God is big" (implies physical size)', sub: true },
  { text: 'Yes: "God is not limited in power"', sub: true },
  { text: 'God transcends all human categories', sub: true },
  '',
  'Christianity adds: while God transcends categories, he revealed himself PERSONALLY in Jesus',
], 'SECTION 4.3 — JEWISH');

// 38. Zera Yacob
addBulletSlide('Zera Yacob (1592–1692) — African Christian Philosopher', [
  'Ethiopian Christian scholar; wrote Hatata (Inquiry) while hiding in a cave during civil war',
  '',
  'His approach:',
  { text: 'Used pure reason, guided by God-given inner light', sub: true },
  { text: 'Evaluated ALL religious traditions — including his own — with reason', sub: true },
  { text: 'God made us rational so we would seek him through reason', sub: true },
  '',
  'Significance:',
  { text: 'African scholarship was part of the global philosophical conversation long before the modern era', sub: true },
  { text: 'God has been at work across ALL nations, not just Europe', sub: true },
  { text: 'Reflects Acts 17:27 — God is "not far from any one of us"', sub: true },
], 'SECTION 4.3 — AFRICAN CHRISTIAN');

// 39. Reflection 3
addReflectionSlide('Augustine, Aquinas, Boethius, and Maimonides all wrestled with how to reconcile faith and reason. How do you personally navigate this tension? Do you see any areas where your faith and your reasoning have been in conflict?');

// ══ SECTION 4 ══
addSectionDivider('FOUR', 'Master Summary', 'The Big Picture at a Glance');

// 40. Master Table Part 1
addTableSlide('Master Reference — Ancient & Classical Thinkers', ['Thinker / School', 'Key Idea', 'Christian Relevance'], [
  ['Akhenaten (Egypt)', 'One invisible God is source of all', 'Echoes Genesis 1 — seed of monotheism'],
  ['Thales / Presocratics', 'Seeking the one substance behind all', 'The search for unity — fulfilled in God'],
  ['Parmenides', 'True reality is unchanging & eternal', '"Same yesterday, today, and forever" (Heb 13:8)'],
  ['Heraclitus & Logos', 'Rational principle orders all change', 'John 1:1 — Jesus is the Logos made flesh'],
  ['Plato — Forms', 'Eternal, perfect realities behind the material world', 'Points to heavenly realities; transcendence'],
  ['Plato — Cave', 'Most people live in shadow, not true light', 'Jesus is the Light of the World (John 8:12)'],
  ['Aristotle — 4 Causes', 'Material, formal, efficient & final causes', 'God is First Cause; our final cause = glorify God'],
], 'SECTION 4 — SUMMARY');

// 41. Master Table Part 2
addTableSlide('Master Reference — Medieval Thinkers', ['Thinker / School', 'Key Idea', 'Christian Relevance'], [
  ['Stoics', 'Inner peace through self-control', 'Contentment in Christ (Philippians 4:11-13)'],
  ['Philo of Alexandria', 'Logos = thoughts of God, bridge to creation', 'Informs John 1:1 — Word became flesh'],
  ['Augustine', 'Restless heart; evil = absence of good', 'All human longing finds rest in God alone'],
  ['Boethius', 'True happiness cannot be taken; found in God', 'Nothing separates us from God\'s love (Rom 8:39)'],
  ['Anselm', 'Faith seeks understanding; ontological argument', 'Love God with all your MIND (Mark 12:30)'],
  ['Ibn Sina', 'Necessary Being must exist; empiricism', 'God is I AM — self-existent (Exodus 3:14)'],
  ['Aquinas', 'Five Ways; faith + reason working together', 'Pinnacle of philosophy defending Christian faith'],
  ['Maimonides', 'Negative theology — say what God is NOT', 'God transcends all categories (Isaiah 55:8-9)'],
  ['Zera Yacob', 'God-given reason leads to God; African voice', 'God is near all people (Acts 17:27)'],
], 'SECTION 4 — SUMMARY');

// 42. Key Terms
addTableSlide('Key Terms Glossary', ['Term', 'Simple Definition', 'Memory Hook'], [
  ['Historiography', 'The study of HOW to study history', 'History studying itself'],
  ['Anachronism', 'Judging the past by today\'s standards', 'Ana (against) + chronos (time)'],
  ['Monism', 'Reality is made of ONE substance', 'Mono = one (monologue, monocle)'],
  ['Logos', 'Greek for Word/Reason — divine creative principle', 'Jesus IS the Logos!'],
  ['Empiricism', 'All knowledge comes from sense experience', 'Empire of the senses'],
  ['Eudaimonia', 'Aristotle\'s word for human flourishing', 'Money won\'t bring it'],
  ['Negative Theology', 'Knowing God by what He is NOT', 'God is NOT limited, NOT created'],
  ['Scholasticism', 'Medieval theology using logic and reason', 'School + Faith'],
], 'SECTION 5 — GLOSSARY');

// 43. The Big Story
addBulletSlide('The Story in One Page', [
  'From Egyptian pharaohs asking "what is the one source of all things?"',
  'To Greek philosophers debating the building blocks of reality',
  'To Roman thinkers developing inner peace and virtue',
  'To Jewish, Christian & Islamic scholars wrestling with faith and reason',
  '',
  'At every stage: thoughtful people were searching for truth',
  '',
  'As a Christian, you know that the Truth is a Person:',
  '"I am the way, the truth, and the life." — John 14:6',
], 'MASTER SUMMARY');

// 44. Closing Quote
addQuoteSlide(
  'For in him we live and move and have our being. As some of your own poets have said, "We are his offspring."',
  'Acts 17:28',
  'Paul quoted Greek philosophy to introduce the Athenians to the God they were unknowingly seeking. You now understand exactly what he was doing.'
);

// 45. Closing Devotional
addCloserSlide(
  'Go and Love God with All Your MIND',
  'Every thinker in this chapter was stretching out their hands toward the same One.\n\nSome got remarkably close — Akhenaten\'s single God, Heraclitus\'s Logos, Plato\'s eternal Forms, Aristotle\'s First Cause, Augustine\'s restless heart.\n\nBut it was not philosophy that finally answered these questions.\n\nIt was a Person. A Word made flesh. A God who came looking for us.'
);

// ── Save ─────────────────────────────────────────────────────────────────────
pptx.writeFile({ fileName: 'd:\\JEMEKA TOURS\\Chapter4_Teaching_Slides.pptx' })
  .then(() => console.log('Done! Slides saved.'))
  .catch(err => console.error('Error:', err));
