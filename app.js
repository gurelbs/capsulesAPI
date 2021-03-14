const api = `https://apple-seeds.herokuapp.com/api/users/`
let $ = x => document.createElement(x)
let _ = x => document.querySelector(x)
let container = _('.container')
let table = _('table')
let search = _('.search')
let inputSearch = _('.inputSearch')
let searchBy = _('#search-by')

// localStorage.setItem('data', JSON.stringify([]))
// let data = JSON.parse(localStorage.getItem('data'))
let data = []
const saveToLocalStrorge = () => localStorage.setItem('data', JSON.stringify(data))
const fetchApi = () => {
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
}

const createDetails = () => {
    let table = $('table')
    let tr = $('tr')
    let defaultOption = $('option')
    defaultOption.setAttribute('selected', true)
    defaultOption.setAttribute('disabled', true)
    defaultOption.setAttribute('hidden', true)
    defaultOption.textContent = 'choose filter'
    let localdata = JSON.parse(localStorage.getItem('data'))
    Object.keys(localdata[0]).forEach(key => {
        let th = $('th')
        let sortArrow = $('div')
        sortArrow.classList.add('sort-arrow')
        let i1 = $('i')
        let i2 = $('i')
        i1.classList.add('fas', 'fa-arrow-up')
        i2.classList.add('fas', 'fa-arrow-down')
        let option = $('option')
        th.textContent = key
        option.textContent = key
        _('select').appendChild(defaultOption)
        _('select').appendChild(option)
        sortArrow.appendChild(i1)
        sortArrow.appendChild(i2)
            // th.appendChild(sortArrow)
        tr.appendChild(th)
        table.appendChild(tr)
    })
    localdata.forEach((person) => {
        let tr1 = $('tr')
        let deleteBtn = $('i')
        let updateBtn = $('i')
        deleteBtn.classList.add("fas", "fa-trash-alt")
        updateBtn.classList.add("fas", "fa-user-edit")
        Object.values(person).forEach(key => {
            let td = $('td')
            let span = $('span')

            span.textContent = key
            td.appendChild(span)
            tr1.appendChild(td)
        })
        let div = $('div')
        div.classList.add('btns')
        div.appendChild(deleteBtn)
        div.appendChild(updateBtn)
        tr1.appendChild(div)
        table.appendChild(tr1)
    });
    container.appendChild(table)
}
const addDataAttrToCity = () => {
    let len = container.lastElementChild.childNodes.length
    let trData = [...container.lastElementChild.childNodes].slice(1, len)
    trData.forEach(tr => {
        tr.childNodes[5].setAttribute('data-city', tr.childNodes[5].textContent)
        tr.childNodes[5].classList.add('city')
        let div = $('div')
        div.classList.add('city-active', 'unvisable')

        tr.childNodes[5].appendChild(div)
    })
}

const handleEditBtn = e => {
    let el = e.target.parentElement.parentElement
    el.childNodes.forEach(child => child.contentEditable = true);
    el.firstElementChild.contentEditable = false;
    el.lastElementChild.contentEditable = false;
    el.childNodes[1].focus();
    e.target.previousElementSibling.classList.replace('fa-trash-alt', 'fa-check')
    e.target.classList.replace('fa-user-edit', 'fa-times-circle')

}
const handleDeleteBtn = e => {
    const studentId = e.target.parentElement.parentElement.firstElementChild.textContent
    data.forEach(student => {
        if (student.id == studentId) data.splice(data.indexOf(student), 1)
    })
    let dlItem = e.target.parentElement.parentElement
    if (dlItem.nodeName === 'TR') dlItem.remove()
    saveToLocalStrorge()
}
const handleUserCancel = e => {
    let el = e.target.parentElement.parentElement;
    let userId = el.firstElementChild.textContent
    let oldData = []
    data.forEach(student => {
        if (student.id === parseInt(userId)) {
            oldData = [...Object.values(student)]
        }
    })
    let cancalData = [...el.childNodes].splice(0, el.childNodes.length - 1)
    cancalData.forEach((child, i) => {
        child.textContent = oldData[i]
        child.contentEditable = false
    })
    e.target.previousElementSibling.classList.replace('fa-check', 'fa-trash-alt')
    e.target.classList.replace('fa-times-circle', 'fa-user-edit')
}
const saveDataWithChange = e => {
    let el = e.target.parentElement.parentElement;
    e.target.nextElementSibling.classList.replace('fa-times-circle', 'fa-user-edit')
    e.target.classList.replace('fa-check', 'fa-trash-alt')
    let saveData = [...el.childNodes]
    let updateData = [...el.childNodes].splice(0, el.childNodes.length - 1)
    saveData.forEach(el => el.contentEditable = false)
    data.forEach(student => {
        if (parseInt(updateData[0].textContent) === student.id) {
            student.firstName = updateData[1].textContent
            student.lastName = updateData[2].textContent
            student.capsule = updateData[3].textContent
            student.age = updateData[4].textContent
            student.city = updateData[5].textContent
            student.gender = updateData[6].textContent
            student.hobby = updateData[7].textContent
        }
        saveToLocalStrorge()
    });
}
let msgParag = $('p')
msgParag.classList.add('msg-paragraph')
search.insertAdjacentElement('afterend', msgParag)
const handleSearchInput = e => {
    let len = container.lastElementChild.childNodes.length
    let trData = [...container.lastElementChild.childNodes].slice(1, len)
    let input = inputSearch.value.trim()
    if (input.length > 0 && searchBy.value !== 'choose filter') {
        if (searchBy.value === 'id' || searchBy.value === 'capsule' || searchBy.value === 'age') {
            input = parseInt(input)
                // most bt integer num between data length
            if (typeof input !== 'number' || isNaN(input)) {
                msgParag.textContent = 'type some number...'
            } else {
                if (searchBy.value === 'id') {
                    msgParag.textContent = ''
                    if (input > 31 || input < 0) {
                        msgParag.textContent = 'id number should be between 0 to 31'
                    } else {
                        trData.forEach(tr => {
                            let id = parseInt(tr.firstElementChild.firstElementChild.textContent)
                            if (!id.toString().includes(input.toString())) {
                                tr.classList.add('unvisable')
                            }
                        })
                    }
                }
                if (searchBy.value === 'capsule') {
                    if (input > 7 || input < 1) {
                        msgParag.textContent = 'capsule number should be between 1 to 7'
                    } else {
                        msgParag.textContent = ''
                        trData.forEach(tr => {
                            let capsule = parseInt(tr.childNodes[3].textContent)
                            if (!capsule.toString().includes(input.toString())) {
                                tr.classList.add('unvisable')
                            }
                        })
                    }
                }
                if (searchBy.value === 'age') {
                    if (input < 1 || input > 100) {
                        msgParag.textContent = 'all bootcamper age is between 1 to 100'
                    } else {
                        msgParag.textContent = ''
                        trData.forEach(tr => {
                            let age = parseInt(tr.childNodes[4].textContent)
                            if (!age.toString().includes(input.toString())) {
                                tr.classList.add('unvisable')
                            }
                        })
                    }
                }
            }
        } else if (
            searchBy.value === 'firstName' ||
            searchBy.value === 'lastName' ||
            searchBy.value === 'city' ||
            searchBy.value === 'gender' ||
            searchBy.value === 'hobby'
        ) {
            input = input.toString().toLowerCase()
            if (input.length == 0) {
                msgParag.textContent = 'type some words...';
            } else {
                msgParag.textContent = '';
                trData.forEach(tr => {
                    const checkData = (x, y, i) => {
                        if (x === y) {
                            if (!tr.childNodes[i].firstElementChild.innerHTML.toLowerCase().includes(input)) {
                                tr.classList.add('unvisable')
                            }
                        }
                    }
                    checkData(searchBy.value, 'firstName', 1)
                    checkData(searchBy.value, 'lastName', 2)
                    checkData(searchBy.value, 'city', 5)
                    checkData(searchBy.value, 'gender', 6)
                    checkData(searchBy.value, 'hobby', 7)
                })
            }
        }
    }
    if ((e.key === 'Backspace' || input.length < 1)) {
        trData.forEach(tr => {
            tr.classList.remove('unvisable')
        })
    }
}

