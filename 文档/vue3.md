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
- **与watch区别**：watch是惰性的，且要传入监听的参数，但watchEffect他会自动帮你追踪（所以也会有副作用这个问题），清除副作用就是
  传入一个oninvalidate的参数

### v-model
- v2的v-model是用v-on和v-bind的语法糖
- v3的v-model是用props和emit的语法糖

### diff
- v3的diff是这样，有key的情况头头比尾尾比，新多了就加旧多了就删
- 没有key就直接patch增加了
- 乱序的情况就是尽可能复用，这个尽可能复用就是通过最长递增子序列的算法来做的（有多种解法，vue3里用的是贪心+二分），
我的理解就是尽量找出相同的节点，剩下的再做对比，但他返回的数组是节点的下标。

### 组件传值
- 父子：props, emit， expose和ref 子defineExpose，父调用子组件那里绑一个ref获取。
- 深层次关系：provide/inject（v2不推荐用是因为要手动实现响应式，v3他是基于reactive的所以本身就是响应式的）
- 兄弟传值：eventBus mitt Mitt.on('sendMsg', getMsg) Mitt.emit('sendMsg', '兄弟的值')
- 状态管理：vuex，pinia

### node是单线程，为什么还有线程池这种东西？
- 首先要搞明白为什么有人说他是单线程，那是因为他的js引擎只在主线程上
- 然而他并不是单线程，实际上是多线程的，通过eventLoop切换这些线程，比如io操作他就是在线程池里操作的，而且io操作会阻塞那条线程。

### async的实现原理
- 大家都知道他是generator的语法糖，但实际上他还是做了一些处理的，比如说基本类型传入他也会包成一个promise返回，
他是这样，传入一个generator函数，然后给return一个promise，最后再帮你执行.next()  （generator要第二次.next()才生效）。


### 路由
- 路由守卫beforeach三个参数to, form和next，分别对应着去哪儿，从哪儿来，下一步
- 当路由未加载时，就需要获取登录时缓存的token和路由栈，由于刷新的时候，vuex的数据无法持久化，所以建议最好routes和token都放在缓存storage里。
- 动态路由：在index里声明动态路由和配置静态路由，然后把后端返回的路由json拼接到route内， router.addRoute(拼好的数据)，
  并存进vuex里最后进行路由的跳转next({ ...to, replace: true })，但由于vuex他刷新state里的数据就会被清空，所以还要做一个持久化存储（我这里是放进storage里了）
- 首次进来读缓存 然后设置到vuex中 后面都用vuex了
- 路由守卫里要对状态做一个判断，跳转的不是首页 同时 用户还未登陆的情况下