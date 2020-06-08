!function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Director=t.sq32=t.shapeTypes=void 0;const i=n(5),o=n(6),s=n(7);t.shapeTypes=["heart","triangle","square","hex","circle","t2","h2","c","c2","s2","diamond","cross","x","star"],t.sq32=Math.sqrt(3)/2;const r=["#fad000","#faa002","#e66102","#ed1515","#ea005e","#ff4fbc","#0e39b2","#0d5bc7","#079ebd","#20cc10","#fcfcfc"];function a(e,t,n,i=!1){const s=[];i=i&&!n;for(let n=0;n<t;++n)s.push(e[i?n%e.length:0]);return n&&(s[0]=e[1]),o.shuffle(s),s}t.Director=class{constructor(e=1){this.aspect=e,this._shapes=null,this.size=12,this.orientation="grid",this.isNew=!0}makeShapes(){let e=i.rnd(["shape","color","shading","size"]);const n=t.shapeTypes.map(e=>e);o.shuffle(n),o.shuffle(r),this.orientation="shape"!=e&&i.rnd()<.5?i.rnd(["vertical","horizontal"]):"grid";const l=("vertical"==this.orientation?1/t.sq32:1)*this.size|0,c=("horizontal"==this.orientation?1/t.sq32:1)*(this.size/this.aspect)|0,h=l*c,d=a(n,h,"shape"==e,"grid"==this.orientation&&i.rnd()<.4),u=a(r,h,"color"==e,i.rnd()<.4);let f=i.rnd()<.5;const p=a([f,!f],h,"shading"==e);f="size"==e&&i.rnd()<.5;const v=a([f,!f],h,"size"==e);var M=[];for(let e=0;e<c;++e){let t=[];for(let n=0;n<l;++n){let i=e*l+n;t.push(new s.Shape(d[i],u[i],p[i],v[i]))}M.push(t)}return M}get shapes(){return null==this._shapes&&(this._shapes=this.makeShapes(),this.isNew=!0),this._shapes}regen(){this._shapes=null}grow(){this.size<30&&(this.size++,this.regen())}shrink(){this.size>2&&(this.size--,this.regen())}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(2),o=n(3),s=n(0);new i.Loop(1e3/24,(function(){const e=new o.Render;let t={render:e,dir:new s.Director(e.aspect)};return addEventListener("keydown",()=>t.dir.regen()),addEventListener("mousedown",()=>t.dir.regen()),addEventListener("wheel",e=>{e.deltaY<0?t.dir.grow():t.dir.shrink()}),t}),(function(e,t){return t}),(function(e,t){const n=t.dir.shapes;t.dir.isNew&&(t.render.draw(n,t.dir.orientation),t.dir.isNew=!1)})).start()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Loop=void 0;t.Loop=class{constructor(e,t,n,i){this.fixedDelta=e,this.init=t,this.fixed=n,this.variable=i,this.isRunning=!1,this.fixedAccum=0}start(){if(this.isRunning)return;let e=this.init();this.isRunning=!0;let t=0;const n=i=>{const o=0==t,s=o?0:i-t;t=i,e=this.update(s,e,o),this.isRunning&&requestAnimationFrame(n)};requestAnimationFrame(n)}stop(){this.isRunning=!1}update(e,t,n=!1){let i=t;this.fixedAccum+=e;let o=!1;if(n)i=this.fixed(this.fixedDelta,i),o=!0;else for(;this.fixedAccum>this.fixedDelta;)this.fixedAccum-=this.fixedDelta,i=this.fixed(this.fixedDelta,i),o=!0;return o&&this.variable(e,i),i}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Render=void 0;const i=n(4),o=n(0);t.Render=class{constructor(e=i.fullscreenCanvas()){this.ctx=e,this.aspect=e.canvas.width/e.canvas.height}draw(e,t){const n=this.ctx,{width:i,height:s}=n.canvas,r=e[0].length*("vertical"==t?o.sq32:1),a=e.length*("horizontal"==t?o.sq32:1),l=.15,c=i/r<s/a?(i-2*i*.04)/(1+1.15*(r-1)):(s-2*s*.04)/(1+1.15*(a-1)),h=(i-c*(1+1.15*(r-1)))/2,d=(s-c*(1+1.15*(a-1)))/2.5,u=c*l;n.clearRect(0,0,i,s),n.save(),n.translate(h,d);const f="vertical"==t?o.sq32:1,p="horizontal"==t?o.sq32:1;for(let i=0;i<e.length;++i)for(let o=0;o<e[i].length;++o){let s=e[i][o];n.save();let r="horizontal"==t?i%2==0?-.25:.25:0,a="vertical"==t?o%2==0?-.25:.25:0;n.translate(f*(u+c)*(o+r),p*(u+c)*(i+a)),n.scale(c,c),n.lineWidth=.06,s.draw(n),n.restore()}n.restore()}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fullscreenCanvas=t.fullscreenCanvas3d=t.getCanvas=void 0,t.getCanvas=(e=!1)=>{const t=document.createElement("canvas");return t.width=window.innerWidth,t.height=window.innerHeight,e||(t.style.position="absolute",t.style.top="0",t.style.left="0"),t},t.fullscreenCanvas3d=(e=!1)=>{const n=t.getCanvas(e),i=n.getContext("webgl");if(null==i)throw new Error("failed to get 'webgl' context");return document.body.appendChild(n),i},t.fullscreenCanvas=function(e=!1,n=!1){const i=t.getCanvas(e),o=i.getContext("2d",{alpha:!n});if(null==o)throw new Error("failed to get '2d' context");return o.clear=function(){return o.clearRect(0,0,o.canvas.width,o.canvas.height),o},o.makePath=function(e){o.beginPath(),o.moveTo(e[0],e[1]);for(var t=2;t<e.length;t+=2)o.lineTo(e[t],e[t+1]);return o.closePath(),o},o.strokeCircle=function(e,t,n){return o.beginPath(),o.arc(e,t,n,0,2*Math.PI,!0),o.closePath(),o.stroke(),o},o.fillCircle=function(e,t,n){return o.beginPath(),o.arc(e,t,n,0,2*Math.PI,!0),o.closePath(),o.fill(),o},document.body.style.margin="0",document.body.appendChild(i),o}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.rnd=void 0,t.rnd=function(e,t,n){return void 0!==e&&void 0!==t?void 0!==n?t+(e-t)*Math.random():"boolean"==typeof t?e*Math.random():t+(e-t)*Math.random()|0:void 0!==e&&void 0===t?e instanceof Array?e[Math.random()*e.length|0]:e*Math.random()|0:Math.random()}},function(e,t,n){"use strict";function i(e,t){return"number"==typeof t&&"number"==typeof e?Math.floor(e+Math.random()*(t-e)):"number"==typeof e?Math.floor(e*Math.random()):e instanceof Array?e[Math.floor(e.length*Math.random())]:Math.random()}Object.defineProperty(t,"__esModule",{value:!0}),t.shuffle=t.array=t.rnd=void 0,t.rnd=i,t.array=function(e,t,n){const i=[];for(let o=0;o<t;++o){const t=[];for(let i=0;i<e;++i)t.push(n(o,i));i.push(t)}return i},t.shuffle=function(e){for(let t=e.length-1;t>0;--t){const n=i(t+1);[e[t],e[n]]=[e[n],e[t]]}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Shape=void 0;const i=2*Math.PI;t.Shape=class{constructor(e,t,n,i){this.type=e,this.color=t,this.filled=n,this.small=i}draw(e){e.fillStyle=e.strokeStyle=this.color,e.translate(.5,.5),this.small&&(e.scale(.5,.5),e.lineWidth*=1.7),this.filled||e.scale(.95,.95),this.path(e),this.filled?e.fill():e.stroke()}path(e){e.beginPath();const t=.1,n=.3,o=.55,s=.5,r=.62;switch(this.type){case"circle":e.arc(0,0,.5,0,i);break;case"triangle":for(let t=0;t<3;++t){let n=i/3*t;0==t?e.moveTo(r*Math.sin(n),r*Math.cos(n)-.2):e.lineTo(r*Math.sin(n),r*Math.cos(n)-.2)}break;case"t2":for(let t=0;t<3;++t){let n=i/3*t+i/6;0==t?e.moveTo(r*Math.sin(n),.2+r*Math.cos(n)):e.lineTo(r*Math.sin(n),.2+r*Math.cos(n))}break;case"hex":for(let t=0;t<6;++t){let n=i/6*t;0==t?e.moveTo(s*Math.sin(n),s*Math.cos(n)):e.lineTo(s*Math.sin(n),s*Math.cos(n))}break;case"h2":for(let t=0;t<6;++t){let n=i/6*t+i/12;0==t?e.moveTo(s*Math.sin(n),s*Math.cos(n)):e.lineTo(s*Math.sin(n),s*Math.cos(n))}break;case"square":e.moveTo(-.45,-.45),e.lineTo(-.45,.45),e.lineTo(.45,.45),e.lineTo(.45,-.45);break;case"c":e.moveTo(-.1,0),e.arc(0,0,.5,t*i,.9*i);break;case"c2":e.moveTo(.1,0),e.arc(0,0,.5,.4*i,.6*i,!0);break;case"diamond":e.moveTo(0,-o),e.lineTo(o,0),e.lineTo(0,o),e.lineTo(-o,0);break;case"x":const a=.25,l=.5-a;e.moveTo(0,-a),e.lineTo(l,-.5),e.lineTo(.5,-l),e.lineTo(a,0),e.lineTo(.5,l),e.lineTo(l,.5),e.lineTo(0,a),e.lineTo(-l,.5),e.lineTo(-.5,l),e.lineTo(-a,0),e.lineTo(-.5,-l),e.lineTo(-l,-.5);break;case"cross":const c=.2;e.moveTo(-c,-.5),e.lineTo(c,-.5),e.lineTo(c,-c),e.lineTo(.5,-c),e.lineTo(.5,c),e.lineTo(c,c),e.lineTo(c,.5),e.lineTo(-c,.5),e.lineTo(-c,c),e.lineTo(-.5,c),e.lineTo(-.5,-c),e.lineTo(-c,-c);break;case"star":for(let t=0;t<5;++t){let s=i/10+i/5*t,r=i/5*t;0==t?e.moveTo(n*Math.sin(r),n*Math.cos(r)):e.lineTo(n*Math.sin(r),n*Math.cos(r)),e.lineTo(o*Math.sin(s),o*Math.cos(s))}break;case"s2":for(let t=0;t<6;++t){let s=i/6*t,r=i/6*t-i/12;0==t?e.moveTo(n*Math.sin(r),n*Math.cos(r)):e.lineTo(n*Math.sin(r),n*Math.cos(r)),e.lineTo(o*Math.sin(s),o*Math.cos(s))}break;case"heart":const h=.6,d=h/Math.sqrt(2),u=.05;e.moveTo(d,u),e.lineTo(0,u+d),e.lineTo(0-d,u),e.arc(-d/2,u-d/2,h/2,3*i/8,7*i/8),e.arc(d/2,u-d/2,h/2,5*i/8,i/8)}e.closePath()}}}]);