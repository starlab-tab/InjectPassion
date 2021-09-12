<template>
	<view class="week-page">
		<scroll-view scroll-y style="height: 100%;width: 100%;">
			<view class="news">
				<uni-icons class="icon" type="paperplane-filled" size="20" color="#2467d2"></uni-icons>
				<text>安全资讯</text>
			</view>
			<aqk-item :item="item" v-for="item in news" :key="item.id"></aqk-item>
			
			<view class="knowledge">
				<uni-icons class="icon" type="download-filled" size="20" color="#cb2d01"></uni-icons>
				<text>安全知识</text>
			</view>
			<aqk-item :item="item" v-for="item in knowledge" :key="item.id"></aqk-item>
		</scroll-view>
		<u-back-top :scrollTop="backTop.scrollTop" :mode="backTop.mode"
		:bottom="backTop.bottom" :right="backTop.right" :top="backTop.top"
		:icon-style="backTop.iconStyle" :duration="backTop.duration"
		:customStyle="backTop.customStyle" :icon="backTop.icon">
		</u-back-top>
	</view>
</template>

<script>
	import aqkItem from "@/components/anquanke/aqk-item.vue"
	export default {
		data() {
			return {
				news: [],
				knowledge: [],
				showNews: false,
				showKnowledge: false,
				content: ``,
				backTop: {
					top: 2000,
					scrollTop: 0,
					mode: "circle",
					bottom: 200,
					right: 40,
					customStyle: {
						backgroundColor: "#008f8b"
					},
					icon: "arrow-up",
					iconStyle: {
						color: '#ffffff',
						fontSize: '40rpx'
					},
					duration: 300
				},
			}
		},
		onLoad(receive) {
			this.getWeekData(212495)
			return
			uni.setNavigationBarColor({
				backgroundColor: "#008F8B"
			})
			if (receive.title) {
				uni.setNavigationBarTitle({
					title: receive.title
				})
			}
			if (receive.id) {
				this.getWeekData(id)
			}
		},
		components: {
			aqkItem
		},
		methods: {
			async getWeekData(id) {
				uni.showLoading()
				let self = this
				uni.request({
					url: "https://api.anquanke.com/data/v1/post?id=" + id,
					method: "GET",
					success: (res) => {
						console.log(res)
						if (res.statusCode === 200 && res.data.success) {
							if (res.data.posts.news.length > 0) {
								self.news = res.data.posts.news
							}else {
								uni.showToast({
									duration: 2000,
									title: "No News",
									icon: "none"
								})
							}
							
							if (res.data.posts.knowledge.length > 0) {
								self.knowledge = res.data.posts.knowledge
							}else {
								uni.showToast({
									duration: 2000,
									title: "No Knowledge",
									icon: "none"
								})
							}
						}else {
							uni.showToast({
								duration: 2000,
								title: "Url Error",
								icon: "none"
							})
						}
					},
					fail: (err) => {
						uni.showToast({
							duration: 2000,
							title: "NewWork Blocked",
							icon: "none"
						})
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			async parseWeekContent(anquanke) {
				let self = this
				uni.showLoading({
					title: "冲浪中...",
					mask: true
				});
				uni.request({
					url: self.baseLink,
					method: 'GET',
					success: res => {
						var feedBack = res.data
						var week_content = feedBack.match(/<h3>安全资讯<\/h3>([\s\S]*?)<h3>安全活动<\/h3>/)
						// var week_knowledge = feedBack.match(/<h3>安全知识<\/h3>([\s\S]*?)<h3>安全活动<\/h3>/)
						if (!week_content[1]) {
							uni.showToast({
								title: "No match",
								icon: "none"
							})
							return
						}
						week_content = week_content[1].match(/<div class="row">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g)
						let filterNews = {}
						let tempNews = {}
						let tag = ""
						let title_id = ""
						let name_label = ""
						for (var i = 0, len = week_content.length; i != len; ++i) {
							if (week_content[i].match(/<span>([\s\S]*?)<\/span>/)) {
								tag = week_content[i].match(/<span>([\s\S]*?)<\/span>/)[1]
							}
							title_id = week_content[i].match(/<a target="_blank"\s*rel="noopener noreferrer"\s*href="\/post\/id\/([\s\S]*?)">([\s\S]*?)<\/a>/)
							name_label = week_content[i].match(/<span\s*class="user-name([\s\S]*?)">([\s\S]*?)<\/span>/)
							tempNews = {
								id: title_id[1],
								cover: week_content[i].match(/<img data-original="([\s\S]*?)">/)[1].trim(),
								title: title_id[2].trim(),
								tags: [tag],
								desc: week_content[i].match(/<div\s*class="desc\s*hide-in-mobile-device"([\s\S]*?)>([\s\S]*?)<\/div>/)[2].trim(),
								date: week_content[i].match(/<span\s*class="date">([\s\S]*?)<\/i>([\s\S]*?)<\/span>/)[2].trim(),
								author: {
									nickname: name_label[2].trim(),
									user_label: name_label[1].trim(),
								},
								category_slug: "week_detail"
							}
							
							filterNews[i] = tempNews
						}
						self.weekContent = filterNews
						// this.newWeekContent = filterNews
						filterNews = {}
						tempNews = {}
					},
					fail: (e) => {
						//整个弹窗提示
					},
					complete() {
						uni.hideLoading()
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	page {
		background-color: #f8f8f8;
	}
	
	.week-page {
		
		.news {
			height: auto;
			background-color: #FFFFFF;
			margin-top: 30rpx;
			padding: 30rpx;
			text {
				font-size: 36rpx;
				padding: 20rpx 0 20rpx 0;
				color: #999999;
				font-weight: bold;
			}
			
			.icon {
				padding: 20rpx;
			}
		}
		
		.knowledge {
			height: auto;
			background-color: #FFFFFF;
			padding: 30rpx;
			margin-top: 30rpx;
			text {
				font-size: 36rpx;
				padding: 20rpx 0 20rpx 0;
				color: #999999;
				font-weight: bold;
			}
			
			.icon {
				padding: 20rpx;
			}
		}
	}

</style>
