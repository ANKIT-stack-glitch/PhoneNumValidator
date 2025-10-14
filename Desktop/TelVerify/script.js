const userInput = document.getElementById('user-input')
const checkBtn = document.getElementById('check-btn')
const clearBtn = document.getElementById('clear-btn')
const resultsDiv = document.getElementById('results-div')
const padButtons = document.querySelectorAll('.dial-pad button')
const carrierRow = document.getElementById('carrier-row')

// Ncell 980, 981, 982, 986, 976
// NTC 984, 985, 974, 975, 972, 988

function isValidNepaliNumber(num) {
  let n = num.trim().replace(/\s+/g, '')
  if (n.startsWith('+977')) n = n.slice(4)


  let validMobile =
    /^980\d{7}$/.test(n) ||
    /^981\d{7}$/.test(n) ||
    /^982\d{7}$/.test(n) ||
    /^986\d{7}$/.test(n) ||
    /^976\d{7}$/.test(n) ||
    /^984\d{7}$/.test(n) ||
    /^985\d{7}$/.test(n) ||
    /^974\d{7}$/.test(n) ||
    /^975\d{7}$/.test(n) ||
    /^972\d{7}$/.test(n) ||
    /^988\d{7}$/.test(n)


  let validLandline = /^01\d{7}$/.test(n) || /^0[2-7]\d{7}$/.test(n)

  let validSpecial = /^1[1-9]\d{6,7}$/.test(n)

  return validMobile || validLandline || validSpecial
}

function carrierDetect(num) {
  let n = num.trim().replace(/\s+/g, '')
  if(n.startsWith('+977')) n = n.slice(4)
  // Ncell
  if (/^980\d{7}$/.test(n)) return 'Ncell'
  if (/^981\d{7}$/.test(n)) return 'Ncell'
  if (/^982\d{7}$/.test(n)) return 'Ncell'
  if (/^986\d{7}$/.test(n)) return 'Ncell'
  // NTC
  if (/^976\d{7}$/.test(n)) return 'NTC'    
  if (/^984\d{7}$/.test(n)) return 'NTC'
  if (/^985\d{7}$/.test(n)) return 'NTC'
  if (/^974\d{7}$/.test(n)) return 'NTC'
  if (/^975\d{7}$/.test(n)) return 'NTC'
  if (/^972\d{7}$/.test(n)) return 'NTC'
  if (/^988\d{7}$/.test(n)) return 'NTC'
  // Landline
  if (/^01\d{7}$/.test(n) || /^0[2-7]\d{7}$/.test(n)) return 'Landline'
  // Special VoIP
  if (/^1[1-9]\d{6,7}$/.test(n)) return 'VoIP/Special'
  return ''
}

function updateCarrier(num) {
  let c = carrierDetect(num)
  carrierRow.textContent = c ? `Carrier: ${c}` : ''
}

function showResult(isValid, value) {
  resultsDiv.classList.remove('valid', 'invalid')
  if (value.length < 8) {
    resultsDiv.textContent = ''
    carrierRow.textContent = ''
    return
  }
  if (isValid) {
    resultsDiv.textContent = `Valid Nepali number: ${value}`
    resultsDiv.classList.add('valid')
  } else {
    resultsDiv.textContent = `Invalid Nepali number: ${value}`
    resultsDiv.classList.add('invalid')
  }
  updateCarrier(value)
}


padButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    let curr = userInput.textContent
    let val = btn.textContent
    if (btn.classList.contains('del')) {
      userInput.textContent = curr.slice(0, -1)
    } else {
      if (curr.length < 13) userInput.textContent = curr + val
    }
    updateCarrier(userInput.textContent)
    resultsDiv.textContent = ''
    resultsDiv.classList.remove('valid', 'invalid')
  })
})

// Keyboard input (contenteditable)
userInput.addEventListener('input', function() {
  let txt = userInput.textContent
  let clean = txt.replace(/[^0-9+]/g, '').slice(0, 13)
  if (clean !== txt) {
    userInput.textContent = clean
    let range = document.createRange()
    let sel = window.getSelection()
    range.selectNodeContents(userInput)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  }
  updateCarrier(clean)
  resultsDiv.textContent = ''
  resultsDiv.classList.remove('valid', 'invalid')
})

checkBtn.addEventListener('click', () => {
  let num = userInput.textContent.trim()
  if (num.length === 0) {
    alert('Please provide a phone number')
    return
  }
  let isValid = isValidNepaliNumber(num)
  showResult(isValid, num)
})

clearBtn.addEventListener('click', () => {
  userInput.textContent = ''
  resultsDiv.textContent = ''
  resultsDiv.classList.remove('valid', 'invalid')
  carrierRow.textContent = ''
})

userInput.addEventListener('focus', () => {
  userInput.style.borderColor = '#38b2ea'
})

userInput.addEventListener('blur', () => {
  userInput.style.borderColor = '#d1f8ee'
})
