/**
 * Layer between client and Bidify that performs method calls and manages states
 * @module listings
 * @example
 * const listings = require('~/plugins/listings.js')
 *
 * listings.get(...)
 */

/**
 * Mutations for assets from opensea
 * @name transformAssets
 * @method
 * @param {array} listings listings.assets[x] to transform
 * @memberof listings
 */

const transformAssets = (listings) => {
  if (!listings || !listings.assets) {
    return listings
  }

  return listings.assets.map((l, i) => {
    l.address = l.asset_contract.address

    l.owned = l.owner.address === 'foo'

    l.label = l.name

    l.index = i

    return l
  })
}

/**
 * Mutates listings from listing { object } to opensea assets
 * @name addAssetsToListings
 * @method
 * @param {array} listings { listing ... } to transform
 * @memberof listings
 */

async function addAssetsToListings (listings) {
  const seaport = require('~/plugins/opensea.js')

  const assetList = listings.map((l) => {
    return {
      token_id: l.token,
      address: l.platform
    }
  })

  const assets = transformAssets(await seaport.getAssets(assetList))

  return listings.map((l) => {
    let match = assets.find(t => t.address.toLowerCase() === l.platform.toLowerCase() && t.token_id === l.token)
    if (!match) {
      match = {
        label: `Bidify ${l.id}`,
        creator: {
          address: l.creator,
          user: {}
        }
      }
    }

    return Object.assign({ listing_id: l.id }, l, match)
  }).filter((asset, i) => {
    return (asset.image_url !== '')
  })
}

/**
 * Mutates NFT's from platform/token pairs to opensea assets
 * @name addAssetsToNfts
 * @method
 * @param {array} nfts { platform, token } to transform
 * @memberof listings
 */
async function addAssetsToNfts (nfts) {
  const seaport = require('~/plugins/opensea.js')

  const assetList = nfts

  const assets = transformAssets(await seaport.getAssets(assetList))

  return assetList.map((n, i) => {
    let match = assets.find((a) => {
      return (a.address.toUpperCase() === n.address.toUpperCase()) && (a.token_id === n.token_id)
    })

    if (!match) {
      match = {
        label: `NFT ${i}`,
        creator: {
          address: n.creator,
          user: {}
        }
      }
    }
    return Object.assign({}, n, match)
  }).filter((asset, i) => {
    return (asset.image_url !== '')
  })
}

/**
 * Gets current listings (from route param), merges with open sea, then commits to store 'localStorage/listing'
 * @name get
 * @method
 * @param {object} $store context
 * @memberof listings
 */

export async function get ({ $store, $route }) {
  const bidify = require('~/plugins/bidify.js')
  const searchKey = $route.query.s
  const pageNumber = $route.params.number
  // get bidify listings
  const listings = await bidify.getListings()
  // get bidify listing for each
  for (let i = 0; i < listings.length; i++) {
    listings[i] = await bidify.getListing(listings[i])
  }

  // get assets and merge data
  const assets = await addAssetsToListings(listings)
  const list = assets.sort((a, b) => parseInt(b.listing_id) - parseInt(a.listing_id))

  if (searchKey) {
    const filteredListings = list.filter((listing) => {
      return listing.name.toLowerCase().includes(searchKey.toLowerCase())
    })
    const slicedListings = filteredListings.slice((pageNumber - 1) * 8, (pageNumber * 8))
    // commit to store
    await $store.commit('localStorage/totalPages', Math.ceil(filteredListings.length / 8))
    await $store.commit('localStorage/listing', slicedListings)
    await $store.commit('localStorage/popularListing', slicedListings)
  } else if (pageNumber) {
    const slicedListings = list.slice((pageNumber - 1) * 8, (pageNumber * 8))
    // commit to store
    await $store.commit('localStorage/totalPages', Math.ceil(list.length / 8))
    await $store.commit('localStorage/listing', slicedListings)
    await $store.commit('localStorage/popularListing', slicedListings)
  } else {
    await $store.commit('localStorage/listing', list)
    await $store.commit('localStorage/popularListing', list)
  }
}

/**
 * Get a users Bidify Listings, merges with open sea, then commits to store 'localStorage/owned'
 * @name getOwnedListings
 * @method
 * @param {object} $store context
 * @memberof listings
 */

