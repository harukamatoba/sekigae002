<template lang='pug'>
v-layout#home(fill-height column)
    lottery
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import Lottery from '@/components/Lottery.vue';

@Component({
    components: {
        Lottery,
    },
})
export default class Home extends Vue {}
</script>

<style lang='stylus'>
@require '~@/assets/styles/entry/_view.styl';

html
    scroll-view: true;
    // static-view: true;
</style>

<style lang='stylus' scoped>
@require '~@/assets/styles/entry/_variable.styl';

#home {}
</style>
