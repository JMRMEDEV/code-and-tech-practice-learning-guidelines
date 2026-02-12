import type { Page } from '../types/page'
import type { Section } from '../types/section'

export const normalizePagePayload = (page: Page) => ({
  title: page.title,
  slug: page.slug,
})

export const normalizeSectionsPayload = (section: Section, pageId: string) => {
    switch (section.type) {
      case 'text':
        return { pageId, type: 'text', data: { body: section.body, heading: section.heading } }
      case 'image':
        return { pageId, type: 'image', data: { url: section.url, caption: section.caption } }
      case 'chart':
        return { pageId, type: 'chart', data: { values: section.data.map(item => item.value), labels: section.data.map(item => item.label) } }
    }
  }