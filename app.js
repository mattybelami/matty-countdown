(() => {
  const $ = id => document.getElementById(id);
  const display=$('timeDisplay'), progress=$('progress'), state=$('stateLabel');
  const status=$('statusText'), percent=$('percent'), message=$('message');
  const circumference=2*Math.PI*132;
  let total=600, remaining=600, running=false, deadline=0, interval=null, finished=false;
  let audioContext=null, wakeLock=null, deferredInstall=null;
  const fmt=s=>{s=Math.max(0,Math.ceil(s));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`};
  function render(){
    display.textContent=fmt(remaining);
    const ratio=total?remaining/total:0;
    progress.style.strokeDasharray=circumference;
    progress.style.strokeDashoffset=circumference*(1-ratio);
    percent.textContent=`${Math.round(ratio*100)}%`;
    state.textContent=finished?'TIME COMPLETE':running?'COUNTDOWN ACTIVE':remaining<total?'PAUSED':'SYSTEM READY';
    status.textContent=finished?'COUNTDOWN FINISHED':running?'TIME IS RUNNING':remaining<total?'TIMER PAUSED':'READY WHEN YOU ARE';
    document.title=`${fmt(remaining)} • Matty Countdown`;
    document.querySelector('.timer-card').classList.toggle('done',finished);
  }
  function readInputs(){
    const m=Number($('minutes').value),s=Number($('seconds').value);
    if(!Number.isInteger(m)||!Number.isInteger(s)||m<0||m>999||s<0||s>59||m*60+s<=0){message.textContent='Masukkan tempoh yang sah (sekurang-kurangnya 1 saat).';return false}
    total=m*60+s;remaining=total;finished=false;render();return true;
  }
  async function keepAwake(){
    try{if('wakeLock'in navigator)wakeLock=await navigator.wakeLock.request('screen')}catch(e){}
  }
  async function releaseAwake(){try{if(wakeLock){await wakeLock.release();wakeLock=null}}catch(e){}}
  function beep(){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      audioContext=audioContext||new AC();if(audioContext.state==='suspended')audioContext.resume();
      [0,0.24,0.48].forEach(t=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(.0001,audioContext.currentTime+t);g.gain.exponentialRampToValueAtTime(.18,audioContext.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+t+.2);o.connect(g);g.connect(audioContext.destination);o.start(audioContext.currentTime+t);o.stop(audioContext.currentTime+t+.22)});
    }catch(e){}
  }
  function stop(){running=false;if(interval){clearInterval(interval);interval=null}releaseAwake()}
  function tick(){
    remaining=Math.max(0,(deadline-Date.now())/1000);
    if(remaining<=0){remaining=0;stop();finished=true;message.textContent='⏰ Masa tamat!';render();beep();if('vibrate'in navigator)navigator.vibrate([250,100,250,100,500]);return}
    render();
  }
  $('startBtn').addEventListener('click',async()=>{
    if(running)return;
    if(finished||remaining<=0){if(!readInputs())return}
    else if(remaining===total){if(!readInputs())return}
    finished=false;running=true;deadline=Date.now()+remaining*1000;
    message.textContent='Countdown sedang berjalan.';await keepAwake();tick();if(running)interval=setInterval(tick,100);
  });
  $('pauseBtn').addEventListener('click',()=>{if(!running)return;tick();if(running){stop();message.textContent='Timer dijeda. Tekan START untuk sambung.'}});
  $('resetBtn').addEventListener('click',()=>{stop();finished=false;readInputs();message.textContent='Timer telah direset.'});
  document.querySelectorAll('[data-seconds]').forEach(btn=>btn.addEventListener('click',()=>{
    stop();finished=false;total=Number(btn.dataset.seconds);remaining=total;
    $('minutes').value=Math.floor(total/60);$('seconds').value=total%60;
    document.querySelectorAll('.presets button').forEach(b=>b.classList.toggle('selected',b===btn));
    message.textContent=`Preset ${fmt(total)} dipilih.`;render();
  }));
  ['minutes','seconds'].forEach(id=>$(id).addEventListener('change',()=>{if(running)return;document.querySelectorAll('.presets button').forEach(b=>b.classList.remove('selected'));finished=false;readInputs()}));
  $('fullscreenBtn').addEventListener('click',async()=>{
    try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){message.textContent='Full screen tidak disokong oleh browser ini.'}
  });
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&running){tick();keepAwake()}});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('installBtn').classList.remove('hidden')});
  $('installBtn').addEventListener('click',async()=>{
    if(!deferredInstall){message.textContent='Gunakan menu browser: Add to Home Screen.';return}
    deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('installBtn').classList.add('hidden');
  });
  if('serviceWorker'in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  render();
})();