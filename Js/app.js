class Table{ 
    constructor(){
        this.UI = {
            modal : document.getElementById('overlay'),
            modalbox : document.querySelector('.dialog__content'),
            modalEscapeBtn : document.querySelector('.fa-close'),
            wiki_data : document.querySelector('.wiki_data'),
            elements : document.querySelectorAll('div.element'),
            elementDetailsCloseup : document.getElementById('Closeup'),
            elementDetailsCloseup2 : document.getElementById('Closeup2'),
            CloseupELement2 : document.getElementById("CloseupELement2"),
            elementElectronconfig2 : document.getElementById("Electron2")
        }
        this.elementColor = {
            "Metalloid" : "#93d9f5",
            "Nonmetal": "#c0d7f0",
            "Halogen" : "#22eecc",
            "Noble-Gas": "#e1cfe5",
            "Alkali-Metal" : "#f7aac0",
            "Alkaline-Earth": "#ffdca9",
            "Transition-Metal" : "#ddbbbb",
            "Post-Transition-Metal" : "#99ddcc",
            "Lanthanoids" : "#ffbb99",
            "Actinoid" : "#fabfe2"
        }
        this.currentElIndex = 0;
    }
    
    //Sets up table UI
    createTable(){
        //converts Nodelist into an array allowing for a functional programming approach
        const elementList = Array.prototype.slice.call(this.UI.elements,0);
        elementList.forEach(this.createEl);
    }
    
    econfigSplit(econfig){
        econfig.slice();
        econfig = econfig.replace(/["' ()]|[\[\]']+/g,'');
        econfig = econfig.split(",");
        let result = "<small>";
        econfig.forEach(function(electron){
            return result+=electron+"<br>"
        })
        result += "</small>";
        return result
    }
    
    createEl(El,item){
        //Because this method is being called from anon function from  createTable 'this' (equally table instance) is lost.
        const table = Table.prototype;
        El.innerHTML =`<big><span class="Atomic-Number">${El.dataset.number}</span>
                       <h3>${El.dataset.symbol}</h3>
                       <span class="element-name">${El.dataset.name}</span> 
                      ${El.dataset.mass ?  
                      `<span class="Atomic-Mass">${El.dataset.mass}</span></big>${table.econfigSplit(El.dataset.econfig)}`
                     : `</big>` }`
    }
    
    examineElOnHover(el){
         const group = document.getElementById(el.dataset.category);
         el.classList.toggle('highlight');
         group.classList.toggle("highlight-1");
         this.displayElementDetails(el);
         this.getElementDetails(el);
    }
    
     displayElementDetails(el){
        const elementDetails = this.UI.elementDetailsCloseup;
        const elementDetails2 = this.UI.elementDetailsCloseup2;
        if(el.dataset.econfig){
            elementDetails.style.display =='none' ? elementDetails.style.display ='block' : elementDetails.style.display = 'none';
            elementDetails2.style.display == 'block' ? elementDetails2.style.display = 'none' : elementDetails2.style.display = 'block';
        } else {
            elementDetails.style.display == 'block' ? elementDetails2.style.display = 'none' : elementDetails2.style.display = 'none';
        }
     }
    
    getElementDetails(el){
        const elementMainDetails = this.UI.CloseupELement2;
        const elementSubDetails = this.UI.elementElectronconfig2;
        elementMainDetails.innerHTML = `<big><span>${el.dataset.number}'</span>
                                     <h2>${el.dataset.symbol}</h2>
                                     <span>${el.dataset.name}</span>
                                     <span>${el.dataset.mass}</span></big>`
        elementSubDetails.innerHTML = el.dataset.ecf;
    }
    
    elementGroupSelect(el){
        el.classList.toggle('highlight-1');
        const selected = document.querySelectorAll(".element[data-category= "+el.dataset.category+"");
        const deselected = document.querySelectorAll(".element:not([data-category= "+el.dataset.category+"");
        const selectedList = Array.prototype.slice.call(selected,0);
        const deselectedList = Array.prototype.slice.call(deselected,0);
        deselectedList.forEach(function(el){
           el.classList.toggle("fadeout");
        });
        selectedList.forEach(function(el){
           el.classList.toggle("highlight-1");
        });
    }
    
    displayModal(el){
        this.getWikiData(el);
        this.UI.modal.style.display = 'block';
        this.UI.modalbox.style.display = 'block';
    }
    
    getWikiData(el){
       const url = `https://en.wikipedia.org/w/api.php?origin=*&prop=extracts|pageimages&pithumbsize=700&piprop=thumbnail|name&format=json&action=query&exintro=&titles=${el.name}`;
       fetch(url).then((resp) =>{
//      console.log(resp); //console.logs the HTTP header response data i.e. status-code, body, info, url etc
        return resp.json() // returns the actual content retrieved from get request i.e. wikipedia info
        }).then((data)=> {this.displayWikiData(data.query.pages,el)}) //console.logs actual JSON data from GET request in the form of a JS Object
    }
    
    displayWikiData(data,el){
        const wikiObjKey = Object.keys(data);
        const wikiData = data[wikiObjKey];
        let wikiInfo = `<h2>${el.number}.${el.name}<span>(${el.symbol})</span></h2>
                        <div class="details"><span>Group ${el.group}, Period ${el.period}</span>
                        <span>Atomic Weight ${el.mass} u</span>
                        <span>${el.state} at room temperature</span>
                        <span>Melting point: ${el.meltingpoint} ${el.meltingpoint ==='Unknown' ? `` : `K` }
                        Boiling point: ${el.boilingpoint} ${el.boilingpoint ==='Unknown' ? `` : `K` } </span></div>
                        ${wikiData.thumbnail ? `<img src=${wikiData.thumbnail.source}>` : `` }
                        ${wikiData.extract.replace(/7000100800000000000♠|7004225900000000000♠|6992500000000000000♠|6994148000000000000♠|6994153000000000000♠|6994155000000000000♠/gi,'')}
                        <br/><a href="https://en.wikipedia.org/wiki/${el.name}">Further information</a>`;
        this.currentElIndex = el.number;
        this.UI.wiki_data.innerHTML = wikiInfo;
        this.UI.wiki_data.style.borderLeft = `5px solid ${this.elementColor[el.category]}`;
        this.UI.modal.style.display = 'block';
        this.UI.modalbox.style.display = 'block';
    }
    
    displayNextElement(){
        const currentElementIndex = parseInt(this.currentElIndex-1);
        const nextElementIndex = (currentElementIndex+1) % 118;
        const nextElement = document.querySelector(`.element[data-number='${nextElementIndex+1}']`)
        this.getWikiData(nextElement.dataset);
       
    }
    
    displayPreviousElement(){
        const currentElementIndex = parseInt(this.currentElIndex-1);
        const previousElementIndex = (currentElementIndex + (119-1)) % 119;
        const previousElement = document.querySelector(`.element[data-number='${previousElementIndex+1}']`);
        this.getWikiData(previousElement.dataset);
        console.log(previousElement.dataset);
    }
}


class Modal{
    constructor(){
        this.UI ={
            modal : document.getElementById('overlay'),
            modalbox : document.querySelector('.dialog__content'),
            wiki_data :document.querySelector('.wiki_data')
        }
    }
    closeModal(){
        this.UI.wiki_data.innerHTML = '';
        this.UI.modal.style.display = 'none';
        this.UI.modalbox.style.display = 'none';
    }
}



document.addEventListener('DOMContentLoaded',function(){
    const table = new Table();
    const modal = new Modal();

    table.createTable();

    document.getElementById('Table').addEventListener('mouseover',function(e){
        if(e.target.classList.contains('element')){
        table.examineElOnHover(e.target);
        }
    })

    document.getElementById('Table').addEventListener('mouseout',function(e){
        if(e.target.classList.contains('element')){
        table.examineElOnHover(e.target);
        }
    })

    document.getElementById('Table').addEventListener('click',function(e){
        if(e.target.classList.contains('element') && e.target.dataset.econfig){
        table.getWikiData(e.target.dataset);
        }
    })


    document.querySelector('.div-table').addEventListener('mouseover',function(e){
       if(e.target.classList.contains('group')){
          table.elementGroupSelect(e.target);
       }   
    });

    document.querySelector('.div-table').addEventListener('mouseout',function(e){
       if(e.target.classList.contains('group')){
          table.elementGroupSelect(e.target);
       }   
    });

    document.querySelector('.dialog__content').addEventListener('click',function(e){
       if(e.target.classList.contains('fa-close')){
           modal.closeModal();
       } else if(e.target.classList.contains('fa-arrow-circle-o-right')){
            table.displayNextElement();
       } else if (e.target.classList.contains('fa-arrow-circle-o-left')){
           table.displayPreviousElement();
       }
    });

    window.addEventListener("mouseup", function (e){
       if(e.target === overlay ){
           modal.closeModal();
       }
    });
})
