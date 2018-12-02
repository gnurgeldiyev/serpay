export const state = () => ({
  poet: {
    url: 'gurbannazar-ezizow',
    name: 'Gurbannazar Ezizow',
    avatar: 'https://pbs.twimg.com/profile_images/425363604968591361/7tTT1z33_400x400.jpeg',
    bio: 'Gurbannazar Ezizow - talantly türkmen şahyry, Türkmenistanyň Magtymguly adyndaky Döwlet baýragynyň eýesi.'
  },
  poets: [
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
    },
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
  getAll: (state) => {
    return state.poets
  },
  getOne: (state) => {
    return state.poet
  }
}

export const mutations = {
  setAll: (state, data) => {
    state.poets = data
  },
  setOne: (state, data) => {
    state.poet = data
  }
}

export const actions = {
  
}