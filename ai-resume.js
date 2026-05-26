(function() {
  // ========================
  //  CONFIG & DATA
  // ========================
  const OWNER = {
    name: 'SURAJ KUMAR',
    role: 'Full-Stack Developer & Designer, Game Builder',
    location: 'Patna, Bihar, INDIA',
    email: 'behindman25@gmail.com',
    github: 'github.com/greek-word',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Tailwind', 'Firebase', 'PostgreSQL', 'Docker', 'ASCII Art', 'Game Physics'],
    projects: [
      'AI Dashboard with real-time analytics',
      'Real-time Games: Tic-Tac-Toe, Flip & Match, Rock Paper Scissors',
      'E-Commerce Platform (payments + admin panel)',
      'Real-time Chat App with message reactions',
      '3D Portfolio Experience (Three.js)'
    ],
    funFacts: [
      'I love open source ❤️',
      'Coffee enthusiast ☕ — 4 cups a day minimum',
      'Built my first website at 14 (a Pokémon fan page)',
      'I talk to my code when debugging 😅',
      'Once fixed a bug at 3 AM while eating noodles'
    ],
    quotes: [
      'Code is poetry written in logic.',
      'Design is not just how it looks, but how it works.',
      'The best error message is the one that never shows up.',
      'Every great developer you know got there by debugging.'
    ]
  };

  // Emoji faces for the bot (high-res noto emoji)
  const FACES = {
    happy: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60a/512.webp',
    excited: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp',
    laughing: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f606/512.webp',
    proud: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.webp',
    confident: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60f/512.webp',
    thinking: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/512.webp',
    sad: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f622/512.webp',
    shocked: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f631/512.webp',
    smirk: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60f/512.webp',
    robotic: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp',
    glitch: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.webp',
    victory: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/512.webp',
    cool: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.webp',
    starstruck: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.webp',
    calm: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60c/512.webp',
    neutral: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.webp'
  };

  // ========================
  //  DOM ELEMENTS
  // ========================
  const messagesArea = document.getElementById('messagesArea');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const clearBtn = document.getElementById('clearChat');
  const themeToggle = document.getElementById('themeToggle');
  const botFace = document.getElementById('botFace');
  const headerStatus = document.getElementById('headerStatus');
  const quickReplies = document.getElementById('quickReplies');
  const toastEl = document.getElementById('toast');
  const micBtn = document.getElementById('micBtn');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const ctx = confettiCanvas.getContext('2d');

  // ========================
  //  STATE VARIABLES
  // ========================
  let messages = [];
  let userName = localStorage.getItem('chat_user_name') || '';
  let currentEmotion = 'robotic';
  let isTyping = false;
  let voiceEnabled = true;
  let recognition = null;
  let botMood = 'cheerful'; // cheerful, sarcastic, mysterious, helpful
  let sessionQuotes = [...OWNER.quotes];
  let miniGameActive = null; // 'guess', 'trivia'

  // ========================
  //  AUDIO & SFX
  // ========================
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx;
  function playBeep(type = 'click') {
    if (!audioCtx) audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.05;
    if (type === 'click') {
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    } else if (type === 'send') {
      osc.frequency.value = 1200;
      osc.type = 'triangle';
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    } else if (type === 'error') {
      osc.frequency.value = 400;
      osc.type = 'sawtooth';
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    }
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  }

  // ========================
  //  TOAST NOTIFICATIONS
  // ========================
  function showToast(message, duration = 2000) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  // ========================
  //  BOT FACE & GLITCH
  // ========================
  function setFace(emotion, instant = false) {
    if (emotion === 'glitch') {
      triggerGlitch();
      return;
    }
    const url = FACES[emotion] || FACES.robotic;
    botFace.src = url;
    currentEmotion = emotion;
    const avatarDiv = document.getElementById('botAvatar');
    if (avatarDiv) {
      avatarDiv.style.boxShadow = `0 0 28px var(--glow, #0ff)`;
      setTimeout(() => avatarDiv.style.boxShadow = '', 400);
    }
  }

  function triggerGlitch() {
    const faces = Object.values(FACES);
    let count = 0;
    const interval = setInterval(() => {
      botFace.src = faces[Math.floor(Math.random() * faces.length)];
      count++;
      if (count > 8) {
        clearInterval(interval);
        setFace('robotic');
      }
    }, 100);
    const avatarDiv = document.getElementById('botAvatar');
    if (avatarDiv) avatarDiv.style.boxShadow = '0 0 40px #f00';
  }

  // ========================
  //  CONFETTI CELEBRATION
  // ========================
  let confettiPieces = [];
  function launchConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    for (let i = 0; i < 150; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -10,
        w: 6 + Math.random() * 8,
        h: 6 + Math.random() * 8,
        color: `hsl(${Math.random() * 360}, 80%, 65%)`,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 6 + 3,
        rot: Math.random() * 360
      });
    }
    requestAnimationFrame(drawConfetti);
    showToast('🎉 Achievement unlocked!', 1500);
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 50);
    confettiPieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.y += p.vy;
      p.x += p.vx;
      p.rot += 4;
    });
    if (confettiPieces.length) requestAnimationFrame(drawConfetti);
  }

  // ========================
  //  TYPING EFFECT (with pauses)
  // ========================
  async function typeMessageInBubble(bubbleElement, fullText, speed = 20) {
    bubbleElement.innerHTML = '';
    for (let i = 0; i < fullText.length; i++) {
      bubbleElement.innerHTML += fullText.charAt(i);
      // Add tiny pause for punctuation
      if (fullText.charAt(i).match(/[.!?]/) && i < fullText.length - 1) {
        await new Promise(r => setTimeout(r, speed * 3));
      } else {
        await new Promise(r => setTimeout(r, speed));
      }
    }
    bubbleElement.innerHTML += '<span class="typing-cursor"></span>';
    await new Promise(r => setTimeout(r, 400));
    const cursor = bubbleElement.querySelector('.typing-cursor');
    if (cursor) cursor.remove();
  }

  // ========================
  //  ADVANCED RESPONSE ENGINE
  // ========================
  function generateResponse(input) {
    const lower = input.trim().toLowerCase();

    // ----- SECRET EASTER EGGS -----
    if (lower === '/secret') {
      return { text: '🤫 Shh! You found the secret door. Try /quote, /mood, or /help for more magic.', emotion: 'starstruck' };
    }
    if (lower === '/quote') {
      const randomQuote = sessionQuotes[Math.floor(Math.random() * sessionQuotes.length)];
      return { text: `✨ "${randomQuote}" — ${OWNER.name}`, emotion: 'calm' };
    }
    if (lower === '/mood') {
      const moods = ['cheerful', 'sarcastic', 'mysterious', 'helpful'];
      botMood = moods[Math.floor(Math.random() * moods.length)];
      return { text: `My mood is now: ${botMood}. Let's see how I respond! 😏`, emotion: 'smirk' };
    }
    if (lower === '/help') {
      return { text: `📖 **Commands:** /secret, /quote, /mood, /fortune, /glitch, /ascii, "rps rock/paper/scissors", "tell me a joke", "my name is X", "skills", "projects", "contact".`, emotion: 'helpful' };
    }

    // ----- NAME & MEMORY -----
    if (/my name is (\w+)/i.test(lower)) {
      const match = lower.match(/my name is (\w+)/i);
      userName = match[1];
      localStorage.setItem('chat_user_name', userName);
      return { text: `Nice to meet you, ${userName}! 🌟 I'll remember that forever.`, emotion: 'happy' };
    }
    if (/what('s| is) my name/i.test(lower)) {
      if (userName) return { text: `Your name is ${userName}, of course I remember! 😎`, emotion: 'confident' };
      return { text: `I don't know your name yet. Tell me with "my name is XYZ"`, emotion: 'thinking' };
    }

    // ----- MINI GAMES -----
    if (miniGameActive === 'guess' && /^\d+$/.test(lower)) {
      const guess = parseInt(lower, 10);
      const secret = miniGameActive.secret;
      if (guess === secret) {
        miniGameActive = null;
        launchConfetti();
        return { text: `🎉 Correct! The number was ${secret}. You win!`, emotion: 'victory' };
      } else if (guess < secret) {
        return { text: `Too low! Try again.`, emotion: 'thinking' };
      } else {
        return { text: `Too high! Try again.`, emotion: 'thinking' };
      }
    }
    if (lower === 'play guess') {
      const secretNumber = Math.floor(Math.random() * 20) + 1;
      miniGameActive = { type: 'guess', secret: secretNumber };
      return { text: `🔢 I'm thinking of a number between 1 and 20. Type your guess!`, emotion: 'excited' };
    }

    // ----- RPS GAME (enhanced) -----
    if (/^rps (rock|paper|scissors)$/i.test(lower)) {
      const userMove = lower.match(/rps (rock|paper|scissors)/i)[1];
      const botMove = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
      const win = (u, b) => (u === 'rock' && b === 'scissors') || (u === 'paper' && b === 'rock') || (u === 'scissors' && b === 'paper');
      let result = '';
      if (userMove === botMove) result = "It's a tie! 🤝";
      else if (win(userMove, botMove)) {
        result = `You win! ${userMove} beats ${botMove}. 🎉`;
        launchConfetti();
      } else {
        result = `I win! ${botMove} beats ${userMove}. 😎`;
      }
      return { text: `You chose ${userMove}. I chose ${botMove}. ${result}`, emotion: result.includes('win') ? 'victory' : 'thinking' };
    }

    // ----- SPECIAL COMMANDS -----
    if (lower === '/glitch') {
      setFace('glitch');
      return { text: '🌀 Glitch mode activated... system rebooting... just kidding.', emotion: 'glitch' };
    }
    if (lower === '/fortune') {
      const fortunes = [
        'You will write elegant code today.',
        'An exciting pull request is near.',
        'Beware of undefined variables... or embrace them.',
        'Your next coffee will be perfect.'
      ];
      return { text: `🔮 ${fortunes[Math.floor(Math.random() * fortunes.length)]}`, emotion: 'starstruck' };
    }
    if (lower === '/ascii') {
      return { text: '```\n  /\\_/\\\n ( o.o )\n  > ^ <\n```\nThat\'s you, but cooler.', emotion: 'laughing' };
    }
    if (lower.includes('joke')) {
      const jokes = [
        'Why do programmers prefer dark mode? Less bugs.',
        'How many programmers does it take to change a light bulb? None — that’s a hardware problem.',
        'Why did the developer go broke? Cache flow problems.',
        'Why was the JavaScript developer sad? Because he didn’t Node how to Express himself.'
      ];
      return { text: jokes[Math.floor(Math.random() * jokes.length)], emotion: 'laughing' };
    }

    // ----- PORTFOLIO & OWNER -----
    if (/skill|tech|stack|tools/i.test(lower)) {
      const skillsSubset = OWNER.skills.slice(0, 6).join(', ');
      return { text: `🛠️ ${OWNER.name} masters: ${skillsSubset} and more! Also builds games and ASCII art.`, emotion: 'confident' };
    }
    if (/project|work|made|build/i.test(lower)) {
      return { text: `🚀 Featured projects: ${OWNER.projects.join(', ')}. Ask me for details about any!`, emotion: 'proud' };
    }
    if (/contact|email|reach|github/i.test(lower)) {
      return { text: `📬 Reach out: ${OWNER.email} | GitHub: ${OWNER.github} | Location: ${OWNER.location}`, emotion: 'calm' };
    }
    if (/fun fact|fact about you|tell me something/i.test(lower)) {
      const fact = OWNER.funFacts[Math.floor(Math.random() * OWNER.funFacts.length)];
      return { text: `😄 Fun fact: ${fact}`, emotion: 'excited' };
    }
    if (/thanks|thank you|appreciate/i.test(lower)) {
      return { text: 'You’re welcome, friend! Anytime. 😊', emotion: 'happy' };
    }
    if (/how are you|how do you feel/i.test(lower)) {
      if (botMood === 'cheerful') return { text: `I'm feeling fantastic! Ready to chat.`, emotion: 'happy' };
      if (botMood === 'sarcastic') return { text: `Oh, just living the digital dream. 🙄`, emotion: 'smirk' };
      return { text: `I'm in ${botMood} mode today. Ask me something cool!`, emotion: 'neutral' };
    }

    // ----- MOOD-BASED FALLBACKS -----
    const fallbacks = {
      cheerful: [
        `Yay! I can chat about ${OWNER.name}'s skills, projects, or play games. Try "rps rock"!`,
        `Ask me about ${OWNER.name}'s work, or type /fortune for a surprise.`
      ],
      sarcastic: [
        `Oh wow, another vague question. Try "skills" or "projects" maybe? 😏`,
        `Right, because I totally read minds. Type /help if you dare.`
      ],
      mysterious: [
        `Hmm... the answer lies in the code. Or maybe not. 🔮`,
        `Some questions are better left unasked. Try "rps rock" for fun.`
      ],
      helpful: [
        `I can help with portfolio info, games, or fun commands. Try "tell me a joke".`,
        `Need to know something specific? Ask about skills, projects, or my mood.`
      ]
    };
    const moodFallbacks = fallbacks[botMood] || fallbacks.helpful;
    return { text: moodFallbacks[Math.floor(Math.random() * moodFallbacks.length)], emotion: 'neutral' };
  }

  // ========================
  //  MESSAGE RENDERING
  // ========================
  function renderMessage(msg) {
    const row = document.createElement('div');
    row.className = `message-row ${msg.sender}`;

    if (msg.sender === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar-mini';
      avatar.innerHTML = `<img src="${FACES[msg.emotion] || FACES.robotic}" width="28" height="28" style="border-radius:50%">`;
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    row.appendChild(bubble);

    if (msg.sender === 'user' && userName) {
      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar-mini';
      avatar.textContent = userName[0].toUpperCase();
      avatar.style.background = 'var(--accent)';
      avatar.style.color = 'white';
      avatar.style.borderRadius = '50%';
      avatar.style.width = '28px';
      avatar.style.height = '28px';
      avatar.style.display = 'flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      row.appendChild(avatar);
    }

    messagesArea.appendChild(row);

    if (msg.sender === 'bot') {
      typeMessageInBubble(bubble, msg.text);
      setFace(msg.emotion);
    } else {
      bubble.textContent = msg.text;
    }

    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  async function addMessage(text, sender, emotion = 'neutral') {
    const msg = { text, sender, emotion, timestamp: Date.now() };
    messages.push(msg);
    renderMessage(msg);
    if (sender === 'bot' && text.includes('win')) launchConfetti();
  }

  // ========================
  //  USER INPUT HANDLER
  // ========================
  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isTyping) return;

    playBeep('send');
    await addMessage(text, 'user');
    chatInput.value = '';
    isTyping = true;
    headerStatus.textContent = '● bot is thinking...';
    headerStatus.style.opacity = '0.7';

    const response = generateResponse(text);

    setTimeout(async () => {
      await addMessage(response.text, 'bot', response.emotion);
      isTyping = false;
      headerStatus.textContent = '● online';
      headerStatus.style.opacity = '1';
      if (response.text.includes('🎉')) launchConfetti();
    }, 700 + Math.random() * 900);
  }

  // ========================
  //  EVENT LISTENERS
  // ========================
  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Quick reply chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chatInput.value = chip.dataset.query;
      handleSend();
    });
  });

  // Clear chat
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all messages?')) {
      messagesArea.innerHTML = '';
      messages = [];
      addMessage('Chat cleared! Start fresh. 🧹', 'bot', 'neutral');
    }
  });

  // Theme toggle (light/dark)
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    showToast(`🌓 Switched to ${document.body.classList.contains('light') ? 'Light' : 'Dark'} mode`);
  });
  if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

  // Voice recognition
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      chatInput.value = transcript;
    };
    recognition.onend = () => {
      micBtn.style.color = '';
      showToast('🎤 Listening stopped');
    };
    micBtn.addEventListener('click', () => {
      if (recognition && !isTyping) {
        recognition.start();
        micBtn.style.color = 'var(--accent2, #ffaa44)';
        showToast('🎤 Listening... speak now');
      }
    });
  } else {
    if (micBtn) micBtn.style.display = 'none';
  }

  // ========================
  //  INITIAL GREETING
  // ========================
  window.addEventListener('load', () => {
    const greeting = userName
      ? `Welcome back, ${userName}! 👋 I've missed you. Ready to chat, play games, or learn about Suraj's work?`
      : `👾 Hello! I'm ${OWNER.name}'s AI assistant — part coder, part jester, full digital soul. Ask me about skills, projects, or type /help for secrets.`;
    addMessage(greeting, 'bot', 'excited');
  });
})();