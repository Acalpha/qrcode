(function(){
	var now = new Date();
	
	$('#now').html(now.getHours() +':'+ now.getMinutes())
	
	$('#step').data('datetime', now.getTime()).change(function(){
		var dateTime = now.getTime();
		var time = $(this).val();
		var html = [];
		
		if(time != ''){
			for(var i=1;i<3;i++){
				var nm = dateTime + (i * time) * 60 * 1000;
				var newDate = new Date(nm);
				
				html.push(
					'<li>第'+ i +'次发布时间 '+ newDate.getHours() +':'+ newDate.getMinutes() +'</li>'
				);
			}

			html.push('<li>..</li>');
		}

		$('#time-step').html(html.join(''))
	});

	//保存
	$('#save').click(function(){
		var errorEl = null;
		var step = parseInt($('#step').val(), 10);
		var publishData = {
			datetime: $('#step').data('datetime'),
			account: {}
		};

		$.each($('.inp-text'), function(){
			if($(this).val() == '' && !$(this).attr('disabled')){
				errorEl = $(this);
				return false;
			}
		});

		if(errorEl){errorEl.focus();return false;}
		if(step == ''){
			$('#step').focus();
			return false;
		}else{
			publishData.step = step;
		}

		$('#account').find('li').each(function(){
			var type = $(this).data('type');
			var username = '';
			var password = '';

			$(this).find('.inp-text').each(function(){
				if($(this).attr('name') == 'username'){
					username = $.trim($(this).val());
				}

				if($(this).attr('name') == 'pwd'){
					password = $.trim($(this).val());
				}
			});

			if(username != '' && password != ''){
				publishData['account'][type]= {
					username: username,
					password: password
				}
			}
		});

		chrome.extension.sendRequest({
			type: 'account',
			action: 'save',
			publishData: publishData
		}, function(){
			window.location.href = 'http://www.lovewith.me/tools/wb.html';
		});
	});

	//自动填充
	chrome.extension.sendRequest({
		type: 'account',
		action: 'get'
	}, function(data){
		var account = data.account;

		for(var k in account){
			var el = $('#account li[data-type="'+ k +'"]');
			
			el.find('.inp-text').each(function(){
				if($(this).attr('name') == 'username'){
					$(this).val(account[k]['username']);
				}

				if($(this).attr('name') == 'pwd'){
					$(this).val(account[k]['password']);
				}
			});
		};

		$('#step').val(data.step).change();
	});
})();