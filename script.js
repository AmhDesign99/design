const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const title=$("#title"), subtitle=$("#subtitle"), price=$("#price"), phone=$("#phone"), photo=$("#photo");
const upload=$("#upload"), productImage=$("#productImage");
let image=null, variants=[], selected=0;

const layouts=[
 {id:"food",name:"Food Focus",note:"Foto dominan + harga",bg:["#32170d","#c46b30"],ink:"#fff",accent:"#f2b94b"},
 {id:"clean",name:"Clean Product",note:"Bersih + modern",bg:["#eef7ed","#fff"],ink:"#23452a",accent:"#4e8f55"},
 {id:"premium",name:"Premium",note:"Elegan + eksklusif",bg:["#101012","#60432a"],ink:"#fff",accent:"#c99a55"},
 {id:"promo",name:"Promo Bold",note:"Harga jadi fokus",bg:["#8d1818","#ff7a25"],ink:"#fff",accent:"#ffd34e"},
 {id:"fresh",name:"Fresh",note:"Cerah + ramah",bg:["#d9f0ff","#fff"],ink:"#214a72",accent:"#3187c8"},
 {id:"minimal",name:"Minimal",note:"Sederhana + rapi",bg:["#f5f3ee","#fff"],ink:"#2b2925",accent:"#333"}
];

subtitle.oninput=()=>$("#counter").textContent=subtitle.value.length+"/110";
upload.onclick=e=>{if(!e.target.closest("button"))photo.click()};
$("#replacePhoto").onclick=e=>{e.stopPropagation();photo.click()};
$("#removePhoto").onclick=e=>{e.stopPropagation();image=null;photo.value="";$("#photoState").classList.add("hidden");$("#empty").classList.remove("hidden")};
photo.onchange=e=>{
 const f=e.target.files?.[0]; if(!f)return;
 const r=new FileReader();
 r.onload=ev=>{const im=new Image();im.onload=()=>{image=im;productImage.src=ev.target.result;$("#empty").classList.add("hidden");$("#photoState").classList.remove("hidden")};im.src=ev.target.result};
 r.readAsDataURL(f);
};

