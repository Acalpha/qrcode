var Duitang = function(){
	this.cache = {
		comIndex: 0,
		tipTimer: null,
		content: [],
		urls: []
	}
}
Duitang.prototype = {
	init: function(){
		this.createBtn();
		//this.getShortUrl('http://www.duitang.com/category/life/?&a=1');
	},

	//
	createBtn: function(){
		var self = this;
		var button = [
			'<a href="javascript:;" data-action="follow">一键关注</a>',
			'<a href="javascript:;" data-action="comment" title="前50条">批量评论</a>'
		];
		var node = $('<div id="mt-dt-item">'+ button.join('') +'</div>');

		$('body').append(node);

		node.find('a').click(function(){
			var action = $(this).data('action');
			self[action] && self[action]();
		})
	},

	//显示提示
	showTips: function(msg){
		var timer = this.cache.tipTimer;
		var tipEl = $('#chrome-mt-tips');

		clearTimeout(timer);

		if(tipEl.size() == 0){
			tipEl = $('<div id="chrome-mt-tips"></div>');
			$('body').append(tipEl);
		}

		tipEl.show(100).html(msg);
		timer = setTimeout(function(){
			tipEl.hide();
		}, 2500);
	},

	//关注
	follow: function(){
		var followUser = $('.follow');
		var unfollowCount = followUser.size();
		var mgs = '';

		followUser.each(function(){
			MT.doClick($(this));
			$(this).removeClass('follow').addClass('unfollow');
		});

		if(unfollowCount > 0 ){
			msg = '在本页找到'+ unfollowCount +'个用户，已全部关注'
		}else{
			msg = '已全部关注';
		}
		this.showTips(msg);
	},

	//获取短网址
	getShortUrl: function(url, callback){
		var rnd = Math.random(1);
		var params = 'type=t.cn&xzurl='+ encodeURI($.trim(url)) +'&rnd=xz'+ rnd;
		$.get('http://121.199.13.65/web/json.php?'+ params, function(data){
			var targetUrl = '';
			if(data.length > 52){
				targetUrl = url;
			}else{
				targetUrl = data.replace(/[^\:]*\:\"([^\"]*)\"\}\)/gi, '$1')
			}

			callback && callback(targetUrl);
		});
	},

	//刷评论
	comment:function(){
		this.showComBox();
	},

	//显示评论编辑框
	showComBox:function(){
		var self = this;
		var cache = self.cache;
		var old_cont = localStorage.getItem('mt-dt-content');
		var old_urls = localStorage.getItem('mt-dt-urls');
		var html = '<div id="mt-dt-com">'+
						'<textarea placeholder="输入评论内容(一行一条，请保持左右行数统一)"></textarea>'+
						'<textarea placeholder="输入评论网址(一行一个，请保持左右行数统一)"></textarea>'+
						'<p><button id="addComment">批量评论当前页</button><button id="mt-dt-cancel" title="取消不会保存当前输入的数据">取消</button></p>'+
					'</div>';
		$('body').append(html);

		if(old_cont){$('#mt-dt-com textarea').eq(0).val(old_cont.split('@_@').join('\n'))}
		if(old_urls){$('#mt-dt-com textarea').eq(1).val(old_urls.split('@_@').join('\n'))}

		$('#addComment').click(function(){
			var content = $.trim($('#mt-dt-com textarea').eq(0).val());
			var urls = $.trim($('#mt-dt-com textarea').eq(1).val());

			if(content != '' && urls != ''){
				cache.content = content.split('\n');
				cache.urls = urls.split('\n');

				localStorage.setItem('mt-dt-content', cache.content.join('@_@'));
				localStorage.setItem('mt-dt-urls', cache.urls.join('@_@'));

				cache.comIndex = 0;

				$('#mt-dt-com').remove();

				self.addComment();
			}else{
				this.showTips('没有输入内容和url');
			}
		});

		$('#mt-dt-cancel').click(function(){
			$('#mt-dt-com').remove();
		});
	},

	//添加评论
	addComment: function(){
		var self = this;
		var cache = self.cache;
		var target = $('.woo-pcont .woo').eq(cache.comIndex);
		var content = cache.content[cache.comIndex];
		var url = cache.urls[cache.comIndex];

		//节点不存在
		if(target.size() == 0){
			self.showTips('当前页面没有可评论的内容');
			return false;
		}

		//内容或者url为空
		if(!content || !url){
			self.showTips('评论完了');
			return false;
		}

		//点击评论按钮
		MT.doClick(target.find('.collbtn a').eq(2));

		//获取短网址并填充内容
		self.getShortUrl(url, function(shortUrl){
			//填充内容
			target.find('textarea').val(content +' '+ shortUrl);

			setTimeout(function(){
				MT.doClick(target.find('textarea').parent().next());
				//发布下一条
				cache.comIndex++;
				self.addComment();
			}, 1000);
		})
	}
}

new Duitang().init();