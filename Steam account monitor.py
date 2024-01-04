import requests
from bs4 import BeautifulSoup

def check_name(profile_url):
    #Palauttaa syötetystä osoitteesta tilin nimen
    response = requests.get(profile_url)
    if response.status_code == 200:
        pagecontent = BeautifulSoup(response.text, 'html.parser')
        target_data = pagecontent.find('span', {'class': "actual_persona_name"})
        return target_data.text.strip()

def check_online_status(profile_url):
    #Tarkistaa tilin online-statuksen
    response = requests.get(profile_url)
    if response.status_code == 200:
        pagecontent = BeautifulSoup(response.text, 'html.parser')
        status_element = pagecontent.find('div', {'class': "profile_in_game_header"})
        status = status_element.text.strip()
        status_detailed_element = pagecontent.find('div', {'class': "profile_in_game_name"})
        status_detailed = status_detailed_element.text.strip()
        if status in ["Currently Offline", "Currently Online"]:
            return status
        else:
            #Jos tilillä pelataan jotain peliä, palautetaan myös pelin nimi
            return f"{status}:\n{status_detailed}"


# Test usage
profile_url = "https://steamcommunity.com/id/geckuss/"
username = check_name(profile_url)
online_status = check_online_status(profile_url)

print(username)
print(online_status)

