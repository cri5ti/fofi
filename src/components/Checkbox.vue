<template>
	<label>
		<input type="checkbox" :checked="checked" v-on:click="toggle"/>
		<span>{{ label }}</span>
	</label>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({
	    methods: {
            toggle: function(ev) {
	            this.onClick(!this.checked);
            }
	    }
    })
    export default class Checkbox extends Vue {
        @Prop() private label: string;
        @Prop() private checked: boolean;
        @Prop() private onClick: (checked)=>void;
    }
</script>

<style scoped lang="less">
</style>
