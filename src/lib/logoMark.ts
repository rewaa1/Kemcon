import sharp from "sharp";

/**
 * Turns a hotel's logo file into a uniform monochrome mark.
 *
 * The clients page renders these as faint watermarks on a dark card, and the
 * source files are far too inconsistent to do that with CSS alone. Two
 * problems, measured across the 34 distinct logos we hold:
 *
 *  - Whitespace. The artwork's share of its own canvas runs from 22%
 *    (InterContinental: a 203x34 wordmark centred on a 225x139 field) to 100%
 *    (Meridien). `object-contain` fits the canvas, not the artwork, so the
 *    same CSS box rendered marks at wildly different optical sizes — the
 *    InterContinental mark came out roughly 7px tall.
 *
 *  - Polarity. Most files are dark artwork on white, but four are light
 *    artwork on white (Steigenberger Cecil, Cleopatra Luxury, Alamein, Coral
 *    Beach) and one is light on a dark ground (The Red Residence). A single
 *    CSS `invert` cannot serve both: it rescued the dark ones and erased the
 *    light ones.
 *
 * So we trim to the artwork, decide polarity per file, and rebuild the mark as
 * a bone-toned silhouette with a real alpha channel. The caller then only has
 * to set an opacity — no filters, no blend modes, and nothing that depends on
 * what colour the source happened to be.
 */

/** The mark's colour: the theme's bone accent, `--color-accent`. */
const BONE = { r: 0xd8, g: 0xd2, b: 0xc8 };

/** Fit box for the returned mark. Generous — the card scales it down. */
const OUT_WIDTH = 320;
const OUT_HEIGHT = 96;

/**
 * How far a pixel must sit from the background before it counts as artwork.
 * Low enough to keep antialiased edges and thin serifs, high enough that JPEG
 * ringing around a wordmark does not become a grey haze.
 */
const INK_THRESHOLD = 24;

/** Contrast stretch applied to the alpha channel, as `linear(slope, offset)`. */
const ALPHA_SLOPE = 1.5;

/**
 * Opaque share above which a mark is treated as a mis-resolved filled plate
 * rather than artwork. The densest genuine mark we hold (Marriott's monogram)
 * sits at 36%, so 60% leaves comfortable room.
 */
const PLATE_INK_RATIO = 0.6;

// Changing what this file produces means bumping `MARK_VERSION` in
// `@/lib/logoMarkVersion`, or browsers keep serving marks from the old
// pipeline out of their year-long cache.

/**
 * Opaque share below which a mark is treated as too sparse to read at the size
 * the card renders it, and gets one dilation pass.
 */
const SPARSE_INK_RATIO = 0.08;

/** Resolution the frame-detection analysis pass runs at. */
const ANALYSIS_SIZE = 256;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/**
 * Background luminance, sampled from the border ring.
 *
 * Sampling the edge rather than the whole image is what makes polarity
 * detection reliable: a logo that is mostly ink and a logo that is mostly
 * background have very different overall means, but both have a border made of
 * background.
 *
 * This has to be measured twice — once on the raw file to know what colour to
 * trim away, and again on the trimmed result. Four of these logos (Reef Oasis,
 * Concorde, The Red Residence, Rihana) are light text on a dark plate sitting
 * on a white canvas: measured before the trim they look light-backed, and the
 * plate itself then comes out as ink, rendering the mark as a solid block. The
 * trimmed image's border is the plate, which is the background that matters.
 */
async function backgroundLuminance(image: sharp.Sharp): Promise<number> {
  const { data, info } = await image
    .clone()
    .resize(32, 32, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const edge: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const onEdge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (onEdge) edge.push(data[y * width + x]);
    }
  }
  return median(edge);
}

/**
 * Whether the artwork is brighter or darker than the ground it sits on.
 *
 * Asking "is the ground light?" and inferring dark ink from it is wrong for
 * Rihana, whose mark is white artwork on a solid mid-tan field that covers the
 * whole canvas — a light ground with lighter ink. Comparing both luminance
 * tails against the ground makes no assumption about either being near white
 * or black, and reads the same for a wordmark reversed out of a dark plate.
 */
