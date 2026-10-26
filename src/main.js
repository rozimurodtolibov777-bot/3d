import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb9b6a4);
scene.fog = new THREE.FogExp2(0xc4bda8, 0.012);
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.08, 240);
camera.rotation.order = 'YXZ';
camera.position.set(0, 1.72, 8);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const hemi = new THREE.HemisphereLight(0xe4e6d5, 0x66543d, 2.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffe4b1, 3.1); sun.position.set(-28, 42, 22); sun.castShadow = true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-48; sun.shadow.camera.right=48; sun.shadow.camera.top=48; sun.shadow.camera.bottom=-48; sun.shadow.bias=-0.0003; scene.add(sun);
const fill = new THREE.DirectionalLight(0x9cbac6, 0.75); fill.position.set(20,12,-20); scene.add(fill);

function noiseTexture(base, flecks=1300, size=512, contrast=28) {
  const c=document.createElement('canvas'); c.width=c.height=size; const x=c.getContext('2d');
  x.fillStyle=base; x.fillRect(0,0,size,size);
  for(let i=0;i<flecks;i++){const v=Math.floor(Math.random()*contrast); x.fillStyle=`rgba(${v>contrast/2?255:0},${v>contrast/2?255:0},${v>contrast/2?255:0},${Math.random()*.11})`;const s=Math.random()*3+0.5;x.fillRect(Math.random()*size,Math.random()*size,s,s);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;
}
const sandTex=noiseTexture('#a99a79',2200,512,35); sandTex.repeat.set(12,12);
const concreteTex=noiseTexture('#77786e',900,256,22); concreteTex.repeat.set(2,2);
const groundMat=new THREE.MeshStandardMaterial({map:sandTex,roughness:1});
const concreteMat=new THREE.MeshStandardMaterial({map:concreteTex,roughness:.93});
const sandMat=new THREE.MeshStandardMaterial({color:0xb6a47e,roughness:1});
const darkMetal=new THREE.MeshStandardMaterial({color:0x252c2a,metalness:.72,roughness:.36});
const olive=new THREE.MeshStandardMaterial({color:0x62684f,roughness:.88});
const wallMat=new THREE.MeshStandardMaterial({color:0x958c75,roughness:.95});
const accentMat=new THREE.MeshStandardMaterial({color:0xd7f35a,roughness:.65});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(240,240),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.05;ground.receiveShadow=true;scene.add(ground);

function box(w,h,d,mat,x,y,z,shadow=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m;}
function cylinder(rt,rb,h,mat,x,y,z,seg=8){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
function makeBuilding(x,z,w,h,d){
  box(w,h,d,wallMat,x,h/2,z);
  box(w+0.35,.24,d+0.35,concreteMat,x,h+.12,z);
  const doorW=1.1, doorH=2.15;
  box(doorW,doorH,.08,new THREE.MeshStandardMaterial({color:0x393b32}),x-w*.15,doorH/2,z+d/2+.045,false);
  for(let i=0;i<Math.floor(w/1.8);i++){
    const wx=x-w/2+1+i*1.8;
    if(Math.abs(wx-(x-w*.15))<1.2)continue;
    box(.7,.52,.1,darkMetal,wx,h*.65,z+d/2+.06,false);
    box(.8,.08,.12,concreteMat,wx,h*.65-.3,z+d/2+.08,false);
  }
  // rooftop parapet and vent
  box(w,.32,.2,concreteMat,x,h+.27,z-d/2);
  box(.7,.8,.7,darkMetal,x+w*.23,h+.5,z-.15);
}
makeBuilding(-12,-15,12,5.3,8); makeBuilding(10,-20,10,6.3,9); makeBuilding(24,-7,8,4.5,7);
makeBuilding(-28,-3,9,4.2,8); makeBuilding(1,-36,14,5.5,8);
box(44,2,1.1,wallMat,0,1,-7);box(1.1,2,27,wallMat,-22,1,-20);box(1.1,2,27,wallMat,22,1,-20);
box(9,.4,2,concreteMat,-7,.2,5);box(8,.4,2,concreteMat,10,.2,-1);
for(let i=0;i<18;i++){
  const x=-35+Math.random()*70,z=-39+Math.random()*-9;
  const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.6+Math.random()*1.4,0),new THREE.MeshStandardMaterial({color:[0x827b67,0x93876e,0x6f6c5d][i%3],roughness:1}));
  rock.position.set(x,.25,z);rock.scale.y=.4+Math.random()*.5;rock.rotation.set(Math.random(),Math.random(),Math.random());rock.castShadow=true;rock.receiveShadow=true;scene.add(rock);
}
function makeCrate(x,z,s=1){
  const crateMat=new THREE.MeshStandardMaterial({color:0x5d634d,roughness:.9});
  box(1.25*s,1.2*s,1.25*s,crateMat,x,.6*s,z);
  for(let i=-1;i<=1;i++){box(.09*s,1.22*s,.06*s,darkMetal,x+i*.42*s,.6*s,z+.64*s,false);box(1.25*s,.08*s,.07*s,darkMetal,x,.6*s+i*.4*s,z+.65*s,false);}
}
makeCrate(-5,2);makeCrate(-3,2);makeCrate(13,3,1.2);makeCrate(15,3,1.2);
function makeBarrel(x,z){const b=cylinder(.38,.38,.95,new THREE.MeshStandardMaterial({color:0x6e755e,metalness:.25,roughness:.7}),x,.48,z,12);for(let y of [.2,.7]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.38,.035,5,12),darkMetal);ring.rotation.x=Math.PI/2;ring.position.set(x,y,z);scene.add(ring)}}
makeBarrel(-10,-1);makeBarrel(-9,-1.8);makeBarrel(18,-5);makeBarrel(20,-5);
function makeSandbagWall(x,z,count=5,rot=0){
  const bagMat=new THREE.MeshStandardMaterial({color:0x9d9274,roughness:1});
  for(let row=0;row<2;row++)for(let i=0;i<count;i++){
    const b=new THREE.Mesh(new THREE.BoxGeometry(1.05,.42,.5),bagMat);b.position.set(x+(i-(count-1)/2)*.92,.22+row*.39,z+(row%2)*.08);b.rotation.y=rot;b.castShadow=true;b.receiveShadow=true;scene.add(b);
  }
}
makeSandbagWall(0,-1,7);makeSandbagWall(-17,-9,5,.1);makeSandbagWall(17,-12,5,-.1);

