import { useEffect, useState } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Plus, Loader2, AlertTriangle } from 'lucide-react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useTasks } from './hooks/useTasks'
import { Status } from './types/task'
import Column from './components/Column'
import CreateTaskModal from './components/CreateTaskModal'

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review',   label: 'In Review' },
  { id: 'done',        label: 'Done' },
]

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Guest auth on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
        setAuthLoading(false)
      } else {
        supabase.auth.signInAnonymously().then(({ data }) => {
          setSession(data.session)
          setAuthLoading(false)
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )
    return () => subscription.unsubscribe()
  }, [])

  const { tasks, loading, error, createTask, updateTaskStatus } = useTasks()

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as Status
    const task = tasks.find(t => t.id === active.id)
    if (task && task.status !== newStatus) {
      await updateTaskStatus(task.id, newStatus)
    }
  }

  if (authLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  )

  if (!session) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-500">Could not create session.</p>
    </div>
  )

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-100 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
              <p className="text-gray-600 mt-1">Drag and drop tasks to update their status</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          {/* Loading / Error states */}
          {loading && (
            <div className="mb-4 flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading tasks...</span>
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Columns */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => (
              <Column
                key={col.id}
                id={col.id}
                label={col.label}
                tasks={tasks.filter(t => t.status === col.id)}
              />
            ))}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <CreateTaskModal
            onClose={() => setIsModalOpen(false)}
            onCreate={async (title, description, priority) => {
              await createTask(title, description, priority)
              setIsModalOpen(false)
            }}
          />
        )}
      </div>
    </DndContext>
  )
}