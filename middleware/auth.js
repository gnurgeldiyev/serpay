export default async function ({ store, redirect }) {
  // Wait for the onAuthStateChanged event
  const isAuthenticated = await new Promise((resolve) => {
    const unsubscribe = store.$fire.auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

  // If the user is not authenticated, redirect to the login page.
  if (!isAuthenticated) {
    return redirect("/@serpay/login");
  }
}
