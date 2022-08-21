// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'
import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 300, { trailing: true })

Page({
  data: {
    swiperHeight: 0,
    banners: [],
    recommendSongs: [],
    hotSongMenu: [],
    recommendSong: [],
    rankings: { 0: {}, 2: {}, 3: {} },

    currentSong: {},
    isPlaying: false,
    playAnimState: "pause"
  },

  onLoad: function (options) {

    // playerStore.dispatch("playMusicWithSongIdAction", {id: 1901371647})
    // 获取页面数据
    this.getPageData()

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction")


    this.setupPlayerStoreListener()
  },


  // 网络请求
  getPageData: function () {
    getBanners().then(res => {
      // setData是同步的还是异步的
      // setData在设置数据上是同步的
      // 通过最新的数据对wxml进行渲染，渲染的过程是异步的
      this.setData({ banners: res.banners })
    })

    getSongMenu("全部", 50).then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })

    getSongMenu("古风", 50).then(res => {
      this.setData({ recommendSong: res.playlists })
    })
  },

  // 事件的处理
  handleSearchClick: function () {
    wx.navigateTo({
      url: '/packageDetail/pages/detail-search/index',
    })
  },

  handleSwiperImageLoaded: function () {
    // 获取图片的高度(如果去获取某一个组件的高度)
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height })
    })
  },

  getRankingHandler: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = { name, coverImgUrl, playCount, songList }
      const newRankings = { ...this.data.rankings, [idx]: rankingObj }
      this.setData({ rankings: newRankings })
    }
  },

  handleMoreClick: function () {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick: function (event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage: function (rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  handleSongItemClick: function (event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSong", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },

  setupPlayerStoreListener: function () {
    // 1.从store获取共享的数据（排行榜）
    rankingStore.onState("hotRanking", res => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })

    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))

    // 2.播放器监听
    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying, 
          playAnimState: isPlaying ? "running": "paused" 
        })
      }
    })
  },

  handlePlayBtnClick: function (event) {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
    // 阻止事件向上传递

  },

  handlePlayBarClick: function () {
    wx.navigateTo({
      url: `/packagePlayer/pages/music-player/index?id=${this.data.currentSong.id}`,
    })
  }

})