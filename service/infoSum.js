import request from './network'
import {
  API_URL_selectAllCampusName,
  API_URL_infoSum,
  API_URL_updatePhoto,
  API_URL_submitProve
} from './config'

export function selectAllCampus(){
  return request({
    url: API_URL_selectAllCampusName,
  })
}

export function infoSum(disCampus, driverName,driverGender,driverId){
  return request({
    url:  API_URL_infoSum,
    method:'POST',
    data:{
      disCampus,
      driverName,
      driverGender,
      driverId
    },
  })
}

export function submitProve(driverId,driverIdcardFront,driverIdcardBehind,schoolCard,studentCard){
  return request({
    url: API_URL_submitProve,
    method:'POST',
    data:{
      driverId,
      driverIdcardFront,
      driverIdcardBehind,
       schoolCard,
       studentCard
    },
  })
}