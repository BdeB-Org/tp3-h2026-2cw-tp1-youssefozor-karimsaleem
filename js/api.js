// Modifier BASE_URL selon votre configuration ORDS.
// Exemple : http://localhost:8080/ords/commande
const BASE_URL = 'http://localhost:8080/ords/commande';

function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function setMessage(elementId, message, type) {
  const messageDiv = document.getElementById(elementId);
  if (!messageDiv) return;
  
  messageDiv.textContent = message;
  messageDiv.className = 'message'; 
  if (type) messageDiv.classList.add(type);
  
  messageDiv.style.display = 'block';
  setTimeout(() => { messageDiv.style.display = 'none'; }, 4000);
}



async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erreur HTTP ${response.status} - ${text}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function getAll(table) {
  const data = await fetch(`${BASE_URL}/${table}/`).then(handleResponse);
  return data.items ?? [];
}

async function getById(table, id) {
  return fetch(`${BASE_URL}/${table}/${id}`).then(handleResponse);
}

async function create(table, data) {
  return fetch(`${BASE_URL}/${table}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse);
}

async function update(table, id, data) {
  return fetch(`${BASE_URL}/${table}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse);
}

async function remove(table, id) {
  return fetch(`${BASE_URL}/${table}/${id}`, {
    method: 'DELETE'
  }).then(handleResponse);
}

async function getReservationsByClient(idClient) {
  const reservations = await getAll('reservation');
  return reservations.filter(res => Number(res.client_id) === Number(idClient));
}