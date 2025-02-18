function calculo(){
    let salariobruto = parseInt(document.getElementById("salariobruto").value);
    if (isNaN(salariobruto) || salariobruto === " "){
        document.querySelector("#resultado").innerHTML = `<b style="color: red; ">¡Por favor ingrese un numero!</b>`
        return;
    }
    //Carga Sociales
    let cargasociales = salariobruto * 0.0967;

    // Impuesto sobre la renta
    let impuestorenta = 0;
    if (salariobruto >= 4783000) {
        impuestorenta = (salariobruto-4783000)*0.25 + (4783000-2392000)*0.20 + (2392000-1363000)*0.15 + (1363000-936000)*0.10;
    } else if (salariobruto >= 2392000){
        impuestorenta = (salariobruto-2392000)*0.20 + (2392000-1363000)*0.15 + (1363000-936000)*0.10;
    }else if (salariobruto >= 1363000){
        impuestorenta = (salariobruto-1363000)*0.15 + (1363000-936000)*0.10;
    }else if (salariobruto >= 936000){
        impuestorenta = (salariobruto-936000)*0.10 ;
    }else {
        impuestorenta = 0;
    }

    // Salario Neto
    let salarioneto = salariobruto - (cargasociales + impuestorenta);




    



    document.querySelector("#resultado").innerHTML = `<p>Carga social: ${cargasociales}</p><p>Impuesto sobre la renta: ${impuestorenta}</p><p>Salario neto: ${salarioneto.toFixed(2)}</p>`
}


    