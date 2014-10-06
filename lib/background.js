//接收消息
var series = {};
var appUid = 19851129;
/**
 * @param obj.url {string}
 * @param obj.data {object}
 * @param obj.success {function}
 * @param obj.error {function}
 * @return {string}
 */
var PostData = function(obj){
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', obj.url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttp.onreadystatechange = function(){
        if (xmlHttp.readyState == 4){
            if(xmlHttp.status == 200){
                var data = JSON.parse(xmlHttp.responseText);
                obj.success && obj.success(data);
            }else{
                obj.error.call();
            }
        }
    }
    xmlHttp.send('data='+ JSON.stringify(obj.data) +'&app_uid='+ appUid);
}



chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
    if(msg.action == 'getSeriesData'){
        if(msg.data && msg.data.item.length > 0){
            //显示订阅icon
            series[sender.tab.id] = msg.data;
            chrome.pageAction.show(sender.tab.id);
        }
    }
});

//点击订阅图标后发送数据到服务器
chrome.pageAction.onClicked.addListener(function(tab){
    //提示登录
    if(!appUid){
        //chrome.extension.getURL('options.html')
        chrome.tabs.create({url: 'http://hunting.sinaapp.com/account/login/'});
    }else{
        //显示popup页面
        chrome.pageAction.setPopup({
            tabId: tab.id,
            popup: 'popup.html'
        })
        chrome.tabs.sendMessage(tab.id, {action: 'getTvData'}, function(response){
            if(response && response.item.length > 0){
                new PostData({
                    url: 'http://hunting.sinaapp.com:8080/subscribe/extend/add/',
                    data: response,
                    success: function(data){
                        console.log(data);
                    }
                }) 
            }
        });
    }
});