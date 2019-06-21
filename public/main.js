// help from:
// 1 https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d
// 2 https://www.youtube.com/watch?v=6ophW7Ask_0&t=1123s

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateDisplay = document.getElementById('displayDate');

//get elements
let modal = document.getElementById('modal');
let status = document.getElementById('status');
let lastDate = document.getElementById('last-date');
let userCount = document.getElementById('user-count');
let roomDisplay = document.getElementById('room-number');
let currentUsername = document.getElementById('current-username');

let username = document.getElementById('username').value;

var socket = io();

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

// calculate next or previous month then call calendar again
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
  let entry = new Object();
  entry.day = cellDate;
  entry.month = currentMonth;
  entry.year = currentYear;
  

  // logic to append locally, broadcast kept adding to sender as well

  // let clickedCell = document.getElementsByClassName('cell' + cellDate);
  // marker = document.createElement('div');
  // marker.classList.add('markerStyle');
  // let markerCheck = document.body.querySelector("div[class='markerStyle']");
  // clickedCell[0].appendChild(marker);

  var socket = io();
  socket.emit('calendarEntry', entry);
}

// trying to set username (not working properly)
const setUsername = (username) => {

  socket.emit('add user', username);
  modal.style.display = 'none';
}

// showing the total users in your room
const showTotalUsers = (data) => {
  let message = '';
  if (data.numUsers === 1) {
    message += "It's only you.";
  } else {
    message += "There are " + data.numUsers + " people in this room.";
  }
  userCount.innerHTML = message;
}

socket.on('login', (data) => {
  connected = true;
  var message1 = "Welcome – " + socket.username;
  currentUsername.innerHTML = message1;
  showTotalUsers(data);
});

socket.on('user joined', (data) => {
  status.innerHTML = data.username + ' joined';
  showTotalUsers(data);
});

 socket.on('user left', (data) => {
  status.innerHTML = data.username + ' has left.';
  showTotalUsers(data);
});
// custom calendar event, should place marker where someone else did and show the date
// of last placed marked in the first non date cell of the calendar
socket.on('calendarEntry', function (entry) {
  lastDate.innerHTML = entry.day + ' ' + entry.month + ' ' + entry.year + ' was the last date selected.';
  marker = document.createElement('div');
  marker.classList.add('markerStyle');
  var dayToMark = document.getElementsByClassName("cell" + entry.day);
  dayToMark[0].appendChild(marker);
});

// connection and room status messages
socket.on('connectToRoom',function(data) {
  roomDisplay.innerHTML = 'Room: ' + data;
});

socket.on('disconnect', () => {
  status.innerHTML = 'You have been disconnected.'
});

socket.on('reconnect', () => {
  status.innerHTML = 'You have been reconnected.';
  if (username) {
    socket.emit('add user', username);
  }
});

socket.on('reconnect_error', () => {
  status.innerHTML = 'attempt to reconnect has failed';
});

// var user;
// socket.on('userExists', function(data){
//   document.getElementById('error-display').innerHTML = data;
// });
// socket.on('userSet', function(data){
//   user = data.username;
// });

//close modal button
var closeModalBtn = document.getElementById('modalCloseBtn');
closeModalBtn.addEventListener('click', function(){
  modal.style.display = 'none';
});