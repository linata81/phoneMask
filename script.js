document.addEventListener("DOMContentLoaded", function(){
  let phoneInputs = document.querySelectorAll('input[data-tel-input]');
  
  let getInputNumberValue = function(input) {
    return input.value.replace(/\D/g, "");
  }
  
  let onPhoneInput = function(e) {
    let input = e.target,
        inputNumbersValue = getInputNumberValue(input),
        formattedInputValue = "",
        selectionStart = input.selectionStart; //отслеживаем положение курсора при удалении цифр
        
    if(!inputNumbersValue) {
      return input.value = '';
    }
    
    if(input.value.length != selectionStart){
      if(e.data && /\D/g.test(e.data)) {
        input.value = inputNumbersValue;
      }
      return;
    }

    if(["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) { //из всех цифр номера проверяем 1-ю(indexOf можно заменить include)
      //Russian phone number
      if(inputNumbersValue[0] == "9") inputNumbersValue = "7"+ inputNumbersValue;
      let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
      formattedInputValue = firstSymbols + " ";
      if(inputNumbersValue.length > 1) {
        formattedInputValue += "("+ inputNumbersValue.substring(1, 4);
      }
      if(inputNumbersValue.length >= 5) {
        formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
      }
      if(inputNumbersValue.length >= 8) {
        formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
      }
      if(inputNumbersValue.length >= 10) {
        formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
      }
    } else {
      //Not Russian number
      formattedInputValue = "+" + inputNumbersValue.substring(0, 16); // обрежем первые 15 символов чтоб не было лишних цифр
    }
    input.value = formattedInputValue;
  }
  
  let onPhoneKeyDown = function(e) {
    let input = e.target;
    if(e.keyCode == 8 && getInputNumberValue(input).length == 1) {
      input.value = '';
    }
  }
  
  let onPhonePaste = function(e) {     //получаем текс из буфера обмена,который вставляем ctrl+V

    let pasted = e.clipboardData || window.clipboardData,
        input = e.target,
        inputNumbersValue = getInputNumberValue(input);
    if(pasted) {
      let pastedText = pasted.getData("Text");
      if(/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
      }
    }
  }
  
  for(let i = 0; i < phoneInputs.length; i++) {
    let input = phoneInputs[i];
    input.addEventListener('input', onPhoneInput);
    input.addEventListener('keydown', onPhoneKeyDown);
    input.addEventListener('paste', onPhonePaste);
  }
});
