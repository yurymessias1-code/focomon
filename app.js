const LEGACY_STORAGE_KEY = "focumon-state-v1";
const ACCOUNTS_KEY = "focumon-accounts-v1";
const CATALOG_TARGET = 160;

const PALETTES = [
  ["#dffbff", "#4b8cff", "#2c3e9f"],
  ["#ffe38f", "#ff7b6e", "#b83f5e"],
  ["#c9ffb8", "#34a853", "#116b4f"],
  ["#fff2a8", "#f79d29", "#8f4d00"],
  ["#e4d2ff", "#8a6bff", "#4d3fa8"],
  ["#d7f9ff", "#64d2ff", "#277da1"],
  ["#ffd6e2", "#ff6b91", "#9d2d62"],
  ["#f7d6a7", "#c89152", "#795238"],
  ["#cdf7e7", "#55c989", "#157a6e"],
  ["#fefae0", "#dda15e", "#bc6c25"],
  ["#e6f0ff", "#7aa2ff", "#4759c8"],
  ["#e7fff1", "#2ec4b6", "#0c6b70"],
];

const STARTERS = [
  {
    id: "foc-001-lumio",
    number: 1,
    name: "Lumio",
    element: "Luz",
    trait: "Calmo, constante e bom para rotinas longas.",
    colors: ["#fff2a8", "#4b8cff", "#2c3e9f"],
  },
  {
    id: "foc-002-flarim",
    number: 2,
    name: "Flarim",
    element: "Brasa",
    trait: "Energetico, otimo para comecar sem enrolar.",
    colors: ["#ffe38f", "#ff7b6e", "#b83f5e"],
  },
  {
    id: "foc-003-folhico",
    number: 3,
    name: "Folhico",
    element: "Folha",
    trait: "Paciente, cresce melhor em sessoes consistentes.",
    colors: ["#c9ffb8", "#34a853", "#116b4f"],
  },
  {
    id: "foc-004-aquarel",
    number: 4,
    name: "Aquarel",
    element: "Agua",
    trait: "Leve, fluido e bom para estudar sem pressa.",
    colors: ["#d7f9ff", "#64d2ff", "#277da1"],
  },
];

const PREFIXES = [
  "Bris",
  "Nebu",
  "Flor",
  "Grav",
  "Soni",
  "Vol",
  "Mira",
  "Zeni",
  "Pingo",
  "Voro",
  "Luma",
  "Rupi",
  "Dori",
  "Teka",
  "Ferro",
  "Nilo",
  "Cris",
  "Bora",
  "Quila",
  "Auri",
  "Moxi",
  "Tuni",
  "Vela",
  "Juba",
  "Rai",
  "Cacto",
  "Bento",
  "Lirio",
  "Onix",
  "Paxi",
  "Gelo",
  "Coral",
];

const SUFFIXES = [
  "mon",
  "lin",
  "puff",
  "nix",
  "tiko",
  "lume",
  "bop",
  "zor",
  "melo",
  "rino",
  "dino",
  "tico",
  "flim",
  "doro",
  "vivo",
  "mim",
];

const ELEMENTS = [
  "Luz",
  "Brasa",
  "Folha",
  "Agua",
  "Vento",
  "Cristal",
  "Raio",
  "Terra",
  "Neve",
  "Metal",
  "Som",
  "Sonho",
];

const GENERATED_FOCUMON = Array.from({ length: CATALOG_TARGET - STARTERS.length }, (_, index) => {
  const number = STARTERS.length + index + 1;
  const prefix = PREFIXES[index % PREFIXES.length];
  const suffix = SUFFIXES[Math.floor(index / PREFIXES.length) % SUFFIXES.length];
  const name = `${prefix}${suffix}`;

  return {
    id: `foc-${String(number).padStart(3, "0")}-${slugify(name)}`,
    number,
    name,
    element: ELEMENTS[index % ELEMENTS.length],
    trait: `Aparece depois de periodos de foco.`,
    colors: PALETTES[index % PALETTES.length],
  };
});

const CATALOG = [...STARTERS, ...GENERATED_FOCUMON];

