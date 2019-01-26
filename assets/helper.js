export const unlinkObj = (o) => {
  if (o) {
    return JSON.parse(JSON.stringify(o))
  }
  return
}