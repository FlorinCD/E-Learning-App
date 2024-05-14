
const chart = document.getElementById("chart");
const chart_top = document.getElementById("top-chart");
const chart_top_value = chart_top.innerHTML.slice(0, -1);
const columns = document.getElementsByClassName("column");
var listOfColumns = [];
var previousColumn = null;
var listOfHeights = [10, 20, 30, 45, 60, 80, 100, 120, 140, 160, 170, 175, 180, 178, 172, 164, 150, 136, 120, 102, 84, 62, 42, 28, 10];

function createChart(myChart, myChartTop){
    var counter = 1;

    for(let i=0;i<25;i++){
        const currentColumn = document.createElement("div");
        setTimeout(() => {
            currentColumn.className = "column";
            currentColumn.style.height = listOfHeights[i] + "px";
            myChart.appendChild(currentColumn);
            currentColumn.style.animation = "columnGrow 1.5s ease-out 0s forwards";
            }, 80*counter); 
        counter += 1;
        listOfColumns.push(currentColumn);
        currentColumn.addEventListener("mouseover", function(){
            myChartTop.innerHTML = (100 / 25 * i) + "%" ;
            if(previousColumn){
                previousColumn.style.backgroundColor = "#03B0A8"; // cyan
            }
            currentColumn.style.backgroundColor = "#383030"; // gray
            previousColumn = currentColumn;
        });

        myChart.addEventListener("mouseleave", function(){
            myChartTop.innerHTML = chart_top_value + "%";
            for(const col of columns){
                col.style.backgroundColor = "#03B0A8";
            }
            previousColumn = null;
            let substring = chart_top.innerHTML.slice(0, -1);
            for (let i=0;i<25;i++){
                var currentVal = 100 / 25 * i;
                if(!previousColumn && parseInt(substring)<=currentVal){
                    previousColumn = listOfColumns[i];
                    previousColumn.style.backgroundColor = "#383030"
                };
            }
        });
        }
    var substring = chart_top.innerHTML.slice(0, -1);
    for (let i=0;i<25;i++){
        var currentVal = 100 / 25 * i;
        if(!previousColumn && parseInt(substring)<=currentVal){
            previousColumn = listOfColumns[i];
            previousColumn.style.backgroundColor = "#383030"
        };
    }
    
}

createChart(chart, chart_top);

