## KOA 中间件以及洋葱模型
- [参考链接](https://juejin.cn/post/7012031464237694983#heading-0)

### 中间件
- 在 Koa 中，中间件就是普通的函数，该函数接收两个参数：context 和 next。其中 context 表示上下文对象，而 next 表示一个调用后返回 Promise 对象的函数对象。
- 源码里 核心是compose函数。
- 在koa中，用use来注册中间件。而中间件里面是以next()来做分界线的，大致分为三个阶段：beforeNext，next，afterNext。前置处理，next，后置处理。他的执行顺序是这样的，假如有三个中间件ABC，任务调度的时候，他会先执行A的beforeNext，next，到B的beforeNext，next...然后到C的afterNext，B的afterNext，A的afterNext。这是koa的任务调度。而这个，也叫洋葱模型，一层层向内，在从内往外。（其实这里我的理解是回溯）

### 洋葱模型
- Koa 的洋葱模型指的是以 next() 函数为分割点，先由外到内执行 Request 的逻辑，再由内到外执行 Response 的逻辑。通过洋葱模型，将多个中间件之间通信等变得更加可行和简单。其实现的原理并不是很复杂，主要是 compose 方法。
- 洋葱内的每一层都表示一个独立的中间件，用于实现不同的功能，比如异常处理、缓存处理等。每次请求都会从左侧开始一层层地经过每层的中间件，当进入到最里层的中间件之后，就会从最里层的中间件开始逐层返回。因此对于每层的中间件来说，在一个 请求和响应 周期中，都有两个时机点来添加不同的处理逻辑。

- Model层处理业务逻辑，对应Nest里的Dto，Service，Entity等
- View层视图，也就是页面
- Controller层控制器，是最接近视图的一层，它其实是在做一个中转的操作，view层的资源会通过控制器转发到model层处理对应逻辑（比如crud），再将处理好的结果返回给view层。
- 通常来说，先声明Entity（数据库对应的实体类），再导入Service写逻辑操作，最后在Controller设置对应路由。