const sallesBody = document.getElementById('salles-body');
const salleForm = document.getElementById('salle-form');

async function chargerSalles() {
  sallesBody.innerHTML = '<tr><td colspan="5" style="padding:20px; text-align:center;">Chargement...</td></tr>';
  try {
    // 1. On va chercher les chambres ET les réservations en même temps
    const [salles, reservations] = await Promise.all([
        getAll('salle'),
        getAll('reservation')
    ]);
    
    if (!salles || salles.length === 0) {
      sallesBody.innerHTML = '<tr><td colspan="5" style="padding:20px; text-align:center;">Aucune chambre trouvée.</td></tr>';
      return;
    }

    sallesBody.innerHTML = salles.map(salle => {
      // 2. LOGIQUE PURE : Est-ce que cette chambre a une réservation active ?
      // On fouille dans le tableau des réservations pour voir si le salle_id correspond.
      const estReservee = reservations && reservations.some(res => Number(res.salle_id) === Number(salle.id));
      
      // 3. On génère le texte et la couleur dynamiquement
      const statutTexte = estReservee ? "Occupée" : "Disponible";
      const statutCouleur = estReservee ? "#ff2b2b" : "#00c853"; // Rouge si occupée, Vert si libre

      // L'affichage avec le bon espacement (padding) est inclus ici
      return `
      <tr style="border-bottom: 1px solid #ccc;">
        <td style="padding: 12px;">${escapeHtml(salle.id)}</td>
        <td style="padding: 12px;">${escapeHtml(salle.type)}</td>
        <td style="padding: 12px; font-weight: bold;">${escapeHtml(salle.prix)} $</td>
        <td style="padding: 12px; color: ${statutCouleur}; font-weight: bold;">${statutTexte}</td>
        <td style="padding: 12px;">
            <button style="background: red; color: white; border: none; padding: 6px 12px; cursor: pointer; font-weight: bold;" onclick="supprimerSalle(${salle.id})">Supprimer</button>
        </td>
      </tr>
    `}).join('');
  } catch (error) {
    sallesBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Erreur : ${escapeHtml(error.message)}</td></tr>`;
  }
}

async function supprimerSalle(id) {
  if (!confirm(`Supprimer la chambre ${id} ?`)) return;
  try {
    await remove('salle', id);
    chargerSalles();
  } catch (error) {
    alert(`Erreur : ${error.message}`);
  }
}

salleForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nouvelleSalle = {
    id: Number(document.getElementById('id_salle').value.trim()),
    type: document.getElementById('type_salle').value.trim(),
    prix: Number(document.getElementById('prix_salle').value.trim()),
    // On force la valeur par défaut pour Oracle, car l'affichage est maintenant géré par notre intelligence au-dessus
    status: "Disponible" 
  };

  try {
    await create('salle', nouvelleSalle);
    salleForm.reset();
    chargerSalles();
  } catch (error) {
    alert(`Erreur : ${error.message}`);
  }
});

// Chargement initial
chargerSalles();