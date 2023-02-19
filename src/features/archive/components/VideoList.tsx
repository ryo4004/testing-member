import { RefObject, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'
import { ContentsBox, ContentsLoading } from '../../../components/ContentsBox'
import { useVideo } from '../api/getVideo'
import styles from './VideoList.module.scss'
import { ConcertItem, useConcertList } from '../api/getConcertList'
import type { ConcertDetail } from '../../../types'
import type { Video } from '../../../types/video'
import { ReactComponent as VideoIcon } from '../../../assets/video.svg'
import { useMediaStore } from '../../../stores/media'
import { useEffect } from 'react'

type VideoState = {
  loading: boolean
}

const initialState = {
  loading: false,
}

const useVideoElement = (videoRef: RefObject<HTMLVideoElement>, videoData: Video) => {
  const [state, setState] = useState<VideoState>(initialState)
  const {
    videoRef: storedVideoRef,
    videoPlaying,
    videoPlayTrack,
    videoCurrentTime,
    setVideoRef,
    setVideoTrack,
    setVideoPlaying,
    setVideoLoadingPercent,
    updateVideoPlaying,
  } = useMediaStore()

  useEffect(() => {
    if (videoRef && !storedVideoRef) {
      setVideoRef(videoRef)
    }
  }, [videoRef, storedVideoRef, setVideoRef])

  useEffect(() => {
    return () => setVideoRef(null)
  }, [setVideoRef])

  const onPlay = () => {
    videoRef.current?.play()
    setVideoPlaying(true)
  }

  const onPause = () => {
    videoRef.current?.pause()
    setVideoPlaying(false)
  }

  const onLoadStart = () => {
    if (videoRef.current?.src) {
      setState((state) => ({ ...state, loading: true }))
    }
  }

  const onLoadedMetadata = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      updateVideoPlaying(videoCurrentTime, videoRef.current.duration)
    } else {
      updateVideoPlaying(videoCurrentTime, null)
    }
  }

  const onLoadedData = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      updateVideoPlaying(videoCurrentTime, videoRef.current.duration)
    } else {
      updateVideoPlaying(videoCurrentTime, null)
    }
  }

  const onDurationChange = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      updateVideoPlaying(videoCurrentTime, videoRef.current.duration)
    } else {
      updateVideoPlaying(videoCurrentTime, null)
    }
  }

  const onProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const { buffered } = videoRef.current
      setVideoLoadingPercent(
        videoRef.current && Math.round((buffered.end(buffered.length - 1) / videoRef.current.duration) * 1000) / 10
      )
    } else {
      setVideoLoadingPercent(null)
    }
  }

  const onCanPlayThrough = () => {
    if (videoPlaying) {
      videoRef.current?.play()
    }
    setState((state) => ({ ...state, loading: false }))
  }

  const onError = () => {
    setState((state) => ({ ...state, loading: true }))
  }

  const onTimeUpdate = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      updateVideoPlaying(videoRef.current.currentTime, videoRef.current.duration)
    } else {
      updateVideoPlaying(null, null)
    }
  }

  const onEnded = () => {
    if (videoPlayTrack !== null) {
      if (videoData.list.length > videoPlayTrack + 1) {
        return setVideoTrack(videoPlayTrack + 1)
      } else {
        return onPause()
      }
    }
  }

  const onClick = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
    e.preventDefault()
    videoPlaying ? onPause() : onPlay()
  }

  return {
    state,
    videoPlayTrack,
    onPlay,
    onPause,
    videoFunctions: {
      onLoadStart,
      onLoadedMetadata,
      onLoadedData,
      onDurationChange,
      onProgress,
      onCanPlayThrough,
      onError,
      onTimeUpdate,
      onEnded,
      onClick,
    },
  }
}

export const VideoList = () => {
  const { concertId } = useParams()
  const videoQuery = useVideo(concertId || '')
  const concertListQuery = useConcertList()

  if (videoQuery.isLoading || concertListQuery.isLoading) {
    return <ContentsLoading />
  }
  if (!videoQuery.data || !concertListQuery.data || !concertId) {
    return null
  }

  const concertItem = concertListQuery.data.list.find((item) => item.id === concertId) || null
  if (!concertItem) {
    return null
  }

  const { data: videoData } = videoQuery

  return <VideoComponent videoData={videoData} concertItem={concertItem} />
}

const VideoComponent = ({ videoData, concertItem }: { videoData: Video; concertItem: ConcertItem }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { videoPlayTrack, videoFunctions } = useVideoElement(videoRef, videoData)

  const src = composeSrc(videoData.url, videoData.baseSrc, videoData.list, videoPlayTrack)

  const aspectClass = videoData.poster === 'https://video.winds-n.com/poster_800_586.png' ? 'aspect-4-3' : 'aspect-16-9'

  return (
    <ContentsBox>
      <div className={styles['archive-video-list']}>
        <div className={styles['video-player']}>
          <div className={clsx(styles['video-frame'], styles[aspectClass])}>
            <video
              ref={videoRef}
              src={src}
              {...videoFunctions}
              poster={videoData.poster}
              playsInline={true}
              controls={true}
              controlsList="nodownload"
            ></video>
          </div>
        </div>
        <TrackList concertDetail={concertItem.detail} videoData={videoData} />
      </div>
    </ContentsBox>
  )
}

const TrackList = ({ concertDetail, videoData }: { concertDetail: ConcertDetail; videoData: Video }) => {
  const { videoPlayTrack, setVideoTrack } = useMediaStore()
  const playlist = composePlaylist(concertDetail, videoData)
  return (
    <div className={styles['video-list']}>
      {concertDetail.contents.map((part) => {
        const trackList = part.music.map((musicKey) => {
          const trackData = playlist.filter((playItem) => playItem.data === musicKey)
          return trackData.map((track) => {
            const { title, composer, arranger } = track.music
            return (
              <div
                key={`track-${track.trackNumber}`}
                className={clsx(
                  styles.track,
                  { [styles.playing]: videoPlayTrack === track.trackNumber },
                  styles[concertDetail.type]
                )}
                onClick={() => setVideoTrack(track.trackNumber, concertDetail.id, concertDetail.type)}
              >
                <div className={styles.icon}>
                  <VideoIcon />
                </div>
                <div className={styles.info}>
                  <span className={styles.title}>
                    {title}
                    {track.addtitle && ` ${track.addtitle}`}
                  </span>
                  {composer ? (
                    arranger ? (
                      <span className={styles.composer}>
                        {composer}
                        {composer.match(/民謡/) ? '' : '作曲'}
                        <span>/</span>
                        {arranger}編曲
                      </span>
                    ) : (
                      <span className={styles.composer}>{composer}</span>
                    )
                  ) : arranger ? (
                    <span className={styles.composer}>{arranger}編曲</span>
                  ) : null}
                </div>
              </div>
            )
          })
        })
        return (
          <div key={part.label}>
            <label>{part.label}</label>
            {trackList}
          </div>
        )
      })}
    </div>
  )
}

const composePlaylist = (concertDetail: ConcertDetail, video: Video) => {
  return video.list.map((videoItem, index) => {
    const music = concertDetail.data[videoItem.data]
    const part = concertDetail.contents.find((part) => part.music.includes(videoItem.data)) || null
    return { trackNumber: index, ...videoItem, music, part }
  })
}

const composeSrc = (
  url: string | undefined,
  baseSrc: string | undefined,
  videoList: Video['list'],
  track: number | null
) => {
  if (url && baseSrc && track !== null) {
    return url + baseSrc + videoList[track].path
  }
}
