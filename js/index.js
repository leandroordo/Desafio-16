var allContacts = [];
var contactsCount = 0;
var currentContactId = 0;

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
            <a href="#" class="contact__button edit" onClick="editContact(this)">Editar</a>
            <a href="#" class="contact__button danger" onClick="deleteContact(this)>Borrar</a>
        </div>`;

  contacts.forEach((obj) => {
    let contactHTML = `
        <div class="contact__line" data-contact-line id=${obj.id}>
            <div class="contact__name">${obj.name}</div>
            <div class="contact__field">${obj.email}</div>
            <div class="contact__field">${obj.birthdate}</div>
            ${actionsHTML}
        </div>`;

    allContactsHTML += contactHTML;
  });

  return allContactsHTML;
}

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

function showAddContactForm(show) {
  show
    ? document.getElementById("newContactForm").classList.remove("hidden")
    : document.getElementById("newContactForm").classList.add("hidden");
}

function validateInput() {
  return true;
}

function addContact() {
  const id = contactsCount + 1;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const birthdate = document.getElementById("birthdate").value;

  allContacts.push({ id, name, email, birthdate });
  localStorage.setItem("contactlist", JSON.stringify(allContacts));
}

function updateContact() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const birthdate = document.getElementById("birthdate").value;

  const contactToEdit = allContacts.find((i) => i.id === currentContactId);
  contactToEdit.name = name;
  contactToEdit.email = email;
  contactToEdit.birthdate = birthdate;

  localStorage.setItem("contactlist", JSON.stringify(allContacts));
}

function deleteContact() {
  const contactIndexToDelete = allContacts.findIndex(
    (i) => i.id === currentContactId
  );
  allContacts.slice();
}

function editContact(sender) {
  const id = Number(sender.closest("[data-contact-line]").id);
  const contactToEdit = allContacts.find((i) => i.id === id);
  if (contactToEdit) {
    showEditContact(contactToEdit);
  }
}

function deleteContact(sender) {
  const id = Number(sender.closest("[data-contact-line]").id);
  const contactToDelete = allContacts.find((i) => i.id === id);
  if (contactToDelete) {
    if (confirmDelete()) {
      deleteContact(contactToDelete);
    }
  }
}

function showEditContact(contactToEdit) {
  currentContactId = contactToEdit.id;
  document.getElementById("name").value = contactToEdit.name;
  document.getElementById("email").value = contactToEdit.email;
  document.getElementById("birthdate").value = contactToEdit.birthdate;

  showAddContactForm(true);
}

function confirmDelete() {
  return window.confirm(
    "¿Está seguro que desea borrar los datos de este contacto?"
  );
}

//Agregar eventos a los botones
document.getElementById("buttonNew").addEventListener("click", () => {
  //Limpiar los controles
  [
    ...document.getElementById("newContactForm").getElementsByTagName("input"),
  ].forEach((i) => (i.value = ""));

  currentContactId = 0;
  showAddContactForm(true);
});

document.getElementById("buttonOk").addEventListener("click", () => {
  if (validateInput) {
    if (currentContactId === 0) {
      addContact();
    } else {
      updateContact();
    }
    showAddContactForm(false);
    showContacts();
  }
});

//Mostrar la lista de contactos
showContacts();
