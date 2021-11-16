<template>
  <el-dialog
    :visible.sync="showModal"
    label-width="0px"
    class="auction-modal"
  >
    <div class="container">
      <el-button class="btn-close" type="default" circle @click="cancel()">
        <i class="el-icon-close icon" />
      </el-button>
      <section v-if="!form.paidOut" class="auction-container">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="auction-image">
                <img
                  :src="form.image_preview_url"
                  alt=""
                >
              </div>
            </div>
            <div class="col-12">
              <div class="auction-content">
                <div class="auction-meta mb-0">
                  <div class="auction-info">
                    <h5 v-if="!nameExpand" class="auction-name collapse-name" @click="expandNameFunc(true)">
                      {{ form.name }}
                    </h5>
                    <h5 v-else class="auction-name expand-name" @click="expandNameFunc(false)">
                      {{ form.name }}
                    </h5>
                    <h5 class="collection-name">
                      {{ form.collection && form.collection.name }}
                    </h5>
                  </div>
                  <div class="next-bid-amount">
                    <img
                      src="~/assets/icons/ethereum-icon.svg"
                      alt=""
                    >
                    <p><b>{{ form.nextBid }} ETH</b><br><span>Current Price:</span></p>
                  </div>
                </div>
                <h5 class="auction-status">
                  Auction Ends in
                </h5>
                <div class="auction-limit">
                  <div class="auction-limit-time">
                    <span>{{ days }}</span>
                    <span>{{ hours }}</span>
                    <span>{{ minutes }}</span>
                    <span>{{ seconds }}</span>
                  </div>
                  <div class="auction-limit-label">
                    <span>Days</span>
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                  </div>
                </div>
                <div class="bid-action">
                  <span v-if="highBidder && !form.paidOut" class="disabled">
                    You are the Highest Bidder
                  </span>
                  <span v-else-if="insufficientFunds && !form.paidOut" class="disabled">
                    Insufficient Funds
                  </span>
                  <div v-else-if="!form.paidOut && time !== 'Closed'" class="bid-box">
                    <div class="bid-amount">
                      <input v-model="bidAmount" type="text" class="bid-amount-input" placeholder="Enter amount of bid...">
                    </div>
                    <button v-if="!loading" type="button" class="btn bidify-button bid-button" @click="startBid()">
                      place a bid
                    </button>
                    <span v-else>Loading ...</span>
                  </div>
                  <button v-if="!form.paidOut && time === 'Closed'&&!loading&&highBidder" class="btn bidify-button finish-button" @click="!loading && finishBid()">
                    Finish
                  </button>
                  <span v-else-if="!form.paidOut && time === 'Closed'&&loading">Loading ...</span>
                  <span v-if="form.paidOut">
                    Finished
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-else class="auction-container finished-auction">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="auction-message mb-5">
                <h4 class="text-center">Auction completed</h4>
                <p v-if="highBidder" class="text-center"><span class="congr-text">Congratulations!</span><br>You have just have won the bidding war for <b>"{{ form.name }}/{{ form.collection && form.collection.name }}"</b>. It is now confirmed on the blockchain.</p>
                <p v-else class="text-center"><span class="congr-text">{{ this.form.highBidder }}</span><br>He has just have won the bidding war for <b>"{{ form.name }}/{{ form.collection && form.collection.name }}"</b>. It is now confirmed on the blockchain.</p>
              </div>
            </div>
            <div class="col-12">
              <div class="auction-image">
                <img
                  :src="form.image_preview_url"
                  alt=""
                >
              </div>
            </div>
            <div class="col-12">
              <div class="auction-content">
                <div class="auction-meta">
                  <div class="auction-info w-100">
                    <h5 class="collection-name text-center m-0 pt-3">
                      {{ form.collection && form.collection.name }}
                    </h5>
                    <h5 class="auction-name text-center">
                      {{ form.name }}
                    </h5>
                  </div>
                </div>
                <div class="next-bid-amount">
                  <p class="d-flex justify-content-between align-items-center w-100">
                    <span>
                      <img
                        src="~/assets/icons/ethereum-icon.svg"
                        alt=""
                      >Winning Bidding Price
                    </span>
                    <span>{{ form.currentBid }}</span>
                  </p>
                </div>
                <div class="social-share-links">
                  <ul>
                    <li>
                      <a :href="`https://twitter.com/intent/tweet?url=http://176.223.141.40/listing/${ form.listing_id }/${ form.platform }/${ form.token }&text=price=${ form.currentBid }ETH`" target="_blank">
                        <img src="~/assets/icons/icon-twitter.svg" alt="">
                      </a>
                    </li>
                    <li>
                      <a :href="`https://www.facebook.com/sharer/sharer.php?u=http://176.223.141.40/listing/${ form.listing_id }/${ form.platform }/${ form.token }`" target="_blank">
                        <img src="~/assets/icons/icon-facebook.svg" alt="">
                      </a>
                    </li>
                    <li>
                      <a :href="`https://msng.link/o/?http://176.223.141.40/listing/${ form.listing_id }/${ form.platform }/${ form.token }=ig`" target="_blank">
                        <img src="~/assets/icons/icon-instagram.svg" alt="">
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<script>
import RealtimeCountdown from 'realtime-countdown'
export default {
  name: 'DialogAuction',
  data () {
    return {
      auction: null,
      current: 0,
      isFullscreen: false,
      time: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      bidAmount: 0,
      loading: false,
      timer: null,
      nameExpand: false
    }
  },
  computed: {
    listing () {
      const active = this.$store.state.localStorage.listings.active

      if (active) {
        return active
      }

      const listings = this.$store.state.localStorage.listings.list

      const id = this.$route.params.id

      return listings.find(l => l.id === id)
    },
    bidCallout () {
      return (this.auction && !this.$store.state.bidify.bidding)
    },
    bidAction () {
      return this.$store.state.bidify.bidding
    },
    error () {
      return this.$store.state.bidify.error
    },
    highBidder () {
      const account = this.$store.state.wallets.account
      const highBidder = this.form.highBidder

      return ((account && highBidder) && (account.toLowerCase() === highBidder.toLowerCase()))
    },
    insufficientFunds () {
      const balances = this.$store.state.wallets.balances
      let balance = balances.ether
      let nextBid = this.form.nextBid

      if (balance === 0) {
        return true
      }

      if (!balance || !nextBid) {
        return
      }

      balance = Number(balance)
      nextBid = Number(nextBid)

      return (balance < nextBid)
    },
    showModal () {
      return this.$store.state.bidify.auctionModal ? true : null
    },
    form () {
      const auctionModal = this.$store.state.bidify.auctionModal

      if (!auctionModal) {
        return {}
      }
      this.timeLeft(auctionModal.endTime * 1000)
      return auctionModal
    }
  },
  methods: {
    cancel () {
      this.timer.destroy()
      this.days = 0
      this.hours = 0
      this.minutes = 0
      this.seconds = 0
      this.$store.commit('bidify/auctionModal', false)
    },
    setTimeLeft (t) {
      this.days = t.days
      this.hours = t.hours
      this.minutes = t.minutes
      this.seconds = t.seconds
      this.time = 'Open'
    },
    timeLeft (timeStamp) {
      const onCountInitialized = t => this.setTimeLeft(t)

      const onCount = t => this.setTimeLeft(t)

      const onCountEnd = (t) => {
        this.time = 'Closed'
      }
      this.timer = new RealtimeCountdown({ timeStamp, onCountInitialized, onCount, onCountEnd })
    },
    async startBid () {
      if (this.bidAmount < this.form.nextBid) {
        alert('Bid amount should be more than next bid amount!')
        return false
      }

      this.loading = true
      const listings = require('~/plugins/listings.js')

      const payload = {
        $store: this.$store,
        id: this.form.listing_id,
        bidAmount: this.bidAmount
      }
      try {
        const result = await listings.bid(payload)

        if (result) {
          const successPayload = {
            type: 'bid',
            auction: this.form
          }

          this.$store.commit('bidify/successModal', successPayload)
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async finishBid () {
      const listings = require('~/plugins/listings.js')

      this.loading = true
      const payload = {
        $store: this.$store,
        id: this.form.listing_id
      }

      try {
        await listings.finishBid(payload)

        const successPayload = {
          type: 'finish',
          auction: this.form
        }
        this.$store.commit('bidify/successModal', successPayload)
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    cancelBid () {
      this.$store.commit('bidify/error', false)
      this.$store.commit('bidify/bidding', false)
    },
    refetchListing () {
      this.$router.go()
    },
    expandNameFunc (flag) {
      this.nameExpand = flag
    }
  }
}
</script>

<style lang="stylus">
  .el-dialog__wrapper.auction-modal
    padding 0 15px
  .el-dialog
    padding 30px
    max-width 570px
    width 100%
    background #26223D
    .el-dialog__title
      color white

  .el-flex-box
    display flex
    justify-content space-around
    .el-form-item
      width 48%
      .el-input-number
        width 100%

  .el-form-item__label
    line-height 18px
    color white
  .el-dialog__headerbtn
    display none
  .btn-close
    position absolute
    top $space-s
    right $space-s
    background transparent
    color white
    opacity 1

  .btn-action
    width 100%
    padding 10px 45px !important
    background linear-gradient(90deg, #FFBF23, #F78620)
    color white !important
    text-transform uppercase
    font-size 1.25rem !important

</style>
