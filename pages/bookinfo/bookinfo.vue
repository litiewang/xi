<template>
	<view class="main">
		<u-navbar back-text="返回" title="书籍详情"></u-navbar>
		<view class="book_detail_box">
			<image :src="book_info.cover" lazy-load></image>
			<view class="book_detail">
				<text class="book_title">{{ book_info.articlename }}</text>
				<view class="book_author_title">
					作者：
					<navigator :url="'/pages/searchRes/searchRes?keyword=' + book_info.author" class="book_author">{{ book_info.author }}</navigator>
				</view>
				<text class="book_cate">类别：{{ book_info.cate.cate_name }}</text>
			</view>
		</view>
		<view class="other_box">
			<u-section color="#2979ff" class="title" title="简 介" :right="false"></u-section>
			<view class="other_content" v-if="book_info.intro">{{ book_info.intro }}</view>
			<view class="other_content" v-else>暂无简介</view>
		</view>
		<view class="other_box">
			<u-section color="#2979ff" class="title" title="最新章节" :right="false"></u-section>
			<view class="other_content">
				<view class="book_source" v-if="book_info.end && book_info.end.chaptername" @click="gobookend">
					{{ book_info.end.chaptername }}
					<text class="u-light-color">{{ $u.timeFrom(book_info.end.lastupdate, false) }}更新</text>
				</view>
				<view v-else class="book_source"><text>暂无章节</text></view>
			</view>
		</view>
		<view class="other_box">
			<u-section color="#2979ff" class="title" title="作者其他图书" :right="false"></u-section>
			<view scroll-x>
				<view v-if="authorbooks.length > 0">
					<navigator v-for="(item, index) in authorbooks" :key="index" :url="'/pages/bookinfo/bookinfo?id=' + item.articleid" class="related_book">
						<image :src="item.cover"></image>
						<view class="related_book_title">{{ item.articlename }}</view>
					</navigator>
				</view>
				<view v-else class="u-padding-top-10"><u-empty text="作者暂无其他作品" mode="list"></u-empty></view>
			</view>
		</view>
		<view class="footer1" id="footer">
			<view class="button" :class="hasadd ? 'hasadd' : ''" @tap="addToMybooks">{{ hasadd ? '已在书架' : '加入书架' }}</view>
			<view class="button red" @tap="startRead">开始阅读</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			book_info: {
				cate: {},
				start: {},
				end: {}
			},
			authorbooks: [],
			bookId: 0,
			hasadd: false,
			height: '100%',
			directoryList: []
		};
	},
	onShow() {
		// this.getheight()
	},
	onLoad: function(opt) {
		uni.showLoading({
			title: '加载中...',
			duration: 20000
		});
		var that = this;
		this.bookId = opt.id;
		this.getDirectoryList();
		// 是否存在缓存
		let hasbook = uni.getStorageSync('bookstore-' + this.bookId);
		if (hasbook) {
			this.book_info = hasbook;
		}
		this.$u.api
			.getDetail({
				id: this.bookId
			})
			.then(res => {
				if (res.success != 1) {
					return this.$u.toast(res.msg);
				}
				this.book_info = res.book;
				if (hasbook) {
					this.book_info['lastzj'] = hasbook.lastzj ? hasbook.lastzj : 0;
					this.book_info['progress'] = hasbook.progress ? hasbook.progress : 0;
					this.book_info['lasttime'] = hasbook.lasttime ? hasbook.lasttime : parseInt(new Date().getTime() / 1000);
				}

				uni.setStorage({
					key: 'bookstore-' + this.bookId,
					data: this.book_info
				});
			})
			.catch(err => {
				console.log(err);
			});
		uni.getStorage({
			key: 'bookstore',
			success: res => {
				if (res.data && res.data.indexOf(parseInt(this.bookId)) > -1) {
					this.hasadd = true;
				}
			},
			fail: function(err) {
				console.log(err);
			}
		});
	},

	methods: {
		gobookend() {
			let history = uni.getStorageSync('history');
			if (typeof history !== 'object') {
				history = [];
			}
			let have = false;
			history.forEach(value => {
				if (value.bookId === this.bookId) {
					have = true;
					(value.chapterIndex = this.directoryList.length - 1), (value.progress = 0);
				}
			});
			if (!have) {
				history.push({
					bookId: this.bookId,
					chapterIndex: this.directoryList.length - 1,
					progress: 0
				});
			}
			uni.setStorageSync('history', history);
			this.$u.toast('打开中');
			uni.navigateTo({
				url: '../read/read?id=' + this.bookId
			});
		},
		getheight() {
			let s = uni.getSystemInfoSync();
			this.height = s.screenHeight - 44 - s.statusBarHeight + 'px';
		},
		async getDirectoryList() {
			let mulu = uni.getStorageSync('allmulu:' + this.bookId);
			if (mulu) {
				this.directoryList = mulu;
			}
			await this.$u.api
				.getMuluList({
					articleid: this.bookId
				})
				.then(res => {
					if (res.success != 1) {
						return this.$u.toast(res.msg);
					}
					res.chapters.forEach((it, i) => {
						this.directoryList.push({
							index: i,
							chapter: i + 1,
							name: it.chaptername,
							chapterid: it.chapterid
						});
					});
					uni.setStorage({
						key: 'allmulu:' + this.bookId,
						data: this.directoryList
					});
				})
				.catch(err => {
					console.log(err);
				});
		},
		addToMybooks: function() {
			let self = this;
			self.hasadd = !self.hasadd;
			let hasid = uni.getStorageSync('bookstore');
			if (!hasid && !self.hasadd) {
				// 当前是删除，直接返回
				return;
			}

			let pos = hasid.indexOf(parseInt(self.bookId));
			if (!self.hasadd) {
				// 当前删除
				if (pos > -1) {
					hasid.splice(pos, 1);
					uni.removeStorageSync('bookstore-' + self.bookId);
				}
			} else {
				// 增加
				if (pos === -1) {
					hasid.push(parseInt(self.bookId));
				}
				uni.setStorageSync('bookstore-' + self.bookId, self.book_info);
			}

			uni.setStorageSync('bookstore', hasid);
		},

		startRead: function(event) {
			this.$u.toast('正在打开');
			uni.navigateTo({
				url: '/pages/read/read?id=' + this.bookId,
				success() {}
			});
		}
	}
};
</script>
<style>
.main {
	padding-bottom: 70px;
}

