const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, PageBreak, VerticalAlign
} = require('docx');
const fs = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "1F4E79" };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 24, font: "Arial", bold: opts.bold, italics: opts.italic, color: opts.color })]
  });
}
function mixed(...runs) {
  return new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED, children: runs });
}
function run(text, opts = {}) {
  return new TextRun({ text, size: 24, font: "Arial", bold: opts.bold, italics: opts.italic, color: opts.color });
}
function bullet(text, reference = "bullets") {
  return new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 24, font: "Arial" })]
  });
}
function numberedItem(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 24, font: "Arial" })]
  });
}
function space(n = 1) {
  return new Paragraph({ children: [new TextRun({ text: " ".repeat(n) })] });
}
function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
    children: [new TextRun("")]
  });
}
function callout(label, text, color = "E8F4FD", labelColor = "1F4E79") {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1000, 8360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: headerBorders,
            width: { size: 1000, type: WidthType.DXA },
            shading: { fill: "1F4E79", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, bold: true, size: 22, font: "Arial", color: "FFFFFF" })] })]
          }),
          new TableCell({
            borders,
            width: { size: 8360, type: WidthType.DXA },
            shading: { fill: color, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 120 },
            children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text, size: 24, font: "Arial" })] })]
          })
        ]
      })
    ]
  });
}
function twoCol(left, right, leftFill = "E8F4FD", rightFill = "FEF9E7") {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: leftFill, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 120 },
            children: left
          }),
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: rightFill, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 120 },
            children: right
          })
        ]
      })
    ]
  });
}
function sectionHeader(num, title, subtitle) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: headerBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: "1F4E79", type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children: [
              new Paragraph({ children: [new TextRun({ text: `SECTION ${num}: ${title.toUpperCase()}`, bold: true, size: 28, font: "Arial", color: "FFFFFF" })] }),
              subtitle ? new Paragraph({ children: [new TextRun({ text: subtitle, size: 22, font: "Arial", color: "BDD7EE" })] }) : new Paragraph({ children: [new TextRun("")] })
            ]
          })
        ]
      })
    ]
  });
}
function threeColTable(headers, rows, fillHeader = "1F4E79", fillRow = "FFFFFF", fillAlt = "EBF5FB") {
  const colW = Math.floor(9360 / headers.length);
  const colWidths = headers.map((_, i) => i === headers.length - 1 ? 9360 - colW * (headers.length - 1) : colW);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => new TableCell({
          borders: headerBorders,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: fillHeader, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 22, font: "Arial", color: "FFFFFF" })] })]
        }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, i) => new TableCell({
          borders,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? fillRow : fillAlt, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 22, font: "Arial" })] })]
        }))
      }))
    ]
  });
}

