// ==UserScript==
// @name         原神直播活动抢码
// @namespace    https://github.com/ifeng0188
// @version      1.2
// @description  当前脚本适用于2.8版本，支持哔哩哔哩、虎牙、斗鱼多个平台 注意：使用之前请先修改配置，斗鱼平台需要手动完成一次滑块验证码（如果没弹就不用理）
// @author       ifeng0188
// @match        *://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @match        *://zt.huya.com/23707/pc/index.html
// @match        *://www.douyu.com/topic/ys28
// @icon         https://ys.mihoyo.com/main/favicon.ico
// @grant        unsafeWindow
// @grant        GM_log
// @homepageURL  https://github.com/ifeng0188/GenshinLiveBroadcastCDK
// @supportURL   https://github.com/ifeng0188/GenshinLiveBroadcastCDK/issues
// @downloadURL  https://ghproxy.com/raw.githubusercontent.com/ifeng0188/GenshinLiveBroadcastCDK/main/demo.js
// @updateURL    https://ghproxy.com/raw.githubusercontent.com/ifeng0188/GenshinLiveBroadcastCDK/main/demo.js
// @license      GPL-3.0 license
// ==/UserScript==

class GenshinLiveBroadcastCDK {
    constructor() {
        // 自定义配置(需手动修改)
        this.settings = {
            // 奖励等级 0-第3天 1-第5天 2-第10天 3-第20天 4-第30天 5-第40天
            level: 0,
            // 是否为补货兑换(仅平台为B站时才有效，将运行时间调整为0点)
            replenishment: true
        }

        let href = location.href
        if (href.includes('bilibili')) {
            this.platform = 0
        } else if (href.includes('huya')) {
            console.info(`【原神直播活动抢码】检测到当前为虎牙平台，请打开里程碑页面`)
            this.platform = 1
        } else if (href.includes('douyu')) {
            console.info(`【原神直播活动抢码】检测到当前为斗鱼平台，请打开里程碑页面，并通过领取其他奖励，完成一次验证码`)
            this.platform = 2
        }

        if (this.settings.replenishment && this.platform == 0) {
            this.hour = 23
        } else {
            this.hour = 1
        }
    }

    getElement() {
        switch (this.platform) {
            case 0:
                return document.querySelectorAll('.exchange-button')[0]
            case 1:
                return document.querySelectorAll('.awards-box li button')[this.settings.level]
            case 2:
                return document.querySelectorAll('.wmTaskV3GiftBtn-btn')[this.settings.level]
            default:
                break;
        }
    }
}


(function () {
    'use strict';

    let obj = new GenshinLiveBroadcastCDK

    console.info(`【原神直播活动抢码】计划于${obj.hour}点59分58秒开始领取第${obj.settings.level + 1}档的直播奖励（如有误请自行修改配置）`)

    // 循环领取原石CDK
    let receive_loop = () => {
        // 虎牙平台 循环领取通行证经验
        if (obj.platform == 1) {
            setInterval(() => {
                document.querySelectorAll('div[title="10经验值"]+button')[0].click()
            }, 100)
        }

        setInterval(() => {
            obj.getElement().click()
        }, 100)
    }

    // 监控时间
    let timer = setInterval(() => {
        let date = new Date()
        if (date.getHours() == obj.hour && date.getMinutes() == 59 && date.getSeconds() >= 58) {
            console.info('【原神直播活动抢码】开始领取，如若出现数据异常为正常情况')
            receive_loop()
            clearInterval(timer)
        }
    }, 100)
})();