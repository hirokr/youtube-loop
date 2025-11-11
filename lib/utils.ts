import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null

  // Handle youtube.com format
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([^&?\s]+)/)
  if (youtubeMatch && youtubeMatch[1]) {
    return youtubeMatch[1]
  }

  // Handle just the ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }

  return null
}

/**
 * Parse time input in format "mm:ss" or just seconds
 */
export function parseTimeInput(input: string): number | null {
  if (!input) return null

  const trimmed = input.trim()

  // Check if it's just a number (seconds)
  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10)
  }

  // Check if it's in mm:ss format
  const match = trimmed.match(/^(\d+):(\d{2})$/)
  if (match) {
    const minutes = Number.parseInt(match[1], 10)
    const seconds = Number.parseInt(match[2], 10)
    return minutes * 60 + seconds
  }

  return null
}

/**
 * Format seconds to mm:ss format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
