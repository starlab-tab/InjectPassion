<template>
	<view v-if="item" class="xz-item">
		<view class="top-info">
			<view class="avatar">
				<!-- <image :src="item.cover" mode="aspectFill"></image> -->
				<u-lazy-load :image="item.cover || baseAvatar" threshold="-100" duration="350" height="80" effect="ease-in" img-mode="aspectFill"
				 :loading-img="lazyLoadImg" :is-effect="true"></u-lazy-load>
			</view>
			<view class="title">
				<text @click="passionActive">{{item.title}}</text>
			</view>
			<image v-if="collected || item.mark" class="action" :src="markImg"></image>
		</view>
		<view class="bottom-info">
			<view class="source" @click="tapAuthor">
				<text>{{item.author.name}}</text>	
				<view class="xz-slash">/</view>
			</view>
			<!-- <view class="tag" @click="tapTag"> -->
			<view class="tag">
				<text>{{item.tag.name}}</text>
				<view class="xz-slash">/</view>
			</view>
			<view class="post-time">
				<text>{{item.date}}</text>
			</view>
			<view class="comment-count">
				<text>{{item.comment_count}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			collected: {
				type: Boolean,
				default () {
					return false
				}
			}
		},
		data() {
			return {
				baseAvatar: "/static/xianzhi/default-avatar.jpg",
				markImg: "/static/xianzhi/mark.png",
				lazyLoadImg: "data:image/png;base64,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"
			};
		},
		methods: {
			passionActive() {
				let url = null
				if (this.item.mark) {
					// url = "/pages/xianzhi/detail?xianzhi=" + encodeURIComponent(JSON.stringify(this.item))
					url = "/pages/xianzhi/detail?xianzhi=" + encodeURIComponent(JSON.stringify(this.item).replace(/%/g, '%25'))
				}else {
					url = '/pages/xianzhi/detail?xianzhi='
					+ encodeURIComponent(JSON.stringify({
						ip_ID: this.item.id,
						title: this.item.title,
						cover: this.item.cover,
						date: this.item.date,
						tag: this.item.tag,
						comment_count: this.item.comment_count,
						author: this.item.author,
						url: "https://xz.aliyun.com/t/" + this.item.id
					}))
				}
				let self = this
				uni.navigateTo({
					url: url,
					complete() {
						self.markTrace()
						self = null
					}
				})
			},
			tapAuthor() {
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + "https://xz.aliyun.com/u/" + this.item.author.id
				})
			},
			async markTrace() {
				let self = this
				self.$surf.markTrace({
					trace: {
						ip_ID: this.item.id || this.item.ip_ID,
						author: this.item.author.name,
						date: (new Date().getTime()),
						cover: this.item.cover || this.base64Avatar,
						title: this.item.title,
						from: "XianZhi",
						url: "https://xz.aliyun.com/t/" + this.item.id
					}
				}).then(res => {
					console.log(res.msg)
				}).catch(res => {
					console.log(res)
					console.log("mark fail")
				})
			}
		},

	};
</script>

<style lang="scss">
	.xz-item {
		display: flex;
		padding: 16rpx 30rpx 16rpx 30rpx;
		height: 150rpx;
		width: 100%;
		border-bottom: solid 2rpx #ddd;
		box-sizing: border-box;
		flex-direction: column;
		
		.top-info {
			display: flex;
			flex-direction: row;
			// align-items: center;
			.avatar {
				// height: 88rpx;
				min-width: 88rpx;
				width: 88rpx;
				height: 88rpx;
				box-sizing: border-box;
				border: #999 2rpx solid;
				border-radius: 8rpx;
				padding: 2rpx;
				display: inline-block;
				text-align: center;
				vertical-align: middle;
				background: #fff;

			}
			
			.title {
				font-size: 32rpx;
				color: #555;
				margin: 0;
				text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					padding-left: 20rpx;
					padding-right: 40rpx;
					word-break: break-all;
					line-height: 46rpx;
				}
			}
			
			.action {
				position: absolute;
				right: 8rpx;
				width: 46rpx;
				height: 46rpx;
				z-index: 1;
			}

		}

		.bottom-info {
			display: flex;
			flex-direction: row;
			font-size: 24rpx;
			align-items: center;
			margin-top: 5rpx;
			.xz-slash {
				margin: 0 10rpx;
			}
			.source {
				display: flex;
				flex-direction: row;
				color: #555555;
			}
		
			.tag {
				display: flex;
				flex-direction: row;
				color: #555555;
			}
		
			.post-time {
				color: #b8b8b8;
				right: 0;
			}
		
			.comment-count {
				position: absolute;
				right: 20rpx;
				text {
					color: #555555;
					font-size: 20rpx;
				}
			}
		}
		// }
	}
</style>
