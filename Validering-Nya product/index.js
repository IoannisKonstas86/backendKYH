//Funktion för att hämta data från Strapi CMS
async function getDataFromStrapi() { 
    
let products = [
    "Laptops",
    "Keyboards",
    "Monitors"
];

    for (let i=0; i< products.length; i++){
    let url = `http://localhost:1337/api/${products[i]}?populate=*`;

    //Hämtar JSON från API och konverterar det till JS objekt
    let stringResponse = await fetch(url);
    let myObjekt = await stringResponse.json();


    let output = "<table>";

    //Checkar om det är ett eller flera objekt som hämtas
    if (Array.isArray(myObjekt.data)){
        //Anropa generateRow för att skapa en HEader-rad
        output += generateRow(myObjekt.data[0].attributes, null, true);

        //Skapar en ForEach loop för varje elemet i Data-arrayen
        myObjekt.data.forEach(element => {
            
            //Gör en pekare till attribut objektet
            let obj = element.attributes;
           
            
            //Skriver Output string            
            output += generateRow(obj, element.id, false);
        });
    } else {
        //Gör en pekare till attribut objektet
        let obj = myObjekt.data.attributes;
         
        //Skapa en Header Rad
        output += generateRow(obj,null, true);

        //Skriver Output string
        output += generateRow(obj, myObjekt.data.id, false);
    }


    output += "</table>";
    
    //Skriver ut Output string till div-element
    document.getElementById("productsFetched").innerHTML += output;
}
}

//Funktion för att hämta Token för användare
//Om en Token hämtas så betyder det att user/password är korrekt skrivet
async function getToken() {
    /*
    1. Göra ett inloggningsförsök för att få en Token returnerad
    2. Sammla data och skapa ett objekt av dessa
    3. Skicka iväg JSON till API
    */

    let valid = true;

    //Validera användarnamn och lösenord!
    if ( !validateLogin() ) valid = false;

    
    if (!valid) return null;

    //Url till Strapi.js UserList
    const urlUser = "http://localhost:1337/api/auth/local/";

    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    //Skapar ett objekt av det användarnamn och lösenord som user har skrivit in i fält.
    let userObject = {
        identifier : user,
        password : pass
    }

    //Anropar API med inloggningsdata.
    //Inkluderar Method och Headers
    let userResponse = await fetch(urlUser,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userObject)
    });

    //Konverterar API response JSON string till ett objekt
    let userJson = await userResponse.json();
    console.log(userJson);

    //Kontrollerar om objektet har Token.
    //Token ligger under attribut jwt
    //Om så; inloggning är korrekt. Fortsätt till funktion postData med token som parameter.
    if (userJson.jwt) postData(userJson.jwt);
    else {
        //Inloggningen har misslyckats. Skriv ut errormeddelande från Strapi.js
        let errMessage = userJson.error.message;

        document.getElementById("userError").innerText = errMessage;

        return null;
    }
}

async function postData(token) {

    //Anropa GetToken() för att få en inloggnings-nyckel.
    //Om detta misslyckas, avbryt funktionen.
    // let token = await getToken();
    // if (!token) return;
    const category = document.getElementById("category").value;
    //URL till Strapi products
    const urlProduct = `http://localhost:1337/api/${category}`;

    // Hämtar data från fält
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;
    
    //Skapa ett objekt med data inkluderat.
    let laptopObjekt = {
        data : {
            Title : title,
            Description : description,
            Price : price,
            Qty :qty,
        },
    };

    //Anropar API med laptopObjekt
    let laptopResponse = await fetch(urlProduct,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization : "Bearer " + token //Inkluderar Token från inloggning tidigare.
        },
        body: JSON.stringify(laptopObjekt),
    });

    let laptopJson = await laptopResponse.json();

    console.log(laptopJson);
}


//Validering av User Input
function userValidate(comp) {
    // 1. Fältet måste vara ifyllt

    let valid = true;

    if (comp.value.length == 0) {
        //Misslyckad validering
        valid = false;
    }

    //Check on lyckad validering
    if (!valid) {
        document.getElementById("userError").innerText = "Du måste fylla i ett användarnamn!";
        return false;
    } else {
        document.getElementById("userError").innerText = "";
        return true;
    }
}

//Validering av Password input
function passValidate(comp) {
    // 1. Fältet måste vara minst 5 tecken eller längre

    let valid = true;

    if (comp.value.length <= 4) {
        //Misslyckad validering
        valid = false;
    }

    //Check on lyckad validering
    if (!valid) {
        document.getElementById("passwordError").innerText = "Lösenordet måste vara minst 5 tecken långt!";
        return false;
    } else {
        document.getElementById("passwordError").innerText = "";
        return true;
    }
}

//funktion för validering av inloggninfsförsök
function validateLogin() {
    //Variabel
    let valid = true;

    //Validate Användarnamn
    if (!userValidate(document.getElementById("user"))) {
        valid = false;
    }

    //Validate Password
    if (!passValidate(document.getElementById("pass"))) {
        valid = false;
    }

    return valid;
}



//Genererat tabellrad med det inkludera objektet. Skapar TH rad om header=true
function generateRow(obj, objId, header) {

    let output = "<tr>";
    let forbiddenParameters = ["createdAt", "updatedAt", "publishedAt","Description","Image","product"];

    //For in loop för att gå igenom alla parametrar i obj
    for (x in obj) {
        /*
        x = parameterns namn
        obj[x] = parameterns värde
        */

        //Kontrollera att x är en tillåten parameter.
        // Keyword Continue går vidare till nästa parameter i loopen
        //Fungerar också i en ForEach loop.
        if (forbiddenParameters.includes(x)) continue;

        if (header) output += `<th>${x}</th>`;
        else        output += `<td>${obj[x]}</td>`;
    }

    //Skapa update och Delete knapp för TD rad
    if (!header) {
        //URL för den specifika posten
        let postURL = `http://localhost:1337/api/Laptops/${objId}`;

        output += `<td><button onclick="updatePost('${postURL}');">Update Post</button></td>`;
        output += `<td><button onclick="deletePost('${postURL}');">Delete Post</button></td>`;
    }

    //Stänga <tr> taggen
    output += "</tr>";

    return output;
}

async function updatePost(url) {

    //Hämta Token från GetToken()
    //Om ingen Token returneras, avbryt funktionen
    let token = await getToken();
    if (!token) return;

    // Hämtar data från fält
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;
    //Skapa ett objekt med data inkluderat.
    let productObjekt = {
        data : {}
    };

    //Fyller upp Data med parameter-värden
    if (title) productObjekt.data["name"] = title;
    if (description) productObjekt.data["type"] = description;
    if (price) productObjekt.data["level"] = price;
    if (qty) productObjekt.data["level"] = qty;

    //Anropar API med productObjekt
    await fetch(url,
    {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + token //Inkluderar Token från inloggning tidigare.
        },
        body: JSON.stringify(productObjekt)
    });

    //Anropa "GetDataFromStrapi" för att skriva ut ny tabell
    await getDataFromStrapi();
}

async function deletePost(url) {

    //Hämta Token från GetToken()
    //Om ingen Token returneras, avbryt funktionen
    let token = await getToken();
    if (!token) return;

    //Anropar API med inloggningsdata.
    //Inkluderar Method och Headers
    await fetch(url,
        {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + token //Inkluderar Token från inloggning tidigare.
            }
        });

    //Anropa "GetDataFromStrapi" för att skriva ut ny tabell
    await getDataFromStrapi();

}