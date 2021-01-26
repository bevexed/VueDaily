// 基类 调度
class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    let computed = options.computed;
    let methods = options.methods;
    // 根元素存在编译模板
    if (this.$el) {
      // 把数据全部转换成用 Object.defineProperty 来定义
      new Observer(this.$data)

      for (let key in computed) { // 有依赖关系
        if (computed.hasOwnProperty(key)) {
          Object.defineProperty(this.$data, key, {
            get: () => {
              return computed[key].call(this)
            },
            set(newVal) {
              computed[key] = newVal
            }
          })
        }

      }

      for (let key in methods) {
        Object.defineProperty(this, key, {
          get() {
            return methods[key]
          }
        })
      }

      // 把 vm 上的取值抄作都代理到 vm.$data
      this.proxyVm(this.$data)

      new Compiler(this.$el, this)
    }
  }

  proxyVm(data) {
    for (let key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          data[key] = newVal;
        }
      })
    }
  }
}

class Compiler {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);

    // 把当前节点中元素放到内存中去
    let fragment = this.node2fragment(this.el)

    this.vm = vm
    // 把节点中内容进行替换
    this.compile(fragment,)
    // 用数据编译模板

    // 把内容在塞回到页面中
    this.el.appendChild(fragment)
  }

  isElementNode(node) {
    return node.nodeType === 1;
  }

  node2fragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      // appendChild 具有移动性
      fragment.appendChild(firstChild)
    }
    return fragment
  }

  compile(node,) {
    let childNodes = node.childNodes;
    [...childNodes].forEach(child => {
      if (this.isElementNode(child)) {
        this.compileElement(child)
        // 如果是元素的话 需要递归
        this.compile(child)
      } else {
        this.compileText(child)
      }
    })
  }

  // 编译元素
  compileElement(node) {
    let attributes = node.attributes; // 类数组
    [...attributes].forEach(attr => {
      let { name, value: expr } = attr
      // 判断是不是指令
      if (this.isDirective(name)) {
        let [, directive] = name.split('-');
        let [directiveName, eventName] = directive.split(':');
        console.log(directiveName);
        // 调用不同的指令处理
        CompileUtil[directiveName](node, expr, this.vm, eventName)
      }
    })

  }

  // 编译文本
  compileText(node) {
    // 判断当前文本节点中是否包含 {{}}
    let content = node.textContent;
    const reg = /{{(.+?)}}/
    if (reg.test(content)) {
      console.log(content);
      CompileUtil['text'](node, content, this.vm)
    }
  }

  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
}

const CompileUtil = {
  getValue(vm, expr) {
    expr = expr.replace(/\s/g, '')

    let arr = expr.split('.')

    if (arr.length === 1) {
      return vm.$data[expr]
    }

    return arr.reduce((data, current) => data[current], vm.$data)
  },
  setValue(vm, expr, value) {
    expr.split('.').reduce((data, current, index, arr) => {
      if (index === arr.length - 1) {
        return data[current] = value
      }
      return data[current]
    }, vm.$data)
  },
  getContentValue(vm, expr) {
    const reg = /{{(.+?)}}/g
    return expr.replace(reg, (...args) => {
      return this.getValue(vm, args[1])
    })
  },
  /**
   * @desc 给输入框赋值 value 属性
   * @param node 节点
   * @param expr 表达式
   * @param vm   当前实例
   */
  model(node, expr, vm) {
    let fn = this.updater.modalUpdater
    // 给输入框加一个观察者，如果后面数据更新了会触发此方法
    new Watcher(vm, expr, newVal => {
      fn(node, newVal)
    })
    node.addEventListener('input', e => {
      let val = e.target.value
      this.setValue(vm, expr, val)
    })
    let value = this.getValue(vm, expr)
    fn(node, value)
  },
  html(node, expr, vm) {
    let fn = this.updater['htmlUpdater'];
    new Watcher(vm, expr, newVal => fn(node, newVal))
    let value = this.getValue(vm, expr)
    fn(node, value)
  },
  text(node, expr, vm) {
    const reg = /{{(.+?)}}/g
    let fn = this.updater.textUpdater
    let content = expr.replace(reg, (...args) => {

      // 给表达式每个人都加上观察者
      new Watcher(vm, args[1], newVal => {
        fn(node, this.getContentValue(vm, expr)) // 返回一个全的字符串
      })

      return this.getValue(vm, args[1])
    })
    fn(node, content)
  },

  on(node, expr, vm, eventName) {
    node.addEventListener(eventName, (e) => {
      vm[expr].call(vm, e)
    })
  },

  updater: {
    // 把数据插入到节点中去
    modalUpdater(node, value) {
      node.value = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value
    },
    textUpdater(node, value) {
      node.textContent = value
    }
  }
}

class Observer {
  constructor(data) {
    this.observer(data)
  }

  observer(data) {
    if (data && typeof data === 'object') {
      for (let key in data) {
        this.defineReactive(data, key, data[key])
      }
    }
  }

  defineReactive(obj, key, val) {
    this.observer(val)
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      get() {
        // 创建 watcher时 会取到对应的内容，并把 wathcer 放到全局上
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set: (newVal) => {
        if (val === newVal) {
          return
        }
        this.observer(newVal)
        val = newVal
        dep.notify()
      }
    })
  }
}

class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    // 默认先存放一个老值
    this.oldVal = this.get()
  }

  get(vm, expr) {
    // 把自己放在 this 上
    Dep.target = this;
    // 取值 把这个观察者和数据关联起来
    let value = CompileUtil.getValue(this.vm, this.expr);
    Dep.target = null;
    return value
  }

  update() {
    let newVal = CompileUtil.getValue(this.vm, this.expr)
    if (newVal !== this.oldVal) {
      this.cb(newVal)
    }
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }

  // 订阅
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 发布
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}