const elements = {
  timeLeft: document.querySelector("#timeLeft"),
  progressBar: document.querySelector("#progressBar"),
  sessionStatus: document.querySelector("#sessionStatus"),
  todayMinutes: document.querySelector("#todayMinutes"),
  coinCount: document.querySelector("#coinCount"),
  accountSwitchBtn: document.querySelector("#accountSwitchBtn"),
  accountName: document.querySelector("#accountName"),
  musicToggleBtn: document.querySelector("#musicToggleBtn"),
  totalSessions: document.querySelector("#totalSessions"),
  streakDays: document.querySelector("#streakDays"),
  totalHours: document.querySelector("#totalHours"),
  forestCount: document.querySelector("#forestCount"),
  catalogCount: document.querySelector("#catalogCount"),
  weekBars: document.querySelector("#weekBars"),
  forestGrid: document.querySelector("#forestGrid"),
  catalogGrid: document.querySelector("#catalogGrid"),
  starterGrid: document.querySelector("#starterGrid"),
  starterModal: document.querySelector("#starterModal"),
  accountModal: document.querySelector("#accountModal"),
  accountForm: document.querySelector("#accountForm"),
  accountUsername: document.querySelector("#accountUsername"),
  accountPin: document.querySelector("#accountPin"),
  createAccountBtn: document.querySelector("#createAccountBtn"),
  closeAccountModalBtn: document.querySelector("#closeAccountModalBtn"),
  accountMessage: document.querySelector("#accountMessage"),
  accountList: document.querySelector("#accountList"),
  activeSprite: document.querySelector("#activeSprite"),
  taskInput: document.querySelector("#taskInput"),
  customMinutes: document.querySelector("#customMinutes"),
  startPauseBtn: document.querySelector("#startPauseBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  durationButtons: [...document.querySelectorAll(".duration-btn")],
  blockForm: document.querySelector("#blockForm"),
  blockInput: document.querySelector("#blockInput"),
  blockTags: document.querySelector("#blockTags"),
  clearDataBtn: document.querySelector("#clearDataBtn"),
  treeTemplate: document.querySelector("#treeTemplate"),
  catalogTemplate: document.querySelector("#catalogTemplate"),
};

let accountStore = loadAccounts();
let activeAccount = getActiveAccount();
let accountModalOpen = !activeAccount;
let state = loadState();
let timer = {
  duration: state.durationMinutes * 60,
  remaining: state.durationMinutes * 60,
  targetTime: null,
  intervalId: null,
  running: false,
};

const LOFI_BEAT = 60 / 78;
const LOFI_CHORDS = [
  [261.63, 329.63, 392],
  [220, 277.18, 329.63],
  [246.94, 311.13, 369.99],
  [196, 246.94, 293.66],
];
const LOFI_BASS = [65.41, 65.41, 55, 55, 61.74, 61.74, 49, 49];

let lofi = {
  context: null,
  master: null,
  intervalId: null,
  nextTime: 0,
  step: 0,
  playing: false,
  noiseBuffer: null,
};

render();
bindEvents();

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function defaultState() {
  return {
    starterId: null,
    partnerId: null,
    capturedIds: [],
    seenIds: [],
    coins: 0,
    musicMuted: false,
    partnerPeriods: {},
    sessions: [],
    blocklist: ["redes sociais", "notificacoes"],
    durationMinutes: 25,
    task: "",
  };
}

function loadAccounts() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNTS_KEY));
    return normalizeAccountStore(stored);
  } catch {
    return { activeAccountId: null, accounts: [] };
  }
}

function normalizeAccountStore(stored) {
  if (!stored || typeof stored !== "object") {
    return { activeAccountId: null, accounts: [] };
  }

  const accounts = Array.isArray(stored.accounts)
    ? stored.accounts
        .filter((account) => account && typeof account === "object")
        .map((account) => ({
          id: typeof account.id === "string" ? account.id : accountIdFor(account.name || ""),
          name: cleanAccountName(account.name || account.id || "Treinador"),
          pin: typeof account.pin === "string" ? account.pin : "",
          createdAt: account.createdAt || new Date().toISOString(),
          updatedAt: account.updatedAt || account.createdAt || new Date().toISOString(),
          state: normalizeState(account.state),
        }))
    : [];

  const activeAccountId = accounts.some((account) => account.id === stored.activeAccountId)
    ? stored.activeAccountId
    : accounts[0]?.id || null;

  return { activeAccountId, accounts };
}

function persistAccounts() {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accountStore));
}

function getActiveAccount() {
  return accountStore.accounts.find((account) => account.id === accountStore.activeAccountId) || null;
}

function cleanAccountName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 24);
}

function accountIdFor(value) {
  const cleaned = cleanAccountName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || `treinador-${Date.now()}`;
}

function findAccountByName(value) {
  const id = accountIdFor(value);
  return accountStore.accounts.find((account) => account.id === id) || null;
}

function loadLegacyState() {
  try {
    const stored = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    return stored ? normalizeState(stored) : null;
  } catch {
    return null;
  }
}

function loadState() {
  return activeAccount ? normalizeState(activeAccount.state) : defaultState();
}

