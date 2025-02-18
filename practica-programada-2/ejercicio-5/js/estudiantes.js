const estudiantes = [
    {Nombre: "Juan", Apellido: "Perez", Nota: 70},
    {Nombre: "Andres", Apellido: "Fernandez", Nota: 91},
    {Nombre: "Pablo", Apellido: "Sanches", Nota: 44},
];
 
let notas = 0;

estudiantes.forEach(estudiante => 
        { resultado.innerHTML += `<p>Nombre: ${estudiante.Nombre} Apellido: ${estudiante.Apellido} Nota: ${estudiante.Nota}</p>`; 

        notas += estudiante.Nota;
    
        }


);

promedio = notas / estudiantes.length;

document.querySelector("#resultadopromedio").innerHTML = `Promedio de Notas: ${promedio.toFixed(2)}`;



    