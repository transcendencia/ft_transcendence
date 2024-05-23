const statsButtons = document.querySelectorAll('.statButton');
const colorClicked = '#5d75ff47';

statsButtons.forEach((button) => {
    button.addEventListener('click', () => {
        console.log("pressed");
        statsButtons.forEach((button) => {
            button.style.backgroundColor = 'transparent';
        });
        button.style.backgroundColor = colorClicked;
    });
});