$(document).ready(function () {
  // Navegación
  $('#nav-inicio').click(() => {
    $('#inicio').show();
    $('#form-usuario, #form-extra').hide();
    $('.nav-link').removeClass('active');
    $('#nav-inicio').addClass('active');
  });

  $('#nav-form-usuario').click(() => {
    $('#form-usuario').show();
    $('#inicio, #form-extra').hide();
    $('.nav-link').removeClass('active');
    $('#nav-form-usuario').addClass('active');
  });

  $('#nav-form-extra').click(() => {
    $('#form-extra').show();
    $('#inicio, #form-usuario').hide();
    $('.nav-link').removeClass('active');
    $('#nav-form-extra').addClass('active');
  });

  // Cargar datos
  $('#cargar-datos').click(function () {
    const tipo = $('#tipo-dato').val();
    $.getJSON(`https://jsonplaceholder.typicode.com/${tipo}`)
      .done(function (data) {
        if (!data || data.length === 0) {
          $('#tabla-container').html('<div class="alert alert-warning">No se encontraron datos.</div>');
          return;
        }

        if ($.fn.DataTable.isDataTable('#tabla')) $('#tabla').DataTable().destroy();

        $('#tabla-container').html(`
          <table id="tabla" class="table table-bordered display w-100">
            <thead></thead>
            <tbody></tbody>
          </table>
        `);

        let columnas;
        if (tipo === 'users') {
          columnas = [
            { title: "ID", data: "id" },
            { title: "Nombre", data: "name" },
            { title: "Usuario", data: "username" },
            { title: "Email", data: "email" },
            { title: "Sitio Web", data: "website" }
          ];
        } else {
          columnas = Object.keys(data[0]).map(key => ({ title: key, data: key }));
        }

        const thead = $('#tabla thead');
        thead.html('<tr>' + columnas.map(col => `<th>${col.title}</th>`).join('') + '</tr>');

        $('#tabla').DataTable({
          data: data,
          columns: columnas
        });
      })
      .fail(function () {
        $('#tabla-container').html('<div class="alert alert-danger">Error al cargar datos.</div>');
      });
  });

  // Cancelar usuario
  $('#cancelar-usuario').click(() => {
    $('#usuario-form')[0].reset();
    $('#usuario-form input').removeClass('error');
    $('#errores-form').html('');
  });

  // Validar usuario
  $('#usuario-form').submit(function (e) {
    e.preventDefault();
    let errores = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const form = $(this);
    form.find('input').removeClass('error');
    $('#errores-form').html('');

    form.find('input[required]').each(function () {
      if (!$(this).val()) {
        errores += `<div class="alert alert-danger">El campo "${$(this).attr('name')}" es requerido.</div>`;
        $(this).addClass('error');
      }
    });

    const email = form.find('input[name="email"]').val();
    if (email && !emailRegex.test(email)) {
      errores += '<div class="alert alert-danger">Formato de email incorrecto.</div>';
      form.find('input[name="email"]').addClass('error');
    }

    const fecha = form.find('input[name="fecha"]').val();
    if (fecha && !fechaRegex.test(fecha)) {
      errores += '<div class="alert alert-danger">Formato de fecha incorrecto. Use dd/MM/yyyy.</div>';
      form.find('input[name="fecha"]').addClass('error');
    }

    if (errores) {
      $('#errores-form').html(errores);
      return;
    }

    alert('Datos enviados correctamente (simulado).');
    form[0].reset();
  });

  // Publicación extra
  $('#cancelar-extra').click(() => {
    $('#extra-form')[0].reset();
  });

  $('#extra-form').submit(function (e) {
    e.preventDefault();
    alert('Publicación enviada correctamente (simulado).');
    this.reset();
  });
});