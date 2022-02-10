$('#start').submit(function(event) {
    console.log('hello')
    event.preventDefault();
    window.location.href = '/verify-start.html';
});