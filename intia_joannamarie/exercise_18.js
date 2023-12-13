const myRestApi = 'https://thefusionseller.online/restapi/intia_backend.php';

refresh();
function submitData() {
    const id = document.querySelector("#id").value;
    if (id) {
        edit(id);
    }
    else {
        create();
    }
}

function create() {
    const kpop = document.querySelector("#kpop").value;
    const members = document.querySelector("#members").value;
    const agency = document.querySelector("#agency").value;
    const fandom = document.querySelector("#fandom").value;
    const bias = document.querySelector("#bias").value;

    const formData = new FormData();
    formData.append("kpop", kpop);
    formData.append("members", members);
    formData.append("agency", agency);
    formData.append("fandom", fandom);
    formData.append("bias", bias);
    
    fetch(myRestApi, {
        method: "POST",
        body: formData,
    })
    .then(() => {
        document.getElementById("kpop-form").reset();
        refresh();
    });
}

function refresh() {
    const table = document.querySelector("#kpop_list");

    const rowCount = table.rows.length;
        for (let i = rowCount - 1; i > 0; i--) {
            table.deleteRow(i);
        }
        
    const headerRow = table.insertRow(0);
    headerRow.innerHTML = "";
    fetch(myRestApi)
        .then((response) => response.json())
        .then((kpopList) => {
            for (const kpop_band of kpopList) {
                const row = table.insertRow(-1);
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const cell5 = row.insertCell(4);
                const cell6 = row.insertCell(5);
                const cell7 = row.insertCell(6);

                cell1.textContent = kpop_band.id;
                cell2.textContent = kpop_band.kpop;
                cell3.textContent = kpop_band.members;
                cell4.textContent = kpop_band.agency;
                cell5.textContent = kpop_band.fandom;
                cell6.textContent = kpop_band.bias;

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", function () {
                    show(kpop_band);
                });

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function () {
                    deleteUser(kpop_band.id);
                });
                cell7.appendChild(editButton);
                cell7.appendChild(deleteButton);
            }
        });
}

function show(kpop) {
    document.querySelector("#kpop").value = kpop.kpop;
    document.querySelector("#members").value = kpop.members;
    document.querySelector("#agency").value = kpop.agency;
    document.querySelector("#fandom").value = kpop.fandom;
    document.querySelector("#bias").value = kpop.bias;
    document.querySelector("#id").value = kpop.id;
}

function edit(id) {
    const kpop = document.querySelector("#kpop").value;
    const members = document.querySelector("#members").value;
    const agency = document.querySelector("#agency").value;
    const fandom = document.querySelector("#fandom").value;
    const bias = document.querySelector("#bias").value;
    
    fetch(`./intia_backend.php`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${id}&members=${members}&agency=${agency}&` + 
        `fandom=${fandom}&kpop=${kpop}&bias=${bias}`
    })
    .then(() => {
        document.getElementById("kpop-form").reset();
        refresh();
    });
}

function deleteUser(id) {
    fetch(myRestApi, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: `id=${id}`,
    })
    .then((response) => response.text())
    .then((responseText) => {
        alert(responseText);
        refresh();
    });
}
