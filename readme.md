# 什么是Chrome插件
严格来讲，应该叫Chrome扩展(Chrome Extension)，真正意义上的Chrome插件需要对浏览器源码有一定掌握才有能力去开发。

Chrome插件是一个用Web技术开发、用来增强浏览器功能的软件，它其实就是一个由HTML、CSS、JS、图片等资源组成的一个.crx后缀的压缩包。

# 开发与调试

Chrome插件没有严格的项目结构要求，只要保证根目录有一个manifest.json。

从右上角菜单->更多工具->扩展程序可以进入插件管理页面，也可以直接在地址栏输入`chrome://extensions`访问。

勾选开发者模式，添加项目文件夹即可。

开发中，代码有任何改动都必须重新加载一下插件

# manifest.json

这是一个简单的manifest.json

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
  // 图标，一般偷懒全部用一个尺寸的也没问题???
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

借助content-scripts我们可以自由地修改页面，实现最常见的功能，比如：广告屏蔽、页面CSS定制，等等。

content-scripts和原始页面共享DOM，但是不共享JS。如要访问页面JS（例如某个JS变量），只能通过injected js来实现。content-scripts也不能访问大部分Chrome扩展API，不过你可以通过通信让background来帮你调用这些API。

# 2.background

background是一个常驻页面，它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭。所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面。

background的权限非常高，几乎可以调用所有的Chrome扩展API（除了devtools）。而且它可以跨域访问资源而无需对方设置CORS。

# 3.event-pages

鉴于background生命周期太长，长时间挂载在后台可能会影响性能，所以又有一个event-pages。在配置文件上，它就比background多了一个persistent参数。

它的生命周期是：在被需要时加载，在空闲时被关闭。比如在第一次安装、插件更新、有content-script向它发送消息时加载。

这个简单了解一下就行，一般情况下background也不会很消耗性能。

# 4.popup

popup是点击browser_action或者page_action图标???时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互。它和background的权限非常类似。

# 5.injected-script

injected-script并不是一个官方概念，它是指在content-scripts中通过DOM操作的方式向页面注入的JS。

因为content-script无法访问页面中的JS，但inject-script可以。

# 6.homepage_url

开发者或者插件主页设置

# 7.pageAction

pageAction，指的是只有当某些特定页面打开才显示的图标，否则是置灰的。可以简单地把它看成是可以置灰的browserAction。

# 8.右键菜单

Chrome插件可以自定义浏览器的右键菜单，右键菜单可以出现在不同的上下文，比如普通页面、选中的文字、图片、链接，等等。

# 9.override(覆盖特定页面)

使用override页可以将Chrome默认的一些特定页面改为使用扩展提供的页面。

扩展可以替代如下页面：

1. 历史记录
2. 新标签页
3. 书签

# 10.devtools(开发者工具)

Chrome插件可以修改开发者工具(devtools)。主要表现在：

1. 自定义和Elements、Console、Sources等同级别的面板
2. 自定义侧边栏(sidebar)，目前只能自定义Elements面板的侧边栏

???一张很重要的官方图

devtools页面的生命周期和devtools窗口是一致的。devtools页面可以访问一组特有的DevTools API以及有限的扩展API。

# 11.option

options页就是插件的设置页面，有2个入口，一个是右键图标有一个“选项”菜单，还有一个在插件管理页面。

# 12.新版option

新版option采用了弹窗的形式。

# 13.omnibox ??? 未验证成功

omnibox是向用户提供搜索建议的一种方式。

# 14.桌面通知 TODO ???未验证成功

chrome.notifications API可以方便插件推送桌面通知。

# number（略）

5种类型js的（权限、调用方式）对比，通信等

# 15.popup向background发消息

# 16.background向popup发消息

# 17.popup或者background向content script发送消息

以background为例

# 18.content script向background发消息

# 19.injected script和content script通信

# 20.长连接和短连接

Chrome插件中有2种通信方式，一个是短连接（chrome.tabs.sendMessage和chrome.runtime.sendMessage），一个是长连接（chrome.tabs.connect和chrome.runtime.connect）。

# 21.本地存储

本地存储建议用chrome.storage而不是普通的localStorage，好处是：

1. chrome.storage是针对插件全局的，比如你在background中保存数据，在content-script中也能获取到。
2. chrome.storage.sync可以跟随当前登录用户自动同步，比如这台电脑修改的设置会自动同步到其它电脑，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络。

# 22.webRequest

通过webRequest系列API可以对HTTP请求进行任性地修改、定制。

# 23
国际化

# 参考
1. [【干货】Chrome插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)
2. [开发者指南 - Google Chrome 扩展程序开发文档（非官方中文版）](https://crxdoc-zh.appspot.com/extensions/devguide)