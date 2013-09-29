var configData = (function(){
	var config = null;
	//获取数据
	$('script').each(function(){
		var html = $(this).html();
		if(html.indexOf('bds_config') > -1){
			config = html.replace('var bds_config=', '').replace(';', '').replace(/document.*/gi, '');
		}
	});

	return eval('('+ config +')');
})();



var shareTo = (function(){
	var ShareTo = function(config){
		this.config = config;
	}
	ShareTo.prototype = {
		weibo: function(){
			var pic = $('#ds-wb .bdshare_t').eq(0).attr('data');
			var link = [
				'http://service.weibo.com/share/share.php?', 
				'url=', encodeURIComponent(this.config.url),
				'&title=', encodeURIComponent(this.config.bdText),
				'&appkey=2838777972',
				'&pic=', encodeURIComponent(pic.replace('{\'pic\':\'', '').replace('\'}', '')),
				'&ralateUid='+ this.config.wbUid
			];

			window.location.href = link.join('');
		}
	}

	return new ShareTo(configData);
})();

//分享到微博
shareTo.weibo();
