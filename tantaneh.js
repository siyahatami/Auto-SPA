

//function getClosestTanBlockWrapper() {
//    var tanBlock = $(document.currentScript).parent();
//    if (tanBlock == null || tanBlock.length == 0) return null;
//    tanBlock = tanBlock.closest('.' + tanFieldsName.tanBlockClassName);
//    if (tanBlock == null || tanBlock.length == 0) return null;
//    tanBlock = tanBlock.first();
//    if (tanBlock==null || tanBlock.length==0) return null;
//    return tanBlock;
//}



//#region Naming

var tanFieldsName = {
    childrentag: "tanChildren",
    totalstateTag: "tanTotalState",
    mainBlockName: "tanMBILPABC",  //tantaneMainBlockInLayoutPageAutoByCode
    preblocknameTag: "tanParrentBlock",
    defaultValueTag: "tanDefaultValue",
    layoutMainTag: "tanLayoutMain",
    tanblockTag: "tanBlock",
    preparedUrlTag: "tanPreparedUrl",
    finalUrlTag: "tanFinalUrl",
    tanBlockClassName: "tantane_block",
    tanLayoutBlockClassName: "tantane_layout_block",
    tanNotHistorYInfloenced: "tanNotHistorYInfloenced",
    tanOverlayBlockWrapper: "tanOverlayBlockWrapper",
    tanOverlayBlock : "tanOverlayBlock",
    tanBtnClose: "tanBtnClose",
    TanSourceRefereshBlockName: "SourceRefereshBlockName",
    TanDocumentRedirectHeader: "TanDocumentRedirectHeader",
    TanLayoutCloseState: "TanLayoutCloseState"
};

var TanLayoutCloseState = {
    CloseAndRefereshDependentBlocks: "CloseAndRefereshDependentBlocks",
    CloseWidthoutAnyReferesh: "CloseWidthoutAnyReferesh",
    RefereshSourceBlockOnly:"RefereshSourceBlockOnly",
    Nothing:"Nothing"
};

//#endregion


var activeLoadingBlocks;

//#region Init

$(document).ready(function () {
    activeLoadingBlocks = [];
    if (!window.history || !history.pushState) return; //"Web History is not supported"

    $(document).updateBlocksUrlsFromLeafs(true);   // faghat childrenPrameters of blocks ro update mikone
    updateWindowChildrenQuery(false);
    $(document).addClickTriggerToLinkes();
    $(document).addSubmitTriggerToFormTags();
    $(document).tanInitiateSubOverlays(true);

    window.onpopstate = webHistoryPopState;

});

//-------------------------------------------------------------------------
function updateWindowChildrenQuery(pushNewUrl) {
    var mainBlock = $("." + tanFieldsName.layoutMainTag);
    var windowUrl = new tanUrl(window.location.href);
    if (mainBlock.length > 0)
        windowUrl= new tanUrl(mainBlock.first().attr("url"));
    windowUrl.childrenString=null;

    $("." + tanFieldsName.tanLayoutBlockClassName).each(function () {    //??? in shamele mainBlockInMainLayout ham mishe, vali baraye halati ke layout nadarim, kar nemikone
        var block = $(this);
        if (block.hasClass(tanFieldsName.tanNotHistorYInfloenced)) return;
        windowUrl.setChildrenItem(block.attr("id"), new tanUrl(block.attr("url")));
    });

    if (pushNewUrl == false) {
        window.history.replaceState(0, "Original Url from Body", windowUrl.toString());
    } else if (new tanUrl(window.location.href).toString() != windowUrl.toString()) {
        window.history.pushState(1, "Modified Url", windowUrl.toString());
    }
    $(document).tanUpdateLinkTotalState();
} //done

//-------------------------------------------------------------------------
function webHistoryPopState(event) {
    if (event.state == null) {
        return;
    }

    var UrlOfWindows = new tanUrl(window.location.href);
    if (UrlOfWindows.children == null || UrlOfWindows.children == "")
        return;

    var changableBlocksList = $("." + tanFieldsName.tanLayoutBlockClassName).not('.' + tanFieldsName.tanNotHistorYInfloenced);
    if (changableBlocksList.length > UrlOfWindows.children.Lengh) {
        window.location.replace(window.location.href);
        return;
    }
    

    changableBlocksList.each(function () {     // agar page bedune layout bashe, subpartesh in kelas ro nadare. pas bayad selector ro avaz kard va bara un mavared, adreshesh ro az children.children peyda kard
        let tanBlock = $(this);
        let expectedUrl = UrlOfWindows.getChildrenItem(tanBlock.attr("id"));

        tanBlock.updateBlockUrlToDown(expectedUrl);
    });
}

//-------------------------------------------------------------------------

//#endregion




