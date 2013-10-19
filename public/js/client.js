$(document).ready(function(){
  
	window.tag = 'fantasticdissent';

	var vines = {};
	var current = 0;

	function playNextVideo(){
		var vine = vines.records[current]
		var src = vine['videoUrl'];
		var description = vine['description'];
		$('#vine').attr('src',src);	
		$('#description').text(description);
	}

	function getVines(initial){
		console.log('updating vines');
		$.ajax({
			url: '/tag/'+window.tag
		}).done(function(data){
			vines = data;
			if (initial){
				playNextVideo();
			}
			setTimeout(getVines,10000);
		});
	}

	$('#vine').get(0).addEventListener('ended', function(){
		current++;
		if (current > vines.count-1){
			current = 0;
		}
		playNextVideo();
	});

	getVines(true);


});