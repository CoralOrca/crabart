/**
 * CrabArt — Prompt Template System
 *
 * The base prompt defines the character identity (NEVER changes).
 * Variation layers are appended to create daily unique pieces.
 *
 * Reference images are ALWAYS sent:
 *   - Image 1: Character reference (the canonical CrabArt character)
 *   - Image 2: Composition mask (white silhouette = where the character goes)
 *   - Image 3: Expression reference sheet (labeled grid of face-only expressions)
 */

// ---------------------------------------------------------------------------
// Reference image context — prepended when images are attached
// ---------------------------------------------------------------------------

export const REFERENCE_CONTEXT = `- Image 1: This is the canonical character reference. The generated image MUST match this character exactly — same species, same face structure, same proportions, same coral/red color, same claw shape (simple 2-part pincer: upper + lower, never fingers). Only the expression, outfit, and accessory should change.
- Image 2: This is a composition mask. The white filled area on the black background defines the EXACT position, size, and silhouette boundaries for the character. The character MUST be positioned, sized, and shaped to precisely fill this white area — no shifting left/right/up/down, no resizing, no silhouette changes. The character's body outline must match the mask's white shape exactly. The character faces LEFT (2/3 orientation to the left), with the claw visible in the LOWER-RIGHT. The final image background MUST be exactly #FAFAF3 (not black, not white — warm off-white #FAFAF3).
- Image 3: This is the EXPRESSION REFERENCE — a single face showing the target expression. Use Image 3 ONLY for the facial features: copy the exact eye shape, eye size, pupil position, mouth shape, and brow position. IGNORE everything else about Image 3 — do NOT use it for body shape, silhouette, position, or size. The silhouette and position come EXCLUSIVELY from Image 2 (the composition mask). Image 3 controls ONLY the eyes and mouth.`;

// ---------------------------------------------------------------------------
// Base identity prompt (always included)
// ---------------------------------------------------------------------------

export const BASE_PROMPT = `Generate a new variation of the character from Image 1, following the composition from Image 2, and using the facial expression from Image 3.

This is an AI-native NFT collection. Each image must preserve identity continuity while allowing controlled variation through layers.

The character is a stylized crustacean with a Pepe-inspired face.
The character has:
- A triangular, faceted body shape
- Coral / red color palette with subtle shading
- Large expressive Pepe-style eyes and mouth
- Pupils are black with two white reflective highlights
- A single visible crab claw with smooth, rounded forms (a 2-part pincer: upper + lower)
- Clean, bold illustration style
- Flat yet refined lighting

CRITICAL COMPOSITION RULES (must be identical across every image in the collection):
- The character identity, proportions, face structure, and placement MUST remain consistent with Image 1 and Image 2
- Do not change the species, body shape, or core facial features
- The character is oriented roughly 2/3 facing to the LEFT of the image, matching Image 1 exactly
- The character's gaze direction is always looking toward the LEFT side of the image
- The claw is ALWAYS visible in the LOWER-RIGHT area of the image, holding the accessory
- The claw position must remain consistent — lower-right quadrant, same relative placement as Image 1
- The claw must be a simple 2-part pincer (upper + lower) — never more than two pincer parts

Style constraints:
- 2D illustration or clean semi-flat digital art
- Consistent line weight
- Soft gradients, no heavy textures
- No photorealism
- No background clutter

Background:
- EXACT background color: #FAFAF3 (warm off-white). Fill the entire background with this exact hex color
- No scene or environment elements
- No gradients, patterns, or textures in the background — pure flat #FAFAF3

Do NOT:
- Change the character species or body shape
- Remove the claw or move it away from the lower-right area
- Alter the coral/red base color
- Remove the white reflective highlights in the pupils
- Turn this into a different meme character
- Add a nose or nostrils to the character
- Add text, logos, watermarks, or signatures
- Move the character's position (left/right/up/down) from the composition mask
- Resize the character larger or smaller than the composition mask
- Change the body silhouette or outline shape from the composition mask
- Extend body parts outside the white mask boundaries
- Flip or mirror the character — the character must ALWAYS face left
- Change the background color from #FAFAF3
- Render the claw as a human hand (no palm, no fingers, no thumb)
- Add extra claw digits/parts beyond a simple 2-part pincer

This image is part of a generative NFT collection.
Visual consistency across the collection is more important than novelty.
Prioritize identity persistence over creative variation.`;

