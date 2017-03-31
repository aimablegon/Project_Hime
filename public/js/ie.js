function ScriptEngineMinorVersion(){
    var agent = navigator.userAgent.toLowerCase();
    var name = navigator.appName;
    var version = '';
    var word;

    if ( name == "Microsoft Internet Explorer" ) word = "msie ";
    else {
        // IE 11
        if ( agent.search("trident") > -1 ) word = "trident/.*rv:";
        // Microsoft Edge
        else if ( agent.search("edge/") > -1 ) word = "edge/";
    }
    var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" );

    if (  reg.exec( agent ) != null  ) version = RegExp.$1 + RegExp.$2;
    if ( (name == 'Netscape' && agent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {        //  IE 인지 우선 확인
        if(navigator.appVersion.indexOf("MSIE 8") > -1){  // IE 8버전 이면..
            console.log("IE 8");
            $('.video_banner').remove();
            $('.ie8_first').addClass('active');
            $('.carousel-indicators li:last-child').remove();
            $('.main_banner').carousel({
                interval: 3000
            });
            $('.ie8DisplayNone').css('display','none');
            $('.ie8DisplayBlock').css('display','block');
            $('.wow').attr('data-wow-duration','');
            $('.wow').removeClass('wow');
            $('.fadeInUp').removeClass('fadeInUp');
            $('.fadeInDown').removeClass('fadeInDown');
            $('.fadeInLeft').removeClass('fadeInLeft');
            $('.fadeInRight').removeClass('fadeInRight');
            $('.fadeInLeftBig').removeClass('fadeInLeftBig');
            $('.fadeInRightBig').removeClass('fadeInRightBig');
            $('.fadeInUpBig').removeClass('fadeInUpBig');
        }else if(Math.floor(version) <= 7){
            location.href="/himedia/underIe8.html"
        }
    }

}
$(document).ready(function() {
    ScriptEngineMinorVersion();
});
