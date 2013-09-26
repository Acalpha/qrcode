var weibo = function(data, sendResponse){
	//打开微博的分享页面
	if(data && data.action == 'opentab'){
		var wbTab = chrome.tabs.create({
			url: data.url,
			active: true
		}, function(tab){
			//sendResponse();
		});
	}

	if(data.action == 'closetab'){
		//console.log('关闭tab');
		//chrome.tabs.remove(data.tab.id);
		chrome.tabs.query({currentWindow: true, windowType: 'normal'}, function(tabs){
			for(var i=0,len=tabs.length; i<len; i++){
				if(tabs[i].url.indexOf('weibo.com/share/success.php') > -1){
					chrome.tabs.remove(tabs[i].id);
				}

				if(tabs[i].url.match(/lovewith\.me(\:\d+)?\/share\/detail\/all\/\d+#auto_publish/gi)){
					chrome.tabs.remove(tabs[i].id);
				}
			}
		});
	}
}


chrome.extension.onRequest.addListener(function(data, sender, sendResponse){
	if(data.type == 'sina'){
		weibo(data, sendResponse);
	}

	//存取帐号数据
	var store_key = 'mt_auto_publish_account';
	if(data.type == 'account'){
		if(data.action == 'save'){
			console.log(data.publishData);
			localStorage.setItem(store_key, JSON.stringify(data.publishData));
			sendResponse();
		}

		if(data.action == 'get'){
			var store = localStorage.getItem(store_key);
			var account = JSON.parse(store || '{}');
			console.log(account);
			sendResponse(account);
		}
	}

	//打开目标页面
	if(data.type == 'publish'){
		var mtTab = chrome.tabs.create({
			url: data.url,
			active: true
		}, function(tab){
			//sendResponse();
		});
	}
});



//初次安装自动打开设置界面
if(!localStorage.getItem('mt_auto_publish_firstrun')){
	chrome.tabs.create({url: chrome.extension.getURL('options.html'), active:true});
	localStorage.setItem('mt_auto_publish_firstrun', 1);
}

//点击icon打开设置页面
chrome.browserAction.onClicked.addListener(function(tab) {
	var wbTab = chrome.tabs.create({
		url: 'chrome-extension://dinmpcccgmkhdgpkjpelmgjlleiahedf/options.html',
		active: true
	});
});