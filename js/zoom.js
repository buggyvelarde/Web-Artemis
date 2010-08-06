//
// ZOOMING
//
var zooming = 0;
var ztimeoutTime = 450; // ms
var zselectedFeatures = [];

function setScrollHandle(scrollbar, fDisplay) {	
	var slider = $('#slider'+fDisplay.index);
	slider.slider('option', 'step', fDisplay.basesDisplayWidth/2);

	// TODO slider scaling
	// http://groups.google.com/group/jquery-ui/browse_thread/thread/1605420a9af60ab2
	//
	/*var handleSize = fDisplay.basesDisplayWidth/fDisplay.sequenceLength*100;
	
	if(handleSize > 5) {
		handleSize = 5;
	}
	//debugLog("SLIDER WIDTH: "+scrollbar.find('.ui-slider-handle').css('width'));
	scrollbar.find('.ui-slider-handle').css({ width: handleSize+'%' });*/
}

function zoom(fDisplay, scrollbar, direction) {
    if (zooming > 0) {
    	var step = Math.round(fDisplay.basesDisplayWidth/3)*direction;
    	var value = $('#slider_vertical_container'+fDisplay.index).slider('option', 'value')+step;
		if(value > fDisplay.sequenceLength-140) {
			value = fDisplay.sequenceLength-140;
		}

	    $('#slider_vertical_container'+fDisplay.index).slider( "option", "value", value );
	    
    	zoomOnce(fDisplay, scrollbar, zselectedFeatures);	
    	setTimeout(function() { zoom(fDisplay, step, direction); }, ztimeoutTime);  
    }
    return false;
}

function zoomOnce(fDisplay, scrollbar, zFeatures) {
    var value = $('#slider_vertical_container'+fDisplay.index).slider('option', 'value');
    var basesInView = fDisplay.sequenceLength-value;
    if(basesInView > 50000) {
    	  showStopCodons = false;
    } else if(basesInView < 1000) {
    	  showStopCodons = true;
    }
    
    var centerBase = fDisplay.leftBase + (fDisplay.basesDisplayWidth/2);   
    fDisplay.basesDisplayWidth = basesInView;
    var newLeftBase = Math.round(centerBase - (basesInView/2));
    if(newLeftBase > 1 && fDisplay.leftBase > 1) {
    	fDisplay.leftBase = newLeftBase;
    	$('#slider'+fDisplay.index).slider('option', 'value', fDisplay.leftBase);
    } else if( newLeftBase > fDisplay.sequenceLength-basesInView/2 ) {
    	newLeftBase = Math.round(fDisplay.sequenceLength-basesInView/2);
    	fDisplay.leftBase = newLeftBase;
    	$('#slider'+fDisplay.index).slider('option', 'value', fDisplay.leftBase);
    }
    highlightFeatures = zFeatures;
    drawAll(fDisplay);
    	  
    // update .ui-slider-horizontal .ui-slider-handle
    setScrollHandle(scrollbar, fDisplay);	
}

function addZoomEventHandlers(fDisplay) {
	$('#plus'+fDisplay.index).mousedown(function(event){
		fDisplay.minimumDisplay = true;
	    zooming = 1;
	    zselectedFeatures = getSelectedFeatureIds();
		zoom(fDisplay, $('#slider'+fDisplay.index), 1);	
	});
	
	$('#plus'+fDisplay.index).mouseup(function(event){
		fDisplay.minimumDisplay = false;
		zooming = 0;
		highlightFeatures = zselectedFeatures;
		drawAll(fDisplay);
	});

	$('#minus'+fDisplay.index).mousedown(function(event){
		fDisplay.minimumDisplay = true;
	    zooming = 1;
	    zselectedFeatures = getSelectedFeatureIds();
		zoom(fDisplay, $('#slider'+fDisplay.index), -1);	
	});
	
	$('#minus'+fDisplay.index).mouseup(function(event){
		fDisplay.minimumDisplay = false;
		zooming = 0;
		highlightFeatures = zselectedFeatures;
		drawAll(fDisplay);
	});	
}