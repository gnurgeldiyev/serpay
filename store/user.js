// store/index.js
export const state = () => ({
  user: null,
});

export const mutations = {
  SET_USER: (state, { authUser, claims }) => {
    if (!authUser) {
      state.user = null;
    } else {
      state.user = {
        uid: authUser.uid,
        email: authUser.email,
        accessToken: authUser.multiFactor.user.accessToken,
      };
    }
  },
};

export const getters = {
  getToken: (state) => {
    return state.user;
  },
};

export const actions = {
  async onAuthStateChanged({ commit }, { authUser }) {
    if (!authUser) {
      commit("SET_USER", { authUser: null });
    } else {
      commit("SET_USER", { authUser });
    }
  },
  async logout({ commit }) {
    try {
      await this.$fire.auth.signOut();
      this.$cookies.remove("accessToken");
    } catch (error) {
      console.log(error);
    }
  },
};
