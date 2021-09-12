<template>
	<view style="margin-top: 40rpx;padding-bottom: 20rpx;">
		<timeline>
			<view v-for="(item,index) in newsFlashs" :key="item.id">
				<timelineItem :leftTime="item.bug_update | formatMsgTime" :index="index" @popInfo="popInfo">
					<view class="tripItem">
						<view class="title">{{item.bug_title}}</view>
						<view class="tips">From：{{item.bug_from}}</view>
					</view>
				</timelineItem>
			</view>
		</timeline>
		<u-loadmore :status="uloadmore.status" :loadText="uloadmore.loadText" :is-dot="uloadmore.isDot" @loadmore="loadMore"
		 :icon-color="uloadmore.iconColor" margin-top="20" />
		<u-popup v-model="popShow" mode="center" border-radius="10" length="90%">
			<view class="pop">
				<view class="pop-top">
					<view class="header-info">
						7x24 快讯 · {{(newsFlashs[popIndex] ? newsFlashs[popIndex].bug_update : null) | TS2Date}}
					</view>
				</view>
				<view class="pop-center">
					<view class="title" @longpress="copyTitle">
						<text>{{newsFlashs[popIndex] ? newsFlashs[popIndex].bug_title : ""}}</text>
					</view>
					<view class="desc" @longpress="copyDesc">
						<text>{{newsFlashs[popIndex] ? newsFlashs[popIndex].bug_description : ""}}</text>
					</view>
				</view>
				<view class="pop-bottom">
					<view class="share">
						<text>Share To: </text>
						<uni-icons type="weixin" size="17" color="#8c8c8c"></uni-icons>
						<uni-icons type="weibo" size="17" color="#8c8c8c"></uni-icons>
					</view>
					<view class="source">
						<view class="time">{{newsFlashs[popIndex] ? newsFlashs[popIndex].bug_update_date : ""}}</view>
						<view style="padding: 0 20rpx;"> | </view>
						<uni-icons type="paperclip" size="14" color="#8c8c8c"></uni-icons>
						<view class="origin" @click="copyUrl">{{newsFlashs[popIndex] ? newsFlashs[popIndex].bug_from : ""}}</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import timeline from '@/components/timeline/timeline.vue'
	import timelineItem from '@/components/timeline/timelineItem.vue'
	import {
		TS2Date
	} from '@/utils/TS2Date.js'
	export default {
		components: {
			timeline,
			timelineItem
		},
		data() {
			return {
				newsFlashs: [],
				tabClick: false,
				uloadmore: {
					status: 'loading',
					iconType: 'flower',
					iconColor: '#2db362',
					isDot: true,
					loadText: {
						loadmore: 'click to get more',
						loading: 'loading...',
						nomore: 'no more'
					}
				},
				currentPage: 1,
				maxPage: 5,
				popShow: false,
				popIndex: 0
			};
		},
		created() {
			// this.getLatestNewsFlashs()
		},
		filters: {
			TS2Date(ts) {
				if (ts) 
					return TS2Date(ts * 1e3).substr(0, 10)
			},
			formatMsgTime(ts) {
				if (null === ts)
					return "";
				var e = 1e3 * ts,
					t = (new Date).getTime(),
					a = Math.floor((t - e) / 1e3),
					n = Math.floor(a / 60),
					u = Math.floor(n / 60),
					r = Math.floor(u / 24),
					o = Math.floor(r / 31),
					j = Math.floor(o / 12);
				if (j > 0)
					return j + "年前";
				if (o > 0)
					return o + "月前";
				if (r > 0) {
					var f = r + "天前";
					return r >= 7 && r < 14 ? f = "1周前" : r >= 14 && r < 21 ? f = "2周前" : r >= 21 && r < 28 ? f = "3周前" : r >= 28 && r <
						31 && (f = "4周前"),
						f
				}
				return u > 0 ? u + "小时前" : n > 0 ? n + "分钟前" : a > 0 ? a + "秒前" : "刚刚"
			}
		},
		methods: {
			async getLatestNewsFlashs() {
				let self = this
				uni.request({
					url: "https://www.freebuf.com/fapi/frontend/home/clipped?page=1&limit=20",
					method: "GET",
					success: res => {
						// console.log(res)
						if (res.data.code === 200) {
							if (res.data.data.length === 0) {
								self.showMsg("No More")
								self.uloadmore.status = "nomore"
								return
							}
							if ((self.newsFlashs[0] && res.data.data[0]) &&
								(self.newsFlashs[0].id === res.data.data[0].id)) {
								return
							}
							this.newsFlashs = res.data.data
							setTimeout(function() {
								self.uloadmore.status = "loadmore"
								self = null
							}, 500)
						} else {
							self.showMsg("Url Error")
						}
					},
					fail: res => {
						console.log(res)
						self.showMsg("NetWork Blocked")
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			onTabItemTap(e) {
				let self = this
				if (e.index === 2) {
					if (self.tabClick) {
						uni.showLoading()
						this.getLatestNewsFlashs()
					}
					self.tabClick = true
					setTimeout(() => {
						self.tabClick = false
					}, 200)
				}
			},
			async getMoreNewsFlashs() {
				let self = this
				self.uloadmore.status = "loading"
				console.log(self.currentPage)
				uni.request({
					url: "https://www.freebuf.com/fapi/frontend/home/clipped?page=" + (self.currentPage + 1) + "&limit=20",
					method: 'GET',
					data: {},
					success: res => {
						if (res.data.code === 200) {
							if (res.data.data.length === 0) {
								self.showMsg("No More")
								self.uloadmore.status = "nomore"
								return
							}
							this.newsFlashs.push(...res.data.data)
							setTimeout(function() {
								if (++self.currentPage >= self.maxPage) {
									self.uloadmore.status = "nomore"
								} else {
									self.uloadmore.status = "loadmore"
								}
								self = null
							}, 500)
						} else {
							self.uloadmore.status = "nomore"
							self.showMsg("Url Error")
						}
					},
					fail: res => {
						self.uloadmore.status = "loadmore"
						self.showMsg("Network Blocked")
					}
				})
			},
			loadMore() {
				if (this.currentPage >= this.maxPage || this.uloadmore.status === "loading") return
				this.getMoreNewsFlashs()
			},
			showMsg(msg) {
				uni.showToast({
					duration: 2000,
					title: msg,
					icon: "none"
				})
			},
			popInfo(popIndex) {
				this.popIndex = popIndex
				this.popShow = true
			},
			copyUrl() {
				uni.setClipboardData({
					data: this.newsFlashs[this.popIndex].bug_url,
					success() {
						uni.showToast({
							title: 'Copyed',
							icon: "none"
						})
					}
				})
			},
			copyTitle() {
				uni.setClipboardData({
					data: this.newsFlashs[this.popIndex].bug_title,
					success() {
						uni.showToast({
							title: 'Copyed',
							icon: "none"
						})
					}
				})
			},
			copyDesc() {
				uni.setClipboardData({
					data: this.newsFlashs[this.popIndex].bug_description,
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

<style lang="scss" scoped>
	.tripItem {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 200rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
		border-radius: 10px;
		margin-bottom: 30rpx;

		.title {
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #595959;
		}

		.tips {
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-top: 20rpx;

		}
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
</style>
