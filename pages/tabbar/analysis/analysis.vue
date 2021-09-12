<template>
	<view class="als">
		<view class="progress">
			<u-line-progress :percent="progress" :show-percent="false" 
			 :inactive-color="'#e1e1e1'" 
			:striped="true" :striped-active="true"></u-line-progress>
		</view>
		<scroll-view scroll-y  style="height: 100%;width: 100%;overflow: hidden;">
			<fb-als ref="fbAction" @alsAction="alsAction" @pgSync="pgSync"></fb-als>
			<aqk-als ref="aqlAction" @alsAction="alsAction" @pgSync="pgSync"></aqk-als>
			<xz-als ref="xzAction" @alsAction="alsAction" @pgSync="pgSync"></xz-als>
		</scroll-view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import fbAls from "@/components/freebuf/fb-als.vue"
	import aqkAls from "@/components/anquanke/aqk-als.vue"
	import xzAls from "@/components/xianzhi/xz-als.vue"
	export default {
		data() {
			return {
				fbBullet: "",
				aqkBullet: "",
				xzBullet: "",
				progress: 0,
				extraMg: 20
			}
		},
		components: {
			fbAls,
			aqkAls,
			xzAls
		},
		methods: {
			getCollectIds(key) {
				let self = this
				self.$surf.getCollectIds({
					platform: key,
				}).then(res => {
					self.collectIds = res.data[0].collect_ids
					self.colActState = true
				})
			},
			pgSync(value) {
				this.progress += value
			},
			alsAction(msg) {
				if (msg === "reset" || msg === "done") {
					this.progress = 0
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		display: flex;
	}

	.als {
		display: flex;
		flex-direction: column;
		width: 100%;
		.progress {
			display: inline-block;
			vertical-align: middle;
			margin: 30rpx 20rpx;
			// height: 100rpx;
		}
	}
</style>
