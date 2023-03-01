const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const colorScale = d3
  .scaleOrdinal()
  .domain(["setosa", "versicolor", "virginica"])
  .range(["#ff0000", "#00ff00", "#0000ff"]);

const FRAME1 = d3
  .select("#col1")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

d3.csv("data/iris.csv").then((data) => {
  const MAX_X2 = d3.max(data, (d) => {
    return parseInt(d.Sepal_Length) + 1;
  });

  const MAX_Y2 = d3.max(data, (d) => {
    return parseInt(d.Petal_Length) + 1;
  });

  const X_SCALE = d3.scaleLinear().domain([0, MAX_X2]).range([0, VIS_WIDTH]);
  const Y_SCALE = d3.scaleLinear().domain([0, MAX_Y2]).range([VIS_HEIGHT, 0]);

  FRAME1.selectAll("points")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return X_SCALE(d.Sepal_Length) + MARGINS.left;
    })
    .attr("cy", (d) => {
      return Y_SCALE(d.Petal_Length) + MARGINS.left;
    })
    .attr("r", 7)
    .attr("opacity", 0.5)
    .attr("class", "point")
    .attr("fill", function (d) {
      return colorScale(d.Species);
    });

  FRAME1.append("g")
    .attr(
      "transform",
      "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")"
    )
    .call(d3.axisBottom(X_SCALE).ticks(8))
    .attr("font-size", "13px");

  FRAME1.append("g")
    .attr("transform", "translate(" + MARGINS.right + ", " + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE).ticks(8))
    .attr("font-size", "13px");
});

const FRAME2 = d3
  .select("#col2")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame")
  .attr("class", "frame2");

d3.csv("data/iris.csv").then((data) => {
  const MAX_X2 = d3.max(data, (d) => {
    return parseInt(d.Sepal_Width) + 1;
  });

  const MAX_Y2 = d3.max(data, (d) => {
    return parseInt(d.Petal_Width) + 1;
  });

  const X_SCALE = d3.scaleLinear().domain([0, MAX_X2]).range([0, VIS_WIDTH]);
  const Y_SCALE = d3.scaleLinear().domain([0, MAX_Y2]).range([VIS_HEIGHT, 0]);

  let listCircles = FRAME2.selectAll("points")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return X_SCALE(d.Sepal_Width) + MARGINS.left;
    })
    .attr("cy", (d) => {
      return Y_SCALE(d.Petal_Width) + MARGINS.left;
    })
    .attr("r", 7)
    .attr("opacity", 0.5)
    .attr("class", "point")
    .attr("fill", function (d) {
      return colorScale(d.Species);
    });

  FRAME2.append("g")
    .attr(
      "transform",
      "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")"
    )
    .call(d3.axisBottom(X_SCALE).ticks(11))
    .attr("font-size", "13px");

  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.right + ", " + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE).ticks(16))
    .attr("font-size", "13px");

  var brush = d3
    .brush()
    .extent([[0, 0], [VIS_WIDTH + MARGINS.left, VIS_HEIGHT + MARGINS.top]])
    .on("brush", brushFn);

  // Create the brush
  FRAME2.append("g").attr("class", "brush").call(brush);

  // Define the brushing function
  function brushFn(event) {
    // Get the selection coordinate
    let selection = event.selection; // looks like [ [12,11], [132,178]]

    listCircles.classed("selected", function (d) {
      return isBrushed(selection, X_SCALE(d.Sepal_Width) + MARGINS.left,
        Y_SCALE(d.Petal_Width) + MARGINS.top)
    })

    console.log(isBrushed)

    // var selectedPoints = data.filter(function (d) {
    //   var x = X_SCALE(d.Sepal_Width);
    //   var y = Y_SCALE(d.Petal_Width);
    //   // console.log(selection[0][0], x, selection[1][0]);
    //   // console.log(selection[0][1], y, selection[1][1]);

    //   return (
    //     x >= selection[0][0] &&
    //     x <= selection[1][0] &&
    //     y >= selection[0][1] &&
    //     y <= selection[1][1]
    //   );
    // });
    // Update other visual elements based on selected points
    //updateSelectedPoints(selectedPoints);
  }

  function isBrushed(brush_coords, cx, cy) {
    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }

  // Add linking behavior
  // function updateSelectedPoints(selectedPoints) {
  //   console.log("done")
  //   for (let i = 0; i < selectedPoints.length; i++) {
  //     selectedPoints[i].attr("fill", "red");
  //   }
  //   // selectedPoints.each(function () {
  //   //   d3.select(this).attr("fill", "red");
  //   // });
  // }
});

