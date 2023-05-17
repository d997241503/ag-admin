import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const AUTHKEY='admin-authkey'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setAuthKey(authkey) {
  return Cookies.set(AUTHKEY, authkey)
}
export function removeAuthKey() {
  return Cookies.remove(AUTHKEY)
}
export function getAuthKey() {
  return Cookies.get(AUTHKEY)
}