import * as request from '../Library/Request'
import { playTime, version } from '../Library/Library'
import { escapeReg } from '../Component/Auth/Archive/Library/Library'

import { setDisplayPlayer, audioPause } from './Audio'

const prefix = 'ARCHIVE_'

const loading = (loading) => ({
  type: prefix + 'LOADING',
  payload: { loading }
})

export const getConcertList = () => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    if (getState().archive.concertList) return false
    if (getState().archive.loading) return false
    dispatch(loading(true))
    const path = 'https://archive.winds-n.com/api/member/concert'
    const send = {
      userid: window.localStorage.windsid,
      token: window.localStorage.token,
      version,
      member: true
    }
    request.post(path, send, (err, res) => {
      if (err) {
        return false
      } else {
        dispatch(setConcertList(res.body.list.reverse()))
      }
      dispatch(loading(false))
    })
  }
}

const setConcertList = (concertList) => ({
  type: prefix + 'SET_CONCERT_LIST',
  payload: { concertList }
})

// const setConcertListLoad = (concertListLoad) => ({
//   type: prefix + 'SET_CONCERT_LIST_LOAD',
//   payload: { concertListLoad }
// })

export const toggleDisplayMain = (displayMain) => {
  return async (dispatch, getState) => {
    window.localStorage.displayMain = displayMain
    dispatch(setDisplayMain(displayMain))
  }
}

const setDisplayMain = (displayMain) => ({
  type: prefix + 'SET_DISPLAY_MAIN',
  payload: { displayMain }
})

export const toggleDisplayMini = (displayMini) => {
  return async (dispatch, getState) => {
    window.localStorage.displayMini = displayMini
    dispatch(setDisplayMini(displayMini))
  }
}

const setDisplayMini = (displayMini) => ({
  type: prefix + 'SET_DISPLAY_MINI',
  payload: { displayMini }
})

export const toggleDisplayOther = (displayOther) => {
  return async (dispatch, getState) => {
    window.localStorage.displayOther = displayOther
    dispatch(setDisplayOther(displayOther))
  }
}

const setDisplayOther = (displayOther) => ({
  type: prefix + 'SET_DISPLAY_OTHER',
  payload: { displayOther }
})

export const setConcertid = (concertid) => ({
  type: prefix + 'SET_OVERVIEW_ID',
  payload: { concertid }
})

// Search
const loadingSearch = (loadingSearch) => ({
  type: prefix + 'LOADING_SEARCH',
  payload: { loadingSearch }
})

export const setSearchRef = (searchRef) => ({
  type: prefix + 'SET_SEARCH_REF',
  payload: { searchRef }
})

export const search = (value) => {
  return async (dispatch, getState) => {
    dispatch(setSearchQuery(value))
    if (value === '' || !value) return dispatch(resetSearch())
    dispatch(loadingSearch(true))
    const searchResult = getState().archive.concertList.map((item) => {
      const concert = item.detail
      return concert.data.map((track) => {
        const s = new RegExp(escapeReg(value), 'i')
        // 演奏会名で一致
        if (concert.title.search(s) >= 0) return {concert, track}
        // タイトルで一致
        if (track.title.search(s) >= 0) return {concert, track}
        // サブタイトルで一致
        // if (track.addtitle.search(s) >= 0) return {concert: concert, track}
        // 作曲者名で一致
        if ((track.composer ? track.composer : '').search(s) >= 0) return {concert, track}
        // 編曲者名で一致
        if ((track.arranger ? track.arranger : '').search(s) >= 0) return {concert, track}
      })
    })
    dispatch(loadingSearch(false))
    dispatch(setSearchResult(searchResult))
  }
}

const setSearchQuery = (searchQuery) => ({
  type: prefix + 'SET_SEARCH_QUERY',
  payload: { searchQuery }
})

const setSearchResult = (searchResult) => ({
  type: prefix + 'SET_SEARCH_RESULT',
  payload: { searchResult }
})

export const resetSearch = () => {
  return async (dispatch, getState) => {
    dispatch(setSearchQuery(''))
    dispatch(setSearchResult(undefined))
    getState().archive.searchRef.focus()
  }
}

// Photo
const loadingPhoto = (loadingPhoto) => ({
  type: prefix + 'LOADING_PHOTO',
  payload: { loadingPhoto }
})

export const getPhotoList = () => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    if (!getState().archive.concertid) return false
    if (getState().archive.photoConcertid === getState().archive.concertid) return false
    dispatch(loadingPhoto(true))
    const path = 'https://archive.winds-n.com/api/member/photo'
    const send = {
      userid: window.localStorage.windsid,
      token: window.localStorage.token,
      version,
      id: getState().archive.concertid,
      member: true
    }
    request.post(path, send, (err, res) => {
      if (err) {
        return false
      } else {
        console.warn('Photo', res.body)
        dispatch(setPhotoList(getState().archive.concertid, res.body.list, res.body.baseSrcThumbnail, res.body.baseSrcOriginal, res.body.url))
      }
      dispatch(loadingPhoto(false))
    })
  }
}

export const resetPhotoList = () => {
  return async (dispatch, getState) => {
    dispatch(setPhotoList(undefined, undefined, undefined, undefined, undefined))
  }
}

