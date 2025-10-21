<script setup lang="ts">
import { GameProvider } from './game'
import PageMain from './main/index.vue'
</script>

<template>
  <div>
    <game-provider storage-key="2048.main">
      <page-main></page-main>
    </game-provider>
  </div>
</template>
