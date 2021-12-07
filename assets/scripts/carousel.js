$(".today-item").on('click', function(e) {
    $(".today-item").removeClass("selected")
    $(this).addClass("selected")
})

$(document).ready(function() {
    startCarousel()
});

function startCarousel() {
    let length = $(".today-item").length;
    let currentIndex = $(".today-item.selected").index();
    let newIndex = currentIndex + 1;

    $(".today-item").removeClass("selected");
    
    if (newIndex >= length) { newIndex = 0; }

    $(".today-item").eq(newIndex).addClass("selected");

    // $(".today-carousel").scrollTo()

    // $(".today-carousel").animate({
    //     scrollLeft: $(".today-item").eq(newIndex).offset().left
    // }, 2000);

    // $(".today-carousel").scrollLeft($(".today-item").eq(newIndex).offset().left)
    
    setTimeout(startCarousel, 4000);
}