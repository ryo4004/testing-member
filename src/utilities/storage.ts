import { v1 as uuidv1 } from 'uuid'

const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

const getToken = () => {
  return localStorage.getItem('token')
}

const setClientId = (clientId: string) => {
  localStorage.setItem('clientid', clientId)
}

const getClientId = () => {
  const clientId = localStorage.getItem('clientid')
  if (clientId) {
    return clientId
  }
  const newClientId = uuidv1().split('-').join('')
  setClientId(newClientId)
  return newClientId
}

const USER_ID_KEY = 'windsid'

const setUserId = (userId: string) => {
  localStorage.setItem(USER_ID_KEY, userId)
}

const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY)
}

const clearAllContents = () => {
  const clientId = getClientId()
  localStorage.clear()
  setClientId(clientId)
}

export const authStorage = {
  setToken,
  getToken,
  getClientId,
  setUserId,
  getUserId,
  clearAllContents,
}
