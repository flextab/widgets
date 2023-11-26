"use strict";var T=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var F=Object.prototype.hasOwnProperty;var z=(w,t)=>{for(var n in t)T(w,n,{get:t[n],enumerable:!0})},I=(w,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let e of L(t))!F.call(w,e)&&e!==n&&T(w,e,{get:()=>t[e],enumerable:!(a=_(t,e))||a.enumerable});return w};var H=w=>I(T({},"__esModule",{value:!0}),w);var R={};z(R,{Chart:()=>D,MiniChart:()=>M});module.exports=H(R);var S=class{constructor(){this._svgContent="",this.fontFamily="",this.yData=[null,null],this.intervalPanelColor="#416df9",this.intervalPanelHeight=0,this.isOpenIntervalPanel=!1,this.intervalPanelParams=[{type:"startBtn",c:[0,0],w:16,h:16},{type:"endBtn",c:[0,0],w:16,h:16},{type:"closeBtn",c:[0,0],w:16,h:16},{type:"dragPanel",c:[0,0],w:0,h:0}],this.thumbnailPanelHeight=0,this.thumbnailPanelColor="#416df9",this.thumbnailPanelType="minute",this.thumbnailPanelMinWidth=0,this.isOpenThumbnailPanel=!1,this.thumbnailPanelParams=[{type:"startBtn",c:[0,0],w:16,h:16},{type:"endBtn",c:[0,0],w:16,h:16},{type:"dragPanel",c:[0,0],w:0,h:0}]}initOptionsBase(t){var n=t.width,a=t.height,e=t.top,l=t.left,o=t.xOffset,s=t.yOffset,i=t.data,c=t.yAxisH,r=t.intervalPanelHeight,h=t.thumbnailPanelHeight;this.width=n,this.height=a,this.yAxisH=c||a,this.intervalPanelHeight=r||a,this.thumbnailPanelHeight=h||36,this.thumbnailPanelMinWidth=n/5,this.top=e||0,this.left=l||0,this.xOffset=o||[0,0],this.yOffset=s||[0,0],this.xAxis=i.xAxis,this.yAxis=i.yAxis,this.guide=i.guide,this.contents=i.contents,this.yData=i.yData}getSvgStr(t){t===void 0&&(t="");var n=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
            width="`.concat(this.width,`px"
            height="`).concat(this.height,`px"
        >`).concat(t||this._svgContent,"</svg>");return n}getSvgData(){var t=btoa(unescape(encodeURIComponent(this.getSvgStr())));return"data:image/svg+xml;base64,".concat(t)}getFeedBackSvgImg(t){var n=t.isImg,a=n===void 0?!0:n,e=t.x,l=t.y,o=t.type,s=o===void 0?"xy":o,i=t.color,c=i===void 0?"#B8B8B8":i,r=t.yOffset,h=r===void 0?[0,0]:r,d=t.xOffset,f=d===void 0?[0,0]:d,u=t.tipCircles,y=u===void 0?[]:u,v="",g=h[0],b=h[1];l=l>this.height-g-b?this.height-g-b:l;var p=`<line
            x1="`.concat(0+f[0],`"
            y1="`).concat(l,`"
            x2="`).concat(this.width-f[1],`"
            y2="`).concat(l,`"
            stroke-dasharray="4 2"
            style="stroke: `).concat(c,`; stroke-width: 1"
        ></line>`),k=`<line
            x1="`.concat(e,`"
            y1="`).concat(0+g,`"
            x2="`).concat(e,`"
            y2="`).concat(this.height-b,`"
            stroke-dasharray="4 2"
            style="stroke: `).concat(c,`; stroke-width: 1"
        ></line>`);switch(s){case"x":v=p;break;case"y":v=k;break;case"xy":v=p+k;break}y.forEach(function(C){v+='<circle cx="'.concat(C.x,'" cy="').concat(C.y,'" r="').concat(C.r,'" style="fill: ').concat(C.color,';"/>')});var x=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
            width="`.concat(this.width,`px"
            height="`).concat(this.height,`px"
        >`).concat(v,"</svg>");if(a){var m=btoa(unescape(encodeURIComponent(x)));return"data:image/svg+xml;base64,".concat(m)}return x}getIntervalPanel(t){var n=t===void 0?{}:t,a=n.startX,e=a===void 0?this.width-150:a,l=n.endX,o=l===void 0?this.width:l,s=n.height,i=s===void 0?this.intervalPanelHeight:s,c=3,r=16,h=2;e=e<=0?0:e,o=o>=this.width?this.width:o;var d=`
            <rect x="`.concat(e,'" y="0" width="').concat(o-e,'" height="').concat(i,'" style="fill: ').concat(this.intervalPanelColor,`; opacity: 0.15; cursor: move;"/>
            <rect x="`).concat(e+h,'" y="').concat(h,'" width="').concat(r,'" height="').concat(r,'" rx="').concat(c,'" style="fill: ').concat(this.intervalPanelColor,`; opacity: 0.5;"/>
            <line x1="`).concat(e+h+c,'" y1="').concat(h+c,'" x2="').concat(e+h+r-c,'" y2="').concat(h+r-c,`" style="stroke: #fff; stroke-width: 1px;"/>
            <line x1="`).concat(e+h+c,'" y1="').concat(h+r-c,'" x2="').concat(e+h+r-c,'" y2="').concat(h+c,`" style="stroke: #fff; stroke-width: 1px;"/>
            <line x1="`).concat(e,'" y1="0" x2="').concat(e,'" y2="').concat(i,'" style="stroke: ').concat(this.intervalPanelColor,`; stroke-width: 1px;" stroke-dasharray="2 2"/>
            <line x1="`).concat(o,'" y1="0" x2="').concat(o,'" y2="').concat(i,'" style="stroke: ').concat(this.intervalPanelColor,`; stroke-width: 1px;" stroke-dasharray="2 2"/>
        `),f=e<=r/2?r/2:e,u=o>=this.width-r/2?this.width-r/2:o;d+=`
            <circle cx="`.concat(f,'" cy="').concat(i/2,'" r="8" style="fill: ').concat(this.intervalPanelColor,`; opacity: 0.5; cursor: col-resize;"/>
            <circle cx="`).concat(f,'" cy="').concat(i/2,'" r="4" style="fill: ').concat(this.intervalPanelColor,`; cursor: col-resize;"/>
            <circle cx="`).concat(u,'" cy="').concat(i/2,'" r="8" style="fill: ').concat(this.intervalPanelColor,`; opacity: 0.5; cursor: col-resize;"/>
            <circle cx="`).concat(u,'" cy="').concat(i/2,'" r="4" style="fill: ').concat(this.intervalPanelColor,`; cursor: col-resize;"/>
        `),this.intervalPanelParams=[{type:"startBtn",c:[e,i/2],w:20,h:20},{type:"endBtn",c:[o,i/2],w:30,h:30},{type:"closeBtn",c:[e+h+r/2,h+r/2],w:30,h:30},{type:"dragPanel",c:[e+(o-e)/2,i/2],w:o-e,h:i}];var y=btoa(unescape(encodeURIComponent(this.getSvgStr(d))));return"data:image/svg+xml;base64,".concat(y)}getThumbnailPanel(t){var n=t===void 0?{}:t,a=n.startX,e=a===void 0?this.width*.8:a,l=n.endX,o=l===void 0?this.width:l,s=n.height,i=s===void 0?this.thumbnailPanelHeight:s,c=6;e=e<=0?0:e,o=o>=this.width?this.width:o;var r=`
            <rect x="`.concat(e,'" y="0" width="').concat(o-e,'" height="').concat(i,'" style="fill: ').concat(this.thumbnailPanelColor,'; opacity: 0.15; cursor: move;"/>'),h=e-c/2<0?e:e-c/2,d=+o+c/2>this.width?this.width-c:o-c/2;r+=`
            <polygon points="`.concat(h,",0 ").concat(h+6,",0 ").concat(h+4.5,",4 ").concat(h+4.5,",").concat(i-4," ").concat(h+6,",").concat(i," ").concat(h,",").concat(i," ").concat(h+1.5,",").concat(i-4," ").concat(h+1.5,`,4"
                style="fill: `).concat(this.thumbnailPanelColor,`; cursor: col-resize;"/>
            <polygon points="`).concat(d,",0 ").concat(d+6,",0 ").concat(d+4.5,",4 ").concat(d+4.5,",").concat(i-4," ").concat(d+6,",").concat(i," ").concat(d,",").concat(i," ").concat(d+1.5,",").concat(i-4," ").concat(d+1.5,`,4"
                style="fill: `).concat(this.thumbnailPanelColor,`; cursor: col-resize;"/>
        `),this.thumbnailPanelParams=[{type:"startBtn",c:[e,i/2],w:10,h:i},{type:"endBtn",c:[o,i/2],w:10,h:i},{type:"dragPanel",c:[e+(o-e)/2,i/2],w:o-e,h:i}];var f=btoa(unescape(encodeURIComponent(this.getSvgStr(r))));return"data:image/svg+xml;base64,".concat(f)}clear(){this._svgContent=""}},E=class extends S{constructor(t){super();var n=t.feedbackCallback,a=n===void 0?function(){}:n,e=t.intervalStatisticsCallback,l=e===void 0?function(){}:e,o=t.thumbnailStatisticsCallback,s=o===void 0?function(){}:o,i=t.needLongPress,c=t.needDrag,r=t.needWhell,h=t.needClick,d=t.needEnd,f=d===void 0?!0:d,u=t.toFixed,y=u===void 0?2:u,v=this;return v.isWeb=!1,v.dir="",v.dragPrevX=0,v.dragPrevY=0,v.xWhellCenter=-1,v.whellRatio=0,v.prevWhellRatio=0,v.intervalPanelControlObj=null,v.thumbnailPanelControlObj=null,v.needFeedBack=!1,v.longTouch=!1,v.touchEvent={},v.eventType="",v.longTouchTimes=0,v.toFixed=2,v.pageSize=0,v.intervalPanelTimer=null,v.thumbnailPanelTimer=null,v.feedbackCallback=a,v.intervalStatisticsCallback=l,v.thumbnailStatisticsCallback=s,v.needLongPress=i,v.needDrag=c,v.needWhell=r,v.needClick=h,v.needEnd=f,v.toFixed=y,v}feedback(t,n,a,e){var l=this;if(!(!this.feedbackCallback||typeof this.feedbackCallback!="function"||!this.xOffset)){var o=this.xOffset,s=o[0],i=o[1],c=this.yOffset,r=c[0],h=c[1],d=this.width-s-i,f=this.yAxisH-r-h,u=d/a,y=[null,null];try{y=this.yData.map(function(p){if(p){if(n>f)return null;var k=n-r<0?0:n-r,x=(p.max-p.min)/f*(f-k)+p.min;return{yText:isNaN(+x)?"":(+x).toFixed(l.toFixed)}}return p})}catch{console.error("\u5DE6\u53F3\u523B\u5EA6\u8F74\u6D6E\u5C42\u6570\u636E\u5904\u7406\u5F02\u5E38")}var v=Math.ceil((t-s)/u)-1,g=s+v*u+u/2,b=this.getMaskStyle(this.eventType==="longpress"||this.eventType==="move"?t:g);this.feedbackCallback({x:t,y:n,eventType:this.eventType,width:this.width,height:this.height,index:v<0?0:v>a-1?a-1:v,show:e,positionX:g,yAxisList:y,position:{left:b.left,right:b.right}})}}getMaskStyle(t){return t<this.width/2?{left:"".concat(t+16,"px")}:{right:"".concat(this.width-t+16,"px")}}touchIsScope(t,n){return!(t<0||t>this.width||n<0||n>this.height-this.yOffset[1])}getIntervalPanelControlObj(t,n){var a=this.intervalPanelParams.filter(function(e){var l=e.w,o=e.h,s=e.c,i=s[0],c=s[1];return Math.abs(t-i)<=l/2&&Math.abs(n-c)<=o/2});return a.length?__assign({},a[0]):null}getThumbnailPanelControlObj(t,n){var a=this.thumbnailPanelParams.filter(function(e){var l=e.w,o=e.h,s=e.c,i=s[0],c=s[1];return Math.abs(t-i)<=l/2&&Math.abs(n-c)<=o/2});return a.length?__assign({},a[0]):null}statistics(t,n){var a=this;if(this.eventType="statistics",this.intervalPanelControlObj){var e=this.intervalPanelControlObj.type,l=this.intervalPanelParams,o=l[0],s=l[1],i=0,c=0;switch(e){case"startBtn":i=t,c=s?.c[0],i=i>=c-o.w?c-o.w:i;break;case"endBtn":i=o?.c[0],c=t,c=c<=i+o.w?i+o.w:c;break;case"dragPanel":var r=this.checkHorizontalDir(t,n).xDiff;i=o?.c[0]+r,c=s?.c[0]+r;break;default:i=o?.c[0],c=s?.c[0];break}if(i<=0||c>=this.width){if(e==="dragPanel")return;var h=this.getIntervalPanel({startX:i,endX:c});this.intervalPanelData={svgData:h,startX:i,endX:c,type:e},this.intervalStatisticsCallback(this.intervalPanelData),this.clearTimer();return}var d=this.getIntervalPanel({startX:i,endX:c});this.intervalPanelData={svgData:d,startX:i,endX:c,type:e},!this.intervalPanelTimer&&(this.intervalPanelTimer=setInterval(function(){a.intervalStatisticsCallback(a.intervalPanelData)},80))}}thumbnailStatistics(t,n){var a=this;if(this.eventType="thumbnail",this.thumbnailPanelControlObj){var e=this.thumbnailPanelControlObj.type,l=this.thumbnailPanelParams,o=l[0],s=l[1],i=0,c=0,r=this.thumbnailPanelType==="minute"?this.thumbnailPanelMinWidth:o.w;switch(e){case"startBtn":i=t,c=s?.c[0],i=i>=c-r?c-r:i;break;case"endBtn":i=o?.c[0],c=t,c=c<=i+r?i+r:c;break;case"dragPanel":var h=this.checkHorizontalDir(t,n).xDiff;i=o?.c[0]+h,c=s?.c[0]+h;break;default:i=o?.c[0],c=s?.c[0];break}if(i<=0||c>=this.width){if(e==="dragPanel")return;var d=this.getThumbnailPanel({startX:i,endX:c});this.thumbnailPanelData={svgData:d,startX:i,endX:c,type:e},this.thumbnailStatisticsCallback(this.thumbnailPanelData),this.clearTimer();return}var f=this.getThumbnailPanel({startX:i,endX:c});this.thumbnailPanelData={svgData:f,startX:i,endX:c,type:e},!this.thumbnailPanelTimer&&(this.thumbnailPanelTimer=setInterval(function(){a.thumbnailStatisticsCallback(a.thumbnailPanelData)},80))}}thumbnailPanelMinuteDrag(t,n){if(this.eventType="thumbnail",this.thumbnailPanelControlObj&&this.thumbnailPanelType==="minute"){var a=this.thumbnailPanelControlObj.type,e=this.thumbnailPanelParams,l=e[0],o=e[1],s=this.thumbnailPanelMinWidth,i=0,c=0;switch(a){case"startBtn":i=t,c=o?.c[0],i=Math.round(i/s)*s,i=i>=c-s?c-s:i;break;case"endBtn":i=l?.c[0],c=t,c=Math.round(c/s)*s,c=c<=i+s?i+s:c;break;case"dragPanel":i=Math.round(l?.c[0]/s)*s,c=Math.round(o?.c[0]/s)*s;break;default:i=l?.c[0],c=o?.c[0];break}var r=this.getThumbnailPanel({startX:i,endX:c});this.thumbnailPanelData={svgData:r,startX:Math.floor(i/s),endX:Math.floor(c/s),type:"thumbnailMinute"},this.thumbnailStatisticsCallback(this.thumbnailPanelData),this.clearTimer();return}}checkHorizontalDir(t,n){var a="",e=t-this.dragPrevX;return e>0?a="right":e<0&&(a="left"),this.dragPrevX=t,{x:t,y:n,horizontalDir:a,xDiff:e}}openThumbnailPanel(t,n,a,e,l){!this.width&&l&&(this.width=l.width,this.height=l.height),this.isOpenThumbnailPanel=!0,this.thumbnailPanelType=(t==="five"?"minute":t)||"minute";var o=t==="five"?{startX:0,endX:this.width}:void 0;if(t==="five"&&n&&n.length){var s=n[0],i=n[1],c=this.width*.2,r=c*s,h=c*i;o={startX:r,endX:h}}if(t==="kline"&&n&&n.length){var r=Math.ceil(n[0]/a*this.width),h=Math.ceil(n[1]/a*this.width);h=h>=this.width?this.width:h,r=h-r<=10?h-10:r,o={startX:r,endX:h}}var d=this.getThumbnailPanel(o),f=this.thumbnailPanelParams,u=f[0],y=f[1];this.thumbnailStatisticsCallback({startX:u?.c[0],endX:y?.c[0],type:e?"isChartChange":"startBtn",svgData:d})}openIntervalPanel(t){if(this.isOpenIntervalPanel=t,t){var n=this.getIntervalPanel(),a=this.intervalPanelParams,e=a[0],l=a[1];this.intervalStatisticsCallback({startX:e?.c[0],endX:l?.c[0],type:"startBtn",svgData:n})}else this.clearTimer(),this.intervalStatisticsCallback({type:"closeBtn"})}clearTimer(){this.intervalPanelTimer&&(clearInterval(this.intervalPanelTimer),this.intervalPanelTimer=null),this.thumbnailPanelTimer&&(clearInterval(this.thumbnailPanelTimer),this.thumbnailPanelTimer=null)}},B=class extends E{constructor(t){super(t)}draw(){this.width&&this.height&&(this._svgContent="",this.drawGuideLine(),this.drawXAxis(),this.drawContent(),this.drawYAxis())}drawGuideLine(){this.guide&&this.guide.length&&(this._svgContent+=this.guide.map(function(t){var n=t.start,a=t.end,e=t.color,l=e===void 0?"#dedfe0":e,o=t.width,s=t.dotted;return`<line
                    x1="`.concat(n.x,`"
                    y1="`).concat(n.y,`"
                    x2="`).concat(a.x,`"
                    y2="`).concat(a.y,`"
                    stroke-dasharray="`).concat(s?"2 2":"",`"
                    style="stroke: `).concat(l,"; stroke-width: ").concat(o,`px;"
                ></line>`)}))}drawXAxis(){var t=this;this.xAxis&&this.xAxis.length&&(this._svgContent+=this.xAxis.map(function(n){var a=n.point,e=n.text,l=n.size,o=l===void 0?14:l,s=n.color,i=n.weight,c=i===void 0?400:i,r=n.textAnchor,h=r===void 0?"middle":r;return`<text
                    x="`.concat(a.x,`"
                    y="`).concat(a.y,`"
                    fill="`).concat(s,`"
                    text-anchor="`).concat(h,`"
                    style="font-size: `).concat(o,"px; font-weight: ").concat(c,"; font-family: ").concat(t.fontFamily,`;"
                >`).concat(e,"</text>")}))}drawYAxis(){var t=this;this.yAxis&&this.yAxis.length&&this.yAxis.forEach(function(n){n&&n.length&&(t._svgContent+=n.map(function(a){var e=a.point,l=a.text,o=a.dominantBaseline,s=a.textAnchor,i=a.color,c=a.size,r=a.weight,h=r===void 0?400:r;return`<text
                            x="`.concat(e.x,`"
                            y="`).concat(e.y,`"
                            fill="`).concat(i,`"
                            dominant-baseline="`).concat(o,`"
                            text-anchor="`).concat(s,`"
                            style="font-size: `).concat(c,"px; font-weight: ").concat(h,"; font-family: ").concat(t.fontFamily,`;"
                        >`).concat(l,"</text>")}))})}drawContent(){var t=this;this.contents&&this.contents.length&&this.contents.forEach(function(n){if(n)switch(n.type){case"pointLine":t.drawPointLine(n.data,n.color,n.dotted);break;case"line":t.drawBrokenLine(n.data,__assign({},n));break;case"barGraph":t.drawBarGraphGroup(n.data);break;case"text":t.drawTexts(n.data);break;case"candle":t.drawCandle(n.data);break;case"tip":t.drawTip(n.data);break;case"mask":t.drawMask(n.data);break;case"roundPoint":t.drawRoundPointGroup(n.data);break;default:console.error("\u6CA1\u6709\u5339\u914D\u5230\u4EFB\u4F55\u56FE\u5F62");break}})}drawPointLine(t,n,a){var e=this;a===void 0&&(a=!1);var l="",o=a?1:0,s=a?1:0;t.forEach(function(i){i&&(l+="".concat(i.x,",").concat(i.y," "),e._svgContent+=`
                    <circle
                        cx="`.concat(i.x,`"
                        cy="`).concat(i.y,`"
                        r="3"
                        style="fill: `).concat(n,`;"
                    ></circle>
                `))}),this._svgContent+=`
            <polyline
                points="`.concat(l,`"
                style="fill: none; stroke: `).concat(n,`;"
                stroke-dasharray="`).concat(o," ").concat(s,`"
            ></polyline>
        `)}drawBrokenLine(t,n){var a=n.isFill,e=n.color,l=n.fillStartColor,o=l===void 0?"none":l,s=n.fillEndColor,i=s===void 0?"none":s,c=n.fillId,r=c===void 0?"":c,h=n.isEndPoint,d=h===void 0?!0:h,f=n.dotted,u=f===void 0?!1:f,y=n.yEndPoint,v=y===void 0?this.height:y,g="";if(t=t.filter(function(P){return!!P}),a){var b=t[0],p=t[t.length-1],k={x:p.x,y:v,lineColor:"none"},x={x:b.x,y:v,lineColor:"none"},m=t.slice(0,t.length);m.push(p,k,x,b);var C=m.map(function(P){return"".concat(P.x,",").concat(P.y)}).join(" ");g=`<defs>
                <linearGradient id="`.concat(r,`" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="`).concat(o,`"/>
                    <stop offset="100%" stop-color="`).concat(i,`" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polyline
                points="`).concat(C,`"
                style="fill:url(#`).concat(r,`);stroke: none;"
                stroke-dasharray="`).concat(u?"4 2":"",`"
            ></polyline>
            `).concat(d?'<circle cx="'.concat(p.x,'" cy="').concat(p.y,'" r="3" fill="').concat(e,'"/>'):"")}var A=t.map(function(P){return"".concat(P.x,",").concat(P.y)}).join(" ");this._svgContent+=`
        `.concat(g,`
        <polyline
            points="`).concat(A,`"
            style="fill: none;stroke: `).concat(e,`;"
            stroke-dasharray="`).concat(u?"4 2":"",`"
        ></polyline>`)}drawBarGraphGroup(t){var n=this,a=t.reduce(function(e,l){if(l){var o=l.x,s=l.y,i=l.width,c=l.r,r=c===void 0?0:c,h=l.color,d=s.end-s.start>0;e+=r!==0?n.drawRadiusRect(o,s,i,r,d,{color:h}):n.drawRect(o,s,i,{color:h})}return e},"");this._svgContent+=a}drawRadiusRect(t,n,a,e,l,o){l===void 0&&(l=!1);var s=o.color,i=o.stroke,c="fill:".concat(s,";");i&&(c+="stroke:".concat(i,";")),e=Math.abs(n.start-n.end)>e?e:Math.abs(n.start-n.end);var r='<path d="M '.concat(t,"  ").concat(n.start,`
                    L `).concat(t,"   ").concat(n.end+e,`
                    A `).concat(e," ").concat(e," 0 0 1 ").concat(t+e," ").concat(n.end,`
                    L `).concat(t+a-e," ").concat(n.end,`
                    A `).concat(e," ").concat(e," 0 0 1 ").concat(t+a," ").concat(n.end+e,`
                    L  `).concat(t+a,"  ").concat(n.start,`
                    H `).concat(t,` Z"
                    style="`).concat(c,'"/>');return l&&(r='<path d="M '.concat(t," ").concat(n.start,`
                L `).concat(t," ").concat(n.end-e,`
                A `).concat(e," ").concat(e," 0 0 0 ").concat(t+e," ").concat(n.end,`
                L `).concat(t+a-e," ").concat(n.end,`
                A `).concat(e," ").concat(e," 0 0 0 ").concat(t+a," ").concat(n.end-e,`
                L  `).concat(t+a," ").concat(n.start,`
                H `).concat(t,` Z"
                style="`).concat(c,'"/>')),r}drawRect(t,n,a,e){return`<line
            x1="`.concat(t,`"
            y1="`).concat(n.start,`"
            x2="`).concat(t,`"
            y2="`).concat(n.end,`"
            style="stroke: `).concat(e.color,"; stroke-width: ").concat(a,`px;"
        ></line>`)}drawTexts(t){var n=this,a="";t.forEach(function(e){a+=e?n.drawText(e):""}),this._svgContent+=a}drawText(t){var n=t.color,a=t.value,e=a===void 0?"":a,l=t.size,o=l===void 0?12:l,s=t.weight,i=s===void 0?400:s,c=t.point,r=t.dominantBaseline,h=r===void 0?"":r,d=t.textAnchor,f=d===void 0?"middle":d,u=t.writingMode,y=u===void 0?"":u,v=t.letterSpacing,g=v===void 0?0:v;return`<text
            x="`.concat(c.x,`"
            y="`).concat(c.y,`"
            fill="`).concat(n,`"
            text-anchor="`).concat(f,`"
            writing-mode="`).concat(y,`"
            letter-spacing="`).concat(g,`"
            dominant-baseline="`).concat(h,`"
            style="font-size: `).concat(o,"px; font-weight: ").concat(i,"; font-family: ").concat(this.fontFamily,`;"
        >`).concat(e,"</text>")}drawCandle(t){var n=this,a=t.reduce(function(e,l){if(l){var o=l.candleWidth,s=l.lineWidth,i=l.x,c=l.lineY,r=l.candleY,h=l.color;e+=n.drawRect(i,r,o,{color:h}),e+=`<line
                    x1="`.concat(i,`"
                    y1="`).concat(c.start,`"
                    x2="`).concat(i,`"
                    y2="`).concat(c.end,`"
                    style="stroke: `).concat(h,"; stroke-width: ").concat(s,`px;"
                ></line>`)}return e},"");this._svgContent+=a}drawTip(t){var n=t.dir,a=t.x,e=t.y,l=t.value,o=t.len,s=t.color,i=n==="l"?a-o:a+o,c=`
            <line
                x1="`.concat(a,`"
                y1="`).concat(e,`"
                x2="`).concat(i,`"
                y2="`).concat(e,`"
                style="stroke: `).concat(s,`; stroke-width: 1px;"
            ></line>
            <circle cx="`).concat(i,'" cy="').concat(e,'" r="1.5" style="fill: ').concat(s,`;"/>
            `).concat(this.drawText({color:s,value:l,point:{y:e,x:n==="l"?i-2:i+2},dominantBaseline:"middle",textAnchor:n==="l"?"end":"start"}),`
        `);this._svgContent+=c}drawMask(t){var n=t.x,a=t.y,e=t.width,l=t.height,o=t.bgColor;this._svgContent+=`
            <rect
                x="`.concat(n,`"
                y="`).concat(a,`"
                width="`).concat(e,`"
                height="`).concat(l,`"
                style="fill: `).concat(o,`;"
            ></rect>
        `)}drawRoundPointGroup(t){var n=this;this._svgContent+=t.reduce(function(a,e){return e&&(a+=n.drawRoundPoint(e)),a},"")}drawRoundPoint(t){var n=t.x,a=t.y,e=t.r,l=t.bgColor;return'<circle cx="'.concat(n,'" cy="').concat(a,'" r="').concat(e,'" style="fill: ').concat(l,';"/>')}},D=class extends B{constructor(t){super(t);var n=this;return n.userOperationType="leave",n.dragPrevX=0,n.system="pc",n}setOptions(t){this.initOptionsBase(t)}feedbackEvent(t,n){this.touchEvent=t,t.type==="click"?this.clickFeedbackEvent(n):this.otherEvent(n)}clickFeedbackEvent(t){var n=this.touchEvent,a=n.offsetX,e=n.offsetY;this.feedback(a,e,t,!0)}otherEvent(t){var n,a=this.touchEvent;switch(a.type){case"mouseenter":this.needFeedBack=!1,this.feedbackCallback({show:!1,position:{},eventType:this.userOperationType}),this.userOperationType="move";break;case"mouseup":if(this.clearTimer(),this.needFeedBack=!1,this.feedbackCallback({show:!1,position:{},eventType:this.userOperationType}),this.userOperationType="move",this.thumbnailPanelControlObj){var e=this.touchEvent,l=e.offsetX,o=e.offsetY;this.thumbnailPanelMinuteDrag(l,o)}break;case"mousedown":this.userOperationType="drag",this.needFeedBack=!1,this.feedbackCallback({show:!1,position:{}});var s=this.touchEvent.offsetX;if(this.dragPrevX=s,this.isOpenIntervalPanel){var i=this.touchEvent,c=i.offsetX,o=i.offsetY;this.intervalPanelControlObj=this.getIntervalPanelControlObj(c,o),((n=this.intervalPanelControlObj)===null||n===void 0?void 0:n.type)==="closeBtn"&&(this.openIntervalPanel(!1),this.intervalPanelControlObj=null)}if(this.isOpenThumbnailPanel){var r=this.touchEvent,h=r.offsetX,o=r.offsetY;this.thumbnailPanelControlObj=this.getThumbnailPanelControlObj(h,o)}break;case"mousewheel":this.userOperationType="whell",this.whell();break;case"mousemove":if(this.userOperationType==="whell"){this.feedbackCallback({show:!1,position:{},eventType:this.userOperationType}),this.userOperationType="move";return}this.entry(t);break;case"mouseleave":if(this.thumbnailPanelControlObj){var d=this.touchEvent,f=d.offsetX,o=d.offsetY;this.thumbnailPanelMinuteDrag(f,o)}default:this.clearTimer(),this.userOperationType="leave",this.needFeedBack=!1,this.feedbackCallback({show:!1,position:{},eventType:this.userOperationType});break}}entry(t){switch(this.userOperationType){case"move":this.move(t);break;case"drag":if(this.intervalPanelControlObj){var n=this.touchEvent,a=n.offsetX,e=n.offsetY;this.statistics(a,e)}else if(this.thumbnailPanelControlObj){var l=this.touchEvent,a=l.offsetX,e=l.offsetY;this.thumbnailStatistics(a,e)}else this.drag();break;case"whell":this.whell();case"leave":if(this.thumbnailPanelControlObj){var o=this.touchEvent,a=o.offsetX,e=o.offsetY;this.thumbnailStatistics(a,e)}break}}move(t){this.eventType="move";var n=this.touchEvent,a=n.offsetX,e=n.offsetY,l=this,o=l.width,s=l.height;a=a<0?0:a>o?o:a,e=e<0?0:e>s?s:e,this.feedback(a,e,t,!0)}drag(){this.eventType="drag";var t=this.touchEvent,n=t.offsetX,a=t.offsetY,e=n-this.dragPrevX;this.dragPrevX=n;var l="";e>0?l="right":e<0&&(l="left"),e!==0&&this.feedbackCallback({eventType:this.eventType,show:this.touchIsScope(n,a),x:n,y:a,horizontalDir:l,xDiff:e})}whell(){this.touchEvent.stopPropagation(),this.touchEvent.preventDefault(),this.eventType="whell";var t=this.touchEvent.offsetX;this.xWhellCenter===-1&&(this.xWhellCenter=t),this.feedbackCallback({xDiff:1,xWhellCenter:this.xWhellCenter,eventType:this.eventType,blowUp:this.touchEvent.wheelDelta>0,show:!0})}},M=class w{static CHART_SIZE_MAP={ab:242,hk:330,us:390,global:50};static COLORS={same:{lineColor:"#858585",fillStartColor:"#ECECEC",fillEndColor:"rgba(255, 255, 255, 0)"},down:{lineColor:"#0AAB62",fillStartColor:"#D9F4E7",fillEndColor:"rgba(255, 255, 255, 0)"},up:{lineColor:"#F33",fillStartColor:"#FFE3E3",fillEndColor:"rgba(255, 255, 255, 0)"}};getBaseLine(){return`<line
        x1="0"
        y1="50%"
        x2="100%"
        y2="50%"
        stroke-dasharray="2 2"
        style="stroke: #E0E0E0; stroke-width: 1;"
    ></line>`}getBrokenLinePoint(t,n,a,e){let l=n.split(","),o=Math.max.apply(Math,l),s=Math.min.apply(Math,l),i=Math.abs(o-a)>Math.abs(s-a)?Math.abs(o-a):Math.abs(s-a);i=i||a;let c=i*2,r=t.h/c,h=t.w/e;return l.map((d,f)=>{let u=d-a>0?i-(d-a):Math.abs(d-a)+i;return{data:d,x:f*h,y:u*r}})}drawBrokenLine(t,n){let{list:a,lineColor:e,isFill:l=!0,fillStartColor:o="none",fillEndColor:s="none"}=t,i="",c=`${Date.now()}_${Math.random()}`;if(l){let h=a[0],d=a[a.length-1],f={x:d.x,y:n.h,lineColor:"none"},u={x:0,y:n.h,lineColor:"none"},y=JSON.parse(JSON.stringify(a));y.push(d,f,u,h);let v=y.map(g=>`${g.x},${g.y}`).join(" ");i=`<defs>
            <linearGradient id="${c}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${o}"/>
                <stop offset="100%" stop-color="${s}"/>
            </linearGradient>
        </defs>
        <polyline
            points="${v}"
            style="fill:url(#${c});stroke: none;"
        ></polyline>`}let r=a.map(h=>`${h.x},${h.y}`).join(" ");return`${i}
    <polyline
        points="${r}"
        style="fill: none; stroke: ${e}; stroke-width:1"
    ></polyline>`}getSvgStr(t,n,a){let{market:e,status:l}=a,o=this.getBaseLine(),s=this.getBrokenLinePoint(a,t,n,t.split(",").length<200?300:t.split(",").length),i=this.drawBrokenLine({list:s,...w.COLORS[l]},a);return`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 ${a.w} ${a.h}"
        >
            ${o}
            ${i}
        </svg>`}};0&&(module.exports={Chart,MiniChart});
