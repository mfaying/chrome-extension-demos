// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == "test-connect") {
    port.onMessage.addListener(function(data) {
      console.log("我是content script，收到popup的消息：", data.msg);
      if (data.msg === "我是popup，发送了消息") {
        port.postMessage({ msg: "我是content script，发送了消息" });
      }
    });
  }
});
