/**
 * ============================================================================
 * WhatsApp Message Transmission & E2EE Protocol Simulator Engine
 * Clean Vanilla JavaScript (ES6+) - Interactive Network & Crypto Simulator
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Sound Effects Synthesizer (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    }

    playSendTone() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.15);
    }

    playTickTone(isDouble = false) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isDouble ? 950 : 700, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }

    playReceiveChime() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    }
  }

  // --- SVG Tick Icons ---
  const SVG_CLOCK = `
    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
    </svg>
  `;

  const SVG_SINGLE_TICK = `
    <svg viewBox="0 0 16 15" width="14" height="14" fill="#8696a0">
      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.118 12.385l-4.4-3.693a.365.365 0 0 0-.512.046l-.42.436a.365.365 0 0 0 .046.512l5.068 4.254c.068.057.155.088.243.088h.023c.091 0 .179-.033.245-.094l8.528-10.053a.365.365 0 0 0 .063-.565z"/>
    </svg>
  `;

  const SVG_DOUBLE_GREY_TICK = `
    <svg viewBox="0 0 16 15" width="14" height="14" fill="#8696a0">
      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.118 12.385l-4.4-3.693a.365.365 0 0 0-.512.046l-.42.436a.365.365 0 0 0 .046.512l5.068 4.254c.068.057.155.088.243.088h.023c.091 0 .179-.033.245-.094l8.528-10.053a.365.365 0 0 0 .063-.565z"/>
    </svg>
    <svg viewBox="0 0 16 15" width="14" height="14" fill="#8696a0" style="margin-left:-8px;">
      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.118 12.385l-4.4-3.693a.365.365 0 0 0-.512.046l-.42.436a.365.365 0 0 0 .046.512l5.068 4.254c.068.057.155.088.243.088h.023c.091 0 .179-.033.245-.094l8.528-10.053a.365.365 0 0 0 .063-.565z"/>
    </svg>
  `;

  const SVG_DOUBLE_BLUE_TICK = `
    <svg viewBox="0 0 16 15" width="14" height="14" fill="#53bdeb">
      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.118 12.385l-4.4-3.693a.365.365 0 0 0-.512.046l-.42.436a.365.365 0 0 0 .046.512l5.068 4.254c.068.057.155.088.243.088h.023c.091 0 .179-.033.245-.094l8.528-10.053a.365.365 0 0 0 .063-.565z"/>
    </svg>
    <svg viewBox="0 0 16 15" width="14" height="14" fill="#53bdeb" style="margin-left:-8px;">
      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.118 12.385l-4.4-3.693a.365.365 0 0 0-.512.046l-.42.436a.365.365 0 0 0 .046.512l5.068 4.254c.068.057.155.088.243.088h.023c.091 0 .179-.033.245-.094l8.528-10.053a.365.365 0 0 0 .063-.565z"/>
    </svg>
  `;

  // --- Simulator State Management ---
  const state = {
    currentStage: 0, // 0 = idle, 1..5
    isRunning: false,
    isPaused: false,
    speedMultiplier: 1.0,
    startTime: 0,
    pauseStartTime: 0,
    totalPausedTime: 0,
    activeTimeouts: [],
    logs: [],
    activeFilter: 'all',
    messageText: '',
    ciphertextHex: '',
    messageTimestamp: '9:41 AM',
    sound: new SoundEngine()
  };

  // --- DOM Elements ---
  const el = {
    // Buttons & Inputs
    msgInput: document.getElementById('msgInput'),
    startDemoBtn: document.getElementById('startDemoBtn'),
    stepDemoBtn: document.getElementById('stepDemoBtn'),
    pauseDemoBtn: document.getElementById('pauseDemoBtn'),
    resetDemoBtn: document.getElementById('resetDemoBtn'),
    simSpeed: document.getElementById('simSpeed'),
    presetBtn: document.getElementById('presetBtn'),
    presetMenu: document.getElementById('presetMenu'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    audioIcon: document.getElementById('audioIcon'),

    // Stepper
    stepperFill: document.getElementById('stepperFill'),
    stepNodes: [
      document.getElementById('step-node-1'),
      document.getElementById('step-node-2'),
      document.getElementById('step-node-3'),
      document.getElementById('step-node-4'),
      document.getElementById('step-node-5')
    ],

    // Topology
    currentPhaseLabel: document.getElementById('currentPhaseLabel'),
    topoAlice: document.getElementById('topo-alice'),
    topoDns: document.getElementById('topo-dns'),
    topoServer: document.getElementById('topo-server'),
    topoBob: document.getElementById('topo-bob'),
    packetParticle1: document.getElementById('packetParticle1'),
    packetParticle2: document.getElementById('packetParticle2'),
    packetParticle3: document.getElementById('packetParticle3'),
    segLabel1: document.getElementById('segLabel1'),
    segLabel2: document.getElementById('segLabel2'),
    segLabel3: document.getElementById('segLabel3'),

    // Stage 1 (Sender)
    cardStage1: document.getElementById('card-stage-1'),
    senderStatus: document.getElementById('senderStatus'),
    aliceBubbleArea: document.getElementById('aliceBubbleArea'),
    aliceMockInput: document.getElementById('aliceMockInput'),
    aliceSendActionBtn: document.getElementById('aliceSendActionBtn'),
    aliceEphemeralKey: document.getElementById('aliceEphemeralKey'),
    aliceRatchetStep: document.getElementById('aliceRatchetStep'),

    // Stage 2 (Network & DNS)
    cardStage2: document.getElementById('card-stage-2'),
    networkStatus: document.getElementById('networkStatus'),
    dnsBadge: document.getElementById('dnsBadge'),
    dnsStep1: document.getElementById('dnsStep1'),
    dnsStep2: document.getElementById('dnsStep2'),
    dnsStep3: document.getElementById('dnsStep3'),
    tcpBadge: document.getElementById('tcpBadge'),
    arrowSyn: document.getElementById('arrowSyn'),
    arrowSynAck: document.getElementById('arrowSynAck'),
    arrowAck: document.getElementById('arrowAck'),
    tlsBadge: document.getElementById('tlsBadge'),
    tlsStep1: document.getElementById('tlsStep1'),
    tlsStep2: document.getElementById('tlsStep2'),
    tlsStep3: document.getElementById('tlsStep3'),

    // Stage 3 (Server)
    cardStage3: document.getElementById('card-stage-3'),
    serverStatus: document.getElementById('serverStatus'),
    serverRawBox: document.getElementById('serverRawBox'),
    serverInspectBadge: document.getElementById('serverInspectBadge'),
    routingActionText: document.getElementById('routingActionText'),
    bobSocketState: document.getElementById('bobSocketState'),
    bobQueueState: document.getElementById('bobQueueState'),

    // Stage 4 (Receiver)
    cardStage4: document.getElementById('card-stage-4'),
    receiverStatus: document.getElementById('receiverStatus'),
    bobBubbleArea: document.getElementById('bobBubbleArea'),
    bobDecryptionBadge: document.getElementById('bobDecryptionBadge'),
    bobSharedSecret: document.getElementById('bobSharedSecret'),
    bobAuthTagStatus: document.getElementById('bobAuthTagStatus'),
    bobMsgState: document.getElementById('bobMsgState'),

    // Stage 5 (Security & Acknowledgements)
    cardStage5: document.getElementById('card-stage-5'),
    securityStatus: document.getElementById('securityStatus'),
    visPlaintext: document.getElementById('visPlaintext'),
    visCiphertext: document.getElementById('visCiphertext'),
    visDecrypted: document.getElementById('visDecrypted'),
    tickCardPending: document.getElementById('tickCardPending'),
    tickCardSent: document.getElementById('tickCardSent'),
    tickCardDelivered: document.getElementById('tickCardDelivered'),
    tickCardRead: document.getElementById('tickCardRead'),
    badgeClock: document.getElementById('badgeClock'),
    badgeSent: document.getElementById('badgeSent'),
    badgeDelivered: document.getElementById('badgeDelivered'),
    badgeRead: document.getElementById('badgeRead'),

    // Event Terminal
    eventLogStream: document.getElementById('eventLogStream'),
    logCountBadge: document.getElementById('logCountBadge'),
    clearLogBtn: document.getElementById('clearLogBtn'),
    copyLogBtn: document.getElementById('copyLogBtn'),
    filterBtns: document.querySelectorAll('.filter-btn')
  };

  // --- Cryptographic Helper Simulation ---
  function generateCipherSimulation(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    const seed = Math.abs(hash).toString(16).padStart(8, '0');
    const randomHex = Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return `0x${seed}a9f4${randomHex.substring(0, 36)}... [AES-256-GCM + IV(12B)]`;
  }

  // --- Scramble Matrix Text Animation ---
  function animateTextScramble(targetEl, finalString, duration = 800) {
    const chars = '0123456789ABCDEFabcdef!@#$%^&*~';
    const steps = 14;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        clearInterval(timer);
        targetEl.textContent = finalString;
      } else {
        const scrambled = finalString
          .split('')
          .map((char) => {
            if (char === ' ') return ' ';
            if (Math.random() > 0.5) return chars[Math.floor(Math.random() * chars.length)];
            return char;
          })
          .join('');
        targetEl.textContent = scrambled;
      }
    }, interval);
  }

  // --- Timing Helper supporting Pause & Speed multiplier ---
  function wait(ms) {
    return new Promise((resolve) => {
      let remaining = ms / state.speedMultiplier;
      let timerId = null;

      function step() {
        if (!state.isRunning) {
          resolve();
          return;
        }
        if (state.isPaused) {
          timerId = setTimeout(step, 80);
          state.activeTimeouts.push(timerId);
          return;
        }
        const slice = Math.min(60, remaining);
        timerId = setTimeout(() => {
          remaining -= slice;
          if (remaining <= 0) {
            resolve();
          } else {
            step();
          }
        }, slice);
        state.activeTimeouts.push(timerId);
      }

      step();
    });
  }

  function clearAllSimulationTimeouts() {
    state.activeTimeouts.forEach((id) => clearTimeout(id));
    state.activeTimeouts = [];
  }

  // --- Event Logger ---
  function getTimestamp() {
    if (!state.startTime) return '00:00.000';
    const elapsed = Date.now() - state.startTime - state.totalPausedTime;
    const mins = String(Math.floor(elapsed / 60000)).padStart(2, '0');
    const secs = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
    const ms = String(elapsed % 1000).padStart(3, '0');
    return `${mins}:${secs}.${ms}`;
  }

  function addLog(category, message, payload = null) {
    const time = getTimestamp();
    const logItem = { time, category, message, payload };
    state.logs.push(logItem);

    const entry = document.createElement('div');
    entry.className = `log-entry ${category.toLowerCase()}-entry`;
    entry.dataset.category = category;

    let badgeClass = 'badge-sys';
    if (category === 'NET') badgeClass = 'badge-net';
    if (category === 'CRYPTO') badgeClass = 'badge-crypto';
    if (category === 'SERVER') badgeClass = 'badge-server';
    if (category === 'ACK') badgeClass = 'badge-ack';

    let html = `
      <span class="log-time">[${time}]</span>
      <span class="log-badge ${badgeClass}">${category}</span>
      <span class="log-msg">${message}</span>
    `;

    if (payload) {
      html += `<div style="font-size:0.68rem; color:#94a3b8; margin-top:2px;">↳ <code>${payload}</code></div>`;
    }

    entry.innerHTML = html;

    // Filter check
    if (state.activeFilter !== 'all' && state.activeFilter !== category) {
      entry.style.display = 'none';
    }

    el.eventLogStream.appendChild(entry);
    el.eventLogStream.scrollTop = el.eventLogStream.scrollHeight;
    el.logCountBadge.textContent = `${state.logs.length} events`;
  }

  // --- UI Update Helpers ---
  function setActiveStageUI(stageNum) {
    state.currentStage = stageNum;

    // Progress bar fill
    const percentages = [0, 20, 40, 60, 80, 100];
    el.stepperFill.style.width = `${percentages[stageNum] || 0}%`;

    // Stepper node states
    el.stepNodes.forEach((node, idx) => {
      const nodeNum = idx + 1;
      node.classList.remove('active', 'completed');
      if (nodeNum < stageNum) {
        node.classList.add('completed');
      } else if (nodeNum === stageNum) {
        node.classList.add('active');
      }
    });

    // Stage cards highlight
    const cards = [el.cardStage1, el.cardStage2, el.cardStage3, el.cardStage4, el.cardStage5];
    cards.forEach((card, idx) => {
      if (idx + 1 === stageNum) {
        card.classList.add('stage-active');
      } else {
        card.classList.remove('stage-active');
      }
    });
  }

  function setTopologyActiveNode(nodeId) {
    [el.topoAlice, el.topoDns, el.topoServer, el.topoBob].forEach((node) => {
      if (node === nodeId) {
        node.classList.add('active-node');
      } else {
        node.classList.remove('active-node');
      }
    });
  }

  // --- Step 1: Alice Composes & Encrypts Message ---
  async function runStage1_Sender() {
    setActiveStageUI(1);
    setTopologyActiveNode(el.topoAlice);
    el.currentPhaseLabel.textContent = 'Stage 1/5: Sender preparing payload & generating Signal Protocol session keys';
    el.senderStatus.textContent = 'Encrypting';
    el.senderStatus.className = 'status-indicator processing';

    state.messageText = el.msgInput.value.trim() || 'Hello Bob! This is an E2EE WhatsApp message.';
    state.ciphertextHex = generateCipherSimulation(state.messageText);
    el.aliceMockInput.textContent = state.messageText;

    addLog('SYS', `Session initiated with target peer Bob (+1-555-0182)`);
    addLog('CRYPTO', `Generating Curve25519 Ephemeral Key pair for Double Ratchet...`);
    await wait(600);

    const ephemeralHex = `0x${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}..${Math.floor(Math.random() * 0xffff).toString(16)}`;
    el.aliceEphemeralKey.textContent = ephemeralHex;
    el.aliceRatchetStep.textContent = `Chain Key #${Math.floor(Math.random() * 50 + 10)}`;

    addLog('CRYPTO', `Applying AES-256-GCM authenticated cipher on plaintext: "${state.messageText}"`);
    el.visPlaintext.textContent = state.messageText;
    animateTextScramble(el.visCiphertext, state.ciphertextHex, 700);

    // Render message bubble in Alice's screen with Clock icon (Pending)
    el.aliceBubbleArea.innerHTML = `
      <div class="chat-bubble out" id="aliceCurrentMsg">
        <div class="chat-bubble-text">${escapeHtml(state.messageText)}</div>
        <div class="chat-bubble-meta">
          <span>${state.messageTimestamp}</span>
          <span class="tick-svg-icon" id="aliceMsgTick">${SVG_CLOCK}</span>
        </div>
      </div>
    `;

    // Update tick 0 in Stage 5 card
    el.tickCardPending.classList.add('active-tick');
    el.badgeClock.textContent = 'Active (Local Queue)';
    el.badgeClock.style.background = '#e0f2fe';
    el.badgeClock.style.color = '#0369a1';

    state.sound.playSendTone();
    await wait(700);

    el.senderStatus.textContent = 'Queued';
    el.senderStatus.className = 'status-indicator active';
    addLog('SYS', `Message enqueued into Alice local SQLite buffer. Awaiting network socket delivery.`);
  }

  // --- Step 2: DNS Resolution & TCP 3-Way Handshake ---
  async function runStage2_NetworkDNS() {
    setActiveStageUI(2);
    el.currentPhaseLabel.textContent = 'Stage 2/5: DNS Query & TCP 3-Way Handshake with WhatsApp Edge Gateway';
    el.networkStatus.textContent = 'Connecting';
    el.networkStatus.className = 'status-indicator processing';

    // Packet 1: DNS Query Alice -> DNS Server
    setTopologyActiveNode(el.topoDns);
    el.packetParticle1.className = 'packet-particle animate-forward';
    el.segLabel1.textContent = 'DNS Query (UDP 53)';
    addLog('NET', `Alice sends DNS query: "What is IP of c.whatsapp.net?" to DNS Resolver 8.8.8.8:53`);

    el.dnsBadge.textContent = 'Querying';
    el.dnsBadge.className = 'badge-mini active';
    el.dnsStep1.classList.add('resolved');
    await wait(700);

    el.dnsStep2.classList.add('resolved');
    addLog('NET', `DNS Cache Hit: c.whatsapp.net maps to 157.240.22.53 (TTL=60s)`);
    await wait(600);

    el.dnsStep3.classList.add('resolved');
    el.dnsBadge.textContent = 'Resolved: 157.240.22.53';
    el.packetParticle1.className = 'packet-particle'; // stop
    await wait(400);

    // Step 2.2: TCP 3-Way Handshake
    el.segLabel1.textContent = 'TCP SYN (Port 443)';
    el.packetParticle1.className = 'packet-particle animate-forward';
    addLog('NET', `Initiating TCP 3-Way Handshake: Alice ➔ WA Server [SYN, Seq=1000]`);
    el.arrowSyn.classList.add('active-flow');
    el.tcpBadge.textContent = 'SYN-SENT';
    state.sound.playTickTone();
    await wait(800);

    // SYN-ACK return
    setTopologyActiveNode(el.topoServer);
    el.packetParticle1.className = 'packet-particle animate-backward';
    el.segLabel1.textContent = 'TCP [SYN, ACK]';
    addLog('NET', `WhatsApp Server replies: [SYN, ACK, Seq=5000, Ack=1001]`);
    el.arrowSynAck.classList.add('active-flow');
    el.tcpBadge.textContent = 'SYN-RECEIVED';
    state.sound.playTickTone();
    await wait(800);

    // ACK establish
    setTopologyActiveNode(el.topoAlice);
    el.packetParticle1.className = 'packet-particle animate-forward';
    el.segLabel1.textContent = 'TCP [ACK]';
    addLog('NET', `Alice acknowledges: [ACK, Seq=1001, Ack=5001] - Connection ESTABLISHED`);
    el.arrowAck.classList.add('active-flow');
    el.tcpBadge.textContent = 'ESTABLISHED';
    el.tcpBadge.className = 'badge-mini active';
    await wait(600);
    el.packetParticle1.className = 'packet-particle';

    // Step 2.3: TLS 1.3 Handshake
    addLog('NET', `Performing TLS 1.3 handshake: ClientHello & ServerHello key exchange.`);
    el.tlsStep1.classList.add('secured');
    await wait(500);
    el.tlsStep2.classList.add('secured');
    await wait(500);
    el.tlsStep3.classList.add('secured');
    el.tlsBadge.textContent = 'TLS 1.3 Secured';
    el.tlsBadge.className = 'badge-mini active';
    addLog('NET', `TLS socket secure channel ready. Transport encryption active.`);

    el.networkStatus.textContent = 'Connected';
    el.networkStatus.className = 'status-indicator active';
    await wait(400);
  }

  // --- Step 3: WhatsApp Server Blind Relay ---
  async function runStage3_ServerRelay() {
    setActiveStageUI(3);
    setTopologyActiveNode(el.topoServer);
    el.currentPhaseLabel.textContent = 'Stage 3/5: WhatsApp Edge Server receives encrypted envelope and routes to Bob';
    el.serverStatus.textContent = 'Routing';
    el.serverStatus.className = 'status-indicator processing';

    // Packet from Alice to Server
    el.packetParticle2.className = 'packet-particle animate-forward';
    el.segLabel2.textContent = 'E2EE Payload (Ciphertext)';
    addLog('NET', `Transmitting encrypted payload from Alice socket (fd#4102) to WA Relay Server`);
    await wait(800);
    el.packetParticle2.className = 'packet-particle';

    // Display ciphertext on server inspector
    el.serverRawBox.innerHTML = `
      <div style="color:#a7f3d0; margin-bottom:4px;">[INBOUND FRAME - BLOB SIZE: 142 BYTES]</div>
      <div style="font-weight:600; color:#38bdf8;">${state.ciphertextHex}</div>
      <div style="margin-top:4px; color:#cbd5e1; font-size:0.66rem;">Metadata: from=Alice(+104), to=Bob(+182), msg_id=wamid.HBgLM...</div>
    `;

    el.routingActionText.innerHTML = `
      Routing Action: <span style="color:#4ade80;">MATCHED Bob on active socket <code>fd#5190</code>. Enqueueing delivery.</span>
    `;
    addLog('SERVER', `Server inspected packet headers: Destination resolved to Bob (+1-555-0182)`);
    addLog('SERVER', `Zero-Knowledge validation: Payload body is unreadable encrypted bytes. Relay authorized.`);

    // Server sends Single Grey Tick ACK back to Alice!
    const aliceMsgTick = document.getElementById('aliceMsgTick');
    if (aliceMsgTick) {
      aliceMsgTick.innerHTML = SVG_SINGLE_TICK;
    }
    el.tickCardSent.classList.add('active-tick');
    el.badgeSent.textContent = 'Achieved (Server Stored)';
    el.badgeSent.style.background = '#dcfce7';
    el.badgeSent.style.color = '#15803d';
    state.sound.playTickTone();
    addLog('ACK', `[SINGLE GREY TICK]: Server dispatched MessageReceived ACK back to Alice`);

    el.serverStatus.textContent = 'Forwarding';
    el.serverStatus.className = 'status-indicator active';
    await wait(700);
  }

  // --- Step 4: Bob Receives & Decrypts Message ---
  async function runStage4_Receiver() {
    setActiveStageUI(4);
    setTopologyActiveNode(el.topoBob);
    el.currentPhaseLabel.textContent = 'Stage 4/5: Pushing payload to Bob\'s device & running Curve25519 decryption';
    el.receiverStatus.textContent = 'Receiving';
    el.receiverStatus.className = 'status-indicator processing';

    // Packet Server to Bob
    el.packetParticle3.className = 'packet-particle animate-forward';
    el.segLabel3.textContent = 'Server Push Frame';
    addLog('NET', `Pushing encrypted message to Bob's device socket (10.0.0.82:58920)`);
    await wait(800);
    el.packetParticle3.className = 'packet-particle';

    el.bobSocketState.innerHTML = '<span class="badge-dot green"></span> Receiving';
    el.bobDecryptionBadge.textContent = 'Decrypting...';
    el.bobDecryptionBadge.className = 'badge-mini active';
    addLog('CRYPTO', `Bob's device receives payload. Executing ECDH key agreement with Alice's Ephemeral Key...`);

    el.bobSharedSecret.textContent = 'SharedKey: 0x88c2...d19b (Derived via X25519)';
    await wait(600);

    addLog('CRYPTO', `Verifying HMAC-SHA256 authentication tag... Integrity verified!`);
    el.bobAuthTagStatus.textContent = 'HMAC Tag Verified ✅';
    el.bobMsgState.textContent = 'Decrypted successfully';

    // Clear empty state and insert message into Bob's chat
    const bobEmptyState = document.getElementById('bobEmptyState');
    if (bobEmptyState) {
      bobEmptyState.remove();
    }

    el.bobBubbleArea.innerHTML = `
      <div class="chat-bubble in" id="bobCurrentMsg">
        <div class="chat-bubble-text" id="bobBubbleText">Decrypting...</div>
        <div class="chat-bubble-meta">
          <span>${state.messageTimestamp}</span>
        </div>
      </div>
    `;

    const bobBubbleText = document.getElementById('bobBubbleText');
    animateTextScramble(bobBubbleText, state.messageText, 600);
    animateTextScramble(el.visDecrypted, state.messageText, 600);
    state.sound.playReceiveChime();

    el.receiverStatus.textContent = 'Delivered';
    el.receiverStatus.className = 'status-indicator active';
    el.bobDecryptionBadge.textContent = 'Decrypted';
    addLog('SYS', `Plaintext displayed inside Bob's WhatsApp chat UI.`);
    await wait(800);
  }

  // --- Step 5: Acknowledgements & Read Receipts (Double Grey & Double Blue Ticks) ---
  async function runStage5_Acknowledgements() {
    setActiveStageUI(5);
    el.currentPhaseLabel.textContent = 'Stage 5/5: Delivery receipt (Double Grey ✓✓) & Read receipt (Double Blue ✓✓)';
    el.securityStatus.textContent = 'Acknowledging';
    el.securityStatus.className = 'status-indicator processing';

    // 1. Double Grey Tick (Delivered to Bob's phone)
    addLog('ACK', `Bob's device sends DeliveryReceipt packet back to WhatsApp Server`);
    el.packetParticle3.className = 'packet-particle animate-backward';
    el.segLabel3.textContent = 'DeliveryReceipt ACK';
    await wait(700);
    el.packetParticle3.className = 'packet-particle';

    el.packetParticle2.className = 'packet-particle animate-backward';
    el.segLabel2.textContent = 'Relaying DeliveryReceipt';
    await wait(700);
    el.packetParticle2.className = 'packet-particle';

    // Update Alice UI to Double Grey Tick
    const aliceMsgTick = document.getElementById('aliceMsgTick');
    if (aliceMsgTick) {
      aliceMsgTick.innerHTML = SVG_DOUBLE_GREY_TICK;
    }
    el.tickCardDelivered.classList.add('active-tick');
    el.badgeDelivered.textContent = 'Achieved (Delivered)';
    el.badgeDelivered.style.background = '#dcfce7';
    el.badgeDelivered.style.color = '#15803d';
    state.sound.playTickTone(true);
    addLog('ACK', `[DOUBLE GREY TICK]: Alice's app updated. Message successfully stored on Bob's hardware.`);
    await wait(1100);

    // 2. Double Blue Tick (Bob opens and reads the message)
    addLog('SYS', `User action simulated: Bob opens chat thread with Alice...`);
    addLog('ACK', `Bob's phone generates ReadReceipt packet (Timestamp: ${state.messageTimestamp})`);

    el.packetParticle3.className = 'packet-particle animate-backward';
    el.segLabel3.textContent = 'ReadReceipt ACK';
    await wait(700);
    el.packetParticle3.className = 'packet-particle';

    el.packetParticle2.className = 'packet-particle animate-backward';
    el.segLabel2.textContent = 'Relaying ReadReceipt';
    await wait(700);
    el.packetParticle2.className = 'packet-particle';

    // Update Alice UI to Double Blue Tick
    if (aliceMsgTick) {
      aliceMsgTick.innerHTML = SVG_DOUBLE_BLUE_TICK;
    }
    el.tickCardRead.classList.add('active-tick');
    el.badgeRead.textContent = 'Achieved (Read)';
    el.badgeRead.style.background = '#e0f2fe';
    el.badgeRead.style.color = '#0369a1';
    state.sound.playTickTone(true);
    addLog('ACK', `[DOUBLE BLUE TICK]: Alice's UI indicates Bob has read the message. End-to-end transmission cycle completed!`);

    el.securityStatus.textContent = 'Completed';
    el.securityStatus.className = 'status-indicator active';
    el.currentPhaseLabel.textContent = 'Demonstration Completed • All 5 Stages Successfully Simulated!';
  }

  // --- Main Full Demo Controller ---
  async function startFullDemo() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.isPaused = false;
    state.startTime = Date.now();
    state.totalPausedTime = 0;

    el.startDemoBtn.disabled = true;
    el.stepDemoBtn.disabled = true;
    el.pauseDemoBtn.disabled = false;
    el.msgInput.disabled = true;

    try {
      await runStage1_Sender();
      await wait(600);
      await runStage2_NetworkDNS();
      await wait(600);
      await runStage3_ServerRelay();
      await wait(600);
      await runStage4_Receiver();
      await wait(600);
      await runStage5_Acknowledgements();
    } catch (err) {
      console.error('Simulation interrupted:', err);
    } finally {
      state.isRunning = false;
      el.startDemoBtn.disabled = false;
      el.stepDemoBtn.disabled = false;
      el.pauseDemoBtn.disabled = true;
      el.msgInput.disabled = false;
    }
  }

  // --- Step-by-Step Mode (Ideal for classroom presentation) ---
  async function advanceOneStage() {
    if (state.isRunning) return;
    state.isRunning = true;
    el.startDemoBtn.disabled = true;
    el.stepDemoBtn.disabled = true;

    if (!state.startTime) state.startTime = Date.now();

    try {
      const nextStage = state.currentStage >= 5 ? 1 : state.currentStage + 1;
      if (nextStage === 1) {
        resetSimulationState(false);
        await runStage1_Sender();
      } else if (nextStage === 2) {
        await runStage2_NetworkDNS();
      } else if (nextStage === 3) {
        await runStage3_ServerRelay();
      } else if (nextStage === 4) {
        await runStage4_Receiver();
      } else if (nextStage === 5) {
        await runStage5_Acknowledgements();
      }
    } finally {
      state.isRunning = false;
      el.startDemoBtn.disabled = false;
      el.stepDemoBtn.disabled = false;
    }
  }

  // --- Reset Simulator ---
  function resetSimulationState(clearLogs = false) {
    clearAllSimulationTimeouts();
    state.isRunning = false;
    state.isPaused = false;
    state.currentStage = 0;
    state.startTime = 0;
    state.totalPausedTime = 0;

    el.startDemoBtn.disabled = false;
    el.stepDemoBtn.disabled = false;
    el.pauseDemoBtn.disabled = true;
    el.pauseDemoBtn.innerHTML = '<span class="icon">⏸</span> Pause';
    el.msgInput.disabled = false;

    // Reset Stepper & Topology
    el.stepperFill.style.width = '0%';
    el.stepNodes.forEach((node) => node.classList.remove('active', 'completed'));
    [el.cardStage1, el.cardStage2, el.cardStage3, el.cardStage4, el.cardStage5].forEach((c) =>
      c.classList.remove('stage-active')
    );
    [el.topoAlice, el.topoDns, el.topoServer, el.topoBob].forEach((n) => n.classList.remove('active-node'));
    [el.packetParticle1, el.packetParticle2, el.packetParticle3].forEach((p) => (p.className = 'packet-particle'));
    el.segLabel1.textContent = 'DNS Lookup / SYN';
    el.segLabel2.textContent = 'TLS 1.3 / E2EE Payload';
    el.segLabel3.textContent = 'Push Notification / Delivery';
    el.currentPhaseLabel.textContent = 'System Idle • Click "Start Full Demo" or enter a message';

    // Reset Stage 1
    el.senderStatus.textContent = 'Ready';
    el.senderStatus.className = 'status-indicator';
    el.aliceBubbleArea.innerHTML = '';
    el.aliceMockInput.textContent = 'Type a message...';
    el.aliceEphemeralKey.textContent = 'EK_a: 0x9e4f..88b1';
    el.aliceRatchetStep.textContent = 'Chain Key #14';

    // Reset Stage 2
    el.networkStatus.textContent = 'Waiting';
    el.networkStatus.className = 'status-indicator';
    el.dnsBadge.textContent = 'Pending';
    el.dnsBadge.className = 'badge-mini';
    [el.dnsStep1, el.dnsStep2, el.dnsStep3].forEach((s) => s.classList.remove('resolved'));
    el.tcpBadge.textContent = 'Closed';
    el.tcpBadge.className = 'badge-mini';
    [el.arrowSyn, el.arrowSynAck, el.arrowAck].forEach((a) => a.classList.remove('active-flow'));
    el.tlsBadge.textContent = 'Not Started';
    el.tlsBadge.className = 'badge-mini';
    [el.tlsStep1, el.tlsStep2, el.tlsStep3].forEach((s) => s.classList.remove('secured'));

    // Reset Stage 3
    el.serverStatus.textContent = 'Idle';
    el.serverStatus.className = 'status-indicator';
    el.serverRawBox.innerHTML = '<span class="payload-placeholder">Awaiting transmission packet...</span>';
    el.routingActionText.textContent = 'Routing Action: Waiting for inbound data segment';
    el.bobSocketState.innerHTML = '<span class="badge-dot green"></span> Connected';
    el.bobQueueState.textContent = '0 msgs';

    // Reset Stage 4
    el.receiverStatus.textContent = 'Waiting';
    el.receiverStatus.className = 'status-indicator';
    el.bobBubbleArea.innerHTML = `
      <div class="chat-empty-state" id="bobEmptyState">
        No new messages yet. Waiting for transmission...
      </div>
    `;
    el.bobDecryptionBadge.textContent = 'Standby';
    el.bobDecryptionBadge.className = 'badge-mini';
    el.bobSharedSecret.textContent = 'ECDH(Bob_Priv, Alice_Pub)';
    el.bobAuthTagStatus.textContent = 'HMAC Tag Valid ✅';
    el.bobMsgState.textContent = 'Awaiting payload';

    // Reset Stage 5
    el.securityStatus.textContent = 'Idle';
    el.securityStatus.className = 'status-indicator';
    el.visPlaintext.textContent = el.msgInput.value;
    el.visCiphertext.textContent = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855...';
    el.visDecrypted.textContent = 'Awaiting decryption step...';

    [el.tickCardPending, el.tickCardSent, el.tickCardDelivered, el.tickCardRead].forEach((c) =>
      c.classList.remove('active-tick')
    );
    el.badgeClock.textContent = 'Pending';
    el.badgeClock.style = '';
    el.badgeSent.textContent = 'Not Reached';
    el.badgeSent.style = '';
    el.badgeDelivered.textContent = 'Not Reached';
    el.badgeDelivered.style = '';
    el.badgeRead.textContent = 'Not Reached';
    el.badgeRead.style = '';

    if (clearLogs) {
      state.logs = [];
      el.eventLogStream.innerHTML = `
        <div class="log-entry system-entry">
          <span class="log-time">[00:00.000]</span>
          <span class="log-badge badge-sys">SYSTEM</span>
          <span class="log-msg">Simulator reset. Ready for demonstration. Type a message or click "Start Full Demo".</span>
        </div>
      `;
      el.logCountBadge.textContent = '0 events';
    } else {
      addLog('SYS', `Simulation state reset to idle.`);
    }
  }

  // --- Utility Helpers ---
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Start Demo Button
    el.startDemoBtn.addEventListener('click', () => {
      resetSimulationState(false);
      startFullDemo();
    });

    // Step Demo Button
    el.stepDemoBtn.addEventListener('click', () => {
      advanceOneStage();
    });

    // Pause / Resume Button
    el.pauseDemoBtn.addEventListener('click', () => {
      if (!state.isRunning) return;
      state.isPaused = !state.isPaused;
      if (state.isPaused) {
        state.pauseStartTime = Date.now();
        el.pauseDemoBtn.innerHTML = '<span class="icon">▶</span> Resume';
        el.currentPhaseLabel.textContent = `Simulation Paused at Stage ${state.currentStage}/5 • Click Resume to proceed`;
        addLog('SYS', `Simulation paused by user at Stage ${state.currentStage}.`);
      } else {
        if (state.pauseStartTime) {
          state.totalPausedTime += Date.now() - state.pauseStartTime;
          state.pauseStartTime = 0;
        }
        el.pauseDemoBtn.innerHTML = '<span class="icon">⏸</span> Pause';
        el.currentPhaseLabel.textContent = `Resumed • Stage ${state.currentStage}/5 running...`;
        addLog('SYS', `Simulation resumed.`);
      }
    });

    // Reset Button
    el.resetDemoBtn.addEventListener('click', () => {
      resetSimulationState(true);
    });

    // Alice Send Arrow in Mock Phone
    el.aliceSendActionBtn.addEventListener('click', () => {
      resetSimulationState(false);
      startFullDemo();
    });

    // Preset Menu Toggle & Preset Select
    el.presetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.presetMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      el.presetMenu.classList.remove('show');
    });

    document.querySelectorAll('.preset-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const text = e.target.getAttribute('data-text');
        el.msgInput.value = text;
        el.visPlaintext.textContent = text;
        el.presetMenu.classList.remove('show');
      });
    });

    // Input changes
    el.msgInput.addEventListener('input', (e) => {
      el.visPlaintext.textContent = e.target.value || '(Empty message)';
    });

    // Simulation Speed Dropdown
    el.simSpeed.addEventListener('change', (e) => {
      state.speedMultiplier = parseFloat(e.target.value) || 1.0;
      addLog('SYS', `Simulation speed set to ${state.speedMultiplier}x`);
    });

    // Sound toggle
    el.audioToggleBtn.addEventListener('click', () => {
      state.sound.enabled = !state.sound.enabled;
      el.audioIcon.textContent = state.sound.enabled ? '🔊' : '🔇';
      el.audioToggleBtn.title = state.sound.enabled ? 'Sound Effects Enabled' : 'Sound Effects Muted';
    });

    // Stage Stepper Click to Jump
    el.stepNodes.forEach((node) => {
      node.addEventListener('click', () => {
        const stageNum = parseInt(node.getAttribute('data-stage'), 10);
        if (!state.isRunning) {
          state.currentStage = stageNum - 1;
          advanceOneStage();
        }
      });
    });

    // Log Category Filters
    el.filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        el.filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter');

        const entries = el.eventLogStream.querySelectorAll('.log-entry');
        entries.forEach((entry) => {
          const category = entry.dataset.category;
          if (state.activeFilter === 'all' || category === state.activeFilter || !category) {
            entry.style.display = 'flex';
          } else {
            entry.style.display = 'none';
          }
        });
      });
    });

    // Clear Log Button
    el.clearLogBtn.addEventListener('click', () => {
      el.eventLogStream.innerHTML = '';
      el.logCountBadge.textContent = '0 events';
      state.logs = [];
    });

    // Copy Log Button
    el.copyLogBtn.addEventListener('click', () => {
      if (!state.logs.length) {
        alert('Log is currently empty.');
        return;
      }
      const text = state.logs
        .map((l) => `[${l.time}] [${l.category}] ${l.message} ${l.payload ? '-> ' + l.payload : ''}`)
        .join('\n');

      navigator.clipboard.writeText(text).then(() => {
        const originalText = el.copyLogBtn.textContent;
        el.copyLogBtn.textContent = 'Copied!';
        setTimeout(() => {
          el.copyLogBtn.textContent = originalText;
        }, 1500);
      });
    });
  }

  // --- Initialize on DOM Load ---
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
  });
})();
