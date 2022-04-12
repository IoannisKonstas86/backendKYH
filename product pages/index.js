
async function renderObjects(){
    let apiUrl = "http://localhost:1337";
    // let stringImage = await fetch(apiUrl);
    // let imageObj = await stringImage.json();
    
    let urlLocalhost = "http://localhost:1337/api/keyboards/?populate=Image";
    // Url för bild
  
    let stringResponse = await fetch (urlLocalhost);
    let myobject = await stringResponse.json();
    let output = '';
    
    //Kolla om data är en array
    if(Array.isArray(myobject.data)){
        myobject.data.forEach(element => {
            let attr = element.attributes;

            output += `
            
            <div class="col-4" id="${element.id}" onclick="getId(this)">
            <div class="card h-100 shadow-sm"> <img  src="${apiUrl + attr.Image.data.attributes.formats.thumbnail.url}" class="card-image-top"/>
              <div class="card-body">
                <div class="clearfix mb-3"> <span class="float-start badge rounded-pill bg-primary">Qty:${attr.Qty}</span> <span class="float-end price-hp">${attr.Price}kr</span> </div>
                    <h5 class="card-title ">${attr.Title}</h5>                  
                    </div>                               
                </div>
            </div>
            `;
            
        });
    }else{
        // Om det bara är ett objekt
        let object = myobject.data.attributes;
       
         output += `<div class="title"> Title: ${object.Title}</div>`;
         output += `<div> Description: ${object.Description}</div>`;
         output += `<div> Price: ${object.Price}</div>`;
         output += `<div> In stock: ${object.Qty}</div>`;
    }
     document.getElementById("output").innerHTML = output;
     
}

renderObjects();

async function getId(item){
    let product = item.id;
    console.log(product);
    let urlLocalhost = "http://localhost:1337/api/keyboards/"+product+"?populate=Image" ;
    let apiUrl = "http://localhost:1337";
    let stringResponse = await fetch (urlLocalhost);
    let myobject = await stringResponse.json();
    let output = '';
    let object = myobject.data.attributes;
       

        output = `
        <div class="container">
        <div class="card mb-6" style="max-width: 1980px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${apiUrl + object.Image.data.attributes.formats.medium.url}" class="img-fluid rounded-start">
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title">${object.Title}</h5>
              <p class="card-text">${object.Description}</p>              
              <p class="card-text"><span class="float-start badge rounded-pill bg-secondary">Qty:${object.Qty}</span> <span class="float-end price-hp">Price: ${object.Price}kr</span></p>
            </div>
          </div>
        </div>
      </div>
      </div>
        
        
        
        `

         document.getElementById("desc").innerHTML = output;
    }
     


