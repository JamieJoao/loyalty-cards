export const isLoggedUser = () => {
  return Boolean(localStorage.getItem('auth-token'))
}
