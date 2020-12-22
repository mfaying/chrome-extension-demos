setInterval(() => {
  const views = chrome.extension.getViews({ type: "popup" });
  if (views.length > 0) {
    alert(views[0].location.href);
  }
}, 1000);
