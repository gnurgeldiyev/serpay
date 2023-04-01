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
      try {
        const provider = new this.$fireModule.auth.GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: "select_account",
        });
        await this.$fire.auth.signInWithPopup(provider);
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$cookies.set("accessToken", token);
        this.$axios.setToken(token, "Bearer");
        this.$router.push("/@serpay/poets");
      } catch (error) {
        console.error(error);
      }
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
