class ChartBuilder {
    constructor(chartData) {
        this.chartData = chartData;
    }

    renderBarChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var subjects = this.chartData.subjects;
        var data = this.chartData.data;

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: Object.keys(data).map((subject) => ({
                    label: subject,
                    data: data[subject],
                    backgroundColor: getRandomColor(),
                    borderWidth: 1,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#000'
                }))
            },
            options: {
                title: {
                    display: true,
                    text: 'Student Scores by Subject',
                    fontSize: 20
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        fontColor: '#000'
                    }
                },
                layout: {
                    padding: {
                        left: 50,
                        right: 0,
                        bottom: 0,
                        top: 0
                    }
                },
                tooltips: {
                    enabled: true
                }
            }
        });
    }

    renderAverageChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var subjects = this.chartData.subjects;
        var data = this.chartData.data;

        var averages = subjects.map(subject => {
            var subjectData = data[subject];
            var sum = subjectData.reduce((acc, mark) => acc + mark, 0);
            return sum / subjectData.length;
        });

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Averages'],
                datasets: [{
                    label: 'Average Scores',
                    data: averages,
                    backgroundColor: '#FFC107',
                    borderWidth: 1,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#000'
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Average Scores by Subject',
                    fontSize: 20
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                legend: {
                    display: false
                },
                layout: {
                    padding: {
                        left: 50,
                        right: 0,
                        bottom: 0,
                        top: 0
                    }
                },
                tooltips: {
                    enabled: true
                }
            }
        });
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
