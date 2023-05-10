const socket = io();


socket.on('update-messages', function(messages) {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';
    messages.forEach(function(msg) {
      const li = document.createElement('li');
      li.textContent = msg.user + ' escribio: ' + msg.message;
      messagesList.appendChild(li);
    });
  });
// Handle form submit
const addMessageForm = document.getElementById('add-message-form');
addMessageForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const userEmailInput = document.getElementById('user-email');
  const userMessageInput = document.getElementById('user-message');


  const userEmail = userEmailInput.value.trim();
  const userMessage = userMessageInput.value.trim();
  socket.emit('add-message', { user: userEmail, message: userMessage });

  userEmailInput.value = '';
  userMessageInput.value = '';
});