//clonando o models do html e passando as pizza que estão no json pizza.js
let cart = [];
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
let modalKey = 0;


let modalQt = 1;

pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true); //esta pegando no html e esta clonando o html

  pizzaItem.setAttribute('data-Key', index); //esta numerando cada pizza

  //colocando as informações da pizza no models
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('a').addEventListener('click', (e)=>{
    e.preventDefault(); //esta pegando o evento de click, e esta tirando o padrão dele, que seria atualizar a pagina
    let key = e.target.closest('.pizza-item').getAttribute('data-key') // closest vai a partir do elemento a, achar o que esta no parametro mais proximo a partir dele 
    c('.pizzaWindowArea').style.display = 'flex';
    modalQt = 1;
    modalKey = key;

    //preenchendo as informações no modal
    c('.pizzaInfo H1').innerHTML = pizzaJson[key].name;
    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    c('.pizzaInfo--size.selected').classList.remove('selected');
    c('.pizzaInfo--qt').innerHTML = modalQt
    cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
      if(sizeIndex == 2){
        size.classList.add('selected')
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

  })

  c('.pizza-area').append(pizzaItem); //esta incluindo uma por uma
});


//Eventos do MODAL
function closeModal(){
  c('.pizzaWindowArea').style.display = 'none';
}

//adiconando e removendo quantidade de pizza
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt
})

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if (modalQt>1){
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt
  } 
})

cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
  size.addEventListener('click',(e)=>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  })
  });


  c('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key');

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
      cart[key].qt += modalQt
    }
    else{
      cart.push({
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
      });

    }
    updaterCart();
    closeModal();
});

c('.menu-openner ').addEventListener('click', ()=>{
  if (cart.length > 0){
    c('aside').style.left = '0';
  }
})
c('.menu-closer').addEventListener('click',()=>{
  c('aside').style.left = '100vw';
})

function updaterCart(){

  c('.menu-openner span').innerHTML = cart.length;

  if ( cart.length > 0){
    c('aside').classList.add('show');
    c('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for( let i in cart){
      let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = c('.models .cart--item').cloneNode(true);

      let pizzaSizeName;
      if(cart[i].size == 0){
        pizzaSizeName = 'P'
      }else if(cart[i].size == 1){
        pizzaSizeName = 'M'
      }else if(cart[i].size == 2){
        pizzaSizeName = 'G'
      }      
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      
      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
        if(cart[i].qt > 1){
          cart[i].qt--;
        }else {
          cart.splice(i,1);
        }
        updaterCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
        cart[i].qt++;
        updaterCart();
      })

      c('.cart').append(cartItem)

    }

    desconto = subtotal *0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


  } else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }

}