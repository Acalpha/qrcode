var timerTask = function(){
	this.cache = {
		time : new Date().getTime(),
		timer: null,
		storeKey: 'weibo_url',
		hourEl: $('#date .d-hour'),
		minuteEl: $('#date .d-minutes'),
		secondEl: $('#date .d-second'),
		element: $('#ul-wait-main'),
		lastSendTime: ''
	}
}
timerTask.prototype = {
	render: function(){
		var self = this;
		var cache = self.cache;

		//添加到带发布列表
		$('#btn-add').bind('click', function(){
			var urls = $.trim($('#add-box').val());

			if(urls != ''){
				self._addToList({
					urls: urls.split('\n'),
					store: true
				});
				$('#add-box').val('');
			}
		});

		$('#btn-clean-done').click(function(){
			window.localStorage.setItem(cache.storeKey + '_history', '');
			$('#ul-his-main').html('')
		});



		cache.element.on('click', 'span', function(e){
			$(this).parent().remove();
			self._removeStore($(this).prev('a').html());
		});

		self._restoreURL();
		self._showHistory();

		console.log('-->render');
		self._updateTime();
	},

	/*
	 * obj.urls
	 * obj.store true|false
	 */
	_addToList: function(obj){
		var self = this;
		var cache = this.cache;

		$.each(obj.urls, function(i, url){
			if(!self._isExist(url)){
				cache.element.append(
					'<li><a href="'+ url +'" target="_blank">'+ url +'</a>'+
					'<span>x</span></li>'
				);

				if(obj.store){
					self._addToStore(url);
				}
			}
		})
	},

	//判断url是否已经添加
	_isExist: function(url){
		var cache = this.cache;
		var isExist = false;
		var target = null;

		cache.element.find('a').each(function(){
			var text = $(this).html();
			if(text == url){
				target = $(this).parent();
				isExist = true;
			}
		});

		if(target){
			this._blink(target);
		}
		return isExist;
	},

	_blink: function(el){
		var self = this;
		var cache = self.cache;

		el.css('background', '#d5d5d5');
		setTimeout(function(){
			el.css('background', '#f7f7f9');
		}, 150);
		setTimeout(function(){
			el.css('background', '#d5d5d5');
		}, 300);
		setTimeout(function(){
			el.css('background', '#f7f7f9');
			el.removeAttr('style');
		}, 450);
	},

	//格式化数字（加前导0）
	_formartNum: function(num){
		return (num < 10) ? '0'+ num : num;
	},

	_getTime: function(){
		var cache = this.cache;
		var time = new Date(cache.time);
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var second = time.getSeconds();

		cache.time += 1000;

		return {
			h: this._formartNum(hours),
			m: this._formartNum(minutes),
			s: this._formartNum(second)
		}
	},

	_updateTime: function(){
		var self = this;
		var cache = this.cache;
		var time = self._getTime();

		cache.hourEl.html(time.h);
		cache.minuteEl.html(time.m);
		cache.secondEl.html(time.s);

		clearTimeout(cache.timer);
		cache.timer = setTimeout(function(){
			self._updateTime();
		}, 1000);

		self._validateTime(time.h, time.m, time.s);
	},

	_validateTime: function(h, m, s){
		var cache = this.cache;
		var h = parseInt(h, 10);
		var m = parseInt(m, 10);
		var s = parseInt(s, 10);
		var theSendTime = [h, m, s].join('-');

		//if(s%15 == 0){
		if(h >= 7 && h <= 23 && s == 1){
			if(m == 10){
				window.location.reload(-1);
			}
			if(m != 0 && m%3 == 0){
				if(theSendTime != this.cache.lastSendTime){
		            var el = cache.element.find('a').eq(0);
		            var url = el.attr('href');

		            this.cache.lastSendTime = theSendTime;

		            console.log('lastSend: '+ this.cache.lastSendTime);
		            console.log('theSend: '+ theSendTime);
		        	console.log('---------->start post '+ $.trim($('#date').text().replace(/\s+/gi, ':')));

		           	if(url){
		           		this._saveHistory(url);
		           		this._removeStore(url);
		           		el.parent().remove();

		           		//发布微博
		           		console.log(url);
		           		chrome.extension.sendRequest({
							type: 'publish',
							url: url +'#auto_publish'
						});
		            }
				}
			}
		}

		//固定点刷新页面
		if(s == 1 && m == 50){
			window.location.reload();
		}
	},

	//添加到localstorage
	_addToStore: function(url){
		var cache = this.cache;
		var store = window.localStorage;
		var storeURLs = store.getItem(cache.storeKey);
		var hasExist = true;

		if(!storeURLs){
			storeURLs = url;
		}else if(storeURLs.indexOf(url) == -1){
			storeURLs += '@_@'+ url;
		}

		store.setItem(cache.storeKey, storeURLs);
	},

	//显示历史记录
	_showHistory: function(){
		var cache = this.cache;
		var storeData = window.localStorage.getItem(cache.storeKey + '_history');

		if(storeData && storeData != ''){
			$.each(storeData.split('@_@'), function(i, item){
				$('#ul-his-main').append('<li>'+ item +'</li>')
			});
		}
	},

	//保存历史记录
	_saveHistory: function(url){
		var cache = this.cache;
		var storeData = window.localStorage.getItem(cache.storeKey + '_history');

		if(storeData && storeData != ''){
			storeData = storeData + '@_@' + url;
		}else{
			storeData = url;
		}

		window.localStorage.setItem(cache.storeKey + '_history', storeData);

		$('#ul-his-main').append('<li>'+ url +'</li>')
	},

	//从storage中删除某个url
	_removeStore: function(url){
		var cache = this.cache;
		var storeURLs = window.localStorage.getItem(cache.storeKey);
		var newURLs = [];

		if(storeURLs && storeURLs != ''){
			var urls = storeURLs.split('@_@');

			$.each(urls, function(i, u){
				if(u != url){
					newURLs.push(u);
				}
			});

			window.localStorage.setItem(cache.storeKey, newURLs.join('@_@'));
		}
	},

	//从localStorage中还原url
	_restoreURL: function(){
		var cache = this.cache;
		var storeURLs = window.localStorage.getItem(cache.storeKey);

		if(storeURLs && storeURLs != ''){
			this._addToList({
				urls: storeURLs.split('@_@'),
				store: false
			});
		}
	}
};

console.log('====>load');
new timerTask().render();