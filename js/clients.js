const clientsBody = document.getElementById('clients-body');
const clientForm = document.getElementById('client-form');
const reloadClientsBtn = document.getElementById('reload-clients');

/**
 * Charge les clients depuis la base de données Oracle via ORDS
 */
async function chargerClients() {
  clientsBody.innerHTML = '<tr><td colspan="4">Chargement...</td></tr>';
  try {
    const clients = await getAll('client');
    if (!clients.length) {
      clientsBody.innerHTML = '<tr><td colspan="4">Aucun client trouvé.</td></tr>';
      return;
    }

    clientsBody.innerHTML = clients.map(client => `
      <tr>
        <td>${escapeHtml(client.id)}</td>
        <td>${escapeHtml(client.nom)}</td>
        <td>${escapeHtml(client.email)}</td>
        <td><button class="danger" onclick="supprimerClient(${client.id})">Supprimer</button></td>
      </tr>
    `).join('');
  } catch (error) {
    clientsBody.innerHTML = `<tr><td colspan="4">${escapeHtml(error.message)}</td></tr>`;
    setMessage('client-message', 'Impossible de charger les clients. Vérifiez BASE_URL et ORDS.', 'error');
  }
}

async function supprimerClient(id) {
  if (!confirm(`Supprimer le client ${id} ?`)) return;
  try {
    await remove('client', id);
    setMessage('client-message', `Client ${id} supprimé avec succès.`, 'success');
    chargerClients();
  } catch (error) {
    setMessage('client-message', error.message, 'error');
  }
}

/**
 * Intercepte la soumission du formulaire pour ajouter un client
 */
clientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nouveauClient = {
    id: Number(document.getElementById('id_client').value.trim()),
    nom: document.getElementById('nom_client').value.trim(),
    email: document.getElementById('email_client').value.trim()
  };

  try {
    await create('client', nouveauClient);
    clientForm.reset();
    setMessage('client-message', 'Client ajouté avec succès.', 'success');
    chargerClients();
  } catch (error) {
    setMessage('client-message', error.message, 'error');
  }
});

reloadClientsBtn.addEventListener('click', chargerClients);

// Chargement initial au démarrage de la page
chargerClients();