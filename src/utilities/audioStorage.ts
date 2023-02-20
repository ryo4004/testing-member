const DISPLAY_PLAYER = 'displayPlayer'
const setDisplayPlayer = (state: boolean) => {
  localStorage.setItem(DISPLAY_PLAYER, String(state))
}
const getDisplayPlayer = () => {
  return localStorage.getItem(DISPLAY_PLAYER)?.toLowerCase() === 'true'
}
const removeDisplayPlayer = () => {
  localStorage.removeItem(DISPLAY_PLAYER)
}

const PLAYER_CONCERT_ID = 'playerConcertid'
const setPlayerConcertId = (id: string) => {
  localStorage.setItem(PLAYER_CONCERT_ID, id)
}
const getPlayerConcertId = () => {
  return localStorage.getItem(PLAYER_CONCERT_ID)
}
const removePlayerConcertId = () => {
  localStorage.removeItem(PLAYER_CONCERT_ID)
}

const PLAYER_NUMBER = 'playerNumber'
const setPlayerNumber = (trackNumber: number) => {
  localStorage.setItem(PLAYER_NUMBER, String(trackNumber))
}
const getPlayerNumber = () => {
  return localStorage.getItem(PLAYER_NUMBER)
}
const removePlayerNumber = () => {
  localStorage.removeItem(PLAYER_NUMBER)
}

const PLAYER_SORCE_ID = 'playerSourceid'
const setPlayerSoucerId = (id: string) => {
  localStorage.setItem(PLAYER_SORCE_ID, id)
}
const getPlayerSourceId = () => {
  return localStorage.getItem(PLAYER_SORCE_ID)
}
const removePlayerSoucerId = () => {
  localStorage.removeItem(PLAYER_SORCE_ID)
}

const PLAYER_SORCE_NUMBER = 'playerSourceNumber'
const setPlayerSourceNumber = (trackNumber: number) => {
  localStorage.setItem(PLAYER_SORCE_NUMBER, String(trackNumber))
}
const getPlayerSourceNumber = () => {
  return localStorage.getItem(PLAYER_SORCE_NUMBER)
}
const removePlayerSourceNumber = () => {
  localStorage.removeItem(PLAYER_SORCE_NUMBER)
}

const PLAYER_PRACTICE_ID = 'playerPracticeid'
const setPlayerPracticeId = (id: string) => {
  localStorage.setItem(PLAYER_PRACTICE_ID, id)
}
const getPlayerPracticeId = () => {
  return localStorage.getItem(PLAYER_PRACTICE_ID)
}
const removePlayerPracticeId = () => {
  localStorage.removeItem(PLAYER_PRACTICE_ID)
}

const PLAYER_PRACTICE_FILE = 'playerPracticeFile'
const setPlayerPracticeFile = (fileNumber: number) => {
  localStorage.setItem(PLAYER_PRACTICE_FILE, String(fileNumber))
}
const getPlayerPracticeFile = () => {
  return localStorage.getItem(PLAYER_PRACTICE_FILE)
}
const removePlayerPracticeFile = () => {
  localStorage.removeItem(PLAYER_PRACTICE_FILE)
}

export const audioStorage = {
  setDisplayPlayer,
  getDisplayPlayer,
  removeDisplayPlayer,
  setPlayerConcertId,
  getPlayerConcertId,
  removePlayerConcertId,
  setPlayerNumber,
  getPlayerNumber,
  removePlayerNumber,
  setPlayerSoucerId,
  getPlayerSourceId,
  removePlayerSoucerId,
  setPlayerSourceNumber,
  getPlayerSourceNumber,
  removePlayerSourceNumber,
  setPlayerPracticeId,
  getPlayerPracticeId,
  removePlayerPracticeId,
  setPlayerPracticeFile,
  getPlayerPracticeFile,
  removePlayerPracticeFile,
}
