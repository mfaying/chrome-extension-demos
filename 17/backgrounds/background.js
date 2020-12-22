function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if (callback) callback(response);
    });
  });
}

setInterval(() => {
  sendMessageToContentScript(
    { type: "background", payload: "我是background，发送了消息" },
    function(response) {
      if (response) {
        alert(`我是background，content script回复了消息：${response}`);
      }
    }
  );
}, 1000);
