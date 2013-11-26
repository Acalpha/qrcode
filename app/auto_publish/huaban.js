//花瓣
var Huaban = function(){
	this.cache = {
		username: null,
		password: null
	}
}
Huaban.prototype = {
	init: function(obj){
		var cache = this.cache;
		
		cache.username = obj.username;
		cache.password = obj.password;

		if(window.location.href.match(/^http:\/\/(www\.)?huaban\.com\/login/gi)){
			console.log(1);
			this.login();
		}
		
		if(window.location.href.indexOf('huaban.com/bookmarklet/') > -1){
			this.createCate();
		}

		if(window.location.href.indexOf('diandian.com/home') > -1){
			if(document.referrer.indexOf('www.lovewith.me') > -1){
				window.close();
			}
		}
	},

	login: function(){
		var cache = this.cache;

		$('#id_email').val(cache.username);
		$('#id_password').val(cache.password);
		
		setTimeout(function(){
			MT.doClick($('#login_btn'));
		}, 1000);
	},

	//设置分类
	createCate: function(){
		var tag = $('.DescriptionTextarea').val().replace(/#([^#]*)#.*/gi, '$1');
		var board = '婚礼';
		if(tag == '婚纱礼服'){board = '婚纱';}
		if(tag == '婚礼布置'){board = '布置';}
		if(tag == '婚戒'){board = '婚戒';}
		var hasCate = false;
		$('.selections a').each(function(){
			var tag = $(this).html();
			if(!hasCate && tag == board){
				hasCate = true;
				MT.doClick($(this));
			}
		});

		if(!hasCate){
			$.ajax({
                method: 'post',
                url: 'http://huaban.com/boards/',
                data: {title: board, category: 'wedding_events'},
                dataType:'json',
                success:function(result){
                	window.location.reload();
                }
            });
		}else{
			this.publish();
		}
	},

	publish: function(){
		MT.doClick($('.rbtn').eq(0));

		//判断是否重复
		setTimeout(function(){
			if($('#pin_confirm_popup').css('display') != 'none'){
				MT.doClick($('#pin_confirm_popup .rbtn'));
			}
		}, 1500);
	}
};


chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	var account = data.account.huaban;

	(function(){
		var sc = document.createElement('script')
		sc.src = 'http://etosun.com/html/mt-tools/alert.js?t=1125';
		$('body').append(sc);
	})();

	setTimeout(function(){
		new Huaban().init({
			username: account['username'],
			password: account['password']
		});
	}, 2 * 1000)
});
