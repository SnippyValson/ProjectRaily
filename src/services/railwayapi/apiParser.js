'use strict';
var config = require('../../configs');
var stationHere = require('../../stations');
var request = require('./request/index.js');

/**
 *The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */


var apiKey=config.getAPIKey();
var i=0,j=0,flag=0,tim_out=10000;
/**
 * This function will return the train status as a string.
 * Sample output : Train departed from KARUKKUTTY(KUC) and late by 24 minutes.
 */
exports.getJsonLiveStatus= function getJsonLiveStatus(train_no,doj,eventCallback){
    var status= "";
    var result="";
    var result1="";
    var t= config.getCorrectedTrainNo(train_no);
    if(t==-1)
      {
            result=train_no+" is not a valid train number";
            status="<say-as interpret-as='digits'>"+train_no+"</say-as> is not a valid train number";
            result1={speech:status,status:result,heading:null};
            eventCallback(result1);
            return;
      }  
    else
            train_no=t;   
    var url =config.getBaseUrl()+"live/train/"+train_no+"/doj/"+doj+"/apikey/"+apiKey+"/";
    console.log(url);
    request(url,{timeout: tim_out}, function (error, response, body) {
       if(error)
          {
               
              if(error.code === 'ETIMEDOUT')
                {
                       if(error.connect === true)
                          {     
                                status="<p>Railway server is slow</p> <p>Do you want to try again</p>";
                                var ne=-1;
                                result={speech:status,status:status,heading:ne};
                                eventCallback(result);
                                return;
                          }
                }
              console.log("Got error: ", error);
              status= "<p>Sorry, we could not process your request</p>";
              result= "Sorry, we could not process your request\n";
              result1={speech:status,status:result,heading:null};
              eventCallback(result1);
              return;
          }

       var stringResult = JSON.parse(body);     
       var stat=stringResult.position;
       stat=stat.replace("Train ","");
       stat=stat.replace(" JN"," JUNCTION");
       stat=stat.replace(" CANT"," CANTONMENT");
       stat=stat.replace(" CNTL"," CENTRAL");
       if(stat.indexOf("late by -")>-1)
          stat=stat.replace("late by -","is early by ");
       status="Train <say-as interpret-as='digits'>"+train_no+"</say-as> "+stat;
       if (stringResult.response_code=='403')
           {  
                  status="<p>Please try again</p>";
                  result1=null;
                  result={speech:status,status:result1,heading:null};
                  if(flag==1)
                    eventCallback(result);
                  if(flag<1)
                     {
                         flag++;
                         getJsonLiveStatus(train_no,doj,eventCallback);
                         
                     }
           }       
       else
          {
               if(stringResult.response_code!='200')
                    status="<p>There was an error processing your request</p>";
               if(status=='-')
                  {
                       status="<p>Sorry,</p> <p>The train details are not available for today</p>";
                  }
               status=status.replace(/ *\([^)]*\) */g, " ");
               status="<audio src='https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3' />"+status;
               result={speech:status,status:stringResult.position,heading:'Train Number: '+train_no};
               eventCallback(result);
          }
     });
    
   return status;
};



/**
 * This function will return the stations in a route as an object.
 */
