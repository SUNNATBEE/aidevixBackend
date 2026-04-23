export interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  thumbnail: string;
  materials: { name: string; url: string }[];
  viewCount: number;
  course?: {
    _id: string;
    title: string;
  };
  rating?: {
    average: number;
    count: number;
  };
  views?: number;
}

export interface Player {
  embedUrl: string;
  expiresAt: string;
  telegramLink?: string;
}

export interface VideoResponse {
  success: boolean;
  data: {
    video: Video;
    player: Player;
  };
}
