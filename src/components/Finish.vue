<template lang='pug'>
v-layout#Finish(fill-height column)
    .main-pane
        template
            v-container(fluid)
                v-card.ma-3.pa-1
                    v-layout(justify-center)
                        v-dialog(v-model='dialog' presistent max-width='600px')
                            template(v-slot:activator='{ on }')
                                v-card.orange.lighten-3.ma-2(v-on='on' width='15vw' :aspect-ratio='9/16')
                                    v-card-text 教卓
                            //- dialog card information
                            v-card
                                v-card-title
                                    span.headline Chair Information
                                v-card-text
                                    v-container(grid-list-md)
                                        v-layout(wrap)
                                            v-flex(xs12 sm12 md12)
                                                v-text-field(label='出席番号' v-model='resAnum')
                                            v-flex(xs12 sm12 md12)
                                                v-text-field(label='position-number' v-model='resPos' required)
                                            v-flex(xs12 sm12 md12)
                                                v-text-field(label='password' v-model='msg.mask' required) {{ maskMsg() }}
                                            v-card-actions(xs12 sm8 md6)
                                                v-btn(color='blue darken-1' flat @click='onSend') Send
                                            v-card-actions(xs12 sm4 md6)
                                                v-btn(color='blue darken-1' flat @click='false') Cancel
                    v-layout(justify-center column)
                        v-flex
                            v-layout(row wrap align-center justify-space-around)
                                //- v-dialog(v-model='dialog' presistent max-width='600px')
                                //-     template(v-slot:activator='{ on }')
                                v-card.primary.lighten-4.mb-2(v-for='i in num' :key='i' width='calc(100vw/7.5)' :aspect-ratio='1')
                                    v-card-text(canter) {{ i }}

</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';

@Component
export default class Finish extends Vue {

    protected dialog = false;
    protected num = [] as string[];
    protected socket = io();
    protected resAnum = 0;
    protected resPos = 0;
    protected resPass = '';
    protected msg = {
        mask: '',
    };
    // 初期状態
    protected created() {
        for (let i = 0; i < 43; i++) {
            this.num[i] = String(i + 1);
        }
        this.socket.on('all_seats' , (seats: string) => {
            const jseats = JSON.parse(seats);
            for (const seat of jseats) {
                this.insertNum(seat.name, seat.position);
            }
        });
        this.socket.on('new_seat', (seat: string) => {
            const jseats = JSON.parse(seat);
            this.insertNum(jseats.name, jseats.position);
        });
    }
    protected onSend() {
        if (this.resAnum === 0 || this.resPos === 0 || this.resPass === '') {
            return;
        }
        const myJson = {
            id: this.resAnum,  // attendance number
            position: this.resPos,
            passward: this.resPass,
        };
        this.socket.emit('res_seat', JSON.stringify(myJson));
        // console.log(myJson);
        [ this.resPass, this.msg.mask ] = ['' , ''];
        this.resAnum = 0;
        this.resPos = 0;
        this.dialog = false;    // dialogを閉じる
    }
    protected insertNum(name: string, pos: number ) {
        // for (let i = 0; i < 43; i++) {
        //     this.num[i] = (`${i + 1}`);
        // }
        this.num[pos] = name;
        // console.log(this.num[pos]);
    }
    protected maskMsg() {
        const char = this.msg.mask.charAt(this.msg.mask.length - 1);
        // 複数回呼ばれるため一文字に対して一回だけ
        if (char !== '*') {
            this.resPass += char;   // 末尾にマスク前の文字列を追加
            this.msg.mask = this.msg.mask.replace(/\S/g, '*');  // 全ての文字を置き換える
            // console.log(this.resPass);
        }
    }
}
</script>

<style lang='stylus' scoped>
@require '~@/assets/styles/entry/_variable.styl';
html
    scroll-view: true;

#Finishh
    .main-pane
        main-pane();
    .center
        text-align :center;
    .card-style
        // width :14%;
        // min-width : 10%;
        height :4rem;
</style>
