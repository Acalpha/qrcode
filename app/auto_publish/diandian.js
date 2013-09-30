//同步到点点
var Diandian = function(){
	this.cache = {
		username: null,
		password: null
	}
}
Diandian.prototype = {
	init: function(obj){
		var cache = this.cache;
		
		cache.username = obj.username;
		cache.password = obj.password;

		if(window.location.href.match(/^http:\/\/www\.diandian\.com\/login/gi)){
			this.login();
		}
		
		if(window.location.href.indexOf('diandian.com/share?lo=') > -1){
			this.publish();
		}
	},

	login: function(){
		var cache = this.cache;

		$('#login-form input').each(function(){
			if($(this).attr('name') == 'account'){
				$(this).val(cache.username);
			}

			if($(this).attr('name') == 'password'){
				$(this).val(cache.password);
			}
		});

		MT.doClick($('#login-form .input-button'));
	},

	publish: function(){
		var tag = $('#pb-photos-title').val().replace(/^#([^#]*)#.*/, '$1');
		var count = $('#pb-photo-layout a').size();
		var index = Math.round(Math.random() * (count - 1));

		//随机选择图片布局
		MT.doClick($('#pb-photo-layout a').eq(index));

		//添加tag
		$('#post-tag-list').append('<li tag="'+ tag +'"><span>'+ tag +'</span></li>');

		//发布
		MT.doClick($('#ctrlbuttonpb-submittext'));
	}
};

chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	var account = data.account.diandian;

	setTimeout(function(){
		new Diandian().init({
			username: account['username'],
			password: account['password']
		});
	}, 5 * 1000)
});