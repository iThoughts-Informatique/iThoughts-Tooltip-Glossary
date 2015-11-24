(function(){
	var progress;
	var text;
	var initData;

	function runUpdate(progression){
		jQuery.post(ithoughts_tt_gl.admin_ajax, {
			action: "ithoughts_tt_gl_update", data: {
				versions: ithoughts_tt_gl_updater,
				progression: progression,
				maxAdvandement: initData.max
			}
		}, function(out){
			progress.value = out.data.progression;
			text.innerHTML = progress.value + '/' + initData.max + ' (<em>' + (parseInt((progress.value / initData.max) * 100) + "").slice(0,3) + '%</em>)';
			if(out.data.progression < initData.max){
				runUpdate(out.data.progression);
			} else {
				ithoughts_tt_gl_updater.from = initData.targetversion;
				jQuery.post(ithoughts_tt_gl.admin_ajax, {
					action: "ithoughts_tt_gl_update_done", data: {
						newversion: ithoughts_tt_gl_updater.from,
					}
				}, function(out){
					if(out.success)
						initUpdate(ithoughts_tt_gl_updater);
				});
			}
		});
	}

	function initUpdate(versions){
		console.log("Init step update", versions);
		jQuery.post(ithoughts_tt_gl.admin_ajax, {
			action: "ithoughts_tt_gl_update", data: {
				versions: versions,
				progression: -1,
				maxAdvandement: -1
			}
		}, function(out){
			var updaterSection = jQuery("#ithoughts_tt_gl_updater");
			if(out.data.Ended){
				updaterSection.append(jQuery.parseHTML('<article data-version="ended"><h3>' + out.data.title + '</h3><p class="updatedescription">' + out.data.text + '</p>'));
			} else {
				updaterSection.append(jQuery.parseHTML('<article data-version="' + out.data.targetversion + '"><h3>V' + out.data.targetversion + '</h3><p class="updatedescription">' + out.data.text + '</p><progress class="updateprogress" min="0" max="' + out.data.max + '" value="0"></progress><span class="updateprogresstext">0/' + out.data.max + ' (<em>0%</em>)</span>'));
				initData = out.data;
				progress = document.querySelector("[data-version=\"" + out.data.targetversion + "\"] .updateprogress");
				text = document.querySelector("[data-version=\"" + out.data.targetversion + "\"] .updateprogresstext");
				runUpdate(0);
			}
		});
	}

	initUpdate(ithoughts_tt_gl_updater);
})();