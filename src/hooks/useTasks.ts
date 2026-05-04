import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Task, Status } from '../types/task'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) setError(error.message)
    else setTasks(data as Task[])
    setLoading(false)
  }

  async function createTask(title: string, description?: string, priority?: string) {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('tasks').insert({
      title,
      description,
      priority: priority ?? 'normal',
      status: 'todo',
      user_id: user!.id
    })

    if (error) setError(error.message)
    else fetchTasks()
  }

  async function updateTaskStatus(id: string, status: Status) {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)

    if (error) setError(error.message)
    else fetchTasks()
  }

  return { tasks, loading, error, createTask, updateTaskStatus }
}