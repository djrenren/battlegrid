const t=()=>{document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`)};function i(t,i,e,s){var n,o=arguments.length,r=o<3?i:null===s?s=Object.getOwnPropertyDescriptor(i,e):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,i,e,s);else for(var h=t.length-1;h>=0;h--)(n=t[h])&&(r=(o<3?n(r):o>3?n(i,e,r):n(i,e))||r);return o>3&&r&&Object.defineProperty(i,e,r),r}function e(t,i,e,s){if("a"===e&&!s)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof i?t!==i||!s:!i.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===e?s:"a"===e?s.call(t):s?s.value:i.get(t)}function s(t,i,e,s,n){if("m"===s)throw new TypeError("Private method is not writable");if("a"===s&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof i?t!==i||!n:!i.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===s?n.call(t,e):n?n.value=e:i.set(t,e),e
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}window.addEventListener("resize",t),t();const n=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),r=new WeakMap;class h{constructor(t,i,e){if(this._$cssResult$=!0,e!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(n&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=r.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&r.set(i,t))}return t}toString(){return this.cssText}}const a=(t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,e,s)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[s+1]),t[0]);return new h(e,t,o)},l=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return(t=>new h("string"==typeof t?t:t+"",void 0,o))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var c;const d=window.trustedTypes,u=d?d.emptyScript:"",f=window.reactiveElementPolyfillSupport,p={toAttribute(t,i){switch(i){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},v=(t,i)=>i!==t&&(i==i||t==t),w={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:v};class g extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var i;null!==(i=this.h)&&void 0!==i||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,e)=>{const s=this._$Ep(e,i);void 0!==s&&(this._$Ev.set(s,e),t.push(s))})),t}static createProperty(t,i=w){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const e="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,e,i);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){return{get(){return this[i]},set(s){const n=this[t];this[i]=s,this.requestUpdate(t,n,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||w}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const e of i)this.createProperty(e,t[e])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(l(t))}else void 0!==t&&i.push(l(t));return i}static _$Ep(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,e;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(e=t.hostConnected)||void 0===e||e.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{n?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((i=>{const e=document.createElement("style"),s=window.litNonce;void 0!==s&&e.setAttribute("nonce",s),e.textContent=i.cssText,t.appendChild(e)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,e){this._$AK(t,e)}_$EO(t,i,e=w){var s,n;const o=this.constructor._$Ep(t,e);if(void 0!==o&&!0===e.reflect){const r=(null!==(n=null===(s=e.converter)||void 0===s?void 0:s.toAttribute)&&void 0!==n?n:p.toAttribute)(i,e.type);this._$El=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$El=null}}_$AK(t,i){var e,s;const n=this.constructor,o=n._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=n.getPropertyOptions(o),r=t.converter,h=null!==(s=null!==(e=null==r?void 0:r.fromAttribute)&&void 0!==e?e:"function"==typeof r?r:null)&&void 0!==s?s:p.fromAttribute;this._$El=o,this[o]=h(i,t.type),this._$El=null}}requestUpdate(t,i,e){let s=!0;void 0!==t&&(((e=e||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===e.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,e))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(e)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(e)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var b;g.finalized=!0,g.elementProperties=new Map,g.elementStyles=[],g.shadowRootOptions={mode:"open"},null==f||f({ReactiveElement:g}),(null!==(c=globalThis.reactiveElementVersions)&&void 0!==c?c:globalThis.reactiveElementVersions=[]).push("1.3.3");const m=globalThis.trustedTypes,y=m?m.createPolicy("lit-html",{createHTML:t=>t}):void 0,$=`lit$${(Math.random()+"").slice(9)}$`,k="?"+$,x=`<${k}>`,M=document,S=(t="")=>M.createComment(t),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,W=Array.isArray,E=t=>{var i;return W(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,A=/-->/g,_=/>/g,R=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,z=/'/g,U=/"/g,N=/^(?:script|style|textarea|title)$/i,O=t=>(i,...e)=>({_$litType$:t,strings:i,values:e}),I=O(1),j=O(2),P=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),D=new WeakMap,H=M.createTreeWalker(M,129,null,!1),B=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?"<svg>":"",r=T;for(let i=0;i<e;i++){const e=t[i];let h,a,l=-1,c=0;for(;c<e.length&&(r.lastIndex=c,a=r.exec(e),null!==a);)c=r.lastIndex,r===T?"!--"===a[1]?r=A:void 0!==a[1]?r=_:void 0!==a[2]?(N.test(a[2])&&(n=RegExp("</"+a[2],"g")),r=R):void 0!==a[3]&&(r=R):r===R?">"===a[0]?(r=null!=n?n:T,l=-1):void 0===a[1]?l=-2:(l=r.lastIndex-a[2].length,h=a[1],r=void 0===a[3]?R:'"'===a[3]?U:z):r===U||r===z?r=R:r===A||r===_?r=T:(r=R,n=void 0);const d=r===R&&t[i+1].startsWith("/>")?" ":"";o+=r===T?e+x:l>=0?(s.push(h),e.slice(0,l)+"$lit$"+e.slice(l)+$+d):e+$+(-2===l?(s.push(void 0),i):d)}const h=o+(t[e]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==y?y.createHTML(h):h,s]};class G{constructor({strings:t,_$litType$:i},e){let s;this.parts=[];let n=0,o=0;const r=t.length-1,h=this.parts,[a,l]=B(t,i);if(this.el=G.createElement(a,e),H.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(s=H.nextNode())&&h.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const i of s.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith($)){const e=l[o++];if(t.push(i),void 0!==e){const t=s.getAttribute(e.toLowerCase()+"$lit$").split($),i=/([.?@])?(.*)/.exec(e);h.push({type:1,index:n,name:i[2],strings:t,ctor:"."===i[1]?F:"?"===i[1]?Q:"@"===i[1]?Y:q})}else h.push({type:6,index:n})}for(const i of t)s.removeAttribute(i)}if(N.test(s.tagName)){const t=s.textContent.split($),i=t.length-1;if(i>0){s.textContent=m?m.emptyScript:"";for(let e=0;e<i;e++)s.append(t[e],S()),H.nextNode(),h.push({type:2,index:++n});s.append(t[i],S())}}}else if(8===s.nodeType)if(s.data===k)h.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf($,t+1));)h.push({type:7,index:n}),t+=$.length-1}n++}}static createElement(t,i){const e=M.createElement("template");return e.innerHTML=t,e}}function K(t,i,e=t,s){var n,o,r,h;if(i===P)return i;let a=void 0!==s?null===(n=e._$Cl)||void 0===n?void 0:n[s]:e._$Cu;const l=C(i)?void 0:i._$litDirective$;return(null==a?void 0:a.constructor)!==l&&(null===(o=null==a?void 0:a._$AO)||void 0===o||o.call(a,!1),void 0===l?a=void 0:(a=new l(t),a._$AT(t,e,s)),void 0!==s?(null!==(r=(h=e)._$Cl)&&void 0!==r?r:h._$Cl=[])[s]=a:e._$Cu=a),void 0!==a&&(i=K(t,a._$AS(t,i.values),a,s)),i}class J{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:e},parts:s}=this._$AD,n=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:M).importNode(e,!0);H.currentNode=n;let o=H.nextNode(),r=0,h=0,a=s[0];for(;void 0!==a;){if(r===a.index){let i;2===a.type?i=new V(o,o.nextSibling,this,t):1===a.type?i=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(i=new X(o,this,t)),this.v.push(i),a=s[++h]}r!==(null==a?void 0:a.index)&&(o=H.nextNode(),r++)}return n}m(t){let i=0;for(const e of this.v)void 0!==e&&(void 0!==e.strings?(e._$AI(t,e,i),i+=e.strings.length-2):e._$AI(t[i])),i++}}class V{constructor(t,i,e,s){var n;this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=e,this.options=s,this._$Cg=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=K(this,t,i),C(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==P&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):E(t)?this.S(t):this.$(t)}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==L&&C(this._$AH)?this._$AA.nextSibling.data=t:this.k(M.createTextNode(t)),this._$AH=t}T(t){var i;const{values:e,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=G.createElement(s.h,this.options)),s);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===n)this._$AH.m(e);else{const t=new J(n,this),i=t.p(this.options);t.m(e),this.k(i),this._$AH=t}}_$AC(t){let i=D.get(t.strings);return void 0===i&&D.set(t.strings,i=new G(t)),i}S(t){W(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let e,s=0;for(const n of t)s===i.length?i.push(e=new V(this.M(S()),this.M(S()),this,this.options)):e=i[s],e._$AI(n),s++;s<i.length&&(this._$AR(e&&e._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var e;for(null===(e=this._$AP)||void 0===e||e.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class q{constructor(t,i,e,s,n){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=n,e.length>2||""!==e[0]||""!==e[1]?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=L}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=K(this,t,i,0),o=!C(t)||t!==this._$AH&&t!==P,o&&(this._$AH=t);else{const s=t;let r,h;for(t=n[0],r=0;r<n.length-1;r++)h=K(this,s[e+r],i,r),h===P&&(h=this._$AH[r]),o||(o=!C(h)||h!==this._$AH[r]),h===L?t=L:t!==L&&(t+=(null!=h?h:"")+n[r+1]),this._$AH[r]=h}o&&!s&&this.C(t)}C(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class F extends q{constructor(){super(...arguments),this.type=3}C(t){this.element[this.name]=t===L?void 0:t}}const Z=m?m.emptyScript:"";class Q extends q{constructor(){super(...arguments),this.type=4}C(t){t&&t!==L?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class Y extends q{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}_$AI(t,i=this){var e;if((t=null!==(e=K(this,t,i,0))&&void 0!==e?e:L)===P)return;const s=this._$AH,n=t===L&&s!==L||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==L&&(s===L||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,e;"function"==typeof this._$AH?this._$AH.call(null!==(e=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==e?e:this.element,t):this._$AH.handleEvent(t)}}class X{constructor(t,i,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const tt={L:"$lit$",P:$,V:k,I:1,N:B,R:J,j:E,D:K,H:V,F:q,O:Q,W:Y,B:F,Z:X},it=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et,st;null==it||it(G,V),(null!==(b=globalThis.litHtmlVersions)&&void 0!==b?b:globalThis.litHtmlVersions=[]).push("2.2.6");class nt extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const e=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=e.firstChild),e}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,e)=>{var s,n;const o=null!==(s=null==e?void 0:e.renderBefore)&&void 0!==s?s:i;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==e?void 0:e.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new V(i.insertBefore(S(),t),t,void 0,null!=e?e:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return P}}nt.finalized=!0,nt._$litElement$=!0,null===(et=globalThis.litElementHydrateSupport)||void 0===et||et.call(globalThis,{LitElement:nt});const ot=globalThis.litElementPolyfillSupport;null==ot||ot({LitElement:nt}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt=t=>i=>"function"==typeof i?((t,i)=>(window.customElements.define(t,i),i))(t,i):((t,i)=>{const{kind:e,elements:s}=i;return{kind:e,elements:s,finisher(i){window.customElements.define(t,i)}}})(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ht=(t,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(e){e.createProperty(i.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(e){e.createProperty(i.key,t)}};function at(t){return(i,e)=>void 0!==e?((t,i,e)=>{i.constructor.createProperty(e,t)})(t,i,e):ht(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function lt(t){return at({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ct(t,i){return(({finisher:t,descriptor:i})=>(e,s)=>{var n;if(void 0===s){const s=null!==(n=e.originalKey)&&void 0!==n?n:e.key,o=null!=i?{kind:"method",placement:"prototype",key:s,descriptor:i(e.key)}:{...e,key:s};return null!=t&&(o.finisher=function(i){t(i,s)}),o}{const n=e.constructor;void 0!==i&&Object.defineProperty(e,s,i(s)),null==t||t(n,s)}})({descriptor:e=>{const s={get(){var i,e;return null!==(e=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==e?e:null},enumerable:!0,configurable:!0};if(i){const i="symbol"==typeof e?Symbol():"__"+e;s.get=function(){var e,s;return void 0===this[i]&&(this[i]=null!==(s=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==s?s:null),this[i]}}return s}})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var dt;null===(dt=window.HTMLSlotElement)||void 0===dt||dt.prototype.assignedElements;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut=2;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{H:ft}=tt,pt=()=>document.createComment(""),vt=(t,i,e)=>{var s;const n=t._$AA.parentNode,o=void 0===i?t._$AB:i._$AA;if(void 0===e){const i=n.insertBefore(pt(),o),s=n.insertBefore(pt(),o);e=new ft(i,s,t,t.options)}else{const i=e._$AB.nextSibling,r=e._$AM,h=r!==t;if(h){let i;null===(s=e._$AQ)||void 0===s||s.call(e,t),e._$AM=t,void 0!==e._$AP&&(i=t._$AU)!==r._$AU&&e._$AP(i)}if(i!==o||h){let t=e._$AA;for(;t!==i;){const i=t.nextSibling;n.insertBefore(t,o),t=i}}}return e},wt=(t,i,e=t)=>(t._$AI(i,e),t),gt={},bt=t=>{var i;null===(i=t._$AP)||void 0===i||i.call(t,!1,!0);let e=t._$AA;const s=t._$AB.nextSibling;for(;e!==s;){const t=e.nextSibling;e.remove(),e=t}},mt=(t,i,e)=>{const s=new Map;for(let n=i;n<=e;n++)s.set(t[n],n);return s},yt=(t=>(...i)=>({_$litDirective$:t,values:i}))(class extends class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,e){this._$Ct=t,this._$AM=i,this._$Ci=e}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}{constructor(t){if(super(t),t.type!==ut)throw Error("repeat() can only be used in text expressions")}dt(t,i,e){let s;void 0===e?e=i:void 0!==i&&(s=i);const n=[],o=[];let r=0;for(const i of t)n[r]=s?s(i,r):r,o[r]=e(i,r),r++;return{values:o,keys:n}}render(t,i,e){return this.dt(t,i,e).values}update(t,[i,e,s]){var n;const o=(t=>t._$AH)(t),{values:r,keys:h}=this.dt(i,e,s);if(!Array.isArray(o))return this.ut=h,r;const a=null!==(n=this.ut)&&void 0!==n?n:this.ut=[],l=[];let c,d,u=0,f=o.length-1,p=0,v=r.length-1;for(;u<=f&&p<=v;)if(null===o[u])u++;else if(null===o[f])f--;else if(a[u]===h[p])l[p]=wt(o[u],r[p]),u++,p++;else if(a[f]===h[v])l[v]=wt(o[f],r[v]),f--,v--;else if(a[u]===h[v])l[v]=wt(o[u],r[v]),vt(t,l[v+1],o[u]),u++,v--;else if(a[f]===h[p])l[p]=wt(o[f],r[p]),vt(t,o[u],o[f]),f--,p++;else if(void 0===c&&(c=mt(h,p,v),d=mt(a,u,f)),c.has(a[u]))if(c.has(a[f])){const i=d.get(h[p]),e=void 0!==i?o[i]:null;if(null===e){const i=vt(t,o[u]);wt(i,r[p]),l[p]=i}else l[p]=wt(e,r[p]),vt(t,o[u],e),o[i]=null;p++}else bt(o[f]),f--;else bt(o[u]),u++;for(;p<=v;){const i=vt(t,l[v+1]);wt(i,r[p]),l[p++]=i}for(;u<=f;){const t=o[u++];null!==t&&bt(t)}return this.ut=h,((t,i=gt)=>{t._$AH=i})(t,l),P}}),$t=(t,i)=>[t[0]+i[0],t[1]+i[1]],kt=(t,i)=>$t(t,[i,i]),xt=(t,i)=>[t[0]-i[0],t[1]-i[1]],Mt=(t,i)=>[t[0]*i,t[1]*i],St=(t,i)=>[t[0]/i,t[1]/i],Ct=(t,i)=>[Math.max(t[0],i[0]),Math.max(t[1],i[1])],Wt=(t,i)=>[Math.min(t[0],i[0]),Math.min(t[1],i[1])],Et=(t,i,e)=>Ct(t,Wt(i,e)),Tt=(t,i)=>t[0]===i[0]&&t[1]===i[1],At=t=>t.isPrimary&&("touch"===t.pointerType||t.pressure>0),_t=t=>"mouse"===t.pointerType&&1===t.buttons&&t.pressure>0,Rt=t=>{t.preventDefault(),t.stopPropagation()},zt=(t,i)=>new CustomEvent(t,{detail:i});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ut(t,i){return new Promise((e=>{i.addEventListener(t,e,{once:!0})}))}const Nt=async t=>{let i=t.dataTransfer?.items??[];return new Promise((async(t,e)=>{console.log("DataItems",i.length);for(let e=0;e<i.length;e++){if(console.log(i[e].type),i[e].type.startsWith("image/"))return t(i[e].getAsFile());if("text/html"===i[e].type)return void i[e].getAsString((i=>t(Ot(i))));if("application/x-moz-file-promise-url"===i[e].type)return void i[e].getAsString((t=>{}));if("string"===i[e].kind){let t=i[e].type;i[e].getAsString((i=>console.log(t,i)))}}return e("No compatible drop type found")}))};function Ot(t){const i=(new DOMParser).parseFromString(t,"text/html").querySelector("img")?.src;return i??null}const It=t=>new CustomEvent("game-event",{detail:t});class jt{constructor(){this.order=[],this.map=new Map}get(t){const i=this.map.get(t);if(void 0!==i)return this.order[i]}has(t){return this.map.has(t)}add(t,i){this.map.set(t,this.order.length),this.order.push(i)}delete(t){const i=this.map.get(t);return void 0!==i&&(this.order.splice(i,1),this.map.delete(t),this.map.forEach(((t,e)=>{t>=i&&this.map.set(e,t-1)})),!0)}index(t){return this.map.get(t)}set_index(t,i){const e=this.map.get(t);if(void 0===e||i>=this.order.length)return!1;const s=this.order.splice(e,1)[0];return this.order.splice(i,0,s),this.map.forEach(((t,e)=>{t>=i&&this.map.set(e,t+1)})),this.map.set(t,i),!0}values(){return this.order}get size(){return this.map.size}}const Pt=t=>t[Symbol.iterator]().next().value;function*Lt(t,i){for(let e of t)yield i(e)}var Dt,Ht,Bt,Gt,Kt,Jt,Vt,qt,Ft,Zt,Qt,Yt,Xt,ti,ii,ei,si,ni,oi,ri,hi,ai,li;let ci=class extends nt{constructor(){super(),Dt.add(this),this.width=30,this.height=40,this.tokens=new jt,this.selection=new Set,this.callouts=new Set,Ht.set(this,void 0),Bt.set(this,void 0),Kt.set(this,0),Jt.set(this,(t=>{var i;Rt(t),s(this,Kt,(i=e(this,Kt,"f"),++i),"f")})),Vt.set(this,(t=>{Rt(t);const i=e(this,ai,"f").call(this,t).map(ui),s=Mt(kt([this.width,this.height],-1),24);this._drop_hint=Et([0,0],s,i),this.hovering="canvas"})),qt.set(this,(t=>{var i;s(this,Kt,(i=e(this,Kt,"f"),--i),"f")<=0&&(this._drop_hint=void 0,this.hovering=void 0)})),Ft.set(this,(t=>{Rt(t),this._drop_hint=void 0,this.hovering="bg"})),Zt.set(this,(async t=>{Rt(t);try{const i=await Nt(t);this.dispatchEvent(zt("bg-drop",i))}catch(t){}s(this,Kt,0,"f"),this.hovering=void 0})),Qt.set(this,(async t=>{Rt(t);try{const i=await Nt(t);this.dispatchEvent(zt("token-drop",{loc:this._drop_hint,dim:[24,24],img:i}))}catch(t){}this._drop_hint=void 0,this.hovering=void 0})),Yt.set(this,(t=>{if(!_t(t))return;t.preventDefault(),t.stopPropagation();const i=t.target.id;t.shiftKey||t.ctrlKey?this.dispatchEvent(zt("token-select",[i,...this.selection].filter((t=>t!==i||!this.selection.has(i))))):this.dispatchEvent(zt("token-select",[t.target.id]))})),si.set(this,void 0),ni.set(this,(t=>{if(!At(t))return;const i=e(this,ai,"f").call(this,t);Rt(t),t.target.setPointerCapture(t.pointerId),s(this,si,i,"f")})),oi.set(this,{move:[0,0],resize:[0,0],r:0}),ri.set(this,(t=>{if(!At(t))return;e(this,si,"f")||e(this,ni,"f").call(this,t),Rt(t);const i=Et([0,0],e(this,Dt,"a",Gt),e(this,ai,"f").call(this,t)),n=this.tokens.get(this.selection.values().next().value),o=n.dim,r=n.loc,h=t.target.classList;let a=[0,0],l=[0,0],c=0;if(h.contains("rn")&&(l[1]=r[1]-di(i[1]),a[1]=di(i[1])-r[1]),h.contains("rw")&&(l[0]=r[0]-di(i[0]),a[0]=di(i[0])-r[0]),h.contains("rs")&&(l[1]=di(i[1])-o[1]-r[1]),h.contains("re")&&(l[0]=di(i[0])-o[0]-r[0]),h.contains("ro")){const t=$t(r,St(o,2)),e=xt(i,t),s=180*Math.atan2(e[0],-e[1])/Math.PI;c=90*Math.round(s/90)-n.r%360}h.contains("selection-drag-target")?(console.log("move"),a=xt(i,e(this,si,"f")).map(di)):(a=Wt(kt(o,-24),a),l=Ct(kt(Mt(o,-1),24),l)),c===e(this,oi,"f").r&&Tt(a,e(this,oi,"f").move)&&Tt(l,e(this,oi,"f").resize)||(s(this,si,$t(e(this,si,"f"),a),"f"),s(this,oi,{move:[0,0],resize:[0,0],r:0},"f"),this.dispatchEvent(It({type:"token-manipulated",tokens:Array.from(this.selection,(t=>{let i=this.tokens.get(t);return{id:i.id,loc:$t(i.loc,a),dim:$t(i.dim,l),r:i.r+c}}))})))})),hi.set(this,(t=>{Rt(t),s(this,si,void 0,"f")})),ai.set(this,(t=>xt(this.viewport.coordToLocal([t.clientX,t.clientY]),[20,20]))),li.set(this,(t=>{if(!this.selection)return;if(8===t.keyCode)return this.dispatchEvent(It({type:"token-removed",ids:Array.from(this.selection)})),void Rt(t);"z"===t.key&&e(this,Bt,"f")&&this.dispatchEvent(It({type:"callout",loc:e(this,ai,"f").call(this,e(this,Bt,"f"))})),this.tokens.get(this.selection.values().next().value);let i={ArrowUp:[0,-24],ArrowDown:[0,24],ArrowLeft:[-24,0],ArrowRight:[24,0]}[t.key];i&&(this.dispatchEvent(It({type:"token-manipulated",tokens:Array.from(this.selection,(t=>{const s=this.tokens.get(t),n=Et([0,0],xt(e(this,Dt,"a",Gt),s.dim),$t(s.loc,i));return{id:s.id,loc:n,dim:s.dim,r:s.r}}))})),Rt(t))}))}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",e(this,li,"f"))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",e(this,li,"f"))}render(){let[t,i]=e(this,Dt,"a",Gt),n=e(this,Dt,"m",ei).call(this),o=1===this.selection.size?this.tokens.get(this.selection.values().next().value):void 0;return I`
      <p-p-z
        @pointerdown=${e(this,Dt,"m",Xt)}
        @pointermove=${e(this,Dt,"m",ti)}
        @pointerup=${e(this,Dt,"m",ii)}
        @pointerleave=${()=>s(this,Bt,void 0,"f")}
        @dragstart=${Rt}
        @dragenter=${e(this,Jt,"f")}
        @dragleave=${e(this,qt,"f")}
        @dragstop=${e(this,qt,"f")}
        @dragover=${e(this,Vt,"f")}
        @drop=${e(this,Qt,"f")}
      >
        <svg id="root" width=${t+40} height=${i+40}>
          <defs>
            <clipPath id="canvasClip">
              <rect width=${t} height=${i} rx=${5}></rect>
            </clipPath>
            <pattern id="horiz" x=${-.25} y=${-.25} width="100%" height=${24} patternUnits="userSpaceOnUse">
              <rect class="gridline" width="100%" height=${.5} fill="#d3d3d3"></rect>
            </pattern>
            <pattern id="vert" x=${-.25} y=${-.25} width=${24} height="100%" patternUnits="userSpaceOnUse">
              <rect class="gridline" width=${.5} height="100%" fill="#d3d3d3"></rect>
            </pattern>
            <pattern id="loading" patternUnits="userSpaceOnUse" width="1" height="1">
              <rect width="1" height="1" fill="white"></rect>
              <image href="assets/loading.svg" width="1" height="1" />
            </pattern>
          </defs>
          <svg x=${20} y=${20} width=${t} height=${i} id="surface">
            <rect class="shadow" width="100%" height="100%" fill="white" rx=${5}></rect>
            <svg clip-path="url(#canvasClip)">
              ${this.bg?j`<image href=${this.bg} width="100%" height="100%" preserveAspectRatio="none" style="will-change: transform"></image>`:null}
              <rect width="100%" height="100%" fill="url(#horiz)" opacity="0.75" pointer-events="none"></rect>
              <rect width="100%" height="100%" fill="url(#vert)" opacity="0.75" pointer-events="none"></rect>
              <svg id="tokens">
                ${yt(this.tokens.values(),(t=>t.id),((t,i)=>{const[s,o]=kt(t.dim,-.5),[r,h]=kt(t.loc,.25);return I`
                      <svg viewBox="0 0 1 1" x=${r} y=${h} width=${s} height=${o} fill="transparent" preserveAspectRatio="none">
                        <image
                          id=${t.id}
                          class="token"
                          width="1"
                          height="1"
                          href=${t.url}
                          style=${`transform: rotate(${t.r}deg)`}
                          image-rendering="optimizeSpeed"
                          preserveAspectRatio="none"
                          @pointerdown=${e(this,Yt,"f")}
                          @load=${fi}
                        ></image>
                        <rect width="1" height="1" class="loading"></rect>
                      </svg>

                      ${n?.index===i?j`<rect
                            class="selection-drag-target"
                            x=${n.bbox.start[0]}
                            y=${n.bbox.start[1]}
                            width=${n.bbox.end[0]-n.bbox.start[0]}
                            height=${n.bbox.end[1]-n.bbox.start[1]}
                            fill="transparent"
                            @pointerdown=${e(this,ni,"f")}
                            @pointermove=${e(this,ri,"f")}
                            @pointerup=${e(this,hi,"f")}
                        ></rect>`:null}
                    `}))}
              </svg>
              ${this._drop_hint?j`
            <rect
                class="drop_hint"
                x=${this._drop_hint[0]}
                y=${this._drop_hint[1]}
                width=${24}
                height=${24}
                ></rect>
          `:null}
            </svg>
            ${e(this,Ht,"f")?j`
              <rect id="sbox"
                x=${Math.min(e(this,Ht,"f").pin[0],e(this,Ht,"f").mouse[0])}
                y=${Math.min(e(this,Ht,"f").pin[1],e(this,Ht,"f").mouse[1])}
                width=${Math.abs(e(this,Ht,"f").pin[0]-e(this,Ht,"f").mouse[0])}
                height=${Math.abs(e(this,Ht,"f").pin[1]-e(this,Ht,"f").mouse[1])}
                ></rect>
              `:null}
            ${yt(this.callouts,(t=>t),(t=>{const[i,e]=xt(t,[12,12]);return j`
                  <image href="assets/callout.svg" x=${i} y=${e} width=${24} height=${24}></image>
                `}))}
            ${n?j`
            <svg
              id="selection"
              x=${n.bbox.start[0]}
              y=${n.bbox.start[1]}
              width=${n.bbox.end[0]-n.bbox.start[0]}
              height=${n.bbox.end[1]-n.bbox.start[1]}
              @pointerdown=${e(this,ni,"f")}
              @pointermove=${e(this,ri,"f")}
              @pointerup=${e(this,hi,"f")}>
              <rect class="selection-box" width="100%" height="100%"  ></rect>
            ${o?j`
            <g style=${`transform-origin: center; transform: rotate(${o.r}deg) translateY(${Math.sign((o.r-180)%180)*(o.dim[0]-o.dim[1])/2}px)`}>
              <line class="ro" x1="50%" x2="50%" y2=${-10}></line>
              <circle class="ro handle" cx="50%" cy=${-10} r=${2}></circle>
            </g>
            <line class="rn" x2="100%"></line>
            <line class="rw" y2="100%"></line>
            <line class="re" x1="100%" x2="100%" y2="100%"></line>
            <line class="rs" y1="100%" x2="100%" y2="100%"></line>
            <rect class="handle rn rw"></rect>
            <rect class="handle rn re" x="100%"></rect>
            <rect class="handle rs rw" y="100%"></rect>
            <rect class="handle rs re" x="100%" y="100%"></rect>
            </g>
            </svg>`:null}`:null}
          </svg>
        </svg>
      </p-p-z>
      <div
        id="bg-drop"
        class=${this.hovering??""}
        @dragenter=${e(this,Jt,"f")}
        @dragover=${e(this,Ft,"f")}
        @dragleave=${e(this,qt,"f")}
        @drop=${e(this,Zt,"f")}
      >
        <div id="bg-drop-label" @drop=${e(this,Zt,"f")}>Set Background</div>
      </div>
    `}createRenderRoot(){return super.createRenderRoot()}};Ht=new WeakMap,Bt=new WeakMap,Kt=new WeakMap,Jt=new WeakMap,Vt=new WeakMap,qt=new WeakMap,Ft=new WeakMap,Zt=new WeakMap,Qt=new WeakMap,Yt=new WeakMap,si=new WeakMap,ni=new WeakMap,oi=new WeakMap,ri=new WeakMap,hi=new WeakMap,ai=new WeakMap,li=new WeakMap,Dt=new WeakSet,Gt=function(){return Mt([this.width,this.height],24)},Xt=function(t){if(!_t(t))return;t.target.setPointerCapture(t.pointerId);const i=e(this,ai,"f").call(this,t);s(this,Ht,{pin:i,mouse:i},"f")},ti=function(t){s(this,Bt,{clientX:t.clientX,clientY:t.clientY},"f"),e(this,Ht,"f")&&(e(this,Ht,"f").mouse=e(this,ai,"f").call(this,t),this.requestUpdate())},ii=function(t){if(!e(this,Ht,"f"))return;t.target.setPointerCapture(t.pointerId);const i=Wt(e(this,Ht,"f").pin,e(this,Ht,"f").mouse),n=(t=>[Math.abs(t[0]),Math.abs(t[1])])(xt(e(this,Ht,"f").pin,e(this,Ht,"f").mouse)),o={start:i,end:$t(i,n)},r=this.tokens.order.filter((t=>((t,i)=>!(i.start[0]>t.end[0]||i.end[0]<t.start[0]||i.start[1]>t.end[1]||i.end[1]<t.start[1]))(o,{start:t.loc,end:$t(t.loc,t.dim)}))).map((t=>t.id));s(this,Ht,void 0,"f"),this.dispatchEvent(zt("token-select",r)),this.requestUpdate()},ei=function(){if(0===this.selection.size)return;const t=Array.from(this.selection,(t=>this.tokens.get(t))).filter((t=>t)),i=Math.max(...Lt(this.selection.values(),(t=>this.tokens.index(t))));let e=t[0].loc,s=$t(t[0].loc,t[0].dim);return t.forEach((t=>{e=Wt(e,t.loc),s=Ct(s,$t(t.loc,t.dim))})),{index:i,bbox:{start:e,end:s}}},ci.styles=a`
    :host {
      position: relative;
      display: block;
      --selection-color: cornflowerblue;
      overflow: hidden;
    }

    p-p-z {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    #root {
      backface-visibility: hidden;
    }

    #sbox {
      stroke: var(--selection-color);
      stroke-width: 1px;
      fill: var(--selection-color);
      fill-opacity: 0.2;
    }

    #bg-drop {
      position: absolute;
      right: 5px;
      bottom: -60px;
      display: inline-block;
      height: 50px;
      transition: bottom 250ms;
      background: var(--ui-bg);
      border-radius: 5px 5px 0 0;
      display: grid;
      padding: 5px;
      grid: 1fr 1fr;
      text-align: center;
      display: none;
    }

    #bg-drop.canvas,
    #bg-drop.bg {
      bottom: 0;
      box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
      display: block;
    }

    #bg-drop-label {
      --color: gray;
      padding: 0 1em;
      border: 2px solid var(--color);
      color: var(--color);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .bg > #bg-drop-label {
      --color: blue;
    }

    svg {
      overflow: visible;
    }

    #surface {
      clip-path: rect(100%);
    }

    .shadow {
      stroke-width: ${.5};
      stroke: rgba(0, 0, 0, 0.2);
      filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
    }

    .drop_hint {
      transition: none;
      pointer-events: none;
      fill: gray;
    }

    .selection-box,
    line.ro {
      stroke: var(--selection-color);
      stroke-width: 1px;
      filter: drop-shadow(0px 0px 2px var(--selection-color));
      fill: transparent;
    }

    .selection-box {
      pointer-events: none !important;
    }

    .rn,
    .rs,
    .re,
    .rw {
      stroke-width: ${8};
      vector-effect: non-scaling-stroke;
      stroke: transparent;
    }

    .handle {
      stroke-width: 1px;
      fill: var(--selection-color);
      stroke: white;
    }

    .selection-drag-target {
      pointer-events: fill;
      cursor: move;
    }

    rect.handle {
      width: ${8}px;
      height: ${8}px;
      transform: translate(${-4}px, ${-4}px);
    }

    .ro.handle {
      cursor: crosshair;
    }

    .rn.re,
    .rs.rw {
      cursor: nesw-resize;
    }

    .rn.rw,
    .rs.re {
      cursor: nwse-resize;
    }

    .rn,
    .rs {
      cursor: row-resize;
    }

    .re,
    .rw {
      cursor: col-resize;
    }

    p-p-z {
      background-color: #ededf0;
    }

    bg-viewport::part(bar) {
      background: rgb(75, 75, 75);
      border: 1px solid white;
      opacity: 0.75;
      --thickness: 10px;
    }

    bg-viewport::part(bar):hover {
      opacity: 1;
    }

    .token {
      transform-box: fill-box;
      transform-origin: center;
      fill: transparent;
    }

    .token + .loading {
      fill: url(#loading);
      pointer-events: none;
    }

    .token.loaded + .loading {
      fill: transparent;
    }

    #selection {
      pointer-events: none;
    }

    #selection * {
      pointer-events: auto;
    }
  `,i([at({type:Number})],ci.prototype,"width",void 0),i([at({type:Number})],ci.prototype,"height",void 0),i([at()],ci.prototype,"bg",void 0),i([at({attribute:!1})],ci.prototype,"tokens",void 0),i([at({attribute:!1})],ci.prototype,"selection",void 0),i([at({attribute:!1})],ci.prototype,"callouts",void 0),i([at({attribute:!1})],ci.prototype,"sel_bbox",void 0),i([ct("root",!0)],ci.prototype,"root",void 0),i([ct("p-p-z",!0)],ci.prototype,"viewport",void 0),i([lt()],ci.prototype,"_drop_hint",void 0),i([lt()],ci.prototype,"hovering",void 0),ci=i([rt("bg-canvas")],ci);const di=t=>24*Math.round(t/24),ui=t=>t-t%24,fi=t=>t.target.classList.add("loaded");var pi,vi;let wi=class extends nt{constructor(){super(...arguments),this._state=!1,this._loaded=!1,this._buy=t=>{console.log("CLICK"),Rt(t),this._state=!0,document.addEventListener("click",e(this,pi,"f"),{capture:!0})},pi.set(this,(t=>{Rt(t),this._state=!1,document.removeEventListener("click",e(this,pi,"f"),{capture:!0})})),vi.set(this,(t=>{this._loaded=!0}))}render(){return I`<button @click="${this._buy}">Buy Me A Coffee</button> ${this._state?I`<div id="container"><iframe class="${this._loaded?"loaded":""}" allow="payment" src="https://ko-fi.com/djrenren/?hidefeed=true&widget=true&embed=true&preview=true" title="djrenren" @load="${e(this,vi,"f")}"></iframe></div>`:null}`}};async function gi(t,i){return t.pipeTo(new WritableStream({write:i}))}function bi(t){let i=new TransformStream({transform(t,i){i.enqueue(JSON.stringify(t))}});return i.readable.pipeTo(t.writable),{readable:t.readable.pipeThrough(new TransformStream({transform(t,i){i.enqueue(JSON.parse(t))}})),writable:i.writable}}pi=new WeakMap,vi=new WeakMap,wi.styles=a`:host{display:block;position:relative}iframe{border:none;display:block;opacity:0;width:100%;height:100%;transition:opacity .5s linear}#container{border-radius:5px;box-shadow:0 0 6px rgba(0,0,0,.7);position:absolute;width:350px;height:525px;bottom:-535px;right:0;animation-name:fade;animation-duration:.5s;animation-direction:backwards;background:url(assets/loading.svg) center/100px no-repeat,#ededf0;overflow:hidden}iframe.loaded{opacity:1}@keyframes fade{0%{opacity:0}100%{opacity:1}}`,i([lt()],wi.prototype,"_state",void 0),i([lt()],wi.prototype,"_loaded",void 0),wi=i([rt("buy-me-a-coffee")],wi);const mi=t=>JSON.stringify({...t,tokens:[...Lt(t.tokens.values(),(t=>({...t})))]});var yi,$i,ki,xi;class Mi extends EventTarget{constructor(){super(),yi.add(this),this.tabletop={tokens:new jt,grid_dim:[30,20],bg:null},this.callouts=new Set,$i.set(this,void 0);const t=new TransformStream;s(this,$i,t.writable.getWriter(),"f"),gi(t.readable,(t=>e(this,yi,"m",ki).call(this,t)))}async set_bg(t){const i=t?await e(this,yi,"m",xi).call(this,t):null;this.apply({type:"bg",url:i})}async add_token(t,i){const s={id:crypto.randomUUID(),url:await e(this,yi,"m",xi).call(this,t),...i};this.apply({type:"token-added",...s})}set_dim(t){this.apply({type:"grid-resized",dim:t})}async apply(t){await e(this,$i,"f").write(t)}}$i=new WeakMap,yi=new WeakSet,ki=async function(t){switch(t.type){case"token-manipulated":for(let i of t.tokens){let t=this.tabletop.tokens.get(i.id);if(!t)return void console.error("Update received for nonexistant token",i.id);Object.assign(t,{dim:i.dim,loc:i.loc,r:i.r})}break;case"token-added":let i={id:t.id,dim:t.dim,loc:t.loc,url:t.url,r:0};this.tabletop.tokens.add(t.id,i);break;case"grid-resized":this.tabletop.grid_dim=t.dim;break;case"token-removed":for(let i of t.ids){const t=this.tabletop.tokens.get(i);if(!t)return void console.error("Tried to remove nonexistant token",i);this.tabletop.tokens.delete(t.id)}break;case"state-sync":this.tabletop=(t=>{let i=JSON.parse(t),e=new jt;return i.tokens.forEach((t=>e.add(t.id,t))),{...i,tokens:e}})(t.tabletop);break;case"token-reorder":const e=this.tabletop.tokens.index(t.id);if(void 0===e)return void console.error("Tried to reorder non-existant token",t.id);let s;s="top"===t.idx?this.tabletop.tokens.size-1:"bottom"===t.idx?0:"up"===t.idx?Math.min(this.tabletop.tokens.size-1,e+1):Math.max(0,e-1),this.tabletop.tokens.set_index(t.id,s);break;case"bg":this.tabletop.bg=t.url;break;case"callout":this.callouts.add(t.loc),setTimeout((()=>{this.callouts.delete(t.loc)}),1500)}this.dispatchEvent(It(t))},xi=async function(t){if("string"==typeof t)return t;let i=new URL(window.location.toString());i.search="";let e=crypto.randomUUID();i.pathname=`/resources/${e}`;let s=await caches.open("resources");return await s.put(i,new Response(t)),i.toString()};const Si=t=>({readable:Ci(t),writable:Wi(t)}),Ci=t=>new ReadableStream({start(i){t.onmessage=({data:t})=>{console.log("RECEIVED",t),i.enqueue(t)};const e=()=>{i.close(),t.removeEventListener("close",e)};t.addEventListener("close",e)},cancel(){t.close()}}),Wi=t=>{let i;return t.addEventListener("error",(t=>console.log("DC ERROR",t))),new WritableStream({start(e){const s=()=>{console.log("stream closed by dc ending"),e.error("Closed foo"),t.removeEventListener("close",s)};t.addEventListener("close",s),t.onopen=()=>i&&i(),t.onbufferedamountlow=()=>i&&i()},async write(e){("connecting"===t.readyState||t.bufferedAmount>t.bufferedAmountLowThreshold)&&(console.log("waiting for resumptoin..."),await new Promise(((t,e)=>i=t)),console.log("resumed!")),console.log("writing",e),t.send(e)},abort(){console.log("aborted dc by stream"),t.close()},close(){console.log("closed dc by stream"),t.close()}},new CountQueuingStrategy({highWaterMark:1}))};var Ei,Ti,Ai,_i,Ri,zi,Ui,Ni,Oi;class Ii{constructor(t,i){Ei.set(this,void 0),this.ondatachannel=t=>{},this.id=t,this.rtc=i,this.events_dc=i.createDataChannel("events",{negotiated:!0,id:1});let{readable:e,writable:n}=bi(Si(this.events_dc));this.events=e,s(this,Ei,n.getWriter(),"f"),this.rtc.ondatachannel=t=>this.ondatachannel(t)}write_event(t){return t.remote=this.id,e(this,Ei,"f").write(t)}datachannel(t,i){return new Promise(((e,s)=>{let n=this.rtc.createDataChannel(t,i);n.addEventListener("open",(()=>{n.removeEventListener("error",s),e(n)}),{once:!0}),n.addEventListener("error",s,{once:!0})}))}}Ei=new WeakMap;const ji={iceServers:[{urls:"stun:stun.l.google.com:19302"}]},Pi=new URL("wss://battlegrid-signaling.herokuapp.com");class Li{constructor(t,i){Ti.add(this),Ai.set(this,new Map),_i.set(this,void 0),Ri.set(this,void 0),zi.set(this,void 0),Ui.set(this,void 0),s(this,_i,t,"f"),this.peer_id=i;const n=new TransformStream;this.incoming_peers=n.readable,s(this,Ri,n.writable.getWriter(),"f"),s(this,zi,e(this,_i,"f").writable.getWriter(),"f"),s(this,Ui,new AbortController,"f"),e(this,Ti,"m",Oi).call(this)}static async establish(t=Pi,i=crypto.randomUUID()){t.pathname=i;let e=await async function(t){let i,e=await t(),s=e.writable.getWriter(),n=e.readable.getReader(),o=async()=>i||(i=(async()=>{e=await t(),s=e.writable.getWriter(),n=e.readable.getReader(),i=void 0})()),r=new WritableStream({async write(t,i){let e=!1;for(;!e;)try{await s.write(t),e=!0}catch(t){await o()}},async close(){await s.close()},async abort(t){await s.abort(t)}},new CountQueuingStrategy({highWaterMark:50}));return{readable:new ReadableStream({async pull(t){let i=!0;for(;i;)try{let{done:e,value:s}=await n.read();e?(console.log("HUH"),await o()):t.enqueue(s),i=!1}catch(t){await o()}},async cancel(t){await n.cancel(t)}}),writable:r}}((async()=>bi(function(t){const i=new ReadableStream({start(i){t.onmessage=({data:t})=>i.enqueue(t),t.onclose=t=>{i.error(t.reason)}},cancel(){t.close()}}),e=new WritableStream({start(i){t.onclose=t=>i.error(t.reason),t.addEventListener("open",(()=>{}),{once:!0})},async write(i){t.readyState!==WebSocket.OPEN&&await new Promise((i=>t.addEventListener("open",(()=>i()),{once:!0}))),t.send(i)},abort(){t.close()},close(){t.close()}});return{readable:i,writable:e}}(await async function(t){return t.readyState===WebSocket.OPEN?t:new Promise(((i,e)=>{t.addEventListener("error",e,{once:!0}),t.addEventListener("open",(()=>{t.removeEventListener("close",e),i(t)}),{once:!0})}))}(new WebSocket(t))))));return new Li(e,i)}async initiate(t){let i=e(this,Ti,"m",Ni).call(this,t),s=await i.rtc.createOffer();return await i.rtc.setLocalDescription(s),e(this,zi,"f").write({type:"offer",from:this.peer_id,to:t,offer:s}),await Promise.race([Ut("open",i.events_dc),Ut("close",i.events_dc).then((()=>{throw new Error("Unable to connect to host")}))]),i}async shutdown(){try{e(this,Ui,"f").abort("shutting down signaler")}catch{}await e(this,zi,"f").close()}}Ai=new WeakMap,_i=new WeakMap,Ri=new WeakMap,zi=new WeakMap,Ui=new WeakMap,Ti=new WeakSet,Ni=function(t){let i=new Ii(t,new RTCPeerConnection(ji));e(this,Ai,"f").set(t,i);const s=({candidate:i})=>{null!==i&&e(this,zi,"f").write({type:"icecandidate",from:this.peer_id,to:t,candidate:i})};i.rtc.addEventListener("icecandidate",s);const n=async()=>{i.rtc.removeEventListener("icecandidate",s),e(this,Ai,"f").delete(t)};return i.events_dc.addEventListener("close",n),e(this,Ui,"f").signal.addEventListener("abort",n),i.events_dc.addEventListener("open",(async()=>{await e(this,Ri,"f").write(i)})),i},Oi=async function(){e(this,_i,"f").readable.pipeTo(new WritableStream({write:async t=>{if(console.log(t),"error-not-exists"===t.type){return e(this,Ai,"f").get(t.destination)?.rtc.close(),void console.log("closing")}let i=e(this,Ai,"f").get(t.from);switch(t.type){case"offer":i=e(this,Ti,"m",Ni).call(this,t.from),i.rtc.setRemoteDescription(new RTCSessionDescription(t.offer));let s=await i.rtc.createAnswer();await i.rtc.setLocalDescription(s),e(this,zi,"f").write({type:"answer",from:this.peer_id,to:t.from,answer:s});break;case"answer":i?.rtc.setRemoteDescription(new RTCSessionDescription(t.answer));break;case"icecandidate":await(i?.rtc.addIceCandidate(t.candidate))}}}),{signal:e(this,Ui,"f").signal}).catch((t=>{}))};async function Di(t){let i=[];return await gi(t.readable,(async t=>{console.log("READING resource CHUNK"),i.push(t)})),{blob:new Blob(i)}}var Hi,Bi,Gi,Ki,Ji,Vi,qi,Fi,Zi,Qi,Yi,Xi,te,ie,ee,se;class ne extends EventTarget{constructor(t,i,n){super(),Hi.add(this),Gi.set(this,void 0),Ki.set(this,void 0),Ji.set(this,void 0),s(this,Gi,i,"f"),s(this,Ki,n,"f"),s(this,Ji,t,"f"),e(this,Hi,"m",Vi).call(this),navigator.serviceWorker.onmessage=async t=>{let i=t.data.id;console.log("CLIENT ATTEMPTING TO FETCH",e(this,Ki,"f").events_dc.readyState),await e(this,Ki,"f").datachannel(i,{protocol:"request-resource"}).then(Si).then(Di).then((async({blob:t})=>{console.log("COMMUNICATING WITH SERVICE WORKER"),navigator.serviceWorker.controller.postMessage({type:"found",id:i,blob:t})})).catch((t=>{console.error("Error fetching resource: ",t),navigator.serviceWorker.controller.postMessage({type:"notfound",id:i,error:t})}))}}get status(){return e(this,Ki,"f").rtc.iceConnectionState}async reconnect(){s(this,Ki,await e(ne,Bi,"m",qi).call(ne,e(this,Ji,"f")),"f"),e(this,Hi,"m",Vi).call(this)}static async establish(t,i){return console.log("ESTABLISHING CLIENT"),new ne(t,i,await e(this,Bi,"m",qi).call(this,t))}shutdown(){e(this,Ki,"f").rtc.close(),navigator.serviceWorker.onmessage=null}}Bi=ne,Gi=new WeakMap,Ki=new WeakMap,Ji=new WeakMap,Hi=new WeakSet,Vi=function(){console.log("configuring peer",e(this,Ki,"f").events_dc.readyState),gi(e(this,Ki,"f").events,(t=>e(this,Gi,"f").apply(t)));let t=({detail:t})=>{console.log("CALLBACK",t),t.remote||e(this,Ki,"f").write_event(t)};e(this,Gi,"f").addEventListener("game-event",t),e(this,Ki,"f").events_dc.addEventListener("close",(()=>{e(this,Gi,"f").removeEventListener("game-event",t)}))},qi=async function(t){let i=await Li.establish(),e=await i.initiate(t);return i.shutdown(),e};class oe{constructor(t,i){Fi.add(this),Zi.set(this,void 0),Qi.set(this,new Set),this.signaler=t,s(this,Zi,i,"f"),gi(this.signaler.incoming_peers,(async t=>e(this,Fi,"m",Yi).call(this,t))),e(this,Zi,"f").addEventListener("game-event",(({detail:t})=>{for(let i of e(this,Qi,"f"))i.id!==t.remote&&i.write_event(t)}))}static async establish(t){return new oe(await Li.establish(),t)}shutdown(){for(let t of e(this,Qi,"f"))t.rtc.close();e(this,Qi,"f").clear()}}Zi=new WeakMap,Qi=new WeakMap,Fi=new WeakSet,Yi=function(t){e(this,Qi,"f").add(t),t.write_event({type:"state-sync",tabletop:mi(e(this,Zi,"f").tabletop)}),gi(t.events,(i=>(i.remote=t.id,e(this,Zi,"f").apply(i)))),t.events_dc.addEventListener("close",(()=>{console.log("PEEER EVENT DC"),e(this,Qi,"f").delete(t)})),t.ondatachannel=async t=>{console.log("INCOMING DC",t.channel);const i=t.channel;await Ut("open",i),console.log("new dc",i),"request-resource"===i.protocol&&async function(t,i){let e=i.blob,s=t.writable.getWriter();console.log("BLOBL",e);for(let t=0;t<e.size;t+=64e3)console.log("WRITING FIRST ChUNK"),await s.write(await e.slice(t,Math.min(t+64e3,e.size)).arrayBuffer());console.error("closing"),await s.close()}(Si(i),await e(this,Fi,"m",Xi).call(this,i.label))}},Xi=async function(t){let i=await fetch(`/resources/${t}`);return{blob:await i.blob()}};let re=class extends nt{constructor(){super(...arguments),this.selection=new Set,this.host_pending=!1,te.set(this,new Mi),ie.set(this,(()=>{e(this,te,"f").set_dim(Ct([1,1],[parseInt(this.width?.value)??0,parseInt(this.height?.value)??0]))})),ee.set(this,(()=>{this.client?.shutdown(),this.client=void 0,window.history.pushState(null,"",window.location.href.split("?")[0])})),se.set(this,(async()=>{try{this.host_pending=!0,this.server=await oe.establish(e(this,te,"f")),this.client?.shutdown(),this.client=void 0,this.host_pending=!1,window.history.pushState({},"","?game="+this.server.signaler.peer_id),navigator.clipboard.writeText(window.location.toString())}catch(t){console.error(t)}}))}render(){let t="closed"===this.client?.status?I`<div class="message error"><div><h1>Error connecting to remote grid</h1><button @click="${e(this,ee,"f")}">New local grid</button></div></div>`:null,i="checking"===this.client?.status?I`<div class="message"><div><h1>Connecting to grid...</h1></div></div>`:null,s="disconnected"===this.client?.status?I`<div class="message"><div><h1>Disconnected from host</h1><button @click="${e(this,ee,"f")}">Continue locally</button></div></div>`:null,n=t||i||s;return I`<section id="toolbar" class="group"><div class="group"><span>Grid: <input id="width" type="number" min="1" @input="${e(this,ie,"f")}" .value="${e(this,te,"f").tabletop.grid_dim[0]+""}"> x <input id="height" type="number" min="1" @input="${e(this,ie,"f")}" .value="${e(this,te,"f").tabletop.grid_dim[1]+""}"> </span>${1===this.selection.size?I`<div><button @click="${()=>e(this,te,"f").apply({type:"token-reorder",id:Pt(this.selection),idx:"down"})}" ?disabled="${0===e(this,te,"f").tabletop.tokens.index(Pt(this.selection))}">Move Down</button> <button @click="${()=>e(this,te,"f").apply({type:"token-reorder",id:Pt(this.selection),idx:"up"})}" ?disabled="${e(this,te,"f").tabletop.tokens.index(Pt(this.selection))===e(this,te,"f").tabletop.tokens.size-1}">Move Up</button></div>`:null}</div><div class="group">${this.host_pending?I`<img src="assets/loading.svg">`:this.client||this.server?I`<div>${this.server?"hosting":this.client.status}</div>`:I`<button @click="${e(this,se,"f")}">Host</button>`}<buy-me-a-coffee class="right"></buy-me-a-coffee></div></section><bg-canvas bg="${(t=>null!=t?t:L)(e(this,te,"f").tabletop.bg??void 0)}" .selection="${this.selection}" width="${e(this,te,"f").tabletop.grid_dim[0]}" height="${e(this,te,"f").tabletop.grid_dim[1]}" .tokens="${e(this,te,"f").tabletop.tokens}" .callouts="${e(this,te,"f").callouts}" @token-drop="${({detail:t})=>e(this,te,"f").add_token(t.img,{loc:t.loc,r:0,dim:t.dim})}" @bg-drop="${({detail:t})=>e(this,te,"f").set_bg(t)}" @token-select="${({detail:t})=>{this.selection=new Set(t)}}" @game-event="${({detail:t})=>e(this,te,"f").apply(t)}"></bg-canvas>${n}`}updated(t){t.has("client")&&(document.title="BattleGrid"+(this.client&&"connected"===this.client.status?this.server?"- Hosting":"- Connected":""))}async connectedCallback(){super.connectedCallback(),e(this,te,"f").addEventListener("game-event",(()=>{for(const t of this.selection)e(this,te,"f").tabletop.tokens.has(t)||this.selection.delete(t);this.requestUpdate(),this.canvas?.requestUpdate()}));let t=new URLSearchParams(window.location.search).get("game");if(!t)return{};try{this.client=await ne.establish(t,e(this,te,"f"))}catch{e(this,ee,"f").call(this)}}};var he;te=new WeakMap,ie=new WeakMap,ee=new WeakMap,se=new WeakMap,re.styles=a`:host{width:100%;height:100%;display:grid;grid:"toolbar" 30px "viewport" minmax(0,1fr)/minmax(0,1fr);font-family:inherit;--ui-bg:#f9f9fa}.message{grid-area:1/1/3/1;display:grid;align-items:center;justify-items:center;background:#fff;z-index:2}.right{justify-self:end}bg-canvas{grid-area:viewport;z-index:1}input[type=number]{width:3em}.group{display:flex;align-items:center;height:100%;flex-wrap:nowrap}#toolbar{grid-area:toolbar;box-shadow:0 0 4px gray;z-index:2;background:var(--ui-bg);justify-content:space-between;padding:0 1em;grid-template-rows:unset}.group img{width:1em;height:1em;object-fit:cover;display:inline-block}`,i([ct("#width",!0)],re.prototype,"width",void 0),i([ct("#height",!0)],re.prototype,"height",void 0),i([ct("bg-canvas",!0)],re.prototype,"canvas",void 0),i([lt()],re.prototype,"client",void 0),i([lt()],re.prototype,"server",void 0),i([lt()],re.prototype,"selection",void 0),i([lt()],re.prototype,"host_pending",void 0),re=i([rt("bg-app")],re);class ae extends HTMLElement{constructor(){super(),this.state={z:1,scroll_pos:[0,0]},this.desired_state={z:1},this.origin=[0,0],this.vloc=[0,0],this.vdim=[0,0],this.cdim=[0,0],this.offset=[0,0],this.smooth=!1,he.set(this,new ResizeObserver((t=>{for(let i of t)if(i.target===this){this.vdim=[i.contentRect.width,i.contentRect.height];const t=this.getBoundingClientRect();this.vloc=[t.x,t.y]}else this.cdim=[i.target.width.baseVal.value,i.target.height.baseVal.value];this.center()}))),this.loop=async()=>{let t,i;for(;t=i,i=await le();){if(!t)continue;let e=this.desired_state.z-this.state.z;if(0===e)continue;let s=i-t,n=this.smooth?Math.sign(e)*Math.min(.002*s*this.state.z,Math.abs(e)):e;this.state.z+=n,this.container.style.opacity="1",this.center(),this.state.scroll_pos=Ct([0,0],$t(Mt(this.origin,n),this.state.scroll_pos)),this.scrollTo({left:this.state.scroll_pos[0],top:this.state.scroll_pos[1]})}},this.zoom=(t,i)=>{this.desired_state.z=Math.min(4,Math.max(1,this.desired_state.z+i)),this.state.scroll_pos=[this.scrollLeft,this.scrollTop],this.origin=this.coordToLocal(t)},this.wheel=t=>{if(!t.ctrlKey)return;t.preventDefault();const i=t.deltaMode===WheelEvent.DOM_DELTA_LINE?10:1,e=Math.min(50,Math.max(-50,-t.deltaY*i)),s=.005*e*this.state.z;this.smooth=50===Math.abs(e),this.zoom([t.clientX,t.clientY],s)},this.root=this.attachShadow({mode:"open"}),this.root.appendChild(ae.template().content.cloneNode(!0)),this.container=this.root.getElementById("container"),e(this,he,"f").observe(this),this.root.querySelector("slot").onslotchange=({target:t})=>{let i=t.assignedElements()[0];e(this,he,"f").observe(i)},this.addEventListener("scroll",(()=>this.state.scroll_pos=[this.scrollLeft,this.scrollTop]))}center(){this.offset=Ct([0,0],Mt(xt(this.vdim,Mt(this.cdim,this.state.z)),.5)),this.container.style.transform=`translate(${this.offset[0]}px, ${this.offset[1]}px) scale(${this.state.z})`}connectedCallback(){this.loop(),this.addEventListener("wheel",this.wheel,{passive:!1,capture:!0})}coordToLocal(t){const i=$t(xt(t,this.vloc),this.state.scroll_pos);return St(xt(i,this.offset),this.state.z)}static template(){let t=document.createElement("template");return t.innerHTML='\n            <style>\n                :host {\n                    position: relative;\n                    display: block;\n                    overflow: auto; \n                }\n                #container {\n                    transform-origin: 0 0;\n                    display: block;\n                    width: fit-content;\n                    height: fit-content;\n                }\n            </style>\n                <div id="container">\n                    <slot>\n                </div>\n            </div>\n        ',t}}he=new WeakMap;const le=()=>new Promise((t=>window.requestAnimationFrame(t)));customElements.define("p-p-z",ae),await navigator.serviceWorker.register("./service-worker.js"),document.body.addEventListener("wheel",(t=>{t.ctrlKey&&t.preventDefault()}),{passive:!1});
//# sourceMappingURL=bundle.js.map
