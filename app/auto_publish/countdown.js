//倒计时
var CountDown = function(){
	this.cache = {
		now: null,
		datetime: null,
		step: null,
		hn: $('#date .d-hour'),
		mn: $('#date .d-minutes'),
		sn: $('#date .d-second'),
		lastIndex: null
	}
}

CountDown.prototype = {
	render: function(data){
		var self = this;
		var cache = self.cache;

		cache.now = new Date().getTime();
		cache.datetime = data.datetime;
		cache.step = data.step;

		self.fillDom();
	},

	//显示倒计时
	fillDom: function(){
		var self = this;
		var cache = self.cache;
		var now = new Date(cache.now + 1000);
		var diff = parseInt((now.getTime() - cache.datetime)/60000, 10);

		cache.hn.html(now.getHours());
		cache.mn.html(now.getMinutes());
		cache.sn.html(now.getSeconds());

		if(now.getMinutes() == 15 && now.getSeconds() == 15){
			window.location.reload();
		}

		console.log(diff+"|"+cache.step+"|"+cache.lastIndex);

		if(now.getHours() > 6 && now.getHours() < 24){
			if(diff%cache.step == 0 && cache.lastIndex != diff){
				var target = $('#ul-wait-main a').eq(0);
				
				if(target.size() > 0){
					var oldLink = target.attr('href');
					
					cache.lastIndex = diff;
					target.attr('href', oldLink +'#auto_publish');
					//打开
					MT.doClick(target);

					$('#ul-his-main').append('<li><a href="'+ oldLink +'" target="_blank">'+ oldLink +'</a></li>')

					MT.doClick(target.next());
				}
			}
		}

		clearTimeout(cache.timer);
		cache.timer = setTimeout(function(){
			cache.now = now.getTime();
			self.fillDom();
		}, 1000);
	}
}



chrome.extension.sendRequest({
	type: 'account',
	action: 'get'
}, function(data){
	console.log(data);
	new CountDown().render({
		datetime: data.datetime,
		step: data.step
	});
});
