const radioButtons = document.querySelectorAll('.convertRadio');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const resetButton = document.querySelector('.resetButton');

const sBase = 0xAC00; // 음절 기준점

const lCount = 19; // 초성 개수
const vCount = 21; // 중성 개수
const tCount = 28; // 종성 개수 (종성이 없는 0의 경우도 포함)
const nCount = 588; // 중성 * 종성 조합 (한 초성의 전체 경우의 수)
const sCount = 11172; // 초성 * nCount (전체 음절 조합 경우의 수, AC00 ~ D7A3)

const lList = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const vList = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const tList = "ㄱㄲᆪㄴᆬᆭㄷㄹᆰᆱᆲᆳᆴᆵᆶㅁㅂᆹㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
const korKey = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ";
const engKey = "rRseEfaqQtTdwWczxvgkoiOjpuPhynbml";

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

function convertText() {
	const convertOption = document.querySelector('.convertRadio:checked').id;
	let output;

	if (convertOption === 'korToEng')
		output = korToEng();
	else
		output = engToKor();

	outputText.value = output;
}

function korToEng() {
	const input = inputText.value;
	let result = "";

	let syllable;
	for (let i = 0; i < input.length; i++) {
		syllable = input.codePointAt(i);

		let decomp = [-1, -1, -1, -1, -1];
		let lIndex = lList.indexOf(input[i]);
		let vIndex = vList.indexOf(input[i]);
		let tIndex = tList.indexOf(input[i]);

		if (syllable >= sBase && syllable < sBase + sCount) {
			//몇번째 음절인가
			syllable -= sBase;
			//lIndex 구하고
			decomp[0] = Math.floor(syllable / nCount);
			//vIndex 구하고
			decomp[1] = Math.floor((syllable % nCount) / tCount);
			//tIndex 구하고 -> 0이면 없는 거니까 index 계산 시 1 빼줘야 함
			decomp[3] = (syllable % tCount) - 1;
			if (!decomp[3]) { decomp[3] = -1; }
		} else if (lIndex > -1) {
			decomp[0] = lIndex;
		} else if (vIndex > -1) {
			decomp[1] = vIndex;
		} else if (tIndex > -1) {
			decomp[3] = tIndex;
		} else {
			result += input[i];
			continue;
		}

		decomposeToCompatVowel(decomp);
		decomposeToCompatTrail(decomp);
		result += mapToKey(decomp);
	}
	return result;
}

function decomposeToCompatVowel(decomp) {
	if (decomp[1] === 9) {
		//ㅘ
		decomp[1] = 8;
		decomp[2] = 0;
	} else if (decomp[1] === 10) {
		//ㅙ
		decomp[1] = 8;
		decomp[2] = 1;
	} else if (decomp[1] === 11) {
		//ㅚ
		decomp[1] = 8;
		decomp[2] = 20;
	} else if (decomp[1] === 14) {
		//ㅝ
		decomp[1] = 13;
		decomp[2] = 4;
	} else if (decomp[1] === 15) {
		//ㅞ
		decomp[1] = 13;
		decomp[2] = 5;
	} else if (decomp[1] === 16) {
		//ㅟ
		decomp[1] = 13;
		decomp[2] = 20;
	} else if (decomp[1] === 19) {
		//ㅢ
		decomp[1] = 18;
		decomp[2] = 20;
	}
}

