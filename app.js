/* ═══════════════════════════════════════════════
   ECHO — app.js
   Auth · Profiles · Questionnaire · Storage
═══════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   QUESTION BANKS
══════════════════════════════════════ */

const CATS_ALIVE = [
  {
    id: 'identity', icon: '🧠', title: 'Core Identity', desc: 'The foundation of who you are today.',
    questions: [
      { id:'a_id1', type:'text', text:'What is your full name, and what do you prefer to be called?', ph:'e.g. Alexandra Chen — goes by Alex' },
      { id:'a_id2', type:'ta',   text:'What is your age, nationality, and cultural background?', ph:'Age, country, heritage and cultural influences...' },
      { id:'a_id3', type:'ta',   text:'Where did you grow up, and where have you lived throughout your life?', ph:'Cities or countries and how long in each...' },
      { id:'a_id4', type:'ta',   text:'Describe your family structure — siblings, birth order, and relationship with your parents.', ph:'Who raised you, family dynamics, your place in the family...' },
      { id:'a_id5', type:'ta',   text:'What is your education history, and what was your general attitude toward school?', ph:'Schools attended, subjects loved or hated, overall experience...' },
      { id:'a_id6', type:'ta',   text:'Describe your career path and how you feel about your work.', ph:'Jobs held, current role, your relationship with your career...' },
    ]
  },
  {
    id: 'comms', icon: '🗣️', title: 'Communication Style', desc: 'How you express yourself to the world.',
    questions: [
      { id:'a_cm1', type:'ch',  text:'Are you a formal or informal speaker?', opts:['Very formal','Mostly formal','Mixed — context-dependent','Mostly informal','Very informal / lots of slang'] },
      { id:'a_cm2', type:'sc',  text:'How elaborate are your typical responses?', labels:['Very terse','Very elaborate'] },
      { id:'a_cm3', type:'ch',  text:'Do you prefer to lead with your conclusion or build up to it?', opts:['Lead with the conclusion (BLUF)','Build up to it gradually','Depends on the situation'] },
      { id:'a_cm4', type:'ch',  text:'How do you express disagreement?', opts:['Very directly','Diplomatically — I soften it','Avoidantly — I rarely voice disagreement','Depends on who I\'m with'] },
      { id:'a_cm5', type:'ms',  text:'What kind of humour do you use?', opts:['Dry / deadpan','Self-deprecating','Absurdist / surreal','Witty / wordplay','Sarcastic','I rarely use humour'] },
      { id:'a_cm6', type:'ta',  text:'What words or phrases do you tend to overuse?', ph:'"literally", "honestly", "at the end of the day", "basically"...' },
      { id:'a_cm7', type:'ta',  text:'How does your communication style differ between writing and speaking?', ph:'More formal in writing? Funnier in person? Different vocabulary?' },
    ]
  },
  {
    id: 'personality', icon: '🎭', title: 'Personality', desc: 'Your inner world and how it shows.',
    questions: [
      { id:'a_ps1', type:'text', text:'Describe yourself in exactly 5 words.', ph:'curious, stubborn, warm, analytical, loud' },
      { id:'a_ps2', type:'ta',   text:'How would others describe you — and does that differ from your self-view?', ph:'What do friends or colleagues say vs. how you see yourself?' },
      { id:'a_ps3', type:'sc',   text:'Where do you fall on the introvert/extrovert spectrum?', labels:['Strong introvert','Strong extrovert'] },
      { id:'a_ps4', type:'ta',   text:'How do you behave under stress or pressure?', ph:'Quiet, snappy, hyperproductive, shut down...' },
      { id:'a_ps5', type:'ms',   text:'What are your emotional defaults?', opts:['Anxious','Optimistic','Cynical','Calm','Enthusiastic','Melancholic','Guarded','Playful','Restless'] },
      { id:'a_ps6', type:'ta',   text:'What are your biggest pet peeves?', ph:'Things that irritate you out of proportion to their significance...' },
      { id:'a_ps7', type:'sc',   text:'Are you more ruled by logic or feeling when making decisions?', labels:['Pure logic','Pure feeling'] },
    ]
  },
  {
    id: 'values', icon: '💡', title: 'Values & Worldview', desc: 'What you believe and what drives you.',
    questions: [
      { id:'a_vl1', type:'ta', text:'What are your core personal values? List and rank up to 5.', ph:'e.g. Honesty, loyalty, freedom, creativity — in order of importance...' },
      { id:'a_vl2', type:'ta', text:'How would you describe your political and social views?', ph:'Share as much or as little as you\'re comfortable with...' },
      { id:'a_vl3', type:'ta', text:'Do you hold religious or spiritual beliefs, and how much do they shape daily life?', ph:'Beliefs, practices, how central they are to your identity...' },
      { id:'a_vl4', type:'ta', text:'What is your ethical framework — how do you decide what\'s right or wrong?', ph:'Rules-based, outcome-based, gut feeling, cultural norms...' },
      { id:'a_vl5', type:'ta', text:'What gives you the most meaning day-to-day?', ph:'What makes a day feel genuinely worthwhile?' },
    ]
  },
  {
    id: 'knowledge', icon: '🧩', title: 'Knowledge & Interests', desc: 'What you know and what fascinates you.',
    questions: [
      { id:'a_kn1', type:'ta', text:'What topics could you talk about for hours?', ph:'Your genuine obsessions and deep interests...' },
      { id:'a_kn2', type:'ta', text:'What are your hobbies and how seriously do you pursue them?', ph:'List them and describe your level of dedication to each...' },
      { id:'a_kn3', type:'ta', text:'What are your areas of professional or deep personal expertise?', ph:'What do people come to you for advice on?' },
      { id:'a_kn4', type:'ta', text:'What are your favourite books, films, or music — and why do they resonate?', ph:'Not just titles — explain what draws you to them specifically...' },
      { id:'a_kn5', type:'ms', text:'How do you prefer to learn new things?', opts:['Reading books or articles','Watching videos','Listening to podcasts','Hands-on experimentation','Talking to experts','Taking formal courses','Learning by failing'] },
    ]
  },
  {
    id: 'relationships', icon: '🤝', title: 'Relationships & Social', desc: 'How you connect with others.',
    questions: [
      { id:'a_rl1', type:'ta', text:'How do you behave differently with close friends versus strangers?', ph:'What opens up, what shuts down, how your personality shifts...' },
      { id:'a_rl2', type:'ta', text:'How do you show care or affection to people you\'re close to?', ph:'Words, acts of service, gifts, quality time, physical affection...' },
      { id:'a_rl3', type:'ch', text:'What is your attachment style?', opts:['Secure — comfortable with closeness and independence','Anxious — I worry about abandonment','Avoidant — I value independence and find closeness hard','Not sure / I haven\'t thought about it'] },
      { id:'a_rl4', type:'ta', text:'How do you handle conflict with people you love?', ph:'Fight, freeze, flee? How do you repair things afterward?' },
      { id:'a_rl5', type:'ch', text:'In groups, do you tend to lead, follow, or observe?', opts:['I naturally lead','I contribute but don\'t lead','I follow whoever\'s leading','I mostly observe','It varies by context'] },
    ]
  },
  {
    id: 'decisions', icon: '⚖️', title: 'Decision-Making', desc: 'How you think through choices.',
    questions: [
      { id:'a_dc1', type:'sc', text:'Do you make decisions quickly or deliberate extensively?', labels:['Snap decisions','Extensive deliberation'] },
      { id:'a_dc2', type:'sc', text:'How risk-tolerant are you?', labels:['Risk-averse','Risk-taker'] },
      { id:'a_dc3', type:'ch', text:'What is your relationship with rules?', opts:['I follow rules rigorously','I follow rules unless I strongly disagree','I bend rules when convenient','I ignore rules I consider arbitrary'] },
      { id:'a_dc4', type:'ta', text:'How do you prioritise when everything feels urgent?', ph:'Your mental framework for triage under pressure...' },
    ]
  },
  {
    id: 'story', icon: '📖', title: 'Memory & Story', desc: 'The experiences that made you.',
    questions: [
      { id:'a_st1', type:'ta', text:'What are 3–5 of the most formative experiences of your life?', ph:'Moments that fundamentally changed who you are or what you believe...' },
      { id:'a_st2', type:'ta', text:'What is your biggest regret?', ph:'What do you wish you had done differently?' },
      { id:'a_st3', type:'ta', text:'What are you most proud of?', ph:'Achievements, qualities, or choices you feel genuinely good about...' },
      { id:'a_st4', type:'ta', text:'What is a story you tell repeatedly that reveals something true about you?', ph:'A favourite anecdote — the one that always seems to come up...' },
    ]
  },
  {
    id: 'goals', icon: '🌅', title: 'Goals & Fears', desc: 'Where you\'re headed and what holds you back.',
    questions: [
      { id:'a_gl1', type:'ta', text:'What are you actively working toward right now?', ph:'Current goals — personal, professional, creative, relational...' },
      { id:'a_gl2', type:'ta', text:'What are you most afraid of?', ph:'Rational fears, irrational fears, things you don\'t like to admit...' },
      { id:'a_gl3', type:'ta', text:'What would you pursue if you knew you couldn\'t fail?', ph:'Your unconstrained ambition...' },
      { id:'a_gl4', type:'ta', text:'What does success look like to you — not society\'s version, but yours?', ph:'Be specific and honest...' },
      { id:'a_gl5', type:'ta', text:'How do you want to be remembered?', ph:'Your ideal legacy...' },
    ]
  },
  {
    id: 'daily', icon: '🔁', title: 'Daily Life & Habits', desc: 'The texture of your everyday existence.',
    questions: [
      { id:'a_dl1', type:'ta', text:'Walk through a typical day in your life from waking to sleeping.', ph:'Approximate times, routines, where you spend your energy...' },
      { id:'a_dl2', type:'sc', text:'Are you a morning person or a night owl?', labels:['Total morning person','Total night owl'] },
      { id:'a_dl3', type:'ta', text:'How do you recharge after a draining day or week?', ph:'What genuinely restores your energy?' },
      { id:'a_dl4', type:'ta', text:'Describe your actual habits around eating, sleep, and exercise — the reality, not the aspiration.', ph:'What you actually do, not what you wish you did...' },
    ]
  },
  {
    id: 'voice', icon: '🎤', title: 'Voice & Presence', desc: 'How your physicality shapes communication.',
    questions: [
      { id:'a_vc1', type:'sc',   text:'How would you describe your pace of speech?', labels:['Very slow and measured','Very fast and energetic'] },
      { id:'a_vc2', type:'text', text:'Do you have vocal tics or filler words you use often?', ph:'"like", "um", "you know", "basically"...' },
      { id:'a_vc3', type:'ta',   text:'Do you have an accent or distinctive regional speech patterns?', ph:'Where people guess you\'re from when they first hear you...' },
      { id:'a_vc4', type:'ta',   text:'What physical gestures or mannerisms accompany your speech?', ph:'Hand gestures, facial expressions, posture, eye contact habits...' },
    ]
  },
];

