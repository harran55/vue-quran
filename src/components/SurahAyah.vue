<template>
    <div>
        <b-container class="col-lg-6 col-md-12 col-sm-12">
            
            <b-tabs content-class="mt-3" fill>
                <b-tab title="التشغيل" active>
                    <b-button @click="pause" class="iplay" :title="isPlay ? 'تشغيل' : 'إيقاف'">
                        <b-icon-play v-if="isPlay" />
                        <b-icon-pause v-else />
                    </b-button>
                    <b-button class="iplay">
                        <b-icon-volume-up-fill id="volume"/>
                        <b-tooltip target="volume" placement="bottom">
                            <b-form-input v-model="volume" type="range" min="0" max="1" step="0.5"></b-form-input>
                        </b-tooltip>
                    </b-button>
                    <b-button v-for="(val, int) in options" :key="int" 
                    :variant="(page_repeat == val.value ? 'primary' : '')"
                    @click="repeat(val.value)" class="iplay" :id="'btn'+int">
                    <b-icon-arrow-counterclockwise v-if="int == 0"/>
                    <b-icon-arrow-repeat v-if="int == 1"/>
                    <b-icon-shuffle v-if="int == 2" flip-h/>
                    <b-tooltip :target="'btn'+int" placement="bottom">
                        {{ val.text }}
                    </b-tooltip>
                    </b-button>
                </b-tab>
                <b-tab title="القارئ">
                    <carousel :nav="false" dir="ltr" :responsive="{autoWidth:true,margin:0,0:{items:2},600:{items:4}}">
                        <b-button v-for="(item, index) in arrayAudio" :key="index"
                        :variant="item.identifier ==  $parent.settings.reader ? 'primary' : 'outline-primary'"
                        @click="reReader(item.identifier)" :v-if="item.identifier != null">
                        {{ item.name }}
                        </b-button>
                    </carousel>
                </b-tab>
                <b-tab title="الخط">
                    <b-row>
                        <b-col>
                        <label for="fontSize">حجم الخط</label>
                        <b-form-spinbutton id="fontSize" v-model="fontSize" @change="style" min="12" max="60"></b-form-spinbutton>
                        </b-col>
                        <b-col>
                        <label for="fontWord">المسافة بين الكلمات</label>
                        <b-form-spinbutton id="fontWord" v-model="fontWord" @change="style" min="2" max="60"></b-form-spinbutton>
                        </b-col>
                    </b-row>
                </b-tab>
                <b-tab title="الفهرس">
                    <b-row>
                        <b-col>
                            {{ npage }}
                        <label for="fontSize">اختيار السورة</label>
                        <b-button variant="primary" to="/" class="d-block">
                            الأنتقال الى الفهرس
                        </b-button>
                        </b-col>
                        <b-col>
                        <label for="fontNumber">أو ادخل رقم الصفحة</label>
                        <b-form-input v-model="par" @change="goPage" type="number" :value="par" min="1" max="604"></b-form-input>
                        </b-col>
                    </b-row>
                </b-tab>
            </b-tabs>
            <b-overlay :show="show" rounded="sm" style="line-height: initial;padding: 0 8px 15px 8px;">
            
            <span v-for="(value, index) in surah" :key="index" class="ayahk" :data-id="value.number" 
            :id="'button'+value.number" :aria-hidden="show ? 'true' : null">
            
                <div v-if="index == 0 || value.numberInSurah == 1" :class="value.numberInSurah == 1 ? 'in-surah' : 'of-surah'">
                    <b>{{ value.surah.number }}.</b> {{ value.surah.name }}
                </div>

                <strong v-if="par == 1 && value.numberInSurah == 1" v-html="value.text" @click="xplay(index)" 
                :class="index == tRead ? 'x-start' : ''"></strong>
                <strong v-else :inner-html.prop="value.text | basmala" @click="xplay(index)" 
                :class="index == tRead ? 'x-start' : ''"></strong>
                
                <b class="numbers">{{value.numberInSurah}}</b>
            </span>
            <b-tooltip :target="() => $refs['prostration']" title="موضع سجود"></b-tooltip>
            </b-overlay>

        <div class="bpage">
            <button v-if="$route.params.id > 1" @click="goLink(0)" class="float-end">
                <b-icon icon="arrow-bar-right"></b-icon>
            </button>
            <strong>
                ( {{ page }}  )
            </strong>
            <button v-if="$route.params.id < 604" @click="goLink(1)" class="float-start">
                <b-icon icon="arrow-bar-left"></b-icon>
            </button>
        </div>
        <b-modal ref="modal" hide-footer>
            <template #modal-title>
                تنوية
            </template>
            <div class="d-block text-center">
                <h3>
                    وصلت الى الصفحة الآخيرة
                </h3>
            </div>
        </b-modal>
        </b-container>
        <audio id="audio"></audio>
    </div>
