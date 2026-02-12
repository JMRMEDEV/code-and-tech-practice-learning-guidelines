import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPages, deletePage } from '../api/pages.api'
import Button from '../components/ui/Button'

interface Page {
  _id: string
  title: string
  slug: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPages = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getPages()
      setPages(data as Page[])
    } catch {
      setError('Error loading pages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  const handleDelete = async (id: string) => {
    setLoading(true)
    setError('')

    try {
      const res = await deletePage(id)
      console.log('res: ', res)
      await loadPages()
    } catch {
      setError('Error deleting page')
      setLoading(false)
    }
  }

  console.log('pages: ', pages)

  if (loading) {
    return <p className="p-6">Loading pages...</p>
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-2xl font-semibold">Pages</h2>
        <Button onClick={() => navigate('/page/new')}>
          + Create Page
        </Button>
      </div>

      {pages.length === 0 ? (
        <p className="text-gray-500">No pages yet</p>
      ) : (
        <div className="space-y-3">
          {pages.map(page => (
            <div
              key={page._id}
              className="border-b flex items-center justify-between p-[5px]"
            >
              <div>
                <p className="font-medium">{page.title}</p>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>

              <div className="flex gap-[10px]">
                <Button
                  onClick={() => navigate(`/page/${page._id}`)}
                >
                  Edit
                </Button>

                <Button
                  onClick={() => handleDelete(page._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
