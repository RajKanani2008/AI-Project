document.addEventListener("DOMContentLoaded", () => {

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const strength = document.getElementById("strength");
const capsLock = document.getElementById("capsLock");

if(password && togglePassword){

togglePassword.addEventListener("click", () => {

if(password.type === "password"){
password.type = "text";
togglePassword.innerHTML =
'<i class="fas fa-eye-slash"></i>';
}else{
password.type = "password";
togglePassword.innerHTML =
'<i class="fas fa-eye"></i>';
}

});

}

if(password && strength){

password.addEventListener("input", () => {

const value = password.value;

if(value.length < 6){
strength.innerHTML = "🔴 Weak Password";
}
else if(
value.length >= 8 &&
/[A-Z]/.test(value) &&
/[0-9]/.test(value)
){
strength.innerHTML = "🟢 Strong Password";
}
else{
strength.innerHTML = "🟡 Medium Password";
}

});

}

if(password && capsLock){

password.addEventListener("keyup", (e) => {

if(e.getModifierState("CapsLock")){
capsLock.innerHTML = "⚠ Caps Lock is ON";
}else{
capsLock.innerHTML = "";
}

});

}

});