</template>


<script>
import axios from 'axios'
import carousel from 'vue-owl-carousel'
import jsonAudio from '@/assets/Audio'

export default {
    name: 'SurahAyah',
    components: { 
        carousel
    },
    data() {
        return {
            // quran: [],
            npage: [],
            surah: [],
            par: Number,
            arrayAudio: jsonAudio.data,
            page: 0,
            isPlay: false,
            show: false,
            tRead: Number,
            volume: 1,
            fontSize: 16,
            fontWord: 2,
            page_repeat: 'page',
            reayah: 0,
            options: [
                { text: 'سيتم تكرار قراءة الصفحة', value: 'page' },
                { text: 'سيتم تكرار قراءة الآية ثلاث مرات', value: 'ayah' },
                { text: 'سيتم الانتقال الى الصفحة التالية بعد الأنتهى من قراءة الصفحة', value: 'next' },
            ]
        }
    },
    methods: {
        async run() {
            // this.quran = this.$parent.settings.surah.data
            this.npage = this.$parent.settings.npage
            this.show  = true
            let Nxpage = this.par = this.$route.params.id
            let Qar    = this.$parent.settings.reader
            await axios.get('http://api.alquran.cloud/v1/page/'+Nxpage+'/'+Qar)
            .then(response => {
                this.surah = []
                this.surah = response.data.data.ayahs
                this.page  = response.data.data.ayahs[0].page
                this.show = false
            });
            await this.xplay(0)
        },
        async pause() {
            var audio = document.getElementById("audio")
            if (audio.paused) {
                await audio.play()
            } else {
                await audio.pause()
            }
            this.isPlay = audio.paused
        },
        async xplay(id) {
            this.tRead = id
            var coun = this.surah.length
            var sound = this.surah[id].audio, audio = ''
            audio = document.getElementById("audio")
            await audio.setAttribute('src', sound)
            audio.volume = this.volume
            if (!this.isPlay)
                    audio.play()
            
            audio.onended = () => {
                if (coun-1 > id && this.page_repeat == 'page' || coun-1 > id && this.page_repeat == 'next') {
                    this.xplay(id+1)
                }
                else if (this.page_repeat == 'ayah') {
                    if (this.reayah < 2) {
                        this.xplay(id)
                        this.reayah++
                    } else {
                        this.reayah = 0
                        this.xplay(id+1)
                    }
                }
                else if (this.page_repeat == 'page'){
                    this.xplay(0)
                }
                else if (this.page_repeat == 'next'){
                    if (this.page <= 603) {
                        this.$router.push('/'+(this.page+1))
                    }
                    else {
                        this.$refs['modal'].show()
                    }
                }
            }
        },
        goLink(val = null) {
            this.$router.push('/'+(val ? this.page+1 : this.page-1))
        },
        goPage() {
            this.$router.push('/'+this.par)
        },
        repeat(val) {
            this.page_repeat = val
        },
        reReader(val) {
            this.$parent.settings.reader = val
            this.run()
        },
        style() {
            let style = document.querySelector('style')
            style.innerHTML = 'span strong {font-size:'+this.fontSize+'px;word-spacing:'+this.fontWord+'px;}';
        }
    },
    mounted() {
        this.run()
    },
    created() {
        this.run()
    },
    watch: {
        $route: "run"
    }
}
</script>
