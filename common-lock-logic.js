const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwLsPA823kSpsoEi5Ms6KnqHIbqEZHxD3uqOztdWPOesuijZqYCir0uiAIVfkO6gN7zeA/execl';  // Replace with your deployed Apps Script URL
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
  const failSound = document.getElementById("incorrect");
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

/**
 * Prompt teacher password and show reset button if correct
 */
function promptTeacherPassword() {
  const password = prompt("Enter teacher password to unlock reset:");
  if (password === SECRET_TOKEN) {
    const btn = document.getElementById("resetBtn");
    if (btn) btn.style.display = "inline-block";
    alert("Reset button enabled.");
  } else if (password) {
    alert("Incorrect password.");
  }
}

/**
 * Reset all progress by calling backend reset endpoint
 */
async function resetAllProgress() {
  try {
    const response = await fetch(API_BASE_URL + '/resetProgress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: SECRET_TOKEN }),
    });
    const data = await response.json();
    if (data.status === 'ok') {
      alert("All progress has been reset.");
      location.reload();
    } else {
      alert("Reset failed: " + data.message);
    }
  } catch (error) {
    alert("Error resetting progress: " + error.message);
  }
}
