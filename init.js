$(window).load(function(){
    var element = null;
    var tipsEl = null;
    var topicKey = 'topic_home';
    var tagKey = 'topic_home_tag';
    
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
    var showTips = function(msg){
        tipsEl.html(msg).fadeIn(150);
        setTimeout(function(){
            tipsEl.fadeOut(100);
        }, 2000);
    };

    //存储
    var store = {
        get: function(key){
            var data = window.localStorage.getItem(key);

            return data ? JSON.parse(data) : null;
        },

        set: function(key, data){
            var data = JSON.stringify(data)
            window.localStorage.setItem(key, data);
        },

        add: function(key, saveData){
            var newData = [];
            var data = store.get(key) || [];

            if(data instanceof Array){
                if(saveData instanceof Array){
                    newData = data.concat(saveData);
                    store.set(key, newData);
                }else{
                    data.push(saveData);
                    store.set(key, data);
                }
            }
        },

        clear: function(key){
            store.set(key, '');
        }
    }

    //入口
    var render = function(){
        tipsEl = $('<div id="chrome-mt-tips"></div>');
        element = $(
            '<div data-fold="1" id="chrome-mt-extend" class="mt-extend">'+
                '<h5>首页精选</h5>'+
                '<ul class="mt-imgbox"></ul>'+
                '<div class="mt-titlebox"><input id="mt-title" type="text" name="title" placeholder="标题" value="" /></div>'+
                '<ul class="mt-tagbox">'+
                    '<li>'+
                        '<input class="mt-tag" type="text" name="tag" placeholder="关键词" value="">'+
                        '<input class="mt-link" type="text" name="link" placeholder="链接" value="">'+
                        '<a class="mt-tag-btn mt-tag-add" title="添加" href="javascript:;">+</a>'+
                    '</li>'+
                '</ul>'+
                '<div class="mt-btn-box">'+
                    '<input class="mt-btn mt-btn-sm" type="button" value="提交" />'+
                    '<input class="mt-btn mt-btn-clear" type="button" value="清空" />'+
                '</div>'+
            '</div>'
        );

        $('body').append(element).append(tipsEl);

        bind();

        addTopicNode(store.get(topicKey) || []);
        addTagNode(store.get(tagKey) || []);
    };

    //绑定事件
    var bind = function(){
        $('#d-main img').dblclick(function(){
            var img = $(this).attr('src').replace('!650', '!100');

            if(img.indexOf('_650x999') > -1){
                showTips('历史帖子不能推荐到首页~');
                return false;
            }

            if($(this).height() < 240 || $(this).width() < 240){
                showTips('图片尺寸不足240x240，不能推荐到首页');
            }else{
                saveTopicData({
                    mid: $(this).data('mid'),
                    img: img
                });
            }
        });

        element.find('h5').click(function(e){
            if(element.data('fold') == 1){
                element.animate({right: 0}, 250, function(){
                    element.data('fold', 0); 
                });
            }else{
                element.animate({right: -342}, 250, function(){
                    element.data('fold', 1); 
                })
            }

            e.stopPropagation();
        }).end()
        .find('.mt-tag-add').click(function(){
            //添加标签
            var target = $(this).parent();

            target.before(
                '<li>'+
                    '<input class="mt-tag" type="text" name="tag" placeholder="关键词" value="">'+
                    '<input class="mt-link" type="text" name="link" placeholder="链接" value="">'+
                    '<a class="mt-tag-btn mt-tag-del" title="删除" href="javascript:;">x</a>'+
                '</li>'
            );
        }).end()
        .find('.mt-btn-clear').click(function(){
            //清空
            store.clear(topicKey);
            store.clear(tagKey);

            element.find('.mt-imgbox').html('');
            element.find('.mt-tag-data').remove();
        }).end()
        .find('.mt-btn-sm').click(function(){
            validateData();
        });

        //删除tag
        element.on('click', '.mt-tag-del', function(e){
            $(this).parent('li').remove();
            e.stopPropagation();
        });

        //删除图片
        element.on('click', '.mt-extend-del', function(e){
            $(this).parent('li').remove();
            e.stopPropagation();
        });

        //移动
        element.on('click', '.mt-extend-page', function(e){
            var el = $(this).parent('li');
            var target = null;

            if($(this).hasClass('mt-extend-prev')){
                console.log('prev');
                target = el.prev();
                target.before(el);
            }else{
                console.log('next');
                target = el.next();
                target.after(el);
            }
        });
    };

    //添加图片节点
    var addTopicNode = function(topicData){
        $.each(topicData, function(i, data){
            element.find('.mt-imgbox').append(
                '<li data-mid="'+ data.mid +'" class="mt-extend-img">'+
                    '<img src="'+ data.img +'" height="70" />'+
                    '<span class="mt-extend-page mt-extend-prev" title="上移">←</span>'+
                    '<span class="mt-extend-page mt-extend-next" title="下移">→</span>'+
                    '<a class="mt-extend-del" href="javascript:;" title="删除">x</a>'+
                '</li>'
            );
        });

        if(element.find('.mt-extend-img').size() > 0 && element.data('fold') == 1){
            element.find('h5').click();
        }
    };

    //添加标签节点
    var addTagNode = function(tagData){
        var target = element.find('.mt-tag-add').parent();

        $.each(tagData, function(i, tag){
            target.before(
                '<li class="mt-tag-data">'+
                    '<input class="mt-tag" type="text" name="tag" placeholder="关键词" title="'+ tag +'" value="'+ tag +'">'+
                    '<input class="mt-link" type="text" name="link" placeholder="链接" value="/share/search/tag/'+ tag +'">'+
                    '<a class="mt-tag-btn mt-tag-del" title="删除" href="javascript:;">x</a>'+
                '</li>'
            );
        });
    };

    //保存数据
    var saveTopicData = function(obj){
        var tagData = store.get(tagKey) || [];
        var topicData = store.get(topicKey) || [];
        var midExist = false;
        var newTag = [];

        //获取图片tag
        $.getJSON('/ajax/g/image/'+ obj.mid, function(imgData){
            //判断是否重复
            $.each(topicData, function(i, data){
                if(data.mid == obj.mid){
                    midExist = true;
                }
            });

            $.each(imgData.tags, function(i, tag){
                if(tagData.indexOf(tag) < 0){
                    newTag.push(tag);
                }
            });

            if(!midExist){
                store.add(topicKey, obj);
                addTopicNode([obj]);
            }

            if(newTag.length > 0){
                store.add(tagKey, newTag);
                addTagNode(newTag);
            }
        });
    }

    //校验数据
    var validateData = function(){
        var mid = [];
        var title = $('#mt-title').val();
        var content = [];
        var postData = {};

        element.find('.mt-extend-img').each(function(){
            mid.push($(this).data('mid'));
        }).end()
        .find('.mt-tag-data').each(function(){
            var tag = $(this).find('.mt-tag').val();
            var url = $(this).find('.mt-link').val();

            content.push(
                '<a href="', url ,'" target="_blank">', tag ,'</a>'
            )
        });

        if(title == ''){
            showTips('请输入标题');
            return false;
        }

        if(mid.length > 8){
            showTips('图片数量超过8个，请删除 <b>'+ (mid.length -8) +'</b> 个');
            return false;
        }

        postData ={
            title: title,
            content: content.join(''),
            images_ids: mid.join(',')
        }

        $.ajax({
            type: 'POST',
            url: '/ajax/g/add_home_topic/',
            data: postData,
            dataType:'json',
            success:function (result){
                if(!result.error){
                    element.find('.mt-btn-clear').click();
                    element.find('h5').click();
                }
            }
        })
    }

    if(isSign && isAdmin && pageType == 'detail-single'){
        render();
    }
})