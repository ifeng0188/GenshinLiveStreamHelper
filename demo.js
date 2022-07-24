// ==UserScript==
// @name         原神直播活动抢码
// @namespace    https://github.com/ifeng0188
// @version      1.1
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
// @downloadURL  https://raw.githubusercontent.com/ifeng0188/GenshinLiveBroadcastCDK/main/demo.js
// @updateURL    https://raw.githubusercontent.com/ifeng0188/GenshinLiveBroadcastCDK/main/demo.js
// @license      GPL-3.0 license
// ==/UserScript==

(function () {
    'use strict';

    // 自定义配置
    const config = {
        // 哪一天的直播奖励(3,5,10,20,30,40)
        dayNum: 10,
        // 是否第二批(B站专用)
        second_batch: true,
    }

    const index = {
        3: 0,
        5: 1,
        10: 2,
        20: 3,
        30: 4,
        40: 5,
    }

    console.info('【原神直播活动抢码】配置加载完毕')

    let href = location.href
    let site, el_selector, hour
    if (href.includes('bilibili')) {
        site = 'bili'
        el_selector = '.exchange-button'
        if (config.second_batch == true) {
            hour = 23
        } else {
            hour = 1
        }
    } else if (href.includes('huya')) {
        site = 'huya'
        el_selector = '.J_getLevelAward'
        hour = 1
    } else if (href.includes('douyu')) {
        site = 'douyu'
        el_selector = '.wmTaskV3GiftBtn-btn'
        hour = 1
    }

    console.info(`【原神直播活动抢码】计划于${hour}点59分58秒开始领取第${config.dayNum}天的直播奖励（如有误请自行修改配置）`)

    let receive_loop = () => {
        if (site == 'huya') {
            setInterval(() => {
                let exp_btn = document.querySelectorAll('div[title="10经验值"]+button')[0]
                exp_btn.click()
            }, 100)
        }
        setInterval(() => {
            let exchange_btn = (site == 'bili' ? document.querySelectorAll(el_selector)[0] : document.querySelectorAll(el_selector)[index[config.dayNum]])
            exchange_btn.click()
        }, 100)
    }

    let timer = setInterval(() => {
        let date = new Date()
        if (date.getHours() == hour && date.getMinutes() == 59 && date.getSeconds() >= 58) {
            console.info('【原神直播活动抢码】开始循环点击领取按钮')
            receive_loop()
            clearInterval(timer)
        }
    }, 100)
})();