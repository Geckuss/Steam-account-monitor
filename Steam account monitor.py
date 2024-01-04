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


def check_profile(profile_url):
    response = requests.get(profile_url)
    if response.status_code == 200:
        pagecontent = BeautifulSoup(response.text, 'html.parser')
        name_element = pagecontent.find('span', {'class': "actual_persona_name"})
        profile_data = name_element.text.strip() + "\n"
        status_element = pagecontent.find('div', {'class': "profile_in_game_header"})
        profile_data += status_element.text.strip() + "\n"
        status_detailed_element = pagecontent.find('div', {'class': "profile_in_game_name"})
        if status_detailed_element != None:
            profile_data += status_detailed_element.text.strip() + "\n"
        return profile_data

profile_url_list = [
    "https://steamcommunity.com/id/geckuss/",
    "https://steamcommunity.com/id/example_user/",
    "https://steamcommunity.com/profiles/76561198146060221",
    "https://steamcommunity.com/profiles/76561197994907256",
]
for profile_url in profile_url_list:
    print(check_profile(profile_url))

