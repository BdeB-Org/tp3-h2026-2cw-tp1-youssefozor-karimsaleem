const sallesBody = document.getElementById('salles-body');
const salleForm = document.getElementById('salle-form');

async function chargerSalles() {
  sallesBody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';
  try {
    const salles = await getAll('salle');
    if (!salles.length) {
      sallesBody.innerHTML = '<tr><td colspan="5">Aucune salle trouvée.</td></tr>';
      return;
    }

    sallesBody.innerHTML = salles.map(salle => `
      <tr>
        <td>${escapeHtml(salle.id)}</td>
        <td>${escapeHtml(salle.type)}</td>
        <td>${escapeHtml(salle.prix)} $</td>
        <td>${escapeHtml(salle.status)}</td>
        <td><button class="danger" onclick="supprimerSalle(${salle.id})">Supprimer</button></td>
      </tr>
    `).join('');
  } catch (error) {
    sallesBody.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
  }
}

async function supprimerSalle(id) {
  if (!confirm(`Supprimer la salle ${id} ?`)) return;
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
    status: document.getElementById('status_salle').value.trim()
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