import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() = clsx() + tailwind-merge
 * Allows conditional classes + deduplication with Tailwind.
 */
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
