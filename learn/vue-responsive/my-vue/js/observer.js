class Observer {
    constructor(data) {
        debugger
        this.walk(data)
    }

    walk(data) {
        debugger
        // 遍历 data 对象所有属性
        // 1.判断 data 是否是对象
        if (!data || typeof data !== 'object') return // ? Array 的 typeof 也是 object
        // 2.遍历 data 对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(data, key, value) {
        // 收集依赖，并发送通知
        let dep = new Dep();
        // 如果 value 是对象，把 value 中的属性也会设置成为响应式数据
        this.walk(value)
        const that = this;
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                //收集依赖
                Dep.target&& dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if (newValue === value) return
                value = newValue
                that.walk(newValue)
                // 发送通知
                dep.notify()
            }
        })
    }
}