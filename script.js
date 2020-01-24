
//localStorage.clear();
$(document).ready(function(){
    var APIKey="0e9dd0542fd8e6e868928892a00c9054"
    var cityName;
    var countryCode;
    var lati;
    var long;

    //localStorage.clear();
    $("#one").on("click",function(){
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         do_something(position.coords.latitude, position.coords.longitude);
    // });
        cityName=$(".form-control").val();
       
      
        var obj={'city':cityName};
        var getStorage= JSON.parse(localStorage.getItem('final'));

        var temp=false;
        if(getStorage){
            for(var index=0;index<getStorage.length;index++){
                if(getStorage[index].city===cityName){
                    temp=true;
                    
            }

            }        
            if (temp===false){
                getStorage.push(obj);
            }
        }
        else{
            getStorage=[];
            getStorage.push(obj);
        }
        
        var setStorage=localStorage.setItem('final',JSON.stringify(getStorage));

        $("#history").html("");
        getStorage= JSON.parse(localStorage.getItem('final'));
        $.each(getStorage,function(item,content){

            var display=$("<p>")
            display.attr("id",item);
            display.text(content.city);
            display.attr("style","padding-top:5px;padding-left:10px;border-top: 1px solid rgb(156, 155, 155);");            
            $("#history").append(display);
            
                
        });

    
        //localStorage.clear();

        //var currentURL= "https://api.openweathermap.org/data/2.5/weather?q="+cityName+","+countryCode+"&units=imperial&appid="+APIKey;
        var currentURL= "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;

        //var queryURL="https://api.openweathermap.org/data/2.5/forecast?q="+cityName+","+countryCode+"&units=imperial&appid="+ APIKey;
        var queryURL="https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&units=imperial&appid="+ APIKey;
        //var queryURL="https://api.openweathermap.org/data/2.5/forecast/daily?q="+cityName+","+countryCode+"&units=imperial&cnt=5&appid="+APIKey;


        //var uvUrl="http://api.openweathermap.org/data/2.5/forecast?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        //var uvUrl;

        
        $.ajax({
            url:currentURL,
            method:"GET"
        }).then(function(obj){
            
            lati=obj.coord.lat;
            long=obj.coord.lon;
            showUV();
            //uvUrl="https://api.openweathermap.org/data/2.5/uvi?lat="+lati+"&lon="+long+"&appid="+APIKey; 

            console.log(obj);
            if (obj.weather[0].main==="Clouds"){
                $("#header-image").html("");
                var wea=$("#header-image").addClass("fas fa-cloud");
                
            }
            else if(obj.weather[0].main==="Rain"){
                $("#header-image").html("");
                var wea=$("#header-image").addClass("fas fa-cloud-rain");
                
            }
            else if(obj.weather[0].main==="Clear"){
                var wea=$("<img>").attr("src","01d.png");
                $("img"+j).html("");
                $("#name").append(wea);
            }
            $("#name").text(obj.name+"( "+moment().utc().format("MM/DD/YYYY")+" )");
            $("#temp").text("Temperature: "+ obj.main.temp+" \xB0" + "F");
            $("#humidity").text("Humidity: "+ obj.main.humidity+"%");
            $("#wind").text("Wind Speed: "+ obj.wind.speed+" MPH");
            
        });

               
 

        function showUV(){
            $.ajax({
            
                //url: uvUrl,
                url:"https://api.openweathermap.org/data/2.5/uvi?lat="+lati+"&lon="+long+"&appid="+APIKey,
                method:"GET"
            }).then(function(res){
                $("#uv-button").text(res.value);
            });

        }
        



        $.ajax({
            url: queryURL,
            method: "GET"

        }).then(function(response){
            //debugger;
            var dateStr=[];
            var timeStr=[];
            //console.log(response);
            var firstEle=response.list[0].dt_txt.split(" ");
            //var currentDate=firstEle[0];
            var currentDate=moment().utc().format('MM-DD-YYYY')
            var j=1;
            //console.log(currentDate);
            for(var i=0;i<response.list.length;i++){

                var splitString=response.list[i].dt_txt.split(" ");
                dateStr= splitString[0];
                timeStr=splitString[1];

                
                if(dateStr!=currentDate){
                    //i=i-1;
                    console.log(response.list[i]);
                    var d= dateStr.split('-');
                    newD= d[2]+"/"+d[1]+"/"+d[0];
                    $(".date"+j).text(newD);
                    $(".forecast"+j).text("Temp: "+response.list[i].main.temp);
                    $(".humid"+j).text("Humidity: "+response.list[i].main.humidity+"%");
                    //console.log(response.list[i].weather[0].main);
                    if(response.list[i].weather[0].main==="Clouds"){
                        
                        var cloud=$("<i>").addClass("fas fa-cloud");
                        //$(".img").text(<i class="fas fa-cloud"></i>);
                        $(".img"+j).html("");
                        $(".img"+j).append(cloud);
                    }
                    else if(response.list[i].weather[0].main==="Rain"){
                        
                        var cloud=$("<i>").addClass("fas fa-cloud-rain");
                        //$(".img").text(<i class="fas fa-cloud"></i>);
                        $(".img"+j).html("");
                        $(".img"+j).append(cloud);
                    }
                    else if(response.list[i].weather[0].main==="Snow"){
                        
                        var cloud=$("<i>").addClass("fas fa-snowflake");
                        $(".img"+j).html("");
                        $(".img"+j).append(cloud);
                    }
                    else if(response.list[i].weather[0].main==="Clear"){
                        var cloud=$("<img>").attr("src","01d.png");
                        $(".img"+j).html("");
                        $(".img"+j).append(cloud);
                    }
                    else if(response.list[i].weather[0].main==="Thunderstorm"){
                        //console.log("Clouds")
                        var cloud=$("<img>").attr("src","11d.png");
                        $(".img"+j).html("");
                        
                        $(".img"+j).append(cloud);
                    }

                    j=j+1;

                    i=i+7;
                    
                }
            }
        

        });

    

    });

});//end of document.ready