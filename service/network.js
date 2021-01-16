import {
  BASE_URL,
  totast,
  loading,
  hideLoading,
  TOKEN
} from './config'

export default function(options,headerContentType){
  const token =wx.getStorageSync(TOKEN)
  
    return new Promise((reslove,reject)=>{
      wx.request({
        url: BASE_URL + options.url,
        data: options.data || {},     
        header:{
          'content-type':headerContentType || 'application/json'
        },
        method: options.method || 'get',
        success: reslove,
        fail: reject
      })
    })
  // }


}
 