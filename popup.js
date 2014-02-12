var createCanvas = function(config){
    var qrCodeAlg = config.qrCodeAlg;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    console.log(qrCodeAlg);

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
}
//返回绘制的节点

chrome.tabs.getSelected(null, function(tab) {
    var qrCodeAlg = new QRCodeAlg(tab.url, 3);

    var canvas = createCanvas({
        width: 256,
        height: 256,
        background: '#ffffff',
        foreground: '#000000',
        qrCodeAlg: qrCodeAlg
    });

    document.body.appendChild(canvas);
});