function decomposeToCompatTrail(decomp) {
	if (decomp[3] === 2) {
		//ᆪ
		decomp[3] = 0;
		decomp[4] = 18;
	} else if (decomp[3] === 4) {
		//ᆬ
		decomp[3] = 3;
		decomp[4] = 21;
	} else if (decomp[3] === 5) {
		//ᆭ
		decomp[3] = 3;
		decomp[4] = 20;
	} else if (decomp[3] === 8) {
		//ᆰ
		decomp[3] = 7;
		decomp[4] = 4;
	} else if (decomp[3] === 9) {
		//ᆱ
		decomp[3] = 7;
		decomp[4] = 15;
	} else if (decomp[3] === 10) {
		//ᆲ
		decomp[3] = 7;
		decomp[4] = 16;
	} else if (decomp[3] === 11) {
		//ᆳ
		decomp[3] = 7;
		decomp[4] = 18;
	} else if (decomp[3] === 12) {
		//ᆴ
		decomp[3] = 7;
		decomp[4] = 24;
	} else if (decomp[3] === 13) {
		//ᆵ
		decomp[3] = 7;
		decomp[4] = 25;
	} else if (decomp[3] === 14) {
		//ᆶ
		decomp[3] = 7;
		decomp[4] = 26;
	} else if (decomp[3] === 17) {
		//ᆹ
		decomp[3] = 16;
		decomp[4] = 18;
	}
}

function mapToKey(decomp) {
	let result = "";
	for (let i = 0; i < decomp.length; i++) {
		if (decomp[i] > -1) {
			if (i === 0)
				decomp[i] = korKey.indexOf(lList[decomp[i]]);
			else if (i > 0 && i < 3)
				decomp[i] = korKey.indexOf(vList[decomp[i]]);
			else
				decomp[i] = korKey.indexOf(tList[decomp[i]]);
			result += engKey[decomp[i]];
		}
	}
	return result;
}

