/**
 *
 */
chrome.extension.onMessage.addListener(
	function onMessage_handler(request, sender, sendResponse) {
		var responseString = "";

		switch(request.msg) {
			default:
				responseString= "unknown command";
				break;

			case "new_tab":
				chrome.tabs.query({active: true}, function(tabs) {
					var current_tab = tabs[0];
					if(request.url == null) {
						chrome.tabs.create({index:current_tab.index+1});
					}
					else {
						chrome.tabs.create({url:request.url, index:current_tab.index+1});
					}
				});
				break;

			case "close_tab":
				chrome.tabs.query({active: true}, function(tabs) {
					var current_tab = tabs[0];
					chrome.tabs.remove(current_tab.id);
				});
				break;

			case "last_tab":
				chrome.storage.local.get('lasturl', function(result){
					chrome.tabs.create({'url':result.lasturl})
				});
				break;

			case "reload":
				chrome.tabs.query({active: true}, function(tabs) {
					var current_tab = tabs[0];
					chrome.tabs.reload(current_tab.id);
				});
				break;

			case "reload_all":
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for(var i = 0; i < tabs.length; i++) {
						chrome.tabs.reload(tabs[i].id);
					}
				});
				break;

			case "next_tab":
				chrome.tabs.query({active: true}, function(tabs) {
					var current_tab = tabs[0];
					chrome.tabs.getAllInWindow(null, function(tabs) {
						if(current_tab.index == tabs.length-1) {
							chrome.tabs.update(tabs[0].id,{active:true});
						}
						else {
							chrome.tabs.update(tabs[current_tab.index+1].id,{active:true});
						}
					});
				});
				break;

			case "prev_tab":
				chrome.tabs.query({active: true}, function(tabs) {
					var current_tab = tabs[0];
					chrome.tabs.getAllInWindow(null, function(tabs) {
						if(current_tab.index == 0) {
							chrome.tabs.update(tabs[tabs.length-1].id,{active:true});
						}
						else {
							chrome.tabs.update(tabs[current_tab.index-1].id,{active:true});
						}
					});
				});
				break;

			case "close_all_background":
				chrome.tabs.query({active: true}, function(tabs) {
					var current_tab = tabs[0];
					chrome.tabs.getAllInWindow(null, function(all_tabs) {
						for(var i = 0; i < all_tabs.length; i++) {
							if(all_tabs[i].id != current_tab.id) {
								chrome.tabs.remove(all_tabs[i].id);
							}
						}
					});
				});
				break;

			case "close_all":
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for(var i = 0; i < tabs.length; i++) {
						chrome.tabs.remove(tabs[i].id);
					}
		  		});
				break;

			case "load_options":
				sendResponse({message: "yes", "options_json": loadOptionsString() });
				return;

			case "open_option":
				chrome.tabs.create({
				    "url": chrome.extension.getURL("options_page.html"),
				});
				break;

			case "open_extension":
				var chromeExtURL="chrome://extensions/";
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for (var i = 0; i < tabs.length; i++) {
						if(tabs[i].url == chromeExtURL) {
							chrome.tabs.update(tabs[i].id, {selected:true});
							return;
						}
					}
					chrome.tabs.create({url:chromeExtURL,selected:true});
				});
				break;

			case "restart":
				chrome.tabs.create({url:"chrome://restart",selected:true});
				break;
		}

		sendResponse({message: responseString});
	}
);

