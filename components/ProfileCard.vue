<template>
  <nuxt-link 
    :to="'/p/' + data.url"
    :title="'Şahyr ' + data.fullname"
    class="a"
  >
    <div class="pc">
      <div class="pc_media">
        <img 
          :src="'/' + data.avatar" 
          :alt="data.fullname"
          class="pc_media_avatar"
        >
      </div>
      <div class="pc_info">
        <p class="pc_info_title">
          {{ data.fullname }}
        </p>
        <p 
          v-if="total > 0"
          class="pc_info_subtitle"
        >
          {{ total }} goşgy
        </p>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        required: true
      },
      total: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style>
.a,
.a:hover,
.a:active,
.a:visited {
  color: inherit;
  text-decoration: none;
}
@media (max-width: 480px) {
  .pc {
    width: 100%;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 4fr;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .pc_media {
    width: 80px;
    height: 78px;
    grid-area: 'media';
  }
  .pc_media_avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .pc_info {
    width: 100%;
    height: 100%;
    grid-area: 'info';
    text-align: left;
    display: grid;
    align-items: center;
    padding: 4px 8px;
  }
  .pc_info_title {
    display: inline;
    color: #080808;
    font-size: 0.9em;
    font-weight: 500;
    font-family: inherit;
  }
  .pc_info_subtitle {
    display: inline;
    color: #656565;
    font-size: 0.8em;
    font-weight: 500;
    font-family: inherit;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .pc {
    width: 100%;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 5fr;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .pc_media {
    width: 80px;
    height: 78px;
    grid-area: 'media';
  }
  .pc_media_avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .pc_info {
    width: 100%;
    height: 100%;
    grid-area: 'info';
    text-align: left;
    display: grid;
    align-items: center;
    padding: 4px 8px;
  }
  .pc_info_title {
    display: inline;
    color: #080808;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
  }
  .pc_info_subtitle {
    display: inline;
    color: #656565;
    font-size: 0.8em;
    font-weight: 500;
    font-family: inherit;
  }
}
@media (min-width: 768px) and (max-width: 1087px) {
  .pc {
    width: 100%;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 5fr;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .pc_media {
    width: 80px;
    height: 78px;
    grid-area: 'media';
  }
  .pc_media_avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .pc_info {
    width: 100%;
    height: 100%;
    grid-area: 'info';
    text-align: left;
    display: grid;
    align-items: center;
    padding: 4px 8px;
  }
  .pc_info_title {
    display: inline;
    color: #080808;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
  }
  .pc_info_subtitle {
    display: inline;
    color: #656565;
    font-size: 0.8em;
    font-weight: 500;
    font-family: inherit;
  }
}
@media (min-width: 1088px) {
  .pc {
    min-width: 288px;
    width: 100%;
    max-width: 320px;
    height: 80px;
    display: grid;
    grid-template-areas: 'media info';
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .pc:hover,
  .pc:hover *:hover {
    cursor: pointer;
  }
  .pc_media {
    width: 80px;
    height: 78px;
    grid-area: 'media';
  }
  .pc_media_avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .pc_info {
    width: 240px;
    height: 100%;
    grid-area: 'info';
    text-align: left;
    display: grid;
    align-items: center;
    padding: 4px 8px;
  }
  .pc_info_title {
    display: inline;
    color: #080808;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
  }
  .pc_info_subtitle {
    display: inline;
    color: #656565;
    font-size: 0.8em;
    font-weight: 500;
    font-family: inherit;
  }
}
</style>