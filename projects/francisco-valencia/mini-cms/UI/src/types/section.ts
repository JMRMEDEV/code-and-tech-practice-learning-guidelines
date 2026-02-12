export type SectionType = 'text' | 'image' | 'chart'

export type ChartItem = {
  id: string
  label: string
  value: number
}

export interface BaseSection {
  id?: string
  pageId: string
  type: SectionType
}

export interface TextSection extends BaseSection {
  type: 'text'
  heading: string
  body: string
}

export interface ImageSection extends BaseSection {
  type: 'image'
  url: string
  caption: string
}

export interface ChartSection extends BaseSection {
  type: 'chart'
  data: ChartItem[]
}

export type Section = TextSection | ImageSection | ChartSection
