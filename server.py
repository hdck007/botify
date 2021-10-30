# fetching a private Slack file with requests

import requests
import os

slack_token = 'xoxp-2644685501556-2635746027190-2647524212564-18ebc9cb3da48908dd421d13d8d33098'
url = 'https://files.slack.com/files-pri/T02JYL5ERGC-F02KYNU5PEV/download/vid_20200309154952.mp4'

res = requests.get(url, headers={f'Authorization': 'Bearer {slack_token}'})
res.raise_for_status()

with open('my_file.mp4', 'wb') as f:
    f.write(res.content)