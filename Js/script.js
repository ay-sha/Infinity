$(document).ready(function() {
    var sectionOffset = $('#banner').offset().top + $('#banner').outerHeight();

    $(window).scroll(function() {
        if ($(this).scrollTop() > 10) { 
            $('.navbar').addClass('scrolled');
            $('.logo').attr('src', 'img/logo3.png');
            $('.toggle').attr('src', 'img/ham2.png'); 
        } 
        else {
            $('.navbar').removeClass('scrolled');
            $('.logo').attr('src', 'img/logo.png');
            $('.toggle').attr('src', 'img/ham1.png');
        }
    });
});


$('.owl-carousel').owlCarousel({
    loop:true,
    margin:0,
    responsiveClass:true,
    nav: false,
    dots: false,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:3,
        },
    }
})

var owl = $('.owl-carousel');
owl.owlCarousel();

$('.customNextBtn').click(function() {
    owl.trigger('next.owl.carousel');
})

$('.customPrevBtn').click(function() {
    // With optional speed parameter
    // Parameters has to be in square bracket '[]'
    owl.trigger('prev.owl.carousel', [300]);
})

$(".menu").click(function(){
    $(".verticalnav").addClass("verticalnavshow")
})
$(".cross").click(function(){
    $(".verticalnav").removeClass("verticalnavshow")
})