<template>
	<view class="trace-item" @longpress="traceAction" @click.stop="tapTrace">
		<view class="top-info">
			<view class="author">
				<view class="from">{{item.from}} :</view>
				<view class="name">{{item.author}}</view>
			</view>
			<view class="date">
				<text>{{item.date | TS2Date}}</text>
			</view>
		</view>
		<view class="bottom-info">
			<view class="cover">
				<u-lazy-load :image="item.cover" threshold="-100" duration="350" height="144" effect="ease-in" img-mode="aspectFill"
				 :loading-img="lazyLoadImg" :is-effect="true" border-radius="10"></u-lazy-load>
			</view>
			<view class="title">
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {TS2Date} from '@/utils/TS2Date.js'
	const self = this
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			index: {
				type: Number,
				default () {
					return -1
				}
			},
		},
		data() {
			return {
				baseAvatar: 'https://img.cdn.aliyun.dcloud.net.cn/stream/icon/__UNI__HelloUniApp.png',
				lazyLoadImg: "data:image/png;base64,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",
				uModal: {
					show: false,
					content: "Confirm Del ?",
					contentStyle: {
						fontSsize: "27rpx",
						padding: "40rpx"
					},
					cancleStyle: {
						fontSsize: "30rpx",
					},
					confirmStyle: {
						fontSsize: "30rpx",
						color: "#eb6438",
						height: "90rpx"
					},
					width: 430
				}
			};
		},
		filters: {
		  TS2Date(ts) {
		    return TS2Date(ts)
		  }
		},
		methods: {
			traceAction() {
				this.$emit("traceAction", this.index)
			},
			tapTrace() {
				if (this.item.url) {
					// #ifdef APP-PLUS
						plus.runtime.openWeb(this.item.url);
						return
					// #endif
					uni.navigateTo({
						url: "/pages/world/world?connectTheWorld=" + this.item.url
					})
				}
			}
		},

	};
</script>

<style lang="scss">
	.trace-item {
		display: flex;
		margin-top: 26rpx;
		padding: 16rpx 30rpx 16rpx 30rpx;
		width: 100%;
		background: #FFFFFF;
		border-radius: 10rpx;
		flex-direction: column;
		
		
		.top-info {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			border-bottom: solid 2rpx #f5f5f5;
			padding-bottom: 20rpx;
			align-items: center;
			.author {
				color: #8c8c8c;
				.from {
					display: inline-block;
					padding-right: 10rpx;
				}
				
				.name {
					display: inline-block;
					font-size: 25rpx;
				}
				
			}
			
			.date {
				display: inline-block;
				
				text {
					color: #8c8c8c;
					font-size: 26rpx;
				}
			}
			
		}
		
		.bottom-info {
			display: flex;
			flex-direction: row;
			margin-top: 20rpx;
			height: 160rpx;
			
			.cover {
				// height: 144rpx;
				width: 220rpx;
				align-self: center;
			}
			.title {
				max-width: 68%;
				padding-left: 10rpx;
				
				text {
					max-height: 150rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					font-size: 34rpx;
					word-break: break-word;
					line-height: 1.5;
				}
			}
		}
		
		.gap {
			background-color: #999999;
			width: 100%;
			height: 30rpx;
			padding: 0 20rpx 0 20rpx;
			margin: 20rpx 0 0 0;
		}
		
	}
</style>
