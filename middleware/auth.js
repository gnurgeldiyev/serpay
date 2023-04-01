export default async function ({ store, redirect, app, req }) {
  let isAuthenticated = false;

  if (process.server) {
    isAuthenticated = !!app.$cookies.get("accessToken");
  } else if (process.client) {
    isAuthenticated = await new Promise((resolve) => {
      const unsubscribe = store.$fire.auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  if (!isAuthenticated) {
    return redirect("/@serpay/login/");
  }
}
