
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
    var sqft=document.getElementById('square-feet');
    var length=document.getElementById('length-ft');
    var width=document.getElementById('width-ft');
    var condition=document.getElementById('floor-condition');
    var price=document.getElementById('estimated-range');
    var summary=document.getElementById('estimate-summary');
    var details=document.getElementById('calc-details');
    var sqftOut=document.getElementById('calculated-sqft');
    var quoteHidden=document.getElementById('quote-range-field');
    var floorHidden=document.getElementById('project-size-field');
    var currency=function(n){return n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});};
    var recalc=function(){
      var area=Number(sqft.value)||((Number(length.value)||0)*(Number(width.value)||0));
      if(!area||area<50){
        price.textContent='Add your dimensions';
        summary.textContent='Enter your floor size to see a flake epoxy estimate.';
        details.hidden=true;quoteHidden.value='';floorHidden.value='';
        return;
      }
      var low=area*6, high=area*8;
      price.textContent=currency(low)+' – '+currency(high);
      summary.textContent='Flake epoxy at $6–$8 per sq ft. The final quote may vary based on prep, repair and concrete condition.';
      details.hidden=false;
      sqftOut.textContent=area.toLocaleString()+' sq ft';
      quoteHidden.value=currency(low)+' – '+currency(high);
      floorHidden.value=area+' square feet, flake epoxy; '+condition.options[condition.selectedIndex].text;
    };
    [sqft,length,width,condition].forEach(function(el){
      el.addEventListener('input',function(){
        if((el===length||el===width)&&length.value&&width.value)sqft.value='';
        recalc();
      });
    });
    recalc();
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
