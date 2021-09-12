<template>
	<view class="attention">
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#cb2d01" :duration="'200'" ref="tabs" bgColor="rgba(255,255,255,0);" :list="tabList" :current="current"
			 @change="tabSwitch" :bold="false" :barWidth="60" :is-scroll="false"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
		 @change="tabListSwitch">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y="true" style="height: 100%;width: 100%;">
					<newsflash ref="newNfs" @popInfo="popInfo"></newsflash>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y="true" style="height: 100%;width: 100%;">
					<cve ref="newCves"></cve>
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-popup v-model="popShow" mode="center" border-radius="10" length="90%">
			<view class="pop">
				<view class="pop-top">
					<view class="header-info">
						7x24 快讯 · {{newsflash.bug_update | TS2Date}}
					</view>
				</view>
				<view class="pop-center">
					<view class="title" @longpress="copyContent(newsflash.bug_title)">
						<text>{{newsflash.bug_title}}</text>
					</view>
					<view class="desc" @longpress="copyContent(newsflash.bug_description)">
						<text>{{newsflash.bug_description}}</text>
					</view>
				</view>
				<view class="pop-bottom">
					<view class="share">
						<text>Share To: </text>
						<uni-icons type="weixin" size="17" color="#8c8c8c"></uni-icons>
						<uni-icons type="weibo" size="17" color="#8c8c8c"></uni-icons>
					</view>
					<view class="source">
						<view class="time">{{newsflash.bug_update_date}}</view>
						<view style="padding: 0 20rpx;"> | </view>
						<uni-icons type="paperclip" size="14" color="#8c8c8c"></uni-icons>
						<view class="origin" @click="copyContent(newsflash.bug_url)">{{newsflash.bug_from}}</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		TS2Date
	} from '@/utils/TS2Date.js'
	export default {
		data() {
			return {
				tabList: [{
					name: "NewsFlash"
				}, {
					name: "CVE"
				}],
				current: 0,
				swiperCurrent: 0,
				activeBytab: false,
				popShow: false,
				newsflash: {},
				tabClick: false
			}
		},
		filters: {
			TS2Date(ts) {
				if (ts)
					return TS2Date(ts * 1e3).substr(0, 10)
			}
		},
		onLoad() {
			this.current = 0,
			this.swiperCurrent = 0
		},
		methods: {
			tabSwitch(current) {
				this.activeBytab = true
				// console.log("click tab")
				if (this.current === current) {
					//单击tab刷新
				}
				this.swiperCurrent = current
			},
			tabListSwitch(e) {
				if (this.activeBytab) {
					this.activeBytab = false
					return
				}
				const {
					current
				} = e.detail
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
			popInfo(newsflash) {
				this.newsflash = newsflash
				this.popShow = true
			},
			onTabItemTap(e) {
				let self = this
				if (e.index === 2) {
					if (self.tabClick) {
						if (self.current === 0) {
							self.$refs.newNfs.newNfs()
						}else if(self.current === 1) {
							self.$refs.newCves.newCves()
						}
					}
					self.tabClick = true
					setTimeout(() => {
						self.tabClick = false
					}, 200)
				}
			},
			copyContent(content) {
				uni.setClipboardData({
					data: content,
					success() {
						uni.showToast({
							title: 'Copyed',
							icon: "none"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.attention {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding-bottom: 40rpx;
		overflow: hidden;
		.swiper-box {
			height: 100%;
			overflow: hidden;
		}

		.pop {
			display: flex;
			flex-direction: column;
			height: auto;

			.pop-top {
				display: flex;
				align-items: flex-end;
				padding: 60rpx 0 0 20rpx;
				background: #e8e8e8;

				.header-info {
					border-bottom: 4rpx solid #2db362;
					padding-bottom: 20rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, .5);
				}
			}

			.pop-center {
				// min-height: 20%;
				padding: 40rpx 20rpx 40rpx 20rpx;

				.title {
					font-size: 32rpx;
					font-weight: 600;
					color: rgba(0, 0, 0, .85);
					line-height: 1.5;
					word-break: break-word;
				}

				.desc {
					margin-top: 20rpx;
					font-size: 27rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, .65);
					line-height: 2;
					word-break: break-word;
				}

			}

			.pop-bottom {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx;
				color: #8c8c8c;
				font-size: 22rpx;

				.share {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					text {
						margin-right: 16rpx;
					}
				}

				.source {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					.origin {
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>
