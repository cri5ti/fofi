<template>
	<label>
		<input type="checkbox" :checked="checked" v-on:click="toggle"/>
		<span>{{ label }}</span>
	</label>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component()
    export default class Checkbox extends Vue {
        @Prop() private label: string;
        @Prop() private checked: boolean;
        @Prop() private onClick: (checked)=>void;

        toggle() {
            this.$emit('toggle', !this.checked);
        }
    }
</script>

<style scoped lang="less">
</style>
