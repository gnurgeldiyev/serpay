<template>
  <div class="f">
    <div class="f-items">
      <div class="f_item">
        <img
          class="f_item_icon"
          src="/icon-heart.svg"
          alt="söýgi"
        >
        bilen döredildi  •
      </div>
      <!-- <div class="f_item">
        public beta •
        <a
          href="https://penjire.com"
          title="Penjire Topary"
        >
          penjire
        </a>
      </div> -->
      <div class="f_item">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSd5K8ZYsrCkoLvUQOlnbZGsIJfmD-pdgWeJv3ZEl4feLvG14w/viewform?usp=pp_url"
          title="Contribute to creating a new website for the Serpay project"
        >
          Help us for a new UI design
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
    margin: 32px auto;
  }
  .f-items {
    display: flex;
    justify-content: center;
  }
  .f_item {
    color: #656565;
    font-size: 0.9rem;
    font-weight: 600;
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
