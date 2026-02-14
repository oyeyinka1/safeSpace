const affirmations = [
    {text:"Today, I am safe in God's presence. He sees my wounds and he is gentle with my heart.", ref:"Psalms 34:18"},
    {text:"I am not my past mistakes. In christ, I am being made new one step at a time.", ref: " 2 corinthians 5:17"},
    {text:"God is not tired of me. His mercy is fresh for me this morning.", ref: " Lamentations 3:22-23"},
    {text:"I am fully known and still deeply loved. Nothing can seperate me from the love of christ", ref:"Romans 8:38-39"},
    {text:"Even when i feel weak, I am not alone. God's strength holds what i cannot carry.", ref: "2 corithians 12:9-10"},
    {text:"My emotions are safe with God. I don't have to fake being okay here.", ref: "Psalms 62:8"},
    {text:"God is patient with my healing. I am allowed to grow slowly and honestly.", ref: "Philipians 1:6"},
];


async function currentUser () {
  const res = await fetch("http://localhost:8000/api/register");
  const user = res.json();

  return {
    user: user.name,
    email: user.email
  } 
}


//  Get the same affirmation for everyone on the same day
 function getTodayAffirmation(){
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (24 * 60 * 60 * 1000));
    const index = daysSinceEpoch % affirmations.length;
    return affirmations[index];
 }

const modal = document.getElementById('affirmationModal');
const openBtn = document.getElementById('openAffirmation');
const closeBtn= document.getElementById('closeAffirmation');
const textEl = document.getElementById('affirmationText');
const refEl = document.getElementById('affirmationRef');

 function openModal(){
    const todayAff = getTodayAffirmation();
    textEl.textContent = todayAff.text;
    refEl.textContent = todayAff.ref ?  `(${todayAff.ref})` : "";
     modal.classList.add('show');
 }

 function closeModal(){
    modal.classList.remove('show');
 }

 openBtn.addEventListener('click', openModal);
 closeBtn.addEventListener('click', closeModal);

 // close when clicking outdise  the card 
 modal.addEventListener('click', (e)=>{
   if (e.target === modal) closeModal();
 });

 window.addEventListener("load",()=>{
   document.body.classList.add("loaded");
 });

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const icon = menuToggle.querySelector('i');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    menuToggle.classList.toggle('open');

if (navLinks.classList.contains('show')){
    icon.classList.replace('fa-bars-staggered', 'fa-xmark');
}else{
    icon.classList.replace('fa-xmark', 'fa-bars-staggered');
}
});



document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("loaded");

  const shareBtn = document.getElementById("share-btn");

  shareBtn.addEventListener("click", function () {
    const currentUser = localStorage.getItem("safeSpaceUser");

    if (!currentUser) {
      alert("Please sign up first so we can better assist you☺.");
      window.location.href = "signup.html";
      return;
    }
☺
    alert("Message sent successfully. You are not alone ❤️");
  });
});
