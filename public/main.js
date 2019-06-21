// help from the following sources:
// 1 https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d
// https://www.youtube.com/watch?v=6ophW7Ask_0&t=1123s

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateDisplay = document.getElementById('displayDate');


// generate calendar
function showCalendar(month, year) {
  let firstDay = (new Date (year, month)).getDay();
  let daysThisMonth = 32 - new Date(year, month, 32).getDate();
  let table = document.getElementById('calendarBody');
  table.innerHTML = '';

  dateDisplay.innerHTML = months[month] + ' ' + year;

  let date = 1;

  // create cells for max rows a month can be - 6 max
  for (let i = 0; i < 6; i++){

    let row = document.createElement('tr');
    // loop to create empty cells up to first day
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement('td');
        cellText = document.createTextNode('');
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      // stop creating cells if the date becomes greater than the total of that month
     else if (date > daysThisMonth) {
       break;
     }
      // create cells, add date text
      else {
        // create cells with dates
        let cell = document.createElement('td');
        let cellText = document.createTextNode(date);
        // make the current day yellow
        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
          cell.classList.add('today');
        }
        cell.classList.add('cell' + date);
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
        cell.addEventListener('click',function(){
          let cellDate = parseInt(cell.innerHTML);
          createCellDate(cellDate);
        });
      }
    }
    table.appendChild(row);
  }
}

showCalendar(currentMonth, currentYear);

function nextMonth() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}
function prevMonth() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

// function that executes when cell is clicked
function createCellDate(cellDate) {
  //modal.style.display = 'block';
  let entry = new Object();
  entry.day = cellDate;
  entry.month = currentMonth;
  entry.year = currentYear;
  
  let clickedCell = document.getElementsByClassName('cell' + cellDate);


  marker = document.createElement('div');
  marker.classList.add('markerStyle');

  var markerCheck = document.body.querySelector("div[class='markerStyle']");
  if (toString(markerCheck) == clickedCell[0]){
    console.log('no');
  } else {
    console.log('yes');
  }

  clickedCell[0].appendChild(marker);

  var socket = io();
  socket.emit('calendarEntry', entry);
}

// --- socket.io ---


socket.on('calendarEntry', function (entry) {
  cell.innerHTML = entry.day + ' ' + entry.month;
});

socket.on('user joined', function(totalUsers) {
  let userCount = document.getElementById('user-count');
  userCount.innerHTML = totalUsers;
});

socket.on('connectToRoom',function(roomno) {
  let roomDisplay = document.getElementById('room-number');
  roomDisplay.innerHTML = 'Room: ' + roomno;
});

socket.on('userdissconnect', function(){

});


const setUsername = () => {
  username = cleanInput($usernameInput.val().trim());

  // If the username is valid
  if (username) {
    // tell the server the username
    socket.emit('add user', username);
  }
}





// let addBtn = document.getElementById('add-btn');
// addBtn.addEventListener('click', function(){


// });

// modal stuffs
let modal = document.getElementById('modal');

//close modal
var closeModalBtn = document.getElementById('modalCloseBtn');
closeModalBtn.addEventListener('click', function(){
  modal.style.display = 'none';
});

// get modal form feilds and fill with object data
// let dayInput = document.getElementById('day-input');
// let monthInput = document.getElementById('month-input');
// let yearInput = document.getElementById('year-input');
// dayInput.innerHtml = entry.day;
// monthInput.innerHtml = entry.month;
// yearInput.innerHtml = entry.year;

