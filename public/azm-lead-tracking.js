(function(){
 'use strict';
 var params=new URLSearchParams(location.search),ad=params.get('ad_id')||params.get('meta_ad_id');
 if(!/^\d{5,30}$/.test(ad||''))return; // No stale session attribution on organic visits.
 var product=location.pathname.split('/').pop().replace(/\.html$/,'');
 if(['ghaida','ghania','hafsah'].indexOf(product)<0)return;
 var open=window.open.bind(window),pending;
 function marker(){if(!pending)pending=fetch('https://azmayra-dashboard.vercel.app/api/tracking/lp-marker',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ad_id:ad,product:product}),signal:AbortSignal.timeout(5000)}).then(function(r){return r.ok?r.json():null}).then(function(j){return j&&j.marker||null}).catch(function(){return null});return pending}
 function wa(value){try{var u=new URL(value,location.href);return u.protocol==='https:'&&(u.hostname==='wa.me'||u.hostname==='api.whatsapp.com')?u:null}catch(e){return null}}
 function send(url,target,features){var u=wa(url);if(!u)return open(url,target,features);var slot=open('about:blank',target||'_blank',features);if(slot)try{slot.opener=null}catch(e){}marker().then(function(m){if(m){var text=u.searchParams.get('text')||'';if(text.indexOf('[AZM1:')<0)u.searchParams.set('text',text+'\n'+m)}if(slot)slot.location.href=u.href;else location.href=u.href});return slot}
 window.open=function(url,target,features){return wa(url)?send(url,target,features):open(url,target,features)};
 document.addEventListener('click',function(e){if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;var a=e.target.closest&&e.target.closest('a[href]');if(a&&wa(a.href)){e.preventDefault();send(a.href,a.target||'_blank')}},false);
 marker(); // Prefetch transport marker, but a click is not counted as a CRM contact.
})();
