/**
 * 通过判断登录、权限 动态生成Route
 */
import React, { Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { RouteList } from '../../route/Index'
import NotFound from '../../pages/error/NotFound'

interface IRoute {
	parentName: string,
	path: string,
	name: string,
	authName: string,
	redirect?: string | null,
	component: any,
	needLogin?: boolean,
	notMenu?: string[],
	isKeepAlive?: boolean
}

const PrivateRoute: React.FC<any> = () => {

	return (
		<Switch>
			{
				// 动态生成路由
				RouteList.map((item: IRoute, index: number) => {
					return <Route
						key={index}
						path={item.path}
						exact
						render={props => { // 渲染route
							const _redirect: string | null = item.redirect ? item.redirect : ''
							if (_redirect) {
								return <Redirect
									to={{
										pathname: _redirect,
										state: { from: props.location }
									}}
								/>
							}
							if (localStorage.token) { // 已登录
								if (item.notMenu) { // 没有权限限制
									return <Suspense fallback={<h1>loading</h1>}>
										<item.component {...props} />
									</Suspense>
								} else { // 有权限限制
									// let menuRoot = null
									// if (localStorage.menuRoot) menuRoot = JSON.parse(localStorage.menuRoot)
									// let authName = item.authName ? item.authName : item.name
									if (true) { // 拥有权限 menuRoot && menuRoot[authName]
										return <Suspense fallback={<h1>loading</h1>}>
											<item.component {...props} />
										</Suspense>
									} else { // 未拥有权限
										// 重定向到未拥有权限页
										return <Redirect
											to={{
												pathname: '/noPermissions',
												state: { from: props.location }
											}}
										/>
									}
								}
							} else { // 未登录
								// 重定向到登录页
								if (localStorage.backUrl) window.location.href = localStorage.backUrl
							}
						}}
					/>
				})
			}
			{/* 未拥有权限路由 */}
			{/* <Route path="/noPermissions" exact component={NoPermissions} /> */}
			{/* 404 页面未找到路由 */}
			{
				// 判断没找到页面地址如果未登录就跳转到登录，如果已登录就404
				true ?
					<Route component={NotFound} /> :
					<Redirect to={{ pathname: '/' }} />
			}
		</Switch>
	)
}

// const LoadableComponent: React.FC<any> = (PrivateRoute: any) => {
//   return Loadable({
//     // loader: PrivateRoute,
//     loading: ()=><LoadingPage/>
//   })
// }

export default PrivateRoute