.title {
	padding-left: 10px;
}
.book_detail_box {
	height: 28%;
	display: flex;
}
.book_detail_box image {
	width: 210rpx;
	height: 300rpx;
	margin: 20rpx;
	box-shadow: 0 0 5px #000;
}
.book_detail {
	height: 100%;
}
.book_title {
	font-size: 40rpx;
	font-weight: bold;
	display: block;
	margin: 30rpx 0 15rpx 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.book_author_title {
	font-size: 28rpx;
	margin-bottom: 15rpx;
}
.book_author {
	font-size: 28rpx;
	color: #555;
	display: inline;
}
.book_cate {
	font-size: 28rpx;
	display: block;
	margin-bottom: 15rpx;
}

.other_box {
	margin-top: 20rpx;
}
.other_content {
	padding: 40rpx 25rpx 30rpx 25rpx;
	font-size: 30rpx;
	color: #888;
	line-height: 50rpx;
}

.book_source {
	line-height: 80rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.footer1 {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex !important;
	align-items: center;
	z-index: 99;
	height: 45px;
	border-top: 1px solid #f1f1f1;
	/* box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2); */
}
.footer1 .button {
	width: 50%;
	line-height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #f7f8f9;
	color: #666;
}

.footer1 .button.red {
	background: #fa3534;
	color: #fff;
}

.footer1 .button.hasadd {
	background: #f1f1f1;
	/* color: #fff; */
}

.add_to_mybooks {
	background-color: white;
	color: #008b8b;
}
.added {
	color: #cccccc;
}
.start_read {
	background-color: #008b8b;
	color: white;
}

.related_book {
	margin: 38rpx;
	width: 175rpx;
	display: inline-block;
	font-size: 30rpx;
	color: #888;
	line-height: 50rpx;
}
.related_book image {
	height: 250rpx;
	width: 175rpx;
	box-shadow: 0 0 10px #000;
}
.related_book_title {
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
