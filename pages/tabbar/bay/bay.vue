<template>
	<view class="bay">
		<view class="bay-header">
			<view class="header-background">
				<image src="https://img.3dmgame.com/uploads/images/thumbpicfirst/20190907/1567849346_299825.png" mode="aspectFill"></image>
			</view>
			<view class="header-logo">
				<view class="header-logo-box">
					<image src="https://img.3dmgame.com/uploads/allimg/170617/316-1F61G51A4.jpg" mode="aspectFill"></image>
				</view>
				<text class="bay-name">STAR_LAB</text>
			</view>
		</view>
		<view class="bay-content">
			<view class="bay-content-list" @click="tapTrace">
				<view class="bay-content-title">
					<uni-icons class="icons" type="time" size="16" color="#666"></uni-icons>
					<text class="text-grey">最近浏览</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="bay-content-list">
				<view class="bay-content-title">
					<uni-icons class="icons" type="feedback" size="16" color="#666"></uni-icons>
					<text class="text-grey">意见反馈</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="bay-content-list">
				<view class="bay-content-title">
					<uni-icons class="icons" type="hand-thumbsup" size="16" color="#666"></uni-icons>
					<text class="text-grey">打赏支持</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="bay-content-list">
				<view class="bay-content-title">
					<uni-icons class="icons" type="github" size="16" color="#666"></uni-icons>
					<text class="text-grey">Github</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="bay-content-list">
				<view class="bay-content-title">
					<uni-icons class="icons" type="about" size="16" color="#666"></uni-icons>
					<text class="text-grey">关于</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
			}
		},
		computed: {},
		methods: {
			tapTrace() {
				uni.navigateTo({
					url: "/pages/trace/trace"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F5F5;
	}
	.bay-header {
		position: relative;
		padding-bottom: 30rpx;

		.header-background {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			opacity: 0.3;
			filter: blur(4rpx);

			image {
				width: 100%;
				height: 100%;
			}
		}
		.header-logo {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 60rpx;
			.header-logo-box {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}
			.bay-name {
				margin-top: 30rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.bay-desc {
			display: flex;
			.desc-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				flex: 1;
				font-size: 23rpx;
				color: #999;
				.desc-title {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
	.bay-data {
		padding: 30rpx;
		display: flex;
		text-align: center;
		color: $theme-text-color;
		margin-top: 10rpx;
		background-color: #ffffff;
		.bay-data-summary {
			display: flex;
			flex: 1;
			flex-direction: column;
			position: relative;
			.font-get {
				font-size: 44rpx;
				color: #39b54a;		
			}
			.font-create {
				font-size: 44rpx;
				color: #0081ff;
			}
			.font-label {
				font-size: 44rpx;	
				color: #F0AD4E
			}
			.data-block {
				margin-top: 20rpx;
				::after {
					border-right: 1rpx solid rgba(0, 0, 0, 0.1);
				}
			}
		}
	}
	.bay-content {
		margin-top: 10rpx;
		.bay-content-list {
			display: flex;
			justify-content: space-between;
			padding: 30rpx;
			background-color: #FFFFFF;
			color: #333;
			font-size: 28rpx;
			.bay-content-title {
				display: flex;
				align-items: center;
				.icons {
					margin-right: 10rpx;
				}
				.text-grey {
					color: $theme-text-color;
					font-size: 26rpx;
					
				}
			}
		}
	}
</style>