exports.getJsonTrainRoute=function getJsonTrainRoute(train_no,eventCallback){
    var station_string="";
    var speech_station_string="";
    var result="";
    var status="";
    var result1="";
    var t= config.getCorrectedTrainNo(train_no);
    if(t==-1)
      {
            result=train_no+" is not a valid train number";
            status="<say-as interpret-as='digits'>"+train_no+"</say-as><p> is not a valid train number</p>";
            result1={speech:status,status:result,heading:null};
            eventCallback(result1);
            return;
      }  
    else
            train_no=t;   
    var url =config.getBaseUrl()+'route/train/'+train_no+'/apikey/'+ apiKey+'/';
    console.log(url);
    request(url,{timeout: tim_out}, function (error, response, body) {
       if(error)
          {
               
              if(error.code === 'ETIMEDOUT')
                {
                       if(error.connect === true)
                          {     
                                status="<p>Railway server is slow</p> <p>Do you want to try again</p>";
                                var ne=-1;
                                result={speech:status,status:status,heading:ne};
                                eventCallback(result);
                                return;
                          }
                }
              status= "Sorry, we could not process your request.";
              result={speech:status,status:status,heading:null};
              eventCallback(result);
              return; 
         }
       var stringResult = JSON.parse(body);
       if (stringResult.response_code=='403')
           {  
                  status="<p>Please try again</p>";
                  result1=null;
                  result={speech:status,status:result1,heading:null};
                  if(flag==1)
                    eventCallback(result);
                  if(flag<1)
                     {
                         flag++;
                         getJsonTrainRoute(train_no,eventCallback);
                         
                     }
           }       
        else 
          {
               var station_names=[];
               var station_arrival=[];
               var station_dep=[];
               var day=[];
               for (i=0; i<stringResult.route.length; i++){
                     station_names[i]=stringResult.route[i].fullname.replace(" JN"," JUNCTION");
                     station_names[i]=station_names[i].replace(" CANT"," CANTONMENT");
                     station_arrival[i]=stringResult.route[i].scharr;
                     station_dep[i]=stringResult.route[i].schdep;
                     day[i]=stringResult.route[i].day;
                 }
               var m=0;
               var update=Math.ceil(((stringResult.route.length-2)/5));
               var source_=station_names[0];
               var dest_=station_names[i-1];
               station_string=station_string+"The train starts from "+source_+" at "+station_dep[0]+" and arrives  "+dest_+" at "+station_arrival[i-1]+" on day "+day[i-1]+" passing through ";
               for (j=1; j<i-1; j=j+update){
                     m=j+1;
                     if((j+update)<(i-1))
                           station_string=station_string+station_names[j]+",";
                     else
                           station_string=station_string+" and "+station_names[j]+".";
                  }
               if(stringResult.response_code!='200')
                     station_string="There was an error processing your request.";
                else
                    speech_station_string="<audio src='https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3' /><p>Route of Train Number: <say-as interpret-as='digits'>"+train_no+"</say-as></p> "+station_string;
               result={speech:speech_station_string,status:station_string,heading:"Route of Train Number: "+train_no};
               eventCallback(result);
           }    
     });
 return status;
};

