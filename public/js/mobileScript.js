$(function(){
    var menu_height=$( window ).height();
    $('.menu_btn').click(function(){
        $('.menu').css({'display':'block','min-height':menu_height}).animate({right:'0'},300,function(){
            $(this).addClass('on').parents().find('.lnb').siblings().css({'display':'none'});
        });
    });

    $(document).on("click",".menu nav button",function(){
        $('.menu').animate({'right':'-100%'},300,function(){
            $(this).css({'display':'none'});
            $(this).parents().find('.lnb').siblings().css({'display':'block'});
        });

        $('.gnb').css({'display':'none'})
        $('script').css({'display':'none'})
    })

    function blind(){
		$('body').append('<div class="blind"></div>')
		$('.blind').css({'width':'100%','height':'100%','position':'fixed','left':0,'top':0,'background-color':'#000','display':'none','z-index':'15'})
		$('.blind').fadeTo(1000,0.5)
	}
    function close(){
	 	$('.blind').fadeOut(function(){
	 		$(this).remove()
	 	})
	 }
    $('.campus_btn').click(function(){
        blind();
        if( $('.campus_btn').hasClass('on')){
            //
        }else{
            $('.gnb').prepend('<div class="gnb_close"><button>닫기버튼</button></div>');
        }
        $('.gnb_wrap').css({'display':'block'}).animate({right:0},500)
        $('.gnb').css({'display':'block'}).animate({right:0},500)
        $(this).addClass('on');
    })
    // $('.gnb_wrap').scroll(function(){
    //     var gnb_scroll = $('.gnb_wrap').scrollTop()
    //     if(gnb_scroll == 0){
    //         console.log('aa')
    //     }
    // })


    $(document).on("click",".gnb button",function(){
        $('.gnb_wrap').css({'display':'block'}).animate({right:'-100%'},500)
        $('.gnb').animate({'right':'-100%'},500,function(){
            $(this).css({'display':'none'})
        });
        close()
    })

    //lnb_banner
    var count = 0
    var linb_li_size= $('.lnb-course .inner li').size()-6
    $('.lnb_btn_right').click(function(){
        count++
        var lnb_li_width = $('.lnb-course .inner li').width()*3*count;
        $('.lnb-course .inner ul').animate({left:- lnb_li_width})
        if(count>linb_li_size){
            $('.lnb-course .inner ul').stop();
            count=linb_li_size
        }
    })
    $('.lnb_btn_left').click(function(){
        count--
        var lnb_li_width = $('.lnb-course .inner li').width()*3*count;
        $('.lnb-course .inner ul').animate({left:- lnb_li_width})
        if(count==-1){
            $('.lnb-course .inner ul').stop()
            count = 0
        }
    })

    //sm-rect-btns 모바일
    $('.sm-rect-btns-wrapper .more').click(function(){
        $('.sm-rect-btns-wrapper').css({'overflow':'initial'})
    })


})
