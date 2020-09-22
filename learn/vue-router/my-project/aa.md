+ VueRouter
- options  --记录构造函数中传入的对象，记录路由规则
- data     --current 记录当前路由地址，需要一个响应式的对象，
- routeMap --记录路由地址跟组件的关系，把路由规则解析到 Map 中
- Constructor(Options): VueRouter --
- _install(Vue): void             --实现 Vue 的插件机制
- init(): void                    --调用下面方法
- initEvent(): void               --注册 popstate 事件，监听浏览器历史的变化
- createRouteMap(): void          --初始化 routeMap 属性，把构造函数中传入的规则转换为键值对模式
- initComponents(Vue): void       --创建 routerLink、 routerView 主键
```vue
// router/index.js
// 注册插件
Vue.use(VueRouter)
// 创建路由对象
const router = new VueRouter({
    routes:[
        { name: 'home', path: '/', component: homeComponent }
    ]
})

// main.js
// 创建 Vue 实例， 注册 router 对象
new Vue({
    router,
    render: h => h(app)
}).$mount('#app)
```