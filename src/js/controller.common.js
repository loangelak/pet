 
$.fn.showTill = function(pos) {
   var $this = this;
            $window = $(window);

    $window.scroll(function(e) {

        if ($('#zoomOverlay').is(":visible"))
            return false;

        if ($window.scrollTop() > pos) {
            $this.addClass('fixed');
        } else {
            $this.removeClass('fixed');
        }
    });
};


var GalleryController = {
    container: false,
    navContainer: false,
    dotsContainer: false,
    images: false,
    totalImages: 0,
    current: 0,
    iteration: 0,
    inAnimation: false,
    speed: 350,
    timer: false,
    duration: 3000,
    init: function() {
        this.container = $('.gallery .images');
        this.navContainer = $('.gallery .nav');
        this.dotsContainer = $('.gallery .dots');
        this.images = this.container.find('li');
        this.totalImages = this.images.find('img').length;
        this.initImages();
        if (this.totalImages < 2)
            return false;
        this.current = 0;
        this.inAnimation = false;
        this.dotsContainer.css({'margin-left': -1 * (14 * this.totalImages) / 2 + 'px'});
        
        this.handleVideoClick();
        this.handleNavClick();
        this.handleDotsClick();
        this.autorun();
    },
    initImages: function() {
        $.each(this.images, function(index, item) {
            $(item).css({'z-index': (999 - index)});
        });
        var imagesLoaded = 0,
            $this = this;
        $(this.images).find('img').load(function() {
            $(this).hide();
            imagesLoaded++;
            if (imagesLoaded == $this.totalImages)
                $this.showLoadedImages();
        });
    },
    showLoadedImages: function() {
        var delay = 0;
        $(this.images).find('img').each(function() {
            var $img = $(this);
            $img.queue('fade', function(next) {
                $img.css({'opacity': 1}).delay(delay).fadeIn();
            });
            $img.dequeue('fade');
            delay += 300;
        });
    },
    handleVideoClick: function() {
        var $this = this;
        this.container.find('iframe').each(function(index, item) {
            var playerId = $(item).attr('id'),
                    player = $f($(item)[0]);
            player.addEvent('ready', function() {
                player.addEvent('play', function() {
                    clearInterval($this.timer);
                });
            });
        });
    },
    handleNavClick: function() {
        var $this = this;
        this.navContainer.on('click', 'a', (function(e, p1) {
            if (typeof p1 == 'undefined')
                clearInterval($this.timer);
            if ($this.iteration == 0) {
                clearInterval($this.timer);
                $this.timer = setInterval(function() {
                    $this.navContainer.find('.next').trigger('click', ['autorun']);
                }, $this.duration);
            }
            $this.iteration++;
            
            $(this).blur();
            if ($this.inAnimation)
                return false;

            if ($(this).hasClass('next'))
                $this.doChange($this.getNextImageIndex());
            if ($(this).hasClass('prev'))
                $this.doChange($this.getPrevImageIndex());

            return false;
        }));
    },
    handleDotsClick: function() {
        var $this = this;
        this.dotsContainer.on('click', 'a', function() {
            clearInterval($this.timer);
            if ($(this).hasClass('active') || $this.inAnimation)
                return false;

            $this.doChange($(this).index());
            return false;
        });
    },
    getPrevImageIndex: function() {
        return (this.current == 0) ? (this.totalImages - 1) : (this.current - 1);
    },
    getNextImageIndex: function() {
        return (this.current == this.totalImages - 1) ? 0 : (this.current + 1);
    },
    doChange: function(next) {

        var $this = this;
        $(this.images[this.current]).css({'z-index': 999});
        $(this.images[next]).css({'z-index': 998});

        $.each(this.images, function(index, item) {
            if (index != $this.current && index != next)
                $(item).css({'z-index': 0});
        });

        this.inAnimation = true;
        $(this.images[this.current]).fadeOut(
                this.speed,
                function() {
                    $(this).css({'z-index': 0}).show();
                    $($this.images[next]).css({'z-index': 999});
                    $this.setCurrentDot(next);
                    $this.current = next;
                    $this.inAnimation = false;
                }
        );
        return false;
    },
    setCurrentDot: function(index) {
        this.dotsContainer.find('a').removeClass('active');
        this.dotsContainer.find('a:eq(' + index + ')').addClass('active');
    },
    autorun: function() {
        var $this = this;
        clearInterval($this.timer);

        this.timer = setInterval(function() {
            $this.navContainer.find('.next').trigger('click', ['autorun']);
        }, $this.duration + 2000);
    }
}

