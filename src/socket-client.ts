import {Manager, Socket} from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager =  new Manager('http://localhost:3001/socket.io/socket.io.js', {
    extraHeaders: {
      hola: 'mundo',
      authentication: token
    }
  })

  socket?.removeAllListeners();
  socket = manager.socket('/');

  addListener();
}


const addListener = () => {
  const serverStatusLevels = document.querySelector<HTMLElement>('#server-status')!; 
  const clientsUl = document.querySelector<HTMLUListElement>('#clients-Id')!;
  const messageForm = document.querySelector<HTMLFormElement>('#message-form');
  const messageInput = document.querySelector<HTMLInputElement>('#message-input');
  const messageUl = document.querySelector<HTMLUListElement>('#messages-ul')

  socket.on('connect', () => {
    serverStatusLevels.innerHTML= 'connected';
  })

  socket.on('disconnect', () => {
    serverStatusLevels.innerHTML= 'disconnected';
  })

  socket.on('clients-updated', (clients: string[]) => {
    let clientHtml = '';

    clients.forEach((el) => {
      clientHtml += `<li>${el}</li>`
    })

    clientsUl.innerHTML= clientHtml;
  })

messageForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  if(messageInput!.value.trim().length <= 0) return;

  socket.emit('message-from-client', {
    id: 'Yooo',
    message: messageInput?.value
  })
  messageInput!.value = '';
})

  socket.on('message-from-server', (payload: {fullName: string, message: string}) => {
    const newMessage = `
      <li>
        <strong>${payload.fullName}</strong>
        <span>${payload.message}</span>
      </li>
    `
    const li = document.createElement('li');
    li.innerHTML = newMessage;

    messageUl?.append(li);
  })
}