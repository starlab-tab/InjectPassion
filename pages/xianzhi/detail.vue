<template>
	<view class="">
		<u-navbar title-color="#fff" :back-icon-color="platform.fore" :is-back="true" :background="{ background: platform.back }">
			<view class="nav-content">
				<image class="nav-logo" :src="detailLogo"></image>
			</view>
		</u-navbar>
		<view class="xz-html">
			<view v-show="xianzhi.post_content" class="xz-content">
				<u-parse :html="xianzhi.post_content" :tag-style="article.style" :selectable="true"></u-parse>
			</view>
			<u-toast ref="uToast"></u-toast>
			<u-back-top :scrollTop="backTop.scrollTop" :mode="backTop.mode"
			:bottom="backTop.bottom" :right="backTop.right" :top="backTop.top"
			:icon-style="backTop.iconStyle" :duration="backTop.duration"
			:customStyle="backTop.customStyle" :icon="backTop.icon">
			</u-back-top>
			<view class="extra" @click="showExtra">
				<uni-icons type="more" :color="platform.fore" size="25"></uni-icons>
			</view>
			<u-popup v-model="popShow" mode="bottom" border-radius="10" length="20%">
				<view class="pop">
					<view class="extra-action">
						<view class="extra-item" @click="copyLink">
							<uni-icons type="paperclip" size="30" :color="platform.fore"></uni-icons>
						</view>
						<view class="extra-item" @click="collectAction">
							<uni-icons v-if="collectIds.includes(xianzhi.ip_ID)" type="star-filled" size="30" :color="platform.fore"></uni-icons>
							<uni-icons v-else type="star" size="30" :color="platform.fore"></uni-icons>
						</view>
						<view class="extra-item" @click="viewOrg">
							<uni-icons type="internet" size="30" :color="platform.fore"></uni-icons>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				detailLogo: "/static/xianzhi/xz-logo.png",
				article: {
					content: ``,
					style: {
						h1: "max-width: 100%; line-height: 22px; font-size: 18px; font-family: PingFangSC-Medium, PingFang SC; font-weight: 600; color: rgba(0, 0, 0, 0.85); padding-left: 15px; margin: 25px 0; position: relative;",
						h2: "font-size: 18px; font-weight: bold; color: #373838; margin: 30px 0px 15px 0px;", //border-left: solid 5px #1ea65c;
						h3: "font-size: 16px; font-weight: bold; color: #0070c0; margin: 20px 0px 15px 0px;",
						a: "color: #4183c4;text-decoration: none;",
						p: "font-size: 15px; line-height: 26px; word-wrap: break-word; word-break: break-word; margin-top: 10px;color: #585858;",
						pre: "display: block; padding: 9.5px; margin: 0 0 15px; font-size: 13px; line-height: 1.42857143; color: #c4a000; word-break: break-all; word-wrap: break-word; background-color: #F3F3F3; border: 1px solid #E4E4E4; border-radius: 4px;font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;",
						code: "font-size: 85%; color: #d14; word-break: break-word;font-family: inherit;background-color: #f7f7f9;padding-top: 0.2em; padding-bottom: 0.2em;",
						strong: "font-weight: bold;color:#333"
					},
				},
				xianzhi: {},
				commentList: [],
				showComment: false,
				platform: {
					name: "xianzhi",
					back: "#ebebeb",
					fore: "#373D41"
				},
				backTop: {
					top: 2000,
					scrollTop: 0,
					mode: "circle",
					bottom: 100,
					right: 40,
					customStyle: {
						backgroundColor: "#ebebeb",
						opacity: 0.5
					},
					icon: "arrow-up",
					iconStyle: {
						color: '#373D41',
						fontSize: '40rpx'
					},
					duration: 300
				},
				btnLoading: false,
				btnStyle: {
					backgroundColor: "#ebebeb",
					color: "#373D41"
				},
				collectIds: [],
				colActState: true,
				popShow: false
			}
		},
		onLoad(receive) {
			if (receive.xianzhi) {
				this.xianzhi = JSON.parse(decodeURIComponent(receive.xianzhi))
				this.getCollectIds()
				if (!this.xianzhi.mark) this.parseContent()
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
					url: self.xianzhi.url,
					method: 'GET',
					success: res => {
						if (res.statusCode === 404) {
							this.errMsg("No Such Article")
							return
						}
						let feedBack = res.data
						let a_c = feedBack.match(/<div\sid="topic_content"[\s\S]*?>[\s\S]*<div\s*class="post-user-action">/)
						if (!a_c) {
							self.errMsg("Detail No Match")
							return
						}
						let user_info = feedBack.match(/<div\s*class="clearfix\s*user-info\s*topic-list">([\s\S]*?)<hr>/)
						if (!user_info) {
							self.errMsg("UserInfo No Match")
							return
						}
						//user_info add style
						user_info = user_info[0].replace(/class="content-title\s*"/, 'class="content-title" style="font-size: 24px; color: #333; text-decoration: none; line-height: 24px; text-shadow: 0 1px 0 #fff;"')
						user_info = user_info.replace(/<span\s*class="label/g, '<span style="margin-bottom: 10px; margin-top: 10px;margin-left: 2px;background-color: #f4f4f4; line-height: 12px; display: inline-block; padding: 4px 4px 4px 4px; border-radius: 2px; font-size: 10px; color: #555555;" class="label')
						user_info = user_info.replace(/<span\s*class="pull-right\s*t-vote\s*cell\s*info-right">[\s\S]*?<\/span>/, '')
						user_info = user_info.replace(/<span\s*class="content-node">/, '<span class="content-node"><br>')
						user_info = user_info.replace(/<div\s*class="topic-info">/, '<div class="topic-info" style="margin-top:10px">')
						self.xianzhi.post_content = user_info + a_c[0]
						this.$forceUpdate()
					},
					fail: (e) => {
						self.errMsg("Network Blocked")
					},
					complete() {
						uni.hideLoading()
					}
				});
			},
			onPageScroll(e) {
				this.backTop.scrollTop = e.scrollTop;
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
				if (this.collectIds.includes(this.xianzhi.ip_ID)) {
					this.removeCollect()
				} else {
					this.addCollect()
				}
			},
			async addCollect() {
				let self = this
				if (!self.xianzhi.post_content) {
					uni.showToast({
						duration: 2000,
						title: "No Content, Try Later",
						icon: "none"
					})
					self.colActState = true
					return
				}
				self.xianzhi.mark = self.platform.name
				self.xianzhi.collect_date = new Date().getTime()
				self.$surf.tapCollect({
					article_id: self.xianzhi.ip_ID,
					platform: self.platform.name,
					collect: self.xianzhi
				}).then(res => {
					self.collectIds[self.collectIds.length] = self.xianzhi.ip_ID
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
					article_id: self.xianzhi.ip_ID,
					platform: self.platform.name,
					collect: {}
				}).then(res => {
					self.collectIds.splice(item => item === self.xianzhi.ip_ID, 1)
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
					key: self.platform.name + '-collect',
					success: function(res) {
						self.collectIds = res.data
						self.colActState = true
					},
					fail() {
						self.colActState = false
						self.$surf.getCollectIds({
							platform: self.platform.name,
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
				});
			},
			newCollectIds() {
				let self = this
				uni.setStorage({
					key: self.platform.name + '-collect',
					data: self.collectIds,
					fail() {
						uni.showToast({
							duration: 2000,
							title: "newC fail set xz-collect"
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
			copyLink() {
				uni.setClipboardData({
					data:"https://xz.aliyun.com/t/" + this.xianzhi.ip_ID,
					success() {
						uni.showToast({
							title: 'Copyed',
							duration:1500,
							icon:"none"
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
					plus.runtime.openWeb("https://xz.aliyun.com/t/" + this.xianzhi.ip_ID);
					return
				// #endif
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + "https://xz.aliyun.com/t/" + this.xianzhi.ip_ID
				})
			},
			showExtra() {
				this.popShow = true
			},
			errMsg(msg) {
				uni.showToast({
					duration: 2000,
					icon: "none",
					title: msg
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
			width: 360rpx;
			height: 60rpx;
			margin-left: 30rpx;
		}
	
		.nav-mark {
			width: 60rpx;
			height: 60rpx;
			margin-right: 30rpx;
		}
	}
	
	.xz-html {
		max-width: 100%;
		font-size: 24rpx;
		padding: 20rpx;
		font-family: "微软雅黑";
		background: url(https://image.3001.net/images/new/bg.jpg) repeat-x;

		.xz-content {
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid transparent;
			box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
			padding: 10px 15px;
			background-color: #fff;
		}

		.xz-comment {
			margin-top: 30px;

			.comment-title {
				font-size: 20px;
				font-weight: bold;
				margin: 0px;
				height: 40px;
				border-bottom: solid 2px #1ea65c;
				display: flex;
			}

			.comment-content {
				padding: 0 15px;
				border-top: 1px solid #eee;
			}
		}
		
		.view-comment {
			display: flex;
			margin-top: 50rpx;
			margin-bottom: 20rpx;
			
			.btn {
				background-color: #008f8b;
				color: #FFFFFF
			}
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
		background-color: #ebebeb;
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
				background-color: #ebebeb;
			}
		}
	}
</style>