function normalizeState(stored) {
  const base = defaultState();
  if (!stored || typeof stored !== "object") return base;

  const migratedCaptured = Array.isArray(stored.capturedIds)
    ? stored.capturedIds
    : Array.isArray(stored.unlockedIds)
      ? stored.unlockedIds
      : [];
  const migratedSeen = Array.isArray(stored.seenIds)
    ? stored.seenIds
    : [...migratedCaptured, ...STARTERS.map((starter) => starter.id)];

  const knownIds = new Set(CATALOG.map((species) => species.id));
  const capturedIds = unique(migratedCaptured.filter((id) => knownIds.has(id)));
  const seenIds = unique(migratedSeen.filter((id) => knownIds.has(id)));

  if (stored.starterId && knownIds.has(stored.starterId) && !capturedIds.includes(stored.starterId)) {
    capturedIds.push(stored.starterId);
  }

  const partnerId = knownIds.has(stored.partnerId) && capturedIds.includes(stored.partnerId)
    ? stored.partnerId
    : capturedIds[0] || null;

  return {
    ...base,
    ...stored,
    capturedIds,
    seenIds: unique([...seenIds, ...capturedIds]),
    coins: clampNumber(stored.coins, 0, 999999, 0),
    musicMuted: Boolean(stored.musicMuted),
    partnerId,
    partnerPeriods: stored.partnerPeriods && typeof stored.partnerPeriods === "object" ? stored.partnerPeriods : {},
    sessions: Array.isArray(stored.sessions) ? stored.sessions : [],
    blocklist: Array.isArray(stored.blocklist) ? stored.blocklist : base.blocklist,
    durationMinutes: clampNumber(stored.durationMinutes, 5, 180, 25),
    task: typeof stored.task === "string" ? stored.task : "",
  };
}

function saveState() {
  if (!activeAccount) return;
  activeAccount.state = normalizeState(state);
  activeAccount.updatedAt = new Date().toISOString();
  persistAccounts();
}

function bindEvents() {
  elements.startPauseBtn.addEventListener("click", toggleTimer);
  elements.resetBtn.addEventListener("click", resetTimer);
  elements.musicToggleBtn.addEventListener("click", toggleMusicMute);
  elements.accountSwitchBtn.addEventListener("click", () => openAccountModal());
  elements.accountForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginAccount();
  });
  elements.createAccountBtn.addEventListener("click", createAccount);
  elements.closeAccountModalBtn.addEventListener("click", closeAccountModal);
  elements.taskInput.addEventListener("input", () => {
    state.task = elements.taskInput.value;
    saveState();
  });

  elements.customMinutes.addEventListener("change", () => {
    const minutes = clampNumber(elements.customMinutes.value, 5, 180, 25);
    setDuration(minutes);
  });

  elements.durationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setDuration(Number(button.dataset.minutes));
    });
  });

  elements.blockForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = elements.blockInput.value.trim();
    if (!value) return;
    if (!state.blocklist.includes(value)) {
      state.blocklist.push(value);
      saveState();
      renderBlocklist();
    }
    elements.blockInput.value = "";
  });

  elements.clearDataBtn.addEventListener("click", () => {
    if (!activeAccount) {
      openAccountModal("Entre em uma conta antes de limpar progresso.");
      return;
    }

    const confirmed = window.confirm(`Limpar progresso, capturas, moedas e historico de ${activeAccount.name}?`);
    if (!confirmed) return;
    state = defaultState();
    saveState();
    resetTimer();
    render();
  });
}

function openAccountModal(message = "") {
  if (timer.running) {
    pauseTimer();
  }

  accountModalOpen = true;
  renderAccountList();
  setAccountMessage(message);
  elements.accountModal.classList.remove("hidden");
  elements.accountUsername.focus();
}

function closeAccountModal() {
  if (!activeAccount) {
    setAccountMessage("Crie ou entre em uma conta para continuar.", true);
    return;
  }

  accountModalOpen = false;
  setAccountMessage("");
  elements.accountModal.classList.add("hidden");
}

function createAccount() {
  const name = cleanAccountName(elements.accountUsername.value);
  const pin = elements.accountPin.value.trim();

  if (!name) {
    setAccountMessage("Digite um nome para a conta.", true);
    return;
  }

  if (pin.length < 4) {
    setAccountMessage("Use um PIN com pelo menos 4 caracteres.", true);
    return;
  }

  if (findAccountByName(name)) {
    setAccountMessage("Essa conta ja existe. Digite o PIN e clique em Entrar.", true);
    return;
  }

  const now = new Date().toISOString();
  const importedState = accountStore.accounts.length === 0 ? loadLegacyState() : null;
  const account = {
    id: accountIdFor(name),
    name,
    pin,
    createdAt: now,
    updatedAt: now,
    state: importedState || defaultState(),
  };

  accountStore.accounts.push(account);
  accountStore.activeAccountId = account.id;
  persistAccounts();
  activateAccount(account, "Conta criada. Seu progresso agora fica separado aqui.");
}

