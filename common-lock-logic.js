const API_BASE_URL = 'https://your-apps-script-webapp-url';  // Replace with your actual URL
const SECRET_TOKEN = 'yourSecret123';  // Replace with your secret token

function showUnlocked() {
  document.body.classList.add("unlocked");
  const successSound = document.getElementById("celebrate");
  if (successSound) successSound.play();
  const result = document.getElementById("result");
  if (result) result.textContent = "✅ Unlocked!";
}

function showLockedOut() {
  document.body.classList.add("lockedout");
  const failSound = document.getElementById("buzzer");
  if (failSound) failSound.play();
  const result = document.getElementById("result");
  if (result) result.textContent = "❌ LOCKED OUT!";
}

function showAttemptMessage(attempts, maxAttempts) {
  const result = document.getElementById("result");
  if (result) result.textContent = `❌ Try again. (${attempts}/${maxAttempts})`;
}

function loadGroupName() {
  const savedGroup = localStorage.getItem("groupName");
  if (savedGroup) {
    const input = document.getElementById("groupNameInput");
    if (input) {
      input.value = savedGroup;
      document.getElementById("groupNameContainer").style.display = "none";
      document.getElementById("lockInterface").classList.remove("locked");
    }
  }
}

/**
 * Fetch progress from backend API
 * @param {string} groupName
 * @param {string} lockName
 * @returns {Promise<{attempts:number, solved:boolean}>}
 */
async function loadProgress(groupName, lockName) {
  const url = `${API_BASE_URL}?group=${encodeURIComponent(groupName)}&lock=${encodeURIComponent(lockName)}&token=${SECRET_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to load progress');
  return response.json();
}

/**
 * Save progress to backend API
 * @param {string} groupName
 * @param {string} lockName
 * @param {number} attempts
 * @param {boolean} solved
 * @returns {Promise<object>}
 */
async function saveProgress(groupName, lockName, attempts, solved) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group: groupName, lock: lockName, attempts, solved, token: SECRET_TOKEN }),
  });
  if (!response.ok) throw new Error('Failed to save progress');
  return response.json();
}
