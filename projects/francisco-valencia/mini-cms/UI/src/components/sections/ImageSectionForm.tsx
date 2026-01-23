import type { ImageSection } from '../../types/section'
import Input from '../ui/Input'

interface Props {
  section: ImageSection
  onChange: (section: ImageSection) => void
}

export default function ImageSectionForm({ section, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        className="mb-[10px]"
        label="Image URL"
        value={section.url}
        onChange={e =>
          onChange({
            ...section,
            url: e.target.value,
          })
        }
      />
      <Input
        type="text"
        className="mb-[10px]"
        label="Caption"
        value={section.caption}
        onChange={e =>
          onChange({
            ...section,
            caption: e.target.value,
          })
        }
      />


      {section.url && (
        <img
          src={section.url}
          alt="Preview"
          className="mt-2 max-h-40 rounded border max-w-[100%]"
        />
      )}
    </div>
  )
}
