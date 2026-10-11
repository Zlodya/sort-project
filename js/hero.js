(function () {
  var stage = document.getElementById('heroStage');
  if (!stage || typeof window.genQuick !== 'function') return;

  var N = 22;
  var bars = [];
  var timer = null;

  function randArr(n) {
    var a = [];
    for (var i = 1; i <= n; i++) a.push(i);
    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  for (var i = 0; i < N; i++) {
    var b = document.createElement('div');
    b.className = 'bar';
    stage.appendChild(b);
    bars.push(b);
  }

  function draw(f) {
    for (var i = 0; i < N; i++) {
      var el = bars[i];
      el.style.height = Math.round((f.arr[i] / N) * 100) + '%';
      el.className = 'bar';
    }
    (f.marks || []).forEach(function (m) { bars[m.i].classList.add(m.cls); });
    if (f.done) bars.forEach(function (el) { el.classList.add('sorted'); });
  }

  function start() {
    clearInterval(timer);
    var frames = genQuick(randArr(N));
    var i = 0;
    draw(frames[0]);
    timer = setInterval(function () {
      i++;
      if (i >= frames.length) {
        clearInterval(timer);
        draw(frames[frames.length - 1]);
        setTimeout(start, 2000);
        return;
      }
      draw(frames[i]);
    }, 55);
  }

  start();
})();