<template>
    <div>
        <poem-view :data="poem" />
    </div>
</template>

<script>
import PoemView from '@/components/PoemView'

export default {
    name: 'PoetPoemPage',
    components: {
        'poem-view': PoemView,
    },
    asyncData({ store, route }) {
        try {
            let poemUrl = route.params.poemUrl
            poemUrl = encodeURI(poemUrl)
            return store.dispatch('poem/fetchOne', poemUrl)
        } catch (err) {
            this.$notify({
                title: 'Error',
                message: 'An error occuried.',
                type: 'danger',
            })
            this.$router.push('/')
        }
    },
    head() {
        return {
            title: this.title,
            meta: [{ hid: 'description', name: 'description', content: this.description }],
        }
    },
    computed: {
        poem() {
            return this.$store.getters['poem/getOne']
        },
        title() {
            const poem = this.$store.getters['poem/getOne']
            if (poem && poem.title && poem.author.fullname) {
                return `${poem.author.fullname}, ${poem.title} • Serpaý Goşgular Çemeni`
            } else {
                return 'Serpaý Goşgular Çemeni'
            }
        },
        description() {
            const poem = this.$store.getters['poem/getOne']
            if (poem && poem.title && poem.author.fullname) {
                return `${poem.author.fullname}, ${poem.title}`
            } else {
                return 'Türkmen edebiýatyndan goşgular çemeni'
            }
        },
    },
    destroyed() {
        this.$store.dispatch('poem/clear')
    },
}
</script>

<style scoped></style>
