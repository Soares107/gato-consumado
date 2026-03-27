const BASE = 'https://api.thecatapi.com/v1';

let breeds = [];

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error();
  return r.json();
}

async function init() {
  const sel = document.getElementById('sel');

  try {
    const data = await get(BASE + '/breeds');
    breeds = data;

    sel.innerHTML = '<option value="">Selecione uma raça</option>';

    breeds.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = b.name;
      sel.appendChild(opt);
    });

    document.getElementById('btn').disabled = false;

  } catch {
    setStatus('Erro ao carregar API', true);
  }
}

async function buscar() {
  const id = document.getElementById('sel').value;

  if (!id) {
    setStatus('Selecione uma raça', true);
    return;
  }

  const breed = breeds.find(b => b.id === id);
  show(breed);
}

async function aleatorio() {
  const breed = breeds[Math.floor(Math.random() * breeds.length)];
  document.getElementById('sel').value = breed.id;
  show(breed);
}

async function show(breed) {
  setStatus('Carregando...');

  let imgs = [];

  try {
    const data = await get(`${BASE}/images/search?breed_ids=${breed.id}&limit=3`);
    imgs = data;
  } catch {}

  const result = document.getElementById('result');

  result.innerHTML = `
    <div class="card">
      <div class="images">
        ${imgs.map(i => `<img src="${i.url}">`).join('')}
      </div>
      <div class="info">
        <h2>${breed.name}</h2>
        <p>${breed.origin}</p>
        <p>${breed.description}</p>
      </div>
    </div>
  `;

  result.style.display = 'block';
  setStatus('');
}

function setStatus(msg, err = false) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.style.color = err ? 'red' : '#888';
}

init();
