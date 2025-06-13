import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createUniqueSlug(title: string): string {
  let slug = title.toLowerCase().replace(/\s+/g, "-");

  slug = slug.replace(/[^a-z0-9-]/g, "");

  return `${slug}-${Math.random().toString(36).substring(2, 8)}`;
}
