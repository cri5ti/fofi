<template>
	<div class="home">
		<div>{{rate}}</div>

		<chart type=line height=350 :options="chartOptions" :series="series" />

		<!--<HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
	</div>
</template>

<script lang="ts">
    import HelloWorld from '@/components/HelloWorld.vue';
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters, mapState} from "vuex";
    import VueApexCharts from 'vue-apexcharts';


    @Component({
        components: {
            HelloWorld,
            chart: VueApexCharts,
        },
        computed: {
            ...mapState({
                rate: state => state.mortgage_rate,
            }),
	       ...mapGetters({
               series: 'series'
	       })
        },
        data: function() {
            return {
	            // series: [{
	            //     name: "Desktops",
	            //     data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
	            // }],
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
