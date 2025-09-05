const keymap: {[key: string]: (
	{
		"type": "common",
		"char": string
	} | {
		"type": "uncommon",
		"windows": string,
		"macos": string
	}
)} = {
  "Backquote": {
    "type": "common",
    "char": "`"
  },
  "Backslash": {
    "type": "common",
    "char": "\\"
  },
  "BracketLeft": {
    "type": "common",
    "char": "["
  },
  "BracketRight": {
    "type": "common",
    "char": "]"
  },
  "Comma": {
    "type": "common",
    "char": ","
  },
  "Digit0": {
    "type": "common",
    "char": "0"
  },
  "Digit1": {
    "type": "common",
    "char": "1"
  },
  "Digit2": {
    "type": "common",
    "char": "2"
  },
  "Digit3": {
    "type": "common",
    "char": "3"
  },
  "Digit4": {
    "type": "common",
    "char": "4"
  },
  "Digit5": {
    "type": "common",
    "char": "5"
  },
  "Digit6": {
    "type": "common",
    "char": "6"
  },
  "Digit7": {
    "type": "common",
    "char": "7"
  },
  "Digit8": {
    "type": "common",
    "char": "8"
  },
  "Digit9": {
    "type": "common",
    "char": "9"
  },
  "Equal": {
    "type": "common",
    "char": "="
  },
  "IntlBackslash": {
    "type": "uncommon",
    "windows": "\\",
    "macos": "\\"
  },
  "IntlRo": {
    "type": "common",
    "char": "_"
  },
  "IntlYen": {
    "type": "uncommon",
    "windows": "¥",
    "macos": "¥"
  },
  "KeyA": {
    "type": "common",
    "char": "a"
  },
  "KeyB": {
    "type": "common",
    "char": "b"
  },
  "KeyC": {
    "type": "common",
    "char": "c"
  },
  "KeyD": {
    "type": "common",
    "char": "d"
  },
  "KeyE": {
    "type": "common",
    "char": "e"
  },
  "KeyF": {
    "type": "common",
    "char": "f"
  },
  "KeyG": {
    "type": "common",
    "char": "g"
  },
  "KeyH": {
    "type": "common",
    "char": "h"
  },
  "KeyI": {
    "type": "common",
    "char": "i"
  },
  "KeyJ": {
    "type": "common",
    "char": "j"
  },
  "KeyK": {
    "type": "common",
    "char": "k"
  },
  "KeyL": {
    "type": "common",
    "char": "l"
  },
  "KeyM": {
    "type": "common",
    "char": "m"
  },
  "KeyN": {
    "type": "common",
    "char": "n"
  },
  "KeyO": {
    "type": "common",
    "char": "o"
  },
  "KeyP": {
    "type": "common",
    "char": "p"
  },
  "KeyQ": {
    "type": "common",
    "char": "q"
  },
  "KeyR": {
    "type": "common",
    "char": "r"
  },
  "KeyS": {
    "type": "common",
    "char": "s"
  },
  "KeyT": {
    "type": "common",
    "char": "t"
  },
  "KeyU": {
    "type": "common",
    "char": "u"
  },
  "KeyV": {
    "type": "common",
    "char": "v"
  },
  "KeyW": {
    "type": "common",
    "char": "w"
  },
  "KeyX": {
    "type": "common",
    "char": "x"
  },
  "KeyY": {
    "type": "common",
    "char": "y"
  },
  "KeyZ": {
    "type": "common",
    "char": "z"
  },
  "Minus": {
    "type": "common",
    "char": "-"
  },
  "Period": {
    "type": "common",
    "char": "."
  },
  "Quote": {
    "type": "common",
    "char": "'"
  },
  "Semicolon": {
    "type": "common",
    "char": ";"
  },
  "Slash": {
    "type": "common",
    "char": "/"
  },
  "AltLeft": {
    "type": "uncommon",
    "windows": "Alt",
    "macos": "⌥"
  },
  "AltRight": {
    "type": "uncommon",
    "windows": "Alt",
    "macos": "⌥"
  },
  "Backspace": {
    "type": "common",
    "char": "Backspace"
  },
  "CapsLock": {
    "type": "common",
    "char": "CapsLock"
  },
  "ContextMenu": {
    "type": "uncommon",
    "windows": "Menu",
    "macos": "Menu"
  },
  "ControlLeft": {
    "type": "common",
    "char": "⌃"
  },
  "ControlRight": {
    "type": "common",
    "char": "⌃"
  },
  "Enter": {
    "type": "common",
    "char": "⏎"
  },
  "MetaLeft": {
    "type": "uncommon",
    "windows": "Win",
    "macos": "⌘"
  },
  "MetaRight": {
    "type": "uncommon",
    "windows": "Win",
    "macos": "⌘"
  },
  "ShiftLeft": {
    "type": "common",
    "char": "⇧"
  },
  "ShiftRight": {
    "type": "common",
    "char": "⇧"
  },
  "Space": {
    "type": "common",
    "char": "␣"
  },
  "Tab": {
    "type": "common",
    "char": "↹"
  },
  "Convert": {
    "type": "uncommon",
    "windows": "変換",
    "macos": "変換"
  },
  "KanaMode": {
    "type": "uncommon",
    "windows": "かな",
    "macos": "かな"
  },
  "Lang1": {
    "type": "uncommon",
    "windows": "かな/英数",
    "macos": "ひらがな"
  },
  "Lang2": {
    "type": "uncommon",
    "windows": "カタカナ",
    "macos": "カタカナ"
  },
  "Lang3": {
    "type": "uncommon",
    "windows": "ひらがな",
    "macos": "ひらがな"
  },
  "Lang4": {
    "type": "uncommon",
    "windows": "全角/半角",
    "macos": "全角/半角"
  },
  "Lang5": {
    "type": "uncommon",
    "windows": "Hankaku",
    "macos": "Hankaku"
  },
  "NonConvert": {
    "type": "uncommon",
    "windows": "無変換",
    "macos": "無変換"
  },
  "Delete": {
    "type": "common",
    "char": "Delete"
  },
  "End": {
    "type": "common",
    "char": "End"
  },
  "Help": {
    "type": "common",
    "char": "Help"
  },
  "Home": {
    "type": "common",
    "char": "Home"
  },
  "Insert": {
    "type": "common",
    "char": "Insert"
  },
  "PageDown": {
    "type": "common",
    "char": "PageDown"
  },
  "PageUp": {
    "type": "common",
    "char": "PageUp"
  },
  "ArrowDown": {
    "type": "common",
    "char": "ArrowDown"
  },
  "ArrowLeft": {
    "type": "common",
    "char": "ArrowLeft"
  },
  "ArrowRight": {
    "type": "common",
    "char": "ArrowRight"
  },
  "ArrowUp": {
    "type": "common",
    "char": "ArrowUp"
  },
  "NumLock": {
    "type": "common",
    "char": "NumLock"
  },
  "Numpad0": {
    "type": "common",
    "char": "0"
  },
  "Numpad1": {
    "type": "common",
    "char": "1"
  },
  "Numpad2": {
    "type": "common",
    "char": "2"
  },
  "Numpad3": {
    "type": "common",
    "char": "3"
  },
  "Numpad4": {
    "type": "common",
    "char": "4"
  },
  "Numpad5": {
    "type": "common",
    "char": "5"
  },
  "Numpad6": {
    "type": "common",
    "char": "6"
  },
  "Numpad7": {
    "type": "common",
    "char": "7"
  },
  "Numpad8": {
    "type": "common",
    "char": "8"
  },
  "Numpad9": {
    "type": "common",
    "char": "9"
  },
  "NumpadAdd": {
    "type": "common",
    "char": "+"
  },
  "NumpadBackspace": {
    "type": "common",
    "char": "NumpadBackspace"
  },
  "NumpadClear": {
    "type": "common",
    "char": "NumpadClear"
  },
  "NumpadClearEntry": {
    "type": "common",
    "char": "NumpadClearEntry"
  },
  "NumpadComma": {
    "type": "common",
    "char": ","
  },
  "NumpadDecimal": {
    "type": "common",
    "char": "."
  },
  "NumpadDivide": {
    "type": "common",
    "char": "/"
  },
  "NumpadEnter": {
    "type": "common",
    "char": "Enter"
  },
  "NumpadEqual": {
    "type": "common",
    "char": "="
  },
  "NumpadHash": {
    "type": "common",
    "char": "#"
  },
  "NumpadMemoryAdd": {
    "type": "common",
    "char": "M+"
  },
  "NumpadMemoryClear": {
    "type": "common",
    "char": "MC"
  },
  "NumpadMemoryRecall": {
    "type": "common",
    "char": "MR"
  },
  "NumpadMemoryStore": {
    "type": "common",
    "char": "MS"
  },
  "NumpadMemorySubtract": {
    "type": "common",
    "char": "M-"
  },
  "NumpadMultiply": {
    "type": "common",
    "char": "*"
  },
  "NumpadParenLeft": {
    "type": "common",
    "char": "("
  },
  "NumpadParenRight": {
    "type": "common",
    "char": ")"
  },
  "NumpadStar": {
    "type": "common",
    "char": "*"
  },
  "NumpadSubtract": {
    "type": "common",
    "char": "-"
  },
  "Escape": {
    "type": "common",
    "char": "Escape"
  },
  "Fn": {
    "type": "common",
    "char": "Fn"
  },
  "FnLock": {
    "type": "common",
    "char": "FnLock"
  },
  "PrintScreen": {
    "type": "common",
    "char": "PrintScreen"
  },
  "ScrollLock": {
    "type": "common",
    "char": "ScrollLock"
  },
  "Pause": {
    "type": "common",
    "char": "Pause"
  },
  "BrowserBack": {
    "type": "common",
    "char": "BrowserBack"
  },
  "BrowserFavorites": {
    "type": "common",
    "char": "BrowserFavorites"
  },
  "BrowserForward": {
    "type": "common",
    "char": "BrowserForward"
  },
  "BrowserHome": {
    "type": "common",
    "char": "BrowserHome"
  },
  "BrowserRefresh": {
    "type": "common",
    "char": "BrowserRefresh"
  },
  "BrowserSearch": {
    "type": "common",
    "char": "BrowserSearch"
  },
  "BrowserStop": {
    "type": "common",
    "char": "BrowserStop"
  },
  "Eject": {
    "type": "common",
    "char": "Eject"
  },
  "LaunchApp1": {
    "type": "common",
    "char": "LaunchApp1"
  },
  "LaunchApp2": {
    "type": "common",
    "char": "LaunchApp2"
  },
  "LaunchMail": {
    "type": "common",
    "char": "LaunchMail"
  },
  "MediaPlayPause": {
    "type": "common",
    "char": "MediaPlayPause"
  },
  "MediaSelect": {
    "type": "common",
    "char": "MediaSelect"
  },
  "MediaStop": {
    "type": "common",
    "char": "MediaStop"
  },
  "MediaTrackNext": {
    "type": "common",
    "char": "MediaTrackNext"
  },
  "MediaTrackPrevious": {
    "type": "common",
    "char": "MediaTrackPrevious"
  },
  "Power": {
    "type": "common",
    "char": "Power"
  },
  "Sleep": {
    "type": "common",
    "char": "Sleep"
  },
  "AudioVolumeDown": {
    "type": "common",
    "char": "VolumeDown"
  },
  "AudioVolumeMute": {
    "type": "common",
    "char": "VolumeMute"
  },
  "AudioVolumeUp": {
    "type": "common",
    "char": "VolumeUp"
  },
  "WakeUp": {
    "type": "common",
    "char": "WakeUp"
  },
  "Hyper": {
    "type": "common",
    "char": "Hyper"
  },
  "Super": {
    "type": "common",
    "char": "Super"
  },
  "Turbo": {
    "type": "common",
    "char": "Turbo"
  },
  "Abort": {
    "type": "common",
    "char": "Abort"
  },
  "Resume": {
    "type": "common",
    "char": "Resume"
  },
  "Suspend": {
    "type": "common",
    "char": "Suspend"
  },
  "Again": {
    "type": "common",
    "char": "Again"
  },
  "Copy": {
    "type": "common",
    "char": "Copy"
  },
  "Cut": {
    "type": "common",
    "char": "Cut"
  },
  "Find": {
    "type": "common",
    "char": "Find"
  },
  "Open": {
    "type": "common",
    "char": "Open"
  },
  "Paste": {
    "type": "common",
    "char": "Paste"
  },
  "Props": {
    "type": "common",
    "char": "Props"
  },
  "Select": {
    "type": "common",
    "char": "Select"
  },
  "Undo": {
    "type": "common",
    "char": "Undo"
  },
  "Hiragana": {
    "type": "uncommon",
    "windows": "ひらがな",
    "macos": "ひらがな"
  },
  "Katakana": {
    "type": "uncommon",
    "windows": "カタカナ",
    "macos": "カタカナ"
  },
  "Unidentified": {
    "type": "common",
    "char": "Unidentified"
  },
  "F1": {
    "type": "common",
    "char": "F1"
  },
  "F2": {
    "type": "common",
    "char": "F2"
  },
  "F3": {
    "type": "common",
    "char": "F3"
  },
  "F4": {
    "type": "common",
    "char": "F4"
  },
  "F5": {
    "type": "common",
    "char": "F5"
  },
  "F6": {
    "type": "common",
    "char": "F6"
  },
  "F7": {
    "type": "common",
    "char": "F7"
  },
  "F8": {
    "type": "common",
    "char": "F8"
  },
  "F9": {
    "type": "common",
    "char": "F9"
  },
  "F10": {
    "type": "common",
    "char": "F10"
  },
  "F11": {
    "type": "common",
    "char": "F11"
  },
  "F12": {
    "type": "common",
    "char": "F12"
  },
  "F13": {
    "type": "common",
    "char": "F13"
  },
  "F14": {
    "type": "common",
    "char": "F14"
  },
  "F15": {
    "type": "common",
    "char": "F15"
  },
  "F16": {
    "type": "common",
    "char": "F16"
  },
  "F17": {
    "type": "common",
    "char": "F17"
  },
  "F18": {
    "type": "common",
    "char": "F18"
  },
  "F19": {
    "type": "common",
    "char": "F19"
  },
  "F20": {
    "type": "common",
    "char": "F20"
  },
  "F21": {
    "type": "common",
    "char": "F21"
  },
  "F22": {
    "type": "common",
    "char": "F22"
  },
  "F23": {
    "type": "common",
    "char": "F23"
  },
  "F24": {
    "type": "common",
    "char": "F24"
  },
  "F25": {
    "type": "common",
    "char": "F25"
  },
  "F26": {
    "type": "common",
    "char": "F26"
  },
  "F27": {
    "type": "common",
    "char": "F27"
  },
  "F28": {
    "type": "common",
    "char": "F28"
  },
  "F29": {
    "type": "common",
    "char": "F29"
  },
  "F30": {
    "type": "common",
    "char": "F30"
  },
  "F31": {
    "type": "common",
    "char": "F31"
  },
  "F32": {
    "type": "common",
    "char": "F32"
  },
  "F33": {
    "type": "common",
    "char": "F33"
  },
  "F34": {
    "type": "common",
    "char": "F34"
  },
  "F35": {
    "type": "common",
    "char": "F35"
  },
  "BrightnessDown": {
    "type": "common",
    "char": "BrightnessDown"
  },
  "BrightnessUp": {
    "type": "common",
    "char": "BrightnessUp"
  },
  "DisplayToggleIntExt": {
    "type": "common",
    "char": "DisplayToggleIntExt"
  },
  "KeyboardLayoutSelect": {
    "type": "common",
    "char": "KeyboardLayoutSelect"
  },
  "LaunchAssistant": {
    "type": "common",
    "char": "LaunchAssistant"
  },
  "LaunchControlPanel": {
    "type": "common",
    "char": "LaunchControlPanel"
  },
  "LaunchScreenSaver": {
    "type": "common",
    "char": "LaunchScreenSaver"
  },
  "MailForward": {
    "type": "common",
    "char": "MailForward"
  },
  "MailReply": {
    "type": "common",
    "char": "MailReply"
  },
  "MailSend": {
    "type": "common",
    "char": "MailSend"
  },
  "MediaFastForward": {
    "type": "common",
    "char": "MediaFastForward"
  },
  "MediaPause": {
    "type": "common",
    "char": "MediaPause"
  },
  "MediaPlay": {
    "type": "common",
    "char": "MediaPlay"
  },
  "MediaRecord": {
    "type": "common",
    "char": "MediaRecord"
  },
  "MediaRewind": {
    "type": "common",
    "char": "MediaRewind"
  },
  "MicrophoneMuteToggle": {
    "type": "common",
    "char": "MicrophoneMuteToggle"
  },
  "PrivacyScreenToggle": {
    "type": "common",
    "char": "PrivacyScreenToggle"
  },
  "SelectTask": {
    "type": "common",
    "char": "SelectTask"
  },
  "ShowAllWindows": {
    "type": "common",
    "char": "ShowAllWindows"
  },
  "ZoomToggle": {
    "type": "common",
    "char": "ZoomToggle"
  }
};

export default keymap;
