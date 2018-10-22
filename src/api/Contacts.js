const URL = 'http://localhost:3500/api'

export function sendContactMail(data)
{
    console.log('Estoy en la funcion', data)
    return fetch(URL + '/contact/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        lastName: data.lastName,
        birthDate: data.birthDate,
        email: data.email,
        phone: data.phone,
        password: data.password

      })
    })
    .then(res => res.json())
    .then(json => json.Data)
}
export function getContacts()
{
  console.log('Estoy en la funcion get')
  return fetch(URL + '/contact/list', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    })
  })
  .then(res => res.json())
  .then(json => json.Data)
}