/**
 * This function will return the number of seats availabile in a train as an object.
 *
*/
exports.getJsonSeatAvailability = function getJsonSeatAvailability(train_no, source, dest, date, _class, quota,eventCallback){
    var date_=new Date(date);
    var dd=date_.getDate();
    var mm=date_.getMonth()+1;
    var yy=date_.getFullYear();
    date=dd+"-"+mm+"-"+yy;
    var result="";
    var status="";
    var speech_status="";
    var result1="";
    var t= config.getCorrectedTrainNo(train_no);
    if(t==-1)
      {
            result=train_no+"is not a valid train number";
            status="<say-as interpret-as='digits'>"+train_no+"</say-as><p> is not a valid train number</p>";
            result1={speech:status,status:result,heading:null};
            eventCallback(result1);
            return;
      }  
    else
            train_no=t;   
    console.log(train_no);
    var url =config.getBaseUrl() +'check_seat/train/'+train_no+'/source/'+ source +'/dest/'+dest+'/date/'+ date+'/class/'+_class+'/quota/'+quota+'/apikey/'+ apiKey+'/';
    console.log(url);
    status = "";
    console.log(tim_out);
    request(url,{timeout: tim_out}, function (error, response, body) {
       if(error)
          {  
              if(error.code === 'ETIMEDOUT')
                {
                       if(error.connect === true)
                          {     
                                status="<p>Railway server is slow</p> <p>Do you want to try again</p>";
                                var ne=-1;
                                result={speech:status,status:status,heading:ne};
                                eventCallback(result);
                                return;
                          }
                }
              status= "<p>Sorry! Railway server is slow</p>";
              result={speech:status,status:status,heading:null};
              eventCallback(result);
              return;
          }  
        
       var stringResult = JSON.parse(body);
       if (stringResult.response_code=='403')
           {  
                  status="<p>Please try again</p>";
                  result1=null;
                  result={speech:status,status:result1,heading:null};
                  if(flag==1)
                    eventCallback(result);
                  if(flag<1)
                     {
                         flag++;
                         getJsonSeatAvailability(train_no, source, dest, date, _class, quota,eventCallback);
                         
                     }
           }       
       else
          {
                var index3=0;
                var index4=0;
                var status;
                if(stringResult.availability[0]==undefined)
                {
                  status= "<p>Sorry! Railway server is slow</p> ";
                  result={speech:status,status:status,heading:null};
                  eventCallback(result);  
                  return status;
                }
                status=stringResult.availability[0].status;
                var class_name=stringResult.class.class_name;
                var quota_name=stringResult.quota.quota_name;
                console.log(status);
              var train_name=stationHere.fillStationCodesTrainName(stringResult.train_name);
              var head="On "+date+" <p>Seat availability of  train "+train_name+" </p>";
                if(status.indexOf('RAC')>-1)
                   {
                         index3=status.indexOf("/RAC");
                         var rac=status.substring(index3+4);
                         status=rac+" seats are in RAC for "+class_name+","+quota_name;
                         status+=" . RAC means Reservation against Cancellation";
                   }

                if(status.indexOf('AVAILABLE')>-1)
                   {
                        var index_=status.indexOf('AVAILABLE');
                        var available=status.substring(index_+10);
                        status=available+" seats are available in "+class_name+","+quota_name;
                   } 
                if(status.charAt(0)=='G'&&status.charAt(1)=='N'&&status.charAt(2)=='W')
                   {
                        index3=status.indexOf("/WL");
                        index4=status.indexOf("\n",index3);
                        var waiting=status.substring(index3+3,index3+8);
                        status=waiting+" seats are in waiting list for "+class_name+","+quota_name;
                   }
                if(status.charAt(0)=='R'&&status.charAt(1)=='S'&&status.charAt(2)=='W')
                   {
                        index3=status.indexOf("/WL");
                        index4=status.indexOf("\n",index3);
                        var rswl=status.substring(index3+3,index3+8);
                        status=rswl+" seats are in RSWL for "+class_name+","+quota_name;
                   }
                if(stringResult.response_code!='200')
                     status="There was an error processing your request.";
                else if(stringResult.response_code=='204')
                     status="Invalid class quota combination";
                else
                    speech_status="<audio src='https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3' />"+head+status;
                 
                result={speech:speech_status,status:"On "+date+"\n"+status,heading:"Seat availability of Train: "+train_no+" "+train_name};
                eventCallback(result);       
         }
    });
  return status;
};



/**
 * This function will return the train numbers of trains between stations as an object.*
 */
