//현재는 password길이가 맞지 않아도 password check는 통과할 수 있음(네이버에서도 그렇다)

//잘못된 값 입력 시 곧바로 에러 메시지 띄움(네이버)
//값 입력하고 한번에 삭제할 수 있는 x표시 나타남.

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

//show input error message
function showError(input,message) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = formControl.querySelector('small');
  small.innerText = message;
}

//Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}

function checkEmail(input) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, '이메일 형식이 올바르지 않습니다')
  }
}

function checkRequired(inputArr) {
  let isRequired = false;
  inputArr.forEach((input) => {
    console.log(this);
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)}를(을) 입력하세요`);
      isRequired = true;
    }
  });
  return isRequired;
}


function checkLength(input,min,max) {
  if (input.value.length >= min && input.value.length <= max) {
    showSuccess(input);
  } else {
    showError(
      input,
      `${getFieldName(input)} 는 ${min}~${max} 글자여야 합니다`
    );
  }
}

function checkPasswordsMatch(input1,input2) {
  if (input1.value !== input2.value) {
    showError(input2, '비밀번호가 일치하지 않습니다')
  } else {
    showSuccess(input2);
  }
}

function getFieldName(input) {
  return input.name;
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  checkRequired([username, email, password, password2]);
});

username.addEventListener('input', function(e) {
  checkLength(username,3,15);
});

password.addEventListener('input', function(e) {
  checkLength(password,8,20);
});

email.addEventListener('input', function(e) {
  checkEmail(email);
});

password2.addEventListener('input', function(e) {
  checkPasswordsMatch(password,password2);
});

