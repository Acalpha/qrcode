var shareTo = (function(){
	var ShareTo = function(config){
	}
	ShareTo.prototype = {
		weibo: function(){
			MT.doClick($('.des-tsina a'));
		},

		tqq: function(){
			MT.doClick($('.des-tqq a'));
		},

		diandian: function(){
			MT.doClick($('.des-diandian a'));
		},

		cang: function(){
			MT.doClick($('.des-baidu a'));
		},

		renren: function(){
			$('.des-rrzhan form').submit();
		},

		huaban: function(){
			MT.doClick($('.des-huaban a').submit());
		}
	}

	return new ShareTo();
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
			}, 1* 60 * 1000);
			//腾讯微博
			setTimeout(function(){
				shareTo.tqq();
			}, 2* 60 * 1000);
			//百度收藏
			setTimeout(function(){
				shareTo.cang();
			}, 3* 60 * 1000);
			//人人小站
			setTimeout(function(){
				//shareTo.renren();
			}, 4* 60 * 1000);
			//花瓣
			setTimeout(function(){
				shareTo.huaban();
			}, 5* 60 * 1000);
			//10分钟后关闭窗口
			setTimeout(function(){
				window.close();
			}, 8 * 60 * 1000);
		}
	}
})