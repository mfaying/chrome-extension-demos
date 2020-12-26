# Chrome插件开发指南

之前介绍过一个基于Chrome插件开发的无埋点可视化工具

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/zan-data/zandata-show.gif)

那么，这篇文章就系统介绍一下Chrome插件开发，代码链接附文后。

# 什么是Chrome插件

严格来讲，应该叫Chrome扩展(Chrome Extension)，真正意义上的Chrome插件需要对浏览器源码有一定掌握才有能力去开发。

Chrome插件是一个用Web技术开发、用来增强浏览器功能的软件。它其实就是一个由HTML、CSS、JS、图片等资源组成的一个.crx后缀的压缩包。

# 开发与调试

Chrome插件没有严格的项目结构要求，只要保证根目录有一个manifest.json。

从右上角菜单->更多工具->扩展程序可以进入插件管理页面，也可以直接在地址栏输入`chrome://extensions`访问。

勾选开发者模式，添加项目文件夹

开发中，代码有任何改动都必须重新加载一下插件

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/%E5%BC%80%E5%8F%91%E4%B8%8E%E8%B0%83%E8%AF%95.png)

# manifest.json

manifest.json是插件的配置文件

一个简单的manifest.json

```json
{
  // 清单文件的版本
  "manifest_version": 2,
  // 插件名称
  "name": "demo",
  // 插件版本
  "version": "0.0.1",
  // 插件描述
  "description": "content-scripts",
  // 图标，一般偷懒全部用一个尺寸的也没问题
  "icons": {
    "16": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  },
  // 直接注入页面的js
  "content_scripts": [
    {
      // <all_urls> 表示匹配所有地址
      "matches": ["<all_urls>"],
      "js": ["contentScripts/contentScript.js"],
      "css": ["contentScripts/contentScript.css"],
      // 代码注入的时间，可选值： document_start、document_end、document_idle（页面空闲时），默认document_idle
      "run_at": "document_end"
    }
  ]
}
```

# 1.content-scripts

content-scripts是Chrome插件向页面注入脚本的一种形式（也可以是css）。

我们借助content-scripts可以自由地修改页面，实现常见的功能，比如：广告屏蔽、页面CSS定制，等等。

content-scripts和原始页面共享DOM，但是不共享JS。如要访问页面JS（例如某个JS变量），只能通过injected js来实现。

content-scripts只能访问部分Chrome扩展API，你可以通过通信让background来帮你调用一些API。

## 示例

在manifest.json中添加

```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["contentScripts/contentScript.js"],
    "css": ["contentScripts/contentScript.css"],
    "run_at": "document_start"
  }
]
```

这样在contentScript.js里就可以写js脚本，在contentScript.css里可以写css。

# 2.background

background是一个常驻页面，它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭。所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面。

background的权限非常高，几乎可以调用所有的Chrome扩展API（除了devtools）。而且它可以跨域访问资源而无需对方设置CORS。

## 示例

在manifest.json中添加

```json
"background": {
  "scripts": ["backgrounds/background.js"]
}
```

# 3.event-pages

鉴于background生命周期太长，长时间挂载在后台可能会影响性能，所以还有一个event-pages。在配置文件上，它就比background多了一个persistent参数。

它的生命周期是：在被需要时加载，在空闲时被关闭。比如在第一次安装、插件更新、有content-script向它发送消息时加载。

这个简单了解一下就行，一般情况下background也不会很消耗性能。

## 示例

在manifest.json中添加

```js
"background": {
  "scripts": ["eventPages/eventPage.js"],
  "persistent": false
}
```

# 4.popup

popup是点击browser_action或者page_action图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互。

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/popup%E6%98%BE%E7%A4%BA%E4%BD%8D%E7%BD%AE.png)

它和background的权限非常类似。

## 示例

在manifest.json中添加

```js
"browser_action": {
  "default_icon": "icon.png",
  "default_title": "popup",
  "default_popup": "popup/popup.html"
}
```

在popup.html里就可以编写窗口网页的代码。

# 5.injected-script

injected-script并不是一个官方概念，它是指在content-scripts中通过DOM操作的方式向页面注入的JS。

