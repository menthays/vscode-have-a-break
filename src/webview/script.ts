import { BREAK_DURATION, IMAGE_HEIGHT, IMAGE_WIDTH } from '../constants';

export function getClientScript(): string {
    return `
        const vscode = acquireVsCodeApi();
        
        // Preload next image
        function preloadNextImage() {
            const timestamp = new Date().getTime();
            const img = new Image();
            img.src = \`https://picsum.photos/${IMAGE_WIDTH}/${IMAGE_HEIGHT}?random=\${timestamp}\`;
        }
        
        // Setup button handlers
        document.getElementById('backToWork').addEventListener('click', () => {
            vscode.postMessage({
                command: 'close'
            });
        });

        document.getElementById('refresh').addEventListener('click', () => {
            document.querySelector('.loading-progress').style.width = '0%';
            vscode.postMessage({
                command: 'refresh'
            });
        });

        // Setup loading progress bar
        const progressBar = document.querySelector('.loading-progress');
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += 5;
                progressBar.style.width = progress + '%';
            }
        }, 100);

        // Handle image load
        document.querySelector('img').addEventListener('load', () => {
            clearInterval(progressInterval);
            preloadNextImage();
        });

        // Setup break timer
        let timeLeft = ${BREAK_DURATION};
        const timerElement = document.querySelector('.timer');
        
        const timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = \`Break time remaining: \${minutes}:\${seconds.toString().padStart(2, '0')}\`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timerElement.textContent = 'Break time is over!';
            }
        }, 1000);
    `;
}
