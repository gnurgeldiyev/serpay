<template>
  <div>
    <profile-view :data="poet" />
    <h1 class="title">
      Goşgular
    </h1>
    <poem-list
      :data="poems"
      :poet="poet"
    />
  </div>
</template>

<script>
import ProfileView from '@/components/ProfileView'
import PoemList from '@/components/PoemList'

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
      'profile-view': ProfileView,
      'poem-list': PoemList
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
      try {
        let poetUrl = route.params.poetUrl
        poetUrl = encodeURI(poetUrl)
        await store.dispatch('poet/fetchOne', poetUrl)
        const poet = store.getters['poet/getOne']
        return store.dispatch('poem/fetchAll', poet.id)
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: 'An error occuried.',
          type: 'danger'
        })
        this.$router.push('/')
      }
    },
    destroyed() {
      this.$store.dispatch('poet/clear')
    }
  }
</script>

<style scoped>

</style>
