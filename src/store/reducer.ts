/* eslint-disable import/no-anonymous-default-export */
import { IS_LOGIN } from './actionTypes'

export default (state: any, action: any) => {
  switch (action.type) {
    case IS_LOGIN:
      state.isLogin = action.value
      localStorage.isLogin = action.value
      return state
    default:
      return state
  }
}