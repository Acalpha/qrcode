function TagStore(a){for(var b in a)this[b]=a[b];this.strUtil=new StringUtil;["onChanged","onCreated","onRemoved","onMoved"].forEach(function(a){chrome.bookmarks[a].addListener(this._handleExternalChanges.bind(this,a))},this);chrome.bookmarks.onImportEnded.addListener(this.createIndex.bind(this))}
TagStore.prototype={_isLocked:!1,createIndex:function(){var a=this.bg.options;this.strUtil.set("blackList",a.unignoredDiacritics?a.unignoredDiacritics.split(""):null);a.ignoredPunctuations&&(this._ignoredPunctuations=RegExp("["+a.ignoredPunctuations.replace(/([\]\\^-])/g,"\\$1")+"]","g"));this._index={};this._revIndex={};this._childrenCount={};this._names={};var b=this,c=when.defer();chrome.bookmarks.getTree(function(a){b.rootId=a[0].id;b.bookmarksBarId=a[0].children[0].id;b.topLevelContainerId=a[0].children[1].id;
b._checkNode(a[0]);c.resolve()});return c},_checkNode:function(a){a.url||(a.title&&this._addToIndex(a.id,a.title),this._childrenCount[a.id]=0,a.children.forEach(function(b){b.url||this._childrenCount[a.id]++;this._checkNode(b)},this))},_addToIndex:function(a,b){var c=this._index,d=this._revIndex;this._names[a]=b;this._getKeys(b).forEach(function(b){var e=b.charAt(0);c[e]||(c[e]=[]);c[e].push([a,b]);d[a]||(d[a]=[]);0>d[a].indexOf(c[e])&&d[a].push(c[e])})},_removeFromIndex:function(a){var b=this._index,
c=this._revIndex;c[a]&&(c[a].forEach(function(c){for(var f=c.length-1;-1<f;f--){var e=c[f],g=e[1];e[0]===a&&(c.splice(f,1),0===c.length&&delete b[g.charAt(0)])}}),delete c[a],delete this._names[a])},_getKeys:function(a){var b=[a],c=this.bg.options;c.aliasPrefix&&(b=a.split(c.aliasPrefix));return b.map(function(a){return this.normalize(a)},this)},normalize:function(a){var b=this.bg.options;b.ignoreCase&&(a=a.toLowerCase());b.ignoreDiacritics&&(a=this.strUtil.toAscii(a));b.ignoreSpaces&&(a=a.replace(/\s/g,
""));b.ignoredPunctuations&&(a=a.replace(this._ignoredPunctuations,""));return a},getAncestors:function(a){var b=this;return this.get(a).then(function(a){var d=when.defer();b._traceUp(a,d);return d})},_traceUp:function(a,b){var c=this,d=a.parentId;"0"!==d?c.get(d).then(function(d){var e=when.defer();e.then(function(c){b.resolve(c.concat(a.id))});c._traceUp(d,e)}):b.resolve([a.id])},getIdentity:function(a){return a.id},get:function(a){var b=when.defer(),c=this;chrome.bookmarks.get(a,function(a){a?
(a=a[0],b.resolve({id:a.id,title:a.title,parentId:a.parentId,index:a.index,childrenCount:c._childrenCount[a.id]})):b.reject(chrome.extension.lastError.message)});return b},getName:function(a,b){var c=this._names[a]||"",d=this.bg.options;b&&d.aliasPrefix&&(c=c.split(d.aliasPrefix)[0]);return c},query:function(a){var b=this,c=when.defer();if(a.title){var a=this.normalize(a.title),d=a.charAt(0),f=RegExp("^"+escapeRegExp(a));this._index[d]?(a=this._index[d].filter(function(a){return f.test(a[1])}),0<
a.length?when.all(a.map(function(a){var c=a[1];return b.get(a[0]).then(function(a){a.key=c;return a})})).then(function(a){c.resolve(a)}):c.resolve([])):c.resolve([])}else"parentId"in a&&chrome.bookmarks.getChildren(a.parentId,function(a){c.resolve(a.filter(function(a){return!("url"in a)}).map(function(a){return{id:a.id,title:a.title,parentId:a.parentId,index:a.index,childrenCount:b._childrenCount[a.id]}}))});return c},getChildren:function(a){"object"!==typeof a&&(a={id:a});return this.query({parentId:a.id})},
mayHaveChildren:function(a){return 0<a.childrenCount},add:function(a){this._isLocked=!0;var b=when.defer(),c=this;chrome.bookmarks.create(a,function(a){c._updateIndex("onCreated",a.id,{title:a.title,parentId:a.parentId});b.resolve(a.id)});return b},remove:function(a){this._isLocked=!0;var b=when.defer(),c=this;chrome.bookmarks.remove(a.id,function(){c._updateIndex("onRemoved",a.id,{parentId:a.parentId});b.resolve(!0)});return b},put:function(a,b){var c=when.defer(),d=this;"title"===b.changed?(this._isLocked=
!0,chrome.bookmarks.update(a.id,{title:a.title},function(){d._updateIndex("onChanged",a.id,{title:a.title});c.resolve(a.id)})):c.resolve(a.id);return c},_handleExternalChanges:function(a,b,c){this._isLocked?this._isLocked=!1:c.url||"onCreated"!==a&&!(b in this._revIndex)||this._updateIndex(a,b,c)},_updateIndex:function(a,b,c){("onRemoved"===a||"onChanged"===a)&&this._removeFromIndex(b);("onCreated"===a||"onChanged"===a)&&this._addToIndex(b,c.title);"onCreated"===a&&(this._childrenCount[c.parentId]++,
this._childrenCount[b]=0);"onRemoved"===a&&(this._childrenCount[c.parentId]--,delete this._childrenCount[b]);"onMoved"===a&&(this._childrenCount[c.parentId]++,this._childrenCount[c.oldParentId]--)},has:function(a){return void 0!==this._revIndex[a]}};