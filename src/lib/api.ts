import { Task } from '@/data/tasks'

const API_URL = process.env.EXPO_PUBLIC_API_URL


export type TaskDraft = {
  title: string
  description: string
  sliceId: string
  date: string
  time: string
}


export async function createTaskFromText(text: string): Promise<Task> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is missing')
  }

  const response = await fetch(API_URL + '/tasks/from-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(errorText)
  }

  const task = await response.json()

  return task
}


export async function understandTaskText(text: string): Promise<TaskDraft> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is missing')
  }

  const response = await fetch(API_URL + '/understand', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(errorText)
  }

  const task = await response.json()

  return task
}


export async function understandTasksText(
  text: string
): Promise<TaskDraft[]> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is missing')
  }

  const response = await fetch(API_URL + '/understand/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(errorText)
  }

  const result = await response.json()

  return result.tasks
}