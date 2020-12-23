// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(
  details => {
    if (details.type === "image") {
      chrome.notifications.create(null, {
        type: "basic",
        iconUrl: "icon.png",
        title: "检测到图片",
        message: "图片地址：" + details.url
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
