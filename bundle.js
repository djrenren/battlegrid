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
function t(t,i,s,e){var o,n=arguments.length,r=n<3?i:null===e?e=Object.getOwnPropertyDescriptor(i,s):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,i,s,e);else for(var h=t.length-1;h>=0;h--)(o=t[h])&&(r=(n<3?o(r):n>3?o(i,s,r):o(i,s))||r);return n>3&&r&&Object.defineProperty(i,s,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const i=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),e=new Map;class o{constructor(t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=e.get(this.cssText);return i&&void 0===t&&(e.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const n=(t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,s,e)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[e+1]),t[0]);return new o(e,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",s))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var h;const l=window.trustedTypes,a=l?l.emptyScript:"",c=window.reactiveElementPolyfillSupport,d={toAttribute(t,i){switch(i){case Boolean:t=t?a:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},u=(t,i)=>i!==t&&(i==i||t==t),v={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class p extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e))})),t}static createProperty(t,i=v){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e)}}static getPropertyDescriptor(t,i,s){return{get(){return this[i]},set(e){const o=this[t];this[i]=e,this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)i.unshift(r(t))}else void 0!==t&&i.push(r(t));return i}static _$Eh(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,s;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((i=>{const s=document.createElement("style"),e=window.litNonce;void 0!==e&&s.setAttribute("nonce",e),s.textContent=i.cssText,t.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$ES(t,i,s=v){var e,o;const n=this.constructor._$Eh(t,s);if(void 0!==n&&!0===s.reflect){const r=(null!==(o=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==o?o:d.toAttribute)(i,s.type);this._$Ei=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Ei=null}}_$AK(t,i){var s,e,o;const n=this.constructor,r=n._$Eu.get(t);if(void 0!==r&&this._$Ei!==r){const t=n.getPropertyOptions(r),h=t.converter,l=null!==(o=null!==(e=null===(s=h)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof h?h:null)&&void 0!==o?o:d.fromAttribute;this._$Ei=r,this[r]=l(i,t.type),this._$Ei=null}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU()}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s)}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$E_=void 0),this._$EU()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;p.finalized=!0,p.elementProperties=new Map,p.elementStyles=[],p.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:p}),(null!==(h=globalThis.reactiveElementVersions)&&void 0!==h?h:globalThis.reactiveElementVersions=[]).push("1.2.1");const f=globalThis.trustedTypes,w=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,b=`lit$${(Math.random()+"").slice(9)}$`,m="?"+b,y=`<${m}>`,$=document,k=(t="")=>$.createComment(t),x=t=>null===t||"object"!=typeof t&&"function"!=typeof t,_=Array.isArray,S=t=>{var i;return _(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,A=/>/g,T=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,E=/'/g,R=/"/g,U=/^(?:script|style|textarea)$/i,z=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),O=z(1),N=z(2),P=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),L=new WeakMap,D=$.createTreeWalker($,129,null,!1),I=(t,i)=>{const s=t.length-1,e=[];let o,n=2===i?"<svg>":"",r=C;for(let i=0;i<s;i++){const s=t[i];let h,l,a=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===C?"!--"===l[1]?r=M:void 0!==l[1]?r=A:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=T):void 0!==l[3]&&(r=T):r===T?">"===l[0]?(r=null!=o?o:C,a=-1):void 0===l[1]?a=-2:(a=r.lastIndex-l[2].length,h=l[1],r=void 0===l[3]?T:'"'===l[3]?R:E):r===R||r===E?r=T:r===M||r===A?r=C:(r=T,o=void 0);const d=r===T&&t[i+1].startsWith("/>")?" ":"";n+=r===C?s+y:a>=0?(e.push(h),s.slice(0,a)+"$lit$"+s.slice(a)+b+d):s+b+(-2===a?(e.push(void 0),i):d)}const h=n+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(h):h,e]};class B{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let o=0,n=0;const r=t.length-1,h=this.parts,[l,a]=I(t,i);if(this.el=B.createElement(l,s),D.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(e=D.nextNode())&&h.length<r;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(b)){const s=a[n++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+"$lit$").split(b),i=/([.?@])?(.*)/.exec(s);h.push({type:1,index:o,name:i[2],strings:t,ctor:"."===i[1]?G:"?"===i[1]?V:"@"===i[1]?q:Z})}else h.push({type:6,index:o})}for(const i of t)e.removeAttribute(i)}if(U.test(e.tagName)){const t=e.textContent.split(b),i=t.length-1;if(i>0){e.textContent=f?f.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],k()),D.nextNode(),h.push({type:2,index:++o});e.append(t[i],k())}}}else if(8===e.nodeType)if(e.data===m)h.push({type:2,index:o});else{let t=-1;for(;-1!==(t=e.data.indexOf(b,t+1));)h.push({type:7,index:o}),t+=b.length-1}o++}}static createElement(t,i){const s=$.createElement("template");return s.innerHTML=t,s}}function J(t,i,s=t,e){var o,n,r,h;if(i===P)return i;let l=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const a=x(i)?void 0:i._$litDirective$;return(null==l?void 0:l.constructor)!==a&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===a?l=void 0:(l=new a(t),l._$AT(t,s,e)),void 0!==e?(null!==(r=(h=s)._$Cl)&&void 0!==r?r:h._$Cl=[])[e]=l:s._$Cu=l),void 0!==l&&(i=J(t,l._$AS(t,i.values),l,e)),i}class H{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:$).importNode(s,!0);D.currentNode=o;let n=D.nextNode(),r=0,h=0,l=e[0];for(;void 0!==l;){if(r===l.index){let i;2===l.type?i=new W(n,n.nextSibling,this,t):1===l.type?i=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(i=new F(n,this,t)),this.v.push(i),l=e[++h]}r!==(null==l?void 0:l.index)&&(n=D.nextNode(),r++)}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class W{constructor(t,i,s,e){var o;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=J(this,t,i),x(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==P&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):S(t)?this.A(t):this.$(t)}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==j&&x(this._$AH)?this._$AA.nextSibling.data=t:this.S($.createTextNode(t)),this._$AH=t}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=B.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else{const t=new H(o,this),i=t.p(this.options);t.m(s),this.S(i),this._$AH=t}}_$AC(t){let i=L.get(t.strings);return void 0===i&&L.set(t.strings,i=new B(t)),i}A(t){_(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new W(this.M(k()),this.M(k()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class Z{constructor(t,i,s,e,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=J(this,t,i,0),n=!x(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{const e=t;let r,h;for(t=o[0],r=0;r<o.length-1;r++)h=J(this,e[s+r],i,r),h===P&&(h=this._$AH[r]),n||(n=!x(h)||h!==this._$AH[r]),h===j?t=j:t!==j&&(t+=(null!=h?h:"")+o[r+1]),this._$AH[r]=h}n&&!e&&this.k(t)}k(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends Z{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===j?void 0:t}}const K=f?f.emptyScript:"";class V extends Z{constructor(){super(...arguments),this.type=4}k(t){t&&t!==j?this.element.setAttribute(this.name,K):this.element.removeAttribute(this.name)}}class q extends Z{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5}_$AI(t,i=this){var s;if((t=null!==(s=J(this,t,i,0))&&void 0!==s?s:j)===P)return;const e=this._$AH,o=t===j&&e!==j||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==j&&(e===j||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class F{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const Y={P:"$lit$",V:b,L:m,I:1,N:I,R:H,D:S,j:J,H:W,O:Z,F:V,B:q,W:G,Z:F},Q=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var X,tt;null==Q||Q(B,W),(null!==(g=globalThis.litHtmlVersions)&&void 0!==g?g:globalThis.litHtmlVersions=[]).push("2.1.2");class it extends p{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,i;const s=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=s.firstChild),s}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=((t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let r=n._$litPart$;if(void 0===r){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=r=new W(i.insertBefore(k(),t),t,void 0,null!=s?s:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1)}render(){return P}}it.finalized=!0,it._$litElement$=!0,null===(X=globalThis.litElementHydrateSupport)||void 0===X||X.call(globalThis,{LitElement:it});const st=globalThis.litElementPolyfillSupport;null==st||st({LitElement:it}),(null!==(tt=globalThis.litElementVersions)&&void 0!==tt?tt:globalThis.litElementVersions=[]).push("3.1.2");
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
 */,ot=(t,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(s){s.createProperty(i.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(s){s.createProperty(i.key,t)}};function nt(t){return(i,s)=>void 0!==s?((t,i,s)=>{i.constructor.createProperty(s,t)})(t,i,s):ot(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function rt(t){return nt({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=({finisher:t,descriptor:i})=>(s,e)=>{var o;if(void 0===e){const e=null!==(o=s.originalKey)&&void 0!==o?o:s.key,n=null!=i?{kind:"method",placement:"prototype",key:e,descriptor:i(s.key)}:{...s,key:e};return null!=t&&(n.finisher=function(i){t(i,e)}),n}{const o=s.constructor;void 0!==i&&Object.defineProperty(s,e,i(e)),null==t||t(o,e)}}
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
 */const gt=vt(class extends pt{constructor(t){var i;if(super(t),t.type!==dt||"style"!==t.name||(null===(i=t.strings)||void 0===i?void 0:i.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((i,s)=>{const e=t[s];return null==e?i:i+`${s=s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${e};`}),"")}update(t,[i]){const{style:s}=t.element;if(void 0===this.ct){this.ct=new Set;for(const t in i)this.ct.add(t);return this.render(i)}this.ct.forEach((t=>{null==i[t]&&(this.ct.delete(t),t.includes("-")?s.removeProperty(t):s[t]="")}));for(const t in i){const e=i[t];null!=e&&(this.ct.add(t),t.includes("-")?s.setProperty(t,e):s[t]=e)}return P}}),ft=t=>t.isPrimary&&("touch"===t.pointerType||t.pressure>0),wt=t=>"mouse"===t.pointerType&&1===t.buttons&&t.pressure>0,bt=t=>"touch"!==t.pointerType&&t.isPrimary&&t.pressure>0,mt=t=>{t.preventDefault(),t.stopPropagation()},yt=(t,i)=>new CustomEvent(t,{detail:i}),$t=(t,i)=>[t[0]+i[0],t[1]+i[1]],kt=(t,i)=>$t(t,[i,i]),xt=(t,i)=>[t[0]-i[0],t[1]-i[1]],_t=(t,i)=>[t[0]*i,t[1]*i],St=(t,i)=>[t[0]*i[0],t[1]*i[1]],Ct=(t,i)=>[t[0]/i[0],t[1]/i[1]],Mt=(t,i)=>[t[0]/i,t[1]/i],At=(t,i)=>[Math.max(t[0],i[0]),Math.max(t[1],i[1])],Tt=(t,i)=>[Math.min(t[0],i[0]),Math.min(t[1],i[1])],Et=(t,i,s)=>At(t,Tt(i,s)),Rt=(t,i)=>t[0]===i[0]&&t[1]===i[1];let Ut=class extends it{constructor(){super(...arguments),this.scale=1,this.c_dim=[0,0],this.v_dim=[0,0],this.v_loc=[0,0],this._scrollPos=[0,0],this.smooth=0,this.#t=0,this.#i=[0,0],this.#s=new ResizeObserver((t=>{for(let i of t)switch(i.target){case this.surface:this.v_dim=[i.contentRect.width,i.contentRect.height];const t=this.getBoundingClientRect();this.v_loc=[t.x,t.y],this.smooth=0;break;case this.#e:this.c_dim=[this.#e.width.baseVal.value,this.#e.height.baseVal.value]}})),this.#o=t=>{t.ctrlKey&&("="===t.key?(mt(t),this.smooth=200,this._performZoom(this.coordToLocal(Mt($t(this.v_loc,this.v_dim),2)),.2*this.scale)):"-"===t.key?(mt(t),this.smooth=200,this._performZoom(this.coordToLocal(Mt($t(this.v_loc,this.v_dim),2)),-.2*this.scale)):"0"===t.key&&(this.smooth=100,this.#n()))},this.#r=[0,0],this.#h=t=>{mt(t),t.target.setPointerCapture(t.pointerId),this.#r=[t.clientX,t.clientY]},this.#l=(t,i,s,e)=>{this.smooth=0;let o=this.#a,n=this.#r;this.#r=[t.clientX,t.clientY],this.#a=[i?o[0]+e*(this.#r[0]-n[0]):o[0],s?o[1]+e*(this.#r[1]-n[1]):o[1]]},this.#c=t=>{t.target.releasePointerCapture(t.pointerId)},this._touchdragstart=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#h(t)},this._touchdragmove=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#l(t,!0,!0,-1)},this._touchdragend=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#c(t)}}#e;get#a(){return At([0,0],Tt(this._scrollPos,xt(_t(this.c_dim,this.scale),this.v_dim)))}set#a(t){const i=this._scrollPos;this._scrollPos=t,this.requestUpdate("#scrollPos",i)}get offset(){return At([0,0],_t(xt(this.v_dim,_t(this.c_dim,this.scale)),.5)).map((t=>t))}render(){const t=this.offset,i=this.#a;let s=!1,e=!1;this.v_dim&&this.c_dim&&(s=this.v_dim[1]<this.c_dim[1]*this.scale,e=this.v_dim[0]<this.c_dim[0]*this.scale);const o=Ct(St(this.v_dim,this.v_dim),_t(this.c_dim,this.scale)),n=Ct(St(i,this.v_dim),_t(this.c_dim,this.scale));return O`<style>:host,:root{--scale:${this.scale}}::slotted(svg){transform:translate(${t[0]-i[0]}px,${t[1]-i[1]}px) scale(var(--scale))}*,::slotted(svg){transition-duration:${this.smooth+"ms"}}</style><div id="touch-surface" @wheel="${this._wheel}" @pointerdown="${this._touchdragstart}" @pointermove="${this._touchdragmove}" @pointerup="${this._touchdragend}" @gesturestart="${this._gesturestart}" @gesturechange="${this._gesturechange}"><div id="bg" part="background"></div><slot @slotchange="${this.handleSlotchange}"></slot><div part="bar" class="bottombar" style="${gt({transform:`translate(${n[0]}px, 0)`,width:`${o[0]}px`,display:e?"block":"none"})}" @pointerdown="${this.#d}" @pointermove="${this.#u}" @pointerup="${this.#v}"></div><div part="bar" class="rightbar" style="${gt({transform:`translate(0, ${n[1]}px)`,height:`${o[1]}px`,display:s?"block":"none"})}" @pointerdown="${this.#d}" @pointermove="${this.#p}" @pointerup="${this.#v}"></div></div>`}#d(t){bt(t)&&this.#h(t)}#u(t){bt(t)&&this.#l(t,!0,!1,this.c_dim[0]*this.scale/this.v_dim[0])}#p(t){bt(t)&&this.#l(t,!1,!0,this.c_dim[1]*this.scale/this.v_dim[1])}#v(t,i){this.#c(t)}_wheel(t){mt(t);const i=t.deltaMode===WheelEvent.DOM_DELTA_LINE?10:1;if(t.ctrlKey){const s=Math.min(50,Math.max(-50,-t.deltaY*i)),e=.005*s*this.scale;this.smooth=50===Math.abs(s)?300:0,this._performZoom(this.coordToLocal([t.clientX,t.clientY]),e)}else{const s=_t([t.deltaX,t.deltaY],i);this.smooth=2*(Math.abs(s[0])+Math.abs(s[1])),this.smooth=0,this.#a=$t(s,this.#a)}}#t;#i;_gesturestart(t){this.#i=this.coordToLocal([t.clientX,t.clientY]),this.#t=1,mt(t)}_gesturechange(t){mt(t),this._performZoom(this.#i,this.scale*(t.scale-this.#t)*1.5),this.#t=t.scale}_performZoom(t,i){let s=Math.min(1,Math.max(.2,this.scale+i)),e=s-this.scale;this.#a=$t(_t(t,e),this.#a),this.scale=s}#s;firstUpdated(){this.#s.observe(this.surface)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.#o)}disconnectedCallback(){super.disconnectedCallback(),this.#s.disconnect(),document.removeEventListener("keydown",this.#o)}#o;coordToLocal(t){const i=$t(xt(t,this.v_loc),this.#a);return Mt(xt(i,this.offset),this.scale)}handleSlotchange({target:t}){this.#e&&this.#s.unobserve(this.#e),this.#e=t.assignedElements().find((t=>t.matches("svg"))),this.#n(),this.#e&&this.#s.observe(this.#e)}#n(){const t=[this.#e.width.baseVal.value,this.#e.height.baseVal.value],i=this.surface.getBoundingClientRect();this.scale=Math.max(.2,Math.min(1,..._t(Ct([i.width,i.height],t),.95)))}#r;#h;#l;#c;static get styles(){return n`#touch-surface{position:relative;width:100%;height:100%;overflow:clip}::slotted(svg){transform-origin:0 0;position:absolute}.bottombar{position:fixed;bottom:0;height:var(--thickness);transform-origin:0 0;backface-visibility:hidden;will-change:width}.rightbar{position:fixed;width:var(--thickness);transform-origin:0 0;backface-visibility:hidden;right:0;will-change:height}*,::slotted(svg){transition-property:all}#bg{position:absolute;z-index:-1;height:100%;width:100%}`}};t([nt({type:Number})],Ut.prototype,"scale",void 0),t([rt()],Ut.prototype,"c_dim",void 0),t([rt()],Ut.prototype,"v_dim",void 0),t([rt()],Ut.prototype,"v_loc",void 0),t([rt()],Ut.prototype,"_scrollPos",void 0),t([at("#touch-surface",!0)],Ut.prototype,"surface",void 0),t([rt()],Ut.prototype,"smooth",void 0),t([lt({passive:!1,capture:!0})],Ut.prototype,"_wheel",null),t([lt({capture:!0})],Ut.prototype,"_gesturestart",null),t([lt({passive:!1})],Ut.prototype,"_gesturechange",null),Ut=t([et("bg-viewport")],Ut);const zt=()=>{document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`)};window.addEventListener("resize",zt),zt();
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{H:Ot}=Y,Nt=()=>document.createComment(""),Pt=(t,i,s)=>{var e;const o=t._$AA.parentNode,n=void 0===i?t._$AB:i._$AA;if(void 0===s){const i=o.insertBefore(Nt(),n),e=o.insertBefore(Nt(),n);s=new Ot(i,e,t,t.options)}else{const i=s._$AB.nextSibling,r=s._$AM,h=r!==t;if(h){let i;null===(e=s._$AQ)||void 0===e||e.call(s,t),s._$AM=t,void 0!==s._$AP&&(i=t._$AU)!==r._$AU&&s._$AP(i)}if(i!==n||h){let t=s._$AA;for(;t!==i;){const i=t.nextSibling;o.insertBefore(t,n),t=i}}}return s},jt=(t,i,s=t)=>(t._$AI(i,s),t),Lt={},Dt=t=>{var i;null===(i=t._$AP)||void 0===i||i.call(t,!1,!0);let s=t._$AA;const e=t._$AB.nextSibling;for(;s!==e;){const t=s.nextSibling;s.remove(),s=t}},It=(t,i,s)=>{const e=new Map;for(let o=i;o<=s;o++)e.set(t[o],o);return e},Bt=vt(class extends pt{constructor(t){if(super(t),t.type!==ut)throw Error("repeat() can only be used in text expressions")}dt(t,i,s){let e;void 0===s?s=i:void 0!==i&&(e=i);const o=[],n=[];let r=0;for(const i of t)o[r]=e?e(i,r):r,n[r]=s(i,r),r++;return{values:n,keys:o}}render(t,i,s){return this.dt(t,i,s).values}update(t,[i,s,e]){var o;const n=(t=>t._$AH)(t),{values:r,keys:h}=this.dt(i,s,e);if(!Array.isArray(n))return this.at=h,r;const l=null!==(o=this.at)&&void 0!==o?o:this.at=[],a=[];let c,d,u=0,v=n.length-1,p=0,g=r.length-1;for(;u<=v&&p<=g;)if(null===n[u])u++;else if(null===n[v])v--;else if(l[u]===h[p])a[p]=jt(n[u],r[p]),u++,p++;else if(l[v]===h[g])a[g]=jt(n[v],r[g]),v--,g--;else if(l[u]===h[g])a[g]=jt(n[u],r[g]),Pt(t,a[g+1],n[u]),u++,g--;else if(l[v]===h[p])a[p]=jt(n[v],r[p]),Pt(t,n[u],n[v]),v--,p++;else if(void 0===c&&(c=It(h,p,g),d=It(l,u,v)),c.has(l[u]))if(c.has(l[v])){const i=d.get(h[p]),s=void 0!==i?n[i]:null;if(null===s){const i=Pt(t,n[u]);jt(i,r[p]),a[p]=i}else a[p]=jt(s,r[p]),Pt(t,n[u],s),n[i]=null;p++}else Dt(n[v]),v--;else Dt(n[u]),u++;for(;p<=g;){const i=Pt(t,a[g+1]);jt(i,r[p]),a[p++]=i}for(;u<=v;){const t=n[u++];null!==t&&Dt(t)}return this.at=h,((t,i=Lt)=>{t._$AH=i})(t,a),P}}),Jt=async t=>{let i=t.dataTransfer?.items??[];return new Promise((async(t,s)=>{console.log("DataItems",i.length);for(let s=0;s<i.length;s++){if(console.log(i[s].type),i[s].type.startsWith("image/"))return t(i[s].getAsFile());if("text/html"===i[s].type)return void i[s].getAsString((i=>t(Ht(i))));if("application/x-moz-file-promise-url"===i[s].type)return void i[s].getAsString((t=>{}));if("string"===i[s].kind){let t=i[s].type;i[s].getAsString((i=>console.log(t,i)))}}return s("No compatible drop type found")}))};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ht(t){const i=(new DOMParser).parseFromString(t,"text/html").querySelector("img")?.src;return i??null}const Wt=()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(t=>(t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>t/4).toString(16))),Zt=t=>new CustomEvent("game-event",{detail:t});class Gt{constructor(){this.order=[],this.map=new Map}get(t){const i=this.map.get(t);if(void 0!==i)return this.order[i]}has(t){return this.map.has(t)}add(t,i){this.map.set(t,this.order.length),this.order.push(i)}delete(t){const i=this.map.get(t);return void 0!==i&&(this.order.splice(i,1),this.map.delete(t),this.map.forEach(((t,s)=>{t>=i&&this.map.set(s,t-1)})),!0)}index(t){return this.map.get(t)}set_index(t,i){const s=this.map.get(t);if(void 0===s||i>=this.order.length)return!1;const e=this.order.splice(s,1)[0];return this.order.splice(i,0,e),this.map.forEach(((t,s)=>{t>=i&&this.map.set(s,t+1)})),this.map.set(t,i),!0}values(){return this.order}get size(){return this.map.size}}let Kt=class extends it{constructor(){super(),this.width=30,this.height=40,this.tokens=new Gt,this.selection=[],this.#g=0,this.#f=t=>{mt(t),this.#g++},this.#w=t=>{mt(t);const i=this.#b(t).map(qt),s=_t(kt([this.width,this.height],-1),72);this._drop_hint=Et([0,0],s,i),this.hovering="canvas"},this.#m=t=>{--this.#g<=0&&(this._drop_hint=void 0,this.hovering=void 0)},this.#y=t=>{mt(t),this._drop_hint=void 0,this.hovering="bg"},this.#$=async t=>{mt(t);try{const i=await Jt(t);this.dispatchEvent(yt("bg-drop",i))}catch(t){}this.#g=0,this.hovering=void 0},this.#k=async t=>{mt(t);try{const i=await Jt(t);this.dispatchEvent(yt("token-drop",{loc:this._drop_hint,dim:[72,72],img:i}))}catch(t){}this._drop_hint=void 0,this.hovering=void 0},this.#x=t=>{wt(t)&&(t.preventDefault(),t.stopPropagation(),this.dispatchEvent(yt("token-select",[t.target.id])))},this.#_=t=>{ft(t)&&(mt(t),t.target.setPointerCapture(t.pointerId),this.#S=this.#b(t))},this.#C={move:[0,0],resize:[0,0],r:0},this.#M=t=>{if(!ft(t))return;this.#S||this.#_(t),mt(t);const i=Et([0,0],this.#A,this.#b(t)),s=this.tokens.get(this.selection[0]),e=s.dim,o=s.loc,n=t.target.classList;let r=[0,0],h=[0,0],l=0;if(n.contains("rn")&&(h[1]=o[1]-Vt(i[1]),r[1]=Vt(i[1])-o[1]),n.contains("rw")&&(h[0]=o[0]-Vt(i[0]),r[0]=Vt(i[0])-o[0]),n.contains("rs")&&(h[1]=Vt(i[1])-e[1]-o[1]),n.contains("re")&&(h[0]=Vt(i[0])-e[0]-o[0]),n.contains("ro")){const t=$t(o,Mt(e,2)),n=xt(i,t),r=180*Math.atan2(n[0],-n[1])/Math.PI;l=90*Math.round(r/90)-s.r%360}n.contains("selection-box")?r=xt(i,this.#S).map(Vt):(r=Tt(kt(e,-72),r),h=At(kt(_t(e,-1),72),h)),l===this.#C.r&&Rt(r,this.#C.move)&&Rt(h,this.#C.resize)||(this.#S=$t(this.#S,r),this.#C={move:[0,0],resize:[0,0],r:0},this.dispatchEvent(Zt({type:"token-manipulated",tokens:this.selection.map((t=>{let i=this.tokens.get(t);return{id:i.id,loc:$t(i.loc,r),dim:$t(i.dim,h),r:i.r+l}}))})))},this.#T=t=>{mt(t),this.#S=void 0},this.#b=t=>xt(this.viewport.coordToLocal([t.clientX,t.clientY]),[60,60]),this.#o=t=>{if(!this.selection)return;if(8===t.keyCode)return this.dispatchEvent(Zt({type:"token-removed",ids:this.selection})),void mt(t);this.tokens.get(this.selection[0]);let i={ArrowUp:[0,-72],ArrowDown:[0,72],ArrowLeft:[-72,0],ArrowRight:[72,0]}[t.key];i&&(this.dispatchEvent(Zt({type:"token-manipulated",tokens:this.selection.map((t=>{const s=this.tokens.get(t),e=Et([0,0],xt(this.#A,s.dim),$t(s.loc,i));return{id:s.id,loc:e,dim:s.dim,r:s.r}}))})),mt(t))}}#E;get#A(){return _t([this.width,this.height],72)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.#o)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.#o)}render(){let[t,i]=this.#A,s=this.#R(),e=1===this.selection.length?this.tokens.get(this.selection[0]):void 0;return O`
      <bg-viewport
        @pointerdown=${this.#U}
        @pointermove=${this.#z}
        @pointerup=${this.#O}
        @dragstart=${mt}
        @dragenter=${this.#f}
        @dragleave=${this.#m}
        @dragstop=${this.#m}
        @dragover=${this.#w}
        @drop=${this.#k}
      >
        <svg id="root" width=${t+120} height=${i+120}>
          <defs>
            <clipPath id="canvasClip">
              <rect width=${t} height=${i} rx=${15}></rect>
            </clipPath>
            <pattern id="horiz" x=${-.75} y=${-.75} width="100%" height=${72} patternUnits="userSpaceOnUse">
              <rect class="gridline" width="100%" height=${1.5} fill="#d3d3d3"></rect>
            </pattern>
            <pattern id="vert" x=${-.75} y=${-.75} width=${72} height="100%" patternUnits="userSpaceOnUse">
              <rect class="gridline" width=${1.5} height="100%" fill="#d3d3d3"></rect>
            </pattern>
          </defs>
          <svg x=${60} y=${60} width=${t} height=${i} id="surface">
            <rect class="shadow" width="100%" height="100%" fill="white" rx=${15}></rect>
            <svg clip-path="url(#canvasClip)">
              ${this.bg?N`<image href=${this.bg} width="100%" height="100%" preserveAspectRatio="none" style="will-change: transform"></image>`:null}
              <rect width="100%" height="100%" fill="url(#horiz)" opacity="0.75" pointer-events="none"></rect>
              <rect width="100%" height="100%" fill="url(#vert)" opacity="0.75" pointer-events="none"></rect>
              <svg id="tokens">
                ${Bt(this.tokens.values(),(t=>t.id),((t,i)=>{const s=this.resources?.get(t.res),[e,o]=kt(t.dim,-1.5),[n,r]=kt(t.loc,.75);return O`
                      <svg
                        viewBox="0 0 1 1"
                        x=${n}
                        y=${r}
                        width=${e}
                        height=${o}
                        fill=${s?"transparent":"white"}
                        preserveAspectRatio="none"
                      >
                        <image
                          id=${t.id}
                          class="token"
                          width="1"
                          height="1"
                          href=${s||"assets/loading.svg"}
                          style=${`transform: rotate(${t.r}deg)`}
                          preserveAspectRatio=${s?"none":""}
                          image-rendering="optimizeSpeed"
                          @pointerdown=${this.#x}
                        ></image>
                      </svg>
                    `}))}
              </svg>
              ${this._drop_hint?N`
            <rect
                class="drop_hint"
                x=${this._drop_hint[0]}
                y=${this._drop_hint[1]}
                width=${72}
                height=${72}
                ></rect>
          `:null}
            </svg>
            ${this.#E?N`
              <rect id="sbox"
                x=${Math.min(this.#E.pin[0],this.#E.mouse[0])}
                y=${Math.min(this.#E.pin[1],this.#E.mouse[1])}
                width=${Math.abs(this.#E.pin[0]-this.#E.mouse[0])}
                height=${Math.abs(this.#E.pin[1]-this.#E.mouse[1])}
                ></rect>
              `:null}
            ${s?N`
            <svg
              id="selection"
              @pointerdown=${this.#_}
              @pointermove=${this.#M}
              @pointerup=${this.#T}
              @click=${mt}
              x=${s.start[0]}
              y=${s.start[1]}
              width=${s.end[0]-s.start[0]}
              height=${s.end[1]-s.start[1]}
            >
            <rect
                class="selection-box"
                width="100%"
                height="100%"
                @click=${mt}
                fill="transparent"
            ></rect>
            ${e?N`
            <g style=${`transform-origin: center; transform: rotate(${e.r}deg) translateY(${Math.sign((e.r-180)%180)*(e.dim[0]-e.dim[1])/2}px)`}>
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
            </svg>`:null}`:null}
          </svg>
        </svg>
      </bg-viewport>
      <div
        id="bg-drop"
        class=${this.hovering??""}
        @dragenter=${this.#f}
        @dragover=${this.#y}
        @dragleave=${this.#m}
        @drop=${this.#$}
      >
        <div id="bg-drop-label" @drop=${this.#$}>Set Background</div>
      </div>
    `}createRenderRoot(){return super.createRenderRoot()}#g;#f;#w;#m;#y;#$;#k;#x;#U(t){if(!wt(t))return;t.target.setPointerCapture(t.pointerId);const i=this.#b(t);this.#E={pin:i,mouse:i}}#z(t){this.#E&&(this.#E.mouse=this.#b(t),this.requestUpdate())}#O(t){if(!this.#E)return;t.target.setPointerCapture(t.pointerId);const i=Tt(this.#E.pin,this.#E.mouse),s=(t=>[Math.abs(t[0]),Math.abs(t[1])])(xt(this.#E.pin,this.#E.mouse)),e={start:i,end:$t(i,s)};console.log("box",e);const o=this.tokens.order.filter((t=>((t,i)=>!(i.start[0]>t.end[0]||i.end[0]<t.start[0]||i.start[1]>t.end[1]||i.end[1]<t.start[1]))(e,{start:t.loc,end:$t(t.loc,t.dim)}))).map((t=>t.id));console.log(o),this.#E=void 0,this.dispatchEvent(yt("token-select",o)),this.requestUpdate()}#R(){if(0===this.selection.length)return;const t=this.selection.map((t=>this.tokens.get(t))).filter((t=>t));let i=t[0].loc,s=$t(t[0].loc,t[0].dim);return t.forEach((t=>{i=Tt(i,t.loc),s=At(s,$t(t.loc,t.dim))})),{start:i,end:s}}#S;#_;#C;#M;#T;#b;#o};Kt.styles=n`
    :host {
      position: relative;
      display: block;
      --selection-color: cornflowerblue;
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
      stroke-width: ${1.5};
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
    }

    .selection-box:hover {
      cursor: move;
    }

    .rn,
    .rs,
    .re,
    .rw {
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
      transform: translate(${-12}px, ${-12}px);
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

    bg-viewport::part(background) {
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
    }
  `,t([nt({type:Number})],Kt.prototype,"width",void 0),t([nt({type:Number})],Kt.prototype,"height",void 0),t([nt()],Kt.prototype,"bg",void 0),t([nt({attribute:!1})],Kt.prototype,"tokens",void 0),t([nt({attribute:!1})],Kt.prototype,"resources",void 0),t([nt({attribute:!1})],Kt.prototype,"selection",void 0),t([nt({attribute:!1})],Kt.prototype,"sel_bbox",void 0),t([at("root",!0)],Kt.prototype,"root",void 0),t([at("bg-viewport",!0)],Kt.prototype,"viewport",void 0),t([rt()],Kt.prototype,"_drop_hint",void 0),t([rt()],Kt.prototype,"hovering",void 0),Kt=t([et("bg-canvas")],Kt);const Vt=t=>72*Math.round(t/72),qt=t=>t-t%72,Ft={iceServers:[{urls:"stun:stun.l.google.com:19302"}]};class Yt{constructor(t){this.#N=()=>{},this.#P=new RTCPeerConnection(Ft),this.#j=!1,this.#N=t,this.#L()}#N;#P;#j;async initiate(){this.#j=!0;let t=await this.#P.createOffer();await this.#P.setLocalDescription(t),this.#N({type:"offer",offer:t})}#L(){null!==this.#P.localDescription&&(this.#P.onicecandidate=null,this.#P.onconnectionstatechange=null,this.#P.close()),this.#P=new RTCPeerConnection(Ft),this.data=this.#P.createDataChannel("data",{ordered:!0,negotiated:!0,id:1}),this.events=this.#P.createDataChannel("control",{ordered:!0,negotiated:!0,id:2}),this.#P.onicecandidate=({candidate:t})=>{null!==t&&this.#N({type:"icecandidate",candidate:t})},this.#P.onconnectionstatechange=()=>{"closed"===this.#P.connectionState&&(this.#L(),this.#j&&this.initiate())}}async signal(t){console.log("received",t);let i=this.#P.signalingState;switch(t.type){case"offer":if("stable"!==i)return void console.error(`Received offer at incorrect state: ${i}. Ignoring.`);this.#P.setRemoteDescription(new RTCSessionDescription(t.offer));const s=await this.#P.createAnswer();await this.#P.setLocalDescription(s),this.#N({type:"answer",answer:s});break;case"answer":if("have-local-offer"!==i)return void console.error(`Received answer at incorrect state: ${i}. Ignoring.`);this.#P.setRemoteDescription(new RTCSessionDescription(t.answer));break;case"icecandidate":await this.#P.addIceCandidate(t.candidate)}}}class Qt extends EventTarget{constructor(t,i){super(),this.#D=!1,this.#I="connected",this.#B=new Map,this.#J=t,this.#H=i}#J;#H;#D;#I;#B;get ident(){return this.#J}get status(){return this.#I}static async establish(t,i){i&&(t.pathname="/"+i);let s=await this.#W(t);return console.log("acquired socket for ",i),new Promise(((t,i)=>{s.addEventListener("message",(e=>{let o=JSON.parse(e.data);s.removeEventListener("close",i);let n=new Qt(o.id,s);n.#Z(),t(n)}),{once:!0}),s.addEventListener("close",i)}))}static async#W(t){return new Promise(((i,s)=>{let e=new WebSocket(t.toString());e.addEventListener("close",(t=>s(t)),{once:!0}),e.addEventListener("open",(()=>{console.log("WS CONNECTED"),e.removeEventListener("close",s),i(e)}))}))}#Z(){let t=new URL(this.#H.url);this.#H.addEventListener("error",(t=>{this.dispatchEvent(new CustomEvent("error",{detail:t}))})),this.#H.addEventListener("close",(()=>this.#G(t))),this.#H.addEventListener("message",(t=>{let i=JSON.parse(t.data);this.#K(i)}))}async connect_to(t){let i=new Yt((i=>{this.#H.send(JSON.stringify({target:t,...i})),"shutdown"===i.type&&this.#B.delete(i.from)}));return this.#B.set(t,i),await i.initiate(),i}#V(t){this.#I=t,this.dispatchEvent(new CustomEvent("status",{detail:t}))}async#G(t){let i;if(t.pathname="/"+this.#J,this.#D)this.#V("closed");else{this.#V("disconnected");try{i=await Qt.#W(t)}catch(t){return console.error("Error reconnecting",t),void setTimeout((()=>this.#G),1e3)}this.#H=i,this.#Z(),this.#V("connected")}}_disconnect(){this.#H.close()}close(){this.#D=!0,this.#H.close()}#K(t){if(console.log(t),t.error)this.dispatchEvent(new CustomEvent("error",{detail:t.error}));else if("offer"!==t.type||this.#B.has(t.from))this.#B.get(t.from)?.signal(t),"shutdown"===t.type&&this.#B.delete(t.from);else{let i=new Yt((i=>{this.#H.send(JSON.stringify({target:t.from,...i})),"shutdown"===t.type&&this.#B.delete(t.from)}));this.#B.set(t.from,i),i.signal(t),this.dispatchEvent(new CustomEvent("peer",{detail:i}))}}}const Xt=t=>{let i=(t=>new ReadableStream({start(i){t.onmessage=({data:t})=>i.enqueue(t);const s=()=>{i.close(),t.removeEventListener("close",s)};t.addEventListener("close",s)},cancel(){t.close()}}))(t).pipeThrough((()=>{let t,i=[];return new TransformStream({start(){},async transform(s,e){if("string"==typeof s){let i=JSON.parse(s);if("event"===i.type)return void e.enqueue(i.event);t=i}else{if(!t)return;if(i.push(s),0==--t.chunks)return e.enqueue({type:"file",res_name:t.res_name,contents:new Blob(i)}),void(i=[])}},flush(){i=[]}})})()),s=new TransformStream({start(){},async transform(t,i){if("file"===t.type){i.enqueue(JSON.stringify({type:"file",res_name:t.res_name,chunks:Math.ceil(t.contents.size/64e3)}));for(let s=0;s<t.contents.size;s+=64e3)i.enqueue(await t.contents.slice(s,Math.min(s+64e3,t.contents.size)).arrayBuffer())}else i.enqueue(JSON.stringify({type:"event",event:t}))}});return s.readable.pipeTo((t=>{let i;return new WritableStream({start(s){const e=()=>{s.error("Closed"),t.removeEventListener("close",e)};t.addEventListener("close",e),t.onopen=()=>i&&i(),t.onbufferedamountlow=()=>i&&i()},async write(s){("connecting"===t.readyState||t.bufferedAmount>t.bufferedAmountLowThreshold)&&await new Promise(((t,s)=>i=t)),t.send(s)},abort(){t.close()}},new CountQueuingStrategy({highWaterMark:1}))})(t)),{writable:s.writable,readable:i}};class ti{constructor(t){this.server=this,this.#q=new Set,this.#F=new Set,this.on_event=()=>{},this.signaler=t;let{readable:i,writable:s}=new TransformStream({start(){},transform(t,i){console.log("TF STREAM"),i.enqueue(t)},flush(){}}),e=i.getReader(),o=s.getWriter();this.signaler.addEventListener("peer",(async({detail:t})=>{let i=Xt(t.events),s=Xt(t.data);const e=i.writable.getWriter(),n=s.writable.getWriter();this.#q.add(e),this.#F.add(n),console.log("Getting state"),this.get_state&&(console.log("state",this.get_state()),e.write(this.get_state())),console.log("writing images");for(const[t,i]of this.get_images?this.get_images():[])console.log(t,i),n.write({type:"file",res_name:t,contents:await(await fetch(i)).blob()});(async()=>{let t,s,n=i.readable.getReader();for(;({value:t,done:s}=await n.read())&&!s;)await o.write({author:e,ev:t});this.#q.delete(e)})(),(async()=>{let t,i,r=s.readable.getReader();for(;({value:t,done:i}=await r.read())&&!i;)await o.write({author:e,ev:t});this.#F.delete(n)})()})),(async()=>{let t,i,s;for(;({value:{author:s,ev:t},done:i}=await e.read())&&!i;)await this.send_event(t,s),this.on_event(t)})()}get status(){return"connected"===this.signaler.status?"connected":"disconnected"}#q;#F;async send_event(t,i){let s="file"===t.type?this.#F:this.#q;await Promise.all(Array.from(s).filter((t=>t!==i)).map((i=>i.write(t))))}static async establish(){return new ti(await Qt.establish(new URL("wss://battlegrid-signaling.herokuapp.com/")))}}class ii{constructor(t){this.status="disconnected",this.server=void 0,this.on_event=t=>{},this.on_status=()=>{},this.#Y=t}#Q;#X;#Y;#V(t){this.status=t,setTimeout(this.on_status,0)}async connect(){let t;this.#V("connecting");try{let i=await Qt.establish(new URL("wss://battlegrid-signaling.herokuapp.com"));t=await new Promise((async(t,s)=>{i.addEventListener("error",s,{once:!0});let e=await i.connect_to(this.#Y);e.data.onopen=()=>t(e)}))}catch(t){return console.log("error"),void this.#V("error")}let i=Xt(t.events);this.#Q=i.writable.getWriter();let s=i.readable.getReader(),e=Xt(t.data);this.#X=e.writable.getWriter();let o=e.readable.getReader();this.#V("connected"),(async()=>{let t,i;for(;({value:t,done:i}=await o.read())&&!i;)console.log("DATA",t),this.on_event(t);console.log("dccccc"),this.#V("disconnected")})(),(async()=>{let t,i;for(;({value:t,done:i}=await s.read())&&!i;)console.log("EVENT!",t),this.on_event(t);console.log("dccccc"),this.#V("disconnected")})()}async send_event(t){("file"===t.type?this.#X:this.#Q)?.write(t)}}let si=class extends it{constructor(){super(...arguments),this._state=!1,this._loaded=!1,this._buy=t=>{console.log("CLICK"),mt(t),this._state=!0,document.addEventListener("click",this.#tt,{capture:!0})},this.#tt=t=>{mt(t),this._state=!1,document.removeEventListener("click",this.#tt,{capture:!0})},this.#it=t=>{this._loaded=!0}}render(){return O`<button @click="${this._buy}">Buy Me A Coffee</button> ${this._state?O`<div id="container"><iframe class="${this._loaded?"loaded":""}" allow="payment" src="https://ko-fi.com/djrenren/?hidefeed=true&widget=true&embed=true&preview=true" title="djrenren" @load="${this.#it}"></iframe></div>`:null}`}#tt;#it};si.styles=n`:host{display:block;position:relative}iframe{border:none;display:block;opacity:0;width:100%;height:100%;transition:opacity .5s linear}#container{border-radius:5px;box-shadow:0 0 6px rgba(0,0,0,.7);position:absolute;width:350px;height:525px;bottom:-535px;right:0;animation-name:fade;animation-duration:.5s;animation-direction:backwards;background:url(assets/loading.svg) center/100px no-repeat,#ededf0;overflow:hidden}iframe.loaded{opacity:1}@keyframes fade{0%{opacity:0}100%{opacity:1}}`,t([rt()],si.prototype,"_state",void 0),t([rt()],si.prototype,"_loaded",void 0),si=t([et("buy-me-a-coffee")],si);class ei{constructor(){this.index=new Set}get(t){return t.startsWith("local:")?window.sessionStorage.getItem(t):t}delete(t){const i=this.get(t);return!!i&&(URL.revokeObjectURL(i),window.sessionStorage.removeItem(t),!0)}register(t,i){if("string"==typeof t)return t;let s=i??"local:"+Wt();return this.index.add(s),window.sessionStorage.setItem(s,URL.createObjectURL(t)),s}*all(){for(let t of this.index.values())yield[t,this.get(t)]}}class oi extends EventTarget{constructor(){super(...arguments),this.tokens=new Gt,this.grid_dim=[30,20],this.resources=new ei,this.get_state=()=>({type:"state-sync",tokens:[...this.tokens.values()],grid_dim:this.grid_dim,bg:this.#st})}#st;get bg(){return this.#st?this.resources.get(this.#st):null}set_bg(t){const i=t?this.resources.register(t):void 0;this.apply({type:"bg",res:i}),t instanceof Blob&&this.dispatchEvent(Zt({type:"file",res_name:i,contents:t}))}add_token(t,i){const s=Wt(),e=this.resources.register(t),o={id:s,res:e,...i};this.apply({type:"token-added",...o}),t instanceof Blob&&this.dispatchEvent(Zt({type:"file",res_name:e,contents:t}))}local_apply(t){switch(console.log("APPLYING!"),t.type){case"token-manipulated":for(let i of t.tokens){let t=this.tokens.get(i.id);if(!t)return void console.error("Update received for nonexistant token",i.id);Object.assign(t,{dim:i.dim,loc:i.loc,r:i.r})}break;case"token-added":let i={id:t.id,dim:t.dim,loc:t.loc,res:t.res,r:0};this.tokens.add(t.id,i);break;case"grid-resized":this.grid_dim=t.dim;break;case"token-removed":for(let i of t.ids){const t=this.tokens.get(i);if(!t)return void console.error("Tried to remove nonexistant token",i);this.resources.delete(t.res),this.tokens.delete(t.id)}break;case"state-sync":console.log("applying #tokens",t.tokens),this.tokens=new Gt;for(const i of t.tokens)this.tokens.add(i.id,i);this.grid_dim=t.grid_dim,this.#st=t.bg;break;case"token-reorder":const s=this.tokens.index(t.id);if(void 0===s)return void console.error("Tried to reorder non-existant token",t.id);let e;e="top"===t.idx?this.tokens.size-1:"bottom"===t.idx?0:"up"===t.idx?Math.min(this.tokens.size-1,s+1):Math.max(0,s-1),this.tokens.set_index(t.id,e);break;case"file":this.resources.register(t.contents,t.res_name);break;case"bg":this.#st&&this.resources.delete(this.#st),this.#st=t.res}this.dispatchEvent(new CustomEvent("updated"))}remove_token(t){this.apply({type:"token-removed",ids:[t]})}apply(t){this.local_apply(t),this.dispatchEvent(new CustomEvent("game-event",{detail:t}))}set_dim(t){this.apply({type:"grid-resized",dim:t})}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ni=class extends it{constructor(){super(...arguments),this.selection=[],this.host_pending=!1,this.#et=new oi,this.#ot=()=>{this.#et.set_dim(At([1,1],[parseInt(this.width?.value)??0,parseInt(this.height?.value)??0]))},this.#nt=()=>{this.client&&!this.client.server&&this.client.connect()},this.#rt=()=>{this.client=void 0,window.history.pushState(null,"",window.location.href.split("?")[0])},this.#ht=async()=>{try{this.host_pending=!0;let t=await ti.establish();this.host_pending=!1,this.client=t,t.on_event=this.#lt,t.get_state=this.#et.get_state,t.get_images=()=>this.#et.resources.all(),window.history.pushState({},"","?game="+t.signaler.ident),navigator.clipboard.writeText(window.location.toString())}catch(t){console.error(t)}},this.#lt=t=>{this.#et.local_apply(t)},this.#at=t=>{this.client?.send_event(t.detail)}}#et;render(){let t="error"===this.client?.status?O`<div class="message error"><div><h1>Error connecting to remote grid</h1><button @click="${this.#nt}">Try again</button> <button @click="${this.#rt}">New local grid</button></div></div>`:null,i="connecting"===this.client?.status?O`<div class="message"><div><h1>Connecting to grid...</h1></div></div>`:null,s="disconnected"===this.client?.status?O`<div class="message"><div><h1>Disconnected from host</h1><button @click="${this.#nt}">Try again</button> <button @click="${this.#rt}">Continue locally</button></div></div>`:null,e=t||i||s;return O`<section id="toolbar" class="group"><div class="group"><span>Grid: <input id="width" type="number" min="1" @input="${this.#ot}" .value="${this.#et.grid_dim[0]+""}"> x <input id="height" type="number" min="1" @input="${this.#ot}" .value="${this.#et.grid_dim[1]+""}"> </span>${1===this.selection.length?O`<div><button @click="${()=>this.#et.apply({type:"token-reorder",id:this.selection[0],idx:"down"})}" ?disabled="${0===this.#et.tokens.index(this.selection[0])}">Move Down</button> <button @click="${()=>this.#et.apply({type:"token-reorder",id:this.selection[0],idx:"up"})}" ?disabled="${this.#et.tokens.index(this.selection[0])===this.#et.tokens.size-1}">Move Up</button></div>`:null}</div><div class="group">${this.host_pending?O`<img src="assets/loading.svg">`:this.client?O`<div>${this.client.server?"hosting":this.client.status}</div>`:O`<button @click="${this.#ht}">Host</button>`}<buy-me-a-coffee class="right"></buy-me-a-coffee></div></section><bg-canvas bg="${(t=>null!=t?t:j)(this.#et.bg??void 0)}" .selection="${this.selection}" width="${this.#et.grid_dim[0]}" height="${this.#et.grid_dim[1]}" .tokens="${this.#et.tokens}" .resources="${this.#et.resources}" @token-drop="${({detail:t})=>this.#et.add_token(t.img,{loc:t.loc,r:0,dim:t.dim})}" @bg-drop="${({detail:t})=>this.#et.set_bg(t)}" @token-select="${({detail:t})=>{this.selection=t}}" @game-event="${({detail:t})=>this.#et.apply(t)}"></bg-canvas>${e}`}updated(t){t.has("client")&&(document.title="BattleGrid"+(this.client&&"connected"===this.client.status?this.client.server?"- Hosting":"- Connected":""))}#ot;async connectedCallback(){super.connectedCallback(),this.#et.addEventListener("game-event",this.#at),this.#et.addEventListener("updated",(()=>{this.selection=this.selection.filter((t=>this.#et.tokens.has(t))),this.requestUpdate(),this.canvas?.requestUpdate()}));let t=new URLSearchParams(window.location.search).get("game");if(!t)return{};let i=new ii(t);i.on_event=this.#lt,i.on_status=()=>this.requestUpdate("client"),this.client=i,await i.connect()}#nt;#rt;#ht;#lt;#at};ni.styles=n`:host{width:100%;height:100%;display:grid;grid:"toolbar" 30px "viewport" 1fr/1fr;font-family:inherit;--ui-bg:#f9f9fa}.message{grid-area:1/1/3/1;display:grid;align-items:center;justify-items:center;background:#fff;z-index:2}.right{justify-self:end}bg-canvas{grid-area:viewport;z-index:1}input[type=number]{width:3em}.group{display:flex;align-items:center;height:100%;flex-wrap:nowrap}#toolbar{grid-area:toolbar;box-shadow:0 0 4px gray;z-index:2;background:var(--ui-bg);justify-content:space-between;padding:0 1em;grid-template-rows:unset}.group img{width:1em;height:1em;object-fit:cover;display:inline-block}`,t([at("#width",!0)],ni.prototype,"width",void 0),t([at("#height",!0)],ni.prototype,"height",void 0),t([at("bg-canvas",!0)],ni.prototype,"canvas",void 0),t([rt()],ni.prototype,"client",void 0),t([rt()],ni.prototype,"selection",void 0),t([rt()],ni.prototype,"host_pending",void 0),ni=t([et("bg-app")],ni),document.body.addEventListener("wheel",(t=>{console.log("HUH..."),t.ctrlKey&&t.preventDefault()}),{passive:!1});
//# sourceMappingURL=bundle.js.map
