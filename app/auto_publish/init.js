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
			console.log(this.config);

			var link = [
				'http://service.weibo.com/share/share.php?', 
				'url=', encodeURIComponent(this.config.url),
				'&title=', encodeURIComponent(this.config.bdText),
				'&appkey=2838777972',
				'&pic=', encodeURIComponent(this.config.pic.join('||')),
				'&ralateUid='+ this.config.wbUid
			];

			window.location.href = link.join('');
		}
	}

	return new ShareTo(configData);
})();



/*
if($('#ds-wb').size() > 0){
	var message = {
		type: 'photo',
		info: [],
		title: configData.bdText,
		location: configData.url
	};

	$.each(configData.pic, function(i, image){
		message.info.push({
			img: image,
			alt: ''
		})
	});
	console.log(JSON.stringify(message));

	var html = [
		'<form method="post" action="http://zhan.renren.com/collect/getMessage" target="_blank">',
			'<input type="hidden" name="type" value="photo" />',
			'<textarea style="display:none;" name="message">', JSON.stringify(message) ,'</textarea>',
		'</form>'
	];

	$('#ds-wb .des-renren').html(html.join('')).css('cursor', 'pointer').bind('click', function(){
		$(this).find('form').submit();
	});
}
*/


if(window.location.href.indexOf('#auto_publish') > -1){
	//分享到微博
	shareTo.weibo();
}
