import { fetch } from './axios'

/**权限 */
export const getRoleMenuByAppId: any = (data: any) => { // 
  return fetch(`/menu/getRoleMenuByAppId`, data, `get`)
}