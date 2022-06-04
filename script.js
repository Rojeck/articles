const openCreateModalButton = document.querySelector ('.menu__create-button'),
    articleTitleValue = document.querySelector ('#article-title'),
    articleUrlValue = document.querySelector ('#article-url'),
    articleDescriptionValue = document.querySelector ('#article-description'),
    articleTagsValue = document.querySelector ('#article-tags'),
    tagSeachValue = document.querySelector ('#tag-seach'),
    tagSeachBtn = document.querySelector ('.tag-seach-btn'),
    sendButton = document.querySelector ('.create-m__send-button'),
    tagBlock = document.querySelector ('.tag-block'),
    openTagsBtn = document.querySelector ('.tags-control-btn'),
    tagSeachModal = document.querySelector ('.tags-seach'),
    createModal = document.querySelector ('.create-m'),
    showM = document.querySelector ('.show-m'),
    articleContent = document.querySelector ('.articles'),
    checkNotiffication = document.querySelector('.check-notiffication'),
    articleDB = [];
   

class Article {
    constructor (url, title, description, tags) {
        this.url = url;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.id = getRandomID();
    }
}   
function getRandomID () {
      const min = 0,
      max = 10000,
      int = Math.floor(Math.random() * (max - min + 1)) + min;
      return int.toString(36);
    }
    
const showModal = (modalID) => {
    modalID.classList.remove('deactive');
};
const hideModal = (modalID) => {
    modalID.classList.add('deactive');
    document.body.style.overflow = '';
    showM.innerHTML = '';

};
openCreateModalButton.addEventListener('click', ()=>{
    showModal(createModal);
    document.body.style.overflow = 'hidden';
});
document.addEventListener ('keydown', (e) => {
    if (e.code === 'Escape' && !(createModal.classList.contains === ('deactive'))) {
        hideModal(createModal);
        hideModal(showM);
    }
});

createModal.addEventListener ('click', (e)=> {
    if (e.target === createModal){
       hideModal(createModal);
       
    }
});
showM.addEventListener ('click', (e)=> {
    if (e.target === showM){
       hideModal(showM); 
    }
});
//видалення статті
 function deleteArticle (id) {
     console.log(id);
    fetch (`https://my-cool-roject-project.herokuapp.com/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(data => data.json())
    .then(data => {
        console.log(data);
    }).then(()=> {
        if (tagSeachValue.value == ''){
            
        }
        else {
            render(createTemporaryDB());
        }
    })
    
     
 }
// Створити вікно зі всією статтею і показати його
function showFullArticle (id) {
    fetch (`https://my-cool-roject-project.herokuapp.com/posts/${id}`)
    .then (data => data.json())
    .then (data => {
        showM.innerHTML += `
        <div class="show-m__block modal-block">
                <div class="close-button">
                    <img src="" alt="">
                </div>
               <div class="show-m__content">
                   <div class="show-m__image">
                       <img src="${data.url}" alt="">
                   </div>
                    <h1>${data.title}</h1>
                    <p>${data.description}</p>    
               </div>
               <div class="tag-box">
                ${tagHtmlbox(data)}
            </div>
               
            </div>`;
    })
    .then(()=>{
        showModal(showM);
    })
}
// зарендерити статті, приймає тимчасову БД або постійну БД в залежності від пошуку по тагах чи ні
function render () {
    articleContent.innerHTML = '';
    fetch ('https://my-cool-roject-project.herokuapp.com/posts/')
    .then (data => data.json())
    .then (data => {
        data.forEach (element => {
            createItem(element);
        })
    })
    .then(()=>{
        addListenersToItems();
    })
}
//Створити статтю в хтмлі
function createItem (element) {
    const item = document.createElement('div');
        item.classList.add('item');
        item.id = element.id;
        item.innerHTML += `
        <div class="item__img">
            <img src="${element.url}" alt="">
        </div>
        <div class="item__title">${element.title}</div>
        <div class="item__description">${element.description}</div>
        <div class="delete-button deactive"></div>
        <div class="item__show-button button">Show all</div>
        
        `
        const deleteBtn = item.querySelector ('.delete-button');
        item.addEventListener('mouseover', ()=>{
            deleteBtn.classList.remove('deactive');
            tagBlock.innerHTML += `# ${tagHtmlboxH(element)}`;
            
        })
        item.addEventListener('mouseout', ()=>{
            deleteBtn.classList.add('deactive');
            tagBlock.innerHTML = '';
        })
        articleContent.append(item);
}
// Запушити таги в якийсь елемент (в даному випадку в вікно перегляду статті)
function tagHtmlbox (element) {
    return (element.tags.map((item) => {
        return  `<span class="tag-box__item">${item}</span>` 
    }).join(''));
}
// Запушити таги в якийсь елемент (в даному випадку в хедер)
function tagHtmlboxH (element) {
   let i = 0;
    return (element.tags.map((item) => {
        i++;
        if (i == element.tags.length){
            return  `<span class="tag-item">${item}</span>` 
        }
        else {
            return  `<span class="tag-item">${item}, </span>` 
        }  
    }).join(''));
}
// Створення нової статті в БД і очистка полів
const sendToDB = (title,url,description,tags) => {
        fetch ('https://my-cool-roject-project.herokuapp.com/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new Article (url,title,description,tags))
        })
        .then(data => data.json())
        .then(data => {
            render();
        })
        articleUrlValue.value = '';
        articleDescriptionValue.value = '';
        articleTitleValue.value = '';
        articleTagsValue.value = '';
        
};
// отримати елементи 
const getCreateValues = () => { 
        return [articleTitleValue.value, articleUrlValue.value,articleDescriptionValue.value, withoutBlankElements(articleTagsValue.value.replace(/\s/g, '').split(','))];
}
// видалення пустих тагів
function withoutBlankElements (array) {
 return (array.filter(element => element != ''))
}


