<template>
  <div class="pv">
    <div class="pv_info">
      <h1 class="pv_info_title">{{ data.fullname }}</h1>
      <p class="pv_info_description">
        {{ data.bio }} 
        <a
          v-if="data.wiki_link"
          :href="`${data.wiki_link}`"
          target="_self"
          title="Wikipedia Sahypasy">
          Wikipedia
        </a>
      </p>
      <p class="pv_info_description">
        {{ livedYears }}
      </p>
    </div>
    <div class="pv_media">
      <img 
        :src="'/' + data.avatar"
        :alt="data.fullname"
        class="pv_media_avatar">
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    computed: {
      livedYears() {
        const d = this.data
        let i = ''
        if (d.birth_date) {
          i += d.birth_date
        }
        if (d.death_date) {
          i += ' - ' + d.death_date
        }
        return i
      }
    }
  }
</script>

<style>
@media (max-width: 480px) {
  .pv {
    display: grid;
    grid-template: 1fr;
    grid-template-rows: auto;
    grid-row-gap: 16px;
    padding: 0 0 16px 0;
  }
  .pv_info {
    grid-area: 2;
  }
  .pv_media {
    grid-area: 1;
  }
  .pv_info_title {
    color: #080808;
    font-size: 1.4em;
    line-height: 1;
    font-weight: 600;
    font-family: Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 0.9em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 8px;
  }
  .pv_info_description a {
    color: inherit;
    border-bottom: 1px solid #656565;
    text-decoration: none;
  }
  .pv_media_avatar {
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .pv {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 32px;
    padding: 16px 0;
  }
  .pv_info_title {
    color: #080808;
    font-size: 1.5em;
    line-height: 1;
    font-weight: 600;
    font-family: Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 16px;
  }
  .pv_info_description a {
    color: inherit;
    border-bottom: 1px solid #656565;
    text-decoration: none;
  }
  .pv_media_avatar {
    width: 140px;
    height: 140px;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    float: right;
  }
}
@media (min-width: 768px) and (max-width: 1087px) {
  .pv {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 48px;
    padding: 24px 0;
  }
  .pv_info_title {
    color: #080808;
    font-size: 1.6em;
    line-height: 1;
    font-weight: 600;
    font-family: Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 24px;
  }
  .pv_info_description a {
    color: inherit;
    border-bottom: 1px solid #656565;
    text-decoration: none;
  }
  .pv_info_description a:hover {
    color: #080808;
    border-color: #080808;
    text-decoration: none;
    cursor: pointer;
  }
  .pv_media_avatar {
    width: 160px;
    height: 160px;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    float: right;
  }
}
@media (min-width: 1088px) {
  .pv {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 64px;
    padding: 32px 0;
  }
  .pv_info_title {
    color: #080808;
    font-size: 2em;
    line-height: 1;
    font-weight: 600;
    font-family: Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 32px;
  }
  .pv_info_description a {
    color: inherit;
    border-bottom: 1px solid #656565;
    text-decoration: none;
  }
  .pv_info_description a:hover {
    color: #080808;
    border-color: #080808;
    text-decoration: none;
    cursor: pointer;
  }
  .pv_media_avatar {
    width: 200px;
    height: 200px;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    float: right;
  }
}
</style>