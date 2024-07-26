document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const dot = document.querySelector('.dot');
    const pluSign = document.querySelector('.plus-sign');
    const textContainer = document.getElementById('text-container');
    const textContainer2 = document.getElementById('text-container2');
    const resultMessage = document.getElementById('resultMessage');
    let trialCount = 0;
    const maxTrials = 25;
    let isExperimentRunning = false;
    let currentExpType = 2;  // 1: SR相容, 2: SR不相容
    let isCentralTrial = false;

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (!isExperimentRunning) {
                startExperiment();
            }
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
            event.preventDefault();
            if (isExperimentRunning) {
                handleArrowKeyPress(event.code);
            }
        }
    });

    experiment.addEventListener('touchstart', function (event) {
        if (isExperimentRunning) {
            handleTouch(event);
        }
    });

    function startExperiment() {
        resetState();
        startButton.style.display = 'none';
        experiment.style.display = 'flex';
        isExperimentRunning = true;
        showPlusSign();
    }

    function showPlusSign() {
        pluSign.style.display = 'block';
        setTimeout(hidePlusSign, 500);
    }

    function hidePlusSign() {
        pluSign.style.display = 'none';
        showDot();
    }

    function showDot() {
        dot.style.top = '50%';
        dot.style.left = '50%';
        isCentralTrial = trialCount % 5 === 0;

        if (isCentralTrial) {
            dot.style.backgroundColor = 'black';
        } else {
            dot.style.backgroundColor = Math.random() < 0.5 ? 'red' : 'blue';
        }

        dot.style.display = 'block';
        const startTime = Date.now();

        setTimeout(() => {
            dot.style.display = 'none';
            showText(startTime, dot.style.backgroundColor);
        }, 150);
    }

    function showText(startTime, dotColor) {
        textContainer.style.top = '10%';
        textContainer.style.display = 'block';
        textContainer2.style.top = '90%';
        textContainer2.style.display = 'block';

        let isClickHandled = false;
        let timeoutId;

        function handleKeyPress(event) {
            if (isClickHandled) return;

            if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
                event.preventDefault();
                isClickHandled = true;

                if (isCentralTrial) {
                    handleCentralTrialResult(startTime, false);
                } else {
                    const clickY = event.code === 'ArrowUp' ? experiment.clientHeight / 4 : (3 * experiment.clientHeight) / 4;
                    handleResult(clickY, dotColor, startTime, 'arrow');
                }
            }
        }

        function onClick(event) {
            if (isClickHandled) return;
            isClickHandled = true;

            if (isCentralTrial) {
                handleCentralTrialResult(startTime, false);
            } else {
                let clickY = event.clientY - experiment.getBoundingClientRect().top;
                handleResult(clickY, dotColor, startTime, 'click');
            }
        }

        function handleTouch(event) {
            if (isCentralTrial) {
                handleCentralTrialResult(startTime, false);
            } else {
                const clickY = event.touches[0].clientY - experiment.getBoundingClientRect().top;
                handleResult(clickY, dotColor, startTime, 'touch');
            }
        }

        function handleResult(clickY, dotColor, startTime, inputType) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            clearTimeout(timeoutId);

            const isCorrect = checkCorrect(dotColor, clickY);
            const message = isCorrect ? 'Correct' : 'Incorrect';

            resultMessage.textContent = `${message}\nReaction Time: ${responseTime} ms\nDot Color: ${dotColor}\nClick Position: Y=${clickY}px`;
            showResultMessage(clickY);
        }

        function handleCentralTrialResult(startTime, isTimeout) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            clearTimeout(timeoutId);

            let message = 'Incorrect';
            if (isTimeout) {
                message = 'Correct\nNo reaction within 3 seconds';
            } else {
                message = `Incorrect\nDot was in the center, should not react.\nReaction Time: ${responseTime} ms`;
            }

            resultMessage.textContent = message;
            showResultMessage();
        }

        function showResultMessage(clickY) {
            if (!isCentralTrial && typeof clickY !== 'undefined') {
                if (currentExpType === 1) {
                    if (clickY < experiment.clientHeight / 2) {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.4s';
                        textContainer.style.top = '50%';
                        textContainer2.style.top = '150%';

                    } else {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.5s';
                        textContainer.style.top = '-50%';
                        textContainer2.style.top = '50%';
                    }
                } else {
                    if (clickY < experiment.clientHeight / 2) {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.5s';
                        textContainer.style.top = '-50%';
                        textContainer2.style.top = '50%';
                    } else {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.5s';
                        textContainer.style.top = '50%';
                        textContainer2.style.top = '150%';
                    }
                }
            }

            setTimeout(() => {
                resultMessage.style.display = 'block';
                textContainer.style.display = 'none';
                textContainer2.style.display = 'none';
            }, 300);

            setTimeout(() => {
                resultMessage.style.display = 'none';
                resetExperiment(onClick, handleKeyPress);
            }, 1000);
        }

        document.addEventListener('keydown', handleKeyPress);
        experiment.addEventListener('click', onClick);

        timeoutId = setTimeout(() => {
            if (!isClickHandled && isCentralTrial) {
                handleCentralTrialResult(startTime, true);
            } else if (!isClickHandled) {
                handleCentralTrialResult(startTime, false);
            }
        }, 1500);
    }

    function checkCorrect(dotColor, clickY) {
        const isDotRed = dotColor === 'red';
        const isClickAbove = clickY < (experiment.clientHeight / 2);

        if (currentExpType === 1) {
            return (isDotRed && isClickAbove) || (!isDotRed && !isClickAbove);
        } else {
            return (!isDotRed && isClickAbove) || (isDotRed && !isClickAbove);
        }
    }

    function resetExperiment(onClick, handleKeyPress) {
        experiment.style.display = 'none';
        textContainer.style.display = 'none';
        textContainer2.style.display = 'none';
        experiment.removeEventListener('click', onClick);
        document.removeEventListener('keydown', handleKeyPress);
        trialCount++;
        isExperimentRunning = false;
        if (trialCount < maxTrials) {
            setTimeout(startExperiment, 500);
        } else {
            alert('Experiment completed');
            startButton.style.display = 'block';
        }
    }

    function resetState() {
        pluSign.style.display = 'none';
        dot.style.display = 'none';
        textContainer.style.display = 'none';
        textContainer2.style.display = 'none';
        resultMessage.style.display = 'none';
    }
}
