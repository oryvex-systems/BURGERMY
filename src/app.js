import { supabase } from './supabase.js';

const products=[
{name:'Classic Burger Menü',desc:'120 g dana köfte, cheddar, turşu, özel sos, patates ve içecek',price:245},
{name:'Cheeseburger Menü',desc:'Dana köfte, çift cheddar, turşu, özel sos, patates ve içecek',price:265},
{name:'BBQ Burger Menü',desc:'Dana köfte, cheddar, BBQ sos, çıtır soğan, patates ve içecek',price:285},
{name:'Hot Burger Menü',desc:'Dana köfte, cheddar, jalapeño, acı sos, patates ve içecek',price:285},
{name:'Double Cheeseburger',desc:'2×120 g dana köfte, çift cheddar, özel sos, patates ve içecek',price:335},
{name:'Crispy Chicken Menü',desc:'Çıtır tavuk, marul, turşu, özel sos, patates ve içecek',price:255}
];
let cart=JSON.parse(localStorage.getItem('burgermy-cart')||'[]');
let session=null;
let authMode='signin';
const money=v=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(v);
const saveCart=()=>localStorage.setItem('burgermy-cart',JSON.stringify(cart));

async function boot(){
  const {data}=await supabase.auth.getSession();
  session=data.session;
  if(session) render(); else renderAuth();
  supabase.auth.onAuthStateChange((_event,next)=>{session=next;if(session)render();});
}

function renderAuth(message=''){
  const signup=authMode==='signup';
  document.querySelector('#app').innerHTML=`
  <main class="auth-wrap">
    <section class="auth-brand"><div class="brand big"><span>BURGER</span><b>MY</b></div><small>PAKET FAST-FOOD</small></section>
    <section class="auth-card">
      <span class="auth-step">1 / 3 · ${signup?'KAYIT':'GİRİŞ'}</span>
      <h1>${signup?'Hesabını oluştur.':'Lezzete bir adım kaldı.'}</h1>
      <p>${signup?'Kayıt onayını e-posta adresine göndereceğiz.':'E-posta adresinle giriş yap veya Google hesabını kullan.'}</p>
      ${message?`<div class="auth-message">${message}</div>`:''}
      <label>E-posta<input id="email" type="email" autocomplete="email" placeholder="ornek@mail.com"></label>
      <label>Şifre<input id="password" type="password" autocomplete="${signup?'new-password':'current-password'}" placeholder="En az 6 karakter"></label>
      <button class="auth-primary" id="emailSubmit">${signup?'Hesap Oluştur':'Giriş Yap'} →</button>
      <div class="auth-divider"><span>veya</span></div>
      <button class="google-btn" id="googleBtn"><span class="google-g">G</span> Google ile devam et</button>
      <button class="auth-switch" id="modeBtn">${signup?'Zaten hesabım var · Giriş yap':'Yeni misin? Hesap oluştur'}</button>
      <p class="auth-legal">Devam ederek <a href="/terms/">kullanım koşullarını</a> ve <a href="/privacy/">gizlilik politikasını</a> kabul etmiş olursun.</p>
    </section>
    <p class="auth-foot">Sıcak hazırlanır · Güvenle paketlenir · Hızla ulaşır</p>
  </main>`;
  document.getElementById('modeBtn').onclick=()=>{authMode=signup?'signin':'signup';renderAuth()};
  document.getElementById('emailSubmit').onclick=handleEmailAuth;
  document.getElementById('googleBtn').onclick=handleGoogle;
}

async function handleEmailAuth(){
  const email=document.getElementById('email').value.trim();
  const password=document.getElementById('password').value;
  if(!email||password.length<6){renderAuth('E-posta adresini ve en az 6 karakterlik şifreni gir.');return;}
  if(authMode==='signup'){
    const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+'/'}});
    if(error){renderAuth(error.message);return;}
    if(!data.session){authMode='signin';renderAuth('Onay bağlantısını e-posta adresine gönderdik. E-postanı onayladıktan sonra giriş yapabilirsin.');return;}
  }else{
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){renderAuth(error.message);return;}
  }
}

async function handleGoogle(){
  const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/'}});
  if(error) renderAuth(error.message);
}

function render(){
  const total=cart.reduce((s,x)=>s+x.price,0);
  document.querySelector('#app').innerHTML=`
<header><div class="brand"><span>BURGER</span><b>MY</b></div><div class="head-actions"><button class="userbtn" id="profileBtn">${session?.user?.email?.split('@')[0]||'Hesabım'}</button><button class="cart" id="cartBtn">Sepet ${cart.length?`(${cart.length})`:''}</button></div></header>
<main><section class="hero"><div><small>BURGERMY · PAKET FAST-FOOD</small><h1>Canın burger istediyse,<br><em>mesele kapanmıştır.</em></h1><p>Taze hazırlanır, sıcak teslim edilir. Kurye veya Gel-Al seçenekleriyle.</p><a href="#menu">Menüyü Gör</a></div></section>
<section id="menu"><div class="title"><small>MENÜ</small><h2>Ne yiyoruz?</h2></div><div class="grid">${products.map((p,i)=>`<article><div class="photo">🍔</div><h3>${p.name}</h3><p>${p.desc}</p><div><strong>${money(p.price)}</strong><button data-add="${i}">+</button></div></article>`).join('')}</div></section>
</main>
<nav><button>Ana Sayfa</button><button>Menü</button><button id="bottomCart">Sepet</button><button id="bottomProfile">Hesabım</button></nav>
${cart.length?`<button class="floating" id="floating">Sepeti Gör · ${money(total)}</button>`:''}`;
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{cart.push(products[+b.dataset.add]);saveCart();render()});
  ['cartBtn','bottomCart','floating'].forEach(id=>{const el=document.getElementById(id);if(el)el.onclick=showCart});
  ['profileBtn','bottomProfile'].forEach(id=>{const el=document.getElementById(id);if(el)el.onclick=showProfile});
}

function showCart(){
  const total=cart.reduce((s,x)=>s+x.price,0);
  document.querySelector('#app').innerHTML=`<main class="cartpage"><button id="back">← Menüye dön</button><h1>Sepetim</h1>${cart.map((x,i)=>`<div class="line"><div><b>${x.name}</b><small>${money(x.price)}</small></div><button data-del="${i}">Sil</button></div>`).join('')||'<p>Sepetin boş.</p>'}<div class="summary"><span>Toplam</span><strong>${money(total)}</strong></div><button class="checkout" ${cart.length?'':'disabled'}>Ödemeye Devam Et</button><p class="note">Online ödeme PayTR entegrasyonu üzerinden yürütülecek.</p></main>`;
  document.getElementById('back').onclick=render;
  document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.del,1);saveCart();showCart()});
}

function showProfile(){
  document.querySelector('#app').innerHTML=`<main class="cartpage"><button id="back">← Ana sayfa</button><h1>Hesabım</h1><div class="profile-card"><small>E-posta</small><b>${session?.user?.email||''}</b><p>Telefon numarası giriş için kullanılmaz; teslimat iletişim bilgisi olarak profil/adres bölümünde tutulacaktır.</p><button class="logout" id="logout">Çıkış Yap</button></div></main>`;
  document.getElementById('back').onclick=render;
  document.getElementById('logout').onclick=async()=>{await supabase.auth.signOut();session=null;renderAuth()};
}

boot();