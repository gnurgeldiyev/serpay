export default function (context) {
  if (context.store.getters["editor/getLoggedIn"]) {
    context.store.dispatch("editor/initAuth");
  }
}
