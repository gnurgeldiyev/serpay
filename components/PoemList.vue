<template>
  <div 
    v-if="data.length > 0">
    <ul class="list">
      <li 
        v-for="(poem, i) in data"
        :key="i"
        class="list_item">
        <nuxt-link 
          :to="'/p/' + poet.url + '/' + poem.url"
          :title="poem.title"
          class="a">
          {{ i+1 }}. {{ poem.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      },
      poet: {
        type: Object,
        default: () => {}
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
  .list {
    display: grid;
    grid-template-columns: 1fr;
    list-style: none;
    padding: 0;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    margin: 12px 0;
  }
  .list_item { 
    padding: 16px;
    border-bottom: 1px solid rgba(0,0,0,.09);
  }
  .list_item:last-child {
    border: none;
  }
  .list_item .a {
    color: #080808;
    font-size: 1em;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.3;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .list {
    display: grid;
    grid-template-columns: 1fr;
    list-style: none;
    padding: 0;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    margin: 12px 0;
  }
  .list_item { 
    padding: 16px;
    border-bottom: 1px solid rgba(0,0,0,.09);
  }
  .list_item:last-child {
    border: none;
  }
  .list_item .a {
    color: #080808;
    font-size: 1em;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.3;
  }
}
@media (min-width: 768px) and (max-width: 1087px) {
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    list-style: none;
    padding: 0;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    margin: 12px 0;
  }
  .list_item { 
    padding: 16px;
    border-bottom: 1px solid rgba(0,0,0,.09);
  }
  .list_item:nth-last-child(2),
  .list_item:last-child {
    border: none;
  }
  .list_item .a {
    color: #080808;
    font-size: 1em;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.3;
  }
  .list_item .a,
  .list_item .a *:hover {
    cursor: pointer;
  }
}
@media (min-width: 1088px) {
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    list-style: none;
    padding: 0;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    margin: 16px 0;
  }
  .list_item { 
    padding: 16px;
    border-bottom: 1px solid rgba(0,0,0,.09);
  }
  .list_item:nth-last-child(2),
  .list_item:last-child {
    border: none;
  }
  .list_item .a {
    color: #080808;
    font-size: 1em;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.3;
  }
  .list_item .a,
  .list_item .a *:hover {
    cursor: pointer;
  }
}
</style>