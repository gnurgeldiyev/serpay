<template>
  <div>
    <poem-view :data="poem" />
  </div>
</template>

<script>
import PoemView from '@/components/PoemView'

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
      'poem-view': PoemView
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
      }
    },
    beforeCreate() {
      const poemUrl = this.$route.params.poemUrl
      this.$store.dispatch('poem/fetchOne', poemUrl)
    },
    destroyed() {
      this.$store.dispatch('poem/clear')
    }
  }
</script>

<style scoped>

</style>