function loginAccount() {
  const name = cleanAccountName(elements.accountUsername.value);
  const pin = elements.accountPin.value.trim();
  const account = findAccountByName(name);

  if (!account) {
    setAccountMessage("Conta nao encontrada. Voce pode criar uma nova.", true);
    return;
  }

  if (account.pin !== pin) {
    setAccountMessage("PIN incorreto para essa conta.", true);
    return;
  }

  accountStore.activeAccountId = account.id;
  persistAccounts();
  activateAccount(account, `Bem-vindo de volta, ${account.name}.`);
}

function activateAccount(account, message) {
  stopLofi();
  activeAccount = account;
  state = normalizeState(account.state);
  accountModalOpen = false;
  elements.accountPin.value = "";
  resetTimerForState();
  saveState();
  render();
  setAccountMessage(message);
}

function resetTimerForState() {
  timer.running = false;
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.duration = state.durationMinutes * 60;
  timer.remaining = timer.duration;
  timer.targetTime = null;
  document.body.classList.remove("is-running", "is-complete");
  setStartButton("Iniciar", false);
}

function setAccountMessage(message, isError = false) {
  elements.accountMessage.textContent = message;
  elements.accountMessage.classList.toggle("error", Boolean(isError));
}

function toggleMusicMute() {
  state.musicMuted = !state.musicMuted;
  saveState();

  if (state.musicMuted) {
    stopLofi();
  } else if (timer.running) {
    startLofi();
  }

  renderMusicButton();
}

function startLofi() {
  if (state.musicMuted) {
    renderMusicButton();
    return;
  }

  const context = ensureLofiContext();
  if (!context) return;

  context.resume?.();
  lofi.master.gain.cancelScheduledValues(context.currentTime);
  lofi.master.gain.setTargetAtTime(0.16, context.currentTime, 0.12);

  if (lofi.playing) return;

  lofi.playing = true;
  lofi.step = 0;
  lofi.nextTime = context.currentTime + 0.04;
  scheduleLofi();
  lofi.intervalId = window.setInterval(scheduleLofi, 120);
  renderMusicButton();
}

function stopLofi() {
  if (lofi.intervalId) {
    window.clearInterval(lofi.intervalId);
    lofi.intervalId = null;
  }

  lofi.playing = false;

  if (lofi.context && lofi.master) {
    lofi.master.gain.cancelScheduledValues(lofi.context.currentTime);
    lofi.master.gain.setTargetAtTime(0.0001, lofi.context.currentTime, 0.08);
  }

  renderMusicButton();
}

function ensureLofiContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    elements.sessionStatus.textContent = "Este navegador nao conseguiu iniciar a musica lofi.";
    return null;
  }

  if (lofi.context) return lofi.context;

  const context = new AudioContextConstructor();
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  master.gain.value = 0.0001;
  compressor.threshold.value = -26;
  compressor.knee.value = 24;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.012;
  compressor.release.value = 0.22;
  master.connect(compressor);
  compressor.connect(context.destination);

  lofi.context = context;
  lofi.master = master;
  lofi.noiseBuffer = createNoiseBuffer(context);
  return context;
}

function scheduleLofi() {
  const context = lofi.context;
  if (!context || !lofi.playing) return;

  while (lofi.nextTime < context.currentTime + 0.7) {
    scheduleLofiStep(lofi.step, lofi.nextTime);
    lofi.step += 1;
    lofi.nextTime += LOFI_BEAT;
  }
}

function scheduleLofiStep(step, time) {
  const chordIndex = Math.floor(step / 8) % LOFI_CHORDS.length;
  const chord = LOFI_CHORDS[chordIndex];

  if (step % 8 === 0) {
    playChord(chord, time, LOFI_BEAT * 7.6);
  }

  if (step % 2 === 0) {
    playKick(time);
  }

  if (step % 4 === 2) {
    playSnare(time + LOFI_BEAT * 0.04);
  }

  playHat(time + LOFI_BEAT * 0.48);

  const bassNote = LOFI_BASS[step % LOFI_BASS.length];
  if ([0, 3, 4, 6].includes(step % 8)) {
    playTone(bassNote, "sine", time, LOFI_BEAT * 0.9, 0.12, 420);
  }
}

function playChord(notes, time, duration) {
  notes.forEach((note, index) => {
    playTone(note, "triangle", time + index * 0.018, duration, 0.036, 1250, index * 5 - 5);
    playTone(note / 2, "sine", time + index * 0.018, duration, 0.018, 760, index * -3);
  });
}

function playKick(time) {
  const context = lofi.context;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(92, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.18);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.18, time + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
  osc.connect(gain);
  gain.connect(lofi.master);
  osc.start(time);
  osc.stop(time + 0.32);
}

function playSnare(time) {
  playNoise(time, 0.15, 0.055, "bandpass", 1200);
  playTone(188, "triangle", time, 0.11, 0.035, 900);
}

