window.onload = function init() {
  console.log("page loaded and DOM is ready");
  plot();
};


var parameters = {
  target: '#myFunction',
  data: [{
    fn: 'sin(x)', 
    color:'green',
    range:[0,2*Math.PI],
    closed:true
  }],
  grid: true,
  yAxis: {domain: [-1, 1]},
  xAxis: {domain: [0, 2*Math.PI]},
  tip: {
    xLine: true,
    yLine: true
  },
};


function plot() {
  var f = document.querySelector("#function").value;
  var xMin = document.querySelector("#xMin").value;
  var xMax = document.querySelector("#xMax").value;
  var yMin = document.querySelector("#yMin").value;
  var yMax = document.querySelector("#yMax").value;
  var color = document.querySelector("#color").value;
  
  parameters.data[0].fn = f;
  parameters.xAxis.domain = [xMin, xMax];
  parameters.yAxis.domain = [yMin, yMax];
  parameters.data[0].color = color;
  parameters.data[0].range =[xMin, xMax];

  
  functionPlot(parameters);
}