const CATS_DECEASED = [
  {
    id: 'who', icon: '🕊️', title: 'Who They Were', desc: 'The person at their core.',
    questions: [
      { id:'d_wh1', type:'text', text:'What was their full name, and what did people call them?', ph:'Full name and preferred name or nickname...' },
      { id:'d_wh2', type:'ta',   text:'When were they born and when did they pass? How old were they?', ph:'Dates and age at passing...' },
      { id:'d_wh3', type:'ta',   text:'What was their nationality, cultural background, and heritage?', ph:'Country of origin, ethnic background, cultural traditions...' },
      { id:'d_wh4', type:'ta',   text:'Describe their family — who they came from and who they built.', ph:'Parents, siblings, partners, children — the family they were part of...' },
      { id:'d_wh5', type:'ta',   text:'What did they do for work throughout their life, and how did they feel about it?', ph:'Career paths, jobs, vocations, how central work was to their identity...' },
    ]
  },
  {
    id: 'personality', icon: '🎭', title: 'Personality & Character', desc: 'The qualities that defined them.',
    questions: [
      { id:'d_ps1', type:'text', text:'How would you describe them in exactly 5 words?', ph:'warm, stubborn, funny, generous, quiet...' },
      { id:'d_ps2', type:'ta',   text:'How did others describe them — what did people say at their best?', ph:'What words came up in eulogies, stories, memories people shared...' },
      { id:'d_ps3', type:'sc',   text:'Were they an introvert or extrovert?', labels:['Deep introvert','Intense extrovert'] },
      { id:'d_ps4', type:'ta',   text:'How did they behave under stress or difficulty?', ph:'Did they go quiet, get animated, turn to humour, push through, withdraw...' },
      { id:'d_ps5', type:'ms',   text:'What were their consistent emotional qualities?', opts:['Warm','Anxious','Funny','Stoic','Generous','Reserved','Passionate','Patient','Impulsive','Gentle','Fierce'] },
      { id:'d_ps6', type:'ta',   text:'What were their biggest pet peeves or things that drove them mad?', ph:'The small and large things that consistently got under their skin...' },
      { id:'d_ps7', type:'ta',   text:'What made them light up? What brought out the best in them?', ph:'Topics, people, activities, moments where they truly came alive...' },
    ]
  },
  {
    id: 'comms', icon: '🗣️', title: 'Their Voice', desc: 'How they spoke and expressed themselves.',
    questions: [
      { id:'d_cm1', type:'ch',   text:'How would you describe their communication style?', opts:['Very formal — proper and precise','Warm and chatty','Quiet but thoughtful','Loud and expressive','Funny and quick with a quip','Varied by context'] },
      { id:'d_cm2', type:'ta',   text:'What words, phrases, or expressions did they use so often you can still hear them say it?', ph:'Their catchphrases, favourite words, expressions only they would use...' },
      { id:'d_cm3', type:'ta',   text:'What was their sense of humour like — did they have one?', ph:'Dry, warm, slapstick, sharp, self-deprecating, storytelling...' },
      { id:'d_cm4', type:'ta',   text:'How did they give advice, comfort, or criticism?', ph:'Were they blunt? Gentle? Did they tell stories? Listen first? Offer solutions?' },
      { id:'d_cm5', type:'ta',   text:'What topics could they hold court on indefinitely?', ph:'The subjects they\'d turn any conversation toward...' },
    ]
  },
  {
    id: 'values', icon: '💡', title: 'Values & Beliefs', desc: 'What they stood for and lived by.',
    questions: [
      { id:'d_vl1', type:'ta', text:'What did they seem to value most in life? What drove their decisions?', ph:'What they consistently chose, protected, fought for...' },
      { id:'d_vl2', type:'ta', text:'What were their political, social, or civic views — did they share them openly?', ph:'How engaged were they? What causes or positions mattered to them?' },
      { id:'d_vl3', type:'ta', text:'Did they hold religious or spiritual beliefs? How central were they?', ph:'Faith, practice, tradition, or lack thereof — and its role in their life...' },
      { id:'d_vl4', type:'ta', text:'What was their code of ethics — how did they decide what was right or wrong?', ph:'Their moral compass, expressed in words or simply in how they lived...' },
      { id:'d_vl5', type:'ta', text:'What did they believe life was for?', ph:'Their philosophy, spoken or unspoken, about what made a life worthwhile...' },
    ]
  },
  {
    id: 'relationships', icon: '🤝', title: 'Relationships & Love', desc: 'How they connected with others.',
    questions: [
      { id:'d_rl1', type:'ta', text:'How did they love the people they were close to? How did they show it?', ph:'Practical care, words, physical affection, acts of service, presence...' },
      { id:'d_rl2', type:'ta', text:'What kind of friend were they? What did people love about them in friendship?', ph:'Reliable, funny, honest, loyal, the one who called you out or picked you up...' },
      { id:'d_rl3', type:'ta', text:'Describe their most significant relationship — what did it look like day to day?', ph:'A partnership, a friendship, a parent-child bond — its texture and character...' },
      { id:'d_rl4', type:'ta', text:'How did they handle conflict or difficulty in relationships?', ph:'Did they confront, withdraw, soften, stand firm, hold grudges, forgive quickly...' },
      { id:'d_rl5', type:'ch', text:'In groups or gatherings, what was their role?', opts:['The life of the party','The quiet observer','The storyteller','The organiser','The peacemaker','The one who held everything together','It varied'] },
    ]
  },
  {
    id: 'passions', icon: '🧩', title: 'Passions & Pastimes', desc: 'What they loved doing with their time.',
    questions: [
      { id:'d_pa1', type:'ta', text:'What were their hobbies, interests, or passions — the things they made time for?', ph:'How they spent weekends, evenings, holidays, retirement...' },
      { id:'d_pa2', type:'ta', text:'Were there topics they were particularly knowledgeable or passionate about?', ph:'Areas where they were the expert in the room, the go-to person...' },
      { id:'d_pa3', type:'ta', text:'What books, films, music, or art did they love — and what did that reveal about them?', ph:'Their favourites and why they mattered, if you know...' },
      { id:'d_pa4', type:'ta', text:'Did they have a creative side? Did they make things?', ph:'Writing, cooking, gardening, building, drawing, music, craft...' },
    ]
  },
  {
    id: 'story', icon: '📖', title: 'Their Story', desc: 'The moments and memories that define them.',
    questions: [
      { id:'d_st1', type:'ta', text:'What are the most formative events of their life — the ones that made them who they were?', ph:'Pivotal moments of hardship, joy, transformation, loss, discovery...' },
      { id:'d_st2', type:'ta', text:'What stories about them get retold most often? The ones everyone knows?', ph:'The classic anecdotes, the famous stories, the things that\'ve become legend...' },
      { id:'d_st3', type:'ta', text:'What were they most proud of in their life?', ph:'Achievements, relationships, how they lived — said or unsaid...' },
      { id:'d_st4', type:'ta', text:'What hardships did they face — and how did they face them?', ph:'Struggles, losses, challenges — and what those experiences revealed about who they were...' },
      { id:'d_st5', type:'ta', text:'Is there anything they wished they\'d done differently? Regrets they carried?', ph:'Expressed or implied — what you sensed they wished had gone another way...' },
    ]
  },
  {
    id: 'legacy', icon: '🌿', title: 'Legacy & Impact', desc: 'What they left behind.',
    questions: [
      { id:'d_lg1', type:'ta', text:'How did they want to be remembered — did they ever say?', ph:'Explicit wishes or the impression they gave about what mattered to them...' },
      { id:'d_lg2', type:'ta', text:'What did they leave behind in the people who knew them?', ph:'How their presence shaped others — habits, values, phrases, lessons...' },
      { id:'d_lg3', type:'ta', text:'What do you miss most about them?', ph:'The specific things — small or large — that their absence has made you aware of...' },
      { id:'d_lg4', type:'ta', text:'What do you wish you had said to them, or asked them?', ph:'The conversations you didn\'t get to have...' },
      { id:'d_lg5', type:'ta', text:'If they could speak now, what do you believe they would say to the people they loved?', ph:'Your best sense of what they\'d want the people they cared for to know...' },
    ]
  },
  {
    id: 'daily', icon: '🔁', title: 'Daily Life & Habits', desc: 'The texture of their everyday existence.',
    questions: [
      { id:'d_dl1', type:'ta', text:'Describe a typical day in their life — at a stage you knew them well.', ph:'Morning routines, rhythms, what a normal day looked like...' },
      { id:'d_dl2', type:'ch', text:'Were they a morning person or a night owl?', opts:['Definite morning person','Night owl — came alive after dark','Neither — ran on their own clock','Varied throughout their life'] },
      { id:'d_dl3', type:'ta', text:'What were their rituals or habits — the things they did consistently, maybe without thinking?', ph:'The morning coffee, the evening walk, the way they read the paper, the Sunday routine...' },
      { id:'d_dl4', type:'ta', text:'What was their relationship with food? What did they love to eat or cook?', ph:'A love of cooking, a signature dish, favourite foods, food memories...' },
    ]
  },
];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
const S = {
  user:      null,   // { username, displayName, hash, created }
  profiles:  [],     // array of profile objects
  activeP:   null,   // currently editing profile index
  authMode:  'login',
  pendingType: null, // 'alive' or 'deceased' from home click
};

