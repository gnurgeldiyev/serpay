const Poem = require('../models/poem')
const { isEmpty, matches, isMongoId, unescape } = require('validator')

/**
 * d: request body data
*/
exports.validateData = async (d) => {
  const youtubeEmbedRgx = /^(https\:\/\/www\.youtube\.com\/embed)\/.+$/g
  try {
    if (
      (!d.title || isEmpty(d.title))
      || (!d.author || !isMongoId(d.author))
      || (d.year && !matches(d.year, /[0-9]/g))
      || (!d.content || isEmpty(d.content))
      || (d.youtube_link && !matches(d.youtube_link, youtubeEmbedRgx))
      || (!d.category || d.category.length === 0)
      || (!d.added_by || !isMongoId(d.added_by))
    ) { 
      return {
        status: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Data validation error'
        }
      }
    }
    // for updates
    if (d.id && isMongoId(d.id)) {
      let poem = await Poem.findById(d.id)
      if (poem && poem.title === d.title) {
        return {
          status: true,
          data: {}
        }
      }
    }
    // fullname check, fullname field must be unique
    let poem = await Poem.findOne({ title: d.title, author: d.author })
    if (!poem) {
      return {
        status: true,
        data: {}
      }
    }
    return {
      status: false,
      error: {
        code: 'EXISTING_POEM',
        message: 'Poem exists for that poet'
      }
    }
  } catch (err) {
    return {
      status: false,
      error: {
        code: err.code,
        message: err.message
      }
    }
  }
}

/**
 * d: single poem document
*/
exports.toPublic = (d) => {
  try {
    const added_by = addedToPublic(d.added_by)
    const author = authorToPublic(d.author)
    const publicData = {
      id: d._id,
      title: d.title,
      url: d.url,
      author,
      year: d.year,
      content: unescape(d.content),
      notes: d.notes,
      youtube_link: d.youtube_link,
      category: d.category,
      is_approved: d.is_approved,
      added_by,
      created_at: d.created_at
    }
    return publicData
  } catch (err) {
    return {
      status: false,
      error: {
        code: err.code,
        message: err.message
      }
    }
  }
}

/** 
 * d: single editor document
*/
const addedToPublic = (d) => {
  return {
    id: d._id,
    firstname: d.firstname,
    lastname: d.lastname,
    email: d.email,
    role: d.role,
    created_at: d.created_at
  }
}

/** 
 * d: single poet document
*/
const authorToPublic = (d) => {
  return {
    id: d._id,
    fullname: d.fullname,
    url: d.url,
    birth_date: d.birth_date,
    death_date: d.death_date,
    bio: d.bio,
    wiki_link: d.wiki_link,
    avatar: d.avatar,
    created_at: d.created_at
  }
}