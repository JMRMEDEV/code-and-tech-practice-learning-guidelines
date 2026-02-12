import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from 'react-beautiful-dnd'
import type { Section } from '../../types/section'
import SectionEditor from './SectionEditor'
import { deleteSection, getSectionsByPageId } from '../../api/sections.api'

interface Props {
  sections: Section[]
  onChange: (sections: Section[]) => void
  isEdit?: boolean
  setLoading?: (loading: boolean) => void
  pageId: string
}

export default function SortableSections({ sections, onChange, isEdit, setLoading, pageId }: Props) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)

    onChange(items)
  }

  const handleRemove = async (id: string) => {
    if (isEdit) {
      setLoading?.(true)
      try {
        const confirmDelete = confirm('Are you sure you want to delete this section?')
        if (!confirmDelete) return
        await deleteSection(id)

        const sections = await getSectionsByPageId(pageId)
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
                caption: section.data.caption,
              }
            case 'chart':
              return {
                id: section._id,
                type: 'chart',
                data: section.data.values.map((v, i) => ({ id: uuid(), label: section.data.labels[i], value: v }))
              }
          }
        })

        onChange(normalizedSections)
      } catch {
        alert('Error deleting section')
      } finally {
        setLoading?.(false)
      }

      
      return
    }

    onChange(sections.filter(s => s.id !== id))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sections.map((section, index) => (
              <Draggable
                key={section.id}
                draggableId={section.id ?? `section-${index}`}
                index={index}
              >
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-[10px] border rounded-[7px] p-[10px]"
                  >
                    <>
                      <div className="flex justify-end">
                        <button onClick={() => handleRemove(section.id ?? `section-${index}`)}>
                          Remove
                        </button>
                      </div>
                      <SectionEditor
                        section={section}
                        onChange={s => {
                          const copy = [...sections]
                          copy[index] = s
                          onChange(copy)
                        }}
                      />
                    </>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
