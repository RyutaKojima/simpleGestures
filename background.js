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

			case "newtab":
				chrome.tabs.create({})
				responseString= "tab open";
				break;

			case "closetab":
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.remove(tab.id);
				});
				responseString= "tab closed";
				break;

			case "lasttab":
				chrome.storage.local.get('lasturl', function(result){
					chrome.tabs.create({'url':result.lasturl}, function(tab){})
				});
				responseString = "last tab open";
				break;

			case "reloadall":
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for(var i = 0; i < tabs.length; i++) {
						chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
					}
				});
				responseString = "tabs reloaded";
				break;

			case "nexttab":
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

			case "prevtab":
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

			case "closeall":
				chrome.tabs.getAllInWindow(null, function(tabs) {
					for(var i = 0; i < tabs.length; i++) {
						chrome.tabs.remove(tabs[i].id);
					}
		  		});
				responseString = "all tabs closed";
				break;
		}

		sendResponse({resp: responseString});
	}
);

