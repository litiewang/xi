<template>
	<view class="main">
		<u-tabs :list="cates" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<!-- 新书上架 -->
		<view class="listbook">
			<navigator v-for="(item, index) in cates[current]['books']" :key="index" :url="'/pages/bookinfo/bookinfo?id=' + item.articleid" class="book">
				<image :src="item.cover" lazy-load></image>
				<view class="book_info">
					<text class="title">{{ item.articlename }}</text>
					<text class="author">{{ item.author }} | {{ item.cate_name }} | {{ item.allvisit }}人在读</text>
					<text class="intro">简介：{{ item.intro }}</text>
					<view>
						<u-tag type="error" shape="square" :text="item.fullflag == 1 ? '已完结' : '连载中'" mode="light" size="mini" font-size="20" />
						<text class="u-tips-color u-margin-left-5">{{ $u.timeFrom(item.lastupdate, false) }}更新</text>
					</view>
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
			cates: [
				{
					books: [],
					name: '人气榜',
					type: 'hot',
					page: 1
				},
				{
					books: [],
					name: '新书榜',
					type: 'newest',
					page: 1
				},
				{
					books: [],
					name: '完结榜',
					type: 'ends',
					page: 1
				},
				{
					books: [],
					name: '推荐榜',
					type: 'tops',
					page: 1
				},
				{
					books: [],
					name: '更新榜',
					type: 'update',
					page: 1
				}
			],
			current: 0,
			allcount: 0,
			loading: false,
			loadtext: '加载中'
		};
	},
	onLoad: function() {
		var user = uni.getStorageSync('user');
		this.getRank();
	},
	onReachBottom() {
		if (!this.loading) {
			this.getRank();
		}
	},
	methods: {
		getRank: function() {
			if (this.loading) {
				return;
			}

			this.loadtext = '加载中';
			this.loading = true;
			var self = this;
			this.$u.api
				.getRankList({
					pagesize: 10,
					page: this.cates[this.current].page,
					type: this.cates[this.current].type
				})
				.then(res => {
					if (res.success != 1) {
						return this.$u.toast(res.msg);
					}
					this.cates[this.current].page++;
					if (res.books.length < 1) {
						this.loadtext = '没有了';
						return;
					}
					this.cates[this.current].books = this.cates[this.current].books.concat(res.books);
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
				this.getRank();
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
