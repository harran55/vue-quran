<template>
    <div class="surah">
        <b-container class="col-8">
            <b-form-group label="البحث السريع"
            class="col-6 text-right mb-5 m-auto">
                <b-form-input v-model="keyword" placeholder="قم بأدخال رقم او اسم السورة"></b-form-input>
            </b-form-group>
            <ul class="ul">
                <li v-for="(value, index) in filteredList" :key="index">
                    <router-link :to="'/'+nPage[value.number-1]">
                        <b>{{ value.number }}.</b> {{ value.name }}
                    </router-link>
                </li>
            </ul>
        </b-container>
    </div>
</template>

<script>
import jsonSurah from '@/assets/Surah'

export default {
    name: 'surah',
    data() {
        return {
            surah: jsonSurah.data,
            keyword: '',
            nPage: ['1','2','50','77','106','128','151','177','187','208','221','235','249','255','262','267','282','293','305','312','322','332','342','350','359','367','377','385','396','404','411','415','418','428','434','440','446','453','458','467','477','483','489','496','499','502','507','511','515','518','520','523','526','528','531','534','537','542','545','549','551','553','554','556','558','560','562','564','566','568','570','572','574','575','577','578','580','582','583','585','586','587','587','589','590','591','591','592','593','594','595','595','596','596','597','597','598','598','599','599','600','600','601','601','601','602','602','602','603','603','603','604','604','604']
        }
    },
    computed: {
        filteredList() {
        return this.surah.filter(post => {
            return ((post.name)+' - '+(post.number)).toLowerCase().includes(this.keyword.toLowerCase())
        })
        }
    }
}
</script>


<style>
.surah  ul {
    list-style-type: none;
}
.surah li {
    font-family: 'MeQuran';
    display: inline-block;
    width: 20%;
    border: 1px solid #41b883;
    padding: 5px;
    margin: 0;
    text-align: right;
}

.surah li b {
    font-family: 'Quran';
    color: #9b2929;

}

.text-right {
    text-align: right;
}
</style>