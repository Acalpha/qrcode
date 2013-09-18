chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	//console.log(sender.tab);
	console.log(request);

	chrome.tabs.create({
		url: 'http://www.diandian.com/share?ti='+ request.title +'&lo='+ sender.tab.url +'&f=1&type=image&'+ request.images.join('&'),
		active: true
	});

	sendResponse({}); // snub them.
});


/*
http://www.diandian.com/share?ti=将各种各样的玻璃瓶悬挂在空中，&lo=http://www.lovewith.me/share/detail/all/28320&f=1&type=image&src[0]=http://i1.etosun.com/share/2013/09/16/9bb33ab160a881dad7af6f1245bb6796.jpg!650&src[1]=http://i1.etosun.com/share/2013/09/16/4e537460d0c10d8b191d413cb1daea89.jpg!240&src[2]=http://i1.etosun.com/share/2013/09/16/932e487693251530e726065fda0a3f5d.jpg!240&src[3]=http://i1.etosun.com/share/2013/09/16/c9af19c45eca3bed2c1fe36aea39c611.jpg!240&src[4]=http://i1.etosun.com/share/2013/09/16/522104151670769bda58309da7aa18a6.jpg!240&src[5]=http://i1.etosun.com/share/2013/09/16/a5edcd9c6bbe97f5ac1978ced73e7677.jpg!240&src[6]=http://i1.etosun.com/share/2013/09/16/63cf6612ca1d5508aa6912383c9e893c.jpg!240&src[7]=http://i1.etosun.com/share/2013/09/16/49f5928768240e293fd9cdf01c98307c.jpg!240&src[8]=http://i1.etosun.com/share/2013/09/16/fb4a1e4ffa1fd790e9f6128161f55c8f.jpg!240


http://www.diandian.com/share?ti=将各种各样的玻璃瓶悬挂在空中，再往玻璃瓶中装上蜡烛或鲜花，都会浪漫的婚礼布置哦~~~&ol=http://www.lovewith.me/share/detail/all/28320&f=1&type=imagesrc[0]=http://i1.etosun.com/share/2013/09/16/9bb33ab160a881dad7af6f1245bb6796.jpg!650&src[1]=http://i1.etosun.com/share/2013/09/16/522104151670769bda58309da7aa18a6.jpg650&src[2]=http://i1.etosun.com/share/2013/09/16/a5edcd9c6bbe97f5ac1978ced73e7677.jpg650&src[3]=http://i1.etosun.com/share/2013/09/16/fb4a1e4ffa1fd790e9f6128161f55c8f.jpg650&src[4]=http://i1.etosun.com/share/2013/09/16/4e537460d0c10d8b191d413cb1daea89.jpg650&src[5]=http://i1.etosun.com/share/2013/09/16/0fe26e51398dfd8f92393cd2cd7849ee.jpg650&src[6]=http://i1.etosun.com/share/2013/09/16/63cf6612ca1d5508aa6912383c9e893c.jpg650&src[7]=http://i1.etosun.com/share/2013/09/16/c9af19c45eca3bed2c1fe36aea39c611.jpg650&src[8]=http://i1.etosun.com/share/2013/09/16/23e758c50da8158839b35d600bf09dfe.jpg650&src[9]=http://i1.etosun.com/share/2013/09/16/5cf58c413d80c9c8715dd523784097bc.jpg650&src[10]=http://i1.etosun.com/share/2013/09/16/49f5928768240e293fd9cdf01c98307c.jpg650&src[11]=http://i1.etosun.com/share/2013/09/16/932e487693251530e726065fda0a3f5d.jpg650&src[12]=http://i1.etosun.com/share/2013/09/16/01dffc88c5408c819f9044744ccc45ea.jpg650&src[13]=http://i1.etosun.com/share/2013/09/16/38d293436f33a1f63dce2f25ee9a1c1c.jpg650&src[14]=http://i1.etosun.com/share/2013/09/16/e2e6f42b7c1942da81479c661b103cd5.jpg650&src[15]=http://i1.etosun.com/share/2013/09/16/1c25bf68c4317f115736670303974cff.jpg650&src[16]=http://i1.etosun.com/share/2013/09/16/8201b30012646ee4e8ee1d4347ef6984.jpg650&src[17]=http://i1.etosun.com/share/2013/09/16/b61082839ab150b85c1ad069fc6e53da.jpg650&src[18]=http://i1.etosun.com/share/2013/09/16/4e5a9c418926cbac623269a70fb00a7e.jpg650
*/