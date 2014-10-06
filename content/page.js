var tvData = null;
var getSohoTvData = function(){
    var element = $('#sohuplayer .list_juji');
    var tipsEl = element.parent().find('.juji_tips');
    //剧情名
    var tvTitle = '';
    //剧情列表
    var tvList = [];
    //总集数
    var total = 0;
    //最新集
    var newest = 1;
    //更新信息
    var updateInfo = '';
    //当前播放的集数
    var last = 1;

    //剧情列表
    element.find('li').each(function(i){
        var target = $(this).find('a');

        if(target.find('.tips_yu').size() == 0){
            newest = target.html();

            if(i == 0){
                tvTitle = target.attr('title').replace(/第\d+集/gi, '');
            }
            if(target.parent().hasClass('on')){
                last = newest;
            }

            tvList.push({
                set: newest,
                url: target.attr('href')
            });
        }
    });

    tipsEl.find('span').each(function(){
        //总集数
        var totalStr = $(this).html();

        if(/共\d+集/gi.test(totalStr)){
            total = parseInt(totalStr.replace(/[^\d]/gi, ''), 10);
        }
    }).next('em').each(function(){
        //更新信息
        updateInfo = $(this).html();
    });

    return {
        title: tvTitle,
        item: tvList,
        total: total,
        last: last,
        newest: newest,
        update: updateInfo
    }
}

$(window).load(function(){
    if(document.domain == 'tv.sohu.com'){
        tvData = getSohoTvData();
        console.clear();
        chrome.extension.sendMessage({action: 'getSeriesData', data: tvData}, function(){
            console.log('has send message to background');
        })
    }
});