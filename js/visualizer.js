(function () {
  function esc(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  window.SortVis = {
    cfg: null,
    frames: [],
    i: 0,
    timer: null,
    running: false,
    barEls: [],
    stepEls: [],

    init(config) {
      this.cfg = Object.assign({ size: 20, gen: null }, config);
      const vis = document.querySelector('.vis-wrap');
      if (!vis) return;
      this.el = {
        stage: vis.querySelector('.bars-stage'),
        list: vis.querySelector('.steps-list'),
        count: vis.querySelector('.steps-count'),
        status: vis.querySelector('.status-text'),
        play: vis.querySelector('[data-action="play"]'),
        pause: vis.querySelector('[data-action="pause"]'),
        reset: vis.querySelector('[data-action="reset"]'),
        speed: vis.querySelector('.speed')
      };
      this.reset(true);
      this.bindControls();
    },

    shuffle() {
      const n = this.cfg.size;
      const arr = [];
      for (let i = 0; i < n; i++) arr.push(i + 1);
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    reset(initial) {
      this.stop();
      this.i = 0;
      const arr = this.shuffle();
      this.frames = this.cfg.gen(arr);
      this.stepEls = [];
      this.el.list.innerHTML = '';
      this.renderBars();
      this.applyFrame(this.frames[0]);
      this.setStatus(initial ? 'Массив перемешан. Нажмите «Старт»' : 'Перемешано заново. Нажмите «Старт»');
    },

    stop() {
      this.running = false;
      clearTimeout(this.timer);
    },

    bindControls() {
      this.el.play.addEventListener('click', () => this.play());
      this.el.pause.addEventListener('click', () => this.pause());
      this.el.reset.addEventListener('click', () => this.reset());
    },

    play() {
      if (this.running) return;
      if (this.i >= this.frames.length - 1) {
        this.i = 0;
        this.applyFrame(this.frames[0]);
      }
      this.running = true;
      this.setStatus('Сортировка выполняется…');
      this.tick();
    },

    pause() {
      if (!this.running) return;
      this.stop();
      this.setStatus('Пауза');
    },

    tick() {
      if (!this.running) return;
      if (this.i >= this.frames.length - 1) {
        this.finish();
        return;
      }
      this.i++;
      this.applyFrame(this.frames[this.i]);
      const delay = parseInt(this.el.speed.value, 10) || 500;
      this.timer = setTimeout(() => this.tick(), delay);
    },

    finish() {
      this.stop();
      this.setStatus('Готово — массив отсортирован');
    },

    setStatus(text) {
      this.el.status.textContent = text;
    },

    renderBars() {
      const n = this.frames[0].arr.length;
      this.el.stage.innerHTML = '';
      this.barEls = [];
      for (let k = 0; k < n; k++) {
        const b = document.createElement('div');
        b.className = 'bar';
        b.title = '';
        this.el.stage.appendChild(b);
        this.barEls.push(b);
      }
    },

    applyFrame(frame) {
      const arr = frame.arr;
      const max = Math.max.apply(null, arr);
      for (let k = 0; k < this.barEls.length; k++) {
        const h = Math.round((arr[k] / max) * 100);
        this.barEls[k].style.height = h + '%';
        this.barEls[k].title = String(arr[k]);
        this.barEls[k].className = 'bar';
      }
      if (frame.marks) {
        for (const m of frame.marks) {
          const el = this.barEls[m.i];
          if (el) el.classList.add(m.cls);
        }
      }
      if (frame.done) {
        for (const b of this.barEls) b.classList.add('sorted');
      }

      // incremental step list
      for (let idx = this.stepEls.length; idx <= this.i && idx < this.frames.length; idx++) {
        const div = document.createElement('div');
        div.className = 'step';
        div.innerHTML = '<span class="n">' + (idx + 1) + '</span>' + esc(this.frames[idx].text);
        this.el.list.appendChild(div);
        this.stepEls[idx] = div;
      }
      this.stepEls.forEach(function (el, idx) {
        if (el) el.classList.toggle('active', idx === this.i);
      }, this);
      this.scrollActiveStep();
      this.el.count.textContent = this.i + 1 + ' / ' + this.frames.length;
    },

    // прокручиваем только панель этапов, страницу не трогаем
    scrollActiveStep() {
      const list = this.el.list;
      const active = this.stepEls[this.i];
      if (!list || !active) return;
      const top = active.offsetTop;
      const bottom = top + active.offsetHeight;
      if (top < list.scrollTop) {
        list.scrollTop = top;
      } else if (bottom > list.scrollTop + list.clientHeight) {
        list.scrollTop = bottom - list.clientHeight;
      }
    }
  };
})();