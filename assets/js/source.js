import $ from "jquery";
import { throttle } from 'throttle-debounce';

const throttleFunc = throttle(1000, (num) => {
		// console.log('num:', num);
	}, { 
        noLeading: false, 
        noTrailing: false 
    }
);
throttleFunc(100);


$(document).ready(function() {
    // Jquery dropdown child menu 
    /* 
    var menuItem = $('.sidebar__category-menus');
    var menuActive = $('.isChildActive');
    if (menuActive) {
        var wrapper = menuActive.find('.sidebar__dropdown-wrapper');
        var dropdown = menuActive.find('.sidebar__dropdown');
        var height = dropdown.height();
        wrapper.height(height);
    }

    if (menuItem) {
        menuItem.on('click', function (e) {
            var el = $(this);
            var parent =  el.closest('.sidebar__category');
            if (parent.hasClass('has-dropdown')) {
                e.preventDefault();
                var wrapper = parent.find('.sidebar__dropdown-wrapper');
                var dropdown = parent.find('.sidebar__dropdown');
                var height = dropdown.height();

                if (parent.hasClass('isChildActive')) {
                    parent.removeClass('isChildActive');
                    wrapper.height(0);
                } else {
                    parent.addClass('isChildActive');
                    wrapper.height(height);
                }
            }
        })
    }
    */
    // Jquery support handle has-tabs
    $(".has-tabs li").on('click', function() {
        var num = $(".has-tabs li").index(this);
        $(".has-tabs li").removeClass("active");
        $(this).addClass("active");
        $(".tab-content").removeClass("active");
        $(".tab-content")
            .eq(num)
            .addClass("active");
    });
    
    // Jquery support handle menu bars
    function handleMenubars() {
        if($(window).scrollTop() + $(window).height() <= $(document).height() - 200) {
            if (!$(".menu-bars").hasClass("menu-bars--active")) {
                $(".menu-bars").addClass("menu-bars--active");
            }
        } else {
            $(".menu-bars").removeClass("menu-bars--active");
        }
    }
    handleMenubars();
    
    // show / hide when scroll bottom body
    $(window).scroll(function() {
        handleMenubars();
    });
});

/**
 * Animation button javascript
 */
var buttons = document.getElementsByTagName('button');

Array.prototype.forEach.call(buttons, function(b){
    b.addEventListener('click', createRipple);
})

function createRipple(e)
{
    if(this.getElementsByClassName('ripple').length > 0)
    {
        this.removeChild(this.childNodes[1]);
    }

    var circle = document.createElement('div');
    this.appendChild(circle);

    var d = Math.max(this.clientWidth, this.clientHeight);
    circle.style.width = circle.style.height = d + 'px';

    circle.style.left = e.clientX - this.offsetLeft - d / 2 + 'px';
    circle.style.top = e.clientY - this.offsetTop - d / 2 + 'px';

    circle.classList.add('ripple');
}
