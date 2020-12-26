window.setInterval(() => {
  chrome.notifications.create(null, {
    type: "basic",
    iconUrl: "icon.png",
    title: "桌面通知",
    message: Math.random().toString()
  });
}, 1000);
