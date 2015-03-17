/* ==========================================================
 * Kissium 1.0
 * http://www.kissium.com
 * ==========================================================
 * Copyright 2015 MangoLight / http://www.mangolight.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
;(function($){

    "use strict";

    $(function(){

        $(document).ready(function(){
            
            /* ----- SMOOTH SCROLL ----- */
            $.fn.miniSmoothScroll();
            /* --------------- */
            
            /* ----- TOUCH RIPPLE ----- */
            $.fn.miniTouchRipple();
            /* --------------- */
            
            /* ----- TABS ----- */
            $('.tabs').miniTabs();
            /* --------------- */
            
            /* ----- ACCORDION ----- */
            $('.accordion').miniAccordion();
            /* --------------- */
            
            /* ----- NAV ----- */
            $('.nav').miniNav();
            /* --------------- */
            
            /* ----- DROPDOWNS ----- */
            $('[data-dropdown]').miniDropdown();
            /* --------------- */
            
            /* ----- CAROUSEL ----- */
            $('.carousel').miniCarousel();
            /* --------------- */
            
            /* ----- TO TOP ----- */
            $('.to-top').miniToTop();
            /* --------------- */
            
            /* ----- MODAL ----- */
            $('[data-modal]').miniModal();
            /* --------------- */
            
            /* ----- TOOLTIPS ----- */
            $('[data-tooltip]').miniTooltip();
            /* --------------- */
            
            /* ----- MOBILE MENU ----- */
            $('body').miniMobileMenu();
            /* --------------- */
            
            /* ----- DATE PICKER ----- */
            $('.date-picker').miniDatePicker();
            /* --------------- */
            
            /* ----- LIGHTBOX ----- */
            $('body').miniLightbox();
            /* --------------- */
        });

    });

})(jQuery);


