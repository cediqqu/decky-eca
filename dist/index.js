const manifest = {"name":"E.C.A"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const call = api.call;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaXbox (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M369.9 318.2c44.3 54.3 64.7 98.8 54.4 118.7-7.9 15.1-56.7 44.6-92.6 55.9-29.6 9.3-68.4 13.3-100.4 10.2-38.2-3.7-76.9-17.4-110.1-39C93.3 445.8 87 438.3 87 423.4c0-29.9 32.9-82.3 89.2-142.1 32-33.9 76.5-73.7 81.4-72.6 9.4 2.1 84.3 75.1 112.3 109.5zM188.6 143.8c-29.7-26.9-58.1-53.9-86.4-63.4-15.2-5.1-16.3-4.8-28.7 8.1-29.2 30.4-53.5 79.7-60.3 122.4-5.4 34.2-6.1 43.8-4.2 60.5 5.6 50.5 17.3 85.4 40.5 120.9 9.5 14.6 12.1 17.3 9.3 9.9-4.2-11-.3-37.5 9.5-64 14.3-39 53.9-112.9 120.3-194.4zm311.6 63.5C483.3 127.3 432.7 77 425.6 77c-7.3 0-24.2 6.5-36 13.9-23.3 14.5-41 31.4-64.3 52.8C367.7 197 427.5 283.1 448.2 346c6.8 20.7 9.7 41.1 7.4 52.3-1.7 8.5-1.7 8.5 1.4 4.6 6.1-7.7 19.9-31.3 25.4-43.5 7.4-16.2 15-40.2 18.6-58.7 4.3-22.5 3.9-70.8-.8-93.4zM141.3 43C189 40.5 251 77.5 255.6 78.4c.7.1 10.4-4.2 21.6-9.7 63.9-31.1 94-25.8 107.4-25.2-63.9-39.3-152.7-50-233.9-11.7-23.4 11.1-24 11.9-9.4 11.2z"},"child":[]}]})(props);
}function FaUsb (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M641.5 256c0 3.1-1.7 6.1-4.5 7.5L547.9 317c-1.4.8-2.8 1.4-4.5 1.4-1.4 0-3.1-.3-4.5-1.1-2.8-1.7-4.5-4.5-4.5-7.8v-35.6H295.7c25.3 39.6 40.5 106.9 69.6 106.9H392V354c0-5 3.9-8.9 8.9-8.9H490c5 0 8.9 3.9 8.9 8.9v89.1c0 5-3.9 8.9-8.9 8.9h-89.1c-5 0-8.9-3.9-8.9-8.9v-26.7h-26.7c-75.4 0-81.1-142.5-124.7-142.5H140.3c-8.1 30.6-35.9 53.5-69 53.5C32 327.3 0 295.3 0 256s32-71.3 71.3-71.3c33.1 0 61 22.8 69 53.5 39.1 0 43.9 9.5 74.6-60.4C255 88.7 273 95.7 323.8 95.7c7.5-20.9 27-35.6 50.4-35.6 29.5 0 53.5 23.9 53.5 53.5s-23.9 53.5-53.5 53.5c-23.4 0-42.9-14.8-50.4-35.6H294c-29.1 0-44.3 67.4-69.6 106.9h310.1v-35.6c0-3.3 1.7-6.1 4.5-7.8 2.8-1.7 6.4-1.4 8.9.3l89.1 53.5c2.8 1.1 4.5 4.1 4.5 7.2z"},"child":[]}]})(props);
}function FaSteam (props) {
  return GenIcon({"attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z"},"child":[]}]})(props);
}function FaPlaystation (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M570.9 372.3c-11.3 14.2-38.8 24.3-38.8 24.3L327 470.2v-54.3l150.9-53.8c17.1-6.1 19.8-14.8 5.8-19.4-13.9-4.6-39.1-3.3-56.2 2.9L327 381.1v-56.4c23.2-7.8 47.1-13.6 75.7-16.8 40.9-4.5 90.9.6 130.2 15.5 44.2 14 49.2 34.7 38 48.9zm-224.4-92.5v-139c0-16.3-3-31.3-18.3-35.6-11.7-3.8-19 7.1-19 23.4v347.9l-93.8-29.8V32c39.9 7.4 98 24.9 129.2 35.4C424.1 94.7 451 128.7 451 205.2c0 74.5-46 102.8-104.5 74.6zM43.2 410.2c-45.4-12.8-53-39.5-32.3-54.8 19.1-14.2 51.7-24.9 51.7-24.9l134.5-47.8v54.5l-96.8 34.6c-17.1 6.1-19.7 14.8-5.8 19.4 13.9 4.6 39.1 3.3 56.2-2.9l46.4-16.9v48.8c-51.6 9.3-101.4 7.3-153.9-10z"},"child":[]}]})(props);
}function FaBluetoothB (props) {
  return GenIcon({"attr":{"viewBox":"0 0 320 512"},"child":[{"tag":"path","attr":{"d":"M196.48 260.023l92.626-103.333L143.125 0v206.33l-86.111-86.111-31.406 31.405 108.061 108.399L25.608 368.422l31.406 31.405 86.111-86.111L145.84 512l148.552-148.644-97.912-103.333zm40.86-102.996l-49.977 49.978-.338-100.295 50.315 50.317zM187.363 313.04l49.977 49.978-50.315 50.316.338-100.294z"},"child":[]}]})(props);
}function FaUndo (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z"},"child":[]}]})(props);
}function FaSyncAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"},"child":[]}]})(props);
}function FaStar (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"},"child":[]}]})(props);
}function FaSlidersH (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M496 384H160v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h80v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h336c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160h-80v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h336v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16C7.2 64 0 71.2 0 80v32c0 8.8 7.2 16 16 16h208v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h208c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16z"},"child":[]}]})(props);
}function FaQuestion (props) {
  return GenIcon({"attr":{"viewBox":"0 0 384 512"},"child":[{"tag":"path","attr":{"d":"M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"},"child":[]}]})(props);
}function FaMinus (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"},"child":[]}]})(props);
}function FaMicrochip (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M416 48v416c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V48c0-26.51 21.49-48 48-48h224c26.51 0 48 21.49 48 48zm96 58v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42V88h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zM30 376h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6z"},"child":[]}]})(props);
}function FaInfoCircle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"},"child":[]}]})(props);
}function FaGamepad (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"},"child":[]}]})(props);
}function FaFileAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 384 512"},"child":[{"tag":"path","attr":{"d":"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"},"child":[]}]})(props);
}function FaExclamationTriangle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"},"child":[]}]})(props);
}function FaDownload (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"},"child":[]}]})(props);
}function FaCog (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"},"child":[]}]})(props);
}function FaChevronRight (props) {
  return GenIcon({"attr":{"viewBox":"0 0 320 512"},"child":[{"tag":"path","attr":{"d":"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"},"child":[]}]})(props);
}function FaChevronDown (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"},"child":[]}]})(props);
}function FaCheck (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"},"child":[]}]})(props);
}function FaBan (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"},"child":[]}]})(props);
}