//#region Functions
(function ($) {
    //-------------------------------------------------------------------------
    $.fn.updateBlocksUrlsFromLeafs = function (isDocument){
        var currentBlock = $(this);

        if (isDocument)
        {
            currentBlock.find('.'+tanFieldsName.tanLayoutBlockClassName).each(function(){
                var layoutBlock= $(this);
                layoutBlock.updateBlocksUrlsFromLeafs(false);
            });
        }
        else
        {
            if (currentBlock.attr("url") == null || currentBlock.attr("url").trim() == "") return;
            var currentBlockUrl = new tanUrl(currentBlock.attr("url"));
            currentBlockUrl.childrenString = null;

            currentBlock.find('.'+tanFieldsName.tanBlockClassName).each(function(){
                var childBlock = $(this);
                if (childBlock.parent().closest('.' + tanFieldsName.tanBlockClassName).first().attr('id') == currentBlock.attr('id')) {
                    childBlock.updateBlocksUrlsFromLeafs(false);
                    if (!childBlock.hasClass(tanFieldsName.tanNotHistorYInfloenced))
                        currentBlockUrl.setChildrenItem(childBlock.attr("id"), new tanUrl(childBlock.attr("url")));
                }
            });
            currentBlock.attr("url", currentBlockUrl.toString());
        }

    } //done

    //-------------------------------------------------------------------------
    $.fn.tanUpdateLinkTotalState = function () {
        $(this).find("a").each(function () {
            var aTag = $(this);
            var aTarget = aTag.attr("target");
            if (aTag.attr("href") == undefined || aTag.attr("href") == "" || aTag.attr("href") == "#" ||
                (aTarget != null && aTarget != "" && aTarget.substr(0, 1) == "_"))
                return;

            if (aTag.attr("href") == null || aTag.attr("href").trim() == "") return;
            if (aTag.closest('.' + tanFieldsName.tanNotHistorYInfloenced).length > 0)
                return;

            var aUrl = new tanUrl(aTag.attr("href"));
            aUrl.totalState = new tanUrl(window.location.href);
            aTag.attr("href",aUrl.toString());
        });
    }  //done

    //-------------------------------------------------------------------------
    $.fn.addClickTriggerToLinkes = function () {   //links mojud dar blockhaye unfluence, baraye nuew tab dorost kar nemikone
        var tanBlock = $(this);
        tanBlock.find('a').each(function () {
            var aTag = $(this);
            var aTarg = aTag.attr("target");
            if (aTag.attr("href") == undefined || aTag.attr("href") == "" || aTag.attr("href") == "#" ||
                (aTarg != null && aTarg != "" && aTarg.substr(0, 1) == "_"))
                return;

            if (aTag.attr("href") == null || aTag.attr("href").trim() == "")
                return;
            var aUrl = new tanUrl(aTag.attr("href"));
            
            var blockname = aUrl.getQueryParameter(tanFieldsName.tanblockTag);
            if (blockname == null || blockname == "") {
                var parrentBlock = $(this).closest('.' + tanFieldsName.tanBlockClassName);
                if (parrentBlock.length === 0) {
                    parrentBlock = $("#" + tanFieldsName.mainBlockName);
                    if (parrentBlock.length === 0) {
                        return true;
                    }
                }
                blockname = parrentBlock.attr("id");
                aUrl.setQueryParameter(tanFieldsName.tanblockTag, blockname);
                aTag.attr("href", aUrl.toString());
            }
            //aUrl.totalState = new tanUrl(window.location.href); //?  bar notInfluence?
            
            
            aTag.off().click(function (evt) {
                var aUrl= new tanUrl(aTag.attr("href"));
                var blockname = aUrl.getQueryParameter(tanFieldsName.tanblockTag);

                if (blockname == null || blockname == "") {
                    var parrentBlock = $(this).closest('.' + tanFieldsName.tanBlockClassName);
                    if (parrentBlock.length === 0) {
                        parrentBlock = $("#" + tanFieldsName.mainBlockName);
                        if (parrentBlock.length === 0) {
                            return true;
                        }
                    }
                    blockname = parrentBlock.attr("id");
                    aUrl.setQueryParameter(tanFieldsName.tanblockTag, blockname);
                    $(this).attr("href", aUrl.toString());
                }
                evt.preventDefault();
                var tanBlock = $('#' + blockname);
                aUrl.removeQueryParameter(tanFieldsName.tanblockTag);
                aUrl.totalState = null;
                tanBlock.LoadUrlToBlock(aUrl);
                return false;
            });
        });
    }; //done

    //-------------------------------------------------------------------------
    // Usable by end-user. EX: $("#myblock1").LoadUrlToBlock('/test2/create',"post", {userId:"id",userName:"name",userFam:"fam"},null);
    $.fn.LoadUrlToBlock = function (newUrl, method, data, options, influenceParrentsAndWindowsUrl, callbackFunction) {
        var tanBlock = $(this);
        if (method == null || method == undefined || method == "") method = "GET";
        var changeParrentsUrlAndWindowsUrl = true;
        if (tanBlock.hasClass(tanFieldsName.tanNotHistorYInfloenced) || influenceParrentsAndWindowsUrl == false)
            changeParrentsUrlAndWindowsUrl = false;
        
        tanBlock.Ajax_LoadURL(newUrl, method, data, options, tanBlock.attr('id'), changeParrentsUrlAndWindowsUrl, function (obj) {
            if (obj != null && obj.finalUrl != null &&
                (obj.finalUrl._schemaAndDomainAuthorityAndLocalUrl == "" || obj.CloseLayout==TanLayoutCloseState.CloseAndRefereshDependentBlocks || obj.CloseLayout==TanLayoutCloseState.CloseWidthoutAnyReferesh))
            {
                var wrapper = $(obj.tanBlock).closest('.' + tanFieldsName.tanOverlayBlockWrapper)
                    wrapper.addClass('noVisable'); 
                var parrentWrapper = wrapper.parent().closest('.' + tanFieldsName.tanOverlayBlockWrapper);
                if (parrentWrapper.length == 0)
                    parrentWrapper = $('body');
                parrentWrapper.removeClass('noScrollable');
            }
            if (callbackFunction != null && callbackFunction != undefined)
                callbackFunction(obj);



            //referesh source block
            if (obj.CloseLayout != TanLayoutCloseState.CloseWidthoutAnyReferesh) {
                var oldRefereshBlockName = $(obj.tanBlock).attr(tanFieldsName.TanSourceRefereshBlockName);
                var newRefereshBlockName = (new tanUrl(newUrl)).getQueryParameter(tanFieldsName.TanSourceRefereshBlockName);
                if (newRefereshBlockName != null && newRefereshBlockName.trim() != "")
                    $(obj.tanBlock).attr(tanFieldsName.TanSourceRefereshBlockName, newRefereshBlockName);
                if (oldRefereshBlockName != null && oldRefereshBlockName != undefined && oldRefereshBlockName.trim() != "") {
                    var sourceBlock = $('#' + oldRefereshBlockName);
                    var _currentBlockID = $(obj.tanBlock).attr('id');
                    var _sourceBlockID = sourceBlock.attr('id');
                    if (_currentBlockID.indexOf(_sourceBlockID) != 0
                        || obj.CloseLayout == TanLayoutCloseState.RefereshSourceBlockOnly
                        || obj.CloseLayout == TanLayoutCloseState.CloseAndRefereshDependentBlocks)
                        sourceBlock.LoadUrlToBlock(new tanUrl(sourceBlock.attr('url')), null, null, null, influenceParrentsAndWindowsUrl);
                    
                }
            }
        });

        return tanBlock;
    }; //done

    //-------------------------------------------------------------------------
    $.fn.Ajax_LoadURL = function (url, method, data, options, preBlockName, influenceParentsAndWindowsUrl, callbackfunction) {

        //#region variables
        var tanBlock = $(this);
        if (tanBlock.isTanProccessing() || tanBlock.isParrentsLoading())
            return;
        tanBlock.registerTanXHR(null);
        tanBlock.isTanProccessing(true);

        let wind= $(window), docu= $(document);
        var myPreBlockName = ""; if (preBlockName != null || preBlockName != undefined) myPreBlockName = preBlockName;
        if (url == null || url == undefined || new tanUrl(url)._schemaAndDomainAuthorityAndLocalUrl == "")
            url = new tanUrl(null);
        if (typeof url == "string")
            url = new tanUrl(url);


        if (method == undefined || method == null || method == "") method = "GET";

        var obj_response = {}; obj_response.success = true;

        var CloseLayout = url.getQueryParameter(tanFieldsName.TanLayoutCloseState);
        if (CloseLayout == TanLayoutCloseState.CloseAndRefereshDependentBlocks ||
            CloseLayout == TanLayoutCloseState.CloseWidthoutAnyReferesh) {
            url = new tanUrl(null);
            obj_response.CloseLayout = CloseLayout;
        }
        else
            obj_response.CloseLayout = CloseLayout == TanLayoutCloseState.RefereshSourceBlockOnly? 
                TanLayoutCloseState.RefereshSourceBlockOnly : TanLayoutCloseState.Nothing;

        obj_response.finalUrl = url; obj_response.data = ""; obj_response.tanBlock = tanBlock;
        //#endregion 


        //#region onBeforTanTanRequestSent 
        var obj_onBeforTanRequestSent = {};
        obj_onBeforTanRequestSent.tanBlock = tanBlock;
        obj_onBeforTanRequestSent.url = url;
        obj_onBeforTanRequestSent.data = data;
        obj_onBeforTanRequestSent.animate = true;
        tanBlock.trigger("onBeforTanRequestSent", obj_onBeforTanRequestSent); wind.trigger("onBeforTanRequestSent", obj_onBeforTanRequestSent); docu.trigger("onBeforTanRequestSent", obj_onBeforTanRequestSent);
        if (obj_onBeforTanRequestSent.animate == true) { tanBlock.animate({ opacity: 0.2 }, 1000); }
        //#endregion


        //#region request initiating 
        
        var settings =
        {
            url: obj_onBeforTanRequestSent.url.toString(),
            method: method, //"GET", "POST", "PUT", "DELETE" 
            //headers: _headers,
            data: obj_onBeforTanRequestSent.data, //{ name: "John", location: "Boston" },
            processData: true, // age true bashe, data is converted to a query string, if not, already a string
            cache: false, // will add a "_" timestamp parameter to url
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            timeout: 120000,
            async: true,
            global: false // disable global events
        };
        if (typeof options != "undefined" && options != null)
            settings = $.extend(settings, options);

        var _headers = {};
        _headers[tanFieldsName.preblocknameTag] = myPreBlockName

        if ('headers' in settings)
        {
            if (settings.headers !== null && typeof settings.headers === 'object')
                settings.headers = $.extend(settings.headers, _headers);
            else
                settings.headers = _headers;
        }
        else
            settings["headers"] = _headers;

        //#endregion

        
        var xhr;
        //#region sending Ajax request and events
        if (url._schemaAndDomainAuthorityAndLocalUrl != "") {
            xhr = $.ajax(settings)
                .error(function (xhr, status, errorThrown) {
                    obj_response.success = false;
                    if (status === "timeout")
                        obj_response.data = "Reguest Timeout Error...!";
                    else if (status === "abort")
                        obj_response.data = "Request is aborted...!";
                    else {
                        obj_response.data = xhr.responseText;
                    }

                })
                .success(function (data, textStatus, jqXhr) {
                    obj_response.success = true;
                    obj_response.data = data;
                    if (jqXhr.getResponseHeader(tanFieldsName.finalUrlTag) != null &&
                        jqXhr.getResponseHeader(tanFieldsName.finalUrlTag) != undefined) {
                        obj_response.finalUrl = new tanUrl(jqXhr.getResponseHeader(tanFieldsName.finalUrlTag));
                        obj_response.finalUrl.removeQueryParameter("_");
                        obj_response.finalUrl.totalState == null;
        
                        var CloseLayout = obj_response.finalUrl.getQueryParameter(tanFieldsName.TanLayoutCloseState);
                        if (CloseLayout == TanLayoutCloseState.CloseAndRefereshDependentBlocks ||
                            CloseLayout == TanLayoutCloseState.CloseWidthoutAnyReferesh) {
                            obj_response.finalUrl = new tanUrl(null);
                            obj_response.data = "";
                            obj_response.CloseLayout = CloseLayout;
                        }
                        else
                            obj_response.CloseLayout = CloseLayout == TanLayoutCloseState.RefereshSourceBlockOnly ?
                                TanLayoutCloseState.RefereshSourceBlockOnly : TanLayoutCloseState.Nothing;
                    }

                })
                .complete(function (XHR, status) {
                    if (XHR.getResponseHeader(tanFieldsName.TanDocumentRedirectHeader) == "true")
                    {
                        window.location.replace(XHR.getResponseHeader(tanFieldsName.finalUrlTag));
                        return;
                    }
                    tanBlock.registerTanXHR(null);
                    if (status == "abort")
                    {
                        if (obj_onBeforTanRequestSent.animate == true) {
                            tanBlock.finish();
                            tanBlock.animate({ opacity: 1 }, 700);
                        }
                        return;
                    }
                    if (obj_response.success === false)
                        tanBlock.trigger("onTanBlockLoadError", obj_response); wind.trigger("onTanBlockLoadError", obj_response); docu.trigger("onTanBlockLoadError", obj_response);

                        tanBlock.trigger("onBeforTanUrlChange", obj_response); wind.trigger("onBeforTanUrlChange", obj_response); docu.trigger("onBeforTanUrlChange", obj_response);
                        var isUrlRedirected = false;
                        if (new tanUrl(tanBlock.attr("url")).toString() != obj_response.finalUrl.toString() &&
                            new tanUrl(tanBlock.attr("url")).toString() != obj_response.finalUrl.toString() + "?") {
                            isUrlRedirected = true;
                            tanBlock.updateBlockUrlToUp(obj_response.finalUrl);
                        }
                        tanBlock.trigger("onAfterTanUrlChanged", obj_response); wind.trigger("onAfterTanUrlChanged", obj_response); docu.trigger("onAfterTanUrlChanged", obj_response);
                        tanBlock.trigger("onBeforTanContentChange", obj_response); wind.trigger("onBeforTanContentChange", obj_response); docu.trigger("onBeforTanContentChange", obj_response);
                        tanBlock.html(obj_response.data);
                        tanBlock.trigger("onAfterTanContentChanged", obj_response); wind.trigger("onAfterTanContentChanged", obj_response); docu.trigger("onAfterTanContentChanged", obj_response);
                        tanBlock.updateBlocksUrlsFromLeafs(false);
                        tanBlock.addClickTriggerToLinkes();
                        tanBlock.addSubmitTriggerToFormTags();


                        if (influenceParentsAndWindowsUrl != false && isUrlRedirected)
                            updateWindowChildrenQuery(true);
                        else if (!tanBlock.hasClass(tanFieldsName.tanNotHistorYInfloenced))
                            tanBlock.tanUpdateLinkTotalState();

                        if (obj_onBeforTanRequestSent.animate == true) {
                            tanBlock.finish();
                            tanBlock.animate({ opacity: 1 }, 700);
                        }


                        if (tanBlock.hasClass(tanFieldsName.tanOverlayBlock))
                            tanBlock.tanInitiateSubOverlays(false);
                        else
                            tanBlock.tanInitiateSubOverlays(true);

                        if (typeof callbackfunction != "undefined" && callbackfunction != null)
                            callbackfunction(obj_response);

                });

            tanBlock.registerTanXHR(xhr);
        }
        else {
            obj_response.success = true;
            obj_response.data = "";
            obj_response.finalUrl = new tanUrl(null);

            tanBlock.trigger("onBeforTanUrlChange", obj_response); wind.trigger("onBeforTanUrlChange", obj_response); docu.trigger("onBeforTanUrlChange", obj_response);
            var isUrlRedirected = false;
            if (tanBlock.attr("url") != null && new tanUrl(tanBlock.attr("url").trim()).toString() != obj_response.finalUrl.toString()) {
                isUrlRedirected = true;
                tanBlock.updateBlockUrlToUp(obj_response.finalUrl);
            }
            tanBlock.trigger("onAfterTanUrlChanged", obj_response); wind.trigger("onAfterTanUrlChanged", obj_response); docu.trigger("onAfterTanUrlChanged", obj_response);
            tanBlock.trigger("onBeforTanContentChange", obj_response); wind.trigger("onBeforTanContentChange", obj_response); docu.trigger("onBeforTanContentChange", obj_response);
            tanBlock.html(obj_response.data);
            tanBlock.trigger("onAfterTanContentChanged", obj_response); wind.trigger("onAfterTanContentChanged", obj_response); docu.trigger("onAfterTanContentChanged", obj_response);
            //tanBlock.addClickTriggerToLinkes();
            //tanBlock.addSubmitTriggerToFormTags();


            if (influenceParentsAndWindowsUrl != false && isUrlRedirected)
                updateWindowChildrenQuery(true);
            else if (!tanBlock.hasClass(tanFieldsName.tanNotHistorYInfloenced))
                tanBlock.tanUpdateLinkTotalState();

            //tanBlock.tanInitiateSubOverlays(false);
            if (obj_onBeforTanRequestSent.animate == true) {
                tanBlock.finish();
                tanBlock.animate({ opacity: 1 }, 700);
            }

            if (typeof callbackfunction != "undefined" && callbackfunction != null)
                callbackfunction(obj_response);

            
        }

        tanBlock.isTanProccessing(false);
        //#endregion
        
        return tanBlock;
    }; //done

    //-------------------------------------------------------------------------
    $.fn.updateBlockUrlToUp = function (newUrl, ulteredSubBlock) { //notInflouenced ha jump shavad //if (obj.finalUrl.toString() != tanBlock.attr("url"))
        
        var tanBlock = $(this).first();
        var parrentBlock = tanBlock.parent().closest('.' + tanFieldsName.tanBlockClassName);

        if (ulteredSubBlock == null || ulteredSubBlock == undefined) {
            if (newUrl.toString() != new tanUrl(tanBlock.attr("url")).toString())
                tanBlock.attr("url", newUrl.toString());
            else
                return tanBlock;
            if (tanBlock.hasClass(tanFieldsName.tanNotHistorYInfloenced))
                return tanBlock;
            
            if (parrentBlock.length != 0) {
                parrentBlock.updateBlockUrlToUp(newUrl, tanBlock.attr("id"));
            }
            return tanBlock;
        }

        var tanBlockUrl = new tanUrl(tanBlock.attr("url"));
        tanBlockUrl.setChildrenItem(ulteredSubBlock, newUrl);
        tanBlock.attr("url", tanBlockUrl.toString());
        if (tanBlock.hasClass(tanFieldsName.tanNotHistorYInfloenced))
            return tanBlock;
        if (parrentBlock.length != 0)
            parrentBlock.updateBlockUrlToUp(tanBlockUrl, tanBlock.attr("id"));
        
        return tanBlock;
    }; //done

    //-------------------------------------------------------------------------
    $.fn.addSubmitTriggerToFormTags = function () { // if form.target.startwith('_') then, do not use ajax
        var tanBlock = $(this);
        var targetBlock;
        tanBlock.find('form').each(function () {
            var frm = $(this);
            frm.off().submit(function (evt) {
                frm = $(this);
                if (frm.attr('target') != undefined && frm.attr('target') != null && frm.attr('target') != "") {
                    if (frm.attr('target').substr(0, 1) == "_") return true;
                    targetBlock = $('#' + frm.attr('target'));
                }
                else if (frm.closest('.' + tanFieldsName.tanBlockClassName) != null) {
                    targetBlock = frm.closest('.' + tanFieldsName.tanBlockClassName);
                }
                else
                    return true;

                evt.preventDefault();
                var method = "GET";
                if (frm.attr('method') != null && frm.attr('method') != "")
                    method = frm.attr('method');

                var url;
                if (frm.attr('action') != null && frm.attr('action') != "") {
                    url = new tanUrl(frm.attr('action'));
                    url.totalState = null;
                    url.removeQueryParameter(tanFieldsName.tanblockTag);
                    url.childrenString = new tanUrl(targetBlock.attr("url")).childrenString;
                }
                else
                    url = new tanUrl("/error");
                if (url.toString() == "") url = new tanUrl("/error");

                targetBlock.LoadUrlToBlock(url, method, frm.serialize(), null,
                    !targetBlock.hasClass(tanFieldsName.tanNotHistorYInfloenced), null)
                return false;
            });  //a form submit

        }); // forms each
        
    }; //done

    //-------------------------------------------------------------------------
    $.fn.updateBlockUrlToDown = function (newUrl) {
        if (newUrl == null)
            newUrl = new tanUrl(null);
        var block = $(this);
        var oldUrl = new tanUrl(block.attr("url"));

        var tempOldUrl = new tanUrl(oldUrl.toString());
        tempOldUrl.childrenString = null;
        var tempNewUrl = new tanUrl(newUrl.toString());
        tempNewUrl.childrenString = null;



        if (tempOldUrl.toString() != tempNewUrl.toString())
        {
            block.LoadUrlToBlock(newUrl, "GET", null, null, !block.hasClass(tanFieldsName.tanNotHistorYInfloenced), null);
            return;
        }
        else if (
            (oldUrl.children != null || newUrl.children != null) && (
                (oldUrl.children != null && newUrl.children == null)
                || (oldUrl.children == null && newUrl.children != null)
                || (oldUrl.children.length != newUrl.children.length)
                )) {
                block.LoadUrlToBlock(newUrl, "GET", null, null, !block.hasClass(tanFieldsName.tanNotHistorYInfloenced), null);
                return;
            }

        if (oldUrl.children != null)
            oldUrl.children.forEach(function (pair) {
                $("#" + pair["L"]).updateBlockUrlToDown(newUrl.getChildrenItem(pair["L"]));
            });
    }  // done: used for onWebHistoryChange
    
    //-------------------------------------------------------------------------
    $.fn.tanInitiateSubOverlays = function (justForChlidren) {
        if (justForChlidren) {
            var wrapper = $(this);
            wrapper.find('.' + tanFieldsName.tanOverlayBlock).each(function () {
                var currentOverlayBlock = $(this);
                var expectedParrentBlock = currentOverlayBlock.parent().closest('.' + tanFieldsName.tanOverlayBlock)
                if (expectedParrentBlock.length > 0 &&
                    $('#' + wrapper.attr("id") + " #" + expectedParrentBlock.attr("id")).length > 1)
                    return;
                currentOverlayBlock.tanInitiateSubOverlays(false);
            });
            return;
        }

        
        var tanBlockOverlay = $(this);
        var tanBlockOverlayWrapper = tanBlockOverlay.closest('.' + tanFieldsName.tanOverlayBlockWrapper);
        if (tanBlockOverlayWrapper.length == 0)
            tanBlockOverlayWrapper = $('body');

        
        //disable parrent and show overflow
        var url = tanBlockOverlay.attr('url');
        var closeState = (new tanUrl(url)).getQueryParameter(tanFieldsName.TanLayoutCloseState);
        if (closeState != TanLayoutCloseState.CloseAndRefereshDependentBlocks &&
            closeState != TanLayoutCloseState.CloseWidthoutAnyReferesh)
            closeState= TanLayoutCloseState.Nothing;

        
        
        if (url != null && url != ""
            && (new tanUrl(url))._schemaAndDomainAuthorityAndLocalUrl.trim() != ""
            && !(closeState != TanLayoutCloseState.Nothing)
            ) {
            var parrenttanBlockOverlayWrapper = tanBlockOverlayWrapper.parent().closest('.' + tanFieldsName.tanOverlayBlockWrapper);
            if (parrenttanBlockOverlayWrapper.length == 0)
                parrenttanBlockOverlayWrapper = $('body');
            parrenttanBlockOverlayWrapper.addClass('noScrollable');
            tanBlockOverlayWrapper.removeClass('noVisable');
        }


        // close Overlay
        tanBlockOverlayWrapper.find(" > ." + tanFieldsName.tanBtnClose).off().click(function () {
            $(this).parent().find(" > ." + tanFieldsName.tanOverlayBlock).first().LoadUrlToBlock(new tanUrl(null));
        });
        tanBlockOverlayWrapper.off().dblclick(function (event) {
            if ($(event.target).is(this))
                $(this).find(" > ." + tanFieldsName.tanOverlayBlock).first().LoadUrlToBlock(new tanUrl(null));
        });


        // do for children, as well
        tanBlockOverlay.find('.' + tanFieldsName.tanOverlayBlock).each(function () {
            var currentOverlayBlock = $(this);
            if (currentOverlayBlock.parent().closest('.' + tanFieldsName.tanOverlayBlock).first().attr('id') != tanBlockOverlay.attr('id'))
                return;
            currentOverlayBlock.tanInitiateSubOverlays(false);
        });


    }


    
    //-------------------------------------------------------------------------
    $.fn.isTanProccessing = function (proccessing) {
        var tanBlock = $(this);
        var blockName = tanBlock.attr('id');

        var blockLoadingState = null;
        for (i = 0; i < activeLoadingBlocks.length; i++) {
            var item = activeLoadingBlocks[i];
            if (item["blockName"] == blockName) {
                blockLoadingState = activeLoadingBlocks[i];
                break;
            }
        }

        if (proccessing == undefined || proccessing == null) 
        {
            if (blockLoadingState == null || blockLoadingState == undefined)
                return false;
            else
                return blockLoadingState["isProccessing"] == null ? false : blockLoadingState["isProccessing"];
        }


        if (blockLoadingState == null || blockLoadingState == undefined) {
            blockLoadingState = {};
            blockLoadingState["blockName"] = blockName;
            blockLoadingState["isProccessing"] = proccessing;
            activeLoadingBlocks.push(blockLoadingState);
        }
        else {
            blockLoadingState["isProccessing"] = proccessing;
        }

    }


    $.fn.registerTanXHR = function (xhr) {
        var tanBlock = $(this);
        var blockName = tanBlock.attr('id');

        var blockLoadingState = null;
        for (i = 0; i < activeLoadingBlocks.length; i++) {
            var item = activeLoadingBlocks[i];
            if (item["blockName"] == blockName) {
                blockLoadingState = activeLoadingBlocks[i];
                break;
            }
        }

        if (blockLoadingState == null || blockLoadingState == undefined) {
            if (xhr != null) {
                blockLoadingState = {};
                blockLoadingState["blockName"] = blockName;
                blockLoadingState["xhr"] = xhr;
                activeLoadingBlocks.push(blockLoadingState);
            }
            
        }
        else {
            var tempxhr = blockLoadingState["xhr"];
            if (tempxhr != null && tempxhr.readyState < 4) 
                tempxhr.abort();
            
            blockLoadingState["xhr"] = null;
            blockLoadingState["xhr"] = xhr;
        }

        if (xhr==null)
            tanBlock.find('.' + tanFieldsName.tanBlockClassName).each(function () {
                $(this).registerTanXHR(null);
            });

    }


    $.fn.isParrentsLoading = function () {
        var tanBlock = $(this);
        var blockName = tanBlock.attr('id');
        var parentBlock = tanBlock.parent().closest('.'+tanFieldsName.tanBlockClassName);
        if (parentBlock.length == 0)
            parentBlock = null;
        
        var blockLoadingState = null;
        for (i = 0; i < activeLoadingBlocks.length; i++) {
            var item = activeLoadingBlocks[i];
            if (item["blockName"] == blockName) {
                blockLoadingState = activeLoadingBlocks[i];
                break;
            }
        }

        if (blockLoadingState == null || blockLoadingState == undefined) {
            if (parentBlock == null)
                return false;
            else
                return parentBlock.isParrentsLoading(true);
        }
        else {
            if (blockLoadingState["xhr"] != null && blockLoadingState["xhr"].readyState < 4)
                return true;

            if (parentBlock == null)
                return false;
            else
                return parentBlock.isParrentsLoading(true);
        }
        
        return false;
    }


    //-------------------------------------------------------------------------
}(jQuery));
//#endregion