// провірка на помилки

const valueCheck = (title, url, description, tags) => {
    if (title.length > 14) {
        showNotiffication('Title must be less than 14 symbols');
    }
    else if (title.length < 4) {
        showNotiffication('Title must be more than 4 symbols');
    }
    else if (url < 5) {
        showNotiffication('Invalid URL');
    }
    else if (description < 25) {
        showNotiffication('Description must be more than 25 symbols');
    }
    else {
        sendToDB(title, url, description, tags);
        hideModal(createModal);
        render(); 
    }
}
// Кнопка відправити
sendButton.addEventListener('click', () => {
    valueCheck(...getCreateValues());
});

// відправити клавішею Enter

document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && !(createModal.classList.contains === ('deactive'))) {
        sendToDB(...getCreateValues());
        hideModal(createModal);
        
  //    valueCheck(...getCreateValues());  
    }
});

// показати нотіфікейшн з помилкою
let notifficationIndicator = false;
function showNotiffication (notiffication) {
    checkNotiffication.textContent = notiffication;
    checkNotiffication.classList.remove('deactive');
    if (!notifficationIndicator){
        setTimeout(() => {
            checkNotiffication.classList.add('deactive');
            notifficationIndicator = false;
    }, 2000);}
    notifficationIndicator = true;
}

// Пошук по тагах

tagSeachValue.addEventListener ('input', ()=> {
    if (tagSeachValue.value === '') {
        render();
    }
    else {
        render(createTemporaryDB());
    }
})
//Провірка чи є елемент в массиві
function contains(where, what){
    for(var i=0; i<what.length; i++){
        if(where.indexOf(what[i]) == -1) return false;
    }
    return true;
}
// Тимчасова БД з відфільтрованими статтями по тагах
//   function createTemporaryDB () {
//       let filterArray = withoutBlankElements(tagSeachValue.value.replace(/\s/g, '').split(','));
//       return (articleDB.filter(element => contains(element.tags,filterArray)));
//   }
//   // Кнопка рефреш
//   tagSeachBtn.addEventListener('click', ()=> {
//       tagSeachValue.value = '';
//       render();
//   })
//   // Кнопка пошуку тагів
//   openTagsBtn.addEventListener('click', () => {
//       openTagsBtn.classList.toggle('anim');
//       tagSeachModal.classList.toggle('deactive');
//       tagBlock.classList.toggle('deactive');
//   })
// Добавити слухачі для кнопок елементів з привязкою до їх ІД в БД
function addListenersToItems () {
    const items = document.querySelectorAll('.item');
    items.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('button')){
            showFullArticle(element.id);
            }
            else if (e.target.classList.contains('delete-button')){
              element.remove();
             deleteArticle(element.id); 
            }
        })
    });
}
render();

// fetch ('https://my-cool-roject-project.herokuapp.com/posts/0', {
//     method: 'DELETE'
// }).then(d => {
//     console.log(fine);
// })