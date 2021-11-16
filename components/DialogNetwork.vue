<template>
  <el-dialog
    title="Wrong Network"
    :visible.sync="chainInvalid"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="500px"
  >
    <span>Change network to <span v-for="(chain, i) in chainNames" :key="i">{{ chain }} </span> and refresh the page.</span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogNetwork',
  computed: {
    chainInvalid () {
      return this.$store.state.wallets.chainInvalid
    },
    chainNames () {
      return this.$config.chainNames
    }
  }
}
</script>
<style lang="stylus">
  .el-dialog__body
    color white
</style>
