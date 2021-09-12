<template>
	<view class="collect">
		<view class="collect-list">
			<scroll-view scroll-y style="height: 100%;width: 100%;" :scroll-top="scrollTop" scroll-y="true" @scroll="scroll" @scrolltolower="loadMore">
				<collect :item="item" v-for="item in collectList" :key="item._id"></collect>
				<u-loadmore :status="uloadmore.status" :loadText="uloadmore.loadText"
				:icon-type="uloadmore.iconType" :is-dot="uloadmore.isDot" @loadmore="loadMore" margin-top="20"/>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectList: [],
				tabClick: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				backTop: {
					top: 2000,
					scrollTop: 0,
					mode: "circle",
					bottom: 200,
					right: 40,
					customStyle: {
						backgroundColor: "#333333"
				
					},
					icon: "arrow-up",
					iconStyle: {
						color: '#19a358',
						fontSize: '40rpx'
					},
					duration: 300
				},
				uloadmore: {
					status: 'loading',
					iconType: 'flower',
					isDot: true,
					loadText: {
						loadmore: 'click / slide',
						loading: 'loading...',
						nomore: 'no more'
					}
				},
				page: 2,
				limit: 12,
				extraMg: 20
			}
		},
		onLoad() {
			this.getLatestCollects()
			let self = this
			uni.getStorage({
				key: 'freebuf-collect',
				fail() {
					self.$surf.getCollectIds({platform: "all"}).then(res => {
						self.storeCollectIds(res.data)
					})
					self = null
				}
			})
		},
		methods: {
			adjustNav() {
				const info = uni.getSystemInfoSync()
				this.extraMg = info.statusBarHeight
				// #ifndef H5 || APP-PLUS || MP-ALIPAY
				//微信胶囊位置
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
				this.extraMg =this.extraMg + (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight) + 4
				// #endif
			},
			async getLatestCollects() {
				let self = this
				self.$surf.getCollects({
					page: 1,
					limit: self.limit
				}).then(res => {
					uni.hideLoading()
					if ((self.collectList[0] && res.data[0]) && (self.collectList[0].ip_ID === res.data[0].ip_ID)) return
					self.collectList = res.data
					setTimeout(function() {
						if (res.data.length === 0) {
							self.uloadmore.status = "nomore"
						}else {
							self.uloadmore.status = "loadmore"
						}
					}, 500)
				}).catch(err => {
					uni.showToast({
						duration: 2000,
						title: "Error In Collects ",
						icon: "none"
					})
				})
			},
			async getMoreCollects() {
				let self = this
				self.uloadmore.status = "loading" 
				self.$surf.getCollects({
					page: self.page,
					limit: self.limit
				}).then(res => {
					self.page++
					self.collectList.push(...res.data)
					setTimeout(function() {
						if (res.data.length === 0) {
							self.page--
							self.uloadmore.status = "nomore"
						}else {
							self.uloadmore.status = "loadmore"
						}
					}, 500)
				}).catch(err => {
					uni.showToast({
						duration: 2000,
						title: "Error In Collects ",
						icon: "none"
					})
				})
			},
			async initCollectIds() {
				let self = this
				self.$surf.getCollectIds({platform: "all"}).then(res => {
					self.storeCollectIds(res.data)
				})
			},
			async storeCollectIds (platforms) {
				for (var i = 0, len = platforms.length; i != len; ++i) {
					uni.setStorage({
					    key: platforms[i].platform + '-collect',
					    data: platforms[i].collect_ids,
						fail() {
							uni.showToast({
								duration: 2000,
								title: "retry set collect",
								icon: "none"
							})
						}
					});
				}
			},
			onTabItemTap(e) {
				let self = this
				if (e.index===1) {
					if (self.tabClick) {
						uni.showLoading()
						self.getLatestCollects()
					}
					self.tabClick = true
					setTimeout(() => {
						self.tabClick = false 
					}, 200)
				}
			},
			scroll (e) {
				// console.log(e.detail.scrollTop)
				this.old.scrollTop = e.detail.scrollTop
				this.backTop.scrollTop =  e.detail.scrollTop
			},
			goTop() {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			loadMore() {
				if (this.uloadmore.status === "loading" || this.uloadmore.status === "nomore") return
				this.getMoreCollects()
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.collect {
		box-sizing: border-box;
		flex-direction: column;
		display: flex;
		flex: 1;

		.collect-list {
			height: 100%;
			overflow: hidden;
		}
		
		.tip {
			position: absolute;
			top: 30%;
			left: 43.5%;
			color: #d1d1d1;
		}

	}
</style>
