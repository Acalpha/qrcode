//同步到微博
var Weibo = function(){
	this.cache = {
		timer: null,
		username: '',
		password: ''
	}
};

Weibo.prototype = {
	init: function(account){
		var self = this;
		var cache = this.cache;

		cache.username = account.username;
		cache.password = account.password;

		$.when(self.checkLoginStat())
		 .done(function(){
		 	if($('.weibo_img').size() > 0){
		 		$('.weibo_img').click();
		 	}

		 	setTimeout(function(){
		 		var sc = document.createElement('script')
		 		sc.src = 'http://etosun.com/html/mt-tools/weibo.js?t=1030';
		 		$('body').append(sc);
			}, 3 * 1000);
		 });
	},

	//登录
	checkLoginStat: function(){
		var cache = this.cache;
		var def = $.Deferred();

		if($('#pl_share_login a').eq(0).attr('action-type') == 'login'){
			$('.WB_dialog .WB_iptxt').each(function(){

				if($(this).attr('type') == 'text'){
					$(this).val(cache.username);
				}
				if($(this).attr('type') == 'password'){
					$(this).val(cache.password);
				}
			});

			setTimeout(function(){
				$('.WB_dialog .WB_btnA span').click();
				def.resolve();
			}, 1000);
		}else{
			setTimeout(function(){
				def.resolve();
			}, 1000);
		}

		return def.promise();
	}
};


chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	var account = data.account.sina;
	new Weibo().init({
		username: account['username'],
		password: account['password']
	});
});
