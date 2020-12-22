chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  sendResponse(`我是background，收到了content script的消息：${request}`);
});
