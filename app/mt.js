var MT = {
	doClick: function(el){
		var e = document.createEvent('MouseEvent');   
		e.initEvent('click', true, true);  
		
		if(el){
			$(el).get(0).dispatchEvent(e);
		}
	}
}