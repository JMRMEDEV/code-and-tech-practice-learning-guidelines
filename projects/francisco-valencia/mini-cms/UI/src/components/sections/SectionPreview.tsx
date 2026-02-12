import type { Section } from '../../types/section'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'

export default function SectionPreview({ section }: { section: Section }) {
  if (section.type === 'text')
    return (
      <div className="mb-[10px]">
        <h3>{section.heading}</h3>
        <p className="break-words whitespace-pre-wrap max-w-[100%]">{section.body}</p>
      </div>
    )

  if (section.type === 'image')
    return <img src={section.url} className="mb-[10px] max-w-sm max-w-[100%]" />

  if (section.type === 'chart') {
    const data = section.data.map((chartItem) => ({ value: chartItem.value, label: chartItem.label }))
    return (
      <LineChart width={500} height={250} data={data} className="max-w-[100%] mb-[10px]">
        <Line type="monotone" dataKey="value" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="label" />
        <YAxis dataKey="value" />
      </LineChart>
    )
  }
}
