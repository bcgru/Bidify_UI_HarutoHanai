export const state = () => ({
  bidding: false,
  listModal: false,
  auctionModal: false,
  successModal: false,
  listing: false,
  signing: false,
  error: null
})

export const mutations = {
  bidding (state, action = true) {
    state.bidding = action
  },
  listModal (state, visible) {
    state.listModal = visible
  },
  auctionModal (state, visible) {
    state.auctionModal = visible
  },
  successModal (state, visible) {
    state.successModal = visible
  },
  signing (state, request) {
    state.signing = request
  },
  listing (state, request) {
    state.listing = request
  },
  error (state, error) {
    state.error = error
  }
}