// Distant desert ridgeline
for(let i=0;i<24;i++){
  const m=new THREE.Mesh(new THREE.ConeGeometry(8+Math.random()*11,12+Math.random()*20,5),new THREE.MeshStandardMaterial({color:[0x938a74,0xa49a80,0x8b826d][i%3],roughness:1}));
  m.position.set(-95+i*8,-1,-70-Math.random()*30);m.rotation.y=Math.random()*2;m.receiveShadow=true;scene.add(m);
}
// A utilitarian pole and antenna
cylinder(.09,.12,9,darkMetal,-20,4.5,-30,8);for(let y of [7,8])box(1.5,.06,.06,darkMetal,-20,y,-30,false);cylinder(.05,.05,2,accentMat,-20,9,-30,8);

const obstacles=[
 {x:-12,z:-15,w:12,d:8},{x:10,z:-20,w:10,d:9},{x:24,z:-7,w:8,d:7},{x:-28,z:-3,w:9,d:8},{x:1,z:-36,w:14,d:8},
 {x:0,z:-7,w:44,d:1.1},{x:-22,z:-20,w:1.1,d:27},{x:22,z:-20,w:1.1,d:27}
];

const gun=new THREE.Group();camera.add(gun);scene.add(camera);
const gunMat=new THREE.MeshStandardMaterial({color:0x222927,metalness:.8,roughness:.34});
const gunBody=new THREE.Mesh(new THREE.BoxGeometry(.22,.19,.72),gunMat);gunBody.position.set(.31,-.25,-.56);gun.add(gunBody);
const receiver=new THREE.Mesh(new THREE.BoxGeometry(.25,.14,.31),darkMetal);receiver.position.set(.3,-.19,-.36);gun.add(receiver);
const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.56,10),gunMat);barrel.rotation.x=Math.PI/2;barrel.position.set(.31,-.19,-.98);gun.add(barrel);
const handguard=new THREE.Mesh(new THREE.BoxGeometry(.16,.14,.36),olive);handguard.position.set(.31,-.2,-.76);gun.add(handguard);
const stock=new THREE.Mesh(new THREE.BoxGeometry(.15,.15,.27),olive);stock.position.set(.31,-.26,-.23);gun.add(stock);
const sight=new THREE.Mesh(new THREE.BoxGeometry(.05,.08,.08),darkMetal);sight.position.set(.31,-.085,-.62);gun.add(sight);
const mag=new THREE.Mesh(new THREE.BoxGeometry(.12,.25,.15),darkMetal);mag.position.set(.31,-.39,-.48);mag.rotation.x=-.15;gun.add(mag);
const muzzleFlash=new THREE.PointLight(0xffbd66,0,4);muzzleFlash.position.set(.31,-.19,-1.2);gun.add(muzzleFlash);
const flashMesh=new THREE.Mesh(new THREE.ConeGeometry(.12,.38,8),new THREE.MeshBasicMaterial({color:0xffd078,transparent:true,opacity:.9}));flashMesh.rotation.x=-Math.PI/2;flashMesh.position.set(.31,-.19,-1.2);flashMesh.visible=false;gun.add(flashMesh);

