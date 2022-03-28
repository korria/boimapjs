    $(window).on('load', function (){
      var snapshot = document.querySelector('#snapshot');
      var ssctx = snapshot.getContext('2d');

      $(function(){
          resizeCanvas();
      });

      $(window).on('resize', function(){
          resizeCanvas();
      });

      function resizeCanvas()
      {
          var canvas = $('#snapshot');
          snapshot.width = $('#map').width()
          snapshot.height = $('#map').width()
          canvas.css("width", $('#map').width());
          canvas.css("height", $('#map').height());
      }

      function stopSpinner(e) {
        if (e.target && e.target.loaded()) {
          loadingSpinner(false);
          map.off('render', stopSpinner)
        }
      }

      function loadingSpinner(on) {
        if (on) {
          // $('#spinner').addClass('loading');
          $('.lds-dual-ring').show();
          $('#loading-background').addClass('absolute');
          $('#loading-background').removeClass('none');
        } else {
          //$('#spinner').removeClass('loading');
          $('.lds-dual-ring').hide();
          $('#loading-background').removeClass('absolute');
          $('#loading-background').addClass('none');
        }
      }

      $('.dropdown-header').click(function() {
        $(this).children('.layer-dropdown-arrow').toggleClass('rotated');
      });

      $('.dropdown-header').click(function() {
        $(this).next().slideToggle('fast')
      })

      $('#modisheader.dropdown-header').one('click', function(e) {
        addmodisdatepicker()
      })

      function addmodisdatepicker(){
        let modisDatepicker = new MtrDatepicker({
          target: 'modisPicker',
          timestamp: initDate.getTime(),
        });
        $( ".mtr-row" ).first().remove();

        modisDate = modisDatepicker.format('YYYY-MM-DD')
        modisDatepicker.onChange('all', function() {
          modisDate = modisDatepicker.format('YYYY-MM-DD')
          if ($('.aqua_toggle input.cmn-toggle').is(":checked") == true) {
            removeAqua()
            addAqua(modisDate)
          }
          if ($('.terra_toggle input.cmn-toggle').is(":checked") == true) {
            removeTerra()
            addTerra(modisDate)
          }
          if ($('.terra-snow_toggle input.cmn-toggle').is(":checked") == true) {
            removeTerraSnow()
            addTerraSnow(modisDate)
          }
          if ($('.viirs_toggle input.cmn-toggle').is(":checked") == true) {
            removeVIIRS()
            addVIIRS(modisDate,'VIIRS_SNPP_CorrectedReflectance_TrueColor')
          }
          if ($('.viirs_toggle2 input.cmn-toggle').is(":checked") == true) {
            removeVIIRS()
            addVIIRS(modisDate,'VIIRS_SNPP_DayNightBand_ENCC')
          }
          if ($('.eotrue_toggle input.cmn-toggle').is(":checked") == true) {
            removeEOTrue('1_TRUE_COLOR')
            addEOTrue(modisDate,'1_TRUE_COLOR','Sentinel-2%20L1C')
          }
          if ($('.eotrue5_toggle input.cmn-toggle').is(":checked") == true) {
            removeEOTrue('WILDFIRE')
            addEOTrue(modisDate,'WILDFIRE','Sentinel-2%20L1C')
          }
          if ($('.eotrue1_toggle input.cmn-toggle').is(":checked") == true) {
            removeEOTrue('4-FALSE-COLOR-URBAN')
            addEOTrue(modisDate,'4-FALSE-COLOR-URBAN','Sentinel-2%20L1C')
          }
          if ($('.eotrue2_toggle input.cmn-toggle').is(":checked") == true) {
            removeEOTrue('3_TRISTIMULUS')
            addEOTrue(modisDate,'3_TRISTIMULUS','Sentinel-3%20OLCI')
          }
          if ($('.eotrue3_toggle input.cmn-toggle').is(":checked") == true) {
            removeEOTrue('4_RGB__17_5_2_')
            addEOTrue(modisDate,'4_RGB__17_5_2_','Sentinel-3%20OLCI')
          }
          if ($('.eotrue4_toggle input.cmn-toggle').is(":checked") == true) {
            removeEOTrue('1_TRUE_COLOR')
            addEOTrue(modisDate,'1_TRUE_COLOR','Sentinel-3%20OLCI')
          }
        })
      }

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox:\/\/styles/korria/ck5457pxi1drm1cpekmmrecpw',
        zoom: 7.5,
        //maxZoom: 11.99,
        minZoom: 1,
        preserveDrawingBuffer: true,
        center: [-116.24, 43.58],
        attributionControl: false,
        doubleClickZoom: false,
        antialias:true,
        transformRequest: (url, resourceType) => {
          if (resourceType === 'Tile' && url.match('https:\/\/api.weather.com/v2/vector-api/products/614/features.mvt')) {
            zm = map.getZoom();
            if (zm > 0 && zm < 2) {
              zoomM = 2;
            } else if (zm >= 2 && zm < 3) {
              zoomM = 3;
            } else if (zm >= 3 && zm < 4) {
              zoomM = 4;
            } else if (zm >= 4 && zm < 5) {
              zoomM = 5;
            } else if (zm >= 5 && zm < 6) {
              zoomM = 6;
            } else if (zm >= 6 && zm < 7) {
              zoomM = 7;
            } else if (zm >= 7 && zm < 8) {
              zoomM = 8;
            } else if (zm >= 8 && zm < 9) {
              zoomM = 9;
            } else if (zm >= 9 && zm < 10) {
              zoomM = 10;
            } else if (zm >= 10 && zm < 11) {
              zoomM = 11;
            } else if (zm >= 11 && zm < 12) {
              zoomM = 12;
            } else  if (zm >= 12 && zm < 13) {
              zoomM = 13;
            } else  if (zm >= 13 && zm < 14) {
              zoomM = 14;
            } else {
              zoomM = 15;
            }
            let regex = /lod=8/g;
            //var html = url.replace(regex, 'lod='+zoomM);
            //console.log(zm, zoomM);
            return {
              url: url.replace(regex, 'lod=' + zoomM),
            }
          }

        }
      });
      let modisDate;
      let airup;
      map.on('load', function() {
        loadingSpinner(false);
        map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox:\/\/mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.1 });

        map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
        // set up the sky layer to use a color gradient
        'sky-type': 'gradient',
        // the sky will be lightest in the center and get darker moving radially outward
        // this simulates the look of the sun just below the horizon
        'sky-gradient': [
        'interpolate',
        ['linear'],
        ['sky-radial-progress'],
        0.8,
        'rgba(135, 206, 235, 1.0)',
        1,
        'rgba(0,0,0,0.1)'
        ],
        'sky-gradient-center': [0, 0],
        'sky-gradient-radius': 90,
        'sky-opacity': [
        'interpolate',
        ['exponential', 0.1],
        ['zoom'],
        5,
        0,
        22,
        1
        ]
        }
        });

        map.setFog({
        "range": [15.0, 20.0],
        "color": 'white',
        "horizon-blend": 0.01
        });

        let navi = new mapboxgl.NavigationControl()
        let attt = new mapboxgl.AttributionControl()
        //var loc = new mapboxgl.GeolocateControl()

        map.addControl(navi,'top-left');
        map.addControl(attt);
        map.on('mousemove', function (e) {
        let elev = ((map.queryTerrainElevation(e.lngLat) * 3.28084)/(1.1)).toFixed(0)  // 1.1 terrain exag
        document.getElementById('latinfo').innerHTML =
        // e.lngLat is the longitude, latitude geographical position of the event
        e.lngLat.wrap().lat.toFixed(2)+', '+e.lngLat.wrap().lng.toFixed(2) + ' | '+elev+'ft'
        });
        //map.addControl(loc);

        // $('.layer-dropdown-content').hide()

        //Feature testing
        map.on('click', function (e) {
          var features = map.queryRenderedFeatures(e.point);
          console.log(features)
          //document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
        });
      });

      $("#bgColorMap").on("input",function(){
        let color =  $(this).val();
        map.setPaintProperty('land', 'background-color', color);
      });

      $("#bgColorWater").on("input",function(){
        let color =  $(this).val();
        map.setPaintProperty('water', 'fill-color', color);
      });

      let initDate = new Date(), now = moment().valueOf(), nowM1 = moment(now).subtract(1, 'hour'), nowM2 = moment(nowM1).valueOf(), nowW = now + '-' + nowM2 + ':60';
      let s = map.getBounds().getSouth().toFixed(2), n = map.getBounds().getNorth().toFixed(2), w = map.getBounds().getWest().toFixed(2), e = map.getBounds().getEast().toFixed(2);
      let screenw = Math.round($( '#map' ).width()), screenh = Math.round($( '#map' ).height()), loopname='';
      let hrtimestamps = [],irtimestamps = [], ltgtimestamps = [], animationPosition = 0,animationPositionIR = 0,animationPositionLtg=0, animationTimer = false,animationIRTimer = false,animationTimerLtg=false, wScript,mapImg;

      function liquidFillGaugeDefaultSettings(){
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };
}

function loadLiquidFillGauge(elementId, value, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings();

    var gauge = d3.select("#" + elementId);
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scaleLinear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scaleLinear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scaleLinear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scaleLinear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scaleLinear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scaleLinear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scaleLinear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scaleLinear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scaleLinear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .on("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease(d3.easeLinear)
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .on('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

    function GaugeUpdater(){
        this.update = function(value){
            var newFinalValue = parseFloat(value).toFixed(2);
            var textRounderUpdater = function(value){ return Math.round(value); };
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
            }
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
            }

            var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
            var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
            var waveRiseScale = d3.scaleLinear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                .domain([0,1]);
            var newHeight = waveRiseScale(fillPercent);
            var waveScaleX = d3.scaleLinear().range([0,waveClipWidth]).domain([0,1]);
            var waveScaleY = d3.scaleLinear().range([0,waveHeight]).domain([0,1]);
            var newClipArea;
            if(config.waveHeightScaling){
                newClipArea = d3.area()
                    .x(function(d) { return waveScaleX(d.x); } )
                    .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                    .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
            } else {
                newClipArea = clipArea;
            }

            var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease(d3.easeLinear)
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .on("end", function(){
                    if(config.waveAnimate){
                        wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
        }
    }
    return new GaugeUpdater();
}

let nwsLogoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAAHgCAYAAAB91L6VAAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQVR4nOydd3gU1dfHv7Ob3glJSCcQWui9SC9SBAFREEUQUBDEiqhYfgIKgiiKBRWU3otIR6SJIIJ0pAiEQEhIgADpfXfP+8clL0m2ze7O7Owm9/M88wRmZ+49k+zMmXvvOd8jgMPhyA4ReQKoBiAUQAiAAAObHwB/AG4AvB9sbg/2qUo15wvApVwXGgDZpf6vA5AJoBBAHoBcAEUP9mUByCi3pQNIA5AK4I4gCPm2XzWHwzGFoLQBHI6zQ0QhAKIBRD74GfXg31FgzjYMgI9iBlpHDoAUMKecBCD5wc/rJf8WBCFNMes4nAoAd8AcjgiIKBhAfQC1ym01wUaulZEsAPEArj7Y4h9sF7hz5nDMwx0wh1MKIgoA0BTM2TYCUA9AQwBBStrlhKQBOA/gIoBzAC4AOC0IQoaiVnE4DgR3wJxKCxGFA2j2YGsO5nhrKGpUxecagFMATgI4DeCkIAipyprE4SgDd8CcSsGDIKgWANqU2qIVNYpTwg0ARwEcefDzJA8C41QGuAPmVEiIqAqADgA6A+gENrp1VdQojliKwUbIBwH8CeAgn7rmVES4A+ZUCIjIB0D3B1tnsHVblcmTOM6CDsBZMGe8D8BeQRBylDWJw7Ed7oA5TgsRNQLQ+8HWASxnllPxKQJwCMBvAH4TBOFfhe3hcKyCO2CO00BE/gB64KHTjVTWIo6DkAxgG5hD5qNjjtPAHTDHoXkwyu0H5nAfgb4CFIdTmtKj4+2CIFxQ2B4OxyjcAXMcDiKqD2AwgCFg+bgcjrVcALAOwFpBEP5T2hgOpzTcAXMcAiKqDeZwnwYTwKiY3LkDpKYCaWlASgrw5JOAt7f97dDpgGnTgKgoIDwciIgAoqOBKlXsb4v9OANgPYB1giBcUdoYDoc7YI5iEFENMIf7NFiakHNz5gyQkADcvv3Qyd68yX7eusX25+WVPWfjRuCJJ+xva3Iyc77lCQxkDjky8qFjjooCwsIeOumqVe1vr/ScBLAWzBlfV9gWTiWFO2COXXlQuGAYgGcAtFLYHGlp3x44fNiyc0aNAhYtksceUxw9CrRta925AQHMOUdHA6GhzFlHRbF/R0UxRx0SIq298vIPgDUAVnANa4494Q6YIztEpALLzx0DYAAqarpQZCQb8VpCSAg7x8XOsWXr1wNDhsjXvr8/c9KlHfMrr7B/Oy6FADYD+AksmpoUtodTweEOmCMbD7SWRwEYDVY1qOKSlwf4+QFareXn7tkDdO8uvU2mmDsXePNN+/aZmMhGzc7BVQALASwVBCFFaWM4FROuFMSRFCJSE1FfItoEIBHAdFR05wsA165Z53wBYOtWaW0RQ3Kyffvz8GAzBM5DLIBPAVwnok1E9BgRqZU2ilOx4A6YIwlEFEVE08Cq3WwDm2quPDm7N25Yf+7WrQDZebYzxc6DushIQOWUjxtXsO/ydgAJRDSViAxEr3E4luOUdwTHcSCiFkS0GkACgI8AVM6HU1KS9ecmJADHjklnixgsXau2lYgI+/YnD9EApoA54tVE1EJpgzjODXfAHIshIhUR9SOifQCOAxgKpUa7Z88CU6cCY8cq0v3/k5go7jhjo0B7T0PbewRsKOXJeXEB+84fJ6J9D5ZceDwNx2IqzxQhx2aIyAPACAATAdRVzJD//gN++QXYsAE4fZrtc3Fhjjg8XBmbxI6AW7QwPNrdsgX45BNpbTLFhx+ydeuUFDYaTk5mP+/dk6c/e/1dsrMBX1/79MXo+mC7QERfgqUyFdrTAA6HU4EhoiAi+oiIbpNSXLlCNHMmUatWRIJAxFZNy27ffquYedSpk2Gbym8ffWT8swsXlLO/hPv3ic6cIXrhBXHXI3abO9c+9r/wAlGTJkRffkmUlmafPsuSSkT/I6Igpe9bDofjxBBRTSL6nohylXiS0bVrRJ9/TtSunXGnW3rr2lURM4mIqEYN8/Z5eBAdOmT8888+U87+8rz8snjn+sILRBMmED3+OFGLFkShoUQqVdlj1q+X3+b0dCJf34d9enoSDRtGtGsXkVYrf/9lySV278QofR9zOBwngoiiiWg+ERXZ+6lFiYlEX33FRpTlH+LmNrWa6MYNu5tMBQVErq7m7atViyg/nzliQ5936GB/240xYID43/vFi/rn5+SwEf3evURLlhAlJclv8/ffG7exbl2iGTOU+H4UEtEPRORUOVgcDsfOEFE4EX3z4KFhP1JSiL77jqhLF+ZEnWGqszRXroizrXNndnyLFsZfIOzhqMRgzMbym0pFlKvMBIkebdqYt9fVleiJJ4gOHLC3dflE9DURObQUGMe+8ChoDogohIjmAIgH8CrsIRV5+zbw449Az55A9epMpvCPP6wXsyhh40ZJzLOI69fFHVcSiNTUSN0JrVYZUQ5DiE1TCg0FvLzktUUMJ04wfWtzFBcDv/7KUr/siweA1wBcJaLPia8Rc8AdcKWGiAKJaCaY7N5EAJ6ydnj3LrBwIfDYY0yScPx4YPdu9lCUikOHxKcESYVYVakSB9ysmfFjHMEB5+WxsolicJT83sWLxR9btaq8Otim8QIwCcA1IppORBW6/iPHNDwNqRJCRP4A3nyw+dmt4/btgcuX5e0jOJilKVWvLm8/pRHr8EuclSkHvG8fcP8+KwuoFImJrF6wGJRK+ypNXh6wZo3444cONT9qz8kBfHxss8s0PgA+ADCBiOYC+EoQhCw5O+Q4HnwEXIkgIhciehlsqnkK7Ol8ATbylYOgIODFF4GdO1k+bq9e8vRjDLE5wCUOuEkTwM3ILH9hIbBjhzR2WYslKlmOoO+8bp1l+csvvGD+mNdfB1q1AubNYy9E8hEAYCrY1PRLxCqHcTicigQRdSGif+0ceFIWUyk4lm6BgUSjRhFt3UpUaN+YMT169BBn86FDD89p1sz4cUOGKHctRERLl4r/O8ycqaytRCx4T6y97dqZb+/+/bLpTD4+7Ltmn8Ctk0TURennBYfDkQAiqkVEG+3x5DCLTkdUs6b1TrdKFaIRI4g2bSLKy1P6ah5Sp444+xMTH54zapTx4/z9lb2+Tz8V/zdZtkw5O4lYqpOYHPGS7YcfzLdpKp2pYUOiOXPsIfKxkYhilX5+cDgcKyAiH2LRlgoPD8vx9tuWOV1/f6JnnyX65RfHSXcpjVbLBB/MXYe7e1kxiK+/Nn385s3KXdOECeL/Pnv3KmcnEdGkSeJt9fMjysgw36aYdCZPT/a9vHxZzqvLIxaoJetiNIfDkQhihRJGE1GKnE8Gq/n7b/EPTJWK6OpVpS02zbVr4q6lZs2y5x08aPr4F15Q5HKIyDIRjkuXlLMzP58oLEy8rS++aL7N48fFt+fiwv7+8pNC7J7m68MVDP4HrUAQUUew6kQLAYQpbI5h2rYFatcWd6xOB+zaJa89tiK2DnD5YKVGjQBXV+PHb9sGaDTW22ULYislqdXKVjnatg1ITRV//PPPmz/GknSmXr2AmBjxx1tPGNg9fZSI2tijQ4594A64AkBE/kT0PYADAEzkuDgITz0l/thffpHPDikQ64DL58v6+wP16xs//vZt4M8/rbfLFsRGQVerBnjKmzpukkWLxB/btCnQoYPpY3JygNWrxbc5apT4Y6WhJYDDRPQdEdm15BNHHrgDdnKIaACA8wDGA3COmqSDBok/9sAB64rHazQspUduLE1BKo0xRawStmyx3B5byc9nzl8MSopwJCQwERexjBxp/pgNG8SnHIWHA/36ie9fOlQAJoCVP1TEAI50cAfspBBRKBGtA7AJgDRPwrQ0SZoxS8uWQL164o7VaNiDUQxaLZOznDCBTY1u3my1iaKxVISjNE2amD5n2zbL7bGVpCTxcqBKOuBly8RP0Xt5Ac8+a/44S6afhw8H3N3FHy89kQC2EtFqIqqmpCEc6+EO2MkgIoGIRgG4AGCwJI3qdMA337ApUbGjH1uRahqaiMlPvvEGULMm0LUr8P33wK1b4h23LYgdARtSjDKliAUAV68Cx49bbpMtOIMIh1YLLF0q/vgnnmAKaaY4fx44eFBceyqVuPVk+zAUbDT8PBE5xwwYh+OMEFEsEUmb93H9OlHPng8jO2fMkLR5o5w+bVk0dPlo0yNHWEqTqbxiHx9xaSe20KiRuGsoLcJRQkYGi6Q1dd6HH8prf3lWrBD/d1GqfvHWreJtBIh27zbf5ltviW9PybrTpvmdiGoq/ZzicCoUxCQkJxHLC5SOpUuZolTph0tUFFGRncoAN2gg/qH3xRdEp04RffABq+0q9rwVK+S9Bj8/cXZs2ED0xx9EO3cSrV5NtGoVK8EYFGT6vKZN5bW/PLNmif/dLl9uX9tKeOop8TbWq8cEYExRUEBUrZr4NpUWHzFNLhG9RURc55/DsRVio96/Jb1FU1NNP8TWrpW0O6N89JH4h56xIvbmtieekM/+1FTrbLJ0M1TwXi5eeUW8XUqIcNy8SeTmJt7GKVPMt7lmjfj2goIcUxBGn7+Ij4YdHr4G7MAQW+s9BaCtZI1u2gQ0b256ffS77yTrziSDLVjCLiiwro9du4D0dOvONYe9yh7aMxhLbGlFQJlKSMuXA0VF4o//9FNg4EBWA9hYcNmSJeLbE1NJyTF4BMApIhqutCEcjlNBRFWISNphaG4u0ejR4nRzBYHoxAlJuzdK06byjyAXL5bH9g0b7DMC7thRHvsN0aqVOJvUavvrVet0RHFx1v8eo6LYEkZp+cj4eBZjILaNkyfte83SsJqIApR+rnH04SNgB4OIugI4A0DaiuFubiyilkiMEfYbBVuSE2wtGzfK0669RsCHD4tXp7IVRxbh2L8fuHjR+vOTkoAZM4C4OKB3b2DtWuDHH8XXPm7XznzkumMyFMAZIuqktCGcsnAH7CAQkSsRfQZgDwDp9f1cXICPPhJ//Lp1wJ07kpuhhyXpSNaSmio+t9USxKpg2YpWC2zdKn8/eXni09CUkKBctkyadrRatjQxdCjwxRfizxsxQpr+LUE6OdJoAPuIaAYRmdBA5dgT7oAdACKqC+BvAO9Azr/Jk08C7duLOzY3F/j5Z9lM+X/i4oAWLaRvt2FDYMoU4MwZ4NgxplssNfZywIB9HPCNG44rwnH/vrKypH5+wDPP2LfPrCygdWuWoy92lG4aNYD3AfxFRHWkaJDDcWqIaAyx1AH7sHev+PWuGjWIiovlt2nmTGnWSuPi2BrfqVPy20xE1LKlfdaAARYFfu+evNdjyXfjlVfktaU8331nv9+1oU1MJSWpGTPmYf+9exMlJUnZejaxIE8Op/JBRB5EtETKO4pOnCBat878cf36iX/wrFkjqYkGuXTJsqLqpbc6dYgmT2Zl5OxNSIh9ncDKlfJez/Ll4m2ZNUteW8rTooWyDvjPP+17vRs36t8TwcHi7m/L+JmIPJR+HnI4doOIYohIujDjoiKiadNY0Xc3Nxada4qTJ1kUq5gHT/fukplpktatxT8Mq1UjevddpoalFOnptj3QPTyIoqPZdYt15E8/Le81OaoIx9Gjyjrfxo3td61ERMnJpoVBRo9m3z/pOEZE0Uo/Fzkc2SGiXkR0V7Jb58IFojZtyt6gXl7m5feee07cw0cQ7DO6nD1b/AOxQQP57TGHWCnNgACiOXOY6tiePWx6PCWlbFvvviuuLX9/eVN/Xn1V/N9g/3757CjPuHHi7QoI0Fd3s3X76iv7XatOR/T44+Ztio1lymrScYeIuiv9fORwZIFYEYUPiEgjye2i0RB9+SWRt7fxh7Upx3n1qnh1qZdeksRkkyQkWJaPaa91XmNs3izOztq1zbe1fbv4696yRb5rGjRIvB2lc2nlJDOTqEoV8XZNmkSUk8Nyvzt3tn5po2Tz9CS6fds+10pENG+eeNtcXIjee4+osFCq3jVE9C7xog6cigQR+RHRJqnuEkpIIOrWzfwNGhRE9N9/xtt57TVxN7qPD9GtW5KZb5T27cU/fD74QH57TCE2KKh5c/NtZWSIl1eUMxio/EyKqQd/fr58dpRm8WLx3wlBYDNCpTl3jhVaCA21zgE/+6x9rpOISY76+FhuY6tWRP/+K6UlvxCRr9LPTQ7HZoioARFdkuzWWLDAshFBTIx+JaESUlPZSFlMO7NnS3YJRpkzR/x1xcXJb48p3nlHnJ1duohr75FHxLUXFiZfZHp4uDgbIiPl6d8QnTqJ/0507my8nfx8FlDYtatlzu333+1znUVF4l+ADG3e3kTffmu+8IR4LhKRyKLdHI4DQkSDiYX7S8OMGdbdnA0bMhF7Q4gtiFCzpvwpSdevWzYNbe3adHq68d+HWJ55RpyN/fuLa0/sOjBAtG+fbbYbIi9PfGBemzbS92+Ic+csm0IWIzk6d6749mrXJtJqZb9MImIzOtY639Jbnz4siEsasojIDlJ1lRcuxCETRPQBgLUAfCRr9LHHWDFwSzl3jhUlz8zU/2ziRCA01HwbCQnAli2W920J1asDHTuKP94SicmsLGD1aqa8FREBzJxpuX2lSUoSd5yfn7jjOncW37ccohxJSeJFOOxVhGHxYuZWxBAYKE5VzZLCCyNHWne/WcqhQ8Ds2dK0tXOn+WIr4vEFsIGIJkvRGIcjO8QkJRdK9QqqxxNPWP923KWL4bW7r74Sd36PHrJd1v/z9dfir6dePdNtZWez0opDhuivrUVE2Da6iYoSZ+PLL4trLyODpZGJHZlJzb594n/vr74qff/lsbRG7/jx5tv86y/x7bm5SS18YZj0dPb3lGL0W3oTBJaulJkplaULiNcY5jgyRORPRPIuGh0+bFtk54ABLIK6NPn5bIpZzE199qysl0fJySzIR+z1/PNP2fNzclge9DPPEPn5mT53zx7rbMzLE2/j5Mni2+3Qoey5Vauyte5OnVgO8CuvEH3yCdFPP0lfk9YSEY7PPpO2b0NYUqMXYLnC5iitLCXmPrEHL74ovfMtvdWuLaWIyG/Eg7M4jggRRROR7aGI5Z2jIXr1su2mHDVKf/S3dKm4c8eNs/kSzdK9u/hrmTyZOcRNm1huc0CA+HMnTLDOvgsXxPcxc6b4dk+dIjpwgJXIy8qyzjZrsSQPe9Uq+e3p3Vu8PS1amG8vM1N8wCHA0szkZv1629OkxGwuLkQffshmFWznDBFFKv285XD+HyJqQUQpZr645tmzh6h+ff1RXXl277b9pnzrrbJtarVETZqYP8/HR35N4u+/F38dgYHWCy+Eh1sXWPb772XbUanYdGnDhmyaftgwotdfZ85X7hkDKbl7l6mkbd7Mou0//JBo5Eiinj3ZSNzXl12vtAIQ+sTHiw8IA1j0rzkWLBDfXnQ0i0qWE3NqV4a2oCD28myt027Thuj8eUmsJ6KmSj93ORwQUT+yNdI5O5vl5JZEAEdGMqEMU5SfrrRm++STsm1u3SruvC++sOlyzZKaSuTqavv1idnMKYYZIiGB6Ndf2YvS9ev2y4l1BFJT5VXjIiL63//E//28vdmLgznEpnkBRO+/L+/16XREffta/l0tmXn49VfLnXfJNmiQVFeRTUR9lH7+cioxRDSBbFW2+vtvNroof6M0asQCc4yxZYvtzkcQmKBEaTp3Nn9ebKz86Rm2TrOL3cQGSXHsg0bDctfF/v2GDzff5qlT4ttTqdgIXE6+/dby7+mIEWXbuHnTsqIqACvmIG1gmYaIxin9HOZUMojJStpWDqaggL1pmxrp9e1rfCpMp2MqS7Y6ILW6bJWdQ4fETXFtkk7YyyCWTBnasoWG2qfkIkcc27ZZ9vfbu9d8m2IV3wD24icn585ZrnZVowbR/fv6bel0TLpSbHtr18p1VTOUfiZzKgnEnO/3Nn1dz5wR7zzHjjXezurV0jghNzei33572O7AgebPkTslKS1NfFqOLVtcnPwjHo54nnpK/N+ubl3zyk+5uWzkJ7ZNOQPMioqYbKQl30+12rzwyvnz5quJPf+8fNfF+Ja4hjRHTohITURLrf6KFhezwBxPT8tuQmPVWDQaw9PXpTdXV3EjWm9vlidJxF4QzKXZqFRS68/qY+kUm9itTh02+3BCuoqQHAnQaln6j9gALDER5pakV4WESBUpbBhr1K7EprEVFrLCDIbu29hYqcsXGmMhEamVfk5zKiBE5EZEtlXDzs4Wt8Zq6C3Y2PTRokXmzxerMRsczKbIiFgSv7njxYgf2IIlQvzmtlq1mH6zuQhzjvIkJBBNmWI6N93NTZzkoiXazxMnyndNBw5Ylt8OsPQqS18I/viDOdzSzw57lo4kWkNErko/rzkVCCLyIKKtknw9s7LY9K2lDsTPz7DzKChga0Smzm3USPxoMjaWPdiuXjU/Uvf3N7w2JRX37lk+W1B6i4lh6VaHD0spUs+xFxoNi8wfPFh/OUKMUMaFC+K1xQWBzfzIQUaGdWpXPXvq144WQ3o6Sx8DLBOCkY4tROSu9HObUwEgIm8islIyyQjZ2ezmsvSGNJaeJCaqctYsosaNxfXTuTNbO3vrLfPHyp2SJGY9uvQWHc1ycA8e5E63IpGSwhS46tdnf2cxQhmWFLjo2FE+20eNsv4lMizM+hrQmzYpmSK3m4i8lH5+c5wYYtKSh2T5eubnW5cL2LSpfnpSXh67UU2dFxzM1jzFBqQ8/TTLrwwJMX1cvXri1LusZcUK87ZGRDB94gMH5LWF4xjs329eKKOgQHx5RYAt5ciBFGpXgsAU6HJy5LFRPg4Skb/Sz3GOE0JEVYlI3iid/Hw2lWbpDdmvn/4DaNYs8+e9/jpL2xBb/H3iRHGjazlTkjIyWIBY+T5DQ1kO75493Oly9NmwQfz9VKWKlEULHpKcbP4F1pItLo7oyBHp7ZSXY0RUVennOceJIKJgYpqn8lNQYFnqRclWXpM5PZ1J1Zk6x8ODpdxYIgQwe/bDaT9jW9++8v6OSn4/ISEsLWvXLp67yzGNJbNLcuibW6t2ZW5zc2MKdnJLZUrLGSIKUvq5znECiE07W1np3UqKi4mGDrX8Zpw7t2w7H31k/pznnmPHvvmmuD7UavMR0SqVvJrHhw8T7djhbA8djlIUFlom1SqmkpKlfPON9M639NahA9Hly9LbLR/HiE9Hc0xBRF5E9JciX8+iIuYcLbkJ1WqidaUyo+7cMV+CT61ma8EaDauTK6YfLy/zBQ9ef12RXxuHY5RTp1gJx6pVjX9vxVRSshRr1K6s2fz9WWlK5+Eg8cAsjiGIpRqJ0LWTEY3G8ohJf3+iY8cetiEmcrl/f3Zsbq51ecnG7JAzJYnDsZacHFZus0sX/YCo8lrotlJQYJ3albUVvQCiJ5+UV0BEWnYTT1HilIaYyIY0eb62otNZVjgcYFHAJelJycnicmcPHGDH37nD8oSlcMJff63c743DEcO//7KX1NBQeUprWqN29c47RNeuWSYaUnobM0baa5CfzUTkpvRzn+MAEJOXtE3hSmq0WlYs3pKbsHnzh+lJr75q/vju3R/2l5TEnLitDrhePfmrJHE4UpCXxwqPSMkff1indlWSq6vVsmwGDw/x59epI08Et/ysIS5bWbkhVlhhicJfRMPodERvvGHZzVxSPenGDcOpO+W3Xbse9nfsGJtGttUJ79ih3O+Mw1EKa9SuvLwMq28dP07UsKH5811dmeCM87KQeAGHyglJUdXIHkyaZNlN/eqr7DwxUc4dOpTta88e9lCwxQHLnZLE4Tgi1qhdGSuyQsTWrV97zbSU5v/+Z7/rM8aePSyt0Xq+UdoXcBSAiESUUnEQ3nvPsht77ly2FiwmErO8zN2aNeKr0RjaVCqiS5eU+T1xOEpgjdpVnz7ilmt27GAStOXPb9NG+bS8detYvIkgEP38sy0tfaq0P+DYESKSuYyPDEydKv7mVqtZYfPJk80f26qVvmbyvHm2jYJ5ShKnspCUZLnaVXAwUWKi+D5u3WKRziXn+/iwQhNK8vXXZV/U3dzYaNh6xivtFzh2gIj6E5FzahdOny7+Jvf3J9q9W9zDYf16/b4mTrTeAYeHc3lITsXHWrUrY6VFzfHTT+y+njdP2uuwBK3W+Iycv78t5T41RPS40v6BIyNE1IqIciX7MirB7Nnip7tiY8WpYzVurD8dptWyggyWPlweeeRhTWEOpyJjjdrViBG29Xn9unJVvoqKiJ5/3vT1RUQQXbxobQ8ZRNRIaT/BkQEiiiSiJKm+i4oyd654J9yli7jozOXL9fspLCR67DFx/bi7E338sfLrUhyOPbBW7Soy0jkzBTIz2bq12Bf/5GRre0oiokil/QVHQojpO8soVqwA330nvti4GAccF2e4wEFGBlHr1uZH0MftK5/N4SjKlCmWO9+STaViEc7OUl4wNdX8M6D81qYNU9qzjrPEdaMrBsRUrpSVmJSL+fPFRSwLgrgRs7GaqHfuENWqpX+8iwtLk8rLs+91cziOwPLltklINmxYVkbWEbl8mYl9WHN9ffuyWTTr+I24UIfzQyzZu+KyaJFtaUOlt1q1jN8w586VLXdYu/ZDOUsOp7KSkGC9hCTAVK8+/dQxFeT++YcoLMy2Z8rw4bZc2/dK+w+ODRDRZAm/jo7LsmWWS+AZ2374wXg/Bw4QBQQQvfTSQ9lLDqeyo9USffaZZRKS5bcuXZgzdxR++818ZTWx22SbHsOTlfYjclJhZcCIaDCAtajA11iGNWuA558Hiopsa6d6deDCBcDLSNWw27eBatVs64PDqYicPAmMGgWcPWvd+VWqAHPnAiNGSGuXpSxbBowZY/uzpARBABYtAkaOtOZsAjBYEIRfpDHGsVApbYAcEFEDAItQWZwvAAwdCqxYAbjZWGQkMRH46Sfjn3Pny+EYpnlz4O+/gTfeAFRWPFrT09lL9DPPAHfvSm+fGGbPZo5SKucLsHHwuHHAn39ac7YAYBER1ZPOIMehwjkoYtFz/wCoo7QtirB5M3PGBQXWtxEeDly6BPj4SGcXh+Yh7cQAACAASURBVFOZ2LULGDsWuHHDuvOjo9mLcM+e0tplDJ0OmDgR+Ppr+foIDgb++AOoX9+asy8CaCMIQra0RilLhRoBE6ussQSV1fkCwIABwLp1xqeQxZCSAsybJ51NHE5lo1cv4MQJ4OmnrTv/xg3g22+ltckY+fnAsGG2Od9OnYBNmwB/E9lDaWmsH+sGB3EAFlMFq55UoS6GiD4AMF1pOxyC334DnnwSyMuz/FxHWYuqpBQU6HDxaiYSb+chq6AQKan58PJVITdbizv3CnA7KQ0piTko1mohqASoIaBalA8iY4IQGOABP39X5GZpER7mCX8vd0QEe6FujB/8fF2UvrTKydKlwJtvsilmsYSEsDXliAj57AKYTYMHA3v3Wt/GCy8A330HeHiw9ePnnzd9/JtvAl9+aW1v7wqCMNvakx2NCuOAiagXgO0AeO5YCXv3Ak88AWRbMGvTvTvw889ATIxsZlVWCgq1OHEhHWfi7+FC/H1cT8xEclImMtPzkJtRiIKsfBRkFaI4p5Ctm0mJALj6uMPNzwOefh7wCfCEr78HIiL9EVsjAHVrBqJxrUC0iKsCH2/uqCUnIYE5qj/+EHf8unXMMcpJcjLQvz9w6pR157u4AJ99xqauS/P008x+Y6hUwM6d1k6vawH0EgTBhjcGx6FCOGAiigFwHEBVhU1xPPbvZ044M9P0cd7ewCefAK+9Bqj5O4wt3EjJw54TqTh8IhXnzt1BSmI6MlKzkHsnB7pirdLmmURwUcEzyBsBoX6IqBGIhg1D0KZxKHq0CUdslLfS5jk3Oh1zWB9/bHoadtQoFjUsJxcuAP36AdeuWXd+YCAb7fbtq//Zf/8BDRqw6zVGkybM8QtWuaA0AC0EQUiy5mRHwukdMBF5AjgEoLnStjgsBw+yN92MDMOft20LLFxobXBEpeb0xXT8sj8RJ87cQvx/d5Aafxe5t3JAph4+zogAeFXzQ2hsEGrWrYoWjUMxqFsMWjfi77wWc/w4c7Lnzul/FhsLHDvGloHk4q+/2Et5Wpp159etC2zcaPp50a4dcOSI6XY2b2bPJes4BqCjIAiF1jbgCFQEB7wYwEil7XB4jhxhb6v37z/c5+4OvP8+8N57gKurcrY5CRoNYdufN7HjYCKOHk1Cwr+3kHMzU/rpYifCq5ovajQJQ6uWUejTuTr6dYyAlyefQTFLbi6797777uFIUa1my0adO8vX76ZNwHPPsf6t4dFHgVWrgKAg08c9/jiwbZvpYwYMYPZYz0JBEF60pQGlcWoHTERjACxQ2g6n4Z9/2LRTWhrQuDGweDHLXeQYZefBW1i14xIOH7yGpH9voTjLhvQuAwhqAS7+nnDxdYfa1w0uvuzfJZva2x1qL1foirVQe7tD5aJCyqqTyL1SdvTiER2AyJGtAR1Bm1MEwVUFbW4RtHnF0OQUQJNdCG1OETRZBdBmF0CTXYTizHyQRtqRuou3G8IbhKL1I9XxTL+6GNSdF7YxyW+/MdGL5GRg8mRg5kz5+po/H3jlFUCjse78CROAr74y/7JeUADUrAmkppo+LijI+lH4Q0YJgrDE1kaUwmkd8IPE7BMAbMi3qYScOMGmjz78EPD0VNoah+PO/UIs3nIFm7Zfwb9/X0fuTTNr5yJwreIFt1AfuAf7wC3EB+4hvnAL9mFbiDdUbpYFPcVP343M42WXv3ziqqHuTAPrcSYgjRaFaTkoTstF4Z1sFN0p+ZmDots5KLpn5SipFJ7BvohrWx29e8RizKA6iInk68h6pKUBc+YA06axWSk5+OgjYPp062drvLxYVHbduuaPnTGDPV/EcPs2i/i2nhwAzQRBiLelEaVwSgdMRG4ADgNoobQtHOfnQkIWvlxyBrt3XUbymVToCq0bIajc1fCIDIBndCA8o/3hGR0Ij5gAuFWVVtBEKgdsjuKMfORfu4eCpEzk3biPgsR05CdlQFdg3e9HcFEhtEEYuvepg9eHN0TL+nz9WHY0GmD8eJbZYCsNGwIHDrAALGOsXcvSF8UqaWVnSyH48w+ADoIgFNvakL1xVgc8E0CFFunmyMulxGx8texf7NhyEcmnboK0lk/FekT4wbtOCLzrVoN33SB4RAZA5Sr/+qe9HLAhSKtlDvnqXWRfuI28y2nIT85gir0WIKhUCG0Yil6P18ObIxqjcZ0AeQyuzOTmAs8+C2zZIl2b7doBv/wChIWV3a/RsAjvqVPFT3GHhTHRH2mYIQiCyGG34+B0DpiIugLYgwqm4sWRn5t38jHz59PYtuU/JJ1Mgq5YvNMVVCp4xVaFT1w1eNcLgXedqnAL8pXRWuMo6YANUZyZj9yLd5B7OQ25F+8g58odi9aWBbUK4U3C0efxuvhgTFPERCjze61Q3L3LgpwOH5a+7YgINsXcsyebMj9wgE2hnzxpWTu2B2GVRgugqyAIB6Vq0B44lQMmoioAzgCIUtoWjvOwZFsC5i08idO/X4YmT7zIvGuAB3ybRMCvaTh8m4TDLdAx1i8dzQGXR5tbiKzTN5F1JhVZp26iKC1H9LkqdzUadK2N8aObY9xTtSFYlydaubl2jWU8XLyotCWmWbYMGD5cyhYTATQVBMFIvqXj4VTfbiJaB0BmeRhOReDGrVxM+fYkNq89g/SrIivLCAJ86gTDrxlzuD51Q6yraiMzju6Ay5N37T6yTicj++RNZJ+/BdKJm6/2i66Cx4Y0wofjWqBBrAmNYc5DTp1imQ7STe3KQ1wcGzF7eEjd8ipBEIZJ3ahcOI0DJqKRABYrbQfHsVm7KxEzvz2Cc3vjoS0QEZPxwOkGtItBlbbRcAv1k99IG3E2B1ya4vu5SP87EemHryH3YpoowRKVqwp1O9fCpAmtMXpgLTtY6aTs3g0MGWJccMccvXuzcormVPNsRRBYvnPXrnL1MEIQhOVyNS4lTuGAiagmgNMA+OIQRw+djvDF8vP49tujSD6ZbD7VQhDgXSsIAe2qo0q76nAPc67RlTM74NIU3clB+t+JyDhyHTn/3RGVIhPSIAwvvtQaU8Y1gZur481OKMaqVcDo0UChlcJQEyawAiy7dgGDBklbD9hQX999J1/7QBaAJoIgXJezEylweAdMRC5gUpNtlLaF41hkZhfh/W9OYOWi48hMuGf2eNcATwR2ikVQj9rwiJZR6k9mKooDLk1BSibu7buC+/uviso/9onwx5AXWmHWG60QXEWm3FlnYc4c4J13TGsvG0MQmAb8Bx883Dd3LqtYJAdPPw0sX24P5b3DADoJguDQ4uvO4IDfBlBhyk9xbOfW3QK88slf2L7yBArumSm3KAjwbRyOoO61ENA2Bio355dJrIgOuASdRoOsEzdxd89lZJ00nx7m5u+JHkOb4ocpHRAd5hhBcnaDCHjrLaZOZQ1ubsAPP7CRc3m6dGHRzVIycCCwZo18YiP6TBIEYY69OrMGh3bARBQL4F8AXLKJg3uZhZjwyWFsWnwMhfdNO14Xfw8Eda+FoEfrOt0UszkqsgMuTdHtbNzbH4+7u6+g6J7pSGpXXw88NqIFvp/SAeHBleRxMWoUsGSJdef6+gIrVzLNZkOsWCFdhLIgsBH69OmshKH9yAXQWBCEBHt2agkOW/iTiAQwnedKcjdxjJGZU4w3Zh7Bmp+OosBMSotHpD9CHquPwK61ofZ02K83RwRu1XwRNrQZqj3ZCOl/XsOdreeQd91wUfvi7AJsnvcXdq44iYEvtMLcye0QVtEdcZ8+bDpXa+Esa2gok6Nt1874MZESaXjXqcPWex99VJr2LMMbwA8AeinRuRgc+Qk1CkA3pY3gKEdBoQ5vfn4Ey779G3l3sk0e69swFMF966NKm2iHTB3iWI/K1QVVu9dG1W61kHUyGbe3X0TWqZsGg7aKMvOx7ss/sXnJcQwe2xrffdAe/j4VtNLXkCEsYvmll8RrPMfGsipF9eqZPu6ff8y35ePD1LYM9d2yJTB2LBtFS59qZAk9iWiEIAjLlDTCGA45BU1EoQAuAHDeSBmOTbz83gGsWn0GmYn3jR8kAAFtqiN0YEN416tmP+MUprJMQZsiL+Eebm85h/SDCSCtcefjHeqHJ59uhKVzFRmB2YepU1khB3O0bMlq8IaHmz7uzh2gaVPz1YwGDgS+/prlHqelAcXFbOTcoAGrhuQ43ANQXxCEO0obUh5HdcBccKOSsnJzPMaN2YQcU1PNggD/llEIf7opvGqZqUtaAeEO+CH5N+4jdf1ZpB+6ZnIU6OHngdnf9MOrzze0o3V2goil9vzwg/FjevYE1q8H/MzkuWu1LA1JjH50/frA+fOW2aocqwVBeFZpI8rjcA6YiAYAkEwglOMcXLmehV5PrMW10ykwpezv1zwS4UOaVKoRb3m4A9YnL+EuUtedQcbRRJOFIcJqB2P7pqFoVtEqMWm1bES6bZv+Z8OHAwsWmJ8K1mjYtPFikXpHNWsCV69abqty9BMEYbvSRpTGoRwwEfkDOA8gQmlbnAWdTofvvjuG5ctPg8WtOR9Jt3KRlpplUqLQr1EYwoY2h0+Dyut4S+AO2Dh5V+7i5ppTyDqRZPQYlZsaI97pggVT2sPVpQLFC2RlAT16AMeOPdw3aRKrUmQuLqKggKUjrV4tvr+uXYF9+6yzVRmSADQQBMF0QIkdcbQgrFngztciVCoVXnutDaKj/TFhwg6kpGQpbZLkBD9WD9FjH1HaDI4T4FU7CLX/9yhS155CyupTBo/RFWmxZPpe7Nx8AQvn9UffjmEGj3M6/PyAX39l082XLgGzZwMTJ5o/7+5dJpBhqTPt3Nk6O5UjCsCnAF5V2pASHOb1j4g6AHhJaTuclYED6+HkybF46qn6SpsiOemHrkObK6M0HqdCQcVa3DtgPvXz9r+p6N/jJzw+/ndk54qsYevoRESw9duVK8U530uXmCO11Pm6uADPPGOdjcryMhG1VdqIEhzCARORCsBcONiUuLNRrZoP1q8fgqVLByIoyEtpcyRDk1WA1DWGRzMcTnnu7LiIwhQDBQUMlDbUFemw7cfDiG74PRZtcar1TOPExrIRrTkOHQI6dQIuXLC8j+eeYzm+zocKwDfkIOt1DmEEEb0A4Gel7ahIJCVlYPz47di+/YrRY/r0qY26dR0rGOXu3TysWHFW/wMBaPDNE/CI4plpfA3YOMUZ+Tj/8gZo8/QrYUWPbYf7h68h59wtg+cKKhU6DG2KLT/0RoCfm9ymKsvBg0wFy5rKR9WqAWfPAiEh0ttlP0YKgrBUaSMUXwMmIj8A0y06qaiITZ00aiSPURWAqKgAbN36LH788TgmT96DrCz9Kil//HEN3brF4M0320GtdojJEABAbGwgpk37o+xOAuI/2Y2GC4YoYhPHOUhZecKg8/VrGoHgx+IQ3Lsu0n6/gpsrjkObU/aeIJ0OB1edRI2jiVi26Ak83kkiNShH46+/rHe+Li4sStq5nS8AfEpEvwiCYFpaT2Yc4an7AYBQi874/HOgVSvgf/8D8vPlsaoCIAgCxo9vhWPHxqJz5+p6n+fna/D227vRvfsyxMebELywM1OndsHEifoyeYV3cpAw5w/7G8RxCvKu3sPdPfozPoJahagXHxRTU6kQ3Lsu6s8diIA20Qbbybh6DwN7LsHz7/0JnYnIfKckPh544gnrnK8gsEpJffpIb5f9CQfwntJGKOqAHxRbeN2iky5cAD79lNW9nD6dqbtIXbWjglGnTlXs2/c8vvjiUXga0Ec+cOA6Wracj/nzj4PEStrJzBdf9MSYMS309qcfTMCt9WcUsIjj0BAhaeFRg2IcwX3qwSMyoMw+tyBvxL7XAzXf7gLXqvpVlHSFGiybtQ+1OizFuasyF6i3F/n5bO02Lc3ycwWBRVVPmCC9XcoxkYhqKGmA0iPgLwCIr02l0wGvvgrklaqEc+EC0K0bMH48cM98TdjKikqlwltvtceRI2PQqpW+FF1mZiHGjduGfv1W4caNDAUsLIsgCPjhh74YNqyx3mc3V55A2nYrAkc4FZb0v64h54L+2q6LrwfCn2lu9Lwq7Wui/tyBqNLB8HP42t/X0aLVfHy+zGkUn4yzfDlw9Kjl56nVwLffspziioUHFC51q5gDJqJuAAZadNJPPxkOl9fpgB9/ZPqlGzZIY2AFpXHjajh4cDQ++qgz3AzUxt2x4wqaNZuPlSsNBELZGbVahUWLBmDgwDi9z5IW/oN7++IVsIrjaOgKNUheeszgZ+HDmkHtbTqgysXXHTUndUXMax2h9tI/tig9D++O+gX9x++C1pmnpEeONF5+0BhqNfDzzxVt5Fuap4ioi1KdK+KAiUgN4GuLTrp5E/jgA9PHJCcDgwezLTnZegMrOO7uLpg2rSsOHhyNhg31gynu38/Hc89txNChG3DnjqIxCnBzU2PlykHo2TO2zH7S6ZA47yDSD19TyDKOo3B70zkUpeXq7feMroKgnnVFt1O1W23EzekPn3r69wTpdNj649+o02k5rt/U78spcHMD1qwBWrcWd3yJ8x05UlazHICvHvgku6PUCHgsAMtU0d98U/wU84YNQJMmbFSs01luXSWhdesIHD36It58s63BKOi1a8+hWbP5+PXXiwpY9xAvL1esWzcYHTqUDSQjLeHalweQdZK/bFVWitJycWuj4dmaqDFtIVhYmtI9zA91ZvRB2NPNIBi4JxL+SkCjNj9hy4GbVtmrOF5erBZwbKzp4yqP8wWApgBGK9Gx3R3wA71nEbWzSvHrr6yShyXcv8/Whbt1sy7RvJLg5eWGL7/sjd9/fw61agXqfZ6Sko1Bg9Zi5MhfkZ6uXMS5v78HNm8eiubNy8oGkkaHq5/tQ7aR3E5Oxebm8mPQFeqrWAW0qQ7fRtZJTApqNcKfaYY6H/c2GKCVczMDg3ovxjtfnbCqfcWJiGBlCU2lEs2YUVmcbwkzHqTE2hUlRsBvAggWfXR6OvC6ZYHSZThwgEVKf/IJi5zmGKRbt5o4ceIljB3bwpBgEJYuPYPmzRdg927zEn9yERjoiZ07h6FevbIlCHWFGlz9dDdyLzlcuU+OjORcvI37B/WXIARXNSJHi5xmNYFPg1DUm90PvvX1syS1BRp8/tZW9HphJ7RaJ5xla9CAVU7y99f/bPBg4J137G+TsgTD0owcCbCrAyaiQDAHLJ6FC4Ek45VNRJGfD3z0EVv7OHTItrZMceIE8O+/8rUvM35+7pg//3Fs2vQMIiP1b8zr19PRu/dyvP76TmRnK/MyExLig927h6NmzbKjdW1eMeJn7EHeNR4JXykwkXZUrX8DuFfzlaQbt6reqP1xL4T0NaCxTsDvi46iSZ81yMjWF/9weFq1YprRbqUCz0JD2dSzobfwis9EIrKr1J69R8CTAFg2zJ84EZg3D6giwe/l7FlWQuu116xLRDdFSTmvNm2AqVOderTdv39dnDo11mAKkE5H+Oabo2jd+iccPJiogHVAZKQ/fv/9OURFlX1J0GQV4Or0PShITlfELo79uLs3Hnnxd/X2u1bxQtjgJpL2JbioETWmLWJe6wSVh34e/fndlxHXYQmuJDlMlTvx9O0LLFr00OFOnsyqKlVOAgCIqGAhHXZzwEQUAuA1i09UqYCXXwbOnAEGDbLdEI2G5bQ1bcrWQaTis8+Yg8/PB6ZNY9Pef/4pXft2JijIGytWDMLq1U8hOFh/Hey//+6iW7eleP/9vSgosH8lmdjYQOzYMQxhYWVHOkX3chH/yV4Upikbvc2RD21eMVJWHjf4WcTwFlB5uMrSb9VutVB3Rh+4h+iPrm+dvYmW7Rdi//HbsvQtK8OGsUGDjw8wZozS1ijN60QUZP4wabDnCPgdAPpPcrFERQG//AKsXcuCCGzl+nVg4EDg2WeBlBTb2vr3X2DWrLL7zp1jAWCvvMLWsZ2UoUMb4uTJsWjTQV+2T6PRYebMg2jffiFOnky1u20NG4Zg8+ahepWfCm9nIX7aLhRnOGm6CMckt9afRrGBgEDv2sGo2rWWrH17xQaj7qx+8K6tH8aSlZSB3j2XYPFWJ6yq9NFHzAl7VZwqalbiC+Bte3VmFwdMROEAXpaksSFD2Gh47Fg2OraV1atZytLChQbXk8yi07ERekGB/mdaLZs+b9aMRXI7KX+eT8fJs8YDnE6eTMUjj/yMTz89iOJirR0tA1q1isDGjU/D17esgEJBcibip+2GNtd5lwI4+hSmZOL2NgNZDYKAqBfb2mXt0jXQE7U/6QV/A1rSRen5GPP0Wny79pLsdkjOW28pbYGj8AoRVbNHR/YaAb8HwFOy1qpWBebPB37/HYjTV0mymLt3gRdfBHr2ZFWWLGHePPOBXYmJbPp8/nzrbVSIBRuv4PknV6I4y8ALRikKC7X44IO96NhxMS5e1F+bk5OOHatjw4YhespeedfuI/7j3w1Wx+E4J8lLj4MMvOQFdqoJ77rikytsRe3hhlrvdkNIP/3gLG1+Ed54fh0+Xei8AZmVHC/YqVCD7A6YiKIByLOw0L07cPw48P77ZSP5rGXPHqBFCzadXCzioZ2YyCoyiSEqio3enYgvV13Ay8PWQZNb7nchAH5Nww0GpBw9moxWrebj66+P2rWSTM+etbBu3WC4uJT9SudcSsPVmXugK7TvyJwjPVmnbyLjqH7gn8rDFZEjWtrfIJUKUS+2RdQLbSCoyo68dYVafDhuIz749qT97eJIwUtEJMFap2nsMQL+AJYUXLAULy+WNH7kCNC2re3t5eYC773H2vrnH9PHvvKK+Gjqr76SJpLbTkz/+SzeHvULtAVlna+gElB9XDvUntobcZ8/blC2Lze3GG+8sRO9ei1HQoL91r8HDKiHJUsG6ql6Zf+bioTP90JXbP9gMY40kFaH5EWG78fQQY0MCmbYi5DHG6DGW10glHv5Iw1h5pvb8PpsKwogcJTGA8D7cnciqwMmopoARsnZx//TrBlw8CAwZ440YfQnTwLt27N1kWwD6QUrV7JEdjE89RTw5JO222Qn3v/2OD4a/yt0RWVHjYJaQMxrHRHUi037e0RVQZ0ZfRD+bHMIrvpSqnv2JKBFi/n46acTditzOGxYY8yb9xiEcmuBmceTcf3rgyAtHwk7I2m//Yf8G/ovc24hPqg2sJECFpWlSvsaiJ3cHSr3srNCpNXhm8m/YfT/DipkGccGXiSiGDk7kHsE/C4AeXICDOHiwvKGT50CHnvM9vY0GuDLL4HmzYGdOx/uv31bfGmuwEBWxNpJmPrjacyauB2kKeswBVcVakzqisAuZaNMBbUaYUOaot6svvCqoS9lmZFRgLFjt2LAgDVIScmS1fYSXnqpJT7//FG9/emHriHx+8NcH9zJ0GQXIHXNaYOfRT7fCioDVb2UwL9lFGq93wNqr3JLM0RYPGMfxk8/rIxhHGtxg8x5wbI54Ae5VMPlat8kNWsC27cDS5ea1jsVS3w8S1gfMQK4cwd4+23glkjt4RkzpEmbsgNfLD+PT17bqud8Ve5qxL7bHVXaxRg91ys2CHVn90Pok40Nithv3XoJzZsvwNq19qmr+tZbj2Dq1C56++/tvYKkhWaWFjgOReqaU9Bk6wcB+jYIQ5X2itZT18O3SThq/a8nXHzKrboRYf6UPXjnK8P5yxyHZRQRVZWrcTlHwOMgZeSzNYwYwXJ0hw+3PT2BiBW0rl8fWLFC3DmdO7N0KSfg+/WX8e6YX6ErF2Gq9nJFrf/1hH/LKLNtqFxdEDG8Jep83AseEfrLALdv52Do0PV47rlfkGagfJzUTJnSBRMnttPbf2f7BaSs4A9CZyD/RjrSftPPTBBUKkS+2EYBi8zjExeK2tN6wTXAo8x+0unwxTs7MG3BGYUs41iBD4DxcjUuiwMmIk8oIGxtkJAQYNkyNiI2V4JLDPfuicsX9vAAvvtOmlxlmVm2IwGvj9qgV1VG5e6C2Pd7wLehZVVlfBqEod4XAxDcJw4w8N6zcuW/aNbsR2zdetkWs0XxxRc9MXZsC739qRvOGi1jx3Eckhf9AzJQ7KBqj9oGlzwcBa/YINSa0gsufuWcsEaHj1/dii9X8gptTsTLRCRBmo0+cnmH5wDYTc5LFH36sLXhiRPZWrHcvPce0NCyksdK8Ov+JLw4dB00uUVl9qvcXBD7bneLnW8Jak9XRL/UDrU/6gW3YB+9z2/ezEb//qswbtw2ZGaazjG2BUEQ8P33fTFsmH6gzs3lx5G2Q9laxxzjZBxNRNZp/bq7am83RDzXXAGLLMOrRtUHa8Jlw2B0RRq8/cJGzN94RSHLOBYSBmCEHA1L7oCJSADwhtTtSoKvL4uS/usvFlglF40aOUU5r+MX7uHZwatRXG59TXARUGNiZ/g1t33t2q9ZBOK+HGBUInD+/ONo2fIn7NunX1ZOKtRqFRYtGognnign2kJA0s9HcW+//CNxjmVQsRbJSw0vE4QNaQoXP2VXt8TiXS8Ese/30IuO1hVq8Mrw9diyX/8Fg+OQvPnAt0mKHCPg/gAM1O5yIFq3Bv7+G/j0U+m1T9Vq4Pvv2RS0A3PjVi56PL4KBffyyuwXVAJiXuuMgLbVJevLxdcdMa93Qs13usK1iv6DMz7+Hnr2XI433vgNueVG4lLh5qbGihWD0LNn2WUI0umQOO8vpB+W7wWAYzm3t55HYYp+jr1HpL9B9SlHxrdhGGLf7a4Xra3JK8Kzw9bizOUMhSzjWEB9AL2lblQOB+yYo9/yuLmxaeITJ5iillSMGwd06CBdezKQnlWEtr1WITOhXO1cQUD0+EcQ2KmmLP1WeaQG4r4aYNC5a7U6fP31EbRu/ROOHk2WpX8vL1esXz8EHTqU7Z80hGtf/Ymsk3w04ggUp+fj1gbDgUqRI1sbjLJ3dPyaR6DGRH2xjtzULPQYuBp30uV58eRIiuTTmpJ+k4moOYAuUrYpO/XqAbt3AwsWMI1pW6heHZg+XRq7ZEKnI3Qfthmp2dOl9wAAIABJREFUZ/WdTfgzzRD0aF1Z+3cN8ELs5O6o/moHuPjoxzVcuJCGjh0XY8qUP1BYKL1ylZ+fOzZvHormzcuubVOxFlc/24Oc8yLTyziycXPFCYP63f7NI0VF4zsqAW2ro/rLHfQCE+9evI3WfVYiv4CLxDg4XYiomZQNSv0q+a7E7dkHQWB1MM+csU2vee5cICBAOrtkYPBbe3Fqm34ublDPuggb0tRudgR1r4O4rwbAr3mk3mfFxVp8/PEfaN9+Ec6ckd4hBgZ6YufOYahXr2ycoK5Qi/gZe5B7xb7FJDgPyYu/i3v79IOTBLUKkaMdM+3IEqp2q4XQwU309iceTUSPkVsVsIhjIZKWKpTMAT8oujBIqvYUISKC1RveuJGNZi1hyBBWX9iBeWfuMWz8+i+9/QGtohA9Tj9fVm7cgn1R+3+PInpsO6g99SPTT5xIQdu2P2PWrIPQaKRVrwoJ8cGePSMQG1s2lUWbV4T4T35H3rX7kvbHEQERkhYeNZjmF/xYHDwi/RUwSnoihjZDlQ76AiKH157G8+//qYBFHAsYTESSTcNIFtVFRFMBTJGqPcVJTwc+/BD48Ufz0oVBQcDp0w6tePXr/iQMfmyZXnEF71pBqP1xb6i9ZElzE01BcgYS5x1GzkXDI96OHavjp5/6o25daUVprl69j27dluLGjbIBP25VvVF7Wi94RJab0SBC0b1cFN3JQfG9PBSm5aDobi6K0nJQnJYLTU4h3AK94FLFC65VveAe4gOXAC+4BXnDLYj9FFxsk06Mn74bmceTyuzziauGujP72tSu0tz/MwHXvvxDb7+Lnyca/vAk1N7KfkelhDQ6XPl4F7LPppbZL7gImLfqWYwfXFshyzgimCoIwjQpGpLEARORGsB1APrzic7On38CL78MnDchoTh/vkMrXl1PyUGjVj8hp1xUqVugN+rM7AP3ahIUr5ACnQ63N59DyuqT0BXpv/T4+rpj1qweGDeuJVQq6TICzp27jZ49VyA1tWzRDddAT1RpHwtdQdH/O9miu7nQFVi/Ni2oVXCt4gm3IG94xgahSpsolmttgWBLRXTAukINzr/yC4oMKKRFj3sEwb3rKWCVvGhzC3HpvR16RSY8qnrh8F8volldxxUaqeQkAYgRBMHmaTmpHHBfACJLAzkhBQXAzJnA7Nns36Xp1o3VEbZV6lImNFodandchut/Xy+zX+XhinozH4NnDdlkTq0m/9o9XP/uEPKu3jP4ea9etfDjj30REyNdecdjx1Lw2GMrcPdunvmDJca1iif8W0UhoE0M/JqEmR0hV0QHnLLqJFLX6Rdc8KoRiHpz+kNwAkU5ayhMycJ/k7dDk5VfZn+1hmG4/Pdo+PnYr5YNxyL6CoKww9ZGpPpWj5GoHcfEwwOYNo3VHG7f/uF+Ly8mN+mgzhcABkzYred8AaD6+HYO6XwBwLNGVdSd1RdhTzWBoNb/3e7aFY/mzRdg6VLDFXKsoVWrcGzc+DR8DERmy01xej7u/n4Z8Z/8jrOj1uDa138i40gidIX6kcAVkaK0XNzefM7gZ5Gj21RY5wsA7uF+iHm1vd413j6Xit6jK+6YpgLwghSN2PzNJqJwAM776m0JTZqwKelvvmHRzu+/D8TFmT9PIWYu+Rc7f9IvBh7Srz4COxtWpnIUVK4uCH+uBep+2heeUfqR5enp+Rg5chMGD16PW7cM1Gu2go4dq2PjxqFws6i8nQqsapkXAD8AAQB8weqQuMLSW0yTXYj7++NxddZenB21Bonf/4WiO9Jcn6OSvOQfPR1yAKjySAx8G1knhepM+LeKRtjT+hkIf68/gzc+45W7HJT+RBRqayM2D92I6H0AM2xtx+lITATCwwFXx5wiOnr+Ljq2W4Di7LIJ/r5xoaj1SU+o7KGHLRHagmKkrDiBO9svAAbqYISF+eCbbx7DU09Jo5C0adN/GDJkPYqLy+dlugLwf/DT5cGmhunbiABoAWgebCX/LgSQB4MXVA6VhytCHq+P0IENofZ2r1BT0DkXbuHSBzv1Ip9VbmrU/3YQ3Kv5KmSZnSHC1Vn7kHE0scxutYcLNu9+AX07VPwXESfkPUEQZtnSgE0jYCJSAXjRljaclurVHdb5FhXrMOi5X/Wcr1tVL9R4u6tTOV8AUHu4IurFtqg9tZfBgLHU1BwMHrwOw4dvxP37+QZasIyBA+th8eIBUOspLhUDyAcb7XqAOWBz77DCg+M8wCqb+QOoCiAcQA0A1R7sN34r6gqKcWv9GZx/ZSPu7LgA6ERU43IGTKQdVRvQqPI4XwAQBFR/pSM8IsqmWmkLNBgxeiMysyvHcoST8YKt+tA2nUxEPQDstqUNjvQMnrgXG746WGaf4KJCnY97w6e+zbMmiqLNLULy4n9wd+9lg4PH6Gh/LFjwOHr1sn2KfcGC4xg3bjtIz0H4ApD696gFc+7ZD34aV0VSebpCl1/2gVx6BKzJykfRvXwUp+dBk56Horu5KM7MhyazEKTRQptXDEEQABB0WoI2rwiCSgAIIK0WunwNi2sgsOMLS/5PoGLN/0eoqzxc4RboCRd/T7gEeMI10BOufuyn2s8DblW84OLvAbeqXgYDy+7uvozEeYf09rtW9UbDeYOg8nDMF1w5yU+8j0uTt0GbX3ZKvstzzbF/eX+FrOKYoLsgCPusPdlWB7wOwGBb2uBIy+pd1zGs3zJQOeGKiOEtEfpkY4Wskp6Mo4m4Mf8Iiu/rp60IgoCXX26FTz/tDj8/d5v6+fLLv/HWW7sMfOIHIBjyyKnrAOQASAcgTiNY7eUK1ypeKL6fB22+Y42WBLUAF38veNWuCr9G4fBtFAa3YB+cf3kDijP0ZyxiXu9ktHpWZeDu7ktInFdWMEdQqfDV8iF4/dmKl47l5KwWBOFZa0+22gETUTCAZLAIFI4DcOtuAeo2/xFZSWWrq/g2DEOdj3tZlGvqDGgy8nHj5yNIP2S4klGdOkGYP78funSJsamfadP+wNSpfxj4JADMCcsFgY2I74GtG1cc1N6u0Obqvyh41w1GvVn9HDqzwB5c/WwfMv6+XmafR7A3zhx/CXWiHSRv39lISAAOHGCBtFevAhkZQH4+EBUF1KrFivL07w94WlTqshBAhCAIhnMmzWCLA54IYI6153Okp/WTv+DYxn/L7HPx9UDcl/3hFuyjkFXyknU2BQkz9+hN2ZWgUgmYNOkRTJ3aBZ6e1k9pTpr0O+bMOWzgk0CwNV050QLIBBsRSyvJ6WhEvdgaQY/GQeVum1qYs6PJLMDFSZv1hEnqdKmFS/ufU8gqJyQvD1i1CliyhNWBN0dwMPDGG8Dbb1sS4/O6IAjfWGOeLQ74HwCtRB18+jSrElS9OhAdzX5GRQE1agCBXO1FCj5bch6TR6/XWxet8VYXBHaUp7yg0tzdfRk3FhwGFZt3Sk2bhmLBgsfRqpV1cqFEhHHjtmHBghMGPg0CIJ0oiHGKwZywfp1c06jxMGK7JGqbHvwsmRWhB/8ueSSU/kml2in9f0LZyO7SP61H5eEC3/qhCOxUEwFtY6DycK6gQanIOp2M+I93g8oF3b0xuw++etv5C1PIzoYNwOTJbLRrKa1bAytWALVFSYIeEQTBKjF9qxwwEdUEIP6qJk0C5hgZLIeEMGccHc22GjXY/2Ni2M9gOaf4KgYpaQWo0/h75N7KKrO/ardaiHmtk0JWyYhOh5srTuDWr/8ayeIp7SQe4u6uxvvvd8TkyR0tzPVlaLU6jBy5GStWlK9VK4A5YXtVwioCcBcsWEsNlhalLvdvl1I/7b30YCj1qvCBvZbVvXXxc0dgx1gE9ajtsMIxcpK89Bhu/1p2VsvN3xNnT7+MujGVKErcEnJzgfHjgeXLbWsnJgbYv5/9NA2BSVPesLQLax3wZAAzRR2s1QI1awI3LLaNERT0cMRcMnqOiXm4LyTEunYrEB2f2YRDa8qqQrmH+SNuTj+ovWwLQnI0tAXFSPzmINIPXzfwqStYdLIawG2wB74+rVtHYOHCAWjY0PLvTlGRFk8/vR6bNv1X7hMBQAhYcJa9KBnFOhNFYH+XPJiL9i6Pd+1gBD1aB1Xax0DtXbG+18bQFWtwafJ2PVnWRr3r4ezOoQpZ5cBkZgK9ezPVQimoVQs4fhzwN1uJa5IgCBYvyVrrgE8CEFeYeN8+trgtF4GBD6e2S7aYGLZFRgKhzp12Y44lW69i9MCVoNIVmwSg9ke94NfMcaszWUPxvTxc/Wwvci+nGfjUAyy3tmRkqwObqjVc29fLyxXTp3fDa6+1MZDva5q8vGIMGrQWu3bFG/g0FCxNiWMeAlDwYCtxyOZznNVeLghoVwNBPerAJ66avCY6AHnxafjv3e0gbdl7fObCwZg8qoFyhjkaRUXM+e7fL227EyYwyWHTHBMEobWlTVvsgImoNoDLok8YP56V9FOKgADmoMuvP5eMpJ3YQWfnahDV+AdkJpR9O67avTZiXu2okFXyoMkuxKV3t6EgxdD6py/Y6NOQIy0EkAZjo+Fu3Wpg/vzHUauWZbEIWVmF6Nt3FQ4dSiz3iQpAGJhYB8cydGCOOA8sDcv86Ngzugqqdq+DwM414RpgUfSqU3Fz2XHc2ni2zD6vUH9cOTse4cEeClklI0VFwK5dzJk2aQI8/7z5cz77jK35So1azQK42phdd48VBCHBkqatccAfAvhE1MGFhczZpRkasTgIfn4PHXTJFhX1cB3agWv8DnhlN7aUyxd0DfRE/blPwMWvAt2UREj4fL+RaefAB5s5Och0/B975x0eRZ3/8ddseoWEEEpI6L33IghKLzaaBfUneGIBsevdqWe9s5wFQREFG6IiCoKKoCLKqaCigPQiLQktgSSk153fHx9ispPZ3dnN7mYT5/U8+ySZmZ39Jtmd93w6ZKBnYdWrJ2MOb765z/kGFcbIyChg5MglbN16UrNHARKQftAm7mEF8oBsjFjGluAA6vVLIm54O6K7uzbesTZgLSpl712rKDxhm+cx5Jpe/O+9OtSg48ABeOsteOcdOHn+czVgAGze7Ph5Z8+Kuzgry/Fx7jJxIqxY4ewol1tTuiPAO4Cuhg7+7DOpq6rNfPkljBpV06uowidfHWbyhKVYNRnAre4ZRkwdy3pO+3w3KYu1QyUUpAbXaWymEoVAGmIVV2X8+LYsXDiBZs2MnzM9PY+hQ99m717tTaYFEeE6dCNUY5QgQpyNkXrokEZRNBzbgbgxHQioQ920cnac4MAj62zuRZQAC/Penszsaz3TB73GSE0V63XZMskbqozFAn/8IQm69nj2WXjgAe+tLzgY9u1zvAbYqihKb1dO69JtoqqqHTEqvgAffeTK6f2PZs1gxIiaXoUu11+7sor41u+fVOfEN+9AOseX/KrZqiBuXlfEF0QMmyDJWlVZs+YgPXu+xvvv79Tdr0fDhhF8/fV1Oi5sK3ASe2Jv4gpBSK11c+T/F+Hw6KLTOaS+vYU9t6/kzDf7wVo3aqejujUlbkQ7m21qmZV7bl2l10679jB/PnTtCu+9V1V8Qf5/n3zi+BxvveXea0dHG6v3LS6GDz5wdlSv8yFaw7jqp5lq+MjcXFi92v5+RYG+feGhh2DKFP+MxU6e7JeurDsf/Z7c9FybbZaQABL/NqCGVuQdSnOLODp3I9Zi7YeyPs4uwjpnQzpKJSMWlT7x8RGoqpQcGSUhIZp1664lKUl7Q1AKnMDV0hsTe1iQwRXlgyxisXczBTJn+Nj8H9l3/+ec25rqmyV6mYTr+xIYZZsBXpxbzKQba+HsYKsV7rgD5sxx7jpeudL+vl9+EevUKIGB8I9/wP798rqZmbB4seQLOWKDoZbPVxpfiIsuaFVV9wDGBuB+8AFcY6BFZmysDLu/9VbYsaOiVdgPP9R87HjTJhjoVn2118gvKCM65ilpkK8hulczEqf3I1Rnfm5t5PB/N5D541HN1jDEtWv0rVsGZJ1/2BfV9u3j+Oc/h3DNNV0JDHTvpmvXrjRGj36XEye083sDgWY4EguT6pCPtOzMwVGsuF6/RBKu6U1Yi9rZ/Kc4PY+UN34i6ydt4p/02049fi9NG7l6Y1qD3HCDxHqNYLHAkSOSSKvlvvvgueeMv+5//yu9KbS8/TZMn27/eeHhoknhDhMsdyqKYrjpvmEBVlW1M7DL6PFMnOjcbVCZgQPFFdH7vAu9rEw6aH37LXz/vQhyRobx81WXtm0lIcDPGHLpcn74bI/d/UqAhbhR7UmY1ouAyNpbK5m2Zg8pi7S1fAFAEiJozjAmvO3aNeAf/xjCtGldCQqqfvvDLVtOMHbsUs6ezdfsCUYsN1OEvUcZIsIZ2MugVgIsNLi4DU2v6UVQTO3IVLcWlnBqxU5Or96Ftdh+DLzjgCT2bJ7hw5VVg1degdmzXXvO3LliMWtp3974tXrcOFizRn+fqoonNi3N/vO//x4GD3b2Kh0URdlvZDmuCLDx5htnzkgWcWGh0dMLgYFw++3wyCNVC59LS6UgutxC3rTJexlvAA8+KO0z/YijJ/Jo02auoWk3gdGhNL26J3Gj2qO4WOda0+QfOsP+f6zRuJ7L477O7vDLhfccjspY2rZtwD/+MZhp07q51RXLET/8kMzYsUvJzdW6nkMQ6/2v3efY+1iRrHf7N1+W0CAaXdaZRld0ISDUT+fJqCoZPxwm9c0tlGRqb+iqogRa+GXHbPp09HMLPytLMpbPuji/YOhQ+O4722179kBnF2qhN26ECx10B2zVSixte3zwAVzltAGK4aYcrlyZRxs+Mi8Purkx+q60FF58UZ6rTeAKDJR09AcekDuYtDQR4iefhNGjIdLDwwam+N+UxRse2GB41FxpdiHJr21mz52ryNmpLZPxb05+9LsbcV8rYvkcw5EF1KpVLIsWXcquXbcxfXpPj4svwODBSaxceSUhVQYKFCEx4bqRFOS/WJCkrSSkM1lVO8NaWMLJD7ez5/aVpK/bh6qX/FOD5O1PZ9/fP+fI8xsNiS+AWmrlpvvXe3llHmDRItfFF8QLmqqJ5X/twjj6gQMdi++mTY7FFxxbxxWMMbokQwKsqmo94AKjJ6V5c/llXnoJYtxoUp+cDFOnwiWXSPq5HkFBMGSIWKrr1rkn+Pbo0UOKv/2I7Qcy+P4j2x7EikUhOM6xRViYksWBh9dy6OlvKDqZ7fBYf6DoZA7ntqRotoZif+JQGSK4R5EkK/0LacuWMSxcOIG9e2fxt7/18orwVmbkyNYsWzZFx61diGRH1+a01dpCENAISMReTXZxej7JCzex797PyN523JeL06UkM5+j839g398/J2+/4xyYoNhwlCDbS/jva/eybvMpby6x+qxa5d7zkpKq6sHatcaf76gk9sABY80+ig0lVA5RVdWQRWjUAr4IV4NXAQGS3bZzpyRjuTPf8/PPoWdPeOopaephj02b5GGEK64QcQ124HaaPNm1dfqA2x7eiFWTeNVgeFu6LJxCs+n9CIhw7EbL+ukYu29fyfGlv2Et9K+B7ZVJW7vbtuUeIPW+2vdPuZsxGUfC27x5fV55ZTx79szi5pv7eF14K3P55R14++3LdVpd5iMibFrCvqHc9d8Ee+PL849kcPDxLzmx9NcaKVtSS8o4+dF2dt26grPfHMBRXZElOJAmU3rQ5dXJNL7ctipULVO55xFD2bo1g9UquT1GCQqCSZPEyDp0CIYNq9iXkyMuZaOM0TFM09Ph6aely5U9Y68yTZsaeaUQYJiRAw2poqqqi4C/GTnWLl99JQF0V9LFK9O1K8ybZ/sPKGfGDGN1YJ07w67zeWT5+bB7N/z+u2zbuVOysM+elbuhNm3cW6cX2LQjnSF9FmItqRAZS3AAnV+Z9Oec39LsQo4v2cKZb/5w+OEFCIoJp+m03sQNb+NXg89Ls4vYOXO55gYhDMkgLseKNGSw72YGSEqqxwMPXMD06T2rNQfYE7z++q/ccssa1Cr/lyjEQvOf/0HdR6VitrJ+QlO9vkm0vPNCpze1niLrp2OkvrPFkIcqdkhrEq7vQ3BD8XyV5hSx+7aPKc2pMFAUi4UVX0/niosTvbZmt0lOFg+pEaZNg3//2/7xrjR6at3aVmAzMiR7+sMPJWRqlO++k1i0c15VFOU2ZwcZFeBjSEClehQUSMeSZ56R713FYpHU9aefrhhTmJYmLSONnO+xx+Bf/3J8THKyfqp7DdJ34sf8+oltAnr8hE66db/5h8+S+ubP5Oxy7oaKaBdP4o39iWjvHyMfT63YwfF3tU03miC1n+XCm4WjOt5mzepx//2D+NvfetW48FbmxRc3c/fdX+rsqYeMMqxdiXK1n3IPSiZ64YCw5jG0uu8iQpt5r6SvIDmTlNc3G/qshrdqQLMZ/YnqUrVfwsmPf+fEUts51W2HtuXAd9M8tlaP8dtv0KeP8+P+8x+p1XXE9OlSOmSEW2+FBQsqfi4tlev8SRfyYxo0kBh0qKHudkcURXHaFcnpp15V1a54QnwBwsIkw3n7dhg71vXnW63w5ptiyS5eLD+/8YYx8VUUiSs7w8/Ed+Ovp/lNU3ZkCQ2i8RX6Me/wVg1o9+Q4Wt4z9M+7ZHvkHUirSPQ468JdoBewFpeRvnavZmsQMtQgC3E1p2NPfJs2jWLu3DHs3z+b22/v71fiC3DXXQN57LGLdPacQ1zoJr6lPFGrOXrJfQXHMtn/jzVke6GBR3mC5N67VjsV38DoUJrPHkLH5y/VFV+A+LEdqwyiOPi/g3z4VdV64RrHiHj16OF8qEJhIXz6qfHX1SZfBQZKONIVLrnEqPgCtFRVtYOzg5xawKqq3gO4UOXsAsuWiRtAm9lmlKFD4dgxOHrU+bGDBslEi1pGjwkf8vsaW2FqdEVXmv1fX6fPtRaXcnr1Lk59vKNK/FiLJTSIxpO60uiyLliCjdTZepazGw5ydN73mq1RSNKSfYu3adMo7rlnIDNn9iEy0vsuw3PnCrnqqhUcOKA/5tARigJHjmRhteqFCGKxn2hm4l1U5CYoC601rAQoJFzXl0aXd6n+q5RZSV+3nxPv/0ZZnuNkHiXQQvz4TjSZ2sOQK/zUyt85vsTWCm45qCWHfzSQWORLzpyp8F7aY+pUcQ074sUX4e67jb1mQIBojLbb4tdfG+/zHxICP//sanLunYqivOToACMCvAFJwvIOmZnw6KPiHih13mjdbV56SZLCahE/7Ejjwt4LUUsrkkICwoPpvGCSS6PXitPzOL7kVzJ+OOw0PhzcMIJm0/sTM6iFu8t2i733fUr+QeOi1qSJCO/NN/tGeCtz9GgmF130DkePeroOPQ5wo2rAxEPkAKfRc0k3uKgNSbcMxBLinmcle2sqKW/9QmGK8/dMdK9mJN00gJAm0YbPX1ZYzO7bVlKSUalkSVFY8fUMJg73s1hw/fpwTm+s6HmcTT9KTxcvqNFOifbOV1oq/SpOGcgaf+QR0SnX+EpRFIfluw5d0OdTqQe5+qouERMj4ujNto+BgZJJV8v4+7832YgvQMNxHVyeexrcMIKW9wylw9MTCG/t2MoqTs/j8LMbOPDQF+Qf9o1rtPRcoWHxbdQogqefHsH+/bO5555BPhdfgBYtYli//nqaN/d0fPAs4pI2qRmisNcy9Oy3f3DwkS8pPpNbZZ8jik5mc+g/6zn4+FdOxTc0sT5t/zWKtv8a5ZL4AgSEBlfJiEZVefR5P/T6Oesk9csvsG2b/r7sbOnR4Eqb4pEj9bcHBsLllzt//pQp8M9/Gn+9CoaoqurwYu0sBjwcSan2Pn37SqH1yy9LsNuTXHSRX8/11SPlVAE/r9lts80SGkijS40Po9IS0b4hHZ+7lOazhzhtw5ez6xR77/mU5Fc3UZrtYkczFylINtZidMaMXhw4MIcHHhhMVFTNttls3TqWL7+8joSEKA+eVUXi3Npe0ia+IxQR4arXzdx9aex/YA35B51f/Mvyi0l96xd2376SrF+SHR4bEBFMs+n96DT3cqJ7NXN4rCPiRrcjKMZ23bu+3s9Pv7seLvEqzrKIrVbJgN5ZaSqZqsIXX8DFF7tWegQwfrz9fc4E+Lrr4P33HZet2icMuNjRAUYE2HdYLDBrlpQDXXut50pk4uPdy7quQe7574+U5tnGPhsMa0NgdDWFR1GIG9GWLq9OotEVXVEcDR5QVdK/3MeuWz/m9OpdVaxxT1GYaqxByLJlO3n55V8ortIlq2Zo374B69ZdR+PG9mruI5AOXq486iEds7wYjjFxQiDSt7vquMvis3kcenoDxel2LGFV5cz6g+yetdLpZ0axWGg4tiNdXp1Mo8u6VLtlrCUkiLgR7W2XU6ry4FztLO0axsiI1717pQdE795iMcfGipD+9pvz51amc2ep8bXH8OH6k/iaNIGlS2HJErGU3cehADtUOFVVtwM11xJq/Xq4806p160uiYky+nDGjOr+Qb3OuZxSGreaS2Eld5cSYKHTvCsITXB1Bq5jik5mk/rOFt0JK1pCm9UjcUb/at2lA1hLSlGLyijLLyYgMoTjS38j/YvKiWaBSL9k/eYrffo05dVXJ9Cnj6GieK/z+++nGT36XU6f1l6UzSlItZ9ziFfCNi4c0S6Odk+Mx1Kp3Wju3tOkLPrJUOgmqktjms3oT3grz3r7SjIL2HXrR1gLK27gAiOCObj/Tlok+NHwif79xdXsbR5/HB5+2PExt94KCxfK982bi0bMmuUpT+yviqLYzZi1K8CqqsYAZ6jpAsWiIhkf9fTTrhVM26NjRwmoT53qV00oKnPvC1t4/h7biR31BzSn9d+955DI3n6clDd+NpwkkjijP6HNjN0MlGQVkLf3NHkH0sndm0b+4bMOp7pI3W8jHDXUDwoK4P77L+DBB4f4RcnRb7+dYNSod8nI0HpagpAuTDW/RhN3yQdOoW38EjusDS3vvNC1JMf4SBJn9Kf+AIPNKNwgeeHFSiWjAAAgAElEQVQm0tfZNjy66r6hfPCs93JpXWbxYrjpJu++RmSk9HaOi3N83HffSXnrxIkwYYKnDbQyIFZRFF03nyMBvhRY7cmVVIs//hBr2N4oKVfp108ac+i1J6thGrR9mYw/bOM27Z4YS1TXJl59XbXMypmv9nPi/W2U5jiO+zoqkyjLLyFr0xFy96eRty+NgtQsF1sfxyAZwSBlSOnnv1alU6eGLFw4gSFDvHdBM8pPP6Uyfvx7OiIcjIiwf3teTBxRABxH+0aO7p5A7t7TTm4ofVvmV5icye47VtncDITFR5ORfCehIX7S8CUvD9q1gxMnvPcad90FL7zgvfMbZ6yiKOv0djgS4P8COlOLa5iPPpLa4WMeKjIfMQLefVc/DlADLP7kD26auNRmW2SHeNo/PcFnayjNLuTEB9s489V+nb7MtgRGh9J0Wi8ajmoPisK531JIeW0zRWmuZYva0giZYlOZTKT9ZNX1WCwKc+YM4LHHhhFd3Rh5NbE/itCcB1z7OQcYmoZTgaIQe2Ermt3Q16fzhw8/s4HMzUdttj26cCKP3OzBoTXVZflyuPJK75y7bVsZXxvtWja5l3haURTdtl6OBPgXwHm3h5ogJ0es1/nzjU6nsE/DhpCSIoXWfkDvyz5i66e2Me9W915EzOCWPl9LYUoWyYt+ImeH87vUsOYxBMVFkr01xQODfhKRbFQtxcgFUD+hrlWrGBYsmMDo0a2ru4BqsWHDES6/fBk5OdoYtmkJ137SMFoqFtG+IYkzBtRIq9fsHSc4+C9bo6vlBS05/IOfNeaYNAlWrvTsORMTZfZAB6eNqHzFj4qi6NZe6QqwqqrhyLvMv68U27bJgIfvtR2UXOCWW+DVVz23pmqQfCKfVm1etJn5GxQTSpfXp2IJqrl/hSvN4h0TgFS1hZ7/qiIWrXL++/IYW33spx6U94Q+i541rCgKN97Yk6efHkGDBjWXdPLVV4e4/PIPKCjQuiZDkf7W/v3RMrGHisx0tj+jNygmnITretPgohocdqKq7JnzCQWVcjqUAAs//z6Lvp39qOPamTNSWlS55Kg6DBok2cstfW+wOKAQqKcoShVr0d5Vrge14QrRs6cE0BctklIjd/CWC8QNHn99q434AsQObVOj4guSANZ5/kQSru+DJdQVF2og0twgDrFqWyIWYAMk0SoKKfWIPv819vzDUZzKggh0EtIn2hZVVVm8eCs9eixk5Uptb2nfMWpUaz766ErCwrT/u/J5wGaZUe1EQUIkVT8HigWaTOpOl1cn0eDitjWb5KkosoZKqGVW/r1waw0tyA5xcVLtou3V7Cr168sAhw0b/E18Qe66e+jtsHelqzpmx1+xWOBvf5ORgjfeKD8bpWVLGDLEe2tzkVUf7LDdoEDciHY1sxgNSqCFxhO70eXVScSNMHJxiUREsjGSVBWKZ8fulWcXxyOWtS2pqdlMmvQhV1/9MSdP1kxji/Hj2/Lee5N0ZhAXIlm15jzg2kkg4sWwfT+rVrCWlbl4k+o9Yi9qg0Xz3lu/YiclXqrnd5v4eBHhJ58UIXWFJk1katKuXfLVT0KJOui2ebTngv4I8L+p9Eb4/nu4/XaZ8+uMe++VEic/4L11x7h2rO1M46iujWn3xDi3zqdarZSczaM0u4jiM3mUZhdSklFAybkCSjLyKc0qoCSzALXUSmBUMJbIEAKjwwiMCCYwOpjAqFACIoMJjAwhIDKUwMggghpEEBglsdkTS3/l5Mc7dF45ELF4PdkhyhklSMWcfuJXw4bhvPDCaKZN64ZSA1bJxx/v4eqrP6a0yoUvDLmJ8M9yOBNn5CI3UpWSHhRodc8wYgY7nUTnEw4/9y2ZPxyx2fbsO1O57/pONbQiJ5w5I8lZy5dL/2Ztjk9wsDTnGDJEHqNGudulytcsUxTlau1GewKcgu0U9NpFcTHMmwdPPCG9Q+2xZYux2ZQ+YMDklfy8wlbQWt51IbFD2zh9bllBKbm7T5K97Th5B9IoOVtASXaBxztXKRaF8NZxRHaK58w3BymrkukbjbiXa8plnoMIsb57d8KE9syfP5YWLbw349UeS5fu4IYbVlFWJas8DLGmqlrxJrWBs0h2fgXBDSPoNH8iAX5gCWdvTeXg41/ZbOswvB17119TQytygbIySZA9cUJG2cbGQtOmEFTzf1c3OKooShXfeBUBVlW1MRKkqv0kJ8vIqhUrqu7r3FncFn5AYZGVeo2fozirIrEjMDqMroum2nTaqUzR8XOc236cc1uPk7vrpNNxg96nPuD7bM+qlCIXxRz00rHr1w/lqaeGM3NmHywW31qeb7+9nRkzVqNWadYQjoiwn9RomriAiljBtt6XJlO70/Sa3jWyIhusVnbP+oTCkxWZ2wGhQRw7ejcJjVwb6mJSbZooimIzeknvE+8fJqEnSEqCjz+Gzz6DNhpL0o+SrxZ8tNdGfAFiLmhuI77WojKytx4n5c1f2D17BbtmrSBl0U9k/5biB+IbjP/Msg1EkmSaoJcok5VVyK23rmHEiHfYt8+3TepvuKEHCxaM1xH+fGQMnp/F5kwMoCA3nraX0tOf7qH4tB8M1bBYiBlia3iVFZbw0gceaO9r4io9tRv0BLjKQbWeCRNg+3YZKRUWJglEU6fW9Kr+5L2P9lTZVn9Ac4pOZZO+bh+HnvqG3//vPQ4+/iVpn+6iMNXdkXXlZUDhiLs45vyjHhKzjTi/Pwjj1pj+BajmiUCSwOqhF2n59tuj9OnzGs89t0knNus9brmlD3Pn6nVfy0VqTKtdRG3icwLR3oBaC0s4/r5/ZBzXv6BFlW2rPql6zTHxOlW0Vc8FvQKY6JPl1AR790of0uefr+mVAJCXX0ps0+coPlfRajEwMoTQhGhy97sw8xIQEQxHRDSg0qN8uIGrIqkiLl0rUqNbeP6RT4VQ+Ivr2REFiIVZoru3f/9mvPbaBLp39103tOef38S9936lsycSyRw3E7NqFyqQjDSLOY8CHZ6aQEQHN0skPcjeOz8h/2jmnz9bQgI5cuRukpr40YCGus9HiqLYWH5/DQu4Mh07+o34Arzy0T4b8QUozS1yQXyDERFMAFohrtdYxPKLRJJ8XLFoK6Ocf2651RyLtFNsff5rA/zH9eyIMMQajtHd+/PPqfTvv4jHHvuOwkLfuPPvuWcQ//633nCNXORmwbSEaxcKFf3Lz6NC6ps/y3zbGkY7/MFaVMrzS/SqGEy8iGMX9PkJSH5XxVyXef9DV2MxFsS9Gg+0AJojFmg4vrOalPNrcNY0w5+wIBfIZui1uSwqKuPRR79jwIDF/PRTqk9W9M9/DuGRR/SGk+cg7uiav3CbuELE+UcFuQfSOfvdIYfPKj1XQNHJbPIPnyFn1ynObUmm6Li7YSZ9Yi6oeln//LP9Hn0NE6e0VlXVpj7T5oqtquow4FtfruivSklJGW++tZ1bb12D6vQOORgR2AjEmjPdk9VDRYY7ZKIncoGBFu64YwCPPjqMyEjv1xj+/e/reeaZH3T21ENursz/d+2hBDhGZQ9GcMMIOs27goAweS/l7j1NxsY/yPolmdJzhahlVb0dSoBC/UEtaXxpF8LbOhmnZ5C996wm/1DFrGJLUACHjtzjX3OC6z5DFEX588NuU+Py6KOPjgfc6/xgYpgff0xm1Kh3WfLO7w7mhyrIBbgR4uaNQNzB5sW4+ijIjUwkErOzdTtbrSqbN6ewcuVeOnVqSMuW+q5rTzF8eEtycorZvFlreRchNwgROs8y8U8CkP9ZRVipLL8EtbiMgpQsUl7fxKmPd5D/x1msBaX2Iw2qjBU8s34/efvSCKofSkjj6k32Kc0uJGdnRYWpalUJbxHH8P7eHXNqYsOWxx577NfyH7QW8ALgVp8v6S/Et98e4YorPuTcOXvzdi1IRnIM5ug6X2BF5o6cRe9qaLEozJzZh//852JiYrxXN6mqKrNnf8GCBVt09laej2zi/5QhVnCZswNdIqJtHE2v6kl070S3np9/OIO9d6+y2db7si78uqp2Nj2spcxXFGVO+Q/aAJ6f9ierG3zzzWEuu+wDO+JbPmSgORLfNcXXN1gQgWuO3nAHq1Vl4cItdO++kM8/P+C1VSiKwvz545g5U695QyZyg2BSOwjAG8mJeQfPcPj57yhOz3Pr+eGtYgmJt20Ru/vHo/adcCbewEZjtQLc2YcL+UvxxRcHuPTS98nJ0bZvDEAEoAUS7/P/IVR1kyAkszsevcSylJRzXHLJ+1x33Sekpen3nK4uFovCggXjuf56vcEpGZgiXJuIRqoH7KEgN3wNkbKzJkiCYCLyPoxAL9xUll9C6ju/uL2qqO5NbX4uPJPLig2+STo0AewJsKqq8Zh+Lq/w6af7mDx5Ofn52hKXQORDF4fZC9gfKI+7N8de3HXp0t/p3n0hy5Z5p41pQICFN964lKuv7qqzNwOxhk38n/L3kpYgxDpOQkoH6yMhp/KSwVDkvdcUuTZEoxXizB+PkP37cbdWVa9X0yrblpnZ0L6kiaqqseU//PmfVVV1KPCd06d/9x3ceSc0ayajoJo0gcREaNTIdpsJACtW7GHatBUUFWnjQUHIB8y0eP2XXCAde8MdrriiIy+9NIbERL0LbfUoLi7jmmtWsGKFXseiOOzVNJv4E1bgCBVle5G4Vy5YABynco5CWGJ9Or54GUqg4xv34jO5FJ3Kpjgtn+K0bEpzi0lfuw+10lCQmBYxvPzvi2jQIAJQ6dcvwav5DiYMVhTlR7AV4L8Bi5w+dfFiuOkmx8eEh9uKcmVxbtpU9jVuLMfVYT74YBc33LCS4mJtqUswcodrxnn9nzJEhPX7+jZoEMbTT4/gxht7eXzUYXFxGZMmLefzz/UslIaI9WTi3+RT0ZmuOpwGbCe7Nbu+D40mdgOg6OQ5sn5JpTgth6K0HIrTcik6nYPVjcYywcEB9O2bwNChLRg6tDkXXJBIREStGPnnfTIz4ehRmdJ0/Lg8kpMhNRUeeABGjzZylhsURXkHbAX4KeDvTp/6+OPwyCNurr4SAQEyiDkhQcRYa0U3bSrfx9VOr/iqVXuZMmU5paXaDAdTfGsnjq3hUaNa88or42nTJlZ3v7vk55cwZcpyvvjioGZPeQ9uz1vfJv5IKZJZXXEzHxAeROLNA8n84SjZv6WgWr2TTRUeHsjAgYkMH96KmTN706BBHTWc8vNFSFNTK0T1xAk4dky+P34czjrIw5g3T2bRO+ffiqI8BLYCvByY4vSpt90Gr75q5EU8Q1SUCHHjxiLW5YJdblknJopY+9FQ5qysQjp3XsCJE9pZxKb41m7KkEQo/S5FUVEhPPHExcya1ZfAQM91CMvPL+HSSz/gm28Oa/aYIvzXouYT8Ro3juJf/xrKjTf2JDi4FuWtqGpVq7V81nBKijxOnYLSarSivf9+eOYZI0d+oCjKNWArwNsAvfRLWy6/HFavdneJ3iEoyNbdXe7iLreiGzWC9u0hxFFWoue44451zJv3k2ZrCCK+Zsy39pOPWMPajHZh8OAkFi6cQOfOnmvCn51dxKWXfsDGjUd19jZGEnlM6jZW4Cju1xcHUpF3a0Viyu6dq2PHOJ58cjgTJ3Z0cy0eJi1NrFQ91/Dx4/K1oMC7a7jmGnjvPSNHblEUpR/YCnA2Rj7F/frBFr1mAX7OmjUwzvtNvn777SQDBryucT0HIFmPpvjWHcqQjOQs9Bp4hIUF8uCDF3LffRd4zFI4d66QcePeY9OmFM0eBRHhSI+8jok/k4okZdkjCLnOBCEet/Lvg7Afh7ZSIcil589fgHTzctwmd9So1jz++EX079/M+K/gKjk5Enc9ccJWZMtdxcePwznP9s52iwsvhI0bjRyZpShKDJwXYFVVGyLd352TmCi/eG1j2zbo4dzArw5Wq5ULL3yLH3/UXiDjMd2EdZUC5KOjbw336tWU116bQJ8+Vcs/3CEjo4AxY5ayZYteGUp5/ahJ3aVqMpZcxiORa0wonmtXq1IhxOewl/9gsShMm9aVF18c45n48P79ktBULrSnT1f/nL6gTRs4qM3VsEusoiiZ5QLcB3Bu1hYVSUy2RH+uql9z6pS4or3I4sVbuemmTzVbw5ByI5O6ixWxhDPQs4aDggK4996BPPTQUMLDqx//T0/PY8yYpWzdelKzR0EaOpgiXHfJQsIfIBZu9PmHt+Ox5S1bM7BnFQ8alMjatdcSHV3NUN+ePdC5FvaECgmBvDxJMHZOT0VRtpcHBIwpxKlTtVN8IyO9Lr7p6Xn885/faLbqzAg1qYNYkNGM+qMOS0rKeOqpH+jT53W+//5YtV+tYcMI1q6dRteu2ve0CpxEYtQmdZNQxNptQsWMa18kQ1Vu2VoPPSt706aU893+iqr3UklJYKktY04rUVTkinc4ESoi8kmGX2DcOOjeXUqIagtNPeP+c8RDD20gvUqP1mj0LsgmdZVQ5HMVh94Fau/edIYNe5s5c9Y6GMZhjPj4SNaunUaHDtobPBU4gSnCdZVQRHwjqZnJaIFISC0Rvd7pGzceY9Kk5eTnV8NQi4ysXfpSGRcFuNwF/Sxwn8svlpNTkb6dnCw1UmfPQnq6ZKVlZMjjzBnZXubZ6SCGuegi2LDBa6ffvDmFIUPeoqyssmsmELmvqUWp+iYepBg4A+g3zm/dOpaXXx7LmDFtq/UqqannGDHiXfbvP6PZY0FiwmZHIxNvcg5xiduGXsaObcvKlVcSGupm4mmfPvDbb9Venc9ZtgyuvNLIkc8oivL38r+OMQtYS1QUdOokD2eUloooZ2WJG7ugALKzpT6rvLg5M1P25eXB9u3w888i8NXFi60xS0utzJmzViO+IP1eTfH96xKMWCrZSO2m7c3noUMZjBv3PtOn9+CZZ0YSF+de8kqzZvVYu3YaF1/8DkePZlXaY0Xc0U0xvTAm3qM8udQ2h3ft2oNcffXHfPjhZIKD3RDhxMTaKcAuWsDlf5kEryymMoGB4grWuoNVFfbtg61b4fBhyVbeutWzaeVeFOB16w7y668nNFsjMOsyTSoa8kcgFyhba1hVVd58cxtffnmIuXPHMHmye9NAW7aM4euvr2PEiHc5dqyyCJch7mhThE28ST3khs/WC7Nq1T6mTVvJsmWTCQhwMabbzI8SVy0WySEKCZFyKEcYF+BmUCHAjd1dm8vs3y/W7datFY+MDO++phdjwOvXH9FsKU+8qon4jIl/EoiIYA5ykbIt5zh+PJspU5YzdWpn5s4dQ5Mmrt+8tWnTgHXrruXii9/h5MnKfavLkEb+zXA8Hs/EpDrEIG5o205dH3+8h5Ur9zJliotZzQnetwmr0KsXdO0q1nfz5nIT0KwZtGghcemPPoKpUx2f47jhKVWNwdsCfOiQWLTbtok7Yds2cUP7Gi8KcNX2gOGI+9HEREsUEpM9g95wh+XLd/Ptt0d47rlRXHddd5eHO3ToEMdXX13HyJFLOHWq8sxiKxUibL43TbxFLCLCtgbVokVbXRdgT1nAYWGSVX3sGBQ6SXycPRumT7e/PzHR+esZD5nGAwSqqhqGJ1roHDsmIlvZuj2prVOsIbwkwEePZrJ7d7pmax1tVG7iIQKp6FqVhjY2nJ6ez//93yqWL9/Dyy+Po0UL1yYedekSz9q11zJq1BLS0ytnQpchXZRMETbxJg0QD09Fs5D16w/x668nXGtGY0TsQCzl5s1FZMtbD5d/n5Ag51EU6N8ffvnF8bmciaeRmwLjFnB9VVVDyq8GrnH8uAhsuVW7bZtnkqU8QVCQJIX17CnlUj16QN++XnmpDRuOoqraxgtmrM3ECOUD2PWHO6xZc4Affkjm3/++mFtv7YvFYtwa7tGjMV98cS2jR79LRkbltoXl7ugETBE28R71qSzAqgoLFmzhzTcvM34Ko0bT668bazFsxKXtLH6bkAAREZIkbI+TJyXBOMxQ9UF8IDJOxTkZGTIHeNs2OKKNe9YQoaHis+/eXR69ekG3buKv9wHr12vdz4GYcTYT4wQgnqhIpMWgbWz43LlCZs/+ghUr9rJgwXidml/79OnTlM8/v4bx498jM7Oy660UScxKwJzKZeIdQhBPYIUHZtmynTzzzAgaNjTYpS0xUYwpZ42fjBp+SQYKfZydS1FEhA8csH9MaakYqG3aGFlVIwtGLeBjx2DlypoT38hIGDRIxiEuXCjuhMxM+bpokfjvBw3ymfiWlVn59tujmq3hmMlXJq4TTkVXo6p8++0Revd+jWef/ZGSEuO19AMHJrJ69dVERmqt3RLEEq6FXe1Magm2oZOCglIWL95q/OmhocaqV5KTjZ3PiEVtJIPZs3HgOAvav5Q9TmhLbbxIvXowdCjceSe89ZbElc+ehR9/hFdegZtvFrdyaM25e7duPcmpU9pEGjP+a+IuAUj2fCJ67uH8/BIeeOBrhgx5i+3bTxk+65AhzVm16ipThE18TATa9/GqVXtdO4UnY66eEk4j5zEeB24QiFEBNn5S14iLs43X9uwJHTr4fS/QP/7QG4xtdh0yqS6hiDWcgTTet23w8vPPqQwYsIj77x/MP/85xFCnoeHDW/Hxx1O5/PJlFBZWdnOXUOGONkdlmniaSCpnRGdkuNh+1Ujc1qi1aUTMz52TKh1HbTCNnMd4LXB94wLsiYzmyEhJkOrVSyzYvn0lhlsLiY3Vs3arTsIxMXEdBckmLc+Utr1wFRWV8cQTG/n00/0sWDCeQYOc35WPHt2G5cuncuWVyykoqCzCxVQ06zBF2MST2HYCzMx0NMdYB08kTpVjtKwpJcWxAHvWAnZBgD1hAefmSsz2l18kjltOYKC0tQwKEpEu/xodDfXri0s6OloecXHiz4+Lk0eTJvLVx+g3SyjDTGwx8RwhSNlQ+ahDW2v4999PMXToW8yZ05/HHrtIx81syyWXtGPp0olcddUKTSy5iIq2lWb7VBNPYZsPk5lZSGmplcBAg95NI2KXmipp1s5q5hMTpZNVkZNJTamp0Lu3/f1GhNx4DDjGuACfMh53cpnSUkmoAvcadURGyh+mSRMR5yZNoHFjuYO64ALjNWUuEBen526uoWETJnUYBUnOikAypW2t4dJSKy+8sJnPPz/AK6+MY8SI1g7PNnFiJ5YuVbn22pUaES6kQoT9O/xjUluwvZmzWlVOn84hIaGeneM1GLGA8/PFOHQmjIGBcr7D2soVDc4s6hpzQXsrBuwJcnOln/S+fVX3rVnjFQFu0iSKkJBAioq0MTUTE28QjHQaOo3ejd6BA2cZNWopM2f25qmnhhMTYz8fYerUzhQWljJjxmrNEJECKtzRpgibVJeq76HMzELjAmz0up2SYkwYPSHARsqZXBBgC0Yzh3yZBe1JvNQFS1EUGjXS1rRpJyKZmFQXK9LUIAURR/teltDQAFRV5fRpB40CznP99d1ZtOgSnXaXBcApzPeySfWpapA0bOhCpYjRa7cn48DO3Mf160NDJ60zMjMdN+uoIDQQI20o8/NrpoezJ/BiH+iGDSNITq7cxajU7rEmJq5RhnTIysaZZ6Vp0yhmzuzDLbf0plEj43Xw06f3pLCwlFmzvtB0dMtDRLgxpiVs4j628dbmzevRqJELg0aSkqTU1FkPZ6MxV2cWtdEeEt26SWOqZs3knImJojNJSfJISJB4s3PqBWKkeDU1Fay18I44KspxRls1adxYawGbLmiT6lKMJF3l4MwK7dGjMbff3p+rrupCeLh7yX+33tqXkhIrd9yxVrMnD3F3N8IUYRP3sL0eduni4rXYYhExO3TI8XFGBbhdO8kJSkqSPKHERPm+WbOKPtJGWL/e2HHOCTHWOzEgAKZNEzf0yZMiyLm5Tp9W43jR+gXo1CmeNWsOVtpSgFjBZjmHiasUIMKbh6NyNkVRGDeuDbff3p9Ro1q7PDFJjzlz+lNUVMr993+t2VP+GTdF2MRVVLQWcLdujVw/TWKicwE2mp90443y8B9CAzEyOb51a1i61HZbWpoIckqKfJ+SAqdPy9dTp+SPkpZWs5azl2dKTp3aif/+98dKW1TEZRjr1dc1qStYEcHNRHux0hIeHsR113Xn9tv70bmz57069913AcXFZTz00AbNnnIRbozZZtXEOOfQ5iu4JcCebMbhf0QH4m77pvh4efToYf+Y8hTx8sepUxWCnZoq1vTx4zI9whsY6SVaDfr0SaBr10bs3Hm60tZcTAE2cUx5fPcczvIGmjaN4pZb+jJzZi+X4rvu8OCDF/7Z5MOWXCrc0aYImzijFO1M4NDQAPr1c8MgKo/bNmggYlwed23a1NaFXDsJDsSbc8nCw6FtW3k4IjXV1opOTZWvJ06IQJ886Z417WUXNMBVV3XWCHARUlNpjiU00VIe383GWde0nj0bM3t2f665pquhdpOe4vHHL6KoqJRnn/1RsycHcUPHYbqjTRyTjtb6vf/+wbRq5YZhctddcO+9IsB1j3BFVdUswGBhVg2Sny8WdHKyCHLlh73Y9IsvykAHL3L4cAZt287Haq18QY1BLlQmJiBj2c5R4c7Vx2JRGDeuHXPm9GPEiFYeie+6g6qq3H33V8ydu1lnbz1kgqlpCZvokYNk0FfQqVNDfvttJqGhZpdADedqT7ZQeDi0aiUPR5w5I0J84oQMdfAyrVrFMmRIczZuPFppaw7ihjYthb8uVkRws5EEK/tERARz/fXdmTWrr1fiu66iKAovvDCKoqJSXn11i2bvOUR8jY0RN/krUQjYDqmxWBReeWW8Kb52qHsT5Mt7RDuKTXuYq67qohHg8hiIaQX/9ShDRDcLZ/HdhIRobrutLzfd1Mv4oHIfoSgK8+ePpbS0jEWLtHNcsxARNt/fJuVkIuJrG1q56aZeDBvWoiYWVBsIUFTbCnwTNzh7Np/mzeeSl1dcaasCNEF6+JrUfYqpaJzhOFehd++mzJ7dj6uu6uKz+O7hwxnceONn5OuIhzUAACAASURBVOQ4aUavwWq1sm2bvT7wscjUJpO/LmVIgl7Vzk8JCVHs3Hmbw7aof3VMAfYQ8+f/zJw52mYGFqA5Zl1wXcZYfDcgwMK4cW2ZM6c/w4e3rJH47rp1B7niig81M4GrSwPMrP+/KrnAGfQaENWvH8L7709m7FgnCbh/cUwB9iCTJy9nxYo9mq1hyMBzM2mlblGCTA9ybFFGRARxww09mTWrHx071rzLduXKvUyd+pFmCEN1iUMSD03+OqQjN55V5WPgwGYsWXIFbdqY3hFnmALsQc6cyaNfv0UcOZKl2VMPs3yjLpKDXslFOfHxEaxffz1du7rRgMCLLF26gxtuWGWKsImblAJHqmwNCLDwwAMX8OijwwgKMudKG0FRVbUAs2jVY/z4YzIXX/w2xcXai1sQkjlqxoTrFqVI8km27t6GDcN54YXRXHttd5+uyhkLF27httu0QxjKicJ1j42KCHDdyuk00aMAsJ1AlJgYzZtvXuZ0HrWJDbm1pw64lrB160kuu2wZqanndPYqyMWtAWZcuK6RB6RhL/P58ss7MG/eWBIT/eej9txzm7jvvq909kQB8ZgeGxN9spHEqwqSk+8kMdHYaHmTPzlnfsI8yHvv7WDo0LfsiC+IlZCDJC6Ynv+6RQSQhL172VWr9tGz50LeeGOrHavT99x77yAeeWSYzp4ctPWcJiYV2CZdNWoUYYqvm5gC7AFKSsq46651XHfdSnJzi+0cFYi46JIwG9vXVQIQy7Epeh6Os2cL+NvfPmX8+Pc5ciTT14vT5dFHh3H33QN19mQhN4omJlpsvTytW5uxf3ex4CyN08QhJ07kMGrUu8yd+xNVDRsFGbfcCGiBJKp4r/W2ib8QgZSf6VvDa9cepGfP11iw4BdNC9Oa4bnnRjFzZm+dPZlom+qb/NVRkY5XFbRsaQqwm+Rb0P41TQyzaVMyAwcu5rvvjursDQESkRKkaEyL96+GBbGGE5AEPFvOnStk1qwvGDlyCQcO1Ky7V1EUFiwYz7Rp3XT2nkWsYRMTkPCErZevY0ezLambFFmQv6iJiyxevJXhw98hOVkv3hsFNMPMCDURD0gSUB+9m7ANG47Qp8/rzJ37E6WlNTc7OyDAwptvXsbll+v1Ty+v+TT5a6Oi9YhERQUzfbrv2v7WMXJMF7Qb/PhjMrfe+hmFhXr1n3GIy9kMr5uUY0FK0BLQC0Hk5BRx113ruPjid9i9O93Xi/uT4OAA3ntvEqNHt9HZm4azbl8mdZ1stAlYs2b1p2nTaO+9pKsjaGsXhYqqqt8Dg2t6JbWF3Nxi+vdfxJ492gtlICK84TWwKpPagxVHsdXw8CD+9a+h3H33wBprZpCdXcT48e/zww/HdPY2xaxl/ytiBY5SuelMbGwYBw7cToMGXrzm7dwJgwZB8+byaNFCvrZsCUlJ8n3jxt57fe/yQyDmba1LPPjgNzriG4pkNpsjt0ycYUHqwCMQ165tCkZ+fgl///t6PvlkH6+9NoHu3X1/cYmODuHTT69ixIglbN16UrP3JCLC5o3mX4tzaDu+3XXXAO+KL8CxYzLjffdueehRv36FQJeLcmXBjq/5EZ92OKeoqroSuKKmV1IbWL/+MGPGLNW08AtAYnxmYw0TVymPqelbwyEhAfzznxfywAMXEBLi+/dXenoew4a9w549aZo9AYgImw30/hqUAceoLMCNG0ewf/8coqO9nOcyfz7MmVO9c8TG2gpyuRWdlCTfx9bYMJEVgZgpjobIyirk5ps/0+mfG4cpvibuoSDWcCTSWcg2HaOoqIxHHvmW1av3sXDhBPr2TfDp6ho2jODLL69l+PAlHDhQuSa4DDiBxLTNRMO6jYq8N22t3/vuG+x98QVITq7+OTIy5LFtm/7++PgKt3Zioq1Qt2wJkZHVX4M+WYqqqi8Ad3nrFZySlyduhhMn5I+dnAzHj8vP2dmQny9fi4vla0QEREXJH6lbN7joIhg5EgK9K4I33fQZixf/ptkaidlUw8Rz6A81BwgKCuC++wbx0EMXEhbm21DHoUMZjBixhKNHtffqAUi2v1nbXjcpF1/bQpmkpHrs2zfbN+/DqVPho4+8/zr2sFigSZMKga5sOZcLdajbnqDnFFVV/wU85rEF61FaCn/8IY/9++HAATh4UL6ePFn9TLfmzeGBB+Cmm7wixJ99tp/LLvtA02jDdD2beINi5KKnX57frVsjFiwYzwUXJPl0Vbt2pTF69LucOKGtWgzCXq2zSW1GRTqhVXWQLllyBddd56PhIv36wZYtvnktdwgKgoQEW6s5KUmMwsREZ89+SFFVdQ7wkkcX9ccfsHmzPH7+WUQ3L8+jL6FL//7w3nvQ2rMTObp3f5UdO05rtjZG6n1NTDyNFUl60beGAwMtzJnTn8cfv4iICN9Zn1u3nmTEiCVkZhZoV4RYwqYI1x3Oopeb8PDDQ3n88Yt8t4yGDeFMLWyJumYNjBvn7KjZiqqq1wPvVOvFCgpg7Vr49FP43//gSNVZkT4jPh6++AJ667XWc519+9Lp2PEVzdZopOTIxMSbFCOZ0vm6ezt0iOPVV8czbFhLn61o8+YURo5cQl5eiWZPCGIJm3Ngaz+Z6PUBnzOnPy+9NNZ3yzhzRgS4NrJrF3Tu7Oyoay3IX9s9cnPhP/+BNm1g0iR4552aFV+AtDQYO1ascA+watV+na1m71MTXxAMNMHeaMB9+84wYsS7zJnzBdnZvumnM3BgIqtWXU1YmDb0UgQcR5usY1LbyEJvEtb//V8PXnxxtG+XcvSob1/PUwQESLzYOWctaAc7GmXjRlH4Bx+UhCl/Ij0drr1WEreqyapV+zRbQjGTTkx8hwUZ6pCEXgOMsjIr8+f/Qq9er/HVV4d8sqIRI1rx4YdTCA7WWrtFwCnEhW5S+9AflXrFFR1ZvPgSLBYfd/c7ptcIphbQrBmEG6qPPmNBfFyusWSJBJk9kSLuLX7+GV59tVqnOHIkky1bUjVbvZaSbmLigCAcWcOHDmUwZsxSbr75M50Yree55JL2LFlyBYGB2rXkI806an7Kk4kr5CO2mO3/beTIVixbNpnAwBoILTRpAjNnwujR0KFDdbKNfUvz5kaPPK2oqhqGvSCTHu+/D9dfD2W1wNUUFydujAj3Wue98MJm7rnnS83WJMzaR5OapQS5b9ZPbExMrMeCBeOZMKGd11fyxhtbmTnzM52xilFInoRZouf/FCLhA1vPxcCBzVi//v8ID/eT5LqyMrmep6RIqPPYMfn56FExBlNToUSbm1ADXHstvPuukSNDFQBVVbMxktK7a5f05cypRQOUFi2Cv/3NradedNHbmlGDwcicVxMTfyAHEWL9m+Hp03vwzDMjadjQu72b5837mTvuWKuzJwp7FruJv6Avvt26NeK7724gJiasRlblFgUFIszJyRXifOyYtLDcscN363j4YXj8cWdHZSmKElMuwAeAtk5PPGoUfP119RfoS8aMkQxtFzlxIoekpBcoK6t8Zx+DdL4yMfEXSpC4nX5L94SEaF56aQyTJnXy6ir+/e//8dBDG3T21EMmQZmWsH9RhuTfZqF1OzdqFMH27bfQuHEdKbN8/32YNs13r/fGGzBjhrOjDiiK0r48lfE0zgT4u+9qn/gCfP+9ZGu72E5s5840jfiCGf818T/KY8PlCTSlNnuPH89m8uTlXH11F154YQyNG3vnPfzggxeSk1PMM8/8oNlzDhHfWlpOUifJQzwn+u7a+fNH1x3xBeOVOV9/LS7sPXtg376Krxn6vdrtYiwGfAoq2jhpM42qsnSpa4swSlAQNGgg8dq4OKn7ql8f6tWToHt4uHwfHAzR0ZCZKVnOP/8M69ZJly1H5OXB77/DBRe4uDC9JBI/iYWYmFQhCghDRLhqiOiDD3bx7bdHef750VxzTVevrOCpp4aTl1fMyy//otmThdQH11jTexNArN509N4f5SgKDB7stINT7WLvXufH1K8PI0bI92M1tc6HD4sQ791b8fj1V/tVNkmGutSlQoUApzg9/KuvjJzUluhoaNtWHk2byqNhQ2ndFRcnwtukidRNucMPP8All0CWk3kSu3a5IcAmJrWNQKRDWyRyobW9OT11Kpdp01awYsUe5s0bS0KCZwepK4rC3LljyM0t5u23t2v2nkViwfU9+pomRlCp8JA4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"

var nwsLogo = new Image();
          nwsLogo.src = nwsLogoSrc;

function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}
async function createLoopIR(){
        snapshot.width = $('#map').width()
        snapshot.height = $('#map').height()
        ssctx.clearRect(0, 0, snapshot.width, snapshot.height);
        fetch("https:\/\/unpkg.com/gif.js@0.2/dist/gif.worker.js")
            .then(response => response.blob())
            .then(blob => {
              wScript = URL.createObjectURL(blob, {type: "text/javascript"})
            })
            .then(()=>{
              var gif = new GIF({
                workers: 4,
                workerScript: wScript,
                quality: 30,
                //dither:'Atkinson-serpentine',
               })
               buildLoopIR(gif)
            })
              .catch(error => window.alert("Problem Loading GIF Builder. Animated GIF creation not available. Reload."))
      }

      async function buildLoopIR(gif){
        stopIR()
        showIRFrame(0)
        await timer(100)
        for (let i = 0;i < irtimestamps.length;i++){
          console.log("Creating loop "+i+" of "+irtimestamps.length)
          showIRFrame(animationPositionIR + 1)
          //mapImg = map.getCanvas()
          var png = map.getCanvas().toDataURL();
          var copy = new Image();
          copy.src = png;
          copy.onload = function() {
              ssctx.drawImage(copy, 0, 0, snapshot.width, snapshot.height);
              //ssctx.drawImage(nwsLogo, snapshot.width-110, 20, 90, 90);
              var fontsize = 24;
              var height = fontsize + 6;
              var width = snapshot.width;
              ssctx.fillStyle = 'rgba(255,255,255,0.7)';
              ssctx.fillRect(0, 0, snapshot.width, height);
              //ssctx.fillRect(snapshot.width-width, snapshot.height-height, width, height);
              ssctx.font = 'bold 24px Open Sans Condensed';
              ssctx.fillStyle = 'black';
              ssctx.textAlign = 'left';
              ssctx.textBaseline = 'bottom';
              ssctx.fillText(`${irtimestamps[i]} MT`, 30, 30);
              ssctx.textAlign = 'center';
              ssctx.fillText(loopname, snapshot.width/2, 30);
              ssctx.drawImage(nwsLogo, snapshot.width-110, 20, 90, 90);
              if (i == irtimestamps.length-1){
                gif.addFrame(snapshot, {copy:true,delay: 1000})
              }
              else{
                gif.addFrame(snapshot, {copy:true,delay: 50})
              }
          }

          //have to do async so that frame shows up in gif
          await timer(200)
        }
        gif.on('finished', function(blob) {
          alert(`File Size: ${formatBytes(blob.size)}`)
          window.open(URL.createObjectURL(blob))
        })
        gif.render()
      }

      function createScreenCap(){
        let timestamp = "Created: "+moment().format('lll')+" MT"
        snapshot.width = $('#map').width()
        snapshot.height = $('#map').height()
        ssctx.clearRect(0, 0, snapshot.width, snapshot.height);
        var png = map.getCanvas().toDataURL();
        var copy = new Image();
        copy.src = png;
        copy.onload = function() {
          var fontsize = 18;
          var height = fontsize + 6;
          var width = (timestamp.length + 10) / fontsize * 100;
          ssctx.drawImage(copy, 0, 0, snapshot.width, snapshot.height);
          ssctx.drawImage(nwsLogo, snapshot.width-110, 20, 90, 90);
          ssctx.fillStyle = 'rgba(255,255,255,0.8)';
          ssctx.fillRect(snapshot.width-width-13, snapshot.height-height, width+13, height);
          ssctx.font = 'bold 18px Open Sans Condensed';
          ssctx.fillStyle = 'black';
          ssctx.textAlign = 'left';
          ssctx.textBaseline = 'bottom';
          ssctx.fillText(timestamp, snapshot.width-width-10, snapshot.height-3);
          //ssctx.drawImage(nwsLogo, 20, 20, 90, 90);
          var newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${snapshot.toDataURL()}">`
        }
      }

      async function createLoop(){
        snapshot.width = $('#map').width()
        snapshot.height = $('#map').height()
        ssctx.clearRect(0, 0, snapshot.width, snapshot.height);
        fetch("https:\/\/unpkg.com/gif.js@0.2/dist/gif.worker.js")
            .then(response => response.blob())
            .then(blob => {
              wScript = URL.createObjectURL(blob, {type: "text/javascript"})
            })
            .then(()=>{
              var gif = new GIF({
                workers: 4,
                workerScript: wScript,
                quality: 30,
                //dither:'Atkinson-serpentine',
               })
               buildLoop(gif)
            })
              .catch(error => window.alert("Problem Loading GIF Builder. Animated GIF creation not available. Reload."))
      }

      async function buildLoop(gif){
        stop()
        showFrame(0)
        await timer(100)
        for (let i = 0;i < hrtimestamps.length;i++){
          console.log("Creating loop "+i+" of "+hrtimestamps.length)
          showFrame(animationPosition + 1)
          //mapImg = map.getCanvas()
          var png = map.getCanvas().toDataURL();
          var copy = new Image();
          copy.src = png;
          copy.onload = function() {
              ssctx.drawImage(copy, 0, 0, snapshot.width, snapshot.height);
              var fontsize = 24;
              var height = fontsize + 6;
              var width = (hrtimestamps[i].length * fontsize) / height * 100;
              ssctx.fillStyle = 'rgba(255,255,255,0.7)';
              ssctx.fillRect(0, 0, snapshot.width, height);
              ssctx.font = 'bold 24px Open Sans Condensed';
              ssctx.fillStyle = 'black';
              ssctx.textAlign = 'left';
              ssctx.textBaseline = 'bottom';
              ssctx.fillText(`${hrtimestamps[i]} MT`, 30, 30);
              ssctx.textAlign = 'center';
              ssctx.fillText(loopname, snapshot.width/2, 30);
              ssctx.drawImage(nwsLogo, snapshot.width-110, 20, 90, 90);
              if (i == hrtimestamps.length-1){
                gif.addFrame(snapshot, {copy:true,delay: 1000})
              }
              else{
                gif.addFrame(snapshot, {copy:true,delay: 200})
              }
          }

          //have to do async so that frame shows up in gif
          await timer(200)
        }
        gif.on('finished', function(blob) {
              alert(`File Size: ${formatBytes(blob.size)}`)
              window.open(URL.createObjectURL(blob))
        })
        gif.render()
      }

      async function videoLoop(){
        var videoWriter = new WebMWriter({
          quality: 0.999,    // WebM image quality from 0.0 (worst) to 0.99999 (best), 1.00 (VP8L lossless) is not supported
          fileWriter: null, // FileWriter in order to stream to a file instead of buffering to memory (optional)
          fd: null,         // Node.js file handle to write to instead of buffering to memory (optional)

          // You must supply one of:
          frameDuration: 100, // Duration of frames in milliseconds
          frameRate: null,     // Number of frames per second

          transparent: false,      // True if an alpha channel should be included in the video
          alphaQuality: undefined, // Allows you to set the quality level of the alpha channel separately.
                                  // If not specified this defaults to the same value as `quality`.
        })
        stop()
        showFrame(0)
        await timer(100)
        for (let i = 0;i < hrtimestamps.length;i++){
          console.log("Creating loop "+i+" of "+hrtimestamps.length)
          showFrame(animationPosition + 1)
          //mapImg = map.getCanvas()
          var png = map.getCanvas().toDataURL();
          var copy = new Image();
          copy.src = png;
          copy.onload = function() {
              ssctx.drawImage(copy, 0, 0);
              var fontsize = 18;
              var height = fontsize + 6;
              var width = (hrtimestamps[i].length + 10) / fontsize * 100;
              ssctx.fillStyle = 'rgba(255,255,255,0.8)';
              ssctx.fillRect(snapshot.width-width, snapshot.height-height, width, height);
              ssctx.font = 'bold 18px Open Sans Condensed';
              ssctx.fillStyle = 'black';
              ssctx.textAlign = 'left';
              ssctx.textBaseline = 'bottom';
              ssctx.fillText(hrtimestamps[i], snapshot.width-width+5, snapshot.height-3);
              if (i == hrtimestamps.length-1){
                videoWriter.addFrame(snapshot, 1000);
              }
              else{
                videoWriter.addFrame(snapshot, 100);
              }
          }

          //have to do async so that frame shows up in gif
          //await timer(200)
        }
        videoWriter.complete().then(function(webMBlob) {
          window.open(URL.createObjectURL(`data:video/webm;base64,${webMBlob}`))
        })

      }

      function timer(ms){
        return new Promise(res=>setTimeout(res,ms))
      }

      async function changePosition(position, preloadOnly) {
          $('timestamp').empty()
          while (position >= hrtimestamps.length) {
              position -= hrtimestamps.length;
          }
          while (position < 0) {
              position += hrtimestamps.length;
          }
          var currentTimestamp = hrtimestamps[animationPosition];
          var nextTimestamp = hrtimestamps[position];
          if (preloadOnly) {
              return;
          }
          animationPosition = position;
          if (currentTimestamp) {
              map.setPaintProperty(currentTimestamp, 'raster-opacity', 0)
          }
           map.setPaintProperty(nextTimestamp, 'raster-opacity', 1)
          $('.timestamp').html(nextTimestamp)
      }

      async function changeIRPosition(position, preloadOnly) {
          $('timestampIR').empty()
          while (position >= irtimestamps.length) {
              position -= irtimestamps.length;
          }
          while (position < 0) {
              position += irtimestamps.length;
          }
          var currentTimestamp = irtimestamps[animationPositionIR];
          var nextTimestamp = irtimestamps[position];
          if (preloadOnly) {
              return;
          }
          animationPositionIR = position;
          if (currentTimestamp) {
              map.setLayoutProperty(currentTimestamp, 'visibility', 'none')
          }
           map.setLayoutProperty(nextTimestamp, 'visibility', 'visible')
          $('.timestampIR').html(nextTimestamp)
      }

      function showIRFrame(nextPosition) {
          const preloadingDirection = nextPosition - animationPositionIR > 0 ? 1 : -1;
          changeIRPosition(nextPosition);
          // preload next next frame (typically, +1 frame)
          // if don't do that, the animation will be blinking at the first loop
          changeIRPosition(nextPosition + preloadingDirection, true);
      }

      /**
       * Stop the animation
       * Check if the animation timeout is set and clear it.
       */
      function stopIR() {
          if (animationIRTimer) {
              clearTimeout(animationIRTimer);
              animationIRTimer = false;
              return true;
          }
          return false;
      }
      function playIR() {
          showIRFrame(animationPositionIR + 1);
          // Main animation driver. Run this function every 100 ms
          animationIRTimer = setTimeout(playIR, 100)
      }
      function playStopIR() {
          if (!stopIR()) {
              playIR();
          }
      }

      function showFrame(nextPosition) {
          const preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;
          changePosition(nextPosition);
          console.log(nextPosition)
          // preload next next frame (typically, +1 frame)
          // if don't do that, the animation will be blinking at the first loop
          changePosition(nextPosition + preloadingDirection, true);
      }
      /**
       * Stop the animation
       * Check if the animation timeout is set and clear it.
       */
      function stop() {
          if (animationTimer) {
              clearTimeout(animationTimer);
              animationTimer = false;
              return true;
          }
          return false;
      }
      function play() {
          showFrame(animationPosition + 1);
          // Main animation driver. Run this function every 100 ms
          animationTimer = setTimeout(play, 100)
      }
      function playStop() {
          if (!stop()) {
              play();
          }
      }

      async function changePositionLtg(position, preloadOnly) {
          $('timestamp').empty()
          while (position >= ltgtimestamps.length) {
              position -= ltgtimestamps.length;
          }
          while (position < 0) {
              position += ltgtimestamps.length;
          }
          var currentTimestamp = ltgtimestamps[animationPositionLtg];
          var nextTimestamp = ltgtimestamps[position];
          if (preloadOnly) {
              return;
          }
          animationPositionLtg = position;
          //var filterHR1 = ['>=',['number',['get','TimeStamp']],moment(currentTimestamp).subtract(1,'hour').valueOf()]
          var filterHR = ['<=',['number',['get','TimeStamp']],currentTimestamp]
          //map.setFilter('NCDCLtg',['all',filterHR1,filterHR])
          map.setFilter('NCDCLtg',filterHR)
          $('#ltgLegend').html(`Total Lightning Strikes: <div id="ltgCt"></div><br>Period: <b>${moment(ltgtimestamps[0]).format('lll')}</b> to <b>${moment(currentTimestamp).format('lll')}</b><br>Data Courtesy of Vaisala`);
          //console.log(filterHR1,filterHR)
          $('.timestamp').html(moment(currentTimestamp).format('lll'))
      }
      /**
       * Check avail and show particular frame position from the timestamps list
       */
      function showFrameLtg(nextPosition) {
          const preloadingDirection = nextPosition - animationPositionLtg > 0 ? 1 : -1;
          changePositionLtg(nextPosition);
          //console.log(nextPosition)
          // preload next next frame (typically, +1 frame)
          // if don't do that, the animation will be blinking at the first loop
          changePositionLtg(nextPosition + preloadingDirection, true);
      }
      /**
       * Stop the animation
       * Check if the animation timeout is set and clear it.
       */
      function stopLtg() {
          if (animationTimerLtg) {
              clearTimeout(animationTimerLtg);
              animationTimerLtg = false;
              return true;
          }
          return false;
      }
      function playLtg() {
          showFrameLtg(animationPositionLtg + 1);
          // Main animation driver. Run this function every 100 ms
          animationTimerLtg = setTimeout(playLtg, 100)
      }
      function playStopLtg() {
          if (!stopLtg()) {
              playLtg();
          }
      }

    let hrdropdown = $('#heat-dropdown');
     //fetch(`https:\/\/api.allorigins.win/get?url=${encodeURIComponent('https:\/\/www.wrh.noaa.gov/wrh/heatrisk/data/FileTimes.js')}`)
     fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.wrh.noaa.gov/wrh/heatrisk/data/FileTimes.js')
     .then(res=>res.text())
     .then(data => {
        let heattimes = data.slice(16,-1);
        heattimes = JSON.parse(heattimes);
        hrdropdown.empty();
        hrdropdown.append('<option selected="true" disabled>Date</option>');
        hrdropdown.prop('selectedIndex', 1);
        $.each(heattimes, function(key, entry) {
          hrdropdown.append($('<option></option>').attr('value', key).text(entry));
        });
      })
      .catch(error => {
        hrdropdown = $('#heat-dropdown');
        let heattimes = {1:'NA',}
        hrdropdown.empty();
        hrdropdown.append('<option selected="true" disabled>Date</option>');
        hrdropdown.prop('selectedIndex', 1);
        $.each(heattimes, function(key, entry) {
          hrdropdown.append($('<option></option>').attr('value', key).text(entry));
        });
        window.alert("Problem Loading WR Heat Risk Data.")
      })

      const ltghrs ={1:"1 Hour",3:"3 Hours",6:"6 Hours",12:"12 Hours",24:"24 Hours",36:"36 Hours",48:"48 Hours",60:"60 Hours",72:"72 Hours",84:"84 Hours",96:"96 Hours",120:"5 Days",240:"10 Days",720:"30 Days"};
      let ltdropdown = $('#lt-dropdown');
      ltdropdown.empty();
      ltdropdown.append('<option selected="true" disabled></option>');
      ltdropdown.prop('selectedIndex',1);
      $.each(ltghrs, function(key, entry) {
        ltdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const lsrhrs ={12:"12 Hours",24:"24 Hours",36:"36 Hours",48:"48 Hours",60:"60 Hours",72:"72 Hours",84:"84 Hours",96:"96 Hours",120:"120 Hours"};
      let lsrdropdown = $('#lsr-dropdown');
      lsrdropdown.empty();
      lsrdropdown.append('<option selected="true" disabled></option>');
      lsrdropdown.prop('selectedIndex',1);
      $.each(lsrhrs, function(key, entry) {
        lsrdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const dens ={1:"All",15:"High",20:"Medium",30:"Low"};
      let dendropdown = $('#den-dropdown');
      dendropdown.empty();
      dendropdown.append('<option selected="true" disabled></option>');
      dendropdown.prop('selectedIndex',1);
      $.each(dens, function(key, entry) {
        dendropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const dy = {1:"1 Hour",3:"3 Hours",6:"6 Hours",12:"12 Hours",24:"24 Hours",36:"36 Hours",48:"48 Hours",60:"60 Hours",72:"72 Hours",84:"84 Hours",96:"4 Days",120:"5 Days"}
      let dydropdown = $('#day-dropdown');
      dydropdown.empty();
      dydropdown.append('<option selected="true" disabled></option>');

      //dydropdown.prop('selectedIndex',1);
      $.each(dy, function(key, entry) {
        dydropdown.append($('<option></option>').attr('value', key).text(entry));
      });
      $("#day-dropdown").val(1);

      const qpfhrs ={8:"QPF 48hr Day 1-2",9:"QPF 72hr Day 1-3",10:"QPF 120hr Day 1-5",11:"QPF 168hr Day 1-7"};
      let qpdropdown = $('#qp-dropdown');
      qpdropdown.empty();
      qpdropdown.append('<option selected="true" disabled></option>');
      qpdropdown.prop('selectedIndex',1);
      $.each(qpfhrs, function(key, entry) {
        qpdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const qphrs ={0:"Day 1",1:"Day 2",2:"Day 3"};
      let qp1dropdown = $('#qp1-dropdown');
      qp1dropdown.empty();
      qp1dropdown.append('<option selected="true" disabled></option>');
      qp1dropdown.prop('selectedIndex',1);
      $.each(qphrs, function(key, entry) {
        qp1dropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const irband ={0:"Band 7: SWIR",1:"Band 9: Mid WV",2:"Band 13: Clean IR"};
      let irdropdown = $('#ir-dropdown');
      irdropdown.empty();
      irdropdown.append('<option selected="true" disabled></option>');
      irdropdown.prop('selectedIndex',1);
      $.each(irband, function(key, entry) {
        irdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const irband1 ={0:"Clean IR NASA",1:"Clean IR Pink",2:"Clean IR Seahawk",3:"Turbo"};
      let irdropdown1 = $('#ir-dropdown1');
      irdropdown1.empty();
      irdropdown1.append('<option selected="true" disabled></option>');
      irdropdown1.prop('selectedIndex',1);
      $.each(irband1, function(key, entry) {
        irdropdown1.append($('<option></option>').attr('value', key).text(entry));
      });

      const preciphrs ={1:"1 Hour",3:"3 Hours",6:"6 Hours",9:"9 Hours",12:"12 Hours",15:"15 Hours",18:"18 Hours",21:"21 Hours",24:"24 Hours",48:"48 Hours",72:"72 Hours",96:"96 Hours",120:"120 Hours",144:"144 Hours",168:"168 Hours",240:"240 Hours"};
      let prdropdown = $('#pre-dropdown');
      prdropdown.empty();
     //prdropdown.append('<option selected="true" disabled>Precipitation</option>');
      prdropdown.prop('selectedIndex', 1);
      $.each(preciphrs, function(key, entry) {
        prdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const mrmshrs ={3:"1 Hour",7:"3 Hours",11:"6 Hours",15:"12 Hours",19:"24 Hours",23:"48 Hours",27:"72 Hours"};
      let mrdropdown = $('#mr-dropdown');
      mrdropdown.empty();
      mrdropdown.append('<option selected="true" disabled>Precipitation</option>');
      mrdropdown.prop('selectedIndex', 1);
      $.each(mrmshrs, function(key, entry) {
        mrdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const radloop = {1:"CBX Hires Base Refl",2:"CBX Hires Base Vel",3:"Base Refl World",4:"Base Refl Smoothed",5:"QC BREF MRMS",6:"Raw BREF MRMS",7:"QC CREF MRMS",8:"Raw CREF MRMS",9:"QC BREF MRMS (NowCoast)"}
      let raddropdown = $('#rad-dropdown');
      raddropdown.empty();
      raddropdown.append('<option selected="true" disabled></option>');
      raddropdown.prop('selectedIndex', 1);
      $.each(radloop, function(key, entry) {
        raddropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const smokeloop = {1:"HRRR VI Smoke",2:"HRRR Sfc Smoke", 3:"HRRR Vis Smoke", 4:"Canadian FireWork 10km"}
      let smokedropdown = $('#smoke-dropdown');
      smokedropdown.empty();
      smokedropdown.append('<option selected="true" disabled></option>');
      smokedropdown.prop('selectedIndex', 1);
      $.each(smokeloop, function(key, entry) {
        smokedropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const mwest = {1:"Temperatures",2:"Dewpoint",3:"Gusts", 4:"Visibility",5:"RH",6:"Wind Chill"}
      let mwdropdown = $('#mw-dropdown');
      mwdropdown.empty();
      mwdropdown.append('<option selected="true" disabled></option>');
      mwdropdown.prop('selectedIndex', 1);
      $.each(mwest, function(key, entry) {
        mwdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const acis ={"maxt":"Max Temp","mint":"Min Temp","pcpn":"Precipitation","snow":"Snow","snwd":"Snow Depth"};
      let acdropdown = $('#ac-dropdown');
      acdropdown.empty();
      acdropdown.append('<option selected="true" disabled></option>');
      acdropdown.prop('selectedIndex', 1);
      $.each(acis, function(key, entry) {
        acdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const acis1 ={"maxt":"Mean MaxT","mint":"Mean MinT","pcpn":"Total Precipitation","snow":"Total Snow","avgt":"Mean Temp Departure"};
      let ac1dropdown = $('#ac1-dropdown');
      ac1dropdown.empty();
      ac1dropdown.append('<option selected="true" disabled></option>');
      ac1dropdown.prop('selectedIndex', 1);
      $.each(acis1, function(key, entry) {
        ac1dropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const acis2 ={"pcpn":"Precipitation","snow":"Snow","snwd":"Snow Depth"};
      let ac2dropdown = $('#ac2-dropdown');
      ac2dropdown.empty();
      ac2dropdown.append('<option selected="true" disabled></option>');
      ac2dropdown.prop('selectedIndex', 1);
      $.each(acis2, function(key, entry) {
        ac2dropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const cpc ={"6t":"6-10 Day Temperature","6p":"6-10 Day Precipitation","8t":"8-14 Day Temperature","8p":"8-14 Day Precipitation"};
      let cpcdropdown = $('#cpc-dropdown');
      cpcdropdown.empty();
      cpcdropdown.append('<option selected="true" disabled></option>');
      cpcdropdown.prop('selectedIndex', 1);
      $.each(cpc, function(key, entry) {
        cpcdropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const snowana ={1:"24 Hours",2:"48 Hours",3:"72 Hours"};
      let snowanadropdown = $('#snowana-dropdown');
      snowanadropdown.empty();
      snowanadropdown.append('<option selected="true" disabled></option>');
      snowanadropdown.prop('selectedIndex', 1);
      $.each(snowana, function(key, entry) {
        snowanadropdown.append($('<option></option>').attr('value', key).text(entry));
      });

      const wssiDropdown = {
          'Overall-1-3':'Overall Impacts Days 1-3',
          'Overall-1':'Overall Impacts Day 1',
          'Overall-2':'Overall Impacts Day 2',
          'Overall-3':'Overall Impacts Day 3',
          'Snow-1-3':'Snow Amount Days 1-3',
          'Snow-1':'Snow Amount Day 1',
          'Snow-2':'Snow Amount Day 2',
          'Snow-3':'Snow Amount Day 3',
          'SNLoad-1-3':'Snow Load Days 1-3',
          'SNLoad-1':'Snow Load Day 1',
          'SNLoad-2':'Snow Load Day 2',
          'SNLoad-3':'Snow Load Day 3',
          'Ice-1-3':'Ice Accumulation Days 1-3',
          'Ice-1':'Ice Accumulation Day 1',
          'Ice-2':'Ice Accumulation Day 2',
          'Ice-3':'Ice Accumulation Day 3',
          'Freeze-1-1.5':'Flash Freeze Day 1-1.5',
          'Freeze-1':'Flash Freeze Day 1',
          'BLSN-1-3':'Blowing Snow Days 1-3',
          'BLSN-1':'Blowing Snow Day 1',
          'BLSN-2':'Blowing Snow Day 2',
          'BLSN-3':'Blowing Snow Day 3',
          'BLIZZARD-1-3':'G Blizzard Days 1-3',
          'BLIZZARD-1':'G Blizzard Day 1',
          'BLIZZARD-2':'G Blizzard Day 2',
          'BLIZZARD-3':'G Blizzard Day 3',
        }

      let wssidrop = $('#wssi-dropdown');
      wssidrop.empty();
      wssidrop.append('<option selected="true" disabled></option>');
      wssidrop.prop('selectedIndex', 1);
      $.each(wssiDropdown, function(key, entry) {
        wssidrop.append($('<option></option>').attr('value', key).text(entry));
      });

      const obsNetworks = {
        "1,2,5,10,14,96,106":"GOV",
        "2":"RAWS",
        "1,2":"NWS/RAWS",
        "1,14":"METARs",
	      "65":"CWOP",
        "25":"SNOTEL",
	      "4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210":"Trans",
        "!64":"ALL"
      }
      let obsNetworkdropdown = $('#obnetwork-dropdown');
      obsNetworkdropdown.empty();
      obsNetworkdropdown.append('<option selected="true" disabled></option>');

      $.each(obsNetworks, function(key, entry) {
        obsNetworkdropdown.append($('<option></option>').attr('value', key).text(entry));
      });
      $("#obnetwork-dropdown").append($("#obnetwork-dropdown option").remove().sort(function(a, b) {
        let at = $(a).text(), bt = $(b).text();
        return (at > bt)?1:((at < bt)?-1:0);
      }));
      obsNetworkdropdown.prop('selectedIndex', 1);

      //$("#obnetwork-dropdown").val(1);

      // $( function() {$( "#datepicker" ).datepicker({
      //   changeMonth: true,
      //   changeYear: true,
      //   yearRange: "-169:+0",
      //   showButtonPanel: true});
      // $( "#datepicker" ).datepicker( "option", "dateFormat", "yy-mm-dd" );
      // $( "#datepicker" ).datepicker( "option", "maxDate", "-1" );
      // $( "#datepicker" ).datepicker("setDate", "-1" );
      // });

      // $( function() {$( "#monthPicker" ).datepicker({
      //   changeMonth: true,
      //   changeYear: true,
      //   yearRange: "-169:+0",
      //   showButtonPanel: true,});
      // $( "#monthPicker" ).datepicker( "option", "dateFormat", "yy-mm" );
      // $( "#monthPicker" ).datepicker( "option", "maxDate", "-1m" );
      // $( "#monthPicker" ).datepicker("setDate", "-1m" );
      // });

  	// $("#monthPicker").click(function () {
  	// 	$(".ui-datepicker-calendar").hide();
  	// });
     // $("#monthPicker").focus(function () {
     //   $(".ui-datepicker-calendar").hide();
     // });


    $.datetimepicker.setDateFormatter({
    parseDate: function (date, format) {
        var d = moment(date, format);
        return d.isValid() ? d.toDate() : false;
    },

    formatDate: function (date, format) {
        return moment(date).format(format);
    },

    //Optional if using mask input
    formatMask: function(format){
        return format
            .replace(/Y{4}/g, '9999')
            .replace(/Y{2}/g, '99')
            .replace(/M{2}/g, '19')
            .replace(/D{2}/g, '39')
            .replace(/H{2}/g, '29')
            .replace(/m{2}/g, '59')
            .replace(/s{2}/g, '59');
    }
});

$("#cocorahs-time").datetimepicker(
        {
        format: 'MM/DD/YYYY',
        formatDate: 'MM/DD/YYYY',
        theme:'dark',
        maxDate:0,
        timepicker:false,
        closeOnDateSelect:true,
        closeOnWithoutClick:true,
        value: moment(),
        onChangeDateTime: function(current, input) {
          if ($('.cocorahs_toggle input.cmn-toggle').is(":checked") == true) {
          removeCocorahs()
          let elem = $('#ac2-dropdown').children("option:selected").val();
          current = moment(current).format('MM/DD/YYYY');
          addCocorahs(current,elem);
          }
        },
        onGenerate: function(current, input) {
          //removeLSR()
          //addLSR(current);
        }
      }
   );

   $("#xmacis-daily").datetimepicker(
        {
        format: 'YYYY-MM-DD',
        formatDate: 'YYYY-MM-DD',
        theme:'dark',
        maxDate:0,
        timepicker:false,
        closeOnDateSelect:true,
        closeOnWithoutClick:true,
        value: moment(),
        onChangeDateTime: function(current, input) {
          // if ($('.cocorahs_toggle input.cmn-toggle').is(":checked") == true) {
          // removeCocorahs()
          // let elem = $('#ac2-dropdown').children("option:selected").val();
          // current = moment(current).format('MM/DD/YYYY');
          // addCocorahs(current,elem);
          // }
        },
        onGenerate: function(current, input) {
          //removeLSR()
          //addLSR(current);
        }
      }
   );

   $("#xmacis-monthly").datetimepicker(
        {
        format: 'YYYY-MM',
        formatDate: 'YYYY-MM-DD',
        theme:'dark',
        maxDate:0,
        timepicker:false,
        closeOnDateSelect:true,
        closeOnWithoutClick:true,
        value: moment(),
        onChangeDateTime: function(current, input) {
          // if ($('.cocorahs_toggle input.cmn-toggle').is(":checked") == true) {
          // removeCocorahs()
          // let elem = $('#ac2-dropdown').children("option:selected").val();
          // current = moment(current).format('YYYY-MM');
          // addCocorahs(current,elem);
          // }
        },
        onGenerate: function(current, input) {
          //removeLSR()
          //addLSR(current);
        }
      }
   );

    let endtime,begtime;

    fetch('https:\/\/www.ncdc.noaa.gov/swdiws/json/')
    .then(res=> res.json())
    .then(data=>{
      endtime = moment.utc(data.swdiJsonResponse.dataset[9].endDate,"YYYYMMDD")
      begtime = moment.utc(data.swdiJsonResponse.dataset[9].begDate,"YYYYMMDD")
      //return endtime;
      })
      .then(()=>{
          //console.log(endtime)
          $("#ltg-archive").datetimepicker(
              {
              format: 'M/D/YYYY h:00 A',
              formatDate: 'M/D/YYYY',
              formatTime: 'h:00',
              theme:'dark',
              maxDate:endtime._d,
              yearStart:begtime.format('YYYY'),
              yearEnd:endtime.format('YYYY'),
              minDate:begtime._d,
              closeOnDateSelect:true,
              closeOnWithoutClick:true,
              //value: endtime._d,
              onChangeDateTime: function(current, input) {
                ltgArchive = current
                // if ($('.cocorahs_toggle input.cmn-toggle').is(":checked") == true) {
                // removeCocorahs()
                // let elem = $('#ac2-dropdown').children("option:selected").val();
                // current = moment(current).format('YYYY-MM');
                // addCocorahs(current,elem);
                // }
              },
              onGenerate: function(current, input) {

              }
            }
        );
      })



     $("#historical").datetimepicker(
        {
        format: 'M/D/YYYY h:mm A',
        formatDate: 'M/D/YYYY',
        formatTime: 'HH:00',
        theme:'dark',
        maxDate:0,
        value: moment(),
        closeOnDateSelect:true,
        closeOnWithoutClick:true,
        //validateOnBlur:true,
        //onChangeDateTime:,
        onClose:function(current, input) {
          // if ($('.lsrs_toggle input.cmn-toggle').is(":checked") == true) {
          // removeLSR()
          // var hr = $('#lsr-dropdown').children("option:selected").val();
          // current = moment(current).valueOf();
          // addLSR(current,hr);
          // }
        },
        onGenerate: function(current, input) {
          //removeLSR()
          //addLSR(current);
        }
      }
   )
   $("#historical-obs").datetimepicker(
      {
      format: 'M/D/YYYY h:mm A',
      formatDate: 'M/D/YYYY',
      formatTime: 'HH:00',
      theme:'dark',
      maxDate:0,
      //yearStart:1995,
      // allowTimes: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","23:59"],
      //value: dateFormat(new Date().getTime() - (60 * 60 * 1000), "m/d/yyyy HH:00 TT"),
      //value: new Date(),
      value: moment(),
      closeOnDateSelect:true,
      closeOnWithoutClick:true,
      onChangeDateTime: function(current, input) {
        //removearchiveCR()
        var hr = $('#historical-obs').children("option:selected").val();
        current = moment(current).valueOf();

        //addarchiveCR(current);
      },
      onGenerate: function(current, input) {
      }
    }
 );

   $("#historical-radar").datetimepicker(
      {
      format: 'M/D/YYYY h:00 A',
      formatDate: 'M/D/YYYY',
      formatTime: 'HH:00',
      theme:'dark',
      maxDate:0,
      yearStart:1995,
      yearEnd: moment().format('YYYY'),
      // allowTimes: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","23:59"],
      //value: dateFormat(new Date().getTime() - (60 * 60 * 1000), "m/d/yyyy HH:00 TT"),
      //value: new Date(),
      value: moment(),
      closeOnDateSelect:true,
      closeOnWithoutClick:true,
      onChangeDateTime: function(current, input) {
        removearchiveCR()
        var hr = $('#historical-radar').children("option:selected").val();
        current = moment(current).valueOf();
        addarchiveCR(current);
      },
      onGenerate: function(current, input) {
        //removeLSR()
        //addLSR(current);
      }
    }
 );
const ROUNDING10 = 10 * 60 * 1000; /*ms*/
let MinAgo40 = moment().subtract(40,'minutes')
 $("#historical-vis").datetimepicker(
    {
    format: 'M/D/YYYY h:mm A',
    formatDate: 'M/D/YYYY',
    formatTime: 'HH:00',
    theme:'dark',
    maxDate:0,
    defaultTime: moment(Math.floor((+MinAgo40) / ROUNDING10) * ROUNDING10),
    minDate: moment().subtract(30,'days')._d,
    yearStart:moment().format('yyyy'),
    yearEnd:moment().format('yyyy'),
    value: moment(Math.floor((+MinAgo40) / ROUNDING10) * ROUNDING10),
    closeOnDateSelect:true,
    closeOnWithoutClick :true,
    onChangeDateTime: function(current, input) {
      removearchiveSat()
      //var hr = $('#historical-vis').children("option:selected").val();
      var now1 = moment(current);
      now1 = moment(Math.floor((+now1) / ROUNDING10) * ROUNDING10);
      current = moment(now1).valueOf();
      $('.arcsat1_toggle input.cmn-toggle').not(this).prop('checked', false);
      addarchiveSat(current);
    },
    onGenerate: function(current, input) {
    }
  }
);
      $.datetimepicker.setDateFormatter('moment');

      let airupdate;

      const mesoExclude =
        '!D6467,!DELMT,!LRRM8,!WRSU1,!AU034,!OCRO3,!CMRM8,!MCPA2,!NIRQ9,!WLWA2,!RRPA2,!MDEA2,!F15KX,!D1185,!C1517,!BEUO3,!UP126,!VWGI1,!AU300,!RYCI1,!ATAI1,!E9287,!LLCI1,!TR335,!WARO3,!WMSRS,!JEMC1,!CAPN2,!DYCN2,!VCEN2,!ECON2,!KLDA3,!SRP45,!SRP10,!BURN2,!UP155,!UP988,!WRGM8,!OCRO3,!OCWO3,!MNMO3,!FMBW1,!UP253,!THORS,!GRUU1,!VEYU1,!UR317,!UCL18,!UCL07,!BSAU1,!BSGU1,!HDVN2,!AMBC1,!UP986,!RHDFL,!PVPN2,!MDNN2,!RRWO3,!CWLW1,!D7537,!TLRW1,!D6863,!ALP44,!MSLW1,!NMLI1,!AS062,!UR329,!UR323,!UP732,!UP254,!MCPA2,!BCTA2,!FWLA2,!ALP55';

      const warningURL =
        'https:\/\/api.weather.gov/alerts/active?event=Dust%20Storm%20Warning,Dust%20Advisory,Flash%20Flood%20Warning,Severe%20Thunderstorm%20Warning,Tornado%20Warning,Special%20Marine%20Warning,Special%20Weather%20Statement,Severe%20Thunderstorm%20Watch,Tornado%20Watch,Flash%20Flood%20Watch,Flood%20Warning,Flood%20Advisory';
      const allhazardsURL = 'https:\/\/test.8222.workers.dev/?https:\/\/www.weather.gov/source/crh/allhazard.geojson?r='+now+''; //'https:\/\/test.8222.workers.dev/?https:\/\/www.wrh.noaa.gov/map/json/WR_All_Hazards.json'

      const barbCutoffs = [3, 5, 10, 15, 20, 25, 30, 35, 40, 45];

      $( ".fwd-button" ).click( function() {
        stop(); showFrame(animationPosition + 1); return;
      } );
      $( ".back-button" ).click( function() {
        stop(); showFrame(animationPosition - 1); return;
      } );
      $( ".play-button" ).click( function() {
        $(this).toggleClass('.play-button');
        if($(this).hasClass('.play-button')){
          $(this).text('Stop');
        } else {
          $(this).text('Play');
        }
        playStop();
      } );

      $( ".fwd-button-ir" ).click( function() {
        stopIR(); showIRFrame(animationPositionIR + 1); return;
      } );
      $( ".back-button-ir" ).click( function() {
        stopIR(); showIRFrame(animationPositionIR - 1); return;
      } );
      $( ".play-button-ir" ).click( function() {
        $(this).toggleClass('.play-button-ir');
        if($(this).hasClass('.play-button-ir')){
          $(this).text('Stop');
        } else {
          $(this).text('Play');
        }
        playStopIR();
      } );

      $( ".fwd-button-ltg" ).click( function() {
        stopLtg(); showFrameLtg(animationPositionLtg + 1); return;
      } );
      $( ".back-button-ltg" ).click( function() {
        stopLtg(); showFrameLtg(animationPositionLtg - 1); return;
      } );
      $( ".play-button-ltg" ).click( function() {
        $(this).toggleClass('.play-button-ltg');
        if($(this).hasClass('.play-button-ltg')){
          $(this).text('Stop');
        } else {
          $(this).text('Play');
        }
        playStopLtg();
      } );

      $('.glm_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addGLMOverlay()
        } else {
          removeGLM()
        }
      });

      $('.fltcat_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addCAT()
        } else {
          removeCAT()
        }
      });

      $('.stn1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          addmwStationPlot(network,dens)
        } else {
          removemwStationPlot()
        }
      });

      $('.stn_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addStationPlot()
          map.setLayoutProperty('settlement-label', 'visibility', 'none')
          removeRoads()
          $('.roads_toggle input.cmn-toggle').not(this).prop('checked', false);
        } else {
          removeStationPlot()
          map.setLayoutProperty('settlement-label', 'visibility', 'visible')
          addRoads()
          $('.roads_toggle input.cmn-toggle').not(this).prop('checked', true);
        }
      });
      $('.sigmet_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSigmet()
        } else {
          removeSigmet()
        }
      });

      $('.llws_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAirmet('LLWS','rgba(255,200,0,0.5)')
        } else {
          removeAirmet('LLWS')
        }
      });

      $('.mtnob_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAirmet('MT_OBSC','rgba(255,0,255,0.5)')
        } else {
          removeAirmet('MT_OBSC')
        }
      });

      $('.ifr_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAirmet('IFR','rgba(255,0,0,0.5)')
        } else {
          removeAirmet('IFR')
        }
      });

      $('.icing_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAirmet('ICE','rgba(0,0,255,0.5)')
        } else {
          removeAirmet('ICE')
        }
      });
      $('.turbhi_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAirmet('TURB-HI','rgba(255,100,0,0.5)')
        } else {
          removeAirmet('TURB-HI')
        }
      });

      $('.turblo_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAirmet('TURB-LO','rgba(255,130,0,0.5)')
        } else {
          removeAirmet('TURB-LO')
        }
      });

      $('.nhc_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addNHC()
        } else {
          removeNHC()
        }
      });

      $('.flts_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAircraft()
        } else {
          removeAircraft()
        }
      });

      $('.volc_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addVolcano()
        } else {
          removeVolcano()
        }
      });

      $('.ndfd_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addNDFD()
        } else {
          removeNDFD()
        }
      });

      $('.ltg72_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addLTG72()
        } else {
          removeLTG72()
        }
      });

      $('.ltg24_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addLTG(6)
        } else {
          removeLTG()
        }
      });

      $('.ssta_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSSTA()
          $('#SSTLegend').show();
        } else {
          removeSSTA()
          $('#SSTLegend').hide();
        }
      });

      $('.sice_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSeaIce()
          $('#SIceLegend').show();
        } else {
          removeSeaIce()
          $('#SIceLegend').hide();
        }
      });

      $('.davis_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addDavis()
        } else {
          removeDavis()
        }
      });

      $('.dxd_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var elem = $('#ac-dropdown').children("option:selected").val();
          var selectDate = $( "#xmacis-daily" ).val();
          addDailyXm(selectDate,elem);
          $('#xmacis-daily').on('change', function() {
            removeDailyXm();
            elem = $('#ac-dropdown').children("option:selected").val();
            selectDate = $( "#xmacis-daily" ).val();
            addDailyXm(selectDate,elem);
          });
          $('#ac-dropdown').on('change', function() {
            removeDailyXm();
            elem = $('#ac-dropdown').children("option:selected").val();
            selectDate = $( "#xmacis-daily" ).val();
            addDailyXm(selectDate,elem);
          });
        } else {
          removeDailyXm();
        }
      });

      $('.brcb_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          //removeLoop()
          $('#brloop').show();
          var elem = $('#rad-dropdown').children("option:selected").val();
          if (elem == 1){
            addBRCB()
            loopname = "Radar Base Reflectivity"
          }
          else if (elem == 2){
            addBRCBV()
            loopname = "Radar Base Velocity"
          }
          else if (elem == 3){
            addBR(0)
            loopname = "Radar Base Reflectivity"
          }
          else if (elem == 4){
            addBR(1)
            loopname = "Radar Base Reflectivity"
          }
          else if (elem == 5){
            addRIDGE2(0)
            loopname = "Radar Base Reflectivity"
          }
          else if (elem == 6){
            addRIDGE2(1)
            loopname = "Radar Base Reflectivity"
          }
          else if (elem == 7){
            addRIDGE2(2)
            loopname = "Radar Composite Reflectivity"
          }
          else if (elem == 8){
            addRIDGE2(3)
            loopname = "Radar Composite Reflectivity"
          }
          else if (elem == 9){
            addMRMS()
            loopname = "Radar Base Reflectivity"
          }

          $('#rad-dropdown').on('change', function() {
            if ($('.brcb_toggle').prop('checked')){
            removeLoop();
            elem = $('#rad-dropdown').children("option:selected").val();
            if (elem == 1){
            addBRCB()
            loopname = "Radar Base Reflectivity"
            }
            else if (elem == 2){
              addBRCBV()
              loopname = "Radar Base Velocity"
            }
            else if (elem == 3){
              addBR(0)
              loopname = "Radar Base Reflectivity"
            }
            else if (elem == 4){
              addBR(1)
              loopname = "Radar Base Reflectivity"
            }
            else if (elem == 5){
            addRIDGE2(0)
            loopname = "Radar Base Reflectivity"
            }
            else if (elem == 6){
              addRIDGE2(1)
              loopname = "Radar Base Reflectivity"
            }
            else if (elem == 7){
              addRIDGE2(2)
              loopname = "Radar Composite Reflectivity"
            }
            else if (elem == 8){
              addRIDGE2(3)
              loopname = "Radar Composite Reflectivity"
            }
            else if (elem == 9){
            addMRMS()
            loopname = "Radar Base Reflectivity"
          }
          }
          })
        } else {
          removeLoop();
          $('#brloop').hide();
        }
      });

      $('.dxm_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var elem = $('#ac1-dropdown').children("option:selected").val();
          var selectDate = $( "#xmacis-monthly" ).val();
          addMonthlyXm(selectDate,elem);
          $('#xmacis-monthly').on('change', function() {
            removeMonthlyXm();
            elem = $('#ac1-dropdown').children("option:selected").val();
            selectDate = $( "#xmacis-monthly" ).val();
            addMonthlyXm(selectDate,elem);
          });
          $('#ac1-dropdown').on('change', function() {
            removeMonthlyXm();
            elem = $('#ac1-dropdown').children("option:selected").val();
            selectDate = $( "#xmacis-monthly" ).val();
            addMonthlyXm(selectDate,elem);
          });
        } else {
          removeMonthlyXm();
        }
      });

      $('.heat_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var day = hrdropdown.prop('selectedIndex');
          var htday = moment(hrdropdown.children("option:selected").text(),'MM/DD/YYYY').format('LL');
          $('#heatDate').append(htday);
          addHIL(day)
          $('#heatLegend').show();
        } else {
          removeHIL()
          $('#heatDate').empty();
          $('#heatLegend').hide();
        }
      });

      $('.wssi_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var param = $('#wssi-dropdown').children("option:selected").val();
          addWSSI(param)
        } else {
          removeWSSI()
        }
      });

      $('#wssi-dropdown').change(function() {
        if ($('.wssi_toggle input.cmn-toggle').is(":checked") == true) {
          removeWSSI()
          var param = $('#wssi-dropdown').children("option:selected").val();
          addWSSI(param)
        }
      });

      $('.heatw_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addHeat()
        } else {
          removeHeat()
        }
      });

      $('.arcradar_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var selectDate = moment();
          addarchiveCR(selectDate)
          $('#arcradartime').show();
        } else {
          removearchiveCR()
          $('#arcradartime').hide();
        }
      });

      $('.cocorahs_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          let selectDate = $( "#cocorahs-time" ).val();
          let elem = $('#ac2-dropdown').children("option:selected").val();
          addCocorahs(selectDate,elem)
        } else {
          removeCocorahs()
        }
      });

      $('#ac2-dropdown').on('change', function() {
          if ($('.cocorahs_toggle input.cmn-toggle').is(":checked") == true) {
          removeCocorahs()
          let selectDate = $( "#cocorahs-time" ).val();
          let elem = $('#ac2-dropdown').children("option:selected").val();
          addCocorahs(selectDate,elem)
          }
      })

      $('.arcsat_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          $('#arcsat1').show();
          $('#arcsattime').show();
          var ROUNDING = 10 * 60 * 1000; /*ms*/
          var now1 = moment().subtract(40,'minutes');
          var selectDate = moment(Math.floor((+now1) / ROUNDING) * ROUNDING).valueOf();
          //var selectDate = moment();
          addarchiveSat(selectDate)
          $('.arcsat1_toggle input.cmn-toggle').not(this).prop('checked', false);
        } else {
          removearchiveSat()
          $('#arcsat1').hide();
          $('#arcsattime').hide();
        }
      });

      $('.arcsat1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          map.setLayoutProperty('arcIR', 'visibility', 'visible')
          map.setLayoutProperty('arcVis', 'visibility', 'none')
        } else {
          map.setLayoutProperty('arcIR', 'visibility', 'none')
          map.setLayoutProperty('arcVis', 'visibility', 'visible')
        }
      });

      $('.twct_toggle').on('change', 'input.cmn-toggle', function() {
        //var twctv = $('#twct').val();
        if (this.checked) {
          addTWC(11)
        } else {
          removeTWC(11)
        }
      });
      $('.twcp_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addTWC(31)
        } else {
          removeTWC(31)
        }
      });

      $('.firew_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addFireWx()
        } else {
          removeFireWx()
        }
      });

      $('.wildweb_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addWildweb()
        } else {
          removeWildweb()
        }
      });

      $('.drought_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addDrought()
        } else {
          removeDrought()
        }
      });
      $('.snowdepth_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSD(3)
          $('#sdLegend').show();
        } else {
          removeSD(3)
          $('#sdLegend').hide();
        }
      });
      $('.nwrfcsnowdepth_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addNWRFCSnotel()
          $('#swePerLegend').show();
        } else {
          removeNWRFCSnotel()
          $('#swePerLegend').hide();
        }
      });

      $('.snowdepth1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addmwSWE('snow_depth')
          addODOTObs('snow_depth')
        } else {
          removemwSWE('snow_depth')
          removeODOTObs('snow_depth')
        }
      });

      $('.snowf_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addODOTObs('snowfall')
        } else {
          removeODOTObs('snowfall')
        }
      });

      $('.swe1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addmwSWE('snow_water_equiv')
        } else {
          removemwSWE('snow_water_equiv')
        }
      });
      $('.swe_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSD(7)
          $('#sweLegend').show();
        } else {
          removeSD(7)
          $('#sweLegend').hide();
        }
      });

      $('.firedf17_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPWDF(2018)
        } else {
          removePWDF(2018)
        }
      });
      $('.firedf18_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPWDF(2019)
        } else {
          removePWDF(2019)
        }
      });
      $('.firedf19_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPWDF(2020)
        } else {
          removePWDF(2020)
        }
      });

      $('#heat-dropdown').change(function() {
        if ($('.heat_toggle input.cmn-toggle').is(":checked") == true){
        removeHIL()
        $('#heatDate').empty();
        var day = hrdropdown.prop('selectedIndex');
        var htday = moment(hrdropdown.children("option:selected").text(),'MM/DD/YYYY').format('LL');
        $('#heatDate').append(htday);
        addHIL(day)
        }
      });

      $('.pre_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var hr = $('#pre-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          var selectDate = moment($( "#historical-obs" ).val(),'M/D/YYYY h:mm A');
          addPrecip(hr,dens,network,selectDate)
        } else {
          removePrecip()
        }
      });

      $('.ua_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addUA()
        } else {
          removeUA()
        }
      });

      $('.mxg_toggle').on('change', 'input.cmn-toggle', function() {
        var x = 'gust';
        if (this.checked) {
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          var dy = $('#pre-dropdown').children("option:selected").val();
          var selectDate = moment($( "#historical-obs" ).val(),'M/D/YYYY h:mm A');
          if (dy == 240){
            window.alert("Please select less than 240 hours for Gusts, Temps.")
            $('.mxg_toggle').not(this).prop('checked', false);
            return
          } else {
            addMWStats(x,dy,dens,network,selectDate)
          }
          $('#GustLegend').show();
        } else {
          $('#GustLegend').hide();
          removeMWStats(x)
        }
      });

      $('.mxt_toggle').on('change', 'input.cmn-toggle', function() {
        var x = 'max';
        if (this.checked) {
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          var dy = $('#pre-dropdown').children("option:selected").val();
          var selectDate = moment($( "#historical-obs" ).val(),'M/D/YYYY h:mm A');
          if (dy == 240){
            window.alert("Please select less than 240 hours for Gusts, Temps.")
            $('.mxt_toggle').not(this).prop('checked', false);
            return
          }
          else {
            addMWStats(x,dy,dens,network,selectDate)
          }
        } else {
          removeMWStats(x)
        }
      });
      $('.mnt_toggle').on('change', 'input.cmn-toggle', function() {
        var x = 'min';
        if (this.checked) {
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          var dy = $('#pre-dropdown').children("option:selected").val();
          var selectDate = moment($( "#historical-obs" ).val(),'M/D/YYYY h:mm A');
          console.log(dy)
          if (dy == 240){
            window.alert("Please select less than 240 hours for Gusts, Temps.")
            $('.mnt_toggle').not(this).prop('checked', false);
            return
          } else {
            addMWStats(x,dy,dens,network,selectDate)
          }
        } else {
          removeMWStats(x)
        }
      });

      $('.mwChange_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          var dy = $('#pre-dropdown').children("option:selected").val();
          var selectDate = moment($( "#historical-obs" ).val(),'M/D/YYYY h:mm A');
          console.log(selectDate)
            addChange(network,dens,selectDate,dy)
        } else {
          removeChange()
        }
      });

      $('#day-dropdown').change(function() {
        var dy = $('#day-dropdown').children("option:selected").val();
        if ($('.mnt_toggle input.cmn-toggle').is(":checked") == true) {
          var x ='min';
          removeMinMax(x)
          addMinMax(x,dy)
        }
        if ($('.mxt_toggle input.cmn-toggle').is(":checked") == true) {
          var x ='max';
          removeMinMax(x)
          addMinMax(x,dy)
        }
        if ($('.mxg_toggle input.cmn-toggle').is(":checked") == true) {
          var x ='gust';
          removeMinMax(x)
          addMinMax(x,dy)
        }
      });

      $('#pre-dropdown').change(function() {
        if ($('.pre_toggle input.cmn-toggle').is(":checked") == true) {
        removePrecip()
        var network = $('#obnetwork-dropdown').children("option:selected").val();
        var hr = $('#pre-dropdown').children("option:selected").val();
        var dens = $('#den-dropdown').children("option:selected").val();
        var selectDate = moment($( "#historical-obs" ).val(),'M/D/YYYY h:mm A');
        addPrecip(hr,dens,network,selectDate)
      }
      else{

      }
      });

      // $('#den-dropdown').change(function() {
      //   if ($('.pre_toggle input.cmn-toggle').is(":checked") == true) {
      //   removePrecip()
      //   var hr = $('#pre-dropdown').children("option:selected").val();
      //   var dens = $('#den-dropdown').children("option:selected").val();
      //   var network = $('#obnetwork-dropdown').children("option:selected").val();
      //   addPrecip(hr,dens,network)
      // }
      // else{

      // }
      // });
      let ltgArchive;

$('.ltg1_toggle').on('change', 'input.cmn-toggle', function() {
  if (this.checked) {
    var hr = $('#lt-dropdown').children("option:selected").val();
    //console.log($( "#ltg-archive" ).val())
    var selectDate = moment(ltgArchive);
    var start = moment.utc(selectDate).subtract(hr,'hour').format('YYYYMMDDHH')
    var end = moment.utc(selectDate).format('YYYYMMDDHH')
    var starth = moment(selectDate).subtract(hr,'hour').format('lll')
    var endh = moment(selectDate).format('lll')

    addNCDCLtg(start,end)
    $('.ltgloop_toggle').show();
    $('#ltgLegend').show();
    $('#ltgLegend').empty();
    $('#ltgLegend').html(`Total Lightning Strikes: <div id="ltgCt"></div><br>Period: <b>${starth}</b> to <b>${endh}</b><br>Data Courtesy of Vaisala`);
    //$('#ltgLegend').append('Total Lightning Strikes<br>Past '+hr+' hr: <div id="ltgCt"></div>');
  } else {
    removeNCDCLtg()
    stopLtg()
    if ($('.ltgloop_toggle input.cmn-toggle').is(":checked") == true) {
            ltgtimestamps=[]
            $('.ltgloop_toggle input.cmn-toggle').not(this).prop('checked', false);
            $('#ltgLoop').hide();
          }

          $('#ltgLegend').empty();
          $('#ltgLegend').hide();
          $('.ltgloop_toggle').hide();
  }
});

$('.ltgloop_toggle').on('change', 'input.cmn-toggle', function() {
  if (this.checked) {
    ltgtimestamps=[]
    $('#ltgLoop').show();
    var hr = $('#lt-dropdown').children("option:selected").val();
    var selectDate = moment(ltgArchive);

    var startv = moment.utc(selectDate).subtract(hr,'hour').valueOf()
    for (var i=0;i<hr;i++){
      ltgtimestamps.push(moment(startv).add(i,'hour').valueOf())
    }
    showFrameLtg(0)
  } else {
    stopLtg()
    var hr = $('#lt-dropdown').children("option:selected").val();
    var selectDate = moment(ltgArchive);
    var start = moment.utc(selectDate).subtract(hr,'hour').format('YYYYMMDDHH')
    var end = moment.utc(selectDate).format('YYYYMMDDHH')
    var starth = moment(selectDate).subtract(hr,'hour').format('lll')
    var endh = moment(selectDate).format('lll')
    $('#ltgLegend').html(`Total Lightning Strikes: <div id="ltgCt"></div><br>Period: <b>${starth}</b> to <b>${endh}</b><br>Data Courtesy of Vaisala`);
    $('#ltgLoop').hide();
    map.setFilter('NCDCLtg',null)
  }
});

$('.ltg_toggle').on('change', 'input.cmn-toggle', function() {
  if (this.checked) {
    addETLNLtg()
    $('#ltgLegend').show();
    $('#ltgLegend').empty();
    $('#ltgLegend').append(`Total Lightning Strikes: <div id="ltgCt"></div><br>Total In Cloud: <div id="pulseCt"></div><br>Past 4 Hours</b><br>Data: Earth Networks, Inc.`);
    //$('#ltgLegend').append('Total Lightning Strikes<br>Past '+hr+' hr: <div id="ltgCt"></div>');
  } else {
    removeETLNLtg()
    $('#ltgLegend').empty();
    $('#ltgLegend').hide();
  }
});

$('#lt-dropdown').change(function() {
  if ($('.ltg1_toggle input.cmn-toggle').is(":checked") == true) {
  removeNCDCLtg()
  ltgtimestamps=[]
  $('.ltgloop_toggle input.cmn-toggle').not(this).prop('checked', false);
  $('#ltgLoop').hide();
  //removeLTG()
  $('#ltgLegend').empty();
  var selectDate = moment(ltgArchive);
        var hr = $(this).children("option:selected").val();
        var start = moment.utc(selectDate).subtract(hr,'hour').format('YYYYMMDDHH')
        var end = moment.utc(selectDate).format('YYYYMMDDHH')
        var starth = moment(selectDate).subtract(hr,'hour').format('M/D/YYYY h A')
        var endh = moment(selectDate).format('M/D/YYYY h A')
        //var start = moment.utc(selectDate).subtract(hr,'hour').format('M/D/YYYY H:m:s')
        //var end = moment.utc(selectDate).format('M/D/YYYY H:m:s')
        //$('#ltgLegend').append('Total Lightning Strikes<br>Past '+hr+' hr: <div id="ltgCt"></div>');
        $('#ltgLegend').append(`Total Lightning Strikes: <div id="ltgCt"></div><br>Period: <b>${starth}</b> to <b>${endh}</b><br>Data Courtesy of Vaisala`);
        addNCDCLtg(start,end)
        //addNCDCLtg(start,end)
      }
      else{
      }
      });

      $('.wpc_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var hr = $('#qp-dropdown').children("option:selected").val();
          addWPCQPF(hr)
          $('#wpcQPFLegend').show();
        } else {
          removeWPCQPF()
          $('#wpcQPFLegend').hide();
        }
      });

      $('.cpc_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var outlook = $('#cpc-dropdown').children("option:selected").val();
          //var outlookt = $('#cpc-dropdown').children("option:selected").text();
          addCPC(outlook)
          $('#cpcLegend').show();
        } else {
          removeCPC()
          $('#cpcLegend').hide();
        }
      });

      $('#qp-dropdown').change(function() {
        if ($('.wpc_toggle input.cmn-toggle').is(":checked") == true) {
        removeWPCQPF()
        var hr = $(this).children("option:selected").val();
        addWPCQPF(hr)
      }
      else{
      }
      });

      $('#cpc-dropdown').change(function() {
        if ($('.cpc_toggle input.cmn-toggle').is(":checked") == true) {
        removeCPC()
        var outlook = $('#cpc-dropdown').children("option:selected").val();
        addCPC(outlook)
      }
      else{
      }
      });

      $('.wpc1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var hr = $('#qp1-dropdown').children("option:selected").val();
          addWPCER(hr)
          $('#wpcERLegend').show();
        } else {
          removeWPCER()
          $('#wpcERLegend').hide();
        }
      });

      $('#qp1-dropdown').change(function() {
        if ($('.wpc1_toggle input.cmn-toggle').is(":checked") == true) {
        removeWPCER()
        var hr = $(this).children("option:selected").val();
        addWPCER(hr)
      }
      else{
      }
      });

      $('.aqua_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAqua(modisDate)
        } else {
          removeAqua()
        }
      });

      $('.eotrue_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEOTrue(modisDate,'1_TRUE_COLOR','Sentinel-2%20L1C')
        } else {
          removeEOTrue('1_TRUE_COLOR')
        }
      });
      $('.eotrue1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEOTrue(modisDate,'4-FALSE-COLOR-URBAN','Sentinel-2%20L1C')
        } else {
          removeEOTrue('4-FALSE-COLOR-URBAN')
        }
      });
      $('.eotrue2_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEOTrue(modisDate,'3_TRISTIMULUS','Sentinel-3%20OLCI')
        } else {
          removeEOTrue('3_TRISTIMULUS')
        }
      });
      $('.eotrue3_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEOTrue(modisDate,'4_RGB__17_5_2_','Sentinel-3%20OLCI')
        } else {
          removeEOTrue('4_RGB__17_5_2_')
        }
      });
      $('.eotrue4_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEOTrue(modisDate,'1_TRUE_COLOR','Sentinel-3%20OLCI')
        } else {
          removeEOTrue('1_TRUE_COLOR')
        }
      });
      $('.eotrue5_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEOTrue(modisDate,'WILDFIRE','Sentinel-2%20L1C')
        } else {
          removeEOTrue('WILDFIRE')
        }
      });

      $('.true_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addTRUE()
        } else {
          removeTRUE()
        }
      });

      $('.svr_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSVR()
        } else {
          removeSVR()
        }
      });

      $('.haz_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addHaz()
          $('#hazLegend').show();
        } else {
          removeHaz()
          $('#hazLegend').hide();
        }
      });

      $('.haz1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addHaz1()
          $('#hazLegend').show();
        } else {
          removeHaz1()
          $('#hazLegend').hide();
        }
      });

      $('.wcn_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addWCN()
        } else {
          removeWCN()
        }
      });

      $('.ff_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addFF()
        } else {
          removeFF()
        }
      });

      $('.sps_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSPS()
        } else {
          removeSPS()
        }
      });

      $('.air_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAQI()
          $('#AQILegend').show();
          $("#AQILegend").dblclick(function(){
            $('#AQILegend').hide();
          });

        } else {
          removeAQI()
          $('#AQILegend').hide();
        }
      });

      $('.air1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {

          $('.air2_toggle').not(this).prop('checked', false);
          addAQI1(8)
          $('#AQILegend').show();
          $('#AQILegend').dblclick(function(){
            $('#AQILegend').hide();
          });

        } else {
          removeAQI1(8)
          $('#AQILegend').hide();
        }
      });
      $('.air2_toggle').on('change', 'input.cmn-toggle', function() {

        if (this.checked) {
          $('.air1_toggle').not(this).prop('checked', false);
          addAQI1(1)
          $('#AQILegend').show();
          $('#AQILegend').dblclick(function(){
            $('#AQILegend').hide();
          });

        } else {
          removeAQI1(1)
          $('#AQILegend').hide();
        }
      });

      $('.geos_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addGEOS()
        } else {
          removeGEOS()
        }
      });
      $('.aur_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAurora()
          $('#AuroraLegend').show();
        } else {
          removeAurora()
          $('#AuroraLegend').hide();
        }
      });

      $('.fire_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addFire()
          $('#fireLegend').show();
          $('#fireLegend').empty();
          $('#fireLegend').append(`Total Fires: <div id="fireCt"></div> &emsp; Total Cost to Date: $<div id="costTot"></div> &emsp; Total Personnel: <div id="personnelTot"></div> &emsp; Total Acres: <div id="acreTot"></div>`);
        } else {
          removeFire()
          $('#fireLegend').empty();
          $('#fireLegend').hide();
        }
      });

      $('.fire3_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addFireP()
        } else {
          removeFireP()
        }
      });
      $('.fire4_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addFireDispatch()
        } else {
          removeFireDispatch()
        }
      });
      $('.fire2_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addInterra()
        } else {
          removeInterra()
        }
      });

      $('.fpi_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addFPI()
          $('#FPILegend').show();
        } else {
          removeFPI()
          $('#FPILegend').hide();
        }
      });

      $('.cam_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addCam()
        } else {
          removeCam()
        }
      });

      $('.hydro1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addReservoir()
        } else {
          removeReservoir()
        }
      });
      $('.hydro2_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAHPS()
          $('#AHPSLegend').show();
        } else {
          removeAHPS()
          $('#AHPSLegend').hide();
        }
      });
      $('.hydro3_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addRiver()
        } else {
          removeRiver()
        }
      });

      $('.nws_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          $('#logo').show();
        } else {
          $('#logo').hide();
        }
      });

      $('.mf_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addThermal()
        } else {
          removeThermal()
        }
      });

      $('.spot_toggle').on('click', 'input.cmn-toggle', function() {
        if (this.checked) {
          addSpots()
        } else {
          removeSpots()
        }
      });

      $('.inci_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addInciWeb()
        } else {
          removeInciWeb()
        }
      });

      $('.fire1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addGBCC()
        } else {
          removeGBCC()
        }
      });

      $('.terra_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addTerra(modisDate)
        } else {
          removeTerra()
        }
      });
      $('.terra-snow_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addTerraSnow(modisDate)
        } else {
          removeTerraSnow()
        }
      });

      $('.viirs_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addVIIRS(modisDate,'VIIRS_NOAA20_CorrectedReflectance_TrueColor')
        } else {
          removeVIIRS()
        }
      });

      $('.viirs_toggle2').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addVIIRS(modisDate,'VIIRS_SNPP_DayNightBand_ENCC')
        } else {
          removeVIIRS()
        }
      });

      $('.wv_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addWV()
        } else {
          removeWV()
        }
      });

      $('.ir_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addIR()
        } else {
          removeIR()
        }
      });

      $('.vis_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addVis()
        } else {
          removeVis()
        }
      });

      $('.gcw_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addGCW()
        } else {
          removeGCW()
        }
      });

      $('.mrms_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addMRMS()
          $('#mrmsLoop').show();
        } else {
          removeLoop()
          $('#mrmsLoop').hide();
        }
      });

      $('.mrms1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var hr = $('#mr-dropdown').children("option:selected").val();
          addMRMS1(hr)
          $('#mrmsQPFLegend').show();
        } else {
          removeMRMS1()
          $('#mrmsQPFLegend').hide();
        }
      });

      $('#mr-dropdown').change(function() {
        if ($('.mrms1_toggle input.cmn-toggle').is(":checked") == true) {
        removeMRMS1()
        var hr = $(this).children("option:selected").val();
        addMRMS1(hr)
      }
      else{
      }
      });

      $('.cr_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addCR()
        } else {
          removeCR()
        }
      });

      $('.br_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addBR(0)
          $('#brloop').show();
        } else {
          removeLoop()
            $('#brloop').hide();
        }
      });

      $('.cbxv_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addLatestCBX(9)
        } else {
          removeLatestCBX(9)
        }
      });

      $('.cbxr_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addLatestCBX(5)
        } else {
          removeLatestCBX(5)
        }
      });

      $('.br1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addBR(1)
          $('#brloop1').show();
          } else {
          removeLoop()
          $('#brloop1').hide();
        }
      });



      // $('.brloop_toggle').on('change', 'input.cmn-toggle', function() {
      //   if (this.checked) {
      //     addBRLoop()
      //     $('#slider').show();
      //     console.log('Added BR')
      //   } else {
      //     removeBRLoop()
      //     $('#slider').hide();
      //     console.log('Removed BR')
      //   }
      // });

      $('.irloop_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var opts = $('#ir-dropdown').children("option:selected").val();
          if (opts == 0) {
            addSWIRLoop()
            loopname = "Shortwave Infrared"
          }
          if (opts == 1) {
            addWVLoop()
            loopname = "Mid-Level Water Vapor"
          }
          if (opts == 2) {
            addIRLoop()
            loopname = "Infrared Satellite"
          }
          $('#irLoop').show();
        } else {
          removeLoop()
          $('#irLoop').hide();
        }
      });

      $('.irloop2_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var opts = $('#ir-dropdown1').children("option:selected").val();
          loopname = "Infrared Satellite"
          if (opts == 0) {
            addIRLoop2("NASA")
            $('#irLoop2').show();
          }
          if (opts == 1) {
            addIRLoop2("Pink")
            $('#irLoop2').show();
          }
          if (opts == 2) {
            addIRLoop2("Seahawk")
            $('#irLoop2').show();
          }
          if (opts == 3) {
            addIRLoop2("Turbo")
            $('#irLoop2').show();
          }
          //$('#irLoop').show();
        } else {
          removeIRLoop()
          $('#irLoop2').hide();
        }
      });

      $('.msmoke_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          $('#smokeloop').show();
          var elem = $('#smoke-dropdown').children("option:selected").val();
          if (elem == 1){
            addHRRRSmoke('vi_smoke')
            loopname = "HRRR Total Smoke"
          }
          if (elem == 2){
            addHRRRSmoke('sfc_smoke')
            loopname = "HRRR Surface Smoke"
          }
          if (elem == 3){
            addHRRRSmoke('sfc_visibility')
            loopname = "HRRR Surface Visibility"
          }
          else if (elem == 4){
            addFirework()
            loopname = "Canadian Firework Total Smoke"
          }
        } else {
          removeLoop()
          $('#smokeloop').hide();
        }
      });

      $('#smoke-dropdown').on('change', function() {
            if ($('.msmoke_toggle').prop('checked')){
            removeLoop();
            var elem = $('#smoke-dropdown').children("option:selected").val();
            if (elem == 1){
            addHRRRSmoke()
            }
            else if (elem == 2){
              addFirework()
            }
            }
      })

                $('.hrrrg_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if ($('.hrrrt_toggle input.cmn-toggle').is(":checked") == true) {
            removeLoop()
            $('#hrrrt').hide();
            $('#HRRRtLegend').hide();
            $('.hrrrt_toggle input.cmn-toggle').not(this).prop('checked', false);
        }
        addHRRRGust()
        $('#hrrrg').show();
        } else {
          removeLoop()
          $('#hrrrg').hide();
        }
      });
      $('.hrrrt_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if ($('.hrrrg_toggle input.cmn-toggle').is(":checked") == true) {
            removeLoop()
            $('#hrrrg').hide();
            //$('#HRRRtLegend').hide();
            $('.hrrrg_toggle input.cmn-toggle').not(this).prop('checked', false);
        }
        addHRRRTemp()
        $('#hrrrt').show();
        $('#HRRRtLegend').show();
        } else {
          removeLoop()
          $('#hrrrt').hide();
          $('#HRRRtLegend').hide();
          $('.hrrrg_toggle input.cmn-toggle').not(this).prop('checked', false);
        }
      });

      $('.hires_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if (($('.hrrrt_toggle input.cmn-toggle').is(":checked") == true) || ($('.hrrrg_toggle input.cmn-toggle').is(":checked") == true)) {
            removeLoop()
            $('#hrrrt').hide();
            $('#HRRRtLegend').hide();
            $('#hrrrg').hide();
            $('.hrrrt_toggle input.cmn-toggle').not(this).prop('checked', false);
        }
        addHires()
        $('#hires').show();
        } else {
          removeLoop()
          $('#hires').hide();
        }
      });

      $('.gcloop_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addGCLoop()
          $('#gcloop').show();
        } else {
          removeLoop()
          $('#gcloop').hide();
        }
      });

      $( ".loop_create" ).click( function() {
        console.log('loop click')
        createLoop()
      } );

      $( ".screen_cap" ).click( function() {
        createScreenCap()
      } );

      $( ".loop_createIR" ).click( function() {
        console.log('loop click')
        createLoopIR()
      } );

      $('.wvloop_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addWVLoop()
          $('#wvLoop').show();
        } else {
          removeLoop()
          $('#wvLoop').hide();
        }
      });

      $('.visloop_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addVisLoop()
          $('#visLoop').show();
        } else {
          removeLoop()
          $('#visLoop').hide();
        }
      });

      $('.lsrs_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var hr = $('#lsr-dropdown').children("option:selected").val();
          // $('#historical').on('change', function() {
          //   removeLSR();
          //   //elem = $('#ac-dropdown').children("option:selected").val();
          //   selectDate = $( "#historical" ).val();
          //   addLSR(selectDate);
          // });
          //selectDate = moment.utc.valueOf(),
          //$('#lsrtime').show()
          $('#lsrsnowLegend').show();
          var selectDate = moment($( "#historical" ).val(),'M/D/YYYY h:mm A');
          console.log(selectDate)
          addLSR(selectDate,hr)
        } else {
          removeLSR()
          //$('#lsrtime').hide()
          $('#lsrsnowLegend').hide();
        }
      });

      $('.snowana_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var period = $( "#snowana-dropdown" ).val();
          addSnowAna(period)
          $('#nohrscsnowLegend').show();
        } else {
          removeSnowAna()
          $('#nohrscsnowLegend').hide();
        }
      });

      $('#snowana-dropdown').change(function() {
        if ($('.snowana_toggle input.cmn-toggle').is(":checked") == true) {
        removeSnowAna()
        var period = $( "#snowana-dropdown" ).val();
        addSnowAna(period)
      }
      else{
      }
      });

      $('.avalanche_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addAvalanche()
          $('#avaLegend').show();
          $("#avaLegend").dblclick(function(){
            $('#avaLegend').hide();
          });
        } else {
          removeAvalanche()
          $('#avaLegend').hide();
        }
      });

      $('#lsr_dropdown').change(function() {
          if ($('.lsrs_toggle input.cmn-toggle').is(":checked") == true) {
          var hr = $('#lsr-dropdown').children("option:selected").val();
          removeLSR();
          var selectDate = moment($( "#historical" ).val(),'M/D/YYYY h:mm A');
          addLSR(selectDate,hr)
        } else {
        }
      });

      $('.pty_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPTY()
        } else {
          removePTY()
        }
      });

      // $('.brcb_toggle').on('change', 'input.cmn-toggle', function() {
      //   if (this.checked) {
      //     addBRCB()
      //     $('#brloop2').show();
      //   } else {
      //     removeLoop()
      //     //removeBRCB()
      //     $('#brloop2').hide();
      //   }
      // });


      $('.eq_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEarthquake('week')
        } else {
          removeEarthquake('week')
        }
      });

      $('.eq2_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEarthquakear()
        } else {
          removeEarthquakear()
        }
      });

      $('.ptclick_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPointandClick('NWQ42019')
          $('#ptclickLegend').show()
          $('.dark_toggle input.cmn-toggle').not(this).prop('checked', true);
          map.setLayoutProperty('dark', 'visibility', 'visible')
          map.setLayoutProperty('water-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label', 'visibility', 'none')
        } else {
          removePtClk('NWQ42019')
          $('#ptclickLegend').hide()
          $('.dark_toggle input.cmn-toggle').not(this).prop('checked', false);
          map.setLayoutProperty('dark', 'visibility', 'none')
          map.setLayoutProperty('water-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label', 'visibility', 'visible')
        }
      });
      $('.ptclick2_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPointandClick('BOISum2019')
          $('#ptclickLegend').show();
          $('.dark_toggle input.cmn-toggle').not(this).prop('checked', true);
          map.setLayoutProperty('dark', 'visibility', 'visible')
          map.setLayoutProperty('water-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label', 'visibility', 'none')

        } else {
          removePtClk('BOISum2019')
          $('#ptclickLegend').hide()
          $('.dark_toggle input.cmn-toggle').not(this).prop('checked', false);
          map.setLayoutProperty('dark', 'visibility', 'none')
          map.setLayoutProperty('water-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label', 'visibility', 'visible')
        }
      });
      $('.ptclick3_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPointandClick('NWQ12020')
          $('#ptclickLegend').show();
          $('.dark_toggle input.cmn-toggle').not(this).prop('checked', true);
          map.setLayoutProperty('dark', 'visibility', 'visible')
          map.setLayoutProperty('water-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label', 'visibility', 'none')
        } else {
          removePtClk('NWQ12020')
          $('#ptclickLegend').hide()
          $('.dark_toggle input.cmn-toggle').not(this).prop('checked', false);
          map.setLayoutProperty('dark', 'visibility', 'none')
          map.setLayoutProperty('water-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label', 'visibility', 'visible')
        }
      });
      $('.eqm_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addEarthquake('month')
        } else {
          removeEarthquake('month')
        }
      });

      $('.pwsp_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPWSPrec()
        } else {
          removePWSPrec()
        }
      });

      $('.eqp_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addPlates()
        } else {
          removePlates()
        }
      });

      $('.bvcb_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addBRCBV()
          $('#brloop3').show()
          //addBVCB()
        } else {
          removeLoop()
          $('#brloop3').hide()
          //removeBVCB()
        }
      });

      $('.pw_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addGFSPW()
        } else {
          removeGFSPW()
        }
      });

      $('.spc1_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          $('#spcDate').empty();
          addSPC(1)
          $('#spcLegend').show();
          var valid = moment().format('LL');
          $('#spcDate').append(valid);
        } else {
          removeSPC()
          $('#spcDate').empty();
          $('#spcLegend').hide();
        }
      });

      $('.spc2_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          $('#spcDate').empty();
          addSPC(2)
          $('#spcLegend').show();
          var valid = moment().add(1, 'day').format('LL');
          $('#spcDate').append(valid);
        } else {
          removeSPC()
          $('#spcDate').empty();
          $('#spcLegend').hide();
        }
      });

      $('.temp_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if ($('.gust_toggle input.cmn-toggle').is(":checked") == true) {
            $('.gust_toggle input.cmn-toggle').not(this).prop('checked', false);
            removeMWGusts()
          }
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          addMWTemps(network,dens)
        } else {
          removeMWTemps()
          if ($('.gust_toggle input.cmn-toggle').is(":checked") == false) {
            removeMesoWest()
          }
        }
      });

      $('.meso_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          var variable = $('#mw-dropdown').children("option:selected").val();
          if (variable==1){
            addMesowest(network,dens,'air_temp')
          }
          else if (variable==2){
            addMesowest(network,dens,'dew_point_temperature_d')
          }
          else if (variable==3){
            addMesowest(network,dens,'gusts')
          }
          else if (variable==4){
            addMesowest(network,dens,'vis')
          }
          else if (variable==5){
            addMesowest(network,dens,'relh')
          }
          else if (variable==6){
            addMesowest(network,dens,'wind_chill_d')
          }
        } else {
          removeMesoWest()
        }
      });

      $('#obnetwork-dropdown').on('change', function() {
        if ($('.temp_toggle input.cmn-toggle').is(":checked") == true) {
          removeMWTemps()
          removeMesoWest()
          var network = $( "#obnetwork-dropdown" ).val();
          var dens = $('#den-dropdown').children("option:selected").val();
          addMWTemps(network,dens)
        }
        if ($('.gust_toggle input.cmn-toggle').is(":checked") == true) {
          removeMWGusts()
          removeMesoWest()
          var network = $( "#obnetwork-dropdown" ).val();
          var dens = $('#den-dropdown').children("option:selected").val();
          addMWGusts(network,dens)
        }
        if ($('.pre_toggle input.cmn-toggle').is(":checked") == true) {
          removePrecip()
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var hr = $('#pre-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          var selectDate = moment($( "#historical-obs" ).val(),'M/D/YYYY h:mm A');
          addPrecip(hr,dens,network,selectDate)
        }
      })

      $('.gust_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if ($('.temp_toggle input.cmn-toggle').is(":checked") == true) {
            $('.temp_toggle input.cmn-toggle').not(this).prop('checked', false);
            removeMWTemps()
          }
          var network = $('#obnetwork-dropdown').children("option:selected").val();
          var dens = $('#den-dropdown').children("option:selected").val();
          addMWGusts(network,dens)
        } else {
          removeMWGusts()
          if ($('.temp_toggle input.cmn-toggle').is(":checked") == false) {
            removeMesoWest()
          }
        }
      });

      $('.pws_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if ($('.pwsg_toggle input.cmn-toggle').is(":checked") == true) {
            $('.pwsg_toggle input.cmn-toggle').not(this).prop('checked', false);
            removePWSG()
          }
          if ($('.pwsd_toggle input.cmn-toggle').is(":checked") == true) {
            $('.pwsd_toggle input.cmn-toggle').not(this).prop('checked', false);
            removePWSD()
          }
          addPWST()
        } else {
          removePWST()
        }
      });

      $('.pwsg_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if ($('.pws_toggle input.cmn-toggle').is(":checked") == true) {
            $('.pws_toggle input.cmn-toggle').not(this).prop('checked', false);
            removePWST()
          }
          if ($('.pwsd_toggle input.cmn-toggle').is(":checked") == true) {
            $('.pwsd_toggle input.cmn-toggle').not(this).prop('checked', false);
            removePWSD()
          }
          addPWSG()
        } else {
          removePWSG()
        }

      });

      $('.pwsd_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          if ($('.pws_toggle input.cmn-toggle').is(":checked") == true) {
            $('.pws_toggle input.cmn-toggle').not(this).prop('checked', false);
            removePWST()
          }
          if ($('.pwsg_toggle input.cmn-toggle').is(":checked") == true) {
            $('.pwsg_toggle input.cmn-toggle').not(this).prop('checked', false);
            removePWSG()
          }
          addPWSD()
        } else {
          removePWSD()
        }

      });

      $('.cwa_toggle').on('change', 'input.cmn-toggle', function() {
        $('.cwa_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('CWA', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('CWA', 'visibility', 'none')
        }
      });

      $('.fwz_toggle').on('change', 'input.cmn-toggle', function() {
        $('.fwz_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('FWZones', 'visibility', 'visible')
          map.setLayoutProperty('FWZNames', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('FWZones', 'visibility', 'none')
          map.setLayoutProperty('FWZNames', 'visibility', 'none')
        }
      });

      $('.fzone_toggle').on('change', 'input.cmn-toggle', function() {
        $('.fzone_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('FcstZones', 'visibility', 'visible')
          map.setLayoutProperty('ZoneNames', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('FcstZones', 'visibility', 'none')
          map.setLayoutProperty('ZoneNames', 'visibility', 'none')
        }
      });

      $('.peaks_toggle').on('change', 'input.cmn-toggle', function() {
        $('.peaks_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('natural-label-1', 'visibility', 'visible')
          map.setLayoutProperty('natural-label-2', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('natural-label-1', 'visibility', 'none')
          map.setLayoutProperty('natural-label-2', 'visibility', 'none')
        }
      });

      $('.traffic_toggle').on('change', 'input.cmn-toggle', function() {
        $('.traffic_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('Traffic', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('Traffic', 'visibility', 'none')
        }
      });

      $('.terrain_toggle').on('change', 'input.cmn-toggle', function() {
        //$('.terrain_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('Terrain', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('Terrain', 'visibility', 'none')
        }
      });
      $('.elevation_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          $('.terrain_toggle input.cmn-toggle').not(this).prop('checked', false);
          map.setLayoutProperty('Terrain', 'visibility', 'none')
          addElevation()
        } else {
          $('.terrain_toggle input.cmn-toggle').not(this).prop('checked', true);
          map.setLayoutProperty('Terrain', 'visibility', 'visible')
          removeElevation()
        }
      });

      $('.slope_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          $('.terrain_toggle input.cmn-toggle').not(this).prop('checked', false);
          map.setLayoutProperty('Terrain', 'visibility', 'none')
          addSlope()
        } else {
          $('.terrain_toggle input.cmn-toggle').not(this).prop('checked', true);
          map.setLayoutProperty('Terrain', 'visibility', 'visible')
          removeSlope()
        }
      });

      $('.roads_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked) {
          addRoads()
        } else {
          removeRoads()
        }
      });

      $('.urban_toggle').on('change', 'input.cmn-toggle', function() {
        $('.urban_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          addUrban()
        } else {
          removeUrban()
        }
      });

      $('.stream_toggle').on('change', 'input.cmn-toggle', function() {
        $('.stream_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          addStreamer()
        } else {
          removeStreamer()
        }
      });

      $('.dark_toggle').on('change', 'input.cmn-toggle', function() {
        $('.dark_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('dark', 'visibility', 'visible')
          map.setLayoutProperty('water-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label', 'visibility', 'none')
        } else {
          map.setLayoutProperty('dark', 'visibility', 'none')
          map.setLayoutProperty('water-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'none')
          map.setLayoutProperty('settlement-label', 'visibility', 'visible')
        }
      });

      $('.grey_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked){
          map.setLayoutProperty('water-gray', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('water-gray', 'visibility', 'none')
        }
      });

      $('.county_toggle').on('change', 'input.cmn-toggle', function() {
        if (this.checked){
          map.setLayoutProperty('counties', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('counties', 'visibility', 'none')
        }
      });

      $('.sate_toggle').on('change', 'input.cmn-toggle', function() {
        $('.sate_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('mapbox-satellite', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('mapbox-satellite', 'visibility', 'none')
        }
      });

      $('.sate_toggle1').on('change', 'input.cmn-toggle', function() {
        $('.sate_toggle1 input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('mapbox-satellitedark', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('mapbox-satellitedark', 'visibility', 'none')
        }
      });

      $('.strava_toggle').on('change', 'input.cmn-toggle', function() {
        $('.strava_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          addStrava()
        } else {
          removeStrava()
        }
      });

      $('.closure_toggle').on('change', 'input.cmn-toggle', function() {
        $('.closure_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          map.setLayoutProperty('Closures', 'visibility', 'visible')
          addITD()
          //$('#closures2').show();
          $('#roadLegend').show();
        } else {
          map.setLayoutProperty('Closures', 'visibility', 'none')
          removeITD()
          //$('#closures2').hide();
          $('#roadLegend').hide();
        }
      });

      $('.closure2_toggle').on('change', 'input.cmn-toggle', function() {
         if (this.checked) {
          map.setLayoutProperty('ITD', 'visibility', 'visible')
         } else {
          map.setLayoutProperty('ITD', 'visibility', 'none')
        }
      });

      $('.conds_toggle').on('change', 'input.cmn-toggle', function() {
        $('.conds_toggle input.cmn-toggle').not(this).prop('checked', false);
        if (this.checked) {
          addRoadC()
          $('#roadcLegend').show();
        } else {
          removeRoadC()
          $('#roadcLegend').hide();
        }
      });

      (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.mapboxgl = global.mapboxgl || {}));
}(this, function (exports) { 'use strict';

    class TextureLayer {
        constructor(id, tileJson, onAddCallback, renderCallback, preRenderCallback) {
            this.map = null;
            this.gl = null;
            this.id = id;
            this.tileSource = null;
            this.source = this.id; //+ 'Source';
            this.type = 'custom';
            this.renderingMode = '2d';
            this.tileJson = tileJson;
            this.program = null;
            this.onAddCallback = onAddCallback;
            this.renderCallback = renderCallback;
            this.preRenderCallback = preRenderCallback;
        }
        onAdd(map, gl) {
            this.map = map;
            this.gl = gl;
            map.on('move', this.move.bind(this));
            map.on('zoom', this.zoom.bind(this));

            map.addSource(this.source, this.tileJson);
            this.tileSource = this.map.getSource(this.source);
            this.tileSource.on('data', this.onData.bind(this));
            this.sourceCache = this.map.style._sourceCaches[`other:${this.source}`];

            // !IMPORTANT! hack to make mapbox mark the sourceCache as 'used' so it will initialise tiles.
            this.map.style._layers[this.id].source = this.source;
            if (this.onAddCallback)
                this.onAddCallback(map, gl);
        }
        move(e) {
          if (this.map.isSourceLoaded(this.id)){
              this.updateTiles();
            }
        }
        zoom(e) {

        }
        onRemove(map,gl){
          this.map = map;
          this.gl = gl;
          //map.removeLayer(this.id)
          //map.removeSource(this.source)
        }
        onData(e) {
            if (e.sourceDataType == 'content')
                this.updateTiles();
        }
        updateTiles() {
            this.sourceCache.update(this.map.painter.transform);
            this.map.style._layers[this.id].source = this.source;
        }
        prerender(gl, matrix) {
            if (this.preRenderCallback)
                this.preRenderCallback(gl, matrix, this.sourceCache.getVisibleCoordinates().map(tileid => this.sourceCache.getTile(tileid)));
        }
        render(gl, matrix) {
          let tiles = this.sourceCache.getVisibleCoordinates().map(tileid => this.sourceCache.getTile(tileid));
          let tiles2Render = tiles.filter(t => !this.sourceCache.hasRenderableParent(t.tileID));
          let zoom = this.map.getZoom();
          let children = tiles.filter(coord => {return coord.tileID.canonical.z == Math.round(zoom);})
          let parents = tiles.filter(tile => {return children.includes(tile)})
          if (this.renderCallback)
            //this.renderCallback(gl, matrix, tiles);
            this.renderCallback(gl, matrix, tiles2Render);
          //   this.renderCallback(gl, matrix, this.sourceCache.getVisibleCoordinates().map(tileid => this.sourceCache.getTile(tileid)));
        }
    }

    exports.TextureLayer = TextureLayer;

    Object.defineProperty(exports, '__esModule', { value: true });

}));

      var vertexSource = `
    attribute vec2 aPos;
    uniform mat4 uMatrix;
    varying vec2 vTexCoord;
    float Extent = 8192.0;
    void main() {
        vec4 a = uMatrix * vec4(aPos * Extent, 0, 1);
        gl_Position = vec4(a.rgba);
        vTexCoord = aPos;
    }
`

var fragmentSource = `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
//     float colormap_red(float x) {
//     return (1.0 + 1.0 / 63.0) * x - 1.0 / 63.0;
// }

// float colormap_green(float x) {
//     return -(1.0 + 1.0 / 63.0) * x + (1.0 + 1.0 / 63.0);
// }

// vec4 colormap(float x,float a) {
//     float r = clamp(colormap_red(x), 0.0, 1.0);
//     float g = clamp(colormap_green(x), 0.0, 1.0);
//     float b = 1.0;
//     return vec4(r, g, b, a);
// }

//https:\/\/observablehq.com/@flimsyhat/webgl-color-maps
// Copyright 2019 Google LLC.
// SPDX-License-Identifier: Apache-2.0

// Polynomial approximation in GLSL for the Turbo colormap
// Original LUT: https:\/\/gist.github.com/mikhailov-work/ee72ba4191942acecc03fe6da94fc73f

// Authors:
//   Colormap Design: Anton Mikhailov (mikhailov@google.com)
//   GLSL Approximation: Ruofei Du (ruofei@google.com)
vec4 turbo_map(float x,float a) {
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973);

  x = clamp(x,0.0,1.0);
  vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec4(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2),
    a
  );
}

//Magma
vec3 magma_map(float t) {
    const vec3 c0 = vec3(-0.002136485053939582, -0.000749655052795221, -0.005386127855323933);
    const vec3 c1 = vec3(0.2516605407371642, 0.6775232436837668, 2.494026599312351);
    const vec3 c2 = vec3(8.353717279216625, -3.577719514958484, 0.3144679030132573);
    const vec3 c3 = vec3(-27.66873308576866, 14.26473078096533, -13.64921318813922);
    const vec3 c4 = vec3(52.17613981234068, -27.94360607168351, 12.94416944238394);
    const vec3 c5 = vec3(-50.76852536473588, 29.04658282127291, 4.23415299384598);
    const vec3 c6 = vec3(18.65570506591883, -11.48977351997711, -5.601961508734096);

    return c0+t*(c1+t*(c2+t*(c3+t*(c4+t*(c5+t*c6)))));
}
//plasma
vec3 plasma_map(float t) {
const vec3 c0 = vec3(0.2777273272234177, 0.005407344544966578, 0.3340998053353061);
const vec3 c1 = vec3(0.1050930431085774, 1.404613529898575, 1.384590162594685);
const vec3 c2 = vec3(-0.3308618287255563, 0.214847559468213, 0.09509516302823659);
const vec3 c3 = vec3(-4.634230498983486, -5.799100973351585, -19.33244095627987);
const vec3 c4 = vec3(6.228269936347081, 14.17993336680509, 56.69055260068105);
const vec3 c5 = vec3(4.776384997670288, -13.74514537774601, -65.35303263337234);
const vec3 c6 = vec3(-5.435455855934631, 4.645852612178535, 26.3124352495832);

return c0+t*(c1+t*(c2+t*(c3+t*(c4+t*(c5+t*c6)))));
}

//korri fave
// vec3 firstColor = vec3(0.00,0.00,0.00);
// vec3 c1 = vec3(1.00,1.00,1.00);
// vec3 c2 = vec3(0.00,0.35,1.00);
// vec3 c3 = vec3(0.00,0.00,0.00);
// vec3 endColor = vec3(0.00,1.00,0.00);
// float c1_pos = 0.40;
// float c2_pos = 0.60;
// float c3_pos = 0.80;

// vec3 custcolor_map(float st) {
//   return mix(
//          mix(
//          mix(
//          mix(firstColor, c1, st/c1_pos),
//          mix(c1, c2, (st - c1_pos)/(c2_pos - c1_pos)),
//          step(c1_pos, st)),
//          mix(c2, c3, (st - c2_pos)/(c3_pos - c2_pos)),
//          step(c2_pos, st)),
//          mix(c3, endColor, (st - c3_pos)/(1.0 - c3_pos)),
//          step(c3_pos, st));
// }

vec3 firstColor = vec3(0.00,0.00,0.00);
vec3 c1 = vec3(1.00,0.00,0.00);//red
vec3 c2 = vec3(1.00,1.00,0.00);//yello
vec3 c3 = vec3(0.00,1.00,0.00);//green
vec3 c4 = vec3(0.00,0.00,0.00);
vec3 c5 = vec3(0.00,0.22,1.00);
vec3 c6 = vec3(1.00,1.00,1.00);
vec3 endColor = vec3(0.00,0.00,0.00);
float c1_pos = 0.07;
float c2_pos = 0.18;
float c3_pos = 0.25;
float c4_pos = 0.45;
float c5_pos = 0.71;
float c6_pos = 0.85;

vec3 custcolor_map(float st) {
  return mix(
         mix(
         mix(
         mix(
         mix(
         mix(
         mix(firstColor, c1, st/c1_pos),
         mix(c1, c2, (st - c1_pos)/(c2_pos - c1_pos)),
         step(c1_pos, st)),
         mix(c2, c3, (st - c2_pos)/(c3_pos - c2_pos)),
         step(c2_pos, st)),
         mix(c3, c4, (st - c3_pos)/(c4_pos - c3_pos)),
         step(c3_pos, st)),
         mix(c4, c5, (st - c4_pos)/(c5_pos - c4_pos)),
         step(c4_pos, st)),
         mix(c5, c6, (st - c5_pos)/(c6_pos - c5_pos)),
         step(c5_pos, st)),
         mix(c6, endColor, (st - c6_pos)/(1.0 - c6_pos)),
         step(c6_pos, st));
}

    void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        gl_FragColor = vec4(pow(custcolor_map(color.r), vec3(1.0/2.2)), 1.0);
        //gl_FragColor = turbo_map(color.r,color.a);
        //gl_FragColor = color_map(color.r, color.a);
        //gl_FragColor = vec4(1.0-color.r, 1.0-color.g, 1.0-color.b, color.a);
    }
     `

      var program = {};
function setupLayer(map, gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    program.aPos = gl.getAttribLocation(program, "aPos");
    program.uMatrix = gl.getUniformLocation(program, "uMatrix");
    program.uTexture = gl.getUniformLocation(program, "uTexture");

    const vertexArray = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

    program.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, program.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
}
function render(gl, matrix, tiles) {
    gl.useProgram(program);
    tiles.forEach(tile => {
        if (!tile.texture) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tile.texture.texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.bindBuffer(gl.ARRAY_BUFFER, program.vertexBuffer);
        gl.enableVertexAttribArray(program.a_pos);
        gl.vertexAttribPointer(program.aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(program.uMatrix, false, tile.tileID.projMatrix);
        gl.uniform1i(program.uTexture, 0);
        gl.depthFunc(gl.LESS);
        //gl.enable(gl.BLEND);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

    });
}


      function addSPC(day) {
        if (day == 1) {
          var la = 1;
        }
        if (day == 2) {
          var la = 9;
        }
        if (day == 3) {
          var la = 22;
        }

        var layers = map.getStyle().layers;
        loadingSpinner(true);

        map.addLayer({
          'id': 'SPC',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
              'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/SPC_wx_outlks/MapServer/export?dpi=96&transparent=true&format=png32&layers=show:'+la+'&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
              //'https:\/\/idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/SPC_wx_outlks/MapServer/WMSServer?bbox={bbox-epsg-3857}&service=WMS&request=GetMap&version=1.3.0&layers=show:' + la +'&styles=&format=image/png&transparent=true&height=512&width=512&crs=EPSG:3857'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, 'water');
        map.on('render', stopSpinner);
      }


      function removeSPC() {
        map.removeLayer('SPC')
        map.removeSource('SPC')
      }

      function removeNDFD() {
        map.removeLayer('NDFD')
        map.removeSource('NDFD')
      }

      function addNDFD(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);

        map.addLayer({
          'id': 'NDFD',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
              'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NDFD_temp/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A127&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
              //'https:\/\/idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/SPC_wx_outlks/MapServer/WMSServer?bbox={bbox-epsg-3857}&service=WMS&request=GetMap&version=1.3.0&layers=show:' + la +'&styles=&format=image/png&transparent=true&height=512&width=512&crs=EPSG:3857'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, 'water');
        map.on('render', stopSpinner);

      }

      function addLTG72() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'LTG72',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
              'https:\/\/egp.nwcg.gov/arcgis/rest/services/Lightning/LightningStrikes_Current_LV/MapServer/export?bbox={bbox-epsg-3857}&size=512,512&bboxSR=3857&imageSR=3857&format=png&f=image&transparent=true'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removeLTG72() {
        map.removeLayer('LTG72')
        map.removeSource('LTG72')
      }

      function addLTG(hr) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currd = moment.utc().format('YYYY-MM-DD HH:mm');
        var hm1 = moment.utc().subtract(hr,'hour').format('YYYY-MM-DD HH:mm');

        map.addLayer({
          'id': 'LTG1',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Lightning past '+hr+' hr. Valid: <b>'+hm1+' to '+currd+'</b>',
            'tiles': [
              //'https:\/\/egp.nwcg.gov/arcgis/rest/services/Lightning/LightningStrikes_Current_LV/MapServer/export?dynamicLayers=%5B%7B%22id%22%3A0%2C%22name%22%3A%22Current%20Lightning%22%2C%22source%22%3A%7B%22type%22%3A%22mapLayer%22%2C%22mapLayerId%22%3A0%7D%2C%22definitionExpression%22%3A%22TimeStamp%20BETWEEN%20timestamp%20%27'+ hm1 +':00%27%20AND%20timestamp%20%27'+currd+':00%27%22%2C%22drawingInfo%22%3A%7B%22renderer%22%3A%7B%22type%22%3A%22uniqueValue%22%2C%22field1%22%3A%22Polarity%22%2C%22field2%22%3Anull%2C%22field3%22%3Anull%2C%22fieldDelimiter%22%3A%22%2C%22%2C%22defaultSymbol%22%3Anull%2C%22defaultLabel%22%3Anull%2C%22uniqueValueInfos%22%3A%5B%7B%22value%22%3A%22N%22%2C%22symbol%22%3A%7B%22color%22%3A%5B255%2C0%2C197%2C255%5D%2C%22size%22%3A4.5%2C%22angle%22%3A0%2C%22xoffset%22%3A0%2C%22yoffset%22%3A0%2C%22type%22%3A%22esriSMS%22%2C%22style%22%3A%22esriSMSCircle%22%2C%22outline%22%3A%7B%22color%22%3A%5B153%2C153%2C153%2C64%5D%2C%22width%22%3A0.75%2C%22type%22%3A%22esriSLS%22%2C%22style%22%3A%22esriSLSSolid%22%7D%7D%2C%22label%22%3A%22Negative%22%7D%2C%7B%22value%22%3A%22P%22%2C%22symbol%22%3A%7B%22color%22%3A%5B0%2C112%2C255%2C255%5D%2C%22size%22%3A5.25%2C%22angle%22%3A0%2C%22xoffset%22%3A0%2C%22yoffset%22%3A0%2C%22type%22%3A%22esriSMS%22%2C%22style%22%3A%22esriSMSCircle%22%2C%22outline%22%3A%7B%22color%22%3A%5B153%2C153%2C153%2C64%5D%2C%22width%22%3A0.75%2C%22type%22%3A%22esriSLS%22%2C%22style%22%3A%22esriSLSSolid%22%7D%7D%2C%22label%22%3A%22Positive%22%7D%5D%7D%7D%2C%22minScale%22%3A0%2C%22maxScale%22%3A0%7D%5D&dpi=96&transparent=true&format=png32&layers=show%3A0&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&layerDefs=%7B%220%22%3A%22TimeStamp%20BETWEEN%20timestamp%20%27'+ hm1 +':00%27%20AND%20timestamp%20%27'+currd+':00%27%22%7D&f=image'
              'https:\/\/egp.nwcg.gov/arcgis/rest/services/Lightning/LightningStrikes_Current_LV/MapServer/export?bbox={bbox-epsg-3857}&size=512,512&bboxSR=3857&imageSR=3857&format=png&f=image&transparent=true&layerDefs=%7B%220%22%3A%22TimeStamp%20BETWEEN%20timestamp%20%27'+ hm1 +':00%27%20AND%20timestamp%20%27'+currd+':00%27%22%7D&dynamicLayers=%5B%7B%22id%22%3A0%2C%22name%22%3A%22Current%20Lightning%22%2C%22source%22%3A%7B%22type%22%3A%22mapLayer%22%2C%22mapLayerId%22%3A0%7D%2C%22definitionExpression%22%3A%22TimeStamp%20BETWEEN%20timestamp%20%27'+ hm1 +':00%27%20AND%20timestamp%20%27'+currd+':00%27%22%2C%22drawingInfo%22%3A%7B%22renderer%22%3A%7B%22type%22%3A%22uniqueValue%22%2C%22field1%22%3A%22Polarity%22%2C%22field2%22%3Anull%2C%22field3%22%3Anull%2C%22fieldDelimiter%22%3A%22%2C%22%2C%22defaultSymbol%22%3Anull%2C%22defaultLabel%22%3Anull%2C%22uniqueValueInfos%22%3A%5B%7B%22value%22%3A%22N%22%2C%22symbol%22%3A%7B%22color%22%3A%5B197%2C0%2C255%2C255%5D%2C%22size%22%3A4.5%2C%22angle%22%3A0%2C%22xoffset%22%3A0%2C%22yoffset%22%3A0%2C%22type%22%3A%22esriSMS%22%2C%22style%22%3A%22esriSMSCircle%22%2C%22outline%22%3A%7B%22color%22%3Anull%2C%22width%22%3A0.9975%2C%22type%22%3A%22esriSLS%22%2C%22style%22%3A%22esriSLSNull%22%7D%7D%2C%22label%22%3A%22Negative%22%7D%2C%7B%22value%22%3A%22P%22%2C%22symbol%22%3A%7B%22color%22%3A%5B255%2C0%2C197%2C255%5D%2C%22size%22%3A4.5%2C%22angle%22%3A0%2C%22xoffset%22%3A0%2C%22yoffset%22%3A0%2C%22type%22%3A%22esriSMS%22%2C%22style%22%3A%22esriSMSCircle%22%2C%22outline%22%3A%7B%22color%22%3Anull%2C%22width%22%3A0.9975%2C%22type%22%3A%22esriSLS%22%2C%22style%22%3A%22esriSLSNull%22%7D%7D%2C%22label%22%3A%22Positive%22%7D%5D%7D%7D%2C%22minScale%22%3A0%2C%22maxScale%22%3A0%7D%5D&f=image'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, firstSymbolId);
        //ltgCt();
        map.on('render', stopSpinner);
        //$( ".ltg input[type=submit], .ltg a, .ltg ltg-button" ).button();
        $( ".ltg-button" ).click( function() {
          $('#ltgLegend').show();
          ltgCt();
          //event.preventDefault();
        } );

        function ltgCt(){
          $('#ltgCt').empty();
          var s = map.getBounds().getSouth().toFixed(2);
          var n = map.getBounds().getNorth().toFixed(2);
          var w = map.getBounds().getWest().toFixed(2);
          var e = map.getBounds().getEast().toFixed(2);
          fetch('https:\/\/test.8222.workers.dev/?https:\/\/egp.nwcg.gov/arcgis/rest/services/Lightning/LightningStrikes_Current_LV/MapServer/0/query?where=(TimeStamp%20BETWEEN%20timestamp%20%27'+ hm1 +':00%27%20AND%20timestamp%20%27'+currd+':00%27)%20AND%20(1%3D1)&text=&objectIds=&time=&geometry='+w+','+s+','+e+','+n+'&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=pjson')
          .then(res => res.json())
          .then(data => {
              $('#ltgCt').append(data.count);
          })
        }
      }


      function removeLTG() {
        map.removeLayer('LTG1')
        map.removeSource('LTG1')
      }

      function addHeat(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addSource('HeatWarn', {
          type: 'geojson',
          data: allhazardsURL,
          attribution: 'Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
        });
        map.addLayer({
          'id': 'HeatWarn',
          'type': 'fill',
          'source':'HeatWarn',
          'paint':{
            'fill-color': ['get','wwa_rgba'],
          },
          'filter': [
            'any',
            ['==', 'phenomenon', 'Heat'],
            ['==', 'phenomenon', 'Excessive Heat']
          ],
        }, lastSymbolId);

        map.addLayer({
          'id': 'HeatWarn1',
          'type': 'symbol',
          'source':'HeatWarn',
          'layout':{
            'text-field':'{phenomenon} {significance}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint':{
            'text-color':'#000'
          //  'text-color':['get','wwa_rgba'],
          //  'line-width':4,
          },
          'filter': [
            'any',
            ['==', 'phenomenon', 'Heat'],
            ['==', 'phenomenon', 'Excessive Heat']
          ]
        }, lastSymbolId);
        map.on('render', stopSpinner);
      }

      function removeHeat(){
        map.removeLayer('HeatWarn')
        map.removeLayer('HeatWarn1')
        map.removeSource('HeatWarn')
      }

      function addLSR(valid,span){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }
        var d1 = moment.utc(valid).format('YYYYMMDDHH:mm')
        var d2 = moment.utc(valid).subtract(span,'hours').format('YYYYMMDDHH:mm')

        map.addSource('LSR', {
          type: 'geojson',
          data: 'https:\/\/mesonet.agron.iastate.edu/geojson/lsr.php?sts='+d2+'&ets='+d1+'',
          attribution: 'Valid: <b>'+ moment(valid).subtract(span,'hours').format('MMMM Do YYYY, h:mm a')+ ' - ' + moment(valid).format('MMMM Do YYYY, h:mm a') + '</b>',
        });
        map.addLayer({
          'id': 'LSR',
          'type': 'circle',
          'source': 'LSR',
          'layout':{
            'circle-sort-key': ['to-number', ['get', 'magnitude']],
          },
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 10,
              7, 14,
              11, 20,
            ],
            'circle-color': [
              'step',
                ['to-number',['get','magnitude']],
                'rgba(255,255,255,0.0)',
                0.1, 'rgba(150,150,150,1.0)',
                1, 'rgba(200,200,200,1.0)',
                2, 'rgba(50,150,255,1.0)',
                3, 'rgba(0,100,225,1.0)',
                4, 'rgba(60,52,212,1.0)',
                6, 'rgba(121,26,233,1.0)',
                8, 'rgba(182,0,255,1.0)',
                12, 'rgba(255,0,255,1.0)',
                18.0, 'rgba(212,0,114,1.0)',
                24.0, 'rgba(191,0,32,1.0)',
                36.0, 'rgba(120,0,0,1.0)',
            ],
            //'circle-blur': 0.4,
          },
          'filter':['==','type', 'S'],
        }, 'settlement-label');

        map.addLayer({
          'id': 'LSR1',
          'type': 'symbol',  //line or fill
          'source':'LSR',
          'minzoom': 6,
          'layout':{
            //'text-offset': [0, 1.5],
            //'text-allow-overlap': true,
            'symbol-sort-key': ['-',['to-number', ['get', 'magnitude']]],
            'text-field':'{magnitude}"',
            // 'text-field': ['number-format', ['to-number', ['get', 'magnitude']], {
            //   'min-fraction-digits': 0.1,
            //   'max-fraction-digits': 1
            // }],
            'text-font': [
              "Lato Black",
              "Source Sans Pro Black",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 12,
              7,20,
              12, 42,
            ],
          },
          'paint':{
            //'text-color': 'rgba(0,0,0,1)',
            'text-color': 'rgba(255,255,255,1)',
            'text-halo-color': 'rgba(0,0,0,1)',
            'text-halo-width': 1.0,
            'text-halo-blur': 1,
          },
          'filter': ['==', 'type', 'S']
        },'settlement-label');


        map.on('render', stopSpinner);

        var popup =  new mapboxgl.Popup({closeButton: false})
        map.on('mouseenter', 'LSR', function(e) {

            popup.setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.city + ' - '+e.features[0].properties.magnitude+'" </div>'+moment(e.features[0].properties.valid).format('MMMM Do YYYY, h:mm a')+'<br>'+e.features[0].properties.remark+'')
            .addTo(map);
        });

        map.on('mouseenter', 'LSR', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'LSR', function() {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

        var ar = ['all',[]];
        ar[1].push('==', 'type', 'S')
        map.on('dblclick','LSR',function(e){
          var stid = e.features[0].id;
          var stn = ['!=', '$id', e.features[0].id];

          ar.push(stn);
          console.table(ar);
          map.setFilter('LSR', ar
          );

          map.setFilter('LSR1', ar
          );
        })

      }

      function removeLSR(){
        map.removeLayer('LSR')
        map.removeLayer('LSR1')
        map.removeSource('LSR')
      }

      function addHaz(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }
        let geojson;
        fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.wrh.noaa.gov/map/json/WR_All_Hazards.json')
          .then(res=>res.json())
          .then(data=>geojson=data)
          .then(()=>{
            geojson.features.forEach((elem)=>{
              elem.properties.COLOR = `#${elem.properties.COLOR}`
            })

            map.addSource('Haz', {
              type: 'geojson',
              data: geojson,
             // attribution: 'Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
            });
            map.addLayer({
              'id': 'Haz',
              'type': 'fill',  //line or fill
              'source':'Haz',
              'paint':{
                'fill-color': ['get','COLOR'],
              },
            //  'filter': ['==', 'phenomenon', 'Heat']
            }, lastSymbolId);

                    //var popup =  new mapboxgl.Popup({closeButton: false})
        //map.on('mouseenter', 'Haz', function(e) {
        map.on('click', 'Haz', function(e) {
          new mapboxgl.Popup({closeButton: false})
            .setLngLat(e.lngLat)
            //popup.setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.PROD_TYPE+'</div>')
            //+ '</div>Issued: <b>'+moment(e.features[0].properties.issuance).format('MMMM Do YYYY, h:mm a')+'</b><br>Expires: <b>'+moment(e.features[0].properties.issuance).format('MMMM Do YYYY, h:mm a'))
            .addTo(map);
        });

        map.on('mouseenter', 'Haz', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Haz', function() {
          map.getCanvas().style.cursor = '';
          //popup.remove();
        });

        var ar = ["all"];
        map.on('dblclick','Haz',function(e){
          var stid = e.features[0].properties.PROD_TYPE;
          var stn = ['!=', 'PROD_TYPE', e.features[0].properties.PROD_TYPE];

          ar.push(stn);
          console.table(ar);
          map.setFilter('Haz', ar
          );

          map.setFilter('Haz', ar
          );
        });


        function hazLegend(){
          if (map.getSource('Haz') && map.isSourceLoaded('Haz')){
                  let mapBounds = map.getBounds();
                  let hazards
                  //let lhtml = '<div id="HazLegend">'
                  let lhtml = '<b>Current Hazards</b>'
                  hazards = map.queryRenderedFeatures({ layers: ['Haz'] }) //[map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())]
                  let newElement = []
                  hazards.forEach(element => {
                    var feature = element.properties;
                    newElement.push(feature.PROD_TYPE+':'+feature.COLOR)
                  })
                  let haznames = [...new Set(newElement)]
                  haznames.sort()
                  let ret= []
                  haznames.map(function(item) {
                  let x = item.split(':');
                    ret.push(x)
                  })
                  ret.forEach(element => {
                    lhtml += '<div><span style="background-color:'+element[1]+'"></span>'+element[0]+'</div>'
                  })

                  $('#hazLegend').empty();
                  $('#hazLegend').append(lhtml);
                }
        }
        map.on('render', stopSpinner)
        map.once('idle', hazLegend)
        map.on('moveend', hazLegend)

          })






      }

      function removeHaz(){
        map.removeLayer('Haz')
        //map.removeLayer('Haz1')
        map.removeSource('Haz')
      }

      function addHaz1(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addSource('Haz1', {
          type: 'geojson',
          data: allhazardsURL,
          attribution: 'Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
        });
        map.addLayer({
          'id': 'Haz1',
          'type': 'fill',  //line or fill
          'source':'Haz1',
          'paint':{
            'fill-color': ['get','color'],
          },
        //  'filter': ['==', 'phenomenon', 'Heat']
        }, lastSymbolId);

        //var popup =  new mapboxgl.Popup({closeButton: false})
        //map.on('mouseenter', 'Haz', function(e) {
        map.on('click', 'Haz1', function(e) {
          new mapboxgl.Popup({closeButton: false})
            .setLngLat(e.lngLat)
            //popup.setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.phenomenon+' '+e.features[0].properties.significance) //+ '</div>Issued: <b>'+moment(e.features[0].properties.issuance).format('MMMM Do YYYY, h:mm a')+'</b><br>Expires: <b>'+moment(e.features[0].properties.issuance).format('MMMM Do YYYY, h:mm a'))
            .addTo(map);
        });

        map.on('mouseenter', 'Haz1', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Haz1', function() {
          map.getCanvas().style.cursor = '';
          //popup.remove();
        });

        var ar = ["all"];
        map.on('dblclick','Haz1',function(e){
          var stid = e.features[0].properties.phenomenon;
          var stn = ['!=', 'phenomenon', e.features[0].properties.phenomenon];

          ar.push(stn);
          console.table(ar);
          map.setFilter('Haz1', ar
          );

          map.setFilter('Haz1', ar
          );
        });

        // map.addLayer({
        //   'id': 'Haz1',
        //   'type': 'symbol',  //line or fill
        //   'source':'Haz',
        //   'layout':{
        //     'text-field':'{phenomenon} {significance}',
        //     'text-font': [
        //       "Open Sans Condensed Bold",
        //       "Arial Unicode MS Bold"
        //     ],
        //     'text-size': 12,
        //   },
        //   'paint':{
        //     'text-color':'#000'
        //   //  'text-color':['get','wwa_rgba'],
        //   //  'line-width':4,
        //   },
        //   //'filter': ['==', 'phenomenon', 'Heat']
        // }, lastSymbolId);
        function hazLegend1(){
          if (map.getSource('Haz1') && map.isSourceLoaded('Haz1')){
                  let mapBounds = map.getBounds();
                  let hazards
                  //let lhtml = '<div id="HazLegend">'
                  let lhtml = '<b>Current Hazards</b>'
                  hazards = map.queryRenderedFeatures({ layers: ['Haz1'] }) //[map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())]
                  let newElement = []
                  hazards.forEach(element => {
                    var feature = element.properties;
                    newElement.push(feature.phenomenon+' '+feature.significance+':'+feature.color)
                  })
                  let haznames = [...new Set(newElement)]
                  haznames.sort()
                  let ret= []
                  haznames.map(function(item) {
                  let x = item.split(':');
                    ret.push(x)
                  })
                  ret.forEach(element => {
                    lhtml += '<div><span style="background-color:'+element[1]+'"></span>'+element[0]+'</div>'
                  })

                  $('#hazLegend').empty();
                  $('#hazLegend').append(lhtml);
                }
        }
        map.on('render', stopSpinner)
        map.once('idle', hazLegend1)
        map.on('moveend', hazLegend1)
      }

      function removeHaz1(){
        map.removeLayer('Haz1')
        //map.removeLayer('Haz1')
        map.removeSource('Haz1')
      }

      function addFireWx(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addSource('FireWx', {
          type: 'geojson',
          data: allhazardsURL,
          attribution: 'Fire Wx Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
        });
        map.addLayer({
          'id': 'FireWx',
          'type': 'fill',  //line or fill
          'source':'FireWx',
          'paint':{
            'fill-color': ['get','wwa_rgba'],
          },
          'filter': ['any',
            ['==', 'phenomenon', 'Fire Weather'],
            ['==', 'phenomenon', 'Red Flag'],
          ],
        }, lastSymbolId);

        map.addLayer({
          'id': 'FireWx1',
          'type': 'symbol',  //line or fill
          'source':'FireWx',
          'layout':{
            'text-field':'{phenomenon} {significance}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint':{
            'text-color':'#000'
          },
          'filter': ['any',
            ['==', 'phenomenon', 'Fire Weather'],
            ['==', 'phenomenon', 'Red Flag'],
          ],
        }, lastSymbolId);
        map.on('render', stopSpinner);
      }

      function removeFireWx(){
        map.removeLayer('FireWx')
        map.removeLayer('FireWx1')
        map.removeSource('FireWx')
      }
      function addFF(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addSource('FF', {
          type: 'geojson',
          data: allhazardsURL,
          attribution: 'Watches Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
        });
        map.addLayer({
          'id': 'FF',
          'type': 'fill',  //line or fill
          'source':'FF',
          'paint':{
            'fill-color': ['get','wwa_rgba'],
          },
          'filter': ['all',
          ['any',
            ['==', 'phenomenon', 'Flood'],
            ['==', 'phenomenon', 'Flash Flood'],
          ], ['any',
            ['==', 'significance', 'Watch'],
            ['==', 'significance', 'Warning'],
            ['==', 'significance', 'Advisory']
          ]],
        }, lastSymbolId);

        map.addLayer({
          'id': 'FF1',
          'type': 'symbol',  //line or fill
          'source':'FF',
          'layout':{
            'text-field':'{phenomenon} {significance}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint':{
            'text-color':'#000'
          //  'text-color':['get','wwa_rgba'],
          //  'line-width':4,
          },
          'filter': ['all',
          ['any',
            ['==', 'phenomenon', 'Flood'],
            ['==', 'phenomenon', 'Flash Flood'],
          ], ['any',
            ['==', 'significance', 'Watch'],
            ['==', 'significance', 'Warning'],
          ]],
        }, lastSymbolId);
        map.on('render', stopSpinner);
        // map.on('click', 'WCN', function(e) {
        //   new mapboxgl.Popup({maxWidth:'400px'})
        //     .setLngLat(e.lngLat)
        //     .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.headline + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.description+'</span>')
        //     .addTo(map);
        // });

        // map.on('mouseenter', 'WCN', function() {
        //   map.getCanvas().style.cursor = 'pointer';
        // });

        // map.on('mouseleave', 'WCN', function() {
        //   map.getCanvas().style.cursor = '';
        // });
      }

      function removeFF(){
        map.removeLayer('FF')
        map.removeLayer('FF1')
        map.removeSource('FF')
      }

      function addWCN(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addSource('WCN', {
          type: 'geojson',
          data: allhazardsURL,
          attribution: 'Watches Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
        });
        map.addLayer({
          'id': 'WCN',
          'type': 'fill',  //line or fill
          'source':'WCN',
          'paint':{
            'fill-color': ['get','wwa_rgba'],
          },
          'filter': ['all',
          ['any',
            ['==', 'phenomenon', 'Severe Thunderstorm'],
            ['==', 'phenomenon', 'Tornado'],
          ],
            ['==', 'significance', 'Watch'],
          ],
        }, lastSymbolId);

        map.addLayer({
          'id': 'WCN1',
          'type': 'symbol',  //line or fill
          'source':'WCN',
          'layout':{
            'text-field':'{phenomenon} {significance}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint':{
            'text-color':'#000'
          //  'text-color':['get','wwa_rgba'],
          //  'line-width':4,
          },
          'filter': ['all',
          ['any',
            ['==', 'phenomenon', 'Severe Thunderstorm'],
            ['==', 'phenomenon', 'Tornado'],
          ],
            ['==', 'significance', 'Watch'],
          ],
        }, lastSymbolId);
        map.on('render', stopSpinner);
        // map.on('click', 'WCN', function(e) {
        //   new mapboxgl.Popup({maxWidth:'400px'})
        //     .setLngLat(e.lngLat)
        //     .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.headline + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.description+'</span>')
        //     .addTo(map);
        // });

        // map.on('mouseenter', 'WCN', function() {
        //   map.getCanvas().style.cursor = 'pointer';
        // });

        // map.on('mouseleave', 'WCN', function() {
        //   map.getCanvas().style.cursor = '';
        // });
      }

      function removeWCN(){
        map.removeLayer('WCN')
        map.removeLayer('WCN1')
        map.removeSource('WCN')
      }

      var svrtimer;
      function addSVR() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        if (map.getSource('Warnings') && map.isSourceLoaded('Warnings')) {
          console.log('Warnings already loaded!');
        } else {
          map.addSource('Warnings', {
            type: 'geojson',
            data: warningURL,
            attribution: 'Warnings Updated: <b>'+ moment(warningURL.updated).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(warningURL.updated).fromNow() + '</b>',
          });
        }
        map.addLayer({
          'id': 'SVROutline',
          'type': 'line',
          'source': 'Warnings',
          'paint': {
            'line-color': [
              'match',
              ['get', 'event'],
              'Severe Thunderstorm Warning', 'rgba(0, 0, 0, 1)',
              'Tornado Warning', 'rgba(0, 0, 0, 1)',
              'Tornado Emergency', 'rgba(0, 0, 0, 1)',
              'Flash Flood Warning', 'rgba(0, 0, 0, 1)',
              'Special Marine Warning', 'rgba(0,0,0,1)',
              'Dust Advisory', 'rgba(0,0,0,1)',
              'Dust Storm Warning', 'rgba(0,0,0,1)',
              'rgba(0,0,0,0)'
            ],
            'line-width': 7.5,
          },
        }, firstSymbolId);
        map.addLayer({
          'id': 'SVR',
          'type': 'line',
          'source': 'Warnings',
          'paint': {
            'line-color': [
              'match',
              ['get', 'event'],
              'Severe Thunderstorm Warning', 'rgba(255, 255, 0, 1)',
              'Tornado Warning', 'rgba(255, 0, 0, 1)',
              'Tornado Emergency', 'rgba(255, 0, 255, 1)',
              'Flash Flood Warning', 'rgba(0, 255, 0, 1)',
              'Special Marine Warning', 'rgba(250,200,0,1)',
              'Dust Advisory', 'rgba(189,183,107,1)',
              'Dust Storm Warning', 'rgba(189,183,107,1)',
              'rgba(0,0,0,0)'
            ],
            'line-width': 4,
          },
        }, firstSymbolId);

        map.on('render', stopSpinner);
        svrtimer = window.setInterval(function() {
          map.getSource('Warnings').setData(warningURL);
        }, 120000);
        map.on('click', 'SVR', function(e) {
          new mapboxgl.Popup({maxWidth:'400px'})
            .setLngLat(e.lngLat)
            .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.headline + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.description+'</span>')
            .addTo(map);
        });

        map.on('mouseenter', 'SVR', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'SVR', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function removeSVR() {
        window.clearInterval(svrtimer)
        map.removeLayer('SVR')
        map.removeLayer('SVROutline')
        map.removeSource('Warnings')
      }

      var spstimer;
      function addSPS() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        if (map.getSource('Warnings') && map.isSourceLoaded('Warnings')) {
          console.log('Warnings already loaded!');
        } else {
          map.addSource('Warnings', {
            type: 'geojson',
            data: warningURL,
            attribution: 'Warnings Updated: <b>'+ moment(warningURL.updated).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(warningURL.updated).fromNow() + '</b>',
          });
        }
        map.addLayer({
          'id': 'SPSOutline',
          'type': 'line',
          'source': 'Warnings',
          'paint': {
            'line-color': [
              'match',
              ['get', 'event'],
              'Special Weather Statement', 'rgba(0, 0, 0, 0.20)',
              'rgba(0,0,0,0)'
            ],
            'line-width': 7.5,
          },

        }, firstSymbolId);

        map.addLayer({
          'id': 'SPS',
          'type': 'line',
          'source': 'Warnings',
          'paint': {
            'line-color': [
              'match',
              ['get', 'event'],
              'Special Weather Statement', 'rgba(255, 255, 175, 1)',
              'rgba(0,0,0,0)'
            ],
            'line-width': 4,
          },
        }, firstSymbolId);
        map.on('render', stopSpinner);
        spstimer = window.setInterval(function() {
          map.getSource('Warnings').setData(warningURL);
        }, 120000);

        map.on('click', 'SPS', function(e) {
          new mapboxgl.Popup({maxWidth:'400px'})
            .setLngLat(e.lngLat)
            .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.headline + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.description+'</span>')
            .addTo(map);
        });

        map.on('mouseenter', 'SPS', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'SPS', function() {
          map.getCanvas().style.cursor = '';
        });

      }

      function removeSPS() {
        window.clearInterval(spstimer)
        map.removeLayer('SPS')
        map.removeLayer('SPSOutline')
        map.removeSource('Warnings')
      }

      function AQIPM25(Concentration){
          if (Concentration === 'null'){
            return null
          }
          var Conc=parseFloat(Concentration);
          var c;
          var AQI;
          c=(Math.floor(10*Conc))/10;
          if (c>=0 && c<12.1){
          	AQI=Linear(50,0,12,0,c);
          }
          else if (c>=12.1 && c<35.5){
          	AQI=Linear(100,51,35.4,12.1,c);
          }
          else if (c>=35.5 && c<55.5){
          	AQI=Linear(150,101,55.4,35.5,c);
          }
          else if (c>=55.5 && c<150.5){
          	AQI=Linear(200,151,150.4,55.5,c);
          }
          else if (c>=150.5 && c<250.5){
          	AQI=Linear(300,201,250.4,150.5,c);
          }
          else if (c>=250.5 && c<350.5){
          	AQI=Linear(400,301,350.4,250.5,c);
          }
          else if (c>=350.5 && c<500.5){
          	AQI=Linear(500,401,500.4,350.5,c);
          }
          else
          {
          	return null;
          }
          return AQI;
        }

      function Linear(AQIhigh, AQIlow, Conchigh, Conclow, Concentration) {
        let linear;
        let Conc=parseFloat(Concentration);
        let a=((Conc-Conclow)/(Conchigh-Conclow))*(AQIhigh-AQIlow)+AQIlow;
        linear=Math.round(a);
        return linear;
      }

      function addAQI1(opt){
        loadingSpinner(true);
        var aqgeojson = {
          type: "FeatureCollection",
          features: [],
        };

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.purpleair.com/data.json')
          .then(res => res.json())
          .then(data => data.data.forEach(function(d) {
            aqgeojson.features.push({
                 "type": "Feature",
                 "geometry": {
                   "type": "Point",
                   "coordinates": [Number(d[26]), Number(d[25])]
                },
                "properties": {
                    "name": d[24],
                    "age": Number(d[2]),
                    "AQI": AQIPM25(Number(d[opt])),
                    }
            })
            })
          )
            .then(() => map.addSource('AQI2'+opt, {
              type: 'geojson',
              data: aqgeojson,
            }))
            .then(() => addAQ())
            .catch(error => window.alert("Problem Loading Data."))

            function addAQ(){
            map.addLayer({
              'id': 'AQI2'+opt,
              'type': 'circle',
              'source': 'AQI2'+opt,
              'layout':{
                'circle-sort-key': ['to-number', ['get', 'AQI']],
              },
              'paint': {
                "circle-radius": [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 4,
                  7, 12,
                  11, 20,
                ],
                'circle-stroke-width':1,
                'circle-stroke-color':'rgba(0,0,0,.5)',
                'circle-color': {
                  property: 'AQI',
                  stops: [
                    [-999,'rgba(190,190,190,1)'],
                    [0, "#0f0"],
                    [49, "#0f0"],
                    [51, "#ff0"],
                    [99, "#ff0"],
                    [100, "#ff7f00"],
                    [149, "#ff7f00"],
                    [151, "#ff0000"],
                    [199, "#ff0000"],
                    [201, "rgb(143,63,151)"],
                    [299, "rgb(143,63,151)"],
                    [301, "rgb(126,0,35)"],
                    [5000, "rgb(126,0,35)"]
                  ],
                  default: 'rgba(0,0,0,0.10)',
                }
              },
              'filter': ['<', 'age', 100],
            }, 'settlement-label')

            map.addLayer({
              'id': 'AQI21'+opt,
              'type': 'symbol',
              'source': 'AQI2'+opt,
              'minzoom':6,
              'layout':{
                'symbol-sort-key': ['-',['to-number', ['get', 'AQI']]],
                'text-allow-overlap': false,
                'text-field': '{AQI}',
                'text-font': [
                  "Open Sans Condensed",
                ],
                'text-size': [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 12,
                  7, 16,
                  11, 20,
                ],
              },
              'paint': {
                'text-color': 'rgba(0,0,0,1)',
                //'text-halo-color': 'rgba(0,0,0,1)',
                //'text-halo-width': 1.5,
                //'text-halo-blur': 1,
              },
              'filter': ['<', 'age', 100],
              //'filter':['!=', 'OZONEPM_AQI_LABEL', 'ND']
            });

            map.on('render', stopSpinner);
          }

      }
      function removeAQI1(opt) {
        map.removeLayer('AQI2'+opt)
        map.removeLayer('AQI21'+opt)
        map.removeSource('AQI2'+opt)
      }

      function AQICat(Concentration){
          if (Concentration === 'null'){
            return null
          }
          var Conc=parseFloat(Concentration);
          var Cat;
          if (Conc >= 0 && Conc < 50){
            Cat = 'Good'
          }
          else if (Conc >= 51 && Conc < 100){
            Cat = 'Moderate'
          }
          else if (Conc >= 101 && Conc < 150){
            Cat = 'Unhealthy for Sensitive Groups'
          }
          else if (Conc >= 151 && Conc < 200){
            Cat = 'Unhealthy'
          }
          else if (Conc >= 200 && Conc < 300){
            Cat = 'Very Unhealthy'
          }
          else if (Conc >= 300 && Conc < 500){
            Cat = 'Hazardous'
          }
          else
          {
          	return null;
          }
          return Cat;
        }

      function addAQI() {
        loadingSpinner(true);
        let airnowgeojson,airsisgeojson,wrccgeojson,
        purpleairgeojson = {
          type: "FeatureCollection",
          features: [],
        };
        Promise.all([
        fetch('https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/maps/geobuf/airnow_PM2.5_latest10.pbf').then(res=>res.arrayBuffer()).then(data=>{airnowgeojson = geobuf.decode(new Pbf(data))}),
        d3.csv('https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/maps/purple_air/v2/pas.csv').then((data)=>{data.forEach(d => {
              let time = moment.utc(d.utc_ts,'YYYY/MM/DD hh:mm:ss').format()
              let diff = moment().diff(time,'hours')
                purpleairgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.longitude),Number(d.latitude)]
                  },
                  "properties": {
                      "PM2.5_nowcast": AQIPM25(d.epa_nowcast),
                      "age": diff,
                      "lastValidUTCTime": time,
                      "sensor_index":d.sensor_index
                      }
              })
              })
            }),
        //fetch('https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/maps/geobuf/purple_air_epa_qc.pbf').then(res=>res.arrayBuffer()).then(data=>{purpleairgeojson = geobuf.decode(new Pbf(data))}),
        fetch('https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/maps/geobuf/airsis_PM2.5_latest10.pbf').then(res=>res.arrayBuffer()).then(data=>{airsisgeojson = geobuf.decode(new Pbf(data))}),
        fetch('https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/maps/geobuf/wrcc_PM2.5_latest10.pbf').then(res=>res.arrayBuffer()).then(data=>{wrccgeojson = geobuf.decode(new Pbf(data))})
      ]).then(()=>{
        console.log(airnowgeojson,purpleairgeojson,airsisgeojson)

        airnowgeojson.features.forEach(element=>{
          let time = moment.utc(element.properties['lastValidUTCTime'],'YYYY/MM/DD hh:mm:ss').format()
          let diff = moment().diff(time,'hours')
          element.properties["PM2.5_nowcast"] = AQIPM25(element.properties["PM2.5_nowcast"])
          element.properties["age"] = diff;
        })
        // purpleairgeojson.features.forEach(element=>{
        //   let time = moment.utc(element.properties['lastValidUTCTime'],'YYYY/MM/DD hh:mm:ss').format()
        //   let diff = moment().diff(time,'hours')
        //   element.properties["PM2.5_nowcast"] = AQIPM25(element.properties["PM2.5_nowcast"])
        //   element.properties["age"] = diff;
        // })
        airsisgeojson.features.forEach(element=>{
          let time = moment.utc(element.properties['lastValidUTCTime'],'YYYY/MM/DD hh:mm:ss').format()
          let diff = moment().diff(time,'hours')
          element.properties["PM2.5_nowcast"] = AQIPM25(element.properties["PM2.5_nowcast"])
          element.properties["age"] = diff;
        })
        wrccgeojson.features.forEach(element=>{
          let time = moment.utc(element.properties['lastValidUTCTime'],'YYYY/MM/DD hh:mm:ss').format()
          let diff = moment().diff(time,'hours')
          element.properties["PM2.5_nowcast"] = AQIPM25(element.properties["PM2.5_nowcast"])
          element.properties["age"] = diff;
        })
        map.addSource('airnow', {
          type: 'geojson',
          data: airnowgeojson
        })
        map.addSource('purple', {
          type: 'geojson',
          data: purpleairgeojson
        });
        map.addSource('airsis', {
          type: 'geojson',
          data: airsisgeojson
        });
        map.addSource('wrcc', {
          type: 'geojson',
          data: wrccgeojson
        });
        // map.addLayer({
        //   'id': 'purple1',
        //   'type': 'symbol',
        //   'source': 'purple',
        //   'minzoom':6,
        //   'layout':{
        //     'symbol-sort-key': ["-",['to-number', ['get', 'PM2.5_nowcast']]],
        //     'text-allow-overlap': false,
        //     'text-field': ['string', ['get', 'PM2.5_nowcast']],
        //     'text-font': [
        //       "Open Sans Condensed Bold",
        //       "Open Sans Condensed Bold",
        //       "Arial Unicode MS Bold"
        //     ],
        //     'text-size': [
        //       "interpolate", ["linear"],
        //       ["zoom"],

        //       6,12,
        //       7,14,
        //       9, 16,
        //       11, 20,
        //     ],
        //   },
        //   'paint': {
        //     'text-color': 'rgba(0,0,0,1)',
        //     //'text-halo-color': 'rgba(0,0,0,1)',
        //     //'text-halo-width': 1.5,
        //     //'text-halo-blur': 1,
        //   },
        //   'filter':
        //   ['!=', 'PM2.5_nowcast', null]
        // })
        // map.loadImage('https:\/\/upload.wikimedia.org/wikipedia/commons/thumb/6/60/Maki-triangle-15.svg/15px-Maki-triangle-15.svg.png',function(error,image){
        //   if (error) throw error
        //   map.addImage('triangle-maki', image,{sdf:true})
        // })
        // map.loadImage('https:\/\/upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Maki-square-15.svg/15px-Maki-square-15.svg.png',function(error,image){
        //   if (error) throw error
        //   map.addImage('square-maki', image,{sdf:true})
        // })
        // map.addLayer({
        //   'id': 'purple',
        //   'type': 'symbol',
        //   'source': 'purple',
        //   'layout':{
        //         'symbol-sort-key': ['get', 'PM2.5_nowcast'],
        //         'icon-image': 'square-maki',
        //         'icon-size':1,
        //         'icon-allow-overlap': true,

        //       },
        //    'paint': {
        //     'icon-halo-width':1,
        //     //'icon-halo-blur':1,
        //     'icon-halo-color':'rgba(0,0,0,1)',
        //     'icon-color': {
        //       property: 'PM2.5_nowcast',
        //       stops: [
        //         //[-999,'rgba(190,190,190,1)'],
        //         [0, "#0f0"],
        //         [49, "#0f0"],
        //         [51, "#ff0"],
        //         [99, "#ff0"],
        //         [100, "#ff7f00"],
        //         [149, "#ff7f00"],
        //         [151, "#ff0000"],
        //         [199, "#ff0000"],
        //         [201, "rgb(143,63,151)"],
        //         [299, "rgb(143,63,151)"],
        //         [301, "rgb(126,0,35)"],
        //         [5000, "rgb(126,0,35)"]
        //       ],
        //       default: 'rgba(190,190,190,1)',
        //     }
        //   },
        //   //'filter':['<', 'latency', 12]
        // }, 'settlement-label');

        // map.addLayer({
        //   'id': 'airsis',
        //   'type': 'symbol',
        //   'source': 'airsis',
        //   'layout':{
        //         'symbol-sort-key': ['get', 'PM2.5_nowcast'],
        //         'icon-image': 'triangle-maki',
        //         'icon-size':1,
        //         'icon-allow-overlap': true,

        //       },
        //    'paint': {
        //     'icon-halo-width':1,
        //     //'icon-halo-blur':1,
        //     'icon-halo-color':'rgba(0,0,0,1)',
        //     'icon-color': {
        //       property: 'PM2.5_nowcast',
        //       stops: [
        //         //[-999,'rgba(190,190,190,1)'],
        //         [0, "#0f0"],
        //         [49, "#0f0"],
        //         [51, "#ff0"],
        //         [99, "#ff0"],
        //         [100, "#ff7f00"],
        //         [149, "#ff7f00"],
        //         [151, "#ff0000"],
        //         [199, "#ff0000"],
        //         [201, "rgb(143,63,151)"],
        //         [299, "rgb(143,63,151)"],
        //         [301, "rgb(126,0,35)"],
        //         [5000, "rgb(126,0,35)"]
        //       ],
        //       default: 'rgba(190,190,190,1)',
        //     }
        //   },
        //   'filter':['<', 'latency', 12]
        // }, 'settlement-label');

        // map.addLayer({
        //   'id': 'airsis1',
        //   'type': 'symbol',
        //   'source': 'airsis',
        //   'minzoom':6,
        //   'layout':{
        //     'symbol-sort-key': ["-",['to-number', ['get', 'PM2.5_nowcast']]],
        //     'text-allow-overlap': false,
        //     'text-field': ['string', ['get', 'PM2.5_nowcast']],
        //     'text-font': [
        //       "Open Sans Condensed Bold",
        //       "Open Sans Condensed Bold",
        //       "Arial Unicode MS Bold"
        //     ],
        //     'text-size': [
        //       "interpolate", ["linear"],
        //       ["zoom"],

        //       6,12,
        //       7,14,
        //       9, 16,
        //       11, 20,
        //     ],
        //   },
        //   'paint': {
        //     'text-color': 'rgba(0,0,0,1)',
        //     //'text-halo-color': 'rgba(0,0,0,1)',
        //     //'text-halo-width': 1.5,
        //     //'text-halo-blur': 1,
        //   },
        //  // 'filter':['!=', 'PM2.5_nowcast', 'null']
        // })
        map.addLayer({
          'id': 'purple',
          'type': 'circle',
          'source': 'purple',
          'layout':{
                'circle-sort-key': ['get', 'PM2.5_nowcast'],
              },
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 2,
              7, 6,
              11, 10,
            ],
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,1)',
            'circle-stroke-opacity': 0.5,
            'circle-opacity': 0.7,
            'circle-color': {
              property: 'PM2.5_nowcast',
              stops: [
                [-999,'rgba(190,190,190,1)'],
                [0, "#0f0"],
                [49, "#0f0"],
                [51, "#ff0"],
                [99, "#ff0"],
                [100, "#ff7f00"],
                [149, "#ff7f00"],
                [151, "#ff0000"],
                [199, "#ff0000"],
                [201, "rgb(143,63,151)"],
                [299, "rgb(143,63,151)"],
                [301, "rgb(126,0,35)"],
                [5000, "rgb(126,0,35)"]
              ],
              default: 'rgba(190,190,190,1)',
            }
          },
          'filter':['<', 'age', 24]
         // 'filter':['!=', 'PM2.5_nowcast', 'null']
        }, 'settlement-label');

        map.addLayer({
          'id': 'airsis',
          'type': 'circle',
          'source': 'airsis',
          'layout':{
                'circle-sort-key': ['get', 'PM2.5_nowcast'],
              },
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 4,
              7, 12,
              11, 20,
            ],
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,1)',
            'circle-color': {
              property: 'PM2.5_nowcast',
              stops: [
                [-999,'rgba(190,190,190,1)'],
                [0, "#0f0"],
                [49, "#0f0"],
                [51, "#ff0"],
                [99, "#ff0"],
                [100, "#ff7f00"],
                [149, "#ff7f00"],
                [151, "#ff0000"],
                [199, "#ff0000"],
                [201, "rgb(143,63,151)"],
                [299, "rgb(143,63,151)"],
                [301, "rgb(126,0,35)"],
                [5000, "rgb(126,0,35)"]
              ],
              default: 'rgba(190,190,190,1)',
            }
          },
          'filter':['<', 'age', 24]
         // 'filter':['!=', 'PM2.5_nowcast', 'null']
        }, 'settlement-label');

        map.addLayer({
          'id': 'airnow',
          'type': 'circle',
          'source': 'airnow',
          'layout':{
                'circle-sort-key': ['get', 'PM2.5_nowcast'],
              },
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 4,
              7, 12,
              11, 20,
            ],
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,1)',
            'circle-color': {
              property: 'PM2.5_nowcast',
              stops: [
                [-999,'rgba(190,190,190,1)'],
                [0, "#0f0"],
                [49, "#0f0"],
                [51, "#ff0"],
                [99, "#ff0"],
                [100, "#ff7f00"],
                [149, "#ff7f00"],
                [151, "#ff0000"],
                [199, "#ff0000"],
                [201, "rgb(143,63,151)"],
                [299, "rgb(143,63,151)"],
                [301, "rgb(126,0,35)"],
                [5000, "rgb(126,0,35)"]
              ],
              default: 'rgba(190,190,190,1)',
            }
          },
          'filter':['<', 'age', 24]
         // 'filter':['!=', 'PM2.5_nowcast', 'null']
        }, 'settlement-label');

        map.addLayer({
          'id': 'wrcc',
          'type': 'circle',
          'source': 'wrcc',
          'layout':{
                'circle-sort-key': ['get', 'PM2.5_nowcast'],
              },
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 4,
              7, 12,
              11, 20,
            ],
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,1)',
            'circle-color': {
              property: 'PM2.5_nowcast',
              stops: [
                [-999,'rgba(190,190,190,1)'],
                [0, "#0f0"],
                [49, "#0f0"],
                [51, "#ff0"],
                [99, "#ff0"],
                [100, "#ff7f00"],
                [149, "#ff7f00"],
                [151, "#ff0000"],
                [199, "#ff0000"],
                [201, "rgb(143,63,151)"],
                [299, "rgb(143,63,151)"],
                [301, "rgb(126,0,35)"],
                [5000, "rgb(126,0,35)"]
              ],
              default: 'rgba(190,190,190,1)',
            }
          },
          'filter':['<', 'age', 24]
         // 'filter':['!=', 'PM2.5_nowcast', 'null']
        }, 'settlement-label');

        // map.addLayer({
        //   'id': 'airnow1',
        //   'type': 'symbol',
        //   'source': 'airnow',
        //   'minzoom':6,
        //   'layout':{
        //     'symbol-sort-key': ["-",['to-number', ['get', 'PM2.5_nowcast']]],
        //     'text-allow-overlap': false,
        //     'text-field': ['string', ['get', 'PM2.5_nowcast']],
        //     'text-font': [
        //       "Open Sans Condensed Bold",
        //       "Open Sans Condensed Bold",
        //       "Arial Unicode MS Bold"
        //     ],
        //     'text-size': [
        //       "interpolate", ["linear"],
        //       ["zoom"],

        //       6,12,
        //       7,14,
        //       9, 16,
        //       11, 20,
        //     ],
        //   },
        //   'paint': {
        //     'text-color': 'rgba(0,0,0,1)',
        //     //'text-halo-color': 'rgba(0,0,0,1)',
        //     //'text-halo-width': 1.5,
        //     //'text-halo-blur': 1,
        //   },
        //   'filter':['!=', 'PM2.5_nowcast', 'null']
        // })

      })




                map.on('render', stopSpinner);
        map.on('click', 'airnow', function(e) {
          var uniqueID = String(Date.now())
          d3.csv(`https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/monitoring/v1/csv/${e.features[0].properties.monitorID}.csv`)
          .then(data=>{
            let parsedData=[];
            console.log(data)
            data.forEach(element=>{
              parsedData.push([moment(element.utcTime,'YYYY-MM-DD HH:mm:ss Z').valueOf(),AQIPM25(Number(element.nowcast))])
            })

            //Highcharts.setOptions({global: { useUTC: false } });
            $(`#aqiGraphContainer${uniqueID}`).highcharts({
                chart: {
                    type: 'column',
                    backgroundColor:'#fff',
                    zoomType: 'x',
                    resetZoomButton: {
                        theme: {
                            fill: '#fff',
                            stroke: '#d3d3d3',
                            r: 0
                        },
                        position: {
                            align: 'left', // by default
                            verticalAlign: 'top', // by default
                            x: 0,
                            y: -10
                        }
                    }
                },
                title: {
                    text:   null,
                    align: 'left',
                    style: {
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: 'small',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans, sans-serif'
                    }
                    //text: null
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        borderColor: "#4a4a4a",
                        borderWidth: 0.1,
                        shadow: false,
                        minPointLength: 3
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickColor: '#4e4e4e',
                    lineColor: '#4e4e4e',
                    tickAmount: 10,
                    tickWidth: 1,
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%b %d', this.value);
                        },
                        //rotation: -90,
                        align: 'center'
                    }
                },
                yAxis: {
                    title: { text: 'PM2.5 NowCast AQI' },
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function () {
                        var aqi = this.y;
                        var cat = AQICat(aqi);
                        var time = moment(this.x, "x").format("MMM DD YYYY h:mm A")
                        return '<span style="font-size:90%">' + time + '</span><br>' +
                            '<span>NowCast AQI: ' + aqi + '</span><br/>' + '<span>Category: ' + cat + '</span><br>';
                    }
                },
                series: [{
                    showInLegend: false,
                    data: parsedData,
                    events: {
                        mouseOver: function () {
                            $('.highcharts-plot-line-label').css('display', 'none');
                            $('.highcharts-plot-lines-10').css('display', 'none');
                            $('.highcharts-button').css('display', 'none');
                        },
                        mouseOut: function(e) {
                            $('.highcharts-plot-line-label').css('display', 'block');
                            $('.highcharts-plot-lines-10').css('display', 'block');
                            $('.highcharts-button').css('display', 'block');
                        }
                    },
                    zones: [{
                        value: 51,
                        color: '#00E400'
                    }, {
                        value: 101,
                        color: '#f7e704'
                    },{
                        value: 151,
                        color: '#FF7E00'
                    }, {
                        value: 201,
                        color: '#FF0000'
                    }, {
                        value: 301,
                        color: '#8F3F97'
                    }, {
                        color: '#7E0023'
                    }]
                }]
            })


          })
          new mapboxgl.Popup({maxWidth:'600px'})
            .setLngLat(e.lngLat)
            .setHTML(`<div class='popup-header'>Permanent Monitor</div>Site Name: ${e.features[0].properties.siteName}<br>Agency: ${e.features[0].properties.agencyName}<br>Updated: ${moment(e.features[0].properties.lastValidUTCTime+' Z').format('LLL')}<div id='aqiGraphContainer${uniqueID}' class='aqiGraphContainer'></div>`)
            .addTo(map);
            // // .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.SiteName + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.LocalTimeString+'<br>Current Combined AQI: <b>' + e.features[0].properties.OZONEPM_AQI+'</b><br>PM 2.5: <b>' + e.features[0].properties.PM25+' '+e.features[0].properties.PM25_Unit+ '</b><br>Source: ' + e.features[0].properties.DataSource+'</span><br><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=timeseries&monitorid='+e.features[0].properties.AQSID+'_01&size=450"><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=dailybyhour&monitorid='+e.features[0].properties.AQSID+'_01&size=450">')

        });
        map.on('click', 'wrcc', function(e) {
          var uniqueID = String(Date.now())
          d3.csv(`https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/monitoring/v1/csv/${e.features[0].properties.monitorID}.csv`)
          .then(data=>{
            let parsedData=[];
            console.log(data)
            data.forEach(element=>{
              parsedData.push([moment(element.utcTime,'YYYY-MM-DD HH:mm:ss Z').valueOf(),AQIPM25(Number(element.nowcast))])
            })

            //Highcharts.setOptions({global: { useUTC: false } });
            $(`#aqiGraphContainer${uniqueID}`).highcharts({
                chart: {
                    type: 'column',
                    backgroundColor:'#fff',
                    zoomType: 'x',
                    resetZoomButton: {
                        theme: {
                            fill: '#fff',
                            stroke: '#d3d3d3',
                            r: 0
                        },
                        position: {
                            align: 'left', // by default
                            verticalAlign: 'top', // by default
                            x: 0,
                            y: -10
                        }
                    }
                },
                title: {
                    text:   null,
                    align: 'left',
                    style: {
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: 'small',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans, sans-serif'
                    }
                    //text: null
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        borderColor: "#4a4a4a",
                        borderWidth: 0.1,
                        shadow: false,
                        minPointLength: 3
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickColor: '#4e4e4e',
                    lineColor: '#4e4e4e',
                    tickAmount: 10,
                    tickWidth: 1,
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%b %d', this.value);
                        },
                        //rotation: -90,
                        align: 'center'
                    }
                },
                yAxis: {
                    title: { text: 'PM2.5 NowCast AQI' },
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function () {
                        var aqi = this.y;
                        var cat = AQICat(aqi);
                        var time = moment(this.x, "x").format("MMM DD YYYY h:mm A")
                        return '<span style="font-size:90%">' + time + '</span><br>' +
                            '<span>NowCast AQI: ' + aqi + '</span><br/>' + '<span>Category: ' + cat + '</span><br>';
                    }
                },
                series: [{
                    showInLegend: false,
                    data: parsedData,
                    events: {
                        mouseOver: function () {
                            $('.highcharts-plot-line-label').css('display', 'none');
                            $('.highcharts-plot-lines-10').css('display', 'none');
                            $('.highcharts-button').css('display', 'none');
                        },
                        mouseOut: function(e) {
                            $('.highcharts-plot-line-label').css('display', 'block');
                            $('.highcharts-plot-lines-10').css('display', 'block');
                            $('.highcharts-button').css('display', 'block');
                        }
                    },
                    zones: [{
                        value: 51,
                        color: '#00E400'
                    }, {
                        value: 101,
                        color: '#f7e704'
                    },{
                        value: 151,
                        color: '#FF7E00'
                    }, {
                        value: 201,
                        color: '#FF0000'
                    }, {
                        value: 301,
                        color: '#8F3F97'
                    }, {
                        color: '#7E0023'
                    }]
                }]
            })


          })
          new mapboxgl.Popup({maxWidth:'600px'})
            .setLngLat(e.lngLat)
            .setHTML(`<div class='popup-header'>Temporary Monitor</div>Site Name: ${e.features[0].properties.siteName}<br>Agency: ${e.features[0].properties.agencyName}<br>Updated: ${moment(e.features[0].properties.lastValidUTCTime+' Z').format('LLL')}<div id='aqiGraphContainer${uniqueID}' class='aqiGraphContainer'></div>`)
            .addTo(map);
            // // .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.SiteName + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.LocalTimeString+'<br>Current Combined AQI: <b>' + e.features[0].properties.OZONEPM_AQI+'</b><br>PM 2.5: <b>' + e.features[0].properties.PM25+' '+e.features[0].properties.PM25_Unit+ '</b><br>Source: ' + e.features[0].properties.DataSource+'</span><br><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=timeseries&monitorid='+e.features[0].properties.AQSID+'_01&size=450"><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=dailybyhour&monitorid='+e.features[0].properties.AQSID+'_01&size=450">')

        });

        map.on('click', 'purple', function(e) {
          var uniqueID = String(Date.now())
          d3.csv(`https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/maps/purple_air/v2/timeseries/weekly/${e.features[0].properties.sensor_index}.csv`)
          //d3.csv(`https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/maps/purple_air/latest_csvs/${e.features[0].properties.monitorID}.csv`)
          .then(data=>{
            let parsedData=[];
            data.forEach(element=>{
              if (element.epa_nowcast == ""){
                parsedData.push([moment(element.local_ts).valueOf(),null])
              }
              else{
                parsedData.push([moment(element.local_ts).valueOf(),AQIPM25(Number(element.epa_nowcast))])
              }

            })

            //Highcharts.setOptions({global: { useUTC: false } });
            $(`#aqiGraphContainer${uniqueID}`).highcharts({
                chart: {
                    type: 'column',
                    backgroundColor:'#fff',
                    zoomType: 'x',
                    resetZoomButton: {
                        theme: {
                            fill: '#fff',
                            stroke: '#d3d3d3',
                            r: 0
                        },
                        position: {
                            align: 'left', // by default
                            verticalAlign: 'top', // by default
                            x: 0,
                            y: -10
                        }
                    }
                },
                title: {
                    text:   null,
                    align: 'left',
                    style: {
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: 'small',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans, sans-serif'
                    }
                    //text: null
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        borderColor: "#4a4a4a",
                        borderWidth: 0.1,
                        shadow: false,
                        minPointLength: 3
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickColor: '#4e4e4e',
                    lineColor: '#4e4e4e',
                    tickAmount: 10,
                    tickWidth: 1,
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%b %d', this.value);
                        },
                        //rotation: -90,
                        align: 'center'
                    }
                },
                yAxis: {
                    title: { text: 'PM2.5 NowCast AQI' },
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function () {
                        var aqi = this.y;
                        var cat = AQICat(aqi);
                        var time = moment(this.x, "x").format("MMM DD YYYY h:mm A")
                        return '<span style="font-size:90%">' + time + '</span><br>' +
                            '<span>NowCast AQI: ' + aqi + '</span><br/>' + '<span>Category: ' + cat + '</span><br>';
                    }
                },
                series: [{
                    showInLegend: false,
                    data: parsedData,
                    events: {
                        mouseOver: function () {
                            $('.highcharts-plot-line-label').css('display', 'none');
                            $('.highcharts-plot-lines-10').css('display', 'none');
                            $('.highcharts-button').css('display', 'none');
                        },
                        mouseOut: function(e) {
                            $('.highcharts-plot-line-label').css('display', 'block');
                            $('.highcharts-plot-lines-10').css('display', 'block');
                            $('.highcharts-button').css('display', 'block');
                        }
                    },
                    zones: [{
                        value: 51,
                        color: '#00E400'
                    }, {
                        value: 101,
                        color: '#f7e704'
                    },{
                        value: 151,
                        color: '#FF7E00'
                    }, {
                        value: 201,
                        color: '#FF0000'
                    }, {
                        value: 301,
                        color: '#8F3F97'
                    }, {
                        color: '#7E0023'
                    }]
                }]
            })


          })
          new mapboxgl.Popup({maxWidth:'600px'})
            .setLngLat(e.lngLat)
            .setHTML(`<div class='popup-header'>Low Cost Sensor</div>Provider: Purple Air<br>Updated: ${moment(e.features[0].properties.lastValidUTCTime).format('LLL')}<div id='aqiGraphContainer${uniqueID}' class='aqiGraphContainer'></div>`)
            .addTo(map);
            // // .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.SiteName + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.LocalTimeString+'<br>Current Combined AQI: <b>' + e.features[0].properties.OZONEPM_AQI+'</b><br>PM 2.5: <b>' + e.features[0].properties.PM25+' '+e.features[0].properties.PM25_Unit+ '</b><br>Source: ' + e.features[0].properties.DataSource+'</span><br><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=timeseries&monitorid='+e.features[0].properties.AQSID+'_01&size=450"><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=dailybyhour&monitorid='+e.features[0].properties.AQSID+'_01&size=450">')

        });
        map.on('click', 'airsis', function(e) {
          var uniqueID = String(Date.now())
          d3.csv(`https:\/\/s3-us-west-2.amazonaws.com/airfire-data-exports/monitoring/v1/csv/${e.features[0].properties.monitorID}.csv`)
          .then(data=>{
            let parsedData=[];
            console.log(data)
            data.forEach(element=>{
              parsedData.push([moment(element.utcTime,'YYYY-MM-DD HH:mm:ss Z').valueOf(),AQIPM25(Number(element.nowcast))])
            })

            //Highcharts.setOptions({global: { useUTC: false } });
            $(`#aqiGraphContainer${uniqueID}`).highcharts({
                chart: {
                    type: 'column',
                    backgroundColor:'#fff',
                    zoomType: 'x',
                    resetZoomButton: {
                        theme: {
                            fill: '#fff',
                            stroke: '#d3d3d3',
                            r: 0
                        },
                        position: {
                            align: 'left', // by default
                            verticalAlign: 'top', // by default
                            x: 0,
                            y: -10
                        }
                    }
                },
                title: {
                    text:   null,
                    align: 'left',
                    style: {
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: 'small',
                        fontWeight: 'bold',
                        fontFamily: 'Open Sans, sans-serif'
                    }
                    //text: null
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        borderColor: "#4a4a4a",
                        borderWidth: 0.1,
                        shadow: false,
                        minPointLength: 3
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickColor: '#4e4e4e',
                    lineColor: '#4e4e4e',
                    tickAmount: 10,
                    tickWidth: 1,
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%b %d', this.value);
                        },
                        //rotation: -90,
                        align: 'center'
                    }
                },
                yAxis: {
                    title: { text: 'PM2.5 NowCast AQI' },
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function () {
                        var aqi = this.y;
                        var cat = AQICat(aqi);
                        var time = moment(this.x, "x").format("MMM DD YYYY h:mm A")
                        return '<span style="font-size:90%">' + time + '</span><br>' +
                            '<span>NowCast AQI: ' + aqi + '</span><br/>' + '<span>Category: ' + cat + '</span><br>';
                    }
                },
                series: [{
                    showInLegend: false,
                    data: parsedData,
                    events: {
                        mouseOver: function () {
                            $('.highcharts-plot-line-label').css('display', 'none');
                            $('.highcharts-plot-lines-10').css('display', 'none');
                            $('.highcharts-button').css('display', 'none');
                        },
                        mouseOut: function(e) {
                            $('.highcharts-plot-line-label').css('display', 'block');
                            $('.highcharts-plot-lines-10').css('display', 'block');
                            $('.highcharts-button').css('display', 'block');
                        }
                    },
                    zones: [{
                        value: 51,
                        color: '#00E400'
                    }, {
                        value: 101,
                        color: '#f7e704'
                    },{
                        value: 151,
                        color: '#FF7E00'
                    }, {
                        value: 201,
                        color: '#FF0000'
                    }, {
                        value: 301,
                        color: '#8F3F97'
                    }, {
                        color: '#7E0023'
                    }]
                }]
            })


          })
          new mapboxgl.Popup({maxWidth:'600px'})
            .setLngLat(e.lngLat)
            .setHTML(`<div class='popup-header'>Temporary Monitor</div>Site Name: ${e.features[0].properties.siteName}<br>Provider: ${e.features[0].properties.dataSource}<br>Updated: ${moment(e.features[0].properties.lastValidUTCTime+' Z').format('LLL')}<div id='aqiGraphContainer${uniqueID}' class='aqiGraphContainer'></div>`)
            .addTo(map);
            // // .setHTML('<span style="font-family:Inconsolata; font-size:14px"><b>' + e.features[0].properties.SiteName + '</b><br><span style="font-family:Inconsolata; font-size:12px">' + e.features[0].properties.LocalTimeString+'<br>Current Combined AQI: <b>' + e.features[0].properties.OZONEPM_AQI+'</b><br>PM 2.5: <b>' + e.features[0].properties.PM25+' '+e.features[0].properties.PM25_Unit+ '</b><br>Source: ' + e.features[0].properties.DataSource+'</span><br><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=timeseries&monitorid='+e.features[0].properties.AQSID+'_01&size=450"><img src="https:\/\/tools.airfire.org/monitor-plot/v4/plot?plottype=dailybyhour&monitorid='+e.features[0].properties.AQSID+'_01&size=450">')

        });

        map.on('mouseenter', 'airnow', function() {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'airnow', function() {
          map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'airsis', function() {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'airsis', function() {
          map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'purple', function() {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'purple', function() {
          map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'wrcc', function() {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'wrcc', function() {
          map.getCanvas().style.cursor = '';
        });

      }

      function removeAQI() {
        map.removeLayer('purple')
        map.removeLayer('airsis')
        map.removeLayer('airnow')
        map.removeLayer('wrcc')
        map.removeSource('purple')
        map.removeSource('airsis')
        map.removeSource('airnow')
        map.removeSource('wrcc')
      }

      function addUA() {
        loadingSpinner(true);
        map.addSource('UA', {
          type: 'geojson',
          data: soundingGeojson,
        });


        map.addLayer({
          'id': 'UA',
          'type': 'symbol',
          'source': 'UA',
          'paint': {
            'icon-opacity': 1,
            'icon-halo-width':1.5,
            'icon-halo-blur':0.5,
            //'icon-color':'rgba(200,0,0, 1)',
            'icon-halo-color':'rgba(255, 255, 255, 1)',
          },
          'layout': {
            //'icon-image': 'Aircraft_Airport_ecomo',
            'text-field': ['string', ['get', 'name']],
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 18,
              7, 22,
              11, 26,
            ],
            'text-offset': [0, 1],
            'icon-image': 'triangle-15',
            'icon-size':1.5,
            'icon-allow-overlap': true,
            'icon-rotation-alignment': 'map',

          },
          //'filter': ['!=', 'OZONEPM_AQI_LABEL', 'ND']
        });

        map.on('render', stopSpinner);
        map.on('click', 'UA', function(e) {
          new mapboxgl.Popup({maxWidth:'1190px'})
            .setLngLat(e.lngLat)
            .setHTML('<img src="https:\/\/www.spc.noaa.gov/exper/soundings/LATEST/'+e.features[0].properties.name+'.gif">')
            .addTo(map);
        });

        map.on('mouseenter', 'UA', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'UA', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function removeUA() {
        map.removeLayer('UA')
        //map.removeLayer('UA')
        map.removeSource('UA')
      }

      function removeWildweb(){
        map.removeLayer('Wildweb')
        map.removeLayer('Wildweb1')
        map.removeSource('Wildweb')
        }

      function addWildweb(){
        loadingSpinner(true);
        let dispatch = ([
            ["Boise Dispatch","WildCAD_IDBDC.kml"],
            ["Payette Dispatch","WildCAD_IDPAC.kml"],
            ["South ID Dispatch","WildCAD_ID-SCC.kml"],
            ["Grangeville Dispatch","WildCAD_ID-GVC.kml"],
            ["Central ID Dispatch","WildCAD_IDCIC.kml"],
            ["CDA Dispatch","WildCAD_IDCDC.kml"],
            ["Eastern ID Dispatch","WildCAD_IDEIC.kml"],
            ["Eugene","WildCAD_OR-EIC.kml"],
            ["Roseberg","WildCAD_OR-RICC.kml"],
            ["Rogue Valley","WildCAD_OR-RVC.kml"],
            ["Central Oregon","WildCAD_OR-COC.kml"],
            ["John Day","WildCAD_OR-JDCC.kml"],
            ["Blue Mtn Oregon","WildCAD_ORBMC.kml"],
            ["Lakeview Dispatch","WildCAD_ORLFC.kml"],
            ["Burns Dispatch","WildCAD_OR-BIC.kml"],
            ["Vale Dispatch","WildCAD_OR-VAC.kml"],
            ["Northern UT","WildCAD_UT-NUC.kml"],
            ["Central NV","WildCAD_NVCNC.kml"],
            ["Elko NV","WildCAD_NVEIC.kml"],
            ["WA Colville","WildCAD_WACAC.kml"],
            ["WA Central WA","WildCAD_WA-CWC.kml"],
            ["WA NW Region DNR","WildCAD_WA-NDC.kml"],
            ["WA NE WA","WildCAD_WA-NEC.kml"],
            ["WA Olympic","WildCAD_WA-OLC.kml"],
            ["WA Pacific","WildCAD_WA-PCC.kml"],
            ["WA Puget Sound","WildCAD_WA-PSC.kml"],
            ["WA S Puget","WildCAD_WA-SPC.kml"],
            ["WA Columbia Cascade","WildCAD_WACCC.kml"],
            ["MT Missoula","WildCAD_MT-MDC.kml"],
            ["MT Bitteroot","WildCAD_MT-BRC.kml"],
            ["MT Bozeman","WildCAD_MT-BZC.kml"],
            ["MT Dillon","WildCAD_MT-DDC.kml"],
            ["MT GF","WildCAD_MT-GDC.kml"],
            ["MT Helena","WildCAD_MT-HDC.kml"],
            ["MT Kootenai","WildCAD_MT-KDC.kml"],
            ["MT Kalispell","WildCAD_MT-KIC.kml"],
        ])

        let geojson = {
          type: "FeatureCollection",
          features: [],
        };

        let wildweb
            Promise.all(dispatch.map(subarr => (
                fetch(`https:\/\/test.8222.workers.dev/?http:\/\/www.wildcadmap.net/${subarr[1]}`)
                    .then(res => res.text())
                    .then(str => {
                      var x2js = new X2JS(),
                        xml = x2js.xml_str2json(str)
                        if (xml.kml?.Document?.Placemark){
                          return xml.kml.Document.Placemark
                        }
                    })
                    .then(result => [result])
                )))
                .then(data => {
                  var merged = [].concat.apply([],data)
                  merged = [].concat.apply([],merged)
                  var obj = {...merged}
                  for (let property in obj){
                    if(obj[property] && obj[property].name){
                      id = obj[property].name
                      let coords = obj[property].Point.coordinates.split(',')
                      lat = Number(coords[1])
                      lon = Number(coords[0])
                      let desc = obj[property].description.split('\n')
                      namedate = desc[0].trim()
                      const reg = /(.*?)(\d\d\/\d\d\/\d\d\d\d \d\d:\d\d)/g;
                      let match, name, time;

                      while (match = reg.exec(desc[0])) {
                        name = match[1].trim()
                        time = moment(match[2],'MM/DD/YYYY hh:mm').format()
                      }
                      let type = (desc[1]) ? desc[1].trim() : null
                      let remarks = ''
                      if (desc[2]){
                        remarks += desc[2].trim()
                      }
                      if (desc[3]){
                        remarks += ' ' + desc[3].trim()
                      }
                      let diff = moment().diff(time,'hours')
                      if (type === 'wildfire' || type === 'Wildfire'){
                        console.log(name,id,type,time,diff,remarks)
                        geojson.features.push({
                            "type": "Feature",
                            "geometry": {
                              "type": "Point",
                              "coordinates": [lon, lat]
                            },
                            "properties": {
                                "IncidentName": name,
                                "id": id,
                                "type": type,
                                "date": time,
                                "ageHr":diff,
                                "remarks":remarks,
                                }
                        })
                      }
                    }
                  }
                  map.addSource('Wildweb', {
                    type: 'geojson',
                    data: geojson,
                  });
                  console.log(geojson)
                  map.addLayer({
                    'id': 'Wildweb',
                    'type': 'symbol',
                    'source': 'Wildweb',
                    'layout': {
                      'icon-image': 'FireIcon',
                      'icon-size': 0.08,
                      // 'text-field': ['string', ['get', 'name']],
                      // 'text-font': [
                      //   "Open Sans Condensed Bold",
                      // ],
                      // 'text-size': 16,
                      // [
                      //   "interpolate", ["linear"],
                      //   ["zoom"],
                      //   4, 0,
                      //   4.95, 0,
                      //   5, 12,
                      //   7, 16,
                      //   11, 18,
                      // ],
                      //'text-offset': [0, 1],
                      //"symbol-sort-key": ["to-number", ["get", "TotalIncidentPersonnel"]],
                      //'text-allow-overlap': false,
                      'icon-allow-overlap': true,
                    },
                    'paint': {
                      'icon-opacity': {
                          property: 'ageHr',
                          stops: [
                            [0, 1],
                            [24, 0.75],
                            [36,0.5],
                            [48,0.25]
                          ],
                          default: 0.25,
                        },
                      //'text-halo-color': 'rgba(0,0,0,0.75)',
                      //'text-halo-width': 1.5,
                      //'text-color': 'rgba(200,0,0,1.0)'
                    },
                    'filter': ['<', 'ageHr', 72],
                  });
                  map.addLayer({
                    'id': 'Wildweb1',
                    'type': 'symbol',
                    'source': 'Wildweb',
                    'layout': {
                      'icon-image': 'noun_Fire',
                      'icon-size': [
                        "interpolate", ["linear"],
                        ["zoom"],
                        4, .15,
                        7, .25,
                        11, .3,
                      ],
                      //'text-field': ['string', ['get', 'name']],
                      // 'text-font': [
                      //   "Open Sans Condensed Bold",

                      // ],
                      // 'text-size': [
                      //   "interpolate", ["linear"],
                      //   ["zoom"],
                      //   4, 0,
                      //   4.95, 0,
                      //   5, 12,
                      //   7, 16,
                      //   11, 18,
                      // ],
                      //'text-offset': [0, 2],
                      //'text-allow-overlap': false,
                      'icon-allow-overlap': true,
                    },
                    'paint': {
                      'icon-opacity': 0.25,
                      // {
                      //     property: 'ageHr',
                      //     stops: [
                      //       [0, 1],
                      //       [24, 0.75],
                      //       [36,0.5],
                      //       [48,0.25]
                      //     ],
                      //     default: 0.25,
                      //   },
                      //'text-halo-color': 'rgba(0,0,0,0.75)',
                      //'text-halo-width': 1.5,
                      //'text-color': 'rgba(255,200,75,1.0)',
                      //'icon-color':'rgba(255,0,0,1)',
                    },
                    'filter': ['>=', 'ageHr', 72],
                    'filter': [
                      "all",
                      ['>=', 'ageHr', 72],
                      ['<', 'ageHr', 240],
                    ]
                  })

                  map.on('render', stopSpinner);

                  map.on('click', 'Wildweb', function(e) {
                    let shtml=`<div class="popup-header-fire">${e.features[0].properties.IncidentName} - ${e.features[0].properties.id}</div>`
                    // if (e.features[0].properties.DailyAcres != 'null'){
                    //   shtml += `Daily Acres (% Contained): <b>${e.features[0].properties.DailyAcres} Acres</b>`
                    // }
                    // if (e.features[0].properties.PercentContained != 'null'){
                    //   shtml +=`&nbsp;<b>(${e.features[0].properties.PercentContained}%)</b>`
                    // }
                    if (e.features[0].properties.date != 'null'){
                      shtml+=`<br>Updated: <b>${moment(e.features[0].properties.date).format('lll')}</b>`
                    }
                    if (e.features[0].properties.remarks != 'null'){
                      shtml +=`<br>Remarks: <b>${e.features[0].properties.remarks}</b>`
                    }

                    new mapboxgl.Popup({maxWidth:'400px'})
                      .setLngLat(e.lngLat)
                      .setHTML(shtml)
                      .addTo(map);
                  });

                  map.on('mouseenter', 'Wildweb', function() {
                    map.getCanvas().style.cursor = 'pointer';
                  });

                  map.on('mouseleave', 'Wildweb', function() {
                    map.getCanvas().style.cursor = '';
                  });
                  map.on('click', 'Wildweb1', function(e) {
                    let shtml=`<div class="popup-header">${e.features[0].properties.IncidentName} - ${e.features[0].properties.id}</div>`
                    // if (e.features[0].properties.DailyAcres != 'null'){
                    //   shtml += `Daily Acres (% Contained): <b>${e.features[0].properties.DailyAcres} Acres</b>`
                    // }
                    // if (e.features[0].properties.PercentContained != 'null'){
                    //   shtml +=`&nbsp;<b>(${e.features[0].properties.PercentContained}%)</b>`
                    // }
                    if (e.features[0].properties.date != 'null'){
                      shtml+=`<br>Updated: <b>${e.features[0].properties.date}</b>`
                    }
                    if (e.features[0].properties.remarks != 'null'){
                      shtml +=`<br>Remarks: <b>${e.features[0].properties.remarks}</b>`
                    }

                    new mapboxgl.Popup({maxWidth:'400px'})
                      .setLngLat(e.lngLat)
                      .setHTML(shtml)
                      .addTo(map);
                  });

                  map.on('mouseenter', 'Wildweb1', function() {
                    map.getCanvas().style.cursor = 'pointer';
                  });

                  map.on('mouseleave', 'Wildweb1', function() {
                    map.getCanvas().style.cursor = '';
                  });
                })
      }

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

      function addFire() {
        loadingSpinner(true);
        map.addSource('Fires', {
          type: 'geojson',
          data:'https:\/\/services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Locations/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson',
        });
        map.addLayer({
          'id': 'Fires',
          'type': 'symbol',
          'source': 'Fires',
          'layout': {
            'icon-image': 'FireIcon',
            'icon-size': {
              property: 'DailyAcres',
              stops: [
                [1, 0.05],
                [100, 0.065],
                [1000, 0.08],
                [10000, 0.095],
                [100000, 0.11],
                [1000000, 0.22],
              ],
              default: 0.04,
            },
            // [
            //   'step',
            //   ["to-number", ["get", "DailyAcres"]],
            //   0.04,
            //   1, 0.05,
            //   100, 0.065,
            //   1000, 0.08,
            //   10000, 0.095,
            //   100000, 0.11,
            //   1000000, 0.2,
            // ],
            //'text-field': ['string', ['get', 'IncidentName']],
            //'text-font': [
            //  "Open Sans Condensed Bold",
            //],
            //'text-size': 16,
            // [
            //   "interpolate", ["linear"],
            //   ["zoom"],
            //   4, 0,
            //   4.95, 0,
            //   5, 12,
            //   7, 16,
            //   11, 18,
            // ],
            //'text-offset': [0, 1],
            //"symbol-sort-key": ["to-number", ["get", "TotalIncidentPersonnel"]],
            //'text-allow-overlap': false,
            'icon-allow-overlap': true,
          },
          'paint': {
            //'text-halo-color': 'rgba(0,0,0,0.75)',
            //'text-halo-width': 1.5,
            //'text-color': 'rgba(200,0,0,1.0)'
          },
          'filter': ['all',
          ['any',
            ['==', 'IncidentManagementOrganization', 'Type 1 Team'],
            ['==', 'IncidentManagementOrganization', 'Type 2 Team'],
            ['==', 'IncidentManagementOrganization', 'Type 3 Team'],
            ['==', 'IncidentManagementOrganization', 'Type 3 IC'],
            ['==', 'IncidentManagementOrganization', 'Type 4 IC'],
            ['==', 'IncidentManagementOrganization', 'Type 5 IC'],
          ],
          ['>=', 'ModifiedOnDateTime_dt', moment().subtract(3,'days').valueOf()],
          ['<', 'PercentContained', 100],
          ],
        });
        map.addLayer({
          'id': 'Fires1',
          'type': 'symbol',
          'source': 'Fires',
          'minzoom':5.2,
          'layout': {
            'text-field': ['string', ['get', 'IncidentName']],
            'text-font': [
              "Open Sans Condensed Bold",
            ],
            'text-size': 15,
            // [
            //   "interpolate", ["linear"],
            //   ["zoom"],
            //   4, 0,
            //   4.95, 0,
            //   5, 12,
            //   7, 16,
            //   11, 18,
            // ],
            'text-offset': [0, 1],
            "symbol-sort-key": ["-",["to-number", ["get", "TotalIncidentPersonnel"]]],
            'text-allow-overlap': false,
          },
          'paint': {
            'text-halo-color': [
              'match',
              ['get', 'IncidentManagementOrganization'],
              'Type 1 Team', 'rgba(190, 0, 0, 1)',
              'Type 2 Team', 'rgba(0, 100, 205, 1)',
              'Type 3 Team', 'rgba(0, 0, 0, 1)',
              'Type 3 IC', 'rgba(0, 0, 0, 1)',
              'Type 4 IC', 'rgba(0, 0, 0, 1)',
              'Type 5 IC', 'rgba(0, 0, 0, 1)',
              'rgba(0,0,0,0.5)'
            ],
            //'text-halo-color': 'rgba(170,0,0,1)',
            'text-halo-width': 1.5,
            'text-halo-blur': 0.5,
            'text-color': 'rgba(255,255,255,1.0)'
          },
          'filter': ['all',
          ['any',
            ['==', 'IncidentManagementOrganization', 'Type 1 Team'],
            ['==', 'IncidentManagementOrganization', 'Type 2 Team'],
            ['==', 'IncidentManagementOrganization', 'Type 3 Team'],
            ['==', 'IncidentManagementOrganization', 'Type 3 IC'],
            ['==', 'IncidentManagementOrganization', 'Type 4 IC'],
            ['==', 'IncidentManagementOrganization', 'Type 5 IC'],
          ],
          ['>=', 'ModifiedOnDateTime_dt', moment().subtract(3,'days').valueOf()],
          ['<', 'PercentContained', 100],
          ],
        });

        map.on('render', stopSpinner);

        map.on('moveend', function(e) {
        if (map.getSource('Fires') && map.isSourceLoaded('Fires')){
          let mapBounds = map.getBounds();
          var fires = 0;
          var cost = 0;
          var acres = 0;
          var personnel = 0;
          fires = map.queryRenderedFeatures([map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())],{ layers: ['Fires'] })
          var costTotal = fires.reduce((tot, record) => {
              return tot + (parseInt(record.properties.EstimatedCostToDate) || 0);
          },0);
          var acreTotal = fires.reduce((tot, record) => {
              return tot + (parseInt(record.properties.DailyAcres) || 0 );
          },0);
          var personnelTotal = fires.reduce((tot, record) => {
              return tot + (parseInt(record.properties.TotalIncidentPersonnel) || 0 );
          },0);
          $('#fireCt').html(fires.length)
          $('#costTot').html(numberWithCommas(costTotal))
          $('#personnelTot').html(numberWithCommas(personnelTotal))
          $('#acreTot').html(numberWithCommas(acreTotal))
        }
       });

        map.on('click', 'Fires', function(e) {
          let shtml=`<div class="popup-header-fire">${e.features[0].properties.IncidentName}</div>`
          if (e.features[0].properties.DailyAcres != null){
            shtml += `Daily Acres (% Contained): <b>${e.features[0].properties.DailyAcres} Acres</b>`
          }
          if (e.features[0].properties.PercentContained != null){
            shtml +=`&nbsp;<b>(${e.features[0].properties.PercentContained}%)</b>`
          }
          if(e.features[0].properties.FireBehaviorGeneral != null){
            shtml+=`<br>Fire Behavior: <b>${e.features[0].properties.FireBehaviorGeneral}</b>`
          }
          // if(e.features[0].properties.ControlDateTime != 'null'){
          //   shtml+=`<br>Containment Date: <b>${moment(e.features[0].properties.ControlDateTime).format('lll')}</b>`
          // }
          // if(e.features[0].properties.ContainmentDateTime != 'null'){
          //   shtml+=`<br>Containment Date: <b>${moment(e.features[0].properties.ContainmentDateTime).format('lll')}</b>`
          // }
          if (e.features[0].properties.ModifiedOnDateTime != null){
            shtml+=`<br>Updated: <b>${moment(e.features[0].properties.ModifiedOnDateTime_dt).format('lll')}</b>`
          }
          if (e.features[0].properties.IncidentManagementOrganization != null){
            shtml +=`<br>Incident Management Org: <b>${e.features[0].properties.IncidentManagementOrganization}</b>`
          }
          if (e.features[0].properties.TotalIncidentPersonnel != null){
            shtml +=`<br>Total Personnel: <b>${e.features[0].properties.TotalIncidentPersonnel}</b>`
          }
          if (e.features[0].properties.Injuries != null){
            shtml +=`<br>Total Injuries/Fatalities: <b>${e.features[0].properties.Injuries}/${e.features[0].properties.Fatalities}</b>`
          }
          if (e.features[0].properties.EstimatedCostToDate != null){
            shtml +=`<br>Total Cost to Date: <b>$${numberWithCommas(e.features[0].properties.EstimatedCostToDate)}</b>`
          }
          if (e.features[0].properties.FireCause != null){
            shtml +=`<br>Cause: <b>${e.features[0].properties.FireCause}</b>`
          }

          new mapboxgl.Popup({maxWidth:'400px'})
            .setLngLat(e.lngLat)
            .setHTML(shtml)
            .addTo(map);
        });

        map.on('mouseenter', 'Fires', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Fires', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function removeFire() {
        map.removeLayer('Fires')
        map.removeLayer('Fires1')
        map.removeSource('Fires')
      }

      function addFireP() {
        loadingSpinner(true);
        map.addSource('FiresP', {
          type: 'geojson',
          data: 'https:\/\/services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/USA_Wildfires_v1/FeatureServer/1/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=GISAcres%2CIncidentName%2CDateCurrent&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=3&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token='
          //data: 'https:\/\/opendata.arcgis.com/datasets/5da472c6d27b4b67970acc7b5044c862_0.geojson'
          //data: 'https:\/\/services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Active_Fires/FeatureServer/0/query?f=geojson&where=(ControlDateTime%20IS%20NULL)%20AND%20(IncidentTypeCategory%20%3D%20%27WF%27)%20AND%20(FireOutDateTime%20IS%20NULL)%20AND%20(FireDiscoveryDateTime%20%3E%20timestamp%20%272020-01-02%2007%3A59%3A59%27)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=DailyAcres%20desc&resultOffset=0&resultRecordCount=&resultType=standard'
        });

        map.addLayer({
          'id': 'FiresP2',
          'type': 'fill',  //line or fill
          'source':'FiresP',
          'paint':{
            'fill-color': 'rgba(200,0,0,0.5)',
          },
        }, 'settlement-label');
        map.addLayer({
          'id': 'FiresP',
          'type': 'symbol',
          'source': 'FiresP',
          'minzoom':10,
          'layout': {
            'text-field': ['string', ['get', 'IncidentName']],
            'text-font': [
              "Open Sans Condensed Bold",
            ],
            'text-size': 16,
            // [
            //   "interpolate", ["linear"],
            //   ["zoom"],
            //   4, 0,
            //   4.95, 0,
            //   5, 12,
            //   7, 16,
            //   11, 18,
            // ],
            'text-offset': [0, 0],
            'text-allow-overlap': true,
          },
          'paint': {
            //'text-halo-color': 'rgba(0,0,0,0.75)',
            //'text-halo-width': 1.5,
            'text-color': 'rgba(200,0,0,1.0)'
          },
        },'settlement-label');
        map.on('render', stopSpinner);

        map.on('click', 'FiresP2', function(e) {
          new mapboxgl.Popup({maxWidth:'400px'})
            .setLngLat(e.lngLat)
            .setHTML(`<div class="popup-header">${e.features[0].properties.IncidentName}</div>Acres: <b>${e.features[0].properties.GISAcres.toFixed(1)} Acres</b><br>Updated: <b>${moment(e.features[0].properties.DateCurrent).format('lll')}</b>`)
            .addTo(map);
        });

        map.on('mouseenter', 'FiresP2', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'FiresP2', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function removeFireP() {
        map.removeLayer('FiresP')
        map.removeLayer('FiresP2')
        map.removeSource('FiresP')
      }


      function addFireDispatch(){
        loadingSpinner(true);
            map.addSource('FiresDispatch', {
          type:'geojson',
          data:'https:\/\/services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/National_Dispatch_Current/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=102100&spatialRel=esriSpatialRelIntersects&resultType=tile&&units=esriSRUnit_Meter&returnGeodetic=false&outFields=OBJECTID,GACCName,DispName,DispLocation&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=3&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token='
              // type: 'vector',
              // tiles: ['https:\/\/services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/National_Dispatch_Current/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry={bbox-epsg-3857}&geometryType=esriGeometryEnvelope&inSR=102100&spatialRel=esriSpatialRelIntersects&resultType=tile&&units=esriSRUnit_Meter&returnGeodetic=false&outFields=OBJECTID,GACCName,DispName,DispLocation&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pbf&token='],
              // tileSize: 512,
              // minZoom: 2,
              // maxZoom: 16,
            });

            map.addLayer({
          'id': 'FiresDispatch',
          'type': 'fill',  //line or fill
          'source':'FiresDispatch',
          'paint':{
            'fill-color': 'rgba(200,0,0,0.0)',
            //'line-width': 2,
          },
        }, 'settlement-label');
        map.addLayer({
          'id': 'FiresDispatch3',
          'type': 'line',  //line or fill
          'source':'FiresDispatch',
          'paint':{
            'line-color': 'rgba(200,0,0,0.9)',
            'line-width': 2,
          },
        }, 'settlement-label');
        map.addLayer({
          'id': 'FiresDispatch2',
          'type': 'symbol',
          'source':'FiresDispatch',
         // 'minzoom':10,
          'layout': {
            'text-field': ['string', ['get', 'DispName']],
            'text-font': [
              "Open Sans Condensed Bold",
            ],
            'text-size': 13,
            // [
            //   "interpolate", ["linear"],
            //   ["zoom"],
            //   4, 0,
            //   4.95, 0,
            //   5, 12,
            //   7, 16,
            //   11, 18,
            // ],
            'text-offset': [0, 0],
            'text-allow-overlap': false,
          },
          'paint': {
            //'text-halo-color': 'rgba(0,0,0,0.75)',
            //'text-halo-width': 1.5,
            'text-color': 'rgba(200,0,0,1.0)'
          },
        },'settlement-label');

        map.on('render', stopSpinner);

      map.on('click', 'FiresDispatch', function(e) {
        new mapboxgl.Popup({maxWidth:'500px'})
          .setLngLat(e.lngLat)
          .setHTML(`<div class="popup-header">${e.features[0].properties.GACCName}</div><b>${e.features[0].properties.DispName}</b> - ${e.features[0].properties.DispLocation}`)
          .addTo(map);
      });

      map.on('mouseenter', 'FiresDispatch', function() {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'FiresDispatch', function() {
        map.getCanvas().style.cursor = '';
      });


      }

      function removeFireDispatch() {
        map.removeLayer('FiresDispatch')
        map.removeLayer('FiresDispatch2')
        map.removeLayer('FiresDispatch3')
        map.removeSource('FiresDispatch')
      }
   var markers = {};

   function addCam(){

    let cams = [
  {"name":"ODOT_I84_NorthPowder","elev":3273,"dir":"N","lat":45.0138,"lon":-117.9168,"url":"https:\/\/tripcheck.com/roadcams/cams/North%20Powder_pid2379.jpg"},
  {"name":"ODOT_I84_BakerRestArea","elev":3487,"dir":"N","lat":44.9154,"lon":-117.8197,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Baker%20Valley%20W_pid3656.jpg"},
  {"name":"ODOT_I84_MedicalSprings","elev":3358,"dir":"N","lat":44.8619,"lon":-117.8161,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Medical%20Springs_pid3347.JPG"},
  {"name":"Baker_Airport","elev":3371,"dir":"NW","lat":44.8341,"lon":-117.8078,"url":"http:\/\/206.192.246.245/netcam.jpg"},
  {"name":"ODOT_I84_SouthBaker","elev":3708,"dir":"SE","lat":44.7229,"lon":-117.7728,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20MP309_pid4361.jpg"},
  //{"name":"#Baker_Library","elev":3435,"dir":"NE","lat":44.781,"lon":-117.8284,"url":"http:\/\/weathercam.bakerlib.org/netcam.jpg"},
  //{"name":"#Sumpter_NW","elev":4300,"dir":"NW","lat":44.7323,"lon":-118.1932,"url":"http:\/\/www.sumpterpinesrvpark.com/webcam/cam_2.jpg"},
  //{"name":"#Sumpter_SE","elev":4300,"dir":"SE","lat":44.731,"lon":-118.1905,"url":"http:\/\/www.sumpterpinesrvpark.com/webcam/cam_1.jpg"},
  {"name":"ODOT_Sumpter","elev":4245,"dir":"SW","lat":44.7171,"lon":-118.1632,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE7%20at%20Sumpter_pid3499.jpg"},
  {"name":"ODOT_AustinJct","elev":4233,"dir":"W","lat":44.5736,"lon":-118.4968,"url":"https:\/\/tripcheck.com/roadcams/cams/AustinJunction_pid1522.jpg"},
  {"name":"ODOT_Unity","elev":4015,"dir":"N","lat":44.4405,"lon":-118.1934,"url":"https:\/\/tripcheck.com/roadcams/cams/US26%20at%20Unity%20WB_pid3483.jpg"},
  //{"name":"#Halfway","elev":2660,"dir":"N","lat":44.8772,"lon":-117.1092,"url":"http:\/\/halfwaycam.dyndns.org/netcam.jpg"},
  //{"name":"#Halfway","elev":2647,"dir":"NW","lat":44.8762,"lon":-117.1088,"url":"http:\/\/images.lookr-cdn.com/normal/1421719154-Halfway.jpg"},
  {"name":"ODOT_Halfway_Summit","elev":3677,"dir":"NW","lat":44.8272,"lon":-117.1194,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE86%20at%20Halfway%20Summit_pid3165.jpg"},
  {"name":"Richland","elev":2090,"dir":"W","lat":44.758,"lon":-117.1241,"url":"http:\/\/www7.bakercounty.org/parks/pimg/parks.jpg"},
  {"name":"ODOT_I84_PlanoRoad","elev":2558,"dir":"SE","lat":44.5504,"lon":-117.4219,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20At%20Plano%20Road_pid1662.jpg"},
  {"name":"ODOT_I84_Weatherby","elev":2400,"dir":"SE","lat":44.4963,"lon":-117.369,"url":"https:\/\/tripcheck.com/roadcams/cams/Weatherby_pid657.jpg"},
  {"name":"ODOT_I84_RyeValley","elev":2320,"dir":"S","lat":44.4449,"lon":-117.3254,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20EB%20at%20Rye%20Valley_pid1661.jpg"},
  {"name":"BigLookout","elev":7125,"dir":"V","lat":44.6088,"lon":-117.2782,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-BigLookout"},
  {"name":"ODOT_I84_FarewellBend_E","elev":2132,"dir":"E","lat":44.2948,"lon":-117.2295,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Farewell%20Bend%20EB_pid3686.jpg"},
  {"name":"ODOT_I84_FarewellBend_W","elev":2132,"dir":"E","lat":44.297,"lon":-117.2322,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Farewell%20Bend%20WB_pid3690.jpg"},
  {"name":"ODOT_I84_WeiserExit_E","elev":2093,"dir":"E","lat":44.2587,"lon":-117.1766,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE201N%20at%20I-84%20EB%20Onramp_pid3907.JPG"},
  {"name":"ODOT_I84_WeiserExit_W","elev":2093,"dir":"W","lat":44.2601,"lon":-117.1811,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE201N%20at%20I-84%20WB%20Onramp_pid3674.JPG"},
  {"name":"Weiser_River_SE","elev":2206,"dir":"SE","lat":44.2709,"lon":-116.7727,"url":"http:\/\/waterdata.usgs.gov/nwisweb/local/state/id/text/13266000.nwisweb.jpg"},
  {"name":"WeiserAirport_E","elev":2108,"dir":"E","lat":44.2084,"lon":-116.9604,"url":"http:\/\/www.eye-n-sky.net/webcam/Weiser/Weiser-East.jpg"},
  {"name":"WeiserAirport_SW","elev":2108,"dir":"SW","lat":44.2069,"lon":-116.9633,"url":"http:\/\/www.eye-n-sky.net/webcam/Weiser/Weiser-SW.jpg"},
  {"name":"PayetteAirport_E","elev":2224,"dir":"E","lat":44.0922,"lon":-116.9034,"url":"http:\/\/www.eye-n-sky.net/webcam/Payette-S75/Payette-S75-East.jpg"},
  {"name":"ODOT_Weiser","elev":2169,"dir":"W","lat":44.2162,"lon":-116.9867,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE201%20at%20Weiser_pid3682.jpg"},
  {"name":"CottonwoodMtn","elev":6491,"dir":"V","lat":44.1687,"lon":-117.6621,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-Cottonwood"},
  {"name":"ODOT_BroganHill","elev":3980,"dir":"E","lat":44.2785,"lon":-117.6547,"url":"https:\/\/tripcheck.com/roadcams/cams/US26%20at%20Brogan%20Hill_pid3670.jpg"},
  {"name":"ODOT_EastDrinkWaterPass","elev":3024,"dir":"W","lat":43.7706,"lon":-118.1297,"url":"https:\/\/tripcheck.com/roadcams/cams/US20%20at%20Drinkwater%20Pass_pid3109.jpg"},
  {"name":"ODOT_WestDrinkWaterPass","elev":3516,"dir":"E","lat":43.7833,"lon":-118.3399,"url":"https:\/\/tripcheck.com/roadcams/cams/US20%20at%20Drinkwater%20Pass_pid3113.jpg"},
  {"name":"ODOT_Burns","elev":4165,"dir":"E","lat":43.6142,"lon":-119.0203,"url":"https:\/\/tripcheck.com/roadcams/cams/US20%20at%20US395%20Burns%20EB_pid3991.JPG"},
  {"name":"Burns_Airport","elev":4150,"dir":"N","lat":43.5864,"lon":-118.9549,"url":"http:\/\/www.wrh.noaa.gov/boi/images/burns_airport.jpg"},
  {"name":"MonumentMtn","elev":5696,"dir":"V","lat":43.6642,"lon":-117.8914,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-Monument"},
  {"name":"Frenchglen","elev":4194,"dir":"SW","lat":42.8278,"lon":-118.9146,"url":"https:\/\/tripcheck.com/roadcams/cams/Frenchglen_pid1502.jpg"},
  {"name":"RiddleMtn","elev":6337,"dir":"V","lat":43.1001,"lon":-118.4989,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-Riddle/"},
  {"name":"SteensMtn","elev":9737,"dir":"V","lat":42.6357,"lon":-118.5764,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-Steens/"},
  //{"name":"#Burns_BLM_NW","elev":4200,"dir":"NW","lat":43.5234,"lon":-119.0964,"url":"http:\/\/www.wrh.noaa.gov/boi/images/burns_nw_cam.jpg"},
  //{"name":"#Burns_BLM_SE","elev":4200,"dir":"SE","lat":43.5227,"lon":-119.0947,"url":"http:\/\/www.wrh.noaa.gov/boi/images/burns_se_cam.jpg"},
  {"name":"ODOT_Riley","elev":4219,"dir":"W","lat":43.5421,"lon":-119.5039,"url":"https:\/\/tripcheck.com/roadcams/cams/US20%20at%20US395%20Riley_pid2569.jpg"},
  {"name":"BlueMtn","elev":7448,"dir":"V","lat":42.3214,"lon":-117.8754,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-Blue"},
  {"name":"MahoganyMtn","elev":6395,"dir":"V","lat":43.2541,"lon":-117.2463,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-Mahogany"},
  {"name":"NewMeadows","elev":4109,"dir":"NE","lat":44.9972,"lon":-116.3036,"url":"https:\/\/icons.wunderground.com/webcamramdisk/s/n/snowave/5/current.jpg"},
  {"name":"ITD_IdahoCountyLine_SW","elev":2460,"dir":"SW","lat":45.2928,"lon":-116.3573,"url":"https:\/\/idcam.carsprogram.org/station10632cam1.jpg"},
  {"name":"ITD_IdahoCountyLine_N","elev":2460,"dir":"N","lat":45.3007,"lon":-116.3611,"url":"https:\/\/idcam.carsprogram.org/station10632cam2.jpg"},
  {"name":"ITD_SmokeyBoulder_E","elev":3817,"dir":"E","lat":45.1089,"lon":-116.3023,"url":"https:\/\/idcam.carsprogram.org/station2987cam1.jpg"},
  {"name":"ITD_SmokeyBoulder_S","elev":3817,"dir":"S","lat":45.1068,"lon":-116.3032,"url":"https:\/\/idcam.carsprogram.org/station2987cam2.jpg"},
  {"name":"Brundage_Snowstake","elev":6040,"dir":"N","lat":45.0053,"lon":-116.1562,"url":"http:\/\/www.brundage.com/webcam/snowcam.jpg"},
  //{"name":"#Brundage_MidStake","elev":6450,"dir":"N","lat":45.0087,"lon":-116.1491,"url":"http:\/\/www.brundage.com/webcam/SummitSnowCam.jpg"},
  {"name":"Brundage_Bear","elev":6490,"dir":"E","lat":45.0024,"lon":-116.1476,"url":"https:\/\/copyrighted.seejh.com/bmrbear/bmrbear.jpg"},
  {"name":"Brundage_BluebirdTop","elev":7640,"dir":"W","lat":45.003,"lon":-116.1348,"url":"https:\/\/copyrighted.seejh.com/bmrsummit/bmrsummit.jpg"},
  {"name":"Brundage_Lakeview","elev":7600,"dir":"E","lat":45.0092,"lon":-116.1321,"url":"https:\/\/copyrighted.seejh.com/bmrcentennial/centennial.jpg"},
  {"name":"ITD_GooseCreek_N","elev":5380,"dir":"N","lat":44.9289,"lon":-116.1514,"url":"https:\/\/idcam.carsprogram.org/station2994cam1.jpg"},
  {"name":"ITD_GooseCreek_S","elev":5380,"dir":"S","lat":44.9281,"lon":-116.1494,"url":"https:\/\/idcam.carsprogram.org/station2994cam2.jpg"},
  {"name":"PayetteLake_NW","elev":5000,"dir":"NW","lat":44.914,"lon":-116.0969,"url":"http:\/\/www.mayhardware.com/PAGES/mmc.jpg"},
  {"name":"PayetteLake_SW","elev":5000,"dir":"SW","lat":44.9134,"lon":-116.097,"url":"http:\/\/milehighmarina.com/webcam/rampcam.jpg"},
  {"name":"McCall_Airport","elev":5030,"dir":"NW","lat":44.8935,"lon":-116.0994,"url":"https:\/\/evogov.s3.amazonaws.com/media/141/media/136405.jpeg"},
  {"name":"McCall_Snowstake","elev":5030,"dir":"SW","lat":44.9102,"lon":-116.0948,"url":"https:\/\/evogov.s3.amazonaws.com/141/media/115595.jpg"},
  //{"name":"#McCall_River","elev":4991,"dir":"N","lat":44.8665,"lon":-116.1314,"url":"http:\/\/www.brundage.com/webcam/RiverRanch.jpg"},
  {"name":"McCall_ActivityBarn","elev":4991,"dir":"N","lat":44.8717,"lon":-116.115,"url":"http:\/\/www.brundage.com/webcam/activitybarn.jpg"},
  {"name":"ITD_FortHallHill_S","elev":3565,"dir":"S","lat":44.8231,"lon":-116.3999,"url":"https:\/\/idcam.carsprogram.org/station2991cam2.jpg"},
  {"name":"ITD_FortHallHill_N","elev":3565,"dir":"N","lat":44.834,"lon":-116.3989,"url":"https:\/\/idcam.carsprogram.org/station2991cam1.jpg"},
  {"name":"Cambridge","elev":2969,"dir":"N","lat":44.621,"lon":-116.6767,"url":"https:\/\/www.eye-n-sky.net/webcam/RushCreek/RushCreek-North.jpg"},
  {"name":"ITD_MidvaleHill_NE","elev":3160,"dir":"NE","lat":44.445,"lon":-116.8002,"url":"https:\/\/idcam.carsprogram.org/station3011cam1.jpg"},
  {"name":"ITD_MidvaleHill_SW","elev":3160,"dir":"SW","lat":44.4437,"lon":-116.8043,"url":"https:\/\/idcam.carsprogram.org/station3011cam2.jpg"},
  {"name":"MidvaleAirport","elev":2606,"dir":"SE","lat":44.4622,"lon":-116.76,"url":"http:\/\/www.ruralnetwork.net/~rnsmvlcm/midvalehill.jpg"},
  //{"name":"#Tamarack_Mountain","elev":4800,"dir":"SW","lat":44.733,"lon":-116.113,"url":"http:\/\/www.citlink.net/~klmhayes/CabinCam/CabinCam_Tam.jpg"},
  //{"name":"#Donnelly_Cabin","elev":4800,"dir":"NW","lat":44.735,"lon":-116.1109,"url":"http:\/\/www.citlink.net/~klmhayes/CabinCam/CabinCam.jpg"},
  //{"name":"#Donnelly_Snowstake","elev":4800,"dir":"NE","lat":44.737,"lon":-116.109,"url":"http:\/\/www.citlink.net/~klmhayes/CabinCam/SnowCam.jpg"},
  //{"name":"#Tamarack_Snowstake","elev":4960,"dir":"N","lat":44.6707,"lon":-116.1233,"url":"http:\/\/ftp.zbytesoftware.net/tamcams/BaseStake.jpg"},
  {"name":"Tamarack_Mid","elev":6600,"dir":"SE","lat":44.682,"lon":-116.1491,"url":"https:\/\/img.hdrelay.com/frames/673db665-1845-4f92-838e-01b9b60713c1/default/last.jpg"},
  //{"name":"#Tamarack_Base2","elev":4960,"dir":"N","lat":44.6744,"lon":-116.1228,"url":"http:\/\/ftp.zbytesoftware.net/tamcams/TamExp.jpg"},
  {"name":"Tamarack_Summit","elev":7559,"dir":"E","lat":44.6853,"lon":-116.163,"url":"https:\/\/storage.googleapis.com/prism-cam-00049/1080.jpg"},
  {"name":"ITD_LittleDonner_S","elev":5143,"dir":"S","lat":44.5778,"lon":-116.0354,"url":"https:\/\/idcam.carsprogram.org/station3007cam1.jpg"},
  {"name":"ITD_LittleDonner_N","elev":5143,"dir":"N","lat":44.5788,"lon":-116.0363,"url":"https:\/\/idcam.carsprogram.org/station3007cam2.jpg"},
  {"name":"JohnsonCreek_SW","elev":4910,"dir":"SW","lat":44.9112,"lon":-115.4852,"url":"https:\/\/www.eye-n-sky.net/webcam/JohnsonCr/JohnsonCr-South.jpg"},
  {"name":"JohnsonCreek_N","elev":4910,"dir":"N","lat":44.9163,"lon":-115.4852,"url":"https:\/\/www.eye-n-sky.net/webcam/JohnsonCr/JohnsonCr-North.jpg"},
  {"name":"YellowPine_S","elev":4862,"dir":"S","lat":44.9581,"lon":-115.4937,"url":"https:\/\/www.eye-n-sky.net/webcam/YellowPine/YellowPine-S.jpg"},
  {"name":"YellowPine_NW","elev":4862,"dir":"NW","lat":44.9681,"lon":-115.4928,"url":"https:\/\/www.eye-n-sky.net/webcam/YellowPine/YellowPine-North.jpg"},
  {"name":"YellowPine_W","elev":4862,"dir":"W","lat":44.9645,"lon":-115.4954,"url":"https:\/\/www.eye-n-sky.net/webcam/YellowPine/YellowPine-West.jpg"},
  {"name":"FlyingB_Ranch_S","elev":3659,"dir":"S","lat":44.9564,"lon":-114.7357,"url":"https:\/\/www.flyingresortranches.com/cam/FlyingB-South.jpg"},
  {"name":"FlyingB_Ranch_N","elev":3659,"dir":"N","lat":44.958,"lon":-114.7357,"url":"https:\/\/www.flyingresortranches.com/cam/FlyingB-North.jpg"},
  {"name":"SulphurCreekRanch_S","elev":5836,"dir":"S","lat":44.5379,"lon":-115.3715,"url":"https:\/\/www.eye-n-sky.net/webcam/SulphurCreek/SulphurCreek-South.jpg"},
  {"name":"SulphurCreekRanch_E","elev":5836,"dir":"E","lat":44.5379,"lon":-115.3625,"url":"https:\/\/www.eye-n-sky.net/webcam/SulphurCreek/SulphurCreek-East.jpg"},
  {"name":"BigCreek_N","elev":5751,"dir":"N","lat":45.1304,"lon":-115.3219,"url":"https:\/\/www.eye-n-sky.net/webcam/BigCreek/BigCreek-North.jpg"},
  {"name":"BigCreek_SE","elev":5751,"dir":"SE","lat":45.1276,"lon":-115.3235,"url":"https:\/\/www.eye-n-sky.net/webcam/BigCreek/BigCreek-SE.jpg"},
  {"name":"BigCreek_SW","elev":5751,"dir":"SW","lat":45.1253,"lon":-115.3251,"url":"https:\/\/www.eye-n-sky.net/webcam/BigCreek/BigCreek-SW.jpg"},
  //{"name":"#WarmLake","elev":5317,"dir":"E","lat":44.6445,"lon":-115.6755,"url":"http:\/\/www.hoffmancabin.com/hcwebcam/image.jpg"},
  {"name":"ITD_SmithsFerry_S","elev":4585,"dir":"S","lat":44.3007,"lon":-116.0892,"url":"https:\/\/idcam.carsprogram.org/station3100cam2.jpg"},
  {"name":"ITD_SmithsFerry_N","elev":4585,"dir":"S","lat":44.3026,"lon":-116.0885,"url":"https:\/\/idcam.carsprogram.org/station3100cam1.jpg"},
  {"name":"Garden_Valley","elev":3050,"dir":"NW","lat":44.1122,"lon":-115.9596,"url":"http:\/\/www.gardenvalleyfire.net/weather/webcam.jpg"},
  //{"name":"#Garden_Valley2","elev":3450,"dir":"NE","lat":44.1182,"lon":-115.9875,"url":"http:\/\/gvidaho.com/weather/nwcam04.jpg"},
  {"name":"GardenValleyAirport_W","elev":3130,"dir":"W","lat":44.0688,"lon":-115.9371,"url":"https:\/\/www.eye-n-sky.net/webcam/GardenValley/GardenValley-West.jpg"},
  {"name":"GardenValleyAirport_E","elev":3130,"dir":"E","lat":44.0659,"lon":-115.9284,"url":"https:\/\/www.eye-n-sky.net/webcam/GardenValley/GardenValley-East.jpg"},
  //{"name":"#Garden_Valley3","elev":3450,"dir":"NW","lat":44.1173,"lon":-115.9904,"url":"http:\/\/gvidaho.com/weather/nwcam02.jpg"},
  //{"name":"#HorseshoeBend_Elem","elev":2605,"dir":"W","lat":43.908,"lon":-116.2015,"url":"http:\/\/www.instacam.com/instacamimg/HRSSH/HRSSH_l.jpg"},
  {"name":"HorseshoeBend_Ridge","elev":3822,"dir":"NE","lat":43.8601,"lon":-116.2307,"url":"https:\/\/assets1.webcam.io/w/y9LVJz/latest.jpg"},
  {"name":"ITD_HorseshoeBendHill","elev":4253,"dir":"N","lat":43.8361,"lon":-116.2455,"url":"https:\/\/idcam.carsprogram.org/station3001cam1.jpg"},
  {"name":"ITD_HorseshoeBendHill_SE","elev":4253,"dir":"SE","lat":43.8313,"lon":-116.2453,"url":"https:\/\/idcam.carsprogram.org/station3001cam2.jpg"},
  {"name":"SquawButte","elev":5880,"dir":"V","lat":44.0038,"lon":-116.4116,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-SquawButte"},
  //{"name":"#Ontario_Airport_N","elev":2195,"dir":"N","lat":44.0248,"lon":-117.0128,"url":"http:\/\/67.41.36.73/image/AirCam2"},
  //{"name":"#Ontario_Airport_SE","elev":2195,"dir":"SE","lat":44.0201,"lon":-117.0095,"url":"http:\/\/67.41.36.73/image/AirCam4"},
  {"name":"ODOT_Ontario_S","elev":2150,"dir":"S","lat":44.008,"lon":-116.9416,"url":"https:\/\/tripcheck.com/roadcams/cams/Snake%20River_pid654.JPG"},
  {"name":"ODOT_Ontario_N","elev":2150,"dir":"N","lat":44.0105,"lon":-116.9426,"url":"https:\/\/tripcheck.com/roadcams/cams/Snake%20River_pid3870.jpg"},
  {"name":"ITD_I84_Fruitland_NW","elev":2250,"dir":"NW","lat":43.9739,"lon":-116.917,"url":"https:\/\/idcam.carsprogram.org/station3002cam1.jpg"},
  {"name":"ITD_I84_Fruitland_N","elev":2250,"dir":"N","lat":43.9745,"lon":-116.914,"url":"https:\/\/idcam.carsprogram.org/station3002cam2.jpg"},
  {"name":"ITD_BlackCanyon_SE","elev":2544,"dir":"SE","lat":43.8673,"lon":-116.7804,"url":"https:\/\/idcam.carsprogram.org/station3231cam1.jpg"},
  {"name":"ITD_BlackCanyon_N","elev":2544,"dir":"N","lat":43.8706,"lon":-116.7853,"url":"https:\/\/idcam.carsprogram.org/station3231cam2.jpg"},
  //{"name":"#Parma_NE","elev":2251,"dir":"NE","lat":43.7884,"lon":-116.9385,"url":"http:\/\/www.sierrathunder.com/parma/images/parmacam_1.jpg"},
  //{"name":"#Parma_SW","elev":2251,"dir":"SW","lat":43.7867,"lon":-116.9408,"url":"http:\/\/www.sierrathunder.com/parma/images/parmacam_2.jpg"},
  {"name":"ODOT_BasqueStation","elev":4461,"dir":"N","lat":42.4119,"lon":-117.8625,"url":"https:\/\/tripcheck.com/roadcams/cams/Basque_pid1597.jpg"},
  {"name":"SkinnerRanch_NW","elev":4243,"dir":"NW","lat":42.9567,"lon":-117.2929,"url":"http:\/\/www.eye-n-sky.net/webcam/Skinner/Skinner-NW.jpg"},
  {"name":"SkinnerRanch_W","elev":4243,"dir":"W","lat":42.9488,"lon":-117.2915,"url":"http:\/\/www.eye-n-sky.net/webcam/Skinner/Skinner-West.jpg"},
  {"name":"SkinnerRanch_SE","elev":4243,"dir":"SE","lat":42.9464,"lon":-117.276,"url":"http:\/\/www.eye-n-sky.net/webcam/Skinner/Skinner-SE.jpg"},
  {"name":"SkinnerRanch_E","elev":4243,"dir":"E","lat":42.9543,"lon":-117.2763,"url":"http:\/\/www.eye-n-sky.net/webcam/Skinner/Skinner-East.jpg"},
  {"name":"ODOT_JordanValley","elev":4386,"dir":"N","lat":42.9811,"lon":-117.0533,"url":"https:\/\/tripcheck.com/roadcams/cams/JordanValley_pid1598.jpg"},
  {"name":"ITD_IonSummit_NW","elev":4397,"dir":"NW","lat":43.3022,"lon":-116.9839,"url":"https:\/\/idcam.carsprogram.org/station10687cam3.jpg"},
  {"name":"ITD_IonSummit_S","elev":4397,"dir":"S","lat":43.2828,"lon":-116.9908,"url":"https:\/\/idcam.carsprogram.org/station10687cam1.jpg"},
  {"name":"HaydenPeak","elev":8409,"dir":"V","lat":42.9803,"lon":-116.6577,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-HaydenPeak"},
  {"name":"JosephineCreekRanch_SE","elev":5271,"dir":"SE","lat":42.7395,"lon":-116.6702,"url":"https:\/\/www.eye-n-sky.net/webcam/Josephine/Josephine-East.jpg"},
  {"name":"JosephineCreekRanch_N","elev":5271,"dir":"N","lat":42.7394,"lon":-116.6695,"url":"https:\/\/www.eye-n-sky.net/webcam/Josephine/Josephine-North.jpg"},
  {"name":"JosephineCreekRanch_NW","elev":5271,"dir":"NW","lat":42.7423,"lon":-116.6725,"url":"https:\/\/www.eye-n-sky.net/webcam/Josephine/Josephine-NW.jpg"},
  {"name":"ITD_Caldwell_NW","elev":2373,"dir":"NW","lat":43.6715,"lon":-116.6787,"url":"https:\/\/idcam.carsprogram.org/station8502cam1.jpg"},
  {"name":"ITD_Caldwell_S","elev":2373,"dir":"S","lat":43.6702,"lon":-116.6784,"url":"https:\/\/idcam.carsprogram.org/station8501cam1.jpg"},
  {"name":"CaldwellAirport_N","elev":2425,"dir":"N","lat":43.6464,"lon":-116.6426,"url":"http:\/\/www.eye-n-sky.net/webcam/Caldwell/Caldwell-NW.jpg"},
  {"name":"CaldwellAirport_E","elev":2425,"dir":"E","lat":43.6371,"lon":-116.6298,"url":"http:\/\/www.eye-n-sky.net/webcam/Caldwell/Caldwell-East.jpg"},
  {"name":"Nampa_Ridgecrest","elev":2571,"dir":"E","lat":43.6076,"lon":-116.5281,"url":"http:\/\/icons.wunderground.com/webcamramdisk/n/a/NampaModelAviators/1/current.jpg"},
  //{"name":"#Nampa_Snowstake","elev":2451,"dir":"W","lat":43.5924,"lon":-116.5749,"url":"http"},
  {"name":"Nampa_Airport_SW","elev":2530,"dir":"SW","lat":43.5829,"lon":-116.5283,"url":"https:\/\/city.cityofnampa.us/airport/Images/video/1/grabs/KMAN-WEB01.jpg"},
  {"name":"Nampa_Airport_NE","elev":2530,"dir":"NE","lat":43.5852,"lon":-116.52,"url":"https:\/\/city.cityofnampa.us/airport/Images/video/2/grabs/KMAN-WEB02.jpg"},
  {"name":"NNU_N","elev":2500,"dir":"N","lat":43.5647,"lon":-116.5635,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-NNU"},
  {"name":"Nampa_Redhawk_NW","elev":2600,"dir":"NW","lat":43.5505,"lon":-116.6291,"url":"https:\/\/icons.wunderground.com/webcamramdisk/t/h/TheClub/2/current.jpg"},
  {"name":"LakeLowell_N","elev":2500,"dir":"N","lat":43.5749,"lon":-116.6735,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-Indiana"},
  //{"name":"#Homedale","elev":2231,"dir":"S","lat":43.6178,"lon":-116.935,"url":"http:\/\/owyhee.com:8081/webcam.jpg"},
  //{"name":"#Melba","elev":2300,"dir":"W","lat":43.3434,"lon":-116.599,"url":"http:\/\/wwc.instacam.com/instacamimg/MELBA/MELBA_l.jpg"},
  {"name":"Walters_Ferry_NW","elev":2306,"dir":"NW","lat":43.3433,"lon":-1156.5991,"url":"https:\/\/nexusapi-us1.camera.home.nest.com/get_image?uuid=5ccd24f0e0984fd2a23d3150ce8e69bf&width=540&public=GjdPc0zRsn"},
  {"name":"ITD_Wye_SW","elev":2739,"dir":"SW","lat":43.598,"lon":-116.2898,"url":"https:\/\/idcam.carsprogram.org/station8497cam1.jpg"},
  {"name":"ITD_Wye_NE","elev":2739,"dir":"S","lat":43.6018,"lon":-116.2832,"url":"https:\/\/idcam.carsprogram.org/station8496cam1.jpg"},
  //{"name":"SilverSage_NW","elev":2790,"dir":"NW","lat":43.5579,"lon":-116.291,"url":"http:\/\/icons.wunderground.com/webcamramdisk/m/i/miralem77/4/current.jpg"},
  //{"name":"Boise_CityView","elev":2748,"dir":"NE","lat":43.6081,"lon":-116.2213,"url":"http:\/\/mtmcs.com/boisecam/image1.jpg"},
  //{"name":"#Boise_NWS_NE","elev":2860,"dir":"NE","lat":43.5675,"lon":-116.2111,"url":"http:\/\/www.wrh.noaa.gov/boi/images/BOI2-CAM.jpg"},
  //{"name":"#Boise_NWS_SW","elev":2860,"dir":"SW","lat":43.5672,"lon":-116.2117,"url":"http:\/\/www.wrh.noaa.gov/boi/images/BOI1-CAM.jpg"},
  {"name":"Boise_NWS_NE","elev":2860,"dir":"NE","lat":43.5675,"lon":-116.2111,"url":"http:\/\/198.200.151.22/image.jpg"},
  {"name":"Boise_NWS_SW","elev":2860,"dir":"SW","lat":43.5672,"lon":-116.2117,"url":"http:\/\/198.200.151.21/image.jpg"},
  {"name":"ITD_Broadway_E","elev":2863,"dir":"W","lat":43.5647,"lon":-116.1927,"url":"https:\/\/idcam.carsprogram.org/station8499cam1.jpg"},
  {"name":"ITD_Broadway_W","elev":2863,"dir":"E","lat":43.5678,"lon":-116.2013,"url":"https:\/\/idcam.carsprogram.org/station8500cam1.jpg"},
  {"name":"Boise_PublicWorks","elev":-1,"dir":"N","lat":43.5552,"lon":-116.1618,"url":"http:\/\/static.cityofboise.net/resources/AirQuality/BOISE_1.jpg"},
  {"name":"ITD_IsaacCanyon","elev":3142,"dir":"NW","lat":43.5071,"lon":-116.1435,"url":"https:\/\/idcam.carsprogram.org/station3233cam1.jpg"},
  //{"name":"#Bogus_BBQ","elev":6170,"dir":"E","lat":43.7643,"lon":-116.1034,"url":"http:\/\/www.bogusbasin.org/cam_data/bbq/video.jpg"},
  //{"name":"#Bogus_Park","elev":6751,"dir":"NW","lat":43.7717,"lon":-116.1028,"url":"http:\/\/www.bogusbasin.org/cam_data/park/video.jpg"},
  //{"name":"#Bogus_Tubehill","elev":6199,"dir":"SE","lat":43.7645,"lon":-116.1088,"url":"http:\/\/www.bogusbasin.org/cam_data/tubehill/video.jpg"},
  {"name":"Bogus_CityView","elev":7548,"dir":"SW","lat":43.7625,"lon":-116.113,"url":"http:\/\/storage.googleapis.com/prism-cam-00037/1080.jpg"},
  {"name":"Bogus_Base","elev":6187,"dir":"S","lat":43.7639,"lon":-116.1033,"url":"http:\/\/bogusbasinftp.tupelo.matraex.com/flats.jpg"},
  {"name":"Bogus_Coaster","elev":6187,"dir":"E","lat":43.7643,"lon":-116.1019,"url":"http:\/\/bogusbasinftp.tupelo.matraex.com/coaster.jpg"},
  {"name":"Bogus_Ridge","elev":6485,"dir":"S","lat":43.767,"lon":-116.1047,"url":"http:\/\/bogusbasinftp.tupelo.matraex.com/snowmarker.php"},
  {"name":"Bogus_Snowstake","elev":6364,"dir":"W","lat":43.764,"lon":-116.0968,"url":"http:\/\/bogusbasinftp.tupelo.matraex.com/boguscreek.jpg"},
  {"name":"Bogus_Snowstake_Mid","elev":6500,"dir":"W","lat":43.7674,"lon":-116.103,"url":"http:\/\/bogusbasinftp.tupelo.matraex.com/csm.jpg"},
  //{"name":"#Bogus_Showcase","elev":6347,"dir":"S","lat":43.7647,"lon":-116.0961,"url":"https:\/\/secure.bogusbasin.org/images/showcase/video.jpg"},
  //{"name":"#Bogus_Pioneer","elev":6759,"dir":"E","lat":43.7713,"lon":-116.1018,"url":"https:\/\/secure.bogusbasin.org/images/pioneer/video.jpg"},
  //{"name":"#Bogus_PineCreek_Top","elev":7548,"dir":"E","lat":43.7714,"lon":-116.0876,"url":"http:\/\/bogusbasinftp.tupelo.matraex.com/pinecreek.jpg"},
  {"name":"Bogus_PineCreek","elev":7548,"dir":"E","lat":43.7714,"lon":-116.08,"url":"http:\/\/storage.googleapis.com/prism-cam-00091/1080.jpg"},
  {"name":"ShaferButte_NE","elev":7569,"dir":"NE","lat":43.7714,"lon":-116.0877,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-ShaferButte"},
  //{"name":"#Idaho_City","elev":4344,"dir":"NW","lat":43.8427,"lon":-115.8119,"url":"http:\/\/icons.wunderground.com/webcamramdisk/l/i/limbercabin/1/current.jpg"},
  //{"name":"#Centerville_E","elev":4152,"dir":"E","lat":43.8803,"lon":-115.921,"url":"http:\/\/icons.wunderground.com/webcamramdisk/m/i/miralem77/6/current.jpg"},
  //{"name":"#Centerville_SW","elev":4152,"dir":"SW","lat":43.8798,"lon":-115.9252,"url":"http:\/\/icons.wunderground.com/webcamramdisk/m/i/miralem77/7/current.jpg"},
  {"name":"ITD_HighlandValleySmt_SW","elev":3777,"dir":"SW","lat":43.567,"lon":-116.0364,"url":"https:\/\/idcam.carsprogram.org/station3000cam1.jpg"},
  {"name":"ITD_HighlandValleySmt_NE","elev":3777,"dir":"NE","lat":43.5696,"lon":-116.0331,"url":"https:\/\/idcam.carsprogram.org/station3000cam2.jpg"},
  {"name":"RobieCreek","elev":3725,"dir":"E","lat":43.6345,"lon":-116.0314,"url":"http:\/\/icons.wunderground.com/webcamramdisk/r/o/RockyCanyonWeather/8/current.jpg"},
  {"name":"BennettMtn_NE","elev":7439,"dir":"NE","lat":43.2492,"lon":-115.4341,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-BennettMtn"},
  {"name":"ITD_PineTurnoff_SW","elev":5460,"dir":"SW","lat":43.3103,"lon":-115.2717,"url":"https:\/\/idcam.carsprogram.org/station3013cam2.jpg"},
  {"name":"ITD_PineTurnoff_E","elev":5460,"dir":"E","lat":43.3131,"lon":-115.2659,"url":"https:\/\/idcam.carsprogram.org/station3013cam1.jpg"},
  //{"name":"#Fairfield","elev":5060,"dir":"N","lat":43.347,"lon":-114.791,"url":"http:\/\/216.182.108.124:8080/netcam.jpg"},
  {"name":"Soldier_Mountain","elev":5800,"dir":"W","lat":43.4847,"lon":-114.8292,"url":"http:\/\/ketchumcomputers.com/webcam/mtncam.jpg"},
  {"name":"Soldier_Snowstake","elev":5800,"dir":"W","lat":43.4848,"lon":-114.8329,"url":"http:\/\/ketchumcomputers.com/webcam/snowcam.jpg"},
  {"name":"ITD_Simco_N","elev":3311,"dir":"N","lat":43.3498,"lon":-115.9599,"url":"https:\/\/idcam.carsprogram.org/station10688cam1.jpg"},
  {"name":"ITD_Simco_SE","elev":3311,"dir":"SE","lat":43.3448,"lon":-115.9539,"url":"https:\/\/idcam.carsprogram.org/station10688cam2.jpg"},
  {"name":"MountainHomeAirport","elev":3164,"dir":"NE","lat":43.1284,"lon":-115.7286,"url":"https:\/\/nexusapi-us1.dropcam.com/get_image?uuid=93c0730bde99421cb2c65b50d4807859&width=560&public=bBCOmy5wiq"},
  {"name":"ITD_HammettHill_NE","elev":3191,"dir":"NE","lat":43.0062,"lon":-115.5453,"url":"https:\/\/idcam.carsprogram.org/station2996cam1.jpg"},
  {"name":"ITD_HammettHill_NW","elev":3191,"dir":"NW","lat":43.0137,"lon":-115.5524,"url":"https:\/\/idcam.carsprogram.org/station2996cam2.jpg"},
  {"name":"ITD_GlennsFerry_W","elev":2638,"dir":"W","lat":42.9609,"lon":-115.2648,"url":"https:\/\/idcam.carsprogram.org/station3250cam2.jpg"},
  {"name":"ITD_GlennsFerry_NE","elev":2638,"dir":"NE","lat":42.9662,"lon":-115.2527,"url":"https:\/\/idcam.carsprogram.org/station3250cam1.jpg"},
  {"name":"ITD_Tuttle_E","elev":3385,"dir":"E","lat":42.8361,"lon":-114.8163,"url":"https:\/\/idcam.carsprogram.org/station8399cam1.jpg"},
  {"name":"ITD_Tuttle_NW","elev":3385,"dir":"E","lat":42.848,"lon":-114.8284,"url":"https:\/\/idcam.carsprogram.org/station8399cam2.jpg"},
  {"name":"ITD_GwynnRanch_NE","elev":4869,"dir":"NE","lat":43.125,"lon":-114.6598,"url":"https:\/\/idcam.carsprogram.org/station2995cam1.jpg"},
  {"name":"ITD_GwynnRanch_S","elev":4869,"dir":"S","lat":43.1208,"lon":-114.6623,"url":"https:\/\/idcam.carsprogram.org/station2995cam2.jpg"},
  {"name":"ITD_TimmermanHill_E","elev":4905,"dir":"E","lat":43.326,"lon":-114.2804,"url":"https:\/\/idcam.carsprogram.org/station3020cam1.jpg"},
  {"name":"ITD_TimmermanHill_N","elev":4905,"dir":"N","lat":43.3304,"lon":-114.2793,"url":"https:\/\/idcam.carsprogram.org/station3020cam2.jpg"},
  {"name":"ITD_KinseyButte_S","elev":4613,"dir":"S","lat":43.0975,"lon":-114.3707,"url":"https:\/\/idcam.carsprogram.org/station3006cam2.jpg"},
  {"name":"ITD_KinseyButte_E","elev":4613,"dir":"E","lat":43.1076,"lon":-114.3659,"url":"https:\/\/idcam.carsprogram.org/station3006cam1.jpg"},
  {"name":"DEQ_Dietrich_Butte","elev":4632,"dir":"S","lat":42.9456,"lon":-114.2144,"url":"http:\/\/208.98.173.86/axis-cgi/jpg/image.cgi"},
  {"name":"NotchButte_NE","elev":4342,"dir":"NE","lat":42.8841,"lon":-114.4147,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-NotchButte"},
  {"name":"ITD_JeromeAirport_S","elev":4113,"dir":"S","lat":42.7312,"lon":-114.4408,"url":"https:\/\/idcam.carsprogram.org/station8408cam2.jpg"},
  {"name":"ITD_JeromeAirport_N","elev":4113,"dir":"N","lat":42.7384,"lon":-114.4382,"url":"https:\/\/idcam.carsprogram.org/station8408cam1.jpg"},
  {"name":"ITD_PerrineBridge_NE","elev":3608,"dir":"NE","lat":42.5981,"lon":-114.4548,"url":"https:\/\/idcam.carsprogram.org/station3117cam1.jpg"},
  {"name":"ITD_PerrineBridge_SE","elev":3608,"dir":"SE","lat":42.5945,"lon":-114.4573,"url":"https:\/\/idcam.carsprogram.org/station3117cam2.jpg"},
  {"name":"TwinFallsHS","elev":3660,"dir":"W","lat":42.586,"lon":-114.4859,"url":"https:\/\/assets1.webcam.io/w/yz7Yp9/latest.jpg"},
  {"name":"TwinFallsKMVT","elev":3690,"dir":"W","lat":42.5814,"lon":-114.4597,"url":"https:\/\/nexusapi-us1.dropcam.com/get_image?uuid=17595ba364c94eacb3823cd9a0017aa9&width=560"},
  {"name":"TwinFallsAirport_SW","elev":4134,"dir":"SW","lat":42.4824,"lon":-114.4874,"url":"http:\/\/www.eye-n-sky.net/webcam/TwinFalls/TwinFalls-SW.jpg"},
  {"name":"TwinFallsAirport_SE","elev":4134,"dir":"SE","lat":42.4824,"lon":-114.4771,"url":"http:\/\/www.eye-n-sky.net/webcam/TwinFalls/TwinFalls-SE.jpg"},
  {"name":"ShoshoneFalls","elev":3465,"dir":"E","lat":42.5933,"lon":-114.4046,"url":"http:\/\/shoshonefalls.tfid.org/snap.jpg"},
  {"name":"ITD_HansenBridge_SW","elev":3953,"dir":"SW","lat":42.5669,"lon":-114.2996,"url":"https:\/\/idcam.carsprogram.org/station3251cam1.jpg"},
  {"name":"ITD_HansenBridge_W","elev":3953,"dir":"W","lat":42.5695,"lon":-114.2975,"url":"https:\/\/idcam.carsprogram.org/station3251cam2.jpg"},
  //{"name":"#CSI_TwinFalls","elev":3669,"dir":"E","lat":42.581,"lon":-114.4752,"url":"http:\/\/204.134.224.200/oneshotimage.jpg"},
  {"name":"ITD_Hazelton_SE","elev":4158,"dir":"SE","lat":42.5744,"lon":-114.1428,"url":"https:\/\/idcam.carsprogram.org/station8401cam2.jpg"},
  {"name":"ITD_Hazelton_SW","elev":4158,"dir":"SW","lat":42.5756,"lon":-114.1531,"url":"https:\/\/idcam.carsprogram.org/station8401cam1.jpg"},
  {"name":"DEQ_Hub_Butte","elev":4611,"dir":"NE","lat":42.4315,"lon":-114.4819,"url":"http:\/\/208.98.173.20/axis-cgi/jpg/image.cgi"},
  {"name":"ITD_Rogerson_SE","elev":4946,"dir":"SE","lat":42.2148,"lon":-114.5944,"url":"https:\/\/idcam.carsprogram.org/station3015cam2.jpg"},
  {"name":"ITD_Rogerson_NE","elev":4946,"dir":"NE","lat":42.2167,"lon":-114.5926,"url":"https:\/\/idcam.carsprogram.org/station3015cam1.jpg"},
  {"name":"ITD_Jackpot_N","elev":5534,"dir":"N","lat":42.0163,"lon":-114.6735,"url":"https:\/\/idcam.carsprogram.org/station8442cam1.jpg"},
  {"name":"ITD_Jackpot_S","elev":5534,"dir":"S","lat":42.0061,"lon":-114.6714,"url":"https:\/\/idcam.carsprogram.org/station8442cam2.jpg"},
  {"name":"ITD_Jackpot_W","elev":5534,"dir":"W","lat":42.011,"lon":-114.6745,"url":"https:\/\/idcam.carsprogram.org/station8442cam4.jpg"},
  {"name":"ODOT_I84_Pendleton","elev":1259,"dir":"NW","lat":45.7182,"lon":-119.0148,"url":"https:\/\/tripcheck.com/roadcams/cams/LorenzenRoad_pid635.jpg"},
  //{"name":"#Pendleton_SW","elev":1146,"dir":"SW","lat":45.6729,"lon":-118.8129,"url":"http:\/\/icons.wunderground.com/webcamramdisk/u/k/Ukiahwx/14/current.jpg"},
  //{"name":"#Pendleton_SE","elev":1146,"dir":"SE","lat":45.6744,"lon":-118.8084,"url":"http:\/\/icons.wunderground.com/webcamramdisk/u/k/Ukiahwx/4/current.jpg"},
  {"name":"ODOT_I84_DeadmanPass","elev":3620,"dir":"NW","lat":45.5999,"lon":-118.5075,"url":"https:\/\/tripcheck.com/roadcams/cams/DeadmanP-CabbageHill_pid623.jpg"},
  {"name":"ODOT_Tollgate","elev":5070,"dir":"NE","lat":45.7854,"lon":-118.1096,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE204%20at%20Tollgate_pid4411.jpg"},
  //{"name":"#Tollgate","elev":5070,"dir":"NE","lat":45.7854,"lon":-118.1096,"url":"http:\/\/icons.wunderground.com/webcamramdisk/u/k/Ukiahwx/13/current.jpg"},
  {"name":"ODOT_I84_Meacham_E","elev":4220,"dir":"SE","lat":45.5007,"lon":-118.4209,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Meacham%20EB_pid4455.jpg"},
  {"name":"ODOT_I84_Meacham_W","elev":4220,"dir":"NW","lat":45.5049,"lon":-118.4248,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Meacham%20WB_pid4453.jpg"},
  {"name":"Lagrande_College","elev":2860,"dir":"NE","lat":45.3202,"lon":-118.0998,"url":"http:\/\/www.eou.edu/webcam/ih.jpg"},
  {"name":"MinamRiver_E","elev":3580,"dir":"E","lat":45.3526,"lon":-117.6315,"url":"http:\/\/www.eye-n-sky.net/webcam/Minam/Minam-East.jpg"},
  {"name":"ODOT_I84_Lagrande","elev":2744,"dir":"NW","lat":45.3114,"lon":-118.0525,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Gekeler%20E_pid3659.jpg"},
  {"name":"ODOT_I84_SouthLagrande","elev":2744,"dir":"NW","lat":45.2516,"lon":-118.0208,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20MP%20267_pid3633.JPG"},
  {"name":"ODOT_I84_LaddCreekBase","elev":2874,"dir":"N","lat":45.2338,"lon":-118.014,"url":"https:\/\/tripcheck.com/roadcams/cams/LaddCreekBase_pid1554.jpg"},
  {"name":"ODOT_I84_LaddCreek","elev":3200,"dir":"N","lat":45.2153,"lon":-118.0244,"url":"https:\/\/tripcheck.com/roadcams/cams/LaddCreek_pid627.jpg"},
  {"name":"ODOT_I84_LaddCreekSummit","elev":3619,"dir":"SE","lat":45.188,"lon":-117.9924,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Ladd%20Creek%20Summit_pid3531.JPG"},
  {"name":"ODOT_I84_CloverCreek","elev":3091,"dir":"N","lat":45.1299,"lon":-117.9655,"url":"https:\/\/tripcheck.com/roadcams/cams/I-84%20at%20Clover%20Creek%20EB_pid2325.jpg"},
  {"name":"Joseph_S","elev":3984,"dir":"S","lat":45.3543,"lon":-117.2297,"url":"http:\/\/www.josephoregonweather.com/josephwxcam.jpg"},
  {"name":"Joseph_W","elev":3984,"dir":"S","lat":45.3547,"lon":-117.2569,"url":"http:\/\/www.josephoregonweather.com/josephwxcam2.jpg"},
  {"name":"ODOT_JohnDay","elev":3906,"dir":"S","lat":44.4011,"lon":-118.9472,"url":"https:\/\/tripcheck.com/roadcams/cams/US395C%20at%20Canyon%20City_pid3515.JPG"},
  {"name":"ODOT_Seneca","elev":4673,"dir":"N","lat":44.1381,"lon":-118.9721,"url":"https:\/\/tripcheck.com/roadcams/cams/US395C%20at%20Seneca_pid3491.JPG"},
  {"name":"ODOT_LongCreek","elev":3906,"dir":"S","lat":44.7058,"lon":-119.1082,"url":"https:\/\/tripcheck.com/roadcams/cams/US395B%20at%20Long%20Creek_pid3495.JPG"},
  {"name":"ODOT_BattleMountain","elev":4261,"dir":"S","lat":45.2693,"lon":-118.9776,"url":"https:\/\/tripcheck.com/roadcams/cams/US395%20at%20Battle%20Mountain_pid3536.JPG"},
  {"name":"ODOT_QuartzMountain","elev":5550,"dir":"W","lat":42.3234,"lon":-120.816,"url":"https:\/\/tripcheck.com/roadcams/cams/Quartz%20Mtn_pid2640.jpg"},
  {"name":"ODOT_Bly","elev":4350,"dir":"W","lat":42.4024,"lon":-121.0459,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE140%20at%20Bly_pid2285.jpg"},
  {"name":"ODOT_BlyMountain","elev":5080,"dir":"S","lat":42.3547,"lon":-121.398,"url":"https:\/\/tripcheck.com/roadcams/cams/BlyMtn_pid606.jpg"},
  {"name":"ODOT_HorseRidge","elev":4160,"dir":"W","lat":43.9041,"lon":-120.9934,"url":"https:\/\/tripcheck.com/roadcams/cams/US20%20at%20Horse%20Ridge_pid2418.jpg"},
  {"name":"ODOT_KeyesSummit","elev":4369,"dir":"NW","lat":44.5508,"lon":-120.0406,"url":"https:\/\/tripcheck.com/roadcams/cams/US26%20at%20Keyes%20Summit_pid2550.jpg"},
  {"name":"ODOT_OchocoSummit","elev":4730,"dir":"W","lat":44.5022,"lon":-120.384,"url":"https:\/\/tripcheck.com/roadcams/cams/US26%20at%20Ochoco%20Summit_pid2588.jpg"},
  {"name":"ODOT_Sisters","elev":3222,"dir":"W","lat":44.2913,"lon":-121.5539,"url":"https:\/\/tripcheck.com/roadcams/cams/Sisters_pid653.jpg"},
  {"name":"West_Redmond","elev":3077,"dir":"W","lat":44.2696,"lon":-121.1732,"url":"https:\/\/tripcheck.com/roadcams/cams/Redmond%20Highland_pid1893.jpg"},
  {"name":"Redmond_Airport","elev":3077,"dir":"N","lat":44.2538,"lon":-121.1627,"url":"https:\/\/tripcheck.com/roadcams/cams/RedmondAirport_pid649.jpg"},
  {"name":"ODOT_Hampton","elev":4400,"dir":"NW","lat":43.6742,"lon":-120.238,"url":"https:\/\/tripcheck.com/roadcams/cams/US20%20at%20Hampton_pid2565.JPG"},
  {"name":"ODOT_BuckCreek","elev":4204,"dir":"NW","lat":43.5742,"lon":-119.9093,"url":"https:\/\/tripcheck.com/roadcams/cams/US20%20at%20Buck%20Creek_pid4365.jpg"},
  {"name":"ODOT_Alkali_Lake","elev":4344,"dir":"N","lat":42.9686,"lon":-119.9924,"url":"https:\/\/tripcheck.com/roadcams/cams/US395%20at%20Alkali%20Lake_pid2580.jpg"},
  {"name":"ODOT_Warner_Mtn_Summit","elev":5650,"dir":"E","lat":42.238,"lon":-120.295,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE140%20at%20Warner%20Mtn%20Summit_pid2380.jpg"},
  {"name":"ODOT_Valley_Falls","elev":4324,"dir":"N","lat":42.4842,"lon":-120.2823,"url":"https:\/\/tripcheck.com/roadcams/cams/US395%20at%20Valley%20Falls_pid2635.jpg"},
  {"name":"ODOT_Lakeview","elev":4780,"dir":"N","lat":42.1726,"lon":-120.3473,"url":"https:\/\/tripcheck.com/roadcams/cams/Lakeview_pid2412.jpg"},
  {"name":"ODOT_Adel","elev":4344,"dir":"W","lat":42.1772,"lon":-119.8992,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE140%20at%20Adel_pid2584.jpg"},
  {"name":"ODOT_NevadaLineWest","elev":6230,"dir":"W","lat":42.0029,"lon":-119.3383,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE140%20at%20Nevada%20State%20Line%20W_pid2786.jpg"},
  {"name":"ODOT_NevadaLineEast","elev":6230,"dir":"E","lat":42.0033,"lon":-119.3332,"url":"https:\/\/tripcheck.com/roadcams/cams/ORE140%20at%20Nevada%20State%20Line%20E_pid2782.jpg"},
  {"name":"ODOT_Paulina","elev":3682,"dir":"E","lat":44.1314,"lon":-119.9685,"url":"https:\/\/tripcheck.com/roadcams/cams/Paulina_pid1362.jpg"},
  {"name":"ODOT_Paisley","elev":4300,"dir":"W","lat":42.6937,"lon":-120.5458,"url":"https:\/\/tripcheck.com/roadcams/cams/Paisley_pid2415.jpg"},
  //{"name":"#MackayBar_W","elev":2180,"dir":"W","lat":45.3764,"lon":-115.5067,"url":"http:\/\/www.idahoaviationfoundation.org/images/webcam/MackayBar-W.jpg"},
  //{"name":"#MackayBar_N","elev":2180,"dir":"N","lat":45.3781,"lon":-115.5051,"url":"http:\/\/www.idahoaviationfoundation.org/images/webcam/MackayBar-N.jpg"},
  {"name":"DEQ_Grangeville","elev":6123,"dir":"N","lat":45.8633,"lon":-116.1243,"url":"http:\/\/64.126.168.181/axis-cgi/jpg/image.cgi"},
  {"name":"Warren","elev":5908,"dir":"NW","lat":45.2657,"lon":-115.6804,"url":"http:\/\/www.ruralnetwork.net/~warrencm/airport_1.jpg"},
  {"name":"RootRanch_S","elev":5591,"dir":"S","lat":45.3137,"lon":-115.0254,"url":"https:\/\/www.flyingresortranches.com/cam/RootRanch-South.jpg"},
  {"name":"RootRanch_N","elev":5591,"dir":"N","lat":45.3161,"lon":-115.0249,"url":"https:\/\/www.flyingresortranches.com/cam/RootRanch-North.jpg"},
  {"name":"Loon_Creek_N","elev":5801,"dir":"N","lat":44.5526,"lon":-114.851,"url":"http:\/\/www.eye-n-sky.net/webcam/UpperLoon/UpperLoon-North.jpg"},
  {"name":"Loon_Creek_SW","elev":5801,"dir":"SW","lat":44.5437,"lon":-114.8632,"url":"http:\/\/www.eye-n-sky.net/webcam/UpperLoon/UpperLoon-South.jpg"},
  {"name":"Lower_Loon_S","elev":4073,"dir":"S","lat":44.8065,"lon":-114.8087,"url":"https:\/\/www.eye-n-sky.net/webcam/LowerLoon/LowerLoon-South.jpg"},
  {"name":"Lower_Loon_N","elev":4063,"dir":"N","lat":44.8104,"lon":-114.8091,"url":"https:\/\/www.eye-n-sky.net/webcam/LowerLoon/LowerLoon-North.jpg"},
  {"name":"Lower_Loon_W","elev":4023,"dir":"W","lat":44.8081,"lon":-114.8116,"url":"https:\/\/www.eye-n-sky.net/webcam/LowerLoon/LowerLoon-West.jpg"},
  {"name":"Indian_Creek_N","elev":4665,"dir":"N","lat":44.7651,"lon":-115.0996,"url":"http:\/\/www.eye-n-sky.net/webcam/IndianCr/IndianCr-North.jpg"},
  {"name":"Indian_Creek_S","elev":4699,"dir":"S","lat":44.7578,"lon":-115.1139,"url":"http:\/\/www.eye-n-sky.net/webcam/IndianCr/IndianCr-South.jpg"},
  {"name":"Salmon_N","elev":4048,"dir":"N","lat":45.1202,"lon":-113.885,"url":"http:\/\/lemhicountyairport.com/wp-includes/images/cam/airportn.jpg"},
  {"name":"Salmon_W","elev":4048,"dir":"W","lat":45.1164,"lon":-113.89,"url":"http:\/\/lemhicountyairport.com/wp-includes/images/cam/airportw.jpg"},
  {"name":"Salmon_S","elev":4048,"dir":"S","lat":45.113,"lon":-113.8849,"url":"http:\/\/lemhicountyairport.com/wp-includes/images/cam/airports.jpg"},
  {"name":"Stanley","elev":6225,"dir":"SW","lat":44.2207,"lon":-114.936,"url":"http:\/\/www.sawtoothcamera.com/sawcam2/1H1Q_2008.jpg"},
  {"name":"Stanley_Town","elev":6268,"dir":"SW","lat":44.2171,"lon":-114.9317,"url":"http:\/\/www.mountainvillage.com/webcam/MTVwebcam1.jpg"},
  {"name":"Redfish_Lake","elev":6570,"dir":"SW","lat":44.1439,"lon":-114.9199,"url":"http:\/\/www.cam.discoversawtooth.org/camera/camera0.jpg"},
  {"name":"ITD_SmileyCreekArprt_SE","elev":7185,"dir":"SE","lat":43.9079,"lon":-114.7941,"url":"https:\/\/idcam.carsprogram.org/station3019cam3.jpg"},
  {"name":"ITD_SmileyCreekArprt_E","elev":7185,"dir":"E","lat":43.9098,"lon":-114.792,"url":"https:\/\/idcam.carsprogram.org/station3019cam2.jpg"},
  {"name":"ITD_SmileyCreekArprt_NW","elev":7185,"dir":"NW","lat":43.9108,"lon":-114.7957,"url":"https:\/\/idcam.carsprogram.org/station3019cam1.jpg"},
  {"name":"SunValley_CityView","elev":9000,"dir":"NE","lat":43.6813,"lon":-114.3646,"url":"http:\/\/storage.googleapis.com/prism-cam-00038/1080.jpg"},
  {"name":"SunValley_Lodge","elev":5932,"dir":"N","lat":43.6941,"lon":-114.3542,"url":"http:\/\/sunvalley.com.s3.amazonaws.com/images/webcams/svlodge_full.jpg"},
  {"name":"SunValley_WarmSprings","elev":5880,"dir":"S","lat":43.6829,"lon":-114.4021,"url":"http:\/\/sunvalley.com.s3.amazonaws.com/images/webcams/wscam_full.jpg"},
  {"name":"SunValley_Lookout","elev":9000,"dir":"NE","lat":43.6603,"lon":-114.4052,"url":"http:\/\/sunvalley.com.s3.amazonaws.com/images/webcams/locam_full.jpg"},
  {"name":"SunValley_QuarterDollar","elev":5950,"dir":"S","lat":43.6881,"lon":-114.3444,"url":"http:\/\/sunvalley.com.s3.amazonaws.com/images/webcams/qtrdollarview_full.jpg"},
  {"name":"SunValley_DollarView","elev":5950,"dir":"S","lat":43.689,"lon":-114.3489,"url":"http:\/\/sunvalley.com.s3.amazonaws.com/images/webcams/baldyview_full.jpgt"},
  {"name":"SunValley_Snowstake","elev":8948,"dir":"E","lat":43.6612,"lon":-114.4076,"url":"https:\/\/b9.hdrelay.com/camera/9d9a56b7-bf9e-4162-be9c-06c42ca208ff/snapshot"},
  {"name":"SunValley_WhiteClouds","elev":6500,"dir":"SW","lat":43.6895,"lon":-114.3675,"url":"http:\/\/storage.googleapis.com/prism-cam-00052/1080.jpg"},
  {"name":"SunValley_Bowls","elev":8500,"dir":"SW","lat":43.6583,"lon":-114.4072,"url":"http:\/\/sunvalley.com.s3.amazonaws.com/images/webcams/bowls_full.jpg"},
  {"name":"SunValley_Clubhouse","elev":5950,"dir":"SE","lat":43.6931,"lon":-114.3572,"url":"http:\/\/sunvalley.com.s3.amazonaws.com/images/webcams/clubhouse_full.jpg"},
  {"name":"ITD_WoodRiver_W","elev":5556,"dir":"W","lat":43.5952,"lon":-114.3452,"url":"https:\/\/idcam.carsprogram.org/station3272cam2.jpg"},
  {"name":"ITD_WoodRiver_S","elev":5556,"dir":"SE","lat":43.5897,"lon":-114.3418,"url":"https:\/\/idcam.carsprogram.org/station3272cam1.jpg"},
  //{"name":"#Hailey_N","elev":5319,"dir":"N","lat":43.5124,"lon":-114.3024,"url":"http:\/\/iflysun.com/wp-content/uploads/2016/05/North-View.png"},
  //{"name":"#Hailey_S","elev":5319,"dir":"N","lat":43.4996,"lon":-114.2907,"url":"http:\/\/iflysun.com/wp-content/uploads/2016/05/South-View.png"},
  //{"name":"#Rupert","elev":4150,"dir":"W","lat":42.5627,"lon":-113.6306,"url":"http:\/\/www.mvweather.com/images/webcam/weathercam.jpg"},
  {"name":"ITD_Heyburn_N","elev":4205,"dir":"N","lat":42.5684,"lon":-113.7348,"url":"https:\/\/idcam.carsprogram.org/station2999cam1.jpg"},
  {"name":"ITD_Heyburn_E","elev":4205,"dir":"E","lat":42.5683,"lon":-113.7293,"url":"https:\/\/idcam.carsprogram.org/station2999cam2.jpg"},
  {"name":"MtHarrison_NE","elev":9250,"dir":"NE","lat":42.3089,"lon":-113.659,"url":"https:\/\/data-cache.us/firecams/current?id=Axis-MtHarrison"},
  {"name":"ITD_ConnerSmt_NE","elev":5690,"dir":"NE","lat":42.3469,"lon":-113.5164,"url":"https:\/\/idcam.carsprogram.org/station2983cam1.jpg"},
  {"name":"ITD_ConnerSmt_NW","elev":5690,"dir":"NW","lat":42.3471,"lon":-113.5192,"url":"https:\/\/idcam.carsprogram.org/station2983cam2.jpg"},
  {"name":"ITD_Yale_NW","elev":4505,"dir":"NW","lat":42.524,"lon":-113.436,"url":"https:\/\/idcam.carsprogram.org/station3258cam2.jpg"},
  {"name":"ITD_Yale_SE","elev":4505,"dir":"SE","lat":42.5155,"lon":-113.4225,"url":"https:\/\/idcam.carsprogram.org/station3258cam1.jpg"},
  {"name":"ITD_Idahome_NE","elev":4445,"dir":"NE","lat":42.4154,"lon":-113.3194,"url":"https:\/\/idcam.carsprogram.org/station3003cam1.jpg"},
  {"name":"ITD_Idahome_SE","elev":4445,"dir":"SE","lat":42.4125,"lon":-113.3167,"url":"https:\/\/idcam.carsprogram.org/station3003cam2.jpg"},
  {"name":"ITD_SweetzerSmt_W","elev":5274,"dir":"W","lat":42.2067,"lon":-113.0462,"url":"https:\/\/idcam.carsprogram.org/station3255cam2.jpg"},
  {"name":"ITD_SweetzerSmt_SE","elev":5274,"dir":"SE","lat":42.2045,"lon":-113.0389,"url":"https:\/\/idcam.carsprogram.org/station3255cam1.jpg"},
  {"name":"ITD_Juniper_N","elev":5203,"dir":"N","lat":42.155,"lon":-112.9878,"url":"https:\/\/idcam.carsprogram.org/station3004cam1.jpg"},
  {"name":"ITD_Juniper_E","elev":5203,"dir":"E","lat":42.1519,"lon":-112.9855,"url":"https:\/\/idcam.carsprogram.org/station3004cam2.jpg"},
  //{"name":"#Elko","elev":-1,"dir":"SE","lat":40.8327,"lon":-115.7628,"url":"http:\/\/wwc.instacam.com/instacamimg/ELKNV/ELKNV_l.jpg"},
  {"name":"Ryndon_NW","elev":5680,"dir":"NW","lat":41.0488,"lon":-115.5735,"url":"http:\/\/www.nvwx.com/nvwxcam.jpg"},
  {"name":"Ryndon_SW","elev":5680,"dir":"SW","lat":41.0363,"lon":-115.5643,"url":"http:\/\/www.nvwx.com/nvwxcam2.jpg"},
  {"name":"ACHD_I84_Nampa","elev":2480,"dir":"V","lat":43.6006,"lon":-116.5731,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_535.jpg"},
  {"name":"ACHD_I84_11thNampa","elev":2542,"dir":"V","lat":43.598,"lon":-116.537,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_537.jpg"},
  {"name":"ACHD_I84_Garrity","elev":2542,"dir":"V","lat":43.5991,"lon":-116.5138,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_538.jpg"},
  {"name":"ACHD_I84_McDermott","elev":2567,"dir":"V","lat":43.597,"lon":-116.4736,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_540.jpg"},
  {"name":"ACHD_I84_TenMile","elev":2584,"dir":"V","lat":43.5931,"lon":-116.4329,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_542.jpg"},
  {"name":"ACHD_I84_Meridian","elev":2620,"dir":"V","lat":43.5935,"lon":-116.3938,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_544.jpg"},
  {"name":"ACHD_I84_Eagle","elev":2655,"dir":"V","lat":43.5962,"lon":-116.3549,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_546.jpg"},
  {"name":"ACHD_I84_FiveMile","elev":2706,"dir":"V","lat":43.5972,"lon":-116.3139,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_548.jpg"},
  {"name":"ACHD_I84_Cole","elev":2772,"dir":"V","lat":43.5834,"lon":-116.2596,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_551.jpg"},
  {"name":"ACHD_Eagle_Fairview","elev":2625,"dir":"V","lat":43.6195,"lon":-116.3545,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_526.jpg"},
  {"name":"ACHD_Eagle_Chinden","elev":2617,"dir":"V","lat":43.6629,"lon":-116.3543,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_525.jpg"},
  {"name":"ACHD_Eagle_State","elev":2556,"dir":"V","lat":43.6908,"lon":-116.3541,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_573.jpg"},
  {"name":"ACHD_State_Hwy55","elev":2578,"dir":"V","lat":43.6842,"lon":-116.3198,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_576.jpg"},
  {"name":"ACHD_State_EllensFerry","elev":2629,"dir":"V","lat":43.6587,"lon":-116.2637,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_522.jpg"},
  {"name":"ACHD_State_Veterans","elev":2660,"dir":"V","lat":43.64,"lon":-116.2353,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_523.jpg"},
  {"name":"ACHD_Cole_Fairview","elev":2701,"dir":"V","lat":43.6192,"lon":-116.2742,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_508.jpg"},
  {"name":"ACHD_I184_Chinden","elev":2678,"dir":"V","lat":43.6184,"lon":-116.2335,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_565.jpg"},
  {"name":"ACHD_Capitol_Myrtle","elev":2692,"dir":"V","lat":43.6119,"lon":-116.2052,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_507.jpg"},
  {"name":"ACHD_Broadway_Front","elev":2703,"dir":"V","lat":43.6079,"lon":-116.1932,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_502.jpg"},
  {"name":"ACHD_Broadway_Boise","elev":2721,"dir":"V","lat":43.5904,"lon":-116.1936,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_518.jpg"},
  {"name":"ACHD_I84_Gowen","elev":2998,"dir":"V","lat":43.5421,"lon":-116.1611,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_556.jpg"},
  {"name":"ACHD_Pleasant_Valley","elev":2819,"dir":"V","lat":43.5547,"lon":-116.2334,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_670.jpg"},
  {"name":"ACHD_Chinden_Linder","elev":2576,"dir":"V","lat":43.6629,"lon":-116.4137,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_583.jpg"},
  {"name":"ACHD_Chinden_FiveMile","elev":2652,"dir":"V","lat":43.6606,"lon":-116.3175,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_621.jpg"},
  {"name":"ACHD_Meridian_Cherry","elev":2598,"dir":"V","lat":43.6193,"lon":-116.3935,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_578.jpg"},
  {"name":"ACHD_Fairview_FiveMile","elev":2666,"dir":"V","lat":43.6194,"lon":-116.3143,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_581.jpg"},
  {"name":"ACHD_Chinden_Glenwood","elev":2631,"dir":"V","lat":43.649,"lon":-116.2798,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_534.jpg"},
  {"name":"ACHD_Meridian_Columbia","elev":2680,"dir":"V","lat":43.5316,"lon":-116.3939,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_589.jpg"},
  {"name":"ACHD_Kuna_Meridian_DeerFlat","elev":2705,"dir":"V","lat":43.5028,"lon":-116.3939,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_590.jpg"},
  {"name":"ACHD_Kuna_Linder_DeerFlat","elev":2688,"dir":"V","lat":43.5029,"lon":-116.4137,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_591.jpg"},
  {"name":"ACHD_Kuna_Linder_3rd","elev":2707,"dir":"V","lat":43.4903,"lon":-116.4137,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_660.jpg"},
  {"name":"ACHD_Victory_Cole","elev":2750,"dir":"V","lat":43.5757,"lon":-116.2741,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_580.jpg"},
  {"name":"ACHD_Victory_5mile","elev":2729,"dir":"V","lat":43.5757,"lon":-116.3142,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_649.jpg"},
  {"name":"ACHD_Victory_Meridian","elev":2664,"dir":"V","lat":43.5755,"lon":-116.3938,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_587.jpg"},
  {"name":"ACHD_Star_State","elev":2492,"dir":"V","lat":43.6918,"lon":-116.4598,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_618.jpg"},
  {"name":"ACHD_Hwy16_River","elev":2485,"dir":"V","lat":43.6822,"lon":-116.4621,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_617.jpg"},
  {"name":"ACHD_Eagle_River","elev":2561,"dir":"V","lat":43.6825,"lon":-116.3541,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_623.jpg"},
  {"name":"ACHD_Glenwood_River","elev":2561,"dir":"V","lat":43.6592,"lon":-116.2797,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_637.jpg"},
  {"name":"ACHD_ParkCenter_River","elev":2709,"dir":"V","lat":43.5987,"lon":-116.1872,"url":"http:\/\/www.achdidaho.org/ATIS/CCTV/CCTV_651.jpg"}
];

   // clean up previous markers
   for (marker in markers) {
       markers[marker].remove();
   }
   markers = {};

   // get results from url
   try {

           // Update count in html description
           $('#count').html(cams.length);

           // Used for marker change on zoom level
           var zoom = map.getZoom();

           // Iterate through all API results
           cams.forEach(function(marker) {
               // create an img element for the marker
               var el = document.createElement('div');
               el.className = 'marker';

               if (marker.url.includes("exportdb.vaisala.io") || marker.url.includes("nexusapi-us1.dropcam.com")){
                img_url = `${marker.url}&${new Date().getTime()}`;
               }
               else{
                img_url = `${marker.url}?${new Date().getTime()}`;
               }

               //img_url = img_url.replace("http", "https");
               $(el).attr('data-img', img_url);
               $(el).attr('data-text', marker.name);
               $(el).attr('data-link', `${marker.url}?${new Date().getTime()}`);
               $(el).attr('elev', marker.elev+' ft');
               $(el).attr('dir', marker.dir);
               $(el).attr('data-latlon', [Number(marker.lon),Number(marker.lat)]);

               // Map to the map with markers for the current zoomlevel
               checkZoom(el, zoom);

               // add marker to map
               markers[marker.id] = new mapboxgl.Marker(el)
                   .setLngLat([Number(marker.lon),Number(marker.lat)])
                   .addTo(map);
           });

          // $('.loading').hide();

           // markers on click
           $('.marker').click(function(e) {
               e.stopPropagation();
               var latlon = $(this).attr('data-latlon').split(",");
               latlon = [Number(latlon[0]), Number(latlon[1])];
               var img_med = $(this).attr('data-img').replace('square', 'medium');
               var html = document.createElement('div');
               var dataImg = document.createElement('div')
               dataImg.setAttribute('class', 'img-md')
               dataImg.setAttribute('style', 'background-image:url(' + img_med + ')');
               var camData = document.createElement('p');
               var camText = document.createTextNode($(this).attr('data-text'));
               var elev = document.createTextNode(' - '+ $(this).attr('elev'));
               html.appendChild(dataImg);
               html.appendChild(camData);
               camData.appendChild(camText);
               camData.appendChild(elev);
               $('.mapboxgl-popup') ? $('.mapboxgl-popup').remove() : null;
               var popup = new mapboxgl.Popup({maxWidth:'600px'})
                   .setLngLat(latlon)
                   .setHTML(html.outerHTML)
                   .addTo(map);
           });

   } catch (e) {
       window.alert("API not working properly :(")
   }

}

function checkZoom(marker, zoom) {
    var img;
    if (zoom < 5) {
        $(marker).addClass('sm');
        img = 'url(' + $(marker).attr('data-img') + ')';
        $(marker).css("background-image", img);
    } else {
        $(marker).removeClass('sm');
        img = 'url(' + $(marker).attr('data-img') + ')';
        $(marker).css("background-image", img);
    };
}

function CtoF(celcius){
  farhenheit = ((celcius * (9/5)) + 32)
  return farhenheit
}

      function removeCam() {
        $( ".marker" ).remove();
        //$( ".gauge" ).remove();
      }

      function removeStationPlot() {
        $( ".stnplot" ).remove();
        $( "#stnPlotLegend" ).hide();
        //$( ".gauge" ).remove();
      }

      function removemwStationPlot() {
        $( ".stnplot2" ).remove();
      }
      function round5(x) {
        return (x % 5 < 3) ? (x % 5 === 0 ? x : Math.floor(x / 5) * 5) : Math.ceil(x / 5) * 5;
      }


      function createStationPlot(temp, td, spd, dir, pres, gust, rh, c1, c2, c3) {
        var c1_val = "";
        var startAscii = 197; // starting ascii char for font
        var wspdKts = round5(spd); // wind speed kts rounded  to the nearest 5
        var wxChar = startAscii + Math.floor(wspdKts / 5) - 1;
        var windStr = String.fromCharCode(wxChar);
        var top = 0;
        var left = 0;
        var top = -17 + (-7 * Math.cos((dir * (Math.PI / 180))));
        var left = 6 * Math.sin((dir * (Math.PI / 180)));

        var stnPlot = "";
        stnPlot = "<div style='width:40px;height:40px;'>";
        if (!isNaN(temp)) {
          stnPlot += "	<div class='temp'>" + Math.round(temp) + "</div>";
        }
        // if (!isNaN(td)) {
        //   stnPlot += "	<div class='dew'>" + Math.round(td) + "</div>";
        // }
        // if (!isNaN(rh)) {
        //   stnPlot += " 	<div class='rh'>" + Math.round(rh) + "</div>";
        // }
        if (!isNaN(gust) && gust > 5) {
          stnPlot += "	<div class='gust'>" + Math.round(gust) + "</div>";
        }

        // if (!isNaN(pres)) {
        //   stnPlot += "	<div class='slp'>" + pres + "</div>";
        // }

        if (!isNaN(spd) && !isNaN(dir) && wxChar >= startAscii) {
          stnPlot += "	<div class='windbarb-container' style='width:25px;height:25px;'>";
          stnPlot += "		<div class='windbarb' style='top:" + top + "px;left:" + left + "px;transform:rotate(" + dir + "deg);font-weight:bold;'>" + windStr + "</div>";
          stnPlot += "	</div>";
        } else {
          stnPlot += "	<div class='wx-center'>+</div>";
        }
        stnPlot += "</div>";
        return stnPlot;
      }

    function addmwStationPlot(mesoNetwork,dens){
          let s = map.getBounds().getSouth().toFixed(2);
          let n = map.getBounds().getNorth().toFixed(2);
          let w = map.getBounds().getWest().toFixed(2);
          let e = map.getBounds().getEast().toFixed(2);
          var mesowestURL = `https:\/\/api.synopticdata.com/v2/stations/latest?token=${mesoToken}&bbox=${w},${s},${e},${n}&within=100&output=geojson&vars=air_temp,wind_direction,wind_speed,wind_gust,weather_condition,visibility,relative_humidity,dew_point_temperature,sea_level_pressure&units=english,speed|mph&stid=${mesoExclude}&network=${mesoNetwork}&hfmetars=0&show_empty_stations=false&minmax=3&minmaxtype=local&networkimportance=1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210&height=${screenh}&width=${screenw}&spacing=${dens}`;
          fetch(mesowestURL)
            .then(res => res.json())
            .then(data => {

              for (marker in markers) {
                markers[marker].remove();
              }
              markers = {};
              data.features.forEach(e=>{
                if (e.geometry){
                  //createStationPlot(temp, td, spd, dir, pres, gust, rh, c1, c2, c3)
                  let htmlPlot = createStationPlot(e.properties.air_temp,e.properties.dew_point_temperature_d,e.properties.wind_speed,e.properties.wind_direction,e.properties.sea_level_pressure,e.properties.wind_gust,e.properties.relative_humidity,e.properties.ceil)
                  console.log(htmlPlot)

              // create an img element for the marker
              var el = document.createElement('div');
               el.className = 'stnplot2';
               $(el).html(htmlPlot);
               $(el).attr('data-stid', e.properties.stid);
               $(el).attr('data-name', e.properties.name);
               $(el).attr('data-date', e.properties.date_time);
               $(el).attr('data-elev', e.properties.elevation);
               $(el).attr('data-slp', e.properties.sea_level_pressure|| null);
               $(el).attr('data-temp', e.properties.air_temp|| null);
               $(el).attr('data-dew', e.properties.dew_point_temperature_d|| null);
               $(el).attr('data-wspd', e.properties.wind_speed|| null);
               $(el).attr('data-wdir', e.properties.wind_direction|| null);
               $(el).attr('data-wgst', e.properties.wind_gust || null);
               $(el).attr('data-wx', e.properties.weather_condition_d || null);
               $(el).attr('data-latlon', e.geometry.coordinates);

               markers[e.id] = new mapboxgl.Marker(el)
                   .setRotationAlignment('map')
                   .setPitchAlignment('map')
                   .setLngLat(e.geometry.coordinates)
                   .addTo(map);
              }
            })
            $('.stnplot2').click(function(e) {
               e.stopPropagation();
               var latlon = $(this).attr('data-latlon').split(",");
               latlon = [Number(latlon[0]), Number(latlon[1])];
               var mhtml ='';
               var id = $(this).attr('data-stid')
               var site = $(this).attr('data-name')
               var elev = $(this).attr('data-elev')
               if (site){
                 mhtml+= `<div class="popup-header">${site} - ${id} - ${elev} ft</div>`;
               }
               var time = moment($(this).attr('data-date')).format('lll')
               mhtml += `${time}`;
               var temp = $(this).attr('data-temp')
               if (temp){
                 mhtml += `<br>Temperature: ${temp}&deg;F`;
               }
               var dew = $(this).attr('data-dew')
               if (dew){
                mhtml += `<br>Dewpoint: ${dew}&deg;F`;
               }
               var slp = $(this).attr('data-slp')
               if (slp){
                mhtml += `<br>SLP: ${$(this).attr('data-slp')} mb`;
               }
               var wspd =  $(this).attr('data-wspd')
               var wdir =  $(this).attr('data-wdir')
               if (wspd !== 0 && wdir){
                 mhtml += `<br>Wind: ${wdir}&deg; at ${wspd} mph`;
               }
               if (wspd === 0){
                mhtml += `<br>Wind: Calm <br>`;
               }
               var wgst =  $(this).attr('data-wgst')
               if (wgst){
                mhtml += `<br>Wind Gust: ${wgst} mph`;
               }
               var wx =  $(this).attr('data-wx')
               if (wx){
                mhtml += `<br>Weather: ${wx}`;
               }

              mhtml += `<br><a href="https:\/\/www.weather.gov/wrh/timeseries?site=/${id}" target="Popup" onclick="window.open('https:\/\/www.weather.gov/wrh/timeseries?site=${id}','popup','width=900,height=800'); return false;">3-Day History</a></span>`

               $('.mapboxgl-popup') ? $('.mapboxgl-popup').remove() : null;
               var popup = new mapboxgl.Popup({maxWidth:'600px', offset:25})
                   .setLngLat(latlon)
                   .setHTML(mhtml)
                   .addTo(map);
           });
          })
    }

    function addStationPlot(){
      $( "#stnPlotLegend" ).show();
          let s = map.getBounds().getSouth().toFixed(2);
          let n = map.getBounds().getNorth().toFixed(2);
          let w = map.getBounds().getWest().toFixed(2);
          let e = map.getBounds().getEast().toFixed(2);

        // clean up previous markers
        for (marker in markers) {
            markers[marker].remove();
        }
        markers = {};

        // get results from url
        try {
       iNat_results = $.getJSON(`https:\/\/test.8222.workers.dev/?https:\/\/www.aviationweather.gov/cgi-bin/json/MetarJSON.php?density=all&bbox=${w},${s},${e},${n}&taf=1`, function() {

           // Update count in html description
           $('#count').html(iNat_results.responseJSON.features.length);

           // Used for marker change on zoom level
           var zoom = map.getZoom();

           // Iterate through all API results
           iNat_results.responseJSON.features.forEach(function(marker) {
              //if (marker.beg_time){
              //  return
              //}
              //else{
            if (marker.geometry){
               //create url for aviationweather.gov cgi
               var url = ''
               temp = (marker.properties.temp || marker.properties.temp === 0) ? url += `&temp=${Math.round(CtoF(marker.properties.temp))}`:""
               dewp = (marker.properties.dewp || marker.properties.dewp === 0) ? url += `&dewp=${Math.round(CtoF(marker.properties.dewp))}`:""
               altim = (marker.properties.altim) ? url += `&altim=${marker.properties.altim}`:""
               cover = (marker.properties.cover) ? url+= `&cover=${marker.properties.cover}`:""
               ceil = (marker.properties.ceil) ? url+= `&ceil=${marker.properties.ceil}`:""
               wspd = (marker.properties.wspd) ? url+= `&wspd=${marker.properties.wspd}`:""
               wgst = (marker.properties.wgst) ? url+= `&wgst=${marker.properties.wgst}`:""
               wdir = (marker.properties.wdir) ? url+= `&wdir=${marker.properties.wdir}`:""
               visib = (marker.properties.visib) ? url+= `&visib=${marker.properties.visib}`:""
               //wx = (marker.properties.wx) ? url+= `&wx=${marker.properties.wx}`:""
               if (marker.properties.wx){
                var wx = marker.properties.wx.split(' ')
                var wxstr = wx[0].replace( "+", "%2B" );
                url += `&wx=${wxstr}`
               }

               fltcat = (marker.properties.fltcat) ? url+= `&fltcat=${marker.properties.fltcat}`:""
               img_url = `https:\/\/www.aviationweather.gov/cgi-bin/plot/stationicon.php?scale=1.25&id=${marker.properties.id}${url}`

              // create an img element for the marker
              var el = document.createElement('div');
               el.className = 'stnplot';
               $(el).attr('data-img', img_url);
               $(el).attr('data-id', marker.properties.id);
               $(el).attr('data-site', marker.properties.site);
               $(el).attr('data-taf', marker.properties.rawTaf);
               $(el).attr('data-ob', marker.properties.rawOb);
               $(el).attr('data-cat', marker.properties.fltcat || 'NA');
               $(el).attr('data-latlon', marker.geometry.coordinates);

               // Map to the map with markers for the current zoomlevel
               checkZoom(el, zoom);

               // add marker to map
               markers[marker.id] = new mapboxgl.Marker(el)
                   .setRotationAlignment('map')
                   .setPitchAlignment('map')
                   .setLngLat(marker.geometry.coordinates)
                   .addTo(map);
           }}
           )

           map.setLayoutProperty('settlement-label', 'visibility', 'none')

           // markers on click
           $('.stnplot').click(function(e) {
               e.stopPropagation();
               var latlon = $(this).attr('data-latlon').split(",");
               latlon = [Number(latlon[0]), Number(latlon[1])];
               var id = $(this).attr('data-id')
               var site = $(this).attr('data-site')
               var taf = $(this).attr('data-taf')
               var ob = $(this).attr('data-ob')
               var cat =  $(this).attr('data-cat')

              let tafform;
              if (taf == null){
                tafform = 'No TAF'
              }
              else {
                let value1 = taf.replace(/FM/g,"<br>&nbsp;&nbsp;FM");
                let value2 = value1.replace(/BECMG/g,"<br>&nbsp;&nbsp;BECMG");
                tafform = value2.replace(/TEMPO/g,"<br>&nbsp;&nbsp;&nbsp;TEMPO");
              }

               $('.mapboxgl-popup') ? $('.mapboxgl-popup').remove() : null;
               var popup = new mapboxgl.Popup({maxWidth:'600px', offset:25})
                   .setLngLat(latlon)
                   .setHTML(`<div class="popup-header">${site}</div><span style="font-family:Inconsolata;font-size:16px;"><b>${ob}</b><br>Flight Category: <b>${cat}</b><br><b>${tafform}</b><br><a href="https:\/\/www.weather.gov/wrh/timeseries?site=/${id}" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=${id}\',\'popup\',\'width=900,height=800\'); return false;">3-Day History</a></span>`)
                   .addTo(map);
           });
       });
   } catch (e) {
       window.alert("Try again later.")
   }
      }

      function addReservoir(){
        loadingSpinner(true);
        // DEFINE D3 FILL GAGE CUSTOM CONFIG
        var config1 = liquidFillGaugeDefaultSettings();
        config1.circleColor = "#048"; // The color of the outer circle.
        config1.textColor = "#000"; // The color of the value text when the wave does not overlap it.
        config1.waveTextColor = "#0ff"; // The color of the value text when the wave overlaps it.
        config1.waveColor = "#009EFF"; // The color of the fill wave.
        config1.circleThickness = 0.2; // The outer circle thickness as a percentage of it's radius.
        config1.textVertPosition = 0.5; // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        config1.waveAnimateTime = 1000; // The amount of time in milliseconds for a full wave to enter the wave circle.
        //config1.minValue = 0; // The gauge minimum value.
        //config1.maxValue = 100; // The gauge maximum value.
        //config1.circleFillGap = 0.05; // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        config1.waveHeight = 0.10; // The wave height as a percentage of the radius of the wave circle.
        config1.waveCount = 1.5; // The number of full waves per width of the wave circle.
        config1.waveRiseTime = 1000; // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        config1.waveRise = true; // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        config1.waveHeightScaling = true; // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        config1.waveAnimate = true; // Controls if the wave scrolls or is static.
        config1.waveOffset = 0; // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        config1.textSize = 1.25; // The relative height of the text to display in the wave circle. 1 = 50%
        config1.valueCountUp = true; // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        config1.displayPercent = true; // If true, a % symbol is displayed after the value.


          let combined = [];
          let reservoirdata = [];

            var reservoirs = [
              ['Anderson Ranch',43.359,-115.4492,413100,'AND%20AF'],
              ['Arrowrock',43.62,-115.8151,272200,'ARK%20AF'],
              ['Lucky Peak',43.526,-116.0357,264400,'LUC%20AF'],
              ['Lake Lowell',43.55,-116.6838,159365,'LOW%20AF'],
              ['Deadwood',44.307,-115.664,153992,'DED%20AF'],
              ['Cascade',44.5828,-116.0883,646460,'CSC%20AF'],
              ['Mann Creek',44.3962,-116.901,10900,'MAN%20AF'],
              ['Jackson Lake',43.90,-110.682,847000,'JCK%20AF'],
              ['Palisades',43.28,-111.1418,1200000,'PAL%20AF'],
              ['Henrys Lake',44.6439,-111.4038,90000,'HEN%20AF'],
              ['Grassy Lake',44.127,-110.80994,15180,'GRS%20AF'],
              ['Island Park',44.3944,-111.5379,135205,'ISL%20AF'],
              ['Ririe',43.5745226,-111.7365842,80540,'RIR%20AF'],
              ['American Falls',42.8505495,-112.8231517,1672590,'AMF%20AF'],
              ['Walcott',42.6683912,-113.4292575,95180,'MIN%20AF'],
              ['Little Wood',43.4453818,-114.0364815,30000,'WOD%20AF'],
              ['Owyhee Reservoir',43.4613884,-117.3427104,715000,'OWY%20AF'],
              ['Warm Springs',43.6198604,-118.2550514,169639,'WAR%20AF'],
              ['Beulah',43.9291517,-118.1587759,59212,'BEU%20AF'],
              ['Bully Creek',44.0187529,-117.4056343,23676,'BUL%20AF'],
              ['Unity',44.5089325,-118.216411,24970,'UNY%20AF'],
              ['Phillips',44.6804712,-118.063248,73000,'PHL%20AF'],
              ['Thief Valley',45.0277259,-117.8157,13307,'THF%20AF'],
            ];

            function currentdata() {
              return new Promise(resolve => {
                fetch(`https:\/\/api.allorigins.win/get?url=${encodeURIComponent('https:\/\/www.usbr.gov/pn-bin/webarccsv.pl?parameter=AND%20AF,ARK%20AF,LUC%20AF,LOW%20AF,DED%20AF,CSC%20AF,MAN%20AF,JCK%20AF,PAL%20AF,HEN%20AF,GRS%20AF,ISL%20AF,RIR%20AF,AMF%20AF,MIN%20AF,WOD%20AF,OWY%20AF,WAR%20AF,BEU%20AF,BUL%20AF,UNY%20AF,PHL%20AF,THF%20AF&back=2&format=2')}`)
                  .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                  })
                  .then(data => {
                    let output = data.contents;
                    var allLines = output.split("\n");
                    var latest = allLines[23];
                    reservoirdata = latest.split(",").map(Number);
                    reservoirdata.shift();
                    resolve(reservoirdata);
                  })
              });
            }

            function sites(a) {
              return new Promise(resolve => {
                for (let i = 0; i < reservoirs.length; i++) {
                  combined[i] = [reservoirs[i][0],reservoirs[i][1],reservoirs[i][2],reservoirs[i][3],a[i], Number((a[i]/reservoirs[i][3])*100),reservoirs[i][4]];
                  resolve(combined);
                }
            });
            }

            function buildgauges(b) {
              var marker = [];
              return new Promise(resolve => {
                for (let i = 0; i < reservoirs.length; i++) {
                var lat = [Number(b[i][2]),Number(b[i][1])];
                var svg = document.createElement('div');
                var el1 = document.createElementNS('http:\/\/www.w3.org/2000/svg','svg');
                svg.setAttribute('class','resGauge')
                el1.setAttribute('id',`gauge${i}`);
                el1.setAttribute('width', `${(((b[i][3]-10900)/1661690)*40)+65}` ) // normalize size by min-max
                el1.setAttribute('height', `${(((b[i][3]-10900)/1661690)*40)+65}` )
                $(svg).attr('data-name', b[i][0]);
                $(svg).attr('data-link', 'https:\/\/www.usbr.gov/pn/hydromet/wygraph.html?list='+b[i][6]+'&daily='+b[i][6]+'');
                $(svg).attr('curr', b[i][4]+' ac-ft');
                $(svg).attr('storage', b[i][3]+' ac-ft');
                $(svg).attr('percent', Math.round(b[i][5])+' %');
                $(svg).attr('latlon', lat);
                svg.appendChild(el1);
                marker[i] = new mapboxgl.Marker(svg)
                    .setLngLat(lat)
                    .addTo(map);
                var gauge = loadLiquidFillGauge(`gauge${i}`, Math.round(b[i][5]),config1);
                svg.addEventListener('click', function(e){
                  e.stopPropagation();
                  var latlon = $(this).attr('latlon').split(",");
                  latlon = [Number(latlon[0]), Number(latlon[1])];
                  var url = $(this).attr('data-link');
                  var name = $(this).attr('data-name');
                  var curr = $(this).attr('curr');
                  var storage = $(this).attr('storage');
                  var percent = $(this).attr('percent');
                  var height = $(this).height();
                  var popup = new mapboxgl.Popup({maxWidth:'420px',offset:[0,-height/2]})
                      .setLngLat(latlon)
                      .setHTML('<div class="popup-header">'+name+'</div>Current: <b>'+curr+'&nbsp;&nbsp;('+percent+')</b><br>Capacity: <b>'+storage+'</b><br><a href="' + url + '" target="Popup" onclick="window.open(\'' + url + '\',\'popup\',\'width=900,height=800\'); return false;">Water Year Graph</a>')
                      .addTo(map);
                })
                resolve();
              }
              });
            }

            async function reservoir() {
              const a = await currentdata();
              const b = await sites(a);
              const c = await buildgauges(b);
              loadingSpinner(false);
              console.table(b);
            }
            reservoir();
      }

      function removeReservoir() {
        $( ".resGauge" ).remove();
      }

      function addPWDF(year){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'PWDF'+year,
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
            'https:\/\/earthquake.usgs.gov/arcgis/rest/services/ls/pwfdf_'+year+'/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A0%2C2%2C3%2C4%2C9&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
            ],
            'tileSize': 512
          },
          'paint': {}
        },lastSymbolId);
        map.on('render', stopSpinner);
      }

      function removePWDF(year){
        map.removeLayer('PWDF'+year)
        map.removeSource('PWDF'+year)
      }

      var cattimer;
      function addCAT() {
        loadingSpinner(true);
        map.addSource('FltCat', {
          type: 'geojson',
          data: 'https:\/\/test.8222.workers.dev/?https:\/\/www.aviationweather.gov/cgi-bin/json/MetarJSON.php?density=all&bbox=-130,30,-110,50&taf=1'
        });
        map.addLayer({
          'id': 'FltCat',
          'type': 'circle',
          'source': 'FltCat',
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 8,
              7, 14,
              11, 20,
            ],
            'circle-color': [
              'match',
              ['get', 'fltcat'],
              'VFR', 'rgba(0, 255, 0, 1)',
              'MVFR', 'rgba(0, 153, 255, 1)',
              'IFR', 'rgba(255, 0, 0, 1)',
              'LIFR', 'rgba(255, 0, 255, 1)',
              'rgba(0,0,0,0.2)'
            ],
            //'circle-blur': 0.4,
          },
          'filter': ['==', '$type', 'Point'],
        }, 'settlement-label');

        map.addLayer({
          'id': 'FltCat1',
          'type': 'symbol',
          'source': 'FltCat',
          'layout':{
            'text-field': ['string', ['get', 'id']],
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint': {
            'text-color': 'rgba(0,0,0,1)'
          },
          'filter': ['==', '$type', 'Point'],
        });


        map.on('render', stopSpinner);

        cattimer = window.setInterval(function() {
          map.getSource('FltCat').setData('https:\/\/test.8222.workers.dev/?https:\/\/www.aviationweather.gov/cgi-bin/json/MetarJSON.php?density=all&bbox=-130,30,-110,50');
       }, 600000);

        map.on('click', 'FltCat', function(e) {
          let taf = e.features[0].properties.rawTaf;
          let tafform;
          if (taf == null){
            tafform = 'No TAF'
          }
          else {
            let value1 = taf.replace(/FM/g,"<br>&nbsp;&nbsp;FM");
                let value2 = value1.replace(/BECMG/g,"<br>&nbsp;&nbsp;BECMG");
                tafform = value2.replace(/TEMPO/g,"<br>&nbsp;&nbsp;&nbsp;TEMPO");
          }
          new mapboxgl.Popup({maxWidth:'600px'})
            .setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">' + e.features[0].properties.site + '</div><span style="font-family:Inconsolata;font-size:16px;"><b>' + e.features[0].properties.rawOb + '</b><br>Flight Category: <b>' + e.features[0].properties.fltcat+'</b><br><b>'+tafform+'</b><br><a href="https:\/\/www.weather.gov/wrh/timeseries?site=/' + e.features[0].properties.stid + '" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=' + e.features[0]
            .properties.id + '\',\'popup\',\'width=900,height=800\'); return false;">3-Day History</a></span>')
            .addTo(map);

        });

        map.on('mouseenter', 'FltCat', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'FltCat', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function removeCAT() {
        window.clearInterval(cattimer)
        map.removeLayer('FltCat')
        map.removeLayer('FltCat1')
        map.removeSource('FltCat')
      }

      function addHIL(day) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }
        map.addSource('WRHeat', {
          type: 'image',
          'url': 'https:\/\/test.8222.workers.dev/?https:\/\/www.wrh.noaa.gov/wrh/heatrisk/data/HeatRisk_' + day + '_Mercator.png',
          'coordinates': [
            [-126.968, 50.7147],
            [-101.8, 50.7147],
            [-101.8, 29.1322],
            [-126.968, 29.1322]
          ]
        });

        map.addLayer({
          'id': 'WRHeat',
          'type': 'raster',
          'source': 'WRHeat',
          'paint': {}
        }, lastSymbolId);
        map.on('render', stopSpinner);
      }

      function removeHIL() {
        map.removeLayer('WRHeat')
        map.removeSource('WRHeat')
      }

      function addGEOS() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addLayer({
          'id': 'GEOS-dust',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
            'https:\/\/dataserver.nccs.nasa.gov/thredds/wms/bypass/GMAO-V/Aerosols/20190801/H00/20190801_0000.V01.nc4?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&abovemaxcolor=extend&belowmincolor=transparent&numcolorbands=400&logscale=false&layers=DUEXTTAU&colorscalerange=0.02%2C1.9227233&STYLES=boxfill%2Foccam_pastel-30&time=2019-08-01T00%3A00%3A00&CRS=EPSG%3A3857&WIDTH=512&HEIGHT=512&BBOX={bbox-epsg-3857}'
            ],
            'tileSize': 512
          },
          'paint': {}
        });

        map.addLayer({
          'id': 'GEOS-salt',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
            'https:\/\/dataserver.nccs.nasa.gov/thredds/wms/bypass/GMAO-V/Aerosols/20190801/H00/20190801_0000.V01.nc4?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&abovemaxcolor=extend&belowmincolor=transparent&numcolorbands=400&logscale=false&layers=SUEXTTAU&colorscalerange=0.1,1&STYLES=boxfill%2Falg2&time=2019-08-01T00%3A00%3A00&CRS=EPSG%3A3857&WIDTH=512&HEIGHT=512&BBOX={bbox-epsg-3857}'
            ],
            'tileSize': 512
          },
          'paint': {}
        });

        map.addLayer({
          'id': 'GEOS-smoke',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
            'https:\/\/dataserver.nccs.nasa.gov/thredds/wms/bypass/GMAO-V/Aerosols/20190801/H00/20190801_0000.V01.nc4?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&abovemaxcolor=extend&belowmincolor=transparent&numcolorbands=400&logscale=false&layers=BCEXTTAU&colorscalerange=0.01,0.5&STYLES=boxfill%2Fgreyscale&time=2019-08-01T00%3A00%3A00&CRS=EPSG%3A3857&WIDTH=512&HEIGHT=512&BBOX={bbox-epsg-3857}'
            ],
            'tileSize': 512
          },
          'paint': {}
        });


        map.on('render', stopSpinner);
      }

      function removeGEOS() {
        map.removeLayer('GEOS-dust')
        map.removeSource('GEOS-dust')
        map.removeLayer('GEOS-sea')
        map.removeSource('GEOS-sea')
        map.removeLayer('GEOS-smoke')
        map.removeSource('GEOS-smoke')
      }

      function addThermal() {
        loadingSpinner(true);
        var geojson = {
          type: "FeatureCollection",
          features: [],
        };

        d3.csv(`https:\/\/test.8222.workers.dev/?https:\/\/firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Global_48h.csv`)
            .then(function(data){
              data.forEach(d => {
                geojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.longitude),Number(d.latitude)]
                  },
                  "properties": {
                      "date": moment(d.acq_date+' '+d.acq_time+'Z','YYYY/MM/DD hhmmZ'),
                      "age": moment().diff(moment(d.acq_date+' '+d.acq_time+'Z','YYYY/MM/DD hhmmZ'), 'hours'),
                      "frp": Number(d.frp),
                      "daynight": d.daynight,
                      "brighttemp": d.bright_ti4 - 273.15,
                      "confidence": d.confidence,
                      "ins":"S-NPP",
                      }
              })
              })
            })

        d3.csv(`https:\/\/test.8222.workers.dev/?https:\/\/firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_48h.csv`)
            .then(function(data){
              data.forEach(d => {
                geojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.longitude),Number(d.latitude)]
                  },
                  "properties": {
                      "date": moment(d.acq_date+' '+d.acq_time+'Z','YYYY/MM/DD hhmmZ'),
                      "age": moment().diff(moment(d.acq_date+' '+d.acq_time+'Z','YYYY/MM/DD hhmmZ'), 'hours'),
                      "frp": Number(d.frp),
                      "daynight": d.daynight,
                      "brighttemp": d.bright_ti4 - 273.15,
                      "confidence": d.confidence,
                      "ins":"NOAA-20",
                      }
              })
              })
            })
        .then(()=> {
          console.log(geojson)
          map.addSource('NOAA20Hot', {
            type: 'geojson',
            data: geojson,
            //attribution: 'Valid: '+ end,
          })

          map.addLayer({
          'id': 'NOAA20Hot',
          'type': 'circle',
          'source': 'NOAA20Hot',
          'layout': {
            "circle-sort-key": ["get", "frp"],
            //"circle-sort-key": ['-',["get", "age"]],
          },
          'paint': {
            'circle-stroke-width':[
                  "interpolate", ["linear"],
                    ["zoom"],
                    6, 0,
                    8, 1,
                   11, 2,
                   ],
            'circle-stroke-color':{
              property: 'age',
              stops: [
                [1, 'rgba(0,0,0,1.0)'],
                [12, 'rgba(0,0,0,0.5)'],
                [24, 'rgba(0,0,0,0.20)'],
                [36, 'rgba(0,0,0,0.10)'],
              ],
              default: 'rgba(0,0,0,0.05)',
            },
            "circle-radius": [
                  "interpolate", ["linear"],
                    ["zoom"],
                    5, 2,
                    6, 2.5,
                    8, 4,
                   11, 6,
                   13, 12,
                   ],
            'circle-color': {
              property: 'frp',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [1, 'rgba(255,255,0,1.0)'],
                [10, 'rgba(255,226,28,1.0)'],
                [50, 'rgba(255,198,56,1.0)'],
                [100, 'rgba(255,170,85,1.0)'],
                [150, 'rgba(255,141,113,1.0)'],
                [200, 'rgba(255,113,141,1.0)'],
                [250, 'rgba(255,85,170,1.0)'],
                [300, 'rgba(255,56,198,1.0)'],
                [400, 'rgba(255,0,200,1.0)'],
                [500, 'rgba(225,0,100,1.0)'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
            'circle-opacity': {
              property: 'age',
              stops: [
                [1, 0.99],
                [12, 0.8],
                [24, 0.7],
                [36, 0.5],
                [48, 0.2],
              ],
              default: 0.1,
            },
          },
          //'filter': ['has', ''+type+'']
        }, 'settlement-label');

        map.on('render', stopSpinner);
        var popup =  new mapboxgl.Popup()
        map.on('click','NOAA20Hot', function(e) {
          popup.setLngLat(e.lngLat)
        // <br>Brightness Temp: <b>${Math.round(e.features[0].properties.brighttemp)} °C</b>
        .setHTML(`<div class="popup-header-fire">${e.features[0].properties.ins}</div>
        <br>Time: <b>${moment(e.features[0].properties.date).format('lll')}</b>
        <br>Age: <b>${e.features[0].properties.age} hours</b>
        <br>Confidence: <b>${e.features[0].properties.confidence}</b>
        <br>Fire Radiative Power: <b>${e.features[0].properties.frp}</b>
        <br>Day/Night: <b>${e.features[0].properties.daynight}</b>
        `)
        .addTo(map);
        });

        map.on('mouseenter', 'NOAA20Hot', function() {
        map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'NOAA20Hot', function() {
        map.getCanvas().style.cursor = '';
        });
      })
      }

      function removeThermal() {
        map.removeLayer('NOAA20Hot')
        map.removeSource('NOAA20Hot')
      }

      function addThermalV() {
        loadingSpinner(true);
        map.addLayer({
          'id': 'ThermalV',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'VIIRS Thermal Anomalies | Past 24hr',
            'tiles': [
              'https:\/\/firms.modaps.eosdis.nasa.gov/wms/?REQUEST=GetMap&layers=fires_viirs_24&WIDTH=512&HEIGHT=512&BBOX={bbox-epsg-3857}&MAP_KEY=a8cb4ca005ab900b1b44e96d9027b448&SRS=EPSG:3857&colors=255+40+255&size=10,10&symbols=circle'
//              'https:\/\/rmgsc-haws1.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/export?dynamicLayers=%5B%7B"id"%3A4%2C"name"%3A"MODIS%20Fire%20Detection"%2C"source"%3A%7B"type"%3A"mapLayer"%2C"mapLayerId"%3A4%7D%2C"definitionExpression"%3A"load_stat%20%3D%20%27Active%20Burning%27"%2C"minScale"%3A18000000%2C"maxScale"%3A140000%7D%5D&dpi=96&transparent=true&format=png32&layers=show%3A4&bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=512,512&layerDefs=%7B"4"%3A"load_stat%20%3D%20%27Active%20Burning%27"%7D&f=image'
              // 'https:\/\/rmgsc-haws1.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/export?dynamicLayers=%5B%7B"id"%3A4%2C"name"%3A"MODIS%20Fire%20Detection"%2C"source"%3A%7B"type"%3A"mapLayer"%2C"mapLayerId"%3A4%7D%2C"drawingInfo"%3A%7B"renderer"%3A%7B"type"%3A"uniqueValue"%2C"field1"%3A"load_stat"%2C"field2"%3Anull%2C"field3"%3Anull%2C"fieldDelimiter"%3A"%2C"%2C"defaultSymbol"%3Anull%2C"defaultLabel"%3Anull%2C"uniqueValueInfos"%3A%5B%7B"value"%3A"Active%20Burning"%2C"symbol"%3A%7B"color"%3A%5B255%2C0%2C0%2C255%5D%2C"outline"%3A%7B"color"%3A%5B255%2C0%2C0%2C255%5D%2C"width"%3A6%2C"type"%3A"esriSLS"%2C"style"%3A"esriSLSSolid"%7D%2C"type"%3A"esriSFS"%2C"style"%3A"esriSFSSolid"%7D%2C"label"%3A"Active%20Burning"%7D%2C%7B"value"%3A"Last%2012-24%20hrs"%2C"symbol"%3A%7B"color"%3A%5B221%2C0%2C34%2C255%5D%2C"outline"%3A%7B"color"%3A%5B221%2C0%2C34%2C255%5D%2C"width"%3A6%2C"type"%3A"esriSLS"%2C"style"%3A"esriSLSSolid"%7D%2C"type"%3A"esriSFS"%2C"style"%3A"esriSFSSolid"%7D%2C"label"%3A"Last%2012-24%20hrs"%7D%2C%7B"value"%3A"Last%2024-48%20hrs"%2C"symbol"%3A%7B"color"%3A%5B170%2C0%2C17%2C255%5D%2C"outline"%3A%7B"color"%3A%5B170%2C0%2C17%2C255%5D%2C"width"%3A6%2C"type"%3A"esriSLS"%2C"style"%3A"esriSLSSolid"%7D%2C"type"%3A"esriSFS"%2C"style"%3A"esriSFSSolid%22%7D%2C%22label%22%3A%22Last+24-48+hrs%22%7D%5D%7D%7D%7D%5D&dpi=96&transparent=true&format=png32&layers=show%3A4&bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=512,512&f=image'
            ],
            'tileSize': 512
          },
          'paint': {}
        });
        map.on('render', stopSpinner);
      }

      function removeThermalV() {
        map.removeLayer('ThermalV')
        map.removeSource('ThermalV')
      }

      function addAqua(today) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'Aqua',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Date: <b>' + today + '</b>',
            'tiles': [
              'https:\/\/gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?request=GetMap&SERVICE=WMS&time=' + today +
              '&layers=MODIS_Aqua_CorrectedReflectance_TrueColor&crs=EPSG:3857&format=image/jpeg&styles=&width=256&height=256&bbox={bbox-epsg-3857}'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removeAqua() {
        map.removeLayer('Aqua')
        map.removeSource('Aqua')
      }

      function addTRUE() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'TRUE',
          'type': 'raster',
          'source': {
            'type': 'raster',
            //'attribution': 'Date: <b>' + today + '</b>',
            'tiles': [
              'https:\/\/gis.nnvl.noaa.gov/arcgis/rest/services/TRUE/TRUE_current/ImageServer/tile/{z}/{y}/{x}'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removeTRUE() {
        map.removeLayer('TRUE')
        map.removeSource('TRUE')
      }

      function addSSTA() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        var tiledir;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        fetch('https:\/\/gis.nnvl.noaa.gov/arcgis/rest/services/SSTA/SSTA_weekly/ImageServer?f=pjson')
          .then(res => res.json())
          .then(data => {
                map.addLayer({
                    'id': 'SSTA',
                    'type': 'raster',
                    'source': {
                      'type': 'raster',
                      'attribution': 'SST Anomaly Updated: <b>'+ moment(data.timeInfo.timeExtent[1]).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.timeInfo.timeExtent[1]).fromNow() + '</b>',
                      'tiles': [
                        'https:\/\/gis.nnvl.noaa.gov/arcgis/rest/services/SSTA/SSTA_weekly/ImageServer/exportImage?f=image&bbox={bbox-epsg-3857}&imageSR=3857&bboxSR=3857&size=512,512&time='+data.timeInfo.timeExtent[1]+'&format=jpgpng&pixelType=U16&noData=&noDataInterpretation=esriNoDataMatchAll&interpolation=+RSP_BilinearInterpolation'
                      ],
                      'tileSize': 512,

                    },
                    'paint': {}
                  }, firstSymbolId)
                  map.on('render', stopSpinner)
          })
          .catch(error => window.alert("Problem Loading Data."))
      }

      function removeSSTA() {
        map.removeLayer('SSTA')
        map.removeSource('SSTA')
      }

      function addSeaIce() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        var tiledir;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        fetch('https:\/\/gis.nnvl.noaa.gov/arcgis/rest/services/ICEC/ICEC_weekly/ImageServer?f=pjson')
          .then(res => res.json())
          .then(data => {
            map.addLayer({
              'id': 'SIce',
              'type': 'raster',
              'source': {
                'type': 'raster',
                'attribution': 'Sea Ice Concentration Updated: <b>'+ moment(data.timeInfo.timeExtent[1]).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.timeInfo.timeExtent[1]).fromNow() + '</b>',
                'tiles': [
                  'https:\/\/gis.nnvl.noaa.gov/arcgis/rest/services/ICEC/ICEC_weekly/ImageServer/exportImage?f=image&bbox={bbox-epsg-3857}&imageSR=3857&bboxSR=3857&size=512,512&time='+data.timeInfo.timeExtent[1]+'&format=jpgpng'
                ],
                'tileSize': 512,

              },
              'paint': {}
            }, firstSymbolId)
          map.on('render', stopSpinner)
        })
        .catch(error => window.alert("Problem Loading Data."))
      }

      function removeSeaIce() {
        map.removeLayer('SIce')
        map.removeSource('SIce')
      }

 function addNHC() {
        $('#sate_toggle1').click();
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        map.loadImage('https:\/\/upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Maki-circle-15.svg/15px-Maki-circle-15.svg.png',function(error,image){
          if (error) throw error
          map.addImage('circle-15', image,{sdf:true})
        })
        map.loadImage('https:\/\/upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Maki-square-15.svg/15px-Maki-square-15.svg.png',function(error,image){
          if (error) throw error
          map.addImage('square-15', image,{sdf:true})
        })
        map.loadImage('https:\/\/upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Maki1-x-15.svg/240px-Maki1-x-15.svg.png',function(error,image){
          if (error) throw error
          map.addImage('disturbance', image,{sdf:true})
        })
        map.loadImage('https:\/\/test.8222.workers.dev/?http:\/\/www.alaskena.com/hurricane.png',function(error,image){
          if (error) throw error
          map.addImage('hurricane', image,{sdf:true})
        })
        map.loadImage('https:\/\/test.8222.workers.dev/?http:\/\/www.alaskena.com/tropicalstorm.png',function(error,image){
          if (error) throw error
          map.addImage('storm', image,{sdf:true})
        })

        // map.loadImage('https:\/\/test.8222.workers.dev/?http:\/\/www.clker.com/cliparts/H/K/g/k/D/T/stripes-diagonal-md.png',function(error,image){
        //   if (error) throw error
        //   map.addImage('hatch', image,{sdf:true})
        // })

        map.addSource('NHC-ForecastTrack', {
          type: 'geojson',
          data:'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_tropical_weather_summary/MapServer/6/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=3&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
        });

        map.addSource('NHC-ForecastEnv', {
          type: 'geojson',
          data:'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_tropical_weather_summary/MapServer/8/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=3&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
        });
        map.addSource('NHC-ForecastLine', {
          type: 'geojson',
          data:'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_tropical_weather_summary/MapServer/7/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=3&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
        });

        map.addSource('NHC-TrackHistory', {
          type: 'geojson',
          data:'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_tropical_weather_summary/MapServer/11/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=3&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
        });

        map.addSource('NHC-TrackLine', {
          type: 'geojson',
          data:'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_tropical_weather_summary/MapServer/12/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=3&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
        });

        map.addSource('NHC-FcstDisturb', {
          type: 'geojson',
          data:'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_tropical_weather_summary/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=3&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
        });

        map.addSource('NHC-FcstDisturbPt', {
          type: 'geojson',
          data:'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_tropical_weather_summary/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=3&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
        });


        map.addLayer({
          'id': 'NHC-ForecastEnv',
          'type': 'fill',  //line or fill
          'source':'NHC-ForecastEnv',
          'paint':{
            'fill-color': '#40f',
            'fill-opacity': 0.2,
          },
        }, 'settlement-label');

        map.addLayer({
          'id': 'NHC-ForecastEnv1',
          'type': 'line',  //line or fill
          'source':'NHC-ForecastEnv',
          'paint':{
            'line-color': '#40f',
            'line-width':[
              "interpolate", ["linear"],
              ["zoom"],
              4, 2,
              7, 3,
              11, 4,
            ],
          },
        }, 'settlement-label');

        map.addLayer({
          'id': 'NHC-FcstDisturb',
          'type': 'fill',  //line or fill
          'source':'NHC-FcstDisturb',
          'paint':{
            'fill-color':
            [
              'match',
              ['get', 'prob5day'],
              '10%', '#ff0',
              '20%', '#ff0',
              '30%', '#ff0',
              '40%', '#f90',
              '50%', '#f90',
              '60%', '#f90',
              '70%', '#f00',
              '80%', '#f00',
              '90%', '#f00',
              '100%', '#f00',
              '#ff0'
            ],
            //'fill-pattern':'hatch',
            'fill-opacity': 0.3,
          },
        }, 'settlement-label');

        map.addLayer({
          'id': 'NHC-FcstDisturb1',
          'type': 'line',  //line or fill
          'source':'NHC-FcstDisturb',
          'paint':{
            'line-color':
             [
              'match',
              ['get', 'prob5day'],
              '10%', '#ff0',
              '20%', '#ff0',
              '30%', '#ff0',
              '40%', '#f90',
              '50%', '#f90',
              '60%', '#f90',
              '70%', '#f00',
              '80%', '#f00',
              '90%', '#f00',
              '100%', '#f00',
              '#ff0'
            ],
            'line-width':[
              "interpolate", ["linear"],
              ["zoom"],
              4, 2,
              7, 3,
              11, 4,
            ],
          },
        }, 'settlement-label');

        map.addLayer({
          'id': 'NHC-FcstDisturbPt',
          'type': 'symbol',
          'source': 'NHC-FcstDisturbPt',
          'layout': {
            'icon-image': 'disturbance',
            'icon-size': 0.15,
            // [
            //   'match',
            //   ['get', 'stormtype'],
            //   'TS', 0.2,
            //   'HU', 0.2,
            //   'TD', 1,
            //   'STD',1,
            //   1
            // ],
            'icon-allow-overlap': true,
          },
          'paint': {
            'icon-color':
              [
              'match',
              ['get', 'prob5day'],
              '10%', '#ff0',
              '20%', '#ff0',
              '30%', '#ff0',
              '40%', '#f90',
              '50%', '#f90',
              '60%', '#f90',
              '70%', '#f00',
              '80%', '#f00',
              '90%', '#f00',
              '100%', '#f00',
              '#ff0'
            ],
            //'icon-halo-width':1,
            //'icon-halo-blur':0.5,
            //'icon-halo-color':'rgba(0, 0, 0, 1)',
          },
          //'filter': [],
        });

        map.addLayer({
          'id': 'NHC-ForecastLine',
          'type': 'line',  //line or fill
          'source':'NHC-ForecastLine',
          'paint':{
            'line-color': '#50f',
            'line-width':[
              "interpolate", ["linear"],
              ["zoom"],
              4, 1,
              7, 2,
              11, 3,
            ],
          },
        }, 'settlement-label');

        map.addLayer({
          'id': 'NHC-TrackLine',
          'type': 'line',  //line or fill
          'source':'NHC-TrackLine',
          'paint':{
            'line-color': '#444',
            'line-width':[
              "interpolate", ["linear"],
              ["zoom"],
              4, 1,
              7, 2,
              11, 3,
            ],
          },
        }, 'settlement-label');

        map.addLayer({
          'id': 'NHC-Current',
          'type': 'symbol',
          'source': 'NHC-ForecastTrack',
          'layout': {
            'icon-image': [
              'match',
              ['get', 'stormtype'],
              'TS', 'storm',
              'HU', 'hurr',
              'TD', 'circle-15',
              'STD','square-15',
              'hurr'
            ],
            'icon-size':
            [
              'match',
              ['get', 'stormtype'],
              'TS', 1.1,
              'HU', 0.35,
              'MH', 0.4,
              'TD', 1.6,
              'STD',1.6,
              0.4
            ],
            'icon-allow-overlap': true,
            'text-field': ['string', ['get', 'stormname']],
            'text-font': [
              "Open Sans Condensed Bold",
            ],
            'text-size': 20,
            // [
            //   "interpolate", ["linear"],
            //   ["zoom"],
            //   4, 0,
            //   4.95, 0,
            //   5, 12,
            //   7, 16,
            //   11, 18,
            // ],
            //'text-offset': [2, 2],
            'text-variable-anchor': ['top', 'bottom', 'left'], //'right'
            'text-radial-offset': 1,
            'text-allow-overlap': true,
          },
          'paint': {
            'icon-color':{
              property: 'maxwind',
              stops: [
                [25, '#63f'],
                [35, '#09F'],
                [39, '#0f6'],
                [74, '#fc0'],
                [96, '#f60'],
                [111, '#f00'],
                [131, '#f0f'],
                [156, '#f7f'],
              ],
              default: '#000',
            },
            //'icon-halo-width':1.5,
            //'icon-halo-blur':1,
            //'icon-halo-color':'#fff',
            //'text-halo-color':'#f0f',
            'text-halo-color': {
              property: 'maxwind',
              stops: [
                [25, '#63f'],
                [35, '#0072bf'],
                [39, '#00bf4c'],
                [74, '#bf9900'],
                [96, '#bf4c00'],
                [111, '#bf0000'],
                [131, '#bf00bf'],
                [157, '#ff19ff'],
              ],
              default: '#000',
            },
            'text-halo-width': 1.5,
            'text-halo-blur': 0.5,
            'text-color': 'rgba(255,255,255,1.0)'
          },
          'filter': ['==', 'tau', 0],
        });

        map.addLayer({
          'id': 'NHC-ForecastTrack',
          'type': 'circle',
          'source': 'NHC-ForecastTrack',
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 9,
              7, 15,
              11, 22,
            ],
            'circle-color':{
              property: 'maxwind',
              stops: [
                [25, '#63f'],
                [35, '#09F'],
                [39, '#0f6'],
                [74, '#fc0'],
                [96, '#f60'],
                [111, '#f00'],
                [131, '#f0f'],
                [156, '#f7f'],
              ],
              default: '#000',
            },
            'circle-stroke-width':1.0,
            //'circle-stroke-blur':0.5,
            'circle-stroke-color':'rgba(0, 0, 0, 1)',
            //'circle-blur': 0.4,
          },
          'filter': ['>', 'tau', 0],
        }, 'settlement-label');

        map.addLayer({
          'id': 'NHC-TrackHistory',
          'type': 'circle',
          'source': 'NHC-TrackHistory',
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 6,
              7, 12,
              11, 18,
            ],
            'circle-color':{
              property: 'intensity',
              stops: [
                [25, '#63f'],
                [35, '#09F'],
                [39, '#0f6'],
                [74, '#fc0'],
                [96, '#f60'],
                [111, '#f00'],
                [131, '#f0f'],
                [156, '#f7f'],
              ],
              default: '#000',
            },
            'circle-stroke-width':0.5,
            //'circle-stroke-blur':0.5,
            'circle-stroke-color':'rgba(0, 0, 0, 1)',
            //'circle-blur': 0.4,
          },
          //'filter': ['==', '$type', 'Point'],
        }, 'settlement-label');

        map.on('render', stopSpinner);
      }

      function removeNHC() {
        $('#sate_toggle1').click();
      var layers = map.getStyle().layers;
      let sources = map.getStyle().sources;
      console.log(layers,sources)
      layers.map((layer)=>{
        if (layer.id.includes('NHC')){
          console.log(layer.id)
          map.removeLayer(layer.id);
        }
      });

      for (source in sources){
        if (source.includes('NHC')){
          console.log(source)
          map.removeSource(source);
        }
      }

      }

      function removeLatestCBX(opts){
        if (opts == '5'){
          lay = 'kcbx_bref_raw'
        }
        if (opts == '9'){
          lay = 'kcbx_bvel_raw'
        }
        map.removeLayer(lay)
        map.removeSource(lay)
      }

      function addLatestCBX(opts){
        if (opts == '5'){
          lay = 'kcbx_bref_raw'
        }
        if (opts == '9'){
          lay = 'kcbx_bvel_raw'
        }
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        fetch('https:\/\/opengeo.ncep.noaa.gov/geoserver/kcbx/ows?service=wms&version=1.3.0&request=GetCapabilities')
          .then(res => res.text())
          .then(str => {
              var x2js = new X2JS(),times,
              infoObj = x2js.xml_str2json(str)
              console.log(infoObj)
              try{
              var timestr = infoObj.WMS_Capabilities.Capability.Layer.Layer[opts].Dimension.__text.split(',')
              timestr = timestr.pop()
              console.log(timestr)
                    map.addLayer({
                      'id': lay,
                      'type': 'raster',
                      'source': {
                        'type': 'raster',
                        'attribution': 'KCBX. Valid: <b>' + moment(timestr,'YYYY-MM-DDThh:mm:ss.SSSZ').format('MMMM Do YYYY, h:mm a'),
                        'tiles': [
                          `https:\/\/opengeo.ncep.noaa.gov/geoserver/kcbx/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&LAYERS=${lay}&TIME=${timestr}&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}`
                        ],
                        'tileSize': 256,
                      },
                      'paint': {
                        "raster-opacity": 1,
                      }
                    }, firstSymbolId);
                    map.on('render', stopSpinner);
              }catch(error){
                $('.brcbx_toggle input.cmn-toggle').not(this).prop('checked', false);
                //$('#brloop2').hide()
                console.error(error)
                window.alert("NWS Server Down, try again later.")
                loadingSpinner(false);
               }
            })

      }

      var loop;
      function addBRLoop() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var slider;
        $("#slider").slider({

              value:50,
              min: 50,
              max: 400,
              step: 50,
              slide: function( event, ui ) {
                  slider = $("#slider").slider("value");
                  console.log(slider);
                  clearInterval(loop);
                  loop = setInterval(function(slider) {
                    map.setPaintProperty('BR'+(currentImage), 'raster-opacity', 0)
                    currentImage = (currentImage + 1) % timestamps.length;
                    map.setPaintProperty('BR'+(currentImage), 'raster-opacity', 1)
                  }, slider);
              }
            });
        var currentImage = 0;
        var timestamps = ['900913-m50m','900913-m45m','900913-m40m','900913-m35m','900913-m30m','900913-m25m','900913-m20m','900913-m15m','900913-m10m','900913-m05m','900913'];
        for(var j = 0; j< timestamps.length;j++){
          map.addLayer({
            'id': 'BR'+j,
            'type': 'raster',
            'source': {
              'type': 'raster',
              //'attribution': ''+prodtime.meta.site+'. Valid: <b>' + moment(prodtime.meta.valid).format('MMMM Do YYYY, h:mm a')+' | ' + moment(prodtime.meta.valid).fromNow() + '</b>',
              'tiles': [
                'https:\/\/mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-'+timestamps[j]+'/{z}/{x}/{y}.png'
              ],
              'tileSize': 512
            },
            'paint': {
              "raster-opacity": 0,
              'raster-opacity-transition': {
                duration: 0
              },
              "raster-fade-duration": 0.0,
            }
          }, firstSymbolId);
        }
        loop = setInterval(function() {
          map.setPaintProperty('BR'+(currentImage), 'raster-opacity', 0)
          currentImage = (currentImage + 1) % timestamps.length;
          map.setPaintProperty('BR'+(currentImage), 'raster-opacity', 1)
        }, 50);

        map.on('render', stopSpinner);
      };


      function removeBRLoop() {
        var timestamps = ['900913-m50m','900913-m45m','900913-m40m','900913-m35m','900913-m30m','900913-m25m','900913-m20m','900913-m15m','900913-m10m','900913-m05m','900913'];
        for(var j = 0; j< timestamps.length;j++){
        map.removeLayer('BR'+j)
        map.removeSource('BR'+j)
        clearInterval(loop);
      }
      }

      function addBR(opt){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'hillshade') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currentImage = 0;
        var i=0;
        loopname = "Radar Base Reflectivity"
        hrtimestamps=[];
        fetch('https:\/\/tilecache.rainviewer.com/api/maps.json')
          .then(res => res.json())
          .then(data => hrtimestamps = data)
          .then(() => addBRF(opt))


          function addBRF(opt){
          var time = hrtimestamps;
          hrtimestamps = hrtimestamps.map(i => moment(i*1000).format('lll'))
          for(var j = 0; j<hrtimestamps.length;j++){
          console.log(hrtimestamps[j]);
          map.addLayer({
            'id': hrtimestamps[j],
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                'https:\/\/tilecache.rainviewer.com/v2/radar/' + time[j] + '/256/{z}/{x}/{y}/5/'+opt+'_0.png'
              ],
              'tileSize': 256,
            },
            'paint': {
              "raster-opacity": 0,
              'raster-opacity-transition': {
                duration: 0.0
              },
              "raster-fade-duration": 0.0,
            }
          }, firstSymbolId);
        }
        map.on('render', stopSpinner);
          showFrame(-1);
      }
      }

      function addHires(){
        loadingSpinner(true);
        var currentImage = 0;
        hrtimestamps=['latest'];
        for (var i = 1; i<24;i++){
          hrtimestamps.push('+'+i+'hour')
        }
        for(var j = 0; j<hrtimestamps.length;j++){
          console.log(hrtimestamps[j]);
          map.addSource(hrtimestamps[j], {
              type: 'image',   // fwind-gusts-nam, fradar-nam, fradar-hrrr, ftemperatures
              //wgE96YE3scTQLKjnqiMsv_tlyy22v5uBRBcm8lWeP0Y6ZISPLDVKGWXTJH9kYb  // OcY2Lrnvyk26SIjfqUluj_pz9Tq0uvH1iGKSwn7Q0Ae6yEflSDkdBQyrDJSkFn
              url: 'https:\/\/maps.aerisapi.com/wgE96YE3scTQLKjnqiMsv_tlyy22v5uBRBcm8lWeP0Y6ZISPLDVKGWXTJH9kYb/fradar-nam/2000x2000/36.42,-134.84,50.28,-100.75/' + hrtimestamps[j] + '.png',
              //animate: true,
              coordinates: [
                [-134.84,50.28],
                [-100.75,50.28],
                [-100.75,36.42],
                [-134.84,36.42]
              ]
           })
             map.addLayer({
               'id': hrtimestamps[j],
               'type': 'raster',
               'source': hrtimestamps[j],
               'paint': {
              "raster-opacity": 0,
              'raster-opacity-transition': {
                duration: 0.0
              },
              "raster-fade-duration": 0.0,
            }
             }, 'Terrain')

          // map.addLayer({
          //   'id': hrtimestamps[j],
          //   'type': 'raster',
          //   'source': {
          //     'type': 'raster',
          //     'tiles': [  // fwind-gusts-nam, fradar-nam, fradar-hrrr, ftemperatures
          //     //'https:\/\/maps.aerisapi.com/OcY2Lrnvyk26SIjfqUluj_pz9Tq0uvH1iGKSwn7Q0Ae6yEflSDkdBQyrDJSkFn/fradar-nam/{z}/{x}/{y}/' + hrtimestamps[j] + '.png'
          //       'https:\/\/maps.aerisapi.com/wgE96YE3scTQLKjnqiMsv_tlyy22v5uBRBcm8lWeP0Y6ZISPLDVKGWXTJH9kYb/fradar-nam/{z}/{x}/{y}/' + hrtimestamps[j] + '.png'
          //     ],
          //     'tileSize': 512,
          //   },
          //   'paint': {
          //     "raster-opacity": 0,
          //     'raster-opacity-transition': {
          //       duration: 0.0
          //     },
          //     "raster-fade-duration": 0.0,
          //   }
          // }, 'Terrain')
        }

        map.on('render', stopSpinner);
          showFrame(-1);
      }

      function removeBR(opt) {
        map.removeLayer('BR'+opt)
        map.removeSource('BR'+opt)
      }
      function removeWSSI() {
        map.removeLayer('WSSI')
        map.removeSource('WSSI')
      }

      function addWSSI(param){

        let wssiProds = {
          'Overall-1-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_wssi_overall_fp.png',
          'Overall-1':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_wssi_overall_d1.png',
          'Overall-2':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_wssi_overall_d2.png',
          'Overall-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_wssi_overall_d3.png',
          'Snow-1-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_snow_fp.png',
          'Snow-1':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_snow_d1.png',
          'Snow-2':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_snow_d2.png',
          'Snow-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_snow_d3.png',
          'SNLoad-1-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_sn_ld_win_fp.png',
          'SNLoad-1':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_sn_ld_win_d1.png',
          'SNLoad-2':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_sn_ld_win_d2.png',
          'SNLoad-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_sn_ld_win_d3.png',
          'Ice-1-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_ice_fp.png',
          'Ice-1':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_ice_d1.png',
          'Ice-2':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_ice_d2.png',
          'Ice-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_ice_d3.png',
          'Freeze-1-1.5':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_ff_fp.png',
          'Freeze-1':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_ff_d1.png',
          'BLSN-1-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_bl_sn_fp.png',
          'BLSN-1':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_bl_sn_d1.png',
          'BLSN-2':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_bl_sn_d2.png',
          'BLSN-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_bl_sn_d3.png',
          'BLIZZARD-1-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_gb_fp.png',
          'BLIZZARD-1':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_gb_d1.png',
          'BLIZZARD-2':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_gb_d2.png',
          'BLIZZARD-3':'https:\/\/origin.wpc.ncep.noaa.gov/wwd/wssi/images/web_CONUS_gb_d3.png',
        }
        map.addSource('WSSI', {
              type: 'image',
              url: `https:\/\/test.8222.workers.dev/?${wssiProds[param]}`,
              //animate: true,
              coordinates: [
                [-125.811668332,57.560767331],
                [-64.964629385,57.560767331],
                [-64.964629385,24.714103649],
                [-125.811668332,24.714103649]
              ]
           })
             map.addLayer({
               'id': 'WSSI',
               'type': 'raster',
               'source':'WSSI',
               'paint': {
              "raster-opacity": 1,
              // 'raster-opacity-transition': {
              //   duration: 0.0
              // },
              //"raster-fade-duration": 0.0,
            }
             }, 'Terrain')
      }

      function addCR() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        fetch('https:\/\/opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_raw/ows?service=wms&version=1.3.0&request=GetCapabilities')
          .then(res => res.text())
          .then(str => {
              var x2js = new X2JS(),times,
              infoObj = x2js.xml_str2json(str)
              console.log(infoObj)
              try{
              var timestr = infoObj.WMS_Capabilities.Capability.Layer.Layer.Dimension.__text.split(',')
              timestr = timestr.pop()
              console.log(timestr)
                    map.addLayer({
                      'id': "CR",
                      'type': 'raster',
                      'source': {
                        'type': 'raster',
                        'attribution': 'KCBX. Valid: <b>' + moment(timestr,'YYYY-MM-DDThh:mm:ss.SSSZ').format('MMMM Do YYYY, h:mm a'),
                        'tiles': [
                          `https:\/\/opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_raw/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&LAYERS=conus_cref_raw&TIME=${timestr}&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}`
                        ],
                        'tileSize': 256,
                      },
                      'paint': {
                        "raster-opacity": 1,
                      }
                    }, firstSymbolId);
                    map.on('render', stopSpinner);
              }catch(error){
                $('.cr_toggle input.cmn-toggle').not(this).prop('checked', false);
                //$('#brloop2').hide()
                console.error(error)
                window.alert("NWS Server Down, try again later.")
                loadingSpinner(false);
               }
            })

      }

      function removeCR() {
        map.removeLayer('CR')
        map.removeSource('CR')
      }

      function addarchiveCR(valid) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);

        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'arcCR',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Valid: <b>' + moment(valid).format('MMMM Do YYYY, h:00 a')+'</b>',
            'tiles': [
              'https:\/\/mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?LAYERS=nexrad-n0r-wmst&TRANSPARENT=TRUE&FORMAT=image/png&TIME='+moment.utc(valid).format('YYYY-MM-DDTHH:00')+':00Z&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removearchiveCR() {
        map.removeLayer('arcCR')
        map.removeSource('arcCR')
      }

      function addarchiveSat(valid) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);

        var ROUNDING = 10 * 60 * 1000; /*ms*/
        var now1 = moment(valid);
        now1 = moment(Math.floor((+now1) / ROUNDING) * ROUNDING).valueOf();

        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'arcVis',
          'type': 'raster',
          'scheme':'tms',
          'source': {
            'type': 'raster',
            'attribution': 'Valid: <b>' + moment(now1).format('MMMM Do YYYY, h:mm a')+'</b>',
            'tiles': [
            'https:\/\/gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&FORMAT=image/png&TIME='+moment.utc(now1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)+'Z&LAYERS=GOES-West_ABI_GeoColor&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512'
            //  'https:\/\/gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&FORMAT=image/png&TIME='+moment.utc(valid).format('YYYY-MM-DDTHH:00')+':00Z&LAYERS=GOES-West_ABI_Band2_Red_Visible_1km&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256'
            //  'https:\/\/gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?TIME=2019-10-11T00:00:00Z&layer=GOES-West_ABI_Band2_Red_Visible_1km&style=default&tilematrixset=GoogleMapsCompatible_Level7&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}'
              //'https:\/\/gibs-b.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?TIME='+moment.utc(valid).format('YYYY-MM-DDTHH:mm')+':00Z&layer=GOES-West_ABI_Band2_Red_Visible_1km&style=default&tilematrixset=GoogleMapsCompatible_Level7&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}'
            ],
            'tileSize': 512,
            'maxZoom': 8
          },
          'paint': {}
        }, firstSymbolId);
        map.addLayer({
          'id': 'arcIR',
          'type': 'raster',
          'scheme':'tms',
          'source': {
            'type': 'raster',
            'attribution': 'Valid: <b>' + moment(now1).format('MMMM Do YYYY, h:mm a')+'</b>',
            'tiles': [
              'https:\/\/gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&FORMAT=image/png&TIME='+moment.utc(now1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)+'Z&LAYERS=GOES-West_ABI_Band13_Clean_Infrared&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256'
            ],
            'tileSize': 256,
            'maxZoom': 8
          },
          'paint': {}
        }, firstSymbolId);
        map.setLayoutProperty('arcIR', 'visibility', 'none')
        map.on('render', stopSpinner);
      }

      function removearchiveSat() {
        map.removeLayer('arcVis')
        map.removeSource('arcVis')
        map.removeLayer('arcIR')
        map.removeSource('arcIR')
      }

      function addRIDGE2(layNum){
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currentImage = 0;
        hrtimestamps=[];

        fetch('https:\/\/opengeo.ncep.noaa.gov/geoserver/conus/ows?service=wms&version=1.3.0&request=GetCapabilities')
          .then(res => res.text())
          .then(str => {
              var x2js = new X2JS(),times,
              infoObj = x2js.xml_str2json(str)
              console.log(infoObj)
              try{
              var timestr = infoObj.WMS_Capabilities.Capability.Layer.Layer[layNum].Dimension.__text.split(',').reverse()
              console.log(timestr)
              timestr = timestr.filter((element, index) => {
                return index % 3 === 0;
              })
              timestr.reverse()
              if (timestr.length > 15){
                timestr = timestr.slice(-15)
              }
              console.log(timestr)
              hrtimestamps = timestr.map(i=>moment(i).format('lll'))
              for(var j = 0; j<hrtimestamps.length;j++){
                    console.log(hrtimestamps[j]);
                    map.addLayer({
                      'id': hrtimestamps[j],
                      'type': 'raster',
                      'source': {
                        'type': 'raster',
                        'tiles': [
                          `https:\/\/opengeo.ncep.noaa.gov/geoserver/conus/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&LAYERS=${infoObj.WMS_Capabilities.Capability.Layer.Layer[layNum].Name}&TIME=${timestr[j]}&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}`
                        ],
                        'tileSize': 256,
                      },
                      'paint': {
                        "raster-opacity": 0,
                        'raster-opacity-transition': {
                          duration: 0.0
                        },
                        "raster-fade-duration": 0.0,
                      }
                    }, firstSymbolId);
                  }
              map.on('render', stopSpinner);
                showFrame(-1);

              }catch(error){
                $('.brcb_toggle input.cmn-toggle').not(this).prop('checked', false);
                //$('#brloop2').hide()
                console.error(error)
                window.alert("NWS Server Down, try again later.")
                loadingSpinner(false);
               }
            })
          }


      function addBRCB() {
        window.alert("Resize window if you are making an animated GIF for twitter, otherwise filesize will be too big for 15mb limit.")
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currentImage = 0;
        hrtimestamps=[];

        fetch('https:\/\/opengeo.ncep.noaa.gov/geoserver/kcbx/ows?service=wms&version=1.3.0&request=GetCapabilities')
          .then(res => res.text())
          .then(str => {
              var x2js = new X2JS(),times,
              infoObj = x2js.xml_str2json(str)
              console.log(infoObj)
              try{
              var timestr = infoObj.WMS_Capabilities.Capability.Layer.Layer[5].Dimension.__text.split(',')
              if (timestr.length > 15){
                timestr = timestr.slice(-15)
              }
              console.log(timestr)
              hrtimestamps = timestr.map(i=>moment(i).format('lll'))
              for(var j = 0; j<hrtimestamps.length;j++){
                    console.log(hrtimestamps[j]);
                    map.addLayer({
                      'id': hrtimestamps[j],
                      'type': 'raster',
                      'source': {
                        'type': 'raster',
                        'tiles': [
                          `https:\/\/opengeo.ncep.noaa.gov/geoserver/kcbx/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&LAYERS=kcbx_bref_raw&TIME=${timestr[j]}&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}`
                        ],
                        'tileSize': 256,
                      },
                      'paint': {
                        "raster-opacity": 0,
                        'raster-opacity-transition': {
                          duration: 0.0
                        },
                        "raster-fade-duration": 0.0,
                      }
                    }, firstSymbolId);
                  }
              map.on('render', stopSpinner);
                showFrame(-1);

              }catch(error){
                $('.brcb_toggle input.cmn-toggle').not(this).prop('checked', false);
                //$('#brloop2').hide()
                console.error(error)
                window.alert("NWS Server Down, try again later.")
                loadingSpinner(false);
               }
            })
          }

      function addBRCBV() {
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currentImage = 0;
        hrtimestamps=[];

        fetch('https:\/\/opengeo.ncep.noaa.gov/geoserver/kcbx/ows?service=wms&version=1.3.0&request=GetCapabilities')
          .then(res => res.text())
          .then(str => {
              var x2js = new X2JS(),times,
              infoObj = x2js.xml_str2json(str)
              console.log(infoObj)
              try{
              var timestr = infoObj.WMS_Capabilities.Capability.Layer.Layer[9].Dimension.__text.split(',')
              if (timestr.length > 15){
                timestr = timestr.slice(-15)
              }
              console.log(timestr)
              hrtimestamps = timestr.map(i=>moment(i).format('lll'))
              for(var j = 0; j<hrtimestamps.length;j++){
                    console.log(hrtimestamps[j]);
                    map.addLayer({
                      'id': hrtimestamps[j],
                      'type': 'raster',
                      'source': {
                        'type': 'raster',
                        'tiles': [
                          `https:\/\/opengeo.ncep.noaa.gov/geoserver/kcbx/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&LAYERS=kcbx_bvel_raw&TIME=${timestr[j]}&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}`
                        ],
                        'tileSize': 256,
                      },
                      'paint': {
                        "raster-opacity": 0,
                        'raster-opacity-transition': {
                          duration: 0.0
                        },
                        "raster-fade-duration": 0.0,
                      }
                    }, firstSymbolId);
                  }
              map.on('render', stopSpinner);
                showFrame(-1);

              }catch(error){
                $('.brcb_toggle input.cmn-toggle').not(this).prop('checked', false);
                console.error(error)
                window.alert("NWS Server Down, try again later.")
                loadingSpinner(false);
               }
            })
          }

      function removeBRCB() {
        map.removeLayer('CBR')
        map.removeSource('CBR')
      }

      function addBVCB() {
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        fetch('https:\/\/mesonet.agron.iastate.edu/data/gis/images/4326/ridge/CBX/N0U_0.json')
          .then(res => res.json())
          .then(data => {
              map.addLayer({
              'id': 'CBV',
              'type': 'raster',
              'source': {
                'type': 'raster',
                'attribution': ''+data.meta.site+': VCP '+data.meta.vcp+'. Valid: <b>' + moment(data.meta.valid).format('MMMM Do YYYY, h:mm a')+' UTC | ' + moment(data.meta.valid).fromNow() + '</b>',
                'tiles': [
                'https:\/\/mesonet.agron.iastate.edu/cache/tile.py/1.0.0/ridge::CBX-N0U-0/{z}/{x}/{y}.png'
                ],
                'tileSize': 512
              },
              'paint': {}
            }, firstSymbolId)
            map.on('render', stopSpinner)
          })
      }

      function removeBVCB() {
        map.removeLayer('CBV')
        map.removeSource('CBV')
      }

      function addPTY() {
        //round to nearest 5 minutes:
        const ROUNDING = 5 * 60 * 1000; /*ms*/
        let now1 = moment.utc();
        now1 = moment.utc(Math.floor((+now1) / ROUNDING) * ROUNDING).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'PTY',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Accuweather Precip Type. Valid: <b>' + moment.utc(now1).format('MMMM Do YYYY, H:mm')+' | ' + moment.utc(now1).fromNow() + '</b>',
            'tiles': [
              'https:\/\/api.accuweather.com/dts/zxy/' + now1 + 'Z/{z}/{x}/{y}.png?apikey=d41dfd5e8a1748d0970cba6637647d96'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removePTY() {
        map.removeLayer('PTY')
        map.removeSource('PTY')
      }

      function addTerra(today) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'Terra',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Date: <b>' + today + '</b>',
            'tiles': [
              'https:\/\/gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?request=GetMap&SERVICE=WMS&time=' + today +
              '&layers=MODIS_Terra_CorrectedReflectance_TrueColor&crs=EPSG:3857&format=image/jpeg&styles=&width=256&height=256&bbox={bbox-epsg-3857}'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removeTerra() {
        map.removeLayer('Terra')
        map.removeSource('Terra')
      }

      function addTerraSnow(today) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'TerraS',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Date: <b>' + today + '</b>',
            'tiles': [
              'https:\/\/gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?request=GetMap&SERVICE=WMS&time=' + today +
              '&layers=MODIS_Terra_CorrectedReflectance_Bands367&crs=EPSG:3857&format=image/jpeg&styles=&width=256&height=256&bbox={bbox-epsg-3857}'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removeTerraSnow() {
        map.removeLayer('TerraS')
        map.removeSource('TerraS')
      }

      function addVIIRS(today,prod) {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'VIIRS',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Date: <b>' + today + '</b>',
            'tiles': [
            `https:\/\/gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?request=GetMap&SERVICE=WMS&time=${today}&layers=${prod}&crs=EPSG:3857&format=image/jpeg&styles=&width=256&height=256&bbox={bbox-epsg-3857}`
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removeVIIRS() {
        map.removeLayer('VIIRS')
        map.removeSource('VIIRS')
      }

      function addGLMOverlay() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        fetch('https:\/\/nowcoast.noaa.gov/layerinfo?request=prodtime&format=json&service=sat_meteo_emulated_imagery_lightningstrikedensity_goes_time&displaytime=now&layers=3')
          .then(res => res.json())
          .then(data => {
        map.addLayer({
          'id': 'GLM',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'GLM Updated: <b>'+ moment(data.layers[0].prodTime).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.layers[0].prodTime).fromNow() + '</b>',
            'tiles': [
              'https:\/\/nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_emulated_imagery_lightningstrikedensity_goes_time/MapServer/WmsServer?bbox={bbox-epsg-3857}&service=WMS&request=GetMap&version=1.3.0&layers=1&styles=&format=image/png&transparent=true&height=512&width=512&crs=EPSG:3857'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, firstSymbolId)
        map.on('render', stopSpinner)
          })
      }

      function removeGLM() {
        map.removeLayer('GLM')
        map.removeSource('GLM')
      }

      function addIR() {
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        fetch('https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/Most_Recent_WST13/ImageServer?f=pjson')
          .then(res => res.json())
          .then(data => {
        map.addLayer({
          'id': 'IR',
          'type': 'raster',
          'source': {
            'type': 'raster',

            'attribution': 'IR Updated: <b>'+ moment(data.timeInfo.timeExtent[1]).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.timeInfo.timeExtent[1]).fromNow() + '</b>',
            'tiles': [
            'https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/Most_Recent_WST13/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&size=512%2C512&imageSR=3857&time=&format=jpgpng&pixelType=U8&noData=&noDataInterpretation=esriNoDataMatchAny&interpolation=+RSP_BilinearInterpolation&compression=&compressionQuality=100&bandIds=1%2C0%2C2&mosaicRule=&renderingRule=%7B"rasterFunction"%3A"Stretch"%2C"rasterFunctionArguments"%3A%7B"StretchType"%3A5%2C"Statistics"%3A%5B%5D%2C"DRA"%3Afalse%2C"UseGamma"%3Atrue%2C"Gamma"%3A%5B0.1%2C0.85%2C0.85%5D%2C"ComputeGamma"%3Afalse%7D%2C"variableName"%3A"Raster"%2C"outputPixelType"%3A"U8"%7D&f=image'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, firstSymbolId)
        map.on('render', stopSpinner)
      })

      }

      function removeIR() {
        map.removeLayer('IR')
        map.removeSource('IR')
      }

      function addHRRRGust(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'hillshade') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var i=0;
        for(var j = 36; j>1;j--){
          hrtimestamps.push(moment.utc().subtract(j,'hours').format('MM-DD')+'-'+moment.utc().subtract(j,'hours').format('HH')+'Z');
          console.log(hrtimestamps[i]);
          map.addLayer({
            'id': hrtimestamps[i],
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                'https:\/\/thredds.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km_ANA/TP?LAYERS=Wind_speed_gust_surface&ELEVATION=0&TIME='+moment.utc().subtract(j,'hours').format('YYYY-MM-DD')+'T'+moment.utc().subtract(j,'hours').format('HH')+':00:00.000Z&TRANSPARENT=true&STYLES=boxfill%2Fsst_36&COLORSCALERANGE=0%2C30&NUMCOLORBANDS=253&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512'
              ],
              'tileSize': 512,
            },
            'paint': {
              "raster-opacity": 0,
              'raster-opacity-transition': {
                duration: 0
              },
              "raster-fade-duration": 0.0,
            }
          }, firstSymbolId);
          i++
        }
        map.on('render', stopSpinner);
        showFrame(-1);
        }

        function removeIRLoop(){
          loopname = ""
          console.log(map.getStyle().sources);
          //console.log(map.style.sourceCaches);
          for (var j = 0; j<irtimestamps.length;j++){
            console.log('Removed'+irtimestamps[j])
          map.removeLayer(irtimestamps[j])
          map.removeSource(irtimestamps[j])
          clearInterval(animationIRTimer)
          //clearInterval(loop1);
          }
          irtimestamps=[];
          console.log(map.getStyle().sources);

        }

      function removeLoop(){
        loopname = ""
        console.log(map.getStyle().sources);
        //console.log(map.style.sourceCaches);
        for (var j = 0; j<hrtimestamps.length;j++){
          console.log('Removed'+hrtimestamps[j])
        map.removeLayer(hrtimestamps[j])
        map.removeSource(hrtimestamps[j])
        clearInterval(animationTimer)
        //clearInterval(loop1);
      }
      hrtimestamps=[];
      console.log(map.getStyle().sources);
      //console.log(map.style.sourceCaches);
    }

    function addHRRRTemp(){
      var layers = map.getStyle().layers;
      loadingSpinner(true);
      var firstSymbolId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'hillshade') {
          firstSymbolId = layers[i].id;
          break;
        }
      }
      var currentImage = 0;
      var i=0;
      hrtimestamps=[];
      for(var j = 36; j>1;j--){
        hrtimestamps.push(moment.utc().subtract(j,'hours').format('MM-DD')+'-'+moment.utc().subtract(j,'hours').format('HH')+'Z');
        console.log(hrtimestamps[i]);
        map.addLayer({
          'id': hrtimestamps[i],
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
              'https:\/\/thredds.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km_ANA/TP?LAYERS=Temperature_height_above_ground&ELEVATION=2&TIME='+moment.utc().subtract(j,'hours').format('YYYY-MM-DD')+'T'+moment.utc().subtract(j,'hours').format('HH')+':00:00.000Z&TRANSPARENT=true&STYLES=boxfill%2Foccam&COLORSCALERANGE=245%2C315&NUMCOLORBANDS=253&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512'
            ],
            'tileSize': 512,
          },
          'paint': {
            "raster-opacity": 0,
            'raster-opacity-transition': {
              duration: 0.0
            },
            "raster-fade-duration": 0.0,
          }
        }, firstSymbolId);
        i++
      }
      map.on('render', stopSpinner);
        showFrame(-1);
      }

      function addHRRRSmoke(lay) {
        window.alert("Resize window if you are making an animated GIF for twitter, otherwise cities will be tiny and filesize will be too big for 15mb limit.")
        let layers = map.getStyle().layers;
        let now1 = moment.utc().format('HH'),now2;
        console.log(now1)
        let runs = ['T00','T06','T12','T18']
        if (now1 >= 0 && now1 < 3){
          now2 = 3 //t18
        }
        else if(now1 >= 3 && now1 < 9){
          now2 = 0
        }
        else if(now1 >= 9 && now1 < 16){
          now2 = 1
        }
        else if(now1 >= 16 && now1 < 22){
          now2 = 2
        }
        else if(now1 >= 22 && now1 < 24){
          now2 = 3
        }
        loadingSpinner(true);
        let firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currentImage = 0;
        hrtimestamps=[];
        var run;
        fetch('https:\/\/hwp-viz.gsd.esrl.noaa.gov/wmts/config/hrrr_smoke?modelrun={modelrun}')
          .then(res => res.json())
          .then(data => {
              // check for match, if no match look for previous run
              run = data.modelRuns.reverse().find(model => model.match(runs[now2]))
              if (!run){
                now2 = now2-1
                run = data.modelRuns.reverse().find(model => model.match(runs[now2]))
              }
              console.log(run)
              //run = data.modelRuns.slice(-2,-1)
              fetch(`https:\/\/hwp-viz.gsd.esrl.noaa.gov/wmts/config/hrrr_smoke?modelrun=${run}`)
                .then(res=>res.json())
                .then(data => {
                  var timestr = data.inventory
                  console.log(timestr)
                  try {
                  hrtimestamps = timestr.map(i=>moment(i).format('lll'))
                  for(var j = 0; j<hrtimestamps.length;j++){
                        console.log(hrtimestamps[j]);
                        map.addLayer({
                          'id': hrtimestamps[j],
                          'type': 'raster',
                          'source': {
                            'type': 'raster',
                            'tiles': [
                              `https:\/\/hwp-viz.gsd.esrl.noaa.gov/wmts/image/hrrr_smoke?var=${lay}&x={x}&y={y}&z={z}&time=${timestr[j]}&modelrun=${run}&level=0`
                            ],
                            'tileSize': 256,
                          },
                          'paint': {
                            "raster-opacity": 0,
                            'raster-opacity-transition': {
                              duration: 0.0
                            },
                            "raster-fade-duration": 0.0,
                          }
                        }, firstSymbolId);
                      }
                  map.on('render', stopSpinner);
                    showFrame(-1);

                  }catch(error){
                    $('.msmoke_toggle input.cmn-toggle').not(this).prop('checked', false);
                    //$('#brloop2').hide()
                    console.error(error)
                    window.alert("NWS Server Down, try again later.")
                    loadingSpinner(false);
                    $('#smokeloop').hide();
                  }
                })

                })

      }

      function addFirework() {
        window.alert("Resize window if you are making an animated GIF for twitter, otherwise cities will be tiny and filesize will be too big for 15mb limit.")
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currentImage = 0;
        hrtimestamps=[];
        fetch('https:\/\/geo.weather.gc.ca/geomet/?lang=en&version=1.3.0&request=GetCapabilities&SERVICE=WMS&layers=RAQDPS-FW.SFC_PM2.5&sld_version=1.1.0')
          .then(res => res.text())
          .then(str => {
              var x2js = new X2JS(),time,diff,
              infoObj = x2js.xml_str2json(str)
              time = infoObj.WMS_Capabilities.Capability.Layer.Layer.Layer.Layer.Layer.Dimension[0].__text.slice(0,20)
              diff = moment().diff(time, 'hours')
              try {
              i=0;
              for(var j = diff; j<72;j+=2){
                hrtimestamps.push(moment(time).add(j,'hours').format('lll'))
                console.log(hrtimestamps[i]);
                map.addLayer({
                  'id': hrtimestamps[i],
                  'type': 'raster',
                  'source': {
                    'type': 'raster',
                    'tiles': [
                      `https:\/\/geo.weather.gc.ca/geomet/?lang=en&version=1.3.0&request=GetMap&SERVICE=WMS&layers=RAQDPS-FW.SFC_PM2.5&style=RAQDPS-SFC-PM_UGM3&crs=EPSG:3857&format=image/png&styles=&width=512&height=512&bbox={bbox-epsg-3857}&time=${moment(time).add(j,'hours').format(moment.defaultFormatUtc)}`
                    ],
                    'tileSize': 512,
                  },
                  'paint': {
                    "raster-opacity": 0,
                    'raster-opacity-transition': {
                      duration: 0
                    },
                    "raster-fade-duration": 0.0,
                  }
                }, firstSymbolId);
                i++
              }

              map.on('render', stopSpinner);
                showFrame(-1);

              }catch(error){
                $('.msmoke_toggle input.cmn-toggle').not(this).prop('checked', false);
                //$('#brloop2').hide()
                console.error(error)
                loadingSpinner(false);
                $('#smokeloop').hide();
              }
            })
      }

      function addMRMS() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        let currentImage = 0;
        fetch('https:\/\/nowcoast.noaa.gov/layerinfo?requestid=2&request=timestops&format=json&service=radar_meteo_imagery_nexrad_time&layers=3')
        //fetch('https:\/\/nowcoast.noaa.gov/layerinfo?request=prodtime&format=json&service=radar_meteo_imagery_nexrad_time&displaytime=now&layers=3')
          .then(res => res.json())
          .then(data => {
            hrtimestamps = data.layers[0].timeStops;
            hrtimestamps = hrtimestamps.slice(-15);
            console.log(hrtimestamps)
            let timestamps = data.layers[0].timeStops;
            timestamps = timestamps.slice(-15);
            hrtimestamps = hrtimestamps.map(i => moment(i).format('lll'))
            for(let j = 0; j< hrtimestamps.length;j++){
            map.addLayer({
              'id': hrtimestamps[j],
              'type': 'raster',
              'source': {
                'type': 'raster',
                'tiles': [
                  //'https:\/\/nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/export?bbox={bbox-epsg-3857}&service=WMS&request=GetMap&version=1.3.0&layers=show%3A3&time='+timestamps[j]+','+timestamps[j]+'&styles=&format=image/png&transparent=true&height=512&width=512&crs=EPSG:3857'
                  'https:\/\/nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/export?dpi=72&transparent=true&format=png8&layers=show%3A3&time='+timestamps[j]+','+timestamps[j]+'&bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=512,512&f=image'
                ],
                'tileSize': 512
              },
              'paint': {
                "raster-opacity": 0,
                "raster-opacity-transition": {
                duration: 0
              },
              "raster-fade-duration": 0.0,
              }
            }, firstSymbolId)}

          })
          .then(()=>{
            map.on('render', stopSpinner)
            showFrame(-1)
          })
        }

      function removeMRMS() {
        map.removeLayer('MRMS')
        map.removeSource('MRMS')
      }

      function addMRMS1(hr) {
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'hillshade') {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        fetch('https:\/\/nowcoast.noaa.gov/layerinfo?request=prodtime&format=json&service=analysis_meteohydro_sfc_qpe_time&displaytime=now&layers='+hr+'')
          .then(res => res.json())
          .then(data => {
            map.addLayer({
              'id': 'MRMS1',
              'type': 'raster',
              'source': {
                'type': 'raster',
                'attribution': 'MRMS Updated: <b>'+ moment(data.layers[0].prodTime).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.layers[0].prodTime).fromNow() + '</b>',
                'tiles': [
                  'https:\/\/nowcoast.noaa.gov/arcgis/rest/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer/export?bbox={bbox-epsg-3857}&size=512,512&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&layers=show%3A'+hr+'&f=image'
                ],
                'tileSize': 512,
              },
              'paint': {}
            }, firstSymbolId)
            map.on('render', stopSpinner)
          })

      }

      function removeMRMS1() {
        map.removeLayer('MRMS1')
        map.removeSource('MRMS1')
      }

      var mwtimer;
      async function addMesowest(mesoNetwork,dens,variable) {
        var obTime = moment().format('MMMM Do YYYY, h:mm a');
        loadingSpinner(true);
          let s = map.getBounds().getSouth().toFixed(2);
          let n = map.getBounds().getNorth().toFixed(2);
          let w = map.getBounds().getWest().toFixed(2);
          let e = map.getBounds().getEast().toFixed(2);
          var mesowestURL = `https:\/\/api.synopticdata.com/v2/stations/latest?token=${mesoToken}&bbox=${w},${s},${e},${n}&within=100&output=geojson&vars=air_temp,wind_direction,wind_speed,wind_gust,weather_condition,visibility,relative_humidity,dew_point_temperature,wind_chill&units=english,speed|mph&stid=${mesoExclude}&network=${mesoNetwork}&hfmetars=0&show_empty_stations=false&minmax=3&minmaxtype=local&networkimportance=1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210&height=${screenh}&width=${screenw}&spacing=${dens}`;
          map.addSource('MesoWest', {
            type: 'geojson',
            data: mesowestURL,
            attribution: 'Updated: '+obTime,
          });

//&qc_checks=synopticlabs,madis&qc_remove_data=on
        // map.addLayer({
        //   'id': 'MWTemps2',
        //   'type': 'circle',
        //   'source': 'MesoWest',
        //   'paint': {
        //     "circle-radius": [
        //       "interpolate", ["linear"],
        //       ["zoom"],
        //       4, 10,
        //       7, 14,
        //       11, 20,
        //     ],
        //     'circle-color': {
        //       property: 'air_temp',
        //       stops: [
        //         [-60,'rgba(145,0,63,1)'],
        //         [-55,'rgba(206,18,86,1)'],
        //         [-50,'#e7298a'],
        //         [-45,'#df65b0'],
        //         [-40,'#ff73df'],
        //         [-35,'#ffbee8'],
        //         [-30,'#ffffff'],
        //         [-25,'#dadaeb'],
        //         [-20,'#bcbddc'],
        //         [-15,'#9e9ac8'],
        //         [-10,'#756bb1'],
        //         [-5,'#54278f'],
        //         [0,'#0d007d'],
        //         [5,'#0d339c'],
        //         [10,'#0066c2'],
        //         [15,'#299eff'],
        //         [20,'#4ac7ff'],
        //         [25,'#73d7ff'],
        //         [30,'rgba(48,207,194,1)'],
        //         [35,'rgba(0,153,150,1)'],
        //         [40,'rgba(18,87,87,1)'],
        //         [45,'rgba(6,109,44,1)'],
        //         [50,'rgba(49,163,84,1)'], //066d2c
        //         [55,'rgba(116,196,118,1)'],
        //         [60,'rgba(161,217,155,1)'],
        //         [65,'rgba(211,255,190,1)'],
        //         [70,'rgba(255,255,179,1)'],
        //         [75,'rgba(255,237,160,1)'],
        //         [80,'rgba(254,209,118,1)'],
        //         [85,'rgba(254,174,42,1)'],
        //         [90,'rgba(253,141,60,1)'],
        //         [95,'rgba(252,78,42,1)'],
        //         [100,'rgba(227,26,28,1)'],
        //         [105,'rgba(177,0,38,1)'],
        //         [110,'rgba(128,0,38,1)'],
        //         [115,'rgba(89,0,66,1)'],
        //         [120,'rgba(40,0,40,1)'],
        //       ],
        //       default: 'rgba(255,255,255,0.0)',
        //     },
        //     'circle-blur': 0.4,
        //   },
        //   'filter': ['==', '$type', 'Point'],
        // }, 'settlement-label');
        if (variable === 'air_temp' || variable ==='dew_point_temperature_d' || variable === 'wind_chill_d'){
          map.addLayer({
          'id': 'MesoWest',
          'type': 'symbol',
          'source': 'MesoWest',
          'layout': {
            'text-allow-overlap': true,
            "symbol-sort-key": ["to-number", ["get", variable]],
            'text-field': ['number-format', ['get', variable], {
              'min-fraction-digits': 0,
              'max-fraction-digits': 0.1
            }],
            'text-font': [
              "Lato Black",
              "Source Sans Pro Black",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 22,
              8, 28,
              12, 42,
            ],
          },
          'paint': {
            'text-color': {
              property: variable,
              stops: [
                [-60,'rgba(145,0,63,1)'],
                [-55,'rgba(206,18,86,1)'],
                [-50,'#e7298a'],
                [-45,'#df65b0'],
                [-40,'#ff73df'],
                [-35,'#ffbee8'],
                [-30,'#ffffff'],
                [-25,'#dadaeb'],
                [-20,'#bcbddc'],
                [-15,'#9e9ac8'],
                [-10,'#756bb1'],
                [-5,'#54278f'],
                [0,'#0d007d'],
                [5,'#0d339c'],
                [10,'#0066c2'],
                [15,'#299eff'],
                [20,'#4ac7ff'],
                [25,'#73d7ff'],
                [30,'rgba(48,207,194,1)'],
                [35,'rgba(0,153,150,1)'],
                [40,'rgba(18,87,87,1)'],
                [45,'rgba(6,109,44,1)'],
                [50,'rgba(49,163,84,1)'], //066d2c
                [55,'rgba(116,196,118,1)'],
                [60,'rgba(161,217,155,1)'],
                [65,'rgba(211,255,190,1)'],
                [70,'rgba(255,255,179,1)'],
                [75,'rgba(255,237,160,1)'],
                [80,'rgba(254,209,118,1)'],
                [85,'rgba(254,174,42,1)'],
                [90,'rgba(253,141,60,1)'],
                [95,'rgba(252,78,42,1)'],
                [100,'rgba(227,26,28,1)'],
                [105,'rgba(177,0,38,1)'],
                [110,'rgba(128,0,38,1)'],
                [115,'rgba(89,0,66,1)'],
                [120,'rgba(40,0,40,1)'],
              ],
              default:'rgba(255,255,255,0.0)',
            },
            //'text-color': 'rgba(255,255,255,1)',
            'text-halo-color':[
                'step',
                ['get', variable ],
                  'rgba(0,0,0,0.0)',
                    -60, 'rgba(255,255,255,1.0)',
                    -55, 'rgba(0,0,0,1.0)',
                    -50, 'rgba(0,0,0,1.0)',
                    -45, 'rgba(0,0,0,1.0)',
                    -40, 'rgba(0,0,0,1.0)',
                    -35, 'rgba(0,0,0,1.0)',
                    -30, 'rgba(0,0,0,1.0)',
                    -25, 'rgba(0,0,0,1.0)',
                    -20, 'rgba(0,0,0,1.0)',
                    -15, 'rgba(0,0,0,1.0)',
                    -10, 'rgba(255,255,255,1.0)',
                    -5, 'rgba(255,255,255,1.0)',
                    0, 'rgba(255,255,255,1.0)',
                    5, 'rgba(255,255,255,1.0)',
                    10, 'rgba(0,0,0,1.0)',
                    15, 'rgba(0,0,0,1.0)',
                    20, 'rgba(0,0,0,1.0)',
                    25, 'rgba(0,0,0,1.0)',
                    30, 'rgba(0,0,0,1.0)',
                    35, 'rgba(0,0,0,1.0)',
                    38, 'rgba(255,255,255,1)',
                    49, 'rgba(0,0,0,1.0)',
                    55, 'rgba(0,0,0,1.0)',
                    60, 'rgba(0,0,0,1.0)',
                    65, 'rgba(0,0,0,1.0)',
                    70, 'rgba(0,0,0,1.0)',
                    75, 'rgba(0,0,0,1.0)',
                    80, 'rgba(0,0,0,1.0)',
                    85, 'rgba(0,0,0,1.0)',
                    90, 'rgba(0,0,0,1.0)',
                    95, 'rgba(0,0,0,1.0)',
                    100, 'rgba(0,0,0,1.0)',
                    105, 'rgba(0,0,0,1.0)',
                    110, 'rgba(255,0,0,0.9)',
                    115, 'rgba(255,0,0,0.9)',
                    120, 'rgba(255,0,0,0.9)',
                  ],
            'text-halo-width': 0.8,
            'text-halo-blur': 0.5,
          },
          'filter': ['==', '$type', 'Point'],
        }, 'settlement-label');
        }
        else if (variable ==='gusts'){
          map.addLayer({
          'id': 'MesoWest',
          'type': 'symbol',
          'source': 'MesoWest',
          'layout': {
            //'symbol-sort-key': ['-',['to-number', ['get', 'wind_gust']]], //false
            'symbol-sort-key': ['to-number', ['get', 'wind_gust']],
            'text-allow-overlap': true,
            'text-field': ['number-format', ['get', 'wind_gust'], {
              'min-fraction-digits': 0,
              'max-fraction-digits': 0.1
            }],
            'text-font': [
              "Lato Black",
              "Ubuntu Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 22,
              8, 28,
              12, 42,
            ],
          },
          'paint': {
            'text-color': {
              property: 'wind_gust',
              stops: [
                [0, 'rgba(255,255,255,0.0)'],
                [10, 'rgba(255,255,255,0.0)'],
                [14.9, 'rgba(255,255,255,0)'],
                [14.99, 'rgba(255,255,255,1.0)'],
                [25, 'rgba(255,255,0,1.0)'],
                [35, '#f70'],
                [45, '#f00'],
                [55, '#f09'],
                [60, '#f0f'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
            'text-halo-color': {
              property: 'wind_gust',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [10, 'rgba(0,0,0,0.0)'],
                [14.9, 'rgba(0,0,0,0.0)'],
                [14.99, 'rgba(0,0,0,1.0)'],
                [25, 'rgba(0,0,0,1.0)'],
                [30, 'rgba(0,0,0,1.0)'],
                [40, 'rgba(0,0,0,1.0)'],
                [60, 'rgba(0,0,0,1.0)'],
              ],
              default: 'rgba(0,0,0,0.0)',
            },
            'text-halo-width': 1,
            'text-halo-blur': 0.5,
          },
          //'filter': ['==', '$type', 'Point'],
          //'filter': ['>=', 'wind_gust', 20],
        }, 'settlement-label');
        }
        else if (variable==='vis'){
          map.addLayer({
          'id': 'MesoWest',
          'type': 'symbol',
          'source': 'MesoWest',
          'layout': {
            'text-allow-overlap': true,
            "symbol-sort-key": ["to-number", ["get", "visibility"]],
            'text-field': ['number-format', ['get', 'visibility'], {
              'min-fraction-digits': 0.1,
              'max-fraction-digits': 1
            }],
            'text-font': [
              "Lato Black",
              "Source Sans Pro Black",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 22,
              8, 28,
              12, 42,
            ],
          },
          'paint': {
            'text-color': [
                'step',
                ['get', 'visibility' ],
                  'rgba(0,255,0,1.0)',
                    -1, 'rgba(255,0,255,1.0)',
                    1, 'rgba(255,0,0,1.0)',
                    3, 'rgba(0,200,255,1.0)',
                    5.01, 'rgba(0,255,0,1.0)',
                  ],
            //'text-color': 'rgba(255,255,255,1)',
            'text-halo-color':'rgba(0,0,0,1.0)',
            'text-halo-width': 1,
            'text-halo-blur': 0.5,
          },
          'filter': ['==', '$type', 'Point'],
        }, 'settlement-label');
        }
        else if (variable ==='relh'){
          map.addLayer({
          'id': 'MesoWest',
          'type': 'symbol',
          'source': 'MesoWest',
          'layout': {
            'text-allow-overlap': true,
            "symbol-sort-key": ["to-number", ["get", "relative_humidity"]],
            'text-field': ['number-format', ['get', 'relative_humidity'], {
              'min-fraction-digits': 0.0,
              'max-fraction-digits': 0.1
            }],
            'text-font': [
              "Lato Black",
              "Source Sans Pro Black",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 22,
              8, 28,
              12, 42,
            ],
          },
          'paint': {
            'text-color': {
              property: 'relative_humidity',
              stops: [
                [0,'#f0f'],
                [15,'#f00'],
                [25,'#f70'],
                [50,'#ff0'],
                [75,'#0f0'],
                [100,'#0ff'],
              ],
              default:'rgba(255,255,255,0.0)',
            },
            //'text-color': 'rgba(255,255,255,1)',
            'text-halo-color':'rgba(0,0,0,1.0)',
            'text-halo-width': 1,
            'text-halo-blur': 0.5,
          },
          'filter': ['==', '$type', 'Point'],
        }, 'settlement-label');
        }

        map.on('render', stopSpinner);

        mwtimer = window.setInterval(function() {
          $('.mapboxgl-ctrl-attrib-inner').text('Updated: '+moment().format('MMMM Do YYYY, h:mm a'))
          map.getSource('MesoWest').setData(mesowestURL);
        }, 600000);

        map.on('click', 'MesoWest', function(e) {
          let shtml = '<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.stid +'<br>'+e.features[0].properties.elevation+' ft</div><span>' + moment(e.features[0].properties.date_time).format('lll') + '<br>'
            if (e.features[0].properties.weather_condition_d){
              shtml += 'Conditions: ' + e.features[0].properties.weather_condition_d + '<br>'
            }
            if (e.features[0].properties.visibility){
              shtml += 'Visibility: ' + e.features[0].properties.visibility + 'mi <br>'
            }
            if (e.features[0].properties.air_temp){
              shtml += 'Temperature: ' + e.features[0].properties.air_temp + ' &deg;F<br>'
            }
            if (e.features[0].properties.dew_point_temperature_d){
              shtml += 'Dewpoint: ' + e.features[0].properties.dew_point_temperature_d + ' &deg;F<br>'
            }
            if (e.features[0].properties.relative_humidity){
              shtml += 'Humidity: ' + e.features[0].properties.relative_humidity + ' %<br>'
            }
            if (e.features[0].properties.wind_direction && e.features[0].properties.wind_speed !== 0){
              shtml += 'Wind: ' + e.features[0].properties.wind_direction +'&deg; at '+e.features[0].properties.wind_speed+' mph<br>'
            }
            if (e.features[0].properties.wind_speed === 0){
              shtml += 'Wind: Calm <br>'
            }
            if (e.features[0].properties.wind_gust){
              shtml += 'Wind Gust: ' + e.features[0].properties.wind_gust + ' mph<br>'
            }
            shtml += '<a href="https:\/\/www.weather.gov/wrh/timeseries?site=/' + e.features[0].properties.stid + '" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=' + e.features[0]
            .properties.stid + '\',\'popup\',\'width=900,height=800\'); return false;">3-Day History</a></span>'

          new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(shtml)
          .addTo(map);
        });

        map.on('mouseenter', 'MesoWest', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'MesoWest', function() {
          map.getCanvas().style.cursor = '';
        });

        var ar = ["all"];
        map.on('dblclick','MesoWest',function(e){
          var stid = e.features[0].properties.stid;
          var stn = ['!=', 'stid', e.features[0].properties.stid];

          ar.push(stn);
          console.table(ar);
          map.setFilter('MesoWest', ar
          );

          // map.setFilter('MesoWest', ar
          // );
        });
      }

      function addChange(mesoNetwork,dens,startHr,pastHr){
        loadingSpinner(true);
          let geojson = {
            type: "FeatureCollection",
            features: [],
          };
          let s = map.getBounds().getSouth().toFixed(2);
          let n = map.getBounds().getNorth().toFixed(2);
          let w = map.getBounds().getWest().toFixed(2);
          let e = map.getBounds().getEast().toFixed(2);
          let now = moment.utc(startHr).format('YYYYMMDDHHmm')
          let past = moment.utc(startHr).subtract(pastHr,'hours').format('YYYYMMDDHHmm')

          Promise.all([
              fetch(`https:\/\/api.synopticdata.com/v2/stations/nearesttime?attime=${now}&token=${mesoToken}&bbox=${w},${s},${e},${n}&within=90&output=json&vars=air_temp&units=english&stid=${mesoExclude}&network=${mesoNetwork}&hfmetars=0&show_empty_stations=false&networkimportance=1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210&height=${screenh}&width=${screenw}&spacing=${dens}`),
              fetch(`https:\/\/api.synopticdata.com/v2/stations/nearesttime?attime=${past}&token=${mesoToken}&bbox=${w},${s},${e},${n}&within=90&output=json&vars=air_temp&units=english&stid=${mesoExclude}&network=${mesoNetwork}&hfmetars=0&show_empty_stations=false&networkimportance=1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210&height=${screenh}&width=${screenw}&spacing=${dens}`)
            ]).then(responses => {
              return Promise.all(responses.map(function (response) {
                return response.json();
              }));
            }).then(data => {
              data0 = data[0].STATION
              data1 = data[1].STATION
              console.time('AddChange')
              for (const key of data0){
                  stid = key.STID
                  name = key.NAME
                  lat = key.LATITUDE
                  lon = key.LONGITUDE
                  temp = key.OBSERVATIONS.air_temp_value_1.value
                  t1 = key.OBSERVATIONS.air_temp_value_1.date_time
                  data1.filter(element =>{if(element.STID == key.STID){
                    geojson.features.push({
                        "type": "Feature",
                        "geometry": {
                          "type": "Point",
                          "coordinates": [Number(lon), Number(lat)]
                        },
                        "properties": {
                            "id": stid,
                            "name": name,
                            "diff": Number((temp-element.OBSERVATIONS.air_temp_value_1.value).toFixed(1)),
                            "temp1": temp,
                            "t1time": t1,
                            "temp2": element.OBSERVATIONS.air_temp_value_1.value,
                            "t2time": element.OBSERVATIONS.air_temp_value_1.date_time,
                            }
                      })
              }})
            }
            console.timeEnd('AddChange')
            }).then(()=>{
              map.addSource('MesoWestChange', {
                type: 'geojson',
                data: geojson,
              })
              console.log(geojson)

              map.addLayer({
                'id': 'MesoWestChange',
                'type': 'symbol',
                'source': 'MesoWestChange',
                'layout': {
                  'text-allow-overlap': true,
                  "symbol-sort-key": ["get", "diff"],
                  'text-field': ['number-format', ['get', 'diff'], {
                    'min-fraction-digits': 0.0,
                    'max-fraction-digits': 0.1
                  }],
                  'text-font': [
                    "Lato Black",
                    "Source Sans Pro Black",
                    "Open Sans Condensed Bold",
                    "Arial Unicode MS Bold"
                  ],
                  'text-size': [
                    "interpolate", ["linear"],
                    ["zoom"],
                    4, 22,
                    8, 28,
                    12, 42,
                    ],
                },
                'paint': {
                  'text-color': {
                    property: 'diff',
                    stops: [
                      [-50,'#f0f'],
                      [-30,'#07f'],
                      [-20,'#0af'],
                      [-10,'#0ff'],
                      [-0,'#fff'],
                      [10,'#ff0'],
                      [20,'#fa0'],
                      [30,'#f70'],
                      [50,'#f00'],
                      //[-50,'rgb(5,48,97)'],
                      //[-40,'rgb(9,60,135)'],
                      // [-30,'rgb(0,102,255)'],
                      // [-20,'rgb(41,158,255)'],
                      // [-10,'rgb(74,199,255)'],
                      // [-0,'rgb(255,255,255)'],
                      // [10,'rgb(254,217,118)'],
                      // [20,'rgb(254,174,42)'],
                      // [30,'rgb(255,110,40)'],
                      // [40,'rgb(255,50,0)'],
                      // [50,'rgb(225,0,0)'],
                      // [60,'rgb(255,20,255)'],
                    ],
                    default:'rgba(255,255,255,0.0)',
                  },
                  //'text-color': 'rgba(255,255,255,1)',
                  'text-halo-color':'rgba(0,0,0,1.0)',
                  'text-halo-width': 1,
                  'text-halo-blur': 0.5,
                },
                //'filter': ['==', '$type', 'Point'],
              }, 'settlement-label');

              map.on('render', stopSpinner);

              var ar = ["all"];
              map.on('dblclick','MesoWestChange',function(e){
                var stn = ['!=', 'id', e.features[0].properties.id];
                ar.push(stn);
                console.table(ar);
                map.setFilter('MesoWestChange', ar)
              })
            }).catch(function (error) {
              console.log(error);
            });
      }

      function removeChange(){
        map.removeLayer('MesoWestChange')
        map.removeSource('MesoWestChange')
      }

      function addMWGusts(mesoNetwork,dens) {
        loadingSpinner(true);
        $('#GustLegend').show();
        if (map.getSource('MesoWest') && map.isSourceLoaded('MesoWest')) {
          console.log('MesoWest already loaded!');
        } else {
          var s = map.getBounds().getSouth().toFixed(2);
          var n = map.getBounds().getNorth().toFixed(2);
          var w = map.getBounds().getWest().toFixed(2);
          var e = map.getBounds().getEast().toFixed(2);
          var mesowestURL = `https:\/\/api.synopticdata.com/v2/stations/latest?token=${mesoToken}&bbox=${w},${s},${e},${n}&within=60&output=geojson&units=english,speed|mph&stid=${mesoExclude}&network=${mesoNetwork}&qc_remove_data=on&hfmetars=0&minmax=3&qc_checks=synopticlabs,madis&show_empty_stations=false&networkimportance=1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210&height=${screenh}&width=${screenw}&spacing=${dens}`;
          map.addSource('MesoWest', {
            type: 'geojson',
            data: mesowestURL,
            attribution: 'Updated: '+moment().format('MMMM Do YYYY, h:mm a'),
          });
        }

        // for (var b = 0; b < barbCutoffs.length - 1; b++) {
        //   if (barbCutoffs[b] == 3) {
        //     map.addLayer({
        //       'id': 'MWBarbs' + b + '',
        //       'type': 'symbol',
        //       'filter': [
        //         "all",
        //         ['>=', 'wind_speed', barbCutoffs[b]],
        //         ['<', 'wind_speed', barbCutoffs[b + 1]]
        //       ],
        //       'source': 'MesoWest',
        //       'paint': {
        //         'icon-opacity': 1,
        //       },
        //       'layout': {
        //         'icon-image': 'barb-5',
        //         'icon-size': {
        //           'base': 0.8,
        //           'stops': [
        //             [7.0, 0.0],
        //             [8.0, 0.8],
        //             [12, 1.5]
        //           ]
        //         },
        //         'icon-allow-overlap': true,
        //         'icon-rotation-alignment': 'map',
        //         'icon-anchor': 'right',
        //         'icon-offset': [0, -7],
        //         'icon-rotate': {
        //           'property': 'wind_direction',
        //           'stops': [
        //             [0, -270],
        //             [360, 90]
        //           ]
        //         }
        //       }
        //     }, 'settlement-label');

        //   } else {
        //     console.log('MWBarbs' + b + '');
        //     map.addLayer({
        //       'id': 'MWBarbs' + b + '',
        //       'type': 'symbol',
        //       'filter': [
        //         "all",
        //         ['>=', 'wind_speed', barbCutoffs[b]],
        //         ['<', 'wind_speed', barbCutoffs[b + 1]]
        //       ],
        //       'source': 'MesoWest',
        //       'paint': {
        //         'icon-opacity': 1,
        //       },
        //       'layout': {
        //         'icon-image': 'barb-' + barbCutoffs[b] + '',
        //         'icon-size': {
        //           'base': 0.8,
        //           'stops': [
        //             [7, 0.0],
        //             [8.0, 0.8],
        //             [12, 1.5]
        //           ]
        //         },
        //         'icon-allow-overlap': true,
        //         'icon-rotation-alignment': 'map',
        //         'icon-anchor': 'right',
        //         'icon-offset': [0, -7],
        //         'icon-rotate': {
        //           'property': 'wind_direction',
        //           'stops': [
        //             [0, -270],
        //             [360, 90]
        //           ]
        //         }
        //       }
        //     }, 'settlement-label');
        //   }
        // }

        // map.addLayer({
        //   'id': 'Gusts',
        //   'type': 'circle',
        //   'source': 'MesoWest',
        //   'layout':{
        //         'circle-sort-key': ['to-number', ['get', 'wind_gust']],
        //       },
        //   'paint': {
        //     'circle-radius': [
        //       "interpolate", ["linear"],
        //       ["zoom"],
        //       4, 10,
        //       7, 14,
        //       11, 20,
        //     ],
        //     'circle-color': {
        //       property: 'wind_gust',
        //       stops: [
        //         [0, 'rgba(255,255,255,0.0)'],
        //         [10, 'rgba(255,255,255,0.0)'],
        //         [15, 'rgba(255,255,255,0.0)'],
        //         [25, 'rgba(255,255,0,1.0)'],
        //         [35, '#f70'],
        //         [45, '#f00'],
        //        // [55, '#f09'],
        //         [58, '#f0f'],
        //       ],
        //       default: 'rgba(255,255,255,0.0)',
        //     },
        //     'circle-blur': 0.4,
        //   },
        // //  'filter': ['==', '$type', 'Point'],
        // //  'filter': ['>=', 'wind_gust', 25],
        // }, 'settlement-label');

        map.addLayer({
          'id': 'Gusts',
          'type': 'symbol',
          'source': 'MesoWest',
          'layout': {
            //'symbol-sort-key': ['-',['to-number', ['get', 'wind_gust']]], //false
            'symbol-sort-key': ['to-number', ['get', 'wind_gust']],
            'text-allow-overlap': true,
            'text-field': ['number-format', ['get', 'wind_gust'], {
              'min-fraction-digits': 0,
              'max-fraction-digits': 0.1
            }],
            'text-font': [
              "Lato Black",
              "Ubuntu Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 12,
              7,20,
              12, 42,
            ],
          },
          'paint': {
            'text-color': {
              property: 'wind_gust',
              stops: [
                [0, 'rgba(255,255,255,0.0)'],
                [10, 'rgba(255,255,255,0.0)'],
                [14.9, 'rgba(255,255,255,0)'],
                [14.99, 'rgba(255,255,255,1.0)'],
                [25, 'rgba(255,255,0,1.0)'],
                [35, '#f70'],
                [45, '#f00'],
                [55, '#f09'],
                [60, '#f0f'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
            'text-halo-color': {
              property: 'wind_gust',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [10, 'rgba(0,0,0,0.0)'],
                [14.9, 'rgba(0,0,0,0.0)'],
                [14.99, 'rgba(0,0,0,1.0)'],
                [25, 'rgba(0,0,0,1.0)'],
                [30, 'rgba(0,0,0,1.0)'],
                [40, 'rgba(0,0,0,1.0)'],
                [60, 'rgba(0,0,0,1.0)'],
              ],
              default: 'rgba(0,0,0,0.0)',
            },
            'text-halo-width': 1,
            'text-halo-blur': 0.5,
          },
          //'filter': ['==', '$type', 'Point'],
          //'filter': ['>=', 'wind_gust', 20],
        }, 'settlement-label');

        var ar = ["all"];
        map.on('dblclick','Gusts',function(e){
          var stid = e.features[0].properties.stid;
          var stn = ['!=', 'stid', e.features[0].properties.stid];

          ar.push(stn);
          console.table(ar);
          // map.setFilter('Gusts1', ar
          // );


          map.setFilter('Gusts', ar
          );
        });


        map.on('render', stopSpinner);
        mwtimer = window.setInterval(function() {
          $('.mapboxgl-ctrl-attrib-inner').text('Updated: '+moment().format('MMMM Do YYYY, h:mm a'))
          map.getSource('MesoWest').setData(mesowestURL);
        }, 600000);
        map.on('click', 'Gusts', function(e) {
          let shtml = '<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.stid +'<br>'+e.features[0].properties.elevation+' ft</div><span>Valid: ' + moment(e.features[0].properties.date_time).format('MMMM Do YYYY, h:mm a') + '<br>'
            if (e.features[0].properties.weather_condition_d){
              shtml += 'Conditions: ' + e.features[0].properties.weather_condition_d + '<br>'
            }
            if (e.features[0].properties.air_temp){
              shtml += 'Temperature: ' + e.features[0].properties.air_temp + ' &deg;F<br>'
            }
            if (e.features[0].properties.dew_point_temperature){
              shtml += 'Dewpoint: ' + e.features[0].properties.dew_point_temperature + ' &deg;F<br>'
            }
            if (e.features[0].properties.wind_speed && e.features[0].properties.wind_speed !== 0){
              shtml += 'Wind: ' + e.features[0].properties.wind_direction +'&deg; at '+e.features[0].properties.wind_speed+' mph<br>'
            }
            if (e.features[0].properties.wind_speed === 0){
              shtml += 'Wind: Calm <br>'
            }
            if (e.features[0].properties.wind_gust){
              shtml += 'Wind Gust: ' + e.features[0].properties.wind_gust + ' mph<br>'
            }
            shtml += '<a href="https:\/\/www.weather.gov/wrh/timeseries?site=/' + e.features[0].properties.stid + '" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=' + e.features[0]
            .properties.stid + '\',\'popup\',\'width=900,height=800\'); return false;">3-Day History</a></span>'

          new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(shtml)
          .addTo(map);
        });

        map.on('mouseenter', 'Gusts', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Gusts', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function removeMWGusts() {
        $('#GustLegend').hide();
        // for (var b = 0; b < barbCutoffs.length - 1; b++) {
        //   map.removeLayer('MWBarbs' + b + '')
        // }
        map.removeLayer('Gusts')
       // map.removeLayer('Gusts1')

      }

      function removeMesoWest() {
        map.removeLayer('MesoWest')
        map.removeSource('MesoWest')
        window.clearInterval(mwtimer)
      }

      function addWV() {
        fetch('https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/Most_Recent_WST10/ImageServer?f=pjson')
        .then(res => res.json())
        .then(data => {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'WV',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'GeoColor Updated: <b>'+ moment(data.timeInfo.timeExtent[1]).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.timeInfo.timeExtent[1]).fromNow() + '</b>',
            'tiles': [
            'https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/Most_Recent_WST10/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&size=512%2C512&imageSR=3857&time=&format=jpgpng&pixelType=U8&noData=&noDataInterpretation=esriNoDataMatchAny&interpolation=+RSP_BilinearInterpolation&compression=&compressionQuality=100&bandIds=0%2C2%2C1&mosaicRule=&renderingRule=&f=image'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner)
      })
      }

      function removeWV() {
        map.removeLayer('WV')
        map.removeSource('WV')
      }

      function addPWST() {
       //var age = moment().subtract(15, 'minutes').valueOf()

        loadingSpinner(true);
        fetch(pwstimesURL)
          .then(res => res.json())
          .then(data => {
            var pwstime = data.products[614].time
            map.addSource('PWS', {
              type: 'vector',
              tiles: ['https:\/\/api.weather.com/v2/vector-api/products/614/features.mvt?x={x}&y={y}&lod=8&apiKey='+pwsKey+'&tile-size=512&time=' + pwstime[0] + '&time=' + pwstime[1] + '&time=' + pwstime[2] + '&time=' +
                pwstime[3] + '&time=' + pwstime[4] + '&stepped=true'
              ],
              tileSize: 512,
              minZoom: 2,
              maxZoom: 16,
            });

        for (var i = pwstime.length - 1; i >= 0; i--) {
          map.addLayer({
            "id": "PWS-" + i,
            "type": "circle",
            "source": "PWS",
            "source-layer": pwstime[i],
            "filter": ["all", ["!=", "tempf", -9999]],
            'paint': {
              'circle-radius': 13,
              //'circle-blur': 0.4,
              'circle-color': {
                property: 'tempf',
                stops: [
                  [-60,'rgba(145,0,63,1)'],
                  [-55,'rgba(206,18,86,1)'],
                  [-50,'#e7298a'],
                  [-45,'#df65b0'],
                  [-40,'#ff73df'],
                  [-35,'#ffbee8'],
                  [-30,'#ffffff'],
                  [-25,'#dadaeb'],
                  [-20,'#bcbddc'],
                  [-15,'#9e9ac8'],
                  [-10,'#756bb1'],
                  [-5,'#54278f'],
                  [0,'#0d007d'],
                  [5,'#0d339c'],
                  [10,'#0066c2'],
                  [15,'#299eff'],
                  [20,'#4ac7ff'],
                  [25,'#73d7ff'],
                  [30,'rgba(48,207,194,1)'],
                  [35,'rgba(0,153,150,1)'],
                  [40,'rgba(18,87,87,1)'],
                  [45,'rgba(6,109,44,1)'],
                  [50,'rgba(49,163,84,1)'], //066d2c
                  [55,'rgba(116,196,118,1)'],
                  [60,'rgba(161,217,155,1)'],
                  [65,'rgba(211,255,190,1)'],
                  [70,'rgba(255,255,179,1)'],
                  [75,'rgba(255,237,160,1)'],
                  [80,'rgba(254,209,118,1)'],
                  [85,'rgba(254,174,42,1)'],
                  [90,'rgba(253,141,60,1)'],
                  [95,'rgba(252,78,42,1)'],
                  [100,'rgba(227,26,28,1)'],
                  [105,'rgba(177,0,38,1)'],
                  [110,'rgba(128,0,38,1)'],
                  [115,'rgba(89,0,66,1)'],
                  [120,'rgba(40,0,40,1)'],
                ],
                default:'rgba(255,255,255,0.0)',
              },
            },
            //"filter": [">", "$validTime", age]
          });

          map.addLayer({
            'id': 'PWS' + i,
            'type': 'symbol',
            'source': 'PWS',
            'source-layer': pwstime[i],
            "filter": ["all", ["!=", "tempf", -9999]],
            'layout': {
              //'text-allow-overlap': true,
              'text-field': ['number-format', ['get', 'tempf'], {
                'min-fraction-digits': 0,
                'max-fraction-digits': 0.1
              }],
              //'text-field': '{tempf}',
              'text-font': [
                "Open Sans Condensed Bold",
              ],
              'text-size': 16,
            },
            'paint': {
              'text-color': {
                property: 'tempf',
                stops: [
                  [-20, '#000'],
                  [-10.1, '#000'],
                  [-10, '#fff'],
                  [10, '#fff'],
                  [11, '#000'],
                  [39.9, '#000'],
                  [40, '#fff'],
                  [45, '#fff'],
                  [52, '#fff'],
                  [52.1, '#000'],
                  [55, '#000'],
                ],
                default: 'rgba(0,0,0,1.0)',
              }
            },
          });

        }

        map.on('render', stopSpinner);
        for (var i = 0; i < pwstime.length; i++) {
          map.on('click', 'PWS' + i, function(e) {
              let shtml = '<span style="font-family:Open Sans;font-size:14px;"><b>'+e.features[0].properties.neighborhood+'<br>'+e.features[0].properties.id+'<br>' + moment(e.features[0].properties.validTime).format('MMMM Do YYYY, h:mm a') +'</b><br>'
                if (e.features[0].properties.tempf){
                  shtml += '<span style="font-family:Open Sans;font-size:13px;">Temperature: <b>' + e.features[0].properties.tempf + ' &deg;F</b><br>'
                }
                if (e.features[0].properties.dewptf){
                  shtml += 'Dewpoint: <b>' + e.features[0].properties.dewptf + ' &deg;F</b><br>'
                }
                if (e.features[0].properties.windspeedmph && e.features[0].properties.windspeedmph !== 0){
                  shtml += 'Wind: <b>' + e.features[0].properties.winddir +'&deg; at ' + e.features[0].properties.windspeedmph + ' mph</b><br>'
                }
                if (e.features[0].properties.windspeedmph === 0){
                  shtml += 'Wind: Calm <br>'
                }
                if (e.features[0].properties.windgustmph){
                  shtml += 'Gust: <b>' + e.features[0].properties.windgustmph + ' mph</b><br>'
                }
                if (e.features[0].properties.maxwindgust){
                  shtml += 'Max Gust: <b>' + e.features[0].properties.maxwindgust + ' mph</b><br>'
                }
                if (e.features[0].properties.dailyrainin){
                  shtml += 'Day Rain: <b>' + e.features[0].properties.dailyrainin + ' in</b><br>'
                }
                if (e.features[0].properties.softwaretype){
                  shtml += 'Software: <b>' + e.features[0].properties.softwaretype + '</b><br>'
                }
                shtml += '<a href="https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id +'" target="Popup" onclick="window.open(\'https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id + '\',\'popup\',\'width=900,height=800\'); return false;">More Information </a></span>'

            new mapboxgl.Popup({maxWidth:'400px'})
              .setLngLat(e.lngLat)
              .setHTML(shtml)
              .addTo(map);
          });

          map.on('mouseenter', 'PWS' + i, function() {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'PWS' + i, function() {
            map.getCanvas().style.cursor = '';
          })
        }
      })
    }

      function removePWST() {
        for (var i = 0; i < 5; i++) {
          map.removeLayer('PWS-' + i + '')
          map.removeLayer('PWS' + i + '')
        }
        map.removeSource('PWS')
      }

      function addCocorahs(date,elem){
        loadingSpinner(true);
        var cocogeojson = {
          type: "FeatureCollection",
          features: [],
        };

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/data.cocorahs.org/cocorahs/export/MapDataFeed.aspx?date='+date+'&country=USA&state=ID,OR,WA,MT,NV,CA,UT,WY,CO,AZ')
          .then(res => res.json())
          .then(data => Object.values(data.result).forEach(function(key) {
            let precip;
            let snowf;
            let snowd;
            if (key.prcp === "-1.00"){
              precip = 'T';
            }
            else if(key.prcp === "-2.00"){
              precip = '';
            }
            else {
              precip = Number(key.prcp)
            }
            if (key.snowfall==='NA'){
              snowf = '';
            }
            else if (key.snowfall ==='T'){
              snowf = 'T';
            }
            else {
              snowf = Number(key.snowfall)
            }
            if (key.snowdepth==='NA'){
              snowd = '';
            }
            else if (key.snowdepth ==='T'){
              snowd = 'T';
            }
            else {
              snowd = Number(key.snowdepth)
            }

            cocogeojson.features.push({
                 "type": "Feature",
                 "geometry": {
                   "type": "Point",
                   "coordinates": [Number(key.lng), Number(key.lat)]
                },
                "properties": {
                    "id": key.id,
                    "name": key.st_name,
                    "stid": key.st_num,
                    "obsD": key.obs_date,
                    "obsT": key.obs_time,
                    "prcp": precip,
                    "sf": snowf,
                    "sd": snowd,
                    }
            })

            }))
            .then(()=> {
                map.addSource('Cocorahs', {
                type: 'geojson',
                data: cocogeojson,
              })
              //console.log(cocogeojson)

                if (elem === 'pcpn'){
                map.addLayer({
                  'id': 'Cocorahs',
                  'type': 'circle',
                  'source': 'Cocorahs',
                  'paint': {
                    'circle-stroke-width':1,
                    'circle-stroke-color':'rgba(0,0,0,.5)',
                    "circle-radius": [
                          "interpolate", ["linear"],
                            ["zoom"],
                            4, 6,
                            7, 12,
                          11, 18,
                          ],
                    'circle-color': {
                      property: 'prcp',
                      stops: [
                        [0, 'rgba(0,0,0,0.0)'],
                        [0.01, 'rgba(193,233,192,1.0)'],
                        [0.1, 'rgba(161,217,155,1.0)'],
                        [0.25, 'rgba(116,196,118,1.0)'],
                        [0.50, 'rgba(49,163,83,1.0)'],
                        [1.0, 'rgba(0,109,44,1.0)'],
                        [1.5, 'rgba(255,250,138,1.0)'],
                        [2.0, 'rgba(255,204,79,1.0)'],
                        [3.0, 'rgba(254,141,60,1.0)'],
                        [4.0, 'rgba(252,78,42,1.0)'],
                        [6.0, 'rgba(214,26,28,1.0)'],
                        [8.0, 'rgba(173,0,38,1.0)'],
                        [10.0, 'rgba(112,0,38,1.0)'],
                        [15.0, 'rgba(59,0,48,1.0)'],
                        [20.0, 'rgba(255,0,255,1.0)'],
                      ],
                      default: 'rgba(255,255,255,0.0)',
                    },
                  },
                  'filter': ['has', 'prcp']
                }, 'settlement-label');

                map.addLayer({
                  'id': 'Cocorahs1',
                  'type': 'symbol',
                  'source': 'Cocorahs',
                  'layout': {
                    //'text-allow-overlap': true,
                    'text-field': '{prcp}',
                    'text-font': [
                      "Open Sans Condensed Bold",
                      "Open Sans Condensed Bold",
                      "Arial Unicode MS Bold"
                    ],
                    'text-size': [
                      "interpolate", ["linear"],
                      ["zoom"],
                      4, 14,
                      7, 18,
                      11, 22,
                    ],
                  },
                  'paint': {
                    'text-color': {
                      property: 'prcp',
                      stops: [
                        [0, 'rgba(0,0,0,0.0)'],
                        [0.01, 'rgba(255,255,255,1.0)'],
                      ],
                      default: 'rgba(255,255,255,1.0)',
                    },
                    'text-halo-color': {
                      property: 'prcp',
                      stops: [
                        [0, 'rgba(0,0,0,0.0)'],
                        [0.01, 'rgba(0,0,0,1.0)'],
                      ],
                      default: 'rgba(0,0,0,1.0)',
                    },
                    'text-halo-width': 1.5,
                    'text-halo-blur': 1,
                  },
                  'filter': ['has', 'prcp']
                }, 'settlement-label');
            }
            if (elem === 'snow'){
              map.addLayer({
                'id': 'Cocorahs',
                'type': 'circle',
                'source': 'Cocorahs',
                'paint': {
                  'circle-stroke-width':1,
                  'circle-stroke-color':'rgba(0,0,0,.5)',
                  "circle-radius": [
                        "interpolate", ["linear"],
                          ["zoom"],
                          4, 6,
                          7, 12,
                        11, 18,
                        ],
                  'circle-color': {
                    property: 'sf',
                    stops: [
                      [0, 'rgba(0,0,0,0.0)'],
                      [0.1, 'rgba(150,150,150,1.0)'],
                      [1, 'rgba(200,200,200,1.0)'],
                      [2, 'rgba(50,150,255,1.0)'],
                      [3, 'rgba(0,100,225,1.0)'],
                      [4, 'rgba(60,52,212,1.0)'],
                      [6, 'rgba(121,26,233,1.0)'],
                      [8, 'rgba(182,0,255,1.0)'],
                      [12, 'rgba(255,0,255,1.0)'],
                      [18.0, 'rgba(212,0,114,1.0)'],
                      [24.0, 'rgba(191,0,32,1.0)'],
                      [36.0, 'rgba(120,0,0,1.0)'],
                    ],
                    default: 'rgba(255,255,255,0.0)',
                  },
                },
                'filter': ['has', 'sf']
              }, 'settlement-label');

              map.addLayer({
                'id': 'Cocorahs1',
                'type': 'symbol',
                'source': 'Cocorahs',
                'layout': {
                  //'text-allow-overlap': true,
                  'text-field': '{sf}',
                  'text-font': [
                    "Open Sans Condensed Bold",
                    "Open Sans Condensed Bold",
                    "Arial Unicode MS Bold"
                  ],
                  'text-size': [
                    "interpolate", ["linear"],
                    ["zoom"],
                    4, 14,
                    7, 18,
                    11, 22,
                  ],
                },
                'paint': {
                  'text-color': {
                    property: 'sf',
                    stops: [
                      [0, 'rgba(0,0,0,0.0)'],
                      [0.01, 'rgba(255,255,255,1.0)'],
                    ],
                    default: 'rgba(255,255,255,1.0)',
                  },
                  'text-halo-color': {
                    property: 'sf',
                    stops: [
                      [0, 'rgba(0,0,0,0.0)'],
                      [0.01, 'rgba(0,0,0,1.0)'],
                    ],
                    default: 'rgba(0,0,0,1.0)',
                  },
                  'text-halo-width': 1.5,
                  'text-halo-blur': 1,
                },
                'filter': ['has', 'sf']
              }, 'settlement-label');
          }
          if (elem === 'snwd'){
            map.addLayer({
              'id': 'Cocorahs',
              'type': 'circle',
              'source': 'Cocorahs',
              'paint': {
                'circle-stroke-width':1,
                'circle-stroke-color':'rgba(0,0,0,.5)',
                "circle-radius": [
                      "interpolate", ["linear"],
                        ["zoom"],
                        4, 6,
                        7, 12,
                      11, 18,
                      ],
                'circle-color': {
                  property: 'sd',
                  stops: [
                    [0, 'rgba(0,0,0,0.0)'],
                    [0.1, 'rgba(200,200,200,1.0)'],
                    [5, 'rgba(31, 134, 255,1.0)'],
                    [10, 'rgba(60,52,212,1.0)'],
                    [20, 'rgba(121,26,233,1.0)'],
                    [50, 'rgba(182,0,255,1.0)'],
                    [75, 'rgba(233,0,213,1.0)'],
                    [100.0, 'rgba(212,0,114,1.0)'],
                    [200.0, 'rgba(191,0,32,1.0)'],
                  ],
                  default: 'rgba(255,255,255,0.0)',
                },
              },
              'filter': ['has', 'sd']
            }, 'settlement-label');

            map.addLayer({
              'id': 'Cocorahs1',
              'type': 'symbol',
              'source': 'Cocorahs',
              'layout': {
                //'text-allow-overlap': true,
                'text-field': '{sd}',
                'text-font': [
                  "Open Sans Condensed Bold",

                ],
                'text-size': [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 14,
                  7, 18,
                  11, 22,
                ],
              },
              'paint': {
                'text-color':'rgba(255,255,255,1.0)',
                'text-halo-color': 'rgba(0,0,0,1.0)',
                'text-halo-width': 1.5,
                'text-halo-blur': 1,
              },
              'filter': ['has', 'sd']
            }, 'settlement-label');
        }
        map.on('render', stopSpinner);

        map.on('click', 'Cocorahs', function(e) {
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<div class="popup-header">'+e.features[0].properties.name +' - '+e.features[0].properties.stid+'</div>Date: '+e.features[0].properties.obsD+'-'+e.features[0].properties.obsT+'<br>Precipitation: '+e.features[0].properties.prcp+'<br>Snowfall: '+e.features[0].properties.sf+'<br>Snow Depth: '+e.features[0].properties.sd+'<br><a href="" target="Popup" onclick="window.open(\'https:\/\/www.cocorahs.org/ViewData/ViewDailyPrecipReport.aspx?DailyPrecipReportID='+e.features[0].properties.id+'\',\'popup\',\'width=900,height=800\'); return false;">Cocorahs Page</a></span><br>')
                .addTo(map);
            });

            map.on('mouseenter', 'Cocorahs', function() {
              map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'Cocorahs', function() {
              map.getCanvas().style.cursor = 'pointer';
            });

            var ar = ["all"];
            map.on('dblclick','Cocorahs',function(e){
              var stid = e.features[0].properties.stid;
              var stn = ['!=', 'stid', e.features[0].properties.stid];

              ar.push(stn);
              console.table(ar);
              map.setFilter('Cocorahs', ar );
              map.setFilter('Cocorahs1', ar );
            })
      })
    .catch(error => window.alert("Problem Loading Data."))
    }

      function removeCocorahs(){
        map.removeLayer('Cocorahs')
        map.removeLayer('Cocorahs1')
        map.removeSource('Cocorahs')
      }

      function addNWRFCSnotel(){
        loadingSpinner(true);
        var snotelgeojson = {
          type: "FeatureCollection",
          features: [],
        };

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.nwrfc.noaa.gov/snow/qdb_snow.php?sw_lat=39.605688178320804&sw_lng=-125.92529296875001&ne_lat=51.80861475198521&ne_lng=-107.86376953125001&version=16')
          .then(res => res.json())
          .then(data => Object.values(data).forEach(function(key) {

            if (key.type === 'STN'){
              //console.log(key.type)
            snotelgeojson.features.push({
                 "type": "Feature",
                 "geometry": {
                   "type": "Point",
                   "coordinates": [Number(key.lng), Number(key.lat)]
                },
                "properties": {
                    "name": key.des,
                    "stid": key.lid,
                    "elev": key.elev,
                    "swe": key.swe,
                    "swe_per": Number(key.swe_per),
                    "sd": Number(key.sd),
                    }
            })
          }
            }))
          .then(() => addnwrfc())

          function addnwrfc(){
            console.log(snotelgeojson)
          map.addSource('NWRFC', {
            type: 'geojson',
            data: snotelgeojson,
          });
          // map.addLayer({
          //   'id': 'NWRFC2',
          //   'type': 'circle',
          //   'source': 'NWRFC',
          //   'paint': {
          //     "circle-radius": [
          //           "interpolate", ["linear"],
          //             ["zoom"],
          //             4, 9,
          //             7, 15,
          //            11, 21,
          //            ],
          //     'circle-color': {
          //       property: 'swe_per',
          //       stops: [
          //         [0, 'rgba(255,0,0,0.0)'],
          //         [30, 'rgba(255,255,100,1.0)'],
          //         [50, 'rgba(255,255,0,1.0)'],
          //         [75, 'rgba(0,0,213,1.0)'],
          //         [100.0, 'rgba(0,0,255,1.0)'],
          //         [200.0, 'rgba(0,255,255,1.0)'],
          //       ],
          //       default: 'rgba(255,255,255,0.0)',
          //     },
          //   },
          //   'filter': ['<', 'sd', 100.0],
          // //  'filter': ['==', '$type', 'Point'],
          // }, 'settlement-label');

          map.addLayer({
            'id': 'NWRFC',
            'type': 'circle',
            'source': 'NWRFC',
            'paint': {
              "circle-radius": [
                    "interpolate", ["linear"],
                      ["zoom"],
                      4, 6,
                      7, 12,
                     11, 18,
                     ],
              'circle-stroke-width':1,
              'circle-stroke-color':'rgba(0,0,0,.5)',
              'circle-color': {
                property: 'swe_per',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [1, 'rgba(100,0,0,1.0)'],
                  [20, 'rgba(200,0,0,1.0)'],
                  [50, 'rgba(255,200,10,1.0)'],
                  [75, 'rgba(255,255,0,1.0)'],
                  [100.0, 'rgba(0,255,0,1.0)'],
                  [125.0, 'rgba(0,255,255,1.0)'],
                  [200.0, 'rgba(0,0,100,1.0)'],
                ],
                default: 'rgba(255,255,255,0.0)',
              },
            },
          //  'filter': ['<', 'sd', 100.0],
          //  'filter': ['==', '$type', 'Point'],
          }, 'settlement-label');

          map.addLayer({
            'id': 'NWRFC1',
            'type': 'symbol',
            'source': 'NWRFC',
            'layout': {
              //'text-allow-overlap': true,
              'text-field': '{swe_per}',
              'text-font': [
                "Open Sans Condensed Bold",

              ],
              'text-size': [
                "interpolate", ["linear"],
                ["zoom"],
                4, 12,
                7, 16,
                11, 20,
              ],
            },
            'paint': {
              'text-color':{
              property: 'swe_per',
              stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [1, 'rgba(255,200,255,1.0)'],
                  [20, 'rgba(255,255,255,1.0)'],
                  [29, 'rgba(255,255,255,1.0)'],
                  [30, 'rgba(0,0,0,1.0)'],
                  [50, 'rgba(0,0,0,1.0)'],
                  [75, 'rgba(0,0,0,1.0)'],
                  [100.0, 'rgba(0,0,0,1.0)'],
                  [125.0, 'rgba(0,0,0,1.0)'],
                  [150.0, 'rgba(0,0,0,1.0)'],
                  [151.0, 'rgba(255,255,255,1.0)'],
                  ],
                default: 'rgba(255,255,255,0.0)',
                },
              // 'text-halo-color': {
              //   property: 'swe_per',
              //   stops: [
              //     [0, 'rgba(0,0,0,0.0)'],
              //     [0.01, 'rgba(0,0,0,1.0)'],
              //   ],
              //   default: 'rgba(0,0,0,1.0)',
              // },
              // 'text-halo-width': 1.5,
              // 'text-halo-blur': 1,
             },
            //'filter': ['==', '$type', 'Point'],
          //  'filter': ['<', 'sd', 100.0],
          }, 'settlement-label');
          // map.addLayer({
          //   'id': 'NWRFC2',
          //   'type': 'symbol',
          //   'source': 'NWRFC',
          //   'layout': {
          //     'text-offset':[1.5,1.5],
          //     //'text-allow-overlap': true,
          //     'text-field': '{swe_per}%',
          //     'text-font': [
          //       "Open Sans Condensed Bold",
          //       "Open Sans Condensed Bold",
          //       "Arial Unicode MS Bold"
          //     ],
          //     'text-size': [
          //       "interpolate", ["linear"],
          //       ["zoom"],
          //       4, 12,
          //       7, 16,
          //       11, 20,
          //     ],
          //   },
          //   'paint': {
          //     'text-color': {
          //       property: 'sd',
          //       stops: [
          //         [0, 'rgba(0,0,0,0.0)'],
          //         [0.01, 'rgba(0,0,0,1.0)'],
          //       ],
          //       default: 'rgba(0,0,0,1.0)',
          //     },
          //     // 'text-halo-color': {
          //     //   property: 'sd',
          //     //   stops: [
          //     //     [0, 'rgba(0,0,0,0.0)'],
          //     //     [0.01, 'rgba(0,0,0,1.0)'],
          //     //   ],
          //     //   default: 'rgba(0,0,0,1.0)',
          //     // },
          //     // 'text-halo-width': 1.5,
          //     // 'text-halo-blur': 1,
          //   },
          //   //'filter': ['==', '$type', 'Point'],
          //   'filter': ['<', 'sd', 100.0],
          // }, 'settlement-label');
            map.on('render', stopSpinner);

            map.on('click', 'NWRFC', function(e) {
              new mapboxgl.Popup({maxWidth:'720px'})
                .setLngLat(e.lngLat)
                .setHTML('<div class="popup-header">'+e.features[0].properties.name +'</div>SWE: '+e.features[0].properties.swe+'"<br>Depth: '+e.features[0].properties.sd+'"<br><a href="" target="Popup" onclick="window.open(\'https:\/\/www.nwrfc.noaa.gov/snow/snowplot.cgi?'+e.features[0].properties.stid+'\',\'popup\',\'width=900,height=800\'); return false;">NWRFC Page</a></span><br><img src="https:\/\/www.nwrfc.noaa.gov/snow/plot_SWE_14.php?id='+e.features[0].properties.stid+'">')
                .addTo(map);
            });

            map.on('mouseenter', 'NWRFC', function() {
              map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'NWRFC', function() {
              map.getCanvas().style.cursor = 'pointer';
            });

            var ar = ["all"];
            map.on('dblclick','NWRFC',function(e){
              var stid = e.features[0].properties.stid;
              var stn = ['!=', 'stid', e.features[0].properties.stid];

              ar.push(stn);
              console.table(ar);
              map.setFilter('NWRFC', ar );
              map.setFilter('NWRFC1', ar );
            })

          }

      }

      function removeNWRFCSnotel(){
        map.removeLayer('NWRFC')
        map.removeLayer('NWRFC1')
        map.removeSource('NWRFC')
      }

      function addSnowAna(period){
        //map.setLayoutProperty('dark', 'visibility', 'visible')
        //map.setLayoutProperty('water-dark', 'visibility', 'visible')
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }
        fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.weather.gov/source/crh/snow_date_'+period+'.json')
        .then(res => res.json())
        .then(data => {

        map.addSource('SnowAna', {
          type: 'geojson',
          data: 'https:\/\/test.8222.workers.dev/?https:\/\/www.weather.gov/source/crh/snowfall_'+period+'.json',
          attribution: 'Valid: <b>' + data.valid_time+'',
        });


        map.addLayer({
          'id': 'SnowAna',
          'type': 'fill',
          'source':'SnowAna',
          'layout': {},
          'paint': {
          //'fill-color': ['get', 'color'],
          'fill-color':[
            'step',
              ['get','snowfall'],
              'rgba(255,255,255,0.0)',
              0.1, 'rgba(200,200,200,1.0)',
              1, 'rgba(100,200,255,1.0)',
              2, 'rgba(50, 150, 255,1.0)',
              3, 'rgba(0, 100, 225,1.0)',
              4, 'rgba(60,52,212,1.0)',
              6, 'rgba(121,26,233,1.0)',
              8, 'rgba(182,0,255,1.0)',
              12, 'rgba(255,0,255,1.0)',
              18.0, 'rgba(255,100,255,1.0)',
              24.0, 'rgba(255,200,255,1.0)',
              30.0, 'rgba(220,255,255,1.0)',
              36.0, 'rgba(0,255,255,1.0)',
          ],
          'fill-opacity': 1
          }
          },lastSymbolId)
        })

          map.on('render', stopSpinner)
      }

      function removeSnowAna(){
        //map.setLayoutProperty('dark', 'visibility', 'none')
        //map.setLayoutProperty('water-dark', 'visibility', 'none')
        map.removeLayer('SnowAna')
        map.removeSource('SnowAna')
      }

      var pulseAva;

      function addAvalanche(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }
        map.addSource('Avalanche', {
          type: 'geojson',
          data: 'https:\/\/api.avalanche.org/v2/public/products/map-layer',
          //tolerance: .4,
        });

        map.addLayer({
          'id': 'Avalanche',
          'type': 'fill',
          'source':'Avalanche',
          'layout': {},
          'paint': {
            'fill-color': ['get', 'color'],
            'fill-opacity': ['get', 'fillOpacity'],
            //'fill-outline-color': ['get', 'stroke'],
          },
          },lastSymbolId);
          map.addLayer({
            'id': 'AvalanchePulse',
            'type': 'fill',
            'source':'Avalanche',
            'layout': {},
            'paint': {
              'fill-color': ['get', 'color'],
              'fill-opacity': 1,
              //'fill-outline-color': ['get', 'stroke'],
            },
            'filter': ['==', ['get', 'product', ['get', 'warning']], 'warning'],
            },lastSymbolId);

            var framesPerSecond = 30;
            var multiplier = 0;
            var opacity = .1;
            function pulseMarker(){
                multiplier += .1;
                opacity = (((Math.sin(multiplier))+1)/2)
                //console.log(opacity);
                map.setPaintProperty('AvalanchePulse', 'fill-opacity', opacity)
            }
            pulseAva = setInterval(pulseMarker,70);

          map.addLayer({
            'id': 'Avalanche1',
            'type': 'line',
            'source':'Avalanche',
            'layout': {},
            'paint': {
            //  'fill-color': ['get', 'color'],
            //  'fill-opacity': ['get', 'fillOpacity'],
              'line-color': ['get', 'stroke'],
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                6,
                3
              ]
            },
            },lastSymbolId);
          map.on('render', stopSpinner);
          //console.log(pulseAva)
          var hoveredStateId = null;
          map.on('mousemove', 'Avalanche', function(e) {
          if (e.features.length > 0) {
            if (hoveredStateId) {
              map.setFeatureState(
                { source: 'Avalanche', id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = e.features[0].id;
              map.setFeatureState(
                { source: 'Avalanche', id: hoveredStateId },
                { hover: true }
              );
            }
          });

          map.on('mouseleave', 'Avalanche', function() {
            if (hoveredStateId) {
              map.setFeatureState(
                { source: 'Avalanche', id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = null;
          });

          map.on('mouseenter', 'Avalanche1', function() {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'Avalanche1', function() {
            map.getCanvas().style.cursor = '';
          });
          map.on('click', 'Avalanche', function(e) {
            new mapboxgl.Popup({maxWidth:'720px'})
              .setLngLat(e.lngLat)
              .setHTML('<div style="color:white;font-weight:bold;background:'+e.features[0].properties.color+';"><img height="50" src="'+avaDangerLev(e.features[0].properties.danger_level)+'">&nbsp;'+e.features[0].properties.name +' - '+ e.features[0].properties.danger.toUpperCase() +'</div><b>'+e.features[0].properties.center+'</b><br>'+e.features[0].properties.travel_advice+'<br><a href="" target="Popup" onclick="window.open(\''+e.features[0].properties.link+'\',\'popup\',\'width=900,height=800\'); return false;">Forecast</a></span>')
              .addTo(map);
          });
      }

      function avaDangerLev(num){
        switch(num){
          case -1: return 'https:\/\/nac-web-platforms.s3-us-west-1.amazonaws.com/assets/danger-icons/0.png'; break;
          case 1: return 'https:\/\/nac-web-platforms.s3-us-west-1.amazonaws.com/assets/danger-icons/1.png'; break;
          case 2: return 'https:\/\/nac-web-platforms.s3-us-west-1.amazonaws.com/assets/danger-icons/2.png'; break;
          case 3: return 'https:\/\/nac-web-platforms.s3-us-west-1.amazonaws.com/assets/danger-icons/3.png'; break;
          case 4: return 'https:\/\/nac-web-platforms.s3-us-west-1.amazonaws.com/assets/danger-icons/4.png'; break;
          case 5: return 'https:\/\/nac-web-platforms.s3-us-west-1.amazonaws.com/assets/danger-icons/5.png'; break;
          default: return 'https:\/\/nac-web-platforms.s3-us-west-1.amazonaws.com/assets/danger-icons/0.png';
        }
      }

      function removeAvalanche(){
        clearInterval(pulseAva)
        map.removeLayer('Avalanche')
        map.removeLayer('Avalanche1')
        map.removeLayer('AvalanchePulse')
        map.removeSource('Avalanche')
      }

      function addPWSD() {
        loadingSpinner(true);
        fetch(pwstimesURL)
          .then(res => res.json())
          .then(data => {
            var pwstime = data.products[614].time
        map.addSource('PWS', {
          type: 'vector',
          tiles: ['https:\/\/api.weather.com/v2/vector-api/products/614/features.mvt?x={x}&y={y}&lod=8&apiKey='+pwsKey+'&tile-size=512&time=' + pwstime[0] + '&time=' + pwstime[1] + '&time=' + pwstime[2] + '&time=' +
            pwstime[3] + '&time=' + pwstime[4] + '&stepped=true'
          ],
          tileSize: 512,
          minZoom: 2,
          maxZoom: 16,
        })

        for (var i = pwstime.length - 1; i >= 0; i--) {
          map.addLayer({
            "id": "PWSd-" + i,
            "type": "circle",
            "source": "PWS",
            "source-layer": pwstime[i],
            "filter": ["all", ["!=", "dewptf", -9999]],
            'paint': {
              'circle-radius': 13,
              'circle-color': {
                property: 'dewptf',
                stops: [
                  [-60, '#91003f'],
                  [-55, '#ce1256'],
                  [-50, '#e7298a'],
                  [-45, '#df65b0'],
                  [-40, '#ff73df'],
                  [-35, '#ffbee8'],
                  [-30, '#ffffff'],
                  [-25, '#dadaeb'],
                  [-20, '#bcbddc'],
                  [-15, '#9e9ac8'],
                  [-10, '#756bb1'],
                  [-5, '#54278f'],
                  [0, '#0d007d'],
                  [5, '#0d339c'],
                  [10, '#0066c2'],
                  [15, '#299eff'],
                  [20, '#4ac7ff'],
                  [25, '#73d7ff'],
                  [30, '#adffff'],
                  [35, '#30cfc2'],
                  [40, '#009996'],
                  [45, '#125757'],
                  [50, '#066d2c'],
                  [55, '#31a354'],
                  [60, '#74c476'],
                  [65, '#a1d99b'],
                  [70, '#d3ffbe'],
                  [75, '#ffffb3'],
                  [80, '#ffeda0'],
                  [85, '#fed176'],
                  [90, '#feae2a'],
                  [95, '#fd8d3c'],
                  [100, '#fc4e2a'],
                  [105, '#e31a1c'],
                  [110, '#b10026'],
                  [115, '#800026'],
                  [120, '#590042'],
                  [140, '#280028']
                ],
                default: 'rgba(255,255,255,0.0)',
              }
            }
          })

          map.addLayer({
            'id': 'PWSd' + i,
            'type': 'symbol',
            'source': 'PWS',
            'source-layer': pwstime[i],
            "filter": ["all", ["!=", "tempf", -9999]],
            'layout': {
              //'text-allow-overlap': true,
              'text-field': '{dewptf}',
              'text-font': [
                "Open Sans Condensed Bold",

              ],
              'text-size': 14,
            },
            'paint': {
              'text-color': {
                property: 'dewptf',
                stops: [
                  [-20, '#000'],
                  [-10.1, '#000'],
                  [-10, '#fff'],
                  [10, '#fff'],
                  [11, '#000'],
                  [39.9, '#000'],
                  [40, '#fff'],
                  [45, '#fff'],
                  [52, '#fff'],
                  [52.1, '#000'],
                  [55, '#000'],
                ],
                default: 'rgba(0,0,0,1.0)',
              }
            },
          })

        map.on('render', stopSpinner);
          map.on('click', 'PWSd' + i, function(e) {
            let shtml = '<span style="font-family:Open Sans;font-size:14px;"><b>'+e.features[0].properties.neighborhood+'<br>'+e.features[0].properties.id+'<br>' + moment(e.features[0].properties.validTime).format('MMMM Do YYYY, h:mm a') +'</b><br>'
                if (e.features[0].properties.tempf){
                  shtml += '<span style="font-family:Open Sans;font-size:13px;">Temperature: <b>' + e.features[0].properties.tempf + ' &deg;F</b><br>'
                }
                if (e.features[0].properties.dewptf){
                  shtml += 'Dewpoint: <b>' + e.features[0].properties.dewptf + ' &deg;F</b><br>'
                }
                if (e.features[0].properties.windspeedmph && e.features[0].properties.windspeedmph !== 0){
                  shtml += 'Wind: <b>' + e.features[0].properties.winddir +'&deg; at ' + e.features[0].properties.windspeedmph + ' mph</b><br>'
                }
                if (e.features[0].properties.windspeedmph === 0){
                  shtml += 'Wind: Calm <br>'
                }
                if (e.features[0].properties.windgustmph){
                  shtml += 'Gust: <b>' + e.features[0].properties.windgustmph + ' mph</b><br>'
                }
                if (e.features[0].properties.maxwindgust){
                  shtml += 'Max Gust: <b>' + e.features[0].properties.maxwindgust + ' mph</b><br>'
                }
                if (e.features[0].properties.dailyrainin){
                  shtml += 'Day Rain: <b>' + e.features[0].properties.dailyrainin + ' in</b><br>'
                }
                if (e.features[0].properties.softwaretype){
                  shtml += 'Software: <b>' + e.features[0].properties.softwaretype + '</b><br>'
                }
                shtml += '<a href="https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id +'" target="Popup" onclick="window.open(\'https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id + '\',\'popup\',\'width=900,height=800\'); return false;">More Information </a></span>'

            new mapboxgl.Popup({maxWidth:'400px'})
              .setLngLat(e.lngLat)
              .setHTML(shtml)
              .addTo(map);
          });

          map.on('mouseenter', 'PWSd' + i, function() {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'PWSd' + i, function() {
            map.getCanvas().style.cursor = '';
          })
        }
      })
    }

      function removePWSD() {
        for (var i = 0; i < 5; i++) {
          map.removeLayer('PWSd-' + i + '')
          map.removeLayer('PWSd' + i + '')
        }
        map.removeSource('PWS')
      }

      function addPWSG() {
        $('#GustLegend').show();
        var age = moment().subtract(5, 'minutes').valueOf()
        console.log(age)
        loadingSpinner(true);
        fetch(pwstimesURL)
          .then(res => res.json())
          .then(data => {
            var pwstime = data.products[614].time
        map.addSource('PWS', {
          type: 'vector',
          tiles: ['https:\/\/api.weather.com/v2/vector-api/products/614/features.mvt?x={x}&y={y}&lod=8&apiKey='+pwsKey+'&tile-size=512&time=' + pwstime[0] + '&time=' + pwstime[1] + '&time=' + pwstime[2] + '&time=' +
            pwstime[3] + '&time=' + pwstime[4] + '&stepped=true'
          ],
          tileSize: 512,
          minZoom: 2,
          maxZoom: 16,
        });

        for (var i = pwstime.length - 1; i >= 0; i--) {
          for (var b = 0; b < barbCutoffs.length - 1; b++) {
            if (barbCutoffs[b] == 3) {
              map.addLayer({
                'id': 'PWSBarbs' + b + '-' + i + '',
                'type': 'symbol',
                'filter': [
                  "all",
                  ['>=', 'windspeedmph', barbCutoffs[b]],
                  ['<', 'windspeedmph', barbCutoffs[b + 1]],
                  ['>', 'validTime', age]
                ],
                'source': 'PWS',
                'source-layer': pwstime[i],
                'paint': {
                  'icon-opacity': 1,
                },
                'layout': {
                  'icon-image': 'barb-5',
                  'icon-size': {
                    'base': 0.8,
                    'stops': [
                      [5, 0.0],
                      [7.5, 0.8],
                      [12, 1.5]
                    ]
                  },
                  'icon-allow-overlap': true,
                  'icon-rotation-alignment': 'map',
                  'icon-anchor': 'right',
                  'icon-offset': [0, -7],
                  'icon-rotate': {
                    'property': 'winddir',
                    'stops': [
                      [0, -270],
                      [360, 90]
                    ]
                  }
                }
              }, 'settlement-label');
            } else {
              console.log('PWSBarbs' + b + '-' + i + '');
              map.addLayer({
                'id': 'PWSBarbs' + b + '-' + i + '',
                'type': 'symbol',
                'filter': [
                  "all",
                  ['>=', 'windspeedmph', barbCutoffs[b]],
                  ['<', 'windspeedmph', barbCutoffs[b + 1]],
                  ['>', 'validTime', age]
                ],
                'source': 'PWS',
                'source-layer': pwstime[i],
                'paint': {
                  'icon-opacity': 1,
                },
                'layout': {
                  'icon-image': 'barb-' + barbCutoffs[b] + '',
                  'icon-size': {
                    'base': 0.8,
                    'stops': [
                      [5, 0.0],
                      [7.5, 0.8],
                      [12, 1.5]
                    ]
                  },
                  'icon-allow-overlap': true,
                  'icon-rotation-alignment': 'map',
                  'icon-anchor': 'right',
                  'icon-offset': [0, -7],
                  'icon-rotate': {
                    'property': 'winddir',
                    'stops': [
                      [0, -270],
                      [360, 90]
                    ]
                  },
                },
              }, 'settlement-label');
            }
          }
        }

        for (var i = 0; i < pwstime.length; i++) {
          map.addLayer({
            'id': 'PWSG-' + i,
            'type': 'circle',
            'source': 'PWS',
            'source-layer': pwstime[i],
            'paint': {
              'circle-radius': 13,
              'circle-color': {
                property: 'windgustmph',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [10, 'rgba(255,255,255,0.0)'],
                  [15, 'rgba(255,255,255,0.5)'],
                  [25, 'rgba(255,255,0,1.0)'],
                  [35, '#f70'],
                  [45, '#f00'],
                  //[55, '#700'],
                  [58, '#f0f'],
                ],
                default: 'rgba(255,255,255,0.0)',
              },
            },
            'filter': ['>', 'validTime', age]
          }, 'settlement-label');

          map.addLayer({
            'id': 'PWSG' + i,
            'type': 'symbol',
            'source': 'PWS',
            'source-layer': pwstime[i],
            'layout': {
              //'text-allow-overlap': true,
              'text-field': '{windgustmph}',
              'text-font': [
                "Open Sans Condensed Bold",

              ],
              'text-size': 18,
            },
            'paint': {
              'text-color': {
                property: 'windgustmph',
                stops: [
                  [0, 'rgba(255,255,255,0.0)'],
                  [10, 'rgba(255,255,255,0.0)'],
                  [10.1, 'rgba(255,255,255,1.0)'],
                  [15, 'rgba(255,255,255,1.0)'],
                  [25, 'rgba(255,255,0,1.0)'],
                  [35, '#f70'],
                  [45, '#f00'],
                  //[55, '#700'],
                  [58, '#f0f'],
                ],
                default: 'rgba(255,255,255,0.0)',
              },
              'text-halo-color': {
                property: 'windgustmph',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [10, 'rgba(0,0,0,0.0)'],
                  [10.1, 'rgba(0,0,0,1.0)'],
                  [15, 'rgba(0,0,0,1.0)'],
                  [25, 'rgba(0,0,0,1.0)'],
                  [30, 'rgba(0,0,0,1.0)'],
                  [40, 'rgba(0,0,0,1.0)'],
                 // [60, 'rgba(0,0,0,1.0)'],
                ],
                default: 'rgba(255,255,255,0.0)',
              },
              'text-halo-width': 1.5,
              'text-halo-blur': 0.5,
            },
            'filter': ['>', 'validTime', age]
            //  'filter':['==','$type','Point'],
          }, 'settlement-label')

          map.on('click', 'PWSG-' + i, function(e) {
            let shtml = '<span style="font-family:Open Sans;font-size:14px;"><b>'+e.features[0].properties.neighborhood+'<br>'+e.features[0].properties.id+'<br>' + moment(e.features[0].properties.validTime).format('MMMM Do YYYY, h:mm a') +'</b><br>'
                if (e.features[0].properties.tempf){
                  shtml += '<span style="font-family:Open Sans;font-size:13px;">Temperature: <b>' + e.features[0].properties.tempf + ' &deg;F</b><br>'
                }
                if (e.features[0].properties.dewptf){
                  shtml += 'Dewpoint: <b>' + e.features[0].properties.dewptf + ' &deg;F</b><br>'
                }
                if (e.features[0].properties.windspeedmph && e.features[0].properties.windspeedmph !== 0){
                  shtml += 'Wind: <b>' + e.features[0].properties.winddir +'&deg; at ' + e.features[0].properties.windspeedmph + ' mph</b><br>'
                }
                if (e.features[0].properties.windspeedmph === 0){
                  shtml += 'Wind: Calm <br>'
                }
                if (e.features[0].properties.windgustmph){
                  shtml += 'Gust: <b>' + e.features[0].properties.windgustmph + ' mph</b><br>'
                }
                if (e.features[0].properties.maxwindgust){
                  shtml += 'Max Gust: <b>' + e.features[0].properties.maxwindgust + ' mph</b><br>'
                }
                if (e.features[0].properties.dailyrainin){
                  shtml += 'Day Rain: <b>' + e.features[0].properties.dailyrainin + ' in</b><br>'
                }
                if (e.features[0].properties.softwaretype){
                  shtml += 'Software: <b>' + e.features[0].properties.softwaretype + '</b><br>'
                }
                shtml += '<a href="https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id +'" target="Popup" onclick="window.open(\'https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id + '\',\'popup\',\'width=900,height=800\'); return false;">More Information </a></span>'

            new mapboxgl.Popup({maxWidth:'400px'})
              .setLngLat(e.lngLat)
              .setHTML(shtml)
              .addTo(map);
          });
          }

          map.on('mouseenter', 'PWSG-' + i, function() {
            map.getCanvas().style.cursor = 'pointer';
          })

          map.on('mouseleave', 'PWSG-' + i, function() {
            map.getCanvas().style.cursor = '';
          })
        })
        map.on('render', stopSpinner);
      }

      function removePWSG() {
        $('#GustLegend').hide();
        for (var i = 3; i < 5; i++) {
          for (var b = 0; b < barbCutoffs.length - 1; b++) {
            map.removeLayer('PWSBarbs' + b + '-' + i + '')
          }
        }
        for (var i = 0; i < 5; i++) {
          map.removeLayer('PWSG' + i + '')
          map.removeLayer('PWSG-' + i + '')
        }
        map.removeSource('PWS')
      }

      function addGCW() {
        let layers = map.getStyle().layers;
        loadingSpinner(true);
        let firstSymbolId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        fetch('https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/Most_Recent_WSTGC/ImageServer?f=pjson')
        .then(res => res.json())
        .then(data => {

        map.addLayer({
          'id': 'GCW',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'GeoColor Updated: <b>'+ moment(data.timeInfo.timeExtent[1]).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.timeInfo.timeExtent[1]).fromNow() + '</b>',
            'tiles': [
              'https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/Most_Recent_WSTGC/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&size=512%2C512&imageSR=3857&time=&format=jpgpng&pixelType=U8&noData=&noDataInterpretation=esriNoDataMatchAny&interpolation=+RSP_BilinearInterpolation&compression=&compressionQuality=100&bandIds=&mosaicRule=&renderingRule=%7B%22rasterFunction%22%3A%22Stretch%22%2C%22rasterFunctionArguments%22%3A%7B%22StretchType%22%3A5%2C%22Statistics%22%3A%5B%5D%2C%22DRA%22%3Afalse%2C%22UseGamma%22%3Atrue%2C%22Gamma%22%3A%5B1.15%2C1.15%2C1.15%5D%2C%22ComputeGamma%22%3Afalse%7D%2C%22variableName%22%3A%22Raster%22%2C%22outputPixelType%22%3A%22U8%22%7D&f=image'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, firstSymbolId)
        map.on('render', stopSpinner)
      })
      }

      function removeGCW() {
        map.removeLayer('GCW')
        map.removeSource('GCW')
      }

      function addGFSPW() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'hillshade') {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        fetch('https:\/\/thredds.ucar.edu/thredds/wms/grib/NCEP/GFS/Global_0p25deg_ana/TP?item=layerDetails&layerName=Precipitable_water_entire_atmosphere_single_layer&request=GetMetadata')
        .then(res => res.json())
        .then(data => {
        map.addLayer({
          'id': 'GFSPW',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Valid: <b>' + moment(data.nearestTimeIso).format('MMMM Do YYYY, h:mm a')+'',
            'tiles': [
              'https:\/\/thredds.ucar.edu/thredds/wms/grib/NCEP/GFS/Global_0p25deg_ana/TP?LAYERS=Precipitable_water_entire_atmosphere_single_layer&ELEVATION=0&TIME='+data.nearestTimeIso+'&TRANSPARENT=true&STYLES=boxfill%2Foccam&COLORSCALERANGE=0%2C100&NUMCOLORBANDS=253&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512'

            ],
            'tileSize':512
          },
          'paint': {}
        }, firstSymbolId)

        map.on('render', stopSpinner);
        map.on('dblclick', function(e) {
          if (map.getSource('GFSPW') && map.isSourceLoaded('GFSPW')){
            var s = map.getBounds().getSouth().toFixed(2);
            var n = map.getBounds().getNorth().toFixed(2);
            var w = map.getBounds().getWest().toFixed(2);
            var es = map.getBounds().getEast().toFixed(2);
            var screenw = $( '#map' ).width();
            var screenh = $( '#map' ).height();
            //fetch('https:\/\/thredds-dev.unidata.ucar.edu/thredds/wms/grib/NCEP/GFS/Global_0p25deg_ana/TP?LAYERS=Precipitable_water_entire_atmosphere_single_layer&QUERY_LAYERS=Precipitable_water_entire_atmosphere_single_layer&STYLES=default-scalar%2Fdefault&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&BBOX='+w+','+s+','+es+','+n+'&FEATURE_COUNT=5&WIDTH='+screenw+'&HEIGHT='+screenh+'&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fxml&SRS=EPSG%3A4326&X='+e.point.x+'&Y='+e.point.y+'&TIME='+data.nearestTimeIso+'')
            fetch('https:\/\/thredds.ucar.edu/thredds/wms/grib/NCEP/GFS/Global_0p25deg_ana/TP?LAYERS=Precipitable_water_entire_atmosphere_single_layer&ELEVATION=0&TIME='+data.nearestTimeIso+'&TRANSPARENT=true&STYLES=boxfill%2Frainbow&COLORSCALERANGE=-50%2C50&NUMCOLORBANDS=20&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&SRS=EPSG%3A4326&BBOX='+w+','+s+','+es+','+n+'&X='+e.point.x+'&Y='+e.point.y+'&INFO_FORMAT=text%2Fxml&QUERY_LAYERS=Precipitable_water_entire_atmosphere_single_layer&WIDTH='+screenw+'&HEIGHT='+screenh+'')
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data1 => {
              var gridlon = data1.getElementsByTagName("gridCentreLon")[0].childNodes[0].nodeValue
              var gridlat = data1.getElementsByTagName("gridCentreLat")[0].childNodes[0].nodeValue
              var depth = Number(data1.getElementsByTagName("value")[0].childNodes[0].nodeValue*0.0393701).toFixed(2)
              new mapboxgl.Popup({maxWidth:'720px', closeButton:false})
              .setLngLat(e.lngLat)
              .setHTML(gridlat+','+gridlon+'<br>PW: <b>'+depth+'</b>"<br>')
              //.setHTML('PW: <b>'+depth+'</b>"<br><img src="https:\/\/thredds-dev.unidata.ucar.edu/thredds/wms/grib/NCEP/GFS/Global_0p25deg_ana/TP?REQUEST=GetTimeseries&LAYERS=Precipitable_water_entire_atmosphere_single_layer&QUERY_LAYERS=Precipitable_water_entire_atmosphere_single_layer&SRS=EPSG%3A4326&BBOX='+w+','+s+','+es+','+n+'&FEATURE_COUNT=5&WIDTH='+screenw+'&HEIGHT='+screenh+'&X='+e.point.x+'&Y='+e.point.y+'&STYLES=default/default&VERSION=1.1.1&TIME=2019-12-20T00:00:00.000Z/'+data.nearestTimeIso+'&INFO_FORMAT=image/png"></img>')
              .addTo(map)
            })

          }

        })
      })
       }

      function removeGFSPW() {
        map.removeLayer('GFSPW')
        map.removeSource('GFSPW')
      }


      function addSWIRLoop(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/thredds.ucar.edu/thredds/catalog/satellite/goes/west/grb/ABI/FullDisk/Channel07/current/catalog.html')
        .then(res => res.text())
          .then(data => {
            let allLines = data.split("\n");
            const reg = /s\d\d\d\d\d\d\d\d\d\d\d\d\d\d_e\d\d\d\d\d\d\d\d\d\d\d\d\d\d_c\d\d\d\d\d\d\d\d\d\d\d\d\d\d.nc/g;
            const reg2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/g;
            let match;
            let match2;
            let g17f = [];
            let g17t = [];
            while (match = reg.exec(allLines)) {
              g17f.push(match[1] || match[0]);
            }
            while (match2 = reg2.exec(allLines)) {
              g17t.push(match2[1] || match2[0]);
            }
            g17f = [...new Set(g17f)].slice(0,15).reverse()
            g17t = [...new Set(g17t)].slice(0,15).reverse()


            let timestamps = g17t
            hrtimestamps = timestamps.map(i => moment(i).format('lll'))
            var firstSymbolId;
            for (var i = 0; i < layers.length; i++) {
              if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
              }
            }
            for(var j = 0; j< hrtimestamps.length;j++){
              map.addLayer({
                'id': hrtimestamps[j],
                'type': 'raster',
                'source': {
                  'type': 'raster',
                  'scheme':'tms',
                  'tiles': [
                  `https:\/\/thredds.ucar.edu/thredds/wms/satellite/goes/west/grb/ABI/FullDisk/Channel07/current/OR_ABI-L1b-RadF-M6C07_G17_${g17f[j]}?LAYERS=Rad&ELEVATION=0&TIME=${g17t[j]}&TRANSPARENT=false&STYLES=boxfill/occam&COLORSCALERANGE=0.035,3.5&NUMCOLORBANDS=253&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512`
                  ],
                  'tileSize': 512,
                  //'maxZoom': 11.99,
                },
                'paint': {
                  "raster-opacity": 0,
                  'raster-opacity-transition': {
                    duration: 0
                  },
                  "raster-fade-duration": 0.0,
                }
              }, firstSymbolId)
            }
          })
          .then(()=>{
            map.on('render', stopSpinner);
            showFrame(-1)
          })
          .catch(error => window.alert("Problem Loading Data."))
        }

        function addWVLoop(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/thredds.ucar.edu/thredds/catalog/satellite/goes/west/grb/ABI/FullDisk/Channel09/current/catalog.html')
        .then(res => res.text())
          .then(data => {
            let allLines = data.split("\n");
            const reg = /s\d\d\d\d\d\d\d\d\d\d\d\d\d\d_e\d\d\d\d\d\d\d\d\d\d\d\d\d\d_c\d\d\d\d\d\d\d\d\d\d\d\d\d\d.nc/g;
            const reg2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/g;
            let match;
            let match2;
            let g17f = [];
            let g17t = [];
            while (match = reg.exec(allLines)) {
              g17f.push(match[1] || match[0]);
            }
            while (match2 = reg2.exec(allLines)) {
              g17t.push(match2[1] || match2[0]);
            }
            g17f = [...new Set(g17f)].slice(0,15).reverse()
            g17t = [...new Set(g17t)].slice(0,15).reverse()

            let timestamps = g17t
            hrtimestamps = timestamps.map(i => moment(i).format('lll'))
            var firstSymbolId;
            for (var i = 0; i < layers.length; i++) {
              if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
              }
            }
            for(var j = 0; j< hrtimestamps.length;j++){
              map.addLayer({
                'id': hrtimestamps[j],
                'type': 'raster',
                'source': {
                  'type': 'raster',
                  'scheme':'tms',
                  'tiles': [
                  `https:\/\/thredds.ucar.edu/thredds/wms/satellite/goes/west/grb/ABI/FullDisk/Channel09/current/OR_ABI-L1b-RadF-M6C09_G17_${g17f[j]}?LAYERS=Rad&ELEVATION=0&TIME=${g17t[j]}&TRANSPARENT=false&STYLES=boxfill/occam&COLORSCALERANGE=0.1,15&NUMCOLORBANDS=253&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512`
                  ],
                  'tileSize': 512,
                  //'maxZoom': 11.99,
                },
                'paint': {
                  "raster-opacity": 0,
                  'raster-opacity-transition': {
                    duration: 0
                  },
                  "raster-fade-duration": 0.0,
                }
              }, firstSymbolId)
            }
          })
          .then(()=>{
            map.on('render', stopSpinner);
            showFrame(-1)
          })
          .catch(error => window.alert("Problem Loading Data."))
        }

      function addVisLoop(){
        loopname = "Visible Satellite"
        var layers = map.getStyle().layers;
        loadingSpinner(true);

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/thredds.ucar.edu/thredds/catalog/satellite/goes/west/grb/ABI/FullDisk/Channel02/current/catalog.html')
        .then(res => res.text())
          .then(data => {
            let allLines = data.split("\n");
            const reg = /s\d\d\d\d\d\d\d\d\d\d\d\d\d\d_e\d\d\d\d\d\d\d\d\d\d\d\d\d\d_c\d\d\d\d\d\d\d\d\d\d\d\d\d\d.nc/g;
            const reg2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/g;
            let match;
            let match2;
            let g17f = [];
            let g17t = [];
            while (match = reg.exec(allLines)) {
              g17f.push(match[1] || match[0]);
            }
            while (match2 = reg2.exec(allLines)) {
              g17t.push(match2[1] || match2[0]);
            }
            g17f = [...new Set(g17f)].slice(0,15).reverse()
            g17t = [...new Set(g17t)].slice(0,15).reverse()

            let timestamps = g17t
            hrtimestamps = timestamps.map(i => moment(i).format('lll'))
            var firstSymbolId;
            for (var i = 0; i < layers.length; i++) {
              if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
              }
            }
            for(var j = 0; j< hrtimestamps.length;j++){
              map.addLayer({
                'id': hrtimestamps[j],
                'type': 'raster',
                'source': {
                  'type': 'raster',
                  'scheme':'tms',
                  'tiles': [
                  `https:\/\/thredds.ucar.edu/thredds/wms/satellite/goes/west/grb/ABI/FullDisk/Channel02/current/OR_ABI-L1b-RadF-M6C02_G17_${g17f[j]}?LAYERS=Rad&ELEVATION=0&TIME=${g17t[j]}&TRANSPARENT=false&STYLES=boxfill/greyscale&COLORSCALERANGE=6,600&NUMCOLORBANDS=253&LOGSCALE=true&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512`
                  ],
                  'tileSize': 512,
                  //'maxZoom': 11.99,
                },
                'paint': {
                  "raster-opacity": 0,
                  'raster-opacity-transition': {
                    duration: 0
                  },
                  "raster-fade-duration": 0.0,
                }
              }, firstSymbolId)
            }
          })
          .then(()=>{
            map.on('render', stopSpinner);
            showFrame(-1)
          })
          .catch(error => window.alert("Problem Loading Data."))
        }

        function addIRLoop(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/thredds.ucar.edu/thredds/catalog/satellite/goes/west/grb/ABI/FullDisk/Channel13/current/catalog.html')
        .then(res => res.text())
          .then(data => {
            let allLines = data.split("\n");
            const reg = /s\d\d\d\d\d\d\d\d\d\d\d\d\d\d_e\d\d\d\d\d\d\d\d\d\d\d\d\d\d_c\d\d\d\d\d\d\d\d\d\d\d\d\d\d.nc/g;
            const reg2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/g;
            let match;
            let match2;
            let g17f = [];
            let g17t = [];
            while (match = reg.exec(allLines)) {
              g17f.push(match[1] || match[0]);
            }
            while (match2 = reg2.exec(allLines)) {
              g17t.push(match2[1] || match2[0]);
            }
            g17f = [...new Set(g17f)].slice(0,15).reverse()
            g17t = [...new Set(g17t)].slice(0,15).reverse()

            let timestamps = g17t
            hrtimestamps = timestamps.map(i => moment(i).format('lll'))
            var firstSymbolId;
            for (var i = 0; i < layers.length; i++) {
              if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
              }
            }
            for(var j = 0; j< hrtimestamps.length;j++){
              map.addLayer({
                'id': hrtimestamps[j],
                'type': 'raster',
                'source': {
                  'type': 'raster',
                  'scheme':'tms',
                  'tiles': [
                  `https:\/\/thredds.ucar.edu/thredds/wms/satellite/goes/west/grb/ABI/FullDisk/Channel13/current/OR_ABI-L1b-RadF-M6C13_G17_${g17f[j]}?LAYERS=Rad&ELEVATION=0&TIME=${g17t[j]}&TRANSPARENT=false&STYLES=boxfill/occam&COLORSCALERANGE=0.1,160&NUMCOLORBANDS=253&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512`
                  ],
                  'tileSize': 512,
                  //'maxZoom': 11.99,
                },
                'paint': {
                  "raster-opacity": 0,
                  'raster-opacity-transition': {
                    duration: 0
                  },
                  "raster-fade-duration": 0.0,
                }
              }, firstSymbolId)
            }
          })
          .then(()=>{
            map.on('render', stopSpinner);
            showFrame(-1)
          })
          .catch(error => window.alert("Problem Loading Data."))
        }

        function addIRLoop2(color){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        if (color == 'NASA'){
          fragmentSource = `
            precision mediump float;
            varying vec2 vTexCoord;
            uniform sampler2D uTexture;

            vec3 firstColor = vec3(0.00,0.00,0.00);
            vec3 c1 = vec3(1.00,0.00,0.00);//red
            vec3 c2 = vec3(1.00,1.00,0.00);//yello
            vec3 c3 = vec3(0.00,1.00,0.00);//green
            vec3 c4 = vec3(0.00,0.00,0.00);
            vec3 c5 = vec3(0.00,0.22,1.00);
            vec3 c6 = vec3(1.00,1.00,1.00);
            vec3 endColor = vec3(0.01,0.01,0.01);
            float c1_pos = 0.07;
            float c2_pos = 0.18;
            float c3_pos = 0.25;
            float c4_pos = 0.45;
            float c5_pos = 0.71;
            float c6_pos = 0.85;

            vec3 custcolor_map(float st) {
              return mix(
                    mix(
                    mix(
                    mix(
                    mix(
                    mix(
                    mix(firstColor, c1, st/c1_pos),
                    mix(c1, c2, (st - c1_pos)/(c2_pos - c1_pos)),
                    step(c1_pos, st)),
                    mix(c2, c3, (st - c2_pos)/(c3_pos - c2_pos)),
                    step(c2_pos, st)),
                    mix(c3, c4, (st - c3_pos)/(c4_pos - c3_pos)),
                    step(c3_pos, st)),
                    mix(c4, c5, (st - c4_pos)/(c5_pos - c4_pos)),
                    step(c4_pos, st)),
                    mix(c5, c6, (st - c5_pos)/(c6_pos - c5_pos)),
                    step(c5_pos, st)),
                    mix(c6, endColor, (st - c6_pos)/(1.0 - c6_pos)),
                    step(c6_pos, st));
            }

                void main() {
                    vec4 color = texture2D(uTexture, vTexCoord);
                    gl_FragColor = vec4(pow(custcolor_map(color.r), vec3(1.0/2.2)), 1.0);
                }`

        }
        if (color == 'Pink' || color == 'Seahawk'){
          let grpnk;
          if (color == 'Pink'){
            grpnk = 'vec3(1.00,0.00,1.00)'
          }
          if (color == 'Seahawk'){
            grpnk = 'vec3(0.00,1.00,0.00)'
          }
          fragmentSource = `
            precision mediump float;
            varying vec2 vTexCoord;
            uniform sampler2D uTexture;
              vec3 firstColor = vec3(0.00,0.00,0.00);
              vec3 c1 = vec3(1.00,1.00,1.00);
              vec3 c2 = vec3(0.00,0.35,1.00);
              vec3 c3 = vec3(0.00,0.00,0.00);
              vec3 endColor = ${grpnk};
              float c1_pos = 0.40;
              float c2_pos = 0.60;
              float c3_pos = 0.80;

              vec3 custcolor_map(float st) {
                return mix(
                      mix(
                      mix(
                      mix(firstColor, c1, st/c1_pos),
                      mix(c1, c2, (st - c1_pos)/(c2_pos - c1_pos)),
                      step(c1_pos, st)),
                      mix(c2, c3, (st - c2_pos)/(c3_pos - c2_pos)),
                      step(c2_pos, st)),
                      mix(c3, endColor, (st - c3_pos)/(1.0 - c3_pos)),
                      step(c3_pos, st));
              }

            void main() {
                vec4 color = texture2D(uTexture, vTexCoord);
                gl_FragColor = vec4(pow(custcolor_map(color.r), vec3(1.0/2.2)), 1.0);
            }`
        }
        if (color == 'Turbo'){
          console.warn('turbo')
          fragmentSource = `
            precision mediump float;
            varying vec2 vTexCoord;
            uniform sampler2D uTexture;
            vec4 turbo_map(float x,float a) {
              const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
              const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
              const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
              const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
              const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
              const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973);

              x = clamp(x,0.0,1.0);
              vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
              vec2 v2 = v4.zw * v4.z;
              return vec4(
                dot(v4, kRedVec4)   + dot(v2, kRedVec2),
                dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
                dot(v4, kBlueVec4)  + dot(v2, kBlueVec2),
                a
              );
              }
              void main() {
                vec4 color = texture2D(uTexture, vTexCoord);
                gl_FragColor = turbo_map(1.0/1.0-color.r,color.a);
              }`
        }

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/thredds.ucar.edu/thredds/catalog/satellite/goes/west/grb/ABI/FullDisk/Channel13/current/catalog.html')
        .then(res => res.text())
          .then(data => {
            let tileurl;
            let allLines = data.split("\n");
            const reg = /s\d\d\d\d\d\d\d\d\d\d\d\d\d\d_e\d\d\d\d\d\d\d\d\d\d\d\d\d\d_c\d\d\d\d\d\d\d\d\d\d\d\d\d\d.nc/g;
            const reg2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/g;
            let match;
            let match2;
            let g17f = [];
            let g17t = [];
            while (match = reg.exec(allLines)) {
              g17f.push(match[1] || match[0]);
            }
            while (match2 = reg2.exec(allLines)) {
              g17t.push(match2[1] || match2[0]);
            }
            g17f = [...new Set(g17f)].slice(0,15).reverse()
            g17t = [...new Set(g17t)].slice(0,15).reverse()
            let timestamps = g17t
            irtimestamps = timestamps.map(i => moment(i).format('lll'))
            var firstSymbolId;
            for (var i = 0; i < layers.length; i++) {
              if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
              }
            }
            for(var j = 0; j< irtimestamps.length;j++){
              if (color == "NASA"){
              tileurl = `https:\/\/thredds.ucar.edu/thredds/wms/satellite/goes/west/grb/ABI/FullDisk/Channel13/current/OR_ABI-L1b-RadF-M6C13_G17_${g17f[j]}?LAYERS=Rad&ELEVATION=0&TIME=${g17t[j]}&TRANSPARENT=false&STYLES=boxfill%2Fgreyscale&COLORSCALERANGE=8,142&NUMCOLORBANDS=253&BELOWMINCOLOR=extend&ABOVEMAXCOLOR=extend&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512`
              }
              if (color == "Pink" || color=="Seahawk" || color=="Turbo"){
                tileurl = `https:\/\/thredds.ucar.edu/thredds/wms/satellite/goes/west/grb/ABI/FullDisk/Channel13/current/OR_ABI-L1b-RadF-M6C13_G17_${g17f[j]}?LAYERS=Rad&ELEVATION=0&TIME=${g17t[j]}&TRANSPARENT=false&STYLES=boxfill%2Fgreyscale&COLORSCALERANGE=10,125&NUMCOLORBANDS=253&BELOWMINCOLOR=extend&ABOVEMAXCOLOR=extend&LOGSCALE=true&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512`
              }
              let customlayer = new mapboxgl.TextureLayer(
                irtimestamps[j],
                {
                    type: 'raster',
                    tiles:[tileurl],
                },
                setupLayer,
                render
            );
            console.log(customlayer)
            map.addLayer(customlayer,firstSymbolId);
            }

          })
           .then(()=>{
             map.on('render', stopSpinner);
          })
          .catch(error => window.alert("Problem Loading Data."))
        }


      function addGCLoop(){
        window.alert("Resize window if you are making an animated GIF for twitter, otherwise cities will be tiny and filesize will be too big for 15mb limit.")
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        var currentImage = 0;
        loopname = "GOES 16/17 GeoColor"
        //fetch('https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/MERGEDGC_Last_24hr/ImageServer?f=pjson')
        fetch('https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/MERGEDGC_Last_24hr/ImageServer/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=&outFields=start_time,end_time&orderByFields=objectid%20DESC&outSR=102100&resultOffset=0&resultRecordCount=15')
          .then(res => res.json())
          //.then(data => addGCFrame(data.timeInfo.timeExtent[1]))
          .then(data => addGCFrame(data.features))
          .then(()=>{
            showFrame(0)
            loadingSpinner(false)})

        function addGCFrame(dx){
            console.log(dx)
            hrtimestamps=[];
            var timestamps= []
            for (let features in dx){
              timestamps.push([dx[features].attributes.start_time,dx[features].attributes.end_time])
            }
            // for (var i=300; i > 0; i-=10){
            //   timestamps.push(moment(dx).subtract(i,'minutes').valueOf())
            console.log(timestamps)
            // }

            //hrtimestamps = timestamps;
            hrtimestamps = timestamps.map(function(x){
              return moment(x[0]).format('lll')
            })
            hrtimestamps.reverse()
            timestamps.reverse()
            console.log(hrtimestamps)
            //hrtimestamps = hrtimestamps.map(i => moment(i).format('LT'))

          for(var j = 0; j< hrtimestamps.length;j++){
          map.addLayer({
            'id': hrtimestamps[j],
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                `https:\/\/satellitemaps.nesdis.noaa.gov/arcgis/rest/services/MERGEDGC_Last_24hr/ImageServer/exportImage?time=${timestamps[j][0]},${timestamps[j][1]}&bbox={bbox-epsg-3857}&format=jpg&compressionQuality=100&bboxSR=3857&size=512%2C512&imageSR=3857&renderingRule=%7B%22rasterFunction%22%3A%22Stretch%22%2C%22rasterFunctionArguments%22%3A%7B%22StretchType%22%3A5%2C%22Statistics%22%3A%5B%5D%2C%22DRA%22%3Afalse%2C%22UseGamma%22%3Atrue%2C%22Gamma%22%3A%5B1.15%2C1.15%2C1.15%5D%2C%22ComputeGamma%22%3Afalse%7D%2C%22variableName%22%3A%22Raster%22%2C%22outputPixelType%22%3A%22U8%22%7D&f=image`  //MERGEDGC_Last_24hr,WSTGC_Last_24hr
              ],
              'tileSize': 512,
              'maxZoom': 11.99,
            },
            'paint': {
              "raster-opacity": 0,
              'raster-opacity-transition': {
                duration: 0
              },
              "raster-fade-duration": 0.0,
            }
          }, firstSymbolId);
        }
      }

        //map.on('render', stopSpinner);

      }


      function addVis() {
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/thredds.ucar.edu/thredds/catalog/satellite/goes/west/grb/ABI/FullDisk/Channel02/current/catalog.html')
        .then(res => res.text())
          .then(data => {
            let allLines = data.split("\n");
            let l21 = allLines[21];
            let l23 = allLines[23];
            const reg = /s\d\d\d\d\d\d\d\d\d\d\d\d\d\d_e\d\d\d\d\d\d\d\d\d\d\d\d\d\d_c\d\d\d\d\d\d\d\d\d\d\d\d\d\d.nc/g;
            const reg2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/g;
            let match;
            let match2;
            let g17f = [];
            let g17t = [];
            while (match = reg.exec(allLines)) {
              g17f.push(match[1] || match[0]);
            }
            while (match2 = reg2.exec(allLines)) {
              g17t.push(match2[1] || match2[0]);
            }
            g17f = [...new Set(g17f)].slice(0,20).reverse()
            g17t = [...new Set(g17t)].slice(0,20).reverse()
            console.log(g17t, g17f);
            map.addLayer({
              'id': 'Vis',
              'type': 'raster',
              'source': {
                'type': 'raster',
                'attribution': 'GOES 17 Visible: <b>' + moment(g17t[0]).format('MMMM Do YYYY, h:mm a') + ' | ' + moment(g17t[0]).fromNow() + '</b>',
                'tiles': [
                  `https:\/\/thredds.ucar.edu/thredds/wms/satellite/goes/west/grb/ABI/FullDisk/Channel02/current/OR_ABI-L1b-RadF-M6C02_G17_${g17f[0]}?LAYERS=Rad&ELEVATION=0&TIME=${g17t[0]}&TRANSPARENT=true&STYLES=boxfill/greyscale&COLORSCALERANGE=2,500&NUMCOLORBANDS=100&LOGSCALE=true&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256`
                ],
                'tileSize': 256
              },
              'paint': {}
            }, firstSymbolId)
            map.on('render', stopSpinner)
          })

      }

      function removeVis() {
        map.removeLayer('Vis')
        map.removeSource('Vis')
      }

      function addPWSPrec(){
        loadingSpinner(true);
        fetch(pwstimesURL)
          .then(res => res.json())
          .then(data => {
            var pwstime = data.products[614].time
            if (map.getSource('PWS') && map.isSourceLoaded('PWS')) {
          console.log('PWS already loaded!');
        } else {
          map.addSource('PWS', {
            type: 'vector',
            tiles: ['https:\/\/api.weather.com/v2/vector-api/products/614/features.mvt?x={x}&y={y}&lod=8&apiKey='+pwsKey+'&tile-size=512&time=' + pwstime[0] + '&time=' + pwstime[1] + '&time=' + pwstime[2] + '&time=' +
              pwstime[3] + '&time=' + pwstime[4] + '&stepped=true'
            ],
            tileSize: 512,
            minZoom: 2,
            maxZoom: 16,
          });
        }

        for (var i = 0; i < pwstime.length; i++) {
          console.log(pwstime.length)
          console.log('PWSP'+i)
        map.addLayer({
          'id': 'PWSP'+i,
          'type': 'circle',
          'source': 'PWS',
          'source-layer': pwstime[i],
          'filter': ['all', ['!=', 'dailyrainin', -9999]],
          // 'layout':{
          //   'symbol-sort-key': ['get', 'dailyrainin'],
          // },
          'paint': {
            //'circle-stroke-width':1,
          //  'circle-stroke-color':'rgba(0,0,0,.5)',
            "circle-radius": [
                  "interpolate", ["linear"],
                    ["zoom"],
                    4, 6,
                    7, 12,
                   11, 18,
                   ],
            'circle-color': {
              property: 'dailyrainin',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.01, 'rgba(193,233,192,1.0)'],
                [0.1, 'rgba(161,217,155,1.0)'],
                [0.25, 'rgba(116,196,118,1.0)'],
                [0.50, 'rgba(49,163,83,1.0)'],
                [1.0, 'rgba(0,109,44,1.0)'],
                [1.5, 'rgba(255,250,138,1.0)'],
                [2.0, 'rgba(255,204,79,1.0)'],
                [3.0, 'rgba(254,141,60,1.0)'],
                [4.0, 'rgba(252,78,42,1.0)'],
                [6.0, 'rgba(214,26,28,1.0)'],
                [8.0, 'rgba(173,0,38,1.0)'],
                [10.0, 'rgba(112,0,38,1.0)'],
                [15.0, 'rgba(59,0,48,1.0)'],
                [20.0, 'rgba(255,0,255,1.0)'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
          },
          //'filter': ['==', '$type', 'Point'],
        }, 'settlement-label');

        map.addLayer({
          'id': 'PWSP1'+i,
          'type': 'symbol',
          'source': 'PWS',
          'source-layer': pwstime[i],
          "filter": ["all", ["!=", "dailyrainin", -9999]],
          'layout': {
            //'text-allow-overlap': true,
            'text-field': '{dailyrainin}',
            'symbol-sort-key': ['get', 'dailyrainin'],
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 14,
              7, 18,
              11, 22,
            ],
          },
          'paint': {
            'text-color': {
              property: 'dailyrainin',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.01, 'rgba(255,255,200,1.0)'],
              ],
              default: 'rgba(255,255,255,1.0)',
            },
            'text-halo-color': {
              property: 'dailyrainin',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.01, 'rgba(0,0,0,1.0)'],
              ],
              default: 'rgba(0,0,0,1.0)',
            },
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
          //'filter': ['==', '$type', 'Point'],
          //'filter': ['<', 'Precip', 40.0],
        }, 'settlement-label');
        //},);
        map.on('render', stopSpinner);
          map.on('click', 'PWSP' + i, function(e) {
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML('<span style="font-family:Open Sans;font-size:14px;"><b>'+e.features[0].properties.neighborhood+'<br>'+e.features[0].properties.id+'<br>' + moment(e.features[0].properties.validTime).format('MMMM Do YYYY, h:mm a') +'</b><br><span style="font-family:Open Sans;font-size:13px;">Temperature: <b>' + e.features[0].properties.tempf + ' &deg;F</b><br>Dewpoint: <b>' + e.features[0].properties.dewptf + ' &deg;F</b><br>Wind: <b>' + e.features[0].properties.winddir +
                '&deg; at ' + e.features[0].properties.windspeedmph + ' mph</b><br>Gust: <b>' + e.features[0].properties.windgustmph + ' mph</b><br>Max Gust: <b>' + e.features[0].properties.maxwindgust + ' mph</b><br>Day Rain: <b>' + e.features[0].properties
                .dailyrainin + ' in</b><br>Software: <b>' + e.features[0].properties.softwaretype + '</b><br><a href="https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id +
                '" target="Popup" onclick="window.open(\'https:\/\/www.wunderground.com/dashboard/pws/' + e.features[0].properties.id + '\',\'popup\',\'width=900,height=800\'); return false;">More Information </a></span>')
              .addTo(map);
          });

          map.on('mouseenter', 'PWSP' + i, function() {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'PWSP' + i, function() {
            map.getCanvas().style.cursor = '';
          });
      }
          })

    }

      function removePWSPrec(){
        for (var i = 0; i < 5; i++) {
          map.removeLayer('PWSP1'+i)
          map.removeLayer('PWSP'+i)
        }
        map.removeSource('PWS')
      }

      function removeMWStats(x){
        map.removeLayer(x)
        //map.removeLayer(`${x}1`)
        map.removeSource(`MWStats${x}`)
      }

      function addMWStats(x,hr,dens,mesoNetwork,vtime,circleopt) {
        loadingSpinner(true);
        let endhr = moment.utc(vtime).subtract(hr,'hours').format('YYYYMMDDHHmm')
        let sthr = moment.utc(vtime).format('YYYYMMDDHHmm')
        if (x === 'gust'){
          vars = 'wind_gust'
          a = 'mxg'
        }
        if (x === 'max' || x === 'min'){
          vars = 'air_temp'
          if (x === 'max'){
            a = 'mxt'
          }
          else{
            a = 'mnt'
          }
        }
        //loadingSpinner(true);
        var obsImportance = "1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210"
        var s = map.getBounds().getSouth().toFixed(2);
        var n = map.getBounds().getNorth().toFixed(2);
        var w = map.getBounds().getWest().toFixed(2);
        var e = map.getBounds().getEast().toFixed(2);

        var geojson = {
          type: "FeatureCollection",
          features: [],
        };

        fetch(`https:\/\/api.synopticdata.com/v2/stations/statistics?&token=${mesoToken}&output=json&vars=${vars}&start=${endhr}&end=${sthr}&status=active&bbox=${w},${s},${e},${n}&hfmetars=0&show_empty_stations=false&units=english,speed|mph&stid=${mesoExclude}&network=${mesoNetwork}&networkimportance=${obsImportance}&height=${screenh}&width=${screenw}&spacing=${dens}&type=all&output=json`)
          .then(res => res.json())
          .then(data => {
            data.STATION.forEach(function(d) {
              if (x === 'gust'){
                if (d.STATISTICS.wind_gust_set_1){
                geojson.features.push({
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [Number(d.LONGITUDE), Number(d.LATITUDE)]
                    },
                    "properties": {
                        "name": d.NAME,
                        "stid": d.STID,
                        "Gust": d.STATISTICS.wind_gust_set_1.maximum,
                        "GustT": d.STATISTICS.wind_gust_set_1.maxtime,
                        }
                  })
                }
              }
              if (x === 'max' || x === 'min'){
                if (d.STATISTICS.air_temp_set_1){
                geojson.features.push({
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [Number(d.LONGITUDE), Number(d.LATITUDE)]
                    },
                    "properties": {
                        "name": d.NAME,
                        "stid": d.STID,
                        "max": d.STATISTICS.air_temp_set_1.maximum,
                        "maxT": d.STATISTICS.air_temp_set_1.maxtime,
                        "min": d.STATISTICS.air_temp_set_1.minimum,
                        "minT": d.STATISTICS.air_temp_set_1.mintime,
                        }
                  })
                }
              }
            })
          }
          )

            .then(() => {
              map.addSource(`MWStats${x}`, {
                type: 'geojson',
                data: geojson,
                attribution: 'Updated: '+moment().format('MMMM Do YYYY, h:mm a'),
              });

              if (x === 'gust'){
                // map.addLayer({
                //   'id': `${x}1`,
                //   'type': 'circle',
                //   'source': `MWStats${x}`,
                //   'layout':{
                //         'circle-sort-key': ['get', 'Gust'],
                //       },
                //   'paint': {
                //     'circle-radius': [
                //       "interpolate", ["linear"],
                //       ["zoom"],
                //       4, 10,
                //       7, 14,
                //       11, 20,
                //     ],
                //     'circle-color': {
                //       property: 'Gust',
                //       stops: [
                //         [0, 'rgba(255,255,255,0.0)'],
                //         [10, 'rgba(255,255,255,0.0)'],
                //         [15, 'rgba(255,255,255,0.0)'],
                //         [25, 'rgba(255,255,0,1.0)'],
                //         [35, '#f70'],
                //         [45, '#f00'],
                //       // [55, '#f09'],
                //         [58, '#f0f'],
                //       ],
                //       default: 'rgba(255,255,255,0.0)',
                //     },
                //     'circle-blur': 0.4,
                //   },
                // //  'filter': ['==', '$type', 'Point'],
                // //  'filter': ['>=', 'wind_gust', 25],
                // }, 'settlement-label');

                map.addLayer({
                  'id': x,
                  'type': 'symbol',
                  'source': `MWStats${x}`,
                  'layout': {
                    //'symbol-sort-key': ['-',['to-number', ['get', 'wind_gust']]], //false
                    'symbol-sort-key': ['get', 'Gust'],
                    'text-allow-overlap': true,
                    'text-field': ['number-format', ['get', 'Gust'], {
                      'min-fraction-digits': 0,
                      'max-fraction-digits': 0.1
                    }],
                    'text-font': [
                      "Lato Black",
                      "Ubuntu Bold",
                      "Open Sans Condensed Bold",
                      "Arial Unicode MS Bold"
                    ],
                    'text-size': [
                      "interpolate", ["linear"],
                      ["zoom"],
                      4, 22,
                      8, 28,
                      12, 42,
                    ],
                  },
                  'paint': {
                    'text-color': {
                      property: 'Gust',
                      stops: [
                        [0, 'rgba(255,255,255,0.0)'],
                        [10, 'rgba(255,255,255,0.0)'],
                        [14.9, 'rgba(255,255,255,0)'],
                        [14.99, 'rgba(255,255,255,1.0)'],
                        [25, 'rgba(255,255,0,1.0)'],
                        [35, '#f70'],
                        [45, '#f00'],
                        [55, '#f09'],
                        [60, '#f0f'],
                      ],
                      default: 'rgba(255,255,255,0.0)',
                    },
                    'text-halo-color': {
                      property: 'Gust',
                      stops: [
                        [0, 'rgba(0,0,0,0.0)'],
                        [10, 'rgba(0,0,0,0.0)'],
                        [14.9, 'rgba(0,0,0,0.0)'],
                        [14.99, 'rgba(0,0,0,1.0)'],
                        [25, 'rgba(0,0,0,1.0)'],
                        [30, 'rgba(0,0,0,1.0)'],
                        [40, 'rgba(0,0,0,1.0)'],
                        [60, 'rgba(0,0,0,1.0)'],
                      ],
                      default: 'rgba(0,0,0,0.0)',
                    },
                    'text-halo-width': 1,
                    'text-halo-blur': 0.5,
                  },
                  //'filter': ['==', '$type', 'Point'],
                  //'filter': ['>=', 'wind_gust', 20],
                }, 'settlement-label')
              }
              if (x === 'max' || x === 'min'){
                // map.addLayer({
                //   'id': `${x}1`,
                //   'type': 'circle',
                //   'source': `MWStats${x}`,
                //   'paint': {
                //     "circle-radius": [
                //       "interpolate", ["linear"],
                //       ["zoom"],
                //       4, 10,
                //       7, 14,
                //       11, 20,
                //     ],
                //     'circle-color': {
                //       property: x,
                //       stops: [
                //         [-60, '#91003f'],
                //         [-55, '#ce1256'],
                //         [-50, '#e7298a'],
                //         [-45, '#df65b0'],
                //         [-40, '#ff73df'],
                //         [-35, '#ffbee8'],
                //         [-30, '#ffffff'],
                //         [-25, '#dadaeb'],
                //         [-20, '#bcbddc'],
                //         [-15, '#9e9ac8'],
                //         [-10, '#756bb1'],
                //         [-5, '#54278f'],
                //         [0, '#0d007d'],
                //         [5, '#0d339c'],
                //         [10, '#0066c2'],
                //         [15, '#299eff'],
                //         [20, '#4ac7ff'],
                //         [25, '#73d7ff'],
                //         [30, '#adffff'],
                //         [35, '#30cfc2'],
                //         [40, '#009996'],
                //         [45, '#125757'],
                //         [50, '#066d2c'],
                //         [55, '#31a354'],
                //         [60, '#74c476'],
                //         [65, '#a1d99b'],
                //         [70, '#d3ffbe'],
                //         [75, '#ffffb3'],
                //         [80, '#ffeda0'],
                //         [85, '#fed176'],
                //         [90, '#feae2a'],
                //         [95, '#fd8d3c'],
                //         [100, '#fc4e2a'],
                //         [105, '#e31a1c'],
                //         [110, '#b10026'],
                //         [115, '#800026'],
                //         [120, '#590042'],
                //         [140, '#280028']
                //       ],
                //       default: 'rgba(255,255,255,0.0)',
                //     },
                //     'circle-blur': 0.4,
                //   },
                //   'filter': ['==', '$type', 'Point'],
                // }, 'settlement-label');

        map.addLayer({
          'id': x,
          'type': 'symbol',
          'source': `MWStats${x}`,
          'layout': {
            'text-allow-overlap': true,
            "symbol-sort-key": ["get", x],
            'text-field': ['number-format', ['get', x], {
              'min-fraction-digits': 0,
              'max-fraction-digits': 0.1
            }],
            'text-font': [
              //"Ubuntu Bold",
              "Lato Black",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 22,
              8, 28,
              12, 42,
            ],
          },
          'paint': {
            'text-color': {
              property: x,
              stops: [
                [-60,'rgba(145,0,63,1)'],
                [-55,'rgba(206,18,86,1)'],
                [-50,'#e7298a'],
                [-45,'#df65b0'],
                [-40,'#ff73df'],
                [-35,'#ffbee8'],
                [-30,'#ffffff'],
                [-25,'#dadaeb'],
                [-20,'#bcbddc'],
                [-15,'#9e9ac8'],
                [-10,'#756bb1'],
                [-5,'#54278f'],
                [0,'#0d007d'],
                [5,'#0d339c'],
                [10,'#0066c2'],
                [15,'#299eff'],
                [20,'#4ac7ff'],
                [25,'#73d7ff'],
                [30,'rgba(48,207,194,1)'],
                [35,'rgba(0,153,150,1)'],
                [40,'rgba(18,87,87,1)'],
                [45,'rgba(6,109,44,1)'],
                [50,'rgba(49,163,84,1)'], //066d2c
                [55,'rgba(116,196,118,1)'],
                [60,'rgba(161,217,155,1)'],
                [65,'rgba(211,255,190,1)'],
                [70,'rgba(255,255,179,1)'],
                [75,'rgba(255,237,160,1)'],
                [80,'rgba(254,209,118,1)'],
                [85,'rgba(254,174,42,1)'],
                [90,'rgba(253,141,60,1)'],
                [95,'rgba(252,78,42,1)'],
                [100,'rgba(227,26,28,1)'],
                [105,'rgba(177,0,38,1)'],
                [110,'rgba(128,0,38,1)'],
                [115,'rgba(89,0,66,1)'],
                [120,'rgba(40,0,40,1)'],
              ],
              default:'rgba(255,255,255,0.0)',
            },
            //'text-color': 'rgba(255,255,255,1)',
            'text-halo-color':[
                'step',
                ['get', x ],
                  'rgba(0,0,0,0.0)',
                    -60, 'rgba(0,0,0,0.0)',
                    -55, 'rgba(0,0,0,1.0)',
                    -50, 'rgba(0,0,0,1.0)',
                    -45, 'rgba(0,0,0,1.0)',
                    -40, 'rgba(0,0,0,1.0)',
                    -35, 'rgba(0,0,0,1.0)',
                    -30, 'rgba(0,0,0,1.0)',
                    -25, 'rgba(0,0,0,1.0)',
                    -20, 'rgba(0,0,0,1.0)',
                    -15, 'rgba(0,0,0,1.0)',
                    -10, 'rgba(0,0,0,0.0)',
                    -5, 'rgba(0,0,0,0.0)',
                    0, 'rgba(0,0,0,0.0)',
                    5, 'rgba(0,0,0,0.0)',
                    10, 'rgba(0,0,0,1.0)',
                    15, 'rgba(0,0,0,1.0)',
                    20, 'rgba(0,0,0,1.0)',
                    25, 'rgba(0,0,0,1.0)',
                    30, 'rgba(0,0,0,1.0)',
                    35, 'rgba(0,0,0,1.0)',
                    42, 'rgba(0,0,0,1)',
                    50, 'rgba(0,0,0,1)',
                    55, 'rgba(0,0,0,1.0)',
                    60, 'rgba(0,0,0,1.0)',
                    65, 'rgba(0,0,0,1.0)',
                    70, 'rgba(0,0,0,1.0)',
                    75, 'rgba(0,0,0,1.0)',
                    80, 'rgba(0,0,0,1.0)',
                    85, 'rgba(0,0,0,1.0)',
                    90, 'rgba(0,0,0,1.0)',
                    95, 'rgba(0,0,0,1.0)',
                    100, 'rgba(0,0,0,1.0)',
                    105, 'rgba(0,0,0,1.0)',
                    110, 'rgba(255,0,0,0.9)',
                    115, 'rgba(255,0,0,0.9)',
                    120, 'rgba(255,0,0,0.9)',
                    140, 'rgba(255,0,0,0.9)'
                  ],
            'text-halo-width': 0.8,
            'text-halo-blur': 0.2,
          },
          'filter': ['==', '$type', 'Point'],
        }, 'settlement-label');
            }
            map.on('render', stopSpinner);
            map.on('click', x, function(e) {
              shtml = `<div class="popup-header">${e.features[0].properties.name}</div>`
              console.log(e.features[0].properties.max)
              if (e.features[0].properties.max){
                shtml += `Max Temp: <b>${e.features[0].properties.max}</b> at ${moment(e.features[0].properties.maxT).format('LT')}<br>`
              }
              if (e.features[0].properties.min){
                shtml += `<br>Min Temp: <b>${e.features[0].properties.min}</b> at ${moment(e.features[0].properties.minT).format('LT')}<br>`
              }
              if (e.features[0].properties.Gust){
                shtml += `<br>Max Gust: <b>${e.features[0].properties.Gust} mph</b> at ${moment(e.features[0].properties.GustT).format('LT')}<br>`
              }
              shtml += `<a href="https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0].properties.stid}" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0]
                  .properties.stid},\'popup\',\'width=900,height=800\'); return false;">3-Day History</a>`
              new mapboxgl.Popup({maxWidth:'400px'})
                .setLngLat(e.lngLat)
                .setHTML(shtml)
                .addTo(map);
            });

            var ar = ["all"];
            map.on('dblclick',x,function(e){
              var stid = e.features[0].properties.stid;
              var stn = ['!=', 'stid', e.features[0].properties.stid];

              ar.push(stn);
              console.table(ar);
              map.setFilter(x, ar
              );

              map.setFilter(x, ar
              );
            });

            map.on('mouseenter', x, function() {
              map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', x, function() {
              map.getCanvas().style.cursor = '';
            });

            })
            .catch(error=>{
              $(`.${a}_toggle input.cmn-toggle`).not(this).prop('checked', false)
              loadingSpinner(false);
              window.alert("Mesowest Error: Try a shorter span, zooming in, or using less density. Too many stations and too much time for mesowest to sort through.")
            })
      }



      function addPrecip(hr,dens,mesoNetwork,vtime) {
        loadingSpinner(true);
        let obsImportance = "1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210",
        s = map.getBounds().getSouth().toFixed(2),
        n = map.getBounds().getNorth().toFixed(2),
        w = map.getBounds().getWest().toFixed(2),
        e = map.getBounds().getEast().toFixed(2),
        sthr = moment.utc(vtime).subtract(hr,'Hours').format('YYYYMMDDHHmm'),
        enhr = moment.utc(vtime).format('YYYYMMDDHHmm'),
        precipgeojson = {
          type: "FeatureCollection",
          features: [],
        }

        fetch(`https:\/\/api.synopticdata.com/v2/stations/precip?&token=${mesoToken}&start=${sthr}&end=${enhr}&within=60&output=json&status=active&bbox=${w},${s},${e},${n}&hfmetars=0&show_empty_stations=false&units=precip|in&stid=${mesoExclude}&network=${mesoNetwork}&networkimportance=${obsImportance}&height=${screenh}&width=${screenw}&spacing=${dens}`)
          .then(res => res.json())
          .then(data => data.STATION.forEach(function(d) {
              precipgeojson.features.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [Number(d.LONGITUDE), Number(d.LATITUDE)]
                },
                "properties": {
                  "name": d.NAME,
                  "stid": d.STID,
                  "Precip": Math.round( ( d.OBSERVATIONS?.total_precip_value_1 + Number.EPSILON ) * 100 ) / 100,
                  "st": d.OBSERVATIONS?.ob_start_time_1,
                  "lt": d.OBSERVATIONS?.ob_end_time_1,
                  //"ach": d.OBSERVATIONS.count_1,
                  }
              })

            })
          )
            .then(() => addP())

        function addP(){
        map.addSource('Precip', {
          type: 'geojson',
          data: precipgeojson,
          attribution: 'Updated: '+moment().format('MMMM Do YYYY, h:mm a'),
        });

        // map.addLayer({
        //   'id': 'Precip1',
        //   'type': 'circle',
        //   'source': 'Precip',
        //   'attribution': 'Synoptic Data',
        //   "layout":{
        //       'circle-sort-key': ['to-number', ['get', 'Precip']],
        //     },
        //   'paint': {
        //     "circle-radius": [
        //           "interpolate", ["linear"],
        //             ["zoom"],
        //             4, 6,
        //             7, 12,
        //            11, 18,
        //            ],
        //     //'circle-blur': 0.4,
        //     //'circle-stroke-width':1,
        //     //'circle-stroke-color':'rgba(0,0,0,.5)',
        //     'circle-color': {
        //       property: 'Precip',
        //       stops: [
        //         [0, 'rgba(0,0,0,0.0)'],
        //         [0.01, 'rgba(193,233,192,1.0)'],
        //         [0.1, 'rgba(161,217,155,1.0)'],
        //         [0.25, 'rgba(116,196,118,1.0)'],
        //         [0.50, 'rgba(49,163,83,1.0)'],
        //         [1.0, 'rgba(0,109,44,1.0)'],
        //         [1.5, 'rgba(255,250,138,1.0)'],
        //         [2.0, 'rgba(255,204,79,1.0)'],
        //         [3.0, 'rgba(254,141,60,1.0)'],
        //         [4.0, 'rgba(252,78,42,1.0)'],
        //         [6.0, 'rgba(214,26,28,1.0)'],
        //         [8.0, 'rgba(173,0,38,1.0)'],
        //         [10.0, 'rgba(112,0,38,1.0)'],
        //         [15.0, 'rgba(59,0,48,1.0)'],
        //         [20.0, 'rgba(255,0,255,1.0)'],
        //       ],
        //       default: 'rgba(255,255,255,0.0)',
        //     },
        //   },
        //   'filter': ['==', '$type', 'Point'],
        // }, 'settlement-label');

        map.addLayer({
          'id': 'Precip',
          'type': 'symbol',
          'source': 'Precip',
          'attribution': 'Synoptic Data',
          'layout': {
            'text-allow-overlap': true,
            'symbol-sort-key': ['to-number', ['get', 'Precip']],
            'text-field': ['number-format', ['get', 'Precip'], {
              'min-fraction-digits': 2,
              'max-fraction-digits': 2,
            }],
            'text-font': [
              "Lato Black",
              "Source Sans Pro Black",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 12,
              7,20,
              12, 42,
            ],
          },
          'paint': {
            'text-color': {
              property: 'Precip',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.01, 'rgba(193,233,192,1.0)'],
                [0.1, 'rgba(161,217,155,1.0)'],
                [0.25, 'rgba(116,196,118,1.0)'],
                [0.50, 'rgba(49,163,83,1.0)'],
                [1.0, 'rgba(0,109,44,1.0)'],
                [1.5, 'rgba(255,250,138,1.0)'],
                [2.0, 'rgba(255,204,79,1.0)'],
                [3.0, 'rgba(254,141,60,1.0)'],
                [4.0, 'rgba(252,78,42,1.0)'],
                [6.0, 'rgba(214,26,28,1.0)'],
                [8.0, 'rgba(173,0,38,1.0)'],
                [10.0, 'rgba(112,0,38,1.0)'],
                [15.0, 'rgba(59,0,48,1.0)'],
                [20.0, 'rgba(255,0,255,1.0)'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
            'text-halo-color': {
              property: 'Precip',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.01, 'rgba(0,0,0,1.0)'],
              ],
              default: 'rgba(0,0,0,1.0)',
            },
            'text-halo-width': 1,
            'text-halo-blur': 0.0,
          },
          //'filter': ['==', '$type', 'Point'],
          //'filter': ['<', 'Precip', 40.0],
        }, 'settlement-label');

        map.on('render', stopSpinner);
        map.on('click', 'Precip', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div class="popup-header">${e.features[0].properties.name}</div>
            Precip Total: <b>${e.features[0].properties.Precip}"</b><br>
            Valid from: ${moment(e.features[0].properties.st).format('lll')} to ${moment(e.features[0].properties.lt).format('lll')}<br>
            <a href="https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0].properties.stid}" target="Popup" onclick="window.open('https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0]
              .properties.stid}','popup','width=900,height=800'); return false;">3-Day History</a></span>`)
            .addTo(map);
        });

        var ar = ["all"];
        map.on('dblclick','Precip',function(e){
          var stid = e.features[0].properties.stid;
          var stn = ['!=', 'stid', e.features[0].properties.stid];

          ar.push(stn);
          console.table(ar);
          // map.setFilter('Precip1', ar
          // );

          map.setFilter('Precip', ar
          );
        });

        map.on('mouseenter', 'Precip', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Precip', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      }

      function removePrecip() {
        map.removeLayer('Precip')
        //map.removeLayer('Precip1')
        map.removeSource('Precip')
      }

      function addStrava(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': 'Strava',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': '© 2018 Strava',
            'tiles': [
              'https:\/\/heatmap-external-a.strava.com/tiles/all/bluered/{z}/{x}/{y}.png'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, firstSymbolId)
        map.on('render', stopSpinner)
      }
      function removeStrava(){
        map.removeLayer('Strava')
        map.removeSource('Strava')
      }

      function addInciWeb(){
        loadingSpinner(true);

        var incigeojson = {
          type: "FeatureCollection",
          features: [],
        }

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/inciweb.nwcg.gov/feeds/json/esri/')
          .then(res => res.json())
          .then(data => data.markers.forEach(function(d) {
            if (d.type === 'Wildfire'){
            updated = moment(d.updated+'-0500')
            incigeojson.features.push({
             "type": "Feature",
             "geometry": {
               "type": "Point",
               "coordinates": [Number(d.lng), Number(d.lat)]
            },
            "properties": {
                "name": d.name,
                "summary": d.summary,
                "size": parseFloat(d.size.replace(',','')),
                "updated": updated,
                "age": moment().diff(updated, 'hours'),
                "url": d.url,
                "con": Number(d.contained||null)
                }
        })
            }
        })
      )
        .then(console.log(incigeojson))
        .then(()=> addIW())

        function addIW(){
           map.addSource('Inciweb', {
          type: 'geojson',
          data: incigeojson,
        })

        map.addLayer({
          'id': 'Inciweb',
          'type': 'symbol',
          'source': 'Inciweb',
          'layout': {
            'icon-image': 'FireIcon',
            'icon-size': [
              'step',
              ["to-number", ["get", "size"]],
              0.04,
              1, 0.05,
              100, 0.065,
              1000, 0.08,
              10000, 0.095,
              100000, 0.11,
              1000000, 0.22,
            ],
            'icon-allow-overlap': true,
          },
          'paint': {
          },

          'filter': ['<=', 'age', 144],
        })
        map.addLayer({
          'id': 'Inciweb1',
          'type': 'symbol',
          'source': 'Inciweb',
          'minzoom':6,
          'layout': {
            'text-field': ['string', ['get', 'name']],
            'text-font': [
              "Open Sans Condensed Bold",
            ],
            'text-size': 17,
            'text-offset': [0, 1],
            'text-allow-overlap': false,
            "symbol-sort-key": ["to-number", ["get", "size"]],
          },
          'paint': {
            'text-halo-color': 'rgba(200,0,0,1)',
            'text-halo-width': 1.5,
            'text-halo-blur':0.5,
            'text-color': 'rgba(255,255,255,1.0)'
          },
          'filter': ['<=', 'age', 144],
        })
      }

        map.on('render', stopSpinner);
        map.on('click', 'Inciweb', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.name + '</div><br>Updated: <b>' + moment(e.features[0].properties.updated).format('MMMM Do YYYY, h:mm a') + '<br>' + moment(e.features[0].properties.updated).fromNow() + '</b><br>Contained: <b>'+e.features[0].properties.con + '%</b><br>Size: <b>'+ e.features[0].properties.size +' acres<br><a href="https:\/\/inciweb.nwcg.gov/' + e.features[0].properties.url + '" target="Popup" onclick="window.open(\'https:\/\/inciweb.nwcg.gov' + e.features[0].properties.url + '\',\'popup\',\'width=900,height=900\'); return false;">Incident Page</a></b>')
            .addTo(map);
        });

        map.on('mouseenter', 'Inciweb', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Inciweb', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function addInterra(){
        loadingSpinner(true);

        var firegeojson = {
          type: "FeatureCollection",
          features: [],
        }

        let interra

        fetch(`https:\/\/api.allorigins.win/get?url=${encodeURIComponent('https:\/\/maps.nwcg.gov/sa/publicData.json')}`)
          .then(response => response.json())
          .then(data => interra = JSON.parse(data.contents))
          .then(()=>{

            interra[0].layerConfigs[2].featureCollection.featureSet.features.forEach(function(d) {
              firegeojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [d.geometry.x,d.geometry.y])
              },
              "properties": {
                  "name": d.attributes.Name,
                  "inctype": d.attributes.IncidentTypeCategory,
                  "cause":d.attributes.FireCause,
                  "IncidentManagementOrganization": d.attributes.IncidentManagementOrganization,
                  "size": d.attributes.DailyAcres,
                  "updated": d.attributes.ModifiedOnDateTime,
                  "con":d.attributes.PercentContained,
                  "type":"Emerging<24"
                  }
                })
              })
              interra[0].layerConfigs[3].featureCollection.featureSet.features.forEach(function(d) {
              firegeojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [d.geometry.x,d.geometry.y])
              },
              "properties": {
                  "name": d.attributes.Name,
                  "inctype": d.attributes.IncidentTypeCategory,
                  "cause":d.attributes.FireCause,
                  "IncidentManagementOrganization": d.attributes.IncidentManagementOrganization,
                  "size": d.attributes.DailyAcres,
                  "updated": d.attributes.ModifiedOnDateTime,
                  "con":d.attributes.PercentContained,
                  "type":"Emerging>24"
                  }
                })
              })

          }
      )
        .then(()=> {
          console.log(firegeojson)
          map.addSource('NewWF', {
          type: 'geojson',
          data: firegeojson,
        })

        map.addLayer({
          'id': 'NewWF',
          'type': 'symbol',
          'source': 'NewWF',
          'layout': {
            'icon-image': 'FireIcon',
            'icon-size': [
              'step',
              ["to-number", ["get", "size"]],
              0.05,
              1, 0.05,
              100, 0.065,
              1000, 0.08,
              10000, 0.095,
              100000, 0.11,
            ],
            'icon-allow-overlap': true,
          },
          'paint': {
            'icon-opacity': [
              'match',
              ['get', 'type'],
              'Emerging>24', 0.5,
              'Emerging<24', 1,
              1
            ]
          },
          //'filter': ['==', 'inctype', 'Wildfire'],
        })
        map.addLayer({
          'id': 'NewWF1',
          'type': 'symbol',
          'source': 'NewWF',
          'minzoom':6,
          'layout': {
            'text-field': ['string', ['get', 'name']],
            'text-font': [
              "Open Sans Condensed Bold",
            ],
            'text-size': 16,
            'text-offset': [0, 1],
            'text-allow-overlap': false,
            "symbol-sort-key": ["to-number", ["get", "size"]],
          },
          'paint': {
            //'text-halo-color': 'rgba(0,0,0,1)',
            //'text-halo-width': 1,
            //'text-color': 'rgba(200,0,0,1.0)'
            'text-color':[
              'match',
              ['get', 'type'],
              'Emerging>24', 'rgba(100,100,100, 1)',
              'Emerging<24', 'rgba(155, 0, 50, 1)',
              'rgba(0,0,0,0)'
            ]
          },
          //'filter': ['==', 'inctype', 'Wildfire'],
        })

        map.on('render', stopSpinner);
        })


        map.on('click', 'NewWF', function(e) {
          let shtml=`<div class="popup-header">${e.features[0].properties.name}</div>`
          if (e.features[0].properties.size != 'null'){
            shtml += `Daily Acres (% Contained): <b>${e.features[0].properties.size} Acres</b>`
          }
          if (e.features[0].properties.con != 'null'){
            shtml +=`<b>(${e.features[0].properties.con}%)</b>`
          }
          if (e.features[0].properties.updated != 'null'){
            shtml+=`<br>Updated: <b>${moment(e.features[0].properties.updated).format('lll')}</b>`
          }
          if (e.features[0].properties.IncidentManagementOrganization != 'null'){
            shtml +=`<br>Incident Management Org: <b>${e.features[0].properties.IncidentManagementOrganization}</b>`
          }
          if (e.features[0].properties.cause != 'null'){
            shtml +=`<br>Cause: <b>${e.features[0].properties.cause}</b>`
          }
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(shtml)
            .addTo(map);
        });

        map.on('mouseenter', 'NewWF', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'NewWF', function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function removeInterra(){
        map.removeLayer('NewWF')
        map.removeLayer('NewWF1')
        map.removeSource('NewWF')
      }

      function removeInciWeb(){
        map.removeLayer('Inciweb')
        map.removeLayer('Inciweb1')
        map.removeSource('Inciweb')
      }


      async function addSpots(){
        loadingSpinner(true);
        var spotgeojson = {
          type: "FeatureCollection",
          features: [],
        };

        fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.weather.gov/spot/monitor/monitor_server_json.php?&wfo=all')
          .then(res => res.json())
          //.then(data => spot = data)
          .then(data => data.rows.forEach(function(d) {
          spotgeojson.features.push({
               "type": "Feature",
               "geometry": {
                 "type": "Point",
                 "coordinates": [Number(d.lon), Number(d.lat)]
              },
              "properties": {
                  "name": d.name,
                  "type": d.type,
                  "stat": d.stat,
                  "reqtm": d.rmade,
                  "deltm": d.deliverdtg,
                  "id": d.snumunum,
                  }
          })
          })
        )
        .then(() => console.log(spotgeojson))
        .then(() => spots())
        .catch(error => window.alert("Problem Loading Data."))

        function spots(){
          map.addSource('Spots', {
            type: 'geojson',
            data: spotgeojson,
          });

          map.addLayer({
            'id': 'Spots1',
            'type': 'circle',
            'source': 'Spots',
            'paint': {
              "circle-radius": [
                "interpolate", ["linear"],
                ["zoom"],
                4, 8,
                7, 14,
                11, 20,
              ],
              'circle-color': [
                'match',
                ['get', 'stat'],
                'C', 'rgba(0, 255, 0, 1)',
                'P', 'rgba(255, 0, 255, 1)',
                'rgba(0,0,0,0.2)'
              ],
              //'circle-blur': 0.4,
            },
            'filter': ['==', '$type', 'Point'],
          }, 'settlement-label');

          map.addLayer({
            'id': 'Spots',
            'type': 'symbol',
            'source': 'Spots',
            'layout': {
              'icon-image': 'noun_Fire',
              'icon-size': [
                "interpolate", ["linear"],
                ["zoom"],
                4, .15,
                7, .25,
                11, .3,
              ],
              'text-field': ['string', ['get', 'name']],
              'text-font': [
                "Open Sans Condensed Bold",

              ],
              'text-size': [
                "interpolate", ["linear"],
                ["zoom"],
                4, 0,
                4.95, 0,
                5, 12,
                7, 16,
                11, 18,
              ],
              'text-offset': [0, 2],
              'text-allow-overlap': false,
              'icon-allow-overlap': true,
            },
            'paint': {
              'text-halo-color': 'rgba(0,0,0,0.75)',
              'text-halo-width': 1.5,
              'text-color': 'rgba(255,200,75,1.0)',
              //'icon-color':'rgba(255,0,0,1)',
            },
            'filter': ['==', '$type', 'Point'],
          });
          map.on('click', 'Spots', function(e) {
            new mapboxgl.Popup({maxWidth:'400px'})
              .setLngLat(e.lngLat)
              .setHTML('<div class="popup-header">'+e.features[0].properties.name + '</div><br>Type: '+e.features[0].properties.type + '<br>Status: '+e.features[0].properties.stat + '<br>Request Made: '+e.features[0].properties.reqtm + '<br>Deliver Time: '+e.features[0].properties.deltm + '<br><a href="https:\/\/www.weather.gov/spot/php/forecast.php?snumunum=' + e.features[0].properties.id + '" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/spot/php/forecast.php?snumunum=' + e.features[0]
                .properties.id + '\',\'popup\',\'width=900,height=800\'); return false;">Spot Page</a></span>')
              .addTo(map);
          });

          map.on('mouseenter', 'Spots', function() {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'Spots', function() {
            map.getCanvas().style.cursor = '';
          });
          map.on('render', stopSpinner);

      }
    }

      function removeSpots(){
        map.removeLayer('Spots')
        map.removeLayer('Spots1')
        map.removeSource('Spots')
      }

      function removeDavis(){
        map.removeLayer('Davis1')
        map.removeLayer('Davis2')
        map.removeSource('Davis')
      }

      function addDavis(){
        loadingSpinner(true);
        var davisgeojson = {
          type: "FeatureCollection",
          features: [],
        };

      var stations;
      var filtered;

      fetch("https:\/\/test.8222.workers.dev/?https:\/\/www.weatherlink.com/map/data/")
        .then(res=>res.json())
        .then(data=> stations = data)
        .then(()=>{
          filtered = stations.filter(function(boi){
            return ((boi.lng<-112 && boi.lng > -120) && (boi.lat>41.0 && boi.lat<45.5))
          })
            Promise.all(filtered.map(subarr => (
              fetch(`https:\/\/test.8222.workers.dev/?https:\/\/www.weatherlink.com/map/data/station/${subarr.id}`)
                .then(res => res.json())
                .then(result => [result, subarr.lng,subarr.lat])
            )))
            .then(data=>{
                data.forEach(e=>{
                  davisgeojson.features.push({
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [e[1], e[2]]
                    },
                    "properties": {
                        "temp": Number(e[0].temperature),
                        "unit": e[0].temperatureUnit
                        }
                  })
                })
            })
           .then(()=>{
                console.log(davisgeojson)
                map.addSource('Davis', {
                  type: 'geojson',
                  data: davisgeojson,
                })
                map.addLayer({
                  "id": "Davis2",
                  "type": "circle",
                  "source": "Davis",
                  //"filter": ["all", ["==", "unit", "&deg;F"]],
                  'paint': {
                    'circle-radius': 13,
                    //'circle-blur': 0.4,
                    'circle-color': {
                      property: 'temp',
                      stops: [
                        [-60, '#91003f'],
                        [-55, '#ce1256'],
                        [-50, '#e7298a'],
                        [-45, '#df65b0'],
                        [-40, '#ff73df'],
                        [-35, '#ffbee8'],
                        [-30, '#ffffff'],
                        [-25, '#dadaeb'],
                        [-20, '#bcbddc'],
                        [-15, '#9e9ac8'],
                        [-10, '#756bb1'],
                        [-5, '#54278f'],
                        [0, '#0d007d'],
                        [5, '#0d339c'],
                        [10, '#0066c2'],
                        [15, '#299eff'],
                        [20, '#4ac7ff'],
                        [25, '#73d7ff'],
                        [30, '#adffff'],
                        [35, '#30cfc2'],
                        [40, '#009996'],
                        [45, '#125757'],
                        [50, '#066d2c'],
                        [55, '#31a354'],
                        [60, '#74c476'],
                        [65, '#a1d99b'],
                        [70, '#d3ffbe'],
                        [75, '#ffffb3'],
                        [80, '#ffeda0'],
                        [85, '#fed176'],
                        [90, '#feae2a'],
                        [95, '#fd8d3c'],
                        [100, '#fc4e2a'],
                        [105, '#e31a1c'],
                        [110, '#b10026'],
                        [115, '#800026'],
                        [120, '#590042'],
                        [140, '#280028']
                      ],
                      default: 'rgba(255,255,255,0.0)',
                    }
                  },
                  //"filter": [">", "$validTime", age]
                });

                map.addLayer({
                  'id': 'Davis1',
                  'type': 'symbol',
                  'source': 'Davis',
                  //"filter": ["all", ["==", "unit", "&deg;F"]],
                  'layout': {
                    //'text-allow-overlap': true,
                    // 'text-field': ['number-format', ['get', 'temp'], {
                    //   'min-fraction-digits': 0,
                    //   'max-fraction-digits': 0.1
                    // }],
                    'text-field': '{temp}',
                    'text-font': [
                      "Open Sans Condensed Bold",
                      "Open Sans Condensed Bold",
                      "Arial Unicode MS Bold"
                    ],
                    'text-size': 16,
                  },
                  'paint': {
                    'text-color': {
                      property: 'temp',
                      stops: [
                        [-20, '#000'],
                        [-10.1, '#000'],
                        [-10, '#fff'],
                        [10, '#fff'],
                        [11, '#000'],
                        [39.9, '#000'],
                        [40, '#fff'],
                        [45, '#fff'],
                        [52, '#fff'],
                        [52.1, '#000'],
                        [55, '#000'],
                      ],
                      default: 'rgba(0,0,0,1.0)',
                    }
                  },
                });
                map.on('render', stopSpinner)
            })
          })
      }

    async function addDailyXm(date,elem){
        loadingSpinner(true);
        var s = map.getBounds().getSouth().toFixed(2);
        var n = map.getBounds().getNorth().toFixed(2);
        var w = map.getBounds().getWest().toFixed(2);
        var e = map.getBounds().getEast().toFixed(2);
        console.log(n,s,w,e);
        var params = {"elems":[{"name":""+elem+""}],"bbox":[Number(w),Number(s),Number(e),Number(n)],"date":""+date+"","meta":["name","ll"]};
        //var params_string = encodeURIComponent(JSON.stringify(params));
        var params_string = JSON.stringify(params);
        var acisu = "https:\/\/data.rcc-acis.org/MultiStnData";
        var url = acisu+'?params='+params_string;
        //console.log(url);

        var dXmgeojson = {
          type: "FeatureCollection",
          features: [],
        };

        fetch(url)
          .then(res => res.json())
          .then(data => data.data.forEach(function(d) {
            if (d.data[0]=='T'){
              dXmgeojson.features.push({
                   "type": "Feature",
                   "geometry": {
                     "type": "Point",
                     "coordinates": [d.meta.ll[0],d.meta.ll[1]],
                  },
                  "properties": {
                      "name": d.meta.name,
                      "data": 'T'
                      }
              })
            }
            else if (d.data[0]=='M'){
              dXmgeojson.features.push({
                   "type": "Feature",
                   "geometry": {
                     "type": "Point",
                     "coordinates": [d.meta.ll[0],d.meta.ll[1]],
                  },
                  "properties": {
                      "name": d.meta.name,
                      "data": ""
                      }
              })
            }
            else{
            dXmgeojson.features.push({
                 "type": "Feature",
                 "geometry": {
                   "type": "Point",
                   "coordinates": [d.meta.ll[0],d.meta.ll[1]],
                },
                "properties": {
                    "name": d.meta.name,
                    "data": Number(d.data[0])
                    }
            })
          }
        })
        )
        .then(() => console.log(dXmgeojson))
        .then(() => acis(elem))


        function acis(elem){
        map.addSource('dailyXm', {
          type: 'geojson',
          data: dXmgeojson,
        });

        if (elem == 'maxt' || elem =='mint'){
        map.addLayer({
          'id': 'dailyXm',
          'type': 'circle',
          'source': 'dailyXm',
          'paint': {
            "circle-radius": [
              "interpolate", ["linear"],
              ["zoom"],
              4, 6,
              7, 12,
              11, 18,
            ],
            'circle-color': {
              property: 'data',
              stops: [
                [-60, '#91003f'],
                [-55, '#ce1256'],
                [-50, '#e7298a'],
                [-45, '#df65b0'],
                [-40, '#ff73df'],
                [-35, '#ffbee8'],
                [-30, '#ffffff'],
                [-25, '#dadaeb'],
                [-20, '#bcbddc'],
                [-15, '#9e9ac8'],
                [-10, '#756bb1'],
                [-5, '#54278f'],
                [0, '#0d007d'],
                [5, '#0d339c'],
                [10, '#0066c2'],
                [15, '#299eff'],
                [20, '#4ac7ff'],
                [25, '#73d7ff'],
                [30, '#adffff'],
                [35, '#30cfc2'],
                [40, '#009996'],
                [45, '#125757'],
                [50, '#066d2c'],
                [55, '#31a354'],
                [60, '#74c476'],
                [65, '#a1d99b'],
                [70, '#d3ffbe'],
                [75, '#ffffb3'],
                [80, '#ffeda0'],
                [85, '#fed176'],
                [90, '#feae2a'],
                [95, '#fd8d3c'],
                [100, '#fc4e2a'],
                [105, '#e31a1c'],
                [110, '#b10026'],
                [115, '#800026'],
                [120, '#590042'],
                [140, '#280028']
              ],
              default: 'rgba(200,200,200,0.0)',
            },
            // 'circle-blur': 0.4,
          },
          'filter': ['has', 'data']
        }, 'settlement-label');

        map.addLayer({
          'id': 'dailyXm1',
          'type': 'symbol',
          'source': 'dailyXm',
          'attribution': 'xmAcis',
          'layout': {
            //'text-allow-overlap': true,
            'text-field': ['number-format', ['get', 'data'], {
              'min-fraction-digits': 0,
              'max-fraction-digits': 0.1
            }],
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 14,
              7, 18,
              11, 22,
            ],
          },
          'paint': {
            // 'text-color': {
            //   property: 'air_temp',
            //   stops: [
            //     [-60,'#91003f'],
            //     [-55,'#ce1256'],
            //     [-50,'#e7298a'],
            //     [-45,'#df65b0'],
            //     [-40,'#ff73df'],
            //     [-35,'#ffbee8'],
            //     [-30,'#ffffff'],
            //     [-25,'#dadaeb'],
            //     [-20,'#bcbddc'],
            //     [-15,'#9e9ac8'],
            //     [-10,'#756bb1'],
            //     [-5,'#54278f'],
            //     [0,'#0d007d'],
            //     [5,'#0d339c'],
            //     [10,'#0066c2'],
            //     [15,'#299eff'],
            //     [20,'#4ac7ff'],
            //     [25,'#73d7ff'],
            //     [30,'#adffff'],
            //     [35,'#30cfc2'],
            //     [40,'#009996'],
            //     [45,'#125757'],
            //     [50,'#066d2c'],
            //     [55,'#31a354'],
            //     [60,'#74c476'],
            //     [65,'#a1d99b'],
            //     [70,'#d3ffbe'],
            //     [75,'#ffffb3'],
            //     [80,'#ffeda0'],
            //     [85,'#fed176'],
            //     [90,'#feae2a'],
            //     [95,'#fd8d3c'],
            //     [100,'#fc4e2a'],
            //     [105,'#e31a1c'],
            //     [110,'#b10026'],
            //     [115,'#800026'],
            //     [120,'#590042'],
            //     [140, '#280028']
            //   ],
            //   default:'rgba(255,255,255,0.0)',
            // },
            'text-color':'rgba(255,255,255,1)',
            'text-halo-color': 'rgba(0,0,0,1)',
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
          'filter': ['has', 'data']
        }, 'settlement-label');
      }
        if (elem === 'pcpn'){
          map.addLayer({
            'id': 'dailyXm',
            'type': 'circle',
            'source': 'dailyXm',
            'attribution': 'xmAcis',
            'paint': {
              "circle-radius": [
                    "interpolate", ["linear"],
                      ["zoom"],
                      4, 6,
                      7, 12,
                     11, 18,
                     ],
              'circle-color': {
                property: 'data',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [0.01, 'rgba(193,233,192,1.0)'],
                  [0.1, 'rgba(161,217,155,1.0)'],
                  [0.25, 'rgba(116,196,118,1.0)'],
                  [0.50, 'rgba(49,163,83,1.0)'],
                  [1.0, 'rgba(0,109,44,1.0)'],
                  [1.5, 'rgba(255,250,138,1.0)'],
                  [2.0, 'rgba(255,204,79,1.0)'],
                  [3.0, 'rgba(254,141,60,1.0)'],
                  [4.0, 'rgba(252,78,42,1.0)'],
                  [6.0, 'rgba(214,26,28,1.0)'],
                  [8.0, 'rgba(173,0,38,1.0)'],
                  [10.0, 'rgba(112,0,38,1.0)'],
                  [15.0, 'rgba(59,0,48,1.0)'],
                  [20.0, 'rgba(255,0,255,1.0)'],
                ],
                default: 'rgba(255,255,255,0.0)',
              },
              // 'circle-blur': 0.4,
            },
            'filter': ['has', 'data']
          }, 'settlement-label');

          map.addLayer({
            'id': 'dailyXm1',
            'type': 'symbol',
            'source': 'dailyXm',
            'attribution': 'Synoptic Data',
            'layout': {
              //'text-allow-overlap': true,
              'text-field': '{data}',
              'text-font': [
                "Open Sans Condensed Bold",

              ],
              'text-size': [
                "interpolate", ["linear"],
                ["zoom"],
                4, 14,
                7, 18,
                11, 22,
              ],
            },
            'paint': {
              'text-color': {
                property: 'data',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [0.01, 'rgba(255,255,255,1.0)'],
                ],
                default: 'rgba(255,255,255,1.0)',
              },
              'text-halo-color': {
                property: 'data',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [0.01, 'rgba(0,0,0,1.0)'],
                ],
                default: 'rgba(0,0,0,1.0)',
              },
              'text-halo-width': 1.5,
              'text-halo-blur': 1,
            },
            'filter': ['has', 'data']
          }, 'settlement-label');
      }
      if (elem === 'snow'){
        map.addLayer({
          'id': 'dailyXm',
          'type': 'circle',
          'source': 'dailyXm',
          'attribution': 'xmAcis',
          'paint': {
            "circle-radius": [
                  "interpolate", ["linear"],
                    ["zoom"],
                    4, 6,
                    7, 12,
                   11, 18,
                   ],
            'circle-color': {
              property: 'data',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.1, 'rgba(150,150,150,1.0)'],
                [1, 'rgba(200,200,200,1.0)'],
                [2, 'rgba(50,150,255,1.0)'],
                [3, 'rgba(0,100,225,1.0)'],
                [4, 'rgba(60,52,212,1.0)'],
                [6, 'rgba(121,26,233,1.0)'],
                [8, 'rgba(182,0,255,1.0)'],
                [12, 'rgba(255,0,255,1.0)'],
                [18.0, 'rgba(212,0,114,1.0)'],
                [24.0, 'rgba(191,0,32,1.0)'],
                [36.0, 'rgba(120,0,0,1.0)'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
            //'circle-blur': 0.4,
          },
          'filter': ['has', 'data']
        }, 'settlement-label');

        map.addLayer({
          'id': 'dailyXm1',
          'type': 'symbol',
          'source': 'dailyXm',
          'attribution': 'Synoptic Data',
          'layout': {
            //'text-allow-overlap': true,
            'text-field': '{data}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 14,
              7, 18,
              11, 22,
            ],
          },
          'paint': {
            'text-color': {
              property: 'data',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.01, 'rgba(255,255,255,1.0)'],
              ],
              default: 'rgba(255,255,255,1.0)',
            },
            'text-halo-color': {
              property: 'data',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.01, 'rgba(0,0,0,1.0)'],
              ],
              default: 'rgba(0,0,0,1.0)',
            },
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
          'filter': ['has', 'data']
        }, 'settlement-label');
    }
    if (elem === 'snwd'){
      map.addLayer({
        'id': 'dailyXm',
        'type': 'circle',
        'source': 'dailyXm',
        'attribution': 'xmAcis',
        'paint': {
          "circle-radius": [
                "interpolate", ["linear"],
                  ["zoom"],
                  4, 6,
                  7, 12,
                 11, 18,
                 ],
          'circle-color': {
            property: 'data',
            stops: [
              [0, 'rgba(0,0,0,0.0)'],
              [0.1, 'rgba(200,200,200,1.0)'],
              [5, 'rgba(31, 134, 255,1.0)'],
              [10, 'rgba(60,52,212,1.0)'],
              [20, 'rgba(121,26,233,1.0)'],
              [50, 'rgba(182,0,255,1.0)'],
              [75, 'rgba(233,0,213,1.0)'],
              [100.0, 'rgba(212,0,114,1.0)'],
              [200.0, 'rgba(191,0,32,1.0)'],
            ],
            default: 'rgba(255,255,255,0.0)',
          },
          //'circle-blur': 0.4,
        },
        'filter': ['has', 'data']
      }, 'settlement-label');

      map.addLayer({
        'id': 'dailyXm1',
        'type': 'symbol',
        'source': 'dailyXm',
        'attribution': 'Synoptic Data',
        'layout': {
          //'text-allow-overlap': true,
          'text-field': '{data}',
          'text-font': [
            "Open Sans Condensed Bold",
            "Open Sans Condensed Bold",
            "Arial Unicode MS Bold"
          ],
          'text-size': [
            "interpolate", ["linear"],
            ["zoom"],
            4, 14,
            7, 18,
            11, 22,
          ],
        },
        'paint': {
          'text-color':'rgba(255,255,255,1.0)',
          'text-halo-color': 'rgba(0,0,0,1.0)',
          'text-halo-width': 1.5,
          'text-halo-blur': 1,
        },
        'filter': ['has', 'data']
      }, 'settlement-label');
  }
    }
        map.on('render', stopSpinner);
        map.on('click', 'dailyXm', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.name + ' - '+e.features[0].properties.data+'</div>')
            .addTo(map);
        });

        map.on('mouseenter', 'dailyXm', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'dailyXm', function() {
          map.getCanvas().style.cursor = '';
        });


      }


      function removeDailyXm(){
        map.removeLayer('dailyXm')
        map.removeLayer('dailyXm1')
        map.removeSource('dailyXm')
      }

      async function addMonthlyXm(date,elem){
          loadingSpinner(true);
          var s = map.getBounds().getSouth().toFixed(2);
          var n = map.getBounds().getNorth().toFixed(2);
          var w = map.getBounds().getWest().toFixed(2);
          var e = map.getBounds().getEast().toFixed(2);
          console.log(n,s,w,e);
          if (elem == "pcpn"||elem =="snow"){
            var params = {"elems":[{"name":""+elem+"","interval":"mly","reduce":"sum","maxmissing":0}],"bbox":[Number(w),Number(s),Number(e),Number(n)],"date":""+date+"","meta":["name","ll"]};
          }
          if (elem =="maxt"||elem=="mint"){
            var params = {"elems":[{"name":""+elem+"","interval":"mly","reduce":"mean","maxmissing":0}],"bbox":[Number(w),Number(s),Number(e),Number(n)],"date":""+date+"","meta":["name","ll"]};
          }
          if (elem =="avgt"){
            var params = {"elems":[{"name":""+elem+"","interval":"mly","reduce":"mean","maxmissing":0,"normal":"departure"}],"bbox":[Number(w),Number(s),Number(e),Number(n)],"date":""+date+"","meta":["name","ll"]};
          }
          //var params_string = encodeURIComponent(JSON.stringify(params));
          var params_string = JSON.stringify(params);
          var acisu = "https:\/\/data.rcc-acis.org/MultiStnData";
          var url = acisu+'?params='+params_string;
          //console.log(url);

          var mXmgeojson = {
            type: "FeatureCollection",
            features: [],
          };

          fetch(url)
            .then(res => res.json())
            .then(data => data.data.forEach(function(d) {
              if (d.data[0]=='T'){
                mXmgeojson.features.push({
                     "type": "Feature",
                     "geometry": {
                       "type": "Point",
                       "coordinates": [d.meta.ll[0],d.meta.ll[1]],
                    },
                    "properties": {
                        "name": d.meta.name,
                        "data": 'T'
                        }
                })
              }
              else if (d.data[0]=='M'){
                mXmgeojson.features.push({
                     "type": "Feature",
                     "geometry": {
                       "type": "Point",
                       "coordinates": [d.meta.ll[0],d.meta.ll[1]],
                    },
                    "properties": {
                        "name": d.meta.name,
                        "data": ""
                        }
                })
              }
              else{
              mXmgeojson.features.push({
                   "type": "Feature",
                   "geometry": {
                     "type": "Point",
                     "coordinates": [d.meta.ll[0],d.meta.ll[1]],
                  },
                  "properties": {
                      "name": d.meta.name,
                      "data": Number(d.data[0])
                      }
              })
            }
          })
          )
          .then(() => console.log(mXmgeojson))
          .then(() => acis(elem))
          .catch(error => window.alert("Problem Loading Data."))


          function acis(elem){
          map.addSource('monthXm', {
            type: 'geojson',
            data: mXmgeojson,
            attribution: 'xmAcis',
          });

          if (elem == 'maxt' || elem =='mint'){
          map.addLayer({
            'id': 'monthXm',
            'type': 'circle',
            'source': 'monthXm',
            'paint': {
              "circle-radius": [
                "interpolate", ["linear"],
                ["zoom"],
                4, 6,
                7, 12,
                11, 18,
              ],
              'circle-color': {
                property: 'data',
                stops: [
                  [-60, '#91003f'],
                  [-55, '#ce1256'],
                  [-50, '#e7298a'],
                  [-45, '#df65b0'],
                  [-40, '#ff73df'],
                  [-35, '#ffbee8'],
                  [-30, '#ffffff'],
                  [-25, '#dadaeb'],
                  [-20, '#bcbddc'],
                  [-15, '#9e9ac8'],
                  [-10, '#756bb1'],
                  [-5, '#54278f'],
                  [0, '#0d007d'],
                  [5, '#0d339c'],
                  [10, '#0066c2'],
                  [15, '#299eff'],
                  [20, '#4ac7ff'],
                  [25, '#73d7ff'],
                  [30, '#adffff'],
                  [35, '#30cfc2'],
                  [40, '#009996'],
                  [45, '#125757'],
                  [50, '#066d2c'],
                  [55, '#31a354'],
                  [60, '#74c476'],
                  [65, '#a1d99b'],
                  [70, '#d3ffbe'],
                  [75, '#ffffb3'],
                  [80, '#ffeda0'],
                  [85, '#fed176'],
                  [90, '#feae2a'],
                  [95, '#fd8d3c'],
                  [100, '#fc4e2a'],
                  [105, '#e31a1c'],
                  [110, '#b10026'],
                  [115, '#800026'],
                  [120, '#590042'],
                  [140, '#280028']
                ],
                default: 'rgba(200,200,200,0.0)',
              },
              //'circle-blur': 0.4,
            },
            'filter': ['has', 'data']
          }, 'settlement-label');

          map.addLayer({
            'id': 'monthXm1',
            'type': 'symbol',
            'source': 'monthXm',
            'layout': {
              //'text-allow-overlap': true,
              'text-field': ['number-format', ['get', 'data'], {
                'min-fraction-digits': 0,
                'max-fraction-digits': 0.1
              }],
              'text-font': [
                "Open Sans Condensed Bold",

              ],
              'text-size': [
                "interpolate", ["linear"],
                ["zoom"],
                4, 14,
                7, 18,
                11, 22,
              ],
            },
            'paint': {
              // 'text-color': {
              //   property: 'air_temp',
              //   stops: [
              //     [-60,'#91003f'],
              //     [-55,'#ce1256'],
              //     [-50,'#e7298a'],
              //     [-45,'#df65b0'],
              //     [-40,'#ff73df'],
              //     [-35,'#ffbee8'],
              //     [-30,'#ffffff'],
              //     [-25,'#dadaeb'],
              //     [-20,'#bcbddc'],
              //     [-15,'#9e9ac8'],
              //     [-10,'#756bb1'],
              //     [-5,'#54278f'],
              //     [0,'#0d007d'],
              //     [5,'#0d339c'],
              //     [10,'#0066c2'],
              //     [15,'#299eff'],
              //     [20,'#4ac7ff'],
              //     [25,'#73d7ff'],
              //     [30,'#adffff'],
              //     [35,'#30cfc2'],
              //     [40,'#009996'],
              //     [45,'#125757'],
              //     [50,'#066d2c'],
              //     [55,'#31a354'],
              //     [60,'#74c476'],
              //     [65,'#a1d99b'],
              //     [70,'#d3ffbe'],
              //     [75,'#ffffb3'],
              //     [80,'#ffeda0'],
              //     [85,'#fed176'],
              //     [90,'#feae2a'],
              //     [95,'#fd8d3c'],
              //     [100,'#fc4e2a'],
              //     [105,'#e31a1c'],
              //     [110,'#b10026'],
              //     [115,'#800026'],
              //     [120,'#590042'],
              //     [140, '#280028']
              //   ],
              //   default:'rgba(255,255,255,0.0)',
              // },
              'text-color':'rgba(255,255,255,1)',
              'text-halo-color': 'rgba(0,0,0,1)',
              'text-halo-width': 1.5,
              'text-halo-blur': 1,
            },
            'filter': ['has', 'data']
          }, 'settlement-label');
        }
          if (elem === 'pcpn'){
            map.addLayer({
              'id': 'monthXm',
              'type': 'circle',
              'source': 'monthXm',
              'attribution': 'xmAcis',
              'paint': {
                "circle-radius": [
                      "interpolate", ["linear"],
                        ["zoom"],
                        4, 6,
                        7, 12,
                       11, 18,
                       ],
                'circle-color': {
                  property: 'data',
                  stops: [
                    [0, 'rgba(0,0,0,0.0)'],
                    [0.01, 'rgba(193,233,192,1.0)'],
                    [0.1, 'rgba(161,217,155,1.0)'],
                    [0.25, 'rgba(116,196,118,1.0)'],
                    [0.50, 'rgba(49,163,83,1.0)'],
                    [1.0, 'rgba(0,109,44,1.0)'],
                    [1.5, 'rgba(255,250,138,1.0)'],
                    [2.0, 'rgba(255,204,79,1.0)'],
                    [3.0, 'rgba(254,141,60,1.0)'],
                    [4.0, 'rgba(252,78,42,1.0)'],
                    [6.0, 'rgba(214,26,28,1.0)'],
                    [8.0, 'rgba(173,0,38,1.0)'],
                    [10.0, 'rgba(112,0,38,1.0)'],
                    [15.0, 'rgba(59,0,48,1.0)'],
                    [20.0, 'rgba(255,0,255,1.0)'],
                  ],
                  default: 'rgba(255,255,255,0.0)',
                },
                // 'circle-blur': 0.4,
              },
              'filter': ['has', 'data']
            }, 'settlement-label');

            map.addLayer({
              'id': 'monthXm1',
              'type': 'symbol',
              'source': 'monthXm',
              'attribution': 'Synoptic Data',
              'layout': {
                //'text-allow-overlap': true,
                'text-field': '{data}',
                'text-font': [
                  "Open Sans Condensed Bold",

                ],
                'text-size': [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 14,
                  7, 18,
                  11, 22,
                ],
              },
              'paint': {
                'text-color': {
                  property: 'data',
                  stops: [
                    [0, 'rgba(0,0,0,0.0)'],
                    [0.01, 'rgba(255,255,255,1.0)'],
                  ],
                  default: 'rgba(255,255,255,1.0)',
                },
                'text-halo-color': {
                  property: 'data',
                  stops: [
                    [0, 'rgba(0,0,0,0.0)'],
                    [0.01, 'rgba(0,0,0,1.0)'],
                  ],
                  default: 'rgba(0,0,0,1.0)',
                },
                'text-halo-width': 1.5,
                'text-halo-blur': 1,
              },
              'filter': ['has', 'data']
            }, 'settlement-label');
        }
        if (elem === 'snow'){
          map.addLayer({
            'id': 'monthXm',
            'type': 'circle',
            'source': 'monthXm',
            'paint': {
              "circle-radius": [
                    "interpolate", ["linear"],
                      ["zoom"],
                      4, 6,
                      7, 12,
                     11, 18,
                     ],
              'circle-color': {
                property: 'data',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [0.1, 'rgba(200,200,200,1.0)'],
                  [5, 'rgba(31, 134, 255,1.0)'],
                  [10, 'rgba(60,52,212,1.0)'],
                  [20, 'rgba(121,26,233,1.0)'],
                  [50, 'rgba(182,0,255,1.0)'],
                  [75, 'rgba(233,0,213,1.0)'],
                  [100.0, 'rgba(212,0,114,1.0)'],
                  [200.0, 'rgba(191,0,32,1.0)'],
                ],
                default: 'rgba(255,255,255,0.0)',
              },
             // 'circle-blur': 0.4,
            },
            'filter': ['has', 'data']
          }, 'settlement-label');

          map.addLayer({
            'id': 'monthXm1',
            'type': 'symbol',
            'source': 'monthXm',
            'attribution': 'Synoptic Data',
            'layout': {
              //'text-allow-overlap': true,
              'text-field': '{data}',
              'text-font': [
                "Open Sans Condensed Bold",

              ],
              'text-size': [
                "interpolate", ["linear"],
                ["zoom"],
                4, 14,
                7, 18,
                11, 22,
              ],
            },
            'paint': {
              'text-color': {
                property: 'data',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [0.01, 'rgba(255,255,255,1.0)'],
                ],
                default: 'rgba(255,255,255,1.0)',
              },
              'text-halo-color': {
                property: 'data',
                stops: [
                  [0, 'rgba(0,0,0,0.0)'],
                  [0.01, 'rgba(0,0,0,1.0)'],
                ],
                default: 'rgba(0,0,0,1.0)',
              },
              'text-halo-width': 1.5,
              'text-halo-blur': 1,
            },
            'filter': ['has', 'data']
          }, 'settlement-label');
      }
      if (elem === 'avgt'){
        map.addLayer({
          'id': 'monthXm',
          'type': 'circle',
          'source': 'monthXm',
          'attribution': 'xmAcis',
          'paint': {
            "circle-radius": [
                  "interpolate", ["linear"],
                    ["zoom"],
                    4, 6,
                    7, 12,
                   11, 18,
                   ],
            'circle-color': {
              property: 'data',
              stops: [
                [-10, 'rgba(0,0,175,1.0)'],
                [-5, 'rgba(0,0,255,1.0)'],
                [0, 'rgba(255,255,255,1.0)'],
                [5, 'rgba(255, 0, 0,1.0)'],
                [10, 'rgba(175, 0, 0,1.0)'],
              ],
              default: 'rgba(200,200,200,0.0)',
            },
           // 'circle-blur': 0.4,
          },
          'filter': ['has', 'data']
        }, 'settlement-label');

        map.addLayer({
          'id': 'monthXm1',
          'type': 'symbol',
          'source': 'monthXm',
          'attribution': 'Synoptic Data',
          'layout': {
            //'text-allow-overlap': true,
            'text-field': ['number-format', ['get', 'data'], {
              'min-fraction-digits': 0,
              'max-fraction-digits': 1,
            }],
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 14,
              7, 18,
              11, 22,
            ],
          },
          'paint': {
            'text-color':'rgba(255,255,255,1.0)',
            'text-halo-color': 'rgba(0,0,0,1.0)',
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
          'filter': ['has', 'data']
        }, 'settlement-label');
    }
      }
          map.on('render', stopSpinner);
          map.on('click', 'monthXm', function(e) {
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML('<div class="popup-header">'+e.features[0].properties.name + ' - '+e.features[0].properties.data+'</div>')
              .addTo(map);
          });

          map.on('mouseenter', 'monthXm', function() {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'monthXm', function() {
            map.getCanvas().style.cursor = '';
          });


        }


        function removeMonthlyXm(){
          map.removeLayer('monthXm')
          map.removeLayer('monthXm1')
          map.removeSource('monthXm')
        }

        async function addEarthquake(t){
          loadingSpinner(true);

            var geojson = {
              type: "FeatureCollection",
              features: [],
            };

            fetch('https:\/\/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_'+t+'.geojson')
              .then(res => res.json())
              .then(data => data = data.features)
              .then(data => data.forEach(function(d) {
              geojson.features.push({
                   "type": "Feature",
                   "geometry": {
                     "type": "Point",
                     "coordinates": [Number(d.geometry.coordinates[0]), Number(d.geometry.coordinates[1])]
                  },
                  "properties": {
                      "title": d.properties.title,
                      "time": Number(d.properties.time),
                      "rad": Math.pow(d.properties.mag,1.7),
                      "age": moment().diff(d.properties.time, 'hours'),
                      "url": d.properties.url
                      }
              })
              })
            )
            .then(() => console.log(geojson))
            .then(() => earthquake())
            .catch(error => window.alert("Problem Loading Data."))

          function earthquake(){
          map.addSource("Earthquakes"+t, {
              "type": "geojson",
              "attribution": "USGS",
              "data": geojson
          });
          map.setLayoutProperty('water-gray', 'visibility', 'visible')
          map.addLayer({
            "id": "Earthquakes"+t,
            "type": "circle",
            "source": "Earthquakes"+t,
            "layout":{
              'circle-sort-key': ['to-number', ['get', 'mag']],
            },
            "paint": {
                "circle-radius": ['get','rad'],
                "circle-color": {
                   property: 'age',
                   stops: [
                     [0,'rgba(255,0,150,0.95)'],
                     [1,'rgba(255,0,200,0.90)'],
                     [5,'rgba(255,0,255,0.8)'],
                     [10,'rgba(225,0,255,0.7)'],
                     [24,'rgba(200,0,255,0.6)'],
                     [48,'rgba(175,0,255,0.5)'],
                     [72,'rgba(125,0,255,0.4)'],
                     [96,'rgba(75,0,255,0.3)'],
                     [240,'rgba(0,0,200,0.15)'],
                     [480,'rgba(0,0,100,0.10)'],
                   ],
                   default:'rgba(200,200,200,0.9)',
                 },
                 //'circle-blur': 0.4,
                //"circle-opacity": 0.8
            }
          });
          map.on('render', stopSpinner);
          map.on('click', 'Earthquakes'+t, function(e) {
            new mapboxgl.Popup({maxwidth:'500px'})
              .setLngLat(e.lngLat)
              .setHTML('<div class="popup-header">'+e.features[0].properties.title + '</div>'+moment(e.features[0].properties.time).format('MMMM Do YYYY, h:mm a')+'<br><a href="' + e.features[0].properties.url + '" target="Popup" onclick="window.open(\'' + e.features[0]
                .properties.url + '\',\'popup\',\'width=900,height=800\'); return false;">USGS Event Page</a>')
                //.properties.url + '\',\'popup\',\'width=900,height=800\'); return false;">USGS Event Page</a><br>Age (hour):'+e.features[0].properties.age+'')
              .addTo(map);
          });

          map.on('mouseenter', 'Earthquakes'+t, function() {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'Earthquakes'+t, function() {
            map.getCanvas().style.cursor = '';
          });
        }
        }

        async function addEarthquakear(){
            loadingSpinner(true);
            s = map.getBounds().getSouth().toFixed(2);
            n = map.getBounds().getNorth().toFixed(2);
            w = map.getBounds().getWest().toFixed(2);
            e = map.getBounds().getEast().toFixed(2);

            var geojson = {
              type: "FeatureCollection",
              features: [],
            };

            fetch(`https:\/\/earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=1800-03-25%2000%3A00%3A00&maxlatitude=${n}&minlatitude=${s}&maxlongitude=${e}&minlongitude=${w}&minmagnitude=5.0&orderby=time`)
              .then(res => res.json())
              .then(data => data.features.forEach(function(d) {
              geojson.features.push({
                   "type": "Feature",
                   "geometry": {
                     "type": "Point",
                     "coordinates": [Number(d.geometry.coordinates[0]), Number(d.geometry.coordinates[1])]
                  },
                  "properties": {
                      "title": d.properties.title,
                      "time": Number(d.properties.time),
                      "mag": d.properties.mag,
                      "rad": (Math.pow(d.properties.mag,2))/3.5,
                      "age": moment().diff(d.properties.time, 'hours'),
                      "url": d.properties.url
                      }
              })
              })
            )
            .then(() => console.log(geojson))
            .then(() => earthquake2())

          function earthquake2(){
          map.addSource("Earthquakesar", {
              "type": "geojson",
              "attribution": "USGS",
              "data": geojson
          });
          map.setLayoutProperty('water-gray', 'visibility', 'visible')
          map.addLayer({
            "id": "Earthquakesar",
            "type": "circle",
            "source": "Earthquakesar",
            "layout":{
              'circle-sort-key': ['to-number', ['get', 'mag']],
            },
            "paint": {
                "circle-radius": ['get','rad'],
                //"circle-color": 'rgba(255,0,150,0.9)',
                "circle-color": {
                   property: 'mag',
                   stops: [
                     [5,'rgba(0,200,200,0.5)'],
                     [7,'rgba(200,0,255,0.5)'],
                     [10,'rgba(255,0,255,0.9)'],
                   ],
                   default:'rgba(200,200,200,0.9)',
                 },
                 //'circle-blur': 0.4,
                //"circle-opacity": 0.8
            }
          });
        //   map.addLayer({
        //     "id": "Earthquakesar1",
        //     "type": "symbol",
        //     "source": "Earthquakesar",
        //   'layout': {
        //     'text-allow-overlap': true,
        //     'text-field': '{mag}',
        //     'text-font': [
        //       "Open Sans Condensed Bold",
        //       "Open Sans Condensed Bold",
        //       "Arial Unicode MS Bold"
        //     ],
        //     'text-size': [
        //       "interpolate", ["linear"],
        //       ["zoom"],
        //       4, 13,
        //       7, 17,
        //       11, 21,
        //     ],
        //   },
        //   'paint': {
        //     'text-color': 'rgba(255,255,255,1)',
        //     'text-halo-color': 'rgba(0,0,0,1)',
        //     'text-halo-width': 1.5,
        //     'text-halo-blur': 1,
        //   },
        //   'filter': ['==', '$type', 'Point'],
        // }, );
        map.on('click', 'Earthquakesar', function(e) {
            new mapboxgl.Popup({maxwidth:'500px',closeOnClick: false, closeButton:true})
              .setLngLat(e.lngLat)
              .setHTML('M '+e.features[0].properties.mag+' '+moment(e.features[0].properties.time).format('MM/DD/YYYY')+'')
              .addTo(map);
          });

          map.on('render', stopSpinner);

        }
        }

        function removeEarthquakear(){
          map.removeLayer('Earthquakesar')
          map.removeLayer('Earthquakesar1')
          map.removeSource('Earthquakesar')
          map.setLayoutProperty('water-gray', 'visibility', 'none')
        }

        function removeEarthquake(t){
          map.removeLayer('Earthquakes'+t)
          map.removeSource('Earthquakes'+t)
          map.setLayoutProperty('water-gray', 'visibility', 'none')
        }

        function addPlates(){
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var firstSymbolId;
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
              firstSymbolId = layers[i].id;
              break;
            }
          }
          map.addLayer({
            'id': 'Plates',
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                'https:\/\/earthquake.usgs.gov/basemap/tiles/plates/{z}/{x}/{y}.png'
              ],
              'tileSize': 256
            },
            'paint': {}
          }, firstSymbolId);
          map.addLayer({
            'id': 'Faults',
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                'https:\/\/earthquake.usgs.gov/basemap/tiles/faults/{z}/{x}/{y}.png'
              ],
              'tileSize': 256
            },
            'paint': {}
          }, firstSymbolId);
          map.on('render', stopSpinner);
        }

        function removePlates(){
          map.removeLayer('Plates')
          map.removeSource('Plates')
          map.removeLayer('Faults')
          map.removeSource('Faults')
        }

        function addFPI(){
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var lastSymbolId;
          for (var i = 0; i < layers.length; i++) {
            //if (layers[i].type === 'fill') {
            if (layers[i].type === 'hillshade') {
              lastSymbolId = layers[i].id;
              break;
            }
          }
          map.addLayer({
            'id': 'FPI',
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                `https:\/\/dmsdata.cr.usgs.gov/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=firedanger_emodis_fpi_conus_daily_data:emodis_fpi_conus_daily_data&TILED=true&mapperWMSURL=https%3A%2F%2Fdmsdata.cr.usgs.gov%2Fgeoserver%2Fwms%3F&SRS=EPSG%3A3857&jsonLayerId=layer-1022674918&STYLES=firedanger_emodis_daily_fpi_conus_raster&TIME=${moment().format('YYYY-MM-DD')}&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857&BBOX={bbox-epsg-3857}`
                //'https:\/\/firedanger.cr.usgs.gov/arcgis/rest/services/Greenness/USGS_7_Day_FPI/MapServer/export?dpi=96&transparent=true&format=png32&layers=show:0&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
              ],
              'tileSize': 512
            },
            'paint': {}
          }, lastSymbolId);
          map.on('render', stopSpinner);
        }


        function removeFPI(){
          map.removeLayer('FPI')
          map.removeSource('FPI')
        }

        function addWPCQPF(hr){
        //  'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/wpc_precip_hazards/MapServer/'+hr+'/query?f=json&where=(1%3D1)%20AND%20(1%3D1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=valid_time&orderByFields=id%20ASC&outSR=102100'
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var lastSymbolId;
          for (var i = 0; i < layers.length; i++) {
            //if (layers[i].type === 'fill') {
            if (layers[i].type === 'hillshade') {
              lastSymbolId = layers[i].id;
              break;
            }
          }
          map.addLayer({
            'id': 'WPCQPF',
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/wpc_qpf/MapServer/export?dpi=96&transparent=true&format=png32&layers=show:'+hr+'&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
              ],
              'tileSize': 512
            },
            'paint': {}
          }, lastSymbolId);
          map.on('render', stopSpinner);
        }


        function removeWPCQPF(){
          map.removeLayer('WPCQPF')
          map.removeSource('WPCQPF')
        }

        function addWPCER(hr){
        //  'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/wpc_precip_hazards/MapServer/'+hr+'/query?f=json&where=(1%3D1)%20AND%20(1%3D1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=valid_time&orderByFields=id%20ASC&outSR=102100'
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var lastSymbolId;
          for (var i = 0; i < layers.length; i++) {
            //if (layers[i].type === 'fill') {
            if (layers[i].type === 'hillshade') {
              lastSymbolId = layers[i].id;
              break;
            }
          }
          map.addLayer({
            'id': 'WPCER',
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/wpc_precip_hazards/MapServer/export?dpi=96&transparent=true&format=png32&layers=show:'+hr+'&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
              ],
              'tileSize': 512
            },
            'paint': {}
          }, lastSymbolId);
          map.on('render', stopSpinner);
        }


        function removeWPCER(){
          map.removeLayer('WPCER')
          map.removeSource('WPCER')
        }

        function addITD(){
          loadingSpinner(true);

          var geojson = {
            type: "FeatureCollection",
            features: [],
          };
          var geojson2 = {
            type: "FeatureCollection",
            features: [],
          };
          var geojson3 = {
            type: "FeatureCollection",
            features: [],
          };

          Promise.all([
          fetch('https:\/\/test.8222.workers.dev/?https:\/\/id.carsprogram.org/carsapi_v1/api/events')
            .then(res => res.json())
            .then(data => data.forEach(function(d) {
              console.log(d.headline.code)


              function itdColor(code){
                switch(code){
                  case "wet pavement": return "#080"; break;
                  case "dry pavement": return "#969696"; break;
                  case "icy patches": return "#06f"; break;
                  case "packed snow patches": return "#06f"; break;
                  case "slush": return "#06f"; break;
                  case "snow on roadway":
		  case "ice":
		  case "packed snow": return "#309"; break;
		  case "extremely hazardous driving conditions":return "#60c"; break;
                  case "drifting snow": return "#60c"; break;
                  case "closed": return "#f0f"; break;
                  default: return "#969696";
                }
              }

              geojson3.features.push({
                "type":"Feature",
                "geometry":d.geometry,
                "properties":{
                  "category": d.headline.category,
                  "code": d.headline.code,
                  "c" : itdColor(d.headline.code),
                  "d" : 5.0,
                  "e" : 1.0,

                },
              })


            //   if (typeof d.location.primaryPoint === 'undefined' || d.location.primaryPoint === null){
            //     console.log("fips"+d.id)
            //   }
            //   //else if(d.eventDescription.tooltip.includes('Winter Storm')){
            //   //}
            //   else if((d.icon.image.includes('urgent') === true )||(d.icon.image.includes('critical') === true )||(d.icon.image.includes('closure') === true )){
            //     if (d.icon.image.includes('closure') === true ){
            //       //console.log(d.id)
            //     geojson.features.push({
            //          "type": "Feature",
            //          "geometry": {
            //            "type": "Point",
            //            "coordinates": [d.location.primaryPoint.lon,d.location.primaryPoint.lat],
            //         },
            //         "properties": {
            //             //"head": d.eventDescription.criticalDisruptionHeader,
            //             "da": d.eventDescription.tooltip,
            //             "br": d.eventDescription.descriptionBrief,
            //             'st':'Closure'
            //             }
            //     })
            //   }
            //   else if (d.icon.image.includes('warning') === true ){
            //     geojson.features.push({
            //          "type": "Feature",
            //          "geometry": {
            //            "type": "Point",
            //            "coordinates": [d.location.primaryPoint.lon,d.location.primaryPoint.lat],
            //         },
            //         "properties": {
            //             //"head": d.eventDescription.criticalDisruptionHeader,
            //             "da": d.eventDescription.tooltip,
            //             "br": d.eventDescription.descriptionBrief,
            //             'st':'Warning'
            //             }
            //     })
            //   }
            //   else {
            //     geojson.features.push({
            //          "type": "Feature",
            //          "geometry": {
            //            "type": "Point",
            //            "coordinates": [d.location.primaryPoint.lon,d.location.primaryPoint.lat],
            //         },
            //         "properties": {
            //             //"head": d.eventDescription.criticalDisruptionHeader,
            //             "da": d.eventDescription.tooltip,
            //             "br": d.eventDescription.descriptionBrief,
            //             'st':'Adv'
            //             }
            //     })

            //   }
            // }
          })
          ),
            //GET OREGON DOT INCIDENTS
          fetch('https:\/\/test.8222.workers.dev/?https:\/\/tripcheck.com/Scripts/map/data/INCD.js')
            .then(res => res.json())
            .then(data => data.features.forEach(function(d) {
              //console.log(data);
              if (moment(d.attributes.lastUpdated).add(24,'hours').isBefore(/*now*/)){
                return;
              }
              else{
                if ((d.attributes.odotCategoryDescript.includes('Weather') === true )||(d.attributes.type.includes('INCIDENT') === true )||(d.attributes.odotSeverityDescript.includes('Closure') === true )){
                  if (d.attributes.odotSeverityDescript.includes('Closure') === true ){
                  geojson.features.push({
                       "type": "Feature",
                       "geometry": {
                         "type": "Point",
                         "coordinates": proj4('EPSG:3857', 'EPSG:4326', [d.geometry.x,d.geometry.y]),
                      },
                      "properties": {
                          "da": d.attributes.beginMarker,
                          "la": d.attributes.lastUpdated,
                          "br": d.attributes.comments,
                          'st':'Closure'
                          }
                  })
                }
                else if (d.attributes.odotCategoryDescript.includes('Weather') === true ){
                  geojson.features.push({
                       "type": "Feature",
                       "geometry": {
                         "type": "Point",
                         "coordinates": proj4('EPSG:3857', 'EPSG:4326', [d.geometry.x,d.geometry.y]),
                      },
                      "properties": {
                          "da": d.attributes.beginMarker,
                          "la": d.attributes.lastUpdated,
                          "br": d.attributes.comments,
                          'st':'Warning'
                          }
                  })
                }
                else if (d.attributes.odotCategoryDescript.includes('Winter') === true ){
                  geojson.features.push({
                       "type": "Feature",
                       "geometry": {
                         "type": "Point",
                         "coordinates": proj4('EPSG:3857', 'EPSG:4326', [d.geometry.x,d.geometry.y]),
                      },
                      "properties": {
                          "da": d.attributes.beginMarker,
                          "la": d.attributes.lastUpdated,
                          "br": d.attributes.comments,
                          'st':'Warning'
                          }
                  })
                }
                else {
                  geojson.features.push({
                       "type": "Feature",
                       "geometry": {
                         "type": "Point",
                         "coordinates": proj4('EPSG:3857', 'EPSG:4326', [d.geometry.x,d.geometry.y]),
                      },
                      "properties": {
                          "da": d.attributes.beginMarker,
                          "la": d.attributes.lastUpdated,
                          "br": d.attributes.comments,
                          'st':'Adv'
                          }
                  })

                }
              }
            }
          })
          ),
          // fetch('https:\/\/test.8222.workers.dev/?https:\/\/hb.511.idaho.gov/tgevents/api/eventMapFeatures/')
          //   .then(res => res.json())
          //   .then(data => data.forEach(function(d) {
          //     if ((d.tooltip.includes('COVID'))||(d.tooltip.includes('Winter Storm'))){
          //       return
          //     }
          //       let col,opa,lw
          //     if (d.representation.lineWidth === 6){
          //       col = '#f0f'
          //       opa = 1
          //       lw = 5
          //     }
          //     geojson3.features.push({
          //              "type": "Feature",
          //              "geometry": d.geometry,
          //               "properties": {
          //                   "b": d.tooltip,
          //                   "c" : col || d.representation.color,
          //                   "d" : lw || d.representation.lineWidth || 5.0,
          //                   "e" : opa || d.representation.lineOpacity || 1.0,
          //                   }
          //         })
          //   })),
            fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.tripcheck.com/Scripts/map/data/INCDClosureJson.js')
            .then(res => res.json())
            .then(data => data.features.forEach(function(d) {
               let newElement = []
               d.geometry.paths.forEach(element => {
                for (var i = 0; i < element.length; i++) {
                    var feature = element[i];
                    var lon = feature[0] *  180 / 20037508.34 ;
                    var lat = Math.atan(Math.exp(feature[1] * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
                    newElement.push([lon,lat])
                }
                 console.log(newElement)
             })
              //console.log(d.geometry.paths)
              geojson2.features.push({
                       "type": "Feature",
                       "geometry": {
                         "type": "LineString",
                         "coordinates": newElement,
                      },
                      "properties": {
                          "a": d.attributes.beginMarker,
                          "la":d.attributes.lastUpdated,
                          "b": d.attributes.comments,
                          "c" : d.attributes.odotSeverityDescript
                          }
                  })
          }))
          ])
          .then(() => {
          // map.addSource('ITD', {
          //   type: 'geojson',
          //   data: geojson,
          // });

          // map.addLayer({
          //   'id': 'ITD',
          //   'type': 'symbol',
          //   'source': 'ITD',
          //   'paint': {
          //     'icon-opacity': 1,
          //     'icon-halo-width':1.5,
          //     'icon-halo-blur':0.5,
          //     //'icon-color':'rgba(200,0,0, 1)',
          //     'icon-halo-color':'rgba(255, 255, 255, 1)',
          //   },
          //   'layout': {
          //     //'icon-image': 'Aircraft_Airport_ecomo',
          //     'icon-image': [
          //       'match',
          //       ['get', 'st'],
          //       'Closure', 'roadblock-15-pink',
          //       'Warning', 'roadblock-15',
          //       'adv','triangle-15',
          //       'triangle-15'
          //     ],
          //     'icon-size':1.5,
          //     'icon-allow-overlap': true,
          //     'icon-rotation-alignment': 'map',

          //   },
          //   //'filter':['==','origin','BOI'],

          // })

          map.addSource('itdline', {
            type: 'geojson',
            data: geojson3,
          })
          map.addLayer({
                  "id": "itdline",
                  "type": "line",
                  "source": "itdline",
                  "layout": {
                  "line-join": "round",
                  "line-cap": "round"
                  },
                  "paint": {
                  "line-color": ['get','c'],
                  "line-width": ['get','d'],
                  "line-opacity": ['get','e'],
                  }
                }, 'water (1)')

          map.addSource('odotline', {
            type: 'geojson',
            data: geojson2,
          })
            map.addLayer({
                  "id": "odotline",
                  "type": "line",
                  "source": "odotline",
                  "layout": {
                  "line-join": "round",
                  "line-cap": "round"
                  },
                  "paint": {
                  "line-color": "#f0f",
                  "line-width": 5
                  }
                }, 'water (1)')
            map.on('render', stopSpinner)
      var popup =  new mapboxgl.Popup({closeButton: false})

      map.on('mouseenter', 'ITD', function(e) {

          popup.setLngLat(e.lngLat)
          .setHTML(`<div class="popup-header">${e.features[0].properties.da}</div>${moment(e.features[0].properties.la).format('llll')}<br>${e.features[0].properties.br}`)
          .addTo(map);
      });

      map.on('mouseenter', 'ITD', function() {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'ITD', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      map.on('click', 'Closures', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.type + '</div>'+e.features[0].properties.description+'')
            .addTo(map);
        });

        map.on('click', 'itdline', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.code + '</div>')
            .addTo(map);
        });
        map.on('click', 'odotline', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div class="popup-header">${e.features[0].properties.a}</div>${moment(e.features[0].properties.la).format('llll')}<br>${e.features[0].properties.b}`)
            .addTo(map);
        });

        map.on('mouseenter', 'Closures', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Closures', function() {
          map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'odotline', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'odotline', function() {
          map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'itdline', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'itdline', function() {
          map.getCanvas().style.cursor = '';
        });

        })
}
        function removeITD(){
          // map.removeLayer('ITD')
          // map.removeSource('ITD')
          map.removeLayer('odotline')
          map.removeSource('odotline')
          map.removeLayer('itdline')
          map.removeSource('itdline')
        }


        map.on('dblclick', 'FWZones', function(e) {
       var popup =  new mapboxgl.Popup({})
        popup.setLngLat(e.lngLat)
        .setHTML(`<div class="popup-header">${e.features[0].properties.ZONE} - ${e.features[0].properties.NAME}</div>`)
        .addTo(map);
        });

        map.on('mouseenter', 'FWZones', function() {
        map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'FWZones', function() {
        map.getCanvas().style.cursor = '';
        });

        let roadConditions = (val) => {
          if (!val){
            return "NA"
          }
          if (val==1){
            return "Dry"
          }
          if (val==2){
            return "Trace Moisture"
          }
          if (val==4){
            return "<span style='color:rgb(0,170,0);'>Wet</span>"
          }
          if (val==6){
            return "<span style='color:rgb(255,0,255);'>Icy</span>"
          }
          if (val==8){
            return "<span style='color:rgb(0,135,200);'>Snowy</span>"
          }
        }

      function addRoadC(){
          loadingSpinner(true);
          var geojson = {
          type: "FeatureCollection",
          features: [],
        };

      fetch('https:\/\/test.8222.workers.dev/?https:\/\/tripcheck.com/Scripts/map/data/rw.js')
      .then(res=>res.json())
      .then(data=>{

        data.features.forEach(e=>{
          if (moment(e.attributes.entryTime).add(8,'hours').isBefore(/*now*/)){
            console.log('entry expired')
            return
          }
          //console.log(e.attributes)
          let attributes = e.attributes
          if (e.attributes.pavementConditionDesc.includes('Snow')){
            attributes["road_surface_condition"] = 8.0
              geojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [e.geometry.x,e.geometry.y])
              },
              "properties": attributes,
                })
           }
          if (e.attributes.pavementConditionDesc.includes('Ice')){
            attributes["road_surface_condition"] = 5.0
              geojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [e.geometry.x,e.geometry.y])
              },
                "properties": attributes,
              })
           }
           if (e.attributes.pavementConditionDesc.includes('Bare')){
            if (e.attributes.weatherConditionDesc.includes('Showers')){
              attributes["road_surface_condition"] = 2.0
              geojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [e.geometry.x,e.geometry.y])
              },
              "properties": attributes,
                })
           }
           else if ((e.attributes.weatherConditionDesc.includes('Rain'))||(e.attributes.weatherConditionDesc.includes('Snow'))){
            attributes["road_surface_condition"] = 4.0
              geojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [e.geometry.x,e.geometry.y])
              },
              "properties": attributes,
                })

            }
            else{
              attributes["road_surface_condition"] = 1.0
              geojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [e.geometry.x,e.geometry.y])
              },
              "properties": attributes,
                })


            }

           }


              })

      })
      .then(()=>{
        console.log(geojson)
        map.addSource(`ODOTRoadC`, {
          type: 'geojson',
          data: geojson
        });
          map.addLayer({
          'id': `ODOTRoadC`,
          'type': 'circle',
          'source': `ODOTRoadC`,
          'layout':{
            "circle-sort-key": ["to-number", ["get", 'snowDepth']],
          },
          'paint': {
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,.5)',
            'circle-color':  [
                  'match',
                  ['get', 'road_surface_condition'],
                  1.0, 'rgba(150,150,150,1)',   //dry
                  2.0, 'rgba(150,255,150,1)',   //trace moisture
                  4.0, 'rgba(0,170,0,1)',       //wet
                  5.0, 'rgba(200,150,255,1)',     //spots of ice
                  6.0, 'rgba(255,0,255,1)',     //icy
                  8.0, 'rgba(0,135,255,1)',     //snowy
                  'rgba(0,0,0,0)',
                ],
                "circle-radius": [
                      "interpolate", ["linear"],
                        ["zoom"],
                        4, 10,
                        7, 16,
                      11, 30,
                      ],
          },
          //'filter': ['has', 'snowDepth']
        }, 'RoadConds');
      })

            map.addSource('MWRoadTemps', { type:'geojson', data: 'https:\/\/api.synopticlabs.org/v2/stations/nearesttime?&token=2ca9b465e97f4e2fb4ba8f2333f5659e&within=60&units=english&status=active&vars=road_temp,road_surface_condition&output=geojson&stid=!WY42,!CO011,!VTALB,!OD126,!NE000'});
            map.addLayer({
              'id': 'RoadConds',
              'type': 'circle',
              'source': 'MWRoadTemps',
              'paint': {
                'circle-stroke-width':1,
                'circle-stroke-color':[
                  'match',
                  ['get', 'road_surface_condition'],
                  1.0, 'rgba(0,0,0,.5)',   //dry
                  2.0, 'rgba(0,0,0,.5)',   //trace moisture
                  4.0, 'rgba(0,0,0,.5)',       //wet
                  6.0, 'rgba(0,0,0,.5)',     //icy
                  8.0, 'rgba(0,0,0,.5)',     //snowy
                  'rgba(0,0,0,0)',
                ],
                "circle-radius": [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 10,
                  7, 16,
                  11, 30,
                ],
                'circle-color':  [
                  'match',
                  ['get', 'road_surface_condition'],
                  1.0, 'rgba(150,150,150,1)',   //dry
                  2.0, 'rgba(150,255,150,1)',   //trace moisture
                  4.0, 'rgba(0,170,0,1)',       //wet
                  6.0, 'rgba(255,0,255,1)',     //icy
                  8.0, 'rgba(0,135,255,1)',     //snowy
                  'rgba(0,0,0,0)',
                ],
                //'circle-blur': 0.4,
              },
              'filter': ['==', '$type', 'Point'],
            }, 'settlement-label');
            map.addLayer({
              'id': 'RoadTemps',
              'type': 'symbol',
              'source':'MWRoadTemps',
              'layout': {
                //'text-allow-overlap': true,
                'text-field':['number-format', ['get','road_temp'],{'min-fraction-digits':0, 'max-fraction-digits':0.1}],
                'text-font': [
                  //"Lato Black",
                  //"Ubuntu Bold",
                  "Open Sans Condensed Bold",
                  "Arial Unicode MS Bold"
                ],
                'text-size': [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 12,
                  7,20,
                  12, 42,
                ],
              },
              'paint':{
                'text-color':'rgba(255,255,255,1)',
                // [
                //   'match',
                //   ['get', 'road_surface_condition'],
                //   1.0, 'rgba(150,150,150,1)',   //dry
                //   2.0, 'rgba(150,255,150,1)',   //trace moisture
                //   4.0, 'rgba(0,170,0,1)',       //wet
                //   6.0, 'rgba(255,0,255,1)',     //icy
                //   8.0, 'rgba(0,135,200,1)',     //snowy
                //   'rgba(255,255,255,255)',
                // ],
                'text-halo-color':'rgba(0,0,0,1)',
                'text-halo-width':1.5,
                'text-halo-blur':0.5,
              },
              'filter':['==','$type','Point'],
            },'settlement-label');
            map.on('render', stopSpinner);

            map.on('click', `ODOTRoadC`, function(e) {
              let phtml='';
              phtml += `<div class='popup-header'>${e.features[0].properties.linkName}-${e.features[0].properties.locationName}</div>`
              phtml += `${moment(e.features[0].properties.entryTime).format('llll')}<br>`
              if (e.features[0].properties.pavementConditionDesc !== 'null'){
                phtml += `Road Condition: <b>${e.features[0].properties.pavementConditionDesc}</b><br>`
              }
              if (e.features[0].properties.weatherConditionDesc !== 'null'){
                phtml += `Weather: <b>${e.features[0].properties.weatherConditionDesc}</b><br>`
              }
              if (e.features[0].properties.tempCurr !=='null'){
                phtml += `Current Temperature: <b>${e.features[0].properties.tempCurr}&deg;F</b><br>`
              }
              if (e.features[0].properties.snowDepth !== 'null'){
                if (e.features[0].properties.snowDepth == -1){
                  phtml += `Snow Depth: <b>Trace</b><br>`
                }
                else{
                  phtml += `Snow Depth: <b>${e.features[0].properties.snowDepth}"</b><br>`
                }
              }
              if (e.features[0].properties.snowfall !== 'null'){
                if (e.features[0].properties.snowfall == -1){
                  phtml += `New Snow: <b>Trace</b><br>`
                }
                else{
                phtml += `New Snow: <b>${e.features[0].properties.snowfall}"</b><br>`
                }
              }
              new mapboxgl.Popup({offset:[0,2]})
              .setLngLat(e.lngLat)
              .setHTML(phtml)
              //.setHTML('<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.alert +'</div><br><a href="' + e.features[0].properties.Link + '" target="Popup" onclick="window.open(\'' + e.features[0].properties.link + '\',\'popup\',\'width=900,height=800\'); return false;">Volcano Page</a></span>')
              .addTo(map);
            });

            map.on('click', 'RoadConds', function(e) {
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<div class="popup-header">${e.features[0].properties.name} - ${e.features[0].properties.stid}</div><span>Valid: ${moment(e.features[0].properties.date_time).format('MMMM Do YYYY, h:mm a')}<br>Road Condition: <b>${roadConditions(Number(e.features[0].properties.road_surface_condition))}</b><br>Road Temperature: ${e.features[0].properties.road_temp} &deg;F<br><a href="https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0].properties.stid}" target="Popup" onclick="window.open('https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0]
                  .properties.stid},'popup','width=900,height=800'); return false;">3-Day History</a></span>`)
                .addTo(map);
            });

            map.on('mouseenter', 'RoadConds', function() {
              map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'RoadConds', function() {
              map.getCanvas().style.cursor = '';
            });
      }

        function removeRoadC(){
          map.removeLayer('RoadConds')
          map.removeLayer('RoadTemps')
          map.removeLayer('ODOTRoadC')
          map.removeSource('MWRoadTemps')
          map.removeSource('ODOTRoadC')
        }

        function addUrban(){
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var lastSymbolId;
          for (var i = 0; i < layers.length; i++) {
            //if (layers[i].type === 'fill') {
            if (layers[i].type === 'hillshade') {
              lastSymbolId = layers[i].id;
              break;
            }
          }
          map.addLayer({
            'id': 'Urban',
            'type': 'raster',
            'source': {
              'type': 'raster',
              'tiles': [
                'https:\/\/tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Urban/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A3%2C4&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
              ],
              'tileSize': 512
            },
            'paint': {
              "raster-opacity": 0.5,
            }
          }, lastSymbolId);
          map.on('render', stopSpinner);
        }

        function removeUrban(){
          map.removeLayer('Urban')
          map.removeSource('Urban')
        }

        function addStreamer(){
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var lastSymbolId;
          for (var i = 0; i < layers.length; i++) {
            //if (layers[i].type === 'fill') {
            if (layers[i].type === 'hillshade') {
              lastSymbolId = layers[i].id;
              break;
            }
          }
          map.addLayer({
            'id': 'Streamer',
            'type': 'raster',
            'source': {
              'type': 'raster',
              //'scheme':'tms',
              'tiles': [
                'https:\/\/basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}'
              ],
              'tileSize': 512
            },
            'paint': {
              //"raster-opacity": 0.5,
            }
          }, lastSymbolId);
          map.on('render', stopSpinner);
        }

        function removeStreamer(){
          map.removeLayer('Streamer')
          map.removeSource('Streamer')
        }

        function addDrought(){
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var lastSymbolId;
          for (var i = 0; i < layers.length; i++) {
            //if (layers[i].type === 'fill') {
            if (layers[i].type === 'hillshade') {
              lastSymbolId = layers[i].id;
              break;
            }
          }
          fetch('https:\/\/utility.arcgis.com/usrsvcs/servers/1ddc7cf1bb7e49298789d8794c2cdb37/rest/services/US_Drought/MapServer?f=json')
          .then(res => res.json())
          .then(data => {
            map.addLayer({
            'id': 'Drought',
            'type': 'raster',
            'source': {
              'type': 'raster',
              'attribution': 'Drought Monitor Updated: <b>'+ moment(data.timeInfo.timeExtent[1]).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.timeInfo.timeExtent[1]).fromNow() + '</b>',
              'tiles': [
                'https:\/\/utility.arcgis.com/usrsvcs/servers/1ddc7cf1bb7e49298789d8794c2cdb37/rest/services/US_Drought/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A0&time='+data.timeInfo.timeExtent[1]+'&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'
              ],
              'tileSize': 512
            },
            'paint': {
              //"raster-opacity": 0.5,
            }
          }, lastSymbolId)
          map.on('render', stopSpinner)
          })
          .catch(error => window.alert("Problem Loading Data."))
        }

        function removeDrought(){
          map.removeLayer('Drought')
          map.removeSource('Drought')
        }

        function addSD(lay){
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var lastSymbolId;
          for (var i = 0; i < layers.length; i++) {
            //if (layers[i].type === 'fill') {
            if (layers[i].type === 'hillshade') {
              lastSymbolId = layers[i].id;
              break;
            }
          }
          fetch('https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/NOHRSC_Snow_Analysis/MapServer/6/query?f=json&where=(1%3D1)%20AND%20(1%3D1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=objectid%20ASC&outSR=102100&resultOffset=0&resultRecordCount=50')
          .then(res => res.json())
          .then(data => {
          map.addLayer({
            'id': 'SD'+lay,
            'type': 'raster',
            'source': {
              'type': 'raster',
              'attribution': 'Updated: <b>'+ moment(data.features[0].attributes.idp_issueddate).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(data.features[0].attributes.idp_issueddate).fromNow() + '</b>',
              'tiles': [
                'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/NOHRSC_Snow_Analysis/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A'+lay+'&bbox={bbox-epsg-3857}&bboxSR=102100&imageSR=102100&size=512,512&f=image'              ],
              'tileSize': 512
            },
            'paint': {
              //"raster-opacity": 0.5,
            }
          }, lastSymbolId);
          map.on('render', stopSpinner)
        })
        .catch(error => window.alert("Problem Loading Data."))


          map.on('dblclick', function(e) {
            if ((map.getSource('SD3') && map.isSourceLoaded('SD3')) || (map.getSource('SD7') && map.isSourceLoaded('SD7'))) {
            var s = map.getBounds().getSouth().toFixed(2);
            var n = map.getBounds().getNorth().toFixed(2);
            var w = map.getBounds().getWest().toFixed(2);
            var es = map.getBounds().getEast().toFixed(2);
            console.log(s,n,w,es)
            var screenw = $( '#map' ).width();
            var screenh = $( '#map' ).height();
            fetch('https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/NOHRSC_Snow_Analysis/MapServer/identify?geometryType=esriGeometryPoint&geometry='+e.lngLat+'&sr=&layers=visible:3,7&time=&layerTimeOptions=&layerdefs=&tolerance=10&mapExtent='+es+','+s+','+w+','+n+'&imageDisplay='+screenw+','+screenh+',96&returnGeometry=true&maxAllowableOffset=&f=pjson')
              .then(res => res.json())
              .then(data => {
                var depth = Number(data.results[0].attributes["Pixel Value"]).toFixed(2); //
                var swe =  Number(data.results[1].attributes["Pixel Value"]*0.0393701).toFixed(2);  //mm to inches
                new mapboxgl.Popup()
                  .setLngLat(e.lngLat)
                  .setHTML('Snow Depth: <b>'+depth+'</b>"<br> SWE: <b>'+swe+'</b>"')
                  .addTo(map);
              })
            } else {
          }
          })
        }

        function removeSD(lay){

          map.removeLayer('SD'+lay)
          map.removeSource('SD'+lay)
          //swedepth.delete();
        }

        function addAHPS(){
          loadingSpinner(true);
            map.addSource('AHPS', { type:'geojson', data: 'https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/ahps_riv_gauges/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&bbox=${bbox-epsg-3857}&geometry=&geometryType=esriGeometryEnvelope&inSR=3857&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=gaugelid%2Cstatus%2Curl&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson'});
            map.addLayer({
              'id': 'AHPS',
              'type': 'circle',
              'source': 'AHPS',
              'paint': {
                "circle-radius": [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 6,
                  7, 12,
                  11, 18,
                ],
                'circle-stroke-width':1,
                'circle-stroke-color':'rgba(0,0,0,.5)',
                'circle-color':  [
                  'match',
                  ['get', 'status'],
                  'no_flooding','rgba(0,255,0,1)',
                  'not_defined','rgba(114,175,233,1)',
                  'action','rgba(255,255,0,1)',
                  'minor','rgba(255,153,0,1)',
                  'moderate','rgba(255,0,0,1)',
                  'major','rgba(204,51,255,1)',
                  'obs_not_current','rgba(189,194,187,1)',
                  'out_of_service','rgba(102,102,102,1)',
                  'low_threshold','rgba(144,99,32,1)',
                  'rgba(0,0,0,0)',
                ]
              },
              'filter': ['==', '$type', 'Point'],
            }, 'settlement-label');

            map.on('render', stopSpinner);

            map.on('click', 'AHPS', function(e) {
              new mapboxgl.Popup({maxWidth:'620px'})
                .setLngLat(e.lngLat)
                .setHTML('<div class="popup-header">'+e.features[0].properties.gaugelid +'</div><a href="https:\/\/www.weather.gov/source/aprfc/gageAnalysis.html?site='+e.features[0].properties.gaugelid.toLowerCase()+'" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/source/aprfc/gageAnalysis.html?site='+e.features[0].properties.gaugelid.toLowerCase()+'\',\'popup\',\'width=900,height=800\'); return false;">NWS Gage Analysis</a></span><br><a href="' + e.features[0].properties.url + '" target="Popup" onclick="window.open(\'' + e.features[0]
                  .properties.url + '\',\'popup\',\'width=900,height=800\'); return false;">AHPS River Page</a></span><br><img src="https:\/\/water.weather.gov/resources/hydrographs/'+e.features[0].properties.gaugelid.toLowerCase()+'_hg.png">')
                .addTo(map);
            });

            map.on('mouseenter', 'AHPS', function() {
              map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'AHPS', function() {
              map.getCanvas().style.cursor = '';
            });
      }

        function removeAHPS(){
          map.removeLayer('AHPS')
          map.removeSource('AHPS')
        }

        function addMinMax(type,dy){
          var mesoNetwork = "!64";
          var day = Number(dy);
          loadingSpinner(true);
          if (map.getSource('MesoWest') && map.isSourceLoaded('MesoWest')) {
            console.log('MesoWest already loaded!');
          } else {
            var s = map.getBounds().getSouth().toFixed(2);
            var n = map.getBounds().getNorth().toFixed(2);
            var w = map.getBounds().getWest().toFixed(2);
            var e = map.getBounds().getEast().toFixed(2);
            var mesowestURL = 'https:\/\/api.synopticdata.com/v2/stations/latest?token='+mesoToken+'&bbox='+w+','+s+','+e+','+n+'&within=60&output=geojson&vars=air_temp,wind_direction,wind_speed,wind_gust&units=english,speed|mph&stid=' + mesoExclude +
              '&network=' + mesoNetwork + '&qc_remove_data=on&hfmetars=0&qc_checks=synopticlabs,madis&show_empty_stations=false&minmax=3&minmaxtype=utc&networkimportance=1,2,153,4,15,16,22,36,41,49,59,63,64,71,90,91,97,98,98,99,100,101,102,103,104,105,118,119,132,149,158,159,160,161,162,163,164,165,166,167,168,169,185,206,210';
            map.addSource('MesoWest', {
              type: 'geojson',
              data: mesowestURL
            });
          }
          if (type === 'max' || type ==='min'){
            map.addLayer({
              'id': 'MinMax'+type,
              'type': 'circle',
              'source': 'MesoWest',
              'paint': {
                "circle-radius": [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 6,
                  7, 12,
                  11, 18,
                ],
                'circle-color': [
                'step',
                ['number',  ['at', day, ['get', 'value_'+type+'_utc', ['get', 'air_temp_value_1',['get','minmax']]]]],
                  'rgba(0,0,0,0.0)',
                    -60, '#91003f',
                    -55, '#ce1256',
                    -50, '#e7298a',
                    -45, '#df65b0',
                    -40, '#ff73df',
                    -35, '#ffbee8',
                    -30, '#ffffff',
                    -25, '#dadaeb',
                    -20, '#bcbddc',
                    -15, '#9e9ac8',
                    -10, '#756bb1',
                    -5, '#54278f',
                    0, '#0d007d',
                    5, '#0d339c',
                    10, '#0066c2',
                    15, '#299eff',
                    20, '#4ac7ff',
                    25, '#73d7ff',
                    30, '#adffff',
                    35, '#30cfc2',
                    40, '#009996',
                    45, '#125757',
                    50, '#066d2c',
                    55, '#31a354',
                    60, '#74c476',
                    65, '#a1d99b',
                    70, '#d3ffbe',
                    75, '#ffffb3',
                    80, '#ffeda0',
                    85, '#fed176',
                    90, '#feae2a',
                    95, '#fd8d3c',
                    100, '#fc4e2a',
                    105, '#e31a1c',
                    110, '#b10026',
                    115, '#800026',
                    120, '#590042',
                    140, '#280028'
                  ],
                  //'circle-blur': 0.4,
              },
              'filter':['all',['!=',['at', day, ['get', 'value_'+type+'_utc', ['get', 'air_temp_value_1',['get','minmax']]]],null]]
            }, 'settlement-label');

            map.addLayer({
              'id': 'MinMax1'+type,
              'type': 'symbol',
              'source':'MesoWest',
              'layout': {
                //'text-allow-overlap': true,
                'text-field':['number-format', ['at', day, ['get', 'value_'+type+'_utc', ['get', 'air_temp_value_1',['get','minmax']]]], {'min-fraction-digits':0, 'max-fraction-digits':0.1}],
                'text-font': [
                  "Open Sans Condensed Bold",

                ],
                'text-size': [
                  "interpolate", ["linear"], ["zoom"],
                  4, 12,
                  7, 16,
                  11, 20,
                ],
              },
              'paint':{
                'text-color':'rgba(255,255,255,1)',
                'text-halo-color':'rgba(0,0,0,1)',
                'text-halo-width':1.5,
                'text-halo-blur':1,
              },
              'filter':['all',['!=',['at', day, ['get', 'value_'+type+'_utc', ['get', 'air_temp_value_1',['get','minmax']]]],null]]
            },'settlement-label');


          }
          if (type === 'gust'){
            $('#GustLegend').show();
            map.addLayer({
              'id': 'MinMax1'+type,
              'type': 'circle',
              'source':'MesoWest',
              'paint':{
                'circle-radius': [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 8,
                  7, 13,
                  11, 19,
                ],
                'circle-color': [
                      'step',
                      ['number',  ['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]]],
                        'rgba(0,0,0,0.0)',
                        0,'rgba(0,0,0,0.0)',
                        10,'rgba(255,255,255,0.0)',
                        10.1,'rgba(255,255,255,0.0)',
                        15,'rgba(255,255,255,0.0)',
                        25,'rgba(255,255,0,1.0)',
                        35,'#f70',
                        45,'#f00',
                        //55,'#f07',
                        58,'#f0f',
                    ],
                   // 'circle-blur': 0.4,
              },
              'filter':['all',['!=',['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]],null]]
            },'settlement-label');

            map.addLayer({
              'id': 'MinMax'+type,
              'type': 'symbol',
              'source':'MesoWest',
              'layout': {
                'text-allow-overlap': true,
                'text-field': ['number-format', ['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]], {'min-fraction-digits':0, 'max-fraction-digits':0.1}],
                'text-font': [
                  "Open Sans Condensed Bold",

                ],
                'text-size': [
                  "interpolate", ["linear"], ["zoom"],
                  4, 16,
                  7, 20,
                  11, 24,
                ],
              },
              'paint':{
                //'text-color': 'rgba(0,0,0,1.0)',
                'text-color': [
                  'step',
                  ['number',  ['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]]],
                    'rgba(0,0,0,0.0)',
                    0,'rgba(0,0,0,0.0)',
                    10,'rgba(255,255,255,0.0)',
                    14.9,'rgba(255,255,255,0.0)',
                     15,'rgba(255,255,255,1.0)',
                     25,'rgba(255,255,0,1.0)',
                        35,'#f70',
                        45,'#f00',
                        //55,'#f07',
                        58,'#f0f',
                    // 25,'rgba(255,255,128,1)',
                    // 35,'rgba(255,187,128,1)',
                    // 45,'rgba(255,128,128,1)',
                    // 55,'rgba(255,128,187,1)',
                    // 60,'rgba(255,128,255,1)',
                ],
                'text-halo-color': [
                  'step',
                  ['number',  ['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]]],
                    'rgba(0,0,0,0.0)',
                    0,'rgba(0,0,0,0.0)',
                    14.9,'rgba(0,0,0,0.0)',
                    15,'rgba(0,0,0,1.0)',
                    // 25,'rgba(255,255,0,1.0)',
                    //     35,'#f70',
                    //     45,'#f00',
                    //     55,'#f07',
                    //     60,'#f0f',
                    25,'rgba(0,0,0,1.0)',
                    30,'rgba(0,0,0,1.0)',
                    40,'rgba(0,0,0,1.0)',
                    60,'rgba(0,0,0,1.0)',
                ],
                'text-halo-width':1.5,
                'text-halo-blur':0.75,
              },
                'filter':['all',
                ['!=',['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]],null],
                //['>',['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]],25]
                ]
            },'settlement-label');
          }
          map.on('render', stopSpinner);
          map.on('click', 'MinMaxgust', function(e) {
            let shtml = '<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.stid +'<br>'+e.features[0].properties.elevation+' ft</div><span>Valid: ' + moment(e.features[0].properties.date_time).format('MMMM Do YYYY, h:mm a') + '<br>'
            if (e.features[0].properties.weather_condition_d){
              shtml += 'Conditions: ' + e.features[0].properties.weather_condition_d + '<br>'
            }
            if (e.features[0].properties.air_temp){
              shtml += 'Temperature: ' + e.features[0].properties.air_temp + ' &deg;F<br>'
            }
            if (e.features[0].properties.dew_point_temperature){
              shtml += 'Dewpoint: ' + e.features[0].properties.dew_point_temperature + ' &deg;F<br>'
            }
            if (e.features[0].properties.wind_speed && e.features[0].properties.wind_speed !== 0){
              shtml += 'Wind: ' + e.features[0].properties.wind_direction +'&deg; at '+e.features[0].properties.wind_speed+' mph<br>'
            }
            if (e.features[0].properties.wind_speed === 0){
              shtml += 'Wind: Calm <br>'
            }
            if (e.features[0].properties.wind_gust){
              shtml += 'Wind Gust: ' + e.features[0].properties.wind_gust + ' mph<br>'
            }
            shtml += '<a href="https:\/\/www.weather.gov/wrh/timeseries?site=/' + e.features[0].properties.stid + '" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=' + e.features[0]
            .properties.stid + '\',\'popup\',\'width=900,height=800\'); return false;">3-Day History</a></span>'

          new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(shtml)
          .addTo(map);
          });

          map.on('mouseenter', 'MinMaxgust', function() {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'MinMaxgust', function() {
            map.getCanvas().style.cursor = '';
          });

          var ar1 = ['all',[]];
          ar1[1].push('!=',['at', day, ['get', 'value_max_utc', ['get', 'air_temp_value_1',['get','minmax']]]],null)
          map.on('dblclick','MinMaxmax',function(e){
            var stid = e.features[0].properties.stid;
            var stn = ['!=', ['get','stid'], e.features[0].properties.stid];
            ar1.push(stn);
            console.table(ar1);
            map.setFilter('MinMaxmax', ar1);
            map.setFilter('MinMax1max', ar1);
          });

          var ar2 = ['all',[]];
          ar2[1].push('!=',['at', day, ['get', 'value_min_utc', ['get', 'air_temp_value_1',['get','minmax']]]],null);
          map.on('dblclick','MinMaxmin',function(e){
            var stid = e.features[0].properties.stid;
            var stn = ['!=', ['get','stid'], e.features[0].properties.stid];
            ar2.push(stn);
            console.table(ar2);
            map.setFilter('MinMaxmin', ar2);
            map.setFilter('MinMax1min', ar2);
          });

          var ar3 = ['all',[]];
          ar3[1].push('!=',['at', day, ['get', 'value_max_utc', ['get', 'wind_gust_value_1',['get','minmax']]]],null);
          console.info(ar3);
          map.on('dblclick','MinMaxgust',function(e){
            var stid = e.features[0].properties.stid;
            var stn = ['!=', ['get','stid'], e.features[0].properties.stid];
            ar3.push(stn);
            console.debug(ar3);
            map.setFilter('MinMaxgust', ar3);
            map.setFilter('MinMax1gust', ar3);
          });

        map.on('click', 'MinMaxmax', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.stid +'</div><span>Valid: ' + moment(e.features[0].properties.date_time).format('MMMM Do YYYY, h:mm a') + '<br><a href="https:\/\/www.weather.gov/wrh/timeseries?site=/' + e.features[0].properties.stid + '" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=' + e.features[0]
              .properties.stid + '\',\'popup\',\'width=900,height=800\'); return false;">3-Day History</a></span>')
            .addTo(map);
        });

        map.on('mouseenter', 'MinMaxmax', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'MinMaxmax', function() {
          map.getCanvas().style.cursor = '';
        });

        map.on('click', 'MinMaxmin', function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.stid +'</div><span>Valid: ' + moment(e.features[0].properties.date_time).format('MMMM Do YYYY, h:mm a') + '<br><a href="https:\/\/www.weather.gov/wrh/timeseries?site=/' + e.features[0].properties.stid + '" target="Popup" onclick="window.open(\'https:\/\/www.weather.gov/wrh/timeseries?site=' + e.features[0]
              .properties.stid + '\',\'popup\',\'width=900,height=800\'); return false;">3-Day History</a></span>')
            .addTo(map);
        });

        map.on('mouseenter', 'MinMaxmin', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'MinMaxmin', function() {
          map.getCanvas().style.cursor = '';
        });

      }

        function removeMinMax(type){
          if (type ==='gust'){
            $('#GustLegend').hide();
          }
          map.removeLayer('MinMax'+type)
          map.removeLayer('MinMax1'+type)
          map.removeSource('MesoWest')
        }

        function addTWC(layer){
          var layers = map.getStyle().layers;
          loadingSpinner(true);
          var firstSymbolId;
          for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'hillshade') {
          firstSymbolId = layers[i].id;
          break;
          }
          }

          fetch('https:\/\/wsimap.weather.com/201212/en-US/1322/0030/capability.json')
            .then(res => res.json())
            .then(data => {
              let lay = data.layers[layer];  //11 temp,31 radar
              console.log(lay.v[0].c, lay.v[0].t);

              map.addLayer({
                'id': 'TWC'+layer,
                'type': 'raster',
                'source': {
                  'type': 'raster',
                  'scheme':'tms',
                  'tiles': [
                  'https:\/\/wsimap7.weather.com/201212/en-US/1322/0030/'+lay.v[0].c+'/'+lay.n+'/0/'+lay.v[0].t+'/1/{z}/{x}/{y}/layer.png'
                  ],
                  'tileSize': 512
                },
                'paint': {}
              }, firstSymbolId)
              map.on('render', stopSpinner)
            })
        }

        function removeTWC(layer){
            map.removeLayer('TWC'+layer)
            map.removeSource('TWC'+layer)
        }

        function addAurora(){
          var aurora;
          var aurora_map = [];
          var valid;
          var canvas = document.getElementById("canvas");
          var ctx = canvas.getContext("2d");
          map.setLayoutProperty('settlement-label-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label', 'visibility', 'none')
          map.setLayoutProperty('dark', 'visibility', 'visible')
          map.setLayoutProperty('water-dark', 'visibility', 'visible')

          fetch('https:\/\/services.swpc.noaa.gov/json/ovation_aurora_latest.json')
            .then(res => res.json())
            .then(data => {
              valid = moment(data["Forecast Time"]).format('llll')
              mappeddata = data.coordinates.map(e=>e[2])
              //have to flip image from portrait to landscape
              for (let y = 0; y<181; y++){
                for (let x=0;x<360;x++){
                    aurora_map.push(mappeddata[y+(x*181)])
                }
              }
              console.log(aurora_map)


                // fetch('https:\/\/services.swpc.noaa.gov/text/aurora-nowcast-map.txt')
                //   .then(res => res.blob())
                //   .then(blob => {
                //     var reader = new FileReader();
                //     reader.onload = function(e){
                //       var raw_file = e.target.result, i = 0, new_lines = 0, kp_start = 0, k=0;

                //       while(i < filesize){
                //         if(raw_file.charCodeAt(i) == 10){
                //           new_lines++;
                //         }
                //         if(new_lines == 17){ //# of lines before actual map starts
                //          kp_start = i+1;
                //           break;
                //         }
                //         i++;
                //       }
                //       valid = raw_file.substring(129,146);
                //       aurora_map =  raw_file.substring(kp_start, filesize); //Trim off beginning section of NOAA file
                //       aurora_map = aurora_map.match(/\d+/g).map(Number);

                //test colormap with low values
                //aurora_map= aurora_map.map(x => x * 3.5);

                $('#AuroraLegend').append(`<b>Probability of Visible Aurora</b><div><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA/IAAAAyCAYAAAD/YuARAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHUSURBVHhe7dexasNAFETRlWzJUvL/P5sUcQqVC3rFwmbCORDk4jEQtrpLa+3n92+c8/reWI7rx41l0t5a3FuLe4/i3mPw3nPw3lbcew7e24p7e3FvH7z3Ku69Bu8dxb1j0t5Hce8s7p3Fvc/i3nZ977jrq97t1/fOf/l///pd9T3aV3Hx211X+a74It6jb/id9+iaduc9uqbdeY+uSXfr9QUAAAACCHkAAAAIIuQBAAAgiJAHAACAIEIeAAAAggh5AAAACCLkAQAAIIiQBwAAgCBCHgAAAIIIeQAAAAgi5AEAACCIkAcAAIAgQh4AAACCCHkAAAAIIuQBAAAgiJAHAACAIEIeAAAAggh5AAAACCLkAQAAIIiQBwAAgCBCHgAAAIIIeQAAAAgi5AEAACCIkAcAAIAgQh4AAACCCHkAAAAIIuQBAAAgiJAHAACAIEIeAAAAggh5AAAACCLkAQAAIIiQBwAAgCBCHgAAAIIIeQAAAAgi5AEAACCIkAcAAIAgQh4AAACCCHkAAAAIIuQBAAAgiJAHAACAIEIeAAAAggh5AAAACCLkAQAAIIiQBwAAgCBCHgAAAIIIeQAAAAgi5AEAACCIkAcAAIAgQh4AAABitPYGL8A0YLcBRUoAAAAASUVORK5CYII=" width="350px"></div><div><div style="display:inline-block; width:32%; text-align:left;">0%</div><div style="display:inline-block; width:32%; text-align:center;">50%</div><div style="display:inline-block; width:32%; text-align:right;">100%</div></div><span style="font-size:15px;font-weight:normal;">Forecast Valid: ${valid}</span>`);
                console.log(`Aurora 30 Min Fcst: ${valid}`);

                // get the imageData and pixel array from the canvas
                //var imgData = ctx.createImageData(1024,512);
                var imgData = ctx.createImageData(360,181);

                var dataM = imgData.data;
                var projection = d3.geoMercator()

                .translate([180,90])
                .scale(180/ (2 * Math.PI))
                //.clipExtent([0,(512-(85/90*512))],[1024,(85/90*512)])

                var path = d3.geoPath(projection)
                //colorize from transparent to green to yellow to pink
                for (let i = 0; i < aurora_map.length; i++) {
                  if (aurora_map[i] === 100){
                    aurora_map[i] = 99
                  }
                  if (aurora_map[i] < 50){
                    dataM[4*i+0] = Math.floor(255 * (aurora_map[i]/50));  //red
                    dataM[4*i+1] = 255;  //green
                    dataM[4*i+2] = 0;
                    dataM[4*i+3]=(aurora_map[i]/30)*255;
                  }
                  else{
                    dataM[4*i] = 255;    //red
                    dataM[4*i+1] = Math.floor(255 * ((50 - aurora_map[i] % 50)/ 50)); //green
                    dataM[4*i+2] = Math.floor(255 * ((aurora_map[i]-50)/ 50));    //blue
                    dataM[4*i+3]=255;
                  }
                  //data.data[4 * i] = data.data[4 * i + 1] = data.data[4 * i + 2] = aurora_map[i];
                  //data.data[4 * i + 3] = 255;
                }
                console.log(imgData)

                // for (var i=0; i<dataM.length;i+=4){
                //   if (aurora_map[k] === 100){
                //     aurora_map[k] = 99
                //   }
                //   if (aurora_map[k] < 50){
                //     dataM[i+0] = Math.floor(255 * (aurora_map[k]/50));  //red
                //     dataM[i+1] = 255;  //green
                //     dataM[i+2] = 0;
                //     dataM[i+3]=(aurora_map[k]/30)*255;
                //   }
                //   else{
                //   dataM[i] = 255;    //red
                //   dataM[i+1] = Math.floor(255 * ((50 - aurora_map[k] % 50)/ 50)); //green
                //   dataM[i+2] = Math.floor(255 * ((aurora_map[k]-50)/ 50));    //blue
                //   dataM[i+3]=255;
                // }
                //   ++k;
                // }
                ctx.putImageData(imgData,0,0,0,0,360,181);

                //ctx.putImageData(imgData,0,0)

                var sourceData = ctx.getImageData(0, 0, 360,181).data,
                target = ctx.createImageData(360,181),
                targetData = target.data;

                //project to mercator, which is close enough to web mercator for our purpose
                for (var y = 0, i = -1; y < 180; ++y) {
                  for (var x = 0; x < 360; ++x) {
                    var p = projection.invert([x, y]), λ = p[0], φ = p[1];
                    if (λ > 180 || λ < -180 || φ > 90 || φ < -90) { i += 4; continue; }
                    //var q = ((90 - φ) / 180 * 512 | 0) * 1024 + ((180 + λ) / 360 * 1024 | 0) << 2;
                    var q = ((90 - φ) / 180 * 180 | 0) * 360 + ((180 + λ) / 360 * 360 | 0) << 2;
                    targetData[++i] = sourceData[q];
                    targetData[++i] = sourceData[++q];
                    targetData[++i] = sourceData[++q];
                    targetData[++i] = sourceData[++q];
                  }
                }
                ctx.clearRect(0, 0, 360, 181);
                ctx.putImageData(target, 0, 0);
                console.log(ctx)

              //reader.readAsText(blob);
              //var filesize = blob.size;

            })
            .then(
              map.addSource('Aurora', {
              type: 'canvas',
              attribution: 'Ovation Aurora Short Term Forecast | Valid: '+ valid,
              canvas: 'canvas',
              //animate: true,
              coordinates: [
                [-180,-85.05],
                [540,-85.05],
                [540,85.05],
                [-180,85.05]
              ]
           }))
           .then(
             map.addLayer({
               'id': 'Aurora',
               'type': 'raster',
               'source': 'Aurora',
               'paint': {
               }
             }, 'settlement-label-dark')

            )
            .catch(error => window.alert("Problem Loading Data."))
          map.flyTo({
            zoom:3.5
          });
          nightEarth()
          //map.on('render', () => console.log(map.getCanvas().toDataURL()));
        }

    function removeAurora(){
      map.removeLayer('Aurora')
      map.removeSource('Aurora')
      $('#AuroraLegend').empty();
      removeNE()
      map.setLayoutProperty('settlement-label-dark', 'visibility', 'none')
      map.setLayoutProperty('settlement-label', 'visibility', 'visible')
      map.setLayoutProperty('dark', 'visibility', 'none')
      map.setLayoutProperty('water-dark', 'visibility', 'none')
    }

    function removeNE(){
      map.removeLayer('nightEarth')
      map.removeSource('nightEarth')
    }

    function nightEarth(){
      var layers = map.getStyle().layers;
      loadingSpinner(true);
      var firstSymbolId;
      for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'hillshade') {
      firstSymbolId = layers[i].id;
      break;
      }
      }
      map.addLayer({
        'id': 'nightEarth',
        'type': 'raster',
        'scheme':'tms',
        'source': {
          'type': 'raster',
          'tiles': [
          'https:\/\/gibs-b.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?TIME=2016-01-01T00:00:00Z&layer=VIIRS_Black_Marble&style=default&tilematrixset=GoogleMapsCompatible_Level8&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}'
            //'https:\/\/gibs-b.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?TIME=2019-08-11T00:00:00Z&layer=VIIRS_CityLights_2012&style=default&tilematrixset=GoogleMapsCompatible_Level8&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}'
          ],
          'tileSize': 256,
          'maxZoom': 8,
        },
        'paint': {}
      }, firstSymbolId);
      map.on('render', stopSpinner);
    }

    function addCPC(outlook){
      map.setLayoutProperty('settlement-label-dark', 'visibility', 'visible')
          map.setLayoutProperty('settlement-label', 'visibility', 'none')
          map.setLayoutProperty('dark', 'visibility', 'visible')
          map.setLayoutProperty('water-dark', 'visibility', 'visible')
      map.flyTo({
        zoom:5
      });
      let day,layer;
      let layers = map.getStyle().layers;
      loadingSpinner(true);
      let firstSymbolId;
      for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'hillshade') {
      firstSymbolId = layers[i].id;
      break;
      }
      }
      if (outlook == '6p'){
        day = 'cpc_6_10_day_outlk';
        layer = 1;
      }
      else if (outlook == '6t'){
        day = 'cpc_6_10_day_outlk';
        layer = 0;
      }
      else if (outlook == '8t'){
        day = 'cpc_8_14_day_outlk';
        layer = 0;
      }
      else {
        day = 'cpc_8_14_day_outlk';
        layer = 1;
      }

      fetch('https:\/\/idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Climate_Outlooks/'+day+'/MapServer/'+layer+'/query?f=geojson&where=(1%3D1)%20AND%20(1%3D1)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=&outSR=4326')
      .then(res => res.json())
      .then(data => {
        // var geojson = {
        //   type: "FeatureCollection",
        //   features: [],
        // };

        // data.features.forEach(e=>{
        //     var polygon,centroid
        //     if (e.geometry.type=='MultiPolygon'){
        //         polygon = turf.multiPolygon(e.geometry.coordinates,{prob:e.properties.prob,cat:e.properties.cat})
        //     }
        //     if (e.geometry.type=='Polygon'){
        //         polygon = turf.polygon(e.geometry.coordinates,{prob:e.properties.prob,cat:e.properties.cat})
        //     }
        //     centroid = turf.centroid(polygon,polygon.properties)
        //     geojson.features.push(centroid)
        //  })

        map.addSource('CPC', {
          type: 'geojson',
          data: data,
        });
        // map.addSource('CPCLab', {
        //   type: 'geojson',
        //   data: geojson,
        // });
        if (layer == 0){
            map.addLayer({
              'id': 'CPC',
              'type': 'fill',  //line or fill
              'source':'CPC',
              'paint':{
                'fill-color': {
                        property: 'prob',
                        stops: [
                          [0,'#fff'],
                          [33,'#fee5d9'],
                          [40,'#fcbba1'],
                          [50,'#fc9272'],
                          [60,'#fb6a4a'],
                          [70,'#ef3b2c'],
                          [80,'#cb181d'],
                          [90,'#99000d'],
                        ],
                        default:'rgba(255,255,255,0.0)',
                      },
              },
              'filter': ['==', 'cat', 'Above']
            }, firstSymbolId);

            map.addLayer({
              'id': 'CPC1',
              'type': 'fill',  //line or fill
              'source':'CPC',
              'paint':{
                'fill-color': {
                        property: 'prob',
                        stops: [
                          [00,'#fff'],
                          [33,'#deebf7'],
                          [40,'#c6dbef'],
                          [50,'#9ecae1'],
                          [60,'#6baed6'],
                          [70,'#4292c6'],
                          [80,'#2171b5'],
                          [90,'#08519c'],
                        ],
                        default:'rgba(255,255,255,0.0)',
                      },
              },
              'filter': ['==', 'cat', 'Below']
            }, firstSymbolId);
            map.addLayer({
              'id': 'CPC2',
              'type': 'fill',  //line or fill
              'source':'CPC',
              'paint':{
                'fill-color': '#fff',
              },
              'filter': ['==', 'cat', 'Normal']
            }, firstSymbolId);
      }
      if (layer == 1){
            map.addLayer({
              'id': 'CPC',
              'type': 'fill',  //line or fill
              'source':'CPC',
              'paint':{
                'fill-color': {
                        property: 'prob',
                        stops: [
                          [0,'#fff'],
                          [33,'#c7eae5'],
                          [40,'#a5cdc6'],
                          [50,'#84b0a8'],
                          [60,'#63938a'],
                          [70,'#42766c'],
                          [80,'#21594e'],
                          [90,'#003c30'],
                        ],
                        default:'rgba(255,255,255,0.0)',
                      },
              },
              'filter': ['==', 'cat', 'Above']
            }, firstSymbolId);

            map.addLayer({
              'id': 'CPC1',
              'type': 'fill',  //line or fill
              'source':'CPC',
              'paint':{
                'fill-color': {
                        property: 'prob',
                        stops: [
                          [0,'#fff'],
                          [33,'rgba(246,232,195,255)'],
                          [40,'rgba(219,201,163,255)'],
                          [50,'rgba(192,170,131,255)'],
                          [60,'rgba(165,140,100,255)'],
                          [70,'rgba(138,109,68,255)'],
                          [80,'rgba(111,78,36,255)'],
                          [90,'rgba(84,48,5,255)'],
                        ],
                        default:'rgba(255,255,255,0.0)',
                      },
              },
              'filter': ['==', 'cat', 'Below']
            }, firstSymbolId);
            map.addLayer({
              'id': 'CPC2',
              'type': 'fill',  //line or fill
              'source':'CPC',
              'paint':{
                'fill-color': '#fff',
              },
              'filter': ['==', 'cat', 'Normal']
            },firstSymbolId);
      }

      map.addLayer({
          'id': 'CPCLab',
          'type': 'symbol',  //line or fill
          'source':'CPC',
          'minzoom': 5,
          'layout':{
            'text-field':'{prob}% {cat}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 24,
          },
          'paint':{
            'text-color':'#000',
            'text-halo-color': 'rgba(255,255,255,1.0)',
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
           'filter': ['any',
             ['==', 'cat', 'Above'],
             ['==', 'cat', 'Below'],
           ],
        });

        map.on('render', stopSpinner);
        map.once('idle', cpcLegend)
        map.on('moveend', cpcLegend)

        function cpcLegend(){
        let tempFillColor = {
          '33% Below Normal':'#deebf7',
          '40% Below Normal':'#c6dbef',
          '50% Below Normal':'#9ecae1',
          '60% Below Normal':'#6baed6',
          '70% Below Normal':'#4292c6',
          '80% Below Normal':'#2171b5',
          '90% Below Normal':'#08519c',
          'Normal':'#fff)',
          '33% Above Normal':'#fee5d9',
          '40% Above Normal':'#fcbba1',
          '50% Above Normal':'#fc9272',
          '60% Above Normal':'#fb6a4a',
          '70% Above Normal':'#ef3b2c',
          '80% Above Normal':'#cb181d',
          '90% Above Normal':'#99000d'}

        let precFillColor = {
          '33% Below Normal':'rgba(246,232,195,255)',
          '40% Below Normal':'rgba(219,201,163,255)',
          '50% Below Normal':'rgba(192,170,131,255)',
          '60% Below Normal':'rgba(165,140,100,255)',
          '70% Below Normal':'rgba(138,109,68,255)',
          '80% Below Normal':'rgba(111,78,36,255)',
          '90% Below Normal':'rgba(84,48,5,255)',
          'Normal':'#fff',
          '33% Above Normal':'#c7eae5',
          '40% Above Normal':'#a5cdc6',
          '50% Above Normal':'#84b0a8',
          '60% Above Normal':'#63938a',
          '70% Above Normal':'#42766c',
          '80% Above Normal':'#21594e',
          '90% Above Normal':'#003c30'}

        if (map.getSource('CPC') && map.isSourceLoaded('CPC')){
                let mapBounds = map.getBounds();
                let hazards
                lhtml = ''
                hazards = map.queryRenderedFeatures({ layers: ['CPC','CPC1','CPC2'] })
                if (hazards[0].properties.idp_source=='610temp_latest'){
                  lhtml = '<b>6-10 Day Temperature Outlook</b>'
                }
                else if (hazards[0].properties.idp_source=='610prcp_latest'){
                  lhtml = '<b>6-10 Day Precipitation Outlook</b>'
                }
                else if (hazards[0].properties.idp_source=='814temp_latest'){
                  lhtml = '<b>8-14 Day Temperature Outlook</b>'
                }
                else if (hazards[0].properties.idp_source=='814prcp_latest'){
                  lhtml = '<b>8-14 Day Precipitation Outlook</b>'
                }
                lhtml += `<br>${moment(hazards[0].properties.start_date).add(1,'day').format("MMM Do")} - ${moment(hazards[0].properties.end_date).add(1,'day').format("MMM Do")}`
                let newElement = []
                hazards.forEach(element => {
                  var feature = element.properties;
                  if (feature.prob=='36'){
                    newElement.push('Normal')
                  } else{
                    newElement.push(`${feature.prob}% ${feature.cat} Normal`)
                  }
                })
                let haznames = [...new Set(newElement)]
                let order = ['90% Above Normal','80% Above Normal','70% Above Normal','60% Above Normal','50% Above Normal','40% Above Normal','33% Above Normal','Normal','33% Below Normal','40% Below Normal','50% Below Normal','60% Below Normal','70% Below Normal','80% Below Normal','90% Below Normal']
                haznames.sort((a, b) => {
                  if (order.indexOf(a) === -1) return 1
                  if (order.indexOf(b) === -1) return -1
                  return order.indexOf(a) - order.indexOf(b)
                })
                console.log(haznames)
                let ret= []
                haznames.map(function(item) {
                let x = item.split(':');
                  ret.push(x)
                })
                ret.forEach(element => {
                if (hazards[0].properties.idp_source =='610temp_latest' || hazards[0].properties.idp_source == '814temp_latest'){
                    lhtml += `<div><span style="background-color: ${tempFillColor[element[0]]}"></span>${element[0]}</div>`
                }
                if (hazards[0].properties.idp_source=='610prcp_latest' ||hazards[0].properties.idp_source == '814prcp_latest'){
                  lhtml += `<div><span style="background-color: ${precFillColor[element[0]]}"></span>${element[0]}</div>`
                }

                })

                $('#cpcLegend').empty();
                $('#cpcLegend').append(lhtml);
              }
          }

    })
    .catch(error => {
      $('#cpcLegend').hide();
      loadingSpinner(false)
      $('.cpc_toggle input.cmn-toggle').not(this).prop('checked', false);
      window.alert("NWS IDP GIS Server Error. Try Again later.")})
    }



    function removeCPC(){
      map.removeLayer('CPC')
      map.removeLayer('CPC1')
      map.removeLayer('CPC2')
      map.removeLayer('CPCLab')
      map.removeSource('CPC')
      map.setLayoutProperty('settlement-label-dark', 'visibility', 'none')
      map.setLayoutProperty('settlement-label', 'visibility', 'visible')
      map.setLayoutProperty('dark', 'visibility', 'none')
      map.setLayoutProperty('water-dark', 'visibility', 'none')
    }

    function addODOTObs(type){
      var geojson = {
          type: "FeatureCollection",
          features: [],
        };

      fetch('https:\/\/test.8222.workers.dev/?https:\/\/tripcheck.com/Scripts/map/data/rw.js')
      .then(res=>res.json())
      .then(data=>{

        data.features.forEach(function(d) {
          if (moment(d.attributes.entryTime).add(8,'hours').isBefore(/*now*/)){
            console.log('entry expired')
            return
          }
              geojson.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": proj4('EPSG:3857', 'EPSG:4326', [d.geometry.x,d.geometry.y])
              },
              "properties": d.attributes
                })
              })
      })
      .then(()=>{
        console.log(geojson)
        map.addSource(`ODOTWxObs${type}`, {
          type: 'geojson',
          data: geojson
        });
        if (type=='snow_depth'){
          map.addLayer({
          'id': `ODOTWxObs${type}`,
          'type': 'circle',
          'source': `ODOTWxObs${type}`,
          'layout':{
            "circle-sort-key": ["to-number", ["get", 'snowDepth']],
          },
          'paint': {
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,.5)',
            'circle-color': {
                  property: 'snowDepth',
                  stops: [
                    [0, 'rgba(0,0,0,0.0)'],
                    [0.1, 'rgba(200,200,200,1.0)'],
                    [5, 'rgba(31, 134, 255,1.0)'],
                    [10, 'rgba(60,52,212,1.0)'],
                    [20, 'rgba(121,26,233,1.0)'],
                    [50, 'rgba(182,0,255,1.0)'],
                    [75, 'rgba(233,0,213,1.0)'],
                    [100.0, 'rgba(212,0,114,1.0)'],
                    [200.0, 'rgba(191,0,32,1.0)'],
                  ],
                  default: 'rgba(255,255,255,0.0)',
                },
                "circle-radius": [
                      "interpolate", ["linear"],
                        ["zoom"],
                        4, 6,
                        7, 12,
                      11, 18,
                      ],
          },
          //'filter': ['has', 'snowDepth']
          'filter': ['>=', 'snowDepth', 0]
        }, 'settlement-label');

            map.addLayer({
              'id': `ODOTWxObs1${type}`,
              'type': 'symbol',
              'source': `ODOTWxObs${type}`,
              'layout': {
                //'text-allow-overlap': true,
                "symbol-sort-key": ["to-number", ["get", 'snowDepth']],
                'text-field': '{snowDepth}',
                'text-font': [
                  "Open Sans Condensed Bold",

                ],
                'text-size': [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 14,
                  7, 18,
                  11, 22,
                ],
              },
              'paint': {
                'text-color':'rgba(255,255,255,1.0)',
                'text-halo-color': 'rgba(0,0,0,1.0)',
                'text-halo-width': 1.5,
                'text-halo-blur': 1,
              },
              'filter': ['>=', 'snowDepth', 0]
              //'filter': ['==', 'snowDepth', 'null']
              //'filter': ['has', 'snowDepth']
            }, 'settlement-label');
        }
        if (type == 'snowfall'){
          map.addLayer({
          'id': `ODOTWxObs${type}`,
          'type': 'circle',
          'source': `ODOTWxObs${type}`,
          'paint': {
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,.5)',
            'circle-color': {
                  property: 'snowfall',
                  stops: [
                    [0, 'rgba(0,0,0,0.0)'],
                    [0.1, 'rgba(150,150,150,1.0)'],
                    [1, 'rgba(200,200,200,1.0)'],
                    [2, 'rgba(50,150,255,1.0)'],
                    [3, 'rgba(0,100,225,1.0)'],
                    [4, 'rgba(60,52,212,1.0)'],
                    [6, 'rgba(121,26,233,1.0)'],
                    [8, 'rgba(182,0,255,1.0)'],
                    [12, 'rgba(255,0,255,1.0)'],
                    [18.0, 'rgba(212,0,114,1.0)'],
                    [24.0, 'rgba(191,0,32,1.0)'],
                    [36.0, 'rgba(120,0,0,1.0)'],
                  ],
                  default: 'rgba(255,255,255,0.0)',
                },
                "circle-radius": [
                      "interpolate", ["linear"],
                        ["zoom"],
                        4, 6,
                        7, 12,
                      11, 18,
                      ],
          },
          'filter': ['>=', 'snowfall', 0]
        }, 'settlement-label');

            map.addLayer({
              'id': `ODOTWxObs1${type}`,
              'type': 'symbol',
              'source': `ODOTWxObs${type}`,
              'layout': {
                //'text-allow-overlap': true,
                'text-field': '{snowfall}',
                'text-font': [
                  "Open Sans Condensed Bold",

                ],
                'text-size': [
                  "interpolate", ["linear"],
                  ["zoom"],
                  4, 14,
                  7, 18,
                  11, 22,
                ],
              },
              'paint': {
                'text-color':'rgba(255,255,255,1.0)',
                'text-halo-color': 'rgba(0,0,0,1.0)',
                'text-halo-width': 1.5,
                'text-halo-blur': 1,
              },
              'filter': ['>=', 'snowfall', 0]
            }, 'settlement-label');
        }

          map.on('click', `ODOTWxObs${type}`, function(e) {
          let phtml='';
          phtml += `<div class='popup-header'>${e.features[0].properties.linkName}-${e.features[0].properties.locationName}</div>`
          phtml += `${moment(e.features[0].properties.entryTime).format('llll')}<br>`
          if (e.features[0].properties.pavementConditionDesc !== 'null'){
            phtml += `Road Condition: <b>${e.features[0].properties.pavementConditionDesc}</b><br>`
          }
          if (e.features[0].properties.weatherConditionDesc !== 'null'){
            phtml += `Weather: <b>${e.features[0].properties.weatherConditionDesc}</b><br>`
          }
          if (e.features[0].properties.tempCurr !=='null'){
            phtml += `Current Temperature: <b>${e.features[0].properties.tempCurr}&deg;F</b><br>`
          }
          if (e.features[0].properties.snowDepth !== 'null'){
            if (e.features[0].properties.snowDepth == -1){
              phtml += `Snow Depth: <b>Trace</b><br>`
            }
            else{
              phtml += `Snow Depth: <b>${e.features[0].properties.snowDepth}"</b><br>`
            }
          }
          if (e.features[0].properties.snowfall !== 'null'){
            if (e.features[0].properties.snowfall == -1){
              phtml += `New Snow: <b>Trace</b><br>`
            }
            else{
            phtml += `New Snow: <b>${e.features[0].properties.snowfall}"</b><br>`
            }
          }
          new mapboxgl.Popup({offset:[0,2]})
          .setLngLat(e.lngLat)
          .setHTML(phtml)
          //.setHTML('<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.alert +'</div><br><a href="' + e.features[0].properties.Link + '" target="Popup" onclick="window.open(\'' + e.features[0].properties.link + '\',\'popup\',\'width=900,height=800\'); return false;">Volcano Page</a></span>')
          .addTo(map);
        });

      })
    }
    function removeODOTObs(type){
      map.removeLayer(`ODOTWxObs${type}`)
      map.removeLayer(`ODOTWxObs1${type}`)
      map.removeSource(`ODOTWxObs${type}`)
    }

    function addmwSWE(type){
      loadingSpinner(true);
        map.addSource(`mwSWE${type}`, {
          type: 'geojson',
          data: `https:\/\/api.synopticdata.com/v2/stations/latest?token=${mesoToken}&within=360&output=geojson&vars=snow_depth,snow_water_equiv&units=english`
        });
        map.addLayer({
          'id': `mwSWE${type}`,
          'type': 'circle',
          'source': `mwSWE${type}`,
          'layout':{
            "circle-sort-key": ["to-number", ["get", `${type}`]],
          },
          'paint': {
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,.5)',
            "circle-radius": [
                  "interpolate", ["linear"],
                    ["zoom"],
                    4, 6,
                    7, 12,
                   11, 18,
                   ],
            'circle-color': {
              property: `${type}`,
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [0.1, 'rgba(200,200,200,1.0)'],
                [5, 'rgba(31,134,255,1.0)'],
                [10, 'rgba(60,52,212,1.0)'],
                [20, 'rgba(121,26,233,1.0)'],
                [50, 'rgba(182,0,255,1.0)'],
                [75, 'rgba(233,0,213,1.0)'],
                [100.0, 'rgba(212,0,114,1.0)'],
                [200.0, 'rgba(191,0,32,1.0)'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
            //'circle-blur': 0.4,
          },
          'filter': ['all',
          ['has', `${type}`],
          ['<',`${type}`,150]],
        }, 'settlement-label');

        map.addLayer({
          'id': `mwSWE1${type}`,
          'type': 'symbol',
          'source': `mwSWE${type}`,
          'layout': {
            //'text-allow-overlap': true,
            "symbol-sort-key": ["to-number", ["get", `${type}`]],
            'text-field': ['number-format', ['get', `${type}`], {
              'min-fraction-digits': 0,
              'max-fraction-digits': 1
            }],
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              "interpolate", ["linear"],
              ["zoom"],
              4, 14,
              7, 18,
              11, 22,
            ],
          },
          'paint': {
            'text-color':'rgba(255,255,255,1.0)',
            'text-halo-color': 'rgba(0,0,0,1.0)',
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
          'filter': ['all',
          ['has', `${type}`],
          ['<',`${type}`,150]],
        }, 'settlement-label');

        map.on('render', stopSpinner);
        map.on('click', `mwSWE${type}`, function(e) {
          var typem;
          var url;
          // if (type == 'snow_water_equiv'){
          //   typem = 'Snow Water Equivalent';
          //   url = e.features[0].properties.snow_water_equiv;
          // }
          // else{
          //   typem = 'Snow Depth'
          //   url = e.features[0].properties.snow_depth;
          // }
          new mapboxgl.Popup({offset:[0,2]})
          .setLngLat(e.lngLat)
          .setHTML(`<div class="popup-header">${e.features[0].properties.name} - ${e.features[0].properties.stid}</div><span>${moment(e.features[0].properties.date_time).format('llll')}<br>
          SWE: <b>${e.features[0].properties.snow_water_equiv}"</b><br>
          Snow Depth: <b>${e.features[0].properties.snow_depth}"</b><br>
          <a href="https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0].properties.stid}" target="Popup" onclick="window.open('https:\/\/www.weather.gov/wrh/timeseries?site=${e.features[0].properties.stid},'popup','width=900,height=800'); return false;">3-Day History</a></span>`)
          .addTo(map);
        });

        map.on('mouseenter', `mwSWE${type}`, function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', `mwSWE${type}`, function() {
          map.getCanvas().style.cursor = '';
        });

        var ar = ["all"];
        ar.push(['<',`${type}`,150])
        map.on('dblclick',`mwSWE${type}`,function(e){
          var stid = e.features[0].properties.stid;
          var stn = ['!=', 'stid', e.features[0].properties.stid];

          ar.push(stn);
          console.table(ar);
          map.setFilter(`mwSWE${type}`, ar
          );

          map.setFilter(`mwSWE${type}`, ar
          );
        })
    }

    function removemwSWE(type){
      map.removeLayer(`mwSWE${type}`)
      map.removeLayer(`mwSWE1${type}`)
      map.removeSource(`mwSWE${type}`)
    }

    function addVolcano(){
      loadingSpinner(true);
      var usgsGeojson;
      var usgs;
      fetch('https:\/\/test.8222.workers.dev/?https:\/\/www.usgs.gov/volcano')
          .then(res => res.text())
          .then(str => {
              var parser = new DOMParser()
              var infoObj = parser.parseFromString(str,'text/html')
              let scripts = [...infoObj.querySelectorAll('script')]      // get all the divs in an array
                .map(div => div.innerHTML)               // get their contents
                .filter(txt => txt.includes('jsVolcanoesData')) // keep only those containing the query
                .forEach(txt => {usgs = txt})
              //console.log(usgs)
              usgs = usgs.split('};',1)
              console.log(usgs)
              usgs = `${usgs[0]}}`
              usgs = usgs.slice(24)
              console.log(usgs)
              usgsGeojson = JSON.parse(usgs)
          })
          .then(()=>{

            console.log(usgsGeojson)
        map.addSource('Volcano', {
          type: 'geojson',
          data: usgsGeojson
        });
        map.addLayer({
          'id': 'Volcano',
          'type': 'circle',
          'source': 'Volcano',
          'paint': {
            'circle-stroke-width':1,
            'circle-stroke-color':'rgba(0,0,0,.5)',
            "circle-radius": [
              'match',
              ['get', 'color'],
              'GREEN', 13,
              'YELLOW', 16,
              'ORANGE', 20,
              'RED', 25,
              10
            ],
            'circle-color': [
              'match',
              ['get', 'color'],
              'GREEN', 'rgba(0, 255, 0, 1)',
              'YELLOW', 'rgba(255, 255, 0, 1)',
              'ORANGE', 'rgba(255, 175, 0, 1)',
              'RED', 'rgba(255, 0, 0, 1)',
              'rgba(0,0,0,0)'
            ],
          },
          //'filter': ['has', ''+type+'']
        }, 'settlement-label');

        map.addLayer({
          'id': 'Volcano1',
          'type': 'symbol',
          'source': 'Volcano',
          'layout': {
            'text-allow-overlap': true,
            //'text-field': '{'+type+'}',
            'text-offset': [0, 1.5],
            'text-field': '{name}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              'match',
              ['get', 'color'],
              'GREEN', 10,
              'YELLOW', 18,
              'ORANGE', 22,
              'RED', 25,
              10
            ],
          },
          'paint': {
            'text-color': [
              'match',
              ['get', 'color'],
              'GREEN', 'rgba(0, 0, 0, 0)',
              'YELLOW', 'rgba(255, 255, 0, 1)',
              'ORANGE', 'rgba(255, 175, 0, 1)',
              'RED', 'rgba(255, 0, 0, 1)',
              'rgba(0,0,0,0)'
            ],
            'text-halo-color': [
              'match',
              ['get', 'color'],
              'GREEN', 'rgba(0, 0, 0, 0)',
              'YELLOW', 'rgba(0, 0, 0, 1)',
              'ORANGE', 'rgba(0, 0, 0, 1)',
              'RED', 'rgba(0, 0, 0, 1)',
              'rgba(0,0,0,0)'
            ],
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
          //'filter': ['has', ''+type+'']
        }, 'settlement-label');

          })
        // map.addSource('Volcano', {
        //   type: 'geojson',
        //   data: 'https:\/\/oregonem.com/arcgis/rest/services/Public/Volcano_Status/MapServer/0/query?f=geojson&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Volcano_Name%20asc&resultOffset=0'
        // });
        var volcgeojson = {
          type: "FeatureCollection",
          features: [],
        };

        fetch('https:\/\/avo.alaska.edu/includes/js/map/json_russian.js')
          .then(res => res.json())
          .then(data => data.russian.forEach(function(d) {
            volcgeojson.features.push({
                 "type": "Feature",
                 "geometry": {
                   "type": "Point",
                   "coordinates": [Number(d.lng), Number(d.lat)]
                },
                "properties": {
                    "Volcano_Name": d.name,
                    "Color_Code": d.color,
                    }
            })
            })
          )

        fetch('https:\/\/avo.alaska.edu/includes/js/map/json_kuriles.js')
          .then(res => res.json())
          .then(data => data.kuriles.forEach(function(d) {
            volcgeojson.features.push({
                 "type": "Feature",
                 "geometry": {
                   "type": "Point",
                   "coordinates": [Number(d.lng), Number(d.lat)]
                },
                "properties": {
                    "Volcano_Name": d.name,
                    "Color_Code": d.color,
                    }
            })
            })
          )
          .then(() => {
              map.addSource('VolcanoK', {
                type: 'geojson',
                data: volcgeojson,
              })
              map.addLayer({
                'id': 'Volcano2',
                'type': 'circle',
                'source': 'VolcanoK',
                'paint': {
                  'circle-stroke-width':1,
                  'circle-stroke-color':'rgba(0,0,0,.5)',
                  "circle-radius": [
                    'match',
                    ['get', 'Color_Code'],
                    'GREEN', 13,
                    'YELLOW', 16,
                    'ORANGE', 20,
                    'RED', 25,
                    10
                  ],
                  'circle-color': [
                    'match',
                    ['get', 'Color_Code'],
                    'GREEN', 'rgba(0, 255, 0, 1)',
                    'YELLOW', 'rgba(255, 255, 0, 1)',
                    'ORANGE', 'rgba(255, 175, 0, 1)',
                    'RED', 'rgba(255, 0, 0, 1)',
                    'rgba(0,0,0,0)'
                  ],
                },
                //'filter': ['has', ''+type+'']
              }, 'settlement-label')

        map.addLayer({
          'id': 'Volcano3',
          'type': 'symbol',
          'source': 'VolcanoK',
          'layout': {
            'text-allow-overlap': true,
            //'text-field': '{'+type+'}',
            'text-offset': [0, 1.5],
            'text-field': '{Volcano_Name}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': [
              'match',
              ['get', 'Color_Code'],
              'GREEN', 10,
              'YELLOW', 18,
              'ORANGE', 22,
              'RED', 25,
              10
            ],
          },
          'paint': {
            'text-color': [
              'match',
              ['get', 'Color_Code'],
              'GREEN', 'rgba(0, 0, 0, 0)',
              'YELLOW', 'rgba(255, 255, 0, 1)',
              'ORANGE', 'rgba(255, 175, 0, 1)',
              'RED', 'rgba(255, 0, 0, 1)',
              'rgba(0,0,0,0)'
            ],
            'text-halo-color': [
              'match',
              ['get', 'Color_Code'],
              'GREEN', 'rgba(0, 0, 0, 0)',
              'YELLOW', 'rgba(0, 0, 0, 1)',
              'ORANGE', 'rgba(0, 0, 0, 1)',
              'RED', 'rgba(0, 0, 0, 1)',
              'rgba(0,0,0,0)'
            ],
            'text-halo-width': 1.5,
            'text-halo-blur': 1,
          },
          //'filter': ['has', ''+type+'']
        }, 'settlement-label')
          })
          .catch(error => window.alert("Kamchatka Peninsula volcano data not loaded"))



        map.on('render', stopSpinner);
        map.on('click', 'Volcano', function(e) {
          new mapboxgl.Popup({offset:[0,2]})
          .setLngLat(e.lngLat)
          .setHTML('<div class="popup-header">'+e.features[0].properties.name +' - '+ e.features[0].properties.alert +'</div><br><a href="' + e.features[0].properties.Link + '" target="Popup" onclick="window.open(\'' + e.features[0].properties.link + '\',\'popup\',\'width=900,height=800\'); return false;">Volcano Page</a></span>')
          .addTo(map);
        });

        map.on('mouseenter', 'Volcano', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'Volcano', function() {
          map.getCanvas().style.cursor = '';
        });

        var ar = ["all"];
        map.on('dblclick','Volcano',function(e){
          var stid = e.features[0].properties.stid;
          var stn = ['!=', 'name', e.features[0].properties.name];

          ar.push(stn);
          console.table(ar);
          map.setFilter('Volcano', ar
          );

          map.setFilter('Volcano1', ar
          );
        })
    }

    function removeVolcano(){
      map.removeLayer('Volcano')
      map.removeLayer('Volcano1')
      map.removeLayer('Volcano2')
      map.removeLayer('Volcano3')
      map.removeSource('Volcano')
      map.removeSource('VolcanoK')
    }

    function addNCDCLtg(start,end){
      loadingSpinner(true);
      var mapCenter = map.getCenter();
      mapCenter.lng = mapCenter.lng
      mapCenter.lat = mapCenter.lat

      var bbox1 = [mapCenter.lng-14.9,mapCenter.lat-7.5,mapCenter.lng,mapCenter.lat+7.4]
      bbox1 = bbox1.map(a=>a.toFixed(1))
      var bbox2 = [mapCenter.lng,mapCenter.lat-7.5,mapCenter.lng+14.9,mapCenter.lat+7.4]
      bbox2 = bbox2.map(a=>a.toFixed(1))

      console.log(bbox1)
      console.log(bbox2)
      //let s = map.getBounds().getSouth().toFixed(2);
      //let n = map.getBounds().getNorth().toFixed(2);
      //let w = map.getBounds().getWest().toFixed(2);
      //let e = map.getBounds().getEast().toFixed(2);
      var ltggeojson = {
          type: "FeatureCollection",
          features: [],
        };
        //bbox limited to 15 deg
          //date 2020043000:2020050100
          //d3.csv(`https:\/\/www.ncdc.noaa.gov/swdiws/csv/nldn/${start}:${end}?bbox=${w},${s},${e},${n}`)
          Promise.all([
          d3.csv(`https:\/\/www.ncdc.noaa.gov/swdiws/csv/nldn/${start}:${end}?bbox=${bbox1.toString()}`)
          //d3.csv(`https:\/\/www.ncdc.noaa.gov/swdiws/csv/nldn/${start}:${end}`)
            .then(function(data){
              data.forEach(d => {
                ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.LON),Number(d.LAT)]
                  },
                  "properties": {
                      "Polarity": d.POLARITY,
                      "TimeStamp": moment(d.ZTIME,'YYYY-MM-DDTHH:mm:ssZ').valueOf(),
                      }
              })
              })
            }),
            d3.csv(`https:\/\/www.ncdc.noaa.gov/swdiws/csv/nldn/${start}:${end}?bbox=${bbox2.toString()}`)
            .then(function(data){
              data.forEach(d => {
                ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.LON),Number(d.LAT)]
                  },
                  "properties": {
                      "Polarity": d.POLARITY,
                      "TimeStamp": moment(d.ZTIME,'YYYY-MM-DDTHH:mm:ssZ').valueOf(),
                      }
              })
              })
            })
              // .row(function(d){
              //   ltggeojson.features.push({
              //     "type": "Feature",
              //     "geometry": {
              //       "type": "Point",
              //       "coordinates": [Number(d.LON),Number(d.LAT)]
              //     },
              //     "properties": {
              //         "Polarity": d.POLARITY,
              //         }
              // })
          //})
          ])
        .then(()=> {
          console.log(ltggeojson)
          map.addSource('NCDCLtg', {
            type: 'geojson',
            data: ltggeojson,
            //attribution: 'Valid: '+ end,
          })

      map.addLayer({
        'id': 'NCDCLtg',
        'type': 'circle',
        'source': 'NCDCLtg',
        'paint': {
          "circle-radius": 4,
          //"circle-stroke-transition": {duration: 0},
          //"circle-stroke-opacity-transition": {duration: 0},
          //'circle-stroke-width':2,
          'circle-opacity': 0.7,
          //"circle-radius": 4,
          'circle-color': [
            'match',
            ['get', 'Polarity'],
            'P', 'rgba(250, 0, 0, 1)',
            'N', 'rgba(0, 0, 250, 1)',
            'rgba(0,0,0,0)'
          ],
          //'circle-blur': 0.4,
        }
        //'filter': ['has', ''+type+'']
      }, 'settlement-label')
        loadingSpinner(false)
      map.on('render', function(e) {
                if (map.getSource('NCDCLtg') && map.isSourceLoaded('NCDCLtg')){
                  let mapBounds = map.getBounds();
                  var strikes = 0;
                  strikes = map.queryRenderedFeatures([map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())],{ layers: ['NCDCLtg'] })
                  document.getElementById('ltgCt').innerHTML = strikes.length
                }

              });


    })
    .catch(e => {
      loadingSpinner(false)
      console.log(e)
      $('.ltg1_toggle input.cmn-toggle').not(this).prop('checked', false);
      //$('.ltg1_toggle').prop('checked', false);
    })
    map.on('moveend', function(e) {
        if (map.getSource('NCDCLtg') && map.isSourceLoaded('NCDCLtg')){
          let mapBounds = map.getBounds();
          var strikes = 0;
          strikes = map.queryRenderedFeatures([map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())],{ layers: ['NCDCLtg'] })
                  document.getElementById('ltgCt').innerHTML = strikes.length
        }
       });
       var popup =  new mapboxgl.Popup({closeButton: false})
       map.on('mouseenter','NCDCLtg', function(e) {
        popup.setLngLat(e.lngLat)
        .setHTML('<div class="popup-header">'+moment(e.features[0].properties.TimeStamp).format('MMMM Do YYYY, h:mm a') + '</div>')
        .addTo(map);
        });

        map.on('mouseenter', 'NCDCLtg', function() {
        map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'NCDCLtg', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });
    }

    function addETLNLtg(){
        // map.loadImage('https:\/\/upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/30px-Plus_symbol.svg.png',function(error,image){
        //   if (error) throw error
        //   map.addImage('plus15', image,{sdf:true})
        // })
        // map.loadImage('https:\/\/upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Minus_symbol.svg/30px-Minus_symbol.svg.png',function(error,image){
        //   if (error) throw error
        //   map.addImage('minus15', image,{sdf:true})
        // })

      let now = moment.utc().format('YYYY-MM-DDTHH:mm:ss')
      let past = moment.utc().subtract(4,'Hours').format('YYYY-MM-DDTHH:mm:ss')
      console.log(now,past)
      loadingSpinner(true);
        var ltggeojson = {
          type: "FeatureCollection",
          features: [],
        };

        var flashgeojson = {
          type: "FeatureCollection",
          features: [],
        };

        var myHeaders = new Headers();
        myHeaders.append('x-api-key', etlnKey);
        myHeaders.append('Access-Control-Allow-Origin', '*');

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        //mode:'cors',
        //redirect: 'follow'
        };
        Promise.all([
        fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error()),
          fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}&lastRecCnt=40000`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error()),
          fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}&lastRecCnt=80000`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error()),
          fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}&lastRecCnt=120000`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error()),
          fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}&lastRecCnt=160000`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error()),
          fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}&lastRecCnt=200000`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error()),
          fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}&lastRecCnt=240000`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error()),
          fetch(`https:\/\/test.8222.workers.dev/?https:\/\/lxneartime.api.earthnetworks.com/v1/flashes?startDateTime=${past}&endDateTime=${now}&lastRecCnt=280000`,requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.flashes){
            data.flashes.forEach(function(d) {
              if (d.typ == 1){
              flashgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else if(d.typ==0){
              ltggeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [Number(d.lon), Number(d.lat)]
                  },
                  "properties": {
                      "TimeStamp": d.ts,
                      "Age": moment(now).diff(d.ts,'minutes'),
                      "Polarity": d.pol,
                      }
              })
            }
            else{
              console.log(d.typ)
            }
            })
          }
          })
          .catch(e=>console.error())
          ])
          .then(() => {
              map.addSource('ETLNLtg', {
                type: 'geojson',
                data: ltggeojson,
                //attribution: 'Valid: '+ end,
              })
              map.addSource('ETLNFlash', {
                type: 'geojson',
                data: flashgeojson,
                //attribution: 'Valid: '+ end,
              })
              console.log(ltggeojson)
              console.log(flashgeojson)

              map.addLayer({
                'id': 'ETLNFlash',
                'type': 'circle',
                'source': 'ETLNFlash',
                'paint': {
                  "circle-radius": [
                  "interpolate", ["linear"],
                    ["zoom"],
                    5, 2,
                    8, 3,
                   11, 4,
                   ],
                  //"circle-stroke-transition": {duration: 0},
                  //"circle-stroke-opacity-transition": {duration: 0},
                  'circle-stroke-width':1,
                  'circle-stroke-color': 'rgba(0,0,0,1)',
                  'circle-stroke-opacity': {
                    property: 'Age',
                    stops: [
                      [0, 0.8],
                      [15, 0.5],
                      [30, 0.2],
                      // [45, 0.55],
                      // [60, 0.4],
                    ],
                    default: 0.1,
                  },
                  'circle-opacity': {
                    property: 'Age',
                    stops: [
                      [0, 0.8],
                      [15, 0.5],
                      [30, 0.2],
                    ],
                    default: 0.1,
                  },
                  //"circle-radius": 4,
                  'circle-color': {
                    property: 'Age',
                    stops: [
                      [0, 'rgba(255,0,255,1)'],
                      [15, 'rgba(255,150,0,1)'],
                      [30, 'rgba(255,255,0,1)'],
                    ],
                    default:'rgba(255,255,255,1)',
                  },
                },
                //'filter': ['==', 'Typ', 1],
              }, 'settlement-label')
              map.addLayer({
                'id': 'ETLNLtg',
                //'type': 'circle',
                'type': 'symbol',
                'source': 'ETLNLtg',
                'layout': {
                  'icon-image': 'lightning',
                  'icon-size': [
                  "interpolate", ["linear"],
                    ["zoom"],
                    5, 0.3,
                    8, 0.6,
                    11, 1.0,
                   ],
                  'icon-allow-overlap': true,
                },
                'paint': {
                  // "circle-radius": [
                  // "interpolate", ["linear"],
                  //   ["zoom"],
                  //   5, 1,
                  //   8, 3,
                  //   11, 5,
                  //  ],
                  //"circle-stroke-transition": {duration: 0},
                  //"circle-stroke-opacity-transition": {duration: 0},
                  //'circle-stroke-width':2,
                  'icon-opacity': {
                    property: 'Age',
                    stops: [
                      [0, 0.9],
                      [15, 0.6],
                      [30, 0.3],
                      // [45, 0.55],
                      // [60, 0.4],
                    ],
                    default: 0.2,
                  },
                  //"circle-radius": 4,
                  'icon-color':
                  [
                    'match',
                    ['get', 'Polarity'],
                    'P', 'rgba(255, 0, 0, 1)',
                    'N', 'rgba(0, 0, 255, 1)',
                    'rgba(0,0,0,0)'
                  ],
                  //'circle-blur': 0.4,
                },
               // 'filter': ['==', 'Typ', 0],
              }, 'settlement-label')

          // map.addLayer(
          // {
          // 'id': 'ETLNLtg-heat',
          // 'type': 'heatmap',
          // 'source': 'ETLNLtg',
          // 'maxzoom': 9,
          // 'paint': {
          // // // Increase the heatmap weight based on frequency and property magnitude
          // 'heatmap-weight': 1,
          // // {
          // //           property: 'Age',
          // //           stops: [
          // //             [0, 1],
          // //             [15, 0.85],
          // //             [30, 0.7],
          // //             [45, 0.55],
          // //             [60, 0.4],
          // //           ],
          // //           default: 0.2,
          // //         },
          // // 'heatmap-weight': [
          // // 'interpolate',
          // // ['linear'],
          // // ['get', 'mag'],
          // // 0,
          // // 0,
          // // 6,
          // // 1
          // // ],
          // // // Increase the heatmap color weight weight by zoom level
          // // // heatmap-intensity is a multiplier on top of heatmap-weight
          // //'heatmap-intensity': 0.5,
          // 'heatmap-intensity': [
          // 'interpolate',
          // ['linear'],
          // ['zoom'],
          // 0,
          // 1,
          // 9,
          // 3
          // ],
          // // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // 'heatmap-color': [
          // 'interpolate',
          // ['linear'],
          // ['heatmap-density'],
          // 0,'rgba(0,0,0,0)',
          // 0.01, 'rgba(200,200,200,0.33)',
          // 0.2, 'rgba(38,217,255,1.0)',
          // 0.3, 'rgba(64,191,255,1.0)',
          // 0.4, 'rgba(89,166,255,1.0)',
          // 0.5, 'rgba(115,140,255,1.0)',
          // 0.6, 'rgba(140,115,255,1.0)',
          // 0.7, 'rgba(166,89,255,1.0)',
          // 0.8, 'rgba(191,64,255,1.0)',
          // 0.9, 'rgba(217,38,255,1.0)',
          // 1.0, 'rgba(242,13,255,1.0)'
          // ],
          // // Adjust the heatmap radius by zoom level
          // 'heatmap-radius': [
          // 'interpolate',
          // ['linear'],
          // ['zoom'],
          // 0,
          // 1,
          // 9,
          // 10
          // ],
          // // Transition from heatmap to circle layer by zoom level
          // 'heatmap-opacity': [
          // 'interpolate',
          // ['linear'],
          // ['zoom'],
          // 7,
          // 1,
          // 9,
          // 0
          // ]
          // }
          // },
          // 'waterway-label'
          // );


              map.on('render', function(e) {
                if (map.getSource('ETLNLtg') && map.isSourceLoaded('ETLNLtg')){
                  let mapBounds = map.getBounds();
                  var pulses = 0;
                  var strikes = 0;
                  strikes = map.queryRenderedFeatures([map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())],{ layers: ['ETLNLtg'] })
                  pulses = map.queryRenderedFeatures([map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())],{ layers: ['ETLNFlash'] })
                  $('#ltgCt').html(strikes.length)
                  $('#pulseCt').html(pulses.length)
                }
              });
              map.on('render', stopSpinner)

    })



    map.on('moveend', function(e) {
        if (map.getSource('ETLNLtg') && map.isSourceLoaded('ETLNLtg')){
          let mapBounds = map.getBounds();
          var strikes = 0;
          var pulses = 0;
          strikes = map.queryRenderedFeatures([map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())],{ layers: ['ETLNLtg'] })
          pulses = map.queryRenderedFeatures([map.project(mapBounds.getSouthWest()), map.project(mapBounds.getNorthEast())],{ layers: ['ETLNFlash'] })
          $('#ltgCt').html(strikes.length)
          $('#pulseCt').html(pulses.length)
        }
       });
       var popup =  new mapboxgl.Popup({closeButton: false})
       map.on('mouseenter','ETLNLtg', function(e) {
        popup.setLngLat(e.lngLat)
        .setHTML('<div class="popup-header">'+moment(e.features[0].properties.TimeStamp+'Z').format('LLL') + '</div>')
        .addTo(map);
        });

        map.on('mouseenter', 'ETLNLtg', function() {
        map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'ETLNLtg', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });
    }

    function removeETLNLtg(){
      map.removeLayer('ETLNLtg')
      map.removeLayer('ETLNFlash')
      map.removeSource('ETLNLtg')
      map.removeSource('ETLNFlash')
    }

    function removeNCDCLtg(){
      map.removeLayer('NCDCLtg')
      map.removeSource('NCDCLtg')
    }

    function addPointandClick(file){
      loadingSpinner(true);
        var pcgeojson = {
          type: "FeatureCollection",
          features: [],
        };
        d3.csv("./"+file+".csv")
          .then(function(data) {
              //console.log(data.slice(0,10))
              data.forEach(d => {
              const reg = /Latitude (\d{2}\.\d+|\d{2})°N/g;
              const reg2 = /Longitude (\d{3}\.\d+|\d{3})°W/g;
              let match, match1, match2, pcLon, pcLat;
              const reg1 = / ft[)]/g;
              while (match1 = reg1.exec(d.PageTitle)){
                while (match = reg.exec(d.PageTitle)) {
                    pcLat = parseFloat(match[1] || match[0]);
                }
                while (match2 = reg2.exec(d.PageTitle)) {
                    pcLon = parseFloat(match2[1] || match2[0]);
                }
                //parseFloat(d.Pageviews.replace(/,/g, ''));
                //console.log(pcLat,pcLon,Number(d.Pageviews))
                pcgeojson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [-pcLon, pcLat]
                  },
                  "properties": {
                      "count": Number(d.Pageviews),
                      }
                })
              }
            })
        })
        .then(() => {
          console.log(pcgeojson)
          map.addSource(file, {
          type: 'geojson',
          data: pcgeojson
        });
        map.addLayer({
          'id': file,
          'type': 'circle',
          'source': file,
          'layout': {
            "circle-sort-key": ["get", "count"],
          },
          'paint': {
            'circle-stroke-width':[
                  "interpolate", ["linear"],
                    ["zoom"],
                    6, 0,
                    8, 1,
                   11, 2,
                   ],
            'circle-stroke-color':'rgba(0,0,0,.5)',
            "circle-radius": [
                  "interpolate", ["linear"],
                    ["zoom"],
                    5, 1,
                    6, 1.5,
                    8, 5,
                   11, 10,
                   ],
            'circle-color': {
              property: 'count',
              stops: [
                [0, 'rgba(0,0,0,0.0)'],
                [1, 'rgba(0,255,255,1.0)'],
                [50, 'rgba(38,217,255,1.0)'],
                [100, 'rgba(64,191,255,1.0)'],
                [1000, 'rgba(89,166,255,1.0)'],
                [5000, 'rgba(115,140,255,1.0)'],
                [10000, 'rgba(140,115,255,1.0)'],
                [50000, 'rgba(166,89,255,1.0)'],
                [100000, 'rgba(191,64,255,1.0)'],
                [250000, 'rgba(217,38,255,1.0)'],
                [500000, 'rgba(242,13,255,1.0)'],
                // [0, 'rgba(0,0,0,0.0)'],
                // [1, 'rgba(255,255,255,0.33)'],
                // [50, 'rgba(231,225,239,1.0)'],
                // [100, 'rgba(212,185,218,1.0)'],
                // [1000, 'rgba(201,148,199,1.0)'],
                // [5000, 'rgba(223,101,176,1.0)'],
                // [10000, 'rgba(231,41,138,1.0)'],
                // [50000, 'rgba(206,18,86,1.0)'],
                // [100000, 'rgba(152,0,67,1.0)'],
                // [500000, 'rgba(103,0,31,1.0)'],
              ],
              default: 'rgba(255,255,255,0.0)',
            },
          },
          //'filter': ['has', ''+type+'']
        }, 'settlement-label');

        map.on('render', stopSpinner)
        var popup =  new mapboxgl.Popup()
        map.on('click',file, function(e) {
          popup.setLngLat(e.lngLat)
        .setHTML('<div class="popup-header">'+e.features[0].properties.count+'</div>'+e.lngLat.wrap().lat.toFixed(2)+', '+e.lngLat.wrap().lng.toFixed(2))
        .addTo(map);
        });

        map.on('mouseenter', file, function() {
        map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', file, function() {
        map.getCanvas().style.cursor = '';
        });

        })
        .catch(error => console.log(error))

    }

    function removePtClk(file){
      map.removeLayer(file)
      map.removeSource(file)
    }

    function addElevation(){
      var layers = map.getStyle().layers;
        loadingSpinner(true);
        map.addLayer({
          'id': 'Elevation',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
            'https:\/\/ows.terrestris.de/osm/service?service=WMS&request=GetMap&layers=TOPO-WMS&styles=&format=image/png&transparent=true&version=1.1.1&info_format=text%2Fhtml&tiled=true&height=256&width=256&srs=EPSG:3857&bbox={bbox-epsg-3857}'
             // 'https:\/\/geo.fas.usda.gov/arcgis1/rest/services/G_Elevation/WorldElevation_90m/ImageServer/exportImage?&bbox={bbox-epsg-3857}&imageSR=102100&bboxSR=102100&size=512,512&f=image&format=jpgpng&renderingRule=%7B%22rasterFunction%22%3A%22Colormap%22%2C%22rasterFunctionArguments%22%3A%7B%22colorRamp%22%3A%7B%22type%22%3A%22multipart%22%2C%22colorRamps%22%3A%5B%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B118%2C219%2C211%2C255%5D%2C%22toColor%22%3A%5B255%2C255%2C199%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B255%2C255%2C199%2C255%5D%2C%22toColor%22%3A%5B255%2C255%2C128%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B255%2C255%2C128%2C255%5D%2C%22toColor%22%3A%5B217%2C194%2C121%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B217%2C194%2C121%2C255%5D%2C%22toColor%22%3A%5B135%2C96%2C38%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B135%2C96%2C38%2C255%5D%2C%22toColor%22%3A%5B150%2C150%2C181%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B150%2C150%2C181%2C255%5D%2C%22toColor%22%3A%5B181%2C150%2C181%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B181%2C150%2C181%2C255%5D%2C%22toColor%22%3A%5B255%2C252%2C255%2C255%5D%7D%5D%7D%2C%22Raster%22%3A%7B%22rasterFunction%22%3A%22Stretch%22%2C%22rasterFunctionArguments%22%3A%7B%22StretchType%22%3A5%2C%22Statistics%22%3A%5B%5B0%2C4500%2C377.30247840577846%2C855.6539299068867%5D%5D%2C%22DRA%22%3Afalse%2C%22UseGamma%22%3Afalse%2C%22Gamma%22%3A%5B1%5D%2C%22ComputeGamma%22%3Afalse%7D%2C%22variableName%22%3A%22Raster%22%2C%22outputPixelType%22%3A%22U8%22%7D%7D%2C%22variableName%22%3A%22Raster%22%7D'
              //'https:\/\/elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage?f=image&bandIds=&renderingRule=%7B%22rasterFunction%22%3A%22Colormap%22%2C%22rasterFunctionArguments%22%3A%7B%22colorRamp%22%3A%7B%22type%22%3A%22multipart%22%2C%22colorRamps%22%3A%5B%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B118%2C219%2C211%2C255%5D%2C%22toColor%22%3A%5B255%2C255%2C199%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B255%2C255%2C199%2C255%5D%2C%22toColor%22%3A%5B255%2C255%2C128%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B255%2C255%2C128%2C255%5D%2C%22toColor%22%3A%5B217%2C194%2C121%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B217%2C194%2C121%2C255%5D%2C%22toColor%22%3A%5B135%2C96%2C38%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B135%2C96%2C38%2C255%5D%2C%22toColor%22%3A%5B150%2C150%2C181%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B150%2C150%2C181%2C255%5D%2C%22toColor%22%3A%5B181%2C150%2C181%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B181%2C150%2C181%2C255%5D%2C%22toColor%22%3A%5B255%2C252%2C255%2C255%5D%7D%5D%7D%2C%22Raster%22%3A%7B%22rasterFunction%22%3A%22Stretch%22%2C%22rasterFunctionArguments%22%3A%7B%22StretchType%22%3A5%2C%22Statistics%22%3A%5B%5B0%2C5000%2Cnull%2Cnull%5D%5D%2C%22DRA%22%3Afalse%2C%22UseGamma%22%3Atrue%2C%22Gamma%22%3A%5B0.92%5D%2C%22ComputeGamma%22%3Afalse%7D%2C%22variableName%22%3A%22Raster%22%2C%22outputPixelType%22%3A%22U8%22%7D%7D%2C%22variableName%22%3A%22Raster%22%7D&bbox={bbox-epsg-3857}&imageSR=102100&bboxSR=102100&size=512,512'
              //'https:\/\/elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer/exportImage?f=image&format=jpgpng&compressionQuality=75&bandIds=&renderingRule=%7B%22rasterFunction%22%3A%22Colormap%22%2C%22rasterFunctionArguments%22%3A%7B%22Colormap%22%3A%5B%5B0%2C121%2C220%2C211%5D%2C%5B1%2C125%2C221%2C211%5D%2C%5B2%2C130%2C222%2C210%5D%2C%5B3%2C135%2C223%2C210%5D%2C%5B4%2C139%2C224%2C210%5D%2C%5B5%2C144%2C225%2C209%5D%2C%5B6%2C148%2C226%2C209%5D%2C%5B7%2C152%2C227%2C209%5D%2C%5B8%2C156%2C227%2C208%5D%2C%5B9%2C160%2C228%2C208%5D%2C%5B10%2C164%2C229%2C208%5D%2C%5B11%2C168%2C230%2C208%5D%2C%5B12%2C172%2C231%2C207%5D%2C%5B13%2C176%2C232%2C207%5D%2C%5B14%2C180%2C233%2C207%5D%2C%5B15%2C184%2C234%2C206%5D%2C%5B16%2C187%2C235%2C206%5D%2C%5B17%2C191%2C236%2C206%5D%2C%5B18%2C194%2C237%2C205%5D%2C%5B19%2C198%2C238%2C205%5D%2C%5B20%2C202%2C239%2C205%5D%2C%5B21%2C205%2C240%2C204%5D%2C%5B22%2C208%2C241%2C204%5D%2C%5B23%2C212%2C242%2C204%5D%2C%5B24%2C215%2C243%2C203%5D%2C%5B25%2C219%2C244%2C203%5D%2C%5B26%2C222%2C245%2C203%5D%2C%5B27%2C225%2C246%2C202%5D%2C%5B28%2C229%2C247%2C202%5D%2C%5B29%2C232%2C248%2C202%5D%2C%5B30%2C235%2C249%2C201%5D%2C%5B31%2C239%2C250%2C201%5D%2C%5B32%2C242%2C251%2C200%5D%2C%5B33%2C245%2C252%2C200%5D%2C%5B34%2C248%2C253%2C200%5D%2C%5B35%2C252%2C254%2C199%5D%2C%5B36%2C255%2C255%2C199%5D%2C%5B37%2C255%2C255%2C197%5D%2C%5B38%2C255%2C255%2C195%5D%2C%5B39%2C255%2C255%2C194%5D%2C%5B40%2C255%2C255%2C192%5D%2C%5B41%2C255%2C255%2C190%5D%2C%5B42%2C255%2C255%2C188%5D%2C%5B43%2C255%2C255%2C186%5D%2C%5B44%2C255%2C255%2C184%5D%2C%5B45%2C255%2C255%2C182%5D%2C%5B46%2C255%2C255%2C180%5D%2C%5B47%2C255%2C255%2C178%5D%2C%5B48%2C255%2C255%2C177%5D%2C%5B49%2C255%2C255%2C175%5D%2C%5B50%2C255%2C255%2C173%5D%2C%5B51%2C255%2C255%2C171%5D%2C%5B52%2C255%2C255%2C169%5D%2C%5B53%2C255%2C255%2C167%5D%2C%5B54%2C255%2C255%2C165%5D%2C%5B55%2C255%2C255%2C163%5D%2C%5B56%2C255%2C255%2C161%5D%2C%5B57%2C255%2C255%2C159%5D%2C%5B58%2C255%2C255%2C157%5D%2C%5B59%2C255%2C255%2C155%5D%2C%5B60%2C255%2C255%2C153%5D%2C%5B61%2C255%2C255%2C151%5D%2C%5B62%2C255%2C255%2C150%5D%2C%5B63%2C255%2C255%2C148%5D%2C%5B64%2C255%2C255%2C146%5D%2C%5B65%2C255%2C255%2C144%5D%2C%5B66%2C255%2C255%2C142%5D%2C%5B67%2C255%2C255%2C140%5D%2C%5B68%2C255%2C255%2C138%5D%2C%5B69%2C255%2C255%2C136%5D%2C%5B70%2C255%2C255%2C133%5D%2C%5B71%2C255%2C255%2C131%5D%2C%5B72%2C255%2C255%2C129%5D%2C%5B73%2C255%2C254%2C128%5D%2C%5B74%2C254%2C253%2C128%5D%2C%5B75%2C253%2C251%2C128%5D%2C%5B76%2C252%2C249%2C127%5D%2C%5B77%2C250%2C248%2C127%5D%2C%5B78%2C249%2C246%2C127%5D%2C%5B79%2C248%2C244%2C127%5D%2C%5B80%2C247%2C243%2C127%5D%2C%5B81%2C246%2C241%2C127%5D%2C%5B82%2C245%2C239%2C126%5D%2C%5B83%2C244%2C237%2C126%5D%2C%5B84%2C243%2C236%2C126%5D%2C%5B85%2C242%2C234%2C126%5D%2C%5B86%2C241%2C232%2C126%5D%2C%5B87%2C240%2C231%2C126%5D%2C%5B88%2C239%2C229%2C125%5D%2C%5B89%2C238%2C227%2C125%5D%2C%5B90%2C237%2C226%2C125%5D%2C%5B91%2C236%2C224%2C125%5D%2C%5B92%2C235%2C222%2C125%5D%2C%5B93%2C234%2C221%2C124%5D%2C%5B94%2C233%2C219%2C124%5D%2C%5B95%2C232%2C217%2C124%5D%2C%5B96%2C231%2C216%2C124%5D%2C%5B97%2C230%2C214%2C124%5D%2C%5B98%2C229%2C212%2C123%5D%2C%5B99%2C228%2C211%2C123%5D%2C%5B100%2C227%2C209%2C123%5D%2C%5B101%2C226%2C207%2C123%5D%2C%5B102%2C225%2C206%2C123%5D%2C%5B103%2C223%2C204%2C122%5D%2C%5B104%2C222%2C203%2C122%5D%2C%5B105%2C221%2C201%2C122%5D%2C%5B106%2C220%2C199%2C122%5D%2C%5B107%2C219%2C198%2C121%5D%2C%5B108%2C218%2C196%2C121%5D%2C%5B109%2C217%2C194%2C121%5D%2C%5B110%2C215%2C192%2C119%5D%2C%5B111%2C213%2C189%2C117%5D%2C%5B112%2C211%2C186%2C114%5D%2C%5B113%2C208%2C183%2C112%5D%2C%5B114%2C206%2C181%2C110%5D%2C%5B115%2C204%2C178%2C107%5D%2C%5B116%2C202%2C175%2C105%5D%2C%5B117%2C199%2C172%2C103%5D%2C%5B118%2C197%2C169%2C100%5D%2C%5B119%2C195%2C167%2C98%5D%2C%5B120%2C193%2C164%2C96%5D%2C%5B121%2C190%2C161%2C93%5D%2C%5B122%2C188%2C159%2C91%5D%2C%5B123%2C186%2C156%2C89%5D%2C%5B124%2C184%2C153%2C86%5D%2C%5B125%2C181%2C150%2C84%5D%2C%5B126%2C179%2C148%2C82%5D%2C%5B127%2C177%2C145%2C79%5D%2C%5B128%2C175%2C142%2C77%5D%2C%5B129%2C172%2C140%2C75%5D%2C%5B130%2C170%2C137%2C73%5D%2C%5B131%2C168%2C134%2C70%5D%2C%5B132%2C166%2C132%2C68%5D%2C%5B133%2C164%2C129%2C66%5D%2C%5B134%2C161%2C126%2C64%5D%2C%5B135%2C159%2C124%2C62%5D%2C%5B136%2C157%2C121%2C59%5D%2C%5B137%2C155%2C119%2C57%5D%2C%5B138%2C152%2C116%2C55%5D%2C%5B139%2C150%2C113%2C53%5D%2C%5B140%2C148%2C111%2C51%5D%2C%5B141%2C146%2C108%2C48%5D%2C%5B142%2C143%2C106%2C46%5D%2C%5B143%2C141%2C103%2C44%5D%2C%5B144%2C139%2C101%2C42%5D%2C%5B145%2C137%2C98%2C40%5D%2C%5B146%2C135%2C96%2C39%5D%2C%5B147%2C136%2C98%2C43%5D%2C%5B148%2C137%2C99%2C47%5D%2C%5B149%2C138%2C100%2C51%5D%2C%5B150%2C139%2C102%2C55%5D%2C%5B151%2C140%2C103%2C59%5D%2C%5B152%2C141%2C105%2C63%5D%2C%5B153%2C142%2C106%2C67%5D%2C%5B154%2C142%2C107%2C71%5D%2C%5B155%2C143%2C109%2C74%5D%2C%5B156%2C144%2C110%2C78%5D%2C%5B157%2C145%2C112%2C82%5D%2C%5B158%2C145%2C113%2C86%5D%2C%5B159%2C146%2C115%2C90%5D%2C%5B160%2C146%2C116%2C93%5D%2C%5B161%2C147%2C118%2C97%5D%2C%5B162%2C148%2C119%2C101%5D%2C%5B163%2C148%2C121%2C105%5D%2C%5B164%2C149%2C122%2C109%5D%2C%5B165%2C149%2C123%2C113%5D%2C%5B166%2C149%2C125%2C116%5D%2C%5B167%2C150%2C126%2C120%5D%2C%5B168%2C150%2C128%2C124%5D%2C%5B169%2C150%2C129%2C128%5D%2C%5B170%2C151%2C131%2C132%5D%2C%5B171%2C151%2C132%2C136%5D%2C%5B172%2C151%2C134%2C140%5D%2C%5B173%2C151%2C136%2C144%5D%2C%5B174%2C151%2C137%2C148%5D%2C%5B175%2C151%2C139%2C152%5D%2C%5B176%2C151%2C140%2C156%5D%2C%5B177%2C151%2C142%2C159%5D%2C%5B178%2C151%2C143%2C163%5D%2C%5B179%2C151%2C145%2C167%5D%2C%5B180%2C151%2C146%2C171%5D%2C%5B181%2C150%2C148%2C176%5D%2C%5B182%2C150%2C149%2C180%5D%2C%5B183%2C151%2C150%2C181%5D%2C%5B184%2C151%2C150%2C181%5D%2C%5B185%2C152%2C150%2C181%5D%2C%5B186%2C153%2C150%2C181%5D%2C%5B187%2C154%2C150%2C181%5D%2C%5B188%2C155%2C150%2C181%5D%2C%5B189%2C156%2C150%2C181%5D%2C%5B190%2C157%2C150%2C181%5D%2C%5B191%2C158%2C150%2C181%5D%2C%5B192%2C158%2C150%2C181%5D%2C%5B193%2C159%2C150%2C181%5D%2C%5B194%2C160%2C150%2C181%5D%2C%5B195%2C161%2C150%2C181%5D%2C%5B196%2C162%2C150%2C181%5D%2C%5B197%2C163%2C150%2C181%5D%2C%5B198%2C164%2C150%2C181%5D%2C%5B199%2C164%2C150%2C181%5D%2C%5B200%2C165%2C150%2C181%5D%2C%5B201%2C166%2C150%2C181%5D%2C%5B202%2C167%2C150%2C181%5D%2C%5B203%2C168%2C150%2C181%5D%2C%5B204%2C169%2C150%2C181%5D%2C%5B205%2C170%2C150%2C181%5D%2C%5B206%2C170%2C150%2C181%5D%2C%5B207%2C171%2C150%2C181%5D%2C%5B208%2C172%2C150%2C181%5D%2C%5B209%2C173%2C150%2C181%5D%2C%5B210%2C174%2C150%2C181%5D%2C%5B211%2C175%2C150%2C181%5D%2C%5B212%2C175%2C150%2C181%5D%2C%5B213%2C176%2C150%2C181%5D%2C%5B214%2C177%2C150%2C181%5D%2C%5B215%2C178%2C150%2C181%5D%2C%5B216%2C179%2C150%2C181%5D%2C%5B217%2C179%2C150%2C181%5D%2C%5B218%2C180%2C150%2C181%5D%2C%5B219%2C181%2C150%2C181%5D%2C%5B220%2C183%2C153%2C183%5D%2C%5B221%2C185%2C156%2C185%5D%2C%5B222%2C187%2C158%2C187%5D%2C%5B223%2C189%2C161%2C189%5D%2C%5B224%2C191%2C164%2C191%5D%2C%5B225%2C193%2C166%2C193%5D%2C%5B226%2C195%2C169%2C195%5D%2C%5B227%2C197%2C172%2C197%5D%2C%5B228%2C199%2C175%2C199%5D%2C%5B229%2C201%2C177%2C201%5D%2C%5B230%2C203%2C180%2C203%5D%2C%5B231%2C205%2C183%2C205%5D%2C%5B232%2C207%2C186%2C207%5D%2C%5B233%2C209%2C188%2C209%5D%2C%5B234%2C211%2C191%2C211%5D%2C%5B235%2C213%2C194%2C213%5D%2C%5B236%2C215%2C197%2C215%5D%2C%5B237%2C217%2C199%2C217%5D%2C%5B238%2C219%2C202%2C219%5D%2C%5B239%2C221%2C205%2C221%5D%2C%5B240%2C223%2C208%2C223%5D%2C%5B241%2C225%2C211%2C225%5D%2C%5B242%2C227%2C213%2C227%5D%2C%5B243%2C229%2C216%2C229%5D%2C%5B244%2C232%2C219%2C231%5D%2C%5B245%2C234%2C222%2C233%5D%2C%5B246%2C236%2C225%2C235%5D%2C%5B247%2C238%2C228%2C237%5D%2C%5B248%2C240%2C230%2C239%5D%2C%5B249%2C242%2C233%2C242%5D%2C%5B250%2C244%2C236%2C244%5D%2C%5B251%2C246%2C239%2C246%5D%2C%5B252%2C248%2C242%2C248%5D%2C%5B253%2C250%2C245%2C250%5D%2C%5B254%2C252%2C248%2C252%5D%2C%5B255%2C254%2C251%2C254%5D%5D%2C%22Raster%22%3A%7B%22rasterFunction%22%3A%22Stretch%22%2C%22rasterFunctionArguments%22%3A%7B%22StretchType%22%3A5%2C%22Statistics%22%3A%5B%5B0%2C4000%2C400%2C870%5D%5D%2C%22DRA%22%3Afalse%2C%22UseGamma%22%3Atrue%2C%22Gamma%22%3A%5B1.2%5D%2C%22ComputeGamma%22%3Afalse%7D%2C%22variableName%22%3A%22Raster%22%2C%22outputPixelType%22%3A%22U8%22%7D%7D%2C%22variableName%22%3A%22Raster%22%7D&bbox={bbox-epsg-3857}&imageSR=102100&bboxSR=102100&size=512,512&token=n0znVvAXduHJ_GOAzSBZOFJ1TFIiDZmRm51X7bm-h2gC6Je1POqHuP6nomdO5aPCY62uQsTIeUYWcciWOTFd9tNW8UR8D73J1G8sTKOckyQmLmnzbJehca-lAF4vP36I_Mxy18NRbyW2--geLA9oQUGK9UD1jjJ21YamrKkbQUQSC76hddGvAydB82s3zEOK02_AUP5yNA2h0ejYc9CV2Sns7uba039oWVB75ORwXw2ZEWaYnWmhw_3wi9RFrRmy3brqaMKOn1p52AYQQWOfFJPJhhKR-1J3hkao9QveWYCEFW4xKJIM0rnlAq9VtCYP'
              //'https:\/\/gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?request=GetMap&SERVICE=WMS&layers=ASTER_GDEM_Color_Shaded_Relief&crs=EPSG:3857&format=image/jpeg&styles=&width=256&height=256&bbox={bbox-epsg-3857}'
            ],
            'tileSize': 256
          },
          'paint': {}
        }, 'dark');
        map.on('render', stopSpinner);

    }
    function removeElevation(){
      map.removeLayer('Elevation')
      map.removeSource('Elevation')
    }

    function addSlope(){
      var layers = map.getStyle().layers;
        loadingSpinner(true);
        map.addLayer({
          'id': 'Slope',
          'type': 'raster',
          'source': {
            'type': 'raster',
            'tiles': [
            'https:\/\/elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage?f=image&bandIds=&renderingRule=%7B%22rasterFunction%22%3A%22Colormap%22%2C%22rasterFunctionArguments%22%3A%7B%22colorRamp%22%3A%7B%22type%22%3A%22multipart%22%2C%22colorRamps%22%3A%5B%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B0%2C245%2C245%2C255%5D%2C%22toColor%22%3A%5B0%2C0%2C245%2C255%5D%7D%2C%7B%22type%22%3A%22algorithmic%22%2C%22algorithm%22%3A%22esriHSVAlgorithm%22%2C%22fromColor%22%3A%5B0%2C0%2C245%2C255%5D%2C%22toColor%22%3A%5B245%2C0%2C245%2C255%5D%7D%5D%7D%2C%22Raster%22%3A%7B%22rasterFunction%22%3A%22Stretch%22%2C%22rasterFunctionArguments%22%3A%7B%22StretchType%22%3A5%2C%22Statistics%22%3A%5B%5B1%2C70%2Cnull%2Cnull%5D%5D%2C%22DRA%22%3Afalse%2C%22UseGamma%22%3Atrue%2C%22Gamma%22%3A%5B1.14%5D%2C%22ComputeGamma%22%3Afalse%2C%22Raster%22%3A%7B%22rasterFunction%22%3A%22Slope%20Degrees%22%7D%7D%2C%22variableName%22%3A%22Raster%22%2C%22outputPixelType%22%3A%22U8%22%7D%7D%2C%22variableName%22%3A%22Raster%22%7D&bbox={bbox-epsg-3857}&imageSR=102100&bboxSR=102100&size=512,512'
              //'https:\/\/elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&size=512,512&imageSR=3857&time=&format=jpgpng&pixelType=U8&noData=&noDataInterpretation=esriNoDataMatchAny&interpolation=+RSP_BilinearInterpolation&compression=&compressionQuality=&bandIds=&mosaicRule=&renderingRule=%7B%22rasterFunction%22%3A%22Colormap%22%2C%22rasterFunctionArguments%22%3A%7B%22Colormap%22%3A%5B%5B0%2C5%2C244%2C245%5D%2C%5B1%2C15%2C243%2C245%5D%2C%5B2%2C22%2C241%2C245%5D%2C%5B3%2C27%2C239%2C245%5D%2C%5B4%2C32%2C238%2C245%5D%2C%5B5%2C35%2C236%2C245%5D%2C%5B6%2C39%2C234%2C246%5D%2C%5B7%2C42%2C233%2C246%5D%2C%5B8%2C44%2C231%2C246%5D%2C%5B9%2C47%2C229%2C246%5D%2C%5B10%2C49%2C228%2C246%5D%2C%5B11%2C51%2C226%2C246%5D%2C%5B12%2C53%2C224%2C246%5D%2C%5B13%2C55%2C223%2C246%5D%2C%5B14%2C57%2C221%2C246%5D%2C%5B15%2C58%2C219%2C246%5D%2C%5B16%2C60%2C218%2C246%5D%2C%5B17%2C61%2C216%2C246%5D%2C%5B18%2C63%2C215%2C246%5D%2C%5B19%2C64%2C213%2C246%5D%2C%5B20%2C65%2C211%2C246%5D%2C%5B21%2C67%2C210%2C247%5D%2C%5B22%2C68%2C208%2C247%5D%2C%5B23%2C69%2C206%2C247%5D%2C%5B24%2C70%2C205%2C247%5D%2C%5B25%2C71%2C203%2C247%5D%2C%5B26%2C72%2C201%2C247%5D%2C%5B27%2C73%2C200%2C247%5D%2C%5B28%2C73%2C198%2C247%5D%2C%5B29%2C74%2C197%2C247%5D%2C%5B30%2C75%2C195%2C247%5D%2C%5B31%2C76%2C193%2C247%5D%2C%5B32%2C76%2C192%2C247%5D%2C%5B33%2C77%2C190%2C247%5D%2C%5B34%2C78%2C188%2C247%5D%2C%5B35%2C78%2C187%2C247%5D%2C%5B36%2C79%2C185%2C247%5D%2C%5B37%2C79%2C184%2C247%5D%2C%5B38%2C80%2C182%2C247%5D%2C%5B39%2C80%2C180%2C247%5D%2C%5B40%2C81%2C179%2C247%5D%2C%5B41%2C81%2C177%2C247%5D%2C%5B42%2C81%2C175%2C247%5D%2C%5B43%2C82%2C174%2C247%5D%2C%5B44%2C82%2C172%2C247%5D%2C%5B45%2C82%2C171%2C247%5D%2C%5B46%2C82%2C169%2C247%5D%2C%5B47%2C83%2C167%2C247%5D%2C%5B48%2C83%2C166%2C247%5D%2C%5B49%2C83%2C164%2C247%5D%2C%5B50%2C83%2C162%2C247%5D%2C%5B51%2C83%2C161%2C247%5D%2C%5B52%2C84%2C159%2C247%5D%2C%5B53%2C84%2C157%2C247%5D%2C%5B54%2C84%2C156%2C247%5D%2C%5B55%2C84%2C154%2C248%5D%2C%5B56%2C84%2C153%2C248%5D%2C%5B57%2C84%2C151%2C248%5D%2C%5B58%2C84%2C149%2C248%5D%2C%5B59%2C84%2C148%2C248%5D%2C%5B60%2C84%2C146%2C248%5D%2C%5B61%2C84%2C144%2C248%5D%2C%5B62%2C84%2C143%2C248%5D%2C%5B63%2C84%2C141%2C248%5D%2C%5B64%2C83%2C139%2C247%5D%2C%5B65%2C83%2C138%2C247%5D%2C%5B66%2C83%2C136%2C247%5D%2C%5B67%2C83%2C135%2C247%5D%2C%5B68%2C83%2C133%2C247%5D%2C%5B69%2C83%2C131%2C247%5D%2C%5B70%2C82%2C130%2C247%5D%2C%5B71%2C82%2C128%2C247%5D%2C%5B72%2C82%2C126%2C247%5D%2C%5B73%2C81%2C125%2C247%5D%2C%5B74%2C81%2C123%2C247%5D%2C%5B75%2C81%2C121%2C247%5D%2C%5B76%2C80%2C120%2C247%5D%2C%5B77%2C80%2C118%2C247%5D%2C%5B78%2C80%2C116%2C247%5D%2C%5B79%2C79%2C115%2C247%5D%2C%5B80%2C79%2C113%2C247%5D%2C%5B81%2C78%2C111%2C247%5D%2C%5B82%2C78%2C110%2C247%5D%2C%5B83%2C77%2C108%2C247%5D%2C%5B84%2C77%2C106%2C247%5D%2C%5B85%2C76%2C104%2C247%5D%2C%5B86%2C76%2C103%2C247%5D%2C%5B87%2C75%2C101%2C247%5D%2C%5B88%2C74%2C99%2C247%5D%2C%5B89%2C74%2C98%2C247%5D%2C%5B90%2C73%2C96%2C247%5D%2C%5B91%2C72%2C94%2C247%5D%2C%5B92%2C72%2C92%2C247%5D%2C%5B93%2C71%2C91%2C247%5D%2C%5B94%2C70%2C89%2C247%5D%2C%5B95%2C69%2C87%2C247%5D%2C%5B96%2C68%2C85%2C247%5D%2C%5B97%2C68%2C83%2C247%5D%2C%5B98%2C67%2C82%2C247%5D%2C%5B99%2C66%2C80%2C247%5D%2C%5B100%2C65%2C78%2C247%5D%2C%5B101%2C64%2C76%2C247%5D%2C%5B102%2C63%2C74%2C246%5D%2C%5B103%2C62%2C72%2C246%5D%2C%5B104%2C61%2C70%2C246%5D%2C%5B105%2C59%2C68%2C246%5D%2C%5B106%2C58%2C66%2C246%5D%2C%5B107%2C57%2C64%2C246%5D%2C%5B108%2C56%2C62%2C246%5D%2C%5B109%2C54%2C60%2C246%5D%2C%5B110%2C53%2C58%2C246%5D%2C%5B111%2C51%2C56%2C246%5D%2C%5B112%2C50%2C54%2C246%5D%2C%5B113%2C48%2C52%2C246%5D%2C%5B114%2C47%2C49%2C246%5D%2C%5B115%2C45%2C47%2C246%5D%2C%5B116%2C43%2C45%2C246%5D%2C%5B117%2C41%2C42%2C246%5D%2C%5B118%2C39%2C40%2C246%5D%2C%5B119%2C36%2C37%2C246%5D%2C%5B120%2C34%2C34%2C245%5D%2C%5B121%2C31%2C31%2C245%5D%2C%5B122%2C28%2C28%2C245%5D%2C%5B123%2C25%2C24%2C245%5D%2C%5B124%2C21%2C20%2C245%5D%2C%5B125%2C17%2C15%2C245%5D%2C%5B126%2C11%2C10%2C245%5D%2C%5B127%2C4%2C3%2C245%5D%2C%5B128%2C8%2C0%2C245%5D%2C%5B129%2C20%2C0%2C245%5D%2C%5B130%2C28%2C0%2C245%5D%2C%5B131%2C35%2C0%2C245%5D%2C%5B132%2C40%2C0%2C245%5D%2C%5B133%2C45%2C0%2C245%5D%2C%5B134%2C49%2C0%2C245%5D%2C%5B135%2C53%2C0%2C245%5D%2C%5B136%2C57%2C0%2C245%5D%2C%5B137%2C60%2C0%2C245%5D%2C%5B138%2C64%2C0%2C245%5D%2C%5B139%2C67%2C0%2C245%5D%2C%5B140%2C70%2C0%2C245%5D%2C%5B141%2C73%2C0%2C245%5D%2C%5B142%2C75%2C0%2C245%5D%2C%5B143%2C78%2C0%2C245%5D%2C%5B144%2C81%2C0%2C245%5D%2C%5B145%2C83%2C0%2C245%5D%2C%5B146%2C85%2C0%2C245%5D%2C%5B147%2C88%2C0%2C245%5D%2C%5B148%2C90%2C0%2C245%5D%2C%5B149%2C92%2C0%2C245%5D%2C%5B150%2C95%2C0%2C245%5D%2C%5B151%2C97%2C0%2C245%5D%2C%5B152%2C99%2C0%2C245%5D%2C%5B153%2C101%2C0%2C245%5D%2C%5B154%2C103%2C0%2C245%5D%2C%5B155%2C105%2C0%2C245%5D%2C%5B156%2C107%2C0%2C245%5D%2C%5B157%2C109%2C0%2C245%5D%2C%5B158%2C111%2C0%2C245%5D%2C%5B159%2C113%2C0%2C245%5D%2C%5B160%2C114%2C0%2C245%5D%2C%5B161%2C116%2C0%2C245%5D%2C%5B162%2C118%2C0%2C245%5D%2C%5B163%2C120%2C0%2C245%5D%2C%5B164%2C122%2C0%2C245%5D%2C%5B165%2C123%2C0%2C245%5D%2C%5B166%2C125%2C0%2C245%5D%2C%5B167%2C127%2C0%2C245%5D%2C%5B168%2C128%2C0%2C245%5D%2C%5B169%2C130%2C0%2C245%5D%2C%5B170%2C132%2C0%2C245%5D%2C%5B171%2C133%2C0%2C245%5D%2C%5B172%2C135%2C0%2C245%5D%2C%5B173%2C137%2C0%2C245%5D%2C%5B174%2C138%2C0%2C245%5D%2C%5B175%2C140%2C0%2C245%5D%2C%5B176%2C141%2C0%2C245%5D%2C%5B177%2C143%2C0%2C245%5D%2C%5B178%2C144%2C0%2C245%5D%2C%5B179%2C146%2C0%2C245%5D%2C%5B180%2C147%2C0%2C245%5D%2C%5B181%2C149%2C0%2C245%5D%2C%5B182%2C150%2C0%2C245%5D%2C%5B183%2C152%2C0%2C245%5D%2C%5B184%2C153%2C0%2C245%5D%2C%5B185%2C155%2C0%2C245%5D%2C%5B186%2C156%2C0%2C245%5D%2C%5B187%2C158%2C0%2C245%5D%2C%5B188%2C159%2C0%2C245%5D%2C%5B189%2C161%2C0%2C245%5D%2C%5B190%2C162%2C0%2C245%5D%2C%5B191%2C163%2C0%2C245%5D%2C%5B192%2C165%2C0%2C245%5D%2C%5B193%2C166%2C0%2C245%5D%2C%5B194%2C168%2C0%2C245%5D%2C%5B195%2C169%2C0%2C245%5D%2C%5B196%2C170%2C0%2C245%5D%2C%5B197%2C172%2C0%2C245%5D%2C%5B198%2C173%2C0%2C245%5D%2C%5B199%2C174%2C0%2C245%5D%2C%5B200%2C176%2C0%2C245%5D%2C%5B201%2C177%2C0%2C245%5D%2C%5B202%2C179%2C0%2C245%5D%2C%5B203%2C180%2C0%2C245%5D%2C%5B204%2C181%2C0%2C245%5D%2C%5B205%2C183%2C0%2C245%5D%2C%5B206%2C184%2C0%2C245%5D%2C%5B207%2C185%2C0%2C245%5D%2C%5B208%2C186%2C0%2C245%5D%2C%5B209%2C188%2C0%2C245%5D%2C%5B210%2C189%2C0%2C245%5D%2C%5B211%2C190%2C0%2C245%5D%2C%5B212%2C192%2C0%2C245%5D%2C%5B213%2C193%2C0%2C245%5D%2C%5B214%2C194%2C0%2C245%5D%2C%5B215%2C196%2C0%2C245%5D%2C%5B216%2C197%2C0%2C245%5D%2C%5B217%2C198%2C0%2C245%5D%2C%5B218%2C199%2C0%2C245%5D%2C%5B219%2C201%2C0%2C245%5D%2C%5B220%2C202%2C0%2C245%5D%2C%5B221%2C203%2C0%2C245%5D%2C%5B222%2C204%2C0%2C245%5D%2C%5B223%2C206%2C0%2C245%5D%2C%5B224%2C207%2C0%2C245%5D%2C%5B225%2C208%2C0%2C245%5D%2C%5B226%2C209%2C0%2C245%5D%2C%5B227%2C211%2C0%2C245%5D%2C%5B228%2C212%2C0%2C245%5D%2C%5B229%2C213%2C0%2C245%5D%2C%5B230%2C214%2C0%2C245%5D%2C%5B231%2C216%2C0%2C245%5D%2C%5B232%2C217%2C0%2C245%5D%2C%5B233%2C218%2C0%2C245%5D%2C%5B234%2C219%2C0%2C245%5D%2C%5B235%2C220%2C0%2C245%5D%2C%5B236%2C222%2C0%2C245%5D%2C%5B237%2C223%2C0%2C245%5D%2C%5B238%2C224%2C0%2C245%5D%2C%5B239%2C225%2C0%2C245%5D%2C%5B240%2C227%2C0%2C245%5D%2C%5B241%2C228%2C0%2C245%5D%2C%5B242%2C229%2C0%2C245%5D%2C%5B243%2C230%2C0%2C245%5D%2C%5B244%2C231%2C0%2C245%5D%2C%5B245%2C233%2C0%2C245%5D%2C%5B246%2C234%2C0%2C245%5D%2C%5B247%2C235%2C0%2C245%5D%2C%5B248%2C236%2C0%2C245%5D%2C%5B249%2C237%2C0%2C245%5D%2C%5B250%2C239%2C0%2C245%5D%2C%5B251%2C240%2C0%2C245%5D%2C%5B252%2C241%2C0%2C245%5D%2C%5B253%2C242%2C0%2C245%5D%2C%5B254%2C243%2C0%2C245%5D%2C%5B255%2C244%2C0%2C245%5D%5D%2C%22Raster%22%3A%7B%22rasterFunction%22%3A%22Stretch%22%2C%22rasterFunctionArguments%22%3A%7B%22StretchType%22%3A5%2C%22Statistics%22%3A%5B%5B0%2C70%2C0%2C-1%5D%5D%2C%22DRA%22%3Afalse%2C%22UseGamma%22%3Atrue%2C%22Gamma%22%3A%5B2.28%5D%2C%22ComputeGamma%22%3Afalse%2C%22Raster%22%3A%7B%22rasterFunction%22%3A%22Slope_Degrees%22%7D%7D%2C%22variableName%22%3A%22Raster%22%2C%22outputPixelType%22%3A%22U8%22%7D%7D%2C%22variableName%22%3A%22Raster%22%7D&token=WgG4NnpbjRoibIqGfIdbEtgT8Kik3wjF1eEkY2Eprar3Mgwpde7jAaTDVtVOeMk2VtwagDPoCr_IuiyMCaWnibs5xnsLRtz2t_j0I7fr5Am_KsPLieYi2ZgR6OFcjASATocrbX6sc91QyJMCC0K_Q_z-LVTqrDl8sA0137yi0XZgX2XAIyBnaDC7NbVN2EIaodTY9_S1zXM0ATOJKOD1BRREpBnhMdgd-Ys2oOwCmtgiwbcTZyYFR5gWZEMpz90Nd-ZmulcLd61NYrbLV5COVAOtRQ7r-7aA_SzsTXBrOylF4DvD4rJ-Z_wAWCz6YFqv&f=image'
              //'https:\/\/gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?request=GetMap&SERVICE=WMS&layers=ASTER_GDEM_Color_Shaded_Relief&crs=EPSG:3857&format=image/jpeg&styles=&width=256&height=256&bbox={bbox-epsg-3857}'
            ],
            'tileSize': 512
          },
          'paint': {}
        }, 'dark');
        map.on('render', stopSpinner);

    }
    function removeSlope(){
      map.removeLayer('Slope')
      map.removeSource('Slope')
    }

    function addSigmet(){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addSource('Sigmet', {
          type: 'geojson',
          data: 'https:\/\/test.8222.workers.dev/?https:\/\/www.aviationweather.gov/cgi-bin/json/SigmetJSON.php?&type=all',
          //attribution: 'Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
        });
        map.addSource('ISigmet', {
          type: 'geojson',
          data: 'https:\/\/test.8222.workers.dev/?https:\/\/www.aviationweather.gov/cgi-bin/json/IsigmetJSON.php?&type=all',
          //attribution: 'Updated: <b>'+ moment(allhazardsURL.generation_time).format('MMMM Do YYYY, h:mm a')+ ' | ' + moment(allhazardsURL.generation_time).fromNow() + '</b>',
        });
        map.addLayer({
          'id': 'Sigmet',
          'type': 'fill',  //line or fill
          'source':'Sigmet',
          'paint':{
          //  'line-width': 7.5,
          //  'line-color': 'rgba(200,0,0,0.9)',
            'fill-color': 'rgba(200,0,0,0.25)',
          },
        //  'filter': ['==', 'phenomenon', 'Heat']
        }, lastSymbolId);

        map.addLayer({
          'id': 'Sigmet1',
          'type': 'symbol',  //line or fill
          'source':'Sigmet',
          'layout':{
            'text-field':'{hazard}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint':{
            'text-color':'#000'
          //  'text-color':['get','wwa_rgba'],
          //  'line-width':4,
          },
          //'filter': ['==', 'phenomenon', 'Heat']
        }, lastSymbolId);
        map.addLayer({
          'id': 'ISigmet',
          'type': 'fill',  //line or fill
          'source':'ISigmet',
          'paint':{
          //  'line-color': 'rgba(200,0,0,0.9)',
            'fill-color': 'rgba(200,0,0,0.25)',
          },
        //  'filter': ['==', 'phenomenon', 'Heat']
        }, lastSymbolId);

        map.addLayer({
          'id': 'ISigmet1',
          'type': 'symbol',  //line or fill
          'source':'ISigmet',
          'layout':{
            'text-field':'{hazard}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint':{
            'text-color':'#000'
          //  'text-color':['get','wwa_rgba'],
          //  'line-width':4,
          },
          //'filter': ['==', 'phenomenon', 'Heat']
        }, lastSymbolId);
        map.on('render', stopSpinner);
      }

      function removeSigmet(){
        map.removeLayer('Sigmet')
        map.removeLayer('Sigmet1')
        map.removeSource('Sigmet')
        map.removeLayer('ISigmet')
        map.removeLayer('ISigmet1')
        map.removeSource('ISigmet')
      }

      function removeAirmet(type){
        map.removeLayer(type+'1')
        map.removeLayer(type)
        map.removeSource(type)
      }

      function addAirmet(type,color){
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var lastSymbolId;
        for (var i = 0; i < layers.length; i++) {
          //if (layers[i].type === 'fill') {
          if (layers[i].type === 'hillshade') {
            lastSymbolId = layers[i].id;
            break;
          }
        }

        map.addSource(type, {
          type: 'geojson',
          data: 'https:\/\/test.8222.workers.dev/?https:\/\/www.aviationweather.gov/cgi-bin/json/GairmetJSON.php?&type='+type+'',
        });

        map.addLayer({
          'id': type,
          'type': 'fill',
          'source':type,
          'paint':{
            'fill-color': color,
          },
          'filter': ['==', 'hazard', type]
        }, lastSymbolId);

        map.addLayer({
          'id': type+'1',
          'type': 'symbol',  //line or fill
          'source':type,
          'layout':{
            'text-field':'{hazard}',
            'text-font': [
              "Open Sans Condensed Bold",
              "Arial Unicode MS Bold"
            ],
            'text-size': 12,
          },
          'paint':{
            'text-color':'#000'
          },
          'filter': ['==', 'hazard', type]
        }, lastSymbolId);
        map.on('render', stopSpinner);
        map.on('click', type, function(e) {
          let dueto = e.features[0].properties.dueTo;
          let due;
          if (dueto == null){
            due = '';
          }
          else{
            due = '<span style="font-family:Inconsolata">'+e.features[0].properties.dueTo+'</span>';
          }
          new mapboxgl.Popup({offset:[0,0]})
          .setLngLat(e.lngLat)
          .setHTML('<div class="popup-header">'+e.features[0].properties.product +' - '+ e.features[0].properties.hazard +'</div>'+due+'<br>Valid: '+moment(e.features[0].properties.validTime).format('MMMM Do YYYY, h:mm a')+'<br>Issued: '+moment(e.features[0].properties.issueTime).format('MMMM Do YYYY, h:mm a'))
          .addTo(map);
        });

        map.on('mouseenter', type, function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', type, function() {
          map.getCanvas().style.cursor = '';
        });
      }

      function addEOTrue(today,layern,nm){
        let eoUrl;
        if (layern === 'WILDFIRE' && nm === 'Sentinel-2%20L1C'){
          evalscript = 'https:\/\/custom-scripts.sentinel-hub.com/custom-scripts/sentinel-2/markuse_fire/script.js'
          eoUrl = `https:\/\/services.sentinel-hub.com/ogc/wms/cd280189-7c51-45a6-ab05-f96a76067710?service=WMS&request=GetMap&layers=1_TRUE_COLOR&styles=&format=image%2Fpng&transparent=true&version=1.1.1&showlogo=false&name=${nm}&width=512&height=512&pane=activeLayer&maxcc=100&evalscripturl=${evalscript}&time=${today}%2F${today}&srs=EPSG%3A3857&bbox={bbox-epsg-3857}`
        }
        else if (layern === '1_TRUE_COLOR' && nm ==='Sentinel-2%20L1C'){
          evalscript = 'https:\/\/raw.githubusercontent.com/korria/custom-scripts/master/sentinel-2/tonemapped_natural_color/script.js'
          eoUrl = `https:\/\/services.sentinel-hub.com/ogc/wms/cd280189-7c51-45a6-ab05-f96a76067710?service=WMS&request=GetMap&layers=1_TRUE_COLOR&styles=&format=image%2Fpng&transparent=true&version=1.1.1&showlogo=false&name=${nm}&width=512&height=512&pane=activeLayer&maxcc=100&evalscripturl=${evalscript}&time=${today}%2F${today}&srs=EPSG%3A3857&bbox={bbox-epsg-3857}`
        }
        else if (nm === 'Sentinel-2%20L1C'){
          eoUrl = `https:\/\/services.sentinel-hub.com/ogc/wms/cd280189-7c51-45a6-ab05-f96a76067710?service=WMS&request=GetMap&layers=${layern}&styles=&format=image%2Fpng&transparent=true&version=1.1.1&showlogo=false&name=${nm}&width=512&height=512&pane=activeLayer&maxcc=100&evalscriptoverrides=&time=${today}%2F${today}&srs=EPSG%3A3857&bbox={bbox-epsg-3857}`
        }
        if (layern === '1_TRUE_COLOR' && nm === 'Sentinel-3%20OLCI'){
          evalscript = 'https:\/\/custom-scripts.sentinel-hub.com/custom-scripts/sentinel-3/true_color_highlight_optimized/script.js'
          //evalscript = encodeURI('return [Math.sqrt(0.9*B08 - 0.055),\nMath.sqrt(0.9*B06 - 0.055),\nMath.sqrt(0.9*B04 - 0.055)]')
          eoUrl = `https:\/\/creodias.sentinel-hub.com/ogc/wms/f74cbfcc-57ef-4159-a3db-43fca35c08a4?service=WMS&request=GetMap&layers=${layern}&styles=&format=image%2Fpng&transparent=true&version=1.1.1&showlogo=false&name=Sentinel-3%20OLCI&width=512&height=512&pane=activeLayer&maxcc=100&evalscripturl=${evalscript}&evalscriptoverrides=&time=${today}%2F${today}&srs=EPSG%3A3857&bbox={bbox-epsg-3857}`
        }
        else if (nm ==='Sentinel-3%20OLCI')(
          eoUrl = 'https:\/\/creodias.sentinel-hub.com/ogc/wms/f74cbfcc-57ef-4159-a3db-43fca35c08a4?service=WMS&request=GetMap&layers='+layern+'&styles=&format=image%2Fpng&transparent=true&version=1.1.1&showlogo=false&name=Sentinel-3%20OLCI&width=512&height=512&pane=activeLayer&maxcc=100&evalscriptoverrides=&time='+today+'%2F'+today+'&srs=EPSG%3A3857&bbox={bbox-epsg-3857}'
        )
        var layers = map.getStyle().layers;
        loadingSpinner(true);
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addLayer({
          'id': layern,
          'type': 'raster',
          'source': {
            'type': 'raster',
            'attribution': 'Copernicus Sentinel data 2021 for Sentinel data. Date: <b>' + today + '</b>',
            'tiles': [eoUrl],
            'tileSize': 512
          },
          'paint': {}
        }, firstSymbolId);
        map.on('render', stopSpinner);
      }

      function removeEOTrue(layern) {
        map.removeLayer(layern)
        map.removeSource(layern)
      }

      function addRiver(){
        let sc1Opacity = {
        stops: [[1, .25], [10, .75], [12, 1]]
        }
        let sc1Width = {
        stops: [[3, .05], [6, .075], [10, .5], [15, 5]]
        }
        let sc2Opacity = {
        stops: [[1, .5], [10, 0.75], [12, 1]]
        }
        let sc2Width = {
        stops: [[3, .05], [6, .5], [10, 2], [15, 7]]
        }
        let sc3Opacity = {
        stops: [[1, .5], [10, 0.75], [12, 1]]
        }
        let sc3Width = {
            stops: [[4, .55], [6, 1], [10, 5], [15, 16]]
        }

        // map.addSource("hucSource", {
        //     type: "vector",
        //     url: "mapbox:\/\/cap.81jqdawm/"
        // })
        map.addSource("damSource", {
            type: "vector",
            url: "mapbox:\/\/cap.2isiknr2/"
        })
        map.addSource("NHD_SC1_source", {
            type: "vector",
            url: "mapbox:\/\/cap.a3rjd6ob/"
        })
        map.addSource("NHD_SC2_source", {
            type: "vector",
            url: "mapbox:\/\/cap.23p0zs6r/"
        })
        map.addSource("NHD_SC3_source", {
            type: "vector",
            url: "mapbox:\/\/cap.c5pgxwqg/"
        })
        // map.addSource("hucHoverSource", {
        //     type: "geojson",
        //     data: {
        //         type: "FeatureCollection",
        //         features: []
        //     }
        // })
        // map.addSource("nhdHoverSource", {
        //     type: "geojson",
        //     data: {
        //         type: "FeatureCollection",
        //         features: []
        //     }
        // })
        map.addLayer({
        id: "DAM",
        type: "circle",
        source: "damSource",
        minzoom: 6,
        layout: {
            //visibility: layersHolder.nhd.visibility
        },
        "source-layer": "NID_2016_Propublica3-0u47n4",
        paint: {
            "circle-radius": {
                base: 1,
                type: "exponential",
                property: "nid_storag",
                stops: [[{
                    zoom: 0,
                    value: 0
                }, 0], [{
                    value: 1e4,
                    zoom: 0
                }, 0], [{
                    value: 1e7,
                    zoom: 0
                }, 0], [{
                    zoom: 5,
                    value: 0
                }, 0], [{
                    value: 1e4,
                    zoom: 5
                }, 0], [{
                    value: 1e7,
                    zoom: 5
                }, 0], [{
                    zoom: 10,
                    value: 0
                }, 4], [{
                    value: 1e4,
                    zoom: 10
                }, 12], [{
                    value: 1e7,
                    zoom: 10
                }, 30], [{
                    zoom: 15,
                    value: 0
                }, 4], [{
                    value: 1e4,
                    zoom: 15
                }, 12], [{
                    value: 1e6,
                    zoom: 15
                }, 30]]
            },
            "circle-color": "rgba(0,0,0,0.3)",
            "circle-stroke-width": 1,
            "circle-stroke-color": "rgba(0,0,0,0.5)"
        }
    })

    // map.addLayer({
    //     id: "DAMS",
    //     type: "circle",
    //     source: "damSource",
    //     layout: {
    //         //visibility: layersHolder.dams.visibility
    //     },
    //     "source-layer": "NID_2016_Propublica3-0u47n4",
    //     paint: {
    //         "circle-radius": {
    //             base: 1,
    //             type: "exponential",
    //             property: "nid_storag",
    //             stops: [[{
    //                 zoom: 3,
    //                 value: 0
    //             }, .125], [{
    //                 value: 1e4,
    //                 zoom: 3
    //             }, .5], [{
    //                 value: 1e7,
    //                 zoom: 3
    //             }, 8], [{
    //                 zoom: 10,
    //                 value: 0
    //             }, 4], [{
    //                 value: 1e4,
    //                 zoom: 10
    //             }, 12], [{
    //                 value: 1e7,
    //                 zoom: 10
    //             }, 30], [{
    //                 zoom: 15,
    //                 value: 0
    //             }, 4], [{
    //                 value: 1e4,
    //                 zoom: 15
    //             }, 12], [{
    //                 value: 1e6,
    //                 zoom: 15
    //             }, 30]]
    //         },
    //         "circle-color": "#00eea0",
    //         "circle-stroke-width": .25
    //     }
    // })
    // map.addLayer({
    //     id: "NHD_SC1Hover",
    //     type: "line",
    //     source: "NHD_SC1_source",
    //     minzoom: 9,
    //     layout: {
    //         "line-cap": "round",
    //         "line-join": "round",
    //     },
    //     "source-layer": "sc1",
    //     paint: {
    //         "line-color": "#fff",
    //         "line-opacity": 0,
    //         "line-width": {
    //             stops: [[3, 2], [6, 4], [10, 10], [15, 20]]
    //         }
    //     }
    // },)
    // map.addLayer({
    //     id: "NHD_SC2Hover",
    //     type: "line",
    //     source: "NHD_SC2_source",
    //     minzoom: 9,
    //     layout: {
    //         "line-cap": "round",
    //         "line-join": "round",
    //     },
    //     "source-layer": "sc2",
    //     paint: {
    //         "line-color": "#fff",
    //         "line-opacity": 0,
    //         "line-width": {
    //             stops: [[3, 2], [6, 3], [10, 10], [15, 20]]
    //         }
    //     }
    // },)
    // map.addLayer({
    //     id: "NHD_SC3Hover",
    //     type: "line",
    //     source: "NHD_SC3_source",
    //     layout: {
    //         "line-cap": "round",
    //         "line-join": "round",
    //     },
    //     "source-layer": "sc3_112817geojson",
    //     paint: {
    //         "line-color": "#fff",
    //         "line-opacity": 0,
    //         "line-width": {
    //             stops: [[4, 6], [6, 8], [10, 35], [15, 55]]
    //         }
    //     }
    // },)

    map.addLayer({
        id: "NHD_SC1",
        type: "line",
        source: "NHD_SC1_source",
        "min-zoom": 5,
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        "source-layer": "sc1",
        paint: {
          "line-color": '#04c',
            // "line-color":   {
            //   property: "VM_FR_ED",
            //   stops: [
            //     [-1, '#adadad'],
            //     [1, '#00F0FF'],
            //     [2, '#0CE8C3'],
            //     [3, '#18E088'],
            //     [6, '#5CE053'],
            //     [11, '#BEE321'],
            //     [20, '#FDC613'],
            //     [32, '#F9694C'],
            //     [46, '#F60C86'],
            //     [100, '#F60C86'],
            //   ],
            //   default: 'rgba(255,255,255,0.0)',
            // },
            "line-opacity": sc1Opacity,
            "line-width": sc1Width
        }
    },'dark')

    map.addLayer({
        id: "NHD_SC2",
        type: "line",
        source: "NHD_SC2_source",
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        "source-layer": "sc2",
        paint: {
          "line-color": '#04c',
          // "line-color":   {
          //     property: "VM_FR_ED",
          //     stops: [
          //       [-1, '#adadad'],
          //       [1, '#00F0FF'],
          //       [2, '#0CE8C3'],
          //       [3, '#18E088'],
          //       [6, '#5CE053'],
          //       [11, '#BEE321'],
          //       [20, '#FDC613'],
          //       [32, '#F9694C'],
          //       [46, '#F60C86'],
          //       [100, '#F60C86'],
          //     ],
          //     default: 'rgba(255,255,255,0.0)',
          //   },
            "line-opacity": sc2Opacity,
            "line-width": sc2Width
        }
    },'dark')

    map.addLayer({
        id: "NHD_SC3",
        type: "line",
        source: "NHD_SC3_source",
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        "source-layer": "sc3_112817geojson",
        paint: {
            "line-color": '#04c',
          // "line-color":   {
          //     property: "VM_FR_ED",
          //     stops: [
          //       [-1, '#adadad'],
          //       [1, '#00F0FF'],
          //       [2, '#0CE8C3'],
          //       [3, '#18E088'],
          //       [6, '#5CE053'],
          //       [11, '#BEE321'],
          //       [20, '#FDC613'],
          //       [32, '#F9694C'],
          //       [46, '#F60C86'],
          //       [100, '#F60C86'],
          //     ],
          //     default: 'rgba(255,255,255,0.0)',
          //   },
            "line-opacity": sc3Opacity,
            "line-width": sc3Width
        }
    },'dark')
    var popup =  new mapboxgl.Popup({closeButton: false})

    map.on('mouseenter', "DAM", function(e) {
      map.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.lngLat)
          .setHTML('<div class="popup-header">'+e.features[0].properties.dam_name +'</div><br>Storage: '+e.features[0].properties.nid_storag+'<br>Year Built: '+e.features[0].properties.yr_blt_edt)
          .addTo(map);
        });

        map.on('mouseleave', 'DAM', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });

        map.on('mouseenter', "NHD_SC1", function(e) {
          map.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat)
          .setLngLat(e.lngLat)
          .setHTML('<div class="popup-header">'+e.features[0].properties.GNIS_NAME +'</div>')
          .addTo(map);
        });
        map.on('mouseleave', 'NHD_SC1', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });

        map.on('mouseenter', "NHD_SC2", function(e) {
          map.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat)
          .setLngLat(e.lngLat)
          .setHTML('<div class="popup-header">'+e.features[0].properties.GNIS_NAME +'</div>')
          .addTo(map);
        });
        map.on('mouseleave', 'NHD_SC2', function() {
          map.getCanvas().style.cursor = 'pointer';
        map.getCanvas().style.cursor = '';
        popup.remove();
        });
        map.on('mouseenter', "NHD_SC3", function(e) {
          map.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat)
          .setLngLat(e.lngLat)
          .setHTML('<div class="popup-header">'+e.features[0].properties.GNIS_NAME +'</div>')
          .addTo(map);
        });
        map.on('mouseleave', 'NHD_SC3', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });

      }

      function removeRiver(){
        map.removeLayer('NHD_SC1')
        map.removeLayer('NHD_SC2')
        map.removeLayer('NHD_SC3')
        map.removeLayer('DAM')
        map.removeSource('NHD_SC1_source')
        map.removeSource('NHD_SC2_source')
        map.removeSource('NHD_SC3_source')
        map.removeSource('damSource')
      }

      function removeRoads(){
        var roadLayers = map.getStyle().layers.filter(function(layer) {
          // filter out the road label layer
          return layer.id.indexOf('road-') > -1
        });

      roadLayers.forEach(function(layer) {
        map.setLayoutProperty(layer.id, 'visibility', 'none')
        //map.setPaintProperty(layer.id, 'line-color', caseExpression);
      });
      }

      function addRoads(){
        var roadLayers = map.getStyle().layers.filter(function(layer) {
          // filter out the road label layer
          return layer.id.indexOf('road-') > -1
        });

      roadLayers.forEach(function(layer) {
        map.setLayoutProperty(layer.id, 'visibility', 'visible')
        //map.setPaintProperty(layer.id, 'line-color', caseExpression);
      });
      }




    });
