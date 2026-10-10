const messageInput = document.getElementById("message");
const checkerForm = document.getElementById("checkerForm");
const clearBtn = document.getElementById("clearBtn");
const charCount = document.getElementById("charCount");
const inputError = document.getElementById("inputError");
const results = document.getElementById("results");
const riskCard = document.getElementById("riskCard");
const riskIcon = document.getElementById("riskIcon");
const riskLevel = document.getElementById("riskLevel");
const riskSummary = document.getElementById("riskSummary");
const signalCount = document.getElementById("signalCount");
const signalsList = document.getElementById("signals");
const adviceList = document.getElementById("advice");

const samples = {
  urgent:
    "URGENT! Your bank account will be blocked today. Verify your account immediately using this link and share your OTP to avoid suspension.",
  prize:
    "Congratulations! You have won a free prize. Pay a processing fee immediately to claim your reward.",
  normal:
    "Hi everyone, our Java study group meets in the library at 3 PM tomorrow. Please bring your notes."
};

const riskCopy = {
  high: {
    label: "Several warning signs matched",
    icon: "!",
    summary: "Take extra care before responding. Don’t follow the message’s instructions until you have checked them independently."
  },
  medium: {
    label: "A few warning signs matched",
    icon: "◌",
    summary: "It may be worth a closer look. Check who sent it and verify any request through a channel you already trust."
  },
  low: {
    label: "Few common signs matched",
    icon: "✓",
    summary: "This text matched few of the patterns we check. That is not proof it is genuine or safe."
  }
};

const nextSteps = [
  "Pause before replying, paying, or opening anything.",
  "Never share a password, PIN, or one-time code—even with someone claiming to be support.",
  "Verify the request using the organization’s official app, website, or a phone number you already know.",
  "If you already sent money in India, contact your bank promptly and call 1930 to report suspected cyber financial fraud."
];

function addListItem(list, text) {
  const item = document.createElement("li");
  item.textContent = text;
  list.appendChild(item);
}

function analyzeMessage() {
  const message = messageInput.value.trim();
  inputError.hidden = true;

  if (!message) {
    results.hidden = true;
    inputError.textContent = "Paste a message first, or choose an example below.";
    inputError.hidden = false;
    messageInput.focus();
    return;
  }

  const analysis = window.ScamShieldAnalyzer.analyzeMessage(message);
  const copy = riskCopy[analysis.tier];

  riskCard.className = `risk-card tier-${analysis.tier}`;
  riskIcon.textContent = copy.icon;
  riskLevel.textContent = copy.label;
  riskSummary.textContent = copy.summary;
  signalCount.textContent = `${analysis.matchedRules.length} ${analysis.matchedRules.length === 1 ? "signal" : "signals"}`;
  signalsList.replaceChildren();
  adviceList.replaceChildren();

  if (analysis.matchedRules.length === 0) {
    addListItem(signalsList, "No patterns from this limited check were detected.");
  } else {
    analysis.matchedRules.forEach(rule => addListItem(signalsList, rule.message));
  }

  nextSteps.forEach(step => addListItem(adviceList, step));
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

checkerForm.addEventListener("submit", event => {
  event.preventDefault();
  analyzeMessage();
});

clearBtn.addEventListener("click", () => {
  messageInput.value = "";
  charCount.textContent = "0 / 5000";
  inputError.hidden = true;
  results.hidden = true;
  messageInput.focus();
});

messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 5000`;
  inputError.hidden = true;
});

document.querySelectorAll("[data-sample]").forEach(button => {
  button.addEventListener("click", () => {
    messageInput.value = samples[button.dataset.sample] || "";
    charCount.textContent = `${messageInput.value.length} / 5000`;
    inputError.hidden = true;
    analyzeMessage();
  });
});
