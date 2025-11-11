"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X } from "lucide-react"
import type { LoopSong } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface PlaylistProps {
  songs: LoopSong[]
  currentSong: LoopSong | null
  onSelectSong: (song: LoopSong) => void
  onDeleteSong: (videoId: string) => void
  onRenameSong: (videoId: string, newTitle: string) => void
  onClearPlaylist: () => void
}

export function Playlist({
  songs,
  currentSong,
  onSelectSong,
  onDeleteSong,
  onRenameSong,
  onClearPlaylist,
}: PlaylistProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const handleStartEdit = (song: LoopSong) => {
    setEditingId(song.videoId)
    setEditTitle(song.title)
  }

  const handleSaveEdit = (videoId: string) => {
    if (editTitle.trim()) {
      onRenameSong(videoId, editTitle.trim())
    }
    setEditingId(null)
  }

  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/default.jpg`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold mb-4">Playlist</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {songs.length} {songs.length === 1 ? "song" : "songs"} saved
        </p>
        {songs.length > 0 && (
          <Button onClick={onClearPlaylist} variant="outline" size="sm" className="w-full bg-transparent">
            Clear Playlist
          </Button>
        )}
      </div>

      {/* Songs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {songs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center text-sm">No songs yet. Add your first loop!</p>
          </div>
        ) : (
          songs.map((song) => (
            <div
              key={song.videoId}
              className={`group relative rounded-lg overflow-hidden transition-all cursor-pointer ${
                currentSong?.videoId === song.videoId
                  ? "bg-primary text-primary-foreground ring-2 ring-primary"
                  : "bg-card hover:bg-muted"
              }`}
              onClick={() => onSelectSong(song)}
            >
              <div className="p-3 flex gap-3">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded flex-shrink-0 bg-muted overflow-hidden">
                  <img
                    src={getThumbnailUrl(song.videoId) || "/placeholder.svg"}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  {editingId === song.videoId ? (
                    <div className="flex gap-2 mb-1">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-6 text-sm"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="font-medium text-sm truncate">{song.title}</p>
                  )}
                  <p className="text-xs opacity-75">
                    {formatTime(song.startTime)} - {formatTime(song.endTime)}
                  </p>
                </div>

                {/* Actions */}
                <div
                  className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {editingId === song.videoId ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(song.videoId)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(song)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteSong(song.videoId)}
                        className="p-1.5 hover:bg-destructive/20 text-destructive rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
