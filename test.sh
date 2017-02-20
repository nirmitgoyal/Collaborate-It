#!/bin/bash
# nam="print 'Hello World'"
# echo $nam
# source_="print 'Hello World'"
# lang="PYTHON"
# declare -A data
# data["source"]="print 'Hello World'"
# data["lang"]="PYTHON"
# data = {
#     # 'client_secret': CLIENT_SECRET,
#     'async': 1,
#     'source': source_,
#     'lang': "PYTHON",
#     'time_limit': 5,
#     'memory_limit': 262144,
# }
# echo $data["source"]
curl -i --data "source=s=2&lang=PYTHON&client_secret=30795ca791b2d0c65bd5e83751dc938057f994a7" https://api.hackerearth.com/v3/code/run/
