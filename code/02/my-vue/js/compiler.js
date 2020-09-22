class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }

    // 编译模板，处理文本节点和元素节点
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                // 处理文本节点
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                // 处理元素节点
                this.compileElement(node)
            }
            // 判断 node 节点是否有子节点，如果有，要递归调用 compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    // 编译元素节点，处理指令
    compileElement(node) {
        const attributes = node.attributes
        // 遍历所有的属性节点
        // 判断是否是指令
        Array.from(attributes).forEach(attr => {
            let attrName = attr.name
            let key = attr.value
            if (this.isDirective(attrName)) {
                // 判断是否是指令
                // v-text --> text
                attrName = attrName.substr(2)
                if (attrName.startsWith('on')) {
                    // 事件更新
                    this.eventUpdate(node, key, attrName, /[on:\[\]]/g)
                } else {
                    this.update(node, key, attrName)
                }
            } else if (attrName.startsWith('@')) {
                // v-on 的缩写模式
                // 截取 attrName ，@click => click
                attrName = attrName.substr(1)
                // 事件更新
                this.eventUpdate(node, key, attrName, /[\[\]]/g)

            }

        })
    }

    eventUpdate(node, key, attrName, r) {
        // 获取事件名
        const reg = RegExp(r)
        if (reg.test(attrName)) {
            attrName = this.vm[attrName.replace(reg, '')] || attrName
        }
        // 获取事件名
        const event = attrName.replace(reg, '');
        this.onUpdater(node, key, event)
    }

    update(node, key, attrName) {
        let updateFn = this[`${attrName}Updater`];
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    // 处理 v-text 指令
    textUpdater(node, value, key) {
        node.textContent = value
        // 创建 watcher 对象，更新视图
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue
        })

    }

    // v-model
    modelUpdater(node, value, key) {
        node.value = value
        // 创建 watcher 对象，更新视图
        new Watcher(this.vm, key, newValue => {
            node.value = newValue
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    // v-html
    htmlUpdater(node, value, key) {
        // 1.判断是否是以 <xx 开头以及 /> 结尾的 标记为 html 串，准备处理
        // 2.判断是否是 {{}} // 调用处理差值表达式函数，对数据进行处理并赋值
        // 3.1、2都不是则认为是文本类型，直接输出即可。
        const expressionReg = /\{\{(.+?)\}\}/
        const htmlReg = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/
        if (htmlReg.test(value)) {
            node.innerHTML = value
            this.compile(node)
        } else if (expressionReg.test(value)) {
            node.innerHTML = value
            this.compileText(node)
            // let _key = RegExp.$1.trim()
            // node.textContent = value.replace(expressionReg, this.vm[_key])
        } else {
            // 处理文本节点
            node.textContent = value;
        }
        // 创建 watcher 对象，更新视图
        new Watcher(this.vm, key, newValue => {
            this.htmlUpdater(node, newValue, key)
        })

    }

    // v-on
    onUpdater(node, key, event) {
        // 监听 event
        node.addEventListener(event, (e) => {
            // 如果 vm 上找不到对应的方法名，则认为是行内模式
            if (this.vm[key]) {
                this.vm[key](e)
            } else {
                const newKey = key.split('(')[0]
                if (this.vm[newKey]) {
                    const reg = /\((.+?)\)/
                    if (reg.test(key)) {
                        const params = RegExp.$1.trim().split(',');
                        const newParams = [];
                        params.forEach(item => {
                            newParams.push(this.vm[item] || item || undefined)
                        })
                        this.vm[newKey].call(e, newParams.join(','))
                    }
                } else {
                    const fn = new Function(key)
                    fn()
                }
            }
        })
    }

    // 编译文本节点,处理差值表达式
    compileText(node) {
        // {{ msg }}
        const reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            // 创建 watcher 对象，更新视图
            new Watcher(this.vm, key, newValue => {
                node.textContent = newValue
            })
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }

    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}