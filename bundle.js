/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,i,s,e){var n,o=arguments.length,r=o<3?i:null===e?e=Object.getOwnPropertyDescriptor(i,s):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,i,s,e);else for(var h=t.length-1;h>=0;h--)(n=t[h])&&(r=(o<3?n(r):o>3?n(i,s,r):n(i,s))||r);return o>3&&r&&Object.defineProperty(i,s,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const i=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),e=new Map;class n{constructor(t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=e.get(this.cssText);return i&&void 0===t&&(e.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const o=(t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,s,e)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[e+1]),t[0]);return new n(e,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",s))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var h;const l=window.trustedTypes,a=l?l.emptyScript:"",c=window.reactiveElementPolyfillSupport,d={toAttribute(t,i){switch(i){case Boolean:t=t?a:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},u=(t,i)=>i!==t&&(i==i||t==t),v={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class p extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e))})),t}static createProperty(t,i=v){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e)}}static getPropertyDescriptor(t,i,s){return{get(){return this[i]},set(e){const n=this[t];this[i]=e,this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)i.unshift(r(t))}else void 0!==t&&i.push(r(t));return i}static _$Eh(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,s;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((i=>{const s=document.createElement("style"),e=window.litNonce;void 0!==e&&s.setAttribute("nonce",e),s.textContent=i.cssText,t.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$ES(t,i,s=v){var e,n;const o=this.constructor._$Eh(t,s);if(void 0!==o&&!0===s.reflect){const r=(null!==(n=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==n?n:d.toAttribute)(i,s.type);this._$Ei=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$Ei=null}}_$AK(t,i){var s,e,n;const o=this.constructor,r=o._$Eu.get(t);if(void 0!==r&&this._$Ei!==r){const t=o.getPropertyOptions(r),h=t.converter,l=null!==(n=null!==(e=null===(s=h)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof h?h:null)&&void 0!==n?n:d.fromAttribute;this._$Ei=r,this[r]=l(i,t.type),this._$Ei=null}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU()}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s)}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$E_=void 0),this._$EU()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;p.finalized=!0,p.elementProperties=new Map,p.elementStyles=[],p.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:p}),(null!==(h=globalThis.reactiveElementVersions)&&void 0!==h?h:globalThis.reactiveElementVersions=[]).push("1.2.1");const f=globalThis.trustedTypes,w=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,b=`lit$${(Math.random()+"").slice(9)}$`,y="?"+b,m=`<${y}>`,$=document,_=(t="")=>$.createComment(t),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,x=Array.isArray,S=t=>{var i;return x(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,A=/-->/g,M=/>/g,T=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,R=/'/g,E=/"/g,O=/^(?:script|style|textarea)$/i,P=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),U=P(1),N=P(2),z=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),L=new WeakMap,D=$.createTreeWalker($,129,null,!1),I=(t,i)=>{const s=t.length-1,e=[];let n,o=2===i?"<svg>":"",r=C;for(let i=0;i<s;i++){const s=t[i];let h,l,a=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===C?"!--"===l[1]?r=A:void 0!==l[1]?r=M:void 0!==l[2]?(O.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=T):void 0!==l[3]&&(r=T):r===T?">"===l[0]?(r=null!=n?n:C,a=-1):void 0===l[1]?a=-2:(a=r.lastIndex-l[2].length,h=l[1],r=void 0===l[3]?T:'"'===l[3]?E:R):r===E||r===R?r=T:r===A||r===M?r=C:(r=T,n=void 0);const d=r===T&&t[i+1].startsWith("/>")?" ":"";o+=r===C?s+m:a>=0?(e.push(h),s.slice(0,a)+"$lit$"+s.slice(a)+b+d):s+b+(-2===a?(e.push(void 0),i):d)}const h=o+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(h):h,e]};class J{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let n=0,o=0;const r=t.length-1,h=this.parts,[l,a]=I(t,i);if(this.el=J.createElement(l,s),D.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(e=D.nextNode())&&h.length<r;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(b)){const s=a[o++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+"$lit$").split(b),i=/([.?@])?(.*)/.exec(s);h.push({type:1,index:n,name:i[2],strings:t,ctor:"."===i[1]?G:"?"===i[1]?Y:"@"===i[1]?q:Z})}else h.push({type:6,index:n})}for(const i of t)e.removeAttribute(i)}if(O.test(e.tagName)){const t=e.textContent.split(b),i=t.length-1;if(i>0){e.textContent=f?f.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],_()),D.nextNode(),h.push({type:2,index:++n});e.append(t[i],_())}}}else if(8===e.nodeType)if(e.data===y)h.push({type:2,index:n});else{let t=-1;for(;-1!==(t=e.data.indexOf(b,t+1));)h.push({type:7,index:n}),t+=b.length-1}n++}}static createElement(t,i){const s=$.createElement("template");return s.innerHTML=t,s}}function H(t,i,s=t,e){var n,o,r,h;if(i===z)return i;let l=void 0!==e?null===(n=s._$Cl)||void 0===n?void 0:n[e]:s._$Cu;const a=k(i)?void 0:i._$litDirective$;return(null==l?void 0:l.constructor)!==a&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===a?l=void 0:(l=new a(t),l._$AT(t,s,e)),void 0!==e?(null!==(r=(h=s)._$Cl)&&void 0!==r?r:h._$Cl=[])[e]=l:s._$Cu=l),void 0!==l&&(i=H(t,l._$AS(t,i.values),l,e)),i}class B{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,n=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:$).importNode(s,!0);D.currentNode=n;let o=D.nextNode(),r=0,h=0,l=e[0];for(;void 0!==l;){if(r===l.index){let i;2===l.type?i=new W(o,o.nextSibling,this,t):1===l.type?i=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(i=new F(o,this,t)),this.v.push(i),l=e[++h]}r!==(null==l?void 0:l.index)&&(o=D.nextNode(),r++)}return n}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class W{constructor(t,i,s,e){var n;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(n=null==e?void 0:e.isConnected)||void 0===n||n}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=H(this,t,i),k(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==z&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):S(t)?this.A(t):this.$(t)}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==j&&k(this._$AH)?this._$AA.nextSibling.data=t:this.S($.createTextNode(t)),this._$AH=t}T(t){var i;const{values:s,_$litType$:e}=t,n="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=J.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===n)this._$AH.m(s);else{const t=new B(n,this),i=t.p(this.options);t.m(s),this.S(i),this._$AH=t}}_$AC(t){let i=L.get(t.strings);return void 0===i&&L.set(t.strings,i=new J(t)),i}A(t){x(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const n of t)e===i.length?i.push(s=new W(this.M(_()),this.M(_()),this,this.options)):s=i[e],s._$AI(n),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class Z{constructor(t,i,s,e,n){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const n=this.strings;let o=!1;if(void 0===n)t=H(this,t,i,0),o=!k(t)||t!==this._$AH&&t!==z,o&&(this._$AH=t);else{const e=t;let r,h;for(t=n[0],r=0;r<n.length-1;r++)h=H(this,e[s+r],i,r),h===z&&(h=this._$AH[r]),o||(o=!k(h)||h!==this._$AH[r]),h===j?t=j:t!==j&&(t+=(null!=h?h:"")+n[r+1]),this._$AH[r]=h}o&&!e&&this.k(t)}k(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends Z{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===j?void 0:t}}const V=f?f.emptyScript:"";class Y extends Z{constructor(){super(...arguments),this.type=4}k(t){t&&t!==j?this.element.setAttribute(this.name,V):this.element.removeAttribute(this.name)}}class q extends Z{constructor(t,i,s,e,n){super(t,i,s,e,n),this.type=5}_$AI(t,i=this){var s;if((t=null!==(s=H(this,t,i,0))&&void 0!==s?s:j)===z)return;const e=this._$AH,n=t===j&&e!==j||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,o=t!==j&&(e===j||n);n&&this.element.removeEventListener(this.name,this,e),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class F{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}}const K={P:"$lit$",V:b,L:y,I:1,N:I,R:B,D:S,j:H,H:W,O:Z,F:Y,B:q,W:G,Z:F},Q=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var X,tt;null==Q||Q(J,W),(null!==(g=globalThis.litHtmlVersions)&&void 0!==g?g:globalThis.litHtmlVersions=[]).push("2.1.2");class it extends p{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,i;const s=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=s.firstChild),s}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=((t,i,s)=>{var e,n;const o=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==s?void 0:s.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new W(i.insertBefore(_(),t),t,void 0,null!=s?s:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1)}render(){return z}}it.finalized=!0,it._$litElement$=!0,null===(X=globalThis.litElementHydrateSupport)||void 0===X||X.call(globalThis,{LitElement:it});const st=globalThis.litElementPolyfillSupport;null==st||st({LitElement:it}),(null!==(tt=globalThis.litElementVersions)&&void 0!==tt?tt:globalThis.litElementVersions=[]).push("3.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et=t=>i=>"function"==typeof i?((t,i)=>(window.customElements.define(t,i),i))(t,i):((t,i)=>{const{kind:s,elements:e}=i;return{kind:s,elements:e,finisher(i){window.customElements.define(t,i)}}})(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,nt=(t,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(s){s.createProperty(i.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(s){s.createProperty(i.key,t)}};function ot(t){return(i,s)=>void 0!==s?((t,i,s)=>{i.constructor.createProperty(s,t)})(t,i,s):nt(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function rt(t){return ot({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=({finisher:t,descriptor:i})=>(s,e)=>{var n;if(void 0===e){const e=null!==(n=s.originalKey)&&void 0!==n?n:s.key,o=null!=i?{kind:"method",placement:"prototype",key:e,descriptor:i(s.key)}:{...s,key:e};return null!=t&&(o.finisher=function(i){t(i,e)}),o}{const n=s.constructor;void 0!==i&&Object.defineProperty(s,e,i(e)),null==t||t(n,e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function lt(t){return ht({finisher:(i,s)=>{Object.assign(i.prototype[s],t)}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function at(t,i){return ht({descriptor:s=>{const e={get(){var i,s;return null!==(s=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==s?s:null},enumerable:!0,configurable:!0};if(i){const i="symbol"==typeof s?Symbol():"__"+s;e.get=function(){var s,e;return void 0===this[i]&&(this[i]=null!==(e=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(t))&&void 0!==e?e:null),this[i]}}return e}})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ct;null===(ct=window.HTMLSlotElement)||void 0===ct||ct.prototype.assignedElements;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt=1,ut=2,vt=t=>(...i)=>({_$litDirective$:t,values:i});class pt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,s){this._$Ct=t,this._$AM=i,this._$Ci=s}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=vt(class extends pt{constructor(t){var i;if(super(t),t.type!==dt||"style"!==t.name||(null===(i=t.strings)||void 0===i?void 0:i.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((i,s)=>{const e=t[s];return null==e?i:i+`${s=s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${e};`}),"")}update(t,[i]){const{style:s}=t.element;if(void 0===this.ct){this.ct=new Set;for(const t in i)this.ct.add(t);return this.render(i)}this.ct.forEach((t=>{null==i[t]&&(this.ct.delete(t),t.includes("-")?s.removeProperty(t):s[t]="")}));for(const t in i){const e=i[t];null!=e&&(this.ct.add(t),t.includes("-")?s.setProperty(t,e):s[t]=e)}return z}}),ft=t=>t.isPrimary&&("touch"===t.pointerType||t.pressure>0),wt=t=>"touch"!==t.pointerType&&t.isPrimary&&t.pressure>0,bt=t=>{t.preventDefault(),t.stopPropagation()},yt=(t,i)=>[t[0]+i[0],t[1]+i[1]],mt=(t,i)=>yt(t,[i,i]),$t=(t,i)=>[t[0]-i[0],t[1]-i[1]],_t=(t,i)=>[t[0]*i,t[1]*i],kt=(t,i)=>[t[0]*i[0],t[1]*i[1]],xt=(t,i)=>[t[0]/i[0],t[1]/i[1]],St=(t,i)=>[t[0]/i,t[1]/i],Ct=(t,i)=>[Math.max(t[0],i[0]),Math.max(t[1],i[1])],At=(t,i)=>[Math.min(t[0],i[0]),Math.min(t[1],i[1])],Mt=(t,i,s)=>Ct(t,At(i,s)),Tt=(t,i)=>t[0]===i[0]&&t[1]===i[1];let Rt=class extends it{constructor(){super(...arguments),this.scale=1,this.c_dim=[0,0],this.v_dim=[0,0],this.v_loc=[0,0],this._scrollPos=[0,0],this.smooth=0,this.#t=0,this.#i=[0,0],this.#s=new ResizeObserver((t=>{for(let i of t)switch(i.target){case this.surface:this.v_dim=[i.contentRect.width,i.contentRect.height];const t=this.getBoundingClientRect();this.v_loc=[t.x,t.y],this.smooth=0;break;case this.#e:this.c_dim=[this.#e.width.baseVal.value,this.#e.height.baseVal.value]}})),this.#n=t=>{t.ctrlKey&&("="===t.key?(bt(t),this.smooth=200,this._performZoom(this.coordToLocal(St(yt(this.v_loc,this.v_dim),2)),.2*this.scale)):"-"===t.key?(bt(t),this.smooth=200,this._performZoom(this.coordToLocal(St(yt(this.v_loc,this.v_dim),2)),-.2*this.scale)):"0"===t.key&&(this.smooth=100,this.#o()))},this.#r=[0,0],this.#h=t=>{bt(t),t.target.setPointerCapture(t.pointerId),this.#r=[t.clientX,t.clientY]},this.#l=(t,i,s,e)=>{this.smooth=0;let n=this.#a,o=this.#r;this.#r=[t.clientX,t.clientY],this.#a=[i?n[0]+e*(this.#r[0]-o[0]):n[0],s?n[1]+e*(this.#r[1]-o[1]):n[1]]},this.#c=t=>{t.target.releasePointerCapture(t.pointerId)},this._touchdragstart=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#h(t)},this._touchdragmove=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#l(t,!0,!0,-1)},this._touchdragend=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#c(t)}}#e;get#a(){return Ct([0,0],At(this._scrollPos,$t(_t(this.c_dim,this.scale),this.v_dim)))}set#a(t){const i=this._scrollPos;this._scrollPos=t,this.requestUpdate("#scrollPos",i)}get offset(){return Ct([0,0],_t($t(this.v_dim,_t(this.c_dim,this.scale)),.5)).map((t=>t))}render(){const t=this.offset,i=this.#a;let s=!1,e=!1;this.v_dim&&this.c_dim&&(s=this.v_dim[1]<this.c_dim[1]*this.scale,e=this.v_dim[0]<this.c_dim[0]*this.scale);const n=xt(kt(this.v_dim,this.v_dim),_t(this.c_dim,this.scale)),o=xt(kt(i,this.v_dim),_t(this.c_dim,this.scale));return U`<style>:host,:root{--scale:${this.scale}}::slotted(svg){transform:translate(${t[0]-i[0]}px,${t[1]-i[1]}px) scale(var(--scale))}*,::slotted(svg){transition-duration:${this.smooth+"ms"}}</style><div id="touch-surface" @wheel="${this._wheel}" @pointerdown="${this._touchdragstart}" @pointermove="${this._touchdragmove}" @pointerup="${this._touchdragend}" @gesturestart="${this._gesturestart}" @gesturechange="${this._gesturechange}"><div id="bg" part="background"></div><slot @slotchange="${this.handleSlotchange}"></slot><div part="bar" class="bottombar" style="${gt({transform:`translate(${o[0]}px, 0)`,width:`${n[0]}px`,display:e?"block":"none"})}" @pointerdown="${this.#d}" @pointermove="${this.#u}" @pointerup="${this.#v}"></div><div part="bar" class="rightbar" style="${gt({transform:`translate(0, ${o[1]}px)`,height:`${n[1]}px`,display:s?"block":"none"})}" @pointerdown="${this.#d}" @pointermove="${this.#p}" @pointerup="${this.#v}"></div></div>`}#d(t){wt(t)&&this.#h(t)}#u(t){wt(t)&&this.#l(t,!0,!1,this.c_dim[0]*this.scale/this.v_dim[0])}#p(t){wt(t)&&this.#l(t,!1,!0,this.c_dim[1]*this.scale/this.v_dim[1])}#v(t,i){this.#c(t)}_wheel(t){bt(t);const i=t.deltaMode===WheelEvent.DOM_DELTA_LINE?10:1;if(t.ctrlKey){const s=Math.min(50,Math.max(-50,-t.deltaY*i)),e=.005*s*this.scale;console.log("ZOOM",e,s),this.smooth=50===Math.abs(s)?100:0,this._performZoom(this.coordToLocal([t.clientX,t.clientY]),e)}else{const s=_t([t.deltaX,t.deltaY],i);this.smooth=2*(Math.abs(s[0])+Math.abs(s[1])),this.smooth=0,this.#a=yt(s,this.#a)}}#t;#i;_gesturestart(t){this.#i=this.coordToLocal([t.clientX,t.clientY]),this.#t=1,bt(t)}_gesturechange(t){bt(t),this._performZoom(this.#i,this.scale*(t.scale-this.#t)*1.5),this.#t=t.scale}_performZoom(t,i){let s=Math.min(1,Math.max(.2,this.scale+i)),e=s-this.scale;this.#a=yt(_t(t,e),this.#a),this.scale=s}#s;firstUpdated(){this.#s.observe(this.surface)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.#n)}disconnectedCallback(){super.disconnectedCallback(),this.#s.disconnect(),document.removeEventListener("keydown",this.#n)}#n;coordToLocal(t){const i=yt($t(t,this.v_loc),this.#a);return St($t(i,this.offset),this.scale)}handleSlotchange({target:t}){this.#e&&this.#s.unobserve(this.#e),this.#e=t.assignedElements().find((t=>t.matches("svg"))),this.#o(),this.#e&&this.#s.observe(this.#e)}#o(){const t=[this.#e.width.baseVal.value,this.#e.height.baseVal.value],i=this.surface.getBoundingClientRect();this.scale=Math.max(.2,Math.min(1,..._t(xt([i.width,i.height],t),.95)))}#r;#h;#l;#c;static get styles(){return o`#touch-surface{position:relative;width:100%;height:100%;overflow:hidden}::slotted(svg){transform-origin:0 0;position:absolute}.bottombar{position:fixed;bottom:0;height:var(--thickness);transform-origin:0 0;backface-visibility:hidden;will-change:width}.rightbar{position:fixed;width:var(--thickness);transform-origin:0 0;backface-visibility:hidden;right:0;will-change:height}*,::slotted(svg){transition-property:all}#bg{position:absolute;z-index:-1;height:100%;width:100%}`}};t([ot({type:Number})],Rt.prototype,"scale",void 0),t([rt()],Rt.prototype,"c_dim",void 0),t([rt()],Rt.prototype,"v_dim",void 0),t([rt()],Rt.prototype,"v_loc",void 0),t([rt()],Rt.prototype,"_scrollPos",void 0),t([at("#touch-surface",!0)],Rt.prototype,"surface",void 0),t([rt()],Rt.prototype,"smooth",void 0),t([lt({passive:!1,capture:!0})],Rt.prototype,"_wheel",null),t([lt({capture:!0})],Rt.prototype,"_gesturestart",null),t([lt({passive:!1})],Rt.prototype,"_gesturechange",null),Rt=t([et("bg-viewport")],Rt);const Et=()=>{document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`)};window.addEventListener("resize",Et),Et();
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{H:Ot}=K,Pt=()=>document.createComment(""),Ut=(t,i,s)=>{var e;const n=t._$AA.parentNode,o=void 0===i?t._$AB:i._$AA;if(void 0===s){const i=n.insertBefore(Pt(),o),e=n.insertBefore(Pt(),o);s=new Ot(i,e,t,t.options)}else{const i=s._$AB.nextSibling,r=s._$AM,h=r!==t;if(h){let i;null===(e=s._$AQ)||void 0===e||e.call(s,t),s._$AM=t,void 0!==s._$AP&&(i=t._$AU)!==r._$AU&&s._$AP(i)}if(i!==o||h){let t=s._$AA;for(;t!==i;){const i=t.nextSibling;n.insertBefore(t,o),t=i}}}return s},Nt=(t,i,s=t)=>(t._$AI(i,s),t),zt={},jt=t=>{var i;null===(i=t._$AP)||void 0===i||i.call(t,!1,!0);let s=t._$AA;const e=t._$AB.nextSibling;for(;s!==e;){const t=s.nextSibling;s.remove(),s=t}},Lt=(t,i,s)=>{const e=new Map;for(let n=i;n<=s;n++)e.set(t[n],n);return e},Dt=vt(class extends pt{constructor(t){if(super(t),t.type!==ut)throw Error("repeat() can only be used in text expressions")}dt(t,i,s){let e;void 0===s?s=i:void 0!==i&&(e=i);const n=[],o=[];let r=0;for(const i of t)n[r]=e?e(i,r):r,o[r]=s(i,r),r++;return{values:o,keys:n}}render(t,i,s){return this.dt(t,i,s).values}update(t,[i,s,e]){var n;const o=(t=>t._$AH)(t),{values:r,keys:h}=this.dt(i,s,e);if(!Array.isArray(o))return this.at=h,r;const l=null!==(n=this.at)&&void 0!==n?n:this.at=[],a=[];let c,d,u=0,v=o.length-1,p=0,g=r.length-1;for(;u<=v&&p<=g;)if(null===o[u])u++;else if(null===o[v])v--;else if(l[u]===h[p])a[p]=Nt(o[u],r[p]),u++,p++;else if(l[v]===h[g])a[g]=Nt(o[v],r[g]),v--,g--;else if(l[u]===h[g])a[g]=Nt(o[u],r[g]),Ut(t,a[g+1],o[u]),u++,g--;else if(l[v]===h[p])a[p]=Nt(o[v],r[p]),Ut(t,o[u],o[v]),v--,p++;else if(void 0===c&&(c=Lt(h,p,g),d=Lt(l,u,v)),c.has(l[u]))if(c.has(l[v])){const i=d.get(h[p]),s=void 0!==i?o[i]:null;if(null===s){const i=Ut(t,o[u]);Nt(i,r[p]),a[p]=i}else a[p]=Nt(s,r[p]),Ut(t,o[u],s),o[i]=null;p++}else jt(o[v]),v--;else jt(o[u]),u++;for(;p<=g;){const i=Ut(t,a[g+1]);Nt(i,r[p]),a[p++]=i}for(;u<=v;){const t=o[u++];null!==t&&jt(t)}return this.at=h,((t,i=zt)=>{t._$AH=i})(t,a),z}}),It=async t=>{let i=t.dataTransfer?.items??[];return new Promise((async(t,s)=>{console.log("DataItems",i.length);for(let s=0;s<i.length;s++){if(console.log(i[s].type),i[s].type.startsWith("image/"))return t({blob:i[s].getAsFile()});if("text/html"===i[s].type)return void i[s].getAsString((i=>t(Jt(i))));if("application/x-moz-file-promise-url"===i[s].type)return void i[s].getAsString((t=>{}));if("string"===i[s].kind){let t=i[s].type;i[s].getAsString((i=>console.log(t,i)))}}return s("No compatible drop type found")}))};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Jt(t){const i=(new DOMParser).parseFromString(t,"text/html").querySelector("img")?.src;return i?{url:i}:null}const Ht=()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(t=>(t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>t/4).toString(16))),Bt=t=>new CustomEvent("game-event",{detail:t});class Wt{constructor(){this.index=[],this.all=()=>this.index.map((t=>[t,this.get(t)]))}get(t){return t.startsWith("local:")?window.sessionStorage.getItem(t):t}register(t,i){let s=i??"local:"+Ht();return this.index.push(s),window.sessionStorage.setItem(s,URL.createObjectURL(t)),s}}let Zt=class extends it{constructor(){super(),this.width=40,this.height=10,this.tokens=new Map([]),this.#g=0,this.#f=t=>{bt(t),this.#g++},this.#w=t=>{bt(t),this._drop_hint=Mt([0,0],_t([this.width-1,this.height-1],72),this.#b(t).map(Vt)),this.hovering="canvas"},this.#y=t=>{--this.#g<=0&&(this._drop_hint=void 0,this.hovering=void 0)},this.#m=t=>{bt(t),this._drop_hint=void 0,this.hovering="bg"},this.#$=async t=>{bt(t);try{const i=await It(t),s="blob"in i?this.resources.register(i.blob):i.url;this.bg=s,this.dispatchEvent(Bt({type:"bg",res:s})),"blob"in i&&this.dispatchEvent(Bt({type:"file",name:s,contents:i.blob}))}catch(t){}this.hovering=void 0},this.#_=async t=>{bt(t),console.log(t);try{const i=await It(t),s="blob"in i?this.resources.register(i.blob):i.url,e=Ht();this.tokens.set(e,{loc:this._drop_hint,dim:[72,72],id:e,res:s,r:0}),this.dispatchEvent(Bt({type:"token-added",loc:this._drop_hint,id:e,res:s})),"blob"in i&&this.dispatchEvent(Bt({type:"file",name:s,contents:i.blob}))}catch(t){}this._drop_hint=void 0,this.hovering=void 0},this.#k=t=>{t.preventDefault(),t.stopPropagation(),this.selection=t.target.id},this.#x=t=>{this.selection=void 0},this.#S=t=>{ft(t)&&(bt(t),t.target.setPointerCapture(t.pointerId),this.#C=this.#b(t))},this._selection_transform={move:[0,0],resize:[0,0],r:0},this.#A=t=>{if(!ft(t))return;this.#C||this.#S(t),bt(t);const i=Mt([0,0],[72*this.width,72*this.height],this.#b(t)),s=this.tokens.get(this.selection),e=s.dim,n=s.loc,o=t.target.classList;let r=[0,0],h=[0,0],l=0;if(o.contains("rn")&&(h[1]=n[1]-i[1],r[1]=Gt(i[1])-n[1]),o.contains("rw")&&(h[0]=n[0]-i[0],r[0]=Gt(i[0])-n[0]),o.contains("rs")&&(h[1]=Gt(i[1])-e[1]-n[1]),o.contains("re")&&(h[0]=Gt(i[0])-e[0]-n[0]),o.contains("ro")){const t=yt(n,St(e,2)),o=$t(i,t),r=180*Math.atan2(o[0],-o[1])/Math.PI;l=90*Math.round(r/90)-s.r%360}o.contains("selection-box")?r=$t(i,this.#C).map(Gt):(r=At(mt(e,-72),r),h=Ct(mt(_t(e,-1),72),h.map(Gt))),l===this._selection_transform.r&&Tt(r,this._selection_transform.move)&&Tt(h,this._selection_transform.resize)||(this._selection_transform={move:r,resize:h,r:l},this.dispatchEvent(Bt({type:"token-manipulated",id:s.id,loc:yt(s.loc,r),dim:yt(s.dim,h),r:s.r+l})))},this.#M=t=>{bt(t);const i=this.tokens.get(this.selection);i&&(i.loc=yt(i.loc,this._selection_transform.move),i.dim=yt(i.dim,this._selection_transform.resize),i.r+=this._selection_transform.r,console.log("el.r",i.r)),this._selection_transform={move:[0,0],resize:[0,0],r:0},this.#C=void 0},this.#b=t=>$t(this.viewport.coordToLocal([t.clientX,t.clientY]),[60,60]),this.#n=t=>{if(!this.selection)return;if(8===t.keyCode)return this.tokens.delete(this.selection),this.dispatchEvent(Bt({type:"token-removed",id:this.selection})),this.selection=void 0,void bt(t);let i=this.tokens.get(this.selection);let s={ArrowUp:[0,-72],ArrowDown:[0,72],ArrowLeft:[-72,0],ArrowRight:[72,0]}[t.key];s&&(i.loc=Mt([0,0],$t(this.#T,i.dim),yt(i.loc,s)),this.dispatchEvent(Bt({type:"token-manipulated",id:i.id,loc:i.loc,dim:i.dim,r:i.r})),this.requestUpdate(),bt(t))},this.get_state=()=>({type:"state-sync",tokens:[...this.tokens.values()],grid_dim:[this.width,this.height],bg:this.bg}),this.resources=new Wt}get#T(){return _t([this.width,this.height],72)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.#n)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.#n)}render(){let t,i,s,[e,n]=this.#T,o=this.tokens.get(this.selection);return o&&(i=yt(o.loc,this._selection_transform.move),t=yt(o.dim,this._selection_transform.resize),s=o.r+this._selection_transform.r),U`
      <bg-viewport
        @pointerup=${this.#x}
        @dragstart=${bt}
        @dragenter=${this.#f}
        @dragleave=${this.#y}
        @dragstop=${this.#y}
        @dragover=${this.#w}
        @drop=${this.#_}
      >
        <svg id="root" width=${e+120} height=${n+120}>
          <defs>
            <clipPath id="canvasClip">
              <rect width=${e} height=${n} rx=${15}></rect>
            </clipPath>
            <pattern id="pat" x=${-.75} y=${-.75} width=${72} height=${72} patternUnits="userSpaceOnUse">
              <rect class="gridline" width=${1.5} height="100%" fill="#d3d3d3"></rect>
              <rect class="gridline" width="100%" height=${1.5} fill="#d3d3d3"></rect>
            </pattern>
          </defs>
          <g transform=${"translate(60 60)"}>
            <rect class="shadow" width=${e} height=${n} fill="white" rx=${15}></rect>
            <g style="clip-path: url(#canvasClip)">
              ${this.bg?N`<image href=${this.resources.get(this.bg)} width=${e} height=${n} preserveAspectRatio="none" />`:null}
              <rect width=${e} height=${n} fill="url(#pat)" opacity="0.75" pointer-events="none"></rect>

              ${Dt(this.tokens.values(),(t=>t.id),((e,n)=>{const o=this.resources.get(e.res),r=this.selection===e.id;let h=r?s:e.r;const l=(r?t[0]:e.dim[0])-1.5,a=(r?t[1]:e.dim[1])-1.5,c=(r?i[0]:e.loc[0])+.75,d=(r?i[1]:e.loc[1])+.75;return N`
                <svg viewBox="0 0 1 1" x=${c} y=${d} width=${l} height=${a} preserveAspectRatio="none">
                  <image
                      id=${e.id}
                      class="token"
                      width="1"
                      height="1"
                      @mousedown=${this.#k}
                      href=${o||"assets/loading.svg"}
                      style=${`transform: rotate(${h}deg)`}
                      preserveAspectRatio=${o?"none":""}
                  ></image>
                </svg>
                `}))}
            </g>
            ${this._drop_hint?N`
            <rect
                class="drop_hint"
                x=${this._drop_hint[0]}
                y=${this._drop_hint[1]}
                width=${72}
                height=${72}
                shapeRendering="geometricPrecision"
                ></rect>
          `:null}
            ${o?N`
            <svg
              id="selection"
              @pointerdown=${this.#S}
              @pointermove=${this.#A}
              @pointerup=${this.#M}
              @click=${bt}
              x=${i[0]}
              y=${i[1]}
              width=${t[0]}
              height=${t[1]}
              shapeRendering="geometricPrecision"
            >
            <rect
                class="selection-box"
                width="100%"
                height="100%"
                @click=${bt}
                fill="transparent"
            ></rect>
            <g style=${`transform-origin: center; transform: rotate(${s}deg) translateY(${Math.sign((s-180)%180)*(t[0]-t[1])/2}px)`}>
              <line class="ro" x1="50%" x2="50%" y2=${-30}></line>
              <circle class="ro handle" cx="50%" cy=${-30} r=${6}></circle>
            </g>
            <line class="rn" x2="100%"></line>
            <line class="rw" y2="100%"></line>
            <line class="re" x1="100%" x2="100%" y2="100%"></line>
            <line class="rs" y1="100%" x2="100%" y2="100%"></line>
            <rect class="handle rn rw"></rect>
            <rect class="handle rn re" x="100%"></rect>
            <rect class="handle rs rw" y="100%"></rect>
            <rect class="handle rs re" x="100%" y="100%"></rect>
            </svg>`:null}
          </g>
        </svg>
      </bg-viewport>
      <div
        id="bg-drop"
        class=${this.hovering??""}
        @dragenter=${this.#f}
        @dragover=${this.#m}
        @dragleave=${this.#y}
        @drop=${this.#$}
      >
        <div id="bg-drop-label" @drop=${this.#$}>Set Background</div>
      </div>
    `}createRenderRoot(){return super.createRenderRoot()}#g;#f;#w;#y;#m;#$;#_;#k;#x;#C;#S;#A;async apply(t){switch(console.log("APPLYING TO CANVAS",t),t.type){case"token-manipulated":let i=this.tokens.get(t.id);if(!i)return void console.error("Update received for nonexistant token",t.id);Object.assign(i,{dim:t.dim,loc:t.loc,r:t.r});break;case"token-added":this.tokens.set(t.id,{id:t.id,dim:[72,72],loc:t.loc,res:t.res,r:0});break;case"token-removed":if(!this.tokens.delete(t.id))return void console.error("Tried to remove nonexistant token",t.id);break;case"state-sync":console.log("applying tokens",t.tokens),this.tokens=new Map(t.tokens.map((t=>[t.id,t]))),this.bg=t.bg;break;case"file":this.resources.register(t.contents,t.name),this.requestUpdate();break;case"bg":this.bg=t.res}this.requestUpdate()}#M;#b;#n};Zt.styles=o`
    :host {
      position: relative;
      display: block;
      --selection-color: cornflowerblue;
    }

    #root {
      backface-visibility: hidden;
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

    .shadow {
      stroke-width: ${1.5};
      stroke: rgba(0, 0, 0, 0.2);
      filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
    }

    .drop_hint {
      transition: none;
      pointer-events: none;
      fill: gray;
    }

    .selection-box, line.ro {
      stroke: var(--selection-color);
      stroke-width: 1px;
      filter: drop-shadow(0px 0px 2px var(--selection-color));
    }

    .selection-box:hover {
      cursor: move;
    }

    .rn, .rs, .re,.rw {
      stroke-width: ${24};
      vector-effect: non-scaling-stroke;
      stroke: transparent;
    }

    .handle {
      stroke-width: 1px;
      fill: var(--selection-color);
      stroke: white;
    }


    rect.handle {
      width: ${24}px;
      height: ${24}px;
      transform: translate(${-12}px, ${-12}px)
    }

    .ro.handle {
      cursor: crosshair;
    }

    .rn.re, .rs.rw {
      cursor: nesw-resize;
    }

    .rn.rw, .rs.re {
      cursor: nwse-resize;
    }

    .rn, .rs {
      cursor: row-resize;
    }

    .re, .rw {
      cursor: col-resize;
    }

    bg-viewport::part(background) {
      background-color: #ededf0;
    }

    bg-viewport::part(bar) {
      background: rgb(75, 75, 75);
      /* opacity: 0.75; */
      --thickness: 10px;
    }

    bg-viewport::part(bar):hover {
      opacity: 1;
    }

    .token {
      transform-box: fill-box;
      transform-origin: center;
    }
  `,t([ot({type:Number})],Zt.prototype,"width",void 0),t([ot({type:Number})],Zt.prototype,"height",void 0),t([rt()],Zt.prototype,"bg",void 0),t([at("root",!0)],Zt.prototype,"root",void 0),t([at("bg-viewport",!0)],Zt.prototype,"viewport",void 0),t([rt()],Zt.prototype,"_drop_hint",void 0),t([rt()],Zt.prototype,"hovering",void 0),t([rt()],Zt.prototype,"selection",void 0),t([rt()],Zt.prototype,"_selection_transform",void 0),Zt=t([et("bg-canvas")],Zt);const Gt=t=>72*Math.round(t/72),Vt=t=>t-t%72,Yt={iceServers:[{urls:"stun:stun.l.google.com:19302"}]};class qt{constructor(t){this.#R=()=>{},this.#E=new RTCPeerConnection(Yt),this.#O=!1,this.#R=t,this.#P()}#R;#E;#O;async initiate(){this.#O=!0;let t=await this.#E.createOffer();await this.#E.setLocalDescription(t),this.#R({type:"offer",offer:t})}#P(){null!==this.#E.localDescription&&(this.#E.onicecandidate=null,this.#E.onconnectionstatechange=null,this.#E.close()),this.#E=new RTCPeerConnection(Yt),this.data=this.#E.createDataChannel("data",{ordered:!0,negotiated:!0,id:1}),this.events=this.#E.createDataChannel("control",{ordered:!0,negotiated:!0,id:2}),this.#E.onicecandidate=({candidate:t})=>{null!==t&&this.#R({type:"icecandidate",candidate:t})},this.#E.onconnectionstatechange=()=>{"closed"===this.#E.connectionState&&(this.#P(),this.#O&&this.initiate())}}async signal(t){console.log("received",t);let i=this.#E.signalingState;switch(t.type){case"offer":if("stable"!==i)return void console.error(`Received offer at incorrect state: ${i}. Ignoring.`);this.#E.setRemoteDescription(new RTCSessionDescription(t.offer));const s=await this.#E.createAnswer();await this.#E.setLocalDescription(s),this.#R({type:"answer",answer:s});break;case"answer":if("have-local-offer"!==i)return void console.error(`Received answer at incorrect state: ${i}. Ignoring.`);this.#E.setRemoteDescription(new RTCSessionDescription(t.answer));break;case"icecandidate":await this.#E.addIceCandidate(t.candidate)}}}class Ft extends EventTarget{constructor(t,i){super(),this.#U=!1,this.#N="connected",this.#z=new Map,this.#j=t,this.#L=i}#j;#L;#U;#N;#z;get ident(){return this.#j}get status(){return this.#N}static async establish(t,i){i&&(t.pathname="/"+i);let s=await this.#D(t);return console.log("acquired socket for ",i),new Promise(((t,i)=>{s.addEventListener("message",(e=>{let n=JSON.parse(e.data);s.removeEventListener("close",i);let o=new Ft(n.id,s);o.#I(),t(o)}),{once:!0}),s.addEventListener("close",i)}))}static async#D(t){return new Promise(((i,s)=>{let e=new WebSocket(t.toString());e.addEventListener("close",(t=>s(t)),{once:!0}),e.addEventListener("open",(()=>{console.log("WS CONNECTED"),e.removeEventListener("close",s),i(e)}))}))}#I(){let t=new URL(this.#L.url);this.#L.addEventListener("error",(t=>{this.dispatchEvent(new CustomEvent("error",{detail:t}))})),this.#L.addEventListener("close",(()=>this.#J(t))),this.#L.addEventListener("message",(t=>{let i=JSON.parse(t.data);this.#H(i)}))}async connect_to(t){let i=new qt((i=>{this.#L.send(JSON.stringify({target:t,...i})),"shutdown"===i.type&&this.#z.delete(i.from)}));return this.#z.set(t,i),await i.initiate(),i}#B(t){this.#N=t,this.dispatchEvent(new CustomEvent("status",{detail:t}))}async#J(t){let i;if(t.pathname="/"+this.#j,this.#U)this.#B("closed");else{this.#B("disconnected");try{i=await Ft.#D(t)}catch(t){return console.error("Error reconnecting",t),void setTimeout((()=>this.#J),1e3)}this.#L=i,this.#I(),this.#B("connected")}}_disconnect(){this.#L.close()}close(){this.#U=!0,this.#L.close()}#H(t){if(console.log(t),t.error)this.dispatchEvent(new CustomEvent("error",{detail:t.error}));else if("offer"!==t.type||this.#z.has(t.from))this.#z.get(t.from)?.signal(t),"shutdown"===t.type&&this.#z.delete(t.from);else{let i=new qt((i=>{this.#L.send(JSON.stringify({target:t.from,...i})),"shutdown"===t.type&&this.#z.delete(t.from)}));this.#z.set(t.from,i),i.signal(t),this.dispatchEvent(new CustomEvent("peer",{detail:i}))}}}const Kt=t=>{let i=(t=>new ReadableStream({start(i){t.onmessage=({data:t})=>i.enqueue(t);const s=()=>{i.close(),t.removeEventListener("close",s)};t.addEventListener("close",s)},cancel(){t.close()}}))(t).pipeThrough((()=>{let t,i=[];return new TransformStream({start(){},async transform(s,e){if("string"==typeof s){let i=JSON.parse(s);if("event"===i.type)return void e.enqueue(i.event);t=i}else{if(!t)return;if(i.push(s),0==--t.chunks)return e.enqueue({type:"file",name:t.name,contents:new Blob(i)}),void(i=[])}},flush(){i=[]}})})()),s=new TransformStream({start(){},async transform(t,i){if("file"===t.type){i.enqueue(JSON.stringify({type:"file",name:t.name,chunks:Math.ceil(t.contents.size/16e3)}));for(let s=0;s<t.contents.size;s+=16e3)i.enqueue(await t.contents.slice(s,Math.min(s+16e3,t.contents.size)).arrayBuffer())}else i.enqueue(JSON.stringify({type:"event",event:t}))}});return s.readable.pipeTo((t=>{let i;return new WritableStream({start(s){const e=()=>{s.error("Closed"),t.removeEventListener("close",e)};t.addEventListener("close",e),t.onopen=()=>i&&i(),t.onbufferedamountlow=()=>i&&i()},async write(s){("connecting"===t.readyState||t.bufferedAmount>t.bufferedAmountLowThreshold)&&await new Promise(((t,s)=>i=t)),t.send(s)},abort(){t.close()}},new CountQueuingStrategy({highWaterMark:1}))})(t)),{writable:s.writable,readable:i}};class Qt{constructor(t){this.server=this,this.#W=new Set,this.#Z=new Set,this.on_event=()=>{},this.signaler=t;let{readable:i,writable:s}=new TransformStream({start(){},transform(t,i){console.log("TF STREAM"),i.enqueue(t)},flush(){}}),e=i.getReader(),n=s.getWriter();this.signaler.addEventListener("peer",(async({detail:t})=>{let i=Kt(t.events),s=Kt(t.data);const e=i.writable.getWriter(),o=s.writable.getWriter();this.#W.add(e),this.#Z.add(o),console.log("Getting state"),this.get_state&&e.write(this.get_state()),console.log("writing images");for(const[t,i]of this.get_images?this.get_images():[])console.log(t,i),o.write({type:"file",name:t,contents:await(await fetch(i)).blob()});(async()=>{let t,s,o=i.readable.getReader();for(;({value:t,done:s}=await o.read())&&!s;)await n.write({author:e,ev:t});this.#W.delete(e)})(),(async()=>{let t,i,r=s.readable.getReader();for(;({value:t,done:i}=await r.read())&&!i;)await n.write({author:e,ev:t});this.#Z.delete(o)})()})),(async()=>{let t,i,s;for(;({value:{author:s,ev:t},done:i}=await e.read())&&!i;)await this.send_event(t,s),this.on_event(t)})()}get status(){return"connected"===this.signaler.status?"connected":"disconnected"}#W;#Z;async send_event(t,i){let s="file"===t.type?this.#Z:this.#W;await Promise.all(Array.from(s).filter((t=>t!==i)).map((i=>i.write(t))))}static async establish(){return new Qt(await Ft.establish(new URL("wss://battlegrid-signaling.herokuapp.com/")))}}class Xt{constructor(t){this.status="disconnected",this.server=void 0,this.on_event=t=>{},this.on_status=()=>{},this.#G=t}#V;#Y;#G;#B(t){this.status=t,setTimeout(this.on_status,0)}async connect(){let t;this.#B("connecting");try{let i=await Ft.establish(new URL("wss://battlegrid-signaling.herokuapp.com"));t=await new Promise((async(t,s)=>{i.addEventListener("error",s,{once:!0});let e=await i.connect_to(this.#G);e.data.onopen=()=>t(e)}))}catch(t){return console.log("error"),void this.#B("error")}let i=Kt(t.events);this.#V=i.writable.getWriter();let s=i.readable.getReader(),e=Kt(t.data);this.#Y=e.writable.getWriter();let n=e.readable.getReader();this.#B("connected"),(async()=>{let t,i;for(;({value:t,done:i}=await n.read())&&!i;)console.log("DATA",t),this.on_event(t);console.log("dccccc"),this.#B("disconnected")})(),(async()=>{let t,i;for(;({value:t,done:i}=await s.read())&&!i;)console.log("EVENT!",t),this.on_event(t);console.log("dccccc"),this.#B("disconnected")})()}async send_event(t){("file"===t.type?this.#Y:this.#V)?.write(t)}}let ti=class extends it{constructor(){super(...arguments),this.dim=[40,30],this.host_pending=!1,this.#q=()=>{this.dim=[this.width?.value??0,this.height?.value??0],this.client?.send_event({type:"grid-resized",dim:this.dim})},this.#F=()=>{this.client&&!this.client.server&&this.client.connect()},this.#K=()=>{this.client=void 0,window.history.pushState(null,"",window.location.href.split("?")[0])},this.#Q=async()=>{try{this.host_pending=!0;let t=await Qt.establish();this.host_pending=!1,this.client=t,t.on_event=this.#X,t.get_state=this.canvas?.get_state,t.get_images=()=>this.canvas.resources.all(),window.history.pushState({},"","?game="+t.signaler.ident),navigator.clipboard.writeText(window.location.toString())}catch(t){console.error(t)}},this.#X=t=>{console.log("APPLOY!",this.canvas),"state-sync"===t.type&&(this.dim=t.grid_dim),"grid-resized"===t.type?this.dim=t.dim:this.canvas?.apply(t)},this.#tt=t=>{this.client?.send_event(t.detail)}}render(){let t="error"===this.client?.status?U`<div class="message error"><div><h1>Error connecting to remote grid</h1><button @click="${this.#F}">Try again</button> <button @click="${this.#K}">New local grid</button></div></div>`:null,i="connecting"===this.client?.status?U`<div class="message"><div><h1>Connecting to grid...</h1></div></div>`:null,s="disconnected"===this.client?.status?U`<div class="message"><div><h1>Disconnected from host</h1><button @click="${this.#F}">Try again</button> <button @click="${this.#K}">Continue locally</button></div></div>`:null,e=t||i||s;return U`<section id="toolbar"><div>Grid: <input id="width" type="number" @input="${this.#q}" value="${this.dim[0]}"> x <input id="height" type="number" @input="${this.#q}" value="${this.dim[1]}"></div>${this.host_pending?U`<img src="assets/loading.svg">`:this.client?U`<div>${this.client.server?"hosting":this.client.status}</div>`:U`<button @click="${this.#Q}">Host</button>`}</section><bg-canvas .width="${this.dim[0]}" .height="${this.dim[1]}" @game-event="${this.#tt}"></bg-canvas>${e}`}updated(t){t.has("client")&&(document.title="BattleGrid"+(this.client&&"connected"===this.client.status?this.client.server?"- Hosting":"- Connected":""))}#q;async connectedCallback(){super.connectedCallback();let t=new URLSearchParams(window.location.search).get("game");if(!t)return{};let i=new Xt(t);i.on_event=this.#X,i.on_status=()=>this.requestUpdate("client"),this.client=i,await i.connect()}#F;#K;#Q;#X;#tt};ti.styles=o`:host{width:100%;height:100%;display:grid;grid:"toolbar" 30px "viewport" 1fr/1fr;font-family:inherit;--ui-bg:#f9f9fa}.message{grid-area:1/1/3/1;display:grid;align-items:center;justify-items:center;background:#fff;z-index:2}bg-canvas{grid-area:viewport;z-index:1}input[type=number]{width:3em}#toolbar{grid-area:toolbar;box-shadow:0 0 4px gray;z-index:2;background:var(--ui-bg);display:flex;align-items:center}#toolbar>*{max-height:100%}`,t([rt()],ti.prototype,"dim",void 0),t([at("#width",!0)],ti.prototype,"width",void 0),t([at("#height",!0)],ti.prototype,"height",void 0),t([at("bg-canvas",!0)],ti.prototype,"canvas",void 0),t([rt()],ti.prototype,"client",void 0),t([rt()],ti.prototype,"host_pending",void 0),ti=t([et("bg-app")],ti),document.body.addEventListener("wheel",(t=>{console.log("HUH..."),t.ctrlKey&&t.preventDefault()}),{passive:!1});
//# sourceMappingURL=bundle.js.map
