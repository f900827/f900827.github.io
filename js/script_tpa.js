document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const plusSign = document.querySelector('.plus-sign');
    const indicatorVertical = document.getElementById('indicator-vertical');
    const indicatorHorizontal = document.getElementById('indicator-horizontal');
    const textContainer = document.getElementById('text-container');
    const resultMessage = document.getElementById('resultMessage');
    let isExperimentRunning = false;
    let currentExpType = 1;  // 1: SR相容, 2: SR不相容, 3: 左右相容, 4: 左右不相容
    let trialCount = 0;
    const maxTrials = 25;
    let startTime, timeoutId;

    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        startExperiment();
    });

    indicatorVertical.addEventListener('click', function(event) {
        if (isExperimentRunning && event.target.classList.contains('circle')) {
            handleCircleClick(parseInt(event.target.getAttribute('data-index')), 'mouse');
        }
    });

    indicatorHorizontal.addEventListener('click', function(event) {
        if (isExperimentRunning && event.target.classList.contains('circle')) {
            handleCircleClick(parseInt(event.target.getAttribute('data-index')), 'mouse');
        }
    });

    // Handling touch input within the experiment area
    indicatorVertical.addEventListener('touchstart', function(event) {
        if (isExperimentRunning && event.target.classList.contains('circle')) {
            handleCircleClick(parseInt(event.target.getAttribute('data-index')), 'touch');
        }
    });

    indicatorHorizontal.addEventListener('touchstart', function(event) {
        if (isExperimentRunning && event.target.classList.contains('circle')) {
            handleCircleClick(parseInt(event.target.getAttribute('data-index')), 'touch');
        }
    });

    function startExperiment() {
        resetState();
        experiment.style.display = 'flex';
        isExperimentRunning = true;
        showPlusSign();
    }

    function resetState() {
        isExperimentRunning = false;
        plusSign.style.display = 'none';
        textContainer.style.display = 'none';
        resultMessage.style.display = 'none';
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
        const textPositionY = Math.random() < 0.5 ? '5%' : '95%';
        const textPositionX = Math.random() < 0.5 ? '5%' : '95%';
        currentExpType = Math.ceil(Math.random() * 4);

        switch (currentExpType) {
            case 1: // 上下相容
            case 2: // 上下不相容
                indicatorVertical.style.display = 'block';
                textContainer.style.top = textPositionY;
                textContainer.style.left = '50%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            case 3: // 左右相容
            case 4: // 左右不相容
                indicatorHorizontal.style.display = 'flex';
                indicatorHorizontal.style.bottom = '10px';
                indicatorHorizontal.style.left = '50%';
                indicatorHorizontal.style.transform = 'translateX(-50%)';
                textContainer.style.top = '50%';
                textContainer.style.left = textPositionX;
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
        }

        textContainer.style.display = 'block';

        startTime = Date.now();
        timeoutId = setTimeout(() => {
            handleNoReaction();
        }, 1500);
    }

    function handleNoReaction() {
        if (!isExperimentRunning) return;
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`No reaction. Response time: ${responseTime}ms`);

        textContainer.style.display = 'none';
        trialCount++;
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

        // 移動文本到正中間
        textContainer.style.top = '50%';
        textContainer.style.left = '50%';
        textContainer.style.transform = 'translate(-50%, -50%)';

        // 延遲500毫秒後隱藏文本
        setTimeout(() => {
            textContainer.style.display = 'none';
            trialCount++;
            if (trialCount < maxTrials) {
                setTimeout(startExperiment, 500);
            } else {
                alert('Experiment completed');
                window.location.reload();
            }
        }, 500);
    }
}