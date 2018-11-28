'use strict';

/**
* @namespace JCHS
*/

(function (H) {

  var JCHS = {

    logoURL: 'http://www.jchs.harvard.edu/sites/default/files/harvard_jchs_logo_2017.png',

    standardOptions: {
      lang: {
        thousandsSep: ",",
        contextButtonTitle: 'Export Chart',
        downloadPDF: 'Download as PDF',
        downloadCSV: 'Download chart data (CSV)',
        downloadXLS: 'Download chart data (Excel)'
      },

      chart: {
        spacing: [5, 5, 5, 5],
        marginTop: 40
      },

      title: { text: null },

      subtitle: { text: null },

      yAxis: {
        title: { text: null },
        labels: { format: '{value:,.0f}' }
      },

      credits: { enabled: false },

      tooltip: {
        enabled: true,
        useHTML: true,
        shared: true
      },

      plotOptions: {
        series: {
          connectNulls: true
        },
        spline: {
          marker: {
            enabled: false
          }
        }
      },

      exporting: {
        enabled: true,
        filename: 'Chart - Harvard Joint Center for Housing Studies',
        chartOptions: {
          chart: {
            spacingTop: 12,
            marginTop: 50,
            marginBottom: 130
          },
          title: {
            y: 8
          },
          subtitle: {
            //use subtitle element for our table notes on export
            widthAdjust: -170,
            x: 170,
            y: -28,
            align: 'left',
            verticalAlign: 'bottom'
          },
          series: { borderWidth: 0.5 },
          legend: {
            y: -45
          }
        },
        menuItemDefinitions: {
          viewFullDataset: {
            text: 'View full dataset'
          }
        },
        buttons: {
          contextButton: {
            text: 'Export',
            menuItems: ['viewFullDataset',
            //'viewSortableTable',
            'separator', 'printChart', 'downloadPDF', 'separator', 'downloadPNG', 'downloadJPEG', 'separator', 'downloadXLS']
          }
        }
      }, //end exporting

      navigation: {
        buttonOptions: {
          height: 20,
          symbolY: 8,
          symbolSize: 12,
          theme: { padding: 1 }
        } //end navigation
      } }, //end standardOptions

    colors6: {
      color1: '#467b91',
      color2: '#8db8c9',
      color3: '#c8ded6',
      color4: '#f6e599',
      color5: '#eab700',
      color6: '#c14d00'
    }

    /**
     * @function #createSearchBox
     * @memberof JCHS
     *
     * @description Add a search box with filtered list to the page. Adds one item to the list 
     * for each unique value of a column from ref_data.
     *    
     * On clicking a list item, the passed callback function is called, which 
     * passes the value of the search box as the only argument 
     * (i.e., $(`#search_input_${chart_slug}`).val()).
     *
     * @param {Array} data - Reference dataset for chart.
     * @param {String} chart_slug - Unique ID of chart, to ensure unique <div> 
     * ids in HTML.
     * @param {Function} callback - Function called on seach_box `change` event. 
     * Passes the value of the search box as the only argument 
     * (i.e., $(`#search_input_${chart_slug}`).val()).
     * @param {Number} [col_index] - Column index of data to be listed in the 
     * search box. Defaults to 0.
     * @param {String} [type] - 'dropdown' or 'search'. Only differences are 
     * 'dropdown' has a down arrow at the right side of the box and has 
     * placeholder text 'Select a metro...', while 'search' has no arrow 
     * and has placehold text  'Search for metro...'.
     * @param {String} [placeholder] - Override the default placeholder text. 
     * (e.g., 'Select a state...').
     *
     */

  };JCHS.createSearchBox = function (data, chart_slug, callback) {
    var col_index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'dropdown';
    var placeholder = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'Select a metro...';


    if (type === 'search') {
      placeholder = 'Search for metro...';
    }

    $('#search_box_' + chart_slug).append('<input id="search_input_' + chart_slug + '" class="JCHS-search-input">');

    var box = $('#search_input_' + chart_slug);
    box.attr('placeholder', placeholder);
    if (type != 'dropdown') {
      box.css('background-image', 'none');
    }

    box.after('<ul id="search_list_' + chart_slug + '" class="JCHS-search-list"></ul>');
    var list = $('#search_list_' + chart_slug);

    var dedup_data = [];

    data.forEach(function (el) {
      if (dedup_data.indexOf(el[col_index]) < 0) {
        dedup_data.push(el[col_index]);
      }
    });
    dedup_data.forEach(function (el) {
      return list.append('<li>' + el + '</li>');
    });

    box.on('focus', function () {
      box.val('');
      list.show();
    });

    box.on('keyup focus', function () {
      var filter = box.val().toUpperCase();
      $('li').each(function () {
        if ($(this).html().toUpperCase().indexOf(filter) > -1) {
          $(this).css('display', 'block');
        } else {
          $(this).css('display', 'none');
        }
      });
    });

    box.on('change', function () {
      callback($('#search_input_' + chart_slug).val());
      box.blur();
      list.hide();
    }); //end box.on 'change'

    box.on('blur', function () {
      list.hide();
    });

    list.on('mousedown', 'li', function (e) {
      box.val(e.target.innerHTML);
      box.change();
    });
  }; //end createSearchBox()


  /**
   * @function #createSearchBoxes
   * @memberof JCHS
   *
   * @description Add  search box with filtered list to the page. Adds one item to the list 
   * for each unique value of a column from ref_data.
   *    
   * On clicking a list item, the passed callback function is called, which 
   * passes the value of the search box as the only argument 
   * (i.e., $(`#search_input_${chart_slug}`).val()).
   *
   * @param {Number} number_of_boxes - Number of search boxes to create (max of 8).
   * @param {Array} data - Reference dataset for chart.
   * @param {String} chart_slug - Unique ID of chart, to ensure unique <div> 
   * ids in HTML.
   * @param {Function} callback - Function called on seach_box `change` event. 
   * Passes the value of the search box as the only argument 
   * (i.e., $(`#search_input_${chart_slug}`).val()).
   * @param {Number} [col_index] - Column index of data to be listed in the 
   * search box. Defaults to 0.
   * @param {String} [type] - 'dropdown' or 'search'. Only differences are 
   * 'dropdown' has a down arrow at the right side of the box and has 
   * placeholder text 'Select a metro...', while 'search' has no arrow 
   * and has placehold text  'Search for metro...'.
   * @param {String|Array} [placeholder] - Override the default placeholder text. 
   * Pass as an array to have different placeholder text in each box. 
   * (e.g., 'Select a state...' or ['Select a state...', 'Select a county...']).
   *
   */

  JCHS.createSearchBoxes = function (number_of_boxes, data, chart_slug, callback) {
    var col_index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var type = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'dropdown';
    var placeholder = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'Select a metro...';


    if (type === 'search') {
      placeholder = 'Search for metro...';
    }
    number_of_boxes = Math.min(number_of_boxes, 8);
    console.log(number_of_boxes);

    var counter = 0;
    while (counter < number_of_boxes) {
      //pass i as argument to anonmyous self-executing function so that it passes value not reference
      //see: https://stackoverflow.com/questions/2568966/how-do-i-pass-the-value-not-the-reference-of-a-js-variable-to-a-function
      (function (i) {
        $('#search_box_' + chart_slug).append('<input id="search_input_' + chart_slug + '_' + i + '" class="JCHS-search-input ' + chart_slug + '">');

        var box = $('#search_input_' + chart_slug + '_' + i);
        var this_placeholder = placeholder;
        if (Array.isArray(placeholder)) {
          this_placeholder = placeholder[i];
        }
        box.attr('placeholder', this_placeholder);
        if (type != 'dropdown') {
          box.css('background-image', 'none');
        }

        box.after('<ul id="search_list_' + chart_slug + '_' + i + '" class="JCHS-search-list"></ul>');
        var list = $('#search_list_' + chart_slug + '_' + i);

        var dedup_data = [];

        data.forEach(function (el) {
          if (dedup_data.indexOf(el[col_index]) < 0) {
            dedup_data.push(el[col_index]);
          }
        });
        dedup_data.forEach(function (el) {
          return list.append('<li>' + el + '</li>');
        });

        box.on('focus', function () {
          box.val('');
          list.show();
        });

        box.on('keyup focus', function () {
          var filter = box.val().toUpperCase();
          $('li').each(function () {
            if ($(this).html().toUpperCase().indexOf(filter) > -1) {
              $(this).css('display', 'block');
            } else {
              $(this).css('display', 'none');
            }
          });
        });

        box.on('change', function () {
          var params = [];
          $('#search_box_' + chart_slug).children("input").each(function () {
            params.push($(this).val());
          });
          callback.apply(null, params); //using apply() can pass params as an array
          box.blur();
          list.hide();
        }); //end box.on 'change'

        box.on('blur', function () {
          list.hide();
        });

        list.on('mousedown', 'li', function (e) {
          box.val(e.target.innerHTML);
          box.change();
        });
      })(counter);
      counter++;
    }
  }; //end createSearchBoxs()

  /**
   * @function #yAxisTitle
   * @memberof JCHS
   * 
   * @description Add y-axis titles in JCHS style, horizontal above the chart.
   *
   * @param {Object} chart - Reference to chart object. (`this` if called from within Highcharts event function.)
   * @param {String} yAxis_title - Main y-axis title.
   * @param {String} [yAxis2_title] - Secondary (right) y-axis title.
   * 
   */

  JCHS.yAxisTitle = function (chart, yAxis_title, yAxis2_title) {
    chart.renderer.text(yAxis_title).addClass('highcharts-axis-title').align({ y: -5 }, false, 'plotBox').add();

    //add title to second yAxis, if it exists
    if (typeof yAxis2_title == 'string') {
      var yAxis2 = chart.renderer.text(yAxis2_title).addClass('highcharts-axis-title').align({ align: 'right', y: -5 }, false, 'plotBox').add();
      var box = yAxis2.getBBox();
      yAxis2.translate(-box.width, 0);
    }
  };

  /**
   * @function #responsiveAnnotation
   * @memberof JCHS
   *
   * @description Add annontation text that responsively changes font size.
   *
   * @param {Object} chart - Reference to chart object. (`this` if called from within Highcharts event function.)
   * @param {String} text - Text to draw on chart.
   * @param {Number} [y] - y adjust for text location. Default is -20.
   * @param {String} [verticalAlign] - Vertical alignment of text. Default is 'bottom'.
   * @param {String} [align] - Horizontal alignment of text. Default is 'center'.
   * 
   * @example 
   * var rho_value = 'L(1) ρ = 0.53'
   * ...
   * chart: {
   *   events: {
   *     render: function() {
   *       H.JCHS.responsiveAnnotation(this, rho_value)
   *     }
   *   }
   * }
   * ...
   *
   */

  JCHS.responsiveAnnotation = function (chart, text) {
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -20;
    var verticalAlign = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'bottom';
    var align = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'center';

    var existing_text = document.querySelectorAll("#jchs-rendered-text");
    if (existing_text != null) {
      existing_text.forEach(function (x) {
        return x.parentNode.removeChild(x);
      });
    }
    var font_size = this.plotWidth > 200 ? '1.2em' : '1em';
    var rendered_text = chart.renderer.text(text).css({ fontSize: font_size }).attr({ id: 'jchs-rendered-text' }).align({ align: align, verticalAlign: verticalAlign, y: y }, false, 'plotBox').add();
    var box = rendered_text.getBBox();
    rendered_text.translate(-box.width / 2, 0);
  };

  /**
   * @function #mapLocatorCircle
   * @memberof JCHS
   * 
   * @description Draw a circle animated to "zero in" on a location, based on 
   * a search value that corresponds to a point name in the series 
   * displayed on the map. Useful when called from the searchCallback 
   * function when a user selects a metro from the search dropdown.
   *
   * @param {Object} map_object - Object containing a Highcharts map.
   * @param {String} search_value - The name to search for on the map. 
   * Compares the search_value to the point.name for each point in the 
   * currently displayed series. 
   *
   */

  JCHS.mapLocatorCircle = function (map_obj, search_value) {
    map_obj.series[0].points.forEach(function (el, idx) {
      if (el.name == search_value) {
        map_obj.series[0].points[idx].select(true);

        map_obj.renderer.circle(map_obj.series[0].points[idx].plotX, //x
        map_obj.series[0].points[idx].plotY + map_obj.margin[0], //y
        150 //radius
        ).attr({
          fill: 'transparent',
          stroke: 'black',
          'stroke-width': 1
        }).animate({
          r: 0
        }).add().toFront();
      }

      setTimeout(function () {
        return map_obj.series[0].points[idx].select(false);
      }, 700);
    });
  }; //end mapLocatorCircle()


  /**
   * @function #requestURL
   * @memberof JCHS
   * 
   * @description Builds a GET request URL for the Google Sheets API, based on input
   * sheet ID and range.
   * 
   * @param {String} sheetID - Unique ID of the Google Sheet (e.g., 
            '1LxTyrgt7sTtRYzEr6BlTnKwpwoQPz5WiIrA8dpocgRM').
   * @param {String} [range] - The data range. Defaults to 'Sheet1'. Accepts 
   *        sheet ranges that conform to the Google API (e.g., 'Sheet1!A:F').
   *
   * @returns {String} A URL.
   *
   */

  JCHS.requestURL = function (sheetID) {
    var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Sheet1';

    var baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/';
    var API_Key = 'AIzaSyDY_gHLV0A7liVYq64RxH7f7IYUKF15sOQ';
    var API_params = 'valueRenderOption=UNFORMATTED_VALUE';
    var requestURL = baseURL + sheetID + "/values/" + range + "?key=" + API_Key + "&" + API_params;

    console.log(requestURL);

    return requestURL;
  };

  /**
   * @function #numFormat
   * @memberof JCHS
   * 
   * @description Format a number and return a string. Based on Highcharts.numberFormat().
   *
   * @param {Number} number - The input number to format.
   * @param {Number} [decimals] - The amount of decimals. A value of -1 preserves
   *        the amount in the input number. Defaults to a maximum of 2 decimals 
   *        (i.e., 1 returns '1', 1.2 returns '1.2', 1.23 returns '1.23', 1.234 
   *        returns '1.23').
   *
   * @returns {String} The formatted number.
  
   */

  JCHS.numFormat = function (number, decimals) {
    /* Based on Highcharts.numberFormat */
    number = +number || 0;
    decimals = +decimals;

    var origDec = (number.toString().split('.')[1] || '').length,
        decimalPoint = '.',
        thousandsSep = ',',
        strinteger,
        thousands,
        ret,
        roundedNumber;

    if (decimals === -1) {
      // Preserve decimals. Not huge numbers (#3793).
      decimals = Math.min(origDec, 20);
    } else if (isNaN(decimals)) {
      decimals = Math.min(origDec, 2);
    }

    // Add another decimal to avoid rounding errors of float numbers. (#4573)
    // Then use toFixed to handle rounding.
    roundedNumber = (Math.abs(number) + Math.pow(10, -Math.max(decimals, origDec) - 1)).toFixed(decimals);

    // A string containing the positive integer component of the number
    strinteger = String(parseInt(roundedNumber));

    // Leftover after grouping into thousands. Can be 0, 1 or 2.
    thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

    // Start building the return
    ret = number < 0 ? '-' : '';

    // Add the leftover after grouping into thousands. For example, in the
    // number 42 000 000, this line adds 42.
    ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

    // Add the remaining thousands groups, joined by the thousands separator
    ret += strinteger.substr(thousands).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);

    // Add the decimal point and the decimal component
    if (decimals) {
      // Get the decimal component
      ret += decimalPoint + roundedNumber.slice(-decimals);
    }

    return ret;
  }; //end numFormat


  /* Add JCHS functionality to Highcharts */

  //attach JCHS to main Highcharts object
  H.JCHS = JCHS;

  //set standard options as default for all charts
  H.setOptions(JCHS.standardOptions);

  //add callbacks to chart load
  H.Chart.prototype.callbacks.push(function (chart) {
    if (chart.renderer.forExport) {
      chart.renderer.image(JCHS.logoURL, 0, chart.chartHeight - 50, 170, 55).add();
    }
    chart.update({
      exporting: {
        menuItemDefinitions: {
          viewFullDataset: {
            text: 'View full dataset',
            onclick: function onclick() {
              window.open('https://docs.google.com/spreadsheets/d/' + chart.options.JCHS.sheetID);
            }
          }
        }
      }
    });
  });

  //add y-axis title draw to chart render event
  H.wrap(H.Chart.prototype, 'render', function (proceed) {
    //call original function
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    //draw y-axis titles in JCHS style
    H.JCHS.yAxisTitle(this, this.options.JCHS.yAxisTitle, this.options.JCHS.yAxisTitle2);
  });
})(Highcharts);
