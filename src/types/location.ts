export interface LocationResult {
  lat: number;
  lng: number;
  displayName: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  streetNumber?: string;
  streetName?: string;
  neighbourhood?: string;
  postcode?: string;
  placeType?: string;
  importance?: number;
  precision?: "house" | "street" | "area"; // 🔥 New precision indicator
}
