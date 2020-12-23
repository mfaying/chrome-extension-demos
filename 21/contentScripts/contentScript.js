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
