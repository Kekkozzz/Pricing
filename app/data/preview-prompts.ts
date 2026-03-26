export type PreviewInput = {
  businessName: string;
  sector: string;
  style: string;
  colorPalette: string[];
  description: string;
  referenceUrls?: string;
  serviceName: string;
  serviceId: string;
  tierName: string;
  features: string[];
  addOns: string[];
};

// --- Service-specific layout blueprints ---

const serviceBlueprints: Record<string, { layout: string; sections: string }> = {
  "siti-web": {
    layout: "corporate website / brochure homepage",
    sections: `- Sticky navbar with logo left, navigation links right, and a subtle CTA button
- Full-width hero section with a bold headline (max 8 words), a one-line subheadline, and a prominent CTA button. Background uses a high-quality relevant image with a dark gradient overlay for text contrast
- "About" section with a 60/40 text-image split layout, generous whitespace
- Services grid: 3 or 4 cards with icons, short titles, and one-line descriptions, consistent card heights
- Testimonial or trust section with a quote, attribution, and subtle background differentiation
- Footer with 3-column layout: brand + tagline, quick links, contact info`,
  },
  "shop-saas": {
    layout: "e-commerce storefront homepage",
    sections: `- Top bar with logo, search input with icon, cart icon with badge, and user icon
- Full-width promotional hero banner with a lifestyle image, overlay headline, and "Shop Now" CTA
- "Featured Products" section: 4-column product grid, each card has a product image placeholder, name, price, and "Add to Cart" button with hover state
- Category navigation strip with pill-shaped buttons
- "Why Choose Us" strip: 4 icon+text blocks (free shipping, secure payment, etc.)
- Footer with newsletter signup input, payment method icons, and multi-column links`,
  },
  "web-app": {
    layout: "SaaS dashboard web application",
    sections: `- Left sidebar (dark) with logo at top, icon+label navigation items, active state highlighted, user avatar at bottom
- Top header bar with breadcrumb, search input, notification bell icon, and profile dropdown
- Main content area with a welcome greeting and 4 stat cards in a row (icon, number, label, subtle trend indicator)
- Below stats: a large area chart or bar chart placeholder with clean axes and a legend
- Data table with 5-6 rows, column headers, alternating row colors, and action buttons
- Floating action button (FAB) in bottom-right corner`,
  },
  "seo-marketing": {
    layout: "high-conversion marketing landing page",
    sections: `- Minimal navbar with logo and a single "Get Started" CTA button
- Hero section: large bold headline (benefit-driven), subheadline, email capture input with CTA button, and a hero image or illustration on the right (60/40 split)
- Logo bar: 5-6 grayscale partner/client logos in a horizontal strip
- Stats section: 3 large numbers with labels (e.g., "10K+ Clients", "99% Uptime")
- Features section: 3-column grid with icons, titles, and 2-line descriptions
- Social proof: 2-3 testimonial cards with avatar, name, role, and quote
- Final CTA section with contrasting background, headline, and centered button`,
  },
};

// --- Style-specific design directives ---

