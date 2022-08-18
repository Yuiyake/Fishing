## babel 工作原理
- [参考](https://blog.csdn.net/killbee365/article/details/106105232)
- ES6代码输入 => babylon进行解析 > 得到AST> plugin用babel-traverse对AST树进行遍历转译 => 得到新的AST树
=> 用babel-generator通过AST树生成ES5代码

## Plolyfill 垫片
- babel默认只转换新的 JavaScript 语法，比如箭头函数、扩展运算（spread）。
不转换新的 API，例如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。如果想使用这些新的对象和方法，则需要为当前环境提供一个垫片（polyfill）。
- Polyfill主要有三种@babel/polyfill
  - Babel 包含一个polyfill 库即@babel/polyfill。这个库里包含 regenerator 和 core-js。
