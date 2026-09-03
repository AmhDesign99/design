const $=s=>document.querySelector(s);
const title=$("#title"), subtitle=$("#subtitle"), price=$("#price"), phone=$("#phone"), photo=$("#photo");
const uploadBox=$("#uploadBox"), uploadEmpty=$("#uploadEmpty"), uploadPreview=$("#uploadPreview"), productImg=$("#productImg");
const counter=$("#counter"), inputStep=$("#inputStep"), templateStep=$("#templateStep"), resultStep=$("#resultStep");
const canvas=$("#canvas"), ctx=canvas.getContext("2d");
let image=null, selected=0;

const templateDefs=[
  {name:"Natural Fresh",a:"#f1e1c4",b:"#8a5b2d",ink:"#4d2f19",accent:"#8a5b2d"},
  {name:"Premium Dark",a:"#171313",b:"#754c2e",ink:"#fff",accent:"#c28a4b"},
  {name:"Sweet Promo",a:"#ffd8ce",b:"#fff6ef",ink:"#7b3023",accent:"#e76d52"},
  {name:"Clean Green",a:"#dcefdc",b:"#f8fff4",ink:"#28532c",accent:"#4b8d4f"},
  {name:"Fresh Blue",a:"#dbe9ff",b:"#f8fbff",ink:"#24477d",accent:"#4278c8"}
];

subtitle.addEventListener("input",()=>counter.textContent=`${subtitle.value.length}/110`);
uploadBox.onclick=e=>{if(!e.target.closest("button"))photo.click()};
$("#changePhoto").onclick=e=>{e.stopPropagation();photo.click()};
$("#removePhoto").onclick=e=>{e.stopPropagation();image=null;photo.value="";uploadPreview.classList.add("hidden");uploadEmpty.classList.remove("hidden")};
photo.onchange=e=>{
 const f=e.target.files?.[0]; if(!f)return;
 const r=new FileReader(); r.onload=ev=>{const im=new Image();im.onload=()=>{image=im;productImg.src=ev.target.result;uploadEmpty.classList.add("hidden");uploadPreview.classList.remove("hidden")};im.src=ev.target.result};r.readAsDataURL(f);
};

function card(def,i){
 const wrap=document.createElement("div");wrap.className="template"+(i===selected?" active":"");
 const c=document.createElement("canvas");c.width=460;c.height=575;wrap.append(c);
 const n=document.createElement("div");n.className="template-name";n.textContent=def.name;
 wrap.append(n);wrap.onclick=()=>{selected=i;document.querySelectorAll(".template").forEach(x=>x.classList.remove("active"));wrap.classList.add("active")};
 drawPoster(c.getContext("2d"),c.width,c.height,def);
 return wrap;
}
templateDefs.forEach((d,i)=>$("#templates").append(card(d,i)));

