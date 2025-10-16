<template>
  <router-view v-slot="{ Component }" class="min-h-screen bg-stone-100">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
