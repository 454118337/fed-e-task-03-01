import {h, init, thunk} from 'snabbdom'

// 1. hello world
// patch 对比两个 vnode 的差异
let patch = init([])
// 第一个参数：标签 + 选择器
// 第二个参数；如果是字符串的话就是标签中的内容
let vnode = h('div', 'hello world')

const app = document.querySelector('#app');
// 第一个参数： 可以是 DOM 元素，内部会把 DOM 元素转换成 VNode
// 第二个参数；VNode
// 返回值： VNode
let oldVNode = patch(app, vnode)

// 假设的时刻
vnode = h('div', 'hello snabbdom')
patch(oldVNode, vnode)

// 2. div 中放置子元素 h1,p