export default ({ $axios, $auth }) => {
  $auth.onLoggedIn(async (token, refreshToken) => {
    if (token) {
      $axios.setToken(token.accessToken, "Bearer");
    }
  });
};
