import {init, h} from 'snabbdom'
import styleModule from 'snabbdom/modules/style'
import eventListenersModule from 'snabbdom/modules/eventlisteners'



import Mock from 'mockjs'

const patch = init([eventListenersModule, styleModule]);
let vnode;
// 初始化 data
let data = [];
data.push(creationData());
// 创建 vnode
function creationDom(data) {
    return h('div.page-box', [
        h('div.page-head', [
            h('button.btn.add', {
                on: {
                    click: add
                }
            }, '新增'),
            h('button.btn.sort', {
                on: {
                    click: sort
                }
            }, '排序'),
        ]),
        h('div.page-body', [
            h('ul', data.map((item, index) => {
                return h('li.item-box', {
                    key: item.id,
                    style: {
                        opacity: 0,
                        transform: 'translateY(0px)',
                        delayed: {
                            opacity: 1,
                            transform: `translateY(${item.offsetTop }px)`
                        },
                        remove: {
                            opacity: 0,
                            transform: `translateY(${item.offsetTop }px) translateX(-200px)`
                        }
                    },
                    hook: {
                        insert: function (vnode) {
                            item.eleHeight = vnode.elm.offsetHeight;
                        }
                    }
                }, [
                    h('span', `序号：${index + 1}`),
                    h('span', `名字：${item.name}`),
                    h('span', `年龄：${item.age}`),
                    h('span.del', {
                        on: {
                            click: [del, item.id]
                        }
                    }, 'x'),
                ])
            }))
        ])
    ]);
}
// 更新页面
function render(data) {
    data = data.reduce(function (arr, c) {
        // 获取 data 对应的 vnode 的 offsetTop 以便计算偏移值，形成动画
        const last = arr[arr.length - 1];
        c.offsetTop = last ? (last.offsetTop + last.eleHeight + 12) : 12;
        return arr.concat(c);
    }, []);
    vnode = patch(vnode, creationDom(data));
}
// 新增
function add() {
    data.push(creationData());
    render(data);
}
// 排序，按年龄排序
function sort() {
    data.sort((a, b) => a.age - b.age);
    render(data);

}
// 删除
function del(id, event, node) {
    const index = data.findIndex(item => item.id === id)
    data.splice(index, 1)
    render(data)
}
// 创建数据
function creationData() {
    return Mock.mock(
        {
            "id|+1": data.length + 1 || 1,
            "name": '@cname()',     //名字
            "age|1-100": 100,          //年龄(1-100)
        }
    );
}
// 监听 DOMContentLoaded
window.addEventListener('DOMContentLoaded', function () {
    const app = document.querySelector('#app');
    vnode = patch(app, creationDom(data));//第一次渲染，h函数的生成的DOM替换掉app，vnode纪录此次的h结构体。
    render(data);//第二次渲染，用vnode(上一次的结构体)和新的结构体比较
});



