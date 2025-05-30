/* A Pen created on CodePen.io. Original URL: https://codepen.io/chireenjavier/pen/bweVMo */

function Notify(text, style, container) {

	var time = '5000';
	console.log(container);
	var $container = $('#' + container + '');
	console.log($container);
  var icon = '<i class="fa fa-info-circle "></i>';
  
  if( style == 'primary'){
	  icon = '<i class="fa fa-bookmark "></i>';
  }
  
  if( style == 'info'){
	  icon = '<i class="fa fa-info-circle "></i>';
  }
  
  if( style == 'success'){
	  icon = '<i class="fa fa-check-circle "></i>';
  }
  
  if( style == 'warning'){
	  icon = '<i class="fa fa-exclamation-circle "></i>';
  }
  
  if( style == 'danger'){
	  icon = '<i class="fa fa-exclamation-triangle "></i>';
  }
   
  if( style == 'default'){
	  icon = '<i class="fa fa-user "></i>';
  }
  
	if (style == 'undefined' ) {
	  style = 'warning';
	  
	}
  
	  var html = $('<div class="alert alert-' + style + '  hide">' + icon +  " " + text + '</div>');
  
  
  console.log(html);
  
	$('<a>',{
		text: '×',
		class: 'button close',
		style: 'padding-left: 10px;',
		href: 'javascript:void(0)',
		click: function(e){
			e.preventDefault();
		// 	close_callback && close_callback();
			remove_notice();
		}
	}).prependTo(html);

	$container.prepend(html);
	html.removeClass('hide').hide().fadeIn('slow');

	function remove_notice() {
		html.stop().fadeOut('fast');
	}
	
	var timer =  setInterval(remove_notice, time);
  
	$(html).hover(function(){
		clearInterval(timer);
	}, function(){
		timer = setInterval(remove_notice, time);
	});
	
	$(html).on('click', function () {
		clearInterval(timer);
		// callback && callback();
		remove_notice();
	});
  
  
}





$('.primary').on('click', function () {
  Notify("Welcome Back!",'primary','notifications');			   
});
$('.info').on('click', function () {
  Notify("You have new e-mail!",'info', 'notification2');			   
});
$('.success').on('click', function () {
  Notify("The data has been saved!",'success', 'notification3');
});
$('.warning').on('click', function () {
  Notify("Memory Almost Full! ",'warning', 'notification4');			   
});
$('.danger').on('click', function () {
  Notify("Oh no! There's a virus!",'danger', 'notification5');			   
});
$('.default').on('click', function () {
  Notify("I have no idea, too",'default', 'notification7');			   
});

// Wait for the document to be fully loaded
$(document).ready(function() {
    // Check if this is the first visit
    if (!localStorage.getItem('modalShown')) {
        // Create welcome modal content
        const welcomeModal = `
            <div id="welcomeModal" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content modal-primary">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title">Welcome to our site!</h4>
                        </div>
                        <div class="modal-body">
                            <p>Thank you for visiting our website. We're glad to have you here!</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-dismiss="modal">Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        $('body').append(welcomeModal);

        // Show modal with animation
        setTimeout(function() {
            $('#welcomeModal').modal({
                backdrop: 'static',
                keyboard: false
            });

            // Add bumpy animation class
            $('#welcomeModal').addClass('bumpy');
        }, 500);

        // Store that the modal has been shown
        localStorage.setItem('modalShown', 'true');

        // Handle modal close
        $('#welcomeModal').on('hidden.bs.modal', function () {
            // Optional: Show a notification after modal is closed
            Notify("Welcome! We hope you enjoy your stay!", 'primary', 'notifications');
        });
    }

    // Reset modal shown status when needed (e.g., for testing)
    // Uncomment the following line to reset the modal:
    // localStorage.removeItem('modalShown');
});