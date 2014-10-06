//接收消息
chrome.tabs.query({active:true, windowType:"normal", currentWindow: true}, function(result){
    var tabId = result[0].id;
    chrome.runtime.getBackgroundPage(function(win){
        var seriesData = win['series'][tabId];
        var html = [];

        html.push(
            '<h3>', seriesData.title, '</h3>',
            '<p>共', seriesData.total ,'集，正在观看：第', seriesData.newest ,'集</p>'
        )
        $('.htb-main').html(html.join(''));
    });
});