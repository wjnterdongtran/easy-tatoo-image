import { createClient } from '@/lib/supabase/server'
import { PrintJob } from '@/lib/types'
import { HistoryItem } from './HistoryItem'

export async function HistoryList() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your history.</p>
      </div>
    )
  }

  // Fetch print jobs for current user
  const { data: jobs, error } = await supabase
    .from('print_jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching print jobs:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load print history.</p>
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">📋</div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">No print jobs yet</p>
          <p className="text-gray-600">
            Create your first tattoo stencil in the editor!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <HistoryItem key={job.id} job={job as PrintJob} />
      ))}
    </div>
  )
}