//#region TanEvents
(function ($) {

    $.fn.onTanBlockLoadError = function (func) {
        var div = this;
        div.on("onTanBlockLoadError", function (event, obj) {
            func(param1, param2);
        });
    };

    //---------------------------------------------
    $.fn.onBeforTanRequestSent = function (func) {
        var div = this;
        div.on("onBeforTanRequestSent", function (event, obj) {
            func(param1, param2);
        });
    };

    //---------------------------------------------
    $.fn.onBeforTanUrlChange = function (func) {
        var div = this;
        div.on("onBeforTanUrlChange", function (event, obj) {
            func(param1, param2);
        });
    };

    //---------------------------------------------
    $.fn.onAfterTanUrlChanged = function (func) {
        var div = this;
        div.on("onAfterTanUrlChanged", function (event, obj) {
            func(param1, param2);
        });
    };
    
    //---------------------------------------------
    //$("h2#myh").trigger("onBeforTanContentChange", ["p1", "p2"]);
    $.fn.onBeforTanContentChange = function (func) {
        var div = this;
        div.on("onBeforTanContentChange", function (event, obj) {
            func(param1, param2);
        });
    };
    //$('h2#myhh').onBeforTanContentChange(function (obj) {
    //    console.log(obj.field);
    //});

    //---------------------------------------------
    $.fn.onAfterTanContentChanged = function (func) {
        var div = this;
        div.on("onAfterTanContentChanged", function (event, obj) {
            func(param1, param2);
        });
    };
    //---------------------------------------------
}(jQuery));











