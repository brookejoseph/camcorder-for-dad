"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Power, Play, Pause, RotateCcw, Volume2, VolumeX, Battery, Disc, SkipForward } from "lucide-react"

export default function CamcorderPage() {
  // Fixed list of YouTube video IDs
  const videoList = [
    "3w_KOOB9RAM", 
    "NqQZ__TRXHM", 
    "y6MI5zHPwQI", 
    "Uhg-wx3eEYE", 
    "3QVAiNeUmC0", 
    "EySQGrDmgvY", 
    "YuDQCs1levE", 
    "aBC1391qcpg", 
    "mEdsWnxuSMc", 
    "rmwkTyjUHyk", 
    "mINCVIf1VnQ", 
    "VtHXRvQ0Vd0"
  ]
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videoId, setVideoId] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPoweredOn, setIsPoweredOn] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [videoTitle, setVideoTitle] = useState("Movie Collection")

  // Video titles mapping
  const videoTitles = {
    "3w_KOOB9RAM": "Brooke crawling",
    "NqQZ__TRXHM": "Parker Playing Musics",
    "y6MI5zHPwQI": "First Signs of Brooke being Bossy",
    "Uhg-wx3eEYE": "Long day of Skiiing",
    "3QVAiNeUmC0": "Magic Tricks",
    "EySQGrDmgvY-TI": "Parker and Jake",
    "YuDQCs1levE": "Bobby D's!!",
    "aBC1391qcpg": "WHERE IS MY CANDY?!?!", 
    "mEdsWnxuSMc": "CAKE BABYYY", 
    "rmwkTyjUHyk": "Some good dancing skills", 
    "mINCVIf1VnQ": "Is that Jesus?", 
    "VtHXRvQ0Vd0": "Brooke and Parker"
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePower = () => {
    setIsPoweredOn(!isPoweredOn)
    if (isPoweredOn) {
      setIsPlaying(false)
    } else {
      // If turning on, set the current video
      setVideoId(videoList[currentVideoIndex])
      setVideoTitle(videoTitles[videoList[currentVideoIndex]])
    }
  }

  const nextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videoList.length
    setCurrentVideoIndex(nextIndex)
    setVideoId(videoList[nextIndex])
    setVideoTitle(videoTitles[videoList[nextIndex]])
  }

  // Auto-cycle to next video when current one ends (after 30 seconds for demo)
  useEffect(() => {
    let timer
    if (isPoweredOn && isPlaying) {
      timer = setTimeout(() => {
        nextVideo()
      }, 30000) // Change to next video after 30 seconds
    }
    return () => clearTimeout(timer)
  }, [currentVideoIndex, isPoweredOn, isPlaying])

  // Simulate battery drain
  useEffect(() => {
    if (isPoweredOn && isPlaying) {
      const interval = setInterval(() => {
        setBatteryLevel((prev) => {
          if (prev <= 0) {
            setIsPoweredOn(false)
            setIsPlaying(false)
            return 0
          }
          return prev - 0.01
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPoweredOn, isPlaying])

  // Set default video on first load
  useEffect(() => {
    if (isPoweredOn && !videoId) {
      setVideoId(videoList[currentVideoIndex])
      setVideoTitle(videoTitles[videoList[currentVideoIndex]])
    }
  }, [isPoweredOn])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Camcorder body */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl relative">
          {/* Top handle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-700 rounded-t-lg"></div>

          {/* Camcorder body */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left side - Screen */}
            <div className="flex-1 relative">
              {/* Viewfinder frame */}
              <div className="bg-black rounded-md p-3 relative">
                {/* Screen */}
                <div
                  className={`aspect-video rounded overflow-hidden relative ${!isPoweredOn ? "bg-black" : "bg-gray-900"}`}
                >
                  {isPoweredOn && (
                    <>
                      {videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No video loaded
                        </div>
                      )}

                      {/* Recording indicator */}
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${isPlaying ? "bg-red-500 animate-pulse" : "bg-gray-500"}`}
                        ></div>
                        <span className="text-white text-xs">REC</span>
                      </div>

                      {/* Timestamp */}
                      <div className="absolute bottom-2 left-2 text-white text-xs font-mono bg-black/50 px-1 rounded">
                        {new Date().toLocaleTimeString()}
                      </div>
                    </>
                  )}
                </div>

                {/* Viewfinder details */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-16 bg-gray-700 rounded-r"></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-16 bg-gray-700 rounded-l"></div>
              </div>

              {/* Current movie title */}
              <div className="mt-4 bg-gray-700 rounded p-2 text-white text-center">
                <div className="text-sm font-semibold">Now Playing ({currentVideoIndex + 1}/{videoList.length}):</div>
                <div className="text-xs truncate">{videoTitle}</div>
              </div>
            </div>

            {/* Right side - Controls */}
            <div className="md:w-48 bg-gray-700 rounded-lg p-4 flex flex-col gap-4">
              {/* Power button */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isPoweredOn ? "bg-red-500 text-white" : "bg-gray-600"}`}
                  onClick={togglePower}
                >
                  <Power className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  <Battery className="h-4 w-4 text-gray-400" />
                  <div className="w-12 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${batteryLevel > 20 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${batteryLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Playback controls */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="bg-gray-600 hover:bg-gray-500"
                  onClick={togglePlay}
                  disabled={!isPoweredOn}
                >
                  {isPlaying ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>

                <Button
                  variant="outline"
                  className="bg-gray-600 hover:bg-gray-500"
                  onClick={toggleMute}
                  disabled={!isPoweredOn}
                >
                  {isMuted ? <VolumeX className="mr-1 h-4 w-4" /> : <Volume2 className="mr-1 h-4 w-4" />}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>

                <Button
                  variant="outline"
                  className="bg-gray-600 hover:bg-gray-500 col-span-2"
                  onClick={nextVideo}
                  disabled={!isPoweredOn}
                >
                  <SkipForward className="mr-1 h-4 w-4" />
                  Next Video
                </Button>
              </div>

              {/* Decorative elements */}
              <div className="mt-auto">
                <div className="bg-gray-800 rounded-lg p-2 flex items-center justify-center">
                  <Disc className="h-6 w-6 text-gray-500 mr-2" />
                  <div className="text-xs text-gray-400">
                    <div>DIGITAL</div>
                    <div>CAMCORDER</div>
                  </div>
                </div>

                {/* Fake buttons */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-3 bg-gray-600 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camcorder grip */}
        <div className="h-16 w-24 bg-gray-700 rounded-b-lg mx-auto"></div>
      </div>

      <div className="mt-8 text-gray-400 text-sm max-w-md text-center">
        Happy Birthday Dad! I love you. Thank you for everything you do for us. We all love you so much.
        From Brooke, Mom and Parker.
      </div>
    </div>
  )
}