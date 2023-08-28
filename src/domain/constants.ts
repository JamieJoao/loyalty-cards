export const customerCollectionName = 'customers'
export const linkToCustomer = `${import.meta.env.DEV
  ? import.meta.env.VITE_GITHUB_URL_DEV
  : import.meta.env.VITE_GITHUB_URL
  }preview/`