exports.getJsonTrainBtw =function getJsonTrainBtw(source, dest, date, eventCallback){
         var mon= date.substring(5,7);
         var day= date.substring(8);
         var year=date.substring(0,4);
         var originalDate=date;
         date=day+"-"+mon;
         var indianDate=day+"-"+mon+"-"+year;
         var url=config.getBaseUrl()+"between/source/"+source+"/dest/"+dest+"/date/"+date+"/apikey/"+apiKey+"/";
         console.log(url);
         var stat="";
         var status="";
         var train_string="";
         var result="";
         var result1="";
         request(url,{timeout: tim_out}, function (error, response, body) {
         if(error)
            {
                   
              if(error.code === 'ETIMEDOUT')
                {
                       if(error.connect === true)
                          {     
                                status="<p>Railway server is slow</p> <p>Do you want to try again</p>";
                                var ne=-1;
                                result={speech:status,status:status,heading:ne};
                                eventCallback(result);
                                return;
                          }
                }
                  stat= "Sorry, we could not process your request.";
                  result={speech:stat,status:stat,heading:null};
                  eventCallback(result);
                  return;
            }  
        
         var stringResult = JSON.parse(body);
         if (stringResult.response_code=='403')
            {  
                  stat="<p>Please try again</p>";
                  result1=null;
                  result={speech:stat,status:result1,heading:null};
                  if(flag==1)
                    eventCallback(result);
                  if(flag<1)
                     {
                         flag++;
                         getJsonTrainBtw(source, dest, date, eventCallback);
                         
                     }
            } 
         else
            {      
                   var train_no=[];
                   var src_departure_time=[];
                   var dest_arrival_time=[];
                   var train_name=[];
                   var days=[];
                   var trains_remaining="";
                   var index=0;
                   for(i=0; i<stringResult["train"].length; i++){
                        train_name[i]=stringResult["train"][i].name.replace(" EXPRESS"," ###");
                         train_name[i]=stringResult["train"][i].name.replace(" EXP"," EXPRESS");
                         train_name[i]=stringResult["train"][i].name.replace(" ###"," EXPRESS");
                         train_name[i]=train_name[i].replace(" SP"," SPECIAL");
                         train_name[i]=train_name[i].replace(" SHTBDI"," SHATABDI");
                        days[i]="";
                        train_no[i]=stringResult["train"][i].number;
                        src_departure_time[i]=stringResult["train"][i].src_departure_time;
                        dest_arrival_time[i]=stringResult["train"][i].dest_arrival_time;
                        for  (j=0; j<stringResult["train"][i]["days"].length; j++){
                              if(stringResult["train"][i]["days"][j].runs==="Y")
                                 { 
                                        switch(j){
                                              case 0: days[i]=days[i]+"monday, ";
                                                      break;
                                              case 1: days[i]=days[i]+"tuesday, ";
                                                      break;
                                              case 2: days[i]=days[i]+"wednesday, ";
                                                      break;
                                              case 3: days[i]=days[i]+"thursday, ";
                                                      break;
                                              case 4: days[i]=days[i]+"friday, ";
                                                      break;
                                              case 5: days[i]=days[i]+"saturday, ";
                                                      break;
                                              case 6: days[i]=days[i]+"sunday, ";
                                                      break; 
                                           }
                                 }
                           }
                    }      
                 stat= stat+ "On "+originalDate;        
                 stat= stat+ " there are a total "+i+" trains from "+stationHere.getStationName(source)+" to "+stationHere.getStationName(dest);
                 train_string="Date: "+indianDate+"\n Total "+i+" trains\n";
                 var m=0;
                 for (j=0; j<i; j++){
                      m=j+1;
                      if(m<=3)
                         {
                                stat = stat + "<p>Train <say-as interpret-as='digits'>"+train_no[j]+ '</say-as> </p>';
                                stat=stat+" "+stationHere.fillStationCodesTrainName(train_name[j])+" ";
                                stat = stat+"<p> Source departure time : <say-as interpret-as='time'>"+src_departure_time[j]+"</say-as></p>,<p> Destination arrival time "+dest_arrival_time[j]+"</p>";
                         }
                         else
                      {

                          trains_remaining = trains_remaining + "<p>Train <say-as interpret-as='digits'>"+train_no[j]+ '</say-as> </p>';
                          trains_remaining=trains_remaining+" "+stationHere.fillStationCodesTrainName(train_name[j])+" ";
                          trains_remaining = trains_remaining+"<p> Source departure time : <say-as interpret-as='time'>"+src_departure_time[j]+"</say-as></p>,<p> Destination arrival time "+dest_arrival_time[j]+"</p>";

                      }
                      train_string = train_string + "Train "+train_no[j]+ '\n';
                      train_string =train_string+"Train name :"+stationHere.fillStationCodesTrainName(train_name[j])+" \nSource departure time :"+src_departure_time[j]+"\n Destination arrival time "+dest_arrival_time[j]+"\n Days of run "+days[j]+"\n";

                   }
                
                if(stringResult.response_code!='200'){
                       train_string="There was an error processing your request.";
                       stat=train_string;
                   }
                else   
                    stat=stat+ "<p>For further details on these trains and details of all other trains see the result card</p>";
                stat="<audio src='https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3' />"+stat;
                result={speech:stat,status:train_string,remaining:trains_remaining,heading:"Trains running between "+stationHere.getStationName(source)+" and "+stationHere.getStationName(dest)};
                eventCallback(result);  
         }
    });
   return stat;
};

/*
 * This function will return the current status of a PNR number as an object.
 */
