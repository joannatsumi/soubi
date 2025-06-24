const wordItems = [
  { label: "4S", value: "4S" }, { label: "5S", value: "5S" },
  { label: "7S", value: "7S" }, { label: "8S", value: "8S" },
  { label: "SR", value: "SR" }, { label: "LEATHER", value: "LEATHER" },
  { label: "1P-SEAT", value: "1P-SEAT" }, { label: "2P-SEAT", value: "2P-SEAT" },
  { label: "MEMORY", value: "MEMORY" }, { label: "1PD", value: "1PD" },
  { label: "2PD", value: "2PD" }, { label: "PB", value: "PB" },
  { label: "DPA", value: "DisplayAudio" }, { label: "NAVI(M)", value: "NAVI(M)" },
  { label: "NAVI(D)", value: "NAVI(D)" }, { label: "360VIEW", value: "360VIEW" },
  { label: "BC", value: "BC" }, { label: "THEATER", value: "THEATER" },
  { label: "C-TV(D)", value: "C-TV(D)" }, { label: "JBL", value: "JBL" },
  { label: "DM", value: "Digital Inner Mirror" }, { label: "BSM", value: "BlindSpotMonitor" },
  { label: "HUD", value: "HeadUpDisplay" }, { label: "UniversalStep", value: "UniversalStep" },
  { label: "3LED", value: "3LED" }, { label: "LED", value: "LED" },
  { label: "CoolBox", value: "CoolBox" }, { label: "P-CRASH", value: "P-CRASH" },
  { label: "CMBS", value: "CMBS" }, { label: "SAFETY", value: "SAFETY-SUPPORT" },
  { label: "BK", value: "BK" }, { label: "AW", value: "AW" },
  { label: "MAT", value: "MAT" }, { label: "AUDIOLESS", value: "AUDIOLESS" },
  { label: "MUFFLER", value: "MUFFLER" }
];

const exclusivePairs = {
  "4S": ["5S", "7S", "8S"], "5S": ["4S", "7S", "8S"],
  "7S": ["4S", "5S", "8S"], "8S": ["4S", "5S", "7S"],
  "1PD": ["2PD"], "2PD": ["1PD"],
  "1P-SEAT": ["2P-SEAT"], "2P-SEAT": ["1P-SEAT"],
  "DisplayAudio": ["NAVI(M)", "NAVI(D)", "AUDIOLESS"],
  "NAVI(M)": ["DisplayAudio", "NAVI(D)", "AUDIOLESS"],
  "NAVI(D)": ["DisplayAudio", "NAVI(M)", "AUDIOLESS"],
  "AUDIOLESS": ["DisplayAudio", "NAVI(M)", "NAVI(D)", "JBL"],
  "JBL": ["AUDIOLESS"],
  "360VIEW": ["BC"], "BC": ["360VIEW"],
  "THEATER": ["C-TV(D)"], "C-TV(D)": ["THEATER"],
  "3LED": ["LED"], "LED": ["3LED"],
  "P-CRASH": ["CMBS", "SAFETY-SUPPORT"],
  "CMBS": ["P-CRASH", "SAFETY-SUPPORT"],
  "SAFETY-SUPPORT": ["P-CRASH", "CMBS"]
};

const selectedWords = new Set();
const container = document.getElementById('buttonContainer');

wordItems.forEach(({ label, value }) => {
  const btn = document.createElement('div');
  btn.textContent = label;
  btn.className = 'word-button';
  btn.onclick = () => toggleWord(btn, value);
  btn.id = `btn-${value.replace(/\W/g, '_')}`;
  container.appendChild(btn);
});

const clearBtn = document.createElement('button');
clearBtn.textContent = '全てクリア';
clearBtn.className = 'word-button clear-button';
clearBtn.onclick = clearAll;
container.appendChild(clearBtn);

function toggleWord(btn, value) {
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    selectedWords.delete(value);
  } else {
    if (exclusivePairs[value]) {
      for (const conflict of exclusivePairs[value]) {
        if (selectedWords.has(conflict)) {
          alert(`「${value}」は「${conflict}」と同時に選択できません`);
          return;
        }
      }
    }
    btn.classList.add('selected');
    selectedWords.add(value);
  }
  updateInput();
}

function updateInput() {
  const input = document.getElementById('chatInput');
  const currentText = input.value;

  const lines = currentText.split(/\n+/);
  const preservedLines = [];

  lines.forEach(line => {
    const words = line.trim().split(/\s+/).filter(w => w);
    const manualWords = words.filter(word => !wordItems.some(item => item.value === word));
    if (manualWords.length > 0) {
      preservedLines.push(manualWords.join(' '));
    }
  });

  const ordered = wordItems.map(item => item.value).filter(value => selectedWords.has(value));
  if (ordered.length > 0) {
    preservedLines.push(ordered.join(' '));
  }

  input.value = preservedLines.join('\n');
}

function syncFromInput() {
  const input = document.getElementById('chatInput');
  const currentText = input.value;
  const splitWords = currentText.split(/\s+/).filter(w => w);
  selectedWords.clear();
  wordItems.forEach(({ label, value }) => {
    const btn = document.getElementById(`btn-${value.replace(/\W/g, '_')}`);
    if (splitWords.includes(value)) {
      btn.classList.add('selected');
      selectedWords.add(value);
    } else {
      btn.classList.remove('selected');
    }
  });
}

function clearAll() {
  selectedWords.clear();
  document.querySelectorAll('.word-button').forEach(btn => btn.classList.remove('selected'));
  document.getElementById('chatInput').value = '';
}

function copyToClipboard() {
  const input = document.getElementById('chatInput');
  input.select();
  document.execCommand('copy');
  alert('コピーしました！');
}