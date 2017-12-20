


<!-- Typekit Fonts Async -->

if (document.getElementsByTagName("html")[0].className.indexOf("lt-ie9") == -1){
    !function(e,t,n,a,r,c,l,s,o){l=a[r],l&&(s=e.createElement("style"),s.innerHTML=l,e.getElementsByTagName("head")[0].appendChild(s),e.documentElement.className+=" wf-cached"),o=t[n],t[n]=function(e,p,u,i){if("string"==typeof p&&p.indexOf(c)>-1){try{u=new XMLHttpRequest,u.open("GET",p,!0),u.onreadystatechange=function(){try{4==u.readyState&&(i=u.responseText.replace(/url\(\//g,"url("+c+"/"),i!==l&&(a[r]=i))}catch(e){s&&(s.innerHTML="")}},u.send(null)}catch(d){}t[n]=o}return o.apply(this,arguments)}}(document,Element.prototype,"setAttribute",localStorage,"tk","https://use.typekit.net");}

(function() {
    var config = {
        kitId: 'vlw5ilb'
    };
    var d = false;
    var tk = document.createElement('script');
    tk.src = '//use.typekit.net/' + config.kitId + '.js';
    tk.type = 'text/javascript';
    tk.async = 'true';
    tk.onload = tk.onreadystatechange = function() {
        var rs = this.readyState;
        if (d || rs && rs != 'complete' && rs != 'loaded') return;
        d = true;
        try { Typekit.load(config); } catch (e) {}
    };
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(tk, s);
})();

(function($) {

    $(function() {
        $('.sidebar-widget').on('click', 'h3', function(){
            $(this).closest('.sidebar-widget').find('ul').toggleClass('show');
        });
    });

}(jQuery));

// Toggle Category sidebar widget
(function($) {

    $(function() {
        $('.widget_categories, .widget_nav_menu, .widget_text').on('click', '.js-widget-toggle', function(){
            $(this).toggleClass('js-widget-toggle--active').parent().find('.sidebar-nav--widget, .sidebar-nav, .textwidget').toggleClass('show');
        });
    });

}(jQuery));
