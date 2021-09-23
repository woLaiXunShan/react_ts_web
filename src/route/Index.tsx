import { lazy } from 'react';

/**
 * 路由懒加载
 * @param {String} filename 文件路径
 */
const lazyRouter = (filename: string) => {
	return lazy(() => import(`../pages/${filename}`))
}

const routeMap = [
	{
		name: 'Home', title: '首页', icon: '', notMenu: true,
		children: [
			{ path: '/', name: 'HomeIndex', title: '首页', component: lazyRouter('Home/Index') },
		]
	},
]

let routeList: any[] = []
let neatenRouteMap = (list: any[]) => {
	list.forEach((item: any) => {
		if (item.children && item.children.length) {
			neatenRouteMap(item.children)
			Object.assign(item, { pathList: item.children.map((it: any) => { return it.path }) })
		} else {
			routeList.push(item)
		}
	})
}
neatenRouteMap(routeMap)

export const RouteList = routeList
export const RouteMap = routeMap

// 登录后默认跳转的地址
export const loginToHome = '/'