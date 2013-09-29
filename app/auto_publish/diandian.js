//同步到点点
var diandian = (function(){
	var Diandian = function(){
		this.cache = {
			title: $.trim($('h1').html()),
			element: $('#share li'),
			desc: $('.det-cont').html()
		}
	}
	Diandian.prototype = {
		render: function(){
			var self = this;
			var images = [];
			var element = self.cache.element;

			element.each(function(i){
				var path = $(this).find('img').attr('src');
				
				if(path.indexOf('blank.gif') > -1){
					path = $(this).find('img').data('src');
				}

				//最多只允许20张图片
				if(i < 20){
					images.push('src['+ i +']='+ self.switchCover(path));
				}
			});

			self.openTab({
				title: self.cache.title,
				desc: self.cache.desc,
				images: images
			});
		},


		openTab: function(data){
			//console.log(data);
			chrome.extension.sendRequest(data, function(response) {
				//console.log(response);
			});
		},

		/* 切换小图到封面 */
		switchCover: function(image){
			if(image.indexOf('.jpg!') > -1){
				return image.replace('!240', '!650');
			}else{
				return image.replace('_240x999.jpg', '_650x999.jpg');
			}
		}
	};

	return new Diandian();
})();