function cover(c,img,x,y,w,h){
 const r=Math.max(w/img.width,h/img.height),sw=img.width*r,sh=img.height*r;
 c.save();c.beginPath();c.roundRect(x,y,w,h,18);c.clip();c.drawImage(img,x+(w-sw)/2,y+(h-sh)/2,sw,sh);c.restore();
}
function wrap(c,text,max,size){
 c.font=`700 ${size}px Arial`;let out=[],line="";
 for(const word of text.split(/\s+/)){let t=line?line+" "+word:word;if(c.measureText(t).width>max&&line){out.push(line);line=word}else line=t}
 if(line)out.push(line);return out.slice(0,3);
}
function drawPoster(c,w,h,d){
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,d.a);g.addColorStop(1,d.b);c.fillStyle=g;c.fillRect(0,0,w,h);
 c.fillStyle=d.ink;c.font=`900 ${Math.round(w*.035)}px Arial`;c.fillText("PROMO UMKM",w*.07,h*.065);
 if(image)cover(c,image,w*.07,h*.12,w*.86,h*.43);else{c.fillStyle="#ffffff80";c.roundRect(w*.07,h*.12,w*.86,h*.43,18);c.fill();c.fillStyle="#777";c.textAlign="center";c.font=`700 ${Math.round(w*.025)}px Arial`;c.fillText("Foto produk Anda",w/2,h*.34);c.textAlign="left"}
 const t=title.value||"Nama Produk Anda";let fs=Math.round(w*.072);c.font=`900 ${fs}px Arial`;while(c.measureText(t).width>w*.86&&fs>24){fs-=2;c.font=`900 ${fs}px Arial`}
 c.fillStyle=d.ink;c.fillText(t,w*.07,h*.625);
 const sub=subtitle.value||"Produk berkualitas untuk pelanggan Anda.";wrap(c,sub,w*.86,Math.round(w*.026)).forEach((l,i)=>c.fillText(l,w*.07,h*.675+i*Math.round(w*.038)));
 c.fillStyle=d.accent;c.roundRect(w*.07,h*.775,w*.32,h*.075,14);c.fill();
 c.fillStyle="#fff";c.font=`900 ${Math.round(w*.032)}px Arial`;c.fillText(price.value||"Harga terbaik",w*.095,h*.825);
 if(phone.value){c.fillStyle=d.ink;c.font=`700 ${Math.round(w*.023)}px Arial`;c.fillText("Pesan: "+phone.value,w*.07,h*.91)}
 c.fillStyle=d.accent;c.font=`800 ${Math.round(w*.018)}px Arial`;c.fillText("Siap dipromosikan • Instagram • WhatsApp",w*.07,h*.96);
}
function drawResult(){drawPoster(ctx,1080,1350,templateDefs[selected])}

$("#nextBtn").onclick=()=>{inputStep.classList.add("hidden");templateStep.classList.remove("hidden");window.scrollTo(0,0)};
$("#backInput").onclick=()=>{templateStep.classList.add("hidden");inputStep.classList.remove("hidden")};
$("#makeBtn").onclick=()=>{drawResult();templateStep.classList.add("hidden");resultStep.classList.remove("hidden");window.scrollTo(0,0)};
$("#backTemplate").onclick=()=>{resultStep.classList.add("hidden");templateStep.classList.remove("hidden")};
$("#changeTemplate").onclick=()=>{resultStep.classList.add("hidden");templateStep.classList.remove("hidden")};
$("#editText").onclick=()=>{resultStep.classList.add("hidden");inputStep.classList.remove("hidden");window.scrollTo(0,0)};
$("#downloadBtn").onclick=()=>{drawResult();const a=document.createElement("a");a.download=((title.value||"pamflet-umkm").replace(/[^a-z0-9]+/gi,"-").toLowerCase())+".png";a.href=canvas.toDataURL("image/png");a.click()};
$("#waBtn").onclick=()=>{const text=encodeURIComponent(`Halo, saya ingin memesan ${title.value||"produk ini"}.`);window.open(`https://wa.me/?text=${text}`,"_blank")};
$("#igBtn").onclick=()=>alert("Unduh PNG terlebih dahulu, lalu pilih Bagikan ke Instagram dari galeri HP.");
$("#shareBtn").onclick=async()=>{try{await navigator.share({title:"Pamflet UMKM",text:"Pamflet produk saya"});}catch(e){alert("Gunakan tombol Unduh PNG untuk menyimpan desain.")}};
$("#navTemplate").onclick=()=>{inputStep.classList.add("hidden");resultStep.classList.add("hidden");templateStep.classList.remove("hidden");window.scrollTo(0,0)};
$("#navResult").onclick=()=>{drawResult();inputStep.classList.add("hidden");templateStep.classList.add("hidden");resultStep.classList.remove("hidden");window.scrollTo(0,0)};
$("#helpBtn").onclick=()=>$("#helpDialog").showModal();$("#closeHelp").onclick=()=>$("#helpDialog").close();$("#okHelp").onclick=()=>$("#helpDialog").close();
