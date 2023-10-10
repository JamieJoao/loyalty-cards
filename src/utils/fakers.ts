export const fakeTimmer = (seconds: number, callback?: () => void) => new Promise(resolve => {
  setTimeout(() => {
    if (callback) callback()
    resolve(null)
  }, seconds * 1000)
})
