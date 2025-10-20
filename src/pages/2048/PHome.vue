<script setup lang="ts">
import { GameProvider } from './game'
import PageMain from './main/index.vue'
</script>

<template>
  <div class="select-none">
    <game-provider key2="2048.main">
      <page-main></page-main>
    </game-provider>
  </div>
</template>
