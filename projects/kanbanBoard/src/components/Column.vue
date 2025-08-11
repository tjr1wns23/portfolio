<template>
  <div class="column">
    <h2>{{ column.title }}</h2>
    <div class="task-list" @dragover.prevent @drop="onDrop">
      <transition-group name="task" tag="div" class="task-container">
        <TaskCard v-for="task in column.tasks" :key="task.id" :task="task" />
      </transition-group>
      <transition-group name="taskadd" tag="div" class="task-container">
        <div v-if="newTaskAdding" class="task-add" :key="'input'">
          <input type="text" name="addText" @keyup.enter="submitTask" v-model="newTaskTitle">
          <span @click="hideAdd" class="hide-btn">x</span>
        </div>
        <div class="task-card task-add" @click="addTask();" :key="'add-btn'">+</div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard.vue';
import { defineEmits, ref } from 'vue';

const { column } = defineProps<{ column: ColumnType }>();
const emit = defineEmits<{
  (e: 'move-task', task: Task, toColumnId: string, toIndex: number): void,
  (e: 'addTask', columnId: string, text: string): void;
}>();

const newTaskAdding = ref(false);
const newTaskTitle = ref('');

function onDrop(event: DragEvent): void {
  newTaskAdding.value = false;
  const raw = event.dataTransfer?.getData('task');
  if (!raw) return;
  const task: Task = JSON.parse(raw);

  // 마우스 위치 기준 삽입할 인덱스 찾기
  const container = document.querySelector('.task-container')!;
  const containerStyle = getComputedStyle(container);
  const containerGap = containerStyle.getPropertyValue('gap');
  const gapNum = parseFloat(containerGap);
  const taskElements = document.querySelectorAll('.task-card');
  let insertIndex = 0;

  for (const [idx, el] of taskElements.entries()) {
    const box = el.getBoundingClientRect();
    if (event.clientY >= box.top - gapNum && event.clientY < box.top + box.height + gapNum) {
      insertIndex = idx;
      break;
    }
  }

  emit('move-task', task, column.id, insertIndex);
}

function addTask(): void {
  newTaskAdding.value = true;
}

function hideAdd(): void {
  newTaskAdding.value = false;
}

function submitTask(): void {
  if (newTaskTitle.value.trim() === '') return;
  emit('addTask', column.id, newTaskTitle.value);
  newTaskTitle.value = '';
  hideAdd();
}

</script>

<style scoped>
input {
  outline: none;
  border: none;
}

.column {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.task-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 200px;
}

.task-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card {
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.task-add {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 9px;
  border-radius: 6px;
  border: 1px dotted #e0e0e0;
  cursor: pointer;
}

.hide-btn {
  float: right;
  padding: 4px;
  text-align: center;
  background: none;
}

.task-move {
  transition: transform 0.3s ease;
}

.taskadd-enter-active,
.taskadd-leave-active {
  transition: all 0.3s ease;
}

.taskadd-enter-from,
.taskadd-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.taskadd-enter-to,
.taskadd-leave-from {
  opacity: 1;
  transform: scale(1);
}

</style>
