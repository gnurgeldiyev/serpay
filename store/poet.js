export const state = () => ({
  addFormDialogVisibility: false,
  viewFormDialogVisibility: false,
  editFormDialogVisibility: false,
  inView: {},
  inEdit: {},
  one: {},
  all: []
})

export const getters = {
  getAll: (state) => {
    return state.all
  },
  getOne: (state) => {
    return state.one
  },
  addFormDialogVisibility: (state) => {
    return state.addFormDialogVisibility
  },
  viewFormDialogVisibility: (state) => {
    return state.viewFormDialogVisibility
  },
  editFormDialogVisibility: (state) => {
    return state.editFormDialogVisibility
  },
  inView: (state) => {
    return state.inView
  },
  inEdit: (state) => {
    return state.inEdit
  }
}

export const mutations = {
  setAll: (state, data) => {
    state.all = data
  },
  setOne: (state, data) => {
    state.one = data
  },
  add: (state, data) => {
    state.all.push(data)
  },
  update: (state, data) => {
    let index;
    state.all.map((item, i) => {
      if (item.id === data.id) {
        index = i
      }
      return
    })
    if (index > -1) {
      state.all.splice(index, 1, data)
    }
  },
  delete: (state, data) => {
    let index;
    state.all.map((item, i) => {
      if (item.id === data) {
        index = i
      }
      return
    })
    if (index > -1) {
      state.all.splice(index, 1)
    }
  },
  addFormDialogVisibility: (state, data) => {
    state.addFormDialogVisibility = data
  },
  viewFormDialogVisibility: (state, data) => {
    state.viewFormDialogVisibility = data
  },
  editFormDialogVisibility: (state, data) => {
    state.editFormDialogVisibility = data
  },
  inView: (state, data) => {
    state.inView = data
  },
  inEdit: (state, data) => {
    state.inEdit = data
  }
}

export const actions = {
  fetchAll({ commit }) {
    return this.$axios.$get('/api/poets/')
      .then((res) => {
        commit('setAll', res.data)
        return {
          status: true,
          error: {}
        }
      })
      .catch((err) => {
        const { error } = err.response.data.meta
        console.log(error)
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      })
  },
  add({ commit }, data) {
    return this.$axios.$post('/api/poets', data)
      .then((res) => {
        commit('add', res.data)
        return {
          status: true,
          error: {}
        }
      })
      .catch((err) => {
        const { error } = err.response.data.meta
        console.log(error)
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      })
  },
  update({ commit }, data) {
    return this.$axios.$put(`/api/poets/${data.id}`, data)
      .then((res) => {
        commit('update', res.data)
        return true
      })
      .catch((err) => {
        const { error } = err.response.data.meta
        console.log(error)
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      })
  },
  delete({ commit }, data) {
    return this.$axios.$put(`/api/poets/${data}/delete`)
      .then(() => {
        commit('delete', data)
        return true
      })
      .catch((err) => {
        const { error } = err.response.data.meta
        console.log(error)
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      })
  },
  addFormDialogVisibility({ commit }, data) {
    commit('addFormDialogVisibility', data)
  },
  viewFormDialogVisibility({ commit }, data) {
    commit('viewFormDialogVisibility', data)
  },
  editFormDialogVisibility({ commit }, data) {
    commit('editFormDialogVisibility', data)
  },
  inView({ commit }, data) {
    commit('inView', data)
  },
  inEdit({ commit }, data) {
    commit('inEdit', data)
  }
}