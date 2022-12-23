import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;


//function to load responses.
function loader(element)
{
  element.textContent = '';

   loadInterval = setInterval(() => {
    element.textContent += '.';
 
  if(element.textContent == '....') 
  {
   element.textContent = '';
  }
  },300)
}

//function to type text.
function typeText(element,text)
{
   let index = 0 ;

   let interval = setInterval(()=>{
    if(index < text.length)
    {
         element.innerHTML += text.charAt(index);
         index++;
    }
    else
    {
      clearInterval(interval);
    }
   },20)
}

//function to generate unique id.
function generateUniqueId()
{
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalstring = randomNumber.toString(16);


    return `id-${timestamp}-${hexadecimalstring}`;
}

//function chatstripe

function chatStripe(isAI, value,uniqueid)
{
  return
  (
    `<div class="wrapper ${isAI && 'ai'}">
    <div class="chat">
    <div class="profile">
    <img
    src="${isAI ? bot:user}"
    alt="${isAI ? 'bot':'user'}";
    />
    </div>
    <div class="message" id=${uniqueid}>${value}</div>
    </div>
    </div>`
  )
}

const handleSubmit = async(e) =>
{
   e.preventDefault();

   const data = new FormData(form);

   //user's chat stripe
   chatContainer.innerHTML += chatStripe(false,data.get('prompt'));
   form.reset();

   //bot's unique chat stripe
   const uniqueid = generateUniqueId();
   chatContainer.innerHTML += chatStripe(true,"",uniqueid);

   chatContainer.scrollTop = chatContainer.scrollHeight;
  
   const messageDiv =  document.getElementById(uniqueid);

   loader(messageDiv);
  
   const response = await fetch('http://localhost:5000',
   {
   method:'POST',
   headers:{
    'Content-Type':'application/json',
   },
   body:JSON.stringify({
    prompt:data.get('prompt')
   })
  });
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';
   
    if(response.ok)
    {
      const data = await response.json();
      const parseData = data.bot.trim();

      typeText(messageDiv,parseData);
    } else
    {
      const err = await response.text();

      messageDiv.innerHTML = "Something went wrong";

      alert(err);
    }
}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keycode === 13)
  {
    handleSubmit(e);
  }
});