<template>
  <div>
    <div class="poem">
      <h1 class="poem_title">{{ data.title }}</h1>
      <div
        class="poem_body"
        v-html="data.content" />
      <div class="poem_info">
        {{ poemInfo }}
      </div>
      <div
        v-if="data.category && data.category.length > 0"
        class="poem_category">
        <div
          v-for="c in data.category"
          :key="c"
          class="poem_category_item">
          {{ c }}
        </div>
      </div>
      <div
        v-if="data.notes"
        class="poem_notes"
        v-html="data.notes" />
    </div>
    <div
      v-if="data.youtube_link"
      class="poem_video">
      <iframe
        :src="data.youtube_link"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen />
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
      poemInfo() {
        const d = this.data
        let i = ''
        if (d.year) {
          i += d.year + ', '
        }
        if (d.author && d.author.fullname) {
          i += d.author.fullname
        }
        return i
      }
    }
  }
</script>

<style>
@media (max-width: 480px) {
  .poem {
    width: 100%;
    display: grid;
    justify-content: center;
    grid-row-gap: 16px;
  }
  .poem_title {
    color: #080808;
    font-size: 1.4em;
    font-weight: 600;
    font-family: Georgia, serif;
    line-height: 1;
    text-align: center;
  }
  .poem_body {
    color: #080808;
    font-size: 1em;
    font-weight: 400;
    font-family: Georgia, serif;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .poem_info {
    text-align: right;
    color: #080808;
    font-size: 1em;
    font-weight: 400;
    font-family: Georgia, serif;
    font-style: italic;
  }
  .poem_category {
    margin-top: 24px;
  }
  .poem_category_item {
    color: rgba(0,0,0,.68);
    background: rgba(0,0,0,.05);
    border-radius: 4px;
    display: inline;
    padding: 8px;
    margin-right: 8px;
    font-size: 0.7em;
    font-weight: 400;
    font-family: inherit;
    line-height: 1;
  }
  .poem_notes {
    color: #656565;
    font-size: 0.8em;
    font-weight: 400;
    font-family: inherit;
    margin-top: 24px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video {
    width: 100%;
    height: calc(100vw / 2);
    margin: 32px 0;
    padding: 8px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video iframe {
    width: 100%;
    height: 100%;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .poem {
    width: 100%;
    display: grid;
    justify-content: center;
    grid-row-gap: 16px;
  }
  .poem_title {
    color: #080808;
    font-size: 1.4em;
    font-weight: 600;
    font-family: Georgia, serif;
    line-height: 1;
    text-align: center;
  }
  .poem_body {
    color: #080808;
    font-size: 1em;
    font-weight: 400;
    font-family: Georgia, serif;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .poem_info {
    text-align: right;
    color: #080808;
    font-size: 1em;
    font-weight: 400;
    font-family: Georgia, serif;
    font-style: italic;
  }
  .poem_category {
    margin-top: 24px;
  }
  .poem_category_item {
    color: rgba(0,0,0,.68);
    background: rgba(0,0,0,.05);
    border-radius: 4px;
    display: inline;
    padding: 8px;
    margin-right: 8px;
    font-size: 0.7em;
    font-weight: 400;
    font-family: inherit;
    line-height: 1;
  }
  .poem_notes {
    color: #656565;
    font-size: 0.8em;
    font-weight: 400;
    font-family: inherit;
    margin-top: 24px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video {
    width: 100%;
    height: calc(100vw / 2);
    margin: 32px 0;
    padding: 12px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video iframe {
    width: 100%;
    height: 100%;
  }
}
@media (min-width: 768px) and (max-width: 1087px) {
  .poem {
    width: 100%;
    display: grid;
    justify-content: center;
    grid-row-gap: 12px;
  }
  .poem_title {
    color: #080808;
    font-size: 1.5em;
    font-weight: 600;
    font-family: Georgia, serif;
    line-height: 1;
    text-align: center;
  }
  .poem_body {
    color: #080808;
    font-size: 1em;
    font-weight: 400;
    font-family: Georgia, serif;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .poem_info {
    text-align: right;
    color: #080808;
    font-size: 1em;
    font-weight: 400;
    font-family: Georgia, serif;
    font-style: italic;
  }
  .poem_category {
    margin-top: 32px;
  }
  .poem_category_item {
    color: rgba(0,0,0,.68);
    background: rgba(0,0,0,.05);
    border-radius: 4px;
    display: inline;
    padding: 8px;
    margin-right: 8px;
    font-size: 0.7em;
    font-weight: 400;
    font-family: inherit;
    line-height: 1;
  }
  .poem_notes {
    color: #656565;
    font-size: 0.8em;
    font-weight: 400;
    font-family: inherit;
    margin-top: 32px;
    padding: 16px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video {
    width: 100%;
    height: calc(100vw / 2);
    margin: 40px 0;
    padding: 16px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video iframe {
    width: 100%;
    height: 100%;
  }
}
@media (min-width: 1088px) {
  .poem {
    width: 100%;
    display: grid;
    justify-content: center;
    grid-row-gap: 16px;
  }
  .poem_title {
    color: #080808;
    font-size: 1.6em;
    font-weight: 600;
    font-family: Georgia, serif;
    line-height: 1;
    text-align: center;
  }
  .poem_body {
    color: #080808;
    font-size: 1.1em;
    font-weight: 400;
    font-family: Georgia, serif;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .poem_info {
    text-align: right;
    color: #080808;
    font-size: 1.1em;
    font-weight: 400;
    font-family: Georgia, serif;
    font-style: italic;
  }
  .poem_category {
    margin-top: 32px;
  }
  .poem_category_item {
    color: rgba(0,0,0,.68);
    background: rgba(0,0,0,.05);
    border-radius: 4px;
    display: inline;
    padding: 8px;
    margin-right: 8px;
    font-size: 0.8em;
    font-weight: 400;
    font-family: inherit;
    line-height: 1;
  }
  .poem_notes {
    color: #656565;
    font-size: 0.9em;
    font-weight: 400;
    font-family: inherit;
    margin-top: 32px;
    padding: 16px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video {
    width: 100%;
    height: 560px;
    margin: 40px 0;
    padding: 16px;
    border: 1px solid rgba(0,0,0,.09);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .poem_video iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
