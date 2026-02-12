import type { Page } from '../types/page'
import { http } from './http'

export const getPages = (): Promise<Page[]> => http('/pages', { method: 'GET' })
export const getPageById = (id: string) => http(`/pages/${id}`)
export const createPage = (page: Page) =>
  http('/pages', { method: 'POST', body: JSON.stringify(page) })
export const updatePage = (id: string, page: Page) =>
  http(`/pages/${id}`, { method: 'PATCH', body: JSON.stringify(page) })
export const deletePage = (id: string) =>
  http(`/pages/${id}`, { method: 'DELETE' })
export const getPageBySlug = (slug: string) => http(`/published/${slug}`, { method: 'GET' })
