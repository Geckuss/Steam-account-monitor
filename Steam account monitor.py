import requests
from bs4 import BeautifulSoup
import threading


def check_profile(profile_url):
    #Request data
    response = requests.get(profile_url)
    if response.status_code == 200:
        #Get all profile data from url
        pagecontent = BeautifulSoup(response.text, 'html.parser')
        #Find name element
        name_element = pagecontent.find('span', {'class': "actual_persona_name"})
        #Add name to profile data variable
        profile_data = name_element.text.strip() + "\n"
        #Find profile status
        status_element = pagecontent.find('div', {'class': "profile_in_game_header"})
        #Add status to profile data variable
        profile_data += status_element.text.strip() + "\n"
        #Find details of profile status
        status_detailed_element = pagecontent.find('div', {'class': "profile_in_game_name"})
        #Check if any details were found
        if status_detailed_element != None:
            #Add detailed profile status to profile data variable
            profile_data += status_detailed_element.text.strip() + "\n"
        return profile_data

#List of profiles to monitor
profile_url_list = [
    "https://steamcommunity.com/id/geckuss/",
    "https://steamcommunity.com/id/example_user/",
    "https://steamcommunity.com/profiles/76561198146060221",
    "https://steamcommunity.com/profiles/76561197994907256",
]


for profile_url in profile_url_list:
    print(check_profile(profile_url))

