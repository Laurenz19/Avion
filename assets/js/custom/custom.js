let table = document.getElementById("basic-datatables").rows;

for (let i = 1; i < table.length; i++) {
    table[i].children[4].children[0].onclick = () => {
        console.log(table[i].children[4].children[0].innerHTML);
        document.getElementById("numAvion").value = table[i].children[0].innerHTML.trim();
        let dateRes = table[i].children[2].innerHTML;
        let vol = table[i].children[3].innerHTML.split('-');
        console.log(dateRes.split("/")[0].trim());
        document.getElementById("dateRes").value = dateRes.trim();
        document.getElementById('vol').value = vol[0].trim() + " - " + vol[1].trim();

        let tab = dateRes.split("/");
        console.log(tab);
        let newDate = new Date(tab[2].trim() + "-" + tab[1].trim() + "-" + tab[0].trim());
        console.log(newDate);
        console.log(tab[2].trim() + "-" + tab[1].trim() + "-" + tab[0].trim());
    }
}