import single_course as sc
import requests
from html.parser import HTMLParser
import json
import unicodedata

class CcHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self, convert_charrefs=True)

    def handle_starttag(self, tag, attrs):
        if tag == 'a' and len(attrs)>=2 and 'js-item-url' in attrs[1]:
            print (sc.getCourseJson(attrs[0][1]))

    def handle_endtag(self, tag):
        pass

    def handle_data(self, data):
        pass

def getCourseCluster(url):
    headers = {'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'}
    page = requests.get(url=url, headers=headers).text
    parser = CcHTMLParser()
    parser.feed(page)


getCourseCluster('http://zoon.ru/msk/trainings/type/sektsiya_plavaniya')