/*
* MiniTouchRipple
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniTouchRipple = function(){
        $('body').on('touchstart mousedown',function(e){
            $('<div>').addClass('miniTouchRipple').appendTo('body').css({'top':e.pageY-$(document).scrollTop(),'left':e.pageX}).fadeOut('fast',function(){
                $(this).remove();
            });
        });
    }
})(jQuery);


/*
* MiniSmoothScroll
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniSmoothScroll = function(){
        
        $('body').on('click','a[href^="#"]',function(e){
            e.preventDefault();
            $.fn.scrollTo($($(this).attr('href')));
            document.location.hash = $(this).attr('href');
        });
    }
    
    $.fn.scrollTo = function(e){
        if(!e.length) return;
        var offset = parseInt(e.css('padding-top'))+parseInt($('body').css('padding-top'))+15;
        $('html,body').stop().animate({'scrollTop':e.offset().top-offset},'fast');
    }
})(jQuery);


/*
* MiniModal
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniModal = function(options){
        
        var settings = $.extend({
            background: true // display background
        }, options);
        
        return this.not('.miniModal').each(function(){
            $(this).addClass('miniModal');
            var link = $(this);
            var modal = link.attr('data-modal');
            if(modal.indexOf('#')==0 || modal.indexOf('.')==0){
                modal = $(modal);
                if(modal.length>0){
                    prepareModal(modal);
                    link.click(function(){
                        modal.trigger('open');
                        return false;
                    });
                    modal.bind('close',function(){ closeModal(modal); });
                    modal.find('.close').click(function(){ closeModal(modal); });
                }
            }else{
                link.click(function(){
                    $('body').addClass('wait');
                    setTimeout(function(){
                        $.ajax({
                            url:link.attr('href'),
                            success:function(data){
                                var modal = $('<div>').addClass('modal ajax');
                                if(link.attr('data-title')!='') $('<div>').addClass('modal-title').html('<h5>'+(link.attr('data-title')?link.attr('data-title'):'&nbsp;')+'</h5> <div class="close"><i class="i-remove"></i></div>').appendTo(modal);
                                $('<div>').addClass('modal-content').html(data).appendTo(modal);
                                prepareModal(modal);
                                modal.trigger('open');
                                modal.bind('close',function(){ closeModal(modal); });
                                modal.find('.close').click(function(){ closeModal(modal); });
                            },
                            complete:function(){
                                $('body').removeClass('wait');
                            }
                        });
                    },1000);
                    return false;
                });
            }
        });
        
        function prepareModal(modal){
            var modal_bg = $('<div>').addClass('modal-bg');
            modal.appendTo(modal_bg);
            modal.bind('open',function(){
                var scrollTop = $(document).scrollTop();
                $(window).bind('scroll',{'scrollTop':scrollTop},$.fn.noscroll);
                modal_bg.appendTo('body').addClass('open');
                setTimeout(function(){
                    modal.addClass('open');
                    $(window).trigger('resize');
                },100);
            });
            $('body').keyup(function(e){
                if(e.keyCode==27 && modal.is($('.modal.open').last())){
                    closeModal(modal);
                }
            });
        }
        
        function closeModal(modal){
            modal.removeClass('open');
            modal.parent().removeClass('open');
            setTimeout(function(){
                if(modal.hasClass('ajax')) modal.parent().remove();
                if(!$('.modal-bg.open').length) $(window).unbind('scroll',$.fn.noscroll);
            },300);
        }
    }
    
    $.fn.noscroll = function(e){
        $('html,body').scrollTop(e.data.scrollTop);
    }
})(jQuery);


/*
* MiniCarousel
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniCarousel = function(options){
        
        return this.each(function(){
            
            var slider = $(this);
            var mode = (slider.attr('data-mode')?slider.attr('data-mode'):'slide');
            var arrows = (slider.attr('data-arrows')=='false'?false:true);
            var indicators = (slider.attr('data-indicators')=='false'?false:true);
            var auto = (slider.attr('data-auto')=='false'?false:true);
            var delay = (slider.attr('data-delay')?parseInt(delay):5000);
            var stoponhover = (slider.attr('data-stoponhover')=='false'?false:true);
            var settings = $.extend({
                mode: mode, // mode: 'slide' or 'fade'
                arrows: arrows, // display arrows
                indicators: indicators, // display indicators
                auto: auto, // slide automatically
                delay: delay, // automatic slide delay
                stoponhover: stoponhover // stop carousel when mouse is hover
            }, options);
            var slider_ul = $(this).children('ul').eq(0);
            var slider_li = slider_ul.children('li').show();
            slider_ul.attr('style','width:999999px;max-width:999999px;').attr('data-current-slide',0);
            if(settings.mode=='fade'){
                slider_li.css({'position':'absolute','opacity':0}).eq(0).css({'opacity':1,'position':'relative'});
            }
            adaptSize(slider_li,slider);
            var timer;
            
            if(settings.arrows){
                var left_btn = $('<div>').html('<i class="i-chevron-left"></i>').addClass('carousel-control left').appendTo(slider).click(function(){ slider.trigger('slidePrev'); });
                var right_btn = $('<div>').html('<i class="i-chevron-right"></i>').addClass('carousel-control right').appendTo(slider).click(function(){ slider.trigger('slideNext'); });
            }
            if(settings.indicators){
                var indicators = $('<div>').addClass('carousel-indicators').appendTo(slider);
                for(var i=0;i<slider_li.length;i++){
                    var indicator = $('<div>').click(function(){ slider.trigger('slideTo',$(this).attr('data-slide')); }).appendTo(indicators).attr('data-slide',i);
                }
                updateIndicators(slider,0);
            }
            if(settings.auto){
                timer = window.setInterval(function(){ if(!slider.hasClass('hover')){slider.trigger('slideNext');} },settings.delay);
                if(settings.stoponhover){
                    slider.hover(function(){
                        slider.addClass('hover');
                        clearInterval(timer);
                    },function(){
                        slider.removeClass('hover');
                        timer = window.setInterval(function(){ if(!slider.hasClass('hover')){slider.trigger('slideNext');} },settings.delay);
                    });
                }
            }
            
            slider.miniSwipe({
                left: function(){
                    slider.trigger('slideNext').trigger('stop');
                },
                right: function(){
                    slider.trigger('slidePrev').trigger('stop');
                },
                up: function(){
                    $('html,body').animate({'scrollTop':$(document).scrollTop()+400});
                },
                down: function(){
                    $('html,body').animate({'scrollTop':$(document).scrollTop()-400});
                }
            });
            
            $(window).resize(function(){
                adaptSize(slider_li,slider);
                slider_ul.css({'margin-left':0});
                if(settings.indicators && settings.mode=='slide'){
                    slider_ul.attr('data-current-slide',0);
                    updateIndicators(slider,0);
                }
            });
            
            slider.bind('stop',function(){
                clearInterval(timer);
            });
            
            //Use: $('.carousel').trigger('slideTo',2);
            slider.bind('slideTo',function(e,slide){
                if(slider_ul.children('li').eq(slide).length>0 && slide>=0){
                    slider_ul.attr('data-current-slide',slide);
                    if(settings.indicators) updateIndicators(slider,slide);
                    if(settings.mode=='slide'){
                        slider_ul.css({'margin-left':slide*-1*slider.width()});
                    }
                    if(settings.mode=='fade'){
                        slider_li.css({'opacity':0}).eq(slide).css({'opacity':1});
                    }
                }
            });
            
            //Use: $('.carousel').trigger('slidePrev');
            slider.bind('slidePrev',function(){
                var slide = parseInt(slider_ul.attr('data-current-slide'));
                var nb_slide = slider_ul.children('li').length;
                if(slide===0) slide = nb_slide-1; else slide--;
                slider.trigger('slideTo',slide);
            });
            
            //Use: $('.carousel').trigger('slideNext');
            slider.bind('slideNext',function(){
                var slide = parseInt(slider_ul.attr('data-current-slide'));
                var nb_slide = slider_ul.children('li').length;
                if(slide==nb_slide-1) slide=0; else slide++;
                slider.trigger('slideTo',slide);
            });
            
        });
        
        function updateIndicators(slider,slide){
            slider.find('.carousel-indicators div').removeClass('active');
            slider.find('.carousel-indicators div').eq(slide).addClass('active');
        }
        
        function adaptSize(slider_li,slider){
            slider_li.each(function(){
                $(this).css({'width':slider.width()});
            });
        }
    }
})(jQuery);


/*
* MiniToTop
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniToTop = function(){
        return this.each(function(){
            var btn = $(this);
            btn.html('<i class="i-chevron-up"></i>').show().css({'bottom':-50}).click(function(){
                $('html,body').stop().animate({'scrollTop':0},300);
            });
            setInterval(function(){
                refreshBtn(btn);
            },1000);
            $(window).resize(function(){
                refreshBtn(btn);
            });
        });
        
        function refreshBtn(btn){
            if($(document).scrollTop()>$(window).height()*1.5){
                btn.stop().css({'bottom':20});
            }else{
                btn.stop().css({'bottom':-50});
            }
        }
    }
})(jQuery);


/*
* MiniTabs
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniTabs = function(){
        
        return this.each(function(){
            var tabs = $(this).show();
            var tabs_content = tabs.next('.tabs-content');
            tabs_content.children('div').hide().each(function(){
                $(this).attr('data-tab','#'+$(this).attr('id'));
                $(this).attr('id','');
            });
            var content = tabs_content.find('[data-tab="'+tabs.find('li.active a').eq(0).attr('href')+'"]');
            if(content.length) content.show();
            $(window).trigger('resize');
            
            tabs.find('li a').click(function(e){
                if($(this).parent().hasClass('active')) return false;
                e.preventDefault();
                tabs.find('li.active').removeClass('active').each(function(){
                    var content = $('[data-tab="'+$(this).children('a').attr('href')+'"]');
                    if(content.length) content.hide();
                });
                var content = $('[data-tab="'+$(this).attr('href')+'"]');
                if(content.length){
                    $(this).parent().addClass('active');
                    content.css({'opacity':0}).show();
                    $(window).trigger('resize');
                    content.animate({'opacity':1});
                }
            });
            var hash_element = tabs.find('li a[href="'+document.location.hash+'"]');
            if(hash_element.length) hash_element.click();
            setTimeout(function(){$.fn.scrollTo(hash_element)},1);
        });
    }
})(jQuery);

/*
* MiniAccordion
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniAccordion = function(options){
        
        return this.each(function(){
            
            var accordion = $(this);
            var settings = $.extend({
                mode: accordion.attr('data-mode') // 'accordion' | 'toggle'
            }, options);
            accordion.children('li').not('.active').children('div').hide();
            $(window).trigger('resize');
            accordion.children('li').children('a').click(function(e){
                if(settings.mode!='toggle'){
                    if($(this).parent().hasClass('active')) return false;
                    accordion.children('li.active').removeClass('active').children('div').not($(this).parent().children('div')).slideUp();
                    $(this).parent().addClass('active').children('div').slideDown(function(){
                        $(window).trigger('resize');
                    });
                }else{
                    $(this).parent().toggleClass('active').children('div').stop().slideToggle(function(){
                        $(window).trigger('resize');
                    });
                }
            });
            var hash_element = accordion.children('li').children('a[href="'+document.location.hash+'"]');
            if(hash_element.length) hash_element.click();
            setTimeout(function(){$.fn.scrollTo(hash_element);},1);
        });
    }
})(jQuery);


/*
* MiniNav
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniNav = function(options){
        
        return this.each(function(){
            
            var obj = $(this);
            var offset_top;
            if($(this).attr('data-offset-top')){
                offset_top = parseInt($(this).attr('data-offset-top'));
            }else{
                offset_top = parseInt($('body').css('padding-top'));
            }
            var fixed_end;
            if(obj.attr('data-fixed-end') && $(obj.attr('data-fixed-end')).length){
                fixed_end = $(obj.attr('data-fixed-end'));
            }else{
                fixed_end = obj.parents('.row').last();
            }
            
            var settings = $.extend({
                offset_top: offset_top, // space between top and nav during scroll
                fixed_end: fixed_end // object after which the fixed position stops
            }, options);
            
            $(window).scroll(function(){
                positionNav(obj,settings.offset_top,settings.fixed_end);
                updateNav(obj);
            });
            $(window).resize(function(){
                positionNav(obj,settings.offset_top,settings.fixed_end);
                updateNav(obj);
            });
            positionNav(obj,settings.offset_top,settings.fixed_end);
        });
            
        // Update the active link depending of the scroll position
        function updateNav(obj){
            var last = null;
            obj.find('li a').each(function(){
                try{
                    if($($(this).attr('href')).offset().top<=($(document).scrollTop()+100)){
                        last = $(this);
                    }
                }catch(e){}
            });
            if(!last) last=obj.find('li a').eq(0);
            obj.find('li.active').removeClass('active');
            last.parent().addClass('active');
        }
        
        function positionNav(obj,offset_top,fixed_end){
            obj.css({'position':'static','top':'auto','width':'auto','height':'auto'}).removeClass('fixed-done');
            if($(window).width()>=665){
                obj.attr('data-top',obj.offset().top-parseInt(obj.css('margin-top'))).css({'position':'fixed','top':obj.offset().top,'width':obj.width(),'height':obj.height()}).addClass('fixed-done');
                if($(document).scrollTop()<parseInt(obj.attr('data-top'))-offset_top){
                    obj.css({'top':parseInt(obj.attr('data-top'))-$(document).scrollTop()});
                }else{
                    var end = 9999;
                    try{
                        end = fixed_end.offset().top+fixed_end.height();
                    }catch(e){}
                    if($(document).scrollTop()+obj.height()+offset_top+parseInt(obj.css('margin-top'))+parseInt(obj.css('margin-bottom'))>end){
                        obj.css({'top':end-$(document).scrollTop()-obj.height()-parseInt(obj.css('margin-top'))-parseInt(obj.css('margin-bottom'))});
                    }else{
                        obj.css({'top':offset_top});
                    }
                }
            }
        }
    }
})(jQuery);


/*
* MiniDropdown
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniDropdown = function(options){
        
        return this.each(function(){
            
            var obj = $(this);
            var scroll = (obj.is('select')?true:(obj.attr('data-scroll')=="true"?true:false));
            var arrows = (obj.is('.btn')?false:!scroll);
            var columns = (obj.attr('data-columns')?parseInt(obj.attr('data-columns')):1);
            var width = (obj.attr('data-width')?parseInt(obj.attr('data-width')):(obj.is('.btn')?'parent':180));
            var settings = $.extend({
                onSelect: function(){}, // When selecting an element, returns the element selected (only for select dropdowns)
                onOpen: function(){}, // When opens a dropdown, returns the dropdown
                onClose: function(){}, // When close a dropdown, returns the dropdown
                width: width, // Width of the dropdown (null:'auto' | 'parent' | 600)
                scroll: scroll, // Display a scrollbar on the item list
                arrows: arrows, // Display arrows
                columns: columns // Number of columns in dropdown list
            }, options);
            
            if(obj.is('select')){
                
                var id = (new Date()).getTime()+parseInt(Math.random(99999999)*999999999);
                var dropdown = $('<ul>').addClass('dropdown').insertAfter('body').attr('id','dropdown_'+id);
                $(this).find('option').each(function(){
                    var li = $('<li>');
                    var a = $('<a>').attr('href','#').attr('data-value',$(this).val()).text($(this).text()).attr('style','border-radius:0;').appendTo(li);
                    if(obj.val()==$(this).val()) li.addClass('active');
                    dropdown.append(li);
                });
                var width = dropdown.width()+30;
                if(settings.columns>1) dropdown.addClass('large');
                var div = $('<div>').addClass('select').text(obj.find('option[value="'+obj.val()+'"]').text()).insertAfter($(this)).attr('data-dropdown','#dropdown_'+id).css({'width':width});
                dropdown.find('li').css({'width':(100/settings.columns)+'%'});
                div.miniDropdown({
                    onSelect:function(o){
                        obj.val($(o).attr('data-value'));
                        obj.change(); // trigger change event
                        $(o).parent().parent().find('.active').removeClass('active');
                        $(o).parent().addClass('active');
                    },
                    onOpen:settings.onOpen,
                    onClose:settings.onClose,
                    width:'parent',
                    scroll:settings.scroll,
                    arrows: false,
                    columns:settings.columns
                });
                obj.hide();
                dropdown.insertAfter(obj);
                obj.change(function(){
                    div.text(obj.find('option:selected').text());
                });
                
            }else{
                
                var dropdown = $(obj.attr('data-dropdown'));
                if(!dropdown.length) return;
                var event;
                if(obj.is('input')) event = 'focus';
                else event = 'click';
                
                obj.on(event,function(e){
                    if(!obj.hasClass('dropdown-open')){
                        $('.dropdown-open').each(function(){
                            closeDropdown($(this),settings.onClose);
                        });
                        var o_width=obj.width()+parseInt(obj.css('padding-left'))+parseInt(obj.css('padding-right'));
                        var d_width=settings.width;
                        if(d_width=='parent'){
                            d_width=o_width;
                        }else if(d_width=='auto'){
                            d_width=dropdown.width();
                        }
                        d_width*=settings.columns;
                        var o_top = obj.offset().top+obj.height()+parseInt(obj.css('padding-top'))+parseInt(obj.css('padding-bottom'));
                        var o_left = obj.offset().left+(o_width-d_width)/2;
                        if(settings.arrows) o_top+=10;;
                        dropdown.css({'top':o_top,'left':o_left,'width':d_width});
                        if(settings.scroll){
                            dropdown.css({'max-height':200,'overflow-y':'scroll','overflow-x':'hidden','width':dropdown.width()}).addClass('scroll');
                        }
                        if(settings.columns>1) dropdown.addClass('large');
                        dropdown.find('li').css({'width':(100/settings.columns)+'%'});
                        if((dropdown.height()+o_top)<($(document).scrollTop()+$(window).height())){
                            if(settings.arrows) dropdown.removeClass('arrow-bottom').addClass('arrow-top');
                        }else{
                            o_top = obj.offset().top-dropdown.height();
                            if(settings.arrows) o_top-=10;
                            dropdown.css({'top':o_top});
                            if(settings.arrows) dropdown.removeClass('arrow-top').addClass('arrow-bottom');
                        }
                        dropdown.addClass('open');
                        obj.addClass('dropdown-open');
                        settings.onOpen.call(obj,dropdown);
                        $(window).resize(function(){
                            if(obj.hasClass('dropdown-open')){
                                closeDropdown(obj,settings.onClose);
                            }
                        });
                    }else{
                        closeDropdown(obj,settings.onClose);
                    }
                    return false;
                });
                
                dropdown.find('a').click(function(){
                    settings.onSelect.call(obj,$(this));
                    closeDropdown(obj,settings.onClose);
                    if($(this).attr('href')=='#') return false;
                });
            }
            
            obj.focusout(function(e){
                closeDropdown(obj,settings.onClose);
            });
        });
        
        function closeDropdown(obj,callback){
            var dropdown = $(obj.attr('data-dropdown'));
            dropdown.removeClass('open');
            obj.removeClass('dropdown-open');
            callback.call(obj,dropdown);
        }
    }
})(jQuery);


/*
* miniTooltip
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniTooltip = function(options){
        
        return this.each(function(){
            
            var link = $(this);
            var settings = $.extend({
                style: link.attr('data-tooltip-class'), // Style of the dropdown (null:'auto' | 'info' | 'error' | 'warning' | 'success')
                permanent: link.attr('data-tooltip-permanent')=='true', // Always shown
                content: link.attr('data-tooltip') , // HTML content of the tooltip
                position: link.attr('data-tooltip-position') // Position (null:'top' | 'right' | 'bottom' | 'left')
            }, options);
            
            var tooltip = $('<div>').addClass('minitooltip').appendTo('body').addClass(settings.style).html(settings.content);
            
            positionTooltip();
            $(window).resize(function(){ positionTooltip(); });
            $(document).change(function(){ positionTooltip(); });
            if(settings.permanent){
                tooltip.addClass('open');
            }else{
                link.hover(function(){
                    positionTooltip();
                    tooltip.addClass('open');
                },function(){
                    tooltip.removeClass('open');
                });
            }
            
            function positionTooltip(){
                var top=0,left=0;
                if(settings.position=='left' || settings.position=='right'){
                    top = link.offset().top + getHeight(link)/2 - getHeight(tooltip)/2 - parseInt(tooltip.css('margin-top'));
                    if(settings.position=='left'){
                        left = link.offset().left - getWidth(tooltip) - 10;
                    }else{
                        left = link.offset().left + getWidth(link) + 10;
                    }
                }else{
                    left = link.offset().left + getWidth(link)/2 - getWidth(tooltip)/2;
                    if(settings.position=='bottom'){
                        top = link.offset().top + getHeight(link) - parseInt(tooltip.css('margin-top')) + 10;
                    }else{
                        top = link.offset().top - (tooltip.height()+parseInt(tooltip.css('padding-top'))+parseInt(tooltip.css('padding-bottom'))) - parseInt(tooltip.css('margin-top')) - 10;
                        settings.position = 'top';
                    }
                }
                tooltip.addClass('minitooltip-'+settings.position);
                $('<div>').addClass('minitooltip-arrow-'+settings.position).css('border-'+settings.position+'-color',tooltip.css('background-color')).appendTo(tooltip);
                tooltip.css({'top':top,'left':left});
            }

            function getHeight(o){
                return o.height()+parseInt(o.css('padding-top'))+parseInt(o.css('padding-bottom'));
            }

            function getWidth(o){
                return o.width()+parseInt(o.css('padding-left'))+parseInt(o.css('padding-right'));
            }
            
            link.bind('removeTooltip',function(){
                tooltip.removeClass('open');
                setTimeout(function(){
                    tooltip.remove();
                },300);
            });
        });
    }
})(jQuery);


/*
* MiniMobileMenu
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniMobileMenu = function(options){

        return this.each(function(){
            
            if($(this).find('.menu').length>0){
                var menu = $(this).find('.menu').first();
                var mobile_menu_btn = $('<div>').html('<i class="i-lines"></i>').addClass('minimobilemenu_btn').appendTo('body').click(function(){
                    if(menu.css('display')=='none'){
                        $('body').css({'overflow-y':'hidden'});
                        menu.css({'top':'-100%'}).show().animate({'top':0});
                        $(this).hide().html('<i class="i-remove"></i>').fadeIn();
                    }else{
                        $('body').css({'overflow-y':'scroll'});
                        menu.animate({'top':'-100%'},function(){
                            menu.hide();
                        });
                        $(this).hide().html('<i class="i-lines"></i>').fadeIn();
                    }
                });
                
                menu.find('a').click(function(){
                    if(!$(this).parent('.minimobilemenu').length) return;
                    var link = $(this).attr('href');
                    if(link!=document.location.href) $('body').fadeOut();
                    
                    menu.animate({'top':'100%'},function(){
                        if(link!=document.location.href) document.location.href = link;
                    });
                    return false;
                });
                
                adaptSize(menu,mobile_menu_btn);
                $(window).resize(function(){ adaptSize(menu,mobile_menu_btn); });
            }

            function adaptSize(menu,mobile_menu_btn){
                if($(window).width()<665){
                    menu.hide().addClass('minimobilemenu');
                    mobile_menu_btn.html('<i class="i-lines"></i>').show();
                }else{
                    menu.show().removeClass('minimobilemenu');
                    mobile_menu_btn.html('<i class="i-lines"></i>').hide();
                }
            }
        });
        
    }
})(jQuery);


/*
* MiniSwipe
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniSwipe = function(options){
        
        var settings = $.extend({
            up: function(){},
            right: function(){},
            down: function(){},
            left: function(){}
        }, options);

        return this.each(function(){
            
            var sX,sY;
            $(this).on("touchstart",function(e){
                sX = e.originalEvent.targetTouches[0].screenX;
                sY = e.originalEvent.targetTouches[0].screenY;
            });
            
            $(this).on("touchmove",function(e){
                e.preventDefault();
            });
            
            $(this).on("touchend",function(e){
                var diffX = e.originalEvent.changedTouches[0].screenX-sX;
                var diffY = e.originalEvent.changedTouches[0].screenY-sY;
                if(Math.abs(diffY)>Math.abs(diffX)){
                    if(diffY>0) settings.down.call(this);
                    else if(diffY<0) settings.up.call(this);
                }else{
                    if(diffX>0) settings.right.call(this);
                    else if(diffX<0) settings.left.call(this);
                }
            });
            
        });
        
    }
})(jQuery);


/*
* MiniDatePicker
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniDatePicker = function(options){
        
        return this.each(function(){
            
            var type = ($(this).attr('data-type')?$(this).attr('data-type'):'date');
            var language = ($(this).attr('data-language')?$(this).attr('data-language'):(navigator.language?navigator.language:'en'));
            var settings = $.extend({
                type: type, // date,time, or datetime
                language: language
            }, options);
            
            // Format detection
            var d = new Date('1987-10-22 19:20:00');
            var locale = d.toLocaleDateString(settings.language);
            var separators = ['.','/','-'];
            var date;
            for(var i=0;i<separators.length;i++){
                if(locale.indexOf(separators[i])!=-1){
                    date = locale.split(separators[i]);
                    break;
                }
            }
            if(typeof(date)!='object') date = [10,22,1987];
            
            settings.date_format = '';
            for(var i=0;i<3;i++){
                if(date[i]==1987){
                    settings.date_format += 'Y';
                }else if(date[i]==10){
                    settings.date_format += 'M';
                }else if(date[i]==22){
                    settings.date_format += 'D';
                }
            }
            
            locale = d.toLocaleTimeString(settings.language);
            if(locale.indexOf('PM')!=-1) settings.time_format = 12;
            else settings.time_format = 24;
            
            var input = $(this);
            var popup = $('<div>').addClass('minidatepicker-popup').appendTo('body');
            var timer;
            
            loadContent(settings,input,popup);
            
            input.on('focus click',function(){
                $('.minidatepicker-popup').removeClass('open');
                openPopup(settings,input,popup);
            });
            
            popup.on('mouseleave',function(){
                timer = setTimeout(function(){
                    popup.removeClass('open');
                },1000);
            });
            
            input.on('blur',function(){
                timer = setTimeout(function(){
                    popup.removeClass('open');
                },300);
            });
            
            popup.on('mousemove',function(){
                clearInterval(timer);
            });
            
            input.on('keydown',function(){
                popup.removeClass('open');
            });
            
            popup.find('span').click(function(){
                clearInterval(timer);
                $(this).parent().find('.active').removeClass('active');
                $(this).addClass('active');
                updateDate(settings,input,popup);
            });
        });
        
        function loadContent(settings,input,popup,d){
            
            if(settings.type!='time'){
                var tr = $('<tr>').appendTo($('<table>').appendTo(popup));
                for(var y=0;y<3;y++){
                    var type = settings.date_format[y].toLowerCase()
                    var td = $('<td>');
                    if(type=='d'){
                        td.addClass('days')
                        for(var i=1;i<=31;i++){
                            var t = i;
                            if(t<10) t = '0'+t;
                            if((i-1)%8==0 && i>1) td.append('<br/>');
                            td.append($('<span>').text(t));
                        }
                    }else if(type=='m'){
                        td.addClass('months');
                        for(var i=1;i<=12;i++){
                            var t = i;
                            if(t<10) t = '0'+t;
                            var date = new Date('1987-'+t+'-01');
                            try{
                                var month_name = date.toLocaleString(settings.language,{month:'long'});
                                if(month_name.indexOf(' ')!=-1) month_name = month_name.match(/[\D]+/g)[0].trim();
                                t = month_name.charAt(0).toUpperCase() + month_name.slice(1);
                                if(t.length>4) t = t.substring(0,3)+'.';
                            }catch(e){}
                            if((i-1)%3==0 && i>1) td.append('<br/>');
                            td.append($('<span>').attr('data-month',i).text(t));
                        }
                    }else if(type=='y'){
                        td.addClass('years');
                        var today = new Date();
                        for(var i=today.getFullYear()-1;i<=today.getFullYear()+1;i++){
                            td.append($('<span>').text(i));
                            td.append('<br/>');
                        }
                        td.append($('<span>').attr('contenteditable','true').keydown(function(e){
                            if((e.keyCode<48 || e.keyCode>57) && e.keyCode!=8) return false;
                            if(e.keyCode==8) return true;
                            if($(this).text().length==4) return false;
                        }).on('paste',function(){
                            return false;
                        }).keyup(function(){
                            updateDate(settings,input,popup);
                        }));
                        
                    }
                    tr.append(td);
                }
            }
            
            if(settings.type!='date'){
                var tr = $('<tr>').appendTo($('<table>').appendTo(popup));
                var hours = $('<td>').addClass('hours');
                var i,max;
                if(settings.time_format==12){
                    i = 1; max = 12;
                }else{
                    i = 0; max = 23;
                }
                for(;i<=max;i++){
                    var t = i;
                    if(t<10) t = '0'+t;
                    if((settings.time_format==24 && i%8==0 && i>0)
                    || (settings.time_format==12 && i%4==0 && i<12)){
                        hours.append('<br/>');
                    }
                    
                    if(settings.time_format==12 && i==12){
                        hours.prepend($('<span>').text(t));
                    }else{
                        hours.append($('<span>').text(t));
                    }
                }
                tr.append(hours);
                
                var minutes = $('<td>').addClass('minutes');
                for(var i=0;i<60;i+=5){
                    var t = i;
                    if(t<10) t = '0'+t;
                    if(i%4==0 && i>0) minutes.append('<br/>');
                    minutes.append($('<span>').text(t));
                }
                tr.append(minutes);
                
                if(settings.time_format==12){
                    tr.append($('<td>').addClass('part').html('<span>AM</span><span>PM</span>'));
                }
            }
        }
        
        function updateDate(settings,input,popup){
            // Check if every td has a .active
            if(popup.find('td .active').length!=popup.find('td').length) return;
            
            var date = '';
            if(settings.type!='time'){
                var day = parseInt(popup.find('.days .active').text());
                var month = popup.find('.months .active').attr('data-month');
                var year = popup.find('.years .active').text();
                if(day<10) day = '0'+day;
                if(month<10) month = '0'+month;
                if(!year) year = '0000';
                else if(year<10) year = '000'+year;
                else if(year<100) year = '00'+year;
                else if(year<1000) year = '0'+year;
                date = year+'-'+month+'-'+day;
            }
            if(settings.type=='datetime') date += ' ';
            if(settings.type!='date'){
                var hours = parseInt(popup.find('.hours .active').text());
                var minutes = parseInt(popup.find('.minutes .active').text());
                if(settings.time_format==12){
                    if(hours==12) hours = 0;
                    var part = popup.find('.part .active');
                    if(part.is(':last-child')) hours += 12;
                }
                if(hours<10) hours = '0'+hours;
                if(minutes<10) minutes = '0'+minutes;
                date += hours+':'+minutes+':00';
            }
            input.val(date);
            input.trigger('change');
        }
        
        function openPopup(settings,input,popup){
            // Set position
            var top = input.offset().top + input.height() + parseInt(input.css('padding-top')) + parseInt(input.css('padding-bottom')) + 10;
            var left = input.offset().left + input.width()/2 + parseInt(input.css('padding-left')) + parseInt(input.css('padding-right'));
            var width = popup.width();
            popup.css({'top':top,'left':left-width/2});
            if((popup.height()+top)<($(document).scrollTop()+$(window).height())){
                popup.removeClass('arrow-bottom').addClass('arrow-top');
            }else{
                top = input.offset().top - popup.height() - 10;
                popup.css({'top':top}).removeClass('arrow-top').addClass('arrow-bottom');
            }
            
            var val = input.val();
            
            // Load date
            if(settings.type!='time'){
                var d;
                try{
                    d = new Date(val);
                    var day = d.getDate();
                    if(day){
                        popup.find('.days span,.months span,.years span').removeClass('active');
                        popup.find('.days span').eq(day-1).addClass('active');
                        var month = d.getMonth();
                        popup.find('.months span').eq(month).addClass('active');
                        var year = d.getFullYear();
                        var years_span = popup.find('.years span');
                        var found = false;
                        for(var i=0;i<years_span.length;i++){
                            if(years_span.eq(i).text()==year){
                                years_span.eq(i).addClass('active');
                                found = true;
                                break;
                            }
                        }
                        if(!found) popup.find('.years span').last().text(year).addClass('active');
                    }
                }catch(e){};
            }
            
            // Load time
            if(settings.type!='date'){
                if(settings.type=='time') val = '1987-10-22 '+val;
                try{
                    d = new Date(val);
                    var minutes = d.getMinutes();
                    if(minutes!==null){
                        popup.find('.hours span,.minutes span,.parts span').removeClass('active');
                        popup.find('.minutes span').eq(Math.floor(minutes/5)).addClass('active');
                        var hours = d.getHours();
                        if(settings.time_format==12){
                            if(hours>=12){
                                hours -= 12;
                                popup.find('.part span').eq(1).addClass('active');
                            }else{
                                popup.find('.part span').eq(0).addClass('active');
                            }
                        }
                        popup.find('.hours span').eq(hours).addClass('active');
                    }
                }catch(e){};
            }
            
            
            popup.addClass('open');
        }
        
    }
})(jQuery);


/*
* MiniLightbox
* Developed by MangoLight Web Agency
* http://www.mangolight.com
* Released under the Apache License v2.0.
*/
(function($){
    $.fn.miniLightbox = function(options){
        
        return this.each(function(){
            
            $(this).on('click','a',function(e){
                var href = $(this).attr('href').toLowerCase();
                var length = href.length;
                if(!(endsWith(href,'.jpg')||endsWith(href,'.jpeg')||endsWith(href,'.png')||endsWith(href,'.gif'))) return;
                var link = $(this);
                e.preventDefault();
                
                var thumb = link.find('img').eq(0);
                var div = $('<div>').addClass('miniLightbox').css({'background-image':'url("'+thumb.attr('src')+'")','background-size':thumb.width()+'px '+thumb.height()+'px'}).html('<i class="i-repeat-alt loading"></i>');
                positionOnThumb(div,thumb);
                var img = $('<img>').appendTo(div);
                img.load(function(){
                    setBackgroundSize(div,img);
                    div.find('.loading').css({'opacity':0});
                    div.css({'background-image':'url("'+img.attr('src')+'")'});
                    $('body').css({'overflow-y':'hidden'});
                });
                setTimeout(function(){
                    loadImage(div,link);
                },500);
                $(window).resize(function(){
                    setBackgroundSize(div,img);
                });
                
                var close = $('<i class="i-remove close"></i>').appendTo(div).click(function(){
                    div.trigger('close');
                });
                if(link.attr('rel')){
                    $('a[rel="'+link.attr('rel')+'"]').each(function(){
                        div.append($('<img>').attr('src',$(this).attr('href')));
                    });
                    var prev = $('<div>').addClass('carousel-control left').html('<i class="i-chevron-left prev"></i>').appendTo(div).click(function(){
                        div.trigger('prev');
                    });
                    var next = $('<div>').addClass('carousel-control right').html('<i class="i-chevron-right next"></i>').appendTo(div).click(function(){
                        div.trigger('next');
                    });
                    updateArrows(div,link);
                }
                
                $('body').append(div).keyup(function(e){
                    if(e.keyCode==27) div.trigger('close');
                    if(e.keyCode==37) div.trigger('prev');
                    if(e.keyCode==39) div.trigger('next');
                });
                div.miniSwipe({
                    left: function(){div.trigger('next')},
                    right: function(){div.trigger('prev')},
                    up: function(){div.trigger('close')},
                    down: function(){div.trigger('close')}
                })
                
                setTimeout(function(){
                    div.addClass('open');
                },100);
                
                div.bind('close',function(){
                    positionOnThumb(div,thumb);
                    div.removeClass('open');
                    $('body').css({'overflow-y':'scroll'});
                    setTimeout(function(){
                        div.remove();
                    },300);
                });
                
                div.bind('prev',function(){
                    var prev = link.prev('a[rel="'+link.attr('rel')+'"]');
                    if(prev.length){
                        link = prev;
                        thumb = link.children('img').eq(0);
                        loadImage(div,link);
                    }
                });
                
                div.bind('next',function(){
                    var next = link.next('a[rel="'+link.attr('rel')+'"]');
                    if(next.length){
                        link = next;
                        thumb = link.children('img').eq(0);
                        loadImage(div,link);
                    }
                });
            });
        });
        
        function loadImage(div,link){
            if(link.attr('href')!=div.children('img').eq(0).attr('src')){
                div.find('.loading').css({'opacity':1});
                div.children('img').eq(0).attr('src',link.attr('href'));
            }
            updateArrows(div,link);
        }
        
        function positionOnThumb(div,thumb){
            div.css({'top':thumb.offset().top-$(document).scrollTop(),'left':thumb.offset().left-$(document).scrollLeft(),'width':thumb.width(),'height':thumb.height()});
        }
        
        function setBackgroundSize(div,img){
            if(div.height()<img.height()||div.width()<img.width()) div.css({'background-size':'contain'});
            else div.css({'background-size':'auto'});
        }
        
        function updateArrows(div,link){
            if(link.prev('a[rel="'+link.attr('rel')+'"]').length) div.children('.left').show();
            else div.children('.left').hide();
            if(link.next('a[rel="'+link.attr('rel')+'"]').length) div.children('.right').show();
            else div.children('.right').hide();
        }
        
        function endsWith(href,ext){
            return href.indexOf(ext)==href.length-ext.length && ext.length<=href.length;
        }
        
    }
})(jQuery);