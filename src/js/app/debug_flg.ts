const DEBUG_ON: boolean = false;

// デバッグモード以外では console.log を出力しない
if (typeof DEBUG_ON === 'undefined' || ! DEBUG_ON) {
  window.console.log = function() {};
}

export default DEBUG_ON;
