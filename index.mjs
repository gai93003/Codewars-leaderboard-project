import { fetchUserData, allUsersDetails } from "./fetchs.mjs";

const selectLanguage = document.getElementById('select-language');
const submitBtn = document.getElementById('submit-btn');
const tbody = document.getElementById('scoreTable');
const message = document.getElementById('message');
const table = document.getElementById('table-details');

const populateDropDown = () => {
  const languages = ['JavaScript', 'Python', 'SQL', 'Typescript', 'C++', 'Java', 'Ruby', 'C#', 'C'];
  for (const language of languages) {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = language;
    selectLanguage.appendChild(option);
  }
};

function updateTable(users, lang = null) {
  const langKey = lang ? lang.toLowerCase() : null;

  tbody.innerHTML = '';

  for (const { username, clan, ranks } of users) {
    const row = document.createElement('tr');

    const tdUser = document.createElement('td');
    tdUser.textContent = username;

    const tdClan = document.createElement('td');
    tdClan.textContent = clan || '';

    const tdOverall = document.createElement('td');
    tdOverall.textContent = ranks.overall.score;

    const tdLang = document.createElement('td');
    tdLang.textContent = langKey && ranks.languages[langKey]
      ? ranks.languages[langKey].score
      : '';

    row.appendChild(tdUser);
    row.appendChild(tdClan);
    row.appendChild(tdOverall);
    row.appendChild(tdLang);

    tbody.appendChild(row);
  }
}

submitBtn.addEventListener('click', async () => {
  const userInput = document.getElementById('input-el').value.trim();
  message.textContent = '';
  table.style.display = 'none';

  if (!userInput) {
    alert("Please enter at least one username.");
    return;
  }

  const userNames = userInput.split(',').map(name => name.trim());
  const data = await allUsersDetails(userNames);
  if (data.length === 0) return;

  const selectedLang = selectLanguage.value;
  if (selectedLang) {
    const langKey = selectedLang.toLowerCase();
    const filtered = data.filter(u => u.ranks.languages[langKey]);
    if (filtered.length === 0) {
      message.textContent = `None of the users trained in ${selectedLang}`;
    }
    updateTable(filtered.length ? filtered : data, selectedLang);
  } else {
    updateTable(data);
  }

  table.style.display = 'table';
});

selectLanguage.addEventListener('change', async () => {
  const userInput = document.getElementById('input-el').value.trim();
  if (!userInput) return;

  const userNames = userInput.split(',').map(name => name.trim());
  const data = await allUsersDetails(userNames);
  if (data.length === 0) return;

  const selectedLang = selectLanguage.value;
  const langKey = selectedLang.toLowerCase();
  const filtered = data.filter(u => u.ranks.languages[langKey]);
  if (filtered.length === 0) {
    message.textContent = `None of the users trained in ${selectedLang}`;
  } else {
    message.textContent = '';
  }

  updateTable(filtered.length ? filtered : data, selectedLang);
  table.style.display = 'table';
});

populateDropDown();
