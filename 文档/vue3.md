## vue3 响应式

### 数据结构
- 利用 全局 WeakMap 来保存所有对象 -> targetMap 
- 利用 Map 来保存对象中所有 key -> depsMap 
- 利用 Set 来保存 key 中的依赖 -> dep 
- 响应式到底干了什么呢？
  - 众所周知v3的响应式有两种，一种是ref一种是reactive，ref是用来绑基本数据类型，reactive用来绑对象，但ref它其实可以绑万物，
  reactive能做的ref都能做，因为绑对象的时候ref会调reactive用proxy绑，基本数据类型的话用的是Object.defineProperty()。
  - reactive用的是Proxy。这里面到底是怎么做的呢
  - proxy里有一个get方法和set方法，get里调的是track，set里调的是trigger。
  - track就是用来依赖收集的，首先把传入的target保存到targetMap（weakmap）里，然后再用一个depsMap去存对象里的key，用set(dep)来存key里的依赖。说白了track就是把要变成响应式的对象里的属性一个个拉出来，用effect收集他们的fn。（也可以说给他们打上effect）
  - effect函数，到底是做什么的？用来注册副作用函数的一个方法，我的理解就是他是负责执行数据变更时的赋值操作
  - trigger，派发更新，通知依赖的所有effect执行，更新数据。


### 把 ref 值作为 reactive 参数会怎么样？
- reactive会对这个ref进行解包，然后再套上proxy

### 为什么要在proxy里套reflect？
- 提供了一个访问对象属性的默认行为，其实也相当于是call吧（个人理解），第三个函数接收的是一个对象，这个对象作为调用时候的this
- 这里理解他的功能和call或者apply相似。

### watchEffect
- watchEffect，它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。
- 用于侦听依赖的变化后执行某些操作，说白了就是可以做防抖节流之类的操作。
- 它的副作用（副作用就是意料之外会被执行的操作）：比如我们在watchEffect里放了一个setInterval，如果不中断那这个方法不就会被一直触发吗？
这种情况显然我们是不愿意看到的，所以要做清除操作，Vue3的watchEffect侦听副作用传入的函数可以接收一个 onInvalidate 函数作为入参，用来注册清理失效时的回调。（注意：所在的组件被卸载时，会隐式调用stop函数停止侦听，那副作用也被消除了） 
- **与watch区别**：watch是惰性的，且要传入监听的参数，但watchEffect他会自动帮你追踪（所以也会有副作用这个问题）