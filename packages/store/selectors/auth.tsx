/**
 * Selector logic for accessing auth data in view components
 *
 * @package: REA app
 * @author:  pospi <pospi@spadgos.com>
 * @since:   2017-03-31
 */

import { AppState } from '../types'

import { createSelector } from 'reselect'

const getAuthState = (appState: AppState) => appState.auth

export const isLoggedIn = (state: AppState) => getAuthState(state).activeLogin >= 0

export const hasLoginError = (state: AppState) => getAuthState(state).loginError !== null

// :TODO: update this to use error code and read from intl data
export const getLoginErrorMessage = (state: AppState) => {
  const s = getAuthState(state)
  return s && s.loginError ? s.loginError.message : ''
}

export const getActiveLoginToken = (state: AppState) => {
  const s = getAuthState(state)
  return s.logins[s.activeLogin] ? s.logins[s.activeLogin].token : null
}
