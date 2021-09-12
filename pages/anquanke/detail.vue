<template>
	<view class="">
		<u-navbar title-color="#fff" :back-icon-color="platform.fore" :is-back="true" :background="{ background: platform.back }">
			<view class="nav-content">
				<image class="nav-logo" :src="detailLogo"></image>
			</view>
		</u-navbar>
		<view v-show="anquanke.post_content" class="aqk-html">
			<view class="aqk-content">
				<u-parse :html="anquanke.post_content" :tag-style="article.style" :selectable="true"></u-parse>
			</view>
		</view>
		<u-back-top :scrollTop="backTop.scrollTop" :mode="backTop.mode" :bottom="backTop.bottom" :right="backTop.right" :top="backTop.top"
		 :icon-style="backTop.iconStyle" :duration="backTop.duration" :customStyle="backTop.customStyle" :icon="backTop.icon">
		</u-back-top>
		<u-toast ref="uToast"></u-toast>
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
						<uni-icons v-if="collectIds.includes(anquanke.ip_ID)" type="star-filled" size="30" :color="platform.fore"></uni-icons>
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
	export default {
		data() {
			return {
				detailLogo: "/static/anquanke/aqk-logo.png",
				article: {
					content: ``,
					style: {
						h1: "max-width: 100%; line-height: 22px; font-size: 18px; font-family: PingFangSC-Medium, PingFang SC; font-weight: 600; color: rgba(0, 0, 0, 0.85); padding-left: 15px; margin: 25px 0; position: relative;",
						h2: "font-size: 18px; font-weight: bold; color: #373838; margin: 30px 0px 15px 0px;", //border-left: solid 5px #1ea65c;
						h3: "font-size: 16px; font-weight: bold; color: #0070c0; margin: 20px 0px 15px 0px;",
						a: "color: #008f8b;text-decoration: none;",
						p: "font-size: 15px; line-height: 26px; word-wrap: break-word; word-break: break-word; margin-top: 10px;color: #585858;",
						pre: "display: block; padding: 9.5px; margin: 0 0 15px; font-size: 13px; line-height: 1.42857143; color: #333; word-break: break-all; word-wrap: break-word; background-color: #F3F3F3; border: 1px solid #E4E4E4; border-radius: 4px;font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;",
						code: "font-size: 90%; color: #008f8b; word-break: break-word;font-family: inherit;"

					},
				},
				anquanke: {},
				commentList: [],
				showComment: false,
				platform: {
					name: "anquanke",
					back: "#008f8b",
					fore: "#ffffff"
				},
				backTop: {
					top: 2000,
					scrollTop: 0,
					mode: "circle",
					bottom: 100,
					right: 40,
					customStyle: {
						backgroundColor: "#008f8b",
						opacity: 0.5
					},
					icon: "arrow-up",
					iconStyle: {
						color: '#ffffff',
						fontSize: '40rpx'
					},
					duration: 300
				},
				btnLoading: false,
				btnStyle: {
					backgroundColor: "#008f8b",
					color: "#ffffff"
				},
				collectIds: [],
				colActState: true,
				popShow: false
			}
		},
		onLoad(receive) {
			if (receive.anquanke) {
				//由于decodeURI转码时，通过%进行解析，如果字符串中存在%(如： ‘0.9%氯化钠注射液’)，则会出现URI malformed
				this.anquanke = JSON.parse(decodeURIComponent(receive.anquanke))
				this.getCollectIds()
				if (!this.anquanke.mark) this.parseContent()
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
					url: "https://www.anquanke.com/post/id/" + self.anquanke.ip_ID,
					method: 'GET',
					success: res => {
						if (res.statusCode === 500) {
							self.showMsg("No Such Article")
							return
						}
						let a_c = res.data.match(/<div\s*class=".*article-detail"([\s\S]*?)>([\s\S]*)<\/div>\s*<section\s*.*?>/)
						if (!a_c) {
							self.showMsg("Deatil No Match")
							return
						}
						a_c = a_c[0].replace(/<div\s*class="bdsharebuttonbox".*\s*.*?>([\s\S]*?)<\/div>/g, "")
						a_c = a_c.replace(/<button([\s\S]*?)>([\s\S]*?)<\/button>/g, "")
						a_c = a_c.replace(/<section\s*class="article-footer-label">([\s\S]*?)<\/section>/, "")
						a_c = a_c.replace(/<section([\s\S].*?)class="hide-in-mobile-device"([\s\S]*?)>([\s\S]*?)<\/section>/g, "")
						a_c = a_c.replace(/<section([\s\S].*?)class="hide-in-mobile-device">/, "")
						a_c = a_c.replace(/data-original/g, "src")
						a_c = a_c.replace(/<div\s*class="hide-in-mobile-device"([\s\S]*?)>([\s\S]*?)<\/div>/, "")
						a_c = a_c.replace(/class="article-tag-primary"/g,'style="display: inline-block; height: 26px; line-height: 24px; padding: 0 15px; border: 1px solid #1dada7; color: #1dada7; border-radius: 15px;text-decoration: none !impotant;"')
						a_c = a_c.replace(/style="margin-top:20px;border-radius: 0;border: none"/,'style="margin-top: 20px; position: relative; padding: .75rem 1.25rem; margin-bottom: 1rem;color: #856404; background-color: #fff3cd;"')
						a_c = a_c.replace(/style="color:rgb\(255, 103, 0\) !important; "/,'style="color:rgb(255, 103, 0) !important;display: contents;"')
						a_c = a_c.replace(/h5 class="alert-heading"/, 'h5 class="alert-heading" style="font-size:18px"')
						// a_c = a_c.replace(//, '')
						// a_c = a_c.replace(//, '')
						self.anquanke.post_content = a_c
						self.$forceUpdate()
					},
					fail: (e) => {
						console.log(e)
						self.showMsg("Network Blocked")
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
				if (this.collectIds.includes(this.anquanke.ip_ID)) {
					this.removeCollect()
				} else {
					this.addCollect()
				}
			},
			async addCollect() {
				let self = this
				if (!self.anquanke.post_content) {
					uni.showToast({
						duration: 2000,
						title: "No Content, Try Later",
						icon: "none"
					})
					self.colActState = true
					return
				}
				self.anquanke.mark = self.platform.name
				self.anquanke.collect_date = new Date().getTime()
				self.$surf.tapCollect({
					article_id: self.anquanke.ip_ID,
					platform: self.platform.name,
					collect: self.anquanke
				}).then(res => {
					self.collectIds[self.collectIds.length] = self.anquanke.ip_ID
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
					article_id: self.anquanke.ip_ID,
					platform: self.platform.name,
					collect: {}
				}).then(res => {
					self.collectIds.splice(item => item === self.anquanke.ip_ID, 1)
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
					key: 'anquanke-collect',
					success: function(res) {
						self.collectIds = res.data
						self.colActState = true
					},
					fail() {
						self.colActState = false
						self.$surf.getCollectIds({
							platform: "anquanke",
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
					key: 'anquanke-collect',
					data: self.collectIds,
					fail() {
						uni.showToast({
							duration: 2000,
							title: "newC fail set aqk-collect"
						})
					}
				});
				console.log(self.collectIds)
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
					data:"https://www.anquanke.com/post/id/" + this.anquanke.ip_ID,
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
					plus.runtime.openWeb("https://www.anquanke.com/post/id/" + this.anquanke.ip_ID);
					return
				// #endif
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + "https://www.anquanke.com/post/id/" + this.anquanke.ip_ID
				})
			},
			showExtra() {
				this.popShow = true
			},
			showMsg(msg) {
				uni.showToast({
					duration: 2000,
					icon: "none",
					title: msg
				})
				uni.hideLoading()
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
			height: 70rpx;
			margin-left: 30rpx;
		}

		.nav-mark {
			width: 60rpx;
			height: 60rpx;
			margin-right: 30rpx;
		}
	}

	.aqk-html {
		max-width: 100%;
		font-size: 24rpx;
		padding: 20rpx;
		font-family: "微软雅黑";
		background: url(https://image.3001.net/images/new/bg.jpg) repeat-x;

		.aqk-content {
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid transparent;
			box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
			padding: 10px 15px;
			background-color: #fff;
		}

		.aqk-comment {
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
		background-color: #008f8b;
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
				background-color: #008f8b;
			}
		}
	}
</style>
