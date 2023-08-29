export const customerCollectionName = 'customers'
export const projectURL = `${import.meta.env.DEV
  ? import.meta.env.VITE_GITHUB_URL_DEV
  : import.meta.env.VITE_GITHUB_URL
  }#/`