function playHat(time) {
  playNoise(time, 0.045, 0.02, "highpass", 5200);
}

function playTone(frequency, type, time, duration, peakGain, filterFrequency, detune = 0) {
  const context = lofi.context;
  const osc = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, time);
  osc.detune.value = detune;
  filter.type = "lowpass";
  filter.frequency.value = filterFrequency;
  filter.Q.value = 0.8;

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(peakGain, time + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(lofi.master);
  osc.start(time);
  osc.stop(time + duration + 0.05);
}

function playNoise(time, duration, peakGain, filterType, filterFrequency) {
  const context = lofi.context;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = lofi.noiseBuffer;
  filter.type = filterType;
  filter.frequency.value = filterFrequency;
  filter.Q.value = 0.9;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(peakGain, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(lofi.master);
  source.start(time);
  source.stop(time + duration + 0.02);
}

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function renderMusicButton() {
  elements.musicToggleBtn.classList.toggle("is-muted", state.musicMuted);
  const label = state.musicMuted ? "Ativar musica" : "Silenciar musica";
  elements.musicToggleBtn.setAttribute("aria-label", label);
  elements.musicToggleBtn.title = label;
}

function setDuration(minutes) {
  if (timer.running) return;
  state.durationMinutes = clampNumber(minutes, 5, 180, 25);
  timer.duration = state.durationMinutes * 60;
  timer.remaining = timer.duration;
  saveState();
  renderTimer();
  renderDurationControls();
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function unique(values) {
  return [...new Set(values)];
}

function toggleTimer() {
  if (!activeAccount) {
    openAccountModal("Entre em uma conta para salvar sua sessao.");
    return;
  }

  if (!state.partnerId) {
    elements.starterModal.classList.remove("hidden");
    return;
  }

  if (timer.running) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (timer.remaining <= 0) {
    timer.remaining = timer.duration;
  }

  timer.running = true;
  timer.targetTime = Date.now() + timer.remaining * 1000;
  document.body.classList.add("is-running");
  document.body.classList.remove("is-complete");
  setStartButton("Pausar", true);
  elements.sessionStatus.textContent = runningStatus();
  startLofi();
  timer.intervalId = window.setInterval(tick, 250);
  tick();
}

function pauseTimer() {
  timer.running = false;
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  document.body.classList.remove("is-running");
  setStartButton("Continuar", false);
  stopLofi();
  elements.sessionStatus.textContent = "Pausado. Seu Focumon esta guardando energia.";
}

function resetTimer() {
  timer.running = false;
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.duration = state.durationMinutes * 60;
  timer.remaining = timer.duration;
  timer.targetTime = null;
  document.body.classList.remove("is-running", "is-complete");
  setStartButton("Iniciar", false);
  stopLofi();
  renderTimer();
  renderPartnerStatus();
}

function tick() {
  const nextRemaining = Math.max(0, Math.ceil((timer.targetTime - Date.now()) / 1000));
  if (nextRemaining !== timer.remaining) {
    timer.remaining = nextRemaining;
    renderTimer();
  }

  if (timer.remaining <= 0) {
    completeSession();
  }
}

function completeSession() {
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.running = false;
  timer.remaining = 0;
  document.body.classList.remove("is-running");
  document.body.classList.add("is-complete");
  setStartButton("Nova sessao", false);
  stopLofi();

  const partner = getPartner();
  const minutes = Math.round(timer.duration / 60);
  const task = state.task.trim() || "Foco livre";
  const completedAt = new Date().toISOString();
  const coinsEarned = sessionCoins(minutes);
  const revealed = revealNextFocumon(revealCountFor(minutes));

  state.coins += coinsEarned;
  state.partnerPeriods[partner.id] = (state.partnerPeriods[partner.id] || 0) + 1;
  state.sessions.unshift({
    id: `${Date.now()}-${partner.id}`,
    speciesId: partner.id,
    task,
    minutes,
    coinsEarned,
    completedAt,
  });

  saveState();
  render();
  renderTimer(1);

  const revealText = revealed.length
    ? ` Novos selvagens: ${revealed.map((species) => species.name).join(", ")}.`
    : " Todos os Focumon ja foram revelados.";
  elements.sessionStatus.textContent = `Periodo completo: +${coinsEarned} moedas.${revealText}`;
}

function sessionCoins(minutes) {
  return Math.max(15, Math.round(minutes * 1.25));
}

function revealCountFor(minutes) {
  return Math.min(4, Math.max(1, 1 + Math.floor(minutes / 25)));
}

function revealNextFocumon(count) {
  const seen = new Set(state.seenIds);
  const revealed = [];

  for (const species of CATALOG) {
    if (revealed.length >= count) break;
    if (!seen.has(species.id)) {
      state.seenIds.push(species.id);
      seen.add(species.id);
      revealed.push(species);
    }
  }

  return revealed;
}

function chooseStarter(speciesId) {
  const species = CATALOG.find((item) => item.id === speciesId);
  if (!species) return;

  state.starterId = species.id;
  state.partnerId = species.id;
  state.capturedIds = [species.id];
  state.seenIds = unique([...STARTERS.map((starter) => starter.id), species.id]);
  state.partnerPeriods[species.id] = state.partnerPeriods[species.id] || 0;
  saveState();
  elements.starterModal.classList.add("hidden");
  render();
}

function captureSpecies(speciesId) {
  if (timer.running) return;

  const species = CATALOG.find((item) => item.id === speciesId);
  if (!species || !state.seenIds.includes(species.id) || state.capturedIds.includes(species.id)) return;

  const cost = captureCost(species);
  if (state.coins < cost) {
    elements.sessionStatus.textContent = `Faltam ${cost - state.coins} moedas para capturar ${species.name}.`;
    return;
  }

  state.coins -= cost;
  state.capturedIds.push(species.id);
  state.partnerId = species.id;
  state.partnerPeriods[species.id] = state.partnerPeriods[species.id] || 0;
  saveState();
  render();
  elements.sessionStatus.textContent = `${species.name} capturado por ${cost} moedas. Ele agora esta na area Capturados.`;
}

function captureCost(species) {
  if (STARTERS.some((starter) => starter.id === species.id)) return 25;
  const tier = Math.floor((species.number - 1) / 20);
  return 30 + tier * 10;
}

function render() {
  renderAccountButton();
  renderAccountList();
  elements.taskInput.value = state.task || "";
  elements.customMinutes.value = state.durationMinutes;
  renderStarterPicker();
  renderDurationControls();
  renderActiveSprite();
  renderTimer();
  renderStats();
  renderWeek();
  renderBlocklist();
  renderCollection();
  renderCatalog();
  renderMusicButton();
  renderPartnerStatus();
  elements.accountModal.classList.toggle("hidden", !accountModalOpen);
  elements.starterModal.classList.toggle("hidden", !activeAccount || Boolean(state.partnerId));
}

function renderAccountButton() {
  elements.accountName.textContent = activeAccount ? activeAccount.name : "Sem conta";
}

function renderAccountList() {
  elements.accountList.innerHTML = "";

  if (!accountStore.accounts.length) {
    const empty = document.createElement("div");
    empty.className = "account-list-empty";
    empty.textContent = "Nenhuma conta criada ainda.";
    elements.accountList.append(empty);
    return;
  }

  accountStore.accounts.forEach((account) => {
    const accountState = normalizeState(account.state);
    const button = document.createElement("button");
    const text = document.createElement("span");
    const name = document.createElement("strong");
    const meta = document.createElement("span");
    const status = document.createElement("small");

    button.className = "account-list-item";
    button.type = "button";
    name.textContent = account.name;
    meta.textContent = `${accountState.coins} moedas - ${accountState.capturedIds.length} capturados`;
    status.textContent = activeAccount?.id === account.id ? "ativa" : "usar";
    text.append(name, meta);
    button.append(text, status);
    button.addEventListener("click", () => {
      elements.accountUsername.value = account.name;
      elements.accountPin.focus();
      setAccountMessage("Digite o PIN e clique em Entrar.");
    });
    elements.accountList.append(button);
  });
}

function renderStarterPicker() {
  elements.starterGrid.innerHTML = "";
  STARTERS.forEach((starter) => {
    const button = document.createElement("button");
    button.className = "starter-option";
    button.type = "button";
    button.innerHTML = `${pixelSpriteSvg(starter, "starter")}<div><strong>${starter.name}</strong><span>${starter.element} - ${starter.trait}</span></div>`;
    button.addEventListener("click", () => chooseStarter(starter.id));
    elements.starterGrid.append(button);
  });
}

function renderDurationControls() {
  elements.customMinutes.value = state.durationMinutes;
  elements.durationButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.minutes) === state.durationMinutes);
  });
}

