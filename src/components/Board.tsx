import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { useTasks } from '../hooks/useTasks'
import Column from './Column'
import CreateTaskModal from './CreateTaskModal'
import { useState } from 'react'
import { Status } from '../types/task'

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review',   label: 'In Review' },
  { id: 'done',        label: 'Done' },
]

export default function Board() {
  const { tasks, loading, error, createTask, updateTaskStatus } = useTasks()
  const [showModal, setShowModal] = useState(false)

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as Status
    const task = tasks.find(t => t.id === active.id)
    if (task && task.status !== newStatus) {
      await updateTaskStatus(task.id, newStatus)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 text-lg">Loading your board...</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-500 text-lg">Error: {error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Board</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Task
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              id={col.id}
              label={col.label}
              tasks={tasks.filter(t => t.status === col.id)}
            />
          ))}
        </div>
      </DndContext>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
           onCreate={async (title, description, priority, label, label_color) => {
            await createTask(title, description, priority, label, label_color)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}