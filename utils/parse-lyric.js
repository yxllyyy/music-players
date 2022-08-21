//正则(regular)表达式(expression)：字符串匹配利器

// [01:05.98]
// \d 代表数字
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
    const lyricStrings = lyricString.split("\n")
    
    const lyricInfos = []
    for (const lineString of lyricStrings) {
        // [01:05.98]为何孤独 不可 光荣
        const timeResult = timeRegExp.exec(lineString)
        if (!timeResult) continue
        // 1.获取时间
        const minute = timeResult[1] * 60 * 1000
        const second = timeResult[2] * 1000
        const millsecondTime = timeResult[3]
        const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
        const time = minute + second + millsecond
        
        
        // 2.获取歌词文本
        const text = lineString.replace(timeRegExp, "")
        lyricInfos.push({ time, text })
    }

    return lyricInfos
}