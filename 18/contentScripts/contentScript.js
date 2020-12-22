setInterval(() => {
  chrome.runtime.sendMessage("我是content script，发送了消息", function(
    response
  ) {
    alert("我是content script，收到了background的消息：" + response);
  });
}, 1000);
