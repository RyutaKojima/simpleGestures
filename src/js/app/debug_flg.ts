const DEBUG_ON = false;

// デバッグモード以外では console.log を出力しない
if (typeof DEBUG_ON === 'undefined' || ! DEBUG_ON) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.console.log = function() {};
}

export default DEBUG_ON;
