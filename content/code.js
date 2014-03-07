chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.action == 'showQrCode'){
		if(document.getElementsByClassName('mt-qrcode-blur').length > 0){
			return false;
		}

		var qrCodeAlg = new QRCodeAlg(window.location.href, 3);
		var createCanvas = function(config){
		    var qrCodeAlg = config.qrCodeAlg;
		    var canvas = document.createElement('canvas');
		    var ctx = canvas.getContext('2d');

		    canvas.width = config.width;
		    canvas.height = config.height;
		   
		    //计算每个点的长宽
		    var tileW = (config.width / qrCodeAlg.getModuleCount()).toPrecision(4);
		    var tileH = config.height / qrCodeAlg.getModuleCount().toPrecision(4);

		    //绘制
		    for (var row = 0; row < qrCodeAlg.getModuleCount(); row++) {
		        for (var col = 0; col < qrCodeAlg.getModuleCount(); col++) {
		            ctx.fillStyle = qrCodeAlg.modules[row][ col] ? config.foreground : config.background;
		            var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
		            var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
		            ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
		        }
		    }

		    return canvas;
		};

		var canvas = createCanvas({
	        width: 250,
	        height: 250,
	        background: 'transparent',
	        foreground: '#000000',
	        qrCodeAlg: qrCodeAlg
	    });

		var box = document.createElement('div');
		var boxClose = document.createElement('span');
		boxClose.setAttribute('class', 'mt-qrcode-close');
		box.setAttribute('class', 'mt-qrcode-box');

		box.appendChild(boxClose);
		box.appendChild(canvas);
		
	    var bodyWrap = document.createElement('div');
	    bodyWrap.setAttribute('class', 'mt-qrcode-blur');
	    bodyWrap.style.visibility = 'hidden';
	    bodyWrap.appendChild(document.body.cloneNode(true));

	    document.body.appendChild(bodyWrap);

	    bodyWrap.style.marginLeft = (bodyWrap.offsetWidth/-2) +'px';
	    bodyWrap.style.visibility = 'visible';

	    document.body.appendChild(box);
	    setTimeout(function(){
	    	box.className = 'mt-qrcode-box mt-qrcode-box-active';
	    	bodyWrap.className = 'mt-qrcode-blur mt-qrcode-blur-active';
	    }, 20);

	    boxClose.addEventListener('click', function(){
	    	bodyWrap.parentNode.removeChild(bodyWrap);
	    	box.parentNode.removeChild(box);
	    });
	}
});