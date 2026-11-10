/* Poured metallic epoxy shader for the home hero.
   Runs only when WebGL is available and the visitor has not asked for reduced motion.
   Renders at reduced resolution, pauses when the hero is off screen or the tab is hidden. */
(function () {
  var canvas = document.querySelector('.hero-epoxy');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  var vert = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var frag = [
    'precision mediump float;',
    'uniform vec2 r;uniform float t;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    ' return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);',
    ' for(int i=0;i<5;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}',
    'float field(vec2 uv){',
    ' vec2 q=vec2(fbm(uv+.05*t),fbm(uv+vec2(5.2,1.3)-.04*t));',
    ' vec2 w=vec2(fbm(uv+3.5*q+vec2(1.7,9.2)+.03*t),fbm(uv+3.5*q+vec2(8.3,2.8)-.025*t));',
    ' return fbm(uv+3.*w);}',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/r.y*1.35;',
    ' float f=field(uv);',
    ' float e=.004;',
    ' float fx=field(uv+vec2(e,0.))-f, fy=field(uv+vec2(0.,e))-f;',
    ' vec3 nr=normalize(vec3(-fx/e*.06,-fy/e*.06,1.));',
    ' vec3 L=normalize(vec3(-.4,.6,.7));',
    ' float spec=pow(max(dot(reflect(-L,nr),vec3(0,0,1)),0.),28.);',
    ' float band=.5+.5*sin(f*14.+t*.15);',
    ' vec3 navy=vec3(.03,.09,.15),blue=vec3(.14,.49,.71),cyan=vec3(.38,.77,.94),pearl=vec3(.86,.94,1.);',
    ' vec3 c=mix(navy,blue,smoothstep(.25,.75,f));',
    ' c=mix(c,cyan,band*smoothstep(.45,.85,f)*.7);',
    ' c+=pearl*spec*.9;',
    ' float vx=gl_FragCoord.x/r.x;',
    ' c*=smoothstep(.0,.55,vx)*.85+.15;',
    ' gl_FragColor=vec4(c,1.);',
    '}'
  ].join('\n');

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }
  var vs = sh(gl.VERTEX_SHADER, vert), fs = sh(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't');

  var SCALE = 0.5; // half resolution keeps it light on phones; CSS scales it up smoothly
  function resize() {
    var w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
    var hgt = Math.max(1, Math.round(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== hgt) {
      canvas.width = w; canvas.height = hgt;
      gl.viewport(0, 0, w, hgt);
    }
  }

  var visible = true, running = false, start = performance.now(), raf = 0, last = 0;
  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) { running = false; return; }
    if (now - last > 33) { // ~30fps is plenty for a slow pour
      last = now;
      resize();
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    raf = requestAnimationFrame(frame);
  }
  function play() { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting; play();
    }).observe(canvas);
  }
  document.addEventListener('visibilitychange', play);
  window.addEventListener('resize', resize, { passive: true });

  play();
  requestAnimationFrame(function () { canvas.classList.add('is-live'); });
})();
