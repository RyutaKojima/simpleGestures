/*
 *
 *
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
				chrome.tabs.create({})
				break;

			case "close_tab":
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.remove(tab.id);
				});
				break;

			case "last_tab":
				chrome.storage.local.get('lasturl', function(result){
					chrome.tabs.create({'url':result.lasturl}, function(tab){})
				});
				break;

			case "reload_all":
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for(var i = 0; i < tabs.length; i++) {
						chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
					}
				});
				break;

			case "next_tab":
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.getAllInWindow(null, function(tabs) {
						for(var i = 0; i < tabs.length; i++) {
							if(tabs[i].id == tab.id) {
								if(i == tabs.length-1) {
									chrome.tabs.update(tabs[0].id,{active:true});
								}
								else {
									chrome.tabs.update(tabs[i+1].id,{active:true});
								}
								break;
							}
						}
					});
				});
				break;

			case "prev_tab":
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.getAllInWindow(null, function(tabs) {
						for(var i = 0; i < tabs.length; i++) {
							if(tabs[i].id == tab.id) {
								if(i == 0) {
									chrome.tabs.update(tabs[tabs.length-1].id,{active:true});
								}
								else {
									chrome.tabs.update(tabs[i-1].id,{active:true});
								}
								break;
							}
						}
					});
				});
				break;

			case "close_all_background":
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.getAllInWindow(null, function(tabs) {
						for(var i = 0; i < tabs.length; i++) {
							if(tabs[i].id != tab.id) {
								chrome.tabs.remove(tabs[i].id);
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

