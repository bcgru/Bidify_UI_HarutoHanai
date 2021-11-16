<template>
  <el-dialog
    :visible.sync="showModal"
    title="Start an Auction"
    label-width="0px"
  >
    <el-button class="btn-close" type="default" circle @click="cancel()">
      <i class="el-icon-close icon" />
    </el-button>

    <el-form :model="form" label-position="top">
      <el-form-item label="Contract Address">
        <el-input v-model="form.platform" placeholder="enter contract address ..." />
      </el-form-item>
      <el-form-item label="Token Id">
        <el-input v-model="form.token" placeholder="enter token id ..." />
      </el-form-item>
      <el-form-item label="Currency Address">
        <el-input v-model="currency" placeholder="enter currency token address ..." />
      </el-form-item>
      <el-form-item>
        <el-select v-model="currency" style="width: 100%">
          <el-option v-for="(token, index) in tokenAddresses" :key="index" :value="token">
            {{ tokens[token].symbol + ' - ' + tokens[token].name }}
          </el-option>
        </el-select>
      </el-form-item>
      <div class="el-flex-box">
        <el-form-item label="Price">
          <el-input-number
            v-model="price"
            :precision="3"
            :step="0.01"
            :min="0.001"
            :max="100"
            @change="priceChanged"
          />
        </el-form-item>
        <el-form-item label="Days">
          <el-input-number v-model="days" :min="1" :max="10" @change="daysChanged" />
        </el-form-item>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="waiting || waitingStore" class="btn-action" size="default" @click="list()">Start Auction</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogList',
  data () {
    return {
      currency: '0x0000000000000000000000000000000000000000',
      price: 0.1,
      days: 1,
      waiting: false,
      tokens: {},
      tokenAddresses: []
    }
  },
  computed: {
    showModal () {
      return this.$store.state.bidify.listModal ? true : null
    },
    waitingStore () {
      return (this.$store.state.bidify.approving || this.$store.state.bidify.listing) ? true : null
    },
    form () {
      const listModal = this.$store.state.bidify.listModal

      if (!listModal) {
        return {}
      }

      return {
        platform: listModal.address,
        token: listModal.token_id
      }
    }
  },
  async mounted () {
    await this.fetchTokenData()
  },
  methods: {
    async fetchTokenData () {
      await fetch('https://api.pancakeswap.info/api/v2/tokens', {

      })
        .then((response) => {
          return response.json()
        })
        .then((response) => {
          this.tokens = response.data
          this.tokenAddresses = Object.keys(response.data)
        })
    },
    cancel () {
      this.$store.commit('bidify/listModal', false)
    },
    async list () {
      this.waiting = true
      const listings = require('~/plugins/listings.js')

      const listModal = this.$store.state.bidify.listModal

      const params = {
        currency: this.currency.toString(),
        platform: listModal.address,
        token: listModal.token_id,
        price: this.price.toString(),
        days: this.days.toString()
      }
      let list
      try {
        list = await listings.list({
          $store: this.$store,
          params
        })

        const successPayload = {
          type: 'list',
          auction: list
        }
        this.$store.commit('bidify/successModal', successPayload)
      } catch (error) {
        console.log(error)
      }

      this.cancel()
      await listings.getOwnedNFTs(this)
      await listings.getOwnedListings(this)

      this.waiting = false
      return list
    },
    priceChanged (value) {
      this.price = value
    },
    daysChanged (value) {
      this.days = value
    }
  }
}
</script>

<style lang="stylus">
  .el-dialog
    padding 30px
    max-width 570px
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
