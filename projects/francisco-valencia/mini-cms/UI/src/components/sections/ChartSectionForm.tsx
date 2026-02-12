import { v4 as uuid } from 'uuid'
import type { ChartSection } from '../../types/section'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface ChartSectionFormProps {
  section: ChartSection
  onChange: (s: ChartSection) => void
}

export default function ChartSectionForm({
  section,
  onChange,
}: ChartSectionFormProps) {
  const addItem = () => {
    onChange({
      ...section,
      data: [
        ...section.data,
        { id: uuid(), label: '', value: 0 },
      ],
    })
  }

  const updateItem = (
    id: string,
    field: 'label' | 'value',
    value: string
  ) => {
    onChange({
      ...section,
      data: section.data.map(item =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'value' ? Number(value) || 0 : value,
            }
          : item
      ),
    })
  }

  const removeItem = (id: string) => {
    onChange({
      ...section,
      data: section.data.filter(item => item.id !== id),
    })
  }

  return (
    <div>
      <h4 className="mb-[10px]">
        Chart data
      </h4>

      {section.data.length === 0 && (
        <p className="text-sm text-gray-400">
          No data yet
        </p>
      )}

      {section.data.map(item => (
        <div
          key={item.id}
          className="flex gap-[5px] items-end mb-[10px]"
        >
          <Input
            label="Label"
            value={item.label}
            onChange={e =>
              updateItem(item.id, 'label', e.target.value)
            }
          />

          <Input
            label="Value"
            type="number"
            value={item.value}
            onChange={e =>
              updateItem(item.id, 'value', e.target.value)
            }
          />

          <Button
            onClick={() => removeItem(item.id)}
            className='px-[10px] py-[6px]'
          >
            ✕
          </Button>
        </div>
      ))}

      <Button onClick={addItem}>
        + Add value
      </Button>
    </div>
  )
}
