import requests
from html.parser import HTMLParser
import json
import unicodedata
import re
import shutil
import codecs

class ICourHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self, convert_charrefs=False)
        self.inTitle = False
        self.inDesc = False
        self.desc = []
        self.inAddr = False
        self.inPrice = False
        self.course = {'title' : '', 'desc'  : '', 'addr'  : '',
                'price' : 0, 'pic': '', 'age_from': 0, 'age_to': 0}

    def beatify(self, string):
        return unicodedata.normalize('NFKC', string).strip()

    def handle_starttag(self, tag, attrs):
        if tag == 'h1' and len(attrs)>0 and attrs[0][1] == 'cardTitle':
            self.inTitle = True
        elif tag == 'div' and len(attrs)>0 and 'description__text' in attrs[0]:
            self.inDesc = True
        elif tag == 'div' and len(attrs)>0 and 'option_location_link' in attrs[0]:
            self.inAddr = True
        elif tag == 'div' and len(attrs)>0 and 'price-line__main-price' in attrs[0]:
            self.inPrice = True
        elif tag == 'img' and '/events_preview' in attrs[0][1]:
            pic = requests.get(attrs[0][1], stream=True)
            pic_url = pic.url[pic.url.rfind('/') + 1:]
            with open('uploads/' + pic_url, 'wb+') as p:
                shutil.copyfileobj(pic.raw, p)
            self.course['pic'] = pic_url
            del pic

    def handle_endtag(self, tag):
        if tag == 'h1' and self.inTitle:
            self.inTitle = False
        elif tag == 'div' and self.inDesc:
            self.inDesc = False
            self.course['desc'] = ' '.join(self.desc)
        elif tag == 'div' and self.inAddr:
            self.inAddr = False
        elif tag == 'div' and self.inPrice:
            self.inPrice = False

    def handle_data(self, data):
        if self.inTitle:
            self.course['title'] = data
        elif self.inDesc:
            self.desc.append(self.beatify(data))
        elif self.inAddr:
            self.course['addr'] = self.beatify(data)
        elif self.inPrice:
            self.course['price'] = int(self.beatify(data))


def getCourseByUrl(url):
    headers = {'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'}
    page = requests.get(url=url, headers=headers).text
    parser = ICourHTMLParser()
    parser.feed(page)
    return parser.course

print(getCourseByUrl('http://www.inlearno.ru/event/1633-detskii-yazykovoi-art-lager-top-kids/'))


