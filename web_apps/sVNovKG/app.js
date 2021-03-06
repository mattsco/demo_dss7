var animDuration = 1000;

//http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExecSparklineData(min,max){
  var returnArray=[];
  var datePointer = new Date();
  var i=0;
  //off by 1 error here, not sure why
  datePointer = new Date(datePointer.setDate(datePointer.getDate()+1));
  while(i<30){
  
    returnArray.push({
      date:datePointer,
      value:getRandomInt(min,max)
    });

    datePointer = new Date(datePointer.setDate(datePointer.getDate()-1));
    i++;
  }
  return returnArray;
}

//http://www.tnoda.com/blog/2013-12-19
function sparkline(elemId, data) {

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function prettyPrint(id,value){
    value = numberWithCommas(value);
    if (id.indexOf("cost") > -1){
      return "$"+value;
    }
    else{
      return value;
    }
  }

  data.forEach(function(d){
    d.date = new Date(d.date);
  })

  function getSummation(){
    var sum = 0;
    for(var i=0; i<data.length; i++){
      sum = sum+data[i].value;
    }
    return sum;
  }

  function clickEventHandler(){
    var element = document.getElementById(elemId.replace("#",""));
    var isFlipped = element.getAttribute("data-flipped");
    console.log(element);
      if(!(elemId.indexOf("avgRating") > -1)){

        if(isFlipped === "false"){
          d3.select("#"+"current-path-"+elemId.replace("#","")).transition().duration(animDuration/1.5).style("opacity",0)
          d3.select("#this-spark-circle-"+elemId.replace("#","")).transition().duration(animDuration/1.5).style("opacity",0);
          d3.select("#text-value-"+elemId.replace("#","")).transition().duration(animDuration/1.5).style("opacity",0);

          d3.select(elemId+"-flip-number").transition().delay(animDuration/2).duration(animDuration/2).style("opacity",1);
          d3.select(elemId+"-flip-number-label").transition().delay(animDuration/2).duration(animDuration/2).style("opacity",1);
          d3.select(elemId).attr("data-flipped",true);
        }

        else{
          d3.select("#"+"current-path-"+elemId.replace("#","")).transition().delay(animDuration/1.5).duration(animDuration/2).style("opacity",1)
          d3.select("#this-spark-circle-"+elemId.replace("#","")).transition().delay(animDuration/1.5).duration(animDuration/2).style("opacity",1);
          d3.select("#text-value-"+elemId.replace("#","")).transition().delay(animDuration/1.5).duration(animDuration/2).style("opacity",1);

          d3.select(elemId+"-flip-number").transition().duration(animDuration/1.5).style("opacity",0);
          d3.select(elemId+"-flip-number-label").transition().duration(animDuration/1.5).style("opacity",0);
          d3.select(elemId).attr("data-flipped",false);
        }
      }
  }
  //leave room for the text value to the right
  var width = $(elemId).width()-20;
  var height = $(elemId).height();
  var x = d3.scale.linear().range([width-10, 0]);
  var y = d3.scale.linear().range([height-10, 0]);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.value; }));
  
  var line = d3.svg.line()
               .interpolate("basis")
               .x(function(d) { return x(d.date); })
               .y(function(d) { return y(d.value); });

  var svg = d3.select(elemId)
              .append('svg')
              .attr('width', width)
              .attr("class","sparkline-wrapper-svg")
              .attr('height', height)
              .append('g')
              .attr('transform', 'translate(0, 2)');

  svg.append('path')
     .datum(data)
     .attr('class', 'sparkline')
     .attr("id","current-path-"+elemId.replace("#",""))
     .attr('d', line);

  svg.append('circle')
     .attr('class', 'sparkcircle')
     .attr("id","this-spark-circle-"+elemId.replace("#",""))
     .attr('cx', x(data[data.length-1].date))
     .attr('cy', y(data[data.length-1].value))
     .style("opacity",0)
     .attr('r', 2);  

  var totalLength = d3.select("#current-path-"+elemId.replace("#","")).node().getTotalLength();

  d3.select("#current-path-"+elemId.replace("#",""))
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(animDuration)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

  d3.select(elemId).append("text")
    .attr("class","text-value")
    .style("opacity","0")
    .attr("id","text-value-"+elemId.replace("#",""))
    .text(prettyPrint(elemId,data[data.length-1].value));

    d3.select("#this-spark-circle-"+elemId.replace("#","")).transition().delay(animDuration).duration(animDuration/1.5).style("opacity",1);
    d3.select("#text-value-"+elemId.replace("#","")).transition().delay(animDuration).duration(animDuration/1.5).style("opacity",1);

  d3.select(elemId).append("text")
    .attr("class","flip-descriptor-tag")
    .attr("id",elemId.replace("#","")+"-flip-number-label")
    .style("opacity","0")
    .text("Total:")
      .append("text")
      .attr("class","text-flip-number")
      .attr("id",elemId.replace("#","")+"-flip-number")
      .style("opacity","0")
      .text(prettyPrint(elemId,getSummation()));

 // d3.select(elemId)
   // .attr("data-flipped",false)
    //.on("click",clickEventHandler);

}

