/* ════════════════════════════════════════════
   ECHO — app.js
   Mouse BG · Auth · Profiles · Questionnaire
════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════════
   MOUSE-DRIVEN CANVAS BACKGROUND
══════════════════════════════════════ */
(function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Lerp targets
  let mxR = 0.5, myR = 0.5;   // raw 0-1
  let mxL = 0.5, myL = 0.5;   // lerped
  let gxL = 0, gyL = 0;        // glow lerped (px)
  let gxR = 0, gyR = 0;        // glow raw (px)
  let hasMoved = false;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!hasMoved) {
      gxR = gxL = window.innerWidth  * 0.5;
      gyR = gyL = window.innerHeight * 0.4;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    hasMoved = true;
    mxR = e.clientX / window.innerWidth;
    myR = e.clientY / window.innerHeight;
    gxR = e.clientX;
    gyR = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawBG() {
    const W = canvas.width, H = canvas.height;

    // Lerp positions — background slightly slower than glow
    mxL = lerp(mxL, mxR, 0.07);
    myL = lerp(myL, myR, 0.07);
    gxL = lerp(gxL, gxR, 0.09);
    gyL = lerp(gyL, gyR, 0.09);

    ctx.clearRect(0, 0, W, H);

    // ── Base colour ──────────────────────────
    ctx.fillStyle = '#020805';
    ctx.fillRect(0, 0, W, H);

    // ── Primary mouse glow ───────────────────
    const mx = mxL * W, my = myL * H;
    const r1 = Math.max(W, H) * 0.55;
    const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, r1);
    g1.addColorStop(0,    'rgba(0,140,60,0.42)');
    g1.addColorStop(0.35, 'rgba(0,80,35,0.18)');
    g1.addColorStop(0.7,  'rgba(0,40,20,0.06)');
    g1.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    // ── Secondary soft glow (larger, dimmer) ─
    const r2 = Math.max(W, H) * 0.8;
    const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, r2);
    g2.addColorStop(0,   'rgba(0,80,36,0.18)');
    g2.addColorStop(0.5, 'rgba(0,30,14,0.06)');
    g2.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // ── Opposite ambient (balances the scene) ─
    const ox = W - mx, oy = H - my;
    const r3 = Math.max(W, H) * 0.5;
    const g3 = ctx.createRadialGradient(ox, oy, 0, ox, oy, r3);
    g3.addColorStop(0,   'rgba(0,20,10,0.22)');
    g3.addColorStop(0.6, 'rgba(0,10,5,0.06)');
    g3.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, W, H);

    // ── White specular flash near cursor ─────
    const r4 = 120;
    const g4 = ctx.createRadialGradient(mx, my, 0, mx, my, r4);
    g4.addColorStop(0,   'rgba(255,255,255,0.025)');
    g4.addColorStop(0.4, 'rgba(255,255,255,0.006)');
    g4.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g4;
    ctx.fillRect(0, 0, W, H);

    // ── Update cursor glow element ────────────
    const glowEl = document.getElementById('cursor-glow');
    if (glowEl) {
      glowEl.style.left = gxL.toFixed(1) + 'px';
      glowEl.style.top  = gyL.toFixed(1) + 'px';
    }

    requestAnimationFrame(drawBG);
  }

  requestAnimationFrame(drawBG);
})();

/* ══════════════════════════════════════
   QUESTION BANKS
══════════════════════════════════════ */

