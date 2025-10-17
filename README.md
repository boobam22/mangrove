# Mangrove

## 项目依赖

- [Vue3](https://vuejs.org/) + [Vue-Router](https://router.vuejs.org/) + [Iconify](https://icon-sets.iconify.design/)
- [Tailwindcss](https://tailwindcss.com/) + [Typescript](https://www.typescriptlang.org/) + [Vite](!) + [Eslint](!) + [Prettierrc](!)

## 文件结构

- `src/pages/` 下的每个目录，都包含一个或者多个相关的页面，路由会自动查找 `src/pages/<namespace>/routes.ts` 并注册。
- 页面所用到的组件，资源文件和js都放在 `src/pages/<namespace>/` 下，根据相关性和逻辑划分目录。
- `src/pages/<namespace>/` 目录下结构可以比较自由，根据页面逻辑而定，但是对于复杂的功能应当考虑拆分，整体有序，局部自由。
- 根目录下放抽象组件和抽象逻辑。

## 组件结构

- 使用 `tailwindcss` 实现大部分样式：几乎不手写css，通常是需要实现过渡效果和动画才有 `<style>` 模块。
- `<template>` + `jsx` 实现基本页面结构：
  - `jsx` 实现一些简单的ui逻辑，简单的值运算和函数方法，使 `setup` 命名空间更加简洁。
  - `jsx` 甚至可能只包含了一个具有 `class` 属性的标签，使用 `jsx` 而不是 `css` 的原因是，可以直接共享 `tailwindcss` 的全局样式。
  - `jsx` 在 `setup` block定义，还可以直接使用组件的变量，减少 `props` 传递。
- 消息，弹窗类组件，通过js调用动态插入和移除 `DOM`。
- 数据管理：
  - `setup` block维护一部分仅自身需要的状态。
  - `hook` 维护一部分相关联的逻辑，导出数据和方法，可以跨组件访问。
  - 同一接口但是不同来源的数据，由父组件通过 `provide` 提供，子组件按需接收，避免层层传递 `props`。
  - 没有引入状态管理库，使用 `composition API` 手动维护更加灵活。

## Demo1 - 2048

- 实现基本游戏逻辑，合并方块和计分。
- 基本的过渡动画，包括方块移动和交互。
- 除了移动操作外，还支持撤销，交换和删除方块，并提供了简单的交互提示。
- 支持记录操作历史并恢复。
- 使用 `LocalStorage` 在客户端保存数据，重载页面可以完整恢复游戏状态。

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
