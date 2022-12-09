// ==UserScript==
// @name         原神直播活动抢码助手
// @namespace    https://github.com/ifeng0188
// @version      3.3
// @description  一款用于原神直播活动的抢码助手，支持哔哩哔哩、虎牙、斗鱼多个平台的自动抢码，附带一些页面优化功能 注意：使用之前请先修改配置，斗鱼平台需要手动完成一次滑块验证码（如果没弹就不用理）
// @author       ifeng0188
// @match        *://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @match        *://zt.huya.com/*/pc/index.html
// @match        *://www.douyu.com/topic/ys*
// @icon         https://ys.mihoyo.com/main/favicon.ico
// @grant        unsafeWindow
// @grant        GM_log
// @homepageURL  https://github.com/ifeng0188/GenshinLiveStreamHelper
// @supportURL   https://github.com/ifeng0188/GenshinLiveStreamHelper/issues
// @downloadURL  https://raw.fastgit.org/ifeng0188/GenshinLiveStreamHelper/main/demo.js
// @updateURL    https://raw.fastgit.org/ifeng0188/GenshinLiveStreamHelper/main/demo.js
// @license      GPL-3.0 license
// ==/UserScript==

; (function () {
  'use strict'

  // 用户设置（需自行修改）
  let userSetting = {
    // >>>净化类<<<
    // 虎牙平台页面加载完成后，自动展开里程碑选项卡
    purify_huya_autoExpand: true,
    // 斗鱼平台页面加载完成后，移除活动页面的直播画面，让页面更流畅
    purify_douyu_removeLiveStream: true,
    // 斗鱼平台页面加载完成后，自动展开里程碑选项卡
    purify_douyu_autoExpand: true,

    // >>>抢码类<<<
    // 里程碑奖励等级 [0-5] 对应第1-6档 PS：里程碑天数从小到大
    level: 0,
    // 开始抢码时间 PS：针对隔天补货等特殊情况的特殊处理
    // hour 时 [0-23]
    // minute 分 [0-59]
    // second 秒 [0-59]
    start_time: {
      hour: 1,
      minute: 59,
      second: 59,
    },
    // 领取间隔时间（单位：毫秒 1000毫秒=1秒） PS：顺带一提，某站抢码会提示繁忙，但是这个繁忙是指服务器繁忙，一般不需要增加间隔时间
    interval: 100,
  }

  let platform = (function () {
    if (location.href.includes('bilibili')) return '哔哩哔哩'
    if (document.title.includes('原神')) {
      if (location.href.includes('huya') && document.title.includes('直播季')) return '虎牙'
      if (location.href.includes('douyu') && document.title.includes('领原石')) return '斗鱼'
    }
    return ''
  })()

  // 移除元素
  let clearElement = (el) => {
    el.parentNode.removeChild(el)
  }

  // 输出日志
  let outputLog = (msg) => {
    console.info('【原神直播活动抢码助手】' + msg)
  }

  // 净化功能
  let purify = () => {
    if (platform == '虎牙' && userSetting.purify_huya_autoExpand) {
      document.querySelectorAll('.J_item')[1].click()
    }
    if (platform == '斗鱼') {
      if (userSetting.purify_douyu_removeLiveStream || userSetting.purify_douyu_autoExpand) {
        let timer = setInterval(() => {
          if (document.querySelectorAll('#bc54')[0]) {
            clearInterval(timer)
            if (userSetting.purify_douyu_removeLiveStream) clearElement(document.querySelectorAll('#bc3')[0].parentNode)
            if (userSetting.purify_douyu_autoExpand) document.querySelectorAll('#bc54')[0].click()
          }
        }, 1000)
      }
    }
  }

  // 抢码功能
  let exchange = () => {
    let receive_loop = () => {
      // 虎牙领经验
      if (platform == '虎牙') {
        setInterval(() => {
          document.querySelectorAll('div[title="10经验值"]+button')[0].click()
          document.querySelectorAll('.exp-award .reload')[0].click()
        }, userSetting.interval)
      }
      // 抢原石
      setInterval(() => {
        let exchangeBtn = (function () {
          switch (platform) {
            case '哔哩哔哩':
              return document.querySelectorAll('.exchange-button')[0]
            case '虎牙':
              return document.querySelectorAll('.exp-award li button')[userSetting.level]
            case '斗鱼':
              return document.querySelectorAll('.wmTaskV3GiftBtn-btn')[userSetting.level]
          }
        })()
        exchangeBtn.click()
      }, userSetting.interval)
    }

    // 设置定时任务
    let st_hour = userSetting.start_time.hour
    let st_minute = userSetting.start_time.minute
    let st_second = userSetting.start_time.second
    outputLog(`助手计划于${st_hour}点${st_minute}分${st_second}秒开始领取第${userSetting.level + 1}档的直播奖励（如有误请自行修改配置）`)
    let timer = setInterval(() => {
      let date = new Date()
      if (date.getHours() == st_hour && date.getMinutes() == st_minute && date.getSeconds() >= st_second) {
        clearInterval(timer)
        outputLog('助手开始领取，如若出现数据异常为正常情况')
        receive_loop()
      }
    }, 100)
  }

  // Run
  if (platform) {
    outputLog(`当前直播平台为${platform}，助手开始运行`)
    if (platform == '虎牙' && !userSetting.purify_huya_autoExpand) outputLog('★请手动打开里程碑页面★')
    if (platform == '斗鱼' && !userSetting.purify_douyu_autoExpand) outputLog('★请手动打开里程碑页面，并通过领取其他奖励，完成一次验证码★')
    purify()
    exchange()
    outputLog('感谢你的使用，如本项目对你有帮助可以帮忙点个Star')
    outputLog('https://github.com/ifeng0188/GenshinLiveStreamHelper')
  } else {
    outputLog('检测到当前非原神直播活动页面，助手已休眠')
  }
})()
