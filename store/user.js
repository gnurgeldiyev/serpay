// store/index.js
export const state = () => ({
  user: null,
});

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (!authUser) {
      // User is not logged in.
      state.user = null;
    } else {
      // User is logged in.
      state.user = { uid: authUser.uid, email: authUser.email };
    }
  },
};

export const actions = {
  async onAuthStateChanged({ commit }, { authUser }) {
    console.log("barde");
    if (!authUser) {
      // User is not logged in.
      commit("ON_AUTH_STATE_CHANGED_MUTATION", { authUser: null });
    } else {
      // User is logged in.
      commit("ON_AUTH_STATE_CHANGED_MUTATION", { authUser });
    }
  },
  async logout({ commit }) {
    try {
      await this.$fire.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  },
};
