export type Tour = {
  startLocation: Location;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  startDates: string[];
  _id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
  guides: string[];
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  locations: LocationPoint[];
};

export type Location = {
  description: string;
  type: string;
  coordinates: number[];
  adress: string;
};

export type LocationPoint = {
  _id: string;
  description: string;
  type: string;
  coordinates: number[];
  day: number;
};
