import{$ as OI,$n as si,$t as bI,A as ID,D as HP,Dn as kI,Fn as mI,Ft as Xv,Gn as pI,In as mc,It as Y,P as Ip,Q as Np,Rt as YI,Ut as Zl,X as Ne,Yt as aD,_n as hD,_r as wl,a as AI,c as Ao,cr as uv,en as ba,er as so,f as CD,ft as Ql,gn as gr,gt as Rp,hr as w,i as A,it as PI,k as Hp,kt as WE,l as BP,lr as vD,m as Cp,n as $E,ot as Pe,pn as gI,pr as vp,qt as _p,r as $P,rr as tE,rt as Op,u as Bp,ur as vI,wn as jP,wr as zE,x as FI,xr as yI,y as Ep}from"./chunk-Cw2VObZO.js";import{c as Tn,t as Nt}from"./main-ERH7KQPV.js";import{$ as ml,A as To,B as _o,D as S,G as dl,K as fe,L as Ye,R as Yr,T as Ro,V as al,Z as ko,at as ut,c as E,et as mr,f as Fo,m as Ge,q as fo,st as yr,u as En,x as Oo,z as Zn}from"./chunk-tHjNEZFu.js";import{a as ev,c as mh,d as tv,i as av,l as q0,n as Yr$1,o as iv,r as Z0,s as ma,t as J0,u as sv}from"./chunk-BTVVDg5P.js";var r=(function(n){return n[n.START=1]=`START`,n[n.END=2]=`END`,n})(r||{});var V=(function(n){return n[n.ACTIVE=0]=`ACTIVE`,n[n.INACTIVE=1]=`INACTIVE`,n})(V||{});var tt=new A(`_MatSlider`);var Gt=new A(`_MatSliderThumb`);var te=new A(`_MatSliderRangeThumb`);var qt=new A(`_MatSliderVisualThumb`);var ee=(()=>{class n{_cdr=w(jP);_ngZone=w(Ne);_slider=w(tt);_renderer=w(ba);_listenerCleanups;discrete=!1;thumbPosition;valueIndicatorText;_ripple;_knob;_valueIndicatorContainer;_sliderInput;_sliderInputEl;_hoverRippleRef;_focusRippleRef;_activeRippleRef;_isHovered=!1;_isActive=!1;_isValueIndicatorVisible=!1;_hostElement=w(gr).nativeElement;_platform=w(S);ngAfterViewInit(){let t=this._slider._getInput(this.thumbPosition);t&&(this._ripple.radius=24,this._sliderInput=t,this._sliderInputEl=this._sliderInput._hostElement,this._ngZone.runOutsideAngular(()=>{let e=this._sliderInputEl,i=this._renderer;this._listenerCleanups=[i.listen(e,`pointermove`,this._onPointerMove),i.listen(e,`pointerdown`,this._onDragStart),i.listen(e,`pointerup`,this._onDragEnd),i.listen(e,`pointerleave`,this._onMouseLeave),i.listen(e,`focus`,this._onFocus),i.listen(e,`blur`,this._onBlur)]}))}ngOnDestroy(){this._listenerCleanups?.forEach(t=>t())}_onPointerMove=t=>{if(this._sliderInput._isFocused)return;let e=this._hostElement.getBoundingClientRect(),i=this._slider._isCursorOnSliderThumb(t,e);this._isHovered=i,i?this._showHoverRipple():this._hideRipple(this._hoverRippleRef)};_onMouseLeave=()=>{this._isHovered=!1,this._hideRipple(this._hoverRippleRef)};_onFocus=()=>{this._hideRipple(this._hoverRippleRef),this._showFocusRipple(),this._hostElement.classList.add(`mdc-slider__thumb--focused`)};_onBlur=()=>{this._isActive||this._hideRipple(this._focusRippleRef),this._isHovered&&this._showHoverRipple(),this._hostElement.classList.remove(`mdc-slider__thumb--focused`)};_onDragStart=t=>{t.button===0&&(this._isActive=!0,this._showActiveRipple())};_onDragEnd=()=>{this._isActive=!1,this._hideRipple(this._activeRippleRef),this._sliderInput._isFocused||this._hideRipple(this._focusRippleRef),this._platform.SAFARI&&this._showHoverRipple()};_showHoverRipple(){this._isShowingRipple(this._hoverRippleRef)||(this._hoverRippleRef=this._showRipple({enterDuration:0,exitDuration:0}),this._hoverRippleRef?.element.classList.add(`mat-mdc-slider-hover-ripple`))}_showFocusRipple(){this._isShowingRipple(this._focusRippleRef)||(this._focusRippleRef=this._showRipple({enterDuration:0,exitDuration:0},!0),this._focusRippleRef?.element.classList.add(`mat-mdc-slider-focus-ripple`))}_showActiveRipple(){this._isShowingRipple(this._activeRippleRef)||(this._activeRippleRef=this._showRipple({enterDuration:225,exitDuration:400}),this._activeRippleRef?.element.classList.add(`mat-mdc-slider-active-ripple`))}_isShowingRipple(t){return t?.state===E.FADING_IN||t?.state===E.VISIBLE}_showRipple(t,e){if(!this._slider.disabled&&(this._showValueIndicator(),this._slider._isRange&&this._slider._getThumb(this.thumbPosition===r.START?r.END:r.START)._showValueIndicator(),!(this._slider._globalRippleOptions?.disabled&&!e)))return this._ripple.launch({animation:this._slider._noopAnimations?{enterDuration:0,exitDuration:0}:t,centered:!0,persistent:!0})}_hideRipple(t){if(t?.fadeOut(),this._isShowingAnyRipple())return;this._slider._isRange||this._hideValueIndicator();let e=this._getSibling();e._isShowingAnyRipple()||(this._hideValueIndicator(),e._hideValueIndicator())}_showValueIndicator(){this._hostElement.classList.add(`mdc-slider__thumb--with-indicator`)}_hideValueIndicator(){this._hostElement.classList.remove(`mdc-slider__thumb--with-indicator`)}_getSibling(){return this._slider._getThumb(this.thumbPosition===r.START?r.END:r.START)}_getValueIndicatorContainer(){return this._valueIndicatorContainer?.nativeElement}_getKnob(){return this._knob.nativeElement}_isShowingAnyRipple(){return this._isShowingRipple(this._hoverRippleRef)||this._isShowingRipple(this._focusRippleRef)||this._isShowingRipple(this._activeRippleRef)}static ɵfac=function(e){return new(e||n)};static ɵcmp=(function(){let t=[`knob`],e=[`valueIndicatorContainer`];function i(s,u){if(s&1&&(si(0,`div`,2,1)(2,`div`,5)(3,`span`,6),aD(4),mc()()()),s&2){let b=AI();uv(4),Hp(b.valueIndicatorText)}}return $E({type:n,selectors:[[`mat-slider-visual-thumb`]],viewQuery:function(u,b){if(u&1&&Np(al,5)(t,5)(e,5),u&2){let h;PI(h=FI())&&(b._ripple=h.first),PI(h=FI())&&(b._knob=h.first),PI(h=FI())&&(b._valueIndicatorContainer=h.first)}},hostAttrs:[1,`mdc-slider__thumb`,`mat-mdc-slider-visual-thumb`],inputs:{discrete:`discrete`,thumbPosition:`thumbPosition`,valueIndicatorText:`valueIndicatorText`},features:[hD([{provide:qt,useExisting:n}])],decls:4,vars:2,consts:[[`knob`,``],[`valueIndicatorContainer`,``],[1,`mdc-slider__value-indicator-container`],[1,`mdc-slider__thumb-knob`],[`matRipple`,``,1,`mat-focus-indicator`,3,`matRippleDisabled`],[1,`mdc-slider__value-indicator`],[1,`mdc-slider__value-indicator-text`]],template:function(u,b){u&1&&(pI(0,i,5,1,`div`,2),Ip(1,`div`,3,0)(3,`div`,4)),u&2&&(gI(b.discrete?0:-1),uv(3),Ep(`matRippleDisabled`,!0))},dependencies:[al],styles:[`.mat-mdc-slider-visual-thumb .mat-ripple {
  height: 100%;
  width: 100%;
}

.mat-mdc-slider .mdc-slider__tick-marks {
  justify-content: start;
}
.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,
.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive {
  position: absolute;
  left: 2px;
}
`],encapsulation:2})})()}return n})();var Zt=(()=>{class n{_ngZone=w(Ne);_cdr=w(jP);_elementRef=w(gr);_dir=w(yr,{optional:!0});_globalRippleOptions=w(Yr,{optional:!0});_trackActive;_thumbs;_input;_inputs;get disabled(){return this._disabled}set disabled(t){this._disabled=t;let e=this._getInput(r.END),i=this._getInput(r.START);e&&(e.disabled=this._disabled),i&&(i.disabled=this._disabled)}_disabled=!1;get discrete(){return this._discrete}set discrete(t){this._discrete=t,this._updateValueIndicatorUIs()}_discrete=!1;get showTickMarks(){return this._showTickMarks}set showTickMarks(t){this._showTickMarks=t,this._hasViewInitialized&&(this._updateTickMarkUI(),this._updateTickMarkTrackUI())}_showTickMarks=!1;get min(){return this._min}set min(t){let e=t==null||isNaN(t)?this._min:t;this._min!==e&&this._updateMin(e)}_min=0;color;disableRipple=!1;_updateMin(t){let e=this._min;this._min=t,this._isRange?this._updateMinRange({old:e,new:t}):this._updateMinNonRange(t),this._onMinMaxOrStepChange()}_updateMinRange(t){let e=this._getInput(r.END),i=this._getInput(r.START),s=e.value,u=i.value;i.min=t.new,e.min=Math.max(t.new,i.value),i.max=Math.min(e.max,e.value),i._updateWidthInactive(),e._updateWidthInactive(),t.new<t.old?this._onTranslateXChangeBySideEffect(e,i):this._onTranslateXChangeBySideEffect(i,e),s!==e.value&&this._onValueChange(e),u!==i.value&&this._onValueChange(i)}_updateMinNonRange(t){let e=this._getInput(r.END);if(e){let i=e.value;e.min=t,e._updateThumbUIByValue(),this._updateTrackUI(e),i!==e.value&&this._onValueChange(e)}}get max(){return this._max}set max(t){let e=t==null||isNaN(t)?this._max:t;this._max!==e&&this._updateMax(e)}_max=100;_updateMax(t){let e=this._max;this._max=t,this._isRange?this._updateMaxRange({old:e,new:t}):this._updateMaxNonRange(t),this._onMinMaxOrStepChange()}_updateMaxRange(t){let e=this._getInput(r.END),i=this._getInput(r.START),s=e.value,u=i.value;e.max=t.new,i.max=Math.min(t.new,e.value),e.min=i.value,e._updateWidthInactive(),i._updateWidthInactive(),t.new>t.old?this._onTranslateXChangeBySideEffect(i,e):this._onTranslateXChangeBySideEffect(e,i),s!==e.value&&this._onValueChange(e),u!==i.value&&this._onValueChange(i)}_updateMaxNonRange(t){let e=this._getInput(r.END);if(e){let i=e.value;e.max=t,e._updateThumbUIByValue(),this._updateTrackUI(e),i!==e.value&&this._onValueChange(e)}}get step(){return this._step}set step(t){let e=isNaN(t)?this._step:t;this._step!==e&&this._updateStep(e)}_step=1;_updateStep(t){this._step=t,this._isRange?this._updateStepRange():this._updateStepNonRange(),this._onMinMaxOrStepChange()}_updateStepRange(){let t=this._getInput(r.END),e=this._getInput(r.START),i=t.value,s=e.value,u=e.value;t.min=this._min,e.max=this._max,t.step=this._step,e.step=this._step,this._platform.SAFARI&&(t.value=t.value,e.value=e.value),t.min=Math.max(this._min,e.value),e.max=Math.min(this._max,t.value),e._updateWidthInactive(),t._updateWidthInactive(),t.value<u?this._onTranslateXChangeBySideEffect(e,t):this._onTranslateXChangeBySideEffect(t,e),i!==t.value&&this._onValueChange(t),s!==e.value&&this._onValueChange(e)}_updateStepNonRange(){let t=this._getInput(r.END);if(t){let e=t.value;t.step=this._step,this._platform.SAFARI&&(t.value=t.value),t._updateThumbUIByValue(),e!==t.value&&this._onValueChange(t)}}displayWith=t=>`${t}`;_tickMarks=[];_noopAnimations=Ye();_resizeObserver=null;_cachedWidth;_cachedLeft;_rippleRadius=24;startValueIndicatorText=``;endValueIndicatorText=``;_endThumbTransform;_startThumbTransform;_isRange=!1;_isRtl=CD(()=>this._dir?.valueSignal()===`rtl`);_hasViewInitialized=!1;_tickMarkTrackWidth=0;_hasAnimation=!1;_resizeTimer=null;_platform=w(S);constructor(){w(fe).load(dl);let t=this._isRtl();$P(()=>{let e=this._isRtl();e!==t&&(t=e,this._isRange?this._onDirChangeRange():this._onDirChangeNonRange(),this._updateTickMarkUI())})}_knobRadius=8;_inputPadding;ngAfterViewInit(){this._platform.isBrowser&&this._updateDimensions();let t=this._getInput(r.END),e=this._getInput(r.START);this._isRange=!!t&&!!e,this._cdr.detectChanges();let i=this._getThumb(r.END);this._rippleRadius=i._ripple.radius,this._inputPadding=this._rippleRadius-this._knobRadius,this._isRange?this._initUIRange(t,e):this._initUINonRange(t),this._updateTrackUI(t),this._updateTickMarkUI(),this._updateTickMarkTrackUI(),this._observeHostResize(),this._cdr.detectChanges()}_initUINonRange(t){t.initProps(),t.initUI(),this._updateValueIndicatorUI(t),this._hasViewInitialized=!0,t._updateThumbUIByValue()}_initUIRange(t,e){t.initProps(),t.initUI(),e.initProps(),e.initUI(),t._updateMinMax(),e._updateMinMax(),t._updateStaticStyles(),e._updateStaticStyles(),this._updateValueIndicatorUIs(),this._hasViewInitialized=!0,t._updateThumbUIByValue(),e._updateThumbUIByValue()}ngOnDestroy(){this._resizeObserver?.disconnect(),this._resizeObserver=null}_onDirChangeRange(){let t=this._getInput(r.END),e=this._getInput(r.START);t._setIsLeftThumb(),e._setIsLeftThumb(),t.translateX=t._calcTranslateXByValue(),e.translateX=e._calcTranslateXByValue(),t._updateStaticStyles(),e._updateStaticStyles(),t._updateWidthInactive(),e._updateWidthInactive(),t._updateThumbUIByValue(),e._updateThumbUIByValue()}_onDirChangeNonRange(){this._getInput(r.END)._updateThumbUIByValue()}_observeHostResize(){typeof ResizeObserver>`u`||!ResizeObserver||this._ngZone.runOutsideAngular(()=>{this._resizeObserver=new ResizeObserver(()=>{this._isActive()||(this._resizeTimer&&clearTimeout(this._resizeTimer),this._onResize())}),this._resizeObserver.observe(this._elementRef.nativeElement)})}_isActive(){return this._getThumb(r.START)._isActive||this._getThumb(r.END)._isActive}_getValue(t=r.END){let e=this._getInput(t);return e?e.value:this.min}_skipUpdate(){return!!(this._getInput(r.START)?._skipUIUpdate||this._getInput(r.END)?._skipUIUpdate)}_updateDimensions(){this._cachedWidth=this._elementRef.nativeElement.offsetWidth,this._cachedLeft=this._elementRef.nativeElement.getBoundingClientRect().left}_setTrackActiveStyles(t){let e=this._trackActive.nativeElement.style;e.left=t.left,e.right=t.right,e.transformOrigin=t.transformOrigin,e.transform=t.transform}_calcTickMarkTransform(t){let e=t*(this._tickMarkTrackWidth/(this._tickMarks.length-1));return`translateX(${this._isRtl()?this._cachedWidth-6-e:e}px)`}_onTranslateXChange(t){this._hasViewInitialized&&(this._updateThumbUI(t),this._updateTrackUI(t),this._updateOverlappingThumbUI(t))}_onTranslateXChangeBySideEffect(t,e){this._hasViewInitialized&&(t._updateThumbUIByValue(),e._updateThumbUIByValue())}_onValueChange(t){this._hasViewInitialized&&(this._updateValueIndicatorUI(t),this._updateTickMarkUI(),this._cdr.detectChanges())}_onMinMaxOrStepChange(){this._hasViewInitialized&&(this._updateTickMarkUI(),this._updateTickMarkTrackUI(),this._cdr.markForCheck())}_onResize(){if(this._hasViewInitialized){if(this._updateDimensions(),this._isRange){let t=this._getInput(r.END),e=this._getInput(r.START);t._updateThumbUIByValue(),e._updateThumbUIByValue(),t._updateStaticStyles(),e._updateStaticStyles(),t._updateMinMax(),e._updateMinMax(),t._updateWidthInactive(),e._updateWidthInactive()}else{let t=this._getInput(r.END);t&&t._updateThumbUIByValue()}this._updateTickMarkUI(),this._updateTickMarkTrackUI(),this._cdr.detectChanges()}}_thumbsOverlap=!1;_areThumbsOverlapping(){let t=this._getInput(r.START),e=this._getInput(r.END);return!t||!e?!1:e.translateX-t.translateX<20}_updateOverlappingThumbClassNames(t){let e=t.getSibling(),i=this._getThumb(t.thumbPosition);this._getThumb(e.thumbPosition)._hostElement.classList.remove(`mdc-slider__thumb--top`),i._hostElement.classList.toggle(`mdc-slider__thumb--top`,this._thumbsOverlap)}_updateOverlappingThumbUI(t){!this._isRange||this._skipUpdate()||this._thumbsOverlap!==this._areThumbsOverlapping()&&(this._thumbsOverlap=!this._thumbsOverlap,this._updateOverlappingThumbClassNames(t))}_updateThumbUI(t){if(this._skipUpdate())return;let e=this._getThumb(t.thumbPosition===r.END?r.END:r.START);e._hostElement.style.transform=`translateX(${t.translateX}px)`}_updateValueIndicatorUI(t){if(this._skipUpdate())return;let e=this.displayWith(t.value);if(this._hasViewInitialized?t._valuetext.set(e):t._hostElement.setAttribute(`aria-valuetext`,e),this.discrete){t.thumbPosition===r.START?this.startValueIndicatorText=e:this.endValueIndicatorText=e;let i=this._getThumb(t.thumbPosition);e.length<3?i._hostElement.classList.add(`mdc-slider__thumb--short-value`):i._hostElement.classList.remove(`mdc-slider__thumb--short-value`)}}_updateValueIndicatorUIs(){let t=this._getInput(r.END),e=this._getInput(r.START);t&&this._updateValueIndicatorUI(t),e&&this._updateValueIndicatorUI(e)}_updateTickMarkTrackUI(){if(!this.showTickMarks||this._skipUpdate())return;let t=this._step&&this._step>0?this._step:1,i=(Math.floor(this.max/t)*t-this.min)/(this.max-this.min);this._tickMarkTrackWidth=(this._cachedWidth-6)*i}_updateTrackUI(t){this._skipUpdate()||(this._isRange?this._updateTrackUIRange(t):this._updateTrackUINonRange(t))}_updateTrackUIRange(t){let e=t.getSibling();if(!e||!this._cachedWidth)return;let i=Math.abs(e.translateX-t.translateX)/this._cachedWidth;t._isLeftThumb&&this._cachedWidth?this._setTrackActiveStyles({left:`auto`,right:`${this._cachedWidth-e.translateX}px`,transformOrigin:`right`,transform:`scaleX(${i})`}):this._setTrackActiveStyles({left:`${e.translateX}px`,right:`auto`,transformOrigin:`left`,transform:`scaleX(${i})`})}_updateTrackUINonRange(t){this._isRtl()?this._setTrackActiveStyles({left:`auto`,right:`0px`,transformOrigin:`right`,transform:`scaleX(${1-t.fillPercentage})`}):this._setTrackActiveStyles({left:`0px`,right:`auto`,transformOrigin:`left`,transform:`scaleX(${t.fillPercentage})`})}_updateTickMarkUI(){if(!this.showTickMarks||!this._cachedWidth||this.step===void 0||this.min===void 0||this.max===void 0)return;let t=this.step>0?this.step:1;this._isRange?this._updateTickMarkUIRange(t):this._updateTickMarkUINonRange(t)}_updateTickMarkUINonRange(t){let e=this._getValue(),i=Math.max(Math.round((e-this.min)/t),0)+1,s=Math.max(Math.round((this.max-e)/t),0)-1;this._isRtl()?i++:s++,this._tickMarks=Array(i).fill(V.ACTIVE).concat(Array(s).fill(V.INACTIVE))}_updateTickMarkUIRange(t){let e=this._getValue(),i=this._getValue(r.START),s=Math.max(Math.round((i-this.min)/t),0),u=Math.max(Math.round((e-i)/t)+1,0),b=Math.max(Math.round((this.max-e)/t),0);this._tickMarks=Array(s).fill(V.INACTIVE).concat(Array(u).fill(V.ACTIVE),Array(b).fill(V.INACTIVE))}_getInput(t){if(t===r.END&&this._input)return this._input;if(this._inputs?.length)return t===r.START?this._inputs.first:this._inputs.last}_getThumb(t){return t===r.END?this._thumbs?.last:this._thumbs?.first}_setTransition(t){this._hasAnimation=!this._platform.IOS&&t&&!this._noopAnimations,this._elementRef.nativeElement.classList.toggle(`mat-mdc-slider-with-animation`,this._hasAnimation)}_isCursorOnSliderThumb(t,e){let i=e.width/2,s=e.x+i,u=e.y+i,b=t.clientX-s,h=t.clientY-u;return Math.pow(b,2)+Math.pow(h,2)<Math.pow(i,2)}static ɵfac=function(e){return new(e||n)};static ɵcmp=(function(){let t=[`trackActive`],e=[`*`];function i(h,p){if(h&1&&Ip(0,`div`),h&2){let l=p.$implicit,f=p.$index,E=AI(3);YI(l===0?`mdc-slider__tick-mark--active`:`mdc-slider__tick-mark--inactive`),Rp(`transform`,E._calcTickMarkTransform(f))}}function s(h,p){if(h&1&&yI(0,i,1,4,`div`,8,mI),h&2){let l=AI(2);vI(l._tickMarks)}}function u(h,p){if(h&1&&(si(0,`div`,6,1),pI(2,s,2,0),mc()),h&2){let l=AI();uv(2),gI(l._cachedWidth?2:-1)}}function b(h,p){if(h&1&&Ip(0,`mat-slider-visual-thumb`,7),h&2){let l=AI();Ep(`discrete`,l.discrete)(`thumbPosition`,1)(`valueIndicatorText`,l.startValueIndicatorText)}}return $E({type:n,selectors:[[`mat-slider`]],contentQueries:function(p,l,f){if(p&1&&_p(f,Gt,5)(f,te,4),p&2){let E;PI(E=FI())&&(l._input=E.first),PI(E=FI())&&(l._inputs=E)}},viewQuery:function(p,l){if(p&1&&Np(t,5)(qt,5),p&2){let f;PI(f=FI())&&(l._trackActive=f.first),PI(f=FI())&&(l._thumbs=f)}},hostAttrs:[1,`mat-mdc-slider`,`mdc-slider`],hostVars:12,hostBindings:function(p,l){p&2&&(YI(`mat-`+(l.color||`primary`)),Op(`mdc-slider--range`,l._isRange)(`mdc-slider--disabled`,l.disabled)(`mdc-slider--discrete`,l.discrete)(`mdc-slider--tick-marks`,l.showTickMarks)(`_mat-animation-noopable`,l._noopAnimations))},inputs:{disabled:[2,`disabled`,`disabled`,HP],discrete:[2,`discrete`,`discrete`,HP],showTickMarks:[2,`showTickMarks`,`showTickMarks`,HP],min:[2,`min`,`min`,BP],color:`color`,disableRipple:[2,`disableRipple`,`disableRipple`,HP],max:[2,`max`,`max`,BP],step:[2,`step`,`step`,BP],displayWith:`displayWith`},exportAs:[`matSlider`],features:[hD([{provide:tt,useExisting:n}])],ngContentSelectors:e,decls:9,vars:5,consts:[[`trackActive`,``],[`tickMarkContainer`,``],[1,`mdc-slider__track`],[1,`mdc-slider__track--inactive`],[1,`mdc-slider__track--active`],[1,`mdc-slider__track--active_fill`],[1,`mdc-slider__tick-marks`],[3,`discrete`,`thumbPosition`,`valueIndicatorText`],[3,`class`,`transform`]],template:function(p,l){p&1&&(OI(),kI(0),si(1,`div`,2),Ip(2,`div`,3),si(3,`div`,4),Ip(4,`div`,5,0),mc(),pI(6,u,3,1,`div`,6),mc(),pI(7,b,1,3,`mat-slider-visual-thumb`,7),Ip(8,`mat-slider-visual-thumb`,7)),p&2&&(uv(6),gI(l.showTickMarks?6:-1),uv(),gI(l._isRange?7:-1),uv(),Ep(`discrete`,l.discrete)(`thumbPosition`,2)(`valueIndicatorText`,l.endValueIndicatorText))},dependencies:[ee],styles:[`.mdc-slider__track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  pointer-events: none;
  height: var(--%NS%mat-slider-inactive-track-height, 4px);
}

.mdc-slider__track--active,
.mdc-slider__track--inactive {
  display: flex;
  height: 100%;
  position: absolute;
  width: 100%;
}

.mdc-slider__track--active {
  overflow: hidden;
  border-radius: var(--%NS%mat-slider-active-track-shape, var(--%NS%mat-sys-corner-full));
  height: var(--%NS%mat-slider-active-track-height, 4px);
  top: calc((var(--%NS%mat-slider-inactive-track-height, 4px) - var(--%NS%mat-slider-active-track-height, 4px)) / 2);
}

.mdc-slider__track--active_fill {
  border-top-style: solid;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  position: relative;
  transform-origin: left;
  transition: transform 80ms ease;
  border-color: var(--%NS%mat-slider-active-track-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-slider-active-track-height, 4px);
}
.mdc-slider--disabled .mdc-slider__track--active_fill {
  border-color: var(--%NS%mat-slider-disabled-active-track-color, var(--%NS%mat-sys-on-surface));
}
[dir=rtl] .mdc-slider__track--active_fill {
  -webkit-transform-origin: right;
  transform-origin: right;
}

.mdc-slider__track--inactive {
  left: 0;
  top: 0;
  opacity: 0.24;
  background-color: var(--%NS%mat-slider-inactive-track-color, var(--%NS%mat-sys-surface-variant));
  height: var(--%NS%mat-slider-inactive-track-height, 4px);
  border-radius: var(--%NS%mat-slider-inactive-track-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-slider--disabled .mdc-slider__track--inactive {
  background-color: var(--%NS%mat-slider-disabled-inactive-track-color, var(--%NS%mat-sys-on-surface));
  opacity: 0.24;
}
.mdc-slider__track--%NS%inactive::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
@media (forced-colors: active) {
  .mdc-slider__track--%NS%inactive::before {
    border-color: CanvasText;
  }
}

.mdc-slider__value-indicator-container {
  bottom: 44px;
  left: 50%;
  pointer-events: none;
  position: absolute;
  transform: var(--%NS%mat-slider-value-indicator-container-transform, translateX(-50%) rotate(-45deg));
}
.mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container {
  pointer-events: auto;
}

.mdc-slider__value-indicator {
  display: flex;
  align-items: center;
  transform: scale(0);
  transform-origin: var(--%NS%mat-slider-value-indicator-transform-origin, 0 28px);
  transition: transform 100ms cubic-bezier(0.4, 0, 1, 1);
  word-break: normal;
  background-color: var(--%NS%mat-slider-label-container-color, var(--%NS%mat-sys-primary));
  color: var(--%NS%mat-slider-label-label-text-color, var(--%NS%mat-sys-on-primary));
  width: var(--%NS%mat-slider-value-indicator-width, 28px);
  height: var(--%NS%mat-slider-value-indicator-height, 28px);
  padding: var(--%NS%mat-slider-value-indicator-padding, 0);
  opacity: var(--%NS%mat-slider-value-indicator-opacity, 1);
  border-radius: var(--%NS%mat-slider-value-indicator-border-radius, 50% 50% 50% 0);
}
.mdc-slider__thumb--with-indicator .mdc-slider__value-indicator {
  transition: transform 100ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale(1);
}
.mdc-slider__value-indicator::before {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid;
  bottom: -5px;
  content: "";
  height: 0;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  width: 0;
  display: var(--%NS%mat-slider-value-indicator-caret-display, none);
  border-top-color: var(--%NS%mat-slider-label-container-color, var(--%NS%mat-sys-primary));
}
.mdc-slider__value-indicator::after {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
@media (forced-colors: active) {
  .mdc-slider__value-indicator::after {
    border-color: CanvasText;
  }
}

.mdc-slider__value-indicator-text {
  text-align: center;
  width: var(--%NS%mat-slider-value-indicator-width, 28px);
  transform: var(--%NS%mat-slider-value-indicator-text-transform, rotate(45deg));
  font-family: var(--%NS%mat-slider-label-label-text-font, var(--%NS%mat-sys-label-medium-font));
  font-size: var(--%NS%mat-slider-label-label-text-size, var(--%NS%mat-sys-label-medium-size));
  font-weight: var(--%NS%mat-slider-label-label-text-weight, var(--%NS%mat-sys-label-medium-weight));
  line-height: var(--%NS%mat-slider-label-label-text-line-height, var(--%NS%mat-sys-label-medium-line-height));
  letter-spacing: var(--%NS%mat-slider-label-label-text-tracking, var(--%NS%mat-sys-label-medium-tracking));
}

.mdc-slider__thumb {
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  left: -24px;
  outline: none;
  position: absolute;
  height: 48px;
  width: 48px;
  pointer-events: none;
}
.mdc-slider--discrete .mdc-slider__thumb {
  transition: transform 80ms ease;
}
.mdc-slider--disabled .mdc-slider__thumb {
  pointer-events: none;
}

.mdc-slider__thumb--top {
  z-index: 1;
}

.mdc-slider__thumb-knob {
  position: absolute;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-style: solid;
  width: var(--%NS%mat-slider-handle-width, 20px);
  height: var(--%NS%mat-slider-handle-height, 20px);
  border-width: calc(var(--%NS%mat-slider-handle-height, 20px) / 2) calc(var(--%NS%mat-slider-handle-width, 20px) / 2);
  box-shadow: var(--%NS%mat-slider-handle-elevation, var(--%NS%mat-sys-level1));
  background-color: var(--%NS%mat-slider-handle-color, var(--%NS%mat-sys-primary));
  border-color: var(--%NS%mat-slider-handle-color, var(--%NS%mat-sys-primary));
  border-radius: var(--%NS%mat-slider-handle-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-slider__thumb:hover .mdc-slider__thumb-knob {
  background-color: var(--%NS%mat-slider-hover-handle-color, var(--%NS%mat-sys-primary));
  border-color: var(--%NS%mat-slider-hover-handle-color, var(--%NS%mat-sys-primary));
}
.mdc-slider__thumb--focused .mdc-slider__thumb-knob {
  background-color: var(--%NS%mat-slider-focus-handle-color, var(--%NS%mat-sys-primary));
  border-color: var(--%NS%mat-slider-focus-handle-color, var(--%NS%mat-sys-primary));
}
.mdc-slider--disabled .mdc-slider__thumb-knob {
  background-color: var(--%NS%mat-slider-disabled-handle-color, var(--%NS%mat-sys-on-surface));
  border-color: var(--%NS%mat-slider-disabled-handle-color, var(--%NS%mat-sys-on-surface));
}
.mdc-slider__thumb--top .mdc-slider__thumb-knob, .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob, .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob {
  border: solid 1px #fff;
  box-sizing: content-box;
  border-color: var(--%NS%mat-slider-with-overlap-handle-outline-color, var(--%NS%mat-sys-on-primary));
  border-width: var(--%NS%mat-slider-with-overlap-handle-outline-width, 1px);
}

.mdc-slider__tick-marks {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  justify-content: space-between;
  padding: 0 1px;
  position: absolute;
  width: 100%;
}

.mdc-slider__tick-mark--active,
.mdc-slider__tick-mark--inactive {
  width: var(--%NS%mat-slider-with-tick-marks-container-size, 2px);
  height: var(--%NS%mat-slider-with-tick-marks-container-size, 2px);
  border-radius: var(--%NS%mat-slider-with-tick-marks-container-shape, var(--%NS%mat-sys-corner-full));
}

.mdc-slider__tick-mark--inactive {
  opacity: var(--%NS%mat-slider-with-tick-marks-inactive-container-opacity, 0.38);
  background-color: var(--%NS%mat-slider-with-tick-marks-inactive-container-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-slider--disabled .mdc-slider__tick-mark--inactive {
  opacity: var(--%NS%mat-slider-with-tick-marks-inactive-container-opacity, 0.38);
  background-color: var(--%NS%mat-slider-with-tick-marks-disabled-container-color, var(--%NS%mat-sys-on-surface));
}

.mdc-slider__tick-mark--active {
  opacity: var(--%NS%mat-slider-with-tick-marks-active-container-opacity, 0.38);
  background-color: var(--%NS%mat-slider-with-tick-marks-active-container-color, var(--%NS%mat-sys-on-primary));
}

.mdc-slider__input {
  cursor: pointer;
  left: 2px;
  margin: 0;
  height: 44px;
  opacity: 0;
  position: absolute;
  top: 2px;
  width: 44px;
  box-sizing: content-box;
}
.mdc-slider__input.mat-mdc-slider-input-no-pointer-events {
  pointer-events: none;
}
.mdc-slider__input.mat-slider__right-input {
  left: auto;
  right: 0;
}

.mat-mdc-slider {
  display: inline-block;
  box-sizing: border-box;
  outline: none;
  vertical-align: middle;
  cursor: pointer;
  height: 48px;
  margin: 0 8px;
  position: relative;
  touch-action: pan-y;
  width: auto;
  min-width: 112px;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-slider.mdc-slider--disabled {
  cursor: auto;
  opacity: 0.38;
}
.mat-mdc-slider.mdc-slider--disabled .mdc-slider__input {
  cursor: auto;
}
.mat-mdc-slider .mdc-slider__thumb,
.mat-mdc-slider .mdc-slider__track--active_fill {
  transition-duration: 0ms;
}
.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,
.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill {
  transition-duration: 80ms;
}
.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,
.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill {
  transition-duration: 0ms;
}
.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,
.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill {
  transition-duration: 80ms;
}
.mat-mdc-slider .mat-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-slider-ripple-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple {
  background-color: var(--%NS%mat-slider-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-primary) 5%, transparent));
}
.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,
.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple {
  background-color: var(--%NS%mat-slider-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-primary) 20%, transparent));
}
.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb, .mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,
.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator {
  transition: none;
}
.mat-mdc-slider .mat-focus-indicator::before {
  border-radius: 50%;
}

.mdc-slider__thumb--focused .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})})()}return n})();var ie={provide:ut,useExisting:so(()=>et),multi:!0};var et=(()=>{class n{_ngZone=w(Ne);_elementRef=w(gr);_cdr=w(jP);_slider=w(tt);_platform=w(S);_listenerCleanups;get value(){return BP(this._hostElement.value,0)}set value(t){t===null&&(t=this._getDefaultValue()),t=isNaN(t)?0:t;let e=t+``;if(!this._hasSetInitialValue){this._initialValue=e;return}this._isActive||this._setValue(e)}_setValue(t){this._hostElement.value=t,this._updateThumbUIByValue(),this._slider._onValueChange(this),this._cdr.detectChanges(),this._slider._cdr.markForCheck()}valueChange=new Pe;dragStart=new Pe;dragEnd=new Pe;get translateX(){return this._slider.min>=this._slider.max?(this._translateX=this._tickMarkOffset,this._translateX):(this._translateX===void 0&&(this._translateX=this._calcTranslateXByValue()),this._translateX)}set translateX(t){this._translateX=t}_translateX;thumbPosition=r.END;get min(){return BP(this._hostElement.min,0)}set min(t){this._hostElement.min=t+``,this._cdr.detectChanges()}get max(){return BP(this._hostElement.max,0)}set max(t){this._hostElement.max=t+``,this._cdr.detectChanges()}get step(){return BP(this._hostElement.step,0)}set step(t){this._hostElement.step=t+``,this._cdr.detectChanges()}get disabled(){return HP(this._hostElement.disabled)}set disabled(t){this._hostElement.disabled=t,this._cdr.detectChanges(),this._slider.disabled!==this.disabled&&(this._slider.disabled=this.disabled)}get percentage(){return this._slider.min>=this._slider.max?this._slider._isRtl()?1:0:(this.value-this._slider.min)/(this._slider.max-this._slider.min)}get fillPercentage(){return this._slider._cachedWidth?this._translateX===0?0:this.translateX/this._slider._cachedWidth:this._slider._isRtl()?1:0}_hostElement=this._elementRef.nativeElement;_valuetext=Ao(``);_knobRadius=8;_tickMarkOffset=3;_isActive=!1;_isFocused=!1;_setIsFocused(t){this._isFocused=t}_hasSetInitialValue=!1;_initialValue;_formControl;_destroyed=new Y;_skipUIUpdate=!1;_onChangeFn;_onTouchedFn=()=>{};_isControlInitialized=!1;constructor(){let t=w(ba);this._ngZone.runOutsideAngular(()=>{this._listenerCleanups=[t.listen(this._hostElement,`pointerdown`,this._onPointerDown.bind(this)),t.listen(this._hostElement,`pointermove`,this._onPointerMove.bind(this)),t.listen(this._hostElement,`pointerup`,this._onPointerUp.bind(this))]})}ngOnDestroy(){this._listenerCleanups.forEach(t=>t()),this._destroyed.next(),this._destroyed.complete(),this.dragStart.complete(),this.dragEnd.complete()}initProps(){this._updateWidthInactive(),this.disabled!==this._slider.disabled&&(this._slider.disabled=!0),this.step=this._slider.step,this.min=this._slider.min,this.max=this._slider.max,this._initValue()}initUI(){this._updateThumbUIByValue()}_initValue(){this._hasSetInitialValue=!0,this._initialValue===void 0?this.value=this._getDefaultValue():(this._hostElement.value=this._initialValue,this._updateThumbUIByValue(),this._slider._onValueChange(this),this._cdr.detectChanges())}_getDefaultValue(){return this.min}_onBlur(){this._setIsFocused(!1),this._onTouchedFn()}_onFocus(){this._slider._setTransition(!1),this._slider._updateTrackUI(this),this._setIsFocused(!0)}_onChange(){this.valueChange.emit(this.value),this._isActive&&this._updateThumbUIByValue({withAnimation:!0})}_onInput(){this._onChangeFn?.(this.value),(this._slider.step||!this._isActive)&&this._updateThumbUIByValue({withAnimation:!this._isActive}),this._slider._onValueChange(this)}_onNgControlValueChange(){(!this._isActive||!this._isFocused)&&(this._slider._onValueChange(this),this._updateThumbUIByValue()),this._slider.disabled=this._formControl.disabled}_onPointerDown(t){if(!(this.disabled||t.button!==0)){if(this._platform.IOS){let e=this._slider._isCursorOnSliderThumb(t,this._slider._getThumb(this.thumbPosition)._hostElement.getBoundingClientRect());this._isActive=e,this._updateWidthActive(),this._slider._updateDimensions();return}this._isActive=!0,this._setIsFocused(!0),this._updateWidthActive(),this._slider._updateDimensions(),this._slider.step||this._updateThumbUIByPointerEvent(t,{withAnimation:!0}),this.disabled||(this._handleValueCorrection(t),this.dragStart.emit({source:this,parent:this._slider,value:this.value}))}}_handleValueCorrection(t){this._skipUIUpdate=!0,setTimeout(()=>{this._skipUIUpdate=!1,this._fixValue(t)},0)}_fixValue(t){let e=t.clientX-this._slider._cachedLeft,i=this._slider._cachedWidth,s=this._slider.step===0?1:this._slider.step,u=Math.floor((this._slider.max-this._slider.min)/s),b=this._slider._isRtl()?1-e/i:e/i,p=Math.round(b*u)/u*(this._slider.max-this._slider.min)+this._slider.min,l=Math.round(p/s)*s;if(l===this.value){this._slider._onValueChange(this),this._slider.step>0?this._updateThumbUIByValue():this._updateThumbUIByPointerEvent(t,{withAnimation:this._slider._hasAnimation});return}this.value=l,this.valueChange.emit(this.value),this._onChangeFn?.(this.value),this._slider._onValueChange(this),this._slider.step>0?this._updateThumbUIByValue():this._updateThumbUIByPointerEvent(t,{withAnimation:this._slider._hasAnimation})}_onPointerMove(t){!this._slider.step&&this._isActive&&this._updateThumbUIByPointerEvent(t)}_onPointerUp(){this._isActive&&(this._isActive=!1,this._platform.SAFARI&&this._setIsFocused(!1),this.dragEnd.emit({source:this,parent:this._slider,value:this.value}),setTimeout(()=>this._updateWidthInactive(),this._platform.IOS?10:0))}_clamp(t){let e=this._tickMarkOffset,i=this._slider._cachedWidth-this._tickMarkOffset;return Math.max(Math.min(t,i),e)}_calcTranslateXByValue(){return this._slider._isRtl()?(1-this.percentage)*(this._slider._cachedWidth-this._tickMarkOffset*2)+this._tickMarkOffset:this.percentage*(this._slider._cachedWidth-this._tickMarkOffset*2)+this._tickMarkOffset}_calcTranslateXByPointerEvent(t){return t.clientX-this._slider._cachedLeft}_updateWidthActive(){}_updateWidthInactive(){this._hostElement.style.padding=`0 ${this._slider._inputPadding}px`,this._hostElement.style.width=`calc(100% + ${this._slider._inputPadding-this._tickMarkOffset*2}px)`,this._hostElement.style.left=`-${this._slider._rippleRadius-this._tickMarkOffset}px`}_updateThumbUIByValue(t){this.translateX=this._clamp(this._calcTranslateXByValue()),this._updateThumbUI(t)}_updateThumbUIByPointerEvent(t,e){this.translateX=this._clamp(this._calcTranslateXByPointerEvent(t)),this._updateThumbUI(e)}_updateThumbUI(t){this._slider._setTransition(!!t?.withAnimation),this._slider._onTranslateXChange(this)}writeValue(t){(this._isControlInitialized||t!==null)&&(this.value=t)}registerOnChange(t){this._onChangeFn=t,this._isControlInitialized=!0}registerOnTouched(t){this._onTouchedFn=t}setDisabledState(t){this.disabled=t}focus(){this._hostElement.focus()}blur(){this._hostElement.blur()}static ɵfac=function(e){return new(e||n)};static ɵdir=zE({type:n,selectors:[[`input`,`matSliderThumb`,``]],hostAttrs:[`type`,`range`,1,`mdc-slider__input`],hostVars:1,hostBindings:function(e,i){e&1&&Cp(`change`,function(){return i._onChange()})(`input`,function(){return i._onInput()})(`blur`,function(){return i._onBlur()})(`focus`,function(){return i._onFocus()}),e&2&&vp(`aria-valuetext`,i._valuetext())},inputs:{value:[2,`value`,`value`,BP]},outputs:{valueChange:`valueChange`,dragStart:`dragStart`,dragEnd:`dragEnd`},exportAs:[`matSliderThumb`],features:[hD([ie,{provide:Gt,useExisting:n}])]})}return n})();var Yt=(()=>{class n{static ɵfac=function(e){return new(e||n)};static ɵmod=WE({type:n});static ɵinj=wl({imports:[ml,Ge]})}return n})();var ae=(n,a)=>a.value;var re=(n,a)=>a.id;var se=(n,a)=>a.partyId;function le(n,a){n&1&&(si(0,`p`,3),aD(1,` No hay escenarios disponibles. Lanza un análisis desde la página `),si(2,`a`,4),aD(3,`Análisis de flujo`),mc(),aD(4,` para poder explorarlos aquí. `),mc())}function oe(n,a){n&1&&(si(0,`p`),aD(1,`Flujos recíprocos simplificados: los votos compensados permanecen en sus respectivos partidos.`),mc())}function de(n,a){if(n&1&&(si(0,`mat-button-toggle`,11),aD(1),mc()),n&2){let t=a.$implicit;Ep(`value`,t.value),uv(),Hp(t.label)}}function ce(n,a){if(n&1&&(si(0,`th`,16),aD(1),mc()),n&2){let t=a.$implicit;uv(),Hp(t.name)}}function he(n,a){if(n&1&&(si(0,`td`),aD(1),vD(2,`number`),mc()),n&2){let t=a.$implicit;Op(`is-empty`,t===0),uv(),Hp(ID(2,3,t))}}function me(n,a){if(n&1&&(si(0,`tr`)(1,`th`,18),aD(2),mc(),yI(3,he,3,5,`td`,20,mI),si(5,`td`,19),aD(6),vD(7,`number`),mc()()),n&2){let t=a.$implicit;uv(2),Hp(t.partyName),uv(),vI(t.cells),uv(3),Hp(ID(7,2,t.total))}}function ue(n,a){if(n&1&&(si(0,`td`,19),aD(1),vD(2,`number`),mc()),n&2){let t=a.$implicit;uv(),Hp(ID(2,1,t))}}function _e(n,a){if(n&1&&(si(0,`div`,12)(1,`table`,13)(2,`caption`,14),aD(3,` Votos transferidos de cada partido (fila, votación antigua) a cada partido (columna, votación nueva) `),mc(),si(4,`thead`)(5,`tr`)(6,`th`,15),aD(7,`Origen \\ Destino`),mc(),yI(8,ce,2,1,`th`,16,re),si(10,`th`,17),aD(11,`Total`),mc()()(),si(12,`tbody`),yI(13,me,8,4,`tr`,null,se),mc(),si(15,`tfoot`)(16,`tr`)(17,`th`,18),aD(18,`Total`),mc(),yI(19,ue,3,3,`td`,19,mI),Ip(21,`td`,19),mc()()()()),n&2){let t=AI(2);uv(8),vI(t.columnParties()),uv(5),vI(t.matrixRows()),uv(6),vI(t.columnTotals())}}function pe(n,a){if(n&1&&(si(0,`div`,21),Ip(1,`ngx-charts-sankey`,22),mc()),n&2){let t=AI(3);uv(),Ep(`results`,t.sankeyLinks())(`customColors`,t.sankeyColors())(`showLabels`,!0)}}function ve(n,a){n&1&&(si(0,`p`,3),aD(1,` No hay flujos de votos positivos para representar en el diagrama. `),mc())}function be(n,a){if(n&1&&pI(0,pe,2,3,`div`,21)(1,ve,2,0,`p`,3),n&2){let t=AI(2);gI(t.sankeyLinks().length>0?0:1)}}function ge(n,a){if(n&1){let t=bI();pI(0,oe,2,0,`p`),si(1,`div`,5)(2,`span`,6),aD(3),mc(),si(4,`mat-slider`,7)(5,`input`,8),Xv(),Cp(`ngModelChange`,function(i){Ql(t);let s=AI();return Zl(s.onSliderChange(i))}),mc()()(),si(6,`div`,9)(7,`mat-button-toggle-group`,10),Cp(`change`,function(i){Ql(t);let s=AI();return Zl(s.displayMode.set(i.value))}),yI(8,de,2,2,`mat-button-toggle`,11,ae),mc()(),pI(10,_e,22,0,`div`,12),pI(11,be,2,1)}if(n&2){let t=AI();gI(t.store.input().simplifyReciprocalFlows?0:-1),uv(3),Bp(` Escenario `,t.scenarioPosition(),` de `,t.scenarioCount(),` `),uv(),Ep(`min`,0)(`max`,t.sliderMax())(`step`,1)(`disabled`,t.sliderMax()===0),uv(),Ep(`ngModel`,t.selectedOrderedIndex()),tE(),uv(2),Ep(`value`,t.displayMode()),uv(),vI(t.viewOptions),uv(2),gI(t.displayMode()===`grid`&&t.matrixRows().length>0?10:-1),uv(),gI(t.displayMode()===`sankey`?11:-1)}}var Kt=class n{store=w(Zn);viewOptions=[{label:`Tabla`,value:`grid`},{label:`Diagrama Sankey`,value:`sankey`}];displayMode=Ao(`grid`);selectedOrderedIndex=Ao(0);input=this.store.input;scenarios=this.store.scenarios;hasScenarios=CD(()=>this.scenarios().length>0);partyOrder=CD(()=>J0(this.input().oldVotation,this.input().newVotation,this.scenarios()));sankeyColors=CD(()=>av(this.partyOrder()));orderedScenarios=CD(()=>iv(this.scenarios(),this.partyOrder()));sliderMax=CD(()=>Math.max(this.orderedScenarios().length-1,0));currentScenario=CD(()=>{let a=this.orderedScenarios();if(a.length===0)return null;return a[Math.min(this.selectedOrderedIndex(),a.length-1)]});currentMatrix=CD(()=>{let a=this.currentScenario();return a?ev(a.scenario,this.partyOrder()):null});sankeyLinks=CD(()=>{let a=this.currentMatrix();if(!a)return[];let t=this.visibleColumnIndices();return sv(a.parties,t.map(e=>a.parties[e]),a.cells.map(e=>t.map(i=>e[i])))});visibleColumnIndices=CD(()=>tv(this.partyOrder(),this.input().newVotation,this.scenarios()));matrixRows=CD(()=>{let a=this.currentMatrix();if(!a)return[];let t=this.visibleColumnIndices();return a.parties.map((e,i)=>({partyId:e.id,partyName:e.name,cells:t.map(s=>a.cells[i][s]),total:a.rowTotals[i]}))});columnParties=CD(()=>{let a=this.currentMatrix()?.parties??[];return this.visibleColumnIndices().map(t=>a[t])});columnTotals=CD(()=>{let a=this.currentMatrix()?.colTotals??[];return this.visibleColumnIndices().map(t=>a[t])});scenarioPosition=CD(()=>this.selectedOrderedIndex()+1);scenarioCount=CD(()=>this.orderedScenarios().length);onSliderChange(a){this.selectedOrderedIndex.set(a)}static ɵfac=function(t){return new(t||n)};static ɵcmp=$E({type:n,selectors:[[`app-scenario-matrix-page`]],decls:8,vars:1,consts:[[1,`matrix-shell`],[`appearance`,`outlined`],[`mat-card-title`,``],[1,`empty-state`],[`routerLink`,`/analisis-flujo`],[`role`,`group`,`aria-label`,`Navegación entre escenarios`,1,`scenario-nav`],[`id`,`scenario-slider-label`,1,`scenario-label`],[1,`scenario-slider`,3,`min`,`max`,`step`,`disabled`],[`matSliderThumb`,``,`aria-labelledby`,`scenario-slider-label`,3,`ngModelChange`,`ngModel`],[`role`,`group`,`aria-label`,`Selección de visualización`,1,`view-picker`],[`aria-label`,`Visualización de los flujos`,3,`change`,`value`],[3,`value`],[`role`,`region`,`aria-label`,`Tabla de flujo de votos entre partidos`,`tabindex`,`0`,1,`matrix-scroll`],[1,`matrix-table`],[1,`sr-only`],[`scope`,`col`,1,`corner-cell`],[`scope`,`col`],[`scope`,`col`,1,`total-cell`],[`scope`,`row`],[1,`total-cell`],[3,`is-empty`],[`role`,`region`,`aria-label`,`Diagrama Sankey de votos transferidos entre partidos`,`tabindex`,`0`,1,`sankey-scroll`],[3,`results`,`customColors`,`showLabels`]],template:function(t,e){t&1&&(si(0,`section`,0)(1,`mat-card`,1)(2,`mat-card-header`)(3,`h2`,2),aD(4,`Matriz de transferencia de votos por escenario`),mc()(),si(5,`mat-card-content`),pI(6,le,5,0,`p`,3)(7,ge,12,11),mc()()()),t&2&&(uv(6),gI(e.hasScenarios()?7:6))},dependencies:[_o,En,fo,mr,Nt,Ro,Fo,To,Oo,ko,mh,Yr$1,ma,Yt,Zt,et,q0,Z0,Tn],styles:[`.matrix-shell[_ngcontent-%COMP%]{display:grid;gap:1rem}.empty-state[_ngcontent-%COMP%]{margin:0;color:#374151}.scenario-nav[_ngcontent-%COMP%]{display:grid;gap:.6rem;margin-bottom:1rem}.scenario-label[_ngcontent-%COMP%]{font-weight:600;color:#1f2937}.scenario-slider[_ngcontent-%COMP%]{width:calc(100% - 1rem);max-width:32rem}.view-picker[_ngcontent-%COMP%]{margin-bottom:1rem;overflow-x:auto}.matrix-scroll[_ngcontent-%COMP%]{overflow-x:auto}.sankey-scroll[_ngcontent-%COMP%]{width:100%;height:36rem;overflow-x:auto}ngx-charts-sankey[_ngcontent-%COMP%]{display:block;width:100%;min-width:40rem;height:100%}.matrix-table[_ngcontent-%COMP%]{border-collapse:collapse;width:100%;min-width:32rem}.matrix-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .matrix-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{border:1px solid var(--%NS%surface-border, #d1d5db);padding:.5rem .75rem;text-align:right;white-space:nowrap}.matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{text-align:center;background:#f3f4f6}.matrix-table[_ngcontent-%COMP%]   .corner-cell[_ngcontent-%COMP%]{text-align:left}.matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{text-align:left;background:#f9fafb}.matrix-table[_ngcontent-%COMP%]   td.is-empty[_ngcontent-%COMP%]{color:#9ca3af}.matrix-table[_ngcontent-%COMP%]   .total-cell[_ngcontent-%COMP%]{font-weight:600;background:#eef2ff}.matrix-table[_ngcontent-%COMP%]   tfoot[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{text-align:left;background:#eef2ff}.sr-only[_ngcontent-%COMP%]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`]})};export{Kt as ScenarioMatrixPage};