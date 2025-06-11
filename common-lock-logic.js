
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
