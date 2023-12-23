// Nicked from https://stackoverflow.com/a/35385518/1709587
function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

// Nicked from https://stackoverflow.com/a/33292942/1709587
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Nicked from https://stackoverflow.com/a/54510488/1709587
function luhnCheck(cardNumber) {
  var oddSum = 0;
  var evenSum = 0;
  for (var i = 0; i < cardNumber.length; i++) {
    if (i % 2 === 0) {
      if (cardNumber[i] * 2 >= 10) {
        evenSum += cardNumber[i] * 2 - 9;
      } else {
        evenSum += cardNumber[i] * 2;
      }
    } else {
      oddSum += parseInt(cardNumber[i]);
    }
  }
  return (oddSum + evenSum) % 10 === 0;
}