async function inkIsBrighterThanGround(image: sharp.Sharp, ground: number): Promise<boolean> {
  const { data } = await image
    .clone()
    .resize(64, 64, { fit: "inside" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sorted = Array.from(data).sort((a, b) => a - b);
  const dark = sorted[Math.floor(sorted.length * 0.02)];
  const bright = sorted[Math.floor(sorted.length * 0.98)];

  return Math.abs(bright - ground) > Math.abs(ground - dark);
}

/** A region of an image, as fractions of its width and height. */
interface Region {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * The wordmark inside an enclosing border, if the mark is drawn as one.
 *
 * Steigenberger Cecil's logo is a rounded rectangle with "STEIGENBERGER /
 * HOTELS & RESORTS" set small inside it. Fitted whole, the border takes the
 * card's box and the words land around five pixels tall — visible to a
 * measurement, unreadable to a person. Cropping to the contents lets the words
 * fill the box like every other wordmark.
 *
 * Detection is by how the content box responds to a small inset rather than by
 * looking for the border itself: that rule is second-guessed by how heavy the
 * border is drawn. Steigenberger's is a hairline that falls below the opacity
 * threshold entirely once scaled down for analysis, yet insetting 3% still
 * collapses its content box from 98% of the image to 5% — a shape that only
 * occurs when something thin traces the edges and the real artwork sits well
 * inside. A plain wordmark barely moves under the same inset.
 */
function enclosedContents(alpha: Buffer, width: number, height: number): Region | null {
  const OPAQUE = 32;

  const contentBox = (inset: number) => {
    let minX = width, minY = height, maxX = -1, maxY = -1, ink = 0;
    for (let y = inset; y < height - inset; y++) {
      for (let x = inset; x < width - inset; x++) {
        if (alpha[y * width + x] <= OPAQUE) continue;
        ink++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < 0) return null;
    return {
      minX, minY, maxX, maxY, ink,
      area: ((maxX - minX + 1) * (maxY - minY + 1)) / (width * height),
    };
  };

  const full = contentBox(0);
  const inset = Math.max(2, Math.round(Math.min(width, height) * 0.03));
  const inner = contentBox(inset);

  if (!full || !inner) return null;

  // Only when the artwork really does reach the edges, and dropping a thin
  // margin leaves something much smaller — and still substantial enough to be
  // artwork rather than a stray speck.
  if (full.area < 0.8) return null;
  if (inner.area > full.area * 0.5) return null;
  if (inner.ink / (width * height) < 0.002) return null;

  const pad = Math.round(Math.min(width, height) * 0.04);
  const left = Math.max(0, inner.minX - pad);
  const top = Math.max(0, inner.minY - pad);
  const right = Math.min(width - 1, inner.maxX + pad);
  const bottom = Math.min(height - 1, inner.maxY + pad);

  return {
    left: left / width,
    top: top / height,
    width: (right - left + 1) / width,
    height: (bottom - top + 1) / height,
  };
}

/**
 * Thickens a mark by one pixel in every direction.
 *
 * Cleopatra Luxury is pale, thin-stroked lettering; scaled into the card's box
 * its strokes land under a pixel wide and wash out however opaque they are.
 * One dilation pass restores enough weight to read, and is only ever applied
 * to marks sparse enough that it cannot close up their counters.
 */
function dilate(alpha: Buffer, width: number, height: number): Buffer {
  const out = Buffer.alloc(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let max = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny < 0 || nx < 0 || ny >= height || nx >= width) continue;
          const v = alpha[ny * width + nx];
          if (v > max) max = v;
        }
      }
      out[y * width + x] = max;
    }
  }
  return out;
}

/**
 * Normalises one logo file into a bone silhouette on transparency.
 *
 * @param input the source file's bytes, in any format sharp can decode
 * @returns PNG bytes, or null if the input could not be decoded
 */
