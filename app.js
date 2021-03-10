const api = `https://apple-seeds.herokuapp.com/api/users/`
let $ = x => document.createElement(x)

// localStorage.setItem('data', JSON.stringify([]))
// let data = JSON.parse(localStorage.getItem('data'))
let data = []
const saveToLocalStrorge = () => localStorage.setItem('data', JSON.stringify(data))
fetch(api)
    .then(res => res.json())
    .then(students => {
        students.forEach((student, i) => {
            fetch(`${api}${i}`)
                .then(res => res.json())
                .then(studentData => {
                    data.push({...student, ...studentData })
                    saveToLocalStrorge()
                })
        });
    })

const createDetails = () => {
    let table = $('table')
    let tr = $('tr')
    let localdata = JSON.parse(localStorage.getItem('data'))
    console.log(Object.keys(localdata[0]));
    Object.keys(localdata[0]).forEach(key => {
        let th = $('th')
        th.textContent = key
        tr.appendChild(th)
        table.appendChild(tr)
    })
    localdata.forEach((person) => {
        let tr1 = $('tr')
        Object.values(person).forEach(key => {
            let td = $('td')
            td.textContent = key
            tr1.appendChild(td)
            table.appendChild(tr1)
        })
    });
    document.body.appendChild(table)
}
createDetails()