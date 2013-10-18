var configData = (function(){
	var picData = [];
	var pic = $('#ds-wb .bdshare_t').eq(0).attr('data').replace('{\'pic\':\'', '').replace('\'}', '');
	var config = null;
	var configData = null;

	//获取数据
	$('script').each(function(){
		var html = $(this).html();
		if(html.indexOf('bds_config') > -1){
			config = html.replace('var bds_config=', '').replace(';', '').replace(/document.*/gi, '');
		}
	});

	configData = eval('('+ config +')');

	if(pic.indexOf('||')){
		picData = pic.split('||');
	}else{
		picData.push(pic);
	}

	configData.pic = picData;

	return configData;
})();


var shareTo = (function(){
	var ShareTo = function(config){
		this.config = config;
	}
	ShareTo.prototype = {
		weibo: function(){
			console.log(1);
			MT.doClick($('.des-tsina a'));
		},

		tqq: function(){
			MT.doClick($('.des-tqq a'));
		},

		diandian: function(){
			MT.doClick($('.des-diandian a'));
		},

		cang: function(){
			var link = [
				'http://cang.baidu.com/do/add?iu=', encodeURIComponent(this.config.url),
				'&it=', encodeURIComponent(this.config.bdText)
			];

			window.open(link.join(''));
		},

		renren: function(){
			$('.des-rrzhan form').submit();
		}
	}

	return new ShareTo(configData);
})();


$(window).load(function(){
	if(document.referrer.indexOf('cang.baidu.com') > -1){
		window.close();
	}else{
		if(window.location.href.indexOf('#auto_publish') > -1){
			//微博
			shareTo.weibo();
			//点点
			setTimeout(function(){
				shareTo.diandian();
			}, 2* 60 * 1000);
			//腾讯微博
			setTimeout(function(){
				shareTo.tqq();
			}, 4* 60 * 1000);
			//百度收藏
			setTimeout(function(){
				shareTo.cang();
			}, 6* 60 * 1000);

			//人人小站
			setTimeout(function(){
				shareTo.renren();
			}, 8* 60 * 1000);

			//15分钟后关闭窗口
			setTimeout(function(){
				window.close();
			}, 15 * 60 * 1000);
		}
	}
})