<template>
		<view class="wrap">
			<swiper class="swiper-box" :duration="'200'" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" @change="tabListSwitch">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<!-- <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"> -->
					<scroll-view scroll-y style="height: 100%;width: 100%;" :scroll-top="scrollTop" scroll-y="true" @scroll="scroll">
						<fb-item :item="item" :collected="collectIds.includes(item.ID)" v-for="item in tabContent[index]" :key="item.ID"></fb-item>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view class="u-tabs-box">
				<u-tabs-swiper :activeColor="platformColor.fore" ref="tabs" 
				:list="tabList" :current="current" @change="tabSwitch" 
				:bold="false" :barWidth="60" :barStyle="barStyle"></u-tabs-swiper>
			</view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-toast ref="uToast"></u-toast>
		<u-loading mode="circle" :show="loadingShow" color="#19a358" size="60" class="loading"></u-loading>
			<view  @click="goTop">
				<c-back-top :mode="backTop.mode" :scrollTop="backTop.scrollTop"
				:bottom="backTop.bottom" :right="backTop.right" :top="backTop.top"
				:icon-style="backTop.iconStyle" :customStyle="backTop.customStyle" 
				:icon="backTop.icon">
				</c-back-top>
			</view>
		</view>
</template>

<script>
	import fbItem from "@/components/freebuf/fb-item.vue"
	export default {
		data() {
			return {
				platform: "freebuf",
				collectIds: [],
				tabList: [],
				tabContent: [],
				tabContentCache: [],
				// collectIds: [],
				current: 0,
				swiperCurrent: 0,
				dx: 0,
				platformColor: {
					back: "#333333",
					fore: "#19a358"
				},
				loadingShow: false,
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
				activeBytab: false,
				barStyle: {
					marginBottom: "60rpx"
				}
			};
		},
		components: {	
			fbItem
		},
		created() {
			this.current = 0,
			this.swiperCurrent = 0
			this.getTabs()
			// this.getCollectIds()
		},
		methods: {
			async getTabs() {
				let self = this
				self.$surf.getTabs({
					platform: self.platform
				}).then(res => {
					self.tabList = res.data
					self.getTabContent(0)
					self = null
				})
			},
			async getTabContent(tabIndex) {
				if (this.tabContent[tabIndex]) return
				let self = this
				self.loadingShow = true
				self.$surf.getTabContent({
					name: self.tabList[tabIndex].name, 
					platform: self.platform,
				}).then(res => {
					if (res.data[0].content.length > 0) {
						self.$set(self.tabContent, tabIndex, res.data[0].content);
						// this.$set(this.tabContentCache, tabIndex, data[0].content);
						// console.log(self.tabContent)
					}else {
						self.getLatestTabContent(true, tabIndex)
					}
					self.loadingShow = false
					self = null
				})

			},
			async getLatestTabContent(firstView, tabIndex) {
				let self = this
				uni.showLoading({
					title: 'Conn FreeBuf...'
				})
				uni.request({
					url: self.tabList[tabIndex].link,
					method: 'GET',
					data: {},
					success: res => {
						if (res.data.code === 200) {
							let feedBack = res.data.data.list
							if (feedBack.length===0) return
							if ((!firstView) && (feedBack[0].ID === self.tabContent[tabIndex][0].ID)) {
								self.$refs.uToast.show({
									title: "Nothing new",
									position: "top",
									type: "default",
									duration: 2000
								});
								return
							}
							self.$refs.uToast.show({
								title: "New Data",
								position: "top",
								type: "default",
								duration: 2500,
								bgColor: self.platformColor.back,
								ttColor: self.platformColor.fore
							});
							self.$set(self.tabContent, tabIndex, feedBack);
							self.goTop()
							self.newTabContent(tabIndex)
						}else {
							self.$refs.uToast.show({
								title: "link changed",
								position: "top",
								type: "error",
								duration: 2500,
								bgColor: self.platformColor.back,
								ttColor: self.platformColor.fore
							})
						} 
					},
					fail: (e) => {
					},
					complete() {
						self = null
						uni.hideLoading()
					}
				});
			},
			async newTabContent(tabIndex) {
				this.$surf.newTabContent({_id: this.tabList[tabIndex]._id, platform: this.platform, tabContent: this.tabContent[tabIndex]})
			},
			tabSwitch(current) {
				// console.log("click tab")
				this.activeBytab = true
				this.swiperCurrent = current
				this.getTabContent(current);
			},
			tabListSwitch(e) {
				if (this.activeBytab) {
					this.activeBytab = false
					return
				}
				const {
					current
				} = e.detail
				this.getTabContent(current);
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx)
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current)
				this.swiperCurrent = current
				this.current = current
			},
			injectPs(target) {
				if (target === "new") {
					this.getLatestTabContent(false, this.current)
				}else if (target === "cids"){
					this.getCollectIds()
				}
			},
			async getCollectIds() {
				let self = this
				uni.getStorage({
				    key: 'freebuf-collect',
				    success: function (res) {
						self.collectIds = res.data
				    },
					fail() {
						self.$surf.getCollectIds({
							platform: "freebuf",
						}).then(res => {
							self.collectIds = res.data[0].collect_ids
						})
					}
				})
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
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}
	.wrap {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		
		.swiper-box {
			height: 100%;
			overflow: hidden;
			.swiper-item {
				// height: 100%;
			}
		}
	}
	
	.loading {
		position: fixed;
		left: 46%;
		top: 45%;
	}
</style>
