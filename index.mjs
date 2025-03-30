// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

// export function makeFetchRequest() {
//   return fetch("https://example.com/test");
// }

const selectLanguage = document.getElementById('select-language');
const submitBtn = document.getElementById('submit-btn');
const tbody = document.getElementById('scoreTable');
const table = document.getElementById('table-details');
const message = document.getElementById('message');

const populateDropDown = () => {
  const languages = ['JavaScript', 'Python', 'SQL', 'Typescript', 'C++', 'Java', 'Ruby', 'C#', 'C'];

  for (const language of languages) {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = language;
    selectLanguage.appendChild(option)
  }

}

async function fetchUserData(userName) {
  const url = `https://www.codewars.com/api/v1/users/${userName}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

async function allUsersDetails(userNames) {
  const overallData = await Promise.all(userNames.map(fetchUserData));

  return overallData.filter(user => user !== null);
}


submitBtn.addEventListener('click', async () => {
  const userInput = document.getElementById('input-el').value.trim();
  message.textContent = '';

  if (!userInput) {
    alert("Please enter a username.");
    return;
  }

  let userNames = userInput.split(',').map(name => name.trim());

  table.style.display = 'block';
  tbody.innerHTML = '';

  if (!selectLanguage.value) {
    await defaultSort(userNames);
  }
  else {
    await rankByLanguage(selectLanguage.value, userNames);
  }
});


async function rankByLanguage(lang, users) {
  const data = await allUsersDetails(users);
  const langKey = lang.toLowerCase();

  const specificLang = data.filter(user => user.ranks.languages[langKey]);

  if (specificLang.length === 0) {
    message.textContent = `None of the users trained in ${lang}`;
    tbody.innerHTML = '';
    table.style.display = 'none'
    return;
  }

  message.textContent = '';
  table.style.display = 'block';

  specificLang.sort((a, b) => (b.ranks.languages[langKey].score || 0) - (a.ranks.languages[langKey].score || 0));

  tbody.innerHTML = '';

  for (const { username, clan, ranks } of specificLang) {
    const row = document.createElement('tr');
    
    const tdUser = document.createElement('td');
    tdUser.textContent = username;

    const tdClan = document.createElement('td');
    tdClan.textContent = clan || '';

    const tdScore = document.createElement('td');
    tdScore.textContent = ranks.languages[langKey].score || 0;

    row.appendChild(tdUser);
    row.appendChild(tdClan);
    row.appendChild(tdScore);

    tbody.appendChild(row);
  }
}


async function defaultSort(users) {
  const data = await allUsersDetails(users);

  data.sort((a, b) => b.ranks.overall.score - a.ranks.overall.score);

  tbody.innerHTML = '';
  for (const { username, clan, ranks } of data) {
    const row = document.createElement('tr');
    
    const tdUser = document.createElement('td');
    tdUser.textContent = username;

    const tdClan = document.createElement('td');
    tdClan.textContent = clan || '';

    const tdScore = document.createElement('td');
    tdScore.textContent = ranks.overall.score;

    row.appendChild(tdUser);
    row.appendChild(tdClan);
    row.appendChild(tdScore);

    tbody.appendChild(row);
  }
}

selectLanguage.addEventListener('change', async ()=> {
  const userInput = document.getElementById('input-el').value.trim();

  if (!userInput) return;

  let userNames = userInput.split(',').map(name => name.trim());

  await rankByLanguage(selectLanguage.value, userNames);
})


populateDropDown();
