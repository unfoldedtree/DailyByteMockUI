$(".main-menu").on("click", function() {
    $(".menu-div").addClass('open')
    $(".container-div").addClass('open')
})

$(".menu-close").on("click", function() {
    $(".menu-div").removeClass('open')
    $(".container-div").removeClass('open')
})

$(".container-div").on("click", function(e) {
    if(e.target.id == "container-div") {
        if ($(".container-div").hasClass('open') && $(".menu-div").hasClass("open")) {
        $(".menu-div").removeClass('open')
        $(".container-div").removeClass('open')
        }
    }
})