const radioButtons = document.querySelectorAll('.convertRadio');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const resetButton = document.querySelector('.resetButton');

radioButtons.forEach(radio => { radio.addEventListener('change', convertText); });
radioButtons.forEach(radio => { radio.addEventListener('change', changePlaceholder); });
inputText.addEventListener('input', convertText);
resetButton.addEventListener('click', resetTextBox);
outputText.addEventListener('click', copyToClipboard);

function changePlaceholder() {
	const convertOption = document.querySelector('.convertRadio:checked').id;

	if (convertOption === 'korToEng')
		inputText.placeholder = "해ㅐㅇ ㅡㅐ구ㅑㅜㅎ";
	else
		inputText.placeholder = "dkssudgktpdy";
}

function resetTextBox() {
	inputText.value = '';
	outputText.value = '';
}

async function copyToClipboard() {
	if (outputText.value) {
		try {
			await navigator.clipboard.writeText(outputText.value);
			alert('클립보드 복사 성공!');
		} catch (error) {
			alert('클립보드 복사에 실패했어요\n' + error.message);
		}
	}
}

async function convertText() {
	const convertOption = document.querySelector('.convertRadio:checked').id;
	const input = inputText.value;
	let output;

	if (convertOption === 'korToEng')
		output = await window.convert.korToEng(input);
	else
		output = await window.convert.engToKor(input);

	outputText.value = output;
}

