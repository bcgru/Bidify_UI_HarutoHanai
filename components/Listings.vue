<template>
  <div v-if="list.length" class="range range-30 range-xs-center" style="z-index:1;">
    <div v-for="item in list" :key="item.listing_id" class="cell-sm-6 cell-md-4 cell-lg-3 cell-xl-3">
      <Card v-if="type === 'listing'" :item="item" />
      <NFTCard v-if="type === 'nft'" :item="item" />
    </div>
  </div>

  <div v-else class="empty-state">
    <div v-if="type === 'listing'">
      No listings

      <small>
        Check back soon.
        <br>
      </small>
    </div>

    <div v-if="type === 'nft'">
      No NFT's

      <small>
        You haven't created any NFT's yet.
        <br>
      </small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Listings',
  props: {
    list: Array,
    type: String
  }
}
</script>

<style scoped lang="stylus">
  .contents
    position relative
    z-index 2000
    padding 32px

  .empty-state
    height 50vh
    width 500px
    max-width 90%
    margin auto
    display flex
    text-transform uppercase
    justify-content center
    align-items center
    text-align center
    font-size 24px
    letter-spacing 4px

    a
      color $grey
      transition()

      &:hover
        color lighten($grey, 20%)

    small
      display block
      text-transform none
      letter-spacing 0
      color $grey
      font-size 16px

</style>
