import request from './network'
import {
  API_URL_checkLoginStatus,
} from './config'

export function checkLoginStatus(driverId){
  return request({
    url:  API_URL_checkLoginStatus,
    method:'POST',
    data:{
      driverId
    }
  },'application/x-www-form-urlencoded')
}