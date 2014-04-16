$(function(){
    $('article').load('content/News.html');
    $('nav a').click(function() {
        var name = $(this).attr('class');
        //alert(name);
        var link = 'content/' + name + '.html';
        //alert(link);
        $('article').load(link);
    });
});