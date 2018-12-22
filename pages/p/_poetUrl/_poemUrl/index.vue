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
        return this.$store.getters['poem/one']
      }
    }
  }
</script>

<style scoped>

</style>