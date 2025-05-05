export async function fetchUserData(userName) {
  const url = `https://www.codewars.com/api/v1/users/${userName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("User not found");
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

export async function allUsersDetails(userNames) {
  const results = await Promise.all(userNames.map(fetchUserData));
  const validUsers = results.filter(user => user !== null);

  const invalidUsers = userNames.filter((_, i) => results[i] === null);
  
  if (invalidUsers.length > 0) {
    message.textContent = `The following users were not found: ${invalidUsers.join(', ')}`;
  } else {
    message.textContent = '';
  }

  return validUsers;
}

