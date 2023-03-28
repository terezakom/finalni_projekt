// Pripravna cast - ulozim si nektere elementy do promennych a pak s nima dale pracovat
const form = document.querySelector('form')
const jmeno = document.querySelector('#jmeno')
const prijmeni = document.querySelector('#prijmeni')
const telefon = document.querySelector('#telefon')
const vek = document.querySelector('#vek')
const tabulkaPojistencu = document.querySelector('#tabulkaPojistencu > tbody')

form.addEventListener('submit', function(event) {
  event.preventDefault()
  postPojistenec()
})

// Funkce pro vytvoreni jednoho radku v tabulce
function createRow(id, jmeno, prijmeni, telefon, vek) {
  // Index -1 znamena, ze chceme vlozit na konec tabulky.
  const row = tabulkaPojistencu.insertRow(0)
  // vkladani do jednotlivych sloupcu v radku
  const bunkaJmena = row.insertCell(0)
  const bunkaPrijmeni = row.insertCell(1)
  const bunkaTelefonu = row.insertCell(2)
  const bunkaVeku = row.insertCell(3)
  const bunkaSmazani = row.insertCell(4)
  bunkaSmazani.appendChild(document.createElement('button')).innerHTML = 'Smazat'

  // Kazdemu radku dame ID jako ID jednotlivyho pojistence
  row.id = '#' + id
  // Vepiseme do sloupcu obsah z argumentu fce
  bunkaJmena.innerHTML = jmeno
  bunkaPrijmeni.innerHTML = prijmeni
  bunkaTelefonu.innerHTML = telefon
  bunkaVeku.innerHTML = vek

  // Tlacitku mazani davame event listener na click, deletePojistenec() pak maze konkretniho pojistence podle ID
  bunkaSmazani.addEventListener('click', () => deletePojistenec(id))
}

// Ziskavame seznam pojistencu (metoda GET), ziskana data pak rovnou vepiseme do radku cyklem
function getPojistenci() {
  fetch('http://localhost:3000/pojistenci').then(res => res.json()).then(data => {
    data.map( function(pojistenec) {
      createRow(pojistenec.id, pojistenec.jmeno, pojistenec.prijmeni, pojistenec.telefon, pojistenec.vek)
    })
  })
}

// Rovnou zavolame funkci
getPojistenci()

// Funkce pro vlozeni dat do databaze a okamzity vypsani
function postPojistenec() {
  fetch('http://localhost:3000/pojistenci', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jmeno: jmeno.value,
      prijmeni: prijmeni.value,
      telefon: telefon.value,
      vek: vek.value
    })
  })
    .then(function(res){ res.json() })
    .then( function(pojistenec) {
      createRow(pojistenec.id, pojistenec.jmeno, pojistenec.prijmeni, pojistenec.telefon, pojistenec.vek)
  })
}

// Smazani jednotliveho pojistence podle id
function deletePojistenec(id) {
  fetch('http://localhost:3000/pojistenci/' + id, { method: 'DELETE' })
    //Tady rikame, ze vyber element <tr>, kde jeho id ma hodnotu '#' plus cislo ID
    .then(() => document.querySelector(`#tabulkaPojistencu tr[id="#${id}"]`).remove())
}
