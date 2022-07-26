## 为什么react的hook不能在条件语句和循环语句中用，可vue3源于Hook理念的组合式Api可以？
- React 不允许 hook 处于条件语句是因为 React 把每次 render 中 useState 的顺序值 0、1、2、3 当成了 key，方便后续 render 用 key 查找对应的 state。这样的目的是使 useState 更简洁。因为我们保证了 hooks 的调用顺序（不保证就会报错），所以 hooks 内部可以使用链表来实现。

```React
// 因为从React角度来看，根本就看不见变量a和变量b! React 只知道useState的返回值被你拿去了，但是你拿去之后赋值给什么变量，React根本就不知道。
Const[a，setNextA]=usEstate(0)
const[b，setNextB]=usEstate(0)
const setNextA = () => {
  a += 1
}
const setNextB = () => {
  b += 1
}

```

- Vue 3 的 setup 并不是一个常规函数，而是含有一个闭包（闭包 = 自由变量 + 函数）的函数。

- 当你用b.value += 1触发re-render时，并不会重新执行setup函数，只会重新执行fnReturn,因此 Vue根本就不需要找a和b(想找也找不到，原因跟React一样，Vue 只知道你拿走了ref(O)的返回值)，因为a和b都是fnReturn可以直接读到的自由变量啊!换句话说，a、b、fnReturn 三者组成了闭包，这个闭包会一直维持着a和b变量，提供给fnReturn访问。

```Vue
const a = ref(0);
const b = ref(0);
export const Fang = defineComponent{(
  props: ...,
  setup: () => {
    return () => {
      <div>{a.value} - {b.value}</div>
    }
  }
)}
```