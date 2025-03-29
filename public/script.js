// عناصر الواجهة
const boardElement = document.getElementById('board');
const cellElements = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreDrawElement = document.getElementById('scoreDraw');

// حالة اللعبة
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, Draw: 0 };

// التركيبات الفائزة (فهارس الخلايا)
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
    [0, 4, 8], [2, 4, 6]             // أقطار
];

// رسائل الحالة
const winMessage = (player) => `اللاعب ${player} فاز! 🎉`;
const drawMessage = () => `تعادل! 🤝`;
const turnMessage = (player) => `دور اللاعب ${player}`;

// ------ الوظائف ------

// معالج النقر على الخلية
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // التحقق إذا كانت الخلية مشغولة أو اللعبة منتهية
    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // تحديث حالة اللوحة والواجهة
    updateCell(clickedCell, clickedCellIndex);
    // التحقق من النتيجة
    checkResult();
}

// تحديث الخلية
function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase()); // لإضافة كلاس .x أو .o للتصميم
}

// تبديل اللاعب
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = turnMessage(currentPlayer);
}

// التحقق من الفوز أو التعادل
function checkResult() {
    let roundWon = false;
    let winningLine = [];

    for (let i = 0; i < winningCombinations.length; i++) {
        const winCondition = winningCombinations[i];
        const a = boardState[winCondition[0]];
        const b = boardState[winCondition[1]];
        const c = boardState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue; // تخطي إذا كان هناك خلية فارغة في التركيبة
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition; // حفظ الخط الفائز
            break;
        }
    }

    // إذا كان هناك فائز
    if (roundWon) {
        statusElement.textContent = winMessage(currentPlayer);
        scores[currentPlayer]++;
        gameActive = false;
        highlightWinningCells(winningLine); // تمييز الخلايا الفائزة
        updateScoreboard();
        return;
    }

    // إذا لم يفز أحد واللوحة ممتلئة (تعادل)
    if (!boardState.includes('')) {
        statusElement.textContent = drawMessage();
        scores.Draw++;
        gameActive = false;
        updateScoreboard();
        return;
    }

    // إذا لم يفز أحد ولم تنته اللعبة، بدل اللاعب
    switchPlayer();
}

// تمييز الخلايا الفائزة
function highlightWinningCells(line) {
    line.forEach(index => {
        cellElements[index].classList.add('win');
    });
}

// تحديث لوحة النتائج
function updateScoreboard() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    scoreDrawElement.textContent = scores.Draw;
}

// إعادة تشغيل اللعبة
function restartGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X'; // X يبدأ دائماً
    statusElement.textContent = turnMessage(currentPlayer);

    cellElements.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win'); // إزالة جميع الكلاسات
    });

    // قد تحتاج إلى تحديث لوحة النتائج هنا إذا أردت تصفيرها عند إعادة التشغيل الكلي
    // updateScoreboard(); // قم بإلغاء التعليق إذا أردت إعادة تعيين النقاط أيضاً
}

// ------ تشغيل اللعبة ------

// إضافة مستمعي الأحداث للخلايا وزر إعادة التشغيل
cellElements.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

// ضبط رسالة الحالة الأولية
statusElement.textContent = turnMessage(currentPlayer);
// تحديث لوحة النتائج الأولية (ستكون صفرًا)
updateScoreboard();

console.log("لعبة XO جاهزة!"); // رسالة اختيارية للمطور في الكونسول