exports.getJsonPNRstatus=function getJsonPNRstatus(pnr_no, eventCallback){
    var result="";
    var stat="";
    var result1="";
    var train_name="Hi";
    var status="";
     if(pnr_no.toString().length!=10)
      {
            result="Not a valid PNR number";
            stat="<say-as interpret-as='digits'>"+pnr_no+"</say-as> is not a valid PNR number";
            var result1={speech:stat,status:result,heading:null};
            eventCallback(result1);
            return;
     }     
     var url =config.getBaseUrl() +'pnr_status/pnr/'+pnr_no+'/apikey/'+ apiKey+'/';
     console.log(url);
     request(url,{timeout: tim_out},function (error, response, body) {
         if(error)
            {
                   
              if(error.code === 'ETIMEDOUT')
                {
                       if(error.connect === true)
                          {     
                                status="<p>Railway server is slow</p> <p>Do you want to try again</p>";
                                var ne=-1;
                                result={speech:status,status:status,heading:ne};
                                eventCallback(result);
                                return;
                          }
                }
                  stat= "Sorry, we could not process your request.";
                  result={speech:stat,status:stat,heading:null};
                  eventCallback(result);
                  return;
            }  
         var train_no;
         var doj="";
         var Class="";
         var chart_prepared="";
         var total_passengers;
         var booking_status=[];
         var current_status=[];
         var stringResult = JSON.parse(body);
         if (stringResult.response_code=='403')
            {  
                  stat="<p>Please try again</p>";
                  result1=null;
                  result={speech:stat,status:result1,heading:null};
                  if(flag==1)
                    eventCallback(result);
                  if(flag<1)
                     {
                         flag++;
                         getJsonPNRstatus(pnr_no, eventCallback);
                         
                     }
            } 
         else
            {
                  var c="";
                  train_no= stringResult.train_no;
                  doj= stringResult.doj;
                  Class= stringResult.class;
                  chart_prepared= stringResult.chart_prepared; 
                  total_passengers= stringResult.total_passengers; 
                  result= result+"Starting date is "+doj+"\n Class is "+Class+"\n Chart prepared "+chart_prepared+"\n Total number of passengers "+total_passengers+"\n Details of each passengers\n";
                    
                  for ( i=0; i<stringResult["passengers"].length; i++){
                           booking_status[i]=stringResult["passengers"][i].booking_status;
                           current_status[i]=stringResult["passengers"][i].current_status;
                                               
                     } 
                  var m=0;
                  for (j=0; j<i; j++){
                        m=j+1;
                        result = result + "passenger "+m+ '\n';
                        result=result+" Booking status "+booking_status[j]+"\n Current status "+current_status[j]+"\n";
                        if(current_status[j].toUpperCase()==="CAN/MOD")
                              current_status[j]="cancelled or modified.";
                        if(current_status[j].indexOf("W/L")>-1)
                            { 
                                  current_status[j]=current_status[j].substring(4)+"th on waiting list"; 
                            }
                        if((current_status[j].toUpperCase()==="CNF"))
                            { 
                                  current_status[j]="confirmed, Coach/Berth number will be available after chart preparation."; 
                            }
                        if(current_status[j].toUpperCase()==="CONFIRMED")
                            { 
                                  current_status[j]="confirmed, Coach/Berth number will be available after chart preparation."; 
                            }      
                        else if(chart_prepared.toUpperCase()==="Y"){
                              c=current_status[j];
                              current_status[j]= "confirmed, coach and berth position is "+ c+".";
                          }
                     
                        stat=stat+" passenger "+m+", current status is "+current_status[j]+".";
                   }

                stat=stat+" For further details see the result card.";
                if(stringResult.response_code=='410'){
                        result="PNR does not exist.";
                        stat=result;
                    }
                else{
                    stat="<audio src='https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3' />"+stat;
                }

                 var result1={speech:stat,status:result,heading:"PNR status of: "+pnr_no};
                 eventCallback(result1);          
          }
    });
   return stat;
};

