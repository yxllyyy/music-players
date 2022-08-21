// pages/music-player/index.js
import { audioContext, playerStore } from '../../../store/index'

const playModeNames = ["order", "repeat", "random"]

Page({
  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: "",
    currentLyricText: "",

    playModeIndex: 0,
    playModeName: "order",

    isPlaying: false,
    playingName: "pause",

    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isMusicLyric: true,
    isSliderChange: false,
    lyricScrollTop: 0
  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // 一进来播放音乐
    // playerStore.dispatch("playMusicWithSongIdAction", {id})

    // 2.根据id获取歌曲信息
    this.setupPlayerStoreListener()

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })

  },


  // 事件处理
  handleSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },

  handleSliderChange: function (event) {
    // 1.获取slider变化的值
    const value = event.detail.value

    // 2.计算需要播放的currentTime(value是百分比)
    const currentTime = this.data.durationTime * value / 100

    // 3.设置context播放currentTime位置的音乐
    // audioContext.pause()
    // 停止后的音频再从currentTime / 1000这个时间开始播放播放开始播放
    audioContext.seek(currentTime / 1000) // 单位s

    // 4.记录最新的sliderValue并且将isSliderChange设置回false
    this.setData({ sliderValue: value, isSliderChange: false })
  },

  handleSwiperChangeing: function (event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChange: true, currentTime })
  },

  handleBackClick: function() {
    wx.navigateBack()
  },

  handleModeBtnClick: function () {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex ===3) playModeIndex = 0

    // 设置playerStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex)
  },

  handlePlayBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },

  // 上一首
  handlePrevBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction", false)
  },

  // 下一首
  handleNextBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction", true)
  },

  handleCurrentMusicListener: function({
    currentSong,
    durationTime,
    lyricInfos
  }) {
    if (currentSong) this.setData({ currentSong })
    if (durationTime) this.setData({ durationTime })
    if (lyricInfos) this.setData({ lyricInfos })
  },

  // 数据监听
  setupPlayerStoreListener: function() {
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], this.handleCurrentMusicListener)

    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    // 3.监听播放模式相关的数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({ 
          playModeIndex, 
          playModeName: playModeNames[playModeIndex] 
        })
      }

      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? "pause": "resume" 
        })
      }
    })
  },

  onUnload: function () {
    playerStore.offStates(["currentSong", "durationTime", "lyricInfos"], this.handleCurrentMusicListener)
  }
})