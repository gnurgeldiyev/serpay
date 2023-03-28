<template>
  <div>Loading...</div>
</template>

<script>
export default {
  // async asyncData({ $auth, query, redirect }) {
  //   try {
  //     await $auth.loginWith("google", {
  //       params: {
  //         code: query.code,
  //       },
  //     });

  //     return {
  //       redirect: "/",
  //     };
  //   } catch (error) {
  //     console.error(error);

  //     return {
  //       redirect: "/login",
  //     };
  //   }
  // },

  async created() {
    console.log("queries", this.$route.query);
    await this.$auth.loginWith("google", {
      params: {
        code: this.$route.query.code,
      },
    });
    const user = await this.$auth.fetchUser();
    console.log(user);
    // this.$auth.setUserToken(this.$auth.strategy.token.get());
    // this.$router.push("/");
  },
};
</script>
