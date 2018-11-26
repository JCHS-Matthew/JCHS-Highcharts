(function (H) {
  H.JCHS.mapOptions = {
    chart: {
      margin: [10,5,10,5], 
      marginTop: 10, //need to override individual settings as well
      marginBottom: 10 //need to override individual settings as well
    },
    plotOptions: {
      map: {
        //series: {
        allAreas: false,
        allowPointSelect: true,
        joinBy: ['GEOID', 0],
        keys: ['GEOID', 'value']
      //},
      },
      mapline: { enableMouseTracking: false }
    
    }, //end plotOptions

    colorAxis: {
      dataClassColor: 'category'
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'bottom',
      //y: 140,
      x: 10,
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
      //buttonOptions: { x: 1 },
      //buttons: {
        //zoomIn: { y: 1 },
        //zoomOut: { y: 29 }
      //}
    },

    /*responsive: {
      rules: [
        {
          condition: { maxWidth: 500 },
          chartOptions: {
            exporting: { enabled: false },
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              x: 0,
              y: 0,
              itemDistance: 8
            }
          }
        }
      ] //end responsive rules
    },//*/ //end responsive
    
    exporting: {
      buttons: {
        contextButton: {
          text: 'Export',
          menuItems: [
            'viewFullDataset',
            //'viewSortableTable',
            'separator',
            'printChart',
            //'downloadPDF',
            //'separator',
            //'downloadPNG',
            //'downloadJPEG',
            //'separator',
            //'downloadXLS',
            //'downloadFullData'
          ]
        }
      }
    }, //end exporting
  } //end mapOptions

  H.setOptions(H.JCHS.mapOptions)

  H.Chart.prototype.callbacks.push(function (chart) {
    if (chart.options.chart.type === "map") {
      if (chart.options.JCHS.drilldownFunction) {
        chart.update({
          plotOptions: {
            series: {
              point: {
                events: {
                  click: function () {
                    chart.options.JCHS.drilldownFunction(event.point.name, event.point.GEOID, event.point)
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