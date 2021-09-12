<template>
	<view class="station">
		<navbar :pickerList="pickerList" @pickerSwitch="pickerSwitch" 
		:pfNavStyle="pfNavStyle"></navbar>
		<view class="station-platform">
			<freebuf v-if="platform==='freebuf'" ref="injectPs" class="platform-item"></freebuf>
			<anquanke v-if="platform==='anquanke'" ref="injectPs" class="platform-item"></anquanke>
			<xianzhi v-if="platform==='xianzhi'" ref="injectPs" class="platform-item"></xianzhi>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				platform: "freebuf",
				pickerList: [],
				tabClick: false,
				pfNavStyle: {
					navTitleColor: "#19a358",
					navBgColor: "#333333",
					logoWidth: 228,
					logoHeight: 50
				},
				collectIds: [],
				firstShow: true,
			}
		},
		onLoad() {
			this.getPlatforms()
			this.initCollectIds()
			// uni.clearStorage();
		},
		onShow() {
			if (!this.firstShow) this.injectPs("cids")
		},
		onTabItemTap(e) {
			let self = this
			if (e.index===0) {
				if (self.tabClick) { 
					self.injectPs("new")
				}
				self.tabClick = true
				setTimeout(() => {
					self.tabClick = false 
				}, 200)
			}
		},
		methods: {
			async getPlatforms() {
				let self = this
				self.$surf.getPlatforms().then(res => {
					self.pickerList = res.data
					self = null
				})
			},
			async initCollectIds() {
				let self = this
				self.$surf.getCollectIds({platform: "all"}).then(res => {
					self.storeCollectIds(res.data)
				})
			},
			async injectPs(target) {
				this.$refs.injectPs.injectPs(target)
			},
			async storeCollectIds (platforms) {
				for (var i = 0, len = platforms.length; i != len; ++i) {
					uni.setStorage({
					    key: platforms[i].platform + '-collect',
					    data: platforms[i].collect_ids,
						fail() {
							uni.showToast({
								duration: 2000,
								title: "retry set collect"
							})
						}
					})
				}
				this.injectPs("cids")
				this.firstShow = false
			},
			pickerSwitch(val) {
				switch (val) {
					case "freebuf": {
						if (this.platform === "freebuf") return
						this.pfNavStyle.navBgColor = "#333333"
						this.pfNavStyle.navTitleColor = "#19a358"
						this.pfNavStyle.logoHeight = 50
						break;
					}
					case "anquanke": {
						if (this.platform === "anquanke") return
						this.pfNavStyle.navBgColor = "#008f8b"
						this.pfNavStyle.navTitleColor = "#ffffff"
						this.pfNavStyle.logoHeight = 70
						break;
					}
					case "xianzhi": {
						if (this.platform === "xianzhi") return
						this.pfNavStyle.navBgColor = "#ebebeb"
						this.pfNavStyle.navTitleColor = "#373D41"
						this.pfNavStyle.logoHeight = 50
						break;
					}
				}
				this.platform = val
				let self = this
				setTimeout(function() {
					self.injectPs("cids")
				}, 1000)
			}
		}
	};
</script>

<style lang="scss">
		page {
			height: 100%;
			display: flex;
		}
	
		.station {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
	
			.station-platform {
				flex: 1;
				height: 100%;
				overflow: hidden;
				.platform-item {
					height: 100%;
				}
			}
		}

</style>
