(function () {
  function doneFrame(arr) {
    const marks = [];
    for (let i = 0; i < arr.length; i++) marks.push({ i: i, cls: 'sorted' });
    return { arr: arr.slice(), text: 'Сортировка завершена', marks: marks, done: true };
  }

  function sortedMarks(set) {
    const out = [];
    set.forEach(function (i) { out.push({ i: i, cls: 'sorted' }); });
    return out;
  }

  window.genBubble = function (arr) {
    const a = arr.slice();
    const frames = [{ arr: a.slice(), text: 'Исходный массив', marks: [] }];
    const sorted = new Set();
    const n = a.length;

    for (let i = 0; i < n - 1; i++) {
      const last = n - 1 - i;
      let swapped = false;
      for (let j = 0; j < last; j++) {
        frames.push({
          arr: a.slice(),
          text: 'Сравниваем элементы ' + a[j] + ' и ' + a[j + 1],
          marks: sortedMarks(sorted).concat([{ i: j, cls: 'comp' }, { i: j + 1, cls: 'comp' }])
        });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          frames.push({
            arr: a.slice(),
            text: 'Элемент ' + a[j + 1] + ' больше — меняем местами, ' + a[j] + ' «всплывает» вправо',
            marks: sortedMarks(sorted).concat([{ i: j, cls: 'swap' }, { i: j + 1, cls: 'swap' }])
          });
          swapped = true;
        }
      }
      sorted.add(last);
    }
    sorted.add(0);
    frames.push(doneFrame(a));
    return frames;
  };

  window.genSelection = function (arr) {
    const a = arr.slice();
    const frames = [{ arr: a.slice(), text: 'Исходный массив', marks: [] }];
    const sorted = new Set();
    const n = a.length;

    for (let i = 0; i < n - 1; i++) {
      let min = i;
      frames.push({
        arr: a.slice(),
        text: 'Ищем минимум среди оставшихся, начиная с индекса ' + i,
        marks: sortedMarks(sorted).concat([{ i: i, cls: 'pivot' }])
      });
      for (let j = i + 1; j < n; j++) {
        frames.push({
          arr: a.slice(),
          text: 'Сравниваем ' + a[j] + ' с текущим минимумом ' + a[min],
          marks: sortedMarks(sorted).concat([{ i: j, cls: 'comp' }, { i: min, cls: 'pivot' }])
        });
        if (a[j] < a[min]) {
          min = j;
          frames.push({
            arr: a.slice(),
            text: 'Найден новый минимум: ' + a[min] + ' на индексе ' + min,
            marks: sortedMarks(sorted).concat([{ i: min, cls: 'pivot' }])
          });
        }
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        frames.push({
          arr: a.slice(),
          text: 'Меняем местами: минимум ' + a[i] + ' занимает позицию ' + i,
          marks: sortedMarks(sorted).concat([{ i: i, cls: 'swap' }, { i: min, cls: 'swap' }])
        });
      } else {
        frames.push({
          arr: a.slice(),
          text: 'Минимум уже на своём месте',
          marks: sortedMarks(sorted).concat([{ i: i, cls: 'pivot' }])
        });
      }
      sorted.add(i);
    }
    sorted.add(n - 1);
    frames.push(doneFrame(a));
    return frames;
  };

  window.genInsertion = function (arr) {
    const a = arr.slice();
    const frames = [{ arr: a.slice(), text: 'Исходный массив', marks: [] }];
    const n = a.length;

    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      frames.push({
        arr: a.slice(),
        text: 'Берём элемент ' + key + ' (индекс ' + i + ') и вставляем его в отсортированную часть',
        marks: [{ i: i, cls: 'pivot' }]
      });
      while (j >= 0 && a[j] > key) {
        frames.push({
          arr: a.slice(),
          text: a[j] + ' больше ' + key + ' — сдвигаем его вправо',
          marks: [{ i: j, cls: 'swap' }, { i: j + 1, cls: 'comp' }]
        });
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = key;
      frames.push({
        arr: a.slice(),
        text: 'Вставляем ' + key + ' на позицию ' + (j + 1),
        marks: [{ i: j + 1, cls: 'pivot' }]
      });
    }
    frames.push(doneFrame(a));
    return frames;
  };

  window.genQuick = function (arr) {
    const a = arr.slice();
    const sorted = new Set();
    const frames = [{ arr: a.slice(), text: 'Исходный массив', marks: [] }];

    function qs(lo, hi) {
      if (lo > hi) return;
      if (lo === hi) {
        sorted.add(lo);
        return;
      }
      const pivotVal = a[hi];
      frames.push({
        arr: a.slice(),
        text: 'Опорный элемент (pivot): ' + pivotVal + ' на индексе ' + hi,
        marks: sortedMarks(sorted).concat([{ i: hi, cls: 'pivot' }])
      });
      let wall = lo;
      for (let j = lo; j <= hi - 1; j++) {
        frames.push({
          arr: a.slice(),
          text: 'Сравниваем ' + a[j] + ' с опорным ' + pivotVal,
          marks: sortedMarks(sorted).concat([{ i: j, cls: 'comp' }, { i: hi, cls: 'pivot' }])
        });
        if (a[j] < pivotVal) {
          if (wall !== j) {
            [a[wall], a[j]] = [a[j], a[wall]];
            frames.push({
              arr: a.slice(),
              text: a[wall] + ' меньше опорного — меняем местами с ' + a[j],
              marks: sortedMarks(sorted).concat([{ i: wall, cls: 'swap' }, { i: j, cls: 'swap' }, { i: hi, cls: 'pivot' }])
            });
          }
          wall++;
        }
      }
      [a[wall], a[hi]] = [a[hi], a[wall]];
      frames.push({
        arr: a.slice(),
        text: 'Ставим опорный ' + pivotVal + ' на его место (индекс ' + wall + ')',
        marks: sortedMarks(sorted).concat([{ i: wall, cls: 'pivot' }, { i: hi, cls: 'swap' }])
      });
      sorted.add(wall);
      qs(lo, wall - 1);
      qs(wall + 1, hi);
    }

    qs(0, a.length - 1);
    frames.push(doneFrame(a));
    return frames;
  };
})();