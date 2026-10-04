// Liberate sales page photo slots
// Each slot can be uploaded by admin or left as placeholder

export interface LiberatePhotoSlot {
  id: string;
  label: string;
  section: string;
  aspectRatio: string;
  required: boolean;
}

export const LIBERATE_PHOTO_SLOTS: LiberatePhotoSlot[] = [
  // Hero section
  { id: "hero_portrait", label: "Hero portrait", section: "Hero", aspectRatio: "4/5", required: true },

  // Section 2: "There comes a moment"
  { id: "moment_portrait", label: "Moment portrait • you, alone and quiet", section: "Section 2", aspectRatio: "4/5", required: false },

  // Section 3: "They've called you intuitive"
  { id: "bath_portrait", label: "Bath portrait • vulnerability and grounding", section: "Section 3", aspectRatio: "4/5", required: false },

  // Section 4: "Introducing Liberate"
  { id: "zoom_screenshot", label: "Mock-up call photo • under “Introducing Liberate”", section: "Section 4", aspectRatio: "16/9", required: false },

  // Section 5: "What you'll experience inside" (8 photos)
  { id: "inside_1", label: "Inside experience 1", section: "Section 5", aspectRatio: "1/1", required: false },
  { id: "inside_2", label: "Inside experience 2", section: "Section 5", aspectRatio: "1/1", required: false },
  { id: "inside_3", label: "Inside experience 3", section: "Section 5", aspectRatio: "1/1", required: false },
  { id: "inside_4", label: "Inside experience 4", section: "Section 5", aspectRatio: "1/1", required: false },
  { id: "inside_5", label: "Inside experience 5", section: "Section 5", aspectRatio: "1/1", required: false },
  { id: "inside_6", label: "Inside experience 6", section: "Section 5", aspectRatio: "1/1", required: false },
  { id: "inside_7", label: "Inside experience 7", section: "Section 5", aspectRatio: "1/1", required: false },
  { id: "inside_8", label: "Inside experience 8", section: "Section 5", aspectRatio: "1/1", required: false },

  // Section 5b: People in Liberate — a gallery under “What happens inside”, shown once any are uploaded
  { id: "moments_1", label: "People in Liberate • in session", section: "Section 5 · gallery", aspectRatio: "1/1", required: false },
  { id: "moments_2", label: "People in Liberate • the circle", section: "Section 5 · gallery", aspectRatio: "1/1", required: false },
  { id: "moments_3", label: "People in Liberate • the work", section: "Section 5 · gallery", aspectRatio: "1/1", required: false },
  { id: "moments_4", label: "People in Liberate • together", section: "Section 5 · gallery", aspectRatio: "1/1", required: false },
  { id: "moments_5", label: "People in Liberate • the retreat", section: "Section 5 · gallery", aspectRatio: "1/1", required: false },
  { id: "moments_6", label: "People in Liberate • after", section: "Section 5 · gallery", aspectRatio: "1/1", required: false },

  // Section 9: Testimonial screenshots — messages from Liberate students, shown as a strip under their words
  { id: "shots_1", label: "Testimonial screenshot 1", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },
  { id: "shots_2", label: "Testimonial screenshot 2", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },
  { id: "shots_3", label: "Testimonial screenshot 3", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },
  { id: "shots_4", label: "Testimonial screenshot 4", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },
  { id: "shots_5", label: "Testimonial screenshot 5", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },
  { id: "shots_6", label: "Testimonial screenshot 6", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },
  { id: "shots_7", label: "Testimonial screenshot 7", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },
  { id: "shots_8", label: "Testimonial screenshot 8", section: "Section 9 · screenshots", aspectRatio: "9/16", required: false },

  // Section 7: Retreat
  { id: "retreat_hero", label: "Retreat • wide shot, Manila", section: "Section 7", aspectRatio: "16/9", required: false },
  { id: "retreat_1", label: "Retreat mosaic photo 1", section: "Section 7", aspectRatio: "1/1", required: false },
  { id: "retreat_2", label: "Retreat mosaic photo 2", section: "Section 7", aspectRatio: "1/1", required: false },
  { id: "retreat_3", label: "Retreat mosaic photo 3", section: "Section 7", aspectRatio: "1/1", required: false },
  { id: "retreat_4", label: "Retreat mosaic photo 4", section: "Section 7", aspectRatio: "1/1", required: false },
  { id: "retreat_5", label: "Retreat mosaic photo 5", section: "Section 7", aspectRatio: "1/1", required: false },
  { id: "retreat_6", label: "Retreat mosaic photo 6", section: "Section 7", aspectRatio: "1/1", required: false },
  { id: "retreat_7", label: "Retreat mosaic photo 7", section: "Section 7", aspectRatio: "1/1", required: false },

  // Section 8: Story
  { id: "story_portrait", label: "Story portrait • Libni, grounded", section: "Section 8", aspectRatio: "4/5", required: false },
];

// Helper to get slot by ID
export function getSlot(id: string): LiberatePhotoSlot | undefined {
  return LIBERATE_PHOTO_SLOTS.find(s => s.id === id);
}

// Group slots by section for admin UI
export function slotsBySection(): Record<string, LiberatePhotoSlot[]> {
  const grouped: Record<string, LiberatePhotoSlot[]> = {};
  LIBERATE_PHOTO_SLOTS.forEach(slot => {
    if (!grouped[slot.section]) grouped[slot.section] = [];
    grouped[slot.section].push(slot);
  });
  return grouped;
}
