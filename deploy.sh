# Указываем локальный путь к папке с билдом и package.json
local_build_dir="./dist"
local_package_json="./package.json"

# Указываем удаленный хост, путь к целевой папке и имя пользователя
remote_host="192.168.16.228"
remote_dir="/home/user1"
remote_user="user1"

# Копируем папку с билдом на удаленный хост
scp -r $local_build_dir $remote_user@$remote_host:$remote_dir

# Копируем package.json на удаленный хост
scp $local_package_json $remote_user@$remote_host:$remote_dir

# Подключаемся к удаленному хосту и переходим в целевую папку
ssh $remote_user@$remote_host "cd $remote_dir"

# Устанавливаем или обновляем зависимости с помощью npm
ssh $remote_user@$remote_host "npm update"

# Устанавливаем pm2 глобально
ssh $remote_user@$remote_host "npm install pm2 -g"