search.addEventListener('keyup', e => handleSearchInput(e))
search.addEventListener('click', handleSearchInput)

const weatherCityHover = e => {
        let val = e.target.textContent
        let apiKey = `880e6c92a48f9475528cfdf79d5d4f00`
        let api = `http://api.openweathermap.org/data/2.5/weather?q=${val}&appid=${apiKey}&units=metric`
        if (e.target.getAttribute('data-city')) {
            fetch(api)
                .then(res => {
                    if (!res.ok) {
                        console.clear()
                        e.target.lastElementChild.classList.remove('unvisable')
                        e.target.lastElementChild.textContent = 'Not Found'
                        throw Error(`OMG its ${res.status}`)
                    }
                    return res.json()
                        .then(data => {
                            if (data.main.temp) {
                                if (e.target.classList.contains('city')) {
                                    e.target.lastElementChild.innerHTML = `${data.main.temp} &#8451;`
                                    e.target.lastElementChild.classList.remove('unvisable')
                                } else {
                                    e.target.lastElementChild.classList.remove('city-active')
                                    e.target.lastElementChild.classList.add('unvisable')
                                }
                            }
                        })
                }).catch(err => console.warn(err))
        }
    }
    // const sortTable = e => {
    //     let searchBy = e.target.parentElement.parentElement.textContent
    //     console.log(searchBy);
    //     let len = container.lastElementChild.childNodes.length
    //     let trData = [...container.lastElementChild.childNodes].splice(1, len)
    //     console.log(trData[0].children[trData[0].children.length - 2]);
    //     if (e.target.classList.contains('fa-arrow-down')) {
    //         let sorting = () => data.sort((a, b) => a[searchBy] > b[searchBy] ? 1 : -1)
    //         const replace = () => trData.forEach((tr, i) => [tr][i].forEach((td, j) => td[j].textContent = data[i][j]))
    //         sorting()
    //         replace()
    //         saveToLocalStrorge()
    //     } else if (e.target.classList.contains('fa-arrow-up')) {
    //         let sorting = () => data.sort((a, b) => b[searchBy] > a[searchBy] ? 1 : -1)
    //         const replace = () => trData.forEach((tr, i) => [tr][i].forEach((td, j) => td[j].textContent = data[i][j]))
    //         sorting()
    //         replace()
    //     }
    //     saveToLocalStrorge()
    // }
container.addEventListener('mouseover', weatherCityHover);
container.addEventListener('click', e => {
    e.target.classList.contains('fa-user-edit') ?
        handleEditBtn(e) :
        e.target.classList.contains('fa-times-circle') ?
        handleUserCancel(e) :
        e.target.classList.contains('fa-trash-alt') ?
        handleDeleteBtn(e) :
        e.target.classList.contains('fa-check') ?
        saveDataWithChange(e)
        // e.target.parentElement.classList.contains('sort-arrow') ?
        // sortTable(e) 
        :
        null
})

fetchApi()
createDetails()
addDataAttrToCity()