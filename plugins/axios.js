export default function ({ $axios, $cookies }) {
  const token = $cookies.get("accessToken");
  $axios.setToken(token, "Bearer");
}
