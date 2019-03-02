<template>
	<div class="home">
		<div>{{rate}}</div>

		<List :items="features"/>

		<chart type=line height=350 :options="chartOptions" :series="series"/>

		<button v-on:click="toggleFeature">Greet</button>

		<!--<HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
	</div>
</template>

<script lang="ts">
    import HelloWorld from '@/components/HelloWorld.vue';
    import List from "@/components/List.vue";
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters, mapState} from "vuex";
    import VueApexCharts from 'vue-apexcharts';


    @Component({
        components: {
            HelloWorld,
            List,
            chart: VueApexCharts,
        },
        computed: {
            ...mapState({
                rate: state => state.mortgage_rate,

                features: s => s.feats.list.map(i => ({
	                label: i.name,
	                enabled: i.enabled,
	                onToggle: function (enabled: boolean) {
                        console.log('onToggle', enabled);
	                    this.$store.dispatch("toggleFeature", { id: i.id, enabled });
	                }
                }))
            }),
            ...mapGetters({
                series: 'series'
            })
        },
        methods: {
            toggleFeature: function() {
                console.log('toggleFeature')
            }
        },
        data: function () {
            return {
                // series: [{
                //     name: "Desktops",
                //     data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
                // }],
                // items: [{label:"Foo"}, { label: "Bar"}],
                chartOptions: {
                    chart: {
                        height: 350,
                        zoom: {
                            enabled: true
                        }
                    },
                    dataLabels: {
                        enabled: true
                    },
                    stroke: {
                        curve: 'straight',
                        width: 1
                    },
                    title: {
                        // text: 'Product Trends by Month',
                        // align: 'left'
                    },
                    grid: {
                        // row: {
                        //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        //     opacity: 0.5
                        // },
                    },
                    xaxis: {
                        type: 'datetime',
                        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    }
                }
            }
        },
    })

    export default class Forecast extends Vue {
    }
</script>
