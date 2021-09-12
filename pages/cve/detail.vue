<template>
	<view class="cve-detail">
		<view class="cve-title">
			<text>{{cve.name}}</text>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<uni-icons type="bug" size="14" color="#1dada7"></uni-icons>
				<!-- <image src=""></image> -->
				<text class="key-name">漏洞ID</text>
			</view>
			<view class="info-right">
				<text>{{cve.id}}</text>
			</view>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<uni-icons type="bars" size="14" color="#1dada7"></uni-icons>
				<text class="key-name">漏洞类型</text>
			</view>
			<view class="info-right">
				<text>{{cve.category}}</text>
			</view>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<uni-icons type="time" size="14" color="#1dada7"></uni-icons>
				<text class="key-name">发布时间</text>
			</view>
			<view class="info-right">
				<text>{{cve.published}}</text>
			</view>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<uni-icons type="update" size="14" color="#1dada7"></uni-icons>
				<text class="key-name">更新时间</text>
			</view>
			<view class="info-right">
				<text>{{cve.updated}}</text>
			</view>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<!-- <uni-icons type="bars" size="14" color="#1dada7"></uni-icons> -->
				<image src="../../static/anquanke/cve.png" style="width: 58rpx;height: 26rpx;"></image>
				<text class="key-name">CVE编号</text>
			</view>
			<view class="info-right" @longpress="copyContent(cve.cve)">
				<text style="color: #1dada7; font-weight: bold;">{{cve.cve}}</text>
			</view>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<!-- <uni-icons type="bars" size="14" color="#1dada7"></uni-icons> -->
				<image src="../../static/anquanke/cnnvd.png" style="width: 58rpx;height: 26rpx;"></image>
				<text class="key-name">CNNVD-ID</text>
			</view>
			<view class="info-right" @longpress="copyContent(cve.cnnvd)">
				<text>{{cve.cnnvd}}</text>
			</view>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<uni-icons type="cve-pf" size="14" color="#1dada7"></uni-icons>
				<text class="key-name">漏洞平台</text>
			</view>
			<view class="info-right">
				<text style="color: #999999;font-weight: bold;">{{cve.cvss_2 || cve.Cvss_2 || "N/A"}}</text>
			</view>
		</view>
		
		<view class="info-key">
			<view class="info-left">
				<uni-icons type="cve-score" size="14" color="#1dada7"></uni-icons>
				<text class="key-name">CVSS评分</text>
			</view>
			<view class="info-right" :class="{redscore: cve.Cvss_3.length > 0}">
				<text>{{cve.cvss_3 || cve.Cvss_3 || "N/A"}}</text>
			</view>
		</view>
		
		<view class="gap"></view>
		
		<view class="cve-source">
			<view class="cs-key">漏洞来源</view>
			<view class="cs-value">{{cve.Reference || "N/A"}}</view>
		</view>
		
		<view class="gap"></view>
		
		<view class="cve-desc">
			<view class="cd-key">漏洞详情</view>
			<view class="cd-value" @longpress="copyContent(cve.description)">
				{{cve.description || "漏洞细节尚未披露"}}
			</view>
		</view>
		
		<view class="gap"></view>
		
		<view class="cve-exp">
			<view class="cd-key">漏洞EXP</view>
			<u-parse :html="cve.Exp" :tag-style="preStyle" :selectable="true"></u-parse>
		</view>
		
		<view class="gap"></view>
		
		<view class="extra" @click="viewOrg">
			<uni-icons type="internet" color="#FFFFFF" size="25"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cve: {},
				preStyle: {
					pre: "display: block; padding: 9.5px; margin: 0 0 15px; font-size: 13px; line-height: 1.42857143; color: #333; word-break: break-all; word-wrap: break-word; background-color: #F3F3F3; border: 1px solid #E4E4E4; border-radius: 4px;font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;"
				}
			};
		},
		onLoad(receive) {
			if (receive.cve) {
				this.cve = JSON.parse(decodeURIComponent(receive.cve))
				uni.setNavigationBarTitle({
					title: this.cve.name
				})
				// this.getCveContent(cve.cve)
			}
		},
		methods: {
			getCveContent(cve_number) {
				let self = this
				uni.request({
					url: "https://api.anquanke.com/data/v1/search/vul?s=" + cve_number,
					method: "GET",
					success: (resq) => {
						console.log(resq)
					}
				})
			},
			copyContent(content) {
				if (content.length === 0) {
					uni.showToast({
						title: "Empty",
						duration: 2000,
						icon: "none"
					})
				}
				uni.setClipboardData({
					data: content,
					success() {
						uni.showToast({
							title: 'Copyed',
							icon: "none"
						})
					}
				})
			},
			viewOrg() {
				// #ifdef APP-PLUS
					plus.runtime.openWeb("https://www.anquanke.com/vul/id/" + this.cve.id)
					return
				// #endif
				uni.navigateTo({
					url: "/pages/world/world?connectTheWorld=" + "https://www.anquanke.com/vul/id/" + this.cve.id,
					// url: "/pages/world/world?connectTheWorld=" + encodeURI("https://www.anquanke.com/vul?s=" + this.cve.cve),
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}
	
	.cve-detail{
		.cve-title {
			padding: 30rpx 20rpx;
			font-weight: bold;
			font-size: 36rpx;
			color: #6c757d;
		}
		
		.info-key {
			display: flex;
			flex-direction: row;
			padding: 20rpx 20rpx;
			border-top: 1px solid #e8ecef;
			font-size: 28rpx;
			justify-content: space-between;
			.info-left {
				font-weight: bold;
				
				.key-name {
					margin-left: 12rpx;
				}
				
			}
			
			.info-right {
				color: #999999;
				font-weight: bold;
			}
			
			.redscore {
				background-color: #ff0000;
				padding: 10rpx 14rpx;
				color: #000000;
			}
		}
		
		.cve-source {
			padding: 20rpx;
			.cs-key {
				display: flex;
				border-bottom: solid 2rpx #E7E7E7;
				padding-bottom: 20rpx;
				letter-spacing: 2rpx;
				
				&::before {
					content: "";
					width: 4px;
					margin-right: 20rpx;
					background: #1da29b;
				}
			}
			
			.cs-value {
				display: block;
				padding-top: 20rpx;
				font-size: 26rpx;
				color: #1dada7;
				
			}
		}
		
		.cve-desc {
			
			padding: 20rpx;
			.cd-key {
				display: flex;
				border-bottom: solid 2rpx #E7E7E7;
				padding-bottom: 20rpx;
				letter-spacing: 2rpx;
				
				&::before {
					content: "";
					width: 4px;
					margin-right: 20rpx;
					background: #1da29b;
				}
			}
			
			.cd-value {
				display: block;
				padding-top: 20rpx;
				font-size: 26rpx;
				color: #585858;
				letter-spacing: 2rpx;
				line-height: 2;
			}
		}
		
		.cve-exp {
			padding: 20rpx;
			.cd-key {
				display: flex;
				border-bottom: solid 2rpx #E7E7E7;
				padding-bottom: 20rpx;
				letter-spacing: 2rpx;
				
				&::before {
					content: "";
					width: 4px;
					margin-right: 20rpx;
					background: #1da29b;
				}
			}
			
			.cd-value {
				display: block;
				padding-top: 20rpx;
				font-size: 26rpx;
				color: #585858;
				letter-spacing: 2rpx;
				line-height: 2;
			}
		}
		
		
		.gap {
			height: 30rpx;
			background-color: #f2f2f2;
			padding: 0;
		}
		
		.extra {
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			width: 80rpx;
			height: 80rpx;
			right: 40rpx;
			bottom: 100rpx;
			border-radius: 50%;
			background-color: #008f8b;
			opacity: 0.5
		}
		
	}
	

</style>
