export const state = () => ({
  wallet: {
    provider: null, // if this exists, app will use it try to reconnect and ignore other connections
    keepDisconnect: false, // metamask doesn't really disconnect ... this prevents loading the app as connected, even though it is
    expire: 1 // 1 hour ... reconnects on refresh
  },
  listings: {
    list: [],
    popularList: [],
    owned: [],
    nfts: [],
    active: null,
    expire: 0.5, // 30 minutes
    totalPages: 0
  }
})

export const mutations = {
  provider (state, provider) {
    state.wallet.provider = provider
  },
  disconnect (state) {
    state.wallet.provider = null
  },
  keepDisconnect (state) {
    state.wallet.keepDisconnect = true
  },
  resetDisconnect (state) {
    state.wallet.keepDisconnect = false
  },
  listing (state, list) {
    state.listings.list = list
  },
  popularListing (state, list) {
    state.listings.popularList = list.slice().sort((a, b) => b.bids.length - a.bids.length)
  },
  owned (state, owned) {
    state.listings.owned = owned
  },
  nfts (state, nfts) {
    state.listings.nfts = nfts
  },
  active (state, listing) {
    state.listings.active = listing
  },
  totalPages (state, totalPages) {
    state.listings.totalPages = totalPages
  }
}
