export const state = () => ({
  addFormDialogVisibility: false,
  resetFormDialogVisibility: false,
  editFormDialogVisibility: false,
  actives: [],
  deactives: [],
  inEdit: {},
  inReset: {},
  one: {},
  token: null,
  loggedIn: false,
});

export const getters = {
  getAll: (state) => {
    return state.actives;
  },
  getDeactivated: (state) => {
    return state.deactives;
  },
  getLoggedIn: (state) => {
    return state.loggedIn;
  },
  getOne: (state) => {
    return state.one;
  },
  getToken: (state) => {
    return state.token;
  },
  addFormDialogVisibility: (state) => {
    return state.addFormDialogVisibility;
  },
  resetFormDialogVisibility: (state) => {
    return state.resetFormDialogVisibility;
  },
  editFormDialogVisibility: (state) => {
    return state.editFormDialogVisibility;
  },
  inReset: (state) => {
    return state.inReset;
  },
  inEdit: (state) => {
    return state.inEdit;
  },
};

export const mutations = {
  setAll: (state, data) => {
    state.actives = data;
  },
  setDeactivated: (state, data) => {
    state.deactives = data;
  },
  setOne: (state, data) => {
    state.one = data;
  },
  loggedIn: (state, data) => {
    state.loggedIn = data;
  },
  setToken: (state, token) => {
    state.token = token;
  },
  clearToken: (state) => {
    state.token = null;
  },
  add: (state, data) => {
    state.actives.unshift(data);
  },
  update: (state, data) => {
    let index;
    state.actives.map((item, i) => {
      if (item.id === data.id) {
        index = i;
      }
    });
    if (index > -1) {
      state.actives.splice(index, 1, data);
    }
  },
  deactivate: (state, data) => {
    let index;
    state.actives.map((item, i) => {
      if (item.id === data.id) {
        index = i;
      }
    });
    const deactived = state.actives.splice(index, 1);
    state.deactives.push(deactived[0]);
  },
  addFormDialogVisibility: (state, data) => {
    state.addFormDialogVisibility = data;
  },
  resetFormDialogVisibility: (state, data) => {
    state.resetFormDialogVisibility = data;
  },
  editFormDialogVisibility: (state, data) => {
    state.editFormDialogVisibility = data;
  },
  inReset: (state, data) => {
    state.inReset = data;
  },
  inEdit: (state, data) => {
    state.inEdit = data;
  },
};

export const actions = {
  fetchAll({ commit }) {
    return this.$axios
      .$get("/api/editors/")
      .then((res) => {
        commit("setAll", res.data);
        return {
          status: true,
          error: {},
        };
      })
      .catch((err) => {
        const { error } = err.response.data.meta;
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
      });
  },
  fetchDeactivated({ commit }) {
    return this.$axios
      .$get("/api/editors?d=true")
      .then((res) => {
        commit("setDeactivated", res.data);
        return {
          status: true,
          error: {},
        };
      })
      .catch((err) => {
        const { error } = err.response.data.meta;
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
      });
  },
  async login({ commit }, data) {
    try {
      const provider = new this.$fireModule.auth.GoogleAuthProvider();
      const { user } = await this.$fire.auth.signInWithPopup(provider);
      const token = await user.getIdToken();
      this.$axios.setToken(token, "Bearer");
      this.$cookies.set("accessToken", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      commit("loggedIn", true);
    } catch (error) {
      return {
        status: false,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
  },
  initAuth({ commit, state }) {
    const token = this.$cookies.get("accessToken");
    if (!token) {
      commit("clearToken");
    } else {
      commit("setToken", token);
    }
  },
  logout({ commit }, data) {
    this.$cookies.remove("accessToken");
    this.$fire.auth.signOut();
    commit("loggedIn", false);
    commit("clearToken");
  },
  add({ commit }, data) {
    return this.$axios
      .$post("/api/editors", data)
      .then((res) => {
        commit("add", res.data);
        return {
          status: true,
          error: {},
        };
      })
      .catch((err) => {
        const { error } = err.response.data.meta;
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
      });
  },
  update({ commit }, data) {
    return this.$axios
      .$put(`/api/editors/${data.id}`, data)
      .then((res) => {
        commit("update", res.data);
        return true;
      })
      .catch((err) => {
        const { error } = err.response.data.meta;
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
      });
  },
  deactivate({ commit }, data) {
    return this.$axios
      .$put(`/api/editors/${data.id}/deactivate`)
      .then((res) => {
        commit("deactivate", res.data);
        return true;
      })
      .catch((err) => {
        const { error } = err.response.data.meta;
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
      });
  },
  resetPassword({ commit }, data) {
    return this.$axios
      .$put(`/api/editors/${data.id}/reset`, data)
      .then((res) => {
        return true;
      })
      .catch((err) => {
        const { error } = err.response.data.meta;
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
      });
  },
  addFormDialogVisibility({ commit }, data) {
    commit("addFormDialogVisibility", data);
  },
  resetFormDialogVisibility({ commit }, data) {
    commit("resetFormDialogVisibility", data);
  },
  editFormDialogVisibility({ commit }, data) {
    commit("editFormDialogVisibility", data);
  },
  inReset({ commit }, data) {
    commit("inReset", data);
  },
  inEdit({ commit }, data) {
    commit("inEdit", data);
  },
};
