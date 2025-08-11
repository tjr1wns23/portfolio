export type Task = {
  id: number
  title: string
  description?: string
}

export type Column = {
  id: string // 'todo', 'inProgress', 'done'
  title: string
  tasks: Task[]
}