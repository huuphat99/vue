import config from '@/config'
import axios from 'axios'
import router from '../router'

// API_BASEは .env で定義する
const API_BASE = config.APIBase

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const err = error.response
    // console.log(err, 'error inter')

    switch (err.status) {
      case 400:
        return Promise.reject(error)

      case 401:
        localStorage.clear()
        localStorage.removeItem('account_info')
        setTimeout(() => {
          router.push('login')
        }, 500)
        break

      default:
        break
    }
  },
)

export class API {
  static getToken () {
    // localstorageから取ってくる
    const token = JSON.parse(localStorage.getItem('account_info')).token
    return token
  }

  static async get (path, params = {}, isAuth = false) {
    if (!isAuth) {
      return axios.get(`${API_BASE}${path}`, params)
    } else {
      const token = this.getToken()

      let result = null
      try {
        result = await axios.get(`${API_BASE}${path}`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        })
      } catch (err) {
        result = err.response
      }
      return result
    }
  }

  static put (path) {
    return axios.put(`${API_BASE}${path}`)
  }

  static async post (path, params = {}, isAuth = false, header = {}) {
    if (!isAuth) {
      return axios.post(`${API_BASE}${path}`, params, { headers: header })
    } else {
      const token = this.getToken()
      header.Authorization = `Bearer ${token}`

      let result = null
      try {
        result = await axios.post(`${API_BASE}${path}`, params, {
          headers: header,
        })
      } catch (err) {
        result = err.response
      }
      return result
    }
  }

  static login (params) {
    return this.post('/session', params)
  }

  static logout () {
    const token = this.getToken()
    const headers = { Authorization: `Bearer ${token}` }
    let result = null
    try {
      result = axios.delete(`${API_BASE}/session`, { headers })
    } catch (err) {
      result = err.response
    }
    return result
  }

  // Ticket Management
  static getTicketList (params) {
    return this.get('/tickets/settlements/list', params, true)
  }

  static getTicketDetail (params) {
    return this.get('/tickets/settlements/detail', params, true)
  }

  static getPackageList (params) {
    return this.get('/tickets/packages/list', params, true)
  }

  static getItemList (params) {
    return this.get('/tickets/items/list', params, true)
  }

  static postTicketCancel (params) {
    return this.post('/ticketing/cancel', params, true)
  }

  // User Management
  static getUserList (params) {
    return this.get('/users/list', params, true)
  }
}
