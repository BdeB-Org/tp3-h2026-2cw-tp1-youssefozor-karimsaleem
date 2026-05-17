const reservationsBody = document.getElementById('reservations-body');
const reservationForm = document.getElementById('reservation-form');

async function chargerReservations() {
  reservationsBody.innerHTML = '<tr><td colspan="6">Chargement...</td></tr>';
  try {
    const reservations = await getAll('reservation');
    if (!reservations.length) {
      reservationsBody.innerHTML = '<tr><td colspan="6">Aucune réservation trouvée.</td></tr>';
      return;
    }

    reservationsBody.innerHTML = reservations.map(res => `
      <tr>
        <td>${escapeHtml(res.id)}</td>
        <td>${escapeHtml(res.start_date)}</td>
        <td>${escapeHtml(res.end_date)}</td>
        <td>${escapeHtml(res.client_id)}</td>
        <td>${escapeHtml(res.salle_id)}</td>
        <td><button class="danger" onclick="supprimerReservation(${res.id})">Supprimer</button></td>
      </tr>
    `).join('');
  } catch (error) {
    reservationsBody.innerHTML = `<tr><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
  }
}

async function supprimerReservation(id) {
  if (!confirm(`Supprimer la réservation ${id} ?`)) return;
  try {
    await remove('reservation', id);
    chargerReservations();
  } catch (error) {
    alert(`Erreur : ${error.message}`);
  }
}

reservationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nouvelleRes = {
    id: Number(document.getElementById('id_reservation').value.trim()),
    start_date: document.getElementById('start_date').value,
    end_date: document.getElementById('end_date').value,
    client_id: Number(document.getElementById('client_id').value.trim()),
    salle_id: Number(document.getElementById('salle_id').value.trim())
  };

  try {
    await create('reservation', nouvelleRes);
    reservationForm.reset();
    chargerReservations();
  } catch (error) {
    alert(`Erreur : ${error.message}`);
  }
});

// Chargement initial
chargerReservations();