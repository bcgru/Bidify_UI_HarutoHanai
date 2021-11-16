<template>
  <div>
    <el-drawer
      :visible.sync="bidCallout"
      :show-close="false"
      :with-header="false"
      size="132px"
      direction="btt"
      class="is-bid-callout"
      :modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      :wrapper-closable="false"
    >
      <div class="panel-action">
        <div class="output el-no-borderradius">
          <a v-if="highBidder && !listing.paidOut" class="el-button disabled">
            You are the Highest Bidder
          </a>
          <a v-else-if="insufficientFunds && !listing.paidOut" class="el-button disabled">
            Insufficient Funds
          </a>
          <div v-else-if="!listing.paidOut && time !== 'Ended'" class="bid-box">
            <label class="el-form-item__label">Bid Amount</label>
            <input v-model="bidAmount" type="text" placeholder="enter the amount ..." class="el-input__inner"></input>
            <a class="el-button el-bg-green" @click="startBid()">
              BID
            </a>
          </div>
          <a v-if="!listing.paidOut && time === 'Ended'" class="el-button el-bg-green" @click="finishBid()">
            Finish
          </a>
          <span v-if="listing.paidOut" class="el-button disabled el-bg-red">
            Finished
          </span>
        </div>

        <span v-if="listing.owned">
          {{ listing.nextBid }} ETH (Next Bid)
        </span>

        <span v-else>
          {{ listing.nextBid }} ETH (Next Bid)
        </span>
      </div>
    </el-drawer>

    <el-drawer
      :visible.sync="bidAction"
      :show-close="false"
      :with-header="false"
      size="80%"
      direction="btt"
      class="is-bid-action"
      :modal="true"
      :modal-append-to-body="false"
      :append-to-body="false"
      :wrapper-closable="false"
    >
      <el-button class="btn-close is-themed" type="default" circle @click="cancelBid()">
        <i class="el-icon-close icon" />
      </el-button>

      <div v-if="!error" class="panel-action is-bid-action">
        <h3>Placing Your Bid</h3>

        <div class="action-step">
          <h4>Approve</h4>

          <p>
            Checking balance and approving
          </p>
        </div>
      </div>

      <div v-else class="panel-action">
        {{ error }}
      </div>
    </el-drawer>
  </div>
</template>

<script>
import RealtimeCountdown from 'realtime-countdown'

export default {
  name: 'BidAction',
  props: {
    listing: Object
  },
  data () {
    return {
      time: 0,
      bidAmount: 0
    }
  },
  computed: {
    bidCallout () {
      return (this.listing && !this.$store.state.bidify.bidding)
    },
    bidAction () {
      return this.$store.state.bidify.bidding
    },
    error () {
      return this.$store.state.bidify.error
    },
    highBidder () {
      const account = this.$store.state.wallets.account
      const highBidder = this.listing.highBidder

      return ((account && highBidder) && (account.toLowerCase() === highBidder.toLowerCase()))
    },
    insufficientFunds () {
      const balances = this.$store.state.wallets.balances
      let balance = balances.ether
      let nextBid = this.listing.nextBid

      if (balance === 0) {
        return true
      }

      if (!balance || !nextBid) {
        return
      }

      balance = Number(balance)
      nextBid = Number(nextBid)

      return (balance < nextBid)
    }
  },
  mounted () {
    this.timeLeft()
  },
  methods: {
    setTimeLeft (t) {
      if (t.days === '0') {
        this.time = `${t.hours}h ${t.minutes}m ${t.seconds}s`
        return
      }

      if (t.hours === '0') {
        this.time = `${t.minutes}m ${t.seconds}s`
        return
      }

      if (t.minutes === '0') {
        this.time = `${t.seconds}s`
        return
      }

      this.time = `${t.days}d ${t.hours}h ${t.minutes}m`
    },
    timeLeft () {
      const timeStamp = this.listing.endTime * 1000

      const onCountInitialized = t => this.setTimeLeft(t)

      const onCount = t => this.setTimeLeft(t)

      const onCountEnd = (t) => {
        this.time = 'Ended'
      }

      return new RealtimeCountdown({ timeStamp, onCountInitialized, onCount, onCountEnd })
    },
    async startBid () {
      const listings = require('~/plugins/listings.js')

      const payload = {
        $store: this.$store,
        id: this.listing.listing_id
      }
      try {
        await listings.bid(payload)
      } catch (error) {
        console.log(error)
      }

      await this.refetchListing()
    },
    async finishBid () {
      const listings = require('~/plugins/listings.js')

      const payload = {
        $store: this.$store,
        id: this.listing.listing_id
      }

      await listings.finishBid(payload)

      await this.refetchListing()
    },
    cancelBid () {
      this.$store.commit('bidify/error', false)
      this.$store.commit('bidify/bidding', false)
    },
    async refetchListing () {
      const listings = require('~/plugins/listings.js')

      this.$nuxt.$loading.start()

      await listings.getOne(this)

      this.$nuxt.$loading.finish()
    }
  }
}
</script>

<style lang="stylus">

  h3
    font-size 18px
    font-weight $weight-bold
    padding-bottom $space-m

  .el-drawer__wrapper
    top auto

    &.is-bid-callout
      height 132px

    &.is-bid-action
      height 80%

  .panel-action
    padding $space-l $space-m

    &.is-bid-action
      padding-bottom $space-xl

    span
      font-size 14px
      text-align center
      display block
      padding $space-s
    .output
      display flex
      justify-content center
      .el-button
        width 100%
        text-decoration none

        &.disabled
          cursor not-allowed

        &.el-bg-green
          background-color green
          color white

          &:hover
            background-color #e7ffe7
            border-color #c7ffc7
            color green

        &.el-bg-red
          background-color red
          color white

  .btn-close
    position absolute
    top $space-s
    right $space-s

</style>
