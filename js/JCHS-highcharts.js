/**
* @namespace JCHS
*/

var JCHS = {

  sheetID: 'placeholder',

  range: 'Sheet1',

  colors6: {
    color1: '#467b91',
    color2: '#8db8c9',
    color3: '#c8ded6',
    color4: '#f6e599',
    color5: '#eab700',
    color6: '#c14d00'
  },

  logoURL: 'http://www.jchs.harvard.edu/sites/default/files/harvard_jchs_logo_2017.png',


  standardOptions: {

    chart: {
      marginTop: 40,
      events: {
        load: function () {
          if (this.renderer.forExport) {
            this.renderer
              .image(JCHS.logoURL, 0, this.chartHeight - 50, 170, 55)
              .add()
          }
          Highcharts.setOptions({ 
            lang: { 
              thousandsSep: ",",
              contextButtonTitle: 'Export Chart',
              downloadPDF: 'Download as PDF',
              downloadCSV: 'Download chart data (CSV)',
              downloadXLS: 'Download chart data (Excel)'
            } 
          })
          this.update({ 
            exporting: { 
              chartOptions: { 
                subtitle: { 
                  text: table_notes 
                } 
              } 
            },
            xAxis: {
              categories: categories
            },
            exporting: {
              menuItemDefinitions: {
                viewFullDataset: {
                  text: 'View full dataset',
                  onclick: function () {
                    window.open('https://docs.google.com/spreadsheets/d/' + sheetID)
                  }
                }
              }
            }
          })
        }
      }
    },

    title: { 
      style: { fontFamily: '"Open Sans", sans-serif' },
      text: null
    },

    subtitle: { 
      style: { fontFamily: '"Open Sans", sans-serif' },
      text: null
    },

    legend: { 
      title: { 
        style: { 
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: 'normal'
        } 
      },
      itemStyle: { 
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 'normal'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },

    xAxis: { 
      title: { style: { fontFamily: '"Open Sans", sans-serif' } },
      labels: { style: { fontFamily: '"Open Sans", sans-serif' } }
    },
    
    yAxis: [{
      labels: { style: { fontFamily: '"Open Sans", sans-serif'} },
      title: {
        text: 'null',
        offset: -110,
        x: 23,
        y: -5,
        align: 'high',
        rotation: 0,
        style: {
          whiteSpace: 'nowrap',
          fontFamily: '"Open Sans", sans-serif'
        }
      }
    },{
      labels: { style: { fontFamily: '"Open Sans", sans-serif'} },
      title: {
        text: 'null',
        offset: -110,
        x: 23,
        y: -5,
        align: 'high',
        rotation: 0,
        style: {
          whiteSpace: 'nowrap',
          fontFamily: '"Open Sans", sans-serif'
        }
      }
    }],

    tooltip: { 
      enabled: true,
      style: { fontFamily: '"Open Sans", sans-serif' },
      backgroundColor: 'rgba(247,247,247, 1)',
      useHTML: true,
      shared: true
    },

    credits: { 
      enabled: false,
      style: { 
        fontFamily: '"Open Sans", sans-serif',
        color: '#333',
      } 
    },

    exporting: {
      enabled: true,
      chartOptions: {
        chart: { 
          marginTop: 25, 
          marginBottom: 80 
        },
        title: {
          style: { fontSize: '16px' },
          y: 8
        },
        subtitle: {
          //use subtitle element for our table notes on export
          widthAdjust: -170,
          x: 170,
          y: -28,
          align: 'left',
          verticalAlign: 'bottom',
          style: {
            color: '#999999',
            fontSize: '7px'
          }
        },
        series: { borderWidth: 0.5 },
        legend: { 
          y: 60,
        }
      },
      menuItemDefinitions: {
        viewFullDataset: {
          text: 'View full dataset',
          onclick: function () {
            window.open('https://docs.google.com/spreadsheets/d/' + SheetID)
          }
        }
      },
      buttons: {
        contextButton: {
          text: '<span style="font-family: Open Sans, sans-serif;">Export</span>',
          menuItems: [
            'viewFullDataset',
            //'viewSortableTable',
            'separator',
            'printChart',
            'downloadPDF',
            'separator',
            'downloadPNG',
            'downloadJPEG',
            'separator',
            'downloadXLS',
            //'downloadFullData'
          ],
          theme: { fill: '#ffffff00' },
          y: -10,
          x: 10
        }
      }
    } //end exporting

  }, //end standardOptions

  mapOptions: {
    plotOptions: {
      series: {
        allAreas: false,
        joinBy: ['GEOID', 0],
        keys: ['GEOID', 'value'],
        states: {
          select: { color: '#333' }
        },
        point: { 
          events: { 
            click: function (event) {
              drilldown(event.point.GEOID, event.point.name) 
            }
          }
        }
      },
      mapline: {
        color: '#333',
        lineWidth: 0.5,
        enableMouseTracking: false
      }
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
  }, //end mapOptions

  drilldownOptions: {
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

    legend: {enabled: false },

    exporting: {enabled: false }

  }, //end drilldownOptions

}

/**
* Compiles the correct set of options for different chart types.
* Returns the standard options if no chart type is given. 
*
* @function #options
* @memberof JCHS
* @param {String} chart_type - Currently supports 'map' and 
* 'drilldown'.
*/

JCHS.options = function (chart_type) {
  if (chart_type === 'map') {
    return $.extend(true, {}, JCHS.standardOptions, JCHS.mapOptions)
  } else if (chart_type === 'drilldown') {
    return $.extend(true, {}, JCHS.standardOptions, JCHS.drilldownOptions)
  } else {
    return JCHS.standardOptions
  }
}


/**
 * Builds a GET request URL for the Google Sheets API, based on input
 * sheet ID and range.
 *
 * @function #requestURL
 * @memberof JCHS
 * @param {String} sheetID - Unique ID of the Google Sheet (e.g., 
          '1LxTyrgt7sTtRYzEr6BlTnKwpwoQPz5WiIrA8dpocgRM').
 * @param {String} [range] - The data range. Defaults to 'Sheet1'. Accepts 
 *        sheet ranges that conform to the Google API (e.g., 'Sheet1!A:F').
 * @returns {String} A URL.
 *
 */

JCHS.requestURL = function (sheetID, range) {
  range = range || 'Sheet1'
  
  var baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/'
  var API_Key = 'AIzaSyDY_gHLV0A7liVYq64RxH7f7IYUKF15sOQ'
  var API_params = 'valueRenderOption=UNFORMATTED_VALUE'
  var requestURL = baseURL + sheetID + "/values/" + range + "?key=" + API_Key + "&" + API_params

  return requestURL
}


/**
 * Format a number and return a string.
 *
 * @function #numFormat
 * @memberof JCHS
 * @param {Number} number - The input number to format.
 * @param {Number} [decimals] - The amount of decimals. A value of -1 preserves
 *        the amount in the input number. Defaults to a maximum of 2 decimals 
 *        (i.e., 1 returns '1', 1.2 returns '1.2', 1.23 returns '1.23', 1.234 
 *        returns '1.23').
 * @returns {String} The formatted number.
 *
 */

JCHS.numFormat = function (number, decimals) {
  /* Based on Highcharts.numberFormat */
  number = +number || 0;
  decimals = +decimals;

  var origDec = (number.toString().split('.')[1] || '').length,
      strinteger,
      thousands,
      ret,
      roundedNumber,
      fractionDigits;

  if (decimals === -1) {
    // Preserve decimals. Not huge numbers (#3793).
    decimals = Math.min(origDec, 20);
  } else if (isNaN(decimals)) {
    decimals = Math.min(origDec, 2);
  }

  // Add another decimal to avoid rounding errors of float numbers. (#4573)
  // Then use toFixed to handle rounding.
  roundedNumber = (
    Math.abs(number) +
    Math.pow(10, -Math.max(decimals, origDec) - 1)
  ).toFixed(decimals);

  // A string containing the positive integer component of the number
  strinteger = String(parseInt(roundedNumber));

  // Leftover after grouping into thousands. Can be 0, 1 or 2.
  thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

  // Language
  decimalPoint = '.';
  thousandsSep = ',';

  // Start building the return
  ret = number < 0 ? '-' : '';

  // Add the leftover after grouping into thousands. For example, in the
  // number 42 000 000, this line adds 42.
  ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

  // Add the remaining thousands groups, joined by the thousands separator
  ret += strinteger
    .substr(thousands)
    .replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);

  // Add the decimal point and the decimal component
  if (decimals) {
    // Get the decimal component
    ret += decimalPoint + roundedNumber.slice(-decimals);
  }

  return ret;

} //end numFormat



JCHS.createSearchBox = function  (data, 
                                   chart_slug, 
                                   col_index = 0, 
                                   type = 'dropdown',
                                   placeholder = 'Select a metro...') {

  if (type === 'search') { placeholder = 'Search for metro...' } 

  $(`#search_box_${chart_slug}`).append(`<input id="search_input_${chart_slug}" class="JCHS-search-input">`)

  var box = $(`#search_input_${chart_slug}`)
  box.attr('placeholder', placeholder)
  box.css('font-family', 'Open Sans')
  if (type != 'dropdown') { box.css('background-image', 'none') }

  box.after(`<ul id="search_list_${chart_slug}" class="JCHS-search-list"></ul>`)
  var list = $(`#search_list_${chart_slug}`)

  var dedup_data = []

  data.forEach(function (el) {
    if (dedup_data.indexOf(el[col_index]) < 0) {
      dedup_data.push(el[col_index])
    }  
  })
  dedup_data.forEach( el => list.append(`<li>${el}</li>`) )

  box.on('focus', function () {
    box.val('')
    list.show()
  })

  box.on('keyup focus', function () {
    var filter = box.val().toUpperCase()
    $('li').each(function (idx) {
      if ($(this).html().toUpperCase().indexOf(filter) > -1) {
        $(this).css('display', 'block')
      } else {
        $(this).css('display', 'none')
      }
    })
  })

  box.on('change', function () {
    selectPoint($(`#search_input_${chart_slug}`).val())   
    box.blur()
    list.hide() 
  }) //end box.on 'change'

  box.on('blur', function () {
    list.hide()
  })

  list.on('mousedown', 'li', function (e) {
    box.val(e.target.innerHTML)
    box.change()
  })

} //end createSearchBox()