function renderActiveSprite() {
  const partner = getPartner() || STARTERS[0];
  elements.activeSprite.innerHTML = pixelSpriteSvg(partner, "large");
  elements.activeSprite.setAttribute("aria-label", `${partner.name} parceiro`);
}

function renderTimer(forcedProgress) {
  const progress = typeof forcedProgress === "number" ? forcedProgress : 1 - timer.remaining / timer.duration;
  const cleanProgress = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  document.documentElement.style.setProperty("--focus-progress", cleanProgress.toFixed(4));
  elements.timeLeft.textContent = formatTime(timer.remaining);
}

function renderPartnerStatus() {
  if (!state.partnerId) {
    elements.sessionStatus.textContent = "Escolha seu primeiro Focumon para comecar.";
    return;
  }

  if (timer.running) {
    elements.sessionStatus.textContent = runningStatus();
    return;
  }

  if (timer.remaining <= 0) return;

  const partner = getPartner();
  const periods = state.partnerPeriods[partner.id] || 0;
  elements.sessionStatus.textContent = `${partner.name} - ${evolutionStage(periods)} - conclua periodos para ganhar moedas e revelar selvagens.`;
}

function renderStats() {
  const sessions = state.sessions;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.minutes, 0);
  const todayMinutes = sessions
    .filter((session) => dateKey(new Date(session.completedAt)) === dateKey(new Date()))
    .reduce((sum, session) => sum + session.minutes, 0);

  elements.todayMinutes.textContent = todayMinutes;
  elements.coinCount.textContent = state.coins;
  elements.totalSessions.textContent = sessions.length;
  elements.streakDays.textContent = calculateStreak(sessions);
  elements.totalHours.textContent = formatTotalHours(totalMinutes);
}

