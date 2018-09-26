(function (JCHS) {
    JCHS.drilldownOptions = {
      chart: {
        height: 180,
        //width: 600,
        spacingTop: 1
      },

      plotOptions: { series: { label: { enabled: false } } },

      title: { style: { fontSize: '13px' } },

      yAxis: { title: { text: null } },

      tooltip: {
        pointFormat: "<b>{point.y}</b>",
        valueDecimals: 0
      },

      legend: { enabled: false },

      exporting: { enabled: false }

    } //end drilldownOptions
}(Highcharts.JCHS))