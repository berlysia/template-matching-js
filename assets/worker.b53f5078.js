(function(){"use strict";function g({width:t}){return function(n,r){return(r*t+n)*4}}const T=(t,e,n,r,o)=>{const i=g(t),s=g(e),a=e.width*e.height;let l=0,v=0,_=0,P=0,b=0;for(let u=0,Y=e.height;u<Y;u++)for(let f=0,q=e.width;f<q;f++){const m=o(t,i(n+f,r+u)),y=o(e,s(f,u));l+=m**2,v+=m,_+=y**2,P+=y,b+=m*y}const E=v/a,S=P/a,W=b/a,G=l/a,L=_/a,I=W-E*S,R=G-E**2,X=L-S**2;return I/(Math.sqrt(R)*Math.sqrt(X))},C=(t,e)=>t.data[e]*.3+t.data[e+1]*.59+t.data[e+2]*.11;function*x(t,e,n,r){for(let o=n;o<r;++o)for(let i=t;i<e;++i)yield{pos:{x:i,y:o},meta:{}}}function*M(t,e){yield*x(e.offsetX,t.width-e.originW+e.offsetX,e.offsetY,t.height-e.originH+e.offsetY)}function F(t){const e=t.at(-1);if(e===void 0)throw new Error("something wrong: peekLast takes zero scores");return e}var p=function(t,e,n,r,o){if(r==="m")throw new TypeError("Private method is not writable");if(r==="a"&&!o)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!o:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return r==="a"?o.call(t,n):o?o.value=n:e.set(t,n),n},d=function(t,e,n,r){if(n==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?r:n==="a"?r.call(t):r?r.value:e.get(t)},c,w,h;class A{constructor(e=F){c.set(this,null),w.set(this,-1/0),h.set(this,void 0),p(this,h,e,"f")}retrieve(e,n){var r,o;const i=d(this,h,"f").call(this,((r=e.meta.scores)!==null&&r!==void 0?r:[]).concat(n));if(i>d(this,w,"f")){const s=structuredClone(e),a=(o=s.meta.scores)!==null&&o!==void 0?o:[];a.push(i),s.meta.scores=a,p(this,w,i,"f"),p(this,c,s,"f")}}first(){if(d(this,c,"f")===null)throw new Error("something wrong: result is null");return structuredClone(d(this,c,"f"))}all(){return[this.first()]}}c=new WeakMap,w=new WeakMap,h=new WeakMap;function j(t,e,n,r,o,i){const s=i();for(const a of o()){const l=n(t,e,a.pos.x,a.pos.y,r);s.retrieve(a,l)}return s}function O(t,e,n,r,o=()=>new A){return j(t,e,n,r,()=>M(t,{offsetX:0,offsetY:0,originW:e.width,originH:e.height}),o).first().pos}onmessage=t=>{const{base:e,temp:n}=t.data,r=O(new ImageData(new Uint8ClampedArray(e.data),e.width,e.height),new ImageData(new Uint8ClampedArray(n.data),n.width,n.height),T,C);postMessage(r)}})();