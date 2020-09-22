import {h, init} from 'snabbdom'

let patch = init([])

let vnode = h('div#container', [
    h('h1', 'Hello Snabbdom'),
    h('p', '这是一个P')
])

const app = document.querySelector('#app')

let oldVNode = patch(app, vnode);

setTimeout(() => {
    vnode = h('div#container', [
        h('h1', 'Hello World'),
        h('p', '这是一个Pp')
    ])
    patch(oldVNode, vnode)

    // 清空页面元素
    setTimeout(()=>{
        patch(oldVNode,h('!'))
    },2000)

}, 2000)