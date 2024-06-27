document.addEventListener('DOMContentLoaded', () => {

    fetch(window.location.href, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain; charset=utf-8', 'Problems': "Solved-Unsolved"
        },
    })
    .then(response => response.json())
    .then(data => {

        const progressData = {
            easy: parseInt(data.EasySolved),
            easy_ns: parseInt(data.EasyUnsolved),
            medium: parseInt(data.MediumSolved),
            medium_ns: parseInt(data.MediumUnsolved),
            hard: parseInt(data.HardSolved),
            hard_ns: parseInt(data.HardUnsolved)
        };
    
        // Create chart
        const ctx = document.getElementById('progressChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Easy not solved', 'Medium', 'Medium not solved', 'Hard', 'Hard not solved'], 
                datasets: [{
                    data: [progressData.easy, progressData.easy_ns, progressData.medium, progressData.medium_ns, progressData.hard, progressData.hard_ns],
                    backgroundColor: ['#059c00', '#415c45', '#ffb50a', '#949151', '#c71c02', '#b35959'],
                    borderColor: ['#3c3c3c'],
                    borderWidth: 8,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: true,
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
