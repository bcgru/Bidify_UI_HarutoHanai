<template>
  <el-dialog
    :visible.sync="showModal"
    label-width="0px"
    class="success-modal"
  >
    <div class="container">
      <el-button class="btn-close" type="default" circle @click="cancel()">
        <i class="el-icon-close icon" />
      </el-button>
      <section v-if="form.auction" class="success-container">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h4 class="success-title text-center">
                Congratulations
              </h4>
            </div>
            <div class="col-12">
              <div class="auction-image">
                <img
                  :src="form.auction.image_preview_url"
                  alt=""
                >
              </div>
            </div>
            <div class="col-12">
              <div class="auction-content">
                <div class="auction-meta mb-0">
                  <div class="auction-info">
                    <h5 class="collection-name">
                      {{ form.auction.collection && form.auction.collection.name }}
                    </h5>
                    <h5 class="auction-name">
                      {{ form.auction.name }}
                    </h5>
                    <p v-if="form.type==='bid'">
                      You are now the highest bidder on <span class="auction-name-color">{{ form.auction.name }}</span> good luck.
                    </p>
                    <p v-else-if="form.type === 'finish'&&highBidder">
                      You have won <span class="auction-name-color">{{ form.auction.name }}</span>, Your winning bid was {{ form.auction.currentBid }}, Flex your new NFT on your social media following
                    </p>
                    <p v-else-if="form.type === 'finish'">
                      Someone has won <span class="auction-name-color">{{ form.auction.name }}</span>, His winning bid was {{ form.auction.currentBid }}.
                    </p>
                    <p v-else-if="form.type === 'list'">
                      You have listed <span class="auction-name-color">{{ form.auction.name }}</span>, your auction will last 1 day.
                    </p>
                  </div>
                </div>
              </div>
              <div class="social-share-links">
                <ul>
                  <li v-if="form.type==='bid'">
                    <a :href="`https://twitter.com/intent/tweet?url=http://176.223.141.40/listing/${ form.auction.listing_id }/${ form.auction.platform }/${ form.auction.token }&text=I just bid on an NFT, check it out! price=${ form.auction.currentBid }ETH`" target="_blank">
                      <img src="~/assets/icons/icon-twitter.svg" alt="">
                    </a>
                  </li>
                  <li v-else-if="form.type === 'finish'&&highBidder">
                    <a :href="`https://twitter.com/intent/tweet?url=http://176.223.141.40/listing/${ form.auction.listing_id }/${ form.auction.platform }/${ form.auction.token }&text=I just won an NFT on Bidify price=${ form.auction.currentBid }ETH`" target="_blank">
                      <img src="~/assets/icons/icon-twitter.svg" alt="">
                    </a>
                  </li>
                  <li v-else-if="form.type === 'finish'">
                    <a :href="`https://twitter.com/intent/tweet?url=http://176.223.141.40/listing/${ form.auction.listing_id }/${ form.auction.platform }/${ form.auction.token }&text=`" target="_blank">
                      <img src="~/assets/icons/icon-twitter.svg" alt="">
                    </a>
                  </li>
                  <li v-else-if="form.type === 'list'">
                    <a :href="`https://twitter.com/intent/tweet?url=http://176.223.141.40/listing/${ form.auction.listing_id }/${ form.auction.platform }/${ form.auction.token }&text=I just listed on an NFT, check it out! price=${ form.auction.currentBid }ETH`" target="_blank">
                      <img src="~/assets/icons/icon-twitter.svg" alt="">
                    </a>
                  </li>
                  <li>
                    <a :href="`https://www.facebook.com/sharer/sharer.php?u=http://176.223.141.40/listing/${ form.auction.listing_id }/${ form.auction.platform }/${ form.auction.token }`" target="_blank">
                      <img src="~/assets/icons/icon-facebook.svg" alt="">
                    </a>
                  </li>
                  <li>
                    <a :href="`https://msng.link/o/?http://176.223.141.40/listing/${ form.auction.listing_id }/${ form.auction.platform }/${ form.auction.token }=ig`" target="_blank">
                      <img src="~/assets/icons/icon-instagram.svg" alt="">
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogSuccess',
  data () {
    return {
      auction: null
    }
  },
  computed: {
    highBidder () {
      const account = this.$store.state.wallets.account
      const highBidder = this.form.auction.highBidder

      return ((account && highBidder) && (account.toLowerCase() === highBidder.toLowerCase()))
    },
    showModal () {
      return this.$store.state.bidify.successModal ? true : null
    },
    form () {
      const auction = this.$store.state.bidify.successModal

      if (!auction) {
        return {}
      }
      return auction
    }
  },
  methods: {
    cancel () {
      this.$store.commit('bidify/successModal', false)
      this.refetchListing()
    },
    refetchListing () {
      this.$router.go()
    }
  }
}
</script>

<style lang="stylus">
</style>
