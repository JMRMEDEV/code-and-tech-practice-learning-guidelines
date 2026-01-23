import type { Section } from '../../types/section'
import TextSectionForm from './TextSectionForm'
import ImageSectionForm from './ImageSectionForm'
import ChartSectionForm from './ChartSectionForm'


interface Props {
  section: Section
  onChange: (section: Section) => void
}

export default function SectionEditor({ section, onChange }: Props) {
  switch (section.type) {
    case 'text':
      return <TextSectionForm section={section} onChange={onChange} />
    case 'image':
      return <ImageSectionForm section={section} onChange={onChange} />
    case 'chart':
      return <ChartSectionForm section={section} onChange={onChange} />
  }
}
