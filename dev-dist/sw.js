if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(n[t])return;let o={};const l=e=>s(e,t),c={module:{uri:t},exports:o,require:l};n[t]=Promise.all(i.map((e=>c[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-7ee2d773"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"suppress-warnings.js",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"index.html",revision:"0.ah85loq7128"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{allowlist:[/^\/$/]})),e.registerRoute((({request:e,sameOrigin:n})=>n&&"navigate"===e.mode),new e.NetworkOnly({plugins:[{handlerDidError:async()=>Response.redirect("404",302),cacheWillUpdate:async()=>null}]}),"GET")}));
