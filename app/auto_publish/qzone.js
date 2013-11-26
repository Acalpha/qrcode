//同步到QQ空间&&朋友网
var Qzone = function(){
	this.cache = {
		username: null,
		password: null
	}
}
Qzone.prototype = {
	init: function(obj){
		var self = this;
		var cache = self.cache;
		
		cache.username = obj.username;
		cache.password = obj.password;

		if($('#changeAccounts').html() == '登录'){
			MT.doClick($('#changeAccounts'));

			setTimeout(function(){
				self.login();
			}, 2000);
		}else{
			//勾选同步到微博
			MT.doClick($('#web_weibo'));

			//点击分享
			setTimeout(function(){
				MT.doClick($('#postButton'));
			}, 2000)
		}
	},

	login: function(){
		var cache = this.cache;
		var doc = $("#loginFrame").contents();

		MT.doClick(doc.find('#switch a'));

		setTimeout(function(){
			doc.find('#u').val(cache.username);
			doc.find('#p').val(cache.password);

			MT.doClick(doc.find('#login_button'));
		}, 2200);
	}
};


chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	var account = data.account.qq;

	(function(){
		var sc = document.createElement('script')
		sc.src = 'http://etosun.com/html/mt-tools/alert.js?t=1125';
		$('body').append(sc);
	})();

	setTimeout(function(){
		new Qzone().init({
			username: account['username'],
			password: account['password']
		});
	}, 2 * 1000)
});
