import { ProfileData, VideoItem, GraphicItem } from "./types";

export const DEFAULT_PROFILE: ProfileData = {
  profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
  name: "Sophia Martinez",
  title: "AI Creator • Video Editor • Graphic Designer",
  intro: "I create cinematic AI videos, professional video edits and premium graphic designs for brands and businesses.",
  phone: "+1 (555) 019-2834",
  email: "sophia.design@agency.com",
  location: "Los Angeles, CA",
  experience: "5+ Years of Industry Experience",
  whatsappNumber: "+15550192834"
};

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Project Zero: Cinematic Cyberpunk Concept",
    thumbnailUrl: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-city-at-night-11429-large.mp4",
    category: "AI Cinema",
    uploadDate: "2026-06-15"
  },
  {
    id: "v2",
    title: "Neon Subways & Electric Echoes",
    thumbnailUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-at-night-with-rain-41589-large.mp4",
    category: "Video Edit",
    uploadDate: "2026-05-20"
  },
  {
    id: "v3",
    title: "Infinite Geometry: Interactive 3D Loop",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-front-of-a-neon-illuminated-screen-40763-large.mp4",
    category: "3D Motion",
    uploadDate: "2026-04-10"
  },
  {
    id: "v4",
    title: "Stellar Space Odyssey: AI Cinematic Film",
    thumbnailUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    category: "AI Cinema",
    uploadDate: "2026-03-01"
  },
  {
    id: "v5",
    title: "Aura of Nature: Commercial drone edit",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-22002-large.mp4",
    category: "Commercial",
    uploadDate: "2026-06-28"
  },
  {
    id: "v6",
    title: "Ethereal Echoes: Modern Architecture Spec",
    thumbnailUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-curious-cat-looking-at-camera-39958-large.mp4",
    category: "Video Edit",
    uploadDate: "2026-06-20"
  },
  {
    id: "v7",
    title: "Urban Rhapsody: Streetwear Fashion Film",
    thumbnailUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-under-water-view-of-sunbeams-3129-large.mp4",
    category: "Commercial",
    uploadDate: "2026-06-10"
  },
  {
    id: "v8",
    title: "Future Paradigm: Next-Gen VR Experience",
    thumbnailUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-space-11603-large.mp4",
    category: "3D Motion",
    uploadDate: "2026-05-15"
  },
  {
    id: "v9",
    title: "Symphony of Noise: Sound Design Showcase",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=450&h=800&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-numbers-31932-large.mp4",
    category: "Video Edit",
    uploadDate: "2026-05-02"
  }
];

export const DEFAULT_GRAPHICS: GraphicItem[] = [
  {
    id: "g1",
    title: "Cybernetic Fusion Poster",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
    category: "Poster Design",
    uploadDate: "2026-06-25"
  },
  {
    id: "g2",
    title: "Abstract Liquid Colorways",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    category: "Branding",
    uploadDate: "2026-06-10"
  },
  {
    id: "g3",
    title: "Minimalist Geometry Layout",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
    category: "Typography",
    uploadDate: "2026-05-18"
  },
  {
    id: "g4",
    title: "Future Paradigm Art Cover",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    category: "Cover Art",
    uploadDate: "2026-04-05"
  }
];
