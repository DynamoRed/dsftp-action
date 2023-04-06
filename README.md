## 🌟 Beta 1.0.0 !
> **Warning**
> Don't forget to watch and star this repository to be notified on future releases

![dSFTPAction](https://cdn.dynamored.com/vcs/banners/dSFTPAction.png)

# 🎉 Usage

Here is an exemple of a file that you can add to your `.github/workflows`
> **Note**<br>
> We **strongly** recommend that you use [Github Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) to configure this Action.

```yaml
# C:\Users\dynamored\MyHandsomeProjet\.github\workflows\sftp-action.yml

on:
  pull_request:
    types:
      - closed
    branches:
      - 'main'
      - 'master'

# /\ When a pull request is merged onto 'main' or 'master' then:

jobs:
  sftp_project:
    runs-on: ubuntu-latest
    name: Send your latest writed files to your server
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: SFTP Upload
      uses: DynamoRed/dsftp-action@v1
      with:
        host: ${{ secrets.SFTP_Host }}				# The IP adress of your server.
        user: ${{ secrets.SFTP_User }}				# The name of the user you want to use to upload your files/folders.
        password: ${{ secrets.SFTP_Password }}			# The password of the user mentionned before.

        ## Paths:
        # Paths are written as objects (key/value) with key = local path and value = parent remote path.
        # For this exemple, src is a folder and README.md a file.

        paths: '{ "./src" : "/home/john/my_handsome_project", "./README.md" : "/home/john/my_handsome_projec" }'

        port: 22						# OPTIONAL -- The SFTP port of your server. DEFAULT: 22

        agent: ''						# OPTIONAL -- Path to your server SSH agent.
        key: ${{ secrets.SFTP_Key }}				# OPTIONAL -- Your SSH private key content.
        keyPassphrase: ${{ secrets.SFTP_Key_Passphrase }}	# OPTIONAL -- If your SSH private key defined just before is encrypted, write the passphrase here.
```

# 🛠️ Contribute

1. Fork this repository

2. Install dependencies

```
npm install
```

3. Build action
```
npm run build
```

4. Open a pull request to integrate your modifications

### 📃 License
[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
