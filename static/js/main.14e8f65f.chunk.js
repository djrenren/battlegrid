(this.webpackJsonpbattlegrid=this.webpackJsonpbattlegrid||[]).push([[0],{33:function(e,t,n){e.exports=n(58)},45:function(e,t){function n(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id=45},46:function(e,t,n){},47:function(e,t,n){},48:function(e,t,n){},49:function(e,t,n){},55:function(e,t,n){},56:function(e,t,n){},57:function(e,t,n){},58:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(16),c=n.n(o),i=n(2),u=n(5),s=n(62),l=n(1),d=n.n(l),f=n(3),p=n(6),m={was_hosting:function(){return null},comms_id:n(61).a,players:function(){return{}}},v=function(e){var t=sessionStorage.getItem(e);if(t)return JSON.parse(t);var n=m[e]();return sessionStorage.setItem(e,JSON.stringify(n)),n},b=function(e,t){sessionStorage.setItem(e,JSON.stringify(t))},h=n(4);function g(e){return[e.clientX,e.clientY]}function y(e,t){return[e[0]+t[0],e[1]+t[1]]}function O(e,t){return[e[0]-t[0],e[1]-t[1]]}var E={id:"local",maps:[{width:15,height:10,images:{}}]},j=Object(p.c)({name:"game",initialState:E,reducers:{forkGame:function(e,t){e.id=t.payload},loadGame:function(e,t){return t.payload},setDimensions:de((function(e,t){var n=t.payload,r=n.map,a=n.width,o=n.height;e.maps[r].width=a,e.maps[r].height=o})),addImage:de((function(e,t){var n=t.payload,r=n.map,a=n.img;e.maps[r].images[a.id]=a})),updateImage:de((function(e,t){var n=t.payload,r=n.map,a=n.id,o=n.img;e.maps[r].images[a]=Object(h.a)(Object(h.a)({},e.maps[r].images[a]),o)})),moveImage:de((function(e,t){var n=t.payload,r=n.map,a=n.id,o=n.offset;e.maps[r].images[a].loc=y(e.maps[r].images[a].loc,o)})),reset:de((function(e,t){return E}))}}),w=j.reducer,x=j.actions,S=x.setDimensions,k=x.addImage,R=x.updateImage,D=x.reset,_=x.loadGame,C=x.forkGame,L=x.moveImage,P={online:[],data:v("players")},T=Object(p.c)({name:"players",initialState:P,reducers:{playerJoined:de((function(e,t){e.online.push(t.payload),e.data[t.payload]=e.data[t.payload]||{name:null}})),removePlayer:de((function(e,t){e.online=e.online.filter((function(e){return e!==t.payload}))})),changeName:de((function(e,t){e.data[t.payload.player].name=t.payload.name}))}}),I=T.reducer,N=T.actions,M=N.playerJoined,A=N.removePlayer,J=N.changeName;var Y=function(e){return new Promise((function(t){return setTimeout(t,e)}))},B=Object(p.b)("toast/issue",function(){var e=Object(f.a)(d.a.mark((function e(t,n){var r,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.dispatch,a=Date.now(),r(K({id:Date.now(),msg:t})),e.next=5,Y(5e3);case 5:r(U(a));case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()),H=Object(p.c)({name:"toast",initialState:{toasts:[]},reducers:{addToast:function(e,t){var n=t.payload;e.toasts.push(n)},removeToast:function(e,t){var n=t.payload;e.toasts=e.toasts.filter((function(e){return e.id!==n}))}}}),X=H.reducer,z=H.actions,K=z.addToast,U=z.removeToast,W=n(26),F=n.n(W),G=Object({NODE_ENV:"production",PUBLIC_URL:"/battlegrid",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,REACT_APP_PEERJS_HOST:"peers-peerjs-server-3.glitch.me",REACT_APP_PEERJS_PORT:"443"}),V=G.REACT_APP_PEERJS_HOST,Z=G.REACT_APP_PEERJS_PORT;function q(e){return Q.apply(this,arguments)}function Q(){return(Q=Object(f.a)(d.a.mark((function e(t){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("ENV??",Object({NODE_ENV:"production",PUBLIC_URL:"/battlegrid",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,REACT_APP_PEERJS_HOST:"peers-peerjs-server-3.glitch.me",REACT_APP_PEERJS_PORT:"443"})),n=new F.a(t,{debug:3,host:V,secure:!0,port:Z?parseInt(Z):void 0,path:"/"}),e.abrupt("return",new Promise((function(e,t){var r=function(e){o(),t("Error establishing peer: ".concat(e))},a=function(){o(),console.log("OPENING?"),e(n)},o=function(){n.off("open",a),n.off("error",r)};n.on("open",a),n.on("error",r)})));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(e,t,n){return ee.apply(this,arguments)}function ee(){return(ee=Object(f.a)(d.a.mark((function e(t,n,r){var a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.connect(n,{metadata:r}),e.abrupt("return",new Promise((function(e,t){var n=function(e){o(),t("Error establishing peer: ".concat(e))},r=function(){o(),e(a)},o=function(){a.off("open",r),a.off("error",n)};a.on("open",r),a.on("error",n)})));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function te(e,t,n){return ne.apply(this,arguments)}function ne(){return(ne=Object(f.a)(d.a.mark((function e(t,n,r){var a,o,c,i;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=function(){return(i=Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,$(a,t,{client_id:n});case 2:return o=e.sent,setTimeout((function(){return r.onConnect()}),0),e.abrupt("return",new Promise((function(e,t){o.on("error",(function(){re(c,1e3)})),o.on("close",(function(){re(c,1e3)}));o.on("data",(function t(n){o.off("data",t),o.on("data",r.onMessage),r.onInitialMessage(n),e(n)})),o.on("error",(function(){return r.onDisconnect()})),o.on("close",(function(){return r.onDisconnect()}))})));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)},c=function(){return i.apply(this,arguments)},e.next=4,q();case 4:return a=e.sent,e.next=7,c();case 7:return e.abrupt("return",{id:n,send:function(e){o.send(e)}});case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function re(e,t){setTimeout(Object(f.a)(d.a.mark((function n(){return d.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,e();case 3:n.next=8;break;case 5:n.prev=5,n.t0=n.catch(0),re(e,t);case 8:case"end":return n.stop()}}),n,null,[[0,5]])}))),t)}var ae=n(13);function oe(e,t){return ce.apply(this,arguments)}function ce(){return(ce=Object(f.a)(d.a.mark((function e(t,n){var r,a,o;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,q(t);case 2:return r=e.sent,a=new Map,o=function(e,t){var n,r=Object(ae.a)(a);try{for(r.s();!(n=r.n()).done;){var o=Object(u.a)(n.value,2),c=o[0],i=o[1];c!==t&&i.send(e)}}catch(s){r.e(s)}finally{r.f()}},r.on("connection",(function(e){return e.on("open",(function(){var t=e.metadata.client_id;console.log("NEW CLIENT",t),a.set(t,e),e.on("data",(function(e){o(e,t),n.onMessage(e)})),e.on("close",(function(){a.delete(t),n.onDisconnect(t)})),e.on("error",(function(){a.delete(t),n.onDisconnect(t)})),n.onConnect(e.metadata.client_id)}))})),n.onStartup(),e.abrupt("return",{id:t,send:o,sendTo:function(e,t){a.get(e).send(t)}});case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var ie={conn:null},ue=Object(p.b)("comms/connect",function(){var e=Object(f.a)(d.a.mark((function e(t,n){var r,a,o;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.getState,a=n.dispatch,o=r().comms.clientId,e.prev=2,e.next=5,te(t,o,{onMessage:function(e){a(e)},onDisconnect:function(){a(le.actions.disconnected())},onInitialMessage:function(e){a(e)},onConnect:function(){a(le.actions.connected())}});case 5:ie.conn=e.sent,console.log("connected to server!"),e.next=14;break;case 9:throw e.prev=9,e.t0=e.catch(2),a(B("joinFailure")),console.log(e.t0),e.t0;case 14:case"end":return e.stop()}}),e,null,[[2,9]])})));return function(t,n){return e.apply(this,arguments)}}()),se=Object(p.b)("comms/host",function(){var e=Object(f.a)(d.a.mark((function e(t,n){var r,a,o,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.getState,a=n.dispatch,o=r().comms.clientId,e.next=4,oe(o,{onConnect:function(e){var t;c.sendTo(e,{type:"STATE_SYNC",payload:{game:(t=r()).game,players:t.players}}),a(M(e))},onMessage:function(e){a(e)},onDisconnect:function(e){a(A(e))},onStartup:function(){a(M(o))}});case 4:return c=e.sent,ie.conn=c,b("was_hosting",c.id),a(C(c.id)),window.history.pushState(null,"","?game=".concat(c.id)),e.abrupt("return",c.id);case 10:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()),le=Object(p.c)({name:"comms",initialState:{status:"offline",hosting:!1,clientId:v("comms_id"),gameId:null},reducers:{disconnected:function(e,t){e.status="pending"},connected:function(e,t){e.status="connected"}},extraReducers:function(e){e.addCase(ue.pending,(function(e,t){e.status="pending"})),e.addCase(ue.fulfilled,(function(e,t){e.gameId=t.gameId,e.status="connected"})),e.addCase(ue.rejected,(function(e,t){e.status="offline"})),e.addCase(se.pending,(function(e,t){e.status="pending"})),e.addCase(se.fulfilled,(function(e,t){var n=t.payload;e.status="connected",e.gameId=n,e.hosting=!0})),e.addCase(se.rejected,(function(e,t){e.status="offline"}))}});function de(e){return{reducer:e,prepare:function(e){return{payload:e,meta:ie.conn?{shared:!0,src:ie.conn.id}:{}}}}}var fe=le.reducer;n(46);function pe(e){return me.apply(this,arguments)}function me(){return(me=Object(f.a)(d.a.mark((function e(t){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new FileReader,e.abrupt("return",new Promise((function(e,r){n.onload=function(){return e(n.result)},n.readAsDataURL(t)})));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ve(e){var t;return(null===(t=(new DOMParser).parseFromString(e,"text/html").querySelector("img"))||void 0===t?void 0:t.src)||null}function be(e){Object(r.useRef)(null);var t,n=Object(r.useRef)(null),o=Object(i.b)(),c=Object(r.useContext)(Se),s=function(e,t,n){var a=Object(r.useState)(0),o=Object(u.a)(a,2),c=o[0],i=o[1],s=Object(r.useState)({x:0,y:0}),l=Object(u.a)(s,2),d=l[0],f=l[1];return[c>0,d,{onDragEnter:function(e){e.preventDefault(),e.stopPropagation();var t=[e.clientX,e.clientY],n=t[0],r=t[1];i((function(e){return e+1})),f({x:n,y:r})},onDragLeave:function(e){e.preventDefault(),e.stopPropagation();var t=[e.clientX,e.clientY],n=t[0],r=t[1];i((function(e){return e-1})),f({x:n,y:r})},onDragOver:function(e){e.preventDefault(),t(e.clientX,e.clientY)},onDrop:function(e){e.preventDefault();var t=[e.clientX,e.clientY],r=t[0],a=t[1];i(0),f({x:r,y:a}),n(e)}}]}(0,(function(e,t){if(n.current){var r=c.client_to_grid([e,t]);n.current.style.left=Math.floor(r[0])+"em",n.current.style.top=Math.floor(r[1])+"em"}}),function(){var e=Object(f.a)(d.a.mark((function e(t){var n,r,a,i,u,s,l;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=c.client_to_grid([t.clientX,t.clientY]),i=null!==(n=null===(r=t.dataTransfer)||void 0===r?void 0:r.items)&&void 0!==n?n:[],u=function(e){console.log(e);var t={id:""+Math.random(),loc:[Math.floor(a[0]),Math.floor(a[1])],dim:[1,1],href:e};o(k({map:0,img:t}))},console.log("DataItems",i.length),s=0;case 5:if(!(s<i.length)){e.next=25;break}if(console.log(i[s].type),!i[s].type.startsWith("image/")){e.next=13;break}return e.next=10,pe(i[s].getAsFile());case 10:return l=e.sent,u(l),e.abrupt("return");case 13:if("text/html"!==i[s].type){e.next=16;break}return i[s].getAsString((function(e){return u(ve(e))})),e.abrupt("return");case 16:if("application/x-moz-file-promise-url"!==i[s].type){e.next=21;break}return i[s].getAsString(u),e.abrupt("return");case 21:"string"===i[s].kind&&function(){var e=i[s].type;i[s].getAsString((function(t){return console.log(e,t)}))}();case 22:s++,e.next=5;break;case 25:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),l=Object(u.a)(s,3),p=l[0],m=l[1],v=l[2];return p&&(t=c.client_to_grid([m.x,m.y])),a.a.createElement("div",Object.assign({},v,{style:{position:"absolute",left:0,right:0,top:0,bottom:0}}),p?a.a.createElement("div",{ref:n,key:"hover",style:{position:"absolute",left:Math.floor(t[0])+"em",top:Math.floor(t[1])+"em",width:"1em",height:"1em",background:"#aaa"}}):null,e.children)}n(47);var he=n(14),ge=Object(r.memo)(Object(r.forwardRef)((function(e,t){return a.a.createElement(he.b.div,Object.assign({},e,{ref:t,style:Object(h.a)({position:"absolute"},e.style),initial:!1,transition:{type:"tween",ease:"easeOut",duration:.2},animate:{left:e.loc[0]+"em",top:e.loc[1]+"em",width:e.dim[0]+"em",height:e.dim[1]+"em"}}),e.children)})));var ye=a.a.memo((function(e){return a.a.createElement("svg",{viewBox:"0 0 ".concat(e.width+.02," ").concat(e.height+.02),style:{position:"absolute",left:"".concat(-.01,"em"),top:"".concat(-.01,"em"),width:"".concat(e.width+.02,"em"),height:"".concat(e.height+.02,"em"),pointerEvents:"none",transition:"position 2s"}},a.a.createElement("defs",null,a.a.createElement("pattern",{id:"grid",width:"1",height:"1",patternUnits:"userSpaceOnUse",shapeRendering:"geometricPrecision"},a.a.createElement("path",{d:"M 1 0 L 0 0 0 1",fill:"none",stroke:"gray",strokeWidth:.04}))),a.a.createElement("rect",{style:{pointerEvents:"none"},x:0,y:0,width:e.width+.02,height:e.height+.02,fill:"url(#grid)"}))}));var Oe=Object(r.memo)((function(e){var t=e.onSelectionDrag,n=e.onSelectionDrop,o=Object(r.useRef)(null),c=Object(r.useCallback)((function(e){e.isPrimary&&1===e.buttons&&(o.current||(o.current=g(e),e.target.setPointerCapture(e.pointerId)),t(g(e)))}),[t]),i=Object(r.useCallback)((function(e){null!==o.current&&(e.preventDefault(),e.stopPropagation(),n(g(e)),o.current=null)}),[n]),u=Object(r.useRef)();return Object(r.useEffect)((function(){var e;null===(e=u.current)||void 0===e||e.addEventListener("touchmove",(function(e){return e.preventDefault()}),{passive:!1})}),[]),Object(r.useLayoutEffect)((function(){var e=u.current,t=function(e){return e.preventDefault()};return e.addEventListener("pointerdown",t,{capture:!0}),e.addEventListener("pointermove",c,{capture:!0}),e.addEventListener("pointerup",i,{capture:!0}),function(){e.removeEventListener("pointerdown",t,{capture:!0}),e.removeEventListener("pointermove",c,{capture:!0}),e.removeEventListener("pointerup",i,{capture:!0})}}),[c,i]),a.a.createElement(ge,{ref:u,loc:e.loc,dim:e.dim,style:{border:"1px solid blue",boxShadow:"0 0 4px blue",overflow:"visible"}},a.a.createElement("div",{className:"topLeft",style:{position:"absolute",left:"".concat(-5,"px"),top:"".concat(-5,"px"),width:"".concat(10,"px"),height:"".concat(10,"px"),background:"blue",cursor:"nwse-resize",border:"1px solid white",boxSizing:"border-box"}}),a.a.createElement("div",{className:"topRight",style:{position:"absolute",top:"".concat(-5,"px"),right:"".concat(-5,"px"),width:"".concat(10,"px"),height:"".concat(10,"px"),background:"blue",cursor:"nesw-resize",border:"1px solid white"}}),a.a.createElement("div",{className:"botLeft",style:{position:"absolute",bottom:"".concat(-5,"px"),left:"".concat(-5,"px"),width:"".concat(10,"px"),height:"".concat(10,"px"),background:"blue",cursor:"nesw-resize",border:"1px solid white"}}),a.a.createElement("div",{className:"botRight",style:{position:"absolute",bottom:"".concat(-5,"px"),right:"".concat(-5,"px"),width:"".concat(10,"px"),height:"".concat(10,"px"),background:"blue",cursor:"nwse-resize",border:"1px solid white"}}))})),Ee=n(32);function je(e,t,n){var r,a=null,o=Object(ae.a)(e);try{for(o.s();!(r=o.n()).done;){var c=r.value;if(c.identifier===t||c.identifier===n){if(null===a){a=[c.clientX,c.clientY];continue}var i=[c.clientX,c.clientY],u=O(a,i).map(Math.abs);return{dist:Math.abs(u[0]+u[1]),center:y(a,i).map((function(e){return e/2}))}}}}catch(s){o.e(s)}finally{o.f()}}function we(e){return e/96}var xe=Object(r.memo)(Object(r.forwardRef)((function(e,t){var n=Object(r.useRef)(null),o=Object(r.useRef)(null),c=Object(r.useRef)(null),i=Object(r.useRef)({x:0,y:0}),s=Object(r.useRef)(1),l=Object(r.useRef)({width:0,height:0}),d=Object(r.useRef)({width:0,height:0}),f=Object(r.useRef)([0,0]),p=function(){f.current=[Math.max(0,(l.current.width-d.current.width*s.current)/2),Math.max(0,(l.current.height-d.current.height*s.current)/2)],console.log("offset",f),o.current.style.transform="translate(".concat(f.current[0],"px, ").concat(f.current[1],"px)"),o.current.style.fontSize=s.current+"in",c.current.style.transform="scale(".concat(s.current,")")},m=Object(r.useCallback)((function(e,t){var r=Math.min(2,Math.max(.1,s.current+t));console.log(r);var a=r-s.current;s.current=r;var o=n.current.scrollLeft,c=n.current.scrollTop;p(),n.current.scrollTo(o+e[0]*a,c+e[1]*a)}),[]),v=Object(r.useCallback)((function(e){var t=Object(u.a)(e,2),r=t[0],a=t[1],o=r-i.current.x+n.current.scrollLeft,c=a-i.current.y+n.current.scrollTop;return[(o-f.current[0])/s.current,(c-f.current[1])/s.current]}),[f]);Object(r.useImperativeHandle)(t,(function(){return{clientToGrid:function(){return v.apply(void 0,arguments).map(we)}}}),[v]);var b=Object(r.useCallback)((function(e){if(e.ctrlKey){var t=v([e.clientX,e.clientY]),n=.06*Math.max(-1,Math.min(1,-e.deltaY));m(t,n)}}),[m,v]);Object(r.useEffect)((function(){var e=n.current,t=function(e){return e.ctrlKey&&e.preventDefault()};return e.addEventListener("wheel",t,{passive:!1}),e.addEventListener("wheel",b),function(){e.removeEventListener("wheel",t),e.removeEventListener("wheel",b)}}),[b]),Object(r.useLayoutEffect)((function(){var e=n.current,t=function(t){console.log("huh...."),t.ctrlKey?e.classList.add("control"):e.classList.remove("control")};return document.addEventListener("keydown",t),document.addEventListener("keyup",t),function(){document.removeEventListener("keydown",t),document.removeEventListener("keyup",t)}}));var h=Object(r.useRef)(0);return function(e,t){var n=Object(r.useRef)([0,0]),a=Object(r.useRef)(null),o=Object(r.useRef)(null),c=Object(r.useRef)(0);Object(r.useEffect)((function(){var r=function(e){if(1===e.touches.length&&(a.current=e.touches[0].identifier),2===e.touches.length&&null!==a.current&&null===o.current){var r=e.touches[0].identifier===a.current?e.touches[1]:e.touches[0];o.current=r.identifier;var i=je(e.touches,a.current,o.current),u=i.center,s=i.dist;n.current=u,c.current=s,t.onPinchStart({clientOrigin:n.current,scale:1,preventDefault:function(){e.preventDefault()}})}},i=function(e){if(null!==a.current&&null!==o.current){var r=je(e.touches,a.current,o.current).dist;t.onPinch({clientOrigin:n.current,scale:r/c.current,preventDefault:function(){e.preventDefault()}})}},u=function(e){var t,n=0,r=Object(ae.a)(e.touches);try{for(r.s();!(t=r.n()).done;){var c=t.value;c.identifier!==a.current&&c.identifier!==o.current||(n+=1)}}catch(i){r.e(i)}finally{r.f()}2!==n&&(a.current=o.current=null)},s={passive:!1},l=e.current;return null===l||void 0===l||l.addEventListener("touchstart",r,s),null===l||void 0===l||l.addEventListener("touchend",u,s),null===l||void 0===l||l.addEventListener("touchmove",i,s),function(){null===l||void 0===l||l.removeEventListener("touchstart",r),null===l||void 0===l||l.removeEventListener("touchend",u),null===l||void 0===l||l.removeEventListener("touchmove",i)}}))}(n,{onPinchStart:function(e){e.preventDefault(),h.current=e.scale},onPinch:function(e){e.preventDefault();var t=v(e.clientOrigin),n=1.25*(e.scale-h.current);h.current=e.scale,console.log(n),m(t,n)}}),Object(r.useEffect)((function(){var e=[0,0],t=n.current,r=function(n){n.ctrlKey&&(t.setPointerCapture(n.pointerId),n.preventDefault(),n.stopPropagation(),e=[n.clientX,n.clientY])},a=function(t){var r;t.ctrlKey&&1===t.buttons&&(t.preventDefault(),t.stopPropagation(),(r=n.current).scrollBy.apply(r,Object(Ee.a)(O(e,[t.clientX,t.clientY]))),e=[t.clientX,t.clientY])};return t.addEventListener("pointerdown",r,{passive:!1}),t.addEventListener("pointermove",a,{passive:!1}),function(){t.removeEventListener("pointerdown",r),t.removeEventListener("pointermove",a)}})),Object(r.useLayoutEffect)((function(){var e=n.current.getBoundingClientRect();i.current={x:e.x,y:e.y};var t=function(e,t){return new ResizeObserver((function(n){var r=n.pop().contentRect;e.current={width:r.width,height:r.height,x:r.x,y:r.y},console.log("RESIZE!"+t,e.current),p()}))},r=t(l,"viewport");r.observe(n.current);var a=t(d,"canvas");return a.observe(c.current),console.log("Canvas: ",c.current),function(){r.disconnect(),a.disconnect()}}),[]),a.a.createElement("div",{className:"viewport",ref:n,style:{overflow:"auto",position:"relative",touchAction:"pan-x pan-y"},onContextMenu:function(e){return e.preventDefault()}},a.a.createElement("div",{ref:o,style:{position:"absolute",transform:"translate(".concat(f.current[0],"px, ").concat(f.current[1],"px)"),fontSize:s.current+"in"}},a.a.createElement("div",{className:"gridsvg",ref:c,style:{position:"absolute",fontSize:"1in",transform:"scale(".concat(s,") translateZ(0)"),transformOrigin:"0 0",transition:"transform",overflow:"visible"}},e.children),e.overlay))}))),Se=Object(r.createContext)({client_to_grid:function(e){return[0,0]}});var ke=Object(r.memo)((function(e){var t=Object(r.useRef)(null),n=Object(i.b)(),o=Object(i.c)((function(e){return e.game.maps[0].images})),c=Object(r.useState)(null),s=Object(u.a)(c,2),l=s[0],d=s[1],f=Object(r.useState)([]),p=Object(u.a)(f,2),m=p[0],v=p[1],b=Object(r.useMemo)((function(){return m.length>0?o[m[0]].loc:[0,0]}),[o,m]),g=Object(r.useCallback)((function(n){var r,a,c;d(O((r=t.current.clientToGrid(n),a=[0,0],c=O(e.dimensions,o[m[0]].dim),[Math.max(a[0],Math.min(c[0],r[0])),Math.max(a[1],Math.min(c[1],r[1]))]),b).map(Math.floor))}),[b,e.dimensions,o,m]),E=Object(r.useCallback)((function(e){n(R({map:0,id:m[0],img:{loc:y(o[m[0]].loc,l)}})),d([0,0])}),[n,o,m,l]),j=Object(r.useCallback)((function(e){if(0!==m.length){var t={map:0,id:m[0]};switch(e.key){case"ArrowRight":n(L(Object(h.a)(Object(h.a)({},t),{},{offset:[1,0]}))),e.preventDefault();break;case"ArrowLeft":n(L(Object(h.a)(Object(h.a)({},t),{},{offset:[-1,0]}))),e.preventDefault();break;case"ArrowUp":n(L(Object(h.a)(Object(h.a)({},t),{},{offset:[0,-1]}))),e.preventDefault();break;case"ArrowDown":n(L(Object(h.a)(Object(h.a)({},t),{},{offset:[0,1]}))),e.preventDefault()}}}),[n,m]);return Object(r.useEffect)((function(){return document.addEventListener("keydown",j,{capture:!0}),function(){document.removeEventListener("keydown",j,{capture:!0})}}),[j]),a.a.createElement("div",{className:"grid"},a.a.createElement(xe,{ref:t,overlay:m.length>0&&a.a.createElement(Oe,{key:"",loc:y(l,b),dim:o[m[0]].dim,onSelectionDrag:g,onSelectionDrop:E})},a.a.createElement(Se.Provider,{value:{get client_to_grid(){return t.current.clientToGrid}}},a.a.createElement("div",{style:{width:e.dimensions[0]+"in",height:e.dimensions[1]+"in",position:"relative"}},a.a.createElement(be,null,Object.values(o).map((function(e,t){return a.a.createElement(ge,{id:e.id,key:e.id,loc:y(e.loc,m.includes(e.id)?l:[0,0]),dim:e.dim,tabIndex:t,onFocus:function(t){v([e.id]),d([0,0])},onBlur:function(e){v([])}},a.a.createElement("img",{onDragStart:function(e){return e.preventDefault()},alt:"",src:e.href,style:{display:"block",width:"100%",height:"100%",imageRendering:"crisp-edges"}}))})),a.a.createElement(ye,{width:e.dimensions[0],height:e.dimensions[1]}))))))}));n(48);function Re(){var e=Object(i.c)((function(e){var t;return"connected"===e.comms.status&&null===(null===(t=e.players.data[e.comms.clientId])||void 0===t?void 0:t.name)})),t=Object(i.c)((function(e){return e.comms.clientId})),n=Object(i.b)(),o=Object(r.useCallback)((function(e){e.preventDefault();var r=new FormData(e.nativeEvent.target).get("name");n(J({player:t,name:r}))}),[t,n]);return e?a.a.createElement("div",{id:"join"},a.a.createElement("form",{style:{display:"flex",flexDirection:"column",maxWidth:"480px",background:"red"},onSubmit:o},a.a.createElement("label",{htmlFor:"name"},"Display Name:",a.a.createElement("input",{name:"name",type:"text",defaultValue:""})),a.a.createElement("button",{type:"submit"},"Join"))):null}n(49);function De(e){var t=Object(i.c)((function(e){return e.toast.toasts})),n=Object(s.a)().t;return a.a.createElement("div",{className:"toastArea"},a.a.createElement(he.a,null,t.map((function(e){return a.a.createElement(he.b.div,{className:"toast",initial:{position:"relative",opacity:0},animate:{position:"relative",opacity:1},exit:{position:"relative",opacity:0},layout:!0,key:e.id},n(e.msg))}))))}n(55);function _e(){return a.a.createElement("div",{className:"spinner"},a.a.createElement("div",{className:"double-bounce1"}),a.a.createElement("div",{className:"double-bounce2"}))}var Ce=n(31);function Le(){var e=Object(i.c)((function(e){return e.players.online.map((function(t){return e.players.data[t]}))})),t=Object(r.useState)(!1),n=Object(u.a)(t,2),o=n[0],c=n[1],l=Object(i.b)(),d=Object(s.a)().t;return Object(r.useEffect)((function(){if(o){var e=function(){return c(!1)};return document.addEventListener("click",e),function(){document.removeEventListener("click",e)}}}),[o]),a.a.createElement("div",{style:{position:"relative"},onClick:o?function(e){e.stopPropagation()}:void 0},a.a.createElement("button",{onClick:function(){return c((function(e){return!e}))},style:{borderBottomLeftRadius:o?"0":void 0,borderBottomRightRadius:o?"0":void 0,borderBottom:o?"none":void 0}},a.a.createElement(Ce.a,{style:{verticalAlign:"baseline",fontSize:"1.25em"}}),"\xa0",e.length,"\xa0"),o&&a.a.createElement("div",{style:{position:"absolute",top:"100%",left:"0",background:"white",borderLeft:"1px solid gray",borderRight:"1px solid gray",borderBottom:"1px solid gray",borderTop:"1px solid gray",borderTopRightRadius:"5px",borderBottomRightRadius:"5px",borderBottomLeftRadius:"5px",borderTopLeftRadius:"0"}},e.map((function(e){return a.a.createElement("div",{style:{padding:"0.2em"}},e.name)})),a.a.createElement("button",{onClick:function(){navigator.clipboard.writeText(window.location.href),l(B(d("copied_to_clipboard")))}},"Copy Invite Link")))}n(56);var Pe=function(e){var t=Object(i.c)((function(e){return e.comms})),n=Object(i.b)();return a.a.createElement("div",{className:"toolbar"},"offline"===t.status&&a.a.createElement("button",{onClick:function(){return n(se())}},"Host"),"pending"===t.status&&a.a.createElement(_e,null),"connected"===t.status&&a.a.createElement(Le,null))};var Te=function(){var e=Object(i.c)((function(e){return console.log(e),e.comms})),t=Object(r.useState)((function(){return 0})),n=Object(u.a)(t,2),o=n[0],c=(n[1],Object(i.c)((function(e){return[e.game.maps[o].width,e.game.maps[o].height]}))),l=Object(i.b)(),d=Object(s.a)().t,f=Object(i.c)((function(e){return e.players.online.map((function(t){return e.players.data[t].name}))}));return a.a.createElement("div",{className:"App"},a.a.createElement(Re,null),a.a.createElement(De,null),a.a.createElement(ke,{dimensions:c}),a.a.createElement(Pe,null,a.a.createElement("button",{onClick:function(){return l(S({map:o,width:c[0]+1,height:c[1]}))}},"Add Column"),a.a.createElement("button",{onClick:function(){return l(S({map:o,width:c[0],height:c[1]+1}))}},"Add Row"),a.a.createElement("button",{onClick:function(){return l(D({}))}},"Reset"),a.a.createElement("button",{onClick:function(){return l(B(d("hello")))}},"Say hi"),"offline"===e.status&&a.a.createElement("button",{onClick:function(){return l(se())}},"Host"),"pending"===e.status&&a.a.createElement(_e,null),e.hosting&&"hosting: ".concat(e.gameId),f.map((function(e){return a.a.createElement("p",null,e||"unknown")}))))},Ie=n(23),Ne=n(30),Me=n(15);Ie.a.use(Ne.a).use(Me.e).init({debug:!0,lng:"en",fallbackLng:"en",whitelist:["en","de"],interpolation:{escapeValue:!1},backend:{loadPath:"/battlegrid/locales/{{lng}}/{{ns}}.json"}});Ie.a,n(57);var Ae=n(9),Je=Object(Ae.c)({comms:fe,game:w,toast:X,players:I}),Ye=Je(void 0,{type:"null"}),Be=Object(p.a)({reducer:function(e,t){return"STATE_SYNC"===t.type?function(e,t){return Object(h.a)(Object(h.a)({},e),{},{game:t.payload.game,players:t.payload.players})}(e,t):Je(e,t)},middleware:function(e){return e().prepend((function(e){return function(e){return function(t){var n,r;return console.log("connection?",ie.conn),ie.conn&&(null===(n=t.meta)||void 0===n?void 0:n.shared)&&(null===(r=t.meta)||void 0===r?void 0:r.src)===ie.conn.id&&ie.conn.send(t),e(t)}}}))},preloadedState:Ye});Be.subscribe((function(){var e=Be.getState();console.log(e),function(e,t){sessionStorage.setItem(e,JSON.stringify(t))}(e.game.id,e.game),b("players",e.players.data)}));var He=Be,Xe=new URLSearchParams(window.location.search).get("game"),ze=function(e){var t=sessionStorage.getItem(e);return t?JSON.parse(t):null}(null!==Xe&&void 0!==Xe?Xe:"local");Xe?(console.log("Found game: ",Xe),v("was_hosting")===Xe?(console.log("REHOSTING!"),ze&&He.dispatch(_(ze)),v("players"),He.dispatch(se())):(console.log("Huh"),He.dispatch(ue(Xe)))):ze&&He.dispatch(_(ze)),c.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(r.Suspense,{fallback:null},a.a.createElement(i.a,{store:He},a.a.createElement(Te,null)))),document.getElementById("root"))}},[[33,1,2]]]);
//# sourceMappingURL=main.14e8f65f.chunk.js.map