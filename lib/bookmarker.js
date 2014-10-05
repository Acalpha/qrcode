//初始化indexdb
EtIndexDB = function(){
	this.db = null;
	this.cache = {}
}
EtIndexDB.prototype = {
	open: function(callback){
		var self = this;
		var request = indexedDB.open('et-indexeddb-bookmarks', 1);

		//第一次打开数据库
		request.onupgradeneeded = function(e){
			var db = e.target.result;

			//创建对象仓库
			if(!db.objectStoreNames.contains('bookmarker')) {
				db.createObjectStore('bookmarker', {keyPath: 'url'});
			}
		}

		request.onsuccess = function(e){
			var db = e.target.result;
			var t = db.transaction(['bookmarker'], 'readwrite');
			var store = t.objectStore('bookmarker');

			callback && callback(store);
		}
	}
}

function BookMarkers($scope){
	chrome.bookmarks.getTree(function(markers){
		//全部书签
		var bookMarkers = [];
		//tag书签数据
		var tagMarkers = {};
		var root = markers[0].children;
		/*
		 * 树深度(每进入一次deep长度+1(初始值为0)，存在子节点时len-1位的值自增)
		 * 遍历过程如下：
		 * [0]
		 * [0,0,]
		 * [0,0,0]
		 * [0,0,0,0]
		 * [0,0,0,1]
		 * [0,0,0,2]
		 * [0,0,0,3]
		 * [0,0,1]
		 * [0,0,2]
		 * [0,1]
		 * [0,2]
		 * [1]
		*/
		var deep = [0];
		var index = 0;
		var data = root[index];
		var parentTag = [];
		 
		//遍历全部书签
		function getMarker(){
			if(data){
				//存在子类目时进入
				if(data.children){
					parentTag.push(data.title);
					data = data.children[index];

					if(!deep[deep.length]){
						deep[deep.length] = 0;
						index = 0;
					}
					getMarker();
				}else{
					//修改为字符串赋值，而不是数组的引用
					var marker = parentTag.join(',').split(',');
					marker.shift();

					//保存数据到indexedDB
					//dbStore.add({title: data.title, url: data.url, tags: marker});
					bookMarkers.push({title: data.title, url: data.url, tags: marker});

					//按标签保存数据
					marker.forEach(function(d, i){
						if(!tagMarkers[d]){
							tagMarkers[d] = [];
						}

						tagMarkers[d].push(data)
					})

					deep[deep.length-1] = deep[deep.length-1] + 1;

					//重置data值
					data = markers[0];

					deep.forEach(function(d, i){
						data = data.children[d];
					});
					
					getMarker();
				}
			}else{
				//弹出队列最后一个
				deep.pop();
				parentTag.pop();
				
				if(deep.length > 0){
					//倒数第二个队列值+1
					deep[deep.length-1] = deep[deep.length-1] + 1;
					
					//重置data值
					data = markers[0];

					deep.forEach(function(d, i){
						data = data.children[d];
					});

					getMarker();
				}else{
					getMarkerDone();
				}
			}
		}

		//遍历书签完成
		function getMarkerDone(){
			$scope.$apply(function(){
				$scope.markers = tagMarkers;
				$scope.tagMarker = [];
			});
		}

		var dbStore = null;
		var db = new EtIndexDB();
		//打开数据库
		db.open(function(store){
			dbStore = store;
			getMarker();
		});
	});

	$scope.tagMarker = [];

	$scope.showTagMarkers = function(data, el){
		$scope.tagMarker = data;
		$scope.searchState = 'bm-search-active';
	}
	//搜索
	$scope.search = function(e){
		var el = e.currentTarget;
		var keyword = el.value;

		if(keyword == '' && e.keyCode == 8){
			$scope.searchType = '';
		}

		if(/^b:.*/gi.test(keyword)){
			el.value = keyword.replace('b:', '');

			$scope.searchType = 'bm-search-bd';
		}

		if(/^g:.*/gi.test(keyword)){
			el.value = keyword.replace('g:', '');

			$scope.searchType = 'bm-search-g';
		}

		if(e.keyCode == 13){
			/* 回车 */
			window.location.href = ''
		}
	}
}