/* ══════════════════════════════════════
   STORAGE HELPERS
══════════════════════════════════════ */
async function sg(k) {
  try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function ss(k, v) {
  try { await window.storage.set(k, JSON.stringify(v)); return true; }
  catch { return false; }
}

/* ══════════════════════════════════════
   HASHING
══════════════════════════════════════ */
async function hashPwd(p) {
  const d = new TextEncoder().encode(p + 'echo_salt_v1');
  const h = await crypto.subtle.digest('SHA-256', d);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ══════════════════════════════════════
   ESCAPE
══════════════════════════════════════ */
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
let _toastTimer;
function toast(msg, type = 'green') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = 'toast'; }, 2400);
}

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
function goto(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');

  // update nav active link
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.view === view);
  });

  // update nav actions
  updateNav();

  // render view
  if (view === 'dashboard') renderDash();
  if (view === 'home')      buildWaveform();
  if (view === 'profile')   renderProfileView();
}

function requireAuth(view) {
  if (S.user) goto(view);
  else goto('auth');
}

function updateNav() {
  const actions = document.getElementById('nav-actions');
  const navProf  = document.getElementById('nav-profiles-li');
  if (S.user) {
    actions.innerHTML = `
      <span class="nav-user" onclick="goto('dashboard')">${esc(S.user.displayName)}</span>
      <button class="btn btn-ghost btn-sm" onclick="doLogout()">Log out</button>`;
    if (navProf) navProf.style.display = '';
  } else {
    actions.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="goto('auth')">Log in</button>
      <button class="btn btn-primary btn-sm" onclick="goto('auth')">Get started</button>`;
    if (navProf) navProf.style.display = 'none';
  }
}

/* ══════════════════════════════════════
   WAVEFORM
══════════════════════════════════════ */
function buildWaveform() {
  const el = document.getElementById('waveform');
  if (!el) return;
  el.innerHTML = '';
  const count = 32;
  for (let i = 0; i < count; i++) {
    const bar = document.createElement('div');
    bar.className = 'waveform-bar';
    const h = 6 + Math.abs(Math.sin(i * 0.4)) * 36 + Math.random() * 12;
    bar.style.setProperty('--h', h + 'px');
    bar.style.setProperty('--dur', (0.5 + Math.random() * 0.8).toFixed(2) + 's');
    bar.style.setProperty('--del', (i * 0.04).toFixed(2) + 's');
    el.appendChild(bar);
  }
}

/* ══════════════════════════════════════
   AUTH
══════════════════════════════════════ */
function setAuthMode(mode) {
  S.authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  document.getElementById('auth-subtitle').textContent =
    mode === 'login' ? 'Sign in to your account' : 'Create your Echo account';
  document.getElementById('auth-btn').textContent =
    mode === 'login' ? 'Log in' : 'Create account';
  document.getElementById('auth-note').textContent =
    mode === 'register' ? 'Passwords are hashed client-side. Your data stays in this browser.' : '';
  const err = document.getElementById('auth-error');
  err.style.display = 'none';
}

async function doAuth() {
  const u = document.getElementById('auth-user').value.trim();
  const p = document.getElementById('auth-pass').value;
  const err = document.getElementById('auth-error');
  const btn = document.getElementById('auth-btn');

  err.style.display = 'none';

  if (!u) { showAuthError('Please enter a username.'); return; }
  if (p.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }

  btn.textContent = '...'; btn.disabled = true;

  try {
    const h = await hashPwd(p);
    const key = 'echo_usr:' + u.toLowerCase();

    if (S.authMode === 'register') {
      const ex = await sg(key);
      if (ex) { showAuthError('Username already taken — choose another.'); btn.textContent='Create account'; btn.disabled=false; return; }
      const nu = { username: u.toLowerCase(), displayName: u, hash: h, created: Date.now() };
      await ss(key, nu);
      S.user = nu;
    } else {
      const usr = await sg(key);
      if (!usr || usr.hash !== h) { showAuthError('Incorrect username or password.'); btn.textContent='Log in'; btn.disabled=false; return; }
      S.user = usr;
    }

    // load profiles
    const saved = await sg('echo_profiles:' + S.user.username);
    S.profiles = saved || [];

    document.getElementById('auth-user').value = '';
    document.getElementById('auth-pass').value = '';
    btn.disabled = false;

    updateNav();
    toast('Welcome, ' + S.user.displayName + '!');

    if (S.pendingType) {
      openModal();
    } else {
      goto('dashboard');
    }
  } catch(e) {
    showAuthError('Something went wrong. Please try again.');
    btn.textContent = S.authMode === 'login' ? 'Log in' : 'Create account';
    btn.disabled = false;
  }
}

function showAuthError(msg) {
  const err = document.getElementById('auth-error');
  err.textContent = msg; err.style.display = 'block';
}

async function doLogout() {
  S.user = null; S.profiles = []; S.activeP = null;
  updateNav();
  goto('home');
  toast('Logged out.', 'green');
}

/* ══════════════════════════════════════
   HOME CARD START
══════════════════════════════════════ */
function homeStart(type) {
  S.pendingType = type;
  if (!S.user) {
    setAuthMode('register');
    goto('auth');
    return;
  }
  openModal();
}

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
let _modalType = null;

function openModal() {
  _modalType = S.pendingType || null;
  const overlay = document.getElementById('modal');
  overlay.classList.add('open');
  document.getElementById('modal-step-type').style.display = '';
  document.getElementById('modal-step-name').style.display = 'none';
  document.getElementById('modal-confirm').style.display = 'none';
  document.getElementById('modal-name').value = '';
  document.getElementById('modal-name-error').style.display = 'none';
  // pre-select type if coming from home card
  document.querySelectorAll('.modal-type-card').forEach(c => {
    c.classList.remove('selected-alive','selected-deceased');
  });
  if (_modalType) {
    document.querySelectorAll('.modal-type-card').forEach(c => {
      if (
        (_modalType==='alive' && c.onclick.toString().includes("'alive'")) ||
        (_modalType==='deceased' && c.onclick.toString().includes("'deceased'"))
      ) {
        c.classList.add('selected-' + _modalType);
      }
    });
    showModalName();
  }
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  S.pendingType = null;
  _modalType = null;
}

function selectModalType(type) {
  _modalType = type;
  document.querySelectorAll('.modal-type-card').forEach(c => {
    c.classList.remove('selected-alive','selected-deceased');
  });
  event.currentTarget.classList.add('selected-' + type);
  showModalName();
}

function showModalName() {
  document.getElementById('modal-step-name').style.display = '';
  document.getElementById('modal-confirm').style.display = 'flex';
  document.getElementById('modal-name-label').textContent =
    _modalType === 'alive' ? 'Your name' : 'Their name';
  document.getElementById('modal-name').placeholder =
    _modalType === 'alive' ? 'Your full name...' : 'Full name of the person...';
  setTimeout(() => document.getElementById('modal-name').focus(), 80);
}

async function confirmCreate() {
  const name = document.getElementById('modal-name').value.trim();
  const errEl = document.getElementById('modal-name-error');
  if (!name) {
    errEl.textContent = 'Please enter a name.'; errEl.style.display = 'block'; return;
  }
  errEl.style.display = 'none';

  const profile = {
    id: 'p_' + Date.now(),
    type: _modalType,
    name: name,
    created: Date.now(),
    answers: {}
  };
  S.profiles.push(profile);
  await saveProfiles();
  closeModal();
  S.pendingType = null;
  S.activeP = S.profiles.length - 1;
  goto('questionnaire');
  renderQuestionnaire();
  toast(name + '\'s profile created!');
}

async function saveProfiles() {
  await ss('echo_profiles:' + S.user.username, S.profiles);
}

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
function renderDash() {
  const greeting = document.getElementById('dash-greeting');
  const sub = document.getElementById('dash-sub');
  greeting.textContent = 'Welcome back, ' + S.user.displayName;

  const alive = S.profiles.filter(p => p.type === 'alive').length;
  const dec = S.profiles.filter(p => p.type === 'deceased').length;
  const parts = [];
  if (alive) parts.push(alive + ' living profile' + (alive>1?'s':''));
  if (dec)   parts.push(dec + ' in memoriam');
  sub.textContent = parts.length ? parts.join(' · ') : 'No profiles yet — create your first one below.';

  const grid = document.getElementById('profile-grid');
  if (!S.profiles.length) {
    grid.innerHTML = `<div class="empty-state" role="status">
      <div style="font-size:40px">◌</div>
      <p>No profiles yet. Click <strong>+ New profile</strong> to begin.</p>
    </div>`;
    return;
  }

  grid.innerHTML = S.profiles.map((p, i) => {
    const cats = p.type === 'alive' ? CATS_ALIVE : CATS_DECEASED;
    const totalQ = cats.reduce((a, c) => a + c.questions.length, 0);
    const answeredQ = cats.reduce((a, c) =>
      a + c.questions.filter(q => isAnswered(p.answers[q.id])).length, 0);
    const pct = Math.round((answeredQ / totalQ) * 100);
    const icon = p.type === 'alive' ? '✦' : '◆';
    const label = p.type === 'alive' ? 'Living Profile' : 'In Memoriam';
    return `<div class="profile-card ${p.type}" role="listitem" tabindex="0"
        onclick="openProfile(${i})" onkeydown="if(event.key==='Enter')openProfile(${i})">
      <span class="profile-card-icon ${p.type}-icon">${icon}</span>
      <div class="profile-card-name">${esc(p.name)}</div>
      <div class="profile-card-type">${label}</div>
      <div class="profile-card-progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${pct}% complete">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="profile-card-stats">${answeredQ} of ${totalQ} answered (${pct}%)</div>
      <div class="profile-card-actions">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();viewProfileData(${i})">View</button>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openProfile(${i})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteProfile(${i})">Delete</button>
      </div>
    </div>`;
  }).join('');
}

function openProfile(i) {
  S.activeP = i;
  goto('questionnaire');
  renderQuestionnaire();
}

function viewProfileData(i) {
  S.activeP = i;
  goto('profile');
}

async function deleteProfile(i) {
  if (!confirm('Delete "' + S.profiles[i].name + '"? This cannot be undone.')) return;
  S.profiles.splice(i, 1);
  await saveProfiles();
  renderDash();
  toast('Profile deleted.', 'red');
}

/* ══════════════════════════════════════
   QUESTIONNAIRE
══════════════════════════════════════ */
let _currentCatId = null;

function isAnswered(v) {
  if (v === undefined || v === null || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function renderQuestionnaire() {
  const p = S.profiles[S.activeP];
  if (!p) { goto('dashboard'); return; }
  const cats = p.type === 'alive' ? CATS_ALIVE : CATS_DECEASED;
  if (!_currentCatId || !cats.find(c => c.id === _currentCatId)) {
    _currentCatId = cats[0].id;
  }
  renderSidebar(p, cats);
  renderCatQuestions(p, cats);
}

function renderSidebar(p, cats) {
  const sidebar = document.getElementById('q-sidebar');
  const accentClass = p.type === 'alive' ? 'alive-icon' : 'deceased-icon';
  const label = p.type === 'alive' ? '✦ Living Profile' : '◆ In Memoriam';
  const labelClass = p.type === 'alive' ? 'alive' : 'deceased';

  sidebar.innerHTML = `
    <div class="sidebar-profile">
      <div class="sidebar-profile-name">${esc(p.name)}</div>
      <div class="sidebar-profile-type ${labelClass}">${label}</div>
    </div>
    <nav aria-label="Question categories">
      ${cats.map(cat => {
        const ans = cat.questions.filter(q => isAnswered(p.answers[q.id])).length;
        const tot = cat.questions.length;
        const done = ans === tot;
        return `<button class="sidebar-cat${cat.id === _currentCatId ? ' active' : ''}"
            onclick="switchCat('${cat.id}')" aria-current="${cat.id === _currentCatId ? 'page' : 'false'}">
          <span class="sidebar-cat-icon">${cat.icon}</span>
          <span class="sidebar-cat-name">${esc(cat.title)}</span>
          <span class="sidebar-cat-count${done?' done':''}">
            ${done ? '✓' : (ans + '/' + tot)}
          </span>
        </button>`;
      }).join('')}
    </nav>
    <div style="padding:1rem 0.75rem;margin-top:auto">
      <button class="btn btn-ghost btn-sm" onclick="viewProfileData(${S.activeP})" style="width:100%;margin-bottom:6px">View profile</button>
      <button class="btn btn-ghost btn-sm" onclick="goto('dashboard')" style="width:100%">← Dashboard</button>
    </div>`;
}

function switchCat(catId) {
  _currentCatId = catId;
  renderQuestionnaire();
  document.getElementById('q-main').scrollTop = 0;
}

function renderCatQuestions(p, cats) {
  const cat = cats.find(c => c.id === _currentCatId);
  const main = document.getElementById('q-main');
  const accentVar = p.type === 'alive' ? 'var(--green)' : 'var(--purple)';
  const selClass = 'selected-' + p.type;

  let html = `
    <div class="q-category-header">
      <span class="q-category-icon">${cat.icon}</span>
      <div class="q-category-title">${esc(cat.title)}</div>
      <div class="q-category-desc">${esc(cat.desc)}</div>
    </div>`;

  cat.questions.forEach((q, qi) => {
    const val = p.answers[q.id];
    html += `<div class="q-item" id="qi-${q.id}">
      <div class="q-number">${esc(cat.title)} · ${qi + 1} of ${cat.questions.length}</div>
      <div class="q-text">${esc(q.text)}</div>
      ${renderQInput(q, val, selClass, p.type)}
    </div>`;
  });

  html += `<div class="q-save-row">
    <button class="btn btn-primary" onclick="saveAll()" style="flex:1;padding:11px">
      Save answers
    </button>
    <button class="btn btn-ghost" onclick="advanceCat()">Next section →</button>
  </div>`;

  main.innerHTML = html;
  window.scrollTo(0,0);
}

function renderQInput(q, val, selClass, profileType) {
  if (q.type === 'text') {
    return `<input type="text" class="form-input" data-qid="${q.id}"
      value="${esc(val||'')}" placeholder="${esc(q.ph||'')}"
      oninput="liveUpdate('${q.id}',this.value)">`;
  }
  if (q.type === 'ta') {
    return `<textarea class="form-input" data-qid="${q.id}" rows="4"
      placeholder="${esc(q.ph||'')}"
      oninput="liveUpdate('${q.id}',this.value)">${esc(val||'')}</textarea>`;
  }
  if (q.type === 'sc') {
    const v = (val !== undefined && val !== null) ? Number(val) : 5;
    return `<div class="slider-wrap">
      <div class="slider-labels"><span>${esc(q.labels[0])}</span><span>${esc(q.labels[1])}</span></div>
      <input type="range" min="1" max="10" step="1" value="${v}" data-qid="${q.id}"
        oninput="liveUpdate('${q.id}',parseInt(this.value));document.getElementById('sv-${q.id}').textContent=this.value"
        style="accent-color:${profileType==='alive'?'var(--green)':'var(--purple)'}">
      <div class="slider-value"><span id="sv-${q.id}">${v}</span> <span>/ 10</span></div>
    </div>`;
  }
  if (q.type === 'ch') {
    return `<div class="choice-options" role="radiogroup">
      ${q.opts.map(o => `
        <button class="choice-btn${val===o?' '+selClass:''}" role="radio" aria-checked="${val===o}"
          onclick="selectChoice('${q.id}',${JSON.stringify(o)},this)">
          <span class="choice-dot"></span>${esc(o)}
        </button>`).join('')}
    </div>`;
  }
  if (q.type === 'ms') {
    const sel = Array.isArray(val) ? val : [];
    return `<div class="chips-wrap" role="group">
      ${q.opts.map(o => `
        <button class="chip${sel.includes(o)?' '+profileType+'-chip':''}"
          onclick="toggleChip('${q.id}',${JSON.stringify(o)},this,'${profileType}')">
          ${esc(o)}
        </button>`).join('')}
    </div>`;
  }
  return '';
}

/* Live update helpers */
function liveUpdate(qid, val) {
  const p = S.profiles[S.activeP];
  if (p) p.answers[qid] = val;
}

function selectChoice(qid, val, el) {
  const p = S.profiles[S.activeP];
  if (!p) return;
  p.answers[qid] = val;
  const wrap = el.closest('.choice-options');
  const selClass = 'selected-' + p.type;
  wrap.querySelectorAll('.choice-btn').forEach(b => {
    b.classList.remove('selected-alive','selected-deceased');
    b.setAttribute('aria-checked','false');
  });
  el.classList.add(selClass);
  el.setAttribute('aria-checked','true');
}

function toggleChip(qid, val, el, profileType) {
  const p = S.profiles[S.activeP];
  if (!p) return;
  let cur = Array.isArray(p.answers[qid]) ? [...p.answers[qid]] : [];
  const chipClass = profileType + '-chip';
  if (cur.includes(val)) {
    cur = cur.filter(x => x !== val);
    el.classList.remove(chipClass);
  } else {
    cur.push(val);
    el.classList.add(chipClass);
  }
  p.answers[qid] = cur;
}

async function saveAll() {
  await saveProfiles();
  toast('Saved ✓');
  // refresh sidebar counts
  const p = S.profiles[S.activeP];
  if (p) renderSidebar(p, p.type === 'alive' ? CATS_ALIVE : CATS_DECEASED);
}

function advanceCat() {
  const p = S.profiles[S.activeP];
  const cats = p.type === 'alive' ? CATS_ALIVE : CATS_DECEASED;
  const idx = cats.findIndex(c => c.id === _currentCatId);
  if (idx < cats.length - 1) {
    saveAll();
    _currentCatId = cats[idx + 1].id;
    renderQuestionnaire();
  } else {
    saveAll().then(() => {
      goto('dashboard');
      toast('All done! Profile complete.');
    });
  }
}

/* ══════════════════════════════════════
   PROFILE VIEW
══════════════════════════════════════ */
function renderProfileView() {
  const p = S.profiles[S.activeP];
  if (!p) { goto('dashboard'); return; }
  const cats = p.type === 'alive' ? CATS_ALIVE : CATS_DECEASED;
  const totalQ = cats.reduce((a,c) => a + c.questions.length, 0);
  const answeredQ = cats.reduce((a,c) =>
    a + c.questions.filter(q => isAnswered(p.answers[q.id])).length, 0);
  const pct = Math.round((answeredQ / totalQ) * 100);
  const icon = p.type === 'alive' ? '✦' : '◆';
  const label = p.type === 'alive' ? 'Living Profile' : 'In Memoriam';

  const sections = cats.map(cat => {
    const filled = cat.questions.filter(q => isAnswered(p.answers[q.id]));
    if (!filled.length) return '';
    return `<div class="pv-section">
      <div class="pv-section-title">${cat.icon} ${esc(cat.title)}</div>
      ${filled.map(q => {
        const v = p.answers[q.id];
        const disp = Array.isArray(v) ? v.join(' · ')
          : (typeof v === 'number' ? v + ' / 10' : String(v));
        return `<div class="pv-qa">
          <div class="pv-question">${esc(q.text)}</div>
          <div class="pv-answer">${esc(disp)}</div>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  document.getElementById('profile-view-inner').innerHTML = `
    <div class="pv-header">
      <div>
        <div class="pv-title">${icon} ${esc(p.name)}</div>
        <div class="pv-type ${p.type}">${label}</div>
        <div class="pv-completion">${answeredQ} of ${totalQ} answered (${pct}%)</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="openProfile(${S.activeP})">Edit</button>
        <button class="btn btn-primary" onclick="exportProfile(${S.activeP})">Export JSON</button>
        <button class="btn btn-ghost" onclick="goto('dashboard')">← Back</button>
      </div>
    </div>
    ${sections || '<p style="color:var(--w50);font-size:15px">No answers yet — start filling in the questionnaire.</p>'}`;
}

function exportProfile(i) {
  const p = S.profiles[i];
  const cats = p.type === 'alive' ? CATS_ALIVE : CATS_DECEASED;
  const data = {
    name: p.name,
    type: p.type,
    exportedAt: new Date().toISOString(),
    profile: cats.map(cat => ({
      category: cat.title,
      questions: cat.questions.map(q => ({
        question: q.text,
        answer: p.answers[q.id] ?? null
      }))
    }))
  };
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'echo_' + p.name.toLowerCase().replace(/\s+/g,'_') + '.json';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    toast('Exported!');
  } catch { toast('Export failed.','red'); }
}

/* ══════════════════════════════════════
   BOOT
══════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen after animation
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('main-nav').classList.add('visible');
    buildWaveform();
    document.getElementById('view-home').classList.add('active');
  }, 2200);
});
