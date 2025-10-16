<script setup lang="ts">
import { provide } from 'vue'

import { useGame } from './utils/game'
import PageHeader from './components/header/index.vue'
import PageMain from './components/main/index.vue'
import CControl from './components/main/CControl.vue'

provide('game', useGame('main'))
</script>

<template>
  <div class="select-none">
    <page-header></page-header>
    <page-main></page-main>
    <c-control></c-control>
  </div>
</template>
