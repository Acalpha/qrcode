//同步到百度收藏
var Renren = function(){
	this.cache = {
		username: null,
		password: null
	}
}
Renren.prototype = {
	init: function(obj){
		var self = this;
		var cache = self.cache;
		
		cache.username = obj.username;
		cache.password = obj.password;

		if($('.login').size() > 0){
			setTimeout(function(){
				self.login();
			}, 2000);
		}else{
			self.fillTitle();
		}
	},

	login: function(){
		var cache = this.cache;

		$('#email').val(cache.username);
		$('#password').val(cache.password);

		setTimeout(function(){
			MT.doClick($('#login-btn'));
		}, 2000);
	},

	fillTitle: function(){
		var content = $('.photo-desc').eq(0).val()
		var title = content.split('大图请戳');
		var topic = content.replace(/#([^#]*)#.*/gi, '$1');

		$('.title-wrap input').val(title[0]);
		$('.tag-input').val(topic);

		setTimeout(function(){
			MT.doClick($('.btn-finish'));
		}, 2000);

		//10s后关闭窗口
		setTimeout(function(){
			window.close();
		}, 10 * 1000)
	}
};

$(window).load(function(){
	chrome.extension.sendRequest({
		type: 'account',
		action: 'get'
	}, function(data){
		var account = data.account.renren;

		setTimeout(function(){
			new Renren().init({
				username: account['username'],
				password: account['password']
			});
		}, 8 * 1000);
	});
})