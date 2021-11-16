<template>
  <div>
    <!-- Page preloader-->
    <div v-if="loading" class="page-loader">
      <div class="page-loader-body">
        <div class="preloader-wrapper big active">
          <img src="~/assets/icons/icon-loading.svg" alt="Loading ...">
          <span>Your page is loading ...</span>
        </div>
      </div>
    </div>
    <!-- Page-->
    <div v-if="list" class="page">
      <Nav />
      <section class="section hero">
        <div class="container">
          <div class="row">
            <div class="col-md-7">
              <div class="hero-content">
                <h1>The Best Place to Bid, Buy and Sell Valued <span>NFTs</span></h1>
                <p>Welcome to this purpose built Fluf NFT auction site, powered by the Bidify auction</p>
              </div>
            </div>
            <div class="col-md-5">
              <div class="hero-image">
                <img src="~/assets/images/hero-image.png" alt="hero image">
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="logo-container container">
        <div class="logo">
          <img src="~/assets/images/logo.png" alt="Bidify">
        </div>
      </div>
      <section class="section live-auction">
        <div class="container">
          <span class="section-sub-title">Bid, Buy and Sell</span>
          <h3 class="section-title">
            Live Auctions
          </h3>
          <p class="section-description fixed-width">
            These live auctions are available to bid on now. <br />
            The length will be extended by 5 minutes if you bid in the last 5 minutes.
          </p>
          <div class="live-auctions auction-list">
            <div class="row">
              <div v-for="(item, index) in liveAuction" :key="index" class="col-xl-3 col-md-6">
                <CardB :item="item" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section about">
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <h3 class="section-title">
                About
              </h3>
              <p class="section-description">
                Bidify is the premier tool for auction listing and selling on the Ethereum network, This fluf specific site allows you to browse all Fluf NFTs currently being sold and a portion of the fees from any NFT sold or listed here goes directly into FLUF. See <a href="https://rinkeby.etherscan.io/address/0x138c81d54cbd016d524757d26bfdbf4addb8f808#code">here</a> for transparency
              </p>
            </div>
            <div class="col-md-6">
              <div class="about-image">
                <img src="~/assets/images/about-image.png" alt="About Image">
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section most-popular">
        <div class="container">
          <span class="section-sub-title">Top FLUFS</span>
          <h3 class="section-title">
            Most Popular
          </h3>
          <p class="section-description fixed-width">
            Here are some of the highest selling recent auctions, feel free to place a bid. Good luck!
          </p>
          <div class="popular-auctions auction-list">
            <div class="row">
              <div v-for="(item, index) in popularAuction" :key="index" class="col-xl-3 col-md-6">
                <Card :item="item" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section new-arrivals">
        <div class="container">
          <span class="section-sub-title">Marketplace</span>
          <h3 class="section-title">
            New Arrivals
          </h3>
          <div class="new-auctions auction-list mb-4">
            <div class="row">
              <div v-for="(item, index) in list.slice(0, 4)" :key="index" class="col-xl-3 col-md-6">
                <CardB :item="item" />
              </div>
            </div>
          </div>
          <nuxt-link
            class="btn bidify-button"
            to="listing/page/1"
          >
            view all auctions
          </nuxt-link>
        </div>
      </section>
      <!-- Page Footer-->
      <Footer />
    </div>
    <!-- PANEL-->
    <!-- END PANEL-->
    <!-- Global Mailform Output-->
    <div id="form-output-global" class="snackbars" />
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      loading: true,
      auctions: []
    }
  },
  computed: {
    list () {
      return this.$store.state.localStorage.listings.list
    },
    liveAuction () {
      const currentTime = new Date().getTime()
      const liveAuctions = this.$store.state.localStorage.listings.list.filter((auction, i) => {
        return (auction.endTime * 1000 > currentTime)
      })
      return liveAuctions.length < 5 ? liveAuctions : liveAuctions.slice(liveAuctions.length - 4, liveAuctions.length)
    },
    popularAuction () {
      const popularAuctions = this.$store.state.localStorage.listings.popularList
      return popularAuctions.length < 5 ? popularAuctions : popularAuctions.slice(0, 4)
    }
  },
  mounted () {
    setTimeout(() => {
      this.fetchListings()
    }, 500)
  },
  methods: {
    async fetchListings () {
      const listings = require('~/plugins/listings.js')

      this.$nuxt.$loading.start()
      this.loading = true
      try {
        await listings.get(this)
      } catch (error) {
        console.log('error - ', error)
      }

      this.loading = false
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
