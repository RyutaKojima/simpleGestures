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
				responseString= "new tab open";
				break;

			case "close_tab":
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.remove(tab.id);
				});
				responseString= "tab closed";
				break;

			case "last_tab":
				chrome.storage.local.get('lasturl', function(result){
					chrome.tabs.create({'url':result.lasturl}, function(tab){})
				});
				responseString = "last tab open";
				break;

			case "reload_all":
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for(var i = 0; i < tabs.length; i++) {
						chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
					}
				});
				responseString = "all tabs reloaded";
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
				responseString = "tab switched";
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
				responseString = "tab switched";
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
				responseString = "background closed";
				break;

			case "close_all":
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for(var i = 0; i < tabs.length; i++) {
						chrome.tabs.remove(tabs[i].id);
					}
		  		});
				responseString = "all tabs closed";
				break;

			case "load_options":
				sendResponse({message: "yes", "options_json": JSON.stringify(loadOptions()) });
				return;

			case "open_option":
				chrome.tabs.create({
				    "url": chrome.extension.getURL("options_page.html"),
				});
				break;;
		}

		sendResponse({message: responseString});
	}
);