// ---------------------------------------------------------------------------
//  Paleta (Joy-Con) y utilidades
// ---------------------------------------------------------------------------
const C = {
    azul: "#0AB9E6",
    rojo: "#FF3C28",
    verde: "#32E632",
    violeta: "#B400E6",
    dorado: "#F5C518",
    carbon1: "#262628",
    carbon2: "#141416",
    texto: "#EDEFF2",
    texto2: "#B8BCC2",
    gris: "#8A8F98",
};
function hexA(hex, alfa) {
    const h = hex.replace("#", "");
    const completo = h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    const n = parseInt(completo, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alfa})`;
}
function colorDe(m) {
    switch (m.familia) {
        case "playstation":
            return C.azul;
        case "xbox":
            return C.verde;
        case "switch":
            return C.rojo;
        case "steam":
            return C.violeta;
        default:
            return C.gris;
    }
}
function IconoFamilia(props) {
    switch (props.familia) {
        case "playstation":
            return SP_JSX.jsx(FaPlaystation, { size: props.size });
        case "xbox":
            return SP_JSX.jsx(FaXbox, { size: props.size });
        case "steam":
            return SP_JSX.jsx(FaSteam, { size: props.size });
        case "switch":
        case "integrado":
            return SP_JSX.jsx(FaGamepad, { size: props.size });
        default:
            return SP_JSX.jsx(FaQuestion, { size: props.size });
    }
}
function colorConexion(conexion) {
    if (conexion.startsWith("Bluetooth"))
        return C.azul;
    if (conexion === "USB")
        return C.verde;
    if (conexion.startsWith("Virtual"))
        return C.violeta;
    return C.gris;
}
function macCorta(serie) {
    const partes = (serie || "").split(":");
    if (partes.length >= 2) {
        return `…${partes[partes.length - 2]}:${partes[partes.length - 1]}`;
    }
    return serie;
}
const ESCENARIO_CORTO = {
    nativo: "Nativo",
    steam_input: "Steam Input",
    steam_input_integrado: "Steam Input · integrado",
    solo_integrado: "Solo integrado",
    sin_mandos: "Sin mandos",
};
const INTEGRADO_TXT = {
    ignorar: "no usar",
    primero: "Player 1",
    ultimo: "ultimo jugador",
};
const ESTILOS = `
@keyframes ede-latido {
  0%, 100% { opacity: .88; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
@keyframes ede-aparecer {
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: none; }
}
.ede-estrella { animation: ede-latido 2.6s ease-in-out infinite; }
/* el boton de la celda no necesita padding propio: lo pone la tarjeta */
.ede-celda > div { padding: 0 !important; border-radius: 16px !important; }
/* capa de foco de Steam: mas suave y dentro de la tarjeta */
.ede-zona .gpfocus { background: rgba(255,255,255,0.05) !important; border-radius: 14px !important; }
.ede-zona .gpfocus .ede-tarjeta { outline: 1px solid rgba(10,185,230,0.9); outline-offset: -1px; }
.ede-aparecer { animation: ede-aparecer 150ms ease-out; }
@media (prefers-reduced-motion: reduce) {
  .ede-estrella, .ede-aparecer { animation: none; }
}
`;
// ---------------------------------------------------------------------------
//  Piezas visuales
// ---------------------------------------------------------------------------
/** Icono dentro de un circulo (estilo ajustes de Switch). */
function CirculoIcono(props) {
    const lado = props.lado ?? 26;
    return (SP_JSX.jsx("span", { style: {
            width: `${lado}px`,
            height: `${lado}px`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
            background: hexA(props.color, 0.18),
            border: `1px solid ${hexA(props.color, 0.45)}`,
            color: props.color,
        }, children: props.children }));
}
/** Tarjeta de aviso (icono a la izquierda), como las notificaciones de Switch. */
function Aviso(props) {
    const color = props.tono === "atencion" ? C.rojo : C.azul;
    return (SP_JSX.jsxs("div", { onClick: props.onClick, style: {
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "14px",
            border: "1px solid rgba(128,128,128,0.22)",
            background: "linear-gradient(120deg, rgba(22,22,24,0.92), rgba(30,30,33,0.78))",
            color: C.texto,
            fontSize: "0.78em",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
        }, children: [SP_JSX.jsx(CirculoIcono, { color: color, lado: 26, children: props.tono === "atencion" ? (SP_JSX.jsx(FaExclamationTriangle, { size: 11 })) : (SP_JSX.jsx(FaInfoCircle, { size: 11 })) }), SP_JSX.jsx("div", { style: { minWidth: 0 }, children: props.children })] }));
}
/** Glifo circular tipo prompt de Switch. */
function GlifoA() {
    return (SP_JSX.jsx("span", { style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            background: "#fff",
            color: "#1a1a1a",
            fontSize: "0.62em",
            fontWeight: 800,
            lineHeight: 1,
            flex: "0 0 auto",
        }, children: "A" }));
}
function Chip(props) {
    const color = props.color ?? C.azul;
    return (SP_JSX.jsxs("span", { style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 8px",
            borderRadius: "999px",
            fontSize: "0.66em",
            fontWeight: 700,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            color: props.tenue ? "inherit" : color,
            opacity: props.tenue ? 0.75 : 1,
            border: `1px solid ${props.tenue ? "rgba(128,128,128,0.4)" : hexA(color, 0.5)}`,
            background: props.tenue ? "rgba(128,128,128,0.14)" : hexA(color, 0.14),
        }, children: [props.icono, props.texto] }));
}
function IconoConexion(props) {
    const s = props.size ?? 9;
    if (props.conexion.startsWith("Bluetooth"))
        return SP_JSX.jsx(FaBluetoothB, { size: s });
    if (props.conexion === "USB")
        return SP_JSX.jsx(FaUsb, { size: s });
    if (props.conexion.startsWith("Virtual"))
        return SP_JSX.jsx(FaSteam, { size: s });
    return SP_JSX.jsx(FaMicrochip, { size: s });
}
function IconoTile(props) {
    const color = colorDe(props.m);
    return (SP_JSX.jsx("div", { style: {
            width: `${props.lado}px`,
            height: `${props.lado}px`,
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
            background: `linear-gradient(145deg, ${hexA(color, 0.35)}, ${hexA(color, 0.06)})`,
            border: `1px solid ${hexA(color, 0.5)}`,
            boxShadow: `inset 0 0 10px ${hexA(color, 0.15)}`,
            color,
        }, children: SP_JSX.jsx(IconoFamilia, { familia: props.m.familia, size: props.lado * 0.55 }) }));
}
function estiloBadge(color) {
    return {
        position: "absolute",
        top: "5px",
        right: "5px",
        minWidth: "18px",
        height: "18px",
        padding: "0 4px",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.64em",
        fontWeight: 800,
        lineHeight: 1,
        color,
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${hexA(color, 0.7)}`,
        boxShadow: `0 0 7px ${hexA(color, 0.35)}`,
        boxSizing: "border-box",
    };
}
/** Arriba a la derecha: estrella si es el principal; si no, su jugador. */
function Badge(props) {
    const { m } = props;
    if (m.es_principal) {
        return (SP_JSX.jsx(FaStar, { className: "ede-estrella", style: {
                position: "absolute",
                top: "4px",
                right: "6px",
                color: C.dorado,
                fontSize: "0.88em",
                filter: `drop-shadow(0 0 4px ${hexA(C.dorado, 0.9)})`,
            } }));
    }
    if (m.jugador) {
        return SP_JSX.jsx("div", { style: estiloBadge(C.azul), children: m.jugador });
    }
    return (SP_JSX.jsx("div", { style: { ...estiloBadge(C.gris), width: "18px", padding: 0 }, children: m.clase === "Integrado" ? SP_JSX.jsx(FaBan, { size: 8 }) : SP_JSX.jsx(FaMinus, { size: 8 }) }));
}
function estiloTarjeta(principal, color) {
    return {
        position: "relative",
        borderRadius: "16px",
        boxSizing: "border-box",
        overflow: "hidden",
        color: C.texto,
        border: `1px solid ${principal ? hexA(C.rojo, 0.8) : "rgba(255,255,255,0.10)"}`,
        background: `radial-gradient(130% 100% at 100% 0%, ${hexA(color, 0.22)}, transparent 62%), ` +
            `linear-gradient(155deg, ${C.carbon1}, ${C.carbon2})`,
        boxShadow: principal
            ? `0 0 12px ${hexA(C.rojo, 0.35)}, inset 0 0 14px ${hexA(C.rojo, 0.10)}`
            : "0 1px 3px rgba(0,0,0,0.45)",
        transition: "border-color 180ms ease, box-shadow 180ms ease",
    };
}
// --- tarjeta ancha (1 mando) ----------------------------------------------
function FilaMando(props) {
    const { m, mostrarMac, destello, onClick } = props;
    const color = colorDe(m);
    return (SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: onClick, children: SP_JSX.jsxs("div", { className: "ede-tarjeta", style: {
                ...estiloTarjeta(m.es_principal, color),
                ...(destello
                    ? {
                        border: `1px solid ${C.azul}`,
                        boxShadow: `0 0 16px ${hexA(C.azul, 0.6)}`,
                    }
                    : null),
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 46px 9px 9px",
            }, children: [SP_JSX.jsx(Badge, { m: m }), SP_JSX.jsx(IconoTile, { m: m, lado: 36 }), SP_JSX.jsxs("div", { style: { minWidth: 0 }, children: [SP_JSX.jsxs("div", { style: {
                                display: "flex",
                                alignItems: "baseline",
                                gap: "6px",
                                flexWrap: "wrap",
                            }, children: [m.familia === "desconocido" ? (SP_JSX.jsx("span", { style: { fontWeight: 700, fontSize: "0.95em" }, children: m.sdl || m.nombre || m.clase })) : null, mostrarMac && m.serie ? (SP_JSX.jsx("span", { style: { fontSize: "0.58em", color: C.texto2, opacity: 0.55 }, children: macCorta(m.serie) })) : null] }), SP_JSX.jsx("div", { style: { marginTop: "4px" }, children: SP_JSX.jsx(Chip, { texto: m.conexion, color: colorConexion(m.conexion), icono: SP_JSX.jsx(IconoConexion, { conexion: m.conexion, size: 9 }) }) })] })] }) }));
}
// --- tarjeta cuadrada (2 o mas mandos) -------------------------------------
function MandoCuadrado(props) {
    const { m, mostrarMac, destello, onClick } = props;
    const color = colorDe(m);
    return (SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: onClick, children: SP_JSX.jsxs("div", { className: "ede-tarjeta", style: {
                ...estiloTarjeta(m.es_principal, color),
                ...(destello
                    ? {
                        border: `1px solid ${C.azul}`,
                        boxShadow: `0 0 16px ${hexA(C.azul, 0.6)}`,
                    }
                    : null),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "96px",
                width: "100%",
                padding: 0,
                textAlign: "center",
            }, children: [SP_JSX.jsx(Badge, { m: m }), SP_JSX.jsxs("div", { style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        flex: 1,
                        padding: "10px 5px 5px",
                    }, children: [SP_JSX.jsx(IconoTile, { m: m, lado: 34 }), SP_JSX.jsxs("div", { style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                fontSize: "0.6em",
                                color: colorConexion(m.conexion),
                            }, children: [SP_JSX.jsx(IconoConexion, { conexion: m.conexion, size: 8 }), m.conexion] }), mostrarMac && m.serie ? (SP_JSX.jsx("div", { style: {
                                fontSize: "0.53em",
                                color: C.texto2,
                                opacity: 0.5,
                                lineHeight: 1,
                            }, children: macCorta(m.serie) })) : null] }), m.familia === "desconocido" ? (SP_JSX.jsx("div", { style: {
                        padding: "3px 5px",
                        background: "rgba(0,0,0,0.38)",
                        borderTop: `1px solid ${hexA(color, 0.3)}`,
                        fontSize: "0.64em",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }, children: m.sdl || m.nombre || m.clase })) : null] }) }));
}
function BotonAccion(props) {
    return (SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: props.onClick, children: SP_JSX.jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "4px 8px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(128,128,128,0.18)",
            }, children: [SP_JSX.jsx(CirculoIcono, { color: C.azul, lado: 22, children: props.icono }), SP_JSX.jsx("span", { children: props.texto })] }) }));
}
// --- tarjeta de accion (cuadrada, como las de los mandos) ------------------
function TarjetaAccion(props) {
    const color = props.color ?? C.azul;
    return (SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: props.onClick, children: SP_JSX.jsx("div", { className: "ede-tarjeta", style: {
                ...estiloTarjeta(false, color),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "96px",
                width: "100%",
                padding: 0,
                textAlign: "center",
            }, children: SP_JSX.jsxs("div", { style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    padding: "10px 6px",
                    width: "100%",
                }, children: [SP_JSX.jsx(CirculoIcono, { color: color, lado: 34, children: props.icono }), SP_JSX.jsx("div", { style: { fontSize: "0.68em", fontWeight: 700, lineHeight: 1.15 }, children: props.titulo }), props.detalle ? (SP_JSX.jsx("div", { style: { fontSize: "0.62em", opacity: 0.7, lineHeight: 1.15 }, children: props.detalle })) : null] }) }) }));
}
// --- rejilla de 2 columnas -------------------------------------------------
function Rejilla(props) {
    return (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: {
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "6px",
                width: "100%",
            }, children: props.children }) }));
}
// --- seccion colapsable ----------------------------------------------------
function Seccion(props) {
    const cabecera = (SP_JSX.jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: "9px",
            width: "100%",
        }, children: [SP_JSX.jsx(CirculoIcono, { color: props.color ?? C.azul, lado: 26, children: props.icono }), SP_JSX.jsx("span", { style: { fontWeight: 700 }, children: props.titulo }), props.resumen ? (SP_JSX.jsx("span", { style: {
                    marginLeft: "auto",
                    fontSize: "0.7em",
                    opacity: 0.55,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }, children: props.resumen })) : null, props.onToggle ? (SP_JSX.jsx("span", { style: {
                    marginLeft: props.resumen ? "6px" : "auto",
                    opacity: 0.6,
                    display: "flex",
                    flex: "0 0 auto",
                }, children: props.abierta ? SP_JSX.jsx(FaChevronDown, { size: 10 }) : SP_JSX.jsx(FaChevronRight, { size: 10 }) })) : null] }));
    return (SP_JSX.jsxs(DFL.PanelSection, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: props.onToggle ? (SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: props.onToggle, children: cabecera })) : (cabecera) }), SP_JSX.jsx("div", { style: {
                    height: "1px",
                    background: "rgba(128,128,128,0.16)",
                    margin: "0 6px 6px",
                } }), props.abierta ? (SP_JSX.jsx("div", { className: "ede-aparecer ede-zona", children: props.children })) : null] }));
}
// ---------------------------------------------------------------------------
//  Ventana emergente de texto (paginada: D-pad y dedo)
// ---------------------------------------------------------------------------
const LINEAS_POR_PAGINA = 16;
function VentanaTexto(props) {
    const [pagina, setPagina] = SP_REACT.useState(0);
    const lineas = (props.texto || "").replace(/\s+$/, "").split("\n");
    const total = Math.max(1, Math.ceil(lineas.length / LINEAS_POR_PAGINA));
    const actual = Math.min(pagina, total - 1);
    const desde = actual * LINEAS_POR_PAGINA;
    const hasta = Math.min(desde + LINEAS_POR_PAGINA, lineas.length);
    return (SP_JSX.jsxs(DFL.ModalRoot, { strTitle: props.titulo, bAllowFullSize: true, onCancel: props.onCerrar, children: [SP_JSX.jsx(DFL.DialogBody, { children: SP_JSX.jsx(DFL.DialogBodyText, { style: {
                        fontFamily: "monospace",
                        fontSize: "0.85em",
                        lineHeight: 1.35,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxHeight: "45vh",
                        overflowY: "auto",
                    }, children: lineas.slice(desde, hasta).join("\n") }) }), SP_JSX.jsxs(DFL.DialogFooter, { children: [SP_JSX.jsx(DFL.DialogButton, { disabled: actual <= 0, onClick: () => setPagina(actual - 1), children: "◀ Anteriores" }), SP_JSX.jsx(DFL.DialogButtonPrimary, { onClick: props.onCerrar, children: "Cerrar" }), SP_JSX.jsx(DFL.DialogButton, { disabled: actual >= total - 1, onClick: () => setPagina(actual + 1), children: "Siguientes ▶" })] }), SP_JSX.jsxs("div", { style: {
                    textAlign: "center",
                    fontSize: "0.75em",
                    opacity: 0.6,
                    marginTop: "8px",
                }, children: ["lineas ", lineas.length ? desde + 1 : 0, "-", hasta, " de ", lineas.length] })] }));
}
function abrirVentana(titulo, texto) {
    const cierre = { f: () => { } };
    const res = DFL.showModal(SP_JSX.jsx(VentanaTexto, { titulo: titulo, texto: texto, onCerrar: () => cierre.f() }));
    cierre.f = res.Close;
}
// ---------------------------------------------------------------------------
//  Panel
// ---------------------------------------------------------------------------
function Content() {
    const [est, setEst] = SP_REACT.useState(null);
    const [ocupado, setOcupado] = SP_REACT.useState(false);
    const [abiertas, setAbiertas] = SP_REACT.useState({});
    const [aviso, setAviso] = SP_REACT.useState("");
    const temporizador = SP_REACT.useRef(null);
    const [destello, setDestello] = SP_REACT.useState(null);
    const [ultimo, setUltimo] = SP_REACT.useState({});
    const toggle = (id) => setAbiertas((prev) => ({ ...prev, [id]: !prev[id] }));
    // avisos pasajeros: se pintan dentro del panel y se borran solos
    const avisar = (mensaje) => {
        setAviso(mensaje);
        if (temporizador.current)
            clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => setAviso(""), 5000);
    };
    const limpiarAviso = () => {
        if (temporizador.current)
            clearTimeout(temporizador.current);
        setAviso("");
    };
    const refrescar = async () => {
        try {
            const nuevo = await call("estado");
            setEst(nuevo);
            if (nuevo.aviso)
                avisar(nuevo.aviso);
        }
        catch (e) {
            abrirVentana("Error", String(e));
        }
    };
    SP_REACT.useEffect(() => {
        void refrescar();
    }, []);
    const conBloqueo = async (fn) => {
        if (ocupado)
            return;
        setOcupado(true);
        try {
            await fn();
        }
        catch (e) {
            abrirVentana("Error", String(e));
        }
        finally {
            setOcupado(false);
        }
    };
    const TOCAR_MS = 1500;
    const vibrar = (m) => {
        void call("vibrar", m.serie, m.puerto)
            .then((r) => {
            if (r.ok)
                return;
            if (r.salida.includes("\n"))
                abrirVentana("No se pudo vibrar", r.salida);
            else
                avisar(r.salida);
        })
            .catch(() => { });
        setDestello(m.serie);
        setTimeout(() => setDestello((d) => (d === m.serie ? null : d)), 420);
    };
    const tocarMando = (m) => conBloqueo(async () => {
        if (m.clase === "Integrado") {
            avisar("El mando integrado no vibra ni se fija por serie: se pone como Player 1 " +
                "con el ajuste «Mando integrado».");
            return;
        }
        if (!m.serie) {
            avisar(`"${m.sdl || m.nombre}" no informa de su serie, asi que no puedo dirigirme a el.`);
            return;
        }
        vibrar(m);
        const ahora = Date.now();
        const anterior = ultimo[m.serie] ?? 0;
        const doble = ahora - anterior < TOCAR_MS;
        setUltimo((u) => ({ ...u, [m.serie]: ahora }));
        if (m.es_principal) {
            avisar("Este ya es el principal.");
            return;
        }
        if (est && est.ds_conectados <= 1) {
            avisar("Con un solo mando conectado, ya es el principal.");
            return;
        }
        if (!doble) {
            avisar("Pulsa otra vez para hacerlo principal.");
            return;
        }
        const nuevo = await call("alternar_principal", m.serie);
        setEst(nuevo);
        if (nuevo.aviso) {
            avisar(nuevo.aviso);
        }
        else {
            const p = nuevo.mandos.find((x) => x.serie === m.serie);
            setUltimo((u) => ({ ...u, [m.serie]: 0 }));
            avisar(`${p?.sdl || p?.nombre || "Mando"} es ahora el principal`);
        }
    });
    const ciclar = (clave) => conBloqueo(async () => {
        const nuevo = await call("ciclar", clave);
        setEst(nuevo);
        if (nuevo.aviso)
            avisar(nuevo.aviso);
    });
    const aplicar = () => conBloqueo(async () => {
        const r = await call("aplicar");
        abrirVentana(`Aplicar: ${r.mensaje ?? "salida " + r.exit}`, r.salida);
        await refrescar();
    });
    const verLog = () => conBloqueo(async () => {
        const r = await call("ver_log");
        abrirVentana("Log (ultimas lineas)", r.salida);
    });
    const instalar = () => conBloqueo(async () => {
        const r = await call("instalar_scripts");
        abrirVentana(r.ok ? "Scripts instalados" : `Error instalando (${r.exit})`, r.salida);
        await refrescar();
    });
    const restaurarTodo = () => {
        DFL.showModal(SP_JSX.jsx(DFL.ConfirmModal, { strTitle: "Restaurar todo", strDescription: "Se restaurara el qt-config.ini anterior a E.C.A, se quitaran las " +
                "preferencias del plugin y se desactivara el hook de ES-DE.\n\n" +
                "Eden debe estar cerrado. Se guarda una copia del estado actual.\n\n" +
                "Podras reactivar el hook con el boton de arriba.", strOKButtonText: "Restaurar", strCancelButtonText: "Cancelar", onOK: () => {
                void conBloqueo(async () => {
                    const r = await call("restaurar_todo");
                    abrirVentana(r.ok ? "Restaurado" : "Restaurado con problemas", r.salida);
                    await refrescar();
                });
            }, onCancel: () => { } }));
    };
    if (!est) {
        return (SP_JSX.jsx(DFL.PanelSection, { title: "E.C.A", children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { opacity: 0.8 }, children: "Leyendo mandos..." }) }) }));
    }
    const p = est.prefs;
    const cuadricula = est.mandos.length >= 2;
    // la MAC solo cuando hay mas de un mando del mismo tipo
    const repetidos = (clase) => est.mandos.filter((x) => x.clase === clase).length > 1;
    const textoMandos = (e) => {
        const partes = [];
        if (e.ds_conectados > 0)
            partes.push(`${e.ds_conectados} DualSense`);
        if (e.otros_conectados > 0) {
            partes.push(`${e.otros_conectados} ${e.otros_conectados === 1 ? "otro" : "otros"}`);
        }
        return partes.length ? partes.join(" · ") : "sin mandos externos";
    };
    const resumenPlanes = (() => {
        const trozos = [];
        for (const [clave, etiqueta] of [
            ["wiiu", "Cemu"],
            ["dolphin", "Dolphin"],
        ]) {
            const pl = est.planes?.[clave];
            if (pl && pl.mandos.length)
                trozos.push(`${etiqueta} ${pl.mandos.length}`);
        }
        return trozos.length ? trozos.join(" · ") : "sin datos";
    })();
    const comprobarPlanes = () => conBloqueo(async () => {
        const nuevo = await call("comprobar");
        setEst(nuevo);
        if (nuevo.aviso)
            avisar(nuevo.aviso);
        else
            avisar("Plan recalculado");
    });
    const resumenAjustes = `${p.JUGADORES_MAX} · ${INTEGRADO_TXT[p.ORDEN_INTEGRADO] ?? p.ORDEN_INTEGRADO}${est.integrado_auto ? " (auto)" : ""}`;
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("style", { children: ESTILOS }), !est.instalado || est.desactualizado || !est.hook ? (SP_JSX.jsx(DFL.PanelSection, { title: !est.instalado
                    ? "Primer uso"
                    : !est.hook
                        ? "Hook desactivado"
                        : est.reparar
                            ? "Reparar"
                            : "Actualizar", children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(BotonAccion, { icono: SP_JSX.jsx(FaDownload, { size: 14 }), texto: !est.instalado
                            ? "Instalar scripts"
                            : !est.hook
                                ? "Reactivar hook"
                                : est.reparar
                                    ? "Reparar instalación"
                                    : "Actualizar scripts", onClick: instalar }) }) })) : null, est.esde === false ? (SP_JSX.jsx(DFL.PanelSection, { children: est.esde === false ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(Aviso, { tono: "atencion", children: "ES-DE: activa \u00ABOther settings \u2192 Enable custom event scripts\u00BB. Sin eso no se aplica al lanzar el juego." }) })) : null })) : null, SP_JSX.jsx(DFL.PanelSection, { children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                        }, children: [SP_JSX.jsx(CirculoIcono, { color: C.azul, lado: 26, children: SP_JSX.jsx(FaInfoCircle, { size: 12 }) }), SP_JSX.jsxs("div", { style: { minWidth: 0, fontSize: "0.78em", lineHeight: 1.35 }, children: [SP_JSX.jsx("div", { style: { fontWeight: 700 }, children: "Estado" }), SP_JSX.jsxs("div", { style: { opacity: 0.7 }, children: [ESCENARIO_CORTO[est.escenario] ?? est.escenario, " \u00B7", " ", textoMandos(est), " \u00B7 scripts ", est.version, " \u00B7", " ", SP_JSX.jsx("span", { style: { color: est.hook ? C.verde : C.rojo }, children: est.hook ? "hook OK" : "hook falta" })] })] })] }) }) }), SP_JSX.jsxs(Seccion, { titulo: "Mandos", icono: SP_JSX.jsx(FaGamepad, { size: 13 }), abierta: true, children: [est.mandos.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { opacity: 0.8 }, children: "No se detecta ningun mando. Enciende el mando y pulsa Recargar." }) })) : cuadricula ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                gap: "6px",
                                width: "100%",
                            }, children: est.mandos.map((m) => (SP_JSX.jsx("div", { className: "ede-celda", style: {
                                    minWidth: 0,
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    borderRadius: "16px",
                                }, children: SP_JSX.jsx(MandoCuadrado, { m: m, mostrarMac: repetidos(m.clase), destello: destello === m.serie, onClick: () => tocarMando(m) }) }, `${m.guid}-${m.puerto}`))) }) })) : (est.mandos.map((m) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(FilaMando, { m: m, mostrarMac: repetidos(m.clase), destello: destello === m.serie, onClick: () => tocarMando(m) }) }, `${m.guid}-${m.puerto}`)))), aviso ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(Aviso, { tono: "atencion", onClick: limpiarAviso, children: aviso }) })) : null, est.ds_conectados > Number(p.JUGADORES_MAX) ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { fontSize: "0.68em", color: C.dorado }, children: ["Se configuran ", p.JUGADORES_MAX, " de ", est.ds_conectados, " mandos. Cambialo en Ajustes \u2192 Mandos a configurar."] }) })) : null, est.mandos.length > 1 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.68em",
                                opacity: 0.6,
                            }, children: [SP_JSX.jsx(GlifoA, {}), " vibrar \u00B7 dos toques seguidos = mando principal"] }) })) : null, SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(BotonAccion, { icono: SP_JSX.jsx(FaSyncAlt, { size: 14 }), texto: "Recargar mandos", onClick: () => conBloqueo(refrescar) }) })] }), SP_JSX.jsxs(Seccion, { titulo: "Asignaci\u00F3n", icono: SP_JSX.jsx(FaFileAlt, { size: 12 }), resumen: resumenPlanes, abierta: Boolean(abiertas.asig), onToggle: () => toggle("asig"), children: [[
                        ["wiiu", "Cemu (Wii U)"],
                        ["dolphin", "Dolphin (GC/Wii)"],
                    ].map(([clave, etiqueta]) => {
                        const pl = est.planes?.[clave];
                        return (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: {
                                    width: "100%",
                                    fontSize: "0.8em",
                                    lineHeight: 1.45,
                                    padding: "2px 4px",
                                }, children: [SP_JSX.jsx("div", { style: { fontWeight: 700 }, children: etiqueta }), pl ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs("div", { style: { opacity: 0.6, fontSize: "0.9em" }, children: [pl.modo, " \u00B7 ", pl.fecha, " \u00B7 m\u00E1ximo ", pl.max, " \u00B7", " ", pl.sdl === "ok" ? "SDL ok" : "SDL error"] }), pl.mandos.length === 0 ? (SP_JSX.jsx("div", { style: { color: C.dorado }, children: "Ning\u00FAn mando asignado." })) : (pl.mandos.map((m) => (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("span", { style: { color: C.azul, fontWeight: 700 }, children: ["M", m.n] }), " ", m.nombre, " ", SP_JSX.jsxs("span", { style: { opacity: 0.5 }, children: ["[", m.clase, "]"] })] }, m.n)))), pl.fuera.map((f) => (SP_JSX.jsxs("div", { style: { color: C.gris, fontSize: "0.92em" }, children: ["fuera: ", f.replace("|", ": ")] }, f))), pl.aviso.map((a) => (SP_JSX.jsx("div", { style: { color: C.dorado, fontSize: "0.92em" }, children: a }, a)))] })) : (SP_JSX.jsx("div", { style: { opacity: 0.6 }, children: "Sin datos todav\u00EDa. Pulsa \u00ABComprobar ahora\u00BB." }))] }) }, clave));
                    }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(BotonAccion, { icono: SP_JSX.jsx(FaSyncAlt, { size: 14 }), texto: "Comprobar ahora", onClick: comprobarPlanes }) })] }), SP_JSX.jsx(Seccion, { titulo: "Ajustes", icono: SP_JSX.jsx(FaSlidersH, { size: 12 }), resumen: resumenAjustes, abierta: Boolean(abiertas.ajustes), onToggle: () => toggle("ajustes"), children: SP_JSX.jsxs(Rejilla, { children: [SP_JSX.jsx("div", { className: "ede-celda", children: SP_JSX.jsx(TarjetaAccion, { icono: SP_JSX.jsx(FaGamepad, { size: 17 }), titulo: "Mandos", detalle: `${p.JUGADORES_MAX} jugadores`, onClick: () => ciclar("max") }) }), SP_JSX.jsx("div", { className: "ede-celda", children: SP_JSX.jsx(TarjetaAccion, { icono: SP_JSX.jsx(FaMicrochip, { size: 17 }), titulo: "Integrado", detalle: `${INTEGRADO_TXT[p.ORDEN_INTEGRADO] ?? p.ORDEN_INTEGRADO}${est.integrado_auto ? " (auto)" : ""}`, onClick: () => ciclar("integrado") }) })] }) }), SP_JSX.jsx(Seccion, { titulo: "Avanzado", color: C.gris, icono: SP_JSX.jsx(FaCog, { size: 13 }), abierta: Boolean(abiertas.avanzado), onToggle: () => toggle("avanzado"), children: SP_JSX.jsxs(Rejilla, { children: [SP_JSX.jsx("div", { className: "ede-celda", children: SP_JSX.jsx(TarjetaAccion, { icono: SP_JSX.jsx(FaCheck, { size: 17 }), titulo: "Aplicar", detalle: "Ahora", onClick: aplicar }) }), SP_JSX.jsx("div", { className: "ede-celda", children: SP_JSX.jsx(TarjetaAccion, { icono: SP_JSX.jsx(FaUndo, { size: 16 }), titulo: "Restaurar", detalle: "Todo", color: C.rojo, onClick: restaurarTodo }) }), SP_JSX.jsx("div", { className: "ede-celda", children: SP_JSX.jsx(TarjetaAccion, { icono: SP_JSX.jsx(FaFileAlt, { size: 16 }), titulo: "Ver log", detalle: "log.txt", color: C.gris, onClick: verLog }) })] }) })] }));
}
var index = definePlugin(() => {
    return {
        name: "E.C.A",
        titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "E.C.A" }),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaGamepad, {}),
        onDismount() {
            console.log("E.C.A descargado");
        },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
