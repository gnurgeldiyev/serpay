<template>
  <div>
    <profile-view :data="poet" />
    <h1 class="title">Goşgylar</h1>
    <poem-list 
      :data="poems"
      :poet="poet" />
  </div>
</template>

<script>
import ProfileView from '@/components/ProfileView'
import PoemList from '@/components/PoemList'

  export default {
    components: {
      'profile-view': ProfileView,
      'poem-list': PoemList
    },
    computed: {
      poet() {
        return this.$store.getters['poet/getOne']
      },
      poems() {
        return this.$store.getters['poem/getAll']
      }
    },
    async beforeCreate() {
      const poetUrl = this.$route.params.poetUrl
      let result = await this.$store.dispatch('poet/fetchOne', poetUrl)
      const poet = this.$store.getters['poet/getOne']
      this.$store.dispatch('poem/fetchAll', poet.id)
    },
    destroyed() {
      this.$store.dispatch('poet/clear')
    }
  }
</script>

<style scoped>

</style>