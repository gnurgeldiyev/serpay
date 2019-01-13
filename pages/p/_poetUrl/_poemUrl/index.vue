<template>
  <div>
    <poem-view :data="poem" />
  </div>
</template>

<script>
import PoemView from '@/components/PoemView'

  export default {
    components: {
      'poem-view': PoemView
    },
    computed: {
      poem() {
        return this.$store.getters['poem/getOne']
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