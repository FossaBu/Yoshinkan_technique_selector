// Extract unique values for attacks, techniques and numbers
const attacks = Array.from(new Set(TECHNIQUES.map(item => item.attack)));
const techniques = Array.from(new Set(TECHNIQUES.map(item => item.technique)));
// If number is empty string, use a placeholder '*' for display
const numbersRaw = TECHNIQUES.map(item => item.number === '' ? '*' : item.number);
const numbers = Array.from(new Set(numbersRaw));

// DOM elements
const lever = document.getElementById('lever');
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const overlay = document.getElementById('result-overlay');
const latinName = document.getElementById('latin-name');
const japaneseName = document.getElementById('japanese-name');
const videoLink = document.getElementById('video-link');
const suwariArea = document.getElementById('suwari-area');
const suwariButton = document.getElementById('suwari-spin');
const closeOverlay = document.getElementById('close-overlay');

// Ensure the overlay is hidden on initial load.
// This is a safeguard against CSS caching issues on GitHub Pages where
// the `.hidden` class might not override `display: flex` from the overlay
// style. By explicitly setting `display: none` when the page loads, we
// guarantee that the result overlay remains hidden until a technique is
// selected.
document.addEventListener('DOMContentLoaded', () => {
  overlay.classList.add('hidden');
  overlay.style.display = 'none';
});

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to spin a single slot
function spinSlot(element, list, finalValue, duration, callback) {
  let elapsed = 0;
  const intervalTime = 100;
  const timer = setInterval(() => {
    // Show random value during spin
    const rand = randomFrom(list);
    element.textContent = rand;
    elapsed += intervalTime;
    if (elapsed >= duration) {
      clearInterval(timer);
      // Set to the final predetermined value when done
      element.textContent = finalValue;
      if (typeof callback === 'function') callback();
    }
  }, intervalTime);
}

// Display result overlay
function showResult(item) {
  // Build the latin and Japanese names
  const numberSuffix = item.number ? ` (${item.number})` : '';
  latinName.textContent = `${item.attack} ${item.technique}${numberSuffix}`;
  japaneseName.textContent = `${item.attack_jp} ${item.technique_jp}${numberSuffix}`;
  videoLink.href = item.video || '#';
  // Suwari variant handling
  if (item.suwariPossible) {
    suwariArea.classList.remove('hidden');
    suwariButton.onclick = () => {
      // 1 in 6 chance to trigger suwari variant
      const roll = Math.floor(Math.random() * 6);
      if (roll === 0) {
        const suNumberSuffix = item.number ? ` (${item.number})` : '';
        latinName.textContent = `suwari-waza ${item.attack} ${item.technique}${suNumberSuffix}`;
        japaneseName.textContent = `座技 ${item.attack_jp} ${item.technique_jp}${suNumberSuffix}`;
        videoLink.href = item.suwariVideo || item.video || '#';
      } else {
        alert('No suwari-waza this time!');
      }
    };
  } else {
    suwariArea.classList.add('hidden');
  }
  overlay.classList.remove('hidden');
  // Explicitly show the overlay in case inline styles were used to hide it
  overlay.style.display = 'flex';
}

// Spin the machine when the lever is pulled
lever.addEventListener('click', () => {
  lever.disabled = true;
  // Pick a random valid technique entry as the final result
  const chosen = TECHNIQUES[Math.floor(Math.random() * TECHNIQUES.length)];
  const finalAttack = chosen.attack;
  const finalTechnique = chosen.technique;
  const finalNumber = chosen.number === '' ? '*' : chosen.number;
  // Spin slots with staggered durations
  spinSlot(slot1, attacks, finalAttack, 1800);
  spinSlot(slot2, techniques, finalTechnique, 2300);
  spinSlot(slot3, numbers, finalNumber, 2800, () => {
    // After spinning, show the result
    showResult(chosen);
    lever.disabled = false;
  });
});

// Close the overlay when the close button is clicked
closeOverlay.addEventListener('click', () => {
  overlay.classList.add('hidden');
  // Hide the overlay explicitly when closed
  overlay.style.display = 'none';
});