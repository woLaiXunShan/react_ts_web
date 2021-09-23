import axios from 'axios'
import qs from 'qs';

export const baseURL = process.env.NODE_ENV === "testbuild" ? '' :
	process.env.NODE_ENV === "uatbuild" ? '' :
	process.env.NODE_ENV === "prodbuild" ? '' : ''

const Axios = axios.create({
	baseURL: baseURL,
	timeout: 150e3 // 请求超时时间  
})

let pending: any[] = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config: { url: string; method: string; }) => {
	for (let p in pending) {
		if (pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
			pending[p].f(); //执行取消操作
			pending.splice(Number(p), 1); //把这条记录从数组中移除
		}
	}
}
// 添加请求拦截器
Axios.interceptors.request.use((config: any) => {
	// 在发送请求之前做些什么
	config.headers['Authorization'] = localStorage.token
	if (!config.url.includes('oss/uploadFile')) {
		removePending(config); //在一个ajax发送前执行一下取消操作
		config.cancelToken = new cancelToken((c) => {
			// 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
			pending.push({ u: config.url + '&' + config.method, f: c });
		});
	}
	return config;
}, (error: any) => {
	// 对请求错误做些什么
	return Promise.reject(error)
})

// 添加响应拦截器
let isNotice_noneCode = false
let isNotice_401 = false
let isNotice_200: any = null
Axios.interceptors.response.use((response: any) => {
	// 对响应数据做点什么
	removePending(response.config); // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
	if (publicNotice(response.data?.code || response.data?.status_code, response.data?.message)) {
		return response.data
	} else {
		return Promise.reject(false)
	}

}, (error: any) => {
	publicNotice(error.response?.status, error.response?.data?.message)
	return Promise.reject(error)
})

function publicNotice(code: any, messageStr?: any) {
	if (!code) return true
	if (code === 401) {
		// if (!isNotice_401) message.error('登录过期啦！')
		isNotice_401 = true
		setTimeout(() => {
			if (localStorage.backUrl) window.location.href = localStorage.backUrl + 'login'
			isNotice_401 = false
		}, 1e3);
		return false
	}
	if (code === 503) {
		// if (!isNotice_noneCode) message.error('服务不可用！')
		isNotice_noneCode = true
		setTimeout(() => {
			isNotice_noneCode = false
		}, 1e3)
		return false
	}
	if (code !== 200 && code !== 205) {
		let msg = messageStr ? messageStr : '服务不可用！'
		// if (!isNotice_200 || isNotice_200 !== msg) message.error(msg)
		isNotice_200 = msg
		setTimeout(() => {
			isNotice_200 = null
		}, 1e3)
		return false
	}
	return true
}

// 发起请求
export const fetch = (url: string, data: any, method: string = `GET`, contentType: string = 'json') => {
	data = data || ''
	if (method === `GET` || method === `get`) {
		return Axios.get(url, data.params ? data : {
			params: data
		})
	}
	if (method === 'DELETE' || method === 'delete') {
		// return Axios.delete(url, data.params ? data : { // header传参
		//   params: data
		// })
		return Axios.delete(url, data.data ? data : { // body传参
			data: data
		})
	}
	if (method === 'POST' || method === 'post') {
		if (contentType === 'form') {
			return Axios.post(url, qs.stringify(data))
		} else {
			return Axios.post(url, data)
		}
	}
	if (method === 'PATCH' || method === 'patch') {
		return Axios.post(url, data)
	}
	if (method === 'PUT' || method === 'put') {
		return Axios.post(url, data)
	}
}


