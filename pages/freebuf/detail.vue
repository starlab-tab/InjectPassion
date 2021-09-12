<template>
	<view class="">
		<u-navbar title-color="#fff" :back-icon-color="platform.fore" :is-back="true" :background="{ background: platform.back }">
			<view class="nav-content">
				<image class="nav-logo" :src="detailLogo"></image>
<!-- 				<image v-if="collectIds.includes(freebuf.ip_ID)" class="nav-mark" src="../../static/mark-active.svg" @click="collectAction"></image>
				<image v-else class="nav-mark" src="../../static/mark.svg" @click="collectAction"></image> -->
			</view>
		</u-navbar>
		<view class="f-html">
			<view class="f-header">
				<view class="title">
					<text :class="{colortip: freebuf.color_tip}">{{freebuf.post_title}}</text>
				</view>
				<view class="info">
					<image v-if="freebuf.is_original" :src="original"></image>
					<view class="top-info">
						<view class="author">
							<text>{{freebuf.username}}</text>
						</view>
						<view class="date">
							<text>{{freebuf.post_date}}</text>
						</view>
					</view>
					<view class="bottom-info">
						<view class="look">
							已有 <text class="count">{{freebuf.read_count}}</text> 次围观
						</view>
						<view class="comment">
							发现 <text class="count">{{freebuf.comment_count}}</text> 个不明物体
						</view>
					</view>
				</view>
			</view>
			<view class="f-content">
				<u-parse :html="freebuf.post_content" :tag-style="article.style" :selectable="true"></u-parse>
			</view>
			<view class="f-tags">
				<view class="tag" v-for="(item,index) in freebuf.tag" :key="index" @click="tapTag(item.url)">
					<view class="content"><text class="slash">#</text>{{item.name}}</view>
				</view>
			</view>
			<view v-if="showComment" class="f-comment">
				<view class="comment-title">已有<view style="color: #ea6060; padding: 0 10rpx;">{{freebuf.comment_count}}</view>条评论</view>
				<view class="comment-content" v-for="(item,index) in comment.list" :key="index">
					<fb-comment :comment="item" :author="freebuf.username"></fb-comment>
				</view>
			</view>
			<view v-if="showGetCmtBtn" class="view-comment">
				<u-button @click="parseComment" :loading="btnLoading" :ripple="true" :shape="'circle'" :customStyle="getCmtBtnStyle">Get Comment</u-button>
			</view>
			<view v-if="comment.list.length>0&&(comment.page<=comment.totalPage)" class="more-cmt">
				<u-button @click="getMoreComment" :loading="btnLoading" :ripple="true" :shape="'square'" :customStyle="moreCmtBtnStyle">Get More</u-button>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
		<u-back-top :scrollTop="backTop.scrollTop" :mode="backTop.mode" :bottom="backTop.bottom" :right="backTop.right" :top="backTop.top"
		 :icon-style="backTop.iconStyle" :duration="backTop.duration" :customStyle="backTop.customStyle" :icon="backTop.icon">
		</u-back-top>
		<view class="extra" @click="showExtra">
			<uni-icons type="more" :color="platform.fore" size="25"></uni-icons>
		</view>
		<u-popup v-model="popShow" mode="bottom" border-radius="10" length="20%">
			<view class="pop">
				<view class="extra-action">
					<view class="extra-item" @click="copyContent('https://www.freebuf.com' + freebuf.url)">
						<uni-icons type="paperclip" size="30" :color="platform.fore"></uni-icons>
					</view>
					<view class="extra-item" @click="collectAction">
						<uni-icons v-if="collectIds.includes(freebuf.ip_ID)" type="star-filled" size="30" :color="platform.fore"></uni-icons>
						<uni-icons v-else type="star" size="30" :color="platform.fore"></uni-icons>
					</view>
					<view class="extra-item" @click="viewOrg">
						<uni-icons type="internet" size="30" :color="platform.fore"></uni-icons>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import fbComment from "@/components/freebuf/fb-comment.vue"
	export default {
		data() {
			return {
				detailLogo: "/static/freebuf/fb-b-logo.png",
				original: "/static/freebuf/origin.png",
				article: {
					style: {
						h1: "max-width: 100%; line-height: 22px; font-size: 18px; font-family: PingFangSC-Medium, PingFang SC; font-weight: 600; color: rgba(0, 0, 0, 0.85); padding-left: 15px; margin: 25px 0; position: relative;",
						h2: "font-size: 18px; font-weight: bold; color: #373838; margin: 30px 0px 15px 0px;", //border-left: solid 5px #1ea65c;
						h3: "font-size: 16px; font-weight: bold; color: #0070c0; margin: 20px 0px 15px 0px;",
						//a: "color: #19a358; overflow: hidden; text-overflow: ellipsis; display: -webkit-box;  -webkit-line-clamp: 1; -webkit-box-orient: vertical;text-decoration: none;",
						a: "color: #19a358;text-decoration: none;",
						p: "font-size: 15px; line-height: 26px; word-wrap: break-word; word-break: break-word; margin-top: 10px;color: #585858;",
						pre: "display: block; padding: 9.5px; margin: 0 0 15px; font-size: 13px; line-height: 1.42857143; color: #333; word-break: break-all; word-wrap: break-word; background-color: #F3F3F3; border: 1px solid #E4E4E4; border-radius: 4px;font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;",
						code: "font-size: 90%; word-break: break-word;font-family: inherit;padding: 0 5px;",
						div: "max-width: 100%; line-height: 26px; font-size: 16px; color: rgba(0, 0, 0, 0.65); overflow: auto; word-break: break-word;"

					}
				},
				freebuf: {},
				comment: {
					list: [],
					page: 1,
					total: 0
				},
				showComment: false,
				showGetCmtBtn: false,
				platform: {
					name: "freebuf",
					back: "#333333",
					fore: "#19a358"
				},
				backTop: {
					top: 2000,
					scrollTop: 0,
					mode: "circle",
					bottom: 100,
					right: 40,
					customStyle: {
						backgroundColor: "#333333",
						opacity: 0.5
					},
					icon: "arrow-up",
					iconStyle: {
						color: '#19a358',
						fontSize: '40rpx'
					},
					duration: 300
				},
				btnLoading: false,
				getCmtBtnStyle: {
					backgroundColor: "#333333",
					color: "#19a358"
				},
				moreCmtBtnStyle: {
					backgroundColor: "#2db362",
					color: "#FFFFFF"
				},
				collectIds: [],
				colActState: true,
				popShow: false

			}
		},
		components: {
			fbComment
		},
		onLoad(receive) {
			if (receive.freebuf) {
				// detail conver to base64 / get later / setStore
				this.freebuf = JSON.parse(decodeURIComponent(receive.freebuf))
				this.getCollectIds()
				if (!this.freebuf.mark) this.parseContent()
				if (this.freebuf.comment_count > 0) {
					this.showGetCmtBtn = true
					this.comment.totalPage = parseInt(this.freebuf.comment_count / 10) + this.freebuf.comment_count % 10
				}
			}
		},
		methods: {
			async parseContent() {
				let self = this
				uni.showLoading({
					title: "Surfing...",
					mask: true
				});
				uni.request({
					url: "https://www.freebuf.com/fapi/frontend/post/detail?id=" + self.freebuf.ip_ID,
					method: 'GET',
					success: res => {
						const feedBack = res.data
						if (feedBack.code === 200) {
							self.freebuf.post_title = feedBack.data.post_title
							self.freebuf.content = feedBack.data.post_desc
							self.freebuf.post_date = feedBack.data.post_date
							self.freebuf.post_content = feedBack.data.post_content
							self.freebuf.tag = feedBack.data.tag
							self.$forceUpdate()
						}else {
							uni.showToast({
								duration: 2000,
								title: "No Such Article",
								icon: "none"
							})
						}
					},
					fail: err => {
						console.log(err)
						uni.showToast({
							duration: 2000,
							title: "NetWork Blocked",
							icon: "none"
						})
						reject(err)
					},
					complete() {
						uni.hideLoading()
					}
				});
			},
			async parseComment() {
				let self = this
				self.btnLoading = true
				uni.request({
					url: "https://www.freebuf.com/fapi/frontend/post/comments?id=" + self.freebuf.ip_ID + "&order=2&page=" + self.comment.page,
					method: 'GET',
					success: res => {
						if (res.data.code === 200 && res.data.data.data_list.length > 0) {
							self.comment.list = res.data.data.data_list
						}
						else {
							uni.showToast({
								title: "No Comment",
								duration: 2000,
								icon: "none"
							})
						}
					},
					fail: res => {
						console.log(res)
						uni.showToast({
							title: "error in parCmt",
							duration: 2000,
							icon: "none"
						})
					},
					complete() {
						self.btnLoading = false
						self.showComment = true
						self.showGetCmtBtn = false
						self.comment.page++
					}
				})
			},
			async getMoreComment() {
				let self = this
				self.btnLoading = true
				if (self.comment.page > self.comment.totalPage) return
				uni.request({
					url: "https://www.freebuf.com/fapi/frontend/post/comments?id=" + self.freebuf.ip_ID + "&order=2&page=" + self.comment.page,
					method: 'GET',
					success: res => {
						if (res.data.code === 200 && res.data.data.data_list.length > 0) {
							self.comment.list.push(...res.data.data.data_list)
						}
						else {
							uni.showToast({
								title: "No More Comment",
								duration: 2000,
								icon: "none"
							})
						}
					},
					fail: res => {
						console.log(res)
						uni.showToast({
							title: "error in getMCmt",
							duration: 2000,
							icon: "none"
						})
					},
					complete() {
						self.btnLoading = false
						self.comment.page++
					}
				});
				
			},
			onPageScroll(e) {
				this.backTop.scrollTop = e.scrollTop
			},
			loadComment() {
				this.btnLoading = true
				
			},
			async collectAction() {
				if (!this.colActState) {
					uni.showToast({
						duration: 2000,
						title: "Not Ready, Try Later",
						icon: "none"
					})
					return
				}
				this.colActState = false
				uni.showLoading()
				if (this.collectIds.includes(this.freebuf.ip_ID)) {
					this.removeCollect()
				} else {
					this.addCollect()
				}
			},
			async addCollect() {
				let self = this
				if (!self.freebuf.post_content) {
					uni.showToast({
						duration: 2000,
						title: "No Content, Try Later",
						icon: "none"
					})
					self.colActState = true
					return
				}
				self.freebuf.mark = self.platform.name
				self.freebuf.collect_date = new Date().getTime()
				self.$surf.tapCollect({
					article_id: self.freebuf.ip_ID,
					platform: self.platform.name,
					collect: self.freebuf
				}).then(res => {
					self.collectIds[self.collectIds.length] = self.freebuf.ip_ID
					self.newCollectIds()
					self.colActState = true
					self.collectTip(res.code, "Collected")
					self = null
				}).catch(res => {
					console.log(res)
					self.collectTip(500, "Collect Fail")
				})
			},
			async removeCollect() {
				let self = this
				self.$surf.tapCollect({
					article_id: self.freebuf.ip_ID,
					platform: self.platform.name,
					collect: {}
				}).then(res => {
					self.collectIds.splice(item => item === self.freebuf.ip_ID, 1)
					self.newCollectIds()
					self.collectTip(res.code, "UnCollect")
					self.colActState = true
					self = null
				}).catch(res => {
					console.log(res)
					self.collectTip(500, "Uncollect Fail")
				})
			},
			async getCollectIds() {
				let self = this
				uni.getStorage({
					key: 'freebuf-collect',
					success: (res) => {
						self.collectIds = res.data
						self.colActState = true
					},
					fail: (res) => {
						self.colActState = false
						self.$surf.getCollectIds({
							platform: "freebuf",
						}).then(res => {
							self.collectIds = res.data[0].collect_ids
							self.colActState = true
						}).catch(res => {
							console.log(res)
							uni.showToast({
								duration: 2000,
								title: "detail getIds fail",
								icon: "none"
							})
						})
					}
				})
			},
			newCollectIds() {
				let self = this
				uni.setStorage({
					key: 'freebuf-collect',
					data: self.collectIds,
					fail() {
						uni.showToast({
							duration: 2000,
							title: "newC fail set fb-collect"
						})
					}
				});
			},
			collectTip(code, tip) {
				uni.hideLoading()
				if (code === 200) {
					this.$forceUpdate()
					this.$refs.uToast.show({
						title: tip,
						position: "center",
						type: "success",
						duration: 2500
					});
				} else {
					this.$refs.uToast.show({
						title: tip,
						position: "center",
						type: "error",
						duration: 2500
					});
				}
				this.popShow = false
			},
			copyContent(content) {
				uni.setClipboardData({
					data: content,
					success() {
						uni.showToast({
							title: 'Copyed',
							icon: "none"
						})
					},
					fail() {
						uni.showToast({
							title: 'Copy failed',
							duration: 1500,
							icon: "none"
						})
					}
				})
			},
			viewOrg() {
				// #ifdef APP-PLUS
					plus.runtime.openWeb(encodeURI("https://www.freebuf.com" + this.freebuf.url));
					return
				// #endif
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + encodeURI("https://www.freebuf.com" + this.freebuf.url)
				})
			},
			tapTag(url) {
				// #ifdef APP-PLUS
					plus.runtime.openWeb(encodeURI(url));
					return
				// #endif
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + encodeURI(url)
				})
			},
			showExtra() {
				this.popShow = true
			},
			showTips(tip) {
				uni.showToast({
					duration: 2000,
					icon: "none",
					title: tip
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		.nav-logo {
			width: 218rpx;
			height: 58rpx;
			margin-left: 30rpx;
		}

		.nav-mark {
			width: 60rpx;
			height: 60rpx;
			margin-right: 30rpx;
		}
	}

	.f-html {
		max-width: 100%;
		font-size: 24rpx;
		padding: 20rpx;
		font-family: "微软雅黑";
		// background: url(https://image.3001.net/images/new/bg.jpg) repeat-x;

		.f-header {
			display: flex;
			flex-direction: column;

			.title {
				min-height: 150rpx;
				border-bottom: 2rpx solid #eaeaea;
				padding: 20rpx;
				// margin-bottom: 10rpx;
				padding-bottom: 40rpx;

				text {
					height: 100rpx;
					font-size: 42rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 550;
					color: rgba(0, 0, 0, .85);
					line-height: 1.5;
					position: relative;
				}

				.colortip {
					color: #f02424;
				}
			}

			.info {
				display: flex;
				flex-direction: column;
				padding: 20rpx;
				color: rgba(0, 0, 0, .4);
				font-size: 24rpx;

				image {
					display: inline-block;
					width: 240rpx;
					height: 240rpx;
					position: absolute;
					// margin-top: 50rpx;
					top: 250rpx;
					right: 10rpx;
					z-index: 2;
				}

				.top-info {
					display: flex;
					flex-direction: row;
					margin-bottom: 20rpx;

					.author {
						color: #2db362;
					}

					.date {
						margin-left: 20rpx;
						color: rgba(0, 0, 0, .4);
					}
				}

				.bottom-info {
					display: flex;
					flex-direction: row;

					.look {}

					.comment {
						margin-left: 20rpx;
					}

					.count {
						padding-left: 10rpx;
						padding-right: 10rpx;
						color: #2db362;
					}
				}
			}
		}

		.f-content {
			min-height: 1200rpx;
			box-sizing: border-box;
			border-radius: 8rpx;
			border: 2rpx solid transparent;
			// box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
			padding: 20rpx 10rpx 20rpx 10rpx;
			background-color: #fff;
			// margin-top: 40rpx;
			// background: url(https://image.3001.net/images/new/bg.jpg) repeat-x;
			border-bottom: 2rpx solid #eaeaea;
		}

		.f-tags {
			margin: 40rpx 0 0 10rpx;

			.tag {
				display: inline-block;
				height: 60rpx;
				padding-left: 60rpx;
				margin: 0rpx 20rpx 40rpx 0;
				background-image: url(data:image/png;base64,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);
				background-repeat: no-repeat;
				background-position: 0 0;
				background-size: contain;

				.content {
					display: inline-block;
					height: 60rpx;
					border: 2rpx solid #02bd6e;
					border-radius: 0 10rpx 10rpx 0;
					border-left: none;
					font-weight: 600;
					padding-right: 16rpx;
					background: #f1fff9;
					color: #02bd6e;
					font-size: 26rpx;
					margin-left: -10px;
					line-height: 2;
				}

				.slash {
					margin: 0 10rpx 0 4rpx;
				}
			}
		}


		.f-comment {
			margin-top: 50rpx;

			.comment-title {
				font-size: 40rpx;
				font-weight: bold;
				height: 80rpx;
				border-bottom: solid 2rpx #1ea65c;
				display: flex;
			}

			.comment-content {
				padding: 0 30rpx;
				border-top: 2rpx solid #eee;
			}
		}

		.view-comment {
			display: flex;
			margin: 40rpx 0;
			justify-content: center;
		}
		
		.more-cmt{
			// padding: 0 40rpx;
			// border-radius: 10rpx;
			// background: #2db362;
			// height: 64rpx;
			display: flex;
			justify-content: center;
			margin: 40rpx 0;
		}
	}
	
	.extra {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 80rpx;
		height: 80rpx;
		right: 40rpx;
		bottom: 200rpx;
		border-radius: 50%;
		background-color: #333333;
		opacity: 0.5
	}
	
	
	.pop {
		height: 100%;
		.extra-action {
			display: flex;
			flex-direction: row;
			padding: 40rpx;
			justify-content: space-between;
			align-items: center;
			height: 100%;
			
			.extra-item {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #555555;
			}
		}
	}
</style>
