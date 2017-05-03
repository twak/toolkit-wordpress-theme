+function(){
    //cookieconsent by insites.com
    var cc = {
        version: "1.0.11",
        jqueryversionrequired: "1.4.4",
        initobj: !1,
        setupcomplete: !1,
        allasked: !1,
        checkedlocal: !1,
        checkedremote: !1,
        remoteresponse: !1,
        frommodal: !1,
        sessionkey: !1,
        noclosewin: !1,
        closingmodal: !1,
        jqueryattempts: 0,
        reloadkey: !1,
        forcereload: !1,
        allagree: !0,
        checkedipdb: !1,
        cookies: {},
        uniqelemid: 0,
        executionblock: 0,
        defaultCookies: {
            social: {},
            analytics: {},
            advertising: {}
        },
        remoteCookies: {},
        approved: {},
        bindfunctions: {},
        checkeddonottrack: !1,
        eumemberstates: ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "GB"],
        settings: {
            refreshOnConsent: !0,
            style: "dark",
            bannerPosition: "bottom",
            clickAnyLinkToConsent: !1,
            privacyPolicy: !0,
            collectStatistics: !1,
            tagPosition: "bottom-left",
            useSSL: !0,
            serveraddr: "https://cookieconsent.silktide.com/",
            clearprefs: !1,
            consenttype: "implicit",
            onlyshowbanneronce: !0,
            hideallsitesbutton: !1,
            disableallsites: !0,
            hideprivacysettingstab: !0,
            scriptdelay: 800,
            testmode: !1,
            overridewarnings: !1,
            onlyshowwithineu: !1,
            ipinfodbkey: !1,
            ignoreDoNotTrack: !1
        },
        strings: {
            jqueryWarning: "Developer: Caution! In order to use Cookie Consent, you need to use jQuery 1.4.4 or higher.",
            noJsBlocksWarning: "Developer: Warning! It doesn't look like you have set up Cookie Consent correctly.  You must follow all steps of the setup guide at http://silktide.com/cookieconsent/code.  If you believe you are seeing this message in error, you can use the overridewarnings setting (see docs for more information).",
            noKeyWarning: "Developer: Warning! You have set the plugin to only show within the EU, but you have not provided an API key for the IP Info DB.  Check the documentation at http://silktide.com/cookieconsent for more information",
            invalidKeyWarning: "Developer: Warning! You must provide a valid API key for IP Info DB.  Check the documentation at http://silktide.com/cookieconsent for more information",
            necessaryDefaultTitle: "Strictly necessary:",
            socialDefaultTitle: "Third party:",
            analyticsDefaultTitle: "Performance:",
            advertisingDefaultTitle: "Advertising",
            defaultTitle: "Default cookie title",
            necessaryDefaultDescription: "Some cookies on this website are strictly necessary and cannot be disabled.",
            socialDefaultDescription: "We use third party cookies to provide additional functionality such as social media integration and blog commenting.",
            analyticsDefaultDescription: "We anonymously collect data about the use and performance of this website to improve your experience.",
            advertisingDefaultDescription: "Adverts will be chosen for you automatically based on your past behaviour and interests.",
            defaultDescription: "Default cookie description.",
            notificationTitle: "We use cookies to ensure you have the best browsing experience, to help us improve our website and for targeted advertising. By continuing to browse the site you are agreeing to our use of cookies. <a href='http://www.leeds.ac.uk/info/5000/about/237/privacy_notice' class='cc-privacy-link'>Find out more about how we use cookies</a> </span>",
            notificationTitleImplicit: "We use cookies to ensure you have the best browsing experience and to help us improve our website. By continuing to browse the site you are agreeing to our use of cookies. <a href='/cookie-policy/' class='cc-privacy-link'> Find out more</a> about how we use cookies.",
            poweredBy: "",
            privacyPolicy: "Privacy policy",
            learnMore: "Learn more",
            seeDetails: "Change your cookie settings",
            seeDetailsImplicit: "Change your cookie settings",
            hideDetails: "Hide your cookie settings",
            savePreference: "Save settings",
            saveForAllSites: "Save for all sites",
            allowCookies: "Close",
            allowCookiesImplicit: "Close",
            allowForAllSites: "Allow for all sites",
            customCookie: "This website uses a custom type of cookie which needs specific approval",
            privacySettings: "Privacy settings",
            privacySettingsDialogTitleA: "Privacy settings",
            privacySettingsDialogTitleB: "for this website",
            privacySettingsDialogSubtitle: "You can choose to enable or disable the different types of cookies used on our website.<br /><br /> ",
            closeWindow: "Save settings",
            changeForAllSitesLink: "Change settings for all websites",
            preferenceUseGlobal: "Use global setting",
            preferenceConsent: "I consent",
            preferenceDecline: "I decline",
            preferenceAsk: "Ask me each time",
            preferenceAlways: "Always allow",
            preferenceNever: "Never allow",
            notUsingCookies: "This website does not use any cookies.",
            clearedCookies: "Your cookies have been cleared, you will need to reload this page for the settings to have effect.",
            allSitesSettingsDialogTitleA: "Privacy settings",
            allSitesSettingsDialogTitleB: "for all websites",
            allSitesSettingsDialogSubtitle: "You may consent to these cookies for all websites that use this plugin.",
            backToSiteSettings: "Back to website settings"
        },
        onconsent: function(a, b) {
            cc.isfunction(b) ? fn = b : (scriptname = b, fn = function() {
                cc.insertscript(scriptname)
            }), cc.cookies && cc.cookies[a] && cc.cookies[a].approved ? (cc.cookies[a].executed = !0, fn()) : window.jQuery ? jQuery(document).bind("cc_" + a, fn) : cc.bindfunctions[a] ? cc.bindfunctions[a][cc.bindfunctions[a].length] = fn : cc.bindfunctions[a] = new Array(fn)
        },
        geturlparameter: function(a) {
            a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var b = "[\\?&]" + a + "=([^&#]*)",
                c = new RegExp(b),
                d = c.exec(window.location.search);
            return null == d ? !1 : decodeURIComponent(d[1].replace(/\+/g, " "))
        },
        isfunction: function(a) {
            var b = {};
            return a && "[object Function]" == b.toString.call(a)
        },
        setup: function() {
            for (jQuery.each(cc.bindfunctions, function(a, b) {
                    for (i = 0; i < b.length; i++) jQuery(document).bind("cc_" + a, b[i])
                }), verstr = jQuery().jquery, parts = verstr.split("."), versionRequired = cc.jqueryversionrequired.split("."), jqueryOk = !0, i = 0; i < parts.length && i < versionRequired.length; i++) {
                if (currentpart = parseInt(parts[i]), requiredpart = parseInt(versionRequired[i]), currentpart < requiredpart) {
                    jqueryok = !1;
                    break
                }
                if (currentpart > requiredpart) break
            }
            jqueryOk || alert(cc.strings.jqueryWarning), jQuery.each(cc.defaultCookies, function(a, b) {
                "necessary" == a ? (cc.defaultCookies[a].title = cc.strings.necessaryDefaultTitle, cc.defaultCookies[a].description = cc.strings.necessaryDefaultDescription) : "social" == a ? (cc.defaultCookies[a].title = cc.strings.socialDefaultTitle, cc.defaultCookies[a].description = cc.strings.socialDefaultDescription) : "analytics" == a ? (cc.defaultCookies[a].title = cc.strings.analyticsDefaultTitle, cc.defaultCookies[a].description = cc.strings.analyticsDefaultDescription) : "advertising" == a && (cc.defaultCookies[a].title = cc.strings.advertisingDefaultTitle, cc.defaultCookies[a].description = cc.strings.advertisingDefaultDescription)
            }), jQuery.each(cc.initobj.cookies, function(a, b) {
                b.title || ("necessary" == a ? cc.initobj.cookies[a].title = cc.strings.necessaryDefaultTitle : "social" == a ? cc.initobj.cookies[a].title = cc.strings.socialDefaultTitle : "analytics" == a ? cc.initobj.cookies[a].title = cc.strings.analyticsDefaultTitle : "advertising" == a ? cc.initobj.cookies[a].title = cc.strings.advertisingDefaultTitle : cc.initobj.cookies[a].title = cc.strings.defaultTitle), b.description || ("necessary" == a ? cc.initobj.cookies[a].description = cc.strings.necessaryDefaultDescription : "social" == a ? cc.initobj.cookies[a].description = cc.strings.socialDefaultDescription : "analytics" == a ? cc.initobj.cookies[a].description = cc.strings.analyticsDefaultDescription : "advertising" == a ? cc.initobj.cookies[a].description = cc.strings.advertisingDefaultDescription : cc.initobj.cookies[a].description = cc.strings.defaultDescription), b.defaultstate || (cc.initobj.cookies[a].defaultstate = "on"), cc.initobj.cookies[a].asked = !1, cc.initobj.cookies[a].approved = !1, cc.initobj.cookies[a].executed = !1
            }), cc.settings.onlyshowwithineu && !cc.settings.ipinfodbkey && alert(cc.strings.noKeyWarning), testmode = cc.geturlparameter("cctestmode"), ("accept" == testmode || "decline" == testmode) && (cc.settings.testmode = testmode), cc.settings.disableallsites && (cc.settings.hideallsitesbutton = !0);
            for (var a in cc.initobj.cookies) cc.cookies[a] = cc.initobj.cookies[a], "accept" == cc.settings.testmode && (cc.approved[a] = "yes"), "decline" == cc.settings.testmode && (cc.approved[a] = "no")
        },
        initialise: function(a) {
            if (cc.initobj = a, void 0 !== a.settings)
                for (var b in a.settings) this.settings[b] = a.settings[b];
            if (void 0 !== a.strings)
                for (var b in a.strings) this.strings[b] = a.strings[b];
            cc.settings.style = "cc-" + cc.settings.style, cc.settings.bannerPosition = "cc-" + cc.settings.bannerPosition, cc.settings.useSSL && (cc.settings.serveraddr = "https://cookieconsent.silktide.com/"), window.jQuery && (cc.setupcomplete = !0, cc.setup())
        },
        calculatestatsparams: function() {
            return params = "c=", first = !0, jQuery.each(cc.initobj.cookies, function(a, b) {
                first ? first = !1 : params += ";", params += encodeURIComponent(a) + ":", cc.approved[a] ? params += cc.approved[a] : params += "none", b.statsid && (params += ":" + b.statsid)
            }), params += "&u=" + encodeURIComponent(document.URL), params
        },
        setsessionkey: function(a) {
            cc.sessionkey = a
        },
        fetchprefs: function() {
            cc.remoteresponse = !1, params = "?s=1", cc.settings.collectStatistics && (params = "?s=1&" + cc.calculatestatsparams()), cc.settings.clearprefs && (params += "&v=1", cc.settings.clearprefs = !1), cc.insertscript(cc.settings.serveraddr + params), setTimeout(function() {
                cc.remoteresponse || cc.checkapproval()
            }, 3e3), this.checkedremote = !0
        },
        responseids: function(a) {
            jQuery.each(a, function(a, b) {
                cc.cookies[a].statsid = b
            })
        },
        insertscript: function(a) {
            var b = document.createElement("script");
            b.setAttribute("type", "text/javascript"), b.setAttribute("src", a), document.getElementsByTagName("head")[0].appendChild(b)
        },
        insertscripttag: function(a) {
            var b = document.createElement("script");
            b.setAttribute("type", "text/javascript"), b.innerHTML = a, document.getElementsByTagName("head")[0].appendChild(b)
        },
        checklocal: function() {
            this.checkedlocal = !0, jQuery.each(cc.cookies, function(a, b) {
                cookieval = cc.getcookie("cc_" + a), cookieval && (cc.approved[a] = cookieval)
            }), this.checkapproval()
        },
        response: function(a) {
            cc.remoteresponse = !0, jQuery.each(a, function(a, b) {
                !cc.cookies[a] || cc.approved[a] && (!cc.approved[a] || "always" != cc.approved[a] && "never" != cc.approved[a]) || cc.setcookie("cc_" + a, b, 365)
            });
            for (var b in a) cc.remoteCookies[b] = a[b], "yes" != this.approved[b] && "no" != this.approved[b] && (this.approved[b] = a[b]);
            jQuery.each(cc.cookies, function(b, c) {
                a[b] || "always" != cc.approved[b] && "never" != cc.approved[b] || (cc.cookies[b].approved = !1, cc.deletecookie(b), delete cc.approved[b])
            }), this.checkapproval()
        },
        deletecookie: function(a) {
            date = new Date, date.setDate(date.getDate() - 1), document.cookie = escape("cc_" + a) + "=; path=/; expires=" + date
        },
        reloadifnecessary: function() {
            (cc.settings.refreshOnConsent || cc.forcereload) && setTimeout("location.reload(true);", 50)
        },
        onkeyup: function(a) {
            27 == a.keyCode && cc.closemodals()
        },
        closemodals: function() {
            cc.closingmodal || (cc.noclosewin ? cc.noclosewin = !1 : (jQuery("#cc-modal").is(":visible") && jQuery("#cc-modal .cc-modal-closebutton a").click(), jQuery("#cc-settingsmodal").is(":visible") && jQuery("#cc-settingsmodal #cc-settingsmodal-closebutton a").click()))
        },
        showbanner: function() {
            jQuery("#cc-tag").fadeOut(null, function() {
                jQuery(this).remove()
            }), jQuery("#cc-notification").remove(), data = '<div id="cc-notification"><div id="cc-notification-wrapper"><p><span>' + cc.strings.notificationTitle + '</span></p><div id="cc-notification-permissions"></div><ul class="cc-notification-buttons"><li><a class="cc-link" href="http://cookieconsent.silktide.com" id="cc-approve-button-allsites">' + cc.strings.allowForAllSites + '</a></li><li><a class="cc-link" href="#" id="cc-approve-button-thissite">' + cc.strings.allowCookies + '</a></li></ul><div class="cc-clear"></div></div></div>', jQuery("body").append(data), cc.settings.hideallsitesbutton && jQuery("#cc-approve-button-allsites").hide(), "implicit" == cc.settings.consenttype && (jQuery("#cc-notification p span").html(cc.strings.notificationTitleImplicit), jQuery("#cc-approve-button-thissite").html(cc.strings.allowCookiesImplicit), jQuery("#cc-approve-button-thissite").parent().after(jQuery("#cc-approve-button-allsites").parent()), jQuery("#cc-approve-button-allsites").hide()), jQuery("#cc-notification-logo").hide(), cc.settings.privacyPolicy && jQuery("#cc-notification-moreinformation").prepend('<a href="' + cc.settings.privacyPolicy + '">' + cc.strings.privacyPolicy + "</a> | "), jQuery("#cc-notification").addClass(cc.settings.style).addClass(cc.settings.bannerPosition), bannerh = jQuery("#cc-notification").height(), jQuery("#cc-notification").hide(), jQuery("#cc-notification-permissions").prepend("<ul></ul>"), allcustom = !0, jQuery.each(cc.cookies, function(a, b) {
                b.asked || (jQuery("#cc-notification-permissions ul").append('<li><input type="checkbox" checked="checked" id="cc-checkbox-' + a + '" /> <label id="cc-label-' + a + '" for="cc-checkbox-' + a + '"><strong>' + b.title + "</strong> " + b.description + "</label></li>"), b.link && jQuery("#cc-label-" + a).append(' <a target="_blank" href="' + b.link + '" class="cc-learnmore-link">' + cc.strings.learnMore + "</a>"), ("social" == a || "analytics" == a || "advertising" == a) && (allcustom = !1), jQuery("#cc-checkbox-" + a).change(function() {
                    jQuery(this).is(":checked") ? jQuery(this).parent().removeClass("cc-notification-permissions-inactive") : jQuery(this).parent().addClass("cc-notification-permissions-inactive")
                }), "off" == b.defaultstate && jQuery("#cc-checkbox-" + a).removeAttr("checked").parent().addClass("cc-notification-permissions-inactive"), "necessary" == a && jQuery("#cc-checkbox-" + a).attr("disabled", "disabled"))
            }), jQuery("#cc-notification-wrapper p").append(' <a class="cc-link" href="#" id="cc-notification-moreinfo">' + cc.strings.seeDetails + "</a>."), "implicit" == cc.settings.consenttype && jQuery("#cc-notification-moreinfo").html(cc.strings.seeDetailsImplicit), jQuery("#cc-notification-moreinfo").click(function() {
                return jQuery(this).html() == cc.strings.seeDetails || jQuery(this).html() == cc.strings.seeDetailsImplicit ? ("implicit" == cc.settings.consenttype && (cc.settings.hideallsitesbutton || jQuery("#cc-approve-button-allsites").show()), jQuery("#cc-approve-button-thissite").html(cc.strings.savePreference), jQuery("#cc-approve-button-allsites").html(cc.strings.saveForAllSites), jQuery(this).html(cc.strings.hideDetails)) : (jQuery.each(cc.cookies, function(a, b) {
                    "off" == b.defaultstate ? (jQuery("#cc-checkbox-" + a).removeAttr("checked"), jQuery(this).parent().addClass("cc-notification-permissions-inactive")) : (jQuery("#cc-checkbox-" + a).attr("checked", "checked"), jQuery(this).parent().removeClass("cc-notification-permissions-inactive"))
                }), "implicit" == cc.settings.consenttype ? (jQuery(this).html(cc.strings.seeDetailsImplicit), jQuery("#cc-approve-button-thissite").html(cc.strings.allowCookiesImplicit), jQuery("#cc-approve-button-allsites").hide()) : (jQuery(this).html(cc.strings.seeDetails), jQuery("#cc-approve-button-thissite").html(cc.strings.allowCookies), jQuery("#cc-approve-button-allsites").html(cc.strings.allowForAllSites))), jQuery("#cc-notification-logo").fadeToggle(), jQuery("#cc-notification-permissions").slideToggle(), jQuery(this).blur(), !1
            }), jQuery("#cc-notification").show(), jQuery("#cc-approve-button-thissite").click(cc.onlocalconsentgiven), cc.settings.clickAnyLinkToConsent && jQuery("a").filter(":not(.cc-link)").click(cc.onlocalconsentgiven), allcustom ? (jQuery("#cc-notification p span").html(cc.strings.customCookie), jQuery("#cc-approve-button-allsites").hide()) : jQuery("#cc-approve-button-allsites").click(cc.onremoteconsentgiven)
        },
        timestamp: function() {
            return Math.round((new Date).getTime() / 1e3)
        },
        locationcallback: function(a) {
            "OK" == a.statusCode && a.countryCode && (ineu = "yes", -1 == jQuery.inArray(a.countryCode, cc.eumemberstates) && (ineu = "no", jQuery.each(cc.cookies, function(a, b) {
                cc.approved[a] = "yes"
            }), cc.settings.hideprivacysettingstab = !0), cc.setcookie("cc_ineu", ineu, 365)), "ERROR" == a.statusCode && "Invalid API key." == a.statusMessage && alert(cc.strings.invalidKeyWarning), cc.checkapproval()
        },
        checkdonottrack: function() {
            cc.checkeddonottrack = !0, cc.settings.ignoreDoNotTrack || ("yes" == navigator.doNotTrack || "1" == navigator.doNotTrack || "yes" == navigator.msDoNotTrack || "1" == navigator.msDoNotTrack) && (cc.settings.consenttype = "explicit"), cc.checkapproval()
        },
        checkapproval: function() {
            if (!cc.checkedipdb && cc.settings.onlyshowwithineu) {
                if (cc.checkedipdb = !0, ineu = cc.getcookie("cc_ineu"), !ineu) return void jQuery.getScript("http://api.ipinfodb.com/v3/ip-country/?key=" + cc.settings.ipinfodbkey + "&format=json&callback=cc.locationcallback");
                "no" == ineu && (jQuery.each(cc.cookies, function(a, b) {
                    cc.approved[a] = "yes"
                }), cc.settings.hideprivacysettingstab = !0)
            }
            if (cc.allasked = !0, jQuery.each(cc.cookies, function(a, b) {
                    cc.approved[a] ? "yes" == cc.approved[a] || "always" == cc.approved[a] && cc.checkedremote ? (cc.cookies[a].asked = !0, cc.cookies[a].approved = !0, cc.execute(a)) : "never" == cc.approved[a] && cc.checkedremote || "no" == cc.approved[a] ? (cc.cookies[a].asked = !0, cc.cookies[a].approved = !1) : cc.allasked = !1 : cc.allasked = !1
                }), cc.allasked) cc.settings.collectStatistics && (params = "", params += "?s=1&n=1&" + cc.calculatestatsparams(), cc.insertscript(cc.settings.serveraddr + params)), cc.showminiconsent();
            else {
                if (!cc.checkedlocal) return void cc.checklocal();
                if (!cc.checkedremote && !cc.settings.disableallsites) return void cc.fetchprefs();
                if (!cc.checkeddonottrack) return void cc.checkdonottrack();
                "implicit" == cc.settings.consenttype && jQuery.each(cc.cookies, function(a, b) {
                    cc.cookies[a].asked || (cc.settings.onlyshowbanneronce && cc.setcookie("cc_" + a, "yes", 365), cc.execute(a))
                }), cc.showbanner()
            }
        },
        execute: function(a) {
            "necessary" != a && (cc.cookies[a].executed || (jQuery(".cc-placeholder-" + a).remove(), jQuery("script.cc-onconsent-" + a + '[type="text/plain"]').each(function() {
                jQuery(this).after(jQuery(this).attr("src") ? '<script type="text/javascript" src="' + jQuery(this).attr("src") + '"></script>' : '<script type="text/javascript">' + jQuery(this).html() + "</script>")
            }), cc.cookies[a].executed = !0, jQuery(document).trigger("cc_" + a), cc.executescriptinclusion(a)))
        },
        executescriptinclusion: function(a) {
            return timetaken = jQuery("script.cc-onconsent-inline-" + a + '[type="text/plain"]').size() * cc.settings.scriptdelay, now = (new Date).getTime(), now < cc.executionblock ? void setTimeout(cc.executescriptinclusion, cc.executionblock - now, [a]) : (cc.executionblock = now + timetaken, void cc.insertscripts(a))
        },
        insertscripts: function(a) {
            jQuery("script.cc-onconsent-inline-" + a + '[type="text/plain"]').first().each(function() {
                cc.uniqelemid++, jQuery(this).parents("body").size() > 0 && (jQuery(this).after('<div id="cc-consentarea-' + cc.uniqelemid + '" class="' + a + '"></div>'), document.write = function(a) {
                    jQuery("#cc-consentarea-" + cc.uniqelemid).append(a)
                }, document.writeln = function(a) {
                    jQuery("#cc-consentarea-" + cc.uniqelemid).append(a)
                }), jQuery(this).after(jQuery(this).attr("src") ? '<script type="text/javascript" src="' + jQuery(this).attr("src") + '"></script>' : '<script type="text/javascript">' + jQuery(this).html() + "</script>"), jQuery(this).remove()
            }), jQuery("script.cc-onconsent-inline-" + a + '[type="text/plain"]').size() > 0 && setTimeout(cc.insertscripts, cc.settings.scriptdelay, [a])
        },
        getcookie: function(a) {
            var b, c, d, e = document.cookie.split(";");
            for (b = 0; b < e.length; b++)
                if (c = e[b].substr(0, e[b].indexOf("=")), d = e[b].substr(e[b].indexOf("=") + 1), c = c.replace(/^\s+|\s+$/g, ""), c == a) return unescape(d);
            return !1
        },
        setcookie: function(a, b, c) {
            var d = new Date;
            d.setDate(d.getDate() + c), document.cookie = a + "=" + b + "; expires=" + d.toUTCString() + "; path=/"
        },
        onremoteconsentgiven: function() {
            return cc.settings.clickAnyLinkToConsent && jQuery("a").filter(":not(.cc-link)").unbind("click"), cc.allagree = !0, jQuery.each(cc.cookies, function(a, b) {
                b.approved || b.asked || (jQuery("#cc-checkbox-" + a).is(":checked") ? ("social" == a || "analytics" == a || "advertising" == a ? (cc.remoteCookies[a] = "always", cc.approved[a] = "always") : cc.approved[a] = "yes", cc.cookies[a].asked = !0) : ("social" == a || "analytics" == a || "advertising" == a ? (cc.remoteCookies[a] = "never", cc.approved[a] = "never") : cc.approved[a] = "no", cc.allagree = !1, cc.cookies[a].asked = !0), cc.setcookie("cc_" + a, cc.approved[a], 365))
            }), urlx = cc.settings.serveraddr + "?p=1&tokenonly=true&cc-key=" + cc.sessionkey, cc.remoteCookies.social && (urlx += "&cc-cookies-social=" + cc.approved.social), cc.remoteCookies.analytics && (urlx += "&cc-cookies-analytics=" + cc.approved.analytics), cc.remoteCookies.advertising && (urlx += "&cc-cookies-advertising=" + cc.approved.advertising), cc.reloadkey = !0, cc.insertscript(urlx), cc.checkapproval(), !1
        },
        onlocalconsentgiven: function() {
            return enableall = !1, enablejustone = !1, (jQuery(this).hasClass("cc-button-enableall") || jQuery(this).hasClass("cc-button-enable-all")) && (enableall = !0, jQuery.each(cc.cookies, function(a, b) {
                cc.cookies[a].asked = !1
            })), elem = this, jQuery.each(cc.cookies, function(a, b) {
                jQuery(elem).hasClass("cc-button-enable-" + a) && (enablejustone = !0, cc.approved[a] = "yes", cc.cookies[a].asked = !0, cc.setcookie("cc_" + a, cc.approved[a], 365))
            }), cc.allagree = !0, enablejustone || (cc.settings.clickAnyLinkToConsent && jQuery("a").filter(":not(.cc-link)").unbind("click"), jQuery.each(cc.cookies, function(a, b) {
                b.approved || b.asked || (enableall || jQuery("#cc-checkbox-" + a).is(":checked") ? (cc.approved[a] = "yes", cc.cookies[a].asked = !0) : (cc.approved[a] = "no", cc.cookies[a].asked = !0, cc.allagree = !1), cc.setcookie("cc_" + a, cc.approved[a], 365))
            })), cc.allagree || "implicit" != cc.settings.consenttype || (cc.forcereload = !0), jQuery("#cc-notification").slideUp(), "cc-push" == cc.settings.bannerPosition && jQuery("html").animate({
                marginTop: 0
            }, 400), cc.checkapproval(), cc.reloadifnecessary(), !1
        },
        showminiconsent: function() {
            0 == jQuery("#cc-tag").length && (data = '<div id="cc-tag" class="cc-tag-' + cc.settings.tagPosition + '"><a class="cc-link cc-tag-button" href="#" id="" title="' + cc.strings.privacySettings + '" rel="nofollow"><span>' + cc.strings.privacySettings + "</span></a></div>", jQuery("body").append(data), jQuery("#cc-tag").addClass(cc.settings.style), cc.settings.hideprivacysettingstab ? jQuery("#cc-tag").hide() : jQuery("#cc-tag").fadeIn(), jQuery(".cc-privacy-link").click(cc.showmodal), jQuery(".cc-tag-button").click(cc.showmodal))
        },
        getsize: function(a) {
            var b, c = 0;
            for (b in a) a.hasOwnProperty(b) && c++;
            return c
        },
        settoken: function(a) {
            cc.reloadkey && (cc.reloadkey = !1, cc.allagree || "implicit" != cc.settings.consenttype || (cc.forcereload = !0), cc.reloadifnecessary()), cc.sessionkey = a
        },
        showmodal: function() {
            return cc.checkedremote || cc.settings.disableallsites || cc.fetchprefs(), jQuery(document).bind("keyup", cc.onkeyup), jQuery("body").append('<div id="cc-modal-overlay"></div>'), jQuery(this).blur(), data = '<div id="cc-modal"><div id="cc-modal-wrapper"><h2>' + cc.strings.privacySettingsDialogTitleA + " <span>" + cc.strings.privacySettingsDialogTitleB + '</span></h2><p class="cc-subtitle">' + cc.strings.privacySettingsDialogSubtitle + '</p><div class="cc-content"></div><div class="cc-clear"></div><p id="cc-modal-closebutton" class="cc-modal-closebutton"><a class="cc-link" href="#" title="' + cc.strings.closeWindow + '"><span>' + cc.strings.closeWindow + '</span></a></p><div id="cc-modal-footer-buttons"><p id="cc-modal-global"><a class="cc-link" href="#" title="' + cc.strings.changeForAllSitesLink + '"><span>' + cc.strings.changeForAllSitesLink + '</span></a></p></div><a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="' + cc.strings.poweredBy + '"><span>' + cc.strings.poweredBy + '</span></a> <div class="cc-clear"></div></div></div>', jQuery("body").append(data), cc.settings.disableallsites && jQuery("#cc-modal-global").hide(), jQuery("#cc-modal").addClass(cc.settings.style).click(cc.closemodals), cc.reloadmodal(), jQuery("#cc-modal").fadeIn(), jQuery("#cc-modal-overlay").fadeIn(), jQuery("#cc-modal-wrapper").click(function() {
                cc.noclosewin = !0
            }), jQuery("#cc-modal .cc-modal-closebutton a").click(function() {
                return cc.showhidemodal(), cc.reloadifnecessary(), !1
            }), jQuery("#cc-modal-global").click(function() {
                return cc.frommodal = !0, cc.gotosettings(), !1
            }), jQuery(".cc-tag-button").unbind("click").click(cc.showhidemodal), jQuery(".cc-privacy-link").unbind("click").click(cc.showhidemodal), !1
        },
        closepreferencesmodal: function() {
            return jQuery.each(cc.defaultCookies, function(a, b) {
                b = jQuery("#cc-globalpreference-selector-" + a).val(), "yes" != cc.approved[a] && "no" != cc.approved[a] && (cc.approved[a] = b, cc.setcookie("cc_" + a, cc.approved[a], 365)), cc.remoteCookies[a] = b
            }), urlx = cc.settings.serveraddr + "?p=1&tokenonly=true&cc-key=" + cc.sessionkey, cc.remoteCookies.social && (urlx += "&cc-cookies-social=" + cc.remoteCookies.social), cc.remoteCookies.analytics && (urlx += "&cc-cookies-analytics=" + cc.remoteCookies.analytics), cc.remoteCookies.advertising && (urlx += "&cc-cookies-advertising=" + cc.remoteCookies.advertising), cc.insertscript(urlx), jQuery("#cc-notification").hide().remove(), jQuery(this).blur(), jQuery("#cc-settingsmodal").fadeOut(null, function() {
                jQuery("#cc-settingsmodal").remove()
            }), cc.frommodal ? (cc.frommodal = !1, cc.showhidemodal()) : (cc.checkapproval(), cc.reloadifnecessary()), !1
        },
        showhidemodal: function() {
            return jQuery(this).blur(), cc.checkedlocal = !1, cc.checkedremote = !1, jQuery("#cc-modal").is(":visible") && !cc.frommodal ? (cc.closingmodal = !0, jQuery("#cc-modal-overlay").fadeToggle(null, function() {
                cc.closingmodal = !1
            }), jQuery.each(cc.cookies, function(a, b) {
                thisval = jQuery("#cc-preference-selector-" + a).val(), "necessary" == a && (thisval = "yes"), "no" == thisval ? (cc.cookies[a].approved = !1, cc.approved[a] = "no", cc.setcookie("cc_" + a, cc.approved[a], 365)) : "yes" == thisval ? (cc.cookies[a].approved = !0, cc.approved[a] = "yes", cc.setcookie("cc_" + a, cc.approved[a], 365)) : (cc.cookies[a].approved = !1, cc.deletecookie(a), delete cc.approved[a]), cc.cookies[a].asked = !1
            }), cc.checkapproval()) : jQuery("#cc-settingsmodal").is(":visible") || jQuery("#cc-modal").is(":visible") || (cc.closingmodal = !0, jQuery("#cc-modal-overlay").fadeToggle(null, function() {
                cc.closingmodal = !1
            })), jQuery("#cc-modal").fadeToggle(), !1
        },
        reloadmodal: function() {
            jQuery("#cc-modal-wrapper .cc-content").html(""), cc.getsize(cc.cookies) > 0 ? (jQuery("#cc-modal-wrapper .cc-content").append("<ul></ul>"), jQuery.each(cc.cookies, function(a, b) {
                jQuery("#cc-modal-wrapper ul").append('<li id="cc-preference-element-' + a + '"><label for="cc-preference-selector-' + a + '"><strong>' + b.title + "</strong><span>" + b.description + '</span></label><select id="cc-preference-selector-' + a + '"><option value="yes">' + cc.strings.preferenceConsent + '</option><option value="no">' + cc.strings.preferenceDecline + "</option></select></li>"), b.link && jQuery("#cc-preference-element-" + a + " label span").append(' <a target="_blank" href="' + b.link + '" class="cc-learnmore-link">' + cc.strings.learnMore + "</a>"), "social" != a && "advertising" != a && "analytics" != a || cc.settings.disableallsites || jQuery("#cc-preference-selector-" + a).append('<option value="global">' + cc.strings.preferenceUseGlobal + "</option>"), jQuery("#cc-change-button-allsites").unbind("click").click(function() {
                    return cc.frommodal = !0, cc.gotosettings(), !1
                }), jQuery("#cc-preference-selector-" + a).change(function() {}), "necessary" == a && jQuery("#cc-preference-selector-" + a).remove(), jQuery("#cc-preference-selector-" + a).val("yes" == cc.approved[a] ? "yes" : "no" == cc.approved[a] ? "no" : "global")
            })) : jQuery("#cc-modal-wrapper .cc-content").append("<p>" + cc.strings.notUsingCookies + "</p>"), jQuery(".cc-content").append('<div class="cc-clear"></div>')
        },
        reloadsettingsmodal: function() {
            jQuery("#cc-settingsmodal-wrapper .cc-content").html(""), cc.getsize(cc.defaultCookies) > 0 ? (jQuery("#cc-settingsmodal-wrapper .cc-content").append("<ul></ul>"), jQuery.each(cc.defaultCookies, function(a, b) {
                jQuery("#cc-settingsmodal-wrapper ul").append('<li id="cc-globalpreference-element-' + a + '"><label for="cc-globalpreference-selector-' + a + '"><strong>' + b.title + "</strong><span>" + b.description + '</span></label><select id="cc-globalpreference-selector-' + a + '"><option value="ask">' + cc.strings.preferenceAsk + '</option><option value="always">' + cc.strings.preferenceAlways + '</option><option value="never">' + cc.strings.preferenceNever + "</option></select></li>"), b.link && jQuery("#cc-globalpreference-element-" + a + " label span").append(' <a target="_blank" href="' + b.link + '" class="cc-learnmore-link">' + cc.strings.learnMore + "</a>"), jQuery("#cc-globalpreference-selector-" + a).change(function() {}), jQuery("#cc-globalpreference-selector-" + a).val("always" == cc.remoteCookies[a] ? "always" : "never" == cc.remoteCookies[a] ? "never" : "ask")
            })) : jQuery("#cc-settingsmodal-wrapper .cc-content").append("<p>" + cc.strings.notUsingCookies + "</p>"), jQuery("#cc-settingsmodal-wrapper .cc-content").append('<div class="cc-clear"></div>')
        },
        approvedeny: function() {
            return key = jQuery(this).attr("id").split("-")[2], cc.cookies[key].approved ? (cc.cookies[key].approved = !1, cc.approved[key] = "no") : (cc.cookies[key].approved = !0, cc.approved[key] = "yes"), cc.setcookie("cc_" + key, cc.approved[key], 365), cc.checkapproval(), cc.reloadmodal(), !1
        },
        clearalllocalcookies: function() {
            for (var a = document.cookie.split(";"), b = 0; b < a.length; b++) {
                var c = a[b],
                    d = c.indexOf("="),
                    e = d > -1 ? c.substr(0, d) : c;
                document.cookie = e + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }
        },
        clearlocal: function() {
            cc.clearalllocalcookies(), jQuery(this).before("<p>" + cc.strings.clearedCookies + "</p>")
        },
        getcurrenturl: function() {
            return window.location.protocol + "//" + window.location.host + window.location.pathname
        },
        gotosettings: function() {
            return jQuery("#cc-modal").is(":visible") && cc.showhidemodal(), jQuery(this).blur(), cc.frommodal ? buttontext = cc.strings.backToSiteSettings : buttontext = cc.strings.closeWindow, data = '<div id="cc-settingsmodal"><div id="cc-settingsmodal-wrapper"><h2>' + cc.strings.allSitesSettingsDialogTitleA + " <span>" + cc.strings.allSitesSettingsDialogTitleB + '</span></h2><p class="cc-subtitle">' + cc.strings.allSitesSettingsDialogSubtitle + '</p><div class="cc-content"></div><div class="cc-clear"></div><p id="cc-settingsmodal-closebutton" class="cc-settingsmodal-closebutton"><a class="cc-link" href="#" title="' + buttontext + '"><span>' + buttontext + '</span></a></p><div id="cc-settingsmodal-footer-buttons"><p id="cc-settingsmodal-secondclosebutton" class="cc-settingsmodal-closebutton"><a class="cc-link" href="#" title="' + buttontext + '"><span>' + buttontext + '</span></a></p></div><a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="' + cc.strings.poweredBy + '"><span>' + cc.strings.poweredBy + "</span></a> </div></div>", jQuery("body").prepend(data), cc.reloadsettingsmodal(), jQuery("#cc-settingsmodal").addClass(cc.settings.style).click(cc.closemodals), jQuery("#cc-settingsmodal-wrapper").click(function() {
                cc.noclosewin = !0
            }), jQuery("#cc-settingsmodal").fadeIn(), jQuery(".cc-settingsmodal-closebutton").click(cc.closepreferencesmodal), !1
        },
        onfirstload: function() {
            if (!cc.setupcomplete && cc.initobj) {
                if (!window.jQuery) {
                    if (cc.jqueryattempts++, cc.jqueryattempts >= 5) return;
                    return void setTimeout(cc.onfirstload, 200)
                }
                cc.setupcomplete = !0, cc.setup()
            }
            setTimeout(cc.afterload, 50), cc.checkapproval()
        },
        afterload: function() {
            jQuery(".cc-button-enableall").addClass("cc-link").click(cc.onlocalconsentgiven), jQuery(".cc-button-enable-all").addClass("cc-link").click(cc.onlocalconsentgiven), jQuery.each(cc.cookies, function(a, b) {
                jQuery(".cc-button-enable-" + a).addClass("cc-link").click(cc.onlocalconsentgiven)
            })
        }
    };
    if (window.jQuery) jQuery(document).ready(cc.onfirstload);
    else {
        var s = document.createElement("script");
        if (s.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"), s.setAttribute("type", "text/javascript"), document.getElementsByTagName("head")[0].appendChild(s), null != window.onload) {
            var oldOnload = window.onload;
            window.onload = function(a) {
                oldOnload(a), cc.onfirstload()
            }
        } else window.onload = cc.onfirstload
    }
    cc.initialise({
        cookies: {
            social: {
                title: 'Facebook',
                description: ' uses cookies to retarg' +
                    'et you with personalised banne' +
                    'r advertising after you have v' +
                    'isited our website.',
                link: ' https://www.facebook.com/policies/cookies/'
            },
            analytics: {
                title: 'Google',
                description: ' cookies allow us to recognise people' +
                    ' who have previously visited our site,' +
                    ' do targeted advertising and help create a better user experience',
                link: 'http://www.networkadvertising.org/choices/'
            }

            ,
            necessary: {
                title: 'Some',
                description: ' cookies on this ' +
                    'website are strictly necessary' +
                    ' and cannot be disabled.',
                link: 'http://www.leeds.ac.uk/info/5000/about/237/privacy_notice'
            }
        },
        settings: {
            consenttype: "implicit",
            bannerPosition: "bottom",
            hideprivacysettingstab: false,
            useSSL: true,
            hideallsitesbutton: true

        },
        strings: {
            notificationTitleImplicit: 'We use cookies to ensure you have the best browsing experience, to help us improve our website and for targeted advertising. By continuing to browse the site you are agreeing to our use of cookies. <a href="http://www.leeds.ac.uk/info/5000/about/237/privacy_notice" class="cc-privacy-link">Find out more about how we use cookies</a> </span> | ',
            seeDetailsImplicit: 'Change your settings',
            hideDetails: 'Hide details'
        }
    });
}();