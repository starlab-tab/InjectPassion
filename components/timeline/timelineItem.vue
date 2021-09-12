<template>
	<view class="timelineItem">
		<view class="timeItem">
			<view class="leftTime">
				{{leftTime}}
			</view>
			<view class="line">
				<view class="out" :style="{background: color == '' ? '' : color}">
					<view class="inner" :style="{background: color == '' ? '' : color}"></view>
				</view>
			</view>
			<view class="rightContent" @click="popInfo">
				<slot></slot>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			leftTime: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			}
		},
		methods: {
			popInfo() {
				this.$emit("popInfo", this.index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.timelineItem {
		.timeItem {
			display: flex;

			.leftTime {
				width: 100rpx;
				// padding: 0 10rpx;
				font-size: 22rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin-right: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #8c8c8c;
				text-align: center;
			}

			.line {
				width: 1px;
				background: rgba(204, 204, 204, 1);
				position: relative;
				margin-left: 10rpx;

				.out {
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					justify-content: center;
					align-items: center;
					width: 22rpx;
					height: 22rpx;
					background: #2db362;
					border-radius: 50%;

					.inner {
						width: 12rpx;
						height: 12rpx;
						background: #FFFFFF;
						border-radius: 50%;
					}
				}
			}

			.rightContent {
				flex: 1;
				padding: 0 10rpx 40rpx;
				margin-left: 20rpx;
				min-height: 50rpx;
			}
		}
	}
</style>
