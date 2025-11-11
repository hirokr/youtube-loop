"use client"

import { useState, useRef, useEffect } from "react"
import YouTube, { type YouTubeProps } from "react-youtube"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { LoopSong } from "@/lib/types"
import { extractVideoId, formatTime, parseTimeInput } from "@/lib/utils"

interface LoopPlayerProps {
  onAddSong: (song: LoopSong) => void
  currentSong: LoopSong | null
}

export function LoopPlayer({ onAddSong, currentSong }: LoopPlayerProps) {
  const [url, setUrl] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState("")
  const playerRef = useRef<any>(null)
  const loopIntervalRef = useRef<NodeJS.Timeout>()

  // Load current song into player
  useEffect(() => {
    if (currentSong) {
      setUrl(`https://www.youtube.com/watch?v=${currentSong.videoId}`)
      setStartTime(formatTime(currentSong.startTime))
      setEndTime(formatTime(currentSong.endTime))
      setIsPlaying(false)
    }
  }, [currentSong])

  const handleExtractVideoId = () => {
    setError("")
    const videoId = extractVideoId(url)
    if (!videoId) {
      setError("Invalid YouTube URL")
      return
    }
    // Fetch video title from YouTube
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    img.onerror = () => {
      img.src = `https://img.youtube.com/vi/${videoId}/default.jpg`
    }
  }

  const handlePlay = () => {
    setError("")
    const videoId = extractVideoId(url)
    if (!videoId) {
      setError("Invalid YouTube URL")
      return
    }

    const start = parseTimeInput(startTime)
    const end = parseTimeInput(endTime)

    if (start === null || end === null) {
      setError("Invalid time format")
      return
    }

    if (start >= end) {
      setError("Start time must be before end time")
      return
    }

    const song: LoopSong = {
      videoId,
      startTime: start,
      endTime: end,
      title: `Loop ${videoId.slice(0, 8)}`,
    }

    onAddSong(song)
    setIsPlaying(true)

    // Clear any existing loop interval
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current)
    }

    // Start looping
    loopIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const current = playerRef.current.getCurrentTime()
        if (current >= end) {
          playerRef.current.seekTo(start, true)
        }
      }
    }, 100)
  }

  const handleStop = () => {
    setIsPlaying(false)
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current)
    }
    if (playerRef.current) {
      playerRef.current.pauseVideo()
    }
  }

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target
    if (isPlaying && startTime) {
      const start = parseTimeInput(startTime)
      if (start !== null) {
        event.target.seekTo(start, true)
        event.target.playVideo()
      }
    }
  }

  const videoId = extractVideoId(url)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance mb-2">Loop Maker</h1>
        <p className="text-muted-foreground">Create perfect song loops from YouTube videos</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium">YouTube URL</label>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Accepts YouTube URLs in any format: youtube.com, youtu.be, or with timestamps
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium">Start Time</label>
            <Input
              placeholder="0:00 or 0"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">Format: mm:ss or seconds</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">End Time</label>
            <Input
              placeholder="1:30 or 90"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">Format: mm:ss or seconds</p>
          </div>
        </div>

        {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded">{error}</div>}

        <div className="flex gap-3">
          <Button onClick={handlePlay} className="flex-1" size="lg">
            {isPlaying ? "Playing..." : "Play Loop"}
          </Button>
          {isPlaying && (
            <Button onClick={handleStop} variant="outline" size="lg">
              Stop
            </Button>
          )}
        </div>
      </Card>

      {videoId && (
        <Card className="p-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <YouTube
              videoId={videoId}
              opts={{
                height: "100%",
                width: "100%",
                playerVars: {
                  autoplay: isPlaying ? 1 : 0,
                  controls: 1,
                  modestbranding: 1,
                },
              }}
              onReady={onPlayerReady}
            />
          </div>
        </Card>
      )}
    </div>
  )
}
