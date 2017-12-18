/** RadarChart
 *
 * This is the main reuseable function to draw radar charts.
 *
 * The original d3 project is found on: https://github.com/alangrafu/radar-chart-d3
 * This version is based on the cleaned version found on: http://bl.ocks.org/nbremer/6506614
 * with some reorganization of code and added commenting, as well as further function abstractions
 * to allow for addition/removal of visualization components via tweaking configuration parameters.
 *
 **/

var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
     radius: 5,
     w: 600,
     h: 600,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 200,
     ExtraWidthY: 200,
     color: d3.scale.category10()
    };

    if(d3.selectAll('.radar-tooltip')[0].length == 0)
      var tooltip = d3.select(id).append("div")
                    .attr("class", "tooltip radar-tooltip");
    
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
    var allAxis = (d[0].map(function(i, j){return i.axis}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    d3.select(id).select("svg").remove();
    
    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w + cfg.ExtraWidthX)
        .attr("height", cfg.h + cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
    
    //Circular segments
    for(var j=0; j<cfg.levels-1; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text(j+1);
    }
    
    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);})
      .on('mouseenter', onMouseOver)
      .on('mouseleave', onMouseLeave);

    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes").data(y, function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
      });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radar-chart-serie"+series)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        .attr("points",function(d) {
          var str="";
          for(var pti=0;pti<d.length;pti++){
            str=str+d[pti][0]+","+d[pti][1]+" ";
          }
          return str;
        })
        .style("fill", function(j, i){return cfg.color(series)})
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d){
          z = "polygon."+d3.select(this).attr("class");
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", 0.1); 
          g.selectAll(z)
            .transition(200)
            .style("fill-opacity", .7);
         })
        .on('mouseout', function(){
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea);
        });
      series++;
    });

    function onMouseOver(d) {
      var ind = Object.values(cognFunc).indexOf(d);
      var id = Object.keys(cognFunc)[ind];
      var text = cognFuncDesc[id];

      var tooltip = d3.select('.radar-tooltip');
      tooltip.transition()        
        .duration(200)
        .style("opacity", .8);

      tooltip.html(text)
        .style("left", (d3.event.pageX - cfg.ExtraWidthX) + "px")
        .style("top", d3.event.pageY + "px");
    }

    function onMouseLeave() {
      var tooltip = d3.select('.radar-tooltip');
      tooltip.transition()        
        .duration(500)
        .style("opacity", 0);
    }
  }
};