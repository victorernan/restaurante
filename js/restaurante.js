//campos del formulario
var nombre =  document.querySelector("#nombre");
var hora =  document.querySelector("#hora");
var comensales = document.querySelector("#comensales");
var fecha = document.querySelector("#fecha");

//div donde van a quedar las reservas
var contenedorReservas = document.querySelector(".grid");

var formulario = document.querySelector("#nuevaReserva");

eventos();

function eventos(e){
   
    nombre.addEventListener('change', datosReserva);
    hora.addEventListener('change', datosReserva);
    comensales.addEventListener('change', datosReserva);
    fecha.addEventListener('change', datosReserva);
    formulario.addEventListener('submit', nuevaReserva );

    //los elementos cargan de manera dinamica por lo que cuando 
    // busca faEdit no existe y da error. 
    //faEdit.addEventListener(click, editarReserva)
}

//recoge los datos del formulario
var reservaDetalle = {
    nombre : '', 
    hora : '',
    comensales : '', 
    fecha : '',
    contacto : ''
}

//para obtener lo que está en los input
function datosReserva(e) {
    reservaDetalle[e.target.name] = e.target.value;
}

class Reservas{
    constructor(){
         this.reservas = [];
    }

    crearReserva(nuevaReserva){
         this.reservas = [...this.reservas, nuevaReserva];
         console.log(this.reservas);
    }

    borrar(id){
        console.log(id);
        this.reservas = this.reservas.filter(itemBorrar => itemBorrar.id !== id);

        window.localStorage.removeItem(id);
        console.log(this.reservas);
    }

}

const administrarReservas = new Reservas();

function alerta(x){
    let p = document.createElement('p');
    p.classList.add(x);
    p.textContent = x;
    document.querySelector(".modal-body").appendChild(p);
    
    setTimeout(()=>{
        p.remove();
    }, 1500);
}

function formatoFecha(fecha){
    let fechaReservaCliente = new Date(fecha);
    let transforData = new Date( fechaReservaCliente.getTime() - fechaReservaCliente.getTimezoneOffset() * -60000 );
    const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    diaReserva = transforData.toLocaleDateString('es-es', opciones);
    return diaReserva;
}

function crearVistaReserva({reservas}){
//destructory de las reservas del objeto, por lo que ya es iterable

    limpiar(contenedorReservas);

    reservas.forEach(reserva => {
        const {nombre, hora, comensales , fecha, id} = reserva;
        let divReserva = document.createElement('div');
        divReserva.classList.add('card');
        divReserva.dataset.id = id;

        //cambiar formatos de la fecha
        formatoFecha(fecha);

        //todos los campos
        let nombreReserva = document.createElement('h4');
        nombreReserva.textContent = `Cliente: ${nombre}`;
        divReserva.appendChild(nombreReserva);

        let horaReserva = document.createElement('p');    
        horaReserva.textContent = `Hora: ${hora}`;
        divReserva.appendChild(horaReserva);
        
        let comensalesReserva = document.createElement('p');
        comensalesReserva.textContent = `Comensales: ${comensales}`;
        divReserva.appendChild(comensalesReserva);
        
        let fechaReserva = document.createElement('p');
        fechaReserva.textContent = `Fecha: ${diaReserva}`;
        divReserva.appendChild(fechaReserva);

        //añadir los botones
        buttonDelete(divReserva, id);
        //buttonEdit(divReserva, id);

        //añadir al dom
        contenedorReservas.appendChild(divReserva);

    });
}

function buttonDelete(divReserva, id){
    let borrar = document.createElement('button');
    borrar.classList.add('fa','fa-trash', 'fa-2x'); 
    borrar.onclick = () => borrarReserva(id);
    divReserva.appendChild(borrar);
}

/*
function buttonEdit(divReserva, id){
    let editar = document.createElement('button');
    editar.classList.add('fa', 'fa-edit', 'fa-2x');
    editar.id = "editar";
    //mediante esta instruccion se abre la moda para editar la info
    editar.setAttribute('data-target','#exampleModal');
    editar.setAttribute('data-toggle','modal');

    editar.onclick = () => editarReserva(id);
    divReserva.appendChild(editar);
}
*/

function nuevaReserva(e){
    //todos los submmit llevan preventDefault para evitar el post
    e.preventDefault();

    const {nombre, hora, comensales, fecha} = reservaDetalle;

    //validación de los campos
    if( nombre.length == 0 || hora.length == 0 || comensales.length == 0 || fecha.length == 0 ){
        alerta("error");
        return;
    }

    reservaDetalle.id= Date.now();
    administrarReservas.crearReserva({...reservaDetalle});
    //administrarReservas.guardarReserva({...reservaDetalle});
    crearVistaReserva(administrarReservas);
    alerta("success");
    formulario.reset(); 
}

function limpiar(x) {
    while(x.firstChild) {
        x.removeChild(x.firstChild);
    }
    //limpiar el objeto para evitar duplicados 
    reservaDetalle.comensales = '';
    reservaDetalle.fecha = '';
    reservaDetalle.hora = '';
    reservaDetalle.nombre = '';
}

function editarReserva(id){
}

function borrarReserva(id){
    administrarReservas.borrar(id);
    crearVistaReserva(administrarReservas);
}