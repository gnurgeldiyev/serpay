<template>
  <div class="container">
    <el-button type="primary" @click="loginWithGoogle"
      >Login with google</el-button
    >
  </div>
</template>

<script>
import LoginForm from "@/components/Panel/LoginForm";

export default {
  name: "LoginPage",
  components: {
    "login-form": LoginForm,
  },
  methods: {
    async loginWithGoogle() {
      await this.$store.dispatch("editor/login");
      this.$router.push("/@serpay/poets");
    },
  },
  head() {
    return {
      meta: [{ name: "robots", content: "noindex nofollow" }],
    };
  },
};
</script>

<style scoped>
.container {
  width: 360px;
  height: auto;
  margin: 0 auto;
}
</style>