const enemies=[];const enemyPositions=[[-7,-11],[7,-12],[17,-24],[-18,-24],[2,-29]];
const enemyMat=new THREE.MeshStandardMaterial({color:0x515c4b,roughness:.88});
const vestMat=new THREE.MeshStandardMaterial({color:0x3b463d,roughness:.95});
const skinMat=new THREE.MeshStandardMaterial({color:0x9d8467,roughness:.9});
const deadMat=new THREE.MeshStandardMaterial({color:0x353b32,roughness:1});
function createEnemy(x,z,index){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const torso=new THREE.Mesh(new THREE.BoxGeometry(.55,.72,.3),vestMat);torso.position.y=1.15;torso.castShadow=true;g.add(torso);
 const chest=new THREE.Mesh(new THREE.BoxGeometry(.58,.23,.32),enemyMat);chest.position.y=1.33;g.add(chest);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.19,12,10),skinMat);head.position.y=1.72;head.castShadow=true;g.add(head);
 const helmet=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8,0,Math.PI*2,0,Math.PI*.55),olive);helmet.position.y=1.79;g.add(helmet);
 const legs=[];
 for(let s of [-1,1]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.2,.58,.22),deadMat);leg.position.set(s*.16,.48,0);leg.castShadow=true;g.add(leg);legs.push(leg);
 const arm=new THREE.Mesh(new THREE.BoxGeometry(.16,.55,.17),enemyMat);arm.position.set(s*.36,1.15,-.03);arm.rotation.z=s*.14;g.add(arm);}
 const rifle=new THREE.Mesh(new THREE.BoxGeometry(.09,.09,.62),darkMetal);rifle.position.set(.12,1.12,-.35);rifle.rotation.x=-.1;g.add(rifle);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.42,16),new THREE.MeshBasicMaterial({color:0x1c211b,transparent:true,opacity:.28,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
 const e={group:g,alive:true,hp:100,index,legs,phase:Math.random()*5,baseX:x,baseZ:z,hitFlash:0};enemies.push(e);return e;
}
enemyPositions.forEach(([x,z],i)=>createEnemy(x,z,i));

const state={started:false,paused:true,health:100,ammo:30,reserve:120,kills:0,shots:0,hits:0,reloading:false,fireHeld:false,lastShot:0,walk:0,yaw:0,pitch:0,moveX:0,moveY:0,lookX:0,lookY:0};
const isMobile=()=>matchMedia('(pointer:coarse)').matches||innerWidth<760;
function updateHUD(){
 $('ammoText').textContent=state.ammo;$('healthText').textContent=String(Math.max(0,Math.ceil(state.health)));
 $('healthBar').style.width=Math.max(0,state.health)+'%';$('targetCount').textContent=`${String(state.kills).padStart(2,'0')} / ${String(enemies.length).padStart(2,'0')}`;
 $('progressBar').style.width=(state.kills/enemies.length*100)+'%';
}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1400)}
function resetGame(){
 state.health=100;state.ammo=30;state.reserve=120;state.kills=0;state.shots=0;state.hits=0;state.reloading=false;state.fireHeld=false;state.yaw=0;state.pitch=0;camera.position.set(0,1.72,8);camera.rotation.set(0,0,0);
 enemies.forEach((e,i)=>{e.alive=true;e.hp=100;e.group.visible=true;e.group.position.set(e.baseX,0,e.baseZ);e.group.rotation.set(0,0,0);e.group.children.forEach(c=>{if(c.material===deadMat)c.material=enemyMat;});});
 updateHUD();$('endScreen').classList.add('hidden');$('pauseScreen').classList.add('hidden');$('startScreen').classList.add('hidden');state.started=true;state.paused=false;
 if(!isMobile()&&canvas.requestPointerLock)canvas.requestPointerLock();toast('MISSIYA BOSHLANDI');
}
function pauseGame(){if(!state.started)return;state.paused=true;$('pauseScreen').classList.remove('hidden');if(document.pointerLockElement)document.exitPointerLock();}
function resumeGame(){state.paused=false;$('pauseScreen').classList.add('hidden');if(!isMobile()&&canvas.requestPointerLock)canvas.requestPointerLock();}
function finishGame(won){state.paused=true;$('endScreen').classList.remove('hidden');$('endTitle').textContent=won?'HUDUD TOZALANDI':'MISSIYA YAKUNLANDI';$('endDesc').textContent=won?'Barcha nishonlar zararsizlantirildi.':'Jangchi sog‘lig‘i tugadi. Qayta urinib ko‘ring.';$('finalKills').textContent=String(state.kills).padStart(2,'0');$('accuracy').textContent=(state.shots?Math.round(state.hits/state.shots*100):0)+'%';if(document.pointerLockElement)document.exitPointerLock();}
$('startBtn').addEventListener('click',resetGame);$('resumeBtn').addEventListener('click',resumeGame);$('restartBtn').addEventListener('click',resetGame);$('againBtn').addEventListener('click',resetGame);$('pauseBtn').addEventListener('click',()=>state.paused?resumeGame():pauseGame());

