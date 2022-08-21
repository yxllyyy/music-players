// components/song-menu-area/index.js
import { playerStore } from '../../store/index'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        songMenu: {
            type: Array,
            value: []
        },
        title: {
            type: String,
            value: "默认歌单"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        ids: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleMenuItemClick: function (event) {
            const item = event.currentTarget.dataset.item
            wx.navigateTo({
                url: `/packageDetail/pages/detail-songs/index?id=${item.id}&type=menu`,
            })
            // 播放歌曲
            // const id = item.id
            // playerStore.dispatch("playMusicWithSongIdAction", { id })
        },

        handleMoreClick: function () {
           if (this.data.title === "推荐歌单") {
                this.navigateToDetailSongsPage("newRanking")
            }
            this.navigateToDetailSongsPage("hotRanking")
        },

        navigateToDetailSongsPage: function (rankingName) {
            wx.navigateTo({
                url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
            })
           
        },

    }
})
