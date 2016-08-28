import requests
import unicodedata
from html.parser import HTMLParser
import re
import search.management.inlearno_course as ic

class IcHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self, convert_charrefs=True)
        self.courses = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a' and re.search(r'/event/[0-9]',attrs[0][1]):
            self.courses.append(ic.getCourseByUrl(attrs[0][1]))

    def handle_endtag(self, tag):
        pass

    def handle_data(self, data):
        pass

def getIc(url):
    headers = {'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'}
    page = requests.get(url=url, headers=headers).text
    parser = IcHTMLParser()
    parser.feed(page)
    return parser.courses

getIc('http://www.inlearno.ru/selected-events/education/?sub_section=33')
