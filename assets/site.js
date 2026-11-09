
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
    var garageSize=document.getElementById('garage-size');
    var sqft=document.getElementById('square-feet');
    var length=document.getElementById('length-ft');
    var width=document.getElementById('width-ft');
    var condition=document.getElementById('floor-condition');
    var continueButton=document.getElementById('estimate-continue');
    var contactStep=document.getElementById('estimate-lead');
    var sizeError=document.getElementById('estimate-size-error');
    var reveal=document.getElementById('estimate-reveal');
    var dimensionsMode=false;
    var price=document.getElementById('estimated-range');
    var summary=document.getElementById('estimate-summary');
    var details=document.getElementById('calc-details');
    var sqftOut=document.getElementById('calculated-sqft');
    var quoteHidden=document.getElementById('quote-range-field');
    var floorHidden=document.getElementById('project-size-field');
    var leadSquareFeet=document.getElementById('lead-square-feet');
    var leadCondition=document.getElementById('lead-condition');
    var currency=function(n){return n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});};
    var recalc=function(){
      var lengthFeet=Number(length.value), widthFeet=Number(width.value);
      if(dimensionsMode){
        sqft.value=lengthFeet>0&&widthFeet>0?String(Math.round(lengthFeet*widthFeet*100)/100):'';
      }
      var area=Number(sqft.value);
      sizeError.textContent='';
      reveal.hidden=true;
      price.textContent='';
      leadSquareFeet.value='';
      leadCondition.value=condition.options[condition.selectedIndex].text;
      if(!Number.isFinite(area)||area<50){
        price.textContent='Add your dimensions';
        summary.textContent='Enter your floor size to see a flake epoxy estimate.';
        details.hidden=true;quoteHidden.value='';floorHidden.value='';
        return;
      }
      leadSquareFeet.value=area;
      var low=area*6, high=area*8;
      var range=currency(low)+' – '+currency(high);
      summary.textContent='Flake epoxy at $6–$8 per sq ft. The final quote may vary based on prep, repair and concrete condition.';
      details.hidden=false;
      sqftOut.textContent=area.toLocaleString()+' sq ft';
      quoteHidden.value=range;
      floorHidden.value=area+' square feet, flake epoxy; '+condition.options[condition.selectedIndex].text;
    };
    garageSize.addEventListener('change',function(){
      dimensionsMode=false;
      sqft.value=garageSize.value;
      length.value='';
      width.value='';
      recalc();
    });
    [sqft,length,width,condition].forEach(function(el){
      el.addEventListener('input',function(){
        if(el!==condition)garageSize.value='';
        if(el===length||el===width)dimensionsMode=true;
        if(el===sqft){dimensionsMode=false;length.value='';width.value='';}
        recalc();
      });
    });
    continueButton.addEventListener('click',function(){
      if(!quoteHidden.value){
        sizeError.textContent='Enter a floor size of at least 50 square feet to continue.';
        sqft.focus();
        return;
      }
      contactStep.hidden=false;
      continueButton.setAttribute('aria-expanded','true');
      document.getElementById('calculator-lead-name').focus();
    });
    recalc();
  }
  document.querySelectorAll('form[data-async-lead]').forEach(function(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();var submit=form.querySelector('[type=submit]');var status=form.querySelector('[data-form-status]');
      if(!form.reportValidity())return;
      var isCalculator=form.hasAttribute('data-calculator-lead');
      var submittedRange=isCalculator?quoteHidden.value:'';
      if(isCalculator&&!submittedRange){
        status.className='lead-error';
        status.textContent='Enter a floor size of at least 50 square feet to get an estimate.';
        sqft.focus();
        return;
      }
      var originalLabel=submit.textContent;
      submit.disabled=true;
      submit.textContent='Sending...';
      status.textContent='';
      try{
        var body=new URLSearchParams(new FormData(form));
        var result=await fetch(isCalculator?form.action:'/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});
        if(!result.ok||(isCalculator&&result.status!==204))throw new Error('Submission unavailable');
        status.className='lead-success';
        if(isCalculator){
          status.textContent='Thanks — your request was submitted.';
          if(quoteHidden.value===submittedRange&&body.get('square_feet')===leadSquareFeet.value&&body.get('concrete_condition')===leadCondition.value){
            price.textContent=submittedRange;
            reveal.hidden=false;
            reveal.setAttribute('tabindex','-1');
            reveal.focus();
          }else{
            status.textContent='Your request was submitted. Submit again to see an estimate for your updated project details.';
          }
        }else{
          status.textContent='Thanks — your request has been submitted. We will follow up soon.';
          form.reset();
        }
      }catch(err){
        status.className='lead-error';
        status.textContent='Your message could not be sent. Please try again or call (804) 878-7723.';
      }finally{
        submit.disabled=false;
        submit.textContent=originalLabel;
      }
    });
  });
})();
