import type { TextSection } from '../../types/section'
import Input from '../ui/Input'

interface Props {
  section: TextSection
  onChange: (section: TextSection) => void
}

export default function TextSectionForm({ section, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Text content</label>
      <Input
        type="text"
        className="mb-[10px]"
        label="Heading"
        value={section.heading}
        onChange={e =>
          onChange({
            ...section,
            heading: e.target.value,
          })
        }
      />
      <textarea
        className="w-full border rounded px-3 py-2 min-h-[100px]"
        placeholder="Write your content here..."
        value={section.body}
        onChange={e =>
          onChange({
            ...section,
            body: e.target.value,
          })
        }
      />
    </div>
  )
}
