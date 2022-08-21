// base-ui/nav-bar/index.js
const globalData = getApp().globalData
Component({
   // 有多个插槽时
    options: {
        multipleSlots: true
    },

    properties: {
        title: {
            type: String,
            value: '默认标题'
        }
    },

    data: {
        statusBarHeight: globalData.statusBarHeight,
        navBarHeight: globalData.navBarHeight
    },

    methods: {
        handleLeftClick: function () {
            this.triggerEvent("click")
        }
    }
})
