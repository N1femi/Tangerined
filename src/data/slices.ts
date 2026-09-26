export const slices = [
  {
    id: 'school',
    name: 'School',
    emoji: '🎓',

    color: '#E89A3D',
    backgroundColor: '#FFF0D8',

    description: 'Your school tasks and reminders.',

    tasks: [
      {
        id: 'math-homework',
        title: 'Finish Math Homework',
        due: 'Tonight',
      },

      {
        id: 'linear-algebra',
        title: 'Study Linear Algebra',
        due: 'Monday',
      },
    ],
  },

  {
    id: 'projects',
    name: 'Projects',
    emoji: '💻',

    color: '#6F9272',
    backgroundColor: '#E8F1E7',

    description: 'Things you are currently building.',

    tasks: [
      {
        id: 'tangerined',
        title: 'Work on Tangerined',
        due: 'Tonight',
      },
    ],
  },

  {
    id: 'personal',
    name: 'Personal',
    emoji: '🏠',

    color: '#C47782',
    backgroundColor: '#F5E4E7',

    description: 'Your personal tasks and reminders.',

    tasks: [],
  },
]