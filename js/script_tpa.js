document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const plusSign = document.querySelector('.plus-sign');
    const indicator = document.getElementById('indicator');
    const textContainer = document.getElementById('text-container');
    const resultMessage = document.getElementById('resultMessage');
    const textLines = textContainer.querySelectorAll('.text-line');
    let isExperimentRunning = false;
    let currentExpType = 1;  // 1: SR相容, 2: SR不相容
    let trialCount = 0;
    const maxTrials = 25;

    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        startExperiment();
    });

    // Handling touch input within the experiment area
    experiment.addEventListener('touchstart', function(event) {
        if (isExperimentRunning) {
            handleTouch(event);
        }
    });

    // Adding click event listeners to circles
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        circle.addEventListener('click', function() {
            handleCircleClick(index);
        });
    });

    function startExperiment() {
        resetState();
        experiment.style.display = 'flex';
        isExperimentRunning = true;
        showPlusSign();
    }

    function resetState() {
        trialCount = 0;
        isExperimentRunning = false;
        plusSign.style.display = 'none';
        textContainer.style.display = 'none';
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
        textContainer.style.top = textPositionY;
        textContainer.style.transform = 'translateY(-50%)'; // 垂直居中于指定位置
        textContainer.style.display = 'block';
    }

    function handleCircleClick(index) {
        let isCorrect = false;
        const textPositionY = textContainer.style.top;

        if (currentExpType === 1) {
            if (index === 0) {
                isCorrect = textPositionY === '5%';
            } else if (index === 2) {
                isCorrect = textPositionY === '95%';
            }
        } else if (currentExpType === 2) {
            if (index === 0) {
                isCorrect = textPositionY === '95%';
            } else if (index === 2) {
                isCorrect = textPositionY === '5%';
            }
        }

        // 移動文本到正中間
        textContainer.style.top = '50%';
        textContainer.style.transform = 'translateY(-50%)'; // 垂直居中于指定位置

        // 延遲500毫秒後隱藏文本並顯示結果消息
        setTimeout(() => {
            textContainer.style.display = 'none';
            resultMessage.innerText = isCorrect ? "Correct!" : "Incorrect!";
            resultMessage.style.display = 'block';

            // 再延遲500毫秒後隱藏結果消息
            setTimeout(() => {
                resultMessage.style.display = 'none';
            }, 500);
        }, 500);
    }
}