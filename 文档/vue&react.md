## 为什么react的hook不能在条件语句和循环语句中用，可vue3源于Hook理念的组合式Api可以？
- React 不允许 hook 处于条件语句是因为 React 把每次 render 中 useState 的顺序值 0、1、2、3 当成了 key，方便后续 render 用 key 查找对应的 state。这样的目的是使 useState 更简洁。因为我们保证了 hooks 的调用顺序（不保证就会报错），所以 hooks 内部可以使用链表来实现。
- react hook是在fiber节点上存储hooks链表，每执行一次usestate，返回相对应节点数据，指针后移一位，也就意味着你在循环中调用可能在下一次执行时少调用一次，这样会获取错误的fiber节点。
- fiber是什么呢 说白了fiber就是一个返回组件的函数
- 也可以看看这个，感觉这个面试说好点[fiber单链表](https://blog.csdn.net/cake_eat/article/details/120661569?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-120661569-blog-119952477.pc_relevant_sortByAnswer&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-120661569-blog-119952477.pc_relevant_sortByAnswer&utm_relevant_index=2)

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


在控制反转之前，class B里的this.entity = new A('小满')就是相当于在B实例化的时候，对A实例化，这个操作直接由B来完成，看似没问题，但这里的B是紧依赖于A的（也就是高耦合）；可以试想，如果还有一个类C，里面有sex属性，B同时也要依赖C，是不是要直接改动B里面的代码再加一个C依赖？所谓高层模块不应该依赖低层模块，这里的B是高层模块，直接依赖于A这个低层模块，就是这个意思。IOC的核心思想是抽象，改造后的A和B之间已经没有直接关联了，改为通过Container这个“容器”去实现，调用Container里的provide方法，其实就是依赖注入。由Container代替B对A进行实例化的操作，不再是B去做这件事，这就是解耦。说的白话一点，就是在AC和B之间放了一个中介，B告诉中介，我想要A和C的功能，那就由中介去帮你联系AC获取他们的功能（控制反转），然后再给你加上（依赖注入）。