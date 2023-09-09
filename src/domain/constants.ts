export const customerCollectionName = import.meta.env.DEV
  ? 'customersTest'
  : 'customers'
export const projectURL = `${(import.meta.env.DEV ? import.meta.env.VITE_GITHUB_URL_DEV : import.meta.env.VITE_GITHUB_URL) + (import.meta.env.DEV ? '' : '#/')}`

export const MAX_ITEMS = 6
export const MAX_HEIGHT_PER_ITEM = 56