function renderWeek() {
  elements.weekBars.innerHTML = "";
  const days = lastSevenDays();
  const minutesByDay = new Map();
  state.sessions.forEach((session) => {
    const key = dateKey(new Date(session.completedAt));
    minutesByDay.set(key, (minutesByDay.get(key) || 0) + session.minutes);
  });
  const maxMinutes = Math.max(25, ...days.map((day) => minutesByDay.get(dateKey(day)) || 0));

  days.forEach((day) => {
    const minutes = minutesByDay.get(dateKey(day)) || 0;
    const dayNode = document.createElement("div");
    dayNode.className = "week-day";
    dayNode.title = `${minutes} minutos`;

    const fill = document.createElement("div");
    fill.className = "week-fill";
    fill.style.height = `${Math.max(8, (minutes / maxMinutes) * 100)}%`;

    const label = document.createElement("small");
    label.textContent = day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");

    dayNode.append(fill, label);
    elements.weekBars.append(dayNode);
  });
}

function renderBlocklist() {
  elements.blockTags.innerHTML = "";
  state.blocklist.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "x";
    button.setAttribute("aria-label", `Remover ${item}`);
    button.addEventListener("click", () => {
      state.blocklist = state.blocklist.filter((entry) => entry !== item);
      saveState();
      renderBlocklist();
    });

    tag.append(button);
    elements.blockTags.append(tag);
  });
}

function renderCollection() {
  const captured = capturedSpecies();
  elements.forestCount.textContent = `${captured.length} capturados`;
  elements.forestGrid.innerHTML = "";

  if (!captured.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Escolha um inicial para abrir sua area de capturados.";
    elements.forestGrid.append(empty);
    return;
  }

  captured.forEach((species) => {
    const node = elements.treeTemplate.content.firstElementChild.cloneNode(true);
    node.classList.toggle("active", species.id === state.partnerId);
    node.setAttribute("role", "button");
    node.tabIndex = 0;
    node.title = `Usar ${species.name} como parceiro`;
    node.querySelector(".sprite-slot").innerHTML = pixelSpriteSvg(species, "small");
    node.querySelector("strong").textContent = species.name;
    node.querySelector("span").textContent = `${species.element} - ${evolutionStage(state.partnerPeriods[species.id] || 0)}`;
    node.addEventListener("click", () => setPartner(species.id));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setPartner(species.id);
      }
    });
    elements.forestGrid.append(node);
  });
}

function renderCatalog() {
  const seen = new Set(state.seenIds);
  const captured = new Set(state.capturedIds);
  elements.catalogCount.textContent = `${captured.size}/${CATALOG.length}`;
  elements.catalogGrid.innerHTML = "";

  CATALOG.forEach((species) => {
    const isSeen = seen.has(species.id);
    const isCaptured = captured.has(species.id);
    const node = elements.catalogTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".capture-btn");
    const cost = captureCost(species);

    node.classList.toggle("locked", !isSeen);
    node.classList.toggle("seen", isSeen && !isCaptured);
    node.classList.toggle("captured", isCaptured);
    node.querySelector(".sprite-slot").innerHTML = pixelSpriteSvg(species, "tiny");
    node.querySelector(".catalog-number").textContent = `#${String(species.number).padStart(3, "0")}`;
    node.querySelector("strong").textContent = isSeen ? species.name : "???";

    if (isCaptured) {
      node.querySelector(".catalog-meta").textContent = `${species.element} - capturado`;
      button.textContent = "capturado";
      button.disabled = true;
    } else if (isSeen) {
      node.querySelector(".catalog-meta").textContent = `${species.element} - ${cost} moedas`;
      button.textContent = state.coins >= cost ? "capturar" : `${cost} moedas`;
      button.disabled = state.coins < cost;
      button.addEventListener("click", () => captureSpecies(species.id));
    } else {
      node.querySelector(".catalog-meta").textContent = `revelar focando`;
      button.textContent = "bloq.";
      button.disabled = true;
    }

    elements.catalogGrid.append(node);
  });
}

