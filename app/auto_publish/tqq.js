//同步到腾讯微博
var Qweibo = function(){
	this.cache = {
		username: null,
		password: null
	}
}
Qweibo.prototype = {
	init: function(obj){
		var self = this;
		var cache = self.cache;
		var loginEl = $('.uinfo a').eq(0);
		
		cache.username = obj.username;
		cache.password = obj.password;

		if(loginEl.html().indexOf('登录') > -1){
			MT.doClick(loginEl);

			setTimeout(function(){
				self.login();
			}, 2000);

			setTimeout(function(){
				window.location.reload();
			}, 5000);
		}else{
			this.selectImage();

			setTimeout(function(){
				MT.doClick($('#subbtn'));
			}, 1500)
		}
	},

	login: function(){
		var cache = this.cache;
		var doc = $("#login_frame").contents();

		MT.doClick(doc.find('#switch_login'));

		setTimeout(function(){
			doc.find('#u').val(cache.username);
			doc.find('#p').val(cache.password);

			MT.doClick(doc.find('#login_button'));
		}, 2200);
	},

	//选中图片
	selectImage: function(){
		$('.slider_inner .image').each(function(i){
			if($(this).size() > 0 && i > 0 && i < 9){
				MT.doClick($(this).find('img'));
			}
		});
	}
};

chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	var account = data.account.qq;

	setTimeout(function(){
		new Qweibo().init({
			username: account['username'],
			password: account['password']
		});
	}, 5 * 1000)
});