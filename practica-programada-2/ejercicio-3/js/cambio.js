function cambio(){
    let texto = document.getElementById("texto");
    if (texto.innerHTML == "Primer Texto") {
        document.querySelector("#texto").innerHTML = `<p>Segundo Texto</p>`;
    } else {
        document.querySelector("#texto").innerHTML = `Primer Texto`;
    }
}


    