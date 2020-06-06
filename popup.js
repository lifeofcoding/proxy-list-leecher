cb1.addEventListener('change', function (e) {
  if (e.target.checked) {
    chrome.storage.local.set({ leechingEnabled: true }, function () {
      if (chrome.runtime.error) {
        console.log('Runtime error.')
      }
    })
    document.getElementById('pbody').style.display = 'block'
  } else {
    document.getElementById('txta').value = ''
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
    chrome.storage.local.set({ leechingEnabled: false }, function () {
      if (chrome.runtime.error) {
        console.log('Runtime error.')
      }
    })
    document.getElementById('pbody').style.display = 'none'
  }
})

function saveText(filename, text) {
  var tempElem = document.createElement('a')
  tempElem.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  )
  tempElem.setAttribute('download', filename)
  tempElem.click()
}

save.addEventListener(
  'click',
  function () {
    chrome.storage.local.get('proxies', function (items) {
      if (!chrome.runtime.error) {
        var txtv = items.proxies
        saveText('Scraped-Proxies.txt', txtv)
      }
    })
  },
  false,
)

copy.addEventListener(
  'click',
  function () {
    chrome.storage.local.get('proxies', function (items) {
      if (!chrome.runtime.error) {
        var a = document.getElementById('txta')
        a.select()
        document.execCommand('Copy')
      }
    })
  },
  false,
)

try {
  chrome.storage.local.get('leechingEnabled', function (item) {
    if (!chrome.runtime.error) {
      var endis = item.leechingEnabled
      if (endis == true) {
        chrome.storage.local.get('proxies', function (items) {
          if (!chrome.runtime.error) {
            document.getElementById('cb1').checked = true
            document.getElementById('pbody').style.display = 'block'
            document.getElementById('txta').value = items.proxies
          }
        })
      } else {
        chrome.storage.local.set({ leechingEnabled: false }, function () {
          if (chrome.runtime.error) {
            console.log('Runtime error.')
          }
        })
      }
    }
  })
} catch (ex) {}
