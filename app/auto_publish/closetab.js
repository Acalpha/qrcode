//3秒自动关闭tab
setTimeout(function(){
	chrome.extension.sendRequest({
		action: 'closetab'
	});
}, 3000);