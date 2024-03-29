// 检测jQuery
document.getElementById("check-jquery").addEventListener("click", function() {
  // 访问被检查的页面DOM需要使用inspectedWindow
  chrome.devtools.inspectedWindow.eval("jQuery.fn.jquery", function(
    result,
    isException
  ) {
    let html = "";
    if (isException) html = "当前页面没有使用jQuery。";
    else html = "当前页面使用了jQuery，版本为：" + result;
    alert(html);
  });
});

// 打开某个资源
document.getElementById("open-resource").addEventListener("click", function() {
  chrome.devtools.inspectedWindow.eval("window.location.href", function(
    result,
    isException
  ) {
    chrome.devtools.panels.openResource(result, 20, function() {
      console.log("资源打开成功！");
    });
  });
});

// 审查元素
document
  .getElementById("inspect-element")
  .addEventListener("click", function() {
    chrome.devtools.inspectedWindow.eval(
      "inspect(document.images[0])",
      function(result, isException) {}
    );
  });

// 获取所有资源
document
  .getElementById("get-all-resources")
  .addEventListener("click", function() {
    chrome.devtools.inspectedWindow.getResources(function(resources) {
      alert(JSON.stringify(resources));
    });
  });

document.getElementById("get-dp-dom-btn").addEventListener("click", function() {
  // 访问被检查的页面DOM需要使用inspectedWindow
  chrome.devtools.inspectedWindow.eval('document.evaluate(`//*[@id="app"]/section[1]/section[1]/aside[1]/div[1]/ul[1]/li[3]/a[1]`, document, null, 0).iterateNext()', function(
    ...rest
  ) {
    console.log('rest', rest);
    // let html = "";
    // if (isException) html = "当前页面没有使用jQuery。";
    // else html = "当前页面使用了jQuery，版本为：" + result;
    // alert(html);
  });
});
  

