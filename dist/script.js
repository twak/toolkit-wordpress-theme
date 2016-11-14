/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = this.options.selector || ((this.options.target || '') + ' .nav li > a')
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

//! moment.js
//! version : 2.11.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
! function(a, b) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.moment = b()
}(this, function() {
    "use strict";

    function a() {
        return Qc.apply(null, arguments)
    }

    function b(a) {
        Qc = a
    }    

    function c(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }

    function d(a) {
        return a instanceof Date || "[object Date]" === Object.prototype.toString.call(a)
    }

    function e(a, b) {
        var c, d = [];
        for (c = 0; c < a.length; ++c) d.push(b(a[c], c));
        return d
    }

    function f(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }

    function g(a, b) {
        for (var c in b) f(b, c) && (a[c] = b[c]);
        return f(b, "toString") && (a.toString = b.toString), f(b, "valueOf") && (a.valueOf = b.valueOf), a
    }

    function h(a, b, c, d) {
        return za(a, b, c, d, !0).utc()
    }

    function i() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }

    function j(a) {
        return null == a._pf && (a._pf = i()), a._pf
    }

    function k(a) {
        if (null == a._isValid) {
            var b = j(a);
            a._isValid = !(isNaN(a._d.getTime()) || !(b.overflow < 0) || b.empty || b.invalidMonth || b.invalidWeekday || b.nullInput || b.invalidFormat || b.userInvalidated), a._strict && (a._isValid = a._isValid && 0 === b.charsLeftOver && 0 === b.unusedTokens.length && void 0 === b.bigHour)
        }
        return a._isValid
    }

    function l(a) {
        var b = h(NaN);
        return null != a ? g(j(b), a) : j(b).userInvalidated = !0, b
    }

    function m(a) {
        return void 0 === a
    }

    function n(a, b) {
        var c, d, e;
        if (m(b._isAMomentObject) || (a._isAMomentObject = b._isAMomentObject), m(b._i) || (a._i = b._i), m(b._f) || (a._f = b._f), m(b._l) || (a._l = b._l), m(b._strict) || (a._strict = b._strict), m(b._tzm) || (a._tzm = b._tzm), m(b._isUTC) || (a._isUTC = b._isUTC), m(b._offset) || (a._offset = b._offset), m(b._pf) || (a._pf = j(b)), m(b._locale) || (a._locale = b._locale), Sc.length > 0)
            for (c in Sc) d = Sc[c], e = b[d], m(e) || (a[d] = e);
        return a
    }

    function o(b) {
        n(this, b), this._d = new Date(null != b._d ? b._d.getTime() : NaN), Tc === !1 && (Tc = !0, a.updateOffset(this), Tc = !1)
    }

    function p(a) {
        return a instanceof o || null != a && null != a._isAMomentObject
    }

    function q(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function r(a) {
        var b = +a,
            c = 0;
        return 0 !== b && isFinite(b) && (c = q(b)), c
    }

    function s(a, b, c) {
        var d, e = Math.min(a.length, b.length),
            f = Math.abs(a.length - b.length),
            g = 0;
        for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && r(a[d]) !== r(b[d])) && g++;
        return g + f
    }

    function t() {}

    function u(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }

    function v(a) {
        for (var b, c, d, e, f = 0; f < a.length;) {
            for (e = u(a[f]).split("-"), b = e.length, c = u(a[f + 1]), c = c ? c.split("-") : null; b > 0;) {
                if (d = w(e.slice(0, b).join("-"))) return d;
                if (c && c.length >= b && s(e, c, !0) >= b - 1) break;
                b--
            }
            f++
        }
        return null
    }

    function w(a) {
        var b = null;
        if (!Uc[a] && !m(module) && module && module.exports) try {
            b = Rc._abbr, require("./locale/" + a), x(b)
        } catch (c) {}
        return Uc[a]
    }

    function x(a, b) {
        var c;
        return a && (c = m(b) ? z(a) : y(a, b), c && (Rc = c)), Rc._abbr
    }

    function y(a, b) {
        return null !== b ? (b.abbr = a, Uc[a] = Uc[a] || new t, Uc[a].set(b), x(a), Uc[a]) : (delete Uc[a], null)
    }

    function z(a) {
        var b;
        if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a) return Rc;
        if (!c(a)) {
            if (b = w(a)) return b;
            a = [a]
        }
        return v(a)
    }

    function A(a, b) {
        var c = a.toLowerCase();
        Vc[c] = Vc[c + "s"] = Vc[b] = a
    }

    function B(a) {
        return "string" == typeof a ? Vc[a] || Vc[a.toLowerCase()] : void 0
    }

    function C(a) {
        var b, c, d = {};
        for (c in a) f(a, c) && (b = B(c), b && (d[b] = a[c]));
        return d
    }

    function D(a) {
        return a instanceof Function || "[object Function]" === Object.prototype.toString.call(a)
    }

    function E(b, c) {
        return function(d) {
            return null != d ? (G(this, b, d), a.updateOffset(this, c), this) : F(this, b)
        }
    }

    function F(a, b) {
        return a.isValid() ? a._d["get" + (a._isUTC ? "UTC" : "") + b]() : NaN
    }

    function G(a, b, c) {
        a.isValid() && a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
    }

    function H(a, b) {
        var c;
        if ("object" == typeof a)
            for (c in a) this.set(c, a[c]);
        else if (a = B(a), D(this[a])) return this[a](b);
        return this
    }

    function I(a, b, c) {
        var d = "" + Math.abs(a),
            e = b - d.length,
            f = a >= 0;
        return (f ? c ? "+" : "" : "-") + Math.pow(10, Math.max(0, e)).toString().substr(1) + d
    }

    function J(a, b, c, d) {
        var e = d;
        "string" == typeof d && (e = function() {
            return this[d]()
        }), a && (Zc[a] = e), b && (Zc[b[0]] = function() {
            return I(e.apply(this, arguments), b[1], b[2])
        }), c && (Zc[c] = function() {
            return this.localeData().ordinal(e.apply(this, arguments), a)
        })
    }

    function K(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }

    function L(a) {
        var b, c, d = a.match(Wc);
        for (b = 0, c = d.length; c > b; b++) Zc[d[b]] ? d[b] = Zc[d[b]] : d[b] = K(d[b]);
        return function(e) {
            var f = "";
            for (b = 0; c > b; b++) f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }

    function M(a, b) {
        return a.isValid() ? (b = N(b, a.localeData()), Yc[b] = Yc[b] || L(b), Yc[b](a)) : a.localeData().invalidDate()
    }

    function N(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5;
        for (Xc.lastIndex = 0; d >= 0 && Xc.test(a);) a = a.replace(Xc, c), Xc.lastIndex = 0, d -= 1;
        return a
    }

    function O(a, b, c) {
        pd[a] = D(b) ? b : function(a) {
            return a && c ? c : b
        }
    }

    function P(a, b) {
        return f(pd, a) ? pd[a](b._strict, b._locale) : new RegExp(Q(a))
    }

    function Q(a) {
        return a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
            return b || c || d || e
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function R(a, b) {
        var c, d = b;
        for ("string" == typeof a && (a = [a]), "number" == typeof b && (d = function(a, c) {
                c[b] = r(a)
            }), c = 0; c < a.length; c++) qd[a[c]] = d
    }

    function S(a, b) {
        R(a, function(a, c, d, e) {
            d._w = d._w || {}, b(a, d._w, d, e)
        })
    }

    function T(a, b, c) {
        null != b && f(qd, a) && qd[a](b, c._a, c, a)
    }

    function U(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function V(a, b) {
        return c(this._months) ? this._months[a.month()] : this._months[Ad.test(b) ? "format" : "standalone"][a.month()]
    }

    function W(a, b) {
        return c(this._monthsShort) ? this._monthsShort[a.month()] : this._monthsShort[Ad.test(b) ? "format" : "standalone"][a.month()]
    }

    function X(a, b, c) {
        var d, e, f;
        for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) {
            if (e = h([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a)) return d;
            if (c && "MMM" === b && this._shortMonthsParse[d].test(a)) return d;
            if (!c && this._monthsParse[d].test(a)) return d
        }
    }

    function Y(a, b) {
        var c;
        return a.isValid() ? "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), U(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a) : a
    }

    function Z(b) {
        return null != b ? (Y(this, b), a.updateOffset(this, !0), this) : F(this, "Month")
    }

    function $() {
        return U(this.year(), this.month())
    }

    function _(a) {
        var b, c = a._a;
        return c && -2 === j(a).overflow && (b = c[sd] < 0 || c[sd] > 11 ? sd : c[td] < 1 || c[td] > U(c[rd], c[sd]) ? td : c[ud] < 0 || c[ud] > 24 || 24 === c[ud] && (0 !== c[vd] || 0 !== c[wd] || 0 !== c[xd]) ? ud : c[vd] < 0 || c[vd] > 59 ? vd : c[wd] < 0 || c[wd] > 59 ? wd : c[xd] < 0 || c[xd] > 999 ? xd : -1, j(a)._overflowDayOfYear && (rd > b || b > td) && (b = td), j(a)._overflowWeeks && -1 === b && (b = yd), j(a)._overflowWeekday && -1 === b && (b = zd), j(a).overflow = b), a
    }

    function aa(b) {
        a.suppressDeprecationWarnings === !1 && !m(console) && console.warn && console.warn("Deprecation warning: " + b)
    }

    function ba(a, b) {
        var c = !0;
        return g(function() {
            return c && (aa(a + "\nArguments: " + Array.prototype.slice.call(arguments).join(", ") + "\n" + (new Error).stack), c = !1), b.apply(this, arguments)
        }, b)
    }

    function ca(a, b) {
        Dd[a] || (aa(b), Dd[a] = !0)
    }

    function da(a) {
        var b, c, d, e, f, g, h = a._i,
            i = Ed.exec(h) || Fd.exec(h);
        if (i) {
            for (j(a).iso = !0, b = 0, c = Hd.length; c > b; b++)
                if (Hd[b][1].exec(i[1])) {
                    e = Hd[b][0], d = Hd[b][2] !== !1;
                    break
                }
            if (null == e) return void(a._isValid = !1);
            if (i[3]) {
                for (b = 0, c = Id.length; c > b; b++)
                    if (Id[b][1].exec(i[3])) {
                        f = (i[2] || " ") + Id[b][0];
                        break
                    }
                if (null == f) return void(a._isValid = !1)
            }
            if (!d && null != f) return void(a._isValid = !1);
            if (i[4]) {
                if (!Gd.exec(i[4])) return void(a._isValid = !1);
                g = "Z"
            }
            a._f = e + (f || "") + (g || ""), sa(a)
        } else a._isValid = !1
    }

    function ea(b) {
        var c = Jd.exec(b._i);
        return null !== c ? void(b._d = new Date(+c[1])) : (da(b), void(b._isValid === !1 && (delete b._isValid, a.createFromInputFallback(b))))
    }

    function fa(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g);
        return 100 > a && a >= 0 && isFinite(h.getFullYear()) && h.setFullYear(a), h
    }

    function ga(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return 100 > a && a >= 0 && isFinite(b.getUTCFullYear()) && b.setUTCFullYear(a), b
    }

    function ha(a) {
        return ia(a) ? 366 : 365
    }

    function ia(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function ja() {
        return ia(this.year())
    }

    function ka(a, b, c) {
        var d = 7 + b - c,
            e = (7 + ga(a, 0, d).getUTCDay() - b) % 7;
        return -e + d - 1
    }

    function la(a, b, c, d, e) {
        var f, g, h = (7 + c - d) % 7,
            i = ka(a, d, e),
            j = 1 + 7 * (b - 1) + h + i;
        return 0 >= j ? (f = a - 1, g = ha(f) + j) : j > ha(a) ? (f = a + 1, g = j - ha(a)) : (f = a, g = j), {
            year: f,
            dayOfYear: g
        }
    }

    function ma(a, b, c) {
        var d, e, f = ka(a.year(), b, c),
            g = Math.floor((a.dayOfYear() - f - 1) / 7) + 1;
        return 1 > g ? (e = a.year() - 1, d = g + na(e, b, c)) : g > na(a.year(), b, c) ? (d = g - na(a.year(), b, c), e = a.year() + 1) : (e = a.year(), d = g), {
            week: d,
            year: e
        }
    }

    function na(a, b, c) {
        var d = ka(a, b, c),
            e = ka(a + 1, b, c);
        return (ha(a) - d + e) / 7
    }

    function oa(a, b, c) {
        return null != a ? a : null != b ? b : c
    }

    function pa(b) {
        var c = new Date(a.now());
        return b._useUTC ? [c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate()] : [c.getFullYear(), c.getMonth(), c.getDate()]
    }

    function qa(a) {
        var b, c, d, e, f = [];
        if (!a._d) {
            for (d = pa(a), a._w && null == a._a[td] && null == a._a[sd] && ra(a), a._dayOfYear && (e = oa(a._a[rd], d[rd]), a._dayOfYear > ha(e) && (j(a)._overflowDayOfYear = !0), c = ga(e, 0, a._dayOfYear), a._a[sd] = c.getUTCMonth(), a._a[td] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b) a._a[b] = f[b] = d[b];
            for (; 7 > b; b++) a._a[b] = f[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];
            24 === a._a[ud] && 0 === a._a[vd] && 0 === a._a[wd] && 0 === a._a[xd] && (a._nextDay = !0, a._a[ud] = 0), a._d = (a._useUTC ? ga : fa).apply(null, f), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[ud] = 24)
        }
    }

    function ra(a) {
        var b, c, d, e, f, g, h, i;
        b = a._w, null != b.GG || null != b.W || null != b.E ? (f = 1, g = 4, c = oa(b.GG, a._a[rd], ma(Aa(), 1, 4).year), d = oa(b.W, 1), e = oa(b.E, 1), (1 > e || e > 7) && (i = !0)) : (f = a._locale._week.dow, g = a._locale._week.doy, c = oa(b.gg, a._a[rd], ma(Aa(), f, g).year), d = oa(b.w, 1), null != b.d ? (e = b.d, (0 > e || e > 6) && (i = !0)) : null != b.e ? (e = b.e + f, (b.e < 0 || b.e > 6) && (i = !0)) : e = f), 1 > d || d > na(c, f, g) ? j(a)._overflowWeeks = !0 : null != i ? j(a)._overflowWeekday = !0 : (h = la(c, d, e, f, g), a._a[rd] = h.year, a._dayOfYear = h.dayOfYear)
    }

    function sa(b) {
        if (b._f === a.ISO_8601) return void da(b);
        b._a = [], j(b).empty = !0;
        var c, d, e, f, g, h = "" + b._i,
            i = h.length,
            k = 0;
        for (e = N(b._f, b._locale).match(Wc) || [], c = 0; c < e.length; c++) f = e[c], d = (h.match(P(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && j(b).unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), k += d.length), Zc[f] ? (d ? j(b).empty = !1 : j(b).unusedTokens.push(f), T(f, d, b)) : b._strict && !d && j(b).unusedTokens.push(f);
        j(b).charsLeftOver = i - k, h.length > 0 && j(b).unusedInput.push(h), j(b).bigHour === !0 && b._a[ud] <= 12 && b._a[ud] > 0 && (j(b).bigHour = void 0), b._a[ud] = ta(b._locale, b._a[ud], b._meridiem), qa(b), _(b)
    }

    function ta(a, b, c) {
        var d;
        return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b
    }

    function ua(a) {
        var b, c, d, e, f;
        if (0 === a._f.length) return j(a).invalidFormat = !0, void(a._d = new Date(NaN));
        for (e = 0; e < a._f.length; e++) f = 0, b = n({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._f = a._f[e], sa(b), k(b) && (f += j(b).charsLeftOver, f += 10 * j(b).unusedTokens.length, j(b).score = f, (null == d || d > f) && (d = f, c = b));
        g(a, c || b)
    }

    function va(a) {
        if (!a._d) {
            var b = C(a._i);
            a._a = e([b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], function(a) {
                return a && parseInt(a, 10)
            }), qa(a)
        }
    }

    function wa(a) {
        var b = new o(_(xa(a)));
        return b._nextDay && (b.add(1, "d"), b._nextDay = void 0), b
    }

    function xa(a) {
        var b = a._i,
            e = a._f;
        return a._locale = a._locale || z(a._l), null === b || void 0 === e && "" === b ? l({
            nullInput: !0
        }) : ("string" == typeof b && (a._i = b = a._locale.preparse(b)), p(b) ? new o(_(b)) : (c(e) ? ua(a) : e ? sa(a) : d(b) ? a._d = b : ya(a), k(a) || (a._d = null), a))
    }

    function ya(b) {
        var f = b._i;
        void 0 === f ? b._d = new Date(a.now()) : d(f) ? b._d = new Date(+f) : "string" == typeof f ? ea(b) : c(f) ? (b._a = e(f.slice(0), function(a) {
            return parseInt(a, 10)
        }), qa(b)) : "object" == typeof f ? va(b) : "number" == typeof f ? b._d = new Date(f) : a.createFromInputFallback(b)
    }

    function za(a, b, c, d, e) {
        var f = {};
        return "boolean" == typeof c && (d = c, c = void 0), f._isAMomentObject = !0, f._useUTC = f._isUTC = e, f._l = c, f._i = a, f._f = b, f._strict = d, wa(f)
    }

    function Aa(a, b, c, d) {
        return za(a, b, c, d, !1)
    }

    function Ba(a, b) {
        var d, e;
        if (1 === b.length && c(b[0]) && (b = b[0]), !b.length) return Aa();
        for (d = b[0], e = 1; e < b.length; ++e)(!b[e].isValid() || b[e][a](d)) && (d = b[e]);
        return d
    }

    function Ca() {
        var a = [].slice.call(arguments, 0);
        return Ba("isBefore", a)
    }

    function Da() {
        var a = [].slice.call(arguments, 0);
        return Ba("isAfter", a)
    }

    function Ea(a) {
        var b = C(a),
            c = b.year || 0,
            d = b.quarter || 0,
            e = b.month || 0,
            f = b.week || 0,
            g = b.day || 0,
            h = b.hour || 0,
            i = b.minute || 0,
            j = b.second || 0,
            k = b.millisecond || 0;
        this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = z(), this._bubble()
    }

    function Fa(a) {
        return a instanceof Ea
    }

    function Ga(a, b) {
        J(a, 0, 0, function() {
            var a = this.utcOffset(),
                c = "+";
            return 0 > a && (a = -a, c = "-"), c + I(~~(a / 60), 2) + b + I(~~a % 60, 2)
        })
    }

    function Ha(a, b) {
        var c = (b || "").match(a) || [],
            d = c[c.length - 1] || [],
            e = (d + "").match(Od) || ["-", 0, 0],
            f = +(60 * e[1]) + r(e[2]);
        return "+" === e[0] ? f : -f
    }

    function Ia(b, c) {
        var e, f;
        return c._isUTC ? (e = c.clone(), f = (p(b) || d(b) ? +b : +Aa(b)) - +e, e._d.setTime(+e._d + f), a.updateOffset(e, !1), e) : Aa(b).local()
    }

    function Ja(a) {
        return 15 * -Math.round(a._d.getTimezoneOffset() / 15)
    }

    function Ka(b, c) {
        var d, e = this._offset || 0;
        return this.isValid() ? null != b ? ("string" == typeof b ? b = Ha(md, b) : Math.abs(b) < 16 && (b = 60 * b), !this._isUTC && c && (d = Ja(this)), this._offset = b, this._isUTC = !0, null != d && this.add(d, "m"), e !== b && (!c || this._changeInProgress ? $a(this, Va(b - e, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, a.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? e : Ja(this) : null != b ? this : NaN
    }

    function La(a, b) {
        return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset()
    }

    function Ma(a) {
        return this.utcOffset(0, a)
    }

    function Na(a) {
        return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(Ja(this), "m")), this
    }

    function Oa() {
        return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Ha(ld, this._i)), this
    }

    function Pa(a) {
        return this.isValid() ? (a = a ? Aa(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0) : !1
    }

    function Qa() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    }

    function Ra() {
        if (!m(this._isDSTShifted)) return this._isDSTShifted;
        var a = {};
        if (n(a, this), a = xa(a), a._a) {
            var b = a._isUTC ? h(a._a) : Aa(a._a);
            this._isDSTShifted = this.isValid() && s(a._a, b.toArray()) > 0
        } else this._isDSTShifted = !1;
        return this._isDSTShifted
    }

    function Sa() {
        return this.isValid() ? !this._isUTC : !1
    }

    function Ta() {
        return this.isValid() ? this._isUTC : !1
    }

    function Ua() {
        return this.isValid() ? this._isUTC && 0 === this._offset : !1
    }

    function Va(a, b) {
        var c, d, e, g = a,
            h = null;
        return Fa(a) ? g = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (g = {}, b ? g[b] = a : g.milliseconds = a) : (h = Pd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
            y: 0,
            d: r(h[td]) * c,
            h: r(h[ud]) * c,
            m: r(h[vd]) * c,
            s: r(h[wd]) * c,
            ms: r(h[xd]) * c
        }) : (h = Qd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
            y: Wa(h[2], c),
            M: Wa(h[3], c),
            d: Wa(h[4], c),
            h: Wa(h[5], c),
            m: Wa(h[6], c),
            s: Wa(h[7], c),
            w: Wa(h[8], c)
        }) : null == g ? g = {} : "object" == typeof g && ("from" in g || "to" in g) && (e = Ya(Aa(g.from), Aa(g.to)), g = {}, g.ms = e.milliseconds, g.M = e.months), d = new Ea(g), Fa(a) && f(a, "_locale") && (d._locale = a._locale), d
    }

    function Wa(a, b) {
        var c = a && parseFloat(a.replace(",", "."));
        return (isNaN(c) ? 0 : c) * b
    }

    function Xa(a, b) {
        var c = {
            milliseconds: 0,
            months: 0
        };
        return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c
    }

    function Ya(a, b) {
        var c;
        return a.isValid() && b.isValid() ? (b = Ia(b, a), a.isBefore(b) ? c = Xa(a, b) : (c = Xa(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c) : {
            milliseconds: 0,
            months: 0
        }
    }

    function Za(a, b) {
        return function(c, d) {
            var e, f;
            return null === d || isNaN(+d) || (ca(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = Va(c, d), $a(this, e, a), this
        }
    }

    function $a(b, c, d, e) {
        var f = c._milliseconds,
            g = c._days,
            h = c._months;
        b.isValid() && (e = null == e ? !0 : e, f && b._d.setTime(+b._d + f * d), g && G(b, "Date", F(b, "Date") + g * d), h && Y(b, F(b, "Month") + h * d), e && a.updateOffset(b, g || h))
    }

    function _a(a, b) {
        var c = a || Aa(),
            d = Ia(c, this).startOf("day"),
            e = this.diff(d, "days", !0),
            f = -6 > e ? "sameElse" : -1 > e ? "lastWeek" : 0 > e ? "lastDay" : 1 > e ? "sameDay" : 2 > e ? "nextDay" : 7 > e ? "nextWeek" : "sameElse",
            g = b && (D(b[f]) ? b[f]() : b[f]);
        return this.format(g || this.localeData().calendar(f, this, Aa(c)))
    }

    function ab() {
        return new o(this)
    }

    function bb(a, b) {
        var c = p(a) ? a : Aa(a);
        return this.isValid() && c.isValid() ? (b = B(m(b) ? "millisecond" : b), "millisecond" === b ? +this > +c : +c < +this.clone().startOf(b)) : !1
    }

    function cb(a, b) {
        var c = p(a) ? a : Aa(a);
        return this.isValid() && c.isValid() ? (b = B(m(b) ? "millisecond" : b), "millisecond" === b ? +c > +this : +this.clone().endOf(b) < +c) : !1
    }

    function db(a, b, c) {
        return this.isAfter(a, c) && this.isBefore(b, c)
    }

    function eb(a, b) {
        var c, d = p(a) ? a : Aa(a);
        return this.isValid() && d.isValid() ? (b = B(b || "millisecond"), "millisecond" === b ? +this === +d : (c = +d, +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b))) : !1
    }

    function fb(a, b) {
        return this.isSame(a, b) || this.isAfter(a, b)
    }

    function gb(a, b) {
        return this.isSame(a, b) || this.isBefore(a, b)
    }

    function hb(a, b, c) {
        var d, e, f, g;
        return this.isValid() ? (d = Ia(a, this), d.isValid() ? (e = 6e4 * (d.utcOffset() - this.utcOffset()), b = B(b), "year" === b || "month" === b || "quarter" === b ? (g = ib(this, d), "quarter" === b ? g /= 3 : "year" === b && (g /= 12)) : (f = this - d, g = "second" === b ? f / 1e3 : "minute" === b ? f / 6e4 : "hour" === b ? f / 36e5 : "day" === b ? (f - e) / 864e5 : "week" === b ? (f - e) / 6048e5 : f), c ? g : q(g)) : NaN) : NaN
    }

    function ib(a, b) {
        var c, d, e = 12 * (b.year() - a.year()) + (b.month() - a.month()),
            f = a.clone().add(e, "months");
        return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d)
    }

    function jb() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    }

    function kb() {
        var a = this.clone().utc();
        return 0 < a.year() && a.year() <= 9999 ? D(Date.prototype.toISOString) ? this.toDate().toISOString() : M(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : M(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }

    function lb(b) {
        var c = M(this, b || a.defaultFormat);
        return this.localeData().postformat(c)
    }

    function mb(a, b) {
        return this.isValid() && (p(a) && a.isValid() || Aa(a).isValid()) ? Va({
            to: this,
            from: a
        }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
    }

    function nb(a) {
        return this.from(Aa(), a)
    }

    function ob(a, b) {
        return this.isValid() && (p(a) && a.isValid() || Aa(a).isValid()) ? Va({
            from: this,
            to: a
        }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
    }

    function pb(a) {
        return this.to(Aa(), a)
    }

    function qb(a) {
        var b;
        return void 0 === a ? this._locale._abbr : (b = z(a), null != b && (this._locale = b), this)
    }

    function rb() {
        return this._locale
    }

    function sb(a) {
        switch (a = B(a)) {
            case "year":
                this.month(0);
            case "quarter":
            case "month":
                this.date(1);
            case "week":
            case "isoWeek":
            case "day":
                this.hours(0);
            case "hour":
                this.minutes(0);
            case "minute":
                this.seconds(0);
            case "second":
                this.milliseconds(0)
        }
        return "week" === a && this.weekday(0), "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this
    }

    function tb(a) {
        return a = B(a), void 0 === a || "millisecond" === a ? this : this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms")
    }

    function ub() {
        return +this._d - 6e4 * (this._offset || 0)
    }

    function vb() {
        return Math.floor(+this / 1e3)
    }

    function wb() {
        return this._offset ? new Date(+this) : this._d
    }

    function xb() {
        var a = this;
        return [a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()]
    }

    function yb() {
        var a = this;
        return {
            years: a.year(),
            months: a.month(),
            date: a.date(),
            hours: a.hours(),
            minutes: a.minutes(),
            seconds: a.seconds(),
            milliseconds: a.milliseconds()
        }
    }

    function zb() {
        return this.isValid() ? this.toISOString() : "null"
    }

    function Ab() {
        return k(this)
    }

    function Bb() {
        return g({}, j(this))
    }

    function Cb() {
        return j(this).overflow
    }

    function Db() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        }
    }

    function Eb(a, b) {
        J(0, [a, a.length], 0, b)
    }

    function Fb(a) {
        return Jb.call(this, a, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy)
    }

    function Gb(a) {
        return Jb.call(this, a, this.isoWeek(), this.isoWeekday(), 1, 4)
    }

    function Hb() {
        return na(this.year(), 1, 4)
    }

    function Ib() {
        var a = this.localeData()._week;
        return na(this.year(), a.dow, a.doy)
    }

    function Jb(a, b, c, d, e) {
        var f;
        return null == a ? ma(this, d, e).year : (f = na(a, d, e), b > f && (b = f), Kb.call(this, a, b, c, d, e))
    }

    function Kb(a, b, c, d, e) {
        var f = la(a, b, c, d, e),
            g = ga(f.year, 0, f.dayOfYear);
        return this.year(g.getUTCFullYear()), this.month(g.getUTCMonth()), this.date(g.getUTCDate()), this
    }

    function Lb(a) {
        return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
    }

    function Mb(a) {
        return ma(a, this._week.dow, this._week.doy).week
    }

    function Nb() {
        return this._week.dow
    }

    function Ob() {
        return this._week.doy
    }

    function Pb(a) {
        var b = this.localeData().week(this);
        return null == a ? b : this.add(7 * (a - b), "d")
    }

    function Qb(a) {
        var b = ma(this, 1, 4).week;
        return null == a ? b : this.add(7 * (a - b), "d")
    }

    function Rb(a, b) {
        return "string" != typeof a ? a : isNaN(a) ? (a = b.weekdaysParse(a), "number" == typeof a ? a : null) : parseInt(a, 10)
    }

    function Sb(a, b) {
        return c(this._weekdays) ? this._weekdays[a.day()] : this._weekdays[this._weekdays.isFormat.test(b) ? "format" : "standalone"][a.day()]
    }

    function Tb(a) {
        return this._weekdaysShort[a.day()]
    }

    function Ub(a) {
        return this._weekdaysMin[a.day()]
    }

    function Vb(a, b, c) {
        var d, e, f;
        for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), d = 0; 7 > d; d++) {
            if (e = Aa([2e3, 1]).day(d), c && !this._fullWeekdaysParse[d] && (this._fullWeekdaysParse[d] = new RegExp("^" + this.weekdays(e, "").replace(".", ".?") + "$", "i"), this._shortWeekdaysParse[d] = new RegExp("^" + this.weekdaysShort(e, "").replace(".", ".?") + "$", "i"), this._minWeekdaysParse[d] = new RegExp("^" + this.weekdaysMin(e, "").replace(".", ".?") + "$", "i")), this._weekdaysParse[d] || (f = "^" + this.weekdays(e, "") + "|^" + this.weekdaysShort(e, "") + "|^" + this.weekdaysMin(e, ""), this._weekdaysParse[d] = new RegExp(f.replace(".", ""), "i")), c && "dddd" === b && this._fullWeekdaysParse[d].test(a)) return d;
            if (c && "ddd" === b && this._shortWeekdaysParse[d].test(a)) return d;
            if (c && "dd" === b && this._minWeekdaysParse[d].test(a)) return d;
            if (!c && this._weekdaysParse[d].test(a)) return d
        }
    }

    function Wb(a) {
        if (!this.isValid()) return null != a ? this : NaN;
        var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != a ? (a = Rb(a, this.localeData()), this.add(a - b, "d")) : b
    }

    function Xb(a) {
        if (!this.isValid()) return null != a ? this : NaN;
        var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == a ? b : this.add(a - b, "d")
    }

    function Yb(a) {
        return this.isValid() ? null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7) : null != a ? this : NaN
    }

    function Zb(a) {
        var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == a ? b : this.add(a - b, "d")
    }

    function $b() {
        return this.hours() % 12 || 12
    }

    function _b(a, b) {
        J(a, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), b)
        })
    }

    function ac(a, b) {
        return b._meridiemParse
    }

    function bc(a) {
        return "p" === (a + "").toLowerCase().charAt(0)
    }

    function cc(a, b, c) {
        return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
    }

    function dc(a, b) {
        b[xd] = r(1e3 * ("0." + a))
    }

    function ec() {
        return this._isUTC ? "UTC" : ""
    }

    function fc() {
        return this._isUTC ? "Coordinated Universal Time" : ""
    }

    function gc(a) {
        return Aa(1e3 * a)
    }

    function hc() {
        return Aa.apply(null, arguments).parseZone()
    }

    function ic(a, b, c) {
        var d = this._calendar[a];
        return D(d) ? d.call(b, c) : d
    }

    function jc(a) {
        var b = this._longDateFormat[a],
            c = this._longDateFormat[a.toUpperCase()];
        return b || !c ? b : (this._longDateFormat[a] = c.replace(/MMMM|MM|DD|dddd/g, function(a) {
            return a.slice(1)
        }), this._longDateFormat[a])
    }

    function kc() {
        return this._invalidDate
    }

    function lc(a) {
        return this._ordinal.replace("%d", a)
    }

    function mc(a) {
        return a
    }

    function nc(a, b, c, d) {
        var e = this._relativeTime[c];
        return D(e) ? e(a, b, c, d) : e.replace(/%d/i, a)
    }

    function oc(a, b) {
        var c = this._relativeTime[a > 0 ? "future" : "past"];
        return D(c) ? c(b) : c.replace(/%s/i, b)
    }

    function pc(a) {
        var b, c;
        for (c in a) b = a[c], D(b) ? this[c] = b : this["_" + c] = b;
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
    }

    function qc(a, b, c, d) {
        var e = z(),
            f = h().set(d, b);
        return e[c](f, a)
    }

    function rc(a, b, c, d, e) {
        if ("number" == typeof a && (b = a, a = void 0), a = a || "", null != b) return qc(a, b, c, e);
        var f, g = [];
        for (f = 0; d > f; f++) g[f] = qc(a, f, c, e);
        return g
    }

    function sc(a, b) {
        return rc(a, b, "months", 12, "month")
    }

    function tc(a, b) {
        return rc(a, b, "monthsShort", 12, "month")
    }

    function uc(a, b) {
        return rc(a, b, "weekdays", 7, "day")
    }

    function vc(a, b) {
        return rc(a, b, "weekdaysShort", 7, "day")
    }

    function wc(a, b) {
        return rc(a, b, "weekdaysMin", 7, "day")
    }

    function xc() {
        var a = this._data;
        return this._milliseconds = me(this._milliseconds), this._days = me(this._days), this._months = me(this._months), a.milliseconds = me(a.milliseconds), a.seconds = me(a.seconds), a.minutes = me(a.minutes), a.hours = me(a.hours), a.months = me(a.months), a.years = me(a.years), this
    }

    function yc(a, b, c, d) {
        var e = Va(b, c);
        return a._milliseconds += d * e._milliseconds, a._days += d * e._days, a._months += d * e._months, a._bubble()
    }

    function zc(a, b) {
        return yc(this, a, b, 1)
    }

    function Ac(a, b) {
        return yc(this, a, b, -1)
    }

    function Bc(a) {
        return 0 > a ? Math.floor(a) : Math.ceil(a)
    }

    function Cc() {
        var a, b, c, d, e, f = this._milliseconds,
            g = this._days,
            h = this._months,
            i = this._data;
        return f >= 0 && g >= 0 && h >= 0 || 0 >= f && 0 >= g && 0 >= h || (f += 864e5 * Bc(Ec(h) + g), g = 0, h = 0), i.milliseconds = f % 1e3, a = q(f / 1e3), i.seconds = a % 60, b = q(a / 60), i.minutes = b % 60, c = q(b / 60), i.hours = c % 24, g += q(c / 24), e = q(Dc(g)), h += e, g -= Bc(Ec(e)), d = q(h / 12), h %= 12, i.days = g, i.months = h, i.years = d, this
    }

    function Dc(a) {
        return 4800 * a / 146097
    }

    function Ec(a) {
        return 146097 * a / 4800
    }

    function Fc(a) {
        var b, c, d = this._milliseconds;
        if (a = B(a), "month" === a || "year" === a) return b = this._days + d / 864e5, c = this._months + Dc(b), "month" === a ? c : c / 12;
        switch (b = this._days + Math.round(Ec(this._months)), a) {
            case "week":
                return b / 7 + d / 6048e5;
            case "day":
                return b + d / 864e5;
            case "hour":
                return 24 * b + d / 36e5;
            case "minute":
                return 1440 * b + d / 6e4;
            case "second":
                return 86400 * b + d / 1e3;
            case "millisecond":
                return Math.floor(864e5 * b) + d;
            default:
                throw new Error("Unknown unit " + a)
        }
    }

    function Gc() {
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * r(this._months / 12)
    }

    function Hc(a) {
        return function() {
            return this.as(a)
        }
    }

    function Ic(a) {
        return a = B(a), this[a + "s"]()
    }

    function Jc(a) {
        return function() {
            return this._data[a]
        }
    }

    function Kc() {
        return q(this.days() / 7)
    }

    function Lc(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }

    function Mc(a, b, c) {
        var d = Va(a).abs(),
            e = Ce(d.as("s")),
            f = Ce(d.as("m")),
            g = Ce(d.as("h")),
            h = Ce(d.as("d")),
            i = Ce(d.as("M")),
            j = Ce(d.as("y")),
            k = e < De.s && ["s", e] || 1 >= f && ["m"] || f < De.m && ["mm", f] || 1 >= g && ["h"] || g < De.h && ["hh", g] || 1 >= h && ["d"] || h < De.d && ["dd", h] || 1 >= i && ["M"] || i < De.M && ["MM", i] || 1 >= j && ["y"] || ["yy", j];
        return k[2] = b, k[3] = +a > 0, k[4] = c, Lc.apply(null, k)
    }

    function Nc(a, b) {
        return void 0 === De[a] ? !1 : void 0 === b ? De[a] : (De[a] = b, !0)
    }

    function Oc(a) {
        var b = this.localeData(),
            c = Mc(this, !a, b);
        return a && (c = b.pastFuture(+this, c)), b.postformat(c)
    }

    function Pc() {
        var a, b, c, d = Ee(this._milliseconds) / 1e3,
            e = Ee(this._days),
            f = Ee(this._months);
        a = q(d / 60), b = q(a / 60), d %= 60, a %= 60, c = q(f / 12), f %= 12;
        var g = c,
            h = f,
            i = e,
            j = b,
            k = a,
            l = d,
            m = this.asSeconds();
        return m ? (0 > m ? "-" : "") + "P" + (g ? g + "Y" : "") + (h ? h + "M" : "") + (i ? i + "D" : "") + (j || k || l ? "T" : "") + (j ? j + "H" : "") + (k ? k + "M" : "") + (l ? l + "S" : "") : "P0D"
    }
    var Qc, Rc, Sc = a.momentProperties = [],
        Tc = !1,
        Uc = {},
        Vc = {},
        Wc = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        Xc = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        Yc = {},
        Zc = {},
        $c = /\d/,
        _c = /\d\d/,
        ad = /\d{3}/,
        bd = /\d{4}/,
        cd = /[+-]?\d{6}/,
        dd = /\d\d?/,
        ed = /\d\d\d\d?/,
        fd = /\d\d\d\d\d\d?/,
        gd = /\d{1,3}/,
        hd = /\d{1,4}/,
        id = /[+-]?\d{1,6}/,
        jd = /\d+/,
        kd = /[+-]?\d+/,
        ld = /Z|[+-]\d\d:?\d\d/gi,
        md = /Z|[+-]\d\d(?::?\d\d)?/gi,
        nd = /[+-]?\d+(\.\d{1,3})?/,
        od = /[0-9]*(a[mn]\s?)?['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\-]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
        pd = {},
        qd = {},
        rd = 0,
        sd = 1,
        td = 2,
        ud = 3,
        vd = 4,
        wd = 5,
        xd = 6,
        yd = 7,
        zd = 8;
    J("M", ["MM", 2], "Mo", function() {
        return this.month() + 1
    }), J("MMM", 0, 0, function(a) {
        return this.localeData().monthsShort(this, a)
    }), J("MMMM", 0, 0, function(a) {
        return this.localeData().months(this, a)
    }), A("month", "M"), O("M", dd), O("MM", dd, _c), O("MMM", od), O("MMMM", od), R(["M", "MM"], function(a, b) {
        b[sd] = r(a) - 1
    }), R(["MMM", "MMMM"], function(a, b, c, d) {
        var e = c._locale.monthsParse(a, d, c._strict);
        null != e ? b[sd] = e : j(c).invalidMonth = a
    });
    var Ad = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/,
        Bd = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        Cd = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sept_Oct_Nov_Dec".split("_"),
        Dd = {};
    a.suppressDeprecationWarnings = !1;
    var Ed = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
        Fd = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
        Gd = /Z|[+-]\d\d(?::?\d\d)?/,
        Hd = [
            ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
            ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
            ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
            ["GGGG-[W]WW", /\d{4}-W\d\d/, !1],
            ["YYYY-DDD", /\d{4}-\d{3}/],
            ["YYYY-MM", /\d{4}-\d\d/, !1],
            ["YYYYYYMMDD", /[+-]\d{10}/],
            ["YYYYMMDD", /\d{8}/],
            ["GGGG[W]WWE", /\d{4}W\d{3}/],
            ["GGGG[W]WW", /\d{4}W\d{2}/, !1],
            ["YYYYDDD", /\d{7}/]
        ],
        Id = [
            ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
            ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
            ["HH:mm:ss", /\d\d:\d\d:\d\d/],
            ["HH:mm", /\d\d:\d\d/],
            ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
            ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
            ["HHmmss", /\d\d\d\d\d\d/],
            ["HHmm", /\d\d\d\d/],
            ["HH", /\d\d/]
        ],
        Jd = /^\/?Date\((\-?\d+)/i;
    a.createFromInputFallback = ba("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(a) {
        a._d = new Date(a._i + (a._useUTC ? " UTC" : ""))
    }), J(0, ["YY", 2], 0, function() {
        return this.year() % 100
    }), J(0, ["YYYY", 4], 0, "year"), J(0, ["YYYYY", 5], 0, "year"), J(0, ["YYYYYY", 6, !0], 0, "year"), A("year", "y"), O("Y", kd), O("YY", dd, _c), O("YYYY", hd, bd), O("YYYYY", id, cd), O("YYYYYY", id, cd), R(["YYYYY", "YYYYYY"], rd), R("YYYY", function(b, c) {
        c[rd] = 2 === b.length ? a.parseTwoDigitYear(b) : r(b)
    }), R("YY", function(b, c) {
        c[rd] = a.parseTwoDigitYear(b)
    }), a.parseTwoDigitYear = function(a) {
        return r(a) + (r(a) > 68 ? 1900 : 2e3)
    };
    var Kd = E("FullYear", !1);
    a.ISO_8601 = function() {};
    var Ld = ba("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function() {
            var a = Aa.apply(null, arguments);
            return this.isValid() && a.isValid() ? this > a ? this : a : l()
        }),
        Md = ba("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function() {
            var a = Aa.apply(null, arguments);
            return this.isValid() && a.isValid() ? a > this ? this : a : l()
        }),
        Nd = Date.now || function() {
            return +new Date
        };
    Ga("Z", ":"), Ga("ZZ", ""), O("Z", md), O("ZZ", md), R(["Z", "ZZ"], function(a, b, c) {
        c._useUTC = !0, c._tzm = Ha(md, a)
    });
    var Od = /([\+\-]|\d\d)/gi;
    a.updateOffset = function() {};
    var Pd = /(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
        Qd = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
    Va.fn = Ea.prototype;
    var Rd = Za(1, "add"),
        Sd = Za(-1, "subtract");
    a.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    var Td = ba("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(a) {
        return void 0 === a ? this.localeData() : this.locale(a)
    });
    J(0, ["gg", 2], 0, function() {
        return this.weekYear() % 100
    }), J(0, ["GG", 2], 0, function() {
        return this.isoWeekYear() % 100
    }), Eb("gggg", "weekYear"), Eb("ggggg", "weekYear"), Eb("GGGG", "isoWeekYear"), Eb("GGGGG", "isoWeekYear"), A("weekYear", "gg"), A("isoWeekYear", "GG"), O("G", kd), O("g", kd), O("GG", dd, _c), O("gg", dd, _c), O("GGGG", hd, bd), O("gggg", hd, bd), O("GGGGG", id, cd), O("ggggg", id, cd), S(["gggg", "ggggg", "GGGG", "GGGGG"], function(a, b, c, d) {
        b[d.substr(0, 2)] = r(a)
    }), S(["gg", "GG"], function(b, c, d, e) {
        c[e] = a.parseTwoDigitYear(b)
    }), J("Q", 0, "Qo", "quarter"), A("quarter", "Q"), O("Q", $c), R("Q", function(a, b) {
        b[sd] = 3 * (r(a) - 1)
    }), J("w", ["ww", 2], "wo", "week"), J("W", ["WW", 2], "Wo", "isoWeek"), A("week", "w"), A("isoWeek", "W"), O("w", dd), O("ww", dd, _c), O("W", dd), O("WW", dd, _c), S(["w", "ww", "W", "WW"], function(a, b, c, d) {
        b[d.substr(0, 1)] = r(a)
    });
    var Ud = {
        dow: 0,
        doy: 6
    };
    J("D", ["DD", 2], "Do", "date"), A("date", "D"), O("D", dd), O("DD", dd, _c), O("Do", function(a, b) {
        return a ? b._ordinalParse : b._ordinalParseLenient
    }), R(["D", "DD"], td), R("Do", function(a, b) {
        b[td] = r(a.match(dd)[0], 10)
    });
    var Vd = E("Date", !0);
    J("d", 0, "do", "day"), J("dd", 0, 0, function(a) {
        return this.localeData().weekdaysMin(this, a)
    }), J("ddd", 0, 0, function(a) {
        return this.localeData().weekdaysShort(this, a)
    }), J("dddd", 0, 0, function(a) {
        return this.localeData().weekdays(this, a)
    }), J("e", 0, 0, "weekday"), J("E", 0, 0, "isoWeekday"), A("day", "d"), A("weekday", "e"), A("isoWeekday", "E"), O("d", dd), O("e", dd), O("E", dd), O("dd", od), O("ddd", od), O("dddd", od), S(["dd", "ddd", "dddd"], function(a, b, c, d) {
        var e = c._locale.weekdaysParse(a, d, c._strict);
        null != e ? b.d = e : j(c).invalidWeekday = a
    }), S(["d", "e", "E"], function(a, b, c, d) {
        b[d] = r(a)
    });
    var Wd = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        Xd = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        Yd = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
    J("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), A("dayOfYear", "DDD"), O("DDD", gd), O("DDDD", ad), R(["DDD", "DDDD"], function(a, b, c) {
        c._dayOfYear = r(a)
    }), J("H", ["HH", 2], 0, "hour"), J("h", ["hh", 2], 0, $b), J("hmm", 0, 0, function() {
        return "" + $b.apply(this) + I(this.minutes(), 2)
    }), J("hmmss", 0, 0, function() {
        return "" + $b.apply(this) + I(this.minutes(), 2) + I(this.seconds(), 2)
    }), J("Hmm", 0, 0, function() {
        return "" + this.hours() + I(this.minutes(), 2)
    }), J("Hmmss", 0, 0, function() {
        return "" + this.hours() + I(this.minutes(), 2) + I(this.seconds(), 2)
    }), _b("a", !0), _b("A", !1), A("hour", "h"), O("a", ac), O("A", ac), O("H", dd), O("h", dd), O("HH", dd, _c), O("hh", dd, _c), O("hmm", ed), O("hmmss", fd), O("Hmm", ed), O("Hmmss", fd), R(["H", "HH"], ud), R(["a", "A"], function(a, b, c) {
        c._isPm = c._locale.isPM(a), c._meridiem = a
    }), R(["h", "hh"], function(a, b, c) {
        b[ud] = r(a), j(c).bigHour = !0
    }), R("hmm", function(a, b, c) {
        var d = a.length - 2;
        b[ud] = r(a.substr(0, d)), b[vd] = r(a.substr(d)), j(c).bigHour = !0
    }), R("hmmss", function(a, b, c) {
        var d = a.length - 4,
            e = a.length - 2;
        b[ud] = r(a.substr(0, d)), b[vd] = r(a.substr(d, 2)), b[wd] = r(a.substr(e)), j(c).bigHour = !0
    }), R("Hmm", function(a, b, c) {
        var d = a.length - 2;
        b[ud] = r(a.substr(0, d)), b[vd] = r(a.substr(d))
    }), R("Hmmss", function(a, b, c) {
        var d = a.length - 4,
            e = a.length - 2;
        b[ud] = r(a.substr(0, d)), b[vd] = r(a.substr(d, 2)), b[wd] = r(a.substr(e))
    });
    var Zd = /[ap]\.?m?\.?/i,
        $d = E("Hours", !0);
    J("m", ["mm", 2], 0, "minute"), A("minute", "m"), O("m", dd), O("mm", dd, _c), R(["m", "mm"], vd);
    var _d = E("Minutes", !1);
    J("s", ["ss", 2], 0, "second"), A("second", "s"), O("s", dd), O("ss", dd, _c), R(["s", "ss"], wd);
    var ae = E("Seconds", !1);
    J("S", 0, 0, function() {
        return ~~(this.millisecond() / 100)
    }), J(0, ["SS", 2], 0, function() {
        return ~~(this.millisecond() / 10)
    }), J(0, ["SSS", 3], 0, "millisecond"), J(0, ["SSSS", 4], 0, function() {
        return 10 * this.millisecond()
    }), J(0, ["SSSSS", 5], 0, function() {
        return 100 * this.millisecond()
    }), J(0, ["SSSSSS", 6], 0, function() {
        return 1e3 * this.millisecond()
    }), J(0, ["SSSSSSS", 7], 0, function() {
        return 1e4 * this.millisecond()
    }), J(0, ["SSSSSSSS", 8], 0, function() {
        return 1e5 * this.millisecond()
    }), J(0, ["SSSSSSSSS", 9], 0, function() {
        return 1e6 * this.millisecond()
    }), A("millisecond", "ms"), O("S", gd, $c), O("SS", gd, _c), O("SSS", gd, ad);
    var be;
    for (be = "SSSS"; be.length <= 9; be += "S") O(be, jd);
    for (be = "S"; be.length <= 9; be += "S") R(be, dc);
    var ce = E("Milliseconds", !1);
    J("z", 0, 0, "zoneAbbr"), J("zz", 0, 0, "zoneName");
    var de = o.prototype;
    de.add = Rd, de.calendar = _a, de.clone = ab, de.diff = hb, de.endOf = tb, de.format = lb, de.from = mb, de.fromNow = nb, de.to = ob, de.toNow = pb, de.get = H, de.invalidAt = Cb, de.isAfter = bb, de.isBefore = cb, de.isBetween = db, de.isSame = eb, de.isSameOrAfter = fb, de.isSameOrBefore = gb, de.isValid = Ab, de.lang = Td, de.locale = qb, de.localeData = rb, de.max = Md, de.min = Ld, de.parsingFlags = Bb, de.set = H, de.startOf = sb, de.subtract = Sd, de.toArray = xb, de.toObject = yb, de.toDate = wb, de.toISOString = kb, de.toJSON = zb, de.toString = jb, de.unix = vb, de.valueOf = ub, de.creationData = Db, de.year = Kd, de.isLeapYear = ja, de.weekYear = Fb, de.isoWeekYear = Gb, de.quarter = de.quarters = Lb, de.month = Z, de.daysInMonth = $, de.week = de.weeks = Pb, de.isoWeek = de.isoWeeks = Qb, de.weeksInYear = Ib, de.isoWeeksInYear = Hb, de.date = Vd, de.day = de.days = Wb, de.weekday = Xb, de.isoWeekday = Yb, de.dayOfYear = Zb, de.hour = de.hours = $d, de.minute = de.minutes = _d, de.second = de.seconds = ae, de.millisecond = de.milliseconds = ce, de.utcOffset = Ka, de.utc = Ma, de.local = Na, de.parseZone = Oa, de.hasAlignedHourOffset = Pa, de.isDST = Qa, de.isDSTShifted = Ra, de.isLocal = Sa, de.isUtcOffset = Ta, de.isUtc = Ua, de.isUTC = Ua, de.zoneAbbr = ec, de.zoneName = fc, de.dates = ba("dates accessor is deprecated. Use date instead.", Vd), de.months = ba("months accessor is deprecated. Use month instead", Z), de.years = ba("years accessor is deprecated. Use year instead", Kd), de.zone = ba("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", La);
    var ee = de,
        fe = {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        ge = {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY h:mm A",
            LLLL: "dddd, MMMM D, YYYY h:mm A"
        },
        he = "Invalid date",
        ie = "%d",
        je = /\d{1,2}/,
        ke = {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        le = t.prototype;
    le._calendar = fe, le.calendar = ic, le._longDateFormat = ge, le.longDateFormat = jc, le._invalidDate = he, le.invalidDate = kc, le._ordinal = ie, le.ordinal = lc, le._ordinalParse = je, le.preparse = mc, le.postformat = mc, le._relativeTime = ke, le.relativeTime = nc, le.pastFuture = oc, le.set = pc, le.months = V, le._months = Bd, le.monthsShort = W, le._monthsShort = Cd, le.monthsParse = X, le.week = Mb, le._week = Ud, le.firstDayOfYear = Ob, le.firstDayOfWeek = Nb, le.weekdays = Sb, le._weekdays = Wd, le.weekdaysMin = Ub, le._weekdaysMin = Yd, le.weekdaysShort = Tb, le._weekdaysShort = Xd, le.weekdaysParse = Vb, le.isPM = bc, le._meridiemParse = Zd, le.meridiem = cc, x("en", {
        monthsParse: [/^jan/i, /^feb/i, /^mar/i, /^apr/i, /^may/i, /^jun/i, /^jul/i, /^aug/i, /^sep/i, /^oct/i, /^nov/i, /^dec/i],
        longMonthsParse: [/^january$/i, /^february$/i, /^march$/i, /^april$/i, /^may$/i, /^june$/i, /^july$/i, /^august$/i, /^september$/i, /^october$/i, /^november$/i, /^december$/i],
        shortMonthsParse: [/^jan$/i, /^feb$/i, /^mar$/i, /^apr$/i, /^may$/i, /^jun$/i, /^jul$/i, /^aug/i, /^sept?$/i, /^oct$/i, /^nov$/i, /^dec$/i],
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(a) {
            var b = a % 10,
                c = 1 === r(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), a.lang = ba("moment.lang is deprecated. Use moment.locale instead.", x), a.langData = ba("moment.langData is deprecated. Use moment.localeData instead.", z);
    var me = Math.abs,
        ne = Hc("ms"),
        oe = Hc("s"),
        pe = Hc("m"),
        qe = Hc("h"),
        re = Hc("d"),
        se = Hc("w"),
        te = Hc("M"),
        ue = Hc("y"),
        ve = Jc("milliseconds"),
        we = Jc("seconds"),
        xe = Jc("minutes"),
        ye = Jc("hours"),
        ze = Jc("days"),
        Ae = Jc("months"),
        Be = Jc("years"),
        Ce = Math.round,
        De = {
            s: 45,
            m: 45,
            h: 22,
            d: 26,
            M: 11
        },
        Ee = Math.abs,
        Fe = Ea.prototype;
    Fe.abs = xc, Fe.add = zc, Fe.subtract = Ac, Fe.as = Fc, Fe.asMilliseconds = ne, Fe.asSeconds = oe, Fe.asMinutes = pe, Fe.asHours = qe, Fe.asDays = re, Fe.asWeeks = se, Fe.asMonths = te, Fe.asYears = ue, Fe.valueOf = Gc, Fe._bubble = Cc, Fe.get = Ic, Fe.milliseconds = ve, Fe.seconds = we, Fe.minutes = xe, Fe.hours = ye, Fe.days = ze, Fe.weeks = Kc, Fe.months = Ae, Fe.years = Be, Fe.humanize = Oc, Fe.toISOString = Pc, Fe.toString = Pc, Fe.toJSON = Pc, Fe.locale = qb, Fe.localeData = rb, Fe.toIsoString = ba("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Pc), Fe.lang = Td, J("X", 0, 0, "unix"), J("x", 0, 0, "valueOf"), O("x", kd), O("X", nd), R("X", function(a, b, c) {
        c._d = new Date(1e3 * parseFloat(a, 10))
    }), R("x", function(a, b, c) {
        c._d = new Date(r(a))
    }), a.version = "2.11.0", b(Aa), a.fn = ee, a.min = Ca, a.max = Da, a.now = Nd, a.utc = h, a.unix = gc, a.months = sc, a.isDate = d, a.locale = x, a.invalid = l, a.duration = Va, a.isMoment = p, a.weekdays = uc, a.parseZone = hc, a.localeData = z, a.isDuration = Fa, a.monthsShort = tc, a.weekdaysMin = wc, a.defineLocale = y, a.weekdaysShort = vc, a.normalizeUnits = B, a.relativeTimeThreshold = Nc, a.prototype = ee;
    var Ge = a;
    return Ge
});
/*!
 * Lightbox for Bootstrap 3 by @ashleydw
 * https://github.com/ashleydw/lightbox
 *
 * License: https://github.com/ashleydw/lightbox/blob/master/LICENSE
 */
(function(){"use strict";var a,b;a=jQuery,b=function(b,c){var d,e,f;return this.options=a.extend({title:null,footer:null,remote:null},a.fn.ekkoLightbox.defaults,c||{}),this.$element=a(b),d="",this.modal_id=this.options.modal_id?this.options.modal_id:"ekkoLightbox-"+Math.floor(1e3*Math.random()+1),f='<div class="modal-header"'+(this.options.title||this.options.always_show_close?"":' style="display:none"')+'><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">'+(this.options.title||"&nbsp;")+"</h4></div>",e='<div class="modal-footer"'+(this.options.footer?"":' style="display:none"')+">"+this.options.footer+"</div>",a(document.body).append('<div id="'+this.modal_id+'" class="ekko-lightbox modal fade" tabindex="-1"><div class="modal-dialog"><div class="modal-content">'+f+'<div class="modal-body"><div class="ekko-lightbox-container"><div></div></div></div>'+e+"</div></div></div>"),this.modal=a("#"+this.modal_id),this.modal_dialog=this.modal.find(".modal-dialog").first(),this.modal_content=this.modal.find(".modal-content").first(),this.modal_body=this.modal.find(".modal-body").first(),this.modal_header=this.modal.find(".modal-header").first(),this.modal_footer=this.modal.find(".modal-footer").first(),this.lightbox_container=this.modal_body.find(".ekko-lightbox-container").first(),this.lightbox_body=this.lightbox_container.find("> div:first-child").first(),this.showLoading(),this.modal_arrows=null,this.border={top:parseFloat(this.modal_dialog.css("border-top-width"))+parseFloat(this.modal_content.css("border-top-width"))+parseFloat(this.modal_body.css("border-top-width")),right:parseFloat(this.modal_dialog.css("border-right-width"))+parseFloat(this.modal_content.css("border-right-width"))+parseFloat(this.modal_body.css("border-right-width")),bottom:parseFloat(this.modal_dialog.css("border-bottom-width"))+parseFloat(this.modal_content.css("border-bottom-width"))+parseFloat(this.modal_body.css("border-bottom-width")),left:parseFloat(this.modal_dialog.css("border-left-width"))+parseFloat(this.modal_content.css("border-left-width"))+parseFloat(this.modal_body.css("border-left-width"))},this.padding={top:parseFloat(this.modal_dialog.css("padding-top"))+parseFloat(this.modal_content.css("padding-top"))+parseFloat(this.modal_body.css("padding-top")),right:parseFloat(this.modal_dialog.css("padding-right"))+parseFloat(this.modal_content.css("padding-right"))+parseFloat(this.modal_body.css("padding-right")),bottom:parseFloat(this.modal_dialog.css("padding-bottom"))+parseFloat(this.modal_content.css("padding-bottom"))+parseFloat(this.modal_body.css("padding-bottom")),left:parseFloat(this.modal_dialog.css("padding-left"))+parseFloat(this.modal_content.css("padding-left"))+parseFloat(this.modal_body.css("padding-left"))},this.modal.on("show.bs.modal",this.options.onShow.bind(this)).on("shown.bs.modal",function(a){return function(){return a.modal_shown(),a.options.onShown.call(a)}}(this)).on("hide.bs.modal",this.options.onHide.bind(this)).on("hidden.bs.modal",function(b){return function(){return b.gallery&&a(document).off("keydown.ekkoLightbox"),b.modal.remove(),b.options.onHidden.call(b)}}(this)).modal("show",c),this.modal},b.prototype={modal_shown:function(){var b;return this.options.remote?(this.gallery=this.$element.data("gallery"),this.gallery&&("document.body"===this.options.gallery_parent_selector||""===this.options.gallery_parent_selector?this.gallery_items=a(document.body).find('*[data-gallery="'+this.gallery+'"]'):this.gallery_items=this.$element.parents(this.options.gallery_parent_selector).first().find('*[data-gallery="'+this.gallery+'"]'),this.gallery_index=this.gallery_items.index(this.$element),a(document).on("keydown.ekkoLightbox",this.navigate.bind(this)),this.options.directional_arrows&&this.gallery_items.length>1&&(this.lightbox_container.append('<div class="ekko-lightbox-nav-overlay"><a href="#" class="'+this.strip_stops(this.options.left_arrow_class)+'"></a><a href="#" class="'+this.strip_stops(this.options.right_arrow_class)+'"></a></div>'),this.modal_arrows=this.lightbox_container.find("div.ekko-lightbox-nav-overlay").first(),this.lightbox_container.find("a"+this.strip_spaces(this.options.left_arrow_class)).on("click",function(a){return function(b){return b.preventDefault(),a.navigate_left()}}(this)),this.lightbox_container.find("a"+this.strip_spaces(this.options.right_arrow_class)).on("click",function(a){return function(b){return b.preventDefault(),a.navigate_right()}}(this)))),this.options.type?"image"===this.options.type?this.preloadImage(this.options.remote,!0):"youtube"===this.options.type&&(b=this.getYoutubeId(this.options.remote))?this.showYoutubeVideo(b):"vimeo"===this.options.type?this.showVimeoVideo(this.options.remote):"instagram"===this.options.type?this.showInstagramVideo(this.options.remote):"url"===this.options.type?this.loadRemoteContent(this.options.remote):"video"===this.options.type?this.showVideoIframe(this.options.remote):this.error('Could not detect remote target type. Force the type using data-type="image|youtube|vimeo|instagram|url|video"'):this.detectRemoteType(this.options.remote)):this.error("No remote target given")},strip_stops:function(a){return a.replace(/\./g,"")},strip_spaces:function(a){return a.replace(/\s/g,"")},isImage:function(a){return a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)},isSwf:function(a){return a.match(/\.(swf)((\?|#).*)?$/i)},getYoutubeId:function(a){var b;return b=a.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/),b&&11===b[2].length?b[2]:!1},getVimeoId:function(a){return a.indexOf("vimeo")>0?a:!1},getInstagramId:function(a){return a.indexOf("instagram")>0?a:!1},navigate:function(a){if(a=a||window.event,39===a.keyCode||37===a.keyCode){if(39===a.keyCode)return this.navigate_right();if(37===a.keyCode)return this.navigate_left()}},navigateTo:function(b){var c,d;return 0>b||b>this.gallery_items.length-1?this:(this.showLoading(),this.gallery_index=b,this.$element=a(this.gallery_items.get(this.gallery_index)),this.updateTitleAndFooter(),d=this.$element.attr("data-remote")||this.$element.attr("href"),this.detectRemoteType(d,this.$element.attr("data-type")||!1),this.gallery_index+1<this.gallery_items.length&&(c=a(this.gallery_items.get(this.gallery_index+1),!1),d=c.attr("data-remote")||c.attr("href"),"image"===c.attr("data-type")||this.isImage(d))?this.preloadImage(d,!1):void 0)},navigate_left:function(){return 1!==this.gallery_items.length?(0===this.gallery_index?this.gallery_index=this.gallery_items.length-1:this.gallery_index--,this.options.onNavigate.call(this,"left",this.gallery_index),this.navigateTo(this.gallery_index)):void 0},navigate_right:function(){return 1!==this.gallery_items.length?(this.gallery_index===this.gallery_items.length-1?this.gallery_index=0:this.gallery_index++,this.options.onNavigate.call(this,"right",this.gallery_index),this.navigateTo(this.gallery_index)):void 0},detectRemoteType:function(a,b){var c;return b=b||!1,"image"===b||this.isImage(a)?(this.options.type="image",this.preloadImage(a,!0)):"youtube"===b||(c=this.getYoutubeId(a))?(this.options.type="youtube",this.showYoutubeVideo(c)):"vimeo"===b||(c=this.getVimeoId(a))?(this.options.type="vimeo",this.showVimeoVideo(c)):"instagram"===b||(c=this.getInstagramId(a))?(this.options.type="instagram",this.showInstagramVideo(c)):"video"===b?(this.options.type="video",this.showVideoIframe(a)):(this.options.type="url",this.loadRemoteContent(a))},updateTitleAndFooter:function(){var a,b,c,d;return c=this.modal_content.find(".modal-header"),b=this.modal_content.find(".modal-footer"),d=this.$element.data("title")||"",a=this.$element.data("footer")||"",d||this.options.always_show_close?c.css("display","").find(".modal-title").html(d||"&nbsp;"):c.css("display","none"),a?b.css("display","").html(a):b.css("display","none"),this},showLoading:function(){return this.lightbox_body.html('<div class="modal-loading">'+this.options.loadingMessage+"</div>"),this},showYoutubeVideo:function(a){var b,c,d;return c=null!=this.$element.attr("data-norelated")||this.options.no_related?"&rel=0":"",d=this.checkDimensions(this.$element.data("width")||560),b=d/(560/315),this.showVideoIframe("//www.youtube.com/embed/"+a+"?badge=0&autoplay=1&html5=1"+c,d,b)},showVimeoVideo:function(a){var b,c;return c=this.checkDimensions(this.$element.data("width")||560),b=c/(500/281),this.showVideoIframe(a+"?autoplay=1",c,b)},showInstagramVideo:function(a){var b,c;return c=this.checkDimensions(this.$element.data("width")||612),this.resize(c),b=c+80,this.lightbox_body.html('<iframe width="'+c+'" height="'+b+'" src="'+this.addTrailingSlash(a)+'embed/" frameborder="0" allowfullscreen></iframe>'),this.options.onContentLoaded.call(this),this.modal_arrows?this.modal_arrows.css("display","none"):void 0},showVideoIframe:function(a,b,c){return c=c||b,this.resize(b),this.lightbox_body.html('<div class="embed-responsive embed-responsive-16by9"><iframe width="'+b+'" height="'+c+'" src="'+a+'" frameborder="0" allowfullscreen class="embed-responsive-item"></iframe></div>'),this.options.onContentLoaded.call(this),this.modal_arrows&&this.modal_arrows.css("display","none"),this},loadRemoteContent:function(b){var c,d;return d=this.$element.data("width")||560,this.resize(d),c=this.$element.data("disableExternalCheck")||!1,c||this.isExternal(b)?(this.lightbox_body.html('<iframe width="'+d+'" height="'+d+'" src="'+b+'" frameborder="0" allowfullscreen></iframe>'),this.options.onContentLoaded.call(this)):this.lightbox_body.load(b,a.proxy(function(a){return function(){return a.$element.trigger("loaded.bs.modal")}}(this))),this.modal_arrows&&this.modal_arrows.css("display","none"),this},isExternal:function(a){var b;return b=a.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/),"string"==typeof b[1]&&b[1].length>0&&b[1].toLowerCase()!==location.protocol?!0:"string"==typeof b[2]&&b[2].length>0&&b[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"),"")!==location.host},error:function(a){return this.lightbox_body.html(a),this},preloadImage:function(b,c){var d;return d=new Image,null!=c&&c!==!0||(d.onload=function(b){return function(){var c;return c=a("<img />"),c.attr("src",d.src),c.addClass("img-responsive"),b.lightbox_body.html(c),b.modal_arrows&&b.modal_arrows.css("display","block"),c.load(function(){return b.options.scale_height?b.scaleHeight(d.height,d.width):b.resize(d.width),b.options.onContentLoaded.call(b)})}}(this),d.onerror=function(a){return function(){return a.error("Failed to load image: "+b)}}(this)),d.src=b,d},scaleHeight:function(b,c){var d,e,f,g,h,i;return g=this.modal_header.outerHeight(!0)||0,f=this.modal_footer.outerHeight(!0)||0,this.modal_footer.is(":visible")||(f=0),this.modal_header.is(":visible")||(g=0),d=this.border.top+this.border.bottom+this.padding.top+this.padding.bottom,h=parseFloat(this.modal_dialog.css("margin-top"))+parseFloat(this.modal_dialog.css("margin-bottom")),i=a(window).height()-d-h-g-f,e=Math.min(i/b,1),this.modal_dialog.css("height","auto").css("max-height",i),this.resize(e*c)},resize:function(b){var c;return c=b+this.border.left+this.padding.left+this.padding.right+this.border.right,this.modal_dialog.css("width","auto").css("max-width",c),this.lightbox_container.find("a").css("line-height",function(){return a(this).parent().height()+"px"}),this},checkDimensions:function(a){var b,c;return c=a+this.border.left+this.padding.left+this.padding.right+this.border.right,b=document.body.clientWidth,c>b&&(a=this.modal_body.width()),a},close:function(){return this.modal.modal("hide")},addTrailingSlash:function(a){return"/"!==a.substr(-1)&&(a+="/"),a}},a.fn.ekkoLightbox=function(c){return this.each(function(){var d;return d=a(this),c=a.extend({remote:d.attr("data-remote")||d.attr("href"),gallery_parent_selector:d.attr("data-parent"),type:d.attr("data-type")},c,d.data()),new b(this,c),this})},a.fn.ekkoLightbox.defaults={gallery_parent_selector:"document.body",left_arrow_class:".glyphicon .glyphicon-chevron-left",right_arrow_class:".glyphicon .glyphicon-chevron-right",directional_arrows:!0,type:null,always_show_close:!0,no_related:!1,scale_height:!0,loadingMessage:"Loading...",onShow:function(){},onShown:function(){},onHide:function(){},onHidden:function(){},onNavigate:function(){},onContentLoaded:function(){}}}).call(this);
//ResizeSensor.js and ElementQueries.js - https://github.com/marcj/css-element-queries

/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.ResizeSensor = factory();
    }
}(this, function () {

    // Only used for the dirty checking, so the event callback count is limted to max 1 call per fps per sensor.
    // In combination with the event based resize sensor this saves cpu time, because the sensor is too fast and
    // would generate too many unnecessary events.
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) {
            return window.setTimeout(fn, 20);
        };

    /**
     * Iterate over each of the provided element(s).
     *
     * @param {HTMLElement|HTMLElement[]} elements
     * @param {Function}                  callback
     */
    function forEachElement(elements, callback){
        var elementsType = Object.prototype.toString.call(elements);
        var isCollectionTyped = ('[object Array]' === elementsType
            || ('[object NodeList]' === elementsType)
            || ('[object HTMLCollection]' === elementsType)
            || ('undefined' !== typeof jQuery && elements instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && elements instanceof Elements) //mootools
        );
        var i = 0, j = elements.length;
        if (isCollectionTyped) {
            for (; i < j; i++) {
                callback(elements[i]);
            }
        } else {
            callback(elements);
        }
    }

    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    var ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            var q = [];
            this.add = function(ev) {
                q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i = 0, j = q.length; i < j; i++) {
                    q[i].call();
                }
            };

            this.remove = function(ev) {
                var newQueue = [];
                for(i = 0, j = q.length; i < j; i++) {
                    if(q[i] !== ev) newQueue.push(q[i]);
                }
                q = newQueue;
            }

            this.length = function() {
                return q.length;
            }
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (getComputedStyle(element, 'position') == 'static') {
                element.style.position = 'relative';
            }

            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];

            var reset = function() {
                expandChild.style.width  = 100000 + 'px';
                expandChild.style.height = 100000 + 'px';

                expand.scrollLeft = 100000;
                expand.scrollTop = 100000;

                shrink.scrollLeft = 100000;
                shrink.scrollTop = 100000;
            };

            reset();
            var dirty = false;

            var dirtyChecking = function() {
                if (!element.resizedAttached) return;

                if (dirty) {
                    element.resizedAttached.call();
                    dirty = false;
                }

                requestAnimationFrame(dirtyChecking);
            };

            requestAnimationFrame(dirtyChecking);
            var lastWidth, lastHeight;
            var cachedWidth, cachedHeight; //useful to not query offsetWidth twice

            var onScroll = function() {
              if ((cachedWidth = element.offsetWidth) != lastWidth || (cachedHeight = element.offsetHeight) != lastHeight) {
                  dirty = true;

                  lastWidth = cachedWidth;
                  lastHeight = cachedHeight;
              }
              reset();
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);
        }

        forEachElement(element, function(elem){
            attachResizeEvent(elem, callback);
        });

        this.detach = function(ev) {
            ResizeSensor.detach(element, ev);
        };
    };

    ResizeSensor.detach = function(element, ev) {
        forEachElement(element, function(elem){
            if(elem.resizedAttached && typeof ev == "function"){
                elem.resizedAttached.remove(ev);
                if(elem.resizedAttached.length()) return;
            }
            if (elem.resizeSensor) {
                if (elem.contains(elem.resizeSensor)) {
                    elem.removeChild(elem.resizeSensor);
                }
                delete elem.resizeSensor;
                delete elem.resizedAttached;
            }
        });
    };

    return ResizeSensor;

}));

/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(['./ResizeSensor.js'], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require('./ResizeSensor.js'));
    } else {
        root.ElementQueries = factory(root.ResizeSensor);
    }
}(this, function (ResizeSensor) {

    /**
     *
     * @type {Function}
     * @constructor
     */
    var ElementQueries = function() {

        var trackingActive = false;
        var elements = [];

        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = window.getComputedStyle(element, null).fontSize;
            return parseFloat(fontSize) || 16;
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param {HTMLElement} element
         * @param {*} value
         * @returns {*}
         */
        function convertToPx(element, value) {
            var numbers = value.split(/\d/);
            var units = numbers[numbers.length-1];
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    return value * getEmSize(element);
                case "rem":
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element) {
            this.element = element;
            this.options = {};
            var key, option, width = 0, height = 0, value, actualValue, attrValues, attrValue, attrName;

            /**
             * @param {Object} option {mode: 'min|max', property: 'width|height', value: '123px'}
             */
            this.addOption = function(option) {
                var idx = [option.mode, option.property, option.value].join(',');
                this.options[idx] = option;
            };

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function() {
                // extract current dimensions
                width = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (key in this.options) {
                    if (!this.options.hasOwnProperty(key)){
                        continue;
                    }
                    option = this.options[key];

                    value = convertToPx(this.element, option.value);

                    actualValue = option.property == 'width' ? width : height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode == 'min' && actualValue >= value) {
                        attrValue += option.value;
                    }

                    if (option.mode == 'max' && actualValue <= value) {
                        attrValue += option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    if (attrValue && -1 === (' '+attrValues[attrName]+' ').indexOf(' ' + attrValue + ' ')) {
                        attrValues[attrName] += ' ' + attrValue;
                    }
                }

                for (var k in attributes) {
                    if(!attributes.hasOwnProperty(k)) continue;

                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k], attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      options
         */
        function setupElement(element, options) {
            if (element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation.addOption(options);
            } else {
                element.elementQueriesSetupInformation = new SetupInformation(element);
                element.elementQueriesSetupInformation.addOption(options);
                element.elementQueriesSensor = new ResizeSensor(element, function() {
                    element.elementQueriesSetupInformation.call();
                });
            }
            element.elementQueriesSetupInformation.call();

            if (trackingActive && elements.indexOf(element) < 0) {
                elements.push(element);
            }
        }

        /**
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        var allQueries = {};
        function queueQuery(selector, mode, property, value) {
            if (typeof(allQueries[mode]) == 'undefined') allQueries[mode] = {};
            if (typeof(allQueries[mode][property]) == 'undefined') allQueries[mode][property] = {};
            if (typeof(allQueries[mode][property][value]) == 'undefined') allQueries[mode][property][value] = selector;
            else allQueries[mode][property][value] += ','+selector;
        }

        function getQuery() {
            var query;
            if (document.querySelectorAll) query = document.querySelectorAll.bind(document);
            if (!query && 'undefined' !== typeof $$) query = $$;
            if (!query && 'undefined' !== typeof jQuery) query = jQuery;

            if (!query) {
                throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
            }

            return query;
        }

        /**
         * Start the magic. Go through all collected rules (readRules()) and attach the resize-listener.
         */
        function findElementQueriesElements() {
            var query = getQuery();

            for (var mode in allQueries) if (allQueries.hasOwnProperty(mode)) {

                for (var property in allQueries[mode]) if (allQueries[mode].hasOwnProperty(property)) {
                    for (var value in allQueries[mode][property]) if (allQueries[mode][property].hasOwnProperty(value)) {
                        var elements = query(allQueries[mode][property][value]);
                        for (var i = 0, j = elements.length; i < j; i++) {
                            setupElement(elements[i], {
                                mode: mode,
                                property: property,
                                value: value
                            });
                        }
                    }
                }

            }
        }

        /**
         *
         * @param {HTMLElement} element
         */
        function attachResponsiveImage(element) {
            var children = [];
            var rules = [];
            var sources = [];
            var defaultImageId = 0;
            var lastActiveImage = -1;
            var loadedImages = [];

            for (var i in element.children) {
                if(!element.children.hasOwnProperty(i)) continue;

                if (element.children[i].tagName && element.children[i].tagName.toLowerCase() === 'img') {
                    children.push(element.children[i]);

                    var minWidth = element.children[i].getAttribute('min-width') || element.children[i].getAttribute('data-min-width');
                    //var minHeight = element.children[i].getAttribute('min-height') || element.children[i].getAttribute('data-min-height');
                    var src = element.children[i].getAttribute('data-src') || element.children[i].getAttribute('url');

                    sources.push(src);

                    var rule = {
                        minWidth: minWidth
                    };

                    rules.push(rule);

                    if (!minWidth) {
                        defaultImageId = children.length - 1;
                        element.children[i].style.display = 'block';
                    } else {
                        element.children[i].style.display = 'none';
                    }
                }
            }

            lastActiveImage = defaultImageId;

            function check() {
                var imageToDisplay = false, i;

                for (i in children){
                    if(!children.hasOwnProperty(i)) continue;

                    if (rules[i].minWidth) {
                        if (element.offsetWidth > rules[i].minWidth) {
                            imageToDisplay = i;
                        }
                    }
                }

                if (!imageToDisplay) {
                    //no rule matched, show default
                    imageToDisplay = defaultImageId;
                }

                if (lastActiveImage != imageToDisplay) {
                    //image change

                    if (!loadedImages[imageToDisplay]){
                        //image has not been loaded yet, we need to load the image first in memory to prevent flash of
                        //no content

                        var image = new Image();
                        image.onload = function() {
                            children[imageToDisplay].src = sources[imageToDisplay];

                            children[lastActiveImage].style.display = 'none';
                            children[imageToDisplay].style.display = 'block';

                            loadedImages[imageToDisplay] = true;

                            lastActiveImage = imageToDisplay;
                        };

                        image.src = sources[imageToDisplay];
                    } else {
                        children[lastActiveImage].style.display = 'none';
                        children[imageToDisplay].style.display = 'block';
                        lastActiveImage = imageToDisplay;
                    }
                } else {
                    //make sure for initial check call the .src is set correctly
                    children[imageToDisplay].src = sources[imageToDisplay];
                }
            }

            element.resizeSensor = new ResizeSensor(element, check);
            check();

            if (trackingActive) {
                elements.push(element);
            }
        }

        function findResponsiveImages(){
            var query = getQuery();

            var elements = query('[data-responsive-image],[responsive-image]');
            for (var i = 0, j = elements.length; i < j; i++) {
                attachResponsiveImage(elements[i]);
            }
        }

        var regex = /,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:min|max)-(?:width|height)[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/mgi;
        var attrRegex = /\[[\s\t]*?(min|max)-(width|height)[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/mgi;
        /**
         * @param {String} css
         */
        function extractQuery(css) {
            var match;
            var smatch;
            css = css.replace(/'/g, '"');
            while (null !== (match = regex.exec(css))) {
                smatch = match[1] + match[3];
                attrs = match[2];

                while (null !== (attrMatch = attrRegex.exec(attrs))) {
                    queueQuery(smatch, attrMatch[1], attrMatch[2], attrMatch[3]);
                }
            }
        }

        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var selector = '';
            if (!rules) {
                return;
            }
            if ('string' === typeof rules) {
                rules = rules.toLowerCase();
                if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf('max-width')) {
                    extractQuery(rules);
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (-1 !== selector.indexOf('min-height') || -1 !== selector.indexOf('max-height')) {
                            extractQuery(selector);
                        }else if(-1 !== selector.indexOf('min-width') || -1 !== selector.indexOf('max-width')) {
                            extractQuery(selector);
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    }
                }
            }
        }

        var defaultCssInjected = false;

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.init = function(withTracking) {
            trackingActive = typeof withTracking === 'undefined' ? false : withTracking;

            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                try {
                    readRules(document.styleSheets[i].cssRules || document.styleSheets[i].rules || document.styleSheets[i].cssText);
                } catch(e) {
                    if (e.name !== 'SecurityError') {
                        throw e;
                    }
                }
            }

            if (!defaultCssInjected) {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '[responsive-image] > img, [data-responsive-image] {overflow: hidden; padding: 0; } [responsive-image] > img, [data-responsive-image] > img { width: 100%;}';
                document.getElementsByTagName('head')[0].appendChild(style);
                defaultCssInjected = true;
            }

            findElementQueriesElements();
            findResponsiveImages();
        };

        /**
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.update = function(withTracking) {
            this.init(withTracking);
        };

        this.detach = function() {
            if (!this.withTracking) {
                throw 'withTracking is not enabled. We can not detach elements since we don not store it.' +
                'Use ElementQueries.withTracking = true; before domready or call ElementQueryes.update(true).';
            }

            var element;
            while (element = elements.pop()) {
                ElementQueries.detach(element);
            }

            elements = [];
        };
    };

    /**
     *
     * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
     *                               (no garbage collection possible if you don not call .detach() first)
     */
    ElementQueries.update = function(withTracking) {
        ElementQueries.instance.update(withTracking);
    };

    /**
     * Removes all sensor and elementquery information from the element.
     *
     * @param {HTMLElement} element
     */
    ElementQueries.detach = function(element) {
        if (element.elementQueriesSetupInformation) {
            //element queries
            element.elementQueriesSensor.detach();
            delete element.elementQueriesSetupInformation;
            delete element.elementQueriesSensor;

        } else if (element.resizeSensor) {
            //responsive image

            element.resizeSensor.detach();
            delete element.resizeSensor;
        } else {
            //console.log('detached already', element);
        }
    };

    ElementQueries.withTracking = false;

    ElementQueries.init = function() {
        if (!ElementQueries.instance) {
            ElementQueries.instance = new ElementQueries();
        }

        ElementQueries.instance.init(ElementQueries.withTracking);
    };

    var domLoaded = function (callback) {
        /* Internet Explorer */
        /*@cc_on
         @if (@_win32 || @_win64)
         document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
         document.getElementById('ieScriptLoad').onreadystatechange = function() {
         if (this.readyState == 'complete') {
         callback();
         }
         };
         @end @*/
        /* Mozilla, Chrome, Opera */
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
        /* Safari, iCab, Konqueror */
        else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
            var DOMLoadTimer = setInterval(function () {
                if (/loaded|complete/i.test(document.readyState)) {
                    callback();
                    clearInterval(DOMLoadTimer);
                }
            }, 10);
        }
        /* Other web browsers */
        else window.onload = callback;
    };

    ElementQueries.listen = function() {
        domLoaded(ElementQueries.init);
    };

    // make available to common module loader
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = ElementQueries;
    }
    else {
        window.ElementQueries = ElementQueries;
        ElementQueries.listen();
    }

    return ElementQueries;

}));
/*
	Equalizer v1.2.5 minified using Google Closure Compiler
	https://github.com/CSS-Tricks/Equalizer
*/
;
(function(d) {
    d.equalizer = function(f, e) {
        var b, a = this;
        a.$el = d(f);
        a.$el.data("equalizer", a);
        a.init = function() {
            a.options = b = d.extend({}, d.equalizer.defaultOptions, e);
            a.$col = a.$el.find(b.columns);
            var c = a.$col.find(".equalizer-inner").length;
            b.min = parseInt(b.min, 10) || 0;
            b.max = parseInt(b.max, 10) || 0;
            a.hasMax = 0 === b.max ? !1 : !0;
            a.hasMin = 0 === b.min ? !1 : !0;
            a.curRowTop = 0;
            a.isEnabled = !0;
            a.useHeight = /^o/.test(b.useHeight) ? "outerHeight" : /^i/.test(b.useHeight) ? "innerHeight" : "height";
            c || a.$col.wrapInner('<span class="equalizer-inner" style="display:block;" />');
            !c && b.resizeable && d(window).resize(function() {
                clearTimeout(a.throttle);
                a.throttle = setTimeout(function() {
                    b.breakpoint && a.checkBreakpoint();
                    a.update()
                }, 100)
            });
            a.$el.unbind("enable.equalizer disable.equalizer").bind("enable.equalizer disable.equalizer", function(b) {
                a.enable("enable" === b.type)
            });
            a.checkBreakpoint();
            a.update()
        };
        a.checkBreakpoint = function() {
            var c = b.breakpoint && a.$el.width() || 0;
            c && c < b.breakpoint ? a.suspend(!1) : c && a.$el.hasClass(b.disabled) && c > b.breakpoint && a.suspend()
        };
        a.checkBoxSizing = function() {
            var b = d.fn.jquery.split(".");
            b[0] = parseInt(b[0], 10);
            if (1 < b[0] || 1 === b[0] && 8 <= parseInt(b[1], 10)) return !1;
            for (var g = ["boxSizing", "MozBoxSizing", "WebkitBoxSizing", "msBoxSizing"], e = g.length, b = 0; b < e; b++)
                if ("border-box" === a.$col.css(g[b])) return !0;
            return !1
        };
        a.update = function() {
            !a.$el.hasClass(b.disabled) && a.isEnabled && (a.hasBoxSizing = a.checkBoxSizing(), a.padding = a.hasBoxSizing ? parseInt(a.$col.css("padding-top"), 10) + parseInt(a.$col.css("padding-bottom"), 10) : 0, a.curMax = b.min, a.$col.removeClass(b.overflow).each(function() {
                var c = d(this),
                    e = c.find("span.equalizer-inner");
                a.curTop = c.offset().top;
                a.curRowTop !== a.curTop ? (a.hasMax && a.curMax > b.max && (a.curMax = b.max, a.curRows.addClass(b.overflow)), a.curRows && a.curRows.height(a.curMax + a.padding), a.curMax = e[a.useHeight](), a.curMax = a.hasMin ? Math.max(b.min, a.curMax) : a.curMax, a.curRowTop = a.curTop, a.curRows = c) : (a.curMax = Math.max(a.curMax, e[a.useHeight]()), a.curMax = a.hasMax && a.curMax > b.max ? b.max : a.hasMin && a.curMax < b.min ? b.min : a.curMax, a.curRows = a.curRows.add(c));
                a.curRows && (a.curRows.height(a.curMax + a.padding), a.hasMax && a.curMax >= b.max && a.curRows.addClass(b.overflow))
            }))
        };
        a.suspend = function(c) {
            !1 !== c ? a.$el.removeClass(b.disabled) : (a.$el.addClass(b.disabled), a.$col.removeClass(b.overflow).css("height", ""));
            a.update()
        };
        a.enable = function(b) {
            a.isEnabled = !1 !== b;
            a.suspend(b)
        };
        a.init()
    };
    d.equalizer.defaultOptions = {
        columns: "> div",
        useHeight: "height",
        resizeable: !0,
        min: 0,
        max: 0,
        breakpoint: null,
        disabled: "noresize",
        overflow: "overflowed"
    };
    d.fn.equalizer = function(f) {
        return this.each(function() {
            var e = d(this).data("equalizer");
            e ? e.update() : new d.equalizer(this, f)
        })
    };
    d.fn.getequalizer = function() {
        return this.data("equalizer")
    }
})(jQuery);
/*!
 * FullCalendar v2.6.0
 * Docs & License: http://fullcalendar.io/
 * (c) 2015 Adam Shaw
 */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "moment"], a) : "object" == typeof exports ? module.exports = a(require("jquery"), require("moment")) : a(jQuery, moment)
}(function(a, b) {
    function c(a) {
        return Q(a, Ra)
    }

    function d(b) {
        var c, d = {
            views: b.views || {}
        };
        return a.each(b, function(b, e) {
            "views" != b && (a.isPlainObject(e) && !/(time|duration|interval)$/i.test(b) && -1 == a.inArray(b, Ra) ? (c = null, a.each(e, function(a, e) {
                /^(month|week|day|default|basic(Week|Day)?|agenda(Week|Day)?)$/.test(a) ? (d.views[a] || (d.views[a] = {}), d.views[a][b] = e) : (c || (c = {}), c[a] = e)
            }), c && (d[b] = c)) : d[b] = e)
        }), d
    }

    function e(a, b) {
        b.left && a.css({
            "border-left-width": 1,
            "margin-left": b.left - 1
        }), b.right && a.css({
            "border-right-width": 1,
            "margin-right": b.right - 1
        })
    }

    function f(a) {
        a.css({
            "margin-left": "",
            "margin-right": "",
            "border-left-width": "",
            "border-right-width": ""
        })
    }

    function g() {
        a("body").addClass("fc-not-allowed")
    }

    function h() {
        a("body").removeClass("fc-not-allowed")
    }

    function i(b, c, d) {
        var e = Math.floor(c / b.length),
            f = Math.floor(c - e * (b.length - 1)),
            g = [],
            h = [],
            i = [],
            k = 0;
        j(b), b.each(function(c, d) {
            var j = c === b.length - 1 ? f : e,
                l = a(d).outerHeight(!0);
            j > l ? (g.push(d), h.push(l), i.push(a(d).height())) : k += l
        }), d && (c -= k, e = Math.floor(c / g.length), f = Math.floor(c - e * (g.length - 1))), a(g).each(function(b, c) {
            var d = b === g.length - 1 ? f : e,
                j = h[b],
                k = i[b],
                l = d - (j - k);
            d > j && a(c).height(l)
        })
    }

    function j(a) {
        a.height("")
    }

    function k(b) {
        var c = 0;
        return b.find("> span").each(function(b, d) {
            var e = a(d).outerWidth();
            e > c && (c = e)
        }), c++, b.width(c), c
    }

    function l(a, b) {
        return a.height(b).addClass("fc-scroller"), a[0].scrollHeight - 1 > a[0].clientHeight ? !0 : (m(a), !1)
    }

    function m(a) {
        a.height("").removeClass("fc-scroller")
    }

    function n(b) {
        var c = b.css("position"),
            d = b.parents().filter(function() {
                var b = a(this);
                return /(auto|scroll)/.test(b.css("overflow") + b.css("overflow-y") + b.css("overflow-x"))
            }).eq(0);
        return "fixed" !== c && d.length ? d : a(b[0].ownerDocument || document)
    }

    function o(a) {
        var b = a.offset();
        return {
            left: b.left,
            right: b.left + a.outerWidth(),
            top: b.top,
            bottom: b.top + a.outerHeight()
        }
    }

    function p(a) {
        var b = a.offset(),
            c = r(a),
            d = b.left + u(a, "border-left-width") + c.left,
            e = b.top + u(a, "border-top-width") + c.top;
        return {
            left: d,
            right: d + a[0].clientWidth,
            top: e,
            bottom: e + a[0].clientHeight
        }
    }

    function q(a) {
        var b = a.offset(),
            c = b.left + u(a, "border-left-width") + u(a, "padding-left"),
            d = b.top + u(a, "border-top-width") + u(a, "padding-top");
        return {
            left: c,
            right: c + a.width(),
            top: d,
            bottom: d + a.height()
        }
    }

    function r(a) {
        var b = a.innerWidth() - a[0].clientWidth,
            c = {
                left: 0,
                right: 0,
                top: 0,
                bottom: a.innerHeight() - a[0].clientHeight
            };
        return s() && "rtl" == a.css("direction") ? c.left = b : c.right = b, c
    }

    function s() {
        return null === Sa && (Sa = t()), Sa
    }

    function t() {
        var b = a("<div><div/></div>").css({
                position: "absolute",
                top: -1e3,
                left: 0,
                border: 0,
                padding: 0,
                overflow: "scroll",
                direction: "rtl"
            }).appendTo("body"),
            c = b.children(),
            d = c.offset().left > b.offset().left;
        return b.remove(), d
    }

    function u(a, b) {
        return parseFloat(a.css(b)) || 0
    }

    function v(a) {
        return 1 == a.which && !a.ctrlKey
    }

    function w(a, b) {
        var c = {
            left: Math.max(a.left, b.left),
            right: Math.min(a.right, b.right),
            top: Math.max(a.top, b.top),
            bottom: Math.min(a.bottom, b.bottom)
        };
        return c.left < c.right && c.top < c.bottom ? c : !1
    }

    function x(a, b) {
        return {
            left: Math.min(Math.max(a.left, b.left), b.right),
            top: Math.min(Math.max(a.top, b.top), b.bottom)
        }
    }

    function y(a) {
        return {
            left: (a.left + a.right) / 2,
            top: (a.top + a.bottom) / 2
        }
    }

    function z(a, b) {
        return {
            left: a.left - b.left,
            top: a.top - b.top
        }
    }

    function A(b) {
        var c, d, e = [],
            f = [];
        for ("string" == typeof b ? f = b.split(/\s*,\s*/) : "function" == typeof b ? f = [b] : a.isArray(b) && (f = b), c = 0; c < f.length; c++) d = f[c], "string" == typeof d ? e.push("-" == d.charAt(0) ? {
            field: d.substring(1),
            order: -1
        } : {
            field: d,
            order: 1
        }) : "function" == typeof d && e.push({
            func: d
        });
        return e
    }

    function B(a, b, c) {
        var d, e;
        for (d = 0; d < c.length; d++)
            if (e = C(a, b, c[d])) return e;
        return 0
    }

    function C(a, b, c) {
        return c.func ? c.func(a, b) : D(a[c.field], b[c.field]) * (c.order || 1)
    }

    function D(b, c) {
        return b || c ? null == c ? -1 : null == b ? 1 : "string" === a.type(b) || "string" === a.type(c) ? String(b).localeCompare(String(c)) : b - c : 0
    }

    function E(a, b) {
        var c, d, e, f, g = a.start,
            h = a.end,
            i = b.start,
            j = b.end;
        return h > i && j > g ? (g >= i ? (c = g.clone(), e = !0) : (c = i.clone(), e = !1), j >= h ? (d = h.clone(), f = !0) : (d = j.clone(), f = !1), {
            start: c,
            end: d,
            isStart: e,
            isEnd: f
        }) : void 0
    }

    function F(a, c) {
        return b.duration({
            days: a.clone().stripTime().diff(c.clone().stripTime(), "days"),
            ms: a.time() - c.time()
        })
    }

    function G(a, c) {
        return b.duration({
            days: a.clone().stripTime().diff(c.clone().stripTime(), "days")
        })
    }

    function H(a, c, d) {
        return b.duration(Math.round(a.diff(c, d, !0)), d)
    }

    function I(a, b) {
        var c, d, e;
        for (c = 0; c < Ua.length && (d = Ua[c], e = J(d, a, b), !(e >= 1 && ba(e))); c++);
        return d
    }

    function J(a, c, d) {
        return null != d ? d.diff(c, a, !0) : b.isDuration(c) ? c.as(a) : c.end.diff(c.start, a, !0)
    }

    function K(a, b, c) {
        var d;
        return N(c) ? (b - a) / c : (d = c.asMonths(), Math.abs(d) >= 1 && ba(d) ? b.diff(a, "months", !0) / d : b.diff(a, "days", !0) / c.asDays())
    }

    function L(a, b) {
        var c, d;
        return N(a) || N(b) ? a / b : (c = a.asMonths(), d = b.asMonths(), Math.abs(c) >= 1 && ba(c) && Math.abs(d) >= 1 && ba(d) ? c / d : a.asDays() / b.asDays())
    }

    function M(a, c) {
        var d;
        return N(a) ? b.duration(a * c) : (d = a.asMonths(), Math.abs(d) >= 1 && ba(d) ? b.duration({
            months: d * c
        }) : b.duration({
            days: a.asDays() * c
        }))
    }

    function N(a) {
        return Boolean(a.hours() || a.minutes() || a.seconds() || a.milliseconds())
    }

    function O(a) {
        return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
    }

    function P(a) {
        return /^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(a)
    }

    function Q(a, b) {
        var c, d, e, f, g, h, i = {};
        if (b)
            for (c = 0; c < b.length; c++) {
                for (d = b[c], e = [], f = a.length - 1; f >= 0; f--)
                    if (g = a[f][d], "object" == typeof g) e.unshift(g);
                    else if (void 0 !== g) {
                    i[d] = g;
                    break
                }
                e.length && (i[d] = Q(e))
            }
        for (c = a.length - 1; c >= 0; c--) {
            h = a[c];
            for (d in h) d in i || (i[d] = h[d])
        }
        return i
    }

    function R(a) {
        var b = function() {};
        return b.prototype = a, new b
    }

    function S(a, b) {
        for (var c in a) U(a, c) && (b[c] = a[c])
    }

    function T(a, b) {
        var c, d, e = ["constructor", "toString", "valueOf"];
        for (c = 0; c < e.length; c++) d = e[c], a[d] !== Object.prototype[d] && (b[d] = a[d])
    }

    function U(a, b) {
        return Ya.call(a, b)
    }

    function V(b) {
        return /undefined|null|boolean|number|string/.test(a.type(b))
    }

    function W(b, c, d) {
        if (a.isFunction(b) && (b = [b]), b) {
            var e, f;
            for (e = 0; e < b.length; e++) f = b[e].apply(c, d) || f;
            return f
        }
    }

    function X() {
        for (var a = 0; a < arguments.length; a++)
            if (void 0 !== arguments[a]) return arguments[a]
    }

    function Y(a) {
        return (a + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/\n/g, "<br />")
    }

    function Z(a) {
        return a.replace(/&.*?;/g, "")
    }

    function $(b) {
        var c = [];
        return a.each(b, function(a, b) {
            null != b && c.push(a + ":" + b)
        }), c.join(";")
    }

    function _(a) {
        return a.charAt(0).toUpperCase() + a.slice(1)
    }

    function aa(a, b) {
        return a - b
    }

    function ba(a) {
        return a % 1 === 0
    }

    function ca(a, b) {
        var c = a[b];
        return function() {
            return c.apply(a, arguments)
        }
    }

    function da(a, b) {
        var c, d, e, f, g = function() {
            var h = +new Date - f;
            b > h && h > 0 ? c = setTimeout(g, b - h) : (c = null, a.apply(e, d), c || (e = d = null))
        };
        return function() {
            e = this, d = arguments, f = +new Date, c || (c = setTimeout(g, b))
        }
    }

    function ea(c, d, e) {
        var f, g, h, i, j = c[0],
            k = 1 == c.length && "string" == typeof j;
        return b.isMoment(j) ? (i = b.apply(null, c), ga(j, i)) : O(j) || void 0 === j ? i = b.apply(null, c) : (f = !1, g = !1, k ? Za.test(j) ? (j += "-01", c = [j], f = !0, g = !0) : (h = $a.exec(j)) && (f = !h[5], g = !0) : a.isArray(j) && (g = !0), i = d || f ? b.utc.apply(b, c) : b.apply(null, c), f ? (i._ambigTime = !0, i._ambigZone = !0) : e && (g ? i._ambigZone = !0 : k && (i.utcOffset ? i.utcOffset(j) : i.zone(j)))), i._fullCalendar = !0, i
    }

    function fa(a, c) {
        var d, e, f = !1,
            g = !1,
            h = a.length,
            i = [];
        for (d = 0; h > d; d++) e = a[d], b.isMoment(e) || (e = Pa.moment.parseZone(e)), f = f || e._ambigTime, g = g || e._ambigZone, i.push(e);
        for (d = 0; h > d; d++) e = i[d], c || !f || e._ambigTime ? g && !e._ambigZone && (i[d] = e.clone().stripZone()) : i[d] = e.clone().stripTime();
        return i
    }

    function ga(a, b) {
        a._ambigTime ? b._ambigTime = !0 : b._ambigTime && (b._ambigTime = !1), a._ambigZone ? b._ambigZone = !0 : b._ambigZone && (b._ambigZone = !1)
    }

    function ha(a, b) {
        a.year(b[0] || 0).month(b[1] || 0).date(b[2] || 0).hours(b[3] || 0).minutes(b[4] || 0).seconds(b[5] || 0).milliseconds(b[6] || 0)
    }

    function ia(a, b) {
        return ab.format.call(a, b)
    }

    function ja(a, b) {
        return ka(a, pa(b))
    }

    function ka(a, b) {
        var c, d = "";
        for (c = 0; c < b.length; c++) d += la(a, b[c]);
        return d
    }

    function la(a, b) {
        var c, d;
        return "string" == typeof b ? b : (c = b.token) ? bb[c] ? bb[c](a) : ia(a, c) : b.maybe && (d = ka(a, b.maybe), d.match(/[1-9]/)) ? d : ""
    }

    function ma(a, b, c, d, e) {
        var f;
        return a = Pa.moment.parseZone(a), b = Pa.moment.parseZone(b), f = (a.localeData || a.lang).call(a), c = f.longDateFormat(c) || c, d = d || " - ", na(a, b, pa(c), d, e)
    }

    function na(a, b, c, d, e) {
        var f, g, h, i, j = a.clone().stripZone(),
            k = b.clone().stripZone(),
            l = "",
            m = "",
            n = "",
            o = "",
            p = "";
        for (g = 0; g < c.length && (f = oa(a, b, j, k, c[g]), f !== !1); g++) l += f;
        for (h = c.length - 1; h > g && (f = oa(a, b, j, k, c[h]), f !== !1); h--) m = f + m;
        for (i = g; h >= i; i++) n += la(a, c[i]), o += la(b, c[i]);
        return (n || o) && (p = e ? o + d + n : n + d + o), l + p + m
    }

    function oa(a, b, c, d, e) {
        var f, g;
        return "string" == typeof e ? e : (f = e.token) && (g = cb[f.charAt(0)], g && c.isSame(d, g)) ? ia(a, f) : !1
    }

    function pa(a) {
        return a in db ? db[a] : db[a] = qa(a)
    }

    function qa(a) {
        for (var b, c = [], d = /\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g; b = d.exec(a);) b[1] ? c.push(b[1]) : b[2] ? c.push({
            maybe: qa(b[2])
        }) : b[3] ? c.push({
            token: b[3]
        }) : b[5] && c.push(b[5]);
        return c
    }

    function ra() {}

    function sa(a, b) {
        var c;
        return U(b, "constructor") && (c = b.constructor), "function" != typeof c && (c = b.constructor = function() {
            a.apply(this, arguments)
        }), c.prototype = R(a.prototype), S(b, c.prototype), T(b, c.prototype), S(a, c), c
    }

    function ta(a, b) {
        S(b.prototype || b, a.prototype)
    }

    function ua(a, b) {
        return a || b ? a && b ? a.component === b.component && va(a, b) && va(b, a) : !1 : !0
    }

    function va(a, b) {
        for (var c in a)
            if (!/^(component|left|right|top|bottom)$/.test(c) && a[c] !== b[c]) return !1;
        return !0
    }

    function wa(a) {
        var b = ya(a);
        return "background" === b || "inverse-background" === b
    }

    function xa(a) {
        return "inverse-background" === ya(a)
    }

    function ya(a) {
        return X((a.source || {}).rendering, a.rendering)
    }

    function za(a) {
        var b, c, d = {};
        for (b = 0; b < a.length; b++) c = a[b], (d[c._id] || (d[c._id] = [])).push(c);
        return d
    }

    function Aa(a, b) {
        return a.start - b.start
    }

    function Ba(c) {
        var d, e, f, g, h = Pa.dataAttrPrefix;
        return h && (h += "-"), d = c.data(h + "event") || null, d && (d = "object" == typeof d ? a.extend({}, d) : {}, e = d.start, null == e && (e = d.time), f = d.duration, g = d.stick, delete d.start, delete d.time, delete d.duration, delete d.stick), null == e && (e = c.data(h + "start")), null == e && (e = c.data(h + "time")), null == f && (f = c.data(h + "duration")), null == g && (g = c.data(h + "stick")), e = null != e ? b.duration(e) : null, f = null != f ? b.duration(f) : null, g = Boolean(g), {
            eventProps: d,
            startTime: e,
            duration: f,
            stick: g
        }
    }

    function Ca(a, b) {
        var c, d;
        for (c = 0; c < b.length; c++)
            if (d = b[c], d.leftCol <= a.rightCol && d.rightCol >= a.leftCol) return !0;
        return !1
    }

    function Da(a, b) {
        return a.leftCol - b.leftCol
    }

    function Ea(a) {
        var b, c, d, e = [];
        for (b = 0; b < a.length; b++) {
            for (c = a[b], d = 0; d < e.length && Ha(c, e[d]).length; d++);
            c.level = d, (e[d] || (e[d] = [])).push(c)
        }
        return e
    }

    function Fa(a) {
        var b, c, d, e, f;
        for (b = 0; b < a.length; b++)
            for (c = a[b], d = 0; d < c.length; d++)
                for (e = c[d], e.forwardSegs = [], f = b + 1; f < a.length; f++) Ha(e, a[f], e.forwardSegs)
    }

    function Ga(a) {
        var b, c, d = a.forwardSegs,
            e = 0;
        if (void 0 === a.forwardPressure) {
            for (b = 0; b < d.length; b++) c = d[b], Ga(c), e = Math.max(e, 1 + c.forwardPressure);
            a.forwardPressure = e
        }
    }

    function Ha(a, b, c) {
        c = c || [];
        for (var d = 0; d < b.length; d++) Ia(a, b[d]) && c.push(b[d]);
        return c
    }

    function Ia(a, b) {
        return a.bottom > b.top && a.top < b.bottom
    }

    function Ja(c, d) {
        function e() {
            U ? h() && (k(), i()) : f()
        }

        function f() {
            V = O.theme ? "ui" : "fc", c.addClass("fc"), O.isRTL ? c.addClass("fc-rtl") : c.addClass("fc-ltr"), O.theme ? c.addClass("ui-widget") : c.addClass("fc-unthemed"), U = a("<div class='fc-view-container'/>").prependTo(c), S = N.header = new Ma(N, O), T = S.render(), T && c.prepend(T), i(O.defaultView), O.handleWindowResize && (Y = da(m, O.windowResizeDelay), a(window).resize(Y))
        }

        function g() {
            W && W.removeElement(), S.removeElement(), U.remove(), c.removeClass("fc fc-ltr fc-rtl fc-unthemed ui-widget"), Y && a(window).unbind("resize", Y)
        }

        function h() {
            return c.is(":visible")
        }

        function i(b) {
            ca++, W && b && W.type !== b && (S.deactivateButton(W.type), H(), W.removeElement(), W = N.view = null), !W && b && (W = N.view = ba[b] || (ba[b] = N.instantiateView(b)), W.setElement(a("<div class='fc-view fc-" + b + "-view' />").appendTo(U)), S.activateButton(b)), W && (Z = W.massageCurrentDate(Z), W.displaying && Z.isWithin(W.intervalStart, W.intervalEnd) || h() && (W.display(Z), I(), u(), v(), q())), I(), ca--
        }

        function j(a) {
            return h() ? (a && l(), ca++, W.updateSize(!0), ca--, !0) : void 0
        }

        function k() {
            h() && l()
        }

        function l() {
            X = "number" == typeof O.contentHeight ? O.contentHeight : "number" == typeof O.height ? O.height - (T ? T.outerHeight(!0) : 0) : Math.round(U.width() / Math.max(O.aspectRatio, .5))
        }

        function m(a) {
            !ca && a.target === window && W.start && j(!0) && W.trigger("windowResize", aa)
        }

        function n() {
            p(), r()
        }

        function o() {
            h() && (H(), W.displayEvents(ea), I())
        }

        function p() {
            H(), W.clearEvents(), I()
        }

        function q() {
            !O.lazyFetching || $(W.start, W.end) ? r() : o()
        }

        function r() {
            _(W.start, W.end)
        }

        function s(a) {
            ea = a, o()
        }

        function t() {
            o()
        }

        function u() {
            S.updateTitle(W.title)
        }

        function v() {
            var a = N.getNow();
            a.isWithin(W.intervalStart, W.intervalEnd) ? S.disableButton("today") : S.enableButton("today")
        }

        function w(a, b) {
            W.select(N.buildSelectSpan.apply(N, arguments))
        }

        function x() {
            W && W.unselect()
        }

        function y() {
            Z = W.computePrevDate(Z), i()
        }

        function z() {
            Z = W.computeNextDate(Z), i()
        }

        function A() {
            Z.add(-1, "years"), i()
        }

        function B() {
            Z.add(1, "years"), i()
        }

        function C() {
            Z = N.getNow(), i()
        }

        function D(a) {
            Z = N.moment(a).stripZone(), i()
        }

        function E(a) {
            Z.add(b.duration(a)), i()
        }

        function F(a, b) {
            var c;
            b = b || "day", c = N.getViewSpec(b) || N.getUnitViewSpec(b), Z = a.clone(), i(c ? c.type : null)
        }

        function G() {
            return N.applyTimezone(Z)
        }

        function H() {
            U.css({
                width: "100%",
                height: U.height(),
                overflow: "hidden"
            })
        }

        function I() {
            U.css({
                width: "",
                height: "",
                overflow: ""
            })
        }

        function J() {
            return N
        }

        function K() {
            return W
        }

        function L(a, b) {
            return void 0 === b ? O[a] : void(("height" == a || "contentHeight" == a || "aspectRatio" == a) && (O[a] = b, j(!0)))
        }

        function M(a, b) {
            var c = Array.prototype.slice.call(arguments, 2);
            return b = b || aa, this.triggerWith(a, b, c), O[a] ? O[a].apply(b, c) : void 0
        }
        var N = this;
        N.initOptions(d || {});
        var O = this.options;
        N.render = e, N.destroy = g, N.refetchEvents = n, N.reportEvents = s, N.reportEventChange = t, N.rerenderEvents = o, N.changeView = i, N.select = w, N.unselect = x, N.prev = y, N.next = z, N.prevYear = A, N.nextYear = B, N.today = C, N.gotoDate = D, N.incrementDate = E, N.zoomTo = F, N.getDate = G, N.getCalendar = J, N.getView = K, N.option = L, N.trigger = M;
        var P = R(La(O.lang));
        if (O.monthNames && (P._months = O.monthNames), O.monthNamesShort && (P._monthsShort = O.monthNamesShort), O.dayNames && (P._weekdays = O.dayNames), O.dayNamesShort && (P._weekdaysShort = O.dayNamesShort), null != O.firstDay) {
            var Q = R(P._week);
            Q.dow = O.firstDay, P._week = Q
        }
        P._fullCalendar_weekCalc = function(a) {
            return "function" == typeof a ? a : "local" === a ? a : "iso" === a || "ISO" === a ? "ISO" : void 0
        }(O.weekNumberCalculation), N.defaultAllDayEventDuration = b.duration(O.defaultAllDayEventDuration), N.defaultTimedEventDuration = b.duration(O.defaultTimedEventDuration), N.moment = function() {
            var a;
            return "local" === O.timezone ? (a = Pa.moment.apply(null, arguments), a.hasTime() && a.local()) : a = "UTC" === O.timezone ? Pa.moment.utc.apply(null, arguments) : Pa.moment.parseZone.apply(null, arguments), "_locale" in a ? a._locale = P : a._lang = P, a
        }, N.getIsAmbigTimezone = function() {
            return "local" !== O.timezone && "UTC" !== O.timezone
        }, N.applyTimezone = function(a) {
            if (!a.hasTime()) return a.clone();
            var b, c = N.moment(a.toArray()),
                d = a.time() - c.time();
            return d && (b = c.clone().add(d), a.time() - b.time() === 0 && (c = b)), c
        }, N.getNow = function() {
            var a = O.now;
            return "function" == typeof a && (a = a()), N.moment(a).stripZone()
        }, N.getEventEnd = function(a) {
            return a.end ? a.end.clone() : N.getDefaultEventEnd(a.allDay, a.start)
        }, N.getDefaultEventEnd = function(a, b) {
            var c = b.clone();
            return a ? c.stripTime().add(N.defaultAllDayEventDuration) : c.add(N.defaultTimedEventDuration), N.getIsAmbigTimezone() && c.stripZone(), c
        }, N.humanizeDuration = function(a) {
            return (a.locale || a.lang).call(a, O.lang).humanize()
        }, Na.call(N, O);
        var S, T, U, V, W, X, Y, Z, $ = N.isFetchNeeded,
            _ = N.fetchEvents,
            aa = c[0],
            ba = {},
            ca = 0,
            ea = [];
        Z = null != O.defaultDate ? N.moment(O.defaultDate).stripZone() : N.getNow(), N.getSuggestedViewHeight = function() {
            return void 0 === X && k(), X
        }, N.isHeightAuto = function() {
            return "auto" === O.contentHeight || "auto" === O.height
        }, N.freezeContentHeight = H, N.unfreezeContentHeight = I, N.initialize()
    }

    function Ka(b) {
        a.each(tb, function(a, c) {
            null == b[a] && (b[a] = c(b))
        })
    }

    function La(a) {
        var c = b.localeData || b.langData;
        return c.call(b, a) || c.call(b, "en")
    }

    function Ma(b, c) {
        function d() {
            var b = c.header;
            return n = c.theme ? "ui" : "fc", b ? o = a("<div class='fc-toolbar'/>").append(f("left")).append(f("right")).append(f("center")).append('<div class="fc-clear"/>') : void 0
        }

        function e() {
            o.remove(), o = a()
        }

        function f(d) {
            var e = a('<div class="fc-' + d + '"/>'),
                f = c.header[d];
            return f && a.each(f.split(" "), function(d) {
                var f, g = a(),
                    h = !0;
                a.each(this.split(","), function(d, e) {
                    var f, i, j, k, l, m, o, q, r, s;
                    "title" == e ? (g = g.add(a("<h2>&nbsp;</h2>")), h = !1) : ((f = (b.options.customButtons || {})[e]) ? (j = function(a) {
                        f.click && f.click.call(s[0], a)
                    }, k = "", l = f.text) : (i = b.getViewSpec(e)) ? (j = function() {
                        b.changeView(e)
                    }, p.push(e), k = i.buttonTextOverride, l = i.buttonTextDefault) : b[e] && (j = function() {
                        b[e]()
                    }, k = (b.overrides.buttonText || {})[e], l = c.buttonText[e]), j && (m = f ? f.themeIcon : c.themeButtonIcons[e], o = f ? f.icon : c.buttonIcons[e], q = k ? Y(k) : m && c.theme ? "<span class='ui-icon ui-icon-" + m + "'></span>" : o && !c.theme ? "<span class='fc-icon fc-icon-" + o + "'></span>" : Y(l), r = ["fc-" + e + "-button", n + "-button", n + "-state-default"], s = a('<button type="button" class="' + r.join(" ") + '">' + q + "</button>").click(function(a) {
                        s.hasClass(n + "-state-disabled") || (j(a), (s.hasClass(n + "-state-active") || s.hasClass(n + "-state-disabled")) && s.removeClass(n + "-state-hover"))
                    }).mousedown(function() {
                        s.not("." + n + "-state-active").not("." + n + "-state-disabled").addClass(n + "-state-down")
                    }).mouseup(function() {
                        s.removeClass(n + "-state-down")
                    }).hover(function() {
                        s.not("." + n + "-state-active").not("." + n + "-state-disabled").addClass(n + "-state-hover")
                    }, function() {
                        s.removeClass(n + "-state-hover").removeClass(n + "-state-down")
                    }), g = g.add(s)))
                }), h && g.first().addClass(n + "-corner-left").end().last().addClass(n + "-corner-right").end(), g.length > 1 ? (f = a("<div/>"), h && f.addClass("fc-button-group"), f.append(g), e.append(f)) : e.append(g)
            }), e
        }

        function g(a) {
            o.find("h2").text(a)
        }

        function h(a) {
            o.find(".fc-" + a + "-button").addClass(n + "-state-active")
        }

        function i(a) {
            o.find(".fc-" + a + "-button").removeClass(n + "-state-active")
        }

        function j(a) {
            o.find(".fc-" + a + "-button").attr("disabled", "disabled").addClass(n + "-state-disabled")
        }

        function k(a) {
            o.find(".fc-" + a + "-button").removeAttr("disabled").removeClass(n + "-state-disabled")
        }

        function l() {
            return p
        }
        var m = this;
        m.render = d, m.removeElement = e, m.updateTitle = g, m.activateButton = h, m.deactivateButton = i, m.disableButton = j, m.enableButton = k, m.getViewsWithButtons = l;
        var n, o = a(),
            p = []
    }

    function Na(c) {
        function d(a, b) {
            return !L || L > a || b > M
        }

        function e(a, b) {
            L = a, M = b, T = [];
            var c = ++R,
                d = Q.length;
            S = d;
            for (var e = 0; d > e; e++) f(Q[e], c)
        }

        function f(b, c) {
            g(b, function(d) {
                var e, f, g, h = a.isArray(b.events);
                if (c == R) {
                    if (d)
                        for (e = 0; e < d.length; e++) f = d[e], g = h ? f : s(f, b), g && T.push.apply(T, w(g));
                    S--, S || N(T)
                }
            })
        }

        function g(b, d) {
            var e, f, h = Pa.sourceFetchers;
            for (e = 0; e < h.length; e++) {
                if (f = h[e].call(K, b, L.clone(), M.clone(), c.timezone, d), f === !0) return;
                if ("object" == typeof f) return void g(f, d)
            }
            var i = b.events;
            if (i) a.isFunction(i) ? (K.pushLoading(), i.call(K, L.clone(), M.clone(), c.timezone, function(a) {
                d(a), K.popLoading()
            })) : a.isArray(i) ? d(i) : d();
            else {
                var j = b.url;
                if (j) {
                    var k, l = b.success,
                        m = b.error,
                        n = b.complete;
                    k = a.isFunction(b.data) ? b.data() : b.data;
                    var o = a.extend({}, k || {}),
                        p = X(b.startParam, c.startParam),
                        q = X(b.endParam, c.endParam),
                        r = X(b.timezoneParam, c.timezoneParam);
                    p && (o[p] = L.format()), q && (o[q] = M.format()), c.timezone && "local" != c.timezone && (o[r] = c.timezone), K.pushLoading(), a.ajax(a.extend({}, ub, b, {
                        data: o,
                        success: function(b) {
                            b = b || [];
                            var c = W(l, this, arguments);
                            a.isArray(c) && (b = c), d(b)
                        },
                        error: function() {
                            W(m, this, arguments), d()
                        },
                        complete: function() {
                            W(n, this, arguments), K.popLoading()
                        }
                    }))
                } else d()
            }
        }

        function h(a) {
            var b = i(a);
            b && (Q.push(b), S++, f(b, R))
        }

        function i(b) {
            var c, d, e = Pa.sourceNormalizers;
            if (a.isFunction(b) || a.isArray(b) ? c = {
                    events: b
                } : "string" == typeof b ? c = {
                    url: b
                } : "object" == typeof b && (c = a.extend({}, b)), c) {
                for (c.className ? "string" == typeof c.className && (c.className = c.className.split(/\s+/)) : c.className = [], a.isArray(c.events) && (c.origArray = c.events, c.events = a.map(c.events, function(a) {
                        return s(a, c)
                    })), d = 0; d < e.length; d++) e[d].call(K, c);
                return c
            }
        }

        function j(b) {
            Q = a.grep(Q, function(a) {
                return !k(a, b)
            }), T = a.grep(T, function(a) {
                return !k(a.source, b)
            }), N(T)
        }

        function k(a, b) {
            return a && b && l(a) == l(b)
        }

        function l(a) {
            return ("object" == typeof a ? a.origArray || a.googleCalendarId || a.url || a.events : null) || a
        }

        function m(a) {
            a.start = K.moment(a.start), a.end ? a.end = K.moment(a.end) : a.end = null, x(a, n(a)), N(T)
        }

        function n(b) {
            var c = {};
            return a.each(b, function(a, b) {
                o(a) && void 0 !== b && V(b) && (c[a] = b)
            }), c
        }

        function o(a) {
            return !/^_|^(id|allDay|start|end)$/.test(a)
        }

        function p(a, b) {
            var c, d, e, f = s(a);
            if (f) {
                for (c = w(f), d = 0; d < c.length; d++) e = c[d], e.source || (b && (O.events.push(e), e.source = O), T.push(e));
                return N(T), c
            }
            return []
        }

        function q(b) {
            var c, d;
            for (null == b ? b = function() {
                    return !0
                } : a.isFunction(b) || (c = b + "", b = function(a) {
                    return a._id == c
                }), T = a.grep(T, b, !0), d = 0; d < Q.length; d++) a.isArray(Q[d].events) && (Q[d].events = a.grep(Q[d].events, b, !0));
            N(T)
        }

        function r(b) {
            return a.isFunction(b) ? a.grep(T, b) : null != b ? (b += "", a.grep(T, function(a) {
                return a._id == b
            })) : T
        }

        function s(d, e) {
            var f, g, h, i = {};
            if (c.eventDataTransform && (d = c.eventDataTransform(d)), e && e.eventDataTransform && (d = e.eventDataTransform(d)), a.extend(i, d), e && (i.source = e), i._id = d._id || (void 0 === d.id ? "_fc" + vb++ : d.id + ""), d.className ? "string" == typeof d.className ? i.className = d.className.split(/\s+/) : i.className = d.className : i.className = [], f = d.start || d.date, g = d.end, P(f) && (f = b.duration(f)), P(g) && (g = b.duration(g)), d.dow || b.isDuration(f) || b.isDuration(g)) i.start = f ? b.duration(f) : null, i.end = g ? b.duration(g) : null, i._recurring = !0;
            else {
                if (f && (f = K.moment(f), !f.isValid())) return !1;
                g && (g = K.moment(g), g.isValid() || (g = null)), h = d.allDay, void 0 === h && (h = X(e ? e.allDayDefault : void 0, c.allDayDefault)), t(f, g, h, i)
            }
            return i
        }

        function t(a, b, c, d) {
            d.start = a, d.end = b, d.allDay = c, u(d), Oa(d)
        }

        function u(a) {
            v(a), a.end && !a.end.isAfter(a.start) && (a.end = null), a.end || (c.forceEventDuration ? a.end = K.getDefaultEventEnd(a.allDay, a.start) : a.end = null)
        }

        function v(a) {
            null == a.allDay && (a.allDay = !(a.start.hasTime() || a.end && a.end.hasTime())), a.allDay ? (a.start.stripTime(), a.end && a.end.stripTime()) : (a.start.hasTime() || (a.start = K.applyTimezone(a.start.time(0))), a.end && !a.end.hasTime() && (a.end = K.applyTimezone(a.end.time(0))))
        }

        function w(b, c, d) {
            var e, f, g, h, i, j, k, l, m, n = [];
            if (c = c || L, d = d || M, b)
                if (b._recurring) {
                    if (f = b.dow)
                        for (e = {}, g = 0; g < f.length; g++) e[f[g]] = !0;
                    for (h = c.clone().stripTime(); h.isBefore(d);)(!e || e[h.day()]) && (i = b.start, j = b.end, k = h.clone(), l = null, i && (k = k.time(i)), j && (l = h.clone().time(j)), m = a.extend({}, b), t(k, l, !i && !j, m), n.push(m)), h.add(1, "days")
                } else n.push(b);
            return n
        }

        function x(b, c, d) {
            function e(a, b) {
                return d ? H(a, b, d) : c.allDay ? G(a, b) : F(a, b)
            }
            var f, g, h, i, j, k, l = {};
            return c = c || {}, c.start || (c.start = b.start.clone()), void 0 === c.end && (c.end = b.end ? b.end.clone() : null), null == c.allDay && (c.allDay = b.allDay), u(c), f = {
                start: b._start.clone(),
                end: b._end ? b._end.clone() : K.getDefaultEventEnd(b._allDay, b._start),
                allDay: c.allDay
            }, u(f), g = null !== b._end && null === c.end, h = e(c.start, f.start), c.end ? (i = e(c.end, f.end), j = i.subtract(h)) : j = null, a.each(c, function(a, b) {
                o(a) && void 0 !== b && (l[a] = b)
            }), k = y(r(b._id), g, c.allDay, h, j, l), {
                dateDelta: h,
                durationDelta: j,
                undo: k
            }
        }

        function y(b, c, d, e, f, g) {
            var h = K.getIsAmbigTimezone(),
                i = [];
            return e && !e.valueOf() && (e = null), f && !f.valueOf() && (f = null), a.each(b, function(b, j) {
                    var k, l;
                    k = {
                        start: j.start.clone(),
                        end: j.end ? j.end.clone() : null,
                        allDay: j.allDay
                    }, a.each(g, function(a) {
                        k[a] = j[a]
                    }), l = {
                        start: j._start,
                        end: j._end,
                        allDay: d
                    }, u(l), c ? l.end = null : f && !l.end && (l.end = K.getDefaultEventEnd(l.allDay, l.start)), e && (l.start.add(e), l.end && l.end.add(e)), f && l.end.add(f), h && !l.allDay && (e || f) && (l.start.stripZone(), l.end && l.end.stripZone()), a.extend(j, g, l), Oa(j), i.push(function() {
                        a.extend(j, k), Oa(j)
                    })
                }),
                function() {
                    for (var a = 0; a < i.length; a++) i[a]()
                }
        }

        function z(b) {
            var d, e = c.businessHours,
                f = {
                    className: "fc-nonbusiness",
                    start: "09:00",
                    end: "17:00",
                    dow: [1, 2, 3, 4, 5],
                    rendering: "inverse-background"
                },
                g = K.getView();
            return e && (d = a.extend({}, f, "object" == typeof e ? e : {})), d ? (b && (d.start = null, d.end = null), w(s(d), g.start, g.end)) : []
        }

        function A(a, b) {
            var d = b.source || {},
                e = X(b.constraint, d.constraint, c.eventConstraint),
                f = X(b.overlap, d.overlap, c.eventOverlap);
            return D(a, e, f, b)
        }

        function B(b, c, d) {
            var e, f;
            return d && (e = a.extend({}, d, c), f = w(s(e))[0]), f ? A(b, f) : C(b)
        }

        function C(a) {
            return D(a, c.selectConstraint, c.selectOverlap)
        }

        function D(a, b, c, d) {
            var e, f, g, h, i, j;
            if (null != b) {
                for (e = E(b), f = !1, h = 0; h < e.length; h++)
                    if (I(e[h], a)) {
                        f = !0;
                        break
                    }
                if (!f) return !1
            }
            for (g = K.getPeerEvents(a, d), h = 0; h < g.length; h++)
                if (i = g[h], J(i, a)) {
                    if (c === !1) return !1;
                    if ("function" == typeof c && !c(i, d)) return !1;
                    if (d) {
                        if (j = X(i.overlap, (i.source || {}).overlap), j === !1) return !1;
                        if ("function" == typeof j && !j(d, i)) return !1
                    }
                }
            return !0
        }

        function E(a) {
            return "businessHours" === a ? z() : "object" == typeof a ? w(s(a)) : r(a)
        }

        function I(a, b) {
            var c = a.start.clone().stripZone(),
                d = K.getEventEnd(a).stripZone();
            return b.start >= c && b.end <= d
        }

        function J(a, b) {
            var c = a.start.clone().stripZone(),
                d = K.getEventEnd(a).stripZone();
            return b.start < d && b.end > c
        }
        var K = this;
        K.isFetchNeeded = d, K.fetchEvents = e, K.addEventSource = h, K.removeEventSource = j, K.updateEvent = m, K.renderEvent = p, K.removeEvents = q, K.clientEvents = r, K.mutateEvent = x, K.normalizeEventDates = u, K.normalizeEventTimes = v;
        var L, M, N = K.reportEvents,
            O = {
                events: []
            },
            Q = [O],
            R = 0,
            S = 0,
            T = [];
        a.each((c.events ? [c.events] : []).concat(c.eventSources || []), function(a, b) {
            var c = i(b);
            c && Q.push(c)
        }), K.getBusinessHoursEvents = z, K.isEventSpanAllowed = A, K.isExternalSpanAllowed = B, K.isSelectionSpanAllowed = C, K.getEventCache = function() {
            return T
        }
    }

    function Oa(a) {
        a._allDay = a.allDay, a._start = a.start.clone(), a._end = a.end ? a.end.clone() : null
    }
    var Pa = a.fullCalendar = {
            version: "2.6.0",
            internalApiVersion: 2
        },
        Qa = Pa.views = {};
    a.fn.fullCalendar = function(b) {
        var c = Array.prototype.slice.call(arguments, 1),
            d = this;
        return this.each(function(e, f) {
            var g, h = a(f),
                i = h.data("fullCalendar");
            "string" == typeof b ? i && a.isFunction(i[b]) && (g = i[b].apply(i, c), e || (d = g), "destroy" === b && h.removeData("fullCalendar")) : i || (i = new pb(h, b), h.data("fullCalendar", i), i.render())
        }), d
    };
    var Ra = ["header", "buttonText", "buttonIcons", "themeButtonIcons"];
    Pa.intersectRanges = E, Pa.applyAll = W, Pa.debounce = da, Pa.isInt = ba, Pa.htmlEscape = Y, Pa.cssToStr = $, Pa.proxy = ca, Pa.capitaliseFirstLetter = _, Pa.getOuterRect = o, Pa.getClientRect = p, Pa.getContentRect = q, Pa.getScrollbarWidths = r;
    var Sa = null;
    Pa.intersectRects = w, Pa.parseFieldSpecs = A, Pa.compareByFieldSpecs = B, Pa.compareByFieldSpec = C, Pa.flexibleCompare = D, Pa.computeIntervalUnit = I, Pa.divideRangeByDuration = K, Pa.divideDurationByDuration = L, Pa.multiplyDuration = M, Pa.durationHasTime = N;
    var Ta = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        Ua = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];
    Pa.log = function() {
        var a = window.console;
        return a && a.log ? a.log.apply(a, arguments) : void 0
    }, Pa.warn = function() {
        var a = window.console;
        return a && a.warn ? a.warn.apply(a, arguments) : Pa.log.apply(Pa, arguments)
    };
    var Va, Wa, Xa, Ya = {}.hasOwnProperty,
        Za = /^\s*\d{4}-\d\d$/,
        $a = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/,
        _a = b.fn,
        ab = a.extend({}, _a);
    Pa.moment = function() {
        return ea(arguments)
    }, Pa.moment.utc = function() {
        var a = ea(arguments, !0);
        return a.hasTime() && a.utc(), a
    }, Pa.moment.parseZone = function() {
        return ea(arguments, !0, !0)
    }, _a.clone = function() {
        var a = ab.clone.apply(this, arguments);
        return ga(this, a), this._fullCalendar && (a._fullCalendar = !0), a
    }, _a.week = _a.weeks = function(a) {
        var b = (this._locale || this._lang)._fullCalendar_weekCalc;
        return null == a && "function" == typeof b ? b(this) : "ISO" === b ? ab.isoWeek.apply(this, arguments) : ab.week.apply(this, arguments)
    }, _a.time = function(a) {
        if (!this._fullCalendar) return ab.time.apply(this, arguments);
        if (null == a) return b.duration({
            hours: this.hours(),
            minutes: this.minutes(),
            seconds: this.seconds(),
            milliseconds: this.milliseconds()
        });
        this._ambigTime = !1, b.isDuration(a) || b.isMoment(a) || (a = b.duration(a));
        var c = 0;
        return b.isDuration(a) && (c = 24 * Math.floor(a.asDays())), this.hours(c + a.hours()).minutes(a.minutes()).seconds(a.seconds()).milliseconds(a.milliseconds())
    }, _a.stripTime = function() {
        var a;
        return this._ambigTime || (a = this.toArray(), this.utc(), Wa(this, a.slice(0, 3)), this._ambigTime = !0, this._ambigZone = !0), this
    }, _a.hasTime = function() {
        return !this._ambigTime
    }, _a.stripZone = function() {
        var a, b;
        return this._ambigZone || (a = this.toArray(), b = this._ambigTime, this.utc(), Wa(this, a), this._ambigTime = b || !1, this._ambigZone = !0), this
    }, _a.hasZone = function() {
        return !this._ambigZone
    }, _a.local = function() {
        var a = this.toArray(),
            b = this._ambigZone;
        return ab.local.apply(this, arguments), this._ambigTime = !1, this._ambigZone = !1, b && Xa(this, a), this
    }, _a.utc = function() {
        return ab.utc.apply(this, arguments), this._ambigTime = !1, this._ambigZone = !1, this
    }, a.each(["zone", "utcOffset"], function(a, b) {
        ab[b] && (_a[b] = function(a) {
            return null != a && (this._ambigTime = !1, this._ambigZone = !1), ab[b].apply(this, arguments)
        })
    }), _a.format = function() {
        return this._fullCalendar && arguments[0] ? ja(this, arguments[0]) : this._ambigTime ? ia(this, "YYYY-MM-DD") : this._ambigZone ? ia(this, "YYYY-MM-DD[T]HH:mm:ss") : ab.format.apply(this, arguments)
    }, _a.toISOString = function() {
        return this._ambigTime ? ia(this, "YYYY-MM-DD") : this._ambigZone ? ia(this, "YYYY-MM-DD[T]HH:mm:ss") : ab.toISOString.apply(this, arguments)
    }, _a.isWithin = function(a, b) {
        var c = fa([this, a, b]);
        return c[0] >= c[1] && c[0] < c[2]
    }, _a.isSame = function(a, b) {
        var c;
        return this._fullCalendar ? b ? (c = fa([this, a], !0), ab.isSame.call(c[0], c[1], b)) : (a = Pa.moment.parseZone(a), ab.isSame.call(this, a) && Boolean(this._ambigTime) === Boolean(a._ambigTime) && Boolean(this._ambigZone) === Boolean(a._ambigZone)) : ab.isSame.apply(this, arguments)
    }, a.each(["isBefore", "isAfter"], function(a, b) {
        _a[b] = function(a, c) {
            var d;
            return this._fullCalendar ? (d = fa([this, a]), ab[b].call(d[0], d[1], c)) : ab[b].apply(this, arguments)
        }
    }), Va = "_d" in b() && "updateOffset" in b, Wa = Va ? function(a, c) {
        a._d.setTime(Date.UTC.apply(Date, c)), b.updateOffset(a, !1)
    } : ha, Xa = Va ? function(a, c) {
        a._d.setTime(+new Date(c[0] || 0, c[1] || 0, c[2] || 0, c[3] || 0, c[4] || 0, c[5] || 0, c[6] || 0)), b.updateOffset(a, !1)
    } : ha;
    var bb = {
        t: function(a) {
            return ia(a, "a").charAt(0)
        },
        T: function(a) {
            return ia(a, "A").charAt(0)
        }
    };
    Pa.formatRange = ma;
    var cb = {
            Y: "year",
            M: "month",
            D: "day",
            d: "day",
            A: "second",
            a: "second",
            T: "second",
            t: "second",
            H: "second",
            h: "second",
            m: "second",
            s: "second"
        },
        db = {};
    Pa.Class = ra, ra.extend = function() {
        var a, b, c = arguments.length;
        for (a = 0; c > a; a++) b = arguments[a], c - 1 > a && ta(this, b);
        return sa(this, b || {})
    }, ra.mixin = function(a) {
        ta(this, a)
    };
    var eb = Pa.Emitter = ra.extend({
            callbackHash: null,
            on: function(a, b) {
                return this.getCallbacks(a).add(b), this
            },
            off: function(a, b) {
                return this.getCallbacks(a).remove(b), this
            },
            trigger: function(a) {
                var b = Array.prototype.slice.call(arguments, 1);
                return this.triggerWith(a, this, b), this
            },
            triggerWith: function(a, b, c) {
                var d = this.getCallbacks(a);
                return d.fireWith(b, c), this
            },
            getCallbacks: function(b) {
                var c;
                return this.callbackHash || (this.callbackHash = {}), c = this.callbackHash[b], c || (c = this.callbackHash[b] = a.Callbacks()), c
            }
        }),
        fb = ra.extend({
            isHidden: !0,
            options: null,
            el: null,
            documentMousedownProxy: null,
            margin: 10,
            constructor: function(a) {
                this.options = a || {}
            },
            show: function() {
                this.isHidden && (this.el || this.render(), this.el.show(), this.position(), this.isHidden = !1, this.trigger("show"))
            },
            hide: function() {
                this.isHidden || (this.el.hide(), this.isHidden = !0, this.trigger("hide"))
            },
            render: function() {
                var b = this,
                    c = this.options;
                this.el = a('<div class="fc-popover"/>').addClass(c.className || "").css({
                    top: 0,
                    left: 0
                }).append(c.content).appendTo(c.parentEl), this.el.on("click", ".fc-close", function() {
                    b.hide()
                }), c.autoHide && a(document).on("mousedown", this.documentMousedownProxy = ca(this, "documentMousedown"))
            },
            documentMousedown: function(b) {
                this.el && !a(b.target).closest(this.el).length && this.hide()
            },
            removeElement: function() {
                this.hide(), this.el && (this.el.remove(), this.el = null), a(document).off("mousedown", this.documentMousedownProxy)
            },
            position: function() {
                var b, c, d, e, f, g = this.options,
                    h = this.el.offsetParent().offset(),
                    i = this.el.outerWidth(),
                    j = this.el.outerHeight(),
                    k = a(window),
                    l = n(this.el);
                e = g.top || 0, f = void 0 !== g.left ? g.left : void 0 !== g.right ? g.right - i : 0, l.is(window) || l.is(document) ? (l = k, b = 0, c = 0) : (d = l.offset(), b = d.top, c = d.left), b += k.scrollTop(), c += k.scrollLeft(), g.viewportConstrain !== !1 && (e = Math.min(e, b + l.outerHeight() - j - this.margin), e = Math.max(e, b + this.margin), f = Math.min(f, c + l.outerWidth() - i - this.margin),
                    f = Math.max(f, c + this.margin)), this.el.css({
                    top: e - h.top,
                    left: f - h.left
                })
            },
            trigger: function(a) {
                this.options[a] && this.options[a].apply(this, Array.prototype.slice.call(arguments, 1))
            }
        }),
        gb = Pa.CoordCache = ra.extend({
            els: null,
            forcedOffsetParentEl: null,
            origin: null,
            boundingRect: null,
            isHorizontal: !1,
            isVertical: !1,
            lefts: null,
            rights: null,
            tops: null,
            bottoms: null,
            constructor: function(b) {
                this.els = a(b.els), this.isHorizontal = b.isHorizontal, this.isVertical = b.isVertical, this.forcedOffsetParentEl = b.offsetParent ? a(b.offsetParent) : null
            },
            build: function() {
                var a = this.forcedOffsetParentEl || this.els.eq(0).offsetParent();
                this.origin = a.offset(), this.boundingRect = this.queryBoundingRect(), this.isHorizontal && this.buildElHorizontals(), this.isVertical && this.buildElVerticals()
            },
            clear: function() {
                this.origin = null, this.boundingRect = null, this.lefts = null, this.rights = null, this.tops = null, this.bottoms = null
            },
            queryBoundingRect: function() {
                var a = n(this.els.eq(0));
                return a.is(document) ? void 0 : p(a)
            },
            buildElHorizontals: function() {
                var b = [],
                    c = [];
                this.els.each(function(d, e) {
                    var f = a(e),
                        g = f.offset().left,
                        h = f.outerWidth();
                    b.push(g), c.push(g + h)
                }), this.lefts = b, this.rights = c
            },
            buildElVerticals: function() {
                var b = [],
                    c = [];
                this.els.each(function(d, e) {
                    var f = a(e),
                        g = f.offset().top,
                        h = f.outerHeight();
                    b.push(g), c.push(g + h)
                }), this.tops = b, this.bottoms = c
            },
            getHorizontalIndex: function(a) {
                var b, c = this.boundingRect,
                    d = this.lefts,
                    e = this.rights,
                    f = d.length;
                if (!c || a >= c.left && a < c.right)
                    for (b = 0; f > b; b++)
                        if (a >= d[b] && a < e[b]) return b
            },
            getVerticalIndex: function(a) {
                var b, c = this.boundingRect,
                    d = this.tops,
                    e = this.bottoms,
                    f = d.length;
                if (!c || a >= c.top && a < c.bottom)
                    for (b = 0; f > b; b++)
                        if (a >= d[b] && a < e[b]) return b
            },
            getLeftOffset: function(a) {
                return this.lefts[a]
            },
            getLeftPosition: function(a) {
                return this.lefts[a] - this.origin.left
            },
            getRightOffset: function(a) {
                return this.rights[a]
            },
            getRightPosition: function(a) {
                return this.rights[a] - this.origin.left
            },
            getWidth: function(a) {
                return this.rights[a] - this.lefts[a]
            },
            getTopOffset: function(a) {
                return this.tops[a]
            },
            getTopPosition: function(a) {
                return this.tops[a] - this.origin.top
            },
            getBottomOffset: function(a) {
                return this.bottoms[a]
            },
            getBottomPosition: function(a) {
                return this.bottoms[a] - this.origin.top
            },
            getHeight: function(a) {
                return this.bottoms[a] - this.tops[a]
            }
        }),
        hb = Pa.DragListener = ra.extend({
            options: null,
            isListening: !1,
            isDragging: !1,
            originX: null,
            originY: null,
            mousemoveProxy: null,
            mouseupProxy: null,
            subjectEl: null,
            subjectHref: null,
            scrollEl: null,
            scrollBounds: null,
            scrollTopVel: null,
            scrollLeftVel: null,
            scrollIntervalId: null,
            scrollHandlerProxy: null,
            scrollSensitivity: 30,
            scrollSpeed: 200,
            scrollIntervalMs: 50,
            constructor: function(a) {
                a = a || {}, this.options = a, this.subjectEl = a.subjectEl
            },
            mousedown: function(a) {
                v(a) && (a.preventDefault(), this.startListening(a), this.options.distance || this.startDrag(a))
            },
            startListening: function(b) {
                var c;
                this.isListening || (b && this.options.scroll && (c = n(a(b.target)), c.is(window) || c.is(document) || (this.scrollEl = c, this.scrollHandlerProxy = da(ca(this, "scrollHandler"), 100), this.scrollEl.on("scroll", this.scrollHandlerProxy))), a(document).on("mousemove", this.mousemoveProxy = ca(this, "mousemove")).on("mouseup", this.mouseupProxy = ca(this, "mouseup")).on("selectstart", this.preventDefault), b ? (this.originX = b.pageX, this.originY = b.pageY) : (this.originX = 0, this.originY = 0), this.isListening = !0, this.listenStart(b))
            },
            listenStart: function(a) {
                this.trigger("listenStart", a)
            },
            mousemove: function(a) {
                var b, c, d = a.pageX - this.originX,
                    e = a.pageY - this.originY;
                this.isDragging || (b = this.options.distance || 1, c = d * d + e * e, c >= b * b && this.startDrag(a)), this.isDragging && this.drag(d, e, a)
            },
            startDrag: function(a) {
                this.isListening || this.startListening(), this.isDragging || (this.isDragging = !0, this.dragStart(a))
            },
            dragStart: function(a) {
                var b = this.subjectEl;
                this.trigger("dragStart", a), (this.subjectHref = b ? b.attr("href") : null) && b.removeAttr("href")
            },
            drag: function(a, b, c) {
                this.trigger("drag", a, b, c), this.updateScroll(c)
            },
            mouseup: function(a) {
                this.stopListening(a)
            },
            stopDrag: function(a) {
                this.isDragging && (this.stopScrolling(), this.dragStop(a), this.isDragging = !1)
            },
            dragStop: function(a) {
                var b = this;
                this.trigger("dragStop", a), setTimeout(function() {
                    b.subjectHref && b.subjectEl.attr("href", b.subjectHref)
                }, 0)
            },
            stopListening: function(b) {
                this.stopDrag(b), this.isListening && (this.scrollEl && (this.scrollEl.off("scroll", this.scrollHandlerProxy), this.scrollHandlerProxy = null), a(document).off("mousemove", this.mousemoveProxy).off("mouseup", this.mouseupProxy).off("selectstart", this.preventDefault), this.mousemoveProxy = null, this.mouseupProxy = null, this.isListening = !1, this.listenStop(b))
            },
            listenStop: function(a) {
                this.trigger("listenStop", a)
            },
            trigger: function(a) {
                this.options[a] && this.options[a].apply(this, Array.prototype.slice.call(arguments, 1))
            },
            preventDefault: function(a) {
                a.preventDefault()
            },
            computeScrollBounds: function() {
                var a = this.scrollEl;
                this.scrollBounds = a ? o(a) : null
            },
            updateScroll: function(a) {
                var b, c, d, e, f = this.scrollSensitivity,
                    g = this.scrollBounds,
                    h = 0,
                    i = 0;
                g && (b = (f - (a.pageY - g.top)) / f, c = (f - (g.bottom - a.pageY)) / f, d = (f - (a.pageX - g.left)) / f, e = (f - (g.right - a.pageX)) / f, b >= 0 && 1 >= b ? h = b * this.scrollSpeed * -1 : c >= 0 && 1 >= c && (h = c * this.scrollSpeed), d >= 0 && 1 >= d ? i = d * this.scrollSpeed * -1 : e >= 0 && 1 >= e && (i = e * this.scrollSpeed)), this.setScrollVel(h, i)
            },
            setScrollVel: function(a, b) {
                this.scrollTopVel = a, this.scrollLeftVel = b, this.constrainScrollVel(), !this.scrollTopVel && !this.scrollLeftVel || this.scrollIntervalId || (this.scrollIntervalId = setInterval(ca(this, "scrollIntervalFunc"), this.scrollIntervalMs))
            },
            constrainScrollVel: function() {
                var a = this.scrollEl;
                this.scrollTopVel < 0 ? a.scrollTop() <= 0 && (this.scrollTopVel = 0) : this.scrollTopVel > 0 && a.scrollTop() + a[0].clientHeight >= a[0].scrollHeight && (this.scrollTopVel = 0), this.scrollLeftVel < 0 ? a.scrollLeft() <= 0 && (this.scrollLeftVel = 0) : this.scrollLeftVel > 0 && a.scrollLeft() + a[0].clientWidth >= a[0].scrollWidth && (this.scrollLeftVel = 0)
            },
            scrollIntervalFunc: function() {
                var a = this.scrollEl,
                    b = this.scrollIntervalMs / 1e3;
                this.scrollTopVel && a.scrollTop(a.scrollTop() + this.scrollTopVel * b), this.scrollLeftVel && a.scrollLeft(a.scrollLeft() + this.scrollLeftVel * b), this.constrainScrollVel(), this.scrollTopVel || this.scrollLeftVel || this.stopScrolling()
            },
            stopScrolling: function() {
                this.scrollIntervalId && (clearInterval(this.scrollIntervalId), this.scrollIntervalId = null, this.scrollStop())
            },
            scrollHandler: function() {
                this.scrollIntervalId || this.scrollStop()
            },
            scrollStop: function() {}
        }),
        ib = hb.extend({
            component: null,
            origHit: null,
            hit: null,
            coordAdjust: null,
            constructor: function(a, b) {
                hb.call(this, b), this.component = a
            },
            listenStart: function(a) {
                var b, c, d, e = this.subjectEl;
                hb.prototype.listenStart.apply(this, arguments), this.computeCoords(), a ? (c = {
                    left: a.pageX,
                    top: a.pageY
                }, d = c, e && (b = o(e), d = x(d, b)), this.origHit = this.queryHit(d.left, d.top), e && this.options.subjectCenter && (this.origHit && (b = w(this.origHit, b) || b), d = y(b)), this.coordAdjust = z(d, c)) : (this.origHit = null, this.coordAdjust = null)
            },
            computeCoords: function() {
                this.component.prepareHits(), this.computeScrollBounds()
            },
            dragStart: function(a) {
                var b;
                hb.prototype.dragStart.apply(this, arguments), b = this.queryHit(a.pageX, a.pageY), b && this.hitOver(b)
            },
            drag: function(a, b, c) {
                var d;
                hb.prototype.drag.apply(this, arguments), d = this.queryHit(c.pageX, c.pageY), ua(d, this.hit) || (this.hit && this.hitOut(), d && this.hitOver(d))
            },
            dragStop: function() {
                this.hitDone(), hb.prototype.dragStop.apply(this, arguments)
            },
            hitOver: function(a) {
                var b = ua(a, this.origHit);
                this.hit = a, this.trigger("hitOver", this.hit, b, this.origHit)
            },
            hitOut: function() {
                this.hit && (this.trigger("hitOut", this.hit), this.hitDone(), this.hit = null)
            },
            hitDone: function() {
                this.hit && this.trigger("hitDone", this.hit)
            },
            listenStop: function() {
                hb.prototype.listenStop.apply(this, arguments), this.origHit = null, this.hit = null, this.component.releaseHits()
            },
            scrollStop: function() {
                hb.prototype.scrollStop.apply(this, arguments), this.computeCoords()
            },
            queryHit: function(a, b) {
                return this.coordAdjust && (a += this.coordAdjust.left, b += this.coordAdjust.top), this.component.queryHit(a, b)
            }
        }),
        jb = ra.extend({
            options: null,
            sourceEl: null,
            el: null,
            parentEl: null,
            top0: null,
            left0: null,
            mouseY0: null,
            mouseX0: null,
            topDelta: null,
            leftDelta: null,
            mousemoveProxy: null,
            isFollowing: !1,
            isHidden: !1,
            isAnimating: !1,
            constructor: function(b, c) {
                this.options = c = c || {}, this.sourceEl = b, this.parentEl = c.parentEl ? a(c.parentEl) : b.parent()
            },
            start: function(b) {
                this.isFollowing || (this.isFollowing = !0, this.mouseY0 = b.pageY, this.mouseX0 = b.pageX, this.topDelta = 0, this.leftDelta = 0, this.isHidden || this.updatePosition(), a(document).on("mousemove", this.mousemoveProxy = ca(this, "mousemove")))
            },
            stop: function(b, c) {
                function d() {
                    this.isAnimating = !1, e.removeElement(), this.top0 = this.left0 = null, c && c()
                }
                var e = this,
                    f = this.options.revertDuration;
                this.isFollowing && !this.isAnimating && (this.isFollowing = !1, a(document).off("mousemove", this.mousemoveProxy), b && f && !this.isHidden ? (this.isAnimating = !0, this.el.animate({
                    top: this.top0,
                    left: this.left0
                }, {
                    duration: f,
                    complete: d
                })) : d())
            },
            getEl: function() {
                var a = this.el;
                return a || (this.sourceEl.width(), a = this.el = this.sourceEl.clone().css({
                    position: "absolute",
                    visibility: "",
                    display: this.isHidden ? "none" : "",
                    margin: 0,
                    right: "auto",
                    bottom: "auto",
                    width: this.sourceEl.width(),
                    height: this.sourceEl.height(),
                    opacity: this.options.opacity || "",
                    zIndex: this.options.zIndex
                }).appendTo(this.parentEl)), a
            },
            removeElement: function() {
                this.el && (this.el.remove(), this.el = null)
            },
            updatePosition: function() {
                var a, b;
                this.getEl(), null === this.top0 && (this.sourceEl.width(), a = this.sourceEl.offset(), b = this.el.offsetParent().offset(), this.top0 = a.top - b.top, this.left0 = a.left - b.left), this.el.css({
                    top: this.top0 + this.topDelta,
                    left: this.left0 + this.leftDelta
                })
            },
            mousemove: function(a) {
                this.topDelta = a.pageY - this.mouseY0, this.leftDelta = a.pageX - this.mouseX0, this.isHidden || this.updatePosition()
            },
            hide: function() {
                this.isHidden || (this.isHidden = !0, this.el && this.el.hide())
            },
            show: function() {
                this.isHidden && (this.isHidden = !1, this.updatePosition(), this.getEl().show())
            }
        }),
        kb = Pa.Grid = ra.extend({
            view: null,
            isRTL: null,
            start: null,
            end: null,
            el: null,
            elsByFill: null,
            externalDragStartProxy: null,
            eventTimeFormat: null,
            displayEventTime: null,
            displayEventEnd: null,
            minResizeDuration: null,
            largeUnit: null,
            constructor: function(a) {
                this.view = a, this.isRTL = a.opt("isRTL"), this.elsByFill = {}, this.externalDragStartProxy = ca(this, "externalDragStart")
            },
            computeEventTimeFormat: function() {
                return this.view.opt("smallTimeFormat")
            },
            computeDisplayEventTime: function() {
                return !0
            },
            computeDisplayEventEnd: function() {
                return !0
            },
            setRange: function(a) {
                this.start = a.start.clone(), this.end = a.end.clone(), this.rangeUpdated(), this.processRangeOptions()
            },
            rangeUpdated: function() {},
            processRangeOptions: function() {
                var a, b, c = this.view;
                this.eventTimeFormat = c.opt("eventTimeFormat") || c.opt("timeFormat") || this.computeEventTimeFormat(), a = c.opt("displayEventTime"), null == a && (a = this.computeDisplayEventTime()), b = c.opt("displayEventEnd"), null == b && (b = this.computeDisplayEventEnd()), this.displayEventTime = a, this.displayEventEnd = b
            },
            spanToSegs: function(a) {},
            diffDates: function(a, b) {
                return this.largeUnit ? H(a, b, this.largeUnit) : F(a, b)
            },
            prepareHits: function() {},
            releaseHits: function() {},
            queryHit: function(a, b) {},
            getHitSpan: function(a) {},
            getHitEl: function(a) {},
            setElement: function(b) {
                var c = this;
                this.el = b, b.on("mousedown", function(b) {
                    a(b.target).is(".fc-event-container *, .fc-more") || a(b.target).closest(".fc-popover").length || c.dayMousedown(b)
                }), this.bindSegHandlers(), this.bindGlobalHandlers()
            },
            removeElement: function() {
                this.unbindGlobalHandlers(), this.el.remove()
            },
            renderSkeleton: function() {},
            renderDates: function() {},
            unrenderDates: function() {},
            bindGlobalHandlers: function() {
                a(document).on("dragstart sortstart", this.externalDragStartProxy)
            },
            unbindGlobalHandlers: function() {
                a(document).off("dragstart sortstart", this.externalDragStartProxy)
            },
            dayMousedown: function(a) {
                var b, c, d = this,
                    e = this.view,
                    f = e.opt("selectable"),
                    i = new ib(this, {
                        scroll: e.opt("dragScroll"),
                        dragStart: function() {
                            e.unselect()
                        },
                        hitOver: function(a, e, h) {
                            h && (b = e ? a : null, f && (c = d.computeSelection(d.getHitSpan(h), d.getHitSpan(a)), c ? d.renderSelection(c) : c === !1 && g()))
                        },
                        hitOut: function() {
                            b = null, c = null, d.unrenderSelection(), h()
                        },
                        listenStop: function(a) {
                            b && e.triggerDayClick(d.getHitSpan(b), d.getHitEl(b), a), c && e.reportSelection(c, a), h()
                        }
                    });
                i.mousedown(a)
            },
            renderEventLocationHelper: function(a, b) {
                var c = this.fabricateHelperEvent(a, b);
                this.renderHelper(c, b)
            },
            fabricateHelperEvent: function(a, b) {
                var c = b ? R(b.event) : {};
                return c.start = a.start.clone(), c.end = a.end ? a.end.clone() : null, c.allDay = null, this.view.calendar.normalizeEventDates(c), c.className = (c.className || []).concat("fc-helper"), b || (c.editable = !1), c
            },
            renderHelper: function(a, b) {},
            unrenderHelper: function() {},
            renderSelection: function(a) {
                this.renderHighlight(a)
            },
            unrenderSelection: function() {
                this.unrenderHighlight()
            },
            computeSelection: function(a, b) {
                var c = this.computeSelectionSpan(a, b);
                return c && !this.view.calendar.isSelectionSpanAllowed(c) ? !1 : c
            },
            computeSelectionSpan: function(a, b) {
                var c = [a.start, a.end, b.start, b.end];
                return c.sort(aa), {
                    start: c[0].clone(),
                    end: c[3].clone()
                }
            },
            renderHighlight: function(a) {
                this.renderFill("highlight", this.spanToSegs(a))
            },
            unrenderHighlight: function() {
                this.unrenderFill("highlight")
            },
            highlightSegClasses: function() {
                return ["fc-highlight"]
            },
            renderBusinessHours: function() {},
            unrenderBusinessHours: function() {},
            getNowIndicatorUnit: function() {},
            renderNowIndicator: function(a) {},
            unrenderNowIndicator: function() {},
            renderFill: function(a, b) {},
            unrenderFill: function(a) {
                var b = this.elsByFill[a];
                b && (b.remove(), delete this.elsByFill[a])
            },
            renderFillSegEls: function(b, c) {
                var d, e = this,
                    f = this[b + "SegEl"],
                    g = "",
                    h = [];
                if (c.length) {
                    for (d = 0; d < c.length; d++) g += this.fillSegHtml(b, c[d]);
                    a(g).each(function(b, d) {
                        var g = c[b],
                            i = a(d);
                        f && (i = f.call(e, g, i)), i && (i = a(i), i.is(e.fillSegTag) && (g.el = i, h.push(g)))
                    })
                }
                return h
            },
            fillSegTag: "div",
            fillSegHtml: function(a, b) {
                var c = this[a + "SegClasses"],
                    d = this[a + "SegCss"],
                    e = c ? c.call(this, b) : [],
                    f = $(d ? d.call(this, b) : {});
                return "<" + this.fillSegTag + (e.length ? ' class="' + e.join(" ") + '"' : "") + (f ? ' style="' + f + '"' : "") + " />"
            },
            getDayClasses: function(a) {
                var b = this.view,
                    c = b.calendar.getNow(),
                    d = ["fc-" + Ta[a.day()]];
                return 1 == b.intervalDuration.as("months") && a.month() != b.intervalStart.month() && d.push("fc-other-month"), a.isSame(c, "day") ? d.push("fc-today", b.highlightStateClass) : c > a ? d.push("fc-past") : d.push("fc-future"), d
            }
        });
    kb.mixin({
        mousedOverSeg: null,
        isDraggingSeg: !1,
        isResizingSeg: !1,
        isDraggingExternal: !1,
        segs: null,
        renderEvents: function(a) {
            var b, c = [],
                d = [];
            for (b = 0; b < a.length; b++)(wa(a[b]) ? c : d).push(a[b]);
            this.segs = [].concat(this.renderBgEvents(c), this.renderFgEvents(d))
        },
        renderBgEvents: function(a) {
            var b = this.eventsToSegs(a);
            return this.renderBgSegs(b) || b
        },
        renderFgEvents: function(a) {
            var b = this.eventsToSegs(a);
            return this.renderFgSegs(b) || b
        },
        unrenderEvents: function() {
            this.triggerSegMouseout(), this.unrenderFgSegs(), this.unrenderBgSegs(), this.segs = null
        },
        getEventSegs: function() {
            return this.segs || []
        },
        renderFgSegs: function(a) {},
        unrenderFgSegs: function() {},
        renderFgSegEls: function(b, c) {
            var d, e = this.view,
                f = "",
                g = [];
            if (b.length) {
                for (d = 0; d < b.length; d++) f += this.fgSegHtml(b[d], c);
                a(f).each(function(c, d) {
                    var f = b[c],
                        h = e.resolveEventEl(f.event, a(d));
                    h && (h.data("fc-seg", f), f.el = h, g.push(f))
                })
            }
            return g
        },
        fgSegHtml: function(a, b) {},
        renderBgSegs: function(a) {
            return this.renderFill("bgEvent", a)
        },
        unrenderBgSegs: function() {
            this.unrenderFill("bgEvent")
        },
        bgEventSegEl: function(a, b) {
            return this.view.resolveEventEl(a.event, b)
        },
        bgEventSegClasses: function(a) {
            var b = a.event,
                c = b.source || {};
            return ["fc-bgevent"].concat(b.className, c.className || [])
        },
        bgEventSegCss: function(a) {
            var b = this.view,
                c = a.event,
                d = c.source || {};
            return {
                "background-color": c.backgroundColor || c.color || d.backgroundColor || d.color || b.opt("eventBackgroundColor") || b.opt("eventColor")
            }
        },
        businessHoursSegClasses: function(a) {
            return ["fc-nonbusiness", "fc-bgevent"]
        },
        bindSegHandlers: function() {
            var b = this,
                c = this.view;
            a.each({
                mouseenter: function(a, c) {
                    b.triggerSegMouseover(a, c)
                },
                mouseleave: function(a, c) {
                    b.triggerSegMouseout(a, c)
                },
                click: function(a, b) {
                    return c.trigger("eventClick", this, a.event, b)
                },
                mousedown: function(d, e) {
                    a(e.target).is(".fc-resizer") && c.isEventResizable(d.event) ? b.segResizeMousedown(d, e, a(e.target).is(".fc-start-resizer")) : c.isEventDraggable(d.event) && b.segDragMousedown(d, e)
                }
            }, function(c, d) {
                b.el.on(c, ".fc-event-container > *", function(c) {
                    var e = a(this).data("fc-seg");
                    return !e || b.isDraggingSeg || b.isResizingSeg ? void 0 : d.call(this, e, c)
                })
            })
        },
        triggerSegMouseover: function(a, b) {
            this.mousedOverSeg || (this.mousedOverSeg = a, this.view.trigger("eventMouseover", a.el[0], a.event, b))
        },
        triggerSegMouseout: function(a, b) {
            b = b || {}, this.mousedOverSeg && (a = a || this.mousedOverSeg, this.mousedOverSeg = null, this.view.trigger("eventMouseout", a.el[0], a.event, b))
        },
        segDragMousedown: function(a, b) {
            var c, d = this,
                e = this.view,
                f = e.calendar,
                i = a.el,
                j = a.event,
                k = new jb(a.el, {
                    parentEl: e.el,
                    opacity: e.opt("dragOpacity"),
                    revertDuration: e.opt("dragRevertDuration"),
                    zIndex: 2
                }),
                l = new ib(e, {
                    distance: 5,
                    scroll: e.opt("dragScroll"),
                    subjectEl: i,
                    subjectCenter: !0,
                    listenStart: function(a) {
                        k.hide(), k.start(a)
                    },
                    dragStart: function(b) {
                        d.triggerSegMouseout(a, b), d.segDragStart(a, b), e.hideEvent(j)
                    },
                    hitOver: function(b, h, i) {
                        a.hit && (i = a.hit), c = d.computeEventDrop(i.component.getHitSpan(i), b.component.getHitSpan(b), j), c && !f.isEventSpanAllowed(d.eventToSpan(c), j) && (g(), c = null), c && e.renderDrag(c, a) ? k.hide() : k.show(), h && (c = null)
                    },
                    hitOut: function() {
                        e.unrenderDrag(), k.show(), c = null
                    },
                    hitDone: function() {
                        h()
                    },
                    dragStop: function(b) {
                        k.stop(!c, function() {
                            e.unrenderDrag(), e.showEvent(j), d.segDragStop(a, b), c && e.reportEventDrop(j, c, this.largeUnit, i, b)
                        })
                    },
                    listenStop: function() {
                        k.stop()
                    }
                });
            l.mousedown(b)
        },
        segDragStart: function(a, b) {
            this.isDraggingSeg = !0, this.view.trigger("eventDragStart", a.el[0], a.event, b, {})
        },
        segDragStop: function(a, b) {
            this.isDraggingSeg = !1, this.view.trigger("eventDragStop", a.el[0], a.event, b, {})
        },
        computeEventDrop: function(a, b, c) {
            var d, e, f = this.view.calendar,
                g = a.start,
                h = b.start;
            return g.hasTime() === h.hasTime() ? (d = this.diffDates(h, g), c.allDay && N(d) ? (e = {
                start: c.start.clone(),
                end: f.getEventEnd(c),
                allDay: !1
            }, f.normalizeEventTimes(e)) : e = {
                start: c.start.clone(),
                end: c.end ? c.end.clone() : null,
                allDay: c.allDay
            }, e.start.add(d), e.end && e.end.add(d)) : e = {
                start: h.clone(),
                end: null,
                allDay: !h.hasTime()
            }, e
        },
        applyDragOpacity: function(a) {
            var b = this.view.opt("dragOpacity");
            null != b && a.each(function(a, c) {
                c.style.opacity = b
            })
        },
        externalDragStart: function(b, c) {
            var d, e, f = this.view;
            f.opt("droppable") && (d = a((c ? c.item : null) || b.target), e = f.opt("dropAccept"), (a.isFunction(e) ? e.call(d[0], d) : d.is(e)) && (this.isDraggingExternal || this.listenToExternalDrag(d, b, c)))
        },
        listenToExternalDrag: function(a, b, c) {
            var d, e = this,
                f = this.view.calendar,
                i = Ba(a),
                j = new ib(this, {
                    listenStart: function() {
                        e.isDraggingExternal = !0
                    },
                    hitOver: function(a) {
                        d = e.computeExternalDrop(a.component.getHitSpan(a), i), d && !f.isExternalSpanAllowed(e.eventToSpan(d), d, i.eventProps) && (g(), d = null), d && e.renderDrag(d)
                    },
                    hitOut: function() {
                        d = null
                    },
                    hitDone: function() {
                        h(), e.unrenderDrag()
                    },
                    dragStop: function() {
                        d && e.view.reportExternalDrop(i, d, a, b, c)
                    },
                    listenStop: function() {
                        e.isDraggingExternal = !1
                    }
                });
            j.startDrag(b)
        },
        computeExternalDrop: function(a, b) {
            var c = this.view.calendar,
                d = {
                    start: c.applyTimezone(a.start),
                    end: null
                };
            return b.startTime && !d.start.hasTime() && d.start.time(b.startTime), b.duration && (d.end = d.start.clone().add(b.duration)), d
        },
        renderDrag: function(a, b) {},
        unrenderDrag: function() {},
        segResizeMousedown: function(a, b, c) {
            var d, e = this,
                f = this.view,
                i = f.calendar,
                j = a.el,
                k = a.event,
                l = i.getEventEnd(k),
                m = new ib(this, {
                    distance: 5,
                    scroll: f.opt("dragScroll"),
                    subjectEl: j,
                    dragStart: function(b) {
                        e.triggerSegMouseout(a, b), e.segResizeStart(a, b)
                    },
                    hitOver: function(b, h, j) {
                        var m = e.getHitSpan(j),
                            n = e.getHitSpan(b);
                        d = c ? e.computeEventStartResize(m, n, k) : e.computeEventEndResize(m, n, k), d && (i.isEventSpanAllowed(e.eventToSpan(d), k) ? d.start.isSame(k.start) && d.end.isSame(l) && (d = null) : (g(), d = null)), d && (f.hideEvent(k), e.renderEventResize(d, a))
                    },
                    hitOut: function() {
                        d = null
                    },
                    hitDone: function() {
                        e.unrenderEventResize(), f.showEvent(k), h()
                    },
                    dragStop: function(b) {
                        e.segResizeStop(a, b), d && f.reportEventResize(k, d, this.largeUnit, j, b)
                    }
                });
            m.mousedown(b)
        },
        segResizeStart: function(a, b) {
            this.isResizingSeg = !0, this.view.trigger("eventResizeStart", a.el[0], a.event, b, {})
        },
        segResizeStop: function(a, b) {
            this.isResizingSeg = !1, this.view.trigger("eventResizeStop", a.el[0], a.event, b, {})
        },
        computeEventStartResize: function(a, b, c) {
            return this.computeEventResize("start", a, b, c)
        },
        computeEventEndResize: function(a, b, c) {
            return this.computeEventResize("end", a, b, c)
        },
        computeEventResize: function(a, b, c, d) {
            var e, f, g = this.view.calendar,
                h = this.diffDates(c[a], b[a]);
            return e = {
                start: d.start.clone(),
                end: g.getEventEnd(d),
                allDay: d.allDay
            }, e.allDay && N(h) && (e.allDay = !1, g.normalizeEventTimes(e)), e[a].add(h), e.start.isBefore(e.end) || (f = this.minResizeDuration || (d.allDay ? g.defaultAllDayEventDuration : g.defaultTimedEventDuration), "start" == a ? e.start = e.end.clone().subtract(f) : e.end = e.start.clone().add(f)), e
        },
        renderEventResize: function(a, b) {},
        unrenderEventResize: function() {},
        getEventTimeText: function(a, b, c) {
            return null == b && (b = this.eventTimeFormat), null == c && (c = this.displayEventEnd), this.displayEventTime && a.start.hasTime() ? c && a.end ? this.view.formatRange(a, b) : a.start.format(b) : ""
        },
        getSegClasses: function(a, b, c) {
            var d = a.event,
                e = ["fc-event", a.isStart ? "fc-start" : "fc-not-start", a.isEnd ? "fc-end" : "fc-not-end"].concat(d.className, d.source ? d.source.className : []);
            return b && e.push("fc-draggable"), c && e.push("fc-resizable"), e
        },
        getEventSkinCss: function(a) {
            var b = this.view,
                c = a.source || {},
                d = a.color,
                e = c.color,
                f = b.opt("eventColor");
            return {
                "background-color": a.backgroundColor || d || c.backgroundColor || e || b.opt("eventBackgroundColor") || f,
                "border-color": a.borderColor || d || c.borderColor || e || b.opt("eventBorderColor") || f,
                color: a.textColor || c.textColor || b.opt("eventTextColor")
            }
        },
        eventToSegs: function(a) {
            return this.eventsToSegs([a])
        },
        eventToSpan: function(a) {
            return this.eventToSpans(a)[0]
        },
        eventToSpans: function(a) {
            var b = this.eventToRange(a);
            return this.eventRangeToSpans(b, a)
        },
        eventsToSegs: function(b, c) {
            var d = this,
                e = za(b),
                f = [];
            return a.each(e, function(a, b) {
                var e, g = [];
                for (e = 0; e < b.length; e++) g.push(d.eventToRange(b[e]));
                if (xa(b[0]))
                    for (g = d.invertRanges(g), e = 0; e < g.length; e++) f.push.apply(f, d.eventRangeToSegs(g[e], b[0], c));
                else
                    for (e = 0; e < g.length; e++) f.push.apply(f, d.eventRangeToSegs(g[e], b[e], c))
            }), f
        },
        eventToRange: function(a) {
            return {
                start: a.start.clone().stripZone(),
                end: (a.end ? a.end.clone() : this.view.calendar.getDefaultEventEnd(null != a.allDay ? a.allDay : !a.start.hasTime(), a.start)).stripZone()
            }
        },
        eventRangeToSegs: function(a, b, c) {
            var d, e = this.eventRangeToSpans(a, b),
                f = [];
            for (d = 0; d < e.length; d++) f.push.apply(f, this.eventSpanToSegs(e[d], b, c));
            return f
        },
        eventRangeToSpans: function(b, c) {
            return [a.extend({}, b)]
        },
        eventSpanToSegs: function(a, b, c) {
            var d, e, f = c ? c(a) : this.spanToSegs(a);
            for (d = 0; d < f.length; d++) e = f[d], e.event = b, e.eventStartMS = +a.start, e.eventDurationMS = a.end - a.start;
            return f
        },
        invertRanges: function(a) {
            var b, c, d = this.view,
                e = d.start.clone(),
                f = d.end.clone(),
                g = [],
                h = e;
            for (a.sort(Aa), b = 0; b < a.length; b++) c = a[b], c.start > h && g.push({
                start: h,
                end: c.start
            }), h = c.end;
            return f > h && g.push({
                start: h,
                end: f
            }), g
        },
        sortEventSegs: function(a) {
            a.sort(ca(this, "compareEventSegs"))
        },
        compareEventSegs: function(a, b) {
            return a.eventStartMS - b.eventStartMS || b.eventDurationMS - a.eventDurationMS || b.event.allDay - a.event.allDay || B(a.event, b.event, this.view.eventOrderSpecs)
        }
    }), Pa.isBgEvent = wa, Pa.dataAttrPrefix = "";
    var lb = Pa.DayTableMixin = {
            breakOnWeeks: !1,
            dayDates: null,
            dayIndices: null,
            daysPerRow: null,
            rowCnt: null,
            colCnt: null,
            colHeadFormat: null,
            updateDayTable: function() {
                for (var a, b, c, d = this.view, e = this.start.clone(), f = -1, g = [], h = []; e.isBefore(this.end);) d.isHiddenDay(e) ? g.push(f + .5) : (f++, g.push(f), h.push(e.clone())), e.add(1, "days");
                if (this.breakOnWeeks) {
                    for (b = h[0].day(), a = 1; a < h.length && h[a].day() != b; a++);
                    c = Math.ceil(h.length / a)
                } else c = 1, a = h.length;
                this.dayDates = h, this.dayIndices = g, this.daysPerRow = a, this.rowCnt = c, this.updateDayTableCols()
            },
            updateDayTableCols: function() {
                this.colCnt = this.computeColCnt(), this.colHeadFormat = this.view.opt("columnFormat") || this.computeColHeadFormat()
            },
            computeColCnt: function() {
                return this.daysPerRow
            },
            getCellDate: function(a, b) {
                return this.dayDates[this.getCellDayIndex(a, b)].clone()
            },
            getCellRange: function(a, b) {
                var c = this.getCellDate(a, b),
                    d = c.clone().add(1, "days");
                return {
                    start: c,
                    end: d
                }
            },
            getCellDayIndex: function(a, b) {
                return a * this.daysPerRow + this.getColDayIndex(b)
            },
            getColDayIndex: function(a) {
                return this.isRTL ? this.colCnt - 1 - a : a
            },
            getDateDayIndex: function(a) {
                var b = this.dayIndices,
                    c = a.diff(this.start, "days");
                return 0 > c ? b[0] - 1 : c >= b.length ? b[b.length - 1] + 1 : b[c]
            },
            computeColHeadFormat: function() {
                return this.rowCnt > 1 || this.colCnt > 10 ? "ddd" : this.colCnt > 1 ? this.view.opt("dayOfMonthFormat") : "dddd"
            },
            sliceRangeByRow: function(a) {
                var b, c, d, e, f, g = this.daysPerRow,
                    h = this.view.computeDayRange(a),
                    i = this.getDateDayIndex(h.start),
                    j = this.getDateDayIndex(h.end.clone().subtract(1, "days")),
                    k = [];
                for (b = 0; b < this.rowCnt; b++) c = b * g, d = c + g - 1, e = Math.max(i, c), f = Math.min(j, d), e = Math.ceil(e), f = Math.floor(f), f >= e && k.push({
                    row: b,
                    firstRowDayIndex: e - c,
                    lastRowDayIndex: f - c,
                    isStart: e === i,
                    isEnd: f === j
                });
                return k
            },
            sliceRangeByDay: function(a) {
                var b, c, d, e, f, g, h = this.daysPerRow,
                    i = this.view.computeDayRange(a),
                    j = this.getDateDayIndex(i.start),
                    k = this.getDateDayIndex(i.end.clone().subtract(1, "days")),
                    l = [];
                for (b = 0; b < this.rowCnt; b++)
                    for (c = b * h, d = c + h - 1, e = c; d >= e; e++) f = Math.max(j, e), g = Math.min(k, e), f = Math.ceil(f), g = Math.floor(g), g >= f && l.push({
                        row: b,
                        firstRowDayIndex: f - c,
                        lastRowDayIndex: g - c,
                        isStart: f === j,
                        isEnd: g === k
                    });
                return l
            },
            renderHeadHtml: function() {
                var a = this.view;
                return '<div class="fc-row ' + a.widgetHeaderClass + '"><table><thead>' + this.renderHeadTrHtml() + "</thead></table></div>"
            },
            renderHeadIntroHtml: function() {
                return this.renderIntroHtml()
            },
            renderHeadTrHtml: function() {
                return "<tr>" + (this.isRTL ? "" : this.renderHeadIntroHtml()) + this.renderHeadDateCellsHtml() + (this.isRTL ? this.renderHeadIntroHtml() : "") + "</tr>"
            },
            renderHeadDateCellsHtml: function() {
                var a, b, c = [];
                for (a = 0; a < this.colCnt; a++) b = this.getCellDate(0, a), c.push(this.renderHeadDateCellHtml(b));
                return c.join("")
            },
            renderHeadDateCellHtml: function(a, b, c) {
                var d = this.view;
                return '<th class="fc-day-header ' + d.widgetHeaderClass + " fc-" + Ta[a.day()] + '"' + (1 == this.rowCnt ? ' data-date="' + a.format("YYYY-MM-DD") + '"' : "") + (b > 1 ? ' colspan="' + b + '"' : "") + (c ? " " + c : "") + ">" + Y(a.format(this.colHeadFormat)) + "</th>"
            },
            renderBgTrHtml: function(a) {
                return "<tr>" + (this.isRTL ? "" : this.renderBgIntroHtml(a)) + this.renderBgCellsHtml(a) + (this.isRTL ? this.renderBgIntroHtml(a) : "") + "</tr>"
            },
            renderBgIntroHtml: function(a) {
                return this.renderIntroHtml()
            },
            renderBgCellsHtml: function(a) {
                var b, c, d = [];
                for (b = 0; b < this.colCnt; b++) c = this.getCellDate(a, b), d.push(this.renderBgCellHtml(c));
                return d.join("")
            },
            renderBgCellHtml: function(a, b) {
                var c = this.view,
                    d = this.getDayClasses(a);
                return d.unshift("fc-day", c.widgetContentClass), '<td class="' + d.join(" ") + '" data-date="' + a.format("YYYY-MM-DD") + '"' + (b ? " " + b : "") + "></td>"
            },
            renderIntroHtml: function() {},
            bookendCells: function(a) {
                var b = this.renderIntroHtml();
                b && (this.isRTL ? a.append(b) : a.prepend(b))
            }
        },
        mb = Pa.DayGrid = kb.extend(lb, {
            numbersVisible: !1,
            bottomCoordPadding: 0,
            rowEls: null,
            cellEls: null,
            helperEls: null,
            rowCoordCache: null,
            colCoordCache: null,
            renderDates: function(a) {
                var b, c, d = this.view,
                    e = this.rowCnt,
                    f = this.colCnt,
                    g = "";
                for (b = 0; e > b; b++) g += this.renderDayRowHtml(b, a);
                for (this.el.html(g), this.rowEls = this.el.find(".fc-row"), this.cellEls = this.el.find(".fc-day"), this.rowCoordCache = new gb({
                        els: this.rowEls,
                        isVertical: !0
                    }), this.colCoordCache = new gb({
                        els: this.cellEls.slice(0, this.colCnt),
                        isHorizontal: !0
                    }), b = 0; e > b; b++)
                    for (c = 0; f > c; c++) d.trigger("dayRender", null, this.getCellDate(b, c), this.getCellEl(b, c))
            },
            unrenderDates: function() {
                this.removeSegPopover()
            },
            renderBusinessHours: function() {
                var a = this.view.calendar.getBusinessHoursEvents(!0),
                    b = this.eventsToSegs(a);
                this.renderFill("businessHours", b, "bgevent")
            },
            renderDayRowHtml: function(a, b) {
                var c = this.view,
                    d = ["fc-row", "fc-week", c.widgetContentClass];
                return b && d.push("fc-rigid"), '<div class="' + d.join(" ") + '"><div class="fc-bg"><table>' + this.renderBgTrHtml(a) + '</table></div><div class="fc-content-skeleton"><table>' + (this.numbersVisible ? "<thead>" + this.renderNumberTrHtml(a) + "</thead>" : "") + "</table></div></div>"
            },
            renderNumberTrHtml: function(a) {
                return "<tr>" + (this.isRTL ? "" : this.renderNumberIntroHtml(a)) + this.renderNumberCellsHtml(a) + (this.isRTL ? this.renderNumberIntroHtml(a) : "") + "</tr>"
            },
            renderNumberIntroHtml: function(a) {
                return this.renderIntroHtml()
            },
            renderNumberCellsHtml: function(a) {
                var b, c, d = [];
                for (b = 0; b < this.colCnt; b++) c = this.getCellDate(a, b), d.push(this.renderNumberCellHtml(c));
                return d.join("")
            },
            renderNumberCellHtml: function(a) {
                var b;
                return this.view.dayNumbersVisible ? (b = this.getDayClasses(a), b.unshift("fc-day-number"), '<td class="' + b.join(" ") + '" data-date="' + a.format() + '">' + a.date() + "</td>") : "<td/>"
            },
            computeEventTimeFormat: function() {
                return this.view.opt("extraSmallTimeFormat")
            },
            computeDisplayEventEnd: function() {
                return 1 == this.colCnt
            },
            rangeUpdated: function() {
                this.updateDayTable()
            },
            spanToSegs: function(a) {
                var b, c, d = this.sliceRangeByRow(a);
                for (b = 0; b < d.length; b++) c = d[b], this.isRTL ? (c.leftCol = this.daysPerRow - 1 - c.lastRowDayIndex, c.rightCol = this.daysPerRow - 1 - c.firstRowDayIndex) : (c.leftCol = c.firstRowDayIndex, c.rightCol = c.lastRowDayIndex);
                return d
            },
            prepareHits: function() {
                this.colCoordCache.build(), this.rowCoordCache.build(), this.rowCoordCache.bottoms[this.rowCnt - 1] += this.bottomCoordPadding
            },
            releaseHits: function() {
                this.colCoordCache.clear(), this.rowCoordCache.clear()
            },
            queryHit: function(a, b) {
                var c = this.colCoordCache.getHorizontalIndex(a),
                    d = this.rowCoordCache.getVerticalIndex(b);
                return null != d && null != c ? this.getCellHit(d, c) : void 0
            },
            getHitSpan: function(a) {
                return this.getCellRange(a.row, a.col)
            },
            getHitEl: function(a) {
                return this.getCellEl(a.row, a.col)
            },
            getCellHit: function(a, b) {
                return {
                    row: a,
                    col: b,
                    component: this,
                    left: this.colCoordCache.getLeftOffset(b),
                    right: this.colCoordCache.getRightOffset(b),
                    top: this.rowCoordCache.getTopOffset(a),
                    bottom: this.rowCoordCache.getBottomOffset(a)
                }
            },
            getCellEl: function(a, b) {
                return this.cellEls.eq(a * this.colCnt + b)
            },
            renderDrag: function(a, b) {
                return this.renderHighlight(this.eventToSpan(a)), b && !b.el.closest(this.el).length ? (this.renderEventLocationHelper(a, b), this.applyDragOpacity(this.helperEls), !0) : void 0
            },
            unrenderDrag: function() {
                this.unrenderHighlight(), this.unrenderHelper()
            },
            renderEventResize: function(a, b) {
                this.renderHighlight(this.eventToSpan(a)), this.renderEventLocationHelper(a, b)
            },
            unrenderEventResize: function() {
                this.unrenderHighlight(), this.unrenderHelper()
            },
            renderHelper: function(b, c) {
                var d, e = [],
                    f = this.eventToSegs(b);
                f = this.renderFgSegEls(f), d = this.renderSegRows(f), this.rowEls.each(function(b, f) {
                    var g, h = a(f),
                        i = a('<div class="fc-helper-skeleton"><table/></div>');
                    g = c && c.row === b ? c.el.position().top : h.find(".fc-content-skeleton tbody").position().top, i.css("top", g).find("table").append(d[b].tbodyEl), h.append(i), e.push(i[0])
                }), this.helperEls = a(e)
            },
            unrenderHelper: function() {
                this.helperEls && (this.helperEls.remove(), this.helperEls = null)
            },
            fillSegTag: "td",
            renderFill: function(b, c, d) {
                var e, f, g, h = [];
                for (c = this.renderFillSegEls(b, c), e = 0; e < c.length; e++) f = c[e], g = this.renderFillRow(b, f, d), this.rowEls.eq(f.row).append(g), h.push(g[0]);
                return this.elsByFill[b] = a(h), c
            },
            renderFillRow: function(b, c, d) {
                var e, f, g = this.colCnt,
                    h = c.leftCol,
                    i = c.rightCol + 1;
                return d = d || b.toLowerCase(), e = a('<div class="fc-' + d + '-skeleton"><table><tr/></table></div>'), f = e.find("tr"), h > 0 && f.append('<td colspan="' + h + '"/>'), f.append(c.el.attr("colspan", i - h)), g > i && f.append('<td colspan="' + (g - i) + '"/>'), this.bookendCells(f), e
            }
        });
    mb.mixin({
        rowStructs: null,
        unrenderEvents: function() {
            this.removeSegPopover(), kb.prototype.unrenderEvents.apply(this, arguments)
        },
        getEventSegs: function() {
            return kb.prototype.getEventSegs.call(this).concat(this.popoverSegs || [])
        },
        renderBgSegs: function(b) {
            var c = a.grep(b, function(a) {
                return a.event.allDay
            });
            return kb.prototype.renderBgSegs.call(this, c)
        },
        renderFgSegs: function(b) {
            var c;
            return b = this.renderFgSegEls(b), c = this.rowStructs = this.renderSegRows(b), this.rowEls.each(function(b, d) {
                a(d).find(".fc-content-skeleton > table").append(c[b].tbodyEl)
            }), b
        },
        unrenderFgSegs: function() {
            for (var a, b = this.rowStructs || []; a = b.pop();) a.tbodyEl.remove();
            this.rowStructs = null
        },
        renderSegRows: function(a) {
            var b, c, d = [];
            for (b = this.groupSegRows(a), c = 0; c < b.length; c++) d.push(this.renderSegRow(c, b[c]));
            return d
        },
        fgSegHtml: function(a, b) {
            var c, d, e = this.view,
                f = a.event,
                g = e.isEventDraggable(f),
                h = !b && f.allDay && a.isStart && e.isEventResizableFromStart(f),
                i = !b && f.allDay && a.isEnd && e.isEventResizableFromEnd(f),
                j = this.getSegClasses(a, g, h || i),
                k = $(this.getEventSkinCss(f)),
                l = "";
            return j.unshift("fc-day-grid-event", "fc-h-event"), a.isStart && (c = this.getEventTimeText(f), c && (l = '<span class="fc-time">' + Y(c) + "</span>")), d = '<span class="fc-title">' + (Y(f.title || "") || "&nbsp;") + "</span>", '<a class="' + j.join(" ") + '"' + (f.url ? ' href="' + Y(f.url) + '"' : "") + (k ? ' style="' + k + '"' : "") + '><div class="fc-content">' + (this.isRTL ? d + " " + l : l + " " + d) + "</div>" + (h ? '<div class="fc-resizer fc-start-resizer" />' : "") + (i ? '<div class="fc-resizer fc-end-resizer" />' : "") + "</a>"
        },
        renderSegRow: function(b, c) {
            function d(b) {
                for (; b > g;) k = (r[e - 1] || [])[g], k ? k.attr("rowspan", parseInt(k.attr("rowspan") || 1, 10) + 1) : (k = a("<td/>"), h.append(k)), q[e][g] = k, r[e][g] = k, g++
            }
            var e, f, g, h, i, j, k, l = this.colCnt,
                m = this.buildSegLevels(c),
                n = Math.max(1, m.length),
                o = a("<tbody/>"),
                p = [],
                q = [],
                r = [];
            for (e = 0; n > e; e++) {
                if (f = m[e], g = 0, h = a("<tr/>"), p.push([]), q.push([]), r.push([]), f)
                    for (i = 0; i < f.length; i++) {
                        for (j = f[i], d(j.leftCol), k = a('<td class="fc-event-container"/>').append(j.el), j.leftCol != j.rightCol ? k.attr("colspan", j.rightCol - j.leftCol + 1) : r[e][g] = k; g <= j.rightCol;) q[e][g] = k, p[e][g] = j, g++;
                        h.append(k)
                    }
                d(l), this.bookendCells(h), o.append(h)
            }
            return {
                row: b,
                tbodyEl: o,
                cellMatrix: q,
                segMatrix: p,
                segLevels: m,
                segs: c
            }
        },
        buildSegLevels: function(a) {
            var b, c, d, e = [];
            for (this.sortEventSegs(a), b = 0; b < a.length; b++) {
                for (c = a[b], d = 0; d < e.length && Ca(c, e[d]); d++);
                c.level = d, (e[d] || (e[d] = [])).push(c)
            }
            for (d = 0; d < e.length; d++) e[d].sort(Da);
            return e
        },
        groupSegRows: function(a) {
            var b, c = [];
            for (b = 0; b < this.rowCnt; b++) c.push([]);
            for (b = 0; b < a.length; b++) c[a[b].row].push(a[b]);
            return c
        }
    }), mb.mixin({
        segPopover: null,
        popoverSegs: null,
        removeSegPopover: function() {
            this.segPopover && this.segPopover.hide()
        },
        limitRows: function(a) {
            var b, c, d = this.rowStructs || [];
            for (b = 0; b < d.length; b++) this.unlimitRow(b), c = a ? "number" == typeof a ? a : this.computeRowLevelLimit(b) : !1, c !== !1 && this.limitRow(b, c)
        },
        computeRowLevelLimit: function(b) {
            function c(b, c) {
                f = Math.max(f, a(c).outerHeight())
            }
            var d, e, f, g = this.rowEls.eq(b),
                h = g.height(),
                i = this.rowStructs[b].tbodyEl.children();
            for (d = 0; d < i.length; d++)
                if (e = i.eq(d).removeClass("fc-limited"), f = 0, e.find("> td > :first-child").each(c), e.position().top + f > h) return d;
            return !1
        },
        limitRow: function(b, c) {
            function d(d) {
                for (; d > w;) j = t.getCellSegs(b, w, c), j.length && (m = f[c - 1][w], s = t.renderMoreLink(b, w, j), r = a("<div/>").append(s), m.append(r), v.push(r[0])), w++
            }
            var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t = this,
                u = this.rowStructs[b],
                v = [],
                w = 0;
            if (c && c < u.segLevels.length) {
                for (e = u.segLevels[c - 1], f = u.cellMatrix, g = u.tbodyEl.children().slice(c).addClass("fc-limited").get(), h = 0; h < e.length; h++) {
                    for (i = e[h], d(i.leftCol), l = [], k = 0; w <= i.rightCol;) j = this.getCellSegs(b, w, c), l.push(j), k += j.length, w++;
                    if (k) {
                        for (m = f[c - 1][i.leftCol], n = m.attr("rowspan") || 1, o = [], p = 0; p < l.length; p++) q = a('<td class="fc-more-cell"/>').attr("rowspan", n), j = l[p], s = this.renderMoreLink(b, i.leftCol + p, [i].concat(j)), r = a("<div/>").append(s), q.append(r), o.push(q[0]), v.push(q[0]);
                        m.addClass("fc-limited").after(a(o)), g.push(m[0])
                    }
                }
                d(this.colCnt), u.moreEls = a(v), u.limitedEls = a(g)
            }
        },
        unlimitRow: function(a) {
            var b = this.rowStructs[a];
            b.moreEls && (b.moreEls.remove(), b.moreEls = null), b.limitedEls && (b.limitedEls.removeClass("fc-limited"), b.limitedEls = null)
        },
        renderMoreLink: function(b, c, d) {
            var e = this,
                f = this.view;
            return a('<a class="fc-more"/>').text(this.getMoreLinkText(d.length)).on("click", function(g) {
                var h = f.opt("eventLimitClick"),
                    i = e.getCellDate(b, c),
                    j = a(this),
                    k = e.getCellEl(b, c),
                    l = e.getCellSegs(b, c),
                    m = e.resliceDaySegs(l, i),
                    n = e.resliceDaySegs(d, i);
                "function" == typeof h && (h = f.trigger("eventLimitClick", null, {
                    date: i,
                    dayEl: k,
                    moreEl: j,
                    segs: m,
                    hiddenSegs: n
                }, g)), "popover" === h ? e.showSegPopover(b, c, j, m) : "string" == typeof h && f.calendar.zoomTo(i, h)
            })
        },
        showSegPopover: function(a, b, c, d) {
            var e, f, g = this,
                h = this.view,
                i = c.parent();
            e = 1 == this.rowCnt ? h.el : this.rowEls.eq(a), f = {
                className: "fc-more-popover",
                content: this.renderSegPopoverContent(a, b, d),
                parentEl: this.el,
                top: e.offset().top,
                autoHide: !0,
                viewportConstrain: h.opt("popoverViewportConstrain"),
                hide: function() {
                    g.segPopover.removeElement(), g.segPopover = null, g.popoverSegs = null
                }
            }, this.isRTL ? f.right = i.offset().left + i.outerWidth() + 1 : f.left = i.offset().left - 1, this.segPopover = new fb(f), this.segPopover.show()
        },
        renderSegPopoverContent: function(b, c, d) {
            var e, f = this.view,
                g = f.opt("theme"),
                h = this.getCellDate(b, c).format(f.opt("dayPopoverFormat")),
                i = a('<div class="fc-header ' + f.widgetHeaderClass + '"><span class="fc-close ' + (g ? "ui-icon ui-icon-closethick" : "fc-icon fc-icon-x") + '"></span><span class="fc-title">' + Y(h) + '</span><div class="fc-clear"/></div><div class="fc-body ' + f.widgetContentClass + '"><div class="fc-event-container"></div></div>'),
                j = i.find(".fc-event-container");
            for (d = this.renderFgSegEls(d, !0), this.popoverSegs = d, e = 0; e < d.length; e++) this.prepareHits(), d[e].hit = this.getCellHit(b, c), this.releaseHits(), j.append(d[e].el);
            return i
        },
        resliceDaySegs: function(b, c) {
            var d = a.map(b, function(a) {
                    return a.event
                }),
                e = c.clone(),
                f = e.clone().add(1, "days"),
                g = {
                    start: e,
                    end: f
                };
            return b = this.eventsToSegs(d, function(a) {
                var b = E(a, g);
                return b ? [b] : []
            }), this.sortEventSegs(b), b
        },
        getMoreLinkText: function(a) {
            var b = this.view.opt("eventLimitText");
            return "function" == typeof b ? b(a) : "+" + a + " " + b
        },
        getCellSegs: function(a, b, c) {
            for (var d, e = this.rowStructs[a].segMatrix, f = c || 0, g = []; f < e.length;) d = e[f][b], d && g.push(d), f++;
            return g
        }
    });
    var nb = Pa.TimeGrid = kb.extend(lb, {
        slotDuration: null,
        snapDuration: null,
        snapsPerSlot: null,
        minTime: null,
        maxTime: null,
        labelFormat: null,
        labelInterval: null,
        colEls: null,
        slatEls: null,
        nowIndicatorEls: null,
        colCoordCache: null,
        slatCoordCache: null,
        constructor: function() {
            kb.apply(this, arguments), this.processOptions()
        },
        renderDates: function() {
            this.el.html(this.renderHtml()), this.colEls = this.el.find(".fc-day"), this.slatEls = this.el.find(".fc-slats tr"), this.colCoordCache = new gb({
                els: this.colEls,
                isHorizontal: !0
            }), this.slatCoordCache = new gb({
                els: this.slatEls,
                isVertical: !0
            }), this.renderContentSkeleton()
        },
        renderHtml: function() {
            return '<div class="fc-bg"><table>' + this.renderBgTrHtml(0) + '</table></div><div class="fc-slats"><table>' + this.renderSlatRowHtml() + "</table></div>"
        },
        renderSlatRowHtml: function() {
            for (var a, c, d, e = this.view, f = this.isRTL, g = "", h = b.duration(+this.minTime); h < this.maxTime;) a = this.start.clone().time(h), c = ba(L(h, this.labelInterval)), d = '<td class="fc-axis fc-time ' + e.widgetContentClass + '" ' + e.axisStyleAttr() + ">" + (c ? "<span>" + Y(a.format(this.labelFormat)) + "</span>" : "") + "</td>", g += '<tr data-time="' + a.format("HH:mm:ss") + '"' + (c ? "" : ' class="fc-minor"') + ">" + (f ? "" : d) + '<td class="' + e.widgetContentClass + '"/>' + (f ? d : "") + "</tr>", h.add(this.slotDuration);
            return g
        },
        processOptions: function() {
            var c, d = this.view,
                e = d.opt("slotDuration"),
                f = d.opt("snapDuration");
            e = b.duration(e), f = f ? b.duration(f) : e, this.slotDuration = e, this.snapDuration = f, this.snapsPerSlot = e / f, this.minResizeDuration = f, this.minTime = b.duration(d.opt("minTime")), this.maxTime = b.duration(d.opt("maxTime")), c = d.opt("slotLabelFormat"), a.isArray(c) && (c = c[c.length - 1]), this.labelFormat = c || d.opt("axisFormat") || d.opt("smallTimeFormat"), c = d.opt("slotLabelInterval"), this.labelInterval = c ? b.duration(c) : this.computeLabelInterval(e)
        },
        computeLabelInterval: function(a) {
            var c, d, e;
            for (c = Db.length - 1; c >= 0; c--)
                if (d = b.duration(Db[c]), e = L(d, a), ba(e) && e > 1) return d;
            return b.duration(a)
        },
        computeEventTimeFormat: function() {
            return this.view.opt("noMeridiemTimeFormat")
        },
        computeDisplayEventEnd: function() {
            return !0
        },
        prepareHits: function() {
            this.colCoordCache.build(), this.slatCoordCache.build()
        },
        releaseHits: function() {
            this.colCoordCache.clear()
        },
        queryHit: function(a, b) {
            var c = this.snapsPerSlot,
                d = this.colCoordCache,
                e = this.slatCoordCache,
                f = d.getHorizontalIndex(a),
                g = e.getVerticalIndex(b);
            if (null != f && null != g) {
                var h = e.getTopOffset(g),
                    i = e.getHeight(g),
                    j = (b - h) / i,
                    k = Math.floor(j * c),
                    l = g * c + k,
                    m = h + k / c * i,
                    n = h + (k + 1) / c * i;
                return {
                    col: f,
                    snap: l,
                    component: this,
                    left: d.getLeftOffset(f),
                    right: d.getRightOffset(f),
                    top: m,
                    bottom: n
                }
            }
        },
        getHitSpan: function(a) {
            var b, c = this.getCellDate(0, a.col),
                d = this.computeSnapTime(a.snap);
            return c.time(d), b = c.clone().add(this.snapDuration), {
                start: c,
                end: b
            }
        },
        getHitEl: function(a) {
            return this.colEls.eq(a.col)
        },
        rangeUpdated: function() {
            this.updateDayTable()
        },
        computeSnapTime: function(a) {
            return b.duration(this.minTime + this.snapDuration * a)
        },
        spanToSegs: function(a) {
            var b, c = this.sliceRangeByTimes(a);
            for (b = 0; b < c.length; b++) this.isRTL ? c[b].col = this.daysPerRow - 1 - c[b].dayIndex : c[b].col = c[b].dayIndex;
            return c
        },
        sliceRangeByTimes: function(a) {
            var b, c, d, e, f = [];
            for (c = 0; c < this.daysPerRow; c++) d = this.dayDates[c].clone(), e = {
                start: d.clone().time(this.minTime),
                end: d.clone().time(this.maxTime)
            }, b = E(a, e), b && (b.dayIndex = c, f.push(b));
            return f
        },
        updateSize: function(a) {
            this.slatCoordCache.build(), a && this.updateSegVerticals([].concat(this.fgSegs || [], this.bgSegs || [], this.businessSegs || []))
        },
        computeDateTop: function(a, c) {
            return this.computeTimeTop(b.duration(a - c.clone().stripTime()))
        },
        computeTimeTop: function(a) {
            var b, c, d = this.slatEls.length,
                e = (a - this.minTime) / this.slotDuration;
            return e = Math.max(0, e), e = Math.min(d, e), b = Math.floor(e), b = Math.min(b, d - 1), c = e - b, this.slatCoordCache.getTopPosition(b) + this.slatCoordCache.getHeight(b) * c
        },
        renderDrag: function(a, b) {
            if (b) {
                this.renderEventLocationHelper(a, b);
                for (var c = 0; c < this.helperSegs.length; c++) this.applyDragOpacity(this.helperSegs[c].el);
                return !0
            }
            this.renderHighlight(this.eventToSpan(a))
        },
        unrenderDrag: function() {
            this.unrenderHelper(), this.unrenderHighlight()
        },
        renderEventResize: function(a, b) {
            this.renderEventLocationHelper(a, b)
        },
        unrenderEventResize: function() {
            this.unrenderHelper()
        },
        renderHelper: function(a, b) {
            this.renderHelperSegs(this.eventToSegs(a), b)
        },
        unrenderHelper: function() {
            this.unrenderHelperSegs()
        },
        renderBusinessHours: function() {
            var a = this.view.calendar.getBusinessHoursEvents(),
                b = this.eventsToSegs(a);
            this.renderBusinessSegs(b)
        },
        unrenderBusinessHours: function() {
            this.unrenderBusinessSegs()
        },
        getNowIndicatorUnit: function() {
            return "minute"
        },
        renderNowIndicator: function(b) {
            var c, d = this.spanToSegs({
                    start: b,
                    end: b
                }),
                e = this.computeDateTop(b, b),
                f = [];
            for (c = 0; c < d.length; c++) f.push(a('<div class="fc-now-indicator fc-now-indicator-line"></div>').css("top", e).appendTo(this.colContainerEls.eq(d[c].col))[0]);
            d.length > 0 && f.push(a('<div class="fc-now-indicator fc-now-indicator-arrow"></div>').css("top", e).appendTo(this.el.find(".fc-content-skeleton"))[0]), this.nowIndicatorEls = a(f)
        },
        unrenderNowIndicator: function() {
            this.nowIndicatorEls && (this.nowIndicatorEls.remove(), this.nowIndicatorEls = null)
        },
        renderSelection: function(a) {
            this.view.opt("selectHelper") ? this.renderEventLocationHelper(a) : this.renderHighlight(a)
        },
        unrenderSelection: function() {
            this.unrenderHelper(), this.unrenderHighlight()
        },
        renderHighlight: function(a) {
            this.renderHighlightSegs(this.spanToSegs(a))
        },
        unrenderHighlight: function() {
            this.unrenderHighlightSegs()
        }
    });
    nb.mixin({
        colContainerEls: null,
        fgContainerEls: null,
        bgContainerEls: null,
        helperContainerEls: null,
        highlightContainerEls: null,
        businessContainerEls: null,
        fgSegs: null,
        bgSegs: null,
        helperSegs: null,
        highlightSegs: null,
        businessSegs: null,
        renderContentSkeleton: function() {
            var b, c, d = "";
            for (b = 0; b < this.colCnt; b++) d += '<td><div class="fc-content-col"><div class="fc-event-container fc-helper-container"></div><div class="fc-event-container"></div><div class="fc-highlight-container"></div><div class="fc-bgevent-container"></div><div class="fc-business-container"></div></div></td>';
            c = a('<div class="fc-content-skeleton"><table><tr>' + d + "</tr></table></div>"), this.colContainerEls = c.find(".fc-content-col"), this.helperContainerEls = c.find(".fc-helper-container"), this.fgContainerEls = c.find(".fc-event-container:not(.fc-helper-container)"), this.bgContainerEls = c.find(".fc-bgevent-container"), this.highlightContainerEls = c.find(".fc-highlight-container"), this.businessContainerEls = c.find(".fc-business-container"), this.bookendCells(c.find("tr")), this.el.append(c)
        },
        renderFgSegs: function(a) {
            return a = this.renderFgSegsIntoContainers(a, this.fgContainerEls), this.fgSegs = a, a
        },
        unrenderFgSegs: function() {
            this.unrenderNamedSegs("fgSegs")
        },
        renderHelperSegs: function(a, b) {
            var c, d, e;
            for (a = this.renderFgSegsIntoContainers(a, this.helperContainerEls), c = 0; c < a.length; c++) d = a[c], b && b.col === d.col && (e = b.el, d.el.css({
                left: e.css("left"),
                right: e.css("right"),
                "margin-left": e.css("margin-left"),
                "margin-right": e.css("margin-right")
            }));
            this.helperSegs = a
        },
        unrenderHelperSegs: function() {
            this.unrenderNamedSegs("helperSegs")
        },
        renderBgSegs: function(a) {
            return a = this.renderFillSegEls("bgEvent", a), this.updateSegVerticals(a), this.attachSegsByCol(this.groupSegsByCol(a), this.bgContainerEls), this.bgSegs = a, a
        },
        unrenderBgSegs: function() {
            this.unrenderNamedSegs("bgSegs")
        },
        renderHighlightSegs: function(a) {
            a = this.renderFillSegEls("highlight", a), this.updateSegVerticals(a), this.attachSegsByCol(this.groupSegsByCol(a), this.highlightContainerEls), this.highlightSegs = a
        },
        unrenderHighlightSegs: function() {
            this.unrenderNamedSegs("highlightSegs")
        },
        renderBusinessSegs: function(a) {
            a = this.renderFillSegEls("businessHours", a), this.updateSegVerticals(a), this.attachSegsByCol(this.groupSegsByCol(a), this.businessContainerEls), this.businessSegs = a
        },
        unrenderBusinessSegs: function() {
            this.unrenderNamedSegs("businessSegs")
        },
        groupSegsByCol: function(a) {
            var b, c = [];
            for (b = 0; b < this.colCnt; b++) c.push([]);
            for (b = 0; b < a.length; b++) c[a[b].col].push(a[b]);
            return c
        },
        attachSegsByCol: function(a, b) {
            var c, d, e;
            for (c = 0; c < this.colCnt; c++)
                for (d = a[c], e = 0; e < d.length; e++) b.eq(c).append(d[e].el)
        },
        unrenderNamedSegs: function(a) {
            var b, c = this[a];
            if (c) {
                for (b = 0; b < c.length; b++) c[b].el.remove();
                this[a] = null
            }
        },
        renderFgSegsIntoContainers: function(a, b) {
            var c, d;
            for (a = this.renderFgSegEls(a), c = this.groupSegsByCol(a), d = 0; d < this.colCnt; d++) this.updateFgSegCoords(c[d]);
            return this.attachSegsByCol(c, b), a
        },
        fgSegHtml: function(a, b) {
            var c, d, e, f = this.view,
                g = a.event,
                h = f.isEventDraggable(g),
                i = !b && a.isStart && f.isEventResizableFromStart(g),
                j = !b && a.isEnd && f.isEventResizableFromEnd(g),
                k = this.getSegClasses(a, h, i || j),
                l = $(this.getEventSkinCss(g));
            return k.unshift("fc-time-grid-event", "fc-v-event"), f.isMultiDayEvent(g) ? (a.isStart || a.isEnd) && (c = this.getEventTimeText(a), d = this.getEventTimeText(a, "LT"), e = this.getEventTimeText(a, null, !1)) : (c = this.getEventTimeText(g), d = this.getEventTimeText(g, "LT"), e = this.getEventTimeText(g, null, !1)), '<a class="' + k.join(" ") + '"' + (g.url ? ' href="' + Y(g.url) + '"' : "") + (l ? ' style="' + l + '"' : "") + '><div class="fc-content">' + (c ? '<div class="fc-time" data-start="' + Y(e) + '" data-full="' + Y(d) + '"><span>' + Y(c) + "</span></div>" : "") + (g.title ? '<div class="fc-title">' + Y(g.title) + "</div>" : "") + '</div><div class="fc-bg"/>' + (j ? '<div class="fc-resizer fc-end-resizer" />' : "") + "</a>"
        },
        updateSegVerticals: function(a) {
            this.computeSegVerticals(a), this.assignSegVerticals(a)
        },
        computeSegVerticals: function(a) {
            var b, c;
            for (b = 0; b < a.length; b++) c = a[b], c.top = this.computeDateTop(c.start, c.start), c.bottom = this.computeDateTop(c.end, c.start)
        },
        assignSegVerticals: function(a) {
            var b, c;
            for (b = 0; b < a.length; b++) c = a[b], c.el.css(this.generateSegVerticalCss(c))
        },
        generateSegVerticalCss: function(a) {
            return {
                top: a.top,
                bottom: -a.bottom
            }
        },
        updateFgSegCoords: function(a) {
            this.computeSegVerticals(a), this.computeFgSegHorizontals(a), this.assignSegVerticals(a), this.assignFgSegHorizontals(a)
        },
        computeFgSegHorizontals: function(a) {
            var b, c, d;
            if (this.sortEventSegs(a), b = Ea(a), Fa(b), c = b[0]) {
                for (d = 0; d < c.length; d++) Ga(c[d]);
                for (d = 0; d < c.length; d++) this.computeFgSegForwardBack(c[d], 0, 0)
            }
        },
        computeFgSegForwardBack: function(a, b, c) {
            var d, e = a.forwardSegs;
            if (void 0 === a.forwardCoord)
                for (e.length ? (this.sortForwardSegs(e), this.computeFgSegForwardBack(e[0], b + 1, c), a.forwardCoord = e[0].backwardCoord) : a.forwardCoord = 1, a.backwardCoord = a.forwardCoord - (a.forwardCoord - c) / (b + 1), d = 0; d < e.length; d++) this.computeFgSegForwardBack(e[d], 0, a.forwardCoord)
        },
        sortForwardSegs: function(a) {
            a.sort(ca(this, "compareForwardSegs"))
        },
        compareForwardSegs: function(a, b) {
            return b.forwardPressure - a.forwardPressure || (a.backwardCoord || 0) - (b.backwardCoord || 0) || this.compareEventSegs(a, b)
        },
        assignFgSegHorizontals: function(a) {
            var b, c;
            for (b = 0; b < a.length; b++) c = a[b], c.el.css(this.generateFgSegHorizontalCss(c)), c.bottom - c.top < 30 && c.el.addClass("fc-short")
        },
        generateFgSegHorizontalCss: function(a) {
            var b, c, d = this.view.opt("slotEventOverlap"),
                e = a.backwardCoord,
                f = a.forwardCoord,
                g = this.generateSegVerticalCss(a);
            return d && (f = Math.min(1, e + 2 * (f - e))), this.isRTL ? (b = 1 - f, c = e) : (b = e, c = 1 - f), g.zIndex = a.level + 1, g.left = 100 * b + "%", g.right = 100 * c + "%", d && a.forwardPressure && (g[this.isRTL ? "marginLeft" : "marginRight"] = 20), g
        }
    });
    var ob = Pa.View = ra.extend({
            type: null,
            name: null,
            title: null,
            calendar: null,
            options: null,
            el: null,
            displaying: null,
            isSkeletonRendered: !1,
            isEventsRendered: !1,
            start: null,
            end: null,
            intervalStart: null,
            intervalEnd: null,
            intervalDuration: null,
            intervalUnit: null,
            isRTL: !1,
            isSelected: !1,
            eventOrderSpecs: null,
            scrollerEl: null,
            scrollTop: null,
            widgetHeaderClass: null,
            widgetContentClass: null,
            highlightStateClass: null,
            nextDayThreshold: null,
            isHiddenDayHash: null,
            documentMousedownProxy: null,
            nowIndicatorTimeoutID: null,
            nowIndicatorIntervalID: null,
            constructor: function(a, c, d, e) {
                this.calendar = a, this.type = this.name = c, this.options = d, this.intervalDuration = e || b.duration(1, "day"), this.nextDayThreshold = b.duration(this.opt("nextDayThreshold")), this.initThemingProps(), this.initHiddenDays(), this.isRTL = this.opt("isRTL"), this.eventOrderSpecs = A(this.opt("eventOrder")), this.documentMousedownProxy = ca(this, "documentMousedown"), this.initialize()
            },
            initialize: function() {},
            opt: function(a) {
                return this.options[a]
            },
            trigger: function(a, b) {
                var c = this.calendar;
                return c.trigger.apply(c, [a, b || this].concat(Array.prototype.slice.call(arguments, 2), [this]))
            },
            setDate: function(a) {
                this.setRange(this.computeRange(a))
            },
            setRange: function(b) {
                a.extend(this, b), this.updateTitle()
            },
            computeRange: function(a) {
                var b, c, d = I(this.intervalDuration),
                    e = a.clone().startOf(d),
                    f = e.clone().add(this.intervalDuration);
                return /year|month|week|day/.test(d) ? (e.stripTime(), f.stripTime()) : (e.hasTime() || (e = this.calendar.time(0)), f.hasTime() || (f = this.calendar.time(0))), b = e.clone(), b = this.skipHiddenDays(b), c = f.clone(), c = this.skipHiddenDays(c, -1, !0), {
                    intervalUnit: d,
                    intervalStart: e,
                    intervalEnd: f,
                    start: b,
                    end: c
                }
            },
            computePrevDate: function(a) {
                return this.massageCurrentDate(a.clone().startOf(this.intervalUnit).subtract(this.intervalDuration), -1)
            },
            computeNextDate: function(a) {
                return this.massageCurrentDate(a.clone().startOf(this.intervalUnit).add(this.intervalDuration))
            },
            massageCurrentDate: function(a, b) {
                return this.intervalDuration.as("days") <= 1 && this.isHiddenDay(a) && (a = this.skipHiddenDays(a, b), a.startOf("day")), a
            },
            updateTitle: function() {
                this.title = this.computeTitle()
            },
            computeTitle: function() {
                return this.formatRange({
                    start: this.calendar.applyTimezone(this.intervalStart),
                    end: this.calendar.applyTimezone(this.intervalEnd)
                }, this.opt("titleFormat") || this.computeTitleFormat(), this.opt("titleRangeSeparator"))
            },
            computeTitleFormat: function() {
                return "year" == this.intervalUnit ? "YYYY" : "month" == this.intervalUnit ? this.opt("monthYearFormat") : this.intervalDuration.as("days") > 1 ? "ll" : "LL"
            },
            formatRange: function(a, b, c) {
                var d = a.end;
                return d.hasTime() || (d = d.clone().subtract(1)), ma(a.start, d, b, c, this.opt("isRTL"))
            },
            setElement: function(a) {
                this.el = a, this.bindGlobalHandlers()
            },
            removeElement: function() {
                this.clear(), this.isSkeletonRendered && (this.unrenderSkeleton(), this.isSkeletonRendered = !1), this.unbindGlobalHandlers(), this.el.remove()
            },
            display: function(b) {
                var c = this,
                    d = null;
                return this.displaying && (d = this.queryScroll()), this.calendar.freezeContentHeight(), this.clear().then(function() {
                    return c.displaying = a.when(c.displayView(b)).then(function() {
                        c.forceScroll(c.computeInitialScroll(d)), c.calendar.unfreezeContentHeight(), c.triggerRender()
                    })
                })
            },
            clear: function() {
                var b = this,
                    c = this.displaying;
                return c ? c.then(function() {
                    return b.displaying = null, b.clearEvents(), b.clearView()
                }) : a.when()
            },
            redisplay: function() {
                if (this.isSkeletonRendered) {
                    var a = this.isEventsRendered;
                    this.clearEvents(), this.clearView(), this.displayView(), a && this.displayEvents(this.calendar.getEventCache())
                }
            },
            displayView: function(a) {
                this.isSkeletonRendered || (this.renderSkeleton(), this.isSkeletonRendered = !0), a && this.setDate(a), this.render && this.render(), this.renderDates(), this.updateSize(), this.renderBusinessHours(), this.opt("nowIndicator") && this.startNowIndicator()
            },
            clearView: function() {
                this.unselect(), this.stopNowIndicator(), this.triggerUnrender(), this.unrenderBusinessHours(), this.unrenderDates(), this.destroy && this.destroy()
            },
            renderSkeleton: function() {},
            unrenderSkeleton: function() {},
            renderDates: function() {},
            unrenderDates: function() {},
            triggerRender: function() {
                this.trigger("viewRender", this, this, this.el)
            },
            triggerUnrender: function() {
                this.trigger("viewDestroy", this, this, this.el)
            },
            bindGlobalHandlers: function() {
                a(document).on("mousedown", this.documentMousedownProxy)
            },
            unbindGlobalHandlers: function() {
                a(document).off("mousedown", this.documentMousedownProxy)
            },
            initThemingProps: function() {
                var a = this.opt("theme") ? "ui" : "fc";
                this.widgetHeaderClass = a + "-widget-header", this.widgetContentClass = a + "-widget-content", this.highlightStateClass = a + "-state-highlight"
            },
            renderBusinessHours: function() {},
            unrenderBusinessHours: function() {},
            startNowIndicator: function() {
                function a() {
                    f.unrenderNowIndicator(), f.renderNowIndicator(c.clone().add(new Date - d))
                }
                var c, d, e, f = this,
                    g = this.getNowIndicatorUnit();
                g && (c = this.calendar.getNow(), d = +new Date, this.renderNowIndicator(c), e = c.clone().startOf(g).add(1, g) - c, this.nowIndicatorTimeoutID = setTimeout(function() {
                    this.nowIndicatorTimeoutID = null, a(), e = +b.duration(1, g), e = Math.max(100, e), this.nowIndicatorIntervalID = setInterval(a, e)
                }, e))
            },
            stopNowIndicator: function() {
                var a = !1;
                this.nowIndicatorTimeoutID && (clearTimeout(this.nowIndicatorTimeoutID), a = !0), this.nowIndicatorIntervalID && (clearTimeout(this.nowIndicatorIntervalID), a = !0), a && this.unrenderNowIndicator()
            },
            getNowIndicatorUnit: function() {},
            renderNowIndicator: function(a) {},
            unrenderNowIndicator: function() {},
            updateSize: function(a) {
                var b;
                a && (b = this.queryScroll()), this.updateHeight(a), this.updateWidth(a), a && this.setScroll(b)
            },
            updateWidth: function(a) {},
            updateHeight: function(a) {
                var b = this.calendar;
                this.setHeight(b.getSuggestedViewHeight(), b.isHeightAuto())
            },
            setHeight: function(a, b) {},
            computeScrollerHeight: function(a) {
                var b, c, d = this.scrollerEl;
                return b = this.el.add(d), b.css({
                    position: "relative",
                    left: -1
                }), c = this.el.outerHeight() - d.height(), b.css({
                    position: "",
                    left: ""
                }), a - c
            },
            computeInitialScroll: function(a) {
                return 0
            },
            queryScroll: function() {
                return this.scrollerEl ? this.scrollerEl.scrollTop() : void 0
            },
            setScroll: function(a) {
                return this.scrollerEl ? this.scrollerEl.scrollTop(a) : void 0
            },
            forceScroll: function(a) {
                var b = this;
                this.setScroll(a), setTimeout(function() {
                    b.setScroll(a)
                }, 0)
            },
            displayEvents: function(a) {
                var b = this.queryScroll();
                this.clearEvents(), this.renderEvents(a), this.isEventsRendered = !0, this.setScroll(b), this.triggerEventRender()
            },
            clearEvents: function() {
                var a;
                this.isEventsRendered && (a = this.queryScroll(), this.triggerEventUnrender(), this.destroyEvents && this.destroyEvents(), this.unrenderEvents(), this.setScroll(a), this.isEventsRendered = !1)
            },
            renderEvents: function(a) {},
            unrenderEvents: function() {},
            triggerEventRender: function() {
                this.renderedEventSegEach(function(a) {
                    this.trigger("eventAfterRender", a.event, a.event, a.el)
                }), this.trigger("eventAfterAllRender")
            },
            triggerEventUnrender: function() {
                this.renderedEventSegEach(function(a) {
                    this.trigger("eventDestroy", a.event, a.event, a.el)
                })
            },
            resolveEventEl: function(b, c) {
                var d = this.trigger("eventRender", b, b, c);
                return d === !1 ? c = null : d && d !== !0 && (c = a(d)), c
            },
            showEvent: function(a) {
                this.renderedEventSegEach(function(a) {
                    a.el.css("visibility", "")
                }, a)
            },
            hideEvent: function(a) {
                this.renderedEventSegEach(function(a) {
                    a.el.css("visibility", "hidden")
                }, a)
            },
            renderedEventSegEach: function(a, b) {
                var c, d = this.getEventSegs();
                for (c = 0; c < d.length; c++) b && d[c].event._id !== b._id || d[c].el && a.call(this, d[c])
            },
            getEventSegs: function() {
                return []
            },
            isEventDraggable: function(a) {
                var b = a.source || {};
                return X(a.startEditable, b.startEditable, this.opt("eventStartEditable"), a.editable, b.editable, this.opt("editable"))
            },
            reportEventDrop: function(a, b, c, d, e) {
                var f = this.calendar,
                    g = f.mutateEvent(a, b, c),
                    h = function() {
                        g.undo(), f.reportEventChange()
                    };
                this.triggerEventDrop(a, g.dateDelta, h, d, e), f.reportEventChange()
            },
            triggerEventDrop: function(a, b, c, d, e) {
                this.trigger("eventDrop", d[0], a, b, c, e, {})
            },
            reportExternalDrop: function(b, c, d, e, f) {
                var g, h, i = b.eventProps;
                i && (g = a.extend({}, i, c), h = this.calendar.renderEvent(g, b.stick)[0]), this.triggerExternalDrop(h, c, d, e, f)
            },
            triggerExternalDrop: function(a, b, c, d, e) {
                this.trigger("drop", c[0], b.start, d, e), a && this.trigger("eventReceive", null, a)
            },
            renderDrag: function(a, b) {},
            unrenderDrag: function() {},
            isEventResizableFromStart: function(a) {
                return this.opt("eventResizableFromStart") && this.isEventResizable(a)
            },
            isEventResizableFromEnd: function(a) {
                return this.isEventResizable(a)
            },
            isEventResizable: function(a) {
                var b = a.source || {};
                return X(a.durationEditable, b.durationEditable, this.opt("eventDurationEditable"), a.editable, b.editable, this.opt("editable"))
            },
            reportEventResize: function(a, b, c, d, e) {
                var f = this.calendar,
                    g = f.mutateEvent(a, b, c),
                    h = function() {
                        g.undo(), f.reportEventChange()
                    };
                this.triggerEventResize(a, g.durationDelta, h, d, e), f.reportEventChange()
            },
            triggerEventResize: function(a, b, c, d, e) {
                this.trigger("eventResize", d[0], a, b, c, e, {})
            },
            select: function(a, b) {
                this.unselect(b), this.renderSelection(a), this.reportSelection(a, b)
            },
            renderSelection: function(a) {},
            reportSelection: function(a, b) {
                this.isSelected = !0, this.triggerSelect(a, b)
            },
            triggerSelect: function(a, b) {
                this.trigger("select", null, this.calendar.applyTimezone(a.start), this.calendar.applyTimezone(a.end), b)
            },
            unselect: function(a) {
                this.isSelected && (this.isSelected = !1, this.destroySelection && this.destroySelection(), this.unrenderSelection(), this.trigger("unselect", null, a))
            },
            unrenderSelection: function() {},
            documentMousedown: function(b) {
                var c;
                this.isSelected && this.opt("unselectAuto") && v(b) && (c = this.opt("unselectCancel"), c && a(b.target).closest(c).length || this.unselect(b))
            },
            triggerDayClick: function(a, b, c) {
                this.trigger("dayClick", b, this.calendar.applyTimezone(a.start), c)
            },
            initHiddenDays: function() {
                var b, c = this.opt("hiddenDays") || [],
                    d = [],
                    e = 0;
                for (this.opt("weekends") === !1 && c.push(0, 6), b = 0; 7 > b; b++)(d[b] = -1 !== a.inArray(b, c)) || e++;
                if (!e) throw "invalid hiddenDays";
                this.isHiddenDayHash = d
            },
            isHiddenDay: function(a) {
                return b.isMoment(a) && (a = a.day()), this.isHiddenDayHash[a]
            },
            skipHiddenDays: function(a, b, c) {
                var d = a.clone();
                for (b = b || 1; this.isHiddenDayHash[(d.day() + (c ? b : 0) + 7) % 7];) d.add(b, "days");
                return d
            },
            computeDayRange: function(a) {
                var b, c = a.start.clone().stripTime(),
                    d = a.end,
                    e = null;
                return d && (e = d.clone().stripTime(), b = +d.time(), b && b >= this.nextDayThreshold && e.add(1, "days")), (!d || c >= e) && (e = c.clone().add(1, "days")), {
                    start: c,
                    end: e
                }
            },
            isMultiDayEvent: function(a) {
                var b = this.computeDayRange(a);
                return b.end.diff(b.start, "days") > 1
            }
        }),
        pb = Pa.Calendar = ra.extend({
            dirDefaults: null,
            langDefaults: null,
            overrides: null,
            options: null,
            viewSpecCache: null,
            view: null,
            header: null,
            loadingLevel: 0,
            constructor: Ja,
            initialize: function() {},
            initOptions: function(a) {
                var b, e, f, g;
                a = d(a), b = a.lang, e = qb[b], e || (b = pb.defaults.lang, e = qb[b] || {}), f = X(a.isRTL, e.isRTL, pb.defaults.isRTL), g = f ? pb.rtlDefaults : {}, this.dirDefaults = g, this.langDefaults = e, this.overrides = a, this.options = c([pb.defaults, g, e, a]), Ka(this.options), this.viewSpecCache = {}
            },
            getViewSpec: function(a) {
                var b = this.viewSpecCache;
                return b[a] || (b[a] = this.buildViewSpec(a))
            },
            getUnitViewSpec: function(b) {
                var c, d, e;
                if (-1 != a.inArray(b, Ua))
                    for (c = this.header.getViewsWithButtons(), a.each(Pa.views, function(a) {
                            c.push(a)
                        }), d = 0; d < c.length; d++)
                        if (e = this.getViewSpec(c[d]), e && e.singleUnit == b) return e
            },
            buildViewSpec: function(a) {
                for (var d, e, f, g, h = this.overrides.views || {}, i = [], j = [], k = [], l = a; l;) d = Qa[l], e = h[l], l = null, "function" == typeof d && (d = {
                    "class": d
                }), d && (i.unshift(d), j.unshift(d.defaults || {}), f = f || d.duration, l = l || d.type), e && (k.unshift(e), f = f || e.duration, l = l || e.type);
                return d = Q(i), d.type = a, d["class"] ? (f && (f = b.duration(f), f.valueOf() && (d.duration = f, g = I(f), 1 === f.as(g) && (d.singleUnit = g, k.unshift(h[g] || {})))), d.defaults = c(j), d.overrides = c(k), this.buildViewSpecOptions(d), this.buildViewSpecButtonText(d, a), d) : !1
            },
            buildViewSpecOptions: function(a) {
                a.options = c([pb.defaults, a.defaults, this.dirDefaults, this.langDefaults, this.overrides, a.overrides]), Ka(a.options)
            },
            buildViewSpecButtonText: function(a, b) {
                function c(c) {
                    var d = c.buttonText || {};
                    return d[b] || (a.singleUnit ? d[a.singleUnit] : null)
                }
                a.buttonTextOverride = c(this.overrides) || a.overrides.buttonText, a.buttonTextDefault = c(this.langDefaults) || c(this.dirDefaults) || a.defaults.buttonText || c(pb.defaults) || (a.duration ? this.humanizeDuration(a.duration) : null) || b
            },
            instantiateView: function(a) {
                var b = this.getViewSpec(a);
                return new b["class"](this, a, b.options, b.duration)
            },
            isValidViewType: function(a) {
                return Boolean(this.getViewSpec(a))
            },
            pushLoading: function() {
                this.loadingLevel++ || this.trigger("loading", null, !0, this.view)
            },
            popLoading: function() {
                --this.loadingLevel || this.trigger("loading", null, !1, this.view)
            },
            buildSelectSpan: function(a, b) {
                var c, d = this.moment(a).stripZone();
                return c = b ? this.moment(b).stripZone() : d.hasTime() ? d.clone().add(this.defaultTimedEventDuration) : d.clone().add(this.defaultAllDayEventDuration), {
                    start: d,
                    end: c
                }
            }
        });
    pb.mixin(eb), pb.defaults = {
        titleRangeSeparator: " — ",
        monthYearFormat: "MMMM YYYY",
        defaultTimedEventDuration: "02:00:00",
        defaultAllDayEventDuration: {
            days: 1
        },
        forceEventDuration: !1,
        nextDayThreshold: "09:00:00",
        defaultView: "month",
        aspectRatio: 1.35,
        header: {
            left: "title",
            center: "",
            right: "today prev,next"
        },
        weekends: !0,
        weekNumbers: !1,
        weekNumberTitle: "W",
        weekNumberCalculation: "local",
        scrollTime: "06:00:00",
        lazyFetching: !0,
        startParam: "start",
        endParam: "end",
        timezoneParam: "timezone",
        timezone: !1,
        isRTL: !1,
        buttonText: {
            prev: "prev",
            next: "next",
            prevYear: "prev year",
            nextYear: "next year",
            year: "year",
            today: "today",
            month: "month",
            week: "week",
            day: "day"
        },
        buttonIcons: {
            prev: "left-single-arrow",
            next: "right-single-arrow",
            prevYear: "left-double-arrow",
            nextYear: "right-double-arrow"
        },
        theme: !1,
        themeButtonIcons: {
            prev: "circle-triangle-w",
            next: "circle-triangle-e",
            prevYear: "seek-prev",
            nextYear: "seek-next"
        },
        dragOpacity: .75,
        dragRevertDuration: 500,
        dragScroll: !0,
        unselectAuto: !0,
        dropAccept: "*",
        eventOrder: "title",
        eventLimit: !1,
        eventLimitText: "more",
        eventLimitClick: "popover",
        dayPopoverFormat: "LL",
        handleWindowResize: !0,
        windowResizeDelay: 200
    }, pb.englishDefaults = {
        dayPopoverFormat: "dddd, MMMM D"
    }, pb.rtlDefaults = {
        header: {
            left: "next,prev today",
            center: "",
            right: "title"
        },
        buttonIcons: {
            prev: "right-single-arrow",
            next: "left-single-arrow",
            prevYear: "right-double-arrow",
            nextYear: "left-double-arrow"
        },
        themeButtonIcons: {
            prev: "circle-triangle-e",
            next: "circle-triangle-w",
            nextYear: "seek-prev",
            prevYear: "seek-next"
        }
    };
    var qb = Pa.langs = {};
    Pa.datepickerLang = function(b, c, d) {
        var e = qb[b] || (qb[b] = {});
        e.isRTL = d.isRTL, e.weekNumberTitle = d.weekHeader, a.each(rb, function(a, b) {
            e[a] = b(d)
        }), a.datepicker && (a.datepicker.regional[c] = a.datepicker.regional[b] = d, a.datepicker.regional.en = a.datepicker.regional[""], a.datepicker.setDefaults(d))
    }, Pa.lang = function(b, d) {
        var e, f;
        e = qb[b] || (qb[b] = {}), d && (e = qb[b] = c([e, d])), f = La(b), a.each(sb, function(a, b) {
            null == e[a] && (e[a] = b(f, e))
        }), pb.defaults.lang = b
    };
    var rb = {
            buttonText: function(a) {
                return {
                    prev: Z(a.prevText),
                    next: Z(a.nextText),
                    today: Z(a.currentText)
                }
            },
            monthYearFormat: function(a) {
                return a.showMonthAfterYear ? "YYYY[" + a.yearSuffix + "] MMMM" : "MMMM YYYY[" + a.yearSuffix + "]"
            }
        },
        sb = {
            dayOfMonthFormat: function(a, b) {
                var c = a.longDateFormat("l");
                return c = c.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, ""), b.isRTL ? c += " ddd" : c = "ddd " + c, c
            },
            mediumTimeFormat: function(a) {
                return a.longDateFormat("LT").replace(/\s*a$/i, "a")
            },
            smallTimeFormat: function(a) {
                return a.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "a")
            },
            extraSmallTimeFormat: function(a) {
                return a.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "t")
            },
            hourFormat: function(a) {
                return a.longDateFormat("LT").replace(":mm", "").replace(/(\Wmm)$/, "").replace(/\s*a$/i, "a")
            },
            noMeridiemTimeFormat: function(a) {
                return a.longDateFormat("LT").replace(/\s*a$/i, "")
            }
        },
        tb = {
            smallDayDateFormat: function(a) {
                return a.isRTL ? "D dd" : "dd D";
            },
            weekFormat: function(a) {
                return a.isRTL ? "w[ " + a.weekNumberTitle + "]" : "[" + a.weekNumberTitle + " ]w"
            },
            smallWeekFormat: function(a) {
                return a.isRTL ? "w[" + a.weekNumberTitle + "]" : "[" + a.weekNumberTitle + "]w"
            }
        };
    Pa.lang("en", pb.englishDefaults), Pa.sourceNormalizers = [], Pa.sourceFetchers = [];
    var ub = {
            dataType: "json",
            cache: !1
        },
        vb = 1;
    pb.prototype.getPeerEvents = function(a, b) {
        var c, d, e = this.getEventCache(),
            f = [];
        for (c = 0; c < e.length; c++) d = e[c], b && b._id === d._id || f.push(d);
        return f
    };
    var wb = Pa.BasicView = ob.extend({
            dayGridClass: mb,
            dayGrid: null,
            dayNumbersVisible: !1,
            weekNumbersVisible: !1,
            weekNumberWidth: null,
            headContainerEl: null,
            headRowEl: null,
            initialize: function() {
                this.dayGrid = this.instantiateDayGrid()
            },
            instantiateDayGrid: function() {
                var a = this.dayGridClass.extend(xb);
                return new a(this)
            },
            setRange: function(a) {
                ob.prototype.setRange.call(this, a), this.dayGrid.breakOnWeeks = /year|month|week/.test(this.intervalUnit), this.dayGrid.setRange(a)
            },
            computeRange: function(a) {
                var b = ob.prototype.computeRange.call(this, a);
                return /year|month/.test(b.intervalUnit) && (b.start.startOf("week"), b.start = this.skipHiddenDays(b.start), b.end.weekday() && (b.end.add(1, "week").startOf("week"), b.end = this.skipHiddenDays(b.end, -1, !0))), b
            },
            renderDates: function() {
                this.dayNumbersVisible = this.dayGrid.rowCnt > 1, this.weekNumbersVisible = this.opt("weekNumbers"), this.dayGrid.numbersVisible = this.dayNumbersVisible || this.weekNumbersVisible, this.el.addClass("fc-basic-view").html(this.renderSkeletonHtml()), this.renderHead(), this.scrollerEl = this.el.find(".fc-day-grid-container"), this.dayGrid.setElement(this.el.find(".fc-day-grid")), this.dayGrid.renderDates(this.hasRigidRows())
            },
            renderHead: function() {
                this.headContainerEl = this.el.find(".fc-head-container").html(this.dayGrid.renderHeadHtml()), this.headRowEl = this.headContainerEl.find(".fc-row")
            },
            unrenderDates: function() {
                this.dayGrid.unrenderDates(), this.dayGrid.removeElement()
            },
            renderBusinessHours: function() {
                this.dayGrid.renderBusinessHours()
            },
            renderSkeletonHtml: function() {
                return '<table><thead class="fc-head"><tr><td class="fc-head-container ' + this.widgetHeaderClass + '"></td></tr></thead><tbody class="fc-body"><tr><td class="' + this.widgetContentClass + '"><div class="fc-day-grid-container"><div class="fc-day-grid"/></div></td></tr></tbody></table>'
            },
            weekNumberStyleAttr: function() {
                return null !== this.weekNumberWidth ? 'style="width:' + this.weekNumberWidth + 'px"' : ""
            },
            hasRigidRows: function() {
                var a = this.opt("eventLimit");
                return a && "number" != typeof a
            },
            updateWidth: function() {
                this.weekNumbersVisible && (this.weekNumberWidth = k(this.el.find(".fc-week-number")))
            },
            setHeight: function(a, b) {
                var c, d = this.opt("eventLimit");
                m(this.scrollerEl), f(this.headRowEl), this.dayGrid.removeSegPopover(), d && "number" == typeof d && this.dayGrid.limitRows(d), c = this.computeScrollerHeight(a), this.setGridHeight(c, b), d && "number" != typeof d && this.dayGrid.limitRows(d), !b && l(this.scrollerEl, c) && (e(this.headRowEl, r(this.scrollerEl)), c = this.computeScrollerHeight(a), this.scrollerEl.height(c))
            },
            setGridHeight: function(a, b) {
                b ? j(this.dayGrid.rowEls) : i(this.dayGrid.rowEls, a, !0)
            },
            prepareHits: function() {
                this.dayGrid.prepareHits()
            },
            releaseHits: function() {
                this.dayGrid.releaseHits()
            },
            queryHit: function(a, b) {
                return this.dayGrid.queryHit(a, b)
            },
            getHitSpan: function(a) {
                return this.dayGrid.getHitSpan(a)
            },
            getHitEl: function(a) {
                return this.dayGrid.getHitEl(a)
            },
            renderEvents: function(a) {
                this.dayGrid.renderEvents(a), this.updateHeight()
            },
            getEventSegs: function() {
                return this.dayGrid.getEventSegs()
            },
            unrenderEvents: function() {
                this.dayGrid.unrenderEvents()
            },
            renderDrag: function(a, b) {
                return this.dayGrid.renderDrag(a, b)
            },
            unrenderDrag: function() {
                this.dayGrid.unrenderDrag()
            },
            renderSelection: function(a) {
                this.dayGrid.renderSelection(a)
            },
            unrenderSelection: function() {
                this.dayGrid.unrenderSelection()
            }
        }),
        xb = {
            renderHeadIntroHtml: function() {
                var a = this.view;
                return a.weekNumbersVisible ? '<th class="fc-week-number ' + a.widgetHeaderClass + '" ' + a.weekNumberStyleAttr() + "><span>" + Y(a.opt("weekNumberTitle")) + "</span></th>" : ""
            },
            renderNumberIntroHtml: function(a) {
                var b = this.view;
                return b.weekNumbersVisible ? '<td class="fc-week-number" ' + b.weekNumberStyleAttr() + "><span>" + this.getCellDate(a, 0).format("w") + "</span></td>" : ""
            },
            renderBgIntroHtml: function() {
                var a = this.view;
                return a.weekNumbersVisible ? '<td class="fc-week-number ' + a.widgetContentClass + '" ' + a.weekNumberStyleAttr() + "></td>" : ""
            },
            renderIntroHtml: function() {
                var a = this.view;
                return a.weekNumbersVisible ? '<td class="fc-week-number" ' + a.weekNumberStyleAttr() + "></td>" : ""
            }
        },
        yb = Pa.MonthView = wb.extend({
            computeRange: function(a) {
                var b, c = wb.prototype.computeRange.call(this, a);
                return this.isFixedWeeks() && (b = Math.ceil(c.end.diff(c.start, "weeks", !0)), c.end.add(6 - b, "weeks")), c
            },
            setGridHeight: function(a, b) {
                b = b || "variable" === this.opt("weekMode"), b && (a *= this.rowCnt / 6), i(this.dayGrid.rowEls, a, !b)
            },
            isFixedWeeks: function() {
                var a = this.opt("weekMode");
                return a ? "fixed" === a : this.opt("fixedWeekCount")
            }
        });
    Qa.basic = {
        "class": wb
    }, Qa.basicDay = {
        type: "basic",
        duration: {
            days: 1
        }
    }, Qa.basicWeek = {
        type: "basic",
        duration: {
            weeks: 1
        }
    }, Qa.month = {
        "class": yb,
        duration: {
            months: 1
        },
        defaults: {
            fixedWeekCount: !0
        }
    };
    var zb = Pa.AgendaView = ob.extend({
            timeGridClass: nb,
            timeGrid: null,
            dayGridClass: mb,
            dayGrid: null,
            axisWidth: null,
            headContainerEl: null,
            noScrollRowEls: null,
            bottomRuleEl: null,
            bottomRuleHeight: null,
            initialize: function() {
                this.timeGrid = this.instantiateTimeGrid(), this.opt("allDaySlot") && (this.dayGrid = this.instantiateDayGrid())
            },
            instantiateTimeGrid: function() {
                var a = this.timeGridClass.extend(Ab);
                return new a(this)
            },
            instantiateDayGrid: function() {
                var a = this.dayGridClass.extend(Bb);
                return new a(this)
            },
            setRange: function(a) {
                ob.prototype.setRange.call(this, a), this.timeGrid.setRange(a), this.dayGrid && this.dayGrid.setRange(a)
            },
            renderDates: function() {
                this.el.addClass("fc-agenda-view").html(this.renderSkeletonHtml()), this.renderHead(), this.scrollerEl = this.el.find(".fc-time-grid-container"), this.timeGrid.setElement(this.el.find(".fc-time-grid")), this.timeGrid.renderDates(), this.bottomRuleEl = a('<hr class="fc-divider ' + this.widgetHeaderClass + '"/>').appendTo(this.timeGrid.el), this.dayGrid && (this.dayGrid.setElement(this.el.find(".fc-day-grid")), this.dayGrid.renderDates(), this.dayGrid.bottomCoordPadding = this.dayGrid.el.next("hr").outerHeight()), this.noScrollRowEls = this.el.find(".fc-row:not(.fc-scroller *)")
            },
            renderHead: function() {
                this.headContainerEl = this.el.find(".fc-head-container").html(this.timeGrid.renderHeadHtml())
            },
            unrenderDates: function() {
                this.timeGrid.unrenderDates(), this.timeGrid.removeElement(), this.dayGrid && (this.dayGrid.unrenderDates(), this.dayGrid.removeElement())
            },
            renderSkeletonHtml: function() {
                return '<table><thead class="fc-head"><tr><td class="fc-head-container ' + this.widgetHeaderClass + '"></td></tr></thead><tbody class="fc-body"><tr><td class="' + this.widgetContentClass + '">' + (this.dayGrid ? '<div class="fc-day-grid"/><hr class="fc-divider ' + this.widgetHeaderClass + '"/>' : "") + '<div class="fc-time-grid-container"><div class="fc-time-grid"/></div></td></tr></tbody></table>'
            },
            axisStyleAttr: function() {
                return null !== this.axisWidth ? 'style="width:' + this.axisWidth + 'px"' : ""
            },
            renderBusinessHours: function() {
                this.timeGrid.renderBusinessHours(), this.dayGrid && this.dayGrid.renderBusinessHours()
            },
            unrenderBusinessHours: function() {
                this.timeGrid.unrenderBusinessHours(), this.dayGrid && this.dayGrid.unrenderBusinessHours()
            },
            getNowIndicatorUnit: function() {
                return this.timeGrid.getNowIndicatorUnit()
            },
            renderNowIndicator: function(a) {
                this.timeGrid.renderNowIndicator(a)
            },
            unrenderNowIndicator: function() {
                this.timeGrid.unrenderNowIndicator()
            },
            updateSize: function(a) {
                this.timeGrid.updateSize(a), ob.prototype.updateSize.call(this, a)
            },
            updateWidth: function() {
                this.axisWidth = k(this.el.find(".fc-axis"))
            },
            setHeight: function(a, b) {
                var c, d;
                null === this.bottomRuleHeight && (this.bottomRuleHeight = this.bottomRuleEl.outerHeight()), this.bottomRuleEl.hide(), this.scrollerEl.css("overflow", ""), m(this.scrollerEl), f(this.noScrollRowEls), this.dayGrid && (this.dayGrid.removeSegPopover(), c = this.opt("eventLimit"), c && "number" != typeof c && (c = Cb), c && this.dayGrid.limitRows(c)), b || (d = this.computeScrollerHeight(a), l(this.scrollerEl, d) ? (e(this.noScrollRowEls, r(this.scrollerEl)), d = this.computeScrollerHeight(a), this.scrollerEl.height(d)) : (this.scrollerEl.height(d).css("overflow", "hidden"), this.bottomRuleEl.show()))
            },
            computeInitialScroll: function() {
                var a = b.duration(this.opt("scrollTime")),
                    c = this.timeGrid.computeTimeTop(a);
                return c = Math.ceil(c), c && c++, c
            },
            prepareHits: function() {
                this.timeGrid.prepareHits(), this.dayGrid && this.dayGrid.prepareHits()
            },
            releaseHits: function() {
                this.timeGrid.releaseHits(), this.dayGrid && this.dayGrid.releaseHits()
            },
            queryHit: function(a, b) {
                var c = this.timeGrid.queryHit(a, b);
                return !c && this.dayGrid && (c = this.dayGrid.queryHit(a, b)), c
            },
            getHitSpan: function(a) {
                return a.component.getHitSpan(a)
            },
            getHitEl: function(a) {
                return a.component.getHitEl(a)
            },
            renderEvents: function(a) {
                var b, c, d = [],
                    e = [],
                    f = [];
                for (c = 0; c < a.length; c++) a[c].allDay ? d.push(a[c]) : e.push(a[c]);
                b = this.timeGrid.renderEvents(e), this.dayGrid && (f = this.dayGrid.renderEvents(d)), this.updateHeight()
            },
            getEventSegs: function() {
                return this.timeGrid.getEventSegs().concat(this.dayGrid ? this.dayGrid.getEventSegs() : [])
            },
            unrenderEvents: function() {
                this.timeGrid.unrenderEvents(), this.dayGrid && this.dayGrid.unrenderEvents()
            },
            renderDrag: function(a, b) {
                return a.start.hasTime() ? this.timeGrid.renderDrag(a, b) : this.dayGrid ? this.dayGrid.renderDrag(a, b) : void 0
            },
            unrenderDrag: function() {
                this.timeGrid.unrenderDrag(), this.dayGrid && this.dayGrid.unrenderDrag()
            },
            renderSelection: function(a) {
                a.start.hasTime() || a.end.hasTime() ? this.timeGrid.renderSelection(a) : this.dayGrid && this.dayGrid.renderSelection(a)
            },
            unrenderSelection: function() {
                this.timeGrid.unrenderSelection(), this.dayGrid && this.dayGrid.unrenderSelection()
            }
        }),
        Ab = {
            renderHeadIntroHtml: function() {
                var a, b = this.view;
                return b.opt("weekNumbers") ? (a = this.start.format(b.opt("smallWeekFormat")), '<th class="fc-axis fc-week-number ' + b.widgetHeaderClass + '" ' + b.axisStyleAttr() + "><span>" + Y(a) + "</span></th>") : '<th class="fc-axis ' + b.widgetHeaderClass + '" ' + b.axisStyleAttr() + "></th>"
            },
            renderBgIntroHtml: function() {
                var a = this.view;
                return '<td class="fc-axis ' + a.widgetContentClass + '" ' + a.axisStyleAttr() + "></td>"
            },
            renderIntroHtml: function() {
                var a = this.view;
                return '<td class="fc-axis" ' + a.axisStyleAttr() + "></td>"
            }
        },
        Bb = {
            renderBgIntroHtml: function() {
                var a = this.view;
                return '<td class="fc-axis ' + a.widgetContentClass + '" ' + a.axisStyleAttr() + "><span>" + (a.opt("allDayHtml") || Y(a.opt("allDayText"))) + "</span></td>"
            },
            renderIntroHtml: function() {
                var a = this.view;
                return '<td class="fc-axis" ' + a.axisStyleAttr() + "></td>"
            }
        },
        Cb = 5,
        Db = [{
            hours: 1
        }, {
            minutes: 30
        }, {
            minutes: 15
        }, {
            seconds: 30
        }, {
            seconds: 15
        }];
    return Qa.agenda = {
        "class": zb,
        defaults: {
            allDaySlot: !0,
            allDayText: "all-day",
            slotDuration: "00:30:00",
            minTime: "00:00:00",
            maxTime: "24:00:00",
            slotEventOverlap: !0
        }
    }, Qa.agendaDay = {
        type: "agenda",
        duration: {
            days: 1
        }
    }, Qa.agendaWeek = {
        type: "agenda",
        duration: {
            weeks: 1
        }
    }, Pa
});
/*
 * Swiper 2.7.6
 * Mobile touch slider and framework with hardware accelerated transitions
 *
 * http://www.idangero.us/sliders/swiper/
 *
 * Copyright 2010-2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under GPL & MIT
 *
 * Released on: February 11, 2015
*/
var Swiper = function (selector, params) {
    'use strict';

    /*=========================
      A little bit dirty but required part for IE8 and old FF support
      ===========================*/
    if (!document.body.outerHTML && document.body.__defineGetter__) {
        if (HTMLElement) {
            var element = HTMLElement.prototype;
            if (element.__defineGetter__) {
                element.__defineGetter__('outerHTML', function () { return new XMLSerializer().serializeToString(this); });
            }
        }
    }

    if (!window.getComputedStyle) {
        window.getComputedStyle = function (el, pseudo) {
            this.el = el;
            this.getPropertyValue = function (prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop === 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            };
            return this;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        };
    }
    if (!document.querySelectorAll) {
        if (!window.jQuery) return;
    }
    function $$(selector, context) {
        if (document.querySelectorAll)
            return (context || document).querySelectorAll(selector);
        else
            return jQuery(selector, context);
    }

    /*=========================
      Check for correct selector
      ===========================*/
    if (typeof selector === 'undefined') return;

    if (!(selector.nodeType)) {
        if ($$(selector).length === 0) return;
    }

     /*=========================
      _this
      ===========================*/
    var _this = this;

     /*=========================
      Default Flags and vars
      ===========================*/
    _this.touches = {
        start: 0,
        startX: 0,
        startY: 0,
        current: 0,
        currentX: 0,
        currentY: 0,
        diff: 0,
        abs: 0
    };
    _this.positions = {
        start: 0,
        abs: 0,
        diff: 0,
        current: 0
    };
    _this.times = {
        start: 0,
        end: 0
    };

    _this.id = (new Date()).getTime();
    _this.container = (selector.nodeType) ? selector : $$(selector)[0];
    _this.isTouched = false;
    _this.isMoved = false;
    _this.activeIndex = 0;
    _this.centerIndex = 0;
    _this.activeLoaderIndex = 0;
    _this.activeLoopIndex = 0;
    _this.previousIndex = null;
    _this.velocity = 0;
    _this.snapGrid = [];
    _this.slidesGrid = [];
    _this.imagesToLoad = [];
    _this.imagesLoaded = 0;
    _this.wrapperLeft = 0;
    _this.wrapperRight = 0;
    _this.wrapperTop = 0;
    _this.wrapperBottom = 0;
    _this.isAndroid = navigator.userAgent.toLowerCase().indexOf('android') >= 0;
    var wrapper, slideSize, wrapperSize, direction, isScrolling, containerSize;

    /*=========================
      Default Parameters
      ===========================*/
    var defaults = {
        eventTarget: 'wrapper', // or 'container'
        mode : 'horizontal', // or 'vertical'
        touchRatio : 1,
        speed : 300,
        freeMode : false,
        freeModeFluid : false,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        slidesPerView : 1,
        slidesPerGroup : 1,
        slidesPerViewFit: true, //Fit to slide when spv "auto" and slides larger than container
        simulateTouch : true,
        followFinger : true,
        shortSwipes : true,
        longSwipesRatio: 0.5,
        moveStartThreshold: false,
        onlyExternal : false,
        createPagination : true,
        pagination : false,
        paginationElement: 'span',
        paginationClickable: false,
        paginationAsRange: true,
        resistance : true, // or false or 100%
        scrollContainer : false,
        preventLinks : true,
        preventLinksPropagation: false,
        noSwiping : false, // or class
        noSwipingClass : 'swiper-no-swiping', //:)
        initialSlide: 0,
        keyboardControl: false,
        mousewheelControl : false,
        mousewheelControlForceToAxis : false,
        useCSS3Transforms : true,
        // Autoplay
        autoplay: false,
        autoplayDisableOnInteraction: true,
        autoplayStopOnLast: false,
        //Loop mode
        loop: false,
        loopAdditionalSlides: 0,
        // Round length values
        roundLengths: false,
        //Auto Height
        calculateHeight: false,
        //Apply CSS for width and/or height
        cssWidthAndHeight: false, // or true or 'width' or 'height'
        //Images Preloader
        updateOnImagesReady : true,
        //Form elements
        releaseFormElements : true,
        //Watch for active slide, useful when use effects on different slide states
        watchActiveIndex: false,
        //Slides Visibility Fit
        visibilityFullFit : false,
        //Slides Offset
        offsetPxBefore : 0,
        offsetPxAfter : 0,
        offsetSlidesBefore : 0,
        offsetSlidesAfter : 0,
        centeredSlides: false,
        //Queue callbacks
        queueStartCallbacks : false,
        queueEndCallbacks : false,
        //Auto Resize
        autoResize : true,
        resizeReInit : false,
        //DOMAnimation
        DOMAnimation : true,
        //Slides Loader
        loader: {
            slides: [], //array with slides
            slidesHTMLType: 'inner', // or 'outer'
            surroundGroups: 1, //keep preloaded slides groups around view
            logic: 'reload', //or 'change'
            loadAllSlides: false
        },
        // One way swipes
        swipeToPrev: true,
        swipeToNext: true,
        //Namespace
        slideElement: 'div',
        slideClass: 'swiper-slide',
        slideActiveClass: 'swiper-slide-active',
        slideVisibleClass: 'swiper-slide-visible',
        slideDuplicateClass: 'swiper-slide-duplicate',
        wrapperClass: 'swiper-wrapper',
        paginationElementClass: 'swiper-pagination-switch',
        paginationActiveClass: 'swiper-active-switch',
        paginationVisibleClass: 'swiper-visible-switch'
    };
    params = params || {};
    for (var prop in defaults) {
        if (prop in params && typeof params[prop] === 'object') {
            for (var subProp in defaults[prop]) {
                if (! (subProp in params[prop])) {
                    params[prop][subProp] = defaults[prop][subProp];
                }
            }
        }
        else if (! (prop in params)) {
            params[prop] = defaults[prop];
        }
    }
    _this.params = params;
    if (params.scrollContainer) {
        params.freeMode = true;
        params.freeModeFluid = true;
    }
    if (params.loop) {
        params.resistance = '100%';
    }
    var isH = params.mode === 'horizontal';

    /*=========================
      Define Touch Events
      ===========================*/
    var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
    if (_this.browser.ie10) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
    if (_this.browser.ie11) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];

    _this.touchEvents = {
        touchStart : _this.support.touch || !params.simulateTouch  ? 'touchstart' : desktopEvents[0],
        touchMove : _this.support.touch || !params.simulateTouch ? 'touchmove' : desktopEvents[1],
        touchEnd : _this.support.touch || !params.simulateTouch ? 'touchend' : desktopEvents[2]
    };

    /*=========================
      Wrapper
      ===========================*/
    for (var i = _this.container.childNodes.length - 1; i >= 0; i--) {
        if (_this.container.childNodes[i].className) {
            var _wrapperClasses = _this.container.childNodes[i].className.split(/\s+/);
            for (var j = 0; j < _wrapperClasses.length; j++) {
                if (_wrapperClasses[j] === params.wrapperClass) {
                    wrapper = _this.container.childNodes[i];
                }
            }
        }
    }

    _this.wrapper = wrapper;
    /*=========================
      Slide API
      ===========================*/
    _this._extendSwiperSlide = function  (el) {
        el.append = function () {
            if (params.loop) {
                el.insertAfter(_this.slides.length - _this.loopedSlides);
            }
            else {
                _this.wrapper.appendChild(el);
                _this.reInit();
            }

            return el;
        };
        el.prepend = function () {
            if (params.loop) {
                _this.wrapper.insertBefore(el, _this.slides[_this.loopedSlides]);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                _this.wrapper.insertBefore(el, _this.wrapper.firstChild);
            }
            _this.reInit();
            return el;
        };
        el.insertAfter = function (index) {
            if (typeof index === 'undefined') return false;
            var beforeSlide;

            if (params.loop) {
                beforeSlide = _this.slides[index + 1 + _this.loopedSlides];
                if (beforeSlide) {
                    _this.wrapper.insertBefore(el, beforeSlide);
                }
                else {
                    _this.wrapper.appendChild(el);
                }
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                beforeSlide = _this.slides[index + 1];
                _this.wrapper.insertBefore(el, beforeSlide);
            }
            _this.reInit();
            return el;
        };
        el.clone = function () {
            return _this._extendSwiperSlide(el.cloneNode(true));
        };
        el.remove = function () {
            _this.wrapper.removeChild(el);
            _this.reInit();
        };
        el.html = function (html) {
            if (typeof html === 'undefined') {
                return el.innerHTML;
            }
            else {
                el.innerHTML = html;
                return el;
            }
        };
        el.index = function () {
            var index;
            for (var i = _this.slides.length - 1; i >= 0; i--) {
                if (el === _this.slides[i]) index = i;
            }
            return index;
        };
        el.isActive = function () {
            if (el.index() === _this.activeIndex) return true;
            else return false;
        };
        if (!el.swiperSlideDataStorage) el.swiperSlideDataStorage = {};
        el.getData = function (name) {
            return el.swiperSlideDataStorage[name];
        };
        el.setData = function (name, value) {
            el.swiperSlideDataStorage[name] = value;
            return el;
        };
        el.data = function (name, value) {
            if (typeof value === 'undefined') {
                return el.getAttribute('data-' + name);
            }
            else {
                el.setAttribute('data-' + name, value);
                return el;
            }
        };
        el.getWidth = function (outer, round) {
            return _this.h.getWidth(el, outer, round);
        };
        el.getHeight = function (outer, round) {
            return _this.h.getHeight(el, outer, round);
        };
        el.getOffset = function () {
            return _this.h.getOffset(el);
        };
        return el;
    };

    //Calculate information about number of slides
    _this.calcSlides = function (forceCalcSlides) {
        var oldNumber = _this.slides ? _this.slides.length : false;
        _this.slides = [];
        _this.displaySlides = [];
        for (var i = 0; i < _this.wrapper.childNodes.length; i++) {
            if (_this.wrapper.childNodes[i].className) {
                var _className = _this.wrapper.childNodes[i].className;
                var _slideClasses = _className.split(/\s+/);
                for (var j = 0; j < _slideClasses.length; j++) {
                    if (_slideClasses[j] === params.slideClass) {
                        _this.slides.push(_this.wrapper.childNodes[i]);
                    }
                }
            }
        }
        for (i = _this.slides.length - 1; i >= 0; i--) {
            _this._extendSwiperSlide(_this.slides[i]);
        }
        if (oldNumber === false) return;
        if (oldNumber !== _this.slides.length || forceCalcSlides) {

            // Number of slides has been changed
            removeSlideEvents();
            addSlideEvents();
            _this.updateActiveSlide();
            if (_this.params.pagination) _this.createPagination();
            _this.callPlugins('numberOfSlidesChanged');
        }
    };

    //Create Slide
    _this.createSlide = function (html, slideClassList, el) {
        slideClassList = slideClassList || _this.params.slideClass;
        el = el || params.slideElement;
        var newSlide = document.createElement(el);
        newSlide.innerHTML = html || '';
        newSlide.className = slideClassList;
        return _this._extendSwiperSlide(newSlide);
    };

    //Append Slide
    _this.appendSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).append();
        }
        else {
            return _this.createSlide(html, slideClassList, el).append();
        }
    };
    _this.prependSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).prepend();
        }
        else {
            return _this.createSlide(html, slideClassList, el).prepend();
        }
    };
    _this.insertSlideAfter = function (index, html, slideClassList, el) {
        if (typeof index === 'undefined') return false;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).insertAfter(index);
        }
        else {
            return _this.createSlide(html, slideClassList, el).insertAfter(index);
        }
    };
    _this.removeSlide = function (index) {
        if (_this.slides[index]) {
            if (params.loop) {
                if (!_this.slides[index + _this.loopedSlides]) return false;
                _this.slides[index + _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[index].remove();
            return true;
        }
        else return false;
    };
    _this.removeLastSlide = function () {
        if (_this.slides.length > 0) {
            if (params.loop) {
                _this.slides[_this.slides.length - 1 - _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[_this.slides.length - 1].remove();
            return true;
        }
        else {
            return false;
        }
    };
    _this.removeAllSlides = function () {
        var num = _this.slides.length;
        for (var i = _this.slides.length - 1; i >= 0; i--) {
            _this.slides[i].remove();
            if (i === num - 1) {
                _this.setWrapperTranslate(0);
            }
        }
    };
    _this.getSlide = function (index) {
        return _this.slides[index];
    };
    _this.getLastSlide = function () {
        return _this.slides[_this.slides.length - 1];
    };
    _this.getFirstSlide = function () {
        return _this.slides[0];
    };

    //Currently Active Slide
    _this.activeSlide = function () {
        return _this.slides[_this.activeIndex];
    };

    /*=========================
     Wrapper for Callbacks : Allows additive callbacks via function arrays
     ===========================*/
    _this.fireCallback = function () {
        var callback = arguments[0];
        if (Object.prototype.toString.call(callback) === '[object Array]') {
            for (var i = 0; i < callback.length; i++) {
                if (typeof callback[i] === 'function') {
                    callback[i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        } else if (Object.prototype.toString.call(callback) === '[object String]') {
            if (params['on' + callback]) _this.fireCallback(params['on' + callback], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        } else {
            callback(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
    };
    function isArray(obj) {
        if (Object.prototype.toString.apply(obj) === '[object Array]') return true;
        return false;
    }

    /**
     * Allows user to add callbacks, rather than replace them
     * @param callback
     * @param func
     * @return {*}
     */
    _this.addCallback = function (callback, func) {
        var _this = this, tempFunc;
        if (_this.params['on' + callback]) {
            if (isArray(this.params['on' + callback])) {
                return this.params['on' + callback].push(func);
            } else if (typeof this.params['on' + callback] === 'function') {
                tempFunc = this.params['on' + callback];
                this.params['on' + callback] = [];
                this.params['on' + callback].push(tempFunc);
                return this.params['on' + callback].push(func);
            }
        } else {
            this.params['on' + callback] = [];
            return this.params['on' + callback].push(func);
        }
    };
    _this.removeCallbacks = function (callback) {
        if (_this.params['on' + callback]) {
            _this.params['on' + callback] = null;
        }
    };

    /*=========================
      Plugins API
      ===========================*/
    var _plugins = [];
    for (var plugin in _this.plugins) {
        if (params[plugin]) {
            var p = _this.plugins[plugin](_this, params[plugin]);
            if (p) _plugins.push(p);
        }
    }
    _this.callPlugins = function (method, args) {
        if (!args) args = {};
        for (var i = 0; i < _plugins.length; i++) {
            if (method in _plugins[i]) {
                _plugins[i][method](args);
            }
        }
    };

    /*=========================
      Windows Phone 8 Fix
      ===========================*/
    if ((_this.browser.ie10 || _this.browser.ie11) && !params.onlyExternal) {
        _this.wrapper.classList.add('swiper-wp8-' + (isH ? 'horizontal' : 'vertical'));
    }

    /*=========================
      Free Mode Class
      ===========================*/
    if (params.freeMode) {
        _this.container.className += ' swiper-free-mode';
    }

    /*==================================================
        Init/Re-init/Resize Fix
    ====================================================*/
    _this.initialized = false;
    _this.init = function (force, forceCalcSlides) {
        var _width = _this.h.getWidth(_this.container, false, params.roundLengths);
        var _height = _this.h.getHeight(_this.container, false, params.roundLengths);
        if (_width === _this.width && _height === _this.height && !force) return;

        _this.width = _width;
        _this.height = _height;

        var slideWidth, slideHeight, slideMaxHeight, wrapperWidth, wrapperHeight, slideLeft;
        var i; // loop index variable to avoid JSHint W004 / W038
        containerSize = isH ? _width : _height;
        var wrapper = _this.wrapper;

        if (force) {
            _this.calcSlides(forceCalcSlides);
        }

        if (params.slidesPerView === 'auto') {
            //Auto mode
            var slidesWidth = 0;
            var slidesHeight = 0;

            //Unset Styles
            if (params.slidesOffset > 0) {
                wrapper.style.paddingLeft = '';
                wrapper.style.paddingRight = '';
                wrapper.style.paddingTop = '';
                wrapper.style.paddingBottom = '';
            }
            wrapper.style.width = '';
            wrapper.style.height = '';
            if (params.offsetPxBefore > 0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter > 0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }

            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - this.slides[0].getWidth(true, params.roundLengths)) / 2;
                    _this.wrapperRight = (containerSize - _this.slides[_this.slides.length - 1].getWidth(true, params.roundLengths)) / 2;
                }
                else {
                    _this.wrapperTop = (containerSize - _this.slides[0].getHeight(true, params.roundLengths)) / 2;
                    _this.wrapperBottom = (containerSize - _this.slides[_this.slides.length - 1].getHeight(true, params.roundLengths)) / 2;
                }
            }

            if (isH) {
                if (_this.wrapperLeft >= 0) wrapper.style.paddingLeft = _this.wrapperLeft + 'px';
                if (_this.wrapperRight >= 0) wrapper.style.paddingRight = _this.wrapperRight + 'px';
            }
            else {
                if (_this.wrapperTop >= 0) wrapper.style.paddingTop = _this.wrapperTop + 'px';
                if (_this.wrapperBottom >= 0) wrapper.style.paddingBottom = _this.wrapperBottom + 'px';
            }
            slideLeft = 0;
            var centeredSlideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];

            slideMaxHeight = 0;
            for (i = 0; i < _this.slides.length; i++) {
                slideWidth = _this.slides[i].getWidth(true, params.roundLengths);
                slideHeight = _this.slides[i].getHeight(true, params.roundLengths);
                if (params.calculateHeight) {
                    slideMaxHeight = Math.max(slideMaxHeight, slideHeight);
                }
                var _slideSize = isH ? slideWidth : slideHeight;
                if (params.centeredSlides) {
                    var nextSlideWidth = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getWidth(true, params.roundLengths);
                    var nextSlideHeight = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getHeight(true, params.roundLengths);
                    var nextSlideSize = isH ? nextSlideWidth : nextSlideHeight;
                    if (_slideSize > containerSize) {
                        if (params.slidesPerViewFit) {
                            _this.snapGrid.push(slideLeft + _this.wrapperLeft);
                            _this.snapGrid.push(slideLeft + _slideSize - containerSize + _this.wrapperLeft);
                        }
                        else {
                            for (var j = 0; j <= Math.floor(_slideSize / (containerSize + _this.wrapperLeft)); j++) {
                                if (j === 0) _this.snapGrid.push(slideLeft + _this.wrapperLeft);
                                else _this.snapGrid.push(slideLeft + _this.wrapperLeft + containerSize * j);
                            }
                        }
                        _this.slidesGrid.push(slideLeft + _this.wrapperLeft);
                    }
                    else {
                        _this.snapGrid.push(centeredSlideLeft);
                        _this.slidesGrid.push(centeredSlideLeft);
                    }
                    centeredSlideLeft += _slideSize / 2 + nextSlideSize / 2;
                }
                else {
                    if (_slideSize > containerSize) {
                        if (params.slidesPerViewFit) {
                            _this.snapGrid.push(slideLeft);
                            _this.snapGrid.push(slideLeft + _slideSize - containerSize);
                        }
                        else {
                            if (containerSize !== 0) {
                                for (var k = 0; k <= Math.floor(_slideSize / containerSize); k++) {
                                    _this.snapGrid.push(slideLeft + containerSize * k);
                                }
                            }
                            else {
                                _this.snapGrid.push(slideLeft);
                            }
                        }

                    }
                    else {
                        _this.snapGrid.push(slideLeft);
                    }
                    _this.slidesGrid.push(slideLeft);
                }

                slideLeft += _slideSize;

                slidesWidth += slideWidth;
                slidesHeight += slideHeight;
            }
            if (params.calculateHeight) _this.height = slideMaxHeight;
            if (isH) {
                wrapperSize = slidesWidth + _this.wrapperRight + _this.wrapperLeft;
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'height') {
                    wrapper.style.width = (slidesWidth) + 'px';
                }
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'width') {
                    wrapper.style.height = (_this.height) + 'px';
                }
            }
            else {
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'height') {
                    wrapper.style.width = (_this.width) + 'px';
                }
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'width') {
                    wrapper.style.height = (slidesHeight) + 'px';
                }
                wrapperSize = slidesHeight + _this.wrapperTop + _this.wrapperBottom;
            }

        }
        else if (params.scrollContainer) {
            //Scroll Container
            wrapper.style.width = '';
            wrapper.style.height = '';
            wrapperWidth = _this.slides[0].getWidth(true, params.roundLengths);
            wrapperHeight = _this.slides[0].getHeight(true, params.roundLengths);
            wrapperSize = isH ? wrapperWidth : wrapperHeight;
            wrapper.style.width = wrapperWidth + 'px';
            wrapper.style.height = wrapperHeight + 'px';
            slideSize = isH ? wrapperWidth : wrapperHeight;

        }
        else {
            //For usual slides
            if (params.calculateHeight) {
                slideMaxHeight = 0;
                wrapperHeight = 0;
                //ResetWrapperSize
                if (!isH) _this.container.style.height = '';
                wrapper.style.height = '';

                for (i = 0; i < _this.slides.length; i++) {
                    //ResetSlideSize
                    _this.slides[i].style.height = '';
                    slideMaxHeight = Math.max(_this.slides[i].getHeight(true), slideMaxHeight);
                    if (!isH) wrapperHeight += _this.slides[i].getHeight(true);
                }
                slideHeight = slideMaxHeight;
                _this.height = slideHeight;

                if (isH) wrapperHeight = slideHeight;
                else {
                    containerSize = slideHeight;
                    _this.container.style.height = containerSize + 'px';
                }
            }
            else {
                slideHeight = isH ? _this.height : _this.height / params.slidesPerView;
                if (params.roundLengths) slideHeight = Math.ceil(slideHeight);
                wrapperHeight = isH ? _this.height : _this.slides.length * slideHeight;
            }
            slideWidth = isH ? _this.width / params.slidesPerView : _this.width;
            if (params.roundLengths) slideWidth = Math.ceil(slideWidth);
            wrapperWidth = isH ? _this.slides.length * slideWidth : _this.width;
            slideSize = isH ? slideWidth : slideHeight;

            if (params.offsetSlidesBefore > 0) {
                if (isH) _this.wrapperLeft = slideSize * params.offsetSlidesBefore;
                else _this.wrapperTop = slideSize * params.offsetSlidesBefore;
            }
            if (params.offsetSlidesAfter > 0) {
                if (isH) _this.wrapperRight = slideSize * params.offsetSlidesAfter;
                else _this.wrapperBottom = slideSize * params.offsetSlidesAfter;
            }
            if (params.offsetPxBefore > 0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter > 0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }
            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - slideSize) / 2;
                    _this.wrapperRight = (containerSize - slideSize) / 2;
                }
                else {
                    _this.wrapperTop = (containerSize - slideSize) / 2;
                    _this.wrapperBottom = (containerSize - slideSize) / 2;
                }
            }
            if (isH) {
                if (_this.wrapperLeft > 0) wrapper.style.paddingLeft = _this.wrapperLeft + 'px';
                if (_this.wrapperRight > 0) wrapper.style.paddingRight = _this.wrapperRight + 'px';
            }
            else {
                if (_this.wrapperTop > 0) wrapper.style.paddingTop = _this.wrapperTop + 'px';
                if (_this.wrapperBottom > 0) wrapper.style.paddingBottom = _this.wrapperBottom + 'px';
            }

            wrapperSize = isH ? wrapperWidth + _this.wrapperRight + _this.wrapperLeft : wrapperHeight + _this.wrapperTop + _this.wrapperBottom;
            if (parseFloat(wrapperWidth) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'height')) {
                wrapper.style.width = wrapperWidth + 'px';
            }
            if (parseFloat(wrapperHeight) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'width')) {
                wrapper.style.height = wrapperHeight + 'px';
            }
            slideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];
            for (i = 0; i < _this.slides.length; i++) {
                _this.snapGrid.push(slideLeft);
                _this.slidesGrid.push(slideLeft);
                slideLeft += slideSize;
                if (parseFloat(slideWidth) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'height')) {
                    _this.slides[i].style.width = slideWidth + 'px';
                }
                if (parseFloat(slideHeight) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === 'width')) {
                    _this.slides[i].style.height = slideHeight + 'px';
                }
            }

        }

        if (!_this.initialized) {
            _this.callPlugins('onFirstInit');
            if (params.onFirstInit) _this.fireCallback(params.onFirstInit, _this);
        }
        else {
            _this.callPlugins('onInit');
            if (params.onInit) _this.fireCallback(params.onInit, _this);
        }
        _this.initialized = true;
    };

    _this.reInit = function (forceCalcSlides) {
        _this.init(true, forceCalcSlides);
    };

    _this.resizeFix = function (reInit) {
        _this.callPlugins('beforeResizeFix');

        _this.init(params.resizeReInit || reInit);

        // swipe to active slide in fixed mode
        if (!params.freeMode) {
            _this.swipeTo((params.loop ? _this.activeLoopIndex : _this.activeIndex), 0, false);
            // Fix autoplay
            if (params.autoplay) {
                if (_this.support.transitions && typeof autoplayTimeoutId !== 'undefined') {
                    if (typeof autoplayTimeoutId !== 'undefined') {
                        clearTimeout(autoplayTimeoutId);
                        autoplayTimeoutId = undefined;
                        _this.startAutoplay();
                    }
                }
                else {
                    if (typeof autoplayIntervalId !== 'undefined') {
                        clearInterval(autoplayIntervalId);
                        autoplayIntervalId = undefined;
                        _this.startAutoplay();
                    }
                }
            }
        }
        // move wrapper to the beginning in free mode
        else if (_this.getWrapperTranslate() < -maxWrapperPosition()) {
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(-maxWrapperPosition());
        }

        _this.callPlugins('afterResizeFix');
    };

    /*==========================================
        Max and Min Positions
    ============================================*/
    function maxWrapperPosition() {
        var a = (wrapperSize - containerSize);
        if (params.freeMode) {
            a = wrapperSize - containerSize;
        }
        // if (params.loop) a -= containerSize;
        if (params.slidesPerView > _this.slides.length && !params.centeredSlides) {
            a = 0;
        }
        if (a < 0) a = 0;
        return a;
    }

    /*==========================================
        Event Listeners
    ============================================*/
    function initEvents() {
        var bind = _this.h.addEventListener;
        var eventTarget = params.eventTarget === 'wrapper' ? _this.wrapper : _this.container;
        //Touch Events
        if (! (_this.browser.ie10 || _this.browser.ie11)) {
            if (_this.support.touch) {
                bind(eventTarget, 'touchstart', onTouchStart);
                bind(eventTarget, 'touchmove', onTouchMove);
                bind(eventTarget, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                bind(eventTarget, 'mousedown', onTouchStart);
                bind(document, 'mousemove', onTouchMove);
                bind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            bind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
            bind(document, _this.touchEvents.touchMove, onTouchMove);
            bind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            bind(window, 'resize', _this.resizeFix);
        }
        //Slide Events
        addSlideEvents();
        //Mousewheel
        _this._wheelEvent = false;
        if (params.mousewheelControl) {
            if (document.onmousewheel !== undefined) {
                _this._wheelEvent = 'mousewheel';
            }
            if (!_this._wheelEvent) {
                try {
                    new WheelEvent('wheel');
                    _this._wheelEvent = 'wheel';
                } catch (e) {}
            }
            if (!_this._wheelEvent) {
                _this._wheelEvent = 'DOMMouseScroll';
            }
            if (_this._wheelEvent) {
                bind(_this.container, _this._wheelEvent, handleMousewheel);
            }
        }

        //Keyboard
		function _loadImage(img) {
			var image, src;
			var onReady = function () {
				if (typeof _this === 'undefined' || _this === null) return;
				if (_this.imagesLoaded !== undefined) _this.imagesLoaded++;
				if (_this.imagesLoaded === _this.imagesToLoad.length) {
					_this.reInit();
					if (params.onImagesReady) _this.fireCallback(params.onImagesReady, _this);
				}
			};

			if (!img.complete) {
				src = (img.currentSrc || img.getAttribute('src'));
				if (src) {
					image = new Image();
					image.onload = onReady;
					image.onerror = onReady;
					image.src = src;
				} else {
					onReady();
				}

			} else {//image already loaded...
				onReady();
			}
		}

		if (params.keyboardControl) {
			bind(document, 'keydown', handleKeyboardKeys);
		}
		if (params.updateOnImagesReady) {
			_this.imagesToLoad = $$('img', _this.container);

			for (var i = 0; i < _this.imagesToLoad.length; i++) {
				_loadImage(_this.imagesToLoad[i]);
			}
		}
    }

    //Remove Event Listeners
    _this.destroy = function (removeStyles) {
        var unbind = _this.h.removeEventListener;
        var eventTarget = params.eventTarget === 'wrapper' ? _this.wrapper : _this.container;
        //Touch Events
        if (! (_this.browser.ie10 || _this.browser.ie11)) {
            if (_this.support.touch) {
                unbind(eventTarget, 'touchstart', onTouchStart);
                unbind(eventTarget, 'touchmove', onTouchMove);
                unbind(eventTarget, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                unbind(eventTarget, 'mousedown', onTouchStart);
                unbind(document, 'mousemove', onTouchMove);
                unbind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            unbind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
            unbind(document, _this.touchEvents.touchMove, onTouchMove);
            unbind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            unbind(window, 'resize', _this.resizeFix);
        }

        //Init Slide Events
        removeSlideEvents();

        //Pagination
        if (params.paginationClickable) {
            removePaginationEvents();
        }

        //Mousewheel
        if (params.mousewheelControl && _this._wheelEvent) {
            unbind(_this.container, _this._wheelEvent, handleMousewheel);
        }

        //Keyboard
        if (params.keyboardControl) {
            unbind(document, 'keydown', handleKeyboardKeys);
        }

        //Stop autoplay
        if (params.autoplay) {
            _this.stopAutoplay();
        }
        // Remove styles
        if (removeStyles) {
            _this.wrapper.removeAttribute('style');
            for (var i = 0; i < _this.slides.length; i++) {
                _this.slides[i].removeAttribute('style');
            }
        }
        // Plugins
        _this.callPlugins('onDestroy');

        // Check jQuery/Zepto data
        if (window.jQuery && window.jQuery(_this.container).data('swiper')) {
            window.jQuery(_this.container).removeData('swiper');
        }
        if (window.Zepto && window.Zepto(_this.container).data('swiper')) {
            window.Zepto(_this.container).removeData('swiper');
        }

        //Destroy variable
        _this = null;
    };

    function addSlideEvents() {
        var bind = _this.h.addEventListener,
            i;

        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i = 0; i < links.length; i++) {
                bind(links[i], 'click', preventClick);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i = 0; i < formElements.length; i++) {
                bind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
                if (_this.support.touch && params.simulateTouch) {
                    bind(formElements[i], 'mousedown', releaseForms, true);
                }
            }
        }

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i = 0; i < _this.slides.length; i++) {
                bind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i = 0; i < _this.slides.length; i++) {
                bind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
    }
    function removeSlideEvents() {
        var unbind = _this.h.removeEventListener,
            i;

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i = 0; i < _this.slides.length; i++) {
                unbind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i = 0; i < _this.slides.length; i++) {
                unbind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i = 0; i < formElements.length; i++) {
                unbind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
                if (_this.support.touch && params.simulateTouch) {
                    unbind(formElements[i], 'mousedown', releaseForms, true);
                }
            }
        }
        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i = 0; i < links.length; i++) {
                unbind(links[i], 'click', preventClick);
            }
        }
    }
    /*==========================================
        Keyboard Control
    ============================================*/
    function handleKeyboardKeys(e) {
        var kc = e.keyCode || e.charCode;
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
        if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
            var inView = false;
            //Check that swiper should be inside of visible area of window
            var swiperOffset = _this.h.getOffset(_this.container);
            var scrollLeft = _this.h.windowScroll().left;
            var scrollTop = _this.h.windowScroll().top;
            var windowWidth = _this.h.windowWidth();
            var windowHeight = _this.h.windowHeight();
            var swiperCoord = [
                [swiperOffset.left, swiperOffset.top],
                [swiperOffset.left + _this.width, swiperOffset.top],
                [swiperOffset.left, swiperOffset.top + _this.height],
                [swiperOffset.left + _this.width, swiperOffset.top + _this.height]
            ];
            for (var i = 0; i < swiperCoord.length; i++) {
                var point = swiperCoord[i];
                if (
                    point[0] >= scrollLeft && point[0] <= scrollLeft + windowWidth &&
                    point[1] >= scrollTop && point[1] <= scrollTop + windowHeight
                ) {
                    inView = true;
                }

            }
            if (!inView) return;
        }
        if (isH) {
            if (kc === 37 || kc === 39) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc === 39) _this.swipeNext();
            if (kc === 37) _this.swipePrev();
        }
        else {
            if (kc === 38 || kc === 40) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc === 40) _this.swipeNext();
            if (kc === 38) _this.swipePrev();
        }
    }

    _this.disableKeyboardControl = function () {
        params.keyboardControl = false;
        _this.h.removeEventListener(document, 'keydown', handleKeyboardKeys);
    };

    _this.enableKeyboardControl = function () {
        params.keyboardControl = true;
        _this.h.addEventListener(document, 'keydown', handleKeyboardKeys);
    };

    /*==========================================
        Mousewheel Control
    ============================================*/
    var lastScrollTime = (new Date()).getTime();
    function handleMousewheel(e) {
        var we = _this._wheelEvent;
        var delta = 0;

        //Opera & IE
        if (e.detail) delta = -e.detail;
        //WebKits
        else if (we === 'mousewheel') {
            if (params.mousewheelControlForceToAxis) {
                if (isH) {
                    if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX;
                    else return;
                }
                else {
                    if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
                    else return;
                }
            }
            else {
                delta = e.wheelDelta;
            }
        }
        //Old FireFox
        else if (we === 'DOMMouseScroll') delta = -e.detail;
        //New FireFox
        else if (we === 'wheel') {
            if (params.mousewheelControlForceToAxis) {
                if (isH) {
                    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX;
                    else return;
                }
                else {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY;
                    else return;
                }
            }
            else {
                delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? - e.deltaX : - e.deltaY;
            }
        }

        if (!params.freeMode) {
            if ((new Date()).getTime() - lastScrollTime > 60) {
                if (delta < 0) _this.swipeNext();
                else _this.swipePrev();
            }
            lastScrollTime = (new Date()).getTime();

        }
        else {
            //Freemode or scrollContainer:
            var position = _this.getWrapperTranslate() + delta;

            if (position > 0) position = 0;
            if (position < -maxWrapperPosition()) position = -maxWrapperPosition();

            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(position);
            _this.updateActiveSlide(position);

            // Return page scroll on edge positions
            if (position === 0 || position === -maxWrapperPosition()) return;
        }
        if (params.autoplay) _this.stopAutoplay(true);

        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
        return false;
    }
    _this.disableMousewheelControl = function () {
        if (!_this._wheelEvent) return false;
        params.mousewheelControl = false;
        _this.h.removeEventListener(_this.container, _this._wheelEvent, handleMousewheel);
        return true;
    };

    _this.enableMousewheelControl = function () {
        if (!_this._wheelEvent) return false;
        params.mousewheelControl = true;
        _this.h.addEventListener(_this.container, _this._wheelEvent, handleMousewheel);
        return true;
    };

    /*=========================
      Grab Cursor
      ===========================*/
    if (params.grabCursor) {
        var containerStyle = _this.container.style;
        containerStyle.cursor = 'move';
        containerStyle.cursor = 'grab';
        containerStyle.cursor = '-moz-grab';
        containerStyle.cursor = '-webkit-grab';
    }

    /*=========================
      Slides Events Handlers
      ===========================*/

    _this.allowSlideClick = true;
    function slideClick(event) {
        if (_this.allowSlideClick) {
            setClickedSlide(event);
            _this.fireCallback(params.onSlideClick, _this, event);
        }
    }

    function slideTouch(event) {
        setClickedSlide(event);
        _this.fireCallback(params.onSlideTouch, _this, event);
    }

    function setClickedSlide(event) {

        // IE 6-8 support
        if (!event.currentTarget) {
            var element = event.srcElement;
            do {
                if (element.className.indexOf(params.slideClass) > -1) {
                    break;
                }
                element = element.parentNode;
            } while (element);
            _this.clickedSlide = element;
        }
        else {
            _this.clickedSlide = event.currentTarget;
        }

        _this.clickedSlideIndex     = _this.slides.indexOf(_this.clickedSlide);
        _this.clickedSlideLoopIndex = _this.clickedSlideIndex - (_this.loopedSlides || 0);
    }

    _this.allowLinks = true;
    function preventClick(e) {
        if (!_this.allowLinks) {
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            if (params.preventLinksPropagation && 'stopPropagation' in e) {
                e.stopPropagation();
            }
            return false;
        }
    }
    function releaseForms(e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.returnValue = false;
        return false;

    }

    /*==================================================
        Event Handlers
    ====================================================*/
    var isTouchEvent = false;
    var allowThresholdMove;
    var allowMomentumBounce = true;
    function onTouchStart(event) {
        if (params.preventLinks) _this.allowLinks = true;
        //Exit if slider is already was touched
        if (_this.isTouched || params.onlyExternal) {
            return false;
        }

        // Blur active elements
        var eventTarget = event.target || event.srcElement;
        if (document.activeElement && document.activeElement !== document.body) {
            if (document.activeElement !== eventTarget) document.activeElement.blur();
        }

        // Form tag names
        var formTagNames = ('input select textarea').split(' ');

        // Check for no swiping
        if (params.noSwiping && (eventTarget) && noSwipingSlide(eventTarget)) return false;
        allowMomentumBounce = false;
        //Check For Nested Swipers
        _this.isTouched = true;
        isTouchEvent = event.type === 'touchstart';

        // prevent user enter with right and the swiper move (needs isTouchEvent)
        if (!isTouchEvent && 'which' in event && event.which === 3) {
            _this.isTouched = false;
            return false;
        }

        if (!isTouchEvent || event.targetTouches.length === 1) {
            _this.callPlugins('onTouchStartBegin');
            if (!isTouchEvent && !_this.isAndroid && formTagNames.indexOf(eventTarget.tagName.toLowerCase()) < 0) {

                if (event.preventDefault) event.preventDefault();
                else event.returnValue = false;
            }

            var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
            var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

            //Start Touches to check the scrolling
            _this.touches.startX = _this.touches.currentX = pageX;
            _this.touches.startY = _this.touches.currentY = pageY;

            _this.touches.start = _this.touches.current = isH ? pageX : pageY;

            //Set Transition Time to 0
            _this.setWrapperTransition(0);

            //Get Start Translate Position
            _this.positions.start = _this.positions.current = _this.getWrapperTranslate();

            //Set Transform
            _this.setWrapperTranslate(_this.positions.start);

            //TouchStartTime
            _this.times.start = (new Date()).getTime();

            //Unset Scrolling
            isScrolling = undefined;

            //Set Treshold
            if (params.moveStartThreshold > 0) {
                allowThresholdMove = false;
            }

            //CallBack
            if (params.onTouchStart) _this.fireCallback(params.onTouchStart, _this, event);
            _this.callPlugins('onTouchStartEnd');

        }
    }
    var velocityPrevPosition, velocityPrevTime;
    function onTouchMove(event) {
        // If slider is not touched - exit
        if (!_this.isTouched || params.onlyExternal) return;
        if (isTouchEvent && event.type === 'mousemove') return;

        var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
        var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

        //check for scrolling
        if (typeof isScrolling === 'undefined' && isH) {
            isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) > Math.abs(pageX - _this.touches.startX));
        }
        if (typeof isScrolling === 'undefined' && !isH) {
            isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) < Math.abs(pageX - _this.touches.startX));
        }
        if (isScrolling) {
            _this.isTouched = false;
            return;
        }

        // One way swipes
        if (isH) {
            if ((!params.swipeToNext && pageX < _this.touches.startX) || ((!params.swipeToPrev && pageX > _this.touches.startX))) {
                return;
            }
        }
        else {
            if ((!params.swipeToNext && pageY < _this.touches.startY) || ((!params.swipeToPrev && pageY > _this.touches.startY))) {
                return;
            }
        }

        //Check For Nested Swipers
        if (event.assignedToSwiper) {
            _this.isTouched = false;
            return;
        }
        event.assignedToSwiper = true;

        //Block inner links
        if (params.preventLinks) {
            _this.allowLinks = false;
        }
        if (params.onSlideClick) {
            _this.allowSlideClick = false;
        }

        //Stop AutoPlay if exist
        if (params.autoplay) {
            _this.stopAutoplay(true);
        }
        if (!isTouchEvent || event.touches.length === 1) {

            //Moved Flag
            if (!_this.isMoved) {
                _this.callPlugins('onTouchMoveStart');

                if (params.loop) {
                    _this.fixLoop();
                    _this.positions.start = _this.getWrapperTranslate();
                }
                if (params.onTouchMoveStart) _this.fireCallback(params.onTouchMoveStart, _this);
            }
            _this.isMoved = true;

            // cancel event
            if (event.preventDefault) event.preventDefault();
            else event.returnValue = false;

            _this.touches.current = isH ? pageX : pageY;

            _this.positions.current = (_this.touches.current - _this.touches.start) * params.touchRatio + _this.positions.start;

            //Resistance Callbacks
            if (_this.positions.current > 0 && params.onResistanceBefore) {
                _this.fireCallback(params.onResistanceBefore, _this, _this.positions.current);
            }
            if (_this.positions.current < -maxWrapperPosition() && params.onResistanceAfter) {
                _this.fireCallback(params.onResistanceAfter, _this, Math.abs(_this.positions.current + maxWrapperPosition()));
            }
            //Resistance
            if (params.resistance && params.resistance !== '100%') {
                var resistance;
                //Resistance for Negative-Back sliding
                if (_this.positions.current > 0) {
                    resistance = 1 - _this.positions.current / containerSize / 2;
                    if (resistance < 0.5)
                        _this.positions.current = (containerSize / 2);
                    else
                        _this.positions.current = _this.positions.current * resistance;
                }
                //Resistance for After-End Sliding
                if (_this.positions.current < -maxWrapperPosition()) {

                    var diff = (_this.touches.current - _this.touches.start) * params.touchRatio + (maxWrapperPosition() + _this.positions.start);
                    resistance = (containerSize + diff) / (containerSize);
                    var newPos = _this.positions.current - diff * (1 - resistance) / 2;
                    var stopPos = -maxWrapperPosition() - containerSize / 2;

                    if (newPos < stopPos || resistance <= 0)
                        _this.positions.current = stopPos;
                    else
                        _this.positions.current = newPos;
                }
            }
            if (params.resistance && params.resistance === '100%') {
                //Resistance for Negative-Back sliding
                if (_this.positions.current > 0 && !(params.freeMode && !params.freeModeFluid)) {
                    _this.positions.current = 0;
                }
                //Resistance for After-End Sliding
                if (_this.positions.current < -maxWrapperPosition() && !(params.freeMode && !params.freeModeFluid)) {
                    _this.positions.current = -maxWrapperPosition();
                }
            }
            //Move Slides
            if (!params.followFinger) return;

            if (!params.moveStartThreshold) {
                _this.setWrapperTranslate(_this.positions.current);
            }
            else {
                if (Math.abs(_this.touches.current - _this.touches.start) > params.moveStartThreshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        _this.touches.start = _this.touches.current;
                        return;
                    }
                    _this.setWrapperTranslate(_this.positions.current);
                }
                else {
                    _this.positions.current = _this.positions.start;
                }
            }

            if (params.freeMode || params.watchActiveIndex) {
                _this.updateActiveSlide(_this.positions.current);
            }

            //Grab Cursor
            if (params.grabCursor) {
                _this.container.style.cursor = 'move';
                _this.container.style.cursor = 'grabbing';
                _this.container.style.cursor = '-moz-grabbin';
                _this.container.style.cursor = '-webkit-grabbing';
            }
            //Velocity
            if (!velocityPrevPosition) velocityPrevPosition = _this.touches.current;
            if (!velocityPrevTime) velocityPrevTime = (new Date()).getTime();
            _this.velocity = (_this.touches.current - velocityPrevPosition) / ((new Date()).getTime() - velocityPrevTime) / 2;
            if (Math.abs(_this.touches.current - velocityPrevPosition) < 2) _this.velocity = 0;
            velocityPrevPosition = _this.touches.current;
            velocityPrevTime = (new Date()).getTime();
            //Callbacks
            _this.callPlugins('onTouchMoveEnd');
            if (params.onTouchMove) _this.fireCallback(params.onTouchMove, _this, event);

            return false;
        }
    }
    function onTouchEnd(event) {
        //Check For scrolling
        if (isScrolling) {
            _this.swipeReset();
        }
        // If slider is not touched exit
        if (params.onlyExternal || !_this.isTouched) return;
        _this.isTouched = false;

        //Return Grab Cursor
        if (params.grabCursor) {
            _this.container.style.cursor = 'move';
            _this.container.style.cursor = 'grab';
            _this.container.style.cursor = '-moz-grab';
            _this.container.style.cursor = '-webkit-grab';
        }

        //Check for Current Position
        if (!_this.positions.current && _this.positions.current !== 0) {
            _this.positions.current = _this.positions.start;
        }

        //For case if slider touched but not moved
        if (params.followFinger) {
            _this.setWrapperTranslate(_this.positions.current);
        }

        // TouchEndTime
        _this.times.end = (new Date()).getTime();

        //Difference
        _this.touches.diff = _this.touches.current - _this.touches.start;
        _this.touches.abs = Math.abs(_this.touches.diff);

        _this.positions.diff = _this.positions.current - _this.positions.start;
        _this.positions.abs = Math.abs(_this.positions.diff);

        var diff = _this.positions.diff;
        var diffAbs = _this.positions.abs;
        var timeDiff = _this.times.end - _this.times.start;

        if (diffAbs < 5 && (timeDiff) < 300 && _this.allowLinks === false) {
            if (!params.freeMode && diffAbs !== 0) _this.swipeReset();
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }

        setTimeout(function () {
            //Release inner links
            if (typeof _this === 'undefined' || _this === null) return;
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }, 100);

        var maxPosition = maxWrapperPosition();

        //Not moved or Prevent Negative Back Sliding/After-End Sliding
        if (!_this.isMoved && params.freeMode) {
            _this.isMoved = false;
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins('onTouchEnd');
            return;
        }
        if (!_this.isMoved || _this.positions.current > 0 || _this.positions.current < -maxPosition) {
            _this.swipeReset();
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins('onTouchEnd');
            return;
        }

        _this.isMoved = false;

        //Free Mode
        if (params.freeMode) {
            if (params.freeModeFluid) {
                var momentumDuration = 1000 * params.momentumRatio;
                var momentumDistance = _this.velocity * momentumDuration;
                var newPosition = _this.positions.current + momentumDistance;
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs(_this.velocity) * 20 * params.momentumBounceRatio;
                if (newPosition < -maxPosition) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition + maxPosition < -bounceAmount) newPosition = -maxPosition - bounceAmount;
                        afterBouncePosition = -maxPosition;
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = -maxPosition;
                }
                if (newPosition > 0) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition > bounceAmount) newPosition = bounceAmount;
                        afterBouncePosition = 0;
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = 0;
                }
                //Fix duration
                if (_this.velocity !== 0) momentumDuration = Math.abs((newPosition - _this.positions.current) / _this.velocity);

                _this.setWrapperTranslate(newPosition);

                _this.setWrapperTransition(momentumDuration);

                if (params.momentumBounce && doBounce) {
                    _this.wrapperTransitionEnd(function () {
                        if (!allowMomentumBounce) return;
                        if (params.onMomentumBounce) _this.fireCallback(params.onMomentumBounce, _this);
                        _this.callPlugins('onMomentumBounce');

                        _this.setWrapperTranslate(afterBouncePosition);
                        _this.setWrapperTransition(300);
                    });
                }

                _this.updateActiveSlide(newPosition);
            }
            if (!params.freeModeFluid || timeDiff >= 300) _this.updateActiveSlide(_this.positions.current);

            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins('onTouchEnd');
            return;
        }

        //Direction
        direction = diff < 0 ? 'toNext' : 'toPrev';

        //Short Touches
        if (direction === 'toNext' && (timeDiff <= 300)) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset();
            else _this.swipeNext(true, true);
        }

        if (direction === 'toPrev' && (timeDiff <= 300)) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset();
            else _this.swipePrev(true, true);
        }

        //Long Touches
        var targetSlideSize = 0;
        if (params.slidesPerView === 'auto') {
            //Define current slide's width
            var currentPosition = Math.abs(_this.getWrapperTranslate());
            var slidesOffset = 0;
            var _slideSize;
            for (var i = 0; i < _this.slides.length; i++) {
                _slideSize = isH ? _this.slides[i].getWidth(true, params.roundLengths) : _this.slides[i].getHeight(true, params.roundLengths);
                slidesOffset += _slideSize;
                if (slidesOffset > currentPosition) {
                    targetSlideSize = _slideSize;
                    break;
                }
            }
            if (targetSlideSize > containerSize) targetSlideSize = containerSize;
        }
        else {
            targetSlideSize = slideSize * params.slidesPerView;
        }
        if (direction === 'toNext' && (timeDiff > 300)) {
            if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
                _this.swipeNext(true, true);
            }
            else {
                _this.swipeReset();
            }
        }
        if (direction === 'toPrev' && (timeDiff > 300)) {
            if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
                _this.swipePrev(true, true);
            }
            else {
                _this.swipeReset();
            }
        }
        if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
        _this.callPlugins('onTouchEnd');
    }


    /*==================================================
        noSwiping Bubble Check by Isaac Strack
    ====================================================*/
    function hasClass(el, classname) {
        return el && el.getAttribute('class') && el.getAttribute('class').indexOf(classname) > -1;
    }
    function noSwipingSlide(el) {
        /*This function is specifically designed to check the parent elements for the noSwiping class, up to the wrapper.
        We need to check parents because while onTouchStart bubbles, _this.isTouched is checked in onTouchStart, which stops the bubbling.
        So, if a text box, for example, is the initial target, and the parent slide container has the noSwiping class, the _this.isTouched
        check will never find it, and what was supposed to be noSwiping is able to be swiped.
        This function will iterate up and check for the noSwiping class in parents, up through the wrapperClass.*/

        // First we create a truthy variable, which is that swiping is allowd (noSwiping = false)
        var noSwiping = false;

        // Now we iterate up (parentElements) until we reach the node with the wrapperClass.
        do {

            // Each time, we check to see if there's a 'swiper-no-swiping' class (noSwipingClass).
            if (hasClass(el, params.noSwipingClass))
            {
                noSwiping = true; // If there is, we set noSwiping = true;
            }

            el = el.parentElement;  // now we iterate up (parent node)

        } while (!noSwiping && el.parentElement && !hasClass(el, params.wrapperClass)); // also include el.parentElement truthy, just in case.

        // because we didn't check the wrapper itself, we do so now, if noSwiping is false:
        if (!noSwiping && hasClass(el, params.wrapperClass) && hasClass(el, params.noSwipingClass))
            noSwiping = true; // if the wrapper has the noSwipingClass, we set noSwiping = true;

        return noSwiping;
    }

    function addClassToHtmlString(klass, outerHtml) {
        var par = document.createElement('div');
        var child;

        par.innerHTML = outerHtml;
        child = par.firstChild;
        child.className += ' ' + klass;

        return child.outerHTML;
    }


    /*==================================================
        Swipe Functions
    ====================================================*/
    _this.swipeNext = function (runCallbacks, internal) {
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipeNext');
        var currentPosition = _this.getWrapperTranslate().toFixed(2);
        var newPosition = currentPosition;
        if (params.slidesPerView === 'auto') {
            for (var i = 0; i < _this.snapGrid.length; i++) {
                if (-currentPosition >= _this.snapGrid[i].toFixed(2) && -currentPosition < _this.snapGrid[i + 1].toFixed(2)) {
                    newPosition = -_this.snapGrid[i + 1];
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.floor(Math.abs(currentPosition) / Math.floor(groupSize)) * groupSize + groupSize);
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition();
        }
        if (newPosition === currentPosition) return false;
        swipeToPosition(newPosition, 'next', {runCallbacks: runCallbacks});
        return true;
    };
    _this.swipePrev = function (runCallbacks, internal) {
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipePrev');

        var currentPosition = Math.ceil(_this.getWrapperTranslate());
        var newPosition;
        if (params.slidesPerView === 'auto') {
            newPosition = 0;
            for (var i = 1; i < _this.snapGrid.length; i++) {
                if (-currentPosition === _this.snapGrid[i]) {
                    newPosition = -_this.snapGrid[i - 1];
                    break;
                }
                if (-currentPosition > _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
                    newPosition = -_this.snapGrid[i];
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.ceil(-currentPosition / groupSize) - 1) * groupSize;
        }

        if (newPosition > 0) newPosition = 0;

        if (newPosition === currentPosition) return false;
        swipeToPosition(newPosition, 'prev', {runCallbacks: runCallbacks});
        return true;

    };
    _this.swipeReset = function (runCallbacks) {
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        _this.callPlugins('onSwipeReset');
        var currentPosition = _this.getWrapperTranslate();
        var groupSize = slideSize * params.slidesPerGroup;
        var newPosition;
        var maxPosition = -maxWrapperPosition();
        if (params.slidesPerView === 'auto') {
            newPosition = 0;
            for (var i = 0; i < _this.snapGrid.length; i++) {
                if (-currentPosition === _this.snapGrid[i]) return;
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
                    if (_this.positions.diff > 0) newPosition = -_this.snapGrid[i + 1];
                    else newPosition = -_this.snapGrid[i];
                    break;
                }
            }
            if (-currentPosition >= _this.snapGrid[_this.snapGrid.length - 1]) newPosition = -_this.snapGrid[_this.snapGrid.length - 1];
            if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition();
        }
        else {
            newPosition = currentPosition < 0 ? Math.round(currentPosition / groupSize) * groupSize : 0;
            if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition();
        }
        if (params.scrollContainer)  {
            newPosition = currentPosition < 0 ? currentPosition : 0;
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition();
        }
        if (params.scrollContainer && (containerSize > slideSize)) {
            newPosition = 0;
        }

        if (newPosition === currentPosition) return false;

        swipeToPosition(newPosition, 'reset', {runCallbacks: runCallbacks});
        return true;
    };

    _this.swipeTo = function (index, speed, runCallbacks) {
        index = parseInt(index, 10);
        _this.callPlugins('onSwipeTo', {index: index, speed: speed});
        if (params.loop) index = index + _this.loopedSlides;
        var currentPosition = _this.getWrapperTranslate();
        if (!isFinite(index) || index > (_this.slides.length - 1) || index < 0) return;
        var newPosition;
        if (params.slidesPerView === 'auto') {
            newPosition = -_this.slidesGrid[index];
        }
        else {
            newPosition = -index * slideSize;
        }
        if (newPosition < - maxWrapperPosition()) {
            newPosition = - maxWrapperPosition();
        }

        if (newPosition === currentPosition) return false;

        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        swipeToPosition(newPosition, 'to', {index: index, speed: speed, runCallbacks: runCallbacks});
        return true;
    };

    function swipeToPosition(newPosition, action, toOptions) {
        var speed = (action === 'to' && toOptions.speed >= 0) ? toOptions.speed : params.speed;
        var timeOld = + new Date();

        function anim() {
            var timeNew = + new Date();
            var time = timeNew - timeOld;
            currentPosition += animationStep * time / (1000 / 60);
            condition = direction === 'toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (condition) {
                _this.setWrapperTranslate(Math.ceil(currentPosition));
                _this._DOMAnimating = true;
                window.setTimeout(function () {
                    anim();
                }, 1000 / 60);
            }
            else {
                if (params.onSlideChangeEnd) {
                    if (action === 'to') {
                        if (toOptions.runCallbacks === true) _this.fireCallback(params.onSlideChangeEnd, _this, direction);
                    }
                    else {
                        _this.fireCallback(params.onSlideChangeEnd, _this, direction);
                    }

                }
                _this.setWrapperTranslate(newPosition);
                _this._DOMAnimating = false;
            }
        }

        if (_this.support.transitions || !params.DOMAnimation) {
            _this.setWrapperTranslate(newPosition);
            _this.setWrapperTransition(speed);
        }
        else {
            //Try the DOM animation
            var currentPosition = _this.getWrapperTranslate();
            var animationStep = Math.ceil((newPosition - currentPosition) / speed * (1000 / 60));
            var direction = currentPosition > newPosition ? 'toNext' : 'toPrev';
            var condition = direction === 'toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (_this._DOMAnimating) return;

            anim();
        }

        //Update Active Slide Index
        _this.updateActiveSlide(newPosition);

        //Callbacks
        if (params.onSlideNext && action === 'next' && toOptions.runCallbacks === true) {
            _this.fireCallback(params.onSlideNext, _this, newPosition);
        }
        if (params.onSlidePrev && action === 'prev' && toOptions.runCallbacks === true) {
            _this.fireCallback(params.onSlidePrev, _this, newPosition);
        }
        //'Reset' Callback
        if (params.onSlideReset && action === 'reset' && toOptions.runCallbacks === true) {
            _this.fireCallback(params.onSlideReset, _this, newPosition);
        }

        //'Next', 'Prev' and 'To' Callbacks
        if ((action === 'next' || action === 'prev' || action === 'to') && toOptions.runCallbacks === true)
            slideChangeCallbacks(action);
    }
    /*==================================================
        Transition Callbacks
    ====================================================*/
    //Prevent Multiple Callbacks
    _this._queueStartCallbacks = false;
    _this._queueEndCallbacks = false;
    function slideChangeCallbacks(direction) {
        //Transition Start Callback
        _this.callPlugins('onSlideChangeStart');
        if (params.onSlideChangeStart) {
            if (params.queueStartCallbacks && _this.support.transitions) {
                if (_this._queueStartCallbacks) return;
                _this._queueStartCallbacks = true;
                _this.fireCallback(params.onSlideChangeStart, _this, direction);
                _this.wrapperTransitionEnd(function () {
                    _this._queueStartCallbacks = false;
                });
            }
            else _this.fireCallback(params.onSlideChangeStart, _this, direction);
        }
        //Transition End Callback
        if (params.onSlideChangeEnd) {
            if (_this.support.transitions) {
                if (params.queueEndCallbacks) {
                    if (_this._queueEndCallbacks) return;
                    _this._queueEndCallbacks = true;
                    _this.wrapperTransitionEnd(function (swiper) {
                        _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
                    });
                }
                else {
                    _this.wrapperTransitionEnd(function (swiper) {
                        _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
                    });
                }
            }
            else {
                if (!params.DOMAnimation) {
                    setTimeout(function () {
                        _this.fireCallback(params.onSlideChangeEnd, _this, direction);
                    }, 10);
                }
            }
        }
    }

    /*==================================================
        Update Active Slide Index
    ====================================================*/
    _this.updateActiveSlide = function (position) {
        if (!_this.initialized) return;
        if (_this.slides.length === 0) return;
        _this.previousIndex = _this.activeIndex;
        if (typeof position === 'undefined') position = _this.getWrapperTranslate();
        if (position > 0) position = 0;
        var i;
        if (params.slidesPerView === 'auto') {
            var slidesOffset = 0;
            _this.activeIndex = _this.slidesGrid.indexOf(-position);
            if (_this.activeIndex < 0) {
                for (i = 0; i < _this.slidesGrid.length - 1; i++) {
                    if (-position > _this.slidesGrid[i] && -position < _this.slidesGrid[i + 1]) {
                        break;
                    }
                }
                var leftDistance = Math.abs(_this.slidesGrid[i] + position);
                var rightDistance = Math.abs(_this.slidesGrid[i + 1] + position);
                if (leftDistance <= rightDistance) _this.activeIndex = i;
                else _this.activeIndex = i + 1;
            }
        }
        else {
            _this.activeIndex = Math[params.visibilityFullFit ? 'ceil' : 'round'](-position / slideSize);
        }

        if (_this.activeIndex === _this.slides.length) _this.activeIndex = _this.slides.length - 1;
        if (_this.activeIndex < 0) _this.activeIndex = 0;

        // Check for slide
        if (!_this.slides[_this.activeIndex]) return;

        // Calc Visible slides
        _this.calcVisibleSlides(position);

        // Mark visible and active slides with additonal classes
        if (_this.support.classList) {
            var slide;
            for (i = 0; i < _this.slides.length; i++) {
                slide = _this.slides[i];
                slide.classList.remove(params.slideActiveClass);
                if (_this.visibleSlides.indexOf(slide) >= 0) {
                    slide.classList.add(params.slideVisibleClass);
                } else {
                    slide.classList.remove(params.slideVisibleClass);
                }
            }
            _this.slides[_this.activeIndex].classList.add(params.slideActiveClass);
        } else {
            var activeClassRegexp = new RegExp('\\s*' + params.slideActiveClass);
            var inViewClassRegexp = new RegExp('\\s*' + params.slideVisibleClass);

            for (i = 0; i < _this.slides.length; i++) {
                _this.slides[i].className = _this.slides[i].className.replace(activeClassRegexp, '').replace(inViewClassRegexp, '');
                if (_this.visibleSlides.indexOf(_this.slides[i]) >= 0) {
                    _this.slides[i].className += ' ' + params.slideVisibleClass;
                }
            }
            _this.slides[_this.activeIndex].className += ' ' + params.slideActiveClass;
        }

        //Update loop index
        if (params.loop) {
            var ls = _this.loopedSlides;
            _this.activeLoopIndex = _this.activeIndex - ls;
            if (_this.activeLoopIndex >= _this.slides.length - ls * 2) {
                _this.activeLoopIndex = _this.slides.length - ls * 2 - _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex < 0) {
                _this.activeLoopIndex = _this.slides.length - ls * 2 + _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex < 0) _this.activeLoopIndex = 0;
        }
        else {
            _this.activeLoopIndex = _this.activeIndex;
        }
        //Update Pagination
        if (params.pagination) {
            _this.updatePagination(position);
        }
    };
    /*==================================================
        Pagination
    ====================================================*/
    _this.createPagination = function (firstInit) {
        if (params.paginationClickable && _this.paginationButtons) {
            removePaginationEvents();
        }
        _this.paginationContainer = params.pagination.nodeType ? params.pagination : $$(params.pagination)[0];
        if (params.createPagination) {
            var paginationHTML = '';
            var numOfSlides = _this.slides.length;
            var numOfButtons = numOfSlides;
            if (params.loop) numOfButtons -= _this.loopedSlides * 2;
            for (var i = 0; i < numOfButtons; i++) {
                paginationHTML += '<' + params.paginationElement + ' class="' + params.paginationElementClass + '"></' + params.paginationElement + '>';
            }
            _this.paginationContainer.innerHTML = paginationHTML;
        }
        _this.paginationButtons = $$('.' + params.paginationElementClass, _this.paginationContainer);
        if (!firstInit) _this.updatePagination();
        _this.callPlugins('onCreatePagination');
        if (params.paginationClickable) {
            addPaginationEvents();
        }
    };
    function removePaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.removeEventListener(pagers[i], 'click', paginationClick);
            }
        }
    }
    function addPaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.addEventListener(pagers[i], 'click', paginationClick);
            }
        }
    }
    function paginationClick(e) {
        var index;
        var target = e.target || e.srcElement;
        var pagers = _this.paginationButtons;
        for (var i = 0; i < pagers.length; i++) {
            if (target === pagers[i]) index = i;
        }
        if (params.autoplay) _this.stopAutoplay(true);
        _this.swipeTo(index);
    }
    _this.updatePagination = function (position) {
        if (!params.pagination) return;
        if (_this.slides.length < 1) return;
        var activePagers = $$('.' + params.paginationActiveClass, _this.paginationContainer);
        if (!activePagers) return;

        //Reset all Buttons' class to not active
        var pagers = _this.paginationButtons;
        if (pagers.length === 0) return;
        for (var i = 0; i < pagers.length; i++) {
            pagers[i].className = params.paginationElementClass;
        }

        var indexOffset = params.loop ? _this.loopedSlides : 0;
        if (params.paginationAsRange) {
            if (!_this.visibleSlides) _this.calcVisibleSlides(position);
            //Get Visible Indexes
            var visibleIndexes = [];
            var j; // lopp index - avoid JSHint W004 / W038
            for (j = 0; j < _this.visibleSlides.length; j++) {
                var visIndex = _this.slides.indexOf(_this.visibleSlides[j]) - indexOffset;

                if (params.loop && visIndex < 0) {
                    visIndex = _this.slides.length - _this.loopedSlides * 2 + visIndex;
                }
                if (params.loop && visIndex >= _this.slides.length - _this.loopedSlides * 2) {
                    visIndex = _this.slides.length - _this.loopedSlides * 2 - visIndex;
                    visIndex = Math.abs(visIndex);
                }
                visibleIndexes.push(visIndex);
            }

            for (j = 0; j < visibleIndexes.length; j++) {
                if (pagers[visibleIndexes[j]]) pagers[visibleIndexes[j]].className += ' ' + params.paginationVisibleClass;
            }

            if (params.loop) {
                if (pagers[_this.activeLoopIndex] !== undefined) {
                    pagers[_this.activeLoopIndex].className += ' ' + params.paginationActiveClass;
                }
            }
            else {
                if (pagers[_this.activeIndex]) pagers[_this.activeIndex].className += ' ' + params.paginationActiveClass;
            }
        }
        else {
            if (params.loop) {
                if (pagers[_this.activeLoopIndex]) pagers[_this.activeLoopIndex].className += ' ' + params.paginationActiveClass + ' ' + params.paginationVisibleClass;
            }
            else {
                if (pagers[_this.activeIndex]) pagers[_this.activeIndex].className += ' ' + params.paginationActiveClass + ' ' + params.paginationVisibleClass;
            }
        }
    };
    _this.calcVisibleSlides = function (position) {
        var visibleSlides = [];
        var _slideLeft = 0, _slideSize = 0, _slideRight = 0;
        if (isH && _this.wrapperLeft > 0) position = position + _this.wrapperLeft;
        if (!isH && _this.wrapperTop > 0) position = position + _this.wrapperTop;

        for (var i = 0; i < _this.slides.length; i++) {
            _slideLeft += _slideSize;
            if (params.slidesPerView === 'auto')
                _slideSize  = isH ? _this.h.getWidth(_this.slides[i], true, params.roundLengths) : _this.h.getHeight(_this.slides[i], true, params.roundLengths);
            else _slideSize = slideSize;

            _slideRight = _slideLeft + _slideSize;
            var isVisibile = false;
            if (params.visibilityFullFit) {
                if (_slideLeft >= -position && _slideRight <= -position + containerSize) isVisibile = true;
                if (_slideLeft <= -position && _slideRight >= -position + containerSize) isVisibile = true;
            }
            else {
                if (_slideRight > -position && _slideRight <= ((-position + containerSize))) isVisibile = true;
                if (_slideLeft >= -position && _slideLeft < ((-position + containerSize))) isVisibile = true;
                if (_slideLeft < -position && _slideRight > ((-position + containerSize))) isVisibile = true;
            }

            if (isVisibile) visibleSlides.push(_this.slides[i]);

        }
        if (visibleSlides.length === 0) visibleSlides = [_this.slides[_this.activeIndex]];

        _this.visibleSlides = visibleSlides;
    };

    /*==========================================
        Autoplay
    ============================================*/
    var autoplayTimeoutId, autoplayIntervalId;
    _this.startAutoplay = function () {
        if (_this.support.transitions) {
            if (typeof autoplayTimeoutId !== 'undefined') return false;
            if (!params.autoplay) return;
            _this.callPlugins('onAutoplayStart');
            if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
            autoplay();
        }
        else {
            if (typeof autoplayIntervalId !== 'undefined') return false;
            if (!params.autoplay) return;
            _this.callPlugins('onAutoplayStart');
            if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
            autoplayIntervalId = setInterval(function () {
                if (params.loop) {
                    _this.fixLoop();
                    _this.swipeNext(true, true);
                }
                else if (!_this.swipeNext(true, true)) {
                    if (!params.autoplayStopOnLast) _this.swipeTo(0);
                    else {
                        clearInterval(autoplayIntervalId);
                        autoplayIntervalId = undefined;
                    }
                }
            }, params.autoplay);
        }
    };
    _this.stopAutoplay = function (internal) {
        if (_this.support.transitions) {
            if (!autoplayTimeoutId) return;
            if (autoplayTimeoutId) clearTimeout(autoplayTimeoutId);
            autoplayTimeoutId = undefined;
            if (internal && !params.autoplayDisableOnInteraction) {
                _this.wrapperTransitionEnd(function () {
                    autoplay();
                });
            }
            _this.callPlugins('onAutoplayStop');
            if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
        }
        else {
            if (autoplayIntervalId) clearInterval(autoplayIntervalId);
            autoplayIntervalId = undefined;
            _this.callPlugins('onAutoplayStop');
            if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
        }
    };
    function autoplay() {
        autoplayTimeoutId = setTimeout(function () {
            if (params.loop) {
                _this.fixLoop();
                _this.swipeNext(true, true);
            }
            else if (!_this.swipeNext(true, true)) {
                if (!params.autoplayStopOnLast) _this.swipeTo(0);
                else {
                    clearTimeout(autoplayTimeoutId);
                    autoplayTimeoutId = undefined;
                }
            }
            _this.wrapperTransitionEnd(function () {
                if (typeof autoplayTimeoutId !== 'undefined') autoplay();
            });
        }, params.autoplay);
    }
    /*==================================================
        Loop
    ====================================================*/
    _this.loopCreated = false;
    _this.removeLoopedSlides = function () {
        if (_this.loopCreated) {
            for (var i = 0; i < _this.slides.length; i++) {
                if (_this.slides[i].getData('looped') === true) _this.wrapper.removeChild(_this.slides[i]);
            }
        }
    };

    _this.createLoop = function () {
        if (_this.slides.length === 0) return;
        if (params.slidesPerView === 'auto') {
            _this.loopedSlides = params.loopedSlides || 1;
        }
        else {
            _this.loopedSlides = Math.floor(params.slidesPerView) + params.loopAdditionalSlides;
        }

        if (_this.loopedSlides > _this.slides.length) {
            _this.loopedSlides = _this.slides.length;
        }

        var slideFirstHTML = '',
            slideLastHTML = '',
            i;
        var slidesSetFullHTML = '';
        /**
                loopedSlides is too large if loopAdditionalSlides are set.
                Need to divide the slides by maximum number of slides existing.

                @author        Tomaz Lovrec <tomaz.lovrec@blanc-noir.at>
        */
        var numSlides = _this.slides.length;
        var fullSlideSets = Math.floor(_this.loopedSlides / numSlides);
        var remainderSlides = _this.loopedSlides % numSlides;
        // assemble full sets of slides
        for (i = 0; i < (fullSlideSets * numSlides); i++) {
            var j = i;
            if (i >= numSlides) {
                var over = Math.floor(i / numSlides);
                j = i - (numSlides * over);
            }
            slidesSetFullHTML += _this.slides[j].outerHTML;
        }
        // assemble remainder slides
        // assemble remainder appended to existing slides
        for (i = 0; i < remainderSlides;i++) {
            slideLastHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
        }
        // assemble slides that get preppended to existing slides
        for (i = numSlides - remainderSlides; i < numSlides;i++) {
            slideFirstHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
        }
        // assemble all slides
        var slides = slideFirstHTML + slidesSetFullHTML + wrapper.innerHTML + slidesSetFullHTML + slideLastHTML;
        // set the slides
        wrapper.innerHTML = slides;

        _this.loopCreated = true;
        _this.calcSlides();

        //Update Looped Slides with special class
        for (i = 0; i < _this.slides.length; i++) {
            if (i < _this.loopedSlides || i >= _this.slides.length - _this.loopedSlides) _this.slides[i].setData('looped', true);
        }
        _this.callPlugins('onCreateLoop');

    };

    _this.fixLoop = function () {
        var newIndex;
        //Fix For Negative Oversliding
        if (_this.activeIndex < _this.loopedSlides) {
            newIndex = _this.slides.length - _this.loopedSlides * 3 + _this.activeIndex;
            _this.swipeTo(newIndex, 0, false);
        }
        //Fix For Positive Oversliding
        else if ((params.slidesPerView === 'auto' && _this.activeIndex >= _this.loopedSlides * 2) || (_this.activeIndex > _this.slides.length - params.slidesPerView * 2)) {
            newIndex = -_this.slides.length + _this.activeIndex + _this.loopedSlides;
            _this.swipeTo(newIndex, 0, false);
        }
    };

    /*==================================================
        Slides Loader
    ====================================================*/
    _this.loadSlides = function () {
        var slidesHTML = '';
        _this.activeLoaderIndex = 0;
        var slides = params.loader.slides;
        var slidesToLoad = params.loader.loadAllSlides ? slides.length : params.slidesPerView * (1 + params.loader.surroundGroups);
        for (var i = 0; i < slidesToLoad; i++) {
            if (params.loader.slidesHTMLType === 'outer') slidesHTML += slides[i];
            else {
                slidesHTML += '<' + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + '</' + params.slideElement + '>';
            }
        }
        _this.wrapper.innerHTML = slidesHTML;
        _this.calcSlides(true);
        //Add permanent transitionEnd callback
        if (!params.loader.loadAllSlides) {
            _this.wrapperTransitionEnd(_this.reloadSlides, true);
        }
    };

    _this.reloadSlides = function () {
        var slides = params.loader.slides;
        var newActiveIndex = parseInt(_this.activeSlide().data('swiperindex'), 10);
        if (newActiveIndex < 0 || newActiveIndex > slides.length - 1) return; //<-- Exit
        _this.activeLoaderIndex = newActiveIndex;
        var firstIndex = Math.max(0, newActiveIndex - params.slidesPerView * params.loader.surroundGroups);
        var lastIndex = Math.min(newActiveIndex + params.slidesPerView * (1 + params.loader.surroundGroups) - 1, slides.length - 1);
        //Update Transforms
        if (newActiveIndex > 0) {
            var newTransform = -slideSize * (newActiveIndex - firstIndex);
            _this.setWrapperTranslate(newTransform);
            _this.setWrapperTransition(0);
        }
        var i; // loop index
        //New Slides
        if (params.loader.logic === 'reload') {
            _this.wrapper.innerHTML = '';
            var slidesHTML = '';
            for (i = firstIndex; i <= lastIndex; i++) {
                slidesHTML += params.loader.slidesHTMLType === 'outer' ? slides[i] : '<' + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + '</' + params.slideElement + '>';
            }
            _this.wrapper.innerHTML = slidesHTML;
        }
        else {
            var minExistIndex = 1000;
            var maxExistIndex = 0;

            for (i = 0; i < _this.slides.length; i++) {
                var index = _this.slides[i].data('swiperindex');
                if (index < firstIndex || index > lastIndex) {
                    _this.wrapper.removeChild(_this.slides[i]);
                }
                else {
                    minExistIndex = Math.min(index, minExistIndex);
                    maxExistIndex = Math.max(index, maxExistIndex);
                }
            }
            for (i = firstIndex; i <= lastIndex; i++) {
                var newSlide;
                if (i < minExistIndex) {
                    newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex', i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.insertBefore(newSlide, _this.wrapper.firstChild);
                }
                if (i > maxExistIndex) {
                    newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex', i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.appendChild(newSlide);
                }
            }
        }
        //reInit
        _this.reInit(true);
    };

    /*==================================================
        Make Swiper
    ====================================================*/
    function makeSwiper() {
        _this.calcSlides();
        if (params.loader.slides.length > 0 && _this.slides.length === 0) {
            _this.loadSlides();
        }
        if (params.loop) {
            _this.createLoop();
        }
        _this.init();
        initEvents();
        if (params.pagination) {
            _this.createPagination(true);
        }

        if (params.loop || params.initialSlide > 0) {
            _this.swipeTo(params.initialSlide, 0, false);
        }
        else {
            _this.updateActiveSlide(0);
        }
        if (params.autoplay) {
            _this.startAutoplay();
        }
        /**
         * Set center slide index.
         *
         * @author        Tomaz Lovrec <tomaz.lovrec@gmail.com>
         */
        _this.centerIndex = _this.activeIndex;

        // Callbacks
        if (params.onSwiperCreated) _this.fireCallback(params.onSwiperCreated, _this);
        _this.callPlugins('onSwiperCreated');
    }

    makeSwiper();
};

Swiper.prototype = {
    plugins : {},

    /*==================================================
        Wrapper Operations
    ====================================================*/
    wrapperTransitionEnd : function (callback, permanent) {
        'use strict';
        var a = this,
            el = a.wrapper,
            events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i;

        function fireCallBack(e) {
            if (e.target !== el) return;
            callback(a);
            if (a.params.queueEndCallbacks) a._queueEndCallbacks = false;
            if (!permanent) {
                for (i = 0; i < events.length; i++) {
                    a.h.removeEventListener(el, events[i], fireCallBack);
                }
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                a.h.addEventListener(el, events[i], fireCallBack);
            }
        }
    },

    getWrapperTranslate : function (axis) {
        'use strict';
        var el = this.wrapper,
            matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = this.params.mode === 'horizontal' ? 'x' : 'y';
        }

        if (this.support.transforms && this.params.useCSS3Transforms) {
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }

            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }
        }
        else {
            if (axis === 'x') curTransform = parseFloat(el.style.left, 10) || 0;
            if (axis === 'y') curTransform = parseFloat(el.style.top, 10) || 0;
        }
        return curTransform || 0;
    },

    setWrapperTranslate : function (x, y, z) {
        'use strict';
        var es = this.wrapper.style,
            coords = {x: 0, y: 0, z: 0},
            translate;

        // passed all coordinates
        if (arguments.length === 3) {
            coords.x = x;
            coords.y = y;
            coords.z = z;
        }

        // passed one coordinate and optional axis
        else {
            if (typeof y === 'undefined') {
                y = this.params.mode === 'horizontal' ? 'x' : 'y';
            }
            coords[y] = x;
        }

        if (this.support.transforms && this.params.useCSS3Transforms) {
            translate = this.support.transforms3d ? 'translate3d(' + coords.x + 'px, ' + coords.y + 'px, ' + coords.z + 'px)' : 'translate(' + coords.x + 'px, ' + coords.y + 'px)';
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translate;
        }
        else {
            es.left = coords.x + 'px';
            es.top  = coords.y + 'px';
        }
        this.callPlugins('onSetWrapperTransform', coords);
        if (this.params.onSetWrapperTransform) this.fireCallback(this.params.onSetWrapperTransform, this, coords);
    },

    setWrapperTransition : function (duration) {
        'use strict';
        var es = this.wrapper.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = (duration / 1000) + 's';
        this.callPlugins('onSetWrapperTransition', {duration: duration});
        if (this.params.onSetWrapperTransition) this.fireCallback(this.params.onSetWrapperTransition, this, duration);

    },

    /*==================================================
        Helpers
    ====================================================*/
    h : {
        getWidth: function (el, outer, round) {
            'use strict';
            var width = window.getComputedStyle(el, null).getPropertyValue('width');
            var returnWidth = parseFloat(width);
            //IE Fixes
            if (isNaN(returnWidth) || width.indexOf('%') > 0 || returnWidth < 0) {
                returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            }
            if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            if (round) return Math.ceil(returnWidth);
            else return returnWidth;
        },
        getHeight: function (el, outer, round) {
            'use strict';
            if (outer) return el.offsetHeight;

            var height = window.getComputedStyle(el, null).getPropertyValue('height');
            var returnHeight = parseFloat(height);
            //IE Fixes
            if (isNaN(returnHeight) || height.indexOf('%') > 0 || returnHeight < 0) {
                returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            }
            if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            if (round) return Math.ceil(returnHeight);
            else return returnHeight;
        },
        getOffset: function (el) {
            'use strict';
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop  = el.clientTop  || body.clientTop  || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop  = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            if (document.documentElement && !window.pageYOffset) {
                //IE7-8
                scrollTop  = document.documentElement.scrollTop;
                scrollLeft = document.documentElement.scrollLeft;
            }
            return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        },
        windowWidth : function () {
            'use strict';
            if (window.innerWidth) return window.innerWidth;
            else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
        },
        windowHeight : function () {
            'use strict';
            if (window.innerHeight) return window.innerHeight;
            else if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
        },
        windowScroll : function () {
            'use strict';
            if (typeof pageYOffset !== 'undefined') {
                return {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                };
            }
            else if (document.documentElement) {
                return {
                    left: document.documentElement.scrollLeft,
                    top: document.documentElement.scrollTop
                };
            }
        },

        addEventListener : function (el, event, listener, useCapture) {
            'use strict';
            if (typeof useCapture === 'undefined') {
                useCapture = false;
            }

            if (el.addEventListener) {
                el.addEventListener(event, listener, useCapture);
            }
            else if (el.attachEvent) {
                el.attachEvent('on' + event, listener);
            }
        },

        removeEventListener : function (el, event, listener, useCapture) {
            'use strict';
            if (typeof useCapture === 'undefined') {
                useCapture = false;
            }

            if (el.removeEventListener) {
                el.removeEventListener(event, listener, useCapture);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + event, listener);
            }
        }
    },
    setTransform : function (el, transform) {
        'use strict';
        var es = el.style;
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transform;
    },
    setTranslate : function (el, translate) {
        'use strict';
        var es = el.style;
        var pos = {
            x : translate.x || 0,
            y : translate.y || 0,
            z : translate.z || 0
        };
        var transformString = this.support.transforms3d ? 'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,' + (pos.z) + 'px)' : 'translate(' + (pos.x) + 'px,' + (pos.y) + 'px)';
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
        if (!this.support.transforms) {
            es.left = pos.x + 'px';
            es.top = pos.y + 'px';
        }
    },
    setTransition : function (el, duration) {
        'use strict';
        var es = el.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration + 'ms';
    },
    /*==================================================
        Feature Detection
    ====================================================*/
    support: {

        touch : (window.Modernizr && Modernizr.touch === true) || (function () {
            'use strict';
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        })(),

        transforms : (window.Modernizr && Modernizr.csstransforms === true) || (function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
        })(),

        transitions : (window.Modernizr && Modernizr.csstransitions === true) || (function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
        })(),

        classList : (function () {
            'use strict';
            var div = document.createElement('div');
            return 'classList' in div;
        })()
    },

    browser : {

        ie8 : (function () {
            'use strict';
            var rv = -1; // Return value assumes failure.
            if (navigator.appName === 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
                if (re.exec(ua) !== null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv !== -1 && rv < 9;
        })(),

        ie10 : window.navigator.msPointerEnabled,
        ie11 : window.navigator.pointerEnabled
    }
};

/*=========================
  jQuery & Zepto Plugins
  ===========================*/
if (window.jQuery || window.Zepto) {
    (function ($) {
        'use strict';
        $.fn.swiper = function (params) {
            var firstInstance;
            this.each(function (i) {
                var that = $(this);
                var s = new Swiper(that[0], params);
                if (!i) firstInstance = s;
                that.data('swiper', s);
            });
            return firstInstance;
        };
    })(window.jQuery || window.Zepto);
}

// CommonJS support
if (typeof(module) !== 'undefined') {
    module.exports = Swiper;

// requirejs support
} else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return Swiper;
    });
}

/*!
 * JavaScript Cookie v2.1.2
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


+ function ($) {
    'use strict';

	if ($('.googlemap').length) {
		(function(){
		var d="prototype";function e(a){this.set("fontFamily","sans-serif");this.set("fontSize",12);this.set("fontColor","#000000");this.set("strokeWeight",4);this.set("strokeColor","#ffffff");this.set("align","center");this.set("zIndex",1E3);this.setValues(a)}e.prototype=new google.maps.OverlayView;window.MapLabel=e;e[d].changed=function(a){switch(a){case "fontFamily":case "fontSize":case "fontColor":case "strokeWeight":case "strokeColor":case "align":case "text":return h(this);case "maxZoom":case "minZoom":case "position":return this.draw()}};
		function h(a){var b=a.a;if(b){var f=b.style;f.zIndex=a.get("zIndex");var c=b.getContext("2d");c.clearRect(0,0,b.width,b.height);c.strokeStyle=a.get("strokeColor");c.fillStyle=a.get("fontColor");c.font=a.get("fontSize")+"px "+a.get("fontFamily");var b=Number(a.get("strokeWeight")),g=a.get("text");if(g){if(b)c.lineWidth=b,c.strokeText(g,b,b);c.fillText(g,b,b);a:{c=c.measureText(g).width+b;switch(a.get("align")){case "left":a=0;break a;case "right":a=-c;break a}a=c/-2}f.marginLeft=a+"px";f.marginTop=
		"-0.4em"}}}e[d].onAdd=function(){var a=this.a=document.createElement("canvas");a.style.position="absolute";var b=a.getContext("2d");b.lineJoin="round";b.textBaseline="top";h(this);(b=this.getPanes())&&b.mapPane.appendChild(a)};e[d].onAdd=e[d].onAdd;
		e[d].draw=function(){var a=this.getProjection();if(a&&this.a){var b=this.get("position");if(b){b=a.fromLatLngToDivPixel(b);a=this.a.style;a.top=b.y+"px";a.left=b.x+"px";var b=this.get("minZoom"),f=this.get("maxZoom");if(b===void 0&&f===void 0)b="";else{var c=this.getMap();c?(c=c.getZoom(),b=c<b||c>f?"hidden":""):b=""}a.visibility=b}}};e[d].draw=e[d].draw;e[d].onRemove=function(){var a=this.a;a&&a.parentNode&&a.parentNode.removeChild(a)};e[d].onRemove=e[d].onRemove;})();
		(function(){var b=true,f=false;function g(a){var c=a||{};this.d=this.c=f;if(a.visible==undefined)a.visible=b;if(a.shadow==undefined)a.shadow="7px -3px 5px rgba(88,88,88,0.7)";if(a.anchor==undefined)a.anchor=i.BOTTOM;this.setValues(c)}g.prototype=new google.maps.OverlayView;window.mapMarker=g;g.prototype.getVisible=function(){return this.get("visible")};g.prototype.getVisible=g.prototype.getVisible;g.prototype.setVisible=function(a){this.set("visible",a)};g.prototype.setVisible=g.prototype.setVisible;
		g.prototype.s=function(){if(this.c){this.a.style.display=this.getVisible()?"":"none";this.draw()}};g.prototype.visible_changed=g.prototype.s;g.prototype.setFlat=function(a){this.set("flat",!!a)};g.prototype.setFlat=g.prototype.setFlat;g.prototype.getFlat=function(){return this.get("flat")};g.prototype.getFlat=g.prototype.getFlat;g.prototype.p=function(){return this.get("width")};g.prototype.getWidth=g.prototype.p;g.prototype.o=function(){return this.get("height")};g.prototype.getHeight=g.prototype.o;
		g.prototype.setShadow=function(a){this.set("shadow",a);this.g()};g.prototype.setShadow=g.prototype.setShadow;g.prototype.getShadow=function(){return this.get("shadow")};g.prototype.getShadow=g.prototype.getShadow;g.prototype.g=function(){if(this.c)this.a.style.boxShadow=this.a.style.webkitBoxShadow=this.a.style.MozBoxShadow=this.getFlat()?"":this.getShadow()};g.prototype.flat_changed=g.prototype.g;g.prototype.setZIndex=function(a){this.set("zIndex",a)};g.prototype.setZIndex=g.prototype.setZIndex;
		g.prototype.getZIndex=function(){return this.get("zIndex")};g.prototype.getZIndex=g.prototype.getZIndex;g.prototype.t=function(){if(this.getZIndex()&&this.c)this.a.style.zIndex=this.getZIndex()};g.prototype.zIndex_changed=g.prototype.t;g.prototype.getDraggable=function(){return this.get("draggable")};g.prototype.getDraggable=g.prototype.getDraggable;g.prototype.setDraggable=function(a){this.set("draggable",!!a)};g.prototype.setDraggable=g.prototype.setDraggable;
		g.prototype.k=function(){if(this.c)this.getDraggable()?j(this,this.a):k(this)};g.prototype.draggable_changed=g.prototype.k;g.prototype.getPosition=function(){return this.get("position")};g.prototype.getPosition=g.prototype.getPosition;g.prototype.setPosition=function(a){this.set("position",a)};g.prototype.setPosition=g.prototype.setPosition;g.prototype.q=function(){this.draw()};g.prototype.position_changed=g.prototype.q;g.prototype.l=function(){return this.get("anchor")};g.prototype.getAnchor=g.prototype.l;
		g.prototype.r=function(a){this.set("anchor",a)};g.prototype.setAnchor=g.prototype.r;g.prototype.n=function(){this.draw()};g.prototype.anchor_changed=g.prototype.n;function l(a,c){var d=document.createElement("DIV");d.innerHTML=c;if(d.childNodes.length==1)return d.removeChild(d.firstChild);else{for(var e=document.createDocumentFragment();d.firstChild;)e.appendChild(d.firstChild);return e}}function m(a,c){if(c)for(var d;d=c.firstChild;)c.removeChild(d)}
		g.prototype.setContent=function(a){this.set("content",a)};g.prototype.setContent=g.prototype.setContent;g.prototype.getContent=function(){return this.get("content")};g.prototype.getContent=g.prototype.getContent;
		g.prototype.j=function(){if(this.b){m(this,this.b);var a=this.getContent();if(a){if(typeof a=="string"){a=a.replace(/^\s*([\S\s]*)\b\s*$/,"$1");a=l(this,a)}this.b.appendChild(a);var c=this;a=this.b.getElementsByTagName("IMG");for(var d=0,e;e=a[d];d++){google.maps.event.addDomListener(e,"mousedown",function(h){if(c.getDraggable()){h.preventDefault&&h.preventDefault();h.returnValue=f}});google.maps.event.addDomListener(e,"load",function(){c.draw()})}google.maps.event.trigger(this,"domready")}this.c&&
		this.draw()}};g.prototype.content_changed=g.prototype.j;function n(a,c){if(a.c){var d="";if(navigator.userAgent.indexOf("Gecko/")!==-1){if(c=="dragging")d="-moz-grabbing";if(c=="dragready")d="-moz-grab"}else if(c=="dragging"||c=="dragready")d="move";if(c=="draggable")d="pointer";if(a.a.style.cursor!=d)a.a.style.cursor=d}}
		function o(a,c){if(a.getDraggable())if(!a.d){a.d=b;var d=a.getMap();a.m=d.get("draggable");d.set("draggable",f);a.h=c.clientX;a.i=c.clientY;n(a,"dragready");a.a.style.MozUserSelect="none";a.a.style.KhtmlUserSelect="none";a.a.style.WebkitUserSelect="none";a.a.unselectable="on";a.a.onselectstart=function(){return f};p(a);google.maps.event.trigger(a,"dragstart")}}
		function q(a){if(a.getDraggable())if(a.d){a.d=f;a.getMap().set("draggable",a.m);a.h=a.i=a.m=null;a.a.style.MozUserSelect="";a.a.style.KhtmlUserSelect="";a.a.style.WebkitUserSelect="";a.a.unselectable="off";a.a.onselectstart=function(){};r(a);n(a,"draggable");google.maps.event.trigger(a,"dragend");a.draw()}}
		function s(a,c){if(!a.getDraggable()||!a.d)q(a);else{var d=a.h-c.clientX,e=a.i-c.clientY;a.h=c.clientX;a.i=c.clientY;d=parseInt(a.a.style.left,10)-d;e=parseInt(a.a.style.top,10)-e;a.a.style.left=d+"px";a.a.style.top=e+"px";var h=t(a);a.setPosition(a.getProjection().fromDivPixelToLatLng(new google.maps.Point(d-h.width,e-h.height)));n(a,"dragging");google.maps.event.trigger(a,"drag")}}function k(a){if(a.f){google.maps.event.removeListener(a.f);delete a.f}n(a,"")}
		function j(a,c){if(c){a.f=google.maps.event.addDomListener(c,"mousedown",function(d){o(a,d)});n(a,"draggable")}}function p(a){if(a.a.setCapture){a.a.setCapture(b);a.e=[google.maps.event.addDomListener(a.a,"mousemove",function(c){s(a,c)},b),google.maps.event.addDomListener(a.a,"mouseup",function(){q(a);a.a.releaseCapture()},b)]}else a.e=[google.maps.event.addDomListener(window,"mousemove",function(c){s(a,c)},b),google.maps.event.addDomListener(window,"mouseup",function(){q(a)},b)]}
		function r(a){if(a.e){for(var c=0,d;d=a.e[c];c++)google.maps.event.removeListener(d);a.e.length=0}}
		function t(a){var c=a.l();if(typeof c=="object")return c;var d=new google.maps.Size(0,0);if(!a.b)return d;var e=a.b.offsetWidth;a=a.b.offsetHeight;switch(c){case i.TOP:d.width=-e/2;break;case i.TOP_RIGHT:d.width=-e;break;case i.LEFT:d.height=-a/2;break;case i.MIDDLE:d.width=-e/2;d.height=-a/2;break;case i.RIGHT:d.width=-e;d.height=-a/2;break;case i.BOTTOM_LEFT:d.height=-a;break;case i.BOTTOM:d.width=-e/2;d.height=-a;break;case i.BOTTOM_RIGHT:d.width=-e;d.height=-a}return d}
		g.prototype.onAdd=function(){if(!this.a){this.a=document.createElement("DIV");this.a.style.position="absolute"}if(this.getZIndex())this.a.style.zIndex=this.getZIndex();this.a.style.display=this.getVisible()?"":"none";if(!this.b){this.b=document.createElement("DIV");this.a.appendChild(this.b);var a=this;google.maps.event.addDomListener(this.b,"click",function(){google.maps.event.trigger(a,"click")});google.maps.event.addDomListener(this.b,"mouseover",function(){google.maps.event.trigger(a,"mouseover")});
		google.maps.event.addDomListener(this.b,"mouseout",function(){google.maps.event.trigger(a,"mouseout")})}this.c=b;this.j();this.g();this.k();var c=this.getPanes();c&&c.overlayImage.appendChild(this.a);google.maps.event.trigger(this,"ready")};g.prototype.onAdd=g.prototype.onAdd;
		g.prototype.draw=function(){if(!(!this.c||this.d)){var a=this.getProjection();if(a){var c=this.get("position");a=a.fromLatLngToDivPixel(c);c=t(this);this.a.style.top=a.y+c.height+"px";this.a.style.left=a.x+c.width+"px";a=this.b.offsetHeight;c=this.b.offsetWidth;c!=this.get("width")&&this.set("width",c);a!=this.get("height")&&this.set("height",a)}}};g.prototype.draw=g.prototype.draw;g.prototype.onRemove=function(){this.a&&this.a.parentNode&&this.a.parentNode.removeChild(this.a);k(this)};
		g.prototype.onRemove=g.prototype.onRemove;var i={TOP_LEFT:1,TOP:2,TOP_RIGHT:3,LEFT:4,MIDDLE:5,RIGHT:6,BOTTOM_LEFT:7,BOTTOM:8,BOTTOM_RIGHT:9};window.mapMarkerPosition=i;
		})();
	};

}(jQuery);
/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @version 1.2.0
 *
 * http://wenzhixin.net.cn/p/multiple-select/
 */

(function ($) {

    'use strict';

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    function MultipleSelect($el, options) {
        var that = this,
            name = $el.attr('name') || options.name || '';

        this.options = options;

        // hide select element
        this.$el = $el.hide();

        // label element
        this.$label = this.$el.closest('label') ||
            this.$el.attr('id') && $(sprintf('label[for="%s"]', this.$el.attr('id').replace(/:/g, '\\:')));

        // restore class and title from select element
        this.$parent = $(sprintf(
            '<div class="ms-parent %s" %s/>',
            $el.attr('class') || '',
            sprintf('title="%s"', $el.attr('title'))));

        // add placeholder to choice button
        this.$choice = $(sprintf([
                '<button type="button" class="ms-choice">',
                '<span class="placeholder">%s</span>',
                '<div></div>',
                '</button>'
            ].join(''),
            this.options.placeholder));

        // default position is bottom
        this.$drop = $(sprintf('<div class="ms-drop %s"%s></div>',
            this.options.position,
            sprintf(' style="width: %s"', this.options.dropWidth)));

        this.$el.after(this.$parent);
        this.$parent.append(this.$choice);
        this.$parent.append(this.$drop);

        if (this.$el.prop('disabled')) {
            this.$choice.addClass('disabled');
        }
        this.$parent.css('width',
            this.options.width ||
            this.$el.css('width') ||
            this.$el.outerWidth() + 20);

        this.selectAllName = 'data-name="selectAll' + name + '"';
        this.selectGroupName = 'data-name="selectGroup' + name + '"';
        this.selectItemName = 'data-name="selectItem' + name + '"';

        if (!this.options.keepOpen) {
            $(document).click(function (e) {
                if ($(e.target)[0] === that.$choice[0] ||
                    $(e.target).parents('.ms-choice')[0] === that.$choice[0]) {
                    return;
                }
                if (($(e.target)[0] === that.$drop[0] ||
                    $(e.target).parents('.ms-drop')[0] !== that.$drop[0] && e.target !== $el[0]) &&
                    that.options.isOpen) {
                    that.close();
                }
            });
        }
    }

    MultipleSelect.prototype = {
        constructor: MultipleSelect,

        init: function () {
            var that = this,
                $ul = $('<ul></ul>');

            this.$drop.html('');

            if (this.options.filter) {
                this.$drop.append([
                    '<div class="ms-search">',
                    '<input type="text" autocomplete="off" autocorrect="off" autocapitilize="off" spellcheck="false">',
                    '</div>'].join('')
                );
            }

            if (this.options.selectAll && !this.options.single) {
                $ul.append([
                    '<li class="ms-select-all">',
                    '<label>',
                    sprintf('<input type="checkbox" %s /> ', this.selectAllName),
                    this.options.selectAllDelimiter[0],
                    this.options.selectAllText,
                    this.options.selectAllDelimiter[1],
                    '</label>',
                    '</li>'
                ].join(''));
            }

            $.each(this.$el.children(), function (i, elm) {
                $ul.append(that.optionToHtml(i, elm));
            });
            $ul.append(sprintf('<li class="ms-no-results">%s</li>', this.options.noMatchesFound));
            this.$drop.append($ul);

            this.$drop.find('ul').css('max-height', this.options.maxHeight + 'px');
            this.$drop.find('.multiple').css('width', this.options.multipleWidth + 'px');

            this.$searchInput = this.$drop.find('.ms-search input');
            this.$selectAll = this.$drop.find('input[' + this.selectAllName + ']');
            this.$selectGroups = this.$drop.find('input[' + this.selectGroupName + ']');
            this.$selectItems = this.$drop.find('input[' + this.selectItemName + ']:enabled');
            this.$disableItems = this.$drop.find('input[' + this.selectItemName + ']:disabled');
            this.$noResults = this.$drop.find('.ms-no-results');

            this.events();
            this.updateSelectAll(true);
            this.update(true);

            if (this.options.isOpen) {
                this.open();
            }
        },

        optionToHtml: function (i, elm, group, groupDisabled) {
            var that = this,
                $elm = $(elm),
                classes = $elm.attr('class') || '',
                title = sprintf('title="%s"', $elm.attr('title')),
                multiple = this.options.multiple ? 'multiple' : '',
                disabled,
                type = this.options.single ? 'radio' : 'checkbox';

            if ($elm.is('option')) {
                var value = $elm.val(),
                    text = that.options.textTemplate($elm),
                    selected = $elm.prop('selected'),
                    style = sprintf('style="%s"', this.options.styler(value)),
                    $el;

                disabled = groupDisabled || $elm.prop('disabled');

                $el = $([
                    sprintf('<li class="%s %s" %s %s>', multiple, classes, title, style),
                    sprintf('<label class="%s">', disabled ? 'disabled' : ''),
                    sprintf('<input type="%s" %s%s%s%s>',
                        type, this.selectItemName,
                        selected ? ' checked="checked"' : '',
                        disabled ? ' disabled="disabled"' : '',
                        sprintf(' data-group="%s"', group)),
                    text,
                    '</label>',
                    '</li>'
                ].join(''));
                $el.find('input').val(value);
                return $el;
            }
            if ($elm.is('optgroup')) {
                var label = that.options.labelTemplate($elm),
                    $group = $('<div/>');

                group = 'group_' + i;
                disabled = $elm.prop('disabled');

                $group.append([
                    '<li class="group">',
                    sprintf('<label class="optgroup %s" data-group="%s">', disabled ? 'disabled' : '', group),
                    this.options.hideOptgroupCheckboxes || this.options.single ? '' :
                        sprintf('<input type="checkbox" %s %s>',
                        this.selectGroupName, disabled ? 'disabled="disabled"' : ''),
                    label,
                    '</label>',
                    '</li>'
                ].join(''));

                $.each($elm.children(), function (i, elm) {
                    $group.append(that.optionToHtml(i, elm, group, disabled));
                });
                return $group.html();
            }
        },

        events: function () {
            var that = this,
                toggleOpen = function (e) {
                    e.preventDefault();
                    that[that.options.isOpen ? 'close' : 'open']();
                };

            if (this.$label) {
                this.$label.off('click').on('click', function (e) {
                    if (e.target.nodeName.toLowerCase() !== 'label' || e.target !== this) {
                        return;
                    }
                    toggleOpen(e);
                    if (!that.options.filter || !that.options.isOpen) {
                        that.focus();
                    }
                    e.stopPropagation(); // Causes lost focus otherwise
                });
            }

            this.$choice.off('click').on('click', toggleOpen)
                .off('focus').on('focus', this.options.onFocus)
                .off('blur').on('blur', this.options.onBlur);

            this.$parent.off('keydown').on('keydown', function (e) {
                switch (e.which) {
                    case 27: // esc key
                        that.close();
                        that.$choice.focus();
                        break;
                }
            });

            this.$searchInput.off('keydown').on('keydown',function (e) {
                // Ensure shift-tab causes lost focus from filter as with clicking away
                if (e.keyCode === 9 && e.shiftKey) {
                    that.close();
                }
            }).off('keyup').on('keyup', function (e) {
                // enter or space
                // Avoid selecting/deselecting if no choices made
                if (that.options.filterAcceptOnEnter && (e.which === 13 || e.which == 32) && that.$searchInput.val()) {
                    that.$selectAll.click();
                    that.close();
                    that.focus();
                    return;
                }
                that.filter();
            });

            this.$selectAll.off('click').on('click', function () {
                var checked = $(this).prop('checked'),
                    $items = that.$selectItems.filter(':visible');

                if ($items.length === that.$selectItems.length) {
                    that[checked ? 'checkAll' : 'uncheckAll']();
                } else { // when the filter option is true
                    that.$selectGroups.prop('checked', checked);
                    $items.prop('checked', checked);
                    that.options[checked ? 'onCheckAll' : 'onUncheckAll']();
                    that.update();
                }
            });
            this.$selectGroups.off('click').on('click', function () {
                var group = $(this).parent().attr('data-group'),
                    $items = that.$selectItems.filter(':visible'),
                    $children = $items.filter(sprintf('[data-group="%s"]', group)),
                    checked = $children.length !== $children.filter(':checked').length;

                $children.prop('checked', checked);
                that.updateSelectAll();
                that.update();
                that.options.onOptgroupClick({
                    label: $(this).parent().text(),
                    checked: checked,
                    children: $children.get(),
                    instance: that
                });
            });
            this.$selectItems.off('click').on('click', function () {
                that.updateSelectAll();
                that.update();
                that.updateOptGroupSelect();
                that.options.onClick({
                    label: $(this).parent().text(),
                    value: $(this).val(),
                    checked: $(this).prop('checked'),
                    instance: that
                });

                if (that.options.single && that.options.isOpen && !that.options.keepOpen) {
                    that.close();
                }

                if (that.options.single) {
                    var clickedVal = $(this).val();
                    that.$selectItems.filter(function() {
                        return $(this).val() !== clickedVal;
                    }).each(function() {
                        $(this).prop('checked', false);
                    });
                    that.update();
                }
            });
        },

        open: function () {
            if (this.$choice.hasClass('disabled')) {
                return;
            }
            this.options.isOpen = true;
            this.$choice.find('>div').addClass('open');
            this.$drop[this.animateMethod('show')]();

            // fix filter bug: no results show
            this.$selectAll.parent().show();
            this.$noResults.hide();

            // Fix #77: 'All selected' when no options
            if (!this.$el.children().length) {
                this.$selectAll.parent().hide();
                this.$noResults.show();
            }

            if (this.options.container) {
                var offset = this.$drop.offset();
                this.$drop.appendTo($(this.options.container));
                this.$drop.offset({
                    top: offset.top,
                    left: offset.left
                });
            }

            if (this.options.filter) {
                this.$searchInput.val('');
                this.$searchInput.focus();
                this.filter();
            }
            this.options.onOpen();
        },

        close: function () {
            this.options.isOpen = false;
            this.$choice.find('>div').removeClass('open');
            this.$drop[this.animateMethod('hide')]();
            if (this.options.container) {
                this.$parent.append(this.$drop);
                this.$drop.css({
                    'top': 'auto',
                    'left': 'auto'
                });
            }
            this.options.onClose();
        },

        animateMethod: function (method) {
            var methods = {
                show: {
                    fade: 'fadeIn',
                    slide: 'slideDown'
                },
                hide: {
                    fade: 'fadeOut',
                    slide: 'slideUp'
                }
            };

            return methods[method][this.options.animate] || method;
        },

        update: function (isInit) {
            var selects = this.options.displayValues ? this.getSelects() : this.getSelects('text'),
                $span = this.$choice.find('>span'),
                sl = selects.length;

            if (sl === 0) {
                $span.addClass('placeholder').html(this.options.placeholder);
            } else if (this.options.allSelected && sl === this.$selectItems.length + this.$disableItems.length) {
                $span.removeClass('placeholder').html(this.options.allSelected);
            } else if (this.options.ellipsis && sl > this.options.minimumCountSelected) {
                $span.removeClass('placeholder').text(selects.slice(0, this.options.minimumCountSelected)
                    .join(this.options.delimiter) + '...');
            } else if (this.options.countSelected && sl > this.options.minimumCountSelected) {
                $span.removeClass('placeholder').html(this.options.countSelected
                    .replace('#', selects.length)
                    .replace('%', this.$selectItems.length + this.$disableItems.length));
            } else {
                $span.removeClass('placeholder').text(selects.join(this.options.delimiter));
            }

            if (this.options.addTitle) {
                $span.prop('title', this.getSelects('text'));
            }

            // set selects to select
            this.$el.val(this.getSelects()).trigger('change');

            // add selected class to selected li
            this.$drop.find('li').removeClass('selected');
            this.$drop.find(sprintf('input[%s]:checked', this.selectItemName)).each(function () {
                $(this).parents('li').first().addClass('selected');
            });

            // trigger <select> change event
            if (!isInit) {
                this.$el.trigger('change');
            }
        },

        updateSelectAll: function (isInit) {
            var $items = this.$selectItems;

            if (!isInit) {
                $items = $items.filter(':visible');
            }
            this.$selectAll.prop('checked', $items.length &&
                $items.length === $items.filter(':checked').length);
            if (!isInit && this.$selectAll.prop('checked')) {
                this.options.onCheckAll();
            }
        },

        updateOptGroupSelect: function () {
            var $items = this.$selectItems.filter(':visible');
            $.each(this.$selectGroups, function (i, val) {
                var group = $(val).parent().attr('data-group'),
                    $children = $items.filter(sprintf('[data-group="%s"]', group));
                $(val).prop('checked', $children.length &&
                    $children.length === $children.filter(':checked').length);
            });
        },

        //value or text, default: 'value'
        getSelects: function (type) {
            var that = this,
                texts = [],
                values = [];
            this.$drop.find(sprintf('input[%s]:checked', this.selectItemName)).each(function () {
                texts.push($(this).parents('li').first().text());
                values.push($(this).val());
            });

            if (type === 'text' && this.$selectGroups.length) {
                texts = [];
                this.$selectGroups.each(function () {
                    var html = [],
                        text = $.trim($(this).parent().text()),
                        group = $(this).parent().data('group'),
                        $children = that.$drop.find(sprintf('[%s][data-group="%s"]', that.selectItemName, group)),
                        $selected = $children.filter(':checked');

                    if (!$selected.length) {
                        return;
                    }

                    html.push('[');
                    html.push(text);
                    if ($children.length > $selected.length) {
                        var list = [];
                        $selected.each(function () {
                            list.push($(this).parent().text());
                        });
                        html.push(': ' + list.join(', '));
                    }
                    html.push(']');
                    texts.push(html.join(''));
                });
            }
            return type === 'text' ? texts : values;
        },

        setSelects: function (values) {
            var that = this;
            this.$selectItems.prop('checked', false);
            $.each(values, function (i, value) {
                that.$selectItems.filter(sprintf('[value="%s"]', value)).prop('checked', true);
            });
            this.$selectAll.prop('checked', this.$selectItems.length ===
                this.$selectItems.filter(':checked').length);

            $.each(that.$selectGroups, function (i, val) {
                var group = $(val).parent().attr('data-group'),
                    $children = that.$selectItems.filter('[data-group="' + group + '"]');
                $(val).prop('checked', $children.length &&
                    $children.length === $children.filter(':checked').length);
            });

            this.update();
        },

        enable: function () {
            this.$choice.removeClass('disabled');
        },

        disable: function () {
            this.$choice.addClass('disabled');
        },

        checkAll: function () {
            this.$selectItems.prop('checked', true);
            this.$selectGroups.prop('checked', true);
            this.$selectAll.prop('checked', true);
            this.update();
            this.options.onCheckAll();
        },

        uncheckAll: function () {
            this.$selectItems.prop('checked', false);
            this.$selectGroups.prop('checked', false);
            this.$selectAll.prop('checked', false);
            this.update();
            this.options.onUncheckAll();
        },

        focus: function () {
            this.$choice.focus();
            this.options.onFocus();
        },

        blur: function () {
            this.$choice.blur();
            this.options.onBlur();
        },

        refresh: function () {
            this.init();
        },

        filter: function () {
            var that = this,
                text = $.trim(this.$searchInput.val()).toLowerCase();

            if (text.length === 0) {
                this.$selectAll.parent().show();
                this.$selectItems.parent().show();
                this.$disableItems.parent().show();
                this.$selectGroups.parent().show();
                this.$noResults.hide();
            } else {
                this.$selectItems.each(function () {
                    var $parent = $(this).parent();
                    $parent[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
                });
                this.$disableItems.parent().hide();
                this.$selectGroups.each(function () {
                    var $parent = $(this).parent();
                    var group = $parent.attr('data-group'),
                        $items = that.$selectItems.filter(':visible');
                    $parent[$items.filter(sprintf('[data-group="%s"]', group)).length ? 'show' : 'hide']();
                });

                //Check if no matches found
                if (this.$selectItems.parent().filter(':visible').length) {
                    this.$selectAll.parent().show();
                    this.$noResults.hide();
                } else {
                    this.$selectAll.parent().hide();
                    this.$noResults.show();
                }
            }
            this.updateOptGroupSelect();
            this.updateSelectAll();
            this.options.onFilter(text);
        }
    };

    $.fn.multipleSelect = function () {
        var option = arguments[0],
            args = arguments,

            value,
            allowedMethods = [
                'getSelects', 'setSelects',
                'enable', 'disable',
                'open', 'close',
                'checkAll', 'uncheckAll',
                'focus', 'blur',
                'refresh', 'close'
            ];

        this.each(function () {
            var $this = $(this),
                data = $this.data('multipleSelect'),
                options = $.extend({}, $.fn.multipleSelect.defaults,
                    $this.data(), typeof option === 'object' && option);

            if (!data) {
                data = new MultipleSelect($this, options);
                $this.data('multipleSelect', data);
            }

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw 'Unknown method: ' + option;
                }
                value = data[option](args[1]);
            } else {
                data.init();
                if (args[1]) {
                    value = data[args[1]].apply(data, [].slice.call(args, 2));
                }
            }
        });

        return typeof value !== 'undefined' ? value : this;
    };

    $.fn.multipleSelect.defaults = {
        name: '',
        isOpen: false,
        placeholder: '',
        selectAll: true,
        selectAllDelimiter: ['[', ']'],
        minimumCountSelected: 3,
        ellipsis: false,
        multiple: false,
        multipleWidth: 80,
        single: false,
        filter: false,
        width: undefined,
        dropWidth: undefined,
        maxHeight: 250,
        container: null,
        position: 'bottom',
        keepOpen: false,
        animate: 'none', // 'none', 'fade', 'slide'
        displayValues: false,
        delimiter: ', ',
        addTitle: false,
        filterAcceptOnEnter: false,
        hideOptgroupCheckboxes: false,

        selectAllText: 'Select all',
        allSelected: 'All selected',
        countSelected: '# of % selected',
        noMatchesFound: 'No matches found',

        styler: function () {
            return false;
        },
        textTemplate: function ($elm) {
            return $elm.text();
        },
        labelTemplate: function ($elm) {
            return $elm.attr('label');
        },

        onOpen: function () {
            return false;
        },
        onClose: function () {
            return false;
        },
        onCheckAll: function () {
            return false;
        },
        onUncheckAll: function () {
            return false;
        },
        onFocus: function () {
            return false;
        },
        onBlur: function () {
            return false;
        },
        onOptgroupClick: function () {
            return false;
        },
        onClick: function () {
            return false;
        },
        onFilter: function () {
            return false;
        }
    };
})(jQuery);

/*
 *  jQuery OwlCarousel v1.3.3
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));
/**
 * jQuery prettySocial: Use custom social share buttons
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

(function ($) {
    'use strict';

    $.fn.prettySocial = function () {
        /**
         * Supported social sites
         * @type {Object}
         */
        var _sites = {
                pinterest: {
                    url: 'http://pinterest.com/pin/create/button/?url={{url}}&media={{media}}&description={{description}}',
                    popup: {
                        width: 685,
                        height: 500
                    }
                },
                facebook: {
                    url: 'https://www.facebook.com/sharer/sharer.php?s=100&p[title]={{title}}&p[summary]={{description}}&p[url]={{url}}&p[images][0]={{media}}',
                    popup: {
                        width: 626,
                        height: 436
                    }
                },
                twitter: {
                    url: 'https://twitter.com/share?url={{url}}&via={{via}}&text={{description}}',
                    popup: {
                        width: 685,
                        height: 500
                    }
                },
                googleplus: {
                    url: 'https://plus.google.com/share?url={{url}}',
                    popup: {
                        width: 600,
                        height: 600
                    }
                },
                linkedin: {
                    url: 'https://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{description}}+&source={{via}}',
                    popup: {
                        width: 600,
                        height: 600
                    }
                }
            },

            /**
             * Pop-up window
             * This method is only used on desktop browsers
             * @param  {Object} site Selected social site
             * @param  {String} url  Fixed URL to open
             */
            _popup = function (site, url) {
                // center window
                var left = (window.innerWidth/2) - (site.popup.width/2),
                    top = (window.innerHeight/2) - (site.popup.height/2);

                return window.open(url, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + site.popup.width + ', height=' + site.popup.height + ', top=' + top + ', left=' + left);
            },

            /**
             * Prepare link based on social sites
             * @param  {Object} site Selected social site
             * @param  {Object} link Link with variables
             * @return {String}      Polished link based on the social site template
             */
            _linkFix = function (site, link) {
                // replace template url
                var url = site.url.replace(/{{url}}/g, encodeURIComponent(link.url))
                                  .replace(/{{title}}/g, encodeURIComponent(link.title))
                                  .replace(/{{description}}/g, encodeURIComponent(link.description))
                                  .replace(/{{media}}/g, encodeURIComponent(link.media))
                                  .replace(/{{via}}/g, encodeURIComponent(link.via));

                return url;
            };

        return this.each(function() {

            // declare $(this) as variable
            var $this = $(this);

            // link type
            var type = $this.data('type'),

                // set site
                site = _sites[type] || null;

            // check if social site is selected
            if (!site) {
                $.error('Social site is not set.');
            }

            // gather link info
            var link = {
                url: $this.data('url') || '',
                title: $this.data('title') || '',
                description: $this.data('description') || '',
                media: $this.data('media') || '',
                via: $this.data('via') || ''
            };

            // prepare link
            var url = _linkFix(site, link);

            // if not, set click trigger
            if (navigator.userAgent.match(/Android|IEMobile|BlackBerry|iPhone|iPad|iPod|Opera Mini/i)) {
                $this
                .bind('touchstart', function (e) {
                    if(e.originalEvent.touches.length > 1) {
                        return;
                    }

                    $this.data('touchWithoutScroll', true);
                })
                .bind('touchmove', function () {
                    $this.data('touchWithoutScroll', false);

                    return;
                }).bind('touchend', function (e) {
                    e.preventDefault();

                    var touchWithoutScroll = $this.data('touchWithoutScroll');

                    if (e.originalEvent.touches.length > 1 || !touchWithoutScroll) {
                        return;
                    }

                    // call popup window
                    _popup(site, url);
                });
            } else {
                $this.bind('click', function (e) {
                    e.preventDefault();

                    // call popup window
                    _popup(site, url);
                });
            }
        });
    };

})(jQuery);
/* Respond.js: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function( w ){

	"use strict";

	//exposed namespace
	var respond = {};
	w.respond = respond;

	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update = function(){};

	//define ajax obj
	var requestQueue = [],
		xmlHttp = (function() {
			var xmlhttpmethod = false;
			try {
				xmlhttpmethod = new w.XMLHttpRequest();
			}
			catch( e ){
				xmlhttpmethod = new w.ActiveXObject( "Microsoft.XMLHTTP" );
			}
			return function(){
				return xmlhttpmethod;
			};
		})(),

		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xmlHttp();
			if (!req){
				return;
			}
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.readyState !== 4 || req.status !== 200 && req.status !== 304 ){
					return;
				}
				callback( req.responseText );
			};
			if ( req.readyState === 4 ){
				return;
			}
			req.send( null );
		},
		isUnsupportedMediaQuery = function( query ) {
			return query.replace( respond.regex.minmaxwh, '' ).match( respond.regex.other );
		};

	//expose for testing
	respond.ajax = ajax;
	respond.queue = requestQueue;
	respond.unsupportedmq = isUnsupportedMediaQuery;
	respond.regex = {
		media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
		keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
		comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
		urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
		findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
		only: /(only\s+)?([a-zA-Z]+)\s?/,
		minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
		other: /\([^\)]*\)/g
	};

	//expose media query support flag for external use
	respond.mediaQueriesSupported = w.matchMedia && w.matchMedia( "only all" ) !== null && w.matchMedia( "only all" ).matches;

	//if media queries are supported, exit here
	if( respond.mediaQueriesSupported ){
		return;
	}

	//define vars
	var doc = w.document,
		docElem = doc.documentElement,
		mediastyles = [],
		rules = [],
		appendedEls = [],
		parsedSheets = {},
		resizeThrottle = 30,
		head = doc.getElementsByTagName( "head" )[0] || docElem,
		base = doc.getElementsByTagName( "base" )[0],
		links = head.getElementsByTagName( "link" ),

		lastCall,
		resizeDefer,

		//cached container for 1em value, populated the first time it's needed
		eminpx,

		// returns the value of 1em in pixels
		getEmValue = function() {
			var ret,
				div = doc.createElement('div'),
				body = doc.body,
				originalHTMLFontSize = docElem.style.fontSize,
				originalBodyFontSize = body && body.style.fontSize,
				fakeUsed = false;

			div.style.cssText = "position:absolute;font-size:1em;width:1em";

			if( !body ){
				body = fakeUsed = doc.createElement( "body" );
				body.style.background = "none";
			}

			// 1em in a media query is the value of the default font size of the browser
			// reset docElem and body to ensure the correct value is returned
			docElem.style.fontSize = "100%";
			body.style.fontSize = "100%";

			body.appendChild( div );

			if( fakeUsed ){
				docElem.insertBefore( body, docElem.firstChild );
			}

			ret = div.offsetWidth;

			if( fakeUsed ){
				docElem.removeChild( body );
			}
			else {
				body.removeChild( div );
			}

			// restore the original values
			docElem.style.fontSize = originalHTMLFontSize;
			if( originalBodyFontSize ) {
				body.style.fontSize = originalBodyFontSize;
			}


			//also update eminpx before returning
			ret = eminpx = parseFloat(ret);

			return ret;
		},

		//enable/disable styles
		applyMedia = function( fromResize ){
			var name = "clientWidth",
				docElemProp = docElem[ name ],
				currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp,
				styleBlocks	= {},
				lastLink = links[ links.length-1 ],
				now = (new Date()).getTime();

			//throttle resize calls
			if( fromResize && lastCall && now - lastCall < resizeThrottle ){
				w.clearTimeout( resizeDefer );
				resizeDefer = w.setTimeout( applyMedia, resizeThrottle );
				return;
			}
			else {
				lastCall = now;
			}

			for( var i in mediastyles ){
				if( mediastyles.hasOwnProperty( i ) ){
					var thisstyle = mediastyles[ i ],
						min = thisstyle.minw,
						max = thisstyle.maxw,
						minnull = min === null,
						maxnull = max === null,
						em = "em";

					if( !!min ){
						min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}
					if( !!max ){
						max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}

					// if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
					if( !thisstyle.hasquery || ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max ) ){
						if( !styleBlocks[ thisstyle.media ] ){
							styleBlocks[ thisstyle.media ] = [];
						}
						styleBlocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
					}
				}
			}

			//remove any existing respond style element(s)
			for( var j in appendedEls ){
				if( appendedEls.hasOwnProperty( j ) ){
					if( appendedEls[ j ] && appendedEls[ j ].parentNode === head ){
						head.removeChild( appendedEls[ j ] );
					}
				}
			}
			appendedEls.length = 0;

			//inject active styles, grouped by media type
			for( var k in styleBlocks ){
				if( styleBlocks.hasOwnProperty( k ) ){
					var ss = doc.createElement( "style" ),
						css = styleBlocks[ k ].join( "\n" );

					ss.type = "text/css";
					ss.media = k;

					//originally, ss was appended to a documentFragment and sheets were appended in bulk.
					//this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
					head.insertBefore( ss, lastLink.nextSibling );

					if ( ss.styleSheet ){
						ss.styleSheet.cssText = css;
					}
					else {
						ss.appendChild( doc.createTextNode( css ) );
					}

					//push to appendedEls to track for later removal
					appendedEls.push( ss );
				}
			}
		},
		//find media blocks in css text, convert to style blocks
		translate = function( styles, href, media ){
			var qs = styles.replace( respond.regex.comments, '' )
					.replace( respond.regex.keyframes, '' )
					.match( respond.regex.media ),
				ql = qs && qs.length || 0;

			//try to get CSS path
			href = href.substring( 0, href.lastIndexOf( "/" ) );

			var repUrls = function( css ){
					return css.replace( respond.regex.urls, "$1" + href + "$2$3" );
				},
				useMedia = !ql && media;

			//if path exists, tack on trailing slash
			if( href.length ){ href += "/"; }

			//if no internal queries exist, but media attr does, use that
			//note: this currently lacks support for situations where a media attr is specified on a link AND
				//its associated stylesheet has internal CSS media queries.
				//In those cases, the media attribute will currently be ignored.
			if( useMedia ){
				ql = 1;
			}

			for( var i = 0; i < ql; i++ ){
				var fullq, thisq, eachq, eql;

				//media attr
				if( useMedia ){
					fullq = media;
					rules.push( repUrls( styles ) );
				}
				//parse for styles
				else{
					fullq = qs[ i ].match( respond.regex.findStyles ) && RegExp.$1;
					rules.push( RegExp.$2 && repUrls( RegExp.$2 ) );
				}

				eachq = fullq.split( "," );
				eql = eachq.length;

				for( var j = 0; j < eql; j++ ){
					thisq = eachq[ j ];

					if( isUnsupportedMediaQuery( thisq ) ) {
						continue;
					}

					mediastyles.push( {
						media : thisq.split( "(" )[ 0 ].match( respond.regex.only ) && RegExp.$2 || "all",
						rules : rules.length - 1,
						hasquery : thisq.indexOf("(") > -1,
						minw : thisq.match( respond.regex.minw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
						maxw : thisq.match( respond.regex.maxw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" )
					} );
				}
			}

			applyMedia();
		},

		//recurse through request queue, get css text
		makeRequests = function(){
			if( requestQueue.length ){
				var thisRequest = requestQueue.shift();

				ajax( thisRequest.href, function( styles ){
					translate( styles, thisRequest.href, thisRequest.media );
					parsedSheets[ thisRequest.href ] = true;

					// by wrapping recursive function call in setTimeout
					// we prevent "Stack overflow" error in IE7
					w.setTimeout(function(){ makeRequests(); },0);
				} );
			}
		},

		//loop stylesheets, send text content to translate
		ripCSS = function(){

			for( var i = 0; i < links.length; i++ ){
				var sheet = links[ i ],
				href = sheet.href,
				media = sheet.media,
				isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";

				//only links plz and prevent re-parsing
				if( !!href && isCSS && !parsedSheets[ href ] ){
					// selectivizr exposes css through the rawCssText expando
					if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
						translate( sheet.styleSheet.rawCssText, href, media );
						parsedSheets[ href ] = true;
					} else {
						if( (!/^([a-zA-Z:]*\/\/)/.test( href ) && !base) ||
							href.replace( RegExp.$1, "" ).split( "/" )[0] === w.location.host ){
							// IE7 doesn't handle urls that start with '//' for ajax request
							// manually add in the protocol
							if ( href.substring(0,2) === "//" ) { href = w.location.protocol + href; }
							requestQueue.push( {
								href: href,
								media: media
							} );
						}
					}
				}
			}
			makeRequests();
		};

	//translate CSS
	ripCSS();

	//expose update for re-running respond later on
	respond.update = ripCSS;

	//expose getEmValue
	respond.getEmValue = getEmValue;

	//adjust on resize
	function callMedia(){
		applyMedia( true );
	}

	if( w.addEventListener ){
		w.addEventListener( "resize", callMedia, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onresize", callMedia );
	}
})(this);
/*! Tablesaw - v2.0.2 - 2015-10-28
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2015 Filament Group; Licensed  */
/*
* tablesaw: A set of plugins for responsive tables
* Stack and Column Toggle tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

if( typeof Tablesaw === "undefined" ) {
	Tablesaw = {
		i18n: {
			modes: [ 'Stack', 'Swipe', 'Toggle' ],
			columns: 'Col<span class=\"a11y-sm\">umn</span>s',
			columnBtnText: 'Columns',
			columnsDialogError: 'No eligible columns.',
			sort: 'Sort'
		},
		// cut the mustard
		mustard: 'querySelector' in document &&
			( !window.blackberry || window.WebKitPoint ) &&
			!window.operamini
	};
}
if( !Tablesaw.config ) {
	Tablesaw.config = {};
}
if( Tablesaw.mustard ) {
	jQuery( document.documentElement ).addClass( 'tablesaw-enhanced' );
}

;(function( $ ) {
	var pluginName = "table",
		classes = {
			toolbar: "tablesaw-bar"
		},
		events = {
			create: "tablesawcreate",
			destroy: "tablesawdestroy",
			refresh: "tablesawrefresh"
		},
		defaultMode = "stack",
		initSelector = "table[data-tablesaw-mode],table[data-tablesaw-sortable]";

	var Table = function( element ) {
		if( !element ) {
			throw new Error( "Tablesaw requires an element." );
		}

		this.table = element;
		this.$table = $( element );

		this.mode = this.$table.attr( "data-tablesaw-mode" ) || defaultMode;

		this.init();
	};

	Table.prototype.init = function() {
		// assign an id if there is none
		if ( !this.$table.attr( "id" ) ) {
			this.$table.attr( "id", pluginName + "-" + Math.round( Math.random() * 10000 ) );
		}

		this.createToolbar();

		var colstart = this._initCells();

		this.$table.trigger( events.create, [ this, colstart ] );
	};

	Table.prototype._initCells = function() {
		var colstart,
			thrs = this.table.querySelectorAll( "thead tr" ),
			self = this;

		$( thrs ).each( function(){
			var coltally = 0;

			$( this ).children().each( function(){
				var span = parseInt( this.getAttribute( "colspan" ), 10 ),
					sel = ":nth-child(" + ( coltally + 1 ) + ")";

				colstart = coltally + 1;

				if( span ){
					for( var k = 0; k < span - 1; k++ ){
						coltally++;
						sel += ", :nth-child(" + ( coltally + 1 ) + ")";
					}
				}

				// Store "cells" data on header as a reference to all cells in the same column as this TH
				this.cells = self.$table.find("tr").not( thrs[0] ).not( this ).children().filter( sel );
				coltally++;
			});
		});

		return colstart;
	};

	Table.prototype.refresh = function() {
		this._initCells();

		this.$table.trigger( events.refresh );
	};

	Table.prototype.createToolbar = function() {
		// Insert the toolbar
		// TODO move this into a separate component
		var $toolbar = this.$table.prev().filter( '.' + classes.toolbar );
		if( !$toolbar.length ) {
			$toolbar = $( '<div>' )
				.addClass( classes.toolbar )
				.insertBefore( this.$table );
		}
		this.$toolbar = $toolbar;

		if( this.mode ) {
			this.$toolbar.addClass( 'mode-' + this.mode );
		}
	};

	Table.prototype.destroy = function() {
		// Don’t remove the toolbar. Some of the table features are not yet destroy-friendly.
		this.$table.prev().filter( '.' + classes.toolbar ).each(function() {
			this.className = this.className.replace( /\bmode\-\w*\b/gi, '' );
		});

		var tableId = this.$table.attr( 'id' );
		$( document ).unbind( "." + tableId );
		$( window ).unbind( "." + tableId );

		// other plugins
		this.$table.trigger( events.destroy, [ this ] );

		this.$table.removeAttr( 'data-tablesaw-mode' );

		this.$table.removeData( pluginName );
	};

	// Collection method.
	$.fn[ pluginName ] = function() {
		return this.each( function() {
			var $t = $( this );

			if( $t.data( pluginName ) ){
				return;
			}

			var table = new Table( this );
			$t.data( pluginName, table );
		});
	};

	$( document ).on( "enhance.tablesaw", function( e ) {
		// Cut the mustard
		if( Tablesaw.mustard ) {
			$( e.target ).find( initSelector )[ pluginName ]();
		}
	});

}( jQuery ));

;(function( win, $, undefined ){

	var classes = {
		stackTable: 'tablesaw-stack',
		cellLabels: 'tablesaw-cell-label',
		cellContentLabels: 'tablesaw-cell-content'
	};

	var data = {
		obj: 'tablesaw-stack'
	};

	var attrs = {
		labelless: 'data-tablesaw-no-labels',
		hideempty: 'data-tablesaw-hide-empty'
	};

	var Stack = function( element ) {

		this.$table = $( element );

		this.labelless = this.$table.is( '[' + attrs.labelless + ']' );
		this.hideempty = this.$table.is( '[' + attrs.hideempty + ']' );

		if( !this.labelless ) {
			// allHeaders references headers, plus all THs in the thead, which may include several rows, or not
			this.allHeaders = this.$table.find( "th" );
		}

		this.$table.data( data.obj, this );
	};

	Stack.prototype.init = function( colstart ) {
		this.$table.addClass( classes.stackTable );

		if( this.labelless ) {
			return;
		}

		// get headers in reverse order so that top-level headers are appended last
		var reverseHeaders = $( this.allHeaders );
		var hideempty = this.hideempty;
		
		// create the hide/show toggles
		reverseHeaders.each(function(){
			var $t = $( this ),
				$cells = $( this.cells ).filter(function() {
					return !$( this ).parent().is( "[" + attrs.labelless + "]" ) && ( !hideempty || !$( this ).is( ":empty" ) );
				}),
				hierarchyClass = $cells.not( this ).filter( "thead th" ).length && " tablesaw-cell-label-top",
				// TODO reduce coupling with sortable
				$sortableButton = $t.find( ".tablesaw-sortable-btn" ),
				html = $sortableButton.length ? $sortableButton.html() : $t.html();

			if( html !== "" ){
				if( hierarchyClass ){
					var iteration = parseInt( $( this ).attr( "colspan" ), 10 ),
						filter = "";

					if( iteration ){
						filter = "td:nth-child("+ iteration +"n + " + ( colstart ) +")";
					}
					$cells.filter( filter ).prepend( "<b class='" + classes.cellLabels + hierarchyClass + "'>" + html + "</b>"  );
				} else {
					$cells.wrapInner( "<span class='" + classes.cellContentLabels + "'></span>" );
					$cells.prepend( "<b class='" + classes.cellLabels + "'>" + html + "</b>"  );
				}
			}
		});
	};

	Stack.prototype.destroy = function() {
		this.$table.removeClass( classes.stackTable );
		this.$table.find( '.' + classes.cellLabels ).remove();
		this.$table.find( '.' + classes.cellContentLabels ).each(function() {
			$( this ).replaceWith( this.childNodes );
		});
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, Tablesaw, colstart ){
		if( Tablesaw.mode === 'stack' ){
			var table = new Stack( Tablesaw.table );
			table.init( colstart );
		}

	} );

	$( document ).on( "tablesawdestroy", function( e, Tablesaw ){

		if( Tablesaw.mode === 'stack' ){
			$( Tablesaw.table ).data( data.obj ).destroy();
		}

	} );

}( this, jQuery ));
;(function( $ ) {
	var pluginName = "tablesawbtn",
		methods = {
			_create: function(){
				return $( this ).each(function() {
					$( this )
						.trigger( "beforecreate." + pluginName )
						[ pluginName ]( "_init" )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var oEl = $( this ),
					sel = this.getElementsByTagName( "select" )[ 0 ];

				if( sel ) {
					$( this )
						.addClass( "btn-select" )
						[ pluginName ]( "_select", sel );
				}
				return oEl;
			},
			_select: function( sel ) {
				var update = function( oEl, sel ) {
					var opts = $( sel ).find( "option" ),
						label, el, children;

					opts.each(function() {
						var opt = this;
						if( opt.selected ) {
							label = document.createTextNode( opt.text );
						}
					});

					children = oEl.childNodes;
					if( opts.length > 0 ){
						for( var i = 0, l = children.length; i < l; i++ ) {
							el = children[ i ];

							if( el && el.nodeType === 3 ) {
								oEl.replaceChild( label, el );
							}
						}
					}
				};

				update( this, sel );
				$( this ).bind( "change refresh", function() {
					update( this, sel );
				});
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg, a, b, c ) {
		return this.each(function() {

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			return $.fn[ pluginName ].prototype[ arrg ].call( this, a, b, c );
		}

		// don't re-init
		if( $( this ).data( pluginName + "active" ) ){
			return $( this );
		}

		// otherwise, init

		$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this );
		});
	};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

}( jQuery ));
;(function( win, $, undefined ){

	var ColumnToggle = function( element ) {

		this.$table = $( element );

		this.classes = {
			columnToggleTable: 'tablesaw-columntoggle',
			columnBtnContain: 'tablesaw-columntoggle-btnwrap tablesaw-advance',
			columnBtn: 'tablesaw-columntoggle-btn tablesaw-nav-btn down',
			popup: 'tablesaw-columntoggle-popup',
			priorityPrefix: 'tablesaw-priority-',
			// TODO duplicate class, also in tables.js
			toolbar: 'tablesaw-bar'
		};

		// Expose headers and allHeaders properties on the widget
		// headers references the THs within the first TR in the table
		this.headers = this.$table.find( 'tr:first > th' );

		this.$table.data( 'tablesaw-coltoggle', this );
	};

	ColumnToggle.prototype.init = function() {

		var tableId,
			id,
			$menuButton,
			$popup,
			$menu,
			$btnContain,
			self = this;

		this.$table.addClass( this.classes.columnToggleTable );

		tableId = this.$table.attr( "id" );
		id = tableId + "-popup";
		$btnContain = $( "<div class='" + this.classes.columnBtnContain + "'></div>" );
		$menuButton = $( "<a href='#" + id + "' class='btn btn-micro " + this.classes.columnBtn +"' data-popup-link>" +
										"<span>" + Tablesaw.i18n.columnBtnText + "</span></a>" );
		$popup = $( "<div class='dialog-table-coltoggle " + this.classes.popup + "' id='" + id + "'></div>" );
		$menu = $( "<div class='btn-group'></div>" );

		var hasNonPersistentHeaders = false;
		$( this.headers ).not( "td" ).each( function() {
			var $this = $( this ),
				priority = $this.attr("data-tablesaw-priority"),
				$cells = self.$getCells( this );

			if( priority && priority !== "persist" ) {
				$cells.addClass( self.classes.priorityPrefix + priority );

				$("<label><input type='checkbox' checked>" + $this.text() + "</label>" )
					.appendTo( $menu )
					.children( 0 )
					.data( "tablesaw-header", this );

				hasNonPersistentHeaders = true;
			}
		});

		if( !hasNonPersistentHeaders ) {
			$menu.append( '<label>' + Tablesaw.i18n.columnsDialogError + '</label>' );
		}

		$menu.appendTo( $popup );

		// bind change event listeners to inputs - TODO: move to a private method?
		$menu.find( 'input[type="checkbox"]' ).on( "change", function(e) {
			var checked = e.target.checked;

			self.$getCellsFromCheckbox( e.target )
				.toggleClass( "tablesaw-cell-hidden", !checked )
				.toggleClass( "tablesaw-cell-visible", checked );

			self.$table.trigger( 'tablesawcolumns' );
		});

		$menuButton.appendTo( $btnContain );
		$btnContain.appendTo( this.$table.prev().filter( '.' + this.classes.toolbar ) );

		var closeTimeout;
		function openPopup() {
			$btnContain.addClass( 'visible' );
			$menuButton.removeClass( 'down' ).addClass( 'up' );

			$( document ).unbind( 'click.' + tableId, closePopup );

			window.clearTimeout( closeTimeout );
			closeTimeout = window.setTimeout(function() {
				$( document ).one( 'click.' + tableId, closePopup );
			}, 15 );
		}

		function closePopup( event ) {
			// Click came from inside the popup, ignore.
			if( event && $( event.target ).closest( "." + self.classes.popup ).length ) {
				return;
			}

			$( document ).unbind( 'click.' + tableId );
			$menuButton.removeClass( 'up' ).addClass( 'down' );
			$btnContain.removeClass( 'visible' );
		}

		$menuButton.on( "click.tablesaw", function( event ) {
			event.preventDefault();

			if( !$btnContain.is( ".visible" ) ) {
				openPopup();
			} else {
				closePopup();
			}
		});

		$popup.appendTo( $btnContain );

		this.$menu = $menu;

		$(window).on( "resize." + tableId, function(){
			self.refreshToggle();
		});

		this.refreshToggle();
	};

	ColumnToggle.prototype.$getCells = function( th ) {
		return $( th ).add( th.cells );
	};

	ColumnToggle.prototype.$getCellsFromCheckbox = function( checkbox ) {
		var th = $( checkbox ).data( "tablesaw-header" );
		return this.$getCells( th );
	};

	ColumnToggle.prototype.refreshToggle = function() {
		var self = this;
		this.$menu.find( "input" ).each( function() {
			this.checked = self.$getCellsFromCheckbox( this ).eq( 0 ).css( "display" ) === "table-cell";
		});
	};

	ColumnToggle.prototype.refreshPriority = function(){
		var self = this;
		$(this.headers).not( "td" ).each( function() {
			var $this = $( this ),
				priority = $this.attr("data-tablesaw-priority"),
				$cells = $this.add( this.cells );

			if( priority && priority !== "persist" ) {
				$cells.addClass( self.classes.priorityPrefix + priority );
			}
		});
	};

	ColumnToggle.prototype.destroy = function() {
		// table toolbars, document and window .tableId events
		// removed in parent tables.js destroy method

		this.$table.removeClass( this.classes.columnToggleTable );
		this.$table.find( 'th, td' ).each(function() {
			var $cell = $( this );
			$cell.removeClass( 'tablesaw-cell-hidden' )
				.removeClass( 'tablesaw-cell-visible' );

			this.className = this.className.replace( /\bui\-table\-priority\-\d\b/g, '' );
		});
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, Tablesaw ){

		if( Tablesaw.mode === 'columntoggle' ){
			var table = new ColumnToggle( Tablesaw.table );
			table.init();
		}

	} );

	$( document ).on( "tablesawdestroy", function( e, Tablesaw ){
		if( Tablesaw.mode === 'columntoggle' ){
			$( Tablesaw.table ).data( 'tablesaw-coltoggle' ).destroy();
		}
	} );

}( this, jQuery ));
;(function( win, $, undefined ){

	$.extend( Tablesaw.config, {
		swipe: {
			horizontalThreshold: 15,
			verticalThreshold: 30
		}
	});

	function isIE8() {
		var div = document.createElement('div'),
			all = div.getElementsByTagName('i');

		div.innerHTML = '<!--[if lte IE 8]><i></i><![endif]-->';

		return !!all.length;
	}

	function createSwipeTable( $table ){

		var $btns = $( "<div class='tablesaw-advance'></div>" ),
			$prevBtn = $( "<a href='#' class='tablesaw-nav-btn btn btn-micro left' title='Previous Column'></a>" ).appendTo( $btns ),
			$nextBtn = $( "<a href='#' class='tablesaw-nav-btn btn btn-micro right' title='Next Column'></a>" ).appendTo( $btns ),
			hideBtn = 'disabled',
			persistWidths = 'tablesaw-fix-persist',
			$headerCells = $table.find( "thead th" ),
			$headerCellsNoPersist = $headerCells.not( '[data-tablesaw-priority="persist"]' ),
			headerWidths = [],
			$head = $( document.head || 'head' ),
			tableId = $table.attr( 'id' ),
			// TODO switch this to an nth-child feature test
			supportsNthChild = !isIE8();

		if( !$headerCells.length ) {
			throw new Error( "tablesaw swipe: no header cells found. Are you using <th> inside of <thead>?" );
		}

		// Calculate initial widths
		$table.css('width', 'auto');
		$headerCells.each(function() {
			headerWidths.push( $( this ).outerWidth() );
		});
		$table.css( 'width', '' );

		$btns.appendTo( $table.prev().filter( '.tablesaw-bar' ) );

		$table.addClass( "tablesaw-swipe" );

		if( !tableId ) {
			tableId = 'tableswipe-' + Math.round( Math.random() * 10000 );
			$table.attr( 'id', tableId );
		}

		function $getCells( headerCell ) {
			return $( headerCell.cells ).add( headerCell );
		}

		function showColumn( headerCell ) {
			$getCells( headerCell ).removeClass( 'tablesaw-cell-hidden' );
		}

		function hideColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'tablesaw-cell-hidden' );
		}

		function persistColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'tablesaw-cell-persist' );
		}

		function isPersistent( headerCell ) {
			return $( headerCell ).is( '[data-tablesaw-priority="persist"]' );
		}

		function unmaintainWidths() {
			$table.removeClass( persistWidths );
			$( '#' + tableId + '-persist' ).remove();
		}

		function maintainWidths() {
			var prefix = '#' + tableId + '.tablesaw-swipe ',
				styles = [],
				tableWidth = $table.width(),
				hash = [],
				newHash;

			$headerCells.each(function( index ) {
				var width;
				if( isPersistent( this ) ) {
					width = $( this ).outerWidth();

					// Only save width on non-greedy columns (take up less than 75% of table width)
					if( width < tableWidth * 0.75 ) {
						hash.push( index + '-' + width );
						styles.push( prefix + ' .tablesaw-cell-persist:nth-child(' + ( index + 1 ) + ') { width: ' + width + 'px; }' );
					}
				}
			});
			newHash = hash.join( '_' );

			$table.addClass( persistWidths );

			var $style = $( '#' + tableId + '-persist' );
			// If style element not yet added OR if the widths have changed
			if( !$style.length || $style.data( 'hash' ) !== newHash ) {
				// Remove existing
				$style.remove();

				if( styles.length ) {
					$( '<style>' + styles.join( "\n" ) + '</style>' )
						.attr( 'id', tableId + '-persist' )
						.data( 'hash', newHash )
						.appendTo( $head );
				}
			}
		}

		function getNext(){
			var next = [],
				checkFound;

			$headerCellsNoPersist.each(function( i ) {
				var $t = $( this ),
					isHidden = $t.css( "display" ) === "none" || $t.is( ".tablesaw-cell-hidden" );

				if( !isHidden && !checkFound ) {
					checkFound = true;
					next[ 0 ] = i;
				} else if( isHidden && checkFound ) {
					next[ 1 ] = i;

					return false;
				}
			});

			return next;
		}

		function getPrev(){
			var next = getNext();
			return [ next[ 1 ] - 1 , next[ 0 ] - 1 ];
		}

		function nextpair( fwd ){
			return fwd ? getNext() : getPrev();
		}

		function canAdvance( pair ){
			return pair[ 1 ] > -1 && pair[ 1 ] < $headerCellsNoPersist.length;
		}

		function matchesMedia() {
			var matchMedia = $table.attr( "data-tablesaw-swipe-media" );
			return !matchMedia || ( "matchMedia" in win ) && win.matchMedia( matchMedia ).matches;
		}

		function fakeBreakpoints() {
			if( !matchesMedia() ) {
				return;
			}

			var extraPaddingPixels = 20,
				containerWidth = $table.parent().width(),
				persist = [],
				sum = 0,
				sums = [],
				visibleNonPersistantCount = $headerCells.length;

			$headerCells.each(function( index ) {
				var $t = $( this ),
					isPersist = $t.is( '[data-tablesaw-priority="persist"]' );

				persist.push( isPersist );

				sum += headerWidths[ index ] + ( isPersist ? 0 : extraPaddingPixels );
				sums.push( sum );

				// is persistent or is hidden
				if( isPersist || sum > containerWidth ) {
					visibleNonPersistantCount--;
				}
			});

			var needsNonPersistentColumn = visibleNonPersistantCount === 0;

			$headerCells.each(function( index ) {
				if( persist[ index ] ) {

					// for visual box-shadow
					persistColumn( this );
					return;
				}

				if( sums[ index ] <= containerWidth || needsNonPersistentColumn ) {
					needsNonPersistentColumn = false;
					showColumn( this );
				} else {
					hideColumn( this );
				}
			});

			if( supportsNthChild ) {
				unmaintainWidths();
			}
			$table.trigger( 'tablesawcolumns' );
		}

		function advance( fwd ){
			var pair = nextpair( fwd );
			if( canAdvance( pair ) ){
				if( isNaN( pair[ 0 ] ) ){
					if( fwd ){
						pair[0] = 0;
					}
					else {
						pair[0] = $headerCellsNoPersist.length - 1;
					}
				}

				if( supportsNthChild ) {
					maintainWidths();
				}

				hideColumn( $headerCellsNoPersist.get( pair[ 0 ] ) );
				showColumn( $headerCellsNoPersist.get( pair[ 1 ] ) );

				$table.trigger( 'tablesawcolumns' );
			}
		}

		$prevBtn.add( $nextBtn ).click(function( e ){
			advance( !!$( e.target ).closest( $nextBtn ).length );
			e.preventDefault();
		});

		function getCoord( event, key ) {
			return ( event.touches || event.originalEvent.touches )[ 0 ][ key ];
		}

		$table
			.bind( "touchstart.swipetoggle", function( e ){
				var originX = getCoord( e, 'pageX' ),
					originY = getCoord( e, 'pageY' ),
					x,
					y;

				$( win ).off( "resize", fakeBreakpoints );

				$( this )
					.bind( "touchmove", function( e ){
						x = getCoord( e, 'pageX' );
						y = getCoord( e, 'pageY' );
						var cfg = Tablesaw.config.swipe;
						if( Math.abs( x - originX ) > cfg.horizontalThreshold && Math.abs( y - originY ) < cfg.verticalThreshold ) {
							e.preventDefault();
						}
					})
					.bind( "touchend.swipetoggle", function(){
						var cfg = Tablesaw.config.swipe;
						if( Math.abs( y - originY ) < cfg.verticalThreshold ) {
							if( x - originX < -1 * cfg.horizontalThreshold ){
								advance( true );
							}
							if( x - originX > cfg.horizontalThreshold ){
								advance( false );
							}
						}

						window.setTimeout(function() {
							$( win ).on( "resize", fakeBreakpoints );
						}, 300);
						$( this ).unbind( "touchmove touchend" );
					});

			})
			.bind( "tablesawcolumns.swipetoggle", function(){
				$prevBtn[ canAdvance( getPrev() ) ? "removeClass" : "addClass" ]( hideBtn );
				$nextBtn[ canAdvance( getNext() ) ? "removeClass" : "addClass" ]( hideBtn );
			})
			.bind( "tablesawnext.swipetoggle", function(){
				advance( true );
			} )
			.bind( "tablesawprev.swipetoggle", function(){
				advance( false );
			} )
			.bind( "tablesawdestroy.swipetoggle", function(){
				var $t = $( this );

				$t.removeClass( 'tablesaw-swipe' );
				$t.prev().filter( '.tablesaw-bar' ).find( '.tablesaw-advance' ).remove();
				$( win ).off( "resize", fakeBreakpoints );

				$t.unbind( ".swipetoggle" );
			});

		fakeBreakpoints();
		$( win ).on( "resize", fakeBreakpoints );
	}



	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, Tablesaw ){

		if( Tablesaw.mode === 'swipe' ){
			createSwipeTable( Tablesaw.$table );
		}

	} );

}( this, jQuery ));

;(function( $ ) {
	function getSortValue( cell ) {
		return $.map( cell.childNodes, function( el ) {
				var $el = $( el );
				if( $el.is( 'input, select' ) ) {
					return $el.val();
				} else if( $el.hasClass( 'tablesaw-cell-label' ) ) {
					return;
				}
				return $.trim( $el.text() );
			}).join( '' );
	}

	var pluginName = "tablesaw-sortable",
		initSelector = "table[data-" + pluginName + "]",
		sortableSwitchSelector = "[data-" + pluginName + "-switch]",
		attrs = {
			defaultCol: "data-tablesaw-sortable-default-col",
			numericCol: "data-tablesaw-sortable-numeric"
		},
		classes = {
			head: pluginName + "-head",
			ascend: pluginName + "-ascending",
			descend: pluginName + "-descending",
			switcher: pluginName + "-switch",
			tableToolbar: 'tablesaw-toolbar',
			sortButton: pluginName + "-btn"
		},
		methods = {
			_create: function( o ){
				return $( this ).each(function() {
					var init = $( this ).data( "init" + pluginName );
					if( init ) {
						return false;
					}
					$( this )
						.data( "init"+ pluginName, true )
						.trigger( "beforecreate." + pluginName )
						[ pluginName ]( "_init" , o )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var el = $( this ),
					heads,
					$switcher;

				var addClassToTable = function(){
						el.addClass( pluginName );
					},
					addClassToHeads = function( h ){
						$.each( h , function( i , v ){
							$( v ).addClass( classes.head );
						});
					},
					makeHeadsActionable = function( h , fn ){
						$.each( h , function( i , v ){
							var b = $( "<button class='" + classes.sortButton + "'/>" );
							b.bind( "click" , { col: v } , fn );
							$( v ).wrapInner( b );
						});
					},
					clearOthers = function( sibs ){
						$.each( sibs , function( i , v ){
							var col = $( v );
							col.removeAttr( attrs.defaultCol );
							col.removeClass( classes.ascend );
							col.removeClass( classes.descend );
						});
					},
					headsOnAction = function( e ){
						if( $( e.target ).is( 'a[href]' ) ) {
							return;
						}

						e.stopPropagation();
						var head = $( this ).parent(),
							v = e.data.col,
							newSortValue = heads.index( head );

						clearOthers( head.siblings() );
						if( head.hasClass( classes.descend ) ){
							el[ pluginName ]( "sortBy" , v , true);
							newSortValue += '_asc';
						} else {
							el[ pluginName ]( "sortBy" , v );
							newSortValue += '_desc';
						}
						if( $switcher ) {
							$switcher.find( 'select' ).val( newSortValue ).trigger( 'refresh' );
						}

						e.preventDefault();
					},
					handleDefault = function( heads ){
						$.each( heads , function( idx , el ){
							var $el = $( el );
							if( $el.is( "[" + attrs.defaultCol + "]" ) ){
								if( !$el.hasClass( classes.descend ) ) {
									$el.addClass( classes.ascend );
								}
							}
						});
					},
					addSwitcher = function( heads ){
						$switcher = $( '<div>' ).addClass( classes.switcher ).addClass( classes.tableToolbar ).html(function() {
							var html = [ '<label>' + Tablesaw.i18n.sort + ':' ];

							html.push( '<span class="btn btn-small">&#160;<select>' );
							heads.each(function( j ) {
								var $t = $( this );
								var isDefaultCol = $t.is( "[" + attrs.defaultCol + "]" );
								var isDescending = $t.hasClass( classes.descend );

								var hasNumericAttribute = $t.is( '[data-sortable-numeric]' );
								var numericCount = 0;
								// Check only the first four rows to see if the column is numbers.
								var numericCountMax = 5;

								$( this.cells ).slice( 0, numericCountMax ).each(function() {
									if( !isNaN( parseInt( getSortValue( this ), 10 ) ) ) {
										numericCount++;
									}
								});
								var isNumeric = numericCount === numericCountMax;
								if( !hasNumericAttribute ) {
									$t.attr( "data-sortable-numeric", isNumeric ? "" : "false" );
								}

								html.push( '<option' + ( isDefaultCol && !isDescending ? ' selected' : '' ) + ' value="' + j + '_asc">' + $t.text() + ' ' + ( isNumeric ? '&#x2191;' : '(A-Z)' ) + '</option>' );
								html.push( '<option' + ( isDefaultCol && isDescending ? ' selected' : '' ) + ' value="' + j + '_desc">' + $t.text() + ' ' + ( isNumeric ? '&#x2193;' : '(Z-A)' ) + '</option>' );
							});
							html.push( '</select></span></label>' );

							return html.join('');
						});

						var $toolbar = el.prev().filter( '.tablesaw-bar' ),
							$firstChild = $toolbar.children().eq( 0 );

						if( $firstChild.length ) {
							$switcher.insertBefore( $firstChild );
						} else {
							$switcher.appendTo( $toolbar );
						}
						$switcher.find( '.btn' ).tablesawbtn();
						$switcher.find( 'select' ).on( 'change', function() {
							var val = $( this ).val().split( '_' ),
								head = heads.eq( val[ 0 ] );

							clearOthers( head.siblings() );
							el[ pluginName ]( 'sortBy', head.get( 0 ), val[ 1 ] === 'asc' );
						});
					};

					addClassToTable();
					heads = el.find( "thead th[data-" + pluginName + "-col]" );
					addClassToHeads( heads );
					makeHeadsActionable( heads , headsOnAction );
					handleDefault( heads );

					if( el.is( sortableSwitchSelector ) ) {
						addSwitcher( heads, el.find('tbody tr:nth-child(-n+3)') );
					}
			},
			getColumnNumber: function( col ){
				return $( col ).prevAll().length;
			},
			getTableRows: function(){
				return $( this ).find( "tbody tr" );
			},
			sortRows: function( rows , colNum , ascending, col ){
				var cells, fn, sorted;
				var getCells = function( rows ){
						var cells = [];
						$.each( rows , function( i , r ){
							var element = $( r ).children().get( colNum );
							cells.push({
								element: element,
								cell: getSortValue( element ),
								rowNum: i
							});
						});
						return cells;
					},
					getSortFxn = function( ascending, forceNumeric ){
						var fn,
							regex = /[^\-\+\d\.]/g;
						if( ascending ){
							fn = function( a , b ){
								if( forceNumeric ) {
									return parseFloat( a.cell.replace( regex, '' ) ) - parseFloat( b.cell.replace( regex, '' ) );
								} else {
									return a.cell.toLowerCase() > b.cell.toLowerCase() ? 1 : -1;
								}
							};
						} else {
							fn = function( a , b ){
								if( forceNumeric ) {
									return parseFloat( b.cell.replace( regex, '' ) ) - parseFloat( a.cell.replace( regex, '' ) );
								} else {
									return a.cell.toLowerCase() < b.cell.toLowerCase() ? 1 : -1;
								}
							};
						}
						return fn;
					},
					applyToRows = function( sorted , rows ){
						var newRows = [], i, l, cur;
						for( i = 0, l = sorted.length ; i < l ; i++ ){
							cur = sorted[ i ].rowNum;
							newRows.push( rows[cur] );
						}
						return newRows;
					};

				cells = getCells( rows );
				var customFn = $( col ).data( 'tablesaw-sort' );
				fn = ( customFn && typeof customFn === "function" ? customFn( ascending ) : false ) ||
					getSortFxn( ascending, $( col ).is( '[data-sortable-numeric]' ) && !$( col ).is( '[data-sortable-numeric="false"]' ) );
				sorted = cells.sort( fn );
				rows = applyToRows( sorted , rows );
				return rows;
			},
			replaceTableRows: function( rows ){
				var el = $( this ),
					body = el.find( "tbody" );
				body.html( rows );
			},
			makeColDefault: function( col , a ){
				var c = $( col );
				c.attr( attrs.defaultCol , "true" );
				if( a ){
					c.removeClass( classes.descend );
					c.addClass( classes.ascend );
				} else {
					c.removeClass( classes.ascend );
					c.addClass( classes.descend );
				}
			},
			sortBy: function( col , ascending ){
				var el = $( this ), colNum, rows;

				colNum = el[ pluginName ]( "getColumnNumber" , col );
				rows = el[ pluginName ]( "getTableRows" );
				rows = el[ pluginName ]( "sortRows" , rows , colNum , ascending, col );
				el[ pluginName ]( "replaceTableRows" , rows );
				el[ pluginName ]( "makeColDefault" , col , ascending );
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg ) {
		var args = Array.prototype.slice.call( arguments , 1),
			returnVal;

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			returnVal = $.fn[ pluginName ].prototype[ arrg ].apply( this[0], args );
			return (typeof returnVal !== "undefined")? returnVal:$(this);
		}
		// check init
		if( !$( this ).data( pluginName + "data" ) ){
			$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this , arrg );
		}
		return $(this);
	};
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

	$( document ).on( "tablesawcreate", function( e, Tablesaw ) {
		if( Tablesaw.$table.is( initSelector ) ) {
			Tablesaw.$table[ pluginName ]();
		}
	});

}( jQuery ));

;(function( win, $, undefined ){

	var MM = {
		attr: {
			init: 'data-tablesaw-minimap'
		}
	};

	function createMiniMap( $table ){

		var $btns = $( '<div class="tablesaw-advance minimap">' ),
			$dotNav = $( '<ul class="tablesaw-advance-dots">' ).appendTo( $btns ),
			hideDot = 'tablesaw-advance-dots-hide',
			$headerCells = $table.find( 'thead th' );

		// populate dots
		$headerCells.each(function(){
			$dotNav.append( '<li><i></i></li>' );
		});

		$btns.appendTo( $table.prev().filter( '.tablesaw-bar' ) );

		function showMinimap( $table ) {
			var mq = $table.attr( MM.attr.init );
			return !mq || win.matchMedia && win.matchMedia( mq ).matches;
		}

		function showHideNav(){
			if( !showMinimap( $table ) ) {
				$btns.hide();
				return;
			}
			$btns.show();

			// show/hide dots
			var dots = $dotNav.find( "li" ).removeClass( hideDot );
			$table.find( "thead th" ).each(function(i){
				if( $( this ).css( "display" ) === "none" ){
					dots.eq( i ).addClass( hideDot );
				}
			});
		}

		// run on init and resize
		showHideNav();
		$( win ).on( "resize", showHideNav );


		$table
			.bind( "tablesawcolumns.minimap", function(){
				showHideNav();
			})
			.bind( "tablesawdestroy.minimap", function(){
				var $t = $( this );

				$t.prev().filter( '.tablesaw-bar' ).find( '.tablesaw-advance' ).remove();
				$( win ).off( "resize", showHideNav );

				$t.unbind( ".minimap" );
			});
	}



	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, Tablesaw ){

		if( ( Tablesaw.mode === 'swipe' || Tablesaw.mode === 'columntoggle' ) && Tablesaw.$table.is( '[ ' + MM.attr.init + ']' ) ){
			createMiniMap( Tablesaw.$table );
		}

	} );

}( this, jQuery ));

;(function( win, $ ) {

	var S = {
		selectors: {
			init: 'table[data-tablesaw-mode-switch]'
		},
		attributes: {
			excludeMode: 'data-tablesaw-mode-exclude'
		},
		classes: {
			main: 'tablesaw-modeswitch',
			toolbar: 'tablesaw-toolbar'
		},
		modes: [ 'stack', 'swipe', 'columntoggle' ],
		init: function( table ) {
			var $table = $( table ),
				ignoreMode = $table.attr( S.attributes.excludeMode ),
				$toolbar = $table.prev().filter( '.tablesaw-bar' ),
				modeVal = '',
				$switcher = $( '<div>' ).addClass( S.classes.main + ' ' + S.classes.toolbar ).html(function() {
					var html = [ '<label>' + Tablesaw.i18n.columns + ':' ],
						dataMode = $table.attr( 'data-tablesaw-mode' ),
						isSelected;

					html.push( '<span class="btn btn-small">&#160;<select>' );
					for( var j=0, k = S.modes.length; j<k; j++ ) {
						if( ignoreMode && ignoreMode.toLowerCase() === S.modes[ j ] ) {
							continue;
						}

						isSelected = dataMode === S.modes[ j ];

						if( isSelected ) {
							modeVal = S.modes[ j ];
						}

						html.push( '<option' +
							( isSelected ? ' selected' : '' ) +
							' value="' + S.modes[ j ] + '">' + Tablesaw.i18n.modes[ j ] + '</option>' );
					}
					html.push( '</select></span></label>' );

					return html.join('');
				});

			var $otherToolbarItems = $toolbar.find( '.tablesaw-advance' ).eq( 0 );
			if( $otherToolbarItems.length ) {
				$switcher.insertBefore( $otherToolbarItems );
			} else {
				$switcher.appendTo( $toolbar );
			}

			$switcher.find( '.btn' ).tablesawbtn();
			$switcher.find( 'select' ).bind( 'change', S.onModeChange );
		},
		onModeChange: function() {
			var $t = $( this ),
				$switcher = $t.closest( '.' + S.classes.main ),
				$table = $t.closest( '.tablesaw-bar' ).nextUntil( $table ).eq( 0 ),
				val = $t.val();

			$switcher.remove();
			$table.data( 'table' ).destroy();

			$table.attr( 'data-tablesaw-mode', val );
			$table.table();
		}
	};

	$( win.document ).on( "tablesawcreate", function( e, Tablesaw ) {
		if( Tablesaw.$table.is( S.selectors.init ) ) {
			S.init( Tablesaw.table );
		}
	});

})( this, jQuery );
+ function ($) {
    'use strict';

    /**
     * Card filter - Filter user options and save as a cookie for when they return to the page
     PLEASE NOTE: this currently utilises a cookie plugin to save the user filter options to retain 
     the state of the filters. The plugin used is: JavaScript Cookie v2.1.2 (https://github.com/js-cookie/js-cookie)
     If this is not required, simply set useCookies to false;
    */

    var useCookies = true;

    var contains = function (needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;
        if (!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (needle) {
                var i = -1
                    , index = -1;
                for (i = 0; i < this.length; i++) {
                    var item = this[i];
                    if ((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return indexOf.call(this, needle) > -1;
    };

    function check() {
        var selectedOptions = {};
        //get value of the selects combination and store it in an object
        $('.card-filter select').each(function () {
            var thisKey = $(this).attr('id');
            var thisOption = $(this).val();
            selectedOptions[thisKey] = thisOption; //add the selected option to obj
            if (useCookies) {
                //set the cookie to save the serach filter
                Cookies.set('searchFilters', selectedOptions);
            }
        });

        $.fn._hasData = function () {
            return [].some.call(this[0].attributes, function (v, k) {
                return /^data-/.test(v["name"])
            })
        };

        $('.filter-list div').each(function () {
            if ($(this)._hasData()) {
                var listData = $(this).data(); //get object of data attr
                var keyList = Object.keys(listData); //get array of keys
                var keySuccess = []; //monitor the result of each comparison       
                //loop through each of the keys in 
                //the list to see if it matches the selected options
                for (var k in keyList) { //each key
                    var key = keyList[k];
                    var value = listData[key];
                    if (contains.call(value, ',')) { //if list data contain comma
                        var valueArray = value.split(',');
                        if (contains.call(valueArray, selectedOptions[key])) {
                            keySuccess.push(1);
                        } else if ("all" == selectedOptions[key]) {
                            keySuccess.push(1);
                        } else {
                            keySuccess.push(0);
                        }
                    } else {
                        if (value == selectedOptions[key]) { //if not match add zero
                            keySuccess.push(1);
                        } else if ("all" == selectedOptions[key]) {
                            keySuccess.push(1);
                        } else {
                            keySuccess.push(0);
                        }
                    }
                }
                var index = contains.call(keySuccess, 0); // if containes 0 retun true
                //pseudo hide the elements, so they are not visible/tabbable
                //but need to retain their display propert to allow the equalize to work
                if (!index) {
                    $(this).css({position:"relative",left:'0'});
                    $(this).find('a').removeAttr('tabindex');
                } else {
                    $(this).css({position:"absolute",left:'-10000px'});
                    $(this).find('a').attr('tabindex','-1');
                }
                keySuccess = [];
            }
        });
        
        $(window).trigger("resize"); //this is needed to re-equalize the columns
    }

    $(document).ready(function () {
        if (useCookies) {
            //check if the cookies exists if so set the filters accordingly
            if (Cookies.get('searchFilters') != undefined) {
                var filterObj = JSON.parse("[" + Cookies.get('searchFilters') + "]");
                for (var key in filterObj[0]) {
                    var value = filterObj[0][key];
                    $("#" + key).val(value);
                }
            }
        }
        check();
    });

    $('.card-filter select').change(function () {
        check();
    });

}(jQuery);
+ function ($) {
    'use strict';
    var style1 = [{
        "elementType": "geometry"
        , "stylers": [{
            "hue": "#ff4400"
        }, {
            "saturation": -68
        }, {
            "lightness": -4
        }, {
            "gamma": 0.72
        }]
    }, {
        "featureType": "road"
        , "elementType": "labels.icon"
    }, {
        "featureType": "landscape.man_made"
        , "elementType": "geometry"
        , "stylers": [{
            "hue": "#0077ff"
        }, {
            "gamma": 3.1
        }]
    }, {
        "featureType": "water"
        , "stylers": [{
            "hue": "#00ccff"
        }, {
            "gamma": 0.44
        }, {
            "saturation": -33
        }]
    }, {
        "featureType": "poi.park"
        , "stylers": [{
            "hue": "#44ff00"
        }, {
            "saturation": -23
        }]
    }, {
        "featureType": "water"
        , "elementType": "labels.text.fill"
        , "stylers": [{
            "hue": "#007fff"
        }, {
            "gamma": 0.77
        }, {
            "saturation": 65
        }, {
            "lightness": 99
        }]
    }, {
        "featureType": "water"
        , "elementType": "labels.text.stroke"
        , "stylers": [{
            "gamma": 0.11
        }, {
            "weight": 5.6
        }, {
            "saturation": 99
        }, {
            "hue": "#0091ff"
        }, {
            "lightness": -86
        }]
    }, {
        "featureType": "transit.line"
        , "elementType": "geometry"
        , "stylers": [{
            "lightness": -48
        }, {
            "hue": "#ff5e00"
        }, {
            "gamma": 1.2
        }, {
            "saturation": -23
        }]
    }, {
        "featureType": "transit"
        , "elementType": "labels.text.stroke"
        , "stylers": [{
            "saturation": -64
        }, {
            "hue": "#ff9100"
        }, {
            "lightness": 16
        }, {
            "gamma": 0.47
        }, {
            "weight": 2.7
        }]
    }];
    var style2 = [{
        "featureType": "water"
        , "elementType": "geometry"
        , "stylers": [{
            "color": "#e9e9e9"
        }, {
            "lightness": 17
        }]
    }, {
        "featureType": "landscape"
        , "elementType": "geometry"
        , "stylers": [{
            "color": "#f5f5f5"
        }, {
            "lightness": 20
        }]
    }, {
        "featureType": "road.highway"
        , "elementType": "geometry.fill"
        , "stylers": [{
            "color": "#ffffff"
        }, {
            "lightness": 17
        }]
    }, {
        "featureType": "road.highway"
        , "elementType": "geometry.stroke"
        , "stylers": [{
            "color": "#ffffff"
        }, {
            "lightness": 29
        }, {
            "weight": 0.2
        }]
    }, {
        "featureType": "road.arterial"
        , "elementType": "geometry"
        , "stylers": [{
            "color": "#ffffff"
        }, {
            "lightness": 18
        }]
    }, {
        "featureType": "road.local"
        , "elementType": "geometry"
        , "stylers": [{
            "color": "#ffffff"
        }, {
            "lightness": 16
        }]
    }, {
        "featureType": "poi"
        , "elementType": "geometry"
        , "stylers": [{
            "color": "#f5f5f5"
        }, {
            "lightness": 21
        }]
    }, {
        "featureType": "poi.park"
        , "elementType": "geometry"
        , "stylers": [{
            "color": "#dedede"
        }, {
            "lightness": 21
        }]
    }, {
        "elementType": "labels.text.stroke"
        , "stylers": [{
            "visibility": "on"
        }, {
            "color": "#ffffff"
        }, {
            "lightness": 16
        }]
    }, {
        "elementType": "labels.text.fill"
        , "stylers": [{
            "saturation": 36
        }, {
            "color": "#333333"
        }, {
            "lightness": 40
        }]
    }, {
        "elementType": "labels.icon"
        , "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit"
        , "elementType": "geometry"
        , "stylers": [{
            "color": "#f2f2f2"
        }, {
            "lightness": 19
        }]
    }, {
        "featureType": "administrative"
        , "elementType": "geometry.fill"
        , "stylers": [{
            "color": "#fefefe"
        }, {
            "lightness": 20
        }]
    }, {
        "featureType": "administrative"
        , "elementType": "geometry.stroke"
        , "stylers": [{
            "color": "#fefefe"
        }, {
            "lightness": 17
        }, {
            "weight": 1.2
        }]
    }];
    
    
    //
    //=============================================================
    //    
    // Set private defaults.
    var Defaults = {
        zoom: 16
        , center: [53.81048220253582, -1.556990146636963]
        , stylers: ''
        , scrollwheel : false //so when scrolling down the page the scroll doesn't get hi-jacked by the map
        , markers: []
        , markerArray : []
        , onSuccess: function () {
            //console.log(this.markerArray);
        }
    };
    // Define the public api and its public methods.
    var PluginApi = {
        extend: function (name, method) {
            PluginApi[name] = method;
            return this;
        }
        , init: function (PublicOptions) {
            // Do a deep copy of the options.
            var Options = $.extend(true, {}, Defaults, PublicOptions);
            var mapOptions = {
                // How zoomed in you want the map to start at (always required)
                zoom: Options.zoom, // The latitude and longitude to center the map (always required)
                center: new google.maps.LatLng(Options.center[0], Options.center[1]), // New York
                // How you would like to style the map. 
                // This is where you would paste any style found on Snazzy Maps.
                styles: Options.stylers,
                scrollwheel : Options.scrollwheel
            };
            return this.each(function () {
                // Get the HTML DOM element that will contain your map 
                // We are using a div with id="map" seen below in the <body>
                var mapElement = this;
                // Create the Google Map using our element and options defined above
                var map = new google.maps.Map(mapElement, mapOptions);
                var infowindow = new google.maps.InfoWindow({
                    content: ' '
                    , pixelOffset: new google.maps.Size(0, -20) //offset the infowindow
                });
                //custom close infowindow functionality
                $(document).on("click", ".close-infowindow", function () {
                    infowindow.close();
                });
                //PluginApi.initialMarker(map); //replace for a single marker 
                //add the markers to the map
                PluginApi.processMarkers(map, Options.markers,Options.markerArray,infowindow);
            });
        }
        , processMarkers: function(map, markers,markerArray,infowindow) {            
                for (var i = 0; i < markers["locations"].length; i++) {
                    PluginApi.addMarker(map, markerArray, infowindow, markers["locations"][i]["lat"], markers["locations"][i]["lng"], '../img/icon-map.png?v=1', markers["locations"][i]["label"], markers["locations"][i]["text"], markers["locations"][i]["groupType"], markers["locations"][i]["id"], markers["locations"][i]["id"]);
                }
            //make the processed array available
            PluginApi.getMarkerArray = markerArray;
        }
        , getMarkerArray : function(){
        }
        , toggleMarkerGroup : function(thisType){
            var markerArray = PluginApi.getMarkerArray;
            for (var i = 0; i < markerArray.length; i++) {
                if(markerArray[i].type == thisType){
                     if (markerArray[i].getVisible()) {
                         markerArray[i].setVisible(false)
                     } else {
                         markerArray[i].setVisible(true)
                     }
                }
            }
        }
        , addMarker: function(map, markerArray, infowindow, lat, lng, iconURL, markerTitle, markerText, markerType, markerID){
                    var pinImage = {
                        url: iconURL
                        , size: new google.maps.Size(60, 83), // the orignal size
                        scaledSize: new google.maps.Size(30, 42), // the new size you want to use
                        origin: new google.maps.Point(0, 0)
                        , anchor: new google.maps.Point(0, 32) // position in the sprite                   
                    };
                    var marker = new mapMarker({
                        position: new google.maps.LatLng(lat, lng)
                        , map: map
                        , draggable: false
                        , icon: pinImage
                        , content: '<div class="marker" data-mapid="' + markerID + '"><img src="../img/' + markerType + '.png?v=1" width="30" height="42"/><i class="map-icon grow"><span class="title"></span></i></div>'
                    , });
                    marker.set('type', markerType);
                    marker.set('id', markerID);
                    marker.text = "<div class='close-infowindow'>x</div><div class='marker-text'><h3 class='all-caps'>" + markerTitle + "</h3><p>" + markerText + "</p></div>";
                    google.maps.event.addListener(marker, 'click', function (markerType) {
                        infowindow.setContent(marker.text)
                        infowindow.open(map, marker);
                    });
                    marker.set('infowindow',infowindow); //so can access the info window outside of plugin via the marker 
                    markerArray.push(marker);
        }
        , initialMarker: function (thisMap) {
            // Let's also add a marker while we're at it
//            var marker = new google.maps.Marker({
//                position: new google.maps.LatLng(53.81048220253582, -1.556990146636963)
//                , map: thisMap
//                , title: ''
//            });
            return this;
        }
    , };
    
    // Create the plugin name and defaults once
    var pluginName = 'GoogleMap';
    // Attach the plugin to jQuery namespace.
    $.fn[pluginName] = function (method) {
        if (PluginApi[method]) {
            return PluginApi[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            //init()
            return PluginApi.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + 'does not exist');
        }
    };
    //call the plugin 
    if($('#map').length){
        
    
    var createMap = $('#map').GoogleMap({
        stylers: style2
        , zoom: 16
        , markers: maplocations
    });
    }
    /*
        ACCOMODATION SPECIFIC PLUGIN EXTEND: 
    */
    //If is the main residence location center and open the infowindow 
    $('#map').GoogleMap('extend', 'setMarkerVisibility', function () {
        var markerArray = PluginApi.getMarkerArray;
        for(var i = 0; i < markerArray.length; i++){
            if(markerArray[i].type != 'residence'){
                markerArray[i].setVisible(false)
            } else {
                markerArray[i].map.setCenter(new google.maps.LatLng(markerArray[i].position.lat(), markerArray[i].position.lng()));
                markerArray[i].infowindow.setContent(markerArray[i].text)
                markerArray[i].infowindow.open(markerArray[i].map, markerArray[i]);
            }
        }
}).GoogleMap('setMarkerVisibility');

    //OVERWRITE the toggleMarkerGroup functionality for accommodation specific requirements
    $('#map').GoogleMap('extend', 'toggleMarkerGroup', function (groupName) {
        var markerArray = PluginApi.getMarkerArray;
        for (var i = 0; i < markerArray.length; i++) {
            if (groupName !== 'residence') {
                if (markerArray[i].type == groupName) {
                    if (markerArray[i].getVisible()) {
                        markerArray[i].setVisible(false);
                        //if the currently open info window belongs to a marker to be hidden, close the infowindow
                        if (markerArray[i].infowindow.position.lat() == markerArray[i].position.lat()) {
                                markerArray[i].infowindow.close();
                            }
                        } else {
                            markerArray[i].setVisible(true);
                        }
                    }
            } else {
                if (groupName == 'residence' && markerArray[i].type == 'residence') {
                    //If it is the residence marker do not hide it, but trigger the info window
                    var thisMarker = markerArray[i];
                    setTimeout(function () { google.maps.event.trigger(thisMarker, 'click');}, 10);
                }
            }
        }
    }).GoogleMap('toggleMarkerGroup');

    //bind class to toggle groups on/off to the .togglegroup class
    $('.toggleMarkergroup').click(function () {
        var groupType = $(this).data('group');
        PluginApi.toggleMarkerGroup(groupType);
        //If it is not the main residence, toggle the button active class
        if (groupType != 'residence') {
            $(this).toggleClass('active');
        }
        var groupTitle = $(this).data('title');
        var groupText = $(this).data('text');
        $('.map-text').html('<h2>' + groupTitle + '</h2>' + groupText);
        $(window).trigger('resize');
    });

}(jQuery);
+ function ($) {
    'use strict';

    /**
     * Responsive tabs - Compares the width of the tabs to the width of the screen and switches to a drop down depending on the available space 
     get the initial max width? won't work if font re-sizes then the max on larger screens won't be calcultaed on initial load
     */

    function createDropDown() {
        //dynamically create dropdown from responsive-tabs
        var i = 0;
        var dropDown = '<div class="select_wrapper hide p-l p-r"><select>';
        $(".responsive-tabs").children('li').each(function (index, value) {
            var thisTitle = $(this).find('a').html();
            var thisLink = $(this).find('a').attr('href');
            $(this).attr('tabindex', i + 1);
            dropDown += '<option value="' + thisLink + '">' + thisTitle + '</option>';
        });
        dropDown += '</select></div>';
        $('.tk-tabs-header').append(dropDown);
    }

    if ($('.responsive-tabs').length) {
        createDropDown();
        switchNavigation();
    };

    $('.select_wrapper select').on('change', function () {
        var selected = $(this).val();
        $('a[href$="' + selected + '"]').trigger("click");
    });
    
    //Check when it is the end of user resizing
    var rtime;
    var timeout = false;
    var delta = 200;
    $(window).resize(function () {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            //Done resizing
            timeout = false;
            switchNavigation();
        }
    }

    //if the tabs exceed the screen width, convert to select list
    function switchNavigation() {
        var listWidth = $('.responsive-tabs').innerWidth();
        if (!$('.responsive-tabs').hasClass('hide') && listWidth >= window.innerWidth) {
            $('.select_wrapper').removeClass('hide');
            //hide visually only so the size can be calculated 
            $('.responsive-tabs').addClass('pseudo-hide'); 
        } else {
            $('.select_wrapper').addClass('hide');
            $('.responsive-tabs').removeClass('pseudo-hide');
        }
    }

}(jQuery);
+function ($) {
  'use strict';

  	/**
     * STATE TOGGLER - toggle body with class name
     */

    $('*[data-state="body-state"]').click(function(){        

    	var className = $(this).data('class');

    	if(!$('body').hasClass(className)){
    		
    		$('body').addClass(className);

    	} else {
    		
    		$('body').removeClass(className);

    	}

        return false;

     });

}(jQuery);






+function ($) {
  'use strict';

    /**
     * TURN ON SVG's IF COMPATIBLE (requires .js-png-svg or .js-to-svg-uri if using uri in a data attr)
     */
     
    $('.js-calendar-trigger').click(function(){    	
        alert('To do: trigger calendar');
    });       

}(jQuery);






+ function ($) {
    'use strict';

    /**
     * Course page 
     */

    function checkSize() {
        if ($(".col-right").css("position") == "relative") {
            throwContent();
        } else {
            $('.sidebar-content').html(""); //clear the bottom section
        }
    }

    checkSize();

    //move the content to the bottom 
    function throwContent() {
        if ($('.sidebar-content aside').length == 0) {
            var sidebarContent = '';
            $('aside:not(".keyfacts, .fullwidth-only")').each(function () {
                sidebarContent += '<aside>' + $(this).html() + '</aside>';
            });
            $('.sidebar-content').append(sidebarContent);
            $('.sidebar-content').append('<ul class="course-cta">' + $('.course-cta').html() + '</ul>');
        }
    }

    var resizeId;
    $(window).resize(function () {
        clearTimeout(resizeId);
        resizeId = setTimeout(checkSize, 200);
    });

    //convert entry requirements list into dropdown
    function convertRequirements() {
        var requirementsSelect = '<select id="selectRequirement" class="styled m-b p-r-md"></select><div class="select-info m-t-0 hidden flag flag-featured"></div>';
        $('.entry-requirements-list').after(requirementsSelect);
        $('#selectRequirement').append('<option data-info=" ">Select alternative qualification</option>');
        var $set = $('.entry-requirements-list li');
        var len = $set.length;
        $set.each(function (index, value) {
            var optionTitle = $(this).find('h5').html();
            var optionData = $(this).find('div').html();
            optionData = optionData.replace(/"/g, "'");
            optionData = $.trim(optionData);
            $('#selectRequirement').append('<option data-info="' + optionData + '">' + optionTitle + '</option>');
            if (index == len - 1) { //if is the last item in the loop, remove te original list
                $('#selectRequirement').after('<br /><div class="print-only"><ul>' + $('.entry-requirements-list').html() + '</ul><br /></div>');
                //hide the list so can be shown on print page
                $('.entry-requirements-list').remove();
            }
        });
    }

    convertRequirements();
    //select change functioanlity 
    $('#selectRequirement').on('change', function () {
        var thisData = $("#selectRequirement option:selected").data("info");
        if (thisData == ' ') {
            $('.select-info').addClass('hidden');
        }
        //highlight content with a flash
        else {
            $('.select-info').removeClass('hidden').html(thisData);
        }
    });

    function createFixedScrollElement(targetElement, destinationElement, bodyClass, offset) {
        var elementOffset = distanceFromTop(targetElement, $(window).scrollTop());
        if (elementOffset <= 0 + (offset)) {
            $('body').addClass(bodyClass);
        } else {
            $('body').removeClass(bodyClass);
        }
    }

    //extra anchor functionality to jump to sections within accordions
    $('.anchor-link-scroll a').not('.inner-nav li a, .scroll-up').click(function () {
        var targetElement = $(this).attr("href");
        //check to see if it is an inner page element
        if (targetElement.match("^#")) {
            if (targetElement.length > 1) {
                var targetTrigger = $(targetElement).parents(".accordion-content").prev('.accordion-trigger').attr("id");
                //open the accordion 
                if (!$("#" + targetTrigger).hasClass("active") && $(window).width() < 861) {
                    $('#' + targetTrigger).trigger('click');
                }
                //if is a main section fix offset for the negative margin
                if (targetTrigger == undefined) {
                    if (!$(targetElement).hasClass('active')) {
                        //only click if not loading from hash
                        $(targetElement).trigger('click');
                    }
                }
                if ($(targetElement).offset() != undefined) {
                    setTimeout(function () {
                        $('html, body').animate({
                            scrollTop: $(targetElement).offset().top
                        }, 600);

                    }, 300)
                }
                return false;
            }
        }
    });

    /* START SCROLL FUNCTIONALITY */
    function distanceFromTop(element, scrollTop, offset) {
        var elementOffset = $(element).offset().top;
        var distance = (elementOffset - scrollTop);
        return distance;
    }

    function scrollElements() {
        var scrollTop = $(window).scrollTop(),
            elementOffset, distance;
        return scrollTop;
    }


}(jQuery);
//EQUALIZE COLUMN HEIGHTS
+function ($) {
  'use strict';

    var equalizerObject = $('.equalize').equalizer({
        breakpoint : 480,       // if browser less than this width, disable the plugin
        columns    : '.equalize-inner',
        disabled   : 'noresize' // class applied when browser width is less than the breakpoint value
    });

}(jQuery);
+ function ($) {
    'use strict';

    /**
     * EVENTS CALENDAR
     */

    if (typeof eventsArray !== 'undefined') {
        $("#calendar, .js-events-calendar").fullCalendar({
            header: {
                left: "prev,next today",
                center: "title",
                right: "month,basicWeek,basicDay"
            },
            height: 800,
            defaultDate: eventsDate,
            editable: !1,
            eventLimit: !0,
            events: eventsArray
        });
    }

    $('.calendar-trigger').click(function () {
        console.log("load veiw");
        return false;
    });

}(jQuery);
+ function ($) {
    'use strict';

    /**
     * LIGHTBOX
     */

    //show large is when wanting to force the accordion to show on the large screen, see course page
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();

    });
    
}(jQuery);
+ function ($) {
    'use strict';

    /**
     *  $MULTI-SELECT - Form element
     */

    $('.multi-select').change(function () {
        //var selectedTitle = $(this).children(":selected").text();
    }).multipleSelect({
        selectAll : true,
        selectAllText : 'Select all',
        width: '100%'
    });

}(jQuery);



jQuery(function($) { //different for timing and wordpress

/**
 * Nav priority
 */
    
    $(document).ready(function() {
        priorityNav();       
        dropdownNav();
    });
  
    var resizeTimer;

    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            priorityNav();            
        }, 300);
    });

  	/**
  	 * Priority Nav
  	 */    

    var savedWidth = [];

  	function priorityNav(){      

        $('.tk-nav-priority').each(function(){

            var otherNavWidths = 0; //workout the widts of other lists in the nav      
                $(this).find('.tk-nav-list').not('.tk-nav-list-primary').each(function() {
                   otherNavWidths += $(this).width();                   
                });
                    
      		var windowWidth = window.innerWidth;
                $navListPrimary = $('.tk-nav-list-primary', this),  			
                $navListSecondary = $('.tk-nav-list-secondary', this),            
      			navListPrimaryWidth = $navListPrimary.width(),
      			navContainerWidth = $('.tk-nav-inner').width() - otherNavWidths;                

            //console.log(otherNavWidths);

            if(windowWidth >= '480') { // if Desktop                

        		if(navListPrimaryWidth > navContainerWidth) { //if list is wider than container            
        			if(!$navListSecondary.length){
        				createMoreDropdown(this);
        			}            
        			$navListPrimary.children().last().prependTo('.tk-nav-list-secondary > li > ul');
                    savedWidth.push(navListPrimaryWidth); //save list width      
                    $('.tk-nav-list li.tk-nav-dropdown', this).removeClass('active'); //close every                                               			
        		} else {            
                    if(navContainerWidth >= savedWidth[savedWidth.length-1]){ //is there's room for an extra one
                        $('.tk-nav-list li.tk-nav-dropdown', this).removeClass('active'); //close every open thing                                
                        $('> li > ul', $navListSecondary).children().first().appendTo($navListPrimary);
                        savedWidth.pop();                   
                    }            
                    if(!$('ul', $navListSecondary).has('li').length){ //if more nav-dropdown empty
                        $navListSecondary.remove();
                    }             				  				 
        		}

        		if(navListPrimaryWidth > navContainerWidth) { //reoccur until the list is smaller than container
        			priorityNav();
        		}        

            } else { //Mobile
                if($('ul', $navListSecondary).has('li').length){ //if more nav-dropdown not empty                
                    $('.tk-nav-list li.tk-nav-dropdown', this).removeClass('active'); //close everything                        
                    $('> li > ul', $navListSecondary).children().first().appendTo($navListPrimary);
                    savedWidth.pop(); 
                    priorityNav(); //reoccur until empty                          
                } else {
                    $navListSecondary.remove();
                }            
            }

        });
  	}

  	function createMoreDropdown(thisEl){

  		var elMore =    '<ul class="tk-nav-list tk-nav-list-secondary">'
	                        +'<li class="tk-nav-dropdown tk-nav-dropdown-more">'
	                            +'<a href="#">More</a>'
	                                +'<ul></ul>'
	                        +'</li>'
	                    +'</ul>';

    	$('.tk-nav-list-primary', thisEl).after(elMore);

  	}

/**
 * DROPDOWN NAV
 */

 var dropdownNav = function(){

    $(document).on('click', '.tk-nav .tk-nav-list li.tk-nav-dropdown > a', function() {            

        var $dropdown = $(this).parent();

        if($dropdown.hasClass('active')){            
            $('.tk-nav .tk-nav-list li.tk-nav-dropdown').not($dropdown.parents()).removeClass('active').find('> ul').slideUp('fast');
            $dropdown.removeClass('active').find('> ul').slideUp('fast');                    
        } else {            
            $('.tk-nav .tk-nav-list li.tk-nav-dropdown').not($dropdown.parents()).removeClass('active').find('> ul').slideUp('fast');
            $dropdown.addClass('active').find('> ul').slideDown('fast');
        }

        return false;

    });

};

function closeNav(){
    $('.tk-nav .tk-nav-list li.tk-nav-dropdown').removeClass('active').find('> ul').slideUp('fast');                
}

$('body').click(function(e){  
    //For descendants of nav being clicked
    if(!$(e.target).closest('.tk-nav').length){
        closeNav();
    }     
});        

//console.log($(e.target).attr('class'));

// if($(e.target).hasClass()){
//    console.log($(e.target).attr('class'));                     
// } else {
//     console.log($(e.target));
// }

//console.log($(e.target);//.attr('class'));

//if($(e.target).attr('class')) {

    //console.log('has');


//}

// if($(e.target).closest('#menu_content').length) {
//     console.log(2);
//     return;             
// }

});




+function ($) {
    'use strict';
    var breakpoint = 767;
    /**
     * News and events widget filter dropdwon
     */

    $('.js-cat-filter').each(function () {

        $(this).click(function () {
            $(this).parent('.tk-tabs-header').next().find('.filter-box').toggleClass('active');
            $(this).toggleClass('active');
            return false;
        });

    });

    $(document).on('click', '.filter-box a', function () {

        $('.filter-box').removeClass('active');
        $('.js-cat-filter').removeClass('active');
        var $thisRow = $(this).closest('.tab-pane').find('.row, .tk-row');
        $thisRow.html('<p>Loading...</p>');

        var type = $(this).data('type'),
            category = $(this).data('category'),
            dispcats = $(this).data('dispcats'),
            dispexcerpt = $(this).data('dispexcerpt'),
            dispimage = $(this).data('dispimage'),
            sidebar = $(this).data('sidebar'),
            ajaxedEl = '.' + type + '' + '-item',
            number = 4;

        $.ajax({
            url: PROTOCOL + DOMAIN + AJAX_NEWS_EVENTS, 
            type: 'get',
            data: ({
                categoryID: category,
                type: type,
                dispcats: dispcats,
                dispexcerpt: dispexcerpt,
                dispimage: dispimage,
                sidebar: sidebar
            }),
            dataType: 'html',
            success: function (result) {
                var slicedResults = $($.parseHTML(result)).filter(ajaxedEl).slice(0, number);
                $thisRow.html(slicedResults);
                if (slicedResults.length <= 0) {
                    $thisRow.html('<p>Sorry your filter did not return any results.</p>');
                }
                equalizeTabbedContent();
                //console.log('successs');
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
        return false;
    });

    /**
     * Function to equlize after content ajaxed
     */

    //Trigger on tab change
    $('*[data-toggle]').click(function () {
        setTimeout(function () {
            equalizeTabbedContent();
            $(document).trigger('resize');
        }, 150);
    })

    function equalizeTabbedContent() {
        $('.tab-pane.active .equalize').each(function () {
            // Cache the highest
            var highestBox = 0;
            // Select and loop the elements to equalise
            $('.equalize-inner', this).each(function () {
                $(this).attr('style', " "); //remove inline style
                if (window.innerWidth >= breakpoint) {
                    // If this .equalize-inner is higher than the cached highest then store it
                    if ($(this).height() > highestBox) {
                        highestBox = $(this).height();
                    }
                }
            });
            if (window.innerWidth >= breakpoint) {
                // Set the height of all those children to whichever was highest 
                $('.equalize-inner', this).height(highestBox);
            }
        });
    }

    var resizeTimer;
    $(window).on('resize', function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            //equalize after ajax
            equalizeTabbedContent();
        }, 150);
    });

}(jQuery);
+function ($) {
  'use strict';

  	/**
     * TURN ON SVG's IF COMPATIBLE (requires .js-png-svg or .js-to-svg-uri if using uri in a data attr)
     */

    if(Modernizr.svg) {    

        $('img.js-png-svg[src*="png"]').attr('src', function() {        
            return $(this).attr('src').replace('.png', '.svg');
        });

        $('img.js-png-svg-uri').each(function(){ //used on header logos
        	var svgUri = $(this).data('uri');
        	$(this).attr('src', svgUri);
        });

    } 

}(jQuery);






+function ($) {
  'use strict';

  	/**
     * PRINT BUTTON
     */

    $('.js-print-trigger').click(function(){
    	window.print();
    });

}(jQuery);






+function ($) {
  'use strict';

  	/**
     *  $HEADER-SEARCH
     */

	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();

	//var items = [];

	function createQuickSearch(title, url, cats, type, desc){		
		var quicksearch = '<div id="quicksearch" class="wrapper-lg wrapper-padded wrapper-relative"><div class="quick-search"><ul></ul></div></div>';
		var listItem = '<li><a href="'+url+'"><span class="title">'+title+'</span><span class="excerpt">'+desc+'</span><!--<span class="type">'+type+'</span><span class="category">'+cats+'</span>--></a></li>';
		
		if(!$('#quicksearch').length){
			$('#sitesearch').after(quicksearch);
		}

		if($('#quicksearch').length){
			$('#quicksearch ul').append(listItem);
		}

	}

	function quickSearch(inputVal){			

		$.getJSON( PROTOCOL + DOMAIN + SEARCH_RESULTS +'?query=' + inputVal + "&searchOption=" + 'searchSite', function(data) {								
			$('#quicksearch').remove();
			$.each(data, function(i, data) {											
				createQuickSearch(data.title, data.url, data.cats, data.type, data.description);
				if(data.title == null){
					$('#quicksearch').remove();
				}
			});						
		}).fail(function(){
			$('#quicksearch').remove();
			console.log('data missing');
		});
	}	

	$('#searchInput').bind("change paste keyup", function(e){

		// We don't want thousands of AJAX requests so introduce a small delay between searches
	    // Don't search on esc or arrow keys, escape, left arrow, up arrow, right arrow, down arrow

	    var inputVal = $.trim($(this).val()),
	    	inputValLength = inputVal.length;

	    var quicksearchLi = $('.quick-search li');

	    //trigger quicksearch
	    if (e.which !== 27 && e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40 && typeof e.which !== 'undefined') {
	    	if($('#searchOption option:selected').val() == 'searchSite') {	    
			    delay(function(){

			    	if(inputValLength >= 3){
						quickSearch(inputVal);
					} else {
						$('#quicksearch').remove();
					}

				}, 300);
			}
		}

		//fake quickdown up and down arrows
		if($('#quicksearch').length && $(this).is(":focus")){
		    if(e.which === 40) {
		    	if(!$('.quick-search li').hasClass('selected') || !quicksearchLi.filter('.selected').next().length){ //if nothing is select or last one is
		    		quicksearchLi.removeClass('selected').first().addClass('selected');
		    	} else {		    		
		    		quicksearchLi.filter('.selected').removeClass('selected').next().addClass('selected');		    		
		    	}
		    	e.preventDefault();
		    	
	        } else if (e.which === 38) { // if up key
	        	if(!$('.quick-search li').hasClass('selected') || !quicksearchLi.filter('.selected').prev().length){ //if nothing is select or first one is
		    		quicksearchLi.removeClass('selected').last().addClass('selected');
		    	} else {		    		
		    		quicksearchLi.filter('.selected').removeClass('selected').prev().addClass('selected');		    		
		    	}
		    	e.preventDefault();
	        }
	    }   

		//prevent form submission on enter
	    $(this).bind("change paste keyup keydown", function(e){ //prevent
			if(e.which === 13 && $('.quick-search li').hasClass('selected')) {
				var href = $('.quick-search li').filter('.selected').find('a').attr('href');
		    	e.preventDefault();
		    	window.location.href = href;	    	
		    }
		});

	});
   
}(jQuery);






+function ($) {
  'use strict';

  	/**
  	 * Quicklinks - Keep track of the state of quicklinks
  	 */

    $('body').click(function(e){ //if click is not in quicklinks or the trigger	close it
        if(!$(e.target).closest('.quicklinks').length && !$(e.target).hasClass('js-quicklinks-toggle')){	    		    		
        	$('.quicklinks').collapse('hide');
        	$('body').removeClass('state-quicklinks-active');	
        }	        
	});   

	$('.js-quicklinks-toggle').click(function(){
		$('body').toggleClass('state-quicklinks-active');		
	});

	$('.js-quicklinks-close').click(function(){
		$('body').removeClass('state-quicklinks-active');	
	});  

}(jQuery);






+function ($) {
  'use strict';

  	/**
     * RESPONSIVE ACCORDION
     */
    
    $('.accordion-content.active').css('display','block'); //prevents the jump on closing the accordion if set to be open on load
    
    $('.accordion-trigger').click(function(){ //show large is when wanting to force the accordion to show on the large screen, see course page
        if (!$(this).hasClass(['show-large', 'show-lg']) ||  $(window).width() < 769) {
            $(this).toggleClass('active').next('.accordion-content').slideToggle().toggleClass('active');
        }
        return false;
    });

}(jQuery);
+ function ($) {
    'use strict';

    $('iframe').each(function(){ //wrap iframes that have a src of youtybe in BS repsonsive video div

    	var url = $(this).attr('src'),
    		suburl = "youtube.com";

    	if(url.indexOf(suburl) > -1) {
    		$(this).wrap('<div class="embed-responsive embed-responsive-16by9 m-b"></div>');
    	}

    });
    
}(jQuery);
+ function ($) {
    'use strict';

    /**
     * SCROLL UP/DOWN
     */

    function updateHash(hashValue) {
        if (history.pushState) {
            history.pushState(null, null, hashValue);
        } else {
            window.location.hash = hashValue;
        }
    }

    //Smooth scroll on inner nav click 
    $(document).on("click", 'a.scroll-to[href*="#"]:not([href="#"])', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var sectionID = this.hash.slice(1);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                
                //If using the fixed nav, offset the scrolll position 
                var fixedNavHeight = 0;
                if ($('#fixed-section').length > 0){
                    fixedNavHeight = $('#fixed-section').outerHeight();
                }
                                
                $('html,body').animate({
                    scrollTop: target.offset().top - fixedNavHeight
                }, 450, function () {
                    //If is on mobile check if accordion element open, if not open
                    if ($(window).width() < 769 && !$('#' + sectionID).hasClass('active')) {
                        $('#' + sectionID).trigger('click');
                    }
                    updateHash('#' + sectionID)

                });
                return false;
            }
        }
    });

    $('.scroll-up').click(function () {
        $('html,body').animate({
            scrollTop: 0
        }, 1000, function () {
            updateHash('#');
        });
        return false;
    });

    function loadAccordionFromHash() {
        if (window.location.hash) {
            // Fragment exists
            var hash = document.URL.substr(document.URL.indexOf('#') + 1)
            setTimeout(function () {
                $('a[href="#' + hash + '"]').trigger('click');
            }, 500)
        }
    }

    loadAccordionFromHash();

}(jQuery);
/**
 * Shame JS
 */


+ function ($) { //http://gregfranko.com/blog/jquery-best-practices/

    'use strict';

    //  var thisTarget = $(this).data('target');

    //  //alert(thisTarget);

    //  $('.collapse-bool').not(thisTarget).removeClass('in').addClass('collapsing').on('transitionend webkitTransitionEnd oTransitionEnd', function () {

    //  });

    //  console.log('its a collpser');
    //shame

    //$TODO: extend so collapse triggers other collapses to close with special class namr
    // $('*[data-toggle="collapse"]').click(function(){

    // 	var thisTarget = $(this).data('target');

    // 	//alert(thisTarget);

    // 	$('.collapse-bool').not(thisTarget).removeClass('in').addClass('collapsing').on('transitionend webkitTransitionEnd oTransitionEnd', function () {

    // 	});

    $('.expander-trigger').click(function (e) {
        e.preventDefault();
    });

    /**
     * ACCESSIBLE OUTLINES - Remove Outlines accessibly on click, add when tabbing
     */

    //$('body').removeClass('wai-outline');

    $('body').mousedown(function () {
        $(this).addClass('no-outline');
    });

    $('body').keydown(function () {
        $(this).removeClass('no-outline');
    });

    //multipage/page-contents-nav nav

    $('.multi-page-btn, .page-contents-btn').click(function () {
        $('.multi-page-nav, .page-contents-nav').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Iframe modal (make full height)

    $('.modal-iframe').on('show.bs.modal', function () {
        $('.modal-iframe .modal-content').css('height', $(window).height());
    });


    // $(window).scroll(function(){
    //     $('.swiper-2 .slide-img')
    // });

   

    $(window).scroll(function(){
        var x = $(this).scrollTop();
        $('.swiper-2.swiper-full-width .slide-img').css('background-position', '0px ' + (-20 + parseInt(x / 10)) + 'px');
    });


}(jQuery);


+function ($) {
  'use strict';

  	/**
     * SIDEBAR 
     */

    $('.sidebar-nav').find('li.active').parentsUntil( $('.sidebar-nav'), "li" ).addClass('open');

    $('.js-sidebar-trigger').click(function(){       
        $('body').toggleClass('state-sidebar-active');        
    });

    $('.sidebar-nav li.dropdown > a').click(function(){

      if($(this).parent().hasClass('open')) {
        $(this).parent().find('ul').slideUp(function(){ 
          $(this).parent().removeClass('open');          
        }); 
      }

      if(!$(this).parent().hasClass('open')) {        
        //close others
        $('.sidebar-nav ul').not($(this).parents()).slideUp(function(){
          $(this).parent().removeClass('open');
        });
        $(this).parent().find('> ul').slideDown(function(){
          $(this).parent().addClass('open');          
        });
      }

      return false;

    });

}(jQuery);






+function ($) {
  'use strict';

  	/**
     *  $HEADER-SEARCH & SEARCH RESULTS
     */

    $('.js-site-search-toggle').click(function(){
		$(this).toggleClass('active');
		if($(this).hasClass('active')) {
			setTimeout(function() {
				$('#searchInput').trigger('focus');
			}, 100);
		} else {
			$('#quicksearch').remove(); //remove quicksearch
		}
	});	

	$('.js-action-toggle').each(function(){
		$(this).change(function(){			
			var action = $(this).find('option:selected').data('action');
			$(this).parents('form').attr('action', action);		
			$('#quicksearch').remove();
		});
	});

	$('.js-option-reveal').each(function(){
		$(this).change(function(){
			$(this).find('option').each(function(){
				if($(this).attr('data-reveal')){
					var dataHide = '#'+$(this).attr('data-reveal');
					$(dataHide).hide();
				}
				if($(this).is(':selected')&&$(this).attr('data-reveal')) {
					var dataShow = '#'+$(this).attr('data-reveal');
					$(dataShow).show();
				}
			});

			//var action = $(this).find('option:selected').data('action');
		});
	});

	$('body').click(function(e){      	
  		//if not in site-search and the trigger and trigger children
    	if(!$(e.target).closest('.site-search').length && !$(e.target).closest('.js-site-search-toggle').length && !$(e.target).hasClass('js-site-search-toggle')){	    		    		
        	$('.site-search').collapse('hide');
        	$('.js-site-search-toggle').removeClass('active');	        	
        	$('#quicksearch').remove(); //remove quicksearch
        }	        
	}); 
   
}(jQuery);






+function ($) {
  'use strict';

  	/**
     * SOCIAL SHARE TOGGLE
     */

    $('.js-pretty-social').prettySocial();  

}(jQuery);






+ function ($) {
    'use strict';

    $('.swiper-container').each(function (index, element) {

        $(this).parent('.js-slider').addClass('s' + index);

        var mySwiper = new Swiper('.s' + index + ' .swiper-container', {
            loop: false
            , grabCursor: true
            , slidesPerView: 1
            , onSlideChangeStart: function () {

                var activeSlide = mySwiper.activeIndex
                    , slideCount = $('.s' + index + ' .swiper-slide').length - 1;

                $('.s' + index + ' .swiper-tabs li').removeClass('active');
                $('.s' + index + ' .swiper-tabs li a[data-slide*=' + (mySwiper.activeIndex) + ']').parent().addClass('active');

                //console.log(activeSlide);

                if (activeSlide === 0) {
                    $('.s' + index + ' .swiper-button-prev').addClass('disabled');
                } else {
                    $('.s' + index + ' .swiper-button-prev').removeClass('disabled');
                }

                if (activeSlide === slideCount) {
                    $('.s' + index + ' .swiper-button-next').addClass('disabled');
                } else {
                    $('.s' + index + ' .swiper-button-next').removeClass('disabled');
                }

            }
        });

        var activeSlide = mySwiper.activeIndex
            , slideNum = $('.s' + index + ' .swiper-slide').length - 1;

        function goToSlide(num) {
            mySwiper.swipeTo(num);
            $('.s' + index + ' .swiper-tabs li').removeClass('active');
            $('.s' + index + ' .swiper-tabs li a[data-slide*=' + num + ']').parent().addClass('active');
            //window.location = '#slide'+(num+1);
        }

        //LEFT & RIGHT ARROWS

        $('.s' + index + ' .swiper-button').on('click', function (e) {
            var activeIndex = mySwiper.activeIndex;

            if ($(this).hasClass('swiper-button-next') && activeIndex < slideNum) {
                goToSlide(activeIndex + 1);

            } else if ($(this).hasClass('swiper-button-prev') && activeIndex > 0) {
                goToSlide(activeIndex - 1);
            }

            return false;
        });

        //SET UP SWIPER TABS
        $('.s' + index + ' .swiper-tabs li a').click(function (swiper) {
            goToSlide($(this).data('slide'));
            return false;
        });

    });

    

    $(document).ready(function () {

        $('.js-swiper-scroll').click(function () {
            var $this = $(this);

            $('html, body').animate({
                scrollTop: $this.offset().top
            }, 500);

            return false;
        });


        ///////OWL carousel


        $('.swiper').owlCarousel({ //Initialize Plugin

            // Most important owl features
            // items : 1,
            // itemsCustom : false,
            // itemsDesktop : [1199,1],
            // itemsDesktopSmall : [980,1],
            // itemsTablet: [768,1],
            // itemsTabletSmall: false,
            // itemsMobile : [479,1],

            singleItem: true
            , itemsScaleUp: false,

            //Basic Speeds
            slideSpeed: 200
            , paginationSpeed: 800
            , rewindSpeed: 1000,

            //Autoplay
            autoPlay: false
            , stopOnHover: false,

            // Navigation
            navigation: true
            , navigationText: ["prev", "next"]
            , rewindNav: false
            , scrollPerPage: false,

            //Pagination
            pagination: false
            , paginationNumbers: false,

            // Responsive 
            responsive: true
            , responsiveRefreshRate: 200
            , responsiveBaseWidth: window,

            // CSS Styles
            baseClass: "owl-carousel"
            , theme: "owl-theme",

            //Lazy load
            lazyLoad: false
            , lazyFollow: false
            , lazyEffect: false,

            //Auto height
            autoHeight: true,

            //JSON 
            jsonPath: false
            , jsonSuccess: false,

            //Mouse Events
            dragBeforeAnimFinish: true
            , mouseDrag: true
            , touchDrag: true,

            //Transitions
            transitionStyle: false,

            // Other
            addClassActive: true,

            //Callbacks
            beforeUpdate: false
            , afterUpdate: false
            , beforeInit: false
            , afterInit: false
            , beforeMove: false
            , afterMove: updateSwiperNav
            , afterAction: false
            , startDragging: false
            , afterLazyLoad: false


        });


        //for the multi-slide options
        $('.swiper-multi').each(function (index, element) {
            var owl = $(this).data('owlCarousel').reinit({
                items: 5
                , singleItem: false
                , autoHeight: false
            });
        });

        //update the tab (nested) swipers on tab visible
        $('.nav-tabs li a').click(function () {
            //for the multi-slide options
            setTimeout(function () {
                $('.swiper-multi').each(function (index, element) {
                    var owl = $(this).data('owlCarousel').reinit({
                        items: 5
                        , singleItem: false
                        , autoHeight: false
                    });
                });
                $(window).trigger('resize');
            }, 200);
        })


        //Swiper tabs nav

        $('.swiper-nav a').on('click', function () {

            var thisHref = $(this).attr('href')
                , slideNumber = thisHref.substr(thisHref.length - 1);

            var owl = $(this).parents('.swiper-nav').prev('.swiper')
                , owlData = owl.data('owlCarousel'); // get carousel instance data and store it in variable owl                        

            owlData.goTo(slideNumber);

            return false;

        });

        function updateSwiperNav() {

            var owl = $('.swiper')
                , slideNumber = this.owl.owlItems.length
                , activeSlideIndex = this.owl.currentItem
                , thisSwiperNav = $(this.$elem).next('.swiper-nav')
                , thisNavLinks = thisSwiperNav.find('a').parent()
                , activeNavLink = thisSwiperNav.find('a[href$="' + activeSlideIndex + '"]').parent();

            thisNavLinks.removeClass('active');
            activeNavLink.addClass('active');

            var prevButton = $(this.$elem).find('.owl-prev')
                , nextButton = $(this.$elem).find('.owl-next');

            //console.log(activeSlideIndex);

            // if(activeSlideIndex == slideNumber-1){
            //     nextButton.addClass('disabled');
            //     prevButton.removeClass('disabled');

            // } else if (activeSlideIndex == 0) {
            //     prevButton.addClass('disabled');
            //     nextButton.removeClass('disabled');
            // } else {
            //     prevButton.removeClass('disabled');
            //     nextButton.removeClass('disabled');
            // }

        }

        //    $('.owl-buttons > div').on('click', function() {

        //     if($(this).hasClass('disabled')) {
        //         //return false;
        //     }

        //  });

        // function swiperArrows(){

        //     //$(this.$elem).find('.owl-prev').addClass('disabled');

        // }


    });

}(jQuery);
/*
* tablesaw: A set of plugins for responsive tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/
+(function( $ ) {
	// DOM-ready auto-init of plugins.
	// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
		$( document ).trigger( "enhance.tablesaw" );
})( jQuery );
+function ($) {
  'use strict';

  	/**
     * TOGGLER - Toggle a target and trigger with a class name
     */

    $('*[data-toggle="toggle"]').click(function(){

    	var target = $(this).data('target');

    	if(!$(this).hasClass('toggled')){

    		$(this).addClass('toggled');
    		$(target).addClass('toggled');

    	} else {

    		$(this).removeClass('toggled');
    		$(target).removeClass('toggled');

    	}

        return false;

     });

}(jQuery);





