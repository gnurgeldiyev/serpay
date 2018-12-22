export const state = () => ({
  addFormDialogVisibility: false,
  viewFormDialogVisibility: false,
  editFormDialogVisibility: false,
  onView: {},
  onEdit: {},
  categories: [
    'Söýgi',
    'Durmuş',
    'Watan',
    'Çaga'
  ],
  one: {
    title: 'Serpaý',
    author: 'Gurbannazar Ezizow',
    year: 1977,
    notes: 'Şahyryň iň soňky ýazan goşgusy.',
    category: ['Söýgi', 'Durmuş'],
    video: 'https://www.youtube.com/embed/i4RPbS1ddbI',
    poem: '<p>Söýüň meni &mdash; ýürek söýgi küýseýär,</p><p>Şeýle bir küýseýär &mdash; ýok çaky-çeni.&nbsp;</p><p>Ýekeje adama ýeterlik söýgi</p><p>Bilen&nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; bir pursatlyk söýüň siz meni.&nbsp;</p><p><br></p><p>Maňa k&auml;n zat,</p><p>Uly bir zat gerek d&auml;l,</p><p>Eliňizi &yacute;&uuml;regňize go&yacute;uň siz:</p><p>Size s&ouml;&yacute;gi bilen &yacute;&uuml;zlen&yacute;&auml;n g&uuml;nlem&nbsp;</p><p>S&ouml;zlerimi kes&auml; &ccedil;ekm&auml;n s&ouml;&yacute;&uuml;ň siz.&nbsp;</p><p><br></p><p>Söýüň meni &mdash; ähli erki hem durky&nbsp;</p><p>Bilen size tarap ýollar çekeni.</p><p>&Yacute;eke &ouml;z&uuml;ň s&ouml;&yacute;&uuml;p &yacute;&ouml;rseň elmydam&nbsp;</p><p>Birazajyk agyr düşjek ekeni.&nbsp;</p><p><br></p><p>Söýüň meni siziň sadyk guluňyz,&nbsp;</p><p>Soňra menden size galar şeýle paý,&nbsp;</p><p>Men size bahasyz serpaý ederin &mdash;&nbsp;</p>Şalaryň elinden gelmejek serpaý.'
  },
  all: [
    {
      title: 'Serpaý',
      url: 'serpay',
      author: 'Gurbannazar Ezizow',
      year: '1977',
      notes: 'Şahyryň iň soňky ýazan goşgusy.',
      category: ['Söýgi', 'Durmuş'],
      video: 'https://www.youtube.com/embed/i4RPbS1ddbI',
      poem: '<p>Söýüň meni &mdash; ýürek söýgi küýseýär,</p><p>Şeýle bir küýseýär &mdash; ýok çaky-çeni.&nbsp;</p><p>Ýekeje adama ýeterlik söýgi</p><p>Bilen&nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; bir pursatlyk söýüň siz meni.&nbsp;</p><p><br></p><p>Maňa k&auml;n zat,</p><p>Uly bir zat gerek d&auml;l,</p><p>Eliňizi &yacute;&uuml;regňize go&yacute;uň siz:</p><p>Size s&ouml;&yacute;gi bilen &yacute;&uuml;zlen&yacute;&auml;n g&uuml;nlem&nbsp;</p><p>S&ouml;zlerimi kes&auml; &ccedil;ekm&auml;n s&ouml;&yacute;&uuml;ň siz.&nbsp;</p><p><br></p><p>Söýüň meni &mdash; ähli erki hem durky&nbsp;</p><p>Bilen size tarap ýollar çekeni.</p><p>&Yacute;eke &ouml;z&uuml;ň s&ouml;&yacute;&uuml;p &yacute;&ouml;rseň elmydam&nbsp;</p><p>Birazajyk agyr düşjek ekeni.&nbsp;</p><p><br></p><p>Söýüň meni siziň sadyk guluňyz,&nbsp;</p><p>Soňra menden size galar şeýle paý,&nbsp;</p><p>Men size bahasyz serpaý ederin &mdash;&nbsp;</p>Şalaryň elinden gelmejek serpaý.'
    },
    {
      title: 'Gözledim Seni',
      url: 'gozledim-seni',
      author: 'Gurbannazar Ezizow',
      year: '',
      notes: 'Şahyryň iň soňky ýazan goşgusy.',
      category: ['Söýgi', 'Durmuş'],
      video: 'https://www.youtube.com/embed/i4RPbS1ddbI',
      poem: '<p>Bahar güller açanda,&nbsp;&nbsp;</p><p>Saýrap, guşlar uçanda,&nbsp;&nbsp;</p><p>Güneş nurun saçanda,&nbsp;&nbsp;</p><p>Janym, gözledim seni.</p><p><br></p><p>Ýodalardan, ýollardan,&nbsp;&nbsp;</p><p>Uzak-uzak illerden,&nbsp;&nbsp;</p><p>Gülälekli gollardan,&nbsp;&nbsp;</p><p>Gülüm, gözledim seni.</p><p><br></p><p>Bakdym belent daglara,&nbsp;&nbsp;</p><p>Serçemenli baglara,&nbsp;&nbsp;</p><p>- Gel, läläm, gara maña! –&nbsp;&nbsp;</p><p>Diýip, yzladym seni.</p><p><br></p><p>Ýürek aglar gün-günden,&nbsp;&nbsp;</p><p>Aý gyz, gizlenme menden.&nbsp;&nbsp;</p><p>Gara gözleñ içinden&nbsp;&nbsp;</p><p>Saýlap gözledim seni.</p>'
    },
    {
      title: 'Serpaý',
      url: 'serpay',
      author: 'Gurbannazar Ezizow',
      year: '1977',
      notes: 'Şahyryň iň soňky ýazan goşgusy.',
      category: ['Söýgi', 'Durmuş'],
      video: 'https://www.youtube.com/embed/i4RPbS1ddbI',
      poem: '<p>Söýüň meni &mdash; ýürek söýgi küýseýär,</p><p>Şeýle bir küýseýär &mdash; ýok çaky-çeni.&nbsp;</p><p>Ýekeje adama ýeterlik söýgi</p><p>Bilen&nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; bir pursatlyk söýüň siz meni.&nbsp;</p><p><br></p><p>Maňa k&auml;n zat,</p><p>Uly bir zat gerek d&auml;l,</p><p>Eliňizi &yacute;&uuml;regňize go&yacute;uň siz:</p><p>Size s&ouml;&yacute;gi bilen &yacute;&uuml;zlen&yacute;&auml;n g&uuml;nlem&nbsp;</p><p>S&ouml;zlerimi kes&auml; &ccedil;ekm&auml;n s&ouml;&yacute;&uuml;ň siz.&nbsp;</p><p><br></p><p>Söýüň meni &mdash; ähli erki hem durky&nbsp;</p><p>Bilen size tarap ýollar çekeni.</p><p>&Yacute;eke &ouml;z&uuml;ň s&ouml;&yacute;&uuml;p &yacute;&ouml;rseň elmydam&nbsp;</p><p>Birazajyk agyr düşjek ekeni.&nbsp;</p><p><br></p><p>Söýüň meni siziň sadyk guluňyz,&nbsp;</p><p>Soňra menden size galar şeýle paý,&nbsp;</p><p>Men size bahasyz serpaý ederin &mdash;&nbsp;</p>Şalaryň elinden gelmejek serpaý.'
    },
    {
      title: 'Gözledim Seni',
      url: 'gozledim-seni',
      author: 'Gurbannazar Ezizow',
      year: '',
      notes: '',
      category: ['Söýgi', 'Durmuş'],
      video: 'https://www.youtube.com/embed/i4RPbS1ddbI',
      poem: '<p>Bahar güller açanda,&nbsp;&nbsp;</p><p>Saýrap, guşlar uçanda,&nbsp;&nbsp;</p><p>Güneş nurun saçanda,&nbsp;&nbsp;</p><p>Janym, gözledim seni.</p><p><br></p><p>Ýodalardan, ýollardan,&nbsp;&nbsp;</p><p>Uzak-uzak illerden,&nbsp;&nbsp;</p><p>Gülälekli gollardan,&nbsp;&nbsp;</p><p>Gülüm, gözledim seni.</p><p><br></p><p>Bakdym belent daglara,&nbsp;&nbsp;</p><p>Serçemenli baglara,&nbsp;&nbsp;</p><p>- Gel, läläm, gara maña! –&nbsp;&nbsp;</p><p>Diýip, yzladym seni.</p><p><br></p><p>Ýürek aglar gün-günden,&nbsp;&nbsp;</p><p>Aý gyz, gizlenme menden.&nbsp;&nbsp;</p><p>Gara gözleñ içinden&nbsp;&nbsp;</p><p>Saýlap gözledim seni.</p>'
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
    // return this.$axios.$post('/api/admin/stories/', { story })
    //   .then((response) => {
    //     commit('addNew', response.story);
    //     return true;
    //   })
    //   .catch(() => {
    //     return false;
    //   });
  },
  approve({ commit }, data) {
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