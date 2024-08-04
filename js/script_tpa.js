document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const plusSign = document.querySelector('.plus-sign');
    const indicatorVertical = document.getElementById('indicator-vertical');
    const indicatorHorizontal = document.getElementById('indicator-horizontal');
    const textContainer = document.getElementById('text-container');
    let isExperimentRunning = false;
    let trialCount = 0;
    const maxTrials = 24;
    let startTime, timeoutId;
    let directionCounts = { up: 0, down: 0, left: 0, right: 0 };

    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        startExperiment();
    });

    [indicatorVertical, indicatorHorizontal].forEach(indicator => {
        ['click', 'touchstart'].forEach(eventType => {
            indicator.addEventListener(eventType, function(event) {
                if (isExperimentRunning && event.target.classList.contains('circle')) {
                    const inputType = eventType === 'click' ? 'mouse' : 'touch';
                    handleCircleClick(parseInt(event.target.getAttribute('data-index')), inputType);
                }
            });
        });
    });

    function startExperiment() {
        resetState();
        experiment.style.display = 'flex';
        isExperimentRunning = true;
        showPlusSign();
    }

    function resetState() {
        isExperimentRunning = false;
        indicatorVertical.style.display = 'none';
        indicatorHorizontal.style.display = 'none';
    }

    function showPlusSign() {
        plusSign.style.display = 'block';
        setTimeout(hidePlusSign, 250);
    }

    function hidePlusSign() {
        plusSign.style.display = 'none';
        showText();
    }

    function showText() {
        let direction;
        let randomNum = Math.random();
        if (randomNum < 0.25 && directionCounts.up < 6) {
            direction = 'up';
        } else if (randomNum < 0.5 && directionCounts.down < 6) {
            direction = 'down';
        } else if (randomNum < 0.75 && directionCounts.left < 6) {
            direction = 'left';
        } else if (directionCounts.right < 6) {
            direction = 'right';
        } else {
            // If one direction reaches 6 times, re-roll until we get a valid direction
            showText();
            return;
        }

        directionCounts[direction]++;
        trialCount++;

        console.log(`Direction: ${direction}`);

        switch (direction) {
            case 'up':
                indicatorVertical.style.display = 'block';
                textContainer.style.top = '5%';
                textContainer.style.left = '50%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            case 'down':
                indicatorVertical.style.display = 'block';
                textContainer.style.top = '95%';
                textContainer.style.left = '50%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            case 'left':
                indicatorHorizontal.style.display = 'flex';
                textContainer.style.top = '50%';
                textContainer.style.left = '5%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            case 'right':
                indicatorHorizontal.style.display = 'flex';
                textContainer.style.top = '50%';
                textContainer.style.left = '95%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
        }

        textContainer.style.display = 'block';

        startTime = Date.now();
        timeoutId = setTimeout(() => {
            handleNoReaction();
        }, 2000);
    }

    function handleNoReaction() {
        if (!isExperimentRunning) return;
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`No reaction. Response time: ${responseTime}ms`);

        textContainer.style.display = 'none';
        if (trialCount < maxTrials) {
            setTimeout(startExperiment, 500);
        } else {
            alert('Experiment completed');
            window.location.reload();
        }
    }

    function handleCircleClick(index, inputType) {
        if (!isExperimentRunning) return;
        clearTimeout(timeoutId);

        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`Response time: ${responseTime}ms, Circle Index: ${index}`);
        console.log(`Input type: ${inputType}`); // Logging input type here

        // 移動文本到正中間
        textContainer.style.top = '50%';
        textContainer.style.left = '50%';
        textContainer.style.transform = 'translate(-50%, -50%)';

        // 延遲500毫秒後隱藏文本
        setTimeout(() => {
            textContainer.style.display = 'none';
            indicatorHorizontal.style.display = 'none';
            indicatorVertical.style.display = 'none';
            if (trialCount < maxTrials) {
                setTimeout(startExperiment, 500);
            } else {
                alert('Experiment completed');
                window.location.reload();
            }
        }, 500);
    }
}