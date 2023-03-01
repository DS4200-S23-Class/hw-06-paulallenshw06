const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

//Adding color to the points
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

const FRAME2 = d3
  .select("#col2")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame")
  .attr("class", "frame2");

const FRAME3 = d3
  .select("#col3")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

//Bar chart data
const barData = [
  { Species: "setosa", count: 50 },
  { Species: "versicolor", count: 50 },
  { Species: "virginica", count: 50 },
];

d3.csv("data/iris.csv").then((data) => {
  const MAX_X = d3.max(data, (d) => {
    return parseInt(d.Sepal_Length) + 1;
  });

  const MAX_Y = d3.max(data, (d) => {
    return parseInt(d.Petal_Length) + 1;
  });

  const X_SCALE = d3.scaleLinear().domain([0, MAX_X]).range([0, VIS_WIDTH]);
  const Y_SCALE = d3.scaleLinear().domain([0, MAX_Y]).range([VIS_HEIGHT, 0]);

  //Making point selection a variable so we can link by ID later
  const listCircles = FRAME1.selectAll("points")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", (d) => {
      return d.ID;
    })
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

  // Define the scales for the x-axis and y-axis
  const X_SCALE3 = d3
    .scaleBand()
    .domain(
      barData.map(function (d) {
        return d.Species;
      })
    )
    .range([0, VIS_WIDTH])
    .padding(0.1);

  const Y_SCALE3 = d3.scaleLinear().domain([0, 60]).range([VIS_HEIGHT, 0]);

  // Create the bars
  const listBars = FRAME3.selectAll("rect")
    .data(barData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return X_SCALE3(d.Species) + MARGINS.left;
    })
    .attr("y", function (d) {
      return Y_SCALE3(50) + MARGINS.top;
    })
    .attr("width", X_SCALE3.bandwidth())
    .attr("fill-opacity", 0.5)
    .attr("height", Y_SCALE3(10))
    .attr("fill", function (d) {
      return colorScale(d.Species);
    });

  const xAxis = d3.axisBottom(X_SCALE3);

  FRAME3.append("g")
    .attr("class", "x-axis")
    .attr(
      "transform",
      "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")"
    )
    .call(xAxis);

  FRAME3.append("g")
    .attr("transform", "translate(" + MARGINS.right + ", " + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE3).ticks(8))
    .attr("font-size", "13px");

  const MAX_X2 = d3.max(data, (d) => {
    return parseInt(d.Sepal_Width) + 1;
  });

  const MAX_Y2 = d3.max(data, (d) => {
    return parseInt(d.Petal_Width) + 1;
  });

  const X_SCALE2 = d3.scaleLinear().domain([0, MAX_X2]).range([0, VIS_WIDTH]);
  const Y_SCALE2 = d3.scaleLinear().domain([0, MAX_Y2]).range([VIS_HEIGHT, 0]);

  //making point selection for chart 2 into graph so we can link by ID
  const listCircles2 = FRAME2.selectAll("points")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", (d) => {
      return d.ID;
    })
    .attr("cx", (d) => {
      return X_SCALE2(d.Sepal_Width) + MARGINS.left;
    })
    .attr("cy", (d) => {
      return Y_SCALE2(d.Petal_Width) + MARGINS.left;
    })
    .attr("r", 7)
    .attr("opacity", 0.5)
    .attr("class", (d) => {
      return "point " + d.Species;
    })
    .attr("fill", function (d) {
      return colorScale(d.Species);
    });

  FRAME2.append("g")
    .attr(
      "transform",
      "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")"
    )
    .call(d3.axisBottom(X_SCALE2).ticks(11))
    .attr("font-size", "13px");

  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.right + ", " + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE2).ticks(16))
    .attr("font-size", "13px");

  const brush = d3
    .brush()
    .extent([
      [0, 0],
      [VIS_WIDTH + MARGINS.left, VIS_HEIGHT + MARGINS.top],
    ])
    .on("brush", brushFn);

  // Create the brush
  FRAME2.append("g").attr("class", "brush").call(brush);

  // Define the brushing function
  function brushFn(event) {
    // Get the selection coordinate
    const selection = event.selection;

    //give class selected to chart2 points if isBrushed == True
    listCircles2.classed("selected", function (d) {
      return isBrushed(
        selection,
        X_SCALE2(d.Sepal_Width) + MARGINS.left,
        Y_SCALE2(d.Petal_Width) + MARGINS.top
      );
    });

    listCircles.classed("selected", function (d) {
      let idPresent = false;

      for (let i = 0; i < listCircles2._groups[0].length; i++) {
        //comparing on whether IDs of 2 charts are equal and chart2 point IS selected
        if (
          d.ID == listCircles2._groups[0][i].id &&
          listCircles2._groups[0][i].classList.length == 3
        ) {
          idPresent = true;
        }
      }

      return idPresent;
    });

    listBars.classed("selected", function (d) {
      let idPresent = false;

      for (let i = 0; i < listCircles2._groups[0].length; i++) {
        //comparing for equivalent species and chart2 point is selected
        if (
          listCircles2._groups[0][i].classList.contains(d.Species) &&
          listCircles2._groups[0][i].classList.length == 3
        ) {
          idPresent = true;
        }
      }

      return idPresent;
    });
  }

  //is a point within the coordinates?
  function isBrushed(brush_coords, cx, cy) {
    const x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  }
});
