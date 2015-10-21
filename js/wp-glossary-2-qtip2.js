(function($){
    var baseTouch = ( navigator.userAgent.match(/Android/i)
                     || navigator.userAgent.match(/webOS/i)
                     || navigator.userAgent.match(/iPhone/i)
                     || navigator.userAgent.match(/iPad/i)
                     || navigator.userAgent.match(/iPod/i)
                     || navigator.userAgent.match(/BlackBerry/i) ) ? 1 : 0;
    $(document).ready(function(){
        console.log($('a[data-ithoughts_tt_gl-glossary-slug]'));
        $('span[class*=ithoughts_tt_gl-tooltip]').each(function(){
            var ajaxPostData = $.extend( {action: 'ithoughts_tt_gl_get_term_details'}, $(this).data() );
            var qtipstyle    = $(this).data('qtipstyle');

            // If set to click, disable glossary link
            if( ithoughts_tt_gl.qtiptrigger == 'click' ){
                $(this).children('a').click(function(e){
                    e.preventDefault();
                });
            } else if( ithoughts_tt_gl.qtiptrigger == 'responsive' ){
                var self = $(this);
                self.touch = baseTouch;

                //Detect touch/click out
                $(document).click(function(event) { 
                    if(!$(event.target).closest(self).length) {
                        self.data("expanded", false);
                        self.triggerHandler("responsiveout");
                    }
                });

                self.children('a').click(function(e){
                    if(!self.data("expanded") && self.touch != 0){
                        self.data("expanded", true);
                        self.triggerHandler("responsive");
                        e.preventDefault();
                    }
                }).bind("touchstart", function(e){
                    self.touch = 1
                }).bind("touchend", function(e){
                    self.touch = 2;
                }).mouseover(function(e){
                    self.triggerHandler("responsive");
                }).mouseleave(function(e){
                    self.triggerHandler("responsiveout");
                }).focus(function(e){
                    self.triggerHandler("responsive");
                }).focusout(function(e){
                    self.triggerHandler("responsiveout");
                });
            }

            $(this).qtip({
                content: {
                    text: 'Loading glossary term',
                    ajax: {
                        url     : ithoughts_tt_gl.admin_ajax,
                        type    : 'POST',
                        data    : ajaxPostData,
                        dataType: 'json',
                        loading : false,
                        success : function(resp, status){
                            if( resp.success ) {
                                this.set( 'content.title', resp.data.title );
                                this.set( 'content.text',  resp.data.content );
                            } else {
                                this.set( 'content.text', 'Error' );
                            }
                        }
                    },
                    title: { text: 'Glossary Title' }
                },
                prerender: true,
                position: {
                    at      : 'bottom center', // Position the tooltip above the link
                    my      : 'top center',
                    viewport: $("body"),       // Keep the tooltip on-screen at all times
                    effect  : false            // Disable positioning animation
                },
                show: {
                    event: ithoughts_tt_gl.qtiptrigger,
                    solo:  true // Only show one tooltip at a time
                },
                //hide: 'unfocus',
                hide: (ithoughts_tt_gl.qtiptrigger == 'responsive') ? "responsiveout" : 'mouseleave',
                style: { 
                    classes: 'qtip-'+qtipstyle+' qtip-shadow qtip-rounded'
                }
            })
        });


        glossaryIndex = $("#glossary-index");
        // Tile-based glossary
        // TODO: add resize
        if(glossaryIndex){
            var bodydiv = glossaryIndex.find("#glossary-container");
            switch(glossaryIndex.data("type")){
                case "tile":{
                    console.log("Tile mode");
                    var headTiles = glossaryIndex.find("header p[data-empty=\"false\"]");
                    console.log(headTiles);
                    headTiles.click(function(e){
                        glossaryIndex.find('article[data-active="true"]').attr("data-active", false);
                        var newDisplayed = glossaryIndex.find('article[data-chartype="' + $(e.target).data("chartype") + '"]');
                        newDisplayed.attr("data-active", "true");
                        bodydiv.animate({
                            height: newDisplayed.outerHeight(true)
                        },{
                            duration: 500,
                            queue: false,
                            step:function(){
                                bodydiv.css("overflow","visible");
                            },
                            complete: function() {
                                bodydiv.css("overflow","visible");
                            }
                        });
                    });
                } break;
            }
        }
    });
})(jQuery);
