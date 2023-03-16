export default function (context) {
    const token = context.app.$cookies.get('token')
    if (context.store.getters['editor/getToken'] !== token) {
        context.redirect('/@serpay/login')
    }
}
