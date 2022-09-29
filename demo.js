// ==UserScript==
// @name         原神直播活动抢码助手
// @namespace    https://github.com/ifeng0188
// @version      3.1.1
// @description  一款用于原神直播活动的抢码助手，支持哔哩哔哩、虎牙、斗鱼多个平台的自动抢码，附带一些页面优化功能 注意：使用之前请先修改配置，斗鱼平台需要手动完成一次滑块验证码（如果没弹就不用理）
// @author       ifeng0188
// @match        *://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @match        *://zt.huya.com/*/pc/index.html
// @match        *://www.douyu.com/topic/ys*
// @icon         https://ys.mihoyo.com/main/favicon.ico
// @grant        unsafeWindow
// @grant        GM_log
// @homepageURL  https://github.com/ifeng0188/GenshinLiveBroadcastCDK
// @supportURL   https://github.com/ifeng0188/GenshinLiveBroadcastCDK/issues
// @downloadURL  https://raw.fastgit.org/ifeng0188/GenshinLiveBroadcastCDK/main/demo.js
// @updateURL    https://raw.fastgit.org/ifeng0188/GenshinLiveBroadcastCDK/main/demo.js
// @license      GPL-3.0 license
// ==/UserScript==

;(function () {
  'use strict'

  // 用户设置（需自行修改）
  let userSetting = {
    // 虎牙 - 加载后自动展开里程碑
    HuYa_AutoExpand: true,
    // 斗鱼 - 净化活动页面的直播画面，让页面更流畅
    DouYu_PurifyLBFrame: true,
    // 斗鱼 - 加载后自动展开里程碑
    Douyu_AutoExpand: true,

    // 里程碑奖励等级[0-5] 第1-6档（里程碑天数从小到大）
    level: 0,
    // 是否为补货兑换(仅平台为B站时才有效，将运行时间调整为0点)
    replenishment: false,
  }

  // 获取平台
  let platform = (function () {
    if (location.href.includes('bilibili')) {
      return '哔哩哔哩'
    }
    if (document.title.includes('原神')) {
      if (location.href.includes('huya') && document.title.includes('直播季')) {
        return '虎牙'
      } else if (location.href.includes('douyu') && document.title.includes('领原石')) {
        return '斗鱼'
      }
    }
    return ''
  })()

  // 移除元素
  let clearElement = (el) => {
    el.parentNode.removeChild(el)
  }

  // 净化功能
  let purify = () => {
    if (platform == '虎牙' && userSetting.HuYa_AutoExpand) {
      document.querySelectorAll('.J_item')[1].click()
    }
    if (platform == '斗鱼') {
      if (userSetting.DouYu_PurifyLBFrame || userSetting.Douyu_AutoExpand) {
        // 等待里程碑加载完成
        let timer = setInterval(() => {
          if (document.querySelectorAll('#bc54')[0]) {
            clearInterval(timer)
            if (userSetting.DouYu_PurifyLBFrame) clearElement(document.querySelectorAll('#bc3')[0].parentNode)
            if (userSetting.Douyu_AutoExpand) document.querySelectorAll('#bc54')[0].click()
          }
        }, 1000)
      }
    }
  }

  // 循环领取原石CDK
  let receive_loop = () => {
    // 虎牙额外增加一个循环领取通行证经验
    if (platform == '虎牙') {
      setInterval(() => {
        document.querySelectorAll('div[title="10经验值"]+button')[0].click()
      }, 100)
    }
    setInterval(() => {
      let exchangeBtn = (function () {
        switch (platform) {
          case '哔哩哔哩':
            return document.querySelectorAll('.exchange-button')[0]
          case '虎牙':
            return document.querySelectorAll('.awards-box li button')[userSetting.level]
          case '斗鱼':
            return document.querySelectorAll('.wmTaskV3GiftBtn-btn')[userSetting.level]
          default:
            break
        }
      })()
      exchangeBtn.click()
    }, 100)
  }

  // 抢码功能
  let exchange = () => {
    // 抢码初始化
    let hour
    if (platform == '哔哩哔哩' && userSetting.replenishment) {
      hour = 23
    } else {
      hour = 1
    }
    if (platform == '虎牙' && !userSetting.HuYa_AutoExpand) {
      console.info('【原神直播活动抢码助手】★请手动打开里程碑页面★')
    }
    if (platform == '斗鱼' && !userSetting.Douyu_AutoExpand) {
      console.info('【原神直播活动抢码助手】★请手动打开里程碑页面，并通过领取其他奖励，完成一次验证码★')
    }

    // 设置定时任务
    console.info(
      `【原神直播活动抢码助手】助手计划于${hour}点59分58秒开始领取第${
        userSetting.level + 1
      }档的直播奖励（如有误请自行修改配置）`
    )
    let timer = setInterval(() => {
      let date = new Date()
      if (date.getHours() == hour && date.getMinutes() == 59 && date.getSeconds() >= 58) {
        clearInterval(timer)
        console.info('【原神直播活动抢码助手】助手开始领取，如若出现数据异常为正常情况')
        receive_loop()
      }
    }, 100)
  }

  // Run
  if (platform) {
    console.info(`【原神直播活动抢码助手】当前直播平台为${platform}，助手开始运行`)
    purify()
    exchange()
    console.info('【原神直播活动抢码助手】感谢你的使用，如本项目对你有帮助可以帮忙点个Star')
    console.info('https://github.com/ifeng0188/GenshinLiveBroadcastCDK')
  } else {
    console.info('【原神直播活动抢码助手】检测到当前非原神直播活动页面，助手已休眠')
  }
})()
