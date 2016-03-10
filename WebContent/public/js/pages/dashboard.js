$(function () {

  "use strict";

  //Make the dashboard widgets sortable Using jquery UI
  $(".connectedSortable").sortable({
    placeholder: "sort-highlight",
    connectWith: ".connectedSortable",
    handle: ".box-header, .nav-tabs",
    forcePlaceholderSize: true,
    zIndex: 999999
  });
  $(".connectedSortable .box-header, .connectedSortable .nav-tabs-custom").css("cursor", "move");

  /* jQueryKnob */
  $(".knob").knob();

  var line = new Morris.Line({
    element: 'line-chart',
    resize: true,
    data: [
      {y: '2014 Q1', item1: 12, item2: 3},
      {y: '2014 Q2', item1: 10, item2: 6},
      {y: '2014 Q3', item1: 23, item2: 11},
      {y: '2014 Q4', item1: 33, item2: 3},
      {y: '2015 Q1', item1: 26, item2: 9},
      {y: '2015 Q2', item1: 30, item2: 8},
      {y: '2015 Q3', item1: 12, item2: 2},
      {y: '2015 Q4', item1: 18, item2: 7},
      {y: '2016 Q1', item1: 39, item2: 4}
    ],
    xkey: 'y',
    ykeys: ['item1', 'item2'],
    labels: ['Dead Code', 'Large Class'],
    lineColors: ['#a0d0e0', '#3c8dbc'],
    hideHover: 'auto'
  });
});