export async function toLogoMark(input: Buffer): Promise<Buffer | null> {
  let flattened: sharp.Sharp;
  try {
    // Flatten first so transparent files and opaque files take the same path;
    // white is the right backdrop because every transparent logo we hold is
    // dark artwork meant to sit on a light page.
    flattened = sharp(input).flatten({ background: "#ffffff" });
    await flattened.clone().metadata();
  } catch {
    return null;
  }

  // Trim the file's own margin away, so the artwork fills its box.
  const canvasLuminance = await backgroundLuminance(flattened);
  let trimmed = flattened.clone().trim({
    background: canvasLuminance > 128 ? "#ffffff" : "#000000",
    threshold: INK_THRESHOLD,
  });

  // `trim` throws when it would consume the whole image (a logo that is one
  // flat colour); fall back to the untrimmed original in that case.
  try {
    await trimmed.clone().toBuffer();
  } catch {
    trimmed = flattened.clone();
  }

  const groundLuminance = await backgroundLuminance(trimmed);
  const inkIsBrighter = await inkIsBrighterThanGround(trimmed, groundLuminance);
  const ground = inkIsBrighter ? groundLuminance : 255 - groundLuminance;

  /** Cuts the ground away, leaving artwork opaque. Shared by both passes. */
  const cutGround = (pipeline: sharp.Sharp) =>
    (inkIsBrighter ? pipeline : pipeline.negate())
      .linear(ALPHA_SLOPE, -((ground + INK_THRESHOLD) * ALPHA_SLOPE))
      .normalise();

  // Look for an enclosing frame, and crop to its contents when the frame is
  // all there is at full size.
  const trimmedBuffer = await trimmed.toBuffer();
  let content = sharp(trimmedBuffer);

  const analysis = await cutGround(
    sharp(trimmedBuffer).resize(ANALYSIS_SIZE, ANALYSIS_SIZE, { fit: "inside" }).greyscale(),
  )
    .raw()
    .toBuffer({ resolveWithObject: true });

  const contents = enclosedContents(analysis.data, analysis.info.width, analysis.info.height);
  if (contents) {
    const { width = 0, height = 0 } = await sharp(trimmedBuffer).metadata();
    content = sharp(trimmedBuffer).extract({
      left: Math.round(contents.left * width),
      top: Math.round(contents.top * height),
      width: Math.max(1, Math.round(contents.width * width)),
      height: Math.max(1, Math.round(contents.height * height)),
    });
  }

  // Build the alpha channel: artwork opaque, ground transparent. Negating when
  // the ink is the darker of the two is what makes the polarities converge —
  // afterwards "bright" always means "ink" regardless of the source.
  //
  // The cut is taken relative to the measured ground rather than to pure black
  // or white, because several of these grounds are neither: The Red Residence
  // sits on a mid-dark red, and Rihana on a mid-light tan, that a fixed
  // threshold leaves half-opaque.
  // `normalise` inside `cutGround` is what rescues the low-contrast files.
  // Cleopatra Luxury is pale grey artwork on white — barely 78 levels of
  // separation — which survives the cut at around a third opacity and then
  // disappears again under the card's own opacity. Stretching each mark to its
  // own full range means contrast in the source file no longer decides how
  // present the mark is on the card.
  const { data: rawAlpha, info } = await cutGround(
    content.resize(OUT_WIDTH, OUT_HEIGHT, { fit: "inside", withoutEnlargement: false }).greyscale(),
  )
    .raw()
    .toBuffer({ resolveWithObject: true });

  let alpha: Buffer<ArrayBufferLike> = Buffer.from(rawAlpha);

  const inkRatio = (buffer: Buffer) => {
    let ink = 0;
    for (const a of buffer) if (a > 24) ink++;
    return ink / buffer.length;
  };

  // A logo is sparse ink, so a mark that came out mostly opaque means we
  // resolved polarity backwards and painted the artwork's own filled plate.
  // Concorde and Rihana are drawn that way: a wordmark reversed out of a solid
  // box, with no margin for the trim to find. Inverting the alpha recovers the
  // wordmark and drops the plate.
  if (inkRatio(alpha) > PLATE_INK_RATIO) {
    for (let i = 0; i < alpha.length; i++) alpha[i] = 255 - alpha[i];
  }

  if (inkRatio(alpha) < SPARSE_INK_RATIO) {
    alpha = dilate(alpha, info.width, info.height);
  }

  // Paint that silhouette in bone.
  return sharp({
    create: {
      width: info.width,
      height: info.height,
      channels: 3,
      background: BONE,
    },
  })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