content-script无法访问页面中的JS，但inject-script可以。

## 示例

在manifest.json中添加

```json
"web_accessible_resources": ["injectedScripts/injected.js"],
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["contentScripts/contentScript.js"],
    "run_at": "document_end"
  }
]
```

注意需要在web_accessible_resources设置injected.js访问路径，否则无法访问injected.js。

```js
const injectJS = (jsPath = "injectedScripts/injected.js") => {
  const script = document.createElement("script");
  script.src = chrome.extension.getURL(jsPath);
  script.onload = () => {
    script.remove();
  };
  document.body.appendChild(script);
};

injectJS();
```

这样在injected.js里写的代码就可以访问页面里的JS了。

# 6.homepage_url

开发者或者插件主页设置

## 示例

在manifest.json中添加

```json
"homepage_url": "https://juejin.cn/",
```

# 7.pageAction

pageAction，指的是只有当某些特定页面打开才显示的图标，否则是置灰的。可以简单地把它看成是可以置灰的browserAction。

## 示例

在manifest.json中添加

```json
{
  "manifest_version": 2,
  "name": "3",
  "version": "0.0.1",
  "description": "popup",
  "icons": {
    "16": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  },
  "page_action": {
    "default_icon": "icon.png",
    "default_title": "pageAction",
    "default_popup": "popup/popup.html"
  },
  "background": {
    "scripts": ["backgrounds/background.js"]
  },
  "permissions": ["declarativeContent"]
}
```

可以在background中决定是否置灰插件图标

比如设置只有在包含baidu.com字符的url下才能使用插件。

```js
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "baidu.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
```

# 8.右键菜单

Chrome插件可以自定义浏览器的右键菜单，右键菜单可以出现在不同的上下文，比如普通页面、选中的文字、图片、链接，等等。

## 示例

在manifest.json中添加

```json
  "background": {
    "scripts": ["backgrounds/background.js"]
  },
  "permissions": ["contextMenus", "tabs"]
```

比如选中文本后，右键点击"使用度娘搜索"菜单项，打开一个新tab页面使用百度搜索该文本。

```js
// background.js

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
```

# 9.override(覆盖特定页面)

使用override页可以将Chrome默认的一些特定页面改为插件提供的页面。

可替代的页面如下：

1. 历史记录
2. 新标签页
3. 书签

## 示例

在manifest.json中添加

```json
"chrome_url_overrides": {
  "newtab": "overrides/newtab.html"
}
```

就可以newtab.html替换新标签页了

# 10.devtools(开发者工具)

Chrome插件可以修改开发者工具(devtools)。主要表现在：

1. 自定义和Elements、Console、Sources等同级别的面板

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/devtools%E7%9A%84MyPanel.png)

2. 自定义侧边栏(sidebar)，目前只能自定义Elements面板的侧边栏

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/devtools%E7%9A%84MyImages.png)

devtools页面的生命周期和devtools窗口是一致的。devtools页面可以访问一组特有的DevTools API以及有限的扩展API。

官网的一张图很好说明了devtools和content scripts、backgroud的关系。

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/devtools%26content%20scripts%26backgroud%E7%9A%84%E5%85%B3%E7%B3%BB.png)

## 示例

代码较多，可以查看文末的源码链接。

# 11.option

options页就是插件的设置页面，有2个入口，一个是右键图标有一个“选项”菜单，还有一个在插件管理页面。

## 示例

在manifest.json中添加

```json
"options_page": "options/options.html",
```

在options.html编写设置页面的代码

# 12.新版option

新版option采用了弹窗的形式。

## 示例

在manifest.json中添加

```json
"options_ui": {
  "page": "options/options.html",
  "chrome_style": true
},
```

# 13.omnibox

omnibox是向用户提供搜索建议的一种方式。

# 14.桌面通知

chrome.notifications API可以推送桌面通知。

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5.png)

## 示例

在manifest.json中添加

```json
"permissions": ["notifications"],
```

调用chrome.notifications API即可
```js
// background.js
chrome.notifications.create(null, {
  type: "basic",
  iconUrl: "icon.png",
  title: "桌面通知",
  message: Math.random().toString()
});
```

