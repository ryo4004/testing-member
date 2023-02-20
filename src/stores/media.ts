import { RefObject } from 'react'
import create from 'zustand'
import { audioStorage } from '../utilities/audioStorage'

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

const getInitialStateFromStorage = (): {
  displayPlayer: boolean
  playTrack: number | null
  playId: string | null
  playType: PlayType | null
} => {
  const displayPlayer = audioStorage.getDisplayPlayer()
  const concertId = audioStorage.getPlayerConcertId()
  const concertNumber = audioStorage.getPlayerNumber()
  const sourceId = audioStorage.getPlayerSourceId()
  const sourceNumber = audioStorage.getPlayerSourceNumber()
  const practiceId = audioStorage.getPlayerPracticeId()
  const practiceFile = audioStorage.getPlayerPracticeFile()
  if (concertId) {
    return {
      displayPlayer,
      playType: 'archive',
      playId: concertId,
      playTrack: Number(concertNumber),
    }
  }
  if (sourceId) {
    return {
      displayPlayer,
      playType: 'source',
      playId: sourceId,
      playTrack: Number(sourceNumber),
    }
  }
  if (practiceId) {
    return {
      displayPlayer,
      playType: 'practice',
      playId: practiceId,
      playTrack: Number(practiceFile),
    }
  }
  return {
    displayPlayer: false,
    playType: null,
    playId: null,
    playTrack: null,
  }
}

const clearAudioState = () => {
  audioStorage.removePlayerConcertId()
  audioStorage.removePlayerNumber()
  audioStorage.removePlayerSoucerId()
  audioStorage.removePlayerSourceNumber()
  audioStorage.removePlayerPracticeId()
  audioStorage.removePlayerPracticeFile()
}

const savePlayerState = (displayPlayer: boolean) => {
  audioStorage.setDisplayPlayer(displayPlayer)
  if (!displayPlayer) {
    audioStorage.removeDisplayPlayer()
    clearAudioState()
  }
}

const saveAudioState = ({
  displayPlayer,
  playType,
  playId,
  playTrack,
}: {
  displayPlayer: boolean
  playTrack: number
  playId: string | null
  playType: PlayType | null
}) => {
  if (playId === null) {
    return null
  }
  clearAudioState()
  audioStorage.setDisplayPlayer(displayPlayer)
  audioStorage.setDisplayPlayer(true)
  if (playType === 'archive') {
    audioStorage.setPlayerConcertId(playId)
    audioStorage.setPlayerNumber(playTrack)
  }
  if (playType === 'source') {
    audioStorage.setPlayerSoucerId(playId)
    audioStorage.setPlayerSourceNumber(playTrack)
  }
  if (playType === 'practice') {
    audioStorage.setPlayerPracticeId(playId)
    audioStorage.setPlayerPracticeFile(playTrack)
  }
}

export const useMediaStore = create<MediaStore>((set) => ({
  // audio
  audioRef: null,
  displayPlaylist: false,
  playing: false,
  ...getInitialStateFromStorage(),
  setAudioRef: (audioRef) => set((state) => ({ ...state, audioRef })),
  toggleDisplayPlayer: (displayPlayer) => {
    set((state) => {
      savePlayerState(displayPlayer)
      return { ...state, displayPlayer }
    })
  },
  toggleDisplayPlaylist: (displayPlaylist) => set((state) => ({ ...state, displayPlaylist })),
  setTrack: (playTrack, playId, playType) => {
    set((state) => {
      const newState = {
        displayPlayer: true,
        playTrack,
        playId: playId !== undefined ? playId : state.playId,
        playType: playType !== undefined ? playType : state.playType,
      }
      saveAudioState(newState)
      return {
        ...state,
        playing: true,
        ...newState,
      }
    })
  },
  setTrackAndTime: (playTrack, playTime, playId, playType) => {
    set((state) => {
      if (state.playing && state.audioRef?.current) {
        state.audioRef.current.currentTime = playTime
      }
      const newState = {
        displayPlayer: true,
        playTrack,
        playId: playId !== undefined ? playId : state.playId,
        playType: playType !== undefined ? playType : state.playType,
      }
      saveAudioState(newState)
      return {
        ...state,
        playing: true,
        ...newState,
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