const CATS_ALIVE = [
  { id:'identity', icon:'🧠', title:'Core Identity', desc:'The foundation of who you are today.',
    questions:[
      {id:'a_id1',type:'text',text:'What is your full name, and what do you prefer to be called?',ph:'e.g. Alexandra Chen — goes by Alex'},
      {id:'a_id2',type:'ta',  text:'What is your age, nationality, and cultural background?',ph:'Age, country, heritage and cultural influences...'},
      {id:'a_id3',type:'ta',  text:'Where did you grow up, and where have you lived throughout your life?',ph:'Cities or countries and how long in each...'},
      {id:'a_id4',type:'ta',  text:'Describe your family structure — siblings, birth order, and relationship with your parents.',ph:'Who raised you, family dynamics, your place in the family...'},
      {id:'a_id5',type:'ta',  text:'What is your education history and your general attitude toward school?',ph:'Schools attended, subjects loved or hated...'},
      {id:'a_id6',type:'ta',  text:'Describe your career path and how you feel about your work.',ph:'Jobs held, current role, your relationship with your career...'},
    ]},
  { id:'comms', icon:'🗣️', title:'Communication Style', desc:'How you express yourself to the world.',
    questions:[
      {id:'a_cm1',type:'ch', text:'Are you a formal or informal speaker?',opts:['Very formal','Mostly formal','Mixed — context-dependent','Mostly informal','Very informal / lots of slang']},
      {id:'a_cm2',type:'sc', text:'How elaborate are your typical responses?',labels:['Very terse','Very elaborate']},
      {id:'a_cm3',type:'ch', text:'Do you prefer to lead with your conclusion or build up to it?',opts:['Lead with the conclusion (BLUF)','Build up to it gradually','Depends entirely on context']},
      {id:'a_cm4',type:'ch', text:'How do you express disagreement?',opts:['Very directly','Diplomatically — I soften it','Avoidantly — I rarely voice it','Depends on who I\'m with']},
      {id:'a_cm5',type:'ms', text:'What kind of humour do you use?',opts:['Dry / deadpan','Self-deprecating','Absurdist / surreal','Witty / wordplay','Sarcastic','I rarely use humour']},
      {id:'a_cm6',type:'ta', text:'What words or phrases do you tend to overuse?',ph:'"literally", "honestly", "basically", "you know"...'},
      {id:'a_cm7',type:'ta', text:'How does your style differ between writing and speaking?',ph:'More formal in writing? Funnier in person? Different vocabulary?'},
    ]},
  { id:'personality', icon:'🎭', title:'Personality', desc:'Your inner world and how it shows.',
    questions:[
      {id:'a_ps1',type:'text',text:'Describe yourself in exactly 5 words.',ph:'curious, stubborn, warm, analytical, loud'},
      {id:'a_ps2',type:'ta',  text:'How would others describe you — and does that differ from your self-view?',ph:'What friends or colleagues say vs. how you see yourself...'},
      {id:'a_ps3',type:'sc',  text:'Where do you fall on the introvert/extrovert spectrum?',labels:['Deep introvert','Intense extrovert']},
      {id:'a_ps4',type:'ta',  text:'How do you behave under stress or pressure?',ph:'Quiet, snappy, hyperproductive, shut down...'},
      {id:'a_ps5',type:'ms',  text:'What are your emotional defaults?',opts:['Anxious','Optimistic','Cynical','Calm','Enthusiastic','Melancholic','Guarded','Playful','Restless']},
      {id:'a_ps6',type:'ta',  text:'What are your biggest pet peeves?',ph:'Things that irritate you out of proportion to their significance...'},
      {id:'a_ps7',type:'sc',  text:'Are you more ruled by logic or feeling when making decisions?',labels:['Pure logic','Pure feeling']},
    ]},
  { id:'values', icon:'💡', title:'Values & Worldview', desc:'What you believe and what drives you.',
    questions:[
      {id:'a_vl1',type:'ta',text:'What are your core personal values? List and rank up to 5.',ph:'Honesty, loyalty, freedom, creativity — in order of importance...'},
      {id:'a_vl2',type:'ta',text:'How would you describe your political and social views?',ph:'Share as much or as little as you\'re comfortable with...'},
      {id:'a_vl3',type:'ta',text:'Do you hold religious or spiritual beliefs, and how much do they shape daily life?',ph:'Beliefs, practices, how central they are to your identity...'},
      {id:'a_vl4',type:'ta',text:'What is your ethical framework — how do you decide what\'s right or wrong?',ph:'Rules-based, outcome-based, gut feeling, cultural norms...'},
      {id:'a_vl5',type:'ta',text:'What gives you the most meaning day-to-day?',ph:'What makes a day feel genuinely worthwhile?'},
    ]},
  { id:'knowledge', icon:'🧩', title:'Knowledge & Interests', desc:'What you know and what fascinates you.',
    questions:[
      {id:'a_kn1',type:'ta',text:'What topics could you talk about for hours?',ph:'Your genuine obsessions and deep interests...'},
      {id:'a_kn2',type:'ta',text:'What are your hobbies and how seriously do you pursue them?',ph:'List them and your level of dedication to each...'},
      {id:'a_kn3',type:'ta',text:'What are your areas of professional or deep personal expertise?',ph:'What do people come to you for advice on?'},
      {id:'a_kn4',type:'ta',text:'What are your favourite books, films, or music — and why do they resonate?',ph:'Not just titles — explain what draws you to them specifically...'},
      {id:'a_kn5',type:'ms',text:'How do you prefer to learn new things?',opts:['Reading books or articles','Watching videos','Listening to podcasts','Hands-on experimentation','Talking to experts','Taking formal courses','Learning by failing']},
    ]},
  { id:'relationships', icon:'🤝', title:'Relationships & Social', desc:'How you connect with others.',
    questions:[
      {id:'a_rl1',type:'ta',text:'How do you behave differently with close friends versus strangers?',ph:'What opens up, what shuts down, how your personality shifts...'},
      {id:'a_rl2',type:'ta',text:'How do you show care or affection to people you\'re close to?',ph:'Words, acts of service, gifts, quality time, physical affection...'},
      {id:'a_rl3',type:'ch',text:'What is your attachment style?',opts:['Secure — comfortable with closeness and independence','Anxious — I worry about abandonment','Avoidant — I value independence and find closeness hard','Not sure / I haven\'t thought about it']},
      {id:'a_rl4',type:'ta',text:'How do you handle conflict with people you love?',ph:'Fight, freeze, flee? How do you repair things afterward?'},
      {id:'a_rl5',type:'ch',text:'In groups, do you tend to lead, follow, or observe?',opts:['I naturally lead','I contribute but don\'t lead','I follow whoever\'s leading','I mostly observe','It varies by context']},
    ]},
  { id:'decisions', icon:'⚖️', title:'Decision-Making', desc:'How you think through choices.',
    questions:[
      {id:'a_dc1',type:'sc',text:'Do you make decisions quickly or deliberate extensively?',labels:['Snap decisions','Extensive deliberation']},
      {id:'a_dc2',type:'sc',text:'How risk-tolerant are you?',labels:['Risk-averse','Risk-taker']},
      {id:'a_dc3',type:'ch',text:'What is your relationship with rules?',opts:['I follow rules rigorously','I follow unless I strongly disagree','I bend rules when convenient','I ignore rules I consider arbitrary']},
      {id:'a_dc4',type:'ta',text:'How do you prioritise when everything feels urgent?',ph:'Your mental framework for triage under pressure...'},
    ]},
  { id:'story', icon:'📖', title:'Memory & Story', desc:'The experiences that made you.',
    questions:[
      {id:'a_st1',type:'ta',text:'What are 3–5 of the most formative experiences of your life?',ph:'Moments that fundamentally changed who you are or what you believe...'},
      {id:'a_st2',type:'ta',text:'What is your biggest regret?',ph:'What do you wish you had done differently?'},
      {id:'a_st3',type:'ta',text:'What are you most proud of?',ph:'Achievements, qualities, or choices you feel genuinely good about...'},
      {id:'a_st4',type:'ta',text:'What is a story you tell repeatedly that reveals something true about you?',ph:'A favourite anecdote — the one that always seems to come up...'},
    ]},
  { id:'goals', icon:'🌅', title:'Goals & Fears', desc:'Where you\'re headed and what holds you back.',
    questions:[
      {id:'a_gl1',type:'ta',text:'What are you actively working toward right now?',ph:'Current goals — personal, professional, creative, relational...'},
      {id:'a_gl2',type:'ta',text:'What are you most afraid of?',ph:'Rational fears, irrational fears, things you don\'t like to admit...'},
      {id:'a_gl3',type:'ta',text:'What would you pursue if you knew you couldn\'t fail?',ph:'Your unconstrained ambition...'},
      {id:'a_gl4',type:'ta',text:'What does success look like to you — not society\'s version, but yours?',ph:'Be specific and honest...'},
      {id:'a_gl5',type:'ta',text:'How do you want to be remembered?',ph:'Your ideal legacy...'},
    ]},
  { id:'daily', icon:'🔁', title:'Daily Life & Habits', desc:'The texture of your everyday existence.',
    questions:[
      {id:'a_dl1',type:'ta',text:'Walk through a typical day from waking to sleeping.',ph:'Approximate times, routines, where you spend your energy...'},
      {id:'a_dl2',type:'sc',text:'Are you a morning person or a night owl?',labels:['Total morning person','Total night owl']},
      {id:'a_dl3',type:'ta',text:'How do you recharge after a draining day or week?',ph:'What genuinely restores your energy?'},
      {id:'a_dl4',type:'ta',text:'Describe your actual habits around eating, sleep, and exercise — the reality, not the aspiration.',ph:'What you actually do, not what you wish you did...'},
    ]},
  { id:'voice', icon:'🎤', title:'Voice & Presence', desc:'How your physicality shapes communication.',
    questions:[
      {id:'a_vc1',type:'sc',  text:'How would you describe your pace of speech?',labels:['Very slow and measured','Very fast and energetic']},
      {id:'a_vc2',type:'text',text:'Do you have vocal tics or filler words you use often?',ph:'"like", "um", "you know", "basically"...'},
      {id:'a_vc3',type:'ta',  text:'Do you have an accent or distinctive regional speech patterns?',ph:'Where people guess you\'re from when they first hear you...'},
      {id:'a_vc4',type:'ta',  text:'What physical gestures or mannerisms accompany your speech?',ph:'Hand gestures, facial expressions, posture, eye contact habits...'},
    ]},
];