//#endregion



//#region TanUrl
class tanUrl {


    //constructor =====================================================================
    constructor(inputUrl) { //window.location.href
        this._schemaAndDomainAuthorityAndLocalUrl = "";
        this._hash = "";
        this.queryString = "";

        if (inputUrl == null || inputUrl == "") {
            return;
        }

        var urlString = "";
        if (typeof inputUrl == "object")
            try {
                urlString = inputUrl.toString();
            } catch (eee) {
                return;
            }
        else if (typeof inputUrl == "string")
            urlString = inputUrl.trim();
        else
            return;

        if (urlString.trim() == "")
            return;


        var tempUrl = "";
        try {
            tempUrl = new URL(urlString, window.location.href);
        } catch (e) {
            return;
        }



        this._schemaAndDomainAuthorityAndLocalUrl = tempUrl != "" ? tempUrl.origin + tempUrl.pathname : "";

        this._hash = tempUrl != "" ? tempUrl.hash : "";
        if (tempUrl != "" && tempUrl.hash.length == 0 && tempUrl.href.includes("#"))
            this._hash = "#";

        if (tempUrl != "" && tempUrl.search.length == 0 && tempUrl.href.includes("?"))
            this.queryString = "?";
        else
            this.queryString = tempUrl != "" ? tempUrl.search : "";

    }

