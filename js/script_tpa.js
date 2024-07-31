document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const dot = document.querySelector('.dot');
    const pluSign = document.querySelector('.plus-sign');
    const indicator = document.getElementById('indicator');
    const textContainer = document.getElementById('text-container');
    const resultMessage = document.getElementById('resultMessage');
    let trialCount = 0;
    const maxTrials = 25;
    let isExperimentRunning = false;
    let currentExpType = 1;  // 1: SR相容, 2: SR不相容
    let isNoGoTrial = false;

    // Start experiment 
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (!isExperimentRunning) {
                startExperiment();
            }
        }
    });
    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        startExperiment();
    });
    // Handling arrow keys for input
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
            event.preventDefault();
            
        }
    });

    // Handling touch input within the experiment area
    experiment.addEventListener('touchstart', function(event) {
        if (isExperimentRunning) {
            handleTouch(event);
        }
    });

    function startExperiment() {
        //resetState();
        startButton.style.display = 'none';
        experiment.style.display = 'flex';
        isExperimentRunning = true;
        showPlusSign();
    }

    function showPlusSign() {
        pluSign.style.display = 'block';
        setTimeout(hidePlusSign, 250);
    }

    function hidePlusSign() {
        pluSign.style.display = 'none';
        showDot();
    }

    function showDot() {
        if (trialCount % 5 === 0) {
            dot.style.top = '50%';
            isNoGoTrial = true;
        } else {
            const dotPositionY = Math.random() < 0.5 ? '5%' : '95%';
            dot.style.top = dotPositionY;
            isNoGoTrial = false;
        }
        dot.style.display = 'block';
        const startTime = Date.now();

        setTimeout(() => {
            dot.style.display = 'none';
            showText(startTime, dot.style.top);
        }, 150);
    }

    function showText(startTime, dotPositionY) {
        textContainer.style.top = '10%';
        textContainer.style.display = 'block';
        //textContainer2.style.top = '90%';
        //textContainer2.style.display = 'block';
        
        let isClickHandled = false;
        let timeoutId;
        
        function handleKeyPress(event) { 
            if (isClickHandled) return;

            if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
                event.preventDefault();
                isClickHandled = true;

                if (isNoGoTrial) {
                    handleNogoTrialResult(startTime, false);
                } else {
                    const keyDirection = event.code === 'ArrowUp' ? 'Up' : 'Down';
                    handleResult(null, dotPositionY, startTime, 'arrow', keyDirection);
                }
            }
        }
    }
}