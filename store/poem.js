export const state = () => ({
  poem: {
    title: 'Serpaý',
      author: 'Gurbannazar Ezizow',
      year: 1977,
      notes: 'gurbannazar-ezizow',
      category: ['Söýgi', 'Durmuş'],
      poem: '<p>Söýüň meni &mdash; ýürek söýgi küýseýär,</p><p>Şeýle bir küýseýär &mdash; ýok çaky-çeni.&nbsp;</p><p>Ýekeje adama ýeterlik söýgi</p><p>&nbsp;Bilen&nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; bir pursatlyk söýüň siz meni.&nbsp;</p><p><br></p><p>Maňa k&auml;n zat,</p><p>Uly bir zat gerek d&auml;l,</p><p>Eliňizi &yacute;&uuml;regňize go&yacute;uň siz:</p><p>Size s&ouml;&yacute;gi bilen &yacute;&uuml;zlen&yacute;&auml;n g&uuml;nlem&nbsp;</p><p>S&ouml;zlerimi kes&auml; &ccedil;ekm&auml;n s&ouml;&yacute;&uuml;ň siz.&nbsp;</p><p><br></p><p>Söýüň meni &mdash; ähli erki hem durky&nbsp;</p><p>Bilen size tarap ýollar çekeni.</p><p>&Yacute;eke &ouml;z&uuml;ň s&ouml;&yacute;&uuml;p &yacute;&ouml;rseň elmydam&nbsp;</p><p>Birazajyk agyr düşjek ekeni.&nbsp;</p><p><br></p><p>Söýüň meni siziň sadyk guluňyz,&nbsp;</p><p>Soňra menden size galar şeýle paý,&nbsp;</p><p>Men size bahasyz serpaý ederin &mdash;&nbsp;</p>'
  },
  poems: [
    {
      title: 'Serpaý',
      url: 'serpay'
    },
    {
      title: '«Adamlary özgerdýän şahyrdyr»',
      url: 'serpay'
    },
    {
      title: 'Sähram',
      url: 'serpay'
    },
    {
      title: 'Göwnüm',
      url: 'serpay'
    },
    {
      title: 'Meniň aslyýetim',
      url: 'serpay'
    },
    {
      title: 'Gözüm düşdi',
      url: 'serpay'
    }
  ]
})

export const getters = {
  getAll: (state) => {
    return state.poems
  },
  getOne: (state) => {
    return state.poem
  }
}

export const mutations = {
  setAll: (state, data) => {
    state.poems = data
  },
  setOne: (state, data) => {
    state.poem = data
  }
}

export const actions = {

}