$(document).ready(function(){
	$('.d').on('click',deleteuser);
});
function deleteuser(){
	var con = confirm('Are you sure');

	if(con){
		$.ajax({
			type:'DELETE',
			url : '/users/delete/'+ $(this).data('id')
		}).done(function(response){
			
		});
		window.location.replace('/');
	} else {
		return false;
	}
}