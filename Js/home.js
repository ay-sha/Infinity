// Set up the dimensions and margins of the graph
const margin = { top: 20, right: 40, bottom: 60, left: 40 };

function setupChart() {
    let data = [
        { date: new Date('2023-01-01'), WPPOOL: 2, Google: 7, Microsoft: 10, Twitter: -5 },
        { date: new Date('2023-01-08'), WPPOOL: 7, Google: -2, Microsoft: 40, Twitter: 14 },
        { date: new Date('2023-01-15'), WPPOOL: 7, Google: -2, Microsoft: 30, Twitter: 15 },
        { date: new Date('2023-01-22'), WPPOOL: 2, Google: 8, Microsoft: 45, Twitter: 30 },
        { date: new Date('2023-02-01'), WPPOOL: 5, Google: 20, Microsoft: 30, Twitter: -5 },
        { date: new Date('2023-02-08'), WPPOOL: 13, Google: -2, Microsoft: 40, Twitter: 14 },
        { date: new Date('2023-02-15'), WPPOOL: 7, Google: -2, Microsoft: 30, Twitter: 15 },
        { date: new Date('2023-02-22'), WPPOOL: 15, Google: 8, Microsoft: 45, Twitter: 30 },
        { date: new Date('2023-03-01'), WPPOOL: 30, Google: 12, Microsoft: 20, Twitter: 40 },
        { date: new Date('2023-03-08'), WPPOOL: 25, Google: 17, Microsoft: 35, Twitter: 50 },
        { date: new Date('2023-03-15'), WPPOOL: 40, Google: 25, Microsoft: 50, Twitter: 15 },
        { date: new Date('2023-03-22'), WPPOOL: 20, Google: 30, Microsoft: 55, Twitter: 45 },
        { date: new Date('2023-04-01'), WPPOOL: 10, Google: 45, Microsoft: 30, Twitter: 65 },
        { date: new Date('2023-04-08'), WPPOOL: 15, Google: 55, Microsoft: 75, Twitter: 30 },
        { date: new Date('2023-04-15'), WPPOOL: 80, Google: 45, Microsoft: 60, Twitter: 35 },
        { date: new Date('2023-04-22'), WPPOOL: 72, Google: 60, Microsoft: 85, Twitter: 50 },
        { date: new Date('2023-05-01'), WPPOOL: 50, Google: 85, Microsoft: 80, Twitter: 52 },
        { date: new Date('2023-05-08'), WPPOOL: 35, Google: 80, Microsoft: 95, Twitter: 72 },
        { date: new Date('2023-05-15'), WPPOOL: 65, Google: 60, Microsoft: 70, Twitter: 45 },
        { date: new Date('2023-05-22'), WPPOOL: 85, Google: 75, Microsoft: 60, Twitter: 98 },
        { date: new Date('2023-06-01'), WPPOOL: 70, Google: 85, Microsoft: 65, Twitter: 75 },
        { date: new Date('2023-06-08'), WPPOOL: 91, Google: 60, Microsoft: 75, Twitter: 90 },
        { date: new Date('2023-06-15'), WPPOOL: 61, Google: 95, Microsoft: 70, Twitter: 95 },
        { date: new Date('2023-06-22'), WPPOOL: 55, Google: 85, Microsoft: 65, Twitter: 98 },
        { date: new Date('2023-07-01'), WPPOOL: 65, Google: 98, Microsoft: 65, Twitter: 75 },
        { date: new Date('2023-07-08'), WPPOOL: 75, Google: 55, Microsoft: 75, Twitter: 90 },
        { date: new Date('2023-07-15'), WPPOOL: 80, Google: 95, Microsoft: 80, Twitter: 80 },
        { date: new Date('2023-07-22'), WPPOOL: 97, Google: 90, Microsoft: 75, Twitter: 100 }
    ];

    // Remove existing SVG to prevent appending multiple times
    d3.select("#chart svg").remove();
    d3.select("#legend .legend-box").remove();

    // Get current dimensions of the #chart container
    let chartWidth = parseInt(d3.select("#chart").style("width"), 10);
    let chartHeight = parseInt(d3.select("#chart").style("height"), 10);

    if (chartHeight == 0) {
        chartHeight = 400;
    }

    if (chartWidth < 650) {
        chartHeight = 250;
        chartWidth = 300;
    }


    console.log(chartWidth, chartHeight);

    // Calculate width and height based on container size and margins
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // Append the SVG object to the #chart container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%B")));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([-10, 110]) // Adjust domain to fit your data range
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(13).tickFormat((d, i) => `${d}%`));

    

    // Add gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(12)
            .tickSize(-width)
            .tickFormat(''))
        .selectAll("line")
        .style("stroke", "lightgrey")
        .style("opacity", 0.2);

    // Line generator function
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    // Colors for the lines
    const colors = {
        WPPOOL: "#FC714D",
        Google: "#615DE3",
        Microsoft: "#AFCD80",
        Twitter: "#6F34A1"
    };

    // Tooltip for showing legend table
    const tooltip = d3.select("body").append("div")
        .attr("class", "legend");

    // Add lines and circles for each company
    Object.keys(colors).forEach(company => {
        const companyData = data.map(d => ({
            date: d.date,
            value: d[company],
            company: company
        }));

        svg.append("path")
            .datum(companyData)
            .attr("fill", "none")
            .attr("stroke", colors[company])
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Add circles for each data point
        svg.selectAll(`.dot-${company}`)
            .data(companyData)
            .enter().append("circle")
            .attr("class", `dot-${company}`)
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 5)
            .attr("fill", colors[company])
            .style("cursor", "pointer")
            .style("opacity", 0)
            .style("pointer-events", "all")
            .on("mouseover", function (event, d) {
                tooltip.style("visibility", "visible")
                    .html(`<div class="tooltip-content">
                              <strong>${d3.timeFormat("%B %d, %Y")(d.date)}<br></strong><br>
                              ${Object.keys(colors).map(key => `
                                  <div class="company-info">
                                      <div class="color-box" style="background-color: ${colors[key]}"></div>
                                      ${key}:${data.find(entry => entry.date.getTime() === d.date.getTime())[key]}%
                                  </div>
                              `).join('')}
                           </div>`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
            });
    });

    // Add legend box at the bottom
    const legendBox = d3.select("#legend")
        .append("div")
        .attr("class", "legend-box");

    // Add legend items
    Object.keys(colors).forEach(company => {
        const legendItem = legendBox.append("div")
            .attr("class", "legend-item");

        legendItem.append("div")
            .attr("class", "color-box")
            .style("background-color", colors[company]);

        legendItem.append("span")
            .text(company);
    });

    // Add the center line at 0%
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", width)
        .attr("y2", y(0))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 4");
}

// Initial setup
setupChart();

// Resize event listener
window.addEventListener("resize", () => {
    // Clear existing chart
    d3.select("#chart svg").remove();
    // Setup chart again
    setupChart();
});
