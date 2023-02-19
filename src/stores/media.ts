import { RefObject } from 'react'
import create from 'zustand'

export type PlayType = 'archive' | 'source' | 'practice'

type MediaStore = {
  // audio
  audioRef: RefObject<HTMLAudioElement> | null
  displayPlayer: boolean
  displayPlaylist: boolean
  playing: boolean
  playTrack: number | null
  playId: string | null
  playType: PlayType | null
  setAudioRef: (audioRef: RefObject<HTMLAudioElement> | null) => void
  toggleDisplayPlayer: (displayPlayer: boolean) => void
  toggleDisplayPlaylist: (displayPlaylist: boolean) => void
  setTrack: (playTrack: number, playId?: string, playType?: PlayType) => void
  setTrackAndTime: (playTrack: number, playTime: number, playId?: string, playType?: PlayType) => void
  setPlaying: (playing: boolean) => void
  resetTrack: () => void
  // video
  videoRef: RefObject<HTMLVideoElement> | null
  displayVideoPlayer: boolean
  videoPlaying: boolean
  videoPlayType: 'main' | 'mini' | 'other' | 'source' | null
  videoPlayId: string | null
  videoPlayTrack: number | null
  videoCurrentTime: number | null
  videoDuration: number | null
  videoLoadingPercent: number | null
  setVideoRef: (videoRef: RefObject<HTMLVideoElement> | null) => void
  setVideoTrack: (
    videoPlayTrack: number,
    videoPlayId?: string,
    videoPlayType?: 'main' | 'mini' | 'other' | 'source'
  ) => void
  setVideoPlaying: (videoPlaying: boolean) => void
  updateVideoPlaying: (videoCurrentTime: number | null, videoDuration: number | null) => void
  setVideoLoadingPercent: (videoLoadingPercent: number | null) => void
}

const initialVideoStore = {
  videoRef: null,
  displayVideoPlayer: false,
  videoPlaying: false,
  videoPlayType: null,
  videoPlayId: null,
  videoPlayTrack: null,
  videoCurrentTime: null,
  videoDuration: null,
  videoLoadingPercent: null,
}

export const useMediaStore = create<MediaStore>((set) => ({
  // audio
  audioRef: null,
  displayPlayer: false,
  displayPlaylist: false,
  playing: false,
  playTrack: null,
  playId: null,
  playType: null,
  setAudioRef: (audioRef) => set((state) => ({ ...state, audioRef })),
  toggleDisplayPlayer: (displayPlayer) => set((state) => ({ ...state, displayPlayer })),
  toggleDisplayPlaylist: (displayPlaylist) => set((state) => ({ ...state, displayPlaylist })),
  setTrack: (playTrack, playId, playType) => {
    set((state) => ({
      ...state,
      displayPlayer: true,
      playing: true,
      playTrack,
      playId: playId !== undefined ? playId : state.playId,
      playType: playType !== undefined ? playType : state.playType,
    }))
  },
  setTrackAndTime: (playTrack, playTime, playId, playType) => {
    set((state) => {
      if (state.playing && state.audioRef?.current) {
        state.audioRef.current.currentTime = playTime
      }
      return {
        ...state,
        displayPlayer: true,
        playint: true,
        playTrack,
        playId: playId !== undefined ? playId : state.playId,
        playType: playType !== undefined ? playType : state.playType,
      }
    })
  },
  setPlaying: (playing) => set((state) => ({ ...state, playing })),
  resetTrack: () => set((state) => ({ ...state, playTrack: null })),
  // video
  ...initialVideoStore,
  setVideoRef: (videoRef) => {
    set((state) => {
      if (videoRef === null) {
        return { ...state, displayPlayer: !!state.playTrack, ...initialVideoStore }
      }
      return { ...state, videoRef }
    })
  },
  setVideoTrack: (videoPlayTrack, videoPlayId, videoPlayType) => {
    set((state) => {
      if (state.playing && state.audioRef?.current) {
        state.audioRef.current.pause()
      }
      return {
        ...state,
        displayPlayer: false,
        displayPlaylist: false,
        playing: false,
        displayVideoPlayer: true,
        videoPlaying: true,
        videoPlayTrack,
        videoPlayId: videoPlayId !== undefined ? videoPlayId : state.videoPlayId,
        videoPlayType: videoPlayType !== undefined ? videoPlayType : state.videoPlayType,
      }
    })
  },
  setVideoPlaying: (videoPlaying) => set((state) => ({ ...state, videoPlaying })),
  updateVideoPlaying: (videoCurrentTime, videoDuration) => {
    set((state) => ({ ...state, videoCurrentTime, videoDuration }))
  },
  setVideoLoadingPercent: (videoLoadingPercent) => set((state) => ({ ...state, videoLoadingPercent })),
}))