exports.getJsonTrainArrivals=function getJsonTrainArrivals(station_code,hrs, eventCallback){
    var result="";
    var status="";
    var stat;
    var result1="";
    var remaining="";
    if (hrs==undefined)
      hrs=2;
    status+="<audio src='https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3' />";
    status+="Within "+hrs+" hours at "+stationHere.getStationName(station_code)+", the following trains will arrive";
    var url =config.getBaseUrl() +'arrivals/station/'+station_code+'/hours/'+hrs+'/apikey/'+ apiKey+'/';
console.log(url);
    request(url,{timeout: tim_out}, function (error, response, body) {
         if(error)
            {
                   
              if(error.code === 'ETIMEDOUT')
                {
                       if(error.connect === true)
                          {     
                                status="<p>Railway server is slow</p> <p>Do you want to try again</p>";
                                var ne=-1;
                                result={speech:status,status:status,heading:ne};
                                eventCallback(result);
                                return;
                          }
                }
                  stat= "Sorry, we could not process your request.";
                  result1={speech:stat,status:stat,heading:null,remaining:""};
                  eventCallback(result1);
                  return;
            }  
         var train_no=[];
         var actdep=[];
         var delaydep=[];
         var scharr=[];
         var delayarr=[];
         var schdep =[];
         var train_name=[];
         var stringResult = JSON.parse(body);
         if (stringResult.response_code=='403')
            {  
                  stat="<p>Please try again</p>";
                  result1=null;
                  result={speech:stat,status:result1,heading:null,remaining:""};
                  if(flag==1)
                    eventCallback(result);
                  if(flag<1)
                     {
                         flag++;
                         getJsonTrainArrivals(station_code,hrs, eventCallback);
                         
                     }
            } 
         else
            {
              console.log('Reached else');
                  for (i=0; i<stringResult["train"].length; i++){
                         train_no[i]=stringResult["train"][i].number;
			 train_name[i]=stringResult["train"][i].name;
                         scharr[i]=stringResult["train"][i].scharr;
                         delayarr[i]=stringResult["train"][i].delayarr;
                         delayarr[i]=convertTime(delayarr[i]);
                         schdep[i]=stringResult["train"][i].schdep;
                         actdep[i]=stringResult["train"][i].actdep;
                         delaydep[i]=stringResult["train"][i].delaydep;
                         delaydep[i]=convertTime(delaydep[i]);
                         if(scharr[i].toUpperCase()=="RT")
                               scharr[i]="Right time";
                         if(scharr[i].toUpperCase()=="SRC")
                               scharr[i]="Source";
                         if(delayarr[i].toUpperCase()=="RT")
                               delayarr[i]="Right time";
                         if(delayarr[i].toUpperCase()=="SRC")
                               delayarr[i]="Source";
                         if(schdep[i].toUpperCase()=="RT")
                               schdep[i]="Right time";
                         if(schdep[i].toUpperCase()=="DSTN")
                               schdep[i]="Destination";
                         if(actdep[i].toUpperCase()=="RT")
                               actdep[i]="Right time";
                         if(actdep[i].toUpperCase()=="DSTN")
                               actdep[i]="Destination";
                         if(delaydep[i].toUpperCase()=="RT")
                               delaydep[i]="Right time";
                         if(delaydep[i].toUpperCase()=="DSTN")
                               delaydep[i]="Destination";
                     }
                 var m=0;
                 for ( j=0; j<i; j++){
                       m=j+1;
                       result = result + "Train "+train_no[j]+ '\n';
                       if(j<4)
                          {
                            status = status + "<p>Train <say-as interpret-as='digits'>"+train_no[j]+ '</say-as> </p>';
                            status=status+" "+stationHere.fillStationCodesTrainName(train_name[j])+" ";
                            status=status+" <p>Scheduled arrival "+scharr[j]+"</p>";
                            if(delayarr[j]=="Right time")
                                status+=" <p>Train arrived at right time</p> ";
                            else
                                status=status+",<p> Delayed arrival *"+delayarr[j]+"*</p>, ";
                            if((actdep[j]=="Right time")&&(delaydep[j]=="Right time"))
                                status+="<p>Scheduled departure "+schdep[j]+"</p>";
                            else
                                status+="<p>Scheduled departure "+schdep[j]+"</p>,<p> actual departure "+actdep[j]+"</p>";
                            if(delaydep[j]=="Right time")
                                status+=" <p>Train departure on right time</p> ";
                            else
                                status=status+",<p> Delayed departure *"+delaydep[j]+"*</p>, ";
                          }
                     
                     if(m>4)
                        {
                          console.log('reach'+m);
                              remaining = remaining + "<p>Train <say-as interpret-as='digits'>"+train_no[j]+ '</say-as> </p>';
                              remaining=remaining+" "+stationHere.fillStationCodesTrainName(train_name[j])+" ";
                              remaining=remaining+" <p>Scheduled arrival "+scharr[j]+"</p>";
                              if(delayarr[j]=="Right time")
                                   remaining+=" <p>Train arrived at right time</p> ";
                              else
                                   remaining=remaining+",<p> Delayed arrival *"+delayarr[j]+"*</p>, ";
                              if((actdep[j]=="Right time")&&(delaydep[j]=="Right time"))
                                   remaining+="<p>Scheduled departure "+schdep[j]+"</p>";
                              else
                                   remaining+="<p>Scheduled departure "+schdep[j]+"</p>,<p> actual departure "+actdep[j]+"</p>";
                              if(delaydep[j]=="Right time")
                                   remaining+=" <p>Train departure on right time</p> ";
                              else
                                   remaining=remaining+",<p> Delayed departure *"+delaydep[j]+"*</p>, ";
                        }

                     //optimising for card
                     if(delayarr[j]=="Right time")
                         delayarr[j]="Train arrived on right time.\n";
                     if(delaydep[j]=="Right time")
                         delaydep[j]="Train departure on right time.\n";
                     result=result+" "+stationHere.fillStationCodesTrainName(train_name[j])+" ";
                     result=result+"\n Scheduled arrival "+scharr[j]+"\n Delayed arrival "+delayarr[j]+"\n Scheduled departure "+schdep[j]+"\n actual departure "+actdep[j]+"\n delayed departure "+delaydep[j]+"\n";
                   }
                if(i<4)
                       remaining="";
                if(stringResult.response_code!='200'){
                       result="There was an error processing your request.";
                       status=result;
                       remaining="";
                  }
                else
                {
                    status=status+ "<p>For details of other trains see the result card</p>";
                }
                var result1={speech:status,status:result,heading:"Train arrivals at station: "+stationHere.getStationName(station_code)+" ("+station_code+")",remaining:remaining};
                eventCallback(result1);    
          }
    });
   return status;
};

