//let all DOM elements be ready before any javascript 
window.onload=function init(){



  //my event listeners
  document.querySelector('#searchButton').addEventListener('click', search);
  document.querySelector('#clearButton').addEventListener('click', clear);



  function search(){
    let queryUrl='https://gist.githubusercontent.com/heiswayi/7fde241975ed8a80535a/raw/ff1caaeaf62bd6740ab7cafcd61f1215de173379/datatables-data.json';
    let xhr= new XMLHttpRequest();
    xhr.open('GET',queryUrl,true);
    xhr.onload=function(e){
      console.log('got');
      let jsonResponse=xhr.response;
      let data=JSON.parse(jsonResponse).data;
      displayAsTable(data);
    }
    xhr.send();
  }



  function clear(){
    document.querySelector('#tableDiv').innerHTML='';
  }



  function displayAsTable(data){
    let tableDiv=document.querySelector('#tableDiv');
    tableDiv.innerHTML='';
    let table=document.createElement('table');
    let headerRow=table.insertRow();
    headerRow.innerHTML='<th>Name</th><th>Occupation</th><th>Location</th><th>age</th><th>Employ Date</th><th>Salary</th>';
    data.forEach(function(currentData){
      let row=table.insertRow();
      currentData.forEach(function(currentIndex){
        cell=row.insertCell();
        cell.innerHTML=currentIndex;
      });
    });
    tableDiv.append(table);
  }



}