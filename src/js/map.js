(function (JCHS) {
  JCHS.mapOptions = {
    plotOptions: {
      series: {
        allAreas: false,
        joinBy: ['GEOID', 0],
        keys: ['GEOID', 'value'],
        point: {
          events: {
            click: function (event) {
              drilldown(event.point.GEOID, event.point.name)
            }
          }
        }
      },
      mapline: { enableMouseTracking: false }
    }, //end plotOptions

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
}(Highcharts.JCHS))