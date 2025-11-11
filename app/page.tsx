"use client"

import { useState, useEffect } from "react"
import { LoopPlayer } from "@/components/loop-player"
import { Playlist } from "@/components/playlist"
import type { LoopSong } from "@/lib/types"

export default function Home() {
  const [songs, setSongs] = useState<LoopSong[]>([])
  const [currentSong, setCurrentSong] = useState<LoopSong | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load songs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("loopSongs")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSongs(parsed)
      } catch (e) {
        console.error("Failed to parse songs", e)
      }
    }
    setIsLoading(false)
  }, [])

  const handleAddSong = (song: LoopSong) => {
    const existing = songs.findIndex((s) => s.videoId === song.videoId)
    let updated
    if (existing >= 0) {
      updated = [...songs]
      updated[existing] = song
    } else {
      updated = [...songs, song]
    }
    setSongs(updated)
    localStorage.setItem("loopSongs", JSON.stringify(updated))
    setCurrentSong(song)
  }

  const handleDeleteSong = (videoId: string) => {
    const updated = songs.filter((s) => s.videoId !== videoId)
    setSongs(updated)
    localStorage.setItem("loopSongs", JSON.stringify(updated))
    if (currentSong?.videoId === videoId) {
      setCurrentSong(null)
    }
  }

  const handleClearPlaylist = () => {
    setSongs([])
    localStorage.removeItem("loopSongs")
    setCurrentSong(null)
  }

  const handleSelectSong = (song: LoopSong) => {
    setCurrentSong(song)
  }

  const handleRenameSong = (videoId: string, newTitle: string) => {
    const updated = songs.map((s) => (s.videoId === videoId ? { ...s, title: newTitle } : s))
    setSongs(updated)
    localStorage.setItem("loopSongs", JSON.stringify(updated))
    if (currentSong?.videoId === videoId) {
      setCurrentSong({ ...currentSong, title: newTitle })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Playlist Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <Playlist
          songs={songs}
          currentSong={currentSong}
          onSelectSong={handleSelectSong}
          onDeleteSong={handleDeleteSong}
          onRenameSong={handleRenameSong}
          onClearPlaylist={handleClearPlaylist}
        />
      </div>

      {/* Player Section */}
      <div className="flex-1 overflow-y-auto">
        <LoopPlayer onAddSong={handleAddSong} currentSong={currentSong} />
      </div>
    </main>
  )
}
