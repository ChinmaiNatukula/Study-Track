@REM Maven Wrapper Script for Study Track Backend
@echo off
setlocal

set "INTELIJ_MAVEN=C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd"

where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    mvn %*
    goto end
)

if exist "%INTELIJ_MAVEN%" (
    call "%INTELIJ_MAVEN%" %*
    goto end
)

echo [ERROR] Neither 'mvn' nor IntelliJ bundled Maven was found on this system.
echo Please install Maven or add it to PATH.
exit /b 1

:end