function engToKor() {
	const input = inputText.value;
	let result = "";

	let lvt = { l: -1, v: -1, t: -1 };

	for (let i = 0; i < input.length; i++) {
		let keyIndex = engKey.indexOf(input[i]);
		let char = korKey[keyIndex];
		if (keyIndex == -1) {
			result += composeAndPrint(lvt);
			result += input[i];
		} else if (keyIndex < 19) { // 자음
			tempL = lList.indexOf(char);
			if (lvt.l == -1) {
				if (lvt.v == -1) {
					// -1,-1,-1
					lvt.l = tempL;
				} else {
					// v
					result += composeAndPrint(lvt);
					lvt.l = tempL;
				}
			} else if (lvt.v == -1) {
				// l
				result += composeAndPrint(lvt);
				lvt.l = tempL;
			} else if (lvt.t == -1) {
				// lv
				let tempT = tList.indexOf(char);
				if (tempT > -1)
					lvt.t = tempT;
				else {
					result += composeAndPrint(lvt);
					lvt.l = tempL;
				}
			} else {
				// lvt
				// 이중받침 확인
				let tempT = tList.indexOf(char);
				if (lvt.t == 0 && tempT == 18) //ㄱㅅ
					lvt.t = 2;
				else if (lvt.t == 3 && tempT == 21) //ㄴㅈ
					lvt.t = 4;
				else if (lvt.t == 3 && tempT == 26) //ㄴㅎ
					lvt.t = 5;
				else if (lvt.t == 7 && tempT == 0) //ㄹㄱ
					lvt.t = 8;
				else if (lvt.t == 7 && tempT == 15) //ㄹㅁ
					lvt.t = 9;
				else if (lvt.t == 7 && tempT == 16) //ㄹㅂ
					lvt.t = 10;
				else if (lvt.t == 7 && tempT == 18) //ㄹㅅ
					lvt.t = 11;
				else if (lvt.t == 7 && tempT == 24) //ㄹㅌ
					lvt.t = 12;
				else if (lvt.t == 7 && tempT == 25) //ㄹㅍ
					lvt.t = 13;
				else if (lvt.t == 7 && tempT == 26) //ㄹㅎ
					lvt.t = 14;
				else if (lvt.t == 16 && tempT == 18) //ㅂㅅ
					lvt.t = 17;
				else {
					result += composeAndPrint(lvt);
					lvt.l = lList.indexOf(tList[tempT]);
				}
			}
		} else { // 모음
			tempV = vList.indexOf(char);
			if (lvt.l == -1) {
				if (lvt.v == -1) {
					// -1,-1,-1
					lvt.v = tempV;
				} else {
					// v
					// 이중모음 확인
					let vLeft = 0;
					if (lvt.v == 8 && tempV == 0) //ㅘ
						lvt.v = 9;
					else if (lvt.v == 8 && tempV == 1) //ㅙ
						lvt.v = 10;
					else if (lvt.v == 8 && tempV == 20) //ㅚ
						lvt.v = 11;
					else if (lvt.v == 13 && tempV == 4) //ㅝ
						lvt.v = 14;
					else if (lvt.v == 13 && tempV == 5) //ㅞ
						lvt.v = 15;
					else if (lvt.v == 13 && tempV == 20) //ㅟ
						lvt.v = 16;
					else if (lvt.v == 18 && tempV == 20) //ㅢ
						lvt.v = 19;
					else
						vLeft = 1;
					result += composeAndPrint(lvt);
					if (vLeft == 1) {
						lvt.v = tempV;
					}
				}
			} else if (lvt.v == -1) {
				// l
				lvt.v = tempV;
			} else if (lvt.t == -1) {
				// lv
				// 이중받침 확인
				if (lvt.v == 8 && tempV == 0)
					lvt.v = 9;
				else if (lvt.v == 8 && tempV == 1)
					lvt.v = 10;
				else if (lvt.v == 8 && tempV == 20)
					lvt.v = 11;
				else if (lvt.v == 13 && tempV == 4)
					lvt.v = 14;
				else if (lvt.v == 13 && tempV == 5)
					lvt.v = 15;
				else if (lvt.v == 13 && tempV == 20)
					lvt.v = 16;
				else if (lvt.v == 18 && tempV == 20)
					lvt.v = 19;
				else {
					result += composeAndPrint(lvt);
					lvt.v = tempV;
				}
			} else {
				// lvt
				// 이중받침 확인
				let tempL;
				if (lvt.t == 2) { //ㄱㅅ
					lvt.t = 0;
					tempL = 18;
				} else if (lvt.t == 4) { //ㄴㅈ
					lvt.t = 3;
					tempL = 21;
				} else if (lvt.t == 5) { //ㄴㅎ
					lvt.t = 3;
					tempL = 26;
				} else if (lvt.t == 8) { //ㄹㄱ
					lvt.t = 7;
					tempL = 0;
				} else if (lvt.t == 9) { //ㄹㅁ
					lvt.t = 7;
					tempL = 15;
				} else if (lvt.t == 10) { //ㄹㅂ
					lvt.t = 7;
					tempL = 16;
				} else if (lvt.t == 11) { //ㄹㅅ
					lvt.t = 7;
					tempL = 18;
				} else if (lvt.t == 12) { //ㄹㅌ
					lvt.t = 7;
					tempL = 24;
				} else if (lvt.t == 13) { //ㄹㅍ
					lvt.t = 7;
					tempL = 25;
				} else if (lvt.t == 14) { //ㄹㅎ
					lvt.t = 7;
					tempL = 26;
				} else if (lvt.t == 17) { //ㅂㅅ
					tempL = 18;
					lvt.t = 16;
				} else {
					tempL = lvt.t;
					lvt.t = -1;
				}
				result += composeAndPrint(lvt);
				lvt.l = lList.indexOf(tList[tempL]);
				lvt.v = tempV;
			}
		}
	}
	result += composeAndPrint(lvt);
	return result;
}

function composeAndPrint(lvt) {
	let result = "";
	if (lvt.l > -1 && lvt.v > -1) {
		let syllable = sBase + (lvt.l * nCount) + (lvt.v * tCount) + lvt.t + 1;
		result = String.fromCodePoint(syllable);
	} else if (lvt.l > -1 && lvt.v == -1)
		result = lList[lvt.l];
	else if (lvt.l == -1 && lvt.v > -1)
		result = vList[lvt.v];

	lvt.l = -1;
	lvt.v = -1;
	lvt.t = -1;

	return result;
}
