<template>
	<view class="aqk-item">
		<view class="top-info">
			<view class="title" @click="passionActive">{{item.title}}</view>
			<image v-if="collected || item.mark" class="action" :src="markImg"></image>
		</view>
		<view class="mid-info">
			<view class="desc">{{item.desc}}</view>
			<view class="cover">
				<u-lazy-load :image="item.cover" threshold="-100" duration="350" height="160" effect="ease-in" img-mode="aspectFill"
				 :loading-img="lazyLoadImg" :is-effect="true" border-radius="12">
				 </u-lazy-load>
			</view>

		</view>
		<view class="bottom-info">
			<view class="author">
				<uni-icons class="icons" type="personidea" size="20" color="#b8b8b8"></uni-icons>
				<view class="name" :class="{verify: item.author.user_label==='verify', official: item.author.user_label==='official'}"
				 @click="tapAuthor">
					{{item.author.nickname}}
				</view>
				<image v-if="item.author.user_label==='verify'" src="https://p0.ssl.qhimg.com/sdm/45_45_100/t01d1216d1bce6e01cc.png"></image>
				<image v-else-if="item.author.user_label==='official'" src="https://p0.ssl.qhimg.com/sdm/45_45_100/t0122a13a311ae4f7aa.png"></image>
			</view>
			<view class="date">{{item.date}}</view>
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
				markImg: "/static/anquanke/mark.png",
				lazyLoadImg: "data:image/png;base64,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"
			};
		},
		methods: {
			passionActive() {
				let url = null
				if (this.item.category_slug === "week") {
					uni.navigateTo({
						url: '/pages/anquanke/360week?id=' +
							this.item.id +
							'&title=' + this.item.title
					})
				} else {
					if (this.item.mark) {
							url = "/pages/anquanke/detail?anquanke=" + encodeURIComponent(JSON.stringify(this.item).replace(/%/g, '%25'))
					}else {
						url = "/pages/anquanke/detail?anquanke="
						+ encodeURIComponent(JSON.stringify({
								ip_ID: this.item.id,
								title: this.item.title,
								cover: this.item.cover,
								desc: this.item.desc,
								date: this.item.date,
								category_name: this.item.category_name,
								comment: this.item.comment,
								tags: this.item.tags,
								type: this.item.type,
								author: {
									id: this.item.author.id,
									nickname: this.item.author.nickname,
									user_label: this.item.author.user_label
								}
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
				}
			},
			tapAuthor() {
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + "https://www.anquanke.com/member/" + this.item.author.id
				})
			},
			async markTrace() {
				let self = this
				self.$surf.markTrace({
					trace: {
						ip_ID: this.item.id || this.item.ip_ID,
						author: this.item.author.nickname,
						date: (new Date().getTime()),
						cover: this.item.cover,
						title: this.item.title,
						from: "AnQuanKe",
						url: "https://www.anquanke.com/post/id/" + this.item.id
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
	.aqk-item {
		// color: #fff;
		display: flex;
		flex-direction: column;
		margin: 20rpx;
		border-bottom: solid 2rpx #f0f0f0;

		.top-info {
			// color: #fff;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.title {
				display: block;
				padding: 0 40rpx 0 20rpx;
				font-size: 32rpx;
				font-weight: 600;
			}
			
			.action {
				position: absolute;
				right: 16rpx;
				width: 50rpx;
				height: 50rpx;
				z-index: 1;
				margin-top: 6rpx;
			}

		}

		.mid-info {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 20rpx;
			align-items: center;
			.desc {
				padding: 0 20rpx 0 20rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;
				color: #999999;
				font-size: 25rpx;
				line-height: 1.7;
				word-break: break-word;
				width: 68%;
			}

			.cover {
				width: 230rpx;
				height: 160rpx;
				
				.tag {
					position: absolute;
					right: 28rpx;
					margin-top: 10rpx;
					line-height: 1;
					padding: 4rpx 10rpx;
					font-size: 23rpx;
					border-radius: 4rpx;
					z-index: 1;
					background-color: rgb(38, 38, 38);
					opacity: 0.7;
					border-color: transparent;
					color: #fff;
				}
			}
		}

		.bottom-info {
			display: flex;
			flex-direction: row;
			margin: 20rpx 0 20rpx 0;
			font-size: 24rpx;
			color: #999999;
			justify-content: space-between;
			align-items: flex-end;
			.author {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				.icons {
					margin-left: 20rpx;
				}

				.name {
					margin-left: 16rpx;
					
					&.verify {
						color: #CC6633 !important;
					}
					&.official {
						color: #993333 !important;
					}
				}

				image {
					width: 26rpx;
					height: 26rpx;
					margin-left: 10rpx;
					margin-bottom: 2rpx;
				}
			}

			.date {
			}
		}
	}
</style>
