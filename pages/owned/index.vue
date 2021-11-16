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
    <div v-if="owned" class="page">
      <Nav />
      <section class="section hero listing" />
      <section class="section hero-container">
        <div class="container">
          <div class="listing-logo">
            <div class="logo-image">
              <img src="~/assets/logos/listing-logo.svg" alt="Listing Logo">
            </div>
          </div>
          <div class="hero-content mt-3">
            <h1>My Auctions</h1>
            <p class="section-description fixed-width">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
            </p>
          </div>
        </div>
      </section>
      <section class="section filter-section">
        <div class="social-links">
          <ul>
            <li>
              <a href="https://www.instagram.com/flufworld/?hl=en">
                <img src="~/assets/icons/icon-instagram.svg" alt="">
              </a>
            </li>
            <li>
              <a href="https://twitter.com/FLUF_World">
                <img src="~/assets/icons/icon-twitter.svg" alt="">
              </a>
            </li>
            <li>
              <a href="https://github.com/Bidify">
                <img src="~/assets/icons/icon-github.svg" alt="">
              </a>
            </li>
          </ul>
        </div>
        <div class="filter-options">
          <div class="search-box">
            <form
              class="search-form"
              action="/listing/page/1"
              method="GET"
            >
              <div class="form-wrap form-wrap-icon">
                <input
                  id="search-form-input"
                  class="search-form-input"
                  type="text"
                  name="s"
                  autocomplete="off"
                  placeholder="Search..."
                  :value="$router.history.current.query.s"
                >
                <button class="search-button">
                  <img src="~/assets/icons/icon-search.svg" alt="">
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section class="section new-arrivals">
        <div class="container">
          <div class="new-auctions auction-list mb-4">
            <div class="row">
              <div v-for="(item, index) in owned" :key="index" class="col-xl-3 col-md-6">
                <Card :item="item" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section new-arrivals">
        <div class="container">
          <div class="new-auctions auction-list mb-4">
            <h3 class="section-title">
              Not Listed
            </h3>
            <div class="row">
              <div v-for="(item, index) in nfts" :key="index" class="col-xl-3 col-md-6">
                <NFTCard :item="item" />
              </div>
            </div>
          </div>
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
  name: 'Owned',
  data () {
    return {
      loading: true
    }
  },
  computed: {
    owned () {
      return this.$store.state.localStorage.listings.owned
    },
    nfts () {
      return this.$store.state.localStorage.listings.nfts
    }
  },
  mounted () {
    setTimeout(() => {
      this.fetchListings()
    })
  },
  methods: {
    async fetchListings () {
      const listings = require('~/plugins/listings.js')

      this.$nuxt.$loading.start()
      this.loading = true

      try {
        await listings.getOwnedListings(this)
        await listings.getOwnedNFTs(this)
      } catch (error) {
        console.log('error - ', error)
      }

      this.loading = false
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
