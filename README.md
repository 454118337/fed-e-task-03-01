# 模块一：手写 Vue Router、手写响应式实现、虚拟 DOM 和 Diff 算法

## 简答题

### 一、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，他的内部原理是什么。

```
let vm = new Vue({
	el: '#el',
	data: {
		o: 'object',
		dog: {}
	},
	method: {
		clickHandler () {
			// 该 name 属性是否是响应式的
			this.dog.name = 'Trump'
		}
	}
})
```

解：

不是响应式数据。响应式对象和响应式数组是指在vue初始化时期，利用Object.defineProperty()方法对其进行监听，这样在修改数据时会及时体现在页面上。

给 dog 的属性 name 设置一个初始值，可以为空字符串或者 undefined 之类的，即可将新增成员设为响应式数据。

原因：vm[key] setter 操作的时候会触发 data[key] 的 setter 操作，data[key] 的 setter 操作会 walk 这个新的值（walk方法是给data里的对象类型的值设置响应式），而题目中的 data 的 dog 是个空对象，没有任何属性，所以初始化 Vue 实例的时候，在给 dog 设置 proxy 的时候没有任何属性有 getter 和 setter 方法，所以在点击按钮动态的给 dog 添加 name 属性，并设置值的时候是不会触发 dog 对象下的属性 name 的 setter 方法，故不是响应式数据。而给 dog 对象添加了 name 的初始值后，dog 对象的 name 属性就有了 getter 和 setter 方法，故可以实现响应式

### 二、请简述 Diff 算法的执行过程

解：

diff 的过程就是调用名为 patch 的函数，比较新旧节点，一边比较一边给真实的 DOM 打补丁。
patch 函数接收两个参数 oldVnode 和 Vnode 分别代表
新的节点和之前的旧节点,这个函数会比较 oldVnode 和 vnode 是否是相同的, 即函数 sameVnode(oldVnode, vnode)

1. 老节点不存在，直接添加新节点到父元素
2. 新节点不存在，从父元素删除老节点。
3. 新老节点都存在
   1.  判断是否是相同节点（根据key、tag、isComment、data同时定义或不定义）相同直接返回，不是相同节点如果新老节点都是静态的，且key相同。
      从老节点拿过来，跳过比对的过程。
      如果新节点是文本节点，设置节点的text，新节点不是文本节点。新老节点子节点都存在且不同，使用updateChildren函数来更新子节点
      只有新节点字节点存在，如果老节点子节点是文本节点，删除老节点的文本，将新节点子节点插入
      只有老节点存在子节点，删除老节点的子节点
   2.  updateChildren
      给新老节点定义开始、结束索引
      循环比对新节点开始VS老节点开始、新节点结束VS老节点结束、新节点开始VS老节点结束、新节点结束VS老节点开始并移动对应的索引，向中间靠拢
      根据新节点的key在老节点中查找，没有找到则创建新节点。
      循环结束后，如果老节点有多的，则删除。如果新节点有多的，则添加。

**当 oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx 时，执行如下循环判断：**

1. oldStartVnode 为 null，则 oldStartVnode 等于 oldCh 的下一个子节点，即 oldStartVnode 的下一个兄弟节点
2. oldEndVnode 为 null, 则 oldEndVnode 等于 oldCh 的相对于 oldEndVnode 上一个子节点，即 oldEndVnode 的上一个兄弟节点
3. newStartVnode 为 null，则 newStartVnode 等于 newCh 的下一个子节点，即 newStartVnode 的下一个兄弟节点
4. newEndVnode 为 null, 则 newEndVnode 等于 newCh 的相对于 newEndVnode 上一个子节点，即 newEndVnode 的上一个兄弟节点
5. oldEndVnode 和 newEndVnode 为相同节点则执行 patchVnode(oldStartVnode, newStartVnode)，执行完后 oldStartVnode 为此节点的下一个兄弟节点，newStartVnode 为此节点的下一个兄弟节点
6. oldEndVnode 和 newEndVnode 为相同节点则执行 patchVnode(oldEndVnode, newEndVnode)，执行完后 oldEndVnode 为此节点的上一个兄弟节点，newEndVnode 为此节点的上一个兄弟节点
7. oldStartVnode 和 newEndVnode 为相同节点则执行 patchVnode(oldStartVnode, newEndVnode)，执行完后 oldStartVnode 为此节点的下一个兄弟节点，newEndVnode 为此节点的上一个兄弟节点
8. oldEndVnode 和 newStartVnode 为相同节点则执行 patchVnode(oldEndVnode, newStartVnode)，执行完后 oldEndVnode 为此节点的上一个兄弟节点，newStartVnode 为此节点的下一个兄弟节点
9. 使用 key 时的比较：
       oldKeyToIdx为未定义时，由 key 生成 index 表，具体实现为 createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)，

## 编程题

### 一、模拟 VueRouter 的 hash 模式实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

解：

hash 路由模式是这样的：http://xxx.abc.com/#/xx。 有带 # 号，后面就是 hash 值的变化。改变后面的 hash 值，它不会向服务器发出请求，因此也就不会刷新页面。并且每次 hash 值发生改变的时候，会触发 hashchange 事件。因此我们可以通过监听该事件，来知道 hash 值发生了哪些变化。