const FRAME3 = d3
  .select("#col3")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

var data = [
  { species: "setosa", count: 50 },
  { species: "versicolor", count: 50 },
  { species: "virginica", count: 50 },
];

// Define the scales for the x-axis and y-axis
var xScale = d3
  .scaleBand()
  .domain(
    data.map(function (d) {
      return d.species;
    })
  )
  .range([0, VIS_WIDTH])
  .padding(0.1);

var yScale = d3.scaleLinear().domain([0, 60]).range([VIS_HEIGHT, 0]);

// Create the bars
var bars = FRAME3.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")

  .attr("x", function (d) {
    return xScale(d.species) + MARGINS.left;
  })
  .attr("y", function (d) {
    return yScale(50) + MARGINS.top;
  })
  .attr("width", xScale.bandwidth())
  .attr("fill-opacity", 0.5)
  .attr("height", yScale(10))
  .attr("fill", function (d) {
    return colorScale(d.species);
  });

// Create the x-axis and y-axis
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

FRAME3.append("g")
  .attr("class", "x-axis")
  .attr(
    "transform",
    "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")"
  )
  .call(xAxis);

FRAME3.append("g")
  .attr("transform", "translate(" + MARGINS.right + ", " + MARGINS.top + ")")
  .call(d3.axisLeft(yScale).ticks(8))
  .attr("font-size", "13px");

// Draw a circle
var myCircle = d3
  .select("#dataviz_brushChange")
  .append("g")
  .append("circle")
  .attr("cx", 150)
  .attr("cy", 150)
  .attr("r", 40)
  .attr("fill", "#69a3b2");

// // Add brushing
// d3.select(".frame2").call(
//   d3
//     .brush() // Add the brush feature using the d3.brush function
//     .extent([
//       [0, 0],
//       [VIS_WIDTH + MARGINS.left, VIS_HEIGHT + MARGINS.top],
//     ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
//     .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
// );

// // Function that is triggered when brushing is performed
// function updateChart(event) {
//   // Get the selection coordinate
//   selection = event.selection; // looks like [ [12,11], [132,178]]

//   if (selection) {
//     var selectedPoints = data.filter(function (d) {
//       var x = xScale(d.x);
//       var y = yScale(d.y);
//       return (
//         x >= selection[0][0] &&
//         x <= selection[1][0] &&
//         y >= selection[0][1] &&
//         y <= selection[1][1]
//       );
//     });
//     // Update other visual elements based on selected points
//     updateSelectedPoints(selectedPoints);
//   }
// }

// // Add linking behavior
// function updateSelectedPoints(selectedPoints) {
//   FRAME1.attr("fill", function (d) {
//     return selectedPoints.includes(d) ? "red" : "blue";
//   });
// }

// // Is the circle in the selection?
// let isBrushed =
//   extent[0][0] <= myCircle.attr("cx") &&
//   extent[1][0] >= myCircle.attr("cx") && // Check X coordinate
//   extent[0][1] <= myCircle.attr("cy") &&
//   extent[1][1] >= myCircle.attr("cy"); // And Y coordinate

// // Circle is green if in the selection, pink otherwise
// if (isBrushed) {
//   myCircle.transition().duration(200).style("fill", "green");
// } else {
//   myCircle.transition().duration(200).style("fill", "pink");
// }
