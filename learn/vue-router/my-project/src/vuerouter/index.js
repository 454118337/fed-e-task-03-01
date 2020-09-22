let _vue = null;
export default class VueRouter {
    constructor(options) {
        this.options = options;
        this.routeMap = {};
        this.data = _vue.observable({
            current: '/'
        });//响应式对象
        // this.init();
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
        // 遍历路由规制，解析成键值对，存储到 routeMap 中
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    initComponents(vue) {
        const self = this
        vue.component('router-link', {
            props: {
                to: String,
            },
            // template: '<a :href="to"><slot></slot></a>'
            render(h) {
                return h('a', {
                    attrs: {
                        href: this.to,
                    },
                    on: {
                        click: this.clickHandler,
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler(e) {
                    history.pushState({}, '', this.to)
                    this.$route.data.current = this.to
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
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname
        })
    }

}