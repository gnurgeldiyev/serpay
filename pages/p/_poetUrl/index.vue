<template>
  <div>
    <profile-view 
      v-if="poet && poet.fullname"
      :data="poet" />
    <h1 class="title">Goşgular</h1>
    <poem-list 
      v-if="poems && poems.length > 0"
      :data="poems"
      :poet="poet" />
  </div>
</template>

<script>
  export default {
    head () {
      return {
        title: this.title,
        meta: [
          { hid: 'description', name: 'description', content: `${this.poet.fullname} goşgulary` }
        ]
      }
    },
    components: {
      'profile-view': () => import('@/components/ProfileView'),
      'poem-list': () => import('@/components/PoemList')
    },
    computed: {
      poet() {
        return this.$store.getters['poet/getOne']
      },
      poems() {
        return this.$store.getters['poem/getAll']
      },
      title() {
        const poet = this.$store.getters['poet/getOne']
        if (poet && poet.fullname) {
          return `${poet.fullname} • Serpaý Goşgular Çemeni`
        } else {
          return 'Serpaý Goşgular Çemeni'
        }
      }
    },
    async asyncData({ store, route }) {
      let poetUrl = route.params.poetUrl
      poetUrl = encodeURI(poetUrl)
      await store.dispatch('poet/fetchOne', poetUrl)
      const poet = store.getters['poet/getOne']
      return store.dispatch('poem/fetchAll', poet.id)
    },
    destroyed() {
      this.$store.dispatch('poet/clear')
    }
  }
</script>

<style scoped>

</style>