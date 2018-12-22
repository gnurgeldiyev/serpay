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
        return this.$store.getters['poet/one']
      },
      poems() {
        return this.$store.getters['poem/all']
      }
    },
    beforeCreate() {
      const poetUrl = this.$route.params.poetUrl
    }
  }
</script>

<style scoped>

</style>