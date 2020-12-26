import {
  totast,
  BASE_URL,
  API_URL_updatePhoto,
  TOKEN,
  loading,
  hideLoading,
  STATUS_CODE_updatePhoto_SUCCESSE
}from '../../service/config'
import {
  submitProve
}from '../../service/infoSum'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: {
      idCardR:{
        name:'身份证正面',
        label:'idCardR',
        url:''
      },
      idCardeB:{
        name:'身份证反面',
        label:'idCardeB',
        url:''
      },
      campusCard:{
        name:'校园卡',
        label:'campusCard',
        url:''
      },
      stuIdCard:{
        name:'学生卡',
        label:'stuIdCard',
        url:''
      }
    }, 
    returnUrlList:{
      idCardR:'',
      idCardeB:'',
      campusCard:'',
      stuIdCard:''
    },
    index: null,
    picker: ['是', '否'],
  },
  ChooseImage(e) {
    const {type}=e.currentTarget.dataset 
    const imgUrl=`imgList.${type}.url` 
    const _this=this   
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        const localUrl= res.tempFilePaths[0]             
          this.setData({
            [imgUrl]: localUrl
          })
          wx.uploadFile({
            url:  BASE_URL+API_URL_updatePhoto, 
            filePath: localUrl,
            name: 'file',
            header:{
              'content-type':'multipart/form-data',
            },
            formData: {
              name: type
            },      
            success (res){
              
              loading('正在上传')
              // console.log(res);
              const data = JSON.parse(res.data)　
              console.log(data);              
              if(data.code==STATUS_CODE_updatePhoto_SUCCESSE){
                totast(data.msg)
                const returnUrlItem=data.data.url
                const returnNameItem=data.data.name
                let returnUrl=_this.data.returnUrl
                for (let key in returnUrl){
                  if(key==returnNameItem){
                    returnUrl[key]=returnUrlItem
                  }
                }
                console.log(returnUrl);
                
              }  else {
                totast(data.msg)
              }       
            },
            fail (reject){
              totast('系统出错，请重试')      
            },
            // complete (){ 
            //   console.log(type);             
            // }
          })
      }
    });
  },
  
  _submitProve(returnUrlList){
    const driverId=wx.getStorageSync('id')
    
    loading('正在上传')
    submitProve(driverId,idCardR,idCardeB,campusCard,stuIdCard).then(res=>{
      hideLoading()
      wx.redirectTo({
        url: '',
      })
    })
  }
})