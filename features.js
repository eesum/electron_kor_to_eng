const { clipboard } = require('electron');
const robot = require('robotjs');
const applescript = require('applescript');
const { convertType, engToKor, korToEng } = require('./convertType');

function isTextFieldFocused(callback) {
	const script = `
	tell application "System Events"
		tell (first application process whose frontmost is true)
			try
				set focusedElement to value of attribute "AXFocusedUIElement"
				set roleDesc to value of attribute "AXRoleDescription" of focusedElement
				if roleDesc is "text field" or roleDesc is "text entry area" then
					return "true"
				else
					return "false"
				end if
			on error
				return "false"
			end try
		end tell
	end tell
	`;

	applescript.execString(script, (err, result) => {
		if (err) {
			console.error("AppleScript 실행 오류:", err);
			callback(false);
		} else {
			callback(result.trim() === "true");
		}
	});
}

function replaceLastWord(text) {
	return text.replace(/(\S+)(\s*)$/, (_, lastWord, spaces) => convertType(lastWord) + spaces);
}

function autoConvert() {
	// isTextFieldFocused((focused) => {
	// 	if (!focused) {
	// 		console.log('⚠️ 입력 필드가 포커스되지 않음! 실행 취소');
	// 		return;
	// 	}

	// 	console.log('✅ 입력 필드가 포커스됨! 실행 시작');

	robot.keyTap('left', ['command', 'shift']);
	setTimeout(() => {
		robot.keyTap('c', ['command']); // 복사
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
			robot.keyTap('v', ['command']); // 붙여넣기
		}, 50);
	}, 100);
	// });
}

function autoConvertSelection() {
	setTimeout(() => {
		robot.keyTap('c', ['command']); // 복사
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
			robot.keyTap('v', ['command']); // 붙여넣기
		}, 50);
	}, 100);
}

function engToKorSelection() {
	setTimeout(() => {
		robot.keyTap('c', ['command']); // 복사
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
			robot.keyTap('v', ['command']); // 붙여넣기
		}, 50);
	}, 100);
}

function korToEngSelection() {
	setTimeout(() => {
		robot.keyTap('c', ['command']); // 복사
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
			robot.keyTap('v', ['command']); // 붙여넣기
		}, 50);
	}, 100);
}

module.exports = { autoConvert, autoConvertSelection, engToKorSelection, korToEngSelection }