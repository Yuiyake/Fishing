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


## 状态管理
### Redux
### Mobx
### Recoil
- 基本概念
  - auto：共享状态，所有 atom 都是可写状态
  - selector：派生状态，本质是一个纯函数，入参为auto或者其他selector，只有同时具有get和set的selector才是可写状态。我的理解是状态副本，被用于计算基于 state 的派生数据。里面有一个get()和一个set()，get是用于计算的函数，set是用于设置状态的函数（可选）
- hooks
  - useRecoilValue()：绑定 状态 ，useSetRecoilState 。
  - useSetRecoilState()：定义set函数，改变状态里的某一变量
  - useRecoilState()：读取状态里的某值并获取一个setter函数