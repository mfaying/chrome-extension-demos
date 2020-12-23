function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

getCurrentTabId(tabId => {
  if (!tabId) {
    return;
  }
  const port = chrome.tabs.connect(tabId, { name: "test-connect" });
  port.postMessage({ msg: "我是popup，发送了消息" });
  port.onMessage.addListener(function(data) {
    if (data.msg && data.msg === "我是content script，发送了消息") {
      port.postMessage({ msg: "我是popup，收到了content script的消息" });
    }
  });
});
