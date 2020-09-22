let _vue = null;
export default class VueRouter {
    constructor(options) {
        this.options = options;
        this.routeMap = {};
        this.data = _vue.observable({
            current: this.options.mode === 'history' ? '/' : '/#/'
        });//响应式对象
        // this.init();
        if (this.options.mode !== 'history') {
            history.pushState({}, '', `/#/`)
        } else {
            history.pushState({}, '', `/`)
        }

    }

    static install(Vue) {
        // 1. 判断当前插件是否已经被安装
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true;
        // 2. 把 Vue 构造函数记录到全局变量
        _vue = Vue;
        // 3.把创建 Vue 实例的时候传入的 router 对象注入到 vue 实例上
        // 混入 在所有插件中可以在 vue 实例混入一个选项
        _vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _vue.prototype.$route = this.$options.router;
                    this.$options.router.init();
                }
            }
        })
    }

    init() {
        this.createRouteMap();
        this.initComponents(_vue);
        this.initEvent()
    }

    createRouteMap() {
        const isHistory = this.options.mode === 'history'
        // 遍历路由规制，解析成键值对，存储到 routeMap 中
        this.options.routes.forEach(route => {
            this.routeMap[isHistory ? route.path : `/#${route.path}`] = route.component
        })
    }

    initComponents(vue) {
        const self = this
        const isHistory = self.options.mode === 'history'
        vue.component('router-link', {
            props: {
                to: String,
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: isHistory ? this.to : `/#${this.to}`,
                    },
                    on: {
                        click: this.clickHandler,
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler(e) {
                    history.pushState({}, '', isHistory ? this.to : `/#${this.to}`)
                    this.$route.data.current = isHistory ? this.to : `/#${this.to}`
                    e.preventDefault();
                }
            }
        })
        vue.component('router-view', {
            render(h) {
                const component = self.routeMap[self.data.current];
                return h(component);
            }
        })
    }

    initEvent() {
        const isHistory = this.options.mode === 'history'
        window.addEventListener((isHistory ? 'popstate' : 'hashchange'), () => {
            this.data.current = `${isHistory ? '' : '/'}${window.location[isHistory ? 'pathname' : 'hash']}`
        })
    }

}