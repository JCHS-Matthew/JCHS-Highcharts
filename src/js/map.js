(function (H) {
  H.JCHS.mapOptions = {
    plotOptions: {
      series: {
        allAreas: false,
        allowPointSelect: true,
        joinBy: ['GEOID', 0],
        keys: ['GEOID', 'value']
      },
      mapline: { enableMouseTracking: false }
    }, //end plotOptions

    colorAxis: {
      dataClassColor: 'category'
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      y: 140,
      x: 16,
      padding: 5,
      labelFormatter: function () {
        if (!this.hasOwnProperty('from')) {
          return 'Under ' + this.to
        } else if (!this.hasOwnProperty('to')) {
          return this.from + ' or Over'
        } else {
          return this.from + ' – ' + this.to
        }
      }
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: { x: 1 },
      buttons: {
        zoomIn: { y: 1 },
        zoomOut: { y: 29 }
      }
    } 
  } //end mapOptions

  //set map options as default for maps
  H.setOptions(H.JCHS.mapOptions)

  //add callback to chart load
  H.Chart.prototype.callbacks.push(function (chart) {
    if (chart.options.chart.type === "map") {
      if (chart.options.JCHS.drilldownFunction) {
        chart.update({
          plotOptions: {
            series: {
              point: {
                events: {
                  click: function () {
                    chart.options.JCHS.drilldownFunction(event.point.GEOID, event.point.name, event.point)
                  }
                } //end events
              } //end point 
            } //end series
          } //end plotOptions
        }) //end chart.update
      } //end if
    } //end if
  }) //end callbacks.push

}(Highcharts))