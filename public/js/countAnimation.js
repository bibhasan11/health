const counters = document.querySelectorAll('.h3');
const speed = 200;

counters.forEach(countUp => {
    const update = () => {
        const target = parseInt(countUp.getAttribute('data-target'));
        const initial = parseInt(countUp.innerHTML);
        const increase = target / speed;
        
        if(initial < target){
            countUp.innerHTML = initial + increase;
            setTimeout(update, 5);
        } else{
            countUp.innerHTML = target;
        }
    }
    update();
});