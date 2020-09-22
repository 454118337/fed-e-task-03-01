import {h, init} from 'snabbdom'
// 1.导入模块
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'
// 2.注册模块
const patch = init([style, eventlisteners])
//
let vnode = h('div', {
    style: {
        backgroundColor: 'red'
    },
    on: {
        click: eventHandler
    }
}, [
    h('h1', '卧槽！无情！'),
    h('p', '信你个鬼')
])

function eventHandler() {
    console.log('卧槽')
}

let app = document.querySelector('#app')
patch(app, vnode)