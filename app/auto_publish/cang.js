//同步到百度收藏
var Cang = function(){
	this.cache = {
		username: null,
		password: null
	}
}
Cang.prototype = {
	init: function(obj){
		var self = this;
		var cache = self.cache;
		
		cache.username = obj.username;
		cache.password = obj.password;

		if($('#errDiv').size() > 0){
			window.close();
		}else{
			if($('#bdpass-login-pop').size() > 0){
				setTimeout(function(){
					self.login();
				}, 2000);
			}else{
				self.subTitle();
			}
		}
	},

	login: function(){
		var cache = this.cache;

		$('#pass_login_username_0').val(cache.username);
		$('#pass_login_password_0').val(cache.password);

		setTimeout(function(){
			MT.doClick($('#pass_login_input_submit_0'));
		}, 2000);
	},

	subTitle: function(){
		var title = $('#InPt999').val();
		var tag = title.replace(/#([^#]*)#.*/gi, '$1')

		$('#InPt999').val(title.substr(0, 34) +'...');
		$('#tn').val(tag);

		MT.doClick($('input[type="button"]').eq(0));
	}
};


chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	console.log(data);
	var account = data.account.baidu;

	setTimeout(function(){
		new Cang().init({
			username: account['username'],
			password: account['password']
		});
	}, 2 * 1000);
});
