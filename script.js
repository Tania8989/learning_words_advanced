$(document).ready(function() {
	const words = [
	{ word: "Landscape", translation: "Ландшафт" },
	{ word: "Law", translation: "Закон" },
	{ word: "Preference", translation: "Перевага" },
	{ word: "Headphones", translation: "Навушники" },
	{ word: "Meal", translation: "Харчування" },
	{ word: "Mail", translation: "Пошта" },
	{ word: "Butterfly", translation: "Метелик" },
	{ word: "Apple", translation: "Яблуко" },
	{ word: "Display", translation: "Дисплей" },
	{ word: "Relationship", translation: "Стосунки" },
	{ word: "Cookie", translation: "Печиво" },
	{ word: "Occupation", translation: "Професія" },
	{ word: "Opinion", translation: "Думка" },
	{ word: "Rainbow", translation: "Райдуга" },
	{ word: "Plants", translation: "Рослини" }
];
let currentWords = [];
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let totalSteps = 0;
const difficultySettings = {
	easy: 5,
    medium: 10,
    hard: 15
};
function statistics() {
	$("#current-step").text(currentWordIndex);
	$("#total-steps").text(totalSteps);
    $("#correct-count").text(correctCount);
    $("#incorrect-count").text(incorrectCount);
}
function mixArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
}
function initializeRound() {
	const level = $("#difficulty-level").val();
	const count = difficultySettings[level];
	const mixedWords = mixArray([...words]);
	currentWords = mixedWords.slice(0, count);
	currentWordIndex = 0;
	correctCount = 0;
	incorrectCount = 0;
	totalSteps = currentWords.length;
	statistics();
	displayNextWord();
	$("#start-button").text("Скинути");
	$("#check-button").prop("disabled", false);
	$("#translation-input").prop("disabled", false).val("").focus();
	$("#difficulty-level").prop("disabled", true);
}
function displayNextWord() {
	if (currentWordIndex < totalSteps) {
		const word = currentWords[currentWordIndex].word;
		$(".word-text").text(word);
		$("#translation-input").val("");
		$("#translation-input").removeClass("correct incorrect");
		$("#check-button").prop("disabled", false);
		} else {
			showResultsModal();
			$(".word-text").text("Тест завершено!");
            $("#translation-input").val("").prop("disabled", true);
            $("#check-button").prop("disabled", true);
            $("#start-button").text("Почати");
            $("#difficulty-level").prop("disabled", false);
			}
}
function checkTranslation() {
	if (currentWordIndex >= totalSteps) return;
	const expectedTranslation = currentWords[currentWordIndex].translation.toLowerCase().trim();
	const userInput = $("#translation-input").val().toLowerCase().trim();
	const isCorrect = userInput === expectedTranslation;
	$("#translation-input").addClass(isCorrect ? "correct" : "incorrect");
	$("#check-button").prop("disabled", true);
	if (isCorrect) {
		correctCount++;
		} else {
			incorrectCount++;
			const currentWordText = $(".word-text").text();
			$(".word-text").text(`${currentWordText} | Вірно: ${expectedTranslation}`);
			}
			statistics();
			setTimeout(() => {
				currentWordIndex++;
				statistics();
				displayNextWord();
				}, 1000);
}
function showResultsModal() {
	const percentage = totalSteps > 0 ? ((correctCount / totalSteps) * 100).toFixed(1) : 0;
	let message;
	if (percentage >= 80) {
		message = "Ваш рівень високий.";
		} else if (percentage >= 50) {
			message = "Ваш рівень середній.";
			} else {
				message = "Ваш рівень низький.";
				}
				$("#modal-message").text(`${message} (${percentage}%)`);
				$("#modal-total").text(totalSteps);
				$("#modal-correct").text(correctCount);
				$("#result-modal").fadeIn();
}
$("#start-button").on("click", function() {
	if ($(this).text() === "Почати") {
		initializeRound();
		} else {
			$("#start-button").text("Почати");
            $("#check-button").prop("disabled", true);
            $("#translation-input").prop("disabled", true).val("");
            $(".word-text").text("Натисніть \"Почати\" для старту");
            $("#difficulty-level").prop("disabled", false);
            currentWordIndex = 0;
            correctCount = 0;
            incorrectCount = 0;
            totalSteps = 0;
            statistics();
        }
});
$("#check-button").on("click", checkTranslation);
$("#translation-input").on("keypress", function(e) {
	if (e.which === 13 && !$(this).prop("disabled") && !$("#check-button").prop("disabled")) {
		checkTranslation();
		}
});
$(".close-button, #result-modal").on("click", function(event) {
	if ($(event.target).is(".close-button") || $(event.target).is("#result-modal")) {
		$("#result-modal").fadeOut();
		}
});
statistics();
});