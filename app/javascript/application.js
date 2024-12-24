// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "channels"

export function block_bubbling_for_elements(elements) {
    const events = [
        'click', 'mouseover', 'mousedown', 'mouseup', 'keydown', 'keyup',
        'mouseenter', 'mouseleave', 'focus', 'blur',
        'touchstart', 'touchend', 'touchmove', 'touchcancel',
        'pointerdown', 'pointerup', 'pointermove', 'wheel' // Added pointer and wheel events
    ];

    // Add event listeners to stop propagation for each event
    events.forEach(eventType => {
        elements.forEach(element => {
            element.addEventListener(eventType, function (event) {
                event.stopPropagation();
            }, {passive: false});  // Use passive: false for touch event// s
            if (element.tagName.toLowerCase() !== 'a' && element.tagName.toLowerCase() !== 'button') {
                element.style.cursor = 'default';
            }
        });
    });
}