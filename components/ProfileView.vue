<template>
  <div class="pv">
    <div class="pv_info">
      <h1 class="pv_info_title">{{ profile.name }}</h1>
      <p class="pv_info_description">{{ profile.bio }}</p>
    </div>
    <div class="pv_media">
      <img 
        :src="profile.avatar" 
        :alt="profile.name"
        class="pv_media_avatar">
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      profile: {
        type: Object,
        required: true
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
    font-weight: 700;
    font-family: 'Inria Serif', Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 0.9em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 8px;
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
    font-weight: 700;
    font-family: 'Inria Serif', Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 16px;
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
    font-weight: 700;
    font-family: 'Inria Serif', Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 24px;
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
    font-weight: 700;
    font-family: 'Inria Serif', Georgia, serif;
  }
  .pv_info_description {
    color: #656565;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 400;
    font-family: inherit;
    margin-top: 32px;
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