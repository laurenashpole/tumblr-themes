var App = App || {};

App.Navigation = (function () {
    var $nav,
        $navIcon;

    function init () {
        cacheSelectors();
        initListeners();
    }

    function cacheSelectors () {
        $nav = document.querySelector('.js-nav');
        $navIcon = document.querySelector('.js-nav-icon');
    }

    function initListeners () {
        $navIcon.addEventListener('click', onClick, false);
    }

    function onClick () {
        if ($nav.classList.contains('is-active')) {
            $nav.classList.remove('is-active', 'is-portait', 'is-landscape');
        } else {
            if (window.innerHeight > window.innerWidth){
                $nav.classList.add('is-portrait');
            } else {
                $nav.classList.add('is-landscape');
            }

            $nav.classList.add('is-active');
        }
    }

    return {
        init: init
    };
})();

App.SpaceElements = (function () {
    var $body,
        $head;

    function init () {
        cacheSelectors();
        render();
        loadCSS();
    }

    function cacheSelectors () {
        $body = document.body;
        $head = document.head;
    }

    function getHtmlArray () {
        var data = [
            '<div class="space__rocket-container"><div class="space__rocket"><div class="space__rocket-body bg--color-before"></div><div class="space__rocket-fin"></div><div class="space__rocket-smoke"><div class="space__rocket-poof"></div></div></div></div>',
            '<div class="space__planet-container"><div class="space__planet"></div></div>',
            '<div class="space__meteors bg--shape-before"><div class="space__meteor"><div class="space__meteor-texture"></div></div><div class="space__meteor"><div class="space__meteor-texture"></div></div><div class="space__meteor"><div class="space__meteor-texture"></div></div></div>',
            '<div class="space__comet-container"><div class="space__comet bg"></div></div>',
            '<div class="space__satellite-container"><div class="space__satellite-transmission"></div><div class="space__satellite-top"></div><div class="space__satellite"></div><div class="space__satellite-wings"></div></div>',
            '<div class="space__constellation"><div class="space__constellation-stars"></div><div class="space__constellation-stars"></div></div>'
        ];

        var len = data.length;
        var i = len;
        while (i--) {
            var p = parseInt(Math.random() * len);
            var t = data[i];
            data[i] = data[p];
            data[p] = t;
        }

        return data;
    }

    function render () {
        var htmlArray = getHtmlArray();
        var totalHtmlStrings = htmlArray.length;
        var spaceBetween = window.innerHeight || 500;
        var totalPositions = (Math.floor($body.offsetHeight / spaceBetween)) - 1;
        var topPosition = spaceBetween;

        for (var i = 0; i < totalPositions; i++) {
            var htmlString = htmlArray[i % totalHtmlStrings];
            var container = createContainer(htmlString, topPosition);

            topPosition += spaceBetween;
            $body.appendChild(container);
        }
    }

    function createContainer (htmlString, topPosition) {
        var container = document.createElement('div');
        var percentagePosition = (topPosition / $body.offsetHeight) * 100;

        container.innerHTML = htmlString;
        container.classList.add('space', 'is-waiting');
        container.style.top = percentagePosition + '%';

        container.addEventListener('inView', function () {
            container.classList.add('is-animating');
        });

        return container;
    }

    function loadCSS () {
        var linkEl = document.createElement('link');

        linkEl.rel = 'stylesheet';
        linkEl.href = '//static.tumblr.com/w45vvio/GZzoucgcb/space.min.css';

        $head.appendChild(linkEl);
    }

    return {
        init: init
    };
})();

App.InViewEvent = (function () {
    var event,
        windowHeight,
        listenForScroll;

    var $els;

    function init () {
        event = new Event('inView');
        listenForScroll = isDesktop();

        cacheSelectors();
        initListeners();
        sizeSettings();
        checkPositions();
    }

    function cacheSelectors () {
        $els = document.querySelectorAll('.is-waiting');
    }

    function initListeners () {
        window.addEventListener('resize', onResize, false);
        window.addEventListener('scroll', onScroll, false);
    }

    function isDesktop () {
        if (window.matchMedia('(min-width: 769px)').matches) {
            return true;
        } else {
            return false;
        }
    }

    function onResize () {
        window.requestAnimationFrame(sizeSettings);
    }

    function onScroll () {
        if (listenForScroll) {
            window.requestAnimationFrame(checkPositions);
        }
    }

    function sizeSettings () {
        listenForScroll = isDesktop();
        windowHeight = window.innerHeight;
    }

    function checkPositions () {
        for (var i = 0; i < $els.length; i++) {
            if ($els[i].classList.contains('is-waiting')) {
                var coords = $els[i].getBoundingClientRect();

                if (coords.top >= 0 && coords.bottom <= windowHeight) {
                    $els[i].dispatchEvent(event);
                    $els[i].classList.remove('is-waiting');
                }
            }
        }
    }

    return {
        init: init
    };
})();

if (document.readyState !== 'loading') {
    App.Navigation.init();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        App.Navigation.init();
    });
}

window.onload = function () {
    if (App.loadImages) {
        App.SpaceElements.init();
        App.InViewEvent.init();
    }

    document.documentElement.classList.remove('wf-loading');
};