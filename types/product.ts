export type Product = {
  id: number;
  slug: string;
  productType: "plant" | "garden-care";
  name: string;
  category: string;
  price: string;
  description: string;
  rating: string;
  reviews: number;
  image: string;
  tag?: string;
  originalPrice?: string;
  light: string;
  watering: string;
  height: string;
  potSize: string;
  care: string[];
};