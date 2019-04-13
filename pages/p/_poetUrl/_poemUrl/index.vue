<template>
  <div>
    <poem-view :data="poem" />
    <profile-card :data="poet" />
  </div>
</template>

<script>
import PoemView from '@/components/PoemView'
const ProfileCard = () => require('@/components/ProfileCard')

  export default {
    head() {
      return {
        title: this.title,
        meta: [
          { hid: 'description', name: 'description', content: this.description }
        ]
      }
    },
    components: {
      'poem-view': PoemView,
      'profile-card': ProfileCard
    },
    computed: {
      poem() {
        return this.$store.getters['poem/getOne']
      },
      poet() {
        const poem = this.$store.getters['poem/getOne']
        return poem.author
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
      }
    },
    asyncData({ store, route }) {
      let poemUrl = route.params.poemUrl
      poemUrl = encodeURI(poemUrl)
      return store.dispatch('poem/fetchOne', poemUrl)
    },
    destroyed() {
      this.$store.dispatch('poem/clear')
    }
  }
</script>

<style scoped>

</style>
