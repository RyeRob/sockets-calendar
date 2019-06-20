// help from the following sources:
// 1 https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateDisplay = document.getElementById('displayDate');

// call function that create calendar
showCalendar (currentMonth, currentYear);

// function that creates a calendar
function showCalendar(month, year) {
  let firstDay = (new Date (year, month)).getDay();
  // getting total days of currentMonth by forcing to 32
  let daysThisMonth = 32 - new Date(year, month, 32).getDate();
  let table = document.getElementById('calendarBody');
  table.innerHTML = '';

  dateDisplay.innerHTML = months[month] + ' ' + year;

  let date = 1;

  // loop to create rows as weeks
  for (let i = 0; i < 6; i++){

    let row = document.createElement('tr');
    // loop to create days within each week
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement('td');
        cellText = document.createTextNode('');
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      // stop adding weeks if we have enough rows
      else if (date > daysThisMonth) {
        break;
      }
      // add cell and event handler
      else {
        let cell = document.createElement('td');
        let cellText = document.createTextNode(date);
        cell.addEventListener('click',function(){
          let cellDate = parseInt(cell.innerHTML);
          createCellDate(cellDate);
        });
        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
          cell.classList.add('today');
        }
        cell.classList.add('cell');
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
      }
    }
    table.appendChild(row);
  }
}

function createCellDate(cellDate) {
  let entry = new Object();
  entry.day = cellDate;
  entry.month = currentMonth; 
  entry.year = currentYear;
  entry.cell = cell;

  //document.getElementById('selected-date').innerHTML = entry.day + ' ' + entry.month;
  var socket = io();
  socket.emit('calendarEntry', entry);
}
// calculate and show next month
function nextMonth() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}
// calculate and show previous month
function prevMonth() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}


// sockets
socket.on('calendarEntry', function (entry) {
  var selectedCell = entry.cell;
  selectedCell.innerHTML = entry.day + ' ' + entry.month;
});
