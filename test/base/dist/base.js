webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("j1ja");
module.exports = __webpack_require__("auLG");


/***/ }),

/***/ "QBoz":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import { default as lig } from '@@/dev/linger.js'
// import { default as lig } from '@/index.js'
// var lig = require('@@/prod/linger.js')
// import test from '@@/prod/test.js'

var lig =  false ? require('@/index.js') : __webpack_require__("bQ/p");

console.log(Object({"process.env.NODE_ENV":"production","MODE":"production","DEBUG":false}));

var Application = function () {
    function Application(canvas) {
        _classCallCheck(this, Application);

        // console.log(test)
        lig.init(canvas);

        var scene = lig.createScene();
        if (!scene) {
            return;
        }

        Object.assign(this, {
            scene: scene,
            canvas: canvas
        });
    }

    _createClass(Application, [{
        key: 'start',
        value: function start() {
            var cameraNode = lig.createSceneNode({
                name: 'mainCamera',
                position: [0, 0, 0],
                mounted: {
                    type: lig.Camera.static.type,
                    data: lig.createCamera(this.canvas)
                }
            });
            this.scene.addSceneNode(cameraNode);

            var simpleMesh = lig.createSimpleMesh({
                vertices: [-1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1],
                indices: [0, 1, 2, 0, 2, 3, 3, 2, 6, 3, 6, 7, 7, 6, 5, 7, 5, 4, 4, 5, 1, 4, 1, 0, 0, 3, 7, 0, 7, 4, 2, 1, 5, 2, 5, 6],
                mode: 'TRIANGLES'
            });

            var node1 = lig.createSceneNode({
                name: 'testNode1',
                position: [0, 1, -13.7],
                mounted: {
                    type: lig.SimpleMesh.static.type,
                    data: simpleMesh
                }
            });
            node1.rotateAxisAngle('y', 90);
            node1.rotateAxisAngle('x', 45);
            // node1.setScale(3,3,3)
            // node1.translate(0, 3, 0)
            this.scene.addSceneNode(node1);

            // const node3 = lig.createSceneNode({
            //     name: 'testNode3',
            //     position: [1,0,-9.9],
            //     mounted: {
            //         type: lig.SimpleMesh.static.type,
            //         data: simpleMesh
            //     }
            // })
            // this.scene.addSceneNode(node3)

            this.scene.update();
        }
    }]);

    return Application;
}();

exports.default = Application;

/***/ }),

/***/ "auLG":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var main = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var canvas, app;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        canvas = document.getElementById('canvas');
                        app = new _app2.default(canvas);

                        app.start();

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function main() {
        return _ref.apply(this, arguments);
    };
}();

var _app = __webpack_require__("QBoz");

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

main();

