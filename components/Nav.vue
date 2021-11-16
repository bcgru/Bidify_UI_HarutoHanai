<template>
  <!-- Page Header-->
  <header class="header">
    <div class="container">
      <nav class="navbar navbar-original navbar-static">
        <div class="navbar-brand">
          <NuxtLink class="brand-name" to="/">
            <img src="~/assets/logos/header-logo.svg" alt="Header Logo">
          </NuxtLink>
        </div>
        <div class="navbar-nav-wrap">
          <!-- RD Navbar Brand-->
          <!-- RD Navbar Nav-->
          <ul class="navbar-nav desktop-nav">
            <li :class="$router.history.current.path == '/'?'active':''">
              <NuxtLink to="/">
                Home
              </NuxtLink>
            </li>
            <li>
              <a href="https://bidify.org/" target="_blank">
                About Bidify
              </a>
            </li>
            <li>
              <a href="https://fluf.world/" target="_blank">
                About FLUF
              </a>
            </li>
            <li :class="$router.history.current.path.includes('/listing/page')?'active':''">
              <NuxtLink to="/listing/page/1">
                Auctions
              </NuxtLink>
            </li>
            <li :class="$router.history.current.path == '/owned'?'active':''">
              <NuxtLink to="/owned">
                My Auctions
              </NuxtLink>
            </li>
            <li>
              <el-dropdown v-if="connected" trigger="click" @command="handleCommand">
                <el-button type="default" class="is-themed" :circle="true">
                  <i class="el-icon-user" />
                </el-button>
                <el-dropdown-menu slot="dropdown" style="width: 280px;">
                  <div class="balance">
                    <div class="simple-list">
                      <h5>
                        Wallet

                        <span class="truncate">
                          {{ address }}
                        </span>
                      </h5>

                      <div class="simple-list-item">
                        <div class="label">
                          <small>Balance</small>

                          <span>{{ balances.ether }} ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <el-dropdown-item divided command="disconnect" class="text-center">
                    Disconnect
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-button v-else type="info" :round="true" @click="connect()">
                Connect
              </el-button>
            </li>
          </ul>
          <el-dropdown trigger="click" class="mobile-nav" @command="handleCommand">
            <el-button type="default" class="is-themed" :circle="true">
              <i class="el-icon-menu" />
            </el-button>
            <el-dropdown-menu slot="dropdown" style="width: 280px;">
              <ul class="navbar-nav">
                <li :class="$router.history.current.path == '/'?'active':''">
                  <NuxtLink to="/">
                    Home
                  </NuxtLink>
                </li>
                <li :class="$router.history.current.path == '/about'?'active':''">
                  <a href="https://bidify.org/" target="_blank">
                    About Us
                  </a>
                </li>
                <li :class="$router.history.current.path.includes('/listing/page')?'active':''">
                  <NuxtLink to="/listing/page/1">
                    Explore
                  </NuxtLink>
                </li>
                <li :class="$router.history.current.path == '/owned'?'active':''">
                  <NuxtLink to="/owned">
                    My Auctions
                  </NuxtLink>
                </li>
              </ul>
              <div class="balance">
                <div v-if="connected" class="simple-list">
                  <h5>
                    Wallet

                    <span class="truncate">
                      {{ address }}
                    </span>
                  </h5>

                  <div class="simple-list-item">
                    <div class="label">
                      <small>Balance</small>

                      <span>{{ balances.ether }} ETH</span>
                    </div>
                  </div>
                  <el-dropdown-item divided command="disconnect" class="text-center">
                    Disconnect
                  </el-dropdown-item>
                </div>
                <el-button v-else :round="true" @click="connect()">
                  Connect
                </el-button>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>

export default {
  name: 'Connected',
  data () {
    return {
      searchKey: ''
    }
  },
  computed: {
    balances (type) {
      const balances = Object.assign({}, this.$store.state.wallets.balances)

      if (!balances) {
        return
      }

      Object.keys(balances).forEach((b) => {
        balances[b] = Number.parseFloat(balances[b]).toFixed(3)
      })

      return balances
    },
    connected () {
      return this.$store.state.wallets.connected
    },
    address () {
      return this.$store.state.wallets.account
    }
  },
  methods: {
    connect () {
      const wallets = require('~/plugins/wallets.js')

      // clicking connect resets any trickery with app display
      this.$store.commit('localStorage/resetDisconnect')

      wallets.requestAccounts({
        $store: this.$store,
        type: 'browser'
      })
    },
    disconnect () {
      const wallets = require('~/plugins/wallets.js')

      wallets.manualDisconnect({ $store: this.$store, $notify: this.$notify })
    },
    dark () {
      this.$colorMode.preference = 'dark'
    },
    light () {
      this.$colorMode.preference = 'light'
    },
    handleNavCommand (command) {
      this.$router.push(command)
    },
    handleCommand (command) {
      this[command]()
    },
    toggleColorMode () {
      this.$colorMode.preference = 'white'
    }
  }
}
</script>

<style lang="stylus" scoped>

  .simple-list
    padding $space-s $space-m
    border-bottom none

    h5
      font-size 18px

  .simple-list-item
    border-bottom none

  h5
    margin-bottom $space-m

    span
      font-weight normal
      text-transform none

  .balance
    padding 0

    span
      font-size 12px
      color $grey

  .el-dropdown
    margin-left $space-m

    +for_breakpoint(xs sm)
      margin-left $space-xs

  .el-dropdown-menu
    .el-dropdown-menu__item
      position relative

    .el-badge__content
      position absolute
      right $space-m
      top $space-s

  .nav
    background-color $dark
    width 100%
    display flex
    justify-content space-between
    align-items center
    position relative
    z-index 1000
    overflow hidden

    .el-button
      font-family objektiv-mk1, sans-serif
      text-decoration none

    .el-button.el-button--text
      margin-left 0

    .el-button.is-profile
      margin-left 16px

  .nav-logo-wrap
    padding $space-s $space-m
    display block

  .logo-svg
    width auto
    height 50px
    position relative
    top 3px

  .nav-actions
    padding 0 16px
</style>
