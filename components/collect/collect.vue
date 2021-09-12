<template>
	<view>
		<fb-item v-if="item.mark==='freebuf'" :item="item" :key="item.ID"></fb-item>
		<aqk-item v-if="item.mark==='anquanke'" :item="item" :key="item.ID"></aqk-item>
		<xz-item v-if="item.mark==='xianzhi'" :item="item" :key="item.ID"></xz-item>
	</view>
</template>

<script>
	import fbItem from "@/components/freebuf/fb-item.vue"
	import aqkItem from "@/components/anquanke/aqk-item.vue"
	import xzItem from "@/components/xianzhi/xz-item.vue"
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
			};
		},
		components: {
			fbItem,
			aqkItem,
			xzItem
			
		},
		methods: {

		}
	}
</script>

<style>

</style>
