<script setup lang="ts">
import { provide } from 'vue'

import { useGame } from './game'
import PageHeader from './header/index.vue'
import PageMain from './main/index.vue'

provide('game', useGame('classic'))
</script>

<template>
  <div class="select-none">
    <page-header></page-header>
    <page-main class="mt-12"></page-main>
  </div>
</template>
