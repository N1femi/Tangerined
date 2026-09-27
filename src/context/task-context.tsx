import { createContext, ReactNode, useContext, useState } from 'react'

import { Task, tasks as startingTasks } from '@/data/tasks'

type TaskProviderProps = {
  children: ReactNode
}

interface TaskContextValue {
  tasks: Task[]
  addTask(task: Task): void
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider(props: TaskProviderProps) {
  const [taskList, setTaskList] = useState<Task[]>(startingTasks)

  function addTask(task: Task) {
    setTaskList(function(currentTasks) {
      return [...currentTasks, task]
    })
  }

  return (
    <TaskContext.Provider
      value={{
        tasks: taskList,
        addTask: addTask,
      }}
    >
      {props.children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)

  if (context === null) {
    throw new Error('useTasks must be used inside TaskProvider')
  }

  return context
}