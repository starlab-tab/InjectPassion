<template>
	<view>
		<web-view v-if="connectTheWorld" :src="connectTheWorld" ref="web"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				connectTheWorld: String
			}
		},
		methods: {
			
		},
		onLoad(receive) {
			if (!receive.connectTheWorld) {
				uni.showToast({
					duration: 2000,
					title: "getUrlErr",
					icon: "none"
				})
				return
			}
			console.log(receive.connectTheWorld)
			this.connectTheWorld = receive.connectTheWorld
		},
		mounted() {
			// if (this.connectTheWorld.match("anquanke")) {
			// 	setTimeout(function() {
			// 		console.log("try inject")
			// 		this.$refs.web.evalJs('document.querySelector("body > main > div > div > div.user-content > div > div.col.col-xs-0.col-sm-0col-md-0.col-lg-6").remove()')
			// 	}, 500)
			// }
		}
		
	}
</script>

<style>

</style>
