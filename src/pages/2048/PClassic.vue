<script setup lang="ts">
import { GameProvider } from './game'
import PageHeader from './header/index.vue'
import PageMain from './main/index.vue'
</script>

<template>
  <div class="select-none">
    <game-provider key2="2048.classic">
      <page-header></page-header>
      <page-main class="mt-12"></page-main>
    </game-provider>
  </div>
</template>
