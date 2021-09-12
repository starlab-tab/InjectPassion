<template>
	<view class="navbar">
		<view class="navbar-fixed" :style="{backgroundColor: pfNavStyle.navBgColor}">
			<view :style="{height:statusBarHeight+'px'}"></view>
			<view v-if="pickerList.length>0" class="navbar-content" :style="{height:navBarHeight+'px',width:windowWidth+'px'}">
				<picker @change="bindPickerChange" :value="pickerIndex" :range="pickerList" range-key="title">
					<!-- <view :style="{color: navTitleColor}">{{pickerList[pickerIndex].title}}</view> -->
					<image :src="pickerList[pickerIndex].logo" mode="aspectFill" class="picerImg" 
					:style="{height: pfNavStyle.logoHeight + 'rpx', width: pfNavStyle.logoWidth + 'rpx'}"></image>
				</picker>
			</view>
		</view>
		<view :style="{height: statusBarHeight+navBarHeight+'px'}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			pickerList: {
			  type: Array,
			  default() {
			    return [];
			  }
			},
			pfNavStyle: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 44,
				windowWidth: 375,
				val: '',
				pickerIndex: 0,
				pickerShow: false,
				defaultSelector: [0],
				navClick: false
			};
		},
		watch:{
			value(newVal){
				this.val = newVal
			}
		},
		created() {
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight
			this.windowWidth = info.windowWidth
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			//微信胶囊位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight) + 4
			// #endif
		},
		methods: {
			bindPickerChange(e) {
				// this.pickerIndex = e[0]
				this.pickerIndex = e.detail.value
				this.$emit('pickerSwitch', this.pickerList[e.detail.value].platform)
			},
			activePicker() {
				// console.log(this.pickerShow)
				this.pickerShow = !this.pickerShow
			}
		}
	}
</script>

<style lang="scss">

	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: #333333;
			font-weight: bold;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				// padding: 0 60rpx;
				height: 90rpx;
				box-sizing: border-box;
				font-size: 40rpx;
				border-bottom: solid 2rpx #ddd;
				.picerImg {
					height: 50rpx;
					width: 228rpx;
					display: block;
				}
			}
		}

	}
</style>
