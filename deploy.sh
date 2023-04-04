echo -e $PWD
echo -e '\e[1m\e[34mEntering into frontend directory...\e[0m\n'
cd frendlee-api
echo -e $PWD
echo -e '\e[1m\e[34mPulling code from remote...\e[0m\n'
git pull URL_REPOSITORIO_AQUI
git fetch URL_REPOSITORIO_AQUI
git checkout master
echo -e '\e[1m\e[34mPull master done!\e[0m\n'
echo -e '\e[1m\e[34mStop server...\e[0m\n'
pm2 stop 0
echo -e '\e[1m\e[34mStoped server (PM2)!\e[0m\n'
echo -e '\e[1m\e[34mInstalling dependencies...\e[0m\n'
yarn
echo -e '\e[1m\e[34mInstalled dependencies!\e[0m\n'
echo -e '\e[1m\e[34mRunning build...\e[0m\n'
echo -e $PWD
yarn build
echo -e '\e[1m\e[34mBuild success!\e[0m\n'
cd build
echo -e $PWD
echo -e '\e[1m\e[34mInstalling dependencies BUILD...\e[0m\n'
yarn install --production
echo -e '\e[1m\e[34mInstalled dependencies!\e[0m\n'
cd ..
cp .env build
echo -e '\e[1m\e[34mStarting server...\e[0m\n'
cd build
pm2 start server.js
echo -e '\e[1m\e[34mDone! Deploy for production success!\e[0m\n'