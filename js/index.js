var allContacts = [];
var contactsCount = 0;
var currentContactId = 0;

function showContacts() {
  allContacts = [...loadContacts()];
  const container = document.getElementById("contactList");

  if (allContacts && allContacts.length > 0) {
    contactsCount = allContacts.length;

    const contactListHTML = generateContactListItem(allContacts);
    container.innerHTML = contactListHTML;
  } else {
    contactsCount = 0;
    container.innerHTML =
      '<p>No hay ningún contacto cargado todavía. Haga clic en "Nuevo" para agregar uno</p>';
  }
}

function loadContacts() {
  const contacts = [];
  const contactListString = localStorage.getItem("contactlist");
  if (contactListString) {
    const contactList = JSON.parse(contactListString);

    for (const contact of contactList) {
      const person = {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        birthdate: contact.birthdate,
      };

      contacts.push(person);
    }
  }
  return contacts;
}

function generateContactListItem(contacts) {
  let allContactsHTML = "";
  const actionsHTML = `
        <div class="contact__actions">
            <a href="#" class="contact__button edit" onclick="doEditContact(this)">Editar</a>
            <a href="#" class="contact__button danger" onclick="doDeleteContact(this)">Borrar</a>
        </div>`;

  contacts.forEach((obj) => {
    let contactHTML = `
        <div class="contact__line" data-contact-line id="${obj.id}">
            <div class="contact__name">${obj.name}</div>
            <div class="contact__field">${obj.email}</div>
            <div class="contact__field">${toLocalDateFormat(
              obj.birthdate
            )}</div>
            ${actionsHTML}
        </div>`;

    allContactsHTML += contactHTML;
  });

  return allContactsHTML;
}

//Eventos de los botones
//Nuevo
document.getElementById("buttonNew").addEventListener("click", () => {
  //Limpiar los controles
  [
    ...document.getElementById("newContactForm").getElementsByTagName("input"),
  ].forEach((i) => (i.value = ""));

  currentContactId = 0;
  showAddContactForm(true);
});

//Editar
function doEditContact(sender) {
  const id = Number(sender.closest("[data-contact-line]").id);
  const contactToEdit = allContacts.find((i) => i.id === id);
  if (contactToEdit) {
    showEditContactForm(contactToEdit);
  }
}

//Borrar
function doDeleteContact(sender) {
  const id = Number(sender.closest("[data-contact-line]").id);
  const contactToDelete = allContacts.find((i) => i.id === id);
  if (contactToDelete) {
    if (confirmDelete()) {
      deleteContact(contactToDelete);
    }
  }
}

//Aceptar
document.getElementById("buttonOk").addEventListener("click", () => {
  if (validateInput()) {
    if (currentContactId === 0) {
      addContact();
    } else {
      updateContact();
    }
    showAddContactForm(false);
    showContacts();
  }
});

//Cancelar
document.getElementById("buttonCancel").addEventListener("click", () => {
  showAddContactForm(false);
});

function showAddContactForm(show) {
  show
    ? document.getElementById("newContactForm").classList.remove("hidden")
    : document.getElementById("newContactForm").classList.add("hidden");
}

function showEditContactForm(contactToEdit) {
  currentContactId = contactToEdit.id;
  document.getElementById("name").value = contactToEdit.name;
  document.getElementById("email").value = contactToEdit.email;
  document.getElementById("birthdate").value = toLocalDateFormat(
    contactToEdit.birthdate
  );

  showAddContactForm(true);
}

function confirmDelete() {
  return window.confirm(
    "¿Está seguro que desea borrar los datos de este contacto?"
  );
}

function validateInput() {
  var hayError = false;

  const name = document.getElementById("name");
  if (!validateIsNotEmpty(name.value)) {
    name.classList.add("error");
    hayError = true;
  } else {
    name.classList.remove("error");
  }

  const email = document.getElementById("email");
  if (!validateIsNotEmpty(email.value) || !validateIsValidEmail(email.value)) {
    email.classList.add("error");
    hayError = true;
  } else {
    email.classList.remove("error");
  }

  const birthdate = document.getElementById("birthdate");
  if (
    !validateIsNotEmpty(birthdate.value) ||
    !validateIsValidBirthDate(birthdate.value)
  ) {
    birthdate.classList.add("error");
    hayError = true;
  } else {
    birthdate.classList.remove("error");
  }

  return !hayError;
}

function validateIsNotEmpty(value) {
  return value.trim().length > 0;
}

function validateIsValidEmail(value) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}

function validateIsValidBirthDate(value) {
  // Solo acepto día, mes año (en ese orden) y con "/" o "-" como separador
  // Día y mes pueden tener un cero adelante
  // El año puede ser de dos o cuatro cifras.
  // Si es de dos cifras, va del 00 al 99, pero si es de cuatro, va del 1900 al 2999
  var re =
    /^(0?[1-9]|[12][0-9]|3[01])(\/|-)(0?[1-9]|1[0-2])\2(((00|[0-9][0-9])|((19|2[0-9])[0-9]{2})))$/;

  if (!re.test(value)) {
    return false;
  }

  var date = toDate(value);
  if (date == null) {
    return false;
  }

  //La fecha tiene que ser menor o igual que hoy
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return date < hoy;
}

function toDate(value) {
  // Parsear las partes de la fecha
  var parts = value.split(/[-/]/);
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // JavaScript cuenta los meses de 0 a 11
  var year = parseInt(parts[2], 10);

  var century = 0;

  if (year < 99) {
    //Tomar el año como dos dígitos
    const today = new Date();

    const todaysTwoDigitYear = today.getFullYear() % 100;
    const todaysCentury = Math.floor(
      (today.getFullYear() - todaysTwoDigitYear) / 100
    );

    year < todaysTwoDigitYear
      ? (century = todaysCentury)
      : (century = todaysCentury - 1);
  }

  const testDate = new Date(century * 100 + year, month, day);

  // Ver si testDate es una fecha válida
  if (
    !(testDate && testDate.getMonth() === month && testDate.getDate() === day)
  ) {
    return null;
  }
  return testDate;
}

function toLocalDateFormat(dateString) {
  const date = new Date(dateString);

  if (!isNaN(date)) {
    return [
      format2Digits(date.getDate()),
      format2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  }
}

function format2Digits(num) {
  return num.toString().padStart(2, "0");
}

function addContact() {
  const id = contactsCount + 1;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const birthdate = toDate(document.getElementById("birthdate").value);

  allContacts.push({ id, name, email, birthdate });
  localStorage.setItem("contactlist", JSON.stringify(allContacts));
}

function updateContact() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const birthdate = toDate(document.getElementById("birthdate").value);

  const contactToEdit = allContacts.find((i) => i.id === currentContactId);
  contactToEdit.name = name;
  contactToEdit.email = email;
  contactToEdit.birthdate = birthdate;

  localStorage.setItem("contactlist", JSON.stringify(allContacts));
}

function deleteContact(contactToDelete) {
  const contactIndexToDelete = allContacts.findIndex(
    (i) => i.id === contactToDelete.id
  );
  allContacts.splice(contactIndexToDelete, 1);
  localStorage.setItem("contactlist", JSON.stringify(allContacts));
  showContacts();
}

//Mostrar la lista de contactos
showContacts();