function convertTime(time)
{
    if(time.indexOf(":")>-1)
    {
        var time_digits = time.split(":");
        var output = time_digits[0] + " hours and " + time_digits[1] + " minutes.";
        return output;
    }
    else
        return time;

}

exports.getJsonClass=function getJsonClass(train_no,classTrain,eventCallback){
    var station_string="";
    var state = "";
    var result="";
    var status="";
    var result1="";
    var finalResult="no";
    var t= config.getCorrectedTrainNo(train_no);
    if(t==-1)
    {
        result="Not a valid train number";
        status="<p>Not a valid train number</p>";
        result1={speech:status,status:result,heading:null};
        eventCallback(result1);
        return;
    }
    else
        train_no=t;
    var url =config.getBaseUrl()+'route/train/'+train_no+'/apikey/'+ apiKey+'/';

    console.log(url);
    request(url, function (error, response, body) {
        if(error)
        {
            status= "Sorry, we could not process your request.";
            result={speech:status,status:status,heading:null};
            eventCallback(result);
            return;
        }
        var stringResult = JSON.parse(body);
        if (stringResult.response_code=='403')
        {
            status="<p>Please try again</p>";
            result1=null;
            result={speech:status,status:result1,heading:null};
            if(flag==1)
                eventCallback(result);
            if(flag<1)
            {
                flag++;
                getJsonTrainRoute(train_no,eventCallback);

            }
        }
        else
        {
            var station_names=[];
            var station_arrival=[];
            var station_dep=[];
            var day=[];
            for (i=0; i<stringResult.train.classes.length; i++){
                if(stringResult.train.classes[i].available=='Y')
                    result=result+stringResult.train.classes[i]['class-code']+" ";

            }
            if(result.indexOf(classTrain)>-1)
              finalResult="yes";

            eventCallback(finalResult);
        }
    });
    return status;
}

