export default function(context) {
  const id = context.app.$cookies.get('id')
  if (id) {
    return context.app.$axios.$get(`/api/editors/${id}`)
    .then((res) => {
      context.store.commit('editor/setOne', res.data)
      context.store.dispatch('editor/initAuth')
    })
    .catch((err) => {
      context.error({ statusCode: err, message: err.message })
    })
  }
} 