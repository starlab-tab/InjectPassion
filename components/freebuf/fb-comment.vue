<template>
	<view class="comment">
		<view class="comment-header">
			<view class="info" >
				<view class="author">{{ comment.username }}</view>
				<view v-if="comment.username===author"  class="is_author">作者</view>
				<view class="level">LV.{{ comment.user_level }}</view>
				
			</view>
			<view class="date">{{ comment.date }}</view>
		</view>
		<view class="comment-content">
			<view @longpress="copyContent">{{ comment.content }}</view>
			<view class="comment-reply" v-for="(item,index) in comment.child" :key="index">
				<fb-comment :comment="item" :author="author"></fb-comment>
			</view>
		</view>
	</view>
</template>

<script>
	import fbComment from '@/components/freebuf/fb-comment.vue'
	export default {
		name: 'fb-comment',
		components: {
			fbComment
		},
		props: {
			comment: {
				type: Object,
				default () {
					return {}
				}
			},
			author: ""
		},
		data() {
			return {}
		},
		methods: {
			copyContent() {
				uni.setClipboardData({
					data:this.comment.content,
					success() {
						uni.showToast({
							title: 'Copyed',
							duration:1500,
							icon:"none"
						})
					}	
				})
			}
		}
	};
</script>

<style lang="scss">
	.comment {
		margin: 15px 0;

		.comment-header {
			display: flex;
			flex-direction: column;
			.logo {
				width: 30px;
				height: 30px;
				flex-shrink: 0;
				border-radius: 5px;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.date {
				font-size: 24rpx;
				padding-top: 10rpx;
				color: #c1c1c1;
			}

			.info {
				display: flex;
				flex-direction: row;
				font-size: 24rpx;
				color: #1da55b;
				line-height: 1.5;
				.author {
					color: #333;
				}
				.is_author {
					display: inline-block;
					width: 60rpx;
					height: 28rpx;
					line-height: 1;
					margin-left: 20rpx;
					margin-top: 4rpx;
					text-align: center;
					font-family: PingFangSC-Regular,PingFang SC;
					color: #de4949;
					border-radius: 4rpx;
					border: 2rpx solid #de4949;
				}
				.level {
					margin-left: 20rpx;
					font-weight: 500;
					font-size: 26rpx;
				}
			}
		}

		.comment-content {
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #5b5b5b;

			.comment-info {
				margin-top: 30rpx;
				display: flex;
			}

			.comment-reply {
				display: flex;
				margin: 30rpx 0;
				padding: 0 20rpx;
				border-top: 2rpx solid #eee;
				margin-left: 20rpx;
				
			}
		}
	}
</style>
