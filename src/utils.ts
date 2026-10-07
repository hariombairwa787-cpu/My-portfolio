/**
 * Compresses an image file using an HTML5 canvas and converts it to a compact JPEG Base64 string.
 * This keeps image uploads light and compatible with localStorage limits (~5MB).
 */
export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress with 0.75 JPEG quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          resolve(dataUrl);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export interface ParsedVideo {
  type: "youtube" | "vimeo" | "direct" | "unknown";
  embedUrl: string;
  directUrl: string;
}

/**
 * Parses video links (YouTube, Vimeo, or direct MP4 files) and returns structured URLs.
 */
export const parseVideoUrl = (url: string): ParsedVideo => {
  if (!url) return { type: "unknown", embedUrl: "", directUrl: "" };

  const trimmed = url.trim();

  // YouTube Shorts matchers
  const shortsMatch = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    const videoId = shortsMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`,
      directUrl: ""
    };
  }

  // YouTube standard matchers
  const ytMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      directUrl: ""
    };
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      directUrl: ""
    };
  }

  // Direct MP4/WebM
  if (trimmed.endsWith(".mp4") || trimmed.endsWith(".webm") || trimmed.endsWith(".ogg") || trimmed.includes("mixkit.co/videos") || trimmed.startsWith("blob:")) {
    return {
      type: "direct",
      embedUrl: "",
      directUrl: trimmed
    };
  }

  // Fallback
  return {
    type: "direct",
    embedUrl: "",
    directUrl: trimmed
  };
};
