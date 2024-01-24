window.onload = function init() {
  console.log("page loaded and DOM is ready");

  var inputField = document.querySelector("#inputField");
  var typingDiv = document.querySelector("#typingDiv");

  inputField.addEventListener('input',showWhatWeTyped);

  function showWhatWeTyped() {
   // fill the div with the content of the input field
    typingDiv.innerHTML = inputField.value;
    typingDiv.style.backgroundColor = 'grey';
  }


};
