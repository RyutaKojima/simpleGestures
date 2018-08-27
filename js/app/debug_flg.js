
const DEBUG_ON = false;

// デバッグモード以外では console.log を出力しない
if (typeof DEBUG_ON === 'undefined' || ! DEBUG_ON) {
	console.log = function(dummy) {};
}
