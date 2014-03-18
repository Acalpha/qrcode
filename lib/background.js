//接受消息
chrome.extension.onRequest.addListener(function(data, sender, sendResponse){

});

//监听icon点击事件
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {action: 'showQrCode'}, function(response){
			//console.log(response.farewell);
		});
	});
})