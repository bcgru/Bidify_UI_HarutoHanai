<template>
  <div>
    <div v-if="loading" class="page-loader">
      <div class="page-loader-body">
        <div class="preloader-wrapper big active">
          <img src="~/assets/icons/icon-loading.svg" alt="Loading ...">
          <span>Your page is loading ...</span>
        </div>
      </div>
    </div>
    <div v-if="auction" class="page">
      <Nav />
      <section class="auction-container">
        <div class="container">
          <div class="row">
            <div class="col-md-5">
              <div class="auction-image">
                <img
                  :src="auction.image_preview_url"
                  alt=""
                >
              </div>
            </div>
            <div class="col-md-7">
              <div class="auction-content">
                <div class="auction-meta">
                  <h3 class="collection-name">
                    {{ auction.collection.name }}
                  </h3>
                  <div class="social-share-links">
                    <ul>
                      <li>
                        <a :href="`https://twitter.com/intent/tweet?url=http://176.223.141.40/${$router.history.current.path}&text=`" target="_blank">
                          <img src="~/assets/icons/icon-twitter.svg" alt="">
                        </a>
                      </li>
                      <li>
                        <a :href="`https://www.facebook.com/sharer/sharer.php?u=http://176.223.141.40/${$router.history.current.path}`" target="_blank">
                          <img src="~/assets/icons/icon-facebook.svg" alt="">
                        </a>
                      </li>
                      <li>
                        <a :href="`https://msng.link/o/?http://176.223.141.40/${$router.history.current.path}=ig`" target="_blank">
                          <img src="~/assets/icons/icon-instagram.svg" alt="">
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <h3 class="auction-name">
                  {{ auction.name }}
                </h3>
                <h5 class="auction-status">
                  Auction {{ time }}
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
                <div class="next-bid-amount">
                  <label for="test">Next Bidding Price:</label>
                  <b>{{ auction.nextBid }} ETH</b>
                </div>
                <div class="bid-action">
                  <span v-if="highBidder && !auction.paidOut" class="disabled">
                    You are the Highest Bidder
                  </span>
                  <span v-else-if="insufficientFunds && !auction.paidOut" class="disabled">
                    Insufficient Funds
                  </span>
                  <div v-else-if="!auction.paidOut && time !== 'Closed'" class="bid-box">
                    <div class="bid-amount">
                      <input v-model="bidAmount" type="text" class="bid-amount-input" placeholder="Enter amount of bid...">
                    </div>
                    <button type="button" class="btn bidify-button bid-button" @click="startBid()">
                      place a bid
                    </button>
                  </div>
                  <button v-if="!form.paidOut && time === 'Closed'&&!loading&&highBidder" class="btn bidify-button finish-button" @click="!loading && finishBid()">
                    Finish
                  </button>
                  <span v-else-if="!form.paidOut && time === 'Closed'&&loading">Loading ...</span>
                  <span v-if="auction.paidOut">
                    Finished
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-5">
              <div class="auction-description">
                <h4 class="description-title">
                  Description
                </h4>
                <p>{{ auction.description }}</p>
              </div>
            </div>
            <div class="col-md-7">
              <div class="auction-details">
                <h4 class="details-title">
                  Details
                </h4>
                <p><span>Created</span><span>{{ auction.asset_contract.created_date }}</span></p>
                <p><span>Downloadable File</span><span>Yes</span></p>
                <p><span>Edition</span><span>DD Month YYYY</span></p>
                <p><span>Contract Address</span><span>{{ auction.address.substr(0, 7) + "..." + auction.address.substr(auction.address.length - 4, 4) }}</span></p>
                <p><span>Token ID</span><span>{{ auction.token_id }}</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="bidify-section bid-offers">
        <div class="container">
          <div class="bidify-data-section">
            <div class="section-header">
              <h5 class="section-title">
                Bid Offers
              </h5>
              <span class="collapse">O</span>
            </div>
            <div class="section-container">
              <table class="bidify-table">
                <thead>
                  <tr>
                    <th>Listed by:</th>
                    <th>Price:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(bid, index) in auction.bids" :key="index">
                    <td>{{ bid.bidder }}</td>
                    <td>{{ bid.price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <!-- Page Footer-->
      <Footer />
    </div>
  </div>
</template>

<script>
import RealtimeCountdown from 'realtime-countdown'
const carouselHeight = (fs) => {
  if (fs) {
    return (window.screen.height - 230) + 'px'
  }

  return (window.screen.height * 0.6) + 'px'
}

export default {
  name: 'Listing',
  data () {
    return {
      auction: null,
      current: 0,
      height: carouselHeight(),
      isFullscreen: false,
      time: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      bidAmount: 0,
      loading: false
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
      const highBidder = this.auction.highBidder

      return ((account && highBidder) && (account.toLowerCase() === highBidder.toLowerCase()))
    },
    insufficientFunds () {
      const balances = this.$store.state.wallets.balances
      let balance = balances.ether
      let nextBid = this.auction.nextBid

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
  watch: {
    validated (newValidated) {
      this.getListing()
    }
  },
  async mounted () {
    await this.getListing()
    this.timeLeft()
  },
  beforeDestroy () {
    this.$store.commit('localStorage/active', null)
  },
  methods: {
    carouselChange (index) {
      this.current = index
    },
    toggleFS () {
      this.isFullscreen = !this.isFullscreen
      this.height = carouselHeight(this.isFullscreen)
    },
    async getListing () {
      const listings = require('~/plugins/listings.js')

      this.$nuxt.$loading.start()
      this.loading = true

      await listings.getOne(this)

      this.auction = this.$store.state.localStorage.listings.active

      this.loading = false
      this.$nuxt.$loading.finish()
    },
    setTimeLeft (t) {
      this.days = t.days
      this.hours = t.hours
      this.minutes = t.minutes
      this.seconds = t.seconds
      this.time = 'Open'
    },
    timeLeft () {
      const timeStamp = this.$store.state.localStorage.listings.active.endTime * 1000

      const onCountInitialized = t => this.setTimeLeft(t)

      const onCount = t => this.setTimeLeft(t)

      const onCountEnd = (t) => {
        this.time = 'Closed'
      }

      return new RealtimeCountdown({ timeStamp, onCountInitialized, onCount, onCountEnd })
    },
    async startBid () {
      if (this.bidAmount < this.auction.nextBid) {
        alert('Bid amount should be more than next bid amount!')
        return false
      }

      this.loading = true
      const listings = require('~/plugins/listings.js')

      const payload = {
        $store: this.$store,
        id: this.auction.listing_id,
        bidAmount: this.bidAmount
      }
      try {
        const result = await listings.bid(payload)

        if (result) {
          const successPayload = {
            type: 'bid',
            auction: this.auction
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
        id: this.auction.listing_id
      }

      try {
        await listings.finishBid(payload)

        const successPayload = {
          type: 'finish',
          auction: this.auction
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
    }
  }
}
</script>
