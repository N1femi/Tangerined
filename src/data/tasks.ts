export type Task = {
  id: string
  title: string
  description?: string
  sliceId: string
  date: string
  time: string | null
  completed: boolean
}

export const tasks: Task[] = [
  {
    id: 'math-homework',
    title: 'Finish Math Homework',
    sliceId: 'school',
    date: '2026-09-26',
    time: null,
    completed: false,
  },

  {
    id: 'linear-algebra',
    title: 'Study Linear Algebra',
    sliceId: 'school',
    date: '2026-09-28',
    time: '6:00 PM',
    completed: false,
  },

  {
    id: 'tangerined',
    title: 'Work on Tangerined',
    sliceId: 'projects',
    date: '2026-09-26',
    time: null,
    completed: false,
  },
]