    // property =====================================================================
    set queryString(value) {
        if (value == null || value.trim() == "") {
            this._questionMark = "";
            this.queries = "";
            return;
        }
        this._questionMark = "?";
        this.queries = value.substr(1, value.length - 1);
    }
    get queryString() {
        let ques = (this._questionMark == "?" || this.queries != "")? "?" : "";
        return  ques + this.queries;
    }
    //---------------------------------------------------
    set queries(value) {
        this._queries = [];
        this.children=null;
        this.totalState=null;
        if (value == null || value == "") {
            return;
        }

        var tempPairs = value.split('&');
        for (let i = 0; i < tempPairs.length; i++) {
            let pair = tempPairs[i].split('=');
            if (pair.length>2) 
                pair = [pair[0], tempPairs[i].substr(tempPairs[i].indexOf('=') + 1)]

            let left = pair[0], right =null;
            if (pair.length == 2)
                right = pair[1];


            if (left.toLowerCase() == tanFieldsName.childrentag.toLowerCase()) {
                this.childrenString = right;
                continue;
            }
            else if (left.toLowerCase() == tanFieldsName.totalstateTag.toLowerCase()) {
                if (right == null || right == "")
                    this.totalState = null;
                else
                    this.totalState = new tanUrl(urlDecode(right));
                continue;
            }

            var pairObj = {};
            pairObj["L"] = left;
            pairObj["R"] = right;
            this._queries.push(pairObj);
        }
    }
    get queries() {
        let result = "";
        if (this._queries != null) {
            for (let i = 0; i < this._queries.length; i++) {
                let pair = this._queries[i];
                result += (i == 0 ? "" : "&");
                result += pair["L"];
                let right = pair["R"];

                if (right != null)
                    result += "=" + right;
            }
        }

        if (this.childrenString != null) {
            result += (result == "" ? "" : "&");
            result += tanFieldsName.childrentag + "=" + this.childrenString;
        }
        if (this.totalState != null) {
            result += (result == "" ? "" : "&");
            result += tanFieldsName.totalstateTag + "=" + urlEncode(this.totalState.toString());
        }

        return result;
    }
    //---------------------------------------------------
    set childrenString(value) {
        if (value == null) {
            this._children = null;
            return;
        }
        this._children = [];
        if (value == "") 
            return;

        value = urlDecode(value);
        var tempPairs = value.split('&');
        for (let i = 0; i < tempPairs.length; i++) {
            let pair = tempPairs[i].split('=');
            let left = pair[0], right = null;
            if (pair.length == 2)
                right = pair[1];
            else if (pair.length > 2)
                right = tempPairs[i].substr(tempPairs[i].indexOf('=') + 1);

            var pairObj = {};
            pairObj["L"] = left;
            pairObj["R"] = new tanUrl(urlDecode(right));
            this._children.push(pairObj);
        }

        //akhar children, totalstate

    }
    get childrenString() {
        
        if (this._children == null)
            return null;

        let result = "";
        for (let i = 0; i < this._children.length; i++) {
            let pair = this._children[i];
            result += (i == 0 ? "" : "&");
            result += pair["L"];
            let right = urlEncode(pair["R"].toString());
            if (right != null)
                result += "=" + right;
        }
        
        return urlEncode(result);
    }
    //---------------------------------------------------
    set children(value) {
        this.childrenString = value;
    }
    get children() {
        return this._children;
    } 