export async function getOwnedListings ({ $store }) {
  const bidify = require('~/plugins/bidify.js')

  const account = $store.state.wallets.account

  if (!account) {
    return
  }

  // get bidify listings
  const myListings = await bidify.getListings(account)

  const listings = await bidify.getListings()

  for (let i = 0; i < listings.length; i++) {
    listings[i] = await bidify.getListing(listings[i])
  }

  // get assets and merge data
  const allAssets = await addAssetsToListings(listings)

  const myBidListings = allAssets.filter((listing) => {
    if (listing.bids.length) {
      for (let i = 0; i < listing.bids.length; i++) {
        if (account.toLowerCase() === listing.bids[i].bidder.toLowerCase() && !myListings.includes(listing.listing_id)) {
          return true
        }
      }
    }
    return false
  })

  // get bidify listing for each
  for (let i = 0; i < myListings.length; i++) {
    myListings[i] = await bidify.getListing(myListings[i])
  }

  // get assets and merge data
  const assets = await addAssetsToListings(myListings)

  const myAssets = assets.concat(myBidListings)

  // commit to store
  $store.commit('localStorage/owned', myAssets)
}

/**
 * Gets a single listing (from route param), merges with open sea, then commits to store 'localStorage/active'
 * @name getOne
 * @method
 * @param {object} $store context
 * @param {object} $route context
 * @memberof listings
 */

export async function getOne ({ $store, $route }) {
  const bidify = require('~/plugins/bidify.js')

  const id = $route.params.id.toString()

  const listing = await bidify.getListing(id)

  const assets = await addAssetsToListings([listing])

  if (!assets || !assets.length) {
    return
  }

  $store.commit('localStorage/active', assets[0])
}

/**
 * Get a user's NFT's that haven't been listed, merges with open sea, then commits to store 'localStorage/owned'
 * @name getOwnedNFTs
 * @method
 * @param {object} $store context
 * @memberof listings
 */

export async function getOwnedNFTs ({ $store }) {
  const bidify = require('~/plugins/bidify.js')

  const nfts = await bidify.getNFTs()

  const assets = await addAssetsToNfts(nfts)

  $store.commit('localStorage/nfts', assets)

  return assets
}

/**
 * Lists an NFT to Bidify
 * @name list
 * @method
 * @param {object} $store context
 * @param {object} params for listing
 * @memberof listings
 */

export async function list ({ $store, params }) {
  const bidify = require('~/plugins/bidify.js')

  $store.commit('bidify/signing', true)

  await bidify.signList(params)

  $store.commit('bidify/listing', true)
  $store.commit('bidify/signing', false)

  let listing = await bidify.list(params)
  listing = await bidify.getListing(listing)

  const assets = await addAssetsToListings([listing])

  $store.commit('bidify/listing', false)

  return assets[0]
}

/**
 * Lists an NFT to Bidify
 * @name list
 * @method
 * @param {object} $store context
 * @param {object} params for listing
 * @memberof listings
 */

export async function bid ({ $store, id, bidAmount }) {
  const bidify = require('~/plugins/bidify.js')

  $store.commit('bidify/signing', true)

  try {
    await bidify.signBid(id, bidAmount)
  } catch (err) {
    $store.commit('bidify/error', err.message)
    return
  }

  $store.commit('bidify/bidding', true)
  $store.commit('bidify/signing', false)

  try {
    await bidify.bid(id, bidAmount)
  } catch (err) {
    $store.commit('bidify/error', err.message)
    return
  }
  $store.commit('bidify/bidding', false)
  return true
}

/**
 * Finish a Listing to be Auction
 * @name list
 * @method
 * @param {object} $store context
 * @param {object} params for listing
 * @memberof listings
 */

export async function finishBid ({ $store, id }) {
  const bidify = require('~/plugins/bidify.js')

  $store.commit('bidify/signing', true)

  try {
    await bidify.finish(id)
  } catch (err) {
    $store.commit('bidify/error', err.message)
  }

  $store.commit('bidify/signing', false)
}

/**
 * Mints an NFT (development only)
 * @name mint
 * @method
 * @param {object} $store context
 * @param {string} tokenId
 * @memberof listings
 */

export async function mint ({ $store, tokenId }) {
  const bidify = require('~/plugins/bidify.js')

  return await bidify.mintNFT(tokenId)
}