const styleDirectives: Record<string, string> = {
  minimal: `DESIGN DIRECTION — MINIMAL:
Typography: Use a clean sans-serif like Inter or Helvetica. One font family only. Sizes: hero headline ~48px, body ~16px.
Spacing: Extremely generous whitespace — sections have 120px+ vertical padding. Content max-width ~1000px.
Color: Use the brand colors sparingly — primary for CTAs and accents only. Background is white/off-white, text is near-black (#111). Maximum 2 colors beyond neutrals.
Layout: Strict grid alignment. Asymmetric layouts are acceptable. No decorative borders or shadows.
Details: No gradients, no rounded corners over 4px, no stock photos. Prefer geometric shapes or high-contrast photography. Buttons are minimal with subtle borders or solid fill.`,

  moderno: `DESIGN DIRECTION — MODERN:
Typography: Pair a geometric sans-serif (e.g., Plus Jakarta Sans) for headings with a readable body font. Hero headline ~52px bold.
Spacing: Generous padding (80-100px between sections). Cards have 24-32px internal padding.
Color: Use brand colors with subtle gradients (linear, 2 stops). Soft shadows (0 4px 24px rgba(0,0,0,0.08)). Light backgrounds with colored accent sections.
Layout: Use large border-radius (12-16px) on cards and buttons. Asymmetric hero with floating UI elements or device mockups. Overlapping elements add depth.
Details: Micro-interactions implied through hover states. Glassmorphism accents where appropriate. Rounded pill-shaped buttons. Subtle background patterns or mesh gradients.`,

  corporate: `DESIGN DIRECTION — CORPORATE:
Typography: Pair a refined serif (e.g., Playfair Display) for headlines with a professional sans-serif body. Authoritative and structured.
Spacing: Consistent grid-based spacing. Sections use 80-100px padding. Content structured in clear rows and columns.
Color: Muted, serious palette — navy, charcoal, white. Brand colors used for primary CTAs and subtle accents. No bright or playful colors.
Layout: Strict 12-column grid. Symmetrical layouts. Header with full navigation. Cards with minimal border-radius (4-6px) and thin borders.
Details: Professional photography (people in business attire, city skylines). Trust indicators (certifications, awards). Clean data visualizations. Subtle line dividers between sections.`,

  creativo: `DESIGN DIRECTION — CREATIVE:
Typography: Bold, expressive display font for headlines (e.g., Clash Display). Large sizes (~60px+). Mix weights dramatically (thin body + ultra-bold headlines).
Spacing: Dynamic spacing — tighter in some areas, very generous in others. Break the grid intentionally.
Color: Vibrant, saturated brand colors. Use bold color blocks and contrasting sections. Dark backgrounds with bright accents are powerful. Consider color gradients and duotone imagery.
Layout: Break conventions — overlapping elements, angled sections, full-bleed images, text over images with creative masking. Asymmetric hero with large typography as a visual element.
Details: Custom illustrations or abstract shapes preferred over stock photos. Animated feel (diagonal lines, scattered dots, geometric patterns). Buttons with bold fills and strong hover states.`,

  elegante: `DESIGN DIRECTION — ELEGANT:
Typography: Refined serif (e.g., Cormorant Garamond, Playfair Display) for headlines. Thin weights. Generous letter-spacing in uppercase labels. Body in a light sans-serif.
Spacing: Very generous — luxury brands use space as a design element. 120-160px between sections. Let content breathe.
Color: Dark palette (charcoal #1a1a1a, warm black #0d0d0d) with gold/champagne (#c9a96e, #d4af37) or warm metallic accents. Cream (#f5f0eb) as alternative light background.
Layout: Centered compositions. Thin lines (1px) as dividers. Full-width imagery with subtle parallax feel. Cards with thin gold borders.
Details: High-end photography (lifestyle, products). Thin decorative lines and subtle ornaments. Buttons with thin borders and hover fill. Noise texture overlay for depth. No heavy shadows.`,
};

// --- Color formatting ---

function formatColors(colors: string[]): string {
  if (colors.length === 0) return "choose a professional, harmonious palette appropriate for the sector";
  return `primary palette: ${colors.join(", ")} — use these as the dominant brand colors. Derive complementary shades (lighter tints for backgrounds, darker shades for text/accents) from these base colors`;
}

// --- Main prompt builder ---

export function buildImagePrompt(input: PreviewInput): string {
  const blueprint = serviceBlueprints[input.serviceId] ?? serviceBlueprints["siti-web"];
  const styleDir = styleDirectives[input.style.toLowerCase()] ?? styleDirectives["moderno"];
  const desc = input.description ? input.description.slice(0, 200) : "";

  return `Generate an IMAGE: a pixel-perfect, award-quality website screenshot that looks like it was designed by a senior UI designer at a top agency.

WEBSITE TYPE: ${blueprint.layout}
BUSINESS: "${input.businessName}" — sector: ${input.sector}
${desc ? `CONTEXT: ${desc}` : ""}

PAGE STRUCTURE (top to bottom):
${blueprint.sections}

${styleDir}

COLOR SYSTEM: ${formatColors(input.colorPalette)}

CRITICAL QUALITY REQUIREMENTS:
- This must look like a REAL screenshot captured from a live, professionally designed website in a desktop browser (1440px wide viewport)
- Sharp, pixel-perfect rendering — no blur, no artifacts, no AI-generated distortion on text
- All text must be in Italian and must be realistic, contextual content (not lorem ipsum)
- Typography must have clear visual hierarchy: headline > subheadline > body > caption
- Perfect vertical rhythm and consistent spacing throughout
- UI elements (buttons, inputs, cards) must look crisp and interactive
- Use professional, contextually relevant imagery that matches the sector
- The "${input.businessName}" brand name must appear clearly in the navbar/header area
- Every section must feel intentionally designed with purpose and balance

OUTPUT: Return ONLY the image. No text, no explanation.`;
}
