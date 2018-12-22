export const state = () => ({
  addFormDialogVisibility: false,
  viewFormDialogVisibility: false,
  editFormDialogVisibility: false,
  onView: {},
  onEdit: {},
  one: {
    url: 'gurbannazar-ezizow',
    name: 'Gurbannazar Ezizow',
    avatar: 'https://pbs.twimg.com/profile_images/425363604968591361/7tTT1z33_400x400.jpeg',
    bio: 'Gurbannazar Ezizow - talantly türkmen şahyry, Türkmenistanyň Magtymguly adyndaky Döwlet baýragynyň eýesi.'
  },
  all: [
    {
      name: 'Gurbannazar Ezizow',
      avatar: 'https://pbs.twimg.com/profile_images/425363604968591361/7tTT1z33_400x400.jpeg',
      total: 139,
      url: 'gurbannazar-ezizow'
    },
    {
      name: 'Magtymguly Pyragy',
      avatar: 'https://pbs.twimg.com/profile_images/1079796065/magtymguly2_400x400.jpg',
      total: 234,
      url: 'magtymguly'
    },
    {
      name: 'Berdinazar Hudaýnazarow',
      avatar: 'http://gollanma.com/wp-content/uploads/2012/02/Berdinazar-Hudaynazarow-new.jpg',
      total: 127,
      url: 'berdinazar-hudaynazarow'
    }
  ]
})

export const getters = {
  all: (state) => {
    return state.all
  },
  one: (state) => {
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
  onView: (state) => {
    return state.onView
  },
  onEdit: (state) => {
    return state.onEdit
  }
}

export const mutations = {
  all: (state, data) => {
    state.all = data
  },
  one: (state, data) => {
    state.one = data
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
  onView: (state, data) => {
    state.onView = data
  },
  onEdit: (state, data) => {
    state.onEdit = data
  }
}

export const actions = {
  add({ commit }, data) {
    console.log(data)
    return true
  },
  delete({ commit }, data) {
    console.log(data)
    return true
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
  onView({ commit }, data) {
    commit('onView', data)
  },
  onEdit({ commit }, data) {
    commit('onEdit', data)
  }
}