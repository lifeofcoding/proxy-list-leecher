var matches = []
var currentList = []
var re = /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})(\s+|:)([0-9]{2,5})/g

var selectAllText = function () {
  var s = window.getSelection()
  s.removeAllRanges()
  var r = document.createRange()
  r.selectNode(document.body)
  s.addRange(r)
  var c = s.toString()
  s.removeAllRanges()
  return c
}

function init() {
  try {
    var niceText = selectAllText()
    matches = niceText.match(re) || []
    console.log(`Proxies found on page: ${matches.length}`)
  } catch (err) {}

  currentList = []

  chrome.storage.local.get('proxies', function (items) {
    if (!chrome.runtime.error) {
      try {
        if (items.proxies && items.proxies.length) {
          items.proxies.split('\r\n').forEach(function (entry) {
            if (entry !== '') {
              currentList.push(entry)
            }
          })
        }
        addProxies()
      } catch (ex) {}
    }
  })
}

function addProxies() {
  var newList = []

  matches.forEach(function (entry) {
    if (currentList.indexOf(entry) === -1) {
      newList.push(entry.trim())
    }
  })

  currentList.forEach(function (eentry) {
    newList.push(eentry.trim())
  })

  var proxies = ''

  newList.forEach(function (eeentry) {
    proxies += eeentry + '\r\n'
  })

  chrome.storage.local.set({ proxies }, function () {
    if (chrome.runtime.error) {
      console.log('Runtime error.')
    }
  })

  var found = newList.length

  console.log('proxies length:', found)

  if (found > 0) {
    var msgb = found.toString()
    chrome.runtime.sendMessage(msgb)
    chrome.storage.local.set({ badgeText: found }, function () {
      if (chrome.runtime.error) {
        console.log('Runtime error.')
      }
    })
  }
}

init()
