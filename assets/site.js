
(function(){
  'use strict';
  var menu=document.getElementById('menu-button'), nav=document.getElementById('site-nav');
  if(menu&&nav){menu.addEventListener('click',function(){var open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰';});}
  var lightbox=document.querySelector('.lightbox');
  if(lightbox){
    var lbimg=lightbox.querySelector('img');
    document.querySelectorAll('[data-gallery-image]').forEach(function(button){
      button.addEventListener('click',function(){lbimg.src=button.getAttribute('data-gallery-image');lbimg.alt=button.querySelector('img')?.alt||'Project photograph';lightbox.classList.add('open');document.body.style.overflow='hidden';lightbox.querySelector('button').focus();});
    });
    function close(){lightbox.classList.remove('open');lbimg.removeAttribute('src');document.body.style.overflow='';}
    lightbox.querySelector('button').addEventListener('click',close);
    lightbox.addEventListener('click',function(e){if(e.target===lightbox)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lightbox.classList.contains('open'))close();});
  }
  var load=document.getElementById('gallery-more');
  if(load){var imgs=[].slice.call(document.querySelectorAll('.gallery-item'));var visible=24;function paint(){imgs.forEach(function(item,index){item.hidden=index>=visible;});load.hidden=visible>=imgs.length;}paint();load.addEventListener('click',function(){visible+=24;paint();});}
  var calculator=document.getElementById('floor-calculator');
  if(calculator){
    var sqft=document.getElementById('square-feet'),length=document.getElementById('length-ft'),width=document.getElementById('width-ft'),system=document.getElementById('floor-system'),condition=document.getElementById('floor-condition'),price=document.getElementById('estimated-range'),summary=document.getElementById('estimate-summary'),details=document.getElementById('calc-details'),sqftOut=document.getElementById('calculated-sqft'),quoteHidden=document.getElementById('quote-range-field'),floorHidden=document.getElementById('project-size-field');
    // INITIAL PLANNING DEFAULTS, not approved Elite Epoxy Solutions prices.
    // Update these figures with the business owner before deploying.
    var rates={flake:[6,8],polyaspartic:[7,9],solid:[5.5,7.5],metallic:[10,14],commercial:[6,9]};var minimum=2500;
    var currency=function(n){return n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});};
    var recalc=function(){var n=Number(sqft.value)||((Number(length.value)||0)*(Number(width.value)||0)), key=system.value, r=rates[key]||rates.flake, adjustment=condition.value==='repair'?1.1:1;var a=Math.max(minimum,Math.round(n*r[0]*adjustment/25)*25),b=Math.max(minimum,Math.round(n*r[1]*adjustment/25)*25);if(!n||n<50){price.textContent='Add your dimensions';summary.textContent='Enter your floor size to see a preliminary budget range.';details.hidden=true;quoteHidden.value='';floorHidden.value='';return;}price.textContent=currency(a)+' – '+currency(b);summary.textContent='Illustrative planning range only, not a quote. Actual price depends on inspection, preparation and system.';details.hidden=false;sqftOut.textContent=n.toLocaleString()+' sq ft';quoteHidden.value=currency(a)+' – '+currency(b);floorHidden.value=n+' square feet, '+system.options[system.selectedIndex].text;};
    [sqft,length,width,system,condition].forEach(function(el){el.addEventListener('input',function(){if((el===length||el===width)&&length.value&&width.value)sqft.value='';recalc();});});recalc();
  }
  document.querySelectorAll('form[data-async-lead]').forEach(function(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();var submit=form.querySelector('[type=submit]');var status=form.querySelector('[data-form-status]');
      if(!form.reportValidity())return;
      submit.disabled=true;submit.textContent='Sending...';status.textContent='';
      try{var data=new FormData(form);var body=new URLSearchParams();data.forEach(function(value,key){body.append(key,value);});var result=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});if(!result.ok)throw new Error('Submission unavailable');status.className='lead-success';status.textContent='Thanks — your request has been submitted. We will follow up soon.';form.reset();if(calculator)calculator.dispatchEvent(new Event('input'));}
      catch(err){status.className='lead-error';status.textContent='Your message could not be sent. Please call (804) 878-7723 instead.';}
      finally{submit.disabled=false;submit.textContent='Send My Request';}
    });
  });
})();
