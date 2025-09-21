document.addEventListener('DOMContentLoaded',()=>{
  const navLinks=document.querySelectorAll('.nav-link');
  navLinks.forEach(link=>{
    try{
      const url=new URL(link.href,location.href);
      if(url.pathname===location.pathname){
        link.classList.add('active');
      }
    }catch(e){}
  });
});


