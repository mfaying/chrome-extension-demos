const injectJS = (jsPath = "injectedScripts/injected.js") => {
  const script = document.createElement("script");
  script.src = chrome.extension.getURL(jsPath);
  script.onload = () => {
    script.remove();
  };
  document.body.appendChild(script);
};

console.log("window.$ in content script", window.$);

injectJS();