# 5种类型的JS对比

Chrome插件的JS主要可以分为这5类：injected script、content-script、popup js、background js和devtools js。

## 权限对比

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/5%E7%A7%8D%E7%B1%BB%E5%9E%8B%E7%9A%84js%E6%9D%83%E9%99%90%E5%AF%B9%E6%AF%94.png)

## 调用方式对比

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/5%E7%A7%8D%E7%B1%BB%E5%9E%8Bjs%E7%9A%84%E8%B0%83%E7%94%A8%E6%96%B9%E5%BC%8F%E5%AF%B9%E6%AF%94.png)

## 互相通信概览

注：-表示不存在或者无意义，或者待验证。

![](https://file-stores.oss-cn-beijing.aliyuncs.com/blog/chrome-extension/%E9%80%9A%E4%BF%A1%E6%A6%82%E8%A7%88.png)

popup和background其实几乎可以视为一种东西，因为它们可访问的API都一样、通信机制一样、都可以跨域。

# 15.popup向background发消息

[demo15](https://github.com/mfaying/chrome-extension-demos/tree/master/15)

# 16.background向popup发消息

[demo16](https://github.com/mfaying/chrome-extension-demos/tree/master/16)

# 17.popup或者background向content script发送消息

以background为例

[demo17](https://github.com/mfaying/chrome-extension-demos/tree/master/17)

# 18.content script向background发消息

[demo18](https://github.com/mfaying/chrome-extension-demos/tree/master/18)

# 19.injected script和content script通信

[demo19](https://github.com/mfaying/chrome-extension-demos/tree/master/19)

# 20.长连接和短连接

Chrome插件中有2种通信方式，一种是短连接（chrome.tabs.sendMessage和chrome.runtime.sendMessage），一种是长连接（chrome.tabs.connect和chrome.runtime.connect）。

## 示例

以popup.js与background长连接通信为例

```js
// background.js

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
```

```js
// popup.js

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
```

# 21.本地存储

本地存储建议用chrome.storage而不是普通的localStorage，好处是：

1. chrome.storage是针对插件全局的，比如你在background中保存数据，在content-script中也能获取到。

2. chrome.storage.sync可以跟随当前登录用户自动同步，比如这台电脑修改的设置会自动同步到其它电脑，如果没有登录或未联网则先保存到本地，等登录了再同步至网络。

## 示例


在manifest.json中添加

```json
"permissions": ["storage"]
```

以chrome.storage为例

```js
// content script

const get = (key, cb) => {
  chrome.storage.local.get({ [key]: "" }, items => {
    const value = items[key];
    cb(value);
  });
};

const set = (key, value, cb) => {
  chrome.storage.local.set({ [key]: value }, () => {
    cb();
  });
};

const key = "key";
set(key, "local", function() {
  get(key, function(value) {
    console.log("get value: ", value);
  });
});
```

# 22.webRequest

通过webRequest系列API可以对HTTP请求进行修改、定制。

## 示例

在manifest.json中添加

```json
"permissions": [
  "webRequest",
  "webRequestBlocking",
  "notifications",
  "http://*/*",
  "https://*/*"
],
```

该功能能拦截所有的image请求

```js
// background.js

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
```

# 23
国际化

## 示例

在manifest.json中添加

```json
"default_locale": "en",
```

在根目录创建_locales文件，添加多语言文案

```
_locales
  en
    messages.json
  zh_CN
    messages.json
```

```js
// en/messages.json

{
  "pluginDesc": { "message": "A simple chrome extension demo" }
}
```

```js
// zh_CN/messages.json

{
  "pluginDesc": { "message": "一个简单的Chrome插件demo" }
}
```

可以通过chrome.i18n.getMessage("pluginDesc")获取相应文案。

# 参考
1. [【干货】Chrome插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)
2. [开发者指南 - Google Chrome 扩展程序开发文档（非官方中文版）](https://crxdoc-zh.appspot.com/extensions/devguide)

# 附件
1. [代码](https://github.com/mfaying/chrome-extension-demos)