// ---------------------------------------------------------------------------
// Variation options — 10 expressions, 42 outfits, 42 accessories
// ---------------------------------------------------------------------------

export const EXPRESSIONS = [
  
  { id: "amused", label: "Amused" },
  { id: "annoyed", label: "Annoyed" },
  { id: "bliss", label: "Bliss" },
  { id: "bored", label: "Bored" },
  { id: "chill", label: "Chill" },
  { id: "confused", label: "Confused" },
  { id: "happy", label: "Happy" },
  { id: "love", label: "Love" },
  { id: "mad", label: "Mad" },
  { id: "pissed", label: "Pissed" },
  { id: "sad", label: "Sad" },
  { id: "smug", label: "Smug" },
  { id: "tired", label: "Tired" },

] as const;

export const OUTFITS = [
  { id: "topless", label: "Topless" },
  // Hoodies & Sweats
  { id: "grey-hoodie", label: "Grey Hoodie" },
  { id: "black-hoodie", label: "Black Hoodie" },
  { id: "cream-hoodie", label: "Cream Hoodie" },
  { id: "forest-green-hoodie", label: "Forest Green Hoodie" },
  { id: "burgundy-crewneck", label: "Burgundy Crewneck" },
  { id: "oversized-sweatshirt", label: "Oversized Sweatshirt" },
  // Jackets & Outerwear
  { id: "navy-bomber", label: "Navy Bomber Jacket" },
  { id: "denim-jacket", label: "Denim Jacket" },
  { id: "olive-vest", label: "Olive Puffer Vest" },
  { id: "windbreaker", label: "Windbreaker" },
  { id: "black-leather-jacket", label: "Black Leather Jacket" },
  { id: "varsity-jacket", label: "Varsity Jacket" },
  { id: "trench-coat", label: "Beige Trench Coat" },
  { id: "parka", label: "Khaki Parka" },
  { id: "fleece-zip", label: "Fleece Half-Zip" },
  { id: "rain-jacket", label: "Yellow Rain Jacket" },
  // Shirts & Tees
  { id: "white-tee", label: "White T-Shirt" },
  { id: "black-tee", label: "Black T-Shirt" },
  { id: "striped-tee", label: "Striped T-Shirt" },
  { id: "flannel-shirt", label: "Flannel Shirt" },
  { id: "hawaiian-shirt", label: "Hawaiian Shirt" },
  { id: "oxford-shirt", label: "Light Blue Oxford Shirt" },
  { id: "henley", label: "Grey Henley" },
  { id: "polo", label: "Navy Polo" },
  { id: "linen-shirt", label: "White Linen Shirt" },
  { id: "chambray-shirt", label: "Chambray Shirt" },
  // Formal & Smart
  { id: "turtleneck", label: "Black Turtleneck" },
  { id: "cardigan", label: "Charcoal Cardigan" },
  { id: "blazer", label: "Navy Blazer" },
  { id: "suit-jacket", label: "Charcoal Suit Jacket" },
  { id: "waistcoat", label: "Tweed Waistcoat" },
  { id: "cable-knit", label: "Cream Cable Knit Sweater" },
  // Casual & Sport
  { id: "tank-top", label: "Grey Tank Top" },
  { id: "jersey", label: "Sports Jersey" },
  { id: "track-jacket", label: "Track Jacket" },
  { id: "fishing-vest", label: "Fishing Vest" },
  { id: "rugby-shirt", label: "Rugby Shirt" },
  // Statement
  { id: "kimono-jacket", label: "Dark Kimono Jacket" },
  { id: "poncho", label: "Woven Poncho" },
  { id: "cape", label: "Short Cape" },
  { id: "lab-coat", label: "Lab Coat" },
  { id: "chef-coat", label: "Chef Coat" },
] as const;

