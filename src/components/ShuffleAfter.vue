<template lang='pug'>
.SHUFFLE_AFTER
    v-card.mx-auto.success.ma-4(dark min-width='80vw')
        v-card-title(primary-title) 席替え抽選終了
        v-divider.white(height=3)
        v-card-text.caption 抽選終了です。

</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ShuffleAfter extends Vue {}
</script>

<style lang='stylus' scoped>
@require '~@/assets/styles/entry/_variable.styl';

.SHUFFLE_AFTER {}
</style>
