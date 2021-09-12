<template>
		<view class="wrap">
			<swiper class="swiper-box" :duration="'200'" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" @change="tabListSwitch">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<!-- <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"> -->
					<scroll-view scroll-y style="height: 100%;width: 100%;" :scroll-top="scrollTop" scroll-y="true" @scroll="scroll">
						<aqk-item :item="item" :collected="collectIds.includes(item.id)" v-for="item in tabContent[index]" :key="item.id"></aqk-item>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view class="u-tabs-box">
				<u-tabs-swiper :activeColor="platformColor.back" ref="tabs" 
				:list="tabList" :current="current" @change="tabSwitch" 
				:bold="false" :barWidth="60" :barStyle="barStyle"></u-tabs-swiper>
			</view>
			<u-toast ref="uToast"></u-toast>
			<u-loading mode="circle" :show="loadingShow" :color="platformColor.back" size="60" class="loading" ></u-loading>
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
	import aqkItem from "@/components/anquanke/aqk-item.vue"
	export default {
		data() {
			return {
				platform: "anquanke",
				collectIds: [],
				tabList: [],
				tabContent: [],
				current: 0,
				swiperCurrent: 0,
				dx: 0,
				platformColor: {
					back: "#008f8b",
					fore: "#ffffff"
				},
				loadingShow: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				backTop: {
					top: 600,
					scrollTop: 0,
					mode: "circle",
					bottom: 200,
					right: 30,
					customStyle: {
						backgroundColor: "#008f8b"
					},
					icon: "arrow-up",
					iconStyle: {
						color: '#ffffff',
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
			aqkItem
		},
		created() {
			this.current = 0,
			this.swiperCurrent = 0
			this.getTabs()
		},
		methods: {
			async getTabs() {
				this.loadingShow = true
				const {
					data
				} = await this.$surf.getTabs({
					platform: this.platform
				})
				if (data) {
					this.tabList = data
					this.getTabContent(0)
					// console.log(data)
				}
				this.loadingShow = false
			},
			async getTabContent(tabIndex) {
				if (this.tabContent[tabIndex]) return
				this.loadingShow = true
				const {
					data
				} = await this.$surf.getTabContent({name: this.tabList[tabIndex].name, platform: this.platform})
				this.loadingShow = false
				if (data[0].content.length > 0) {
					// console.log(data[0].content)
					this.$set(this.tabContent, tabIndex, data[0].content);
				}else {
					this.getLatestTabContent(true, tabIndex)
				}	
			},
			async getLatestTabContent(firstView, tabIndex) {
				let self = this
				uni.showLoading({
					title: 'Conn Aqk...'
				})
				uni.request({
					url: self.tabList[tabIndex].link,
					method: 'GET',
					data: {},
					success: res => {
						if (res.data.data) {
							let feedBack = res.data.data
							if (feedBack.length===0) return
							if ((!firstView) && (feedBack[0].id === self.tabContent[tabIndex][0].id)) {
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
				// console.log("tabList switch")
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
				    key: 'anquanke-collect',
				    success: function (res) {
						self.collectIds = res.data
				    },
					fail() {
						self.$surf.getCollectIds({
							platform: "anquanke",
						}).then(res => {
							self.collectIds = res.data[0].collect_ids
						})
					}
				});
			
			},
			scroll (e) {
				// console.log(e)
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
				height: 100%;
			}
		}
	}


	.loading {
		position: fixed;
		left: 45%;
		top: 45%;
	}
</style>
