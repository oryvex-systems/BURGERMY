const products=[
{name:'Classic Burger Menü',desc:'120 g dana köfte, cheddar, turşu, özel sos, patates ve içecek',price:245},
{name:'Cheeseburger Menü',desc:'Dana köfte, çift cheddar, turşu, özel sos, patates ve içecek',price:265},
{name:'BBQ Burger Menü',desc:'Dana köfte, cheddar, BBQ sos, çıtır soğan, patates ve içecek',price:285},
{name:'Hot Burger Menü',desc:'Dana köfte, cheddar, jalapeño, acı sos, patates ve içecek',price:285},
{name:'Double Cheeseburger',desc:'2×120 g dana köfte, çift cheddar, özel sos, patates ve içecek',price:335},
{name:'Crispy Chicken Menü',desc:'Çıtır tavuk, marul, turşu, özel sos, patates ve içecek',price:255}
];
let cart=[];
const money=v=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(v);
function render(){const total=cart.reduce((s,x)=>s+x.price,0);document.querySelector('#app').innerHTML=`
<header><div class="brand"><span>BURGER</span><b>MY</b></div><button class="cart" id="cartBtn">Sepet ${cart.length?`(${cart.length})`:''}</button></header>
<main><section class="hero"><div><small>BURGERMY · PAKET FAST-FOOD</small><h1>Canın burger istediyse,<br><em>mesele kapanmıştır.</em></h1><p>Taze hazırlanır, sıcak teslim edilir. Kurye veya Gel-Al seçenekleriyle.</p><a href="#menu">Menüyü Gör</a></div></section>
<section id="menu"><div class="title"><small>MENÜ</small><h2>Ne yiyoruz?</h2></div><div class="grid">${products.map((p,i)=>`<article><div class="photo">🍔</div><h3>${p.name}</h3><p>${p.desc}</p><div><strong>${money(p.price)}</strong><button data-add="${i}">+</button></div></article>`).join('')}</div></section>
</main>
<nav><button>Ana Sayfa</button><button>Menü</button><button id="bottomCart">Sepet</button><button>Hesabım</button></nav>
${cart.length?`<button class="floating" id="floating">Sepeti Gör · ${money(total)}</button>`:''}`;
document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{cart.push(products[+b.dataset.add]);render()});['cartBtn','bottomCart','floating'].forEach(id=>{const el=document.getElementById(id);if(el)el.onclick=showCart})}
function showCart(){const total=cart.reduce((s,x)=>s+x.price,0);document.querySelector('#app').innerHTML=`<main class="cartpage"><button id="back">← Menüye dön</button><h1>Sepetim</h1>${cart.map((x,i)=>`<div class="line"><div><b>${x.name}</b><small>${money(x.price)}</small></div><button data-del="${i}">Sil</button></div>`).join('')||'<p>Sepetin boş.</p>'}<div class="summary"><span>Toplam</span><strong>${money(total)}</strong></div><button class="checkout" ${cart.length?'':'disabled'}>Ödemeye Devam Et</button><p class="note">Online ödeme PayTR entegrasyonu üzerinden aktif edilecek.</p></main>`;document.getElementById('back').onclick=render;document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.del,1);showCart()})}
render();