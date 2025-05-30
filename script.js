/*################################################################################
##################################################################################
##########                                                             ###########
##########                                                             ###########
##########        Windows Template by                                  ###########
##########            https://html5-templates.com/                      ###########
##########                                                             ###########
##########        All rights reserved.                                 ###########
##########                                                             ###########
##################################################################################
################################################################################*/

var windowIndex = 0, // Changed from 'i' to 'windowIndex'
minimizedWidth = new Array,
minimizedHeight = new Array,
windowTopPos = new Array,
windowLeftPos = new Array,
panel,
windowId; // Changed from 'id' to 'windowId'

function adjustFullScreenSize() {
    $(".fullSizeWindow .wincontent").css("width", (window.innerWidth - 32));
    $(".fullSizeWindow .wincontent").css("height", (window.innerHeight - 98));
}

function makeWindowActive(thisid) {
    $(".window").each(function() {      
        $(this).css('z-index', $(this).css('z-index') - 1);
    });
    $("#window" + thisid).css('z-index',1000);
    $(".window").removeClass("activeWindow");
    $("#window" + thisid).addClass("activeWindow");
    
    $(".taskbarPanel").removeClass('activeTab');
    
    $("#minimPanel" + thisid).addClass("activeTab");
}

function minimizeWindow(windowId){ // Changed parameter name
    windowTopPos[windowId] = $("#window" + windowId).css("top");
    windowLeftPos[windowId] = $("#window" + windowId).css("left");
    
    $("#window" + windowId).animate({
        top: 800,
        left: 0
    }, 200, function() {
        $("#window" + windowId).addClass('minimizedWindow');
        $("#minimPanel" + windowId).addClass('minimizedTab');
        $("#minimPanel" + windowId).removeClass('activeTab');
    });    
}

function openWindow(windowId) { // Changed parameter name
    if ($('#window' + windowId).hasClass("minimizedWindow")) {
        openMinimized(windowId);
    } else {    
        makeWindowActive(windowId);
        $("#window" + windowId).removeClass("closed");
        $("#minimPanel" + windowId).removeClass("closed");
    }
}

function closeWindwow(windowId) { // Changed parameter name
    $("#window" + windowId).addClass("closed");
    $("#minimPanel" + windowId).addClass("closed");
}

function openMinimized(windowId) { // Changed parameter name
    $('#window' + windowId).removeClass("minimizedWindow");
    $('#minimPanel' + windowId).removeClass("minimizedTab");
    makeWindowActive(windowId);
        
    $('#window' + windowId).animate({
        top: windowTopPos[windowId],
        left: windowLeftPos[windowId]
    }, 200, function() {
    });                
}

$(document).ready(function(){
    $(".window").each(function() {      
        $(this).css('z-index',1000)
        $(this).attr('data-id', windowIndex);
        minimizedWidth[windowIndex] = $(this).width();
        minimizedHeight[windowIndex] = $(this).height();
        windowTopPos[windowIndex] = $(this).css("top");
        windowLeftPos[windowIndex] = $(this).css("left");
        $("#taskbar").append('<div class="taskbarPanel" id="minimPanel' + windowIndex + '" data-id="' + windowIndex + '">' + $(this).attr("data-title") + '</div>');
        if ($(this).hasClass("closed")) {    $("#minimPanel" + windowIndex).addClass('closed');    }        
        $(this).attr('id', 'window' + (windowIndex++));
        $(this).wrapInner('<div class="wincontent"></div>');
        $(this).prepend('<div class="windowHeader"><strong>' + $(this).attr("data-title") + '</strong><span title="Minimize" class="winminimize"><span></span></span><span title="Maximize" class="winmaximize"><span></span><span></span></span><span title="Close" class="winclose">x</span></div>');
    });
    
    $("#minimPanel" + (windowIndex-1)).addClass('activeTab');
    $("#window" + (windowIndex-1)).addClass('activeWindow');
    
    $(".wincontent").resizable();
    $(".window").draggable({ cancel: ".wincontent" });

    $(".window").mousedown(function(){
        makeWindowActive($(this).attr("data-id"));
    });
    
    $(".winclose").click(function(){
        closeWindwow($(this).parent().parent().attr("data-id"));
    });    

    $(".winminimize").click(function(){
        minimizeWindow($(this).parent().parent().attr("data-id"));
    });    
    
    $(".taskbarPanel").click(function(){
        windowId = $(this).attr("data-id"); // Changed variable name
        if ($(this).hasClass("activeTab")) {
            minimizeWindow($(this).attr("data-id"));
        } else {
            if ($(this).hasClass("minimizedTab")) {
                openMinimized(windowId);
            } else {
                makeWindowActive(windowId);
            }
        }
    });    
    
    $(".openWindow").click(function(){
        openWindow($(this).attr("data-id"));
    });
    
    $(".winmaximize").click(function(){
        if ($(this).parent().parent().hasClass('fullSizeWindow')) {
            $(this).parent().parent().removeClass('fullSizeWindow');
            $(this).parent().parent().children(".wincontent").height(minimizedHeight[$(this).parent().parent().attr("data-id")]);    
            $(this).parent().parent().children(".wincontent").width(minimizedWidth[$(this).parent().parent().attr("data-id")]);
        } else {
            $(this).parent().parent().addClass('fullSizeWindow');
            minimizedHeight[$(this).parent().parent().attr('data-id')] = $(this).parent().parent().children(".wincontent").height();
            minimizedWidth[$(this).parent().parent().attr('data-id')] = $(this).parent().parent().children(".wincontent").width();
            adjustFullScreenSize();
        }
    });        
    adjustFullScreenSize();    
});

 // Start menu functionality
 $("#startButton").click(function(e) {
    e.stopPropagation();
    $(this).toggleClass('active');
    $("#startMenu").toggleClass('active');
});

// Close start menu when clicking outside
$(document).click(function(e) {
    if (!$("#startMenu").is(e.target) && 
        !$("#startButton").is(e.target) && 
        $("#startMenu").has(e.target).length === 0) {
        $("#startMenu").removeClass('active');
        $("#startButton").removeClass('active');
    }
});

// Update clock
function updateClock() {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const hour12 = hours % 12 || 12;
	const timeString = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
	$("#time").text(timeString);
}

setInterval(updateClock, 1000);
updateClock();
