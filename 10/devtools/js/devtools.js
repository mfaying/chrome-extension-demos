// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create(
  "MyPanel",
  "myPanel/icon.png",
  "myPanel/myPanel.html",
  function(panel) {}
);

// 创建自定义侧边栏
chrome.devtools.panels.elements.createSidebarPane("MyImages", function(
  sidebar
) {
  sidebar.setExpression('document.querySelectorAll("img")', "All Images"); // 通过表达式来指定
  // sidebar.setPage('../sidebar.html'); // 指定加载某个页面
  //sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
});
