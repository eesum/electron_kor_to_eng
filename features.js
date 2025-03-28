const { clipboard } = require('electron');
const robot = require('robotjs');
const { convertType, engToKor, korToEng } = require('./convertType');

function replaceLastWord(text) {
	return text.replace(/(\S+)(\s*)$/, (_, lastWord, spaces) => convertType(lastWord) + spaces);
}

function autoConvert() {
	robot.keyTap('left', ['command', 'shift']);
	setTimeout(() => {
		robot.keyTap('c', ['command']);
	}, 50);

	setTimeout(() => {
		let text = clipboard.readText().trim();
		console.log('Clipboard Text:', text);

		if (!text) {
			console.log('⚠️ 클립보드가 비어 있음!');
			return;
		}

		let modifiedText = replaceLastWord(text);
		console.log('Modified Text:', modifiedText);
		clipboard.writeText(modifiedText);

		setTimeout(() => {
			robot.keyTap('v', ['command']);
		}, 50);
	}, 100);
}

function autoConvertSelection() {
	setTimeout(() => {
		robot.keyTap('c', ['command']);
	}, 50);

	setTimeout(() => {
		let text = clipboard.readText().trim();
		console.log('Clipboard Text:', text);

		if (!text) {
			console.log('⚠️ 클립보드가 비어 있음!');
			return;
		}

		let modifiedText = convertType(text);
		console.log('Modified Text:', modifiedText);
		clipboard.writeText(modifiedText);

		setTimeout(() => {
			robot.keyTap('v', ['command']);
		}, 50);
	}, 100);
}

function engToKorSelection() {
	setTimeout(() => {
		robot.keyTap('c', ['command']);
	}, 50);

	setTimeout(() => {
		let text = clipboard.readText().trim();
		console.log('Clipboard Text:', text);

		if (!text) {
			console.log('⚠️ 클립보드가 비어 있음!');
			return;
		}

		let modifiedText = engToKor(text);
		console.log('Modified Text:', modifiedText);
		clipboard.writeText(modifiedText);

		setTimeout(() => {
			robot.keyTap('v', ['command']);
		}, 50);
	}, 100);
}

function korToEngSelection() {
	setTimeout(() => {
		robot.keyTap('c', ['command']);
	}, 50);

	setTimeout(() => {
		let text = clipboard.readText().trim();
		console.log('Clipboard Text:', text);

		if (!text) {
			console.log('⚠️ 클립보드가 비어 있음!');
			return;
		}

		let modifiedText = korToEng(text);
		console.log('Modified Text:', modifiedText);
		clipboard.writeText(modifiedText);

		setTimeout(() => {
			robot.keyTap('v', ['command']);
		}, 50);
	}, 100);
}

module.exports = { autoConvert, autoConvertSelection, engToKorSelection, korToEngSelection }