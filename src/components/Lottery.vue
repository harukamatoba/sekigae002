<template lang='pug'>
.Lottery
    p.mb-0.ml-3.mt-1 出席番号
    v-layout(wrap row align-center justify-space-around)
        v-flex(xs6)
                v-card
                    v-layout
                        v-card-text.ml-2 {{radio}}
                        v-btn.pa-0(flat icon @click="test=true") ▼
        //出席番号入力フォーム
        v-dialog(color="white" v-model="test" max-width="500px" scrollable)
            v-card
                v-card-text(style='height: 500px;')
                    p.pa-0 出席番号を選択してください
                    v-radio-group(v-model="radio")
                        v-radio.pa-1(v-for="i in 43" :key="i" :value="i" :label="i")
                v-divider.blue(height="2px")
                v-card-actions
                    v-spacer
                    v-btn(@click="test=false") OK



        v-btn.mt-2.amber.accent-4.white--text(@click="slotStart" :disabled='check.btnDisable') 抽選
        //抽選ボタン　一回押すと押せなくなります
        v-snackbar.red--text(v-model="check.tipcheck" vertical timeout=3000) 出席番号入れてね
            v-divider.white(height=2)
            v-btn(flat @click="check.tipcheck = false") close


    v-layout(wrap row justify-space-around)
        v-responsive.mt-4(:aspect-ratio="1/1" max-width="40%" min-width="200px")
            v-card.blue(max-width="100%" min-width="200px" height="100%")
                v-layout(align-center max-width="100%" min-width="100%")
                    v-card-text.white--text.shuffleText.text-xs-center.px-0(width="100%") {{cardState.text}}
        //ここが生成された席番号を表示される

    v-dialog(v-model="check.dialog" persistent)
        v-card.blue.pt-1
            v-card.ma-3.pa-1
                    //教室の箱
                    v-layout(justify-center)
                        v-card.orange.lighten-3.ma-2(width='20vw' :aspect-ratio='9/16' @click='KyoudanClick')
                                v-card-text 教卓
                                //教卓

                    v-layout(justify-center column)
                        v-flex
                            v-layout(row wrap align-center justify-space-around)
                                v-card.primary.lighten-4.mb-2(width='calc(100vw/8.5)' :aspect-ratio='1' v-for='seki in 43' :key='seki' @click='sekiClick(i)')
                                    .catch(v-if='select.seki == seki')
                                        v-card.red(width='calc(100vw/8.5)' :aspect-ratio='1')
                                            v-card-text HIT
                                            //生成された席番号と表示している席の番号が等しい場合赤い箱にしてメッセージを変える
                                    .catch(v-else)
                                        v-card-text {{seki}}
            v-card-actions
                v-spacer
                v-btn.white(@click="finishClick") OK
    .aftercheck(v-if="cardState.shuffleState==true")
        after
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';
import After from '@/components/ShuffleAfter.vue';


@Component({
    components: {
        After,
    },
})
export default class Lottery extends Vue {
    protected number = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43,
    ];
    protected rule =  [(value: number) => !!value ||  '値を入れてね' ];
    protected sekiTmp = 0;  // selectで選んだ出席番号
    protected select = {number: -1, seki: -1};

    protected test = false;
    protected radio = 0;
    protected cardState = {
        elevate: 0,             // アニメーション再生後、数字が確定すると浮き上がらせたい
        shuffleState: false,    // シャッフルする前はfalse、し始めるとtrue
        text: '? ?',
    };
    protected randNum = -1;
    protected check = {
        dialog: false,
        btnDisable: false,
        tipcheck: false,
    };

    protected socket = io();
    protected created() {
        this.socket.on('set_seat', (position: number) => {
            console.log('position: '+ position);
            this.select.seki = position;
            console.log('select.seki: ' + this.select.seki);
            // tslint:disable-next-line:max-line-length
            this.cardState.text = Math.floor((this.select.seki / 10)).toString() + ' ' + (this.select.seki % 10).toString();
        });
    }

    protected slotStart() {
        if (this.sekiTmp !== 0 ) {
            this.socket.emit('send_id', this.sekiTmp);
            this.cardState.shuffleState = true;
            this.select.number = this.sekiTmp;   // とりあえず引いたよーって変数の中身を変更
            // tslint:disable-next-line:max-line-length
            this.cardState.text = Math.floor((this.select.seki / 10)).toString() + ' ' + (this.select.seki % 10).toString();

            this.check.btnDisable = true;
            this.check.dialog = true;
        } else {
            this.check.tipcheck = true;
        }
    }
    protected async KyoudanClick() {
        await this.$vdialog.alert({title: '警告', message: 'そこ、野本さんの席だからぁ！！'}).promise;
    }
    protected finishClick() {
        this.check.dialog = false;
        this.$router.push({name: 'Finish'});
    }
}
</script>

<style lang='stylus' scoped>
@require '~@/assets/styles/entry/_variable.styl';

.Lottery
    .shuffleText
        font-size: 20vw;


</style>
