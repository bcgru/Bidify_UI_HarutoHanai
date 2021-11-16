<template>
  <div class="auction-item">
    <NuxtLink class="card-link" :to="`/listing/${ item.listing_id }/${ item.platform }/${ item.token }`">
      <div class="nft-image">
        <img
          :src="item.image_preview_url"
          alt=""
        >
      </div>
      <div class="auction-meta pt-2">
        <h5 class="auction-title">
          {{ item.label }}
        </h5>
      </div>
      <div class="auction-balance pb-3">
        <span>Price:</span>
        <span class="auction-price">{{ item.nextBid }} ETH</span>
      </div>
      <div class="auction-limit border-bottom pb-3">
        <div class="auction-limit-time">
          <div class="time-item">
            <span>{{ days }}</span>
            <span class="auction-limit-label">Days</span>
          </div>
          <div class="time-item">
            <span>{{ hours }}</span>
            <span class="auction-limit-label">Hours</span>
          </div>
          <div class="time-item">
            <span>{{ minutes }}</span>
            <span class="auction-limit-label">Minutes</span>
          </div>
          <div class="time-item">
            <span>{{ seconds }}</span>
            <span class="auction-limit-label">Seconds</span>
          </div>
        </div>
      </div>
      <div class="auction-action mt-3">
        <button v-if="time !== 'Ended'" type="button" class="btn btn-block bidify-button bid-button" @click="showAuction($event)">
          place a bid
        </button>
        <button v-else-if="!item.paidOut" type="button" class="btn btn-block bidify-button bid-button" @click="showAuction($event)">
          Finish
        </button>
        <span v-else class="btn btn-block ended-button" @click="showAuction($event)">
          {{ time }}
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
import RealtimeCountdown from 'realtime-countdown'

export default {
  name: 'CardB',
  props: {
    item: Object,
    type: String
  },
  data () {
    return {
      time: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },
  mounted () {
    this.timeLeft()
  },
  methods: {
    showAuction ($event) {
      $event.preventDefault()
      this.$store.commit('bidify/auctionModal', this.item)
    },
    setTimeLeft (t) {
      this.days = t.days
      this.hours = t.hours
      this.minutes = t.minutes
      this.seconds = t.seconds
    },
    timeLeft () {
      const timeStamp = this.item.endTime * 1000

      const onCountInitialized = t => this.setTimeLeft(t)

      const onCount = t => this.setTimeLeft(t)

      const onCountEnd = (t) => {
        this.time = 'Ended'
      }

      return new RealtimeCountdown({ timeStamp, onCountInitialized, onCount, onCountEnd })
    }
  }
}
</script>
