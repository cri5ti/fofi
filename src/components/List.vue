<template>
	<ul class="list">
		<li v-for="item in items">
			<Checkbox :label="item.label" :checked="item.enabled" :onClick="item.onToggle"/>
		</li>
	</ul>
</template>

<script lang="ts">
    import Checkbox from "@/components/Checkbox.vue";
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({
        components: {
            Checkbox
        }
    })
    export default class List extends Vue {
        @Prop() private items!: Array<{
            label: string,
	        enabled: boolean,
	        onToggle: ()=>void;
        }>;
    }
</script>


<style scoped lang="less">
	ul.list {
	}

	li {
	}
</style>
