<script setup lang="ts">
import { provide } from 'vue'

import { useGame } from './utils/game'
import PageHeader from './components/header/index.vue'
import PageMain from './components/main/index.vue'

provide('game', useGame('tutorial'))
</script>

<template>
  <div>
    <page-header></page-header>
    <page-main></page-main>
  </div>
</template>