export const ACCESSORIES = [
  // Smoking & Drinks
  { id: "cigarette", label: "Cigarette" },
  { id: "joint", label: "Joint" },
  { id: "pipe", label: "Smoking Pipe" },
  { id: "cigar", label: "Cigar" },
  { id: "coffee-cup", label: "Coffee Cup" },
  { id: "espresso", label: "Espresso Cup" },
  { id: "tea-cup", label: "Tea Cup" },
  { id: "cocktail", label: "Cocktail Glass" },
  { id: "wine-glass", label: "Wine Glass" },
  { id: "beer-can", label: "Beer Can" },
  { id: "can-of-soda", label: "Can of Soda" },
  { id: "smoothie", label: "Smoothie Cup" },
  // Tech & Tools
  { id: "phone", label: "Smartphone" },
  { id: "pen", label: "Fountain Pen" },
  { id: "paintbrush", label: "Paintbrush" },
  { id: "wrench", label: "Wrench" },
  { id: "game-controller", label: "Game Controller" },
  { id: "camera", label: "Vintage Camera" },
  { id: "microphone", label: "Microphone" },
  { id: "walkie-talkie", label: "Walkie-Talkie" },
  // Objects & Props
  { id: "book", label: "Small Book" },
  { id: "newspaper", label: "Folded Newspaper" },
  { id: "rose", label: "Single Red Rose" },
  { id: "sunflower", label: "Sunflower" },
  { id: "diamond", label: "Diamond" },
  { id: "gold-coin", label: "Gold Coin" },
  { id: "key", label: "Old Key" },
  { id: "magnifying-glass", label: "Magnifying Glass" },
  { id: "trophy", label: "Small Trophy" },
  { id: "rubber-duck", label: "Rubber Duck" },
  // Food
  { id: "apple", label: "Apple" },
  { id: "banana", label: "Banana" },
  { id: "donut", label: "Donut" },
  { id: "ice-cream", label: "Ice Cream Cone" },
  { id: "sushi-roll", label: "Sushi Roll" },
  { id: "lollipop", label: "Lollipop" },
  // Wearable Accessories
  { id: "sunglasses", label: "Sunglasses (on head)" },
  { id: "headphones", label: "Headphones (around neck)" },
  { id: "scarf", label: "Knit Scarf" },
  { id: "watch", label: "Wristwatch" },
  // Nothing
  { id: "nothing", label: "Nothing (empty claw)" },
  // Weapons & Fantasy
  { id: "katana", label: "Katana" },
] as const;

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

export interface VariationOptions {
  expression: string;
  outfit: string;
  accessory: string;
  customNotes?: string;
}

export function buildPrompt(options: VariationOptions): string {
  const expressionMeta = EXPRESSIONS.find((e) => e.id === options.expression);
  const outfitMeta = OUTFITS.find((o) => o.id === options.outfit);
  const accessoryMeta = ACCESSORIES.find((a) => a.id === options.accessory);

  const expressionLabel = (expressionMeta?.label ?? options.expression).toUpperCase();

  const variationBlock = `
Facial expression variation:
- The expression is: ${expressionLabel}
- Copy the EXACT eye shape, pupil position, mouth curve, and brow angle from Image 3
- Image 3 is ONLY a face reference for expression — do NOT let it influence the body silhouette, position, or size (those come from Image 2 only)
- The expression must be visually distinguishable — eyes and mouth are the key differentiators
- Keep the Pepe face structure — no extreme distortion

Outfit layer:
- The character is wearing: ${outfitMeta?.label ?? options.outfit}
- Outfit should be modern, minimal
- Neutral color, no logos or text
- Outfit must not obscure the face or claw
- Fabric should feel soft and contemporary

Accessory and claw:
- The claw is holding: ${accessoryMeta?.label ?? options.accessory}
- The claw MUST be visible in the lower-right area of the image, matching Image 1's claw position
- The claw must be a simple 2-part pincer (upper + lower) — no palm, no fingers, no extra digits
- Hold the accessory by pinching it between the two pincer parts (not wrapping around it)
- Keep a simple neutral pose — character faces left, claw on the right`;

  const custom = options.customNotes?.trim()
    ? `\n\nAdditional notes:\n${options.customNotes.trim()}`
    : "";

  return BASE_PROMPT + "\n" + variationBlock + custom;
}
