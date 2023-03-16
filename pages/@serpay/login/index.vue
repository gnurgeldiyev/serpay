<template>
    <div class="container">
        <login-form />
    </div>
</template>

<script>
import LoginForm from '@/components/Panel/LoginForm'

export default {
    name: 'LoginPage',
    components: {
        'login-form': LoginForm,
    },
    // head() {
    //   return {
    //     meta: [{ name: 'robots', content: 'noindex nofollow' }]
    //   }
    // }
}
</script>

<style scoped>
.container {
    width: 360px;
    height: auto;
    margin: 0 auto;
}
</style>
