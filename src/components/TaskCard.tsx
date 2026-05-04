import { useDraggable } from '@dnd-kit/core'
import { GripVertical, Calendar, AlertCircle } from 'lucide-react'
import { Task } from '../types/task'

const priorityColors = {
  low:    'bg-blue-100 text-blue-800 border-blue-200',
  normal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high:   'bg-red-100 text-red-800 border-red-200',
}

export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id })

  return (
    <div
      ref={setNodeRef} {...listeners} {...attributes}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {task.priority && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${priorityColors[task.priority]}`}>
                <AlertCircle className="w-3 h-3" />
                {task.priority}
              </span>
            )}
            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}