// ── Document ─────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "1F4E79", font: "Arial" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "2E75B6", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "31849B", font: "Arial" },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "letters", levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 }
      }
    },
    children: [
      // ── COVER ──
      space(4),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "INTRODUCTION TO PHILOSOPHY", size: 20, font: "Arial", color: "7F7F7F" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "CHAPTER 4", bold: true, size: 52, font: "Arial", color: "1F4E79" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "The Emergence of Classical Philosophy", bold: true, size: 40, font: "Arial", color: "2E75B6" })] }),
      divider(),
      space(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "A COMPREHENSIVE TEACHING GUIDE", bold: true, size: 28, font: "Arial", color: "31849B" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "For the Christian Beginner", size: 26, font: "Arial", color: "7F7F7F", italics: true })] }),
      space(2),
      callout("VERSE", "\"The fear of the LORD is the beginning of wisdom, and knowledge of the Holy One is understanding.\" — Proverbs 9:10 (NIV)", "EBF5FB"),
      space(2),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "This guide is designed to help Christians explore the history of human thinking — from ancient Egypt to the Middle Ages — and see how God's hand has guided humanity toward truth, wisdom, and ultimately toward Christ.", size: 24, font: "Arial", italics: true, color: "555555" })] }),
      space(4),
      new Paragraph({ children: [new PageBreak()] }),

      // ── HOW TO USE ──
      h1("How to Use This Guide"),
      body("This teaching guide walks you through Chapter 4 of Introduction to Philosophy in a way that is friendly, clear, and rooted in a Christian worldview. You do not need any prior knowledge of philosophy. Every section includes:"),
      space(),
      bullet("A plain-language explanation of each big idea"),
      bullet("Vivid everyday illustrations to make concepts stick"),
      bullet("A Christian Connection showing how the idea relates to Scripture or faith"),
      bullet("A Reflection Question to help you think and discuss"),
      bullet("Summary boxes and memory aids"),
      space(),
      callout("GUIDE TIP", "Approach this chapter with an open heart. Understanding how thinkers across history searched for truth will deepen your appreciation of why the Gospel is so powerful — it answers the questions philosophy could only ask.", "FEF9E7"),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // ── OVERVIEW ──
      h1("Chapter Overview"),
      body("Chapter 4 tells the remarkable story of how human beings across many civilisations — Egyptian, Greek, Roman, Jewish, Christian, and Islamic — developed systematic ways of thinking about life's biggest questions: What is reality? How do we know anything? How should we live? What is God like?"),
      space(),
      body("The chapter is divided into three main sections:"),
      space(),
      threeColTable(
        ["Section", "Topic", "Key Question Explored"],
        [
          ["4.1", "Historiography & History of Philosophy", "How should we study the history of ideas?"],
          ["4.2", "Classical Philosophy", "What did ancient Greek and Roman thinkers believe about reality?"],
          ["4.3", "Jewish, Christian & Islamic Philosophy", "How did faith traditions interact with Greek philosophy?"],
        ]
      ),
      space(2),
      callout("BIG PICTURE", "As you read, you will see a pattern: every civilisation and thinker was searching for the same things — truth, a first cause, purpose, and how to live rightly. As a Christian, you already have a name for what they were searching for: Jesus, who said, 'I am the way, the truth, and the life' (John 14:6).", "EBF5FB"),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════
      // SECTION 1
      // ═══════════════════════════════════════════════════
      sectionHeader("ONE", "Historiography and the History of Philosophy", "Section 4.1 — How Do We Study Old Ideas?"),
      space(),
      h2("What Is Historiography?"),
      body("Before studying what philosophers believed, we need to ask: how should we study them? This field is called historiography — the study of how to do history. It sounds complicated, but the idea is simple."),
      space(),
      callout("ILLUSTRATION", "Imagine you find your great-grandmother's diary. You could read it asking, 'What does this tell me about dating advice today?' — or you could ask, 'What was life like for her in 1940?' Both are valid, but they give you very different insights. The approach you choose changes everything.", "FEF9E7"),
      space(),
      body("Philosophers face the exact same challenge when reading old texts. Chapter 4 introduces three approaches:"),
      space(),

      h3("Approach 1: The Presentist Approach"),
      body("The presentist reads old philosophy looking for ideas that are still useful today. They ask: 'Does this argument still hold up? Can I apply this wisdom to my life right now?'"),
      space(),
      body("Example from the textbook: The Confucian proverb 'Our greatest glory is not in never falling, but in rising every time we fall' can encourage anyone today, regardless of when Confucius lived."),
      space(),
      twoCol(
        [new Paragraph({ children: [new TextRun({ text: "STRENGTH", bold: true, size: 22, font: "Arial", color: "1F4E79" })] }),
         new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Brings practical wisdom from the past into the present. Deeply useful for everyday life.", size: 22, font: "Arial" })] })],
        [new Paragraph({ children: [new TextRun({ text: "WEAKNESS", bold: true, size: 22, font: "Arial", color: "C0392B" })] }),
         new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Can misread old texts by judging them by today's standards — an error called anachronism.", size: 22, font: "Arial" })] })]
      ),
      space(),
      callout("CHRISTIAN CONNECTION", "Christians do something similar when reading the Bible. We apply ancient truths to today's life (presentism), but we also study the original context — the culture, language, and history — to understand what the author meant (contextualism). Good Bible study actually uses all three approaches!", "EBF5FB"),
      space(),

      h3("Approach 2: The Contextualist Approach"),
      body("The contextualist tries to understand a philosopher entirely within their own time. They study the culture, politics, and social world of the author before drawing any conclusions."),
      space(),
      body("Classic example from the textbook: The phrase 'an eye for an eye' in the Bible is often misunderstood today as endorsing revenge. But in its original context, it was actually a law that LIMITED revenge — it meant you could not take more than an eye for an eye. Understanding the original context completely transforms the meaning!"),
      space(),
      callout("ILLUSTRATION", "Think of it like reading a text message from 1950 — oh wait, there were none! Imagine reading a telegram from your grandfather: 'STOP sending money STOP'. Without context, you might think he was angry. With context (telegrams used 'STOP' as punctuation), you understand he simply wanted you to stop sending money. Context is everything.", "FEF9E7"),
      space(),
      twoCol(
        [new Paragraph({ children: [new TextRun({ text: "STRENGTH", bold: true, size: 22, font: "Arial", color: "1F4E79" })] }),
         new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Gives rich, accurate understanding and prevents misinterpretation of old texts.", size: 22, font: "Arial" })] })],
        [new Paragraph({ children: [new TextRun({ text: "WEAKNESS", bold: true, size: 22, font: "Arial", color: "C0392B" })] }),
         new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Can become history for history's sake, losing sight of the living value of ancient ideas.", size: 22, font: "Arial" })] })]
      ),
      space(),

      h3("Approach 3: The Hermeneutic Approach"),
      body("The hermeneutic approach is the most balanced. It tries to take the original context seriously AND acknowledge that we, the modern readers, bring our own perspective. It is humble: it recognises that no one reads an old text from a completely neutral position."),
      space(),
      callout("ILLUSTRATION", "When a Kenyan Christian reads the Psalms, she brings her own cultural setting, life experiences, and faith to the text. A Norwegian theologian reading the same Psalm brings his. Both readings are valid and enriching. The hermeneutic approach welcomes this — but also warns us not to assume history was simply 'leading up to us'.", "EBF5FB"),
      space(),
      twoCol(
        [new Paragraph({ children: [new TextRun({ text: "STRENGTH", bold: true, size: 22, font: "Arial", color: "1F4E79" })] }),
         new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Balances historical accuracy with present relevance; honest about the reader's own influence.", size: 22, font: "Arial" })] })],
        [new Paragraph({ children: [new TextRun({ text: "WEAKNESS", bold: true, size: 22, font: "Arial", color: "C0392B" })] }),
         new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Can fall into the trap of thinking history was building toward us — a kind of cultural pride.", size: 22, font: "Arial" })] })]
      ),
      space(),

      h2("Quick Reference Summary"),
      threeColTable(
        ["Approach", "One-Line Description", "Danger to Avoid"],
        [
          ["Presentist", "Read old ideas for today's benefit", "Judging the past by today's standards (anachronism)"],
          ["Contextualist", "Understand ideas in their original time", "Caring only about history, not its living value"],
          ["Hermeneutic", "Balance context with our own perspective", "Assuming history's goal was to arrive at 'us'"],
        ]
      ),
      space(2),
      callout("REFLECTION QUESTION", "When you read the Bible, which approach do you naturally use? Can you think of a time when knowing the historical context changed your understanding of a verse?", "FEF9E7"),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════
      // SECTION 2
      // ═══════════════════════════════════════════════════
      sectionHeader("TWO", "Classical Philosophy", "Section 4.2 — Ancient Greece, Rome & the Roots of Western Thought"),
      space(),
      h2("Part A: The Egyptian Roots of Greek Philosophy"),
      body("Many people believe that Western philosophy began in ancient Greece. In fact, the ancient Greeks themselves knew that much of their learning came from Egypt — particularly from the great city of Heliopolis."),
      space(),
      callout("ILLUSTRATION", "Think of it this way: if you visited a very advanced library and learned everything you could there, then went home and built something brilliant — was the library's knowledge not part of your achievement? Pythagoras and Plato both studied in Egypt for years. Egyptian scholars had already solved problems about geometry, astronomy, and even the nature of God centuries before Greek philosophy flourished.", "EBF5FB"),
      space(),
      body("Key Egyptian contribution to philosophy: The pharaoh Akhenaten (14th century BCE) made a radical claim — there is only ONE God (Aten, the sun god), and this unseen God is the source of all that exists. Sound familiar? This idea that a single, invisible, creative force underlies all reality became foundational to later philosophy — and aligns remarkably with Christian theology."),
      space(),
      callout("CHRISTIAN CONNECTION", "Akhenaten's monotheism — the belief in one supreme, invisible creator — echoes the foundational truth of Scripture: 'In the beginning God created the heavens and the earth' (Genesis 1:1). Even before Moses received the Ten Commandments, God was placing a seed of monotheistic thought in Egypt. Could this have helped prepare the Israelites for the revelation at Sinai?", "EBF5FB"),
      space(),

      h2("Part B: The Presocratic Philosophers"),
      body("The Presocratics were Greek thinkers who came before Socrates. They were primarily interested in one enormous question: What is everything made of? What is the most basic building block of the universe?"),
      space(),
      body("They proposed two main camps:"),
      space(),
      threeColTable(
        ["Camp", "Belief", "Key Thinkers & Their Answers"],
        [
          ["Monists", "The universe is made of ONE substance", "Thales: water | Anaximenes: air | Parmenides: pure unchanging Being"],
          ["Pluralists", "The universe is made of MANY substances", "Empedocles: earth, air, fire, water | Heraclitus: constant change | Atomists: tiny indivisible atoms"],
        ]
      ),
      space(),
      callout("ILLUSTRATION — THALES", "Thales said everything is made of water. That sounds strange today, but think about it: water is everywhere, it shifts between solid, liquid and gas, and life cannot exist without it. Thales was doing what scientists still do — looking for the one underlying principle that explains everything.", "FEF9E7"),
      space(),
      callout("ILLUSTRATION — PARMENIDES & ZENO", "Parmenides said change is an illusion — that true reality never changes. His student Zeno proved this with a famous paradox: to walk from your chair to the door, you must first walk halfway. Then half of what remains. Then half again. This continues forever — so can you ever actually arrive? (You obviously do arrive, but Zeno's point raises deep questions about infinity and motion.)", "FEF9E7"),
      space(),
      callout("ILLUSTRATION — HERACLITUS", "Heraclitus said the exact opposite: everything is ALWAYS changing. His famous line: 'You cannot step into the same river twice.' The water is always moving. But notice — the river still has an identity! Heraclitus saw constant change as governed by an underlying reason or pattern he called the Logos.", "EBF5FB"),
      space(),
      callout("CHRISTIAN CONNECTION", "Heraclitus's Logos — a rational principle that orders all things — became hugely significant for early Christians. The Gospel of John opens: 'In the beginning was the Word (Logos)...' (John 1:1). John deliberately used this Greek concept to help his Greek-speaking audience understand who Jesus is: the divine Reason behind all creation, now made flesh.", "EBF5FB"),
      space(),

      h2("Part C: Socrates and Plato — The Great Quest for Truth"),
      body("Socrates (470–399 BCE) never wrote anything. Yet he is considered one of the greatest philosophers in history. How? Because his student Plato wrote dialogues — dramatic conversations featuring Socrates — that preserved his ideas."),
      space(),
      body("Socrates's method was simple but powerful: he would ask questions — probing, relentless questions — until his conversation partner realised they did not know as much as they thought. This is called the Socratic Method."),
      space(),
      callout("ILLUSTRATION", "Imagine sitting with a wise elder who asks you: 'You say you believe in justice. Can you define it?' You give an answer. He gently probes: 'But what about this situation — would that still be just?' He challenges every answer until you realise you cannot fully define justice. You are no longer confident, but you are more honest. That discomfort is the beginning of wisdom. This is what Socrates did. One of his students compared him to a stingray fish that paralyses its prey — Socrates paralysed people's false certainties.", "FEF9E7"),
      space(),
      body("Plato's most important idea: THE THEORY OF FORMS"),
      space(),
      body("Plato asked: if I see many different tables — short, tall, wooden, metal, round, square — what makes them all 'tables'? He concluded there must be a perfect, invisible FORM of 'Table' in a higher reality. All physical tables are just imperfect copies of this perfect form. This applies to everything: beauty, justice, goodness — there are perfect Forms of each, existing in an eternal, unchanging realm."),
      space(),
      callout("ILLUSTRATION", "Draw a circle freehand. It is not perfect — it has wobbles, thickness variations. But everyone recognises it as a circle because we all have access to the idea of 'perfect circle' in our minds. Plato says that this concept did not come from the physical world (where no perfect circle exists). It comes from the realm of Forms — the realm of eternal truth.", "EBF5FB"),
      space(),
      callout("ILLUSTRATION — ALLEGORY OF THE CAVE", "Imagine prisoners chained in a dark cave, facing a wall. Behind them burns a fire. Objects pass between them and the fire, casting shadows on the wall. The prisoners have never seen the real objects — only their shadows. They mistake the shadows for reality. One prisoner escapes, goes outside, and is blinded by the sunlight. Slowly, his eyes adjust and he sees real trees, animals, and the sun. He rushes back to tell the others — but they do not believe him. He looks confused and blind to them (his eyes have adjusted to sunlight but not the darkness again). For Plato, the cave is our physical world of shadows; the sunlight outside is the realm of Forms — True Reality. The philosopher is the one who escapes and returns to help others see.", "FEF9E7"),
      space(),
      callout("CHRISTIAN CONNECTION", "Plato's cave reminds Christians of spiritual blindness. Paul writes: 'The god of this age has blinded the minds of unbelievers' (2 Corinthians 4:4). Jesus is the one who leads us out of the darkness into true light — not just the light of reason, but the light of God himself: 'I am the light of the world' (John 8:12). Plato sensed there was a higher, truer reality — but it took Christ to show us what — or rather, WHO — that reality is.", "EBF5FB"),
      space(),

      h2("Part D: Aristotle — The Philosopher Who Studied Everything"),
      body("Aristotle (384–322 BCE) was Plato's greatest student. He disagreed with his teacher on important points, but built brilliantly on Plato's foundation. During the Middle Ages, he was simply called 'The Philosopher' — the one thinker who seemed to have covered everything."),
      space(),
      body("Aristotle's Four Causes: To understand anything, Aristotle said, you must answer four questions:"),
      space(),
      threeColTable(
        ["Cause", "Question It Answers", "Example: A Wooden Chair"],
        [
          ["Material Cause", "What is it made of?", "Wood"],
          ["Formal Cause", "What shape/design does it have?", "Chair shape — four legs, a seat, a back"],
          ["Efficient Cause", "Who or what made it?", "A carpenter"],
          ["Final Cause", "What is its purpose?", "For people to sit on"],
        ]
      ),
      space(),
      callout("ILLUSTRATION", "Apply the four causes to a human being: Made of flesh and bone (material). Having a human form — two legs, a mind, emotions (formal). Created by God (efficient). Made to glorify God and enjoy him forever (final). Aristotle's four causes end with PURPOSE — and Aristotle believed everything has a purpose. That purpose-driven view of existence resonates deeply with Christian faith.", "FEF9E7"),
      space(),
      body("Aristotle's Ethics: Eudaimonia (Flourishing)"),
      body("Aristotle asked: what is the goal of human life? Not pleasure, not wealth, not power — but eudaimonia, often translated as 'happiness' or 'flourishing.' This means living and growing into your full human potential. He argued we achieve this by cultivating virtues — habits of good character."),
      space(),
      callout("CHRISTIAN CONNECTION", "Aristotle's idea of flourishing through virtue echoes Paul's call to 'put on the new self' (Colossians 3:10) and cultivate the fruit of the Spirit (Galatians 5:22-23). The difference: Aristotle believed we can achieve this through discipline alone. Christianity teaches that true transformation requires God's grace, not just human effort.", "EBF5FB"),
      space(),
      body("Aristotle's Soul: Unlike Plato, Aristotle did not believe the soul is a separate eternal thing imprisoned in the body. Instead, he said the soul is the life-function of the body. Everything alive has a soul:"),
      space(),
      threeColTable(
        ["Type of Being", "Type of Soul", "What It Does"],
        [
          ["Plants", "Vegetative Soul", "Absorbs nutrients, grows"],
          ["Animals", "Animal Soul", "Grows + feels desires + moves"],
          ["Humans", "Rational Soul", "All of the above + reasons and thinks"],
        ]
      ),
      space(),

      h2("Part E: The Epicureans and Stoics"),
      body("After Plato and Aristotle, Greek philosophy continued to develop into two important schools — especially as Greece gave way to Rome:"),
      space(),
      twoCol(
        [
          new Paragraph({ children: [new TextRun({ text: "EPICUREANS", bold: true, size: 24, font: "Arial", color: "1F4E79" })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Led by Epicurus (341-270 BCE). Believed the goal of life is pleasure — but not wild indulgence. Rather, a life free from pain, anxiety, and fear. They were afraid of death, and philosophised to overcome that fear.", size: 22, font: "Arial" })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "\"The fear of death is the greatest fear. Learn to fear it less, and you will live better.\"", size: 22, font: "Arial", italics: true })] })
        ],
        [
          new Paragraph({ children: [new TextRun({ text: "STOICS", bold: true, size: 24, font: "Arial", color: "1F4E79" })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Led by thinkers including Roman Emperor Marcus Aurelius. Focused on self-control and inner peace. They taught that suffering comes not from events but from our reactions to them. Focus on what you can control; let go of the rest.", size: 22, font: "Arial" })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "\"If you are grieved by anything external, it is not the thing itself that afflicts you, but your judgement about it.\" — Marcus Aurelius", size: 22, font: "Arial", italics: true })] })
        ]
      ),
      space(),
      callout("CHRISTIAN CONNECTION", "The Stoic idea that we can find peace by accepting what we cannot control, and focusing on what we can, parallels Paul's contentment in Philippians 4:11-13: 'I have learned, in whatever state I am, to be content.' However, the Stoic found this peace through willpower alone. Paul found it 'through Christ who strengthens me' — a relational, Spirit-empowered peace, not just mental discipline.", "EBF5FB"),
      space(),
      callout("REFLECTION QUESTION", "Aristotle said the purpose of human life is to flourish by practising virtue. Do you agree? How does the Christian purpose — to know God and make him known — compare and contrast with Aristotle's view?", "FEF9E7"),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════
      // SECTION 3
      // ═══════════════════════════════════════════════════
      sectionHeader("THREE", "Jewish, Christian & Islamic Philosophy", "Section 4.3 — When Faith Meets Reason"),
      space(),
      h2("Setting the Scene: What Happens When Faith Meets Greek Thought?"),
      body("When Greek culture spread across the ancient world — through the conquests of Alexander the Great — Jewish, Christian, and later Muslim scholars suddenly had access to the brilliant works of Plato and Aristotle. A great question arose: can we use these pagan philosophers to help explain our faith? Or will philosophy corrupt it?"),
      space(),
      callout("ILLUSTRATION", "Imagine you are a devoted Christian student. You arrive at a prestigious university and discover that your best professors use Marxism, existentialism, or post-modern theory to analyse the world. Do you reject everything they say? Or can you find pearls of truth within those systems while remaining rooted in your faith? This is exactly the challenge that Jewish, Christian, and Muslim thinkers faced with Greek philosophy.", "EBF5FB"),
      space(),
      body("The textbook notes one key difference between purely Greek philosophy and the faith-based traditions:"),
      space(),
      callout("KEY INSIGHT", "A Greek philosopher started with a blank slate — pure reason. A Jewish, Christian, or Muslim philosopher always worked with a 'partner': the revealed Word of God. They could not simply ignore Genesis, or the Torah, or the Quran. Their task was not to discover truth from scratch, but to understand and defend revealed truth using the tools of reason.", "EBF5FB"),
      space(),

      h2("Early Jewish Philosophy: Philo of Alexandria"),
      body("Philo of Alexandria (20 BCE–50 CE) was the first great bridge-builder between Greek philosophy and Jewish faith. Born into a wealthy Jewish family in Egypt, he was deeply educated in both traditions."),
      space(),
      body("His great challenge: How can an eternal, perfect God create a material, changing world? Plato's forms were eternal and perfect. But the physical world is imperfect and temporary. How do you get from perfect to imperfect?"),
      space(),
      body("Philo's answer: He identified Plato's concept of 'forms' with the LOGOS — the thoughts of God. The Logos serves as the mediating principle between the eternal God and the created world. When God said 'Let there be light' in Genesis, that was the Logos at work — the rational, creative expression of God's mind."),
      space(),
      callout("CHRISTIAN CONNECTION", "This is hugely significant! Philo's concept of the Logos — divine reason expressed in creation — was adopted and transformed by John the Apostle. John 1:1 declares: 'In the beginning was the Word (Logos), and the Word was with God, and the Word WAS God.' John 1:14 then says: 'The Word became flesh and made his dwelling among us.' What Philo used as a bridge concept, John revealed as a Person — Jesus Christ. The Logos is not just a principle; he is our Saviour.", "EBF5FB"),
      space(),

      h2("Early Christian Philosophy"),
      h3("Augustine (354–430 CE) — The Restless Heart"),
      body("Augustine is one of the most important thinkers in Christian history. Born in North Africa, he spent his youth searching for meaning in philosophy, pleasure, and various religions before converting to Christianity at age 31."),
      space(),
      body("His most famous line, from his Confessions: 'Our heart is restless until it rests in you, O Lord.'"),
      space(),
      callout("ILLUSTRATION", "Augustine's spiritual journey is like a man who tries every door in a long corridor, each one promising satisfaction — power, pleasure, learning, fame — and finding every room empty. Finally, exhausted, he tries the last door he had avoided. It opens into a vast garden of light. That door was God. Augustine's philosophy grew from his personal experience of the insufficiency of everything except God.", "FEF9E7"),
      space(),
      body("Augustine's key philosophical ideas:"),
      space(),
      bullet("TIME: We experience time in three ways — the present of past things (memory), the present of present things (attention), and the present of future things (anticipation or expectation). This is still debated by philosophers today."),
      bullet("FREE WILL vs. GRACE: If God is all-powerful and knows all, how can humans be truly free? Augustine argued we have genuine moral freedom — but only God's grace can ultimately save us."),
      bullet("CREATION IS GOOD: Evil is not a substance (as the Manicheans believed) but an absence of good — like darkness is an absence of light, or cold is an absence of heat."),
      space(),
      callout("CHRISTIAN CONNECTION", "Augustine's insight that 'evil is the absence of good' — not a competing power equal to God — protects us from dualism (the belief that Good and Evil are equally powerful forces). The Bible confirms this: God is not locked in a battle with Satan as equals. Satan is a created, defeated being. God is sovereign (Colossians 2:15).", "EBF5FB"),
      space(),

      h3("Boethius (477–524 CE) — Finding Peace in the Worst Moment"),
      body("Boethius was a brilliant Roman statesman and Christian philosopher who was unjustly imprisoned and sentenced to death. While awaiting execution, he wrote The Consolation of Philosophy — one of the most widely read books of the Middle Ages."),
      space(),
      callout("ILLUSTRATION", "Boethius wrote his greatest work in prison, facing death. He describes a beautiful woman — Philosophy personified — visiting him in his cell and showing him that true happiness cannot be taken away, because it does not rest in wealth, power, or status. It rests in virtue, wisdom, and God. This echoes Job's experience — stripped of everything, he still clung to God.", "FEF9E7"),
      space(),
      callout("CHRISTIAN CONNECTION", "Boethius's insight resonates deeply with Paul's declaration in Romans 8:38-39: 'Neither death nor life... nor any power... shall be able to separate us from the love of God.' True peace is not dependent on circumstances. Both Boethius and Paul discovered this — one through philosophy, one through revelation.", "EBF5FB"),
      space(),

      h3("Anselm (1033–1109) — Can Reason Prove God Exists?"),
      body("Anselm, Archbishop of Canterbury, proposed one of the most famous philosophical arguments for God's existence — the Ontological Argument. In simple form: 'God is, by definition, the greatest conceivable being. A being that exists in reality is greater than one that exists only in the mind. Therefore, God must exist in reality.'"),
      space(),
      callout("ILLUSTRATION", "Imagine the most perfect pizza you can conceive — every ingredient, perfectly combined, the right temperature, perfectly sized. Now: is a perfect pizza that actually exists better than a perfect pizza you only imagine? Obviously, the real one is better. Anselm's argument works similarly: if God is the greatest possible being, and existing in reality is better than existing only in the mind, then God must actually exist.", "FEF9E7"),
      space(),
      body("Note: Many philosophers — both believers and sceptics — have challenged this argument. But it continues to be seriously debated. Anselm's larger project was: 'Faith seeking understanding' (Fides quaerens intellectum) — he believed we should first BELIEVE, and then use reason to deepen our understanding."),
      space(),
      callout("CHRISTIAN CONNECTION", "Anselm's motto 'Faith seeking understanding' is profoundly biblical. Hebrews 11:6 tells us that 'without faith it is impossible to please God.' But Proverbs 25:2 says 'It is the glory of God to conceal a matter; to search out a matter is the glory of kings.' Faith and reason are not enemies — they are partners in the pursuit of truth.", "EBF5FB"),
      space(),

      h2("Islamic Philosophy"),
      h3("Ibn Sina / Avicenna (970–1037 CE) — The Prince of Physicians and Philosophers"),
      body("Ibn Sina was a Persian genius who wrote over 100 works on philosophy, medicine, mathematics, astronomy, and theology. His medical encyclopedia, the Canon of Medicine, was used in European universities for five centuries."),
      space(),
      body("His Proof for God's Existence (The Proof of the Truthful):"),
      space(),
      bullet("Everything in the material world is contingent — it might or might not exist."),
      bullet("Trees, animals, mountains all came to be and will one day cease."),
      bullet("Something that can 'not be' must have a cause that made it be."),
      bullet("This chain of causes cannot go back forever — there must be a Necessary Being: one who CANNOT not exist."),
      bullet("That Necessary Being is God."),
      space(),
      callout("CHRISTIAN CONNECTION", "This is remarkably similar to the Cosmological Argument that Aquinas would develop, and which many Christian apologists still use today. It also resonates with God's self-description to Moses: 'I AM WHO I AM' (Exodus 3:14). God does not merely happen to exist — he is existence itself. He is the Necessary Being.", "EBF5FB"),
      space(),
      body("Ibn Sina's Epistemology (Theory of Knowledge): He proposed that humans are born as blank slates and acquire knowledge through the senses, experience, and reflection — a view that would later be developed by the Christian philosopher John Locke."),
      space(),
      callout("ILLUSTRATION", "Picture a newborn baby. She arrives knowing nothing. Everything she learns comes through her senses: she hears her mother's voice, feels warmth, sees light and movement. Over time, she builds up a picture of the world from this data, abstracting principles from specific experiences. This is Ibn Sina's empiricism. It is the foundation of modern science.", "FEF9E7"),
      space(),

      h3("Ibn Rushd / Averroes (1126–1198 CE) — Reason and Faith Are Not Enemies"),
      body("Ibn Rushd lived in Muslim Spain and became the most important commentator on Aristotle in the medieval world. His key message: reason and faith are compatible. He quoted the Quran itself: 'Reflect, you have a vision' (59:2) to show that Islam commands philosophical reflection."),
      space(),
      callout("CHRISTIAN CONNECTION", "The same argument applies to Christianity. Jesus said, 'Love the Lord your God with all your heart, soul, MIND, and strength' (Mark 12:30). The mind matters to God. Serious Christian scholarship — theology, apologetics, philosophy — is an act of worship, not a threat to faith.", "EBF5FB"),
      space(),

      h2("Thomas Aquinas (1225–1274) — The Summit of Medieval Christian Philosophy"),
      body("Thomas Aquinas is arguably the greatest systematic theologian in Christian history. He took Aristotle's philosophy and baptised it — showing how the tools of reason and observation could be used to understand and defend the Christian faith."),
      space(),
      body("His Five Ways (Five Proofs for God's Existence):"),
      space(),
      threeColTable(
        ["Way", "Argument", "Biblical Echo"],
        [
          ["1. The Unmoved Mover", "Everything in motion was set in motion by something else. There must be a first mover that was not moved by anything. That is God.", "Psalm 93:1 — 'The Lord reigns'"],
          ["2. The First Cause", "Every effect has a cause. The chain of causes cannot go back forever. There must be an uncaused First Cause.", "Genesis 1:1 — 'In the beginning, God created'"],
          ["3. The Necessary Being", "Everything that exists might not have existed. But there must be something that cannot not exist — God.", "Exodus 3:14 — 'I AM WHO I AM'"],
          ["4. The Absolute Being", "We compare things as more or less good, true, noble. These comparisons imply an absolute — God.", "James 1:17 — 'Every perfect gift is from above'"],
          ["5. The Grand Designer", "Natural things act toward purposes. A seed grows into a tree. But it does not do so consciously. An intelligent designer must direct all things to their ends.", "Romans 1:20 — Creation reveals God's nature"],
        ]
      ),
      space(),
      callout("CHRISTIAN CONNECTION", "Aquinas beautifully models what it means to love God with your mind. He showed that the same world that science studies is the world God created — and that studying it carefully leads us toward, not away from, God. His project remains one of the most compelling defences of the intellectual respectability of Christian faith.", "EBF5FB"),
      space(),

      h2("Moses Maimonides (1138–1204) — The Guide for the Perplexed"),
      body("Maimonides was one of the greatest Jewish philosophers. His most famous work, The Guide for the Perplexed, was addressed to a student torn between the Bible and Greek philosophy."),
      space(),
      body("His radical insight: we cannot fully describe what God IS — we can only say what God IS NOT. This is called Negative Theology. For example:"),
      space(),
      bullet("We cannot say God is 'big' (that implies physical size). We say: God is not limited in power."),
      bullet("We cannot say God is 'merciful' the way a human is merciful. We say: God performs actions that, if a human did them, we would call merciful."),
      space(),
      callout("CHRISTIAN CONNECTION", "Maimonides warns against reducing God to human categories — which the Bible also forbids. Isaiah 55:8-9: 'My thoughts are not your thoughts, neither are your ways my ways, declares the Lord.' Yet Christianity adds something Maimonides could not fully grasp: while God transcends all human concepts, he chose to reveal himself PERSONALLY in Jesus Christ — making the unknowable God knowable.", "EBF5FB"),
      space(),

      h2("Zera Yacob (1592–1692) — African Christian Philosopher"),
      body("Zera Yacob was an Ethiopian Christian scholar who composed his major work, Hatata (Inquiry), while hiding in a cave after being forced to flee civil war. His approach is remarkable: he used pure reason, guided by a God-given inner light, to evaluate religious traditions — including his own."),
      space(),
      callout("ILLUSTRATION", "Yacob argued: God created humans as rational beings. He made us intelligent so that we would seek him out through reason. Therefore, any religious claim that contradicts the clear order of creation must be questioned — even if it comes from a prophet. He rejected certain miracle stories not because he doubted God, but because he believed God set up the laws of creation and would not violate them arbitrarily.", "FEF9E7"),
      space(),
      callout("CHRISTIAN CONNECTION", "Yacob's confidence in God-given reason reflects Acts 17:27 — God is 'not far from any one of us' and has placed within all people an instinct to seek him. His work also shows that African scholarship was part of the global philosophical conversation long before the modern era — a truth that enriches our understanding of how God has been at work across ALL nations.", "EBF5FB"),
      space(),
      callout("REFLECTION QUESTION", "Augustine, Aquinas, Boethius, and Maimonides all wrestled with how to reconcile faith and reason. How do you personally navigate this tension? Do you see any areas where your faith and your reasoning have been in conflict — and how did you (or might you) resolve it?", "FEF9E7"),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════
      // MASTER SUMMARY
      // ═══════════════════════════════════════════════════
      sectionHeader("FOUR", "Master Summary", "The Big Picture of Chapter 4 at a Glance"),
      space(),
      h2("The Story in One Paragraph"),
      body("Chapter 4 traces a remarkable journey: from the Egyptian pharaohs asking 'what is the one source of all things?', to Greek philosophers debating the building blocks of reality, to Roman thinkers developing inner peace and virtue, to Jewish, Christian, and Islamic scholars wrestling with how God-given revelation and human reason fit together. At every stage, thoughtful people were searching for truth — and as a Christian, you have the privilege of knowing that the Truth is a Person: Jesus Christ, who is 'the way, the truth, and the life' (John 14:6)."),
      space(),
      h2("Master Reference Table"),
      threeColTable(
        ["Thinker / School", "Key Idea", "Christian Relevance"],
        [
          ["Akhenaten (Egypt)", "One invisible God is the source of all", "Prepared monotheistic thought; echoes Genesis 1"],
          ["Thales / Presocratics", "Seeking the one substance behind all reality", "The search for ultimate unity — fulfilled in God"],
          ["Parmenides", "True reality is unchanging and eternal", "God is 'the same yesterday, today and forever' (Heb 13:8)"],
          ["Heraclitus & the Logos", "A rational principle orders all change", "John 1:1 — Jesus is the Logos made flesh"],
          ["Plato — Theory of Forms", "Eternal, perfect realities behind the material world", "Points to a transcendent dimension — heavenly realities"],
          ["Plato — Allegory of Cave", "Most people live in shadow, not true light", "Jesus is the Light of the World (John 8:12)"],
          ["Aristotle — Four Causes", "Everything has material, formal, efficient & final causes", "God is First Cause; humanity's final cause is to glorify God"],
          ["Aristotle — Eudaimonia", "Flourishing through virtuous character", "The fruit of the Spirit (Galatians 5:22-23)"],
          ["Stoics", "Inner peace through self-control", "Contentment in Christ (Philippians 4:11-13)"],
          ["Philo of Alexandria", "Logos = thoughts of God, bridge between God & creation", "Directly informs John 1:1 — Word (Logos) became flesh"],
          ["Augustine", "Restless heart; evil = absence of good; time; free will", "All human longing finds rest in God alone"],
          ["Boethius", "True happiness cannot be taken; found in God", "Nothing separates us from God's love (Romans 8:39)"],
          ["Anselm", "Faith seeks understanding; ontological argument", "Love God with all your MIND (Mark 12:30)"],
          ["Ibn Sina / Avicenna", "Necessary Being must exist; empirical knowledge theory", "God is I AM — self-existent (Exodus 3:14)"],
          ["Ibn Rushd / Averroes", "Faith and reason are compatible", "God commands intellectual reflection (Mark 12:30)"],
          ["Thomas Aquinas", "Five Ways to God; faith + reason working together", "Pinnacle of using philosophy to defend Christian faith"],
          ["Maimonides", "Negative theology; we can say what God is NOT", "God transcends human categories (Isaiah 55:8-9)"],
          ["Zera Yacob", "God-given reason leads to God; African perspective", "God is near all people (Acts 17:27)"],
        ]
      ),
      space(2),
      new Paragraph({ children: [new PageBreak()] }),

      // KEY TERMS
      sectionHeader("FIVE", "Key Terms Glossary", "Plain-Language Definitions for Every Important Word"),
      space(),
      threeColTable(
        ["Term", "Simple Definition", "Memory Hook"],
        [
          ["Historiography", "The study of HOW to study history — the methods we use", "History + Geography of ideas = Historiography"],
          ["Presentist Approach", "Reading old philosophy to find what is useful today", "'Present' — focus on NOW"],
          ["Contextualist Approach", "Understanding old philosophy in its original time and culture", "'Context' — the surrounding situation"],
          ["Hermeneutic Approach", "Balancing original context with our modern perspective", "Like a two-way conversation between past and present"],
          ["Anachronism", "Judging the past by today's standards — an error in historical reading", "Ana = against + chronos = time"],
          ["Monism", "The belief that reality is made of ONE substance", "Mono = one (like monologue, monocle)"],
          ["Pluralism", "The belief that reality is made of MANY substances", "Plural = many"],
          ["Theory of Forms", "Plato's idea that perfect, eternal realities underlie all physical things", "Think of the 'perfect circle' only in the mind"],
          ["Logos", "Greek for 'Word' or 'Reason' — used by Philo & John for the divine creative principle", "Logo = word/reason — Jesus is the Logos!"],
          ["Empiricism", "The belief that all knowledge comes from sense experience", "Empire of the senses"],
          ["Eudaimonia", "Aristotle's word for flourishing / human fulfilment", "Sounds like 'you-die-money-uh' — money won't bring it!"],
          ["Natural Theology", "Using reason and nature to know God without relying on revelation", "Nature reveals God (Romans 1:20)"],
          ["Negative Theology", "Knowing God by saying what He is NOT, since He transcends all categories", "God is NOT limited, NOT material, NOT created"],
          ["Scholasticism", "Medieval tradition of systematic theology using logic and reason", "School + Faith = Scholasticism"],
          ["Historiography", "How historians study and write history", "Meta-history — history studying itself"],
        ]
      ),
      space(2),
      new Paragraph({ children: [new PageBreak()] }),

      // DISCUSSION QUESTIONS
      sectionHeader("SIX", "Reflection & Discussion Questions", "For Personal Study or Group Conversation"),
      space(),
      body("Use these questions for personal meditation, small group discussion, or classroom study:"),
      space(),
      h2("Section 4.1 — Historiography"),
      numberedItem("When you read the Bible, which of the three approaches — presentist, contextualist, or hermeneutic — do you naturally use? Which do you think leads to the deepest understanding?"),
      numberedItem("Can you think of a Bible verse or story that is often misunderstood because people ignore its historical context? How does knowing the context change your understanding?"),
      numberedItem("Is it possible to read any text — even the Bible — without bringing your own perspective into it? What does this mean for how we should approach Scripture?"),
      space(),
      h2("Section 4.2 — Classical Philosophy"),
      numberedItem("Akhenaten proposed a single, invisible God centuries before Moses. Does this surprise you? What does it suggest about God's activity in the world outside Israel?"),
      numberedItem("Plato said most people live like prisoners watching shadows on a wall. In what ways might we as modern Christians still be 'watching shadows' instead of seeing true reality?"),
      numberedItem("Aristotle said the purpose of human life is to flourish (eudaimonia) through virtue. How does the Christian purpose — to glorify God and enjoy him forever — compare with this? What does Christianity add that Aristotle's ethics lack?"),
      numberedItem("The Stoics said: suffer less by controlling your reactions, not your circumstances. Paul said: 'I have learned to be content in any situation.' What is similar about these views, and what is fundamentally different?"),
      space(),
      h2("Section 4.3 — Jewish, Christian & Islamic Philosophy"),
      numberedItem("Philo of Alexandria used Greek philosophy to explain the Jewish scriptures. Do you think this approach is wise or dangerous? Where are the limits?"),
      numberedItem("Augustine said 'Our heart is restless until it rests in you, O Lord.' Describe a time when you searched for rest, meaning or purpose in something other than God — and what happened."),
      numberedItem("Thomas Aquinas believed faith and reason were partners, not enemies. Have you ever felt that studying or thinking deeply threatened your faith? How did you resolve it?"),
      numberedItem("Maimonides said we can only say what God is NOT. Do you find this helpful or limiting? How does God's self-revelation in Jesus change this?"),
      numberedItem("Zera Yacob used reason to evaluate all religions from an African context. What can African Christians today draw from his example?"),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // QUICK TEST
      sectionHeader("SEVEN", "Quick Knowledge Check", "15 Questions to Test Your Understanding"),
      space(),
      body("Answer True/False or fill in the blank:"),
      space(),
      numberedItem("The word 'philosophy' comes from the Greek words meaning ________ (affection/love) and ________ (wisdom)."),
      numberedItem("The three main approaches to studying the history of philosophy are: ________, ________, and ________."),
      numberedItem("True or False: Ancient Greek philosophy had no connection to Egyptian scholarship."),
      numberedItem("Plato's Theory of Forms teaches that the physical world is ________ and the realm of Forms is ________ and ________."),
      numberedItem("The Allegory of the Cave illustrates that most people mistake ________ for reality."),
      numberedItem("Aristotle's four causes are: ________, ________, ________, and ________ cause."),
      numberedItem("The Greek word LOGOS, used by Heraclitus for the rational principle of the universe, was used by John the Apostle to describe ________."),
      numberedItem("Philo of Alexandria identified Plato's Forms with God's ________ — the bridge between the eternal God and the physical world."),
      numberedItem("Augustine's famous statement was: 'Our heart is ________ until it rests in you, O Lord.'"),
      numberedItem("Boethius wrote The Consolation of Philosophy while ________."),
      numberedItem("Anselm's motto was: '________ seeking understanding.'"),
      numberedItem("Ibn Sina's 'Proof of the Truthful' concludes that there must be a ________ Being — one that cannot not exist."),
      numberedItem("Thomas Aquinas proposed ________ ways to prove the existence of God."),
      numberedItem("Maimonides argued that we can only describe God by saying what he is ________ — this is called Negative Theology."),
      numberedItem("Zera Yacob was an ________ Christian philosopher who wrote his major work while hiding from civil conflict."),
      space(),

      // ANSWER KEY
      h2("Answer Key"),
      threeColTable(
        ["Q#", "Answer", ""],
        [
          ["1", "philos (love/affection) and sophos (wisdom)", ""],
          ["2", "Presentist, Contextualist, Hermeneutic", ""],
          ["3", "FALSE — Much of Greek philosophy originated from or was influenced by Egyptian scholarship", ""],
          ["4", "Imperfect & changing; eternal, perfect, and unchanging", ""],
          ["5", "Shadows (illusions)", ""],
          ["6", "Material, Formal, Efficient, Final", ""],
          ["7", "Jesus Christ (John 1:1)", ""],
          ["8", "Logos (the thoughts of God)", ""],
          ["9", "Restless", ""],
          ["10", "While imprisoned and awaiting execution", ""],
          ["11", "Faith", ""],
          ["12", "Necessary", ""],
          ["13", "Five", ""],
          ["14", "NOT (what God is not)", ""],
          ["15", "Ethiopian", ""],
        ]
      ),
      space(2),
      new Paragraph({ children: [new PageBreak()] }),

      // CLOSING
      sectionHeader("EIGHT", "Closing Devotional", "Bringing It All Together in Faith"),
      space(),
      body("As you close this chapter, take a moment to step back and see the grand sweep of history it describes."),
      space(),
      body("For thousands of years, from the banks of the Nile to the hills of Athens, from the deserts of Arabia to the monasteries of Europe, from the forests of Ethiopia to the courts of medieval Spain — human beings have been asking the same questions:"),
      space(),
      bullet("What is real?"),
      bullet("How do I know anything?"),
      bullet("What is good?"),
      bullet("Is there a God?"),
      bullet("How should I live?"),
      space(),
      body("Every thinker you have met in this chapter was, whether they knew it or not, stretching out their hands toward the same One. Some got remarkably close — Akhenaten's single God, Heraclitus's Logos, Plato's eternal Forms, Aristotle's First Cause, Philo's divine Logos, Augustine's restless heart."),
      space(),
      body("But it was not philosophy that finally answered these questions. It was a Person. A Word made flesh. A God who came looking for us."),
      space(),
      callout("CLOSING SCRIPTURE", "\"For in him we live and move and have our being. As some of your own poets have said, 'We are his offspring.'\" — Acts 17:28\n\nPaul quoted Greek philosophy — the very tradition this chapter explored — to introduce the Athenians to the God they were unknowingly seeking. You now understand exactly what he was doing. And you carry that same message into your world.", "E8F4FD"),
      space(2),
      divider(),
      space(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Go, therefore, and love the Lord your God with all your heart, soul, strength, and MIND.", bold: true, size: 26, font: "Arial", color: "1F4E79", italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "— Mark 12:30 —", size: 22, font: "Arial", color: "7F7F7F" })] }),
      space(2),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('d:\\JEMEKA TOURS\\Chapter4_Teaching_Guide_Christian.docx', buffer);
  console.log('Done!');
});
