// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数

	// 此处使用了传入的params参数，一切自定义即可
	let getHot = (params = {}) => vm.$u.post('/app/books/getHot', params);
	let getNewest = (params = {}) => vm.$u.post('/app/books/getNewest', params);
	let getDetail = (params = {}) => vm.$u.post('/app/books/detail', params);

	let getBanners = (params = {}) => vm.$u.post('/app/cates/getBanners', params);
	const db = uniCloud.database();
	let getList =  (params = {}) =>  db.collection('cates').get({
      getCount:true
    });
 //	let getList = (params = {}) => vm.$u.post('/app/cates/getList', params);
	//let getBookList = (params = {}) => vm.$u.post('/app/cates/getBookList', params);
	//.where('sortid == "params.sortid"')
	let getBookList =  (params = {}) =>  db.collection('chapters').where('sortid == '+params.sortid).skip((params.page-1)*params.pagesize+params.pagesize).limit(params.pagesize).get({
	    getCount:true
	  });
	let getRankList = (params = {}) => vm.$u.post('/app/books/getRankList', params);

	let getMuluList = (params = {}) => vm.$u.post('/app/chapters/getList', params);
	let getText = (params = {}) => vm.$u.post('/app/chapters/detail', params);

	let getSearch = (params = {}) => vm.$u.post('/app/books/search', params);


	vm.$u.api = {
		getHot,
		getNewest,
		getBanners,
		getList,
		getBookList,
		getRankList,
		getDetail,
		getMuluList,
		getText,
		getSearch
	};
}

export default {
	install
}