/***/ })

},[0]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90ZXN0L2Jhc2UvYXBwLmpzIiwid2VicGFjazovLy8uL3Rlc3QvYmFzZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJsaWciLCJyZXF1aXJlIiwiY29uc29sZSIsImxvZyIsIkFwcGxpY2F0aW9uIiwiY2FudmFzIiwiaW5pdCIsInNjZW5lIiwiY3JlYXRlU2NlbmUiLCJPYmplY3QiLCJhc3NpZ24iLCJjYW1lcmFOb2RlIiwiY3JlYXRlU2NlbmVOb2RlIiwibmFtZSIsInBvc2l0aW9uIiwibW91bnRlZCIsInR5cGUiLCJDYW1lcmEiLCJzdGF0aWMiLCJkYXRhIiwiY3JlYXRlQ2FtZXJhIiwiYWRkU2NlbmVOb2RlIiwic2ltcGxlTWVzaCIsImNyZWF0ZVNpbXBsZU1lc2giLCJ2ZXJ0aWNlcyIsImluZGljZXMiLCJtb2RlIiwibm9kZTEiLCJTaW1wbGVNZXNoIiwicm90YXRlQXhpc0FuZ2xlIiwidXBkYXRlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFwcCIsInN0YXJ0IiwibWFpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQU1BLE1BQU0sU0FBY0MsUUFBUSxZQUFSLENBQWQsR0FBc0MsbUJBQUFBLENBQVEsTUFBUixDQUFsRDs7QUFFQUMsUUFBUUMsR0FBUixDQUFZLCtFQUFaOztJQUVxQkMsVztBQUNqQix5QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNoQjtBQUNBTCxZQUFJTSxJQUFKLENBQVNELE1BQVQ7O0FBRUEsWUFBTUUsUUFBUVAsSUFBSVEsV0FBSixFQUFkO0FBQ0EsWUFBSSxDQUFDRCxLQUFMLEVBQVk7QUFDUjtBQUNIOztBQUVERSxlQUFPQyxNQUFQLENBQWMsSUFBZCxFQUFvQjtBQUNoQkgsd0JBRGdCO0FBRWhCRjtBQUZnQixTQUFwQjtBQUlIOzs7O2dDQUVPO0FBQ0osZ0JBQU1NLGFBQWFYLElBQUlZLGVBQUosQ0FBb0I7QUFDbkNDLHNCQUFNLFlBRDZCO0FBRW5DQywwQkFBVSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUZ5QjtBQUduQ0MseUJBQVM7QUFDTEMsMEJBQU1oQixJQUFJaUIsTUFBSixDQUFXQyxNQUFYLENBQWtCRixJQURuQjtBQUVMRywwQkFBTW5CLElBQUlvQixZQUFKLENBQWlCLEtBQUtmLE1BQXRCO0FBRkQ7QUFIMEIsYUFBcEIsQ0FBbkI7QUFRQSxpQkFBS0UsS0FBTCxDQUFXYyxZQUFYLENBQXdCVixVQUF4Qjs7QUFFQSxnQkFBTVcsYUFBYXRCLElBQUl1QixnQkFBSixDQUFxQjtBQUNwQ0MsMEJBQVUsQ0FDTixDQUFDLENBREssRUFDRCxDQURDLEVBQ0UsQ0FBQyxDQURILEVBRU4sQ0FBQyxDQUZLLEVBRUYsQ0FBQyxDQUZDLEVBRUUsQ0FBQyxDQUZILEVBR04sQ0FBQyxDQUhLLEVBR0YsQ0FBQyxDQUhDLEVBR0csQ0FISCxFQUlOLENBQUMsQ0FKSyxFQUlELENBSkMsRUFJRyxDQUpILEVBS04sQ0FMTSxFQUtGLENBTEUsRUFLQyxDQUFDLENBTEYsRUFNTixDQU5NLEVBTUgsQ0FBQyxDQU5FLEVBTUMsQ0FBQyxDQU5GLEVBT04sQ0FQTSxFQU9ILENBQUMsQ0FQRSxFQU9FLENBUEYsRUFRTixDQVJNLEVBUUYsQ0FSRSxFQVFFLENBUkYsQ0FEMEI7QUFXcENDLHlCQUFTLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLENBQVQsRUFBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsRUFBcUIsQ0FBckIsRUFBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsRUFBMkIsQ0FBM0IsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakMsRUFBbUMsQ0FBbkMsRUFBcUMsQ0FBckMsRUFBdUMsQ0FBdkMsRUFBeUMsQ0FBekMsRUFBMkMsQ0FBM0MsRUFBNkMsQ0FBN0MsRUFBK0MsQ0FBL0MsRUFBaUQsQ0FBakQsRUFBbUQsQ0FBbkQsRUFBcUQsQ0FBckQsRUFBdUQsQ0FBdkQsRUFBeUQsQ0FBekQsRUFBMkQsQ0FBM0QsRUFBNkQsQ0FBN0QsRUFBK0QsQ0FBL0QsRUFBaUUsQ0FBakUsRUFBbUUsQ0FBbkUsRUFBcUUsQ0FBckUsRUFBdUUsQ0FBdkUsQ0FYMkI7QUFZcENDLHNCQUFNO0FBWjhCLGFBQXJCLENBQW5COztBQWVBLGdCQUFNQyxRQUFRM0IsSUFBSVksZUFBSixDQUFvQjtBQUM5QkMsc0JBQU0sV0FEd0I7QUFFOUJDLDBCQUFVLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFDLElBQU4sQ0FGb0I7QUFHOUJDLHlCQUFTO0FBQ0xDLDBCQUFNaEIsSUFBSTRCLFVBQUosQ0FBZVYsTUFBZixDQUFzQkYsSUFEdkI7QUFFTEcsMEJBQU1HO0FBRkQ7QUFIcUIsYUFBcEIsQ0FBZDtBQVFBSyxrQkFBTUUsZUFBTixDQUFzQixHQUF0QixFQUEyQixFQUEzQjtBQUNBRixrQkFBTUUsZUFBTixDQUFzQixHQUF0QixFQUEyQixFQUEzQjtBQUNBO0FBQ0E7QUFDQSxpQkFBS3RCLEtBQUwsQ0FBV2MsWUFBWCxDQUF3Qk0sS0FBeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFLcEIsS0FBTCxDQUFXdUIsTUFBWDtBQUNIOzs7Ozs7a0JBbkVnQjFCLFc7Ozs7Ozs7Ozs7O3VFQ1ByQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDVUMsOEJBRFYsR0FDbUIwQixTQUFTQyxjQUFULENBQXdCLFFBQXhCLENBRG5CO0FBRVVDLDJCQUZWLEdBRWdCLGtCQUFRNUIsTUFBUixDQUZoQjs7QUFHSTRCLDRCQUFJQyxLQUFKOztBQUhKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEs7O29CQUFlQyxJOzs7OztBQUZmOzs7Ozs7OztBQVFBQSxPIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBkZWZhdWx0IGFzIGxpZyB9IGZyb20gJ0BAL2Rldi9saW5nZXIuanMnXG4vLyBpbXBvcnQgeyBkZWZhdWx0IGFzIGxpZyB9IGZyb20gJ0AvaW5kZXguanMnXG4vLyB2YXIgbGlnID0gcmVxdWlyZSgnQEAvcHJvZC9saW5nZXIuanMnKVxuLy8gaW1wb3J0IHRlc3QgZnJvbSAnQEAvcHJvZC90ZXN0LmpzJ1xuXG5jb25zdCBsaWcgPSBCVUlMRC5ERUJVRyA/IHJlcXVpcmUoJ0AvaW5kZXguanMnKSA6IHJlcXVpcmUoJ0BAL3Byb2QvbGluZ2VyLmpzJylcblxuY29uc29sZS5sb2coQlVJTEQpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcGxpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGVzdClcbiAgICAgICAgbGlnLmluaXQoY2FudmFzKVxuXG4gICAgICAgIGNvbnN0IHNjZW5lID0gbGlnLmNyZWF0ZVNjZW5lKClcbiAgICAgICAgaWYgKCFzY2VuZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgICAgICAgIHNjZW5lLFxuICAgICAgICAgICAgY2FudmFzXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IGNhbWVyYU5vZGUgPSBsaWcuY3JlYXRlU2NlbmVOb2RlKHtcbiAgICAgICAgICAgIG5hbWU6ICdtYWluQ2FtZXJhJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBbMCwwLDBdLFxuICAgICAgICAgICAgbW91bnRlZDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IGxpZy5DYW1lcmEuc3RhdGljLnR5cGUsXG4gICAgICAgICAgICAgICAgZGF0YTogbGlnLmNyZWF0ZUNhbWVyYSh0aGlzLmNhbnZhcyksXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkU2NlbmVOb2RlKGNhbWVyYU5vZGUpXG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTWVzaCA9IGxpZy5jcmVhdGVTaW1wbGVNZXNoKHtcbiAgICAgICAgICAgIHZlcnRpY2VzOiBbXG4gICAgICAgICAgICAgICAgLTEsICAxLCAtMSxcbiAgICAgICAgICAgICAgICAtMSwgLTEsIC0xLFxuICAgICAgICAgICAgICAgIC0xLCAtMSwgIDEsXG4gICAgICAgICAgICAgICAgLTEsICAxLCAgMSxcbiAgICAgICAgICAgICAgICAxLCAgMSwgLTEsXG4gICAgICAgICAgICAgICAgMSwgLTEsIC0xLFxuICAgICAgICAgICAgICAgIDEsIC0xLCAgMSxcbiAgICAgICAgICAgICAgICAxLCAgMSwgIDEsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaW5kaWNlczogWzAsMSwyLDAsMiwzLDMsMiw2LDMsNiw3LDcsNiw1LDcsNSw0LDQsNSwxLDQsMSwwLDAsMyw3LDAsNyw0LDIsMSw1LDIsNSw2XSxcbiAgICAgICAgICAgIG1vZGU6ICdUUklBTkdMRVMnXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3Qgbm9kZTEgPSBsaWcuY3JlYXRlU2NlbmVOb2RlKHtcbiAgICAgICAgICAgIG5hbWU6ICd0ZXN0Tm9kZTEnLFxuICAgICAgICAgICAgcG9zaXRpb246IFswLDEsLTEzLjddLFxuICAgICAgICAgICAgbW91bnRlZDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IGxpZy5TaW1wbGVNZXNoLnN0YXRpYy50eXBlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHNpbXBsZU1lc2hcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgbm9kZTEucm90YXRlQXhpc0FuZ2xlKCd5JywgOTApXG4gICAgICAgIG5vZGUxLnJvdGF0ZUF4aXNBbmdsZSgneCcsIDQ1KVxuICAgICAgICAvLyBub2RlMS5zZXRTY2FsZSgzLDMsMylcbiAgICAgICAgLy8gbm9kZTEudHJhbnNsYXRlKDAsIDMsIDApXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkU2NlbmVOb2RlKG5vZGUxKVxuXG4gICAgICAgIC8vIGNvbnN0IG5vZGUzID0gbGlnLmNyZWF0ZVNjZW5lTm9kZSh7XG4gICAgICAgIC8vICAgICBuYW1lOiAndGVzdE5vZGUzJyxcbiAgICAgICAgLy8gICAgIHBvc2l0aW9uOiBbMSwwLC05LjldLFxuICAgICAgICAvLyAgICAgbW91bnRlZDoge1xuICAgICAgICAvLyAgICAgICAgIHR5cGU6IGxpZy5TaW1wbGVNZXNoLnN0YXRpYy50eXBlLFxuICAgICAgICAvLyAgICAgICAgIGRhdGE6IHNpbXBsZU1lc2hcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSlcbiAgICAgICAgLy8gdGhpcy5zY2VuZS5hZGRTY2VuZU5vZGUobm9kZTMpXG5cbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGUoKVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3Rlc3QvYmFzZS9hcHAuanMiLCJpbXBvcnQgQXBwIGZyb20gJy4vYXBwJ1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoY2FudmFzKVxuICAgIGFwcC5zdGFydCgpXG59XG5cbm1haW4oKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdGVzdC9iYXNlL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==