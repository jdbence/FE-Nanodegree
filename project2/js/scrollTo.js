(function($, document){
    
    $("html").on("click", ".scrollTo", function(event){
       var target = $(this).attr("href");
       $(document).scrollTop($(target).offset().top - 60);
       return false;
    });
    
})($, document);