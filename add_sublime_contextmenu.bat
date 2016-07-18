@echo off
SET st2Path=C:\Program Files\Sublime Text 3\sublime_text.exe


rem add it for folders
@reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\Open with SublimeText"         /t REG_SZ /v "" /d "Open with SublimeText"   /f
@reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\Open with SublimeText"         /t REG_EXPAND_SZ /v "Icon" /d "%st2Path%,0" /f
@reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\Open with SublimeText\command" /t REG_SZ /v "" /d "%st2Path% \"%%V\"" /f
pause