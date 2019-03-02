<template>
	<div class="home">
		<List :items="features" v-on:toggle="featureToggle"/>

		<chart type=line height=350 :options="chartOptions" :series="series"/>
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
                features: s => s.feats.map(i => ({
	                id: i.id,
	                label: i.name,
	                enabled: i.enabled !== false,
                }))
            }),
            ...mapGetters({
                series: 'series'
            })
        },
	    methods: {
            featureToggle: function (feat, enabled) {
                this.$store.dispatch("toggleFeature", { id: feat.id, enabled });
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
                    annotations: {
                        xaxis: [
	                        { x: Date.UTC(2019+5,0,1), label: { text: '4.5%' } }
                        ],
                        yaxis: [
	                        {
	                            y: 10000,
		                        label: {
	                                text: 'Safety'
                                }
	                        }
                        ]
                    },
                    chart: {
                        animations: {enabled: false},
                        height: 350,
                        zoom: {
                            enabled: true
                        },
	                    events: {
                            click: function(event, chartContext, config) {
                                debugger;
                            },
	                    },
	                    // toolbar: { show: false }
                    },
	                legend: { show: false },
                    dataLabels: {
                        // enabled: true,
                        // formatter: function (val, opts) {
                        //     return Math.round(val).toLocaleString();
                        // },
                    },
                    stroke: {
                        curve: 'straight',
                        width: 1
                    },
	                tooltip: {
                        y: { formatter: (val) => Math.round(val).toLocaleString() }
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
	                    labels: {
                            format: 'dd MMM \'yy'
                            // formatter: function(val, opts) {
                            //     return new Date(val).toLocaleDateString();
                            // }
	                    }
                        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    }
                }
            }
        },
    })

    export default class Forecast extends Vue {
    }
</script>
