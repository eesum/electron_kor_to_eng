#!/usr/bin/env swift
import Carbon

// 활성화된 입력 소스 가져오기
guard let cfSources = TISCreateInputSourceList(nil, false),
      let sources = cfSources.takeRetainedValue() as? [TISInputSource] else {
    print("Failed to get input sources.")
    exit(-1)
}

// 현재 활성화된 입력 소스 가져오기
guard let currentSource = TISCopyCurrentKeyboardInputSource()?.takeRetainedValue() else {
    print("Failed to get current input source.")
    exit(-1)
}

// 현재 입력 소스 ID 추출
let currentSourceID = TISGetInputSourceProperty(currentSource, kTISPropertyInputSourceID)!
let currentSourceString = Unmanaged<CFString>.fromOpaque(currentSourceID).takeUnretainedValue() as String

// 입력 소스 이름
let sourceA = "com.apple.keylayout.ABC"
let sourceB = "com.apple.inputmethod.Korean.2SetKorean"

// 입력 소스 변경 함수
func changeInputSource(to sourceID: String) {
    if let source = sources.first(where: { 
        let id = TISGetInputSourceProperty($0, kTISPropertyInputSourceID)!
        let idString = Unmanaged<CFString>.fromOpaque(id).takeUnretainedValue() as String
        return idString == sourceID
    }) {
        TISSelectInputSource(source)
        print("Changed input source to: \(sourceID)")
    }
}

// 현재 입력 소스가 sourceA이면 sourceB로, sourceB이면 sourceA로 변경
if currentSourceString == sourceA {
    changeInputSource(to: sourceB)
} else if currentSourceString == sourceB {
    changeInputSource(to: sourceA)
} else {
    print("Current input source is neither \(sourceA) nor \(sourceB).")
}
