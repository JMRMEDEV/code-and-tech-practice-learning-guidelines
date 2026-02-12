import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPageBySlug } from '../api/pages.api'
import SectionPreview from '../components/sections/SectionPreview'

export default function PublicPage() {
  const { slug } = useParams()
  const [page, setPage] = useState<any>(null)

  useEffect(() => {
    if (slug) getPageBySlug(slug).then(setPage)
  }, [slug])

  if (!page) return null

  return (
    <div>
      <h1>{page.title}</h1>
      {page.sections.map((s: any) => (
        <SectionPreview key={s.id} section={s} />
      ))}
    </div>
  )
}
