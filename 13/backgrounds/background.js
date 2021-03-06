console.log("go");
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log("text+++", text);
  if (!text) return;
  if (text == "搜索") {
    suggest([
      { content: "百度搜索 " + text, description: "百度搜索 " + text },
      { content: "谷歌搜索 " + text, description: "谷歌搜索 " + text }
    ]);
  }
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener(text => {
  console.log("inputEntered: " + text);
  if (!text) return;
  var href = "";
  if (text.endsWith("美女"))
    href =
      "http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=" + text;
  else if (text.startsWith("百度搜索"))
    href =
      "https://www.baidu.com/s?ie=UTF-8&wd=" + text.replace("百度搜索 ", "");
  else if (text.startsWith("谷歌搜索"))
    href =
      "https://www.google.com.tw/search?q=" + text.replace("谷歌搜索 ", "");
  else href = "https://www.baidu.com/s?ie=UTF-8&wd=" + text;
  openUrlCurrentTab(href);
});
// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
  getCurrentTabId(tabId => {
    chrome.tabs.update(tabId, { url: url });
  });
}
