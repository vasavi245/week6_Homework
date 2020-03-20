//global variables
var m = moment();
var newDay = moment().hour(0);
var currentTime = m.hour();

function getLocalStorage(key) {
  let value = localStorage.getItem(key);
  if (value) {
      $(`#text${key}`).text(value);
  }
}

$( document ).ready(function() {

  function clock() {
    var dateString = moment().format('MMMM Do YYYY, h:mm:ss a');
    $('#currentDay').html(dateString);
  }
  
  setInterval(clock, 1000);
  
  for (var hour = 9; hour < 18; hour++) {
  
    $('.container').append(`<div class='row time-block' data-time='${hour}'>
      
    <div class='col-sm col-md-2 hour'>
      <p>${formatAMPM(hour)}</p>
    </div>

    <div class='col-sm col-md-10 d-flex'>
       <div class='input-group'>
         <textarea class="form-control description past" id=text${hour}></textarea>
         </div>
         <div class='input-group-append'>
           <button class='saveBtn d-flex justify-center align-center' id=${hour}>
             <i class='far fa-save fa-2x save-icon'></i>
           </button>
         </div>
     </div>
   </div>`);

      
      getLocalStorage(hour);
  }

  function formatAMPM(hours) {
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return hours + ampm;
  }
formatAMPM();
console.log(currentTime);

if (currentTime >=0 && currentTime < 9){
  localStorage.clear();
}

//Checking time to determine present, past, or future
$.each($('.time-block'), function(index, value) {
  var dateHour = $(value).attr('data-time');
  if (Number(dateHour) === m.hour()) {
    $(this).find('textarea').addClass('present');
  } else if (Number(dateHour) < m.hour()) {
    $(this).find('textarea').addClass('past').attr('disabled', 'disabled');
    $(this).find('.save-button').addClass('disabled').attr('disabled', true);
  } else {
    $(this).find('textarea').addClass('future');
  }
});


var saveBtn = $('.saveBtn');
saveBtn.on('click', function(event){
  event.preventDefault();
  let eventId = $(this).attr('id');
  let eventText = $(this).parent().siblings().children('.description').val();
  localStorage.setItem(eventId, eventText);
});});
