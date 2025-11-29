import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirst(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
