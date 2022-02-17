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
function t(t,i,e,s){var o,n=arguments.length,r=n<3?i:null===s?s=Object.getOwnPropertyDescriptor(i,e):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,i,e,s);else for(var h=t.length-1;h>=0;h--)(o=t[h])&&(r=(n<3?o(r):n>3?o(i,e,r):o(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const i=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e=Symbol(),s=new Map;class o{constructor(t,i){if(this._$cssResult$=!0,i!==e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=s.get(this.cssText);return i&&void 0===t&&(s.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const n=(t,...i)=>{const s=1===t.length?t[0]:i.reduce(((i,e,s)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[s+1]),t[0]);return new o(s,e)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return(t=>new o("string"==typeof t?t:t+"",e))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var h;const l=window.trustedTypes,a=l?l.emptyScript:"",c=window.reactiveElementPolyfillSupport,d={toAttribute(t,i){switch(i){case Boolean:t=t?a:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},u=(t,i)=>i!==t&&(i==i||t==t),v={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class p extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,e)=>{const s=this._$Eh(e,i);void 0!==s&&(this._$Eu.set(s,e),t.push(s))})),t}static createProperty(t,i=v){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const e="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,e,i);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){return{get(){return this[i]},set(s){const o=this[t];this[i]=s,this.requestUpdate(t,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const e of i)this.createProperty(e,t[e])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(r(t))}else void 0!==t&&i.push(r(t));return i}static _$Eh(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,e;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(e=t.hostConnected)||void 0===e||e.call(t))}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{i?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((i=>{const e=document.createElement("style"),s=window.litNonce;void 0!==s&&e.setAttribute("nonce",s),e.textContent=i.cssText,t.appendChild(e)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,e){this._$AK(t,e)}_$ES(t,i,e=v){var s,o;const n=this.constructor._$Eh(t,e);if(void 0!==n&&!0===e.reflect){const r=(null!==(o=null===(s=e.converter)||void 0===s?void 0:s.toAttribute)&&void 0!==o?o:d.toAttribute)(i,e.type);this._$Ei=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Ei=null}}_$AK(t,i){var e,s,o;const n=this.constructor,r=n._$Eu.get(t);if(void 0!==r&&this._$Ei!==r){const t=n.getPropertyOptions(r),h=t.converter,l=null!==(o=null!==(s=null===(e=h)||void 0===e?void 0:e.fromAttribute)&&void 0!==s?s:"function"==typeof h?h:null)&&void 0!==o?o:d.fromAttribute;this._$Ei=r,this[r]=l(i,t.type),this._$Ei=null}}requestUpdate(t,i,e){let s=!0;void 0!==t&&(((e=e||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===e.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,e))):s=!1),!this.isUpdatePending&&s&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(e)):this._$EU()}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(e)}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$E_=void 0),this._$EU()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;p.finalized=!0,p.elementProperties=new Map,p.elementStyles=[],p.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:p}),(null!==(h=globalThis.reactiveElementVersions)&&void 0!==h?h:globalThis.reactiveElementVersions=[]).push("1.2.1");const f=globalThis.trustedTypes,w=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,b=`lit$${(Math.random()+"").slice(9)}$`,m="?"+b,y=`<${m}>`,$=document,k=(t="")=>$.createComment(t),_=t=>null===t||"object"!=typeof t&&"function"!=typeof t,x=Array.isArray,S=t=>{var i;return x(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,A=/-->/g,M=/>/g,T=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,E=/'/g,R=/"/g,U=/^(?:script|style|textarea)$/i,O=t=>(i,...e)=>({_$litType$:t,strings:i,values:e}),z=O(1),N=O(2),P=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),L=new WeakMap,D=$.createTreeWalker($,129,null,!1),I=(t,i)=>{const e=t.length-1,s=[];let o,n=2===i?"<svg>":"",r=C;for(let i=0;i<e;i++){const e=t[i];let h,l,a=-1,c=0;for(;c<e.length&&(r.lastIndex=c,l=r.exec(e),null!==l);)c=r.lastIndex,r===C?"!--"===l[1]?r=A:void 0!==l[1]?r=M:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=T):void 0!==l[3]&&(r=T):r===T?">"===l[0]?(r=null!=o?o:C,a=-1):void 0===l[1]?a=-2:(a=r.lastIndex-l[2].length,h=l[1],r=void 0===l[3]?T:'"'===l[3]?R:E):r===R||r===E?r=T:r===A||r===M?r=C:(r=T,o=void 0);const d=r===T&&t[i+1].startsWith("/>")?" ":"";n+=r===C?e+y:a>=0?(s.push(h),e.slice(0,a)+"$lit$"+e.slice(a)+b+d):e+b+(-2===a?(s.push(void 0),i):d)}const h=n+(t[e]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(h):h,s]};class J{constructor({strings:t,_$litType$:i},e){let s;this.parts=[];let o=0,n=0;const r=t.length-1,h=this.parts,[l,a]=I(t,i);if(this.el=J.createElement(l,e),D.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(s=D.nextNode())&&h.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const i of s.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(b)){const e=a[n++];if(t.push(i),void 0!==e){const t=s.getAttribute(e.toLowerCase()+"$lit$").split(b),i=/([.?@])?(.*)/.exec(e);h.push({type:1,index:o,name:i[2],strings:t,ctor:"."===i[1]?G:"?"===i[1]?V:"@"===i[1]?Y:Z})}else h.push({type:6,index:o})}for(const i of t)s.removeAttribute(i)}if(U.test(s.tagName)){const t=s.textContent.split(b),i=t.length-1;if(i>0){s.textContent=f?f.emptyScript:"";for(let e=0;e<i;e++)s.append(t[e],k()),D.nextNode(),h.push({type:2,index:++o});s.append(t[i],k())}}}else if(8===s.nodeType)if(s.data===m)h.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(b,t+1));)h.push({type:7,index:o}),t+=b.length-1}o++}}static createElement(t,i){const e=$.createElement("template");return e.innerHTML=t,e}}function B(t,i,e=t,s){var o,n,r,h;if(i===P)return i;let l=void 0!==s?null===(o=e._$Cl)||void 0===o?void 0:o[s]:e._$Cu;const a=_(i)?void 0:i._$litDirective$;return(null==l?void 0:l.constructor)!==a&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===a?l=void 0:(l=new a(t),l._$AT(t,e,s)),void 0!==s?(null!==(r=(h=e)._$Cl)&&void 0!==r?r:h._$Cl=[])[s]=l:e._$Cu=l),void 0!==l&&(i=B(t,l._$AS(t,i.values),l,s)),i}class H{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:e},parts:s}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:$).importNode(e,!0);D.currentNode=o;let n=D.nextNode(),r=0,h=0,l=s[0];for(;void 0!==l;){if(r===l.index){let i;2===l.type?i=new W(n,n.nextSibling,this,t):1===l.type?i=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(i=new q(n,this,t)),this.v.push(i),l=s[++h]}r!==(null==l?void 0:l.index)&&(n=D.nextNode(),r++)}return o}m(t){let i=0;for(const e of this.v)void 0!==e&&(void 0!==e.strings?(e._$AI(t,e,i),i+=e.strings.length-2):e._$AI(t[i])),i++}}class W{constructor(t,i,e,s){var o;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=e,this.options=s,this._$Cg=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=B(this,t,i),_(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==P&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):S(t)?this.A(t):this.$(t)}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==j&&_(this._$AH)?this._$AA.nextSibling.data=t:this.S($.createTextNode(t)),this._$AH=t}T(t){var i;const{values:e,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(s.h,this.options)),s);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(e);else{const t=new H(o,this),i=t.p(this.options);t.m(e),this.S(i),this._$AH=t}}_$AC(t){let i=L.get(t.strings);return void 0===i&&L.set(t.strings,i=new J(t)),i}A(t){x(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let e,s=0;for(const o of t)s===i.length?i.push(e=new W(this.M(k()),this.M(k()),this,this.options)):e=i[s],e._$AI(o),s++;s<i.length&&(this._$AR(e&&e._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var e;for(null===(e=this._$AP)||void 0===e||e.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class Z{constructor(t,i,e,s,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=o,e.length>2||""!==e[0]||""!==e[1]?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,e,s){const o=this.strings;let n=!1;if(void 0===o)t=B(this,t,i,0),n=!_(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{const s=t;let r,h;for(t=o[0],r=0;r<o.length-1;r++)h=B(this,s[e+r],i,r),h===P&&(h=this._$AH[r]),n||(n=!_(h)||h!==this._$AH[r]),h===j?t=j:t!==j&&(t+=(null!=h?h:"")+o[r+1]),this._$AH[r]=h}n&&!s&&this.k(t)}k(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends Z{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===j?void 0:t}}const K=f?f.emptyScript:"";class V extends Z{constructor(){super(...arguments),this.type=4}k(t){t&&t!==j?this.element.setAttribute(this.name,K):this.element.removeAttribute(this.name)}}class Y extends Z{constructor(t,i,e,s,o){super(t,i,e,s,o),this.type=5}_$AI(t,i=this){var e;if((t=null!==(e=B(this,t,i,0))&&void 0!==e?e:j)===P)return;const s=this._$AH,o=t===j&&s!==j||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==j&&(s===j||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,e;"function"==typeof this._$AH?this._$AH.call(null!==(e=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==e?e:this.element,t):this._$AH.handleEvent(t)}}class q{constructor(t,i,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){B(this,t)}}const F={P:"$lit$",V:b,L:m,I:1,N:I,R:H,D:S,j:B,H:W,O:Z,F:V,B:Y,W:G,Z:q},Q=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var X,tt;null==Q||Q(J,W),(null!==(g=globalThis.litHtmlVersions)&&void 0!==g?g:globalThis.litHtmlVersions=[]).push("2.1.2");class it extends p{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,i;const e=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=e.firstChild),e}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=((t,i,e)=>{var s,o;const n=null!==(s=null==e?void 0:e.renderBefore)&&void 0!==s?s:i;let r=n._$litPart$;if(void 0===r){const t=null!==(o=null==e?void 0:e.renderBefore)&&void 0!==o?o:null;n._$litPart$=r=new W(i.insertBefore(k(),t),t,void 0,null!=e?e:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1)}render(){return P}}it.finalized=!0,it._$litElement$=!0,null===(X=globalThis.litElementHydrateSupport)||void 0===X||X.call(globalThis,{LitElement:it});const et=globalThis.litElementPolyfillSupport;null==et||et({LitElement:it}),(null!==(tt=globalThis.litElementVersions)&&void 0!==tt?tt:globalThis.litElementVersions=[]).push("3.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st=t=>i=>"function"==typeof i?((t,i)=>(window.customElements.define(t,i),i))(t,i):((t,i)=>{const{kind:e,elements:s}=i;return{kind:e,elements:s,finisher(i){window.customElements.define(t,i)}}})(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ot=(t,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(e){e.createProperty(i.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(e){e.createProperty(i.key,t)}};function nt(t){return(i,e)=>void 0!==e?((t,i,e)=>{i.constructor.createProperty(e,t)})(t,i,e):ot(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function rt(t){return nt({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=({finisher:t,descriptor:i})=>(e,s)=>{var o;if(void 0===s){const s=null!==(o=e.originalKey)&&void 0!==o?o:e.key,n=null!=i?{kind:"method",placement:"prototype",key:s,descriptor:i(e.key)}:{...e,key:s};return null!=t&&(n.finisher=function(i){t(i,s)}),n}{const o=e.constructor;void 0!==i&&Object.defineProperty(e,s,i(s)),null==t||t(o,s)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function lt(t){return ht({finisher:(i,e)=>{Object.assign(i.prototype[e],t)}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function at(t,i){return ht({descriptor:e=>{const s={get(){var i,e;return null!==(e=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==e?e:null},enumerable:!0,configurable:!0};if(i){const i="symbol"==typeof e?Symbol():"__"+e;s.get=function(){var e,s;return void 0===this[i]&&(this[i]=null!==(s=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==s?s:null),this[i]}}return s}})}
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
const dt=1,ut=2,vt=t=>(...i)=>({_$litDirective$:t,values:i});class pt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,e){this._$Ct=t,this._$AM=i,this._$Ci=e}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=vt(class extends pt{constructor(t){var i;if(super(t),t.type!==dt||"style"!==t.name||(null===(i=t.strings)||void 0===i?void 0:i.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((i,e)=>{const s=t[e];return null==s?i:i+`${e=e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[i]){const{style:e}=t.element;if(void 0===this.ct){this.ct=new Set;for(const t in i)this.ct.add(t);return this.render(i)}this.ct.forEach((t=>{null==i[t]&&(this.ct.delete(t),t.includes("-")?e.removeProperty(t):e[t]="")}));for(const t in i){const s=i[t];null!=s&&(this.ct.add(t),t.includes("-")?e.setProperty(t,s):e[t]=s)}return P}}),ft=t=>t.isPrimary&&("touch"===t.pointerType||t.pressure>0),wt=t=>"touch"!==t.pointerType&&t.isPrimary&&t.pressure>0,bt=t=>{t.preventDefault(),t.stopPropagation()},mt=(t,i)=>new CustomEvent(t,{detail:i}),yt=(t,i)=>[t[0]+i[0],t[1]+i[1]],$t=(t,i)=>yt(t,[i,i]),kt=(t,i)=>[t[0]-i[0],t[1]-i[1]],_t=(t,i)=>[t[0]*i,t[1]*i],xt=(t,i)=>[t[0]*i[0],t[1]*i[1]],St=(t,i)=>[t[0]/i[0],t[1]/i[1]],Ct=(t,i)=>[t[0]/i,t[1]/i],At=(t,i)=>[Math.max(t[0],i[0]),Math.max(t[1],i[1])],Mt=(t,i)=>[Math.min(t[0],i[0]),Math.min(t[1],i[1])],Tt=(t,i,e)=>At(t,Mt(i,e)),Et=(t,i)=>t[0]===i[0]&&t[1]===i[1];let Rt=class extends it{constructor(){super(...arguments),this.scale=1,this.c_dim=[0,0],this.v_dim=[0,0],this.v_loc=[0,0],this._scrollPos=[0,0],this.smooth=0,this.#t=0,this.#i=[0,0],this.#e=new ResizeObserver((t=>{for(let i of t)switch(i.target){case this.surface:this.v_dim=[i.contentRect.width,i.contentRect.height];const t=this.getBoundingClientRect();this.v_loc=[t.x,t.y],this.smooth=0;break;case this.#s:this.c_dim=[this.#s.width.baseVal.value,this.#s.height.baseVal.value]}})),this.#o=t=>{t.ctrlKey&&("="===t.key?(bt(t),this.smooth=200,this._performZoom(this.coordToLocal(Ct(yt(this.v_loc,this.v_dim),2)),.2*this.scale)):"-"===t.key?(bt(t),this.smooth=200,this._performZoom(this.coordToLocal(Ct(yt(this.v_loc,this.v_dim),2)),-.2*this.scale)):"0"===t.key&&(this.smooth=100,this.#n()))},this.#r=[0,0],this.#h=t=>{bt(t),t.target.setPointerCapture(t.pointerId),this.#r=[t.clientX,t.clientY]},this.#l=(t,i,e,s)=>{this.smooth=0;let o=this.#a,n=this.#r;this.#r=[t.clientX,t.clientY],this.#a=[i?o[0]+s*(this.#r[0]-n[0]):o[0],e?o[1]+s*(this.#r[1]-n[1]):o[1]]},this.#c=t=>{t.target.releasePointerCapture(t.pointerId)},this._touchdragstart=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#h(t)},this._touchdragmove=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#l(t,!0,!0,-1)},this._touchdragend=t=>{t.isPrimary&&"touch"===t.pointerType&&this.#c(t)}}#s;get#a(){return At([0,0],Mt(this._scrollPos,kt(_t(this.c_dim,this.scale),this.v_dim)))}set#a(t){const i=this._scrollPos;this._scrollPos=t,this.requestUpdate("#scrollPos",i)}get offset(){return At([0,0],_t(kt(this.v_dim,_t(this.c_dim,this.scale)),.5)).map((t=>t))}render(){const t=this.offset,i=this.#a;let e=!1,s=!1;this.v_dim&&this.c_dim&&(e=this.v_dim[1]<this.c_dim[1]*this.scale,s=this.v_dim[0]<this.c_dim[0]*this.scale);const o=St(xt(this.v_dim,this.v_dim),_t(this.c_dim,this.scale)),n=St(xt(i,this.v_dim),_t(this.c_dim,this.scale));return z`<style>:host,:root{--scale:${this.scale}}::slotted(svg){transform:translate(${t[0]-i[0]}px,${t[1]-i[1]}px) scale(var(--scale))}*,::slotted(svg){transition-duration:${this.smooth+"ms"}}</style><div id="touch-surface" @wheel="${this._wheel}" @pointerdown="${this._touchdragstart}" @pointermove="${this._touchdragmove}" @pointerup="${this._touchdragend}" @gesturestart="${this._gesturestart}" @gesturechange="${this._gesturechange}"><div id="bg" part="background"></div><slot @slotchange="${this.handleSlotchange}"></slot><div part="bar" class="bottombar" style="${gt({transform:`translate(${n[0]}px, 0)`,width:`${o[0]}px`,display:s?"block":"none"})}" @pointerdown="${this.#d}" @pointermove="${this.#u}" @pointerup="${this.#v}"></div><div part="bar" class="rightbar" style="${gt({transform:`translate(0, ${n[1]}px)`,height:`${o[1]}px`,display:e?"block":"none"})}" @pointerdown="${this.#d}" @pointermove="${this.#p}" @pointerup="${this.#v}"></div></div>`}#d(t){wt(t)&&this.#h(t)}#u(t){wt(t)&&this.#l(t,!0,!1,this.c_dim[0]*this.scale/this.v_dim[0])}#p(t){wt(t)&&this.#l(t,!1,!0,this.c_dim[1]*this.scale/this.v_dim[1])}#v(t,i){this.#c(t)}_wheel(t){bt(t);const i=t.deltaMode===WheelEvent.DOM_DELTA_LINE?10:1;if(t.ctrlKey){const e=Math.min(50,Math.max(-50,-t.deltaY*i)),s=.005*e*this.scale;this.smooth=50===Math.abs(e)?300:0,this._performZoom(this.coordToLocal([t.clientX,t.clientY]),s)}else{const e=_t([t.deltaX,t.deltaY],i);this.smooth=2*(Math.abs(e[0])+Math.abs(e[1])),this.smooth=0,this.#a=yt(e,this.#a)}}#t;#i;_gesturestart(t){this.#i=this.coordToLocal([t.clientX,t.clientY]),this.#t=1,bt(t)}_gesturechange(t){bt(t),this._performZoom(this.#i,this.scale*(t.scale-this.#t)*1.5),this.#t=t.scale}_performZoom(t,i){let e=Math.min(1,Math.max(.2,this.scale+i)),s=e-this.scale;this.#a=yt(_t(t,s),this.#a),this.scale=e}#e;firstUpdated(){this.#e.observe(this.surface)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.#o)}disconnectedCallback(){super.disconnectedCallback(),this.#e.disconnect(),document.removeEventListener("keydown",this.#o)}#o;coordToLocal(t){const i=yt(kt(t,this.v_loc),this.#a);return Ct(kt(i,this.offset),this.scale)}handleSlotchange({target:t}){this.#s&&this.#e.unobserve(this.#s),this.#s=t.assignedElements().find((t=>t.matches("svg"))),this.#n(),this.#s&&this.#e.observe(this.#s)}#n(){const t=[this.#s.width.baseVal.value,this.#s.height.baseVal.value],i=this.surface.getBoundingClientRect();this.scale=Math.max(.2,Math.min(1,..._t(St([i.width,i.height],t),.95)))}#r;#h;#l;#c;static get styles(){return n`#touch-surface{position:relative;width:100%;height:100%;overflow:clip}::slotted(svg){transform-origin:0 0;position:absolute}.bottombar{position:fixed;bottom:0;height:var(--thickness);transform-origin:0 0;backface-visibility:hidden;will-change:width}.rightbar{position:fixed;width:var(--thickness);transform-origin:0 0;backface-visibility:hidden;right:0;will-change:height}*,::slotted(svg){transition-property:all}#bg{position:absolute;z-index:-1;height:100%;width:100%}`}};t([nt({type:Number})],Rt.prototype,"scale",void 0),t([rt()],Rt.prototype,"c_dim",void 0),t([rt()],Rt.prototype,"v_dim",void 0),t([rt()],Rt.prototype,"v_loc",void 0),t([rt()],Rt.prototype,"_scrollPos",void 0),t([at("#touch-surface",!0)],Rt.prototype,"surface",void 0),t([rt()],Rt.prototype,"smooth",void 0),t([lt({passive:!1,capture:!0})],Rt.prototype,"_wheel",null),t([lt({capture:!0})],Rt.prototype,"_gesturestart",null),t([lt({passive:!1})],Rt.prototype,"_gesturechange",null),Rt=t([st("bg-viewport")],Rt);const Ut=()=>{document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`)};window.addEventListener("resize",Ut),Ut();
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{H:Ot}=F,zt=()=>document.createComment(""),Nt=(t,i,e)=>{var s;const o=t._$AA.parentNode,n=void 0===i?t._$AB:i._$AA;if(void 0===e){const i=o.insertBefore(zt(),n),s=o.insertBefore(zt(),n);e=new Ot(i,s,t,t.options)}else{const i=e._$AB.nextSibling,r=e._$AM,h=r!==t;if(h){let i;null===(s=e._$AQ)||void 0===s||s.call(e,t),e._$AM=t,void 0!==e._$AP&&(i=t._$AU)!==r._$AU&&e._$AP(i)}if(i!==n||h){let t=e._$AA;for(;t!==i;){const i=t.nextSibling;o.insertBefore(t,n),t=i}}}return e},Pt=(t,i,e=t)=>(t._$AI(i,e),t),jt={},Lt=t=>{var i;null===(i=t._$AP)||void 0===i||i.call(t,!1,!0);let e=t._$AA;const s=t._$AB.nextSibling;for(;e!==s;){const t=e.nextSibling;e.remove(),e=t}},Dt=(t,i,e)=>{const s=new Map;for(let o=i;o<=e;o++)s.set(t[o],o);return s},It=vt(class extends pt{constructor(t){if(super(t),t.type!==ut)throw Error("repeat() can only be used in text expressions")}dt(t,i,e){let s;void 0===e?e=i:void 0!==i&&(s=i);const o=[],n=[];let r=0;for(const i of t)o[r]=s?s(i,r):r,n[r]=e(i,r),r++;return{values:n,keys:o}}render(t,i,e){return this.dt(t,i,e).values}update(t,[i,e,s]){var o;const n=(t=>t._$AH)(t),{values:r,keys:h}=this.dt(i,e,s);if(!Array.isArray(n))return this.at=h,r;const l=null!==(o=this.at)&&void 0!==o?o:this.at=[],a=[];let c,d,u=0,v=n.length-1,p=0,g=r.length-1;for(;u<=v&&p<=g;)if(null===n[u])u++;else if(null===n[v])v--;else if(l[u]===h[p])a[p]=Pt(n[u],r[p]),u++,p++;else if(l[v]===h[g])a[g]=Pt(n[v],r[g]),v--,g--;else if(l[u]===h[g])a[g]=Pt(n[u],r[g]),Nt(t,a[g+1],n[u]),u++,g--;else if(l[v]===h[p])a[p]=Pt(n[v],r[p]),Nt(t,n[u],n[v]),v--,p++;else if(void 0===c&&(c=Dt(h,p,g),d=Dt(l,u,v)),c.has(l[u]))if(c.has(l[v])){const i=d.get(h[p]),e=void 0!==i?n[i]:null;if(null===e){const i=Nt(t,n[u]);Pt(i,r[p]),a[p]=i}else a[p]=Pt(e,r[p]),Nt(t,n[u],e),n[i]=null;p++}else Lt(n[v]),v--;else Lt(n[u]),u++;for(;p<=g;){const i=Nt(t,a[g+1]);Pt(i,r[p]),a[p++]=i}for(;u<=v;){const t=n[u++];null!==t&&Lt(t)}return this.at=h,((t,i=jt)=>{t._$AH=i})(t,a),P}}),Jt=async t=>{let i=t.dataTransfer?.items??[];return new Promise((async(t,e)=>{console.log("DataItems",i.length);for(let e=0;e<i.length;e++){if(console.log(i[e].type),i[e].type.startsWith("image/"))return t(i[e].getAsFile());if("text/html"===i[e].type)return void i[e].getAsString((i=>t(Bt(i))));if("application/x-moz-file-promise-url"===i[e].type)return void i[e].getAsString((t=>{}));if("string"===i[e].kind){let t=i[e].type;i[e].getAsString((i=>console.log(t,i)))}}return e("No compatible drop type found")}))};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Bt(t){const i=(new DOMParser).parseFromString(t,"text/html").querySelector("img")?.src;return i??null}const Ht=()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(t=>(t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>t/4).toString(16))),Wt=t=>new CustomEvent("game-event",{detail:t});class Zt{constructor(){this.order=[],this.map=new Map}get(t){const i=this.map.get(t);if(void 0!==i)return this.order[i]}has(t){return this.map.has(t)}add(t,i){this.map.set(t,this.order.length),this.order.push(i)}delete(t){const i=this.map.get(t);return void 0!==i&&(this.order.splice(i,1),this.map.delete(t),!0)}index(t){return this.map.get(t)}set_index(t,i){const e=this.map.get(t);if(void 0===e||i>=this.order.length)return!1;const s=this.order.splice(e,1)[0];return this.order.splice(i,0,s),!0}values(){return this.order}}let Gt=class extends it{constructor(){super(),this.width=30,this.height=40,this.tokens=new Zt,this.#g=0,this.#f=t=>{bt(t),this.#g++},this.#w=t=>{bt(t);const i=this.#b(t).map(Vt),e=_t($t([this.width,this.height],-1),72);this._drop_hint=Tt([0,0],e,i),this.hovering="canvas"},this.#m=t=>{--this.#g<=0&&(this._drop_hint=void 0,this.hovering=void 0)},this.#y=t=>{bt(t),this._drop_hint=void 0,this.hovering="bg"},this.#$=async t=>{bt(t);try{const i=await Jt(t);this.dispatchEvent(mt("bg-drop",i))}catch(t){}this.hovering=void 0},this.#k=async t=>{bt(t);try{const i=await Jt(t);this.dispatchEvent(mt("token-drop",{loc:this._drop_hint,dim:[72,72],img:i}))}catch(t){}this._drop_hint=void 0,this.hovering=void 0},this.#_=t=>{t.preventDefault(),t.stopPropagation(),this.dispatchEvent(mt("token-select",t.target.id))},this.#x=t=>{this.dispatchEvent(mt("token-select",void 0))},this.#S=t=>{ft(t)&&(bt(t),t.target.setPointerCapture(t.pointerId),this.#C=this.#b(t))},this.#A={move:[0,0],resize:[0,0],r:0},this.#M=t=>{if(!ft(t))return;this.#C||this.#S(t),bt(t);const i=Tt([0,0],this.#T,this.#b(t)),e=this.tokens.get(this.selection),s=e.dim,o=e.loc,n=t.target.classList;let r=[0,0],h=[0,0],l=0;if(n.contains("rn")&&(h[1]=o[1]-Kt(i[1]),r[1]=Kt(i[1])-o[1]),n.contains("rw")&&(h[0]=o[0]-Kt(i[0]),r[0]=Kt(i[0])-o[0]),n.contains("rs")&&(h[1]=Kt(i[1])-s[1]-o[1]),n.contains("re")&&(h[0]=Kt(i[0])-s[0]-o[0]),n.contains("ro")){const t=yt(o,Ct(s,2)),n=kt(i,t),r=180*Math.atan2(n[0],-n[1])/Math.PI;l=90*Math.round(r/90)-e.r%360}n.contains("selection-box")?r=kt(i,this.#C).map(Kt):(r=Mt($t(s,-72),r),h=At($t(_t(s,-1),72),h)),l===this.#A.r&&Et(r,this.#A.move)&&Et(h,this.#A.resize)||(this.#C=yt(this.#C,r),this.#A={move:[0,0],resize:[0,0],r:0},this.dispatchEvent(Wt({type:"token-manipulated",id:e.id,loc:yt(e.loc,r),dim:yt(e.dim,h),r:e.r+l})))},this.#E=t=>{bt(t),this.#C=void 0},this.#b=t=>kt(this.viewport.coordToLocal([t.clientX,t.clientY]),[60,60]),this.#o=t=>{if(!this.selection)return;if(8===t.keyCode)return this.dispatchEvent(Wt({type:"token-removed",id:this.selection})),void bt(t);let i=this.tokens.get(this.selection);let e={ArrowUp:[0,-72],ArrowDown:[0,72],ArrowLeft:[-72,0],ArrowRight:[72,0]}[t.key];e&&(i.loc=Tt([0,0],kt(this.#T,i.dim),yt(i.loc,e)),this.dispatchEvent(Wt({type:"token-manipulated",id:i.id,loc:i.loc,dim:i.dim,r:i.r})),bt(t))}}get#T(){return _t([this.width,this.height],72)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.#o)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.#o)}render(){let[t,i]=this.#T,e=this.tokens.get(this.selection);return z`
      <bg-viewport
        @pointerup=${this.#x}
        @dragstart=${bt}
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
              ${this.bg?N`<image href=${this.bg} width="100%" height="100%" preserveAspectRatio="none"></image>`:null}
              <rect width="100%" height="100%" fill="url(#horiz)" opacity="0.75" pointer-events="none"></rect>
              <rect width="100%" height="100%" fill="url(#vert)" opacity="0.75" pointer-events="none"></rect>

              ${It(this.tokens.values(),(t=>t.id),((t,i)=>{const e=this.resources?.get(t.res),[s,o]=$t(t.dim,-1.5),[n,r]=$t(t.loc,.75);return z`
                    <svg
                      viewBox="0 0 1 1"
                      x=${n}
                      y=${r}
                      width=${s}
                      height=${o}
                      fill=${e?"transparent":"white"}
                      preserveAspectRatio="none"
                    >
                      <image
                        id=${t.id}
                        class="token"
                        width="1"
                        height="1"
                        href=${e||"assets/loading.svg"}
                        style=${`transform: rotate(${t.r}deg)`}
                        preserveAspectRatio=${e?"none":""}
                        image-rendering="optimizeSpeed"
                        @mousedown=${this.#_}
                      ></image>
                    </svg>
                  `}))}
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
            ${e?N`
            <svg
              id="selection"
              @pointerdown=${this.#S}
              @pointermove=${this.#M}
              @pointerup=${this.#E}
              @click=${bt}
              x=${e.loc[0]}
              y=${e.loc[1]}
              width=${e.dim[0]}
              height=${e.dim[1]}
            >
            <rect
                class="selection-box"
                width="100%"
                height="100%"
                @click=${bt}
                fill="transparent"
            ></rect>
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
            </svg>`:null}
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
    `}createRenderRoot(){return super.createRenderRoot()}#g;#f;#w;#m;#y;#$;#k;#_;#x;#C;#S;#A;#M;#E;#b;#o};Gt.styles=n`
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
  `,t([nt({type:Number})],Gt.prototype,"width",void 0),t([nt({type:Number})],Gt.prototype,"height",void 0),t([nt()],Gt.prototype,"bg",void 0),t([nt({attribute:!1})],Gt.prototype,"tokens",void 0),t([nt({attribute:!1})],Gt.prototype,"resources",void 0),t([nt()],Gt.prototype,"selection",void 0),t([at("root",!0)],Gt.prototype,"root",void 0),t([at("bg-viewport",!0)],Gt.prototype,"viewport",void 0),t([rt()],Gt.prototype,"_drop_hint",void 0),t([rt()],Gt.prototype,"hovering",void 0),Gt=t([st("bg-canvas")],Gt);const Kt=t=>72*Math.round(t/72),Vt=t=>t-t%72,Yt={iceServers:[{urls:"stun:stun.l.google.com:19302"}]};class qt{constructor(t){this.#R=()=>{},this.#U=new RTCPeerConnection(Yt),this.#O=!1,this.#R=t,this.#z()}#R;#U;#O;async initiate(){this.#O=!0;let t=await this.#U.createOffer();await this.#U.setLocalDescription(t),this.#R({type:"offer",offer:t})}#z(){null!==this.#U.localDescription&&(this.#U.onicecandidate=null,this.#U.onconnectionstatechange=null,this.#U.close()),this.#U=new RTCPeerConnection(Yt),this.data=this.#U.createDataChannel("data",{ordered:!0,negotiated:!0,id:1}),this.events=this.#U.createDataChannel("control",{ordered:!0,negotiated:!0,id:2}),this.#U.onicecandidate=({candidate:t})=>{null!==t&&this.#R({type:"icecandidate",candidate:t})},this.#U.onconnectionstatechange=()=>{"closed"===this.#U.connectionState&&(this.#z(),this.#O&&this.initiate())}}async signal(t){console.log("received",t);let i=this.#U.signalingState;switch(t.type){case"offer":if("stable"!==i)return void console.error(`Received offer at incorrect state: ${i}. Ignoring.`);this.#U.setRemoteDescription(new RTCSessionDescription(t.offer));const e=await this.#U.createAnswer();await this.#U.setLocalDescription(e),this.#R({type:"answer",answer:e});break;case"answer":if("have-local-offer"!==i)return void console.error(`Received answer at incorrect state: ${i}. Ignoring.`);this.#U.setRemoteDescription(new RTCSessionDescription(t.answer));break;case"icecandidate":await this.#U.addIceCandidate(t.candidate)}}}class Ft extends EventTarget{constructor(t,i){super(),this.#N=!1,this.#P="connected",this.#j=new Map,this.#L=t,this.#D=i}#L;#D;#N;#P;#j;get ident(){return this.#L}get status(){return this.#P}static async establish(t,i){i&&(t.pathname="/"+i);let e=await this.#I(t);return console.log("acquired socket for ",i),new Promise(((t,i)=>{e.addEventListener("message",(s=>{let o=JSON.parse(s.data);e.removeEventListener("close",i);let n=new Ft(o.id,e);n.#J(),t(n)}),{once:!0}),e.addEventListener("close",i)}))}static async#I(t){return new Promise(((i,e)=>{let s=new WebSocket(t.toString());s.addEventListener("close",(t=>e(t)),{once:!0}),s.addEventListener("open",(()=>{console.log("WS CONNECTED"),s.removeEventListener("close",e),i(s)}))}))}#J(){let t=new URL(this.#D.url);this.#D.addEventListener("error",(t=>{this.dispatchEvent(new CustomEvent("error",{detail:t}))})),this.#D.addEventListener("close",(()=>this.#B(t))),this.#D.addEventListener("message",(t=>{let i=JSON.parse(t.data);this.#H(i)}))}async connect_to(t){let i=new qt((i=>{this.#D.send(JSON.stringify({target:t,...i})),"shutdown"===i.type&&this.#j.delete(i.from)}));return this.#j.set(t,i),await i.initiate(),i}#W(t){this.#P=t,this.dispatchEvent(new CustomEvent("status",{detail:t}))}async#B(t){let i;if(t.pathname="/"+this.#L,this.#N)this.#W("closed");else{this.#W("disconnected");try{i=await Ft.#I(t)}catch(t){return console.error("Error reconnecting",t),void setTimeout((()=>this.#B),1e3)}this.#D=i,this.#J(),this.#W("connected")}}_disconnect(){this.#D.close()}close(){this.#N=!0,this.#D.close()}#H(t){if(console.log(t),t.error)this.dispatchEvent(new CustomEvent("error",{detail:t.error}));else if("offer"!==t.type||this.#j.has(t.from))this.#j.get(t.from)?.signal(t),"shutdown"===t.type&&this.#j.delete(t.from);else{let i=new qt((i=>{this.#D.send(JSON.stringify({target:t.from,...i})),"shutdown"===t.type&&this.#j.delete(t.from)}));this.#j.set(t.from,i),i.signal(t),this.dispatchEvent(new CustomEvent("peer",{detail:i}))}}}const Qt=t=>{let i=(t=>new ReadableStream({start(i){t.onmessage=({data:t})=>i.enqueue(t);const e=()=>{i.close(),t.removeEventListener("close",e)};t.addEventListener("close",e)},cancel(){t.close()}}))(t).pipeThrough((()=>{let t,i=[];return new TransformStream({start(){},async transform(e,s){if("string"==typeof e){let i=JSON.parse(e);if("event"===i.type)return void s.enqueue(i.event);t=i}else{if(!t)return;if(i.push(e),0==--t.chunks)return s.enqueue({type:"file",res_name:t.res_name,contents:new Blob(i)}),void(i=[])}},flush(){i=[]}})})()),e=new TransformStream({start(){},async transform(t,i){if("file"===t.type){i.enqueue(JSON.stringify({type:"file",res_name:t.res_name,chunks:Math.ceil(t.contents.size/64e3)}));for(let e=0;e<t.contents.size;e+=64e3)i.enqueue(await t.contents.slice(e,Math.min(e+64e3,t.contents.size)).arrayBuffer())}else i.enqueue(JSON.stringify({type:"event",event:t}))}});return e.readable.pipeTo((t=>{let i;return new WritableStream({start(e){const s=()=>{e.error("Closed"),t.removeEventListener("close",s)};t.addEventListener("close",s),t.onopen=()=>i&&i(),t.onbufferedamountlow=()=>i&&i()},async write(e){("connecting"===t.readyState||t.bufferedAmount>t.bufferedAmountLowThreshold)&&await new Promise(((t,e)=>i=t)),t.send(e)},abort(){t.close()}},new CountQueuingStrategy({highWaterMark:1}))})(t)),{writable:e.writable,readable:i}};class Xt{constructor(t){this.server=this,this.#Z=new Set,this.#G=new Set,this.on_event=()=>{},this.signaler=t;let{readable:i,writable:e}=new TransformStream({start(){},transform(t,i){console.log("TF STREAM"),i.enqueue(t)},flush(){}}),s=i.getReader(),o=e.getWriter();this.signaler.addEventListener("peer",(async({detail:t})=>{let i=Qt(t.events),e=Qt(t.data);const s=i.writable.getWriter(),n=e.writable.getWriter();this.#Z.add(s),this.#G.add(n),console.log("Getting state"),this.get_state&&(console.log("state",this.get_state()),s.write(this.get_state())),console.log("writing images");for(const[t,i]of this.get_images?this.get_images():[])console.log(t,i),n.write({type:"file",res_name:t,contents:await(await fetch(i)).blob()});(async()=>{let t,e,n=i.readable.getReader();for(;({value:t,done:e}=await n.read())&&!e;)await o.write({author:s,ev:t});this.#Z.delete(s)})(),(async()=>{let t,i,r=e.readable.getReader();for(;({value:t,done:i}=await r.read())&&!i;)await o.write({author:s,ev:t});this.#G.delete(n)})()})),(async()=>{let t,i,e;for(;({value:{author:e,ev:t},done:i}=await s.read())&&!i;)await this.send_event(t,e),this.on_event(t)})()}get status(){return"connected"===this.signaler.status?"connected":"disconnected"}#Z;#G;async send_event(t,i){let e="file"===t.type?this.#G:this.#Z;await Promise.all(Array.from(e).filter((t=>t!==i)).map((i=>i.write(t))))}static async establish(){return new Xt(await Ft.establish(new URL("wss://battlegrid-signaling.herokuapp.com/")))}}class ti{constructor(t){this.status="disconnected",this.server=void 0,this.on_event=t=>{},this.on_status=()=>{},this.#K=t}#V;#Y;#K;#W(t){this.status=t,setTimeout(this.on_status,0)}async connect(){let t;this.#W("connecting");try{let i=await Ft.establish(new URL("wss://battlegrid-signaling.herokuapp.com"));t=await new Promise((async(t,e)=>{i.addEventListener("error",e,{once:!0});let s=await i.connect_to(this.#K);s.data.onopen=()=>t(s)}))}catch(t){return console.log("error"),void this.#W("error")}let i=Qt(t.events);this.#V=i.writable.getWriter();let e=i.readable.getReader(),s=Qt(t.data);this.#Y=s.writable.getWriter();let o=s.readable.getReader();this.#W("connected"),(async()=>{let t,i;for(;({value:t,done:i}=await o.read())&&!i;)console.log("DATA",t),this.on_event(t);console.log("dccccc"),this.#W("disconnected")})(),(async()=>{let t,i;for(;({value:t,done:i}=await e.read())&&!i;)console.log("EVENT!",t),this.on_event(t);console.log("dccccc"),this.#W("disconnected")})()}async send_event(t){("file"===t.type?this.#Y:this.#V)?.write(t)}}let ii=class extends it{constructor(){super(...arguments),this._state=!1,this._loaded=!1,this._buy=t=>{console.log("CLICK"),bt(t),this._state=!0,document.addEventListener("click",this.#q,{capture:!0})},this.#q=t=>{bt(t),this._state=!1,document.removeEventListener("click",this.#q,{capture:!0})},this.#F=t=>{this._loaded=!0}}render(){return z`<button @click="${this._buy}">Buy Me A Coffee</button> ${this._state?z`<div id="container"><iframe class="${this._loaded?"loaded":""}" allow="payment" src="https://ko-fi.com/djrenren/?hidefeed=true&widget=true&embed=true&preview=true" title="djrenren" @load="${this.#F}"></iframe></div>`:null}`}#q;#F};ii.styles=n`:host{display:block;position:relative}iframe{border:none;display:block;opacity:0;width:100%;height:100%;transition:opacity .5s linear}#container{border-radius:5px;box-shadow:0 0 6px rgba(0,0,0,.7);position:absolute;width:350px;height:525px;bottom:-535px;right:0;animation-name:fade;animation-duration:.5s;animation-direction:backwards;background:url(assets/loading.svg) center/100px no-repeat,#ededf0;overflow:hidden}iframe.loaded{opacity:1}@keyframes fade{0%{opacity:0}100%{opacity:1}}`,t([rt()],ii.prototype,"_state",void 0),t([rt()],ii.prototype,"_loaded",void 0),ii=t([st("buy-me-a-coffee")],ii);class ei{constructor(){this.index=new Set}get(t){return t.startsWith("local:")?window.sessionStorage.getItem(t):t}delete(t){const i=this.get(t);return!!i&&(URL.revokeObjectURL(i),window.sessionStorage.removeItem(t),!0)}register(t,i){if("string"==typeof t)return t;let e=i??"local:"+Ht();return this.index.add(e),window.sessionStorage.setItem(e,URL.createObjectURL(t)),e}*all(){for(let t of this.index.values())yield[t,this.get(t)]}}class si extends EventTarget{constructor(){super(...arguments),this.tokens=new Zt,this.grid_dim=[30,20],this.resources=new ei,this.get_state=()=>({type:"state-sync",tokens:[...this.tokens.values()],grid_dim:this.grid_dim,bg:this.#Q})}#Q;get bg(){return this.#Q?this.resources.get(this.#Q):null}set_bg(t){const i=t?this.resources.register(t):void 0;this.#X({type:"bg",res:i})}add_token(t,i){const e={id:Ht(),res:this.resources.register(t),...i};this.#X({type:"token-added",...e})}apply(t){switch(console.log("APPLYING!"),t.type){case"token-manipulated":let i=this.tokens.get(t.id);if(!i)return void console.error("Update received for nonexistant token",t.id);Object.assign(i,{dim:t.dim,loc:t.loc,r:t.r});break;case"token-added":let e={id:t.id,dim:t.dim,loc:t.loc,res:t.res,r:0};this.tokens.add(t.id,e);break;case"grid-resized":this.grid_dim=t.dim;break;case"token-removed":const s=this.tokens.get(t.id);if(!s)return void console.error("Tried to remove nonexistant token",t.id);this.resources.delete(s.res),this.tokens.delete(s.id);break;case"state-sync":console.log("applying #tokens",t.tokens),this.tokens=new Zt;for(const i of t.tokens)this.tokens.add(i.id,i);this.grid_dim=t.grid_dim,this.#Q=t.bg;break;case"file":this.resources.register(t.contents,t.res_name);break;case"bg":this.#Q&&this.resources.delete(this.#Q),this.#Q=t.res}this.dispatchEvent(new CustomEvent("updated"))}remove_token(t){this.#X({type:"token-removed",id:t})}#X(t){this.apply(t),this.dispatchEvent(new CustomEvent("game-event",{detail:t}))}set_dim(t){this.#X({type:"grid-resized",dim:t})}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi=t=>null!=t?t:j;let ni=class extends it{constructor(){super(...arguments),this.host_pending=!1,this.#tt=new si,this.#it=()=>{this.#tt.set_dim(At([1,1],[parseInt(this.width?.value)??0,parseInt(this.height?.value)??0]))},this.#et=()=>{this.client&&!this.client.server&&this.client.connect()},this.#st=()=>{this.client=void 0,window.history.pushState(null,"",window.location.href.split("?")[0])},this.#ot=async()=>{try{this.host_pending=!0;let t=await Xt.establish();this.host_pending=!1,this.client=t,t.on_event=this.#nt,t.get_state=this.#tt.get_state,t.get_images=()=>this.#tt.resources.all(),window.history.pushState({},"","?game="+t.signaler.ident),navigator.clipboard.writeText(window.location.toString())}catch(t){console.error(t)}},this.#nt=t=>{console.log("APPLOY!",this.canvas),this.#tt.apply(t),this.requestUpdate()},this.#rt=t=>{this.client?.send_event(t.detail)}}#tt;render(){let t="error"===this.client?.status?z`<div class="message error"><div><h1>Error connecting to remote grid</h1><button @click="${this.#et}">Try again</button> <button @click="${this.#st}">New local grid</button></div></div>`:null,i="connecting"===this.client?.status?z`<div class="message"><div><h1>Connecting to grid...</h1></div></div>`:null,e="disconnected"===this.client?.status?z`<div class="message"><div><h1>Disconnected from host</h1><button @click="${this.#et}">Try again</button> <button @click="${this.#st}">Continue locally</button></div></div>`:null,s=t||i||e;return z`<section id="toolbar" class="group"><div class="group"><span>Grid: <input id="width" type="number" min="1" @input="${this.#it}" value="${this.#tt.grid_dim[0]}"> x <input id="height" type="number" min="1" @input="${this.#it}" value="${this.#tt.grid_dim[1]}"> </span>${this.host_pending?z`<img src="assets/loading.svg">`:this.client?z`<div>${this.client.server?"hosting":this.client.status}</div>`:z`<button @click="${this.#ot}">Host</button>`}</div><div class="group"><buy-me-a-coffee class="right"></buy-me-a-coffee></div></section><bg-canvas bg="${oi(this.#tt.bg??void 0)}" selection="${oi(this.selection?.id)}" width="${this.#tt.grid_dim[0]}" height="${this.#tt.grid_dim[1]}" .tokens="${this.#tt.tokens}" .resources="${this.#tt.resources}" @token-drop="${({detail:t})=>this.#tt.add_token(t.img,{loc:t.loc,r:0,dim:t.dim})}" @bg-drop="${({detail:t})=>this.#tt.set_bg(t)}" @token-select="${({detail:t})=>{this.selection=t?this.#tt.tokens.get(t):void 0}}" @game-event="${({detail:t})=>this.#tt.apply(t)}"></bg-canvas>${s}`}updated(t){t.has("client")&&(document.title="BattleGrid"+(this.client&&"connected"===this.client.status?this.client.server?"- Hosting":"- Connected":""))}#it;async connectedCallback(){super.connectedCallback(),this.#tt.addEventListener("game-event",this.#rt),this.#tt.addEventListener("updated",(()=>{this.selection&&!this.#tt.tokens.has(this.selection.id)&&(this.selection=void 0),this.requestUpdate(),this.canvas?.requestUpdate()}));let t=new URLSearchParams(window.location.search).get("game");if(!t)return{};let i=new ti(t);i.on_event=this.#nt,i.on_status=()=>this.requestUpdate("client"),this.client=i,await i.connect()}#et;#st;#ot;#nt;#rt};ni.styles=n`:host{width:100%;height:100%;display:grid;grid:"toolbar" 30px "viewport" 1fr/1fr;font-family:inherit;--ui-bg:#f9f9fa}.message{grid-area:1/1/3/1;display:grid;align-items:center;justify-items:center;background:#fff;z-index:2}.right{justify-self:end}bg-canvas{grid-area:viewport;z-index:1}input[type=number]{width:3em}.group{display:flex;align-items:center;height:100%;flex-wrap:nowrap}#toolbar{grid-area:toolbar;box-shadow:0 0 4px gray;z-index:2;background:var(--ui-bg);justify-content:space-between;padding:0 1em;grid-template-rows:unset}.group img{width:1em;height:1em;object-fit:cover;display:inline-block}`,t([at("#width",!0)],ni.prototype,"width",void 0),t([at("#height",!0)],ni.prototype,"height",void 0),t([at("bg-canvas",!0)],ni.prototype,"canvas",void 0),t([rt()],ni.prototype,"client",void 0),t([rt()],ni.prototype,"selection",void 0),t([rt()],ni.prototype,"host_pending",void 0),ni=t([st("bg-app")],ni),document.body.addEventListener("wheel",(t=>{console.log("HUH..."),t.ctrlKey&&t.preventDefault()}),{passive:!1});
//# sourceMappingURL=bundle.js.map