/**
 var GalleryController = {
 container: false,
 navContainer: false,
 dotsContainer: false,
 images: false,
 totalImages: 0,
 current: 0,
 speed: 350,
 timer: false,
 duration: 2000,
 scroll: false,
 init: function() {
 this.container = $('.gallery .images');
 this.navContainer = $('.gallery .nav');
 this.dotsContainer = $('.gallery .dots');
 this.images = this.container.find('li');
 this.totalImages = this.images.length;
 if (this.totalImages < 2)
 return false;
 this.current = 0;
 this.dotsContainer.css({'margin-left': -1 * this.dotsContainer.width() / 2 + 'px'});
 if (this.scroll)
 this.scroll.destroy();
 this.initScroll();
 this.handleNavClick();
 this.handleDotsClick();
 //this.autorun();
 },
 initScroll: function() {
 var $this = this;
 this.container.css({'width': this.totalImages * this.images.width()});
 this.scroll = new iScroll('iscroll', {
 snap: 'li',
 momentum: false,
 hScrollbar: false,
 vScrollbar: false,
 vScroll: false,
 lockDirection: true,
 onScrollEnd: function() {
 $this.setCurrentDot(this.currPageX);
 },
 onBeforeScrollMove: function(e) {
 if (this.absDistX > (this.absDistY + 5)) {
 e.preventDefault();
 } else {
 window.scrollBy(0, -this.distY);
 }
 }
 });
 },
 handleNavClick: function() {
 var $this = this;
 this.navContainer.on('click', 'a', (function(e, p1) {
 if (typeof p1 == 'undefined')
 clearInterval($this.timer);
 
 $(this).blur();
 
 if ($(this).hasClass('next') && $this.getNextImageIndex() != false) {
 var idx = $this.getNextImageIndex();
 $this.setCurrentDot(idx);
 $this.scroll.scrollToPage(idx);
 }
 if ($(this).hasClass('prev') && $this.getPrevImageIndex() != false) {
 var idx = $this.getPrevImageIndex();
 $this.setCurrentDot(idx);
 $this.scroll.scrollToPage(idx);
 }
 
 return false;
 }));
 },
 handleDotsClick: function() {
 var $this = this;
 this.dotsContainer.on('click', 'a', function() {
 clearInterval($this.timer);
 $(this).blur();
 
 if ($(this).hasClass('active'))
 return false;
 
 var idx = $(this).index();
 $this.setCurrentDot(idx);
 $this.scroll.scrollToPage(idx);
 return false;
 });
 },
 getPrevImageIndex: function() {
 return (this.current == 0) ? false : (this.current - 1);
 },
 getNextImageIndex: function() {
 return (this.current == this.totalImages - 1) ? false : (this.current + 1);
 },
 setCurrentDot: function(index) {
 this.current = index;
 this.dotsContainer.find('a').removeClass('active');
 this.dotsContainer.find('a:eq(' + index + ')').addClass('active');
 },
 autorun: function() {
 var $this = this;
 clearInterval($this.timer);
 
 this.timer = setInterval(function() {
 $this.navContainer.find('.next').trigger('click', ['autorun']);
 }, $this.duration);
 }
 }
 */
var SizeController = {
    isMobile: function() {
        return ($(window).width() < 480);
    }
}

$(document).ready(function() {
    GalleryController.init();

    if (!SizeController.isMobile()) {
        $('header').showTill(193);
        var h = $('header').height() - 2 + (($('header').hasClass('mod30')) ? 0 : 30);
        $('#container').css({'padding-top': h + 'px'});
    }
});
