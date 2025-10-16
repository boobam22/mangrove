<template>
  <router-view v-slot="{ Component, route }" class="min-h-screen overflow-hidden bg-stone-100">
    <component :is="Component" v-if="route.meta.noKeepAlive" />
    <keep-alive v-else>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
