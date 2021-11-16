<template>
  <div class="auction-item">
    <div class="card-link" @click="list()">
      <div class="nft-image">
        <img :src="item.image_preview_url" class="image">
      </div>
      <div class="auction-meta pt-3">
        <h5 class="auction-title">
          {{ item.label }}
        </h5>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NFTCard',
  props: {
    item: Object,
    type: String
  },
  methods: {
    list () {
      this.$store.commit('bidify/listModal', this.item)
    }
  }
}
</script>
