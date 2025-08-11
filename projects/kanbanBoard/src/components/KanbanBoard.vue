<template>
  <div class="kanban">
    <Column
      v-for="column in columns"
      :key="column.id"
      :column="column"
      @move-task="handleMoveTask"
      @addTask="addTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Column from './Column.vue'
import type { Column as ColumnType, Task } from '../types'

const columns = ref<ColumnType[]>([
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 1, title: 'react 시작하기' },
      { id: 2, title: '포트폴리오 디자인하기' },
      { id: 3, title: 'github push 하기' },
    ],
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
  },
])

let nextTaskId = Math.max(
  ...columns.value.flatMap(c => c.tasks.map(t => t.id)), 0
) + 1;

function handleMoveTask(task: Task, toColumnId: string, toIndex: number) {
  const fromColumn = columns.value.find(col =>
    col.tasks.find(t => t.id === task.id)
  )
  const toColumn = columns.value.find(col => col.id === toColumnId)
  if (!fromColumn || !toColumn) return
  const taskIndex = fromColumn.tasks.findIndex(t => t.id === task.id)
  if (taskIndex === -1) return
  const [movedTask] = fromColumn.tasks.splice(taskIndex, 1)
  if (toIndex < 0 || toIndex > toColumn.tasks.length) {
    toColumn.tasks.push(movedTask)
  } else {
    toColumn.tasks.splice(toIndex, 0, movedTask)
  }

}

function addTask(columnId: string, text: string): void {
  const targetColumn = columns.value.find((col) => col.id === columnId);

  
  targetColumn?.tasks.push({id: nextTaskId, title: text});
  nextTaskId++;
  console.log(nextTaskId);
}

</script>

<style scoped>
.kanban {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}
</style>
