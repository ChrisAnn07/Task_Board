export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'
export type Priority = 'low' | 'normal' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  due_date?: string
  user_id: string
  created_at: string
  label?: string
  label_color?: string
}