
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.tutorial-step');
    const arrows = document.querySelectorAll('.arrow');
    const finishScreen = document.getElementById('finish');

    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const target = arrow.getAttribute('data-target');
            steps.forEach(step => step.classList.remove('active'));
            if (target === 'finish') {
                finishScreen.classList.add('active');
            } else {
                document.getElementById(target).classList.add('active');
                finishScreen.classList.remove('active');
            }
        });
    });

    // Initialize the first step
    document.getElementById('step-1').classList.add('active');
});
