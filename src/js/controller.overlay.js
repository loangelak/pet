var ControllerOverlay = {
    bh: 0,
    container: false,
    navContainer: false,
    dotsContainer: false,
    images: false,
    totalImages: 0,
    current: 0,
    speed: 350,
    duration: 2000,
    timer: false,
    init: function() {
        this.bh = this.getViewportHeight();
        $('#zoomImg img').css({'height': ControllerOverlay.bh - 40 + 'px'});
        this.handleClose();

        this.container = $('#imagesGrid');
        this.navContainer = $('#zoomNav .nav');
        this.dotsContainer = $('#zoomNav .dots');
        this.images = this.container.find('a.img');
        this.totalImages = this.images.length;

        //this.handleNavClick();
    },
    resizeWindow: function() {
        this.bh = this.getViewportHeight();
        $('#zoomImg img').css({'height': ControllerOverlay.bh - 40 + 'px'});
    },
    handleClose: function() {
        var $this = this;
        $('#zoomClose').on('click', 'a', function() {
            $this.close();
            return false;
        });
    },
    showImg: function(imgUrl) {
        this.open();
        this.current = this.container.find("a[id*='" + imgUrl + "']").index('a.img');
        this.renumerateNav();
        var $current = this.container.find("a[id*='" + imgUrl + "'] img");

        $('.loupe').remove();
        $('#zoomImg img').fadeOut(function() {
            var $this = this;
            u = $current.attr('rel');
            
            $(this).attr('src', imgUrl).load(function() {
                $($this).css({'margin-left': -1*$($this).width()/2 + 'px'});
                $(this).fadeIn();
                $('#zoomLoup').loupe({
                    width: 142,
                    height: 142,
                    loupe: 'loupe'
                });
            });
        });
    },
    close: function(eventPath) {
        var element = $("a[id*='" + $.address.value() + "']");
        $(document).scrollTop(element.offset().top);

        $('#zoomOverlay').fadeOut();
        clearInterval(this.timer);
        
        $('body').css({'overflow': ''});
        $('.loupe').remove();
        
        this.current = 0;
        this.dotsContainer.find('a').removeClass('active').eq(this.current).addClass('active');
        $.address.value('');
    },
    open: function() {
        $('#zoomOverlay').fadeIn();
        $('body').css({'overflow': 'hidden'});
    },
    handleNavClick: function() {
        var $this = this;
        this.navContainer.on('click', 'a', (function() {
            $(this).blur();
            return $.address.value($(this).attr('href'));
        }));
        this.dotsContainer.on('click', 'a', (function() {

        }));
    },
    getPrevImageIndex: function() {
        return (this.current == 0) ? (this.totalImages - 1) : (this.current - 1);
    },
    getNextImageIndex: function() {
        return (this.current == this.totalImages - 1) ? 0 : (this.current + 1);
    },
    renumerateNav: function() {
        this.dotsContainer.find('a').removeClass('active').eq(this.current).addClass('active');
        ;

        var next = this.images.eq(this.getNextImageIndex()).attr('href'),
                prev = this.images.eq(this.getPrevImageIndex()).attr('href');
        $('#zoomNav a.prev').attr('href', prev).attr('rel', 'address:' + prev);
        $('#zoomNav a.next').attr('href', next).attr('rel', 'address:' + next);
    },
    getViewportHeight: function() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];
        
        return w.innerHeight || e.clientHeight || g.clientHeight;
    }
};

var ResizeController = {
    rtime: null,
    timeout: false,
    delta: 100,
    init: function() {

        this.rtime = new Date(1, 1, 2000, 12, 00, 00);

        $(window).resize(function() {
            ResizeController.rtime = new Date();
            if (ResizeController.timeout === false) {
                ResizeController.timeout = true;
                setTimeout(function() {
                    ResizeController.resizeEnd();
                }, ResizeController.delta);
            }

        });
    },
    resizeEnd: function() {
        if (new Date() - ResizeController.rtime < ResizeController.delta) {
            setTimeout(function() {
                ResizeController.resizeEnd();
            }, ResizeController.delta);
        } else {
            ResizeController.timeout = false;

            ControllerOverlay.resizeWindow();
        }
    }
};

$(document).ready(function() {
    ControllerOverlay.init();
    ResizeController.init();
});