export const state = () => ({
  addFormDialogVisibility: false,
  viewFormDialogVisibility: false,
  editFormDialogVisibility: false,
  inView: {},
  inEdit: {},
  categories: [
    'Söýgi',
    'Durmuş',
    'Watan',
    'Çaga'
  ],
  one: {},
  all: [],
  allUnapproved: []
})

export const getters = {
  getAll: (state) => {
    return state.all
  },
  getAllUnapproved: (state) => {
    return state.allUnapproved
  },
  getOne: (state) => {
    return state.one
  },
  categories: (state) => {
    return state.categories
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
  setAllUnapproved: (state, data) => {
    state.allUnapproved = data
  },
  setOne: (state, data) => {
    state.one = data
  },
  add: (state, data) => {
    state.all.push(data)
  },
  addUnapproved: (state, data) => {
    state.allUnapproved.push(data)
  },
  update: (state, data) => {
    let index
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
  remove: (state, data) => {
    let index
    state.all.map((item, i) => {
      if (item.id === data.id) {
        index = i
      }
      return
    })
    if (index > -1) {
      state.all.splice(index, 1)
    }
  },
  removeUnapproved: (state, data) => {
    let index
    state.allUnapproved.map((item, i) => {
      if (item.id === data.id) {
        index = i
      }
      return
    })
    if (index > -1) {
      state.allUnapproved.splice(index, 1)
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
  fetchAll({ commit }, data) {
    return this.$axios.$get(`/api/poems?poet=${data}`)
      .then((res) => {
        commit('setAll', res.data)
        return {
          status: true,
          error: {}
        }
      })
      .catch((err) => {
        const { error, code } = err.response.data.meta
        if (code === 404) {
          commit('setAll', [])
        }
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      })
  },
  fetchAllUnapproved({ commit }, data) {
    return this.$axios.$get(`/api/poems?approved=false&poet=${data}`)
      .then((res) => {
        commit('setAllUnapproved', res.data)
        return {
          status: true,
          error: {}
        }
      })
      .catch((err) => {
        const { error, code } = err.response.data.meta
        if (code === 404) {
          commit('setAll', [])
        }
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
    return this.$axios.$post('/api/poems', data)
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
    return this.$axios.$put(`/api/poems/${data.id}`, data)
      .then((res) => {
        commit('update', res.data)
        return true
      })
      .catch((err) => {
        const { error } = err.response.data.meta
        console.log(err.response.data)
        return {
          status: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      })
  },
  approve({ commit }, data) {
    return this.$axios.$put(`/api/poems/${data}/approve?approved=true`)
      .then((res) => {
        commit('add', res.data)
        commit('removeUnapproved', res.data)
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
  unapprove({ commit }, data) {
    return this.$axios.$put(`/api/poems/${data}/approve?approved=false`)
      .then((res) => {
        commit('addUnapproved', res.data)
        commit('remove', res.data)
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
  delete({ commit }, data) {
    return this.$axios.$delete(`/api/poems/${data}`)
      .then(() => {
        commit('removeUnapproved', { id: data })
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