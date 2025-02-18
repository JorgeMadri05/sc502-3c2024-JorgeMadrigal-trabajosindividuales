function calculoedad(){
    let edad = parseInt(document.getElementById("edad").value);

    if (isNaN(edad) || edad === " "){
        document.querySelector("#resultado").innerHTML = `<b style="color: red; ">¡Por favor ingrese un numero!</b>`
        return;
    }

    if (edad >= 18) {
        document.querySelector("#resultado").innerHTML = `Eres mayor de edad.`;
    } else {
        document.querySelector("#resultado").innerHTML = `Eres menor de edad.`;
    }
    


   
}


    