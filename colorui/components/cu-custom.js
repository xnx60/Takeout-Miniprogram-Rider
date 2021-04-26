const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    isPerserve: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    isMore: {
      type: [Boolean, String],
      default: false
    },
    isPerson: {
      type: [Boolean, String],
      default: false
    },
    isLocated: {
      type: [Boolean, String],
      default: false
    },
    toParcelPage: {
      type: [Boolean, String],
      default: false
    },
    toHome: {
      type: [Boolean, String],
      default: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 8
      });
    },
    toHome(){
      wx.navigateTo({
        url: '/pages/home/home',
      })
    },
    toParcelPage(){
      wx.navigateTo({
        url: '/pages/parcelModule/parcelPage/parcelPage',
      })
    },
    showMore(){
      this.triggerEvent('emitIsShow')
    },
    choosePosition(){
      wx.navigateTo({
        url: '/pages/position/position',
      })
    }
  }
})