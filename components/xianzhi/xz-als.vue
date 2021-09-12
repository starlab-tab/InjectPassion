<template>
	<view class="xz-als">
		<input class="xz-inp" v-model="xianzhi.ip_ID" type="text" placeholder="XianZhi" />
		<button class="xz-btn" @click="tapXz">解 析</button>
		<u-popup v-model="popShow" mode="bottom" border-radius="10" length="36%" :mask-close-able="false" :closeable="true" @close="popClose" >
			<view class="pop">
				<view class="author">{{xianzhi.author.name}}</view>
				<view class="desc">
					<text>{{xianzhi.title}}</text>
				</view>
				<view class="col-btn">
					<u-button shape="circle" :ripple="true" ripple-bg-color="#008f8b" @click="doIt">Collect</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xianzhi: {
					ip_ID: "",
					mark: "xianzhi",
					collected: true,
					comment_count: 0,
					tag: {},
					author: {}
				},
				popShow: false
			}
		},
		methods: {
			async tapXz() {
				let self = this
				if (self.xianzhi.ip_ID.length > 0) {
					uni.showLoading({mask: true})
					self.$surf.verfCollected({
						article_id: self.xianzhi.ip_ID,
						platform: "xianzhi"
					}).then(res => {
						if (res.data) self.xzLoad()
						else self.errMsg("Already Collect")
					}).catch(res => {
						console.log(res)
						self.errMsg("error in verf")
					})
				}
			},
			async parseXianzhi() {
				let self = this
				uni.request({
					url: "https://xz.aliyun.com/t/" + self.xianzhi.ip_ID,
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
						
						let title = feedBack.match(/<span\s*class="content-title\s*">([\s\S]*?)<\/span>/)
						let tag = feedBack.match(/<span\s*class="label\s*label-default">\s*<a\s*href="\/node\/([0-9]*)">([\s\S]*?)<\/a>\s*<\/span>/)
						let date = feedBack.match(/<span>([\0-\9\-\:]*?)<\/span>/)
						let author = feedBack.match(/<a\s*href="\/u\/([0-9]*)">\s*<span\s*class="username\s*cell">([\s\S]*?)<\/span>/)
						let comment_count = feedBack.match(/<li\s*class="active">([0-9]*)[\s\S]*?<\/li>/)
						self.$emit("pgSync", 20)
						self.xianzhi.title = title ? title[1] : "Everything By STAR_LAB"
						self.xianzhi.tag.id= tag ? tag[1] : "InjectPassion"
						self.xianzhi.tag.name = tag ? tag[2] : "安全分析"
						self.$emit("pgSync", 10)
						self.xianzhi.date = date ? date[1] : "2020-02-02 02:02:02"
						self.xianzhi.author.id = author ? author[1] : "InjectPassion"
						self.xianzhi.author.name = author ? author[2] : "STAR_LAB"
						self.xianzhi.comment_count = comment_count ? comment_count[1] : 0
						self.$emit("pgSync", 20)
						
						self.$emit("pgSync", 10)
						user_info = user_info[0].replace(/class="content-title\s*"/, 'class="content-title" style="font-size: 24px; color: #333; text-decoration: none; line-height: 24px; text-shadow: 0 1px 0 #fff;"')
						user_info = user_info.replace(/<span\s*class="label/g, '<span style="margin-bottom: 10px; margin-top: 10px;margin-left: 2px;background-color: #f4f4f4; line-height: 12px; display: inline-block; padding: 4px 4px 4px 4px; border-radius: 2px; font-size: 10px; color: #555555;" class="label')
						self.$emit("pgSync", 10)
						user_info = user_info.replace(/<span\s*class="pull-right\s*t-vote\s*cell\s*info-right">[\s\S]*?<\/span>/, '')
						user_info = user_info.replace(/<span\s*class="content-node">/, '<span class="content-node"><br>')
						user_info = user_info.replace(/<div\s*class="topic-info">/, '<div class="topic-info" style="margin-top:10px">')
						self.$emit("pgSync", 20)
						self.xianzhi.post_content = user_info + a_c[0]
						self.xianzhi.collect_date = new Date().getTime()
						console.log(self.xianzhi)
						self.done()
					},
					fail: (e) => {
						self.errMsg("Network Blocked")
					}
				});
			},
			xzLoad() {
				this.$emit("pgSync", 10)
				this.parseXianzhi()
			},
			done() {
				this.popShow = true
				uni.hideLoading()
				this.$forceUpdate()
			},
			popClose() {
				this.xianzhi = {
					ip_ID: "",
					comment: 0,
					type: "origin",
					mark: "xianzhi",
					collected: true
				}
				this.$emit("alsAction", "reset")
				this.popShow = false
			},
			async doIt() {
				let self = this
				if (!self.xianzhi.title) return
				uni.showLoading()
				self.$surf.alsCollect({
					article_id: self.xianzhi.ip_ID,
					platform: "xianzhi",
					collect: self.xianzhi
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
						key: 'xianzhi-collect',
						data: res.data[0].collect_ids,
						fail() {
							self.errMsg("als fail set xz-collect")
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
	.xz-als {
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

		.xz-inp {
			color: #373D41;
		}
		.xz-btn {
			color: #373D41;
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
