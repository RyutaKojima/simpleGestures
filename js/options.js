/**
 * ready
 */
//$(document).ready(function(){});
$(function(){

	// オプションデータのロード
	if( options_instance == null ) {
		options_instance = loadOptions();
	}

	// オプションデータの表示
	$('#color_r').val(options_instance['color_r']);
	$('#color_g').val(options_instance['color_g']);
	$('#color_b').val(options_instance['color_b']);

//	$('#general_option').hide();
//	$('#general_option').show();

	// text is changed
	$('#color_r').change(function() {
		saveOptions();
	});
	$('#color_g').change(function() {
		saveOptions();
	});
	$('#color_b').change(function() {
		saveOptions();
	});

	// 
	$('#reset_all').click(function() {
		resetOptions();
	});

});
