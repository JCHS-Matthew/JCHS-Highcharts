var H = Highcharts
var cbsas = Highcharts.geojson(Highcharts.maps['countries/us/cbsa'])
var states = Highcharts.geojson(Highcharts.maps['countries/us/states'])

var chart_slug = 'demo1'

var sheetID = '1PwHQog5axA1AigRdbavMUnItaPp3GOqneTNbYJnjP2E'
var range = 'Sheet3!A:BA'

var chart_title = 'Cost Burdens Rise with Age in Many Metros'
var legend_title = 'Households with<br/>Cost Burdens<br/>(Percent)'

var table_notes = 'Notes: Moderately (severely) cost-burdened households pay 30–50% (more than 50%) of income for housing. Households with zero or negative income are assumed to have severe burdens, while households paying no cash rent are assumed to be without burdens. <br/> Source: JCHS tabulations of US Census Bureau, 2006–2016 American Community Survey 1-Year Estimates using the Missouri Data Center MABLE/geocorr14.'

var export_filename = "Older Adult Housing Cost Burdens - Harvard JCHS - State of the Nation's Housing 2018"

var default_selection = 2

var categories = [],
    ref_data = [],
    selected_data = [],
    chart_options = {},
    chart = {},
    drilldown_chart = {}

/*~~~~~~~ Document ready function ~~~~~~~*/
$(document).ready(function() {
  //get Google sheet data
  $.get(H.JCHS.requestURL(sheetID, range), function(obj) {
    categories = obj.values[0]
    ref_data = obj.values.slice(1)

    selected_data = ref_data.map(function (x) {
      return [x[0], x[default_selection]] 
    })
    
    //create the title, notes, and search box
    $('#chart_title').html(chart_title)
    $('#table_notes').html(table_notes)
    H.JCHS.createSearchBox(ref_data, searchCallback, chart_slug, 1, 'search')

    //create the chart
    createChart() 

  }) 
}) //end document.ready

function searchCallback (metro_name) {
  H.JCHS.mapLocatorCircle(chart, metro_name)
  //setTimeout(function () {drilldownChart(metro_name)}, 1000)
}

function createChart() {

  /*~~~~~~~ Chart Options ~~~~~~~*/
  chart_options = {
    JCHS: {
      drilldownFunction: drilldownChart
    },
    chart: {
      events: {
        load: function() {
          initUserInteraction()
        },
      },
    },

    legend: {
        title: {
          text: legend_title
        },
    },

    colorAxis: {
      dataClasses: [
        { to: 20 },
        { from: 20, to: 30 }, 
        { from: 30, to: 40 },
        { from: 40 }
      ]
    },
    series: [
      {
        type: 'map',
        name: selected_data[0][1],
        mapData: cbsas,
        data: selected_data
      }, {
        type: 'mapline',
        name: 'State borders',
        data: states
      }
    ], //end series


    // Exporting options
    exporting: {
      filename: export_filename,
      JCHS: { sheetID: sheetID },
      chartOptions: {
        chart: {
          //marginBottom: 130 //may have to adjust to fit all of the notes
        },
        title: { text: chart_title },
        subtitle: { 
          text: table_notes,
          //y: -18 //may have to adjust to fit all of the notes
        },
        legend: { 
          //y: -45 //may have to adjust to fit all of the notes
        }
      }
    }, //end exporting
    
    tooltip: {
      formatter: function() {
        var point = this 
        var tooltip_text = ''
        tooltip_text +=  '<b>' + point.point.name + '</b>' +
          '<br> <i>' + point.series.name + '</i>' +
          '<br/><br/>' + 
          'Share of Households with Cost Burdens: <b>' + H.JCHS.numFormat(this.point.value, 0) + '%</b>'
        
        var hhd_type = parseInt($('#user_input :checked').val())     

        ref_data.forEach(function (el) {
          if (el[0] == point.point.GEOID) {

            tooltip_text += '<br>Share of Households with Severe Cost Burdens: <b>' + H.JCHS.numFormat(el[hhd_type + 3], 0) + '%</b>'

            tooltip_text += '<br>Households with Cost Burdens: <b>' + H.JCHS.numFormat(el[hhd_type + 6], 0) + '</b>'

            tooltip_text += '<br>Median Household Income: <b>$' + H.JCHS.numFormat(el[hhd_type + 9], 0) + '</b>' 

            tooltip_text += '<br>Median Monthly Housing Costs: <b>$' + H.JCHS.numFormat(el[hhd_type + 12], 0) + '</b>' 

          }
        })

        tooltip_text += '<br><br><i>Click to see change over time...</i>'

        return tooltip_text

      }
    }
  } //end chart_options

  /*~~~~~~~ Create Chart ~~~~~~~*/
  chart = Highcharts.mapChart(
    'container',
    chart_options
  ) //end chart
  
} //end createChart()

/*~~~~~~~~~~~~~~ User interaction ~~~~~~~~~~~~~~~~~~~*/
function initUserInteraction () {
  $('#user_input').on('change', function () {
    var new_col = parseInt($('#user_input :checked').val())
    var new_data = ref_data.map(function (x) {
      return [x[0], x[new_col]]
    })
    chart.series[0].update({name: new_data[0][1]})   
    chart.series[0].setData(new_data)
  })
}


function drilldownChart(metro_name) {
  $('.JCHS-chart__modal').css("display", "block")
  console.log(metro_name)
  
  var chart_data = []
  
  ref_data.forEach(function (el) {
    if (el[1] == metro_name) {
      switch ($('#user_input :checked').val()) {
        case '2':  
          chart_data = el.slice(17,28)
          break
        case '3':  
          chart_data = el.slice(28,39) 
          break
        case '4':  
          chart_data = el.slice(39,50) 
          break          
      } //end switch
    } //end if
  }) //end forEach

  var drilldown_options = {
    JCHS: {
      yAxis_title: 'Percent'
    },

    subtitle: {
      text: 
      'Share of Cost-Burdened Households Age ' + 
      $('#user_input :checked').parent('label').text().trim() + 
      ' in ' + metro_name
    },


    yAxis: [{
      labels: {
        enabled: true,
        format: "{value}%"
      }
    }],

    xAxis: {
      categories: categories.slice(17, 28)
    },

    tooltip: {
      pointFormat: "<b>{point.y}</b>",
      valueDecimals: 0,
      valueSuffix: '%'
    },

    series: [
      {
        name: metro_name,
        data: chart_data,
        zones: [
          {
            value: 20,
            className: 'zone-0'
          },
          {
            value: 30,
            className: 'zone-1'
          },
          {
            value: 40,
            className: 'zone-2'
          },
          {
            className: 'zone-3'
          }
        ],
    }],
    
  }

  drilldown_chart = Highcharts.chart(
    'drilldown_chart',
    H.merge(H.JCHS.drilldownOptions, drilldown_options)
  )

} //end drilldownChart()

