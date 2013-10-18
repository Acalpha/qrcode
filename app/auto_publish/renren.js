//同步到百度收藏
var Renren = function(){
	this.cache = {
		timer: null,
		index: 1,
		maxCount: 20,
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

		if($('.http500').size() > 0){
			console.log(1);
			setTimeout(function(){
				window.location.reload();
			}, 3000)
		}else{
			if($('.login').size() > 0){
				setTimeout(function(){
					self.login();
				}, 2000);
			}else{
				if($('#publisherBox').size() > 0){
					self.checkSubmitButton();
				}else{
					window.close();
				}
			}
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

	//检测图片是否已经加载完成
	checkSubmitButton: function(){
		var self = this;
		var cache = self.cache;

		clearTimeout(cache.timer);

		cache.timer = setTimeout(function(){
			cache.index++;

			if($('.btn-finish').size() == 0){
				if(cache.index > cache.maxCount){
					self.checkSubmitButton();
				}
			}else{
				//删除多余的图片
				$('#photos-sortable .photo-item').each(function(i){
					if(i > 19){
						$(this).remove();
					}
				});

				self.fillTitle();
			}
		}, 1 * 1000);
	},

	fillTitle: function(){
		var content = $('.photo-desc').eq(0).val()
		var title = content.split('大图请戳');
		var topic = content.replace(/#([^#]*)#.*/gi, '$1');
		var tag = [
			'<span class="write-tag-list" data-tag="', topic ,'">', topic,
			'<input type="hidden" name="tag" value="topic">',
			'<a class="tag-close" href="javascript:;" data-order="del"></a></span>'
		]

		$('.title-wrap input').val(title[0]);
		$('.write-tag-box').append(tag.join(''));

		MT.doClick($('.tag-input'));
		MT.doClick($('.explain-tag'));

		setTimeout(function(){
			MT.doClick($('.btn-finish'));

			//10s后关闭窗口
			setTimeout(function(){
				window.close();
			}, 4 * 1000)
		}, 2000);
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