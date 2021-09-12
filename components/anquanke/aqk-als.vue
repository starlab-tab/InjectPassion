<template>
	<view class="aqk-als">
		<input class="aqk-inp" v-model="anquanke.ip_ID" type="text" placeholder="Anquanke" placeholder-style="color:#FFFFFF" />
		<button class="aqk-btn" @click="tapAqk">解 析</button>
		<u-popup v-model="popShow" mode="bottom" border-radius="10" length="36%" :mask-close-able="false" :closeable="true" @close="popClose" >
			<view class="pop">
				<view class="author">{{anquanke.author.nickname}}</view>
				<view class="desc">
					<text>{{anquanke.title}}</text>
				</view>
				<view class="col-btn">
					<u-button shape="circle" :ripple="true" ripple-bg-color="#008f8b" @click="doIt">Collect</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { Base64 } from '../../utils/Base64.js'
	export default {
		data() {
			return {
				anquanke: {
					ip_ID: "",
					type: "origin",
					mark: "anquanke",
					collected: true,
					user_label: "",
					author: {}
				},
				popShow: false
			}
		},
		methods: {
			async tapAqk() {
				console.log("tap")
				let self = this
				if (self.anquanke.ip_ID.length > 0) {
					uni.showLoading({mask: true})
					self.$surf.verfCollected({
						article_id: parseInt(self.anquanke.ip_ID),
						platform: "anquanke"
					}).then(res => {
						if (res.data) self.aqkLoad()
						else self.errMsg("Already Collect")
					}).catch(res => {
						console.log(res)
						self.errMsg("error in verf")
					})
				}
			},
			parseAnquanke() {
				let self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://api.anquanke.com/data/v1/post/app?id=" + self.anquanke.ip_ID,
						method: "GET",
						success: res=> {
							let feedBack = res.data
							if (feedBack.data.author.id) {
								self.anquanke.ip_ID = feedBack.data.id
								self.anquanke.title = feedBack.data.title
								self.anquanke.cover = feedBack.data.cover
								self.anquanke.desc = feedBack.data.desc
								self.$emit("pgSync", 20)
								self.anquanke.author.id = feedBack.data.author.id
								self.anquanke.author.nickname = feedBack.data.author.nickname
								self.anquanke.comment = feedBack.data.comment
								self.anquanke.collect_date = new Date().getTime()
								self.$emit("pgSync", 20)
								resolve(true)
							}else {
								// self.errMsg("No Such Article")
								resolve(false)
							}
						},
						fail: err => {
							console.log(err)
							this.errMsg("NetWork Blocked")
							reject(err)
						}
					})
				})
			},
			parseContent() {
				let self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://www.anquanke.com/post/id/" + self.anquanke.ip_ID,
						method: 'GET',
						success: res => {
							if (res.statusCode === 500) {
								self.errMsg("No Such Article")
								return
							}
							let a_c = res.data.match(/<div\s*class=".*article-detail"([\s\S]*?)>([\s\S]*)<\/div>\s*<section\s*.*?>/)
							if (!a_c) {
								self.errMsg("Deatil No Match")
								resolve(false)
							}else {
								a_c = a_c[0].replace(/<div\s*class="bdsharebuttonbox".*\s*.*?>([\s\S]*?)<\/div>/g, "")
								a_c = a_c.replace(/<button([\s\S]*?)>([\s\S]*?)<\/button>/g, "")
								a_c = a_c.replace(/<section\s*class="article-footer-label">([\s\S]*?)<\/section>/, "")
								a_c = a_c.replace(/<section([\s\S].*?)class="hide-in-mobile-device"([\s\S]*?)>([\s\S]*?)<\/section>/g, "")
								self.$emit("pgSync", 20)
								a_c = a_c.replace(/<section([\s\S].*?)class="hide-in-mobile-device">/, "")
								a_c = a_c.replace(/data-original/g, "src")
								a_c = a_c.replace(/<div\s*class="hide-in-mobile-device"([\s\S]*?)>([\s\S]*?)<\/div>/, "")
								self.$emit("pgSync", 20)
								a_c = a_c.replace(/class="article-tag-primary"/g,'style="display: inline-block; height: 26px; line-height: 24px; padding: 0 15px; border: 1px solid #1dada7; color: #1dada7; border-radius: 15px;text-decoration: none !impotant;"')
								a_c = a_c.replace(/style="margin-top:20px;border-radius: 0;border: none"/,'style="margin-top: 20px; position: relative; padding: .75rem 1.25rem; margin-bottom: 1rem;color: #856404; background-color: #fff3cd;"')
								a_c = a_c.replace(/style="color:rgb\(255, 103, 0\) !important; "/,'style="color:rgb(255, 103, 0) !important;display: contents;"')
								a_c = a_c.replace(/h5 class="alert-heading"/, 'h5 class="alert-heading" style="font-size:18px"')
								let date = a_c.match(/<time[\s\S]*?>[\u4e00-\u9fa5：]*([\s\S]*?)<\/time>/)
								self.anquanke.date = date ? date[1] : "2020-02-02 02:02:02"
								self.anquanke.post_content = a_c
								self.$emit("pgSync", 10)
								resolve(true)
							}
						},
						fail: (err) => {
							console.log(err)
							self.errMsg("Network Block")
							reject(err)
						},
					})
				})
			},
			async aqkLoad() {
				this.$emit("pgSync", 10)
				const resq_1 = this.parseAnquanke()
				const resq_2 = this.parseContent()
				if (await resq_1 && await resq_2) {
					this.done()
				}
			},
			done() {
				this.popShow = true
				uni.hideLoading()
				this.$forceUpdate()
			},
			popClose() {
				this.anquanke = {
					ip_ID: "",
					comment: 0,
					type: "origin",
					mark: "anquanke",
					collected: true
				}
				this.$emit("alsAction", "reset")
				this.popShow = false
			},
			async doIt() {
				let self = this
				if (!self.anquanke.title) return
				uni.showLoading()
				self.$surf.alsCollect({
					article_id: self.anquanke.ip_ID,
					platform: "anquanke",
					collect: self.anquanke
				}).then(res => {
					uni.showToast({
						duration: 2500,
						icon: "none",
						title: "Collected"
					})
					self.popShow = false
					uni.hideLoading()
					self.$emit("alsAction", "done")
					uni.setStorage({
						key: 'anquanke-collect',
						data: res.data[0].collect_ids,
						fail() {
							self.errMsg("als fail set aqk-collect")
						}
					});
					self = null
				}).catch(res => {
					self.errMsg("error in collect")
				})
			},
			errMsg(msg) {
				uni.showToast({
					duration: 2000,
					icon: "none",
					title: msg
				})
				this.popShow = false
				this.$emit("alsAction", "reset")
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.aqk-als {
		margin: 30rpx 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 80rpx;

		input {
			border: solid 2rpx #cacaca;
			min-width: 75%;
			min-height: 100%;
			padding: 0 16rpx;
		}

		button {
			height: 100%;
			font-size: 31rpx;
			margin-right: 0;
		}

		.aqk-inp {
			background-color: #008f8b;
			color: #FFFFFF;
		}
		.aqk-btn {
			background-color: #008f8b;
			color: #FFFFFF;
		}
		
		.pop {
			display: flex;
			flex-direction: column;
			height: 100%;
			align-items: center;
			justify-content: space-between;
			font-weight: bold;
			.author {
				font-size: 36rpx;
				padding-top: 30rpx;
			}
			
			.desc {
				margin: 0 30rpx 30rpx 30rpx;
				text {
					font-size: 32rpx;
					word-break: break-all;
					line-height: 2;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 4;
					-webkit-box-orient: vertical;
				}
			}
			
			.col-btn {
				width: 85%;
				margin-bottom: 50rpx;
				font-weight: 0;
			}
		}
	}
</style>