$( document ).ready(function() {




var firstCol = "Account";

$.getJSON(getWebAppBackendUrl('/init'), function(data) {
    console.log('Received data from backend', data)
    
      var d = data["data"];
       
    //for (var i = 0; i<d.length; i++){
        for (var j = 0; j<d.length; j++){
        var i = j.valueOf();
        
        console.log(i);
        d3.select("#tableAccount").append("tr")
                                  .attr("id", "tr_"+i);
    
        d3.select("#tr_"+i).append("th")
                          .attr("scope","row")
                          .text(i);
         
        d3.select("#tr_"+i).append("td")
                          .attr("class",firstCol)
                          .text(d[i][firstCol]);
    
        d3.select("#tr_"+i).append("td")
                          .attr("width","200px")
                          .style("padding-right", "50px")
                          .attr("id","sparkline_"+i);
            
        sparkline('#sparkline_'+i, d[i]["spark"]);
    
        d3.select("#tr_"+i).append("td")
                          .attr("id","feedback_good_"+i)
                          .attr("width","5px")
                          .html('<i class="icon-thumbs-up-alt" id="thumbs-up-'+i+'"></i>');
    
        d3.select("#thumbs-up-"+i).on("click", function(){
            console.log("thumbs-up");
            var n = this.id.split("-");
            d3.select("#text-value-sparkline_"+n[n.length-1]).attr("style","color: green;")
        });
    
        d3.select("#tr_"+i).append("td")
                          .attr("id","feedback_bad_"+i)
                          .attr("width","5px")
                          .html('<i class="icon-thumbs-down-alt" id="thumbs-down-'+i+'"></i>');
    
        d3.select("#thumbs-down-"+i).on("click", function(){
            console.log("thumbs-down");
            var n = this.id.split("-");
            d3.select("#input-"+n[n.length-1]).style("visibility","visible");
        });
    
    var list_button = data["col_choice"];
    for (var c = 0; c<list_button.length; c++){
        var col_id = list_button[c]+"-"+i;
        d3.select("#tr_"+i).append("td")
                           .attr("id","td-"+col_id)
                           .html('<button type="button" class="btn btn-default btn-sm" id="button-'+col_id+'" >'+d[i][list_button[c]]+'</button>');
        
     d3.select("#button-"+col_id).on("click", function(){
            var n = this.id.split("-");
            d3.select("#text-value-sparkline_"+n[n.length-1]).text(this.textContent);
        });
        
    }
        
            
        d3.select("#tr_"+i).append("td")
                          .attr("id","input-"+i)
                          .style("visibility", "hidden")
                          .html('<div class="input-group" id="form-'+i+'" ">\
            <input type="text" class="form-control" placeholder="New value..." id="val-'+i+'">\
            <span class="input-group-btn">\
            <button type="button" class="btn btn-default" id="submit-'+i+'" >Submit</button>\
            </span></div>');

   
        d3.select("#submit-"+i).on("click", function(){
            var n = this.id.split("-");
            var newVal = d3.select("#val-"+n[n.length-1]).property("value");
            d3.select("#text-value-sparkline_"+n[n.length-1]).text(newVal); 
            d3.select("#input-"+n[n.length-1]).style("visibility","hidden");
        });
        
    }
    

                         
    
 // const output = $('<pre />').text('Backend reply: ' + JSON.stringify(data));
 //  $('body').append(output)->>
});

});


d3.select("#save-button").on("click", function(){
    console.log("save");
    var all_values = [];
    var spark_vals = d3.selectAll(".text-value")[0];
    var account_vals = d3.selectAll(".Account")[0];
    
    for (var i = 0; i<spark_vals.length; i++){
        all_values.push([account_vals[i].textContent, spark_vals[i].textContent]);
    }
    console.log(all_values);
    
$.post(getWebAppBackendUrl('save'),JSON.stringify({'param': all_values}),function(data){ 
    console.log('houdy rocks!');
    d3.select("#save-button").html("saved!");

})
    
});



 
