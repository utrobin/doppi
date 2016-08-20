import requests
from html.parser import HTMLParser
import json
import unicodedata
import re

class ScHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self, convert_charrefs=True)
        self.inDd = False
        self.inTitle = False
        self.result = []
        self.curNum = 0
        self.course = {'title' : '', 'phone' : '', 'desc'  : '', 'addr'  : '',
            'site'  : '', 'price' : [], 'time'  : [],}

    def beatify(self, string):
        return unicodedata.normalize('NFKC', string).strip()

    def handle_starttag(self, tag, attrs):
        if tag == 'title':
            self.inTitle = True
        elif tag == 'dd':
            self.inDd = True
        elif tag == 'a' and len(attrs)>=3:
            if 'tel-phone js-phone-number' in attrs[2]:
                self.course['phone'] = self.beatify(attrs[1][1])[4:]

    def handle_endtag(self, tag):
        if tag == 'title':
            self.inTitle = False
        elif tag == 'dd':
            self.inDd = False
            self.curNum += 1
            self.parse_dd()
            self.result = []

    def handle_data(self, data):
        if self.inTitle:
            self.course['title'] = self.beatify(data[:data.find('отзывы')-3])
        elif self.inDd and data.strip():
            self.result.append(data.strip())

    def parse_dd(self):
        if self.curNum == 1:
            for k in self.result:
                self.course['desc'] += self.beatify(k)+' '
            self.course['desc'] = self.course['desc'][:-1].replace('\n', '<br>')
        elif 'Адрес' in self.result:
            for k in self.result[2:]:
                self.course['addr'] += self.beatify(k)+' '
            self.course['addr'] = self.course['addr'][:-1]
        elif 'Официальный сайт' in self.result:
            self.course['site'] = self.beatify(self.result[-1])
        elif 'Время работы' in self.result:
            times = re.findall(r'([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]', self.beatify(self.result[1]))
            if len(times) >= 2:
                self.course['time'].extend([int(times[0][-2:]), int(times[1][-2:])])
        elif 'Цена годового абонемента' in self.result:
            self.course['price'] = [int(p) for p in self.beatify(self.result[-1]).split() if p.isdigit()]

def getCourseJson(url):
    headers = {'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'}
    page = requests.get(url=url, headers=headers).text
    parser = ScHTMLParser()
    parser.feed(page)
    return parser.course
