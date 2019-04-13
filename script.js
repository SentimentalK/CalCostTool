function addinginput(x) {
    x.appendChild(document.createElement("td")).appendChild(document.createElement("input"));
    x.appendChild(document.createElement("td")).appendChild(document.createElement("input"));
}


function createContent() {
    document.querySelector(".tableContent").appendChild(document.createElement("tr"));
    let rows = document.querySelectorAll("tr");
    lastRow = rows[rows.length - 1];
    lastRow.setAttribute("id", "r" + rows.length);
    addinginput(lastRow);
    //adding class attributes
    inputs = document.querySelectorAll("input");
    costinput = inputs[inputs.length - 2];
    payerinput = inputs[inputs.length - 3];
    payerinput.setAttribute("class", "payer" + (rows.length - 1));
    costinput.setAttribute("class", "cost" + (rows.length - 1));
    costinput.setAttribute("type", "number");
}

function removeContent() {
    let rows = document.querySelectorAll("tr");
    lastRow = rows[rows.length - 1];
    if (rows.length > 2) {
        lastRow.remove();
    }
}

function gatherData() {
    inputs = document.querySelectorAll("input");
    data = {}
    for (var x = 0; x < inputs.length - 1; x += 2) {
        if (inputs[x].value != "") {
            data[inputs[x].value] = inputs[x + 1].value
        }
    }
    data["total"] = inputs[inputs.length - 1].value

    return data
}

function dataHandling(data) {

    let totalCost = 0, ppl, average, payees = {}, payers = {};

    ppl = data["total"]
    delete data["total"]

    for (let x = 1; Object.keys(data).length < ppl; x++) {
        data["Person" + x] = 0
    }

    for (let key in data) {
        data[key] = Number(data[key])
        totalCost += data[key];
    }

    average = totalCost / Object.keys(data).length
    for (let key in data) {
        if (data[key] > average) {
            payees[key] = (data[key] - average)
        } else {
            payers[key] = Math.abs(data[key] - average)
        }
    }

    return [payees, payers, totalCost, average]
}

function calculation([payees, payers, totalCost, average]) {
    let record = ["\n\n--------Receipt--------\n","This activity cost " + totalCost + " in total. " + average.toFixed(2) + " for each person."]
    for (let payee in payees) {
        while (payees[payee] > 0) {
            for (let payer in payers) {
                if (payees[payee] >= payers[payer]) {
                    if (payers[payer] != 0) {
                        record.push("\n" + payer + " need to pay " + payee + " " + Number(payers[payer]).toFixed(2));
                        payees[payee] = (payees[payee] - payers[payer]).toFixed(2)
                        payers[payer] = 0
                    }
                } else {
                    if (payees[payee] == 0) { break }
                    record.push("\n" + payer + " need to pay " + payee + " " + Number(payees[payee]).toFixed(2));
                    payers[payer] = (payers[payer] - payees[payee]).toFixed(2)
                    payees[payee] = 0
                }

            }
        }
    }
    return record
}

let addlist = document.querySelector(".addlist");
let removelist = document.querySelector(".removelist");
let calc = document.querySelector("button[name='calc']")
let recept = document.querySelector(".recept")

addlist.addEventListener("click", function () { createContent() });
removelist.addEventListener("click", function () { removeContent() });
calc.addEventListener("click", function () {
    var data = gatherData();
    if (data["total"] == "") {
        alert("Please fill total to continue")
    } else if (data["total"] < Object.keys(data).length - 1){ 
        alert("Your total ppl is less than the ppl paid bill, please fill valid data.")
    }else {
        let x = dataHandling(data);
        let record = calculation(x);
        for (i in record) {
            recept.appendChild(document.createElement("p")).textContent = record[i]
        }
    }
})










