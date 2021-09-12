<template>
	<view class="trace-page">
		<u-navbar :is-fixed="true" back-icon-color="#ffffff" :is-back="true" :background="{ background: '#333333' }">
			<view class="nav-content">
				<text class="erase-all" @click="traceAction(-1)">Erase All</text>
			</view>
		</u-navbar>
		<scroll-view scroll-y style="height: 100%;width: 100%;">
			<view class="">
				<trace-item :index="index" :item="item" v-for="(item,index) in traces" :key="item.ip_ID"
				@traceAction="traceAction"></trace-item>
			</view>
			<u-loadmore :status="uloadmore.status" :loadText="uloadmore.loadText" :bg-color="uloadmore.bgColor"
			:icon-type="uloadmore.iconType" :is-dot="uloadmore.isDot" @loadmore="loadMore" margin-top="40" margin-bottom="40"/>
		</scroll-view>
		<view v-if="traces.length===0" class="tip">Trace is Empty</view>
		<u-modal v-model="uModal.show"
		:show-cancel-button="true" :show-title="false" :async-close="false"
		@confirm="eraseConfirm" :content="uModal.content"
		:width="uModal.width"  :mask-close-able="true"
		:confirm-style="uModal.confirmStyle" 
		:content-style="uModal.contentStyle"
		:cancel-style="uModal.cancleStyle">
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				traces: [],
				uModal: {
					show: false,
					content: "",
					contentStyle: {
						fontSize: "27rpx",
						padding: "40rpx"
					},
					cancleStyle: {
						fontSize: "26rpx",
						height: "90rpx"
					},
					confirmStyle: {
						fontSize: "26rpx",
						color: "#eb6438",
						height: "90rpx"
					},
					width: 430,
				},
				eraseAll: false,
				// for identify whitch item to be del
				actionIndex: -1,
				uloadmore: {
					status: 'loading',
					iconType: 'flower',
					isDot: true,
					loadText: {
						loadmore: 'click / slide',
						loading: 'loading...',
						nomore: 'no more'
					},
					bgColor: "#f5f5f5"
				},
				page: 1,
				limit: 5
			}
		},
		onLoad() {
			this.getTraces()
		},
		onReachBottom(e) {
			 // this.loadMore()
		},
		methods: {
			async getTraces() {
				let self = this
				self.uloadmore.status = "loading" 
				self.$surf.getTraces({
					page: self.page,
					limit: self.limit
				}).then(res => {
					self.page++
					self.traces.push(...res.data)
					setTimeout(function() {
						if (res.data.length === 0) {
							self.page--
							self.uloadmore.status = "nomore"
						}else {
							self.uloadmore.status = "loadmore"
						}
						self = null
					}, 500)
				}).catch(err => {
					uni.showToast({
						duration: 2000,
						title: "Error In Collects ",
						icon: "none"
					})
				})
			},
			traceAction(index) {
				if (index < 0) {
					this.uModal.content = "Erase All ?"
					this.eraseAll = true
				}else {
					this.uModal.content = "Erase This?"
					this.eraseAll = false
				}
				this.actionIndex = index
				this.uModal.show = true
			},
			eraseConfirm(index) {
				let self = this
				uni.showLoading()
				if (self.eraseAll) {
					self.$surf.eraseTraces({
						_id: -1,
						type: "all"
					}).then(res => {
						console.log("eraseAll")
						self.traces = []
						uni.hideLoading()
					}).catch(res => {
						uni.showToast({
							duration: 2000,
							title: "erase fail",
							icon: "none"
						})
						uni.hideLoading()
					})
				}else {
					let self = this
					self.$surf.eraseTraces({
						_id: self.traces[self.actionIndex]._id,
						type: "one"
					}).then(res => {
						console.log("erase one")
						self.traces.splice(self.actionIndex, 1)
						uni.hideLoading()
					}).catch(res => {
						console.log(res)
						uni.showToast({
							duration: 2000,
							title: "erase fail",
							icon: "none"
						})
						uni.hideLoading()
					})
				}
			},
			loadMore() {
				if (this.uloadmore.status === "loading" || this.uloadmore.status === "nomore") return
				this.getTraces()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}
	.trace-page {
		.nav-content {
			display: flex;
			flex-direction: row;
			// justify-content: space-between;
			justify-content: flex-end;
			align-items: center;
			width: 100%;
			font-size: 36rpx;
			.traces {
				color: #19a358;
				margin-left: 20rpx;
			}
			
			.erase-all {
				color: #19a358;
				margin-right: 26rpx;
			}
			
		}
		.tip {
			position: absolute;
			top: 30%;
			left: 37%;
			color: #d1d1d1;
		}
	}

</style>