const setPhotoList = (photoConcertid, photoList, photoBaseSrcThumbnail, photoBaseSrcOriginal, photoUrl) => ({
  type: prefix + 'SET_PHOTO_LIST',
  payload: { photoConcertid, photoList, photoBaseSrcThumbnail, photoBaseSrcOriginal, photoUrl }
})

export const setDisplayPhotoSlideModal = (displayPhotoSlideModal, photoNumber) => ({
  type: prefix + 'SET_DISPLAY_PHOTO_SLIDE_MODAL',
  payload: { displayPhotoSlideModal, photoNumber }
})

// Video
const loadingVideo = (loadingVideo) => ({
  type: prefix + 'LOADING_VIDEO',
  payload: { loadingVideo }
})

export const getVideoList = () => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    if (!getState().archive.concertid) return false
    if (getState().archive.videoConcertid === getState().archive.concertid) return false
    dispatch(loadingVideo(true))
    const path = 'https://archive.winds-n.com/api/member/video'
    const send = {
      userid: window.localStorage.windsid,
      token: window.localStorage.token,
      version,
      id: getState().archive.concertid,
      member: true
    }
    request.post(path, send, (err, res) => {
      if (err) {
        return false
      } else {
        dispatch(setVideoList(getState().archive.concertid, res.body.list, res.body.baseSrc, res.body.url, res.body.poster))
      }
      dispatch(loadingVideo(false))
    })
  }
}

export const resetVideo = () => {
  return async (dispatch, getState) => {
    dispatch(setVideoList(undefined, undefined, undefined, undefined, undefined))
    getState().archive.audioPlayerDisplay ? dispatch(setDisplayPlayer(true)) : false
    dispatch(setDisplayVideoController(false, undefined))
  }
}

const setVideoList = (videoConcertid, videoList, videoBaseSrc, videoUrl, videoPoster) => ({
  type: prefix + 'SET_VIDEO_LIST',
  payload: { videoConcertid, videoList, videoBaseSrc, videoUrl, videoPoster }
})

// プレイヤー操作
export const setVideoRef = (videoRef) => ({
  type: prefix + 'SET_VIDEO_REF',
  payload: { videoRef }
})

export const setDisplayVideoController = (displayVideoController, audioPlayerDisplay) => ({
  type: prefix + 'SET_DISPLAY_VIDEO_CONTROLLER',
  payload: { displayVideoController, audioPlayerDisplay }
})

export const setLoadingVideoSource = (status) => ({
  type: prefix + 'SET_LOADING_VIDEO_SOURCE',
  payload: { loadingVideoSource: status }
})

export const videoLoadPercentUpdate = (percent) => ({
  type: prefix + 'VIDEO_LOAD_PERCENT_UPDATE',
  payload: { videoLoadPercent: percent }
})

export const videoPlayUpdate = (videoCurrent, videoDuration) => {
  const videoPlayPercent = (videoDuration && videoCurrent) ? Math.round((videoCurrent / videoDuration) * 1000) / 10 : undefined
  const videoCurrentTime = videoCurrent ? playTime(Math.floor(videoCurrent)) : undefined
  const videoDurationTime = videoDuration ? playTime(Math.round(videoDuration)) : undefined
  return ({
    type: prefix + 'VIDEO_PLAY_UPDATE',
    payload: {
      videoCurrent,
      videoCurrentTime,
      videoDuration,
      videoDurationTime,
      videoPlayPercent
    }
  })
}


const setVideoPlayStatus = (videoPlayStatus, videoPlayTrack) => ({
  type: prefix + 'SET_VIDEO_PLAY_STATUS',
  payload: { videoPlayStatus, videoPlayTrack }
})
export const videoPlayRequest = (number) => {
  return async (dispatch, getState) => {
    // オーディオが再生中なら止める
    dispatch(audioPause())
    // プレイヤーを表示
    const audioPlayerDisplay = getState().audio.displayPlayer || getState().archive.audioPlayerDisplay ? true : false
    dispatch(setDisplayVideoController(true, audioPlayerDisplay))
    // オーディオプレイヤーが表示されていたら隠す
    getState().audio.displayPlayer ? dispatch(setDisplayPlayer(false)) : false
    // 曲を再生
    const track = getState().archive.videoList[number]
    if (getState().archive.videoRef) {
      getState().archive.videoRef.src = getState().archive.videoUrl + getState().archive.videoBaseSrc + track.path
      dispatch(videoPlay())
    }
  }
}

export const videoPlay = (number) => {
  return async (dispatch, getState) => {
    getState().archive.videoRef.play()
    dispatch(setVideoPlayStatus(true, number))
  }
}

export const videoPause = (e) => {
  if (e) e.preventDefault()
  return async (dispatch, getState) => {
    if (!getState().archive.videoRef.paused) {
      getState().archive.videoRef.pause()
      dispatch(setVideoPlayStatus(false, getState().archive.videoPlayTrack))
    }  
  }
}

export const videoStop = (e) => {
  if (e) e.preventDefault()
  return async (dispatch, getState) => {
    if (!getState().archive.current) {
      getState().archive.audioPlayerDisplay ? dispatch(setDisplayPlayer(true)) : false
      dispatch(setDisplayVideoController(false, undefined))
    } 
    getState().archive.videoRef.pause()
    getState().archive.videoRef.currentTime = 0
    dispatch(setVideoPlayStatus(false, getState().archive.videoPlayTrack))
  }
}
