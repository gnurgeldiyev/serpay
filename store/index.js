export const actions = {
    async nuxtServerInit({ dispatch }) {
        await Promise.all([dispatch('poet/fetchAll')])
    },
}
