## 系统总架构
### 整体架构图
<img src='./access/qiankun.svg'>

### 简介
整体技术框架分为产品组件库（bda-ui2）、主系统、子系统。主系统与子系统之间通过qiankun.js进行整合， 通过qiankun.js可以实现主子系统之间的双向通信

点击查看[qiankun](https://qiankun.umijs.org/zh/guide)

### 优势
- 统一使用组件库，组件与业务脱离具备较好的通用性及可维护性
- 通过切分细化项目，避免产品出现巨石化，以及为日后重构降低风险提高可行性。同时方便产品的功能模块管理及代码管理


### 系统整体架构设计
- ![](https://img-blog.csdnimg.cn/c100094df8b44badbec3a47e9de040c0.png)
注：从主中获取公共组件,可在开发指南-跨应用组件使用下查看使用规则

### 组件库
组件库是基于element-ui做的二次封装，目前所有的功能都不允许修改官方的码源。如果存在官网的所提供的组件无法满足业务需求的应该遵从以下规则

- 优先在官方组件基础上进行功能改造补充
- 如果在官方组件基础上无法改造，则优先选寻找其他第三方库进行改造

### 主系统架构简介
主系统主要作用是用于集成子系统，构建运营平台。架构图如下
- ![](https://img-blog.csdnimg.cn/2410ca5a9fc24f9bae4c2119b9270e16.png)

主要功能如下:
1. 系统权限校验
2. 系统单点登陆处理
3. 系统功能模块集成（qiankun.js，iframe）
4. 系统间通信处理
5. 开放开发者集成

### 系统鉴权
主要是逻辑包括登陆后获取个性化配置、皮肤、菜单、功能权限等跟用户角色绑定的相关权限。相关实现方式依赖vuex做状态存储，并分发到各个子系统

### 系统功能模块集成
系统集成支持qiankun.js方式及iframe的方式

### 子系统架构简介
子系统主要作用是用于处理模块业务代码。架构图如下
- ![](https://img-blog.csdnimg.cn/d2f816b372bd4ad5be4aaeec2cf04eef.png)

主要功能为:**模块业务代码**

### 乾坤集成方式要点
对于新开的系统模块都应该使用乾坤的方式集成进来，对于旧的项目可以根据自身系统状况决定使用哪种集成方式。本节主要介绍乾坤的集成方式技术要点

### 乾坤系统基本应用框架介绍
主要介绍乾坤主、子系统的基础集成

#### 父组件注册子系统
在主应用src>module>portal>portal.vue中预注册子系统
```javascript
import { getSystemItemList } from "./../../qiankun/qiankunContainer";
import { beforeLoad, afterMount } from "./../../qiankun/qiankunPageLoad";
import { registerMicroApps, start } from "qiankun";
// 注册子应用
const list = await getSystemItemList();
registerMicroApps(list, {
    beforeLoad: beforeLoad,
    afterMount: [afterMount],
});
```

#### 触发加载子系统
当前所有的子系统都是在portal组件内触发，由于qiankun.js的触发需要满足两条件，一是页面上有子系统的插入容器，二是满足路由触发规则。现在所有的子系统都挂载在跑portal内id为#qiankun的div内
```javascript
<div class="qiankun-container" id="qiankun"></div>
```
**注意**:
一个容器只能挂载一个应用。但是挂载的应用可以变换，而且浏览器会有缓存，第二次切换过来不需要重新加载 Vue是虚拟dom，html内没有#qiankun容器前不可以挂载。所以需要在portal组件内挂载完成后，启动qiankun.js
```javascript
import globalConfig from "./../../API/globalConfig";
mounted() {
    if (!window.qiankunStarted && globalConfig.qiankunOpen) {
      const list = await getSystemItemList();
      // 注册子应用
      registerMicroApps(list, {
        beforeLoad: beforeLoad,
        afterMount: [afterMount],
      });

      window.qiankunStarted = true;
      start({
        prefetch: false,
        strictStyleIsolation: true,
        singular: false,
        sandbox: false
      });
    }
 }
```

### 组件之间通信
介绍主、子系统间的通信原理及设计

#### 主、子应用信息双向通信
qiankunStore.js定义一个用于处理qiankun.js系统通信的类。Qiankun.js本身提供一套单项的数据流的通信（即由子到父）,由initGlobalState处理，具体可参考官方文档 ,我们主要依赖onGlobalStateChange、setGlobalState，及自定义回调setMainVuex，实现主、子数据双向交流

```javascript
import { initGlobalState } from 'qiankun'
class qiankunStore{
    //存在内存，避免组件共享子=》父=》子经过vuex都是钩子报错
    static componentShareCache=[];
    static initialState={};
    static setGlobalState=null;
    static actions=initGlobalState(this.initialState)
    static setGlobalState=(e)=>{
        this.initialState=e;
        this.actions.setGlobalState(this.initialState);
    };
    //监听钩子，在子应用中使用，监听父应用状态变化，父应用不使用，避免死循环监听，而使用setMainVuex更改状态
    static onGlobalStateChange=this.actions.onGlobalStateChange;
    //向子应用注册钩子，获取父应用的状态
    static getGlobalState=this.actions.getGlobalState=(callBack)=>{
        callBack(this.initialState);
    };
    static setMainVuex=(model_key,n,handleCache=true)=>{
        ...
    }
}
export default qiankunStore
```
- ![](https://img-blog.csdnimg.cn/f7700a38944145e99ee9be1bc021075d.png)

#### 组件共享
子组件往父组件分享: 在子应用的main.js中

import shareList from './qiankun/componentShare';
//子设置父的vuex信息
props.setMainVuex('componentModule/cm_add_component', shareList);
Copy
父获取子的信息：在主应用src>qiankun>qiankunContainer.js中

```javascript
let systemListlist = [];
const getSystemItemList=async()=>{
// 配置子引用本地地址
  ...
  systemListlist = list.map(item => {
    return {
      name: item.name,
      entry: NODE_ENV ? "/" + item.path + "/" : item.localPath,
      container: "#qiankun",
      activeRule: (e) => {
        return new RegExp(new RegExp("#/" + item.name + "/")).test(e.hash);
      },
      props: {
        ...
        getComponent: qiankunStore.getComponent,
        ...

      },
    }
  })
  return systemListlist;
}
```
#### 子与子间组件共享
流程图如下:
- ![](https://img-blog.csdnimg.cn/a60374a8bf7a46e985e3af6f83db6499.png)

子与子间，不可以直接通信，所有的共享，都先共享到主，在由主共享出来。从而达到子与子共享的目的。 子与子共享需确保两个子应用都已经在主应用内挂载。但是由于路由只有一个，所以可以通过手动挂载的方式，触发挂载，用于组件共享，而不是页面路由。 在主应用内挂载通过在src>qiankun>qiankunContainer.js ,bdaLoadMicroApp方法进行挂载。
```javascript
/**
 * 手动全局挂载模块，用于组件获取
 * @param {String} name 模块名称
 * @param {Function} callback 挂载完整回调
 * @returns
 */
const bdaLoadMicroApp=(name,callback)=>{
  ...//判断是否已经加载
};
```

在子应用内，则需要调用src>qiankun>synchronousGlobalState.js, bdaLoadMicroApp钩子，触发主应用进行挂载
```javascript
/**
 * 手动全局挂载模块，用于组件获取
 * @param {String} name 模块名称
 * @param {Function} callback 挂载完整回调
 * @returns
 */
const bdaLoadMicroApp=(name,callBack)=>{

}
```

### 框架维护
#### 文件夹功能描述
##### 主应用
详细维护在项目readme.md中

##### 子应用
详细维护在项目readme.md中

##### 主、子应用维护
commonJS、plugJS、services、qiankun/componentShare.js这几个文件夹或文件，主和子是一致的。 commonJS/globalEvent.js、commonJS/windowWatch.js,这两个在子系统内不存在。除特殊文件外，以上改动可以直接覆盖到其他子项目内，其他子项目的改动也可以覆盖到主内。总之保持基本框架一致同步