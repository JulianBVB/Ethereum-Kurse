/**
 * This function is used to accesses the datas from the json which is updated every minute
 */
async function readJSON() {
    let response = await fetch('ethereum.json');
    let allDatas = await response.json();

    writeCourses(allDatas)
}

/**
 * This function is used to fill the index.html with the information from the json
 * @param {string} allDatas - This are all the information from the actually json
 */

function writeCourses(allDatas) {
    document.getElementById('courses').innerHTML = ``;
  
    var table = '<table class="table"><tr><th scope="col">Datum</th><th scope="col">Uhrzeit</th><th scope="col">Kurs</th>';


    for (let i = 0; i < allDatas.length; i++) {
       

            table +=
            `
            
            <tr>
            <th>${allDatas[i]['Datum']}</th>
            <th>${allDatas[i]['Uhrzeit']}</th>
            <th>${allDatas[i]['Kurs']}</th>
            </tr>
            
            `
    }

    table += 
    "</tr></table>";

    document.getElementById('courses').innerHTML = table;

}

