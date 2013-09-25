var backgroundWindow = chrome.extension.getBackgroundPage();

//保存
$('#account').find('.inp-btn').click(function(){
	var account = {};
	$('#account').find('fieldset').each(function(){
		var type = $(this).data('type');
		var username = '';
		var password = '';

		$(this).find('.inp-text').each(function(){
			if($(this).attr('name') == 'username'){
				username = $(this).val();
			}

			if($(this).attr('name') == 'pwd'){
				password = $(this).val();
			}
		});

		if(username != '' && password != ''){
			account[type]= {
				username: username,
				password: password
			}
		}
	});

	//保存帐号数据
	chrome.extension.sendRequest({
		type: 'account',
		action: 'save',
		account: account
	}, function(){
		window.close();
	});
});


//自动填充
$(function(){
	chrome.extension.sendRequest({
		type: 'account',
		action: 'get'
	}, function(account){
		for(var k in account){
			var el = $('#account fieldset[data-type="'+ k +'"]');
			
			el.find('.inp-text').each(function(){
				if($(this).attr('name') == 'username'){
					$(this).val(account[k]['username']);
				}

				if($(this).attr('name') == 'pwd'){
					$(this).val(account[k]['password']);
				}
			});
		}
	});
})