const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Escape'&&state.started&&!state.paused)pauseGame();if(e.code==='KeyR')reload();if(e.code==='Space')e.preventDefault();});
addEventListener('keyup',e=>keys[e.code]=false);
canvas.addEventListener('click',()=>{if(state.started&&!state.paused&&!isMobile()&&document.pointerLockElement!==canvas)canvas.requestPointerLock?.();});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&!state.paused){state.yaw-=e.movementX*.0022;state.pitch-=e.movementY*.0022;state.pitch=THREE.MathUtils.clamp(state.pitch,-1.25,1.25);}});
let touchLook=null;
canvas.addEventListener('touchstart',e=>{if(!state.started||state.paused)return;const t=e.changedTouches[0];if(t.clientX>innerWidth*.32)touchLook={id:t.identifier,x:t.clientX,y:t.clientY};},{passive:true});
canvas.addEventListener('touchmove',e=>{if(!touchLook||state.paused)return;for(const t of e.changedTouches){if(t.identifier===touchLook.id){state.yaw-=(t.clientX-touchLook.x)*.006;state.pitch-=(t.clientY-touchLook.y)*.005;state.pitch=THREE.MathUtils.clamp(state.pitch,-1.25,1.25);touchLook.x=t.clientX;touchLook.y=t.clientY;}}},{passive:true});
canvas.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===touchLook?.id)touchLook=null;},{passive:true});
canvas.addEventListener('mousedown',e=>{if(e.button===0&&state.started&&!state.paused&&!isMobile())state.fireHeld=true;});
addEventListener('mouseup',()=>state.fireHeld=false);
$('fireBtn').addEventListener('touchstart',e=>{e.preventDefault();state.fireHeld=true;},{passive:false});$('fireBtn').addEventListener('touchend',e=>{e.preventDefault();state.fireHeld=false;},{passive:false});$('fireBtn').addEventListener('touchcancel',()=>state.fireHeld=false);
$('reloadBtn').addEventListener('click',reload);$('mobileReload').addEventListener('click',reload);

let joyTouch=null;const joyZone=$('joystickZone'),joyKnob=$('joyKnob');
function joyUpdate(t){const r=joyZone.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=t.clientX-cx,dy=t.clientY-cy;const max=34,len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max;}joyKnob.style.transform=`translate(${dx}px,${dy}px)`;state.moveX=dx/max;state.moveY=dy/max;}
joyZone.addEventListener('touchstart',e=>{e.preventDefault();joyTouch=e.changedTouches[0].identifier;joyUpdate(e.changedTouches[0]);},{passive:false});
joyZone.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===joyTouch)joyUpdate(t);},{passive:false});
function joyEnd(e){for(const t of e.changedTouches)if(t.identifier===joyTouch){joyTouch=null;state.moveX=state.moveY=0;joyKnob.style.transform='translate(0,0)';}}
joyZone.addEventListener('touchend',joyEnd);joyZone.addEventListener('touchcancel',joyEnd);

