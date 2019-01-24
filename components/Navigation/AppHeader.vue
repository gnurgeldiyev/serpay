<template>
  <div class="h">
    <div class="h_brand">
      <nuxt-link
        :title="brand.title + ', ' + brand.subtitle"
        to="/"
        class="h_brand_title">
        {{ brand.title }}
      </nuxt-link>
      <p class="h_brand_subtitle">{{ brand.subtitle }}</p>
    </div>  
    <div class="h_menu">
      <ul 
        v-if="menu.length > 0"
        class="h_menu_list">
        <li 
          v-for="item in menu"
          :key="item.url"
          :class="{ 'h_menu_list_item-active': isActive(item.url) }"
          class="h_menu_list_item">
          <nuxt-link :to="`/${item.url}`">{{ item.title }}</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      brand: {
        type: Object,
        required: true
      },
      menu: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style>
@media (max-width: 480px) {
  .h {
    width: 100%;
    margin: 0 auto;
  }
  .h_brand {
    margin: 16px 0 ; 
    text-align: center;
  }
  .h_brand_title {
    color: #080808;
    text-decoration: none;
    font-size: 2em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 700;
  }
  .h_brand_title:hover {
    cursor: pointer;
    text-decoration: none;
  }
  .h_brand_subtitle {
    color: #656565;
    font-size: 1em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 400;
    margin-top: 8px;
  }
  .h_menu {
    margin: 16px 0;
    text-align: center;
  }
  .h_menu_list {
    list-style: none;
  }
  .h_menu_list_item {
    display: inline-block;
    margin: 0 8px;
  }
  .h_menu_list_item a {
    text-decoration: none;
    color: #666666;
    font-size: 0.9em;
    line-height: 1;
    font-family: Georgia, serif;
    font-weigth: 600;
    padding-bottom: 4px;
  }
  .h_menu_list_item a:hover {
    text-decoration: none;
    color: #080808;
  }
  .h_menu_list_item-active a {
    color: #080808 !important;
    border-bottom: 4px solid #080808 !important;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .h {
    width: 100%;
    margin: 0 auto;
  }
  .h_brand {
    margin: 16px 0; 
    text-align: center;
  }
  .h_brand_title {
    color: #080808;
    text-decoration: none;
    font-size: 2em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 700;
  }
  .h_brand_subtitle {
    color: #656565;
    font-size: 1em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 400;
    margin-top: 8px;
  }
  .h_brand_title:hover {
    cursor: pointer;
    text-decoration: none;
  }
  .h_menu {
    margin: 16px 0;
    text-align: center;
  }
  .h_menu_list {
    list-style: none;
  }
  .h_menu_list_item {
    display: inline-block;
    margin: 0 8px;
  }
  .h_menu_list_item a {
    text-decoration: none;
    color: #666666;
    font-size: 1em;
    line-height: 1;
    font-family: Georgia, serif;
    font-weigth: 600;
    padding-bottom: 4px;
  }
  .h_menu_list_item a:hover {
    text-decoration: none;
    color: #080808;
  }
  .h_menu_list_item-active a {
    color: #080808 !important;
    border-bottom: 4px solid #080808 !important;
  }
}
@media (min-width: 768px) and (max-width: 1280px) {
  .h {
    width: 100%;
    margin: 0 auto;
  }
  .h_brand {
    margin: 24px 0; 
    text-align: center;
  }
  .h_brand_title {
    color: #080808;
    text-decoration: none;
    font-size: 2.4em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 700;
  }
  .h_brand_title:hover {
    cursor: pointer;
    text-decoration: none;
  }
  .h_brand_subtitle {
    color: #656565;
    font-size: 1.2em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 400;
    margin-top: 8px;
  }
  .h_menu {
    margin: 16px 0;
    text-align: center;
  }
  .h_menu_list {
    list-style: none;
  }
  .h_menu_list_item {
    display: inline-block;
    margin: 0 16px;
  }
  .h_menu_list_item a {
    text-decoration: none;
    color: #666666;
    font-size: 1.1em;
    line-height: 1;
    font-family: Georgia, serif;
    font-weigth: 600;
    padding-bottom: 4px;
  }
  .h_menu_list_item a:hover {
    text-decoration: none;
    color: #080808;
  }
  .h_menu_list_item-active a {
    color: #080808 !important;
    border-bottom: 4px solid #080808 !important;
  }
}
@media (min-width: 1280px) {
  .h {
    width: 1280px;
    margin: 0 auto;
  }
  .h_brand {
    margin: 24px 0; 
    text-align: center;
  }
  .h_brand_title {
    color: #080808;
    text-decoration: none;
    font-size: 3em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 700;
  }
  .h_brand_title:hover {
    cursor: pointer;
    text-decoration: none;
  }
  .h_brand_subtitle {
    color: #656565;
    font-size: 1.4em;
    line-height: 1;
    font-family: 'Inria Serif', Georgia, serif;
    font-weight: 400;
    margin-top: 8px;
  }
  .h_menu {
    margin: 16px 0;
    text-align: center;
  }
  .h_menu_list {
    list-style: none;
  }
  .h_menu_list_item {
    display: inline-block;
    margin: 0 16px;
  }
  .h_menu_list_item a {
    text-decoration: none;
    color: #666666;
    font-size: 1.2em;
    line-height: 1;
    font-family: Georgia, serif;
    font-weigth: 600;
    padding-bottom: 4px;
  }
  .h_menu_list_item a:hover {
    text-decoration: none;
    color: #080808;
  }
  .h_menu_list_item-active a {
    color: #080808 !important;
    border-bottom: 4px solid #080808 !important;
  }
}
</style>