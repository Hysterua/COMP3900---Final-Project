# Version: python:3.8
#
# Name: car_cleaning_addon.py
#
# Description: This file contains the web-scrapper used for the car cleaning service addon.
#
# Author: Jake Tyler

from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
import re


class Schmiko:

    # Pulls the current database of packages.
    @staticmethod
    def pull_schmicko_data():

        print("Running pull_schmicko_data")

        schmikoDatabase = []

        try:
            chrome_options = webdriver.ChromeOptions()
            driver = webdriver.Remote(command_executor="http://chrome-browser:4444", options=chrome_options)
            print("Web Driver has Started")
        except:
            print("Web Driver has broken and was returned")
            return []
        
        try:

            # browser initialses to the current pricing charts
            search_url = "https://www.schmicko.com.au/pricing-packages/"
            driver.get(search_url.format())
            print("Loaded Partner Website")

            # Gets the titles of all the packages that the company offers
            sleep(2)
            loadedHeaders = driver.find_elements(By.CLASS_NAME, "pricebox-header")
            for i in loadedHeaders:
                if len(i.text) != 0:
                    schmikoDatabase.append(i.text)

            print(f"Scrapped the pricebox-headers schmikodatabase is currently: {schmikoDatabase}")

            ##### Removing Inactive Li Variables #####
            # This section gets all the package features and removes any that
            # are designated as inactive.
            # On the webpage these are those that are not included in the
            # designated package.

            allLi = driver.find_elements(By.XPATH, "//ul")
            allLiText = []

            for i in allLi:
                if len(i.text) != 0:
                    allLiText.append(i.text)
            allLiText = allLiText[2:]

            print(f"Total Uls in the Page: {allLiText}")

            allLiActive = driver.find_elements(By.XPATH, "//ul//li[@class='active']")
            allLiActiveText = []

            for i in allLiActive:
                if len(i.text) != 0:
                    allLiActiveText.append(i.text)
            
            print(f"Total Active Li Uls in the Page: {allLiText}")

            c = 0
            for i in allLiActiveText:
                if i in allLiText[c] and i not in schmikoDatabase[c]:
                    schmikoDatabase[c] += "," + i
                else:
                    c += 1
                    schmikoDatabase[c] += "," + i
            
            print(f"Schmikodatabase is currently: {schmikoDatabase}")

            schmikoServices = []
            for srvString in schmikoDatabase:
                if match := re.search("^(.*) (\$\d+)\\n(.*)$", srvString):
                    service = {
                        "Title": match.group(1),
                        "Cost": match.group(2),
                        "Features": match.group(3),
                    }
                    print(service)
                    schmikoServices.append(service)

            driver.quit()

            return schmikoServices

        except:
            driver.quit()
            return []

    @staticmethod
    def find_schmiko_availability(date):

        print("Running find_schmiko_availability")

        # tries to start a chrome instance
        try:
            # At this point the only thing missing from the db is the current booking times
            chrome_options = webdriver.ChromeOptions()
            driver = webdriver.Remote(command_executor="http://chrome-browser:4444", options=chrome_options)
            print("Web Driver has Started")
        except:
            print("Web Driver has broken and was returned")
            return []
        
        # tries to run the commands on the partner webpage
        try:
            # browser initiallises to the url of the car wash "partner"
            search_url = "https://schmicko.bookingkoala.com/booknow/car_wash"
            driver.get(search_url.format())

            # The driver fills in the extra data fields on the booking page
            sleep(6)
            driver.find_element(By.XPATH, "//input[@ID='zipcode-value']").send_keys("2032")
            driver.find_element(By.XPATH,"//input[@class='form-control ng-untouched ng-pristine ng-invalid']",).send_keys("test@test.com")
            driver.find_elements(By.XPATH,"//span[@class='label-custom__inner vehicle-select-label-image d-flex align-items-center justify-content-center']",)[2].click()
            print("Car booking button should be pressed, and the fields are autofilled on the first page")
            sleep(1)

            # Clicks the button that comes up after the previous button
            driver.find_element(
                By.XPATH,
                "//button[@class='btn btn-outline-primary bk_custom_pkg_btn btn-lg btn-block']",
            ).click()
            sleep(1)

            driver.find_element(
                By.XPATH,
                "//button[@class='btn btn-primary btn-block btn-lg tjs-big-btn d-flex justify-content-center align-items-center']",
            ).click()

            sleep(3)

            driver.find_element(
                By.XPATH, 
                "//input[@ID='exampleFormControlInput1']"
            ).click()
            sleep(4)

            driver.find_element(
                By.XPATH,
                "//a[@class='tjs-next-arrow tjs-text_gray tjs-pointer slick-arrow tjs-hover-text__primary']",
            ).click()
            print("The arrow button has been pressed on the popup")

            sleep(2)
            driver.find_elements(
                By.XPATH,
                "//div[@class='tjs-bcalendar__day font-weight-bold bk-custom-border ng-star-inserted']//div[text()='30']",
            )[1].click()

            print("The date button has been pressed on the popup")

            sleep(2)
            textHold = driver.find_elements(
                By.XPATH,
                "//li[@class='tjs-dropdown__link dropdown-item d-flex justify-content-between tjs-pointer ng-star-inserted']//span",
            )

            bookingTimes = []

            for i in textHold:
                bookingTimes.append(i.get_attribute("innerHTML"))

            print(f"The requested booking times are {bookingTimes}")

            driver.quit()

            return bookingTimes

        except:
            driver.quit()
            return []


