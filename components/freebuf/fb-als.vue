<template>
	<view class="f-als">
		<input class="f-inp" v-model="freebuf.ip_ID" type="text" placeholder="Freebuf" placeholder-style="color:#2db362" />
		<button class="f-btn" @click="tapFb">解 析</button>
		<u-popup v-model="popShow" mode="bottom" border-radius="10" length="36%" :mask-close-able="false" :closeable="true" @close="popClose" >
			<view class="pop">
				<view class="author">{{freebuf.username}}</view>
				<view class="desc">
					<text>{{freebuf.post_title}}</text>
				</view>
				<view class="col-btn">
					<u-button shape="circle" :ripple="true" ripple-bg-color="#19BE6B" @click="doIt">Collect</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				freebuf: {
					ip_ID: "",
					comment_count: 0,
					mark: "freebuf",
					collected: true
				},
				popShow: false,
			}
		},
		methods: {
			async tapFb() {
				let self = this
				if (self.freebuf.ip_ID.length > 0) {
					uni.showLoading({mask: true})
					self.$surf.verfCollected({
						article_id: self.freebuf.ip_ID,
						platform: "freebuf"
					}).then(res => {
						if (res.data) self.fbLoad()
						else self.showTip("Already Collect")
					}).catch(res => {
						self.showTip("Network Blocked")
					})
				}
			},
			async fbLoad() {
				this.$emit("pgSync", 10)
				const resq_1 = this.parseDetail_1()
				const resq_2 = this.parseDetail_2()
				const resq_3 = this.parseCmt()
				if (await resq_1 && await resq_2 && await resq_3) {
					this.done()
				}
			},
			parseDetail_1() {
				let self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://www.freebuf.com/fapi/frontend/post/detail?id=" + self.freebuf.ip_ID,
						method: 'GET',
						success: res => {
							const feedBack = res.data
							if (feedBack.code === 200) {
								self.freebuf.username = feedBack.data.post_author
								self.freebuf.post_title = feedBack.data.post_title
								self.freebuf.content = feedBack.data.post_desc
								self.$emit("pgSync", 20)
								self.freebuf.post_date = feedBack.data.post_date
								self.$emit("pgSync", 10)
								self.freebuf.post_content = feedBack.data.post_content
								self.freebuf.tag = feedBack.data.tag
								self.freebuf.category = feedBack.data.category ? feedBack.data.category[0].name : "STAR_LAB",
								self.$emit("pgSync", 20)
								resolve(true)
							}else {
								self.showTip("No Such Article-1")
								resolve(false)
							}
						},
						fail: err => {
							console.log(err)
							self.showTip("Network Blocked")
							reject(err)
						}
					})
				})
			},
			parseDetail_2() {
				let self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://api.freebuf.com/article/detail/?id=" + self.freebuf.ip_ID,
						method: 'GET',
						success: res => {
							const feedBack = res.data
							if (feedBack.status === 200) {
								self.freebuf.post_image = feedBack.data.img
								self.freebuf.is_original = feedBack.data.original
								self.$emit("pgSync", 20)
								self.freebuf.url = feedBack.data.url.replace("https://www.freebuf.com", "")
								self.freebuf.read_count = feedBack.data.pv
								self.freebuf.collect_date = new Date().getTime()
								self.partTwoSet = true
								self.$emit("pgSync", 20)
								resolve(true)
							}else {
								self.showTip("No Such Article-2")
								resolve(false)
							}
						},
						fail: err => {
							console.log(err)
							self.showTip("Network Blocked")
							reject(err)
						}
					})
				})
			},
			parseCmt() {
				let self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://api.freebuf.com/postComment/commentCount?id=" + self.freebuf.ip_ID,
						method: 'GET',
						success: res => {
							const feedBack = res.data
							//{"status":200,"msg":"success","data":{"count":0,"time":"2020-08-06 01:23:50"}} id=245
							//{"status":200,"msg":"success","data":{"count":29,"time":"2020-08-06 01:24:13"}} id=245025
							if (feedBack.status === 200) {
								self.freebuf.comment_count = feedBack.data.count
								resolve(true)
							} else {
								console.log("cmt fail")
								resolve(false)
							}
						},
						fail: err => {
							console.log(err)
							self.showTip("Network Blocked")
							reject(err)
						}
					})
				})
			},
			async getAllComment() {
				const res = await uni.request({
					url: "https://api.freebuf.com/postComment/commentCount?id=" + self.freebuf.ip_ID,
					method: 'GET',
				})
				//ok: 0: null 1: {data:{}} fail: 0: {showTip: "request:fail "}
				if (!res[0]) {
					this.freebuf.comment_count = res[1].data.data.count
					let loopNum = parseInt(this.freebuf.comment_count / 10)
					if (loopNum > 0) {
						for (var i = 1; i <= loopNum; ++i) {
							await uni.request({
								url: "https://www.freebuf.com/fapi/frontend/post/comments?id=" + self.freebuf.ip_ID + "&order=2&page=" + i,
								method: "GET",
								success: res => {
									self.freebuf.commentList.push(...res.data.data.data_list)
								}
							})
						}
						this.$emit("pgSync", 10)
					}
				} else {
					this.showTip("cmt1down")
				}
			},
			done() {
				console.log(this.freebuf)
				this.popShow = true
				uni.hideLoading()
				this.$forceUpdate()
			},
			popClose() {
				this.freebuf = {
					ip_ID: "",
					comment_count: 0,
					mark: "freebuf",
					collected: true
				}
				this.$emit("alsAction", "reset")
				this.popShow = false
			},
			async doIt() {
				let self = this
				if (!self.freebuf.post_title) return
				uni.showLoading()
				self.$surf.alsCollect({
					article_id: self.freebuf.ip_ID,
					platform: "freebuf",
					collect: self.freebuf
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
						key: 'freebuf-collect',
						data: res.data[0].collect_ids,
						fail() {
							self.showTip("als fail set fb-collect")
						}
					});
					self = null
				}).catch(res => {
					self.showTip("error in collect")
				})
			},
			showTip(tip) {
				uni.showToast({
					duration: 2000,
					icon: "none",
					title: tip
				})
				this.popShow = false
				this.$emit("alsAction", "reset")
				uni.hideLoading()
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.f-als {
		margin: 0 20rpx 20rpx 20rpx;
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

		.f-inp {
			background-color: #333333;
			color: #19a358;
		}

		.f-btn {
			height: 100%;
			font-size: 31rpx;
			margin-right: 0;
			background-color: #333333;
			color: #2db362;
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
