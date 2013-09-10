$(window).load(function(){
    var element = null;
    var tipsEl = null;
    
    //是否登录
    var isSign = (function(){return $('#user-id').size();})();
    
    //是否管理员
    var isAdmin = (function(){return $('#user-admin').size();})();
    
    //页面类型
    var pageType = (function(){
        var el = $('body');
        var type = null;

        if(el.hasClass('home')){
            type = 'home';
        }

        if(el.hasClass('cate')){
            type = 'list';
        }

        if(el.hasClass('detail')){
            type = 'detail-single';
        }

        if(el.hasClass('ext-detail')){
            type = 'detail-full';
        }

        return type;
    })();

    //显示错误信息
    var showTips = function(){
        tipsEl.fadeIn(150);
        setTimeout(function(){
            tipsEl.fadeOut(100);
        }, 2000);
    };

    //入口
    var render = function(){
        tipsEl = $('<div id="chrome-mt-extend-tips">图片尺寸不足240x240，不能推荐到首页</div>');
        element = $(
            '<div id="chrome-mt-extend" class="mt-extend">'+
                '<form><ul></ul></form>'+
                '<div class="rc-btn">'+
                    '<input class="inp-btn inp-sm" type="button" value="提交" />'+
                    '<input class="inp-btn inp-clear" type="button" value="清空" />'+
                '</div>'+
            '</div>'
        );

        $('body').append(element).append(tipsEl);

        bind();
    };

    var bind = function(){
        $('#d-main img').click(function(){
            if($(this).height() < 240 || $(this).width() < 240){
                showTips();
            }else{
                var mid = $(this).data('mid');
                var img = $('#ds-item .active img').attr('src');

                self.set('mid', [{sid: sid, mid: mid, path: img}]);
            }
        });
    }

    if(isSign && isAdmin && pageType == 'detail-single'){
        render();
    }
})