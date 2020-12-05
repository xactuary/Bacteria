function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var sampleNames = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = sampleNames.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var firstSample = filterSample[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = firstSample.otu_ids;


    var labels = firstSample.otu_labels;
    
    var values = firstSample.sample_values;

  // create variables for Deliverable 2 which comes from metadata not samples  
 // 1. Create a variable that filters the metadata array for the object with the desired sample number.
var gaugeSamples = data.metadata;

    // Create a variable that holds the first sample in the array.
    var gaugeFilter = gaugeSamples.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstGauge = gaugeFilter[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
   
// 3. Create a variable that holds the washing frequency.
var gaugeFreq = firstGauge.wfreq;

    
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 

    var yticks = ids.map(function(num) {

      return "OTU "+num;
    
    });
    var ylabels = yticks.slice(0,10);

var xvalues = values.slice(0,10);
    
var sortdata=xvalues.sort((a, b) => a - b);

    // Create the trace for the bar chart. 
    var barData = {
      x: xvalues,
      y: ylabels,
      type: "bar",
      orientation: 'h'
    };
    var data = [barData];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title:"Amount of Bacteria" },
      hovermode:'closest'
      
           
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",data,barLayout) ;


    // 1. Create the trace for the bubble chart.
    var bubbleData ={ 
      y: values,
      x: ids,
      text: labels,
      type: "scatter",
      mode: 'markers',
   
      marker: {color:ids,
       size: values,
       colorscale: 'Picnic'
          
      }
     
    };
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Samples per Culture",
      xaxis: {title:"OTU ID" },
      hovermode:'closest',
        
      
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",[bubbleData],bubbleLayout) ;
  
//
//
//  Deliverable 3 starts here
//
// D2: 3. Use Plotly to plot the data with the layout.
   
    
 //   4. Create the trace for the gauge chart.
    var gaugeData = 
      [
        {
            domain: {x:[0,1],y:[0,1]},
            value: gaugeFreq,
            title: {text:"<b>Belly Button Washing Frequency</b><br><i>Scrubs per Week</i>"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                    axis: {range:[null,10]},
                    
                    steps:[
                        {range:[0,2],color:"indigo"},
                        {range:[2,4],color:"turquoise"},
                        {range:[4,6],color:"pink"},
                        {range:[6,8],color:"gold"},
                        {range:[8,10],color:"red"}]
                    

                    }
        
        }
      ];


     
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 500,
     height: 425,

     margin: {t:0,b:0}  

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout)
  });
}
