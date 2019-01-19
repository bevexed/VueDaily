# Vue
> 渐进式的 JavaScript 框架

## 网站交互方式及开发方式

### 经典多页面
> 例如：京东
* 前后端揉和在一起，开发效率低
* 用户体验一般，点击刷新跳转，等待时间长
* 每个页面都需要重新加载，速度慢
* 有利于 `SEO` 搜索 （蜘蛛会爬链接）

### 单页面应用
> Single Page Application => SPA
> 例如：网易云音乐
* 前后端分离，开发效率高
  - 服务端不关心页面，只关心数据
  - 客户端不关心数据库及数据操作，只关心通过接口拿数据和服务端交互，处理页面
* 用户体验好，跳转页面无刷新
* 只需加载局部视图，无需整个页面重新加载
* 技术复杂，框架多
  - Angular
    - 09 年诞生
    - Google
    - 使开发单页面更加方便
    - `MVVM`（数据驱动视图） 开发方式
      - 数据驱动视图，不需要操纵DOM
  - ReactJS
    - Facebook 为自己开发的 `Web` 框架
    - 组件化
  - VueJS
    - 借鉴了 Angular 和 React 
    - 组件化
    - 渐进式
    - 通过 `指令` 扩展 HTML
    - 通过 `表达式` 绑定数据到 HTML
    - 最大程度上解放 `DOM` 操作
* 技术成熟，但是无法兼容 `低版本` 浏览器
* 除了 `电商` 网站，大部分都不需要兼容低版本浏览器
* 大部分兼容 `IE9` 以上
* 数据大多是异步加载，不利于搜索引擎搜索，不利于 `SEO` 优化
* 手机Web网页
* 管理系统

## 语法

### methods
- 不要用剪头函数
  - 会使 `this`  指向window
  
### computed
```js
// 访问时调用 get 方法
// 赋值时调用 set 方法
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

### watch
- 只能监视一层,深度监视
```js
watch:{
  c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
  // 该回调将会在侦听开始之后被立即调用
  d: {
    handler: function (val, oldVal) { /* ... */ },
    immediate: true
  }
}
```

### 自定义指令
> [文档](https://cn.vuejs.org/v2/guide/custom-directive.html)
> 当不可避免的要操作 DOM 时，用自定义指令
#### 注册
- 全局注册
```js
Vue.directive('指令明',{'钩子'})
// 每个钩子可以接受两个参数
// el 作用该指令的 DOM 对象
// bindling 一个对象，可以获取值等信息 例如 v-show = 'true' 
```
- 局部注册
```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```
#### 钩子
- 每个钩子可以接受两个参数
  - el 作用该指令的 DOM 对象
  - bindling 一个对象，可以获取值等信息 例如 v-show = 'true' 

##### bind
- 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
  
##### inserted
- 被绑定元素插入父节点时调用
- 如果需要操纵父节点，代码写在这里
  
##### update
- 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。
- 获取更新之前的指令所在的 `DOM` 的内容
  
##### componentUpdated
- 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- 获取更新之后的指令所在的 `DOM` 的内容

##### unbind
- 只调用一次，指令与元素解绑时调用。
#### 使用
- 驼峰命名法 大写字母 => -'小写字母'
```html
<a v-'指令明'></a>>
```



## 浏览器同步测试工具
### 安装
```bash
npm i browser-sync -D
```
### 配置
```json
{
"scripts":{
    "dev": "browser-sync start --server --files '*.css, *.html,*.js'"
  }
}
```

