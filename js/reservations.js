const reservationsBody = document.getElementById('reservations-body');
const reservationForm = document.getElementById('reservation-form');

async function chargerReservations() {
  reservationsBody.innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center;">Chargement...</td></tr>';
  try {
    const reservations = await getAll('reservation');
    
    if (!reservations || reservations.length === 0) {
      reservationsBody.innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center;">Aucune réservation trouvée.</td></tr>';
      return;
    }

    reservationsBody.innerHTML = reservations.map(res => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(res.id)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(res.client_id)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(res.salle_id)}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #00c853;">${escapeHtml(res.start_date).split('T')[0]}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #ff2b2b;">${escapeHtml(res.end_date).split('T')[0]}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">
            <button style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer;" onclick="supprimerReservation(${res.id})">Annuler</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    reservationsBody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Erreur : ${escapeHtml(error.message)}</td></tr>`;
  }
}

async function supprimerReservation(id) {
  if (!confirm(`Voulez-vous vraiment annuler la réservation ${id} ?`)) return;
  try {
    await remove('reservation', id);
    setMessage('reservation-message', `Réservation ${id} annulée avec succès.`, 'success');
    chargerReservations();
  } catch (error) {
    setMessage('reservation-message', `Erreur : ${error.message}`, 'error');
  }
}

reservationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    // 1. Le script calcule le prochain ID tout seul
    const reservationsExistantes = await getAll('reservation');
    let prochainId = 1;
    if (reservationsExistantes && reservationsExistantes.length > 0) {
      prochainId = Math.max(...reservationsExistantes.map(r => Number(r.id))) + 1;
    }

    // 2. On construit la requête avec l'ID auto-généré
    const nouvelleReservation = {
      id: prochainId, 
      client_id: Number(document.getElementById('res_client_id').value.trim()),
      salle_id: Number(document.getElementById('res_salle_id').value.trim()),
      start_date: document.getElementById('start_date').value + "T00:00:00Z",
      end_date: document.getElementById('end_date').value + "T00:00:00Z"
    };

    // 3. On envoie les données au serveur
    await create('reservation', nouvelleReservation);
    reservationForm.reset();
    setMessage('reservation-message', 'Réservation confirmée avec succès !', 'success');
    chargerReservations();
    
  } catch (error) {
    setMessage('reservation-message', `Erreur : ${error.message}`, 'error');
  }
});

// Chargement au démarrage
chargerReservations();