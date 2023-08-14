let inputSlider = document.querySelector("[data-lengthSlider]")
let lengthDisplay = document.querySelector("[data-lengthNumber]")
let passwordDisplay = document.querySelector("[data-passwordDisplay]");
let copyBtn = document.querySelector("[data-copy]");
let copyMsg = document.querySelector("[data-copyMsg]")
let uppercaseCheck = document.querySelector("#uppercase")
let lowercaseCheck = document.querySelector("#lowercase")
let numbersCheck = document.querySelector("#numbers")
let symbolsCheck = document.querySelector("#specialchar")
let indicator = document.querySelector("[data-indicator]");
let generateBtn = document.querySelector(".generateButton")
// let allCheckBox = document.querySelector("input[type=checkbox]")
let allCheckBox = document.querySelectorAll("input[type=checkbox]");

let symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey
setIndicator("#ccc")
handleSlider()
// sets password length in accordance to slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    let min = inputSlider.min;
    let max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    // shadow
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
    //math.random(), 0 se 1 ke beech me koi random number deta hai 
    // 1 excluded
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97, 123));
    // from char code se hamne number ko character me convert krdia
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65, 91));
}
function generateSymbol(){
    let randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator('#0f0');
    } else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator('#ff0');
    } else{
        setIndicator('#f00');
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        // aise copy krte hai koi bhi cheez clipboard me
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed!! Retry after some time"
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(() =>{
        copyMsg.classList.remove("active");
    }, 2000)
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    })
    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
        copyContent();
})
generateBtn.addEventListener('click', () =>{
    // if none of the checkboxes are selected
    if(checkCount <= 0) 
        return; 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    function shufflePassword(array){
        // Fisher Yates Method
        for(let i = array.length - 1; i > 0; i--){
            let j = Math.floor(Math.random()*(i+1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        let str = "";
        array.forEach((el) => (str += el));
        return str;
    }
    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    // compulsory tasks
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    // shuffle password
    password = shufflePassword(Array.from(password));
    // show in UI
    passwordDisplay.value = password;
    // calculate strength
    calcStrength();
})