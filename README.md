# desktop-application-templates
Frontend = [ Electron + Vite + React + TypeScript ] 
Backend = [ Python + FastAPI ] 

### git clone後のインストール手順
ルートディレクトリにて下記のコマンドを実行。
```sh
npm install
```

その後、apiフォルダへ移動して仮想環境を作成
```sh
cd api
pipenv shell
```
https://qiita.com/d-kitamura/items/3b8c4ac362668cac6e75 <br>
初期設定セクションへジャンプし、.venvフォルダがルートディレクトリに作成されるようPATHを通しておく。<br>
ルートディレクトリに.venvフォルダが作成されたら、VSCode上で仮想環境インタープリタを選択しておく。<br>
main.pyを開き、右下のインタープリタを選択できる部分で.venv/Scripts/python.exeが選択できればOK。<br>
また、VSCodeの設定でVenv Pathの指定をしておくと良い。<br>

その後、pipenv環境を同期するために下記を実行。
```sh
pipenv install
```
python 3.12.1がインストールされていて環境を完全に同期したい場合は
```sh
pipenv sync
```

python embeddedをダウンロードして、pythonというフォルダ名でルートディレクトリに追加する
.vscodeフォルダ内にsettings.jsonを作成し、下記を追加する
```sh
{
  "prettier.configPath": "./prettier.config.js",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "python.defaultInterpreterPath": "${workspaceFolder}/api/.venv/Scripts/python.exe"
}
```


### 起動方法
ルートディレクトリにて
```sh
npm run dev
```
を実行すると
1. メインプロセス、プリロードスクリプトがコンパイル
2. uvicornでのAPIサーバー、viteでのフロントエンドサーバーを立ち上げる
3. Electronでフロントエンドサーバーを読み込み、ソフトが立ち上がる



