<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive max="8">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>
