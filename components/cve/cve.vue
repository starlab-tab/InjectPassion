<template>
	<view class="cve">
		<cve-item :item="item" v-for="item in cves" :key="item.id"></cve-item>
		<u-loadmore :status="uloadmore.status" :loadText="uloadmore.loadText" :is-dot="uloadmore.isDot" @loadmore="loadMore"
		 :icon-color="uloadmore.iconColor" :bgColor="uloadmore.bgColor" margin-top="40"/>
	</view>
</template>

<script>
	import cveItem from "@/components/cve/cve-item.vue"
	export default {
		data() {
			return {
				cves: [],
				uloadmore: {
					status: 'loading',
					iconType: 'flower',
					iconColor: '#1da29b',
					bgColor: "#FFFFFF",
					isDot: true,
					loadText: {
						loadmore: 'click to get more',
						loading: 'loading...',
						nomore: 'no more'
					}
				},
				currentPage: 1,
				maxPage: 5,
			};
		},
		components: {
			cveItem
		},
		created() {
			this.getLatestCves()
		},
		methods: {
			getLatestCves(){
				let self = this
				uni.request({
					// url: "https://api.anquanke.com/data/v1/vul?page=1",
					url: "https://api.anquanke.com/data/v1/search/vul?page=1",
					method: "GET",
					success: res => {
						if (res.statusCode === 200 && res.data.success) {
							if (res.data.data.length === 0) {
								self.showMsg("No More")
								self.uloadmore.status = "nomore"
								return
								
							}
							if ((self.cves[0] && res.data.data[0]) &&
								(self.cves[0].id === res.data.data[0].id)) {
								self.showMsg("Nothing New")
								return
							}
							self.cves = res.data.data
							setTimeout(function() {
								self.uloadmore.status = "loadmore"
								self = null
							}, 500)
							
						}else {
							self.showMsg("Url Error")
						}
					},
					fail: res => {
						console.log(res)
						self.showMsg("CVE Blocked")
					},
					complete() {
						uni.hideLoading()
						// self.uloadmore.bgColor = "#f2f2f2"
					}
				})
			},
			async getMoreCves() {
				let self = this
				self.uloadmore.status = "loading"
				console.log(self.currentPage)
				uni.request({
					// url: "https://api.anquanke.com/data/v1/vul?page=" + (self.currentPage + 1) + "&limit=20",
					url: "https://api.anquanke.com/data/v1/search/vul?page=" + (self.currentPage + 1),
					method: 'GET',
					data: {},
					success: res => {
						if (res.statusCode === 200 && res.data.success) {
							if (res.data.data.length === 0) {
								self.showMsg("No More")
								self.uloadmore.status = "nomore"
								return
							}
							this.cves.push(...res.data.data)
							setTimeout(function() {
								if (++self.currentPage >= self.maxPage) {
									self.uloadmore.status = "nomore"
								} else {
									self.uloadmore.status = "loadmore"
								}
								self = null
							}, 500)
						}else {
							self.uloadmore.status = "nomore"
							self.showMsg("Url Error")
						}
					},
					fail: res => {
						self.uloadmore.status = "loadmore"
						self.showMsg("CVE Blocked")
					}
				})
			},
			newCves() {
				uni.showLoading()
				this.getLatestCves()
			},
			loadMore() {
				if (this.currentPage >= this.maxPage || this.uloadmore.status === "loading") return
				this.getMoreCves()
			},
			showMsg(msg) {
				uni.showToast({
					duration: 2000,
					title: msg,
					icon: "none"
				})
			},
		}
	}
</script>

<style lang="scss">
	.cve{
		margin-top: 40rpx;
	}
</style>
