import type { Section } from '../types/section'
import { http } from './http'

export const getSections = (): Promise<Section[]> => http('/sections', { method: 'GET' })
export const getSectionsByPageId = (id: string) => http(`/sections/page/${id}`, { method: 'GET' })
export const createSection = (section: Section) =>
  http('/sections', { method: 'POST', body: JSON.stringify(section) })
export const updateSection = (id: string, section: Section) =>
  http(`/sections/${id}`, { method: 'PATCH', body: JSON.stringify(section) })
export const deleteSection = (id: string) =>
  http(`/sections/${id}`, { method: 'DELETE' })
