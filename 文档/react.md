## 组件什么时候会 re-render
1. 本身props或state改变时
2. context value改变时，使用该值的组件会re-render
3. 父组件重新渲染，所有他下面的子组件都会re-render，形成一条re-render链

## 如何防止子组件re-render
1. 子组件自身被缓存。
2. 子组件所有的 prop 都被缓存。

## useMemo和useCallback
- 本质上，都是缓存，作用是性能优化，具体指的是什么呢？
就是防止不必要的effect，不必要的re-render，不必要的重复计算。

- useMemo
  - 第一次渲染时执行，缓存变量，之后只有在依赖项改变时才会重新计算记忆值。

- useCallback
  - 第一次渲染时执行，缓存函数，之后只有在依赖项改变时才会更新缓存。