const MAIN_KEY = 'displayMain'

const setMainState = (state: boolean) => {
  localStorage.setItem(MAIN_KEY, String(state))
}

const getMainState = () => {
  return localStorage.getItem(MAIN_KEY)?.toLowerCase() === 'true'
}

const MINI_KEY = 'displayMini'

const setMiniState = (state: boolean) => {
  localStorage.setItem(MINI_KEY, String(state))
}

const getMiniState = () => {
  return localStorage.getItem(MINI_KEY)?.toLowerCase() === 'true'
}

const OTHER_KEY = 'displayOther'

const setOtherState = (state: boolean) => {
  localStorage.setItem(OTHER_KEY, String(state))
}

const getOtherState = () => {
  return localStorage.getItem(OTHER_KEY)?.toLowerCase() === 'true'
}

export const archiveStorage = {
  setMainState,
  getMainState,
  setMiniState,
  getMiniState,
  setOtherState,
  getOtherState,
}
