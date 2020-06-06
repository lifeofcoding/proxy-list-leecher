chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
chrome.browserAction.setBadgeText({ text: '' })
chrome.storage.local.set({ proxies: [] }, function () {
  if (chrome.runtime.error) {
    console.log('Runtime error.')
  }
})
chrome.storage.local.set({ badgeText: '' }, function () {
  if (chrome.runtime.error) {
    console.log('Runtime error.')
  }
})
chrome.runtime.onMessage.addListener(function (message) {
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
  chrome.browserAction.setBadgeText({ text: message })
})

chrome.tabs.onUpdated.addListener(function (tab, estado, tabb) {
  if (estado.url != 'chome://') {
    if (estado.status == 'complete') {
      try {
        chrome.storage.local.get('leechingEnabled', function (item) {
          if (!chrome.runtime.error) {
            var endis = item.leechingEnabled
            if (endis == true) {
              chrome.extension.getBackgroundPage().chrome.tabs.executeScript(
                null,
                {
                  file: 'payload.js',
                },
                (_) => {
                  let e = chrome.runtime.lastError
                  if (e !== undefined) {
                    console.log(_, e)
                  }
                },
              )
            }
          }
        })
      } catch (ex) {}
    }
  }
})
