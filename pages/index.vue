<template>
  <div>
    <h1 class="title">
      Şahyrlar
    </h1>
    <div 
      v-if="poets && poets.length > 0"
      class="poets"
    >
      <profile-card
        v-for="(poet, i) in poets"
        :key="i"
        :data="poet"
      />
    </div> 
  </div>
</template>

<script>
import ProfileCard from '@/components/ProfileCard'

export default {
  components: {
    'profile-card': ProfileCard
  },
  computed: {
    poets() {
      return this.$store.getters['poet/getAll']
    }
  }
}
</script>

<style>
@media (max-width: 480px) {
  .poets {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 16px;
    margin: 8px 0;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .poets {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 24px;
    margin: 12px 0;
  }
}
@media (min-width: 768px) and (max-width: 1087px) {
  .poets {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 32px;
    grid-auto-rows: auto;
    grid-row-gap: 32px;
    margin: 12px 0;
  }
}
@media (min-width: 1088px) {
  .poets {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 32px;
    grid-auto-rows: auto;
    grid-row-gap: 32px;
    margin: 16px 0;
  }
}
</style>
