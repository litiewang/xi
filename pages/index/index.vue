<template>
	<view class="body">
		<view id="search">
			<u-search bg-color="#fff" border-color="#eee" placeholder="输入书名" :clearabled="true" shape="square" @search="search" :animation="true"></u-search>
		</view>
		<!-- 轮播图 -->
		<swiper indicator-dots indicator-active-color="#2979ff" autoplay circular class="swiper">
			<swiper-item v-for="(item, index) in banner" :key="index" :alt="item.title"><image :src="item.pic"></image></swiper-item>
		</swiper>

		<!-- 人气热门 -->
		<view class="listbook">
			<u-section color="#2979ff" class="title" title="热门推荐" :right="false"></u-section>
			<navigator v-for="(item, index) in hotbooks" :key="index" :url="'/pages/bookinfo/bookinfo?id=' + item.articleid" class="book">
				<image :src="item.cover"></image>
				<view class="book_info">
					<text class="title">{{ item.articlename }}</text>
					<text class="author">作者：{{ item.author }} | 类别：{{ item.cate_name }}</text>
					<text class="intro">简介：{{ item.intro }}</text>
					<u-tag type="warning" :text="item.fullflag == 1 ? '已完结' : '连载中'" mode="plain" shape="square" size="mini" />
				</view>
			</navigator>
		</view>
		<!-- 新书上架 -->
		<view class="listbook">
			<u-section color="#2979ff" class="title" title="新书上架" :right="false"></u-section>
			<navigator v-for="(item, index) in newbooks" :key="index" :url="'/pages/bookinfo/bookinfo?id=' + item.articleid" class="book">
				<image :src="item.cover" lazy-load></image>
				<view class="book_info">
					<text class="title">{{ item.articlename }}</text>
					<text class="author">作者：{{ item.author }} | 类别：{{ item.cate_name }}</text>
					<text class="intro">简介：{{ item.intro }}</text>
					<u-tag type="error" shape="square" size="mini" :text="item.fullflag == 1 ? '已完结' : '连载中'" mode="plain" />
				</view>
			</navigator>
		</view>
		<u-divider class="loading" id="loading" v-if="loading">{{ loadtext }}</u-divider>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 当前显示
			hotbooks: [],
			newbooks: [],
			loading: false,
			loadtext: '加载中',
			page: 1,
			banner: [],
			keyword: ''
		};
	},
	onReachBottom() {
		if (!this.loading) {
			this.getNewest();
		}
	},
	onLoad: function() {
		var user = uni.getStorageSync('user');
		this.$u.api
			.getHot({
				num: 10
			})
			.then(res => {
				if (res.success != 1) {
					return this.$u.toast(res.msg);
				}
				this.hotbooks = this.hotbooks.concat(res.books);
			})
			.catch(err => {
				console.log(err);
			});
		this.getNewest();
		this.getBanners();
	},

	methods: {
		/**
		 * 获取Banner图
		 */
		getBanners: function(times) {
			var self = this;
			this.$u.api
				.getBanners({
					num: 4
				})
				.then(res => {
					if (res.success != 1) {
						return this.$u.toast(res.msg);
					}
					this.banner = res.banners;
				})
				.catch(err => {
					console.log(err);
				});
		},

		/**
		 * 获取最新图书
		 */
		getNewest: function() {
			if (this.loading) {
				return;
			}
			this.loadtext = '加载中';
			this.loading = true;
			var self = this;
			this.$u.api
				.getNewest({
					num: 10,
					page: this.page
				})
				.then(res => {
					if (res.success != 1) {
						return this.$u.toast(res.msg);
					}
					this.page++;
					if (res.books.length < 1) {
						this.loadtext = '没有了';
						return;
					}
					this.newbooks = this.newbooks.concat(res.books);
					this.loading = false;
				})
				.catch(err => {
					console.log(err);
				});
		},

		/**
		 * 点击搜索按钮
		 */
		search: function(val) {
			this.keyword = val;
			if (this.keyword != '') {
				uni.navigateTo({
					url: '/pages/searchRes/searchRes?keyword=' + this.keyword
				});
			}
		}
	}
};
</script>
<style>
.body {
	overflow-y: hidden;
}
/*轮播图*/
.swiper {
	height: 300rpx;
}
.swiper image {
	height: 300rpx;
	width: 100%;
}
.listbook {
	margin-bottom: 20px;
}

.title {
	margin-bottom: 10px;
	padding-left: 10px;
}
#loading {
	margin: 25px auto;
}
#search {
	margin-top: var(--status-bar-height);
}
</style>
