/*! portal-vue v1.0.7 | Licence: MIT (c) Nicolas Udy */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('VueDeviceQueries', factory) :
	(global.VueDeviceQueries = factory());
}(this, (function () { 'use strict';

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

var index = {
  install: function install(Vue, queries) {
    // reactive store for media-queries
    var DeviceVM = new Vue({
      data: function data() {
        return {
          devices: {}
        };
      },


      methods: {
        addDevice: function addDevice(name, active) {
          var _this = this;

          this.$set(this.devices, name, active);

          return function (_ref) {
            var matches = _ref.matches;

            _this.devices[name] = matches;
          };
        }
      }
    });

    Object.keys(queries).forEach(function (name) {
      var query = matchMedia('(' + queries[name] + ')');
      var update = DeviceVM.addDevice(name, query.matches);
      query.addListener(update);
    });

    // only make device states available app wide
    Vue.prototype.$device = DeviceVM.devices;
  }
};

return index;

})));

//# sourceMappingURL=index.js.map