function reload(){if(!state.started||state.paused||state.reloading||state.ammo===30||state.reserve<=0)return;state.reloading=true;toast('QAYTA O‘QLANMOQDA');setTimeout(()=>{const n=Math.min(30-state.ammo,state.reserve);state.ammo+=n;state.reserve-=n;state.reloading=false;updateHUD();},950);}
const raycaster=new THREE.Raycaster();let lastToastShot=0;
function fire(){
 const now=performance.now();if(now-state.lastShot<125||state.reloading)return;state.lastShot=now;
 if(state.ammo<=0){if(now-lastToastShot>900){toast('O‘Q QOLMADI — R BOSING');lastToastShot=now;}return;}
 state.ammo--;state.shots++;muzzleFlash.intensity=2.5;flashMesh.visible=true;gun.position.z=.055;gun.rotation.x=.025;setTimeout(()=>{muzzleFlash.intensity=0;flashMesh.visible=false;},55);
 const spread=.004+(state.walk?0.009:0);raycaster.setFromCamera(new THREE.Vector2((Math.random()-.5)*spread,(Math.random()-.5)*spread),camera);
 const targets=enemies.filter(e=>e.alive).map(e=>e.group);
 const hits=raycaster.intersectObjects(targets,true);
 if(hits.length){let obj=hits[0].object;let e=enemies.find(en=>{let p=obj;while(p){if(p===en.group)return true;p=p.parent;}return false;});
   if(e){state.hits++;e.hp-=50;e.hitFlash=.12;$('hitmarker').classList.add('show');setTimeout(()=>$('hitmarker').classList.remove('show'),100);if(e.hp<=0){e.alive=false;state.kills++;e.group.rotation.x=-Math.PI/2;e.group.position.y=.1;e.group.children.forEach(c=>{if(c.geometry.type==='BoxGeometry')c.material=deadMat;});if(state.kills===enemies.length)setTimeout(()=>finishGame(true),600);}}
 }
 updateHUD();
}
function updateEnemies(dt,time){
 for(const e of enemies){if(!e.alive)continue;e.phase+=dt;
   const dx=camera.position.x-e.group.position.x,dz=camera.position.z-e.group.position.z;
   e.group.rotation.y=Math.atan2(dx,dz);
   // Gentle tactical idle animation.
   e.group.position.x=e.baseX+Math.sin(e.phase*.55)*.14;
   if(e.hitFlash>0){e.hitFlash-=dt;e.group.children[0].material.color.setHex(0xd5c7a4);}else e.group.children[0].material.color.setHex(0x3b463d);
 }
}
function movePlayer(dt){
 let forward=0,strafe=0;
 if(keys.KeyW||keys.ArrowUp)forward+=1;if(keys.KeyS||keys.ArrowDown)forward-=1;
 if(keys.KeyD||keys.ArrowRight)strafe+=1;if(keys.KeyA||keys.ArrowLeft)strafe-=1;
 forward+=-state.moveY;strafe+=state.moveX;
 const len=Math.hypot(forward,strafe);if(len>1){forward/=len;strafe/=len;}
 const speed=(keys.ShiftLeft?7.3:4.8)*(isMobile()?1:1);
 const dx=(Math.sin(state.yaw)*forward+Math.cos(state.yaw)*strafe)*speed*dt;
 const dz=(-Math.cos(state.yaw)*forward+Math.sin(state.yaw)*strafe)*speed*dt;
 const nx=camera.position.x+dx,nz=camera.position.z+dz;
 let blocked=false;
 for(const o of obstacles){if(nx>o.x-o.w/2-.45&&nx<o.x+o.w/2+.45&&nz>o.z-o.d/2-.45&&nz<o.z+o.d/2+.45){blocked=true;break;}}
 if(!blocked){camera.position.x=THREE.MathUtils.clamp(nx,-40,40);camera.position.z=THREE.MathUtils.clamp(nz,-43,15);}
 state.walk=THREE.MathUtils.damp(state.walk,len>.1?1:0,8,dt);
 camera.position.y=1.72+Math.sin(performance.now()*.012)*.025*state.walk;
 camera.rotation.set(state.pitch,state.yaw,0);
 gun.position.y=-.025+Math.sin(performance.now()*.012)*.012*state.walk;
 gun.position.x=Math.sin(performance.now()*.006)*.009*state.walk;
 gun.position.z=THREE.MathUtils.damp(gun.position.z,0,18,dt);
 gun.rotation.x=THREE.MathUtils.damp(gun.rotation.x,0,16,dt);
}
let prev=performance.now();
function animate(now){
 requestAnimationFrame(animate);const dt=Math.min((now-prev)/1000,.05);prev=now;
 if(state.started&&!state.paused){movePlayer(dt);updateEnemies(dt,now);if(state.fireHeld)fire();}
 else {camera.rotation.set(state.pitch,state.yaw,0);gun.position.z=THREE.MathUtils.damp(gun.position.z,0,10,dt);}
 // Slight breathing movement while in the menu.
 if(!state.started){camera.position.x=Math.sin(now*.00012)*.22;camera.position.y=1.72+Math.sin(now*.00025)*.04;camera.lookAt(0,1.7,-12);}
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);});
updateHUD();
