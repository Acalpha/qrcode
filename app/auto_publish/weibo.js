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
				self.selectPic();
			}, 2000);
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
	},

	//依次选择9张图片
	selectPic: function(){
		var self = this;
		var selectCount = 0;
		var target = $('.layer_plain_container');
		
		if(target.size() == 0){
			target = $('#picContain');
		}

		//选中图片
		target.find('img').each(function(i){
			if(i > 0 && i < 9){
				$(this).click();
			}
		});

		//验证图片是否被选中
		target.find('li').each(function(){
			if($(this).hasClass('select_img_added')){
				selectCount++;
			}
		});


		if(target.size() > 9 && selectCount < 9){
			//重新选择
			this.selectPic();
		}else{
			setTimeout(function(){
				//点击发布
				MT.doClick($('#shareIt'));
				//轮询发布状态
				self.checkState();
				
				//2分钟如果还没发布成功就刷新页面
				setTimeout(function(){
					window.location.reload();
				}, 1 * 60 * 1000);
			}, 2000);
		}
	},

	//轮询发布状态
	checkState: function(){
		var self = this;
		var cache = this.cache;
		var process = $('.progress_note')
		var target = $('.layer_mask_exhibit .result_note')
		var msg = target.html();

		//console.log('发布ing');

		if(process.size() > 0 || target.size() > 0){
			var retryEl = target.find('a').eq(0);

			if(msg && msg.indexOf('重试') > -1){
				//console.log('重试');
				MT.doClick(retryEl);
			}

			cache.timer = setTimeout(function(){
				self.checkState();
			}, 3000);
		}
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