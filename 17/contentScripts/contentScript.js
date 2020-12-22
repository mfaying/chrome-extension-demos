chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "background") {
    alert(
      `我是content script，收到了${request.type}的消息：${request.payload}`
    );
    sendResponse(`我是content script，回复了${request.type}`);
  }
});
