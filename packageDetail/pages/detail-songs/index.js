// pages/detail-songs/index.js
import { rankingStore } from '../../../store/index'
import { getSongDetail } from '../../../service/api_music'
import { playerStore } from '../../../store/index'

Page({
    data: {
        type: "",
        ranking: "",
        songInfo: {}
    },
    onLoad: function (options) {
        const type = options.type
        this.setData({ type })
        if (type === "menu") {
            const id = options.id
            getSongDetail(id).then(res => {
                this.setData({ songInfo: res.playlist })
            })
        } else if (type === "rank") {
            const ranking = options.ranking
            this.setData({ ranking })

            // 1. 获取数据
            rankingStore.onState(ranking, this.getRankiungDataHandler)
        }
    },
    onUnload: function () {
        if (this.data.ranking) {
            rankingStore.offState(this.data.ranking, this.getRankiungDataHandler)
        }
    },

    getRankiungDataHandler: function (res) {
        this.setData({ songInfo: res })
    },

    handleSongitemClick: function (event) {
        const index = event.currentTarget.dataset.index
        playerStore.setState("playListSong", this.data.songInfo.tracks)
        playerStore.setState("playListIndex", index)
    }
})