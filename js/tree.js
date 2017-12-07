var TreeGraph = {

  draw: function(container, width, height, data) {
    var tree, root;

    var margin = {top: 0, right: 150, bottom: 100, left: 100},
      width = width,
      height = height;

    var i = 0,
      duration = 750;

    tree = d3.layout.tree()
      .size([height, width]);

    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.right + "," + margin.top + ")");

    var xScale = d3.scale.linear()
                .domain([0,5])
                .range([0, 400]);

    var xAxis = d3.svg.axis("top")
              .scale(xScale)
              .ticks(5);

    var tooltip = d3.select(container).append("div")
                    .attr("class", "tooltip");

    root = data;
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    root.children.forEach(collapse);
    update(root);

    function update(source) {
      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * 150; });

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", click);

      nodeEnter.append("circle")
          .attr("class", function(d) { return d.children || d._children ? "node--internal" : "node--leaf"; })
          .attr("r", 1)
          .style("fill", function(d) { return d._children ? "#aaa" : "#000"; });

      nodeEnter.append("text")
          .attr("class", function(d) { return d.children || d._children ? "node--internal" : "node--leaf" })
          .attr("x", function(d) { return d.children || d._children ? -15 : 15; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6)
          .on('mouseenter', onMouseOver)
          .on('mouseleave', onMouseLeave);

      // UGLY IMPLEMENTATION OF INFO BOX "I"
      nodeEnter.each(function(d) {
        //TODO: remove later when third level of tree
        if(!(d.children || d._children))
          return;
        
        // TODO: info image instead
        d3.select(this).append("svg:image")
            .attr("class", "textinfo")
            .attr("x", function(d) { return -20 - d.name.length * 10; })
            .attr("y", -8)
            .attr("xlink:href", "img/info_icon.png")
            .style("width", '4%')
            .style("height", '4%')
            .on('click', goToExerciseDescription);
      })

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("class", function(d) { return d.children || d._children ? "node--internal" : "node--leaf"; })
          .attr("r", function(d) { return d._children ? 7 : 5; })
          .style("fill", function(d) { return d._children ? "#aaa" : "#000"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("class", function(d) { return d.children || d._children ? "node--internal" : "node--leaf"; })
          .attr("r", 1);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      addToSelectedExercises(d.id);
      update(d);
    }

    function onMouseOver() {
      var tooltip = d3.select('.tooltip');
      tooltip.transition()        
        .duration(200)      
        .style("opacity", .8);

      tooltip.html("tooltip")
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    }

    function onMouseLeave() {
      var tooltip = d3.select('.tooltip');
      tooltip.transition()        
        .duration(500)
        .style("opacity", 0);
    }

    function goToExerciseDescription(d) {
      event.stopPropagation();
      createExercisePage(d.id);

      // TODO: page order
      var options = {'animation':1, 'showPage': 2}
      PageTransitions.nextPage( options );
      showBackButton();
      $('#sidebar').css('display', 'none');
    }
  },

  clear: function() {
    d3.select('svg').remove();
  }
};