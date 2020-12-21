chrome.contextMenus.create({
  type: "normal", // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
  title: "使用度娘搜索：%s", // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
  contexts: ["selection"], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
  onclick: function(params) {
    // 注意不能使用location.href，因为location是属于background的window对象
    chrome.tabs.create({
      url:
        "https://www.baidu.com/s?ie=utf-8&wd=" + encodeURI(params.selectionText)
    });
  }
});
