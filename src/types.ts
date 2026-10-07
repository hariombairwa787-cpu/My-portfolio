export interface ProfileData {
  profilePhoto: string;
  name: string;
  title: string;
  intro: string;
  phone: string;
  email: string;
  location: string;
  experience: string;
  whatsappNumber: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  uploadDate: string;
  isCustomUpload?: boolean;
}

export interface GraphicItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  uploadDate: string;
  isCustomUpload?: boolean;
}