function detectType(){
 const t=(title.value+" "+subtitle.value).toLowerCase();
 if(/kopi|es |teh|jus|minuman|coklat|susu|boba|sari|sirup/.test(t)) return "minuman";
 if(/sambal|keripik|kerupuk|kue|roti|cake|nasi|mie|bakso|dimsum|makanan|snack|puding|camilan/.test(t)) return "makanan";
 if(/baju|kaos|hijab|jilbab|fashion|dress|celana|tas|sepatu|sandal|jaket/.test(t)) return "fashion";
 if(/jasa|desain|foto|service|kursus|les|laundry|travel|salon|barber/.test(t)) return "jasa";
 return "produk";
}
function chooseLayouts(){
 const type=detectType(), hasPrice=!!price.value.trim(), promo=/diskon|promo|sale|hemat|potongan|%/.test((title.value+" "+subtitle.value).toLowerCase());
 let pool;
 if(promo) pool=["promo","food","fresh"];
 else if(type==="fashion") pool=["clean","premium","minimal"];
 else if(type==="minuman") pool=["fresh","food","clean"];
 else if(type==="jasa") pool=["clean","minimal","premium"];
 else if(type==="makanan") pool=["food","premium","fresh"];
 else pool=["clean","premium","minimal"];
 return pool.map(id=>layouts.find(x=>x.id===id));
}
function cover(c,im,x,y,w,h,r){const z=Math.max(w/im.width,h/im.height),sw=im.width*z,sh=im.height*z;c.save();c.beginPath();c.roundRect(x,y,w,h,r);c.clip();c.drawImage(im,x+(w-sw)/2,y+(h-sh)/2,sw,sh);c.restore()}
function wrap(c,t,max,size,weight=700){c.font=`${weight} ${size}px Arial`;let a=[],l="";for(const word of t.split(/\s+/)){const q=l?l+" "+word:word;if(c.measureText(q).width>max&&l){a.push(l);l=word}else l=q}if(l)a.push(l);return a.slice(0,3)}
function rounded(c,x,y,w,h,r,fill){c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
function drawPoster(c,w,h,d){
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,d.bg[0]);g.addColorStop(1,d.bg[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
 const type=detectType();
 c.fillStyle=d.accent;c.font=`900 ${w*.023}px Arial`;c.fillText(d.id==="promo"?"PROMO SPESIAL":d.id==="premium"?"PREMIUM QUALITY":"UMKM • "+type.toUpperCase(),w*.07,h*.055);
 if(image) cover(c,image,w*.07,h*.105,w*.86,h*.40,24);
 else {rounded(c,w*.07,h*.105,w*.86,h*.40,24,"#ffffff55");c.fillStyle=d.ink;c.textAlign="center";c.font=`900 ${w*.027}px Arial`;c.fillText("FOTO PRODUK",w/2,h*.30);c.textAlign="left"}
 let t=title.value||"Nama Produk Anda", fs=w*.068;c.font=`900 ${fs}px Arial`;while(c.measureText(t).width>w*.86&&fs>25){fs-=2;c.font=`900 ${fs}px Arial`};
 c.fillStyle=d.ink;c.fillText(t,w*.07,h*.575);
 const st=subtitle.value||defaultCopy(type);wrap(c,st,w*.86,w*.025).forEach((line,i)=>c.fillText(line,w*.07,h*(.625+i*.037)));
 if(price.value){rounded(c,w*.07,h*.735,w*.33,h*.085,20,d.accent);c.fillStyle=d.id==="premium"||d.id==="food"||d.id==="promo"?"#20130b":"#fff";c.font=`900 ${w*.031}px Arial`;c.fillText(price.value,w*.095,h*.793)}
 if(d.id==="promo"){c.fillStyle=d.accent;c.font=`900 ${w*.06}px Arial`;c.fillText("BURUAN!",w*.52,h*.79)}
 if(phone.value){c.fillStyle=d.ink;c.font=`800 ${w*.021}px Arial`;c.fillText("PESAN: "+phone.value,w*.07,h*.885)}
 rounded(c,0,h*.925,w,h*.075,"0",d.id==="clean"||d.id==="fresh"?"#1f6b3d":"#171313");
 c.fillStyle="#fff";c.font=`900 ${w*.021}px Arial`;c.fillText("PESAN SEKARANG  •  "+(phone.value||"WhatsApp Anda"),w*.07,h*.97);
}
function defaultCopy(type){
 return type==="minuman"?"Segar, nikmat, cocok menemani aktivitas Anda!":
 type==="fashion"?"Nyaman dipakai, model kekinian, cocok untuk sehari-hari.":
 type==="jasa"?"Solusi praktis dan profesional untuk kebutuhan Anda.":"Lezat, berkualitas, dan siap jadi favorit keluarga!";
}
function renderVariants(){
 const container=$("#variants");container.innerHTML="";
 variants.forEach((d,i)=>{
  const box=document.createElement("div");box.className="variant"+(i===selected?" selected":"");
  const c=document.createElement("canvas");c.width=290;c.height=363;box.append(c);
  const n=document.createElement("div");n.className="variant-name";n.textContent=(i===0?"⭐ Rekomendasi • ":"")+d.name;
  const note=document.createElement("div");note.className="variant-note";note.textContent=d.note;box.append(n,note);
  box.onclick=()=>{selected=i;$$(".variant").forEach(x=>x.classList.remove("selected"));box.classList.add("selected");drawSelected()};
  container.append(box);drawPoster(c.getContext("2d"),290,363,d);
 });
}
function drawSelected(){drawPoster($("#canvas").getContext("2d"),1080,1350,variants[selected])}
function runGenerate(){
 if(!title.value.trim()){title.focus();alert("Masukkan nama produk terlebih dahulu.");return}
 $("#inputCard").classList.add("hidden");$("#resultCard").classList.add("hidden");$("#analyzeCard").classList.remove("hidden");window.scrollTo(0,0);
 const steps=[["c1",25,"✓ Mengenali jenis produk"],["c2",50,"✓ Menganalisis foto"],["c3",75,"✓ Memilih layout"],["c4",100,"✓ Menyusun pamflet"]];
 let i=0; const tick=()=>{if(i>=steps.length){setTimeout(finish,350);return}const [id,pct,text]=steps[i++];$("#progress").style.width=pct+"%";const el=$("#"+id);el.textContent=text;el.classList.add("done");setTimeout(tick,420)};tick();
}
function finish(){
 variants=chooseLayouts();selected=0;$("#analyzeCard").classList.add("hidden");$("#resultCard").classList.remove("hidden");
 const type=detectType();$("#analysisText").textContent=`✓ ${type.charAt(0).toUpperCase()+type.slice(1)} • Layout otomatis: ${variants[0].name}`;
 renderVariants();drawSelected();window.scrollTo(0,0);
}
$("#generateBtn").onclick=runGenerate;
$("#again").onclick=()=>{variants=chooseLayouts().reverse();selected=0;renderVariants();drawSelected()};
$("#edit").onclick=()=>{$("#resultCard").classList.add("hidden");$("#inputCard").classList.remove("hidden");window.scrollTo(0,0)};
$("#download").onclick=()=>{drawSelected();const a=document.createElement("a");a.download=(title.value||"pamflet-umkm").replace(/[^a-z0-9]+/gi,"-").toLowerCase()+".png";a.href=$("#canvas").toDataURL("image/png");a.click()};
$("#share").onclick=async()=>{try{await navigator.share({title:"Pamflet UMKM",text:`Pamflet ${title.value||"produk saya"}`})}catch(e){alert("Jika bagikan tidak tersedia, gunakan Unduh PNG lalu bagikan dari galeri HP.")}};
$("#helpBtn").onclick=()=>$("#helpDialog").showModal();$("#closeHelp").onclick=()=>$("#helpDialog").close();$("#okHelp").onclick=()=>$("#helpDialog").close();
