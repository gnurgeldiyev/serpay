<template>
  <div class="f">
    <div class="f-items">
      <div class="f_item"> 
        <img 
          class="f_item_icon"
          src="/icon-heart.svg" 
          alt="heart icon">
        bilen döredildi  • 
      </div>
      <div class="f_item">
        public beta • 
        <a href="https://penjire.com">
          penjire
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style>
.f {
    min-width: 300px;
    width: 100%;
    max-width: 1024px;
    text-align: center;
    margin: 32px auto 16px auto;
  }
  .f-items {
    display: flex;
    justify-content: center;
  }
  .f_item {
    color: #656565;
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0 4px;
  }
  .f_item a {
    text-decoration: none;
    color: #656565;
    border-bottom: 1px solid #656565;
  }
  .f_item a:hover {
    text-decoration: none;
    cursor: pointer;
    color: #080808;
    border-bottom: 1px solid #080808;
  }
  .f_item_icon {
    width: auto;
    height: 0.9rem;
  }
</style>