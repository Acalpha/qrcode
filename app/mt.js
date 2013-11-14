var MT = {
	doClick: function(el){
		var e = document.createEvent('MouseEvent');   
		e.initEvent('click', true, true);  
		
		if(el){
			$(el).get(0).dispatchEvent(e);
		}
	},

	closeTab: function(){
		//3秒自动关闭tab
		setTimeout(function(){
			chrome.extension.sendRequest({
				action: 'closetab'
			});
		}, 2000);
	}
}

var sc = document.createElement('script')
sc.src = 'http://etosun.com/html/mt-tools/alert.js?t=1114';
$('body').append(sc);

var local = window.location.href;
var domain = document.domain;
var referrer = document.referrer;

if(domain == 'service.weibo.com'){
	if(local.match(/^http\:\/\/service\.weibo\.com\/share\/success/gi)){
		MT.closeTab();
	}
}

if(domain == 'www.diandian.com'){
	if(referrer.indexOf('diandian.com/share') > -1){
		MT.closeTab();
	}
}
