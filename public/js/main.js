$(document).ready(function() {
  $('.delete-article').on('click', function(e) {

    $target = $(e.target);
    //console.log($target.attr('data-id'));
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/article/' + id,
      success: function(response) {
        alert('Deleting article');
        window.location.href = '/';
      },
      error: function() {
        console.log(err);
      }

    });

  });
});

$(".alert").delay(2500).slideUp(500, function() {
    $(this).alert('close');
});
