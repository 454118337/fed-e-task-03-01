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
            // 判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // v-text --> text
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        let updateFn = this[`${attrName}Updater`]
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