/**
 * Created by pavelgolubev345 on 04.07.16.
 */
$('#comment_button').click(function () {
    var csrftoken = Cookies.get('csrftoken');
    var text = $('#comment_text').val();
    var course_id = $(this).data('commentid');
    if (text != '') {
        console.log(csrftoken + ' ' + text + ' ' + course_id);
        $.ajax({
            type: 'POST',
            url: '/post_comment/' + course_id,
            data: {'text': text, 'csrfmiddlewaretoken': csrftoken}
        }).done(function (resp) {
            var id = "comment_" + resp.comment_id;
            $('#AjaxMagic').append('<div id=\"' + id + '\"></div>');
            $('#' + id).load('/single_comment?commentid='+resp.comment_id);
        }).fail(function (err) {
            console.log(err)
        });
    }
});