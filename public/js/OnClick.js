function ExtraFilterFun() {
    var ExtraFilter = document.getElementById("ExtraFilter");
    if (ExtraFilter.style.display == "grid") {
      ExtraFilter.style.display = "none";
    } else {
      ExtraFilter.style.display = "grid";
    }
};

function TitleSwitch(LangClicked) {
  var PrefClicked = document.getElementById(LangClicked);
  var en = document.getElementById("english");
  var jp = document.getElementById("romaji");
  if (PrefClicked.id == "english") {
    PrefClicked.classList.add("toggled");
    jp.classList.remove("toggled");
  }
  else {
    PrefClicked.classList.add("toggled");
    en.classList.remove("toggled")
  }

  fetch("/Pref", {
    method: "POST",
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
    body: JSON.stringify({
      language: document.querySelector('.Option.toggled').id,
      Type: "Lang"
  })
  }).then(response => {
    if (response.ok) {
      console.log('Data sent to server successfully.');
      location.reload()
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

function OptionDropDown() {
  var OptionList = document.getElementById("optionList");
  
  if (OptionList.style.display == "flex") {
    OptionList.style.display = "none";
  } else {
    OptionList.style.display = "flex";
      }
};

function OptionSwitch() {
  const allOptions = document.querySelectorAll("#optionList li");
  for (const option of allOptions) {
    option.classList.remove("active");
  }
  event.target.classList.add("active");
  const selectedOption = event.target.innerText;
  
  const activeOptionSpan = document.querySelector(".activeOption");
  activeOptionSpan.innerHTML = selectedOption + ' <i class="fa-solid fa-angle-down"></i>';

  fetch("/Pref", {
    method: "POST",
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
    body: JSON.stringify({
      MediaType: selectedOption,
      Type: "Media"
  })
  }).then(response => {
    if (response.ok) {
      location.reload()
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

}

document.addEventListener('DOMContentLoaded', function() {
  const options = document.querySelectorAll('.optionClickable');
  options.forEach(option => {
      option.addEventListener('click', function() {
          const clickedText = this.textContent;

          // Update HTML content
          options.forEach(opt => {
              opt.classList.remove('optionListActive');
          });
          this.classList.add('optionListActive');

          // Send clicked text to the server
          fetch("/Pref", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                CatagoryDesc: clickedText,
                Type: "CatagoryDesc" 
              }),
          })
          .then(response => {
              // Handle server response if needed
              console.log('Text sent to the server:', clickedText);
              location.reload()
          })
          .catch(error => {
              // Handle errors
              console.error('Error:', error);
          });
      });
  });
});

function toggleVisibility(clickedButton) {
  const parentSection = clickedButton.parentNode;
  const additionalContents = parentSection.querySelectorAll('.additionalContent');
  const toggleButton = parentSection.querySelector('.toggleButton');

  additionalContents.forEach(content => {
    content.classList.toggle('hidden');
  });

  if (toggleButton.textContent === 'View More') {
    toggleButton.textContent = 'View Less';
  } else {
    toggleButton.textContent = 'View More';
  }
}

function CountDown() {
  const countdownElement = document.getElementById('countdown');
  const countdownTimerSpan = document.getElementById('countdownTimer');

  if (countdownElement && countdownTimerSpan) {
    let countdownInSeconds = parseInt(countdownElement.getAttribute('data-countdown'), 10);
    let EP = parseInt(countdownElement.getAttribute('data-EP'), 10);

    const intervalId = setInterval(() => {
      if (countdownInSeconds <= 0) {
        clearInterval(intervalId);
        countdownTimerSpan.textContent = 'Countdown is over!';
      } else {
        const days = Math.floor(countdownInSeconds / (24 * 3600));
        const hours = Math.floor((countdownInSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((countdownInSeconds % 3600) / 60);
        const seconds = countdownInSeconds % 60;
        countdownTimerSpan.textContent = `Ep ${EP} Arining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        
        countdownInSeconds--;
      }
    }, 1000);
  }
}
CountDown();