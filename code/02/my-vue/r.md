## Vue 
+ 功能
    + 负责接受初始化的参数（选项）
    + 负责把 data 中的属性注入到 Vue 实例，转换成 getter/setter
    + 负责调用 observer 监听 data 中所有属性的变化
    + 负责调用 compiler 解析指令/差值表达式
+ 结构
    ```js
  Vue ={
      $options,
      $el,
      $data,
      _proxyData(),
    }
  
  ```
## Observer
+ 功能
    + 负责把 data 选项中的属性转换成响应式数据
    + data 中的某个属性也是对象，把该属性转换成响应式数据
    + 数据变化发生通知
+ 结构
    ```js
  Observer = {
      walk(data),
      defineReactive(data,key,value)
    }
  ```

## Compiler
+ 功能
    + 负责编译模板，解析指令/差值表达式
    + 负责页面的首次渲染
    + 当数据变化后重新渲染视图
+ 结构
    ```js
  Compiler = {
      el,
      vm,
      compile(el),
      compileElement(node),
      compileText(node),
      isDirective(attrName),
      isTextNode(node),
      isElementNode(node)
  }
  ```
 ## Dep( Dependency )
 + 功能
    + 收集依赖，添加观察者（watcher）
    + 通知所有观察者
    
    
 ```js
    Dep ={
        subs,
        addSub(sub){},
        notify(){}
    }
 ```

## Watcher

+ 功能
    + 当数据变化触发依赖，dep 通知所有的 Watcher 实例更新视图
    + 自身实例化的时候往 dep 对象中添加自己
    
```js
    Watcher = {
        vm,
        key,
        cb,
        oldValue,
        update(),
    }
```







