/**
 * Build Expression Sheet
 *
 * Composites individual expression PNGs into a single labeled grid image.
 * Used as "Image 3" in the Nano Banana API calls for expression consistency.
 *
 * Layout: 4 columns, rows as needed
 * Each cell: label text on top, expression image below
 *
 * Usage: node scripts/build-expression-sheet.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const EXPRESSIONS_DIR = path.join(
  __dirname,
  "..",
  "public",
  "references",
  "expressions"
);
const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "public",
  "references",
  "expression-sheet.png"
);

const COLS = 4;
const CELL_SIZE = 400; // Resize each expression to this
const LABEL_HEIGHT = 50; // Height for the text label
const CELL_WIDTH = CELL_SIZE;
const CELL_HEIGHT = CELL_SIZE + LABEL_HEIGHT;
const PADDING = 10;
const BG_COLOR = { r: 255, g: 255, b: 255, alpha: 255 }; // White background

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Find all expression PNGs
  const files = fs
    .readdirSync(EXPRESSIONS_DIR)
    .filter((f) => f.endsWith(".png"))
    .sort();

  console.log(`Found ${files.length} expressions:`, files.map((f) => f.replace(".png", "")));

  const rows = Math.ceil(files.length / COLS);
  const sheetWidth = COLS * CELL_WIDTH + (COLS + 1) * PADDING;
  const sheetHeight = rows * CELL_HEIGHT + (rows + 1) * PADDING + LABEL_HEIGHT; // extra top label

  console.log(`Grid: ${COLS}x${rows} = ${sheetWidth}x${sheetHeight}px`);

  // Create composites array
  const composites = [];

  // Title text
  const titleSvg = createTextSvg(
    "CRABART EXPRESSION REFERENCE SHEET",
    sheetWidth,
    LABEL_HEIGHT,
    24,
    "#333333"
  );
  composites.push({
    input: Buffer.from(titleSvg),
    top: 5,
    left: 0,
  });

  for (let i = 0; i < files.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PADDING + col * (CELL_WIDTH + PADDING);
    const y = LABEL_HEIGHT + PADDING + row * (CELL_HEIGHT + PADDING);
    const expressionName = files[i].replace(".png", "").toUpperCase();

    // Label
    const labelSvg = createTextSvg(
      expressionName,
      CELL_WIDTH,
      LABEL_HEIGHT,
      20,
      "#555555"
    );
    composites.push({
      input: Buffer.from(labelSvg),
      top: y,
      left: x,
    });

    // Expression image — resize to CELL_SIZE, keep transparency
    const imgPath = path.join(EXPRESSIONS_DIR, files[i]);
    const resized = await sharp(imgPath)
      .resize(CELL_SIZE, CELL_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    composites.push({
      input: resized,
      top: y + LABEL_HEIGHT,
      left: x,
    });
  }

  // Create the sheet
  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite(composites)
    .png({ quality: 90 })
    .toFile(OUTPUT_PATH);

  // Report file size
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(
    `\nExpression sheet saved to: ${OUTPUT_PATH}`
  );
  console.log(`File size: ${(stats.size / 1024).toFixed(1)}KB`);
}

// ---------------------------------------------------------------------------
// Create SVG text label
// ---------------------------------------------------------------------------

function createTextSvg(text, width, height, fontSize, color) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <text
      x="${width / 2}"
      y="${height / 2 + fontSize / 3}"
      text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-size="${fontSize}"
      font-weight="bold"
      fill="${color}"
      letter-spacing="2"
    >${text}</text>
  </svg>`;
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
