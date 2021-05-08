<template>
	<view class="main">
		<u-tabs :list="cates" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<!-- 新书上架 -->
		<view class="listbook">
			<navigator v-for="(item, index) in cates[current]['books']" :key="index" :url="'/pages/bookinfo/bookinfo?id=' + item.articleid" class="book">
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
			cates: [{ books: [] }],
			current: 0,
			count: 0,
			loading: false,
			loadtext: '加载中'
		};
	},
	onLoad: function() {
		var user = uni.getStorageSync('user');
		this.getList();
	},
	onReachBottom() {
		if (!this.loading) {
			this.getNewest();
		}
	},
	methods: {
		/**
		 * 获取分类
		 */
		getList: function() {
			var self = this;
			this.$u.api
				.getList({
					num: 10
				})
				.then(res => {
			//		if (res.success != 1) {
			//			return this.$u.toast(res.msg);
			//			
			//		}
					this.cates = res.result.data;
					
					
					this.cates.forEach((item, i) => {
						this.$set(this.cates[i], 'name', item.cate_name);
					});
					this.count = res.result.count;
					this.getNewest();
				})  
				.catch(err => {
					console.log(err);
				});
		},

		getNewest: function() {
			if (this.loading) {
				return;
			}

			this.loadtext = '加载中';
			this.loading = true;
			var self = this;
			this.$u.api
				.getBookList({
					pagesize: 10,
					page: this.cates[this.current].page,
					sortid: this.cates[this.current].sortid
				})
				.then(res => {
				//	if (res.success != 1) {
					//	return this.$u.toast(res.msg);
				//	}
					this.cates[this.current].page++;
					if (res.result.data.length < 1) {
						this.loadtext = '没有了';
						return;
					}  
					this.cates[this.current].books = this.cates[this.current].books.concat(res.result.data);
					this.loading = false;
				})
				.catch(err => {
					console.log(err);
				});
		},
		change(val) {
			this.current = val;
			if (this.cates[this.current]['books'].length < 1) {
				this.loadtext = '加载中';
				this.loading = false;
				this.getNewest();
			}
		}
	}
};
</script>
<style>
.main {
	padding-top: var(--status-bar-height);
}
</style>