通过 router 实例的参数中 mode 的值进行判断需要使用哪种模式，默认为 hash 模式。在构造函数中，需要先对 router 进行适配，以适应 hash 模式下localhost:8080/ 的情况，以及 history 模式下 localhost:8080/#/  的情况。创建 data 响应式对象时，根据 mode 的值设置不同的初始值。创建 routerMap 时，需要以 hash 的模式拼接 router 组成 key，如  `routerMap['/#/aaa']`  ，创建 router-link 时，href 以及 click 事件中都需对应修改为 mode 相对于模式。最后通过监听 hashchange 来修改 data.current 的值。

源码地址：\fed-e-task-03-01\code\01\my-project\src\vuerouter\index.js

### 二、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

解：

1.v-html 指令

> 更新元素的 `innerHTML`。**注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译**。如果试图使用 `v-html` 组合模板，可以重新考虑是否通过使用组件来替代。

以上是官网详细描述，简而言之，及 v-html 将用来处理html 字符串的。`"<p>这是一段 html 字符串</p>"`

既然是 html 那么存在的值有文本、数字、html，以上的值皆可能存在差值表达式。所有实现思路如下:

1. 如果 value 中能匹配到标签时，则 value 为包含 html 的字符串，将 `node.innerHTML =value` ，再调用 `compile` 方法，传入 node
2. 判断是否包含差值表达式 `{{}}` ，如果有则 调用 `compileText` 方法，传入 node
3. 以上两者皆为 false 时，则为文本，直接写入即可
4. 创建 watcher 对象，有新 value 时，则再调用 `htmlUpdater` 

在写思路时，边写边思考对比，发现其实只需要 `node.innerHtml = value;this.compile(node)` 即可。

```
// v-html
htmlUpdater(node, value, key) {
	node.innerHTML = value
	this.compile(node)
	// 创建 watcher 对象，更新视图
	new Watcher(this.vm, key, newValue => {
		this.htmlUpdater(node, newValue, key)
	})
}
```

源码地址：\fed-e-task-03-01\code\02\my-vue

ps:源码中未将 htmlUpdater 修改为以上方式，保留旧思路



2.v-on 指令

> 绑定事件监听器。事件类型由参数指定。表达式可以是一个方法的名字或一个内联语句

v-on 是用来绑定事件监听的，模仿官方的行内模式及方法名以及缩写模式，实现思路如下

1. 在创建 vue 实例时，增加一个参数 `methods` 用于存放函数
2. 在 vue 类中，增加 `_proxyMethods` 方法，用于处理 `methods` 将 `methods`  成员注入 vue 实例中，以便使用时获取
3. 在处理指令时，判断是否是 on 开头或者是否是 @ 开头，是则为 v-on 指令
4. 获取并监听对应的事件名
5. 判断 key 是否在 vm 中存在，存在则为函数，不存在则为行内或者是带参数的函数调用
6. 为函数时，直接调用函数
7. 通过分割获取括号前的字符串，在判断是否在 vm 中存在，存在则解析括号内内容，调用函数并传参
8. 不存在则为行内语句，通过创建一个新的构造函数，并执行。

源码地址：\fed-e-task-03-01\code\02\my-vue



### 三、参考 Snabbdom 提供的电影列表的示例，利用 Snabbdom 实现类似的效果

解：

实现过程：

1. 导入 snabbdom 及模块 styleModule、eventListenersModule
2. 初始化 snabbdom 获取 patch 函数
3. 创建基础数据 data
4. 创建函数 creationDom ，返回通过 h 函数将 dom 初步实现，并使用变量 vnode 记录
5. 将 h 函数构建的 dom 替换#app 
6. 创建 add 函数，实现对数据的添加，调用 creationDom  函数，获取新的 vnode 对象，调用 patch 将新旧 vnode 对比并渲染
7. 创建 sort 函数，实现对数据中的 age 属性排序，调用 creationDom  函数，获取新的 vnode 对象，调用 patch 将新旧 vnode 对比并渲染
8. 修改简化代码，抽取 add 函数及 sort 函数中[调用 creationDom  函数，获取新的 vnode 对象，调用 patch 将新旧 vnode 对比并渲染]抽取到 render 函数中，接收参数 data
9. 创建 del 函数，实现对数据的删除，del 函数接收参数 id ，通过 findIndex 方法获取 id 在 data 中对应的下标，并调用 render 函数。简单的说明：之所以传入 id 而不是直接传入 index ，是为了往后的拓展性。PS：在使用 on 中的 click 属性传入 [del, id] 时，在最新版本获取不到 id ，回退版本进行编写。
10. 修改监听 DOMContentLoaded 使页面 dom 渲染完成后进行 vnode 的生成替换
11. 在列表中添加 style 属性，使用 style 属性中的 delayed 属性，添加入场动画
12. 在列表中添加 style 属性，使用 style 属性中的 remove属性，添加入场动画
13. 使用 hooks 中的 insert 属性，在元素插入 DOM 时获取该元素的 offsetHeight ，用于计算出入场动画的偏移值
14. 在 render 函数中，计算 data 各个元素的偏移量并记录



源码地址：\fed-e-task-03-01\code\03