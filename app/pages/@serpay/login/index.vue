<template>
  <div class="container">
    <login-form />
  </div>
</template>

<script>
import LoginForm from '@/components/Panel/LoginForm'

  export default {
    head() {
      return {
        meta: [{ name: 'robots', content: 'noindex nofollow' }]
      }
    },
    components: {
      'login-form': LoginForm
    } 
  }
</script>

<style scoped>
.container {
  width: 360px;
  height: auto;
  margin: 0 auto;
}
</style>