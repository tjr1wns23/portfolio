<template>
  <div class="task-card" draggable="true" @dragstart="onDragStart">
    {{ task.title }}
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types/'

const { task } = defineProps<{ task: Task }>()

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData('task', JSON.stringify(task))
}
</script>

<style scoped>
.task-card {
  background: #ececec;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: grab;
  user-select: none;
}

.task-card:active {
  cursor: grabbing;
}
</style>
