<script setup lang="tsx">
import { GameProvider } from './game'
import { TutorialProvider } from './tutorial'
import PageMain from './main/index.vue'
</script>

<template>
  <div>
    <game-provider storage-key="2048.tutorial">
      <tutorial-provider>
        <page-main></page-main>
      </tutorial-provider>
    </game-provider>
  </div>
</template>
