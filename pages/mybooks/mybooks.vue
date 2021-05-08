<template>
	<view class="main">
		<u-navbar :is-back="false" title="我的书架">
			<view class="right u-padding-right-15" slot="right" @click="showact"><u-icon name="list" color="#000" size="38"></u-icon></view>
		</u-navbar>
		<scroll-view scroll-y v-if="mybooks.length">
			<u-swipe-action class="enabled_left_move" :show="item.show" :index="index" v-for="(item, index) in mybooks" :key="item.articleid" @click="click" :options="options">
				<navigator v-if="!item.source || item.source != 'local'" :url="'/pages/read/read?id=' + item.articleid" class="book">
					<image class="cover" :src="item.cover"></image>
					<view class="book_info">
						<text class="title">{{ item.articlename }}</text>
						<text class="author">已读{{ item.progress ? item.progress : '0.00' }}% | 作者：{{ item.author }} | 类别：{{ item.cate.cate_name }}</text>
						<text class="intro u-tips-color">简介：{{ item.intro.replace(/[\s|\*|\.|·\-\——]*/g,'') }}</text>
						<view class="subject" v-if="item.end && item.end.chaptername">
							最新:{{ item.end.chaptername }}
						</view>
					</view>
				</navigator>
				<navigator v-else :url="'/pages/read/localread?id=' + item.articleid" class="book">
					<image src="@/static/imgs/book_detail.png" mode="aspectFill" class="cover"></image>
					<view class="book_info">
						<text class="title">{{ item.articlename }}</text>
						<text class="author">已读{{ item.progress ? item.progress : '0.00' }}%</text>
						<text class="intro u-tips-color">简介：{{ item.intro }}</text>
						<view class="subject" v-if="item.end && item.end.chaptername">
							最新:{{ item.end.chaptername }}
						</view>
					</view>
				</navigator>
			</u-swipe-action>
		</scroll-view>
		<navigator class="no_book_tips" hover-class="none" url="../category/category" open-type="switchTab" v-else><u-icon name="plus" color="#ddd" size="100"></u-icon></navigator>
		<u-action-sheet :safe-area-inset-bottom="true" @close="hideact" :mask-close-able="false" @click="actfun" :list="menu" v-model="show"></u-action-sheet>
	</view>
</template>

<script>
import MDParserHighlight from '@/js_sdk/cmder-findFile/findFile/findFile.js';

export default {
	data() {
		return {
			no_book_tips: '还没有添加图书,立即去添加',
			mybooks: [],
			mybookids: [],
			localbookids: [], //本地图书id，书名md5
			startX: 0,
			remove_index: -1,
			left: '0rpx',
			bookWidth: 150,
			show: false,
			menu: [
				{
					text: '导入本地图书',
					color: '#2979ff',
					fontSize: 38
				}
			],
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},

	onLoad: function() {
	},
	onShow: function() {
		let hasid = uni.getStorageSync('bookstore');
		let self = this;
		if (!hasid) {
			this.mybookids = [];
			let localbooks = [];
			this.mybooks.forEach(it => {
				if (it.source == 'local') {
					localbooks.push(JSON.parse(JSON.stringify(it)));
				}
			});
			this.mybooks = localbooks;
		} else if (hasid.join('.') != this.mybookids.join('.')) {
			// 有变化
			this.mybookids = hasid;
			hasid.forEach(it => {
				uni.getStorage({
					key: 'bookstore-' + it,
					success: function(res) {
						if (res.data && !self.inmybooks(res.data.articleid)) {
							// 只有当hasid中对应图书不在 this.mybooks中才压入
							self.mybooks.push(res.data);
						}
					}
				});
			});
			// 当前图书不存在与 hasid中，需要删除
			for (let i = 0, len = this.mybooks.length; i < len; i++) {
				if (this.mybooks[i].source == 'local') {
					continue;
				}
				let pos = hasid.indexOf(this.mybooks[i]['articleid']);
				if (pos === -1) {
					this.mybooks.splice(pos, 1);
				}
			}
		}
		setInterval(() => {
			this.getlocalbooks();
		}, 1500);
		plus.navigator.setFullscreen(false);
	},
	methods: {
		click(index) {
			let b = this.mybooks[index] 
			let book_id=b.articleid;
			let source=b.source
			var self = this;
			uni.showModal({
				title: '是否移出书架？',
				content: '将会删除该书的阅读记录',
				success: res => {
					if (res.confirm) {
						this.mybooks.splice(index, 1);
						// 先从 mybooks 里删掉该书
						for (let i = 0, len = self.mybooks.length; i < len; i++) {
							if (self.mybooks[i].articleid == book_id) {
								self.mybooks.splice(i, 1);
								break;
							}
						}

						// 本地图书
						if (source == 'local') {
							let hasid = JSON.parse(plus.storage.getItem('localbookstore'));
							if (!hasid) {
								// 当前是删除，直接返回
								this.localbookids = [];
								return;
							}

							let pos = hasid.indexOf(book_id);
							// 当前删除
							if (pos > -1) {
								hasid.splice(pos, 1);
								plus.storage.setItem('localbookstore', JSON.stringify(hasid));
								plus.storage.removeItem('localbookstore-' + book_id);
								this.localbookids = hasid;
							}
							return;
						}

						// 网络图书
						let hasid = uni.getStorageSync('bookstore');
						let pos = hasid.indexOf(parseInt(book_id));
						// 当前删除
						if (pos > -1) {
							hasid.splice(pos, 1);
							uni.setStorageSync('bookstore', hasid);
							this.mybookids = hasid;
						}
					} else if (res.cancel) {
					}
				}
			});
		},
		getlocalbooks() {
			let localhasid = plus.storage.getItem('localbookstore');
			if (!localhasid) {
				return;
			}
			localhasid = JSON.parse(localhasid);
			if (JSON.stringify(localhasid) == JSON.stringify(this.localbookids) && this.localbookids.length > 0) {
				return;
			}
			localhasid.forEach(it => {
				let tmp = plus.storage.getItem('localbookstore-' + it);
				if (tmp && this.localbookids.indexOf(it) === -1) {
					tmp = JSON.parse(tmp);
					tmp['source'] = 'local';
					this.mybooks.push(tmp);
					console.log('hasid==', tmp);
					this.localbookids.push(it);
				}
			});
		},
		showact() {
			uni.hideTabBar();
			this.show = true;
		},
		hideact() {
			this.show = false;
			setTimeout(() => {
				uni.showTabBar();
			}, 300);
		},
		actfun(e) {
			console.log(e);
			this.hideact();
			if (e === 0) {
				plus.webview.open('/hybrid/html/upload.html');
			}
		},
		inmybooks(id) {
			for (let i = 0, len = this.mybooks.length; i < len; i++) {
				if (id == this.mybooks[i]['articleid']) {
					return true;
				}
			}
			return false;
		},
		goupload() {
			uni.showTabBar();
			plus.webview.open('/hybrid/html/upload.html');
		}
	}
};
</script>
<style>
.no_book_tips {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 600rpx;

	line-height: 600rpx;
	color: #888;
}
.enabled_left_move {
	position: relative;
}
.book .cover {
	box-shadow: none;
}
.book_info{
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
}
.book .subject{
	word-wrap: break-word;
	white-space: nowrap;
	width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