const CATS_DECEASED = [
  { id:'who', icon:'🕊️', title:'Who They Were', desc:'The person at their core.',
    questions:[
      {id:'d_wh1',type:'text',text:'What was their full name, and what did people call them?',ph:'Full name and preferred name or nickname...'},
      {id:'d_wh2',type:'ta',  text:'When were they born and when did they pass? How old were they?',ph:'Dates and age at passing...'},
      {id:'d_wh3',type:'ta',  text:'What was their nationality, cultural background, and heritage?',ph:'Country of origin, ethnic background, cultural traditions...'},
      {id:'d_wh4',type:'ta',  text:'Describe their family — who they came from and who they built.',ph:'Parents, siblings, partners, children — the family they were part of...'},
      {id:'d_wh5',type:'ta',  text:'What did they do for work throughout their life, and how did they feel about it?',ph:'Career paths, jobs, how central work was to their identity...'},
    ]},
  { id:'personality', icon:'🎭', title:'Personality & Character', desc:'The qualities that defined them.',
    questions:[
      {id:'d_ps1',type:'text',text:'How would you describe them in exactly 5 words?',ph:'warm, stubborn, funny, generous, quiet...'},
      {id:'d_ps2',type:'ta',  text:'How did others describe them — what words came up in their memory?',ph:'What people said at their best, in eulogies, stories...'},
      {id:'d_ps3',type:'sc',  text:'Were they an introvert or extrovert?',labels:['Deep introvert','Intense extrovert']},
      {id:'d_ps4',type:'ta',  text:'How did they behave under stress or difficulty?',ph:'Did they go quiet, get animated, turn to humour, withdraw...'},
      {id:'d_ps5',type:'ms',  text:'What were their consistent emotional qualities?',opts:['Warm','Anxious','Funny','Stoic','Generous','Reserved','Passionate','Patient','Impulsive','Gentle','Fierce']},
      {id:'d_ps6',type:'ta',  text:'What were their biggest pet peeves?',ph:'Things that consistently got under their skin...'},
      {id:'d_ps7',type:'ta',  text:'What made them light up? Where did the best of them show?',ph:'Topics, people, activities where they truly came alive...'},
    ]},
  { id:'voice', icon:'🗣️', title:'Their Voice', desc:'How they spoke and expressed themselves.',
    questions:[
      {id:'d_cm1',type:'ch',  text:'How would you describe their communication style?',opts:['Very formal — proper and precise','Warm and chatty','Quiet but thoughtful','Loud and expressive','Funny and quick','Varied by context']},
      {id:'d_cm2',type:'ta',  text:'What words or phrases did they use so often you can still hear them say it?',ph:'Their catchphrases, favourite expressions, turns of phrase...'},
      {id:'d_cm3',type:'ta',  text:'What was their sense of humour like?',ph:'Dry, warm, slapstick, sharp, self-deprecating, storytelling...'},
      {id:'d_cm4',type:'ta',  text:'How did they give advice, comfort, or criticism?',ph:'Blunt? Gentle? Did they tell stories? Listen first?'},
      {id:'d_cm5',type:'ta',  text:'What topics could they hold court on indefinitely?',ph:'The subjects they\'d turn any conversation toward...'},
    ]},
  { id:'values', icon:'💡', title:'Values & Beliefs', desc:'What they stood for and lived by.',
    questions:[
      {id:'d_vl1',type:'ta',text:'What did they seem to value most in life? What drove their decisions?',ph:'What they consistently chose, protected, fought for...'},
      {id:'d_vl2',type:'ta',text:'What were their political, social, or civic views?',ph:'How engaged were they? What causes mattered to them?'},
      {id:'d_vl3',type:'ta',text:'Did they hold religious or spiritual beliefs? How central were they?',ph:'Faith, practice, tradition, or lack thereof...'},
      {id:'d_vl4',type:'ta',text:'What was their code of ethics — how did they decide what was right or wrong?',ph:'Their moral compass, spoken or simply lived...'},
      {id:'d_vl5',type:'ta',text:'What did they believe life was for?',ph:'Their philosophy about what made a life worthwhile...'},
    ]},
  { id:'relationships', icon:'🤝', title:'Relationships & Love', desc:'How they connected with others.',
    questions:[
      {id:'d_rl1',type:'ta',text:'How did they love the people they were close to? How did they show it?',ph:'Practical care, words, physical affection, acts of service, presence...'},
      {id:'d_rl2',type:'ta',text:'What kind of friend were they? What did people love about them?',ph:'Reliable, funny, honest, loyal, the one who picked you up...'},
      {id:'d_rl3',type:'ta',text:'Describe their most significant relationship — what did it look like day to day?',ph:'Its texture, character, what it meant to them...'},
      {id:'d_rl4',type:'ta',text:'How did they handle conflict or difficulty in relationships?',ph:'Confront, withdraw, soften, stand firm, hold grudges, forgive quickly...'},
      {id:'d_rl5',type:'ch', text:'In groups or gatherings, what was their role?',opts:['The life of the party','The quiet observer','The storyteller','The organiser','The peacemaker','The one who held it all together','It varied']},
    ]},
  { id:'passions', icon:'🧩', title:'Passions & Pastimes', desc:'What they loved doing with their time.',
    questions:[
      {id:'d_pa1',type:'ta',text:'What were their hobbies, interests, or passions?',ph:'How they spent weekends, evenings, retirement...'},
      {id:'d_pa2',type:'ta',text:'Were there topics they were particularly knowledgeable or passionate about?',ph:'Areas where they were the expert in the room...'},
      {id:'d_pa3',type:'ta',text:'What books, films, music, or art did they love — and what did that reveal?',ph:'Their favourites and why they mattered, if you know...'},
      {id:'d_pa4',type:'ta',text:'Did they have a creative side? Did they make things?',ph:'Writing, cooking, gardening, building, drawing, music, craft...'},
    ]},
  { id:'story', icon:'📖', title:'Their Story', desc:'The moments and memories that define them.',
    questions:[
      {id:'d_st1',type:'ta',text:'What are the most formative events of their life — the ones that made them who they were?',ph:'Pivotal moments of hardship, joy, transformation, loss, discovery...'},
      {id:'d_st2',type:'ta',text:'What stories about them get retold most often?',ph:'The classic anecdotes, the things that\'ve become legend...'},
      {id:'d_st3',type:'ta',text:'What were they most proud of in their life?',ph:'Achievements, relationships, how they lived — said or unsaid...'},
      {id:'d_st4',type:'ta',text:'What hardships did they face — and how did they face them?',ph:'Struggles, losses, challenges — and what they revealed about who they were...'},
      {id:'d_st5',type:'ta',text:'Is there anything they wished they\'d done differently?',ph:'Expressed or implied — what you sensed they carried...'},
    ]},
  { id:'legacy', icon:'🌿', title:'Legacy & Impact', desc:'What they left behind.',
    questions:[
      {id:'d_lg1',type:'ta',text:'How did they want to be remembered — did they ever say?',ph:'Explicit wishes or the impression they gave about what mattered...'},
      {id:'d_lg2',type:'ta',text:'What did they leave behind in the people who knew them?',ph:'How their presence shaped others — habits, values, phrases, lessons...'},
      {id:'d_lg3',type:'ta',text:'What do you miss most about them?',ph:'The specific things — small or large — that their absence has made you aware of...'},
      {id:'d_lg4',type:'ta',text:'What do you wish you had said to them, or asked them?',ph:'The conversations you didn\'t get to have...'},
      {id:'d_lg5',type:'ta',text:'If they could speak now, what do you believe they would say to the people they loved?',ph:'Your best sense of what they\'d want the people they cared for to know...'},
    ]},
  { id:'daily', icon:'🔁', title:'Daily Life & Habits', desc:'The texture of their everyday existence.',
    questions:[
      {id:'d_dl1',type:'ta',text:'Describe a typical day in their life at a stage you knew them well.',ph:'Morning routines, rhythms, what a normal day looked like...'},
      {id:'d_dl2',type:'ch',text:'Were they a morning person or a night owl?',opts:['Definite morning person','Night owl — came alive after dark','Neither — ran on their own clock','Varied throughout their life']},
      {id:'d_dl3',type:'ta',text:'What were their rituals or habits — things they did consistently, maybe without thinking?',ph:'The morning coffee, evening walk, the way they read, the Sunday routine...'},
      {id:'d_dl4',type:'ta',text:'What was their relationship with food? What did they love to eat or cook?',ph:'A love of cooking, a signature dish, favourite foods, food memories...'},
    ]},
];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
const S = {
  user:     null,
  profiles: [],
  activeP:  null,
  pendingType: null,
};
let _currentCatId = null;

