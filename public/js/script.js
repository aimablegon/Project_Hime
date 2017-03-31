//set cookie
function setCookie(name, value, expiredays) {
    var today = new Date();
    today.setDate(today.getDate() + expiredays);
    document.cookie = name + '=' + escape(value) + '; path=/; expires=' + today.toGMTString() + ';'
}
//경고창
function alertMsg(msg){
    $('body').append('<div class="modalBlind_trans"></div>');
    $('body').append('<div class="modalPopup" style="width:350px; background-color:#FFF; margin-left:-175px; margin-top:-150px; padding:30px 10px;display:block;" id="msg_modal"><div class="text-center text_in"></div><br><br><div class="btns text-center"><button style="border:1px #666 solid; padding:5px 10px;" class="text-center alert-closeBtn">확인</button></div></div>').find('.text_in').text(msg);
}

var isIE8 = null;

//ie8 check
if ( (navigator.appName == 'Netscape' && navigator.userAgent.toLowerCase().search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1) ) {        //  IE 인지 우선 확인
    if(navigator.appVersion.indexOf("MSIE 8") > -1){  // IE 8버전 이면..
        isIE8 = true;
    }
}
$(document).ready(function(){
    new WOW().init();
    //font
    var agent = navigator.userAgent.toLowerCase();
    // top_banner
    if($('.top_banner').hasClass('on')){
        $('.wrapper').css({'top':'120px'});
        $('.top_banner .close_btn.close').click(function(){
            $('.wrapper').animate({top:0},300,function(){
                $('.top_banner').removeClass('on');
            });
            $('.main_quick').animate({top:'250px'})
        });
        $('.top_banner .close_btn.close_today').click(function(){
            setCookie('himediaNotToday','Y', 1);
            $('.wrapper').animate({top:0},300,function(){
                $('.top_banner').removeClass('on');
            });
            $('.main_quick').animate({top:'250px'});
        });
    }
    var fadeidx=0;
    function fadeinout(){
        $('.fadebanner li').eq(fadeidx).find('div').fadeIn("slow").parent().siblings().find('div').fadeOut("slow")
        fadeidx++;
        if(fadeidx==$('.fadebanner li').size()){
            fadeidx=0;
        }
    }
    var fademove=setInterval(function(){fadeinout('next')},4800);
    $('.fadebanner ul').on({
        mouseenter:function(){
            clearInterval(fademove);
        },mouseleave:function(){
            fademove=setInterval(function(){fadeinout('next')},4800);
        }
    });
    // gnb
    function web_menu(){
	    $(document).off('click','.menu nav>ul>li>a');
	    $(document).on('click','.menu nav>ul>li>a',function(){
	            $('.lnb').css('height','348px');
	            $('.menu nav>ul>li>ul').css('display','block');
	            $('.close-snb').css('display','block');
        });
        $('.close-snb').click(function(){
            $('.lnb').css('height','0');
            $('.menu nav>ul>li>ul').css('display','none');
            $('.close-snb').css('display','none');
        });
        $('.wrapper>div:not(.lnb)').click(function(){
            $('.lnb').css('height','0');
            $('.menu nav>ul>li>ul').css('display','none');
            $('.close-snb').css('display','none');
        });
    }
    function mobile_menu(){
	    $(document).off('click','.menu nav>ul>li>a');
	    $(document).on('click','.menu nav>ul>li>a',function(){
	            $(this).parent().addClass('m_on').siblings().removeClass('m_on').find('ul').css({'display':'none'})
	            $(this).siblings().slideToggle( "slow" );
        });
    }    
    //mobile_logo,lnb
    var window_width = $( window ).innerWidth();
    if(window_width<1024){
        mobile_menu();
        //모바일 lnb
        var lnb_width = $('.lnb-course .inner').width()/3;
        $('.lnb-course .inner ul li').css({'width':lnb_width});
    }else{
        web_menu();
        //lnb(width값)
        var lnb_size=$('.lnb-course .inner li').size();
        var web_lnb_width=$('.lnb-course .inner').width()/lnb_size;
        $('.lnb-course .inner li').css({'width':web_lnb_width - 2});
    }

    $( window ).resize(function() {
        var resize_width= $( window ).width();

        if(resize_width<1024){
        	mobile_menu();
            //모바일 lnb
            var lnb_width = $('.lnb-course .inner').width()/3;
            $('.lnb-course .inner ul li').css({'width':lnb_width});
        }else{
            web_menu()
            $('.gnb').css({'display':'block'});
            $('.menu').css({'display':'block','min-height':'auto','top':'none'});
            var web_lnb_width=$('.lnb-course .inner').width()/lnb_size;
            $('.lnb-course .inner li').css({'width':web_lnb_width - 2});
        }
    });

  $('.option_btn a').click(function(){
      $(this).siblings().css({'width':'auto','border-radius':'10px','padding-left':'10px'})
  });
    //lnb(컨텐츠show)
    $('.lnb-course li button').click(function(){
        var num =$(this).parent().index();
        var hide_eq =$('.hide_cont').eq(num);
        var eq_height = hide_eq.height();
        var location_position = web_lnb_width/2 *eq_height;
        var lnb_width = $('.lnb-course').width();
        //화면사이즈에 따른 보이는 높이값 설정
        if(lnb_width >1023){
            //pc
            if($(this).hasClass('on') && $('.hide_cont').eq(num).hasClass('on')){
                $(this).removeClass('on');
                $('.lnb-course').animate({height:'200px'},function(){
                    $(this).css({'border-bottom':'0'});
                    $('.hide_cont').removeClass('on');
                });
            }else{
                $(this).addClass('on').parent().siblings().find('button').removeClass('on');
                $(this).siblings().css({'display':'block'}).parent().siblings().find('.location').css({'display':'none'});
                $('.hide_cont').eq(num).addClass('on').siblings().removeClass('on');
                $('.lnb-course').animate({height:200+eq_height+80}).css({'border-bottom':'1px solid'});
            }
        }else if (lnb_width <1024) {
            //tablet
            if($(this).hasClass('on') && $('.hide_cont').eq(num).hasClass('on')){
                $(this).removeClass('on');
                $('.lnb-course').animate({height:'148px'},function(){
                    $(this).css({'border-bottom':'0'});
                    $('.hide_cont').removeClass('on');
                });
            }else{
                $(this).addClass('on').parent().siblings().find('button').removeClass('on');
                $(this).siblings().css({'display':'block'}).parent().siblings().find('.location').css({'display':'none'});
                $('.hide_cont').eq(num).addClass('on').siblings().removeClass('on');
                $('.lnb-course').animate({height:148+eq_height+80})
            }
        }
        var box1height=$('.hide_cont').eq(num).find('.box1').height();
        var box2height=$('.hide_cont').eq(num).find('.box2').height();
        if(box1height>box2height || box1height==box2height){
            $('.hide_cont').eq(num).find('.box1').css({'border-right':'1px solid #CCCCCC'});
        }else if(box1height<box2height){
            $('.hide_cont').eq(num).find('.box2').css({'border-left':'1px solid #CCCCCC'});
        }
    });

    // main > 전화번호
    $('.tel dl dt').click(function() {
        $('.tel dl dd').toggleClass('on');
    });
    //main notice
    var noticeidx=0;
    function main_notice(){
        $('.notice .rolling li').eq(noticeidx).animate({top:'-100%'}).removeClass('on').next().css({'top':'100%'}).addClass('on').animate({top:0});
            noticeidx++;
        if(noticeidx==$('.notice .rolling li').size()){
            noticeidx=0;
            $('.notice .rolling li').eq(noticeidx).css('top','100%').addClass('on').animate({top:0});
        }
    };
    var m_notice = setInterval(function(){main_notice('next');},3000);
    $('.notice .rolling li').hover(function(){
        clearInterval(m_notice);
    },function(){
        m_notice = setInterval(function(){main_notice('next');},3000);
    });
  //과정상세 탭
    var fix_height = null;

    function startScroll(){
    	$(window).scroll(function () {

    		var height = $(document).scrollTop();
    		if(fix_height < height ){
    	            $('.fixwrap .sm-rect-btns-wrapper').addClass('on');
    	            $('.fixwrap').css({'padding-top':'50px'});
    	        }else {
    	            $('.fixwrap .sm-rect-btns-wrapper').removeClass('on')
    	            $('.fixwrap').css({'padding-top':'0'});
    	        }

    	});
    }
    if($('.fixwrap').length != 0){
	    fix_height = $('.fixwrap').offset().top;
	    startScroll();
    }
  //modal object
    var modal_width = - $('.modalPopup').width()/2;
    var modal_height = - $('.modalPopup').height()/2;
    var modalPopup = {
        currentScroll : 0,
        blindNone : false,
        lockscroll : function(){
            $(window).scrollTop(modalPopup.currentScroll);
        },
        makeBlind : function(Yn){
            if(!Yn){
                $('body').append('<div class="modalBlind"></div>');
            }else{
                $('body').append('<div class="modalBlind_trans"></div>');
            }
        },
        closeFn : function(){
            $('.modalBlind').remove();
            $('.modalBlind_trans').remove();
            $('.modalPopup').removeClass('showOn');
            modalPopup.blindNone = false;
            if(fix_height){
        	    startScroll();
            }
        },
        btnFn : function(target){
            if(target){
                if(target == '.modalPopup'){
                    modal_width = - $("#"+target.attr('modallink')+".modalPopup").width()/2;
                    modal_height = - $("#"+target.attr('modallink')+".modalPopup").height()/2;
                    $('body').find(target).addClass('showOn').css({'margin-left': modal_width,'margin-top':modal_height});
                }
                else if(target.attr("modallink").length != 0 ){
                    var addr = target.attr("modallink");
                    var idx = target.attr("class").indexOf('blindNone');
                    modal_width = - $("#"+addr+".modalPopup").width()/2;
                    modal_height = - $("#"+addr+".modalPopup").height()/2;

                    if(idx != -1) modalPopup.blindNone = true;
                    if(addr) $('#'+addr).addClass('showOn').css({'margin-left': modal_width,'margin-top':modal_height});
                }
            }else{
                $('body').append('<div class="onlinePay"</div>')
                $('.onlinePay').load('ajax/onlinePay.html .modalPopup',function(){
                    $('body').find('.modalPopup').addClass('showOn');
                    $('.modalPopup').css({'margin-left': modal_width,'margin-top':modal_height});
                });
            }
            this.makeBlind(this.blindNone);
            return false;
          }
    };

    var modalPopup2 = {
        currentScroll : 0,
        makeBlind : function(){
            $('body').append('<div class="modalBlind2"></div>');
        },
        closeFn : function(){
            $('.modalBlind2').remove();
            $('.modalPopup2').removeClass('showOn');
        },
        btnFn : function(target){
            this.makeBlind();
            modal_width = - $("#"+target.attr('modallink')+".modalPopup2").width()/2;
            $('body').find("#"+target.attr('modallink')).addClass('showOn').css({'margin-left': modal_width,'top':this.currentScroll+'px'});
        }
    };
    $('body').on("click",".modallink2",function(){
        modalPopup2.currentScroll = $(window).scrollTop();
        modalPopup2.btnFn($(this));
        return false;
    });
    $('body').on("click", ".modalBlind2",  function(){
        modalPopup2.closeFn();
    });
    $('body').on("click",".modal2-closeBtn", function(){
        modalPopup2.closeFn();
        return false;
    });

    if(!isIE8){
        //video control
        function videoPlay(target){
            if(target){
                document.getElementById(target).play();
            }else{
                $('video').each(function(i,e){
                    document.getElementById($(e).attr('id')).play();
                });
            }
        }
        function videoStop(){
            $('video').each(function(i,e){
                document.getElementById($(e).attr('id')).pause();
            });
        }
        function videoRePlay(target){
            if(target){
                document.getElementById(target).currentTime = 0;
                document.getElementById(target).play();
            }else{
                $('video').each(function(i,e){
                    document.getElementById($(e).attr('id')).currentTime = 0;
                    document.getElementById($(e).attr('id')).play();
                });
            }
        }
        videoStop();
        var mainVideo = document.getElementById('my-video');
        if(mainVideo) mainVideo.play();
        $('body').on("click",".modallink",function(){
            modalPopup.btnFn($(this));
            modalPopup.currentScroll=$(window).scrollTop();
            $('#'+$(this).attr('modallink')+' .modal-body').on({
                'mouseenter' : function(){
                    $('html, body').off('scroll touchmove mousewheel');
                    $(window).bind('scroll',modalPopup.lockscroll);
                },
                'mouseleave' : function(){
                    $(window).unbind('scroll');
                    $('html, body').on('scroll touchmove mousewheel',function(e){
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            });

            if(mainVideo){
                if($(this).attr('class').indexOf('vbtn1') != -1) videoRePlay('modal_video1');
                if($(this).attr('class').indexOf('vbtn2') != -1) videoRePlay('modal_video2');
                mainVideo.pause();
            }else{
                if($('#'+$(this).attr('modallink')).find('video').length != 0){
                    var temp = $('#'+$(this).attr('modallink')).find('video').attr('id');
                    videoRePlay(temp);
                }
            }

            return false;
        });
        $('body').on("click", ".modalBlind",  function(){
            $('html, body').off('scroll touchmove mousewheel');
            modalPopup.closeFn();
            if(mainVideo){
                videoStop();
                mainVideo.play();
            }else{
                videoStop();
            }
        });
        //modal click, close event
        $('body').on("click", ".modalBlind_trans",  function(){
            $('html, body').off('scroll touchmove mousewheel');
            $('.modalBlind_trans').remove();
            $('#msg_modal').remove();
            if(mainVideo){
                videoStop();
                mainVideo.play();
            }else{
                videoStop();
            }
        });
        $('body').on("click",".modal-closeBtn", function(e){
            $('.modal-body').off('mouseenter');
            $('.modal-body').off('mouseleave');
            $('html, body').off('scroll touchmove mousewheel');
            $(window).unbind('scroll');
            modalPopup.closeFn();
            if(mainVideo){
                videoStop();
                mainVideo.play();
            }else{
                videoStop();
            }
            return false;
        });
    }else if(isIE8){
        $('body').on("click",".modallink",function(){
            modalPopup.btnFn($(this));
            modalPopup.currentScroll=$(window).scrollTop();
            $('.modal-body').on({
                'mouseenter' : function(){
                    $('html, body').off('scroll touchmove mousewheel');
                    $(window).bind('scroll',modalPopup.lockscroll);
                },
                'mouseleave' : function(){
                    $(window).unbind('scroll');
                    $('html, body').on('scroll touchmove mousewheel',function(e){
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            });
            return false;
        });
        $('body').on("click", ".modalBlind",  function(){
            $('html, body').off('scroll touchmove mousewheel');
            modalPopup.closeFn();
        });
        //modal click, close event
        $('body').on("click", ".modalBlind_trans",  function(){
            $('html, body').off('scroll touchmove mousewheel');
            $('.modalBlind_trans').remove();
            $('#msg_modal').remove();
        });
        $('body').on("click",".modal-closeBtn", function(e){
            $('.modal-body').off('mouseenter');
            $('.modal-body').off('mouseleave');
            $('html, body').off('scroll touchmove mousewheel');
            $(window).unbind('scroll');
            modalPopup.closeFn();
            return false;
        });
    }

    $('body').on("click",".alert-closeBtn", function(){
        $('html, body').off('scroll touchmove mousewheel');
        $('#msg_modal').remove();
        $('.modalBlind_trans').remove();
    });

    //tab-campus auto width calculator
    function fixTabWidth(target){
        this.tabObject = target;
        this.wide = this.tabObject.innerWidth();
    };
    fixTabWidth.prototype.divide = function(wide,tabObject){
        if(wide > 1024) wide = 1024;
        for(i=0;i<tabObject.length;i++){
            var num = tabObject.eq(i).find('li').length;
            tabObject.eq(i).find('li').css('width',(wide - 1) / num);
        }
    };
    function tabCampusWidth(){
        var obj = new fixTabWidth($('.tab.tab-campus'));
        obj.prototype = fixTabWidth.prototype;
        obj.divide(obj.wide,obj.tabObject);
    };
    tabCampusWidth();
    //tab-customer-campus auto width calculator
    function tabCustomerCampusWidth(){
        var obj = new fixTabWidth($('.tab.tab-customer-campus'));
        obj.prototype = fixTabWidth.prototype;
        obj.divide(obj.wide,obj.tabObject);
    };
    tabCustomerCampusWidth();
    //window resize
    $(window).resize(function(){
        tabCampusWidth();
        tabCustomerCampusWidth();
    });
    //remove input_del focus
    $(".input_del").attr("tabindex", "-1");

    //input delbutton
    $('.input_del').click(function(){
        var input_id = $(this).siblings().attr('id');
        $(this).siblings().addClass(input_id);
        $('.input_fromwrap input').each(function(){
             if($(this).hasClass(input_id)) $(this).val('');
        });
    });

    //onlineCounsel btn
    $('.page1_tab ul li button').click(function(){
        $(this).parent().addClass('on').siblings().removeClass('on');
    });

    //myCourse
    $('.myCourse .modallink').mouseover(function(){
        $(this).find('span').removeClass('red').addClass('white');
    });
    $('.myCourse .modallink').mouseleave(function(){
        $(this).find('span').removeClass('white').addClass('red');
    });

    //색깔바뀌는 btn
    $('.chage_color_btn').mouseover(function(){
        $(this).find('span').removeClass('red').addClass('white');
        $(this).css({'background':'#e62e2e'});
    });
    $('.chage_color_btn').mouseleave(function(){
        $(this).find('span').removeClass('white').addClass('red');
        $(this).css({'background':'#252e33'});
    });
    //See More button
    function seeMoreBtn(targetClass,showNum){
        for(j=0;j<$(targetClass).length;j++){
            if($(targetClass).eq(j).length && j >= showNum){
                $(targetClass).eq(j).removeClass('showOn').css('display','none');
            }else if($(targetClass).eq(j).length && j < showNum){
                $(targetClass).eq(j).addClass('showOn');
            }
        }
    }
        //showNum으로 display
    if($('.btn-seemore').length){
        $('.btn-seemore').each(function(i,e){
            var showNum = $(e).attr("showNum");
            var targetClass = '.'+$(e).attr("targetClass");
            if($(targetClass).length <= showNum){
                $(this).css('display','none');
            }else{
                seeMoreBtn(targetClass,showNum);
            }
        });
    }
        //event
    $('.btn-seemore').click(function(){
        var showNum = $(this).attr("showNum");
        var plusNum = $(this).attr("plusNum");
        var targetClass = '.'+$(this).attr("targetClass");
        if(plusNum != 'all'){
            showNum = Number(showNum) + Number(plusNum);
            $(this).attr("showNum",showNum);
        }else{
            showNum = $(targetClass).length;
        }
        seeMoreBtn(targetClass,showNum);
        if(showNum >= $(targetClass).length) {
            $(this).css('display','none');
        }
    });
    $('#foot_modal3 .modal_body').load('ajax/footerFranchise.html .footerFranchise',function(){
        $('.modalPopup').css({'margin-left': modal_width,'margin-top':modal_height})
    });
    $('#foot_modal2 .modal_body').load('ajax/footerEmail.html .footerEmail',function(){
        $('.modalPopup').css({'margin-left': modal_width,'margin-top':modal_height})
    });
    $('#foot_modal1 .modal_body').load('ajax/footerCooperate.html .footerCooperate',function(){
        $('.modalPopup').css({'margin-left': modal_width,'margin-top':modal_height})
    });
    $('.footerFranchise').click(function(){
            $('body').find('#foot_modal3').addClass('showOn');
    });
    $('.footerEmail').click(function(){
            $('body').find('#foot_modal2').addClass('showOn');
    });
    $('.footerCooperate').click(function(){
            $('body').find('#foot_modal1').addClass('showOn');
    });

    //lnb hover color
    $('.lnb-course .inner li').each(function(i,e){
        var colors = ['hover-red','hover-navy','hover-grey','hover-green'];
        $(e).children('button').addClass(colors[i%4]);
    });

    //교육과정 하단 동그라미
    $('.show_box .off').click(function(){
        $(this).removeClass('off').addClass('active');
        $('.field_Wrap p').animate({'right':0});
        $('.field_Wrap').css({'height':'226px'});
        $('.show_box').css({'height':'auto'})
    });
});
function sub_quick(){

    $(window).scroll(function(){
		var wingp=$(this).scrollTop()
		$('.quick_sub').stop().animate({
			top:wingp+150
		})
		ttt=wingp
	})
}

function franchiseBtn2(target){
	target.parents('.modalPopup2').find('.modal2-closeBtn').click();
}
sub_quick()
//유효성검사
$(window).load(function(){
    $('input[type="submit"]').click(function(event){
        var valid = true;
        var target = null;
        var emailReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])/i;
        
        $(this).parents('form').find('select').each(function(i,e){
            if($(e).attr('required') == 'required' && $(e).children('option:selected').attr('disabled') == 'disabled'){
                target = $(e);
                valid = false;
            }
        });
        if(!valid){
            alert("선택사항을 입력해주세요");
            target.focus();   
            event.preventDefault();
            return false;
        }else if (!emailReg.test($("#email").val())) {
            alert('이메일을 확인해주세요');
            $('#email').val('');            
            $('#email').focus();
            event.preventDefault();
            return false;
        }else{
		$(this).parents('form').find('[required="true"], [required]').each(function(i,e){
			if($(e).val() == '' || (!$(e).is(":checked") && $(e).attr('type') == 'checkbox')){
				$(e).focus();
				alertMsg('입력사항을 확인해 주세요');
				event.preventDefault();
				return false;
			}
		});
        }
    });
    

  //이메일 입력방식 선택
  $('#email_adress').change(function(){	  
     $("#email_adress option:selected").each(function () {
          if($(this).val()== '1'){
      	 $("#email2").val('').parent('.input_wrap').css('cssText','display : inline-block !important');
               $("#email2").focus();
          }else{
               $("#email2").attr('value',$(this).val()).parent('.input_wrap').css('display','none');
          }
     });
  });
});
