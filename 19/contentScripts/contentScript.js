const injectJS = (jsPath = "injectedScripts/injected.js") => {
  const script = document.createElement("script");
  script.src = chrome.extension.getURL(jsPath);
  script.onload = () => {
    script.remove();
  };
  document.body.appendChild(script);
};

injectJS();

window.addEventListener(
  "message",
  function(e) {
    console.log(
      `我是content script，收到了injected script的消息：${JSON.stringify(
        e.data
      )}`
    );
  },
  false
);
