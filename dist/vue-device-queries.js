var matchMedia = (function () {
'use strict';

var createDevice = (function () {
  var node = document.createElement('div');
  var style = document.createElement('style');

  node.id = 'match-media-node';
  style.innerHTML = '#match-media-node {\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    bottom: 100%;\n    overflow: scroll;\n  }';

  document.head.appendChild(style);
  document.body.insertBefore(node, document.body.children[0]);

  return {
    get width() {
      return node.clientWidth;
    },
    get height() {
      return node.clientHeight;
    },
    get orientation() {
      return node.clientHeight > node.clientWidth ? 'portrait' : 'landscape';
    },
    get fontSize() {
      return window.getComputedStyle(document.documentElement).getPropertyValue('font-size');
    }
  };
});

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var createHandler = (function (feature, value, device) {
  if (feature === 'orientation') return function () {
    return value === device.orientation;
  };

  var _feature$split$revers = feature.split('-').reverse(),
      _feature$split$revers2 = slicedToArray(_feature$split$revers, 2),
      prop = _feature$split$revers2[0],
      limit = _feature$split$revers2[1];

  var parseValue = ~value.indexOf('em') ? function () {
    return parseFloat(value) * device.fontSize;
  } : function () {
    return parseFloat(value);
  };

  return !limit ? function () {
    return parseValue() === device[prop];
  } : limit === 'min' ? function () {
    return parseValue() < device[prop];
  } : function () {
    return parseValue() > device[prop];
  };
});

// match media fallback using resize event
var matchMediaFallback = function matchMediaFallback() {
  var listeners = [];
  var idle = true;

  var device = createDevice();

  var parseQuery = function parseQuery(queryString) {
    var _queryString$replace$ = queryString.replace(/[()\s]/g, '').split(':'),
        _queryString$replace$2 = slicedToArray(_queryString$replace$, 2),
        feature = _queryString$replace$2[0],
        value = _queryString$replace$2[1];

    return createHandler(feature, value, device);
  };

  window.addEventListener('resize', function () {
    // back out if window is still resizing
    if (!idle) return;
    idle = false;

    var width = device.width;
    var height = device.height;

    var timer = setInterval(function () {
      if (width !== device.width || height !== device.height) {
        // still resizing, update sizes
        width = device.width;
        height = device.height;
      } else {
        // cancel the timer and call each handler
        clearTimeout(timer);
        listeners.forEach(function (handler) {
          return handler();
        });
        idle = true;
      }
    }, 60);
  });

  return function (queryString) {
    var query = parseQuery(queryString);

    // return object must replicate native matchMedia API
    return {
      get matches() {
        return query();
      },
      addListener: function addListener(responder) {
        var _this = this;

        listeners.push(function () {
          return responder(_this);
        });
      }
    };
  };
};

var matchMedia = window.matchMedia || matchMediaFallback();

return matchMedia;

}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gtbWVkaWEuanMiLCJzb3VyY2VzIjpbInNyYy9mYWN0b3JpZXMvZGV2aWNlLmpzIiwic3JjL2ZhY3Rvcmllcy9oYW5kbGVyLmpzIiwic3JjL21hdGNoLW1lZGlhLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuXG4gIG5vZGUuaWQgPSAnbWF0Y2gtbWVkaWEtbm9kZSdcbiAgc3R5bGUuaW5uZXJIVE1MID0gYCNtYXRjaC1tZWRpYS1ub2RlIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGJvdHRvbTogMTAwJTtcbiAgICBvdmVyZmxvdzogc2Nyb2xsO1xuICB9YFxuXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKG5vZGUsIGRvY3VtZW50LmJvZHkuY2hpbGRyZW5bMF0pXG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgd2lkdGgoKSB7XG4gICAgICByZXR1cm4gbm9kZS5jbGllbnRXaWR0aFxuICAgIH0sXG4gICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgIHJldHVybiBub2RlLmNsaWVudEhlaWdodFxuICAgIH0sXG4gICAgZ2V0IG9yaWVudGF0aW9uKCkge1xuICAgICAgcmV0dXJuIChub2RlLmNsaWVudEhlaWdodCA+IG5vZGUuY2xpZW50V2lkdGgpXG4gICAgICAgID8gJ3BvcnRyYWl0J1xuICAgICAgICA6ICdsYW5kc2NhcGUnXG4gICAgfSxcbiAgICBnZXQgZm9udFNpemUoKSB7XG4gICAgICByZXR1cm4gd2luZG93XG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtc2l6ZScpXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCAoZmVhdHVyZSwgdmFsdWUsIGRldmljZSkgPT4ge1xuICBpZiAoZmVhdHVyZSA9PT0gJ29yaWVudGF0aW9uJykgcmV0dXJuICgpID0+IHZhbHVlID09PSBkZXZpY2Uub3JpZW50YXRpb25cblxuICBsZXQgW3Byb3AsIGxpbWl0XSA9IGZlYXR1cmUuc3BsaXQoJy0nKS5yZXZlcnNlKClcblxuICBjb25zdCBwYXJzZVZhbHVlID0gKH52YWx1ZS5pbmRleE9mKCdlbScpKVxuICAgID8gKCkgPT4gcGFyc2VGbG9hdCh2YWx1ZSkgKiBkZXZpY2UuZm9udFNpemVcbiAgICA6ICgpID0+IHBhcnNlRmxvYXQodmFsdWUpXG5cbiAgcmV0dXJuICghbGltaXQpID8gKCkgPT4gcGFyc2VWYWx1ZSgpID09PSBkZXZpY2VbcHJvcF1cbiAgICA6IChsaW1pdCA9PT0gJ21pbicpID8gKCkgPT4gcGFyc2VWYWx1ZSgpIDwgZGV2aWNlW3Byb3BdXG4gICAgOiAoKSA9PiBwYXJzZVZhbHVlKCkgPiBkZXZpY2VbcHJvcF1cbn1cbiIsImltcG9ydCB7IGNyZWF0ZURldmljZSwgY3JlYXRlSGFuZGxlciB9IGZyb20gJy4vZmFjdG9yaWVzJ1xuXG4vLyBtYXRjaCBtZWRpYSBmYWxsYmFjayB1c2luZyByZXNpemUgZXZlbnRcbmNvbnN0IG1hdGNoTWVkaWFGYWxsYmFjayA9ICgpID0+IHtcbiAgbGV0IGxpc3RlbmVycyA9IFtdXG4gIGxldCBpZGxlID0gdHJ1ZVxuXG4gIGNvbnN0IGRldmljZSA9IGNyZWF0ZURldmljZSgpXG5cbiAgY29uc3QgcGFyc2VRdWVyeSA9IChxdWVyeVN0cmluZykgPT4ge1xuICAgIGxldCBbZmVhdHVyZSwgdmFsdWVdID0gcXVlcnlTdHJpbmcucmVwbGFjZSgvWygpXFxzXS9nLCAnJykuc3BsaXQoJzonKVxuICAgIHJldHVybiBjcmVhdGVIYW5kbGVyKGZlYXR1cmUsIHZhbHVlLCBkZXZpY2UpXG4gIH1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgIC8vIGJhY2sgb3V0IGlmIHdpbmRvdyBpcyBzdGlsbCByZXNpemluZ1xuICAgIGlmICghaWRsZSkgcmV0dXJuO1xuICAgIGlkbGUgPSBmYWxzZVxuXG4gICAgbGV0IHdpZHRoID0gZGV2aWNlLndpZHRoXG4gICAgbGV0IGhlaWdodCA9IGRldmljZS5oZWlnaHRcblxuICAgIGxldCB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICh3aWR0aCAhPT0gZGV2aWNlLndpZHRoIHx8IGhlaWdodCAhPT0gZGV2aWNlLmhlaWdodCkge1xuICAgICAgICAvLyBzdGlsbCByZXNpemluZywgdXBkYXRlIHNpemVzXG4gICAgICAgIHdpZHRoID0gZGV2aWNlLndpZHRoXG4gICAgICAgIGhlaWdodCA9IGRldmljZS5oZWlnaHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNhbmNlbCB0aGUgdGltZXIgYW5kIGNhbGwgZWFjaCBoYW5kbGVyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2goaGFuZGxlciA9PiBoYW5kbGVyKCkpXG4gICAgICAgIGlkbGUgPSB0cnVlXG4gICAgICB9XG4gICAgfSwgNjApXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHF1ZXJ5U3RyaW5nKSB7XG4gICAgY29uc3QgcXVlcnkgPSBwYXJzZVF1ZXJ5KHF1ZXJ5U3RyaW5nKVxuXG4gICAgLy8gcmV0dXJuIG9iamVjdCBtdXN0IHJlcGxpY2F0ZSBuYXRpdmUgbWF0Y2hNZWRpYSBBUElcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0IG1hdGNoZXMoKSB7XG4gICAgICAgIHJldHVybiBxdWVyeSgpXG4gICAgICB9LFxuICAgICAgYWRkTGlzdGVuZXIocmVzcG9uZGVyKSB7XG4gICAgICAgIGxpc3RlbmVycy5wdXNoKCgpID0+IHJlc3BvbmRlcih0aGlzKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgbWF0Y2hNZWRpYSA9IHdpbmRvdy5tYXRjaE1lZGlhIHx8IG1hdGNoTWVkaWFGYWxsYmFjaygpXG5cbmV4cG9ydCB7IG1hdGNoTWVkaWEgYXMgZGVmYXVsdCB9XG4iXSwibmFtZXMiOlsibm9kZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiaWQiLCJpbm5lckhUTUwiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJib2R5IiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGRyZW4iLCJ3aWR0aCIsImNsaWVudFdpZHRoIiwiaGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJmb250U2l6ZSIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJkb2N1bWVudEVsZW1lbnQiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiZmVhdHVyZSIsInZhbHVlIiwiZGV2aWNlIiwic3BsaXQiLCJyZXZlcnNlIiwicHJvcCIsImxpbWl0IiwicGFyc2VWYWx1ZSIsImluZGV4T2YiLCJwYXJzZUZsb2F0IiwibWF0Y2hNZWRpYUZhbGxiYWNrIiwibGlzdGVuZXJzIiwiaWRsZSIsImNyZWF0ZURldmljZSIsInBhcnNlUXVlcnkiLCJxdWVyeVN0cmluZyIsInJlcGxhY2UiLCJjcmVhdGVIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRpbWVyIiwic2V0SW50ZXJ2YWwiLCJmb3JFYWNoIiwiaGFuZGxlciIsInF1ZXJ5IiwibWF0Y2hlcyIsInJlc3BvbmRlciIsInB1c2giLCJtYXRjaE1lZGlhIl0sIm1hcHBpbmdzIjoiOzs7QUFBQSxvQkFBZSxZQUFNO01BQ2JBLE9BQU9DLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjtNQUNNQyxRQUFRRixTQUFTQyxhQUFULENBQXVCLE9BQXZCLENBQWQ7O09BRUtFLEVBQUwsR0FBVSxrQkFBVjtRQUNNQyxTQUFOOztXQVFTQyxJQUFULENBQWNDLFdBQWQsQ0FBMEJKLEtBQTFCO1dBQ1NL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
