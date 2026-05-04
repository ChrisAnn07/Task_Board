import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import { Task, Status } from '../types/task'

interface ColumnProps {
  id: Status
  label: string
  tasks: Task[]
}

export default function Column({ id, label, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg min-w-[280px] max-w-[320px] flex-1">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900 flex items-center justify-between">
          <span>{label}</span>
          <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
            {tasks.length}
          </span>
        </h2>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 space-y-3 min-h-[500px] transition-colors ${isOver ? 'bg-blue-50' : ''}`}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}