function setPartner(speciesId) {
  if (timer.running || !state.capturedIds.includes(speciesId)) return;
  state.partnerId = speciesId;
  saveState();
  renderActiveSprite();
  renderCollection();
  renderPartnerStatus();
}

function capturedSpecies() {
  const captured = new Set(state.capturedIds);
  return CATALOG.filter((species) => captured.has(species.id));
}

function getPartner() {
  return CATALOG.find((species) => species.id === state.partnerId);
}

function setStartButton(label, paused) {
  const icon = elements.startPauseBtn.querySelector(".icon");
  const text = elements.startPauseBtn.querySelector("span:last-child");
  text.textContent = label;
  icon.className = `icon ${paused ? "pause-icon" : "play-icon"}`;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatTotalHours(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h${minutes}` : `${hours}h`;
}

function runningStatus() {
  const task = state.task.trim() || "Foco livre";
  const distractions = state.blocklist.length ? ` longe de ${state.blocklist.slice(0, 2).join(", ")}` : "";
  return `${task}${distractions}.`;
}

function evolutionStage(periods) {
  if (periods >= 12) return "forma mestre";
  if (periods >= 7) return "forma rara";
  if (periods >= 3) return "forma evoluida";
  if (periods >= 1) return "recem-chocado";
  return "ovo de foco";
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function lastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
}

function calculateStreak(sessions) {
  const activeDays = new Set(sessions.map((session) => dateKey(new Date(session.completedAt))));
  let streak = 0;
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  while (activeDays.has(dateKey(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

function pixelSpriteSvg(species, size) {
  const [light, main, dark] = species.colors;
  const outline = "#1d2428";
  const white = "#fff8dc";
  const cheek = "#ff7b6e";
  const eye = "#101820";
  const variant = species.number % 5;

  const cells = [
    ...rects(commonOutline(), outline),
    ...rects(commonBody(), main),
    ...rects(commonShade(), dark),
    ...rects(commonLight(), light),
    ...rects(commonBelly(), white),
    ...rects(commonEyes(), eye),
    ...rects(commonCheeks(), cheek),
  ];

  if (variant === 0) {
    cells.push(...rects([[5, 1], [10, 1], [4, 2, 2, 1], [10, 2, 2, 1]], outline));
    cells.push(...rects([[5, 2], [10, 2]], light));
  }

  if (variant === 1) {
    cells.push(...rects([[3, 6], [2, 7], [2, 8], [13, 6], [14, 7], [14, 8]], outline));
    cells.push(...rects([[3, 7], [13, 7]], dark));
  }

  if (variant === 2) {
    cells.push(...rects([[6, 0], [9, 0], [6, 1], [9, 1]], outline));
    cells.push(...rects([[6, 2], [9, 2]], light));
  }

  if (variant === 3) {
    cells.push(...rects([[12, 8], [13, 8], [13, 9], [14, 9]], outline));
    cells.push(...rects([[12, 7], [13, 7], [12, 9]], dark));
  }

  if (variant === 4) {
    cells.push(...rects([[7, 0, 2, 1], [6, 1, 4, 1]], outline));
    cells.push(...rects([[7, 1, 2, 1]], light));
  }

  return `<svg class="pixel-sprite ${size}" viewBox="0 0 16 16" aria-hidden="true">${cells.join("")}</svg>`;
}

function rects(items, fill) {
  return items.map(([x, y, width = 1, height = 1]) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`);
}

function commonOutline() {
  return [
    [5, 2, 1, 2],
    [10, 2, 1, 2],
    [4, 4, 8, 1],
    [3, 5, 10, 5],
    [4, 10, 8, 2],
    [5, 12, 6, 2],
    [4, 14, 3, 1],
    [9, 14, 3, 1],
  ];
}

function commonBody() {
  return [
    [5, 4, 6, 1],
    [4, 5, 8, 1],
    [4, 6, 8, 4],
    [5, 10, 6, 2],
    [6, 12, 4, 1],
  ];
}

function commonShade() {
  return [
    [10, 5, 2, 1],
    [11, 6, 1, 4],
    [9, 10, 2, 1],
    [8, 12, 2, 1],
  ];
}

function commonLight() {
  return [
    [5, 5, 2, 1],
    [4, 6, 1, 2],
    [6, 4, 1, 1],
  ];
}

function commonBelly() {
  return [
    [6, 9, 4, 1],
    [6, 10, 4, 1],
    [7, 11, 2, 1],
  ];
}

function commonEyes() {
  return [
    [5, 7],
    [10, 7],
    [7, 8, 2, 1],
  ];
}

function commonCheeks() {
  return [
    [4, 8],
    [11, 8],
  ];
}
