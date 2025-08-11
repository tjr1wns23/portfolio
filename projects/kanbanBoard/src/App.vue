<template>
  <div class="app">
    <KanbanBoard />
  </div>
</template>

<script setup lang="ts">
  import KanbanBoard from './components/KanbanBoard.vue'
</script>

<style scoped>
.app {
  padding: 2rem;
  background: #f4f4f4;
  min-height: 100vh;
}
</style>