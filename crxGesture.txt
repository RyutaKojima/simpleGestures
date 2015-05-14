if (!teststroke) {
    var teststroke = false;
}
if (!optpages) {
    var optpages = false;
}
if (!testdrag) {
    var testdrag = false;
}
if (!testgesture) {
    var testgesture;
}

var autocanceltimer;
var tostop = false;
var isOptionsPage = false;
var returnvalue;
var hScroll;
var CMGtitletest = false;
var CMGstroketest = false;


/**/
//var cmgiframe=document.createElement("iframe");
//cmgiframe.src="http://www.baidu.com";
//cmgiframe.id="imgdown"
//document.body.appendChild(cmgiframe);

chrome.extension.sendMessage({type: "config"}, function (response) {
    if (optpages) {
        window.setInterval(function () {
            if (needToInit) {
                needToInit = false;
                cmg.constinit();
            }
        }, 500)
    }
    function getConfig(cfg1, cfg2) {
        if (optpages) {
            return config[cfg1][cfg2];
        }
        else {
            return response[cfg1][cfg2];
        }
    }

    function getId() {
        if (optpages) {
            return config.extid;
        }
        else {
            return response.extid;
        }
    }

    function hideScroll() {
        if (document.documentElement) {
            document.documentElement.style.overflow = "hidden";
            //window.clearInterval(hScroll);
        }
        return true;
    }

//	if(getId()=="ndngmdgflkabdpenjbofkebpaoppb"
//		||getId()==""
//		||getId()=="none"){}
//	else{
//		var idcheckbox=document.createElement("div");
//			idcheckbox.id="idcheckbox";
//			idcheckbox.innerHTML="当前所使用的CrxMouse并非来至官方渠道,请从一下地址重新安装:<a href='' target='_blank'>chrome web store</a>"
//		document.body.appendChild(idcheckbox);
//		crxmouse.end();
//		}

    var cmg = {
        _lastX: 0,
        _lastY: 0,
        _directionChain: "",
        _isMousedown: false,
        _suppressContext: false,
        _cancelmenu: false,
        _toautocancel: false,
        _scroll_targets: [],
        constinit: function () {
            cmg.valuegesture = getConfig("normal", "gesture");
            cmg.valuedrag = getConfig("normal", "drag");
            cmg.valuescroll = getConfig("normal", "scroll");
            cmg.valuestrokegesture = getConfig("normal", "strokegesture");
            cmg.valueautocancel = getConfig("normal", "autocancel");
            cmg.valuescrollgesture = getConfig("normal", "scrollgesture");
            cmg.valueautocancelvalue = getConfig("normal", "autocancelvalue");
            cmg.valueminlength = getConfig("normal", "minilength");
            cmg.dbclicktime = getConfig("normal", "dbclicktime");
            cmg.valuescrolleffects = getConfig("normal", "scrolleffects");

            cmg.valuegeskey = getConfig("gesture", "geskey");
            cmg.valuegestureui = getConfig("gesture", "gestureui");
            cmg.valuestroke = getConfig("gesture", "stroke");
            cmg.valuestrokecolor = getConfig("gesture", "strokecolor");
            cmg.valuestrokeopa = getConfig("gesture", "strokeopa");
            cmg.valuestrokewidth = getConfig("gesture", "strokewidth");
            cmg.valuedirect = getConfig("gesture", "direct");
            cmg.valuetooltip = getConfig("gesture", "tooltip");
            cmg.valuedirectcolor = getConfig("gesture", "directcolor");
            cmg.valuedirectopa = getConfig("gesture", "directopa");
            cmg.valuetooltipwidth = getConfig("gesture", "tooltipwidth");
            cmg.valuetooltipcolor = getConfig("gesture", "tooltipcolor");
            cmg.valuetooltipopa = getConfig("gesture", "tooltipopa");
            cmg.valuestenable = getConfig("gesture", "stenable");
            cmg.valuegholdkey = getConfig("gesture", "gholdkey");

            cmg.valueimgfirst = getConfig("drag", "imgfirst");
            cmg.valuedholdkey = getConfig("drag", "dholdkey");
            cmg.valueimgfirstcheck = getConfig("drag", "imgfirstcheck");
            cmg.valuedragtext = getConfig("drag", "dragtext");
            cmg.valuedraginput = getConfig("drag", "draginput");
            cmg.valuedraglink = getConfig("drag", "draglink");
            cmg.valuedragimage = getConfig("drag", "dragimage");
            cmg.valuesetdragurl = getConfig("drag", "setdragurl");
            cmg.valuedragui = getConfig("drag", "dragui");
            cmg.valuedstroke = getConfig("drag", "dstroke");
            cmg.valuedstrokecolor = getConfig("drag", "dstrokecolor");
            cmg.valuedstrokeopa = getConfig("drag", "dstrokeopa");
            cmg.valuedstrokewidth = getConfig("drag", "dstrokewidth");
            cmg.valueddirect = getConfig("drag", "ddirect");
            cmg.valuedtooltip = getConfig("drag", "dtooltip");
            cmg.valueddirectcolor = getConfig("drag", "ddirectcolor");
            cmg.valueddirectopa = getConfig("drag", "ddirectopa");
            cmg.valuedtooltipwidth = getConfig("drag", "dtooltipwidth");
            cmg.valuedtooltipcolor = getConfig("drag", "dtooltipcolor");
            cmg.valuedtooltipopa = getConfig("drag", "dtooltipopa");

            cmg.valuesmooth = getConfig("scroll", "smooth");
            cmg.valuescrollaccele = getConfig("scroll", "scrollaccele");
            cmg.valuescrollspeed = getConfig("scroll", "scrollspeed");

            cmg.valuestrleftenable = getConfig("strokegesture", "strleftenable");
            cmg.valuestrmiddleenable = getConfig("strokegesture", "strmiddleenable");
            cmg.valuestrrightenable = getConfig("strokegesture", "strrightenable");
            cmg.valuestrpress = getConfig("strokegesture", "strpress");

            cmg.valuetablist = getConfig("scrollgesture", "tablist");
            cmg.valuetablistkey = getConfig("scrollgesture", "tablistkey");
            cmg.valuesgsleftenable = getConfig("scrollgesture", "sgsleftenable");
            cmg.valuesgsrightenable = getConfig("scrollgesture", "sgsrightenable");

            cmg.disrightopt = getConfig("normal", "cancelcontextmenu") && window.navigator.userAgent.toLowerCase().indexOf("windows") == -1 ? true : false;

            cmg.tuilink = getConfig("others", "tuilink");

            if (!document.doctype) {
                cmg.fixPaddingBottom = true;
            }
            else if (document.doctype.publicId == ""
                || document.doctype.publicId == "-//W3C//DTD HTML 4.01//EN"
                || document.doctype.publicId == "-//W3C//DTD XHTML 1.0 Strict//EN"
                || document.doctype.publicId == "-//W3C//DTD XHTML 1.1//EN"
                || document.doctype.publicId == "-//WAPFORUM//DTD XHTML Mobile 1.0//EN") {
                cmg.fixPaddingBottom = false;
            }
            else {
                cmg.fixPaddingBottom = true;
            }

        },
        init: function () {
            window.addEventListener("mousescroll", this, false);
            if (cmg.valuegesture || cmg.valuedrag || cmg.valuescroll || cmg.valuescrollgesture || cmg.valuestrokegesture) {
                window.addEventListener("mousedown", this, false);
                window.addEventListener("mousemove", this, false);
                window.addEventListener("mouseup", this, false);
                document.addEventListener("contextmenu", this, false);
            }
            if (cmg.valuedrag) {
                window.addEventListener("dragstart", this, false);
                window.addEventListener("drag", this, false);
                window.addEventListener("drop", this, false);
                window.addEventListener("dragenter", this, false);
                window.addEventListener("dragover", this, false);
                window.addEventListener("dragend", this, false);
            }
            if (cmg.valuescroll || cmg.valuescrollgesture) {
                window.addEventListener("mousewheel", this, false);
            }
            if (CMGtitletest) {
                window.setInterval(function () {
                    document.title = cmg.test;
                }, 50)
            }
        },
        handleEvent: function (e) {
            switch (e.type) {
                case "mousedown":
                    /*fix click scrollbar*/
                    if (e.clientX > document.documentElement.offsetWidth - 2) {
                        return;
                    }

                    if (!cmg.gholdkeyopt) {
                        cmg.gholdkey = false;
                    }
                    /*stroke gesture action*/
                    if (cmg.toStrges && cmg.valuestrpress == "down") {
                        chrome.extension.sendMessage({type: "strokegesture", hold: cmg.toStrges, LR: e.button}, function (response) {
                            cmg.transmsg = response;
                            cmg._gestureaction(response.action);
                            if (e.button != 0) {
                                cmg.strtocancel = true
                            }
                        })
                        return;
                    }

                    /*stroke gesture*/
                    if (!cmg.toStrges && cmg.valuestrokegesture) {
                        if (e.button == 0 && cmg.valuestrleftenable) {
                            cmg.toStrges = "left";
                        }
                        else if (e.button == 1 && cmg.valuestrmiddleenable) {
                            cmg.toStrges = "middle";
                        }
                        else if (e.button == 2 && cmg.valuestrrightenable) {
                            cmg.toStrges = "right";
                        }
                        cmg.toStrkey = e.button;
                    }

                    /*tablist*/
                    if (cmg.valuescrollgesture
                        && cmg.valuetablist
                        && ((cmg.valuetablistkey == "left" && e.button == 0) || (cmg.valuetablistkey == "right" && e.button == 2))) {
                        cmg.toTablist = true;
                    }

                    /*scroll gesture*/
                    if (cmg.valuescrollgesture && cmg.valuesgsleftenable && e.button == 0) {
                        cmg.toSGS = "sgsleft";
                    }
                    if (cmg.valuescrollgesture && cmg.valuesgsrightenable && e.button == 2) {
                        cmg.toSGS = "sgsright";
                    }


                    if (cmg.valuegeskey == "left" && (e.target.href || e.target.src || e.target.tagName.toLowerCase() == "input")) {
                        return;
                    }
                    if (!e[cmg.valuegholdkey + "Key"]//key
                        && !tostop
                        && (cmg.valuegesture || teststroke)) {
                        switch (cmg.valuegeskey) {
                            case"right":
                                if (e.button == 2) {
                                    this.toGesture = "right";
                                    this._startGuesture(e);
                                }
                                break;
                            case"middle":
                                if (e.button == 1) {
                                    this.toGesture = "middle";
                                    this._startGuesture(e);
                                }
                                break;
                            case"left":
                                if (e.button == 0) {
                                    this.toGesture = "left";
                                    this._startGuesture(e);
                                }
                                break;
                        }

                    }


                    break;
                case "mousemove":
                    if (this.toGesture) {
                        this._progressGesture(e);
                    }
                    break;
                case "mouseup":
                    this.Ging = false;
                    cmg.toSGS = false;
                    cmg.toTablist = false;
                    if (cmg.toStrges && cmg.valuestrpress == "up" && e.button != cmg.toStrkey) {
                        cmg.strtocancel = true;
                        chrome.extension.sendMessage({type: "strokegesture", hold: cmg.toStrges, LR: e.button}, function (response) {
                            cmg.transmsg = response;
                            cmg._gestureaction(response.action);
                        })
                    }

                    cmg.toStrges = false;
                    if (cmg.tablistIng) {
                        chrome.extension.sendMessage({type: "tablistend", tablistIndex: cmg.tablistId}, function (response) {
                        })
                        cmg.toTablist = false;
                        if (cmg.valuetablistkey == "left" || cmg.disrightopt) {
                            cmg.tablistIng = false;
                        }
                        if (window.top.document.getElementById("crxmousetablist")) {
                            window.top.document.getElementById("crxmousetablist").parentNode.removeChild(window.top.document.getElementById("crxmousetablist"))
                        }
                    }

                    if (!cmg._toautocancel) {
                        cmg._stopGuesture(e);
                    }

                    /*fix disable right*/
                    if (cmg.disrightopt) {
                        this._cancelmenu = false;
                        this.toGesture = "";
                    }

                    /*reset autocancel*/
                    if (cmg._toautocancel) {
                        cmg._toautocancel = false;
                    } else {
                        window.clearTimeout(autocanceltimer);
                    }

                    break;
                case "contextmenu":
                    if (cmg.strtocancel) {
                        cmg.strtocancel = false;
                        e.preventDefault();
                    }

                    if (cmg.sgstocancel) {
                        cmg.sgstocancel = false;
                        e.preventDefault();
                    }

                    if (cmg.tablistIng) {
                        if (document.getElementById("crxmousetablist")) {
                            document.getElementById("crxmousetablist").parentNode.removeChild(document.getElementById("crxmousetablist"))
                        }
                        e.preventDefault();
                        cmg.tablistIng = false;

                        /*fix linux tablist secend time*/
                        if (!cmg.disrightopt) {
                            cmg.toTablist = false;
                        }
                    }

                    /*mouse gesture*/
                    if (this._cancelmenu) {
                        //alert(this.toGesture)
                        if (this._cancelmenu/*this.toGesture=="right"*/) {
                            e.preventDefault();
                        }
                        this._cancelmenu = false;
                        this.toGesture = "";
                    }

                    if (cmg.toSGS == "sgsright" && !cmg.disrightopt) {
                        e.preventDefault();
                    }

                    /*disable rightmenu*/
                    if (cmg.disrightopt && !cmg.disright) {
                        e.preventDefault();
                        cmg.disright = true;
                        cmg.disrighttimer = window.setTimeout(function () {
                            cmg.disright = false;
                            window.clearTimeout(cmg.disrighttimer)
                        }, cmg.dbclicktime)
                    }
                    else {
                        cmg.disright = false;
                        cmg.toStrges = false;
                        /*fix stroke gesture*/
                        cmg.toTablist = false;
                        /*fix tablist*/
                        this._cancelmenu = false;
                        this.toGesture = "";
                    }

                    break;
                case "dragstart":
                    /*fixed svgdiv*/
                    if (document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo")) {
                        document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo").parentNode.removeChild(document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo"));
                    }

                    if (!e[cmg.valuedholdkey + "Key"]
                        && !tostop && (cmg.valuedrag || teststroke)) {
                        this.toDrag = true;
                        this._dragstart(e);
                    }
                    break;
                case"dragover":
                    /*fix tablist*/
                    cmg.toTablist = false;

                    /*fix scrollgesture*/
                    cmg.toSGS = false;

                    if (this.toDrag) {
                        this._dragprogress(e);
                    }
                    break;
                case"dragend":
                    cmg.toStrges = false;
                    this.toGesture = ""
                    if (this.toDrag) {
                        this.toDrag = false;
                        this._dragend(e);
                    }
                    break;
                case"drop":
                    if (cmg.valuedrag || teststroke) {
                        this._drop(e);
                    }
                    break;

                case"mousewheel":
                    var ud = "";
                    if (e.wheelDeltaY > 0) {
                        ud = "up"
                    }//else{ud="down"}
                    if (e.wheelDeltaY < 0) {
                        ud = "down"
                    }

                    if (cmg.toTablist && ud != "") {
                        cmg.tablistIng = true;
                        chrome.extension.sendMessage({type: "tablist"}, function (response) {
                        })
                        chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {//alert("xxx");
                            if (request.type == "tablist" && !window.top.document.getElementById("crxmousetablist")) {
                                var _tablisthold = window.top.document.createElement("div");
                                _tablisthold.id = "crxmousetablist";
                                _tablisthold.style.left = (window.top.innerWidth - 400) / 2 + "px";
                                _tablisthold.style.top = (window.top.innerHeight - request.tabs.length * 28) / 2 + "px";
                                for (var i = 0; i < request.tabs.length; i++) {
                                    var _tablist = window.top.document.createElement("div")
                                    _tablist.className = "crxmousetablisttab";
                                    _tablist.innerHTML = "  " + request.tabs[i].title;
                                    var _tabimg = window.top.document.createElement("img");
                                    _tabimg.src = request.tabs[i].favIconUrl;
                                    _tablist.appendChild(_tabimg);
                                    _tablist.insertBefore(_tabimg, _tablist.firstChild);
                                    _tablisthold.appendChild(_tablist);
                                }
                                window.top.document.documentElement.appendChild(_tablisthold);
                                window.top.document.getElementsByClassName("crxmousetablisttab")[request.curTab.index].id = "crxmousetablisttabcurrent";
                                e.preventDefault();
                                cmg.tablistId = request.curTab.index;
                            }
                        })

                        if (e.wheelDeltaY < 0) {
                            var _tabobj = window.top.document.getElementsByClassName("crxmousetablisttab");
                            for (var i = 0; i < _tabobj.length; i++) {
                                if (_tabobj[i].id == "crxmousetablisttabcurrent") {
                                    _tabobj[i].id = "";
                                    if (i + 1 == _tabobj.length) {
                                        _tabobj[0].id = "crxmousetablisttabcurrent"
                                        cmg.tablistId = 0;
                                    }
                                    else {
                                        _tabobj[i + 1].id = "crxmousetablisttabcurrent"
                                        cmg.tablistId = i + 1;
                                    }
                                    break;
                                }
                            }
                        }
                        else if (e.wheelDeltaY > 0) {
                            var _tabobj = window.top.document.getElementsByClassName("crxmousetablisttab");
                            for (var i = 0; i < _tabobj.length; i++) {
                                if (_tabobj[i].id == "crxmousetablisttabcurrent") {
                                    _tabobj[i].id = "";
                                    if (i == 0) {
                                        _tabobj[_tabobj.length - 1].id = "crxmousetablisttabcurrent";
                                        cmg.tablistId = _tabobj.length - 1;
                                    }
                                    else {
                                        _tabobj[i - 1].id = "crxmousetablisttabcurrent"
                                        cmg.tablistId = i - 1;
                                    }
                                    break;
                                }
                            }
                        }
                        e.preventDefault();
                        return;
                    }

                    if (cmg.toSGS) {
                        var lr;
                        var ud = "";
                        if (e.wheelDeltaY > 0) {
                            ud = "up"
                        }//else{ud="down"}
                        if (e.wheelDeltaY < 0) {
                            ud = "down"
                        }
                        lr = this.toSGS;

                        if (ud !== "") {
                            chrome.extension.sendMessage({type: "scrollgesture", LR: lr, UD: ud}, function (response) {
                                cmg.transmsg = response;
                                cmg._gestureaction(response.action);
                            })
                            if (cmg.toSGS == "sgsright") {
                                cmg.sgstocancel = true;
                            }
                            e.preventDefault();
                            return;
                        }
                    }

                    /*smooth scroll*/
                    if (tostop || !cmg.valuesmooth) {
                        return;
                    }
                    if (/BackCompat/i.test(document.compatMode)) {
                        var body_check = function () {
                            NotRoot = "";
                            /**/
                            Root = document.body;
                            if (!Root) {
                                setTimeout(body_check, 100);
                            }
                        };
                        body_check();
                    } else {
                        NotRoot = document.body;
                        Root = document.documentElement;
                    }

                    var LOG_SEC = Math.log(1000);
                    var target = e.target, targets = this._scroll_targets, scroll_object;
                    var dir = e.wheelDeltaY > 0 ? 'up' : 'down';
                    if (document.TEXT_NODE === target.nodeType) {
                        target = target.parentElement;
                    }
                    do {
                        if (!targets.some(function (_so) {
                            if (_so.target === target) {
                                scroll_object = _so;
                                return true;
                            }
                        })) {
                            if (target.clientHeight > 0 && (target.scrollHeight - target.clientHeight) > 16 && target !== NotRoot) {
                                var overflow = getComputedStyle(target, "").getPropertyValue("overflow");
                                if (overflow === 'scroll' || overflow === 'auto' || (target.tagName === Root.tagName && overflow !== 'hidden')) {
                                    scroll_object = new SmoothScrollByElement(target);
                                    targets.push(scroll_object);
                                }
                            }
                        }
                        if (scroll_object && scroll_object.isScrollable(dir)) {
                            var x = -e.wheelDeltaX, y = -e.wheelDeltaY;
                            if (true) {
                                var AccelerationValue = cmg.valuescrollaccele//20//this.config.AccelerationValue;
                                var prev = this.prev_scroll_time || 0;
                                var now = this.prev_scroll_time = Date.now();
                                var accele = (1 - Math.min(Math.log(now - prev + 1), LOG_SEC) / LOG_SEC) * AccelerationValue + 1;
                                x *= accele;
                                y *= accele;
                            }
                            var ax = Math.abs(x), ay = Math.abs(y);
                            scroll_object.scroll(x, y, Math.log(Math.max(ax, ay)) * (1.1 - cmg.valuescrollspeed * 0.1)/*this.config.ScrollSpeedValue*/ * 100);
                            /*scroll speed*/
                            e.preventDefault();
                            return;
                        }
                    } while (target = target.parentElement);

                    break;
            }
        },
        _startGuesture: function (e) {
            if (testdrag) {
                return;
            }
            this._lastX = e.clientX;
            this._lastY = e.clientY;
            this._directionChain = "";
            this.startX = e.clientX;
            this.startY = e.clientY;
        },
        _progressGesture: function (e) {

            if (testdrag) {
                return;
            }
            if (cmg._toautocancel) {
                return;
            }
            if (cmg.valuestenable && !this.Ging && window.getSelection().toString().length > 0) {
                return;
            }
            if (!cmg.valuestenable && cmg.valuegeskey == "left") {
                document.getSelection().removeAllRanges();
            }
            var x = e.clientX;
            var y = e.clientY;
            var dx = Math.abs(x - this._lastX);
            var dy = Math.abs(y - this._lastY);
            if (dx > 5 || dy > 5) {
                if (cmg.valuegestureui && (cmg.valuestroke || teststroke)) {
                    if (!document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo")) {
                        var svgdiv = this.svgdiv = document.createElement("div");
                        svgdiv.id = "svgdivjlgkpaicikihijadgifklkbpdajbkhjo";
                        svgdiv.style.width = window.innerWidth + 'px';
                        svgdiv.style.height = window.innerHeight + 'px';

                        /**/
                        svgdiv.style.position = "fixed";
                        svgdiv.style.left = "0px";
                        svgdiv.style.top = "0px";
                        svgdiv.style.display = "block";
                        svgdiv.style.zIndex = 1000000;
                        svgdiv.style.background = "transparent";
                        svgdiv.style.border = "none";

                        var SVG = 'http://www.w3.org/2000/svg';
                        var svgtag = this.svgtag = document.createElementNS(SVG, "svg");
                        svgtag.style.position = "absolute";
                        svgtag.style.height = window.innerHeight;
                        svgtag.style.width = window.innerWidth;
                        var polyline = document.createElementNS(SVG, 'polyline');
                        polyline.style.stroke = cmg.valuestrokecolor;//"rgb(18,89,199)";
                        polyline.style.strokeOpacity = cmg.valuestrokeopa;
                        polyline.style.strokeWidth = cmg.valuestrokewidth;
                        polyline.style.fill = "none";
                        polyline.setAttribute('stroke', 'rgba(18,89,199,0.8)');
                        polyline.setAttribute('stroke-width', '2');
                        polyline.setAttribute('fill', 'none');
                        this.polyline = polyline;

                        //svgtag.appendChild(defstag);	
                        svgtag.appendChild(polyline);
                        svgdiv.appendChild(svgtag);
                        (document.body || document.documentElement).appendChild(svgdiv);
                    }
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                    var p = this.svgtag.createSVGPoint();
                    p.x = this.startX;
                    p.y = this.startY;
                    this.polyline.points.appendItem(p);
                }
            }
            if (dx < cmg.valueminlength && dy < cmg.valueminlength) {
                return;
            }

            var direction;
            if (dx > dy) {
                direction = x < this._lastX ? "L" : "R";
            }
            else {
                direction = y < this._lastY ? "U" : "D";
            }
            var lastDirection = this._directionChain.charAt(this._directionChain.length - 1);

            if (direction != lastDirection) {
                this._directionChain += direction;
                this.Ging = true;
                cmg.tolerance = 20;

                if (!document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo") && (teststroke || (cmg.valuegestureui && (cmg.valuedirect || cmg.valuetooltip)))) {
                    var _infoshow = document.createElement("div");
                    _infoshow.id = "infoshowjlgkpaicikihijadgifklkbpdajbkhjo";
                    _infoshow.style.width = Math.min(document.documentElement.scrollWidth, window.innerWidth) + "px";
                    _infoshow.style.height = Math.max(document.documentElement.scrollHeight, window.innerHeight) + "px";

                    /**/
                    _infoshow.style.background = "transparent";
                    _infoshow.style.position = "fixed";
                    _infoshow.style.left = 0;
                    _infoshow.style.top = 0;
                    _infoshow.style.textAlign = "center";
                    _infoshow.style.cssText += "z-index:10000 !important";

                    document.body.appendChild(_infoshow)

                    if (cmg.valuedirect || teststroke) {
                        var _dirshow = document.createElement("div");
                        _dirshow.id = "dirshowjlgkpaicikihijadgifklkbpdajbkhjo";
                        _dirshow.style.backgroundColor = "#" + cmg.valuedirectcolor;
                        _dirshow.style.opacity = cmg.valuedirectopa;
                        _dirshow.style.marginTop = (window.innerHeight / 5) * 2 + "px"

                        /**/
                        _dirshow.style.borderRadius = "3px";
                        _dirshow.style.marginLeft = "auto";
                        _dirshow.style.marginRight = "auto";
                        _dirshow.style.textAlign = "center";

                        document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo").appendChild(_dirshow);
                    }

                    if (cmg.valuetooltip || teststroke) {
                        var _tipshow = document.createElement("div");
                        _tipshow.id = "tipshowjlgkpaicikihijadgifklkbpdajbkhjo";
                        _tipshow.style.fontSize = cmg.valuetooltipwidth + "px";//"18px";
                        _tipshow.style.color = "#" + cmg.valuetooltipcolor;//"rgba(0,255,0,.9)"
                        _tipshow.style.opacity = cmg.valuetooltipopa;

                        /**/
                        _tipshow.style.background = "transparent";
                        _tipshow.style.textAlign = "center";
                        _tipshow.style.fontWeight = "bold";
                        if (cmg.valuedirect || teststroke) {
                            _tipshow.style.marginTop = "5px"
                        }
                        else {
                            _tipshow.style.marginTop = (window.innerHeight / 5) * 2 + 35 + "px"
                        }
                        document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo").appendChild(_tipshow);
                    }
                }

                /**/
                if ((cmg.valuedirect || teststroke) && document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo")) {
                    var _dirlength = this._directionChain.length;
                    document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").style.width = Math.min(32 * (_dirlength + 1), window.innerWidth) + "px";
                    document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").style.paddingTop = "3px";
                    if (cmg.fixPaddingBottom) {
                        document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").style.paddingBottom = "3px";
                    }
                    var _showimg = document.createElement("img");
                    _showimg.style.display = "inline";
                    _showimg.src = chrome.extension.getURL("") + "image/" + direction.toLowerCase() + ".png";
                    document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").appendChild(_showimg);
                }
                /**/

                /***/
                if ((cmg.valuetooltip || teststroke) && document.getElementById("tipshowjlgkpaicikihijadgifklkbpdajbkhjo")) {
                    //alert(this._directionChain)
                    chrome.extension.sendMessage({type: "tipshow", direct: this._directionChain, tiptype: "gesture"}, function (response) {
                        if (response.moreDes != "none") {
                            document.getElementById("tipshowjlgkpaicikihijadgifklkbpdajbkhjo").innerHTML = response.moreDes;
                        }
                        else {
                            document.getElementById("tipshowjlgkpaicikihijadgifklkbpdajbkhjo").innerHTML = "";
                        }
                    })
                }
            }

            /*autocancel*/
            if (cmg.valueautocancel) {
                cmg._toautocancel = false;
                window.clearTimeout(autocanceltimer);
                autocanceltimer = window.setTimeout(function () {
                    cmg._toautocancel = true;
                    cmg._stopGuesture();
                }, cmg.valueautocancelvalue * 1000)
            }


            this._lastX = e.clientX;
            this._lastY = e.clientY;

        },
        _stopGuesture: function (e) {
            if (cmg._strokeclear()) {

                /*auto cancel*/
                if (cmg._toautocancel) {
                    this._cancelmenu = true;
                    /*cmg._toautocancel=false;*/
                    this._directionChain = "";
                    this._suppressContext = false;
                    //this.toGesture="";
                    direction = "";
                    if (this.toGesture != "right") {
                        this.toGesture = ""
                    }
                    return;
                }
                else {
                    window.clearTimeout(autocanceltimer);
                }

                var _actionback;
                if (this._directionChain) {
                    this._cancelmenu = true;
                    _actionback = cmg._performAction(e);
                    this._directionChain = "";
                    this._suppressContext = false;
                    this.toGesture = "";
                    direction = "";
                }
                else {
                    this._directionChain = "";
                    this._suppressContext = false;
                    this.toGesture = "";
                    direction = "";
                    return false;
                }
                return _actionback !== false;

            }

        },
        _performAction: function (e) {
            if (teststroke) {
                optdirect = this._directionChain;
                FnAdd("gesture", "gesture");
                return
            }
            chrome.extension.sendMessage({type: "gesture", direct: this._directionChain}, function (response) {
                cmg.transmsg = response;
                cmg._gestureaction(response.action);
            });
        },
        _dragstart: function (e) {
            if (testgesture) {
                return;
            }
            if (teststroke) {
                document.getElementById("addbox").removeChild(document.getElementById("adddirect"));
            }
            this._lastX = e.clientX;
            this._lastY = e.clientY;
            this._directionChain = "";
            this.startX = e.clientX;
            this.startY = e.clientY;

            /*set dragtype*/
            if (cmg.valueimgfirstcheck) {
                cmg.imgfirst = true;
            }
            this._dragType = ""
            switch (e.target.nodeType) {
                case 3:
                    if (cmg.valuedragtext) {
                        this._dragType = "text";
                    }
                    break;
                case 1:
                    if (e.target.value && cmg.valuedragtext && cmg.valuedraginput) {
                        this._dragType = "text";
                    }
                    else if (e.target.href) {
                        if (window.getSelection().toString() == ""
                            || e.target.textContent.length > window.getSelection().toString().lenght) {
                            if (cmg.valuedraglink) {
                                this._dragType = "link";
                            }
                        }
                        else {
                            if (cmg.valuedragtext) {
                                this._dragType = "text"
                            }
                        }
                        if (!cmg.valuedragtext && cmg.valuedraglink) {
                            this._dragType = "link";
                        }
                    }
                    else if (e.target.src) {
                        if (e.target.parentNode.href/*&&(!e[cmg.valueimgfirst+"Key"]||!cmg.valueimgfirstcheck)*/) {
                            if (cmg.valuedragimage && (e[cmg.valueimgfirst + "Key"] || cmg.valueimgfirstcheck)) {
                                this._dragType = "image"
                            }
                            else if (cmg.valuedraglink) {
                                this._dragType = "link";
                                e = e.target.parentNode;
                            }

                        }
                        else if (cmg.valuedragimage) {
                            this._dragType = "image"
                        }
                    }
                    break;
            }

            if (!this._dragType) {
                this.toDrag = false;
                return;
            }
            cmg._seltext = window.getSelection().toString() || e.target.innerHTML;
            cmg._sellink = e.href || e.target.href;
            cmg._selimg = e.target.src;
            if (cmg.valuesetdragurl && this._dragType == "text") {
                var tolink;
                if (cmg._seltext.indexOf("http://") != 0
                    && cmg._seltext.indexOf("https://") != 0
                    && cmg._seltext.indexOf("ftp://") != 0
                    && cmg._seltext.indexOf("rtsp://") != 0
                    && cmg._seltext.indexOf("mms://") != 0
                    && cmg._seltext.indexOf("chrome-extension://") != 0
                    && cmg._seltext.indexOf("chrome://") != 0) {
                    tolink = "http://" + cmg._seltext;
                }
                else {
                    tolink = cmg._seltext;
                }
                var urlreg = /^((chrome|chrome-extension|ftp|http(s)?):\/\/)([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                if (urlreg.test(tolink)) {
                    this._dragType = "link";
                    cmg._sellink = tolink;
                }

//				var urlreg=/^((chrome|chrome-extension|ftp|http(s)?):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/  ;
//				if(urlreg.test(cmg._seltext)){
//					this._dragType="link";
//					if(cmg._seltext.indexOf("http://")!=0
//						&&cmg._seltext.indexOf("https://")!=0
//						&&cmg._seltext.indexOf("ftp://")!=0
//						&&cmg._seltext.indexOf("rtsp://")!=0
//						&&cmg._seltext.indexOf("mms://")!=0
//						&&cmg._seltext.indexOf("chrome-extension://")!=0
//						&&cmg._seltext.indexOf("chrome://")!=0){cmg._sellink="http://"+cmg._seltext;}
//					else{cmg._sellink=cmg._seltext;}
//					}
            }
            /*set dragtype END*/

        },
        _dragprogress: function (e) {

            if (testgesture) {
                return;
            }
            if (cmg._toautocancel) {
                return;
            }

            /*drag ui ready*/
            if (!document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo")
                && (teststroke || (cmg.valuedragui && (cmg.valueddirect || cmg.valuedtooltip)))) {
                var _infoshow = document.createElement("div");
                _infoshow.id = "infoshowjlgkpaicikihijadgifklkbpdajbkhjo";
                _infoshow.style.width = Math.min(document.documentElement.scrollWidth, window.innerWidth) + "px";
                _infoshow.style.height = Math.max(document.documentElement.scrollHeight, window.innerHeight) + "px";

                /**/
                _infoshow.style.background = "transparent";
                _infoshow.style.position = "fixed";
                _infoshow.style.left = 0;
                _infoshow.style.top = 0;
                _infoshow.style.textAlign = "center";
                _infoshow.style.cssText += "z-index:-1 !important";

                if (cmg.valueddirect || teststroke) {
                    var _dirshow = document.createElement("div");
                    _dirshow.id = "dirshowjlgkpaicikihijadgifklkbpdajbkhjo";
                    _dirshow.style.backgroundColor = "#" + cmg.valueddirectcolor;//"rgba(0,0,0,.5)";
                    _dirshow.style.opacity = cmg.valueddirectopa;
                    _dirshow.style.marginTop = (window.innerHeight / 5) * 2 + "px"

                    /**/
                    _dirshow.style.borderRadius = "3px";
                    _dirshow.style.marginLeft = "auto";
                    _dirshow.style.marginRight = "auto";
                    _dirshow.style.textAlign = "center";

                    _infoshow.appendChild(_dirshow);
                }

                if (cmg.valuedtooltip || teststroke) {
                    var _tipshow = document.createElement("div");
                    _tipshow.id = "tipshowjlgkpaicikihijadgifklkbpdajbkhjo";
                    _tipshow.style.fontSize = cmg.valuedtooltipwidth + "px";//"18px";
                    _tipshow.style.opacity = cmg.valuedtooltipopa;
                    _tipshow.style.color = "#" + cmg.valuedtooltipcolor//"rgba(0,255,0,.9)"

                    /**/
                    _tipshow.style.background = "transparent";
                    _tipshow.style.textAlign = "center";
                    _tipshow.style.fontWeight = "bold";

                    if (!cmg.valueddirect) {
                        if (teststroke) {
                            _tipshow.style.marginTop = ""
                        } else {
                            _tipshow.style.marginTop = (window.innerHeight / 5) * 2 + 35 + "px";
                        }
                    }
                    else {
                        _tipshow.style.cssText += "margin-top:5px !important";
                    }
                    _infoshow.appendChild(_tipshow);
                }
                document.getElementsByTagName("body")[0].appendChild(_infoshow);
            }

            var x = e.clientX;
            var y = e.clientY;
            var dx = Math.abs(x - this._lastX);
            var dy = Math.abs(y - this._lastY);

            if (dx < cmg.valueminlength || dy < cmg.valueminlength) {
                if (cmg.valuedragui && (cmg.valuedstroke || teststroke)/*&&document.getElementById("crxmousecanvas")*/) {
                    if (!document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo")) {
                        var svgdiv = this.svgdiv = document.createElement("div");
                        svgdiv.id = "svgdivjlgkpaicikihijadgifklkbpdajbkhjo";
                        svgdiv.style.width = window.innerWidth + 'px';
                        svgdiv.style.height = window.innerHeight + 'px';

                        /**/
                        svgdiv.style.position = "fixed";
                        svgdiv.style.left = "0px";
                        svgdiv.style.top = "0px";
                        svgdiv.style.display = "block";
                        svgdiv.style.zIndex = 1000000;
                        svgdiv.style.background = "transparent";
                        svgdiv.style.border = "none";

                        var SVG = 'http://www.w3.org/2000/svg';
                        var svgtag = this.svgtag = document.createElementNS(SVG, "svg");
                        svgtag.style.position = "absolute";
                        svgtag.style.height = window.innerHeight;
                        svgtag.style.width = window.innerWidth;
                        var polyline = document.createElementNS(SVG, 'polyline');
                        polyline.style.stroke = cmg.valuedstrokecolor;//"rgb(18,89,199)";
                        polyline.style.strokeOpacity = cmg.valuedstrokeopa;
                        polyline.style.strokeWidth = cmg.valuedstrokewidth;
                        polyline.style.fill = "none";
                        polyline.setAttribute('stroke', 'rgba(18,89,199,0.8)');
                        polyline.setAttribute('stroke-width', '2');
                        polyline.setAttribute('fill', 'none');

                        this.polyline = polyline;
                        svgtag.appendChild(polyline);
                        svgdiv.appendChild(svgtag);
                        (document.body || document.documentElement).appendChild(svgdiv);
                    }
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                    var p = this.svgtag.createSVGPoint();
                    p.x = this.startX;
                    p.y = this.startY;
                    this.polyline.points.appendItem(p);
                }
            }

            if (dx < cmg.valueminlength && dy < cmg.valueminlength) {
                return;
            }

            var direction;
            if (dx > dy) {
                direction = x < this._lastX ? "L" : "R";
            } else {
                direction = y < this._lastY ? "U" : "D";
            }
            var lastDirection = this._directionChain.charAt(this._directionChain.length - 1);
            if (direction != lastDirection) {
                this._directionChain += direction;

                if (teststroke) {
                    if (document.getElementById("adddirect")) {
                    } else {
                        var _adddirectobj = document.createElement("div");
                        _adddirectobj.id = "adddirect";
                        document.getElementById("addbox").insertBefore(_adddirectobj, document.getElementById("addbutton"));
                    }
                }

                /**/
                if ((cmg.valueddirect || teststroke) && document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo")) {
                    var _dirlength = this._directionChain.length;
                    document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").style.width = Math.min(32 * (_dirlength + 1), window.innerWidth) + "px";
                    document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").style.paddingTop = "3px";
                    if (cmg.fixPaddingBottom) {
                        document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").style.paddingBottom = "3px";
                    }
                    var _showimg = document.createElement("img");
                    _showimg.src = chrome.extension.getURL("") + "image/" + direction.toLowerCase() + ".png";
                    document.getElementById("dirshowjlgkpaicikihijadgifklkbpdajbkhjo").appendChild(_showimg);
                }
                /**/

                /***/
                if ((cmg.valuedtooltip || teststroke) && document.getElementById("tipshowjlgkpaicikihijadgifklkbpdajbkhjo")) {
                    var sendmsg = {};
                    sendmsg.type = "tipshow";
                    sendmsg.direct = this._directionChain;
                    sendmsg.tiptype = this._dragType;
                    sendmsg.seltext = this._seltext;
                    sendmsg.sellink = this._sellink;
                    sendmsg.selimg = this._selimg;

                    if (this._dragType) {
                        chrome.extension.sendMessage(sendmsg, function (response) {
                            if (response.moreDes != "none") {
                                document.getElementById("tipshowjlgkpaicikihijadgifklkbpdajbkhjo").innerHTML = response.moreDes;
                            }
                            else {
                                document.getElementById("tipshowjlgkpaicikihijadgifklkbpdajbkhjo").innerHTML = "";
                            }
                        })
                    }

                }
                if ((cmg.valueddirect || cmg.valuedtooltip || teststroke) && document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo")) {
                    document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo").style.cssText += "z-index:100000 !important"
                }
            }

            /*autocancel*/
            if (cmg.valueautocancel) {
                cmg._toautocancel = false;
                window.clearTimeout(autocanceltimer);
                autocanceltimer = window.setTimeout(function () {
                    cmg._toautocancel = true;
                    cmg._dragStop();
                }, cmg.valueautocancelvalue * 1000)
            }
            this._lastX = e.clientX;
            this._lastY = e.clientY;
        },
        _dragend: function (e) {
            /**/
            cmg._toautocancel = false;
            if (this._directionChain.length > 0) {
                e.preventDefault();

            }
            this._dragStop(e);
        },
        _drop: function (e) {

        },
        _dragStop: function (e) {
            if (cmg._strokeclear()) {
                /*auto cancel*/
                if (cmg._toautocancel) {
                    this._cancelmenu = true;
                    /*cmg._toautocancel=false;*/
                    this._directionChain = "";
                    this._suppressContext = false;
                    this.toGesture = "";
                    direction = "";
                    return;
                }
                else {
                    window.clearTimeout(autocanceltimer);
                }

                if (this._directionChain) {
                    this._dragAction(e);
                }
                this.direction = "";
                this._directionChain = "";
                this._suppressContext = false;
                this.toGesture = "";
            }
        },
        _dragAction: function (e) {
            if (teststroke) {
                optdirect = this._directionChain;
                if (this._dragType) {
                    FnAdd("drag", this._dragType);
                }
                return
            }

            chrome.extension.sendMessage({type: this._dragType, direct: this._directionChain}, function (response) {
                response.type = "backToFn";
                response.seltext = cmg._seltext;
                response.sellink = cmg._sellink;
                response.selimg = cmg._selimg;
                chrome.extension.sendMessage(response/*,function(res){alert(res.id)}*/);
            });
        },
        _strokeclear: function () {
            if (CMGstroketest) {
                return true;
            }

            if (document.getElementById("crxmousecanvas")) {
                document.getElementById("crxmousecanvas").parentNode.removeChild(document.getElementById("crxmousecanvas"))
            }
            if (document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo")) {
                document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo").parentNode.removeChild(document.getElementById("svgdivjlgkpaicikihijadgifklkbpdajbkhjo"));
            }
            if (document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo")) {
                document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo").parentNode.removeChild(document.getElementById("infoshowjlgkpaicikihijadgifklkbpdajbkhjo"))
            }
            return true;
        },
        _UiReady: function () {

        },
        _gestureaction: function (act) {

            switch (act) {
                case"G_none":
                    return;
                    break;
                case"G_back":
                    window.history.go(-1);
                    break;
                case"G_backhead":
                    window.history.go(-window.history.length + 1);
                    break;
                case"G_go":
                    window.history.go(+1);
                    break;
                case"G_stop":
                    window.stop();
                    break;
                case"G_goparent":
                    if (location.hash) {
                        location.href = location.pathname + (location.search ? '?' + location.search : '');
                    } else {
                        var paths = location.pathname.split('/');
                        var path = paths.pop();
                        if (!location.search && path === '') paths.pop();
                        location.href = paths.join('/') + '/';
                    }
                    break;
                case"G_down":
                    if (window.document.height == window.innerHeight) {
                        var _alllength = 0
                    } else {
                        var _alllength = window.innerHeight - 20;
                    }

                    if (!cmg.valuescrolleffects) {
                        window.scrollBy(document.documentElement.offsetLeft, _alllength);
                        return;
                    }

                    var _length = 0;
                    var _timer = window.setInterval(function () {
                        window.scrollBy(document.documentElement.offsetLeft, 20);
                        _length += 20;
                        if (_length > _alllength) {
                            window.clearInterval(_timer);
                        }
                    }, 5)
                    break;
                case"G_up":
                    if (window.document.height == window.innerHeight) {
                        var _alllength = 0
                    } else {
                        var _alllength = window.innerHeight - 20;
                    }

                    if (!cmg.valuescrolleffects) {
                        window.scrollBy(document.documentElement.offsetLeft, -_alllength);
                        return;
                    }

                    var _length = 0;
                    var _timer = window.setInterval(function () {
                        window.scrollBy(document.documentElement.offsetLeft, -20);
                        _length += 20;
                        if (_length > _alllength) {
                            window.clearInterval(_timer);
                        }
                    }, 5)
                    break;
                case"G_bottom":
                    var _alllength = Math.max(document.body.offsetHeight, document.body.clientHeight, document.body.scrollHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight, document.documentElement.scrollHeight) - window.innerHeight - window.pageYOffset + 50

                    if (!cmg.valuescrolleffects) {
                        window.scrollBy(document.documentElement.offsetLeft, _alllength);
                        return;
                    }

                    var _length = 0;
                    var _N = parseInt(_alllength / window.innerHeight);
                    if (_N > 2) {
                        _length = _alllength - 2 * window.innerHeight;
                        window.scrollBy(document.documentElement.offsetLeft, (_alllength - 2 * window.innerHeight));
                    }
                    ;
                    var _timer = window.setInterval(function () {
                        var _scroll = (_alllength - _length) * 0.1;
                        window.scrollBy(document.documentElement.offsetLeft, _scroll);
                        _length += _scroll;
                        if (_length > _alllength) {
                            window.clearInterval(_timer);
                        }
                    }, 5)
                    break;

                case"G_top":
                    var _alllength = window.pageYOffset + 50

                    if (!cmg.valuescrolleffects) {
                        window.scrollBy(document.documentElement.offsetLeft, -_alllength);
                        return;
                    }

                    var _length = 0;
                    var _N = parseInt(_alllength / window.innerHeight);
                    if (_N > 2) {
                        _length = _alllength - 2 * window.innerHeight;
                        window.scrollBy(document.documentElement.offsetLeft, -(_alllength - 2 * window.innerHeight));
                    }
                    ;
                    var _timer = window.setInterval(function () {
                        var _scroll = (_alllength - _length) * 0.1;
                        window.scrollBy(document.documentElement.offsetLeft, -_scroll);
                        _length += _scroll;
                        if (_length > _alllength) {
                            window.clearInterval(_timer);
                        }
                    }, 5)
                    break;
                case"G_reloadframe":
                    window.location.reload();
                case"G_tostop":
                    tostop = true;
                    break;
                case"G_userscript":
                    try {
                        eval(cmg.transmsg.moreScript)
                    } catch (error) {
                        alert(error);
                    }
                    break;
                case"G_trynext":
                case"G_tryprev":
                    var _needbreak = _needbreak2 = false;

                    var htmlchar = ["&nbsp;", "&lt;", "&gt;", "&amp;", "&quot;"];
                    var htmlinner = [" ", "<", ">", "&", "\""];
                    var _innerobj = [];


                    var matchobj = document.getElementsByTagName("a");
                    var matchwords = cmg.transmsg.moreMatch.split("|");

                    for (var i = 0; i < matchobj.length; i++) {
                        _innerobj[i] = matchobj[i].innerHTML
                        for (var j = 0; j < htmlchar.length; j++) {
                            function _objreplace() {
                                if (_innerobj[i].indexOf(htmlchar[j]) != -1) {
                                    _innerobj[i] = _innerobj[i].replace(htmlchar[j], htmlinner[j]);
                                    _objreplace();
                                }
                            }

                            _objreplace();
                        }
                    }

                    for (var i = matchobj.length - 1; i > 0; i--) {
                        for (var ii = 0; ii < matchwords.length; ii++) {
                            var _matchclass = [];
                            if (!matchobj[i].className) {
                            }
                            else {
                                _matchclass = matchobj[i].className.split(" ");
                            }

                            if (matchobj[i].rel == matchwords[ii]
                                || matchobj[i].rev == matchwords[ii]
                                || matchobj[i].id == matchwords[ii]
                                || _innerobj[i] == matchwords[ii]
                                || matchobj[i].title == matchwords[ii]
                            /*||matchobj[i].className.indexOf(matchwords[ii])!=-1*/) {
                                cmg.transmsg.transurl = matchobj[i].href;
                                cmg.transmsg.type = "backToFn";
                                cmg.transmsg.action = "G_trynextto";
                                chrome.extension.sendMessage(cmg.transmsg);
                                _needbreak = true;
                                break;
                            }

                            for (var iii = 0; iii < _matchclass.length; iii++) {
                                if (_matchclass[iii] == matchwords[ii]) {
                                    cmg.transmsg.transurl = matchobj[i].href;
                                    cmg.transmsg.type = "backToFn";
                                    cmg.transmsg.action = "G_trynextto";
                                    chrome.extension.sendMessage(cmg.transmsg);
                                    _needbreak2 = true;
                                    break;
                                }
                            }
                            if (_needbreak2) {
                                _needbreak = true;
                                break;
                            }

                        }
                        if (_needbreak) {
                            break;
                        }
                    }
                    break;

                /*will back*/
                default:
                    cmg.transmsg.type = "backToFn";
                    chrome.extension.sendMessage(cmg.transmsg);
                    break;
            }

        }


    };

    cmg.constinit();
    cmg.init();


    function easeOutCubic(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }

    function easeOutQuart(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }

    function SmoothScroll(_x, _y, _duration) {
        if (SmoothScroll.timer) {
            _x += SmoothScroll.X - window.pageXOffset;
            _y += SmoothScroll.Y - window.pageYOffset;
            SmoothScroll.fin();
        }
        SmoothScroll.X = _x + window.pageXOffset;
        SmoothScroll.Y = _y + window.pageYOffset;
        var from_x = window.pageXOffset;
        var from_y = window.pageYOffset;
        var duration = _duration || 400;
        var easing = easeOutQuart;
        var begin = Date.now();
        SmoothScroll.fin = function () {
            clearInterval(SmoothScroll.timer);
            SmoothScroll.timer = void 0;
        };
        SmoothScroll.timer = setInterval(scroll, 10);
        function scroll() {
            var now = Date.now();
            var time = now - begin;
            var prog_x = easing(time, from_x, _x, duration);
            var prog_y = easing(time, from_y, _y, duration);
            window.scrollTo(prog_x, prog_y);
            if (time > duration) {
                SmoothScroll.fin();
                window.scrollTo(from_x + _x, from_y + _y);
            }
        }
    }

    function SmoothScrollByElement(target) {
        this.target = target;
        this._target = target === document.documentElement ? document.body : target;
    }

    SmoothScrollByElement.noSmooth = function () {
        SmoothScrollByElement.prototype.scroll = function (_x, _y) {
            var self = this, target = this._target;
            target.scrollLeft += _x;
            target.scrollTop += _y;
        };
    };
    SmoothScrollByElement.prototype = {
        scroll: function (_x, _y, _duration) {
            var self = this, target = this.target, _target = this._target, isDown = _y > 0;
            if (self.timer >= 0) {
                _x += self.X - _target.scrollLeft;
                _y += self.Y - _target.scrollTop;
                self.fin();
            }
            var x = _target.scrollLeft;
            var y = _target.scrollTop;
            self.X = _x + x;
            self.Y = _y + y;
            var duration = _duration || 400;
            var easing = easeOutQuart;
            var begin = Date.now();
            self.fin = function () {
                clearInterval(self.timer);
                self.timer = void 0;
            };
            self.timer = setInterval(scroll, 10);
            function scroll() {
                var now = Date.now();
                var time = now - begin;
                if (time > duration || (!isDown && _target.scrollTop === 0) || (isDown && (_target.scrollTop + target.clientHeight + 16 >= target.scrollHeight))) {
                    self.fin();
                    _target.scrollLeft = x + _x;
                    _target.scrollTop = y + _y;
                    return;
                }
                var prog_x = easing(time, x, _x, duration);
                var prog_y = easing(time, y, _y, duration);
                _target.scrollLeft = prog_x;
                _target.scrollTop = prog_y;
            }
        },
        isScrollable: function (dir) {
            var self = this, target = this.target, _target = this._target;
            if (target.clientHeight <= target.scrollHeight) {
                if (dir === 'down') {
                    if ((_target.scrollTop + target.clientHeight) < target.scrollHeight) {
                        return true;
                    }
                } else if (dir === 'up' && _target.scrollTop > 0) {
                    return true;
                }
            }
            return false;
        }
    };


})

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.notifitype == "bookmark"
            || request.notifitype == "isave"
            || request.notifitype == "isaveback") {
            addnotifibox();
            window.setTimeout(function () {
                if (document.getElementById("notifiboxjlgkpaicikihijadgifklkbpdajbkhjo")) {
                    document.getElementById("notifiboxjlgkpaicikihijadgifklkbpdajbkhjo").parentNode.removeChild(document.getElementById("notifiboxjlgkpaicikihijadgifklkbpdajbkhjo"))
                }
            }, 2000)
        }

        function addnotifibox() {
            var _obj = document.getElementById("notifiboxjlgkpaicikihijadgifklkbpdajbkhjo");
            if (_obj) {
                _obj.parentNode.removeChild(_obj)
            }

            var notifidiv = document.createElement("div");
            notifidiv.style.left = window.innerWidth / 2 - 110 + "px";
            notifidiv.id = "notifiboxjlgkpaicikihijadgifklkbpdajbkhjo"
            notifidiv.innerHTML = request.notifitext;
            document.getElementsByTagName("body")[0].appendChild(notifidiv);
        }
    });
  
