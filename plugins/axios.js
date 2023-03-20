export default function ({ $axios, store }) {
  $axios.setToken(store.state.editor.token, "Bearer");
}
