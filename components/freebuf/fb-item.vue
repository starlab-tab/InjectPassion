<template>
	<view class="fb-item">
		<view class="fb-item-img">
			<text v-if="item.category" class="tag">{{item.category}}</text>
			<image v-if="collected || item.mark" class="action" :src="markImg"></image>
			<u-lazy-load threshold="-300" duration="350" height="452" effect="ease-in" img-mode="aspectFill" :loading-img="lazyLoadImg"
			 :image="item.post_image" :is-effect="true"></u-lazy-load>
			<!-- <image :src="baseAvatar" mode="aspectFill"></image> -->

		</view>
		<view class="fb-item-content">
			<view class="fb-item-title">
				<text :class="{colortip: item.color_tip}" @click="passionActive">{{item.post_title}}</text>
			</view>
			<view class="fb-item-extra">

				<view class="fb-item-source" @click="tapAuthor">
					<uni-icons class="icons" type="personidea" size="20" color="#b8b8b8"></uni-icons>
					{{item.username}}
				</view>

				<view class="fb-item-post-time">
					<uni-icons class="icons" type="time" size="14" color="#b8b8b8"></uni-icons>
					{{item.post_date}}
				</view>
				<view v-if="item.is_original" class="original">原创</view>
				<view v-if="item.is_jb" class="original" style="margin-left: 70rpx;">金币</view>
			</view>
			<view class="fb-item-description">
				<text>{{item.content}}</text>
			</view>
			<view style="display: flex;flex-direction: row;">
				<view class="fb-item-look">
					已有 <text class="fb-item-look-count">{{item.read_count}}</text> 次围观
				</view>
				<view v-if="item.comment_count>0" class="fb-item-look" style="position: absolute; right: 0;">
					发现 <text class="fb-item-look-count">{{item.comment_count}}</text> 个不明物体
				</view>
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
				markImg: "/static/freebuf/mark.png",
				lazyLoadImg: "data:image/png;base64,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"
			};
		},
		methods: {
			passionActive(e) {
				let url = null
				if (this.item.mark) {
					// url = "/pages/freebuf/detail?freebuf=" + encodeURIComponent(JSON.stringify(this.item))
					url = "/pages/freebuf/detail?freebuf=" + encodeURIComponent(JSON.stringify(this.item).replace(/%/g, '%25'))
				}else {
					url = "/pages/freebuf/detail?freebuf="
					+ encodeURIComponent(JSON.stringify({
						ip_ID: this.item.ID,
						post_image: this.item.post_image,
						category: this.item.category,
						color_tip: this.item.color_tip,
						comment_count: this.item.comment_count,
						read_count: this.item.read_count,
						is_original: this.item.is_original,
						username: this.item.username,
						url: this.item.url
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
			async getAllComment() {
				const res = await uni.request({
					url: "https://api.freebuf.com/postComment/commentCount?id=243831",
					method: 'GET',
				})
				console.log(res)
			},
			tapAuthor() {
				// #ifdef APP-PLUS
					plus.runtime.openWeb(encodeURI("https://www.freebuf.com/author/" + this.item.username));
					return
				// #endif
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + encodeURI("https://www.freebuf.com/author/" + this.item.username)
				})
			},
			async markTrace() {
				let self = this
				//"/articles/database/242813.html"
				self.$surf.markTrace({
					trace: {
						ip_ID: this.item.ID || this.item.ip_ID,
						author: this.item.username,
						date: (new Date().getTime()),
						cover: this.item.post_image,
						title: this.item.post_title,
						from: "FreeBuf",
						url: "https://www.freebuf.com" + this.item.url
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

<style lang="scss" scoped>
	.fb-item {
		display: flex;
		padding: 20rpx;
		margin: 20rpx;
		border-bottom: solid 2rpx #f0f0f0;
		box-sizing: border-box;
		flex-direction: column;

		.fb-item-img {

			.tag {
				position: absolute;
				left: 50rpx;
				margin-top: 10rpx;
				line-height: 1;
				padding: 10rpx 20rpx;
				font-size: 24rpx;
				border-radius: 4rpx;
				z-index: 1;
				background-color: rgb(38, 38, 38);
				opacity: 0.7;
				border-color: transparent;
				color: #fff;
			}

			.action {
				position: absolute;
				right: 32rpx;
				z-index: 1;
				width: 60rpx;
				height: 60rpx;
				// transition: all .5s ease-in-out 1s;
			}
		}

		.fb-item-content {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			padding-left: 0;

			.fb-item-title {
				font-size: 32rpx;
				color: #333;
				line-height: 48rpx;
				padding-right: 60rpx;
				margin: 10px 0;
				font-weight: bold;

				.colortip {
					color: #f02424;
				}

				text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.fb-item-description {
				display: flex;
				padding-right: 60rpx;
				margin-top: 20rpx;
				align-items: center;
				font-weight: 400;
				line-height: 1.6;
				font-size: 24rpx;
				color: #666666;

				text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					color: #999;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.fb-item-look {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #999999;
				margin-top: 10rpx;
			}

			.fb-item-look-count {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #19a358;
				padding: 0 10rpx;
			}

			.fb-item-extra {
				display: flex;
				flex-direction: row;
				// justify-content: start;
				align-items: center;
				margin-top: 0rpx;

				.fb-item-source {
					display: contents;
					padding: 0 10rpx;
					margin-right: 2rpx;
					// border-radius: 30rpx;
					align-self: center;
					// border: 1px solid $theme-color;
					font-size: 26rpx;
					color: #19a358;
				}

				.fb-item-post-time {
					position: absolute;
					right: 0;
					margin-right: 2rpx;
					line-height: 1.5;
					align-self: center;
					color: #b8b8b8;
					font-size: 26rpx;
				}

				.icons {
					margin-right: 12rpx;
				}

				.original {
					display: flex;
					height: 36rpx;
					align-items: center;
					border-radius: 8rpx;
					padding: 0 6rpx;
					margin-left: 10rpx;
					color: #FFFFFF;
					background-color: rgb(45, 179, 98);
					;
					white-space: nowrap;
					border-color: transparent;
					position: absolute;
					right: 0rpx;
					top: 26rpx;
					align-self: center;
					font-size: 24rpx;
				}
			}
		}
		.loading {
			position: fixed;
			left: 45%;
			top: 10%;
		}
	}
</style>
