var numeroInicial = 0;
var row=1;
var totalInicial = 0;
var rowprecios = 0;

function entregar(paquete){
console.log(paquete)
  var entrega = $.ajax({
          url: '/paquetes/entregar/'+paquete,
          method: 'PUT',
          dataType: 'json'
        });

        entrega.done(function(data){
          $("#"+paquete).html("Entregado!");
        });

        entrega.fail(function(data, textStatus, jqXHR){
            console.log(jqXHR);
        });
}

function agregarPaquete(){
  var usuario=$('#usuario').val();
  var fletera=$('#fleteras').val();
  var trackingnumber=$('#trackingnumber').val();
  var remitente=$('#remitente').val();
  var peso=$('#peso').val();
  var categoria=Number($('#categoria').val());
  var precio;
  var table = document.getElementById("paquetes-table");
  var tableprecios = document.getElementById("tabla-precios");
  var row = table.insertRow(row);
  var rowprecios = tableprecios.insertRow(rowprecios);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cellprecio1 = rowprecios.insertCell(0);
  var cellprecio2 = rowprecios.insertCell(1);
  var cellprecio3 = rowprecios.insertCell(2);
  var numero = numeroInicial + 1;
  cell1.innerHTML = numero;
  cell2.innerHTML = usuario;
  cell3.innerHTML = fletera;
  cell4.innerHTML = trackingnumber;
  cell5.innerHTML = remitente;
  cell6.innerHTML = peso + "lbs";
  cell7.innerHTML = categoria;
  if (categoria === 1){
    precio = .25;
    categoria = 'Sobre Chico';
  } else if (categoria === 2){
    precio = .50;
    categoria = 'Sobre Grande';
  } else if (categoria === 3){
    precio = 1;
    categoria = 'Caja Chica';
  } else if (categoria === 4){
    precio = 2;
    categoria = 'Caja Mediana';
  } else if (categoria === 5){
    precio = 3;
    categoria = 'Caja Grande';
  } else if (categoria === 6){
    precio = 10;
    categoria = 'Caja Extra Grande';
  }
  cellprecio1.innerHTML = numero;
  cellprecio2.innerHTML = categoria;
  cellprecio3.innerHTML = precio;
  numeroInicial = numero;
  var total = totalInicial + precio;
  row=row+1;
  rowprecios=rowprecios+1;
  $('#monto').val(total);
  $('#fleteras').val('');
  $('#trackingnumber').val('');
  $('#remitente').val('');
  $('#peso').val('');
  $('#categoria').val('');
  totalInicial = total;
}

function guardarOrden(){
  var x = document.getElementById("paquetes-table").rows.length;
  console.log(x);
  if (x <= 2){
    var paquete = new Object();
    paquete.usuario = document.getElementById("paquetes-table").rows[1].cells[1].innerHTML;
    paquete.fletera = document.getElementById("paquetes-table").rows[1].cells[2].innerHTML;
    paquete.tracking_number = document.getElementById("paquetes-table").rows[1].cells[3].innerHTML;
    paquete.remitente = document.getElementById("paquetes-table").rows[1].cells[4].innerHTML;
    paquete.peso = document.getElementById("paquetes-table").rows[1].cells[5].innerHTML;
    paquete.categoria = document.getElementById("paquetes-table").rows[1].cells[6].innerHTML;
    paquete.precio = document.getElementById("tabla-precios").rows[0].cells[2].innerHTML;
    console.log(paquete);
      var paquetenuevo = $.ajax({
          url: '/nuevopaquete',
          method: 'POST',
          dataType: 'text',
          data: paquete
        });

        paquetenuevo.done(function(data){
          location.reload();
        });

        paquetenuevo.fail(function(data, textStatus, jqXHR){
            console.log(jqXHR);
        });
  } else if (x > 2){
    for (var i = 1; i < x;i++) {
    var paquete = new Object();
    paquete.usuario = document.getElementById("paquetes-table").rows[i].cells[1].innerHTML;
    paquete.fletera = document.getElementById("paquetes-table").rows[i].cells[2].innerHTML;
    paquete.tracking_number = document.getElementById("paquetes-table").rows[i].cells[3].innerHTML;
    paquete.remitente = document.getElementById("paquetes-table").rows[i].cells[4].innerHTML;
    paquete.peso = document.getElementById("paquetes-table").rows[i].cells[5].innerHTML;
    paquete.categoria = document.getElementById("paquetes-table").rows[i].cells[6].innerHTML;
    paquete.precio = document.getElementById("tabla-precios").rows[i-1].cells[2].innerHTML;
    console.log(paquete);
      var paquetenuevo = $.ajax({
          url: '/nuevopaquete',
          method: 'POST',
          dataType: 'text',
          data: paquete
        });

        paquetenuevo.done(function(data){
          console.log(data);
        });

        paquetenuevo.fail(function(data, textStatus, jqXHR){
            console.log(jqXHR);
        });
    }
  }
  location.reload();
}
