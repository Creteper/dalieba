export interface PointResponse {
  id: number;
  name: string;
  location: [number, number];
  description: string;
}

export interface SelectedMarker {
  position: [number, number];
  popup?: string;
  description?: string;
  title?: string;
}

export interface GuideRecord {
  scenicSpot: string;
  message: string;
  audioUrl?: string;
}

export type CategoryType = 'spot' | 'hotel'; 