/* ══════════════════════════════════════
   STORAGE — localStorage
══════════════════════════════════════ */
function lsGet(k) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function lsSet(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); return true; }
  catch { return false; }
}
function lsDel(k) { try { localStorage.removeItem(k); } catch {} }

function getUsers()   { return lsGet('echo_users')   || {}; }
function saveUsers(u) { lsSet('echo_users', u); }
function getSession() { return lsGet('echo_session'); }
function setSession(u){ lsSet('echo_session', u); }
function clearSession(){ lsDel('echo_session'); }
function getProfiles()  { if(!S.user) return []; return lsGet('echo_profiles:'+S.user.username)||[]; }
function saveProfiles()  { if(!S.user) return; lsSet('echo_profiles:'+S.user.username, S.profiles); }

/* ══════════════════════════════════════
   HASH
══════════════════════════════════════ */
async function hashPwd(p) {
  const d = new TextEncoder().encode(p + 'echo_v1_salt');
  const h = await crypto.subtle.digest('SHA-256', d);
  return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

/* ══════════════════════════════════════
   ESCAPE
══════════════════════════════════════ */
function esc(s) {
  return String(s||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
let _tt;
function toast(msg, type='ok') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(_tt);
  _tt = setTimeout(() => el.className='toast', 2600);
}

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
function goto(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-'+view);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('active', l.dataset.view === view));
  updateNav();
  if (view === 'dashboard')    renderDash();
  if (view === 'home')         buildWaveform();
  if (view === 'profile')      renderPV();
  if (view === 'questionnaire') renderQ();
}

function requireAuth(v) { S.user ? goto(v) : showAuth('login'); }

function updateNav() {
  const act = document.getElementById('nav-actions');
  const pl  = document.getElementById('nav-profiles-li');
  if (S.user) {
    act.innerHTML = `
      <span class="nav-user" onclick="goto('dashboard')">${esc(S.user.displayName)}</span>
      <button class="btn btn-ghost btn-sm" onclick="doLogout()">Log out</button>`;
    if (pl) pl.style.display = '';
  } else {
    act.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="showAuth('login')">Log in</button>
      <button class="btn btn-primary btn-sm" onclick="showAuth('signup')">Get started</button>`;
    if (pl) pl.style.display = 'none';
  }
}

function showAuth(mode) {
  goto('auth');
  switchAuth(mode);
}

/* ══════════════════════════════════════
   AUTH — SWITCH
══════════════════════════════════════ */
function switchAuth(mode) {
  const login  = document.getElementById('auth-login-panel');
  const signup = document.getElementById('auth-signup-panel');
  clearAuthErrors();
  if (mode === 'signup') {
    login.style.display  = 'none';
    signup.style.display = '';
    setTimeout(() => document.getElementById('su-name').focus(), 80);
  } else {
    signup.style.display = 'none';
    login.style.display  = '';
    setTimeout(() => document.getElementById('li-user').focus(), 80);
  }
}

function clearAuthErrors() {
  ['li-user-err','li-pass-err','li-error',
   'su-name-err','su-user-err','su-email-err','su-pass-err','su-confirm-err','su-error']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = 'none';
      el.className = el.className.replace(' show','');
    });
  ['li-user','li-pass','su-name','su-user','su-email','su-pass','su-confirm']
    .forEach(id => { const el=document.getElementById(id); if(el) el.classList.remove('err'); });
}

function showFieldErr(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg; el.style.display = 'block'; el.classList.add('show');
}
function showBoxErr(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg; el.style.display = 'block';
}

/* ══════════════════════════════════════
   AUTH — LOGIN
══════════════════════════════════════ */
async function doLogin() {
  clearAuthErrors();
  const userVal = document.getElementById('li-user').value.trim();
  const passVal = document.getElementById('li-pass').value;
  let ok = true;

  if (!userVal) { showFieldErr('li-user-err','Please enter your username or email.'); document.getElementById('li-user').classList.add('err'); ok=false; }
  if (!passVal)  { showFieldErr('li-pass-err','Please enter your password.'); document.getElementById('li-pass').classList.add('err'); ok=false; }
  if (!ok) return;

  const btn = document.getElementById('li-btn');
  btn.textContent = 'Signing in…'; btn.disabled = true;

  try {
    const h = await hashPwd(passVal);
    const users = getUsers();
    // find by username or email
    const key = Object.keys(users).find(k =>
      k === userVal.toLowerCase() || users[k].email === userVal.toLowerCase()
    );
    const usr = key ? users[key] : null;

    if (!usr || usr.hash !== h) {
      showBoxErr('li-error','Incorrect username / email or password.');
      btn.textContent = 'Sign in'; btn.disabled = false; return;
    }

    S.user = { username:usr.username, displayName:usr.displayName, email:usr.email };
    setSession(S.user);
    S.profiles = getProfiles();
    document.getElementById('li-user').value = '';
    document.getElementById('li-pass').value = '';
    btn.textContent = 'Sign in'; btn.disabled = false;
    updateNav();
    toast('Welcome back, ' + S.user.displayName + '!');
    if (S.pendingType) { S.pendingType && openModal(); }
    else goto('dashboard');
  } catch(e) {
    showBoxErr('li-error','Something went wrong. Please try again.');
    btn.textContent = 'Sign in'; btn.disabled = false;
  }
}

/* ══════════════════════════════════════
   AUTH — SIGNUP
══════════════════════════════════════ */
function liveStrength(p) {
  const fill  = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');
  if (!fill || !label) return;
  const score = pwdScore(p);
  const pct   = [0, 25, 50, 75, 100][score];
  const cols  = ['','#e05050','#e08a30','#c0c030','#00c060'];
  const labs  = ['','Weak','Fair','Good','Strong'];
  fill.style.width = pct + '%';
  fill.style.background = cols[score] || '';
  label.textContent = labs[score] || '';
  label.style.color = cols[score] || '';
}

function pwdScore(p) {
  let s = 0;
  if (p.length >= 8)  s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

async function doSignup() {
  clearAuthErrors();
  const name    = document.getElementById('su-name').value.trim();
  const uname   = document.getElementById('su-user').value.trim();
  const email   = document.getElementById('su-email').value.trim();
  const pass    = document.getElementById('su-pass').value;
  const confirm = document.getElementById('su-confirm').value;
  let ok = true;

  if (!name)   { showFieldErr('su-name-err','Please enter your full name.'); document.getElementById('su-name').classList.add('err'); ok=false; }
  if (!uname)  { showFieldErr('su-user-err','Please choose a username.'); document.getElementById('su-user').classList.add('err'); ok=false; }
  else if (uname.length < 3) { showFieldErr('su-user-err','Username must be at least 3 characters.'); document.getElementById('su-user').classList.add('err'); ok=false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldErr('su-email-err','Please enter a valid email address.'); document.getElementById('su-email').classList.add('err'); ok=false; }
  if (pass.length < 8) { showFieldErr('su-pass-err','Password must be at least 8 characters.'); document.getElementById('su-pass').classList.add('err'); ok=false; }
  else if (pwdScore(pass) < 2) { showFieldErr('su-pass-err','Please choose a stronger password.'); document.getElementById('su-pass').classList.add('err'); ok=false; }
  if (pass !== confirm) { showFieldErr('su-confirm-err','Passwords do not match.'); document.getElementById('su-confirm').classList.add('err'); ok=false; }
  if (!ok) return;

  const btn = document.getElementById('su-btn');
  btn.textContent = 'Creating account…'; btn.disabled = true;

  try {
    const users = getUsers();
    const key   = uname.toLowerCase();
    if (users[key]) {
      showFieldErr('su-user-err','Username already taken — try another.');
      document.getElementById('su-user').classList.add('err');
      btn.textContent = 'Create account →'; btn.disabled = false; return;
    }
    // check email uniqueness
    const emailTaken = Object.values(users).some(u => u.email === email.toLowerCase());
    if (emailTaken) {
      showFieldErr('su-email-err','An account with this email already exists.');
      document.getElementById('su-email').classList.add('err');
      btn.textContent = 'Create account →'; btn.disabled = false; return;
    }

    const h = await hashPwd(pass);
    users[key] = { username:key, displayName:name, email:email.toLowerCase(), hash:h, created:Date.now() };
    saveUsers(users);

    S.user = { username:key, displayName:name, email:email.toLowerCase() };
    setSession(S.user);
    S.profiles = [];

    // clear fields
    ['su-name','su-user','su-email','su-pass','su-confirm'].forEach(id => {
      const el = document.getElementById(id); if(el) el.value='';
    });
    liveStrength('');
    btn.textContent = 'Create account →'; btn.disabled = false;
    updateNav();
    toast('Account created! Welcome, ' + name + '.');
    if (S.pendingType) openModal();
    else goto('dashboard');
  } catch(e) {
    showBoxErr('su-error','Something went wrong. Please try again.');
    btn.textContent = 'Create account →'; btn.disabled = false;
  }
}

/* ══════════════════════════════════════
   PASSWORD VISIBILITY TOGGLE
══════════════════════════════════════ */
function togglePwd(inputId, iconId) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const showing = inp.type === 'text';
  inp.type = showing ? 'password' : 'text';
  const icon = document.getElementById(iconId);
  if (icon) {
    icon.innerHTML = showing
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  }
}

/* ══════════════════════════════════════
   LOGOUT
══════════════════════════════════════ */
function doLogout() {
  clearSession();
  S.user = null; S.profiles = []; S.activeP = null;
  updateNav();
  goto('home');
  toast('You\'ve been logged out.','ok');
}

/* ══════════════════════════════════════
   HOME
══════════════════════════════════════ */
function homeStart(type) {
  S.pendingType = type;
  if (!S.user) { showAuth('signup'); return; }
  openModal();
}

function buildWaveform() {
  const el = document.getElementById('waveform');
  if (!el || el.children.length > 0) return;
  for (let i=0; i<36; i++) {
    const b = document.createElement('div');
    b.className = 'wb';
    const h = 5 + Math.abs(Math.sin(i*0.45))*38 + Math.random()*14;
    b.style.setProperty('--h', h+'px');
    b.style.setProperty('--d', (0.5+Math.random()*0.9).toFixed(2)+'s');
    b.style.setProperty('--dl',(i*0.035).toFixed(2)+'s');
    el.appendChild(b);
  }
}

/* ══════════════════════════════════════
   MODAL — NEW PROFILE
══════════════════════════════════════ */
let _mType = null;

function openModal() {
  _mType = S.pendingType || null;
  document.getElementById('modal').classList.add('open');
  document.getElementById('modal-name-wrap').style.display = 'none';
  document.getElementById('modal-confirm').style.display   = 'none';
  document.getElementById('modal-name').value = '';
  document.getElementById('modal-name-err').style.display  = 'none';
  document.querySelectorAll('.type-tile').forEach(t=>t.classList.remove('sel-alive','sel-deceased'));
  if (_mType) _preselectType(_mType);
}

function _preselectType(type) {
  document.getElementById(type==='alive'?'tile-alive':'tile-deceased').classList.add('sel-'+type);
  _showModalName(type);
}

function selectType(type) {
  _mType = type;
  document.querySelectorAll('.type-tile').forEach(t=>t.classList.remove('sel-alive','sel-deceased'));
  document.getElementById(type==='alive'?'tile-alive':'tile-deceased').classList.add('sel-'+type);
  _showModalName(type);
}

function _showModalName(type) {
  document.getElementById('modal-name-wrap').style.display = '';
  document.getElementById('modal-confirm').style.display   = 'flex';
  document.getElementById('modal-name-label').textContent  = type==='alive' ? 'Your name' : 'Their name';
  document.getElementById('modal-name').placeholder = type==='alive' ? 'Your full name...' : 'Full name of the person...';
  setTimeout(()=>document.getElementById('modal-name').focus(), 80);
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  S.pendingType = null; _mType = null;
}

function confirmCreate() {
  const name = document.getElementById('modal-name').value.trim();
  const errEl = document.getElementById('modal-name-err');
  if (!name) { errEl.textContent='Please enter a name.'; errEl.style.display='block'; return; }
  errEl.style.display='none';
  const p = { id:'p_'+Date.now(), type:_mType, name, created:Date.now(), answers:{} };
  S.profiles.push(p);
  saveProfiles();
  closeModal(); S.pendingType=null;
  S.activeP = S.profiles.length-1;
  _currentCatId = null;
  goto('questionnaire');
  toast(name+'\'s profile created!');
}

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
function renderDash() {
  document.getElementById('dash-greeting').textContent = 'Welcome back, '+S.user.displayName;
  const alive=S.profiles.filter(p=>p.type==='alive').length;
  const dec=S.profiles.filter(p=>p.type==='deceased').length;
  const parts=[];
  if(alive) parts.push(alive+' living profile'+(alive>1?'s':''));
  if(dec)   parts.push(dec+' in memoriam');
  document.getElementById('dash-sub').textContent = parts.join(' · ') || 'No profiles yet — create your first one.';

  const grid = document.getElementById('profile-grid');
  if (!S.profiles.length) {
    grid.innerHTML=`<div class="empty-state"><div class="empty-icon">◌</div><p>Click <strong>+ New profile</strong> to begin.</p></div>`;
    return;
  }
  grid.innerHTML = S.profiles.map((p,i)=>{
    const cats=p.type==='alive'?CATS_ALIVE:CATS_DECEASED;
    const tot=cats.reduce((a,c)=>a+c.questions.length,0);
    const ans=cats.reduce((a,c)=>a+c.questions.filter(q=>isAns(p.answers[q.id])).length,0);
    const pct=Math.round(ans/tot*100);
    const icon=p.type==='alive'?'✦':'◆';
    return `<div class="pcard ${p.type}" role="listitem" tabindex="0"
        onclick="openProfile(${i})" onkeydown="if(event.key==='Enter')openProfile(${i})">
      <span class="pcard-icon ${p.type==='alive'?'alive-col':'mem-col'}">${icon}</span>
      <div class="pcard-name">${esc(p.name)}</div>
      <div class="pcard-type">${p.type==='alive'?'Living Profile':'In Memoriam'}</div>
      <div class="pbar-track"><div class="pbar-fill" style="width:${pct}%"></div></div>
      <div class="pcard-stats">${ans} of ${tot} answered · ${pct}%</div>
      <div class="pcard-actions">
        <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();S.activeP=${i};goto('profile')">View</button>
        <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();openProfile(${i})">Edit</button>
        <button class="btn btn-danger btn-xs" onclick="event.stopPropagation();delProfile(${i})">Delete</button>
      </div>
    </div>`;
  }).join('');
}

function openProfile(i) { S.activeP=i; _currentCatId=null; goto('questionnaire'); }
function delProfile(i) {
  if(!confirm('Delete "'+S.profiles[i].name+'"? This cannot be undone.')) return;
  S.profiles.splice(i,1); saveProfiles(); renderDash();
  toast('Profile deleted.','bad');
}

/* ══════════════════════════════════════
   QUESTIONNAIRE
══════════════════════════════════════ */
function isAns(v) {
  if (v===undefined||v===null||v==='') return false;
  if (Array.isArray(v)) return v.length>0;
  return true;
}

function renderQ() {
  const p = S.profiles[S.activeP];
  if (!p) { goto('dashboard'); return; }
  const cats = p.type==='alive'?CATS_ALIVE:CATS_DECEASED;
  if (!_currentCatId||!cats.find(c=>c.id===_currentCatId)) _currentCatId=cats[0].id;
  _renderSidebar(p, cats);
  _renderCatQs(p, cats);
}

function _renderSidebar(p, cats) {
  const sb = document.getElementById('q-sidebar');
  sb.innerHTML = `
    <div class="sb-profile">
      <div class="sb-name">${esc(p.name)}</div>
      <div class="sb-type ${p.type}">${p.type==='alive'?'✦ Living Profile':'◆ In Memoriam'}</div>
    </div>
    ${cats.map(c=>{
      const a=c.questions.filter(q=>isAns(p.answers[q.id])).length;
      const t=c.questions.length;
      const done=a===t;
      return `<button class="sb-cat${c.id===_currentCatId?' on':''}" onclick="switchCat('${c.id}')">
        <span class="sb-cat-icon">${c.icon}</span>
        <span class="sb-cat-name">${esc(c.title)}</span>
        <span class="sb-cat-count${done?' done':''}">${done?'✓':a+'/'+t}</span>
      </button>`;
    }).join('')}
    <div class="sb-spacer"></div>
    <div class="sb-foot">
      <button class="btn btn-ghost btn-sm" onclick="S.activeP&&(goto('profile'))" style="width:100%">View profile</button>
      <button class="btn btn-ghost btn-sm" onclick="goto('dashboard')" style="width:100%">← Dashboard</button>
    </div>`;
}

function _renderCatQs(p, cats) {
  const cat = cats.find(c=>c.id===_currentCatId);
  const sel = 'on-'+p.type;
  let html = `<div class="q-cat-header">
    <span class="q-cat-icon">${cat.icon}</span>
    <div class="q-cat-title">${esc(cat.title)}</div>
    <div class="q-cat-desc">${esc(cat.desc)}</div>
  </div>`;

  cat.questions.forEach((q,qi)=>{
    html+=`<div class="q-item"><div class="q-num">${esc(cat.title)} · ${qi+1} of ${cat.questions.length}</div>
      <div class="q-text">${esc(q.text)}</div>
      ${_inputHtml(q, p.answers[q.id], sel, p.type)}</div>`;
  });

  const cats2=cats;
  const idx=cats2.findIndex(c=>c.id===_currentCatId);
  const isLast=idx===cats2.length-1;
  html+=`<div class="q-save-bar">
    <button class="btn btn-primary" onclick="saveAndContinue(${isLast})" style="flex:1;padding:11px">
      ${isLast?'Save & finish':'Save & continue →'}
    </button>
    <button class="btn btn-ghost" onclick="saveOnly()">Save</button>
  </div>`;

  document.getElementById('q-main').innerHTML = html;
  window.scrollTo(0,0);
}

function _inputHtml(q, val, sel, pType) {
  if (q.type==='text') return `<input type="text" class="form-input" data-qid="${q.id}" value="${esc(val||'')}" placeholder="${esc(q.ph||'')}" oninput="liveUpd('${q.id}',this.value)">`;
  if (q.type==='ta')   return `<textarea class="form-input" data-qid="${q.id}" rows="4" placeholder="${esc(q.ph||'')}" oninput="liveUpd('${q.id}',this.value)">${esc(val||'')}</textarea>`;
  if (q.type==='sc') {
    const v=(val!==undefined&&val!==null)?Number(val):5;
    const cls=pType==='deceased'?'mem-range':'';
    return `<div class="sl-wrap">
      <div class="sl-labels"><span>${esc(q.labels[0])}</span><span>${esc(q.labels[1])}</span></div>
      <input type="range" class="${cls}" min="1" max="10" step="1" value="${v}" data-qid="${q.id}"
        oninput="liveUpd('${q.id}',parseInt(this.value));document.getElementById('sv_${q.id}').textContent=this.value">
      <div class="sl-val"><span id="sv_${q.id}">${v}</span> <span>/ 10</span></div></div>`;
  }
  if (q.type==='ch') {
    return `<div class="choices">${q.opts.map(o=>`
      <button class="choice${val===o?' '+sel:''}" onclick="selChoice('${q.id}',${JSON.stringify(o)},this,'${sel}')">
        <span class="choice-dot"></span>${esc(o)}
      </button>`).join('')}</div>`;
  }
  if (q.type==='ms') {
    const s=Array.isArray(val)?val:[];
    const chipSel=pType+'-chip';
    return `<div class="chips">${q.opts.map(o=>`
      <button class="chip${s.includes(o)?' on-'+pType:''}" onclick="togChip('${q.id}',${JSON.stringify(o)},this,'${pType}')">
        ${esc(o)}
      </button>`).join('')}</div>`;
  }
  return '';
}

function liveUpd(qid, v) { const p=S.profiles[S.activeP]; if(p) p.answers[qid]=v; }

function selChoice(qid, val, el, sel) {
  const p=S.profiles[S.activeP]; if(!p) return;
  p.answers[qid]=val;
  el.closest('.choices').querySelectorAll('.choice').forEach(b=>b.className='choice');
  el.classList.add(sel);
}

function togChip(qid, val, el, pType) {
  const p=S.profiles[S.activeP]; if(!p) return;
  let cur=Array.isArray(p.answers[qid])?[...p.answers[qid]]:[];
  const cls='on-'+pType;
  if(cur.includes(val)){cur=cur.filter(x=>x!==val);el.classList.remove(cls);}
  else{cur.push(val);el.classList.add(cls);}
  p.answers[qid]=cur;
}

function switchCat(id) { _currentCatId=id; renderQ(); }

function saveOnly() { saveProfiles(); toast('Saved ✓'); const p=S.profiles[S.activeP]; if(p) _renderSidebar(p,p.type==='alive'?CATS_ALIVE:CATS_DECEASED); }

function saveAndContinue(isLast) {
  saveProfiles();
  const p=S.profiles[S.activeP];
  const cats=p.type==='alive'?CATS_ALIVE:CATS_DECEASED;
  if(isLast){toast('Profile complete!'); goto('dashboard');}
  else {
    const idx=cats.findIndex(c=>c.id===_currentCatId);
    _currentCatId=cats[idx+1].id;
    renderQ();
    toast('Saved ✓');
  }
}

/* ══════════════════════════════════════
   PROFILE VIEW
══════════════════════════════════════ */
function renderPV() {
  const p=S.profiles[S.activeP];
  if(!p){goto('dashboard');return;}
  const cats=p.type==='alive'?CATS_ALIVE:CATS_DECEASED;
  const tot=cats.reduce((a,c)=>a+c.questions.length,0);
  const ans=cats.reduce((a,c)=>a+c.questions.filter(q=>isAns(p.answers[q.id])).length,0);
  const pct=Math.round(ans/tot*100);

  const secs=cats.map(cat=>{
    const qs=cat.questions.filter(q=>isAns(p.answers[q.id]));
    if(!qs.length) return '';
    return `<div class="pv-section">
      <div class="pv-sec-title">${cat.icon} ${esc(cat.title)}</div>
      ${qs.map(q=>{
        const v=p.answers[q.id];
        const d=Array.isArray(v)?v.join(' · '):(typeof v==='number'?v+' / 10':String(v));
        return `<div class="pv-qa"><div class="pv-q">${esc(q.text)}</div><div class="pv-a">${esc(d)}</div></div>`;
      }).join('')}
    </div>`;
  }).join('');

  document.getElementById('pv-inner').innerHTML=`
    <div class="pv-header">
      <div>
        <div class="pv-title">${p.type==='alive'?'✦':'◆'} ${esc(p.name)}</div>
        <div class="pv-badge ${p.type}">${p.type==='alive'?'Living Profile':'In Memoriam'}</div>
        <div class="pv-pct">${ans} of ${tot} answered (${pct}%)</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start">
        <button class="btn btn-ghost" onclick="openProfile(${S.activeP})">Edit</button>
        <button class="btn btn-primary" onclick="exportP(${S.activeP})">Export JSON</button>
        <button class="btn btn-ghost" onclick="goto('dashboard')">← Back</button>
      </div>
    </div>
    ${secs||'<p style="color:var(--w50);font-size:15px">No answers yet — edit the profile to begin.</p>'}`;
}

function exportP(i) {
  const p=S.profiles[i];
  const cats=p.type==='alive'?CATS_ALIVE:CATS_DECEASED;
  const data={name:p.name,type:p.type,exportedAt:new Date().toISOString(),
    profile:cats.map(c=>({category:c.title,questions:c.questions.map(q=>({question:q.text,answer:p.answers[q.id]??null}))}))};
  try{
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    a.download='echo_'+p.name.toLowerCase().replace(/\s+/g,'_')+'.json';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    toast('Exported!');
  }catch{toast('Export failed.','bad');}
}

/* ══════════════════════════════════════
   BOOT
══════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  // Restore session
  const session = getSession();
  if (session) {
    S.user = session;
    S.profiles = getProfiles();
    updateNav();
  }

  // Hide loading after animation
  setTimeout(() => {
    document.getElementById('loading').classList.add('out');
    document.getElementById('main-nav').classList.add('show');
    buildWaveform();
    if (!document.querySelector('.view.active')) goto('home');
  }, 2300);
});
