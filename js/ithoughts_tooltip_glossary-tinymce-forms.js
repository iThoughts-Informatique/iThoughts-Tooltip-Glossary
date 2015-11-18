(function($){
    $(document).ready(function(){
        console.log("Init", $('.tabs li'))
        //Generic tab switching
        $('.tabs li').click(function(event){
            if($(this).hasClass('active')){
                return;
            }
            console.log($(event.target));
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');

            $(event.target).parent().parent().find(' > .active').removeClass('active');
            console.log($(event.target).index());
            $($(event.target).parent().parent().children()[$(event.target).index() + 1]).addClass('active');
        });

        // Autocomplete for glossary term
        {
            var completerHolder = $("#glossary_term_completer");
            function losefocustest(){
                if(!completerHolder.find("*:focus"))
                    completerHolder.addClass("hidden");
            };
            var request = null;
            $("#glossary_term").on("keyup focusin", function(){
                if(request)
                    request.abort();
                var input = this;
                searchedString = removeAccents($(this).val().toLowerCase());
                request = $.ajax({
                    url: ithoughts_tt_gl_tinymce_form.admin_ajax,
                    contentType:"json",
                    data:{
                        action: "ithoughts_tt_gl_get_terms_list",
                        search: searchedString
                    },
                    complete: function(res){
                        console.log(res.responseJSON);
                    }
                });
                var startsWith = [];
                var contains = [];
                ithoughts_tt_gl_tinymce_form.terms.map(function(element){
                    var indx = element.title.toLowerCase().indexOf(searchedString);
                    if(indx == -1)
                        indx = element.slug.toLowerCase().indexOf(searchedString);
                    if(indx == -1) {
                        return;
                    } else if(indx == 0){
                        startsWith.push(element);
                        return;
                    } else {
                        contains.push(element);
                    }
                });
                var searchResults = startsWith.concat(contains);
                completerHolder.empty();
                var length = searchResults.length;
                if(length > 0){
                    for(var i = 0; i < length; i++){
                        var item = searchResults[i];
                        completerHolder.append($.parseHTML('<div tabindex="0" class="option" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
                    }
                } else {
                    completerHolder.append($.parseHTML('<p style="text-align:center"><em>No results</em><p>'));
                }
                completerHolder.removeClass("hidden");
                completerHolder.find(".option").on("focusout", losefocustest).on("click", function(e){
                    input.setAttribute("data-term-id", e.currentTarget.getAttribute("data-id"));
                    input.value = $(e.currentTarget).find("p > b").text();
                    completerHolder.addClass("hidden");
                });
                parent.setDropdownAtPosition({top: $(input).offset().top + $(input).outerHeight(false), left: $(input).offset().left, window: $(window)}, {terms: searchResults});
            }).on("focusout", losefocustest).on("keyup", function(){
                this.removeAttribute("data-term-id");
            });
        }
    });
})(jQuery);