    // Method =====================================================================
    toString() {
        return this._schemaAndDomainAuthorityAndLocalUrl + this.queryString + this._hash;
    }
    //---------------------------------------------------
    getQueryParameter(key) {
        if (key == null || key == undefined || this._queries == null || this._queries.length == 0)
            return null;

        for (let i = 0; i < this._queries.length; i++) {
            let pair = this._queries[i];
            if (pair["L"].toLowerCase() != key.toLowerCase())
                continue;
            else
                return (pair["R"]==null)? null: pair["R"];
        }
        return null;
    }
    //---------------------------------------------------
    // Remember: assign to totalState directely
    setQueryParameter(key, newValue) {
        if (key == null || key == undefined)
            return;

        if (this._queries == null )
            this._queries = [];

        for (let i = 0; i < this._queries.length; i++) {
            let pair = this._queries[i];
            if (pair["L"].toLowerCase() != key.toLowerCase())
                continue;
            else
            {
                pair["R"] = newValue;
                return;
            }
        }

        var pairObj = {};
        pairObj["L"] = key;
        pairObj["R"] = newValue;
        this._queries.push(pairObj);
    }
    //---------------------------------------------------
    removeQueryParameter(key) {
        if (key == null || key == undefined || this._queries == null || this._queries.length == 0)
            return null;

        var j = null;
        for (let i = 0; i < this._queries.length; i++) {
            let pair = this._queries[i];
            if (pair["L"].toLowerCase() == key.toLowerCase()) {
                j = i;
                break;
            }
        }
        if (j != null)
            this._queries.splice(j, 1);

    }
    //---------------------------------------------------
    getChildrenItem(key) {
        if (key == null || key == undefined || this._children == null || this._children.length == 0)
            return null;

        for (let i = 0; i < this._children.length; i++) {
            let pair = this._children[i];
            if (pair["L"].toLowerCase() == key.toLowerCase())
                return pair["R"];
        }
        return null;
    }
    //---------------------------------------------------
    setChildrenItem(key, newUrl) {
        if (typeof stringValue == "string")
            newUrl = new tanUrl(newUrl);

        if (key == null || key == undefined )
            return null;

        if (this._children == null || this._children.length == 0)
            this._children = [];
        for (let i = 0; i < this._children.length; i++) {
            let pair = this._children[i];
            if (pair["L"].toLowerCase() != key.toLowerCase())
                continue;
            else
            {
                pair["R"] = newUrl;
                return;
            }
        }
        let newPair = {};
        newPair["L"]= key;
        newPair["R"] = newUrl;
        this._children.push(newPair);

    }
    //---------------------------------------------------
    removeChildrenItem(key) {
        if (key == null || key == undefined || this._children == null || this._children.length == 0)
            return null;

        var j = null;
        for (let i = 0; i < this._children.length; i++) {
            let pair = this._children[i];
            if (pair["L"].toLowerCase() == key.toLowerCase()) {
                j = i;
                break;
            }
        }
        if (j!=null)
            this._children.splice(j, 1);
        if (this._children.length == 0)
            this._children = null;
    }
    //---------------------------------------------------
    
}
//#endregion 



//#region Encoding 

function urlEncode(plainUrl) {
    if (plainUrl == null)
        return null;
    return encodeURIComponent(plainUrl);
}
function urlDecode(encodedUrl) {
    if (encodedUrl == null)
        return null;
    return decodeURIComponent(encodedUrl);
}

//#endregion

















