function t(t,i,e,s){var n,o=arguments.length,r=o<3?i:null===s?s=Object.getOwnPropertyDescriptor(i,e):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,i,e,s);else for(var h=t.length-1;h>=0;h--)(n=t[h])&&(r=(o<3?n(r):o>3?n(i,e,r):n(i,e))||r);return o>3&&r&&Object.defineProperty(i,e,r),r}function i(t,i,e,s){if("a"===e&&!s)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof i?t!==i||!s:!i.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===e?s:"a"===e?s.call(t):s?s.value:i.get(t)}function e(t,i,e,s,n){if("m"===s)throw new TypeError("Private method is not writable");if("a"===s&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof i?t!==i||!n:!i.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===s?n.call(t,e):n?n.value=e:i.set(t,e),e
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const s=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),o=new WeakMap;class r{constructor(t,i,e){if(this._$cssResult$=!0,e!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(s&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=o.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o.set(i,t))}return t}toString(){return this.cssText}}const h=(t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,e,s)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[s+1]),t[0]);return new r(e,t,n)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,n))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var l;const c=window.trustedTypes,d=c?c.emptyScript:"",u=window.reactiveElementPolyfillSupport,f={toAttribute(t,i){switch(i){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},p=(t,i)=>i!==t&&(i==i||t==t),v={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:p};class w extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var i;null!==(i=this.h)&&void 0!==i||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,e)=>{const s=this._$Ep(e,i);void 0!==s&&(this._$Ev.set(s,e),t.push(s))})),t}static createProperty(t,i=v){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const e="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,e,i);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){return{get(){return this[i]},set(s){const n=this[t];this[i]=s,this.requestUpdate(t,n,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const e of i)this.createProperty(e,t[e])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(a(t))}else void 0!==t&&i.push(a(t));return i}static _$Ep(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,e;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(e=t.hostConnected)||void 0===e||e.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{s?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((i=>{const e=document.createElement("style"),s=window.litNonce;void 0!==s&&e.setAttribute("nonce",s),e.textContent=i.cssText,t.appendChild(e)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,e){this._$AK(t,e)}_$EO(t,i,e=v){var s,n;const o=this.constructor._$Ep(t,e);if(void 0!==o&&!0===e.reflect){const r=(null!==(n=null===(s=e.converter)||void 0===s?void 0:s.toAttribute)&&void 0!==n?n:f.toAttribute)(i,e.type);this._$El=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$El=null}}_$AK(t,i){var e,s;const n=this.constructor,o=n._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=n.getPropertyOptions(o),r=t.converter,h=null!==(s=null!==(e=null==r?void 0:r.fromAttribute)&&void 0!==e?e:"function"==typeof r?r:null)&&void 0!==s?s:f.fromAttribute;this._$El=o,this[o]=h(i,t.type),this._$El=null}}requestUpdate(t,i,e){let s=!0;void 0!==t&&(((e=e||this.constructor.getPropertyOptions(t)).hasChanged||p)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===e.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,e))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(e)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(e)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;w.finalized=!0,w.elementProperties=new Map,w.elementStyles=[],w.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:w}),(null!==(l=globalThis.reactiveElementVersions)&&void 0!==l?l:globalThis.reactiveElementVersions=[]).push("1.3.3");const b=globalThis.trustedTypes,m=b?b.createPolicy("lit-html",{createHTML:t=>t}):void 0,y=`lit$${(Math.random()+"").slice(9)}$`,$="?"+y,k=`<${$}>`,x=document,M=(t="")=>x.createComment(t),S=t=>null===t||"object"!=typeof t&&"function"!=typeof t,W=Array.isArray,C=t=>{var i;return W(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},_=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,E=/-->/g,T=/>/g,A=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,R=/'/g,U=/"/g,N=/^(?:script|style|textarea|title)$/i,O=t=>(i,...e)=>({_$litType$:t,strings:i,values:e}),z=O(1),j=O(2),I=Symbol.for("lit-noChange"),P=Symbol.for("lit-nothing"),L=new WeakMap,D=x.createTreeWalker(x,129,null,!1),H=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?"<svg>":"",r=_;for(let i=0;i<e;i++){const e=t[i];let h,a,l=-1,c=0;for(;c<e.length&&(r.lastIndex=c,a=r.exec(e),null!==a);)c=r.lastIndex,r===_?"!--"===a[1]?r=E:void 0!==a[1]?r=T:void 0!==a[2]?(N.test(a[2])&&(n=RegExp("</"+a[2],"g")),r=A):void 0!==a[3]&&(r=A):r===A?">"===a[0]?(r=null!=n?n:_,l=-1):void 0===a[1]?l=-2:(l=r.lastIndex-a[2].length,h=a[1],r=void 0===a[3]?A:'"'===a[3]?U:R):r===U||r===R?r=A:r===E||r===T?r=_:(r=A,n=void 0);const d=r===A&&t[i+1].startsWith("/>")?" ":"";o+=r===_?e+k:l>=0?(s.push(h),e.slice(0,l)+"$lit$"+e.slice(l)+y+d):e+y+(-2===l?(s.push(void 0),i):d)}const h=o+(t[e]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==m?m.createHTML(h):h,s]};class B{constructor({strings:t,_$litType$:i},e){let s;this.parts=[];let n=0,o=0;const r=t.length-1,h=this.parts,[a,l]=H(t,i);if(this.el=B.createElement(a,e),D.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(s=D.nextNode())&&h.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const i of s.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(y)){const e=l[o++];if(t.push(i),void 0!==e){const t=s.getAttribute(e.toLowerCase()+"$lit$").split(y),i=/([.?@])?(.*)/.exec(e);h.push({type:1,index:n,name:i[2],strings:t,ctor:"."===i[1]?Z:"?"===i[1]?F:"@"===i[1]?Q:V})}else h.push({type:6,index:n})}for(const i of t)s.removeAttribute(i)}if(N.test(s.tagName)){const t=s.textContent.split(y),i=t.length-1;if(i>0){s.textContent=b?b.emptyScript:"";for(let e=0;e<i;e++)s.append(t[e],M()),D.nextNode(),h.push({type:2,index:++n});s.append(t[i],M())}}}else if(8===s.nodeType)if(s.data===$)h.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(y,t+1));)h.push({type:7,index:n}),t+=y.length-1}n++}}static createElement(t,i){const e=x.createElement("template");return e.innerHTML=t,e}}function G(t,i,e=t,s){var n,o,r,h;if(i===I)return i;let a=void 0!==s?null===(n=e._$Cl)||void 0===n?void 0:n[s]:e._$Cu;const l=S(i)?void 0:i._$litDirective$;return(null==a?void 0:a.constructor)!==l&&(null===(o=null==a?void 0:a._$AO)||void 0===o||o.call(a,!1),void 0===l?a=void 0:(a=new l(t),a._$AT(t,e,s)),void 0!==s?(null!==(r=(h=e)._$Cl)&&void 0!==r?r:h._$Cl=[])[s]=a:e._$Cu=a),void 0!==a&&(i=G(t,a._$AS(t,i.values),a,s)),i}class K{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:e},parts:s}=this._$AD,n=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:x).importNode(e,!0);D.currentNode=n;let o=D.nextNode(),r=0,h=0,a=s[0];for(;void 0!==a;){if(r===a.index){let i;2===a.type?i=new J(o,o.nextSibling,this,t):1===a.type?i=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(i=new Y(o,this,t)),this.v.push(i),a=s[++h]}r!==(null==a?void 0:a.index)&&(o=D.nextNode(),r++)}return n}m(t){let i=0;for(const e of this.v)void 0!==e&&(void 0!==e.strings?(e._$AI(t,e,i),i+=e.strings.length-2):e._$AI(t[i])),i++}}class J{constructor(t,i,e,s){var n;this.type=2,this._$AH=P,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=e,this.options=s,this._$Cg=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=G(this,t,i),S(t)?t===P||null==t||""===t?(this._$AH!==P&&this._$AR(),this._$AH=P):t!==this._$AH&&t!==I&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):C(t)?this.S(t):this.$(t)}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==P&&S(this._$AH)?this._$AA.nextSibling.data=t:this.k(x.createTextNode(t)),this._$AH=t}T(t){var i;const{values:e,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=B.createElement(s.h,this.options)),s);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===n)this._$AH.m(e);else{const t=new K(n,this),i=t.p(this.options);t.m(e),this.k(i),this._$AH=t}}_$AC(t){let i=L.get(t.strings);return void 0===i&&L.set(t.strings,i=new B(t)),i}S(t){W(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let e,s=0;for(const n of t)s===i.length?i.push(e=new J(this.M(M()),this.M(M()),this,this.options)):e=i[s],e._$AI(n),s++;s<i.length&&(this._$AR(e&&e._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var e;for(null===(e=this._$AP)||void 0===e||e.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class V{constructor(t,i,e,s,n){this.type=1,this._$AH=P,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=n,e.length>2||""!==e[0]||""!==e[1]?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=P}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=G(this,t,i,0),o=!S(t)||t!==this._$AH&&t!==I,o&&(this._$AH=t);else{const s=t;let r,h;for(t=n[0],r=0;r<n.length-1;r++)h=G(this,s[e+r],i,r),h===I&&(h=this._$AH[r]),o||(o=!S(h)||h!==this._$AH[r]),h===P?t=P:t!==P&&(t+=(null!=h?h:"")+n[r+1]),this._$AH[r]=h}o&&!s&&this.C(t)}C(t){t===P?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Z extends V{constructor(){super(...arguments),this.type=3}C(t){this.element[this.name]=t===P?void 0:t}}const q=b?b.emptyScript:"";class F extends V{constructor(){super(...arguments),this.type=4}C(t){t&&t!==P?this.element.setAttribute(this.name,q):this.element.removeAttribute(this.name)}}class Q extends V{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}_$AI(t,i=this){var e;if((t=null!==(e=G(this,t,i,0))&&void 0!==e?e:P)===I)return;const s=this._$AH,n=t===P&&s!==P||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==P&&(s===P||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,e;"function"==typeof this._$AH?this._$AH.call(null!==(e=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==e?e:this.element,t):this._$AH.handleEvent(t)}}class Y{constructor(t,i,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const X={L:"$lit$",P:y,V:$,I:1,N:H,R:K,j:C,D:G,H:J,F:V,O:F,W:Q,B:Z,Z:Y},tt=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var it,et;null==tt||tt(B,J),(null!==(g=globalThis.litHtmlVersions)&&void 0!==g?g:globalThis.litHtmlVersions=[]).push("2.2.6");class st extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const e=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=e.firstChild),e}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,e)=>{var s,n;const o=null!==(s=null==e?void 0:e.renderBefore)&&void 0!==s?s:i;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==e?void 0:e.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new J(i.insertBefore(M(),t),t,void 0,null!=e?e:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return I}}st.finalized=!0,st._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:st});const nt=globalThis.litElementPolyfillSupport;null==nt||nt({LitElement:st}),(null!==(et=globalThis.litElementVersions)&&void 0!==et?et:globalThis.litElementVersions=[]).push("3.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot=t=>i=>"function"==typeof i?((t,i)=>(window.customElements.define(t,i),i))(t,i):((t,i)=>{const{kind:e,elements:s}=i;return{kind:e,elements:s,finisher(i){window.customElements.define(t,i)}}})(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,rt=(t,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(e){e.createProperty(i.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(e){e.createProperty(i.key,t)}};function ht(t){return(i,e)=>void 0!==e?((t,i,e)=>{i.constructor.createProperty(e,t)})(t,i,e):rt(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function at(t){return ht({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=({finisher:t,descriptor:i})=>(e,s)=>{var n;if(void 0===s){const s=null!==(n=e.originalKey)&&void 0!==n?n:e.key,o=null!=i?{kind:"method",placement:"prototype",key:s,descriptor:i(e.key)}:{...e,key:s};return null!=t&&(o.finisher=function(i){t(i,s)}),o}{const n=e.constructor;void 0!==i&&Object.defineProperty(e,s,i(s)),null==t||t(n,s)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function ct(t){return lt({finisher:(i,e)=>{Object.assign(i.prototype[e],t)}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dt(t,i){return lt({descriptor:e=>{const s={get(){var i,e;return null!==(e=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==e?e:null},enumerable:!0,configurable:!0};if(i){const i="symbol"==typeof e?Symbol():"__"+e;s.get=function(){var e,s;return void 0===this[i]&&(this[i]=null!==(s=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==s?s:null),this[i]}}return s}})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ut;null===(ut=window.HTMLSlotElement)||void 0===ut||ut.prototype.assignedElements;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ft=1,pt=2,vt=t=>(...i)=>({_$litDirective$:t,values:i});class wt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,e){this._$Ct=t,this._$AM=i,this._$Ci=e}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=vt(class extends wt{constructor(t){var i;if(super(t),t.type!==ft||"style"!==t.name||(null===(i=t.strings)||void 0===i?void 0:i.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((i,e)=>{const s=t[e];return null==s?i:i+`${e=e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[i]){const{style:e}=t.element;if(void 0===this.ct){this.ct=new Set;for(const t in i)this.ct.add(t);return this.render(i)}this.ct.forEach((t=>{null==i[t]&&(this.ct.delete(t),t.includes("-")?e.removeProperty(t):e[t]="")}));for(const t in i){const s=i[t];null!=s&&(this.ct.add(t),t.includes("-")?e.setProperty(t,s):e[t]=s)}return I}}),bt=t=>t.isPrimary&&("touch"===t.pointerType||t.pressure>0),mt=t=>"mouse"===t.pointerType&&1===t.buttons&&t.pressure>0,yt=t=>"touch"!==t.pointerType&&t.isPrimary&&t.pressure>0,$t=t=>{t.preventDefault(),t.stopPropagation()},kt=(t,i)=>new CustomEvent(t,{detail:i});function xt(t,i){return new Promise((e=>{i.addEventListener(t,e,{once:!0})}))}const Mt=(t,i)=>[t[0]+i[0],t[1]+i[1]],St=(t,i)=>Mt(t,[i,i]),Wt=(t,i)=>[t[0]-i[0],t[1]-i[1]],Ct=(t,i)=>[t[0]*i,t[1]*i],_t=(t,i)=>[t[0]*i[0],t[1]*i[1]],Et=(t,i)=>[t[0]/i[0],t[1]/i[1]],Tt=(t,i)=>[t[0]/i,t[1]/i],At=(t,i)=>[Math.max(t[0],i[0]),Math.max(t[1],i[1])],Rt=(t,i)=>[Math.min(t[0],i[0]),Math.min(t[1],i[1])],Ut=(t,i,e)=>At(t,Rt(i,e)),Nt=(t,i)=>t[0]===i[0]&&t[1]===i[1];var Ot,zt,jt,It,Pt,Lt,Dt,Ht,Bt,Gt,Kt,Jt,Vt,Zt,qt,Ft,Qt;let Yt=class extends st{constructor(){super(...arguments),Ot.add(this),this.scale=1,this.c_dim=[0,0],this.v_dim=[0,0],this.v_loc=[0,0],zt.set(this,void 0),this._scrollPos=[0,0],this.smooth=0,Bt.set(this,0),Gt.set(this,[0,0]),Kt.set(this,new ResizeObserver((t=>{for(let e of t)switch(e.target){case this.surface:this.v_dim=[e.contentRect.width,e.contentRect.height];const t=this.getBoundingClientRect();this.v_loc=[t.x,t.y],this.smooth=0;break;case i(this,zt,"f"):this.c_dim=[i(this,zt,"f").width.baseVal.value,i(this,zt,"f").height.baseVal.value]}}))),Jt.set(this,(t=>{t.ctrlKey&&("="===t.key?($t(t),this.smooth=200,this._performZoom(this.coordToLocal(Tt(Mt(this.v_loc,this.v_dim),2)),.2*this.scale)):"-"===t.key?($t(t),this.smooth=200,this._performZoom(this.coordToLocal(Tt(Mt(this.v_loc,this.v_dim),2)),-.2*this.scale)):"0"===t.key&&(this.smooth=100,i(this,Ot,"m",Vt).call(this)))})),Zt.set(this,[0,0]),qt.set(this,(t=>{$t(t),t.target.setPointerCapture(t.pointerId),e(this,Zt,[t.clientX,t.clientY],"f")})),Ft.set(this,((t,s,n,o)=>{this.smooth=0;let r=i(this,Ot,"a",jt),h=i(this,Zt,"f");e(this,Zt,[t.clientX,t.clientY],"f"),e(this,Ot,[s?r[0]+o*(i(this,Zt,"f")[0]-h[0]):r[0],n?r[1]+o*(i(this,Zt,"f")[1]-h[1]):r[1]],"a",It)})),Qt.set(this,(t=>{t.target.releasePointerCapture(t.pointerId)})),this._touchdragstart=t=>{t.isPrimary&&"touch"===t.pointerType&&i(this,qt,"f").call(this,t)},this._touchdragmove=t=>{t.isPrimary&&"touch"===t.pointerType&&i(this,Ft,"f").call(this,t,!0,!0,-1)},this._touchdragend=t=>{t.isPrimary&&"touch"===t.pointerType&&i(this,Qt,"f").call(this,t)}}get offset(){return At([0,0],Ct(Wt(this.v_dim,Ct(this.c_dim,this.scale)),.5)).map((t=>t))}render(){const t=this.offset,e=i(this,Ot,"a",jt);let s=!1,n=!1;this.v_dim&&this.c_dim&&(s=this.v_dim[1]<this.c_dim[1]*this.scale,n=this.v_dim[0]<this.c_dim[0]*this.scale);const o=Et(_t(this.v_dim,this.v_dim),Ct(this.c_dim,this.scale)),r=Et(_t(e,this.v_dim),Ct(this.c_dim,this.scale));return z`<style>:host,:root{--scale:${this.scale}}::slotted(svg){transform:translate(${t[0]-e[0]}px,${t[1]-e[1]}px) scale(var(--scale))}*,::slotted(svg){transition-duration:${this.smooth+"ms"}}</style><div id="touch-surface" @wheel="${this._wheel}" @pointerdown="${this._touchdragstart}" @pointermove="${this._touchdragmove}" @pointerup="${this._touchdragend}" @gesturestart="${this._gesturestart}" @gesturechange="${this._gesturechange}"><div id="bg" part="background"></div><slot @slotchange="${this.handleSlotchange}"></slot><div part="bar" class="bottombar" style="${gt({transform:`translate(${r[0]}px, 0)`,width:`${o[0]}px`,display:n?"block":"none"})}" @pointerdown="${i(this,Ot,"m",Pt)}" @pointermove="${i(this,Ot,"m",Lt)}" @pointerup="${i(this,Ot,"m",Ht)}"></div><div part="bar" class="rightbar" style="${gt({transform:`translate(0, ${r[1]}px)`,height:`${o[1]}px`,display:s?"block":"none"})}" @pointerdown="${i(this,Ot,"m",Pt)}" @pointermove="${i(this,Ot,"m",Dt)}" @pointerup="${i(this,Ot,"m",Ht)}"></div></div>`}_wheel(t){$t(t);const s=t.deltaMode===WheelEvent.DOM_DELTA_LINE?10:1;if(t.ctrlKey){const i=Math.min(50,Math.max(-50,-t.deltaY*s)),e=.005*i*this.scale;this.smooth=50===Math.abs(i)?300:0,this._performZoom(this.coordToLocal([t.clientX,t.clientY]),e)}else{const n=Ct([t.deltaX,t.deltaY],s);this.smooth=2*(Math.abs(n[0])+Math.abs(n[1])),this.smooth=0,e(this,Ot,Mt(n,i(this,Ot,"a",jt)),"a",It)}}_gesturestart(t){e(this,Gt,this.coordToLocal([t.clientX,t.clientY]),"f"),e(this,Bt,1,"f"),$t(t)}_gesturechange(t){$t(t),this._performZoom(i(this,Gt,"f"),this.scale*(t.scale-i(this,Bt,"f"))*1.5),e(this,Bt,t.scale,"f")}_performZoom(t,s){let n=Math.min(1,Math.max(.2,this.scale+s)),o=n-this.scale;e(this,Ot,Mt(Ct(t,o),i(this,Ot,"a",jt)),"a",It),this.scale=n}firstUpdated(){i(this,Kt,"f").observe(this.surface)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",i(this,Jt,"f"))}disconnectedCallback(){super.disconnectedCallback(),i(this,Kt,"f").disconnect(),document.removeEventListener("keydown",i(this,Jt,"f"))}coordToLocal(t){const e=Mt(Wt(t,this.v_loc),i(this,Ot,"a",jt));return Tt(Wt(e,this.offset),this.scale)}handleSlotchange({target:t}){i(this,zt,"f")&&i(this,Kt,"f").unobserve(i(this,zt,"f")),e(this,zt,t.assignedElements().find((t=>t.matches("svg"))),"f"),i(this,Ot,"m",Vt).call(this),i(this,zt,"f")&&i(this,Kt,"f").observe(i(this,zt,"f"))}static get styles(){return h`#touch-surface{position:relative;width:100%;height:100%;overflow:clip}::slotted(svg){transform-origin:0 0;position:absolute}.bottombar{position:fixed;bottom:0;height:var(--thickness);transform-origin:0 0;backface-visibility:hidden;will-change:width}.rightbar{position:fixed;width:var(--thickness);transform-origin:0 0;backface-visibility:hidden;right:0;will-change:height}*,::slotted(svg){transition-property:all}#bg{position:absolute;z-index:-1;height:100%;width:100%}`}};zt=new WeakMap,Bt=new WeakMap,Gt=new WeakMap,Kt=new WeakMap,Jt=new WeakMap,Zt=new WeakMap,qt=new WeakMap,Ft=new WeakMap,Qt=new WeakMap,Ot=new WeakSet,jt=function(){return At([0,0],Rt(this._scrollPos,Wt(Ct(this.c_dim,this.scale),this.v_dim)))},It=function(t){const i=this._scrollPos;this._scrollPos=t,this.requestUpdate("#scrollPos",i)},Pt=function(t){yt(t)&&i(this,qt,"f").call(this,t)},Lt=function(t){yt(t)&&i(this,Ft,"f").call(this,t,!0,!1,this.c_dim[0]*this.scale/this.v_dim[0])},Dt=function(t){yt(t)&&i(this,Ft,"f").call(this,t,!1,!0,this.c_dim[1]*this.scale/this.v_dim[1])},Ht=function(t,e){i(this,Qt,"f").call(this,t)},Vt=function(){const t=[i(this,zt,"f").width.baseVal.value,i(this,zt,"f").height.baseVal.value],e=this.surface.getBoundingClientRect();this.scale=Math.max(.2,Math.min(1,...Ct(Et([e.width,e.height],t),.95)))},t([ht({type:Number})],Yt.prototype,"scale",void 0),t([at()],Yt.prototype,"c_dim",void 0),t([at()],Yt.prototype,"v_dim",void 0),t([at()],Yt.prototype,"v_loc",void 0),t([at()],Yt.prototype,"_scrollPos",void 0),t([dt("#touch-surface",!0)],Yt.prototype,"surface",void 0),t([at()],Yt.prototype,"smooth",void 0),t([ct({passive:!1,capture:!0})],Yt.prototype,"_wheel",null),t([ct({capture:!0})],Yt.prototype,"_gesturestart",null),t([ct({passive:!1})],Yt.prototype,"_gesturechange",null),Yt=t([ot("bg-viewport")],Yt);const Xt=()=>{document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`)};window.addEventListener("resize",Xt),Xt();
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{H:ti}=X,ii=()=>document.createComment(""),ei=(t,i,e)=>{var s;const n=t._$AA.parentNode,o=void 0===i?t._$AB:i._$AA;if(void 0===e){const i=n.insertBefore(ii(),o),s=n.insertBefore(ii(),o);e=new ti(i,s,t,t.options)}else{const i=e._$AB.nextSibling,r=e._$AM,h=r!==t;if(h){let i;null===(s=e._$AQ)||void 0===s||s.call(e,t),e._$AM=t,void 0!==e._$AP&&(i=t._$AU)!==r._$AU&&e._$AP(i)}if(i!==o||h){let t=e._$AA;for(;t!==i;){const i=t.nextSibling;n.insertBefore(t,o),t=i}}}return e},si=(t,i,e=t)=>(t._$AI(i,e),t),ni={},oi=t=>{var i;null===(i=t._$AP)||void 0===i||i.call(t,!1,!0);let e=t._$AA;const s=t._$AB.nextSibling;for(;e!==s;){const t=e.nextSibling;e.remove(),e=t}},ri=(t,i,e)=>{const s=new Map;for(let n=i;n<=e;n++)s.set(t[n],n);return s},hi=vt(class extends wt{constructor(t){if(super(t),t.type!==pt)throw Error("repeat() can only be used in text expressions")}dt(t,i,e){let s;void 0===e?e=i:void 0!==i&&(s=i);const n=[],o=[];let r=0;for(const i of t)n[r]=s?s(i,r):r,o[r]=e(i,r),r++;return{values:o,keys:n}}render(t,i,e){return this.dt(t,i,e).values}update(t,[i,e,s]){var n;const o=(t=>t._$AH)(t),{values:r,keys:h}=this.dt(i,e,s);if(!Array.isArray(o))return this.ut=h,r;const a=null!==(n=this.ut)&&void 0!==n?n:this.ut=[],l=[];let c,d,u=0,f=o.length-1,p=0,v=r.length-1;for(;u<=f&&p<=v;)if(null===o[u])u++;else if(null===o[f])f--;else if(a[u]===h[p])l[p]=si(o[u],r[p]),u++,p++;else if(a[f]===h[v])l[v]=si(o[f],r[v]),f--,v--;else if(a[u]===h[v])l[v]=si(o[u],r[v]),ei(t,l[v+1],o[u]),u++,v--;else if(a[f]===h[p])l[p]=si(o[f],r[p]),ei(t,o[u],o[f]),f--,p++;else if(void 0===c&&(c=ri(h,p,v),d=ri(a,u,f)),c.has(a[u]))if(c.has(a[f])){const i=d.get(h[p]),e=void 0!==i?o[i]:null;if(null===e){const i=ei(t,o[u]);si(i,r[p]),l[p]=i}else l[p]=si(e,r[p]),ei(t,o[u],e),o[i]=null;p++}else oi(o[f]),f--;else oi(o[u]),u++;for(;p<=v;){const i=ei(t,l[v+1]);si(i,r[p]),l[p++]=i}for(;u<=f;){const t=o[u++];null!==t&&oi(t)}return this.ut=h,((t,i=ni)=>{t._$AH=i})(t,l),I}}),ai=async t=>{let i=t.dataTransfer?.items??[];return new Promise((async(t,e)=>{console.log("DataItems",i.length);for(let e=0;e<i.length;e++){if(console.log(i[e].type),i[e].type.startsWith("image/"))return t(i[e].getAsFile());if("text/html"===i[e].type)return void i[e].getAsString((i=>t(li(i))));if("application/x-moz-file-promise-url"===i[e].type)return void i[e].getAsString((t=>{}));if("string"===i[e].kind){let t=i[e].type;i[e].getAsString((i=>console.log(t,i)))}}return e("No compatible drop type found")}))};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function li(t){const i=(new DOMParser).parseFromString(t,"text/html").querySelector("img")?.src;return i??null}const ci=t=>new CustomEvent("game-event",{detail:t});class di{constructor(){this.order=[],this.map=new Map}get(t){const i=this.map.get(t);if(void 0!==i)return this.order[i]}has(t){return this.map.has(t)}add(t,i){this.map.set(t,this.order.length),this.order.push(i)}delete(t){const i=this.map.get(t);return void 0!==i&&(this.order.splice(i,1),this.map.delete(t),this.map.forEach(((t,e)=>{t>=i&&this.map.set(e,t-1)})),!0)}index(t){return this.map.get(t)}set_index(t,i){const e=this.map.get(t);if(void 0===e||i>=this.order.length)return!1;const s=this.order.splice(e,1)[0];return this.order.splice(i,0,s),this.map.forEach(((t,e)=>{t>=i&&this.map.set(e,t+1)})),this.map.set(t,i),!0}values(){return this.order}get size(){return this.map.size}}const ui=t=>t[Symbol.iterator]().next().value;function*fi(t,i){for(let e of t)yield i(e)}var pi,vi,wi,gi,bi,mi,yi,$i,ki,xi,Mi,Si,Wi,Ci,_i,Ei,Ti,Ai,Ri,Ui,Ni,Oi,zi;let ji=class extends st{constructor(){super(),pi.add(this),this.width=30,this.height=40,this.tokens=new di,this.selection=new Set,this.callouts=new Set,vi.set(this,void 0),wi.set(this,void 0),bi.set(this,0),mi.set(this,(t=>{var s;$t(t),e(this,bi,(s=i(this,bi,"f"),++s),"f")})),yi.set(this,(t=>{$t(t);const e=i(this,Oi,"f").call(this,t).map(Pi),s=Ct(St([this.width,this.height],-1),72);this._drop_hint=Ut([0,0],s,e),this.hovering="canvas"})),$i.set(this,(t=>{var s;e(this,bi,(s=i(this,bi,"f"),--s),"f")<=0&&(this._drop_hint=void 0,this.hovering=void 0)})),ki.set(this,(t=>{$t(t),this._drop_hint=void 0,this.hovering="bg"})),xi.set(this,(async t=>{$t(t);try{const i=await ai(t);this.dispatchEvent(kt("bg-drop",i))}catch(t){}e(this,bi,0,"f"),this.hovering=void 0})),Mi.set(this,(async t=>{$t(t);try{const i=await ai(t);this.dispatchEvent(kt("token-drop",{loc:this._drop_hint,dim:[72,72],img:i}))}catch(t){}this._drop_hint=void 0,this.hovering=void 0})),Si.set(this,(t=>{if(!mt(t))return;t.preventDefault(),t.stopPropagation();const i=t.target.id;t.shiftKey||t.ctrlKey?this.dispatchEvent(kt("token-select",[i,...this.selection].filter((t=>t!==i||!this.selection.has(i))))):this.dispatchEvent(kt("token-select",[t.target.id]))})),Ti.set(this,void 0),Ai.set(this,(t=>{if(!bt(t))return;const s=i(this,Oi,"f").call(this,t);$t(t),t.target.setPointerCapture(t.pointerId),e(this,Ti,s,"f")})),Ri.set(this,{move:[0,0],resize:[0,0],r:0}),Ui.set(this,(t=>{if(!bt(t))return;i(this,Ti,"f")||i(this,Ai,"f").call(this,t),$t(t);const s=Ut([0,0],i(this,pi,"a",gi),i(this,Oi,"f").call(this,t)),n=this.tokens.get(this.selection.values().next().value),o=n.dim,r=n.loc,h=t.target.classList;let a=[0,0],l=[0,0],c=0;if(h.contains("rn")&&(l[1]=r[1]-Ii(s[1]),a[1]=Ii(s[1])-r[1]),h.contains("rw")&&(l[0]=r[0]-Ii(s[0]),a[0]=Ii(s[0])-r[0]),h.contains("rs")&&(l[1]=Ii(s[1])-o[1]-r[1]),h.contains("re")&&(l[0]=Ii(s[0])-o[0]-r[0]),h.contains("ro")){const t=Mt(r,Tt(o,2)),i=Wt(s,t),e=180*Math.atan2(i[0],-i[1])/Math.PI;c=90*Math.round(e/90)-n.r%360}h.contains("selection-drag-target")?(console.log("move"),a=Wt(s,i(this,Ti,"f")).map(Ii)):(a=Rt(St(o,-72),a),l=At(St(Ct(o,-1),72),l)),c===i(this,Ri,"f").r&&Nt(a,i(this,Ri,"f").move)&&Nt(l,i(this,Ri,"f").resize)||(e(this,Ti,Mt(i(this,Ti,"f"),a),"f"),e(this,Ri,{move:[0,0],resize:[0,0],r:0},"f"),this.dispatchEvent(ci({type:"token-manipulated",tokens:Array.from(this.selection,(t=>{let i=this.tokens.get(t);return{id:i.id,loc:Mt(i.loc,a),dim:Mt(i.dim,l),r:i.r+c}}))})))})),Ni.set(this,(t=>{$t(t),e(this,Ti,void 0,"f")})),Oi.set(this,(t=>Wt(this.viewport.coordToLocal([t.clientX,t.clientY]),[60,60]))),zi.set(this,(t=>{if(!this.selection)return;if(8===t.keyCode)return this.dispatchEvent(ci({type:"token-removed",ids:Array.from(this.selection)})),void $t(t);"z"===t.key&&i(this,wi,"f")&&this.dispatchEvent(ci({type:"callout",loc:i(this,Oi,"f").call(this,i(this,wi,"f"))})),this.tokens.get(this.selection.values().next().value);let e={ArrowUp:[0,-72],ArrowDown:[0,72],ArrowLeft:[-72,0],ArrowRight:[72,0]}[t.key];e&&(this.dispatchEvent(ci({type:"token-manipulated",tokens:Array.from(this.selection,(t=>{const s=this.tokens.get(t),n=Ut([0,0],Wt(i(this,pi,"a",gi),s.dim),Mt(s.loc,e));return{id:s.id,loc:n,dim:s.dim,r:s.r}}))})),$t(t))}))}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",i(this,zi,"f"))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",i(this,zi,"f"))}render(){let[t,s]=i(this,pi,"a",gi),n=i(this,pi,"m",Ei).call(this),o=1===this.selection.size?this.tokens.get(this.selection.values().next().value):void 0;return z`
      <bg-viewport
        @pointerdown=${i(this,pi,"m",Wi)}
        @pointermove=${i(this,pi,"m",Ci)}
        @pointerup=${i(this,pi,"m",_i)}
        @pointerleave=${()=>e(this,wi,void 0,"f")}
        @dragstart=${$t}
        @dragenter=${i(this,mi,"f")}
        @dragleave=${i(this,$i,"f")}
        @dragstop=${i(this,$i,"f")}
        @dragover=${i(this,yi,"f")}
        @drop=${i(this,Mi,"f")}
      >
        <svg id="root" width=${t+120} height=${s+120}>
          <defs>
            <clipPath id="canvasClip">
              <rect width=${t} height=${s} rx=${15}></rect>
            </clipPath>
            <pattern id="horiz" x=${-.75} y=${-.75} width="100%" height=${72} patternUnits="userSpaceOnUse">
              <rect class="gridline" width="100%" height=${1.5} fill="#d3d3d3"></rect>
            </pattern>
            <pattern id="vert" x=${-.75} y=${-.75} width=${72} height="100%" patternUnits="userSpaceOnUse">
              <rect class="gridline" width=${1.5} height="100%" fill="#d3d3d3"></rect>
            </pattern>
            <pattern id="loading" patternUnits="userSpaceOnUse" width="1" height="1">
              <rect width="1" height="1" fill="white"></rect>
              <image href="/assets/loading.svg" width="1" height="1" />
            </pattern>
          </defs>
          <svg x=${60} y=${60} width=${t} height=${s} id="surface">
            <rect class="shadow" width="100%" height="100%" fill="white" rx=${15}></rect>
            <svg clip-path="url(#canvasClip)">
              ${this.bg?j`<image href=${this.bg} width="100%" height="100%" preserveAspectRatio="none" style="will-change: transform"></image>`:null}
              <rect width="100%" height="100%" fill="url(#horiz)" opacity="0.75" pointer-events="none"></rect>
              <rect width="100%" height="100%" fill="url(#vert)" opacity="0.75" pointer-events="none"></rect>
              <svg id="tokens">
                ${hi(this.tokens.values(),(t=>t.id),((t,e)=>{const[s,o]=St(t.dim,-1.5),[r,h]=St(t.loc,.75);return z`
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
                          @pointerdown=${i(this,Si,"f")}
                          @load=${Li}
                        ></image>
                        <rect width="1" height="1" class="loading"></rect>
                      </svg>

                      ${n?.index===e?j`<rect
                            class="selection-drag-target"
                            x=${n.bbox.start[0]}
                            y=${n.bbox.start[1]}
                            width=${n.bbox.end[0]-n.bbox.start[0]}
                            height=${n.bbox.end[1]-n.bbox.start[1]}
                            fill="transparent"
                            @pointerdown=${i(this,Ai,"f")}
                            @pointermove=${i(this,Ui,"f")}
                            @pointerup=${i(this,Ni,"f")}
                        ></rect>`:null}
                    `}))}
              </svg>
              ${this._drop_hint?j`
            <rect
                class="drop_hint"
                x=${this._drop_hint[0]}
                y=${this._drop_hint[1]}
                width=${72}
                height=${72}
                ></rect>
          `:null}
            </svg>
            ${i(this,vi,"f")?j`
              <rect id="sbox"
                x=${Math.min(i(this,vi,"f").pin[0],i(this,vi,"f").mouse[0])}
                y=${Math.min(i(this,vi,"f").pin[1],i(this,vi,"f").mouse[1])}
                width=${Math.abs(i(this,vi,"f").pin[0]-i(this,vi,"f").mouse[0])}
                height=${Math.abs(i(this,vi,"f").pin[1]-i(this,vi,"f").mouse[1])}
                ></rect>
              `:null}
            ${hi(this.callouts,(t=>t),(t=>{const[i,e]=Wt(t,[36,36]);return j`
                  <image href="assets/callout.svg" x=${i} y=${e} width=${72} height=${72}></image>
                `}))}
            ${n?j`
            <svg
              id="selection"
              x=${n.bbox.start[0]}
              y=${n.bbox.start[1]}
              width=${n.bbox.end[0]-n.bbox.start[0]}
              height=${n.bbox.end[1]-n.bbox.start[1]}
              @pointerdown=${i(this,Ai,"f")}
              @pointermove=${i(this,Ui,"f")}
              @pointerup=${i(this,Ni,"f")}>
              <rect class="selection-box" width="100%" height="100%"  ></rect>
            ${o?j`
            <g style=${`transform-origin: center; transform: rotate(${o.r}deg) translateY(${Math.sign((o.r-180)%180)*(o.dim[0]-o.dim[1])/2}px)`}>
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
            </g>
            </svg>`:null}`:null}
          </svg>
        </svg>
      </bg-viewport>
      <div
        id="bg-drop"
        class=${this.hovering??""}
        @dragenter=${i(this,mi,"f")}
        @dragover=${i(this,ki,"f")}
        @dragleave=${i(this,$i,"f")}
        @drop=${i(this,xi,"f")}
      >
        <div id="bg-drop-label" @drop=${i(this,xi,"f")}>Set Background</div>
      </div>
    `}createRenderRoot(){return super.createRenderRoot()}};vi=new WeakMap,wi=new WeakMap,bi=new WeakMap,mi=new WeakMap,yi=new WeakMap,$i=new WeakMap,ki=new WeakMap,xi=new WeakMap,Mi=new WeakMap,Si=new WeakMap,Ti=new WeakMap,Ai=new WeakMap,Ri=new WeakMap,Ui=new WeakMap,Ni=new WeakMap,Oi=new WeakMap,zi=new WeakMap,pi=new WeakSet,gi=function(){return Ct([this.width,this.height],72)},Wi=function(t){if(!mt(t))return;t.target.setPointerCapture(t.pointerId);const s=i(this,Oi,"f").call(this,t);e(this,vi,{pin:s,mouse:s},"f")},Ci=function(t){e(this,wi,{clientX:t.clientX,clientY:t.clientY},"f"),i(this,vi,"f")&&(i(this,vi,"f").mouse=i(this,Oi,"f").call(this,t),this.requestUpdate())},_i=function(t){if(!i(this,vi,"f"))return;t.target.setPointerCapture(t.pointerId);const s=Rt(i(this,vi,"f").pin,i(this,vi,"f").mouse),n=(t=>[Math.abs(t[0]),Math.abs(t[1])])(Wt(i(this,vi,"f").pin,i(this,vi,"f").mouse)),o={start:s,end:Mt(s,n)},r=this.tokens.order.filter((t=>((t,i)=>!(i.start[0]>t.end[0]||i.end[0]<t.start[0]||i.start[1]>t.end[1]||i.end[1]<t.start[1]))(o,{start:t.loc,end:Mt(t.loc,t.dim)}))).map((t=>t.id));e(this,vi,void 0,"f"),this.dispatchEvent(kt("token-select",r)),this.requestUpdate()},Ei=function(){if(0===this.selection.size)return;const t=Array.from(this.selection,(t=>this.tokens.get(t))).filter((t=>t)),i=Math.max(...fi(this.selection.values(),(t=>this.tokens.index(t))));let e=t[0].loc,s=Mt(t[0].loc,t[0].dim);return t.forEach((t=>{e=Rt(e,t.loc),s=At(s,Mt(t.loc,t.dim))})),{index:i,bbox:{start:e,end:s}}},ji.styles=h`
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
      fill: transparent;
    }

    .selection-box {
      pointer-events: none !important;
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

    .selection-drag-target {
      pointer-events: fill;
      cursor: move;
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
  `,t([ht({type:Number})],ji.prototype,"width",void 0),t([ht({type:Number})],ji.prototype,"height",void 0),t([ht()],ji.prototype,"bg",void 0),t([ht({attribute:!1})],ji.prototype,"tokens",void 0),t([ht({attribute:!1})],ji.prototype,"selection",void 0),t([ht({attribute:!1})],ji.prototype,"callouts",void 0),t([ht({attribute:!1})],ji.prototype,"sel_bbox",void 0),t([dt("root",!0)],ji.prototype,"root",void 0),t([dt("bg-viewport",!0)],ji.prototype,"viewport",void 0),t([at()],ji.prototype,"_drop_hint",void 0),t([at()],ji.prototype,"hovering",void 0),ji=t([ot("bg-canvas")],ji);const Ii=t=>72*Math.round(t/72),Pi=t=>t-t%72,Li=t=>t.target.classList.add("loaded");var Di,Hi;let Bi=class extends st{constructor(){super(...arguments),this._state=!1,this._loaded=!1,this._buy=t=>{console.log("CLICK"),$t(t),this._state=!0,document.addEventListener("click",i(this,Di,"f"),{capture:!0})},Di.set(this,(t=>{$t(t),this._state=!1,document.removeEventListener("click",i(this,Di,"f"),{capture:!0})})),Hi.set(this,(t=>{this._loaded=!0}))}render(){return z`<button @click="${this._buy}">Buy Me A Coffee</button> ${this._state?z`<div id="container"><iframe class="${this._loaded?"loaded":""}" allow="payment" src="https://ko-fi.com/djrenren/?hidefeed=true&widget=true&embed=true&preview=true" title="djrenren" @load="${i(this,Hi,"f")}"></iframe></div>`:null}`}};async function Gi(t,i){return t.pipeTo(new WritableStream({write:i}))}function Ki(t){let i=new TransformStream({transform(t,i){i.enqueue(JSON.stringify(t))}});return i.readable.pipeTo(t.writable),{readable:t.readable.pipeThrough(new TransformStream({transform(t,i){i.enqueue(JSON.parse(t))}})),writable:i.writable}}Di=new WeakMap,Hi=new WeakMap,Bi.styles=h`:host{display:block;position:relative}iframe{border:none;display:block;opacity:0;width:100%;height:100%;transition:opacity .5s linear}#container{border-radius:5px;box-shadow:0 0 6px rgba(0,0,0,.7);position:absolute;width:350px;height:525px;bottom:-535px;right:0;animation-name:fade;animation-duration:.5s;animation-direction:backwards;background:url(assets/loading.svg) center/100px no-repeat,#ededf0;overflow:hidden}iframe.loaded{opacity:1}@keyframes fade{0%{opacity:0}100%{opacity:1}}`,t([at()],Bi.prototype,"_state",void 0),t([at()],Bi.prototype,"_loaded",void 0),Bi=t([ot("buy-me-a-coffee")],Bi);const Ji=t=>JSON.stringify({...t,tokens:[...fi(t.tokens.values(),(t=>({...t})))]});var Vi,Zi,qi,Fi;class Qi extends EventTarget{constructor(){super(),Vi.add(this),this.tabletop={tokens:new di,grid_dim:[30,20],bg:null},this.callouts=new Set,Zi.set(this,void 0);const t=new TransformStream;e(this,Zi,t.writable.getWriter(),"f"),Gi(t.readable,(t=>i(this,Vi,"m",qi).call(this,t)))}async set_bg(t){const e=t?await i(this,Vi,"m",Fi).call(this,t):null;this.apply({type:"bg",url:e})}async add_token(t,e){const s={id:crypto.randomUUID(),url:await i(this,Vi,"m",Fi).call(this,t),...e};this.apply({type:"token-added",...s})}set_dim(t){this.apply({type:"grid-resized",dim:t})}async apply(t){await i(this,Zi,"f").write(t)}}Zi=new WeakMap,Vi=new WeakSet,qi=async function(t){switch(t.type){case"token-manipulated":for(let i of t.tokens){let t=this.tabletop.tokens.get(i.id);if(!t)return void console.error("Update received for nonexistant token",i.id);Object.assign(t,{dim:i.dim,loc:i.loc,r:i.r})}break;case"token-added":let i={id:t.id,dim:t.dim,loc:t.loc,url:t.url,r:0};this.tabletop.tokens.add(t.id,i);break;case"grid-resized":this.tabletop.grid_dim=t.dim;break;case"token-removed":for(let i of t.ids){const t=this.tabletop.tokens.get(i);if(!t)return void console.error("Tried to remove nonexistant token",i);this.tabletop.tokens.delete(t.id)}break;case"state-sync":this.tabletop=(t=>{let i=JSON.parse(t),e=new di;return i.tokens.forEach((t=>e.add(t.id,t))),{...i,tokens:e}})(t.tabletop);break;case"token-reorder":const e=this.tabletop.tokens.index(t.id);if(void 0===e)return void console.error("Tried to reorder non-existant token",t.id);let s;s="top"===t.idx?this.tabletop.tokens.size-1:"bottom"===t.idx?0:"up"===t.idx?Math.min(this.tabletop.tokens.size-1,e+1):Math.max(0,e-1),this.tabletop.tokens.set_index(t.id,s);break;case"bg":this.tabletop.bg=t.url;break;case"callout":this.callouts.add(t.loc),setTimeout((()=>{this.callouts.delete(t.loc)}),1500)}this.dispatchEvent(ci(t))},Fi=async function(t){if("string"==typeof t)return t;let i=new URL(window.location.toString());i.search="";let e=crypto.randomUUID();i.pathname=`/resources/${e}`;let s=await caches.open("resources");return await s.put(i,new Response(t)),i.toString()};const Yi=t=>({readable:Xi(t),writable:te(t)}),Xi=t=>new ReadableStream({start(i){t.onmessage=({data:t})=>{console.log("RECEIVED",t),i.enqueue(t)};const e=()=>{i.close(),t.removeEventListener("close",e)};t.addEventListener("close",e)},cancel(){t.close()}}),te=t=>{let i;return t.addEventListener("error",(t=>console.log("DC ERROR",t))),new WritableStream({start(e){const s=()=>{console.log("stream closed by dc ending"),e.error("Closed foo"),t.removeEventListener("close",s)};t.addEventListener("close",s),t.onopen=()=>i&&i(),t.onbufferedamountlow=()=>i&&i()},async write(e){("connecting"===t.readyState||t.bufferedAmount>t.bufferedAmountLowThreshold)&&(console.log("waiting for resumptoin..."),await new Promise(((t,e)=>i=t)),console.log("resumed!")),console.log("writing",e),t.send(e)},abort(){console.log("aborted dc by stream"),t.close()},close(){console.log("closed dc by stream"),t.close()}},new CountQueuingStrategy({highWaterMark:1}))};var ie,ee,se,ne,oe,re,he,ae,le;class ce{constructor(t,i){ie.set(this,void 0),this.ondatachannel=t=>{},this.id=t,this.rtc=i,this.events_dc=i.createDataChannel("events",{negotiated:!0,id:1});let{readable:s,writable:n}=Ki(Yi(this.events_dc));this.events=s,e(this,ie,n.getWriter(),"f"),this.rtc.ondatachannel=t=>this.ondatachannel(t)}write_event(t){return t.remote=this.id,i(this,ie,"f").write(t)}datachannel(t,i){return new Promise(((e,s)=>{let n=this.rtc.createDataChannel(t,i);n.addEventListener("open",(()=>{n.removeEventListener("error",s),e(n)}),{once:!0}),n.addEventListener("error",s,{once:!0})}))}}ie=new WeakMap;const de={iceServers:[{urls:"stun:stun.l.google.com:19302"}]},ue=new URL("ws://localhost:8080");class fe{constructor(t,s){ee.add(this),se.set(this,new Map),ne.set(this,void 0),oe.set(this,void 0),re.set(this,void 0),he.set(this,void 0),e(this,ne,t,"f"),this.peer_id=s;const n=new TransformStream;this.incoming_peers=n.readable,e(this,oe,n.writable.getWriter(),"f"),e(this,re,i(this,ne,"f").writable.getWriter(),"f"),e(this,he,new AbortController,"f"),i(this,ee,"m",le).call(this)}static async establish(t=ue,i=crypto.randomUUID()){t.pathname=i;let e=await async function(t){let i,e=await t(),s=e.writable.getWriter(),n=e.readable.getReader(),o=async()=>i||(i=(async()=>{e=await t(),s=e.writable.getWriter(),n=e.readable.getReader(),i=void 0})()),r=new WritableStream({async write(t,i){let e=!1;for(;!e;)try{await s.write(t),e=!0}catch(t){await o()}},async close(){await s.close()},async abort(t){await s.abort(t)}},new CountQueuingStrategy({highWaterMark:50}));return{readable:new ReadableStream({async pull(t){let i=!0;for(;i;)try{let{done:e,value:s}=await n.read();e?(console.log("HUH"),await o()):t.enqueue(s),i=!1}catch(t){await o()}},async cancel(t){await n.cancel(t)}}),writable:r}}((async()=>Ki(function(t){const i=new ReadableStream({start(i){t.onmessage=({data:t})=>i.enqueue(t),t.onclose=t=>{i.error(t.reason)}},cancel(){t.close()}}),e=new WritableStream({start(i){t.onclose=t=>i.error(t.reason),t.addEventListener("open",(()=>{}),{once:!0})},async write(i){t.readyState!==WebSocket.OPEN&&await new Promise((i=>t.addEventListener("open",(()=>i()),{once:!0}))),t.send(i)},abort(){t.close()},close(){t.close()}});return{readable:i,writable:e}}(await async function(t){return t.readyState===WebSocket.OPEN?t:new Promise(((i,e)=>{t.addEventListener("error",e,{once:!0}),t.addEventListener("open",(()=>{t.removeEventListener("close",e),i(t)}),{once:!0})}))}(new WebSocket(t))))));return new fe(e,i)}async initiate(t){let e=i(this,ee,"m",ae).call(this,t),s=await e.rtc.createOffer();return await e.rtc.setLocalDescription(s),i(this,re,"f").write({type:"offer",from:this.peer_id,to:t,offer:s}),await Promise.race([xt("open",e.events_dc),xt("close",e.events_dc).then((()=>{throw new Error("Unable to connect to host")}))]),e}async shutdown(){try{i(this,he,"f").abort("shutting down signaler")}catch{}await i(this,re,"f").close()}}se=new WeakMap,ne=new WeakMap,oe=new WeakMap,re=new WeakMap,he=new WeakMap,ee=new WeakSet,ae=function(t){let e=new ce(t,new RTCPeerConnection(de));i(this,se,"f").set(t,e);const s=({candidate:e})=>{null!==e&&i(this,re,"f").write({type:"icecandidate",from:this.peer_id,to:t,candidate:e})};e.rtc.addEventListener("icecandidate",s);const n=async()=>{e.rtc.removeEventListener("icecandidate",s),i(this,se,"f").delete(t)};return e.events_dc.addEventListener("close",n),i(this,he,"f").signal.addEventListener("abort",n),e.events_dc.addEventListener("open",(async()=>{await i(this,oe,"f").write(e)})),e},le=async function(){i(this,ne,"f").readable.pipeTo(new WritableStream({write:async t=>{if(console.log(t),"error-not-exists"===t.type){return i(this,se,"f").get(t.destination)?.rtc.close(),void console.log("closing")}let e=i(this,se,"f").get(t.from);switch(t.type){case"offer":e=i(this,ee,"m",ae).call(this,t.from),e.rtc.setRemoteDescription(new RTCSessionDescription(t.offer));let s=await e.rtc.createAnswer();await e.rtc.setLocalDescription(s),i(this,re,"f").write({type:"answer",from:this.peer_id,to:t.from,answer:s});break;case"answer":e?.rtc.setRemoteDescription(new RTCSessionDescription(t.answer));break;case"icecandidate":await(e?.rtc.addIceCandidate(t.candidate))}}}),{signal:i(this,he,"f").signal}).catch((t=>{}))};async function pe(t){let i=[];return await Gi(t.readable,(async t=>{console.log("READING resource CHUNK"),i.push(t)})),{blob:new Blob(i)}}var ve,we,ge,be,me,ye,$e,ke,xe,Me,Se,We,Ce,_e,Ee,Te;class Ae extends EventTarget{constructor(t,s,n){super(),ve.add(this),ge.set(this,void 0),be.set(this,void 0),me.set(this,void 0),e(this,ge,s,"f"),e(this,be,n,"f"),e(this,me,t,"f"),i(this,ve,"m",ye).call(this),navigator.serviceWorker.onmessage=async t=>{let e=t.data.id;console.log("CLIENT ATTEMPTING TO FETCH",i(this,be,"f").events_dc.readyState),await i(this,be,"f").datachannel(e,{protocol:"request-resource"}).then(Yi).then(pe).then((async({blob:t})=>{console.log("COMMUNICATING WITH SERVICE WORKER"),navigator.serviceWorker.controller.postMessage({type:"found",id:e,blob:t})})).catch((t=>{console.error("Error fetching resource: ",t),navigator.serviceWorker.controller.postMessage({type:"notfound",id:e,error:t})}))}}get status(){return i(this,be,"f").rtc.iceConnectionState}async reconnect(){e(this,be,await i(Ae,we,"m",$e).call(Ae,i(this,me,"f")),"f"),i(this,ve,"m",ye).call(this)}static async establish(t,e){return console.log("ESTABLISHING CLIENT"),new Ae(t,e,await i(this,we,"m",$e).call(this,t))}shutdown(){i(this,be,"f").rtc.close(),navigator.serviceWorker.onmessage=null}}we=Ae,ge=new WeakMap,be=new WeakMap,me=new WeakMap,ve=new WeakSet,ye=function(){console.log("configuring peer",i(this,be,"f").events_dc.readyState),Gi(i(this,be,"f").events,(t=>i(this,ge,"f").apply(t)));let t=({detail:t})=>{console.log("CALLBACK",t),t.remote||i(this,be,"f").write_event(t)};i(this,ge,"f").addEventListener("game-event",t),i(this,be,"f").events_dc.addEventListener("close",(()=>{i(this,ge,"f").removeEventListener("game-event",t)}))},$e=async function(t){let i=await fe.establish(),e=await i.initiate(t);return i.shutdown(),e};class Re{constructor(t,s){ke.add(this),xe.set(this,void 0),Me.set(this,new Set),this.signaler=t,e(this,xe,s,"f"),Gi(this.signaler.incoming_peers,(async t=>i(this,ke,"m",Se).call(this,t))),i(this,xe,"f").addEventListener("game-event",(({detail:t})=>{for(let e of i(this,Me,"f"))e.id!==t.remote&&e.write_event(t)}))}static async establish(t){return new Re(await fe.establish(),t)}shutdown(){for(let t of i(this,Me,"f"))t.rtc.close();i(this,Me,"f").clear()}}xe=new WeakMap,Me=new WeakMap,ke=new WeakSet,Se=function(t){i(this,Me,"f").add(t),t.write_event({type:"state-sync",tabletop:Ji(i(this,xe,"f").tabletop)}),Gi(t.events,(e=>(e.remote=t.id,i(this,xe,"f").apply(e)))),t.events_dc.addEventListener("close",(()=>{console.log("PEEER EVENT DC"),i(this,Me,"f").delete(t)})),t.ondatachannel=async t=>{console.log("INCOMING DC",t.channel);const e=t.channel;await xt("open",e),console.log("new dc",e),"request-resource"===e.protocol&&async function(t,i){let e=i.blob,s=t.writable.getWriter();console.log("BLOBL",e);for(let t=0;t<e.size;t+=64e3)console.log("WRITING FIRST ChUNK"),await s.write(await e.slice(t,Math.min(t+64e3,e.size)).arrayBuffer());console.error("closing"),await s.close()}(Yi(e),await i(this,ke,"m",We).call(this,e.label))}},We=async function(t){let i=await fetch(`/resources/${t}`);return{blob:await i.blob()}};let Ue=class extends st{constructor(){super(...arguments),this.selection=new Set,this.host_pending=!1,Ce.set(this,new Qi),_e.set(this,(()=>{i(this,Ce,"f").set_dim(At([1,1],[parseInt(this.width?.value)??0,parseInt(this.height?.value)??0]))})),Ee.set(this,(()=>{this.client?.shutdown(),this.client=void 0,window.history.pushState(null,"",window.location.href.split("?")[0])})),Te.set(this,(async()=>{try{this.host_pending=!0,this.server=await Re.establish(i(this,Ce,"f")),this.client?.shutdown(),this.client=void 0,this.host_pending=!1,window.history.pushState({},"","?game="+this.server.signaler.peer_id),navigator.clipboard.writeText(window.location.toString())}catch(t){console.error(t)}}))}render(){let t="closed"===this.client?.status?z`<div class="message error"><div><h1>Error connecting to remote grid</h1><button @click="${i(this,Ee,"f")}">New local grid</button></div></div>`:null,e="checking"===this.client?.status?z`<div class="message"><div><h1>Connecting to grid...</h1></div></div>`:null,s="disconnected"===this.client?.status?z`<div class="message"><div><h1>Disconnected from host</h1><button @click="${i(this,Ee,"f")}">Continue locally</button></div></div>`:null,n=t||e||s;return z`<section id="toolbar" class="group"><div class="group"><span>Grid: <input id="width" type="number" min="1" @input="${i(this,_e,"f")}" .value="${i(this,Ce,"f").tabletop.grid_dim[0]+""}"> x <input id="height" type="number" min="1" @input="${i(this,_e,"f")}" .value="${i(this,Ce,"f").tabletop.grid_dim[1]+""}"> </span>${1===this.selection.size?z`<div><button @click="${()=>i(this,Ce,"f").apply({type:"token-reorder",id:ui(this.selection),idx:"down"})}" ?disabled="${0===i(this,Ce,"f").tabletop.tokens.index(ui(this.selection))}">Move Down</button> <button @click="${()=>i(this,Ce,"f").apply({type:"token-reorder",id:ui(this.selection),idx:"up"})}" ?disabled="${i(this,Ce,"f").tabletop.tokens.index(ui(this.selection))===i(this,Ce,"f").tabletop.tokens.size-1}">Move Up</button></div>`:null}</div><div class="group">${this.host_pending?z`<img src="assets/loading.svg">`:this.client||this.server?z`<div>${this.server?"hosting":this.client.status}</div>`:z`<button @click="${i(this,Te,"f")}">Host</button>`}<buy-me-a-coffee class="right"></buy-me-a-coffee></div></section><bg-canvas bg="${(t=>null!=t?t:P)(i(this,Ce,"f").tabletop.bg??void 0)}" .selection="${this.selection}" width="${i(this,Ce,"f").tabletop.grid_dim[0]}" height="${i(this,Ce,"f").tabletop.grid_dim[1]}" .tokens="${i(this,Ce,"f").tabletop.tokens}" .callouts="${i(this,Ce,"f").callouts}" @token-drop="${({detail:t})=>i(this,Ce,"f").add_token(t.img,{loc:t.loc,r:0,dim:t.dim})}" @bg-drop="${({detail:t})=>i(this,Ce,"f").set_bg(t)}" @token-select="${({detail:t})=>{this.selection=new Set(t)}}" @game-event="${({detail:t})=>i(this,Ce,"f").apply(t)}"></bg-canvas>${n}`}updated(t){t.has("client")&&(document.title="BattleGrid"+(this.client&&"connected"===this.client.status?this.server?"- Hosting":"- Connected":""))}async connectedCallback(){super.connectedCallback(),i(this,Ce,"f").addEventListener("game-event",(()=>{for(const t of this.selection)i(this,Ce,"f").tabletop.tokens.has(t)||this.selection.delete(t);this.requestUpdate(),this.canvas?.requestUpdate()}));let t=new URLSearchParams(window.location.search).get("game");if(!t)return{};try{this.client=await Ae.establish(t,i(this,Ce,"f"))}catch{i(this,Ee,"f").call(this)}}};Ce=new WeakMap,_e=new WeakMap,Ee=new WeakMap,Te=new WeakMap,Ue.styles=h`:host{width:100%;height:100%;display:grid;grid:"toolbar" 30px "viewport" 1fr/1fr;font-family:inherit;--ui-bg:#f9f9fa}.message{grid-area:1/1/3/1;display:grid;align-items:center;justify-items:center;background:#fff;z-index:2}.right{justify-self:end}bg-canvas{grid-area:viewport;z-index:1}input[type=number]{width:3em}.group{display:flex;align-items:center;height:100%;flex-wrap:nowrap}#toolbar{grid-area:toolbar;box-shadow:0 0 4px gray;z-index:2;background:var(--ui-bg);justify-content:space-between;padding:0 1em;grid-template-rows:unset}.group img{width:1em;height:1em;object-fit:cover;display:inline-block}`,t([dt("#width",!0)],Ue.prototype,"width",void 0),t([dt("#height",!0)],Ue.prototype,"height",void 0),t([dt("bg-canvas",!0)],Ue.prototype,"canvas",void 0),t([at()],Ue.prototype,"client",void 0),t([at()],Ue.prototype,"server",void 0),t([at()],Ue.prototype,"selection",void 0),t([at()],Ue.prototype,"host_pending",void 0),Ue=t([ot("bg-app")],Ue),await navigator.serviceWorker.register("/service-worker.js"),document.body.addEventListener("wheel",(t=>{console.log("HUH..."),t.ctrlKey&&t.preventDefault()}),{passive:!1});
//# sourceMappingURL=bundle.js.map
