export default function ({ app, redirect, error }) {
    const id = app.$cookies.get('id')
    if (id) {
        return app.$axios
            .$get(`/api/editors/${id}`)
            .then((res) => {
                if (res.data.role !== 'admin') {
                    return redirect('/@serpay')
                }
            })
            .catch((err) => {
                error({ statusCode: err, message: err.message })
            })
    }
}
