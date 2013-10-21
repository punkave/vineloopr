$(document).ready(function(){
  
	window.tag = 'fantasticdissent';

	$.cookie.json = true;

	var vines = {};
	var current = 0;
	var settings = {};

	function playNextVideo(){
		var vine = vines.records[current]
		var src = vine['videoUrl'];
		var description = vine['description'];
		$('#vine').attr('src',src);	
		$('#description').text(description);
	}

	function getVines(username,password,cb){
		console.log('updating vines');
		var data = {
			tag: settings.tag
		}
		if (username && password){
			data.username = username;
			data.password = password;
		}

		$.ajax({
			url: 'vine/tag',
			type: 'POST',
			timeout: 5000,
			data: data
		}).done(function(data){
			vines = data;
			if (cb){
				cb();
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

	//getVines(true);

 	$('#settings-form').submit(function(e){
      e.preventDefault();

      // crude validation
      if ($('#username').val() && $('#password').val() && $('#tag').val()){

      	var cb = false;

      	// reset count and trigger restart if new tag
      	console.log(settings.tag);
      	console.log($('#tag').val());
      	if (settings.tag != $('#tag').val()){
      		current = 0;
      		cb = playNextVideo;
      	}

      	settings.tag = $('#tag').val();
      	settings.title = $('#page-title').val();
      	settings.bgcolor = $('#bgcolor').val();
      	settings.username = $('#username').val();
      	var password = $('#password').val()

	      // call getVines with new values
	      getVines(settings.username,password,playNextVideo);

	      //formatting
	      $('#settings').removeClass('modal-start').addClass('hidden');
	      $('#app').removeClass('hidden');
	      $('#settings-error').addClass('hidden');
	      if (settings.title){
	      	$('#title').text(settings.title);
	      }
	      if (settings.bgcolor){
	      	$(document.body).css('background-color',settings.bgcolor);
	      }

	      // save it
	      if ($('#remember').is(':checked')){
	      	$.cookie('settings',settings);
	      }

	    } else {
	    	$('#error').removeClass('hidden');
	    }
  });  

	$('#settings-edit').on('click',function(){
		$('#settings').removeClass('hidden');
	});
	$('#settings .close').on('click',function(){
		$('#settings').addClass('hidden');
	})

	// Set up remembered settings
	if ($.cookie('settings')){
		settings = $.cookie('settings');
		$('#username').val(settings.username)
		$('#tag').val(settings.tag);
		$('#page-title').val(settings.title);
		$('#bgcolor').val(settings.bgcolor);
		$('#remember').attr('checked',true);
	}

});