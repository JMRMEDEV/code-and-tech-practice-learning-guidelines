import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import type { Section } from '../types/section'
import type { Page } from '../types/page'
import SortableSections from '../components/sections/SortableSections'
import SectionPreview from '../components/sections/SectionPreview'
import Button from '../components/ui/Button'
import { createPage, updatePage, getPageById } from '../api/pages.api'
import {createSection, getSectionsByPageId} from '../api/sections.api'
import { normalizePagePayload, normalizeSectionsPayload } from '../utils/normalizePage'
import { useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import { useParams } from 'react-router-dom'

export default function PageEditor() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { id } = useParams()

  const isEdit = Boolean(id)

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true)
      try {
        const page = await getPageById(id!)
        setTitle(page.title)
        setSlug(page.slug)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    const loadSections = async () => {
      setFetching(true)
      try {
        const sections = await getSectionsByPageId(id!)
        const normalizedSections = sections.map(section => {
          switch (section.type) {
            case 'text':
              return {
                id: section._id,
                type: 'text',
                heading: section.data.heading,
                body: section.data.body,
              }
            case 'image':
              return {
                id: section._id,
                type: 'image',
                url: section.data.url,
              }
            case 'chart':
              return {
                id: section._id,
                type: 'chart',
                data: section.data.values.map((v, i) => ({ id: uuid(), label: section.data.labels[i], value: v }))
              }
          }
        })
        setSections(normalizedSections)
      } catch (e) {
        console.error(e)
      } finally {
        setFetching(false)
      }
    }

    if (isEdit) {
      loadPage()
      loadSections()
    }
  }, [isEdit, id])

  const disableSave = !title || !slug || loading;

  const add = (type: Section['type']) => {
    const base = { id: uuid(), type }

    if (type === 'text')
      setSections(prev => [...prev, { ...base, heading: '', body: '' }])

    if (type === 'image')
      setSections(prev => [...prev, { ...base, url: '', caption: '' }])

    if (type === 'chart')
      setSections(prev => [...prev, { ...base, data: [] }])
  }

  const handleSave = async () => {
    if (!title || !slug) {
      alert('Title and slug are required')
      return
    }

    const page: Page = { title, slug }

    try {
      setLoading(true)
      const pageResult = await createPage(normalizePagePayload(page))
      console.log('pageResult: ', pageResult)

      const pageId = pageResult.data?._id ?? pageResult._id

      if (!pageId) {
        throw new Error('Page ID not returned by API')
      }

      try {
        // wait for page to be created then create sections
        await Promise.all(sections.map(section =>
          createSection(normalizeSectionsPayload(section, pageId))
        ))
        setLoading(false)
      } catch  {
        alert('Error creating sections')
        setLoading(false)
      }

      navigate('/dashboard')
    } catch (e) {
      console.error(e)
      alert('Error saving page')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!title || !slug) {
      alert('Title and slug are required')
      return
    }

    const page: Page = { title, slug }

    try {
      setLoading(true)
      await updatePage(id!, normalizePagePayload(page))
      setLoading(false)
      navigate('/dashboard')
    } catch (e) {
      console.error(e)
      alert('Error updating page')
    } finally {
      setLoading(false)
    }
  }

  // only show loading state when fetching initial state on Edit
  if (fetching) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={isEdit ? handleUpdate : handleSave} disabled={disableSave}>
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Page'}
        </Button>
      </div>
      {/* Page metadata */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <Input
          className="mb-[10px]"
          label="Page title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Input
          className="mb-[10px]"
          label="page-slug"
          value={slug}
          onChange={e => setSlug(e.target.value)}
        />
      </div>

      {/* Editor */}
      <div className="grid grid-cols-[1fr_2fr] gap-[40px]">
        <div>
          <div className="flex gap-[10px] mb-[20px] max-w-[300px]">
            <Button onClick={() => add('text')}>Text</Button>
            <Button onClick={() => add('image')}>Image</Button>
            <Button onClick={() => add('chart')}>Chart</Button>
          </div>

          <SortableSections sections={sections} onChange={setSections} isEdit={isEdit} setLoading={setFetching} pageId={id!} />
        </div>

        {/* Live Preview */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4 border-b pb-[10px] mb-[10px]">Live Preview</h3>
          {sections.length === 0 && (
            <p className="text-gray-400">No sections yet</p>
          )}
          {sections.map(s => (
            <SectionPreview key={s.id} section={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
