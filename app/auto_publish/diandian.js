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

		if(window.location.href.indexOf('diandian.com/home') > -1){
			if(document.referrer.indexOf('www.lovewith.me') > -1){
				window.close();
			}
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

	getQuery: function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	},

	publish: function(){
		var tag = $('#pb-photos-title').val().replace(/^#([^#]*)#.*/, '$1');
		var count = $('#pb-photo-layout a').size();
		var index = Math.round(Math.random() * (count - 1));
		var title = $('#pb-photos-title').val().replace('大图请戳: ', '');
		var lo = this.getQuery('lo');

		var new_title = title.replace(/^#[^#]*#(.*)$/gi, '$1');
		//重设标题
		$('#pb-photos-title').val(new_title);
		
		//随机选择图片布局
		MT.doClick($('#pb-photo-layout a').eq(index));

		//切换到html编辑模式
		MT.doClick($('#edui40_body'));

		setTimeout(function(){
			$('#baidu_editor_0').next().val(title +'<p>来源：婚礼时光 - '+ tag +' <a href="'+ lo +'" target="_blank">'+ lo +'</a></p>');

			//添加tag
			$('#post-tag-list').append('<li tag="'+ tag +'"><span>'+ tag +'</span></li>');

			//发布
			setTimeout(function(){
				MT.doClick($('#ctrlbuttonpb-submittext'));
			}, 2000);
		}, 2000);
	}
};


chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	var account = data.account.diandian;

	(function(){
		var sc = document.createElement('script')
		sc.src = 'http://etosun.com/html/mt-tools/alert.js?t=1125';
		$('body').append(sc);
	})();

	setTimeout(function(){
		new Diandian().init({
			username: account['username'],
			password: account['password']
		});
	}, 5 * 1000)
});
