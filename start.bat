@echo off

:: 设置字符集为 UTF-8，防止中文乱码

chcp 65001 >nul



:: 锁定路径到 bat 所在的当前项目目录

cd /d "%~dp0"



echo 正在启动多工程服务，请稍候...



:: 将长命令拆分为多个短变量拼接，彻底解决 bat 换行符 ^ 导致的解析崩溃问题

set "CMD1=Write-Host '--- [1/5] opencode web ---' -ForegroundColor Cyan; Start-Process cmd -ArgumentList '/c opencode web' -NoNewWindow; "

set "CMD2=Write-Host '--- [2/5] 进入子工程 npm install ---' -ForegroundColor Green; cd project; npm install; "

set "CMD3=Write-Host '--- [3/5] 启动子工程 Vite (新窗口) ---' -ForegroundColor Yellow; Start-Process powershell -ArgumentList '-NoExit', '-Command', 'npm run dev'; Start-Sleep -Seconds 5; "

set "CMD4=Write-Host '--- [4/5] 回到父工程 node server.js ---' -ForegroundColor Green; cd ..; npx --yes http-server -a 127.0.0.1 -p 7687 -o chat.html; "



:: 拼接所有命令并在全新的 PowerShell 窗口中执行

start powershell -NoExit -Command "%CMD1%%CMD2%%CMD3%%CMD4%"



echo  依赖检查完毕，准备启动代理服务器...



:: 退出当前的 CMD 引导窗口

exit