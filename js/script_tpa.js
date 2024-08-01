document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const circles = document.querySelectorAll('.circle');
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
    let startTime, timeoutId;

    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        startExperiment();
    });

    indicator.addEventListener('click', function(event) {
        if (isExperimentRunning && event.target.classList.contains('circle')) {
            handleCircleClick(Array.from(indicator.children).indexOf(event.target), 'mouse');
        }
    });
    
    // Handling touch input within the experiment area
    indicator.addEventListener('touchstart', function(event) {
        if (isExperimentRunning && event.target.classList.contains('circle')) {
            handleCircleClick(Array.from(indicator.children).indexOf(event.target), 'touch');
        }
    });
   
  

    function startExperiment() 
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
        indicator.style.display = 'block';
        textContainer.style.top = textPositionY;
        textContainer.style.transform = 'translateY(-50%)'; // 垂直居中于指定位置
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

        // Display the result as "Incorrect" since no response was given within 1500ms
        resultMessage.innerText = "Incorrect!";
        resultMessage.style.display = 'block';
        textContainer.style.display = 'none';

        // Hide result message after 500ms
        setTimeout(() => {
            resultMessage.style.display = 'none';
            trialCount++;
            if (trialCount < maxTrials) {
                setTimeout(startExperiment, 500);
            } else {
                alert('Experiment completed');
                window.location.reload();
            }
        }, 500);
    }

    function handleCircleClick(index, inputeType) {
        if (!isExperimentRunning) return;
        clearTimeout(timeoutId);

        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
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

     function resetExperiment(onClick, inputType ) {
        experiment.style.display = 'none';
        textContainer.style.display = 'none';
        experiment.removeEventListener('click', onClick);
        trialCount++;
        isExperimentRunning = false;
        if (trialCount < maxTrials) {
            setTimeout(startExperiment, 500);
        } else {
            alert('Experiment completed');
            window.location.reload();
        }
    }


}
